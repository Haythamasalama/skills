# Menus — macOS 27

**Read when:** you need an exact macOS 27 value for menus (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Menus in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/menus.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The 􀻃 (U+100EC3) folder in component names is the kit's folder for building-block parts.

## Components

126 components, 63 per appearance. No documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Examples (menu + submenu on wallpaper) | `Menus/{Dark,Light}/Examples/{Mini,Small,Regular}` | appearance × size | 6 |
| Items, menu with selection | `Menus/{A}/{Regular,Small,Mini}/Menu with Selection/Items/{1 - Idle, 2 - Hover, 4 - Disabled}` | appearance × size × state | 18 |
| Submenu items, menu with selection | `Menus/{A}/{Size}/Menu with Selection/Items - Submenu/{1 - Idle, 3 -Open}` (stored as `3 -Open`, no space) | appearance × size × state | 12 |
| Items, menu without selection | `Menus/{A}/{Size}/Menu without Selection/Items/{1 - Idle, 2 - Hover, 4 - Disabled}` | appearance × size × state | 18 |
| Submenu items, menu without selection | `Menus/{A}/{Size}/Menu without Selection/Items - Submenu/{1 - Idle, 3 - Open}` | appearance × size × state | 12 |
| Separator | `Menus/{A}/{Size}/Separator` | appearance × size | 6 |
| Header | `Menus/{A}/{Size}/Header` | appearance × size | 6 |
| Keyboard Shortcut (key group) | `Menus/{A}/{Size}/􀻃/Keyboard Shortcut` | appearance × size | 6 |
| Modifier keys | `Menus/{A}/{Size}/􀻃/Keyboard Shortcuts/{Command (􀆔), Shift (􀆝), Option (􀆕), Control (􀆍)}` | appearance × size × key | 24 |
| Symbol | `Menus/{A}/{Size}/􀻃/Symbol` | appearance × size | 6 |
| Checkmark | `Menus/{A}/{Size}/􀻃/Checkmark/{Off,On}` | appearance × size × state | 12 |

Sizes are Regular, Small and Mini. "Menu with Selection" rows reserve a checkmark column; "Menu without Selection" rows do not.

## Anatomy

### Menu container (from the Examples)

The menu itself is not a component; each Example draws it as `group "Menu"` and `group "Submenu"` over `use "Wallpaper" 1512×982 @-661,-241` in a 420×420 frame.

| Size | Menu | Submenu | Style | Corners | Auto layout (T,R,B,L) |
|---|---|---|---|---|---|
| Regular | 244×284 @40,40 | 120×107 @279,290 | `Liquid Glass/{Dark,Light}/Menus` | 12 | Menu `stack v gap0 pad6,16,5,16`; Submenu `pad5,16,5,16` |
| Small | 213×264 @40,40 | 104×98 @248,272 | same | 12 | Menu and Submenu `pad5,14,5,14` |
| Mini | 184×234 @40,40 | 88×86 @219,245 | same | 12 | Menu and Submenu `pad5,12,5,12` |

Derived from those numbers:

| Size | Content width (menu − side padding) | Hover highlight inset from the menu edge | Submenu overlap with the menu | Submenu's first item vs. the parent item |
|---|---|---|---|---|
| Regular | 212 (244 − 16 − 16) | 5 (16 padding − 11 overhang) | 5 (40 + 244 − 279) | same y: 40 + 255 = 295; 290 + 5 = 295 |
| Small | 185 (213 − 14 − 14) | 5 (14 − 9) | 5 (40 + 213 − 248) | same y: 40 + 237 = 277; 272 + 5 = 277 |
| Mini | 160 (184 − 12 − 12) | 5 (12 − 7) | 5 (40 + 184 − 219) | same y: 40 + 210 = 250; 245 + 5 = 250 |

Example contents, top to bottom (Regular; Small and Mini match): Cut, Copy, Paste, Duplicate · separator · Header · Item with Symbol · separator · Copy Style, Paste Style, All Shortcuts · separator · Cities (submenu item, open). The submenu holds Cupertino, San Francisco (Hover), New York, Chicago. The item symbols are overridden to 􀈕 (U+100215), 􀅴 (U+100174), 􀏅 (U+1003C5) and 􀆪 (U+1001AA); shortcut keys to X, C, V, D and A.

All Example rows are stacked with gap 0, so the menu height is the sum of the rows plus the padding (Regular: 6 + 9 items × 24 + header 24 + 3 separators × 11 + 5 = 284).

### Menu item (`Items`)

Every item master is 160 wide, `stack h gap8`, and stretches to the content width in a menu (212, 185, 160).

| Layer | With Selection | Without Selection |
|---|---|---|
| `Checkmark` | `use` → `􀻃/Checkmark/Off` (or `On`), 4×16 @0 | not present |
| `Symbol` | `use` → `􀻃/Symbol` @12 | @0 |
| `text "Item"` | after Symbol + 8 | after Symbol + 8 |
| `Shortcut` (`Shortcuts` in Hover) | `use` → `􀻃/Keyboard Shortcut`, flush right | flush right |
| `rect "BG"` (Hover only) | wider than the item, see Sizes | same |

Positions by size (checked in Dark and Light):

| Size | Item H | Checkmark | Symbol (with / without) | Item text (with / without) | Shortcut (with / without) |
|---|---|---|---|---|---|
| Regular | 24 | 4×16 @0,4 | 11×16 @12,4 / @0,4 | 55×15 @31,4.5 / 67×15 @19,4.5 | 66×24 @94,0 / 66×24 @94,0 |
| Small | 22 | 4×16 @0,3 | 9×16 @12,3 / @0,3 | 69×13 @29,4.5 / 92×13 @17,4.5 | 54×16 @106,3 / 43×16 @117,3 |
| Mini | 19 | 4×16 @0,1.5 | 7×16 @12,1.5 / @0,1.5 | 81×11 @27,4 / 102×11 @15,4 | 44×19 @116,0 / 35×19 @125,0 |

Derived: the checkmark column takes 12 (4 + gap 8), so text in a "with selection" menu starts 12 further right (31 vs 19, 29 vs 17, 27 vs 15). In "without selection" Small and Mini items the shortcut is narrower because the instance hides one key (`[text="C"; isVisible→0]`).

### Submenu item (`Items - Submenu`)

| Layer | Regular | Small | Mini |
|---|---|---|---|
| Item | 160×24 | 160×22 | 160×19 |
| Chevron `text "􀆊"` (U+10018A) | 12×23 @148,0.5 | 12×22 @148,0 | 12×19 @148,0 |
| `Submenu` text, with selection | 109×15 @31,4.5 | 111×13 @29,4.5 | 113×11 @27,4 |
| `Submenu` text, without selection | 121×15 @19,4.5 | 123×13 @17,4.5 | 125×11 @15,4 |
| `Symbol`, with / without selection | 11×16 @12,4 / @0,4 | 9×16 @12,3 / @0,3 | 7×16 @12,1.5 / @0,1.5 |
| `rect "BG"` (3 - Open only) | 182×24 @-11,0 | 178×22 @-9,0 | 174×19 @-7,0 |
| Auto layout, with selection | `stack h gap8 pad0,0,0,12` | same | same |
| Auto layout, without selection | `stack h gap8 pad0,0,0,0` | same | same |

"With selection" submenu items have no Checkmark layer; the 12-point left padding takes its place. Derived: the chevron ends at x 160, flush with the item's right edge.

The table follows the Dark masters. The Light masters differ: Regular Light submenu items have no Symbol layer in the dump and put the label at x 12 (with selection, 128×15) or x 0 (without, 140×15); Small Light submenu items draw the symbol as a plain `text "Symbol"` 11×13 (@12,4.5 or @0,4.5) instead of the Symbol part, except `without Selection/1 - Idle`, which uses the part @0,3 with the label at x 17.

### Parts (􀻃)

| Part | Regular | Small | Mini |
|---|---|---|---|
| `Symbol` | 11×16; text 13×15 @-1,0, 􀉁 (U+100241) | 9×16; text 11×13 @-0.12,2 | 7×16; text 9×11 @-0.25,2.5 |
| `Checkmark/On` | 4×16; text 􀆅 (U+100185) 12×16 @-6,0 | 4×16; text 12×16 @-6,0 | 4×16; text 12×16 @-6,1 |
| `Checkmark/Off` | 4×16, empty | 4×16, empty | 4×16, empty |
| `Keyboard Shortcut` | 66×26, `stack h gap1.5 pad0,0,2,0` | 54×16, `stack h gap1 pad0` | 44×16, `stack h gap1 pad0` |
| Modifier order, left to right | 􀆍 Control @0,4 · 􀆕 Option @13.5,4 · 􀆝 Shift @27,4 · 􀆔 Command @40.5,4 (each 12×16) | @0, @11, @22, @33 (each 10×16) | @0, @9, @18, @27 (each 8×16) |
| Key letter `text "A"` | 12×24 @54,0 | 10×16 @44,0 | 8×16 @36,0 |
| Modifier component | 12×16; text 12×16 @0,0 | 10×16; text 10×16 @0,0 (Option text 11×16) | 8×16; text 10×16 @-1,1 |

Code points: Command 􀆔 U+100194, Shift 􀆝 U+10019D, Option 􀆕 U+100195, Control 􀆍 U+10018D.

### Separator and Header

| Component | Regular | Small | Mini |
|---|---|---|---|
| `Separator` | 160×11, `pad5,0,5,0`; `rect` 160×1 @0,5, corners 1 | 160×11.5, `pad5.5,0,5,0`; line @0,5.5 | 160×11, `pad5,0,5,0`; line @0,5 |
| `Header` | 160×24, `pad5.5,0,3.5,0`; text 46×15 @0,5.5 | 160×21.5, `pad5,0,3.5,0`; text 40×13 @0,5 | 160×19, `pad3,0,4,0`; text 37×12 @0,3 |

Derived: the separator line spans the full content width (212 in the Regular example, at x 16), so it has no inset beyond the menu's side padding. The header text starts at x 0, the same edge as the Symbol column in a "without selection" menu.

## Sizes

| Size | Item H | Hover / open highlight | Highlight overhang each side (derived) | Highlight radius | Menu radius | Menu side padding | Item text | Header text | Separator H | Symbol frame | Shortcut |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Regular | 24 | 182×24 @-11,0 | 11 | 8 | 12 | 16 | SFPro-Medium 13, kern −0.2 | SFPro-Bold 13, kern −0.2 | 11 | 11×16 | 66 wide, gap 1.5 |
| Small | 22 | 178×22 @-9,0 | 9 | 8 | 12 | 14 | SFPro-Medium 11, kern −0.17 | SFPro-Bold 11, kern −0.17 | 11.5 | 9×16 | 54 wide, gap 1 |
| Mini | 19 | 174×19 @-7,0 | 7 | 8 | 12 | 12 | SFPro-Medium 9, kern −0.14 | SFPro-Bold 10, kern −0.15 | 11 | 7×16 | 44 wide, gap 1 |

Derived overhang: 182 − 160 = 22 = 11 + 11; 178 − 160 = 18; 174 − 160 = 14. Gap between Symbol, text and Checkmark is 8 at every size.

## Colours and states

### Dark (text and parts mostly blend plus-lighter)

| State | Highlight `BG` | Item text | Symbol | Shortcut glyphs | Checkmark | Chevron |
|---|---|---|---|---|---|---|
| 1 - Idle | none | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #FFFFFF@96% {…/1 Primary} | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | #FFFFFF@96% {…/1 Primary} | — |
| 2 - Hover | #0069F9 (no swatch), corners 8 | layer fill #FFFFFF (stored text colour #FFFFFF with selection, #4C4C4C without) | fill #FFFFFF | fill #FFFFFF on the instance | fill #FFFFFF | — |
| 4 - Disabled | none | #4C4C4C {…/3 Tertiary} | fill #4C4C4C {…/3 Tertiary} (also `fillColor→` override) | unchanged, #4C4C4C {…/3 Tertiary} | Off | — |
| Submenu 1 - Idle | none | #FFFFFF@96% {…/1 Primary} | as Idle | — | — | #4C4C4C (no swatch), SFPro-Bold 13 / Medium 11 / Medium 9 |
| Submenu 3 - Open | #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (fill blend plus-darker, layer blend plus-lighter), corners 8 | #FFFFFF@96% {…/1 Primary} | as Idle | — | — | #4C4C4C |
| Separator | — | — | — | — | — | line #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (fill blend plus-darker, layer plus-lighter) |
| Header | — | #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary} | — | — | — | — |

### Light (text and parts mostly blend plus-darker)

| State | Highlight `BG` | Item text | Symbol | Shortcut glyphs | Checkmark | Chevron |
|---|---|---|---|---|---|---|
| 1 - Idle | none | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #363636 {…/1 Primary} (no blend on the glyph) | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | #363636 {…/1 Primary} | — |
| 2 - Hover | #0069F9 (no swatch), corners 8 | layer fill #FFFFFF (stored text colour #4C4C4C) | fill #FFFFFF | fill #FFFFFF | fill #FFFFFF | — |
| 4 - Disabled | none | #B2B2B2 {…/3 Tertiary} | fill #B2B2B2 {…/3 Tertiary} | unchanged, #B2B2B2 | Off | — |
| Submenu 1 - Idle | none | #363636 {…/1 Primary} | as Idle | — | — | #4C4C4C (no swatch) |
| Submenu 3 - Open | #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker), corners 8 | #363636 {…/1 Primary} | as Idle | — | — | #4C4C4C |
| Separator | — | — | — | — | — | line #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker) |
| Header | — | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary} | — | — | — | — |

Hover is the only state with the blue highlight and white content; an open submenu item gets a neutral fill and keeps its primary label colour.

## Text

| Part | Regular | Small | Mini | Colour role |
|---|---|---|---|---|
| Item and submenu label | SFPro-Medium 13, kern −0.2, left | SFPro-Medium 11, kern −0.17 | SFPro-Medium 9, kern −0.14 | Primary (Idle), Tertiary (Disabled), white (Hover) |
| Header | SFPro-Bold 13, kern −0.2, left | SFPro-Bold 11, kern −0.17 | SFPro-Bold 10, kern −0.15 | Secondary |
| Symbol 􀉁 | SFPro-Medium 13, kern −0.2, center | SFPro-Medium 11, kern −0.17 | SFPro-Medium 9, kern −0.14 | Primary |
| Checkmark 􀆅 | SFPro-Bold 13, kern −0.2 | SFPro-Bold 11, kern −0.17 | SFPro-Bold 9, kern −0.14 | Primary |
| Modifier glyphs | SFPro-Medium 13, kern −0.2 | SFPro-Medium 11, kern −0.17 | SFPro-Medium 9, kern −0.14 | Tertiary |
| Key letter "A" | SFPro-Medium 13, kern −0.2 | SFPro-Medium 11, kern −0.17 | SFPro-Medium 10, lh10, kern −0.15 | Tertiary |
| Submenu chevron 􀆊 | SFPro-Bold 13, no kern | SFPro-Medium 11, kern −0.17 | SFPro-Medium 9, kern −0.14 | #4C4C4C, unbound |

No menu text layer names a shared text style, and only the Mini key letter stores a line height. Text frames are 15 high (Regular), 13 (Small) and 11 (Mini).

## Effects

Menu and submenu material, `Liquid Glass/{Dark,Light}/Menus` (values as listed in `materials.md`):

| Effect | Dark | Light |
|---|---|---|
| Fill | #5A5A5A@50% (blend luminosity) | #E6E6E6@55% (blend luminosity) |
| Shadow | x0 y4 blur24 spread0 #000000@30% | x0 y4 blur24 spread0 #000000@30% |
| Shadow (edge) | x0 y0 blur0 spread0.5 #000000@80% | x0 y0 blur0 spread0.5 #000000@20% |
| Inner shadows | x0 y−4 blur8 spread−4 #0D0D0D; x0 y4 blur8 spread−4 #0D0D0D; x0 y−0.5 blur0 #262626; x0 y0.5 blur0 #262626; x0 y0 blur0 spread1 #666666@40% (all blend plus-lighter) | same, except the last is #666666@15% |
| Glass | `blur glass radius20 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0` | `blur glass radius20 saturation0.8 brightness1 distortion0.3 depth0.9 chromatic0` |
| Corners | 12, smoothing 0.6 | 12, smoothing 0.6 |

Row effects: the Hover `BG` has no blend or effect; the Open `BG` and the separator line use the vibrant fill with plus-darker inside and plus-lighter (Dark) or plus-darker (Light) on the layer. Labels use plus-lighter (Dark) or plus-darker (Light).

## Kit notes

- The page has no documentation boards; its free text is the page labels "Menus" with "Dark" or "Light" (SFPro-Bold 60).
- The examples show the kit's intended composition: a menu with glass material, separators between groups, a header, keyboard shortcuts at the right, and a submenu that opens beside its parent item, lined up with it.
- A menu that can show checkmarks uses the "Menu with Selection" rows throughout, so all labels share the column after the checkmark.
- The 27.0.1 entry in `specs/change-log.txt` mentions menus, but the dump cuts the line off after "For menus with se…", so its content isn't available.

## Finding it in the spec

| Family | grep pattern on `specs/menus.txt` |
|---|---|
| Menu containers and material | `grep -n -e 'group "Menu"' -e 'group "Submenu"'` |
| Items with selection | `grep -n '^COMPONENT .*Menu with Selection/Items/'` |
| Items without selection | `grep -n '^COMPONENT .*Menu without Selection/Items/'` |
| Submenu items | `grep -n '^COMPONENT .*Items - Submenu/'` |
| Hover / open highlight | `grep -n 'rect "BG"'` |
| Separators and headers | `grep -n -A1 -e '/Separator"' -e '/Header"'` |
| Shortcut parts | `grep -n -A6 '􀻃/Keyboard Shortcut"'` |
| Symbol and checkmark | `grep -n -A1 -e '􀻃/Symbol' -e '􀻃/Checkmark'` |
