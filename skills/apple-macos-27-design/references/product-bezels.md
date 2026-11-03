# Product Bezels — macOS 27

**Read when:** you need an exact macOS 27 value for product Bezels (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Product Bezels in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/product-bezels.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􁣳 (U+1018F3).

## Components

4 components, one family. Each is a bitmap of a MacBook Pro.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| MacBook Pro bezel | `Product Bezels/MacBook Pro with PROLED XDR Display/<Size> <Finish>` | Size: 16-inch, 14-inch · Finish: Silver, Space Black | 4 |

The model name is written as stored ("PROLED XDR").

## Anatomy

| Layer | Kind | Notes |
|---|---|---|
| (component frame) | no fill | no other content |
| `MacBook Pro with PROLED XDR Display <Size> <Finish>` | bitmap image | larger than the frame; it overhangs the frame on every side |

The bitmap's pixels are not in the dump, so the screen opening inside the photo (position, corner radius, camera housing) is not in the kit as dumped.

## Sizes

| Component | Frame | Image | Image @ | Overhang left / right (derived) | Overhang top / bottom (derived) |
|---|---|---|---|---|---|
| 16-inch Silver | 1736×1133 | 2130×1420 | -197,-143.5 | 197 / 197 | 143.5 / 143.5 |
| 16-inch Space Black | 1736×1133 | 2130×1420 | -197,-143.5 | 197 / 197 | 143.5 / 143.5 |
| 14-inch Silver | 1512×993 | 1930×1270 | -209,-138 | 209 / 209 | 138 / 139 |
| 14-inch Space Black | 1512×993 | 1930×1270 | -209,-139 | 209 / 209 | 139 / 138 |

Derivation: right = image width − frame width − left; bottom = image height − frame height − top. Example, 16-inch: 2130 − 1736 − 197 = 197. The image is centred on the frame for the 16-inch bezels; the 14-inch bezels are off by 1 point vertically, in opposite directions for the two finishes.

## Colours and states

Not in the kit: the finishes are photos, not colour values. No states.

## Effects

None stored.

## Kit notes

The page has no documentation boards and no text layers.

Kit inconsistency: the two 14-inch images sit 1 point apart vertically (@y −138 against −139) inside frames of the same size.

## Finding it in the spec

| Family | grep |
|---|---|
| Bezels | `grep -n -A1 '^COMPONENT "Product Bezels/' specs/product-bezels.txt` |
