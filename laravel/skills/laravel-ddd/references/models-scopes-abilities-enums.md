# Models, scopes, abilities and enums

**Read when:** writing an Entity, a filter scope or global scope, an `{Entity}Abilities` class, a backed
enum, a status lifecycle, or a lookup list.
**Owns:** everything under `src/Domain/{Domain}/Models/` and `Enums/`.
**See also:** [queries.md](queries.md) · [core-kernel.md](core-kernel.md) · [dtos.md](dtos.md)

## TL;DR

- Entities live in `Models/Entities/`, created by hand. New models use the `casts()` method.
- Prefer `$fillable` on models that take user input. `$guarded = []` only on internal models.
- **No state-changing or behaviour methods on a model.** Writes and workflows are Actions.
  Read-only predicates about the row's own columns are fine (`isOverdue()`).
- `Attribute` accessors do all their work inside the `get:` closure.
- One `{Entity}Filter` trait per listable entity, exposing `scopeFilterBy()`.
- Abilities answer "can this record do X now?" and return `bool`. Roles and permissions are Policies.
- Enums are backed, use `BaseEnum`, and hold only pure `match ($this)` helpers.
- `Enum::from()` for values the code produced; `fromOrAbort()` / `tryFrom()` for values a request produced.

## Entities

```php
namespace Domain\Billing\Models\Entities;

class Invoice extends Model
{
    use HasFactory, InvoiceFilter, ModelAbility, SoftDeletes;

    protected string $abilityClass = InvoiceAbilities::class;

    protected $fillable = ['customer_id', 'number', 'status', 'currency', 'issued_at', 'due_at', 'notes'];

    protected function casts(): array
    {
        return [
            'status' => InvoiceStatus::class,
            'issued_at' => 'datetime',
            'due_at' => 'date',
            'total' => 'integer',
            'is_locked' => 'boolean',
            'options' => 'array',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InvoiceLine::class);
    }

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    public function isOverdue(): bool
    {
        return $this->status === InvoiceStatus::ISSUED && $this->due_at?->isPast();
    }

    protected static function newFactory(): InvoiceFactory
    {
        return InvoiceFactory::new();
    }
}
```

- Extend `Model`, or `Authenticatable` only when the entity signs in.
- Cast every enum, date, boolean, number and JSON column, so callers never coerce by hand. Existing
  models on the `$casts` property stay as they are until someone refactors them on purpose.
- Type every relation's return. Add `->withTrashed()` when the related row is soft-deleted but the link
  must survive.
- Keep the list of morph targets as a constant (`const ATTACHABLE_TYPES = [Invoice::class, Customer::class];`)
  so `whereHasMorph()` uses one list.
- Entities under `src/Domain/` are invisible to Laravel's factory guessing. Add `newFactory()` per model,
  or map once with `Factory::guessFactoryNamesUsing()`.
- Never put secrets in a castable plain column. Use the `encrypted` cast and keep the value out of
  `toArray()` with `$hidden`.

### No behaviour on models

```php
// ❌ a workflow hidden on the model
public function markPaid(): void
{
    $this->update(['status' => InvoiceStatus::PAID, 'paid_at' => now()]);
    app(LedgerContract::class)->recordPayment($this->id);
}

// ✅ an Action owns the write; the model only answers questions about itself
final class MarkInvoicePaid
{
    public static function handle(Invoice $invoice): Invoice { /* transaction, ledger call, event */ }
}
```

Why: model methods run from anywhere (Blade, serialization, other domains) with no transaction and no
Contract in sight. A predicate may call `route()` to build a link; it may never read `request()`,
the session or another domain's data.

### Accessors

```php
// ✅ work happens on read
protected function displayTotal(): Attribute
{
    return Attribute::get(fn () => Money::format($this->total, $this->currency));
}

// ❌ work happens when the accessor is built, before the model is ready
protected function displayTotal(): Attribute
{
    $formatted = Money::format($this->total, $this->currency);

    return Attribute::get(fn () => $formatted);
}
```

Why: Eloquent builds accessors during serialization; code outside the closure runs then and can trigger a
lazy load, which fails hard when `Model::preventLazyLoading()` is on outside production (it should be).

## Scopes

### The filter trait

```php
namespace Domain\Billing\Models\Scopes;

trait InvoiceFilter
{
    public function scopeFilterBy(Builder $query, ?FilterInvoiceData $filters): void
    {
        $query->when($filters?->id, fn (Builder $q) => $q->whereByType('id', $filters->id))
            ->when($filters?->customer_id, fn (Builder $q) => $q->where('customer_id', $filters->customer_id))
            ->when($filters?->status, fn (Builder $q) => $q->whereByType('status', $filters->status))
            ->when($filters?->number, fn (Builder $q) => $q->whereLikeText('number', $filters->number))
            ->when($filters?->issued_from, fn (Builder $q) => $q->whereDate('issued_at', '>=', $filters->issued_from))
            ->when($filters?->issued_to, fn (Builder $q) => $q->whereDate('issued_at', '<=', $filters->issued_to));
    }

    public function scopeOpen(Builder $query): void
    {
        $query->whereIn('status', [InvoiceStatus::DRAFT, InvoiceStatus::ISSUED]);
    }
}
```

- Takes the nullable Filter DTO, never a request or a loose array.
- Every clause is inside `when()`, so a null field is skipped and the Action has one code path.
- `when($filters?->flag, …)` skips `false`. For a boolean filter where `false` is a real value, test
  `! is_null($filters?->is_paid)`.
- A where-chain that names a domain idea and appears twice becomes a named scope (`scopeOpen`). Why:
  three copies of "open invoice" drift apart.
- Every property the DTO declares must be read here. A declared filter no clause reads is the
  missing-tenant-scope bug with one more step.
- One codebase also uses `scopeFilter()` as the entry name. Pick one name per project; `filterBy` reads
  better at the call site (`Invoice::query()->filterBy($data)`).

### Global scopes

`Models/Scopes/{Adjective}Scope.php` implementing `Scope`, registered in `booted()` (or with
`#[ScopedBy]`). Use one only when a constraint must apply to every query with no opt-in, and bypass it
with `withoutGlobalScope(...)`. Never turn a DTO filter into a global scope; it hides filtering from the
call site and breaks every query that needs all rows.

A global scope that limits rows to "what the current user may see" must decide what **no user** means
(a queue job, a command). Returning everything for a null actor is a leak; decide and test it.

### Heavy columns

For large JSON or text columns that list queries never need, a small trait that registers a global
scope selecting every column except those listed (with a `withHiddenColumns()` opt-in) prevents memory
blow-ups on lists and dropdowns.

## Abilities

```php
namespace Domain\Billing\Models\Abilities;

class InvoiceAbilities
{
    public function __construct(public readonly Invoice $invoice) {}

    public function update(): bool
    {
        return $this->invoice->status === InvoiceStatus::DRAFT && ! $this->invoice->is_locked;
    }

    public function cancel(User $user): bool
    {
        return $this->invoice->status === InvoiceStatus::ISSUED && $this->invoice->created_by === $user->id;
    }
}
```

- One public method per question, named for the action (`update`, `cancel`, `issue`), no `can` prefix:
  the call reads `$invoice->ability('cancel', $user)`.
- Returns `bool`. Private helpers for shared sub-checks. Extra arguments are allowed.
- `getAbility()` returns the object when you need several flags; `hasAbility()` aborts 403 and is for
  rare use, since HTTP authorization belongs to the Form Request or a Policy.
- `Models/Abilities/` is a sibling of `Models/Entities/`, never inside it.

| Question | Where |
|---|---|
| Can **this** invoice be edited now, given its status? | `InvoiceAbilities::update()` |
| May this **user role** edit invoices at all? | `app/Policies/InvoicePolicy.php` (or a permission middleware) |
| Which statuses may it move to next? | The ability, backed by the state machine if there is one |

Policies may call abilities; abilities never check roles. Send the reachable actions or statuses to the
page from the server, so the UI never offers a move the Action will refuse.

## Statuses and transitions

Model a lifecycle explicitly: a status enum, a transition enum or table of allowed moves, and guard
conditions per transition. Change status only through the Action that performs a transition, never with a
bare `->update(['status' => ...])` from a controller or another domain. Why: the guard, the side effects
and the audit entry then run every time. A transition that must happen at most once claims the row with a
conditional update; see the code-quality skill's
[sensitive-operations.md](../../laravel-code-quality/references/sensitive-operations.md).

## Enums

```php
namespace Domain\Billing\Enums;

enum InvoiceStatus: int
{
    use BaseEnum;

    case DRAFT = 1;
    case ISSUED = 2;
    case PAID = 3;
    case CANCELLED = 4;

    public function label(): string
    {
        return __("enums.invoice_status.{$this->name}");
    }

    public function tone(): string
    {
        return match ($this) {
            self::DRAFT => 'info',
            self::ISSUED => 'warn',
            self::PAID => 'ok',
            self::CANCELLED => 'danger',
        };
    }
}
```

- Backed (`int` or `string`). String values that land in a column must fit that column.
- **Case names:** both codebases document `UPPER_SNAKE_CASE`; one drifted to `TitleCase` in practice.
  Pick one per project and enforce it; never mix.
- Instance methods are pure `match ($this)` maps: `label()`, `tone()` / `color()`, `icon()`. No `default`
  arm on a status enum, so adding a case fails loudly (`UnhandledMatchError`) until every helper covers it.
- Separate methods for separate wordings (`label()`, `documentLabel()`); no `$style` parameter.
- The status → colour (or tone) map lives on the enum or in one shared map, never per page.

### What never goes in an enum

`auth()`, `request()`, `session()`, queries, `Cache::`, permission checks, `->save()`, events, jobs, or
environment-dependent `config()`. An enum knows what `PAID` **is**, not who may see it or what happens
next.

| Rule | Goes in |
|---|---|
| Which statuses a user may see | an Ability or Policy |
| What happens when an invoice becomes paid | the Action of that transition, or an event listener |
| Which values an endpoint accepts | the Form Request: `Rule::in(InvoiceStatus::values())` / `Rule::enum(...)` |
| Which cases a dropdown shows for a role | the controller or a read Action (`InvoiceStatus::except([...])`) |

### `from` vs `fromOrAbort`

```php
// ❌ a retired or invalid value in the URL becomes a 500
$status = InvoiceStatus::from($request->route('status'));

// ✅ a 404
$status = InvoiceStatus::fromOrAbort($request->route('status'));
```

Route parameters, query strings, request bodies and rows written by older code can all hold a value the
enum no longer has. Inside the domain, on values the code itself produced, `from()` is right.

### Enums and collections

```php
// ❌ an enum instance never == its backing value; this matches nothing, silently
$invoices->where('status', InvoiceStatus::PAID->value);

// ✅ compare the case itself
$invoices->where('status', InvoiceStatus::PAID);
```

Query builders accept either form; the trap is in-memory collections of enum-cast models.

### Retiring a case that seeded a row

When enum values are real row ids in a table (lookup rows, modules, entity types), removing the case also
needs a migration that deletes the row, relying on `ON DELETE SET NULL` / `CASCADE` foreign keys. If the
row cannot go, keep the case as deprecated. Why: an orphan row resolved through `from()` throws in
production on the first page that renders it.

### Naming the variable

When an enum's name collides with a model's (`EntityType` enum vs `EntityType` model), suffix the variable:
`$entityTypeEnum` vs `$entityType`.

## Lookup lists

Many small "types" (FAQ groups, static pages, reason lists) fit one table keyed by a `type` enum, with a
translated name, an optional `slug`, and type-specific attributes in an `options` JSON column backed by an
options DTO. Adding a type is then an enum case plus labels, with no migration. Give a value a real column
only when it must be indexed or joined; give a type its own table when its rows need real columns (a price,
a foreign key, a status). Make the type required on the filter DTO so no query can read across types.

## Feature flags (option)

- **Option 1:** domain wrappers in `Models/Features/{Name}Feature.php` (a static `flag()` plus helper
  methods) when one flag is read in many places or needs helper logic.
- **Option 2:** call Pennant directly and keep no folder, when flags are few and simple.

## Verify

```bash
# Entities generated outside the tree
ls app/Models/ 2>/dev/null

# $guarded = [] on models (prefer $fillable where input reaches the model)
grep -rn 'guarded = \[\]' src/Domain/*/Models/Entities/

# Accessors doing work before the closure
grep -rn -B3 "return Attribute::" src/Domain/*/Models/Entities/ | grep '\$this->'

# Request, auth or queries inside enums
grep -rnE "auth\(|Auth::|request\(|session\(|::where\(|->save\(|->update\(" src/Domain/*/Enums/

# Enum::from on request input in Presentation
grep -rnE "::from\(\\\$(request|id|validated)" src/Presentation/
```
