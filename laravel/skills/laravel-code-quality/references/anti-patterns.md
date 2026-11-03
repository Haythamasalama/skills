# Anti-patterns

**Read when:** reviewing a diff, or checking whether a shape is a known mistake.
**Owns:** the numbered catalogue with severity, the harm, and the fix.
**See also:** [review-output.md](review-output.md) · [security.md](security.md)

Numbers are stable ids for review comments ("see #40"). Never renumber or reuse one; a new entry takes the
next free number, wherever it is listed.

| Flag | Severity | In review |
|---|---|---|
| 🔴 | Critical | Block. Fix before merge. |
| 🟡 | Warning | Fix in this change if reasonable, otherwise a follow-up. |
| 🟢 | Suggestion | Recommend; do not block. |

Scope a review to what the change touched. These checks also find old code; that is a list for later, not
a reason to fail an unrelated change.

## Domain boundaries and layers

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 1 | 🔴 | Importing another domain's Model, Action or Service | couples two domains for good; internal refactors break callers silently | `app(OtherContract::class)` |
| 2 | 🔴 | Fat controller: lookups, writes, loops, calculations | logic reachable only over HTTP; jobs and commands cannot reuse it | Form Request → DTO → Contract |
| 3 | 🔴 | Action with a constructor, an instance method, `execute()`, or not `final` | needs wiring, can hold state, invites injected dependencies | `final class X { public static function handle() }` |
| 4 | 🔴 | Multi-row write without `DB::transaction()` | a failure halfway leaves partial data | wrap the writes inside the Action |
| 5 | 🔴 | Eloquent or `DB::` in a Service | queries scattered, not reusable or listable | move it to an Action |
| 6 | 🟡 | Loops, parsing or orchestration in a Service | buried logic only reachable through the full Contract stack | move the body to an Action; Service delegates in one line |
| 7 | 🟡 | Service declares `$withRelations` / `$withCount` but does not forward them | no caller can eager-load; every view N+1s; the signature looks right | `Get{Entity}s::for($data, $withRelations, $withCount)` |
| 8 | 🟡 | Controller calls an Action, or injects an Action, Service or Model | skips the published door where transactions and checks get added | add the method to the Contract and call that |
| 9 | 🟡 | Constructor injection in a domain Service or Action | inconsistent with static Actions; hides what each method needs | `app(SomeContract::class)` where used |
| 10 | 🟡 | `getInvoiceById`, `getInvoiceByNumber`, … | the surface grows per lookup | one `getInvoice(?int $id, ?FilterInvoiceData $filters, array $withRelations)` |
| 11 | 🟡 | Two domains calling each other | confusing graph, recursion and lock risks | a third domain, an event, or a join entity |
| 12 | 🟢 | Contract returns an Entity instead of a read DTO | callers can mutate or lazy-load the row | informational only; never block on it |
| 13 | 🟡 | Subsystem folder swallowing layers, sub-folder in a flat layer, layer nested in a layer, invented `Handlers/` | anything walking the layout sees part of the domain | only `Actions/` and `DataTransferObjects/` nest |
| 14 | 🟡 | `auth()`, `Auth::user()` or `request()` inside `src/Domain/` | answers differently off a request; "no user" can mean "no filter" | ask one current-user seam; handle null |
| 15 | 🟡 | `?int $actorId = null` threaded through every signature | changes every layer to log one field; eventually forgotten | read the actor where it is recorded |
| 16 | 🟡 | `Validator::make()` in an Action or Service | validation belongs to the boundary | Form Request; package adapters validate in `app/` |
| 17 | 🔴 | A second code path to a high-risk resource | a second place to get every guard wrong | only the seam domain touches it |
| 18 | 🟡 | Seam Contract takes or returns models, handles or closures | cannot be swapped for a remote implementation | scalars and DTOs in, DTOs out |
| 19 | 🔴 | Model in a controller signature, where binding is banned | the router queried past the Contract; tenancy is unchecked | resolve through the Contract or tenant middleware |
| 20 | 🟡 | Trusting a route parameter's name | parameters bind by position; a consumed prefix shifts them | forget consumed params; count segments |
| 21 | 🟡 | State changes or workflows as model methods | run anywhere without a transaction or Contract | an Action; models keep read-only predicates |
| 22 | 🟡 | `->update(['status' => …])` outside the transition | skips the guard, side effects and audit | the transition Action |

## Data and DTOs

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 23 | 🔴 | Transport class not ending in `Data` (`InvoiceDTO`, `InvoiceLine`) | nobody can tell it is a DTO | rename class, file and imports |
| 24 | 🔴 | camelCase DTO properties | keys stop matching columns; a mapping layer appears | `snake_case` properties |
| 25 | 🟡 | `array $data` in or out of a Contract or Action | untyped keys, silent breaks on rename | a `*Data` class |
| 26 | 🟡 | `array` parameter with no PHPDoc shape | element type unknown to tools and readers | `@param InvoiceLineData[]` or a shape, or a DTO |
| 27 | 🟡 | Arrays of arrays inside a DTO | inner keys informal; consumers read defensively | child DTOs built in `fromArray()` |
| 28 | 🟡 | `new SomeData(...)` at a call site, or a factory that only wraps `new` | bypasses the one construction path and sent-keys tracking | `SomeData::fromArray([...])` |
| 29 | 🔴 | Write DTO or `create()` fed from `$request->all()` | unvalidated input reaches the database | Form Request, then `validated()` |
| 30 | 🟡 | Filter DTO from `$request->all()` with a strict `fromArray()`, or an index with no Form Request | the first stray query parameter is a 500 | `Index{Entity}Request` + `validated()` |
| 31 | 🔴 | Filter over tenant data with no scoping property | the scope the caller passes lands nowhere; every tenant's rows return | declare it, read it in the scope, pin it |
| 32 | 🔴 | Server value placed so the request can override it (`$request->all() + [...]`, or pinned key first) | `?customer_id=7` reads another account | spread the request first, pinned keys last |
| 33 | 🟡 | A DTO calls `load()`, `loadMissing()` or a query | N+1 by construction, hidden in a constructor | read loaded relations; caller eager-loads |
| 34 | 🟢 | Filter DTO assembled field by field from the request | duplicates the constructor; new fields get dropped | `fromArray([...$request->validated(), …])` |
| 35 | 🟡 | `customer_ids` added beside `customer_id` | two branches for one column; callers guess the key | widen to `int\|array\|null` + `whereByType` |

## Queries

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 36 | 🟢 | `is_array() ? whereIn : where` by hand | the same branch rewritten, sometimes wrong | `whereByType()` |
| 37 | 🟢 | `where('x', 'like', "%{$v}%")` | `%` and `_` from users leak in; case rules vary | `whereLikeText()` |
| 38 | 🟡 | The same where-chain in two places | definitions drift | a named scope |
| 39 | 🟡 | `->get()->count()`, `->collection()->isNotEmpty()` | hydrates every row to return one number | `count()`, `exists()` |
| 40 | 🔴 | Values interpolated into raw SQL (`'{$value}'`, `DB::raw()` with input) | breaks on an apostrophe, corrupts backslashes, injectable | bind every value; run the whole statement with bindings |
| 41 | 🟡 | `whereHas()` on a `morphTo` with no types | a `SELECT DISTINCT type` scan on every build | `whereHasMorph($relation, Model::TYPES)` |
| 42 | 🟡 | Unloaded relations handed to a Resource or page prop | lazy loads per row during serialization | eager-load in the read Action |
| 43 | 🟡 | Accessor doing work outside its `get:` closure | runs at build time; lazy-load failures under `preventLazyLoading` | do the work inside the closure |

## Enums

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 44 | 🔴 | `Enum::from()` on a route param, query string or request value | a retired or invalid value is a 500 | `fromOrAbort()` / `tryFrom() ?? abort(404)` |
| 45 | 🟡 | Collection filtered with `Enum::X->value` on an enum-cast attribute | an enum never `==` its backing value; matches nothing, silently | compare the case itself |
| 46 | 🟡 | Auth, request, queries, permissions or writes inside an enum | a value type turns into hidden policy | Abilities, Policies, Actions, Form Requests |
| 47 | 🟡 | Removing a case whose value is a seeded row id, without deleting the row | orphan rows; `from()` throws on render | same change ships a delete migration |

## Style

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 48 | 🟡 | Method signature wrapped across lines | inconsistent scanning and diffs | one line; only DTO constructors wrap |
| 49 | 🟡 | Comments that restate code, narrate steps or history, repeat a rationale; docblocks restating signatures | noise that rots and trains readers to skip comments | delete; keep only a 1–2 line WHY |
| 50 | 🟡 | `else` after `return`, unnamed multi-part conditions, a row of `if`s for one choice, branches that only map values | the reader evaluates instead of reading | guard clauses, named conditions, `elseif`, `match` |
| 51 | 🟡 | A new class whose only caller is one class | more files, no reuse | a private method in that class |
| 52 | 🟢 | Hard-coded morph class string, or `(new Model)->getMorphClass()` | typos and needless instantiation | `Model::class`, or the morph map alias |

## Security and routes

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 53 | 🔴 | Route declared outside its panel's authenticated group | reachable with no login | move it into the group |
| 54 | 🔴 | File, export or print route without the linking page's permission | any signed-in user fetches any document by id | `abort_unless(… 'page.permission' …)` before the lookup |
| 55 | 🔴 | User HTML in `{!! !!}` or `v-html` without a sanitizer | stored XSS | escape, or sanitize |
| 56 | 🔴 | Secrets or hashes in a response, log, DTO, job payload or error | leaked even if nobody looked | Resources whitelist; `$hidden`; scrub logs |
| 57 | 🟡 | `env()` outside `config/` | null once config is cached | `config()` |
| 58 | 🔴 | Throttle key built by concatenation | a blank part puts many users in one bucket | named template; blank or unknown part throws |
| 59 | 🔴 | `rand()` / `mt_rand()` for a code or token | predictable | `random_int()`, `Str::random()` |
| 60 | 🔴 | Public link authorized by reversible encryption without a MAC, or a token not bound to its type | forgeable; one token opens another document kind | signed URLs, or an HMAC with the type inside |
| 61 | 🔴 | A hidden button or client guard as the only check | trivially bypassed | the route and the Action enforce the same permission |
| 62 | 🔴 | Access decided by a role's name, or one permission inferred from another | roles are editable data; inference grants what nobody chose | check the fixed permission vocabulary; deny by default |
| 63 | 🔴 | A requester can approve their own request | defeats the second look | server-side transition guard |
| 64 | 🔴 | Once-only operation without an atomic claim | retries and double clicks run it twice | conditional `UPDATE` that claims the row |
| 65 | 🔴 | Update, delete or soft delete path on an audit log | history can be rewritten | record-only Contract, refusing model, restricted DB user |
| 66 | 🟡 | 403 to a stranger in a multi-tenant app | confirms the tenant exists | 404 for strangers, 403 for members |
| 67 | 🟡 | `$guarded = []` on a new model that takes user input | any column becomes writable | `$fillable` |

## API

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 68 | 🔴 | `response()->json()`, an array or a bare Resource from an API controller | breaks the envelope contract clients rely on | `res()->data(...)`, typed `: ResponseBuilder` |
| 69 | 🔴 | 200 on create, or a body on delete | clients cannot tell what happened | 201 with the resource; 204 with no body |
| 70 | 🟡 | Hand-built 422 JSON in a controller | a second error shape | let the exception renderer build the envelope |
| 71 | 🟡 | `GET` that writes | caches, prefetchers and crawlers trigger it | use the right verb |
| 72 | 🟡 | A library's `stream()` / `download()` printing a file itself | bypasses Laravel; typed methods throw after sending | render to a string, return a `Response` with headers |

## Presentation

| # | Sev | Anti-pattern | Why it hurts | Fix |
|---|---|---|---|---|
| 73 | 🟡 | A write endpoint renders a page | refresh re-submits the form | redirect with a flash |
| 74 | 🟡 | A page prop named like a shared prop | replaces the shared value on that page only | qualify the page prop's name |
| 75 | 🟡 | `<a href>` or a hand-written path for an internal route | full reload; paths drift from routes | `<Link>` + generated route helpers |
| 76 | 🟡 | Hex or arbitrary colour classes | wrong in one theme | semantic tokens |
| 77 | 🟡 | Editing vendored UI primitives | updates clobber it; no record of what changed | wrap them, or change tokens |
| 78 | 🟡 | Filtering or sorting a paginated list in the browser | searches one page; sidesteps server scoping | filters in the URL, applied by the server |
| 79 | 🟡 | A disabled control for a permission the viewer lacks | a promise the page cannot keep | render nothing |
| 80 | 🟡 | A destructive action without a named confirm dialog | one stray click deletes | alert dialog naming the record |
| 81 | 🟡 | `<style>` blocks in views, or a component's CSS copied into global bundles | uncacheable, duplicated, drifts | one stylesheet per page or component |
| 82 | 🔴 | Changing a static asset served without content hashing, without bumping its version | browsers keep the old file; new markup breaks | bump the cache-busting version in the same commit |

## Verify sweep

```bash
grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Services|Models\\\\Entities)\\\\" src/Presentation/   # 1, 8
grep -rln "function __construct" src/Domain/*/Actions/                                               # 3
grep -rnE "::(query|find|where|create)\(|DB::" src/Domain/*/Services/                                # 5
grep -rnE "auth\(|Auth::|request\(\)" src/Domain/                                                    # 14
grep -rn "Validator::" src/Domain/                                                                   # 16
grep -rnE "new [A-Z][A-Za-z]*Data\(" src/ | grep -v DataTransferObjects/                             # 28
grep -rn "fromArray(\$request->all()" src/                                                           # 29, 30
grep -rnE "request->(all|validated)\(\) \+" src/                                                     # 32
grep -rnE "->(get|collection)\(\)->count\(\)" src/                                                   # 39
grep -rnE "::from\(\\\$(request|id|validated)" src/Presentation/                                     # 44
grep -rnE "function [a-zA-Z_]+\($" src/ --include='*.php'                                            # 48
grep -rn "{!!" resources/views/ src/Presentation/ 2>/dev/null                                        # 55
grep -rn "\benv(" src/ app/ --include='*.php'                                                        # 57
grep -rnE "\b(mt_)?rand\(" src/ app/ --include='*.php'                                               # 59
grep -rn "response()->json(" src/Presentation/                                                       # 68
```
