---
name: laravel-multitenancy
description: Use when building, converting or reviewing a multi-tenant Laravel SaaS (database per tenant, usually with spatie/laravel-multitenancy) — resolving the tenant from the subdomain, switch tasks for the database, cache, files, sessions and URLs, the central registry connection, tenant status gates (provisioning, active, failed, suspended → 503/403/404), tenant-aware queues and scheduled commands, rows on the central connection that belong to one tenant, provisioning and cross-app jobs between a control-plane app and the tenant app, and auditing a single-tenant codebase for what breaks. Triggers include TenantFinder, switch tenant, tenant-aware job, cache prefix per tenant, "tenant A sees tenant B's data", «تعدد المستأجرين», «مستأجر», «قاعدة بيانات لكل عميل».
---

# Multi-tenant Laravel

For a Laravel app where each tenant has its own database, found from the request's subdomain, with
a fixed **central** connection that holds the tenant registry. The package is
spatie/laravel-multitenancy v4 (API checked against its docs on 2026-10-28). The package's own docs
use a different word for the central database; search them for `database_connection_name`.

## TL;DR

- **The tenant finder is the only host-aware code.** Nothing else reads the host or parses
  subdomains.
- **Status gates live in the finder**, before the tenant is made current: active → serve;
  provisioning or failed → 503; suspended → 403; unknown or deleted → 404. Each renders a branded
  gate view, never a raw error.
- **All tenant switching happens in switch tasks**, listed in order in `config/multitenancy.php`.
  Never switch something ad hoc in a controller or a job.
- **The central connection is fixed.** Never switch it, and don't write tenant data there except
  through a row-level tenant scope.
- **Long-lived workers are where tenancy leaks**: static properties, container singletons, config
  set at boot and cache keys without a tenant survive the switch and serve the next tenant.
- **Jobs and scheduled commands must carry their tenant.** A job that is not tenant-aware runs
  against whatever database the worker last bound; a scheduled command runs once, not per tenant.
- **Trusting every proxy makes a forged `Host` a tenant selector.** Fix it before the finder ships.
- **A cache key, lock, file path, signed link or broadcast channel without the tenant in it
  collides across tenants** the moment the prefix or root is not switched.
- Prove isolation with two tenants in tests, on a real cache store and a real queue driver. The
  array cache and the sync queue hide most of these bugs.

## How a request becomes a tenant's

```
Host: acme.example.test
  → tenant finder (reads the subdomain, looks up the central `tenants` table, gates by status)
  → tenant made current → switch tasks run, in order:
      database · session · filesystem · cache prefix · flush in-process memos
      · per-tenant secrets key · forced root URL · locale
  → middleware: route model binding, session, auth (all after the switch)
  → controller
```

The finder must run before `SubstituteBindings`, `StartSession` and authentication. Route model
binding queries the database; a session or a token looked up before the switch reads the wrong
database. Details and code sketches: [references/request-lifecycle.md](references/request-lifecycle.md).

## Rules to keep

- **Status is an enum, cast on the tenant model.** Compare against enum cases, not strings. If two
  apps share the registry (a control-plane app and the tenant app), keep the enum byte-identical in
  both. Pick one value for a failed provisioning (`provisioning_failed` or `failed`) and use it
  everywhere.
- **Register the gate view's namespace in a provider's `register()`, never `boot()`.** The package
  resolves the tenant during the providers' boot phase, so a namespace registered in `boot()` loses
  the race and the gate itself 500s ("View [tenant::gate] not found"). After moving the gate view or
  tenancy classes, run `php artisan view:clear`: stale compiled views also 500 the gate.
- **The tenant's database name comes from the tenant row** (`getDatabaseName()`); the default
  connection is the one swapped per request.
- **A task's `forgetCurrent()` must restore the original environment.** Tasks are singletons; in
  queue workers and Octane, `forgetCurrent()` is the only thing that puts the central environment
  back.
- **Isolate Redis per app** when two apps share one server: distinct `APP_NAME`, `REDIS_PREFIX`,
  Redis database numbers and `HORIZON_PREFIX`. Otherwise their caches, queues and Horizon
  dashboards collide.
- **Cross-app jobs keep the identical class name (FQCN) in both apps**, and their payload is the
  tenant id only. See [references/cross-app.md](references/cross-app.md).
- **Rows on the central connection that belong to one tenant carry a tenant scope trait** that
  fails closed. See [references/isolation.md](references/isolation.md).

## Which reference

| Working on | Read |
|---|---|
| the finder, gates, middleware order, switch tasks, URLs, config, sessions, webhooks | [request-lifecycle.md](references/request-lifecycle.md) |
| a table on the central connection that holds tenant rows | [isolation.md](references/isolation.md) |
| a queued job, a static memo, a cache key or lock, a scheduled command | [workers-and-scheduler.md](references/workers-and-scheduler.md) |
| a migration, a seeder, an upload, a mail or notification, branding, billing | [data-files-identity.md](references/data-files-identity.md) |
| a control-plane app that provisions tenants and talks to the tenant app | [cross-app.md](references/cross-app.md) |
| tests, an audit of a single-tenant codebase, security | [testing-and-audit.md](references/testing-and-audit.md) |

## Converting a single-tenant app

Audit before you build. Most findings fall into the same dozen shapes, and the audit script finds
candidates for each:

```bash
bash scripts/audit_tenancy.sh            # app src config routes database bootstrap
LIMIT=10 bash scripts/audit_tenancy.sh src
```

Then, in roughly this order (blockers first):

1. separate the central and tenant connections and migration paths;
2. the finder, the gate, and the middleware order; fix trusted proxies;
3. switch tasks for database, cache prefix, files, sessions, root URL;
4. boot-time reads of tenant data, and static memos in long-lived workers;
5. tenant-aware jobs, then the scheduler (a tenant loop per command);
6. inbound webhooks (resolve the tenant from the path or payload);
7. stored absolute URLs, file paths, the platform's own identity baked into templates;
8. tests with two tenants on a real cache and queue.

Record each finding with severity and file:line, but treat an audit as a snapshot: check the code
before trusting an old item.

## Verify a change

Keep one demo tenant per state in the registry and hit each after a change:

```bash
for t in active provisioning failed suspended unknown; do
  printf "%-13s " "$t"; curl -sk -o /dev/null -w "%{http_code}\n" "https://$t.example.test/"
done
# expect: 200 503 503 403 404
```

Then prove a job dispatched in one tenant runs in that tenant, and that a cache key written in one
tenant is invisible in another (see [testing-and-audit.md](references/testing-and-audit.md)).

## Gotchas

- A lockfile that needs a newer PHP than the machine runs: `composer … --ignore-platform-req=php`,
  and the same flag on `composer dump-autoload`. A plain dump-autoload on the older PHP can break the
  app.
- `config:cache` freezes `env()` reads. Per-tenant values come from switch tasks, never from `env()`
  outside config files.
