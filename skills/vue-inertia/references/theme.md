# Theme

**Read when:** reaching for a colour, a radius, a font, a shadow, a card or shell style, or anything
about dark mode; or after running `shadcn-vue add`.
**Owns:** the token rules, the stylesheet in `assets/app.css`, the palette, radius, the shell and
card look, fonts, dark mode, the unlayered overrides, and the `shadcn-vue add` stylesheet warning.

## TL;DR

- Start from [`assets/app.css`](../assets/app.css): copy it to `resources/css/app.css`. It holds every
  token, the fonts, and the overrides below.
- Never write a colour. Semantic tokens only, because each is redefined under `.dark`.
- A shade in between is an alpha of a token (`bg-primary/80`), never a new colour.
- Change a token in `:root` and `.dark`; nowhere else.
- After every `shadcn-vue add`, read `git diff` on the stylesheet and put back what it dropped.

## The registry setup

`components.json` (checked 2026-11-03):

```json
{ "style": "reka-nova", "tailwind": { "baseColor": "neutral", "cssVariables": true }, "iconLibrary": "lucide", "rtl": true }
```

`rtl: true` makes the CLI write logical properties into `components/ui/`. Set it before the first
`add`; switching later means re-adding every component.

## Tokens

| You mean | Write |
|---|---|
| page background | `bg-background` |
| body text | `text-foreground` |
| a panel | `bg-card text-card-foreground` |
| a quiet caption | `text-muted-foreground` |
| a quiet fill, a table head | `bg-muted` |
| the main action | `bg-primary text-primary-foreground` |
| a second action | `bg-secondary text-secondary-foreground` |
| hover on a neutral surface | `bg-accent` |
| danger | `text-destructive`, `bg-destructive/10` |
| a status tone | `text-success`, `text-warning`, `text-info` with a `/12` fill (through `StatusBadge`) |
| a hairline | `border` (it resolves to `border-border`) |
| a focus ring | `ring-ring/50` |

No `bg-blue-500`, no `#1f2937`, no `bg-[#…]`. If a token for what you need does not seem to exist,
you are usually reaching for the wrong token. Check every new surface in light and dark before calling
it done.

## The palette

- **Neutral, black and white.** `--primary` is near-black in light and near-white in dark, and it
  marks only the main action, the active nav row and the focus ring, so nothing else competes for
  attention.
- **Three status hues** (`--success`, `--warning`, `--info`) plus `--destructive`, each lifted in
  dark mode so the same chip stays legible on both. Nothing else reaches for a hue.
- **The chart ramp** (`--chart-1 … --chart-5`) is five steps of one warm hue, defined in `:root` and
  again in `.dark`, so a series reads on both themes. One series uses `var(--chart-1)`.
- A brand accent, if the app has one, replaces `--primary` (and `--ring`) in both blocks; keep it
  deeper in light than in dark so `--primary-foreground` can invert with it.

## Radius, cards and surfaces

- **One knob:** `--radius: 0.625rem`; `--radius-sm/md/lg/xl` derive from it. Write `rounded-lg`,
  never a pixel value, or that corner stops following the knob.
- **A card** is the registry's: `rounded-xl bg-card ring-1 ring-foreground/10`, `py-4 gap-4`,
  `text-sm`. A card that holds a table drops its padding (`class="py-0"`).
- **A table head** sits on `bg-muted`, and its row has no hover (`hover:bg-transparent`).
- **A sensitive card** (`DangerZone`) is `ring-destructive/25` with a `bg-destructive/5` footer.
- No `border` plus `shadow-md` stacks on surfaces: the ring is the edge.

## The shell

`<Sidebar collapsible="icon" variant="inset">` makes the page a rounded panel floating on the shell,
entirely from the vendored sidebar; never rebuild it by hand. It reads as floating only while
**`--sidebar` stays darker than `--card`**: with `inset`, the wrapper takes `bg-sidebar` and the panel
`bg-background`. In light mode that is `--sidebar: oklch(0.968 0 0)`, a step below white; the dark
values already invert it.

The rest of the shell's values (header `h-16 border-b px-4`, content `flex flex-1 flex-col gap-4 p-4`,
the toaster) are in [blueprint.md](blueprint.md#layouts).

## Fonts

One design in two scripts, so Latin inside an Arabic line sits on the same skeleton: Noto Sans and
Noto Sans Arabic.

```css
@theme {
    --font-sans: 'Noto Sans', 'Noto Sans Arabic', sans-serif;
}

:root[lang='ar'] {
    --font-sans: 'Noto Sans Arabic', 'Noto Sans', sans-serif;
}
```

- **`--font-sans` lives in a plain `@theme`, not `@theme inline`.** `inline` bakes the literal into
  the `font-sans` utility, which freezes the Latin stack onto every element, and the `[lang='ar']`
  override never reaches it.
- **Arabic is never tracked.** `letter-spacing` breaks the joins between letters, so the stylesheet
  resets it under `[lang='ar']`. Arabic has no case, so `uppercase` does nothing there.
- **Line height stays generous** (Tailwind's defaults or taller) on any text that can be Arabic:
  letters reach far below the baseline, and a tight line box with `truncate` or a fixed-height control
  cuts them.

## Dark mode

`.dark` on `<html>`, set by `useAppearance()` (light · dark · system) and written by the server from
the appearance cookie for the first paint. You write no `dark:` colour utilities: the token swap does
it. `dark:` is only for the rare case where a whole treatment changes, and then the fix is usually a
token with a dark value, not a class.

## Unlayered overrides

Tailwind's utilities live in a cascade layer, and an **unlayered** rule beats any layered one
whatever its specificity. The few overrides that must win over the registry or a third-party
stylesheet sit unlayered at the foot of `app.css`:

1. **vue-sonner's font.** Its stylesheet sets its own font stack and is imported unlayered, so a
   `font-sans` class on `<Toaster>` loses. The override puts toasts back on `--font-sans`.
2. **Registry direction gaps** (sheet edge, alert-dialog header alignment, switch thumb), explained
   in [rtl-and-bidi.md](rtl-and-bidi.md#registry-gaps).
3. **Arabic letter-spacing**, as above.

## Changing a token

Edit `:root` **and** `.dark` in `app.css`. Nothing else: not a component, not a page.

**`shadcn-vue add` rewrites the stylesheet.** Each install can re-emit the font import (dropping the
Arabic face from the stack), append its own `@layer base` (duplicating the base rules), or add CSS
variables. Read `git diff resources/css/app.css` after every `add` and put back what it took.
