# Testing, auditing and security

## What the test suite must prove

A tenancy conversion is a refactor of every layer, so the suite is the safety net. A thin suite (a
few dozen files for a large app) is the biggest non-technical risk. Prove at least:

1. A request on tenant A's host reads A's database, and the same request on B's host reads B's.
2. Each gate status returns its code and the gate view (200, 503, 503, 403, 404).
3. A job dispatched in tenant A runs in A, including a job that rehydrates a model by id that also
   exists in B.
4. A cache key written in A is invisible in B, and a lock taken in A does not block B.
5. A scheduled command touches every tenant, and one tenant's failure doesn't stop the others.
6. A file written in A is not readable through B's disk or URL.
7. Rows on the central connection: reads without a tenant return nothing; creates fill `tenant_id`.
8. A forged `X-Forwarded-Host` does not change the tenant.
9. Every hardcoded id the code relies on exists after provisioning a fresh tenant.

## Test configuration that hides the bugs

- **`CACHE_STORE=array`** hides every cache-key and lock collision: each test gets an empty
  in-process store. Run the isolation tests on the real store (Redis).
- **`QUEUE_CONNECTION=sync`** hides every job-deserialization bug: the job runs in the same request,
  with the tenant still current. Run isolation tests through a real queue driver (database or
  Redis) and a worker step.
- **One hardcoded test database** has no idea of a tenant. Create a central test database and at
  least two tenant databases.
- **An empty base `TestCase`** with no tenant setup means every test author improvises. Give it
  helpers to act inside a tenant and to create a real tenant row.
- **One factory** makes building two tenants' data by hand slow. Add factories before the
  isolation tests.
- **A test that compiles every view** can break when templates read tenant settings before a tenant
  exists. Bind a tenant first.

Run tenancy tests against a dedicated test database, never against a developer's working database,
and never a destructive `migrate:fresh` on a shared one.

## Auditing a single-tenant codebase

`scripts/audit_tenancy.sh` greps for the shapes in this skill and prints candidates by category.
It finds; it does not judge. Read every hit.

```bash
bash scripts/audit_tenancy.sh                 # app src config routes database bootstrap
LIMIT=0 bash scripts/audit_tenancy.sh src     # LIMIT=0: no cap per section
```

For each finding, record severity (blocker · high · medium · low), file:line, the failure in one
sentence, and the fix. Group findings by area (database, storage, cache, jobs, commands, auth,
migrations, config and URLs, notifications, identity, security), and keep two lists apart:

- **blockers**: data from one tenant reaching another, or a feature silently stopping for all
  tenants but one;
- **decisions**: questions the code can't answer (is an end user global or per tenant? one push
  project or many? one currency?). Write each decision down once made.

An audit is a snapshot. Mark it as such, and check the code before trusting an old item.

## Security

Isolation failures that are exploitable, not just wrong:

- **Forged host.** Trusted proxies set to `*` plus a host-based finder: any client picks a tenant
  with `X-Forwarded-Host`. See `request-lifecycle.md`.
- **SSRF.** A public endpoint that fetches a caller-supplied URL (render a PDF from a URL, fetch an
  image) reaches cloud metadata (`169.254.169.254`) and internal services: control-plane credentials
  and every tenant. A regex like `\.pdf$` is bypassed with `?x=.pdf`. Fix with a domain allowlist,
  blocking private and metadata addresses after DNS resolution, and no redirects. This is urgent
  even before tenancy.
- **Unsigned webhooks** that write to the database without a tenant context.
- **Signed public links valid on every tenant** because one app key signs them all.
- **Error reports to one shared channel** carrying tenant data with no tenant tag.
- **A production credentials file committed to the repository root.** Move it to a secret store and
  rotate it.

## Package compatibility

Check each package for global state before the conversion:

| Package kind | Check |
|---|---|
| Horizon | tenant-aware jobs; `HORIZON_PREFIX`; serve the dashboard centrally |
| Telescope | its storage connection: pinned to the default one, it writes into tenant databases |
| Sanctum | token model location; stateful domains for every subdomain |
| Pennant | a `database` store follows the switched connection; `array` is not real storage |
| error tracking (Sentry and similar) | a tenant tag on every event |
| Excel exports | queued exports are jobs (tenant-aware?); chunked reading in a shared worker |
| push and messaging SDKs | one project or account per tenant, or one for all: a decision |
| PDF, image and QR libraries | usually no global state |

The package itself: spatie/laravel-multitenancy v4 needed PHP 8.2+ and Laravel 11–13 at the time of
writing (recorded 2026-10; check its `composer.json`).
