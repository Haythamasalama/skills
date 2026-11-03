# Sliders — iOS 27

**Read when:** you need an exact iOS 27 value for sliders (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Sliders in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/sliders.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀌆 U+100306. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

30 components in three families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Slider row | `Sliders/<Appearance>/<Glyphs>/<Value> - <State>` | Appearance: Light, Dark. Glyphs: Glyphs, No Glyphs. Value: Min, Mid, Max. State: 1 - Enabled, 4 - Disabled | 24 (2 × 2 × 3 × 2) |
| Knob | `Sliders/􀻃/Knob/<Appearance>/<State>` | Appearance: Light, Dark. State: 1 - Idle, 3 - Pressed | 4 |
| Track | `Sliders/􀻃/Track/<Appearance>` | Light, Dark | 2 |

Every slider row uses the `1 - Idle` knob; no row uses `3 - Pressed` (grep finds the pressed knobs only as masters). The Lists page also places sliders (`specs/lists.txt`).

## Anatomy

### Slider row, Glyphs (12)

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 402 × 52 | `stack h gap0 pad0,16,0,16` |
| `Stack` | group | 370 × 52 @16,0 | bottom-row separator border (see Colours), `stack h gap12` |
| `Min symbol` | text | 32 × 52 @0,0 | glyph 􀓑 U+1004D1 |
| `Stack` (track area) | group | 282 × 52 @44,0 | `stack h gap0` |
| `Track` | instance | 282 × 22 @0,15 | → `Sliders/􀻃/Track/<Appearance>`, no overrides |
| `Fill` | group | W × 6 @0,23 | `corners 3`; Mid and Max only |
| `Knob` | instance | 37 × 24 @x,14 | → `Sliders/􀻃/Knob/<Appearance>/1 - Idle` |
| `Max symbol` | text | 32 × 52 @338,0 | glyph 􀓏 U+1004CF |

Derived: 32 + 12 = 44 (track area x); 44 + 282 + 12 = 338 (max glyph x); 338 + 32 = 370.

### Slider row, No Glyphs (12)

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 402 × 52 | `stack h gap0 pad0,16,0,16` |
| `Stack` | group | 370 × 52 @16,0 | separator border, `stack h gap12` |
| `Track` | instance | 370 × 22 @0,15 (Dark Min: 333 × 22 @37,15) | → `Sliders/􀻃/Track/<Appearance>` with four `isVisible→0` overrides (which layers they hide is not in the dump) |
| `Fill` | group | W × 6 @0,23 | Mid and Max only |
| `Knob` | instance | 37 × 24 @x,14 | → `…/Knob/<Appearance>/1 - Idle` |

### Track (`Sliders/􀻃/Track/<Appearance>`)

| Part | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 370 × 22 | `stack v gap4 pad8,0,0,0` |
| `Track` | rect | 370 × 6 @0,8 | `corners 3` |
| `Ticks` | group | 370 × 4 @0,18 | `stack h gap0 pad0,16,0,16` |
| `Tick` × 9 | oval | 4 × 4 at x 16, 57.75, 99.5, 141.25, 183, 224.75, 266.5, 308.25, 350 | `corners 3` |

Derived: tick pitch 41.75; first tick at the 16 padding, last tick ends at 354 = 370 − 16. Ticks sit 4 below the track bar (8 + 6 + 4 = 18).

### Knob

| State | Root | Layers |
|---|---|---|
| 1 - Idle | 37 × 24, fill #FFFFFF, `corners max`, two shadows | none |
| 3 - Pressed | 37 × 24, `corners max`, no fill | `Knob Shadow` 57 × 38 @-10,0; `Knob Glow` 57 × 38 @-10,-7; `Knob` 57 × 38 @-10,-7 |

Derived: the pressed glass is 20 wider and 14 taller than the idle knob, centred (overhang 10 each side, 7 above and below). The pressed layers are the same glass knob as the toggle's (`references/toggles.md`).

## Sizes

| Item | Value | Derived |
|---|---|---|
| Row | 402 × 52 | — |
| Row inset | 16 leading and trailing | — |
| Track bar | 6 tall, corner radius 3 | bar y in the row: 15 + 8 = 23 |
| Track length | 282 with glyphs; 370 without (333 in Dark No Glyphs Min) | — |
| Fill | 6 tall, corner radius 3, same y as the bar (23) | — |
| Knob | 37 × 24, corner radius max | knob centre y 14 + 12 = 26 = bar centre 23 + 3 = row centre 52 / 2 |
| Glyph slots | 32 × 52 each, gap 12 to the track | — |
| Ticks | 9 × 4 × 4, pitch 41.75 | — |

### Value positions

| Value | With glyphs: fill width / knob x | No glyphs: fill width / knob x | Derived |
|---|---|---|---|
| Min | no fill / 0 | no fill / 0 | knob starts at the track start |
| Mid | 141 / 122 | 185 / 166 | fill = half the track; knob centre 140.5 / 184.5, about 0.5 short of the fill end |
| Max | 282 (Light 282.9) / 244 | 370 / 332 | knob right edge 281 / 369, 1 short of the track end |

## Colours and states

| Part | Light | Dark |
|---|---|---|
| Track bar | #787878@20% {Fills/Light/1 Primary} | #787880@36% {Fills/Dark/1 Primary} |
| Fill | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Ticks | #3C3C43@18% {Labels/Light/4 Quaternary} | #EBEBF5@16% {Labels/Dark/4 Quaternary} |
| Min / Max glyphs | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Row separator (`Stack` border) | 1 outside #000000@12% {Separators/Light/Non-Opaque} (No Glyphs Min and Max: 1 inside) | 1 outside #FFFFFF@12% {Separators/Dark/Non-Opaque} |
| Idle knob | #FFFFFF, shadows (see Effects) | same |

| State | Difference |
|---|---|
| 1 - Enabled | as above |
| 4 - Disabled | the whole row at `opacity 50%`; every other value is the same as Enabled (checked across all 24) |

The kit's `Controls/…/Tracks/…` shared styles (`references/control-styles.md`) are not applied on this page; the track and fill use swatches directly.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Min / Max glyph | SFPro-Semibold | 17 | 22 | Not in the kit | Labels/2 Secondary | center |

No text style is bound.

## Effects

| Item | Values |
|---|---|
| Idle knob shadows | x0 y6 blur13 spread0 #000000@12%; x0 y0.5 blur4 spread0 #000000@12% |
| Pressed `Knob Shadow` | style `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Shadow`: border 1 inside #000000 · blur gaussian radius3 · corners max (Light adds `opacity 70%`) |
| Pressed `Knob Glow` | style `Controls/<Appearance>/Knobs - Toggle/03 - Clicked - Glow`: Dark border 1 outside #000000@20% (plus-darker); Light border 1 outside #D9D9D9 (plus-darker) + border 0.5 outside #FFFFFF@45%; corners 50 |
| Pressed `Knob` inner shadows | x0 y-4 blur0.5 spread-4 #666666 (plus-lighter); x0 y4 blur0.5 spread-4 #666666 (plus-lighter); x0 y-1 blur0 spread-0.25 #171717 (plus-lighter); x0 y1 blur0 spread-0.25 #171717 (plus-lighter); x0 y20 blur20 spread-20 #F2F2F2 (plus-darker); x0 y-40 blur10 spread-40 #333333 (plus-lighter); x0 y40 blur10 spread-40 #333333 (plus-lighter) |
| Pressed `Knob` glass | Dark: blur glass radius0 saturation1 brightness1.2 distortion0.08 depth0.4 chromatic0.4; Light: blur glass radius0 saturation1 brightness1 distortion0.07 depth0.4 chromatic0; corners 50 |

## Kit notes

The header description is cut off in the dump; only its opening survives ("A slider is a horizontal track with a co…"). Not in the kit: a pressed slider row, a vertical slider, a tinted fill other than blue, and when the ticks should show (the 12 No Glyphs rows hide four layers of the track, the 12 Glyphs rows hide none).

## Finding it in the spec

| Family | grep |
|---|---|
| Rows | `grep -n '^COMPONENT "Sliders/\(Light\|Dark\)/' specs/sliders.txt` |
| Knobs | `grep -n -A3 '^COMPONENT "Sliders/􀻃/Knob/' specs/sliders.txt` |
| Tracks | `grep -n -A11 '^COMPONENT "Sliders/􀻃/Track/' specs/sliders.txt` |
| Fill widths | `grep -n 'group "Fill"' specs/sliders.txt` |
| Track overrides | `grep -n 'use "Track"' specs/sliders.txt` |
