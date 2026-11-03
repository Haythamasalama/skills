# Models

**Read when:** writing or reviewing an Entity, its casts or accessors, a filter or global scope, an
`{Entity}Abilities` class, a model trait, a translated name, or a domain feature-flag wrapper.
**Owns:** everything under `src/Domain/{Domain}/Models/`: `Entities/`, `Scopes/`, `Abilities/`, `Traits/`,
`Features/`, and how a model stores translated text.

## TL;DR

- Entities live in `Models/Entities/`, created by hand. New models use the `casts()` method.
- `$fillable` on any model that takes request data; `$guarded = []` only on internal models.
- **No state-changing or workflow methods on a model.** Writes are Actions. Read-only questions about the
  row itself are fine (`needsActivation()`).
- `Attribute` accessors do all their work inside the `get:` closure.
- One `{Entity}Filter` trait per listable entity, exposing `scopeFilterBy()`. Every list query goes through it.
- Abilities answer "can this record do X now?" with a `bool`. Role checks are Policies.
- A name shown in several languages is rows in a `translations` table, not columns. Search and sort it
  with the translation scopes, never `where('name')`.

## Folder map

| Need | Location |
|---|---|
| Eloquent model | `Models/Entities/{Entity}.php` |
| DTO-driven filter + named scopes | `Models/Scopes/{Entity}Filter.php` (trait) |
| Auto-applied constraint | `Models/Scopes/{Adjective}Scope.php` (implements `Scope`) |
| Per-record "can it do X now?" | `Models/Abilities/{Entity}Abilities.php` |
| Relations, casts or accessors grouped out of a large entity, or shared by several | `Models/Traits/{Name}.php` |
| Domain feature-flag wrapper (option) | `Models/Features/{Name}Feature.php` |

`Abilities/` is a sibling of `Entities/`, never inside it.

## Entities

```php
namespace Domain\Employee\Models\Entities;

class Employee extends Model
{
    use EmployeeFilter, HasFactory, ModelAbility, SoftDeletes;

    protected string $abilityClass = EmployeeAbilities::class;

    protected $fillable = ['user_id', 'employee_number', 'name', 'email', 'job_title', 'status', 'hired_at', 'notes'];

    protected function casts(): array
    {
        return [
            'status' => EmployeeStatus::class,
            'activated_at' => 'datetime',
            'archived_at' => 'datetime',
            'hired_at' => 'date',
            'is_locked' => 'boolean',
            'options' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(EmployeeContact::class);
    }

    public function needsActivation(): bool
    {
        return $this->status === EmployeeStatus::PENDING && $this->hired_at?->isPast();
    }

    protected static function newFactory(): EmployeeFactory
    {
        return EmployeeFactory::new();
    }
}
```

- Never `php artisan make:model`: it writes to `app/Models/`. Create by hand or clone a neighbour.
- Extend `Model`, or `Illuminate\Foundation\Auth\User` only when the entity signs in.
- Type every relation's return so static analysis catches misuse. Follow Laravel's key names
  (`user_id`); override them only for a column that already exists under another name.
- Add `->withTrashed()` to a relation when the related row soft-deletes but the link must still resolve
  (an archive reason, a closed department on an old employee).
- Keep a `morphTo`'s target list as a constant on the model that owns it
  (`Attachment::ATTACHABLE_TYPES`), so `whereHasMorph()` uses one list ([queries.md](queries.md#polymorphic-existence)).
- Entities under `src/Domain/` are invisible to factory name guessing. Add `newFactory()` per model, or map
  once with `Factory::guessFactoryNamesUsing()`.
- Relations to another domain's entity are fine for eager loading and display; querying or writing through
  them from outside the owning domain is a boundary breach ([architecture.md](architecture.md)).

## Casts

- Cast every enum, date, boolean, number and JSON column. Why: an uncast column makes every caller
  remember to coerce, and one of them will not.
- New models use `protected function casts(): array`. A model that still has the `$casts` property keeps it
  until someone refactors it on purpose, not as a side effect of other work.
- A JSON list of enum values: `AsEnumCollection::of(EmployeeFlag::class)` (Laravel 12, checked 2026-11-03).
  It throws on a value the enum no longer has; if old rows can hold retired values, use a custom cast that
  maps with `tryFrom()` and drops the nulls.
- A JSON object with known keys gets an options DTO accessor ([dtos.md](dtos.md#options-dtos-for-a-json-column)).
- Secrets use the `encrypted` cast and stay out of `toArray()` through `$hidden`.

## Mass assignment

- `$fillable` on every model that is created or updated from request data. Why: `$guarded = []` turns a
  forgotten validation rule into a writable column.
- `$guarded = []` only on internal models that never receive request input (logs, pivots, snapshots).
- Values that are not columns (translated names, files) never go in `$fillable`.

## Accessors

```php
// ✅ the work runs on read
protected function displayName(): Attribute
{
    return Attribute::get(fn () => "{$this->name} ({$this->department->name})");
}

// ❌ the work runs when the accessor is built, before the model is ready
protected function displayName(): Attribute
{
    $label = "{$this->name} ({$this->department->name})";

    return Attribute::get(fn () => $label);
}
```

Why: Eloquent builds accessors during serialization; code outside the closure runs then and can trigger a
lazy load, which fails hard when `Model::preventLazyLoading()` is on outside production (it should be).
Use `Attribute::get()` for read-only values and `Attribute::make(get:, set:)` only when you also write.

## Model methods

```php
// ❌ a workflow hidden on the model
public function markArchived(): void
{
    $this->update(['status' => EmployeeStatus::ARCHIVED, 'archived_at' => now()]);
    app(AuditContract::class)->record('employee.archived', $this->id);
}

// ✅ the model answers questions about itself; an Action owns the write
public function isArchived(): bool
{
    return $this->status === EmployeeStatus::ARCHIVED;
}
```

Why: a model method runs from anywhere (views, serialization, other domains) with no transaction and no
Contract in sight. Plain methods read as questions (`needsActivation()`, `requiresApproval()`) or derived
values (`initials()`). A method may call `route()` to build a link; it never reads `request()`, the
session, `auth()` or another domain's data.

## Model traits

`Models/Traits/` holds traits that group one concern of a large entity (`EmployeeAddresses`,
`HasEmployeePhoto`) or share relations, casts and accessors between entities. The same limits apply as
on the entity: relations, accessors, scopes and read-only questions; no writes, no workflows. Name a
shared trait `Has{Thing}`; name a grouping trait after the concern.

## Scopes

### The filter trait

```php
namespace Domain\Employee\Models\Scopes;

trait EmployeeFilter
{
    public function scopeFilterBy(Builder $query, ?FilterEmployeeData $filters): void
    {
        $query->when($filters?->id, fn (Builder $q) => $q->whereByType('id', $filters->id))
            ->when($filters?->user_id, fn (Builder $q) => $q->whereByType('user_id', $filters->user_id))
            ->when($filters?->status, fn (Builder $q) => $q->whereByType('status', $filters->status))
            ->when($filters?->employee_number, fn (Builder $q) => $q->whereLikeText('employee_number', $filters->employee_number))
            ->when($filters?->hired_from, fn (Builder $q) => $q->whereDate('hired_at', '>=', $filters->hired_from))
            ->when($filters?->hired_to, fn (Builder $q) => $q->whereDate('hired_at', '<=', $filters->hired_to))
            ->when($filters?->with_trashed, fn (Builder $q) => $q->withTrashed());
    }

    public function scopeCurrent(Builder $query): void
    {
        $query->whereIn('status', [EmployeeStatus::PENDING, EmployeeStatus::ACTIVE]);
    }
}
```

- The entry scope is `scopeFilterBy()` (called as `Employee::query()->filterBy($filters)`). It takes the
  nullable Filter DTO, never a request or a loose array ([dtos.md](dtos.md#filter-dtos)).
- Every clause sits inside `when()`, so a null field is skipped and the Action has one code path.
- `when($filters?->flag, …)` skips `false`. For a boolean filter where `false` is a real value, test
  `! is_null($filters?->is_locked)`.
- Every property the DTO declares is read here.
- A where-chain that names a domain idea and appears twice becomes a named scope in the same trait
  (`scopeCurrent`). Why: three copies of "current employee" drift apart. Move named scopes to their own trait
  only when the filter trait grows large.
- The macros, eager loading and the rest of the query rules: [queries.md](queries.md). A self-evident
  `when()` chain takes no comment.

### Global scopes

`Models/Scopes/{Adjective}Scope.php` implementing `Scope`, registered in `booted()` or with `#[ScopedBy]`.
Use one only when a constraint must apply to every query with no opt-in; bypass it with
`withoutGlobalScope(...)`. Never turn a DTO filter into a global scope: it hides filtering from the call
site and breaks every query that needs all rows.

A global scope that limits rows to "what the current user may see" decides what **no user** means (a queued
job, a command). Returning everything for a null actor is a leak; decide it and test it.

### Heavy columns

For large JSON or text columns that list queries never need (shapes, documents, blobs), a small trait
(`ExcludesHiddenColumns`) registers a global scope that selects every column except a `$hiddenColumns`
list, with a `withHiddenColumns()` opt-in. It also applies inside eager loads, so a list of parents with
`with('region')` stays light. Why: one wide column across a few thousand rows is enough to run out of
memory on a dropdown.

## Abilities

```php
namespace Domain\Employee\Models\Abilities;

final readonly class EmployeeAbilities
{
    public function __construct(public Employee $employee) {}

    public function update(): bool
    {
        return $this->employee->status === EmployeeStatus::PENDING && ! $this->employee->is_locked;
    }

    public function archive(User $user): bool
    {
        return $this->employee->canTransition(EmployeeTransition::ARCHIVE, ['user' => $user]);
    }
}
```

- The entity uses `ModelAbility` and declares `protected string $abilityClass = EmployeeAbilities::class;`
  ([core-kernel.md](core-kernel.md)).
- The constructor takes the model as a public property. One public method per question, named for the
  action (`update`, `archive`, `activate`), no `can` prefix: the call reads
  `$employee->ability('archive', $user)`.
- Returns `bool`, no reason and no message. Private helpers for shared sub-checks; extra arguments are
  forwarded.
- `getAbility()` returns the object when you need several flags; `hasAbility()` aborts 403 and is rare,
  since HTTP authorization belongs to the Form Request or a Policy.
- An entity with a lifecycle lets the ability delegate to its state machine, then add business rules on
  top ([enums-and-states.md](enums-and-states.md#abilities-over-the-state-machine)).

| Question | Where |
|---|---|
| Can **this** employee be edited now, given its status? | `EmployeeAbilities::update()` |
| May this **role** edit employees at all? | `app/Policies/EmployeePolicy.php` or a permission middleware |
| Why exactly can it not be archived? (shown to the user) | the state machine's result ([enums-and-states.md](enums-and-states.md)) |

Policies may call abilities; abilities never check roles. Send the reachable actions to the page from the
server, so the UI never offers a move the Action will refuse.

## Translated names

A name or description shown in more than one language is stored as rows of one `translations` table
(`transable_type`, `transable_id`, `language_code`, `name`, `description`, unique on type + id + language),
through a `Transable` trait on the entity. Why: a column per language multiplies with every language and
every translated field; one morph table does not.

The trait gives:

| Member | Does |
|---|---|
| `$with = ['translates']`, `$appends` | eager-loads the rows on every query, so `->name` never runs its own query; adds `name` / `description` to JSON |
| `$model->name` | the reader's language, else the other one when it is missing or blank |
| `$model->name('en')` | that language only, `null` when missing; for a form field of that language |
| `getTranslation('en', withoutFallbackLocale: false)` | that language, else the other; for text in a language other than the reader's |
| `touchTranslation(names: [...], descriptions: [...])` | upserts one row per language |
| `searchTranslation('name', $term, ?$language)` | scope: matches in any language, or one |
| `orderByTranslation('name', 'asc', ?$locale)` | scope: sorts as `->name` reads, as a correlated subquery so pagination stays correct |

Rules:

- The entity has no `name` column. `where('name', …)` and `orderBy('name')` fail; call the two scopes from
  the filter trait. Never join `translations` by hand: a row with two languages comes back twice, and the
  fallback is lost.
- Write `searchTranslation()` to escape `%` and `_` the way `whereLikeText` does. Why: a scope that skips
  the escape lets a search for `100%` match every row.
- Sort in SQL with `orderByTranslation()`, never `->sortBy('name')` after `paginate()`: that orders one page.
- The DTO carries `name` (and `description`) as `array<string, ?string>` keyed by language code. The Action
  cuts it out of the `create()` / `update()` payload with `only([...])` and writes it with
  `touchTranslation()` in the same transaction.
- `touchTranslation()` writes each language's row whole: pass every language and both arrays each time.
  A call with `names` only clears every description; `'en' => null` clears the English name.
- A form sends `name[ar]`, `name[en]`; the Form Request validates `name` as an array, the required
  language `required`, the others `nullable`.
- A queued notification, an export or a payload to another system reads the name in an explicit
  language, never `->name`. Why: `->name` follows the job's locale, not the recipient's.
- A force delete removes the translations; a soft delete keeps them.

Moving an existing column into translations is a data migration: [migrations.md](migrations.md#moving-a-column-into-translations).

## Feature flags (option)

- **Option 1:** wrappers in `Models/Features/{Name}Feature.php` extending a small `Feature` base with a
  static `flag()` returning a flag enum case, plus `enabled()` / `disabled()` and domain helpers. Use when
  one flag is read in many places or needs helper logic around it.
- **Option 2:** call Pennant directly and keep no folder, when a flag is a one-off guard in one Action.

Per-user or per-tenant scoping (`Feature::for($user)`) lives in the Action or Service that needs it, not in
the wrapper.

## Verify

```bash
# Entities generated outside the tree
ls app/Models/ 2>/dev/null

# $guarded = [] on models (prefer $fillable where request data reaches the model)
grep -rn 'guarded = \[\]' src/Domain/*/Models/Entities/

# Accessors doing work before the closure
grep -rn -B3 "return Attribute::" src/Domain/*/Models/Entities/ | grep '\$this->'

# Writes inside entities and model traits
grep -rnE '\->(update|save|delete)\(' src/Domain/*/Models/Entities/ src/Domain/*/Models/Traits/

# where / orderBy on a translated column, and hand-written joins on translations
grep -rnE "(orderBy|where)\('name'" src/Domain/*/Models/Scopes/
grep -rn "join('translations'" src/Domain/
```
