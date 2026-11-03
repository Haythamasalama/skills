# Text Fields — macOS 27

**Read when:** you need an exact macOS 27 value for text Fields (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Text Fields in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/text-fields.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, **Text Fields**, with 60 components (2 × 5 × 6).

Name path: `Text Fields/<Appearance>/<Size>/<State>`

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Size | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State | Empty, Empty + Typing, Empty + Disabled, Value, Value + Typing, Value + Disabled |

- The page has no Content Area / Over-glass axis.
- It has no hover state.
- Every component is 120 pt wide.
- Other pages nest instances of these fields:
  - combo boxes (40 instances)
  - steppers (40)
  - dialogs (4)
  - forms (2)

## Anatomy

The field is a horizontal auto-layout row (`stack h`) with rounded corners, carrying the field style. Its children:

| Layer | Kind | In which states | What it is |
|---|---|---|---|
| `Value` | text | Value, Value + Disabled | The entered text, content "Value", filling the width between the paddings |
| `Stack` | group, `stack h gap0` | Value + Typing | Holds the `Value` text and the `I-beam` after it |
| `I-beam` | rect, corners 2.5 | Value + Typing (inside `Stack`), Empty + Typing (directly in the field) | The text cursor, 2 pt wide, system blue |
| `Focus Ring` | rect, full field size @0,0, same corners as the field | Both Typing states | Style `…/Input Fields/03 - Focus Ring` |

- **Empty** and **Empty + Disabled** have no child layers: the kit draws no placeholder text in a text field.
- The page uses no nested component instances.

## Sizes

Geometry is identical in Light and Dark (checked for every size and state).

| Size | W × H | Corners | Text font | Text inset (L / R) | Value text frame @ | Focus Ring corners |
|---|---|---|---|---|---|---|
| 5 XL | 120 × 36 | 9, smoothing 0.6 | SFPro-Medium 13 | 10 / 10 | 100 × 15 @10,11 (Value + Disabled: 100 × 36 @10,0) | 9 |
| 4 Lg | 120 × 28 | 7, smoothing 0.6 | SFPro-Medium 13 | 8 / 8 | 104 × 28 @8,0 | 7 |
| 3 Rg | 120 × 24 | 6, smoothing 0.6 | SFPro-Medium 13 | 6 / 6 | 108 × 24 @6,0 | 6 |
| 2 Sm | 120 × 20 | 5, smoothing 0.6 | SFPro-Medium 11 | 6 / 6 | 108 × 20 @6,0 | 5 |
| 1 Mn | 120 × 16 | 4, smoothing 0.6 | SFPro-Medium 10 | 6 / 6 | 108 × 16 @6,0 | 4 |

Auto-layout settings per state:

| Size | Value, Value + Disabled | Value + Typing | Empty, Empty + Disabled | Empty + Typing |
|---|---|---|---|---|
| 5 XL | gap 3, pad 11,10,10,10 (Value + Disabled: 0,10,0,10) | gap 1, pad 0,10,0,10 | gap 3, pad 11,8,10,10 (Empty + Disabled: 0,8,0,10) | gap 1, pad 0,8,0,10 |
| 4 Lg | gap 3, pad 0,8,0,8 | gap 1, pad 0,8,0,8 | gap 3, pad 0,6,0,8 | gap 1, pad 0,6,0,8 |
| 3 Rg | gap 3, pad 0,6,0,6 | gap 1, pad 0,6,0,6 | gap 3, pad 0,4,0,6 | gap 1, pad 0,4,0,6 |
| 2 Sm | gap 3, pad 0,6,0,6 | gap 1, pad 0,6,0,6 | gap 3, pad 0,2.5,0,6 | gap 1, pad 0,2.5,0,6 |
| 1 Mn | gap 3, pad 0,6,0,6 | gap 1, pad 0,6,0,6 | gap 3, pad 0,2,0,6 | gap 1, pad 0,2,0,6 |

Typing states:

| Size | Stack (Value + Typing) | Value text in Stack | I-beam in Stack | I-beam (Empty + Typing) |
|---|---|---|---|---|
| 5 XL | 100 × 18 @10,9 | 35 × 15 @0,1.5 | 2 × 18 @35,0 | 2 × 18 @10,9 |
| 4 Lg | 104 × 18 @8,5 | 35 × 15 @0,1.5 | 2 × 18 @35,0 | 2 × 18 @8,5 |
| 3 Rg | 108 × 18 @6,3 | 35 × 15 @0,1.5 | 2 × 18 @35,0 | 2 × 18 @6,3 |
| 2 Sm | 108 × 16 @6,2 | 30 × 13 @0,1.5 | 2 × 16 @30,0 | 2 × 16 @6,2 |
| 1 Mn | 108 × 14 @6,1 | 28 × 12 @0,1 | 2 × 14 @28,0 | 2 × 14 @6,1 |

Derived values:

- Text inset = the left padding of the Value states. The right padding is the same, so the text frame is 120 − 2 × inset wide (Rg: 120 − 12 = 108).
- The I-beam is vertically centred: y = (field height − I-beam height) ÷ 2 (Rg: (24 − 18) ÷ 2 = 3).
- In Empty + Typing the I-beam sits at the text inset (x = left padding).
- Field corner radius: XL 9, Lg 7, Rg 6, Sm 5, Mn 4. The Focus Ring uses the same radius as its field.
- I-beam height: 18 (XL, Lg, Rg), 16 (Sm), 14 (Mn).

## Colours and states

Field styles are in `control-styles-content-area.md` / `control-styles-over-glass.md` (`Content Area/<Appearance>/Input Fields/…`). Colours are the same in every size (checked across all five sizes).

### Light

| State | Field style | Fill | Border | Field opacity | Text | Other |
|---|---|---|---|---|---|---|
| Empty | Content Area/Light/Input Fields/01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | none | — |
| Empty + Typing | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | none | Focus Ring; I-beam #0088FF {System Colors/Light/8 Blue} |
| Empty + Disabled | Content Area/Light/Input Fields/04 - Disabled | #FFFFFF@50% | 1 outside #000000@4% (blend plus-darker) | — | none | — |
| Value | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | #000000@85% {Labels/Light/1 Primary} | — |
| Value + Typing | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | #000000@85% {Labels/Light/1 Primary} | Focus Ring; I-beam #0088FF |
| Value + Disabled | 04 - Disabled | #FFFFFF@50% | 1 outside #000000@4% (blend plus-darker) | — | #000000@25% {Labels/Light/3 Tertiary} | — |

Light Focus Ring: style `Content Area/Light/Input Fields/03 - Focus Ring`. Border 3.5 outside #0088FF {System Colors/Light/8 Blue} + border 1 inside #0088FF, layer opacity 50%.

### Dark

| State | Field style | Fill | Border | Field opacity | Text | Other |
|---|---|---|---|---|---|---|
| Empty | Content Area/Dark/Input Fields/01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | none | — |
| Empty + Typing | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | none | Focus Ring; I-beam #0091FF {System Colors/Dark/8 Blue} |
| Empty + Disabled | Content Area/Dark/Input Fields/04 - Disabled | #1E1E1E@50% | 1 outside #000000@4% | 50% | none | — |
| Value | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | #FFFFFF {Labels/Dark/1 Primary} | — |
| Value + Typing | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | #FFFFFF {Labels/Dark/1 Primary} | Focus Ring; I-beam #0091FF |
| Value + Disabled | 04 - Disabled | #1E1E1E@50% | 1 outside #000000@4% | 50% | #FFFFFF@25% {Labels/Dark/3 Tertiary} | — |

Dark Focus Ring: style `Content Area/Dark/Input Fields/03 - Focus Ring`. Border 3.5 outside #0091FF {System Colors/Dark/8 Blue} (blend plus-lighter) + border 1 inside #0091FF (blend plus-lighter), layer opacity 50%.

How Disabled differs from Idle:

- In Light: the fill drops to 50% white, the border alpha to 4%, and the text to Tertiary.
- In Dark: the same changes apply, and the whole field also has opacity 50%, which dims the Tertiary text further.

## Text

| Size | Font | Size (pt) | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| 5 XL, 4 Lg, 3 Rg | SFPro-Medium | 13 | Not in the kit | Not in the kit | left |
| 2 Sm | SFPro-Medium | 11 | Not in the kit | Not in the kit | left |
| 1 Mn | SFPro-Medium | 10 | Not in the kit | Not in the kit | left |

- No shared text style is linked. Text has no blend mode on this page.
- The labels use the non-vibrant swatches `Labels/Light/…` and `Labels/Dark/…`. The search fields page uses the Vibrant ones.
- Placeholder text: Not in the kit (the Empty states have no text layer).

## Effects

| Where | Effect |
|---|---|
| Focus Ring, Light | border 3.5 outside + border 1 inside, #0088FF, layer opacity 50% |
| Focus Ring, Dark | border 3.5 outside + border 1 inside, #0091FF, each border blend plus-lighter, layer opacity 50% |
| Field border, Light | blend plus-darker on the border |
| Field, Dark Disabled | layer opacity 50% |

The page has no shadows, blurs or glass.

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are the headings "Text Fields", "Light" and "Dark".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All fields | `grep -n '^COMPONENT "Text Fields/' specs/text-fields.txt` |
| One size, all states | `grep -n -A5 '^COMPONENT "Text Fields/Dark/3 Rg/' specs/text-fields.txt` |
| Corner radius per size | `grep -o '^COMPONENT "Text Fields/Light/[^/]*/Value".*corners [0-9]*' specs/text-fields.txt` |
| Focus rings and cursors | `grep -n 'rect "Focus Ring"\|rect "I-beam"' specs/text-fields.txt` |
| Pages that nest text fields | `grep -l '→ Text Fields/' specs/*.txt` |
