# Menus — iOS 27

**Read when:** you need an exact iOS 27 value for menus (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Menus in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/menus.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

108 components. Names with `􀻃` (U+100EC3) are building blocks. The page has no documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Edit menu | `Edit Menu/<Appearance>` and `Edit Menu/<Appearance>/Text Selection`; blocks `Edit Menu/<Appearance>/􀻃/<Part>` | Appearance: Light, Dark · Part: Selection, Menu Indicator, Action/Default, Action/Destructive | 12 |
| Menus (assembled) | `Menus/<Appearance>/<Type>` | Type: iPhone, iPad, iPad with Shortcuts, Content View, Overlay | 10 |
| iPhone menu blocks | `Menus/􀻃/<Appearance>/iPhone/<Part>` and `Menus/􀻃/<Appearance>/BG Selection/<Hide\|Show>` | Part: Menu Item/…, Menu Item - Selectable/…, Section Title, Separator, Control Group Button/Default, …/Destructive | 32 |
| iPad menu blocks | `Menus/􀻃/<Appearance>/iPad/<Part>` | Part: Menu Item/…, Menu Item - Selectable/…, Section Title, Separator, Selection/Hide, Selection/Show, Quick Action/Default, Quick Action/Destructive, Quick Action/Selection/Show, Quick Action Symbol, Menu Item Symbol/Show, Menu Item Symbol/Hide, Right Accessory/Submenu, Right Accessory/Keyboard Shortcut, Right Accessory/Shortcuts/Command (􀆔), Shift (􀆝), Option (􀆕), Control (􀆍) | 52 |
| Examples | `Examples/Menus/<Appearance>` | Light, Dark | 2 |

Menu item variants (same set on iPhone and iPad, Light and Dark):

| Kind | Content | States |
|---|---|---|
| `Menu Item` | Title; Title + Subtitle | Default, Disabled, Destructive |
| `Menu Item - Selectable` | Title; Title + Subtitle | Default, Disabled |

The item name joins content and state with a comma: `Menu Item/Title + Subtitle, Destructive`.

## Anatomy

### iPhone menu (`Menus/<Appearance>/iPhone`, 250 × 573 Light, 250 × 571 Dark)

| Layer | Size @position | Content |
|---|---|---|
| root | 250 × 573 | `style="Liquid Glass/<Appearance>/Regular - Medium"`, `corners 32 smoothing0.6 style1`, `stack v gap0 pad10,10,10,10` |
| `group "Control Group"` | 230 × 57 @10,10 | `stack h gap4`: three `Control Group Button` instances 74 × 57 @0, 78, 156 ("Scan", "Pin", "Trash" — Trash is Destructive) |
| `use "Separator"` | 230 × 21 @10,67 | → `Menus/􀻃/<Appearance>/iPhone/Separator` |
| `group "Menu Items"` | 230 × 475 @10,88 (473 Dark) | `stack v gap0 pad0,14,0,6`; items 210 wide @x6: Title rows 42 tall, Title + Subtitle 60, Separator 21, Section Title 29 (one Dark instance 27) |

Item order, top to bottom: Title, Default; "Disabled Action" (Disabled); "Destructive Action" (Destructive); Separator; "Action Name"; Separator; Section Title; "Submenu"; "Submenu" + "Subtitle Goes Here"; "Wrapping Submenu"; Separator; Section Title; Title, Default.

Derived: 10 + 57 = 67 (separator straight after the control group); 67 + 21 = 88; 88 + 475 + 10 = 573. Items: 6 + 210 + 14 = 230.

### iPhone menu item (198 wide master; 210 wide in the menu)

| Variant | Height | Root | Layers (layer: size @position) |
|---|---|---|---|
| `Menu Item/Title, <State>` | 42 | `stack h gap6 pad0,2,0,10` | `BG: Selection` 210 × 42 @-6,0 → `Menus/􀻃/<App>/BG Selection/Hide`; `text "Symbol"` 28 × 20 @10,11 "􀋂"; `group "Stack"` 136 × 20 @44,11 (`pad0,0,0,4`) with `text "Action"` 132 × 20 @4,0; `text "Submenu Arrow"` 10 × 18 @186,12 "􀆊" |
| `Menu Item/Title + Subtitle, <State>` | 60 | same | Symbol @10,20; label group 136 × 38 @44,11 (`stack v gap2`): Action 132 × 20 @4,0, Subtitle 132 × 16 @4,22; Submenu Arrow @186,21 |
| `Menu Item - Selectable/Title, <State>` | 42 | same | `text "Symbol"` 14 × 20 @10,11 "􀆅" (the checkmark); `text "Symbol"` 28 × 20 @30,11 "􀋂"; Stack 132 × 20 @64,11 with Action 128 × 20; no submenu arrow |
| `Menu Item - Selectable/Title + Subtitle, <State>` | 60 | same | checkmark @10,20; symbol @30,20; label group 132 × 38 @64,11 |

Derived: symbol x 10 = left padding; label x 44 = 10 + 28 + 6 (gap), and the text starts 4 further in (48). Selectable: 10 + 14 + 6 = 30; 30 + 28 + 6 = 64. Arrow ends at 186 + 10 = 196, plus 2 right padding = 198. Heights: 11 + 20 + 11 = 42; 11 + 38 + 11 = 60. The selection highlight layer is 6 pt wider than the item on the left (@-6).

### iPhone blocks

| Component | Size | Root | Content |
|---|---|---|---|
| `Section Title` | 210 × 27 | `stack h gap0 pad2,12,10,12` | `text "Label"` 186 × 15 @12,2 "Section Title" |
| `Separator` | 210 × 21 | `stack h gap0 pad10,0,10,8` | `rect "Separator"` 202 × 1 @8,10 |
| `BG Selection/Show` | 100 × 100 | — | `rect "BG: Selection"` 100 × 100, corners 20 |
| `BG Selection/Hide` | 100 × 100 | — | empty |
| `Control Group Button/<Default\|Destructive>` | 68 × 57 | `stack v gap5 pad8,0,8,0` | `text "Symbol"` 22 × 22 @23,8 "􀋂"; `text "Label"` 68 × 14 @0,35 "Label" |

Derived: Section Title 2 + 15 + 10 = 27 and 12 + 186 + 12 = 210; Separator 10 + 1 + 10 = 21; Control Group Button 8 + 22 + 5 + 14 + 8 = 57.

### iPad menu (`Menus/<Appearance>/iPad`, 238 × 468)

| Layer | Size @position | Content |
|---|---|---|
| root | 238 × 468 | `style="Liquid Glass/<Appearance>/Regular - Medium"`, `corners 32 smoothing0.6 style1`, `stack v gap0 pad8,8,8,8` |
| `group "Quick Actions"` | 222 × 50 @8,8 | `stack h gap6`: three Quick Action instances 70 × 50 @0, 76, 152 ("Scan", "Pin Note", "Trash" — Trash is Destructive) |
| `group "Menu Items"` | 222 × 402 @8,58 | `stack v gap0 pad0,12,0,6`; rows 204 wide @x6: Title rows 38, Title + Subtitle 54, Separator 17 (the first one is 21), Section Title 27 |

Rows, top to bottom: Separator; "Find in Note"; "Move Note"; "Math Results" + "Suggest Results"; Separator; Section Title; "Recent Notes"; "Lines & Grids"; "Format"; "Delete" (Destructive); Separator; "Debug".

Derived: 8 + 50 = 58; 58 + 402 + 8 = 468; rows 6 + 204 + 12 = 222.

### iPad menu with shortcuts (`Menus/<Appearance>/iPad with Shortcuts`, 238 × 501)

Same root. `group "Menu Items"` 222 × 485 @8,8 (no Quick Actions). Each row swaps its trailing accessory to `Menus/􀻃/<Appearance>/iPad/Right Accessory/Keyboard Shortcut` and overrides the key letter. Rows: Undo (Z), Redo (Z), Separator, Paste (X), Paste and Match Style (V, 54 tall), Delete, Select All, Paste as Quotation (V), Add Link (K), Separator, Find (F), Separator, Dictation (D), Emoji (E).

Derived: 8 + 485 + 8 = 501.

### iPad menu item (198 wide master; 204 wide in the menu)

| Variant | Height | Root | Layers |
|---|---|---|---|
| `Menu Item/Title, <State>` | 38 | `stack h gap4 pad9,2,9,2` | `BG: Selection` 218 × 38 @-6,0 → `…/iPad/Selection/Hide`; `use "Symbol"` 30 × 20 @2,9 → `…/iPad/Menu Item Symbol/Show`; `group "Stack"` 147 × 18 @36,10 (`pad0,0,0,4`) with `text "Action"` 143 × 18 @4,0; `use "Trailing Accessory"` 9 × 20 @187,9 → `…/iPad/Right Accessory/Submenu` |
| `Menu Item/Title + Subtitle, <State>` | 54 | `stack h gap4 pad10,2,8,2` | Symbol @2,18; label group 147 × 36 @36,10 (`stack v gap2`): Action 143 × 18 @4,0, Subtitle 143 × 16 @4,20; Trailing Accessory @187,18 |
| `Menu Item - Selectable/Title, <State>` | 38 | `stack h gap4 pad9,2,9,2` | `text "Checkmark"` 14 × 20 @2,9 "􀆅"; Symbol 30 × 20 @20,9; Stack 142 × 18 @54,10 with Action 138 × 18; no trailing accessory |
| `Menu Item - Selectable/Title + Subtitle, <State>` | 54 | `stack h gap4 pad10,2,8,2` | Checkmark @2,18; Symbol @20,18; label group 142 × 36 @54,10 |

Derived: 2 + 30 + 4 = 36; selectable 2 + 14 + 4 = 20 and 20 + 30 + 4 = 54; accessory ends at 187 + 9 + 2 = 198; heights 9 + 20 + 9 = 38 and 10 + 36 + 8 = 54.

### iPad blocks

| Component | Size | Root | Content |
|---|---|---|---|
| `Section Title` | 206 × 27 | `stack h gap0 pad6,6,7,6` | `text "Label"` 194 × 14 @6,6 "Section Title" |
| `Separator` | 208 × 17 | `stack h gap0 pad8,0,8,6` | `rect "Separator"` 202 × 1 @6,8 |
| `Selection/Show` | 230 × 42 | — | `rect "BG: Selection"` 230 × 42, corners 18 |
| `Selection/Hide` | 230 × 42 | — | empty |
| `Quick Action/<Default\|Destructive>` | 68 × 50 | `stack v gap2 pad6,0,6,0` | `use "Symbol"` 22 × 22 @23,6 → `Quick Action Symbol`; `text "Label"` 68 × 14 @0,30 |
| `Quick Action/Selection/Show` | 68 × 56 | — | `rect "BG: Selection"` 68 × 56, corners 18 |
| `Quick Action Symbol` | 22 × 22 | — | `text "Symbol"` 22 × 18 @0,2 "􀋂" |
| `Menu Item Symbol/Show` | 24 × 20 | — | `text "Symbol"` 28 × 20 @-2,0 "􀋂" |
| `Menu Item Symbol/Hide` | 24 × 20 | — | empty |
| `Right Accessory/Submenu` | 9 × 20 | `stack h gap0` | `text "Symbol"` 9 × 20 "􀆊" |
| `Right Accessory/Keyboard Shortcut` | 76 × 16 | `stack h gap2` | Control (􀆍) @0, Option (􀆕) @16, Shift (􀆝) @32, Command (􀆔) @48, each 14 × 16; `text "A"` 12 × 24 @64,-4 |
| `Right Accessory/Shortcuts/<Key>` | 14 × 16 | — | one glyph text layer |

Derived: Section Title 6 + 14 + 7 = 27; Separator 8 + 1 + 8 = 17; Quick Action 6 + 22 + 2 + 14 + 6 = 50; Keyboard Shortcut 4 × 14 + 4 × 2 + 12 = 76.

### Edit menu (`Edit Menu/<Appearance>`, 504 × 44)

| Layer | Size @position | Content |
|---|---|---|
| root | 504 × 44 | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max smoothing0.6 style0`, `stack h gap0 pad4,4,4,20` |
| `Item 1` … `Item 6` | 18 tall @y13 | → `Edit Menu/<App>/􀻃/Action/Default` ("Cut" 41 @20, "Copy" 69 @61, "Paste" 72 @130, "Replace…" 100 @280, "AutoFill" 84 @380) and `…/Action/Destructive` ("Delete" 78 @202) |
| `use "Menu Indicator"` | 36 × 36 @464,4 | → `Edit Menu/<App>/􀻃/Menu Indicator` |

`Action/<Default|Destructive>` (64 × 18, `stack h gap16 pad0,16,0,0`): `group "Frame"` 1 × 18 @0,0 (a 1 pt divider) and `text "Item"` 31 × 18 @17,0. Item 1 carries an `isVisible→0` override; the dump doesn't say which layer it hides.

`Menu Indicator` (36 × 36, `corners 18`): one `text "􀆊"` 36 × 36 @0,0.

Derived: the items sit edge to edge (20 + 41 = 61, 61 + 69 = 130, … 380 + 84 = 464), then the indicator, then 4 right padding (464 + 36 + 4 = 504). Items are vertically centred ((44 − 18) / 2 = 13). Inside an action: 1 + 16 = 17 to the label, 16 after it.

### Text selection (`Edit Menu/<Appearance>/Text Selection`, 40 × 22)

| Layer | Size @position | Content |
|---|---|---|
| `use "Selection"` | 40 × 28 @0,-3 | → `Edit Menu/<App>/􀻃/Selection` (the tinted highlight) |
| `group "Lollipop - Leading"` | 2 × 24 @-1,-1 | `rect "Rectangle"` 2 × 34 @0,-8 (corners 1); `oval "Oval"` 16 × 16 @-7,-16 |
| `group "Lollipop - Trailing"` | 2 × 24 @39,1 | `rect "Rectangle"` 2 × 34 @0,-4 (corners 1); `oval "Oval"` 16 × 16 @-7,22 |

The leading handle's knob is above the bar, the trailing one below.

### Content View and Overlay

| Component | Size | Content |
|---|---|---|
| `Menus/<App>/Content View` | 370 × 370 | the content a menu comes from: fill, two shadows, `corners 32`; `text "Content View Detach"` 217 × 60 @76.5,155 "Content View⏎Detach symbol to customize" |
| `Menus/<App>/Overlay` | 100 × 100 | dimming fill, corners 0 |

### Examples (402 × 874)

`Examples/Menus/<App>`: screen fill #FFFFFF {Backgrounds/Light/Primary} (in both Light and Dark), `use "Overlay"` 402 × 874, then `group "Stack"` 402 × 796 @0,40 (794 Dark; `stack v gap16 pad0,16,0,16`) with `Content View` 370 × 270 @16,0 and `Menu` 250 × 510 @16,286 (508 Dark).

Derived: the menu sits 16 below the content view (270 + 16 = 286), both inset 16 from the left.

## Sizes

| Part | iPhone | iPad |
|---|---|---|
| Menu width | 250 | 238 |
| Menu padding | 10 | 8 |
| Menu corner radius | 32 | 32 |
| Item width (master / in menu) | 198 / 210 | 198 / 204 |
| Title row height | 42 | 38 |
| Title + Subtitle row height | 60 | 54 |
| Item padding T,R,B,L | 0,2,0,10 (Title + Subtitle the same) | 9,2,9,2 (Title); 10,2,8,2 (Title + Subtitle) |
| Gap between item parts | 6 | 4 |
| Leading symbol layer | 28 × 20 | 30 × 20 (instance of 24 × 20) |
| Checkmark layer | 14 × 20 | 14 × 20 |
| Label start (x, derived) | 48 (44 + 4) | 40 (36 + 4) |
| Label start, selectable (x, derived) | 68 (64 + 4) | 58 (54 + 4) |
| Submenu arrow layer | 10 × 18 @186 | 9 × 20 @187 |
| Selection highlight corner | 20 | 18 |
| Section title | 210 × 27 (29 in the menu) | 206 × 27 |
| Separator block / line | 210 × 21 / 202 × 1 | 208 × 17 / 202 × 1 |
| Top actions | Control Group: 3 × (74 × 57), gap 4 | Quick Actions: 3 × (70 × 50), gap 6 |

| Part | Value |
|---|---|
| Edit menu | 504 × 44, corners max, padding 4,4,4,20 |
| Edit menu action | 18 tall; divider 1 × 18; 16 either side of the label |
| Edit menu indicator | 36 × 36, corner 18 |
| Text selection handle | bar 2 × 34 (corner 1), knob 16 × 16 |
| Content View | 370 × 370, corner 32 |

## Colours and states

### iPhone menu items

| Part | Light | Dark |
|---|---|---|
| Default title | #000000 {Labels/Light - Vibrant/1 Primary}, `blend plus-darker` | #FFFFFF {Labels/Dark/1 Primary}; `blend plus-lighter` on the selectable and Title layers, none on Title + Subtitle |
| Default symbol, checkmark | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark/1 Primary}, `plus-lighter` |
| Subtitle | #999999 {Labels/Light - Vibrant/2 Secondary}, `plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `opacity 49.96%`, `plus-lighter` |
| Submenu arrow | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Disabled title, subtitle, symbol, checkmark | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Destructive title and symbol | #FF383C {System Colors/Light/1 Red}, no blend | #FF4245 {System Colors/Dark/1 Red}, no blend |
| Selection highlight (`BG Selection/Show`) | #EDEDED {Fills/Light - Vibrant/3 Tertiary}, `plus-darker` | #121212 {Fills/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Section title | #999999 {Labels/Light - Vibrant/2 Secondary}, `plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `plus-lighter` |
| Separator line | #E6E6E6 {Separators/Light/Vibrant}, `plus-darker` | #1A1A1A {Separators/Dark/Vibrant}, `plus-lighter` |
| Control Group Button default | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark/1 Primary}, no blend |
| Control Group Button destructive | #FF383C {System Colors/Light/1 Red} | #FF4245 {System Colors/Dark/1 Red} |
| Menu surface | `Liquid Glass/Light/Regular - Medium` | `Liquid Glass/Dark/Regular - Medium` |

Every item master uses `BG Selection/Hide` (no highlight). The highlighted state exists only as the separate `BG Selection/Show` block.

### iPad menu items

| Part | Light | Dark |
|---|---|---|
| Default title | #000000 {Labels/Light/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| Default symbol (fill override on the instance) | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary} |
| Checkmark | #000000 {Labels/Light/1 Primary} (also in Disabled) | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter`; Disabled #404040 {Labels/Dark - Vibrant/3 Tertiary} |
| Subtitle | #999999 {Labels/Light - Vibrant/2 Secondary}, `plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `plus-lighter` |
| Submenu arrow | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Disabled title, subtitle, symbol | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Destructive title | #FF383C {System Colors/Light/1 Red} | #FF4245 {System Colors/Dark/1 Red} |
| Destructive symbol | #FF383C {System Colors/Light/1 Red} | Title: #FF4245 {System Colors/Dark/1 Red}; Title + Subtitle: #FFFFFF {Labels/Dark - Vibrant/1 Primary} (as stored) |
| Selection highlight (`Selection/Show`, `Quick Action/Selection/Show`) | #EDEDED {Fills/Light - Vibrant/3 Tertiary}, `plus-darker` | #121212 {Fills/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Section title | #999999 {Labels/Light - Vibrant/2 Secondary}, `plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `plus-lighter` |
| Separator line | #E6E6E6 {Separators/Light/Vibrant}, `plus-darker` | #1A1A1A {Separators/Dark/Vibrant}, `plus-lighter` |
| Keyboard shortcut glyphs and letter | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Quick Action default label | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| Quick Action destructive label and symbol | #FF383C {System Colors/Light/1 Red} | label #FF4245 {System Colors/Dark/1 Red}; symbol #FF383C {System Colors/Light/1 Red} (it uses the Light symbol block) |
| Menu surface | `Liquid Glass/Light/Regular - Medium` | `Liquid Glass/Dark/Regular - Medium` |

### Edit menu and text selection

| Part | Light | Dark |
|---|---|---|
| Bar | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Dark/Regular - Small` |
| Action label | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| Destructive action label | #FF383C {System Colors/Light/1 Red} | #FF4245 {System Colors/Dark/1 Red} |
| Divider (`Frame`) | #CCCCCC {Fills/Light - Vibrant/1 Primary}, `plus-darker` | #CCCCCC {Fills/Light - Vibrant/1 Primary}, `plus-lighter` (Dark uses the Light swatch, as stored) |
| Menu indicator circle | #EDEDED {Fills/Light - Vibrant/3 Tertiary}, `plus-darker` | #121212 {Fills/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Menu indicator glyph 􀆊 | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| Selection highlight | #0088FF {System Colors/Light/8 Blue}, `opacity 25%`, `blend multiply` | #0091FF {System Colors/Dark/8 Blue}, `opacity 25%`, `blend screen` |
| Selection handles (bar and knob) | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |

### Content View and Overlay

| Part | Light | Dark |
|---|---|---|
| Content View fill | #FFFFFF {Backgrounds/Light/Primary} | #1C1C1E {Backgrounds/Dark - Elevated/Primary} |
| Content View text | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Overlay | #29293A@23% | #121212@56% |

## Text

| Part | Font | Size | Line height | Tracking | Align |
|---|---|---|---|---|---|
| iPhone item title | SFPro-Regular | 17 | 20 | — | left |
| iPhone item subtitle | SFPro-Regular | 13 | 16 | — | left |
| iPhone item symbol 􀋂 (U+1002C2) | SFPro-Regular | 17 | 22 | — | centre |
| iPhone checkmark 􀆅 (U+100185) | SFPro-Semibold | 15 | 20 | — | left |
| iPhone submenu arrow 􀆊 (U+10018A) | SFPro-Bold | 15 | Not in the kit | — | centre |
| iPhone section title | SFPro-Medium | 13 | 15 | — | left |
| iPhone Control Group label | SFPro-Medium | 12 | 14 | — | centre |
| iPhone Control Group symbol | SFPro-Regular | 17 | 22 | — | centre |
| iPad item title | SFPro-Regular | 15 | Not in the kit | — | left |
| iPad item subtitle | SFPro-Regular | 13 | 16 | — | left |
| iPad item symbol 􀋂 | SFPro-Regular | 15 | Not in the kit | — | centre |
| iPad checkmark 􀆅 | SFPro-Semibold | 13 | Not in the kit | — | centre |
| iPad submenu arrow 􀆊 | SFPro-Bold | 15 | Not in the kit | — | centre |
| iPad section title | SFPro-Medium | 12 | Not in the kit | — | left |
| iPad Quick Action label | SFPro-Medium | 12 | 14 | — | centre |
| iPad Quick Action symbol | SFPro-Regular | 15 | Not in the kit | — | centre |
| iPad shortcut glyphs and letter | SFPro-Medium | 15 | Not in the kit | -0.23 | centre |
| Edit menu action label | SFPro-Regular | 15 | Not in the kit | — | left |
| Edit menu indicator 􀆊 | SFPro-Semibold | 15 | Not in the kit | — | centre |
| Content View placeholder | SFPro-Regular | 17 | 30 | — | centre |

No text layer binds a shared text style. The letter in `Keyboard Shortcut` also stores `transform1`.

Shortcut glyphs (from the component names): Command 􀆔 U+100194, Shift 􀆝 U+10019D, Option 􀆕 U+100195, Control 􀆍 U+10018D. Symbol overrides used in the assembled menus include 􀈑 U+100211 (Trash, Delete), 􀎦 U+1003A6 (Pin), 􀎻 U+1003BB (Scan), 􀊫 U+1002AB (Find in Note), 􀈕 U+100215 (Move Note), 􀁔 U+100054 (Math Results), 􀐫 U+10042B (Recent Notes), 􀮟 U+100B9F (Lines & Grids), 􀅗 U+100157 (Format), 􀱍 U+100C4D (Undo), 􀱓 U+100C53 (Redo and others), 􀉃 U+100243 (Paste), 􀅶 U+100176 (Select All), 􀎸 U+1003B8 (Emoji).

## Effects

| Part | Effect |
|---|---|
| iPhone and iPad menus | `Liquid Glass/<Appearance>/Regular - Medium`, the token's `corners 20` replaced by 32 |
| Edit menu | `Liquid Glass/<Appearance>/Regular - Small`, `corners max smoothing0.6 style0` |
| Selection handle knobs | `shadow x0 y3 blur14 spread0 #000000@12%` |
| Content View, Light | `shadow x0 y0 blur25 spread0 #000000@16%` + `shadow x0 y0 blur2 spread0 #000000@10%` |
| Content View, Dark | `shadow x0 y2 blur25 spread0 #000000@16%` + `shadow x0 y0 blur2 spread0 #000000@10%` |
| Vibrant content | `plus-darker` in Light, `plus-lighter` in Dark (labels, fills, separators); red destructive text has no blend |
| Text selection highlight | `opacity 25%` with `blend multiply` (Light) or `blend screen` (Dark) |

The inline glass expansions match the tokens apart from the corner value (checked by script on all 8 styled lines). Key values from `materials.md`:

| Style | Fill stack (bottom first) | Glass blur |
|---|---|---|
| Liquid Glass/Light/Regular - Medium | #CCCCCC@70% (lighten) + #BFBFBF@10% (darken) | radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 |
| Liquid Glass/Dark/Regular - Medium | #1A1A1A@30% + #1A1A1A@30% (luminosity) + #1A1A1A (lighten) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Liquid Glass/Light/Regular - Small | #F8F8F8@20% (luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (plus-lighter) | radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0 |
| Liquid Glass/Dark/Regular - Small | #000000 (screen) + #999999@17% | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 |

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Menus" and a description the dump cuts off after "A menu reveals its options when people i…". The full text is Not in the dump.

What the components show (summarised from their layout): the iPhone menu opens below its source content with a row of three icon-over-label actions at the top; the iPad menu uses a smaller type size (15 instead of 17), shorter rows and the same three-action row; the iPad shortcut variant replaces the submenu arrow with modifier glyphs and a key letter; the edit menu is a single glass capsule of text actions separated by 1 pt dividers, with the round Menu Indicator (􀆊) at the end.

## Finding it in the spec

| Family / part | grep |
|---|---|
| Edit menu | `grep -n '^COMPONENT "Edit Menu/' specs/menus.txt` |
| Assembled menus | `grep -nE '^COMPONENT "Menus/(Light\|Dark)/' specs/menus.txt` |
| iPhone blocks | `grep -nE '^COMPONENT "Menus/􀻃/(Light\|Dark)/(iPhone\|BG Selection)/' specs/menus.txt` |
| iPad blocks | `grep -nE '^COMPONENT "Menus/􀻃/(Light\|Dark)/iPad/' specs/menus.txt` |
| One item state, e.g. Destructive | `grep -n '^COMPONENT .*Menu Item.*, Destructive"' specs/menus.txt` |
| Selection highlights | `grep -n 'rect "BG: Selection"' specs/menus.txt` |
| Separators | `grep -n 'rect "Separator"' specs/menus.txt` |
| Keyboard shortcuts | `grep -n 'Right Accessory/Shortcuts' specs/menus.txt` |
| Examples | `grep -n '^COMPONENT "Examples/' specs/menus.txt` |
