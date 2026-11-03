# Progress Indicators — iOS 27

**Read when:** you need an exact iOS 27 value for progress Indicators (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Progress Indicators in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/progress-indicators.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀴽 U+100D3D.

## Components

10 components: five kinds, each in Light and Dark.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Progress bar row | `Progress Indicators/<Appearance>/Table View Row` | Light, Dark | 2 |
| Spinner | `Progress Indicators/<Appearance>/Indeterminate Spinner - <Size>` | Appearance: Light, Dark. Size: Large, Regular, Small | 6 |
| Spinner with label | `Progress Indicators/<Appearance>/Indeterminate Spinner with Label` | Light, Dark | 2 |

## Anatomy

### Progress bar row (`Table View Row`)

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 402 × 44 | `stack h gap0 pad0,16,0,16` |
| `Stack` (row) | group | 370 × 44 @16,0 | transparent fill, separator drawn as a shadow, `stack v gap3 pad20,0,20,0` |
| `Stack` (track) | group | 370 × 4 @0,20 | `corners max`, `stack h gap0` |
| `Fill` | group | 185 × 4 @0,0 | `corners max` (progress shown at half: 185 / 370 = 50%, derived) |

Derived: the track's top 20 equals the top padding; 44 − 20 − 4 = 20 below.

### Spinner (Large, Regular, Small)

Each spinner is a square with eight spokes named by angle: `0`, `45`, `90`, `135`, `180`, `225`, `270`, `325`. The names are stored like that ("325", not 315). Rotation is not in the dump; only each spoke's bounding box is.

| Spoke | Opacity | Large 35 × 35: size @ pos | Regular 20 × 20: size @ pos | Small 14 × 14: size @ pos |
|---|---|---|---|---|
| `0` | 100% (none stored) | 5 × 13 @15,0 | 2.67 × 6.67 @8.67,0 | 2 × 4 @6,0 |
| `45` | 15% | 5 × 13 @22.78,3.22 | 2.67 × 6.67 @13.38,1.95 | 2 × 4 @9.54,1.46 |
| `90` | 27% | 5 × 13 @26,11 | 6.67 × 2.67 @13.33,8.67 | 2 × 4 @11,5 |
| `135` | 39% | 5 × 13 @22.78,18.78 | 6.67 × 2.67 @11.38,13.38 | 2 × 4 @9.54,8.54 |
| `180` | 51% | 5 × 13 @15,22 | 2.67 × 6.67 @8.67,13.33 | 2 × 4 @6,10 |
| `225` | 63% | 5 × 13 @7.22,18.78 | 2.67 × 6.67 @3.95,11.38 | 2 × 4 @2.46,8.54 |
| `270` | 75% | 5 × 13 @4,11 | 6.67 × 2.67 @0,8.67 | 2 × 4 @1,5 |
| `325` | 87% | 5 × 13 @7.22,3.22 | 6.67 × 2.67 @1.95,3.95 | 2 × 4 @2.46,1.46 |

Every spoke is a `rect` with `corners max` and fill #000000. Opacities and positions are identical in Light and Dark (checked across all 6 spinners). The Regular size stores horizontal boxes for some spokes (6.67 × 2.67), the Large and Small sizes store every spoke as an upright box.

### Spinner with label

| Part | Light | Dark |
|---|---|---|
| Root | 402 × 62 | 402 × 62 |
| `Label` group | 209 × 62 @96.5,0, `stack h gap8` | same |
| `Spinner` instance | 20 × 20 @5,21 → `…/Light/Indeterminate Spinner - Regular` | 22 × 22 @0,20 → `…/Dark/Indeterminate Spinner - Regular` |
| `Label` text | 171 × 22 @33,20 "Checking for Update…" | 171 × 22 @30,20 "Checking for Update…" |

Derived: the group is centred ((402 − 209) / 2 = 96.5). Spinner-to-text gap is 8 in both: Light 33 − (5 + 20) = 8, Dark 30 − 22 = 8.

## Sizes

| Item | Size | Corner radius | Insets / gap |
|---|---|---|---|
| Bar row | 402 × 44 | 0 | 16 left and right; track 20 from top and bottom |
| Bar track | 370 × 4 | max | — |
| Spinner, Large | 35 × 35 | spokes max | spoke 5 × 13 |
| Spinner, Regular | 20 × 20 | spokes max | spoke 2.67 × 6.67 |
| Spinner, Small | 14 × 14 | spokes max | spoke 2 × 4 |
| Spinner with label | 402 × 62 | — | spinner → text gap 8 |

## Colours and states

| Part | Light | Dark |
|---|---|---|
| Bar track | #787878@20% {Fills/Light/1 Primary} | #787880@36% {Fills/Dark/1 Primary} |
| Bar fill | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Row separator (shadow) | x0 y0.5 blur0 spread0 #C6C6C8 {Separators/Light/Opaque} | x0 y0.5 blur0 spread0 #38383A {Separators/Dark/Opaque} |
| Row fill | #FFFFFF@0% (blend multiply) | #000000@0% (blend screen) |
| Spinner root fill | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Spinner spokes | #000000 with the per-spoke opacities above | same |
| Label text | #3C3C43@60% {Labels/Light/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |

The spinner's colour is stored as the root fill while the spokes are black; how the two combine is not in the dump. No determinate-progress states other than the 50% fill are drawn, and there is no paused or disabled state.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align | Text style |
|---|---|---|---|---|---|---|---|
| Spinner label | SFPro-Regular | 17 | 22 | Not in the kit | Labels/2 Secondary | left | `06 Body/1 Default` |

## Effects

- Row separator: a 0.5-pt downward shadow (x0 y0.5 blur0 spread0) in the opaque separator colour, not a border.
- Row fill blend: `multiply` in Light, `screen` in Dark, on 0%-alpha fills.
- No blurs or glass.

## Kit notes

The header description is cut off in the dump; only its opening survives ("Progress indicators let people know that…"). No other notes are on the page. Not in the kit: animation speed and direction for the spinner, a circular determinate indicator, bar heights other than 4, and a bar with a label.

## Finding it in the spec

| Family | grep |
|---|---|
| All | `grep -n '^COMPONENT "Progress Indicators/' specs/progress-indicators.txt` |
| Spinners | `grep -n -A9 'Indeterminate Spinner - ' specs/progress-indicators.txt` |
| Bar row | `grep -n -A4 'Table View Row"' specs/progress-indicators.txt` |
| Spinner with label | `grep -n -A3 'Spinner with Label"' specs/progress-indicators.txt` |
