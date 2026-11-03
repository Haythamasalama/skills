# Toggles — iOS 27

**Read when:** you need an exact iOS 27 value for toggles (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Toggles in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/toggles.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀜊 U+10070A. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

14 components in two families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Toggle | `Toggles/<Appearance>/<Value>/<State>` | Appearance: Light, Dark. Value: Off, On. State: 1 - Idle, 3 - Pressed, 4 - Disabled | 12 (2 × 2 × 3) |
| Pressed knob | `Toggles/􀻃/<Appearance>/Knob` | Light, Dark | 2 |

There is no `2 - …` state on this page. Other pages use the toggle: the Lists accessory `Lists/􀻃/Light/Rows/Accessories - Trailing/Toggle` places `Toggles/Light/On/1 - Idle`, and the Sidebar `Items/Trailing/Toggle` uses that Lists master.

## Anatomy

### Toggle (all 12)

| Part (layer) | Kind | Off | On |
|---|---|---|---|
| Root (track) | component | 64 × 28, `corners max`, `stack h gap0 pad2,2,2,2` | same |
| `Knob` | rect | 38 × 24 @2,2, `corners 13` | 38 × 24 @24,2, `corners 13` |
| `AX Label` | group | 22 × 10 @40,9, `stack h gap0` | 22 × 10 @2,9, `stack h gap0` |
| `AX Label` (inside the group) | Off: oval 10 × 10 @6,0 (ring) | — | On: rect 1 × 10 @10.5,0 (bar) |
| `Knob` (Pressed only) | instance | 58 × 38 @-8,-5 → `Toggles/􀻃/<Appearance>/Knob` | 58 × 38 @14,-5 → same |

In Pressed the `Knob` rect stays in place with no fill, and the glass knob instance sits on top.

`AX Label` is the on/off label mark: a ring for Off, a 1-pt bar for On. All six Off variants share the Off positions and all six On variants share the On positions (checked across all 12).

### Pressed knob (`Toggles/􀻃/Light/Knob`, `Toggles/􀻃/Dark/Knob`)

Master size 59 × 37 (placed at 58 × 38 in the toggles).

| Layer (bottom to top as listed) | Size @ position, Dark | Size @ position, Light | Shared style |
|---|---|---|---|
| `Knob Shadow` | 57 × 36 @1,7 | 59 × 36 @0,7, `opacity 70%` | `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Shadow` |
| `Knob Glow` | 59 × 37 @0,0 | 59 × 37 @0,0 | `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Glow` |
| `Knob` | 59 × 37 @0,0 | 59 × 37 @0,0 | none (effects inline, see Effects) |

The same three-layer glass knob is used by the segmented control's touch state and the slider's pressed knob (the `Knob` layer's effects are identical on all three pages; checked by comparing the lines).

## Sizes

| Item | Value | Derived |
|---|---|---|
| Track | 64 × 28, corner radius max (capsule) | — |
| Track padding | 2 on every side (`pad2,2,2,2`) | — |
| Knob (resting) | 38 × 24, corner radius 13 | knob height 24 = 28 − 2 × 2 |
| Knob travel | Off x 2 → On x 24 | 22 = 64 − 2 − 38 − 2 |
| Pressed knob | 58 × 38 | grows 20 wide and 14 tall over the resting knob; Off @-8,-5 overhangs the track left by 8 and top by 5; On @14,-5 ends at x 72, overhanging the right edge by 8 |
| AX ring (Off) | 10 × 10, border 1 inside | centre x 40 + 6 + 5 = 51 |
| AX bar (On) | 1 × 10 | centre x 2 + 10.5 + 0.5 = 13 |

## Colours and states

### Light

| Value / State | Track fill | Knob | AX mark | Layer opacity |
|---|---|---|---|---|
| Off / 1 - Idle | #3C3C43@30% {Labels/Light/3 Tertiary} | #FFFFFF | ring border #B2B2B2 | — |
| Off / 3 - Pressed | #3C3C43@30% {Labels/Light/3 Tertiary} | glass knob `Toggles/􀻃/Light/Knob` | ring border #B2B2B2 | — |
| Off / 4 - Disabled | #3C3C43@30% {Labels/Light/3 Tertiary} | #FFFFFF | ring border #B2B2B2 | 50% |
| On / 1 - Idle | #34C759 {System Colors/Light/4 Green} | #FFFFFF | bar #FFFFFF | — |
| On / 3 - Pressed | #34C759 {System Colors/Light/4 Green} | glass knob `Toggles/􀻃/Light/Knob` | bar #FFFFFF | — |
| On / 4 - Disabled | #34C759 {System Colors/Light/4 Green} | #FFFFFF | bar #FFFFFF | 50% |

### Dark

| Value / State | Track fill | Knob | AX mark | Layer opacity |
|---|---|---|---|---|
| Off / 1 - Idle | #EBEBF5@30% {Labels/Dark/3 Tertiary} | #FFFFFF | ring border #A5A5A5 | — |
| Off / 3 - Pressed | #EBEBF5@30% {Labels/Dark/3 Tertiary} | glass knob `Toggles/􀻃/Dark/Knob` | ring border #A5A5A5 | — |
| Off / 4 - Disabled | #EBEBF5@30% {Labels/Dark/3 Tertiary} | #FFFFFF | ring border #A5A5A5 | 50% |
| On / 1 - Idle | #30D158 {System Colors/Dark/4 Green} | #FFFFFF | bar #FFFFFF | — |
| On / 3 - Pressed | #30D158 {System Colors/Dark/4 Green} | glass knob `Toggles/􀻃/Dark/Knob` | bar #FFFFFF | — |
| On / 4 - Disabled | #30D158 {System Colors/Dark/4 Green} | #FFFFFF | bar #FFFFFF | 50% |

Disabled = the Idle look with the whole component at `opacity 50%`. The resting knob is a plain `#FFFFFF` fill with no shadow; the kit's `Controls/Light/Knobs - Toggle/01 - Idle` style (with a shadow, see `references/control-styles.md`) is not applied to any toggle on this page. The ring colours #B2B2B2 and #A5A5A5 are not bound to swatches. The page has no text layers apart from its header.

## Effects

Pressed glass knob, from `Toggles/􀻃/<Appearance>/Knob`:

| Layer | Dark | Light |
|---|---|---|
| `Knob Shadow` | border 1 inside #000000 · blur gaussian radius3 · corners max | same · `opacity 70%` |
| `Knob Glow` | border 1 outside #000000@20% (blend plus-darker) · corners 50 | border 1 outside #D9D9D9 (blend plus-darker) · border 0.5 outside #FFFFFF@45% · corners 50 |
| `Knob` inner shadows (both) | x0 y-4 blur0.5 spread-4 #666666 (plus-lighter); x0 y4 blur0.5 spread-4 #666666 (plus-lighter); x0 y-1 blur0 spread-0.25 #171717 (plus-lighter); x0 y1 blur0 spread-0.25 #171717 (plus-lighter); x0 y20 blur20 spread-20 #F2F2F2 (plus-darker); x0 y-40 blur10 spread-40 #333333 (plus-lighter); x0 y40 blur10 spread-40 #333333 (plus-lighter) | same |
| `Knob` glass | blur glass radius0 saturation1 brightness1.2 distortion0.08 depth0.4 chromatic0.4 · corners 50 | blur glass radius0 saturation1 brightness1 distortion0.07 depth0.4 chromatic0 · corners 50 |

No fill is stored on the `Knob` glass layer.

## Kit notes

The header description is cut off in the dump; only its opening survives ("A toggle lets people choose between a pa…"). No other notes are on the page. Not in the kit: animation timing, a tinted (non-green) On colour, increased-contrast variants.

## Finding it in the spec

| Family | grep |
|---|---|
| Toggles | `grep -n '^COMPONENT "Toggles/\(Light\|Dark\)/' specs/toggles.txt` |
| Pressed knob masters | `grep -n -A3 '^COMPONENT "Toggles/􀻃/' specs/toggles.txt` |
| One state | `grep -n -A5 'Toggles/Light/On/3 - Pressed' specs/toggles.txt` |
