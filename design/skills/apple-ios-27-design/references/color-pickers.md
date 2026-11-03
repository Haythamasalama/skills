# Color Pickers — iOS 27

**Read when:** you need an exact iOS 27 value for color Pickers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Color Pickers in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/color-pickers.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

9 components. `􀻃` (U+100EC3) marks the building blocks.

| Family | Name | Axis values | Count |
|---|---|---|---|
| Picker | `Color Pickers/<Appearance>/<Device>` | Appearance: Light, Dark. Device: iPhone (402 × 874), iPad (402 × 599) | 4 |
| Color Grid | `Color Pickers/􀻃/Color Grid` | — (one, shared by both appearances) | 1 |
| Opacity Meter | `Color Pickers/􀻃/<Appearance>/Opacity Meter` | Light, Dark (362 × 95) | 2 |
| Swatches | `Color Pickers/􀻃/<Appearance>/Swatches` | Light, Dark (362 × 95) | 2 |

Only the Grid view of the picker is drawn. The segmented control also names "Spectrum" and "Sliders"; those views are Not in the kit.

## Anatomy

### Picker panel

The iPhone picker is a glass sheet; the iPad picker sits in a popover. The content is the same in both, top to bottom (positions inside the panel; iPad width 370, iPhone width 354):

| Part (layer) | Size @ position | Contents / nested component |
|---|---|---|
| `Navigation Bar` | 370 / 354 × 35 @16,14, `stack h gap0 pad0,0,11,0` | `Leading Button` 24 × 24 @0,0 (glyph 􀎗 U+100397); `Title` 322 / 306 × 22 @24,1 → `Toolbars/􀻃/<Appearance>/Titles - iPhone/Title`, text "Colors"; `Trailing Button` 24 × 24 @346 / @330,0 (glyph 􀆄 U+100184) |
| `Segmented Control` | 370 / 354 × 48 @16,49, `stack v gap0 pad4,0,12,0` | `Segmented Control` 370 / 354 × 32 @0,4 → `Segmented Controls/<Appearance>/Small/1 - Enabled`, segment texts "Grid", "Spectrum", "Sliders" |
| `Color Grid` | 370 / 354 × 296 @16,97, `corners 8` | `Color Grid` instance 370 / 354 × 296 → `Color Pickers/􀻃/Color Grid` |
| `Opacity Meter` | 370 / 354 × 95 @16,393 | → `Color Pickers/􀻃/<Appearance>/Opacity Meter` |
| `Swatches` | 370 / 354 × 95 @16,488 | → `Color Pickers/􀻃/<Appearance>/Swatches` |

Derived: the parts stack with no gaps: 14 + 35 = 49, 49 + 48 = 97, 97 + 296 = 393, 393 + 95 = 488, 488 + 95 + 16 = 599 (the panel height).

| Device | Container | Values |
|---|---|---|
| iPhone | `group "Stack"` 386 × 599 @8,267 in a 402 × 874 screen | glass style (see Effects), `corners 32/32/58/58`, `stack v gap0 pad14,16,16,16`; behind it `Overlay` 402 × 874 → `Sheets/􀻃/Overlay/<Appearance>` |
| iPad | component 402 × 599, `stack v gap0 pad14,16,16,16` | `Popover` 430 × 627 @-14,-14 → `Popovers (iPad Only)/Light/Bottom Middle` (Light); `Popovers (iPad Only)/Dark - Presentation Controller` with a swap to `Popovers (iPad Only)/Dark/Bottom Middle` (Dark) |

Derived: the iPhone sheet sits 8 from the left, right and bottom edges (8 + 386 + 8 = 402; 267 + 599 = 866 = 874 − 8). The iPad popover extends 14 beyond the content on each side (430 = 402 + 2 × 14).

### Color Grid (`Color Pickers/􀻃/Color Grid`)

360 × 300, `stack v gap0`, fill `#000000` + `#FFFFFF`. Ten `Row` groups 360 × 30 (`stack h gap0`) at y 0, 30, … 270, each with twelve `Swatch` groups 30 × 30 at x 0, 30, … 330, corners 0. In the pickers the instance is stretched to 370 × 296 or 354 × 296 and clipped by a group with corners 8.

Swatch fills, top row first (° = the swatch fill has `blend screen`; * = the swatch layer has `blend screen`; rows 60 and 90 carry `blend screen` on the `Row` group instead, marked † in the first column):

| Row (y) | x0 | x30 | x60 | x90 | x120 | x150 | x180 | x210 | x240 | x270 | x300 | x330 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0 | #FEFFFE° | #EBEBEB° | #D6D6D6° | #C2C2C2° | #ADADAD° | #999999° | #858585° | #707070° | #5C5C5C° | #474747° | #333333° | #000000° |
| 30 | #00374A* | #011D57* | #11053B* | #2E063D* | #3C071B* | #5C0701* | #5A1C00* | #583300* | #563D00* | #666100* | #4F5504* | #263E0F* |
| 60 † | #004D65 | #012F7B | #1A0A52 | #450D59 | #551029 | #831100 | #7B2900 | #7A4A00 | #785800 | #8D8602 | #6F760A | #38571A |
| 90 † | #016E8F | #0042A9 | #2C0977 | #61187C | #791A3D | #B51A00 | #AD3E00 | #A96800 | #A67B01 | #C4BC00 | #9BA50E | #4E7A27 |
| 120 | #008CB4* | #0056D6* | #371A94* | #7A219E* | #99244F* | #E22400* | #DA5100* | #D38301* | #D19D01* | #F5EC00* | #C3D117* | #669D34* |
| 150 | #00A1D8° | #0061FD° | #4D22B2° | #982ABC° | #B92D5D° | #FF4015° | #FF6A00° | #FFAB01° | #FCC700° | #FEFB41° | #D9EC37° | #76BB40° |
| 180 | #01C7FC* | #3A87FD* | #5E30EB* | #BE38F3* | #E63B7A* | #FE6250* | #FE8648* | #FEB43F* | #FECB3E* | #FFF76B* | #E4EF65* | #96D35F* |
| 210 | #52D6FC | #74A7FF | #864FFD | #D357FE | #EE719E | #FF8C82 | #FEA57D | #FEC777 | #FED977 | #FFF994 | #EAF28F | #B1DD8B |
| 240 | #93E3FC | #A7C6FF | #B18CFE | #E292FE | #F4A4C0 | #FFB5AF | #FFC5AB | #FED9A8 | #FDE4A8 | #FFFBB9 | #F1F7B7 | #CDE8B5 |
| 270 | #CBF0FF | #D2E2FE | #D8C9FE | #EFCAFE | #F9D3E0 | #FFDAD8 | #FFE2D6 | #FEECD4 | #FEF1D5 | #FDFBDD | #F6FADB | #DEEED4 |

All 120 swatches are fully opaque. No swatch is bound to a kit colour. A selection marker on the grid is Not in the kit.

### Opacity Meter (`Color Pickers/􀻃/<Appearance>/Opacity Meter`)

362 × 95, `stack v gap5 pad16,0,22,0`, border 0.5 inside (separator colour, see Colours).

| Part | Size @ position | Values |
|---|---|---|
| `Opacity` label | 67 × 18 @0,16 | text "Opacity" |
| `Stack` | 362 × 34 @0,39, `stack h gap11` | holds slider and field |
| `Slider` | 276 × 34 @0,0, `corners max`, `stack h gap0 pad2,0,2,0` | fill `#D9D9D9` + image + linear gradient {0, 0.5}→{0.854869385283436, 0.5} from `#BE38F3@0%` (0%) to `#BE38F3` (100%) |
| `Scrubber` (oval) | 34 × 34 @242,0 | fill `#BE38F3`, border 3 inside `#FFFFFF`, shadow x0 y0 blur3 spread0 `#000000@10%` |
| `Field` | 75 × 34 @287,0, `corners 8`, `stack h gap0 pad0,14,0,14` | text "100%" 47 × 22 @14,6 |

Derived: 276 + 11 + 75 = 362; 16 + 18 + 5 + 34 + 22 = 95. The scrubber sits at the slider's right end (242 + 34 = 276), matching 100%.

### Swatches (`Color Pickers/􀻃/<Appearance>/Swatches`)

362 × 95, `stack h gap30 pad20,0,0,0`.

| Part | Size @ position | Values |
|---|---|---|
| `Swatch` (current colour) | 75 × 75 @0,20, `corners 10` | fill `#6155F5 {System Colors/Light/9 Indigo}` (a `rect` in Dark, a `group` in Light) |
| `Swatches` (Dark) / `Stack` (Light) | 257 × 75 @105,20, `stack v gap15` | two rows |
| `Row 1`, `Row 2` | 257 × 30 at y 0 and 45, `stack h gap25` | five 30 × 30 items at x 0, 56.75, 113.5, 170.25, 227 |
| `Swatch - Dot` | 30 × 30, `corners 15` | one saved colour |
| Selected dot (`Stack`) | 30 × 30, `corners 15`, `stack v gap0 pad3,3,3,3` | fill = colour; `Oval` 24 × 24 @3,3, border 2 inside `#FFFFFF` |
| `Add Button` | 30 × 30, `corners 15` | `Path` 14.67 × 14.67 @7.67,7.67 (the plus is a path, not a glyph) |

Row contents: Row 1 — Green `#34C759`, Yellow `#FFCC00`, Orange `#FF8D28`, Red `#FF383C`, Purple `#CB30E0`. Row 2 — Blue `#0088FF`, Indigo `#6155F5` (selected), Purple `#CB30E0`, Pink `#FF2D55`, Add Button. Every dot binds `{System Colors/Light/…}` (1 Red, 2 Orange, 3 Yellow, 4 Green, 8 Blue, 9 Indigo, 10 Purple, 11 Pink), in Dark too.

Derived: dot pitch 56.75, so 26.75 between dots (the stored `gap25` does not match); 75 + 30 = 105 (x of the dot grid); 105 + 257 = 362; rows 30 + 15 + 30 = 75.

## Sizes

| Part | Size | Corner radius | Padding / gap | Label |
|---|---|---|---|---|
| iPhone sheet | 386 × 599 | 32 top, 58 bottom | pad 14,16,16,16 | — |
| iPad panel | 402 × 599 (popover 430 × 627) | from the popover component | pad 14,16,16,16 | — |
| Navigation bar | full width × 35 | — | pad bottom 11 | title from `Toolbars/􀻃/…/Titles - iPhone/Title` |
| Bar buttons | 24 × 24 | 0 | — | glyph SFPro-Medium 17 / 22 |
| Segmented control | full width × 32 (group 48) | from `Segmented Controls/…/Small` | group pad 4 top, 12 bottom | from the segmented control |
| Color grid | 360 × 300 master; 370 / 354 × 296 in use | 8 (clip group) | cells 30 × 30, no gaps | — |
| Opacity slider | 276 × 34 | max | pad 2,0,2,0 | — |
| Opacity scrubber | 34 × 34 | oval | — | — |
| Opacity field | 75 × 34 | 8 | pad 0,14,0,14 | SFPro-Semibold 17 / 22 |
| Current swatch | 75 × 75 | 10 | — | — |
| Saved swatch / Add | 30 × 30 | 15 | pitch 56.75 (derived), rows 15 apart | — |
| Selected ring | 24 × 24 oval, 2 pt white border | — | inset 3 | — |

## Colours and states

| Part | Dark | Light |
|---|---|---|
| iPhone screen fill (kit helper) | `#333333@60% {x. Kit/Symbol BG Dark}` | `#CCCCCC@60% {x. Kit/Symbol BG Light}` |
| Dimming | `Sheets/􀻃/Overlay/Dark` | `Sheets/􀻃/Overlay/Light` |
| iPhone sheet | glass `Liquid Glass/Dark/Regular - Large` | glass `Liquid Glass/Light/Regular - Large` |
| Bar button glyphs | `#EDEDED {Labels - Liquid Glass/Dark/1 Primary}`, blend plus-lighter | `#1A1A1A {Labels - Liquid Glass/Light/1 Primary}`, blend plus-darker |
| Opacity Meter background / border | `#FFFFFF` / 0.5 inside `#38383A {Separators/Dark/Opaque}` | `#FFFFFF` / 0.5 inside `#C6C6C8 {Separators/Light/Opaque}` |
| "Opacity" label | `#EBEBF5@60% {Labels/Dark/2 Secondary}` | `#000000 {Labels/Light/1 Primary}` |
| Opacity field | fill `#000000`, text `#FFFFFF {Labels/Dark/1 Primary}` | fill `#FFFFFF`, text `#000000` |
| Slider track / scrubber | as in Anatomy (same in both) | same |
| Swatches background | `#000000` | `#FFFFFF` |
| Add Button | fill `#787880@36% {Fills/Dark/1 Primary}`, plus `#FFFFFF {Labels/Dark/1 Primary}` | fill `#787878@20% {Fills/Light/1 Primary}`, plus `#000000 {Labels/Light/1 Primary}` |
| Selected swatch ring | `#FFFFFF`, 2 pt inside | `#FFFFFF`, 2 pt inside |

States: one selected saved swatch (ring) and the scrubber at 100%. Pressed, disabled or empty states are Not in the kit.

## Text

| Part | Content | Font | Size / lh | Colour | Text style |
|---|---|---|---|---|---|
| Title | "Colors" | from `Toolbars/􀻃/<Appearance>/Titles - iPhone/Title` | — | — | — |
| Leading button | 􀎗 U+100397 | SFPro-Medium | 17 / 22 | see Colours | none |
| Trailing button | 􀆄 U+100184 | SFPro-Medium | 17 / 22 | see Colours | none |
| "Opacity" | "Opacity" | SFPro-Semibold | 13 / 18 | see Colours | `09 Footnote/2 Bold` (layer also stores `transform1`) |
| Opacity value | "100%" | SFPro-Semibold | 17 / 22 | see Colours | none |

All text is centred except "Opacity" and "100%", which are left aligned. No tracking is set.

## Effects

iPhone sheet (`group "Stack"`, lines 219 and 235):

| Appearance | Style | Fill | Inner shadows | Shadows | Glass |
|---|---|---|---|---|---|
| Dark | `Liquid Glass/Dark/Regular - Large` | `#1A1A1A@50%` + `#1A1A1A@90%` (luminosity) + `#1A1A1A` (lighten) | x0 y-4 blur8 spread-4 `#222222`; x0 y4 blur8 spread-4 `#222222`; x0 y-1 blur1.5 spread-0.5 `#404040`; x0 y1 blur1.5 spread-0.5 `#404040` (all plus-lighter); x0 y2 blur0.2 spread-1.2 `#FFFFFF@20%` | x0 y18 blur48 spread0 `#000000@45%`; x0 y0 blur0.3 spread0.3 `#000000@50%`; x-1.25 and x1.25 y0 blur0 spread-0.75 `#BFBFBF` (plus-darker) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Light | `Liquid Glass/Light/Regular - Large` | `#FFFFFF@70%` (lighten) + `#BFBFBF@10%` (darken) | x0 y-4 blur2 spread-4 `#272727`; x0 y4 blur8 spread-4 `#272727`; x0 y-1 blur1.5 spread-0.5 `#272727`; x0 y1 blur1.5 spread-0.5 `#272727` (all plus-lighter); x0 y2 blur0.25 spread-1.2 `#FFFFFF` | x0 y18 blur46 spread0 `#000000@25%`; x0 y0 blur0.3 spread0.3 `#DBDBDB` (plus-darker); x-1.25 and x1.25 y0 blur0 spread-0.75 `#BFBFBF` (plus-darker) | radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 |

Other effects: scrubber shadow x0 y0 blur3 spread0 `#000000@10%`; `blend screen` on the grid: on the swatch fill in rows 0 and 150, on the swatch layer in rows 30, 120 and 180, and on the `Row` group in rows 60 and 90; rows 210, 240 and 270 use normal blending; vibrant bar glyphs (plus-lighter / plus-darker).

## Kit notes

The page has no documentation boards. The header (`use "_Header"`) is titled "Color Pickers"; its description begins "A color well lets people adjust the colo…" (cut off in the dump). The kit shows the picker as a bottom glass sheet on iPhone and in a bottom-middle popover on iPad, with the same grid, opacity and saved-swatch sections.

## Finding it in the spec

| What | Pattern |
|---|---|
| Pickers | `grep -n '^COMPONENT "Color Pickers/\(Light\|Dark\)' specs/color-pickers.txt` |
| Grid rows | `grep -n '^  group "Row" 360' specs/color-pickers.txt` |
| Grid swatches of one row | `grep -n -A12 '^  group "Row" 360×30 @0,150' specs/color-pickers.txt` |
| Opacity meter | `grep -n -A7 'Opacity Meter" 362' specs/color-pickers.txt` |
| Saved swatches | `grep -n 'Swatch - Dot\|Add Button' specs/color-pickers.txt` |
| Sheet glass | `grep -n 'group "Stack" 386×599' specs/color-pickers.txt` |
| Navigation bar | `grep -n -A7 'group "Navigation Bar"' specs/color-pickers.txt` |
