# Popovers — macOS 27

**Read when:** you need an exact macOS 27 value for popovers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Popovers in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects.

Source: `specs/popovers.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, `Popovers/<Appearance>/<Edge>-<Position>`. 24 components.

| Axis | Values |
|---|---|
| Appearance | `Light`, `Dark` |
| Edge-Position | `North-Leading`, `North-Center`, `North-Trailing`, `South-Leading`, `South-Center`, `South-Trailing`, `East-Top`, `East-Middle`, `East-Bottom`, `West-Top`, `West-Middle`, `West-Bottom` |

2 appearances × 12 positions = 24. The page has no documentation boards; its only free text layers are the page title ("Popovers") and the "Light" / "Dark" headings.

## Anatomy

Every one of the 24 components has the same two-level structure and the same numbers (checked with grep across all variants):

| Layer | Kind | Size | Position | Notes |
|---|---|---|---|---|
| (component) | frame | 230 × 230 | — | `corners 0 smoothing0.6 style1` |
| `Popover` | shape | 230 × 249 | @0,-19 | carries the glass style |

- The `Popover` shape is 19 taller than the frame and starts 19 above it (derived: 249 − 230 = 19, y −19). This is the same for North, South, East and West variants.
- The shape's outline (where the arrow sits for each Edge-Position) is a vector path that the dump does not include, so the arrow's size, shape and offset are Not in the kit as numbers.
- There is no content, title or padding layer inside the popover.

## Sizes

| Property | Value |
|---|---|
| Component frame | 230 × 230 (all 24) |
| Popover shape | 230 × 249 @0,-19 (all 24) |
| Corner radius on the shape | Not stored on the layer; the style it uses, `Liquid Glass/<Appearance>/Regular - Medium`, stores `corners 20 smoothing0.6 style1` |
| Arrow width, height, offset | Not in the kit |
| Content padding | Not in the kit |

## Colours and states

One state per appearance. The `Popover` shape uses a shared layer style with no overrides.

| Appearance | Shared style | Fill (bottom first) |
|---|---|---|
| Light | `Liquid Glass/Light/Regular - Medium` | #FFFFFF@70% (blend lighten) + #BFBFBF@10% (blend darken) |
| Dark | `Liquid Glass/Dark/Regular - Medium` | #1A1A1A@50% + #1A1A1A@90% (blend luminosity) + #1A1A1A (blend lighten) |

## Effects

Copied from the `Popover` layers; they match the styles in `materials.md`.

**Light (`Liquid Glass/Light/Regular - Medium`)**

- shadow x0 y18 blur46 spread0 #000000@25%
- inner-shadow x0 y-4 blur2 spread-4 #272727 (blend plus-lighter)
- inner-shadow x0 y4 blur8 spread-4 #272727 (blend plus-lighter)
- inner-shadow x0 y-1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
- inner-shadow x0 y1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
- inner-shadow x0 y2 blur0.25 spread-1.2 #FFFFFF
- shadow x0 y0 blur0.3 spread0.3 #DBDBDB (blend plus-darker)
- shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- blur glass radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0

**Dark (`Liquid Glass/Dark/Regular - Medium`)**

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

## Finding it in the spec

| Family | grep |
|---|---|
| All popovers | `grep -n '^COMPONENT "Popovers/' specs/popovers.txt` |
| One appearance | `grep -n '^COMPONENT "Popovers/Dark/' specs/popovers.txt` |
| The shapes (check geometry) | `grep -n 'shape "Popover"' specs/popovers.txt \| cut -c1-80` |
