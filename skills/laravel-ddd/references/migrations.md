# Migrations

**Read when:** writing or reviewing a file in `database/migrations/`.
**Owns:** migration syntax, the index policy, foreign keys, naming, `down()`, changing columns, data
migrations, seeded reference rows, append-only tables, migration safety.

## TL;DR

- Anonymous classes only: `return new class extends Migration`.
- Modern helpers: `id()`, `foreignIdFor(Model::class)->constrained()`, `timestamps()`, `softDeletes()`.
- **No indexes by default.** Add one when a real query filters, joins, sorts or groups on the column.
- **A foreign key already has an index.** Never add `->index()` to a `constrained()` column.
- **Never custom-name** an index or constraint; let Laravel name it.
- Every `up()` has a `down()` that reverses it.
- Changing a column restates every attribute it already had.
- Data steps use `DB::table()`, never Eloquent models, and chunk large tables.
- Reference rows that code depends on (lookup rows, settings keys) are seeded in a migration.

## Shape

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class)->constrained()->cascadeOnDelete();
            $table->foreignIdFor(User::class, 'created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('employee_number')->unique();
            $table->unsignedTinyInteger('status');
            $table->string('job_title');
            $table->boolean('is_locked')->default(false);
            $table->json('options')->nullable();
            $table->timestamp('activated_at')->nullable();
            $table->date('hired_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
```

- `foreignIdFor()` over a hand-wired `unsignedBigInteger` + `foreign()`. `ulid()` / `uuid()` when the key
  is public.
- Choose the delete behaviour on every foreign key (`cascadeOnDelete`, `nullOnDelete`, `restrictOnDelete`).
  Seeded lookup rows that enums point at want `SET NULL` or `CASCADE`, so deleting a retired row cleans up.
- Money as integer minor units (or `decimal`), never `float`.
- A status column holds the enum's backing value: `unsignedTinyInteger` for an `int` enum, a `string` sized
  to the longest value for a `string` enum ([enums-and-states.md](enums-and-states.md#enum-shape)).
- A translated name or description gets no column ([models.md](models.md#translated-names)).
- Generate with `php artisan make:migration`; this is one stock generator that is correct in this layout.

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
need one, add it in its own migration and name the query in the PR description, not in a comment.

## Foreign keys are indexed

```php
// ❌ a second, duplicate index
$table->foreignId('user_id')->constrained()->index();

// ✅
$table->foreignIdFor(User::class)->constrained();
```

A composite index whose first column is the foreign key can replace the FK's own index; that is the one
time to think about it, not by default.

## Never custom-name

```php
// ❌
$table->unique('employee_number', 'emp_number_uq');
$table->dropIndex('emp_number_uq');

// ✅
$table->unique('employee_number');
$table->dropUnique(['employee_number']);
```

Applies to `index()`, `unique()`, `foreign()`, `constrained()` and every `drop*()`. Why: hand-picked names
drift between environments and break `up()` / `down()` symmetry. Drop by column list so Laravel derives
the same name it created.

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
- Use the query builder (`DB::table()`), not Eloquent models, inside migrations. Why: a model's casts,
  scopes or observers change later and break an old migration that still has to run on a fresh database.
- Write morph types as the stored string (the morph-map alias or the class name as text), not
  `Model::class` resolved through a model that may be renamed.
- Process large tables in chunks (`chunkById`), and make the step safe to re-run (`upsert`, `insertOrIgnore`,
  or a `whereNull` guard).

### Moving a column into translations

1. One migration copies each row's value into a `translations` row for the language it was written in
   (`DB::table('translations')->upsert(...)` in chunks, keyed on type + id + language), then drops the column.
   `down()` adds the column back, copies that language's name into it and deletes the translation rows.
2. In the same change: the entity uses the translations trait and the column leaves `$fillable`; request,
   DTO and Actions take an array keyed by language; the filter scope switches to the translation scopes
   ([models.md](models.md#translated-names)).
3. Find every reader that used the column in a fixed language (exports, messages, payloads to other
   systems) and give each an explicit language.

## Seeded reference rows

Rows the code depends on by value (lookup rows an enum points at, settings keys, permissions) are seeded in
a migration, not a seeder. Why: seeders run only where someone remembers to run them; migrations run
everywhere, in order.

- Insert with `upsert` on the natural key, so a re-run or a row that already exists is harmless.
- Seed every language of a translated title in the same migration.
- A seeded value cast to an enum must match a case that exists, or the model throws on hydration the first
  time the row is read.
- Removing an enum case whose value is a seeded row id: the same change deletes the row, relying on
  `SET NULL` / `CASCADE` foreign keys ([enums-and-states.md](enums-and-states.md#retiring-a-case)).
- If the values are cached (a settings map), clear that cache key at the end of `up()` and `down()`.

## Append-only tables

A table that must never change after insert (an audit or activity log table) has no `updated_at` and no soft
deletes. Optionally enforce it in the database with triggers that refuse `UPDATE` and `DELETE`, guarded on
the driver if they are driver-specific, and dropped in `down()`. The strongest control is operational: a
database user with only `INSERT` and `SELECT` on that table.

## Safety

- Run `php artisan migrate`. Never `migrate:fresh`, `migrate:refresh` or `db:wipe` against a database that
  holds data you care about, and never as a way to "prepare" a test run.
- Tests run on their own database, forced in `phpunit.xml` ([testing.md](testing.md)).

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

# Eloquent models used inside migrations (review each)
grep -rnE "Models\\\\Entities\\\\[A-Za-z]+::(query|where|create|all)" database/migrations/
```
