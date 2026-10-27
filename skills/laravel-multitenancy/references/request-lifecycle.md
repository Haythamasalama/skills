# The request lifecycle

How a request becomes one tenant's: the finder and its gates, when the switch happens relative to
middleware, the switch tasks, and everything that reads the environment before or outside that
switch (boot code, URLs, config, webhooks, sessions).

## The finder

The only code that reads the host. Extend the package's base class and point the `tenant_finder`
config key at it.

```php
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

final class SubdomainTenantFinder extends TenantFinder
{
    public function findForRequest(Request $request): ?IsTenant
    {
        $root = config('tenancy.root_domain');              // example.test
        $host = $request->getHost();

        if (! Str::endsWith($host, '.'.$root)) {
            return null;                                   // the central site, a webhook host
        }

        $tenant = Tenant::withTrashed()                    // if the model soft-deletes
            ->where('subdomain', Str::beforeLast($host, '.'.$root))
            ->first();

        $code = match (true) {
            $tenant === null || $tenant->trashed() => 404,
            $tenant->status === TenantStatus::Active => null,
            $tenant->status === TenantStatus::Suspended => 403,
            default => 503,                                // provisioning, provisioning_failed
        };

        if ($code !== null) {
            throw new HttpResponseException(response()->view('tenant::gate', [
                'status' => $tenant?->status->value ?? 'unknown',
            ], $code));
        }

        return $tenant;
    }
}
```

- **Gate before making the tenant current.** A suspended tenant must never get its database bound.
- **A branded gate view for every state**, never a raw error page. It takes the status string.
- **Register the view namespace in a provider's `register()`.** The package resolves the tenant
  while providers boot; a namespace added in `boot()` loses the race and the gate 500s.
- **Nothing else parses the host.** Grep for `getHost(`, `getHttpHost(`, `HTTP_HOST` outside the
  finder.

## When the switch happens

The package determines the current tenant while service providers boot, so the switch has run
before any middleware, as long as no provider reads tenant data in its own `boot()`. Then:

- Add the package's `NeedsTenant` middleware (no tenant → abort) and `EnsureValidTenantSession`
  (a session minted for one tenant cannot be replayed on another) to the tenant route group, in
  `Spatie\Multitenancy\Http\Middleware`. `EnsureValidTenantSession` needs the session started, and
  it must run before authentication.
- If you resolve the tenant in a middleware of your own instead, it must run before
  `SubstituteBindings` (route model binding queries the database), `StartSession` and auth. Put it
  in the middleware priority list.

## Switch tasks

Everything tenant-scoped is switched in a task, in the order listed under `switch_tenant_tasks`.
A task implements `Spatie\Multitenancy\Tasks\SwitchTenantTask`:

```php
public function makeCurrent(IsTenant $tenant): void;
public function forgetCurrent(): void;   // restore the original environment
```

Tasks are singletons, so they can keep the original values in properties. In queue workers and
Octane, `forgetCurrent()` is the only thing that restores the central environment: write it as
carefully as `makeCurrent()`.

A working order:

| Task | Switches | Notes |
|---|---|---|
| database (shipped: `SwitchTenantDatabaseTask`) | the tenant connection's database name | name from the tenant row |
| session | where sessions live, or the cookie name | see "Sessions and identity" |
| filesystem | each tenant disk's root or path prefix and URL | then `Storage::forgetDisk()` so the next call rebuilds it |
| cache prefix (shipped: `PrefixCacheTask`) | `cache.prefix` | verify locks pick it up too |
| flush in-process memos | static properties, container singletons | must also run in `forgetCurrent()` |
| per-tenant secrets key | the key that decrypts the tenant's stored integration credentials | loaded from the central registry, never a shared env key |
| forced root URL | `app.url` and `URL::forceRootUrl()` | so `route()` and `url()` build the tenant's host in jobs too |
| locale (and timezone) | `app()->setLocale()`, `date_default_timezone_set()` | only if they are per tenant |

```php
final class ForceTenantRootUrlTask implements SwitchTenantTask
{
    private ?string $original = null;

    public function makeCurrent(IsTenant $tenant): void
    {
        $this->original ??= config('app.url');
        $url = 'https://'.$tenant->subdomain.'.'.config('tenancy.root_domain');

        config(['app.url' => $url]);
        URL::forceRootUrl($url);
    }

    public function forgetCurrent(): void
    {
        config(['app.url' => $this->original]);
        URL::forceRootUrl($this->original);
    }
}
```

```php
final class FlushInProcessMemosTask implements SwitchTenantTask
{
    public function makeCurrent(IsTenant $tenant): void
    {
        $this->flush();
    }

    public function forgetCurrent(): void
    {
        $this->flush();
    }

    private function flush(): void
    {
        // every class that keeps a static memo exposes a flush and is listed here
        SettingsMemo::flush();
        IntegrationConfigMemo::flush();
        app()->forgetInstance(CurrentBranch::class);
    }
}
```

## Boot-time reads

A provider that reads tenant data in `boot()` (settings into `config()`, a `Schema::hasTable()`
check, a `pluck()`) runs before the tenant is known in a web request, and **once** in a queue
worker. The first tenant's values then serve every later job.

- Load tenant settings lazily after the switch, or in a switch task, and drop them in
  `forgetCurrent()`.
- `Schema::hasTable()` at boot runs on whatever connection is current. Don't.
- A middleware that binds a model into the container (`app()->instance(Branch::class, …)`) must be
  undone between jobs; register it with the memo flush task.

## URLs and config outside a request

- `route()`, `url()` and `asset()` in a job, command, mail or notification build on `app.url`,
  which is one tenant's domain at best. The forced-root-URL task fixes this for tenant-aware jobs;
  anything else must build from the tenant row.
- **Never store an absolute URL in a column** (export links, activity logs, notification payloads).
  Store the path (and disk), and build the URL when it is read. A stored URL outlives the domain it
  was built from.
- A helper that returns "the dashboard URL" from `config('app.url')` gives every tenant the same
  domain.
- Domains of other panels or sites hardcoded in `config/services.php` become per tenant or central.
- Feature flags read from `env()` are global. If plans grant features, the tenant's plan (from the
  central registry) is the source; a Pennant `database` store follows the switched connection.

## Inbound webhooks

A vendor calls one fixed URL with no subdomain, so there is no tenant to resolve.

- Put the tenant in the path (`/webhooks/{tenant}/vendor`), or resolve it from an id in the payload
  (a vendor account or phone-number id) through a routing table on the central connection.
- **Verify the signature before any query.**
- Then make the tenant current explicitly: `$tenant->execute(fn () => …)`.
- Verification handshakes (a verify token) are per tenant too: compare against that tenant's
  token, not a global one.
- A webhook handled without a tenant writes to the central database, or the last tenant bound in
  the worker. Both are silent.

## Trusted proxies

`trustProxies(at: '*')` lets any client send `X-Forwarded-Host: other.example.test`, and a
host-based finder then serves another tenant's database. Before the finder ships:

- trust only the load balancer's addresses, or
- trust the proxy but not the forwarded host, for example
  `trustProxies(at: '*', headers: Request::HEADER_X_FORWARDED_FOR | Request::HEADER_X_FORWARDED_PORT | Request::HEADER_X_FORWARDED_PROTO)`.

`$request->ip()` checks behind a proxy depend on the same setting.

## Sessions and identity

- **A session store shared across tenants is a shared login.** Keep sessions in the tenant
  database (they follow the switched connection when `session.connection` is null) or prefix them
  per tenant.
- **`SESSION_DOMAIN` must not be a wildcard when sessions live in the tenant database.** Tenant A's
  cookie is sent to tenant B, not found there, and the user lands in a logout loop.
- **Decide early whether an end user is per tenant or a global identity.** It drives where users,
  tokens and unique rules live.
- **Sanctum:** stateful domains must cover each tenant subdomain, and a token stored in the tenant
  database can only be resolved after the switch.
- **Unique validation (`unique:users,email`) becomes per tenant** once each tenant has a database.
  Usually correct; decide it, don't discover it.
- **Password reset, invite and remote-login links** must carry the tenant's host. Their tokens live
  in the tenant database.
- **Signed or encrypted public links (`/documents/{hash}`) made with one app key are valid on every
  tenant.** Bind the tenant into the signature, or use a per-tenant key.
- **Hardcoded ids (super admin = 1, role = 1, default branch = 1)** become a provisioning
  requirement: every new tenant database must have them, and a test must prove it.
- **CORS** that accepts any origin with credentials, across every subdomain, is an open door.
