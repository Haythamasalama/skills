# Pointers — macOS 27

**Read when:** you need an exact macOS 27 value for pointers (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Pointers in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects.

Source: `specs/pointers.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, `Pointers/<name>`. 22 components, 20 distinct names (`Resize North-South` and `Default` appear twice each). Every master is 32 × 32 with `fill #FFFFFF` on the master itself.

| Group | Components |
|---|---|
| Resize, two-way | `Resize North-South` (×2), `Resize West-East`, `Resize North-East South-West`, `Resize North-West South-East`, `Resize (Up-Down)`, `Resize (Left-Right)` |
| Resize, one-way | `Resize (Up)`, `Resize (Right)`, `Resize (Down)`, `Resize (Left)` |
| Move and hands | `Move`, `Hand (Open)`, `Hand (Grabbing)`, `Hand (Pointing)` |
| Zoom | `Zoom In`, `Zoom Out` |
| Other | `Cross`, `Text Cursor`, `Beachball`, `Default` (×2) |

There is no Light/Dark axis: each pointer is drawn once. The page has no documentation boards; its only free text layer is the page title ("Pointers").

## Anatomy

Most pointers are two stacked vector layers: a white shape (outline) under a black shape (body). Layers are listed bottom first, as in the dump.

| Pointer | Layers (name, size, position, fill) |
|---|---|
| Resize North-South | `Combined Shape` 8.43×20.86 @11.77,5.58 #FFFFFF · `Combined Shape` 6.43×18.86 @12.77,6.58 #000000 |
| Resize West-East | `Combined Shape` 20.86×8.43 @5.87,12 #FFFFFF · `Combined Shape` 18.86×6.43 @6.87,13 #000000 |
| Resize North-East South-West | `Combined Shape` 15.6×15.6 @8.2,8.2 #FFFFFF · `Combined Shape` 13.61×13.61 @9.2,9.2 #000000 |
| Resize North-West South-East | `Combined Shape` 15.6×15.6 @8.2,8.2 #FFFFFF · `Combined Shape` 13.6×13.6 @9.2,9.2 #000000 |
| Resize (Up-Down) | `Combined Shape` 14×23 @9,4.5 #FFFFFF · `Combined Shape` 12×21 @10,5.5 #000000 |
| Resize (Left-Right) | group `resizeleftright` 23×14 @4.5,9 containing `Combined Shape` 23×14 @0,0 #FFFFFF · `Combined Shape` 21×12 @1,1 #000000 |
| Resize (Up) | `Combined Shape` 14×13.5 @9,4.5 #FFFFFF · `Combined Shape` 12×11.5 @10,5.5 #000000 |
| Resize (Right) | `Combined Shape` 13.5×14 @14,9 #FFFFFF · `Combined Shape` 11.5×12 @15,10 #000000 |
| Resize (Down) | `Combined Shape` 14×13.5 @9,14 #FFFFFF · `Combined Shape` 12×11.5 @10,15 #000000 |
| Resize (Left) | `Combined Shape` 13.5×14 @4.5,9 #FFFFFF · `Combined Shape` 11.5×12 @5.5,10 #000000 |
| Move | `Path 5` 17.75×17.75 @8.13,8.13 #FFFFFF · `Path 2` 2×10 @16,12 #000000 |
| Hand (Open) | `Path` 15×17 @9.5,6.42 #FFFFFF · `Path` 15.99×18.11 @9,5.89 #000000 |
| Hand (Grabbing) | `Fill 1` 13.49×12.59 @10.75,11.41 #000000 · `Fill 4` 11.45×10.52 @11.81,12.38 #FFFFFF |
| Hand (Pointing) | `Path` 14.54×18.76 @11,14.24 #000000 · `Path` 12.49×16.71 @12.02,15.23 #FFFFFF |
| Zoom In | `Path` 14×14 @10,10 #000000 · `Path` 10.51×10.51 @11.75,11.75 #FFFFFF · `Path` 2×7 @16,13.5 #000000 · `Path` 7×2 @13.5,16 #000000 · `Path` 6.45×6.45 @20.78,20.78 #000000 |
| Zoom Out | `Path` 14×14 @10,10 #000000 · `Path` 10.51×10.51 @11.75,11.75 #FFFFFF · `Combined Shape` 13.72×11.22 @13.5,16 #000000 |
| Cross | `Combined Shape` 15×15 @9,9 #FFFFFF · `Combined Shape` 13×13 @10,10 #232020 |
| Text Cursor | `Path` 7.67×18.62 @12.65,6 #FFFFFF · `Path` 5.67×16.62 @13.65,7 #000000 |
| Beachball | group `Cursors / Beachball` 21×21 @6,6 with six gradient segments (see Colours) |
| Default (first) | `Path 2` 10.38×14.13 @15,13.6 #FFFFFF · `Path 3` 8.36×11.73 @16,14.98 #000000 |
| Default (second) | the same two paths, plus `Path` 12×15 @20,27.12 #FFFFFF · `Path` 10×13 @21,28.12 #000000 · `Path` 6×1 @23,30.12 #FFFFFF · `Path` 6×1 @23,38.12 #FFFFFF · `Path` 8×3 @22,33.12 #FFFFFF · `Path` 4×1 @23,34.12 #000000 |

## Sizes

| Property | Value |
|---|---|
| Canvas | 32 × 32 for every pointer |
| White outline width | 1 (derived: the black shape is 1 in from the white one on each side, for example Resize North-South white @11.77 → black @12.77, width 8.43 → 6.43) |
| Hot spot | Not in the kit |
| Sizes other than 32 × 32 | Not in the kit |

## Colours and states

Pointers have no states or appearances in the kit.

| Part | Colour |
|---|---|
| Outline | #FFFFFF |
| Body | #000000; `Cross` uses #232020 |
| Beachball `Segment (Yellow)` 10.79×8.96 @0.52,1.54 | gradient linear {0.5, 0}→{0.5, 1} [#FFD305 0%, #FDCF01 100%] |
| Beachball `Segment (Green)` 10×11.33 @0.5,7.5 | [#52CF30 0%, #3BBD1C 100%] |
| Beachball `Segment (Blue)` 10.45×10 @4.5,10.5 | [#14ADF6 0%, #1191F4 100%] |
| Beachball `Segment (Purple)` 10.79×8.96 @9.7,10.5 | [#CA70E1 0%, #B452CB 100%] |
| Beachball `Segment (Red)` 10×11.33 @10.5,2.17 | [#FF645D 0%, #FF4332 100%] |
| Beachball `Segment (Orange)` 10.45×10 @6.05,0.5 | [#FBB114 0%, #FF9508 100%] |

All six beachball gradients run top to bottom ({0.5, 0}→{0.5, 1}).

## Effects

| Layer | Effect |
|---|---|
| Beachball group `Cursors / Beachball` | shadow x0 y1 blur2 spread0 #000000@40.5% |
| All other pointers | none in the dump |

## Finding it in the spec

| Family | grep |
|---|---|
| All pointers | `grep -n '^COMPONENT "Pointers/' specs/pointers.txt` |
| Resize pointers | `grep -n '^COMPONENT "Pointers/Resize' specs/pointers.txt` |
| Beachball segments | `grep -n 'Segment (' specs/pointers.txt` |
