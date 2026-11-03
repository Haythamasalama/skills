# Controllers, Form Requests and the JSON API

**Read when:** writing a controller, a Form Request, an API Resource or route, or choosing a status code.
**Owns:** thin controllers, Contract injection, validation at the boundary, building DTOs from requests,
page vs JSON responses, the `status`/`data` envelope, status codes, Resources, file responses.
**See also:** [dtos.md](dtos.md)

## TL;DR

- Thin: validated request → DTO → Contract → response. No Eloquent, no transactions, no business rules.
- Inject **Contracts only**, through the constructor. Never an Action, a concrete Service or a Model.
- Every endpoint that reads input has a typed Form Request, including `index`.
- Writes: `fromArray($request->validated())`. Server-pinned values go last in the array.
- Page writes redirect (POST → redirect → GET) with a flash message; they never render a page.
- JSON responses always use the envelope `{ status: { code, success, error_key, message }, data }`.
- `201` on create, `204` on delete, `422` on validation, `404` not `500` for a bad id.
- Resources whitelist what leaves the server; they never query.

## Location

```
src/Presentation/{Panel}/Controllers/{Feature}/{Feature}Controller.php
src/Presentation/{Panel}/Requests/{Feature}/{Action}{Entity}Request.php
src/Presentation/{Panel}/Resources/{Entity}Resource.php
```

A controller belongs to one panel. Two panels needing the same behaviour both call the domain Contract;
a controller never extends or includes another panel's controller.

## Thin

```php
// ❌ lookups, a write and orchestration in HTTP code
public function store(Request $request): JsonResponse
{
    $customer = Customer::findOrFail($request->customer_id);
    $invoice = Invoice::create(['customer_id' => $customer->id, 'currency' => $request->currency]);
    $invoice->lines()->createMany($request->lines);

    return response()->json($invoice);
}

// ✅
public function __construct(private readonly InvoiceContract $invoices) {}

public function store(StoreInvoiceRequest $request): ResponseBuilder
{
    $invoice = $this->invoices->create(CreateInvoiceData::fromRequest($request));

    return res(status: 201)->data(InvoiceResource::make($invoice));
}
```

If the Contract lacks what the controller needs, add a Contract method. Do not reach around it, and do
not call the Action: the Contract is the seam where a transaction, an event or a permission check is
added later.

## Form Requests

- Every method that reads input takes one, `index` included (`IndexInvoiceRequest` declares every filter,
  sort and page-size field). Why: the queryable surface is explicit and a strict `fromArray()` never
  meets an unknown key.
- Rules and the DTO's properties mirror each other one for one.
- Shared rule sets live as traits in `Requests/Traits/`; custom rules in `{Panel}/Rules/` or a shared panel.
- `authorize()` may check a Policy for the route as a whole. Per-record checks go in the method.
- Never `$request->validate()` or `Validator::make()` in a controller or an Action.

A field that accepts one value **or** a list (`id=5` or `id[]=5&id[]=6`) is worth two small reusable
rules: one for the **shape** (a string, or a flat list of scalars, each and the list capped in size), one
for **ids** (digits only, no sign, no leading zero, no exponent, within range, list capped). Why: repeating
`array`, `max` and `.*` lines on every filter rejects the single-value form and lets `1e3` or `05` through.
The DTO property must then accept both shapes (`int|array|null`).

## Building DTOs from requests

```php
public function index(IndexInvoiceRequest $request): ResponseBuilder
{
    $invoices = $this->invoices->getInvoices(
        FilterInvoiceData::fromArray([...$request->validated(), 'customer_id' => $this->currentCustomer()->id]),
        withRelations: ['customer'],
    );

    return res()->data(InvoiceResource::collection($invoices->pagination()));
}
```

The pinned key comes after the spread so the server wins. See [dtos.md](dtos.md) for why `+` is wrong here
and for the strict vs lenient filter variants.

## Authorization

| Scope | Where |
|---|---|
| The whole panel (signed in, right guard) | route group middleware |
| A permission for a page or action | route middleware (`can:` or a permission middleware) |
| This record, right now | `Gate::authorize('update', $invoice)`, or the record's ability, inside the method |
| What the UI shows | the same check, sent to the page; never the only check |

Every route sits inside the authenticated group; a route declared after the group closes runs with no
login. A route that returns a file (PDF, export, download) checks the permission of the page that links it,
at the top of the method, before any lookup.

## Page responses (server-rendered or Inertia)

| Method | Returns |
|---|---|
| `index`, `show`, `create`, `edit` | `View` or `Inertia\Response`, typed |
| `store`, `update`, `destroy` | `RedirectResponse` with `->with('success' \| 'error', __('...'))` |

Returning a page from a write breaks POST/redirect/GET: refreshing re-submits the form.

**Where to redirect after a write** differs between the source codebases:

- Option 1: always the resource index.
- Option 2: `to_route('…show', …)` after a create, the index after a delete, `back()` after an in-place edit.

Pick one per project.

## Route-model binding (variant)

Both codebases pass ids or handles and fetch through the Contract (`show(int $id)`). One bans binding
outright (`show(Invoice $invoice)` is a review failure) because the router then runs a query that skips the
Contract and says nothing about whether this person may see the row. Choose the ban for multi-tenant apps;
if you allow binding elsewhere, scope it (`scopeBindings()`) and still authorize. Route parameters reach
the method **by position**, not by name; see [architecture-and-folders.md](architecture-and-folders.md).

## The JSON API

### Endpoints

```
✅ GET /api/v1/invoices   GET /api/v1/invoices/42   POST /api/v1/invoices
   PUT|PATCH /api/v1/invoices/42   DELETE /api/v1/invoices/42   GET /api/v1/customers/7/invoices
❌ GET /api/getInvoices   POST /api/invoice/create   POST /api/invoices/42/update   GET /api/v1/Invoice
```

- Plural, lowercase nouns. Nest one level at most; past that, filter by query string.
- Version in the path. Never change a shipped version's shape; add `v2`.
- `GET` has no side effects. `PUT` replaces, `PATCH` changes part.

### The envelope (deliberate)

Every JSON response, success or failure, has the same shape. It overrides Laravel's default Resource
wrapping and its default validation payload.

```json
{ "status": { "code": 201, "success": true, "error_key": "ok", "message": "Invoice created." },
  "data": { "id": 42, "number": "INV-0042", "total": 1500 } }

{ "status": { "code": 422, "success": false, "error_key": "validation_failed", "message": "The given data was invalid." },
  "data": null,
  "errors": { "customer_id": ["The customer id field is required."] } }
```

- `status.code` mirrors the HTTP status; `success` is true for 2xx.
- `error_key` is a stable slug clients branch on (`ok`, `validation_failed`, `not_found`, `unauthorized`,
  `forbidden`, `server_error`, or a domain key). `message` is human and localized; never branch on it.
- `errors` appears only on 422. Never send `"errors": null`.
- A 500 returns a generic message. Log the exception; never put a trace or SQL in `message`.
- Paginated lists put rows in `data.items` and paginator fields in `data.meta`. Default page size 20;
  cap a client's `per_page` at 100.

### A response builder

```php
final class ResponseBuilder implements Responsable
{
    private mixed $data = null;

    private ?array $errors = null;

    private string $errorKey = 'ok';

    private ?string $message = null;

    public function __construct(private readonly int $status = 200) {}

    public function data(mixed $data): self
    {
        $this->data = $data;

        return $this;
    }

    public function message(string $key): self
    {
        $this->message = __($key);

        return $this;
    }

    public function withErrors(array $errors, string $errorKey = 'validation_failed'): self
    {
        [$this->errors, $this->errorKey] = [$errors, $errorKey];

        return $this;
    }

    public function toResponse($request): JsonResponse
    {
        if ($this->status === 204) {
            return new JsonResponse(null, 204);
        }

        $payload = $this->data instanceof JsonResource ? $this->data->response($request)->getData(true) : ['data' => $this->data];
        $data = isset($payload['meta']) ? ['items' => $payload['data'], 'meta' => $payload['meta']] : $payload['data'];

        $body = [
            'status' => ['code' => $this->status, 'success' => $this->status < 400, 'error_key' => $this->errorKey, 'message' => $this->message ?? $this->errorKey],
            'data' => $data,
        ];

        if ($this->errors !== null) {
            $body['errors'] = $this->errors;
        }

        return new JsonResponse($body, $this->status);
    }
}

function res(int $status = 200): ResponseBuilder
{
    return new ResponseBuilder($status);
}
```

Render framework exceptions into the same envelope once, in `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(fn (ValidationException $e, Request $request) => $request->expectsJson()
        ? res(422)->withErrors($e->errors())->message('validation.failed')->toResponse($request)
        : null);
})
```

Do the same for `ModelNotFoundException` (404, `not_found`), `AuthenticationException` (401),
`AuthorizationException` (403) and a generic fallback (500). API controllers declare `: ResponseBuilder`
and never return `response()->json()`, an array, or a bare Resource.

### Status codes

| Case | Code |
|---|---|
| Read, replace, partial update | 200 |
| Create (return the new resource) | **201** |
| Delete (no body) | **204** |
| Malformed request (bad JSON, wrong content type) | 400 |
| Not signed in, or bad token | 401 |
| Signed in, not allowed | 403 |
| Missing, or outside the caller's scope | 404 |
| Validation failed | 422 |
| Uncaught exception | 500 |

201 on create and 204 on delete are the two most often forgotten. `400` is not a validation failure, and
`404` is not "not signed in".

### Resources

```php
final class InvoiceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'number' => $this->number,
            'status' => ['value' => $this->status->value, 'label' => $this->status->label()],
            'total' => $this->total,
            'customer' => CustomerResource::make($this->whenLoaded('customer')),
            'issued_at' => $this->issued_at?->toIso8601String(),
        ];
    }
}
```

A Resource shapes; it never queries and never decides what to load. It is also the whitelist: a field not
listed here never leaves the server, so password hashes, tokens and internal flags stay out by default.

## File responses

Render a document to a string and return a Laravel `Response` with explicit `Content-Type` and
`Content-Disposition` headers. Never call a library method that prints the file and sends its own
headers (a PDF library's `stream()` or `download()`), because the response then bypasses Laravel:
middleware cannot add headers, tests cannot assert on it, and a typed `: Response` method throws after
the bytes have gone.

## Verify

```bash
# Eloquent or persistence in controllers
grep -rnE "->save\(\)|::create\(|::query\(|::find(OrFail)?\(|DB::" src/Presentation/*/Controllers/

# Controllers importing Actions or Entities
grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Models\\\\Entities)\\\\" src/Presentation/*/Controllers/

# Unvalidated input reaching a write DTO
grep -rn "fromArray(\$request->all()" src/Presentation/

# Inline validation
grep -rn "\$request->validate(\|Validator::make(" src/Presentation/

# JSON returned outside the envelope
grep -rn "response()->json(" src/Presentation/

# Writes that render instead of redirecting (review each)
grep -rnE "function (store|update|destroy)\(.*\): (View|Response)" src/Presentation/
```
