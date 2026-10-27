# DTOs

**Read when:** writing a Create, Update, Filter, nested or options Data class, or hydrating one from a request.
**Owns:** the `Data` suffix, `snake_case` properties, `fromArray()` as the one construction path,
filter / create / update shapes, `fromRequest()`, nested DTOs, options DTOs for JSON columns.
**See also:** [core-kernel.md](core-kernel.md) · [actions.md](actions.md) ·
[controllers-requests-api.md](controllers-requests-api.md)

## TL;DR

- Class name ends in `Data`. Lives in `src/Domain/{Domain}/DataTransferObjects/`. Uses `Arrayable`.
- Properties are `public readonly` and **`snake_case`**, matching DB columns 1:1.
- **Build with `fromArray()`, never `new`** at a call site. Only a DTO's own `fromRequest()` may use `new self`.
- Writes hydrate from `$request->validated()`. Filters too, when `fromArray()` is strict.
- Server-pinned values go **last** in the array so the request cannot override them.
- `Update{Entity}Data` is all-nullable. Nested structures are child DTOs, never arrays of arrays.
- A DTO reads what is already loaded. It never queries or calls `load()`.
- A filter over tenant-scoped data declares its scoping property.

## Naming

| Shape | Name | Used by |
|---|---|---|
| Read-side filter | `FilterInvoiceData extends FilterData` | `GetInvoices`, `scopeFilterBy` |
| Insert payload | `CreateInvoiceData` | `CreateInvoice` |
| Partial update | `UpdateInvoiceData` | `UpdateInvoice` |
| Domain operation | `IssueInvoiceData`, `ApplyDiscountData` | the Action of the same verb |
| Child structure | `InvoiceLineData` | inside another DTO |
| JSON column | `InvoiceOptionsData` | the model's `options` accessor |
| Read model (option) | `InvoiceData` | a Contract or a page prop |

`CreateInvoiceDTO`, `InvoiceDto` and `InvoiceLine` are all wrong: the suffix is how every layer recognises
a transport object.

## `snake_case` properties (deliberate)

Generic PHP style says camelCase. DTO properties are the one carve-out.

```php
// ✅ keys match columns, so no mapping layer exists
final class CreateInvoiceData
{
    use Arrayable;

    /** @param InvoiceLineData[] $lines */
    public function __construct(
        public readonly int $customer_id,
        public readonly string $currency,
        public readonly array $lines,
        public readonly ?string $notes = null,
    ) {}
}

// ❌ camelCase forces a translation between customerId and customer_id at every boundary
public readonly int $customerId,
```

Why: `Model::create($data->toArray())`, `$model->update(...)` and `fromArray($request->validated())` all
work only because the keys line up. Local variables, parameters and methods elsewhere stay camelCase.

## One construction path: `fromArray()`

```php
// ✅
$data = UpdateCustomerData::fromArray(['email' => $email, 'phone' => $phone]);

// ❌ bypasses fromArray()
$data = new UpdateCustomerData(email: $email, phone: $phone);

// ❌ a named factory that only wraps new
public static function forCustomer(Customer $customer): self { return new self(customer_id: $customer->id); }
```

Why: adding a property then never breaks a call site, the keys keep matching columns by construction,
and kernels that record which keys were sent (for `sentOnly()` or `excludeUnsent()`) see them. A DTO
built with `new` has an empty sent-keys record, so a later partial update can silently write nothing.

The one exception is a `fromRequest()` factory on the DTO that does real shaping `fromArray()` cannot:

```php
public static function fromRequest(StoreInvoiceRequest $request): self
{
    return self::fromArray([
        ...$request->safe()->except('lines'),
        'lines' => array_map(fn (array $line) => InvoiceLineData::fromArray($line), $request->validated('lines')),
    ]);
}
```

Prefer ending a factory in `self::fromArray()` too; `new self(...)` is tolerated only there.

## Filter DTOs

```php
final class FilterInvoiceData extends FilterData
{
    use Arrayable;

    /** @param int|array<int, int>|null $id */
    public function __construct(
        public readonly int|array|null $id = null,
        public readonly ?int $customer_id = null,
        public readonly InvoiceStatus|string|array|null $status = null,
        public readonly ?string $number = null,
        public readonly ?string $issued_from = null,
        public readonly ?string $issued_to = null,
    ) {}
}
```

- Every property nullable with a `null` default, so an empty filter is valid.
- A field that takes one value or many is one property typed `int|array|null` (or `string|array|null`),
  paired with `whereByType` in the scope. Never add a parallel `customer_ids` next to `customer_id`;
  widen the one you have. Why: two keys for one column means two scope branches and callers guessing.
- A field typed `?string` throws a `TypeError` when the request sends a list. Validate the same shape the
  property accepts.

### A filter over tenant data declares its scope (multi-tenant apps)

If the entity hangs off a tenant, the filter has the scoping property (`tenant_id`, `team_id`, …), the
scope trait reads it, and the controller pins it. Why: in one codebase a filter had no such property while
every caller passed one; with a lenient `fromArray()` the key was dropped and the list returned every
tenant's rows. It looked correct in every review. Only the root entity (the tenant itself) and the base
`FilterData` may declare no scope.

### Hydrating filters

```php
// Strict fromArray(): validated input, server values last
$filters = FilterInvoiceData::fromArray([
    ...$request->validated(),
    'customer_id' => $this->currentCustomer()->id,
]);
```

With a spread, a later key wins, so the server's value overrides anything the request sent. Do **not**
use the `+` operator for this: `$request->all() + ['customer_id' => $id]` keeps the **left** value, so
`?customer_id=7` wins and reads someone else's rows. Use `+` only for defaults the request may change.

Some filter fields must never come from the request at all (`with_trashed`, `include_hidden`). Pin them,
or leave them out of the Form Request's rules so `validated()` cannot carry them.

With a lenient `fromArray()` you may hydrate filters from `$request->all()`, but the two points above
still apply. Never echo `$request->all()` back to the page as the current filters; echo `validated()`
or `$request->only([...])`.

## Create and Update DTOs

- `Create{Entity}Data`: required properties have no default; optional columns are nullable.
- `Update{Entity}Data`: **every** property nullable. The Action strips what was not sent
  (`Arr::whereNotNull` or `sentOnly()`), so unset fields never blank columns.
- The Form Request rules and the DTO property list mirror each other one for one.
- The payload is a DTO; the entity or id being changed is a separate Action parameter, not a DTO field.

## Nested DTOs

```php
final class InvoiceLineData
{
    use Arrayable;

    public function __construct(
        public readonly int $product_id,
        public readonly int $quantity,
        public readonly int $unit_price,
    ) {}
}
```

The parent declares `/** @param InvoiceLineData[] $lines */` and builds the children in `fromArray()` or
`fromRequest()`. Why: an array of arrays leaves the inner keys informal, and the consuming Action has to
read them defensively.

## Options DTOs for a JSON column

A model with a free-form `options` JSON column backs it with `{Entity}OptionsData`, so every read is
typed (`$product->options->is_featured`) instead of `$product->options['is_featured'] ?? null`.

```php
// On the entity
protected function options(): Attribute
{
    return Attribute::get(function (?string $value) {
        $options = json_decode($value ?? '{}', true) ?? [];

        return ProductOptionsData::fromArray([
            ...$options,
            'stock_policy' => StockPolicy::tryFrom((int) ($options['stock_policy'] ?? 0)) ?? StockPolicy::TRACK,
        ]);
    });
}
```

```php
final class ProductOptionsData
{
    use Arrayable;

    public function __construct(
        public readonly bool $is_featured = false,
        public readonly StockPolicy $stock_policy = StockPolicy::TRACK,
    ) {}
}
```

- Derive and cast in the accessor once, never at each call site.
- Store scalars in the JSON; expose typed values (enums, URLs) through the DTO.
- Keep `'options' => 'array'` in `casts()` so writes encode. With a strict `fromArray()`, an old key in
  stored JSON that the DTO no longer declares will throw: drop it in the accessor or migrate the rows.
- **Writes merge**, or every other key is lost:

```php
$product->update(['options' => [...json_decode($product->getRawOriginal('options') ?? '{}', true), 'is_featured' => true]]);
```

## Read DTOs

Contracts usually return Entities today; the stricter target is a read DTO (`InvoiceData`) so callers
cannot mutate the row or lazy-load relations. Do not block a change on this. When you do build one:

```php
public static function fromModel(Invoice $invoice): self
{
    return self::fromArray([
        'id' => $invoice->id,
        'number' => $invoice->number,
        'customer_name' => $invoice->relationLoaded('customer') ? $invoice->customer?->name : null,
    ]);
}
```

A DTO **reads what is loaded and degrades**; it never calls `load()`, `loadMissing()` or a query. Why: it
is built once per row, so a load inside it is an N+1 by construction, hidden in a constructor nobody
reads. The caller eager-loads because only the caller knows how many rows it holds.

## Verify

```bash
# DTOs built with new outside their own class
grep -rnE "new [A-Z][A-Za-z]*Data\(" src/ --include='*.php' | grep -v "DataTransferObjects/"

# camelCase DTO properties
grep -rnE "public readonly [A-Za-z?|\\\\]+ \\\$[a-z]+[A-Z]" src/Domain/*/DataTransferObjects/

# Classes in DataTransferObjects without the Data suffix
ls src/Domain/*/DataTransferObjects/*.php | grep -v "Data\.php$"

# DTOs that load relations
grep -rnE "loadMissing\(|->load\(|::query\(" src/Domain/*/DataTransferObjects/

# The + operator next to request input (request wins)
grep -rnE "request->(all|validated)\(\) \+" src/Presentation/
```
