# Contracts and Services

**Read when:** writing a Contract and its Service, wiring a domain ServiceProvider, or deciding whether a
method belongs on a Contract.
**Owns:** the must-delegate rule, Contract shape and naming, provider binding, `app()` vs constructor
injection, what to expose.
**See also:** [actions.md](actions.md) · [architecture-and-folders.md](architecture-and-folders.md)

## TL;DR

- Every Service implements a Contract; consumers resolve the Contract, never `new` the Service.
- **A Service contains zero queries and zero logic.** Each method is one delegation to an Action.
- Bind in the domain provider's `public array $bindings`, and register the provider in `bootstrap/providers.php`.
- Generic method names (`getInvoices`, `getInvoice`, `create`, `update`, `delete`) on **one line** each.
- One generic getter with a filter beats `getInvoiceById`, `getInvoiceByNumber`, …
- Forward `$withRelations` and `$withCount` to the Action, or every caller N+1s.
- Domain classes resolve dependencies with `app()`; controllers use constructor injection.
- A method goes on the Contract only when a caller outside the domain needs it.

## Every Service has a Contract

```php
// ✅ resolve the binding
$invoice = app(InvoiceContract::class)->getInvoice($id);

// ❌ bypasses the binding (and any swap of it)
$invoice = (new InvoiceService)->getInvoice($id);
```

The Contract is the domain's published API. Everything behind it is private and may change freely.

## A Service only delegates

```php
// ❌ query in the Service
public function getInvoice(int $id): ?Invoice
{
    return Invoice::query()->find($id);
}

// ❌ logic in the Service (a loop is logic)
public function importLines(Invoice $invoice, array $rows): void
{
    foreach ($rows as $row) {
        AddInvoiceLine::handle($invoice, InvoiceLineData::fromArray($row));
    }
}

// ✅ one line each
public function getInvoice(int $id): ?Invoice
{
    return GetInvoice::handle($id);
}

public function importLines(Invoice $invoice, ImportInvoiceLinesData $data): void
{
    ImportInvoiceLines::handle($invoice, $data);
}
```

Forbidden in a Service: `Model::query()`, `find()`, `where()`, `create()`, `->update()`, `->delete()`,
`DB::table()`, raw SQL, loops, payload parsing, branching on business rules, `DB::transaction()`.
Why: the same operation is then callable from a job, a command or a listener through the Action, and
every query for the domain is listed in one folder.

## Contract shape

```php
namespace Domain\Billing\Contracts;

interface InvoiceContract
{
    public function getInvoices(?FilterInvoiceData $data = null, array $withRelations = [], array $withCount = []): GetInvoices;

    public function getInvoice(?int $id = null, ?FilterInvoiceData $filters = null, array $withRelations = []): ?Invoice;

    public function create(CreateInvoiceData $data): Invoice;

    public function update(Invoice $invoice, UpdateInvoiceData $data): Invoice;

    public function delete(Invoice $invoice): void;

    public function issue(Invoice $invoice): Invoice;
}
```

- Signatures on **one line**, however long.
- Single-item getter order: `?int $id`, then `?Filter{Entity}Data $filters`, then `array $withRelations`.
- Lookups by anything but the primary key go through the filter, not a new method.
- Return Entities, DTOs or scalars. Never return an Action's query builder for a single item, an Eloquent
  `Builder`, or a closure. (`get{Entity}s` returns the `GetDataAbstract` subclass on purpose, so the
  caller picks `pagination()`, `collection()` or `count()`.)
- Parameter names on the Contract and the Service match exactly, including defaults.

### Returning Entities vs read DTOs

Both source codebases return Entities from Contracts today and treat read DTOs (`InvoiceData`) as the
target. Do not block a change for returning an Entity, and do not introduce a one-off read DTO on a
single Contract without agreeing the pattern. Exception: a **seam Contract** for a high-risk resource
(see [architecture-and-folders.md](architecture-and-folders.md)) is scalars and DTOs in, DTOs out, always,
because it must be swappable for a remote client.

## Service template

```php
namespace Domain\Billing\Services;

class InvoiceService implements InvoiceContract
{
    public function getInvoices(?FilterInvoiceData $data = null, array $withRelations = [], array $withCount = []): GetInvoices
    {
        return GetInvoices::for($data, $withRelations, $withCount);
    }

    public function getInvoice(?int $id = null, ?FilterInvoiceData $filters = null, array $withRelations = []): ?Invoice
    {
        return GetInvoice::handle($id, $filters, $withRelations);
    }

    public function create(CreateInvoiceData $data): Invoice
    {
        return CreateInvoice::handle($data);
    }

    public function update(Invoice $invoice, UpdateInvoiceData $data): Invoice
    {
        return UpdateInvoice::handle($invoice, $data);
    }

    public function delete(Invoice $invoice): void
    {
        DeleteInvoice::handle($invoice);
    }

    public function issue(Invoice $invoice): Invoice
    {
        return IssueInvoice::handle($invoice);
    }
}
```

```php
// ❌ declared but dropped — no caller can ever eager-load
public function getInvoices(?FilterInvoiceData $data = null, array $withRelations = [], array $withCount = []): GetInvoices
{
    return GetInvoices::for($data);
}
```

## Provider binding

```php
namespace Domain\Billing\Providers;

class BillingServiceProvider extends ServiceProvider
{
    public array $bindings = [
        InvoiceContract::class => InvoiceService::class,
        PaymentContract::class => PaymentService::class,
    ];

    public function boot(): void
    {
        Invoice::observe(InvoiceObserver::class);
    }
}
```

- Use `$bindings` (or `$singletons` when the Service holds state you want shared), not hand-written
  `$this->app->bind()` calls.
- One provider per domain, holding every pair in that domain.
- `BindingResolutionException: Target [...Contract] is not instantiable` almost always means the provider
  is missing from `bootstrap/providers.php`.

## `app()` inside the domain, injection at the edge (deliberate)

Generic Laravel advice is "always constructor-inject". In this layout:

| Class | How it gets dependencies |
|---|---|
| Action | `app(SomeContract::class)` inside `handle()` (it is static and has no constructor) |
| Service | `app(SomeContract::class)` inside the method that needs it |
| Controller | constructor-injected Contracts only |
| Form Request, middleware, job, command, listener | normal constructor or method injection |
| Adapter at a system edge (HTTP client, payment SDK, mail channel) | normal constructor injection |

Why: Actions cannot be injected, so Services match them and the pattern reads the same end to end; a
Service's cross-domain list can reach a dozen Contracts used by one method each; and tests that swap a
binding with `$this->app->instance()` work everywhere.

## What to expose

- ✅ `getInvoice`, `create`, `issue` — called by controllers, jobs and other domains.
- ❌ `NextInvoiceNumber` — only `IssueInvoice` calls it, so it stays an Action imported inside the domain.

Before adding a method, search for callers. Only same-domain callers: import the Action. At least one
outside caller: expose it. Once published, renaming or removing a method breaks other domains, so keep
the surface small.

## Seam Contracts

For a high-risk resource the Contract is also a security boundary: every method is a way to reach the
resource. Add a method only for a new sanctioned operation, and make sure the domain that owns the
workflow (approval, quota, audit) calls the seam, not the controller.

## Verify

```bash
# Queries or transactions inside Services
grep -rnE "::(query|find|where|create|all|first)\(|DB::(table|transaction|select|update)\(" src/Domain/*/Services/

# Loops inside Services
grep -rnE "^\s+(foreach|for|while) \(" src/Domain/*/Services/

# Services without a Contract
for f in src/Domain/*/Services/*Service.php; do
  d=$(echo "$f" | cut -d/ -f3); n=$(basename "$f" Service.php)
  [ -f "src/Domain/$d/Contracts/${n}Contract.php" ] || echo "no contract: $f"
done

# Manual binds instead of $bindings
grep -rn "app->bind(\|app->singleton(" src/Domain/*/Providers/

# Multi-line signatures on Contracts
grep -rnE "function [a-zA-Z]+\($" src/Domain/*/Contracts/
```
