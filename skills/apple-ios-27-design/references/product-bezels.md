# Product Bezels — iOS 27

**Read when:** you need an exact iOS 27 value for product Bezels (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Product Bezels in Apple's iOS 27 kit: components, anatomy, sizes, kit notes.

Source: `specs/product-bezels.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􁣳 U+1018F3.

## Components

25 components. Each is a screen-sized frame holding one bitmap (`image`) of the device that overhangs the frame on every side.

| Family (name path) | Colour / configuration values | Count |
|---|---|---|
| `Bezels/iPhone 18 Pro/<Colour> - Portrait` | Silver, Glacier, Black, Burgundy | 4 |
| `Bezels/iPhone 18 Pro Max/<Colour> - Portrait` | Silver, Glacier, Black, Burgundy | 4 |
| `Bezels/iPhone Air/<Colour> - Portrait` | Space Black, Cloud White, Sky Blue, Light Gold | 4 |
| `Bezels/iPhone Duo/<Colour> - <Configuration>` | Colours: Night Sky, Star White. Configurations: Inner Open Landscape, Inner Open Portrait, Outer Closed Landscape, Outer Closed Portrait | 8 (2 × 4) |
| `Bezels/iPad mini (A17 Pro) - Space Gray - Landscape` | Space Gray only (colour is in the name, not a path level) | 1 |
| `Bezels/iPad Pro (M5) 11"/<Colour> - Landscape` | Silver, Space Black | 2 |
| `Bezels/iPad Pro (M5) 13"/<Colour> - Landscape` | Silver, Space Black | 2 |

No fills, borders, text, effects or states are stored on this page; each device colour exists only in its bitmap and its name.

Orientation: every iPhone 18 Pro, 18 Pro Max and Air bezel is Portrait only; every iPad bezel is Landscape only; iPhone Duo has both (checked with `grep '^COMPONENT' specs/product-bezels.txt`).

## Anatomy

Every component has the same two-level structure:

| Part | Kind | What it is |
|---|---|---|
| Root | component | The screen area, sized to the device's screen in points |
| `<Device> - <Colour> - <Orientation>` | image | Device bitmap, larger than the root and placed at a negative offset |

The image layer name repeats the component name with " - " separators, for example `iPhone 18 Pro - Silver - Portrait`.

## Sizes

Bezel thickness is derived from the image offset and size: left = −x, top = −y, right = image width − screen width − left, bottom = image height − screen height − top. The values are the same for every colour of a device (checked across all 25).

| Device / configuration | Screen (component) | Image size | Image offset | Bezel L / T / R / B (derived) |
|---|---|---|---|---|
| iPhone 18 Pro, Portrait | 402 × 874 | 450 × 920 | @-24,-23 | 24 / 23 / 24 / 23 |
| iPhone 18 Pro Max, Portrait | 440 × 956 | 490 × 1000 | @-25,-22 | 25 / 22 / 25 / 22 |
| iPhone Air, Portrait | 420 × 912 | 460 × 960 | @-20,-24 | 20 / 24 / 20 / 24 |
| iPhone Duo, Inner Open Landscape | 951 × 669 | 1031 × 749 | @-40,-40 | 40 / 40 / 40 / 40 |
| iPhone Duo, Inner Open Portrait | 669 × 951 | 749 × 1031 | @-40,-40 | 40 / 40 / 40 / 40 |
| iPhone Duo, Outer Closed Landscape | 678 × 466 | 731 × 524 | @-26.5,-29 | 26.5 / 29 / 26.5 / 29 |
| iPhone Duo, Outer Closed Portrait | 466 × 678 | 524 × 731 | @-29,-26.5 | 29 / 26.5 / 29 / 26.5 |
| iPad mini (A17 Pro), Landscape | 1133 × 744 | 1275 × 890 | @-71,-73 | 71 / 73 / 71 / 73 |
| iPad Pro (M5) 11", Landscape | 1210 × 834 | 1320 × 940 | @-55,-53 | 55 / 53 / 55 / 53 |
| iPad Pro (M5) 13", Landscape | 1376 × 1034 | 1500 × 1150 | @-62,-58 | 62 / 58 / 62 / 58 |

Screen corner radius: Not in the kit (the roots store no corners and no mask).

## Kit notes

The page header's description is cut off in the dump after a few words ("To download additional device bezels, vi…"); it points designers to a download source for more bezels, but the location is not in the dump. No other guidance is on the page.

## Finding it in the spec

| Family | grep |
|---|---|
| All bezels with sizes | `grep -n '^COMPONENT "Bezels/' specs/product-bezels.txt` |
| One device | `grep -n -A1 'Bezels/iPhone Air/' specs/product-bezels.txt` |
| Image offsets | `grep -n '  image ' specs/product-bezels.txt` |
