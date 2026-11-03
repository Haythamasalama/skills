# Enums and states

**Read when:** writing a backed enum, resolving an enum from a request, adding a status or a transition to
an entity, making an operation run at most once, or protecting a form against double submission.
**Owns:** enum shape and helpers, case naming, `from` / `tryFrom` / `fromOrAbort`, enum-keyed lookup tables,
statuses and the state machine, once-only claims, request idempotency.

## TL;DR

- Enums are backed (`int` or `string`), live in `src/Domain/{Domain}/Enums/`, and use `BaseEnum`.
- **Case names are `UPPER_SNAKE_CASE`**, in every enum. String values are `snake_case`.
- Instance methods are pure `match ($this)` maps (`label()`, `color()`, `icon()`), callable with no
  arguments, with no `default` arm on a status enum.
- `Enum::from()` for values the code produced; `Enum::fromOrAbort()` for values a request produced.
- A status changes only through a transition, run by an Action. Never a bare `update(['status' => …])`.
- Status and transition are two enums; each transition declares its from-statuses, target, guards and
  permissions in one state-machine class.
- An ability returns a `bool` for show/hide; the state machine's result carries the *reason*.
- Check and write in one atomic step: a conditional update or a row lock. A check-then-update races.
- A state-changing form takes an idempotency key; a state-changing GET becomes a POST.

## Enum shape

```php
namespace Domain\Billing\Enums;

enum InvoiceStatus: int
{
    use BaseEnum;

    case DRAFT = 1;
    case ISSUED = 2;
    case PAID = 3;
    case CANCELLED = 4;

    public function label(?string $locale = null): string
    {
        return __("enums.invoice_status.{$this->name}", locale: $locale);
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::ISSUED => 'orange',
            self::PAID => 'green',
            self::CANCELLED => 'red',
        };
    }
}
```

- `int` backing for statuses stored in a column (smaller, sorts in lifecycle order); `string` for verbs and
  for values that travel in URLs or payloads. A string value must fit its column; check the width when you
  add a case.
- **`UPPER_SNAKE_CASE` case names, one style everywhere.** Why: a mixed codebase makes every reader guess
  `Paid` or `PAID`, and the label keys are built from `$this->name`.
- `label()` reads translations keyed by the **case name**, so a value change never orphans a label. Take an
  optional locale for exports and messages rendered in a fixed language.
- `color()` returns a design-system token name, never hex or a CSS class. The status → colour map lives on
  the enum, never per page.
- No `default` arm in a `match` over a status enum. Why: adding a case then fails loudly
  (`UnhandledMatchError`) in tests until every helper covers it.
- Separate wordings are separate methods (`label()`, `documentLabel()`); no `$style` parameter.

## `BaseEnum` helpers

The trait is defined in [core-kernel.md](core-kernel.md). What callers use:

| Method | Use |
|---|---|
| `values()` | backing values for validation: `Rule::in(InvoiceStatus::values())`, or `Rule::enum(InvoiceStatus::class)` |
| `all()` / `only([...])` / `except([...])` | each case as an object with every instance method's result folded in, for dropdowns and badges |
| `isListed($value)` | membership without building a case; strict comparison, so `'1'` is not `1` |
| `fromName()` / `tryFromName()` | lookup by case name |
| `fromOrAbort($value, 404)` | `tryFrom($value) ?? abort(404)` at a request boundary |

Because `all()` calls every non-static method on each case, every instance method must be cheap, free of
side effects, and callable with no arguments (give a parameter a default). Why: a method with a required
argument breaks every dropdown built from `all()`.

## What never goes in an enum

`auth()`, `request()`, `session()`, queries, `Cache::`, permission checks, `->save()`, events, jobs, or
`config()` that differs per environment. An enum knows what `PAID` **is**, not who may see it or what
happens next.

| Rule | Goes in |
|---|---|
| Which statuses a user may see | an Ability or a Policy |
| Which status this record may move to | the state machine, surfaced through an Ability |
| What happens when an invoice becomes paid | the Action of that transition, or a listener on its event |
| Which values an endpoint accepts | the Form Request: `Rule::in(InvoiceStatus::values())` |
| Which cases a dropdown shows for a role | the controller or a read Action: `InvoiceStatus::except([...])` |

## `from`, `tryFrom`, `fromOrAbort`

```php
// ❌ a retired or invalid value in the URL becomes a 500
$status = InvoiceStatus::from($request->route('status'));

// ❌ correct, but boilerplate every time
$status = InvoiceStatus::tryFrom($value);
abort_if($status === null, 404);

// ✅
$status = InvoiceStatus::fromOrAbort($request->route('status'));
```

Route parameters, query strings, bodies, stale bookmarks and rows written by older code can all hold a
value the enum no longer has. Inside the domain, on values the code itself produced, `from()` is right: a
miss there is a bug that should throw.

## Enums in collections

```php
// ❌ an enum case never == its backing value; this matches nothing, silently
$invoices->where('status', InvoiceStatus::PAID->value);

// ✅ compare the case
$invoices->where('status', InvoiceStatus::PAID);
```

Query builders accept either form; the trap is in-memory collections of enum-cast models.

## Retiring a case

When an enum's values are real row ids (seeded lookup rows, modules, entity types), removing the case also
deletes the row in a migration ([migrations.md](migrations.md#seeded-reference-rows)). If the row cannot go,
keep the case and stop offering it (`except([...])`). Why: an orphan value resolved through `from()` throws
on the first page that renders it.

## Naming the variable

When an enum's short name collides with a model's (`EntityType` enum vs `EntityType` model), suffix the
variable: `$entityTypeEnum` for the case, `$entityType` for the row.

## Enum-keyed lookup tables

Many small "kinds" of managed text (FAQ groups, static pages, reason lists) share one table keyed by a
`type` enum, with a translated name ([models.md](models.md#translated-names)), an optional `slug`, and
type-specific attributes in an `options` JSON column backed by an options DTO.

- A new type is an enum case plus its labels. No table, no migration.
- A type-specific value goes in `options`. It gets a real column only when it must be indexed or joined.
- A type gets its own table when its rows need real columns (a price, a foreign key, a status).
- The filter DTO **requires** `type`, so no query can read across types; fetching one row also goes
  through the filter, so an id of another type is a 404.
- Soft or force delete is a per-type answer on the enum (`isRestorable()`); restorable only when the screen
  lists deleted rows and offers restore.
- Pin `type` server-side and never spread `$request->all()` into this filter: it carries `with_trashed`.

## Statuses and the state machine

Model a lifecycle explicitly once users act on an entity's statuses. Why: the allowed moves, their guards
and their side effects then live in one class instead of in every controller that changes the status.

| Piece | Location | Role |
|---|---|---|
| `{Entity}Status` enum (`int`) | `Enums/` | the states; `isInitial()`, `isTerminal()` |
| `{Entity}Transition` enum (`string`) | `Enums/` | the verbs: `ISSUE = 'issue'`, `CANCEL = 'cancel'` |
| `{Entity}StateMachine` | `Actions/StateMachine/` | declares every transition |
| Guard classes | `Actions/StateMachine/Conditions/` | one rule each; return allow, or deny with a translated reason |
| `HasStateMachine` trait | on the entity | `canTransition()`, `checkTransition()`, `executeTransition()`, `availableTransitions()`, `isInAnyStatus()` |
| Transition result | kernel DTO | `allowed`, `executed`, `reasons`, `summary()`, `dueToStatus()`, `dueToOnlyConditions()`, `dueToPermissions()` |

```php
final class InvoiceStateMachine extends AbstractStateMachine
{
    protected function registerTransitions(): void
    {
        $this->addTransition((new TransitionDefinition(InvoiceTransition::ISSUE))
            ->from(InvoiceStatus::DRAFT)
            ->to(InvoiceStatus::ISSUED)
            ->condition([HasLinesCondition::class, HasCustomerTaxIdCondition::class]));

        $this->addTransition((new TransitionDefinition(InvoiceTransition::CANCEL))
            ->from([InvoiceStatus::DRAFT, InvoiceStatus::ISSUED])
            ->to(InvoiceStatus::CANCELLED)
            ->condition(HasNoPaymentsCondition::class)
            ->permission('invoices.cancel'));

        $this->addTransition((new TransitionDefinition(InvoiceTransition::SEND_REMINDER))
            ->from(InvoiceStatus::ISSUED)
            ->soft());
    }
}
```

- **One rule per guard class.** Why: the result can then say *which* rule failed
  (`dueToOnlyConditions(HasNoPaymentsCondition::class)`), and an ability can make an exception for one.
- **Soft transitions** (`->soft()`): same from-statuses, guards and permissions, but no status write and
  no history; only events fire. Use one for an action that is legal in a status without changing it
  (send a reminder, issue a document), so the rule "when is this allowed" still lives in one place.
- `executeTransition()` checks, writes the status, records history and fires events in one transaction,
  and throws when the transition is not allowed.
- Call transitions from the Action that owns the operation, never from a controller or another domain.
  The Action's own transaction wraps everything else it writes ([actions.md](actions.md)).

```php
final class CancelInvoice
{
    public static function handle(Invoice $invoice, CancelInvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($invoice, $data) {
            $invoice = Invoice::query()->lockForUpdate()->findOrFail($invoice->id);
            $check = $invoice->checkTransition(InvoiceTransition::CANCEL, ['user' => $data->user]);

            throw_unless($check->allowed, InvoiceException::cannotCancel($check->summary()));

            $invoice->update(['cancel_reason' => $data->reason]);
            $invoice->executeTransition(InvoiceTransition::CANCEL, ['user' => $data->user]);

            return $invoice;
        });
    }
}
```

The `lockForUpdate()` re-read makes the check and the write see the same row. Why: two concurrent cancels
both pass a check made on a stale model, and both run the side effects.

### Abilities over the state machine

| Need | Use |
|---|---|
| Hide a button when the action is not available | an ability: `$invoice->ability('cancel')` |
| Always show the button and explain on click | `checkTransition()` → `summary()` / `reasons` in a 422 or a flash |
| A state-machine answer with one business exception | an ability that wraps the result |

```php
public function cancel(): bool
{
    $result = $this->invoice->checkTransition(InvoiceTransition::CANCEL);

    return $result->allowed || $result->dueToOnlyConditions(HasNoPaymentsCondition::class);
}
```

The ability shape itself lives in [models.md](models.md#abilities). Send `availableTransitions()` (or the
ability flags) to the page from the server, so the UI never offers a move the Action will refuse.

## Once-only claims

An operation that must happen at most once (issue a number, send a payment, post to a ledger) claims the
row with a conditional update and stops when nothing changed:

```php
$claimed = Invoice::query()
    ->whereKey($invoice->id)
    ->where('status', InvoiceStatus::DRAFT)
    ->update(['status' => InvoiceStatus::ISSUING]);

if ($claimed === 0) {
    return $invoice->refresh();
}
```

The second caller gets `0` and returns. Why: the database applies the `WHERE` and the `SET` atomically; an
`if ($invoice->status === DRAFT)` check in PHP lets two requests both pass. This conditional write is the
one status write allowed outside the state machine, and it lives inside the Action that owns the transition.

- Use an intermediate status (`ISSUING`) when the work after the claim calls an outside service, so a crash
  leaves a visible row to retry, not a silent half-done one.
- When the guard is not one row's status (a nightly run, a per-customer recalculation), take a named
  cache lock around the transaction: `Cache::lock("invoice-recalc:{$customerId}", 60)->block(10, fn () =>
  DB::transaction(...))`, and turn a lock timeout into a domain exception the caller can show.
- A uniqueness rule that must never break (one payment per external reference) also gets a unique index;
  the claim is the fast path, the index is the guarantee.

## Request idempotency

Double clicks, back-button re-posts and dropped connections resubmit the same form. Protect every
state-changing form where a duplicate is harmful (payments, invoices, ledger entries):

- A middleware on the route dedupes by an `idempotency_key` field; the form renders that key as a hidden
  input generated **on the server**, so plain and AJAX submits both carry one. The middleware alone does
  nothing when the key is missing; add both pieces together.
- The cache key is scoped to the user and includes a hash of the payload (minus the key, `_token` and
  `_method`). Why: one user can never read another's cached response, and an edited resubmit runs fresh.
- 2xx and 3xx are cached and replayed with a marker header; 4xx is **not** cached, so a corrected form
  re-validates; 5xx is cached as a failure and replays the real status, never a 200.
- Only POST, PUT and PATCH are covered. A GET that changes state gets no protection: make it a POST.
- List the idempotency middleware before other gates on the route, so a replay returns the cached response
  without re-running them.
- Server dedup works for every form; recovering after a dropped connection (polling for "saved or not")
  needs a JS submit. Reserve that for money movement.

Route and middleware wiring: [http.md](http.md).

## Verify

```bash
# Enums without BaseEnum
grep -rL 'use BaseEnum' src/Domain/*/Enums/*.php

# Case names not in UPPER_SNAKE_CASE
grep -rnE '^\s+case [A-Z][a-z][A-Za-z0-9]*\s*(=|;)' src/Domain/*/Enums/

# Request, auth, queries or writes inside enums
grep -rnE "auth\(|Auth::|request\(|session\(|::where\(|->save\(|->update\(" src/Domain/*/Enums/

# Enum::from on request input in Presentation
grep -rnE '::from\(\$(request|id|validated)' src/Presentation/

# Bare status writes outside the state machine (review each)
grep -rnE "update\(\[[^]]*'status' =>" src/Domain/ src/Presentation/ | grep -v StateMachine
```
