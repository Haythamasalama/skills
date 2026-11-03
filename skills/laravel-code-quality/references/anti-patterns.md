# Anti-patterns

**Read when:** reviewing a diff, or checking whether a shape is a known mistake.
**Owns:** the numbered catalogue: each mistake, its severity, the harm and the fix.

## TL;DR

- Numbers are stable ids for review comments ("see #40"). Never renumber or reuse one; a new entry takes
  the next free number, wherever it is listed. A dropped entry stays listed as retired.
- Severity flags (🔴 🟡 🟢) mean what [review-output.md](review-output.md#severity) says.
- Scope a review to what the change touched. These checks also find old code; that is a list for later,
  not a reason to fail an unrelated change.
- The first section applies only to apps split into modules; the rest apply to any Laravel app.

## Modules and layers

Applies when business code is split into modules (`src/Domain/Billing/`, `src/Domain/Customer/`) with
these parts. Skip this section in a plain MVC app.

- **Contract**: the interface a module publishes; the only way in from outside the module.
- **Service**: implements the Contract; each method delegates to an Action in one line.
- **Action**: a `final` class with one `public static function handle()`, holding one operation's logic
  and queries (`IssueInvoice`, `GetInvoices`).
- **DTO**: a `readonly` class named `*Data` that carries values between layers, built with
  `SomeData::fromArray([...])`.

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 1 | 🔴 | Importing another module's Model, Action or Service | couples two modules for good; internal refactors break callers silently | `app(OtherContract::class)` |
| 2 | 🔴 | Fat controller: lookups, writes, loops, calculations | logic reachable only over HTTP; jobs and commands cannot reuse it | Form Request → DTO → Contract |
| 3 | 🔴 | Action with a constructor, an instance method, `execute()`, or not `final` | needs wiring, can hold state, invites injected dependencies | `final class X { public static function handle() }` |
| 4 | 🔴 | Multi-row write without `DB::transaction()` | a failure halfway leaves partial data | wrap the writes inside the Action |
| 5 | 🔴 | Eloquent or `DB::` in a Service | queries scattered, not reusable or listable | move it to an Action |
| 6 | 🟡 | Loops, parsing or orchestration in a Service | buried logic only reachable through the full Contract stack | move the body to an Action; the Service delegates in one line |
| 7 | 🟡 | Service accepts `$withRelations` / `$withCount` but does not pass them on | no caller can eager-load; every view N+1s; the signature looks right | `GetInvoices::handle($data, $withRelations, $withCount)` |
| 8 | 🟡 | Controller calls an Action, or injects an Action, Service or Model | skips the published door where transactions and checks get added | add the method to the Contract and call that |
| 9 | 🟡 | Constructor injection in a Service or Action | inconsistent with static Actions; hides what each method needs | `app(SomeContract::class)` where used |
| 10 | 🟡 | `getInvoiceById`, `getInvoiceByNumber`, … | the surface grows per lookup | one `getInvoice(?int $id, ?FilterInvoiceData $filters, array $withRelations)` |
| 11 | 🟡 | Two modules calling each other | confusing graph, recursion and lock risks | a third module, an event, or a join entity |
| 12 | 🟢 | Contract returns a model instead of a read DTO | callers can mutate or lazy-load the row | informational only; never block on it |
| 13 | 🟡 | A subsystem folder holding its own layers, a sub-folder in a flat layer, a layer nested in a layer, an invented `Handlers/` | anything walking the layout sees part of the module | only `Actions/` and `DataTransferObjects/` group into sub-folders |
| 14 | 🟡 | `auth()`, `Auth::user()` or `request()` inside module code | answers differently off a request; "no user" can mean "no filter" | the current-user seam in [security.md](security.md#the-current-user-inside-domain-code) |
| 15 | 🟡 | `?int $actorId = null` threaded through every signature | changes every layer to log one field; eventually forgotten | read the actor where it is recorded |
| 16 | 🟡 | `Validator::make()` in an Action or Service | validation belongs to the boundary | Form Request; package adapters validate outside the module |
| 17 | 🔴 | A second code path to an external provider | a second place to get every guard wrong | only the provider's own module calls it |
| 18 | 🟡 | The provider module's Contract takes or returns models, handles or closures | cannot be swapped for a remote implementation or a fake | plain values and DTOs in, DTOs out |
| 19 | 🔴 | Route-model binding in a controller where records must be resolved through the Contract | the router queried past the Contract; tenancy is unchecked | resolve through the Contract or tenant middleware |
| 20 | 🟡 | Trusting a route parameter's name | parameters bind by position; a consumed prefix shifts them | forget consumed params; count segments |
| 21 | 🟡 | State changes or workflows as model methods | run anywhere without a transaction or Contract | an Action; models keep read-only predicates |
| 22 | 🟡 | `->update(['status' => …])` outside the transition | skips the guard, side effects and audit | the transition Action |

## Data and DTOs

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 23 | 🔴 | DTO class not ending in `Data` (`InvoiceDTO`, `InvoiceLine`) | nobody can tell it is a DTO | rename class, file and imports |
| 24 | 🔴 | DTO properties in a different case from the columns and input keys they carry | keys stop matching; a mapping layer appears | `snake_case` properties, matching the columns |
| 25 | 🟡 | `array $data` in or out of a public method that crosses a layer | untyped keys, silent breaks on rename | a `*Data` class |
| 26 | 🟡 | `array` parameter with no PHPDoc shape | element type unknown to tools and readers | `@param InvoiceLineData[]` or a shape, or a DTO |
| 27 | 🟡 | Arrays of arrays inside a DTO | inner keys informal; consumers read defensively | child DTOs built in `fromArray()` |
| 28 | 🟡 | `new SomeData(...)` at a call site, or a factory that only wraps `new` | bypasses `fromArray()`, the one construction path (which may also track which keys were sent) | `SomeData::fromArray([...])` |
| 29 | 🔴 | Write DTO or `create()` fed from `$request->all()` | unvalidated input reaches the database | Form Request, then `validated()` |
| 30 | 🟡 | Filter DTO from `$request->all()` with a strict `fromArray()`, or a list endpoint with no Form Request | the first stray query parameter is a 500 | an index Form Request + `validated()` |
| 31 | 🔴 | Filter over tenant data with no tenant property on the filter DTO | the scope the caller passes lands nowhere; every tenant's rows return | declare it, read it in the scope, pin it |
| 32 | 🔴 | Server value placed so the request can override it (`$request->all() + [...]`, or pinned key first) | `?customer_id=7` reads another account | spread the request first, pinned keys last |
| 33 | 🟡 | A DTO calls `load()`, `loadMissing()` or a query | N+1 by construction, hidden in a constructor | read loaded relations; the caller eager-loads |
| 34 | 🟢 | Filter DTO assembled field by field from the request | duplicates the constructor; new fields get dropped | `fromArray([...$request->validated(), …])` |
| 35 | 🟡 | `customer_ids` added beside `customer_id` | two branches for one column; callers guess the key | widen to `int\|array\|null` and handle both shapes in one scope (#36) |
| 89 | 🟡 | A field the client sends as one value or a list, validated or typed for one shape only | the other shape is a 422 or a `TypeError` | the shape rule plus the id rule in [security.md](security.md#one-value-or-a-list); `string\|array\|null` property |

## Queries

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 36 | 🟢 | `is_array($v) ? whereIn(…) : where(…)` written by hand in each scope | the same branch rewritten, sometimes wrong | one query macro (e.g. `whereByType($column, $value)`) that picks `where` or `whereIn` |
| 37 | 🟢 | `where('x', 'like', "%{$v}%")` | `%` and `_` from users act as wildcards; case rules vary | one macro (e.g. `whereLikeText`) that escapes wildcards and applies the case rule |
| 38 | 🟡 | The same where-chain in two places | definitions drift | a named scope |
| 39 | 🟡 | `->get()->count()`, `->get()->isNotEmpty()` | hydrates every row to return one number | `count()`, `exists()` |
| 40 | 🔴 | Values interpolated into raw SQL (`'{$value}'`, `DB::raw()` with input) | breaks on an apostrophe, corrupts backslashes, injectable | bind every value ([security.md](security.md#sql)) |
| 41 | 🟡 | `whereHas()` on a `morphTo` with no types | a `SELECT DISTINCT type` scan on every build | `whereHasMorph($relation, [Invoice::class, Refund::class])` |
| 42 | 🟡 | Unloaded relations handed to a Resource or view | lazy loads per row during serialization | eager-load in the read query |
| 43 | 🟡 | Accessor doing work outside its `get:` closure | runs at build time; lazy-load failures under `preventLazyLoading` | do the work inside the closure |
| 84 | 🔴 | An empty list of allowed ids drops the filter (`when($ids, …)`) | the restriction vanishes and every row shows | narrow to no rows ([security.md](security.md#fail-closed)) |
| 85 | 🟡 | Row-visibility constraint written by hand in a filter or operation | lists, lookups and notifications drift apart | declare it once as a global scope ([security.md](security.md#row-level-visibility)) |
| 86 | 🔴 | Visibility scope lifted on a user-facing read path | restricted users see other customers' rows | lift only for integrity guards, cross-tenant reports and system jobs |

## Enums

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 44 | 🔴 | `Enum::from()` on a route param, query string or request value | a retired or invalid value is a 500 | `Enum::tryFrom($value) ?? abort(404)`, or one enum helper that does that |
| 45 | 🟡 | Collection filtered with `Enum::X->value` on an enum-cast attribute | an enum never `==` its backing value; matches nothing, silently | compare the case itself |
| 46 | 🟡 | Auth, request, queries, permissions or writes inside an enum | a value type turns into hidden policy | Policies, operation classes, Form Requests |
| 47 | 🟡 | Removing a case whose value is a seeded row id, without deleting the row | orphan rows; `from()` throws on render | the same change ships a delete migration |

## Style

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 48 | 🟡 | Method signature wrapped across lines | inconsistent scanning and diffs | one line; only DTO constructors wrap |
| 49 | 🟡 | Comments that restate code, narrate steps or history, repeat a rationale; docblocks restating signatures | noise that rots and trains readers to skip comments | delete; keep only a 1–2 line WHY |
| 50 | 🟡 | `else` after `return`, unnamed multi-part conditions, a row of `if`s for one choice, branches that only map values | the reader evaluates instead of reading | [conditionals.md](conditionals.md) |
| 51 | 🟡 | A new class whose only caller is one class | more files, no reuse | a private method in that class |
| 52 | 🟢 | Hard-coded morph class string, or `(new Model)->getMorphClass()` | typos and needless instantiation | `Model::class`, or the morph map alias |
| 83 | 🟢 | A bare literal or two same-type values passed positionally to your own code | the call cannot show what `true` means; swapped values pass silently | named arguments |

## Security and routes

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 53 | 🔴 | Route declared outside its panel's authenticated group | reachable with no login | move it into the group |
| 54 | 🔴 | File, export or print route without the linking page's permission | any signed-in user fetches any document by id | `abort_unless(… 'invoices.show' …)` before the lookup |
| 55 | 🔴 | User HTML in `{!! !!}` without a sanitizer | stored XSS | escape, or sanitize |
| 56 | 🔴 | Secrets or hashes in a response, log, DTO, job payload or error | leaked even if nobody looked | Resources whitelist; `$hidden`; scrub logs |
| 57 | 🟡 | `env()` outside `config/` | null once config is cached | `config()` |
| 58 | 🔴 | Throttle key built by concatenation | a blank part puts many users in one bucket | named template; blank or unknown part throws |
| 59 | 🔴 | `rand()` / `mt_rand()` for a code or token | predictable | `random_int()`, `Str::random()` |
| 60 | 🔴 | Public link authorized by reversible encryption without a MAC, or a token not bound to its type | forgeable; one token opens another document kind | signed URLs, or an HMAC with the type inside |
| 61 | 🔴 | A hidden button or client guard as the only check | trivially bypassed | the route and the operation enforce the same permission |
| 62 | 🔴 | Access decided by a role's name, or one permission inferred from another | roles are editable data; inference grants what nobody chose | check the fixed permission vocabulary; deny by default |
| 63 | 🔴 | A requester can approve their own request | defeats the second look | server-side transition guard |
| 64 | 🔴 | Once-only operation without an atomic claim | retries and double clicks run it twice | conditional `UPDATE` that claims the row |
| 65 | 🔴 | Update, delete or soft delete path on an audit log | history can be rewritten | record-only service, refusing model, restricted DB user |
| 66 | 🟡 | Wrong status code to a stranger in a multi-tenant app | confirms the tenant exists | [security.md](security.md#multi-tenant-apps) |
| 67 | 🟡 | `$guarded = []` on a new model that takes user input | any column becomes writable | `$fillable` |
| 87 | 🔴 | A notification about a record whose model has no visibility rule | every holder of the notification learns about the record | pass the record that carries the rule |
| 88 | 🔴 | Duplicate-submit middleware without the form key, or the key without the middleware | protection silently off | both halves ([sensitive-operations.md](sensitive-operations.md#duplicate-submit-protection)) |

## Sensitive operations

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 90 | 🔴 | A change written before approval, or applied on approval by a separate code path | the record shows what nobody approved; the second path misses the normal guards | hold the payload; replay it through the normal write with approval skipped |
| 91 | 🟡 | The step a viewer may approve decided in a view by comparing ids | ignores stand-ins, chain mode and self-approval rules | ask the approval service |
| 94 | 🟡 | Renaming a stored audit action key | old entries drop out of filters and reports | add a new key; keep the old one |
| 95 | 🟡 | An uploaded-file object in a pending-change payload | it cannot survive a JSON column | store the upload first; keep the path |

## API and responses

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 68 | 🔴 | An API controller returning `response()->json()`, an array or a bare Resource when the API has an envelope | breaks the response shape clients rely on | the app's one envelope builder, with a typed return |
| 69 | 🔴 | 200 on create, or a body on delete | clients cannot tell what happened | 201 with the resource; 204 with no body |
| 70 | 🟡 | Hand-built 422 JSON in a controller | a second error shape | let the exception handler build the envelope |
| 71 | 🟡 | `GET` that writes | caches, prefetchers and crawlers trigger it; duplicate-submit protection skips it | use the right verb |
| 72 | 🟡 | A PDF library's own `stream()` / `download()` printing the file | bypasses Laravel; headers sent before the response | render to a string, return a `Response` with headers |
| 73 | 🟡 | A write endpoint renders a page | refresh re-submits the form | redirect with a flash |
| 74 | 🟡 | A page variable named like a globally shared one (`View::share`, shared page props) | replaces the shared value on that page only | qualify the page variable's name |

## Tests

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 92 | 🔴 | A test run that can reach a working database or a real external provider | wipes data; sends real money or messages | [testing.md](testing.md#the-test-database); fakes |
| 93 | 🔴 | A failing test deleted, skipped or loosened to get green | a silent regression | find and fix the cause |

## Retired

- 75–82: front-end and static-asset entries, out of scope for a PHP skill. Do not reuse these numbers.

## Verify sweep

Paths assume modules under `src/Domain/` and controllers under `app/Http/` or `src/`; adjust to the app.

```bash
grep -rln "function __construct" src/Domain/*/Actions/                                     # 3
grep -rnE "::(query|find|where|create)\(|DB::" src/Domain/*/Services/                      # 5
grep -rnE "auth\(|Auth::|request\(\)" src/Domain/                                          # 14
grep -rn "Validator::" src/Domain/                                                         # 16
grep -rnE "new [A-Z][A-Za-z]*Data\(" src/ app/ | grep -v DataTransferObjects/              # 28
grep -rn "fromArray(\$request->all()" src/ app/                                            # 29, 30
grep -rnE "request->(all|validated)\(\) \+" src/ app/                                      # 32
grep -rnE "->get\(\)->(count|isNotEmpty|isEmpty)\(\)" src/ app/                            # 39
grep -rnE "::from\(\\\$(request|id|validated)" src/ app/                                   # 44
grep -rnE "function [a-zA-Z_]+\($" src/ app/ --include='*.php'                             # 48
grep -rn "{!!" resources/views/ src/ 2>/dev/null                                           # 55
grep -rn "\benv(" src/ app/ --include='*.php'                                              # 57
grep -rnE "\b(mt_)?rand\(" src/ app/ --include='*.php'                                     # 59
grep -rn "withoutGlobalScope" src/ app/ --include='*.php'                                  # 86
grep -rnE "->skip\(|markTestSkipped|markTestIncomplete" tests/                             # 93
```
