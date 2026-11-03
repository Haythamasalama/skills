# Switches — macOS 27

**Read when:** you need an exact macOS 27 value for switches (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Switches in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/toggles---switches.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

The page has 210 components in two families:

| Family | Name path | Count |
|---|---|---|
| Switch | `Toggles - Switches/<Appearance>/<Context>/<Size>/<State>` | 200 (2 × 2 × 5 × 10) |
| Clicked knob (building block) | `Toggles - Switches/􀻃/<Appearance>/Knob/<Size>` | 10 (2 × 5) |

The building-block names start with the glyph 􀻃 (U+100EC3).

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Context | Content Area, Over-glass (switch only) |
| Size | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State | `<Window>, <Value>, <Interaction>` (10 values, below) |

| Window | Value | Interactions in the kit |
|---|---|---|
| Active | Off | `1 - Idle`, `1 - Clicked`, `4 - Disabled` |
| Active | On | `1 - Idle`, `3 - Clicked`, `4 - Disabled` |
| Inactive | Off | `1 - Idle`, `4 - Disabled` |
| Inactive | On | `1 - Idle`, `4 - Disabled` |

- The Active Off clicked state is named `Active, Off, 1 - Clicked`. Its number is 1, not 3, unlike `Active, On, 3 - Clicked`.
- The switch has no label layer.
- The kit doesn't say what Active and Inactive stand for on this page.

## Anatomy

### Switch

The component itself is the **track**: a capsule (`corners max`) carrying the track style. Its children:

| Layer | Kind | In which states | What it is |
|---|---|---|---|
| `Fill Color` | rect, full track size @0,0, corners max | Active On Idle and Disabled (all contexts); Active On Clicked (Over-glass only) | The blue on-fill, drawn as a layer over the track |
| `Knob` | rect | Every Idle and Disabled state | The idle knob: a capsule with the shared style `Content Area/Light/Knobs - Toggle/01 - Idle` |
| `Knob` | `use` → `Toggles - Switches/􀻃/<Appearance>/Knob/<Size>` | The two Clicked states | The larger clicked knob, a nested instance |

- In Content Area, Active On Clicked has no `Fill Color` layer. The blue is the track's own fill.
- The `Fill Color` layer is listed before the `Knob`.

### Clicked knob (`􀻃/…/Knob/<Size>`)

Three layers, in the order the spec lists them:

| Layer | Shared style | Paint |
|---|---|---|
| `Knob Shadow` | `Content Area/<Appearance>/Knobs - Toggle/03 - Clicked - Shadow` | border 1 inside #000000 · blur gaussian radius 3 · corners max |
| `Knob Glow` | `Content Area/<Appearance>/Knobs - Toggle/03 - Clicked - Glow` | Light: border 1 outside #D9D9D9 (blend plus-darker) + border 0.5 outside #FFFFFF@45%. Dark: border 1 outside #000000@20% (blend plus-darker). Corners 50 |
| `Knob` | none stored | Seven inner shadows and a glass blur; see Effects. Corners 50. No fill |

## Sizes

### Track and idle knob

| Size | Track W × H | Track corners | Knob W × H | Knob @ (Off) | Knob @ (On) |
|---|---|---|---|---|---|
| 5 XL | 80 × 36 | max | 47 × 30 | 3, 3 | 30, 3 |
| 4 Lg | 64 × 28 | max | 38 × 24 | 2, 2 | 24, 2 |
| 3 Rg | 54 × 24 | max | 32 × 20 | 2, 2 | 20, 2 |
| 2 Sm | 44 × 20 | max | 26 × 16 | 2, 2 | 16, 2 |
| 1 Mn | 36 × 16 | max | 21 × 13 | 1.5, 1.5 | 13.5, 1.5 |

Knob corners:

| Appearance, context | Knob corners |
|---|---|
| Dark, Content Area | max, smoothing 0.6 |
| Light, Content Area | 50, smoothing 0.6 |
| Over-glass, both appearances | 50, smoothing 0.6 |

Derived values:

- Knob inset = knob x in the Off state: 3 (XL), 2 (Lg, Rg, Sm), 1.5 (Mn). The vertical inset is the same.
- Knob travel = On x − Off x: XL 27, Lg 22, Rg 18, Sm 14, Mn 12. It equals track width − knob width − 2 × inset (Rg: 54 − 32 − 4 = 18).
- The knob is wider than it is tall: width ÷ height = 47/30, 38/24, 32/20, 26/16 and 21/13.
- Geometry is identical across appearance, context and state within a size (checked across all 40 switches per size).

### Clicked knob

The clicked knob instance sits over the track and overflows it:

| Size | Instance W × H | @ (Off) | @ (On) | Master used, Light | Master used, Dark |
|---|---|---|---|---|---|
| 5 XL | 73 × 46 | −9, −5 | 16, −5 | Knob/5 XL (73 × 45) | Knob/5 XL (73 × 45) |
| 4 Lg | 59 × 37 | −8.5, −4.5 | 13.5, −4.5 | Knob/4 Lg | Knob/4 Lg |
| 3 Rg | 50 × 31 | −7, −3.5 | 11, −3.5 | Knob/3 Rg | Knob/2 Sm, resized to 50 × 31 |
| 2 Sm | 40 × 26 | −5, −3 | 9, −3 | Knob/2 Sm | Knob/3 Rg, resized to 40 × 26 |
| 1 Mn | 33 × 20 | −5, −2 | 8, −2 | Knob/1 Mn | Knob/1 Mn |

The same masters are used in Content Area and Over-glass.

The clicked knob masters:

| Master | W × H | Knob Shadow, Light | Knob Shadow, Dark | Knob Glow | Knob glass distortion / depth (Light) | (Dark) |
|---|---|---|---|---|---|---|
| Knob/5 XL | 73 × 45 | 73 × 45 @0,9 | 71 × 44 @1,9 | 73 × 45 @0,0 | 0.15 / 0.45 | 0.15 / 0.45 |
| Knob/4 Lg | 59 × 37 | 59 × 37 @0,9 | 57 × 36 @1,9 | 59 × 37 @0,0 | 0.15 / 0.46 | 0.15 / 0.46 |
| Knob/3 Rg | 50 × 31 | 50 × 31 @0,9 | 48 × 30 @1,9 | 50 × 31 @0,0 | 0.12 / 0.4 | 0.12 / 0.4 |
| Knob/2 Sm | 40 × 26 | 40 × 26 @0,9 | 38 × 25 @1,9 | 40 × 26 @0,0 | 0.13 / 0.4 | 0.13 / 0.39 |
| Knob/1 Mn | 33 × 20 | 33 × 20 @0,9 | 31 × 19 @1,9 | 33 × 20 @0,0 | 0.08 / 0.3 | 0.08 / 0.3 |

Derived values:

- Clicked ÷ idle knob size: Rg 50/32 wide and 31/20 tall; XL 73/47 and 46/30.
- The clicked knob's vertical centre matches the idle knob's in every size (Rg: −3.5 + 31 ÷ 2 = 12 = 2 + 20 ÷ 2).
- Its horizontal centre matches in Sm, Rg and Lg (Rg Off: −7 + 25 = 18 = 2 + 16). It doesn't in Mn (0.5 to the left when Off, 0.5 to the right when On) or XL (1 to the right when Off, 1 to the left when On).

## Colours and states

The tables give the paint stored on each layer. "Track" is the component layer. Shared track and knob styles are in `control-styles-content-area.md` / `control-styles-over-glass.md`.

- Values are the same in every size (each appearance, context and state was checked across all five sizes).
- The idle knob uses the style `Content Area/Light/Knobs - Toggle/01 - Idle` in all four appearance and context pairs: fill #FFFFFF · shadow x0 y3 blur36 spread0 #000000@5% · corners 50.
- Dark, Content Area overrides that knob's fill to #FFFFFF@85% and its corners to max.
- Knob positions: Off states have the knob at the Off x; On states at the On x; Clicked states use the clicked knob instance.

### Light, Content Area

Idle knob: fill #FFFFFF, shadow x0 y3 blur36 spread0 #000000@5%, corners 50.

| State | Track style | Track fill | Fill Color layer | Knob |
|---|---|---|---|---|
| Active, Off, Idle | Content Area/Light/Tracks/Active, Unfilled, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | idle |
| Active, Off, Clicked | Content Area/Light/Tracks/Active, Unfilled, 03 - Clicked | #000000@19% | — | clicked, Light master |
| Active, Off, Disabled | Content Area/Light/Tracks/Active, Unfilled, 04 - Disabled | #000000@10% {Fills/Light/1 Primary} | — | idle |
| Active, On, Idle | none | none | Content Area/Light/Tracks/Active, Filled, 01 - Idle · #0088FF {System Colors/Light/8 Blue} | idle |
| Active, On, Clicked | Content Area/Light/Tracks/Active, Filled, 03 - Clicked | #0088FF {System Colors/Light/8 Blue} + #000000@8% {Fills/Light/2 Secondary} | — | clicked, Light master |
| Active, On, Disabled | none | none | Content Area/Light/Tracks/Active, Filled, 01 - Idle · #0088FF | idle |
| Inactive, Off, Idle | Content Area/Light/Tracks/Inactive, Unfilled, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | idle |
| Inactive, Off, Disabled | Content Area/Light/Tracks/Inactive, Unfilled, 04 - Disabled | #000000@10% {Fills/Light/1 Primary} | — | idle |
| Inactive, On, Idle | Content Area/Light/Tracks/Inactive, Filled, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | idle |
| Inactive, On, Disabled | Content Area/Light/Tracks/Inactive, Filled, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | — | idle |

### Light, Over-glass

Idle knob: fill #FFFFFF, shadow x0 y3 blur36 spread0 #000000@5%, corners 50.

| State | Track style | Track fill and blend | Fill Color layer | Knob |
|---|---|---|---|---|
| Active, Off, Idle | Over-Glass/Light/Tracks/Active, Unfilled | #000000@20% (blend overlay) + #000000@7% (blend plus-darker) | — | idle |
| Active, Off, Clicked | none stored | #000000@20% (blend overlay) + #000000@7% (blend plus-darker); layer blend plus-darker | — | clicked, Light master |
| Active, Off, Disabled | none stored | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}; layer blend plus-darker | — | idle |
| Active, On, Idle | none | none | Over-Glass/Light/Tracks/Active, Filled, 01 - Idle · #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} | idle |
| Active, On, Clicked | none | none; layer blend plus-darker | Over-Glass/Light/Tracks/Active, Filled, 03 - Clicked · #0078F0 + #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} | clicked, Light master |
| Active, On, Disabled | none | none | Over-Glass/Light/Tracks/Active, Filled, 01 - Idle · #0078F0 | idle |
| Inactive, Off, Idle | Over-Glass/Light/Tracks/Inactive, Unfilled | #000000@20% (blend overlay) + #000000@7% (blend plus-darker); layer blend plus-darker | — | idle |
| Inactive, Off, Disabled | Over-Glass/Light/Tracks/Inactive, Filled, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}; layer blend plus-darker | — | idle |
| Inactive, On, Idle | Over-Glass/Light/Tracks/Inactive, Filled, 01 - Idle | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}; layer blend plus-darker | — | idle |
| Inactive, On, Disabled | Over-Glass/Light/Tracks/Inactive, Filled, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}; layer blend plus-darker | — | idle |

### Dark, Content Area

Idle knob: style `Content Area/Light/Knobs - Toggle/01 - Idle`, fill #FFFFFF@85%, shadow x0 y3 blur36 spread0 #000000@5%, corners max.

| State | Track style | Track fill | Fill Color layer | Knob |
|---|---|---|---|---|
| Active, Off, Idle | Content Area/Dark/Tracks/Active, Unfilled, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | — | idle |
| Active, Off, Clicked | Content Area/Dark/Tracks/Active, Unfilled, 03 - Clicked | #FFFFFF@19% | — | clicked, Dark master |
| Active, Off, Disabled | Content Area/Dark/Tracks/Active, Unfilled, 04 - Disabled | #FFFFFF@10% {Fills/Dark/1 Primary} | — | idle |
| Active, On, Idle | Content Area/Dark/Tracks/Active, Filled, 01 - Idle | #0091FF {System Colors/Dark/8 Blue} | Content Area/Light/Tracks/Active, Filled, 01 - Idle · #0088FF {System Colors/Light/8 Blue}, covering the track | idle |
| Active, On, Clicked | Content Area/Dark/Tracks/Active, Filled, 03 - Clicked | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@8% {Fills/Dark/2 Secondary} | — | clicked, Dark master |
| Active, On, Disabled | none | none | Content Area/Light/Tracks/Active, Filled, 01 - Idle · #0088FF {System Colors/Light/8 Blue} | idle |
| Inactive, Off, Idle | Content Area/Dark/Tracks/Inactive, Unfilled, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | — | idle |
| Inactive, Off, Disabled | Content Area/Dark/Tracks/Inactive, Unfilled, 04 - Disabled | #FFFFFF@10% {Fills/Dark/1 Primary} | — | idle |
| Inactive, On, Idle | Content Area/Dark/Tracks/Inactive, Filled, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | — | idle |
| Inactive, On, Disabled | Content Area/Dark/Tracks/Inactive, Filled, 04 - Disabled | #FFFFFF@5% {Fills/Dark/3 Tertiary} | — | idle |

### Dark, Over-glass

Idle knob: fill #FFFFFF, shadow x0 y3 blur36 spread0 #000000@5%, corners 50.

| State | Track style | Track fill and blend | Fill Color layer | Knob |
|---|---|---|---|---|
| Active, Off, Idle | Over-Glass/Dark/Tracks/Active, Unfilled | #FFFFFF@4% (blend overlay) + #FFFFFF@3% (blend plus-lighter); layer blend plus-lighter | — | idle |
| Active, Off, Clicked | none stored | #FFFFFF@19%; layer blend plus-lighter | — | clicked, Dark master |
| Active, Off, Disabled | none stored | #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary}; layer blend plus-lighter | — | idle |
| Active, On, Idle | none | none | Over-Glass/Dark/Tracks/Active, Filled, 01 - Idle · #0A99FF {System Colors/Dark (use plus lighter)/8 Blue} | idle |
| Active, On, Clicked | none | none | Over-Glass/Dark/Tracks/Active, Filled, 03 - Clicked · #0A99FF + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} | clicked, Dark master |
| Active, On, Disabled | none | none | Over-Glass/Dark/Tracks/Active, Filled, 01 - Idle · #0A99FF | idle |
| Inactive, Off, Idle | Over-Glass/Dark/Tracks/Inactive, Unfilled | #FFFFFF@4% (blend overlay) + #FFFFFF@3% (blend plus-lighter); layer blend plus-lighter | — | idle |
| Inactive, Off, Disabled | none stored | #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary}; layer blend plus-lighter | — | idle |
| Inactive, On, Idle | Over-Glass/Dark/Tracks/Inactive, Filled, 01 - Idle | #FFFFFF@22% | — | idle |
| Inactive, On, Disabled | Over-Glass/Dark/Tracks/Inactive, Filled, 04 - Disabled | #FFFFFF@10% | — | idle |

### What changes for Disabled

From the tables above:

- **Active, On, Disabled** has the same layers and values as Active, On, Idle in all four appearance and context pairs. The kit stores no opacity or dimmed fill for it.
- **Active, Off, Disabled** matches Active, Off, Idle in Content Area. On Over-glass it trades the overlay track for a flat fill: Light #000000@15%, Dark #FFFFFF@14%.
- **Inactive, On, Disabled** lightens the track in every pair. Content Area: Tertiary instead of Primary. Over-glass Light: #000000@5% instead of 15%. Over-glass Dark: #FFFFFF@10% instead of 22%.
- **Inactive, Off, Disabled** differs from Idle only on Over-glass.
- No switch uses the kit's `Knobs - Toggle/04 - Disabled` or `Tracks/Active, Filled, 04 - Disabled` styles, though both are in `control-styles-content-area.md` / `control-styles-over-glass.md`.

## Effects

| Layer | Effect |
|---|---|
| Idle knob (all) | shadow x0 y3 blur36 spread0 #000000@5% |
| Clicked `Knob Shadow` | border 1 inside #000000 · blur gaussian radius 3 |
| Clicked `Knob Glow`, Light | border 1 outside #D9D9D9 (blend plus-darker) · border 0.5 outside #FFFFFF@45% |
| Clicked `Knob Glow`, Dark | border 1 outside #000000@20% (blend plus-darker) |
| Clicked `Knob`, Light and Dark | See the list below |
| Track, Over-glass | Layer blend plus-darker (Light) or plus-lighter (Dark) in most Off and Inactive states. Overlay fills on the Unfilled styles |

The clicked `Knob` layer has the same effects in Light and Dark. Only distortion and depth vary by size (see the masters table):

- inner-shadow x0 y−4 blur0.5 spread−4 #666666 (blend plus-lighter)
- inner-shadow x0 y4 blur0.5 spread−4 #666666 (blend plus-lighter)
- inner-shadow x0 y−1 blur0 spread−0.25 #171717 (blend plus-lighter)
- inner-shadow x0 y1 blur0 spread−0.25 #171717 (blend plus-lighter)
- inner-shadow x0 y20 blur20 spread−20 #F2F2F2 (blend plus-darker)
- inner-shadow x0 y−40 blur10 spread−40 #333333 (blend plus-lighter)
- inner-shadow x0 y40 blur10 spread−40 #333333 (blend plus-lighter)
- blur glass radius0 saturation1 brightness1 distortion 0.08–0.15 depth 0.3–0.46 chromatic0.4

The layer has no style link. Its values match the shared style `Content Area/Light/Knobs - Toggle/03 - Clicked` in `specs/tokens.txt` except for distortion and depth (the style has 0.12 / 0.3).

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are headings:

- "Toggles", with "Light" and "Dark" headings.
- The section labels "Content Area" and "Over-Glass", each split into "Active" and "Inactive".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All switches | `grep -n '^COMPONENT "Toggles - Switches/\(Light\|Dark\)/' specs/toggles---switches.txt` |
| Clicked knob masters | `grep -n -A3 '^COMPONENT "Toggles - Switches/􀻃/' specs/toggles---switches.txt` |
| One appearance, context and size | `grep -n -A3 '^COMPONENT "Toggles - Switches/Dark/Over-glass/3 Rg/' specs/toggles---switches.txt` |
| Clicked states and the master each uses | `grep -n -A2 'Clicked"' specs/toggles---switches.txt \| grep 'use "Knob"'` |
| On-fill layers | `grep -n 'rect "Fill Color"' specs/toggles---switches.txt` |
| Track styles in use | `grep -o '^COMPONENT.*style="[^"]*"' specs/toggles---switches.txt \| grep -o 'style="[^"]*"' \| sort \| uniq -c` |
