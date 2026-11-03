# Core kernel

**Read when:** starting this layout in a new app, or when a rule elsewhere names `Arrayable`,
`FilterData`, `GetDataAbstract`, `whereByType`, `whereLikeText`, `ModelAbility` or `BaseEnum`.
**Owns:** the small shared classes in `src/Domain/Core/` that every other domain depends on.
**See also:** [dtos.md](dtos.md) · [actions.md](actions.md) · [queries.md](queries.md)

## TL;DR

- `Core` is the one domain every other domain may import directly. Keep it small and generic.
- `Arrayable` gives a DTO `fromArray()` and `toArray()`. Decide once whether `fromArray()` is strict.
- `GetDataAbstract` is the base of every `Get{Entity}s` list Action: the caller picks
  `pagination()`, `collection()`, `count()` or `exists()`, so counting never loads rows.
- `whereByType` and `whereLikeText` are query-builder macros registered in `CoreServiceProvider`.
- `ModelAbility` wires an entity to its `{Entity}Abilities` class.
- `BaseEnum` adds `values()`, `options()` and `fromOrAbort()` to backed enums.

If the project already has these under other names, use those. The templates below are a starting point.

## Arrayable

```php
namespace Domain\Core\Traits;

use Domain\Core\Exceptions\UnknownPropertyException;
use ReflectionClass;
use WeakMap;

trait Arrayable
{
    private static ?WeakMap $sentKeys = null;

    /** @param array<string, mixed> $data */
    public static function fromArray(array $data): static
    {
        $reflection = new ReflectionClass(static::class);
        $arguments = [];

        foreach ($reflection->getConstructor()?->getParameters() ?? [] as $parameter) {
            $name = $parameter->getName();
            $arguments[$name] = array_key_exists($name, $data)
                ? $data[$name]
                : ($parameter->isDefaultValueAvailable() ? $parameter->getDefaultValue() : null);
        }

        $unknown = array_diff(array_keys($data), array_keys($arguments));

        if ($unknown !== []) {
            throw UnknownPropertyException::for(static::class, $unknown);
        }

        $instance = $reflection->newInstanceArgs($arguments);
        self::$sentKeys ??= new WeakMap;
        self::$sentKeys[$instance] = array_keys($data);

        return $instance;
    }

    /** @return array<string, mixed> */
    public function toArray(): array
    {
        return get_object_vars($this);
    }

    /** @return array<string, mixed> */
    public function sentOnly(): array
    {
        return array_intersect_key($this->toArray(), array_flip(self::$sentKeys[$this] ?? []));
    }
}
```

```php
namespace Domain\Core\Exceptions;

use LogicException;

final class UnknownPropertyException extends LogicException
{
    /** @param array<int, string> $keys */
    public static function for(string $class, array $keys): self
    {
        return new self(sprintf('%s has no property [%s].', class_basename($class), implode(', ', $keys)));
    }
}
```

Declare DTOs as `final class` with `public readonly` properties, not `final readonly class`: a readonly
class cannot use a trait that holds a static property (PHP fatal error, checked on 8.4).

### Strict or lenient `fromArray()`

| | Strict (throws on unknown key) | Lenient (drops unknown keys) |
|---|---|---|
| Filter input | `$request->validated()` from an `Index{Entity}Request` | `$request->all()` is safe |
| A misspelled key | fails loudly where it is written | is dropped; the filter silently stops filtering |
| Cost | every index endpoint needs a Form Request | none |

Pick strict for new code and for any tenant-scoped data. Why: a dropped scoping key is a query that
returns every tenant's rows, and it looks correct in review. To make it lenient, delete the `$unknown`
check. It is a `LogicException` because it is a programmer error, not a user error.

### Two ways to do partial updates

- `Arr::whereNotNull($data->toArray())` — simple; a field can never be set back to `null`.
- `$data->sentOnly()` — writes exactly the keys the caller sent, so `null` clears a column. It only works
  when every DTO is built through `fromArray()`; a DTO built with `new` has no sent keys and the update
  writes nothing. That is one more reason `new` is banned at call sites.

## FilterData

```php
namespace Domain\Core\DataTransferObjects;

abstract class FilterData {}
```

Every `Filter{Entity}Data` extends it, uses `Arrayable`, and makes every property nullable with a `null`
default, so an empty filter is valid. Some projects put list controls on the base (`sort_by`,
`sort_by_direction`, `per_page`, `page_name`) and let `GetDataAbstract` apply them; others pass page size
to `pagination()`. Either is fine; choose one.

## GetDataAbstract

```php
namespace Domain\Core\Actions;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/** @template TModel of \Illuminate\Database\Eloquent\Model */
abstract class GetDataAbstract
{
    protected mixed $data = null;

    /** @var array<int, string> */
    protected array $withRelations = [];

    /** @var array<int, string> */
    protected array $withCount = [];

    final public function __construct() {}

    /** @return Builder<TModel> */
    abstract public function query(): Builder;

    /** @param array<int, string> $withRelations @param array<int, string> $withCount */
    public static function for(mixed $data = null, array $withRelations = [], array $withCount = []): static
    {
        $instance = new static;
        $instance->data = $data;
        $instance->withRelations = $withRelations;
        $instance->withCount = $withCount;

        return $instance;
    }

    public function pagination(int $perPage = 20, string $pageName = 'page'): LengthAwarePaginator
    {
        return $this->hydrated()->paginate($perPage, ['*'], $pageName);
    }

    public function collection(): Collection
    {
        return $this->hydrated()->get();
    }

    public function count(): int
    {
        return $this->query()->count();
    }

    public function exists(): bool
    {
        return $this->query()->exists();
    }

    /** @return Builder<TModel> */
    protected function hydrated(): Builder
    {
        return $this->query()
            ->when($this->withRelations, fn (Builder $query) => $query->with($this->withRelations))
            ->when($this->withCount, fn (Builder $query) => $query->withCount($this->withCount));
    }
}
```

A subclass implements only `query()`:

```php
/** @extends GetDataAbstract<Invoice> */
final class GetInvoices extends GetDataAbstract
{
    public function query(): Builder
    {
        return Invoice::query()->filterBy($this->data);
    }
}
```

`pageName` lets two paginated lists share one page without moving together.

## Query macros

```php
namespace Domain\Core\Helpers;

use BackedEnum;
use Illuminate\Database\Query\Builder;

final class WhereByType
{
    public static function handle(Builder $builder, string $column, mixed $value): Builder
    {
        if ($value === null || $value === []) {
            return $builder;
        }

        $scalar = fn (mixed $item) => $item instanceof BackedEnum ? $item->value : $item;

        return is_array($value)
            ? $builder->whereIn($column, array_map($scalar, $value))
            : $builder->where($column, $scalar($value));
    }
}

final class WhereLikeText
{
    public static function handle(Builder $builder, string $column, ?string $search): Builder
    {
        $search = trim((string) $search);

        foreach ($search === '' ? [] : preg_split('/\s+/', $search) as $term) {
            $escaped = str_replace(['\\', '%', '_'], ['\\\\', '\%', '\_'], $term);
            $builder->whereLike($column, "%{$escaped}%", caseSensitive: false);
        }

        return $builder;
    }
}
```

```php
namespace Domain\Core\Providers;

final class CoreServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Builder::macro('whereByType', fn (string $column, mixed $value) => WhereByType::handle($this, $column, $value));
        Builder::macro('whereLikeText', fn (string $column, ?string $search) => WhereLikeText::handle($this, $column, $search));
    }
}
```

`Builder` here is `Illuminate\Database\Query\Builder`; Eloquent builders forward to it. Why the escape:
a user searching for `100%` must not match every row.

## ModelAbility

```php
namespace Domain\Core\Traits;

trait ModelAbility
{
    public function getAbility(): object
    {
        return new $this->abilityClass($this);
    }

    public function ability(string $method, mixed ...$arguments): bool
    {
        return $this->getAbility()->{$method}(...$arguments);
    }

    public function hasAbility(string $method, mixed ...$arguments): bool
    {
        abort_unless($this->ability($method, ...$arguments), 403);

        return true;
    }
}
```

The entity declares `protected string $abilityClass = InvoiceAbilities::class;`. See
[models-scopes-abilities-enums.md](models-scopes-abilities-enums.md).

## BaseEnum

```php
namespace Domain\Core\Traits;

trait BaseEnum
{
    /** @return array<int, int|string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /** @return array<int, array{value: int|string, label: string}> */
    public static function options(): array
    {
        return array_map(fn (self $case) => ['value' => $case->value, 'label' => $case->label()], self::cases());
    }

    public static function fromOrAbort(int|string $value, int $status = 404): self
    {
        return self::tryFrom($value) ?? abort($status);
    }

    public static function tryFromName(string $name): ?self
    {
        foreach (self::cases() as $case) {
            if ($case->name === $name) {
                return $case;
            }
        }

        return null;
    }
}
```

`options()` assumes each enum defines `label()`. Use `values()` in validation: `Rule::in(InvoiceStatus::values())`
(or `Rule::enum(InvoiceStatus::class)`).

## Registering the kernel

```php
// bootstrap/providers.php
return [
    App\Providers\AppServiceProvider::class,
    Domain\Core\Providers\CoreServiceProvider::class,
    Domain\Billing\Providers\BillingServiceProvider::class,
    Domain\Customer\Providers\CustomerServiceProvider::class,
];
```

## Enforcing the kernel

A convention that nothing checks drifts. Two ways to check the shapes above automatically:

- **Pest `arch()` tests** — cheap to add, coarse (they check imports, not every call):

```php
$domains = array_diff(array_map('basename', glob(__DIR__.'/../../src/Domain/*', GLOB_ONLYDIR)), ['Core']);

foreach ($domains as $domain) {
    arch("{$domain}: actions are final")->expect("Domain\\{$domain}\\Actions")->classes()->toBeFinal();
    arch("{$domain}: services do not use DB")->expect("Domain\\{$domain}\\Services")->not->toUse('Illuminate\Support\Facades\DB');
    arch("{$domain}: dtos end in Data")->expect("Domain\\{$domain}\\DataTransferObjects")->classes()->toHaveSuffix('Data');
}

arch('no validation in the domain')->expect('Domain')->not->toUse('Illuminate\Support\Facades\Validator');
```

- **Custom PHPStan rules** — more work, more precise (for example "a `*Data` is never built with `new`
  outside its own class", "a controller signature takes no Eloquent model"). Worth it for a large team.
