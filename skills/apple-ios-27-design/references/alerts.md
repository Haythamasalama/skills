# Alerts — iOS 27

**Read when:** you need an exact iOS 27 value for alerts (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Alerts in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/alerts.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀇾 U+1001FE. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

18 components in four families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Alert | `Alerts/<Appearance>/<Layout>` | Appearance: Light, Dark. Layout: Default, Buttons Stacked, Input Field x 1, Input Field x 2 | 8 |
| Alert button | `Alerts/􀻃/<Appearance>/<Role>` | Appearance: Light, Dark. Role: 1 Primary, 2 Secondary, 3 Destructive | 6 |
| Overlay | `Alerts/<Appearance>/Overlay` | Light, Dark | 2 |
| Example screen | `Examples/Alert/<Appearance>` | Light, Dark | 2 |

The alert buttons are also the action-sheet buttons (`references/action-sheets.md`). The input alerts use `Text Fields/<Appearance>/Default` and `/Placeholder` (`references/text-fields.md`).

## Anatomy

### Alert (all 8)

Every alert has the same root and title block (checked across all 8 with grep):

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 300 × H (below) | Liquid Glass panel, `corners 34`, `stack v gap0 pad14,14,14,14` |
| `Title and Message` | group | 272 × 108 @14,14 | `stack v gap10 pad8,8,24,8` |
| `Title` | text | 256 × 22 @8,8 | "A Short Title Is Best" |
| `Description` | text | 256 × 44 @8,40 | "A message should be a short, complete sentence." (two lines of lh22) |

Then, per layout:

| Layout | Height | Text input | Buttons group | Buttons (left → right or top → bottom) |
|---|---|---|---|---|
| Default | 184 | — | 272 × 48 @14,122, `stack h gap8` | `Leading Action` 132 × 48 @0,0 → 2 Secondary ("Secondary"); `Trailing Action` 132 × 48 @140,0 → 1 Primary ("Primary") |
| Buttons Stacked | 304 | — | 272 × 168 @14,122, `stack v gap12` | `Action 1` 272 × 48 @0,0 → 1 Primary ("Primary Button"); `Action 2` @0,60 → 3 Destructive ("Destructive Button"); `Action 3` @0,120 → 2 Secondary ("Secondary Button") |
| Input Field x 1 | 255 | `Text Input` 272 × 52 @14,122, `corners max`, `stack v gap0`; one field 272 × 52 @0,0 → `Text Fields/<App>/Placeholder` | 272 × 67 @14,174, `stack h gap8 pad19,0,0,0` | `Leading Action` 132 × 48 @0,19 → 2 Secondary ("Button 1"); `Trailing Action` 132 × 48 @140,19 → 2 Secondary ("Button 2") |
| Input Field x 2 | 307 | `Text Input` 272 × 104 @14,122, `corners 26`, `stack v gap0`; fields 272 × 52 @0,0 → `…/Default` and @0,52 → `…/Placeholder` | 268 × 67 @16,226, `stack h gap8 pad19,0,0,0` | `Leading Action` 130 × 48 @0,19 → 2 Secondary ("Button 1"); `Trailing Action` 130 × 48 @138,19 → 2 Secondary ("Button 2") |

Derived checks:
- Title block: 8 + 22 + 10 + 44 + 24 = 108.
- Default: 14 + 108 + 48 + 14 = 184. Two buttons: 132 + 8 + 132 = 272.
- Buttons Stacked: 3 × 48 + 2 × 12 = 168; 14 + 108 + 168 + 14 = 304.
- Input Field x 1: 14 + 108 + 52 + 67 + 14 = 255; the buttons sit 19 below the field (top padding 19).
- Input Field x 2: 14 + 108 + 104 + 67 + 14 = 307. Its buttons group is 268 wide at x 16 (2 narrower each side than the other layouts); 130 + 8 + 130 = 268.

### Alert button (`Alerts/􀻃/<Appearance>/<Role>`)

| Part | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 120 × 48 | `corners max` (capsule) |
| `Label` | text | 88 × 22 @16,13 | centred text |

Derived: label inset 16 left and right (120 − 88 = 32), 13 top and bottom ((48 − 22) / 2 = 13). Instances stretch the master to 132, 130, 232 or 272 wide.

### Overlay (`Alerts/<Appearance>/Overlay`)

| Part | Kind | Size @ position |
|---|---|---|
| Root | component | 200 × 200, root fill #FFFFFF |
| `Overlay` | rect | 200 × 200 @0,0, `corners 0` |

Stretched to 402 × 874 in the examples.

### Example screen (`Examples/Alert/<Appearance>`)

| Part | Size @ position | Uses |
|---|---|---|
| Root | 402 × 874, `stack v gap0 pad62,16,0,16` | screen fill |
| `Status Bar` | 402 × 62 @0,0 | `Status Bars/iPhone 17 Pro/<Appearance> Background` |
| `Overlay` | 402 × 874 @0,0 | `Alerts/<Appearance>/Overlay` |
| `Alerts` | 300 × 184 @51,372 | `Alerts/<Appearance>/Default` |

Derived: the alert is centred horizontally ((402 − 300) / 2 = 51). Its vertical centre is 372 + 92 = 464, which is 27 below the screen centre (437).

## Sizes

| Item | Width × height | Corner radius | Padding | Gap |
|---|---|---|---|---|
| Alert, Default | 300 × 184 | 34 | 14 all sides | 0 (root stack) |
| Alert, Buttons Stacked | 300 × 304 | 34 | 14 | 0 |
| Alert, Input Field x 1 | 300 × 255 | 34 | 14 | 0 |
| Alert, Input Field x 2 | 300 × 307 | 34 | 14 | 0 |
| Title and Message | 272 × 108 | — | 8, 8, 24, 8 (top, right, bottom, left) | 10 |
| Side-by-side buttons | 132 × 48 (130 × 48 in Input Field x 2) | max | — | 8 |
| Stacked buttons | 272 × 48 | max | — | 12 |
| Text input, one field | 272 × 52 | max | — | — |
| Text input, two fields | 272 × 104 | 26 | — | 0 |
| Button master | 120 × 48 | max | label inset 16 / 13 (derived) | — |

## Colours and states

The alert panel uses one Liquid Glass style per appearance (see Effects). Only one state is drawn per button; there are no pressed or disabled alert buttons.

### Alert text

| Part | Light | Dark |
|---|---|---|
| Title | #000000 {Labels/Light - Vibrant/1 Primary}, `blend plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `blend plus-lighter` |
| Description | #999999 {Labels/Light - Vibrant/2 Secondary}, `blend plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `blend plus-lighter` |

### Alert buttons

| Appearance / Role | Button fill (bottom first) | Label |
|---|---|---|
| Light / 1 Primary | #FFFFFF@67% + #0088FF {System Colors/Light/8 Blue} (blend plus-darker) | SFPro-Semibold 17, #FFFFFF |
| Light / 2 Secondary | #767680@12% {Fills/Light/3 Tertiary} (blend plus-darker) | SFPro-Medium 17, #000000 {Labels/Light/1 Primary} |
| Light / 3 Destructive | #767680@12% {Fills/Light/3 Tertiary} (blend plus-darker) | SFPro-Medium 17, text colour #FFFFFF with text fill #FFFFFF@67% + #FF383C {System Colors/Light/1 Red} (blend plus-darker) |
| Dark / 1 Primary | #000000@67% + #0091FF {System Colors/Dark/8 Blue} (blend plus-lighter) | SFPro-Semibold 17, #FFFFFF |
| Dark / 2 Secondary | #767680@24% {Fills/Dark/3 Tertiary} (blend plus-lighter) | SFPro-Medium 17, #FFFFFF {Labels/Dark/1 Primary} |
| Dark / 3 Destructive | #767680@24% {Fills/Dark/3 Tertiary} (blend plus-lighter) | SFPro-Medium 17, text colour #FFFFFF with text fill #000000@67% + #FF4245 {System Colors/Dark/1 Red} (blend plus-lighter) |

The destructive label's visible colour comes from the fills on the text layer, which repeat the primary button's two-fill recipe with red instead of blue.

### Text input container

| Appearance | Fill |
|---|---|
| Light | #767680@12% {Fills/Light/3 Tertiary} |
| Dark | #767680@24% {Fills/Dark/3 Tertiary} |

The fields inside are the text-field rows (separator borders, value and placeholder colours in `references/text-fields.md`).

### Overlay and screens

| Part | Light | Dark |
|---|---|---|
| `Overlay` rect | #29293A@23% | #121212@56% |
| Overlay root fill | #FFFFFF | #FFFFFF |
| Example screen fill | #FFFFFF {Backgrounds/Light/Primary} | #000000 {Backgrounds/Dark - Base/Primary} |

The overlay colours are not bound to swatches.

## Text

| Part | Font | Size | Line height | Tracking | Align |
|---|---|---|---|---|---|
| Title | SFPro-Semibold | 17 | 22 | Not in the kit | left |
| Description | SFPro-Regular | 17 | 22 | Not in the kit | left |
| Primary button label | SFPro-Semibold | 17 | 22 | Not in the kit | center |
| Secondary / destructive label | SFPro-Medium | 17 | 22 | Not in the kit | center |

No text style is bound on this page. The title and description are left-aligned.

## Effects

Every alert root carries the shared style plus the same values inline; the corner radius is overridden from the style's `corners 20` to `corners 34` (all 8 roots store the identical effect string per appearance; checked with grep). Full style entries are in `references/materials.md`.

| Effect | Light: `Liquid Glass/Light/Regular - Large` | Dark: `Liquid Glass/Dark/Regular - Large` |
|---|---|---|
| Fills (bottom first) | #FFFFFF@70% (blend lighten) + #BFBFBF@10% (blend darken) | #1A1A1A@50% + #1A1A1A@90% (blend luminosity) + #1A1A1A (blend lighten) |
| Inner shadows | x0 y-4 blur2 spread-4 #272727 (plus-lighter); x0 y4 blur8 spread-4 #272727 (plus-lighter); x0 y-1 blur1.5 spread-0.5 #272727 (plus-lighter); x0 y1 blur1.5 spread-0.5 #272727 (plus-lighter); x0 y2 blur0.25 spread-1.2 #FFFFFF | x0 y-4 blur8 spread-4 #222222 (plus-lighter); x0 y4 blur8 spread-4 #222222 (plus-lighter); x0 y-1 blur1.5 spread-0.5 #404040 (plus-lighter); x0 y1 blur1.5 spread-0.5 #404040 (plus-lighter); x0 y2 blur0.2 spread-1.2 #FFFFFF@20% |
| Shadows | x0 y18 blur46 spread0 #000000@25%; x0 y0 blur0.3 spread0.3 #DBDBDB (plus-darker); x-1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker); x1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker) | x0 y18 blur48 spread0 #000000@45%; x0 y0 blur0.3 spread0.3 #000000@50%; x-1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker); x1.25 y0 blur0 spread-0.75 #BFBFBF (plus-darker) |
| Glass | blur glass radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 | blur glass radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 |
| Corners | 34 smoothing0.6 style1 | 34 smoothing0.6 style1 |

Blend modes on content: Light text and button fills use `plus-darker`; Dark uses `plus-lighter`.

## Kit notes

The header description is cut off in the dump; it begins by saying an alert gives people critical information. The examples centre a Default alert horizontally over the full-screen `Overlay` (a translucent dark rect). Not in the kit: pressed or disabled alert buttons, a three-button side-by-side layout, alert width on iPad, and any motion values.

## Finding it in the spec

| Family | grep |
|---|---|
| Alerts | `grep -n '^COMPONENT "Alerts/\(Light\|Dark\)/' specs/alerts.txt` |
| One alert with children | `grep -n -A12 'COMPONENT "Alerts/Light/Input Field x 2"' specs/alerts.txt` |
| Buttons | `grep -n -A1 '^COMPONENT "Alerts/􀻃/' specs/alerts.txt` |
| Overlays | `grep -n -A1 'Overlay" 200' specs/alerts.txt` |
| Examples | `grep -n -A3 '^COMPONENT "Examples/Alert/' specs/alerts.txt` |
