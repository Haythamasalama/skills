# Colours — iOS 27

**Read when:** you need an exact iOS 27 colour: accents, grays, backgrounds, labels, fills, separators, overlays, per appearance.
**Owns:** how the kit models colour, accents, grays, backgrounds, backgrounds – Grouped, labels, labels - Vibrant, fills, fills - Vibrant, separators, overlays, miscellaneous (component-specific), colors page layout (what the page shows), nodes and IDs read, where the Sketch kit differs.

Source: Figma file `a9DbGXKV4RSzeTyGsv0LqZ`, page `0:1746` "Colors", plus the file's local colour variables. Read 2026-11-01.

## How the kit models colour

Two variable collections work together:

| Collection | ID | Modes (mode ID) | Holds |
|---|---|---|---|
| Color Scheme | `VariableCollectionId:507:29161` | Light (`404:0`), Dark (`404:1`) | 58 public colour variables + 1 STRING variable `Mode` ("Light" / "Dark"). Every colour is an alias to a `Light/…` or `Dark/…` variable in Color Contrast. |
| Color Contrast | `VariableCollectionId:13207:140` | Default (`13207:4`), Increased Contrast (`13207:5`) | 116 raw values: a `Light/…` and a `Dark/…` copy of each colour. |

So a node's colour = Color Scheme mode (Light/Dark) × Color Contrast mode (Default/Increased Contrast). The four combinations are the four value columns below.

- All Color Scheme variables have scope `ALL_SCOPES` and no description.
- The "iOS code syntax" column is the variable's `codeSyntax.iOS` value as written in the kit. Grays, Overlays, Separators/Vibrant and Miscellaneous have none.
- Alpha values were read as floats and rounded to 3 decimals. No alpha = fully opaque.
- Tinted or other appearance modes: Not specified in the kit (the colour collections have only the modes above).

Column key: **L** = Light/Default, **D** = Dark/Default, **L-IC** = Light/Increased Contrast, **D-IC** = Dark/Increased Contrast.

## Accents

| Variable (Color Scheme) | iOS code syntax | L | D | L-IC | D-IC |
|---|---|---|---|---|---|
| Accents/Red | `.red` | #FF383C | #FF4245 | #E9152D | #FF6165 |
| Accents/Orange | `.orange` | #FF8D28 | #FF9230 | #C55300 | #FFA056 |
| Accents/Yellow | `.yellow` | #FFCC00 | #FFD600 | #A16A00 | #FEDF43 |
| Accents/Green | `.green` | #34C759 | #30D158 | #008932 | #4AD968 |
| Accents/Mint | `.mint` | #00C8B3 | #00DAC3 | #008575 | #54DFCB |
| Accents/Teal | `.teal` | #00C3D0 | #00D2E0 | #008198 | #3BDDEC |
| Accents/Cyan | `.cyan` | #00C0E8 | #3CD3FE | #007EAE | #6DD9FF |
| Accents/Blue | `.blue` | #0088FF | #0091FF | #1E6EF4 | #5CB8FF |
| Accents/Indigo | `.indigo` | #6155F5 | #6D7CFF | #564ADE | #A7AAFF |
| Accents/Purple | `.purple` | #CB30E0 | #DB34F2 | #B02FC2 | #EA8DFF |
| Accents/Pink | `.pink` | #FF2D55 | #FF375F | #E7124D | #FF8AC4 |
| Accents/Brown | `.brown` | #AC7F5E | #B78A66 | #956D51 | #DBA679 |

## Grays

| Variable | iOS code syntax | L | D | L-IC | D-IC |
|---|---|---|---|---|---|
| Grays/Black | — | #000000 | #000000 | #000000 | #000000 |
| Grays/White | — | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |
| Grays/Gray | — | #8E8E93 | #8E8E93 | #6C6C70 | #AEAEB2 |
| Grays/Gray 2 | — | #AEAEB2 | #636366 | #8E8E93 | #7C7C80 |
| Grays/Gray 3 | — | #C7C7CC | #48484A | #AEAEB2 | #545456 |
| Grays/Gray 4 | — | #D1D1D6 | #3A3A3C | #BCBCC0 | #444446 |
| Grays/Gray 5 | — | #E5E5EA | #2C2C2E | #D8D8DC | #363638 |
| Grays/Gray 6 | — | #F2F2F7 | #1C1C1E | #EBEBF0 | #242426 |

## Backgrounds

| Variable | iOS code syntax | L | D | L-IC | D-IC |
|---|---|---|---|---|---|
| Backgrounds/Primary | `.background` | #FFFFFF | #000000 | #FFFFFF | #000000 |
| Backgrounds/Secondary | `.background.secondary` | #F2F2F7 | #1C1C1E | #EBEBF0 | #242426 |
| Backgrounds/Tertiary | `.background.tertiary` | #FFFFFF | #2C2C2E | #FFFFFF | #2C2C2E |
| Backgrounds/Primary - Elevated | `.background` | #FFFFFF | #1C1C1E | #FFFFFF | #1C1C1E |
| Backgrounds/Secondary - Elevated | `.background.secondary` | #F2F2F7 | #2C2C2E | #EBEBF0 | #2C2C2E |
| Backgrounds/Tertiary - Elevated | `.background.tertiary` | #FFFFFF | #3A3A3C | #FFFFFF | #3A3A3C |

## Backgrounds – Grouped

(The group name uses an en dash: `Backgrounds – Grouped/…`.)

| Variable | iOS code syntax | L | D | L-IC | D-IC |
|---|---|---|---|---|---|
| Backgrounds – Grouped/Primary | `.background` | #F2F2F7 | #000000 | #EBEBF0 | #000000 |
| Backgrounds – Grouped/Secondary | `.background.secondary` | #FFFFFF | #1C1C1E | #FFFFFF | #242426 |
| Backgrounds – Grouped/Tertiary | `.background.tertiary` | #F2F2F7 | #2C2C2E | #EBEBF0 | #363638 |
| Backgrounds – Grouped/Primary - Elevated | `.background` | #F2F2F7 | #1C1C1E | #EBEBF0 | #242426 |
| Backgrounds – Grouped/Secondary - Elevated | `.background.secondary` | #FFFFFF | #2C2C2E | #FFFFFF | #363638 |
| Backgrounds – Grouped/Tertiary - Elevated | `.background.tertiary` | #F2F2F7 | #3A3A3C | #EBEBF0 | #3A3A3C |

## Labels

| Variable | iOS code syntax | L | D | L-IC | D-IC |
|---|---|---|---|---|---|
| Labels/Primary | `.primary` | #000000 | #FFFFFF | #000000 | #FFFFFF |
| Labels/Secondary | `.secondary` | #3C3C43 α 0.6 | #EBEBF5 α 0.7 | #3C3C43 α 0.8 | #EBEBF5 α 0.7 |
| Labels/Tertiary | `.tertiary` | #3C3C43 α 0.3 | #EBEBF5 α 0.3 | #3C3C43 α 0.7 | #EBEBF5 α 0.55 |
| Labels/Quaternary | `.quaternary` | #3C3C43 α 0.18 | #EBEBF5 α 0.16 | #3C3C43 α 0.55 | #EBEBF5 α 0.4 |

## Labels - Vibrant

Opaque values; identical in Default and Increased Contrast.

| Variable | iOS code syntax | L | D |
|---|---|---|---|
| Labels - Vibrant/Primary | `.primary` | #1A1A1A | #F5F5F5 |
| Labels - Vibrant/Secondary | `.secondary` | #727272 | #8A8A8A |
| Labels - Vibrant/Tertiary | `.tertiary` | #BFBFBF | #404040 |
| Labels - Vibrant/Quaternary | `.quaternary` | #D9D9D9 | #262626 |

## Fills

Identical in Default and Increased Contrast.

| Variable | iOS code syntax | L | D |
|---|---|---|---|
| Fills/Primary | `.primary` | #787878 α 0.2 | #787880 α 0.36 |
| Fills/Secondary | `.secondary` | #787880 α 0.16 | #787880 α 0.32 |
| Fills/Tertiary | `.tertiary` | #767680 α 0.12 | #767680 α 0.24 |
| Fills/Quaternary | `.quaternary` | #747480 α 0.08 | #767680 α 0.18 |

Note: Light Fills/Primary is #787878 (not #787880) in the kit.

## Fills - Vibrant

Opaque; identical in Default and Increased Contrast.

| Variable | iOS code syntax | L | D |
|---|---|---|---|
| Fills - Vibrant/Primary | `.primary` | #CCCCCC | #333333 |
| Fills - Vibrant/Secondary | `.secondary` | #E0E0E0 | #1F1F1F |
| Fills - Vibrant/Tertiary | `.tertiary` | #EDEDED | #121212 |

Fills - Vibrant/Quaternary: Not specified in the kit (no such variable).

## Separators

Identical in Default and Increased Contrast.

| Variable | iOS code syntax | L | D |
|---|---|---|---|
| Separators/Opaque | `.opaqueSeparator` | #C6C6C8 | #38383A |
| Separators/Non-opaque | `.separator` | #000000 α 0.12 | #FFFFFF α 0.17 |
| Separators/Vibrant | — | #E6E6E6 | #1A1A1A |

## Overlays

Identical in Default and Increased Contrast.

| Variable | L | D |
|---|---|---|
| Overlays/Default | #000000 α 0.2 | #000000 α 0.48 |
| Overlays/Activity View Controller | #000000 α 0.2 | #000000 α 0.29 |

## Miscellaneous (component-specific)

Identical in Default and Increased Contrast unless noted.

| Variable | L | D |
|---|---|---|
| Miscellaneous/Buttons/BG - Destructive | #FF383C α 0.14 | #FF4245 α 0.14 |
| Miscellaneous/Segmented Control - Selected Fill | #FFFFFF | #FFFFFF α 0.27 |
| Miscellaneous/Tab Bar Selection | alias → `Light/Accents/Blue` (#0088FF; #1E6EF4 in Increased Contrast) | #FFFFFF |
| Miscellaneous/Toggle/AX Label - Off | #B3B3B3 | #A6A6A6 |
| Miscellaneous/Sidebar/Sidebar - BG - Active | #DAE6F2 | #141517 |
| Miscellaneous/Sidebar/Sidebar - BG - Inactive | #EDF4FA | #131414 |

Buttons/BG - Destructive is a raw value in Color Contrast, not an alias, so it stays #FF383C / #FF4245 at α 0.14 in Increased Contrast.

## Colors page layout (what the page shows)

Section `5707:28659` "Default" (2560 × 1500) holds:

| Node | What it shows |
|---|---|
| `509:77596` "Colors" (12 × `Swatch` instances, 160 × 160, 40 apart) | Red, Orange, Yellow, Green, Mint, Teal, Cyan, Blue, Indigo, Purple, Pink, Brown |
| `509:77595` "Grays" (8 × `Swatch`) | Black, Gray, Gray 2, Gray 3, Gray 4, Gray 5, Gray 6, White |
| `5532:7801` Swatch Grid | Backgrounds: Primary / Secondary / Tertiary × rows Light, Dark - Elevated, Dark - Base |
| `5532:8370` Swatch Grid | Grouped Backgrounds: Primary / Secondary / Tertiary × rows Light, Dark - Elevated, Dark - Base |
| `5532:8406` Swatch Grid | Labels: Primary / Secondary / Tertiary / Quaternary × rows Light, Dark |
| `5532:8407` Swatches | Fills: Primary / Secondary / Tertiary / Quaternary × rows Light, Dark (drawn as an "A" glyph) |
| `5532:8478` Swatches | Separators: Opaque / Non-opaque × rows Light, Dark |

Each colour swatch shows the Light value in the top half and the Dark value in the bottom half, over a checkerboard so transparency is visible.

Swatch components on the page:

| Component | ID | Size | Variants |
|---|---|---|---|
| `_Swatch - Light and Dark` | `0:4299` | 160 × 160 | — |
| `_Swatch` (set frame `509:77730`) | `0:4207`, `509:77740`, `509:77731`, `509:77742` | 100 × 100 | Mode = Light / Dark × Type = Color / Label |
| `_Swatch Grid` | `5532:7800` | 659 × 370 | — |

`_Component Header` instance `544:193103` (1800 × 242) sits above the section; its text was not read.

## Nodes and IDs read

- Page metadata: `0:1746`.
- Screenshot: section `5707:28659`.
- Variable collections: `VariableCollectionId:507:29161` (all 59 variables, both modes, code syntax, scopes) and `VariableCollectionId:13207:140` (all 116 variables, both modes).
- Not read: individual swatch fills on the canvas, the header text, the swatch components' internal styling (corner radius, label typography).

## Where the Sketch kit differs

`Apple iOS 27 UI Kit.sketch` (read 2026-11-01) was checked against the tables above. 90 swatches were compared; these differ:

| Token | Figma variable (tables above) | Sketch swatch |
|---|---|---|
| Labels, Secondary, Dark | #EBEBF5 α 0.7 | #EBEBF5@60% (`Labels/Dark/2 Secondary`) |
| Separators, Non-opaque, Dark | #FFFFFF α 0.17 | #FFFFFF@12% (`Separators/Dark/Non-Opaque`) |

**Vibrant labels.** The Figma `Labels - Vibrant` values are the Sketch `Labels - Liquid Glass` swatches, with one exception: Dark Primary is #F5F5F5 in Figma and #EDEDED in Sketch. The Sketch kit also has a separate `Labels/… - Vibrant` group:

| Name | Sketch `Labels - Liquid Glass` Light | Dark | Sketch `Labels/… - Vibrant` Light | Dark |
|---|---|---|---|---|
| 1 Primary | #1A1A1A | #EDEDED | #000000 | #FFFFFF |
| 2 Secondary | #727272 | #8A8A8A | #999999 | #999999 |
| 3 Tertiary | #BFBFBF | #404040 | #BFBFBF | #404040 |
| 4 Quaternary | #D9D9D9 | #262626 | #D9D9D9 | #262626 |

**Quinary labels.** These exist only in Sketch: Light `#3C3C43@9%`, Dark `#EBEBF5@9%`.

The Sketch components draw with the Sketch swatches, so the specs in `specs/` use the Sketch values. Name the source when you use either value.
