# Typography, layout and motion

**Read when:** you set fonts, size text, space a page, round a corner or animate anything.
**Owns:** the typefaces and how to load them, the type scale, page widths, spacing, radius, borders, tap targets,
and every duration, curve and animation.

Values match the site's components and `main.css` (checked 2026-11-03).

## TL;DR

- Geist for everything you read, Geist Mono for labels, dates and code, Instrument Serif italic for one phrase.
- Headings are 600 with negative tracking; body text is 15–17 px at line height 1.7; paragraphs stop at 70ch.
- One column: 880 px, 1040 px for wide pages, 720 px for long-form reading, 24 px side gutter.
- Flat cards: 1 px `line` border, radius 14–16 px, no shadows.
- One curve, `cubic-bezier(0.23, 1, 0.32, 1)`, 200 ms for colour changes. Everything stops under reduced motion.

## Typefaces

| Face | Weights | Use |
|---|---|---|
| Geist | 400, 500, 600 | headings and everything you read |
| Geist Mono | 400, 500 | eyebrows, dates, meta lines, badges, counts, repository names, code |
| Instrument Serif | 400 italic | one human phrase per page, usually with `.text-gradient` |
| Excalifont | 400 | labels inside diagrams only |

- Never another face. Arabic text is the one exception (below).
- `--font-serif` is the token name for Instrument Serif, as on the site.

### Loading the fonts

- The site self-hosts them from npm with Fontsource: the Geist and Geist Mono variable packages, and only the Latin
  400 italic file of Instrument Serif. No font service is called. The imports are in the Tailwind setup in
  [code.md](code.md#tailwind-css-4).
- A quick page can load the same three from Google Fonts; the `<link>` is in the plain HTML starter in
  [code.md](code.md#plain-html).
- The tokens file lists both family names (`"Geist Variable", "Geist"`), so either source works without edits.
- Excalifont is self-hosted from Excalidraw's font files with `font-display: swap`, Latin subset only.

### Arabic

Geist has no Arabic letters. Pair it with an Arabic face of similar weight (for example IBM Plex Sans Arabic) set
after Geist in `--font-sans`, so Latin words stay in Geist. Set `<html lang="ar" dir="rtl">`, use logical properties
(`ms-`, `pe-`, `text-start`), and wrap a Latin value inside Arabic text in `dir="ltr"`. The site itself is English
only, so check an Arabic page by eye before shipping it.

## Type scale

| Role | Size / line height | Weight, tracking | Colour |
|---|---|---|---|
| Display (brand page) | 44 px / 1.08 | 600, `-0.03em` | `fg`, a quiet second line in `faint` |
| Section page title | 34 px / 1.08, 46 px / 1.06 from 768 px | 600, `-0.03em`, max 720 px wide | `fg` |
| Page title | 28 px / 1.25, 30–32 px from 768 px | 600, `-0.02em`, `text-balance` on articles | `fg` |
| Card title | 17 px | 600, `-0.01em` | `fg` |
| Lead | 17 px / 1.7 | 400 | `soft` |
| Body, secondary | 15 px / 1.7 | 400 | `muted` |
| Card text | 14 px / 1.6 | 400 | `muted` |
| Nav links | 14 px | 400 | `muted`, hover and current `fg` |
| Filter chips, tech chips | 13 px | 400 | `muted` or `soft`, selected `fg` |
| Small, captions, footer | 13–13.5 px / 1.6 | 400 | `muted` or `faint` |
| Eyebrow (`.eyebrow`) | 12 px | Mono 500, uppercase, `0.08em` | `faint` |
| Meta line (date · category · time) | 12–13 px | Mono 400 | `faint` |
| Badge | 9.5–12 px | Mono, uppercase, `0.1em` | `.text-gradient` |
| Gradient word | about 1.3× the text around it (22 px in 17 px) | Instrument Serif italic | `.text-gradient`, `pr-0.5` so the italic is not clipped |

- Section titles on a page are eyebrows, numbered on the brand page (`01 · The signature`).
- Long-form text uses Tailwind Typography mapped to the tokens (see [code.md](code.md)).

## Page layout

| Item | Value |
|---|---|
| Page column | 880 px max, centred, 24 px side padding |
| Wide page (brand, project pages) | 1040 px max |
| Long-form reading (articles) | 720 px max |
| Running text | 70ch max (set on `main p` by the tokens file) |
| Page top | 64 px, 80–88 px from 768 px |
| Between sections | 72 px |
| Header | 16 px from the top, 28 px from 768 px |
| Footer | 96 px above it, `line` border on top, 28 px top and 40 px bottom padding |
| Project sections | each `h2` sits under a `line` rule, 56 px margin and 44 px padding above it |
| Side table of contents | 176 px column beside the text from 1024 px, sticky, a `line` rail with the current item in `fg` |

## Spacing, radius and borders

- Grids: `repeat(auto-fit, minmax(min(100%, 200px), 1fr))` with 12–16 px gaps; raise the minimum (220–320 px) for
  bigger tiles. **Why:** columns collapse on their own at phone widths with no breakpoints.
- Card padding 18–22 px; list rows 10 × 14 px.
- Borders are 1 px in `line`; hovered rows add `surface` fill and a `chip` border. Cards are flat: no drop shadows.
- Tap targets are at least 44 px (`min-h-11`, `size-11`). A smaller-looking control stretches its hit area with a
  `::before`.

| Radius | Where |
|---|---|
| 4 px | focus ring |
| 5–6 px | badges, copy button |
| 8 px | icon buttons, small rows |
| 10–12 px | brand-kit rows, figures, file tiles |
| 14–16 px | cards, swatches, social card previews |
| 22 px | hero frame |
| full | pills: filter chips, the contact link, tech chips, status lines |
| size ÷ 4 | logo tiles |
| about 22–23% | favicon and app icon (see [logo.md](logo.md)) |

## Motion

| What | Value |
|---|---|
| Colour, background and border changes | 200 ms, `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out-soft`) |
| Entrance (`.animate-rise`) | 0.7 s, `cubic-bezier(0.2, 0.7, 0.2, 1)`, from 8 px lower and transparent; stagger about 0.1 s per block |
| Live dot (`.animate-live`) | 2.2 s ease-out, infinite: an Iris ring grows to 9 px and fades |
| Arrow on "More about me →" links (`.go`) | moves 3 px right in 0.25 s |
| Mobile menu | overlay fades in 200 ms, out 150 ms; items drop 6 px over 0.32 s, 28 ms apart (`.menu-item`, `--i`) |
| Menu button | two lines turn into a cross in 300 ms |
| Portrait on the home page | hover tilts −3° and scales 1.04 in 0.3 s, with a 1.5 px `chip` ring |
| Copied state | holds 1.6 s, then returns |
| Signature | draws stroke by stroke (see [logo.md](logo.md)) |

- Under `prefers-reduced-motion: reduce`, every animation and hover movement stops; the tokens file does this for
  its own classes, and Tailwind transitions get `motion-reduce:transition-none`.
- Nothing loops except the live dot.
