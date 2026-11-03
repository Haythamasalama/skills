# Action Sheets — iOS 27

**Read when:** you need an exact iOS 27 value for action Sheets (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Action Sheets in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/action-sheets.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀍡 U+100361. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

4 components in two families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Action sheet | `Action Sheets/<Appearance>` | Light, Dark | 2 |
| Example screen | `Examples/Action Sheet/<Appearance>` | Light, Dark | 2 |

The buttons are the alert buttons from the Alerts page (`Alerts/􀻃/<Appearance>/2 Secondary` and `/3 Destructive`); see `references/alerts.md` for their sizes and colours.

## Anatomy

### Action sheet (`Action Sheets/Light`, `Action Sheets/Dark`)

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 260 × 524 | Liquid Glass panel, `corners 34`, `stack v gap0 pad14,14,14,14` |
| `Title and Message` | group | 232 × 100 @14,14 | `stack v gap10 pad8,8,24,8` |
| `Title` | text | 216 × 22 @8,8 | "A Short Title Is Best" |
| `Description` | text | 216 × 36 @8,40 | "A message should be a short, complete sentence." |
| `Buttons` | group | 232 × 396 @14,114 | `stack v gap10 pad0,0,0,0` |
| `Action 1` | instance | 232 × 48 @0,0 | → `Alerts/􀻃/<Appearance>/3 Destructive` |
| `Action 2` … `Action 7` | instances | 232 × 48 at y 58, 116, 174, 232, 290, 348 | → `Alerts/􀻃/<Appearance>/2 Secondary` |

The destructive action is first (top); the other six are secondary. There is no primary (filled blue) button in the sheet.

Derived checks:
- Title bottom 8 + 22 = 30, + gap 10 = description y 40.
- Description bottom 40 + 36 = 76, + bottom padding 24 = group height 100.
- Buttons: 7 × 48 + 6 × 10 = 396; each step is 58 = 48 + 10.
- Height: 14 + 100 + 396 + 14 = 524.
- Text width 216 = 232 − 8 − 8.

### Example screen (`Examples/Action Sheet/<Appearance>`)

| Part | Size @ position | Notes |
|---|---|---|
| Root | 402 × 874 | screen fill, `stack v gap0 pad62,16,0,16` |
| `Status Bar` | 402 × 62 @0,0 | → `Status Bars/iPhone 17 Pro/<Appearance> Background` |
| `Toolbar` | 402 × 56 @0,786 | → `Toolbars/<Appearance>/iPhone/Bottom/Controls` with glyph overrides 􀈎 U+10020E, 􀈑 U+100211, 􀍠 U+100360, 􀅼 U+10017C and two `isVisible→0`; Light also swaps in `Toolbars/􀻃/Light/Buttons - Symbol/Tinted` |
| `Overlay` | 402 × 874 @0,0 | → `Alerts/<Appearance>/Overlay` (a 200 × 200 master stretched to the screen) |
| `Action Sheet` | 260 × 424 @114,414 | → `Action Sheets/<Appearance>` with one `isVisible→0` |

Derived: in the example the sheet is 424 tall, 100 less than the master; 100 is the height of `Title and Message`, but the dump does not name the hidden layer. The sheet's right edge is at 114 + 260 = 374 (28 from the screen edge) and its bottom at 414 + 424 = 838, which overlaps the toolbar (y 786–842).

## Sizes

| Item | Value |
|---|---|
| Sheet | 260 × 524 (master), corner radius 34 |
| Sheet padding | 14 on every side |
| Title and Message padding | top 8, right 8, bottom 24, left 8; gap 10 |
| Button | 232 × 48 (alert-button master is 120 × 48, stretched) |
| Button gap | 10 |

## Colours and states

The page has one state per appearance.

| Part | Light | Dark |
|---|---|---|
| Panel | `Liquid Glass/Light/Regular - Large` (see Effects) | `Liquid Glass/Dark/Regular - Large` (see Effects) |
| Title | #000000 (no swatch) | #FFFFFF {Labels/Dark/1 Primary} |
| Description | #000000@68%, `blend plus-darker` (no swatch) | #FFFFFF@68%, `blend plus-lighter` (no swatch) |
| Destructive / secondary buttons | see `references/alerts.md` | see `references/alerts.md` |
| Example screen fill | #FFFFFF {Backgrounds/Light/Primary} | #000000 {Backgrounds/Dark - Base/Primary} |
| Overlay | `Alerts/Light/Overlay`: #29293A@23% | `Alerts/Dark/Overlay`: #121212@56% |

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Title | SFPro-Semibold | 17 | 22 | Not in the kit | above | left |
| Description | SFPro-Regular | 15 | Not in the kit (layer 36 tall) | Not in the kit | above | left |
| Button labels | see `references/alerts.md` (SFPro-Medium 17 lh22) | | | | | center |

No text style is bound. The alert's description uses 17 pt with lh22 and a vibrant label swatch; the action sheet's uses 15 pt with an unbound 68% white/black.

## Effects

The panel carries the Liquid Glass shared style plus the same values inline; only the corner radius differs from the style (the style stores `corners 20`, the sheet stores `corners 34`). Full style values are in `references/materials.md`.

| Effect | Light (`Liquid Glass/Light/Regular - Large`) | Dark (`Liquid Glass/Dark/Regular - Large`) |
|---|---|---|
| Fills (bottom first) | #FFFFFF@70% (blend lighten) + #BFBFBF@10% (blend darken) | #1A1A1A@50% + #1A1A1A@90% (blend luminosity) + #1A1A1A (blend lighten) |
| Inner shadows | x0 y-4 blur2 spread-4 #272727 (plus-lighter); x0 y4 blur8 spread-4 #272727 (plus-lighter); x0 y-1 blur1.5 spread-0.5 #272727 (plus-lighter); x0 y1 blur1.5 spread-0.5 #272727 (plus-lighter); x0 y2 blur0.25 spread-1.2 #FFFFFF | x0 y-4 blur8 spread-4 #222222 (plus-lighter); x0 y4 blur8 spread-4 #222222 (plus-lighter); x0 y-1 blur1.5 spread-0.5 #404040 (plus-lighter); x0 y1 blur1.5 spread-0.5 #404040 (plus-lighter); x0 y2 blur0.2 spread-1.2 #FFFFFF@20% |
| Shadows | x0 y18 blur46 spread0 #000000@25%; x0 y0 blur0.3 spread0.3 #DBDBDB (plus-darker); x-1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker); x1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker) | x0 y18 blur48 spread0 #000000@45%; x0 y0 blur0.3 spread0.3 #000000@50%; x-1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker); x1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker) |
| Glass | blur glass radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 | blur glass radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Corners | 34 smoothing0.6 style1 | 34 smoothing0.6 style1 |
| Description blend | plus-darker | plus-lighter |

## Kit notes

The header description is cut off in the dump; only its opening survives ("An action sheet is a modal view that pre…"). The example shows the sheet opened from a bottom toolbar over the full-screen `Overlay`, with the destructive choice on top. Not in the kit: a Cancel button, an iPad (popover) presentation, the sheet's anchor or arrow, and pressed states.

## Finding it in the spec

| Family | grep |
|---|---|
| Sheets | `grep -n -A12 '^COMPONENT "Action Sheets/' specs/action-sheets.txt` |
| Examples | `grep -n -A5 '^COMPONENT "Examples/Action Sheet/' specs/action-sheets.txt` |
| Button masters | `grep -n -A2 '^COMPONENT "Alerts/􀻃/' specs/alerts.txt` |
