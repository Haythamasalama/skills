---
name: nuxt-ui-kit
description: "Use when starting or changing a Nuxt 4 app or site built with Nuxt UI 4 and Tailwind CSS 4: a new project from a ready blueprint (folder tree, day-one files, layouts, error page, house components and composables, naming), the theme (copy-ready main.css and app.config.ts with a calm green palette, tokens, dark mode, Arabic and Latin fonts), a dashboard shell, tables, forms, modals and slideovers, tabs, empty states, toasts, charts, Arabic and English with right-to-left layout, static generation for GitHub Pages, SEO and JSON-LD, a landing or docs page, or a Nuxt, Nitro or Tailwind error from that stack. Triggers: 'Nuxt UI', 'new Nuxt project', 'UTable', 'UModal', 'UDashboard', 'app.config', 'dark mode', 'RTL', 'dashboard', 'landing page', 'nuxt generate', 'GitHub Pages', 'مشروع Nuxt جديد', 'لوحة تحكم', 'واجهة', 'صفحة هبوط', 'عربي RTL'."
metadata:
  summary: "A Nuxt UI 4 blueprint with a copy-ready theme and dashboard shell."
  tags: nuxt-ui, nuxt, vue, ui, tailwindcss, rtl
---

# Nuxt UI

**Read when:** you start a Nuxt UI project or touch its theme, screens, languages, static build or SEO.
**Owns:** the whole front end of a Nuxt 4 + Nuxt UI 4 + Tailwind 4 app and its marketing site: structure, look,
components, Arabic and English, static hosting.

The result is a calm, dense dashboard: a light grey page, white cards with thin borders and no shadow, one green
accent, IBM Plex Sans Arabic for both scripts, Lucide icons, Arabic and English with right-to-left layout.

## TL;DR

1. **Start from the blueprint.** Folder tree, day-one files, layouts, house components and names are fixed in
   [references/blueprint.md](references/blueprint.md); copy [assets/main.css](assets/main.css),
   [assets/app.config.ts](assets/app.config.ts) and [assets/nuxt.config.ts](assets/nuxt.config.ts) unchanged to
   get the same look.
2. **Tokens only in components.** `text-highlighted | default | toned | muted | dimmed`,
   `bg-default | muted | elevated | accented`, `border-default | muted`, and `color="primary | neutral | success |
   warning | error | info"`. No hex and no palette classes outside `main.css`.
3. **Every token has a light and a dark value**, and the palette lives in `@theme static`.
4. **Layout written once for both directions:** logical classes only (`ms-* pe-* start-* text-start border-s`).
5. **Language is two settings:** `<UApp :locale>` and `htmlAttrs: { lang, dir }`, plus the default in
   `nuxt.config.ts`.
6. **LTR values in Arabic text go in `<bdi dir="ltr">`; user text gets `dir="auto"`;** inputs follow the page.
7. **Feedback:** skeletons shaped like the content, a toast after each action, `useConfirm()` before anything
   that cannot be undone.
8. **The page talks to `/api` only through `useApi()`;** every server route runs in `apiHandler()`.
9. **Static sites:** `nuxt generate`, every route listed, icons bundled with a scan of `.vue` and `.ts`, a base
   URL plus `asset()` under a sub-folder.

## Stack (checked 2026-11-03)

Nuxt 4.6, Nuxt UI 4.12, Tailwind CSS 4.3, `@iconify-json/lucide` 1.2, `vue-tsc` 3.3, Node 22.21+ or 24.11+, Bun
as package manager. Nuxt UI brings `@nuxt/icon`, `@nuxt/fonts` and `@nuxtjs/color-mode`. Read the project's
`package.json` first; versions move.

## Files in this skill

| Path | Holds |
|---|---|
| [assets/main.css](assets/main.css) | the full theme: palette, fonts, `--ui-*` overrides for light and dark, chart tokens, RTL icon flips, page background |
| [assets/app.config.ts](assets/app.config.ts) | `ui.colors` and the flat card default |
| [assets/nuxt.config.ts](assets/nuxt.config.ts) | a dashboard's config: SPA, default `lang`/`dir`, fonts, icons, version, security headers |
| [references/blueprint.md](references/blueprint.md) | folder tree, day-one files, layouts, error page, house components and composables, naming |
| [references/setup.md](references/setup.md) | install, versions, scripts, rendering mode, API helper and server wrapper, two apps on one theme, CI, Docker |
| [references/theme.md](references/theme.md) | what each token value is and why, swapping the hue, colour roles, charts, dark mode, fonts, radius and spacing |
| [references/components.md](references/components.md) | shell options, header tools, page header, cards, tables, forms, overlays, tabs, toasts, loading, charts, accessibility |
| [references/i18n-rtl.md](references/i18n-rtl.md) | locale choice, shared typed dictionaries, logical classes, bidi, inputs, icons, numbers and dates, Arabic type |
| [references/static-seo.md](references/static-seo.md) | prerender, icons without a server, GitHub Pages and base URL, head tags, JSON-LD, sitemap, robots, llms.txt |
| [references/landing.md](references/landing.md) | landing page sections, docs page layout, spacing |
| [references/gotchas.md](references/gotchas.md) | symptom → fix, linked to the rule |

## Where each topic lives

| Topic | File |
|---|---|
| Where a file goes, what to name it | blueprint.md |
| `nuxt.config.ts`, SPA or prerender, Docker | setup.md |
| Layouts (`dashboard.vue`, `auth.vue`), `error.vue` | blueprint.md |
| `StatTile`, `FieldLabel`, `EmptyState`, `ConfirmModal`, `useConfirm`, `useCopy` | blueprint.md |
| `useApi`, `apiHandler`, `apiError`, the request guard | setup.md |
| Palette, tokens, dark mode, fonts, chart colours, status tones | theme.md |
| `UDashboard*`, tables, forms, modals, tabs, toasts, chart markup | components.md |
| `t()`, dictionaries, `locale`, `useLang`, `<bdi>`, `dir="auto"`, `Intl` | i18n-rtl.md |
| `nuxt generate`, GitHub Pages, `asset()`, `useSeoMeta`, JSON-LD | static-seo.md |
| Hero, features, FAQ, footer, docs page | landing.md |
| Anything broken | gotchas.md |

## Workflow for a new project

1. Read blueprint.md; create the tree and the day-one files in its order.
2. Copy the three assets. To change the brand colour, follow "Swap the hue" in theme.md.
3. Write the dictionaries first (`shared/locales/ar.ts`, `en.ts`), then the screens.
4. Build each screen from the house components and the patterns in components.md.
5. A public site: a second Nuxt app in `site/` on the same theme (setup.md), then static-seo.md and landing.md.

## Done means

- [ ] No raw colour in components:
  `grep -rnE "#[0-9a-fA-F]{3,8}\b|(text|bg|border)-(red|green|blue|gray|slate|zinc|sage)-[0-9]" app/components app/layouts app/pages`
- [ ] No physical direction classes on things that flip:
  `grep -rnE "\b(ml|mr|pl|pr|left|right)-[0-9]|text-(left|right)\b" app/components app/layouts app/pages`
- [ ] Every visible string goes through `t()`; both dictionaries have the key; `typecheck` passes.
- [ ] Every new token has a light and a dark value.
- [ ] Looked at in light and dark, Arabic and English, at 375px and desktop; no sideways page scroll.
- [ ] Icon-only buttons have an `aria-label`; one `h1` per screen.
- [ ] `nuxt typecheck` and `nuxt build` (or `nuxt generate`) pass; a static build shows its icons.
- [ ] Screenshots use demo data only.
