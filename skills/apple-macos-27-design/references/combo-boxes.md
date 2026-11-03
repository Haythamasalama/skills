# Combo Boxes — macOS 27

**Read when:** you need an exact macOS 27 value for combo Boxes (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Combo Boxes in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/combo-boxes.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, **Combo Boxes**, with 40 components (2 × 5 × 4).

Name path: `Combo Boxes/<Appearance>/<Size>/<State>`

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Size | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State | 1 - Idle, 3 - Field Clicked, 3 - Button Clicked, 4 - Disabled |

- The page has no Content Area / Over-glass axis.
- It has no hover state, no empty (placeholder) state, and no open-menu state.
- Every component is 120 pt wide.

## Anatomy

A combo box is a text field with a menu button laid over its trailing end. The component itself has no fill or auto layout.

| Layer | Kind | What it is |
|---|---|---|
| `Text Field` | `use` → `Text Fields/<Appearance>/<Size>/<field state>`, full component size @0,0 | The field (see `text-fields.md`). No overrides |
| `Menu Button` | group, flush with the right edge | The menu button area |
| `BG` | rect, inside `Menu Button` | The button's rounded fill, with a `01 - Bordered` style |
| `􀆈` | text, inside `Menu Button` | The chevron glyph "􀆈" (U+100188), centred |

Text-field state used by each combo-box state:

| Combo box state | Text Field instance | Menu button BG style |
|---|---|---|
| 1 - Idle | `…/Value` | `…/01 - Bordered/01 - Idle` |
| 3 - Field Clicked | `…/Value + Typing` (Focus Ring and I-beam) | `…/01 - Bordered/01 - Idle` |
| 3 - Button Clicked | `…/Value` | `…/01 - Bordered/03 - Clicked` |
| 4 - Disabled | `…/Value + Disabled` | `…/01 - Bordered/04 - Disabled` |

Derived from the nested field:

- The text field's `Value` text frame is not shortened for the button. At Rg it runs from x 6 to x 114 (6 + 108), past the Menu Button's left edge at x 92.
- The field's Focus Ring (Field Clicked) is the full 120 pt width, so it encloses the button too.

## Sizes

| Size | W × H | Field corners (from Text Fields) | Menu Button W × H @ | BG W × H @ | BG corners | Chevron frame @ | Chevron font |
|---|---|---|---|---|---|---|---|
| 5 XL | 120 × 36 | 9 | 36 × 36 @84,0 | 30 × 30 @3,3 | 6.5, smoothing 0.6 | 30 × 16 @3,9.75 | SFPro-Bold 13, lh 16 |
| 4 Lg | 120 × 28 | 7 | 28 × 28 @92,0 | 24 × 24 @2,2 | 5.5, smoothing 0.6 | 24 × 16 @2,6.5 | SFPro-Bold 12.5, lh 16 |
| 3 Rg | 120 × 24 | 6 | 28 × 24 @92,0 | 24 × 20 @2,2 | 4.5, smoothing 0.6 | 24 × 16 @2,3.75 | SFPro-Bold 10, lh 16 |
| 2 Sm | 120 × 20 | 5 | 24 × 20 @96,0 | 20 × 16 @2,2 | 3.5, smoothing 0.6 | 20 × 16 @2,1.5 | SFPro-Bold 10, lh 16 |
| 1 Mn | 120 × 16 | 4 | 20 × 16 @100,0 | 16 × 12 @2,2 | 2.5, smoothing 0.6 | 16 × 16 @2,0 | SFPro-Bold 9, lh 16 |

Geometry is identical in Light and Dark and across states within a size (checked on all 40 components).

Derived values:

- The Menu Button is flush with the field's trailing edge: x + width = 120 in every size (Rg: 92 + 28).
- BG inset inside the Menu Button = BG x: 3 (XL), 2 (other sizes) on every side.
- BG corner radius = field corner radius − BG inset + 0.5 in every size (Rg: 6 − 2 + 0.5 = 4.5; XL: 9 − 3 + 0.5 = 6.5).
- The chevron frame spans the BG width (Rg: 24 wide @2, like the BG).

## Colours and states

The `01 - Bordered` styles are in `control-styles-content-area.md` / `control-styles-over-glass.md`. Those shared styles have `corners max`; the combo box's BG overrides the radius with the numbers above. Text-field colours are in `text-fields.md`.

### Light

| State | BG style | BG fill | Chevron colour | Field |
|---|---|---|---|---|
| 1 - Idle | Content Area/Light/01 - Bordered/01 - Idle | #000000@8% | #000000@85% {Labels/Light/1 Primary} | Value (idle) |
| 3 - Field Clicked | Content Area/Light/01 - Bordered/01 - Idle | #000000@8% | #000000@85% | Value + Typing: Focus Ring #0088FF, I-beam |
| 3 - Button Clicked | Content Area/Light/01 - Bordered/03 - Clicked | #000000@16% | #000000@85% | Value (idle) |
| 4 - Disabled | Content Area/Light/01 - Bordered/04 - Disabled | #000000@4% | #000000@25% {Labels/Light/3 Tertiary} | Value + Disabled |

### Dark

| State | BG style | BG fill | Chevron colour | Field |
|---|---|---|---|---|
| 1 - Idle | Content Area/Dark/01 - Bordered/01 - Idle | #FFFFFF@7% | #FFFFFF {Labels/Dark/1 Primary} | Value (idle) |
| 3 - Field Clicked | Content Area/Dark/01 - Bordered/01 - Idle | #FFFFFF@7% | #FFFFFF | Value + Typing: Focus Ring #0091FF, I-beam |
| 3 - Button Clicked | Content Area/Dark/01 - Bordered/03 - Clicked | #FFFFFF@16% | #FFFFFF | Value (idle) |
| 4 - Disabled | Content Area/Dark/01 - Bordered/04 - Disabled | #FFFFFF@4% | #FFFFFF@25% {Labels/Dark/3 Tertiary} | Value + Disabled (field opacity 50%) |

Derived: in Dark Disabled the 50% opacity sits on the nested text field only. The Menu Button has no opacity of its own; it is dimmed by its 4% fill and Tertiary chevron alone.

## Text

| Part | Font | Size | Line height | Tracking | Alignment | Colour |
|---|---|---|---|---|---|---|
| Chevron "􀆈", XL | SFPro-Bold | 13 | 16 | Not in the kit | center | see tables |
| Chevron "􀆈", Lg | SFPro-Bold | 12.5 | 16 | Not in the kit | center | |
| Chevron "􀆈", Rg | SFPro-Bold | 10 | 16 | Not in the kit | center | |
| Chevron "􀆈", Sm | SFPro-Bold | 10 | 16 | Not in the kit | center | |
| Chevron "􀆈", Mn | SFPro-Bold | 9 | 16 | Not in the kit | center | |
| Field text | from `Text Fields`: SFPro-Medium 13 (XL–Rg), 11 (Sm), 10 (Mn) | | | | left | |

- No shared text style is linked. The chevron has no blend mode.

## Effects

- Combo-box layers have no shadows, blurs, glass or blend modes of their own.
- The effects come from the nested text field:
  - the Focus Ring in Field Clicked
  - the Light border's plus-darker blend
  - Dark Disabled's 50% opacity

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are the headings "Combo Box", "Light" and "Dark".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All combo boxes | `grep -n '^COMPONENT "Combo Boxes/' specs/combo-boxes.txt` |
| One size, all states, with layers | `grep -n -A4 '^COMPONENT "Combo Boxes/Light/3 Rg/' specs/combo-boxes.txt` |
| Which field state each uses | `grep -n 'use "Text Field"' specs/combo-boxes.txt` |
| Menu button fills | `grep -n 'rect "BG"' specs/combo-boxes.txt` |
| Chevron glyphs | `grep -n 'text "􀆈"' specs/combo-boxes.txt` |
