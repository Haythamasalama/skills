# Alerts — macOS 27

**Read when:** you need an exact macOS 27 value for alerts (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Alerts in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/alerts.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

14 components in four families. `􀻃` (U+100EC3) is the path segment the kit puts in front of building-block components.

| Family | Variant axes | Components |
|---|---|---|
| `Alerts/<Appearance>/<Layout>` | Appearance: `Light`, `Dark` · Layout: `Side by Side`, `Stacked` | 4 |
| `Alerts/􀻃/<Appearance>/Buttons/<Role>` | Role: `Preferred`, `Destructive`, `Cancel` | 6 |
| `Alerts/􀻃/<Appearance>/Background` | — | 2 |
| `Alerts/<Appearance>/Window Modal Overlay` | — | 2 |

The page has no documentation boards; its only free text layers are the page title ("Alerts") and the "Light" / "Dark" headings. The alerts carry no app icon layer.

## Anatomy

### Side by Side (260 × 170) and Stacked (260 × 238)

The alert is an auto layout `stack v gap14 pad20,16,16,16`.

| Layer | Kind | Side by Side | Stacked | Notes |
|---|---|---|---|---|
| `BG` | use → `Alerts/􀻃/<Appearance>/Background` | 260×170 @0.5,0 | 260×238 @0,0 | glass background |
| `Title and Description` | group | 228×92 @16,20 | 228×92 @16,20 | `stack v gap10 pad0,6,2,6` |
| ↳ `Title` | text | 216×16 @6,0 | same | "Save this message as a draft?" |
| ↳ `Description` | text | 216×64 @6,26 | same | "This message has not been sent and contains unsaved changes. You can save it as …" |
| `Buttons` | group | 228×28 @16,126, `stack h gap8` | 228×96 @16,126, `stack v gap6` | |
| ↳ `Button 1` | use | 110×28 @0,0 → `Buttons/Cancel` | 228×28 @0,0 → `Buttons/Preferred` | |
| ↳ `Button 2` | use | 110×28 @118,0 → `Buttons/Preferred` | 228×28 @0,34 → `Buttons/Destructive` | |
| ↳ `Button 3` | use | — | 228×28 @0,68 → `Buttons/Cancel` | |

- Side by Side: Cancel on the left, Preferred on the right.
- Stacked: Preferred on top, then Destructive, then Cancel at the bottom.

### Buttons (`Alerts/􀻃/<Appearance>/Buttons/<Role>`, 228 × 28)

| Role | Layers |
|---|---|
| Preferred | frame fill (see Colours) · text `Save` 30×16 @99,6 "Save" |
| Destructive | rect `Red BG` 228×28 @0,0 (`corners 0`, inside the rounded frame) · text `Label` 68×16 @80,6 "Don’t Save" |
| Cancel | frame fill · text `Label` 43×16 @92.5,6 "Cancel" |

All three: `corners max smoothing0.6 style1` (capsule), `stack h gap0 pad0,8,0,8`, label centred.

### Background and overlay

| Component | Size | Notes |
|---|---|---|
| `Alerts/􀻃/<Appearance>/Background` | 300 × 300 | glass style, corners 26 |
| `Alerts/<Appearance>/Window Modal Overlay` | 100 × 100 | flat fill, corners 0 |

## Sizes

| Property | Side by Side | Stacked |
|---|---|---|
| Alert size | 260 × 170 | 260 × 238 |
| Corner radius | 26 (from `Background`) | 26 |
| Padding (top, right, bottom, left) | 20, 16, 16, 16 | 20, 16, 16, 16 |
| Gap between text block and buttons | 14 | 14 |
| Text inset inside the text group | 6 left and right, 2 bottom | same |
| Title → description gap | 10 (derived: description y 26 = title height 16 + 10) | same |
| Button width | 110 | 228 (full width) |
| Button height | 28 | 28 |
| Gap between buttons | 8 (horizontal) | 6 (vertical) |
| Button corner radius | max (capsule) | max |
| Button padding | 0, 8, 0, 8 | 0, 8, 0, 8 |
| Height check | derived: 20 + 92 + 14 + 28 + 16 = 170 | derived: 20 + 92 + 14 + 96 + 16 = 238 |
| Alert width check | derived: 16 + 228 + 16 = 260 | same |

## Colours and states

Only the idle state is drawn; there are no hover, pressed or disabled alert buttons.

### Buttons

| Appearance | Role | Background | Label colour | Label blend |
|---|---|---|---|---|
| Light | Preferred | #0088FF {System Colors/Light/8 Blue} | #FFFFFF (not bound) | — |
| Light | Destructive | `Red BG` #F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red} (blend plus-darker), layer opacity 23% | #F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red} | — |
| Light | Cancel | #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} (blend plus-darker); layer blend plus-darker | #000000@85% {Labels/Light/1 Primary} | plus-darker |
| Dark | Preferred | #0091FF {System Colors/Dark/8 Blue} | #FFFFFF (not bound) | — |
| Dark | Destructive | `Red BG` #FF4747 {System Colors/Dark (use plus lighter)/1 Red} (blend plus-lighter), layer opacity 25% | #FF4747 {System Colors/Dark (use plus lighter)/1 Red} | — |
| Dark | Cancel | #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} (blend plus-lighter); layer blend plus-darker, as stored | #FFFFFF {Labels/Dark/1 Primary} | plus-lighter |

The Destructive label layer also carries a fill of the same red.

### Text block

| Appearance | Title | Description |
|---|---|---|
| Light | #000000@85% {Labels/Light/1 Primary}, blend plus-darker | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, blend plus-darker |
| Dark | #FFFFFF {Labels/Dark/1 Primary}, blend plus-lighter | #FFFFFF {Labels/Dark/1 Primary}, blend plus-lighter |

### Background and overlay

| Appearance | Background style | Window Modal Overlay |
|---|---|---|
| Light | `Liquid Glass/Light/Regular - Large`, corners 26 | #ABABAB@60% |
| Dark | `Liquid Glass/Dark/Regular - Large`, corners 26 | #171717@62% |

## Text

| Part | Font | Size | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| Title | SFPro-Bold | 13 | 16 | — | left |
| Description | SFPro-Regular | 13 | 16 | — | left |
| Button label | SFPro-Medium | 13 | 16 | — | center |

No layer is bound to a shared text style. By value, Title matches `05 Headline/Default` (SFPro-Bold 13 / 16) and Description matches `06 Body/Default` (SFPro-Regular 13 / 16); the button label (Medium) matches none.

## Effects

The `Background` components use the Large glass styles with only the corner radius changed (26 instead of the style's 20).

**Light (`Liquid Glass/Light/Regular - Large`)**

- fill #FFFFFF@70% (blend lighten) + #BFBFBF@10% (blend darken)
- shadow x0 y18 blur46 spread0 #000000@25%
- inner-shadow x0 y-4 blur8 spread-4 #272727 (blend plus-lighter)
- inner-shadow x0 y4 blur8 spread-4 #272727 (blend plus-lighter)
- inner-shadow x0 y-1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
- inner-shadow x0 y1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
- inner-shadow x0 y2 blur0.25 spread-1.5 #FFFFFF
- shadow x0 y0 blur0.3 spread0.3 #DBDBDB@50% (blend plus-darker)
- shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- blur glass radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0
- corners 26 smoothing0.6 style1

**Dark (`Liquid Glass/Dark/Regular - Large`)**

- fill #1A1A1A@50% + #1A1A1A@50% (blend luminosity) + #1A1A1A (blend lighten)
- shadow x0 y18 blur48 spread0 #000000@45%
- shadow x0 y0 blur0.3 spread0.3 #A6A6A6@80% (blend plus-darker)
- inner-shadow x0 y-4 blur8 spread-4 #343434 (blend plus-lighter)
- inner-shadow x0 y4 blur8 spread-4 #343434 (blend plus-lighter)
- inner-shadow x0 y-1 blur1.5 spread-0.5 #676767 (blend plus-lighter)
- inner-shadow x0 y1 blur1.5 spread-0.5 #676767 (blend plus-lighter)
- inner-shadow x0 y2 blur0.2 spread-1.2 #FFFFFF@20%
- shadow x1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
- shadow x-1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
- blur glass radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0
- corners 26 smoothing0.6 style1

**Blend modes on text and buttons**

- Light: text and the Cancel fill use plus-darker; the destructive red uses the Light Vibrant red with plus-darker.
- Dark: text and the Cancel fill use plus-lighter; the destructive red uses the Dark (use plus lighter) red with plus-lighter.

## Finding it in the spec

| Family | grep |
|---|---|
| Alert layouts | `grep -n '^COMPONENT "Alerts/\(Light\|Dark\)/\(Side\|Stacked\)' specs/alerts.txt` |
| Buttons | `grep -n '^COMPONENT "Alerts/.*/Buttons/' specs/alerts.txt` |
| Backgrounds | `grep -n '^COMPONENT "Alerts/.*/Background' specs/alerts.txt` |
| Modal overlays | `grep -n 'Window Modal Overlay' specs/alerts.txt` |
