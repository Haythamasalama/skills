# Sensitive operations

**Read when:** building an operation whose mistake is costly or hard to undo — a refund, a payout, a
price change, a data export, granting access — or anything that must run at most once, needs a second
person's approval, a fresh password, or an audit trail.
**Owns:** duplicate-submit protection, once-only execution, idempotent decisions, separation of duties,
maker-checker approvals and overrides, step-up confirmation, append-only audit logs, masking and bounded
output, credentials for external providers.

## TL;DR

- A lifecycle is a state machine with guarded transitions; no bare `->update(['status' => …])`.
- A form that must not run twice carries a server-issued key, checked by middleware. Both halves, always.
- **At most once** is enforced by an atomic conditional update that claims the row; the loser is a no-op.
- A decision (an approval, a vote) is stored once per (record, actor); repeating it never counts twice.
- Nothing is written while a change waits for approval. The pending change holds the payload.
- Nobody approves their own request, whatever their rank. The check is server-side, in the transition guard.
- An emergency override skips **approval only**, never a safety check, and is recorded as an override.
- Sensitive actions ask for a fresh password or MFA, short-lived, verified on the server, audited.
- An audit log is append-only by contract, by model and ideally by database grant; it records denials too.
- Personal data is masked before it leaves the server; output is capped; there is no bulk export by accident.

## Duplicate-submit protection

Double clicks, back-button re-posts, refreshes and dropped connections all resend a form. For any
create or update where a duplicate does harm (a refund, an invoice, a ledger entry), use two pieces:

1. **A key in the form**, rendered by the server at page render (a UUID in a hidden input). A server-side
   key works for plain and AJAX forms alike.
2. **Middleware on the route** that stores the outcome under that key and replays it for a repeat.

Middleware with an empty key does nothing, and the two halves live in different files, so they drift.
Add them together and test them together.

| Handler result | Stored? | A repeat gets |
|---|---|---|
| 2xx / 3xx | yes, for a bounded time | the stored response, marked as a replay (a response header) |
| 4xx (validation) | no | a fresh run, validated against current rules |
| 5xx / exception | yes, as failed | the real error status, never a 200 |
| a file or stream body | no | a fresh run |

- Scope the stored key to the user, so one user can never read another user's stored response.
- Hash the payload into the key (minus volatile fields such as the CSRF token): an edited resubmit is a new
  request. For a pure create, an edit then creates a second record, which is intended.
- Put the duplicate-submit middleware before other gates on the route, so a replay returns the stored
  response without re-running them.
- Only `POST`, `PUT` and `PATCH` are protected. A `GET` that changes state gets nothing; make it a `POST`.
- In the browser: one in-flight submit per key, a bounded status poll after a dropped connection, and a
  retry only when the user asks. Never resend automatically.

## Once-only execution

Retries after a worker dies and webhooks delivered twice are normal too. None may run the operation twice.

```php
$claimed = Refund::query()
    ->whereKey($id)
    ->where('status', RefundStatus::APPROVED)
    ->update(['status' => RefundStatus::SENDING]);

if ($claimed === 0) {
    return app(RefundContract::class)->recordedOutcome($id);
}
```

- The claim is one conditional `UPDATE`; only the caller whose update changed a row proceeds. A `SELECT`
  then `UPDATE` is a race.
- Terminal states (`SENT`, `FAILED`) are final; another call returns the recorded outcome.
- Jobs pass ids, reload, and re-check state before acting.
- Key idempotency to the specific record (and its approval), not to its content: a new, identical request
  is a new request with its own approval.
- Where the trigger is an external webhook or a client retry, store the sender's idempotency key with a
  unique index and treat a duplicate as a replay.

## Idempotent decisions

Store one row per (record, actor) with a unique key; a second submission updates nothing and counts
nothing. The transition to "approved" counts **distinct, still-valid** decisions against the threshold.

## Separation of duties

```php
final class NotOwnRequest
{
    public function passes(Refund $refund, User $approver): bool
    {
        return $refund->requested_by !== $approver->id;
    }
}
```

Enforce it as a guard on the transition, on the server, every time. Each person counts once toward the
threshold. Owners and administrators are not exempt: the gate exists so a second person looks. A
permission to stand in for an absent approver never lets anyone decide their own request.

## Approvals (maker-checker)

- **Hold, then apply.** While a change waits, nothing is written to the record. The request stores a
  JSON-safe payload; on final approval, the payload is replayed through the record's **normal** create or
  update path with a flag that skips the approval check, and the record is attributed to the requester,
  not the approver.
- Store uploads before holding the change and put their paths in the payload. An uploaded-file object
  cannot survive a JSON column.
- Approval is opt-in per request type. No workflow matching the requester means the write happens
  directly. An explicit exemption wins over any workflow, so a new workflow never silently re-captures
  someone exempted on purpose.
- Approvers are resolved when the request is raised (line manager, a named person, a role). If one cannot
  be resolved, raising the request fails; it never skips the step.
- How many approvals, and who may give them, is data (by type, by risk, by person), not constants in code.
  "May do this" and "may approve this" are separate grants; merging them undoes separation of duties.
- Model the review as states: `pending → approved | rejected | cancelled | expired`, then the operation's
  own `running → done | failed`. Only `approved` (or a valid override) may enter `running`.
- Run automatic checks **before** a request reaches reviewers, so people judge intent, not malformed input.
- Ask the approval service which step a viewer may act on. Never decide it in a view by comparing ids.
- A second save by the same requester while a request is pending revises that request; it never opens a
  second chain. Approvers only ever see the latest intent.
- The payload stays editable while pending or after a rejection, by the requester (and by the current
  approver while pending). One approval anywhere in the chain freezes it.
- Rejection needs a reason, notifies the requester, and is reopened by resubmitting, not replaced, so the
  history reads as one timeline. Only the requester resubmits.
- Expiry is a scheduled transition, so a half-reviewed request cannot be approved much later against a
  changed world. Deleting the record closes its pending requests.
- To show what changed, take the before-state from the record using the payload's own keys, and normalise
  numbers and blanks (`"14.50"` vs `14.5`, `null` vs `''`) before comparing. A hard-coded key list drifts,
  and a later form field reads as "changed" on every update.

## Overrides

An **override** (break-glass) is its own guarded path into `approved`, never "threshold = 0". It is narrow
(one record or one scope), granted to few, needs a written reason, notifies the people it stepped over,
and is flagged distinctly in the audit trail and the UI. Everything after approval still runs.

## Step-up confirmation

- Ask for a fresh password or MFA right before a sensitive action (a large refund, an export of personal
  data, granting an administrator role), even though the user is signed in. It defends against a
  walked-away session or a stolen cookie.
- Valid for minutes and for a narrow scope, ideally one action. Not a mode for the day.
- Verified on the server at the moment of the action; never a client flag.
- Success and failure are both audited; repeated failures are a signal.
- It proves who is acting now. It never replaces approval, and approval never replaces it.
- Decide deliberately where it is **not** asked (an override already gated by permission, reason and
  notice), and write the reason down.

## Append-only audit log

- One entry point (a helper or one service method) writes entries, so the actor, the request IP and the
  key names are filled once. Nothing else inserts into the table.
- The service has `record` and reads, nothing else; pin that list in a test so adding an update method
  fails the build.
- The model refuses changes: throw in `updating` / `deleting`, no `updated_at`, no soft deletes,
  `$guarded = ['*']` with fields set explicitly.
- The database refuses changes where it can: triggers on `UPDATE` / `DELETE`, and, strongest, an
  application database user with only `INSERT` and `SELECT` on that table (an operational task at deploy).
- Record every decision: successes, **denials**, overrides, step-up results, administrative changes.
  Mark which kinds are noteworthy (handing out access is; taking it away usually is not).
- Each entry: actor (nullable for the system), an action key, tenant ids (no foreign key, so history
  outlives the row), target ids, a bounded summary or diff, decision reasons, an override flag,
  `created_at`.
- Action keys are stored and filtered on: never rename an existing one; add a new key instead.
- A link in an entry is rebuilt when read, and shown only if the reader may open that page; otherwise the
  entry renders as plain text.
- Never store secrets or unmasked personal data in an entry; it is a record of intent, not a second copy
  of the data.
- Reading the log is itself a permission; every read is tenant-scoped.
- Say what the controls buy. Append-only with triggers is tamper-**resistant**. It is not
  tamper-**evident** unless entries are hash-chained and verified; do not describe it as "verifiable"
  otherwise.

## Personal data and bounded output

- Declare sensitive attributes once, in code, next to the model (a list or a cast), with how each is
  masked. Never guess from values at runtime.
- Mask at one place on the way out (an API Resource, an export builder), before data reaches a page, a
  log, a file or an audit entry. Callers cannot opt out.
- Masks are one-way (redact, keep the last 4 digits, keep an email's domain, a stable pseudonym, null).
  A masked value does not reveal the original's length.
- When two sensitive sources feed one output, apply the strictest rule. When provenance is unknown,
  treat the value as sensitive.
- Filters can leak what output hides: refuse partial-match operators (`LIKE`, ranges) on masked fields.
- A blank scope on a **protection** rule widens the protection (safe default). A blank scope on a
  **permission** widens access and must be deliberate. Never reason about the two the same way.
- Cap rows and bytes on every read; paginate; truncate with a visible notice. No "download everything"
  unless it is its own approved, audited feature.
- Review every new feature as a possible leak channel: exports, verbose errors, debug dumps, unbounded
  endpoints, report generators.

## External providers and credentials

- One module talks to each external provider (a payment gateway, a payout bank), behind one interface
  that takes and returns plain values and DTOs. Everything else asks that module.
- Credentials are encrypted at rest, decrypted only inside that module for one call, never returned,
  logged, serialized or echoed in an error.
- Least privilege at the provider: a read-only key for reads, a scoped key for writes, no admin rights.
  App permissions and provider scopes then catch each other's gaps; the narrower wins.
- Calls that move money or data run with a timeout and a cap (amount, rows), and record the outcome before
  anything else reads it.
- Rotation invalidates the old secret. Disabling a provider stops new and queued work at that module.

## Test these hardest

Write adversarial tests for: double submission, a replay with an edited payload, retries after a crash,
self-approval, an approver standing in for themselves, an expired request, an override without a reason,
a stranger's tenant, an empty visibility list, a masked field reached through a filter, an update or
delete against the audit table. A denied attempt is the expected result; a wrong allow is an incident.
