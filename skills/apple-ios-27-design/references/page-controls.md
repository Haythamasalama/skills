# Page Controls — iOS 27

**Read when:** you need an exact iOS 27 value for page Controls (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Page Controls in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/page-controls.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

44 components in two families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Page Control | `Page Control/<Appearance>/<Background>/<Dots>` | Appearance: Light, Dark. Background: Background, No Background. Dots: 2 Dots, 3 Dots, 4 Dots, 5 Dots, 6 Dots, 7 Dots, 8+ Dots, First Selected, 8+ Dots, Middle Selected, 8+ Dots, Last Selected | 36 (2 × 2 × 9) |
| Dot | `Page Control/􀻃/Dots - <Appearance>/<Kind>` | Appearance: Light, Dark. Kind: Selected, Unselected, 6pt, 4pt | 8 |

`􀻃` is U+100EC3. All 36 page controls are 393 × 44.

## Anatomy

### Dot masters

| Kind | Master size | Child oval (layer) | Oval size @ position |
|---|---|---|---|
| Selected | 10 × 10 | `Selected` | 8 × 8 @1,1 |
| Unselected | 10 × 10 | `Unselected` | 8 × 8 @1,1 |
| 6pt | 10 × 10 | `Unselected` | 6 × 6 @2,2 |
| 4pt | 6 × 6 | `Unselected` | 4 × 4 @1,1 |

The masters have a background fill (`#000000` Dark, `#FFFFFF` Light) as the symbol background.

### Page Control

| Part | Background variants | No Background variants |
|---|---|---|
| Root | 393 × 44, `stack h gap10 pad0,0,0,0` | same |
| `Stack` (pill) | 24 tall @x,10, `corners 12`, `stack h gap10 pad0,12,0,12`, material style (see Effects) | none |
| Dots (`Dot`, `Dot 1`…`Dot 9`) | instances inside `Stack` | instances directly in the root, at the same absolute positions as in the Background variant |

Exception: Light/Background/8+ Dots, Last Selected nests the dots in a second group `Stack` 146 × 10 @12,7 (`stack h gap10`) inside the pill (line 177).

Dot order for each Dots value (left to right; S = Selected, U = Unselected, 6 = 6pt, 4 = 4pt). The same in Light and Dark and with or without background (checked across all 36):

| Dots | Sequence | Dot count |
|---|---|---|
| 2 Dots | S U | 2 |
| 3 Dots | S U U | 3 |
| 4 Dots | S U U U | 4 |
| 5 Dots | S U U U U | 5 |
| 6 Dots | S U U U U U | 6 |
| 7 Dots | S U U U U U 6 | 7 |
| 8+ Dots, First Selected | S U U U U U 6 4 | 8 |
| 8+ Dots, Middle Selected | 4 6 U U S U U 6 4 | 9 |
| 8+ Dots, Last Selected | 4 6 U U U U U S | 8 |

## Sizes

Instance sizes differ by appearance: Dark scales the 10 × 10 dot masters to 8 × 8 instances from 6 Dots up, Light keeps 10 × 10 (the 4pt master is 6 × 6 everywhere; in Middle Selected the leading 6pt dot is a 6 × 6 instance in both appearances, while the trailing 6pt dot keeps the appearance's normal size).

| Dots | Pill width × height, x (Dark) | Pill width × height, x (Light) | Dot instance size (Dark / Light) | Dot pitch, derived (Dark / Light) |
|---|---|---|---|---|
| 2 Dots | 54 × 24 @169.5 | 54 × 24 @169.5 | 10 / 10 | 20 / 20 |
| 3 Dots | 74 × 24 @159.5 | 74 × 24 @159.5 | 10 / 10 | 20 / 20 |
| 4 Dots | 94 × 24 @149.5 | 94 × 24 @149.5 | 10 / 10 | 20 / 20 |
| 5 Dots | 114 × 24 @139.5 | 114 × 24 @139.5 | 10 / 10 | 20 / 20 |
| 6 Dots | 122 × 24 @135.5 | 134 × 24 @129.5 | 8 / 10 | 18 / 20 |
| 7 Dots | 140 × 24 @126.5 | 154 × 24 @119.5 | 8 / 10 | 18 / 20 |
| 8+ Dots, First Selected | 156 × 24 @118.5 | 170 × 24 @111.5 | 8 (4pt 6) / 10 (4pt 6) | 18, last step 18 / 20 |
| 8+ Dots, Middle Selected | 170 × 24 @111.5 | 182 × 24 @105.5 | 8 (both 4pt and the leading 6pt: 6) / 10 (both 4pt and the leading 6pt: 6) | 16, 16, then 18 / 16, 16, then 20 |
| 8+ Dots, Last Selected | 156 × 24 @118.5 | 170 × 24 @111.5 | 8 (4pt 6) / 10 (4pt 6) | 16 first step, then 18 / 16 first step, then 20 |

Derived from these values:

- Pill padding 12 left and right (first dot at x 12 inside the pill), gap 10 between dot frames, so pitch = frame + 10.
- Pill width = 12 + sum of dot frames + 10 × (dots − 1) + 12; for example 2 Dots: 12 + 10 + 10 + 10 + 12 = 54.
- The pill is centred: x = (393 − width) / 2 (e.g. (393 − 54) / 2 = 169.5).
- Vertical centring: pill y 10 in a 44 tall control (10 + 24 + 10). Dot y is 17 for 10 pt frames, 18 for 8 pt, 19 for 6 pt (centre 22 in every case).
- Visible dot sizes at master scale: Selected and Unselected 8, 6pt 6, 4pt 4.

Corner radius: pill 12 (fully rounded at 24 tall); dots are ovals.

## Colours and states

| Part | Dark | Light |
|---|---|---|
| Selected dot | `#FFFFFF {Labels/Dark/1 Primary}` | `#000000 {Labels/Light/1 Primary}` |
| Unselected, 6pt and 4pt dots | `#EBEBF5@30% {Labels/Dark/3 Tertiary}` | `#3C3C43@30% {Labels/Light/3 Tertiary}` |
| Pill (Background variants) | style `Materials/Dark/4 Ultrathin`: fill `#000000@0%` | style `Materials/Light/4 Ultrathin`: fill `#FFFFFF@7%` (blend plus-lighter) + `#FFFFFF@3%` |
| Root / dot master background | `#000000` | `#FFFFFF` |

No pressed, disabled or scrubbing states are in the kit.

## Text

The page has no text layers apart from the header.

## Effects

| Part | Effect |
|---|---|
| Dark pill | `blur background radius75 saturation1`, fill `#000000@0%`, corners 12 smoothing0.6 |
| Light pill | `blur background radius45 saturation1`, fill `#FFFFFF@7%` (plus-lighter) + `#FFFFFF@3%`, corners 12 smoothing0.6 |

`materials.md` lists both `4 Ultrathin` styles with corners 10; every pill on this page overrides that with corners 12 (checked: 9 Dark, 9 Light).

## Kit notes

The page has no documentation boards. The header (`use "_Header"`) is titled "Page Controls" and its description begins "A page control displays a row of indicat…" (cut off in the dump). The variants show how the control shortens long page counts: from 7 dots up the trailing dot shrinks to 6pt, and with 8 or more pages the dots at the scrolled-off ends shrink to 6pt and then 4pt.

## Finding it in the spec

| What | Pattern |
|---|---|
| All page controls | `grep -n '^COMPONENT "Page Control/\(Light\|Dark\)' specs/page-controls.txt` |
| With background | `grep -n '^COMPONENT "Page Control/[A-Za-z]*/Background' specs/page-controls.txt` |
| Without background | `grep -n '^COMPONENT "Page Control/[A-Za-z]*/No Background' specs/page-controls.txt` |
| Dot masters | `grep -n -A1 '^COMPONENT "Page Control/􀻃' specs/page-controls.txt` |
| Pills | `grep -n 'group "Stack" .*Ultrathin' specs/page-controls.txt` |
