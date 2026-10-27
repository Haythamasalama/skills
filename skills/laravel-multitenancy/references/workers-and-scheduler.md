# Workers, caches and the scheduler

A long-lived worker (Horizon, `queue:work`, Octane) serves tenants one after another in the same
process. Anything that survives between jobs and does not carry the tenant leaks: the database a
job reads, a static memo, a cache key, a lock, a container singleton. The scheduler has the
opposite problem: it runs a command **once**, not once per tenant.

## Queued jobs

### Make them tenant-aware

- Set `queues_are_tenant_aware_by_default` to `true` in `config/multitenancy.php`. Every queued job
  then records the current tenant when dispatched and makes it current before `handle()`.
- Otherwise mark jobs with `Spatie\Multitenancy\Jobs\TenantAware`, or list them under
  `tenant_aware_jobs`. Mark control-plane jobs `NotTenantAware` (or list them under
  `not_tenant_aware_jobs`), and read `isolation.md` for what that changes.
- A tenant-aware job whose tenant is gone (deleted first) fails with
  `CurrentTenantCouldNotBeDeterminedInTenantAwareJob`. Expect it in `failed_jobs` after a tenant is
  removed.
- **Closures:** the interfaces can't be put on a closure. The package covers closures when queues
  are tenant-aware by default; otherwise capture the tenant and run the body inside
  `$tenant->execute(fn () => …)`.
- **Batches, chains and their callbacks, queued listeners, notifications and mailables** are not
  covered in the package's docs (checked 2026-10-28). Test that they run in the right tenant before
  relying on them.

### What goes wrong in a job that is not

| Shape | Failure |
|---|---|
| `SerializesModels` | the model is re-fetched by id on the worker's **current** connection. Ids repeat across tenant databases, so it loads another tenant's row and writes to it |
| a numeric id stored in the payload and looked up in `handle()` | the same, by hand |
| a query in the constructor, the send in `handle()` | the constructor ran in the right tenant; `handle()` did not |
| raw SQL built at dispatch (`toRawSql()`) and run in the worker | runs against whichever database is bound |
| `DB::table()` updates inside the job | same, with no model to notice |
| `failed()` writing a status | runs on the wrong database too |
| a payload carrying the tenant's credentials | stale after rotation; resolve credentials inside `handle()` instead |

### Where queue bookkeeping lives

`job_batches` and `failed_jobs` on the default connection follow the switch and scatter across
tenant databases. Decide: central (one place to look, plus a tenant id column) or per tenant. Point
`queue.batching.database` and `queue.failed.database` at that connection explicitly.

### Shared queues are a shared blast radius

- One tenant's backlog is every tenant's latency. Give heavy work its own queue and supervisor, and
  consider per-tenant fairness for exports and imports.
- A supervisor with `processes=1` and `timeout=0` lets one hung job freeze that queue for every
  tenant. Set a timeout.
- Worker memory is shared: an export that loads a whole result set (twice) can OOM the worker and
  drop other tenants' jobs. Chunk or cursor; never an unbounded `->get()` in a report.
- The Horizon dashboard on a shared Redis shows every tenant's jobs, and with web middleware it is
  reachable on every tenant subdomain. Serve it from the central app only.
- Error alerts from failed jobs to one shared channel carry tenant data with no tag. Tag every
  report with the tenant id.

## Static memos and container state

`private static array $cache` in an action, a helper or a trait survives the switch and hands the
first tenant's values to the next. It is the sharpest edge, because it bypasses the cache layer and
its per-tenant prefix completely. The worst case is a memo of decrypted integration secrets.

- Remove the static state, **or** key it by tenant id, **and** clear it on every switch from the
  memo-flush task (see `request-lifecycle.md`). A `flush()` method nobody calls does nothing.
- The same for `app()->instance(...)` bindings made in middleware, and for traits that keep static
  arrays of per-request data.
- Find them: `grep -rnE "(private|protected|public)[[:space:]]+static[[:space:]]+[^(]*\\\$" app src`.

## Cache keys and locks

- **A cache key with no tenant in it is a cross-tenant read** unless the cache prefix is switched.
  Enable the package's `PrefixCacheTask`; it changes `cache.prefix` per tenant.
- Keys built **before** the switch (at boot, in a constructor) land in the wrong namespace.
- **Verify that locks pick up the prefix** in your Laravel and cache-driver versions. A lock named
  after an id (`order-{id}-end`) that repeats across tenants blocks another tenant's operation.
- Keys that embed a user or employee id (idempotency keys, permission caches, rate limits) collide
  across tenants: the same id exists in every tenant database. An idempotency cache that stores a
  full response replays one tenant's response to another.
- `Cache::tags()` works only on stores that support tags (Redis, Memcached). A cache switcher that
  changes the store breaks it.
- `rememberForever` on tenant data is a leak that never expires.
- `ShouldBeUnique::uniqueId()` built from a model id collides across tenants. Include the tenant id.
- The Horizon and Redis prefixes come from `APP_NAME` by default; they are per deployment, not per
  tenant. That is fine as long as nothing assumes otherwise.

## Scheduled commands

**A scheduled command runs once, globally, unless it is wrapped in a tenant loop.** Under
database-per-tenant, an unwrapped command works on one tenant's database (or the central one) and
silently skips the rest.

- Make your own commands tenant-aware with the package's trait
  `Spatie\Multitenancy\Commands\Concerns\TenantAware`, and add `{--tenant=*}` to the signature. With
  no `--tenant` option the command runs for every tenant; `--tenant=1` runs one.
- For commands you can't edit (framework or package commands), use
  `php artisan tenants:artisan "migrate --force"`, or `--tenant=123` for one.
- Since a non-zero inner exit code makes `tenants:artisan` exit with `1`, scheduler failure hooks can
  see it. Add `--continue-on-error` for maintenance where each tenant is independent, so one tenant's
  exception doesn't stop the rest; custom commands support it with `{--continue-on-error}`.
- Separate the few control-plane commands (pruning monitoring data, central cleanup) and keep them
  global.

Under the tenant count:

- `withoutOverlapping()` locks on the command name, so one slow tenant blocks all of them.
- `everyMinute()` × N tenants can exceed the minute. Chunk the work, and make sure the command has
  an overlap guard.
- Daily commands at 00:00 × N tenants pile up serially. Spread them.
- Anything per tenant that calls a third party (token refreshes every few minutes) multiplies by the
  tenant count. Check the vendor's limits.
- A command that deletes files (orphan uploads, expired exports) must run per tenant, on that
  tenant's disk. Otherwise it deletes from the wrong one.
