# Theme

Colours, tokens, component defaults, dark mode, fonts and chart colours for Nuxt UI 4 on Tailwind CSS 4.
Checked 2026-10-27.

## Where each part lives

| File | Holds |
|---|---|
| `app/assets/css/main.css` | the palette (`@theme static`), fonts (`--font-sans`, `--font-mono`), overridden `--ui-*` tokens for light (`:root`) and dark (`.dark`), extra tokens such as `--chart-*`, RTL icon flips |
| `app/app.config.ts` | `ui.colors` (palette per semantic colour) and component theme overrides (`slots`, `variants`, `compoundVariants`, `defaultVariants`) |
| `nuxt.config.ts` | `ui.theme.colors` (which semantic colours exist), `fonts.families`, `colorMode` options |

Components only use the semantic classes and the `color` prop. When a component needs a colour that has no token,
add a token in both modes first.

## A brand palette

Declare all 11 shades. Nuxt UI builds `--ui-color-primary-50 ... 950` from them.

```css
@theme static {
  --color-sage-50: #f1f8f4;
  --color-sage-100: #ddefe5;
  --color-sage-200: #bddfcc;
  --color-sage-300: #91c8aa;
  --color-sage-400: #62ab85;
  --color-sage-500: #418f69;
  --color-sage-600: #317455;
  --color-sage-700: #295d46;
  --color-sage-800: #234b3a;
  --color-sage-900: #1e3e31;
  --color-sage-950: #0f231b;
}
```

```ts
// app/app.config.ts
export default defineAppConfig({
  ui: { colors: { primary: 'sage', neutral: 'neutral' } },
})
```

- `@theme static` emits every variable. Plain `@theme` emits only variables some utility class uses, and Nuxt UI
  reads the palette through `var()` at runtime, so the palette silently disappears.
- The same rule applies to any variable read from JavaScript or inline SVG: put it in `@theme static` or in `:root`.
- Override a Tailwind palette by redefining its shades (`--color-green-500: ...`) in the same block.
- `neutral` choices: `slate`, `gray`, `zinc`, `neutral`, `stone`. Pick one whose grey matches the brand's warmth.

### More semantic colours

The defaults are `primary`, `secondary`, `success`, `info`, `warning`, `error` (plus `neutral`). To add one,
register it, then assign it:

```ts
// nuxt.config.ts
ui: { theme: { colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'] } }

// app/app.config.ts
ui: { colors: { primary: 'sage', tertiary: 'indigo' } }
```

Trimming the list to the colours in use shrinks the CSS. Keep `error`: forms use it.

## Nuxt UI tokens

| Group | Tokens | Classes |
|---|---|---|
| Text | `--ui-text-dimmed`, `--ui-text-muted`, `--ui-text-toned`, `--ui-text`, `--ui-text-highlighted`, `--ui-text-inverted` | `text-dimmed`, `text-muted`, `text-toned`, `text-default`, `text-highlighted`, `text-inverted` |
| Surface | `--ui-bg`, `--ui-bg-muted`, `--ui-bg-elevated`, `--ui-bg-accented`, `--ui-bg-inverted` | `bg-default`, `bg-muted`, `bg-elevated`, `bg-accented`, `bg-inverted` |
| Border | `--ui-border`, `--ui-border-muted`, `--ui-border-accented`, `--ui-border-inverted` | `border-default`, `border-muted`, `border-accented`, `border-inverted` (also `divide-*`, `ring-*`) |
| Colour | `--ui-primary`, `--ui-secondary`, `--ui-success`, ... | `text-primary`, `bg-primary/10`, `ring-primary` |
| Shape | `--ui-radius` | drives `rounded-*` inside components |

How they read in practice:

- `text-highlighted` for titles and values, `text-default` for body, `text-toned` for labels, `text-muted` for
  secondary lines, `text-dimmed` for hint icons and placeholders.
- `bg-default` for cards and panels, `bg-muted` for the page or a quiet inset, `bg-elevated` for hover and the
  selected nav item (`hover:bg-elevated/70`), `bg-accented` for a pressed or strong fill.

### Overriding them

A quiet, flat look: light grey page, white cards, thin borders, one accent.

```css
:root {
  --ui-radius: 0.375rem;
  --ui-primary: var(--ui-color-primary-600);
  --ui-border: #ececec;
  --ui-bg-muted: #f8f8f7;   /* also the page background */
}

.dark {
  --ui-primary: var(--ui-color-primary-400);
  --ui-border: var(--ui-color-neutral-800);
  --ui-bg-muted: #121212;
}

html,
body {
  background-color: var(--ui-bg-muted);   /* no white strip on overscroll or short pages */
}
```

- Primary at shade 600 in light and 400 in dark keeps buttons and focus rings readable on both.
- Hex values are fine **here**, in the token file. Nowhere else.

## Component defaults in app.config.ts

The override mirrors the component's theme object and is merged with `tailwind-merge`.

```ts
export default defineAppConfig({
  ui: {
    card: { slots: { root: 'shadow-none' } },
    button: {
      slots: { base: 'font-medium' },
      defaultVariants: { color: 'neutral', variant: 'outline' },
    },
  },
})
```

- One instance only: the `:ui` prop, for example
  `<UTable :ui="{ th: 'py-2.5 text-xs font-medium whitespace-nowrap text-muted', td: 'py-3.5' }">`.
- Prefer one global default over the same `class` on every instance.
- Changing `defaultVariants` changes every use in the app. Search for components that relied on the old default.

## Colour roles

- **Primary** marks the main action of a screen and the selected state of controls. One solid primary button per area.
- **Neutral** is for everything else: secondary buttons (`color="neutral" variant="outline"`), toolbar icons
  (`variant="ghost"`), counts in tab badges.
- **Status colours** (`success`, `warning`, `error`, `info`) mean a status. Keep the mapping in one helper:

  ```ts
  export type Tone = 'success' | 'warning' | 'error' | 'neutral'

  export function statusOf(status: string): { label: string, tone: Tone, icon: string } { /* ... */ }
  ```

  Do not use them for decoration.
- Badges: `<UBadge :color="tone" variant="subtle" :icon :label class="rounded-full" />`.
- Icon tiles in cards: `rounded-lg border border-default bg-muted text-toned`, or `text-primary` for a feature grid.
- Avatars with an icon fallback: `:ui="{ root: 'bg-primary/10', icon: 'size-4.5 text-primary' }"`.

## Charts

- Chart marks need more chroma than a soft UI accent to stay distinct for colour-blind readers. Give them their own
  tokens:

  ```css
  :root { --chart-bar: #2f9468; --chart-track: #e6f2eb; }
  .dark { --chart-bar: #46a77a; --chart-track: #1c2a23; }
  ```

- Use them with Tailwind's variable syntax: `bg-(--chart-bar)`, `bg-(--chart-track)`.
- One series, one hue. A second series gets its own token in both modes and a contrast check against `--ui-bg`.
  Never borrow a status colour for a series.
- Bars: rounded tops (`rounded-t-[4px]`), `max-w-6`, a 2px minimum height for non-zero values, three gridlines
  (0, half, a rounded top).
- Axis labels: `text-[11px] text-muted tabular-nums`, and `dir="ltr"` on the numeric axis.
- Add an `sr-only` `<table>` with the same data and a `<caption>`.

## Fonts

- `@nuxt/fonts` downloads the families listed in `nuxt.config.ts` at build time and serves them from the app, so
  there is no request to a font CDN at runtime.
- List every weight you use. A missing weight falls back to faux bold or to the system font.
- Set `--font-sans` and `--font-mono` in `@theme static`.
- Arabic (the subset `@nuxt/fonts` skips, one family or two): [Fonts for Arabic](i18n-rtl.md#fonts-for-arabic).
- `font-mono` for IDs, codes, version numbers and code editors. Add `tabular-nums` to columns of numbers.

## Dark mode

- Nuxt UI turns on `@nuxtjs/color-mode`; it adds `.dark` or `.light` to `<html>`. Dark tokens go under `.dark`.
- Toggle: `<UColorModeButton />` (also `UColorModeSwitch`, `UColorModeSelect`). Wrap it in a `UTooltip`.
- Default to dark: `colorMode: { preference: 'dark', fallback: 'dark' }` in `nuxt.config.ts`.
- Handle it yourself: `ui: { colorMode: false }`.
- Images per mode: two `<img>` tags, `class="dark:hidden"` and `class="hidden dark:block"`.
- Test with the app's own toggle. Swapping the class by hand in devtools leaves color-mode state half-switched.

## Radius and spacing that worked

- `--ui-radius: .375rem` for controls. Cards `rounded-xl`, the main panel and auth card `rounded-2xl`,
  icon tiles `rounded-lg`, badges `rounded-full`.
- Page padding `p-3` around the shell, `p-4 sm:p-6 lg:p-8` inside the main panel, `space-y-6` between sections,
  `gap-4` in card grids, `p-5` inside cards.
- Marketing sections: `mx-auto max-w-6xl px-4 sm:px-6 py-20`, headings `text-3xl font-semibold tracking-tight
  text-balance`, intro `text-pretty text-muted`, alternating `bg-muted` and `bg-default` bands with
  `border-y border-default`.

## Checklist

- [ ] `grep -rnE "#[0-9a-fA-F]{3,8}\b|(text|bg|border)-(red|green|blue|gray|sage)-[0-9]" app/components` is empty.
- [ ] Every new token has a light and a dark value.
- [ ] New text and mark colours pass contrast in both modes.
- [ ] Looked at in light and dark, both languages, phone width.
