# Arabic, English and right to left

How to run one Nuxt UI app in Arabic (right to left) and English (left to right) without writing the layout twice.
Checked 2026-10-27.

The sections from "Layout once, both directions" to "Fonts for Arabic" hold for any stack. They are the
one home of the generic bidi rules; `admin-ui` and `arabic-copy` link here for them.

## Two settings, both needed

1. **Component strings and direction-aware behaviour** (dates in pickers, "close", menus opening the right way):

   ```vue
   <script setup lang="ts">
   import { ar, en } from '@nuxt/ui/locale'
   </script>

   <template>
     <UApp :locale="lang === 'ar' ? ar : en">
       <NuxtPage />
     </UApp>
   </template>
   ```

2. **The page itself** (CSS logical properties, text alignment, scrollbars):

   ```ts
   useHead({ htmlAttrs: { lang, dir: () => (isRtl.value ? 'rtl' : 'ltr') } })
   ```

   Also put the default language in `nuxt.config.ts` `app.head.htmlAttrs` (`{ lang: 'ar', dir: 'rtl' }`) so the
   first paint is right before the app boots.

## Choosing the language

**A dashboard:** a `ref` in a util, saved in `localStorage`, with a default from the app's settings.

```ts
// app/utils/locale.ts
const KEY = 'my-app:locale'

function stored(): Locale | null {
  try {
    const value = localStorage.getItem(KEY)
    return value === 'ar' || value === 'en' ? value : null
  }
  catch {
    return null
  }
}

export const locale = ref<Locale>(stored() ?? 'ar')
export const isRtl = computed(() => locale.value === 'ar')

export function setLocale(next: Locale): void {
  locale.value = next
  try { localStorage.setItem(KEY, next) }
  catch { /* storage blocked: the default comes back next visit */ }
}
```

This reads `localStorage` at module load, so it suits `ssr: false`. With SSR, read it in `onMounted` or use a cookie.

**A public site:** one URL per language, so search engines index both.

```ts
// app/composables/useLang.ts
export function useLang() {
  const route = useRoute()
  const lang = computed<Lang>(() => (route.path.startsWith('/ar') ? 'ar' : 'en'))

  return {
    lang,
    text: computed(() => content[lang.value]),
    isRtl: computed(() => lang.value === 'ar'),
    otherPath: computed(() => (lang.value === 'ar' ? '/' : '/ar/')),
  }
}
```

`pages/index.vue` and `pages/ar/index.vue` both render the same `<LandingPage />`. The switch is a link
(`:to="otherPath" :hreflang`), not a state toggle.

## Dictionaries

For a dashboard, two typed files and a small helper are enough; no i18n module.

```ts
// shared/locales/en.ts
export default {
  accounts: { add: 'Add account', count: ({ n }: Params) => (Number(n) === 1 ? 'One account' : `${n} accounts`) },
  common: { save: 'Save', cancel: 'Cancel' },
}

// shared/locales/ar.ts
import type en from './en'
export default {
  accounts: { add: 'إضافة حساب', count: ({ n }: Params) => (Number(n) === 1 ? 'حساب واحد' : Number(n) === 2 ? 'حسابان' : `${n} حسابات`) },
  common: { save: 'حفظ', cancel: 'إلغاء' },
} satisfies typeof en
```

- `satisfies typeof en` makes `typecheck` fail when Arabic misses a key. Do the same the other way if English can
  lag.
- Values: `{name}` in the string, `t('key', { name })`.
- Wording that depends on a count is a function. Arabic has more plural forms than English (zero, one, two, few for
  3–10, many for 11–99, other); `new Intl.PluralRules('ar').select(n)` returns the category.
- Keys built from outside data use a fallback: `` tOr(`status.${code}`, code) ``.
- Keep the dictionaries in `shared/` when the server also answers in the user's language. Pass the language in a
  header (for example `X-Locale`) and hold it for the request with `AsyncLocalStorage`.
- In `shared/` code import the dictionaries as types only, and hand the data in from an app plugin and a server
  util ([why](gotchas.md#nitro-auto-imports-and-shared-code)).
- A public site with several pages and translated routes is a better fit for `@nuxtjs/i18n`.

## Layout once, both directions

| Instead of | Write |
|---|---|
| `ml-2` / `mr-2` | `ms-2` / `me-2` |
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-lg` / `rounded-r-lg` | `rounded-s-lg` / `rounded-e-lg` |
| `space-x-2` on a flex row | `gap-2` |

- Flex and grid order follow `dir` on their own. Don't reverse them.
- `rtl:` and `ltr:` variants handle the rare exception (`rtl:-scale-x-100`).
- Centring with `left-1/2 -translate-x-1/2` is symmetric and fine.
- `lg:ps-0` (not `lg:pl-0`) when a sidebar sits at the start.

## Mixed-direction text

Any run in a language other than its surroundings must be isolated, or neutral characters (slashes, digits,
brackets, trailing punctuation) jump ends and the line renders reversed. This is a correctness bug, not a style
preference.

- **Left-to-right values inside an Arabic line** (phone numbers, IDs, codes, file paths, versions, emails, URLs,
  hosts, database names, permission keys): `<bdi dir="ltr">{{ value }}</bdi>`, or `dir="ltr"` on the inline
  element that shows it. Without it, `+1 555 0100` or `v1.2.3` reorder.
- **A block in the other language** (an example sentence, a quote): `lang` and `dir` on the element plus a small
  utility with `unicode-bidi: isolate`, and the font picked from `:lang()`:

  ```html
  <p class="bidi" lang="ar" dir="rtl">وين ساكنة؟</p>
  <p class="bidi" lang="en" dir="ltr">wēn sākne?</p>
  ```

- **Inside a translated string**, wrap the value in Unicode isolates U+2066 … U+2069 (LRI … PDI):
  `` `⁦${path}⁩` ``. Add them where the rendered page shows a flip, not in advance: they are invisible in the
  source and easy to duplicate.
- **Text a user typed or a message that can be in either language:** `dir="auto"` on the element (textarea,
  preview bubble, list excerpt).
- Code and commands: `<pre dir="ltr" class="text-start">`.

### Inputs

- **Inputs follow the page direction.** Right aligned in Arabic, left aligned in English. Typing Latin text into
  an RTL input works.
- **`dir="ltr"` is for display, never for a plain input.** It drags the caret to the far side from where the
  reader starts, an Arabic placeholder lands on the wrong edge of its own box, and a form with some inputs forced
  left to right looks broken.
- An input that holds Latin (a code, a host, a URL, a JSON body) may take `dir="auto"` once it has a value.
  `dir="auto"` alone is not enough: an empty box has no value to read, browsers fall back to LTR, and the
  placeholder lands on the wrong edge. Return `undefined` while the box is empty, so the page decides:

  ```ts
  export const autoDir = (value: unknown): 'auto' | undefined =>
    value === null || value === undefined || value === '' ? undefined : 'auto'
  ```

- **An affix with meaning makes the whole group LTR**, affix included: a subdomain with a `.example.test` suffix,
  a `db_` prefix, the dial code before a phone number.
- **A leading icon is not an affix.** It carries no order, so the group stays in the page direction: the icon sits
  at the start, the label above agrees, and a Latin value still renders left to right on its own. Email,
  password, price, a bare host: all plain.

## Icons that point somewhere

Logical classes cover position and spacing. What they can't cover (a glyph that points, a transform, a shadow
offset) takes the `rtl:` and `ltr:` variants, which read `dir` on `<html>`. Prefer them to writing a rule twice,
and never branch on the page direction in script for something CSS can state.

- **Flip:** chevrons, arrows, back/forward, undo/redo, indent, reply, send, external link.
- **Never flip:** clocks, phones, checkmarks, play buttons, logos, anything containing a digit or a letter.
- **Rotate** (`rtl:rotate-180`) a glyph that is symmetrical about its centre (chevrons, plain arrows). **Mirror**
  (`rtl:-scale-x-100`) one that is not (an arrow entering a door).
- Use the left chevron for "previous" and the right one for "next", and let the class flip both. Don't swap icons
  by direction.
- **A directional character typed into copy (`→`, `←`) can do neither.** It is an icon, never a literal. An up
  arrow «↑» is direction-neutral.

With `@nuxt/icon` in CSS mode (`<span class="iconify i-lucide:send">`), keep the flips in one list in `main.css`:

```css
[dir="rtl"] .iconify.i-lucide\:send,
[dir="rtl"] .iconify.i-lucide\:external-link,
[dir="rtl"] .iconify.i-lucide\:chevron-left,
[dir="rtl"] .iconify.i-lucide\:chevron-right,
[dir="rtl"] .iconify.i-lucide\:arrow-left,
[dir="rtl"] .iconify.i-lucide\:arrow-right {
  transform: scaleX(-1);
}
```

In SVG mode, or for one-off cases, put `class="rtl:-scale-x-100"` on the `UIcon`.

## Charts

Chart libraries draw axes left to right. A time series reading left to right inside an Arabic page is the normal
convention; leave it, and put `dir="ltr"` on a numeric axis container that would otherwise inherit RTL.

## Numbers, dates and money

- Decide the digits once. Latin digits in both languages: format numbers with `en-US` and dates with
  `ar-u-ca-gregory-nu-latn` (Gregorian calendar, Latin digits) for Arabic.

  ```ts
  export const intlLocale = () => (locale.value === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-US')
  export const count = (n: number) => new Intl.NumberFormat('en-US').format(n)
  export const shortDay = (date: string) => new Intl.DateTimeFormat(intlLocale(), { day: 'numeric', month: 'short' }).format(new Date(date))
  ```

- Server-rendered dates: pass a fixed `timeZone` (for example `'UTC'`) so the server and the browser print the same
  text and hydration does not complain.
- Columns of numbers: `tabular-nums`.
- Money: `Intl.NumberFormat(locale, { style: 'currency', currency })`. A compact form (`notation: 'compact'`)
  for chart axes.

## Fonts for Arabic

- Either one family that covers both scripts, which keeps mixed lines even (IBM Plex Sans Arabic, Noto Sans
  Arabic, Readex Pro and Tajawal all include Latin letters), or an Arabic face beside the Latin one, its
  `@font-face` scoped with `unicode-range` so Latin text keeps its own face.
- `@nuxt/fonts` needs `subsets: ['arabic', 'latin']`, or every Arabic letter falls back to the system font.
- Arabic reads larger at the same size. Keep line height at about 1.6 or more for paragraphs.
- `letter-spacing: normal` under `[lang='ar']`, set on the element, not only on `html`: letter spacing breaks
  joined letters, so no `tracking-*` on Arabic text.
- Never `uppercase` or small caps on Arabic; it has no case. An uppercase or `font-mono` label that gets
  translated drops the `text-transform` and takes the Arabic face; keep `font-mono` for Latin-only values.

## Writing the copy

Arabic register, wording, punctuation and the terms that stay in Latin letters: the
[arabic-copy](../../arabic-copy/SKILL.md) skill. For this stack:

- Keep its glossary of fixed terms at the top of the dictionary: one word per concept across the app.
- Template names, IDs and codes stay exactly as the source wrote them.
- Error messages are a sentence that says what to do, in the user's language, never the raw text from a vendor.

## SEO for two languages

- `og:locale` `ar_AR` or `en_US`, with the other one in `og:locale:alternate`.
- `link rel="alternate" hreflang="ar"`, `hreflang="en"` and `hreflang="x-default"` on both pages. See
  [static-seo.md](static-seo.md).
- The sitemap lists both URLs, each with its alternates.

## Checklist

- [ ] Both dictionaries have every key; `typecheck` passes.
- [ ] No `ml-/mr-/pl-/pr-/left-/right-/text-left` on anything that should flip.
- [ ] IDs, phone numbers and versions inside Arabic text are in `<bdi dir="ltr">`.
- [ ] Directional icons mirror in Arabic; object icons do not.
- [ ] Each screen looked at in Arabic and English at 375px, with long labels (German-length English, long Arabic).
