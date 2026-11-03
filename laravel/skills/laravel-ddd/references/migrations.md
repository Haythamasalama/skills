# Migrations

**Read when:** writing or reviewing a file in `database/migrations/`.
**Owns:** syntax, the index policy, foreign keys, naming, `down()`, changing columns, data migrations.
**See also:** [models-scopes-abilities-enums.md](models-scopes-abilities-enums.md) · runtime query
performance: [queries.md](queries.md)

## TL;DR

- Anonymous classes only: `return new class extends Migration`.
- Modern helpers: `id()`, `foreignIdFor(Model::class)->constrained()`, `timestamps()`, `softDeletes()`.
- **No indexes by default.** Add one when a real query filters, joins, sorts or groups on the column.
- **A foreign key already has an index.** Never add `->index()` to a `constrained()` column.
- **Never custom-name** an index or constraint; let Laravel name it.
- Every `up()` has a `down()` that reverses it.
- Changing a column restates every attribute it already had.

## Shape

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Customer::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('number')->unique();
            $table->unsignedTinyInteger('status');
            $table->char('currency', 3);
            $table->unsignedBigInteger('total')->default(0);
            $table->json('options')->nullable();
            $table->timestamp('issued_at')->nullable();
            $table->date('due_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
```

- `foreignIdFor()` over a hand-wired `unsignedBigInteger` + `foreign()`.
- Choose the delete behaviour on every foreign key (`cascadeOnDelete`, `nullOnDelete`, `restrictOnDelete`).
  Seeded lookup rows that enums point at want `SET NULL` or `CASCADE`, so deleting a retired row cleans up.
- Money as integer minor units (or `decimal`), never `float`.
- Generated with `php artisan make:migration`; this is one of the stock generators that is correct here.

## No speculative indexes

```php
// ❌ every column "just in case"
$table->string('name')->index();
$table->string('email')->index();
$table->string('phone')->index();

// ✅ add an index with the query that needs it
$table->string('name');
$table->string('email')->unique();
$table->string('phone');
```

Why: every index slows each write and takes space; an index nobody queries is pure cost. When a query does
need one, add it in its own migration and say which query in the PR, not in a comment.

## Foreign keys are indexed

```php
// ❌ a second, duplicate index
$table->foreignId('customer_id')->constrained()->index();

// ✅
$table->foreignIdFor(Customer::class)->constrained();
```

A composite index whose first column is the foreign key can replace the FK's own index; that is the one
time to think about it, not by default.

## Never custom-name

```php
// ❌
$table->unique('number', 'inv_number_uq');
$table->dropIndex('inv_number_uq');

// ✅
$table->unique('number');
$table->dropUnique(['number']);
```

Why: hand-picked names drift between environments and break `up()` / `down()` symmetry. Drop by column
list so Laravel derives the same name it created.

## `down()`

`down()` reverses `up()` exactly: drop what was created, recreate what was dropped, restore what changed.
A migration that cannot be reversed (it drops a column holding data, or backfills irreversibly) says why in
one line inside `down()`, rather than leaving `down()` empty by habit. If a migration installs triggers or
other database objects, `down()` drops them before dropping the table.

## Changing a column

```php
// ❌ silently drops nullable() and the default
$table->string('notes', 2000)->change();

// ✅ restate every attribute it had
$table->string('notes', 2000)->nullable()->default(null)->change();
```

## Data migrations

- Keep schema and data changes in separate migrations when the data step can fail on real rows.
- Use the query builder (`DB::table()`), not Eloquent models, inside migrations; a model's casts, scopes or
  observers may change later and break an old migration.
- Process large tables in chunks (`chunkById`).
- Removing an enum case whose value is a seeded row id: the same PR deletes the row in a migration.

## Append-only tables

A table that must never change after insert (an audit or ledger table) has no `updated_at` and no soft
deletes. Optionally enforce it in the database with triggers that refuse `UPDATE` and `DELETE`, guarded on
the driver if they are driver-specific, and dropped in `down()`. The strongest control is operational: a
database user with only `INSERT` and `SELECT` on that table.

## Safety

- Run `php artisan migrate`. Never `migrate:fresh`, `migrate:refresh` or `db:wipe` against a database that
  holds data you care about, and never as a way to "prepare" a test run.
- Tests run on their own database, forced in `phpunit.xml`; see [testing.md](testing.md).

## Verify

```bash
# Named migration classes instead of anonymous
grep -rn "^class .* extends Migration" database/migrations/

# ->index() chained onto a foreign key
grep -rn "constrained()" database/migrations/ | grep "index()"

# Custom-named indexes and constraints
grep -rnE "->(index|unique|foreign|primary)\([^)]*,\s*'" database/migrations/

# Migrations without a down()
grep -rL "function down" database/migrations/*.php
```
