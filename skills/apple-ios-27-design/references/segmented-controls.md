# Segmented Controls — iOS 27

**Read when:** you need an exact iOS 27 value for segmented Controls (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Segmented Controls in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/segmented-controls.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀿴 U+100FF4. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

16 components in three families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Segmented control | `Segmented Controls/<Appearance>/<Size>/<State>` | Appearance: Light, Dark. Size: Large, Small. State: 1 - Enabled, 4 - Disabled | 8 |
| Segment | `Segmented Controls/􀻃/<Appearance>/<State>` | Appearance: Light, Dark. State: 1 - Unselected, 3 - Touch, 5 - Selected | 6 |
| Touch glass | `Segmented Controls/􀻃/Glass/<Appearance>` | Light, Dark | 2 |

No assembled control uses the `3 - Touch` segment (grep finds 0 instances); it exists only as a master.

## Anatomy

### Segmented control (all 8)

| Part (layer) | Kind | Large | Small |
|---|---|---|---|
| Root (track) | component | 370 × 48 | 370 × 32 |
| Layout | — | `corners max`, `stack h gap4 pad2,2,2,2` | same |
| Segments | 5 instances | 70 × 44 at x 2, 76, 150, 224, 298; y 2 | 70 × 28 at the same x; y 2 |
| First segment | instance | → `…/􀻃/<Appearance>/5 - Selected` | same |
| Segments 2–5 | instances | → `…/􀻃/<Appearance>/1 - Unselected` | same |

Instance names differ by appearance: Light uses `Item 1`…`Item 5`, Dark uses `Button 1`…`Button 5` (with two text overrides each, "Button N" and "Item N").

Derived: 5 × 70 + 4 × 4 + 2 × 2 = 370; segment height = track height − 4 (48 − 4 = 44, 32 − 4 = 28).

### Segment (`Segmented Controls/􀻃/<Appearance>/<State>`)

| Part | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 80 × 28 | `stack h gap0 pad5,4,5,4` |
| `Label` | text | 72 × 18 @4,5 | "Label", centred |
| `Glass` (3 - Touch only) | instance | 100 × 42 @-10,-7 | → `Segmented Controls/􀻃/Glass/<Appearance>` |

Derived: label inset 4 left and right, 5 top and bottom (28 − 18 = 10). In Touch the glass overhangs the segment by 10 on each side and 7 above and below.

### Touch glass (`Segmented Controls/􀻃/Glass/<Appearance>`)

Master 59 × 37, placed at 100 × 42.

| Layer | Dark | Light | Shared style |
|---|---|---|---|
| `Knob Shadow` | 57 × 36 @1,7 | 59 × 36 @0,7, `opacity 70%` | `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Shadow` |
| `Knob Glow` | 59 × 37 @0,0 | 59 × 37 @0,0 | `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Glow` |
| `Knob` | 59 × 37 @0,0 | 59 × 37 @0,0 | none (inline effects, see Effects) |

This is the same glass knob as the toggle's pressed knob and the slider's pressed knob (identical `Knob` layer effects; see `references/toggles.md`).

## Sizes

| Item | Width × height | Corner radius | Padding | Gap |
|---|---|---|---|---|
| Control, Large | 370 × 48 | max | 2 all sides | 4 |
| Control, Small | 370 × 32 | max | 2 all sides | 4 |
| Segment in Large | 70 × 44 | Selected: max | label 72 × 18 in an 80 × 28 master | — |
| Segment in Small | 70 × 28 | Selected: max | same | — |
| Segment master | 80 × 28 | Selected: max; Unselected/Touch: none stored | 5, 4, 5, 4 (top, right, bottom, left) | 0 |
| Touch glass | 100 × 42 placed (59 × 37 master) | 50 | — | — |

## Colours and states

### Track

| Appearance / State | Track fill (bottom first) | Opacity |
|---|---|---|
| Light / 1 - Enabled | #767680@12% {Fills/Light/3 Tertiary} + #FFFFFF | — |
| Light / 4 - Disabled | #767680@12% {Fills/Light/3 Tertiary} + #FFFFFF | 50% |
| Dark / 1 - Enabled | #767680@24% {Fills/Dark/3 Tertiary} + #FFFFFF | — |
| Dark / 4 - Disabled | #767680@24% {Fills/Dark/3 Tertiary} + #FFFFFF | 50% |

Values are the same for Large and Small (checked across all 8). Disabled = the Enabled control at `opacity 50%`, still with the first segment selected.

### Segments

| Appearance / State | Segment fill | Effects | Label |
|---|---|---|---|
| Light / 1 - Unselected | #5856D6 (stored root fill, no swatch) | — | SFPro-Medium, #000000 (no swatch) |
| Light / 3 - Touch | #5856D6 (stored root fill, no swatch) | glass knob instance | SFPro-Medium, #000000 |
| Light / 5 - Selected | #FFFFFF | shadow x0 y2 blur20 spread0 #000000@6% · corners max | SFPro-Semibold, #000000 · `mask` |
| Dark / 1 - Unselected | #5856D6 (stored root fill, no swatch) | — | SFPro-Medium, #FFFFFF {Labels/Dark/1 Primary} |
| Dark / 3 - Touch | #5856D6 (stored root fill, no swatch) | glass knob instance | SFPro-Medium, #FFFFFF {Labels/Dark/1 Primary} |
| Dark / 5 - Selected | #FFFFFF@27% | corners max (no shadow) | SFPro-Semibold, #FFFFFF {Labels/Dark/1 Primary} · `mask` |

The Selected label layers are flagged `mask` in the dump. #5856D6 is also stored as a root fill on masters on other pages of the kit; the dump does not say whether it is drawn in instances.

No shared layer style is applied to the track or segments; only the glass layers use `Controls/…/Knobs - Toggle/03 - Clicked - …`.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Unselected / Touch label | SFPro-Medium | 13.33 | 18 | -0.4 | per appearance (above) | center |
| Selected label | SFPro-Semibold | 13.33 | 18 | -0.4 | per appearance (above) | center |

No text style is bound. The label size is the same in Large and Small (only the segment height changes).

## Effects

| Item | Values |
|---|---|
| Light Selected segment shadow | x0 y2 blur20 spread0 #000000@6% |
| Glass `Knob Shadow` | Dark: border 1 inside #000000 · blur gaussian radius3 · corners max. Light: same · `opacity 70%` |
| Glass `Knob Glow` | Dark: border 1 outside #000000@20% (blend plus-darker) · corners 50. Light: border 1 outside #D9D9D9 (blend plus-darker) · border 0.5 outside #FFFFFF@45% · corners 50 |
| Glass `Knob` inner shadows (both) | x0 y-4 blur0.5 spread-4 #666666 (plus-lighter); x0 y4 blur0.5 spread-4 #666666 (plus-lighter); x0 y-1 blur0 spread-0.25 #171717 (plus-lighter); x0 y1 blur0 spread-0.25 #171717 (plus-lighter); x0 y20 blur20 spread-20 #F2F2F2 (plus-darker); x0 y-40 blur10 spread-40 #333333 (plus-lighter); x0 y40 blur10 spread-40 #333333 (plus-lighter) |
| Glass `Knob` glass | Dark: blur glass radius0 saturation1 brightness1.2 distortion0.08 depth0.4 chromatic0.4 · corners 50. Light: blur glass radius0 saturation1 brightness1 distortion0.07 depth0.4 chromatic0 · corners 50 |

## Kit notes

The header description is cut off in the dump; only its opening survives ("A segmented control is a linear set of t…"). No other notes are on the page. Not in the kit: segments with symbols, controls with fewer or more than five segments, per-segment disabled state, and a touch state placed in an assembled control.

## Finding it in the spec

| Family | grep |
|---|---|
| Controls | `grep -n '^COMPONENT "Segmented Controls/\(Light\|Dark\)/' specs/segmented-controls.txt` |
| Segments | `grep -n -A2 '^COMPONENT "Segmented Controls/􀻃/\(Light\|Dark\)/' specs/segmented-controls.txt` |
| Glass | `grep -n -A3 'Segmented Controls/􀻃/Glass/' specs/segmented-controls.txt` |
