---
name: admin-ui
description: Use when building or editing an admin panel or back-office screen on Inertia + Vue 3 + TypeScript + shadcn-vue + Tailwind 4 (usually with a Laravel back end) — pages, layouts, forms, tables, filters, row actions, dialogs, toasts, status badges, design tokens, dark mode, icons, motion, and Arabic/RTL support. Trigger for work under resources/js/pages, components or layouts, for anything a controller renders with Inertia::render, when an arrow points the wrong way in Arabic, when a control needs an icon or an animation, or when deciding whether a new UI library is warranted. Arabic triggers: «لوحة التحكم», «صفحة إدارة», «اتجاه RTL», «نموذج إدخال».
---

# Admin UI

Rules for admin screens built with Inertia 3, Vue 3, TypeScript, shadcn-vue and Tailwind 4,
running in Arabic (RTL) and English (LTR) from the same markup. Learned on two production panels.
Version facts were recorded in 2026-09/10; re-check them after a major upgrade.

## TL;DR

- Build from the shadcn-vue registry, never from styled `div`s. Customise by wrapping, by `class`
  for layout, or through tokens; don't fork the vendored files.
- Semantic tokens only (`bg-background`, `text-muted-foreground`). No literal colours.
- Logical properties only (`ms-`, `pe-`, `start-`, `text-start`). Directional icons flip in RTL.
- Every page sets `<Head :title>`, has typed props, and takes all copy from the lang files (both
  languages).
- One primary action per page header; a row shows view · edit · delete, the rest goes in `⋯`.
- A form has one submit and no Cancel. zod validates before the request, the server after, and
  both errors render in the same slot.
- Every write reports through one flash/toast listener; pages never call `toast()` for a request.
- Destructive actions go through a confirm dialog; a dangerous section is always visible.
- `shadcn-vue add` can rewrite your CSS and revert your edits. Read `git diff` after every `add`.
- Run the type check (`vue-tsc --noEmit`) before calling a frontend change done, and look at it in
  a browser in both languages and both themes (`ui-review`).

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
4. **Don't edit `components/ui/`.** It is vendored, generated (with `--rtl` for an RTL panel), and
   the CLI overwrites it. Compose a wrapper in `components/`, pass `class`, or change a token. A
   hardcoded English string inside a registry component is overridden at the call site (a slot,
   an `aria-label`), never patched in place.
5. **Build from the library.** A callout is `Alert`, an empty state `Empty`, a rule `Separator`, a
   chip `Badge`, a loading placeholder `Skeleton`. If you are styling a bare element, check the
   registry first. Catalogue: [references/components.md](references/components.md).
6. **No literal colours.** Semantic tokens, so light and dark both work. An alpha of a token
   (`bg-primary/80`) when you need a shade. See [references/theme.md](references/theme.md).
7. **Logical properties, always.** A Latin identifier shown inside Arabic copy (a host, a URL, a
   key) goes in a `dir="ltr"` wrapper, but never on a plain input. A glyph that points takes
   `rtl:rotate-180` or `rtl:-scale-x-100`. See [references/rtl-and-bidi.md](references/rtl-and-bidi.md).
8. **Copy comes from the lang files** through the app's `t()`. Never a literal string in a
   template. Add every key to both languages. If the panel defaults to Arabic, Arabic is written
   first and plainly (see `arabic-copy`).
9. **A status renders a `StatusBadge` with a tone from the server.** The server enum names a
   meaning (success, warning, danger, neutral); one client map decides the look.
10. **Destructive actions go through a confirm dialog** (`AlertDialog`), never a bare link. A
    sensitive section is a `DangerZone` card titled after what it acts on, and it stays out of
    tabs so it is never hidden.
11. **Every action button carries its icon**, and a submit swaps it for a spinner while
    `form.processing`.
12. **Three actions, then `⋯`.** A row shows view · edit · delete and nothing else; a page header
    shows the one primary action. Everything else goes in a row-actions menu.
13. **A button says the verb, not the sentence:** «إضافة», not «إنشاء وتجهيز». The card title and
    description carry the context.
14. **No Cancel button.** Leaving is what the breadcrumb and sidebar are for.
15. **Committing actions share one width** (a form's submit and each danger-zone button), so a
    column of them reads as a set.
16. **A record is a grid of detail cards, never a `Table`.** `Table` is for a list of records,
    where columns repeat and align. Resolve ids to names on the server before sending them.

Buttons in detail: [references/buttons.md](references/buttons.md). Forms, record pages, lists and
toasts: [references/forms-and-lists.md](references/forms-and-lists.md).

## Where things live

```
resources/js/
├── app.ts          # createInertiaApp: title, layout resolver, theme, language, flash toasts
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
  screen tall. Sections that act **on** the record (status, tools, delete) stay below the tabs as
  always-visible cards.
- `TabsContent` unmounts hidden panels, so a tabbed form must surface errors from a hidden tab: a
  destructive-coloured dot on the trigger, and a `watch` on the merged errors that switches to the
  offending tab. The same goes for per-language tabs of a translatable field.
- The page header holds the title, a status slot and the actions. Breadcrumbs go to the shell
  header through layout props; then the header's `<h1>` can stay for the accessibility tree only.
- The app layout stacks the page's children with `gap-4`, so siblings need no wrapper.
- Auth pages get no persistent layout; they render their own centred card layout.

## Routes

Navigation and form targets use the generated helpers, never a hand-written path:

```ts
import admin from '@/routes/admin';

admin.customers.index().url;
admin.customers.edit(id).url;
```

The generated folders (`resources/js/routes`, `actions`, `wayfinder`) are gitignored and written by
the Vite plugin or `php artisan wayfinder:generate`. Never edit them. A route registered only in
some environments (a local-only tool) has no helper in a production build, so referencing one
fails that build: write those few URLs as literals, with a comment saying why.

## Toasts

One listener on the Inertia router, registered once at boot. A GET stays silent. Every write
reports: the controller's flashed success or error, or a generic outcome. Failures come from the
router's `error`, `httpException` and `networkError` events (Inertia 3 names). Pages never call
`toast()` for a request's result; the controller flashes.

## Copy on admin screens

| Where | Says |
|---|---|
| a button | the verb alone: «إضافة»، «حفظ»، «تعليق»، «إعادة البناء» |
| a field label inside a titled card | the field alone: «البريد الإلكتروني», not «بريد المدير الرئيسي» |
| a danger-zone description | what happens, one sentence, present tense: «تعليقه يمنعه من الوصول فورًا، ويمكنك إعادة تفعيله في أي وقت.» |
| a confirm dialog title | a question: «هل تريد حذف هذا العميل؟» |
| its description | the consequence and what survives it, never a repeat of the title |

Say the effect, not the mechanism: «لا يُمحى سجل العميل نهائيًا، لكن خدمته تتوقف فورًا», not a
sentence about soft-deleting a row. Name the state the reader is in before offering the action, so
the same section reads right whether the record is active, suspended or failed.

## Before calling it done

```bash
npm run types:check   # vue-tsc --noEmit; required for any frontend change
npm run build
npm run format
```

Every new surface works in dark mode and at 390px, in Arabic and English. Check it in a browser,
not by reading the diff (`ui-review`).

## Topics

| Working on… | Read |
|---|---|
| a colour, radius, font, dark mode | [references/theme.md](references/theme.md) |
| what to build a piece of UI out of | [references/components.md](references/components.md) |
| an action, a status chip, a busy state | [references/buttons.md](references/buttons.md) |
| a form, a record page, a list, filters, toasts | [references/forms-and-lists.md](references/forms-and-lists.md) |
| something on the wrong side in Arabic | [references/rtl-and-bidi.md](references/rtl-and-bidi.md) |
| an icon, an animation, a new UI library | [references/icons-and-motion.md](references/icons-and-motion.md) |
| a chart | [references/charts.md](references/charts.md) |
