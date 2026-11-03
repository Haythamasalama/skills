# Testing this layout

**Read when:** writing or fixing a Pest test for a domain, an endpoint or a page in this layout.
**Owns:** the test database, where tests live, what to test at which layer, envelope assertions,
factories for domain models, fakes, enforcing the layout with arch tests.
**See also:** generic Pest syntax: the Pest skill · [controllers-requests-api.md](controllers-requests-api.md) ·
[core-kernel.md](core-kernel.md)

## TL;DR

- Tests run on their **own** database, forced in `phpunit.xml`. Never point a run at a working database.
- Test the **Action** for logic, the **Contract** for cross-domain behaviour, the **route** for HTTP.
  Do not test a Service's one-line delegation separately.
- Mirror the domain in the path: `tests/Feature/{Domain}/`, `tests/Unit/{Domain}/`.
- JSON assertions go through the envelope: `data.*` and `status.*`, never top-level keys.
- Factories and their states for every model; domain models need `newFactory()` or a factory resolver.
- No test reaches a real external service. Fake HTTP, mail, notifications, queues and vendors.
- Cover a failure path, not only the happy one. Never skip or delete a failing test to get green.

## The test database

```xml
<!-- phpunit.xml -->
<env name="DB_DATABASE" value="myapp_test" force="true"/>
<env name="QUEUE_CONNECTION" value="sync"/>
<env name="MAIL_MAILER" value="array"/>
```

- `force="true"` so a local `.env` cannot win. Why: `RefreshDatabase` against the working database wipes it.
- Prepare it with `php artisan migrate --env=testing` (or let `RefreshDatabase` migrate), never
  `migrate:fresh` on a shared database by hand.
- If the schema uses engine-specific features (JSON functions, triggers, generated columns, full-text),
  run the suite on that engine, not SQLite. A test of an engine-only guarantee asserts the driver first
  instead of passing silently elsewhere.
- One test database shared by several checkouts or agents means one suite at a time.
- Run the narrowest set while working: `php artisan test --compact --filter=IssueInvoiceTest`.

## Where tests live

```
tests/Feature/Billing/IssueInvoiceTest.php          an Action or a Contract, with the database
tests/Feature/Billing/Api/InvoiceEndpointsTest.php  routes of one panel
tests/Unit/Billing/InvoiceStatusTest.php            an enum, a value object, a pure helper
tests/Unit/Core/WhereLikeTextTest.php               kernel helpers
tests/Arch/LayersTest.php                           arch() rules for the layout
```

Most tests are feature tests. A unit test fits a pure function, an enum, a key builder or a trait with no
database.

## What to test where

| Subject | Test | Why |
|---|---|---|
| A write, a calculation, a branch | the Action directly | it holds the logic; cheapest place to cover branches |
| Behaviour another domain relies on | `app(InvoiceContract::class)` | that is the real boundary |
| A Service | usually not directly | it only delegates; you would test the Action twice |
| An endpoint | a feature test on the route | covers routing, the Form Request, authorization, envelope |
| A status transition | the transition Action | assert the refusal reason, not only the boolean |
| An ability | the ability method | a plain bool, cheap to cover every state |
| A filter scope | the `Get{Entity}s` Action with a DTO | assert rows in and rows out, including the scoping key |

```php
it('issues a draft invoice', function () {
    $invoice = Invoice::factory()->draft()->create();

    $issued = IssueInvoice::handle($invoice);

    expect($issued->status)->toBe(InvoiceStatus::ISSUED)
        ->and($issued->number)->not->toBeNull();
});

it('refuses to issue a paid invoice', function () {
    $invoice = Invoice::factory()->paid()->create();

    expect(fn () => IssueInvoice::handle($invoice))->toThrow(InvoiceException::class);
});
```

## Endpoints and the envelope

```php
it('creates an invoice', function () {
    $customer = Customer::factory()->create();

    actingAs(User::factory()->withPermission('invoices.create')->create())
        ->postJson('/api/v1/invoices', ['customer_id' => $customer->id, 'currency' => 'USD', 'lines' => []])
        ->assertCreated()
        ->assertJsonPath('status.success', true)
        ->assertJsonPath('status.error_key', 'ok')
        ->assertJsonPath('data.customer.id', $customer->id);
});

it('rejects a missing customer', function () {
    actingAs(User::factory()->withPermission('invoices.create')->create())
        ->postJson('/api/v1/invoices', [])
        ->assertUnprocessable()
        ->assertJsonPath('status.error_key', 'validation_failed')
        ->assertJsonValidationErrors(['customer_id']);
});
```

- Assert `status.code` and `status.error_key`, not `status.message`, which changes with locale (pin the
  locale if you must assert text).
- `assertJsonPath('id', …)` or `assertJsonStructure(['id'])` at the top level is always wrong for an
  enveloped API.
- For each guarded route, test the forbidden case too (403 for a member without the permission; 404 for a
  stranger in multi-tenant apps).

For Inertia pages, assert the component and props:

```php
get(route('admin.invoices.index'))->assertInertia(fn (Assert $page) => $page
    ->component('Invoices/Index')
    ->has('invoices.data', 3));
```

## Factories

```php
// ✅ factory with states
$invoice = Invoice::factory()->issued()->for($customer)->create();

// ❌ hand-built rows
$invoice = new Invoice(['status' => 2, 'customer_id' => $customer->id]);
$invoice->save();
```

- Check for an existing state before adding one.
- Domain entities live outside `App\Models`, so either each model defines
  `protected static function newFactory()` or a provider maps names once with
  `Factory::guessFactoryNamesUsing()`.
- Explore behaviour by writing a test, not by creating rows in tinker.

## Fakes

- `Http::preventStrayRequests()` in the base test case, so an unfaked call fails the test.
- `Http::fake()`, `Mail::fake()`, `Notification::fake()`, `Event::fake()`, `Storage::fake()`.
- `Bus::fake()` / `Queue::fake()` to assert dispatch; with `QUEUE_CONNECTION=sync` jobs otherwise run inline.
- Assert a notification with `Notification::assertSentTo()`, not by counting rows in a table.
- Swap a Contract for a test double with `$this->app->instance(SomeContract::class, $fake)`; this is one
  reason domain classes resolve with `app()`.
- External integrations ship a fake implementation of their Contract; tests bind it.

## Security-sensitive code earns adversarial tests

- Code that builds SQL: store an apostrophe (`O'Neil`), a backslash, an injection string
  (`x'; DROP TABLE invoices; --`) and non-ASCII text, and assert each comes back verbatim, with an
  untouched neighbour row proving the `WHERE` still scopes.
- Authorization: every role and the anonymous case, for every new route.
- Tenant scoping: a second tenant's rows exist and never appear.
- Rate limits and throttle keys: blank and unknown parts are rejected.
- Once-only operations: the second call is a no-op.

## Arch tests for the layout

See [core-kernel.md](core-kernel.md) for `arch()` rules that keep Actions final, Services free of `DB`,
DTOs suffixed `Data` and validation out of the domain. Add an arch rule when a review catches the same
layout mistake twice.

## Don't

- Don't delete, skip or weaken a failing test to get green; find the cause.
- Don't write a one-off verification script when a test would prove the same thing.
- Don't let a test depend on another test's data or on run order.
- Don't call real AI, payment or messaging providers from tests, even "just once".

## Verify

```bash
# Tests asserting top-level payload keys on an enveloped API
grep -rnE "assertJsonPath\('(id|name|number)'" tests/

# The test database is forced
grep -n "DB_DATABASE" phpunit.xml

# Destructive commands in test setup
grep -rn "migrate:fresh\|migrate:refresh\|db:wipe" tests/

# Skipped tests
grep -rnE "->skip\(|markTestSkipped|->todo\(" tests/
```
