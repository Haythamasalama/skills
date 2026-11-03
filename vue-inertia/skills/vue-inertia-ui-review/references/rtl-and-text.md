# RTL and text

**Read when:** reviewing the Arabic (or any right-to-left) pass, or any page that mixes Latin values
into Arabic text.
**Owns:** direction on `<html>` across Inertia visits, what breaks first in RTL, mixed-direction
values, leftover English, raw translation keys.

## TL;DR

- `<html lang dir>` must change on every Inertia visit, not only on the first load.
- Anything with a physical side (`left`, `right`, `ml-`, `pr-`, a transform) is suspect in RTL.
- A Latin value shown inside Arabic (URL, email, code, key) needs `dir="ltr"` on its wrapper; a
  plain input does not.
- Leftover English hides in attributes a screenshot never shows: scan them.
- A raw key (`invoices.fields.number`) on screen means a missing translation in one language.

Snippets assume the `page` from SKILL.md, "Probing a page yourself".

## Direction across visits

Inertia swaps the page under one `<html>`, so a `lang` and `dir` written by Blade on the first load
outlive every later visit unless the app updates them on each one. Check by navigating, not by loading:

```js
const html = () => page.evaluate(() => ({
  lang: document.documentElement.lang,
  dir: document.documentElement.dir,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
console.log('first load', await html());
await page.getByRole('link').nth(3).click();
await page.waitForLoadState('networkidle');
console.log('after a visit', await html());
```

Also open a page in one language, follow a link into a part of the app with another language (a
public site in Arabic linking into an English-only panel): the second part must not inherit `rtl`.

Components that place poppers (dropdowns, tooltips, selects) read direction from a provider at the
root of the layout (Reka UI's `ConfigProvider :dir`), not from `<html>`. A popper on the wrong side
or off-screen in RTL, while the page itself is right, means that provider is missing or not updated.

## What breaks first in RTL

Read the Arabic screenshots for:

- **Spacing and position on the wrong side**: a `left-`/`right-`/`ml-`/`mr-`/`pl-`/`pr-`/
  `text-left` class that should be `start`/`end` (`ms-`, `pe-`, `text-start`).

  ```bash
  grep -rnE "\b(ml|mr|pl|pr|left|right)-[0-9a-z]|text-(left|right)\b" resources/js --include='*.vue' | grep -v components/ui
  ```

- **Arrows and chevrons pointing the wrong way.** A chevron meaning "forward" or "next" needs
  `rtl:rotate-180`; an asymmetric glyph (an arrow into a door) needs `rtl:-scale-x-100`. A typed `→`
  cannot flip at all: it must be an icon.
- **Drawers and sheets on the wrong edge**, or sliding in from the wrong side. Open the mobile menu
  at phone width in both languages.
- **Transforms**: a switch thumb that travels out of its track, a progress bar that fills from the
  wrong end, a carousel that moves the wrong way.
- **Dialog and alert headers** aligned with `text-left` against the wrong edge.
- **Shadows and offsets** that point the same way in both languages when they should mirror.
- **Charts**: an x axis running left to right inside an Arabic page is normal; a legend or tooltip
  overlapping the plot is not.
- **Overflow at phone width** in Arabic only: Arabic labels are often longer or wrap differently.

## Mixed-direction values

A Latin value inside Arabic text is reordered by the bidi algorithm around its dots, slashes and
digits: `example.com/a` can print as `a/example.com`. Look for scrambled URLs, emails, phone
numbers, IDs, codes, file names and amounts with a currency code.

- **Displayed** values get a wrapper with `dir="ltr"` (and often a monospace font for codes).
- **Inputs** do not: `dir="ltr"` on a plain input moves the caret and the placeholder to the far
  side. An input that holds Latin takes `dir="auto"` once it has a value. `dir="auto"` on an empty
  box falls back to LTR and puts an Arabic placeholder on the wrong edge.
- An input group whose affix order matters (a domain suffix, a country code) is LTR as a whole.
  An icon alone is not an affix: that group stays in the page direction.
- Phone numbers and amounts typed by the user should keep their digits in order in both languages.

## Leftover English

A screenshot shows text nodes only. `placeholder`, `aria-label`, `title` and `alt` hold text too,
and an untranslated one is still English to the person who hears or hovers it. In the Arabic pass:

```js
console.log(await page.evaluate(() => [...document.querySelectorAll('[placeholder],[aria-label],[title],[alt]')]
  .flatMap((el) => ['placeholder', 'aria-label', 'title', 'alt'].map((a) => el.getAttribute(a)))
  .filter((v) => v && /[A-Za-z]{3,}/.test(v) && !/[؀-ۿ]/.test(v))));
```

And for visible text nodes, ignoring values that are Latin on purpose (emails, codes, brand names):

```js
console.log(await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const found = [];
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim();
    if (/^[A-Za-z][A-Za-z ,.'!?-]{5,}$/.test(text) && !walker.currentNode.parentElement.closest('[dir="ltr"], code, script, style')) {
      found.push(text);
    }
  }
  return [...new Set(found)];
}));
```

Common sources: a string hard-coded in a component, a key added to one language file only, a
registry component's built-in English (a close button's label, "Previous"/"Next" in pagination),
validation messages from a missing `lang/ar/validation.php`, and dates formatted without a locale.

## Raw translation keys

A key on screen (`invoices.fields.number`, `messages.saved`) means the lookup failed: the key is
missing in that language, the file is not shipped to the browser, or the key is built from a
variable that has no entry.

```js
console.log(await page.evaluate(() => document.body.innerText.match(/\b[a-z_]+(\.[a-z_0-9]+){1,}\b/g)));
```

Expect some false hits (a domain, a file name); read each one. Then compare the language files:

```bash
diff <(php -r 'require "vendor/autoload.php"; echo implode("\n", array_keys(Illuminate\Support\Arr::dot(require "lang/en/invoices.php")));' | sort) \
     <(php -r 'require "vendor/autoload.php"; echo implode("\n", array_keys(Illuminate\Support\Arr::dot(require "lang/ar/invoices.php")));' | sort)
```

## Numbers, dates and plurals

- Dates and numbers use the page's locale formatter (`Intl.DateTimeFormat(locale)`), and the choice
  of Arabic or Latin digits is the same on every page.
- A count is safest as a label and a number (`Rows: 12`); a sentence built for English plurals reads
  wrong in Arabic, which has more plural forms.
- Relative times ("2 days ago") come from the same locale, not a hard-coded English library default.
