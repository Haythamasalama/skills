# Progress Indicators — macOS 27

**Read when:** you need an exact macOS 27 value for progress Indicators (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Progress Indicators in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/progress-indicators.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀴽 (U+100D3D).

## Components

192 components. Only two sizes exist: 2 Sm and 3 Rg.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Linear bar, Content Area | `Progress Indicators/<Appearance>/Content Area/Linear/<Kind>/<Size>/<State>` | Appearance: Light, Dark · Kind: Determinate, Indeterminate · Size: 2 Sm, 3 Rg · State (Determinate): `Active, 0%`, `Active, 25%`, `Active, 50%`, `Active, 75%`, `Active, 100%` and the same five for `Inactive` · State (Indeterminate): `Active`, `Inactive` | 48 |
| Linear bar, Over-Glass | `Progress Indicators/<Appearance>/Over-Glass/<Kind>/<Size>/<State>` (no `Linear` level) | as above, except the Indeterminate states are `Active, Loop 3` and `Inactive, Loop 3` | 48 |
| Circular | `Progress Indicators/<Appearance>/<Context>/Circular/<Kind>/<Size>/<State>` | Context: Content Area, Over-Glass · Kind and State as the Content Area bar | 96 |

## Anatomy

| Family | Layers | Notes |
|---|---|---|
| Linear, Determinate | component frame (the track: fill, 0.5 border, corners max) · `Color` rect (the fill, from x 0) | |
| Linear, Indeterminate | component frame (track) · `Mask` rect (clipping mask with a linear gradient) · `Color` rect | the mask fades the `Color` segment |
| Circular, Determinate | `Track` shape (full ring area) · `Filled Track` shape | path shapes. The dump gives only their bounding boxes |
| Circular, Indeterminate | eight rects named `1` … `8`, corners max | spokes; each has its own fill opacity |

## Sizes

Geometry is the same for Light, Dark, Content Area and Over-Glass, Active and Inactive (checked across all 192).

### Linear bar

| Size | Track (component) | Corners | Border |
|---|---|---|---|
| 2 Sm | 140×6 | max | 0.5 inside |
| 3 Rg | 140×10 | max | 0.5 inside |

Determinate `Color` width (at x 0, full height):

| Value | 2 Sm | 3 Rg | Note (derived) |
|---|---|---|---|
| 0% | 8×6 | 10×10 | a minimum nub, not zero |
| 25% | 35×6 | 35×10 | 0.25 × 140 |
| 50% | 70×6 | 70×10 | 0.5 × 140 |
| 75% | 105×6 | 105×10 | 0.75 × 140 |
| 100% | 140×6 | 140×10 | full width |

Indeterminate: `Mask` and `Color` are both 84×H @28,0 (H = 6 or 10). The segment is 60% of the track and centred (derived: 84 / 140 = 0.6; (140 − 84) / 2 = 28). The kit has one frame of the indeterminate bar. The animation is not in the kit.

### Circular

| Size | Component | `Track` | `Filled Track` |
|---|---|---|---|
| 2 Sm | 16×16 | 16×16 @0,0 | 16×16 @0,0 |
| 3 Rg | 32×32 | 32×32 @0,0 | 18.5×32 @13.5,0 |

The `Filled Track` bounding box is the same for 0%, 25%, 50%, 75% and 100%. The arc path for each value is not in the dump, so the arc geometry per percentage is not in the kit as dumped. Ring thickness is not in the kit either.

Indeterminate spokes (frames as stored; the dump has no rotation values):

| Spoke | 3 Rg (4×10) @ | 2 Sm (2×5) @ | Fill alpha |
|---|---|---|---|
| `1` | 14,0 | 7,0 | 55% |
| `2` | 21.78,3.22 | 10.89,1.61 | 6% |
| `3` | 25,11 | 12.5,5.5 | 13% |
| `4` | 21.78,18.78 | 10.89,9.39 | 20% |
| `5` | 14,22 | 7,11 | 27% |
| `6` | 6.22,18.78 | 3.11,9.39 | 34% |
| `7` | 3,11 | 1.5,5.5 | 41% |
| `8` | 6.22,3.22 | 3.11,1.61 | 48% |

Spoke centres lie on a circle around the component centre at 45° steps, radius 11 for Rg and 5.5 for Sm (derived: spoke `1` centre (16, 5) against centre (16, 16); Sm (8, 2.5) against (8, 8)). Sm is exactly half of Rg in every value.

## Colours and states

### Linear bar

| Appearance · Context | Track (component frame) | `Color`, Active | `Color`, Inactive |
|---|---|---|---|
| Light · Content Area | fill #000000@6% · border 0.5 inside #000000@7% | style `Content Area/Light/Tracks/Active, Filled, 01 - Idle` · #0088FF {System Colors/Light/8 Blue} | style `Content Area/Light/Tracks/Inactive, Filled, 01 - Idle` · #000000@10% {Fills/Light/1 Primary} |
| Light · Over-Glass | fill #000000@6% (blend plus-darker) · border 0.5 inside #000000@7% · layer blend plus-darker | style `Over-Glass/Light/Tracks/Active, Filled, 01 - Idle` · #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}. Indeterminate names style `Over-Glass/Light/Tracks/Inactive, Filled, 01 - Idle`; Determinate has no style |
| Dark · Content Area | fill #FFFFFF@8% (blend plus-darker) · border 0.5 inside #FFFFFF@4% | style `Content Area/Dark/Tracks/Active, Filled, 01 - Idle` · #0091FF {System Colors/Dark/8 Blue} | #FFFFFF@25%, on a layer whose style is named `Content Area/Light/Tracks/Inactive, Filled, 01 - Idle` |
| Dark · Over-Glass | fill #FFFFFF@8% (blend plus-darker) · border 0.5 inside #FFFFFF@4% · layer blend plus-lighter | style `Over-Glass/Dark/Tracks/Active, Filled, 01 - Idle` · #0A99FF {System Colors/Dark (use plus lighter)/8 Blue} | #FFFFFF@25%, no style |

Indeterminate `Mask` (all): `fill gradient linear {1, 0.5}→{0.0467012099365383, 0.499999999999999} [#000000 0%, #000000@0% 100%]`, corners max. The mask is opaque at the right end and clear at the left end (derived from the gradient's start and end points). It names no shared style. The kit's shared style `Global/Progress Indicator Fill Fade Mask` (`surface-styles.md`) has an extra #000000@40% stop at 39.72% and `blur zoom radius15`, but no layer on this page uses it.

### Circular, Determinate

| Appearance · Context | Component | `Track` | `Filled Track`, Active | `Filled Track`, Inactive |
|---|---|---|---|---|
| Light · Content Area | — | fill #000000@6% · inner-shadow x0 y0 blur0.75 spread0.25 #000000@7% | #0088FF {System Colors/Light/8 Blue}, no style | style `Content Area/Light/Tracks/Inactive, Filled, 01 - Idle` · #000000@10% {Fills/Light/1 Primary} |
| Light · Over-Glass | — | as Light · Content Area; the Active track adds blend plus-darker | style `Over-Glass/Light/Tracks/Active, Filled, 01 - Idle` · #0078F0 | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}, no style |
| Dark · Content Area | — | fill #FFFFFF@8% · inner-shadow x0 y0 blur0 spread0.5 #FFFFFF@4% | style `Content Area/Dark/Tracks/Active, Filled, 01 - Idle` · #0091FF | #FFFFFF@25%, style named `Content Area/Light/Tracks/Inactive, Filled, 01 - Idle` |
| Dark · Over-Glass | blend plus-lighter | as Dark · Content Area | style `Over-Glass/Dark/Tracks/Active, Filled, 01 - Idle` · #0A99FF | #FFFFFF@25%, style named `Over-Glass/Light/Tracks/Inactive, Filled, 01 - Idle` |

### Circular, Indeterminate

| Appearance · Context | Spoke colour (alphas per spoke above) | Active component | Inactive component |
|---|---|---|---|
| Light · Content Area | #000000 | no effect | opacity 50% |
| Light · Over-Glass | #000000 | blend plus-darker | opacity 50%, blend plus-darker |
| Dark · Content Area | #FFFFFF | no effect | opacity 50% |
| Dark · Over-Glass | #FFFFFF | blend plus-darker | opacity 50%, blend plus-darker |

## Text

Not in the kit: no progress component contains text (no percentage or status label). The page text is headings only: SFPro-Bold 60 ("Progress Indicators", "Light", "Dark") and SFPro-Semibold 30 kern −0.46 #000000@50% ("Content Area", "Over-Glass").

## Effects

| Where | Effect |
|---|---|
| Linear track | border 0.5 inside: #000000@7% (Light) or #FFFFFF@4% (Dark) |
| Circular track | inner-shadow x0 y0 blur0.75 spread0.25 #000000@7% (Light); inner-shadow x0 y0 blur0 spread0.5 #FFFFFF@4% (Dark) |
| Indeterminate linear | gradient clipping mask on the `Color` segment (values above) |
| Over-Glass bars | track fill blend plus-darker; component blend plus-darker (Light) or plus-lighter (Dark) |
| Dark Content Area bar | track fill #FFFFFF@8% with blend plus-darker, as stored |
| Inactive circular indeterminate | whole component at opacity 50% |
| Shadows, blurs, glass | none |

## Kit notes

The page has no documentation boards. Its only text is the headings Progress Indicators, Light, Dark, Content Area and Over-Glass.

Kit inconsistencies:

- The Over-Glass linear bars drop the `Linear` level from the name, and their indeterminate states are named `… , Loop 3`.
- Several Dark Inactive fills (#FFFFFF@25%) sit on layers whose style names a Light style (`Content Area/Light/…`, `Over-Glass/Light/…`).
- Dark · Over-Glass circular indeterminate uses blend plus-darker on white spokes. Dark · Over-Glass circular determinate uses plus-lighter.
- Some fills carry no shared style although an equivalent style exists: Light · Content Area circular Active, Light · Over-Glass Inactive (linear determinate and circular) and Dark · Over-Glass linear Inactive.

## Finding it in the spec

| Family | grep |
|---|---|
| Linear, Content Area | `grep -n -A3 '^COMPONENT "Progress Indicators/[^/]*/Content Area/Linear/' specs/progress-indicators.txt` |
| Linear, Over-Glass | `grep -n -A3 '^COMPONENT "Progress Indicators/[^/]*/Over-Glass/\(Determinate\|Indeterminate\)/' specs/progress-indicators.txt` |
| Circular determinate | `grep -n -A2 '^COMPONENT "Progress Indicators/.*/Circular/Determinate/' specs/progress-indicators.txt` |
| Circular indeterminate | `grep -n -A8 '^COMPONENT "Progress Indicators/.*/Circular/Indeterminate/' specs/progress-indicators.txt` |
| Fade masks | `grep -n 'rect "Mask"' specs/progress-indicators.txt` |
