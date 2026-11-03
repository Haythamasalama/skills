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
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
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

```js
for (const path of [
  '/deep/nested/route',        // deep link: 200 and the right view
  '/old-url', '/old/thing/1',  // retired: 301 to the new place
  '/nope',                     // 404 view
]) {
  await page.goto(`http://127.0.0.1:4173${path}`);
  console.log(path, '->', await page.evaluate(() => location.pathname + location.hash));
}
```

From the shell, for the server side of the same checks:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" http://127.0.0.1:8080/old-url
curl -sI http://127.0.0.1:8080/index.html | grep -i cache-control
```

A local static server and the real host can disagree: GitHub Pages serves `404.html` for unknown
paths and redirects `/about` to `/about/`, and redirects for retired URLs often live only in the
host's config. Check the deployed site once after the first deploy.

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
await page.goto('http://127.0.0.1:4173/printable/page', { waitUntil: 'networkidle' });
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
