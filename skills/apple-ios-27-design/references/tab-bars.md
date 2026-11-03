# Tab Bars — iOS 27

**Read when:** you need an exact iOS 27 value for tab Bars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Tab Bars in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/tab-bars.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

84 components. Names that start `Tab Bars/􀻃/` (U+100EC3) are the kit's building blocks; the full bars and the examples are made from them. The page has no documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| iPhone tab bar | `Tab Bars/<Appearance>/iPhone/<Variant>` | Appearance: Light, Dark · Variant: Default, Prominent Tab | 4 |
| iPhone search-tab states | `Tab Bars/<Appearance>/iPhone/Search Selected - <State>` | State: Placeholder, Value, Typing | 6 |
| iPad tab bar | `Tab Bars/<Appearance>/iPad (Regular)/iPad` | Light, Dark | 2 |
| iPhone tab groups (horizontal) | `Tab Bars/􀻃/<Appearance>/iPhone/Horizontal/<Type>/<N> Tabs` | Type: Tabs - Search, Tabs - No Search · N: 2, 3, 4, 5 | 16 |
| iPhone tab items | `Tab Bars/􀻃/<Appearance>/iPhone/<Item>` | Item: Tab - Search, Tab - Default/Default, Tab - Default/Selected | 6 |
| iPad tab items | `Tab Bars/􀻃/<Appearance>/iPad/<Item>/<State>` | Item: Tab - Symbol, Tab - Label · State: Unselected, Selected | 8 |
| iPhone Duo tab items | Light: `Tab Bars/􀻃/Light/iPhone Duo/Vertical/<Item>/<State>`; Dark: `Tab Bars/􀻃/Dark/iPhone Duo/<Item>/<State>` | Item: Tab - Search, Tab - Default · State: Default, Selected | 8 |
| iPhone Duo tab groups (vertical) | `Tab Bars/􀻃/<Appearance>/iPhone Duo/Vertical/<Type>/<N> Tabs` | Type: Tabs - Search, Tabs - No Search · N: 2, 3, 4, 5 | 16 |
| Examples | `Examples/Tab Bar/<Appearance>/iPad`, `Examples/iPhone/Tab Bar/<Appearance>/<Screen>`, `Examples/Tab Bar/<Appearance>/iPhone Duo/<Orientation>/<Display>` | iPhone screens: Tabs (Light) / iPhone (Dark), Tabs with Search, Search Selected, Search + Keyboard · Orientation: Portrait, Landscape · Display: Outer, Inner | 18 |

"N Tabs" in a `Tabs - Search` group counts the search tab: `Tabs - Search/5 Tabs` holds four tabs plus the search tab (derived from the instances it contains).

## Anatomy

### iPhone tab bar (402 × 99)

| Layer | Size @position | Content |
|---|---|---|
| root | 402 × 99 | `stack h gap0 pad16,21,21,21`; fill is the kit's own swatch `x. Kit/Symbol BG <Appearance>` + #FFFFFF (#CCCCCC@60% Light, #333333@60% Dark), not a UI colour |
| `use "Tabs"` | 360 × 62 @21,16 | Default → `Tab Bars/􀻃/<Appearance>/iPhone/Horizontal/Tabs - No Search/5 Tabs`; Prominent Tab → `…/Tabs - Search/5 Tabs` |

Derived: 21 + 360 + 21 = 402 wide; 16 + 62 + 21 = 99 tall. The tab group master is 346 × 62; the bar stretches it to 360.

### iPhone tab groups (346 × 62)

`Tabs - No Search/<N> Tabs`: one glass capsule.

| Layer | Content |
|---|---|
| root | 346 × 62, no fill |
| `group "Stack"` | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max smoothing0.6 style1`, `stack h gap0`; padding Dark `pad4,8,4,8`, Light `pad0,8,0,8` |
| `use "Tab 1"` | → `Tab Bars/􀻃/<Appearance>/iPhone/Tab - Default/Selected`, @8,4 |
| `use "Tab 2"` … `"Tab N"` | → `…/Tab - Default/Default`, @x,4 |

`Tabs - Search/<N> Tabs`: two glass shapes, the tabs on the left and a round search button on the right.

| Layer | Dark | Light |
|---|---|---|
| tabs `group "Stack"` | @4,0, `style="Liquid Glass/Dark/Regular - Small"`, `stack h gap0 pad4,8,4,8` | @0,0, `style="Liquid Glass/Light/Regular - Small"`, `stack h gap0 pad4,8,4,8` |
| search `group "Stack"` | 62 × 62 @284,0, `style="Liquid Glass/Dark/Regular - Small"`, `stack v gap0` | 62 × 62 @284,0, no shared style: the glass effects are set inline (see Effects) |
| `use "Search Symbol"` | 54 × 54 @4,4 → `Tab Bars/􀻃/Dark/iPhone/Tab - Search` | 62 × 62 @0,0 → `Tab Bars/􀻃/Light/iPhone/Tab - Search` |

### iPhone tab items

| Component | Size | Layers |
|---|---|---|
| `Tab - Default/Default` | 72 × 54 | `text "Symbol"` 54 × 28 @9,7 "􀟉" (U+1007C9); `text "Label"` 54 × 12 @9,36 "Label" |
| `Tab - Default/Selected` | 200 × 54 | `rect "Selection"` 208 × 54 @-4,0 (the pill); `shape "Combined Shape"` 26.03 × 38.47 @87.6,7.64 (Light) / @87.6,8 (Dark): the selected glyph and label as one flattened shape. No text layers are in the dump. |
| `Tab - Search` | 54 × 54 | `text "Search"` 54 × 54 @0,0 "􀊫" (U+1002AB), centred |

Derived: in `Tab - Default/Default` the symbol and label are both 54 wide at x 9, so 9 pt each side of the 72 pt item; the label sits 36 − (7 + 28) = 1 pt below the symbol layer. The selection pill is 8 pt wider than the item and starts 4 pt to its left.

Glyphs the instances set on Tabs 2–5 (text overrides): 􀀁 U+100001 (Tab 2), 􀛤 U+1006E4 (Tab 3), 􀟇 U+1007C7 (Tab 4), 􀂓 U+100093 (Tab 5).

### iPhone search-tab states

| Component | Size | Root | Children |
|---|---|---|---|
| `Search Selected - Placeholder` | 402 × 76 | `stack h gap12 pad0,28,28,28`, fill `x. Kit/Symbol BG` + #FFFFFF | `use "Button"` 48 × 48 @28,0 → `Toolbars/<Appearance>/Buttons/48pt/Active/Symbol 1` [text="􀟉"]; `use "Search Field"` 286 × 48 @88,0 → `Toolbars/􀻃/<Appearance>/Search - Bottom/Search - Placeholder` |
| `Search Selected - Value` | 402 × 76 | same | same button; `use "Search Field"` → `Toolbars/􀻃/<Appearance>/Search - Bottom/Search - Value` [isVisible→0] |
| `Search Selected - Typing` | 402 × 394 | `stack v gap14 pad0,0,0,0`, same kit fill | `group "Stack"` 402 × 48 @0,0 (`stack h gap8 pad0,8,0,8`); `use "Keyboard"` 402 × 332 @0,62 → Dark `Keyboard/Dark/iPhone/Alpha`, Light `Keyboard/Light/iPhone` [swap→`…/Key Pad/Letters Lower Case`] |

Derived: Placeholder/Value width 28 + 48 + 12 + 286 + 28 = 402; height 0 + 48 + 28 = 76. Typing height 48 + 14 + 332 = 394.

Inside the Typing state's 402 × 48 row:

| Layer | Size @position | Content |
|---|---|---|
| `group "Search Field"` | 330 × 48 @8,0 | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max`, `stack h gap4 pad0,11,0,11` |
| `text "􀊫"` | 26 × 22 @11,13 | U+1002AB, secondary label colour |
| `group "Text and Cursor"` | 256 × 22 @41,13 | `text "Search"` 55 × 22 @0,0; `use "Cursor"` 4 × 22 @55,0 → `Text Fields/􀻃/Cursor` [fill → System Blue] |
| `text "􀊱"` | 18 × 22 @301,13 | U+1002B1, secondary label colour |
| clear button group (`"Stack"` Dark, `"Button"` Light) | 48 × 48 @346,0 | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max`; `use "Clear"` 40 × 40 @4,4 → `Toolbars/􀻃/<Appearance>/Search - Clear Symbol/Clear` |

Derived: 8 + 330 + 8 + 48 + 8 = 402.

### iPad tab bar (510 × 44)

| Layer | Size @position | Content |
|---|---|---|
| root | 510 × 44 | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max smoothing0.6 style0`, `stack h gap0 pad4,4,4,4` |
| `use "Sidebar Disclosure"` | 52 × 36 @4,4 | → `Tab Bars/􀻃/<Appearance>/iPad/Tab - Symbol/Unselected` (glyph 􀏚 U+1003DA) |
| `group "Stack"` | 398 × 36 @56,4 | `stack h gap0`: `Tab 1` 71 × 36 @0,0 → `…/Tab - Label/Selected`; `Tab 2`–`Tab 6` → `…/Tab - Label/Unselected`, widths 65, 65, 66, 65, 66 |
| `use "Search"` | 52 × 36 @454,4 | → `…/Tab - Symbol/Unselected` [text="􀊫"] |

Derived: 4 + 52 + 398 + 52 + 4 = 510; 71 + 65 + 65 + 66 + 65 + 66 = 398.

The unselected tab instances are 36 tall @y0 in Light but 20 tall @y8 in Dark (as stored).

### iPad tab items

| Component | Size | Root | Child |
|---|---|---|---|
| `Tab - Label/Unselected` | 65 × 36 | `stack h gap0 pad0,11,0,11`, fill `x. Kit/Nested Symbol BG` + #5856D6 (kit swatch) | `text "Label"` 43 × 20 @11,8 |
| `Tab - Label/Selected` | 74 × 36 | selection fill, `corners 100 smoothing0.6 style1`, `stack h gap0 pad8,15,8,15` | `shape "Combined Shape"` 74 × 36 @-0.28,0.2 (flattened label) |
| `Tab - Symbol/Unselected` | 52 × 36 | kit swatch fill, no auto layout | `text "􀏚"` 24 × 20 @14,8 |
| `Tab - Symbol/Selected` | 52 × 36 | selection fill, `corners 100 smoothing0.6 style1`; Dark also `stack h gap0 pad8,14,8,14` | `shape "Combined Shape"` 11 × 10 @9,7 (Light) / @8.79,6.98 (Dark) |

Derived: label item 11 + 43 + 11 = 65; symbol item 14 + 24 + 14 = 52 and 8 + 20 + 8 = 36.

### iPhone Duo tab items (48 × 48)

| Component | Layers |
|---|---|
| `Tab - Default/Default` | `text "Symbol"` 48 × 48 @0,0 (Light @0,-0.33) "􀟉" |
| `Tab - Default/Selected` | `rect "Selection"` 44 × 58 @2,-5; `shape "Combined Shape"` 26.03 × 26.03 @11,10.67 (Light) / @11.13,5.67 (Dark) |
| `Tab - Search/Default` | `text "Search"` 48 × 48 @0,0 "􀊫" |
| `Tab - Search/Selected` | `rect "Selection"` 44 × 44 @2,2; `shape "Combined Shape"` 26.03 × 26.03 @22.2,21.3 (Light) / @22.34,16.3 (Dark) |

Roots are filled with the kit swatch `x. Kit/Nested Symbol BG` (#4CA6FF@60% Light, #0059B2@60% Dark).

### iPhone Duo tab groups (vertical, 48 wide)

| Type | Root | Children |
|---|---|---|
| `Tabs - No Search/<N> Tabs` | `style="Liquid Glass/<Appearance>/Regular - Small"`, `corners max`, `stack v gap2 pad6,0,6,0` | `Tab 1` (Selected) @0,6, then `Tab 2`… (Default), each 48 × 48, every 50 pt |
| `Tabs - Search/<N> Tabs` | kit swatch fill, `stack v gap8 pad0,0,0,0` | tabs `group "Stack"` (glass, `stack v gap2 pad6,0,6,0`, tab instances 48 × 54, every 56 pt) on top; search `group "Stack"` 48 × 48 (glass) below, holding `use "Search Symbol"` (Dark 54 × 54 @-3,-3, Light 62 × 62 @-7,-7) |

Heights:

| N | No Search | Search: tabs stack | Search: total |
|---|---|---|---|
| 5 | 260 | 234 | 290 |
| 4 | 210 | 178 | 234 |
| 3 | 160 | 122 | 178 |
| 2 | 110 | 66 | 122 |

Derived: No Search height = 6 + N × 48 + (N − 1) × 2 + 6 (5 tabs: 6 + 240 + 8 + 6 = 260). Search tabs stack = 6 + (N − 1) × 54 + (N − 2) × 2 + 6 (5: 6 + 216 + 6 + 6 = 234); total = tabs stack + 8 + 48.

### Examples

| Example | Size | Bar placement |
|---|---|---|
| `Examples/Tab Bar/<App>/iPad` | 1210 × 834 (fill #FFFFFF / #000000) | `use "Tab Bar - Floating/Light"` (Dark: `"…/Over Dim"`) 507.4 × 44 @351.3,29 (Dark @351.3,28); `Status Bar` 1210 × 32 @0,0; `Window Resize` 32 × 32 @1178,802 |
| `Examples/iPhone/Tab Bar/<App>/Tabs` (Dark: `/iPhone`), `/Tabs with Search` | 402 × 874 | `use "Tab Bar"` 402 × 99 @0,775 |
| `…/Search Selected` | 402 × 874 | 402 × 80 @0,794 → `Search Selected - Placeholder` [text="Search Placeholder String"] |
| `…/Search + Keyboard` | 402 × 874 | Light 402 × 394 @0,480; Dark 402 × 423 @0,451 → `Search Selected - Typing` |
| iPhone Duo `Portrait/Outer` | 466 × 678 | `group "Vertical Bar"` 84 × 678 @382,0 (`stack v gap8 pad24,24,24,12`); vertical `Tabs - Search/5 Tabs` 48 × 290 @12,364 |
| iPhone Duo `Landscape/Outer` | 678 × 466 | `Vertical Bar` 84 × 466 @594,0; tab bar 48 × 290 at the top of `group "Bottom"` |
| iPhone Duo `Portrait/Inner` | 669 × 951 | `group "Tab Bar"` 409 × 99 @130,852 (`stack h gap0 pad16,21,21,21`), `Tabs` 367 × 62 → horizontal `Tabs - Search/5 Tabs` |
| iPhone Duo `Landscape/Inner` | 951 × 669 | `Vertical Bar` 84 × 669 @867,0; vertical tab bar 48 × 290 @12,355 |

Derived: on iPhone the bar ends at the screen's bottom edge (775 + 99 = 874); the iPad bar is centred ((1210 − 507.4) / 2 = 351.3); the iPhone Duo inner portrait bar is centred ((669 − 409) / 2 = 130) and ends at the bottom (852 + 99 = 951); the vertical bars sit at the right edge (382 + 84 = 466, 867 + 84 = 951).

## Sizes

### iPhone tab groups

| Group | Glass group size @position | Tab width each | Tab height |
|---|---|---|---|
| No Search / 5 | 346 × 62 @0,0 | 66 | 54 |
| No Search / 4 | 346 × 62 @0,0 | 82.5 | 54 |
| No Search / 3 | 276 × 62 @35,0 | 86.67 | 54 |
| No Search / 2 | 202 × 62 @72,0 | 93 | 54 |
| Search / 5 (4 tabs), Dark | 268 × 62 @4,0 | 63 | 54 |
| Search / 4 (3 tabs), Dark | 268 × 62 @4,0 | 84 | 54 |
| Search / 3 (2 tabs), Dark | 194 × 62 @4,0 | 89 | 54 |
| Search / 2 (1 tab), Dark | 110 × 62 @4,0 | 94 | 54 |
| Search / 5 (4 tabs), Light | 276 × 62 @0,0 | 65 | 54 |
| Search / 4 (3 tabs), Light | 276 × 62 @0,0 | 86.67 | 54 |
| Search / 3 (2 tabs), Light | 202 × 62 @0,0 | 93 | 54 |
| Search / 2 (1 tab), Light | 118 × 62 @0,0 | 102 | 54 |
| Search button | 62 × 62 @284,0 | — | — |

Derived: glass group width = 8 + tabs + 8 (5 × 66 + 16 = 346; 4 × 63 + 16 = 268). With fewer tabs the No Search group is centred in the 346 frame ((346 − 276) / 2 = 35, (346 − 202) / 2 = 72). The gap between the tabs group and the search button is 12 in Dark (284 − (4 + 268)) and 8 in Light (284 − 276).

| Part | Size | Corner |
|---|---|---|
| iPhone tab bar | 402 × 99 | — (root has no corners) |
| Tab group capsule | 62 tall | max |
| Tab item | 54 tall | — |
| Selection pill (iPhone) | 54 tall, item width + 8 | Light `max smoothing0.6 style0`; Dark `27 smoothing0.6 style1` |
| Search button | 62 × 62 | max |
| iPad bar | 510 × 44, padding 4 | max |
| iPad tab item | 36 tall | selected: 100 |
| iPhone Duo item | 48 × 48 | selection pill: Light `max`, Dark `27` |
| iPhone Duo selection pill | 44 × 58 @2,-5 (tab), 44 × 44 @2,2 (search) | as above |
| Search field (Typing) | 330 × 48, padding 0,11,0,11, gap 4 | max |
| Clear button (Typing) | 48 × 48 | max |

## Colours and states

### iPhone tab items

| Part | Light | Dark |
|---|---|---|
| Unselected symbol and label | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, `blend plus-darker` | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, `blend plus-lighter` |
| Search glyph | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, `blend plus-darker` | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, `blend plus-lighter` |
| Selection pill | #787880@16% {Fills/Light/2 Secondary} | #787880@32% {Fills/Dark/2 Secondary} |
| Selected glyph + label shape | #FFFFFF@50% + #0088FF {System Colors/Light/8 Blue} (blend plus-darker) | #000000@50% + #0091FF {System Colors/Dark/8 Blue} (blend plus-lighter) |
| Bar glass | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Dark/Regular - Small` |

The Light `Tabs - No Search/5 Tabs` group also sets `color:fill-1→#FF383C {System Colors/Light/1 Red}` on each of its five tab instances. The layer it targets is not in the dump (hidden layers are left out), and no other group sets it.

### iPad tab items

| Part | Light | Dark |
|---|---|---|
| Unselected label / symbol | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, `blend plus-darker` | #8A8A8A {Labels - Liquid Glass/Dark/2 Secondary}, `blend plus-lighter` |
| Selected pill | #787880@16% {Fills/Light/2 Secondary} | #787880@32% {Fills/Dark/2 Secondary} (blend plus-lighter) |
| Selected label / symbol shape | #FFFFFF@50% + #0088FF {System Colors/Light/8 Blue} (blend plus-darker) | #000000@50% + #0088FF {System Colors/Light/8 Blue} (blend plus-lighter) |
| Bar glass | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Dark/Regular - Small` |

Dark iPad unselected items use the Secondary Liquid Glass label, where Light and the iPhone items use Primary. Dark iPad selected items use the Light blue swatch (#0088FF); Dark iPhone items use the Dark blue (#0091FF).

### iPhone Duo items

| Part | Light | Dark |
|---|---|---|
| Unselected symbol / search glyph | #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, `blend plus-darker` | #EDEDED {Labels - Liquid Glass/Dark/1 Primary}, `blend plus-lighter` |
| Selection pill | #787880@16% {Fills/Light/2 Secondary} | #000000@70% (no swatch) |
| Selected shape | #FFFFFF@50% + #0088FF {System Colors/Light/8 Blue} (blend plus-darker) | #000000@50% + #0091FF {System Colors/Dark/8 Blue} (blend plus-lighter) |

### Search field (Typing state)

| Part | Light | Dark |
|---|---|---|
| Field and clear button | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Dark/Regular - Small` |
| Typed text "Search" | #000000 {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| 􀊫 and 􀊱 glyphs | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Cursor fill override | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |

Pressed, disabled or badge states: Not in the kit. The only states are unselected and selected.

## Text

| Part | Font | Size | Line height | Tracking | Align |
|---|---|---|---|---|---|
| iPhone tab label | SFPro-Semibold | 10 | Not in the kit | -0.1 | centre |
| iPhone tab symbol | SFPro-Semibold | 18 | 22 | — | centre |
| iPhone and iPhone Duo search glyph | SFPro-Semibold | 17 | 22 | — | centre |
| iPhone Duo tab symbol | SFPro-Semibold | 18 | 22 | — | centre |
| iPad tab label | SFPro-Medium | 17 | 20 | — | centre |
| iPad tab symbol | SFPro-Medium | 17 | 20 | — | centre |
| Search field text and glyphs | SFPro-Medium | 17 | 22 | — | text left, glyphs centre |

No layer binds a shared text style. iPhone Duo items have no label. The kit's placeholder text: "Label" (iPhone master), "Tab 1"–"Tab 6" (instance overrides), "Search", "Search Placeholder String" (example override).

## Effects

Bars and groups use the shared glass styles in `materials.md`; the inline values match the tokens (checked by script on 46 styled lines). The iPad bar and the Dark Typing search field store `corners max smoothing0.6 style0` instead of `style1`.

| Style | Fill stack (bottom first) | Glass blur |
|---|---|---|
| Liquid Glass/Light/Regular - Small | #F8F8F8@20% (luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (plus-lighter) | radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0 |
| Liquid Glass/Dark/Regular - Small | #000000 (screen) + #999999@17% | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 |

Light search button group (unstyled, 8 layers: the four Light horizontal `Tabs - Search` groups and the four Light iPhone Duo vertical ones). Its effects, as stored:

- fill #000000@25% + #FFFFFF@25% + #444444@60% (blend plus-lighter) + #F8F8F8@20% (blend luminosity)
- inner-shadows: x±20 y0 blur20 spread-30 #D9D9D9 (plus-darker); x0 y±4 blur0.5 spread-4 #666666 (plus-lighter); x0 y±1 blur0 spread0 #171717 (plus-lighter); x0 y40 blur30 spread-40 #E6E6E6 (plus-darker); x0 y±40 blur10 spread-40 #282828 (plus-lighter)
- shadows: x0 y8 blur15 spread0 #000000@2%; x0 y0 blur0 spread0.5 #D9D9D9 (plus-darker); x±1.25 y0 blur0 spread-0.75 #CCCCCC (plus-darker)
- blur glass radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0
- corners max smoothing0.6 style1

Compared with `Liquid Glass/Light/Regular - Small`, the fill order differs and the three outer edge shadows are #D9D9D9 / #CCCCCC instead of #DBDBDB.

Blend modes on content: unselected labels and glyphs use `plus-darker` in Light and `plus-lighter` in Dark; the selected shape uses the same pair, over a 50% white (Light) or 50% black (Dark) base fill.

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Tab Bars" and a description the dump cuts off after "A tab bar lets people navigate between t…". The full text is Not in the dump.

What the examples show (summarised from their layout): on iPhone the tab bar is a floating glass group inset 21 pt from the sides, sitting at the bottom of the screen; "Prominent Tab" splits search into its own round glass button; selecting search turns the bar into a search field next to a 48 pt button, and typing raises it above the keyboard with a clear button. On iPad the tab bar is a 44 pt glass capsule, centred horizontally at y 29 (the status bar layer above it is 32 tall, so they overlap by 3 pt as stored). On iPhone Duo the outer display and landscape layouts use a vertical tab bar at the right edge; the inner portrait display uses the horizontal bar.

## Finding it in the spec

| Family / part | grep |
|---|---|
| Full iPhone bars | `grep -nE '^COMPONENT "Tab Bars/(Light\|Dark)/iPhone/(Default\|Prominent Tab)"' specs/tab-bars.txt` |
| Search states | `grep -n '^COMPONENT "Tab Bars/[A-Za-z]*/iPhone/Search Selected' specs/tab-bars.txt` |
| iPad bar | `grep -n '^COMPONENT "Tab Bars/[A-Za-z]*/iPad (Regular)' specs/tab-bars.txt` |
| iPhone tab groups | `grep -n '^COMPONENT "Tab Bars/􀻃/[A-Za-z]*/iPhone/Horizontal/' specs/tab-bars.txt` |
| iPhone tab items | `grep -n '^COMPONENT "Tab Bars/􀻃/[A-Za-z]*/iPhone/Tab - ' specs/tab-bars.txt` |
| iPad tab items | `grep -n '^COMPONENT "Tab Bars/􀻃/[A-Za-z]*/iPad/' specs/tab-bars.txt` |
| iPhone Duo items and groups | `grep -n '^COMPONENT "Tab Bars/􀻃/[A-Za-z]*/iPhone Duo/' specs/tab-bars.txt` |
| Examples | `grep -n '^COMPONENT "Examples/' specs/tab-bars.txt` |
| Selection pills | `grep -n 'rect "Selection"' specs/tab-bars.txt` |
| Selected (flattened) shapes | `grep -n 'shape "Combined Shape"' specs/tab-bars.txt` |
| Unstyled Light search glass | `grep -n 'fill #000000@25% + #FFFFFF@25% + #444444@60%' specs/tab-bars.txt` |
