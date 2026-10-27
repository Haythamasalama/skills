# A control-plane app and the tenant app

A common split: a **control-plane app** (the central admin) owns the tenant registry, plans,
provisioning and billing; the **tenant app** serves the tenants. They share the central database
connection and a queue, and talk only through jobs.

## The same-class-name trick

A job is serialized with its fully qualified class name. If both apps declare a class with the
**identical FQCN**, one app can dispatch it and the other can run it, with no HTTP API between them.

```php
// declared in BOTH apps, same namespace and name
namespace App\Tenancy\Jobs;

final class ProvisionTenant implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable;

    public function __construct(public int $tenantId) {}

    public function handle(): void
    {
        // the real body lives in the app that consumes this queue;
        // the other app's copy is a stub with the same constructor
    }
}
```

Rules:

- **The payload is the tenant id only.** Everything else is read from the registry when the job
  runs, so a retried job never acts on stale data.
- **Keep the constructor signature identical in both copies.** A renamed property breaks
  unserialization in the other app.
- **The control plane makes no vendor calls of its own.** When its screens need a vendor's answer
  (import a company's records, install an integration), it queues a same-FQCN job; the tenant app
  makes the call and sends the answer back with another same-FQCN job that the control plane runs
  (`ImportTenantCompany` → `TenantCompanyImported`). The control plane owns what the answer means.
- **One queue per direction.** Requests go on a queue the tenant app consumes; answers go on a queue
  only the control plane consumes. Neither app should ever pick up a job it only has a stub for.
- **Retries, backoff and timeout are the consumer's.** The supervisor that runs the queue decides
  them; tries declared on the producer's stub don't apply. Set them where the job runs.
- **Mark these jobs `NotTenantAware`** in the tenant app when they act on the registry rather than
  inside one tenant, and make the tenant current explicitly where needed
  (`Tenant::find($this->tenantId)->execute(fn () => …)`). See `isolation.md`.
- **Write the contract down**: job names, payloads, queues, which app consumes which, and the status
  transitions each job may make (`provisioning` → `active` or `provisioning_failed`).

## Shared enums

The tenant status enum (and any other value both apps compare) must be byte-identical in both apps.
A case renamed in one app silently fails every comparison in the other. Treat it as part of the
contract, and test it (for example, compare `cases()` against a fixture both repos share).

## Redis isolation

When both apps (or a tenant app beside an older single-tenant product) share one Redis server:

- distinct `APP_NAME` (cache and Horizon prefixes default from it);
- distinct `REDIS_PREFIX`;
- distinct Redis database numbers for cache and queues;
- distinct `HORIZON_PREFIX`.

Otherwise cache keys, queues and Horizon dashboards collide, and a worker in one app can pick up the
other's jobs.

## Provisioning checklist

1. Create the registry row with status `provisioning` (control plane).
2. Dispatch the provisioning job with the tenant id.
3. Tenant app: create the database and user, run tenant migrations, run tenant seeders (schema and
   reference data only), create the first admin with the ids the code expects, write the tenant
   identity bundle.
4. On success set `active`; on failure set `provisioning_failed` with the error, and leave the
   database for inspection or drop it, by a written rule.
5. The finder's gate shows 503 for both `provisioning` and `provisioning_failed`, so a visitor never
   reaches a half-built tenant.
