---
name: shadcn-vue
description: Use when installing, adding, theming or fixing shadcn-vue components in any Vue 3 project (Laravel + Inertia, Vite, Nuxt) — running the CLI (init, add, --rtl, components.json), choosing the registry component for a need instead of a styled div, composition rules (items in groups, dialog titles, whole cards), house wrappers, keeping the vendored components/ui folder healthy when `add` rewrites the stylesheet or reverts edits, design tokens and dark mode with Tailwind 4, fonts for Arabic and Latin, charts with Unovis, and the RTL gaps of the registry. Triggers include "shadcn", "shadcn-vue add", "components.json", "Reka UI", "dark mode tokens", «ثبّت shadcn», «مكونات الواجهة», «الوضع الغامق», «اتجاه RTL».
---

# shadcn-vue

**Read when:** setting up shadcn-vue, adding a component, styling with its tokens, or a registry
component misbehaves (wrong side in Arabic, lost styles after `add`).
**Owns:** the CLI, the component catalogue and composition rules, the vendored folder, theme tokens,
fonts, dark mode, charts, and RTL fixes for the registry.

shadcn-vue copies component source into your project (`components/ui/`), built on Reka UI and
Tailwind 4. You own the files; the CLI can still overwrite them. Facts checked 2026-11-03.

## TL;DR

- **Check the registry before styling a `div`.** `Button`, `Badge`, `Select`, `Separator`, `Empty`,
  `Alert`, `Skeleton` exist; a hand-built one misses focus, dark mode, RTL and keyboard handling.
- **Never edit `components/ui/`.** Wrap it in `components/`, pass `class` for layout, or change a token.
- **Read `git diff` after every `add`.** It can rewrite the stylesheet and silently revert edits to a
  component you already installed.
- **Semantic tokens only** (`bg-background`, `text-muted-foreground`, `bg-primary/80`). No literal colours.
- **Logical classes only** (`ms-`, `pe-`, `start-`, `text-start`). Generate the registry with `--rtl`
  when the app runs in Arabic.
- **One icon package** (the one chosen at `init`). Swap any other set a community component brings.

## Install

| Stack | How |
|---|---|
| New Laravel app | `laravel new app` and pick the Vue starter kit: Inertia, Vue, TypeScript, Tailwind and shadcn-vue come configured |
| Existing Vite, Laravel or Nuxt app | `npx shadcn-vue@latest init` (`-t vite`, `-t laravel` or `-t nuxt` to skip the question) |
| Arabic as a main language | add `--rtl` to `init`, or set `"rtl": true` in `components.json` |

`init` writes `components.json`, the `cn()` helper in `lib/utils`, and the CSS variables in the main
stylesheet. Useful `init` options: `--base-color` (neutral, zinc, slate, …), `--icon-library` (lucide
by default), `--style`.

```bash
npx shadcn-vue@latest add button card dialog dropdown-menu input field sonner
git diff -- resources/css/app.css   # or your stylesheet: put back anything it dropped
```

In Nuxt, the `shadcn-nuxt` module auto-imports the components; elsewhere import them from
`@/components/ui/<name>`.

## Composition rules

- Items live in their group: `SelectItem` → `SelectGroup`, `DropdownMenuItem` → `DropdownMenuGroup`,
  `CommandItem` → `CommandGroup`. `TabsTrigger` lives in `TabsList`.
- Every `Dialog`, `Sheet` and `Drawer` has a Title (`sr-only` if hidden) and a Description.
- `Avatar` always has `AvatarFallback`. Use the whole `Card` (header, content, footer).
- No manual `z-index` on overlays. Reka's `SelectItem` rejects an empty value: use a sentinel.
- `cn()` for conditional classes, `cva` for variants, `size-*` when width equals height.

## Where each topic lives

| Working on… | Read |
|---|---|
| Which component for a need, house wrappers, keeping `components/ui/` healthy | [references/components.md](references/components.md) |
| Colours, palette, radius, fonts, dark mode, unlayered overrides | [references/theme.md](references/theme.md) |
| A chart (Unovis), its colours, its y domain | [references/charts.md](references/charts.md) |
| Arabic: turning RTL on, registry gaps and their fixes | [references/rtl.md](references/rtl.md) |

## Before calling it done

1. `git diff` shows no change under `components/ui/` you did not mean, and the stylesheet kept its
   fonts and has one `@layer base`.
2. The type check passes (`vue-tsc --noEmit`, or `nuxi typecheck`).
3. The new component looks right in light and dark, and in Arabic if the app has it.
