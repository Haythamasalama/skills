# Theme

Colours, radius, fonts and dark mode. One stylesheet (`resources/css/app.css` in Laravel, `assets/css/main.css` in Nuxt, `src/style.css` in Vite) is the
only place a design token is defined.

## The one rule

**Never write a colour.** No `bg-blue-500`, no `#1f2937`, no `text-red-600`. Semantic tokens only,
because each is redefined under `.dark` and a literal is not.

| You mean | Write |
|---|---|
| page background | `bg-background` |
| body text | `text-foreground` |
| a panel on the page | `bg-card` / `text-card-foreground` |
| a quiet caption | `text-muted-foreground` |
| a quiet fill | `bg-muted` |
| the main action | `bg-primary text-primary-foreground` |
| a second action | `bg-secondary text-secondary-foreground` |
| danger | `text-destructive`, `bg-destructive/10` |
| any hairline | `border-border` (or `border`) |
| a focus ring | `ring-ring/50` |

A shade in between is an alpha of a token (`bg-primary/80`, `ring-destructive/20`), never a new
colour.

## The palette

A neutral base with **one accent hue**. `--primary` is the only thing that carries it: the main
action, the active nav row, the focus ring. Everything else is the neutral ramp, so the accent is
the only thing that asks for attention. (A panel can also run with no hue at all: primary black in
light and white in dark.)

- The accent is **deeper in light than in dark**: the same hue cannot carry white text on a white
  page and dark text on a black one, so `--primary-foreground` inverts with it.
- `--chart-1 … --chart-5` are five steps of the same hue, defined in `:root` and again in `.dark`,
  so a series reads on both themes (see `charts.md`).

## Radius

One knob: `--radius` (for example `0.625rem`). Everything else derives (`--radius-sm/md/lg/xl`).
Use `rounded-lg`, `rounded-md`, never a pixel value, or that corner stops following the knob.

## The shell

`<Sidebar collapsible="icon" variant="inset">` makes the page a rounded panel floating on the
shell, entirely from the vendored sidebar; never rebuild it by hand. It only reads as floating
while **`--sidebar` stays darker than `--card`**: with `inset`, the wrapper takes `bg-sidebar` and
the panel `bg-background`. In light mode that means `--sidebar` a step below white (for example
`oklch(0.968 0 0)`); the dark defaults already invert it.

## Fonts

One design in two scripts, so Latin inside an Arabic line sits on the same skeleton: for example
Noto Sans for Latin and Noto Sans Arabic for Arabic.

```css
@theme {
    --font-sans: 'Noto Sans', 'Noto Sans Arabic', sans-serif;
}

:root[lang='ar'] {
    --font-sans: 'Noto Sans Arabic', 'Noto Sans', sans-serif;
}
```

**`--font-sans` lives in a plain `@theme`, not `@theme inline`.** `inline` bakes the literal into
the `font-sans` utility, which freezes the Latin stack onto every element, and the `[lang='ar']`
override never reaches it.

Under `[lang='ar']`, set `letter-spacing: normal` on the elements that have tracking (not only on
`html`), and drop `text-transform: uppercase` from labels: spacing breaks joined letters, and
Arabic has no case.

## Dark mode

`.dark` on `<html>`, driven by an appearance composable (light · dark · system). You write no
`dark:` colour utilities: the token swap does it. `dark:` is only for the rare case where a whole
treatment changes, and the registry already carries those. Every new surface still gets checked
in dark.

## Unlayered overrides, and why

Tailwind's utilities live in a cascade layer. An **unlayered** rule beats any layered one,
whatever the specificity, so the few overrides that must win over the registry or a third-party
stylesheet go at the foot of the file, unlayered:

1. **vue-sonner's font.** Its stylesheet sets a font stack on the toaster and is imported
   unlayered, so a `font-sans` class on `<Toaster>` loses. The override puts toasts back on
   `--font-sans`.
2. **Registry direction gaps** (sheet edge, alert-dialog header alignment, switch thumb). See
   `rtl.md`.

## Changing a token

Edit `:root` **and** `.dark` in the stylesheet. Nothing else: not a component, not a page.

`shadcn-vue add` rewrites this file. Every install can re-emit the font import (dropping the Arabic
face) and append a duplicate `@layer base`. Read `git diff` on it after any `add` and put back what
it took.
