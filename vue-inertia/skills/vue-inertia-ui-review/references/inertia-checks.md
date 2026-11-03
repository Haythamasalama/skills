# Inertia checks

**Read when:** a change touches links, routes, a form, a write, a dialog, a permission or an error page.
**Owns:** navigation staying inside Inertia, routing and error pages, forms and validation, flash
toasts, confirm dialogs, page titles, and permission checks in the browser.

## TL;DR

- After the first load, clicking a link never loads a new document. A full load means a plain
  `<a href>` where `<Link>` belongs.
- Deep links and refreshes are normal Laravel requests: check the right page component answers, and
  that a missing record gets the app's 404 page, not a stack trace.
- Submit every form empty, then valid. Errors sit under their fields; a valid write redirects and
  shows exactly one toast; a GET shows none.
- Destructive actions go through a confirm dialog that names the record.
- Sign in once as a user without a permission: the action is absent, and the URL is refused.

Snippets assume the `page` from SKILL.md, "Probing a page yourself".

## Navigation stays inside Inertia

An Inertia visit is an XHR with an `X-Inertia` header; only the first load is a `document` request.

```js
const documents = [];
page.on('request', (r) => r.resourceType() === 'document' && documents.push(r.url()));
await page.getByRole('link', { name: 'Invoices' }).click();
await page.waitForLoadState('networkidle');
console.log('full loads after the first:', documents.length);   // expect 0
```

Some links are full loads on purpose. Expect a `document` request for:

- downloads, exports and PDFs (Inertia must not intercept a file);
- a page that is not an Inertia page (a Blade page, an OAuth redirect);
- the language switch, because translations and direction change with it;
- the first page after signing in, when the app reloads so shared props (permissions, menu) are
  computed for the user and not for a guest.

## Routing and error pages

Laravel owns every URL, so a deep link or a refresh is a normal request: no client history fallback
is involved. What can go wrong is which page answers.

```js
const initialPage = () => page.evaluate(() => {
  const script = document.querySelector('script[data-page][type="application/json"]');
  return JSON.parse(script ? script.textContent : document.getElementById('app')?.dataset.page ?? '{}');
});

for (const path of ['/invoices/1/edit', '/invoices/999999', '/no-such-page']) {
  const response = await page.goto(`http://127.0.0.1:8000${path}`);
  console.log(path, response.status(), (await initialPage()).component);
}
```

- Inertia 3 puts the first page in a `<script data-page type="application/json">`; Inertia 1 and 2
  put it in `data-page` on `<div id="app">` (checked 2026-11-03). The helper reads both.
- `component` is the name passed to `Inertia::render`. A page that 404s with its route registered is
  usually a name that does not match the file under `resources/js/pages/`.
- With `APP_DEBUG=true` a 500 shows the debug page; test the error page itself with debug off once.
- A 419 (expired CSRF token) on a visit should land somewhere sensible, not a blank modal. Expire it
  by signing in, clearing the session cookie in the context, then submitting a form.

From the shell:

```bash
php artisan route:list --method=GET --except-vendor
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://127.0.0.1:8000/invoices   # 302 to login when signed out
```

## Forms and validation

Submit empty first, then valid.

```js
await page.goto('http://127.0.0.1:8000/invoices/create', { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /save|حفظ/i }).click();
await page.waitForLoadState('networkidle');
console.log(await page.evaluate(() => [...document.querySelectorAll('[aria-invalid="true"]')]
  .map((el) => el.id || el.getAttribute('name'))));
await page.screenshot({ path: '.ui-review/shots/invoice-create-errors.png', fullPage: true });
```

Read the screenshot for:

- **every server error under its own field.** A rule that fails with nothing on screen means the
  field has no error binding, or the error key differs from the field name (`items.0.price`).
- **an error on a hidden tab or a collapsed section** marks that tab, or the user sees nothing.
- **the browser's own bubble** ("Please fill out this field") instead of the app's message: the form
  is missing `novalidate`, so the app's validation never runs.
- **the submit button disabled while the request runs** (`form.processing`), so a double click
  does not write twice. Throttle the network to see it:

  ```js
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 1500, downloadThroughput: -1, uploadThroughput: -1 });
  ```

- **entered values kept** after a failed submit, including selects and dates.

Then submit valid: the page redirects to where the user expects, the new values show, and one toast
reports the outcome.

## Flash toasts

The usual shape: the controller flashes `success` or `error`, a shared prop carries it, one listener
turns it into a toast.

- One write, **one toast**. Two toasts mean both the page and the global listener fire one.
- A plain GET, a filter change or a pagination click shows **no** toast.
- A failed write (validation, 403, 500, offline) shows an error toast or the error page, never a
  success toast.
- The toast is translated, sits on the correct side in RTL, and is readable in dark.
- Going back after a write does not replay the old toast.

## Confirm dialogs

- Every destructive or irreversible action (delete, revoke, run, approve) opens an alert dialog,
  never fires from a bare link.
- The dialog names the record ("Delete invoice INV-0042?"), and the confirm button is styled as
  destructive.
- Escape and Cancel close it without writing. An alert dialog does not close on an outside click; a
  plain dialog may.
- Focus moves into the dialog on open and returns to the trigger on close.
- After confirming, the dialog closes, the list updates, and one toast appears.

```js
await page.getByRole('button', { name: /delete|حذف/i }).first().click();
const dialog = page.getByRole('alertdialog');
console.log(await dialog.textContent());
await page.keyboard.press('Escape');
console.log('closed:', !(await dialog.isVisible()));
```

## Page titles

`<Head :title>` is set on every page, including detail pages, and is translated.

```js
console.log(await page.title());
```

## Permissions

Permissions usually reach the browser as a shared prop (`auth.permissions`) read through a `can()`
helper. The browser hides; the server decides.

- Sign in once as a user without the permission. Seed one if the seeders have none, or remove a
  permission from the test user in tinker, locally.
- The action is **absent**, not disabled, unless the design says otherwise.
- The page's URL typed directly answers 403 (or the app's forbidden page), and the write endpoint
  refuses a crafted request. A hidden button is not protection.
- Menu entries for pages the user cannot open are gone too.

```js
const response = await page.goto('http://127.0.0.1:8000/invoices/1/edit');
console.log('direct visit without permission:', response.status());   // expect 403
```
