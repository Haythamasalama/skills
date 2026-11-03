---
name: vue-inertia
description: Use when starting or building the front end of a Laravel app with Inertia, Vue 3, TypeScript and Tailwind 4 (usually with shadcn-vue components) — setting up a new project, pages and layouts, typed props and shared props, useForm and client validation, generated route helpers, lists with server-side filters and pagination, record pages, confirm dialogs, flash toasts, status badges, design tokens and dark mode, icons and motion, and Arabic/English with RTL. Trigger for work under resources/js (pages, components, layouts, composables), anything a controller renders with Inertia::render, a page that loses state or reloads fully, an arrow pointing the wrong way in Arabic, or deciding whether a new UI library is warranted. Arabic triggers: «فيو مع إنيرشا», «صفحة جديدة», «نموذج إدخال», «اتجاه RTL», «الوضع الغامق».
---

# Vue + Inertia

**Read when:** writing or reviewing anything under `resources/js/` in a Laravel + Inertia + Vue app,
or creating such an app.
**Owns:** project setup, the data flow between controller and page, page and screen shapes, forms,
lists, toasts, tokens, icons, motion and direction for this stack.

Inertia lets the server keep routing, controllers and validation while each page is a Vue component.
Version facts were recorded in 2026-09/11 (Inertia 3, Vue 3.5, Tailwind 4); re-check them after a
major upgrade.

## TL;DR

- The server owns data, routing and validation. A page renders typed props and submits forms.
- Build from the component registry (shadcn-vue), never from styled `div`s. Don't edit `components/ui/`.
- Semantic tokens only (`bg-background`, `text-muted-foreground`). No literal colours.
- Logical properties only (`ms-`, `pe-`, `start-`, `text-start`). Directional icons flip in RTL.
- Every page sets `<Head :title>`, has typed props, and takes all copy from the lang files.
- One primary action in an index header; a row shows view · edit · delete, the rest goes in `⋯`.
- A form has one submit and no Cancel. zod validates before the request, the server after, and both
  errors render in the same slot.
- Every write reports through one flash listener; pages never call `toast()` for a request.
- Destructive actions go through a confirm dialog that names the record.
- Run the type check (`vue-tsc --noEmit`) before calling a change done, and look at it in a browser in
  both themes (and both languages, if the app has two).

## New project

```bash
laravel new app        # pick the Vue starter kit: Inertia, Vue, TypeScript, Tailwind, shadcn-vue
cd app
npm install && npm run build
composer run dev       # Laravel server, queue, logs and Vite together
```

Then, before the first screen:

1. If Arabic is a main language: set `"rtl": true` in `components.json`, re-add the installed
   components with `npx shadcn-vue@latest add <name> --overwrite`, and add `<ConfigProvider :dir>` to
   the layouts ([rtl-and-bidi.md](references/rtl-and-bidi.md)).
2. Pick the fonts and the one accent colour in the stylesheet ([theme.md](references/theme.md)).
3. Add the flash listener and a translation helper (`t()`) in `app.ts`.
4. Add components with `npx shadcn-vue@latest add <name>` and read `git diff` on the stylesheet after
   each one: the CLI can drop your font import and duplicate `@layer base`.

## The stack, and what it is not

| Concern | Use | Not |
|---|---|---|
| Routing | Inertia `<Link>`, `router.visit`, generated route helpers (Wayfinder) | vue-router, hand-written paths |
| Page data | Inertia props from the controller | client-side fetching for the page itself |
| Writes | `useForm`: POST → redirect → GET | a REST client |
| Validation | zod before the request, a Form Request after; same error slot | vee-validate |
| Components | shadcn-vue primitives in `components/ui/` | another kit, or hand-rolled markup |
| Styling | Tailwind + CSS-variable tokens | hardcoded colours |
| Toasts | vue-sonner, fired by one flash listener | ad-hoc banners |
| Icons | `@lucide/vue`, named imports | pasted SVG paths, a second icon set |
| Direction | `ConfigProvider :dir` in the root layout, logical properties | `dir` patches per component |

## Always-on rules

1. **Every page sets `<Head :title>`.** Detail pages compute it from props.
2. **Typed props:** `defineProps<{ … }>()`. No `any`, no untyped `usePage().props`.
3. **The `Inertia::render` string matches the file:** `Inertia::render('Customers/Index')` →
   `resources/js/pages/Customers/Index.vue`.
4. **Don't edit `components/ui/`.** The CLI overwrites it. Compose a wrapper in `components/`, pass
   `class`, or change a token. Hardcoded English inside a registry component is overridden at the call
   site (a slot, an `aria-label`).
5. **Build from the library.** A callout is `Alert`, an empty state `Empty`, a rule `Separator`, a chip
   `Badge`, a loading placeholder `Skeleton`. Catalogue: [components.md](references/components.md).
6. **No literal colours.** An alpha of a token (`bg-primary/80`) when you need a shade.
7. **Logical properties, always.** A Latin value shown inside Arabic copy goes in a `dir="ltr"`
   wrapper, never on a plain input. A glyph that points takes `rtl:rotate-180` or `rtl:-scale-x-100`.
8. **Copy comes from the lang files** through `t()`. Never a literal string in a template; add every
   key to each language the app has.
9. **A status renders a `StatusBadge` with a tone from the server.** The server enum names a meaning
   (success, warning, danger, neutral); one client map decides the look.
10. **Destructive actions go through `AlertDialog`**, never a bare link. A sensitive section is a
    danger-zone card titled after what it acts on, and it stays out of tabs so it is never hidden.
11. **Every action button carries its icon**, and a submit swaps it for a spinner while
    `form.processing`.
12. **Three actions, then `⋯`.** A row shows view · edit · delete; an index header shows one create; a
    record header at most two actions. Everything else goes in a row-actions menu.
13. **A button says the verb, not the sentence:** «إضافة», not «إنشاء وتجهيز». The card title carries
    the context.
14. **No Cancel button.** Leaving is what the breadcrumb and sidebar are for.
15. **A record is a grid of detail cards, never a `Table`.** `Table` is for a list of records. Resolve
    ids to names on the server before sending them.

## Where things live

```
resources/js/
├── app.ts          # createInertiaApp: title, layout resolver, theme, language, flash listener
├── components/     # house wrappers (PageHeader, DataTable, RowActions, ConfirmAction, …)
│   └── ui/         # vendored shadcn-vue: do not edit
├── composables/    # translations, appearance, client validation, list filters
├── layouts/        # AppLayout (sidebar shell), AuthLayout (centred card)
├── lib/            # cn(), tone map, document language sync, flash listener, button classes
├── pages/<Area>/   # one file per screen, matching Inertia::render('<Area>/<Name>')
└── types/          # shared prop types and the Inertia page-props augmentation
```

## Page shape

- A screen with more than one section of **its own record** puts them in `Tabs`, so it stays one
  screen tall. Sections that act **on** the record (status, tools, delete) stay below as cards.
- `TabsContent` unmounts hidden panels, so a tabbed form must surface errors from a hidden tab
  ([forms.md](references/forms.md)).
- The page header holds the title, a status slot and the actions. Breadcrumbs go to the shell header
  through layout props.
- Auth pages get no persistent layout; they render their own centred card.

## Routes

Navigation and form targets use the generated helpers, never a hand-written path:

```ts
import customers from '@/routes/customers';

customers.index().url;
customers.edit(id).url;
```

The generated folders (`resources/js/routes`, `actions`, `wayfinder`) are gitignored and written by
the Vite plugin or `php artisan wayfinder:generate`. Never edit them. A route registered only in some
environments (a local-only tool) has no helper in a production build, so referencing one fails that
build: write those few URLs as literals, with a comment saying why.

## Toasts

One listener on the Inertia router, registered once at boot. A GET stays silent. Every write reports:
the controller's flashed `success` or `error`, or a generic outcome. Failures come from the router's
`error`, `httpException` and `networkError` events (Inertia 3 names; Inertia 2 called the last two
`invalid` and `exception`). Pages never call `toast()` for a request's result; the controller flashes.

vue-sonner's stylesheet is imported unlayered and sets its own font, so a `font-sans` class on
`<Toaster>` loses. Put the toaster back on `--font-sans` with an unlayered override
([theme.md](references/theme.md)).

## Copy on screens

| Where | Says |
|---|---|
| a button | the verb alone: «إضافة»، «حفظ»، «تعليق» |
| a field label inside a titled card | the field alone: «البريد الإلكتروني», not «بريد المدير الرئيسي» |
| a danger-zone description | what happens, one sentence, present tense |
| a confirm dialog title | a question: «هل تريد حذف هذا العميل؟» |
| its description | the consequence and what survives it, never a repeat of the title |

Say the effect, not the mechanism: «لا يُمحى سجل العميل نهائيًا، لكن خدمته تتوقف فورًا», not a
sentence about soft-deleting a row.

## Before calling it done

```bash
npm run types:check   # vue-tsc --noEmit; required for any frontend change
npm run build
npm run format
```

Every new surface works in dark mode and at 390px wide, in each language the app has. Check it in a
browser, not by reading the diff.

## Topics

| Working on… | Read |
|---|---|
| props, shared props, writes, state, types, naming, permissions in templates | [references/inertia-pages.md](references/inertia-pages.md) |
| an index, a show page, a delete, dialogs, page container, UI copy | [references/screens.md](references/screens.md) |
| a form, tabbed forms, a record's detail cards, list filters | [references/forms.md](references/forms.md) |
| an action, a status chip, a busy state | [references/buttons.md](references/buttons.md) |
| what to build a piece of UI out of | [references/components.md](references/components.md) |
| a colour, radius, font, dark mode | [references/theme.md](references/theme.md) |
| something on the wrong side in Arabic | [references/rtl-and-bidi.md](references/rtl-and-bidi.md) |
| an icon, an animation, a new UI library | [references/icons-and-motion.md](references/icons-and-motion.md) |
