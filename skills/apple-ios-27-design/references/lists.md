# Lists — iOS 27

**Read when:** you need an exact iOS 27 value for lists (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Lists in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/lists.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

117 components. Names with `􀻃` (U+100EC3) are building blocks. The page has no documentation boards; its header calls it "Lists (Tables)".

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Rows | `Lists/<Appearance>/Rows/<Size>` | Appearance: Light, Dark · Size: Default, Large | 4 |
| Button rows | `Lists/<Appearance>/Buttons/<State>` | State: Default, Destructive, Disabled | 6 |
| Rows with swipe actions | `Lists/<Appearance>/Rows with Swipe Actions/<Type>/<Edge>` | Type: Default - Symbol Only, Default - Symbol + Label, Large · Edge: Leading, Trailing | 12 |
| Section headers | `Lists/<Appearance>/Header/<Type>` | Type: Extra Prominent, Prominent, Nested | 6 |
| Section footer | `Lists/<Appearance>/Footer/Footer` | Light, Dark | 2 |
| Grouped table | `Lists/<Appearance>/Grouped Table View` | Light, Dark | 2 |
| Section index | `Lists/<Appearance>/Section Index/Section Index - iPhone`; block `Lists/􀻃/Section Index` | Light, Dark | 3 |
| Header blocks | `Lists/􀻃/<Appearance>/Headers/<Type>/<Side>/<Content>` | Type: Extra Prominent, Prominent (Leading: Title, Title + Subtitle, Title + Supertitle, Title + Supertitle + Subtitle, Title + Subtitle + Image, Title + Supertitle + Image); Extra Prominent Trailing: Action, Button, Image, Detail + Disclsoure (spelled so); Nested: Title, Title + Subtitle | 36 |
| Editing controls | `Lists/􀻃/<Appearance>/Rows/Editing/<Control>` | Editing Selected, Editing Unselected, Insert, Delete | 8 |
| Trailing accessories | `Lists/􀻃/<Appearance>/Rows/Accessories - Trailing/<Accessory>` | Drill In, Disclosure, Checkmark, Info, Symbol, Pop-up Button, Toggle, Stepper, Date and Time Picker, Move, Disclosure Expanded, Disclosure Collapsed (Light: `Disclosure - Expanded`, `Disclosure - Collapsed`) | 24 |
| Leading accessories | `Lists/􀻃/<Appearance>/Rows/Accessories - Leading - <Height>/<Content>` | Height: Regular, Tall · Content: With Image, With Symbol | 8 |
| Image placeholder | `Lists/􀻃/Light/Rows/Leading/Placeholder` | Light only | 1 |
| Swipe action buttons | `Lists/􀻃/Slide Action/<Type>` | Symbol, Symbol and Label, Symbol and Label Stacked (no appearance axis) | 3 |
| Examples | `Examples/Lists/<Appearance>/Grouped` | Light, Dark | 2 |

## Anatomy

### Row, Default (402 × 52)

| Layer | Size @position | Content |
|---|---|---|
| root | 402 × 52 | row fill, `corners 0`, `stack h gap16 pad0,16,0,16` |
| `use "Accessories"` | 81 × 52 @16,0 | → `Lists/􀻃/<App>/Rows/Accessories - Leading - Regular/With Image` |
| `group "Stack"` | 273 × 52 @113,0 | `border 1 outside` separator colour, `stack h gap0` |
| `text "Title"` | 203 × 22 @0,15 | "Title" |
| `use "Trailing"` | 70 × 52 @203,0 | → `…/Accessories - Trailing/Drill In` [isVisible→0] |

Derived: 16 + 81 + 16 = 113 (content starts after the leading accessory and the 16 gap); 113 + 273 + 16 = 402; the title is vertically centred ((52 − 22) / 2 = 15). The separator is the content stack's 1 pt outside border, so it starts at x 113, not at the row edge.

### Row, Large (402 × 68)

| Layer | Dark | Light |
|---|---|---|
| `use "Accessories"` | 81 × 68 @16,0 → `…/Accessories - Leading - Tall/With Image` | 97 × 68 @16,0 → same name |
| `group "Stack"` (bordered) | 273 × 68 @113,0 | 257 × 68 @129,0 |
| text stack | 203 × 40 @0,14 (`stack v gap0`): Title 203 × 22 @0,0, Subtitle 203 × 18 @0,22 | 187 × 68 @0,0: Title 187 × 22 @0,14, Subtitle 187 × 18 @0,36 |
| `use "Trailing"` | 70 × 68 @203,0 → Drill In [isVisible→0] | 70 × 68 @187,0 |

The two appearances differ because the Light tall leading image is 68 × 68 and the Dark one 52 × 52 (see Leading accessories). The text stack stores `fill #FFFFFF` in both appearances.

### Button row (402 × 52)

Root: row fill, `stack h gap0 pad0,16,0,16`. `group "Stack"` 370 × 52 @16,0 with the separator border; `text "Label"` 370 × 22 @0,15, centred: "Action" (Default), "Destructive Action", "Disabled Action".

### Section headers (370 wide)

| Header | Size | Root | Children |
|---|---|---|---|
| `Header/Extra Prominent` | 370 × 48 | `stack h gap0 pad10,16,10,16` | `use "Leading"` 294 × 28 @16,10 → `Headers/Extra Prominent/Leading/Title`; `group "Stack"` 44 × 21 @310,17 (`pad0,0,1,0`) holding `use "Trailing"` 44 × 20 → `Headers/Extra Prominent/Trailing/Action` |
| `Header/Prominent` | 370 × 45 | same padding | `use "Leading"` 294 × 25 @16,10 → `Headers/Prominent/Leading/Title`; `use "Trailing"` 44 × 20 @310,15 → `Headers/Extra Prominent/Trailing/Action` |
| `Header/Nested` | 370 × 42 | same padding | `use "Leading"` 338 × 22 @16,10 → `Headers/Nested/Title` |

Derived: heights are 10 + title line height + 10 (28, 25, 22); the trailing action ends 16 from the right (310 + 44 = 354 = 370 − 16).

Leading header blocks (sizes are the master sizes; title "Header", supertitle "Supertitle", subtitle "Subtitle"):

| Content | Extra Prominent | Prominent |
|---|---|---|
| Title | 76 × 28 | 68 × 25 |
| Title + Subtitle | 76 × 50: Title @0,0, Subtitle 53 × 20 @0,30 (gap 2) | 68 × 47: Subtitle @0,27 (gap 2) |
| Title + Supertitle | 76 × 48: Supertitle 67 × 20 @0,0, Title @0,20 | 68 × 45: Title @0,20 |
| Title + Supertitle + Subtitle | 76 × 70: Supertitle @0,0, Title @0,21 (Dark) / @0,20 (Light), Subtitle @0,50 | 68 × 67: Title @0,20, Subtitle @0,47 |
| Title + Subtitle + Image | 128 × 51, `gap10`: `rect` image 42 × 42 @0,4.5 (corners 10); text stack 76 × 51 @52,0 (`gap3`), Subtitle @0,31 | 120 × 48: image @0,3; text stack 68 × 48 @52,0, Subtitle @0,28 |
| Title + Supertitle + Image | 128 × 48: image @0,3; text stack 76 × 48 @52,0 | 120 × 45: image @0,1.5; text stack 68 × 45 @52,0 |

Nested header blocks: `Title` 59 × 22; `Title + Subtitle` 59 × 42 (Light) / 68 × 42 with `pad0,9,0,0` (Dark), Subtitle 53 × 20 @0,22.

Derived: image + gap = 42 + 10 = 52, the text stack's x.

Trailing header blocks (Extra Prominent only):

| Block | Size | Layers |
|---|---|---|
| `Trailing/Action` | 44 × 20 | `text "Action"` 44 × 20, right-aligned |
| `Trailing/Button` | 44 × 48 (Dark) / 44 × 44 (Light) | `oval "Oval"` 44 × 44 @0,0 (tint at `opacity 5.08%`); `text "Symbol"` 44 × 44 "􀈎" (U+10020E), centred |
| `Trailing/Detail + Disclsoure` | 60 × 22 | `text "Action"` 44 × 20 @0,1 "Detail", right-aligned; `text "􀆊"` (U+10018A) 12 × 22 @48,0 |
| `Trailing/Image` | Dark 46 × 44 (`rect` 42 × 42 @4,0); Light 42 × 42 (`rect "Image"` 42 × 42 @0,0) | bitmap fill, corners 10 |

### Footer (370 × 30)

Root `stack h gap0 pad8,16,6,16`; `text "Footer"` 338 × 16 @16,8. Derived: 8 + 16 + 6 = 30; 16 + 338 + 16 = 370.

### Grouped Table View (370 × 520)

Root: grouped secondary fill, `corners 26 smoothing0.6 style1`, `stack v gap0`. Ten 370 × 52 rows: Rows 1, 3, 5–10 → `Rows/Default`; Row 2 → `Rows with Swipe Actions/Default - Symbol Only/Trailing`; Row 4 → `…/Default - Symbol + Label/Leading`. Derived: 10 × 52 = 520.

### Editing controls (25 × 52)

The control sits in a 22 × 22 frame @2,15. Light builds it from a circle and a glyph; Dark from flattened shapes.

| Control | Light | Dark |
|---|---|---|
| Editing Selected | `group "Frame"` 22 × 22 @2,15, corners 11, blue fill; `text "􀆅"` (U+100185) 16 × 22 @3,0 | `oval "Background"` 20 × 20 @3,16 (#FFFFFF) under `shape "Selected"` 22 × 22 @2,15 (blue) |
| Editing Unselected | `group "Frame"` 22 × 22, corners 11, `border 1.5 inside` | `shape "Unselected"` 22 × 22 @2,15 |
| Insert | frame with green fill; `text "􀅼"` (U+10017C) 14 × 22 @4,0 | white oval + `shape "Insert Symbol"` 22 × 22 (green) |
| Delete | frame with red fill; `text "􀅽"` (U+10017D) 22 × 22 @0,0 | white oval + `shape "Delete Symbol"` 22 × 22 (red) |

Derived: 2 + 22 + 1 = 25 wide; (52 − 22) / 2 = 15 from the top.

### Leading accessories

| Accessory | Size | Layers |
|---|---|---|
| `Regular/With Image` | 81 × 52, `stack h gap4` | `use "Edit Action"` 25 × 52 @0,0 → `Editing/Delete`; `use "Image"` 52 × 52 @29,0 → `Lists/􀻃/Light/Rows/Leading/Placeholder` |
| `Tall/With Image` | Dark 81 × 68 (image 52 × 52 @29,8); Light 97 × 68 (image 68 × 68 @29,0) | Edit Action 25 × 68 |
| `Regular/With Symbol` | 65 × 52, `stack h gap4 pad0,2,0,0` | Edit Action 25 × 52; `text "Symbol"` 34 × 28 @29,12 "􀓔" (U+1004D4), right-aligned |
| `Tall/With Symbol` | 65 × 68 | Edit Action 25 × 68; symbol @29,20 |

Derived: 25 + 4 = 29 (the image or symbol x); 25 + 4 + 52 = 81; 25 + 4 + 34 + 2 = 65. `Leading/Placeholder` is 52 × 52 with a bitmap fill; both appearances use this one Light component.

### Trailing accessories

The "detail" accessories are `stack h gap16` rows of: a `"Detail"` text (44 × 22 @0), the accessory itself, and a reorder `group "Grabber"` (38 wide, `inner-shadow x0.5 y0 blur0 spread0` in the opaque separator colour, `stack h pad0,0.25,0,12.75`, holding `text "􀌇"` (U+100307) 25 × 22 @12.75).

| Accessory | Width | Parts after "Detail" (x) |
|---|---|---|
| `Drill In` | 124 | `text "Chevron"` 10 × 22 "􀆊" @60; Grabber @86 |
| `Disclosure` | 122 (52 tall in both appearances) | `use "Disclosure Collapsed"` 8 × 52 @60 → `Lists/􀻃/Light/Rows/Accessories - Trailing/Disclosure - Collapsed` (also in Dark); Grabber @84 |
| `Checkmark` | 136 | `text "Symbol"` 22 × 44 "􀆅" @60; Grabber @98 |
| `Info` | 160 | `text "Symbol"` 22 × 44 "􀅴" (U+100174) @60; chevron 8 × 22 "􀆊" @98; Grabber @122 |
| `Symbol` | 160 | `text "Symbol"` 22 × 44 "􀋂" (U+1002C2) @60; chevron 8 × 22 @98; Grabber @122 |
| `Pop-up Button` | 188 | `group "Menu"` 134 × 22 @0 (`stack h gap10`: `text "Pop-up button"` 112 × 22, right-aligned, and `text "􀆏"` (U+10018F) 12 × 22 @122) replaces "Detail"; Grabber @150 |

Derived: 44 + 16 = 60; each following x = previous x + width + 16 (60 + 10 + 16 = 86; 86 + 38 = 124).

| Accessory | Size (Light / Dark) | Root | Child |
|---|---|---|---|
| `Toggle` | 64 × 52 / 64 × 44 | `stack h gap0 pad7,0,7,0` | `use "Toggle"` 64 × 28 → `Toggles/<App>/On/1 - Idle` |
| `Stepper` | 92 × 52 / 92 × 44 | `stack h gap0 pad6,0,6,0` | `use "Stepper"` 92 × 32 → `Stepper/<App>` |
| `Date and Time Picker` | 214 × 52 / 214 × 44 | `stack h gap0` | `use "Date Picker Button"` 214 × 36 → `Date and Time Pickers/􀻃/<App>/Buttons/Date and Time` |
| `Move` | 25 × 52 / 25 × 44 | `stack h gap0` | `text "􀌇"` 25 × 22 |
| `Disclosure Expanded` | 8 × 52 | — | `text "􀆈"` (U+100188) 11 × 30 @-3,11, right-aligned |
| `Disclosure Collapsed` | 8 × 52 | — | `text "􀆊"` 11 × 22 @-3,15, right-aligned |

Light accessories are 52 tall (one row); most Dark ones are 44 tall, so the Dark text sits at y 11 instead of 15. The accessory roots store `fill #FFFFFF` (Dark editing and disclosure roots `#000000`); these fills are unbound and the row supplies its own background.

### Swipe action buttons (`Lists/􀻃/Slide Action/…`)

| Block | Size | Root | Content |
|---|---|---|---|
| `Symbol` | 60 × 44 | fill #0088FF {System Colors/Light/8 Blue}, `corners max`, `stack v gap0 pad12,8,12,8` | `text "Symbol"` 44 × 20 @8,12 "􀓞" (U+1004DE) |
| `Symbol and Label` | 84 × 44 | same fill, `corners max`, `stack h gap8 pad12,0,12,0` | `text "Symbol"` 15 × 20 @14,12; `text "Label"` 33 × 15 @37,14.5 |
| `Symbol and Label Stacked` | 60 × 68 | no fill, `stack v gap5 pad6,0,0,0` | `group "Stack"` 60 × 38 @0,6 (blue fill, `corners max`) holding the symbol 60 × 38; `text "Label"` 33 × 15 @13.5,49 below |

Derived: Stacked 6 + 38 + 5 = 49 (the label's y). The swipe rows recolour the fill per action with `color:fill-0` overrides.

### Rows with swipe actions (402 wide)

| Type | Height | Actions group | Row group |
|---|---|---|---|
| Default - Symbol Only / Trailing | 52 | `group "Stack"` 200 wide @202 (`gap10`): three `Symbol` actions 60 × 44 @0, 70, 140 | `group "Stack"` 192 × 52 @0,0, `corners 0/max/max/0`, holding the row 402 × 52 @-210,0 |
| Default - Symbol Only / Leading | 52 | 200 wide @0 | 192 × 52 @210,0, `corners max/0/0/max`, row @0,0 |
| Default - Symbol + Label / Trailing | 52 | 272 wide @130: three `Symbol and Label` 84 × 44 @0, 94, 188 | 120 × 52 @0,0, `corners 0/max/max/0`, row @-282,0 |
| Default - Symbol + Label / Leading | 52 | 272 wide @0 | 120 × 52 @282,0, `corners max/0/0/max` |
| Large / Trailing | 68 | 200 wide @202: three `Symbol and Label Stacked` 60 × 64 @y2 | 192 × 68 @0,0, `corners 0/26/26/0`, row → `Rows/Large` @-210,0 |
| Large / Leading | 68 | 200 wide @0 | 192 × 68 @210,0, `corners 26/0/0/26` |

Derived: 3 × 60 + 2 × 10 = 200 and 3 × 84 + 2 × 10 = 272; the row is shifted by the actions' width plus the 10 gap (200 + 10 = 210, 272 + 10 = 282); 192 + 10 + 200 = 402 and 120 + 10 + 272 = 402. Symbol-only actions sit at y 4 (Dark) or the actions group sits at y 4 (Light), so they are 4 pt in from the row's top and bottom (52 − 44 = 8). The row groups store `pad0,-216,0,0` (Dark both edges, Light Leading) or `pad0,0,0,0` (Light Trailing).

### Section index

`Lists/􀻃/Section Index` (14 × 270): 27 `text "Label"` layers, 14 × 10 each, "#" then "A"–"Z", every 10 pt (y 0…260). `Section Index - iPhone` (16 × 667): `use "Letters"` 14 × 353 @1,158 with a blue fill override.

### Examples (`Examples/Lists/<App>/Grouped`, 402 × 874)

Root: grouped primary fill, `stack v gap0 pad62,16,0,16`; `use "Status Bar"` 402 × 62 @0,0.07 → `Status Bars/iPhone 17 Pro/<App> Background`; `group "Content"` 370 × 624 (625 Light) @16,62, `stack v gap20`:

| Section | Size @position | Content |
|---|---|---|
| 1 | 370 × 146 @0,0 | `Header/Extra Prominent` 370 × 48 ("Single Table Row" in Light); table 370 × 52 @0,48 (one row, corners 26); `Footer` 370 × 46 @0,100 ("This is some footer text…") |
| 2 | 370 × 386 @0,166 | `Header/Nested` 370 × 42 ("Grouped Table View" in Light); table 370 × 312 @0,42: Navigation Link, Pop-up button, Stepper, Toggle (on), Toggle (swapped to `Toggles/<App>/Off/1 - Idle`), Slider → `Sliders/<App>/Glyphs/Mid - 1 - Enabled`; `Footer` 370 × 32 @0,354 |
| 3 | 370 × 52 @0,572 | one `Buttons/Destructive` row ("Destructive Button"), corners 26 |

Derived: sections are 20 apart (146 + 20 = 166; 166 + 386 + 20 = 572); tables are inset 16 from the screen sides; content starts below the 62 pt status bar; each section's header sits directly on its table with no gap.

## Sizes

| Part | Size | Corner | Padding / gaps |
|---|---|---|---|
| Row, Default | 402 × 52 | 0 | 0,16,0,16; gap 16 |
| Row, Large | 402 × 68 | 0 | 0,16,0,16; gap 16 |
| Button row | 402 × 52 | 0 | 0,16,0,16 |
| Grouped table (inset) | 370 wide | 26 | — |
| Extra Prominent header | 370 × 48 | — | 10,16,10,16 |
| Prominent header | 370 × 45 | — | 10,16,10,16 |
| Nested header | 370 × 42 | — | 10,16,10,16 |
| Footer | 370 × 30 | — | 8,16,6,16 |
| Header image | 42 × 42 | 10 | 10 to the text |
| Header trailing button | 44 × 44 circle | — | — |
| Editing control | 22 × 22 in a 25 pt column | 11 (Light) | 2 left |
| Leading image | 52 × 52 (Tall: 68 × 68 Light, 52 × 52 Dark) | 0 | 4 after the editing control |
| Leading symbol layer | 34 × 28 | — | 2 right |
| Trailing accessory gap | — | — | 16 between parts |
| Grabber | 38 wide | — | 12.75 left, 0.25 right |
| Swipe action, Symbol | 60 × 44 | max | 12,8,12,8 |
| Swipe action, Symbol and Label | 84 × 44 | max | 12,0,12,0; gap 8 |
| Swipe action, Stacked | 60 × 68 (circle 60 × 38) | max | 6 top; gap 5 |
| Gap between swipe actions | — | — | 10 |
| Section index letter | 14 × 10 | — | 10 pt step |
| Gap between sections (example) | — | — | 20 |

## Colours and states

### Rows, buttons and accessories

| Part | Light | Dark |
|---|---|---|
| Row and table background | #FFFFFF {Backgrounds Grouped/Light/Secondary} | #1C1C1E {Backgrounds Grouped/Dark - Base/Secondary} |
| Screen background (example) | #F2F2F7 {Backgrounds Grouped/Light/Primary} | #000000 {Backgrounds Grouped/Dark - Base/Primary} |
| Separator (content stack border, 1 outside) | #000000@12% {Separators/Light/Non-Opaque} | #FFFFFF@12% {Separators/Dark/Non-Opaque} |
| Row title | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Large row subtitle | #3C3C43@60% (no swatch) | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Detail text, pop-up title | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Chevron, grabber 􀌇, pop-up 􀆏 | #3C3C43@30% {Labels/Light/3 Tertiary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Grabber divider (inner shadow) | #C6C6C8 {Separators/Light/Opaque} | #38383A {Separators/Dark/Opaque} |
| Checkmark | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Info and symbol accessories, leading symbol | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Disclosure Expanded / Collapsed glyph | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Button row, Default | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Button row, Destructive | #FF383C {System Colors/Light/1 Red} | #FF4245 {System Colors/Dark/1 Red} |
| Button row, Disabled | #3C3C43@30% {Labels/Light/3 Tertiary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} |

### Editing controls

| Control | Light | Dark |
|---|---|---|
| Editing Selected | #0088FF {System Colors/Light/8 Blue} circle, #FFFFFF glyph | #0091FF {System Colors/Dark/8 Blue} shape over a #FFFFFF circle |
| Editing Unselected | `border 1.5 inside #BFBFBF {Labels/Light - Vibrant/3 Tertiary}`, `blend plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary} shape, `blend plus-lighter` |
| Insert | #34C759 {System Colors/Light/4 Green}, #FFFFFF glyph | #30D158 {System Colors/Dark/4 Green} over a #FFFFFF circle |
| Delete | #FF383C {System Colors/Light/1 Red}, #FFFFFF glyph | #FF4245 {System Colors/Dark/1 Red} over a #FFFFFF circle |

### Headers and footer

| Part | Light | Dark |
|---|---|---|
| Extra Prominent and Prominent title | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Nested title | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Supertitle, subtitle | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Trailing action, button glyph, disclosure glyph | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Trailing button circle | #0088FF at `opacity 5.08%` | #0091FF at `opacity 5.08%` |
| Trailing "Detail" | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Footer | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |

### Swipe actions

| Action | Light | Dark |
|---|---|---|
| Block default fill | #0088FF {System Colors/Light/8 Blue} | (same block) |
| Glyph and label on the button | #FFFFFF (label bound to {Labels/Dark/1 Primary}) | same |
| Stacked label (below the circle) | #3C3C43@60% {Labels/Light/2 Secondary} | same block, no Dark variant |
| Trailing: Action 1 / 2 / 3 | #FF8D28 {System Colors/Light/2 Orange} / no override (block blue) / #FF383C {System Colors/Light/1 Red} | #FF9230 {System Colors/Dark/2 Orange} / #8E8E93 {Grays/Dark/Gray} (Large: #0091FF {System Colors/Dark/8 Blue}) / #FF4245 {System Colors/Dark/1 Red} |
| Leading: Action 1 / 2 / 3 | #CB30E0 {System Colors/Light/10 Purple} / #6155F5 {System Colors/Light/9 Indigo} / #34C759 {System Colors/Light/4 Green} | #DB34F2 {System Colors/Dark/10 Purple} / #6D7CFF {System Colors/Dark/9 Indigo} / #30D158 {System Colors/Dark/4 Green} |
| Swiped row fill (override) | #E5E5EA {Grays/Light/Gray 5} | #2C2C2E {Grays/Dark/Gray 5}; the row group is also filled with it |

### Section index

| Part | Light | Dark |
|---|---|---|
| Letters (instance fill override) | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Letters in the block | #000000 | #000000 |
| Index root fill | #FFFFFF | #000000 + #FFFFFF |

States the kit has: the four editing controls, Default/Destructive/Disabled button rows, Disclosure Expanded/Collapsed and the toggle on/off swap. A pressed or highlighted row: Not in the kit.

## Text

| Part | Font | Size | Line height | Align | Text style bound |
|---|---|---|---|---|---|
| Row title | SFPro-Regular | 17 | 22 | left | none (`06 Body/Default` on the Large row title) |
| Large row subtitle | SFPro-Regular | 15 | 18 | left | none |
| Detail, pop-up title | SFPro-Regular | 17 | 22 | right | none |
| Chevron 􀆊, disclosure 􀆈 | SFPro-Semibold | 17 | 22 | right | none |
| Grabber 􀌇, pop-up 􀆏 | SFPro-Regular | 17 | 22 | centre | none |
| Checkmark 􀆅 (accessory) | SFPro-Semibold | 17 | Not in the kit | centre | none |
| Info 􀅴 / symbol 􀋂 (accessory) | SFPro-Regular | 17 | Not in the kit | centre | none |
| Leading symbol 􀓔 | SFPro-Regular | 22 | 28 | right | none |
| Button row label | SFPro-Regular | 17 | 22 | centre | none |
| Extra Prominent title | SFPro-Bold | 22 | 28 | left | `03 Title2/2 Bold` |
| Prominent title | SFPro-Semibold | 20 | 25 | left | `04 Title3/2 Bold` |
| Nested title | SFPro-Semibold | 17 | 22 | left | `06 Body/2 Bold` |
| Supertitle, subtitle, trailing Action | SFPro-Regular | 15 | 20 | left (Action right) | `08 Subheadline/1 Default` |
| Trailing button glyph 􀈎, trailing "Detail" | SFPro-Regular | 17 | 20 | centre / right | `08 Subheadline/1 Default` (stored size 17 differs from the style's 15) |
| Trailing disclosure 􀆊 | SFPro-Semibold | 19 | 22 | centre | none |
| Footer | SFPro-Regular | 13 | 16 | left | `Tight Leading/09 Footnote/1 Default` |
| Editing glyphs 􀆅 􀅼 􀅽 (Light) | SFPro-Medium | 17 | Not in the kit | centre | none |
| Swipe action glyph 􀓞 | SFPro-Regular | 18 (16 in Symbol and Label) | 20 | centre | none |
| Swipe action label | SFPro-Regular | 13 | Not in the kit | centre | none |
| Section index letters | SFPro-Semibold | 11 | 10 | centre | none |

The bound text styles match `text-styles.md` except the two 17 / 20 layers noted.

## Effects

There are no shared layer styles, blurs or drop shadows on this page.

| Part | Effect |
|---|---|
| Grabber divider | `inner-shadow x0.5 y0 blur0 spread0` in Separators/<App>/Opaque (a 0.5 pt line on the grabber's left edge) |
| Row separator | `border 1 outside` in Separators/<App>/Non-Opaque on the content stack |
| Header trailing button circle | `opacity 5.08%` |
| Light Editing Unselected | `blend plus-darker` |
| Dark Editing Unselected | `blend plus-lighter` |

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Lists (Tables)" and a description the dump cuts off after "Lists and tables present data in one or …". The full text is Not in the dump.

What the components show (summarised from their layout): grouped lists are 370 pt tables inset 16 pt with 26 pt corners on a grouped background; a row is a 16 pt-padded strip whose separator begins where the content begins, after any leading image or symbol; swiping slides the row under a rounded edge to reveal circular or capsule actions spaced 10 pt apart.

## Finding it in the spec

| Family / part | grep |
|---|---|
| Rows | `grep -nE '^COMPONENT "Lists/(Light\|Dark)/Rows/' specs/lists.txt` |
| Button rows | `grep -nE '^COMPONENT "Lists/(Light\|Dark)/Buttons/' specs/lists.txt` |
| Swipe rows | `grep -n '^COMPONENT "Lists/[A-Za-z]*/Rows with Swipe' specs/lists.txt` |
| Headers and footer | `grep -nE '^COMPONENT "Lists/(Light\|Dark)/(Header\|Footer)/' specs/lists.txt` |
| Header blocks | `grep -n '^COMPONENT "Lists/􀻃/[A-Za-z]*/Headers/' specs/lists.txt` |
| Editing controls | `grep -n '^COMPONENT "Lists/􀻃/[A-Za-z]*/Rows/Editing' specs/lists.txt` |
| Trailing accessories | `grep -n '^COMPONENT "Lists/􀻃/[A-Za-z]*/Rows/Accessories - Trailing' specs/lists.txt` |
| Leading accessories | `grep -n '^COMPONENT "Lists/􀻃/[A-Za-z]*/Rows/Accessories - Leading' specs/lists.txt` |
| Swipe action buttons | `grep -n '^COMPONENT "Lists/􀻃/Slide Action' specs/lists.txt` |
| Section index | `grep -n 'Section Index' specs/lists.txt` |
| Grouped table and examples | `grep -nE '^COMPONENT "(Lists/[A-Za-z]*/Grouped\|Examples/)' specs/lists.txt` |
| Separators | `grep -n 'border 1 outside' specs/lists.txt` |
