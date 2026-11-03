# Radio Buttons — macOS 27

**Read when:** you need an exact macOS 27 value for radio Buttons (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Radio Buttons in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/toggles---radio-buttons.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, **Toggles - Radio Buttons**, with 300 components (2 × 2 × 5 × 15).

Name path: `Toggles - Radio Buttons/<Appearance>/<Context>/<Size>/<State>`

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Context | Content Area, Over-glass |
| Size | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State | `<Window>, <Value> - <Interaction>` (15 values) |

The State value combines three parts:

| Part | Values |
|---|---|
| Window | Active, Inactive |
| Value | Unchecked, Mixed, Checked |
| Interaction | 1 - Idle, 3 - Clicked, 4 - Disabled |

- Active has all three interactions: 9 states. Inactive has only Idle and Disabled: 6 states.
- Example: `Toggles - Radio Buttons/Dark/Over-glass/2 Sm/Active, Checked - 3 - Clicked`.
- The state names use ` - ` before the interaction, unlike the checkbox page, which uses `, `.
- The kit has a Mixed radio button, drawn with a dash.
- The kit doesn't say what Active and Inactive stand for on this page.

## Anatomy

Every component is a horizontal auto-layout row (`stack h`):

| Layer | Kind | What it is |
|---|---|---|
| `Radio Button` | group | The circle, with corners 100, smoothing 0.6 |
| `Dot` | oval, inside `Radio Button` | The centre dot, in Checked states only |
| `Dash` | rect, inside `Radio Button` | The bar, in Mixed states only. Corners 5, smoothing 0.6 |
| `Stack` | group, `stack v gap0` | Holds the label and gives it a top padding |
| `Radio Button Label` | text, inside `Stack` | Content "Radio Button Label", left-aligned |

- Unchecked states have no glyph layer.
- The page uses no nested component instances (`use`).

## Sizes

The component width hugs the sample label "Radio Button Label".

| Size | Component W × H | Row stack | Circle W × H | Circle @ | Label font | Stack W × H @ | Stack padding (top) | Label frame @ (in Stack) |
|---|---|---|---|---|---|---|---|---|
| 5 XL | 143 × 36 | h, gap 7, pad 9,0,9,0 | 18 × 18 | 0, 9 | SFPro-Medium 13 | 118 × 17 @ 25, 9 | 2 | 118 × 15 @ 0, 2 |
| 4 Lg | 141 × 28 | h, gap 5, pad 5,0,5,0 | 18 × 18 | 0, 5 | SFPro-Medium 13 | 118 × 16.5 @ 23, 5 | 1.5 | 118 × 15 @ 0, 1.5 |
| 3 Rg | 137 × 24 | h, gap 3, pad 4,0,4,0 | 16 × 16 | 0, 4 | SFPro-Medium 13 | 118 × 15.5 @ 19, 4 | 0.5 | 118 × 15 @ 0, 0.5 |
| 2 Sm | 119 × 18 | h, gap 3, pad 2,0,2,0 | 14 × 14 | 0, 2 | SFPro-Medium 11 | 102 × 13.5 @ 17, 2 | 0.5 | 102 × 13 @ 0, 0.5 |
| 1 Mn | 109 × 14 | h, gap 3, pad 1,0,1,0 | 12 × 12 | 0, 1 | SFPro-Medium 10 | 94 × 12 @ 15, 1 | 0 | 94 × 12 @ 0, 0 |

Glyphs, positioned inside the circle:

| Size | Dot W × H | Dot @ | Dash W × H | Dash @ |
|---|---|---|---|---|
| 5 XL | 5 × 5 | 6.5, 6.5 | 8 × 2 | 5, 8 |
| 4 Lg | 5 × 5 | 6.5, 6.5 | 8 × 2 | 5, 8 |
| 3 Rg | 4.8 × 4.8 | 5.6, 5.6 | 6.5 × 2 | 4.75, 7 |
| 2 Sm | 4.8 × 4.8 | 4.6, 4.6 | 6.5 × 2 | 3.75, 6 |
| 1 Mn | 4 × 4 | 4, 4 | 5.5 × 1.7 | 3.25, 5.15 |

Derived values:

- Label stack x = circle width + row gap (XL: 18 + 7 = 25; Rg: 16 + 3 = 19).
- Label y in the row = Stack y + Stack top padding: XL 11, Lg 6.5, Rg 4.5, Sm 2.5, Mn 1.
- Dot and Dash are centred in the circle: x = (circle − glyph) ÷ 2 (Rg Dot: (16 − 4.8) ÷ 2 = 5.6).
- The circle is a fully rounded group: corners 100 on circles of 12–18 pt.
- Geometry is identical across appearance, context and state within a size (checked across all 60 components per size).

Compared with the checkboxes page:

- The circle and glyph boxes have the same sizes and positions.
- The row gap is smaller in 3 Rg (3 here, 5 there) and 2 Sm (3 here, 4 there).
- At 5 XL the label sits 0.5 lower: y 11 here, 10.5 there.

## Colours and states

The shared styles are in `control-styles-content-area.md` / `control-styles-over-glass.md` (`…/Controls/…`) and `surface-styles.md` (`Global/Glyphs/…`). The fill column is the fill stored on the circle layer.

- Values are the same in every size (each appearance, context and state was checked across all five sizes).
- "On" in a style name is used for both Checked and Mixed; "Off" for Unchecked.
- Checked and Mixed share the circle style. Their glyph styles differ only in Active Disabled, as the tables show.

### Light, Content Area

Labels use blend plus-darker in every state.

| State | Circle style | Circle fill and effects | Glyph style · fill | Label colour |
|---|---|---|---|---|
| Active, Unchecked, Idle | Content Area/Light/Controls/Active, Off, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Active, Unchecked, Clicked | Content Area/Light/Controls/Active, Off, 03 - Clicked | #000000@19%, layer blend plus-darker | — | #363636 |
| Active, Unchecked, Disabled | Content Area/Light/Controls/Active, Off, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | — | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} |
| Active, Checked / Mixed, Idle | Content Area/Light/Controls/Active, On, 01 - Idle | #0088FF {System Colors/Light/8 Blue} | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #363636 |
| Active, Checked / Mixed, Clicked | Content Area/Light/Controls/Active, On, 03 - Clicked | #0091FF {System Colors/Dark/8 Blue} + #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #363636 |
| Active, Checked, Disabled | Content Area/Light/Controls/Active, On, 04 - Disabled | #0088FF {System Colors/Light/8 Blue} + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker), layer opacity 45% | Dot: Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #B2B2B2 |
| Active, Mixed, Disabled | as Active, Checked, Disabled | as above | Dash: Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% | #B2B2B2 |
| Inactive, Unchecked, Idle | Content Area/Light/Controls/Inactive, Off, 01 - Idle | #000000@10% {Fills/Light/1 Primary} | — | #363636 |
| Inactive, Unchecked, Disabled | Content Area/Light/Controls/Inactive, Off, 04 - Disabled | #000000@3% {Fills/Light/4 Quatenary} | — | #B2B2B2 |
| Inactive, Checked / Mixed, Idle | Content Area/Light/Controls/Inactive, On, 01 - Idle | #000000@14% | Global/Glyphs/Light/Neutral - 1 Idle · #000000@70%, blend plus-darker | #363636 |
| Inactive, Checked / Mixed, Disabled | Content Area/Light/Controls/Inactive, On, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | Global/Glyphs/Light/Neutral - 4 Disabled · #000000@22%, blend plus-darker | #B2B2B2 |

### Light, Over-glass

Labels are the same as in Light, Content Area: #363636 for Idle and Clicked, #B2B2B2 for Disabled, blend plus-darker.

| State | Circle style | Circle fill and effects | Glyph style · fill |
|---|---|---|---|
| Active, Unchecked, Idle | Over-Glass/Light/Controls/Active, Off, 01 - Idle | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}, layer blend plus-darker | — |
| Active, Unchecked, Clicked | Over-Glass/Light/Controls/Active, Off, 03 - Clicked | #000000@19%, layer blend plus-darker | — |
| Active, Unchecked, Disabled | Over-Glass/Light/Controls/Active, Off, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}; inner-shadow x0 y0 blur1 spread0 #000000@2% (blend plus-darker); layer blend plus-darker | — |
| Active, Checked / Mixed, Idle | Over-Glass/Light/Controls/Active, On, 01 - Idle | #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked / Mixed, Clicked | Over-Glass/Light/Controls/Active, On, 03 - Clicked | #0078F0 + #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked, Disabled | Over-Glass/Light/Controls/Active, On, 04 - Disabled | #0078F0 + #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} (blend plus-darker), layer opacity 45% | Dot: Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Mixed, Disabled | as Active, Checked, Disabled | as above | Dash: Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% |
| Inactive, Unchecked, Idle | Over-Glass/Light/Controls/Inactive, Off, 01 - Idle | #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary}, layer blend plus-darker | — |
| Inactive, Unchecked, Disabled | Over-Glass/Light/Controls/Inactive, Off, 04 - Disabled | #000000@5% {Fills/Light/3 Tertiary} | — |
| Inactive, Checked / Mixed, Idle | Over-Glass/Light/Controls/Inactive, On, 01 - Idle | #000000@15%, layer blend plus-darker | Global/Glyphs/Light/Neutral - 1 Idle · #000000@70%, blend plus-darker |
| Inactive, Checked / Mixed, Disabled | Over-Glass/Light/Controls/Inactive, On, 04 - Disabled | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}, layer blend plus-darker | Global/Glyphs/Light/Neutral - 4 Disabled · #000000@22%, blend plus-darker |

### Dark, Content Area

Labels use blend plus-darker in every state, as stored. Active and Inactive labels are bound to different swatch groups.

| State | Circle style | Circle fill and effects | Glyph style · fill | Label colour |
|---|---|---|---|---|
| Active, Unchecked, Idle | Content Area/Dark/Controls/Active, Off, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} (fill blend plus-darker) | — | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} |
| Active, Unchecked, Clicked | Content Area/Dark/Controls/Active, Off, 03 - Clicked | #FFFFFF@19% | — | #FFFFFF@96% |
| Active, Unchecked, Disabled | Content Area/Dark/Controls/Active, Off, 04 - Disabled | #FFFFFF@5% {Fills/Dark/3 Tertiary}, layer blend plus-darker | — | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} |
| Active, Checked / Mixed, Idle | Content Area/Dark/Controls/Active, On, 01 - Idle | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #FFFFFF@96% |
| Active, Checked / Mixed, Clicked | Content Area/Dark/Controls/Active, On, 03 - Clicked | #0091FF + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #FFFFFF@96% |
| Active, Checked, Disabled | Content Area/Dark/Controls/Active, On, 04 - Disabled | #0091FF + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter), layer opacity 45% | Dot: Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF | #4C4C4C |
| Active, Mixed, Disabled | as Active, Checked, Disabled | as above | Dash: Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% | #4C4C4C |
| Inactive, Unchecked, Idle | Content Area/Dark/Controls/Inactive, Off, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | — | #FFFFFF {Labels/Dark/1 Primary} |
| Inactive, Unchecked, Disabled | Content Area/Dark/Controls/Inactive, Off, 04 - Disabled | #FFFFFF@3% {Fills/Dark/4 Quatenary} | — | #FFFFFF@25% {Labels/Dark/3 Tertiary} |
| Inactive, Checked / Mixed, Idle | Content Area/Dark/Controls/Inactive, On, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary} | Global/Glyphs/Dark/Neutral - 1 Idle · #FFFFFF@70%, blend plus-lighter | #FFFFFF |
| Inactive, Checked / Mixed, Disabled | Content Area/Dark/Controls/Inactive, On, 04 - Disabled | #FFFFFF@3% {Fills/Dark/4 Quatenary} | Global/Glyphs/Dark/Neutral - 4 Disabled · #FFFFFF@22%, blend plus-lighter | #FFFFFF@25% |

### Dark, Over-glass

Labels use blend plus-darker in every state, as stored: #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} for Idle and Clicked, #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} for Disabled.

| State | Circle style | Circle fill and effects | Glyph style · fill |
|---|---|---|---|
| Active, Unchecked, Idle | Over-Glass/Dark/Controls/Active, Off, 01 - Idle | #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (fill blend plus-darker), layer blend plus-lighter | — |
| Active, Unchecked, Clicked | Over-Glass/Dark/Controls/Active, Off, 03 - Clicked | #FFFFFF@19%, layer blend plus-lighter | — |
| Active, Unchecked, Disabled | Over-Glass/Dark/Controls/Active, Off, 04 - Disabled | #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (fill blend plus-darker), layer blend plus-lighter | — |
| Active, Checked / Mixed, Idle | Over-Glass/Dark/Controls/Active, On, 01 - Idle | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked / Mixed, Clicked | Over-Glass/Dark/Controls/Active, On, 03 - Clicked | #0091FF + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (blend plus-lighter) | Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Checked, Disabled | Over-Glass/Dark/Controls/Active, On, 04 - Disabled | #0091FF + #FFFFFF@5% (blend plus-lighter), layer opacity 45% | Dot: Global/Glyphs/Light/Primary - 1 Idle · #FFFFFF |
| Active, Mixed, Disabled | as Active, Checked, Disabled | as above | Dash: Global/Glyphs/Light/Primary - 4 Disabled · #FFFFFF, opacity 50% |
| Inactive, Unchecked, Idle | Over-Glass/Dark/Controls/Inactive, Off, 01 - Idle | #FFFFFF@10% {Fills/Dark/1 Primary}, layer blend plus-lighter | — |
| Inactive, Unchecked, Disabled | Over-Glass/Dark/Controls/Inactive, Off, 04 - Disabled | #FFFFFF@3% {Fills/Dark Vibrant (use plus lighter)/5 Quinary}, layer blend plus-lighter | — |
| Inactive, Checked / Mixed, Idle | Over-Glass/Dark/Controls/Inactive, On, 01 - Idle | #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary}, layer blend plus-lighter | Global/Glyphs/Dark/Neutral - 1 Idle · #FFFFFF@70%, blend plus-lighter |
| Inactive, Checked / Mixed, Disabled | Over-Glass/Dark/Controls/Inactive, On, 04 - Disabled | #FFFFFF@3% {Fills/Dark/4 Quatenary}, layer blend plus-lighter | Global/Glyphs/Dark/Neutral - 4 Disabled · #FFFFFF@22%, blend plus-lighter |

## Text

| Size | Font | Size (pt) | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| 5 XL, 4 Lg, 3 Rg | SFPro-Medium | 13 | Not in the kit | Not in the kit | left |
| 2 Sm | SFPro-Medium | 11 | Not in the kit | Not in the kit | left |
| 1 Mn | SFPro-Medium | 10 | Not in the kit | Not in the kit | left |

- No `lh` or `kern` value is stored on any label (checked on all 300 labels).
- No shared text style is linked. `text-styles.md` has no Medium style.

| Appearance, context | Idle and Clicked | Disabled | Blend |
|---|---|---|---|
| Light, both contexts | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | plus-darker |
| Dark, Content Area, Active | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | plus-darker |
| Dark, Content Area, Inactive | #FFFFFF {Labels/Dark/1 Primary} | #FFFFFF@25% {Labels/Dark/3 Tertiary} | plus-darker |
| Dark, Over-glass | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | plus-darker |

## Effects

The page has no drop shadows, blurs or glass. Its only effects are blend modes, opacity and one inner shadow:

| Where | Effect |
|---|---|
| Circle, Active Checked / Mixed Disabled (all appearances and contexts) | layer opacity 45% |
| Dash, Active Mixed Disabled | `Primary - 4 Disabled` style: #FFFFFF at opacity 50% |
| Dot, Active Checked Disabled | No opacity of its own: `Primary - 1 Idle`, #FFFFFF |
| Circle, Light Over-glass Active Unchecked Disabled | inner-shadow x0 y0 blur1 spread0 #000000@2% (blend plus-darker) |
| Glyphs, Inactive Checked / Mixed | Light: blend plus-darker. Dark: blend plus-lighter |
| Circle, Over-glass | Light: layer blend plus-darker in most states. Dark: plus-lighter in every Unchecked and Inactive state |
| Labels | plus-darker on every label, including Dark |

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are headings:

- "Radio Buttons", with "Light" and "Dark" headings.
- The section labels "Content Area" and "Over-Glass".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All radio components | `grep -n '^COMPONENT "Toggles - Radio Buttons/' specs/toggles---radio-buttons.txt` |
| One appearance and context | `grep -n '^COMPONENT "Toggles - Radio Buttons/Dark/Content Area/' specs/toggles---radio-buttons.txt` |
| One size | `grep -n '^COMPONENT "Toggles - Radio Buttons/.*/1 Mn/' specs/toggles---radio-buttons.txt` |
| One state, with its layers | `grep -n -A4 'Active, Checked - 4 - Disabled"' specs/toggles---radio-buttons.txt` |
| Circle styles in use | `grep -o 'group "Radio Button".*style="[^"]*"' specs/toggles---radio-buttons.txt \| sort \| uniq -c` |
| Glyph layers | `grep -n 'oval "Dot"\|rect "Dash"' specs/toggles---radio-buttons.txt` |
