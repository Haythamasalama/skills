# Steppers — macOS 27

**Read when:** you need an exact macOS 27 value for steppers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Steppers in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/steppers.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􂻥 (U+102EE5). The nested-part folder in the component names is the glyph 􀻃 (U+100EC3).

## Components

200 components in three layers of nesting.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Stepper with layout | `Steppers/<Appearance>/<Context>/<Layout>/<Size>` | Appearance: Light, Dark · Context: Content Area, Over-glass · Layout: Inside Field, Outside Field, No Field · Size: 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL | 60 |
| Stepper (two buttons) | `Steppers/<Appearance>/􀻃/<Context>/<Size>` | Appearance × Context × Size | 20 |
| Stepper button | `Steppers/<Appearance>/􀻃/<Context>/<Size>/<Button>/<State>` | Button: Button - Up, Button - Down · State: 1 - Idle, 3 - Clicked, 4 - Disabled | 120 |

## Anatomy

### Stepper with layout

| Layout | Layers (in dump order) | Notes |
|---|---|---|
| Inside Field | `Text Field` instance → `Text Fields/<Appearance>/<Size>/Value` (full width) · `Mask` rect (full size, corners per size, clipping mask) · `Stepper` instance at x 64 | the stepper sits over the right end of the field, inside the mask |
| Outside Field | `Text Field` instance 60 wide → `Text Fields/<Appearance>/<Size>/Value` · group `Frame` at x 64 with corners per size, holding `Stepper` | field and stepper are side by side |
| No Field | `Stepper` instance only; the component frame carries the corners | stepper alone |

`Text Fields/…/Value` is defined on the Text Fields page (`specs/text-fields.txt`), not on this page.

### Stepper (two buttons)

| Layer | Kind | Points to |
|---|---|---|
| `Down` | instance, lower half | `…/<Size>/Button - Down/1 - Idle` |
| `Up` | instance, upper half | `…/<Size>/Button - Up/1 - Idle` |
| `separator` | rect, corners 0.5 | a 1-pt line on the seam |

### Stepper button

One filled frame with no corner radius, holding one centred text layer with the glyph. Up uses 􀆇 (U+100187) and Down uses 􀆈 (U+100188), in every size and state. The rounding you see comes from the layout component (mask, frame or group corners), not from the buttons.

## Sizes

Geometry is the same for Light, Dark, Content Area and Over-glass (checked across all 200 components).

| Size | Stepper | Up / Down button | `Up` @, `Down` @ | `separator` | Separator side inset (derived) | Corners (No Field frame, Inside Field mask, Outside Field `Frame`) |
|---|---|---|---|---|---|---|
| 1 Mn | 13×16 | 13×8 | @0,0 · @0,8 | 9×1 @2,7.5 | 2 = (13 − 9)/2 | 4 |
| 2 Sm | 17×20 | 17×10 | @0,0 · @0,10 | 11×1 @3,9.5 | 3 = (17 − 11)/2 | 5 |
| 3 Rg | 20×24 | 20×12 | @0,0 · @0,12 | 14×1 @3,11.5 | 3 = (20 − 14)/2 | 6 |
| 4 Lg | 23×28 | 23×14 | @0,0 · @0,14 | 15×1 @4,13.5 | 4 = (23 − 15)/2 | 7 |
| 5 XL | 30×36 | 30×18 | @0,0 · @0,18 | 20×1 @5,17.5 | 5 = (30 − 20)/2 | 9 |

The separator is centred on the seam between the buttons (derived: y + 0.5 = button height).

| Size | Glyph font and size | Glyph frame Up | Glyph frame Down |
|---|---|---|---|
| 1 Mn | SFPro-Medium 9 | 13×7.5 @0,0.5 | 13×7.5 @0,0 |
| 2 Sm | SFPro-Medium 11 | 17×9 @0,1 | 17×9 @0,1 |
| 3 Rg | SFPro-Medium 13 | 20×11.5 @0,0.5 | 20×11.5 @0,0 |
| 4 Lg | SFPro-Medium 13 | 23×13.5 @0,0.5 | 23×13.5 @0,0 |
| 5 XL | SFPro-Medium 13 | 30×18 @0,0 | 30×18 @0,0 |

Layouts:

| Size | No Field | Inside Field (total; stepper @) | Outside Field (total; field; stepper @) | Gap field → stepper, Outside Field (derived) |
|---|---|---|---|---|
| 1 Mn | 13×16 | 77×16; stepper @64,0 | 77×16; field 60×16 @0,0; stepper @64,0 | 4 = 64 − 60 |
| 2 Sm | 17×20 | 81×20; @64,0 | 81×20; field 60×20; @64,0 | 4 |
| 3 Rg | 20×24 | 84×24; @64,0 | 84×24; field 60×24; @64,0 | 4 |
| 4 Lg | 23×28 | 87×28; @64,0 | 87×28; field 60×28; @64,0 | 4 |
| 5 XL | 30×36 | 94×36; @64,0 | 94×36; field 60×36; @64,0 | 4 |

Inside Field: the stepper is flush with the right edge (derived: 64 + stepper width = total width). The total width is 64 plus the stepper width in both field layouts (derived).

## Colours and states

Button fill and glyph colour. The style is the shared style named on the button frame (values match `control-styles-content-area.md` / `control-styles-over-glass.md`).

| Appearance · Context | State | Button: style · fill | Glyph colour |
|---|---|---|---|
| Light · Content Area | 1 - Idle | `Content Area/Light/01 - Bordered/01 - Idle` · #000000@8% | #000000@85% {Labels/Light/1 Primary} |
| | 3 - Clicked | `…/01 - Bordered/03 - Clicked` · #000000@16% | #000000@85% {Labels/Light/1 Primary} |
| | 4 - Disabled | `…/01 - Bordered/04 - Disabled` · #000000@4% | #000000@25% {Labels/Light/3 Tertiary} |
| Light · Over-glass | 1 - Idle | `Over-Glass/Light/01 - Bordered/01 - Idle` · #000000@12% (blend overlay) + #000000@7% (blend plus-darker) | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, blend plus-darker |
| | 3 - Clicked | `…/03 - Clicked` · #000000@12% (overlay) + #000000@13% (plus-darker) | #363636, blend plus-darker |
| | 4 - Disabled | `…/04 - Disabled` · #000000@6% (overlay) + #000000@2.5% (plus-darker) | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary}, blend plus-darker |
| Dark · Content Area | 1 - Idle | `Content Area/Dark/01 - Bordered/01 - Idle` · #FFFFFF@7% | #FFFFFF {Labels/Dark/1 Primary} |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@16% | #FFFFFF {Labels/Dark/1 Primary} |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@4% | #FFFFFF@25% {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | 1 - Idle | `Over-Glass/Dark/01 - Bordered/01 - Idle` · #FFFFFF@12% (overlay) + #FFFFFF@5% (plus-lighter) | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary}, blend plus-lighter |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@12% (overlay) + #FFFFFF@13% (plus-lighter) | #FFFFFF@96%, blend plus-lighter |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@6% (overlay) + #FFFFFF@2.5% (plus-lighter) | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}, blend plus-lighter |

Separator:

| Appearance | Fill | Blend |
|---|---|---|
| Light (both contexts) | #D9D9D9 {Labels/Light Vibrant (use plus darker)/4 Quaternary} | plus-darker |
| Dark (both contexts) | #262626 {Labels/Dark Vibrant (use plus lighter)/4 Quaternary} | plus-lighter |

Each two-button stepper uses the `1 - Idle` buttons. Clicked and disabled looks are swaps of the `Up` or `Down` instance to the matching button component; no layout component in the kit shows a clicked or disabled stepper. The kit has no hover state.

## Text

| Part | Font | Size | Line height | Tracking | Alignment | Colour |
|---|---|---|---|---|---|---|
| Up / Down glyph | SFPro-Medium | 9 (Mn), 11 (Sm), 13 (Rg, Lg, XL) | Not in the kit | Not in the kit | center | per state, see table above |

No text style name is attached to the glyphs. The value text belongs to the `Text Fields/…/Value` component on the Text Fields page.

## Effects

| Where | Effect |
|---|---|
| Over-glass buttons | two-fill stack: first fill blend overlay, second plus-darker (Light) or plus-lighter (Dark) |
| Over-glass glyphs | blend plus-darker (Light), plus-lighter (Dark) |
| Separator | blend plus-darker (Light), plus-lighter (Dark) |
| Shadows, blurs, glass | none on this page |

## Kit notes

The page has no documentation boards. Its only text is the headings Steppers, Light, Dark, Content Area and Over-Glass.

Kit inconsistencies:

- `Steppers/Light/Over-glass/Inside Field/2 Sm` and `…/1 Mn` use the **Content Area** stepper (`Steppers/Light/􀻃/Content Area/<Size>`). The other Over-glass layouts use the Over-glass stepper.
- The Outside Field `Frame` is a group with corners, not a mask. Whether it clips the stepper is not recorded in the dump.

## Finding it in the spec

| Family | grep |
|---|---|
| Layout components | `grep -n '^COMPONENT "Steppers/[^/]*/\(Content Area\|Over-glass\)/' specs/steppers.txt` |
| One layout | `grep -n -A4 '^COMPONENT "Steppers/Light/Content Area/Inside Field/' specs/steppers.txt` |
| Two-button steppers | `grep -n -A3 '^COMPONENT "Steppers/[^/]*/􀻃/[^/]*/[1-5] [A-Za-z]*" ' specs/steppers.txt` |
| Buttons | `grep -n -A1 '^COMPONENT "Steppers/.*/Button - \(Up\|Down\)/' specs/steppers.txt` |
| Separators | `grep -n 'rect "separator"' specs/steppers.txt` |
