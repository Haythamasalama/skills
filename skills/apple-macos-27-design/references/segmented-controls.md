# Segmented Controls — macOS 27

**Read when:** you need an exact macOS 27 value for segmented Controls (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Segmented Controls in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/segmented-controls.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The 􀻃 (U+100EC3) folder in component names is the kit's folder for building-block parts.

## Components

294 components: 142 Dark, 152 Light. No documentation boards. The page also holds 40 instances placed outside any component (examples, listed under Kit notes).

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Controls, 2 segments | `Segmented Controls/{Dark,Light}/{Content Area,Over-glass}/Duo/{Active,Inactive}, {1 Mn,2 Sm,3 Rg,4 Lg,5 XL}` | appearance × context × window state × size | 40 |
| Controls, 3 segments | `Segmented Controls/{A}/{Content Area,Over-glass}/Trio/{Active,Inactive}, {size}` | same | 40 |
| Segment buttons | `Segmented Controls/{A}/􀻃/Buttons/{Content Area,Over-glass}/{Active,Inactive}, {size}/{On,Off}, {1 - Idle, 3 - Clicked, 4 - Disabled}` | appearance × context × window state × size × On/Off × state; `Inactive` has no `3 - Clicked` | 200 |
| Separator | `Segmented Controls/{A}/􀻃/Separator/{On,Off}` | appearance × visible | 4 |
| Margin guides (Light only) | `Segmented Controls/Light/􀻃/Margins/{Duo,Trio}/􀻃/Margins/Duo - {size}` (the Trio ones are also named `Duo - …`) | count × size | 10 |

Per appearance and context, buttons are 5 sizes × (Active: 2 × 3 states + Inactive: 2 × 2 states) = 50.

Sizes: 1 Mn (Mini), 2 Sm (Small), 3 Rg (Regular), 4 Lg (Large), 5 XL (Extra Large). Contexts: Content Area and Over-glass. Window state: Active and Inactive.

## Anatomy

### Control (Duo, Trio)

| Layer | Description |
|---|---|
| Component | The track: W×H, the context's bordered fill, corners by size (see Sizes) |
| `use "Segment 1"`, `"Segment 2"`, `"Segment 3"` | → `􀻃/Buttons/{context}/{state}, {size}/Off, 1 - Idle`, text overrides "1", "2", "3"; segment n at x = (n − 1) × segment width, y 0 |
| `use "Separator"` (Duo) or `"Separator 1"`, `"Separator 2"` (Trio) | → `􀻃/Separator/On`, 1 wide, at x = n × segment width − 0.5 (derived: centred on the boundary between segments) |

Derived: the track is exactly the segments placed side by side with no padding (Duo width = 2 × segment width, Trio = 3 ×), and every segment is as tall as the track. A segment that is On therefore fills its slot to the track's edges with no inset.

### Segment button

| Layer | Description |
|---|---|
| Component | segment W×H, state fill (none for Off Idle and Off Disabled), corners by size |
| `text "􁀄"` | one centred text layer, default glyph 􁀄 (U+101004) |

### Separator

| Component | Contents |
|---|---|
| `􀻃/Separator/On` | master 1×20 stored with `fill #FF0000`; child `rect "Separator"` 1×20 @0,0, corners 1 (colour under Colours and states) |
| `􀻃/Separator/Off` | master 1×20, `fill #FF0000`, no child (nothing drawn) |

Separator instances per size: Mn 1×10 @y3, Sm 1×12 @y4, Rg 1×14 @y5, Lg 1×18 @y5, XL 1×20 @y8. Derived: equal top and bottom insets of 3, 4, 5, 5 and 8.

### Margin guides (`Light/􀻃/Margins`)

Red guide rectangles (#FF0000@30%) that mark Apple's minimum margins inside a control.

| Size | `Minimum Margin: Left` / `Right` | `Separator Margin` (each side of a separator) | Separator group |
|---|---|---|---|
| 1 Mn | 6 wide | 6 | 13 wide @16.5 (Duo), also @39.5 (Trio) |
| 2 Sm | 8 | 8 | 17 @17.5; @43.5 |
| 3 Rg | 10 | 10 | 21 @19.5; @49.5 |
| 4 Lg | 12 | 12 | 25 @21.5; @55.5 |
| 5 XL | 14 | 14 | 29 @23.5; @61.5 |

Derived: each separator group is 2 × margin + 1 wide and starts at segment width − margin − 0.5, so the margin is measured from the separator line on both sides.

## Sizes

| Size | Segment W×H | Duo W×H | Trio W×H | Corner radius (track and segment) | Glyph frame | Glyph font | Separator | Minimum margin |
|---|---|---|---|---|---|---|---|---|
| 1 Mn | 23×16 | 46×16 | 69×16 | 4 | 14×12 @4.5,2 | SFPro-Medium 10 | 1×10 @y3 | 6 |
| 2 Sm | 26×20 | 52×20 | 78×20 | 5 | 15×13 @5.5,4 | SFPro-Medium 11 | 1×12 @y4 | 8 |
| 3 Rg | 30×24 | 60×24 | 90×24 | 6 | 18×15 @6,5 | SFPro-Medium 13 | 1×14 @y5 | 10 |
| 4 Lg | 34×28 | 68×28 | 102×28 | max (capsule) | 18×15 @8,7 | SFPro-Medium 13 | 1×18 @y5 | 12 |
| 5 XL | 38×36 | 76×36 | 114×36 | max (capsule) | 18×15 @10,11 | SFPro-Medium 13 | 1×20 @y8 | 14 |

All corners use smoothing 0.6. Geometry is the same in both appearances, both contexts and every state (checked across all 200 buttons). Derived: the glyph frame is centred horizontally in every size; vertically it sits 1 point above centre in Sm, Rg, Lg and XL (for example Rg: 5 above, 4 below).

## Colours and states

### Track (control component)

| Appearance | Context | Shared style named on the layer | Stored fill |
|---|---|---|---|
| Dark | Content Area | `Content Area/Light/01 - Bordered/01 - Idle` | #FFFFFF@8% {Fills/Dark/2 Secondary} |
| Light | Content Area | `Content Area/Light/01 - Bordered/01 - Idle` | #000000@8% {Fills/Light/2 Secondary} |
| Dark | Over-glass | `Over-Glass/Dark/01 - Bordered/01 - Idle` | #FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter) |
| Light | Over-glass | `Over-Glass/Light/01 - Bordered/01 - Idle` | #000000@12% (blend overlay) + #000000@7% (blend plus-darker) |

The track is the same in Active and Inactive windows. No border, shadow or blur on any track.

### Segments — Content Area

| Appearance | Window | State | Fill | Shared style | Glyph | Opacity |
|---|---|---|---|---|---|---|
| Dark | Active | Off, 1 - Idle | none | — | #FFFFFF {Labels/Dark/1 Primary}, blend plus-darker | — |
| Dark | Active | Off, 3 - Clicked | #FFFFFF@16% | `Content Area/Light/01 - Bordered/03 - Clicked` | #FFFFFF {Labels/Dark/1 Primary} | — |
| Dark | Active | Off, 4 - Disabled | none | — | #FFFFFF@25% {Labels/Dark/3 Tertiary} | — |
| Dark | Active | On, 1 - Idle | #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@4% {Fills/Dark Vibrant (use plus lighter)/4 Quatenary} (plus-lighter) | `Content Area/Dark/Segmented Control/Active, On, 01 - Idle` | #FFFFFF | — |
| Dark | Active | On, 3 - Clicked | #0091FF {…/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (plus-lighter) | `…/Active, On, 03 - Clicked` | #FFFFFF | — |
| Dark | Active | On, 4 - Disabled | as On Idle | `…/Active, On, 04 - Disabled` | #FFFFFF, glyph opacity 50% | layer 45% |
| Dark | Inactive | Off, 1 - Idle | none | — | #FFFFFF {Labels/Dark/1 Primary} | — |
| Dark | Inactive | Off, 4 - Disabled | none | — | #FFFFFF@25% {Labels/Dark/3 Tertiary} | — |
| Dark | Inactive | On, 1 - Idle | #FFFFFF@13% | — | #FFFFFF {Labels/Dark/1 Primary} | — |
| Dark | Inactive | On, 4 - Disabled | #FFFFFF@6% | — | #FFFFFF@25% {Labels/Dark/3 Tertiary} | — |
| Light | Active | Off, 1 - Idle | none | — | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, plus-darker | — |
| Light | Active | Off, 3 - Clicked | #000000@16% | `Content Area/Light/01 - Bordered/03 - Clicked` | #363636 {…/1 Primary} | — |
| Light | Active | Off, 4 - Disabled | none | — | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | — |
| Light | Active | On, 1 - Idle | #0088FF {System Colors/Light/8 Blue} + #000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary} (plus-darker) | `Content Area/Light/Segmented Control/Active, On, 01 - Idle` | #FFFFFF | — |
| Light | Active | On, 3 - Clicked | #0088FF {…/8 Blue} + #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary} (plus-darker) | `…/Active, On, 03 - Clicked` | #FFFFFF | — |
| Light | Active | On, 4 - Disabled | as On Idle | `…/Active, On, 04 - Disabled` | #FFFFFF, glyph opacity 50% | layer 45% |
| Light | Inactive | Off, 1 - Idle | none | — | #000000@85% {Labels/Light/1 Primary}, plus-darker | — |
| Light | Inactive | Off, 4 - Disabled | none | — | #000000@25% {Labels/Light/3 Tertiary} | — |
| Light | Inactive | On, 1 - Idle | #000000@13% | — | #000000@85% {Labels/Light/1 Primary} | — |
| Light | Inactive | On, 4 - Disabled | #000000@6% | — | #000000@25% {Labels/Light/3 Tertiary} | — |

### Segments — Over-glass

| Appearance | Window | State | Fill | Shared style | Glyph | Opacity |
|---|---|---|---|---|---|---|
| Dark | Active | Off, 1 - Idle | none | — | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary}, plus-lighter | — |
| Dark | Active | Off, 3 - Clicked | #FFFFFF@12% (overlay) + #FFFFFF@13% (plus-lighter) | `Over-Glass/Dark/01 - Bordered/03 - Clicked` | #FFFFFF@96% {…/1 Primary} | — |
| Dark | Active | Off, 4 - Disabled | none | — | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | — |
| Dark | Active | On, 1 - Idle | #0A99FF {System Colors/Dark (use plus lighter)/8 Blue} + #FFFFFF@4% {Fills/Dark Vibrant (use plus lighter)/4 Quatenary} (plus-lighter) | `Over-Glass/Dark/Segmented Control/Active, On, 01 - Idle` | #FFFFFF | — |
| Dark | Active | On, 3 - Clicked | #0A99FF {…/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (plus-lighter) | `…/Active, On, 03 - Clicked` | #FFFFFF | — |
| Dark | Active | On, 4 - Disabled | as On Idle | `…/Active, On, 04 - Disabled` | #FFFFFF, glyph opacity 50% | layer 45% |
| Dark | Inactive | Off, 1 - Idle | none | — | #FFFFFF@96% {…/1 Primary} | — |
| Dark | Inactive | Off, 4 - Disabled | none | — | #4C4C4C {…/3 Tertiary} | — |
| Dark | Inactive | On, 1 - Idle | #FFFFFF@10% (plus-darker), layer blend plus-darker | — | #FFFFFF@96% {…/1 Primary} | — |
| Dark | Inactive | On, 4 - Disabled | #FFFFFF@5% (plus-darker), layer blend plus-darker | — | #4C4C4C {…/3 Tertiary} | layer 50% |
| Light | Active | Off, 1 - Idle | none | — | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, plus-darker | — |
| Light | Active | Off, 3 - Clicked | #000000@12% (overlay) + #000000@13% (plus-darker) | `Over-Glass/Light/01 - Bordered/03 - Clicked` | #363636 {…/1 Primary} | — |
| Light | Active | Off, 4 - Disabled | none | — | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | — |
| Light | Active | On, 1 - Idle | #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary} (plus-darker) | `Over-Glass/Light/Segmented Control/Active, On, 01 - Idle` | #FFFFFF | — |
| Light | Active | On, 3 - Clicked | #0078F0 {…/8 Blue} + #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary} (plus-darker) | `…/Active, On, 03 - Clicked` | #FFFFFF | — |
| Light | Active | On, 4 - Disabled | #0088FF {System Colors/Light/8 Blue} + #000000@3% {…/4 Quatenary} (plus-darker) | `Content Area/Light/Segmented Control/Active, On, 04 - Disabled` | #FFFFFF, glyph opacity 50% | layer 45% |
| Light | Inactive | Off, 1 - Idle | none | — | #363636 {…/1 Primary} | — |
| Light | Inactive | Off, 4 - Disabled | none | — | #B2B2B2 {…/3 Tertiary} | — |
| Light | Inactive | On, 1 - Idle | #000000@10% (plus-darker), layer blend plus-darker | — | #363636 {…/1 Primary} | — |
| Light | Inactive | On, 4 - Disabled | #000000@5% (plus-darker), layer blend plus-darker | — | #B2B2B2 {…/3 Tertiary} | layer 50% |

In an active window the selected segment is the blue accent fill with a white glyph; in an inactive window it turns into a neutral fill with the normal label colour, and there is no Clicked state.

### Separator

| Appearance | `rect "Separator"` fill |
|---|---|
| Dark | #262626 {Labels/Dark Vibrant (use plus lighter)/4 Quaternary}, blend plus-lighter |
| Light | #E6E6E6 {Labels/Light Vibrant (use plus darker)/5 Quinary}, blend plus-darker |

The same separator is used in Content Area and Over-glass controls. In the page examples, a segment that is On or Clicked comes with the neighbouring separator swapped to `Separator/Off` (Trio examples, Dark Over-glass Duo examples) or hidden with `isVisible→0` (Light Duo examples).

## Text

| Size | Font | Size (pt) | Line height | Tracking | Align |
|---|---|---|---|---|---|
| 1 Mn | SFPro-Medium | 10 | not stored | none | center |
| 2 Sm | SFPro-Medium | 11 | not stored | none | center |
| 3 Rg | SFPro-Medium | 13 | not stored | none | center |
| 4 Lg | SFPro-Medium | 13 | not stored | none | center |
| 5 XL | SFPro-Medium | 13 | not stored | none | center |

No segment text names a shared text style. The masters label segments with the glyph 􁀄 (U+101004); controls override them with "1", "2", "3"; the page examples use 􀆉 (U+100189) and 􀆊 (U+10018A) in Duo controls and 􀌀 (U+100300), 􀌁 (U+100301), 􀌂 (U+100302) in Trio controls. Colours per state are in the tables above.

## Effects

| Where | Effect |
|---|---|
| Over-glass track and Off Clicked segment | stacked fills, the first with blend overlay, the second with plus-lighter (Dark) or plus-darker (Light) |
| On segments, active window | accent fill + a vibrant tint fill with blend plus-lighter (Dark) or plus-darker (Light) |
| On, 4 - Disabled (active window) | segment layer opacity 45%, glyph opacity 50% |
| Over-glass On, 4 - Disabled (inactive window) | segment layer opacity 50%, blend plus-darker |
| Over-glass On, 1 - Idle (inactive window) | fill blend plus-darker, layer blend plus-darker |
| Glyphs | Off and Inactive glyphs mostly blend plus-darker (Content Area, both appearances; Over-glass Light) or plus-lighter (Over-glass Dark); On glyphs in active windows (#FFFFFF) have no blend |
| Shadows, blur, glass | none on this page |

## Kit notes

- The page has no documentation boards. Its free text is the page labels "Segmented Controls" with "Light" or "Dark" (SFPro-Bold 60) and two section labels, "Content Area" and "Over-Glass" (SFPro-Semibold 30, kern −0.46, #000000@50%). The kit gives no usage text beyond those labels.
- The `Margins` guides are Apple's way of showing spacing: a minimum margin at each end of the control and the same margin on each side of every separator (6, 8, 10, 12, 14 by size).
- Page examples outside the components: 25 `use "Examples/Segmented Control"` instances (5 Dark, 20 Light), 10 instances named `Segmented Controls/Dark/Over-glass/Duo/Active, {size}` and 5 named `Segmented Controls/Dark/Over-glass/Trio/Inactive, {size}`. The Over-glass-named ones point to Content Area controls with Over-glass segments swapped in.
- A loose `rect "Minimum Margin: Left"` 10×24 also sits on the page.

## Finding it in the spec

| Family | grep pattern on `specs/segmented-controls.txt` |
|---|---|
| Controls | `grep -n -e '^COMPONENT "Segmented Controls/[A-Za-z]*/Content Area/' -e '^COMPONENT "Segmented Controls/[A-Za-z]*/Over-glass/'` |
| Segment buttons | `grep -n '^COMPONENT "Segmented Controls/[A-Za-z]*/􀻃/Buttons/'` |
| One state across sizes | `grep -n -A1 'Buttons/Content Area/Active, [0-9] [A-Za-z]*/On, 1 - Idle"'` |
| Separators | `grep -n -A1 '􀻃/Separator/'` |
| Margin guides | `grep -n -A8 '􀻃/Margins/'` |
| Page examples | `grep -n '^use '` |
