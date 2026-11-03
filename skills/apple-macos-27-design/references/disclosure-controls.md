# Disclosure Controls — macOS 27

**Read when:** you need an exact macOS 27 value for disclosure Controls (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Disclosure Controls in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/disclosure-controls.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀁰 (U+100070).

## Components

120 components, one family: the disclosure button. This page has no disclosure-triangle component.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Disclosure button | `Disclosure Buttons/<Appearance>/<Context>/<Size>/<Direction>, <State>` | Appearance: Light, Dark · Context: Content Area, Over-glass · Size: 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL · Direction: Up, Down · State: 1 - Idle, 3 - Clicked, 4 - Disabled | 120 |

## Anatomy

| Layer | Kind | Notes |
|---|---|---|
| (component frame) | filled, rounded square | the button body; carries the shared style |
| glyph | one text layer named after its character, centred in the frame | Up: 􀆇 (U+100187). Down: 􀆈 (U+100188). Same in every size, state, appearance and context (checked across all 120) |

The text layer starts at @0,0 and fills the frame, except where noted in Sizes.

## Sizes

| Size | Button | Corners | Glyph font, Up | Glyph font, Down | Line height | Glyph frame Up | Glyph frame Down |
|---|---|---|---|---|---|---|---|
| 1 Mn | 16×16 | 4 | SFPro-Bold 10 | SFPro-Bold 8.5 | 16 | 16×15 | 16×16 |
| 2 Sm | 20×20 | 5 | SFPro-Bold 10 | SFPro-Bold 10 | 16 | 20×20 (Light · Over-glass: 20×19) | 20×20 |
| 3 Rg | 24×24 | 6 | SFPro-Semibold 13 | SFPro-Semibold 13 | 16 | 24×24 | 24×24 |
| 4 Lg | 28×28 | max | SFPro-Semibold 13 | SFPro-Semibold 13 | 16 | 28×28 | 28×28 |
| 5 XL | 36×36 | max | SFPro-Semibold 13 | SFPro-Semibold 13 | 16 | 36×36 | 36×36 |

- Corner smoothing is 0.6 everywhere. The corner style number is `style0` in Light · Over-glass and `style1` in the other three.
- Mn to Rg are rounded squares with radius = width / 4 (derived: 16/4, 20/4, 24/4). Lg and XL use `max`, which makes them circles.
- There is no padding to measure: the glyph is centred in a text frame the size of the button.

## Colours and states

| Appearance · Context | State | Body: style · fill | Glyph colour and blend |
|---|---|---|---|
| Light · Content Area | 1 - Idle | `Content Area/Light/01 - Bordered/01 - Idle` · #000000@8% | #000000@85% {Labels/Light/1 Primary}, plus-darker |
| | 3 - Clicked | `…/01 - Bordered/03 - Clicked` · #000000@16% | #000000@85% {Labels/Light/1 Primary}, plus-darker |
| | 4 - Disabled | `…/01 - Bordered/04 - Disabled` · #000000@4% | #000000@25% {Labels/Light/3 Tertiary}, plus-darker |
| Light · Over-glass | 1 - Idle | `Over-Glass/Light/01 - Bordered/01 - Idle` · #000000@12% (blend overlay) + #000000@7% (blend plus-darker) | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, plus-darker |
| | 3 - Clicked | `…/03 - Clicked` · #000000@12% (overlay) + #000000@13% (plus-darker) | #363636, plus-darker |
| | 4 - Disabled | no shared style · #000000@3% (blend plus-darker), layer blend plus-darker | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary}, plus-darker |
| Dark · Content Area | 1 - Idle | `Content Area/Dark/01 - Bordered/01 - Idle` · #FFFFFF@7% | #FFFFFF {Labels/Dark/1 Primary}, plus-lighter |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@16% | #FFFFFF {Labels/Dark/1 Primary}, plus-lighter |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@4% | #FFFFFF@25% {Labels/Dark/3 Tertiary}, plus-lighter |
| Dark · Over-glass | 1 - Idle | `Over-Glass/Dark/01 - Bordered/01 - Idle` · #FFFFFF@12% (overlay) + #FFFFFF@5% (plus-lighter) | #FFFFFF {Labels/Dark/1 Primary}, plus-lighter |
| | 3 - Clicked | `…/03 - Clicked` · #FFFFFF@12% (overlay) + #FFFFFF@13% (plus-lighter) | #FFFFFF, plus-lighter |
| | 4 - Disabled | `…/04 - Disabled` · #FFFFFF@6% (overlay) + #FFFFFF@2.5% (plus-lighter) | #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary}, plus-lighter |

Up and Down have identical colours in every state (checked). The kit has no hover or focus state on this page.

## Text

| Part | Font | Size | Line height | Tracking | Alignment | Colour |
|---|---|---|---|---|---|---|
| Glyph, 1 Mn | SFPro-Bold | 10 (Up), 8.5 (Down) | 16 | Not in the kit | center | per state |
| Glyph, 2 Sm | SFPro-Bold | 10 | 16 | Not in the kit | center | per state |
| Glyph, 3 Rg – 5 XL | SFPro-Semibold | 13 | 16 | Not in the kit | center | per state |

No text style name is attached to the glyphs.

## Effects

| Where | Effect |
|---|---|
| Over-glass bodies | two-fill stack: first fill blend overlay, second plus-darker (Light) or plus-lighter (Dark) |
| Light · Over-glass disabled body | single fill #000000@3% with fill and layer blend plus-darker |
| Glyphs | blend plus-darker (Light) or plus-lighter (Dark), in both contexts |
| Shadows, blurs, glass | none on this page |

## Kit notes

The page has no documentation boards. Its only text is the headings Disclosure Button, Light, Dark, Content Area and Over-Glass. The page is named Disclosure Controls but holds only the button (`Disclosure Buttons/…`).

Kit inconsistencies:

- Light · Over-glass `4 - Disabled` has no shared style. Its single #000000@3% fill does not match `Over-Glass/Light/01 - Bordered/04 - Disabled`, which the other controls use.
- The Dark · Over-glass disabled glyph uses a Fills swatch ({Fills/Dark Vibrant (use plus lighter)/3 Tertiary}) where the other contexts use a Labels swatch.
- The 1 Mn Up and Down glyphs use different point sizes (10 and 8.5).

## Finding it in the spec

| Family | grep |
|---|---|
| All buttons | `grep -n -A1 '^COMPONENT "Disclosure Buttons/' specs/disclosure-controls.txt` |
| One appearance and context | `grep -n -A1 '^COMPONENT "Disclosure Buttons/Light/Over-glass/' specs/disclosure-controls.txt` |
| One size | `grep -n -A1 '^COMPONENT "Disclosure Buttons/[^/]*/[^/]*/3 Rg/' specs/disclosure-controls.txt` |
| Disabled states | `grep -n '4 - Disabled"' specs/disclosure-controls.txt` |
