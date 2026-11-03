# Sidebars — iOS 27

**Read when:** you need an exact iOS 27 value for sidebars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Sidebars in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/sidebars.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀏚 U+1003DA. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

54 components: 52 sidebar parts and 2 iPad example screens. Every part exists in Light and Dark except the two disclosure glyphs.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Trailing item | `Sidebar/􀻃/<App>/Items/Trailing/<Kind>` | Toggle, Symbol, Info, Submenu, Checkmark, Detail only | 12 |
| Leading item | `Sidebar/􀻃/<App>/Items/Leading/<Kind>` | Symbols, Titles, Delete Button, Composed | 8 |
| Row state | `Sidebar/􀻃/<App>/States/<State>` | Default, Selected, Disabled | 6 |
| Row (indent level) | `Sidebar/<App>/Items/Level <N>` | Level 0, Level 1, Level 2 | 6 |
| Section header | `Sidebar/<App>/Header/Header` | — | 2 |
| Search field | `Sidebar/􀻃/<App>/Search/<State>` | Value, Placeholder | 4 |
| Navigation bar button | `Sidebar/􀻃/<App>/Navigation Bar/<Kind>` | Button Text, Button Symbol | 4 |
| Disclosure glyph | `Sidebar/􀻃/Submenu/<State>` | Open, Closed | 2 |
| Sidebar background | `Sidebar/􀻃/<App>/BG/<State>` | Active, Inactive | 4 |
| Toolbar | `Sidebar/<App>/Toolbar/<Kind>` | Fullscreen, Floating Window | 4 |
| Example screen | `Examples/Sidebar/<App>` | Light, Dark | 2 |

`<App>` = Light or Dark.

## Anatomy

### How a row is built

`Level N` → `States/<State>` → `Items/Leading/Composed` + `Items/Trailing/<Kind>`. `Composed` holds `Delete Button`, `Symbols` and `Titles`. The example rows show the nesting in use (see Example screens).

### Trailing items

| Kind | Size | Layout | Parts (size @ position) |
|---|---|---|---|
| Toggle | 64 × 44 | `stack h gap0` | `Toggle` instance → `Lists/􀻃/Light/Rows/Accessories - Trailing/Toggle` with one `isVisible→0`. Light: 64 × 44 @0,0. Dark: 64 × 52 @0,-4, plus swap → `Toggles/Dark/On/1 - Idle` |
| Symbol | 83 × 44 | `stack h gap8 pad0,0,0,0` | `Detail` 44 × 22 @0,11; `Symbol` 31 × 44 @52,0 glyph 􀓔 U+1004D4 |
| Info | 83 × 44 | `stack h gap8 pad0,-2,0,-2` | `Detail` 44 × 22 @0,11; `Info` 31 × 44 @52,0 — Light glyph 􀅳 U+100173, Dark glyph 􀅴 U+100174 |
| Submenu | 74 × 44 | `stack h gap6 pad0,6,0,0` | `Detail` 44 × 22 @0,11; `Chevron` 18 × 18 @50,13 → `Sidebar/􀻃/Submenu/Closed` |
| Checkmark | 82 × 44 | `stack h gap8 pad0,-2,0,-2` | `Detail` 44 × 22 @0,11; `Checkmark` 30 × 44 @52,0 glyph 􀆅 U+100185 |
| Detail only | 52 × 44 | `stack h gap0 pad0,8,0,0` | `Detail` 44 × 22 @0,11 |

Derived: Detail text 44 + gap 8 = 52 (glyph x); Submenu 44 + 6 = 50, 50 + 18 + 6 = 74; Detail only 44 + 8 = 52. Detail text top 11 = (44 − 22) / 2.

### Leading items

| Kind | Size | Layout | Parts (size @ position) |
|---|---|---|---|
| Symbols | 34 × 36 | — | `Symbol` 34 × 36 @0,0, glyph 􀓔 U+1004D4 |
| Titles | 47 × 36 | `stack v gap0` | `Title` 33 × 22 @0,0; `Subtitle` 47 × 14 @0,22 |
| Delete Button | 29 × 36 | — | `Background` oval 19 × 19 @5,9; `Delete Symbol` shape 21 × 21 @4,8 |
| Composed | 124 × 44 | `stack h gap4 pad0,0,0,6` | `Delete` 29 × 36 @6,4 → Delete Button; `Stack` 85 × 44 @39,0 (`stack h gap4`) with `SF Symbol` 34 × 36 @0,4 → Symbols and `Title + Subtitle` 47 × 36 @38,4 → Titles |

Derived: 6 + 29 + 4 = 39 (Stack x); 34 + 4 = 38 (Titles x); items sit 4 from the top ((44 − 36) / 2).

### Row states

| State | Size (Light / Dark) | Layout | Children |
|---|---|---|---|
| Default | 260 × 44 / 260 × 52 | `stack h gap8 pad4,4,4,4` | `Leading` 192 × 44 → Composed, two `isVisible→0`; `Trailing Detail` 52 × 44 → Detail only. Light at y 0, Dark at y 4 |
| Selected | 260 × 44 / 260 × 44 | `stack h gap8 pad0,4,0,4`, `corners 22` | same children at y 0 |
| Disabled | 260 × 44 / 260 × 52 | `stack h gap8 pad4,4,4,4` | same children (Light y 0, Dark y 4), each at `opacity 50.05%` |

`Leading` at x 4, `Trailing Detail` at x 204 in every state. Derived: 4 + 192 + 8 = 204; 204 + 52 + 4 = 260. Which two layers the `isVisible→0` overrides hide in `Composed` is not in the dump.

### Indent levels

| Level | Size | Leading padding (stored) | State instance |
|---|---|---|---|
| Level 0 | 260 × 44 | 10 (`pad0,0,0,10`) | 250 × 44 @10,0 → `States/Default` |
| Level 1 | 260 × 44 | 30 | 230 × 44 @30,0 |
| Level 2 | 260 × 44 | 50 | 210 × 44 @50,0 |

Derived: each level adds 20 of indent. Light and Dark are identical.

### Section header (`Sidebar/<App>/Header/Header`)

| Part | Size @ position | Notes |
|---|---|---|
| Root | 260 × 54 | Light `stack h gap8 pad21,12,11,12`; Dark `stack h gap8 pad0,12,11,12` |
| `Title` | 158 × 22 @12,21 | Light text "Section", Dark text "Heading" |
| `Stack` | 70 × 22 @178,21 | `stack h gap8` |
| `Detail` | 44 × 22 @0,0 | Light align right, Dark align left |
| `Disclosure` | 18 × 18 @52,2 | → `Sidebar/􀻃/Submenu/Open` |

Derived: inset 12 left and right (178 + 70 = 248 = 260 − 12); title bottom 21 + 22 = 43, 11 above the bottom.

### Search field (`Sidebar/􀻃/<App>/Search/<State>`)

| Part | Size @ position | Notes |
|---|---|---|
| Root | 180 × 64 | `pad0,0,20,0` (bottom 20); stack direction h, except Dark Placeholder `stack v` |
| `Stack` (field) | 180 × 44 @0,0 | `corners max`, `stack h gap8 pad0,11,0,11` |
| `􀊫` U+1002AB | 26 × 22 @11,11 | leading glyph |
| `Search` (Placeholder) | 98 × 22 @45,11 | placeholder text |
| `Stack` (Value) | 98 × 22 @45,11 | `Search` text 55 × 22 @0,0 + `Cursor` 4 × 22 @55,0 → `Text Fields/􀻃/Cursor` |
| `􀊱` U+1002B1 | 18 × 22 @151,11 | trailing glyph |

Derived: 11 + 26 + 8 = 45; 45 + 98 + 8 = 151; 151 + 18 + 11 = 180.

### Navigation bar buttons

| Kind | Size | Child |
|---|---|---|
| Button Text | 32 × 22 | `Text` 31 × 22 @0.5,0, "Edit" |
| Button Symbol | 28 × 22 | `Symbol` 36 × 30 @-4,-4, glyph 􀀀 U+100000 |

### Disclosure glyphs (`Sidebar/􀻃/Submenu/Open`, `/Closed`)

| State | Size | Glyph |
|---|---|---|
| Open | 18 × 18 | 􀆈 U+100188 |
| Closed | 18 × 18 | 􀆊 U+10018A |

### Toolbar (`Sidebar/<App>/Toolbar/<Kind>`)

| Part | Fullscreen | Floating Window |
|---|---|---|
| Root | 320 × 54, `stack h gap78 pad0,0,10,0` | 320 × 54; Dark `stack h gap68 pad0,0,10,5`, Light `stack h gap68 pad0,0,10,0` |
| `Leading` | 55 × 44 @0,0, holding `Button` 55 × 44 → `Toolbars/<App>/Buttons/44pt/Active/Text` ("Edit") | Dark 114 × 44 @5,0 (`pad0,0,0,6`), Light 119 × 44 @0,0 (`pad0,0,0,11`); holds `Window Controls` 41 × 22 → `Windows/<App>/Window Controls/Active` and an inner `Leading` 55 × 44 with the Edit button |
| `Trailing` | 100 × 44 @220,0, `stack h gap12`: 44 × 44 @0,0 → `Toolbars/<App>/Buttons/44pt/Active/Symbol 1` glyph 􀟈 U+1007C8; 44 × 44 @56,0 → same master, glyph 􀏚 U+1003DA | same |

Derived for Floating Window: window controls at absolute x 11, y 11 and the Edit button at absolute x 64 in both appearances (Dark 5 + 6 and 5 + 59; Light 0 + 11 and 0 + 64). The second trailing button is named `Button 2` in Dark and `Sidebar Disclosure` in Light.

### Sidebar background (`Sidebar/􀻃/<App>/BG/<State>`)

One `Rectangle` 100 × 100 @0,0 per component; stretched to 320 × 834 in the examples.

### Example screens (`Examples/Sidebar/<App>`, iPad 1210 × 834)

| Part | Size @ position (absolute) | Notes |
|---|---|---|
| `Status Bar` | 1210 × 32 @0,0 | → `Status Bars/iPad/<App> Background/Full Screen/Menu Collapsed` |
| `Sidebar` | 320 × 834 @0,0 | `stack v gap0 pad32,10,10,10` |
| `BG` | 320 × 834 @0,0 | → `Sidebar/􀻃/<App>/BG/Active` |
| `Toolbar` | 300 × 54 @10,32 | → `Sidebar/<App>/Toolbar/Fullscreen` |
| `Search` | 300 × 64 @10,86 | → `Sidebar/􀻃/<App>/Search/Placeholder` |
| Rows (`Source List Item`) | 300 × 44 each, from y 150, 44 apart | → `Sidebar/<App>/Items/Level 0` or `Level 1` |
| `Source List Header` | 300 × 54 @10,326 | → `Sidebar/<App>/Header/Header`, text "iCloud" |
| `Column 1` | 350 × 834 @320,0 | border 0.5 inside, separator colour; `stack v gap0 pad32,20,0,20`; `Navigation Bar` 350 × 54 @0,32 → `Toolbars/<App>/iPad/Top/Default Title - 2 Lines Left` ("All Inboxes", "67 Messages, 12 Unread", glyph 􀜓 U+100713) |
| `Column 2` | 540 × 834 @670,0 | `Navigation Bar` 540 × 54 @0,32 → `Toolbars/<App>/iPad/Top/Default Title` ("2342 Messages, 5 unread"); body text 500 × 792 @20 |
| `Scroll Edge Effect - Toolbar` | 540 × 86 (Column 2), 350 × 86 (Dark Column 1 only) | → `Scroll Edge Effect/<App>/Top - Hard` |
| `Window Resize` | 32 × 32 @1178,802 | → `Windows/<App>/Resize - Floating` |

Example row list, top to bottom (row label, level, glyph override):

| y | Row | Level | Glyph |
|---|---|---|---|
| 150 | All Inboxes | 0 | 􀈩 U+100229 |
| 194 | iCloud | 0 | 􀈣 U+100223 |
| 238 | Apple | 0 | 􀈣 U+100223 |
| 282 | VIP | 0 | 􀋂 U+1002C2 |
| 326 | header "iCloud" | — | — |
| 380 | Inbox | 0 | 􀈣 U+100223 |
| 424 | Flagged | 0 | 􀋉 U+1002C9 |
| 468 | Sent | 0 | 􀈟 U+10021F |
| 512 | Scuba Trips (swap → `States/Selected`, trailing → `Items/Trailing/Submenu` with `Submenu/Open`, detail "19") | 0 | 􀈕 U+100215 |
| 556 | Philippines | 1 | 􀈕 U+100215 |
| 600 | Palau | 1 | 􀈕 U+100215 |
| 644 | BVI | 1 | 􀈕 U+100215 |

Detail counts ("2", "4", "13", …) are text overrides; several rows hide the detail with `isVisible→0`, and the two appearances hide it on different rows.

## Sizes

| Item | Width × height | Corner radius | Insets / padding | Gap |
|---|---|---|---|---|
| Sidebar (example) | 320 × 834 | 0 | 32 top, 10 right/bottom/left | 0 |
| Row master | 260 × 44 (placed at 300 × 44) | Selected: 22 | state 4 left/right; level indent 10 / 30 / 50 | 8 (leading ↔ trailing) |
| Section header | 260 × 54 | — | 12 left/right, 11 bottom, title top 21 | 8 |
| Search field | 180 × 44 inside 180 × 64 | max | 11 left/right; 20 below the field | 8 |
| Leading Composed | 124 × 44 | — | 6 left | 4 |
| Leading symbol box | 34 × 36 | — | — | — |
| Titles | 47 × 36 (title 22 + subtitle 14) | — | — | 0 |
| Delete Button | 29 × 36 (circle 19, symbol 21) | — | — | — |
| Trailing glyph box | 31 × 44 (Checkmark 30 × 44) | — | — | 8 (6 for Submenu) |
| Disclosure glyph | 18 × 18 | — | — | — |
| Toolbar | 320 × 54 (placed at 300 × 54) | — | 10 bottom | Fullscreen 78, Floating 68 (stored) |
| Toolbar buttons | 44 × 44 symbol; 55 × 44 text | — | — | 12 |

## Colours and states

### Text and glyphs

| Part | Light | Dark |
|---|---|---|
| Row title | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Row subtitle | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Leading symbol | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Trailing detail | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Trailing Symbol / Checkmark glyph | #000000 (no swatch) | #FFFFFF (no swatch) |
| Trailing Info glyph | #000000 (no swatch) | #FFFFFF {Labels/Dark/1 Primary} |
| Submenu chevron (instance fill override) | #3C3C43@30% {Labels/Light/3 Tertiary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Disclosure glyph masters | #FF0000 (both; placeholder red, no swatch) | — |
| Header title | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Header detail | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Search placeholder and glyphs | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Search value | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Search cursor (override) | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Navigation bar buttons | #000000 {Label Colors/1 Label Light} | #FFFFFF {Labels/Dark/1 Primary} |
| Delete Button | circle #FFFFFF; symbol #FF3B30 {systemRed - Light} | same (Light swatch) |

The header's `Disclosure` instance has no colour override, so it keeps the master's #FF0000.

### Row states

| State | Fill | Opacity |
|---|---|---|
| Default | #FFFFFF (stored root fill) | — |
| Selected | #767680@12% {Fills/Light/3 Tertiary} (both appearances), corners 22 | — |
| Disabled | #FFFFFF (stored root fill) | children at 50.05% |

Most masters on the page (items, states, levels, header, toolbars) store a root fill #FFFFFF; the Selected fill is the only row fill that differs. The dump does not say whether these root fills draw in instances.

### Search field fill

| Light | Dark |
|---|---|
| #EDEDED {Fills/Light - Vibrant/3 Tertiary}, `blend plus-darker` | #121212 {Fills/Dark - Vibrant/3 Tertiary}, `blend plus-lighter` |

### Sidebar backgrounds

| Component | Fill |
|---|---|
| Light / Active | #C2DAF2@65% (blend luminosity) |
| Light / Inactive | #DAE6F2@50% (blend luminosity) |
| Dark / Active | #1F2A34@69% (blend luminosity) |
| Dark / Inactive | #2C3034@30% (blend luminosity) |

None of the four is bound to a swatch.

### Example screens

| Part | Light | Dark |
|---|---|---|
| Screen fill | #FFFFFF {Backgrounds/Light/Primary} | #1C1C1E {Backgrounds/Dark - Elevated/Primary} |
| `Sidebar` group fill | none | #202A34@69% (blend luminosity), plus the BG instance |
| `Column 1` border | 0.5 inside #C6C6C8 {Separators/Light/Opaque} | 0.5 inside #38383A {Separators/Dark/Opaque} |
| Body text | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Scroll edge colour override | none | #1C1C1E {Backgrounds/Dark - Elevated/Primary} |

## Text

| Part | Font | Size | Line height | Tracking | Align | Text style |
|---|---|---|---|---|---|---|
| Row title | SFPro-Regular | 17 | 22 | Not in the kit | left | none |
| Row subtitle | SFPro-Regular | 13 | 14 | Not in the kit | left | none |
| Leading symbol 􀓔 | SFPro-Regular | 17 | 22 | Not in the kit | center | none |
| Trailing detail | SFPro-Regular | 17 | 22 | Not in the kit | right (header detail: Light right, Dark left) | none |
| Trailing glyphs (Symbol, Info, Checkmark) | SFPro-Regular | 17 | 22 | Not in the kit | center | Light: `06 Body/1 Default`; Dark: none |
| Disclosure glyphs 􀆈 / 􀆊 | SFPro-Bold | 13 | 18 | Not in the kit | center | none |
| Header title | SFPro-Medium | 17 | 22 | Not in the kit | left | none |
| Search text and glyphs | SFPro-Medium | 17 | 22 | Not in the kit | left (text), center (glyphs) | none |
| Navigation bar "Edit" / 􀀀 | SFPro-Medium | 17 | 22 | Not in the kit | center | none |
| Example body text | SFPro-Regular | 17 | 22 | Not in the kit | left | `06 Body/1 Default` |

## Effects

| Effect | Where | Value |
|---|---|---|
| Luminosity blend | Sidebar BG components and the Dark example sidebar group | fills above, `blend luminosity` |
| Plus-darker / plus-lighter | Search field fill | Light plus-darker, Dark plus-lighter |
| Layer opacity | Disabled row children | 50.05% |

No shadows, blurs or glass are stored on the sidebar parts; the toolbar buttons, window controls, scroll edge effect and navigation bars carry theirs from their own masters (`references/toolbars.md`, `references/system.md`).

## Kit notes

The header description is cut off in the dump; only its opening survives ("A sidebar appears on the leading side of…"). The examples show a three-column iPad layout with mailbox-like rows: a 320-pt sidebar, a 350-pt list column and a 540-pt content column, with the sidebar's toolbar and search field at the top and indented child rows under a selected, expanded parent. Not in the kit: iPhone sidebars, row heights other than 44, the sidebar width range, the Inactive background in use, and pressed or hover states.

## Finding it in the spec

| Family | grep |
|---|---|
| All components | `grep -n '^COMPONENT "Sidebar/' specs/sidebars.txt` |
| Trailing items | `grep -n -A3 'Items/Trailing/' specs/sidebars.txt` |
| Leading items | `grep -n -A5 'Items/Leading/' specs/sidebars.txt` |
| Row states | `grep -n -A3 '/States/' specs/sidebars.txt` |
| Levels | `grep -n -A1 'Items/Level' specs/sidebars.txt` |
| Header | `grep -n -A5 'Header/Header"' specs/sidebars.txt` |
| Search | `grep -n -A8 '/Search/' specs/sidebars.txt` |
| Toolbars | `grep -n -A9 '/Toolbar/' specs/sidebars.txt` |
| Backgrounds | `grep -n -A1 '/BG/' specs/sidebars.txt` |
| Examples | `grep -n -A40 '^COMPONENT "Examples/Sidebar/' specs/sidebars.txt` |
