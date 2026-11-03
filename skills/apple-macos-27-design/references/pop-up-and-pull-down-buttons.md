# Pop-up and Pull-down Buttons — macOS 27

**Read when:** you need an exact macOS 27 value for pop-up and Pull-down Buttons (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Pop-up and Pull-down Buttons in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/pop-up-and-pull-down-buttons.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

The page has 120 components in two families with the same axes. There are no documentation boards (`BOARD`) on this page.

| Family | Name tree | Axes, in path order | Components |
|---|---|---|---|
| Pop-up Buttons | `Pop-up Buttons/<Appearance>/<Context>/<Size>/<State>` | Appearance: `Light`, `Dark` · Context: `Content Area`, `Over-glass` · Size: `1 Mn`, `2 Sm`, `3 Rg`, `4 Lg`, `5 XL` · State: `1 - Idle`, `3 - Clicked`, `4 - Disabled` | 60 |
| Pulldown Buttons | `Pulldown Buttons/<Appearance>/<Context>/<Size>/<State>` | same axes and values | 60 |

Each family has every combination: 2 appearances × 2 contexts × 5 sizes × 3 states. Neither family has Hover, Inactive, On or Off states.

Both families use only the `01 - Bordered` shared styles from `control-styles-content-area.md` / `control-styles-over-glass.md`, the same group as the Bordered push button and the Arrow Buttons in `buttons.md`.

## Anatomy

No component contains a nested component (`use`). Each one is a frame with two text layers, the glyph listed first.

| Layer | Kind | Size and position | Role |
|---|---|---|---|
| (component) | frame, `stack h` with left padding only (`pad0,0,0,L`) | 120 wide at every size; height per size | Fill, corner radius and `01 - Bordered` shared style |
| `􀆏` (Pop-up) / `􀆈` (Pull-down) | `text`, centred | square H × H at `@(120 − H),0` | The indicator glyph: 􀆏 U+10018F on Pop-up Buttons, 􀆈 U+100188 on Pulldown Buttons. 􀆏 is the same glyph the Arrow Buttons use |
| `Label` | `text`, content "McIntosh", left aligned | `@L,y`, width 120 − L − H | The text; "McIntosh" in every component |

Derived and checked on all 120 components:

- The glyph box is a square as tall as the button, flush with the right edge (x = 120 − H, y = 0).
- The label starts at the left padding and ends exactly where the glyph box starts (label x + width = glyph x), so the visible gap between them is 0 whatever the `stack` gap says.
- The label is centred vertically: label y = (H − label height) / 2.
- The kit draws every size at width 120. It gives no minimum or maximum width.

## Sizes

Every listed corner has smoothing 0.6.

### Pop-up Buttons

| Size | W × H | Corner radius | Padding (left) | Stack gap | Glyph box | Glyph font | Label box | Label font |
|---|---|---|---|---|---|---|---|---|
| 5 XL | 120 × 36 | max | 18 | 0 | 36 × 36 `@84,0` | SFPro-Semibold 13, lh16 | 66 × 16 `@18,10` | SFPro-Medium 13, lh16 |
| 4 Lg | 120 × 28 | max | 14 | 4 | 28 × 28 `@92,0` | SFPro-Semibold 13, lh16 | 78 × 16 `@14,6` | SFPro-Medium 13, lh16 |
| 3 Rg | 120 × 24 | 6 | 12 | 4 | 24 × 24 `@96,0` | SFPro-Semibold 13, lh16 | 84 × 16 `@12,4` | SFPro-Medium 13, lh16 |
| 2 Sm | 120 × 20 | 5 | 10 | 4 | 20 × 20 `@100,0` | SFPro-Semibold 11, lh16 | 90 × 13 `@10,3.5` | SFPro-Medium 11, no line height |
| 1 Mn | 120 × 16 | 4 | 7 | 0 (Content Area) · 5 (Over-glass Clicked, Disabled) · 1 (Over-glass Idle) | 16 × 16 `@104,0` | SFPro-Semibold 10, lh14 | 97 × 12 `@7,2` | SFPro-Medium 10, no line height |

### Pulldown Buttons

| Size | W × H | Corner radius | Padding (left) | Stack gap | Glyph box | Glyph font | Label box | Label font |
|---|---|---|---|---|---|---|---|---|
| 5 XL | 120 × 36 | max | 18 | 4 | 36 × 36 `@84,0` | SFPro-Semibold 13, lh16 | 66 × 16 `@18,10` | SFPro-Medium 13, lh16 |
| 4 Lg | 120 × 28 | max | 14 | 4 | 28 × 28 `@92,0` | SFPro-Semibold 13, lh16 | 78 × 16 `@14,6` | SFPro-Medium 13, lh16 |
| 3 Rg | 120 × 24 | 6 | 12 | 4 | 24 × 24 `@96,0` | SFPro-Bold 10, lh16 | 84 × 16 `@12,4` | SFPro-Medium 13, lh16 |
| 2 Sm | 120 × 20 | 5 | 10 | 4 | 20 × 20 `@100,0` | SFPro-Bold 10, lh16 | 90 × 16 `@10,2` (Content Area) · 90 × 13 `@10,3.5` (Over-glass) | SFPro-Medium 11, no line height |
| 1 Mn | 120 × 16 | 4 | 7 | 0 (Content Area) · 5 (Over-glass) | 16 × 16 `@104,0` | SFPro-Bold 8.5, lh16 | 97 × 14 `@7,1` | SFPro-Medium 10, lh14 |

Derived: height and corner radius are the same as the push buttons in `buttons.md` at every size. The left padding matches the push buttons' label inset only at Mn (7) and Sm (10); from Rg up it is 12, 14 and 18, where push buttons use 16. The kit gives no right padding: the glyph box fills the right end.

Irregular values, stored this way in the kit:

- The `stack` gap is 0, 1, 4 or 5 depending on variant, but in every variant the label runs up to the glyph box, so the gap value changes nothing in the drawn layout.
- Pop-up Over-glass Mn has gap 1 in Idle and 5 in Clicked and Disabled. Pop-up XL has gap 0 where Pull-down XL has 4.
- Pull-down Sm has a 90 × 16 label box in Content Area and 90 × 13 in Over-glass.
- At Mn the Pop-up label box is 97 × 12 with no line height, and the Pull-down label box is 97 × 14 with lh14.

## Colours and states

Each row holds for all five sizes. Label and glyph always share one colour. No layer on this page has a border, shadow, inner shadow or blur.

### Pop-up Buttons

| Appearance · context | State | Frame fill · effects | Shared style | Label colour · effects | Glyph colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | 1 - Idle | `#000000@8%` | `Content Area/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary} | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | 3 - Clicked | `#000000@16%` | `Content Area/Light/01 - Bordered/03 - Clicked` | `#000000@85%` {Labels/Light/1 Primary} | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | 4 - Disabled | `#000000@4%` | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | 1 - Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | 3 - Clicked | `#000000@12% (blend overlay) + #000000@13% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/03 - Clicked` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | 4 - Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | 1 - Idle | `#FFFFFF@7%` | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | 3 - Clicked | `#FFFFFF@16%` | `Content Area/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF` {Labels/Dark/1 Primary} | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | 4 - Disabled | `#FFFFFF@4%` | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | 1 - Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 3 - Clicked | `#FFFFFF@12% (blend overlay) + #FFFFFF@13% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 4 - Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Pulldown Buttons

| Appearance · context | State | Frame fill · effects | Shared style | Label colour · effects | Glyph colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | 1 - Idle | `#000000@8%` | `Content Area/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary} | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | 3 - Clicked | `#000000@16%` | `Content Area/Light/01 - Bordered/03 - Clicked` | `#000000@85%` {Labels/Light/1 Primary} | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | 4 - Disabled | `#000000@4%` | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | 1 - Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | 3 - Clicked | `#000000@12% (blend overlay) + #000000@13% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/03 - Clicked` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | 4 - Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | 1 - Idle | `#FFFFFF@7%` | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | 3 - Clicked | `#FFFFFF@16%` | `Content Area/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF` {Labels/Dark/1 Primary} | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | 4 - Disabled | `#FFFFFF@4%` | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | 1 - Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 3 - Clicked | `#FFFFFF@12% (blend overlay) + #FFFFFF@13% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 4 - Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

Derived: both families are identical in colour. Content Area labels in Light use `#000000@85%` {Labels/Light/1 Primary}; Over-glass labels in Light use the vibrant `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} with plus-darker. Clicked keeps the label colour of Idle and only darkens the fill (Light Content Area 8 % → 16 %). The Bordered push button in `buttons.md` uses the same `01 - Bordered` fills but a different Light Content Area label colour (`#363636`); the pop-ups use `#000000@85%`.

## Text

No text layer references a shared text style (the file has no `textstyle` token), and no component text sets tracking. The label text in every component is "McIntosh".

| Part | Family | Sizes | Font | Size | Line height | Align |
|---|---|---|---|---|---|---|
| `Label` | both | XL, Lg, Rg | SFPro-Medium | 13 | 16 | left |
| `Label` | both | Sm | SFPro-Medium | 11 | not set | left |
| `Label` | Pop-up | Mn | SFPro-Medium | 10 | not set | left |
| `Label` | Pull-down | Mn | SFPro-Medium | 10 | 14 | left |
| `􀆏` | Pop-up | XL, Lg, Rg | SFPro-Semibold | 13 | 16 | center |
| `􀆏` | Pop-up | Sm | SFPro-Semibold | 11 | 16 | center |
| `􀆏` | Pop-up | Mn | SFPro-Semibold | 10 | 14 | center |
| `􀆈` | Pull-down | XL, Lg | SFPro-Semibold | 13 | 16 | center |
| `􀆈` | Pull-down | Rg, Sm | SFPro-Bold | 10 | 16 | center |
| `􀆈` | Pull-down | Mn | SFPro-Bold | 8.5 | 16 | center |

Colours per state are in Colours and states. Derived: SFPro-Medium is not one of the weights in `text-styles.md`.

## Effects

There are no shadows, inner shadows, background blurs, glass effects or borders on this page. The layer lines carry only `fill`, `corners`, `stack`, `opacity` (page headings only) and `blend` tokens. The glass that Over-glass variants are drawn on is in `materials.md`.

| Effect | Where | Values |
|---|---|---|
| Fill blend `overlay` + `plus-darker` | Light · Over-glass frames | Idle `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` · Clicked `#000000@12% (blend overlay) + #000000@13% (blend plus-darker)` · Disabled `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` |
| Fill blend `overlay` + `plus-lighter` | Dark · Over-glass frames | Idle `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` · Clicked `#FFFFFF@12% (blend overlay) + #FFFFFF@13% (blend plus-lighter)` · Disabled `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` |
| Layer blend `plus-darker` | Light · Over-glass label and glyph | — |
| Layer blend `plus-lighter` | Dark · Over-glass label and glyph | — |

Content Area variants use plain fills and no blend modes.

## Kit notes

The page has no documentation boards and no notes from Apple. Its only loose layers are section headings: "Pop-Up Button" and "Pull-Down Button" (each in black and in white), "Light" and "Dark" at 50 % opacity, and "Content Area" / "Over-Glass". The page title is "􀆏 Pop-up and Pull-down Buttons" (􀆏 U+10018F); the component paths spell the second family `Pulldown Buttons`.

## Finding it in the spec

| What | Command |
|---|---|
| Pop-up buttons | `grep -n '^COMPONENT "Pop-up Buttons/' specs/pop-up-and-pull-down-buttons.txt` |
| Pull-down buttons | `grep -n '^COMPONENT "Pulldown Buttons/' specs/pop-up-and-pull-down-buttons.txt` |
| One appearance and context | `grep -n '^COMPONENT "Pop-up Buttons/Dark/Over-glass/' specs/pop-up-and-pull-down-buttons.txt` |
| One size | `grep -n '^COMPONENT "Pulldown Buttons/[^/]*/[^/]*/3 Rg/' specs/pop-up-and-pull-down-buttons.txt` |
| A component with its two text layers | `grep -n -A2 '^COMPONENT "Pop-up Buttons/Light/Content Area/3 Rg/1 - Idle"' specs/pop-up-and-pull-down-buttons.txt` |
| Page headings | `grep -n '^text ' specs/pop-up-and-pull-down-buttons.txt` |
