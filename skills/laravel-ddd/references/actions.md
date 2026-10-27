# Actions

**Read when:** writing or reviewing an Action.
**Owns:** the `final class` + `public static function handle()` shape, naming, DTO input, transactions,
resolving dependencies, and the CRUD templates.
**See also:** [contracts-and-services.md](contracts-and-services.md) · [dtos.md](dtos.md) ·
[core-kernel.md](core-kernel.md)

## TL;DR

- `final class X { public static function handle(...) }`. Stateless. **Never a constructor.**
- One Action, one operation. Names: `Get{Entity}`, `Get{Entity}s`, `Create{Entity}`, `Update{Entity}`,
  `Delete{Entity}`, or the natural verb (`IssueInvoice`, `ApplyDiscount`). No `Action` suffix.
- `Get{Entity}s` extends `GetDataAbstract` (the one Action built through `::for()`).
- The payload travels as a `*Data` DTO. The entity or id it acts on stays a plain parameter.
- **Never validate inside an Action.** That is the Form Request's job.
- Multi-statement writes go inside `DB::transaction(fn () => ...)`.
- Cross-domain dependencies resolve inside `handle()` with `app(SomeContract::class)`.
- The Action owns the Eloquent query. Services and controllers never do.

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

Why static and constructor-free: an Action can be called from a controller's Service, a job, a command,
a listener or a test with no container wiring, and it cannot hold state between calls. A constructor also
invites injecting Contracts, which hides what a call actually needs.

## Naming

| Kind | Name |
|---|---|
| Read one | `GetInvoice` |
| Read many (filtered, paginated) | `GetInvoices extends GetDataAbstract` |
| Insert | `CreateInvoice` |
| Partial update | `UpdateInvoice` |
| Remove | `DeleteInvoice` |
| Domain operation | `IssueInvoice`, `CancelInvoice`, `RecalculateInvoiceTotal`, `SendInvoiceReminder` |

The namespace `Domain\{Domain}\Actions\` already says "Action".

## Every Action takes a DTO

```php
// ✅ one typed payload; adding a field touches one class
UpdateCustomer::handle($customer, UpdateCustomerData::fromArray($request->validated()));

// ❌ loose scalars drift out of sync with every caller
UpdateCustomer::handle($customer, $name, $email, $phone);
```

Prefer one `UpdateCustomer` with an all-nullable `UpdateCustomerData` over `UpdateCustomerName` +
`UpdateCustomerEmail`. Why: the write rules (strip nulls, reset `email_verified_at` when the address
changes) then live in one place.

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
package's "create user" hook, for example), that adapter is framework glue. Put it in `app/`, validate
there, and call the pure Action. Why: it keeps validation out of `src/Domain/`.

## Transactions

Any Action that writes more than one row wraps the writes in a transaction. Read-only Actions do not.

```php
// ❌ the invoice is committed even when a line fails
final class CreateInvoice
{
    public static function handle(CreateInvoiceData $data): Invoice
    {
        $invoice = Invoice::create([...]);
        $invoice->lines()->createMany([...]);

        return $invoice;
    }
}

// ✅ atomic
final class CreateInvoice
{
    public static function handle(CreateInvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $invoice = Invoice::create([...]);
            $invoice->lines()->createMany([...]);

            return $invoice;
        });
    }
}
```

Dispatch jobs and events that must only run on success with `->afterCommit()` (or set
`after_commit` on the queue connection). Why: a job dispatched inside a transaction that later rolls back
would act on a row that does not exist.

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

            InvoiceIssued::dispatch($invoice->id, $customer->id);

            return $invoice;
        });
    }
}
```

- `NextInvoiceNumber` is in the same domain, so it is imported directly.
- `CustomerContract` and `LedgerContract` are other domains, so they go through `app()`.

## Orchestration belongs in an Action

When an operation calls several Actions or Contracts, loops over input, or parses a payload, that is an
Action (often a domain verb). The Service method stays a one-line delegation to it. Why: a loop buried in
a Service cannot be reused from a job or command without going through the whole Contract stack.

## Private helpers over single-use classes

A step that only one Action needs stays a `private static` method in that Action. A new Action earns its
file through real reuse (more than one caller), not readability alone.

## Templates

```php
final class Get{Entity}
{
    public static function handle(?int $id = null, ?Filter{Entity}Data $filters = null, array $withRelations = []): ?{Entity}
    {
        if ($id === null && $filters === null) {
            return null;
        }

        return {Entity}::query()
            ->with($withRelations)
            ->when($id, fn (Builder $query) => $query->whereKey($id))
            ->filterBy($filters)
            ->first();
    }
}

/** @extends GetDataAbstract<{Entity}> */
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
        $entity->update(Arr::whereNotNull($data->toArray()));

        return $entity;
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

`Update{Entity}` uses `Arr::whereNotNull` so unset fields do not blank columns. If forms must clear a
field to `null`, use the sent-keys variant (`$data->sentOnly()`) from [core-kernel.md](core-kernel.md).

`find()` returning `null` vs `findOrFail()` throwing a 404: pick per Action and make the return type say
it (`?Invoice` vs `Invoice`). Callers on the request path usually want the 404.

## Where Actions live

`src/Domain/{Domain}/Actions/{Name}.php`, one class per file. `Actions/{SubArea}/` is allowed when a
subsystem has many Actions.

## Verify

```bash
# Actions with a constructor
grep -rln "function __construct" src/Domain/*/Actions/

# Entry points that are not public static handle()
grep -rn "function handle\|function execute(\|function __invoke(" src/Domain/*/Actions/ | grep -v "public static function handle"

# Validation inside the domain
grep -rn "Validator::" src/Domain/

# Writes with no transaction (review each hit; single-row writes are fine)
grep -rL "DB::transaction" $(grep -rlE "::create\(|->update\(|->delete\(" src/Domain/*/Actions/ 2>/dev/null) 2>/dev/null
```
