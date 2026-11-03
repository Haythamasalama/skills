# Arabic, English and right to left

**Read when:** you add a language, a translated string, a value inside Arabic text, a directional icon, or
format a number or date.
**Owns:** the two language settings, choosing and storing the language, typed dictionaries shared by page and
server, logical classes, mixed-direction text, inputs, mirrored icons, numbers and dates, Arabic type.

## TL;DR

- Two settings, both needed: `<UApp :locale>` for components, `htmlAttrs: { lang, dir }` for the page.
- Write layout once with logical classes (`ms-* pe-* start-* text-start border-s rounded-e-*`).
- LTR values inside Arabic text go in `<bdi dir="ltr">`; text a user typed gets `dir="auto"`.
- Inputs follow the page direction. Never `dir="ltr"` on a plain input.
- Pointing icons mirror in RTL; object icons never do.
- Latin digits everywhere: `Intl` locale `ar-u-ca-gregory-nu-latn` for Arabic dates, `en-US` for numbers.

## Two settings, both needed

```vue
<!-- app/app.vue -->
<script setup lang="ts">
import { ar, en } from '@nuxt/ui/locale'

useHead({ htmlAttrs: { lang: () => locale.value, dir: () => (isRtl.value ? 'rtl' : 'ltr') } })
</script>

<template>
  <UApp :locale="locale === 'ar' ? ar : en" :toaster="{ position: 'bottom-center' }">
    <NuxtLayout><NuxtPage /></NuxtLayout>
  </UApp>
</template>
```

- Each Nuxt UI locale carries `dir`; `UApp` uses it for component behaviour (menus, arrow keys in tabs, pickers).
  It does not set `<html dir>` (checked 2026-11-03, ui.nuxt.com/docs/getting-started/integrations/i18n/nuxt).
- `<html dir>` drives logical CSS, alignment and the `rtl:` variant. Also set the default in
  `nuxt.config.ts` `app.head.htmlAttrs` so the first paint is right before the app boots.
- With `@nuxtjs/i18n` installed, `UApp` follows its current locale on its own (Nuxt UI 4.12+, checked
  2026-11-03); `useLocaleHead()` then fills `<html lang dir>`.

## Choosing the language

**A dashboard** (`ssr: false`): a module-level `ref`, saved in `localStorage`, with a default from settings.

```ts
// app/utils/locale.ts
const LOCALE_KEY = 'my-app:locale'

function storedLocale(): Locale | null {
  try {
    const value = localStorage.getItem(LOCALE_KEY)
    return isLocale(value) ? value : null
  }
  catch {
    return null
  }
}

export const locale = ref<Locale>(storedLocale() ?? 'ar')
export const isRtl = computed(() => locale.value === 'ar')

/** The language set in the app's settings, used until this browser picks one. */
export function useDefaultLocale(fallback: Locale): void {
  if (!storedLocale()) locale.value = fallback
}

export function setLocale(next: Locale): void {
  locale.value = next
  try { localStorage.setItem(LOCALE_KEY, next) }
  catch { /* storage blocked: the default returns next visit */ }
}

export const intlLocale = () => (locale.value === 'ar' ? 'ar-u-ca-gregory-nu-latn' : 'en-US')
```

Reading storage at module load only works client-side. With SSR, read it in `onMounted` or use a cookie.

**A public site:** one URL per language so both are indexed: `/` and `/ar/`, guides at `/docs/x/` and
`/ar/docs/x/`. The language comes from the route; the switch is a link, not a toggle.

```ts
// app/composables/useLang.ts
export function useLang() {
  const route = useRoute()
  const lang = computed<Lang>(() => (route.path.startsWith('/ar') ? 'ar' : 'en'))

  return {
    lang,
    text: computed(() => content[lang.value]),
    isRtl: computed(() => lang.value === 'ar'),
    otherPath: computed(() => (lang.value === 'ar'
      ? route.path.replace(/^\/ar/, '') || '/'
      : `/ar${route.path === '/' ? '/' : route.path}`)),
  }
}
```

`pages/index.vue` and `pages/ar/index.vue` both render `<LandingPage />`. A site with many translated routes is
a better fit for `@nuxtjs/i18n`.

## Dictionaries shared by page and server

No i18n module for a dashboard: two typed files in `shared/` and one helper used by both sides, so server
errors arrive already translated.

```ts
// shared/utils/i18n.ts
import type ar from '../locales/ar'

export const LOCALES = ['ar', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export type Params = Record<string, string | number>
type Leaf = string | ((params: Params) => string)
type Shape<T> = { [K in keyof T]: T[K] extends Leaf ? Leaf : Shape<T[K]> }
type Paths<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends Leaf ? `${P}${K}` : Paths<T[K], `${P}${K}.`>
}[keyof T & string]

export type Dictionary = Shape<typeof ar>
export type MessageKey = Paths<typeof ar>

// Each side hands in the data: importing the dictionaries here breaks Nitro's resolver.
let dictionaries: Partial<Record<Locale, Dictionary>> = {}
let source: () => Locale = () => 'ar'

export function setupI18n(options: { dictionaries: Record<Locale, Dictionary>, locale: () => Locale }): void {
  dictionaries = options.dictionaries
  source = options.locale
}

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

export function translate(locale: Locale, key: string, params: Params = {}): string | undefined {
  let node: unknown = dictionaries[locale]
  for (const part of key.split('.')) node = (node as Record<string, unknown> | undefined)?.[part]
  if (typeof node === 'function') return node(params)
  return typeof node === 'string'
    ? node.replace(/\{(\w+)\}/g, (match, name) => (name in params ? String(params[name]) : match))
    : undefined
}

export const t = (key: MessageKey, params?: Params): string => translate(source(), key, params) ?? key

/** For keys built at run time from outside data: `fallback` when the dictionary has no entry. */
export const tOr = (key: string, fallback: string, params?: Params): string => translate(source(), key, params) ?? fallback
```

```ts
// shared/locales/ar.ts: the shape every other language must match
import type { Params } from '../utils/i18n'

export default {
  common: { save: 'حفظ', cancel: 'إلغاء', continue: 'متابعة', copied: 'تم النسخ', copyFailed: 'تعذّر النسخ' },
  invoices: {
    add: 'إضافة فاتورة',
    count: ({ n }: Params) => (Number(n) === 1 ? 'فاتورة واحدة' : Number(n) === 2 ? 'فاتورتان' : `${n} فواتير`),
  },
}

// shared/locales/en.ts
import type { Dictionary } from '../utils/i18n'

const en: Dictionary = {
  common: { save: 'Save', cancel: 'Cancel', continue: 'Continue', copied: 'Copied', copyFailed: 'Could not copy' },
  invoices: { add: 'Add invoice', count: ({ n }) => (Number(n) === 1 ? 'One invoice' : `${n} invoices`) },
}

export default en
```

```ts
// app/plugins/i18n.ts
import ar from '#shared/locales/ar'
import en from '#shared/locales/en'

export default defineNuxtPlugin(() => setupI18n({ dictionaries: { ar, en }, locale: () => locale.value }))
```

```ts
// server/utils/locale.ts: the request's X-Locale header, held for the request
import { AsyncLocalStorage } from 'node:async_hooks'
import type { H3Event } from 'h3'
import ar from '#shared/locales/ar'
import en from '#shared/locales/en'

const requestLocale = new AsyncLocalStorage<Locale>()

export const localeOf = (event: H3Event): Locale => {
  const header = getHeader(event, 'x-locale')
  return isLocale(header) ? header : 'ar'
}

export const withLocale = <T>(event: H3Event, run: () => T): T => requestLocale.run(localeOf(event), run)

setupI18n({ dictionaries: { ar, en }, locale: () => requestLocale.getStore() ?? 'ar' })
```

- `en: Dictionary` makes `typecheck` fail when English misses a key Arabic has.
- `t('invoices.count', { n })`: values as `{name}` in strings; wording that depends on a count is a function.
  Arabic has six plural categories; `new Intl.PluralRules('ar').select(n)` returns the one to use.
- Keys from outside data use `` tOr(`status.${code}`, code) `` so an unknown code still shows.
- After a language switch, refetch data whose text comes from the server (`watch(locale, refresh)`).

## Layout once, both directions

| Instead of | Write |
|---|---|
| `ml-2` / `mr-2`, `pl-4` / `pr-4` | `ms-2` / `me-2`, `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-lg` / `rounded-r-lg` | `rounded-s-lg` / `rounded-e-lg` |
| `space-x-2` on a flex row | `gap-2` |

- Flex and grid order follow `dir`; never reverse them by hand.
- `rtl:` / `ltr:` variants cover the rare exception. Centring with `left-1/2 -translate-x-1/2` is symmetric.
- Never branch on direction in script for something CSS can state.

## Mixed-direction text

A run in another direction must be isolated, or neutral characters (digits, slashes, brackets, punctuation)
jump ends. This is a correctness bug, not style.

- **LTR values inside Arabic** (phone numbers, IDs, codes, paths, versions, emails, URLs, money):
  `<bdi dir="ltr">{{ value }}</bdi>`, or `dir="ltr"` on the inline element.
- **Inside a translated string**, wrap the value in the isolates U+2066 … U+2069:
  `` export const ltr = (text: string) => `⁦${text}⁩` ``. Add them only where a flip shows; they are
  invisible in source.
- **Text a user typed or that may be either language:** `dir="auto"` (textareas, previews, excerpts). A text
  input showing such content can also take `:ui="{ base: '[unicode-bidi:plaintext]' }"`.
- **Code and commands:** `<pre dir="ltr" class="text-start">`.

### Inputs

- Inputs follow the page direction: right aligned in Arabic, left in English. Latin typed into an RTL input reads
  fine.
- `dir="ltr"` on a plain input drags the caret and the placeholder to the wrong edge. Don't.
- An input that holds Latin (a host, a JSON body) may take `dir="auto"` **once it has a value**; an empty box has
  nothing to read and falls back to LTR:
  `const autoDir = (v: unknown) => (v === null || v === undefined || v === '' ? undefined : 'auto')`.
- An affix with meaning (a `.example.test` suffix, a dial code) makes the whole group LTR. A leading icon is not
  an affix.

## Icons that point somewhere

- **Mirror:** chevrons, arrows, back and forward, undo and redo, reply, send, external link.
- **Never:** clocks, phones, checkmarks, play, logos, anything with a digit or letter.
- Lucide icons from `@nuxt/icon` render as `<span class="iconify i-lucide:name">`; the flip list lives in
  [`../assets/main.css`](../assets/main.css). One-off: `class="rtl:rotate-180"` (symmetric glyphs) or
  `rtl:-scale-x-100` (asymmetric).
- Use the left chevron for "previous", the right for "next", and let CSS flip both.
- A typed arrow (`→`) in copy cannot flip; use an icon.

## Numbers, dates and money

```ts
// app/utils/format.ts
export const count = (value?: number) => new Intl.NumberFormat('en-US').format(value ?? 0)

export function money(value: number, currency = 'USD'): string {
  try { return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value) }
  catch { return `${value.toFixed(2)} ${currency}` }
}

export const compactMoney = (value: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: 'compact', maximumFractionDigits: 1 }).format(value)

export const shortDay = (iso: string) =>
  new Intl.DateTimeFormat(intlLocale(), { day: 'numeric', month: 'short' }).format(new Date(`${iso}T00:00:00`))

export const timeOfDay = (date: Date | number) =>
  new Intl.DateTimeFormat(intlLocale(), { hour: 'numeric', minute: '2-digit' }).format(date)
```

- Parse a bare date as local midnight (`${iso}T00:00:00`), or it shifts a day west of UTC.
- Server-rendered dates use a fixed `timeZone` (`'UTC'`) so server and browser print the same text.
- `new Intl.DisplayNames(intlLocale(), { type: 'region' })` names countries in the page language.
- Numeric chart axes take `dir="ltr"`; a time axis reading left to right is normal in Arabic too.

## Arabic type

- Line height about 1.6 or more for Arabic paragraphs (`text-sm/7`, `text-lg/8`).
- No `tracking-*` and no `uppercase` on Arabic: spacing breaks joined letters, and Arabic has no case. A label
  that is uppercase or `font-mono` in English drops both when translated.
- Arabic reads larger at the same size; don't shrink it to match English line length.
