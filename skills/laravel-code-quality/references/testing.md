# Testing

**Read when:** writing or fixing a test, or deciding what a change needs covered before it is done.
**Owns:** the test database, what to test at which layer, asserting the real response shape, fakes and
external providers, failure paths, what never to do to a failing test.

## TL;DR

- Every change is covered by a test that runs; run the affected ones with `php artisan test --compact --filter=…`.
- Tests run against a **dedicated test database**, forced in `phpunit.xml`. Never against a working one.
- Test the same database engine as production when the schema uses engine-specific features.
- Test single-operation classes directly for logic; feature-test endpoints for routing, validation,
  authorization and the response shape.
- Cover the **failure** paths and assert *why* something was refused, not only that it was.
- A test never reaches a real external provider.
- Never delete, skip or weaken a failing test to get green. Find the cause.

## The test database

- Force the test database in `phpunit.xml` (`<env name="DB_DATABASE" value="app_test" force="true"/>`).
  Why: `RefreshDatabase` on a working database wipes it.
- Prepare it with `php artisan migrate`. Never `migrate:fresh` or `migrate:refresh` against a shared
  database.
- If the schema uses MySQL or PostgreSQL features (JSON operators, generated columns, full-text indexes),
  run tests on that engine. A SQLite run then fails or hangs in ways that look like test bugs.
- Seed what each test needs inside the test: factories when the project has them, otherwise
  `Model::create([...])` when casts and events matter, `DB::table(...)->insertGetId([...])` for plain rows.

## What to test at which layer

| Subject | Test | Why |
|---|---|---|
| Logic, a write, a calculation | the single-operation class directly | cheapest place to cover every branch |
| Behaviour another module depends on | the interface that module calls (`app(InvoiceContract::class)`) | that is the real boundary |
| A service that only delegates | usually not directly | it would re-test the operation class |
| An endpoint | a feature test hitting the route | covers routing, Form Request, authorization, response shape |
| A state transition | the transition guard | assert the refusal reason, not just a bool |
| A permission or policy | the policy or ability method | plain bool, cheap, worth covering |
| A pure function, an enum, a key builder | a unit test with no database | fast, no setup |

Most tests should be feature tests. Mirror the code in the path (`tests/Feature/Billing/`,
`tests/Unit/Billing/`).

## Assert the real response shape

If the API wraps every payload (`{ "status": {…}, "data": {…} }`), assert inside the wrapper. Framework
examples assert top-level keys and are wrong for such an API.

```php
// ✅
$response->assertCreated()
    ->assertJsonPath('data.id', $invoice->id)
    ->assertJsonCount(3, 'data.lines');

// ❌ a shape this API never returns
$response->assertJsonPath('id', $invoice->id);
```

Validation failures follow the same wrapper; assert its error key, not Laravel's default `errors` bag,
unless the API returns that bag.

## A page or endpoint covers at least

- it renders or returns what the caller reads;
- on a list, a filter narrows the rows and an invalid filter value is refused with 422;
- each save works and redirects or responds as specified;
- a user whose role lacks the permission is refused, and a stranger to the tenant gets the status in
  [security.md](security.md#multi-tenant-apps);
- the security and sensitive-operation cases that apply, listed in
  [sensitive-operations.md](sensitive-operations.md#test-these-hardest) and under SQL in
  [security.md](security.md#sql).

## Fakes and external providers

- A test never reaches a real provider (payments, SMS, maps). Use `Http::fake()` with
  `Http::preventStrayRequests()`, or the integration's own fake.
- With `QUEUE_CONNECTION=sync` in `phpunit.xml`, dispatched jobs run inline. Use `Bus::fake()` /
  `Queue::fake()` when you want to assert dispatch instead.
- Prove a notification with `Notification::fake()` and `assertSentTo()`, not by reading notification
  table rows.

## Don't

- Don't delete, skip, or loosen an assertion on a failing test without the owner's approval. A skipped
  test is a silent regression.
- Don't write a verification script or a tinker session when a test would prove the same thing.
- Don't assert only the happy path of anything in [security.md](security.md) or
  [sensitive-operations.md](sensitive-operations.md).

## Verify

```bash
# Any test run pointed at a non-test database
grep -rn "DB_DATABASE" phpunit.xml tests/ | grep -v "_test"

# Destructive migration commands in test setup
grep -rn "migrate:fresh\|migrate:refresh" tests/

# Skipped or incomplete tests (each needs a reason and an owner)
grep -rnE "->skip\(|markTestSkipped|markTestIncomplete|->todo\(" tests/
```
