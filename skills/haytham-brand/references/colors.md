# Colour

Every colour of the brand, with its role. Hex values come from the site's theme and the brand kit
(`assets/haytham-brand-tokens.css`), checked 2026-10-27. OKLCH values are computed from the hex and rounded;
hex stays the source of truth.

## Principles

- **Ink first.** Two neutrals do the heavy lifting.
- **Iris** is the creative side (the designer and video editor before the code). **Azure** is the engineer
  (clear, calm, trusted with money).
- **The 95/5 rule.** About 70% Ink, 25% white, greys and the signature, and never more than 5% Iris + Azure on any
  surface.
- **Neutral interaction.** Hover goes to the brighter text colour. The current page and an active filter are
  neutral. Nothing takes the gradient on hover, the signature included.

## Theme tokens

The site defines semantic tokens that switch with the theme. Use these names in any new project.

| Token | Dark (default) | Light | Use |
|---|---|---|---|
| `bg` | `#0B0B0C` | `#FFFFFF` | page |
| `surface` | `#131316` | `#F4F4F5` | tiles, hover fill |
| `raised` | `#0F0F11` | `#FAFAFA` | cards, code blocks, figures |
| `line` | `#1F1F23` | `#E4E4E7` | borders, dividers |
| `edge` | `#232328` | `#E4E4E7` | tile borders |
| `chip` | `#2A2A30` | `#D4D4D8` | chip fill, hover border, list bullets |
| `fg` | `#EDEDEF` | `#0B0B0C` | primary text, hover target |
| `soft` | `#C4C4CC` | `#3F3F46` | body text in long form |
| `muted` | `#A1A1AA` | `#52525B` | secondary text |
| `faint` | `#85858F` | `#6B6B74` | labels, meta, eyebrows |
| `mark` | `#D4D4D8` | `#27272A` | icons |
| `underline` | `#3F3F46` | `#D4D4D8` | link underline colour |
| `accent` | Azure 500 `#4F9BFF` | Azure 600 `#2873D1` | details |
| `accent-2` | Iris 500 `#7F7CF2` | Iris 600 `#6762D3` | details, focus ring |

- The light neutrals are Tailwind's `zinc` scale (`zinc-50` `#FAFAFA` to `zinc-800` `#27272A`). The dark neutrals
  are custom and slightly blue-violet (hue about 286°).
- The favicon and app icon tile border is `#26262B`.

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
- The 950 steps need a hairline border to read against Ink (`#2A2A3A` for Iris, `#1A2A44` for Azure).

## Gradients

| Name | Value | Use |
|---|---|---|
| Signature | `linear-gradient(90deg, #7F7CF2, #6C8CF9, #4F9BFF)` | hairlines, dots, badges, the gradient signature file |
| Signature, light theme | `linear-gradient(90deg, #6762D3, #4F6AD2, #2873D1)` | the same details on Paper |
| Glow | `linear-gradient(90deg, #9D9FFE, #70ADFF)` | artwork on dark |
| Text | `linear-gradient(90deg, #BABEFE, #9EC7FE)` | one word on dark, when 500 is too strong |
| Deep | `linear-gradient(90deg, #6762D3, #2873D1)` | details on light |

The middle stop `#6C8CF9` is `oklch(66.7% 0.165 269.2)`. A hero hairline fades out at both ends:
`linear-gradient(90deg, rgb(127 124 242 / 0), #7F7CF2, #4F9BFF, rgb(79 155 255 / 0))`.

## Where the colour goes

| Place | Treatment |
|---|---|
| Badge (PRO, LIVE, NEW, a version) | Geist Mono 10.5–12 px, tracking `0.1em`, 1 px gradient border, gradient text, radius 6 px |
| Status dot | 8 px circle, `linear-gradient(135deg, Iris 500, Azure 500)`, soft pulse |
| Current page in a nav | Text colour (`fg`), never coloured |
| Progress | a 4 px track in `line` with a gradient fill; never a solid block |
| Focus ring | 2 px outline, 2 px offset: Iris 400 on dark, Iris 600 on light |
| One word | Instrument Serif italic with the gradient, once per page at most |
| Hero hairline | 1–2 px gradient line on the top edge of a card or social image |
| Text selection | `rgb(127 124 242 / 0.35)` |
| Code | Iris keywords, Azure strings and values, grey punctuation (below) |

Everything else is neutral.

## Contrast (computed, WCAG 2)

| Pair | Ratio |
|---|---|
| Text `#EDEDEF` on Ink | 16.8:1 |
| Soft `#C4C4CC` on Ink | 11.4:1 |
| Muted `#A1A1AA` on Ink | 7.7:1 |
| Faint `#85858F` on Ink | 5.4:1 |
| Iris 400 / Azure 400 on Ink | 8.3:1 / 8.5:1 |
| Iris 500 / Azure 500 on Ink | 5.7:1 / 7.0:1 |
| Ink on Paper | 19.7:1 |
| `#3F3F46` / `#52525B` / `#6B6B74` on Paper | 10.4:1 / 7.7:1 / 5.3:1 |
| White on Iris 600 / Azure 600 | 4.9:1 / 4.7:1 |
| White on Iris 700 / Azure 700 | 6.9:1 / 6.6:1 |
| Iris 500 / Azure 500 on Paper | 3.5:1 / 2.8:1 (not for text) |

So: on white, use 600 or darker for any coloured text or a button with white text.

## Code highlighting

Brand themes for Shiki or any highlighter. Background `#0F0F11` (dark) and `#FAFAFA` (light).

| Role | Dark | Light |
|---|---|---|
| Text | `#C4C4CC` | `#3F3F46` |
| Punctuation, operators | `#85858F` | `#71717A` |
| Comments (italic) | `#6B6B74` | `#8B8B94` |
| Keywords, tags | `#9D9FFE` Iris 400 | `#6762D3` Iris 600 |
| Strings, attributes | `#9EC7FE` Azure 300 | `#2873D1` Azure 600 |
| Numbers, constants | `#70ADFF` Azure 400 | `#195CAE` Azure 700 |
| Types, classes | `#D4D7FE` Iris 200 | `#3F3B87` Iris 800 |
| Properties, keys | `#C5DDFE` Azure 200 | `#534DAF` Iris 700 |
| Functions, headings | `#EDEDEF` | `#0B0B0C` |

Adjust these palettes when needed; don't switch to a stock theme.

## Diagrams

Hand-drawn diagrams (Excalidraw style) use a small fixed palette so they follow the theme:

- Ink lines `#1e1e1e`, greys `#495057` and `#868e96`.
- Iris `#7f7cf2` and Azure `#4f9bff`, with tints `#e9ebfe` (Iris 100) and `#e2eeff` (Azure 100) for fills.
- Labels in Excalifont. Figures sit on a `raised` card with a `line` border.
- When rendered for a dark page, map ink to `fg`, greys to `soft` and `muted`, paper to `bg`, and the tints to
  `color-mix(in oklab, <Iris or Azure 500> 14–16%, transparent)`.
