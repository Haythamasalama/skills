# Date and Time Pickers — iOS 27

**Read when:** you need an exact iOS 27 value for date and Time Pickers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Date and Time Pickers in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/date-and-time-pickers.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

50 components. Every family has a Light and a Dark version. `􀻃` (U+100EC3) marks the building-block components.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Examples | `Examples/Date and Time Picker/<Appearance>` | Light, Dark | 2 |
| Wheel | `Date and Time Pickers/Wheel/<Appearance>/Time Picker` | Light, Dark | 2 |
| Compact Picker | `Date and Time Pickers/Compact Picker/<Appearance>/<Mode>` | Mode: Date and Time, Time, Date | 6 |
| Inline Picker | `Date and Time Pickers/Inline Picker/<Appearance>/<Mode>` | Mode: Date and Time, Time, Date | 6 |
| Segmented Control button | `Date and Time Pickers/Segmented Control/􀻃/<Appearance>/<State>` | State: Button, Button Active | 4 |
| AM-PM | `Date and Time Pickers/􀻃/<Appearance>/AM-PM` | — | 2 |
| Time field | `Date and Time Pickers/􀻃/Dark/Time`, `Date and Time Pickers/􀻃/Light/Time Picker Time Light` | — | 2 |
| Date cell | `Date and Time Pickers/􀻃/Dark/Dates/<State>`, `Date and Time Pickers/􀻃/Dates/Light/<State>` | State: Default, Current, Selected, Current and Selected | 8 |
| Date Picker Week | `Date and Time Pickers/􀻃/<Appearance>/Date Picker Week` | — | 2 |
| Date Picker Month | `Date and Time Pickers/􀻃/<Appearance>/Date Picker Month` | — | 2 |
| Date Picker Header Collapsed | `Date and Time Pickers/􀻃/<Appearance>/Date Picker Header Collapsed` | — | 2 |
| Time Picker row | `Date and Time Pickers/􀻃/<Appearance>/Time Picker` | — | 2 |
| Buttons | `Date and Time Pickers/􀻃/<Appearance>/Buttons/<Kind>/<State>` | Kind: Time, Date; State: Idle, Selected | 8 |
| Buttons pair | `Date and Time Pickers/􀻃/<Appearance>/Buttons/Date and Time` | — | 2 |

Note the different axis order for the date cells: Dark is `…/􀻃/Dark/Dates/…`, Light is `…/􀻃/Dates/Light/…`.

## Anatomy

### Compact Picker (floating glass card)

| Mode | Card | Children (top to bottom) |
|---|---|---|
| Date and Time | 320 × 379 (Dark), 320 × 378 (Light); `stack v gap0 pad0,12,0,12` | `Header` 296 × 40 @12,0 → Date Picker Header Collapsed; `Month` 296 × 286 @12,40 → Date Picker Month; Dark only: `Separator` 296 × 1 @12,326; `Time Picker Inline` 296 × 52 @12,327 (Dark) / @12,326 (Light) → Time Picker row |
| Date | 320 × 325 (Dark), 320 × 326 (Light); `stack v gap0 pad0,12,0,12` | `Header` 296 × 40 @12,0; `Month` (Light layer name `Date Picker`) 296 × 285 (Dark) / 296 × 286 (Light) @12,40 |
| Time | 320 × 52; `stack h gap0 pad0,16,0,16` | `Time Picker Inline` 288 × 52 @16,0 → Time Picker row |

Derived: content inset 12 on each side for Date and Date and Time (296 = 320 − 2 × 12); 16 for Time (288 = 320 − 2 × 16).

### Inline Picker (in-content, full width)

| Mode | Size | Children |
|---|---|---|
| Date and Time | 402 × 384 (Dark, `stack v gap3 pad0,16,0,16`), 402 × 382 (Light, `stack v gap0 pad0,16,0,16`) | `Header` 370 × 40 @16,0 (Dark) / 370 × 44 @16,0 (Light); `Month` 370 × 286 @16,43 (Dark) / @16,44 (Light); `Time` → Inline Picker/Dark/Time 370 × 52 @16,332 (Dark) / `Time Picker` → 􀻃/Light/Time Picker 370 × 52 @16,330 (Light); Light only: `Separator Color` 386 × 0.5 @16,382 |
| Date | 402 × 325 (Dark), 402 × 326 (Light); `stack v gap0 pad0,16,0,16` | `Header` 370 × 40 @16,0; `Month` 370 × 285 / 286 @16,40; bottom rule 386 × 0.5 @16,325 (Dark `Rectangle`) / @16,325.5 (Light `Separator Color`) |
| Time | 402 × 52; `stack h gap0 pad0,16,0,16` | `Time` text 38 × 22 @16,15; `Stack` 182 × 36 @204,8 (`stack h gap8`): `Time Picker` 74 × 36 @0,0 (Light 74 × 34 @0,1) + `AM / PM` 100 × 36 @82,0; bottom rule 370 × 0.5 @16,52 |

Derived: the inline Time stack is right-aligned to the 16 margin (204 + 182 = 386 = 402 − 16).

### Building blocks

| Component | Size | Structure |
|---|---|---|
| Date Picker Header Collapsed | 326 × 40, `stack h gap154 pad13,6,3,8` | `Stack` 99 × 24 @8,13 (`stack h gap4 pad2,0,0,0`): month text "April 2026" 84 × 22 @0,2 + chevron 􀆊 11 × 18 @88,4. `Arrows - Next and Previous` 56 × 24 @264,13: 􀆉 15 × 24 @0,0 and 􀆊 15 × 24 @43,0 |
| Date Picker Month | 354 × 285 (Dark, `stack v gap3 pad8,0,8,0`), 350 × 286 (Light, `stack v gap4 pad8,0,8,0`) | `Week` header 354/350 × 18 @0,8; `Stack` 354/350 × 248 @0,29 (Dark) / @0,30 (Light), `stack v gap7`, with `Week 1`–`Week 5` (each → Date Picker Week, 44 tall) at y 0, 51, 102, 153, 204; bottom rule 350 × 0.5 @0,285 (Dark `Rectangle`) / @0,286 (Light `Separator Color`) |
| `Week` header (weekday labels) | 354 × 18, `stack h gap19 pad0,8,0,8` (Dark); 350 × 18, `stack h gap24 pad0,8,0,8` (Light) | `Sun`…`Sat`, each 32 × 18; x 8, 59, 110, 161, 212, 263, 314 (Dark); 8, 58.33, 108.67, 159, 209.33, 259.67, 310 (Light) |
| Date Picker Week | 338 × 38, `stack h gap5 pad0,0,0,0` | `Day 1`–`Day 7` → date cell (Default), 38 × 38 at x 0, 50, 100, 150, 200, 250, 300 |
| Date cell | 38 × 38, `corners max` | `Date` text 38 × 38 @0,0 (Light Default: 9 × 24 @14.93,7); Current adds `Frame` 38 × 38 at 12% opacity |
| Time Picker row | 326 × 52, `stack h pad8,8,8,8` (gap104 Dark, gap70 Light) | `Time` label 126 × 36 @8,8; `Stack` 184 × 36 @134,8 (`stack h gap10`): `Time Picker` 74 × 36 @0,0 → Time field, `AM / PM` (Light `AM/PM`) 100 × 36 @84,0 → AM-PM |
| Time field | 67 × 36 (Dark `Time`), 67 × 34 (Light `Time Picker Time Light`); `corners max`, `stack h gap1 pad0,8,0,8` | `Hour` "3" 22 wide @8,0; `Stack` 5 wide @31,0 (`stack v gap0`, pad bottom 1 Dark / 3 Light) holding `Colon` ":" (5 × 35 Dark, 5 × 31 Light); `Minutes` "00" 22 wide @37,0 |
| AM-PM | 100 × 36, `corners max`, `stack h gap0 pad4,6,4,6` | `Option 1` 44 × 28 @6,4 → Segmented Control/…/Button Active ("AM"); `Option 2` 44 × 28 @50,4 → …/Button ("PM") |
| Segmented Control button | 44 × 28 | Active: `Background` 48 × 28 @-2,0, `corners max`; both: `Label` 44 × 18 @0,5 |
| Buttons (Time / Date) | 90 × 36 / 120 × 36, `corners max`, `stack h gap0 pad0,12,0,12` | `Current` text 66 × 20 / 96 × 20 @12,8: "8:00 AM" / "April 1, 2026" |
| Buttons/Date and Time | 214 × 36, `stack h gap4` | `Date` 120 × 36 @0,0 (Idle) + `Time` 90 × 36 @124,0 (Idle) |
| Wheel/Time Picker | 393 × 215 | `Rectangle` 297 × 34 @47.5,91, corners 17 (selection band); `Time Picker Wheel` bitmap 297 × 216 @47.5,0 (Dark) / 296 × 215 @48.5,0 (Light) |

### Examples

`Examples/Date and Time Picker/<Appearance>` 402 × 874, `stack v gap0 pad82,16,0,16`:

- `Status Bar` 402 × 62 @0,0.07 → `Status Bars/iPhone 17 Pro/<Light|Dark> Background`.
- `Table` 370 × 208 @16,82, corners 26, four `Row` instances 370 × 52 (y 0, 52, 104, 156) → `Lists/<Appearance>/Rows/Default`: "Time Zone" / "Cupertino"; "Start" with trailing accessory `Lists/􀻃/<Appearance>/Rows/Accessories - Trailing/Date and Time Picker` ("March 2025", "11:00 PM"); "End" with the same accessory and its time button swapped to `Buttons/Time/Selected`; "Travel Time" / "None" with accessory `…/Pop-up Button`.
- `Compact Date and Time Picker` 320 × 378 @41,238 → Compact Picker/<Appearance>/Date and Time, override `text="8"`. Derived: centred (41 = (402 − 320) / 2); its top edge y 238 is the bottom of the "End" row (82 + 156), so it covers the "Travel Time" row.

## Sizes

| Part | Size | Corner radius | Padding / gap | Label style |
|---|---|---|---|---|
| Compact picker card | 320 wide; 52 (Time), 325–326 (Date), 378–379 (Date and Time) | 13 | 0,12,0,12 (Date, Date and Time); 0,16,0,16 (Time) | — |
| Inline picker | 402 wide; 52, 325–326, 382–384 | none | 0,16,0,16 | — |
| Header Collapsed | 326 × 40 | — | pad 13,6,3,8 | month SFPro-Semibold 17/22 |
| Month | 354 × 285 / 350 × 286 | — | pad 8,0,8,0; week rows 44 tall, 7 apart | weekday SFPro-Bold 13/18 |
| Date cell | 38 × 38 | max (circle) | — | SFPro 20 (weight by state) |
| Week row | 338 × 38 | — | cells 50 apart | — |
| Time Picker row | 326 × 52 | — | pad 8,8,8,8; inner stack gap10 | label SFPro-Regular 17/22 |
| Time field | 67 × 36 / 67 × 34 | max | pad 0,8,0,8, gap1 | SFPro-Regular 17 (lh28 Dark) |
| AM-PM | 100 × 36 | max | pad 4,6,4,6 | SFPro 14/18 |
| Segmented button | 44 × 28 (active background 48 × 28) | max | — | SFPro 14/18 |
| Date / Time button | 120 × 36 / 90 × 36 | max | pad 0,12,0,12 | SFPro-Regular 17 |
| Wheel | 393 × 215, band 297 × 34 | band 17 | — | bitmap |
| Example table | 370 × 208, rows 52 | 26 | — | — |

Derived spacing:

- Week row: cell pitch 50, so 12 between 38 pt cells (50 − 38). The stored `gap5` does not match.
- Month: week rows 44 tall at a 51 pitch, gap 7 (matches `stack v gap7`); 5 rows = 248 (4 × 51 + 44).
- Weekday header: Dark pitch 51 (gap 19, matches `gap19`); Light pitch 50.33 (gap 18.33; stored `gap24`).
- Time field: 8 + 22 (hour) + 1 + 5 (colon) + 1 + 22 (minutes) + 8 = 67.
- AM-PM: 6 + 44 + 44 + 6 = 100, options touch (gap 0).
- Header: month stack ends at x 107 (8 + 99) and the arrows start at x 264, 157 apart (stored `gap154`); arrows end at 320, leaving the 6 right pad.
- Time Picker row: label ends at x 134 (8 + 126), where the stack starts; the stack ends at 318, leaving the 8 right pad.
- Wheel band: vertical centre 108 (91 + 17) in a 215 tall wheel.

## Colours and states

### Date cell (38 × 38)

| State | Dark fill | Dark number | Light fill | Light number |
|---|---|---|---|---|
| Default | `#000000` (master background) | SFPro-Regular 20 `#FFFFFF {Labels/Dark/1 Primary}` | `#FFFFFF` | SFPro-Regular 20 `#000000 {Labels/Light/1 Primary}` |
| Current | `Frame` `#0091FF {System Colors/Dark/8 Blue}` at 12% opacity | SFPro-Medium 20 `#0091FF {System Colors/Dark/8 Blue}` | `Frame` `#0088FF {System Colors/Light/8 Blue}` at 12% | SFPro-Medium 20 `#0088FF {System Colors/Light/8 Blue}` |
| Selected | `#0091FF {System Colors/Dark/8 Blue}` + `#FFFFFF` (white on top) | SFPro-Semibold 20 `#000000` | `#000000` | SFPro-Semibold 20 `#FFFFFF` |
| Current and Selected | `#0091FF {System Colors/Dark/8 Blue}` | SFPro-Semibold 20 `#FFFFFF` | `#0088FF {System Colors/Light/8 Blue}` | SFPro-Semibold 20 `#FFFFFF` (text also has `fill #FFFFFF`) |

In the Month components, `Week 1` swaps one cell to Current and `Week 4` swaps one cell to Selected; every other cell is Default. The Dark month's `Week 1` swaps in the Light cell `Date and Time Pickers/􀻃/Dates/Light/Current` (line 114).

### Segmented Control button (AM-PM)

| State | Dark | Light |
|---|---|---|
| Button Active | `Background` `#6C6C71`, label SFPro-Semibold 14/18 `#FFFFFF {Labels/Dark/1 Primary}` | `Background` `#FFFFFF` + shadow x0 y2 blur20 spread0 `#000000@6%`, label SFPro-Semibold 14/18 `#000000 {Labels/Light/1 Primary}` |
| Button | no background; label SFPro-Medium 14/18 `#FFFFFF {Labels/Dark/1 Primary}` | no background; label SFPro-Medium 14/18 `#000000 {Labels/Light/1 Primary}` |
| AM-PM track | `#767680@24%` | `#767680@12%` |

### Date / Time buttons

| State | Dark | Light |
|---|---|---|
| Idle | fill `#767680@24% {Fills/Dark/3 Tertiary}`, text `#FFFFFF {Labels/Dark/1 Primary}` | fill `#767680@12% {Fills/Light/3 Tertiary}`, text `#000000 {Labels/Light/1 Primary}` |
| Selected | fill `#767680@24% {Fills/Dark/3 Tertiary}`, text `#0091FF {System Colors/Dark/8 Blue}` | fill `#767680@12% {Fills/Light/3 Tertiary}`, text `#0088FF {System Colors/Light/8 Blue}` |

The selected state changes only the text colour.

### Other parts

| Part | Dark | Light |
|---|---|---|
| Time field fill | `#767680@24%` | `#767680@12%` |
| Time field digits | `#FFFFFF {Labels/Dark/1 Primary}` | `#000000 {Labels/Light/1 Primary}` |
| Weekday labels | `#999999 {Labels/Dark - Vibrant/2 Secondary}`, blend plus-lighter | `#999999 {Labels/Light - Vibrant/2 Secondary}`, blend plus-darker |
| Month text | `#FFFFFF {Labels/Dark/1 Primary}` | `#000000 {Labels/Light/1 Primary}` |
| Month disclosure chevron 􀆊 | `#0091FF {System Colors/Dark/8 Blue}` | `#0088FF {System Colors/Light/8 Blue}` (plus a text `fill #007AFF`) |
| Previous / next arrows | `#EDEDED {Labels - Liquid Glass/Dark/1 Primary}`, plus-lighter | `#1A1A1A {Labels - Liquid Glass/Light/1 Primary}`, plus-darker |
| Month bottom rule | `#38383A` | `#C6C6C8` (`Separator Color`) |
| Inline rules | `#38383A` | `#C6C6C8` |
| Compact Date and Time separator | `#FFFFFF@8%`, 1 pt | none |
| Wheel background / band | `#000000` / `#767680@18% {Fills/Dark/4 Quaternary}` | `#FFFFFF` / `#747480@8% {Fills/Light/4 Quaternary}` |
| Compact card | glass `Liquid Glass/Dark/Regular - Large` (Date, Date and Time), `…/Regular - Medium` (Time) | glass `Liquid Glass/Light/Regular - Large` (Date, Date and Time), `…/Regular - Medium` (Time) |
| Inline background | `#000000` | `#FFFFFF` |
| Example screen | `#000000 {Backgrounds Grouped/Dark - Base/Primary}` | `#F2F2F7 {Backgrounds Grouped/Light/Primary}` + `#D8D8D8` |
| Example table | `#1C1C1E {Backgrounds Grouped/Dark - Base/Secondary}` | `#FFFFFF {Backgrounds Grouped/Light/Secondary}` |

## Text

| Part | Content | Font | Size / lh | Align | Text style |
|---|---|---|---|---|---|
| Header month | "April 2026" | SFPro-Semibold | 17 / 22 | left | none |
| Header disclosure | 􀆊 U+10018A | SFPro-Bold | 13 / 18 | left | none |
| Previous / next | 􀆉 U+100189 / 􀆊 U+10018A | SFPro-Medium | 20 (no lh) | center | none |
| Weekdays | "SUN" … "SAT" | SFPro-Bold | 13 / 18 | center | none |
| Date number | "1" | SFPro-Regular (Default), SFPro-Medium (Current), SFPro-Semibold (Selected, Current and Selected) | 20 (no lh) | center | none |
| Time Picker row label | "Time" | SFPro-Regular | 17 / 22 | left | none |
| Time digits | "3", ":", "00" | SFPro-Regular | 17 / 28 (Dark), 17 no lh (Light) | right | none |
| AM-PM labels | "AM", "PM" | SFPro-Semibold (active), SFPro-Medium (idle) | 14 / 18 | center | `09 Footnote/2 Bold` |
| Date / Time buttons | "April 1, 2026", "8:00 AM" | SFPro-Regular | 17 (no lh) | center | none |
| Inline Time label | "Time" | SFPro-Regular | 17 / 22 | left | none |

No layer has tracking set. The `09 Footnote/2 Bold` style (SFPro-Semibold 13 / 18 in `text-styles.md`) is bound to the AM-PM labels, but the layers use 14 pt, and the idle label uses SFPro-Medium.

## Effects

Compact picker cards (values stored on the layers):

| Card | Style | Fill | Inner shadows | Shadows | Glass |
|---|---|---|---|---|---|
| Dark, Date / Date and Time | `Liquid Glass/Dark/Regular - Large` | `#1A1A1A@50%` + `#1A1A1A@90%` (luminosity) + `#1A1A1A` (lighten) | x0 y-4 blur8 spread-4 `#222222`; x0 y4 blur8 spread-4 `#222222`; x0 y-1 blur1.5 spread-0.5 `#404040`; x0 y1 blur1.5 spread-0.5 `#404040` (all plus-lighter); x0 y2 blur0.2 spread-1.2 `#FFFFFF@20%` | x0 y18 blur48 `#000000@45%`; x0 y0 blur0.3 spread0.3 `#000000@50%`; x±1.25 y0 blur0 spread-0.75 `#BFBFBF` (plus-darker) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Dark, Time | `Liquid Glass/Dark/Regular - Medium` | `#1A1A1A@30%` + `#1A1A1A@30%` (luminosity) + `#1A1A1A` (lighten) | as above | x0 y18 blur48 `#000000@45%`; x0 y0 blur0.3 spread0.3 `#A6A6A6`; x±1.25 y0 blur0 spread-0.75 `#A6A6A6` (plus-darker) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Light, Date / Date and Time | `Liquid Glass/Light/Regular - Large` | `#FFFFFF@70%` (lighten) + `#BFBFBF@10%` (darken) | x0 y-4 blur2 spread-4 `#272727`; x0 y4 blur8 spread-4 `#272727`; x0 y-1 blur1.5 spread-0.5 `#272727`; x0 y1 blur1.5 spread-0.5 `#272727` (all plus-lighter); x0 y2 blur0.25 spread-1.2 `#FFFFFF` | x0 y18 blur46 `#000000@25%`; x0 y0 blur0.3 spread0.3 `#DBDBDB` (plus-darker); x±1.25 y0 blur0 spread-0.75 `#BFBFBF` (plus-darker) | radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 |
| Light, Time | `Liquid Glass/Light/Regular - Medium` | `#CCCCCC@70%` (lighten) + `#BFBFBF@10%` (darken) | as Light above | x0 y18 blur46 `#000000@25%`; x0 y0 blur0.3 spread0.3 `#DBDBDB`; x±1.25 y0 blur0 spread-0.75 `#DBDBDB` (plus-darker) | radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 |

All compact cards: corners 13, smoothing 0.6. "x±1.25" stands for the two stored shadows x-1.25 and x1.25.

Other effects: Light segmented Button Active shadow x0 y2 blur20 spread0 `#000000@6%`; vibrant weekday labels use blend plus-lighter (Dark) / plus-darker (Light); the previous/next arrows the same.

## Kit notes

The page has no documentation boards. The header (`use "_Header"`) is titled "Date and Time Pickers"; its description starts "A picker displays one or more scrollable…" (cut off in the dump). The wheel picker's rows are a bitmap (`image "Time Picker Wheel"`), so wheel row fonts and spacing are Not in the kit. The examples show the compact Date and Time picker opening over a grouped list whose rows carry date and time buttons.

## Finding it in the spec

| What | Pattern |
|---|---|
| Compact pickers | `grep -n '^COMPONENT "Date and Time Pickers/Compact Picker' specs/date-and-time-pickers.txt` |
| Inline pickers | `grep -n '^COMPONENT "Date and Time Pickers/Inline Picker' specs/date-and-time-pickers.txt` |
| Date cells | `grep -n '^COMPONENT "Date and Time Pickers/􀻃/.*Dates' specs/date-and-time-pickers.txt` |
| Month / week / header | `grep -n 'Date Picker Month"\|Date Picker Week"\|Header Collapsed"' specs/date-and-time-pickers.txt` |
| Time row, field, AM-PM | `grep -n '^COMPONENT "Date and Time Pickers/􀻃/[A-Za-z]*/\(Time\|AM-PM\|Time Picker\)' specs/date-and-time-pickers.txt` |
| Segmented buttons | `grep -n 'Segmented Control/􀻃' specs/date-and-time-pickers.txt` |
| Date / Time buttons | `grep -n '^COMPONENT "Date and Time Pickers/􀻃/[A-Za-z]*/Buttons' specs/date-and-time-pickers.txt` |
| Wheel | `grep -n -A2 'Wheel/' specs/date-and-time-pickers.txt` |
| Examples | `grep -n -A12 '^COMPONENT "Examples' specs/date-and-time-pickers.txt` |
