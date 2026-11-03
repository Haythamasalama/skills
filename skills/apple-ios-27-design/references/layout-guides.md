# Layout Guides — iOS 27

**Read when:** you need an exact iOS 27 value for layout Guides (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Layout Guides in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/layout-guides.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

This page covers iPhone Duo only. Safe areas and margins for other iPhone and iPad models are Not in the kit on this page (the page header is titled "Safe Areas and Margins"; see Kit notes).

## Components

15 components in two families. All are Light; there are no Dark variants on this page.

| Family | Axes | Values | Count |
|---|---|---|---|
| `_Layout Overlays/<Region>` | Region | Reserved Region, Safe Area Inset, Layout Margin | 3 |
| `Layout Guide/iPhone Duo/<Context>/<Display>` | Context | Standard, Sheets | 12 |
| | Display | Inner - Landscape - Folded, Inner - Landscape, Inner - Portrait - Folded, Inner - Portrait, Outer - Landscape, Outer - Portrait | |

Every Context × Display pair exists once (2 × 6 = 12).

Screen sizes (component size):

| Display | Width × Height |
|---|---|
| Inner - Landscape, Inner - Landscape - Folded | 951 × 669 |
| Inner - Portrait, Inner - Portrait - Folded | 669 × 951 |
| Outer - Landscape | 678 × 466 |
| Outer - Portrait | 466 × 678 |

## Anatomy

### `_Layout Overlays`

Each overlay is a 100 × 100 rectangle that the guides stretch over the region it marks. No children.

| Component | Fill | Opacity / blend |
|---|---|---|
| `_Layout Overlays/Layout Margin` | `#FF4245 {System Colors/Dark/1 Red}` | 50%, multiply |
| `_Layout Overlays/Safe Area Inset` | `#3CD3FE {System Colors/Dark/7 Cyan}` | 50%, multiply |
| `_Layout Overlays/Reserved Region` | `#6D7CFF {System Colors/Dark/9 Indigo}` | 50%, multiply |

Instances use the names `Layout Margin`, `Safe Area Inset`, `Fold Reserved Region` and `Camera Reserved Region` (both reserved regions use `Reserved Region`).

### `Layout Guide/iPhone Duo/…`

Every guide has a background `#FFFFFF {Backgrounds/Light/Primary}` and a group `Layout Guides and Safe Areas` the size of the screen at @0,0 holding the overlay instances. The rest depends on the display:

| Part (layer) | Used in | Size @ position | Nested component / stack |
|---|---|---|---|
| `Toolbar` | Inner (all 8), Outer - Portrait Standard | full width × 82 @0,0 | `Toolbars/Light/iPhone Duo/Top - Standard/Title` |
| `Vertical Bar` | Inner - Landscape (4), Outer (4) | 84 × screen height, at the right edge (x 867 inner, 594 outer landscape, 382 outer portrait) | `stack v gap8 pad24,24,24,12` |
| `Vertical Bar` › `Top` › `Stack` | same | 48 wide | `stack v gap12`; `Top` is `stack v gap6` |
| `Share`, `Close`, `Back` buttons | in `Stack` | 48 × 48 | `Toolbars/Light/Buttons/48pt/Active/Symbol 1` |
| `Status Bar - iPhone Duo - Vertical` | Inner - Landscape (4), Sheets/Outer - Portrait | 48 × 86 @0,0 in `Stack` | group, `fill #000000`, `stack v gap5 pad11,1,5,1`; `Time` "9:41" and `Ring` (Cell, Wifi, Battery) |
| `Status Bars` | Standard/Outer - Portrait | 48 × 83 | `Status Bars/iPhone Duo/Light Background/Vertical` |
| `Camera Punchout` | Outer (4) | 43 × 42 or 48 × 42 | empty group |
| `Lens` | Outer (4) | 95.67 × 95.67 (@370,0 portrait; @582,370 landscape) | `iPhone Duo/Outer Display Lens` |
| `Tab Bar` | Inner - Portrait (4) | 409 × 99 @130,852 | `stack h gap0 pad16,21,21,21`; `Tabs` 367 × 62 @21,16 → `Tab Bars/􀻃/Light/iPhone/Horizontal/Tabs - Search/5 Tabs` |
| `Overlay` | Sheets (6) | screen size @0,0 | `Sheets/􀻃/Overlay/Light` |
| `Sheet` | Sheets (6) | see Sizes | group with its own `Layout Guides and Safe Areas` |
| `Toolbar Top` | inside `Sheet` (6) | sheet width × 70 @0,0 | `Toolbars/Light/iPhone Duo/Top - Sheet/Title` |

Derived: the `Tab Bar` is centred (x 130 = (669 − 409) / 2).

## Sizes

### Screen guides (Standard and the screen behind each Sheet)

The screen-level guides are the same in the Standard and Sheets variant of each display, except that the Fold Reserved Region x is 455 in Standard/Inner - Landscape - Folded and 455.5 in Sheets/Inner - Landscape - Folded.

| Display | Layout Margin | Safe Area Inset | Camera Reserved Region | Fold Reserved Region |
|---|---|---|---|---|
| Inner - Landscape | left 20 (20 × 669 @0,0); none on the right | top 84 (951 × 84 @0,0); right 84 (84 × 669 @867,0) | 84 × 119 @867,0 | — |
| Inner - Landscape - Folded | as above | as above | 84 × 119 @867,0 | 40 × 669 @455,0 (Standard) / @455.5,0 (Sheets) |
| Inner - Portrait | left 20 @0,0 and right 20 @649,0 (20 × 951) | top 84 (669 × 84 @0,0); bottom 99 (669 × 99 @0,852) | 134 × 84 @535,0 | — |
| Inner - Portrait - Folded | as above | as above | 134 × 84 @535,0 | 669 × 40 @0,455.5 |
| Outer - Landscape | left 20 (20 × 466 @0,0) | right 84 (84 × 466 @594,0) | none | — |
| Outer - Portrait | left 20 (20 × 678 @0,0) | right 84 (84 × 678 @382,0) | 84 × 169 @382,0 | — |

Derived: the fold region is centred on the inner display (455.5 = (951 − 40) / 2 and (951 − 40) / 2 vertically in portrait). In portrait the bottom safe area height (99) equals the `Tab Bar` height.

### Vertical Bar contents

| Variant | Bar | `Top` group | Contents, top to bottom (y in `Stack`) |
|---|---|---|---|
| Standard/Inner - Landscape (both) | 84 × 669 @867,0 | 48 × 206 @12,24 | Status bar 0, Close 98, Share 158 |
| Sheets/Inner - Landscape (both) | 84 × 669 @867,0 | 48 × 146 @12,24 | Status bar 0, Close or Back 98 (glyph 􀆉) |
| Standard/Outer - Portrait | 84 × 678 @382,0 | 48 × 251 @12,24 | Camera Punchout 0 (in `Top`); `Stack` @0,48: Status Bars 0, Close 95, Share 155 |
| Sheets/Outer - Portrait | 84 × 678 @382,0 | 48 × 194 @12,24 | Camera Punchout @2.5,0; `Stack` @0,48: Status bar 0, Back 98 |
| Standard/Outer - Landscape | 84 × 466 @594,0 | 48 × 108 @12,24 | Close 0, Share 60; `Bottom` 43 × 45 @14.5,397 (`stack v gap6 pad0,0,3,0`) with Camera Punchout |
| Sheets/Outer - Landscape | 84 × 466 @594,0 | 48 × 48 @12,24 | `Back` 48 × 48 glass button (see Effects); `Bottom` as Standard |

Derived: bar padding 24 top, 24 right, 24 bottom, 12 left (`pad24,24,24,12`), so the 48 pt buttons sit at x 12 inside the 84 pt bar, leaving 24 on the right.

### Sheets

| Display | Sheet size @ position | Corners (TL/TR/BR/BL) | Fill | Sheet guides |
|---|---|---|---|---|
| Inner - Landscape | 653 × 356 @149,305 | 40 | glass `Liquid Glass/Light/Regular - Medium` | margins 16 left @0 and right @637; top safe area 653 × 76 |
| Inner - Landscape - Folded | 468 × 356 @8,305 | 40 | glass `Liquid Glass/Light/Regular - Medium` | margins 16 left @0 and right @452; top safe area 468 × 76 |
| Inner - Portrait | 653 × 356 @8,587 | 40/40/48/48 | glass `Liquid Glass/Light/Regular - Medium` | margins 16 left @0 and right @637; top safe area 653 × 76 |
| Inner - Portrait - Folded | 653 × 356 @8,587 | 40/40/48/48 | glass `Liquid Glass/Light/Regular - Medium` | as Inner - Portrait |
| Outer - Landscape | 662 × 458 @8,8 | 40/40/0/0 | `#FFFFFF {Backgrounds/Light/Primary}` | margin 16 left; top safe area 662 × 76; right safe area 76 × 458 @586,0 |
| Outer - Portrait | 450 × 356 @8,314 | 40/40/48/8 | glass `Liquid Glass/Light/Regular - Medium` | margin 16 left; top safe area 450 × 76; right safe area 76 × 356 @374,0 |

All sheets are `stack v gap0 pad0,0,0,0`. `Toolbar Top` inside each sheet is 70 tall with corners 40, or 48 in Inner - Portrait (both) and Outer - Portrait. The sheet guide overlays carry corners 40 (Inner - Landscape, Outer - Landscape), 48 (Inner - Portrait) or 0 (Outer - Portrait).

Sheet `Vertical Bar` (Outer only): 76 wide at the sheet's right edge, `stack v gap8 pad16,16,24,12`; Outer - Portrait adds `Top` `pad3,0,0,0` and Close @0,0, Share @0,60 with corners 32; Outer - Landscape has Close @0,0, Share @0,60 with corners 24, and a `Camera Punchout` 43 × 42 @14.5,392.

Derived from the positions:

- Sheets float 8 from the screen edges they don't touch: x 8 (all but Inner - Landscape), and bottom gap 8 (Inner portrait 951 − 587 − 356; Inner landscape 669 − 305 − 356; Outer portrait 678 − 314 − 356). Outer - Landscape runs to the bottom edge (8 + 458 = 466) with square bottom corners.
- Inner - Landscape sheet is centred: 149 = (951 − 653) / 2.
- Inner - Landscape - Folded sheet ends at x 476 (8 + 468), inside the fold region that starts at 455.5.
- Layout margin inside a sheet is 16; on the screen it is 20. Top safe area inside a sheet is 76; on the inner screen it is 84.

## Colours and states

Only the Light appearance is in the kit. There are no state variants.

| Part | Colour |
|---|---|
| Screen background, Outer - Landscape sheet | `#FFFFFF {Backgrounds/Light/Primary}` |
| Layout Margin overlay | `#FF4245 {System Colors/Dark/1 Red}` at 50%, multiply |
| Safe Area Inset overlay | `#3CD3FE {System Colors/Dark/7 Cyan}` at 50%, multiply |
| Reserved Region overlay | `#6D7CFF {System Colors/Dark/9 Indigo}` at 50%, multiply |
| Glass sheets | style `Liquid Glass/Light/Regular - Medium` (see `materials.md`) |
| `Back` glass button symbol | `#1A1A1A {Labels - Liquid Glass/Light/1 Primary}`, blend plus-darker |
| Vertical status bar group / Time text | `#000000` / `#000000` |
| Dimming behind sheets | `Sheets/􀻃/Overlay/Light` (component on the Sheets page) |

The overlays bind Dark swatches (`System Colors/Dark/…`) although every guide is Light.

## Text

| Layer | Content | Font | Size | Colour | Align |
|---|---|---|---|---|---|
| `Time` (vertical status bar) | "9:41" | SFProRounded-Bold | 16 (no lh stored) | `#000000` | center |
| `Symbol` (`Back` glass button) | 􀆉 U+100189 | SFPro-Medium | 17, lh22 | `#1A1A1A {Labels - Liquid Glass/Light/1 Primary}` | center |

Glyphs set as overrides on the 48 pt toolbar buttons: 􀈂 U+100202 (layer `Share`), 􀆄 U+100184 (layer `Close`), 􀆉 U+100189 (layer `Back`, and the `Close` layer in Sheets/Inner - Landscape - Folded). 􀻃 U+100EC3 appears only inside component paths (`Tab Bars/􀻃/…`, `Sheets/􀻃/…`).

## Effects

Glass sheet (`group "Sheet"`, style `Liquid Glass/Light/Regular - Medium`, values as stored on the layer, line 134):

| Effect | Value |
|---|---|
| Fill | `#CCCCCC@70%` (blend lighten) + `#BFBFBF@10%` (blend darken) |
| Inner shadows | x0 y-4 blur2 spread-4 `#272727` (plus-lighter); x0 y4 blur8 spread-4 `#272727` (plus-lighter); x0 y-1 blur1.5 spread-0.5 `#272727` (plus-lighter); x0 y1 blur1.5 spread-0.5 `#272727` (plus-lighter); x0 y2 blur0.25 spread-1.2 `#FFFFFF` |
| Shadows | x0 y18 blur46 spread0 `#000000@25%`; x0 y0 blur0.3 spread0.3 `#DBDBDB` (plus-darker); x-1.25 y0 blur0 spread-0.75 `#DBDBDB` (plus-darker); x1.25 y0 blur0 spread-0.75 `#DBDBDB` (plus-darker) |
| Glass blur | radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 |

`Back` button in Sheets/Outer - Landscape (line 78): style `Liquid Glass/Light/Regular - Small`, 48 × 48, `corners max`, `stack v gap0 pad4,4,4,4`, with the values listed for that style in `materials.md` (fill `#F8F8F8@20%` luminosity + `#000000@25%` + `#FFFFFF@25%` + `#444444@60%` plus-lighter; glass radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0). Its child `Button 1` is 40 × 40 @4,4.

Overlays: opacity 50% with blend multiply.

## Kit notes

The page has no documentation boards. The header instance (`use "_Header"`, 1600 × 160) is titled "Safe Areas and Margins", and its description begins "A consistent layout that adapts across d…" (cut off in the dump). The guides themselves are the documentation: red marks layout margins, cyan marks safe area insets, indigo marks regions reserved for the camera and the fold.

## Finding it in the spec

| What | Pattern |
|---|---|
| All guides | `grep -n '^COMPONENT "Layout Guide/' specs/layout-guides.txt` |
| Overlay masters | `grep -n '^COMPONENT "_Layout Overlays' specs/layout-guides.txt` |
| Margins / safe areas / reserved regions | `grep -n 'use "Layout Margin"\|use "Safe Area Inset"\|Reserved Region"' specs/layout-guides.txt` |
| Sheets | `grep -n 'group "Sheet"' specs/layout-guides.txt` |
| Vertical bars | `grep -n 'group "Vertical Bar"' specs/layout-guides.txt` |
| Tab bar | `grep -n 'group "Tab Bar"' specs/layout-guides.txt` |
