# Queries

**Read when:** writing an Eloquent query inside an Action or a scope, or building a list, count or
dropdown endpoint.
**Owns:** where queries live, the `whereByType` / `whereLikeText` macros, eager loading, counting,
polymorphic existence checks, chunking, column selection, raw SQL.

## TL;DR

- Queries live in Actions and model scopes. Never in Services, controllers, views, Resources or DTOs.
- Every list query for an entity goes through its one `scopeFilterBy()` ([models.md](models.md#the-filter-trait)).
- `whereByType` for one-or-many values; `whereLikeText` for text search. Never a hand-written `LIKE`.
- A translated `name` has no column: `searchTranslation()` / `orderByTranslation()`.
- Eager-load with `with()` / `withCount()` on the query that runs; nothing lazy-loads while rendering.
- Count with `count()`, test with `exists()`. Never load rows to count them.
- Pass explicit types to `whereHasMorph()`; a bare `whereHas()` on a `morphTo` scans the table first.
- `chunkById()` or `cursor()` past about a thousand rows. Select only the columns you need, always with `id`.
- Every value in raw SQL travels as a binding.

## One path per entity

```php
// ❌ filtering spread across a controller
$query = Employee::query();
if ($request->status) {
    $query->where('status', $request->status);
}
return $query->paginate();

// ✅ the controller builds a DTO; the list Action runs the scope
$employees = $this->employees->getEmployees(FilterEmployeeData::fromArray($request->validated()))->pagination();
```

```php
/** @extends GetDataAbstract<Employee> */
final class GetEmployees extends GetDataAbstract
{
    public function query(): Builder
    {
        return Employee::query()->filterBy($this->data);
    }
}
```

A new filter is then one DTO property plus one `when()` line. Sorting, paging and column selection come
from the `FilterData` base and are applied by `GetDataAbstract` ([core-kernel.md](core-kernel.md)), so the
scope never handles them.

## The macros

```php
// ❌ branching by hand
if (is_array($filters->status)) {
    $query->whereIn('status', $filters->status);
} elseif ($filters->status !== null) {
    $query->where('status', $filters->status);
}

// ✅ scalar, array, enum case or null, one call
$query->when($filters?->status, fn (Builder $q) => $q->whereByType('status', $filters->status));
```

```php
// ❌ user input can carry % and _, and case rules differ by collation
$query->where('name', 'like', "%{$filters->name}%");

// ✅ escaped, case-insensitive, every term must match
$query->whereLikeText('name', $filters->name);
```

- `whereByType` already handles `string|array|null`, so a filter that may receive either needs no branch of
  its own. Why the macro: the next time a column starts accepting a list, every hand-written branch is a
  place that was not updated.
- Never hand-write `LIKE`, inside a scope or anywhere else. Why: a user searching `100%` must not match
  every row.
- The macros are helper classes in `Domain\Core\Helpers` registered in the Core provider. A new
  cross-cutting query utility is added the same way: the helper holds the logic and its tests, the provider
  holds one line ([core-kernel.md](core-kernel.md)).

## Translated columns

```php
->when($filters?->search, fn (Builder $q) => $q->searchTranslation('name', $filters->search))
->when($filters?->sort_by_name, fn (Builder $q) => $q->orderByTranslation('name'))
```

An entity whose name lives in a `translations` table has no `name` column; `where('name')` and
`orderBy('name')` fail, and a hand join duplicates rows. The trait and its rules:
[models.md](models.md#translated-names).

## Eager loading

```php
// ❌ N+1: one query per employee, twice
foreach (Employee::all() as $employee) {
    echo $employee->user->name, $employee->contacts->count();
}

// ✅ the caller declares what it needs
$employees = $this->employees->getEmployees($filters, withRelations: ['user'], withCount: ['contacts'])->pagination();
```

- `Get{Entity}s` takes `$withRelations` and `$withCount`, and the Service **forwards** them to `for()`.
  Why: a Service that declares them but calls `GetEmployees::for($data)` drops them, and every caller N+1s
  while the signature looks right ([contracts-and-services.md](contracts-and-services.md)).
- Inertia props and API Resources serialize everything handed to them. A model with unloaded relations
  lazy-loads per row during serialization. Load first, then pass.
- In Resources, guard relations with `$this->whenLoaded('user')` ([json-api.md](json-api.md)).
- Turn on `Model::preventLazyLoading(! app()->isProduction())` so a missing eager load fails in
  development instead of slowing production.
- Never query from a view.

## Counting and existence

```php
// ❌ fetches and hydrates every matching row
$active = $this->employees->getEmployees($filters)->collection()->count();

// ✅ one SELECT COUNT(*)
$active = $this->employees->getEmployees($filters)->count();
$any = $this->employees->getEmployees($filters)->exists();
```

Same for `isEmpty()` / `isNotEmpty()` on a loaded collection. This matters most on hot paths: menu badges,
dashboard tiles, anything that runs on every page.

## Polymorphic existence

```php
// ❌ runs SELECT DISTINCT attachable_type FROM attachments on every build, then the EXISTS
Attachment::query()->whereHas('attachable');

// ✅ explicit targets, no discovery scan
Attachment::query()->whereHasMorph('attachable', Attachment::ATTACHABLE_TYPES);
```

Same for `whereDoesntHave()` on a `morphTo`. The type list is a constant on the model that owns the
`morphTo` ([models.md](models.md#entities)).

## Large result sets

```php
// processing that writes as it goes
Employee::query()->filterBy($filters)->chunkById(500, function (Collection $employees) {
    foreach ($employees as $employee) {
        SyncEmployeeProfile::handle($employee);
    }
});

// read-only streaming (exports)
foreach (Employee::query()->filterBy($filters)->cursor() as $employee) {
    yield EmployeeExportRow::fromModel($employee);
}
```

Use `chunkById()` over `chunk()` when the loop changes the rows. Why: `chunk()` pages by offset, and an
update that moves rows out of the filter makes the next page skip some.

## Selecting columns

```php
// ❌ every column, including wide text and JSON, for a dropdown
Department::query()->filterBy($filters)->get();

// ✅
Department::query()->filterBy($filters)->select(['id', 'name'])->get();
```

- Always include the primary key. Why: relations, `find()` and route generation need it, and a missing key
  makes Eloquent reload the row.
- Dropdown and autocomplete endpoints are hot and always project.
- For a large column that list queries should never load by default, use the hidden-columns scope instead
  of projecting at every call site ([models.md](models.md#heavy-columns)).

## Relationships across domains

A relation to another domain's entity is fine for eager loading and display. Querying or writing through it
from outside the owning domain is a boundary breach; go through that domain's Contract
([architecture.md](architecture.md)).

## Raw SQL

Only fixed SQL text is ever concatenated. Every value travels as a binding: `selectRaw('... = ?', [$v])`,
`DB::update($sql, $bindings)`. `DB::raw()` cannot carry bindings, so a raw piece that needs a value means
running the whole statement with bindings. A bulk `CASE` update follows the same rule: the `WHEN ? THEN ?`
pieces are fixed text, and every id and value goes into the bindings array.

## Verify

```bash
# Loading rows to count them
grep -rnE "->(get|collection|all)\(\)->(count|isEmpty|isNotEmpty)\(\)" src/

# Bare whereHas on a polymorphic relation (review each)
grep -rnE "whereHas\('[a-z_]*able'" src/

# Hand-written LIKE
grep -rnE "'like'|\"like\"|LIKE '%" src/Domain/

# Queries outside Actions and scopes
grep -rnE "::(query|where|find|create)\(" src/Domain/*/Services/ src/Presentation/

# Queries in views
grep -rnE "::(where|find|all|query)\(" resources/views/ 2>/dev/null
```
