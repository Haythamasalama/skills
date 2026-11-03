# Security rules

**Read when:** adding a route, a Form Request, a permission check, raw SQL, unescaped output, a throttle,
a public link, or anything that handles secrets.
**Owns:** fail-closed authorization, route protection, validation and mass assignment, raw SQL bindings,
XSS, secrets and config, rate-limit keys, public document links.
**See also:** [sensitive-operations.md](sensitive-operations.md) · [anti-patterns.md](anti-patterns.md) ·
controllers and Form Requests: [laravel-ddd](../../laravel-ddd/references/controllers-requests-api.md)

## TL;DR

- **Fail closed.** No matching permission, policy or rule means deny, with a reason, and record it.
- The **server is the boundary**. A hidden button is a courtesy; every route and Action re-checks.
- Every route sits inside its authenticated group. File and export routes check the linking page's permission.
- Validate every input in a Form Request. Writes use `validated()`. Prefer `$fillable`.
- Values never enter SQL text; they are bound. Identifiers come from an allowlist.
- `{{ }}` escapes. `{!! !!}` on user content goes through a sanitizer, always.
- Secrets never appear in responses, logs, DTOs, exceptions or the repository.
- `config()` outside `config/`, never `env()`.
- Throttle keys are templates with named, non-blank parts. Security codes use `random_int()`.

## Fail closed

- Deny by default: an unknown permission, a missing policy, an unparseable input, an unresolved scope.
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
| May this user act on **this** record now? | `Gate::authorize()` / the record's ability, in the method |
| Should the UI offer it? | the same answer, sent to the page |

A permission middleware and the Action behind it ask the **same** service, so a screen and its Action can
never disagree.

### Multi-tenant apps

A stranger to the tenant gets **404**; a member without the permission gets **403**. Why: a 403 to a
stranger confirms the tenant exists and turns guessable handles into an enumeration tool. Every query is
scoped to the tenant; the most likely leak is a filter DTO that never declared its tenant property.

## Routes

- Every route of a panel is inside that panel's authenticated group. A route declared **after** the inner
  `auth` group closes runs with no login at all, and domain code that sees "no actor" may treat it as "no
  restriction". Move the route into the group; do not patch it with an inline `abort(401)` or a one-off
  `->middleware('auth')`.
- Only the guest flow is exempt: login, password reset, a language switch used by the login page.
- A route that returns a file (PDF, export, download, print view) checks, at the top of the method and
  before any lookup, the permission of the page that links it. Reuse that permission; do not invent a new
  `*.pdf` permission. Why: helper route prefixes (`ajax.*`) are often outside the permission middleware,
  and login alone would let any user fetch any document by walking ids.

```php
public function pdf(int $id): Response
{
    abort_unless($this->currentUser()->hasPermission('invoices.show'), 403);

    $invoice = $this->invoices->getInvoice($id) ?? abort(404);
    // …
}
```

## The current user inside a domain

A domain class never calls `auth()`, `Auth::user()` or `request()->user()`. It asks one seam (a
`CurrentUser` contract bound once in a provider, or a single helper) and handles **null**, which is the
ordinary answer in a queue job, a command or a test. Why: code that reads the session answers differently
off a request, and a scope that treats "no user" as "no filter" leaks. Do not thread an `$actorId`
parameter through every signature either; read it at the one place that records it. An actor that is an
input to the operation (`$ownerId`, `$approverId`) is a real parameter, named for what it is.

## Validation and mass assignment

- Every endpoint that reads input has a Form Request. Never `$request->validate()` or `Validator::make()`
  in a controller or a domain class.
- Writes hydrate from `validated()`. Never `Model::create($request->all())`.
- `$fillable` on models that take user input. `$guarded = []` only where every write goes through a DTO and
  an Action that lists the columns; never on a new user-input model.
- Fields that must never come from a client (`is_admin`, `owner`, `with_trashed`, a tenant id) are absent
  from the rules, or pinned by the server after the spread.
- Validate the shape you accept: a field taking one value or a list needs a rule for both shapes and a DTO
  property typed for both.

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
- `DB::raw()` and `new Expression()` cannot carry bindings. If a raw piece needs a value, run the whole
  statement with `DB::update($sql, $bindings)` or `DB::select($sql, $bindings)`.
- Cast ids with `array_map('intval', $ids)` before they reach SQL; cast text with `(string)`.
- Hand quoting (`'{$value}'`) and `addslashes()` are not escaping. They fail on `O'Neil`, turn `\n` in a
  path into a newline, and hand the SQL to whoever types into the field.
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

Test such code with an apostrophe, a backslash, an injection string and non-ASCII text, each stored verbatim.

## Output escaping

| Content | Pattern |
|---|---|
| Plain text | `{{ $value }}` |
| Plain text with line breaks | `{!! nl2br(e($value)) !!}` |
| Rich user HTML (editor content, notes) | `{!! clean_html($value) !!}` through an HTML sanitizer |
| HTML the server generated (pagination, components) | `{!! $value !!}` |

Every `{!! !!}` on user content goes through the sanitizer; anything else is an XSS hole. In Vue, `v-html`
follows the same rule.

## Secrets and sensitive data

- API Resources are the whitelist of what leaves the server; hashes, tokens, codes and keys are never listed.
  Add them to `$hidden` as well.
- Secrets at rest use the `encrypted` cast or a secret store. They are decrypted only where used, held only
  as long as needed, and never put in a DTO, an event, a job payload, a log line, an exception message or a
  response.
- Scrub DSNs, tokens and headers before logging. Never `dd()` / `dump()` a live client or connection.
- Error messages shown to users never echo rows, payloads or internals.
- Read settings with `config()`. `env()` outside `config/` returns null once config is cached.
- Never commit `.env*`, the app key, credentials, dumps or exported data.
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

- Fill the template by name; reject a missing, blank or unknown part (check unknown first, so a typo is
  reported under the name used). Normalise parts (trim, lowercase, safe characters); hash very long keys.
- Scope every key by guard or user type, so one person with two account types does not share a bucket and
  clearing one does not clear the other.
- Every action has explicit limits; a missing entry fails loudly rather than going unlimited.
- A short secret (a 4–6 digit code) also needs a **persisted** attempt counter that burns the code, because
  a rate limiter may be disabled or reset in some environments.
- `random_int()`, never `rand()` or `mt_rand()`, for codes, tokens and anything security-bearing.

## Public document links

Links that open a document without signing in are authorized by the token alone.

- Use Laravel signed URLs (`URL::signedRoute()`, optionally temporary), or an HMAC token whose **type** is
  inside the MAC, so a token minted for one kind of document never opens another kind, even for the same id.
- One token type per document kind; never mint a token of one type for another entity's id.
- Never authorize with reversible encryption that has no MAC or a static IV: its output for id N is
  predictable and forgeable.
- Add a test matrix that tries every token type against every route.

## Installers and setup screens

A first-run or setup screen closes once setup completes, and cannot be reopened without signing in as an
existing administrator. Why: an open setup screen is an account takeover.

## Verify

```bash
# Inline validation
grep -rn "\$request->validate(\|Validator::make(" src/ app/

# Unescaped Blade output (each needs a sanitizer or a reason)
grep -rn "{!!" resources/views/ src/Presentation/ 2>/dev/null

# env() outside config/
grep -rn "\benv(" src/ app/ --include='*.php'

# rand() where random_int() belongs
grep -rnE "\b(mt_)?rand\(" src/ app/ --include='*.php'

# Auth facade or request() inside the domain
grep -rnE "auth\(|Auth::|request\(\)" src/Domain/

# Interpolated raw SQL (review each)
grep -rnE "(DB::(raw|select|statement|update)|Raw)\(\"[^\"]*\{\\\$" src/
```
