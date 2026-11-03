# DTOs

**Read when:** writing a Create, Update, Filter, nested or options Data class, or building one from a request.
**Owns:** the `Data` suffix, `snake_case` properties, `fromArray()` as the one construction path, filter /
create / update shapes, sent keys in updates, nested DTOs, options DTOs for JSON columns, read DTOs.

## TL;DR

- Class name ends in `Data`, lives in `src/Domain/{Domain}/DataTransferObjects/` (sub-folders allowed), uses
  `Arrayable`. Declared `final class` with `public readonly` properties.
- Properties are **`snake_case`**, matching DB columns one for one.
- **Build with `fromArray()`, never `new`**, at every call site. A `fromRequest()` on the DTO itself may shape
  input first, and ends in `self::fromArray()`.
- `fromArray()` is **lenient**: it keeps the keys the constructor declares and drops the rest.
- Create and Update DTOs come from `$request->validated()`. Filter DTOs too, in new code.
- Server-pinned values go **last** in a spread, so the request cannot override them. Never use `+` for that.
- `Update{Entity}Data` is all-nullable; the Action writes only the keys that were sent (`excludeUnsent()`).
- Children are DTOs built with `ChildData::arrayFrom()`, never arrays of arrays.
- A DTO reads what is already loaded. It never queries or calls `load()`.

## Naming

| Shape | Name | Used by |
|---|---|---|
| Read-side filter | `FilterEmployeeData extends FilterData` | `GetEmployees`, the `scopeFilterBy()` scope |
| Insert payload | `CreateEmployeeData` | `CreateEmployee` |
| Partial update | `UpdateEmployeeData` | `UpdateEmployee` |
| Domain operation | `ActivateEmployeeData`, `AssignManagerData` | the Action of the same verb |
| Child structure | `EmployeeContactData` | inside another DTO |
| JSON column | `DepartmentSettingsData` | the model's `settings` accessor |
| Read model (option) | `EmployeeData` | a Contract or a page prop |

`CreateEmployeeDTO`, `EmployeeDto` and `EmployeeContact` are all wrong. Why: the suffix is how every layer,
and every grep, recognises a transport object.

## `snake_case` properties

Generic PHP style says camelCase. DTO properties are the one carve-out.

```php
// ✅ keys match columns, so no mapping layer exists
final class CreateEmployeeData
{
    use Arrayable;

    public function __construct(
        public readonly int $user_id,
        public readonly string $job_title,
        public readonly ?string $notes = null,
    ) {}
}

// ❌ camelCase forces a userId → user_id translation at every boundary
public readonly int $userId,
```

Why: `Model::create($data->toArray())`, `$model->update(...)` and `fromArray($request->validated())` only
work without mapping because the keys line up. Variables, parameters and methods elsewhere stay camelCase.

Declare `final class` with `public readonly` properties, not `final readonly class`. Why: a readonly class
cannot use a trait that holds static state, and `Arrayable` keeps its sent-keys record in a static `WeakMap`
(PHP fatal error, checked 2026-11-03).

## One construction path: `fromArray()`

```php
// ✅
$data = UpdateUserData::fromArray(['email' => $email, 'phone' => $phone]);

// ❌ bypasses fromArray()
$data = new UpdateUserData(email: $email, phone: $phone);

// ❌ a named factory whose only job is to wrap new
public static function forUser(User $user): self { return new self(user_id: $user->id); }
```

Why: `fromArray()` records which keys the caller sent. A DTO built with `new` has an empty record, so a
later `excludeUnsent()` drops every field and the update writes nothing, far from the `new` that caused
it. Named arguments are no reason for `new`: the array keys already name each field.

A `fromRequest()` on the DTO is the one place for shaping `fromArray()` cannot do: building children,
combining fields, coercing a type. It ends in `self::fromArray()` so the sent keys are still recorded.

```php
public static function fromRequest(StoreEmployeeRequest $request): self
{
    return self::fromArray([
        ...$request->safe()->except('contacts'),
        'contacts' => EmployeeContactData::arrayFrom($request->validated('contacts')),
    ]);
}
```

Kernel result objects that never map to columns (a transition result with `allowed()` / `failed()`
constructors) are value objects, not transport DTOs; the rule above is about transport DTOs.

## Lenient `fromArray()` and where input comes from

The kernel's `fromArray()` ([core-kernel.md](core-kernel.md)) passes the keys the constructor declares and
silently drops the rest. That makes the **input source** the safety boundary:

| DTO | Hydrate from | Why |
|---|---|---|
| Create / Update | `$request->validated()` from a Form Request | Writes never accept a key nobody validated. |
| Filter, new code | `$request->validated()` from an `Index{Entity}Request` | A filter key that widens access (`with_trashed`, a tenant id) cannot arrive unless a rule names it. |
| Filter, legacy page | `$request->all()` | Tolerated until the page is reworked; only for filters that declare no privileged key. |

The Form Request rules and the DTO property list mirror each other one for one. A property typed
`?string` throws a `TypeError` when the request sends a list; validate the shape the property accepts.

If you want misspelled keys to fail loudly instead of being dropped, a strict `fromArray()` that throws on
an unknown key is a valid project choice. Decide once per project; it changes every call site that
spreads extra keys.

## Filter DTOs

```php
final class FilterEmployeeData extends FilterData
{
    use Arrayable;

    /** @param EmployeeStatus|array<int, EmployeeStatus>|null $status */
    public function __construct(
        public readonly int|array|null $id = null,
        public readonly int|array|null $user_id = null,
        public readonly EmployeeStatus|int|array|null $status = null,
        public readonly ?string $employee_number = null,
        public readonly ?string $hired_from = null,
        public readonly ?string $hired_to = null,
        public readonly ?bool $with_trashed = null,
    ) {}
}
```

- Every property nullable with a `null` default, so an empty filter is valid and means "no filter".
- A field that takes one value or many is **one** property typed `int|array|null`, paired with
  `whereByType` in the scope. Never add a parallel `user_ids` beside `user_id`; widen the one you
  have. Why: two keys for one column means two scope branches and callers guessing which to send.
- Every declared property is read by the scope ([models.md](models.md#the-filter-trait)). A property no
  clause reads looks like a working filter and filters nothing.
- List controls (`pages_count`, `page_name`, `sort_by`, `sort_by_direction`, `select`) live on the
  `FilterData` base and are applied by `GetDataAbstract`, never by the scope ([core-kernel.md](core-kernel.md)).
  Give a second paginated list on the same page its own `page_name`.

### Tenant-scoped filters declare their scope

If the entity hangs off a tenant (`team_id`, `account_id`, …), the filter declares that property, the scope
reads it, and the controller pins it. Why: with a lenient `fromArray()`, a scoping key the DTO does not
declare is dropped without error, and the list returns every tenant's rows while looking correct in review.
Only the tenant entity itself and the `FilterData` base declare no scope.

### Pinning server values

```php
// ✅ the spread puts the server's value last, so it wins
$filters = FilterEmployeeData::fromArray([
    ...$request->validated(),
    'user_id' => $request->user()->id,
]);

// ❌ + keeps the LEFT value: ?user_id=7 reads someone else's employee records
$filters = FilterEmployeeData::fromArray($request->all() + ['user_id' => $request->user()->id]);
```

Use `+` only for defaults the request may change (`+ ['pages_count' => 20]`). A privileged flag
(`with_trashed`) is either pinned or left out of the Form Request rules, so `validated()` cannot carry it.
Never echo `$request->all()` back to the page as the current filters; echo `validated()`.

## Create and Update DTOs

- `Create{Entity}Data`: required properties have no default; optional columns are nullable with `null`.
- `Update{Entity}Data`: **every** property nullable with a `null` default.
- The payload is the DTO; the entity being changed is a separate Action parameter, not a DTO field.
- Values that are not columns (translated names, files, child lists) stay in the DTO but are cut out
  before the write with `only([...])` or `exclude([...])`.

### Writing only what was sent

```php
final class UpdateEmployee
{
    public static function handle(Employee $employee, UpdateEmployeeData $data): Employee
    {
        return DB::transaction(function () use ($employee, $data) {
            $employee->update((clone $data)->exclude(['contacts'])->excludeUnsent()->toArray());

            if ($data->isSent('contacts')) {
                SyncEmployeeContacts::handle($employee, $data->contacts);
            }

            return $employee;
        });
    }
}
```

- `excludeUnsent()` keeps the keys the caller passed to `fromArray()`, including an explicit `null`, so
  a form can clear a column. A key the request did not carry is not in `validated()`, so it stays unsent.
- `isSent('key', ...)` gates a side effect on whether the field arrived at all.
- `filterNull()` (or `Arr::whereNotNull()`) drops nulls instead. Use it only where `null` never means
  "clear this", for example a create that should fall back to column defaults.
- The narrowing helpers (`only`, `exclude`, `filterNull`, `excludeUnsent`) narrow a working set **on the
  same instance**, and `toArray()` returns that working set afterwards. `clone` first when the DTO is read
  again later in the Action, or the second read sees the narrowed keys.

The helpers themselves are defined in [core-kernel.md](core-kernel.md); the Action shape is in
[actions.md](actions.md).

## Nested DTOs

```php
final class EmployeeContactData
{
    use Arrayable;

    public function __construct(
        public readonly ContactType|string $type,
        public readonly string $value,
        public readonly bool $is_primary = false,
    ) {}
}

final class CreateEmployeeData
{
    use Arrayable;

    /** @param array<int, EmployeeContactData> $contacts */
    public function __construct(
        public readonly int $user_id,
        public readonly string $job_title,
        public readonly array $contacts,
        public readonly ?string $notes = null,
    ) {}
}
```

**The construction path:** `fromArray()` does not build children. The children are built with
`EmployeeContactData::arrayFrom($rows)` and handed to the parent's `fromArray()` under their key. For a
request, that happens in the parent's `fromRequest()` (above), and the controller calls
`CreateEmployeeData::fromRequest($request)`. `CreateEmployeeData::fromArray($request->validated())` on a DTO
with children is wrong: `contacts` arrives as raw arrays and the Action's typed closure fails.

Why children are DTOs: an array of arrays leaves the inner keys informal, and the consuming Action has to
read them defensively. Type the parent property with `@param array<int, ChildData>` so tools see the
element type.

## Options DTOs for a JSON column

A model with a free-form `settings` JSON column backs it with `{Entity}SettingsData`, so every read is
typed (`$department->settings->is_public`) instead of `$department->settings['is_public'] ?? null`.

```php
// On the entity
protected function settings(): Attribute
{
    return Attribute::get(function (?string $value) {
        $settings = json_decode($value ?? '{}', true) ?? [];

        return DepartmentSettingsData::fromArray([
            ...$settings,
            'invitation_policy' => InvitationPolicy::tryFrom((int) ($settings['invitation_policy'] ?? 0)) ?? InvitationPolicy::AUTOMATIC,
        ]);
    });
}
```

```php
final class DepartmentSettingsData
{
    use Arrayable;

    public function __construct(
        public readonly bool $is_public = false,
        public readonly InvitationPolicy $invitation_policy = InvitationPolicy::AUTOMATIC,
    ) {}
}
```

- One options DTO per model with a `settings` column; keys `snake_case`; every property defaulted, so
  old rows read cleanly.
- Derive and cast in the accessor once (enum from int, filename to URL, defaults), never at a call site.
- Store scalars in the JSON; expose typed values through the DTO.
- Keep `'settings' => 'array'` in `casts()` so writes encode; the accessor overrides reads.
- **Writes merge** from the raw stored value, or every other key is lost:

```php
// ✅
$department->update(['settings' => [...json_decode($department->getRawOriginal('settings') ?? '{}', true), 'is_public' => true]]);

// ❌ drops every other key
$department->update(['settings' => ['is_public' => true]]);
```

Only the Action that creates the row may write a fresh settings bag.

## Read DTOs

Contracts usually return Entities; the stricter target is a read DTO (`EmployeeData`) so callers cannot
mutate the row or lazy-load relations. Do not block a change on this. When you do build one:

```php
public static function fromModel(Employee $employee): self
{
    return self::fromArray([
        'id' => $employee->id,
        'employee_number' => $employee->employee_number,
        'user_name' => $employee->relationLoaded('user') ? $employee->user?->name : null,
    ]);
}
```

A DTO **reads what is loaded and degrades**; it never calls `load()`, `loadMissing()` or a query. Why: it
is built once per row, so a load inside it is an N+1 by construction. The caller eager-loads, because only
the caller knows how many rows it holds.

## Verify

```bash
# DTOs built with new outside their own class
grep -rnE "new [A-Z][A-Za-z]*Data\(" src/ | grep -v "DataTransferObjects/"

# camelCase DTO properties
grep -rnE 'public readonly [A-Za-z?|\\]+ \$[a-z]+[A-Z]' src/Domain/*/DataTransferObjects/

# Classes in DataTransferObjects without the Data suffix
find src/Domain/*/DataTransferObjects -name '*.php' ! -name '*Data.php'

# DTOs that load relations or query
grep -rnE "loadMissing\(|->load\(|::query\(" src/Domain/*/DataTransferObjects/

# The + operator next to request input (the request wins)
grep -rnE 'request->(all|validated)\(\) \+' src/Presentation/

# Options writes that do not merge the stored value (review each)
grep -rnE -A1 "'(options|settings)' => \[" src/Domain/*/Actions/
```
