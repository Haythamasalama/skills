# Colour

**Read when:** you pick any colour: a token for a page, a scale step, a gradient, a contrast check, a code or
diagram palette.
**Owns:** the Iris and Azure scales, the semantic light and dark tokens, gradients, where colour may go, the 95/5
rule, contrast ratios, the code-highlighting and diagram palettes.

Values match the site's `main.css` and `shared/code-theme.ts` (checked 2026-11-03). Every value here is also in
[`../assets/haythamasalama-brand-tokens.css`](../assets/haythamasalama-brand-tokens.css). Hex is the source of truth;
the OKLCH values are computed from it and rounded.

## TL;DR

- Ink first: black, white and space carry the page. Iris and Azure stay under 5% of any surface.
- Use the semantic tokens (`bg`, `fg`, `muted`, `line`...), never raw hex, in anything that has a theme.
- Hover, the current page and selected filters are neutral (`fg`, `surface`), never coloured.
- On white, coloured text and buttons with white text use step 600 or darker. **Why:** 500 is 3.5:1 or less on Paper.
- Gradients: `--gradient` for one word, badges and progress; `--gradient-signature` for hairlines and artwork.

## The two colours

| Name | Hex | OKLCH | Meaning |
|---|---|---|---|
| Iris 500 | `#7F7CF2` | `oklch(64.5% 0.172 281.6)` | the creative: the designer and video editor before the code |
| Azure 500 | `#4F9BFF` | `oklch(68.8% 0.166 256.2)` | the engineer: clear, calm, trusted with money |

**The 95/5 rule:** about 70% Ink, 25% white, greys and the signature, never more than 5% Iris + Azure.

## Semantic tokens

The site's theme tokens. Dark is the default (`:root` and `.dark`); `.light` on `<html>` switches.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `bg` | `#0B0B0C` Ink | `#FFFFFF` Paper | page |
| `surface` | `#131316` | `#F4F4F5` | tiles, hover fill, selected chip |
| `raised` | `#0F0F11` | `#FAFAFA` | figures, code blocks, hero frames |
| `line` | `#1F1F23` | `#E4E4E7` | borders, dividers, cards |
| `edge` | `#232328` | `#E4E4E7` | logo tile and copy button borders |
| `chip` | `#2A2A30` | `#D4D4D8` | pill borders, hover border, list bullets |
| `fg` | `#EDEDEF` | `#0B0B0C` | primary text, every hover target |
| `soft` | `#C4C4CC` | `#3F3F46` | lead and long-form body text |
| `muted` | `#A1A1AA` | `#52525B` | secondary text, idle links |
| `faint` | `#85858F` | `#6B6B74` | labels, dates, eyebrows, footer |
| `mark` | `#D4D4D8` | `#27272A` | icons and one-colour logos |
| `underline` | `#3F3F46` | `#D4D4D8` | link underline |
| `accent` | Azure 500 | Azure 600 | details |
| `accent-2` | Iris 500 | Iris 600 | focus ring, quote border, "copied" tick |

- The light neutrals are Tailwind's `zinc` scale. The dark neutrals are custom, slightly blue-violet (hue about 286°).
- Favicon and app icon tiles have a `#26262B` inner border.
- Specimen tiles that must look the same in both themes (a signature on Ink, artwork previews) use raw hex.

### OKLCH of the neutrals

| Hex | OKLCH | Hex | OKLCH |
|---|---|---|---|
| `#0B0B0C` | `oklch(15.0% 0.002 286.1)` | `#FFFFFF` | `oklch(100% 0 0)` |
| `#0F0F11` | `oklch(16.9% 0.004 286.0)` | `#FAFAFA` | `oklch(98.5% 0 0)` |
| `#131316` | `oklch(18.8% 0.006 285.8)` | `#F4F4F5` | `oklch(96.7% 0.001 286.4)` |
| `#1F1F23` | `oklch(24.1% 0.008 285.8)` | `#E4E4E7` | `oklch(92.0% 0.004 286.3)` |
| `#232328` | `oklch(25.8% 0.009 285.7)` | `#D4D4D8` | `oklch(87.1% 0.005 286.3)` |
| `#2A2A30` | `oklch(28.7% 0.011 285.7)` | `#6B6B74` | `oklch(53.1% 0.014 285.9)` |
| `#EDEDEF` | `oklch(94.7% 0.003 286.3)` | `#52525B` | `oklch(44.2% 0.015 285.8)` |
| `#C4C4CC` | `oklch(82.3% 0.011 286.2)` | `#3F3F46` | `oklch(37.0% 0.012 285.8)` |
| `#A1A1AA` | `oklch(71.2% 0.013 286.1)` | `#27272A` | `oklch(27.4% 0.005 286.0)` |
| `#85858F` | `oklch(62.0% 0.015 286.0)` | `#26262B` | `oklch(27.1% 0.009 285.8)` |

## Iris scale

| Step | Hex | OKLCH |
|---|---|---|
| 50 | `#F5F6FE` | `oklch(97.5% 0.011 280.5)` |
| 100 | `#E9EBFE` | `oklch(94.4% 0.026 281.1)` |
| 200 | `#D4D7FE` | `oklch(88.9% 0.054 281.8)` |
| 300 | `#BABEFE` | `oklch(82.1% 0.090 281.4)` |
| 400 | `#9D9FFE` | `oklch(74.0% 0.136 281.6)` |
| **500** | **`#7F7CF2`** | **`oklch(64.5% 0.172 281.6)`** |
| 600 | `#6762D3` | `oklch(56.0% 0.169 281.4)` |
| 700 | `#534DAF` | `oklch(48.0% 0.151 281.8)` |
| 800 | `#3F3B87` | `oklch(40.0% 0.123 281.6)` |
| 900 | `#2C2A62` | `oklch(32.1% 0.096 281.1)` |
| 950 | `#1D1B45` | `oklch(25.1% 0.077 281.5)` |

## Azure scale

| Step | Hex | OKLCH |
|---|---|---|
| 50 | `#F2F7FE` | `oklch(97.4% 0.011 256.7)` |
| 100 | `#E2EEFF` | `oklch(94.5% 0.026 257.0)` |
| 200 | `#C5DDFE` | `oklch(89.0% 0.052 256.4)` |
| 300 | `#9EC7FE` | `oklch(82.0% 0.090 255.9)` |
| 400 | `#70ADFF` | `oklch(74.1% 0.135 256.2)` |
| **500** | **`#4F9BFF`** | **`oklch(68.8% 0.166 256.2)`** |
| 600 | `#2873D1` | `oklch(56.0% 0.162 256.2)` |
| 700 | `#195CAE` | `oklch(48.1% 0.146 256.2)` |
| 800 | `#134686` | `oklch(39.9% 0.120 256.4)` |
| 900 | `#0D3261` | `oklch(32.0% 0.093 256.4)` |
| 950 | `#052144` | `oklch(25.0% 0.074 255.9)` |

- 300–500: details on dark. 600–700: details on white, and buttons with white text.
- The 950 steps need a hairline border to read against Ink: `#2A2A3A` for Iris, `#1A2A44` for Azure.

## Gradients

| Name | Dark | Light | Use |
|---|---|---|---|
| `--gradient` | `linear-gradient(90deg, Iris 500, Azure 500)` | Iris 600 → Azure 600 | `.text-gradient`, `.border-gradient`, progress fill |
| `--gradient-signature` | `linear-gradient(90deg, #7F7CF2, #6C8CF9, #4F9BFF)` | `#6762D3, #4F6AD2, #2873D1` | hairlines, artwork, the gradient signature file |
| Hero hairline | `linear-gradient(90deg, rgb(127 124 242 / 0), #7F7CF2, #4F9BFF, rgb(79 155 255 / 0))` | same | 1 px line on the top edge of a hero frame |
| Status dot | `linear-gradient(135deg, Iris 500, Azure 500)` | same | the 8 px live dot |

- The middle stops: `#6C8CF9` is `oklch(66.7% 0.165 269.2)`, `#4F6AD2` is `oklch(55.8% 0.163 269.6)`.
- No gradient is ever a hover state. **Why:** hover stays neutral across the site, the signature included.

## Where the colour goes

| Place | Treatment |
|---|---|
| Badge (PRO, LIVE, NEW, a version) | Geist Mono 10.5–12 px, tracking `0.1em`, `.border-gradient`, `.text-gradient` text, radius 6 px |
| Status dot | 8 px circle, the status-dot gradient, `.animate-live` pulse |
| One word per page | `.text-gradient`, often in Instrument Serif italic |
| Focus ring | 2 px outline in `accent-2`, 2 px offset, 4 px radius |
| Progress | 4 px track in `line`, filled with `--gradient`; never a solid block |
| Numbered cards | the number in Geist Mono 12 px, Iris 400 on dark, Iris 600 on light |
| Copied confirmation | the tick in `accent-2`, the word "Copied" in `.text-gradient`, for 1.6 s |
| Quote border in long-form text | `accent-2` |
| Text selection | `rgb(127 124 242 / 0.35)` |
| Code | Iris keywords, Azure strings and values, grey punctuation (below) |

Everything else is neutral: the current nav item is `fg`, a selected filter chip is `fg` text with an `fg` border
on `surface`, and links hover to `fg` or gain a 1 px underline in `underline`.

## Contrast (computed, WCAG 2)

| Pair | Ratio |
|---|---|
| `fg` `#EDEDEF` on Ink | 16.8:1 |
| `soft` `#C4C4CC` on Ink | 11.4:1 |
| `muted` `#A1A1AA` on Ink | 7.7:1 |
| `faint` `#85858F` on Ink | 5.4:1 |
| Iris 400 / Azure 400 on Ink | 8.3:1 / 8.5:1 |
| Iris 500 / Azure 500 on Ink | 5.7:1 / 7.0:1 |
| Ink on Paper | 19.7:1 |
| `#3F3F46` / `#52525B` / `#6B6B74` on Paper | 10.4:1 / 7.7:1 / 5.3:1 |
| White on Iris 600 / Azure 600 | 4.9:1 / 4.7:1 |
| White on Iris 700 / Azure 700 | 6.9:1 / 6.6:1 |
| Iris 500 / Azure 500 on Paper | 3.5:1 / 2.8:1 (not for text) |

## Code highlighting

The site's two Shiki themes, built from the scales. Background `raised`: `#0F0F11` dark, `#FAFAFA` light.

| Role | Dark | Light |
|---|---|---|
| Text | `#C4C4CC` | `#3F3F46` |
| Punctuation, operators | `#85858F` | `#71717A` |
| Comments (italic) | `#6B6B74` | `#8B8B94` |
| Keywords, tags, links, deleted lines | `#9D9FFE` Iris 400 | `#6762D3` Iris 600 |
| Strings, attributes, inserted lines | `#9EC7FE` Azure 300 | `#2873D1` Azure 600 |
| Numbers, constants | `#70ADFF` Azure 400 | `#195CAE` Azure 700 |
| Types, classes, namespaces | `#D4D7FE` Iris 200 | `#3F3B87` Iris 800 |
| Properties, keys | `#C5DDFE` Azure 200 | `#534DAF` Iris 700 |
| Functions, headings (headings bold) | `#EDEDEF` | `#0B0B0C` |

Adjust these palettes when a language needs it; don't switch to a stock theme.

## Diagrams

Diagrams are drawn in Excalidraw with a fixed palette, then each colour is mapped to a theme token so the figure
follows light and dark.

| Pick in Excalidraw | Becomes |
|---|---|
| stroke `#1e1e1e` or `#000000` | `fg` |
| stroke `#495057` / `#868e96` | `soft` / `muted` |
| stroke `#ced4da`, fill `#e9ecef` | `chip` |
| stroke `#7f7cf2` / `#4f9bff` | `accent-2` / `accent` |
| stroke `#ffffff` (text on a coloured fill) | `#ffffff` |
| fill `#ffffff` / `#f8f9fa` | `bg` / `surface` |
| fill `#e9ebfe` / `#e2eeff` | `color-mix(in oklab, Iris 500 16%, transparent)` / `color-mix(in oklab, Azure 500 14%, transparent)` |

- Any other colour is drawn as it is, so stay inside this palette.
- Labels use Excalifont (see [typography-layout.md](typography-layout.md)).
- The figure sits in a `raised` box with a `line` border, radius 12 px, padding 16 × 12 px (24 px from 768 px up).
  It keeps a 600 px minimum width and scrolls sideways inside its box on small screens, so labels never shrink.
