# Core kernel

**Read when:** starting this layout in a new app, or when a rule elsewhere names `Arrayable`,
`FilterData`, `GetDataAbstract`, `whereByType`, `whereLikeText`, `countUpTo`, `createOrUpdateOrDelete`,
`BaseEnum`, `ModelAbility`, `BaseException` or `CurrentUser`.
**Owns:** the shared classes in `src/Domain/Core/` (plus the exception base and the `CurrentUser`
binding) that every domain depends on, and how they are registered.
**See also:** [dtos.md](dtos.md) · [queries.md](queries.md) · [enums-and-states.md](enums-and-states.md) ·
[models.md](models.md)

## TL;DR

- `Core` is the one domain every other domain imports directly, with no Contract. It imports no other
  domain. Why: it holds plumbing, not business data, so it has nothing to hide.
- `Arrayable` gives every DTO a lenient `fromArray()`, `toArray()` and the sent-keys helpers.
- `FilterData` is the base of every `Filter{Entity}Data` and carries the list controls.
- `GetDataAbstract` is the base of every list Action: the caller picks `pagination()`, `collection()`,
  `count()` or `exists()`, so counting never loads rows.
- Query macros (`whereByType`, `whereLikeText`, `countUpTo`, `createOrUpdateOrDelete`) are registered once
  in `CoreServiceProvider`.
- Add to `Core` only what at least two domains use. Why: a kernel that grows business rules becomes the
  domain everything depends on.

If the project already has these under other names, use those. The code is a starting point.

## The Core tree

```
src/Domain/Core/
├── Abstracts/             GetDataAbstract, Feature
├── Actions/               LockTransactionRunner, IncrementSequenceCount
├── Casts/                 reusable casts (an enum-array cast, for example)
├── Contracts/ Services/   only for cross-cutting services (sequences, uploads, job batches)
├── DataTransferObjects/   FilterData
├── Exceptions/            ProcessException
├── Helpers/               the bodies of the query macros
├── Models/Entities/       Sequence
├── Providers/             CoreServiceProvider
└── Traits/                Arrayable, BaseEnum, ModelAbility
```

## Arrayable

```php
namespace Domain\Core\Traits;

trait Arrayable
{
    private static ?WeakMap $arrayableState = null;

    public static function fromArray(array $data): static
    {
        $reflection = new ReflectionClass(static::class);
        $parameters = array_map(fn (ReflectionParameter $p) => $p->getName(), $reflection->getConstructor()?->getParameters() ?? []);
        $instance = $reflection->newInstanceArgs(array_intersect_key($data, array_flip($parameters)));

        foreach ($reflection->getProperties(ReflectionProperty::IS_PUBLIC) as $property) {
            if (! $property->isReadOnly() && array_key_exists($property->getName(), $data)) {
                $property->setValue($instance, $data[$property->getName()]);
            }
        }

        return $instance->remember(data: null, sent: $data);
    }

    public static function arrayFrom(array $items): array
    {
        return array_map(fn (array $item) => static::fromArray($item), $items);
    }

    public function excludeUnsent(): static
    {
        return $this->remember(Arr::only($this->toArray(), array_keys($this->sent())));
    }

    public function isSent(string ...$keys): bool
    {
        return array_diff($keys, array_keys($this->sent())) === [];
    }

    public function toArray(): array
    {
        return self::state()[$this]['data'] ?? $this->publicValues();
    }

    public function __serialize(): array
    {
        return ['props' => $this->publicValues(), 'sent' => $this->sent()];
    }

    public function __unserialize(array $payload): void
    {
        foreach ($payload['props'] as $key => $value) {
            $this->{$key} = $value;
        }

        $this->remember(data: null, sent: $payload['sent']);
    }

    public function __clone(): void
    {
        foreach (self::state() as $source => $entry) {
            if ($source !== $this && $source::class === static::class && $source->publicValues() === $this->publicValues()) {
                $this->remember($entry['data'], $entry['sent']);

                return;
            }
        }
    }

    private function remember(?array $data, ?array $sent = null): static
    {
        $state = self::state();
        $state[$this] = ['data' => $data, 'sent' => $sent ?? $this->sent()];

        return $this;
    }

    private function sent(): array
    {
        return self::state()[$this]['sent'] ?? [];
    }

    private function publicValues(): array
    {
        $names = array_map(fn (ReflectionProperty $p) => $p->getName(), (new ReflectionClass($this))->getProperties(ReflectionProperty::IS_PUBLIC));

        return Arr::only(get_object_vars($this), $names);
    }

    private static function state(): WeakMap
    {
        return self::$arrayableState ??= new WeakMap;
    }
}
```

- `fromArray()` drops keys the DTO does not declare; a missing required key throws. Where input may come
  from, and strict mode as a per-project option: [dtos.md](dtos.md).
- The sent keys and the working set live in a `WeakMap`, off the object. Why: they never show in `dd()`
  and are freed with the DTO.
- `only($keys)`, `exclude($keys)` and `filterNull()` are written like `excludeUnsent()`:
  `$this->remember(<a narrowed toArray()>)`. All four narrow **this instance**. Clone first when the
  DTO is read again: `(clone $data)->exclude(['contacts'])->excludeUnsent()->toArray()`.
- `__clone()` finds the source in the map (a shallow clone's public values are `===` to it) and copies its
  entry. Why: PHP gives `__clone()` no reference to the source.
- `__serialize()` carries the sent keys through the queue. Why: the `WeakMap` entry does not survive
  `unserialize()`, so a queued update would otherwise write nothing.
- DTOs are `final class` with `public readonly` properties, not `final readonly class`. Why: a readonly class
  cannot hold the trait's static property (PHP fatal error, checked 2026-11-03 on PHP 8.4).

## FilterData

```php
namespace Domain\Core\DataTransferObjects;

class FilterData
{
    public ?int $pages_count = 20;

    public ?string $page_name = 'page';

    public string|array|null $sort_by = 'id';

    public ?string $sort_by_direction = 'desc';

    public array $select = [];
}
```

The list controls are writable base properties, so `fromArray()` fills them from the same input as the
filter's own fields. `sort_by` is a column or `['column' => 'direction']`. Validate it against a fixed list
in the Form Request. Why: `orderBy()` takes it as an identifier, so an unchecked value lets a client sort by
any column, hidden ones included ([http.md](http.md)). The filter's own fields: [dtos.md](dtos.md).

## GetDataAbstract

```php
namespace Domain\Core\Abstracts;

use Illuminate\Contracts\Database\Eloquent\Builder;

abstract class GetDataAbstract
{
    protected function __construct(protected readonly ?FilterData $data, protected readonly array $withRelations = [], protected readonly array $withCount = []) {}

    public static function for(?FilterData $data = null, array $withRelations = [], array $withCount = []): static
    {
        return new static($data, $withRelations, $withCount);
    }

    abstract public function query(): Builder;

    public function builder(): Builder
    {
        return $this->query()
            ->when($this->data?->select, fn (Builder $query) => $query->select($this->data->select))
            ->with($this->withRelations)
            ->withCount($this->withCount)
            ->when($this->data?->sort_by, function (Builder $query) {
                $sorts = is_array($this->data->sort_by) ? $this->data->sort_by : [$this->data->sort_by => $this->data->sort_by_direction ?? 'desc'];

                foreach ($sorts as $column => $direction) {
                    $query->orderBy($column, $direction);
                }
            });
    }

    public function pagination(): LengthAwarePaginator
    {
        return $this->builder()->paginate(perPage: $this->data->pages_count ?? 20, pageName: $this->data->page_name ?? 'page');
    }

    public function collection(?int $limit = null): Collection
    {
        return $this->builder()->when($limit, fn (Builder $query) => $query->limit($limit))->get();
    }

    public function count(): int
    {
        return $this->builder()->count();
    }

    public function countsBy(string $column): array
    {
        return $this->query()->select($column)->selectRaw('count(*) as aggregate')->groupBy($column)->pluck('aggregate', $column)->all();
    }
}
```

A subclass implements only `query()` (template in [actions.md](actions.md)). The protected constructor makes
`::for()` the one way in. `exists()` mirrors `count()`. `page_name` lets two lists on one page paginate apart. `countsBy('status')` fills
every tab badge in one grouped query.

## Query macros

```php
namespace Domain\Core\Helpers;

final class WhereByType
{
    public static function handle(Builder $builder, string $column, mixed $value): Builder
    {
        $scalar = fn (mixed $item) => $item instanceof BackedEnum ? $item->value : $item;

        return match (true) {
            $value === null, $value === '', $value === [] => $builder,
            $value instanceof Builder, $value instanceof EloquentBuilder => $builder->whereIn($column, $value),
            is_array($value) => $builder->whereIn($column, array_map($scalar, $value)),
            default => $builder->where($column, $scalar($value)),
        };
    }
}

final class WhereLikeText
{
    public static function handle(Builder $builder, string $column, ?string $search): Builder
    {
        foreach (preg_split('/\s+/', trim((string) $search), flags: PREG_SPLIT_NO_EMPTY) as $term) {
            $builder->whereLike($column, '%'.addcslashes($term, '%_\\').'%', caseSensitive: false);
        }

        return $builder;
    }
}
```

- `whereByType` takes a value, an enum, an array of either, or a sub-query, and skips an empty value.
- `whereLikeText` requires every word, anywhere in the column. The escape stops `100%` matching every row.
- `countUpTo($limit = 99)` counts `fromSub($builder->select(DB::raw('1'))->reorder()->limit($limit))`;
  show `99+` past it. Why: an exact `COUNT(*)` is the slow part of a badge.
- How filter scopes use them: [queries.md](queries.md).

`createOrUpdateOrDelete` syncs a has-many relation to a submitted list: rows missing from the list are
deleted (or detached), the rest are upserted. It reads this parent's existing ids, sets the foreign key on every submitted row, and resets to `null`
any submitted id that is not in that list. Then, in one transaction, it deletes (or nulls the foreign key
of) the rows whose ids were not submitted and runs `upsert($rows, [$key])` on the related model.

Why the reset: the upsert matches on the primary key alone, so a forged id would move another parent's row. A `null` key inserts on MySQL and MariaDB; on PostgreSQL split
inserts from updates. For a morph-many relation also set the morph type column on each row.

## Registering the kernel

```php
class CoreServiceProvider extends ServiceProvider
{
    public array $bindings = [SequenceContract::class => SequenceService::class];

    public function boot(): void
    {
        Builder::macro('whereByType', fn (string $column, mixed $value) => WhereByType::handle($this, $column, $value));
        Builder::macro('whereLikeText', fn (string $column, ?string $search) => WhereLikeText::handle($this, $column, $search));
        EloquentBuilder::macro('countUpTo', fn (int $limit = CountUpTo::LIMIT) => CountUpTo::handle($this, $limit));
        HasMany::macro('createOrUpdateOrDelete', fn (iterable $records, bool $detach = false) => CreateOrUpdateOrDelete::handle($this, $records, $detach));
    }
}
```

`Builder` is `Illuminate\Database\Query\Builder`; Eloquent builders forward to it. In
`bootstrap/providers.php` register `Core` first, then one provider per domain, then one per panel.

## BaseEnum and ModelAbility

`BaseEnum` gives every backed enum `values()`, `isListed()` (strict), `fromName()`, `tryFromName()`,
`fromOrAbort($value, 404)`, and `all()` / `only([...])` / `except([...])`, which return each case as an
object with every public instance method's result folded in (`label`, `color`), for dropdowns and badges.
It reads the methods with `ReflectionEnum` once and calls each on every case.

`fromOrAbort()` is `self::tryFrom($value) ?? abort($status)`. Callers and case naming:
[enums-and-states.md](enums-and-states.md).

`ModelAbility` gives an entity `getAbility()` (`new $this->abilityClass($this)`, throwing a `LogicException`
when the entity declares none), `ability($method, ...$args)` (asks it), and `hasAbility($method, ...$args)`
(`abort_unless(..., 403)`).

How an entity declares `$abilityClass` and what an Abilities class may ask: [models.md](models.md).

## Exceptions

```php
namespace App\Exceptions;

class BaseException extends Exception
{
    protected array $data = [];

    public function __construct(protected string $key, protected int $status = 400, protected array $replace = [])
    {
        parent::__construct(trans("errors.{$key}", $replace));
    }

    public static function withMessage(string $key, array $replace = []): static
    {
        return new static($key, replace: $replace);
    }

    public function render(Request $request): Responsable|RedirectResponse
    {
        if (! $request->expectsJson()) {
            return back()->withErrors($this->getMessage())->withInput();
        }

        $response = res($this->status, $this->key, $this->replace);

        return $this->data ? $response->data($this->data) : $response;
    }
}
```

`statusCode(int)` and `withData(array)` set the property and return `$this`. Each domain has one exception
class with a named constructor per failure: `EmployeeException::alreadyArchived()` returns
`self::withMessage('employee_already_archived')->statusCode(409)`.

Why: an Action throws and never builds a response, yet the user gets a translated message and the right
status. The base lives in `app/` because `render()` is HTTP glue. `res()` and its envelope:
[json-api.md](json-api.md).

## Concurrency helpers

`LockTransactionRunner::run($key, $refId, $callback)` runs the callback inside
`Cache::lock("{$key}_{$refId}", 60)->block(10, fn () => DB::transaction($callback))` and turns a
`LockTimeoutException` into `ProcessException::processIsLocked()`.

The lock needs a cache store with atomic locks (Redis, database, memcached). `IncrementSequenceCount::handle($key)`
runs `Sequence::query()->lockForUpdate()->firstOrCreate(['key' => $key])` and `increment('count')` in a
transaction, and `sequences.key` is unique, so two first callers cannot both create the row. When to use
each: [actions.md](actions.md).

## Feature flags (optional)

`Domain\Core\Abstracts\Feature` has `abstract protected static function flag(): FeatureFlag` and
`enabled()` / `disabled()` that ask Pennant for `static::flag()->value`. `FeatureFlag` is a Core enum whose
cases `CoreServiceProvider::boot()` defines from config. A domain wraps its flag in
`Models/Features/{Name}Feature.php`, so callers ask `EmployeeInvitationsFeature::enabled()` and never spell
the flag string.

## CurrentUser

```php
interface CurrentUser
{
    public function admin(): ?Admin;
}

// app/Providers/AppServiceProvider::register()
$this->app->singleton(CurrentUser::class, fn () => new CurrentUserResolver(['admin' => fn () => auth('admin')->user()]));
```

`CurrentUserResolver` keeps the map of closures; `admin()` runs `$this->guards['admin']` when it is set and
returns the result only if it is an `Admin`, else `null`.

It lives in the domain that owns the user models, not in `Core`. Add one accessor per kind of actor. The
resolver runs the guard on every call and checks the type. Why: the singleton never holds a stale user,
and a guard wired to the wrong provider answers "nobody" instead of the wrong person. The rule it serves is
in [architecture.md](architecture.md#who-is-acting).

## Enforcing the kernel

The `arch()` tests that hold these shapes are in [testing.md](testing.md).
