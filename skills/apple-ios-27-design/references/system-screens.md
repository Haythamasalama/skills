# System: Home Screen, Lock Screen and Control Center — iOS 27

**Read when:** you need wallpapers, the Home Screen, widgets, Quick Actions, the Lock Screen, notifications, Control Center or app icon frames on iOS 27, as Apple's kit draws them.
**Owns:** the anatomy of those system surfaces. Sizes and colours are in `system-values.md`; text and effects in `system-text-and-effects.md`.

Source: `specs/system.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components, windows, status bars and home indicators are in `system.md`.

## Anatomy

### Wallpapers

| Component | Size | Layers |
|---|---|---|
| Dark/Light iPad Pro M4 11 | 1210×834 | fill image + #FFFFFF |
| Dark/Light iPhone | 402×874 | fill image + #FFFFFF |
| Dark/Light iPhone - Blurred | 402×874 | `use` the iPhone wallpaper + rect "Blur" 402×874 fill #F2F2F2 (blend plus-darker), blur background radius30 saturation1 |
| Dark/Light iPhone Duo/Outer | 402×874 | fill image + #FFFFFF |
| Dark/Light iPhone Duo/Inner Portrait | 669×951 | fill image + #FFFFFF |
| Dark/Light iPhone Duo/Inner Landscape | 951×669 | fill image + #FFFFFF |

The blurred iPhone wallpaper is the background of every iPhone "Widgets - …" Home Screen.

### Home Screen — iPad (1210×834)

Screen = Wallpaper + `App Layout iPad` (one of `􀻃/Layouts - iPad/…`) + Dock 740×107 @235,699 + Status Bar `Status Bars/iPad/Dark Background/Full Screen/Menu Collapsed` @0,0 (both appearances use the Dark Background bar). Dock is centred (derived (1210 − 740) / 2 = 235) with 28 below it (derived 834 − 699 − 107).

Icon grid (`􀻃/Layouts - iPad`): group "Icons" 1210 wide, stack v, pad 0,162,0,162, so the rows are 886 wide @162. Icons are `App Icons/Home Screen/Home Screen - iPad` 68×68.

| Layout | "Icons" group | Row gap (stack) | Row y inside the group | Column x inside a row |
|---|---|---|---|---|
| Default | 1210×431 @0,84 | 53 | 0, 121, 242, 363 (last row empty) | 0, 163.6, 327.2, 490.8, 654.4, 818 |
| Widget - Small | 1210×551 @0,83 | 93 | 0, 161, 322, 483 | 0, 163.6 … 818 (last row: 0, 204.5, 409, 613.5, 818) |
| Widget - Medium | 1210×574 @0,83 | 93 | 0, 161, 322, 483 | same 6 columns |
| Widget - Large | 1210×522.5 @0,82 | 76 | 0, 144, 288, 432 (last row 90.5 tall, icons at y11.25) | same 6 columns |
| Widget - Extra Large | 1210×551 @0,83 | 93 | 0, 161, 322, 483 | same 6 columns |

Derived: column pitch 163.6 (gap 95.6 between 68-pt icons). The row stacks store `gap98`, which does not match the positions. Places a widget covers hold `rect "Blank"` layers of icon size. Widgets are placed at @127,49: Extra Large 628×300, Large 300×300, Medium 300×136, Small 138×138 (the Small layout's instance points at the Medium master).

Dock - iPad (740×107): corners 36, stack h gap19.5 pad19.5,19.5,19.5,19.5.

| Part | Size, position |
|---|---|
| App icons (Messages, Safari, Music, Mail, Files [Calendar artwork], Photos, Siri) | 68×68 at x 19.5, 107, 194.5, 282, 369.5, 457, 544.5; y19.5 (pitch 87.5 = 68 + 19.5, derived); corners 16.5 on the instances |
| rect "Separator" | 1×62 @632,22.5 |
| group "App Library" | 68×68 @652.5,19.5, three stacked glass "Frame" layers: 68×68 @0,0 corners 17; 60×60 @-4.5,4 corners 16; 61×54 @-8.5,7 corners 16 (Dark) / 15 (Light). Four mini icons 23×23 at @9,8.5, @36.5,8.5, @9,36, @36.5,36, corners 8.5 (8 on one) |

### Home Screen — iPhone (402×874)

Screen = Wallpaper (blurred for widget screens) + dimming overlay (Default screens only) + `App Icons` layout + Dock + Search Field + Status Bar `Status Bars/iPhone 18 Pro/Dark Background` (both appearances).

| Part | Default screens | Widgets screens | Quick Actions screens |
|---|---|---|---|
| Dimming overlay | 402×874 #000000@8% (Dark) / #000000@10% (Light) | none | "Dimming Overlay" #000000 opacity 50% (Dark) / 20% (Light) |
| Dock 368×103 | @17,754 | @16,759 | @16,764 |
| Search Field 78×30 | @162,704 | @162,709 (Dark) / @158,709 (Light) | none |

Icon grid (`􀻃/Layouts - iPhone`): stack v, pad 90,30,0,30 (Default, Default + Custom Icon, Medium, Large, XL) or 80,30,0,30 (Widget - Small). Rows are 342×64 @30, stack h gap24. Icons are `App Icons/Home Screen/Home Screen - iPhone` 64×64.

| Layout | Row y (screen) | Column x inside a row | Widget instance |
|---|---|---|---|
| Default | 90, 190.33, 290.67, 391 | 0, 92.67, 185.33, 278 | none |
| Default + Custom Icon | 90, 190.33, 290.67, 391, 491.33 (fifth row holds "Your App" @0,0) | same | none |
| Widget - Small | "Top Rows" 342×185 @30,80 (rows 85 tall at 0 and 100, icons at y10.5, gap15); "Bottom Rows" 342×264 @30,291 (rows at 0, 100, 200, gap36) | 0, 92.67 (or 93.33 / 186.67 in Top Rows), 185.33, 278 | Small 164.67×184.67 @26,90 |
| Widget - Medium | "Icons" 342×582.67 @30,291.33, rows at 0, 100.33, 200.67, 301 (gap36.33) | same | Medium 349.67×184.33 @26.17,90 |
| Widget - Large | "Icons" 342×382 @30,492, rows at 0, 100.33 | same | Large 349.67×385 @26.17,90 |
| Widget - XL | no icons | — | XL 349.67×585.67 @26.17,90 |

Derived: row pitch 100.33 (64 + gap 36.33); column pitch 92.67, gap 28.67 between icons; the rows store `gap24`, which does not match the positions.

Dock - iPhone (368×103): corners 38, stack h gap0 pad20,19,19,19. Four 64×64 icons (Phone, Safari, Messages, Music) at x 19, 107.67, 196.33, 285, y20 (pitch 88.67, derived). Derived bottom inset: 17 on Default screens (874 − 754 − 103), 12 on widget screens, 7 on Quick Actions screens.

Search Field (78×30): corners 41; text "Search" 55×16 @11,6.66, content "􀊫 Search" (glyph U+1002AB). Centred on Default screens (derived (402 − 78) / 2 = 162).

### Home Screen — iPhone Duo

| Part | Outer Portrait 466×678 | Inner Portrait 669×951 | Inner Landscape 951×669 |
|---|---|---|---|
| Dimming overlay | #000000@8% (Dark) / @10% (Light) | same | same |
| "Vertical Bar" (status bar column) | 84×678 @382,0, stack v gap4 pad24,24,0,12; Camera Punchout 48×42 @12,24; status bar 48×83 @12,70 | 84×951 @585,0, pad20,24,0,12; status bar @12,20 | 84×669 @867,0, pad20,24,0,12; status bar @12,20 |
| Dock container | 84×678 @382,0, stack v pad95,12,0,0 | 669×120 @0,831, stack h pad20,0,8,0 | 84×669 @867,0, stack h pad90,12,0,0 |
| Dock | 72×264 @0,254.5, corners 24, stack v gap16 pad12 | 320×92 @174.5,20, corners 32, stack h gap16 pad16 | 72×264 @0,247.5, corners 24, stack v gap16 pad12 |
| Dock icons | 48×48 at y 12, 76, 140, 204 (x12), corners 12 | 60×60 at x 16, 92, 168, 244 (y16), corners 16 | 48×48 at y 12, 76, 140, 204, corners 12 |
| "App Icons" stack | v gap38.67 pad55.33,114.33,0,27.67 | v gap58 pad82,145.33,0,145.33 | h gap0 pad54.33,84,0,73; columns "Leading" 397 wide @73,54.33 and "Trailing" 397×256 @470,54.33, each stack v gap38 |
| Rows | 324×60 @27.67, y 55.33, 154, 252.67, 351.34, 450.01, 548.68 (6 rows) | 378.34×60 @145.33, y 82, 200, 318, 436, 554, 672 (6 rows) | 397×60, y 0, 98, 196 … inside each column (Leading: 6 rows Dark, 7 rows Light; Trailing: 3 rows) |
| Icon x in a row | 0, 88, 176, 264 (stack gap24) | 0, 106.11, 212.23, 318.34 (stack gap24) | 0, 88, 176, 264 (stack gap28) |
| Icon size | 60×60 | 60×60 | 60×60 |

The Duo home screens place the dock and status bar in the same 84-wide trailing column, except Inner Portrait, where the dock sits at the bottom.

### Home Screen widgets

iPad (`Widgets/iPad/…`): "Widget" group with "Background" (fill #6155F5 {System Colors/Light/9 Indigo}) and "Glass" (`Liquid Glass/Widget Glass`), both the full widget size, corners 21; plus "Padding" → Padding Guide (18pt) at full size.

| Widget | iPad | iPhone component | iPhone "Frame" (widget body) |
|---|---|---|---|
| Small | 136×136 | 164×184.67 | 164.67×164.67 @-0.33,0 |
| Medium | 300×136 | 349×184.33 | 349.67×164.33 @-0.33,0 (Glass 350×164.67) |
| Large | 300×300 | 349×385 | 349.67×365 @-0.33,0 |
| Extra Large / XL | 628×300 | 349×585.67 | 349.67×565.67 @-0.33,0 |
| Corner radius | 21 | — | 28 |

iPhone widgets add a name label under the body: stack v gap6 pad0; text "Widget Name" 79×14, centred (x42.5 on Small, x135 on the others); label y = body height + 6 (derived: 164.67 + 6 = 170.67).

`􀻃/Widget Layout Guide/Padding Guide (18pt)` 120×120: fill #FFFFFF, corners 27.88; rect "Rectangle" 84×84 @18,18, border 0.5 outside #000000, dash 4, corners 10. Content inset 18 on every side (derived from the rect position).

### Home Screen Quick Actions

| Component | Size | Stack | Parts |
|---|---|---|---|
| Menu Item - Default / Destructive (Dark, Light) | 101×44 (instances 189, 211, 218 or 226 wide) | h gap12 pad11,8,11,8 | text "Symbol" "􀓔" 24×22 @8,11; text "Label" "Action" 49×22 @44,11 |
| Widgets (Dark, Light) | 196×46 (instances 211 or 218 wide) | h gap0 pad7,4,1,4 | five "Frame" 38×38 at x 4, 42, 80, 118, 156, y7, corners 7. Frame 1: shape 17×17 @9.91,9.99; Frames 2–4: glyphs 􂘬 U+10262C, 􂘭 U+10262D, 􂘮 U+10262E; Frame 5: shape 22×25 @8,6.5 |
| HSQA Menu - Widgets | Dark 243×328, Light 250×328 | v gap0 pad10,16,8,16 | items, top to bottom: Remove App (Destructive, "􀁎" U+10004E) y10; Require Face ID ("􀎽" U+1003BD) y54; Edit Home Screen ("􀮖" U+100B96) y98; Action 2 y142; Action 3 y186; Action 4 y230; Widgets row y274; all at x16 |
| HSQA Menu - No Widgets | Dark 221×295, Light 250×295 | Dark v gap0 pad10,16,21,16; Light pad10,8,21,16 | same six items, no widgets row |

Menu corners 30 on all four menus.

Screens: iPad: Home Screen (Default + Custom Icon) + rect "Overlay" 1210×834 #000000@48% (Dark) / @20% (Light) + menu 250×328 @157,106 + icon `App Icons/Home Screen/Home Screen Quick Action` 78×78 @157,442 (8 below the menu, derived 442 − 434). iPhone: Home Screen layout + dock + dimming overlay + menu 250×328 @28,142 + icon 74×74 @28,482 (12 below the menu, derived 482 − 470).

### Lock Screen

iPhone "Date and Time" (402×123.41 @0,79, stack v gap10): text "Date" "Tue April 1" 104×26 @149,0; shape "Time" 68.83×84.55 @196.08,37.45 (`Liquid Glass/Lock Screen Time`).

iPad `􀻃/iPad - Lock Screen Date & Time Lockup` 576×261: text "Lock" "􀎡" (U+1003A1) 18×23 @279.5,27; text "Date" "Apr 1  􀇕  Cupertino" (􀇕 U+1001D5) 265×28 @156,65; shape "Time" 239.31×102 @168,105 (`Liquid Glass/Lock Screen Time`). Placed at @317,0 on iPad screens (@309,0 on the Dark iPad example).

Lock Screen controls: `System/Lock Screen Widgets/Control` 58×58, `Liquid Glass/Clear`, corners 1000; text "Symbol" "􀌟" (U+10031F) 50×50 @4,4 (the Action 1 instances override it with "􀝌" U+10074C). Row: group 402×108 @0,766, stack h pad0,46,50,46, controls at x46 and x298 (46 from each edge, 50 from the bottom; derived 402 − 298 − 58 = 46). Swipe-down indicator: rect 48×2.33 @309,47, corners 1.17.

Lock Screen widgets — iPhone rectangular (162×72):

| Widget | Stack | Parts |
|---|---|---|
| Modular with Bar | h gap4 pad8,8,10,0 | rect "Bar" 5×54 @0,8 corners 3 opacity 90%; text column 148×53 @9,8: Title "11:30AM-12:30PM" 148×19 @0,0; Subtitle "Design Review" @0,19; Subtitle "Conference Room" @0,36 |
| Rectangular with Chart | v gap2 pad6,8,0,8 | "Title" row 148×20 @6,6 (gap2): Icon "􀿫" 11×16, Title 97×20 @13,0, Content "Body" 36×20 @112,0; "Frame" 146×44 @8,28 with chart path, gradient fill and a 145×1 line @0,35.5 |
| Rectangular Text Gauge | v gap6 pad6,8,15,8 | row 67×20 (Symbol "􀿫" 18×20 + Title 47×20, gap2); Second Line 38×16 @0,21; gauge track "Frame" 146×8 @8,49 corners 4; "Filled" 73×8 corners 4 |
| Tall Body with Icon | v gap0 pad6,8,9,8 | "Header" 80×20 @8,6 (Icon 18×20 + Title "header" 61×20, gap1); "Content" "Body" 150×34 @8,26 |
| Tall Body | v gap0 pad6,8,7,8 | "Title" "Caption" 146×20 @8,6; "Content" "Tall body" 146×40 @8,26 |
| Modular Columns | v gap0 pad7,8,11,8 | three rows 146×18 at y 7, 25, 43 (gap2): Symbol 11×16 @0,1; Title 95×20 @13,-1; Content 36×20 @110,-1 |
| Modular Table | v gap2 pad6,8,6,8 | "Header" 146×21 @8,6 (pad3,0,0,0; Symbol 16×16 @0,4; Title "Header" 128×18 @18,3); Title 146×16 @8,29; Body 146×16 @8,47 |
| Modular Standard | v gap1 pad4,8,0,8 | "Header" 70×13 @8,4 (gap3): Icon 12×13, divider rect 1×13 @15,0 corners 1, Title "HEADER" 51×13 @19,0; "Preview" 148×48 @8,18 |
| Modular List | v gap1 pad8,8,8,8 | three items 146×18 at y 8, 27, 46 (gap3): Symbol "􀀀" (U+100000) 15×16 @0,1; label 128×20 @18,-1 |

Lock Screen widgets — iPhone circular (72×72). Every circular widget draws inside 58×58 @7,7 (7 inset, derived).

| Widget | Parts |
|---|---|
| Circular Icon | group "Blur" 58×58, corners max; group "Plus Lighter" 58×58, corners max; Icon "􀿫" 58×58 |
| Circular Open Gauge 3 | shape "Blur" 58×45; "Gauge" 58×45; "Current Value" 7×7 @42,5.72 corners 4; "AQI" 39×15 @9.5,43; "Label" "72" 29×29 @14.5,12.5 |
| Circular Open Gauge 2 | as Gauge 3, with "Left Label" "52" 16×15 @9.5,43 and "Right Label" "89" 17×15 @31.5,43 |
| Circular Open Gauge | "Blur"/"Gauge" 58×50.01; oval "Current Value Indicator" 5.5×5.5 @26.2,0; Label "35" 21×24 @18,16.1; Icon 18×20 @20.2,40.1 |
| Circular Closed Gauge | "Gauge" 58×58; filled "Combined Shape" 50.31×58 @7.69,0; Icon 58×58 |
| Circular Stack 2 Rows - Labels | top Label 29×13 @14.5,14; Label 38×20 @10,24.5 |
| Circular Stack 2 Rows - Icon and Label | Icon 13×13 @22.5,14.64; Label 38×20 @10,24.9 |
| Clock | "NYC" 21×11 @18.5,12.76; dial "Combined Shape" 52×52 @3,3; two hand shapes |
| Circular Stack 3 Rows | Icon "􀆴" (U+1001B4) 58×16 @0,4; Time "8:26" 58×20 @0,19; "PM" 58×13 @0,38 |

Lock Screen widget rows (`Widgets/iPhone/…`, 342×72):

| Row | Stack | Children (x) |
|---|---|---|
| 1 Circular | h gap0 pad0 | Circular Stack 2 Rows - Labels @135 |
| 2 Circular | h gap18 pad0,81,0,81 | Closed Gauge @90, Open Gauge @180 |
| 3 Circular | h gap18 pad0,36,0,36 | Open Gauge 2 @45, Clock @135, Stack 3 Rows @225 |
| 4 Circular | h gap18 pad0 | Open Gauge 2 @0, Clock @90, Open Gauge @180 (override "􀙖" U+100656, "50%"), Stack 3 Rows @270 |
| Modular + 2 Circular | h gap18 | Modular Columns @0, Open Gauge @180, Stack 3 Rows @270 |
| Modular + Circular | h gap108 | Tall Body @0, Stack 2 Rows - Labels @270 |
| 2 Modular | h gap18 | Rectangular Text Gauge @0, Modular List @180 |
| 1 Modular | h gap0 | Modular Standard @0 |

Derived: four circular widgets fill 342 exactly (4 × 72 + 3 × 18); two rectangular widgets fill 342 (2 × 162 + 18).

iPad Lock Screen widgets (162×162):

- iPad Clock Big: path "Face" 152×152 @5,5 (`Materials/Light/4 Ultrathin`); "Ticks Minor" 146×146 @8.39,8.39 (ticks 3.63×5.65); "Ticks Major" 147×146 @8,8; "Numbers" 122×131 @20.2,16.84 (12 hour numerals, each 8–19 wide × 20 tall); "Hands" 65×101 @20.64,8.5: Hour Hand 33.82×15.52, Minute Hand 63.37×31.91, Second Hand 1.03×80.
- iPad Date: group "Stack" 162×38 @0,5, stack h gap8: "Wed" 66×38 @17.5,0 and "Apr" 53×38 @91.5,0; path 39×89 @59.51,54 below.

Lock Screen examples:

- iPhone: widgets row `4 Circular` 342×72 @33,214 (Dark) / @30,214 (Light); controls row, home indicator, date/time and inline status bar as above.
- iPad: column "Date & Time + Widgets" 162 wide @47,66 (Dark) / @47,68 (Light): iPad Date @0,0 (162 tall); Modular with Bar @0,180; Circular Open Gauge 2 @0,270 and Gauge 3 @90,270; Rectangular with Chart @0,360; iPad Clock Big @0,450; Tall Body @0,630. Derived: 18 between widgets vertically and horizontally (180 − 162, 270 − 252, 90 − 72).

### Notifications

Banner `1 Single` (300×62.33): `Liquid Glass/Clear`, corners 22, stack h gap10 pad12,14,12,14.

| Part | Size, position |
|---|---|
| group "Stack" (icon) | 38.33×38.33 @14,12 → `App Icons/Artwork/Default/Custom` (Over Light) or `…/Dark/Custom` (Over Dark) |
| group "Text" / "Content" | 223.67×35 @62.33,12, stack v gap0 |
| Title row | 223.67×17 @0,0: Title 166.67×17 @0,0; Time "9:41 AM" 57×17 @166.67,0 |
| Description | 223.67×18 @0,17 |

`1 Single with Image` (300×78): same shell; text block 223.67×54, stack h: "Title and Description" 166.67×54 (Title @0,9.5, Description @0,26.5) and "Date and Image" 57×54 (Time @0,0; rect "Image" 32×32 @25,22, corners 6, opacity 50%); icon stack 38.33×54 with the icon at @0,7.83.

Stacked banners (the extra banners peek out underneath):

| Component | Size | Front banner | Second banner | Third banner |
|---|---|---|---|---|
| 2 Double (Over Light) | 300×70.33 | 1 Single @0,0 | group 300×8 @0,62.33 (pad-49,20,0,20) → Banner 260×63 @20,-55, corners 24, pad10 | — |
| 2 Double (Over Dark) | 300×70.33 | 1 Single @0,0 | Banner 260×57 @20,-49 | — |
| 3 Triple (Over Light) | 300×80 | 1 Single | group @0,62.33 → Banner 260×63 @20,-55 | group 300×8 @0,70.33 (pad-49,40,0,40) → Banner 220×63 @40,-55 |
| 3 Triple (Over Dark) | 300×80 | 1 Single | group @0,62.33, opacity 75% → Banner 260×63 @20,-55 | Banner 220×68 @40,-60 |

Derived: each banner behind is 20 narrower per side and shows 8 below the one in front.

Lock Screen notification lists:

| Screen | Group | Banners |
|---|---|---|
| iPad Collapsed | "Notification Group" 424×301 @381,447 (Dark) / 424×297.33 @381,450.67 (Light), stack v gap8 | 1 Single @0,0; 1 Single @0,70.33; 2 Double @0,140.67 (144.33 Dark); 3 Triple @0,219 (222.67 Dark), all 424 wide, all `Over Dark` |
| iPhone Collapsed | 402×427.33 @0,446.67, stack v gap8 pad0,16,130,16 | same four banners, 370 wide @16, all `Over Dark`; Dark adds rect "Overlay Blurred" 370×305 @16,0.33 |

Expanded notification (long-look card) with action menu:

| Part | iPad | iPhone |
|---|---|---|
| Container "Stack" | 501×460 @354.5,309, stack v gap16 pad0,0,-1,0 (centred; derived (1210 − 501) / 2) | 402×552 @0,322, stack v gap10 pad0,16,68,16 |
| "Expanded Notification" | 501×340 @0,0, corners 26, stack v gap0 pad0,-1,0,0 | 370×370 @16,0, corners 26, stack v gap0 |
| "Header" | 501×66, stack h gap12 pad14: Icon 38×38 @14,14 (artwork 38.33×38.33 @-0.17,-0.17); "Content" 423×37 @64,14 (stack v gap1 pad1,0,0,0): title row 423×17 (Title 383 wide, Time "now" 40×17 @383,0), Description 423×18 @0,19 | Light: 370×66; Content 292×36, Title 252 wide, Time @252,0. Dark: 501×66 / 423 wide (the iPad values, wider than the 370 card) |
| "Body" | 501×274 @0,66, fill #0088FF@50%, stack h gap12 pad14; Description "Notification Content" 473×18 @14,128 | 370×304 @0,66; Description 342 wide @14,143 (Dark) / @14,143.5 (Light) |
| "Menu" | 250×104 @125.5,356 (centred in 501), corners 32, stack v gap20 pad20,26,20,26 | 250×104 @76,380, corners 32 |
| Menu items | "Action 1" 198×22 @26,20, "Action 2" @26,62; each stack h gap14: Symbol "􀓔" (U+1004D4) 20×22 @0,0, Label "Action" 164×22 @34,0 | same |

### Control Center

Control tiles. All iPad tiles use `Liquid Glass/Clear`; all iPhone tiles too, with a larger glass radius (see Effects).

| Component | iPad | iPhone |
|---|---|---|
| 1x1 | 66×66, corners max; glyph text "􀑚" (U+10045A) 38×38 @14.5,14 | 68×68, corners 34; glyph "􀑚" 68×68 @0,0 |
| 2x1 - Menu | 142×66, corners max, stack h gap8 pad0,14,0,14; Button 40×40 @14,13 corners 28; "Stack"/"Popup Menu" 60×20 @62,23 (gap4): Label "Option" 46×16 @0,2, Menu Indicator "􀆏" (U+10018F) 10×20 @50,0 | 155×69, corners 34, stack h gap8 pad0,14,0,14; Button 41×41 @14,14 corners 21; label stack 60×20 @63,24.5 |
| 2x1 - Toggle | 142×66, corners max, stack h gap8 pad0,14,0,14; Button 40×40 @14,13; "Title and Detail" 66×37 @62,14.5 (stack v pad1,0,0,0): Title 30×16 @0,1, Detail 39×20 @0,17 | 155×69, corners 34, stack h gap7 (Off) / gap8 (On) pad0,14,0,14; Button 41×41 @14,14 corners 21; Title and Detail 39×37 @62,16 (Off) / @63,16 (On) |
| 2x2 | 142×142, corners 28, stack v gap34 pad14; Button 40×40 @14,14 (corners 28 Off, 20 On); "Title and Detail" 41×38 @14,90 (stack v pad0,0,2,2): Title 30×16 @2,0, Detail 39×20 @2,16 | Off 158.06×155, stack v gap46 pad14; On 155×155, stack v gap47 pad14,14,15,14; Button 40×40 @14,14 corners 20; Title and Detail 41×38 @14,103 (Off) / @14,102 (On) |
| Button glyph | "􀆺" (U+1001BA) 40×40 (41×41 on iPhone 2x1) | same |

Control Center screens:

iPad (1210×834): Lock Screen example (with its widgets hidden) + `System/Control Center/􀻃/Overlay` (100×100, fill #000000@45%, stretched to 1210×834) + group "Controls" 295×446 @866,117 (Dark) / @866,105 (Light).

| Tile in "Controls" (iPad) | Size | Position |
|---|---|---|
| 2x2 - Group | 142×142 | @0,0 |
| 2x2 - Now Playing | 142×142 | @152,0 |
| 1x1 - Rotation Lock | 66×66 | @0,152 |
| 1x1 - Control | 66×66 | @75.5,152 |
| 1x2 - Brightness Slider | 66×142 | @152,152 |
| 1x2 - Volume Slider | 66×142 | @228,152 |
| 2x1 - Control (Focus) | 142×66 | @0,228 |
| 2x2 - Control (Hallway, Floor Lamp, "􀛮" U+1006EE) | 142×142 | @0,304 |
| 1x1 - Camera | 66×66 | @152,304 |
| 1x1 - Mirror Screen | 66×66 | @228,304 |
| 1x1 - Battery | 66×66 | @152,380 |

Derived: grid pitch 76, gap 10 (142 = 2 × 66 + 10). Inline tiles here use corners 34.

iPad top area: text "􀅼" (U+10017C) 44×44 @858,16; "􀆨" (U+1001A8) 44×44 @1123,16; "Status bar" group 98×18 @1057,66: Wifi "􀙇" (U+100647) 20×18 @0,0, "100%" 41×18 @22,0, Battery 30.75×14 @67,2 (rect "Border" 28×14 corners 4 opacity 40%; "Capacity" 23×9 @2.5,2.5 corners 2; cap 1.75×5.5 @29,4 opacity 50%). Index Scrubber 16×128 @1177,341, stack v gap40, three 16×16 items.

iPhone (402×874): Lock Screen example (widgets hidden) + rect "Overlay" 402×874 + group "Controls" 327×497 @37,132 (both appearances).

| Tile in "Controls" (iPhone) | Size | Position |
|---|---|---|
| 2x2 - Group | 155×155 | @1,0 |
| 2x2 - Now Playing | 155×155 | @171,0 |
| 1x1 - Rotation Lock | 68×68 | @1,171 |
| 1x1 - Control | 68×68 | @88.5,171 |
| 1x2 - Brightness Slider | 70×155 | @171,171 |
| 1x2 - Volume Slider | 70×155 | @256,171 |
| 2x1 - Control | 155×69 | @1,257 |
| 2x2 - Control | 155×155 | @0,342 |
| 1x1 - Camera | 70×70 | @171,342 |
| 1x1 - Mirror Screen | 70×70 | @256.5,342 |
| 1x1 - Battery | 70×70 | @171,427 |

Derived gaps from these positions: 15 between columns 1 and 2 (171 − 156), 15.5 or 15 between columns 3 and 4; 16 between rows 1 and 2 (171 − 155), 16 between the 2x1 and the 2x2 below it (342 − 326), 15 between the 1x1 rows (427 − 412). The kit has no single gap value.

iPhone top area: group "Status Bar" 402×110.67 @0,0, stack v gap46 pad23,0,0,0: "Plus and Power Buttons" 402×28.67 @0,23 (stack h pad0,38,0,38): Plus 28.67×28.67 @38,0 with "􀅼" 44×44 @-7.66,-7.66 (stack pad-8 on all sides); Power 28.67×28.67 @335.33,0 with "􀆨" 28×28; "Signal and Battery"/"Stack" 402×13 @0,97.67 (pad0,42.67,0,42.67): Leading 44.99×13 @42.67 (Cellular 19.33×12.33 @3,0.33, bars 3.28 wide at heights 4.75/6.97/9.53/12.33; Wifi 16.66×12.33 @28.33,0.33), Trailing 75×13 @284.33 ("100%" 41×18 @0,-2.5; Battery 28×13.33 @47,-0.17). Index Scrubber 16×232 @375,321.24, stack v gap38, five 16×16 items.

Tile contents:

| Tile | iPad | iPhone |
|---|---|---|
| 2x2 - Group | buttons: "Stack" 51×51 @13,13 (Airplane, "􀑓" U+100453); 50×50 @78,13 and 50×50 @13,79 (blue); group 51×51 @78,78 with four 23×23 minis: Cellular @0,0 corners 12, Bluetooth @28,0 corners 28, Personal Hotspot @0,28 and Network @28,28 corners 29.65 | Airplane Mode 56×56 @16,16; Wifi 56×56 @83,16 corners 28; Frame 56×56 @16,83; Frame 52×53 @85,85 with Cellular 22.67 @0,0 and Bluetooth 22.67 @29,0 (corners 12), Personal Hotspot 23 @0,29 and Network 23 @29,29.33 (corners 29.65) |
| 2x2 - Now Playing | Album Artwork 50×50 @14,14 corners 14; AirPlay group 39×39 @89,14; Track 119×16 @16,67; Artist 37×20 @16,83; Playback Controls 99×30 @21.5,102: "􀊊" (U+10028A) 25×19 @0,6, "􀊆" (U+100286) 23×30 @39,0, "􀊌" (U+10028C) 25×19 @74,6 | Artwork 52×52 @14,14; AirPlay 40×40 @101,14; Track @16,73; Artist @16,89; Playback 108×30 @21.5,114 (Light: 109×30, stack h gap18): 􀊊 @0,6, 􀊆 @43,0, 􀊌 @83,6 |
| 1x2 - Volume Slider | filled "Stack" 66×86 @0,56, stack v gap4 pad22,0,22,0; Speaker 31×22 @17.5,42 | 70×86 @0,69; Speaker @19.5,42 |
| 1x2 - Brightness Slider | filled "Stack" 66×114 @0,28, stack v pad18,0,18,0; "􀆮" (U+1001AE) 32×30 @17,66 | 70×114 @0,41; 􀆮 @19,66 |
| 1x1 - Camera | "􀌟" 36×23 @15,21.97 | "􀌟" 49.41×47.35 @10.29,11.32 |
| 1x1 - Rotation Lock | "􀑚" 42×42 @12,12 | "􀑚" 42×42 @13,13 |
| 1x1 - Battery, Mirror Screen | vector shapes (battery 37.47×17.74; mirror 25.26×20.17 ×2) | same shapes |

### App icons

`App Icons/Artwork/{Default|Dark}/<App>`: every one of the 96 artwork masters is 66×66 with fill #FFFFFF and one `image` layer 66×66 @0,0 named `<app>-iOS-Default` or `<app>-iOS-Dark` (grep-checked: 96 images, all 66×66).

The 48 apps (each in Default and Dark): Airdrop, App Store, Books, Calculator, Calendar, Camera, Clock, Contacts, Custom (image "placeholder-iOS-…", the stand-in for your own icon), FaceTime, Files, Find My, Fitness, Freeform, Games, Health, Home, Image Playground, iTunes Store, Journal, Keynote, Mail, Maps, Measure, Messages, Music, News, Notes, Numbers, Pages, Passwords, Phone, Photos, Podcasts, Preview, Reminders, Safari, Settings, Shortcuts, Siri, Stocks, Tips, Translate, TV, Voice Memos, Wallet, Watch, Weather.

Icon frames (`App Icons/Home Screen/…`):

| Component | Size | Name label | Badge |
|---|---|---|---|
| Home Screen - iPad | 68×68 | text "App Name" 61×14 @3.5,74 | Badge 26×24 @55,-12.5 (text "2") |
| Home Screen - iPhone | 64×64 | group "Name" 66×14 @-1,69, text 61×14 @3,0 | Badge 24×24 @53,-12.5 (text "1") |
| Home Screen - iPhone Duo/Inner Landscape | 60×60 | group 66×14 @-3,65 | 24×24 @48.94,-12.5 |
| Home Screen - iPhone Duo/Inner Portrait | 60×60 | group 66×14 @-3,71.33 | 24×24 @48.94,-12.5 |
| Home Screen - iPhone Duo/Outer Portrait | 60×60 | group 66×14 @-3,65 | 24×24 @48.94,-12.5 |
| Home Screen Quick Action | 70×70 (instances 74×74 iPhone, 78×78 iPad) | none | none |

Derived label gap below the icon: 6 on iPad (74 − 68), 5 on iPhone and Duo (69 − 64, 65 − 60).

`App Icons/􀻃 - Badge/Badge` 44×24: corners 100, stack h gap0 pad2.5,8,2.5,8; text "Badge Count" "247" 28×19 @8,2.5.

Sizes the artwork is placed at elsewhere: 23×23 (App Library folder), 38.33×38.33 (notifications), 48×48 (Duo docks), 60×60, 64×64, 68×68.
