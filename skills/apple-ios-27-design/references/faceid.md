# FaceID — iOS 27

**Read when:** you need an exact iOS 27 value for faceID (size, colour, text, effect) as Apple's kit draws it.
**Owns:** FaceID in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, kit notes.

Source: `specs/faceid.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀎽 U+1003BD.

## Components

2 components, one family with a single axis (state).

| Family | Name pattern | State values | Count |
|---|---|---|---|
| FaceID | `FaceID/<State>` | Authenticating, Success | 2 |

Both are 402 × 170.

## Anatomy

| Part (layer) | Kind | Size @ position | Authenticating | Success |
|---|---|---|---|---|
| Root | component | 402 × 170 | `stack v gap0 pad10,0,0,0` | same |
| `Bezel` | group | 143 × 145 @129.5,10 | fill, corners (see Colours) | same, plus `stack v gap0 pad0,0,0,0` |
| `Face ID` | shape | 70 × 70 @36.5,37.5 | filled vector shape | — |
| `Frame` | group | 70 × 70 @36.5,37.5 | — | holds `Oval` and the glyph |
| `Oval` | oval | 70 × 70 @0,0 | — | ring (border only) |
| `􀆅` | text | 70 × 70 @0,-0.5 | — | glyph 􀆅 U+100185 |

Derived:
- Bezel horizontal centring: (402 − 143) / 2 = 129.5 = bezel x, so the bezel is centred.
- Bezel top inset 10 = root top padding 10.
- Glyph area inset inside the bezel: x 36.5 = (143 − 70) / 2; y 37.5 = (145 − 70) / 2. Centred both ways.

## Sizes

| Item | Value |
|---|---|
| Component | 402 × 170 |
| Bezel | 143 × 145, corner radius 40 (`corners 40 smoothing0.6 style1`) |
| Symbol area | 70 × 70 |
| Success ring | 70 × 70, border 4.5 inside |
| Success glyph | SFPro-Medium 42, centred, no line height stored |

## Colours and states

The page has one appearance (no Light / Dark axis).

| State | Bezel fill | Symbol |
|---|---|---|
| Authenticating | #000000 | `Face ID` shape fill #87FA89 |
| Success | #000000 | `Oval` border 4.5 inside #87FA89; glyph 􀆅 U+100185 text colour #87FA89 |

#87FA89 is not bound to a kit swatch. No shadows, blurs or blend modes are stored on this page.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Success glyph `􀆅` | SFPro-Medium | 42 | Not in the kit | Not in the kit | #87FA89 | center |

No text style is bound.

## Kit notes

The page header (`_Header` instance, text "FaceID") hides its description (`isVisible→0`), so the page carries no written guidance. Not in the kit: animation between Authenticating and Success, durations, a failure state, Light/Dark variants.

## Finding it in the spec

| Family | grep |
|---|---|
| All | `grep -n '^COMPONENT "FaceID/' specs/faceid.txt` |
| One state with children | `grep -n -A5 'FaceID/Success"' specs/faceid.txt` |
