# Popovers — iOS 27

**Read when:** you need an exact iOS 27 value for popovers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Popovers in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/popovers.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀌸 U+100338.

## Components

26 components in two families. The kit labels the whole page iPad only.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Popover | `Popovers (iPad Only)/<Appearance>/<Arrow edge> <Arrow position>` | Appearance: Light, Dark. Arrow: Top Leading, Top Middle, Top Trailing, Bottom Leading, Bottom Middle, Bottom Trailing, Leading Top, Leading Middle, Leading Bottom, Trailing Top, Trailing Middle, Trailing Bottom | 24 (2 × 12) |
| Presentation controller | `Popovers (iPad Only)/<Appearance> - Presentation Controller` | Light, Dark | 2 |

The colour picker page uses these popovers for its iPad picker (`references/color-pickers.md`).

## Anatomy

### Popover (all 24)

Every popover has the same three layers; only the `Cartouche` (the arrow) moves (checked across all 24 with a script).

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 130 × 130 | stored root fill (see Colours) |
| `Shadow` | group | 104 × 116 @14,0 | drop shadow for the whole popover |
| `Background` | rect | 102 × 102 @0,14 | material, `corners 13` |
| `Cartouche` | path | 56 × 13 (top/bottom edge) or 13 × 56 (leading/trailing edge) | material, `corners 0` |

Derived: inside the root, the `Background` spans x 14–116, y 14–116 (a 102 × 102 body with 14 free on every side for the arrow). Its position does not change between variants.

### Arrow (`Cartouche`) positions

Positions are inside `Shadow`; absolute = + (14, 0). Spans are derived.

| Variant | Cartouche size @ position | Absolute span | Sits |
|---|---|---|---|
| Top Leading | 56 × 13 @39,1 | x 53–109, y 1–14 | above the body, right of centre |
| Top Middle | 56 × 13 @23,1 | x 37–93, y 1–14 | above, centred (37 + 28 = 65 = body centre) |
| Top Trailing | 56 × 13 @7,1 | x 21–77, y 1–14 | above, left of centre |
| Bottom Leading | 56 × 13 @7,116 | x 21–77, y 116–129 | below, left of centre |
| Bottom Middle | 56 × 13 @23,116 | x 37–93, y 116–129 | below, centred |
| Bottom Trailing | 56 × 13 @39,116 | x 53–109, y 116–129 | below, right of centre |
| Leading Top | 13 × 56 @-13,21 | x 1–14, y 21–77 | left of the body, upper |
| Leading Middle | 13 × 56 @-13,37 | x 1–14, y 37–93 | left, centred |
| Leading Bottom | 13 × 56 @-13,53 | x 1–14, y 53–109 | left, lower |
| Trailing Top | 13 × 56 @102,21 | x 116–129, y 21–77 | right of the body, upper |
| Trailing Middle | 13 × 56 @102,37 | x 116–129, y 37–93 | right, centred |
| Trailing Bottom | 13 × 56 @102,53 | x 116–129, y 53–109 | right, lower |

Light and Dark store identical positions. The arrow's off-centre offset is 16 either side of the middle position (23 ± 16; 37 ± 16, derived). Note the Top row: as stored, Top Leading has its arrow right of centre and Top Trailing left of centre, the reverse of the Bottom row. The dump records no flip on these paths.

The arrow path's outline (its point and curve) is not in the dump; only its bounding box is.

### Presentation controller

| Part | Size @ position | Uses |
|---|---|---|
| Root | 280 × 280 | stored root fill |
| `Arrow Direction` | 280 × 280 @0,0 | → `Popovers (iPad Only)/<Appearance>/Bottom Leading` (scaled up from 130 × 130) |

Its only child is the popover instance named `Arrow Direction`; the Dark iPad colour picker places this controller at 430 × 627 and swaps `Dark/Bottom Middle` into it (`specs/color-pickers.txt` line 188), while the Light picker uses `Light/Bottom Middle` directly (line 203).

## Sizes

| Item | Value |
|---|---|
| Popover master | 130 × 130 (body 102 × 102) |
| Body corner radius | 13 (overrides the material style's `corners 10`) |
| Arrow box | 56 long × 13 deep |
| Arrow offset from body edge | 0 (the arrow box touches the body edge, derived) |
| Presentation controller | 280 × 280 |

Content padding inside the popover: Not in the kit (the masters hold no content).

## Colours and states

| Part | Light | Dark |
|---|---|---|
| Body and arrow material | `Materials/Light/1 Thick`: fill #FFFFFF@34% (blend plus-lighter) + #FFFFFF@84% · blur background radius75 saturation1 | `Materials/Dark/2 Regular (Default)`: fill #000000@41% · blur background radius75 saturation1 |
| Drop shadow (`Shadow` group) | x0 y10 blur100 spread0 #000000@30% | same |
| Stored root fill | #5856D6 + #FFFFFF (no swatch) | #5E5CE6 + #FFFFFF (no swatch) |

Exception: `Light/Bottom Middle` stores `blur background radius112.5` on both its body and arrow; every other layer on the page stores radius 75 (grep: 2 × 112.5, 46 × 75).

The stored root fills are placeholder colours on the masters; the dump does not say whether they show in instances.

## Effects

| Effect | Value | Where |
|---|---|---|
| Shadow | x0 y10 blur100 spread0 #000000@30% | `Shadow` group, all 24 |
| Background blur | radius75 saturation1 (radius112.5 in Light/Bottom Middle) | `Background` and `Cartouche` |
| Material fills | see Colours; full style entries in `references/materials.md` | `Background` and `Cartouche` |

No glass (`blur glass`) and no blend modes other than the Light material's `plus-lighter` fill.

## Kit notes

The header description is cut off in the dump; only its opening survives ("A popover is a transient view that appea…"). The family name marks popovers as iPad only. Not in the kit: popover sizes for real content, content insets, arrow geometry, and how the arrow aligns to its source control.

## Finding it in the spec

| Family | grep |
|---|---|
| All popovers | `grep -n '^COMPONENT "Popovers (iPad Only)/' specs/popovers.txt` |
| Arrow positions | `grep -n 'path "Cartouche"' specs/popovers.txt` |
| Presentation controllers | `grep -n -A1 'Presentation Controller"' specs/popovers.txt` |
| Blur radius exception | `grep -n 'radius112.5' specs/popovers.txt` |
