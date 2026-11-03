# Architecture and folders

**Read when:** adding a domain, placing a new file, or making one domain talk to another.
**Owns:** the PSR-4 layout, the domain and presentation trees, boundaries, cross-domain communication,
console commands, jobs and observers, and how DDD files are created.
**See also:** [core-kernel.md](core-kernel.md) · [contracts-and-services.md](contracts-and-services.md)

## TL;DR

- `src/Domain/{Domain}/` holds business logic. `src/Presentation/{Panel}/` holds HTTP. `app/` holds
  framework glue only.
- Same domain: import the Action. Other domain: `app({Other}Contract::class)`. Nothing else crosses.
- Only `Actions/` and `DataTransferObjects/` may have sub-folders. No layer nests inside another.
- A controller belongs to exactly one panel. Shared behaviour lives in the domain, not in a shared controller.
- Cross-domain work is a Contract call (sync), an event (decoupled) or a job (slow, retryable).
- Domain commands live in `src/Domain/{Domain}/Commands/`, are auto-registered, and only call a Contract.
- Create DDD files by hand or by cloning a neighbour; stock generators write to `app/`.

## PSR-4

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "Domain\\": "src/Domain/",
        "Presentation\\": "src/Presentation/"
    }
}
```

## Domain tree

```
src/Domain/{Domain}/
├── Actions/               one class per operation; may group: Actions/{SubArea}/
├── Commands/              console commands that drive only this domain
├── Contracts/             the domain's public interface(s)
├── DataTransferObjects/   *Data classes; may group: DataTransferObjects/{SubArea}/
├── Enums/                 backed enums owned by the domain
├── Exceptions/            exceptions thrown by Actions and Services
├── Jobs/                  queued work owned by the domain
├── Models/
│   ├── Entities/          Eloquent models
│   ├── Scopes/            {Entity}Filter traits and global Scope classes
│   ├── Abilities/         {Entity}Abilities (per-instance permission questions)
│   └── Traits/            model-only traits shared inside this domain
├── Observers/             registered in this domain's provider boot()
├── Providers/             {Domain}ServiceProvider with $bindings
├── Services/              Contract implementations; delegate to Actions
└── Traits/                traits used by Services and Actions (not models)
```

## Presentation tree

```
src/Presentation/{Panel}/
├── Controllers/{Feature}/{Feature}Controller.php
├── Requests/{Feature}/Store{Entity}Request.php
├── Requests/Traits/       shared rule sets
├── Resources/             JSON transformers (only where JSON is served)
├── Routes/web.php | api.php
├── Providers/             loads this panel's routes and middleware
└── Rules/                 custom validation rules
```

A panel is one audience: `Admin` (back office), `Api` (mobile or partner JSON), `Site` (public pages).
Each panel has a provider that loads its `Routes/*.php`; register it in `bootstrap/providers.php` next to
the domain providers.

## What goes where

| Need | Place |
|---|---|
| A business operation | `Actions/{Verb}{Entity}.php` |
| The domain's API for other domains and panels | `Contracts/{Entity}Contract.php` + `Services/{Entity}Service.php` |
| A transport object between layers | `DataTransferObjects/{Verb}{Entity}Data.php` |
| A status, type or kind | `Enums/{Entity}{Thing}.php` |
| An Eloquent model | `Models/Entities/{Entity}.php` |
| List filtering | `Models/Scopes/{Entity}Filter.php` (trait) |
| "Can this record do X now?" | `Models/Abilities/{Entity}Abilities.php` |
| Cross-cutting role-based authorization | `app/Policies/` |
| Validation | `src/Presentation/{Panel}/Requests/` |
| Response shaping | `src/Presentation/{Panel}/Resources/` |
| Middleware, framework adapters, package hooks | `app/` |

Business logic in Presentation, or HTTP concerns (request, session, redirects) inside a Domain, are
critical violations.

## Flat layers

Three shapes of the same mistake fork a domain's layout, so anything that walks it (a reviewer, an arch
test, an audit) sees only part of the domain:

```
❌ src/Domain/Billing/Reminders/Contracts/ReminderContract.php      a subsystem swallowing the layers
❌ src/Domain/Billing/Contracts/Reminders/ReminderContract.php      a subsystem folder in a flat layer
❌ src/Domain/Billing/Models/Entities/Abilities/InvoiceAbilities.php a layer nested in another
✅ src/Domain/Billing/Contracts/ReminderContract.php
✅ src/Domain/Billing/Actions/Reminders/SendInvoiceReminder.php     Actions may group
✅ src/Domain/Billing/Models/Abilities/InvoiceAbilities.php
```

A new folder such as `Handlers/` or `Resolvers/` does not earn a layer. Classes that serve one subsystem
go together under `Actions/{SubArea}/`.

## Boundaries

A Contract is the gateway to a domain. Actions, internal Services and Models behind it are private.

```php
// ✅ Same domain — you own the Action
use Domain\Billing\Actions\CalculateInvoiceTotal;

$total = CalculateInvoiceTotal::handle($invoice);

// ❌ Same domain — needless indirection
$total = app(InvoiceContract::class)->calculateInvoiceTotal($invoice);

// ✅ Other domain — through its Contract
$customer = app(CustomerContract::class)->getCustomer($customerId);

// ❌ Other domain — reaching into internals
use Domain\Customer\Models\Entities\Customer;
use Domain\Customer\Actions\GetCustomer;

$customer = Customer::find($customerId);
$customer = GetCustomer::handle($customerId);
```

An Action goes on the Contract only when another domain or a panel calls it. Type-hinting another
domain's Entity (because its Contract returns one) is fine; querying or writing it is not.

Two domains must not call each other in a cycle. Break a cycle by moving the shared concept to a third
domain, by publishing an event the other side listens to, or by a join entity that owns the link.

## Cross-domain communication

| Need | Use |
|---|---|
| The caller needs the result now, or it must succeed in the same transaction | Direct Contract call |
| Other domains may react; the publisher should not know who listens | Event |
| Slow work (PDF, external API, bulk write), may fail and retry | Queued job |
| Light work after the response, no retry needed | `defer()` |

Events carry scalars, not models. Jobs take ids and reload inside `handle()`.

```php
final class InvoiceIssued
{
    use Dispatchable;

    public function __construct(public readonly int $invoice_id, public readonly int $customer_id) {}
}

final class SendInvoicePdf implements ShouldQueue
{
    use Queueable;

    public function __construct(private readonly int $invoiceId)
    {
        $this->onQueue('documents');
    }

    public function handle(): void
    {
        app(InvoiceContract::class)->sendPdf($this->invoiceId);
    }
}
```

Dispatch jobs from Actions, not from controllers. A listener or job, like a controller, calls a Contract.

## High-risk resources get one seam

When a resource is dangerous to touch (a payment gateway, an external database, a bulk mail transport),
exactly one domain touches it, behind one small Contract. Nothing else opens that connection or builds
its requests. Keep that Contract transport-agnostic (scalars and DTOs in, DTOs out, never a model or a
live handle), so the local implementation can later be swapped for a remote client by changing one
binding. Why: every guard on that resource then lives in one code path.

## Multi-tenant apps (option)

When every row hangs off a tenant:

- Middleware resolves the tenant once per request through the tenant's Contract and leaves it on the
  request; a base-controller trait reads it back (`$this->currentTenant()`).
- A stranger gets **404**, a member without the permission gets **403**
  (a 403 on another tenant's record confirms that it exists).
- Every `Filter{Entity}Data` over tenant data declares its scoping property, and the controller pins it
  after the spread. See [dtos.md](dtos.md) and [controllers-requests-api.md](controllers-requests-api.md).
- Laravel passes route parameters to a controller **by position, not by name**. If middleware consumed
  a `{tenant}` prefix, remove it from the route (`$route->forgetParameter('tenant')`) so each method's own
  parameters line up, and never declare it in a signature.

## Console commands

- File: `src/Domain/{Domain}/Commands/{Name}.php`, namespace `Domain\{Domain}\Commands`.
- Signature: `{prefix}:{action}` in `snake_case`, the prefix being the domain or app key
  (`invoices:send_overdue_reminders`).
- Body: resolve the Contract, call one method, print one line. No Eloquent, no business logic.
- Registration: glob `src/Domain/*/Commands/*.php` in `bootstrap/app.php` (`withCommands()`), so a new
  file needs no wiring. Scheduling stays in `withSchedule()`; registering does not schedule.

```php
final class SendOverdueInvoiceReminders extends Command
{
    protected $signature = 'invoices:send_overdue_reminders';

    protected $description = 'Send reminders for invoices past their due date.';

    public function handle(): void
    {
        $count = app(InvoiceContract::class)->sendOverdueReminders();

        $this->info("Sent {$count} reminders.");
    }
}
```

## Observers

Observers live in `src/Domain/{Domain}/Observers/`, are registered in the domain provider's `boot()`,
and stay thin and non-reentrant. Why: they fire on every write, seeders and tests included, and an
observer that saves the model it observes loops.

## Creating DDD files

There is no generator for this layout. Copy the templates in these references, or clone a neighbouring
domain that already has the same pattern, then rename namespaces and classes.

1. Pick the closest existing domain and copy its structure.
2. Rename namespaces and classes (`CustomerContract` → `InvoiceContract`).
3. Adjust DTO properties, Action bodies and the filter scope to the new schema.
4. Register the new `{Domain}ServiceProvider` in `bootstrap/providers.php`.

Never use these for DDD files, because they write into `app/`:

```
make:model  make:controller  make:request  make:resource
```

These stay correct, because their output belongs outside the domain tree:

```
make:migration  make:seeder  make:factory  make:middleware  make:policy  make:event  make:listener
make:job and make:command only for app-level work; domain jobs and commands go in the domain folder
```

Before adding a domain, check the concept does not already live in `Core` or an existing domain.

## Verify

```bash
# Cross-domain imports of Actions or Services from Presentation or app/
grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Services)\\\\" src/Presentation/ app/

# Sub-folders in layers that must stay flat
find src/Domain/*/{Contracts,Services,Enums,Exceptions,Jobs} -mindepth 1 -type d 2>/dev/null

# Models generated into app/
ls app/Models/ 2>/dev/null
```
