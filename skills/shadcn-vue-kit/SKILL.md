---
name: shadcn-vue-kit
description: Use when starting, installing, adding, theming or fixing shadcn-vue in any Vue 3 project (Laravel + Inertia, Vite, Nuxt) — running the CLI (init, add, apply, migrate rtl, components.json), what init writes and where, the day-one component set, choosing the registry component for a need instead of a styled div, composition rules (items in groups, dialog titles, whole cards), customising a registry component through a wrapper instead of editing it, keeping the vendored components/ui folder healthy when add rewrites the stylesheet or reverts edits, the theme stylesheet with light and dark tokens, Arabic and Latin fonts, charts with Unovis, and the RTL gaps of the registry. Triggers include "shadcn", "shadcn-vue add", "shadcn-vue init", "components.json", "Reka UI", "dark mode tokens", "new Vue project UI setup", «ثبّت shadcn», «مكونات الواجهة», «الوضع الغامق», «اتجاه RTL», «ابدأ مشروع Vue».
metadata:
  summary: "shadcn-vue setup with a ready theme, wrappers, charts and RTL fixes."
  tags: vue, ui
---

# shadcn-vue

**Read when:** starting a project with shadcn-vue, adding or updating a component, styling with its
tokens, or a registry component misbehaves (wrong side in Arabic, styles lost after `add`).
**Owns:** the CLI, what `init` writes, the day-one install, composition rules, and the map of where
the catalogue, the vendored folder, the theme, charts and RTL are covered.

shadcn-vue copies component source into your project (`components/ui/`), built on **Reka UI** and
**Tailwind 4**. You own the files, but the CLI can still overwrite them. CLI facts below were checked
against shadcn-vue 2.8.2 and shadcn-vue.com/docs (checked 2026-11-03).

## TL;DR

- **Check the registry before styling a `div`.** `Button`, `Badge`, `Select`, `Separator`, `Empty`,
  `Alert`, `Skeleton` exist; a hand-built one misses focus, dark mode, RTL and keyboard handling.
- **Never hand-edit `components/ui/`.** Customise through a wrapper in `components/`, a `class` for
  layout, or a token. Why: the CLI rewrites those files, and an edit there is lost without warning.
- **Read `git diff` after every CLI run.** `add` can rewrite the stylesheet and revert a component.
- **Semantic tokens only** (`bg-background`, `text-muted-foreground`, `bg-primary/80`). Why: each token
  is redefined under `.dark`; a literal colour is right in one theme only.
- **Logical classes only** (`ms-`, `pe-`, `start-`, `text-start`). Turn `rtl` on in `components.json`
  when the app runs in Arabic.
- **One icon package**, the one `iconLibrary` names. Swap any other set a registry item brings.
- **Never pass `--overwrite` or run `apply` without the user's yes.** Both replace your component files.

## Start a project

| Stack | How |
|---|---|
| New Laravel app | `laravel new app --vue`: the Vue starter kit ships Inertia, TypeScript, Tailwind 4 and shadcn-vue already initialised |
| Existing Vite, Laravel, Nuxt or Astro app | `npx shadcn-vue@latest init` (`-t vite`, `-t laravel`, `-t nuxt` or `-t astro` skips the question) |
| Arabic as a main language | add `--rtl` to `init`, or set `"rtl": true` later and run `migrate rtl` (see [references/rtl.md](references/rtl.md)) |

Use the project's runner: `npx shadcn-vue@latest`, `pnpm dlx shadcn-vue@latest` or
`bunx --bun shadcn-vue@latest`. `create` is an alias of `init`.

Useful `init` flags (checked 2026-11-03): `--base-color` (neutral, gray, zinc, stone, slate),
`--style` (vega, nova, maia, lyra, mira, luma, sera), `--icon-library` (lucide, tabler, hugeicons,
phosphor, remixicon), `--font`, `--preset <name|code|url>`, `--rtl`, `--pointer` (pointer cursor on
buttons), `--no-reinstall`. `style`, `baseColor` and `cssVariables` cannot change after `init`
without reinstalling every component, so pick them first.

### What `init` writes

| File | What it holds |
|---|---|
| `components.json` (project root) | the CLI's config: style, stylesheet path, aliases, icon library, RTL |
| `<utils alias>.ts`, usually `lib/utils.ts` | the `cn()` helper |
| the stylesheet `tailwind.css` points at | Tailwind imports, the token variables for `:root` and `.dark`, the `@theme inline` mapping, a `@layer base` |
| `package.json` | `reka-ui`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, the icon package, and `shadcn-vue` itself for newer styles |

```json
{
  "$schema": "https://shadcn-vue.com/schema.json",
  "style": "reka-nova",
  "typescript": true,
  "tailwind": {
    "config": "",
    "css": "resources/css/app.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "rtl": true,
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "composables": "@/composables"
  },
  "registries": {}
}
```

- `tailwind.config` stays `""` on Tailwind 4. A path there is a leftover from Tailwind 3.
- `tailwind.css` is `resources/css/app.css` in Laravel, `assets/css/main.css` in Nuxt and
  `src/style.css` in Vite. Every token is defined in that one file.
- The aliases must also exist in `tsconfig.json` (`paths`). Why: the CLI writes imports with them,
  and the type checker and Vite resolve them from there.
- Newer styles import `shadcn-vue/tailwind.css` from the stylesheet (the `data-open:`,
  `data-checked:` state variants), so keep `shadcn-vue` in `package.json` at the version that
  generated your components.

```ts
// lib/utils.ts
import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

Then replace the stylesheet `init` wrote with [assets/app.css](assets/app.css) and put
[assets/fonts.css](assets/fonts.css) beside it: light and dark tokens, Arabic and Latin fonts, and
the unlayered fixes, ready to copy. [references/theme.md](references/theme.md) explains each part.

### Day one: one `add`

A typical app (sidebar shell, forms, tables, dialogs, toasts) installs this set on day one:

```bash
npx shadcn-vue@latest add alert alert-dialog avatar badge breadcrumb button card checkbox \
  dialog dropdown-menu empty field input input-group label popover select separator sheet \
  sidebar skeleton sonner spinner switch table tabs textarea tooltip
git diff                     # read the stylesheet hunk, put back anything it dropped
```

Add the rest when a screen needs it: `command` (searchable lists), `chart`, `pagination`,
`toggle-group`, `accordion`, `collapsible`, `calendar`, `progress`, `scroll-area`, `input-otp`.
Before adding, list `components/ui/`: re-adding an installed one is how edits get reverted.

In Nuxt the `shadcn-nuxt` module auto-imports the components; elsewhere import from
`@/components/ui/<name>`, which each folder's `index.ts` exports.

## Composition rules

The registry expects these shapes. Breaking one gives a console warning, a broken keyboard path or
an unlabelled dialog.

- **Items live in their group:** `SelectItem` in `SelectGroup`, `DropdownMenuItem` in
  `DropdownMenuGroup`, `CommandItem` in `CommandGroup`. `TabsTrigger` lives in `TabsList`, never
  directly in `Tabs`.
- **Every `Dialog`, `Sheet` and `Drawer` has a Title** (`class="sr-only"` if it should not show) and
  a Description. Why: screen readers announce them, and Reka warns without them.
- **`Avatar` always has `AvatarFallback`**, for when the image fails.
- **Use the whole `Card`:** title and description in `CardHeader`, actions in `CardFooter`.
- **Forms are `FieldGroup` > `Field`.** Mark an error with `data-invalid` on `Field` and
  `aria-invalid` on the control, so both the label and the control turn red.
- **A control inside an `InputGroup` is `InputGroupInput` / `InputGroupTextarea`**, never a plain
  `Input`. Why: the group draws one border and focus ring; a plain input draws a second.
- **`Button` has no loading prop.** Disable it and swap its icon for `<Spinner />` while busy.
- **An icon in a `Button` takes `data-icon="inline-start"` or `"inline-end"` and no size class.**
  The button sizes it per size; a `size-4` you add freezes it.
- **No manual `z-index`** on an overlay; they stack themselves.
- **Reka's `SelectItem` rejects an empty value.** Use a sentinel (`'all'`) and map it back to `''`.
- **A link styled as a button** takes `buttonVariants()` on the router link (Inertia `<Link>`,
  `<RouterLink>`, `<NuxtLink>`), never a `<Button>` wrapped in a link.

## Where each topic lives

| Working on… | Read |
|---|---|
| Which component for a need, layout classes, wrappers worth building | [references/catalogue.md](references/catalogue.md) |
| What `add` overwrites, updating a component, the reka-ui import rule, icons, customising through a wrapper | [references/vendored-folder.md](references/vendored-folder.md) |
| The stylesheet template, tokens, palette, radius, fonts (Arabic + Latin), dark mode, unlayered overrides, chart colours | [references/theme.md](references/theme.md) |
| A chart (Unovis): composition, y domain, types | [references/charts.md](references/charts.md) |
| Arabic: turning RTL on, registry gaps and their fixes | [references/rtl.md](references/rtl.md) |

## Before calling it done

1. `git diff` shows no change under `components/ui/` you did not mean, and the stylesheet kept its
   fonts and has one `@layer base`.
2. The type check passes (`vue-tsc --noEmit`, or `nuxi typecheck`).
3. The new screen looks right in light and dark, and in Arabic if the app has it.
