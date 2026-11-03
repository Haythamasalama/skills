# Tooltips — macOS 27

**Read when:** you need an exact macOS 27 value for tooltips (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Tooltips in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/tooltips.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, `Tooltips`, with one axis: appearance (`Light`, `Dark`). 2 components.

| Component | Size |
|---|---|
| `Tooltips/Light` | 98 × 19 |
| `Tooltips/Dark` | 98 × 19 |

The page has no documentation boards; its only free text layers are the page title ("Tooltips") and the "Light" / "Dark" headings.

## Anatomy

| Layer | Kind | Size | Position | Notes |
|---|---|---|---|---|
| (component) | auto layout | 98 × 19 | — | `stack h gap0 pad3,6,3,6` |
| `Label` | text | 86 × 13 | @6,3 | "This is a tooltip." |

There is no arrow, icon or second line in either variant.

## Sizes

| Property | Value |
|---|---|
| Size | 98 × 19 (hugs the sample label) |
| Padding (top, right, bottom, left) | 3, 6, 3, 6 |
| Height | 19 (derived: 3 + 13 + 3) |
| Width | 98 (derived: 6 + 86 + 6) |
| Corner radius | `corners 0 smoothing0.6 style1`, as stored (square corners) |
| Minimum or maximum width | Not in the kit |

## Colours and states

Only one state per appearance is drawn.

| Appearance | Background fill | Border / inner rim | Label colour | Label blend |
|---|---|---|---|---|
| Light | #E7E7E7@85% | none | #4C4C4C (not bound to a swatch) | plus-darker |
| Dark | #262626@80% | inner-shadow x0 y0 blur0 spread0.6 #FFFFFF@15% | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | plus-lighter |

Neither variant uses a shared layer style.

## Text

| Part | Font | Size | Line height | Tracking | Colour |
|---|---|---|---|---|---|
| `Label` | SFPro-Medium | 11 | 13 | — | see the table above |

The label isn't bound to a shared text style. No text style in `text-styles.md` uses SFPro-Medium.

## Effects

| Appearance | Shadows (bottom first, as stored) | Background blur |
|---|---|---|
| Light | shadow x0 y2 blur8 spread0 #000000@20% · shadow x0 y0 blur2 spread0 #000000@40% | blur background radius45 saturation1.8 |
| Dark | shadow x0 y2 blur8 spread0 #000000@20% · shadow x0 y0 blur2 spread0 #000000@40% · inner-shadow x0 y0 blur0 spread0.6 #FFFFFF@15% | blur background radius45 saturation2 |

Tooltips use a background blur, not Liquid Glass (`blur glass`).

## Finding it in the spec

| Family | grep |
|---|---|
| Both tooltips | `grep -n '^COMPONENT "Tooltips/' specs/tooltips.txt` |
| Labels | `grep -n 'text "Label"' specs/tooltips.txt` |
