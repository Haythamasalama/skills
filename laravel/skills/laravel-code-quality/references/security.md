# Security rules

**Read when:** adding a route, a Form Request, a permission check, a query scope, raw SQL, unescaped
output, a throttle, a public link, or anything that handles secrets.
**Owns:** fail-closed authorization, multi-tenant status codes, row-level visibility, route protection,
the current user inside domain code, validation and mass assignment, raw SQL bindings, XSS, secrets and
config, rate-limit keys, public document links.

## TL;DR

- **Fail closed.** No matching permission, policy or rule means deny, with a reason, and record it.
- The **server is the boundary**. A hidden button is a courtesy; every route and operation re-checks.
- Every route sits inside its authenticated group. File and export routes check the linking page's permission.
- Row visibility is declared once on the model and applies to every query and every notification.
- Validate every input in a Form Request. Writes use `validated()`. Prefer `$fillable`.
- Values never enter SQL text; they are bound. Identifiers come from an allowlist.
- `{{ }}` escapes. `{!! !!}` on user content goes through a sanitizer, always.
- Secrets never appear in responses, logs, DTOs, exceptions or the repository. `config()`, never `env()`,
  outside `config/`.
- Throttle keys are templates with named, non-blank parts. Security codes use `random_int()`.

## Fail closed

- Deny by default: an unknown permission, a missing policy, an unparseable input, an unresolved scope.
- An empty list of allowed ids narrows the query to **no rows**, never drops the filter. `whereIn('id', [])`
  is safe in Laravel, but code that skips the filter "when the list is empty" (`when($ids, …)`) shows
  everything. Why: an empty array is falsy, so the restriction vanishes exactly when it matters most.
- Never infer one permission from another (`invoices.approve` does not imply `invoices.create`).
- Permissions are a fixed vocabulary in code (an enum). A permission string on a route that is not a real
  case aborts with an error instead of reading as "allowed". Why: a permission only exists if code checks
  it; one typed into a database guards nothing.
- Never decide access from a role's **name**; roles are editable data. Read the permissions the role holds.
- When a user holds several roles, permissions are the **union**. Do not invent a ranking: granting one
  role must never take away what another already gave.
- Ownership or seniority may reach everything administratively, but never skips a review that exists so a
  second person looks (no self-approval), and never skips a safety guard.
- Record denials as well as successes; denials are what you need later.

## Authorization layers

| Question | Where |
|---|---|
| Is anyone signed in, with the right guard? | route group middleware |
| May this user use this page or action at all? | permission middleware or a Policy on the route |
| May this user act on **this** record now? | `Gate::authorize()` / a Policy or ability class, in the method |
| Which rows may this user see? | a global scope declared on the model (below) |
| Should the UI offer it? | the same answer, sent to the page |

A permission middleware and the operation behind it ask the **same** service, so a screen and its
operation can never disagree. Authorization lives in Policies or ability classes, not inline in a
controller body.

### Multi-tenant apps

A stranger to the tenant gets **404**; a member without the permission gets **403**. Why: a 403 to a
stranger confirms the tenant exists and turns guessable handles into an enumeration tool. Every query is
scoped to the tenant; the most likely leak is a filter DTO that never declared its tenant property.

## Row-level visibility

When users see only some rows (their branch, their assigned customers), declare that rule **once**, on the
model, as a global scope, and read it everywhere: lists, lookups by id, exports and notification
recipients.

- Never hand-write the same constraint in a filter or an operation (`whereHas('customer', fn … whereIn(…
  $user->assignedIds()))`). Why: lists and notifications drift apart, and the next screen forgets it.
- The rule has two halves that must agree: one constrains a query, one judges a row already loaded (for
  notifications and policies). Test both against the same cases.
- A notification about a record reaches only the users who may see that record. A subject model with no
  visibility rule reaches **everyone** who holds the notification, so pass the record that carries the rule.
- Lift the scope (`withoutGlobalScope(...)`) only for integrity guards (a check that a line is not already
  billed must see every row, or a restricted user could double-bill it), cross-tenant reports and system
  jobs. Never lift it to make a row appear on a user's screen.
- `whereHas()` on a relation applies the related model's own global scopes. Decide whether you want that;
  a nested visibility check may need them removed on purpose.
- Adding a visibility rule to a model filters **every** query on it. Before shipping, find callers that load
  rows across users (reports, guards, jobs) and lift the scope there deliberately.

## Routes

- Every route of a panel is inside that panel's authenticated group. A route declared **after** the inner
  `auth` group closes runs with no login at all, and domain code that sees "no actor" may treat it as "no
  restriction". Move the route into the group; do not patch it with an inline `abort(401)` or a one-off
  `->middleware('auth')`.
- Only the guest flow is exempt (login, password reset, and what those pages call before sign-in).
- An XHR to a protected route gets a 401 from the middleware, not a login redirect, because
  `expectsJson()` is true for `X-Requested-With: XMLHttpRequest`.
- A route that returns a file (PDF, export, download, print view) checks, at the top of the method and
  before any lookup, the permission of the page that links it. Reuse that permission; do not invent a new
  `*.pdf` permission. When several pages link the file, any one of their permissions passes. Why: helper
  routes (search endpoints, file endpoints) often sit outside the permission middleware, and login alone
  would let any user fetch any document by walking ids.

```php
public function pdf(int $id): Response
{
    abort_unless($this->currentUser()->hasPermission('invoices.show'), 403);

    $invoice = $this->invoices->getInvoice($id) ?? abort(404);
    // …
}
```

## The current user inside domain code

Business logic (operation classes, query scopes) never calls `auth()`, `Auth::user()` or
`request()->user()`. It asks one seam (an interface such as `CurrentUser`, bound once in a service
provider) and handles **null**, which is the ordinary answer in a queue job, a command or a test.

- The binding narrows the result to the type it promises, so a guard wired to the wrong user provider
  resolves to no actor, never to the wrong one.
- Decide once what "no actor" means. If it means "unrestricted" (jobs, commands), every web route must sit
  behind `auth`, so a request can never arrive as "no actor".
- Why: code that reads the session answers differently off a request, and a test has no way to say who
  is acting.
- Do not thread an `$actorId` parameter through every signature; read it at the one place that records
  it. An actor that is an input to the operation (`$ownerId`, `$approverId`) is a real parameter.

## Validation and mass assignment

- Every endpoint that reads input has a Form Request, index pages included. Never `$request->validate()`
  or `Validator::make()` in a controller or in domain code.
- Writes and filters hydrate from `validated()`. Never `Model::create($request->all())`.
- `$fillable` on models that take user input. `$guarded = []` only where every write goes through a DTO and
  an operation that lists the columns; never on a new user-input model.
- Fields that must never come from a client (`is_admin`, `owner_id`, `with_trashed`, a tenant id) are
  absent from the rules, or pinned by the server after the spread.
- Reuse the framework's validation messages; add a new translation key only when nothing fits.

### One value or a list

Filters often arrive as one value (`id=5`) or a list (`id[]=5&id[]=6`). Write two small reusable rules
and combine them instead of repeating `array` + `max` + `.*` lines on every field:

| Rule | Checks | Rejects |
|---|---|---|
| a shape rule (`StringOrArray`) | a string, or a flat list of strings or integers; each value and the list length capped | `true`, a nested list, an over-long string or list |
| an id rule (`ValidId`) | every value is a whole number written only with digits, inside a range | `abc`, `1.5`, `1e3`, `+5`, ` 5`, `05`, `0`, `-3`, a number past the integer limit |

```php
'id' => ['nullable', new StringOrArray, new ValidId],      // one id or a list
'customer_ids' => ['nullable', 'array', new ValidId],      // a list only
'reference' => ['nullable', new StringOrArray],            // text or a list of text
```

- The id rule does not prove the row exists; add `exists:` when a write needs it.
- The DTO property for a two-shape field is typed `string|array|null`, and the scope handles both shapes
  (`Arr::wrap()`). A `?string` or `?array` property throws a `TypeError` on the other shape. If the DTO
  takes one shape, validate that shape alone.
- The record id a user picked from a list (`id`) and the reference number a user types (`INV-0042`) are
  different filters. The typed number is `['nullable', 'string', 'max:255']` and matched against the
  reference column; it never goes through the id rule.

## SQL

```php
// ❌
DB::select("SELECT * FROM customers WHERE email = '{$email}'");
->selectRaw("SUM(CASE WHEN status = '{$status}' THEN total END) AS t")

// ✅
Customer::query()->where('email', $email)->first();
DB::select('SELECT * FROM customers WHERE email = ?', [$email]);
->selectRaw('SUM(CASE WHEN status = ? THEN total END) AS t', [$status])
```

- Only fixed SQL is concatenated; every value is a `?` binding, in placeholder order.
- `selectRaw`, `whereRaw`, `havingRaw` and `orderByRaw` take bindings as their second argument; use it.
- `DB::raw()` and `new Expression()` cannot carry bindings. If a raw piece needs a value, run the whole
  statement with `DB::update($sql, $bindings)` or `DB::select($sql, $bindings)`.
- Cast ids with `array_map('intval', $ids)` before they reach SQL; cast text with `(string)` when a
  cleared field must store `''`.
- Hand quoting (`'{$value}'`) and `addslashes()` are not escaping. They fail on `O'Neil`, turn `\n` in a
  path into a newline on MySQL, and hand the SQL to whoever types into the field.
- Existing code that int-casts ids and quotes text with `DB::getPdo()->quote()` is escaped correctly;
  leave it, and bind in new code.
- Dynamic identifiers (columns, sort fields, tables) are not bindable: pick them from an allowlist, never
  from input.
- For decisions on structured text (SQL, HTML, URLs), parse it with a real parser; never trust a regex.
- Values the code owns (an enum `->value`, a constant) may be inlined; if you cannot tell where a value
  came from, bind it.

A bound bulk update:

```php
$ids = array_map('intval', $ids);
$cases = '';
$bindings = [];

foreach ($ids as $i => $id) {
    $cases .= ' WHEN ? THEN ?';
    array_push($bindings, $id, (string) $notes[$i]);
}

$in = implode(',', array_fill(0, count($ids), '?'));

DB::update("UPDATE invoices SET notes = CASE id{$cases} END WHERE id IN ({$in})", [...$bindings, ...$ids]);
```

Test such code by storing an apostrophe, a backslash, an injection string (`x'; DROP TABLE invoices; --`)
and non-ASCII text, asserting each comes back verbatim, with an untouched neighbour row proving the
`WHERE` still scopes.

## Output escaping

| Content | Pattern |
|---|---|
| Plain text | `{{ $value }}` |
| Plain text with line breaks | `{!! nl2br(e($value)) !!}` |
| Rich user HTML (editor content, notes, comments) | `{!! clean_html($value) !!}` through an HTML sanitizer |
| HTML the server generated (pagination, components) | `{!! $value !!}` |

Every `{!! !!}` on user content goes through one sanitizer helper that strips scripts, event handlers and
dangerous attributes; anything else is an XSS hole.

## Secrets and sensitive data

- API Resources are the whitelist of what leaves the server; hashes, tokens, codes and keys are never
  listed. Add them to `$hidden` as well.
- Secrets at rest use the `encrypted` cast or a secret store. They are decrypted only where used, held only
  as long as needed, and never put in a DTO, an event, a job payload, a log line, an exception message or a
  response.
- Scrub DSNs, tokens and headers before logging. Never `dd()` / `dump()` a live client or connection.
- Error messages shown to users never echo rows, payloads or internals.
- Read settings with `config()`. `env()` outside `config/` returns null once config is cached.
- `.env*`, the app key, credentials, dumps and exported data never go into the repository.
- Leave CSRF protection on for web routes; APIs use tokens.

## Rate limits and throttle keys

```php
// ❌ concatenated: every user without a phone shares the bucket "--verify"
$key = "{$user->country_code}-{$user->phone}-verify";

// ✅ a named template; a blank or unknown part throws
enum ThrottleAction: string
{
    case VERIFY_PHONE = 'verify-phone:{guard}:{phone}';

    public function limits(): array
    {
        return match ($this) {
            self::VERIFY_PHONE => ['attempts' => 5, 'decay' => 600],
        };
    }
}
```

- Fill the template by name. Reject an unknown part first (so a typo is reported under the name used),
  then a missing or blank one. Trim with a Unicode-aware trim, so a non-breaking space cannot open a
  second bucket.
- Normalise parts (lowercase, a safe character set). Truncate very long keys with a digest suffix so two
  long keys sharing a prefix stay distinct.
- Scope every key by guard or user type, so one person with two account types does not share a bucket and
  clearing one does not clear the other.
- Every action has explicit limits; a missing entry throws rather than going unlimited (no `default`
  branch in `limits()`).
- A short secret (a 4–6 digit code) also needs a **persisted** attempt counter that burns the code, because
  the rate limiter may be disabled outside production.
- When you change the key-building signature, a test asserts every call site uses the template; a missed
  one is a runtime `TypeError`, not a compile error.
- `random_int()`, never `rand()` or `mt_rand()`, for codes, tokens and anything security-bearing.

## Public document links

Links that open a document without signing in are authorized by the token alone.

- Use Laravel signed URLs (`URL::signedRoute()`, optionally temporary), or an HMAC token whose **type** is
  inside the MAC, so a token minted for one kind of document never opens another kind, even for the same id.
- One token type per document kind, and only that kind's ids. A kind that is never routed still gets its
  own type, so its token cannot double as a link.
- Never authorize with reversible encryption that has no MAC or a static IV: its output for id N is
  predictable and forgeable. If an old helper like that must stay to rebuild names that already exist,
  give it no decrypt path.
- Keep a test matrix that tries every token type against every public route; adding a route adds a row.

## Verify

These find existing code too. Treat the output as a review list scoped to what you changed.

```bash
# Inline validation
grep -rn "\$request->validate(\|Validator::make(" src/ app/

# Unescaped Blade output (each needs a sanitizer or a reason)
grep -rn "{!!" resources/views/ src/ 2>/dev/null

# env() outside config/
grep -rn "\benv(" src/ app/ --include='*.php'

# rand() where random_int() belongs
grep -rnE "\b(mt_)?rand\(" src/ app/ --include='*.php'

# Hand-built throttle keys
grep -rn "throttleKey(\|RateLimiter::" src/ app/ | grep -v "ThrottleAction::"

# Interpolated raw SQL and addslashes (review each)
grep -rnE "(DB::(raw|select|statement|update)|Raw)\(\"[^\"]*\{\\\$" src/ app/
grep -rn "addslashes(" src/ app/ --include='*.php'

# Routes with no auth middleware (expect only the guest flow and deliberate public routes)
php artisan route:list --json | python3 -c "import json,sys;[print(r['uri']) for r in json.load(sys.stdin) if not any(str(m).startswith(('auth','Illuminate\\\\Auth')) for m in r['middleware'])]"
```
