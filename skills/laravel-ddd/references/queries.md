# Queries

**Read when:** writing an Eloquent query inside an Action, a filter scope, or a list endpoint.
**Owns:** where queries live, the `whereByType` / `whereLikeText` macros, eager loading, counting,
polymorphic existence checks, chunking, column selection.
**See also:** [models-scopes-abilities-enums.md](models-scopes-abilities-enums.md) ·
[core-kernel.md](core-kernel.md) · generic query performance: the Laravel best-practices skill

## TL;DR

- Queries live in Actions and scopes. Never in Services, controllers, Blade, Resources or DTOs.
- Every list query for an entity goes through its one `scopeFilterBy()`.
- `whereByType` for one-or-many values; `whereLikeText` for text search. Never a hand-written `LIKE`.
- Eager-load with `with()` / `withCount()` on the query that runs; nothing may lazy-load during rendering.
- Count with `count()`, test with `exists()`. Never load rows to count them.
- Pass explicit types to `whereHasMorph()`; a bare `whereHas()` on a `morphTo` scans the table first.
- `chunkById()` or `cursor()` past about a thousand rows. Select only the columns you need, always with `id`.

## One path per entity

```php
// ❌ filtering spread across a controller
$query = Invoice::query();
if ($request->status) {
    $query->where('status', $request->status);
}
return $query->paginate();

// ✅ the controller builds a DTO; the Action runs the scope
$invoices = $this->invoices->getInvoices(FilterInvoiceData::fromArray($request->validated()))->pagination();
```

A new filter is then one DTO property plus one `when()` line.

## The macros

```php
// ❌ branching by hand
if (is_array($filters->status)) {
    $query->whereIn('status', $filters->status);
} elseif ($filters->status !== null) {
    $query->where('status', $filters->status);
}

// ✅
$query->when($filters?->status, fn (Builder $q) => $q->whereByType('status', $filters->status));
```

```php
// ❌ user input can carry % and _, and case rules differ by collation
$query->where('name', 'like', "%{$filters->name}%");

// ✅ escaped, case-insensitive, every term must match
$query->whereLikeText('name', $filters->name);
```

Macros are helper classes with one static `handle()` in `Domain\Core\Helpers`, registered in
`CoreServiceProvider::boot()`. Add a new cross-cutting query utility the same way: the helper holds the
logic (and its tests), the provider holds one line. See [core-kernel.md](core-kernel.md).

## Eager loading

```php
// ❌ N+1: one query per invoice, twice
foreach (Invoice::all() as $invoice) {
    echo $invoice->customer->name, $invoice->lines->count();
}

// ✅
$invoices = $this->invoices->getInvoices($filters, withRelations: ['customer'], withCount: ['lines'])->pagination();
```

- The caller states what it needs through `$withRelations` / `$withCount`; the Service forwards them.
- Inertia props and API Resources serialize everything you hand them. A model with unloaded relations
  lazy-loads per row during serialization. Load first, then pass.
- In Resources, guard relations with `$this->whenLoaded('customer')`.
- Turn on `Model::preventLazyLoading(! app()->isProduction())` so a missing eager load fails in
  development instead of slowing production.

## Counting and existence

```php
// ❌ fetches and hydrates every matching row
$open = $this->invoices->getInvoices($filters)->collection()->count();

// ✅ one SELECT COUNT(*)
$open = $this->invoices->getInvoices($filters)->count();
$any = $this->invoices->getInvoices($filters)->exists();
```

This matters most on hot paths: menu badges, dashboard tiles, anything that runs on every page.

## Polymorphic existence

```php
// ❌ runs SELECT DISTINCT attachable_type FROM attachments on every build, then the EXISTS
Attachment::query()->whereHas('attachable');

// ✅ explicit targets, no discovery scan
Attachment::query()->whereHasMorph('attachable', Attachment::ATTACHABLE_TYPES);
```

Same for `whereDoesntHave()` on a `morphTo`.

## Large result sets

```php
// processing that writes as it goes
Invoice::query()->filterBy($filters)->chunkById(500, function (Collection $invoices) {
    foreach ($invoices as $invoice) {
        RecalculateInvoiceTotal::handle($invoice);
    }
});

// read-only streaming (exports)
foreach (Invoice::query()->filterBy($filters)->cursor() as $invoice) {
    yield InvoiceExportRow::fromModel($invoice);
}
```

Use `chunkById()` over `chunk()` when the loop changes the rows, or offsets shift and rows are skipped.

## Selecting columns

```php
// ❌ every column, including wide text and JSON, for a dropdown
Product::query()->filterBy($filters)->get();

// ✅
Product::query()->filterBy($filters)->select(['id', 'name'])->get();
```

Always include the primary key; relations and later `find()` calls need it. Dropdown and autocomplete
endpoints are hot and should always project.

## Relationships across domains

Declare relations on the entity and follow Laravel's key conventions (`customer_id`). A relation to another
domain's entity is fine for eager loading and display, but querying or writing through it from outside
the owning domain is still a boundary breach; go through that domain's Contract.

## Raw SQL

Only fixed SQL text is ever concatenated. Every value travels as a binding: `selectRaw('... = ?', [$v])`,
`DB::update($sql, $bindings)`. `DB::raw()` cannot carry bindings, so a raw piece that needs a value means
running the whole statement with bindings. The full rule, with a bound bulk `CASE` update, is anti-pattern
#40 in the code-quality skill's [anti-patterns.md](../../laravel-code-quality/references/anti-patterns.md).

## Verify

```bash
# Loading rows to count them
grep -rnE "->(get|collection|all)\(\)->(count|isEmpty|isNotEmpty)\(\)" src/

# Bare whereHas on a polymorphic relation (review each)
grep -rnE "whereHas\('[a-z_]*able'" src/

# Hand-written LIKE
grep -rnE "'like'|\"like\"|LIKE '%" src/Domain/

# Queries in Blade views
grep -rnE "::(where|find|all|query)\(" resources/views/ src/Presentation/*/Views/ 2>/dev/null
```
