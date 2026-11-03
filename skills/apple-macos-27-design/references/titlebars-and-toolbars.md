# Titlebars and Toolbars — macOS 27

**Read when:** you need an exact macOS 27 value for titlebars and Toolbars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Titlebars and Toolbars in Apple's macOS 27 kit: components, anatomy.

Source: `specs/titlebars-and-toolbars.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

396 components. `<A>` is the appearance (`Light`, `Dark`); `<State>` is the window state (`Active`, `Inactive`). `􀻃` (U+100EC3) is the path segment the kit puts in front of building-block components.

| Family | Path | Axes and values | Count |
|---|---|---|---|
| Toolbar buttons | `Titlebars and Toolbars/<A>/<Size>/Buttons/<State>/<n>` | Size `XL`, `Medium` · n `1`–`6` (buttons in the group) | 48 |
| Toolbar segmented controls | `…/<A>/<Size>/Segmented Control/<State>/<n> Items/<k> Selected` | n `2`–`6` · k `1`–n | 160 |
| Toolbar search fields | `…/<A>/<Size>/Search/<State>/<Field state>` | `Placeholder`, `Focused`, `Typing`, `Value`, `Placeholder + Disabled`, `Value + Disabled` | 48 |
| Toolbar pop-up buttons | `…/<A>/<Size>/Pop-up/<State>/<Button state>` | `Idle`, `Clicked`, `Disabled` | 24 |
| Toolbar pull-down buttons | `…/<A>/<Size>/Pulldown/<State>/<Button state>` | `Idle`, `Clicked`, `Disabled` | 24 |
| Button-group buttons | `…/􀻃/<A>/Button Group Buttons/<State>/<Size>/<Item state>` | `1 - Default`, `2 - Selected`, `4 - Disabled` | 24 |
| Segment buttons | `…/􀻃/<A>/Segmented Control Buttons/<State>/<Size>/<Item state>` | same three | 24 |
| Separators | `…/􀻃/<A>/Separator - <State>` | | 4 |
| Clear Search glyph | `…/􀻃/<A>/Clear Search` | | 2 |
| Window titles | `…/<A>/Window/Title (no sidebar)/<State>`, `…/Title (with sidebar)/<State>` | | 8 |
| Window controls | `Titlebars/<A>/Window Controls/Standard/<State>` | | 4 |
| Utility panel bars | `…/<A>/Panel/Toolbar with Tabs/<State>`, `…/<A>/Panel/Titlebar/<State>` | the Light Active titlebar is stored as `…/Light/PanelPanel/Titlebar/Active` | 8 |
| Utility panel tab bar | `…/􀻃/<A>/Utility Panel/Tab Bar`, `…/Tab Bar/Button/Selected`, `…/Button/Unselected` | | 6 |
| Utility panel titles | `…/􀻃/<A>/Titles/Utility Panel/Title + Symbol`, `…/Title Only` | | 4 |
| Utility panel window controls | Light: `…/􀻃/Light/Utility Panel/Stoplights/<S>`; Dark: `Titlebars/Dark/Window Controls/Panel/<S>` | S `Active`, `Active - Minimize Enabled`, `Inactive`, `Inactive - Minimize Enabled` | 8 |

The toolbar families exist for every combination of appearance × size × state (checked: each Light name has a Dark twin and each Active name an Inactive twin, with the same size). Which windows use which size, from `specs/windows.txt`: `XL` in Unified and Expanded toolbars, `Medium` in Unified Compact toolbars.

The page has no documentation boards; its only free text layers are the page title ("Titlebars and Toolbars") and the "Light" / "Dark" headings. The titlebar and toolbar bars themselves (height, background) are drawn on the Windows page; see `windows.md`.

## Anatomy

### Window controls (`Titlebars/<A>/Window Controls/Standard/<State>`, 68 × 14)

`stack h gap9 pad0,8,0,0`.

| Layer | Kind | Size | Position |
|---|---|---|---|
| `Close` | oval | 14 × 14 | @0,0 |
| `Minimize` | oval | 14 × 14 | @23,0 |
| `Expand` | oval | 14 × 14 | @46,0 |

Derived: 14 + 9 + 14 + 9 + 14 = 60, plus 8 trailing padding = 68. No glyph layers (×, −, arrows) are in the dump.

### Utility panel window controls (44 × 10)

`stack h gap7 pad0,0,0,0`: `Close` 10×10 @0,0 · `Minimize` 10×10 @17,0 · `Expand` 10×10 @34,0. Derived: 10 + 7 + 10 + 7 + 10 = 44.

### Window title (`…/Window/Title (no sidebar)/<State>` 112 × 30, `…/Title (with sidebar)/<State>` 113 × 30)

`stack h gap3`.

| Layer | Kind | No sidebar | With sidebar |
|---|---|---|---|
| `Symbol` | text "􀈕" U+100215 | 17×15 @0,0 | 17×15 @0,0 |
| `Stack` (`stack v gap2`) | group | 92×30 @20,0 | 93×30 @20,0 (96×30 in Dark Active) |
| ↳ `Window Title` | text "Window Title" | 85×15 @0,0 | 93×15 @0,0 (96×15 in Dark Active) |
| ↳ `Subtitle` (`stack h gap2`) | group | 92×13 @0,17 | same |
| ↳↳ `Subtitle` | text "Subtitle" | 42×13 @0,0 | same |
| ↳↳ `— Edited` | text "— Edited" | 48×13 @44,0 | same |

Dark `Title (with sidebar)/Active` is 116 × 30; the other three with-sidebar masters are 113 × 30.

### Toolbar buttons (`…/<Size>/Buttons/<State>/<n>`)

A glass capsule holding n `Button Group Buttons` instances, all `1 - Default` (checked across all 48).

| Size | Container auto layout | Inner button | Inner positions |
|---|---|---|---|
| XL | `stack h gap9 pad4,4,4,4` (n = 1: `stack v gap4` Active, `stack h gap4` Inactive) | 28 × 28 | x 4, 41, 78, 115, 152, 189; y 4 |
| Medium | `stack h gap4 pad2,2,2,2` | 20 × 20 | x 2, 26, 50, 74, 98, 122; y 2 |

Inner button (`…/􀻃/<A>/Button Group Buttons/<State>/<Size>/<Item state>`):

| Size | Frame | Glyph layer `Symbol` |
|---|---|---|
| XL | 28 × 28, `stack h gap0` | text 28×15 @0,6.5 "􀓞" U+1004DE |
| Medium | 20 × 20 | text 20×20 @0,-0.5 "􀓞" |

### Toolbar segmented controls (`…/<Size>/Segmented Control/<State>/<n> Items/<k> Selected`)

A glass capsule holding n `Segmented Control Buttons` instances with a `Separator` instance between each pair.

| Size | Container auto layout | Segment | Separator instance |
|---|---|---|---|
| XL | `stack h gap0 pad4,4,4,4` | 32 × 28 at y 4 | 2 × 22 at y 7 |
| Medium | `stack h gap0 pad2,2,2,2` | 24 × 20 at y 2 | 2 × 16 at y 4 |

Segment (`…/􀻃/<A>/Segmented Control Buttons/<State>/<Size>/<Item state>`):

| Size | Frame | Glyph layer `Symbol` |
|---|---|---|
| XL | 32 × 28, `stack h gap0 pad6.5,6,6.5,6` | text 20×15 @6,6.5 "􀓞" |
| Medium | 24 × 20, `stack v gap0 pad4,4,4,4` | text 16×12 @4,4 "􀓞" |

Separator master (`…/􀻃/<A>/Separator - <State>`, 2 × 16, `stack v gap0 pad0,1,0,1`): one group `Separator` 0.1×16 @1,0.

Separator visibility: the separators on either side of the selected segment are set to `opacity 0%`; the others are visible. This holds in 154 of the 160 segmented controls; the exceptions are listed under Kit notes.

### Toolbar search field (`…/<Size>/Search/<State>/<Field state>`)

| Layer | XL (159 × 36, `stack h gap6 pad0,10,0,10`) | Medium (149 × 24, `stack h gap4 pad0,6,0,6`) |
|---|---|---|
| glyph text "􀊫" U+1002AB | 16×36 @10,0 | 16×24 @6,0 |
| placeholder text "Search" | 117×36 @32,0 | 117×24 @26,0 |
| value text "Search term" (`Value`, `Value + Disabled`) | 99×36 @32,0 | 101×24 @26,0 |
| `Clear` → `…/􀻃/<A>/Clear Search` (Typing, Value, Value + Disabled) | 12×15 @137,10.5 | 12×15 @131,4.5 |
| caret `Rectangle` (Active `Focused`) | 2×18 @32,9 | 2×18 @26,3 |
| `Stack` (Active `Typing`) | 99×18 @32,9: text 76×15 @0,1.5 + caret 2×18 @76,0 | 101×18 @26,3: text 76×15 @0,1.5 + caret @76,0 (Dark: text "Search" 44×15, caret @44,0) |
| text (Inactive `Typing`) | 99×15 @32,10.5, no caret | 101×15 @26,4.5, no caret |

Inactive `Focused` shows only the glyph (no caret, no text). `Clear Search` (12 × 15) holds one text layer "􀁡" U+100061, 16×15 @-2,0.

### Toolbar pop-up and pull-down buttons

| Component | Size | Auto layout | Layers |
|---|---|---|---|
| XL Pop-up | 62 × 36 | `stack h gap2 pad0,8,0,8` | `Label` 34×15 @8,10.5 "Label" · chevron text 10×15 @44,10.5 "􀆏" U+10018F |
| Medium Pop-up | 62 × 24 | same | `Label` 34×15 @8,4.5 · chevron 10×15 @44,4.5 |
| XL Pulldown | 50 × 36 | same | glyph text 20×15 @8,10.5 "􀓔" U+1004D4 · chevron text 12×15 @30,10.5 "􀆈" U+100188 |
| Medium Pulldown | 43 × 24 | same | glyph 15×12 @8,6 · chevron 10×12 @25,6 |

### Utility panel bars

| Component | Size | Frame | Children |
|---|---|---|---|
| `…/Panel/Toolbar with Tabs/<State>` | 280 × 56 | `border 1 outside #3C3C43@12%` · `stack v gap4 pad7,7,5,7` | `Stack` 266×12 @7,7 (`stack h gap109 pad1,1,1,1`) with `Window Title` text 70×13 @99.15,-0.5 · `Tab Bar` 220×28 @30,23 → `…/􀻃/<A>/Utility Panel/Tab Bar` |
| `…/Panel/Titlebar/<State>` | 280 × 24 | same border · `stack h gap109 pad7,7,4,7` | `Window Title` text 70×13 @105,7 |

No window-control layer is visible in the panel bar masters. `Windows/Light/Utility Panel/Inactive` swaps a layer of its bar to `…/Utility Panel/Stoplights/Inactive`, so the masters hold one that the dump leaves out as hidden.

Tab bar (`…/􀻃/<A>/Utility Panel/Tab Bar`, 220 × 30, `stack h gap0 pad2,0,0,0`): `Button 1` → `…/Tab Bar/Button/Selected`, `Button 2`–`Button 5` → `…/Button/Unselected`, each 44×28 at x 0, 44, 88, 132, 176, y 2. The Light instances also override hidden text layers with "􀝥" U+100765, "􁀶" U+101036 and "􁚛" U+10169B.

Tab button: Light 44 × 30, Dark 44 × 28; `stack h gap0 pad1,2,1,2`; one image `NSColorPickerWheel@2x` 24×24 @10,3 (Light) or @10,2 (Dark). The Selected button adds the glass style (below).

Utility panel titles: `Title + Symbol` 87 × 16 (`stack h gap3 pad1,0,0,0`): text "􀈕" 14×15 @0,1 and `Window Title` 70×13 @17,1. `Title Only` 70 × 14 (`stack h gap0 pad1,0,0,0`): `Window Title` 70×13 @0,1.

## More on this component

Sizes, colours, text and effects: `titlebars-and-toolbars-values.md`.
