# Architecture

**Read when:** adding a domain or a panel, placing a new file, making one domain talk to another, or
writing an event, listener, job, console command or observer.
**Owns:** the PSR-4 layout, the domain and presentation trees, boundaries, cross-domain calls, events and
listeners, jobs and background work, console commands, observers, multi-tenancy notes, and how DDD files
are created.
**See also:** [core-kernel.md](core-kernel.md) · [actions.md](actions.md) ·
[contracts-and-services.md](contracts-and-services.md)

## TL;DR

- `src/Domain/{Domain}/` holds business logic. `src/Presentation/{Panel}/` holds HTTP and views. `app/`
  holds framework glue only. Why: a domain must run the same from a request, a job, a command or a test.
- Same domain: import the Action. Other domain: `app({Other}Contract::class)`. Nothing else crosses.
- Only `Actions/` and `DataTransferObjects/` may have sub-folders. No layer nests inside another, and no
  invented layer (`Handlers/`, `Resolvers/`).
- A domain never reads the session, the request or a guard. It asks a `CurrentUser` contract.
- Cross-domain work is a Contract call (sync), an event (decoupled) or a job (slow, retryable).
- Jobs, commands and listeners are thin: they call a Contract or an Action and hold no domain logic.
- Commands are auto-registered from `src/Domain/*/Commands/`; schedule them in `withSchedule()`.
- Create DDD files by hand or by cloning a neighbour; `make:model`, `make:controller`, `make:request`
  and `make:resource` write into `app/`.

## PSR-4

```json
"autoload": {
    "psr-4": {
        "App\\": "app/",
        "Domain\\": "src/Domain/",
        "Presentation\\": "src/Presentation/"
    }
}
```

## Domain tree

```
src/Domain/{Domain}/
├── Actions/               one class per operation; may group: Actions/{Entity}/ or Actions/{SubArea}/
├── Commands/              console commands that drive only this domain
├── Contracts/             the domain's public interfaces, one per entity or sub-area
├── DataTransferObjects/   *Data classes; may group: DataTransferObjects/{SubArea}/
├── Enums/                 backed enums owned by the domain
├── Exceptions/            exceptions thrown by Actions
├── Jobs/                  queued work owned by the domain
├── Listeners/             only when the domain reacts to another domain's events
├── Events/                only when the domain publishes events others react to
├── Models/
│   ├── Entities/          Eloquent models
│   ├── Scopes/            {Entity}Filter traits and global Scope classes
│   ├── Abilities/         {Entity}Abilities (per-record permission questions)
│   ├── Features/          feature-flag wrappers for this domain (optional)
│   └── Traits/            model-only traits shared inside this domain
├── Observers/             registered in this domain's provider boot()
├── Providers/             {Domain}ServiceProvider with $bindings
├── Services/              Contract implementations; one-line delegations to Actions
└── Traits/                traits used by Services and Actions (not models)
```

`Core` is the one domain with extra folders (`Abstracts/`, `Casts/`, `Helpers/`); see
[core-kernel.md](core-kernel.md). Create a folder only when it gets its first file.

A group folder may hold several small domains that share a theme, each with the full tree and its own
provider: `src/Domain/Integration/{Vendor}/Contracts/...`, namespace `Domain\Integration\{Vendor}\...`.
Why: one provider and one Contract per external system, without a top-level folder for each.

## Presentation tree

```
src/Presentation/{Panel}/
├── Controllers/{Feature}/{Feature}Controller.php
├── Requests/{Feature}/Store{Entity}Request.php
├── Resources/             JSON transformers (only where JSON is served)
├── Routes/web.php | api.php
├── Providers/             loads this panel's routes and middleware
├── Rules/                 custom validation rules
├── Traits/                controller and request traits for this panel
└── Views/                 only in panels that render server-side pages
```

A panel is one audience: `Admin` (back office), `Api` (mobile or partner JSON), `Site` (public pages),
`Pdf` (rendered documents). Each panel has a provider that calls `loadRoutesFrom()` on its `Routes/*.php`;
register it in `bootstrap/providers.php` next to the domain providers. A `Shared` folder may hold the base
controller, traits and rules several panels reuse. Controller and request shapes live in
[http.md](http.md); the JSON envelope in [json-api.md](json-api.md).

A controller belongs to exactly one panel. When two panels need the same behaviour, the logic goes into
the domain and both controllers call the Contract. Why: a controller that extends or includes one from
another panel couples two audiences' auth and response shapes.

## What goes where

| Need | Place |
|---|---|
| A business operation | `Actions/{Verb}{Entity}.php` |
| The domain's API for other domains and panels | `Contracts/{Entity}Contract.php` + `Services/{Entity}Service.php` |
| A transport object between layers | `DataTransferObjects/{Verb}{Entity}Data.php` |
| A status, type or kind | `Enums/{Entity}{Thing}.php` |
| An Eloquent model | `Models/Entities/{Entity}.php` |
| List filtering | `Models/Scopes/{Entity}Filter.php` (trait) |
| "Can this record do X now?" | `Models/Abilities/{Entity}Abilities.php` |
| Cross-cutting role-based authorization | `app/Policies/` |
| Validation | `src/Presentation/{Panel}/Requests/` |
| Response shaping | `src/Presentation/{Panel}/Resources/` |
| Middleware, framework adapters, package hooks | `app/` |

Business logic in Presentation, or HTTP concerns (request, session, redirects, guards) inside a Domain,
are critical violations.

## Flat layers

Three shapes of the same mistake fork a domain's layout, so anything that walks it (a reviewer, an arch
test, an audit) sees only part of the domain:

```
❌ src/Domain/Employee/Invitations/Contracts/InvitationContract.php    a subsystem swallowing the layers
❌ src/Domain/Employee/Contracts/Invitations/InvitationContract.php    a subsystem folder in a flat layer
❌ src/Domain/Employee/Models/Entities/Abilities/EmployeeAbilities.php a layer nested in another
✅ src/Domain/Employee/Contracts/InvitationContract.php
✅ src/Domain/Employee/Actions/Invitations/InviteEmployee.php          Actions may group
✅ src/Domain/Employee/Models/Abilities/EmployeeAbilities.php
```

Classes that serve one subsystem (a strategy interface, its implementations, a value object) go together
under `Actions/{SubArea}/`. The class name carries the grouping in every other layer.

**Existing deviations.** When an older domain uses a different folder name (a singular `Enum/`, a
`Models/Filters/`), add new files next to their siblings there, and use the standard names in new
domains. Why: a rename across every reference is its own task, never a side effect.

## Boundaries

A Contract is the gateway to a domain. Actions, Services and Models behind it are private.

```php
// ✅ same domain: you own the Action
use Domain\Employee\Actions\CreateEmployee;

$employee = CreateEmployee::handle($data);

// ❌ same domain: needless indirection
$employee = app(EmployeeContract::class)->createEmployee($data);

// ✅ other domain: through its Contract
$user = app(UserContract::class)->getUser($userId);

// ❌ other domain: reaching into internals
use Domain\User\Models\Entities\User;
use Domain\User\Actions\GetUser;

$user = User::find($userId);
$user = GetUser::handle($userId);
```

- Type-hinting another domain's Entity because its Contract returns one is fine; querying or writing it
  is not. Why: the owning domain must stay the one place for its rules, caching and events.
- An operation goes on the Contract only when another domain or a panel calls it
  ([contracts-and-services.md](contracts-and-services.md)).
- Two domains must not call each other in a cycle. Break it by moving the shared concept to a third
  domain (or `Core`), by publishing an event the other side listens to, or by a join entity that owns the
  link. Why: cycles recurse and deadlock once both sides "keep in sync" inside transactions.

### Who is acting

A class under `src/Domain/` never calls `auth()`, `Auth::user()`, `request()` or `session()`. It asks a
`CurrentUser` contract and handles `null`:

```php
$actor = app(CurrentUser::class)->admin();
```

Why: a job, a command and a test have no session, so code that reads it answers differently off a request,
and a global scope that finds no user silently stops filtering. `null` is the normal answer there, not an
edge case. Which guard answers is wired once in `AppServiceProvider`; the template is in
[core-kernel.md](core-kernel.md).

## Cross-domain communication

| Need | Use |
|---|---|
| The caller needs the result now, or it must succeed in the same transaction | Direct Contract call |
| Other domains may react; the publisher should not know who listens | Event |
| Slow work (PDF, external API, bulk write) that may fail and retry | Queued job |
| Light work after the response, no retry needed | `defer()` |

Dispatch jobs and events from Actions, not from controllers. Why: the same operation then queues the same
work from a job, a command or a test.

## Events and listeners

Use events only when a second domain must react and the publisher must not know about it. A direct
Contract call is simpler and easier to follow when there is one known consumer.

```php
namespace Domain\Employee\Events;

final class EmployeeCreated
{
    use Dispatchable;

    public function __construct(public readonly int $employee_id, public readonly int $user_id) {}
}
```

```php
namespace Domain\User\Listeners;

final class GrantEmployeeRole
{
    public function handle(EmployeeCreated $event): void
    {
        app(UserContract::class)->assignRole($event->user_id, 'employee');
    }
}

// Domain\User\Providers\UserServiceProvider::boot()
Event::listen(EmployeeCreated::class, GrantEmployeeRole::class);
```

- The event lives in the publishing domain, the listener in the reacting domain.
- Events carry scalars or DTOs, not models. Why: a listener on another domain must not get a writable
  model of a domain it does not own.
- Register listeners in the reacting domain's provider `boot()`. Why: Laravel's event discovery scans
  `app/Listeners` only, so a domain listener is silently never called otherwise (checked 2026-11-03).
- A listener, like a controller, calls a Contract. Make it `ShouldQueue` when the reaction is slow.

## Jobs

```php
namespace Domain\Employee\Jobs;

final class SendEmployeeWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public bool $deleteWhenMissingModels = true;

    public int $tries = 3;

    public function __construct(private readonly Employee $employee)
    {
        $this->onQueue('mail');
        $this->afterCommit();
    }

    public function handle(EmployeeContract $employees): void
    {
        $employees->sendWelcomeEmail($this->employee);
    }
}
```

- File: `src/Domain/{Domain}/Jobs/{Verb}{Noun}.php`. A `Job` suffix is optional; match the siblings.
- `handle()` calls one Contract method or one Action. Why: a job is a scheduling wrapper; logic inside it
  cannot be reused or called synchronously.
- Constructor property promotion, `readonly`. Pass a model (with `SerializesModels`) or an id, never a large
  array, a closure or a live client. Why: arguments are serialized; a model is re-fetched fresh when the job
  runs.
- `$deleteWhenMissingModels = true` when the row may be deleted before the job runs. Why: otherwise the job
  fails with `ModelNotFoundException` and lands in `failed_jobs` for nothing.
- Call `$this->afterCommit()` in the constructor when the job may be dispatched inside a transaction,
  unless every queue connection sets `after_commit => true`. Why: a worker can pick the job up before the
  commit, see no row, or act on a row that is then rolled back.
- Set the queue in the constructor, not at each dispatch site. Why: one place to move it.
- `handle()` may method-inject a Contract (jobs are container-built), or use `app()`.
- Add `Batchable` when the job runs inside `Bus::batch()`. Keep batch progress on the native `Batch`
  object (`progress()`, `failedJobs`, `cancel()`); do not mirror it in a table or the cache. Track the owner
  with `->withOption('user_id', $id)`.

## Console commands

```php
namespace Domain\User\Commands;

final class DeactivateInactiveUsers extends Command
{
    protected $signature = 'users:deactivate_inactive';

    protected $description = 'Deactivate users who have not signed in for 90 days.';

    public function handle(): void
    {
        $count = app(UserContract::class)->deactivateInactiveUsers();

        $this->info("Deactivated {$count} users.");
    }
}
```

- File: `src/Domain/{Domain}/Commands/{Verb}{Noun}.php`, `final class`.
- Signature `{group}:{action}`, both parts `snake_case`; the group is the domain's plural or the
  integration's key (`users:deactivate_inactive`, `employees:send_welcome_emails`). Not
  `app:deactivate-inactive`, not `users:deactivateInactive`.
- Body: resolve a Contract, call one method, print one line. No Eloquent, no business logic.
- Auto-register by glob, so a new file needs no wiring:

```php
// bootstrap/app.php
->withCommands(
    collect([...glob(base_path('src/Domain/*/Commands/*.php')), ...glob(base_path('src/Domain/*/*/Commands/*.php'))])
        ->map(fn (string $file) => str($file)->after(base_path('src').'/')->before('.php')->replace('/', '\\')->value())
        ->all()
)
```

- Registering does not schedule. Add each periodic command to `withSchedule()` too, or it never runs.
- Give every `withoutOverlapping()` an explicit expiry longer than one run (`->withoutOverlapping(60)`).
  Why: the default lock lasts 24 hours, so a run killed mid-way (a deploy) blocks the command for a day.
- Add `->onOneServer()` when more than one server runs the scheduler.

## Observers

`src/Domain/{Domain}/Observers/{Entity}Observer.php`, registered in that domain's provider `boot()` with
`Employee::observe(EmployeeObserver::class)`.

- Use an observer only when **every** write must be covered, whoever the caller. When one code path
  triggers the behaviour, put it in that Action, where it is explicit and testable.
- Keep it thin: stamp a field, clear a cache key, dispatch a job.
- Never re-enter: writing back to the observed model uses `saveQuietly()` / `updateQuietly()`. Why: a save
  inside `saved` loops.
- Do not call another domain's Contract inline; dispatch an event or a job. Why: the observer runs inside
  the caller's transaction, so a slow or failing cross-domain call takes the write down with it.
- Remember it fires from seeders, factories, tests and bulk imports too.

## High-risk resources get one seam

When a resource is dangerous to touch (a mail provider, an external database, a directory service),
exactly one domain touches it, behind one small Contract. Nothing else opens that connection or builds its
requests. Keep that Contract transport-agnostic (scalars and DTOs in, DTOs out, never a model or a live
handle). Why: every guard on the resource lives in one code path, and the local implementation can later
be swapped for a remote client by changing one binding.

## Multi-tenant apps (option)

When every row hangs off a tenant:

- Middleware resolves the tenant once per request through the tenant domain's Contract and leaves it on
  the request; a base-controller trait reads it back (`$this->currentTenant()`).
- A stranger gets **404**, a member without the permission **403**. Why: a 403 on another tenant's record
  confirms that it exists.
- Every `Filter{Entity}Data` over tenant data declares its scoping property, and the controller sets it
  after spreading the request input, so a client cannot override it ([dtos.md](dtos.md), [http.md](http.md)).
- Laravel passes route parameters to a controller **by position, not by name**. If middleware consumed a
  `{tenant}` prefix, remove it (`$request->route()->forgetParameter('tenant')`) so each method's own
  parameters line up, and never declare it in a signature.
- Background work has no request: jobs and commands take the tenant id as an argument and pass it through
  the Contract. Why: a global scope that reads the tenant from the request is empty on a queue.

## Creating DDD files

There is no generator for this layout. Copy the templates in these references, or clone a neighbouring
domain that already has the same pattern.

1. Check the concept does not already live in `Core` or an existing domain.
2. Copy the closest domain's structure into `src/Domain/{NewDomain}/`.
3. Rename namespaces and classes (`UserContract` → `EmployeeContract`).
4. Adjust DTO properties, Action bodies and the filter scope to the new schema.
5. Register `{NewDomain}ServiceProvider` in `bootstrap/providers.php`.

These write into `app/`, so never use them for a file under `src/`:

```
make:model  make:controller  make:request  make:resource  make:job  make:command  make:listener  make:event
```

The last four stay fine for app-level work that drives no single domain. These are always correct,
because their output belongs outside the domain tree:

```
make:migration  make:seeder  make:factory  make:middleware  make:policy  make:test
```

## Verify

```bash
# Imports of another domain's Actions, Services or Models (Core is allowed)
for d in src/Domain/*/; do
  n=$(basename "$d")
  grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Services|Models)\\\\" "$d" | grep -vE "use Domain\\\\($n|Core)\\\\"
done

# Panels or app/ importing Actions or Services
grep -rnE "use Domain\\\\[A-Za-z]+\\\\(Actions|Services)\\\\" src/Presentation/ app/

# Sub-folders in layers that must stay flat
find src/Domain/*/{Contracts,Services,Enums,Exceptions,Jobs,Observers} -mindepth 1 -type d 2>/dev/null

# The domain reading the session
grep -rnE "auth\(|Auth::|request\(\)|session\(" src/Domain/ --include='*.php'

# Command signatures that are not {group}:{snake_case}
grep -rhoE '\$signature = .[^ .]+' src/Domain/*/Commands/*.php | sed 's/.*= .//' | grep -vE '^[a-z_]+:[a-z_]+'
```
