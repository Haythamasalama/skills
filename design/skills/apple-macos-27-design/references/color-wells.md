# Color Wells — macOS 27

**Read when:** you need an exact macOS 27 value for color Wells (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Color Wells in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/color-wells.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀎘 (U+100398).

## Components

34 components in two families. The page headings call them "Color Well" and "Color Picker"; the component names use `Color Pickers` and `Color Picker (Wheel)`.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Color well (swatch button) | `Color Pickers/<Appearance>/Content Area/Standard/<Size>/<State>` | Appearance: Light, Dark · Context: Content Area only · Style: Standard only · Size: 1 Min, 2 Sm, 3 Rg, 4 Lg, 5 XL · State: 1 - Idle, 3 - Selected, 4 - Disabled | 30 |
| Colour wheel button | `Color Picker (Wheel)/<Appearance>/<Variant>` | Appearance: Light, Dark · Variant: No Color, Selected Color | 4 |

The smallest size is named `1 Min` here, not `1 Mn` as on other pages. There is no Over-glass variant on this page.

## Anatomy

### Color well

| Layer | Kind | Notes |
|---|---|---|
| (component frame) | filled capsule, auto layout `stack h gap0 pad3,3,3,3` | the bezel; carries the state colour |
| `Swatch` | rect, corners max, marked as a clipping mask | the chosen colour, inset 3 on every side |

### Colour wheel button

| Variant | Layers |
|---|---|
| No Color | one `Oval` 28×28 @0,0 filled with the colour-wheel gradients |
| Selected Color | `Oval` 18×18 @5,5 filled with the chosen colour, then `Oval` 28×28 @0,0 with only a 3-pt inside border in the wheel gradient (a ring) |

## Sizes

### Color well

| Size | Well | Swatch | Padding | Corners (well and swatch) | Swatch border |
|---|---|---|---|---|---|
| 1 Min | 32×16 | 26×10 @3,3 | 3 all sides | max | 1 inside |
| 2 Sm | 40×20 | 34×14 @3,3 | 3 | max | 1 inside |
| 3 Rg | 48×24 | 42×18 @3,3 | 3 | max | 1 inside |
| 4 Lg | 56×28 | 50×22 @3,3 | 3 | max | 1 inside |
| 5 XL | 72×36 | 66×30 @3,3 | 3 | max | 1 inside |

Every well is twice as wide as it is tall (derived: 32/16 … 72/36). The heights match the 16, 20, 24, 28 and 36 control heights used on other pages. Swatch = well − 6 in each direction (derived from padding 3).

### Colour wheel button

| Variant | Size | Corners | Inner disc | Ring |
|---|---|---|---|---|
| No Color | 28×28 | 200 | — | — |
| Selected Color | 28×28 | 200 | 18×18 @5,5 | border 3 inside on the 28×28 oval |

Gap between the disc and the ring: 2 (derived: 5 − 3).

## Colours and states

### Color well

| Appearance | State | Well: style · fill | Swatch |
|---|---|---|---|
| Light | 1 - Idle | `Content Area/Light/01 - Bordered/01 - Idle` · #000000@8% | #34C759 {System Colors/Light/4 Green} · border 1 inside #000000@10% |
| Light | 3 - Selected | no shared style · #0088FF {System Colors/Light/8 Blue} + #000000@6% (blend plus-darker) | as idle |
| Light | 4 - Disabled | `Content Area/Light/01 - Bordered/04 - Disabled` · #000000@4% | as idle, layer opacity 50.25% |
| Dark | 1 - Idle | `Content Area/Dark/01 - Bordered/01 - Idle` · #FFFFFF@7% | #34C759 {System Colors/Light/4 Green} · border 1 inside #000000@10% |
| Dark | 3 - Selected | no shared style · #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@6% (blend plus-lighter) | as idle |
| Dark | 4 - Disabled | `Content Area/Dark/01 - Bordered/04 - Disabled` · #FFFFFF@4% | as idle, layer opacity 50.25% |

Every well in the kit shows the same swatch colour, #34C759. The kit has no Clicked (pressed) state for the well.

### Colour wheel button

| Appearance | Variant | Fills |
|---|---|---|
| Light and Dark | No Color | `gradient angular {0.5, 0.5}→{0.5, 1} [#FF0000 0%, #FB00FF 20.19%, #00A1FF 39.73%, #44FF00 60.02%, #FFF700 79.97%, #FF0000 100%]` + `gradient radial {0.5, 0.5}→{0.5, 1} [#FFFFFF 0.07%, #FFFFFF 7.54%, #FFFFFF@0% 96.8%, #FFFFFF@0% 100%]` (white centre fading out) |
| Light | Selected Color | disc #FFCC00 {System Colors/Light/3 Yellow}; ring border 3 inside with the same angular gradient |
| Dark | Selected Color | disc #FFD600 {System Colors/Dark/3 Yellow}; ring as Light |

Light and Dark No Color are identical.

## Text

Not in the kit: no component on this page contains text. The page text is headings only, SFPro-Bold 60 ("Color Well", "Color Picker", "Light", "Dark").

## Effects

| Where | Effect |
|---|---|
| Selected well | second fill blend plus-darker (Light) or plus-lighter (Dark) over the blue |
| Disabled swatch | opacity 50.25% |
| Swatch | border 1 inside #000000@10% in both appearances |
| Shadows, blurs, glass | none |

## Kit notes

The page has no documentation boards. Its only text is the headings Color Well, Color Picker, Light and Dark.

Kit inconsistencies:

- The Dark wells use the Light swatch `{System Colors/Light/4 Green}` (#34C759), not the Dark green.
- The size is named `1 Min`, not `1 Mn`.
- The `3 - Selected` well fills are not bound to a shared style; the other two states are.

## Finding it in the spec

| Family | grep |
|---|---|
| Color wells | `grep -n -A1 '^COMPONENT "Color Pickers/' specs/color-wells.txt` |
| One state | `grep -n -A1 '^COMPONENT "Color Pickers/.*/3 - Selected"' specs/color-wells.txt` |
| Wheel buttons | `grep -n -A2 '^COMPONENT "Color Picker (Wheel)/' specs/color-wells.txt` |
