# Toolbars: sizes, colours, text and effects — iOS 27

**Read when:** you need the sizes, colours, text and effects of toolbars on iOS 27, as Apple's kit draws them.
**Owns:** Toolbars in Apple's iOS 27 kit: sizes, colours and states, text, effects, kit notes.

Source: `specs/toolbars.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `toolbars.md`.

## Sizes

### Toolbar buttons

| Size / kind | W×H | Corner radius | Insets (stored pad T,R,B,L) | Content | Glyph / label | Gap |
|---|---|---|---|---|---|---|
| 44pt Symbol 1 | 44×44 | max | 4,4,4,4 | 36×36 symbol | SFPro-Medium 17 | — |
| 44pt Symbol 1 - Prominent | 44×44 | max | 0 (Dark) / 3,0,3,0 (Light) | 44×44 symbol | SFPro-Medium 17 | — |
| 44pt Horizontal Group - Symbol 2 / 3 | 104×44 / 160×44 | max | 0,6,0,6 | 36×36 each, y 4 | SFPro-Medium 17 | 20 |
| 44pt Text | 67×44 | max | 0,12,0,12 | label 43×22 @12,11 | SFPro-Medium 17 | — |
| 44pt Back with Title | 80×44 | max | 0,11,0,14 (Light 11,11,11,14) | chevron 16×22 @14,11 + label 39×22 @30,11 | SFPro-Semibold 17 / SFPro-Medium 17 | 0 (derived: 30 = 14 + 16) |
| 34pt Close Button | 34×34 | max (Dark), 100 (Light) | 4,4,4,4 | glyph box 36×36 @-1,-1 | SFPro-Medium 20 | — |
| 48pt Symbol 1 | 48×48 | max | 4,4,4,4 | 40×40 symbol | SFPro-Medium 17 | — |
| 48pt Horizontal Group - Symbol 2 / 3 | 110×48 / 164×48 | max | 0,10,0,10 (Light 6,10,6,10 / 5,10,7,10) | 36×36 each | SFPro-Medium 17 | 18 |
| 48pt Vertical Group - Symbol 2 / 3 | 48×110 / 48×164 | max | 10,6,10,6 | 36×36 each | SFPro-Medium 17 | 18 |
| 48pt Text | 69×48 | max | 13,13,13,13 | label 43×22 @13,13 | SFPro-Medium 17 | — |

Derived checks: 160 = 6 + 3 × 36 + 2 × 20 + 6; 164 = 10 + 3 × 36 + 2 × 18 + 10.

### Bars

| Bar | W×H | Side inset | Item size | Item spacing |
|---|---|---|---|---|
| iPhone top, Standard | 402 × 54 / 105 / 125 | 16 (derived: leading x 16; 402 − 342 − 44 = 16) | 44×44 | group gap 12 |
| iPhone top, Sheet | 402 × 70 / 121 / 141 | 16 | 44×44 sheet buttons | — |
| iPad top | 1210 × 54 / 102 / 125 | 20 (derived: 1210 − 674 − 516 = 20) | 44×44, search 180×44 | 12; button pitch 56 (derived) |
| iPad tab bar | 1210 × 54–115; search-selected 130–191 | 20; search row 40 | 44×44; tab bar 507.4×44; search 1130×44 | 12 |
| iPhone Duo top, Standard | 600 × 82 / 126 | pad 24 top, 24 right, 10 bottom, 20 left | 48×48 | 12 |
| iPhone Duo top, Sheet | 600 × 74 / 118 | pad 16,16,10,16 | 48×48 | 12 |
| iPhone bottom | 402×56 | 28 | 48×48, fields 286/346 × 48 | 12 |
| iPad bottom | 1190×44 | 10 | 44×44 | 12 |

### Other parts

| Part | W×H | Corner radius |
|---|---|---|
| Sheet Grabber (iPhone) | 60×4 @171,5 | 2 |
| Sheet Grabber (iPhone Duo) | 60×4 @270,10 | 2 |
| Sheet header buttons | 44×44 | 24 |
| Search field | 180×48 or 180/181×44 (instances stretch) | max |
| Segmented Control (iPad search row) | 250×44, segments 117×36 | 22; segments 18; selected background 20 |
| Buttons - Symbol/Selected BG | 36×36 | 19 |
| Duo single-line title groups ("Title", "Stack") | 148, 388 or 448 wide × 22 or 34 | 8 (the two-line "Titles" groups store none) |

## Colours and states

### Bar backgrounds (as stored)

| Bar | Dark | Light |
|---|---|---|
| iPhone and iPad top bars | #333333@60% {x. Kit/Symbol BG Dark} + #FFFFFF + #FFFFFF | #CCCCCC@60% {x. Kit/Symbol BG Light} + #FFFFFF + #FFFFFF |
| iPad bottom | #333333@60% {x. Kit/Symbol BG Dark} + #FFFFFF | #CCCCCC@60% {x. Kit/Symbol BG Light} + #FFFFFF |
| iPhone bottom | #FFFFFF | #FFFFFF |
| iPhone Duo top | #333333@60% {x. Kit/Symbol BG Dark} | #CCCCCC@60% {x. Kit/Symbol BG Light} |
| Example canvases | #000000 (Duo: {Backgrounds/Dark - Base/Primary}) | #FFFFFF {Backgrounds/Light/Primary} |

The `x. Kit/…` swatches are kit helper colours in `tokens.txt`. The bars have no glass of their own; glass sits on the buttons, groups and fields. In the iPhone examples a `Scroll Edge Effect/Top - Soft (no text)` instance sits behind the status and navigation bars, with fill overrides #000000 {Backgrounds Grouped/Dark - Base/Primary} (Dark) and #FFFFFF {Backgrounds/Light/Primary} (Light).

### Glass containers (all toolbar buttons, groups, search fields, segmented control)

| State | Dark | Light |
|---|---|---|
| Active | `style="Liquid Glass/Dark/Regular - Small"` | `style="Liquid Glass/Light/Regular - Small"` |
| Inactive | `Liquid Glass/Dark/Regular - Small - Inactive`: fill #767680@24% {Fills/Dark/3 Tertiary}, shadow x0 y0 blur0 spread0.5 #E6E6E6 (plus-darker) | `Liquid Glass/Light/Regular - Small - Inactive`: fill #000000@2% {Fills/Light/5 Quinary}, shadow x0 y0 blur0 spread0.5 #EBEBEB (plus-darker) |
| Prominent, Active | "Tint Color" fill #FFFFFF@96% + #0091FF {System Colors/Dark/8 Blue} (plus-darker) under "Tinted Glass" `Liquid Glass/Dark/Regular - Small - Tinted` | #FFFFFF@96% + #0088FF {System Colors/Light/8 Blue} (plus-darker) under `Liquid Glass/Light/Regular - Small - Tinted` |
| Prominent, Inactive | Inactive style only, no tint | Inactive style only, no tint |

A script check confirmed that every inline effect list on this page equals its named style in `tokens.txt`.

### Content states

| Part / state | Dark | Light |
|---|---|---|
| Symbol, Default | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |
| Symbol, Tinted | #0088FF {System Colors/Light/8 Blue}, plus-lighter | #0088FF {System Colors/Light/8 Blue}, plus-darker |
| Symbol, Disabled | #404040 {Labels - Liquid Glass/Dark/3 Tertiary}, plus-lighter | #BFBFBF {Labels - Liquid Glass/Light/3 Tertiary}, plus-darker |
| Symbol, Selected | BG #0091FF {System Colors/Dark/8 Blue}; symbol #FFFFFF, no blend | BG #0088FF {System Colors/Light/8 Blue}; symbol #FFFFFF |
| Search clear symbol | as Default | as Default |
| Prominent symbol (Active and Inactive) | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | Active: #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter · Inactive: #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |
| Close Button glyph (34pt) | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |
| Text label, Default (and Back with Title) | #C2C2C2 (unbound), plus-lighter | #4C4C4C (unbound), plus-darker |
| Text label, Disabled | #EBEBF5@30% {Labels/Dark/3 Tertiary}, no blend | #3C3C43@30% {Labels/Light/3 Tertiary}, no blend |

Inactive containers keep the Default content colours.

### Titles

| Part | Dark | Light |
|---|---|---|
| Title, Large Title (iPhone and iPad) | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |
| Subtitle | #8A8A8A {Labels - Liquid Glass/Dark/2 Secondary}, plus-lighter | #727272 {Labels - Liquid Glass/Light/2 Secondary}, plus-darker |
| iPhone Duo title | #FFFFFF {Labels/Dark/1 Primary}, no blend | #000000 {Labels/Light/1 Primary} |
| iPhone Duo subtitle | #EBEBF5@60% {Labels/Dark/2 Secondary} | #3C3C43@60% {Labels/Light/2 Secondary} |

### Search fields

| Master | Part | Dark | Light |
|---|---|---|---|
| 48 pt | glyphs, placeholder | #8A8A8A {Labels - Liquid Glass/Dark/2 Secondary}, plus-lighter | #727272 {Labels - Liquid Glass/Light/2 Secondary}, plus-darker |
| 48 pt | value text | #EDEDED {Labels - Liquid Glass/Dark/1 Primary} | #1A1A1A {Labels - Liquid Glass/Light/1 Primary} |
| 44 pt | glyphs, placeholder | #999999 {Labels/Dark - Vibrant/2 Secondary}, plus-lighter | #999999 {Labels/Light - Vibrant/2 Secondary}, plus-darker |
| 44 pt | value text | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, no blend | #000000 {Labels/Light - Vibrant/1 Primary}, plus-darker |
| both | cursor | #0091FF {System Colors/Dark/8 Blue} | #0088FF {System Colors/Light/8 Blue} |

### Segmented control (iPad search row)

| Part | Dark | Light |
|---|---|---|
| Container, Active / Inactive | Regular - Small / Regular - Small - Inactive | same, Light styles |
| Selected background | #1F1F1F {Fills/Dark - Vibrant/2 Secondary}, plus-lighter | #E0E0E0 {Fills/Light - Vibrant/2 Secondary}, plus-darker |
| Labels | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |

### Sheet header buttons and grabber

| Part | Dark | Light |
|---|---|---|
| Primary fill / symbol | #0091FF {System Colors/Dark/8 Blue} / #FFFFFF | #0088FF {System Colors/Light/8 Blue} / #FFFFFF |
| Close Button fill | #787880@32% {Fills/Dark/2 Secondary} | #787880@16% {Fills/Light/2 Secondary} |
| Close Button glyph | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, plus-lighter | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, plus-darker |
| Grabber | #333333, plus-lighter, blur background radius6 saturation2 | #CFCFCF, plus-darker, blur background radius6 saturation2 |

Light Active and Light Inactive sheet buttons store the same values. Dark has `Dark/Primary` and `Dark/Active/Primary` (identical), and no Inactive set.

## Text

No text layer on this page stores tracking (`kern`), so tracking is 0 throughout.

| Part | Font | Size | Line height | Align | Text style |
|---|---|---|---|---|---|
| Title (Titles - iPhone/iPad "Title") | SFPro-Semibold | 17 | 22 | center | 05 Headline/1 Default |
| Large Title | SFPro-Bold | 34 | 41 | left | 01 LargeTitle/2 Bold |
| Large Title subtitle | SFPro-Medium | 15 | 20 | left | 08 Subheadline/1 Default (the style is SFPro-Regular) |
| iPhone two-line title | SFPro-Semibold | 15 | 20 | left | 08 Subheadline/2 Bold |
| iPad two-line title | SFPro-Semibold | 17 | 22 | center; Dark (Left) left | 05 Headline/1 Default |
| Two-line subtitle | SFPro-Medium | 12 | 16 | left (Left) / center | 10 Caption1/1 Default (the style is SFPro-Regular) |
| iPhone Duo title | SFPro-Semibold | 17 | 22 | left | none |
| iPhone Duo Large / Compact Large | SFPro-Bold | 28 | 34 | left | none |
| iPhone Duo two-line title / subtitle | SFPro-Semibold 15 / SFPro-Medium 12 | 15 / 12 | 18 / 14 | left | none |
| Button symbol (Buttons - Symbol, Prominent, sheet buttons) | SFPro-Medium | 17 | 22 | center | none |
| 34pt Close glyph | SFPro-Medium | 20 | 22 | center | none |
| Text button label, "Back" | SFPro-Medium | 17 | 22 | center / left | none |
| Back chevron `􀯶` | SFPro-Semibold | 17 | 22 | center | none |
| Search text, 48 pt field | SFPro-Regular | 17 | 22 | left | none |
| Search text, 44 pt field | SFPro-Medium | 17 | 22 | left | none |
| Search glyphs | SFPro-Medium | 17 | 22 | center | none |
| Segmented label, Unselected / Selected | SFPro-Medium / SFPro-Semibold | 14 | 18 | center | 09 Footnote/2 Bold (the style is SFPro-Semibold 13 lh18) |
| Page labels "Toolbar - Top", "Toolbar - Bottom" | SFPro-Bold | 36 | — | left | none (#FFFFFF) |

## Effects

Glass styles used on this page, exactly as stored (also in `materials.md`):

```
Liquid Glass/Dark/Regular - Small
  fill #000000 (blend screen) + #999999@17%
  inner-shadow x20 y0 blur20 spread-30 #B2B2B2 (plus-darker) · inner-shadow x-20 y0 blur20 spread-30 #B2B2B2 (plus-darker)
  inner-shadow x0 y-4 blur0.5 spread-4 #666666 (plus-lighter) · inner-shadow x0 y4 blur0.5 spread-4 #666666 (plus-lighter)
  inner-shadow x0 y-1 blur0 spread0 #171717 (plus-lighter) · inner-shadow x0 y1 blur0 spread0 #171717 (plus-lighter)
  inner-shadow x0 y-40 blur10 spread-40 #1A1A1A (plus-lighter) · inner-shadow x0 y40 blur10 spread-40 #1A1A1A (plus-lighter)
  shadow x0 y8 blur15 spread0 #000000@4%
  shadow x0 y0 blur0 spread0.5 #BFBFBF (plus-darker) · shadow x-1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker) · shadow x1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker)
  blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0

Liquid Glass/Light/Regular - Small
  fill #F8F8F8@20% (blend luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (blend plus-lighter)
  shadow x0 y8 blur15 spread0 #000000@2%
  shadow x0 y0 blur0 spread0.5 #DBDBDB (plus-darker) · shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (plus-darker) · shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (plus-darker)
  inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (plus-darker) · inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (plus-darker)
  inner-shadow x0 y-4 blur0.5 spread-4 #666666 (plus-lighter) · inner-shadow x0 y4 blur0.5 spread-4 #666666 (plus-lighter)
  inner-shadow x0 y-1 blur0 spread0 #171717 (plus-lighter) · inner-shadow x0 y1 blur0 spread0 #171717 (plus-lighter)
  inner-shadow x0 y40 blur30 spread-40 #E6E6E6 (plus-darker)
  inner-shadow x0 y-40 blur10 spread-40 #282828 (plus-lighter) · inner-shadow x0 y40 blur10 spread-40 #282828 (plus-lighter)
  blur glass radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0

Liquid Glass/Dark/Regular - Small - Tinted
  fill #000000 (blend screen)
  inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (plus-darker) · inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (plus-darker)
  inner-shadow x0 y-4 blur0.5 spread-4 #999999 (plus-lighter) · inner-shadow x0 y4 blur0.5 spread-4 #999999 (plus-lighter)
  inner-shadow x0 y-1 blur0 spread0 #262626 (plus-lighter) · inner-shadow x0 y1 blur0 spread0 #262626 (plus-lighter)
  inner-shadow x0 y-40 blur10 spread-40 #111111 (plus-lighter) · inner-shadow x0 y40 blur10 spread-40 #111111 (plus-lighter)
  shadow x0 y8 blur15 spread0 #000000@4%
  shadow x-1.25 y0 blur0 spread-0.75 #E6E6E6 (plus-darker) · shadow x1.25 y0 blur0 spread-0.75 #E6E6E6 (plus-darker)
  blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0

Liquid Glass/Light/Regular - Small - Tinted
  same as the Dark Tinted style except the fill: #FFFFFF (blend multiply)

Liquid Glass/Dark/Regular - Small - Inactive
  fill #767680@24% {Fills/Dark/3 Tertiary} · shadow x0 y0 blur0 spread0.5 #E6E6E6 (plus-darker)

Liquid Glass/Light/Regular - Small - Inactive
  fill #000000@2% {Fills/Light/5 Quinary} · shadow x0 y0 blur0 spread0.5 #EBEBEB (plus-darker)
```

Other effects:

| Part | Effect |
|---|---|
| Prominent "Tint Color" | fill #FFFFFF@96% + blue swatch with blend plus-darker, 45×45 @-0.5,-0.5, corners max |
| Sheet Grabber | blur background radius6 saturation2; blend plus-lighter (Dark) / plus-darker (Light) |
| Vibrant content | Dark content uses blend plus-lighter, Light content plus-darker (table above lists the exceptions with no blend) |
| Segmented selected background | blend plus-lighter (Dark) / plus-darker (Light) |

## Kit notes

- The page has no documentation boards. Its only notes are the page header (`_Header`, title "Toolbars"; the dump stores its description only up to "A toolbar provides convenient access to") and two section labels, "Toolbar - Top" and "Toolbar - Bottom".
- The examples show the intended stacking on iPhone: status bar, then the navigation bar at y 62, a soft scroll edge effect behind both, and the bottom toolbar 32 pt above the bottom of the 874 pt screen (derived: 874 − 786 − 56 = 32). On iPad the bottom toolbar sits at y 776 (Dark) or 780 (Light) next to a floating window resize handle.
- On iPhone Duo the examples put toolbar buttons in a vertical bar on the edge of the screen: a vertical status bar above a vertical button group, and a camera punch-out area on the outer display.
- `specs/change-log.txt`: 27.1.0 added iPhone Duo symbols and examples, toolbars among them; 27.1.1 says "Fixed several layout bugs with toolbars".

## Finding it in the spec

| Family | grep in `specs/toolbars.txt` |
|---|---|
| Examples | `grep -n '^COMPONENT "Examples/Toolbar'` |
| iPhone top bars | `grep -n '^COMPONENT "Toolbars/[A-Za-z]*/iPhone/Top'` |
| iPad top bars | `grep -n '^COMPONENT "Toolbars/[A-Za-z]*/iPad/\(Top\|Tab Bar\)'` |
| iPhone Duo top bars | `grep -n '^COMPONENT "Toolbars/[A-Za-z]*/iPhone Duo/'` |
| Bottom toolbars | `grep -n '^COMPONENT "Toolbars/[A-Za-z]*/\(iPhone\|iPad\)/Bottom'` |
| Toolbar buttons | `grep -n '^COMPONENT "Toolbars/[A-Za-z]*/Buttons/'` (add `44pt`, `48pt` or `34pt`) |
| Button content | `grep -n '^COMPONENT "Toolbars/􀻃/[A-Za-z]*/\(Buttons - \|Search - Clear\)'` |
| Titles | `grep -n 'Titles - iPhone\|Titles - iPad'` |
| Search fields | `grep -n '^COMPONENT "Toolbars/􀻃/[A-Za-z]*/Search - Bottom'` |
| iPad search rows, segmented | `grep -n 'Tab Bar/Search Field\|Segmented Control Buttons'` |
| Sheet header buttons | `grep -n '^COMPONENT "Sheets (iPhone)'` |
| Glass style uses | `grep -n 'style="Liquid Glass'` |
