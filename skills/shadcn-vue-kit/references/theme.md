# Theme

**Read when:** reaching for a colour, radius or font, setting up the stylesheet, switching the
palette, or anything to do with dark mode.
**Owns:** the token rules, the two palettes, radius, fonts for Arabic and Latin, dark mode, the
unlayered overrides, the chart colour ramp, adding a token. The copy-ready files are
[../assets/app.css](../assets/app.css) and [../assets/fonts.css](../assets/fonts.css).

## TL;DR

- One stylesheet (the one `components.json` names) defines every token. Nothing else defines a colour.
- **Never write a colour.** Semantic tokens only; a shade in between is an alpha of a token.
- The palette is neutral with one hue, and that hue lives in the chart ramp (or in `--primary`, for
  the accent palette). Status chips get their own tone tokens.
- `--font-sans` lives in a plain `@theme`, never `@theme inline`, so `[lang='ar']` can override it.
- Fonts are self-hosted in `fonts.css`, not a Google Fonts `@import` in the main stylesheet.
- Overrides that must beat Tailwind or a library go **unlayered** at the foot of the file.

## The one rule: tokens, not colours

No `bg-blue-500`, no `#1f2937`, no `bg-[#0b0f19]`. Each token is redefined under `.dark`; a literal
is right in one theme and wrong in the other.

| You mean | Write |
|---|---|
| page background, body text | `bg-background`, `text-foreground` |
| a panel on the page | `bg-card` / `text-card-foreground` |
| a quiet caption, a quiet fill | `text-muted-foreground`, `bg-muted` |
| a hover or active surface | `bg-accent` / `text-accent-foreground` |
| the main action | `bg-primary text-primary-foreground` |
| a second action | `bg-secondary text-secondary-foreground` |
| danger | `text-destructive`, `bg-destructive/10` |
| any hairline, a field's edge | `border-border` (or `border`), `border-input` |
| a focus ring | `ring-ring/50` |

A shade in between is an alpha (`bg-primary/80`, `ring-destructive/20`), never a new colour. If no
token seems to fit, you are almost always reaching for the wrong one.

## The stylesheet, part by part

[../assets/app.css](../assets/app.css) is ordered so each part does one job:

1. **Imports:** `tailwindcss`, `./fonts.css`, `tw-animate-css` (the registry's enter/exit
   animations), `vue-sonner/style.css` (the toaster's own CSS, needed since vue-sonner 2), and
   `shadcn-vue/tailwind.css` (state variants such as `data-open:` that newer styles use).
2. **`@custom-variant dark`:** dark mode follows a `.dark` class, not the system setting directly.
3. **`@theme`:** the font stack, kept out of `inline` (see Fonts).
4. **`@theme inline`:** maps each `--x` variable to a `--color-x` utility (`bg-x`, `text-x`) and
   derives the radius scale. `inline` makes the utility read the variable at use time, which is what
   lets `.dark` swap it.
5. **`:root` and `.dark`:** the values. `color-scheme` sits there too, so scrollbars, native
   selects, date inputs and autofill follow the theme; without it a dark page keeps a white scrollbar.
6. **`@layer base`:** border colour, outline colour, body colours and font.
7. **Unlayered overrides** at the foot (see below).

`init` writes its own version of this file; replace it with the asset after `init`, keeping any
`@source` lines your framework needs (Laravel scans its Blade root view).

## Palettes

Both start from shadcn's `neutral` base. Pick one per app.

**Neutral (the default, in the asset).** `--primary` is near-black in light and near-white in dark,
so the main action, the active nav row and the focus ring carry weight without a hue. The one hue
is the chart ramp, five steps from light to deep (`--chart-1 … --chart-5`).

**Accent.** Same neutrals, but `--primary` and `--ring` carry one brand hue. A blue example:

| Token | Light | Dark |
|---|---|---|
| `--primary`, `--ring`, `--sidebar-primary` | `hsl(219 100% 50%)` | `hsl(216 100% 68%)` |
| `--primary-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 3.9%)` |

- The accent is **deeper in light than in dark**, and `--primary-foreground` inverts with it. Why: one
  value cannot carry white text on a white page and dark text on a black one.
- With an accent palette, use distinct hues for the chart ramp (the stock shadcn chart values) so a
  series does not look like a button.
- `hsl()` and `oklch()` both work; keep one format per file so values compare at a glance.

## Status tones

A status is the one thing a reader scans rather than reads, so it may carry a hue. Define a small
set of tone tokens (`--tone-green`, `--tone-blue`, …) in `:root`, lift them in `.dark`, expose them
in `@theme inline`, and let **one** component map a status to a tone (see the wrapper example in
[vendored-folder.md](vendored-folder.md)). Why: when the meaning of a status changes, one file changes.

To add any token (a `--warning`, a tone): define it and its `-foreground` in `:root` **and**
`.dark`, then add `--color-warning: var(--warning);` to `@theme inline`. Then `bg-warning` works.

## Radius

One knob: `--radius` (`0.625rem` in the asset). `--radius-sm/md/lg/xl` derive from it. Use
`rounded-md`, `rounded-lg`, never a pixel value, or that corner stops following the knob. Newer
`init` output derives the scale by multiplying (`sm` 0.6×, `xl` 1.4×) instead of subtracting; either
is fine, just keep the one you started with (checked 2026-11-03).

## The sidebar shell

`<Sidebar collapsible="icon" variant="inset">` makes the page a rounded panel floating on the
shell, entirely from the vendored sidebar; never rebuild it by hand. It reads as floating only while
`--sidebar` is a step darker than `--card` in light (the asset uses `oklch(0.968 0 0)`); the dark
values already invert.

## Fonts: Arabic and Latin

One design in two scripts, so Latin inside an Arabic line sits on the same skeleton: Noto Sans for
Latin and Noto Sans Arabic for Arabic. Any pair drawn as one family works the same way.

```css
@theme {
    --font-sans: 'Noto Sans', 'Noto Sans Arabic', ui-sans-serif, system-ui, sans-serif;
}

:root[lang='ar'] {
    --font-sans: 'Noto Sans Arabic', 'Noto Sans', ui-sans-serif, system-ui, sans-serif;
}
```

- **`--font-sans` lives in a plain `@theme`.** `inline` bakes the literal into the `font-sans`
  utility, so the Latin stack is frozen onto every element and the `[lang='ar']` override never
  reaches it.
- **Self-host the faces** in `fonts.css` with `unicode-range`. Why: `add` rewrites Google Fonts
  imports in the main stylesheet ([vendored-folder.md](vendored-folder.md#what-the-cli-writes)),
  and a build that fetches fonts fails when that host is unreachable.
- **Under `[lang='ar']`, no tracking and no uppercase.** Letter-spacing breaks joined letters and
  Arabic has no case. The asset resets both unlayered, so `tracking-*` and `uppercase` lose.

## Dark mode

`.dark` on `<html>`, set by an appearance composable with three choices (light · dark · system) and
remembered in a cookie or `localStorage`. The Laravel Vue starter kit ships one (`useAppearance`).
Set the class in an inline script in the root HTML before the app mounts, or the page flashes light.

You write no `dark:` colour utilities: the token swap does it. `dark:` is for the rare case where a
whole treatment changes, and the registry already carries those. If something looks wrong in dark,
fix the token's `.dark` value, not the call site.

## Unlayered overrides, and why

Tailwind's utilities live in a cascade layer. An **unlayered** rule beats every layered one,
whatever the specificity, so the few rules that must win go at the foot of the stylesheet:

1. **vue-sonner's font.** Its stylesheet is unlayered and sets its own font stack, so a `font-sans`
   class on `<Toaster>` loses. The override puts toasts back on `--font-sans`.
2. **Arabic tracking and case** (Fonts above).
3. **Registry direction gaps:** sheet edge, alert-dialog header alignment, switch thumb. The why for
   each is in [rtl.md](rtl.md).

Add to this block only what cannot be said with a token or a `class`.

## Chart colours

`--chart-1 … --chart-5` are defined in `:root` and again in `.dark`, so a series reads on both.

- One series takes `var(--chart-1)`; several take consecutive steps.
- With the neutral palette, never colour a series with `--primary`: a bar the same black as the
  main button reads as part of the interface, not as data.
- A single-hue ramp suits one measure or ordered groups; unrelated categories need distinct hues.

## After any `add`

The CLI can rewrite this file. What it changes and how to check is in
[vendored-folder.md](vendored-folder.md).
