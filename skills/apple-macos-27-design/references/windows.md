# Windows — macOS 27

**Read when:** you need an exact macOS 27 value for windows (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Windows in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/windows.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

60 components in three families. Each has an appearance axis (`Light`, `Dark`) and a state axis (`Active`, `Inactive`).

| Family | Other axes | Size | Components |
|---|---|---|---|
| `Windows/<A>/<Layout>/<State>` | Layout: 4 toolbar styles × 3 title/sidebar options (below) | 840 × 400 | 48 |
| `Windows/<A>/Utility Panel/<State>` | — | 280 × 400 | 4 |
| `Windows/<A>/Window BG (with Sidebar)/<State>` | two masters per name: one with a sidebar, one without | 600 × 300 | 8 |

Layouts (toolbar style, then title/sidebar option):

| Toolbar style | `… without Title` | `… + Title` | `… + Title + Sidebar` |
|---|---|---|---|
| `Default` | ✓ | ✓ | ✓ |
| `Unified Compact Toolbar` | ✓ | ✓ | ✓ |
| `Unified Toolbar` | ✓ | ✓ | ✓ |
| `Expanded Toolbar` | ✓ | ✓ | ✓ |

The bars are built from `Titlebars and Toolbars/…` components, documented in `titlebars-and-toolbars.md`. Expanded and Unified toolbars use the `XL` (36-tall) items; Unified Compact uses the `Medium` (24-tall) items (derived from the instances on this page).

The page has no documentation boards; its only free text layers are the page title ("Window") and the "Light" / "Dark" headings.

## Anatomy

### Window without a sidebar (840 × 400)

`stack v gap0 pad0,0,0,0`. Layers back to front:

| Layer | Kind | Notes |
|---|---|---|
| `Scroll View` | group, `stack h gap0` | below the bar; holds `Content` (rect) and, in Active windows, `Scrollbar` |
| `Scroll Edge Effect` | use → `Scroll Edge Effect/<A> - Top - Hard` | only in the `+ Title` layouts; covers the bar area |
| `Titlebar` / `Toolbar` / `Titlebar and Toolbar` | groups | the bar (see the layout table) |

### Window with a sidebar (840 × 400)

`stack h gap0 pad0,0,0,0`.

| Layer | Size | Position | Contents (back to front) |
|---|---|---|---|
| `Left Pane` (`stack v gap0`, corners 0) | 256 × 400 | @0,0 | `BG` rect 256×400 (sidebar style) · `Sidebar` use 256×1050 at y = bar height → `Sidebars/<A>/Examples/<State>/Small` · bar group with `Window Controls` and the sidebar toggle |
| `Right Pane` (`stack v gap0`) | 584 × 400 | @256,0 | fill = window background · `Scroll View` · `Scroll Edge Effect` 584 wide · bar group |

### Bars, layout by layout

Positions are inside the bar group. `WC` = `Window Controls` 68×14 → `Titlebars/<A>/Window Controls/Standard/<State>`. Item sizes: XL button 36×36, XL button group (4) 147×36, XL search 159×36, Medium button 24×24, Medium button group (4) 96×24, Medium search 149×24, Medium segmented control (2 items) 54×24, `Navigation` 73×36.

**Without a sidebar (bar is 840 wide)**

| Layout | Bar group(s) and auto layout | Contents |
|---|---|---|
| Default without Title | `Titlebar` 840×32, `stack h gap16 pad9,9,9,9` | WC @9,9 |
| Default + Title | `Titlebar` 840×33, same stack | WC @9,9.5 · `Title` 85×15 @93,9 → `…/Window/Title (no sidebar)/<State>` |
| Unified Compact without Title | `Titlebar and Toolbar` 840×40, `stack h gap12 pad8,8,8,13` | WC @13,13 · segmented 54×24 @93,8 · `Spacer` 368×24 @159,8 · button group 96×24 @539,8 · button 24×24 @647,8 · search 149×24 @683,8 |
| Unified Compact + Title | same as above | the `Spacer` is replaced by `Window Title` 368×15 @159,12.5 → `…/Window/Title (no sidebar)/<State>` |
| Unified without Title | `Titlebar and Toolbar` 840×52, `stack h gap8 pad8,8,8,18` | WC @18,19 · `Navigation` 73×36 @94,8 · `Spacer` 291×36 @175,8 · button group 147×36 @474,8 · button 36×36 @629,8 · search 159×36 @673,8 |
| Unified + Title | same as above | the `Spacer` is replaced by `Window Title` 291×30 @175,11 |
| Expanded without Title | `Titlebar` 840×32 (`stack h gap16 pad9,9,9,9`) + `Toolbar` 840×44 @0,32 (`stack h gap8 pad0,8,8,8`) | titlebar: WC @9,9 · toolbar: button 36×36 @8,0 · `Navigation` @52,0 · `Spacer` 333×36 @133,0 · button group @474,0 · button @629,0 · search @673,0 |
| Expanded + Title | `Titlebar` 840×33 + `Toolbar` 840×44 @0,33 | titlebar: WC @9,9.5 · `Title` 105×15 @93,9 · toolbar as above |

**With a sidebar (left pane 256 wide, right pane 584 wide)**

| Layout | Left pane bar | Right pane bar |
|---|---|---|
| Default + Title + Sidebar | `Titlebar` 256×52, `stack h gap16 pad0,8,0,18`: WC @18,19 · `Button` 36×36 @212,8 (XL button, glyph 􀰱 U+100C31) | `Titlebar` 584×52, `stack h gap16 pad8,8,8,8`: `Title` 568×15 @8,18.5 → `…/Window/Title (with sidebar)/<State>` |
| Unified Compact + Title + Sidebar | `Titlebar and Toolbar` 256×40, `stack h gap12 pad0,8,0,13`: WC @13,13 · `Sidebar Toggle` 24×24 @224,8 (Medium button, 􀰱) | 584×40, `stack h gap12 pad8,8,8,8`: segmented 54×24 @8,8 · `Window Title` 197×15 @74,12.5 · button group 96×24 @283,8 · button 24×24 @391,8 · search 149×24 @427,8 |
| Unified + Title + Sidebar | 256×52, `stack h gap8 pad0,8,0,18`: WC @18,19 · `Sidebar Toggle` 36×36 @212,8 (XL, 􀰱) | 584×52, `stack h gap8 pad8,8,8,8`: `Navigation` 73×36 @8,8 · `Window Title` 121×30 @89,11 · button group 147×36 @218,8 · button 36×36 @373,8 · search 159×36 @417,8 |
| Expanded Toolbar + Title + Sidebar | `Stack` 256×76 (`stack v pad0,-1,0,0`): `Titlebar` 256×32 (`pad9,9,9,9`) with WC @9,9 · `Toolbar` 256×44 @0,32 (`stack h gap8 pad0,8,8,8`) with `Button` 36×36 @212,0 (􀰱) | `Stack` 584×77: `Titlebar` 584×33 (`pad9,9,9,9`) with `Title` 566×15 @9,9 · `Toolbar` 584×44 @0,33: button @8,0 · `Navigation` @52,0 · `Spacer` 77×36 @133,0 · button group @218,0 · button @373,0 · search @417,0 |

Title instances carry `isVisible→0` overrides (the dump doesn't say which layer they hide); several also set the text to "Folder 2". The `Default + Title` title instance is 85×15, the size of the master's `Window Title` text layer.

### `Navigation` group (back/forward), XL toolbars only

| Layer | Size | Position | Notes |
|---|---|---|---|
| `Navigation` | 73 × 36 | — | style `Liquid Glass/<A>/Regular - Small` (Active) or `… - Small - Inactive` (Inactive), corners 100, `stack h gap0 pad4,4,4,4` |
| `Button 1` | 20 × 20 | @9.75,8 | → `Titlebars and Toolbars/􀻃/<A>/Segmented Control Buttons/<State>/XL/1 - Default`, text 􀆉 U+100189, corners 96 |
| `Separator` | 2 × 22 | @35.5,7 | → `…/Separator - Active` or `- Inactive`, corners 96 |
| `Button 2` | 20 × 20 | @43.25,8 | same master, text 􀆊 U+10018A, corners 96 |

Unified Compact windows use the Medium segmented control `…/Medium/Segmented Control/<State>/2 Items/1 Selected` instead, with its selected segment swapped to `1 - Default` and the texts 􀆉 / 􀆊.

### Scroll view

| State | Auto layout | Layers |
|---|---|---|
| Active | `stack h gap0 pad0,0,0,12` | `Scrollbar` 12×150 at the right edge (x 828, or 572 in a 584 pane) → `Scrollbars/<A>//Vertical` · `Content` rect 816 (or 560) wide @12,0 |
| Inactive | `stack h gap0 pad0,12,0,12` | `Content` only; no scrollbar |

### Utility Panel (280 × 400)

| Layer | Size | Position | Notes |
|---|---|---|---|
| (component) | 280 × 400 | — | style `Panels/<A>`; the Light Active panel also binds its fill to `{Window Backgrounds/Light Background}` |
| `Titlebar and Toolbar` | 280 × 56 | @0,0 | → `Titlebars and Toolbars/<A>/Panel/Toolbar with Tabs/<State>` |

The Light Inactive panel overrides that instance with `swap→Titlebars and Toolbars/􀻃/Light/Utility Panel/Stoplights/Inactive` and `style→Liquid Glass/Light/Regular - Small - Inactive`.

### Window BG (with Sidebar) (600 × 300)

| Master | Style | Children |
|---|---|---|
| with sidebar | `Windows/<A>/With Sidebar/<State>`, `stack h gap0` | `Left Pane` 256×300 @0,0 (sidebar style, `stack v gap0 pad8,8,8,8`) · `Right Pane` 344×300 @256,0 (fill = window background, `stack v gap0`) |
| without sidebar (same name) | `Windows/<A>/No Sidebar/<State>`, `stack h gap0` | none |

## Sizes

### Bar heights

| Toolbar style | Without sidebar | With sidebar (left / right) | Window controls position | Content starts at |
|---|---|---|---|---|
| Default without Title | 32 | — | @9,9 | y 32 |
| Default + Title | 33 | 52 / 52 | @9,9.5 (no sidebar); @18,19 (sidebar) | y 33; y 52 |
| Unified Compact | 40 | 40 / 40 | @13,13 | y 40 |
| Unified | 52 | 52 / 52 | @18,19 | y 52 |
| Expanded without Title | 32 + 44 = 76 | — | @9,9 | y 76 |
| Expanded + Title | 33 + 44 = 77 | 76 / 77 | @9,9.5; @9,9 (sidebar) | y 77; sidebar y 76 |

Derived: the window controls are centred vertically in single-row bars ((32 − 14) / 2 = 9; (40 − 14) / 2 = 13; (52 − 14) / 2 = 19).

### Spacing in the bars

| Toolbar style | Leading inset to WC | Gap between items | Item y | Trailing inset | Derived checks |
|---|---|---|---|---|---|
| Unified Compact | 13 | 12 | 8 | 8 | 13 + 68 + 12 = 93; 683 + 149 + 8 = 840 |
| Unified | 18 | 8 | 8 | 8 | 18 + 68 + 8 = 94; 673 + 159 + 8 = 840 |
| Expanded (toolbar row) | 8 | 8 | 0 (8 below) | 8 | 8 + 36 + 8 = 52; 673 + 159 + 8 = 840 |
| Default / Expanded titlebar row | 9 | 16 (WC → title) | — | 9 | 9 + 68 + 16 = 93 (title x) |

`Window Controls` is 68 wide including its own 8-pt trailing padding (see the titlebars page), so the visible gap from the green button to the next item is 8 more than the stack gap (derived).

### Panes and corners

| Property | Value |
|---|---|
| Window size | 840 × 400 (sample) |
| Sidebar pane width | 256 |
| Content pane width | 584 |
| Content inset | 12 from the leading edge (scroll view padding) |
| Scrollbar | 12 × 150 (Active only) |
| Window corner radius | 16 (from the `Windows/…` styles) |
| Utility Panel corner radius | 15 (from `Panels/…`) |
| Utility Panel bar height | 56 |
| Minimum window size, toolbar overflow, full-screen layout | Not in the kit |

## Colours and states

### Window surface (shared styles)

| Appearance | Window | State | Style | Fill | Border |
|---|---|---|---|---|---|
| Light | no sidebar | Active / Inactive | `Windows/Light/No Sidebar/<State>` | #FFFFFF {Window Backgrounds/Light Background} | — |
| Light | with sidebar | Active / Inactive | `Windows/Light/With Sidebar/<State>` | #FFFFFF (blend multiply) | — |
| Dark | no sidebar | Active | `Windows/Dark/No Sidebar/Active` | #1E1E1E {Window Backgrounds/Dark Background} | 1 inside #FFFFFF@20% |
| Dark | no sidebar | Inactive | `Windows/Dark/No Sidebar/Inactive` | #1E1E1E | — |
| Dark | with sidebar | Active / Inactive | `Windows/Dark/With Sidebar/<State>` | #000000 (blend screen) | — |

In sidebar windows the `Right Pane` fill is #FFFFFF (Light) or #1E1E1E (Dark); in `Window BG (with Sidebar)` it is bound to the Window Backgrounds swatch.

### Sidebar pane (`BG` / `Left Pane`)

| Appearance | State | Style | Fill | Blur |
|---|---|---|---|---|
| Light | Active | `Sidebar/Background/Light/Active` | #FAFAFA@80% | background radius100 saturation1 |
| Light | Inactive | `Sidebar/Background/Light/Inactive` | #F4F4F4 | background radius100 saturation1 |
| Dark | Active | `Sidebar/Background/Dark/Active` | #0C0C0C@85% | background radius80 saturation2 |
| Dark | Inactive | `Sidebar/Background/Dark/Inactive` | #2E2E2E@85% | background radius70 saturation1.8 |

### Bar background (`Scroll Edge Effect`, from `specs/kit.txt`)

The bars have no fill of their own. In `+ Title` layouts a `Scroll Edge Effect/<A> - Top - Hard` sits under the bar, sized to it (840×34, 840×40, 840×52, 840×78; 584×40, 584×52, 584×77). `without Title` layouts have none.

| Appearance | `Color` rect | `Blur` rect |
|---|---|---|
| Light | #FFFFFF {Window Backgrounds/Light Background}, opacity 85% | border 0.67 inside #000000@5% · blur background radius6 saturation1 |
| Dark | #1E1E1E {Window Backgrounds/Dark Background}, opacity 55% | border 0.67 inside #FFFFFF@10% · blur background radius6 saturation1 |

Dark Active `+ Title` windows without a sidebar also set `color:fill-0→#1E1E1E` on the instance.

### Active versus Inactive

| Part | Active | Inactive |
|---|---|---|
| Window shadow | see Effects | lighter shadow (see Effects) |
| Toolbar items | `…/Active/…` masters, glass `Regular - Small` | `…/Inactive/…` masters, `Regular - Small - Inactive` |
| Window controls | `…/Standard/Active` (coloured) | `…/Standard/Inactive` (grey) |
| Title | `…/Title (…)/Active` | `…/Title (…)/Inactive` |
| Sidebar | `Sidebars/<A>/Examples/Active/Small` | `…/Inactive/Small` (Dark); Light Inactive windows still use `…/Active/Small` |
| Scrollbar | shown | not shown |

## Text

The window page has no text layers of its own; titles come from `Titlebars and Toolbars/<A>/Window/Title (…)` (SFPro-Bold 13 / lh15 without a sidebar, SFPro-Bold 15 / lh15 with one). See `titlebars-and-toolbars.md`.

## Effects

Window shadows (from the shared styles):

| Style | Shadows | Corners |
|---|---|---|
| `Windows/Light/No Sidebar/Active`, `Windows/Light/With Sidebar/Active`, `Windows/Dark/With Sidebar/Active` | shadow x0 y36 blur100 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% | 16 |
| `Windows/Dark/No Sidebar/Active` | shadow x0 y16 blur33 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% (+ border 1 inside #FFFFFF@20%) | 16 |
| all four `…/Inactive` window styles | shadow x0 y16 blur32 spread0 #000000@20% · shadow x0 y0 blur1 spread0 #000000@80% | 16 |
| `Panels/Light` (Active and Inactive) | shadow x0 y5 blur20 spread0 #000000@30% | 15 |
| `Panels/Dark` (Active and Inactive) | shadow x0 y16 blur33 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% · border 1 inside #FFFFFF@20%; fill #1E1E1E | 15 |

Blend modes: sidebar windows draw the window fill with `multiply` (Light) or `screen` (Dark); the sidebar pane uses a background blur (radius 70–100, above). Toolbar item glass is listed on the titlebars page.

## Finding it in the spec

| Family | grep |
|---|---|
| All windows | `grep -n '^COMPONENT "Windows/' specs/windows.txt` |
| One toolbar style | `grep -n '^COMPONENT "Windows/.*/Unified Toolbar' specs/windows.txt` |
| Sidebar layouts | `grep -n '^COMPONENT "Windows/.*+ Sidebar/' specs/windows.txt` |
| Utility panels | `grep -n '^COMPONENT "Windows/.*/Utility Panel/' specs/windows.txt` |
| Bars inside windows | `grep -n 'group "\(Titlebar\|Toolbar\|Titlebar and Toolbar\)"' specs/windows.txt` |
| Scroll edge effects | `grep -n 'Scroll Edge Effect' specs/windows.txt` |
| Scroll edge effect values | `grep -n -A2 'COMPONENT "Scroll Edge Effect' specs/kit.txt` |
