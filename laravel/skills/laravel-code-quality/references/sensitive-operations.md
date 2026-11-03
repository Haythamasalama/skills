# Sensitive operations

**Read when:** building something that must run at most once, needs a second person's approval, needs
a fresh password, writes an audit trail, exposes personal data, or touches a high-risk external resource.
**Owns:** once-only execution, idempotent decisions, separation of duties, approvals and overrides,
step-up confirmation, append-only audit logs, masking and bounded output, credentials and least privilege.
**See also:** [security.md](security.md) · lifecycles and transitions:
[laravel-ddd](../../laravel-ddd/references/models-scopes-abilities-enums.md)

## TL;DR

- A lifecycle is a state machine with guarded transitions; no bare `->update(['status' => …])`.
- **At most once** is enforced by an atomic conditional update that claims the row; the loser is a no-op.
- A decision (an approval, a vote) is stored once per (record, actor); repeating it never counts twice.
- Nobody approves their own request, whatever their rank. The check is server-side, in the transition guard.
- An emergency override skips **approval only**, never a safety check, and is recorded as an override.
- Sensitive actions ask for a fresh password or MFA, short-lived, verified on the server, audited.
- An audit log is append-only by contract, by model and ideally by database grant; it records denials too.
- Personal data is masked before it leaves the domain; output is capped; there is no bulk export by accident.
- A high-risk resource is reached through one seam, with the narrowest credentials that can do the job.

## Once-only execution

Double clicks, refreshes, client retries and queue retries after a worker dies are all normal. None may run
the operation twice.

```php
$claimed = Invoice::query()
    ->whereKey($id)
    ->where('status', InvoiceStatus::APPROVED)
    ->update(['status' => InvoiceStatus::SENDING]);

if ($claimed === 0) {
    return app(InvoiceContract::class)->recordedOutcome($id);
}
```

- The claim is one conditional `UPDATE`; only the caller whose update changed a row proceeds. A `SELECT`
  then `UPDATE` is a race.
- Terminal states (`SENT`, `FAILED`) are final; another call returns the recorded outcome.
- Jobs pass ids, reload, and re-check state before acting.
- Key idempotency to the specific record (and its approval), not to its content: a new, identical request
  is a new request with its own approval.
- Where the trigger is an external webhook or a client retry, store an idempotency key with a unique index
  and treat a duplicate as a replay.

## Idempotent decisions

Store one row per (record, actor) with a unique key; a second submission updates nothing and counts
nothing. The transition to "approved" counts **distinct, still-valid** decisions against the threshold.

## Separation of duties

```php
final class NotOwnRequest
{
    public function passes(Invoice $invoice, User $approver): bool
    {
        return $invoice->created_by !== $approver->id;
    }
}
```

Enforce it as a guard on the transition, on the server, every time, even if a client somehow sends the
request. Each person counts once toward the threshold. Owners and administrators are not exempt: the
gate exists so a second person looks.

## Approvals and overrides

- Model the review as states and transitions: `draft → pending → approved → running → done`, with
  `rejected`, `expired`, `failed` as terminal branches. Only `approved` (or a valid override) may enter
  `running`.
- Run automatic checks **before** a request reaches reviewers, so people judge intent, not malformed input.
- How many approvals, and who may give them, is policy data (by risk, by person, by resource), not
  constants in code. "May run here" and "may approve here" are separate grants; merging them quietly undoes
  separation of duties.
- Rejection needs a reason, is terminal, and notifies the requester.
- Expiry is a scheduled transition, so a half-reviewed request cannot be approved much later against a
  changed world.
- An **override** (break-glass) is its own guarded path into `approved`, never "threshold = 0". It is narrow
  (one record or one scope), granted to few, needs a written reason, notifies the people it stepped over,
  and is flagged distinctly in the audit trail and the UI. Everything after approval still runs.

## Step-up confirmation

- Ask for a fresh password or MFA right before a sensitive action (destructive writes, opening a privileged
  session), even though the user is signed in. It defends against a walked-away session or a stolen cookie.
- Valid for minutes and for a narrow scope, ideally one action. Not a mode for the day.
- Verified on the server at the moment of the action; never a client flag.
- Success and failure are both audited; repeated failures are a signal.
- It proves who is acting now. It never replaces approval, and approval never replaces it.
- Decide deliberately where it is **not** asked (an emergency override already gated by permission, reason
  and notice), and write the reason down.

## Append-only audit log

- One entry point (a helper or one Contract method) writes entries, so the actor default and the key names
  are decided once. Nothing else inserts into the table.
- The Contract has `record` and reads, nothing else; pin that list in a test so adding an update method
  fails the build.
- The model refuses changes: throw in `updating` / `deleting`, no `updated_at`, no soft deletes,
  `$guarded = ['*']` with fields set explicitly.
- The database refuses changes where it can: triggers on `UPDATE` / `DELETE`, and, strongest, an
  application database user with only `INSERT` and `SELECT` on that table (an operational task at deploy).
- Record every decision: successes, **denials**, overrides, step-up results, administrative changes.
  Mark which kinds are noteworthy (handing out access is; taking it away usually is not).
- Each entry: actor (nullable for the system), action enum, tenant ids (unconstrained, so history outlives
  the row), target ids, a bounded summary or diff, decision reasons, an override flag, `created_at`.
- Never store secrets or unmasked personal data in an entry; it is a record of intent, not a second copy
  of the data.
- Reading the log is itself a permission; every read is tenant-scoped.
- Say what the controls buy. Append-only with triggers is tamper-**resistant**. It is not
  tamper-**evident** unless entries are hash-chained and verified; do not describe it as "verifiable"
  otherwise.

## Personal data and bounded output

- Declare sensitive fields in a registry (table, column, strategy); never guess from values at runtime.
- Mask at one place on the way out (a Resource, a seam's output), before data reaches a page prop, a log,
  an export or an audit entry. Callers cannot opt out.
- Strategies are one-way (redact, keep last 4, keep the domain of an email, stable pseudonym, null).
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

## High-risk resources and credentials

- One domain touches the resource, behind one transport-agnostic Contract (scalars and DTOs in and out).
  Everything else asks that domain. See the layout skill's
  [architecture-and-folders.md](../../laravel-ddd/references/architecture-and-folders.md).
- Credentials are encrypted at rest, decrypted only inside that domain for one operation, never returned,
  logged, serialized or echoed in an error, and never in static config when they are per-customer.
- Least privilege at the resource itself: a read-only credential for reads, a scoped one for writes, no
  admin rights. App permissions and resource credentials then catch each other's gaps; the narrower wins.
- Writes run with a timeout, a cap on affected rows and a transaction that rolls back on any breach.
- A connection test never stores or echoes a plaintext secret. Rotation invalidates the old secret.
  Disabling a resource stops new and queued work at the seam.

## Test these hardest

Write adversarial tests for these paths: double submission, retries after a crash, self-approval, an
expired request, an override without a reason, a stranger's tenant, a masked field via filter tricks, an
update or delete against the audit table. A denied attempt is the expected result; a wrong allow is an
incident.
