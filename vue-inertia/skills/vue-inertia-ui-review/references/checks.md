# Checks and snippets

Playwright snippets for the checks in SKILL.md. Adapt selectors to the app; the shapes carry over
to any browser tool that can run JavaScript in the page.

## Setup in a scratch script

```js
import { createRequire } from 'node:module';
const require = createRequire(process.cwd() + '/');   // resolve the project's node_modules
const { chromium } = require('playwright-core');      // CommonJS when installed --no-save

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'dark' });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
page.on('console', (m) => m.type() === 'error' && console.log('console:', m.text()));
await page.goto('http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/tmp/shots/home-dark.png', fullPage: true });
```

## Interactive parts

### A control that changes its own label

A text locator re-resolves after the label changes. Hold the element instead:

```js
await page.evaluate(async () => {
  const button = [...document.querySelectorAll('button')].find((b) => b.textContent.includes('tap to reveal'));
  const before = button.textContent;
  button.click();
  await new Promise((r) => setTimeout(r, 200));
  console.log(before, '->', button.textContent);
});
```

### Multiple choice

The chosen and the correct options grade; the rest dim; graded ones stay at full opacity even
though they are disabled.

```js
const options = page.locator('button[data-slot="button"]').filter({ hasText: /^[abc]/ });
await options.first().click();
for (let i = 0; i < (await options.count()); i++) {
  const o = options.nth(i);
  console.log(await o.textContent(), await o.isDisabled(), await o.evaluate((el) => getComputedStyle(el).opacity));
}
```

### A button gated on a condition

```js
const check = page.locator('button:has-text("Check order")');
console.log('disabled before:', await check.isDisabled());
const picks = page.locator('[data-test="order-option"]');
for (let i = 0; i < (await picks.count()); i++) await picks.nth(i).click();
console.log('disabled after:', await check.isDisabled());
await check.click();
```

### Checkboxes and toggles

```js
await page.locator('[data-slot="checkbox"]').first().click();
// confirm the label's state changed (for example a line-through)
```

### A step player or wizard

Walk it with "Next" until each step type has been seen, and screenshot each one. Check "Back"
restores state, and that the last step's action does what it says.

## Routing

Laravel owns every URL, so a deep link or a refresh is a normal request: no history fallback is
involved. What can still go wrong is which page answers and whether navigation stays inside Inertia.

```js
for (const path of [
  '/customers/1/edit',          // deep link: 200 and the right component
  '/customers/999999',          // missing record: the app's 404 page, not a stack trace
  '/nope',                      // unknown path: 404 page
]) {
  const response = await page.goto(`http://127.0.0.1:8000${path}`);
  const component = await page.evaluate(() => JSON.parse(document.getElementById('app')?.dataset.page ?? '{}').component);
  console.log(path, response.status(), component);
}
```

`component` is the name passed to `Inertia::render`. With SSR or a newer Inertia the initial page may
live in a `<script type="application/json">` instead of `data-page`; read it from there.

A full page load where an Inertia visit was expected (a hand-written `<a href>`) shows up as a new
`document` request:

```js
const documents = [];
page.on('request', r => r.resourceType() === 'document' && documents.push(r.url()));
await page.getByRole('link', { name: 'Customers' }).click();
await page.waitForLoadState('networkidle');
console.log('full loads after the first:', documents.length);   // expect 0
```

From the shell, the server side of the same checks:

```bash
php artisan route:list --method=GET --except-vendor     # every page worth shooting
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://127.0.0.1:8000/customers
```

## Writes, validation and toasts

- Submit each form empty once: every error renders under its own field (client and server), and the
  submit does not look dead. An error on a hidden tab lights that tab.
- Submit it valid: the page redirects and one toast reports the outcome. No toast on a plain GET.
- Open each confirm dialog: it names the record, the confirm button is destructive, Escape closes it.

## Language and direction

- Switch the language the way a user does (the menu, the URL) and shoot the same screen.
- `<html lang>` and `dir` must change on every client-side navigation, not only on first load.
- Things that break first in RTL: poppers on the wrong side, drawers on the wrong edge, chevrons
  that don't flip, anything with a physical `left`/`right` class, and transforms (a switch thumb
  that travels out of its track).
- A chart's x axis running left to right inside an Arabic page is normal.

```js
console.log(await page.evaluate(() => ({
  lang: document.documentElement.lang,
  dir: document.documentElement.dir,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
})));
```

## Print and PDF

### Overlays must not print

Dropdowns and dialogs rendered through a portal on `<body>` escape any `.no-print` parent:

```js
await page.locator('[data-slot="select-trigger"]').click();
await page.emulateMedia({ media: 'print' });
console.log(await page.evaluate(() => {
  const el = document.querySelector('[data-reka-popper-content-wrapper], [role="listbox"], [role="dialog"]');
  return el ? getComputedStyle(el).display : 'none (not found)';
}));
// must be "none"
```

### Render the PDF

```js
await page.goto('http://127.0.0.1:8000/printable/page', { waitUntil: 'networkidle' });
await page.pdf({
  path: '/tmp/shots/page.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
});
await page.emulateMedia({ media: 'print' });
await page.screenshot({ path: '/tmp/shots/print.png', fullPage: true });
```

Read the print screenshot:

- no header, footer, nav or buttons (everything interactive carries the no-print class);
- the print-only content is complete: a flat version of every step with answers shown, not the
  interactive player. A missing step means a print-only block was forgotten;
- the light palette, even if the site was in dark mode;
- cards not split across pages (`break-inside: avoid`);
- animations off in `@media print`.

## Expected noise

In a sandbox, third-party font or analytics hosts are often blocked. Their failed requests and
`ERR_CONNECTION_RESET` console errors are environment noise: name them once in the report and
ignore only those (`shoot.mjs --ignore 'fonts\.googleapis|fonts\.gstatic'`). Fallback fonts in
the screenshots come from the same cause. Every other error is real.
