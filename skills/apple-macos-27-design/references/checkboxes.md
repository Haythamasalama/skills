# Checkboxes — macOS 27

**Read when:** you need an exact macOS 27 value for checkboxes (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Checkboxes in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/toggles---checkboxes.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, **Toggles - Checkboxes**, with 300 components (2 × 2 × 5 × 15).

Name path: `Toggles - Checkboxes/<Appearance>/<Context>/<Size>/<State>`

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Context | Content Area, Over-glass |
| Size | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State | `<Window>, <Value>, <Interaction>` (15 values) |

The State value combines three parts:

| Part | Values |
|---|---|
| Window | Active, Inactive |
| Value | Unchecked, Mixed, Checked |
| Interaction | 1 - Idle, 3 - Clicked, 4 - Disabled |

- Active has all three interactions: 3 values × 3 interactions = 9 states.
- Inactive has only Idle and Disabled: 3 × 2 = 6 states. No Inactive Clicked component exists.
- Example: `Toggles - Checkboxes/Light/Content Area/3 Rg/Active, Checked, 1 - Idle`.
- The kit doesn't say what Active and Inactive stand for on this page.

## Anatomy

Every component is a horizontal auto-layout row (`stack h`) with two children:

| Layer | Kind | What it is |
|---|---|---|
| `Checkbox` | group | The box: a rounded square with the state's shared style |
| `Check` | path, inside `Checkbox` | The tick, in Checked states only. A vector path, not an SF Symbol |
| `Dash` | rect, inside `Checkbox` | The bar, in Mixed states only. Corners 5, smoothing 0.6 |
| `Checkbox Label` | text | The label, content "Checkbox Label", left-aligned |

- Unchecked states have no glyph layer.
- The page uses no nested component instances (`use`).
- The box always comes first (x 0). The label follows after the stack gap.

## Sizes

Box, label and row. The component width hugs the sample label "Checkbox Label".

| Size | Component W × H | Stack | Box W × H | Box @ | Box corners | Label font | Label frame | Label @ |
|---|---|---|---|---|---|---|---|---|
| 5 XL | 124 × 36 | h, gap 7, pad 9,0,9,0 | 18 × 18 | 0, 9 | 6.5, smoothing 0.6 | SFPro-Medium 13 | 99 × 15 | 25, 10.5 |
| 4 Lg | 122 × 28 | h, gap 5, pad 5,0,5,0 | 18 × 18 | 0, 5 | 6.5, smoothing 0.6 | SFPro-Medium 13 | 99 × 15 | 23, 6.5 |
| 3 Rg | 120 × 24 | h, gap 5, pad 4,0,4,0 | 16 × 16 | 0, 4 | 5.5, smoothing 0.6 | SFPro-Medium 13 | 99 × 15 | 21, 4.5 |
| 2 Sm | 104 × 18 | h, gap 4, pad 2,0,2,0 | 14 × 14 | 0, 2 | 4.5, smoothing 0.6 | SFPro-Medium 11 | 86 × 13 | 18, 2.5 |
| 1 Mn | 94 × 14 | h, gap 3, pad 1,0,1,0 | 12 × 12 | 0, 1 | 3.5, smoothing 0.6 | SFPro-Medium 10 | 79 × 12 | 15, 1 |

Glyphs, positioned inside the box:

| Size | Check W × H | Check @ | Dash W × H | Dash @ |
|---|---|---|---|---|
| 5 XL | 11.72 × 11.3 | 3.14, 3.35 | 8 × 2 | 5, 8 |
| 4 Lg | 11.72 × 11.3 | 3.14, 3.35 | 8 × 2 | 5, 8 |
| 3 Rg | 9.31 × 8.93 | 3.35, 3.54 | 6.5 × 2 | 4.75, 7 |
| 2 Sm | 9.31 × 8.93 | 2.35, 2.54 | 6.5 × 2 | 3.75, 6 |
| 1 Mn | 7.87 × 7.55 | 2.06, 2.22 | 5.5 × 1.7 | 3.25, 5.15 |

Derived values:

- Label x = box width + stack gap (XL: 18 + 7 = 25; Mn: 12 + 3 = 15).
- Row height = box height + top and bottom padding (XL: 18 + 9 + 9 = 36).
- The label is vertically centred in the row: label y = (row height − label frame height) ÷ 2 (XL: (36 − 15) ÷ 2 = 10.5).
- Box corner radius = box side ÷ 2 − 2.5 in every size (18 → 6.5, 16 → 5.5, 14 → 4.5, 12 → 3.5).
- Check and Dash are centred in the box: glyph x = (box − glyph width) ÷ 2 (XL Check: (18 − 11.72) ÷ 2 = 3.14; Mn Dash: (12 − 5.5) ÷ 2 = 3.25).
- Horizontal padding is 0 at every size, so the box touches the row's left edge.
- Geometry is identical across appearance, context and state within a size (checked across all 60 components per size).

## Colours and states

The shared styles are in `control-styles-content-area.md` / `control-styles-over-glass.md` (`…/Controls/…`) and `surface-styles.md` (`Global/Glyphs/…`). The fill column is the fill stored on the box layer.

- Values are the same in every size: each appearance, context and state was grouped across all five sizes, and no size differs.
- Mixed and Checked use the same box style and the same glyph style in every appearance and context. Only the glyph layer differs (`Dash` or `Check`).
- "On" in a style name means Checked or Mixed; "Off" means Unchecked.

### Light, Content Area

Labels use blend plus-darker in every state.

| State | Box style | Box fill and effects | Glyph style · fill | Label colour |
|---|---|---|---|---|
| Active, Unchecked, Idle | Content Area/Light/Controls/Active, Off, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Active, Unchecked, Clicked | Content Area/Light/Controls/Active, Off, 03 - Clicked | #000000@19%, layer blend plus-darker | — | #363636 (as above) |
| Active, Unchecked, Disabled | Content Area/Light/Controls/Active, Off, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | — | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} |
| Active, Checked / Mixed, Idle | Content Area/Light/Controls/Active, On, 01 - Idle | #0088FF {System Colors/Light/8 Blue} | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #363636 |
| Active, Checked / Mixed, Clicked | Content Area/Light/Controls/Active, On, 03 - Clicked | #0091FF {System Colors/Dark/8 Blue} + #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #363636 |
| Active, Checked / Mixed, Disabled | Content Area/Light/Controls/Active, On, 04 - Disabled | #0088FF {System Colors/Light/8 Blue} + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker), layer opacity 45% | Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% | #B2B2B2 |
| Inactive, Unchecked, Idle | Content Area/Light/Controls/Inactive, Off, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | #363636 |
| Inactive, Unchecked, Disabled | Content Area/Light/Controls/Inactive, Off, 04 - Disabled | #000000@3% {Fills/Light/4 Quatenary} | — | #B2B2B2 |
| Inactive, Checked / Mixed, Idle | Content Area/Light/Controls/Inactive, On, 01 - Idle | #000000@14% | Global/Glyphs/Light/Neutral - 1 Idle · #000000@70%, blend plus-darker | #363636 |
| Inactive, Checked / Mixed, Disabled | Content Area/Light/Controls/Inactive, On, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | Global/Glyphs/Light/Neutral - 4 Disabled · #000000@22%, blend plus-darker | #B2B2B2 |

### Light, Over-glass

Labels are the same as in Light, Content Area: #363636 for Idle and Clicked, #B2B2B2 for Disabled, blend plus-darker.

| State | Box style | Box fill and effects | Glyph style · fill |
|---|---|---|---|
| Active, Unchecked, Idle | Over-Glass/Light/Controls/Active, Off, 01 - Idle | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}, layer blend plus-darker | — |
| Active, Unchecked, Clicked | Over-Glass/Light/Controls/Active, Off, 03 - Clicked | #000000@19%, layer blend plus-darker | — |
| Active, Unchecked, Disabled | Over-Glass/Light/Controls/Active, Off, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}; inner-shadow x0 y0 blur1 spread0 #000000@2% (blend plus-darker); layer blend plus-darker | — |
| Active, Checked / Mixed, Idle | Over-Glass/Light/Controls/Active, On, 01 - Idle | #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked / Mixed, Clicked | Over-Glass/Light/Controls/Active, On, 03 - Clicked | #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked / Mixed, Disabled | Over-Glass/Light/Controls/Active, On, 04 - Disabled | #0078F0 + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker), layer opacity 45% | Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% |
| Inactive, Unchecked, Idle | Over-Glass/Light/Controls/Inactive, Off, 01 - Idle | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}, layer blend plus-darker | — |
| Inactive, Unchecked, Disabled | Over-Glass/Light/Controls/Inactive, Off, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | — |
| Inactive, Checked / Mixed, Idle | Over-Glass/Light/Controls/Inactive, On, 01 - Idle | #000000@15%, layer blend plus-darker | Global/Glyphs/Light/Neutral - 1 Idle · #000000@70%, blend plus-darker |
| Inactive, Checked / Mixed, Disabled | Over-Glass/Light/Controls/Inactive, On, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}, layer blend plus-darker | Global/Glyphs/Light/Neutral - 4 Disabled · #000000@22%, blend plus-darker |

### Dark, Content Area

Labels use blend plus-darker in every state, as stored.

| State | Box style | Box fill and effects | Glyph style · fill | Label colour |
|---|---|---|---|---|
| Active, Unchecked, Idle | Content Area/Dark/Controls/Active, Off, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} (fill blend plus-darker) | — | #FFFFFF {Labels/Dark/1 Primary} |
| Active, Unchecked, Clicked | Content Area/Dark/Controls/Active, Off, 03 - Clicked | #FFFFFF@19% | — | #FFFFFF {Labels/Dark/1 Primary} |
| Active, Unchecked, Disabled | Content Area/Dark/Controls/Active, Off, 04 - Disabled | #FFFFFF@5% {Fills/Dark/3 Tertiary}, layer blend plus-darker | — | #FFFFFF@25% {Labels/Dark/3 Tertiary} |
| Active, Checked / Mixed, Idle | Content Area/Dark/Controls/Active, On, 01 - Idle | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #FFFFFF |
| Active, Checked / Mixed, Clicked | Content Area/Dark/Controls/Active, On, 03 - Clicked | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #FFFFFF |
| Active, Checked / Mixed, Disabled | Content Area/Dark/Controls/Active, On, 04 - Disabled | #0091FF + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter), layer opacity 45% | Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% | #FFFFFF@25% |
| Inactive, Unchecked, Idle | Content Area/Dark/Controls/Inactive, Off, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | — | #FFFFFF |
| Inactive, Unchecked, Disabled | Content Area/Dark/Controls/Inactive, Off, 04 - Disabled | #FFFFFF@3% {Fills/Dark/4 Quatenary} | — | #FFFFFF@25% |
| Inactive, Checked / Mixed, Idle | Content Area/Dark/Controls/Inactive, On, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | Global/Glyphs/Dark/Neutral - 1 Idle · #FFFFFF@70%, blend plus-lighter | #FFFFFF |
| Inactive, Checked / Mixed, Disabled | Content Area/Dark/Controls/Inactive, On, 04 - Disabled | #FFFFFF@3% {Fills/Dark/4 Quatenary} | Global/Glyphs/Dark/Neutral - 4 Disabled · #FFFFFF@22%, blend plus-lighter | #FFFFFF@25% |

### Dark, Over-glass

Labels use blend plus-lighter in every state.

| State | Box style | Box fill and effects | Glyph style · fill | Label colour |
|---|---|---|---|---|
| Active, Unchecked, Idle | Over-Glass/Dark/Controls/Active, Off, 01 - Idle | #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (fill blend plus-darker), layer blend plus-lighter | — | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} |
| Active, Unchecked, Clicked | Over-Glass/Dark/Controls/Active, Off, 03 - Clicked | #FFFFFF@19%, layer blend plus-lighter | — | #FFFFFF@96% |
| Active, Unchecked, Disabled | Over-Glass/Dark/Controls/Active, Off, 04 - Disabled | #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (fill blend plus-darker), layer blend plus-lighter | — | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} |
| Active, Checked / Mixed, Idle | Over-Glass/Dark/Controls/Active, On, 01 - Idle | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter) | Global/Glyphs/Dark/Primary - 1 Idle · #FFFFFF | #FFFFFF@96% |
| Active, Checked / Mixed, Clicked | Over-Glass/Dark/Controls/Active, On, 03 - Clicked | #0091FF + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (blend plus-lighter) | Global/Glyphs/Dark/Primary - 1 Idle · #FFFFFF | #FFFFFF@96% |
| Active, Checked / Mixed, Disabled | Over-Glass/Dark/Controls/Active, On, 04 - Disabled | #0091FF + #FFFFFF@5% (blend plus-lighter), layer opacity 45% | Global/Glyphs/Dark/Primary - 4 Disabled · #FFFFFF, opacity 50% | #4C4C4C |
| Inactive, Unchecked, Idle | Over-Glass/Dark/Controls/Active, On, 01 - Idle (see note) | #0091FF + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter) | — | #FFFFFF@96% |
| Inactive, Unchecked, Disabled | Over-Glass/Dark/Controls/Active, On, 01 - Idle (see note) | as above | — | #4C4C4C |
| Inactive, Checked / Mixed, Idle | Over-Glass/Dark/Controls/Active, On, 01 - Idle (see note) | as above | Global/Glyphs/Dark/Neutral - 1 Idle · #FFFFFF@70%, blend plus-lighter | #FFFFFF@96% |
| Inactive, Checked / Mixed, Disabled | Over-Glass/Dark/Controls/Active, On, 01 - Idle (see note) | as above | Global/Glyphs/Dark/Neutral - 4 Disabled · #FFFFFF@22%, blend plus-lighter | #4C4C4C |

Note: all six Dark, Over-glass, Inactive components carry the blue `Active, On, 01 - Idle` style on the box, including Unchecked and Disabled. The shared styles `Over-Glass/Dark/Controls/Inactive, …` exist in `control-styles-content-area.md` / `control-styles-over-glass.md`, and the radio buttons page uses them for the same states. The kit is inconsistent here.

## Text

| Size | Font | Size (pt) | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| 5 XL, 4 Lg, 3 Rg | SFPro-Medium | 13 | Not in the kit | Not in the kit | left |
| 2 Sm | SFPro-Medium | 11 | Not in the kit | Not in the kit | left |
| 1 Mn | SFPro-Medium | 10 | Not in the kit | Not in the kit | left |

- No `lh` or `kern` value is stored on any label (checked on all 300 labels).
- No shared text style is linked. The label is SFPro-Medium, while every style in `text-styles.md` uses Regular, Semibold, Bold or Heavy.
- Label colours per state are in the tables above:

| Appearance, context | Idle and Clicked | Disabled | Blend |
|---|---|---|---|
| Light, both contexts | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | plus-darker |
| Dark, Content Area | #FFFFFF {Labels/Dark/1 Primary} | #FFFFFF@25% {Labels/Dark/3 Tertiary} | plus-darker |
| Dark, Over-glass | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | plus-lighter |

## Effects

The page has no drop shadows, blurs or glass. Its only effects are blend modes, opacity and one inner shadow:

| Where | Effect |
|---|---|
| Box, Active Checked / Mixed Disabled (all appearances and contexts) | layer opacity 45% |
| Glyph, Active Checked / Mixed Disabled | `Primary - 4 Disabled` style: #FFFFFF at opacity 50% |
| Box, Light Over-glass Active Unchecked Disabled | inner-shadow x0 y0 blur1 spread0 #000000@2% (blend plus-darker) |
| Glyph, Inactive Checked / Mixed (Neutral styles) | Light: blend plus-darker. Dark: blend plus-lighter |
| Box blue fills, Active Checked / Mixed | Top fill layer uses blend plus-darker (Light) or plus-lighter (Dark) |
| Box, Over-glass Light | Most states use layer blend plus-darker |
| Box, Over-glass Dark, Active Unchecked | layer blend plus-lighter |
| Labels | plus-darker (Light; Dark Content Area), plus-lighter (Dark Over-glass) |

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are headings:

- "Checkboxes", with "Light" and "Dark" headings.
- The section labels "Content Area" and "Over-Glass".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All checkbox components | `grep -n '^COMPONENT "Toggles - Checkboxes/' specs/toggles---checkboxes.txt` |
| One appearance and context | `grep -n '^COMPONENT "Toggles - Checkboxes/Light/Over-glass/' specs/toggles---checkboxes.txt` |
| One size | `grep -n '^COMPONENT "Toggles - Checkboxes/.*/3 Rg/' specs/toggles---checkboxes.txt` |
| One state, with its layers | `grep -n -A3 'Active, Checked, 3 - Clicked"' specs/toggles---checkboxes.txt` |
| Box styles in use | `grep -o 'group "Checkbox".*style="[^"]*"' specs/toggles---checkboxes.txt \| sort \| uniq -c` |
| Glyph layers | `grep -n 'path "Check"\|rect "Dash"' specs/toggles---checkboxes.txt` |
