# Toolbars — iOS 27

**Read when:** you need an exact iOS 27 value for toolbars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Toolbars in Apple's iOS 27 kit: components, anatomy.

Source: `specs/toolbars.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The page covers top bars (navigation bars) and bottom toolbars for iPhone, iPad and iPhone Duo, the Liquid Glass buttons and button groups they hold, their titles, search fields, and the sheet header buttons. Swatch names in `{…}` are in `colors.md` / `specs/tokens.txt`; `style="…"` names are in `materials.md`; text style names are in `text-styles.md`.

## Components

216 components, no documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Examples | `Examples/Toolbar/…` | Dark, Light × iPhone {Bottom - Search, Bottom - Controls}; `iPad (Dark)`, `iPad (Light)`; iPhone Duo {Landscape, Portrait} × {Inner, Outer} | 14 |
| iPhone top bars | `Toolbars/{Dark,Light}/iPhone/{Top - Standard, Top - Sheet}/<title>` | title: Title, Title 2 Line, Title 2 Line Left, Compact Large, Large, Title 2 Line Large. Dark Top - Sheet has no "Title 2 Line": its 70 pt tall two-line bar is also named "Title 2 Line Large" | 24 |
| iPad top bars | `Toolbars/{Dark,Light}/iPad/{Top, Tab Bar, Tab Bar (Search Selected)}/<title>` | 6 title variants per set (names below) | 36 |
| iPhone Duo top bars | `Toolbars/{Dark,Light}/iPhone Duo/{Top - Standard, Top - Sheet}/<title>` | Title, Title 2 Line, Compact Large, Large Title | 16 |
| iPhone bottom toolbars | `Toolbars/{Dark,Light}/iPhone/Bottom/<layout>` | Controls, Search, Search + Leading Item, Search + Trailing Item, Search with Focus - Placeholder, Search with Focus - Value | 12 |
| iPad bottom toolbars | `Toolbars/{Dark,Light}/iPad/Bottom/<layout>` | Left and Right; Left, Center and Right | 4 |
| Toolbar buttons (glass) | `Toolbars/{Dark,Light}/Buttons/<size>/{Active,Inactive}/<kind>` | 44pt: Symbol 1, Symbol 1 - Prominent, Horizontal Group - Symbol 2, Horizontal Group - Symbol 3, Text, Back with Title · 48pt: Symbol 1, Horizontal Group - Symbol 2/3, Text, Vertical Group - Symbol 2/3 (Active only) · 34pt: Close Button | 48 |
| Button content | `Toolbars/􀻃/{Dark,Light}/Buttons - Symbol/…`, `…/Buttons - Text/…`, `…/Search - Clear Symbol/Clear` | Symbol: Default, Tinted, Selected, Disabled · Text: Default, Disabled · Clear | 14 |
| Titles | `Toolbars/􀻃/{Dark,Light}/Titles - {iPhone,iPad}/<kind>` | Title, Title and Subtitle, Title and Subtitle (Left), Large Title, Large Title and Subtitle | 20 |
| Search fields | `Toolbars/􀻃/{Dark,Light}/Search - Bottom/{Search - Placeholder, Search - Value}` | each name exists twice: a 48 pt tall and a 44 pt tall master | 8 |
| iPad tab-bar search rows | `Toolbars/􀻃/Top/{Dark,Light}/{Active,Inactive}/iPad/Tab Bar/{Search Field, Search Field + Filter}` | | 8 |
| Segmented control buttons | `Toolbars/􀻃/{Dark,Light}/Segmented Control Buttons/{Selected,Unselected}` | | 4 |
| Sheet header buttons | `Sheets (iPhone)/􀻃/Buttons (for Inspectors)/…` | Dark/{Primary, Close Button}, Dark/Active/{…}, Light/Active/{…}, Light/Inactive/{…} | 8 |

iPad title variant names, as the kit spells them:

| Set | Names |
|---|---|
| `iPad/Top` | Default Title · Default Title - 2 Lines Left · Large Title · Large Title - Compact · Large Title - 2 Lines · Dark: `Title 2 Line`, Light: `Default Title - 2 Lines` |
| `iPad/Tab Bar` | Default Title · `Default Title -  2 Lines` · `Default Title -  2 Lines Left` (two spaces after the dash) · Large Title · Large Title - Compact · Large Title - 2 Lines |
| `iPad/Tab Bar (Search Selected)` | Default Title · Default Title - 2 Lines · Default Title - 2 Lines Left · Large Title · Large Title Compact · Large Title - 2 Lines Left |

Components from other pages used here: `Status Bars/iPhone 17 Pro/…`, `Status Bars/iPad/…/Full Screen/Menu Collapsed`, `Status Bars/iPhone Duo/…/{Horizontal,Vertical}`, `Scroll Edge Effect/…`, `Windows/{Dark,Light}/Window Controls/Active`, `Windows/{Dark,Light}/Resize - Floating`, `Tab Bars/{Dark,Light}/iPad (Regular)/iPad`, `Text Fields/􀻃/Cursor`, `iPhone Duo/Outer Display Lens`.

## Anatomy

### Toolbar buttons (glass containers)

Every container carries the glass style itself (see Colours and states) and `corners max` (capsule), except Light 34pt Close Button, which stores `corners 100`. Content is a nested `Buttons - Symbol` instance (36×36 or 40×40) or a text layer.

| Component | Size | Auto layout | Children (layer → component, size @ position) |
|---|---|---|---|
| 44pt Symbol 1 | 44×44 | Dark `stack h`, Light `stack v`, gap 0, pad 4,4,4,4 | "Button 1" → Buttons - Symbol/Default 36×36 @4,4 |
| 44pt Symbol 1 - Prominent | 44×44 | Dark `stack h` pad 0; Light `stack v` pad 3,0,3,0 | "Tint Color" group 45×45 @-0.5,-0.5 · "Tinted Glass" group 44×44 @0,0 · text "Symbol" 44×44 @0,0 `􀄨` U+100128 |
| 44pt Horizontal Group - Symbol 2 | 104×44 | `stack h gap20 pad0,6,0,6` | Button 1 36×36 @6,4 · Button 2 @62,4 |
| 44pt Horizontal Group - Symbol 3 | 160×44 | `stack h gap20 pad0,6,0,6` | Button 1 @6,4 · Button 2 @62,4 · Button 3 @118,4 |
| 44pt Text | 67×44 | `stack h gap0 pad0,12,0,12` | Label 43×22 @12,11 (Dark: text layer; Light: → Buttons - Text/Default) |
| 44pt Back with Title | 80×44 | Dark `pad0,11,0,14`, Light `pad11,11,11,14` | text `􀯶` U+100BF6 16×22 @14,11 · text "Back Label" "Back" 39×22 @30,11 |
| 34pt Close Button | 34×34 | `pad4,4,4,4` | text "Symbol" `􀆄` U+100184 36×36 @-1,-1 |
| 48pt Symbol 1 | 48×48 | `stack v gap0 pad4,4,4,4` | "Label"/"Button 1" → Buttons - Symbol/Default 40×40 @4,4 |
| 48pt Horizontal Group - Symbol 2 | 110×48 | `stack h gap18`, Dark pad 0,10,0,10, Light pad 6,10,6,10 | Button 1 36×36 @10,6 · Button 2 @64,6 |
| 48pt Horizontal Group - Symbol 3 | 164×48 | `stack h gap18`, Dark pad 0,10,0,10, Light pad 5,10,7,10 | Buttons @10, 64, 118; y 6 (Dark), 5 (Light) |
| 48pt Text | 69×48 | `stack h gap0 pad13,13,13,13` | Label 43×22 @13,13 |
| 48pt Vertical Group - Symbol 2 | 48×110 | `stack v gap18 pad10,6,10,6` | Buttons 36×36 @6,10 · @6,64 |
| 48pt Vertical Group - Symbol 3 | 48×164 | `stack v gap18 pad10,6,10,6` | Buttons @6,10 · @6,64 · @6,118 |

Default glyphs in the groups: Button 1 `􀀀` U+100000, Button 2 `􀂒` U+100092, Button 3 `􀟈` U+1007C8 (Light 44pt Group - Symbol 2 puts `􀟈` on Button 2).

Inactive buttons have the same layers, except Symbol 1 - Prominent, which drops "Tint Color" and "Tinted Glass" and keeps only the symbol.

### Button content (nested, `Toolbars/􀻃/…`)

| Component | Size | Layers |
|---|---|---|
| Buttons - Symbol/Default, Tinted, Disabled | 36×36 | text "Symbol" 36×36 @0,0 `􀀀` U+100000 |
| Buttons - Symbol/Selected | 36×36 | rect "BG" 36×36 @0,0 `corners 19` · text "Symbol" 36×36 |
| Search - Clear Symbol/Clear | 36×36 | text "Symbol" `􀆄` U+100184 |
| Buttons - Text/Default, Disabled | 43×22 | text "Label" 43×22 @0,0 "Label". Light Default: `stack h gap0 pad0,-4,0,-3` |

### Titles (`Toolbars/􀻃/…/Titles - …`)

| Component | iPhone size | iPad size | Layers |
|---|---|---|---|
| Title | 35×22 | 35×22 | "Title" 35×22 @0,0 |
| Title and Subtitle | 46×39, `stack v pad2,0,1,0` | 46×38 | iPhone: Title 32×20 @7,2, Subtitle 46×16 @0,22 · iPad: Title 35×22 @5.5,0, Subtitle 46×16 @0,22 |
| Title and Subtitle (Left) | 46×39, `pad2,0,1,0` | 46×38 | iPhone: Title 32×20 @0,2, Subtitle 46×16 @0,22 · iPad: Title 35×22 @0,0, Subtitle 46×16 @0,22 |
| Large Title | 69×41 | 69×44, `stack h pad1,0,2,0` | Title 69×41 @0,0 (iPad @0,1) |
| Large Title and Subtitle | 69×61 | 69×61 | Title 69×41 @0,0 · Subtitle 55×20 @0,41 |

### iPhone top bars (402 wide)

Standard bars: group "Leading" 44×44 @16,0 and group "Trailing" 44×44 @342,0, both `stack h gap12`. "Back Button" = 44pt Active Symbol 1 with `􀯶` U+100BF6; "Trailing - Button 3" = 44pt Active Symbol 1 or Symbol 1 - Prominent.
Sheet bars: rect "Grabber" 60×4 @171,5; "Leading Button" = sheet Close Button with `􀆄` U+100184; "Trailing Button" = sheet Primary (`􀄨` U+100128).

| Title variant | Standard: height · title part @ position · trailing kind | Sheet: height · title part @ position |
|---|---|---|
| Title | 54 · Title 35×22 @184,13 · Prominent | 70 · Title 282×22 @60,24 (Dark), 267×22 @68,27 (Light) |
| Title 2 Line | 54 · Title and Subtitle 46×37 @178,3 · Symbol 1 | 70 · Title and Subtitle 46×37 @178,19 |
| Title 2 Line Left | 54 · inside Leading 102×44: Back @0,0 + Title and Subtitle (Left) 46×37 @56,3.5 · Symbol 1 | 70 · group "Stack" 102×44 @16,16 (`gap12`): Close @0,0 + Title and Subtitle (Left) @56,3.5 |
| Compact Large | 54 · Large Title 69×41 @16,1, no leading group · Prominent | 70 · Large Title 69×41 @16,16, no leading button |
| Large | 105 · Large Title 69×41 @16,55 (Dark), @16,54 (Light) · Prominent | 121 · Large Title 69×41 @16,70 |
| Title 2 Line Large | 125 · Large Title and Subtitle 69×61 @16,54 · Symbol 1 | 141 · Large Title and Subtitle 69×61 @16,70 |

Sheet button positions: Leading 44×44 @16,16 (Dark Sheet/Title @16,13); Trailing @342,13 (Dark), @342,16 (Light), Light Sheet/Title @343,16.
Light Top - Standard/Title 2 Line stores no `􀯶` override on its Back Button, so it shows the master's `􀀀`.

### iPad top bars (1210 wide)

`iPad/Top` (no tab bar). Groups: "Leading" `stack h gap12` @20,0 holding "Window Controls" 41×22 @0,11, "Back Button" 44×44 @53,0, "Leading - Button 1" @109, "Leading - Button 2" @165; "Trailing" 516×44 @674,0 `gap12` holding "Trailing - Button 5" @224, "Trailing - Button 6" @280, "Search" 180×44 @336 (→ Search - Placeholder, 44 pt master). All buttons are 44pt Active Symbol 1.

| Variant | Height | Leading group | Title part |
|---|---|---|---|
| Default Title | 54 | 209×44 (4 items) | Title 1170×22 @20,13 |
| Default Title - 2 Lines Left | 54 | 155×44: Window Controls, Back, Title and Subtitle (Left) 46×37 @109,3.5 | — |
| Title 2 Line (Dark) / Default Title - 2 Lines (Light) | 54 | 209×44 | Title and Subtitle 46×37 @582,4 (Dark), 1170×37 @20,4 (Light) |
| Large Title - Compact | 54 | 178×44: Window Controls, Back, Large Title 69×44 @109,0 | — |
| Large Title | 102 | 209×44 | Large Title 71.42×41.46 @30,53 (Light 71.42×44) |
| Large Title - 2 Lines | 125 | 209×44 | Large Title and Subtitle 71.42×61 @30,54 |

`iPad/Tab Bar` and `iPad/Tab Bar (Search Selected)`. Row 1 is group "Stack" 1210×44 @0,0 `stack h pad0,20,0,20`: "Leading" 97×44 @20,0 (Window Controls 41×22 @0,11, Back Button @53,0), "Tab Bar" 507.4×44 @351.3,0 (→ `Tab Bars/…/iPad (Regular)/iPad`), "Trailing" (Trailing - Button 5 and 6). Stored row gap: 210 (Dark), 209 (Light); compact variants 170 / 169.

| Set | Variant | Height | Title part | Search row |
|---|---|---|---|---|
| Tab Bar | Default Title | 98 | Title 35×22 @587.5,65 | — |
| Tab Bar | Default Title -  2 Lines | 99 (Dark), 98 (Light) | Title and Subtitle 46×38 (Dark) / 46×37 (Light) @582,58 | — |
| Tab Bar | Default Title -  2 Lines Left | 98 | group 1210×37 @0,54 `pad0,10,0,10` → Title and Subtitle (Left) 46×37 @10,0 | — |
| Tab Bar | Large Title | 102 | group 1210×44 @0,53 (left pad 30) → Large Title 69×44 (Dark) / 71×44 (Light) @30,0 | — |
| Tab Bar | Large Title - 2 Lines | 115 | group 1210×61 @0,54 `pad0,10,0,10` → Large Title and Subtitle 69×61 @10,0 | — |
| Tab Bar | Large Title - Compact | 54 | single row; Leading 178×44 adds Large Title 69×44 @109; Tab Bar @351.8 | — |
| Search Selected | Default Title | 174 | Title 35×22 @588.02,65 | y 120 |
| Search Selected | Default Title - 2 Lines | 174 | Title and Subtitle 46×37 @582,58 | y 120 |
| Search Selected | Default Title - 2 Lines Left | 174 | Title and Subtitle (Left) 47.57×37 @10,57 | y 120 |
| Search Selected | Large Title | 178 | Large Title 71.42×44 @30,53 | y 124 |
| Search Selected | Large Title - 2 Lines Left | 191 | Large Title and Subtitle 71.42×61 @30,54 | y 137 |
| Search Selected | Large Title Compact | 130 | in row 1: Leading 178×44 with Large Title 69×44 @109 | y 76 |

Trailing group in row 1: 100×44 @1090,0 with buttons @0 and @56, except Light `Tab Bar` set: 324×44 @866,0 with buttons @224 and @280 (row gap 97; Large Title - Compact 57).
Search row: group "Search" (Dark) / "Search Field" (Light) 1210×44, `stack h pad0,40,0,40`, holding "Search Field" 1130×44 @40,0 → `Toolbars/􀻃/Top/{Dark,Light}/Active/iPad/Tab Bar/Search Field`.

### iPad tab-bar search rows (1170×44)

| Component | Auto layout | Children |
|---|---|---|
| Search Field | `stack v gap0` | "Search Field" 500×44 @335,0 → Search - Placeholder (44 pt) |
| Search Field + Filter | `stack h gap8` | "Search Field" 912×44 @0,0 · group "Segmented Control" 250×44 @920,0, `corners 22`, `stack h gap0 pad4,8,4,8`: "Button 1" 117×36 @8,4 → Segmented Control Buttons/Selected (text "Button 1"), "Button 2" 117×36 @125,4 → Unselected (text "Button 2"), instance `corners 18` |

Segmented Control Buttons masters: 74×36, own fill #5856D6 (unbound). Label 74×18 @0,9 (Light @0,8.6). Selected adds rect "Background" 82×36 @-4,0, `corners 20`; its label layer is flagged `mask`.

### iPhone Duo top bars (600 wide)

| Variant | Size | Auto layout (T,R,B,L) | Children |
|---|---|---|---|
| Top - Standard/Title | 600×82 | `stack h gap12 pad24,24,10,20` | "Leading Actions" 48×48 @20,24 (Back Button, 48pt Symbol 1 with `􀯶`) · group "Title" 148×22 @80,37 `corners 8` · "Trailing Actions" 336×48 @240,24 |
| Top - Standard/Compact Large | 600×82 | same | Leading Actions @20,24 · "Title" 148×34 @80,31 |
| Top - Standard/Title 2 Line | 600×82 | same | no leading · "Titles" 208×32 @20,32 (`stack v pad0,-1,0,0`): Title 208×18 @0,0, Subtitle 208×14 @0,18 |
| Top - Standard/Large Title | 600×126 | `stack v gap0 pad24,24,10,20` | "Row 1" 556×58 @20,24 (`stack h gap12 pad0,0,10,0`): Leading Actions @0,0, Trailing Actions 336×48 @220,0 · "Row 2" 58×34 @20,82: Title |
| Top - Sheet/Title | 600×74 | `stack h gap12 pad16,16,10,16` | Grabber 60×4 @270,10 · Leading Actions 48×48 @16,16 (48pt Symbol 1, `􀆄` U+100184) · Title 448×22 @76,29 (Light group "Stack" 388×22) · Trailing Actions |
| Top - Sheet/Compact Large | 600×74 | same | Title 448×34 @76,23 (Light 388×34) |
| Top - Sheet/Title 2 Line | 600×74 | same | Titles 448×32 @76,24 (Light 388×32): Title ×18, Subtitle ×14 @0,18 |
| Top - Sheet/Large Title | 600×118 | same | group "Stack" 568×92 @16,16: Row 1 568×58 (Leading, Trailing) · Row 2 58×34 @0,58 Title |

Standard "Trailing Actions" (336×48): "Toolbar Button Group (48pt)" 164×48 @0,0 (→ 48pt Horizontal Group - Symbol 3), "Status Bar" 104×48 @176,0 (→ `Status Bars/iPhone Duo/…/Horizontal`), group "Reserved Region - Camera - Right" 44×48 @292,0 (empty in the dump).
Sheet "Trailing Actions": Dark 48×48 @536,16 with one 48pt Symbol 1 (`􀆅` U+100185); Light 108×48 @476,16 with two buttons, `􀆅` @60,0 and a default one @0,0. Light Sheet/Large Title also has two leading buttons (Back `􀯶` @0, `􀆄` @60). In Light Sheet/Title 2 Line the two trailing "Toolbar Button (48pt)" layers point to the 44pt Symbol 1 master, stretched to 48×48. The keyboards page names `􀆅` "Done".

### iPhone bottom toolbars (402×56)

All `stack h`, pad 0,28,0,28; items are 48 tall at y 4 (derived: (56 − 48) / 2 = 4).

| Layout | Stored gap | Children |
|---|---|---|
| Search | 12 (Dark), 0 (Light) | "Search Field" 346×48 @28,4 → Search - Placeholder |
| Search + Leading Item | 12 | "Button" 48×48 @28,4 (48pt Symbol 1) · Search Field 286×48 @88,4 |
| Search + Trailing Item | 12 | Search Field 286×48 @28,4 · Button 48×48 @326,4 |
| Search with Focus - Placeholder / - Value | 12 | Search Field 286×48 @28,4 (Placeholder / Value) · "Clear" 48×48 @326,4 (48pt Symbol 1, `􀆄` U+100184) |
| Controls | 66 | "Leading" 168×48 @28,4 and "Trailing" 168×48 @206,4, each `gap12` with three 48pt Symbol 1 @0, 60, 120 |

Derived: gap between field and button 12 = 88 − 28 − 48; Controls gap between groups 10 = 206 − 28 − 168 (the stored stack gap is 66).

### iPad bottom toolbars (1190×44)

`stack h gap562 pad0,10,0,10`. "Leading" 156×44 @10,0 and "Trailing" 156×44 @1024,0, each `gap12` with three 44pt Symbol 1 @0, 56, 112. "Left, Center and Right" adds "Center" 324×44 @433,0 with six buttons @0, 56, 112, 168, 224, 280. Derived: Center is centred, 433 + 324 / 2 = 595 = 1190 / 2.

### Search fields (`Search - Bottom`)

| Master | Size | Auto layout | Leading glyph | Text | Trailing glyph |
|---|---|---|---|---|---|
| Search - Placeholder (48) | 180×48 | none | `􀊫` U+1002AB 26×22 @11,13 | "Search" 106×22 @41,13 | `􀊰` U+1002B0 18×22 @151,13 |
| Search - Value (48) | 180×48 | none | same | group "Text and Cursor" 58×22 @41,13: "Search" 54×22 + Cursor 4×22 @54,0 | `􀁡` U+100061 20×22 @150,13 |
| Search - Placeholder (44) | 180×44 | `stack h gap4 pad0,11,0,11` | `􀊫` 26×22 @11,11 | "Search" 106×22 @41,11 | `􀊱` U+1002B1 18×22 @151,11 |
| Search - Value (44) | 181×44 | same | `􀊫` @11,11 | "Text and Cursor" 105×22 @41,11 (`stack h`): "Search" 55×22 + Cursor 4×22 @55,0 | `􀁡` 20×22 @150,11 |

Instances name masters only by path, so which one is meant follows from the instance height: the iPhone bottom toolbars use 48-tall fields (286×48, 346×48), the iPad bars use 44-tall ones (180×44, 500×44, 912×44). The keyboards page names `􀊫` "Search Symbol" and `􀊰` "Mic".
Cursor: `Text Fields/􀻃/Cursor` with fill override #0091FF {System Colors/Dark/8 Blue} / #0088FF {System Colors/Light/8 Blue}.

### Sheet header buttons (`Sheets (iPhone)/􀻃/Buttons (for Inspectors)`)

44×44, `corners 24`.

| Component | Layer |
|---|---|
| Primary | text "Symbol" `􀄨` U+100128: Dark 44×38 @0,3, Light 44×44 @0,0 |
| Close Button | text `􀆄` U+100184 23×22 @11,11 |

### Examples

| Example | Canvas | Contents |
|---|---|---|
| iPhone Bottom - Search / Bottom - Controls | 402×874, fill #000000 / #FFFFFF | Status Bar 402×62 @0,0 · Navigation Bar 402×105 @0,62 (→ Top - Standard/Large) · Scroll Edge Effect 402×112 @0,0 (→ Top - Soft (no text)) · Toolbar 402×56 @0,786 |
| iPad (Dark) / iPad (Light) | 1210×834 | Status Bar 1210×32 · Navigation Bar 1210×54 @0,32 (→ iPad/Top/Default Title) · Scroll Edge Effect (Dark 1210×86, Light 100×112, → Top - Hard) · Toolbar 1210×44 @0,776 (Dark) / @0,780 (Light) · Window Resize 32×32 @1178,802 |
| iPhone Duo Portrait/Inner | 669×951 | Toolbar 669×82 @0,0 (→ Duo Top - Standard/Title) |
| iPhone Duo Landscape/Inner | 951×669 | group "Vertical Bar" 84×669 @867,0 `stack v gap8 pad24,24,24,12` → "Top" 48×265 @12,24 → "Stack" (`gap15`): vertical status bar 48×83 @0,0, Vertical Group - Symbol 3 48×164 @0,98 |
| iPhone Duo Landscape/Outer | 678×466 | Lens 95.67×95.67 @582,370 · Vertical Bar 84×466 @594,0 → Top 48×224 (`gap12`): Vertical Group - Symbol 3 @0,0, 48pt Symbol 1 @0,176 · "Bottom" 43×45 with "Camera Punchout" 43×42 |
| iPhone Duo Portrait/Outer | 466×678 | Lens @370.33,0 · Vertical Bar 84×678 @382,0 → Top 48×312: Camera Punchout 43×42 @2.5,0, Stack @0,48 (`gap17`): vertical status bar, Vertical Group - Symbol 3 @0,100 |

## More on this component

Sizes, colours, text and effects: `toolbars-values.md`.
