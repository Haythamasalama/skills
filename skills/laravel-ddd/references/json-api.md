# The JSON API

**Read when:** designing or reviewing a JSON endpoint, an API Resource, or what an API failure returns.
**Owns:** endpoint naming, the `status`/`data` envelope and its builder, status codes, API Resources, the
pagination shape, the validation error shape, the API CRUD recipe, error handling for JSON requests,
domain exceptions, JSON endpoints that feed the app's own pages.

Controllers, Form Requests, route binding and authorization are shared with page panels and live in
[http.md](http.md).

## TL;DR

- `/api/{version}/{resources}`: plural lowercase nouns, nested one level at most, version in the path.
- Every JSON response, success or failure, is `{ status: { code, success, message, error_key }, data }`.
  It replaces Laravel's Resource wrapping and its validation payload.
- API controllers declare `: ResponseBuilder` and build it with `res()`. Never `response()->json()`, an
  array, or a bare Resource.
- `201` on create, `204` on delete, `422` on validation, `404` (not `500`) for a missing id.
- Validation errors sit in `status.errors_list` as `[{ field, message }]`.
- A paginated list puts the rows in `data` and the paginator in a sibling `pagination` key.
- Clients branch on `error_key`, never on `message`, which is translated.
- Resources whitelist what leaves the server; they never query.

## Endpoints

```
✅ GET /api/v1/employees   GET /api/v1/employees/42   POST /api/v1/employees
   PUT|PATCH /api/v1/employees/42   DELETE /api/v1/employees/42   GET /api/v1/employees?user_id=7
❌ GET /api/getEmployees   POST /api/employee/create   POST /api/employees/42/update   GET /api/v1/Employee
   GET /api/v1/users/7/employees/42/contacts/3
```

- Plural, lowercase nouns. Nest one level at most; past that, filter by query string.
- Version in the path (`v1`, `v2`). Never change a shipped version's shape; add the next version.
- `GET` has no side effects. `PUT` replaces, `PATCH` changes part, `DELETE` removes.

## The envelope

```json
{ "status": { "code": 201, "success": true, "message": "Created", "error_key": "created" },
  "data": { "id": "42", "employee_number": "EMP-0042", "name": "Jane Doe" } }

{ "status": { "code": 422, "success": false, "message": "The given data was invalid.", "error_key": "validation_error",
              "errors_list": [ { "field": "user_id", "message": "The user id field is required." } ] },
  "data": {} }

{ "status": { "code": 200, "success": true, "message": "OK", "error_key": "ok" },
  "data": [ { "id": "1", "employee_number": "EMP-0001" } ],
  "pagination": { "total": 137, "count": 20, "per_page": 20, "current_page": 1, "last_page": 7,
                  "from": 1, "to": 20, "next_page_url": "…?page=2", "prev_page_url": null } }
```

- `status.code` mirrors the HTTP status; `success` is `code < 400`.
- `error_key` is a stable slug: the message key when one was given (`validation_error`, `not_found`,
  `employee_already_archived`), else the lower-cased status text (`ok`, `created`). Clients branch on it.
- `message` is human and translated. Never branch on it, and never assert it in a test without pinning
  the locale.
- `errors_list` appears only when there are field errors: one entry per field, its first message. Never
  send an empty list.
- `data` is `{}` when there is nothing to send, so a client can always read it as an object or list.
- A paginated list adds `pagination`; extra list-level values (counts) sit beside it, never inside
  each row.
- A 500 says something generic. Log the exception; never put a trace or SQL in `message`.

## The builder

`res()` builds a `ResponseBuilder`, which implements `Responsable`, so Laravel turns it into JSON.

```php
final class ResponseBuilder implements Responsable
{
    private mixed $data = null;

    private ?array $pagination = null;

    private ?array $errors = null;

    private ?string $errorKey = null;

    public function __construct(private int $status = 200, private ?string $message = null, private array $replace = []) {}

    public function data(mixed $data): self
    {
        $this->data = $data;

        if ($data instanceof ResourceCollection && $data->resource instanceof LengthAwarePaginator) {
            $this->pagination = [...$data->additional, 'pagination' => [
                'total' => $data->total(), 'count' => $data->count(), 'per_page' => $data->perPage(),
                'current_page' => $data->currentPage(), 'last_page' => $data->lastPage(),
                'from' => $data->firstItem(), 'to' => $data->lastItem(),
                'next_page_url' => $data->nextPageUrl(), 'prev_page_url' => $data->previousPageUrl(),
            ]];
        }

        return $this;
    }

    public function message(string $key, array $replace = []): self
    {
        [$this->message, $this->replace] = [$key, $replace];

        return $this;
    }

    public function withErrors(array $errors): self
    {
        $this->errors = $errors;

        return $this;
    }

    public function errorKey(string $key): self
    {
        $this->errorKey = $key;

        return $this;
    }

    public function toResponse($request): JsonResponse
    {
        $statusText = Response::$statusTexts[$this->status] ?? '';

        return new JsonResponse([
            'status' => [
                'code' => $this->status,
                'success' => $this->status < 400,
                'message' => $this->message === null ? $statusText : (Lang::has("api.{$this->message}") ? __("api.{$this->message}", $this->replace) : $this->message),
                'error_key' => $this->errorKey ?? $this->message ?? Str::snake(strtolower($statusText)),
                ...($this->errors ? ['errors_list' => $this->errors] : []),
            ],
            'data' => $this->data ?? (object) [],
            ...($this->pagination ?? []),
        ], $this->status);
    }
}

function res(int $status = 200, ?string $message = null, array $replace = []): ResponseBuilder
{
    return new ResponseBuilder($status, $message, $replace);
}
```

- Lives in `src/Domain/Core/Helpers/`; `res()` sits in a helpers file autoloaded through `composer.json`
  `files`.
- A message is a key in `lang/{locale}/api.php`; a string that is not a key passes through as it is.
- `res(204)` sends no body: Symfony drops the content of a 204.

```php
return res()->data(EmployeeResource::make($employee));               // 200
return res(201)->data(EmployeeResource::make($employee));            // 201
return res(204);                                                     // 204
return res()->message('employee_activated')->data(EmployeeResource::make($employee));
```

## Status codes

| Case | Code | Built by |
|---|---|---|
| Read, replace, partial update | 200 | `res()->data(…)` |
| Create (return the new resource) | **201** | `res(201)->data(…)` |
| Delete | **204** | `res(204)` |
| A refused domain operation | 400 or a specific 4xx | the domain exception |
| Not signed in, or a bad token | 401 | the handler |
| Signed in, not allowed | 403 | the handler |
| Missing, or outside the caller's scope | 404 | `abort_if(…, 404)` → the handler |
| Validation failed | 422 | the Form Request → the handler |
| Too many requests | 429 | the handler |
| Uncaught exception | 500 | the handler |

201 on create and 204 on delete are the two most often forgotten. `400` is not a validation failure
(`422`), and `404` is not "not signed in" (`401`). In a multi-tenant app a stranger gets 404, never 403,
which would confirm the row exists.

## API Resources

```php
final class EmployeeResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'employee_number' => $this->employee_number,
            'status' => ['value' => $this->status->value, 'label' => $this->status->label()],
            'name' => $this->name,
            'user' => UserResource::make($this->whenLoaded('user')),
            'activated_at' => $this->activated_at?->toIso8601String(),
        ];
    }
}
```

- File: `src/Presentation/{Panel}/Resources/{Feature}/{Entity}Resource.php`. `::make()` for one,
  `::collection()` for a list.
- A Resource shapes; it never queries and never decides what to load. Guard relations with
  `whenLoaded()`, so a missing eager load shows as absent, not as one query per row.
- It is the whitelist: a field not listed never leaves the server, so password hashes, tokens and
  internal flags stay out by default.
- A list's own Resource (`IndexEmployeeResource`) may be slimmer than the detail one.
- Page panels use their own typed resources instead; see [http.md](http.md#typed-page-resources).

## Pagination

- Lists paginate through the query's `->pagination()` ([queries.md](queries.md)); the controller passes
  the paginated collection to `data()` and the builder adds `pagination`.
- Default page size 20. The index request caps the `pages_count` input at 100 (the response reports it as `per_page`), so a client cannot ask for the table.
- Counts for the whole filtered set go through `->additional(['counts' => […]])` on the collection,
  computed by the Contract, not in the Resource.

## Validation errors

A Form Request failure reaches the handler as a `ValidationException` and leaves as `422`,
`error_key: validation_error`, with `status.errors_list`. Never build a 422 by hand in a controller.
A failed throttle on a login form (a `ValidationException` with status 429) keeps its 429 and
`error_key: throttling`.

## Error handling for JSON requests

Map framework exceptions to the envelope once, in `bootstrap/app.php`:

```php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (Throwable $e, Request $request) {
        if (! $request->wantsJson() || $request->isAttemptingPrecognition()) {
            return null;
        }

        $response = match (true) {
            $e instanceof ValidationException && $e->status === 429 => res(429)->message($e->validator->errors()->first())->errorKey('throttling'),
            $e instanceof ValidationException => res($e->status, 'validation_error')->withErrors(
                collect($e->errors())->map(fn (array $messages, string $field) => ['field' => $field, 'message' => $messages[0]])->values()->all(),
            ),
            $e instanceof ModelNotFoundException, $e instanceof NotFoundHttpException => res(404, 'not_found'),
            $e instanceof AuthenticationException => res(401, 'unauthenticated'),
            $e instanceof AuthorizationException => res(403, 'forbidden'),
            $e instanceof ThrottleRequestsException => res(429, 'throttling'),
            $e instanceof HttpExceptionInterface => res($e->getStatusCode(), $e->getMessage() ?: null),
            default => config('app.debug') ? null : res(500, 'server_error'),
        };

        return $response?->toResponse($request);
    });
})
```

- `wantsJson()`, not `expectsJson()`. Why: only a client that asked for JSON gets the envelope; a page
  form post or an Inertia visit gets the redirect and error page from [http.md](http.md#errors-on-page-requests).
- Precognition requests keep Laravel's own shape, because the front-end helper reads it.
- `ModelNotFoundException` in production says only "not found"; never echo the model class.
- Report each exception once. Domain exceptions are expected outcomes: list them in `dontReport`.

### Domain exceptions

A domain refuses an operation by throwing an exception that carries a message key and a status, and
renders itself for both kinds of request:

```php
class BaseException extends Exception
{
    public function __construct(protected string $messageKey, protected int $status = 400, protected array $replace = [])
    {
        parent::__construct(__("api.{$messageKey}", $replace));
    }

    public function render(Request $request): Responsable|RedirectResponse
    {
        return $request->expectsJson()
            ? res($this->status, $this->messageKey, $this->replace)
            : back()->withErrors($this->getMessage())->withInput();
    }
}

final class EmployeeAlreadyArchived extends BaseException
{
    public function __construct()
    {
        parent::__construct('employee_already_archived', 422);
    }
}
```

- The base lives in `app/Exceptions/` (it knows HTTP); each domain's subclasses live in
  `src/Domain/{Domain}/Exceptions/`.
- The message key becomes `error_key`, so it is stable and clients can branch on it.
- Never `try`/`catch` one in a controller to rebuild the response; let it render.

## API CRUD recipe

```php
final class EmployeeController extends Controller
{
    use HasCurrentTenant;

    public function __construct(private readonly EmployeeContract $employees) {}

    public function index(IndexEmployeeRequest $request): ResponseBuilder
    {
        return res()->data(EmployeeResource::collection(
            $this->employees->getEmployees(FilterEmployeeData::fromArray([...$request->validated(), ...$this->scope()]), withRelations: ['user'])->pagination(),
        ));
    }

    public function show(string $id): ResponseBuilder
    {
        return res()->data(EmployeeResource::make($this->findOrFail($id)));
    }

    public function store(StoreEmployeeRequest $request): ResponseBuilder
    {
        $employee = $this->employees->create(CreateEmployeeData::fromArray([...$request->validated(), ...$this->scope()]));

        return res(201)->data(EmployeeResource::make($employee));
    }

    public function update(string $id, UpdateEmployeeRequest $request): ResponseBuilder
    {
        $employee = $this->employees->update($this->findOrFail($id), UpdateEmployeeData::fromArray($request->validated()));

        return res()->data(EmployeeResource::make($employee));
    }

    public function destroy(string $id): ResponseBuilder
    {
        $this->employees->delete($this->findOrFail($id));

        return res(204);
    }

    private function scope(): array
    {
        return ['tenant_id' => $this->currentTenant()->id];
    }

    private function findOrFail(string $id): Employee
    {
        $employee = $this->employees->getEmployee($id, FilterEmployeeData::fromArray($this->scope()));
        abort_if($employee === null, 404);

        return $employee;
    }
}
```

```php
Route::prefix('api/v1')->name('api.')->middleware('api')->group(function () {
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('employees', EmployeeController::class);
    });
});
```

Checklist:

- [ ] `Index`, `Store` and `Update` requests in `Requests/{Feature}/`; the index request validates every
      filter even though it is a `GET` ([http.md](http.md#index-requests)).
- [ ] Every method returns `ResponseBuilder`; `201` on store, `204` on destroy.
- [ ] `Route::apiResource()` inside the authenticated group; `->only([...])` or `->except([...])` for a
      subset, and drop the matching methods, requests and Contract methods.
- [ ] The scope key comes after the spread, and every method that takes an id (`export`, `archive`
      included) resolves it through the same scoped lookup.
- [ ] Foreign keys to tenant-owned tables use an ownership-scoped `Rule::exists`.
- [ ] Contract methods exist for each call ([contracts-and-services.md](contracts-and-services.md)); no
      reach-around to a Model.
- [ ] A feature test per endpoint asserts through the envelope ([testing.md](testing.md)).

## JSON endpoints that feed the app's own pages

A page panel's screens sometimes read JSON after load (a comments panel, a search picker, a table that
refreshes). These are not the public API:

- Route them in their own group (`/data/{module}/{action}`, named `data.{module}.{action}`) with the
  panel's login. An endpoint that serves one page is a method on that page's controller; one that
  several pages share gets its own controller.
- The group has no page-permission middleware, so each endpoint checks it itself: it answers 403 unless
  the user may open the page it serves (`abort_unless($user->hasPermission('admin.employees.show'), 403)`).
- Input through a Form Request, like any action.
- A success is plain JSON with no envelope: records through the page resources, under a named key
  (`['activities' => ActivityResource::collection($activities)]`); a paginated list uses the same
  `{ rows, meta }` shape as the page props.
- A failure still comes back in the envelope from the handler (422 `validation_error`, 403, 404), so
  the page reads `status.error_key`, never the message text.

## Verify

```bash
# JSON built outside the builder
grep -rn "response()->json(" src/Presentation/

# API controllers that never mention the builder
grep -rLn "ResponseBuilder" src/Presentation/Api/Controllers/

# store returning 200 (review each hit)
grep -rnA6 "function store(" src/Presentation/Api/Controllers/ | grep "return res()"

# Resources that query
grep -rnE "::query\(|::where\(|->get\(\)|->count\(\)" src/Presentation/*/Resources/
```
