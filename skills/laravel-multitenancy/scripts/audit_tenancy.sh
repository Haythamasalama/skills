#!/usr/bin/env bash
# Grep a Laravel codebase for single-tenant assumptions, grouped by the areas in this skill.
# It finds candidates; it does not judge them. Read every hit.
#
#   bash audit_tenancy.sh                  # app src config routes database bootstrap
#   bash audit_tenancy.sh src app          # only these roots
#   LIMIT=0 bash audit_tenancy.sh          # no cap on hits per section (default 25)
#
# Run it from the project root. Read-only.
set -u

LIMIT="${LIMIT:-25}"
roots=("$@")
[ ${#roots[@]} -eq 0 ] && roots=(app src config routes database bootstrap)

existing=()
for root in "${roots[@]}"; do
  [ -e "$root" ] && existing+=("$root")
done

if [ ${#existing[@]} -eq 0 ]; then
  echo "none of the roots exist here: ${roots[*]}" >&2
  exit 2
fi

cap() {
  if [ "$LIMIT" = "0" ]; then cat; else head -n "$LIMIT"; fi
}

section() {
  printf '\n=== %s\n    %s\n' "$1" "$2"
}

# grep -E over PHP files in the roots; BSD and GNU grep compatible (no \b, no \s)
php_grep() {
  grep -rnE --include='*.php' "$1" "${existing[@]}" 2>/dev/null | grep -v '/vendor/' | cap
}

section "host parsing outside the finder" \
  "Only the tenant finder may read the host."
php_grep 'getHost\(\)|getHttpHost\(\)|HTTP_HOST|SERVER_NAME'

section "trusted proxies" \
  "'*' plus a host-based finder lets X-Forwarded-Host pick the tenant."
php_grep 'trustProxies\(|TrustProxies|proxies[[:space:]]*=[[:space:]]*.\*'

section "static properties (memos that survive the tenant switch in workers)" \
  "Remove, key by tenant, and flush on every switch."
php_grep '(private|protected|public)[[:space:]]+static[[:space:]]+[^(]*\$[A-Za-z_]+'

section "container instances bound at runtime" \
  "Must be forgotten between jobs."
php_grep 'app\(\)->instance\(|->instance\([A-Za-z\\]+::class'

section "tenant data read while providers boot" \
  "Runs before the tenant is known, and once per worker."
providers=$(grep -rlE --include='*Provider.php' 'function boot' "${existing[@]}" 2>/dev/null | grep -v '/vendor/')
if [ -n "$providers" ]; then
  # shellcheck disable=SC2086
  grep -nHE '::(all|pluck|first|get|where|query)\(|DB::(table|select)|Schema::hasTable|config\(\)->set\(|Cache::(remember|get)' $providers | cap
fi

section "cache keys, locks and rate limits" \
  "A key without the tenant collides unless the prefix is switched; check locks too."
php_grep 'Cache::(remember|rememberForever|get|put|forever|lock|forget|tags|add)\(|cache\(\)->|RateLimiter::'

section "overlap and uniqueness locks" \
  "Locked on a name or a model id shared by every tenant."
php_grep 'withoutOverlapping\(|ShouldBeUnique|function uniqueId\(|onOneServer\('

section "queued jobs, closures and batches" \
  "Each must carry its tenant. Check queues_are_tenant_aware_by_default below."
if [ -f config/multitenancy.php ]; then
  grep -nHE "queues_are_tenant_aware_by_default" config/multitenancy.php
else
  echo "    (no config/multitenancy.php)"
fi
php_grep 'implements[^{]*ShouldQueue|dispatch\((function|fn)[[:space:]]*\(|Bus::(batch|chain)\(|NotTenantAware|SerializesModels'

section "raw SQL and builder writes (skip global scopes and model events)" \
  "Write tenant_id yourself; name the connection when it must be the central one."
php_grep 'DB::(statement|insert|update|delete|unprepared|select)\(|DB::table\(|->upsert\(|->insertOrIgnore\(|->toBase\(\)|toRawSql\(\)'

section "hand-written tenant filters and scope escapes" \
  "On a model with a tenant scope, a manual filter is redundant; each escape needs a reason."
php_grep "where\(['\"]tenant_id|withoutGlobalScopes?\(|withoutTenantScope\("

section "absolute URLs built outside a request (jobs, commands, mail, notifications, models)" \
  "route()/url()/asset() there use app.url; stored URLs outlive the domain."
grep -rnE --include='*.php' '(^|[^A-Za-z_>:])(route|url|asset)\(|config\(.app\.url' "${existing[@]}" 2>/dev/null \
  | grep -v '/vendor/' \
  | grep -E '/(Jobs|Commands|Console|Listeners|Notifications|Mail|Mails|Models|Entities|Observers)/' | cap

section "file disks and stored paths" \
  "One root or bucket path for every tenant is one shared folder."
if [ -f config/filesystems.php ]; then
  grep -nHE "'(root|url|bucket|prefix)'[[:space:]]*=>" config/filesystems.php
fi
php_grep "public_path\(['\"](uploads|storage)|Storage::disk\(['\"]local|->storeAs?\(['\"][a-z_]+['\"]"

section "sessions, cookies and stateful domains" \
  "A wildcard session domain with per-tenant session tables loops users out."
for f in config/session.php config/sanctum.php config/cors.php; do
  [ -f "$f" ] && grep -nHE "'(domain|stateful|allowed_origins|supports_credentials|connection)'" "$f"
done

section "env() outside config files" \
  "Frozen by config:cache, and global for every tenant."
grep -rnE --include='*.php' '(^|[^A-Za-z_>:])env\(' "${existing[@]}" 2>/dev/null \
  | grep -v '/vendor/' | grep -v '^config/' | grep -v '/config/' | cap

section "hardcoded ids and constants that become provisioning requirements" \
  "Every new tenant database must contain them, and a test must prove it."
grep -rnE --include='*.php' "[A-Z_]*_ID[[:space:]]*=[[:space:]]*[0-9]+;|['\"][a-z_]+_id['\"][[:space:]]*(=>|===?)[[:space:]]*1[^0-9]|->id[[:space:]]*===?[[:space:]]*1[^0-9]" "${existing[@]}" 2>/dev/null \
  | grep -v '/vendor/' | grep -vE '^[^:]+:[0-9]+:[[:space:]]*case ' | cap

section "inbound webhooks" \
  "No subdomain: resolve the tenant from the path or payload, verify the signature first."
grep -rnEi --include='*.php' 'webhooks?' "${existing[@]}" 2>/dev/null \
  | grep -v '/vendor/' | grep -E '(^|/)routes/|/Routes/' | cap

section "scheduled entries" \
  "Each runs once, globally, unless wrapped in a tenant loop."
for f in bootstrap/app.php routes/console.php app/Console/Kernel.php; do
  [ -f "$f" ] && grep -nHE -- '->(command|job|call|exec)\(' "$f"
done

section "queue bookkeeping and monitoring connections" \
  "job_batches, failed_jobs and Telescope on the switched default connection scatter across tenants."
for f in config/queue.php config/telescope.php config/horizon.php; do
  [ -f "$f" ] && grep -nHE "'(database|connection|prefix|path|domain)'[[:space:]]*=>" "$f"
done

printf '\nDone. Record each real finding with severity, file:line, the failure and the fix.\n'
