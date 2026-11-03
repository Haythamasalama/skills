# Actions

**Read when:** writing or reviewing an Action.
**Owns:** the `final class` + `public static function handle()` shape, naming, grouping, DTO input,
transactions, locks, exceptions, resolving dependencies, and the CRUD templates.
**See also:** [contracts-and-services.md](contracts-and-services.md) · [dtos.md](dtos.md) ·
[core-kernel.md](core-kernel.md) · [queries.md](queries.md)

## TL;DR

- `final class X { public static function handle(...) }`. Stateless. **Never a constructor.**
- One Action, one operation. Names: `Get{Entity}`, `Get{Entity}s`, `Create{Entity}`, `Update{Entity}`,
  `Delete{Entity}`, or the natural verb (`IssueInvoice`, `ApplyDiscount`). No `Action` suffix.
- `Get{Entity}s` extends `GetDataAbstract` and is built through `::for()`.
- The payload travels as a `*Data` DTO. The entity it acts on stays a plain parameter.
- **Never validate inside an Action.** That is the Form Request's job.
- A write that touches more than one row runs in `DB::transaction()`.
- Other domains are reached inside `handle()` with `app(SomeContract::class)`.
- The Action owns the Eloquent query. Services, controllers, jobs and commands never do.
- Orchestration (several Actions, loops, payload parsing) is an Action too, never a Service.

## The shape

```php
// ✅
final class GetInvoice
{
    public static function handle(int $id): ?Invoice
    {
        return Invoice::query()->find($id);
    }
}

GetInvoice::handle($id);
```

```php
// ❌ instantiated, instance method, injected dependency, suffix
class CreateInvoiceAction
{
    public function __construct(private CustomerService $customers) {}

    public function execute(array $input): Invoice { /* ... */ }
}
```

Why static and constructor-free: an Action can be called from a Service, a job, a command, a listener or
a test with no container wiring, and it cannot hold state between calls. A constructor also invites
injecting Contracts, which hides what a call needs.

## Naming and grouping

| Kind | Name |
|---|---|
| Read one | `GetInvoice` |
| Read many (filtered, paginated) or an aggregate | `GetInvoices`, `GetInvoiceTotalsByStatus` (both extend `GetDataAbstract`) |
| Insert | `CreateInvoice` |
| Partial update | `UpdateInvoice` |
| Remove | `DeleteInvoice` |
| Domain operation | `IssueInvoice`, `CancelInvoice`, `RecalculateInvoiceTotal`, `SendInvoiceReminder` |

The namespace `Domain\{Domain}\Actions\` already says "Action". When a domain holds several entities,
group by entity: `Actions/Invoice/CreateInvoice.php`, `Actions/Payment/RefundPayment.php`. Why: a folder
per entity keeps forty Actions findable; the class name still says what it does.

## Every Action takes a DTO

```php
// ✅ one typed payload; adding a field touches one class
UpdateCustomer::handle($customer, UpdateCustomerData::fromArray($request->validated()));

// ❌ loose scalars drift out of sync with every caller
UpdateCustomer::handle($customer, $name, $email, $phone);
```

Prefer one `UpdateCustomer` with an all-nullable `UpdateCustomerData` over `UpdateCustomerName` +
`UpdateCustomerEmail`. Why: the write rules (only sent keys, reset `email_verified_at` when the address
changes) then live in one place. An Action that receives a raw external payload (a webhook body) takes it
as a typed `array` with a PHPDoc shape and builds DTOs itself.

## Never validate in an Action

```php
// ❌ the domain re-validates what the boundary owns
final class CreateCustomer
{
    public static function handle(array $input): Customer
    {
        Validator::make($input, [...])->validate();
        // ...
    }
}
```

When a package owns the route and hands you a raw array with no Form Request in the path (an auth
package's "create user" hook), that adapter is framework glue. Put it in `app/`, validate there, and call
the Action. Why: it keeps validation out of `src/Domain/`. Checking a **business** rule ("an issued invoice
cannot be edited") is not validation; it belongs in the Action or the entity's Abilities, and fails with a
domain exception.

## Transactions

Any Action that writes more than one row wraps the writes in a transaction. Read-only Actions do not.

```php
// ❌ the invoice is committed even when a line fails
$invoice = Invoice::create([...]);
$invoice->lines()->createMany([...]);

// ✅ atomic
return DB::transaction(function () use ($data) {
    $invoice = Invoice::create((clone $data)->exclude(['lines'])->toArray());
    $invoice->lines()->createMany(array_map(fn (InvoiceLineData $line) => $line->toArray(), $data->lines));

    return $invoice;
});
```

- Jobs and events that must only run on success are dispatched after commit; how a job does that is in
  [architecture.md](architecture.md#jobs).
- Calling a remote system inside the transaction is right when the local row must not exist without the
  remote one: if the remote refuses, throw and the row rolls back. Send your own id as the remote's
  external id. Why: a retry after a lost answer then finds the same remote record instead of making two.
- Never wrap a slow remote call in a transaction that holds hot rows locked. Queue it instead.

## Concurrency

| Risk | Use |
|---|---|
| Two requests run the same operation on one record (double approve, double pay) | `LockTransactionRunner::run('invoice_pay', (string) $invoice->id, fn () => ...)` |
| A gapless number per key (invoice numbers) | `app(SequenceContract::class)->incrementCount("invoice:{$year}")` |
| Read, then write based on what was read | `->lockForUpdate()` on the read, inside the transaction |

Why: a transaction alone does not stop two requests reading the same "pending" status and both acting on
it. The helpers are in [core-kernel.md](core-kernel.md#concurrency-helpers).

## Failing

```php
if (! $invoice->ability('canIssue')) {
    throw InvoiceException::cannotIssue();
}
```

An Action throws a domain exception with a named constructor; it never returns a response, a redirect or
`false` for failure. Why: the exception renders the right status and message for JSON and pages alike
([core-kernel.md](core-kernel.md#exceptions)). Add `@throws` to the docblock only when the signature cannot
say it.

## Resolving dependencies

```php
final class IssueInvoice
{
    public static function handle(Invoice $invoice): Invoice
    {
        return DB::transaction(function () use ($invoice) {
            $customer = app(CustomerContract::class)->getCustomer($invoice->customer_id);
            $number = NextInvoiceNumber::handle();

            $invoice->update(['number' => $number, 'status' => InvoiceStatus::ISSUED, 'issued_at' => now()]);

            app(LedgerContract::class)->recordReceivable($invoice->id, $customer->id, $invoice->total);

            SendInvoicePdf::dispatch($invoice);

            return $invoice;
        });
    }
}
```

- `NextInvoiceNumber` and `SendInvoicePdf` are in the same domain, so they are imported directly.
- `CustomerContract` and `LedgerContract` are other domains, so they go through `app()`.
- Who is acting comes from `app(CurrentUser::class)`, never `auth()`
  ([architecture.md](architecture.md#who-is-acting)).

## Orchestration belongs in an Action

When an operation calls several Actions or Contracts, loops over input, or parses a payload, that is an
Action (often a domain verb). The Service method stays a one-line delegation to it.

```php
final class ProcessPaymentWebhook
{
    /** @param array<int, array{type: string, payment_id: string}> $events */
    public static function handle(array $events): void
    {
        foreach ($events as $event) {
            match ($event['type']) {
                'payment.succeeded' => MarkPaymentPaid::handle($event['payment_id']),
                'payment.failed' => MarkPaymentFailed::handle($event['payment_id']),
                default => null,
            };
        }
    }
}
```

Why: a loop buried in a Service cannot be reused from a job or command without going through the whole
Contract stack, and it is the one layer tests rarely cover.

## Private helpers over single-use classes

A step that only one Action needs stays a `private static` method in that Action. A new Action earns its
file through real reuse (more than one caller), not readability alone.

## Templates

```php
final class Get{Entity}
{
    public static function handle(int $id): ?{Entity}
    {
        return {Entity}::query()->find($id);
    }
}
```

When callers look one up by something other than the id, widen the same Action instead of adding
`Get{Entity}ByNumber`:

```php
public static function handle(?int $id = null, ?Filter{Entity}Data $filters = null, array $withRelations = []): ?{Entity}
{
    if ($id === null && $filters === null) {
        return null;
    }

    return {Entity}::query()->with($withRelations)->when($id, fn (Builder $query) => $query->whereKey($id))->filterBy($filters)->first();
}
```

```php
final class Get{Entity}s extends GetDataAbstract
{
    public function query(): Builder
    {
        return {Entity}::query()->filterBy($this->data);
    }
}

final class Create{Entity}
{
    public static function handle(Create{Entity}Data $data): {Entity}
    {
        return {Entity}::create($data->toArray());
    }
}

final class Update{Entity}
{
    public static function handle({Entity} $entity, Update{Entity}Data $data): {Entity}
    {
        return DB::transaction(function () use ($entity, $data) {
            $entity->update((clone $data)->exclude(['lines'])->excludeUnsent()->toArray());

            if ($data->isSent('lines')) {
                $entity->lines()->createOrUpdateOrDelete(array_map(fn (LineData $line) => $line->toArray(), $data->lines));
            }

            return $entity;
        });
    }
}

final class Delete{Entity}
{
    public static function handle({Entity} $entity): void
    {
        $entity->delete();
    }
}
```

- `Get{Entity}s` returns a builder holder, not rows; the caller picks `pagination()`, `collection()` or
  `count()` ([core-kernel.md](core-kernel.md#getdataabstract)). An aggregate (`GetInvoiceTotalsByStatus`)
  uses the same base with `select()` and `groupBy()` in `query()`.
- `Update{Entity}` writes only the keys the caller sent, so an explicit `null` clears a column and an absent
  key is left alone. Clone before narrowing, because the helpers change the same instance. Why and the
  rest of the sent-keys API: [dtos.md](dtos.md).
- `Create{Entity}` with children cuts them out with `exclude([...])` and writes them in the same
  transaction, as in the Transactions section.
- `find()` returning `null` vs `findOrFail()` throwing a 404: pick per Action and let the return type say
  it (`?Invoice` vs `Invoice`).

## Where Actions live

`src/Domain/{Domain}/Actions/{Name}.php` or `Actions/{Entity}/{Name}.php`, one class per file.

## Verify

```bash
# Actions with a constructor
grep -rln "function __construct" src/Domain/*/Actions/

# Entry points that are not public static handle()
grep -rnE "function (handle|execute|__invoke|run)\(" src/Domain/*/Actions/ | grep -v "public static function handle"

# Validation or the session inside the domain
grep -rnE "Validator::|auth\(|request\(\)" src/Domain/ --include='*.php'

# Writes with no transaction (review each hit; single-row writes are fine)
grep -rL "DB::transaction" $(grep -rlE "::create\(|->update\(|->delete\(" src/Domain/*/Actions/ 2>/dev/null) 2>/dev/null
```

The first two list `LockTransactionRunner::run()` in `Core`; that helper is the one non-`handle()` entry.
