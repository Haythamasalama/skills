# Row-level isolation on the central connection

The package isolates a tenant by **swapping its database connection**. A table in the tenant
database needs nothing else: the connection cannot see another tenant's rows. Tables on the
central connection never get that swap. When such a table holds rows that belong to one tenant
(grants, per-tenant config, usage counters, a request ledger), a query there sees **every** tenant
unless something narrows it. The package leaves row-level scoping to the application; a trait does
it in one place instead of at every call site.

## TL;DR

- Does a row belong to one tenant? Then it carries the trait, whatever connection it sits on.
  Fleet data (one row for everybody: the app catalogue, plan definitions) must not.
- Reads filter themselves and **fail closed**: no current tenant matches no rows.
- Creates fill `tenant_id` themselves. Don't pass it, and keep it out of `$fillable`.
- **Never** write `where('tenant_id', …)` by hand on a model with the trait.
- A cross-tenant read asks for it by name: `withoutTenantScope()`.
- Raw SQL, `upsert()` and query-builder writes reach **neither** half. Write the column yourself
  there, and say why in a comment.
- A `NotTenantAware` job has no current tenant: its reads see nothing and its scoped writes miss.

## The trait

```php
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Tenant;

trait BelongsToTenant
{
    public static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $query): void {
            $tenant = Tenant::current();

            $tenant
                ? $query->where($query->qualifyColumn('tenant_id'), $tenant->getKey())
                : $query->whereRaw('1 = 0');
        });

        static::creating(function (Model $model): void {
            $model->tenant_id ??= currentTenantId();
        });
    }

    public function scopeWithoutTenantScope(Builder $query): Builder
    {
        return $query->withoutGlobalScope('tenant');
    }
}
```

| Half | Behaviour | No current tenant |
|---|---|---|
| read | global scope on `tenant_id` | `where 1 = 0`: matches nothing |
| create | `tenant_id ??= currentTenantId()` | throws (no current tenant) |

Fail-closed reads follow the same rule as permissions: without a tenant, the answer is nothing,
never everything. `??=` on create lets an explicit `tenant_id` win; that is for the few jobs that
carry their tenant in the payload, and each needs a comment saying which one.

## Two helpers

| Helper | Returns | Use for |
|---|---|---|
| `tenant()` | `?Tenant` | branching: "is there a tenant at all?" |
| `currentTenantId()` | `int`, throws when none | a write that has no safe default |

A read may reasonably run without a tenant and get nothing. A write has nowhere safe to land, so it
stops. Never `tenant()->id` in a write path: it is a null dereference wearing a helper's clothes.

## Reading

```php
// ✅ the scope is already on it
IntegrationConfig::where('key', $key)->first();

// ❌ the filter twice, and the hand-written half is weaker
IntegrationConfig::where('tenant_id', tenant()?->id ?? 0)->where('key', $key)->first();
```

`?? 0` was a common idiom and is worse than it looks: with no tenant it hunts for `tenant_id = 0`
instead of refusing to answer.

Relations inherit the scope from the related model, so a `hasMany` onto a tenant-owned table needs
no `tenant_id` clause of its own.

### Crossing tenants on purpose

```php
IntegrationGrant::withoutTenantScope()->where('integration_id', $id)->get();
```

If you cannot say in one line why this query may see another tenant's rows, it may not.

## Writing

```php
// ✅ the trait fills it
IntegrationRequest::create(['name' => $data->name, 'reason' => $data->reason]);

// ❌ a value the model already knows, carried through a DTO and a controller to get here
IntegrationRequest::create(['tenant_id' => $data->tenant_id, 'name' => $data->name]);
```

Take `tenant_id` out of `$fillable`. The trait assigns the attribute directly, so it doesn't need
to be fillable, and once it is gone a payload cannot name the tenant at all.

## What the scope cannot reach

The scope is an Eloquent **query** scope and the fill is an Eloquent **model event**. Neither sees:

- raw SQL: `DB::statement()`, `DB::insert()`, `DB::unprepared()`;
- query-builder writes: `DB::table(...)->insert()`, `->update()`;
- `Model::upsert()` and `insertOrIgnore()`, which skip model events by design;
- anything through `toBase()`.

In those paths `tenant_id` is yours to write: run them through `withoutTenantScope()` and put the
column in the row. Typical cases: a ledger that opens a pending row with a plain `insert()`, and
usage counters that move every period in one `upsert()`.

**A raw statement on the default connection lands in the tenant database**, even after the model is
pinned to the central connection. Name the connection explicitly in raw SQL that must hit the
central database.

## `NotTenantAware` jobs

A job marked `Spatie\Multitenancy\Jobs\NotTenantAware` does not get its tenant back when it runs.
Inside `handle()`, `tenant()` is `null`, and both halves of the trait change meaning:

- **Reads return nothing.** Not an error. A counter reads `0`, and a rate limiter built on it never
  fires. Fail-closed on a table of absences is fail-open for the feature above it.
- **Scoped writes miss.** An `update()` filtered by the scope matches no row, and the work silently
  does nothing.

```php
// ✅ found by the idempotency key the payload carried
LedgerEntry::withoutGlobalScopes()
    ->where('idempotency_key', $entry->idempotency_key)
    ->where('status', LedgerStatus::Pending->value)
    ->update([...]);

// ❌ reads as if a tenant is current; it is not
LedgerEntry::where('idempotency_key', $entry->idempotency_key)->update([...]);
```

Use `withoutGlobalScopes()` rather than `withoutTenantScope()` when the model carries another scope
that hides the very row you need (a `settled` scope hiding the `pending` row being closed). Carry
the tenant id in the payload for anything downstream that needs it.

## Secrets on the central connection

Per-tenant third-party credentials indexed only by a local key (an auto-increment id from a tenant
database) collide across tenants once they live centrally. Key them by tenant id **and** the local
key, and encrypt them with a per-tenant key loaded in a switch task.

## Tests

- Put the central connection in the test case's `$connectionsToTransact`, so a central write rolls
  back with its test. A test file that writes there needs `RefreshDatabase` or
  `DatabaseTransactions`, or its rows leak into the next file.
- Bind a tenant for reads with a lightweight helper; create a real `tenants` row as soon as a
  foreign key points at it.

## Verify

```bash
# hand-written tenant filters on scoped models: should print nothing
grep -rn "where('tenant_id'" --include='*.php' app src

# queries that step around the scope: each must name its tenant another way
grep -rn "withoutTenantScope()\|withoutGlobalScopes()" --include='*.php' app src

# every NotTenantAware job, read against the two failure modes above
grep -rln "NotTenantAware" --include='*.php' app src
```
