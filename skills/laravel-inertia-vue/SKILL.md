---
name: laravel-inertia-vue
description: "Use when starting or building the front end of a Laravel app with Inertia, Vue 3, TypeScript and Tailwind 4 (usually with shadcn-vue) — a blueprint for a new project (the resources/js folder map, app.ts and layouts, the flash toast listener, translations, appearance, direction sync, shared prop types, a copy-ready app.css) and the house components (PageHeader, DataTable, RowActions, ConfirmAction, FormField, DetailCard, StatusBadge, EmptyState) plus the rules for pages, typed props and shared props, useForm with zod and Form Request validation, Wayfinder routes, lists with server-side filters and pagination, record pages, deletes and confirm dialogs, toasts, status badges, on-screen copy, tokens and dark mode, icons and motion, and Arabic/English with RTL. Trigger for work under resources/js, anything a controller renders with Inertia::render, a page that loses state or reloads fully, a status colour, an arrow pointing the wrong way in Arabic, or a new UI library. Also triggers on \"Laravel Inertia Vue\", \"Inertia + Vue\", \"Laravel Vue starter kit\". Arabic triggers: «لارافيل فيو إنيرشا», «فيو مع إنيرشا», «مشروع جديد», «صفحة جديدة», «نموذج إدخال», «جدول وفلاتر», «اتجاه RTL», «الوضع الغامق»."
metadata:
  tags: vue, laravel, inertia
---

# Laravel + Inertia + Vue

**Read when:** creating a Laravel + Inertia + Vue app, or writing or reviewing anything under
`resources/js/` in one.
**Owns:** the project blueprint, the house components, and the rules for data flow, forms, lists,
records, actions, feedback, copy, theme, direction, icons and motion on this stack.

The server keeps routing, controllers and validation; each page is a Vue component that renders
typed props and submits forms. Versions this skill was checked against (2026-11-03): Inertia 3,
Vue 3.5, Tailwind 4, reka-ui 2, zod 4, vue-sonner 2, `@lucide/vue` 1. Re-check after a major upgrade.

## TL;DR

- The server owns data, routing and validation. A page renders typed props and submits with `useForm`.
- Start a project from [blueprint.md](references/blueprint.md) and `assets/app.css`; build the house
  components once from [house-components.md](references/house-components.md). Every screen uses them,
  which is what makes screens look the same.
- Build from the registry, never from styled `div`s. Never hand-edit `components/ui/`.
- Semantic tokens only, logical properties only. Directional icons flip in RTL.
- Every page sets `<Head :title>`, types its props, and takes its copy from the lang files (in a
  two-language app).
- A row shows view · edit · delete, then `⋯`. A header shows one action. A form has one submit and
  no Cancel.
- Toasts come only from the flash listener. Deletes go through a confirm that names the record.
- Run `npm run types:check` and look at the change in a browser, in both themes and both languages.

## New project

```bash
laravel new app          # the Vue starter kit: Inertia, Vue, TypeScript, Tailwind, shadcn-vue
cd app
npm install
npm install zod vue-sonner @lucide/vue @vueuse/core   # whichever the kit did not already add
composer run dev         # server, queue, logs and Vite together
```

Then, before the first screen:

1. Set `components.json` as in [theme.md](references/theme.md#the-registry-setup) (`rtl: true` if the
   app has Arabic) **before** the first `npx shadcn-vue@latest add`, so the registry is written in
   logical properties from the start.
2. Copy `assets/app.css` to `resources/css/app.css`.
3. Create the day-one files: `inertia-app.ts`, `app.ts`, the two layouts, `lib/flash.ts`,
   `lib/document.ts` and `types/index.ts` from [blueprint.md](references/blueprint.md), and
   `useTranslations` and `useAppearance` from [composables.md](references/composables.md).
4. Add the registry parts the house components use: `button badge card table pagination select
   dropdown-menu alert-dialog dialog sheet popover command field input-group input separator
   skeleton spinner tabs tooltip sidebar sonner breadcrumb empty`.
5. Build the house components from [house-components.md](references/house-components.md).

## The stack, and what it is not

| Concern | Use | Not |
|---|---|---|
| routing | Inertia `<Link>`, `router.visit`, Wayfinder helpers | vue-router, hand-written paths |
| page data | props from the controller | client-side fetching for the page |
| writes | `useForm`: POST → redirect → GET plus a flash | a REST client |
| validation | zod before the request, a Form Request after, one error slot | vee-validate |
| components | shadcn-vue (Reka UI) in `components/ui/`, house wrappers in `components/` | another kit, hand-rolled markup |
| tables | the registry's `Table` with `v-for`, filters in the URL | a client-side row model for a paged list |
| client state | a composable with module-scoped state | Pinia or Vuex by default |
| styling | Tailwind 4 with CSS-variable tokens | literal colours |
| toasts | vue-sonner, fired by one router listener | ad-hoc banners |
| icons | `@lucide/vue`, named imports | pasted SVG paths, a second set |
| direction | `ConfigProvider :dir` in each layout, logical properties | `dir` patches per component |

## Always-on rules

1. **Every page sets `<Head :title>`** (detail pages compute it from props), because the browser tab
   and history are how people find a page again.
2. **Typed props:** `defineProps<{ … }>()`, no `any`. Untyped props hide a renamed key until runtime.
3. **The render string equals the file:** `Inertia::render('Customers/Index')` →
   `pages/Customers/Index.vue`. A mismatch is the most common "page not found".
4. **Never name a page prop after a shared prop.** It silently replaces the shared one on that page.
5. **Never hand-edit `components/ui/`.** The CLI rewrites it. Wrap it, pass `class`, or change a token.
6. **Build from the registry.** A callout is `Alert`, a chip `Badge`, a rule `Separator`, a loading
   placeholder `Skeleton`: a hand-built one misses focus, dark mode, RTL and keyboard handling.
7. **No literal colours.** Tokens are redefined under `.dark`; a literal is not.
8. **Logical properties, always** (`ms-`, `pe-`, `start-`, `text-start`), so one markup serves both
   directions.
9. **Copy from the lang files** through `t()` in a two-language app, every key in each language,
   because a literal string never gets translated.
10. **Every URL from a Wayfinder helper,** so a renamed route fails the type check instead of 404ing.
11. **Hide what the viewer may not use** with `v-if="can(...)"`; the route enforces the same rule,
    because the template guard is a courtesy, not the boundary.
12. **A status is a `StatusBadge` whose tone the server sends**, so one enum decides what a status
    looks like everywhere.
13. **Toasts come only from the flash listener**, so a toast appears only when the server confirmed
    the outcome.
14. **Destructive actions go through `ConfirmAction`**, which names the record, because a bare
    button deletes on a stray click.
15. **A record is never a `Table`.** `Table` is for a list of records, where columns repeat.

## Where each topic lives

| Working on… | Read |
|---|---|
| a new project, the folder map, entry files, layouts, naming | [references/blueprint.md](references/blueprint.md) |
| a house component's props, slots and template | [references/house-components.md](references/house-components.md) |
| a composable's signature and code (`useListFilters`, `useClientValidation`, …) | [references/composables.md](references/composables.md) |
| props, shared props, state, types, permissions, routes, navigation | [references/data-flow.md](references/data-flow.md) |
| a form, validation, field errors, tabbed and per-language forms | [references/forms.md](references/forms.md) |
| an index page, filters, pagination, table cells, empty states | [references/lists.md](references/lists.md) |
| a show page: facts, sections, header actions, deciding verbs | [references/records.md](references/records.md) |
| a button, a row or header action, a delete, a dialog, a toast, a status badge | [references/actions-and-feedback.md](references/actions-and-feedback.md) |
| a label, help text, an empty state, a confirm, Arabic wording, lang files | [references/copy.md](references/copy.md) |
| what to build a piece of UI from, layout classes, the vendored registry | [references/components.md](references/components.md) |
| a colour, radius, card, the shell, fonts, dark mode, `shadcn-vue add` | [references/theme.md](references/theme.md) |
| the stylesheet to copy | [assets/app.css](assets/app.css) |
| something on the wrong side in Arabic, a reversed value, input direction | [references/rtl-and-bidi.md](references/rtl-and-bidi.md) |
| an icon, an animation, a new UI library | [references/icons-and-motion.md](references/icons-and-motion.md) |

## Page shape at a glance

```
AppLayout   sidebar (inset) │ header h-16: trigger · breadcrumbs ─────── #page-actions
            content: flex flex-1 flex-col gap-4 p-4
Index       PageHeader (create) · DataTable (toolbar · table · pagination)
Show        PageHeader (one action) · Tabs of DetailCard grids · DangerZone
Create/Edit PageHeader · Card with a field grid · one submit
Auth        no shell: AuthLayout's centred card
```

## Before calling it done

```bash
npm run types:check   # vue-tsc --noEmit
npm run build
npm run format
```

- Every new surface works in light and dark, at 390px wide, and in each language the app has.
  Check it in a browser, not by reading the diff.
- After any `shadcn-vue add`, `git diff` the stylesheet ([theme.md](references/theme.md#changing-a-token)).
- Logic added to `lib/` or a composable gets a Vitest test, if the project tests its front end.
