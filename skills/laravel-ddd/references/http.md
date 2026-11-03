# HTTP: controllers, Form Requests and pages

**Read when:** writing or reviewing a controller, a Form Request, a route, or what a page action returns
(Blade or Inertia).
**Owns:** thin controllers, Contract injection, Form Requests (index requests too), building DTOs from
requests, page responses and props classes, redirects after writes, route-model binding policy,
authorization in controllers, file responses, error handling for pages.

JSON panels (the envelope, Resources, status codes) live in [json-api.md](json-api.md).

## TL;DR

- A controller maps HTTP to one Contract call and back: Form Request → DTO from `validated()` →
  Contract → response. No Eloquent, no transaction, no business rule, no Action call.
- Inject **Contracts only**, in the constructor. Never an Action, a concrete Service or a Model.
- Every method that reads input takes a typed Form Request, `index` included.
- Server-pinned values go **after** the `...$request->validated()` spread, so the server wins.
- Pass ids, not models: `show(string $id)`, then fetch through the Contract and `abort_if(null, 404)`.
- A page read returns `View` or `Inertia\Response`; a page write returns `RedirectResponse` with a flash
  message, never a page.
- An Inertia page gets its props from **one props class**; never an Eloquent model as a prop.
- A panel's permission is checked by route middleware; a rule about one record goes through the
  record's ability.
- A file is returned as a Laravel `Response` with explicit headers, never streamed by a library.

## Where things live

```
src/Presentation/{Panel}/Controllers/{Feature}/{Feature}Controller.php
src/Presentation/{Panel}/Requests/{Feature}/{Action}{Entity}Request.php
src/Presentation/{Panel}/Props/{Module}/{Module}{Page}Props.php     Inertia panels
src/Presentation/{Panel}/Resources/{Module}/{Entity}Resource.php
src/Presentation/{Panel}/Routes/web.php | api.php
src/Presentation/Shared/Rules/                                     rules several panels use
```

A panel is either a **page panel** (Admin, Site: Blade or Inertia) or a **JSON panel** (Api). A
controller belongs to one panel. Two panels that need the same behaviour both call the domain
Contract; a controller never extends or includes another panel's controller.

## Thin controllers

```php
// ❌ lookups, a write and orchestration in HTTP code
public function store(Request $request): RedirectResponse
{
    $customer = Customer::findOrFail($request->customer_id);
    $invoice = Invoice::create(['customer_id' => $customer->id, 'currency' => $request->currency]);
    $invoice->lines()->createMany($request->lines);

    return back();
}

// ✅
final class InvoiceController extends Controller
{
    public function __construct(private readonly InvoiceContract $invoices) {}

    public function store(StoreInvoiceRequest $request): RedirectResponse
    {
        $invoice = $this->invoices->create(CreateInvoiceData::fromArray($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('messages.created')]);

        return to_route('admin.invoices.show', $invoice->id);
    }
}
```

- If the Contract lacks what the controller needs, add a Contract method. Do not reach around it to an
  Action or a Model. Why: the Contract is where a transaction, an event or a check gets added later,
  and a job or command must get the same behaviour.
- Constructor injection is the rule here and only here. Why: the container builds controllers; domain
  classes resolve with `app()` ([contracts-and-services.md](contracts-and-services.md)).
- Write each action out like its neighbouring controller. Repeating the closing lines (flash, redirect)
  is fine; a private helper that decides what gets saved is not.
- Type every return: `View`, `Inertia\Response`, `RedirectResponse`, `Response`, or `ResponseBuilder` on
  a JSON panel.

## Form Requests

| Method | Request |
|---|---|
| `index` (page or API list) | `Index{Entity}Request` |
| `store` / `update` | `Store{Entity}Request` / `Update{Entity}Request` |
| any other action | `{Action}{Entity}Request` (`CancelInvoiceRequest`) |
| an endpoint that takes criteria and returns matches | `{Entity}SearchRequest` |

- The entity is singular. Files live in the panel's `Requests/{Feature}/`; `make:request` writes to
  `app/Http/Requests/`, so move its output.
- When an edit checks more than a create, `Update{Entity}Request extends Store{Entity}Request` and adds
  only that rule. A store request never asks whether it is editing.
- Never `$request->validate()` or `Validator::make()` in a controller or an Action. Why: by the time a
  DTO reaches the domain, the data is trusted.
- A request may answer "may this user call this route at all" in `authorize()`. A rule about one record
  goes in the method (see Authorization).

### Index requests

An index request declares every filter, sort and page field, each `nullable` with its shape and allowed
values. Only validated keys reach the DTO, so an unknown or renamed parameter is ignored and the
queryable surface is written down.

```php
final class IndexInvoiceRequest extends FormRequest
{
    protected $redirectRoute = 'admin.invoices.index';

    public function rules(): array
    {
        return [
            'id' => ['nullable', new StringOrArray, new ValidId],
            'number' => ['nullable', 'string', 'max:255'],
            'statuses' => ['nullable', 'array', 'max:10'],
            'statuses.*' => [Rule::enum(InvoiceStatus::class)],
            'customer_type' => ['nullable', 'string', Rule::in(['business', 'person'])],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
            'page' => ['nullable', 'integer', 'min:1'],
            'pages_count' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function toFilterData(): FilterInvoiceData
    {
        return FilterInvoiceData::fromArray([
            ...$this->validated(),
            'customer_type' => CustomerType::tryFromShort($this->validated('customer_type'))?->value,
        ]);
    }
}
```

- `toFilterData()` spreads `validated()` and then maps each URL name the DTO spells differently. When a
  URL name means something else on the DTO, list every key instead of spreading. The controller then
  makes one call: `$request->toFilterData()`.
- On a page panel, `$redirectRoute` sends a bad filter to the plain list. Why: the user lands on a
  working page, never back on the URL that failed.
- `id` is the records picked in a filter (database ids). A number the user types from the screen
  (`INV-0042`) is a different field (`number`), a plain string, matched as text, never `ValidId`.
- The browser sends short type names (`business`), never a PHP class name; the request validates the
  short name and the server maps it.

### One value or a list

A filter sent as one value or a list (`id=5` or `id[]=5&id[]=6`) uses two small shared rules in
`Presentation\Shared\Rules`, combined:

| Rule | Checks | Rejects |
|---|---|---|
| `StringOrArray($max = 255)` | the shape: a string, or a flat list of strings or ints, each and the list capped | `true`, a nested list, a 256-char string, a 256-item list |
| `ValidId($min = 1, $max = PHP_INT_MAX, $maxItems = 255)` | the value: digits only, in range, the list capped | `abc`, `1.5`, `1e3`, `+5`, `05`, `0`, `-3` |

Why: repeating `array` + `max` + `.*` lines on every filter rejects the single-value form and lets `1e3`
or `05` through. `ValidId` does not check existence; add `exists` when a write needs it. The DTO
property then accepts both shapes (`int|string|array|null`); see [dtos.md](dtos.md).

### Foreign keys are an ownership check

On tenant-owned data, `exists:customers,id` lets a caller attach another tenant's row to its own, and
the response then reads it back. Scope the rule to the caller:

```php
'customer_id' => ['required', Rule::exists('customers', 'id')->where('tenant_id', $this->currentTenant()->id)],
```

Shared reference tables (countries, currencies) need no scope. Why the rule and not the controller: the
controller only spreads `validated()`, so the guarantee is invisible in review unless it lives here.

## Building DTOs from requests

```php
$this->invoices->create(CreateInvoiceData::fromArray([
    ...$request->validated(),
    'tenant_id' => $this->currentTenant()->id,
    'created_by_id' => $request->user()->id,
]));
```

- Writes and filters both build from `$request->validated()`, never `$request->all()`.
- Pinned keys (tenant, actor, a fixed status) come after the spread. `+` keeps the left side, so the
  request would win; see [dtos.md](dtos.md).
- A value the request carries in a different form (a short type, an action button name) is mapped here,
  after the spread, in one line each.

## Route parameters and binding

Pass the id and fetch through the Contract:

```php
public function show(string $id): InertiaResponse
{
    $invoice = $this->invoices->getInvoice($id);
    abort_if($invoice === null, 404);

    return Inertia::render('invoices/Show', new InvoiceShowProps($invoice));
}
```

- Do not bind models (`show(Invoice $invoice)`). Why: the router then runs its own query, which skips
  the Contract's scopes, eager loads and tenant filter, and says nothing about whether this person may
  see the row.
- Binding a backed enum (`edit(SettingsTab $tab)`) is fine: it is a value check, not a query.
- Laravel passes route parameters by position, after the injected classes are removed. Keep the route
  parameters first and in route order (`update(string $id, UpdateInvoiceRequest $request)`); see
  [architecture.md](architecture.md) for a prefix consumed by middleware.
- **Every** method that takes an id resolves it with the same scope `show` uses: `export`, `download`,
  `cancel` included. A lookup with no scope lets a caller name any id in the table. When three methods
  repeat the scope, give the controller one private helper that returns it.

## Authorization

| Scope | Where |
|---|---|
| The panel (signed in, right guard) | `auth:{guard}` on the route group |
| A page or action | one permission middleware on the route group (for example, permission = route name) |
| This record, now (its status, its owner) | the record's ability in the method: `$invoice->hasAbility('cancel')` answers 403 |
| What the UI shows | the same answers, sent as props; never the only check |

- Pick one permission mechanism per panel. If the panel's users are not modelled for Laravel's Gate, do
  not add `can:` middleware or `$this->authorize()` beside it: they deny everyone.
- Abilities and how they fail are in [models.md](models.md).
- Every route sits inside the authenticated group. A route declared after the group closes runs with
  no login.
- A route that returns a file checks the permission of the page that links to it, at the top of the
  method, before any lookup.

## Page responses

| Method | Returns |
|---|---|
| `index`, `show`, `create`, `edit` | `View` or `Inertia\Response` |
| `store`, `update`, `destroy`, any other write | `RedirectResponse` with a flash message |

Returning a page from a write breaks POST → redirect → GET: a refresh re-submits the form.

### Where a write redirects

| Write | Goes to |
|---|---|
| `store` or `update` from the record's form | `to_route('….show', $record->id)` |
| a save in place (a box or dialog on the show page) | `back()` |
| `destroy` from the list | `back()`, so the page number and filters stay |
| `destroy` from the show page | `to_route('….index')` |
| any write on a resource with no show page | `to_route('….index')` |

Use `to_route()` or `back()`, never a hard-coded URL. Why: the user lands where the change is visible;
after a list delete they keep their place.

### Flash messages

- Inertia: `Inertia::flash('toast', ['type' => 'success', 'message' => __('messages.updated')])` before
  the redirect (Inertia v3 flash data, checked 2026-11-03).
- Blade: `->with('success', __('messages.updated'))`, or `'error'` for a failure the controller caught.
- Always flash after a write; the message comes from a translation key, never a literal.

### Inertia: one props class per page

```php
abstract class PageProps implements ProvidesInertiaProperties { /* shared shapes: money(), status(), paginated() */ }

final class InvoiceShowProps extends PageProps
{
    public function __construct(private readonly Invoice $invoice) {}

    public function toInertiaProperties(RenderContext $context): array
    {
        return [
            'invoice' => [
                'id' => (string) $this->invoice->id,
                'number' => $this->invoice->number,
                'status' => $this->status($this->invoice->status),
                'customer' => PersonLinkResource::make($this->invoice->customer),
                'total' => $this->money($this->invoice->total),
                'issued_at' => $this->invoice->issued_at?->toIso8601String(),
                'can_cancel' => $this->invoice->ability('cancel'),
            ],
            'payments' => Inertia::defer(fn () => PaymentResource::collection(
                app(PaymentContract::class)->getPayments(FilterPaymentData::fromArray(['invoice_id' => $this->invoice->id]))->collection(),
            )),
        ];
    }
}
```

`ProvidesInertiaProperties` and `RenderContext` are inertia-laravel API (checked 2026-11-03).

- Name: `{Module}{Page}Props` in `Props/{Module}/`, `final`. Two pages that send the same props share
  one class named for what they share (`InvoiceFormProps` for Create and Edit).
- The controller passes what it already has: the record, the viewer, the filter DTO
  (`new InvoiceIndexProps(filters: $request->toFilterData())`). The class never reads the request.
- New reads go through Contracts, never an Action. Reading a relation of the record it was given is fine.
- Keys are `snake_case` and always present: a missing value is `null`, never a missing key. Ids are
  strings, dates ISO 8601, money a fixed two-decimal string.
- A section that queries many rows is `Inertia::defer(fn () => …)`; a prop a partial reload skips is a
  closure (`'filters' => fn () => …`). A record's own fields are never deferred.
- Send only the fields the page reads. Why: every prop ships in the HTML of the first load, and a raw
  model leaks every column.
- Shapes several pages send (an option, a status badge, a paginated table `{ rows, meta }`) live once on
  an abstract `PageProps` base the classes extend.
- Change the props class and the page's hand-written TypeScript type in the same commit.

### Typed page resources

A record shape that a page and a JSON endpoint both send, or that several modules send, is a resource:

```php
final class PersonLinkResource extends Resource
{
    /** @return array{name: string, url: string}|null */
    public static function make(?Person $person): ?array
    {
        return $person === null ? null : ['name' => $person->name, 'url' => $person->profileUrl()];
    }
}
```

- The base is the app's own `abstract class Resource` with a static `collection(iterable $records)`
  that calls `static::make()` per record. It is not `JsonResource`: plain arrays reach the page with no
  `{ data: … }` wrapper.
- `make()` takes its record typed and returns an array with an `@return array{…}` shape the TypeScript
  type copies. Only a resource whose record may be missing takes it nullable.
- Look in `Resources/Shared/` before adding a shape.

### Per-row actions on a list

When a row action is allowed for some rows and not others, compute `can_x` and its reason once per row
in the props class, from the record's state machine or ability, and eager-load every relation those
checks read. Why: a check run in the template, or reading an unloaded relation, costs one query per
row. The submit runs the check again; the disabled button is only a hint. State machines are in
[enums-and-states.md](enums-and-states.md).

## File responses

```php
public function pdf(string $id): Response
{
    $invoice = $this->invoices->getInvoice($id);
    abort_if($invoice === null, 404);

    return PdfResponse::inline($this->invoices->renderPdf($invoice), "invoice-{$invoice->number}.pdf");
}

final class PdfResponse
{
    public static function inline(string $content, string $fileName): Response
    {
        return response($content, 200, ['Content-Type' => 'application/pdf', 'Content-Disposition' => 'inline; filename="'.$fileName.'"']);
    }
}
```

Render the document to a string, then return a Laravel `Response` with explicit `Content-Type` and
`Content-Disposition`. Never call a library method that prints the file and sends its own headers (a PDF
library's `stream()` or `output()` to the browser). Why: the bytes then bypass Laravel, so middleware
cannot add headers, tests cannot assert on it, and a `: Response` return type throws after the file
has gone. Spreadsheet exports return a `BinaryFileResponse` (`response()->download(...)`).

## Errors on page requests

- **Validation:** a Form Request failure redirects back with the errors and old input; Inertia shares
  them as the `errors` prop. Never catch it in the controller.
- **Not found:** `abort_if($record === null, 404)` after a Contract lookup.
- **A refused domain operation:** the domain throws an exception that renders itself; on a page request
  it goes `back()` with the message as a form error and the old input. The class is in
  [json-api.md](json-api.md#domain-exceptions).
- **HTML error pages:** render one page component (`Error`, with the status) from the exception
  handler for every 4xx and 5xx, on a full load and on an Inertia visit. With `APP_DEBUG` on, a 5xx
  keeps the debug page. If rendering the page itself fails (no build manifest mid-deploy), fall back to
  Laravel's plain page and report it.
- **419 on an Inertia visit** (expired session or CSRF token): flash an error toast and `back(303)`
  instead of showing an error page.

## Verify

```bash
# Eloquent or persistence in controllers
grep -rnE -- "->save\(\)|::create\(|::query\(|::find(OrFail)?\(|DB::" src/Presentation/*/Controllers/

# Controllers importing Actions or Entities
grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Models\\\\Entities)\\\\" src/Presentation/*/Controllers/

# Unvalidated input reaching a DTO
grep -rn "fromArray(\$request->all()" src/Presentation/

# Inline validation
grep -rn "\$request->validate(\|Validator::make(" src/Presentation/

# Model binding in page and API actions
grep -rnE "function (show|edit|update|destroy)\([A-Z][A-Za-z]+ \\$" src/Presentation/*/Controllers/ | grep -v Request

# Writes that render instead of redirecting
grep -rnE "function (store|update|destroy)\(.*\): (View|InertiaResponse)" src/Presentation/

# Eloquent models sent straight to a page
grep -rnE "Inertia::render\([^)]*\[[^]]*=> \\$[a-z]+\]" src/Presentation/
```
