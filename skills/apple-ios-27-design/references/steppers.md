# Steppers — iOS 27

**Read when:** you need an exact iOS 27 value for steppers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Steppers in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/steppers.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􂻥 U+102EE5. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

14 components in two families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Segment | `Stepper/<Appearance>/􀻃/<Segment>/<State>` | Appearance: Light, Dark. Segment: Decrement, Increment. State: Light = Default, 3 - Pressed, 4 - Disabled; Dark = 1 - Idle, 3 - Pressed, 4 - Disabled | 12 (2 × 2 × 3) |
| Stepper | `Stepper/<Appearance>` | Light, Dark | 2 |

The resting state is named `Default` in Light and `1 - Idle` in Dark.

## Anatomy

### Stepper (`Stepper/Light`, `Stepper/Dark`)

| Part (layer) | Kind | Size @ position | Uses |
|---|---|---|---|
| Root | component | 92 × 32 | `corners max`, `stack h gap0 pad0,0,0,0` |
| `Decrement` | instance | 46 × 32 @0,0 | Light: `Stepper/Light/􀻃/Decrement/Default`; Dark: `Stepper/Dark/􀻃/Decrement/1 - Idle` |
| `Increment` | instance | 46 × 32 @46,0 | Light: `Stepper/Light/􀻃/Increment/Default`; Dark: `Stepper/Dark/􀻃/Increment/1 - Idle` |
| `Separator` | rect | 1 × 24 @45.5,4 | fill (see Colours) |

Derived: the separator is centred on the seam (45.5 + 0.5 = 46) and inset 4 from top and bottom ((32 − 24) / 2 = 4).

Only the resting state is assembled; the kit has no full stepper in Pressed or Disabled.

### Segment

| Part (layer) | Kind | Size @ position |
|---|---|---|
| Root | component | 46 × 32, fill only (no corners stored on the segment) |
| `􀅽` (Decrement) / `􀅼` (Increment) | text | 46 × 32 @0,0, centred |

Glyphs: Decrement 􀅽 U+10017D, Increment 􀅼 U+10017C.

## Sizes

| Item | Width × height | Corner radius | Glyph | Separator |
|---|---|---|---|---|
| Stepper | 92 × 32 | max (capsule) | — | 1 × 24, inset 4 top and bottom |
| Segment | 46 × 32 | none stored | SFPro-Semibold 17, centred in the full 46 × 32 | — |

## Colours and states

### Segments, Light

| State | Fill (bottom first) | Glyph colour |
|---|---|---|
| Default | #767680@12% {Fills/Light/3 Tertiary} | #000000 {Labels/Light/1 Primary} |
| 3 - Pressed | #747480@8% {Fills/Light/4 Quaternary} + #000000@8% (blend plus-darker) | #000000 {Labels/Light/1 Primary} |
| 4 - Disabled | #767680@12% {Fills/Light/3 Tertiary} | #3C3C43@30% {Labels/Light/3 Tertiary} |

### Segments, Dark

| State | Fill (bottom first) | Glyph colour |
|---|---|---|
| 1 - Idle | #767680@18% {Fills/Dark/4 Quaternary} | #FFFFFF {Labels/Dark/1 Primary} |
| 3 - Pressed | #767680@18% {Fills/Dark/4 Quaternary} + #000000@8% (blend plus-darker) | #FFFFFF {Labels/Dark/1 Primary} |
| 4 - Disabled | #767680@18% {Fills/Dark/4 Quaternary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} |

Decrement and Increment use identical fills and colours in every state (checked across all 12).

### Assembled stepper

| Appearance | Root fill (bottom first) | Separator fill |
|---|---|---|
| Light | #747480@8% {Fills/Light/4 Quaternary} + #FFFFFF | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Dark | #747480@8% {Fills/Light/4 Quaternary} + #FFFFFF (as stored: Light swatches) | #3C3C43@30% {Labels/Light/3 Tertiary} (as stored: Light swatch) |

No shared layer styles (`style=`) are used on this page.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Segment glyph | SFPro-Semibold | 17 | Not in the kit | Not in the kit | per state (above) | center |

No text style is bound.

## Effects

Only the Pressed overlay fill `#000000@8%` with `blend plus-darker`. No shadows, blurs or glass.

## Kit notes

The header description is cut off in the dump; it starts by defining a stepper as a two-segment control. No other notes are on the page.

## Finding it in the spec

| Family | grep |
|---|---|
| Segments | `grep -n '^COMPONENT "Stepper/.*/􀻃/' specs/steppers.txt` |
| Assembled steppers | `grep -n -A4 '^COMPONENT "Stepper/\(Light\|Dark\)" ' specs/steppers.txt` |
| One state | `grep -n -A1 '3 - Pressed' specs/steppers.txt` |
