# Data, files and identity

Migrations and seeders, file storage, mail and notifications, the platform's own identity baked
into the code, and billing.

## Migrations and seeders

- **Two migration sets: central and tenant.** Keep them in separate paths and know which one you
  are writing. Tenant migrations run per tenant (`php artisan tenants:artisan "migrate --path=database/migrations/tenant --database=tenant"`, adapted to your paths and connection names).
- **A new tenant's database starts from a template of schema plus reference data only.** Never
  from a dump of a live tenant: a dump carries that tenant's users with password hashes and tokens,
  balances and settings into every new tenant. Reference data (countries, cities, banks) is safe to
  copy; operational data is not.
- **A first migration that imports a big SQL dump and truncates the `migrations` table** is
  destructive on any database that already has data. Replace it before using it for provisioning,
  and give it a real `down()` so a failed provisioning can roll back.
- **Data migrations (renames, backfills, dedupes) run on every new, empty tenant database.** Each
  must be idempotent and tolerate empty tables.
- **Stored procedures and triggers are created per tenant database,** and may need the
  `CREATE ROUTINE` privilege for the tenant's database user.
- **`information_schema` queries need `TABLE_SCHEMA = DATABASE()`.** Without it they may read
  another database the user has rights on.
- **Global unique constraints on human values** (`code`, `slug`, `key`) become per tenant for free,
  because each tenant is its own database. That is usually the point.
- **Seeders split into central and tenant.** A `DatabaseSeeder` that mixes both seeds the wrong one.
  Tenant seeders (chart of accounts, default roles, modules, holidays) run as part of provisioning.
- **Hardcoded ids in code** (`country_id = 1`, a base branch `MAIN = 1`, a super-admin id, category
  ids used as logic) become a provisioning requirement: seed them identically in every tenant and
  test that they exist. A message-template seed with `created_by_id` pointing at a person who
  exists in only one database breaks the rest.
- **Seeded content carries the platform's identity** (message templates, emails). Make the default
  seed neutral or fill it per tenant at provisioning.

## File storage

- **One disk root for every tenant is one shared folder.** A local disk rooted at
  `public_path('uploads')` is also directly browsable with no permission check. Root every tenant
  disk under a tenant prefix, switched in a filesystem task, and keep private files off public
  paths.
- **A path with no tenant prefix collides on a shared bucket.** `invoices/{order_id}.pdf` exists for
  every tenant with an order 1. Prefix by tenant in the disk config (`root` on S3-style disks),
  not in each call site.
- **Never store an absolute file URL in a column.** Store the path and the disk; build the URL on
  read from the tenant's host or the disk's URL.
- **Classes that capture `config('filesystems.default')` in a constructor** keep the disk they saw
  first. Resolve the disk at use time.
- **The `public/storage` symlink is one link.** Per-tenant public files need per-tenant serving (a
  route that streams from the tenant disk, or per-tenant prefixes under one link).
- **A CDN purge keyed by one space or zone id** purges for everyone or no one. Make it per tenant.
- **Assets baked into exports** (the logo in every PDF and spreadsheet template, a signature image)
  are the tenant's, not the platform's. Read them from the tenant's settings and disk.
- **Logs** written to one path mix tenants. Tag each log line with the tenant id.

## Mail and notifications

- **The sender identity is the tenant's** (from name, from address, reply-to, SMS sender, messaging
  number). Read it after the tenant is bound, never in a constructor or at boot.
- **Templates stored in the tenant database become per tenant automatically.** Templates in code or
  config do not.
- **Queued notifications and mail are jobs.** They need the tenant like any other job (see
  `workers-and-scheduler.md`).
- **One error-alert channel for every tenant** is acceptable as a control-plane channel, but every
  message must carry the tenant id, and must not dump tenant data.
- **Broadcast channel names collide**: `App.Models.User.{id}` matches user 5 in every tenant on a
  shared broadcast server. Include the tenant in the channel name.
- **Message ids sent to a shared gateway** (SMS) need a tenant discriminator if the gateway echoes
  them back.
- **Observers that read `auth()` inside model events** assume a request with a logged-in user. In a
  job there is none.
- **Push notifications through one project** (one Firebase project) are a business decision: per
  tenant, or one app for one tenant only. Write the decision down.

## The platform's own identity

When a single-company product becomes multi-tenant, every place its own identity is baked in
becomes the tenant's. Inventory it before building, by category:

| Category | Typical places |
|---|---|
| legal and tax identity (legal name, tax number, registration, licence, address) | the footer of every PDF (invoices, waybills, vouchers), a helper that returns a tax number by date |
| name and wordmark | PDF title and author, mail from name, copyright lines, greetings in lang files, alt text in export templates |
| logo and images | PDF and spreadsheet templates, mail layout, default avatars, fallback images |
| domains and links | other panels' URLs in config, reset links, unsubscribe and website links in mail |
| sender identity | default messaging number, default mail sender, alert channels |
| currency and locale | currency symbol helper and font, timezone, default language, phone country code |
| internal defaults | database name, cache, Redis and Horizon prefixes, token prefixes (per deployment, not per tenant) |

- **The legal and tax identity is the sharpest:** it prints on every official document.
- **Half the work is often wiring, not building.** Settings that already exist per tenant (tax
  number, phone, social links) are frequently overridden by a hardcoded value in a template. Wire
  them first, then add the missing fields.
- **Define one "tenant identity" bundle** (legal names in each language, tax number, registration,
  address, phone, email, logo, currency, timezone, locale, sender ids) and read every document and
  message from it.
- **Currency, timezone, language and country are business decisions.** Settle them (are all tenants
  in one country?) before making them dynamic.
- **An internal column named after the old product** (a `<product>_id` reference number) is naming
  debt, not a tenancy item, as long as customers never see the word. Rename it later in its own
  refactor. Signed links that encode that id still need tenant scoping, whatever the column is
  called.

## Billing

- **Plans, subscriptions and invoicing for the SaaS live in the central app.** The tenant app only
  reports usage, through a periodic job that exports counts to the central app.
- **Don't confuse the tenant's own business pricing with SaaS billing.** Order pricing, the tenant's
  tax invoices, rentals, commissions and its chart of accounts are tenant data and logic; moving
  them centrally breaks the product.
- An existing per-period counter (API calls per integration per period) is a good model for usage
  metering. Key it by tenant id when it lives centrally.
