# Print and PDF

**Read when:** the app has a print view, a "Print" button, or exports a PDF rendered from a page.
**Owns:** checking print styles in the browser, rendering the PDF, and what to read in the output.

## TL;DR

- `shoot.mjs --print` adds a print-media screenshot and an A4 PDF per path (first viewport only).
- Nothing interactive survives: no nav, sidebar, buttons, toasts or open overlays.
- Print always uses the light palette, even when the page was in dark mode.
- Cards, table rows and figures are not split across pages.
- In RTL, the printed page is RTL too, with the same mixed-direction care as the screen.

Snippets assume the `page` from SKILL.md, "Probing a page yourself".

## Render it

```js
await page.goto('http://127.0.0.1:8000/invoices/1', { waitUntil: 'networkidle' });
await page.emulateMedia({ media: 'print' });
await page.screenshot({ path: '.ui-review/shots/invoice-print.png', fullPage: true });
await page.pdf({
  path: '.ui-review/shots/invoice.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '16mm', bottom: '16mm', left: '14mm', right: '14mm' },
});
```

`page.pdf()` works in headless Chromium only. Open the PDF and read every page, not only the first.

## Overlays must not print

Dropdowns, dialogs and toasts render through a portal at the end of `<body>`, so they escape any
"no print" class on the page wrapper. Open one, switch to print, and check it is hidden:

```js
await page.getByRole('combobox').first().click();
await page.emulateMedia({ media: 'print' });
console.log(await page.evaluate(() => {
  const el = document.querySelector('[data-reka-popper-content-wrapper], [role="listbox"], [role="dialog"], [data-sonner-toaster]');
  return el ? getComputedStyle(el).display : 'none (not found)';
}));
// must be "none"
```

## What to read in the output

- **No chrome:** header, footer, sidebar, breadcrumbs, buttons, filters and pagination are gone.
- **Complete content:** the print view shows everything the reader needs, flattened. A collapsed
  section, an inactive tab or a scroll area prints only what was visible unless a print-only block
  carries the rest. Compare against the data, not against the screen.
- **Light palette** from a dark page: emulate dark first, then print, and check the background is
  white and the text dark.
- **Page breaks:** `break-inside: avoid` on cards and table rows, table headers repeated on each
  page (`thead { display: table-header-group }`), no orphan heading at the bottom of a page.
- **Widths:** a wide table fits the page or is scaled on purpose; nothing cut off at the right (or
  left, in RTL) edge.
- **Motion off:** animations and transitions are disabled in `@media print`, or a half-faded element
  prints half-faded.
- **Fonts:** the PDF embeds the app's font, including Arabic glyphs. A fallback font in the PDF is
  either a blocked font host (noise) or a font that never loaded for print (real).
- **Links and values:** URLs, IDs and amounts read in the right order in RTL (`dir="ltr"` wrappers
  print as they display).

## Server-rendered PDFs

When the PDF is made on the server (a PDF library or a headless browser called from Laravel), the
page's print CSS does not apply: download the file through its route and read it the same way. Check
it in both languages, since a server-side renderer needs its own Arabic font and shaping.

```js
import { writeFileSync } from 'node:fs';

const response = await context.request.get('http://127.0.0.1:8000/invoices/1/pdf');   // shares the signed-in cookies
console.log(response.status(), response.headers()['content-type']);
writeFileSync('.ui-review/shots/invoice-server.pdf', await response.body());
```
