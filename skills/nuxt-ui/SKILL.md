---
name: nuxt-ui
description: "Use when building or changing a Nuxt 4 app or small site with Nuxt UI 4 and Tailwind CSS 4: a new project setup, theme tokens (CSS variables, `@theme`, `app.config` `ui` colours and component defaults), light and dark mode, a dashboard shell, tables, forms, modals and slideovers, tabs, empty states, toasts, Arabic and English with right-to-left layout, icons, static generation and prerendering for GitHub Pages, SEO, accessibility, or a Nuxt, Nitro or Tailwind error from that stack. Triggers: 'Nuxt UI', 'UTable', 'UModal', 'UDashboard', 'dark mode', 'RTL', 'dashboard', 'landing page', 'nuxt generate', 'GitHub Pages', 'تصميم', 'واجهة', 'لوحة تحكم', 'صفحة هبوط', 'من اليمين إلى اليسار'."
---

# Nuxt UI

How to build calm, dense dashboards and small marketing sites on Nuxt 4 + Nuxt UI 4 + Tailwind CSS 4,
in one or two languages, and ship them as a server app or as static files.

Stack facts, checked 2026-10-27: Nuxt 4.6, Nuxt UI 4.12, Tailwind CSS 4.3, `@iconify-json/lucide` 1.2,
`vue-tsc` 3.3, Node 22.21+ or 24.11+. Nuxt UI brings `@nuxt/icon`, `@nuxt/fonts` and `@nuxtjs/color-mode`
with it. Read the project's `package.json` first; versions move.

Example: a self-hosted WhatsApp template monitor (a dashboard plus a two-language marketing site that shares its
theme) is where most of these patterns were tried and kept.

## TL;DR

1. **Tokens only in components.** Text `text-highlighted | text-default | text-toned | text-muted | text-dimmed`,
   surfaces `bg-default | bg-muted | bg-elevated | bg-accented`, borders `border-default | border-muted`.
   Component colour is a prop: `color="primary | neutral | success | warning | error | info"`. No hex values and no
   palette classes like `text-green-600` in a component.
2. **The theme lives in three files:** `app/assets/css/main.css` (palette in `@theme static`, `--ui-*` overrides in
   `:root` and `.dark`), `app/app.config.ts` (`ui.colors` and component defaults), `nuxt.config.ts` (fonts, icons,
   `ui.theme.colors`). Every new token gets a light **and** a dark value.
3. **Write layout once for both directions.** Logical classes (`ms-* me-* ps-* pe-* start-* end-* text-start
   border-s rounded-e-*`), never `ml-* mr-* left-* right-* text-left` for anything that should flip.
4. **Language is two settings:** `<UApp :locale>` for component strings, and `htmlAttrs: { lang, dir }` for the page.
5. **Left-to-right values inside Arabic text** (IDs, phone numbers, codes, paths) go in `<bdi dir="ltr">`. Text a user
   typed, in any language, gets `dir="auto"`.
6. **Icons are Lucide** (`i-lucide-*`), bundled with the app. Every icon-only button has an `aria-label`, and a
   `UTooltip` when the icon alone is not obvious.
7. **Feedback:** `USkeleton` shaped like the content while loading, a toast after an action, a confirm modal before
   anything that cannot be undone.
8. **Static hosting:** `nuxt generate`, a base URL for sub-folder hosting, a helper for `public/` paths, and icons
   bundled with `icon.provider: 'none'` plus a scan that includes `.ts` files.
9. **Done means:** looked at in light and dark, Arabic and English, at 375px wide; `typecheck` and `build` pass.

## Files

| File | Holds |
|---|---|
| `nuxt.config.ts` | modules, `css`, `ssr`, `app.head` (default `lang`/`dir`, favicon, theme colour), `fonts`, `icon`, `ui`, `runtimeConfig.public`, `nitro.prerender` |
| `app/app.config.ts` | `ui.colors` (which palette is `primary`, `neutral`) and component theme overrides |
| `app/assets/css/main.css` | `@import "tailwindcss"; @import "@nuxt/ui";`, `@theme static`, `--ui-*` tokens, chart tokens, RTL icon flips |
| `app/app.vue` | `<UApp :locale :toaster>` around the pages, `useHead` for `lang` and `dir` |
| `app/components/`, `composables/`, `utils/`, `pages/`, `plugins/` | auto-imported by Nuxt |
| `server/api/`, `server/routes/`, `server/middleware/`, `server/utils/` | Nitro; `server/routes/` serves files like `sitemap.xml` |
| `shared/` | types and helpers used by both `app/` and `server/` |

## References

Load the file for the part you are working on.

| File | Read it when |
|---|---|
| [references/setup.md](references/setup.md) | starting a project, writing `nuxt.config.ts`, choosing SPA vs prerender, two apps sharing one theme |
| [references/theme.md](references/theme.md) | colours, palette, `--ui-*` tokens, component defaults, dark mode, fonts, radius, chart colours |
| [references/components.md](references/components.md) | dashboard shell, page header, cards, stat tiles, tables, forms, modals, slideovers, tabs, empty states, toasts, loading |
| [references/i18n-rtl.md](references/i18n-rtl.md) | Arabic and English, dictionaries, `dir`, logical classes, `bdi`, numbers and dates, mirrored icons |
| [references/static-seo.md](references/static-seo.md) | `nuxt generate`, GitHub Pages, base URL, SEO head, JSON-LD, `sitemap.xml`, `robots.txt`, `llms.txt`, landing page sections |
| [references/gotchas.md](references/gotchas.md) | something renders blank, a build or prerender fails, a value "is not defined", a layout breaks on phones |

## Setup in brief

- Install `nuxt`, `@nuxt/ui`, `tailwindcss` and `@iconify-json/lucide`; add `vue-tsc` and `typescript` as dev
  dependencies; keep `"postinstall": "nuxt prepare"`.
- `modules: ['@nuxt/ui']`, `css: ['~/assets/css/main.css']`, and a `compatibilityDate`.
- `ssr: false` suits a local tool or a screen behind a login where every request comes from the browser.
  A public site is prerendered (`nuxt generate`) so search engines and link previews get full HTML.
- Wrap the app in `<UApp>`. Toasts, tooltips, modals and `useOverlay()` need it.

## Theme in brief

- A brand palette is 11 shades (`50` to `950`) as `--color-<name>-<shade>` inside `@theme static`, then
  `ui.colors.primary: '<name>'` in `app.config.ts`. `static` matters: Nuxt UI reads those variables at runtime,
  and plain `@theme` drops variables no utility class uses.
- Change the look through Nuxt UI's own tokens (`--ui-primary`, `--ui-bg`, `--ui-bg-muted`, `--ui-border`,
  `--ui-radius`, ...) in `:root` and `.dark`, not by restyling each component.
- Flat cards: `card: { slots: { root: 'shadow-none' } }` in `app.config.ts`. A card that opens something on click
  may get `hover:shadow-md`.
- Status colours mean status. Map domain states to `success | warning | error | neutral` in one helper and reuse it.
- Charts get their own tokens (`--chart-bar`, `--chart-track`) in both modes, used as `bg-(--chart-bar)`.

## Layout and components in brief

- **Shell:** sidebar `w-64` from `lg`, a compact header with grouped ghost icon buttons, and the main content on a
  `rounded-2xl border border-default bg-default` panel over a `bg-muted` page. Under `lg` a `USelect` replaces the
  sidebar. Nuxt UI's `UDashboardGroup` / `UDashboardSidebar` / `UDashboardPanel` / `UDashboardNavbar` give a
  ready shell with collapse and resize.
- **Section card:** `rounded-xl border border-default bg-default p-5` with an `h2` in
  `font-semibold text-highlighted`. A table card drops the padding.
- **Tables:** `UTable` with typed `TableColumn<T>[]` in a `computed` (headers are translated), cell slots
  `#<id>-cell`, columns hidden on small screens through `meta.class`, an `sr-only` header for the actions column.
- **Forms:** `UFormField` + `UInput class="w-full"`; hints behind an info icon in the `#label` slot, not as a line of
  help text; errors in a subtle `UAlert`; the submit button shows `:loading`.
- **Overlays:** `UModal` / `USlideover` with `v-model:open`, `#body` and `#footer`. Confirmations go through a
  `useConfirm()` composable built on `useOverlay()` that returns a `Promise<boolean>`.
- **Tabs as a switch:** `UTabs :content="false" v-model`. On phones wrap it in `overflow-x-auto` with an inner
  `mx-auto w-max`.
- **Empty state:** a round icon tile, one line of `font-semibold text-highlighted`, and the next action as buttons.
- **Toasts:** `useToast().add({ title, color: 'success', icon: 'i-lucide-check' })`; errors use `color: 'error'` and
  the server's message as `description`.

## Arabic, English and RTL in brief

- Component strings: `import { ar, en } from '@nuxt/ui/locale'` and `<UApp :locale="lang === 'ar' ? ar : en">`.
- Page direction: `useHead({ htmlAttrs: { lang, dir: () => (isRtl.value ? 'rtl' : 'ltr') } })`, plus the default
  language in `nuxt.config.ts` `app.head.htmlAttrs` so the first paint is right.
- A small typed dictionary per language and a `t(key, params)` helper is enough for a dashboard. A public site gives
  each language its own URL (`/` and `/ar/`) so both get indexed.
- Arabic copy is Modern Standard Arabic, short and plain. Product and technical names stay in Latin letters.
- Arrows, chevrons, "send" and "external link" icons point the reading way: mirror them in RTL.
- Pick digits on purpose. Latin digits in Arabic UI: `Intl` locale `ar-u-ca-gregory-nu-latn`.

## Icons

- Use `i-lucide-*` names everywhere, through `UIcon`, `icon=` props, or data arrays.
- An app with a Nitro server: `icon: { serverBundle: 'local' }` so icons work offline.
- Static files only: `icon: { provider: 'none', clientBundle: { scan: { globInclude: ['**/*.{vue,ts}'] } } }`.
  The default scan reads `.vue` files only, so icon names kept in `.ts` data render blank.

## Static sites and SEO in brief

- `nitro.prerender.routes` lists every page and every server route file (`/sitemap.xml`, `/robots.txt`, `/llms.txt`).
- GitHub Pages under a repository path: build with `NUXT_APP_BASE_URL=/<repo>/` and prefix raw `public/` paths
  with `useRuntimeConfig().app.baseURL`.
- Each page sets `useSeoMeta` (title, description, Open Graph, Twitter), a canonical link, `hreflang` alternates
  with `x-default`, and one JSON-LD `@graph`.

## Accessibility

- One `h1` per screen, then `h2` per section. Headings describe the section in plain words.
- Icon-only buttons: `aria-label`. Decorative images: `alt=""`. Screenshots: `alt` that says what the image shows.
- The current item in a nav gets `aria-current="page"`.
- Charts built from `div`s also render an `sr-only` table with the same numbers.
- Colour never carries meaning alone: a status badge has an icon and a label.
- Keyboard: Nuxt UI overlays trap focus and close on Escape; don't rebuild them with plain `div`s.
- Check contrast of any new token pair in both modes (4.5:1 for text, 3:1 for large text and UI marks).
- Respect `prefers-reduced-motion` for any custom animation.

## Top gotchas

Full list with causes and fixes in [references/gotchas.md](references/gotchas.md).

- Icons named in `.ts` files render blank on a static build: widen the icon scan to `**/*.{vue,ts}`.
- Arabic letters fall back to the system font: `@nuxt/fonts` needs `subsets: ['arabic', 'latin']`.
- A palette colour does nothing as `primary`: it is in plain `@theme`, not `@theme static`.
- A util works in dev but is "not defined" during prerender: import it explicitly.
- Server routes do not auto-import from `app/utils/`: import with a relative path.
- `UTabs` overflows the screen on phones: `overflow-x-auto` wrapper, inner `mx-auto w-max`.
- Images from `public/` 404 on GitHub Pages: the path lacks the base URL.
- A white strip shows under a grey page on overscroll: give `html, body` the page background.

## Before you finish

- [ ] No raw colour in components:
  `grep -rnE "#[0-9a-fA-F]{3,8}\b|(text|bg|border)-(red|green|blue|gray|slate|zinc)-[0-9]" app/components`
- [ ] No physical direction classes on things that should flip:
  `grep -rnE "\b(ml|mr|pl|pr|left|right)-[0-9]|text-(left|right)\b" app/components`
- [ ] Every visible string goes through the dictionary, with the key in every language.
- [ ] Looked at: light and dark, Arabic and English, 375px and desktop. No sideways page scroll.
- [ ] `nuxt typecheck` and `nuxt build` (or `nuxt generate`) pass.
- [ ] Screenshots for a pull request or a site use demo data only.
