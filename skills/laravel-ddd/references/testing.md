# Testing this layout

**Read when:** writing or fixing a Pest test for a domain, an endpoint or a page in this layout, or adding a
rule that should fail the build when the layout is broken.
**Owns:** the test database, where tests live, what to test at which layer, envelope assertions, page
tests, seeding rows and factories for domain models, fakes, and the architecture tests that enforce the
layers.

Written for Pest 4 on Laravel 12 (checked 2026-11-03).

## TL;DR

- Tests run on their **own** database, forced in `phpunit.xml`. Never point a run at a working database.
- Test the **Action** for logic, the **Contract** for what another domain relies on, the **route** for
  HTTP. Do not test a Service's one-line delegation.
- Mirror the domain in the path: `tests/Feature/{Domain}/`, `tests/Unit/{Domain}/`.
- JSON assertions go through the envelope: `data.*` and `status.*`, never top-level keys; validation
  errors are in `status.errors_list`.
- A page test asserts the component, the props the page reads, deferred props, the redirect after each
  write, and the 403.
- No test reaches a real external service.
- `arch()` tests hold the layer rules; add one when a review catches the same mistake twice.
- Cover a failure path, not only the happy one. Never skip or delete a failing test to get green.

## The test database

```xml
<!-- phpunit.xml -->
<env name="APP_ENV" value="testing"/>
<env name="DB_DATABASE" value="myapp_test" force="true"/>
<env name="QUEUE_CONNECTION" value="sync"/>
<env name="MAIL_MAILER" value="array"/>
<env name="CACHE_STORE" value="array"/>
<env name="SESSION_DRIVER" value="array"/>
<env name="BCRYPT_ROUNDS" value="4"/>
```

- `force="true"` so a local `.env` cannot win. Why: `RefreshDatabase` against the working database
  wipes it.
- Prepare it with `php artisan migrate --env=testing`, or let `RefreshDatabase` migrate. Never
  `migrate:fresh` by hand.
- If the schema uses engine-specific features (JSON functions, generated columns, full-text), run the
  suite on that engine, not SQLite: a SQLite run fails in ways that look like test bugs.
- One test database shared by several checkouts means one suite at a time.
- Run the narrowest set while working: `php artisan test --compact --filter=ActivateEmployeeTest`.

## Where tests live

```
tests/Feature/Employee/ActivateEmployeeTest.php      an Action or a Contract, with the database
tests/Feature/Employee/Api/EmployeeEndpointsTest.php routes of one JSON panel
tests/Feature/Pages/EmployeeShowPageTest.php         one Inertia page, named after its props class
tests/Feature/Pages/EmployeeFormPageTest.php         Create and Edit, as EmployeeFormProps
tests/Unit/Employee/EmployeeStatusTest.php           an enum, a value object, a pure helper
tests/Arch/LayersTest.php                            the layer rules
```

Most tests are feature tests. A unit test fits a pure function, an enum, a key builder, or a trait with
no database.

```php
// tests/Pest.php
pest()->extend(Tests\TestCase::class)->use(RefreshDatabase::class)->in('Feature');
```

## What to test where

| Subject | Test | Why |
|---|---|---|
| A write, a calculation, a branch | the Action directly | it holds the logic; the cheapest place to cover branches |
| Behaviour another domain relies on | `app(EmployeeContract::class)` | that is the real boundary |
| A Service | usually not directly | it only delegates; you would test the Action twice |
| An endpoint | a feature test on the route | covers routing, the Form Request, authorization, the envelope |
| A page | a feature test with `assertInertia` | covers the props class and the controller together |
| A status transition | the transition | assert the refusal reason, not only the boolean |
| An ability | the ability method | a plain bool, cheap to cover every state |
| A filter | the `Get{Entity}s` Action with a DTO | rows in and rows out, including the scoping key |

```php
it('activates a pending employee', function () {
    $employee = Employee::factory()->pending()->create();

    $activated = ActivateEmployee::handle($employee);

    expect($activated->status)->toBe(EmployeeStatus::ACTIVE)
        ->and($activated->employee_number)->not->toBeNull();
});

it('refuses to activate an archived employee', function () {
    $employee = Employee::factory()->archived()->create();

    expect(fn () => ActivateEmployee::handle($employee))->toThrow(EmployeeAlreadyArchived::class);
});
```

## JSON endpoints and the envelope

The shape is in [json-api.md](json-api.md#the-envelope).

```php
it('creates an employee', function () {
    $user = User::factory()->create();

    actingAs(User::factory()->create(), 'sanctum')
        ->postJson('/api/v1/employees', ['user_id' => $user->id, 'job_title' => 'Analyst', 'contacts' => []])
        ->assertCreated()
        ->assertJsonPath('status.success', true)
        ->assertJsonPath('data.user.id', (string) $user->id);
});

it('rejects a missing user', function () {
    actingAs(User::factory()->create(), 'sanctum')
        ->postJson('/api/v1/employees', [])
        ->assertUnprocessable()
        ->assertJsonPath('status.error_key', 'validation_error')
        ->assertJsonPath('status.errors_list.*.field', ['user_id', 'job_title']);
});

it('hides another tenant\'s employee', function () {
    $foreign = Employee::factory()->create();

    actingAs(User::factory()->create(), 'sanctum')
        ->getJson("/api/v1/employees/{$foreign->id}")
        ->assertNotFound()
        ->assertJsonPath('status.error_key', 'not_found');
});
```

- Assert `status.code` and `status.error_key`, not `status.message`, which changes with the locale.
- `assertJsonValidationErrors()` reads Laravel's default `errors` key, which this envelope does not
  send. Assert `status.errors_list.*.field` instead.
- `assertJsonPath('id', …)` or `assertJsonStructure(['id'])` at the top level is always wrong here.
- A paginated list: `assertJsonCount(20, 'data')` and `assertJsonPath('pagination.total', 137)`.
- For each guarded route, test the refused case too: 401 signed out, 403 without the permission, 404
  for another tenant's row.
- A JSON endpoint that feeds a page has no envelope on success
  (`assertJsonCount(2, 'activities')`) but keeps it on failure.

## Page tests

```php
beforeEach(function () {
    $this->withoutVite();
    $this->admin = User::factory()->withPermissions(['admin.employees.show', 'admin.employees.update'])->create();
});

it('renders the show page with its invitations deferred', function () {
    $employee = Employee::factory()->active()->has(Invitation::factory()->count(2))->create();

    actingAs($this->admin)
        ->get(route('admin.employees.show', $employee->id))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('employees/Show')
            ->where('employee.id', (string) $employee->id)
            ->where('employee.status.value', EmployeeStatus::ACTIVE->value)
            ->missing('invitations')
            ->loadDeferredProps(fn (Assert $reload) => $reload->has('invitations', 2)));
});

it('goes back to the record after a save', function () {
    $employee = Employee::factory()->pending()->create();

    actingAs($this->admin)
        ->put(route('admin.employees.update', $employee->id), ['notes' => 'Starts Monday'])
        ->assertRedirect(route('admin.employees.show', $employee->id));

    expect($employee->fresh()->notes)->toBe('Starts Monday');
});

it('refuses a user without the permission', function () {
    actingAs(User::factory()->create())
        ->get(route('admin.employees.show', Employee::factory()->create()->id))
        ->assertForbidden();
});
```

Each page's tests cover at least:

- the component and the values the page shows (`where()` on each, not the whole array);
- its deferred props load (`loadDeferredProps`);
- on an index, a filter narrows the rows, and an invalid filter value redirects to the plain list;
- each write changes the row and redirects where [http.md](http.md#where-a-write-redirects) says;
- a user without the permission gets 403.

`withoutVite()` so a test does not need a front-end build. Disable throttle middleware in the file
(`withoutMiddleware(ThrottleRequests::class)`) when the page is hit many times.

## Seeding rows and factories

```php
// ✅ factory with states
$employee = Employee::factory()->active()->for($user)->create();

// ❌ magic values the casts would have caught
$employee = new Employee(['status' => 2, 'user_id' => $user->id]);
$employee->save();
```

- Check for an existing state before adding one.
- Domain entities live outside `App\Models`, so either each model defines
  `protected static function newFactory(): EmployeeFactory`, or a provider maps names once with
  `Factory::guessFactoryNamesUsing()`. Factories live in `database/factories/{Domain}/`.
- A codebase without factories seeds what each test needs: `Model::create([...])` when the model's casts
  and events matter, `DB::table(...)->insertGetId([...])` for plain rows. Adding factories is its own
  task, not a side effect of one test.
- Explore behaviour by writing a test, not by creating rows in tinker.

## Fakes

- `Http::preventStrayRequests()` in the base test case (or a `beforeEach` in `tests/Pest.php`), so an
  unfaked call fails the test.
- `Http::fake()`, `Mail::fake()`, `Notification::fake()`, `Event::fake()`, `Storage::fake()`.
- `Bus::fake()` / `Queue::fake()` to assert dispatch; with `QUEUE_CONNECTION=sync` jobs otherwise run
  inline.
- Assert a notification with `Notification::assertSentTo()`, not by counting rows in a table.
- Swap a Contract with `$this->app->instance(MailProviderContract::class, $fake)`. This works because
  domain classes resolve with `app()`.
- An external integration ships a fake implementation of its Contract; tests bind it.

## Security-sensitive code earns adversarial tests

- SQL building: store an apostrophe (`O'Neil`), a backslash, an injection string and non-ASCII text;
  assert each comes back verbatim, with an untouched neighbour row proving the `WHERE` still scopes.
- Authorization: every role and the signed-out case, for every new route.
- Tenant scoping: a second tenant's rows exist and never appear, in lists and in every by-id method.
- Filters: `1e3`, `05`, `-3` and a 256-item list are refused.
- Rate limits and throttle keys: a blank or unknown part is rejected.
- Once-only operations: the second call is a no-op.

## Architecture tests

`arch()` checks what a file imports, not every call, so it is cheap and coarse. Keep one file:

```php
// tests/Arch/LayersTest.php
$root = dirname(__DIR__, 2);
$domains = array_values(array_diff(array_map('basename', glob("{$root}/src/Domain/*", GLOB_ONLYDIR)), ['Core']));
$panels = array_map('basename', glob("{$root}/src/Presentation/*", GLOB_ONLYDIR));

arch('no debug calls')->expect(['dd', 'dump', 'ray', 'var_dump'])->not->toBeUsed();

arch('the domain knows no presentation')->expect('Domain')->not->toUse(['Presentation', 'Inertia']);

arch('validation stays in Form Requests')->expect('Domain')->not->toUse('Illuminate\Support\Facades\Validator');

foreach ($domains as $domain) {
    arch("{$domain}: actions are final and static")
        ->expect("Domain\\{$domain}\\Actions")->classes()
        ->toBeFinal()->not->toHaveConstructor()->toHaveMethod('handle');

    arch("{$domain}: services hold no queries")
        ->expect("Domain\\{$domain}\\Services")->not->toUse('Illuminate\Support\Facades\DB');

    arch("{$domain}: DTOs end in Data")
        ->expect("Domain\\{$domain}\\DataTransferObjects")->classes()->toHaveSuffix('Data');

    arch("{$domain}: contracts are interfaces")
        ->expect("Domain\\{$domain}\\Contracts")->toBeInterfaces();

    $others = array_diff($domains, [$domain]);

    arch("{$domain}: other domains only through their Contracts")
        ->expect("Domain\\{$domain}")
        ->not->toUse(array_merge(...array_map(fn (string $other) => ["Domain\\{$other}\\Actions", "Domain\\{$other}\\Services"], $others)));
}

foreach ($panels as $panel) {
    arch("{$panel}: controllers stay thin")
        ->expect("Presentation\\{$panel}\\Controllers")
        ->not->toUse(['Illuminate\Support\Facades\DB', ...array_map(fn (string $domain) => "Domain\\{$domain}\\Actions", $domains)]);

    arch("{$panel}: requests are Form Requests")
        ->expect("Presentation\\{$panel}\\Requests")->classes()
        ->toExtend('Illuminate\Foundation\Http\FormRequest')->toHaveSuffix('Request');
}
```

- `glob()`, not a facade: the file runs before the application boots.
- When two domains were split on purpose, pin it with a named rule
  (`expect('Domain\Department')->not->toUse('Domain\Employee')`) and a one-line why above it. Why: the
  coupling grows back one convenient import at a time.
- Start a legacy codebase with the rules that already pass, and add the rest as each layer is cleaned;
  `->ignoring('Domain\Legacy\…')` names the known exceptions instead of dropping the rule.
- What `arch()` cannot see (a `Model::query()` call inside a Service, `$request->all()` passed to a DTO)
  needs a custom PHPStan rule, or a test that scans the source for the pattern and lists every hit.

## Don't

- Don't delete, skip or weaken a failing test to get green; find the cause.
- Don't write a one-off verification script when a test would prove the same thing.
- Don't let a test depend on another test's data or on run order.
- Don't call real AI, mail or messaging providers from tests, even once.

## Verify

```bash
# Tests asserting top-level payload keys on an enveloped API
grep -rnE "assertJsonPath\('(id|name|employee_number)'" tests/

# Validation asserted against Laravel's default errors key
grep -rn "assertJsonValidationErrors" tests/Feature/

# The test database is forced
grep -n "DB_DATABASE" phpunit.xml

# Destructive commands in test setup
grep -rn "migrate:fresh\|migrate:refresh\|db:wipe" tests/

# Skipped tests
grep -rnE -- "->skip\(|markTestSkipped|->todo\(" tests/
```
