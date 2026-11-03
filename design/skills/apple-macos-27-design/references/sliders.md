# Sliders — macOS 27

**Read when:** you need an exact macOS 27 value for sliders (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Sliders in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/sliders.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀌆 (U+100306). The nested-part folder in the component names is the glyph 􀻃 (U+100EC3); it is written `􀻃` below.

## Components

836 components in three groups.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Linear slider | `Sliders/<Appearance>/<Context>/<Type>/<State>/<Size>` | Appearance: Light, Dark · Context: Content Area, Over-glass · Type: Standard, Standard + Ticked, Center-biased, Center-biased + Ticked · State: `Active, 1 - Idle`, `Active, 3 - Clicked`, `Active, 4 - Disabled`, `Inactive, 1 - Idle`, `Inactive, 4 - Disabled` · Size: 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL | 400 |
| Circular slider | `Circular Slider (Dial)/<Appearance>/<Context>/<Size>/<State>` | Appearance: Light, Dark · Context: Content Area, Over-glass · Size: 1 Mn … 5 XL · State: 1 - Idle, 3 - Clicked, 4 - Disabled | 60 |
| Nested parts | `Sliders/􀻃/<Appearance>/<Context>/<Part>/…` | the parts below, for each Appearance × Context | 376 |

Nested parts (count over all four Appearance × Context pairs):

| Part | Sub-axes | Count | Notes |
|---|---|---|---|
| `Knob` | Size × 01 - Idle, 03 - Clicked, 04 - Disabled | 60 | used by Standard and Center-biased |
| `Knob - Ticked` | Size × 01 - Idle, 03 - Clicked, 04 - Disabled | 60 | used by the Ticked types |
| `Knob and Track` | Size × 0%, 25%, 50%, 75%, 100% | 50 | Content Area only |
| `Track` | Size × 0%, 25%, 50%, 75%, 100% | 50 | Over-glass only; same role as `Knob and Track` |
| `Knob and Track (Center)` | Size × -100%, -50%, 0%, +50%, +100% | 100 | Center-biased fill |
| `Tracks/Track - Filled` | Show, Hide | 8 | the blue fill bar |
| `Tracks - Filled Centered` | Left, Right × Visible Fill, Non-Visible Fill, Non-Visible Fill (Ticked), Non-Visible Fill, Disabled | 24 | Content Area has all four fills (8 each), Over-glass only Visible Fill and Non-Visible Fill, Disabled (4 each) |
| `Tick Marks` | Idle, Disabled | 8 | |
| `Tick Marks - Center-biased` | Idle, Disabled | 8 | |
| `Track - Filled` | Hide | 4 | 120×4, no visible layers in the dump |
| `Track - Center` | Hide | 4 | 120×4, no visible layers in the dump |

Every top-level linear slider uses the 50% value (Standard) or +50% value (Center-biased). The other value positions exist only as nested parts to swap in.

## Anatomy

### Linear slider

Layers of a top-level component, in stacking order from the dump (first listed is the first child):

| Layer | Kind | What it is |
|---|---|---|
| `Tick Marks` | instance → `…/Tick Marks/<Idle or Disabled>` or `…/Tick Marks - Center-biased/<…>` | Ticked types only, below the track |
| `Track - Unfilled` | rect, corners 50 | full-width background track |
| `Track + Knob` | instance → `…/Knob and Track/<Size>/50%` (Content Area), `…/Track/<Size>/50%` (Over-glass) or `…/Knob and Track (Center)/<Size>/+50%` | filled part plus knob; states are set with overrides on this instance (`style→` for the filled bar, `swap→` for the knob) |

Inside `Knob and Track` / `Track` (120 wide):

| Child | Points to | Notes |
|---|---|---|
| `Track` | `…/Tracks/Track - Filled/Show` | width set by the value |
| `Knob` | `…/Knob/<Size>/01 - Idle`, instance 2×16 | the 2-wide instance is an anchor; the visible knob is a child that overhangs it |

Inside `Knob and Track (Center)`:

| Child | Points to |
|---|---|
| `Track` | `…/Tracks - Filled Centered/Left/Visible Fill` (values ≤ 0%) or `…/Right/Visible Fill` (values > 0%) |
| `Knob` | `…/Knob/<Size>/01 - Idle`, instance 2×16 |

`Tracks/Track - Filled/Show` (master 60×4): one rect `Track - Filled`, 61×4 @0,0 in Light · Content Area and 60×4 @0,0 in the other three, corners 50.

`Tracks - Filled Centered` (master 60×4):

| Variant | `Track` rect | `Midpoint` rect |
|---|---|---|
| Left/Visible Fill | 61×4 @0,0, corners 50/0/0/50 | 2×4 @59,0 |
| Right/Visible Fill | 61×4 @-1,0, corners 0/50/50/0 | 2×4 @-1,0 |
| Left/Non-Visible Fill… (all three) | none | 2×4 @59,0 |
| Right/Non-Visible Fill… (all three) | none | 2×4 @-1,0 |

`Tick Marks` (master 120×2, `stack h gap13 pad0,1,0,1`) and `Tick Marks - Center-biased` (master 120×4, same stack values): five 2×2 rects named `0%`, `25%`, `50%`, `75%`, `100%` at x = 1, 30, 59, 88, 117, y 0, corners max. In the Center-biased version the `50%` mark is 2×4. Marks are 29 apart (derived: 30 − 1), so 27 pt between marks (derived: 29 − 2), which is not the stored stack gap of 13. Instances on the sliders are 120×4.

### Knob

Each knob master is a 2-pt-wide anchor with a background fill `{x. Kit/Nested Symbol BG Light}` #CCE6FF (or `…BG Dark` #366799). That swatch is the kit's backdrop for nested symbols, not part of the control. The visible knob is the child layer.

| State | Layers |
|---|---|
| 01 - Idle, 04 - Disabled | `Knob` (one rect) |
| 03 - Clicked | `Knob Drop Shadow`, `Knob Rim Shadow`, `Knob` (three rects, same size) |

Geometry is the same in all four Appearance × Context pairs (checked across all 120 knob masters):

| Size | Anchor | `Knob` idle / disabled | `Knob - Ticked` idle / disabled | `Knob` clicked (Knob and Rim) | Clicked `Knob Drop Shadow` | `Knob - Ticked` clicked (Knob and Rim) | Ticked `Knob Drop Shadow` |
|---|---|---|---|---|---|---|---|
| 1 Mn | 2×16 | 16×12 @-7,2 | 8×16 @-3,0 | 20×15 @-9,0.5 | 20×15 @-9,5 | 10×20 @-4,-2 | 10×20 @-4,2 |
| 2 Sm | 2×18 | 18×14 @-8,2 | 10×18 @-4,0 | 23×18 @-10.5,0 | 23×18 @-10.5,5 | 13×23 @-5.5,-2.5 | 13×23 @-5.5,2.5 |
| 3 Rg | 2×16 | 20×16 @-9,0 | 20×16 @-9,0 | 25×20 @-11.5,-2 | 25×20 @-11.5,5 | 25×20 @-11.5,-2 | 25×20 @-11.5,5 |
| 4 Lg | 2×20 | 24×20 @-11,0 | 24×20 @-11,0 | 30×25 @-14,-2.5 | 30×25 @-14,5 | 30×25 @-14,-2.5 | 30×25 @-14,5 |
| 5 XL | 2×20 | 24×20 @-11,0 | 24×20 @-11,0 | 30×25 @-14,-2.5 | 30×25 @-14,5 | 30×25 @-14,-2.5 | 30×25 @-14,5 |

- The idle knob is centred on the anchor (derived, Rg: −9 + 20/2 = 1 = anchor centre).
- The clicked knob is 1.25× the idle knob for Mn, Rg, Lg and XL (derived: 20/16, 25/20, 30/24). For Sm it is 23×18 against 18×14.
- `Knob - Ticked` is a narrow upright knob only at Mn and Sm. At Rg, Lg and XL it has the same size as `Knob`.

### Circular slider (Dial)

| Layer | Kind | Notes |
|---|---|---|
| (component frame) | filled, rounded | the dial body |
| `Grabber` | rect, corners 1 | small bar near the top edge, centred horizontally |

The dump has no rotation values, so the kit shows one grabber position only.

## Sizes

### Linear slider

All sizes are 140 wide with a 120-wide track. Geometry is identical for every type, state, appearance and context (checked across all 400).

| Size | Component | `Track - Unfilled` and `Track + Knob` | Track inset (derived) | Track corners | Knob instance in `Track + Knob` | `Tick Marks` instance | Track-to-ticks gap (derived) |
|---|---|---|---|---|---|---|---|
| 1 Mn | 140×16 | 120×4 @10,6 | 10 left and right; centred vertically, (16 − 4)/2 = 6 | 50 | 2×16 @y −6 | 120×4 @10,12 | 2 (12 − 10) |
| 2 Sm | 140×20 | 120×4 @10,8 | 10; (20 − 4)/2 = 8 | 50 | 2×16 @y −6 | 120×4 @10,15 | 3 (15 − 12) |
| 3 Rg | 140×24 | 120×6 @10,9 | 10; (24 − 6)/2 = 9 | 50 | 2×16 @y −5 | 120×4 @10,18 | 3 (18 − 15) |
| 4 Lg | 140×28 | 120×6 @10,11 | 10; (28 − 6)/2 = 11 | 50 | 2×16 @y −5 | 120×4 @10,20 | 3 (20 − 17) |
| 5 XL | 140×36 | 120×6 @10,15 | 10; (36 − 6)/2 = 15 | 50 | 2×16 @y −5 | 120×4 @10,25 | 4 (25 − 21) |

The knob instance is 16 tall and centred on the track (derived: −5 + 8 = 3 = 6/2; −6 + 8 = 2 = 4/2). Knob sizes are in the Knob table above.

Value positions inside the 120-wide track (same for every size, appearance and context):

| Value (`Knob and Track` / `Track`) | Filled `Track` width @x | Knob anchor x |
|---|---|---|
| 0% | 4 @0 | 1 |
| 25% | 31 @0 | 32 |
| 50% | 60 @0 | 59 |
| 75% | 89 @0 | 86 |
| 100% | 120 @0 | 118 |

| Value (`Knob and Track (Center)`) | Filled `Track` width @x | Side used | Knob anchor x |
|---|---|---|---|
| -100% | 60 @0 | Left | 0 |
| -50% | 30 @30 | Left | 32 (30 in the Over-glass 1 Mn parts) |
| 0% | 1 @59 | Left | 59 |
| +50% | 31 @60 | Right | 88 |
| +100% | 60 @60 | Right | 118 |

### Circular slider (Dial)

| Size | Component | Corners: Content Area / Over-glass | `Grabber` | Grabber inset from top |
|---|---|---|---|---|
| 1 Mn | 16×16 | 100 / 18 | 2×4 @7,2 | 2 |
| 2 Sm | 20×20 | 100 / 18 | 2×5 @9,2.5 | 2.5 |
| 3 Rg | 24×24 | 100 / 18 | 2×6 @11,3 | 3 |
| 4 Lg | 28×28 | 100 / 18 | 2×6 @13,3 | 3 |
| 5 XL | 36×36 | 100 / 18 | 2×7 @17,3 | 3 |

Grabber x = (width − 2)/2 (derived). Both corner values are at least half the width at every size, so both bodies are drawn as circles (derived). Grabber corners 1 at every size.

## Colours and states

Values in "Filled track" come from the shared style named by the `style→` override on `Track + Knob`. The colour for that style is copied from `control-styles-content-area.md` / `control-styles-over-glass.md`. Idle uses the master's own style. "Unfilled track" shows the layer's style name and the fill stored on the layer, which do not always match (see Light/Dark mix-ups below).

### Light · Content Area

| State | Unfilled track | Filled track | Knob | Tick marks (Ticked types) |
|---|---|---|---|---|
| Active, 1 - Idle | style `Content Area/Light/Tracks/Active, Unfilled, 01 - Idle` · #000000@10% {Fills/Light/1 Primary} | `Content Area/Light/Tracks/Active, Filled, 01 - Idle` · #0088FF {System Colors/Light/8 Blue} | `01 - Idle`: #FFFFFF, shadow x0 y0.5 blur6 spread0 #000000@12% | `Tick Marks/Idle`: style `…/Tick Mark - Idle` · #000000@25% {Labels/Light/3 Tertiary}. Center-biased centre mark: style `…/Tick Mark - Centerpoint, Idle` · #000000@85% (blend plus-darker) |
| Active, 3 - Clicked | same as idle (the `…/Active, Unfilled, 03 - Clicked` style, #000000@19%, is not used) | `…/Active, Filled, 03 - Clicked` · #0088FF + #000000@8% {Fills/Light/2 Secondary} | `03 - Clicked` (glass, see Effects); rim border 1 outside #D9D9D9 (blend plus-darker) | Idle |
| Active, 4 - Disabled | style `…/Active, Unfilled, 04 - Disabled` · #000000@10% {Fills/Light/1 Primary} | `…/Active, Filled, 04 - Disabled` · #000000@2% {Fills/Light Vibrant (use plus darker)/5 Quinary} | `04 - Disabled`: same values as idle | `Tick Marks/Disabled`: style `…/Tick Mark - Disabled` · #000000@10% {Labels/Light/4 Quaternary}; 9 `style→` overrides to the same style |
| Inactive, 1 - Idle | as Active, 1 - Idle | `…/Inactive, Filled, 01 - Idle` · #000000@10% {Fills/Light/1 Primary} | idle | Idle |
| Inactive, 4 - Disabled | as Active, 4 - Disabled | `…/Inactive, Filled, 04 - Disabled` · #000000@5% {Fills/Light/3 Tertiary} | disabled | Disabled |

Center-biased filled part (`Tracks - Filled Centered/…/Visible Fill`): `Track` style `Content Area/Light/Tracks/Active, Filled, 01 - Idle` · #0088FF. `Midpoint` #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary}, blend plus-darker. The Non-Visible Fill variants hold only this midpoint.

### Light · Over-glass

| State | Unfilled track | Filled track | Knob | Tick marks |
|---|---|---|---|---|
| Active, 1 - Idle | style `Over-Glass/Light/Tracks/Active, Unfilled` · #000000@20% (blend overlay) + #000000@7% (blend plus-darker) | `Over-Glass/Light/Tracks/Active, Filled, 01 - Idle` · #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} | same values as Light · Content Area | `Tick Marks/Idle`: style `Over-Glass/Light/Tracks/Tick Mark - Idle` · #000000@25% (blend plus-darker), corners 10, layer blend plus-darker. Centre mark #000000@85% (blend plus-darker) |
| Active, 3 - Clicked | same | override names `Content Area/Light/Tracks/Active, Filled, 03 - Clicked` (a Content Area style) · #0088FF + #000000@8% | clicked | Idle |
| Active, 4 - Disabled | same | `Content Area/Light/Tracks/Active, Filled, 04 - Disabled` · #000000@2%. Exception: Standard 2 Sm uses `Over-Glass/Light/Tracks/Active, Filled, 04 - Disabled` (#000000@2% {Fills/Light Vibrant (use plus darker)/5 Quinary}, blend plus-darker) and has no knob swap | disabled | Standard + Ticked: `Tick Marks/Idle` with 9 overrides to `Content Area/Light/Tracks/Tick Mark - Disabled`. Center-biased + Ticked: `Tick Marks - Center-biased/Disabled` with the same 9 overrides |
| Inactive, 1 - Idle | style `Over-Glass/Light/Tracks/Inactive, Unfilled` · #000000@20% (blend overlay) + #000000@7% (blend plus-darker), layer blend plus-darker | `Content Area/Light/Tracks/Inactive, Filled, 01 - Idle` · #000000@10% | idle | Idle |
| Inactive, 4 - Disabled | as Inactive, 1 - Idle | `Content Area/Light/Tracks/Inactive, Filled, 04 - Disabled` · #000000@5% | Standard and Center-biased keep the idle knob (no swap). Ticked types swap to disabled | as Active, 4 - Disabled |

`Light/Over-glass/Tick Marks/Disabled` (#000000@10% blend plus-darker, style `Over-Glass/Light/Tracks/Tick Mark - Disabled`) exists but no slider uses it. Center-biased filled part: `Track` style `Over-Glass/Light/Tracks/Active, Filled, 01 - Idle` · #0078F0, `Midpoint` #B2B2B2 (blend plus-darker).

### Dark · Content Area

| State | Unfilled track | Filled track | Knob | Tick marks |
|---|---|---|---|---|
| Active, 1 - Idle | style named `Content Area/Light/Tracks/Active, Unfilled, 01 - Idle`, layer fill #FFFFFF@10% {Fills/Dark/1 Primary} | `Content Area/Dark/Tracks/Active, Filled, 01 - Idle` · #0091FF {System Colors/Dark/8 Blue}; the `Track` instance also has a colour override fill → #0091FF | `01 - Idle`: #DEDEDE, shadow x0 y0.5 blur6 spread0 #000000@12% | uses the **Light** part `Light/Content Area/Tick Marks/Idle` (#000000@25%) |
| Active, 3 - Clicked | same | `Content Area/Dark/Tracks/Active, Filled, 03 - Clicked` · #0091FF + #FFFFFF@8% {Fills/Dark/2 Secondary}. 1 Mn also carries an override to the Light clicked style before the Dark one | `03 - Clicked`; rim border 1 outside #000000@20% (blend plus-darker), corners max | Light Idle |
| Active, 4 - Disabled | style named `Content Area/Light/Tracks/Active, Unfilled, 04 - Disabled`, layer fill #FFFFFF@10% | `Content Area/Dark/Tracks/Active, Filled, 04 - Disabled` · #FFFFFF@3% {Fills/Dark Vibrant (use plus lighter)/5 Quinary} | disabled (same values as idle) | `Light/Content Area/Tick Marks/Disabled` (#000000@10%) with 9 overrides to `Content Area/Light/Tracks/Tick Mark - Disabled` |
| Inactive, 1 - Idle | as Active, 1 - Idle | `Content Area/Dark/Tracks/Inactive, Filled, 01 - Idle` · #FFFFFF@10% {Fills/Dark/1 Primary} | idle | Light Idle |
| Inactive, 4 - Disabled | as Active, 4 - Disabled | `Content Area/Dark/Tracks/Inactive, Filled, 04 - Disabled` · #FFFFFF@5% {Fills/Dark/3 Tertiary} | disabled | Light Disabled |

Dark parts no slider uses: `Dark/Content Area/Tick Marks/Idle` (#FFFFFF@25% {Labels/Dark/3 Tertiary}) and `/Disabled` (#FFFFFF@10% {Labels/Dark/4 Quaternary}). Both name the `Content Area/Light/…` tick styles. `Dark/Content Area/Tick Marks - Center-biased` holds Light values (#000000@25%, centre #000000@85% plus-darker, disabled #000000@10%). Center-biased filled part: `Track` #0091FF (style `Content Area/Dark/Tracks/Active, Filled, 01 - Idle`). `Midpoint` #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}, blend plus-lighter.

### Dark · Over-glass

| State | Unfilled track | Filled track | Knob | Tick marks |
|---|---|---|---|---|
| Active, 1 - Idle | style `Over-Glass/Dark/Tracks/Active, Unfilled` · #FFFFFF@4% (blend overlay) + #FFFFFF@3% (blend plus-lighter), layer blend plus-lighter | `Over-Glass/Dark/Tracks/Active, Filled, 01 - Idle` · #0A99FF {System Colors/Dark (use plus lighter)/8 Blue} | #FFFFFF (same values as Light; not the #DEDEDE Content Area knob); clicked rim #D9D9D9 (blend plus-darker) | `Tick Marks/Idle`: style `Over-Glass/Dark/Tracks/Tick Mark - Idle` · #404040, corners 10, blend plus-lighter. Centre mark: `…/Tick Mark - Centerpoint, Idle` · #D9D9D9, blend plus-lighter |
| Active, 3 - Clicked | same | `Over-Glass/Dark/Tracks/Active, Filled, 03 - Clicked` · #0A99FF + #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} | clicked | Idle |
| Active, 4 - Disabled | same | `Over-Glass/Dark/Tracks/Active, Filled, 04 - Disabled` · #FFFFFF@3% (blend plus-lighter). Center-biased + Ticked uses `…/Inactive, Filled, 04 - Disabled` (#FFFFFF@10%) instead | disabled | `Tick Marks/Disabled`: style `Over-Glass/Dark/Tracks/Tick Mark - Disabled` · #1A1A1A, blend plus-lighter. Also 4 (Standard + Ticked) or 5 (Center-biased + Ticked) overrides to `Content Area/Light/Tracks/Tick Mark - Disabled` |
| Inactive, 1 - Idle | style `Over-Glass/Dark/Tracks/Inactive, Unfilled` · same fills, blend plus-lighter | `Over-Glass/Dark/Tracks/Inactive, Filled, 01 - Idle` · #FFFFFF@22% | idle | Idle |
| Inactive, 4 - Disabled | as Inactive, 1 - Idle | `Over-Glass/Dark/Tracks/Inactive, Filled, 04 - Disabled` · #FFFFFF@10% | disabled | Disabled |

Center-biased filled part: `Track` #0A99FF. `Midpoint` in Visible Fill is #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} with blend plus-lighter. In Non-Visible Fill, Disabled it is #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} with blend plus-darker.

### Circular slider (Dial)

| Appearance · Context | State | Body: style · fill | `Grabber`: style · fill |
|---|---|---|---|
| Light · Content Area | 1 - Idle | `Content Area/Light/01 - Bordered/01 - Idle` · #000000@8% | `Global/Glyphs/Light/Neutral - 1 Idle` · #000000@70%, blend plus-darker |
| | 3 - Clicked | `…/01 - Bordered/03 - Clicked` · #000000@16% | `…/Neutral - 1 Idle` · #000000@70% |
| | 4 - Disabled | `…/01 - Bordered/04 - Disabled` · #000000@4% | `…/Neutral - 4 Disabled` · #000000@22%, blend plus-darker |
| Light · Over-glass | 1 - Idle | `Over-Glass/Light/01 - Bordered/01 - Idle` · #000000@12% (overlay) + #000000@7% (plus-darker) | as Content Area |
| | 3 - Clicked | `…/03 - Clicked` · #000000@12% (overlay) + #000000@13% (plus-darker) | as Content Area |
| | 4 - Disabled | `…/04 - Disabled` · #000000@6% (overlay) + #000000@2.5% (plus-darker) | #000000@22% |
| Dark · Content Area | 1 - Idle | `Content Area/Dark/01 - Bordered/01 - Idle` · #FFFFFF@7% | `Global/Glyphs/Dark/Neutral - 1 Idle` · #FFFFFF@70%, blend plus-lighter |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@16% | #FFFFFF@70% |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@4% | `…/Neutral - 4 Disabled` · #FFFFFF@22%, blend plus-lighter |
| Dark · Over-glass | 1 - Idle | `Over-Glass/Dark/01 - Bordered/01 - Idle` · #FFFFFF@12% (overlay) + #FFFFFF@5% (plus-lighter) | as Dark Content Area |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@12% (overlay) + #FFFFFF@13% (plus-lighter) | as Dark Content Area |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@6% (overlay) + #FFFFFF@2.5% (plus-lighter) | #FFFFFF@22% |

## Text

Not in the kit: no slider or dial component contains text (no value labels or tick labels). The only text on the page is the page headings, SFPro-Bold 60 ("Sliders", "Circular Slider (Dial)", "Light", "Dark") and SFPro-Semibold 30 kern −0.46 #000000@50% ("Content Area", "Over-Glass").

## Effects

| Where | Effect (exact) |
|---|---|
| Knob, idle and disabled (all) | shadow x0 y0.5 blur6 spread0 #000000@12%; corners max |
| `Knob` (clicked) | no fill. Inner shadows in order: x0 y-4 blur0.5 spread-4 #666666 (plus-lighter) · x0 y4 blur0.5 spread-4 #666666 (plus-lighter) · x0 y-1 blur0 spread-0.25 #171717 (plus-lighter) · x0 y1 blur0 spread-0.25 #171717 (plus-lighter) · x0 y20 blur20 spread-20 #F2F2F2 (plus-darker) · x0 y-40 blur10 spread-40 #333333 (plus-lighter) · x0 y40 blur10 spread-40 #333333 (plus-lighter). Then `blur glass radius0 saturation1 brightness1 distortion0.04 depth0.4 chromatic0.8`; corners 50. Identical in all 40 clicked knobs |
| `Knob Rim Shadow` (clicked) | border 1 outside #D9D9D9 (blend plus-darker), corners 50. Dark · Content Area: border 1 outside #000000@20% (blend plus-darker), corners max |
| `Knob Drop Shadow` (clicked) | border 1 inside #000000 · blur gaussian radius3 · opacity 50% · corners max. Sits lower than the knob by 7.5 (Lg, XL), 7 (Rg), 5 (Sm), 4.5 (Mn); ticked: 5 (Sm), 4 (Mn) (derived from y positions) |
| Over-glass unfilled track | two fills, the first with blend overlay and the second with plus-darker (Light) or plus-lighter (Dark). Light Inactive and all Dark Over-glass tracks also have a layer blend |
| Tick marks | Content Area Light: no blend except the centre mark (plus-darker). Over-glass Light: plus-darker. Over-glass Dark: plus-lighter |
| Centred-fill `Midpoint` | plus-darker (Light), plus-lighter (Dark Content Area, Dark Over-glass Visible Fill), plus-darker (Dark Over-glass Non-Visible Fill, Disabled) |
| Dial body and grabber | blends as listed in the dial table; no shadows |

## Kit notes

The page has no documentation boards and no written guidance. Its only text is the section headings: Sliders, Circular Slider (Dial), Light, Dark, Content Area and Over-Glass. Not in the kit: guidance on when to use ticks or centre-biased sliders, value labels, vertical sliders, keyboard focus rings and any animation.

Kit mix-ups worth knowing when copying values:

- Dark · Content Area sliders use the Light tick-mark parts, and their unfilled-track style names are `Content Area/Light/…` while the stored fill is the Dark #FFFFFF@10%.
- Light · Over-glass sliders override the filled bar with `Content Area/Light/…` styles for Clicked, Disabled and Inactive.
- Size swaps that point at the wrong size: all 2 Sm Light · Content Area Standard and Standard + Ticked sliders use `Knob and Track/1 Mn/50%` with a 2 Sm knob swapped in. Light · Content Area Center-biased `Active, 4 - Disabled` swaps in the 4 Lg disabled knob at Mn, Sm, Rg and XL. Light · Over-glass Center-biased + Ticked 2 Sm swaps in the 3 Rg ticked knob. Light · Over-glass Standard + Ticked `Inactive, 4 - Disabled` at 4 Lg and 5 XL swaps in the 1 Mn ticked knob.
- In the Over-glass `Tick Marks - Center-biased` parts the 75% mark layer is named `50%`.
- Content Area uses the part name `Knob and Track` and Over-glass uses `Track` for the same structure.

## Finding it in the spec

| Family | grep |
|---|---|
| All linear sliders | `grep -n '^COMPONENT "Sliders/\(Light\|Dark\)/' specs/sliders.txt` |
| One type and state | `grep -n '^COMPONENT "Sliders/Light/Content Area/Standard + Ticked/Active, 1 - Idle/' specs/sliders.txt` |
| Knobs | `grep -n '^COMPONENT "Sliders/􀻃/[^/]*/[^/]*/Knob\( - Ticked\)\?/' specs/sliders.txt` |
| Value positions | `grep -n '^COMPONENT "Sliders/􀻃/.*/\(Knob and Track\|Track\)/' specs/sliders.txt` |
| Centre-biased fill | `grep -n 'Knob and Track (Center)\|Tracks - Filled Centered' specs/sliders.txt` |
| Tick marks | `grep -n '^COMPONENT "Sliders/􀻃/.*/Tick Marks' specs/sliders.txt` |
| Filled bar | `grep -n 'Tracks/Track - Filled/Show' specs/sliders.txt` |
| Circular slider | `grep -n '^COMPONENT "Circular Slider (Dial)/' specs/sliders.txt` |
| Override styles on a slider | `grep -n 'style→' specs/sliders.txt` |
