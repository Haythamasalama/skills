# Theme

**Read when:** you set up colours, change a token, add dark-mode values, swap the brand hue, pick fonts, or
style a chart.
**Owns:** the palette, `--ui-*` overrides, `app.config.ts` colours and component defaults, colour roles, chart
tokens, dark mode, fonts (Arabic and Latin), radius and spacing scale.

## TL;DR

- Copy [`../assets/main.css`](../assets/main.css) and [`../assets/app.config.ts`](../assets/app.config.ts) as
  they are. They give the quiet, flat look: light grey page, white cards with a thin border and no shadow, one
  green accent.
- Components use tokens only. A colour without a token gets a new token, in `:root` **and** `.dark`, first.
- The palette is 11 shades in `@theme static`; `ui.colors.primary` names it.
- Primary is shade 600 in light, 400 in dark: buttons and focus rings stay readable on both.

## Where each part lives

| File | Holds |
|---|---|
| `app/assets/css/main.css` | palette and fonts in `@theme static`, `--ui-*` overrides in `:root` / `.dark`, `--chart-*` tokens, RTL icon flips, page background |
| `app/app.config.ts` | `ui.colors` (which palette is `primary`, `neutral`) and component overrides |
| `nuxt.config.ts` | `fonts.families`, `app.head` `theme-color`, optional `ui.theme.colors` and `colorMode` |

## The look, value by value

| Token | Light (`:root`) | Dark (`.dark`) | Why |
|---|---|---|---|
| `--ui-primary` | `sage-600` `#317455` | `sage-400` `#62ab85` | contrast on white and on near-black |
| `--ui-radius` | `0.375rem` | same | Nuxt UI's default is `0.25rem`; slightly softer controls |
| `--ui-border` | `#ececec` | `neutral-800` | thinner-looking than the default `neutral-200` |
| `--ui-bg-muted` (also the page) | `#f8f8f7` | `#121212` | a warm grey page under white `bg-default` cards |
| `--chart-bar` / `--chart-track` | `#2f9468` / `#e6f2eb` | `#46a77a` / `#1c2a23` | one strong hue for marks |
| `--chart-2` / `--chart-3` | `#3a6fc4` / `#c98a1b` | `#6b98e0` / `#dca545` | blue and amber stay apart from green |

Every other `--ui-*` token keeps Nuxt UI's default, on the `neutral` scale. Defaults, checked 2026-11-03
(ui.nuxt.com/docs/getting-started/theme/css-variables): `--ui-bg` white / `neutral-900`, `--ui-bg-elevated`
`neutral-100` / `neutral-800`, text from `--ui-text-dimmed` `neutral-400` to `--ui-text-highlighted`
`neutral-900` (white in dark).

## The palette: "sage"

| 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|
| `#f1f8f4` | `#ddefe5` | `#bddfcc` | `#91c8aa` | `#62ab85` | `#418f69` | `#317455` | `#295d46` | `#234b3a` | `#1e3e31` | `#0f231b` |

- All 11 shades are required; Nuxt UI builds `--ui-color-primary-50 … 950` from them.
- `@theme static`, not `@theme`: plain `@theme` emits only variables a utility class uses, and Nuxt UI reads the
  palette through `var()` at runtime, so the colour silently disappears. The same holds for any variable read
  from JavaScript or inline SVG.
- Neutral is Nuxt UI's `neutral` (pure grey). Nuxt UI's own default is `slate` (checked 2026-11-03); `neutral`
  sits better next to a green.

### Swap the hue

1. Replace the 11 `--color-sage-*` lines with the new scale under a new name (`--color-brand-*`), or delete the
   block and use a Tailwind palette by name (`primary: 'indigo'`).
2. Set `ui.colors.primary` to that name in `app.config.ts` (and in a second app's copy).
3. Keep 600 / 400 for `--ui-primary`; if the new 600 fails 4.5:1 on white, use 700.
4. Retune `--chart-bar` and `--chart-track` to the new hue (more chroma than 600), and pick `--chart-2/3` far from
   it on the wheel.
5. Update `theme-color` in `nuxt.config.ts` to the new 600.
6. Pick a neutral whose temperature matches: `stone` for warm hues, `zinc` or `slate` for cool ones.

### More semantic colours

Defaults: `primary`, `secondary`, `success`, `info`, `warning`, `error`, plus `neutral` (checked 2026-11-03).
To add `tertiary`: list it in `nuxt.config.ts` `ui.theme.colors`, then assign it in `app.config.ts`
`ui.colors.tertiary`. A shorter list shrinks the CSS; keep `error`, forms use it.

## Tokens and their classes

| Group | Classes | Use |
|---|---|---|
| Text | `text-highlighted` · `text-default` · `text-toned` · `text-muted` · `text-dimmed` · `text-inverted` | titles and values · body · labels · secondary lines · hint icons, placeholders, `—` · on solid fills |
| Surface | `bg-default` · `bg-muted` · `bg-elevated` · `bg-accented` · `bg-inverted` | cards, panels · page, quiet insets · hover and the selected nav item · pressed or strong fill |
| Border | `border-default` · `border-muted` · `border-accented` | card edges and dividers (`divide-default`) · faint lines · a stronger rule |
| Colour | `text-primary`, `bg-primary/10`, `ring-primary`, `bg-(--chart-bar)` | accents and chart marks |

No hex values and no palette classes (`text-green-600`, `bg-sage-500`) in a component. Hex values belong in
`main.css` only.

## Component defaults (app.config.ts)

The only global override is flat cards: `card: { slots: { root: 'shadow-none' } }`. The source of truth is
[`../assets/app.config.ts`](../assets/app.config.ts).

- Overrides mirror the component's theme object (`slots`, `variants`, `compoundVariants`, `defaultVariants`) and
  are merged with tailwind-merge. A slot given as a function replaces the defaults instead (checked 2026-11-03,
  ui.nuxt.com/docs/getting-started/theme/components).
- One instance: the `:ui` prop (slots) or `class` (root). Both beat the global config.
- Prefer one global default over the same `class` on every instance; after changing a `defaultVariants`, search
  for components that relied on the old one.

## Colour roles

- **Primary** marks the main action of an area and selected controls. One solid primary button per area.
- **Neutral** is everything else: secondary buttons `color="neutral" variant="outline"`, toolbar icons
  `variant="ghost"`, count badges.
- **Status colours** (`success`, `warning`, `error`, `info`) mean a status, never decoration. Map domain states in
  one helper so every screen agrees:

  ```ts
  // app/utils/labels.ts
  export type Tone = 'success' | 'warning' | 'error' | 'neutral' | 'primary' | 'info'

  const INVOICE_STATUS: Record<string, { tone: Tone, icon: string }> = {
    PAID: { tone: 'success', icon: 'i-lucide-circle-check' },
    DUE: { tone: 'warning', icon: 'i-lucide-clock' },
    OVERDUE: { tone: 'error', icon: 'i-lucide-circle-x' },
    VOID: { tone: 'neutral', icon: 'i-lucide-ban' },
  }

  export function statusOf(status: string): { label: string, tone: Tone, icon: string } {
    const style = INVOICE_STATUS[status] ?? { tone: 'neutral', icon: 'i-lucide-circle' }
    return { label: tOr(`status.${status}`, status), ...style }
  }
  ```

- Badge: `<UBadge :color="tone" variant="subtle" :icon :label class="rounded-full" />`; a missing value is
  `<span class="text-dimmed">—</span>`.
- Icon tile in a card: `grid size-10 place-items-center rounded-lg border border-default bg-muted text-toned`
  (`text-primary` in a feature grid).
- Avatar with an icon fallback: `:ui="{ root: 'bg-primary/10', icon: 'size-4.5 text-primary' }"`.

## Charts

- Use the chart tokens with Tailwind's variable syntax: `bg-(--chart-bar)` on `bg-(--chart-track)`, or
  `:style="{ background: 'var(--chart-2)' }"` for a series colour held in data.
- A new series gets its own token in both modes and a contrast check against `--ui-bg`. Never borrow a status
  colour for a series.
- Markup and sizes: [components.md](components.md#charts).

## Dark mode

- Nuxt UI enables `@nuxtjs/color-mode`, which puts `.dark` on `<html>`. Dark values go under `.dark`.
- Toggle: `<UColorModeButton />` (also `UColorModeSwitch`, `UColorModeSelect`), wrapped in a `UTooltip`.
- Start dark: `colorMode: { preference: 'dark', fallback: 'dark' }`. Manage it yourself: `ui: { colorMode: false }`.
- An image per mode: two `<img>`, `class="dark:hidden"` and `class="hidden dark:block"`.
- Test with the app's toggle. Swapping the class in devtools leaves color-mode's own state half switched.

## Fonts

- `IBM Plex Sans Arabic` is `--font-sans` for Arabic **and** Latin; one family keeps mixed lines even.
  `IBM Plex Mono` is `--font-mono` for IDs, codes, versions and editors.
- Loading: `@nuxt/fonts` (bundled with Nuxt UI) downloads what `fonts.families` lists at build time and serves it
  from the app, so there is no font CDN request at runtime. Families, weights and subsets are in
  [`../assets/nuxt.config.ts`](../assets/nuxt.config.ts).
- `subsets: ['arabic', 'latin']` is required; the default skips Arabic.
- List every weight you use (400, 500, 600, 700); a missing one is faked or falls back.
- Other families that cover both scripts: Noto Sans Arabic, Readex Pro, Tajawal. Or an Arabic face next to a
  Latin one, the Arabic `@font-face` limited with `unicode-range` so Latin keeps its own face.
- Arabic typesetting (line height, letter spacing, case): [i18n-rtl.md](i18n-rtl.md#arabic-type).
- `tabular-nums` on any column or axis of numbers.

## Radius and spacing scale

| Element | Value |
|---|---|
| controls | `--ui-radius: .375rem` |
| cards, table cards, chart cards | `rounded-xl` |
| main panel, auth card, screenshot frames | `rounded-2xl` |
| icon tiles, nav items | `rounded-lg` |
| badges, footer pill, avatars | `rounded-full` |
| card padding | `p-5` |
| main panel padding | `p-4 sm:p-6 lg:p-8` |
| between sections / in card grids | `space-y-6` / `gap-4` |

Shadows: none, except `hover:shadow-md` on a card that opens something and `shadow-xs` on a floating chip.
