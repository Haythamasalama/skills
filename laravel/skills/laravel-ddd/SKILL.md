---
name: laravel-ddd
description: Use when building, reviewing or refactoring Laravel code organised as a Domain-Driven Design layout in src/Domain and src/Presentation — adding a domain or deciding where a file belongs; writing Actions (static handle()), DTOs (*Data classes, Filter/Create/Update data, sent keys), Contracts and Services, ServiceProvider bindings, Models with Entities/Scopes/Abilities/Traits, backed Enums, statuses and transitions, filter scopes and Eloquent queries; writing thin controllers, Form Requests, Inertia or Blade page responses, API Resources and the status/data JSON envelope; events, jobs, commands and observers; migrations (index and foreign-key policy) and Pest and architecture tests for this layout; or reviewing a diff for layer and boundary violations. Also triggers on "DDD", "domain layer", "bounded context", "where does this file go", "Action vs Service", "بنية الكود", "هيكلة المشروع", "طبقات", "طبقة الدومين", "الأكشن", "الكونتراكت", "DTO".
---

# Laravel DDD layout

**Read when:** writing or reviewing PHP in a Laravel app that splits code into `src/Domain/{Domain}/` and
`src/Presentation/{Panel}/`, or setting up that layout in a new app.
**Owns:** the layer rules, the folder map, one request end to end, and the review checklist. Each layer's
detail lives in its own reference (table at the end).

Written for PHP 8.4 and Laravel 12 (checked 2026-11-03). Where generic Laravel guidance disagrees on the
topics below, this skill wins.

## Consistency first

These rules are defaults for **new** code. Before applying one, open two neighbouring files in the same
domain and match them: a working local pattern beats a default here. Do not retrofit old code as a side
effect of an unrelated change; a rename across many files is its own task.

## TL;DR

- **Dependencies point inward through Contracts.** Controller → Contract → Service → Action → Model. Why:
  each domain has one published door, so its internals can change without breaking callers.
- **Across domains, only the Contract.** Never import another domain's Model, Action or Service; resolve
  `app(OtherContract::class)`. Inside a domain, import the Action directly. Why: a cross-domain import
  couples two domains for good.
- **Actions are `final` with one `public static function handle()` and no constructor.** Dependencies are
  resolved inside `handle()` with `app()`. Why: callable from a controller, job, command or test with no wiring.
- **Services contain zero queries.** Each method is one delegation to an Action. Why: the query lives in
  one reusable, testable place.
- **Multi-statement writes run in `DB::transaction()`** inside the Action; a once-only change claims its
  row first. Why: no partial writes, no double runs.
- **DTOs end in `Data`, have `public readonly` `snake_case` properties, and are built with `fromArray()`
  or `fromRequest()`.** They remember which keys were sent, so an update writes only those. Why: keys match
  columns, and a form can clear a column to `null` without wiping the ones it did not send.
- **Controllers are thin and inject Contracts only.** Form Request → DTO → Contract → response. No
  Eloquent, no business rules, no Action calls. Why: the same operation must work from a job or the CLI.
- **No route-model binding.** Take `string $id`, fetch through the Contract, 404 on `null`. Why: binding
  queries past the Contract and skips its scopes and tenant filter.
- **Validation lives in Form Requests**, never in an Action. Why: by the time a DTO reaches the domain, the
  data is trusted.
- **The domain never reads `auth()`, `request()` or `session()`.** It asks a `CurrentUser` contract.
  Why: jobs and commands have no request.
- **Enum cases are `UPPER_SNAKE_CASE`; statuses change only through the transition Action.** Why: one
  style to grep, and the guard, side effects and audit run every time.
- **Migrations:** anonymous classes, no index "just in case", no `->index()` on a foreign key, no custom
  index names. Why: speculative indexes slow writes; custom names drift between environments.
- **Domain and Presentation files are created by hand** (or cloned from a neighbour). The `make:*`
  generators write into `app/`.

## The layers in one picture

```
HTTP ─► FormRequest ─► Controller ─► {Domain}Contract ─► {Domain}Service ─► Action ─► Model
        (validates)    (thin)        (interface)        (delegates)        (queries,   (casts,
                                                                            writes,     relations,
                                                                            transaction) scopes)
Other domain ─────────────────────► app({Domain}Contract::class)
Job / Command / Listener ─────────► app({Domain}Contract::class)
```

## Folder map

```
src/Domain/{Domain}/                     src/Presentation/{Panel}/
├── Actions/          may group by entity ├── Controllers/{Feature}/
├── Commands/                            ├── Requests/{Feature}/
├── Contracts/                           ├── Resources/        JSON and page shapes
├── DataTransferObjects/ may nest        ├── Props/            one class per Inertia page
├── Enums/                               ├── Routes/{web,api}.php
├── Events/           only if published  ├── Providers/
├── Exceptions/                          └── Rules/
├── Jobs/
├── Listeners/        only if it reacts
├── Models/
│   ├── Entities/     Eloquent models
│   ├── Scopes/       {Entity}Filter traits, global scopes
│   ├── Abilities/    {Entity}Abilities
│   ├── Features/     feature-flag wrappers (optional)
│   └── Traits/
├── Observers/
├── Providers/        {Domain}ServiceProvider ($bindings, events)
└── Services/
app/                  framework glue only: middleware, providers, adapters
```

A shared `Core` domain holds the kernel every domain uses: the `Arrayable` DTO base, `FilterData`,
`GetDataAbstract`, query macros, `BaseEnum`, `ModelAbility`, `BaseException`, `CurrentUser`. Detail:
[architecture.md](references/architecture.md), [core-kernel.md](references/core-kernel.md).

## One request, end to end

```php
// Presentation\Admin\Controllers\Invoice\InvoiceController
public function __construct(private readonly InvoiceContract $invoices) {}

public function store(StoreInvoiceRequest $request): RedirectResponse
{
    $invoice = $this->invoices->create(CreateInvoiceData::fromRequest($request));

    return to_route('admin.invoices.show', $invoice->id)->with('success', __('messages.saved'));
}

// Domain\Billing\DataTransferObjects\CreateInvoiceData
public static function fromRequest(StoreInvoiceRequest $request): self
{
    return self::fromArray([
        ...$request->validated(),
        'lines' => InvoiceLineData::arrayFrom($request->validated('lines')),
    ]);
}

// Domain\Billing\Services\InvoiceService
public function create(CreateInvoiceData $data): Invoice
{
    return CreateInvoice::handle($data);
}

// Domain\Billing\Actions\Invoice\CreateInvoice
final class CreateInvoice
{
    public static function handle(CreateInvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $customer = app(CustomerContract::class)->getCustomer($data->customer_id);
            $invoice = Invoice::create([...(clone $data)->exclude(['lines'])->toArray(), 'customer_id' => $customer->id]);
            $invoice->lines()->createMany(array_map(fn (InvoiceLineData $line) => $line->toArray(), $data->lines));

            return $invoice;
        });
    }
}
```

## Choices to make once per project

These are real alternatives, not drift. Pick one, write it in the project's README, and do not mix them.

| Topic | Choose between | Detail |
|---|---|---|
| What panels return | Inertia or Blade pages with redirects, a JSON API with the envelope, or both | [http.md](references/http.md), [json-api.md](references/json-api.md) |
| Strict DTO input | Lenient `fromArray()` (default) or strict, throwing on an unknown key | [dtos.md](references/dtos.md) |
| Feature flags | Per-domain `Models/Features/` wrappers or Pennant called directly | [core-kernel.md](references/core-kernel.md) |
| Tenancy | A single tenant, or every row scoped by a tenant resolved in middleware | [architecture.md](references/architecture.md) |
| Enforcement | Pest `arch()` tests, PHPStan rules, or both | [testing.md](references/testing.md) |

## Where each topic lives

| I'm working on… | Read |
|---|---|
| Placing a file, adding a domain, boundaries, events, jobs, commands, observers | [architecture.md](references/architecture.md) |
| The shared kernel a new project needs | [core-kernel.md](references/core-kernel.md) |
| An Action: shape, naming, transactions, concurrency, templates | [actions.md](references/actions.md) |
| A Contract, its Service, the provider binding | [contracts-and-services.md](references/contracts-and-services.md) |
| A Create, Update, Filter, nested or options DTO | [dtos.md](references/dtos.md) |
| An Entity: casts, attributes, scopes, abilities, traits, translated names | [models.md](references/models.md) |
| An enum, a status and its transitions, once-only work, request idempotency | [enums-and-states.md](references/enums-and-states.md) |
| A filter scope, eager loading, counting, chunking, raw SQL | [queries.md](references/queries.md) |
| A controller, Form Request, page response, redirect, authorization | [http.md](references/http.md) |
| The JSON envelope, status codes, Resources, API CRUD | [json-api.md](references/json-api.md) |
| A migration or seeded reference rows | [migrations.md](references/migrations.md) |
| A test, or an architecture test that enforces the layers | [testing.md](references/testing.md) |

## Review checklist

1. Every new file sits in the folder the map gives it; no invented layer (`Handlers/`, `Resolvers/`).
2. No cross-domain import of a Model, Action or Service.
3. Actions are `final`, static, constructor-free; writes touching more than one row use a transaction.
4. Services are one-line delegations; `$withRelations` / `$withCount` are forwarded.
5. DTOs end in `Data`, are `snake_case`, come from `validated()` on writes, and updates write sent keys only.
6. Controllers inject Contracts only, hold no Eloquent, take `string $id`, and redirect or return 201/204 after a write.
7. No `auth()`, `request()` or `session()` under `src/Domain`.
8. Migrations follow the index policy and have a real `down()`.
9. Each comment you added says a WHY someone would get wrong without it; delete the rest.
10. A test covers the Action (logic) or the endpoint (routing, validation, response), including a failure path.
