---
name: laravel-ddd
description: Use when building, reviewing or refactoring Laravel code organised as a Domain-Driven Design layout in src/Domain and src/Presentation — adding a domain or deciding where a file belongs; writing Actions (static handle()), DTOs (*Data classes, Filter/Create/Update data), Contracts and Services, ServiceProvider bindings, Models with Entities/Scopes/Abilities/Traits, backed Enums, filter scopes and Eloquent queries; writing thin controllers, Form Requests, API Resources and the status/data JSON response envelope; returning Inertia or server-rendered pages from controllers; writing migrations (index and foreign-key policy) and Pest tests for this layout; or reviewing a diff for layer and boundary violations. Also triggers on "DDD", "domain layer", "bounded context", "where does this file go", "Action vs Service", "بنية الكود", "هيكلة المشروع", "طبقات", "طبقة الدومين", "الأكشن", "الكونتراكت", "DTO".
---

# Laravel DDD layout

**Read when:** writing or reviewing PHP in a Laravel app that splits code into `src/Domain/{Domain}/` and
`src/Presentation/{Panel}/`, or setting up that layout in a new app.
**Owns:** the folder map, the layer rules (Controller → Contract → Service → Action → Model), the shared
kernel they rely on, and the review list of known mistakes.
This skill covers where code goes and how layers talk. Where generic Laravel guidance disagrees on the
topics below, this skill wins.

Written for PHP 8.4 and Laravel 12 (checked 2026-10-27).

## Consistency first

These rules are defaults for **new** code. Before applying one, open two neighbouring files in the same
domain and match them. A working local pattern beats a default here. Do not retrofit old code as a side
effect of an unrelated change; a rename across many files is its own task.

## TL;DR — the non-negotiables

- **Dependencies point inward through Contracts.** A Controller calls a Contract, the Service behind it
  delegates to Actions, and the Action owns the Eloquent query. Why: one published door per domain, so
  internals can change without breaking callers.
- **Across domains, only the Contract.** Never import another domain's Model, Action or Service; resolve
  `app(OtherContract::class)`. Inside a domain, import the Action directly. Why: a cross-domain import
  couples two domains for good.
- **Actions are `final` with one `public static function handle()` and no constructor.** Resolve
  dependencies inside `handle()` with `app()`. Why: stateless, callable from anywhere (controller, job,
  command, test) without wiring.
- **Services contain zero queries.** No `Model::query()`, `find()`, `create()`, `DB::table()`, loops or
  parsing; each method is one delegation to an Action. Why: the query lives in one reusable, testable place.
- **Multi-statement writes run in `DB::transaction()`**, inside the Action. Why: no partial writes.
- **DTOs end in `Data`, have `public readonly` `snake_case` properties, and are built with `fromArray()`.**
  Why: keys match DB columns, so `Model::create($data->toArray())` needs no mapping layer.
- **Controllers are thin.** Form Request → DTO from `$request->validated()` → Contract → response.
  No Eloquent, no business rules, no Action calls. Why: the same operation must work from a job or CLI.
- **Controllers are the one place for constructor injection** (of Contracts only). Domain classes use
  `app()`. Why: controllers are container-built; Actions are static and cannot be.
- **Validation lives in Form Requests**, never inside an Action. Why: by the time a DTO reaches the
  domain, the data is trusted.
- **Migrations:** anonymous classes, no indexes "just in case", never add `->index()` to a foreign key
  (it is already indexed), never custom-name an index or constraint. Why: speculative indexes slow writes;
  custom names drift between environments.
- **Write few comments.** Only a 1–2 line WHY. No docblocks that restate a signature. Method signatures
  stay on one line. Why: a typed signature says more than a stale comment.
- **Domain and Presentation files are created by hand** (or cloned from a neighbour). `make:model`,
  `make:controller`, `make:request` and `make:resource` write into `app/`. Why: the generators do not know
  this layout.

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
├── Actions/            (may nest)       ├── Controllers/{Feature}/
├── Commands/                            ├── Requests/{Feature}/
├── Contracts/                           ├── Resources/        (JSON shapes)
├── DataTransferObjects/ (may nest)      ├── Routes/{web,api}.php
├── Enums/                               ├── Providers/
├── Exceptions/                          └── Rules/
├── Jobs/
├── Models/
│   ├── Entities/       Eloquent models
│   ├── Scopes/         {Entity}Filter traits, global scopes
│   ├── Abilities/      {Entity}Abilities
│   └── Traits/
├── Observers/
├── Providers/          {Domain}ServiceProvider ($bindings)
├── Services/
└── Traits/
app/                    framework glue only: middleware, providers, Fortify-style adapters
```

Only `Actions/` and `DataTransferObjects/` group into sub-folders; every other layer is flat. A shared
`Core` domain holds the kernel every domain uses (`Arrayable`, `FilterData`, `GetDataAbstract`, query
macros, `ModelAbility`, `BaseEnum`). Full detail: [architecture-and-folders.md](references/architecture-and-folders.md),
[core-kernel.md](references/core-kernel.md).

## One request, end to end

```php
// Presentation\Admin\Controllers\Invoice\InvoiceController
public function __construct(private readonly InvoiceContract $invoices) {}

public function store(StoreInvoiceRequest $request): RedirectResponse
{
    $this->invoices->create(CreateInvoiceData::fromArray($request->validated()));

    return to_route('admin.invoices.index')->with('success', __('messages.saved'));
}

// Domain\Billing\Services\InvoiceService
public function create(CreateInvoiceData $data): Invoice
{
    return CreateInvoice::handle($data);
}

// Domain\Billing\Actions\CreateInvoice
final class CreateInvoice
{
    public static function handle(CreateInvoiceData $data): Invoice
    {
        return DB::transaction(function () use ($data) {
            $customer = app(CustomerContract::class)->getCustomer($data->customer_id);
            $invoice = Invoice::create(['customer_id' => $customer->id, 'currency' => $data->currency, 'notes' => $data->notes]);
            $invoice->lines()->createMany(array_map(fn (InvoiceLineData $line) => $line->toArray(), $data->lines));

            return $invoice;
        });
    }
}
```

## Where the source projects differ

The rules above are shared. On these points two mature codebases made different calls; pick one per
project and write it down. Each reference file explains the trade-off.

| Topic | Option 1 | Option 2 | Pick option 2 when |
|---|---|---|---|
| Filter DTO input | `fromArray($request->all())`, lenient (unknown keys ignored) | `fromArray($request->validated())`, strict (unknown key throws) | Data is tenant-scoped, or you start fresh. A silently dropped scoping key returns every tenant's rows. |
| Partial update | `Arr::whereNotNull($data->toArray())` | DTO remembers sent keys; `sentOnly()` | A form must be able to clear a column to `null`. |
| Presentation output | JSON API with a `status`/`data` envelope, plus server-rendered pages | Inertia pages + redirects; JSON only for narrow endpoints | One internal SPA-like panel and no public API. |
| After a write | Redirect to the resource index | `to_route()` after create/delete, `back()` after an in-place edit | Edits happen on a detail page users stay on. |
| Route-model binding | Pass ids; binding not banned | Banned; tenant resolved by middleware | Multi-tenant: binding skips the Contract and hides the tenancy check. |
| Enum case names | `UPPER_SNAKE_CASE` (the written rule in both) | `TitleCase` (what one codebase uses in practice) | You follow Laravel's default style. Never mix in one codebase. |
| Who is acting | A `CurrentUser` contract asked by the domain | A helper that defaults the actor to `auth()->id()` | Only one place (an activity log) needs the actor. |
| Feature flags | Per-domain `Models/Features/` wrappers | Pennant used directly, no folder | Few flags, no helper logic around them. |
| Enforcement | Review grep lists + a reviewer agent | Custom PHPStan rules (or Pest `arch()`) | The team is large or rules keep drifting. |

## Where each topic lives

| I'm working on… | Read |
|---|---|
| Placing a file, adding a domain, cross-domain calls, events, jobs, commands | [architecture-and-folders.md](references/architecture-and-folders.md) |
| The shared kernel a new project needs (`Arrayable`, `GetDataAbstract`, macros) | [core-kernel.md](references/core-kernel.md) |
| An Action: shape, naming, transactions, templates | [actions.md](references/actions.md) |
| A Create / Update / Filter DTO, nested and options DTOs | [dtos.md](references/dtos.md) |
| A Contract, its Service, the ServiceProvider binding | [contracts-and-services.md](references/contracts-and-services.md) |
| An Entity, casts, attributes, scopes, Abilities, Enums | [models-scopes-abilities-enums.md](references/models-scopes-abilities-enums.md) |
| A filter scope, eager loading, counting, chunking | [queries.md](references/queries.md) |
| A controller, Form Request, Resource, the JSON envelope, status codes | [controllers-requests-api.md](references/controllers-requests-api.md) |
| A migration | [migrations.md](references/migrations.md) |
| A test for this layout | [testing.md](references/testing.md) |

## Review checklist

1. Every new file sits in the folder the map gives it; no invented layer (`Handlers/`, `Resolvers/`).
2. No cross-domain import of a Model, Action or Service.
3. Actions are `final`, static, constructor-free; writes touching more than one row use a transaction.
4. Services are one-line delegations; `$withRelations` / `$withCount` are forwarded.
5. DTOs end in `Data`, are `snake_case`, are built with `fromArray()`, and come from `validated()` on writes.
6. Controllers inject Contracts only and hold no Eloquent; writes redirect or return 201/204.
7. Migrations follow the index policy and have a real `down()`.
8. Each comment you added says a WHY someone would get wrong without it; delete the rest.
9. A test covers the Action (logic) or the endpoint (routing, validation, envelope), including a failure path.
