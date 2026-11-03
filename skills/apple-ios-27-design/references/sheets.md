# Sheets — iOS 27

**Read when:** you need an exact iOS 27 value for sheets (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Sheets in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/sheets.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

50 components. The page has no documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| iPhone sheets | `Sheets/<Appearance>/iPhone/<Type>` | Appearance: Light, Dark · Type: Inspector, Medium Detent, Large Detent | 6 |
| iPad sheet | `Sheets/<Appearance>/iPad` | Light, Dark | 2 |
| Dimming overlay (building block) | `Sheets/􀻃/Overlay/<Appearance>` | Light, Dark | 2 |
| iPhone Duo examples | `Examples/Sheet/<Appearance>/iPhone Duo/<Orientation>/<Display>/<Detent>` | Orientation/Display: Landscape/Inner - Folded, Landscape/Inner, Portrait/Inner, Landscape/Outer, Portrait/Outer · Detent: Small Detent, Medium Detent, Large Detent, Full Screen | 40 |

The sheet's content area is empty in every component: each sheet holds only its top toolbar (and, on iPhone Duo, a vertical button bar).

## Anatomy

### iPhone Inspector (402 × 460)

| Layer | Size @position | Content |
|---|---|---|
| root | 402 × 460 | `fill #FFFFFF@70%`, `stack v gap0 pad0,8,8,8` |
| `group "Stack"` (the sheet) | 386 × 452 @8,0 | `style="Liquid Glass/<Appearance>/Regular - Large"`, `corners 34 smoothing0.6 style1`, `stack v gap0` |
| `use "Toolbar Top"` | 386 × 70 @0,0 | → `Toolbars/<Appearance>/iPhone/Top - Sheet/Title`, corners 34, with two button swaps (below) |

Derived: 8 + 386 + 8 = 402; 452 + 8 = 460 (no top padding).

### iPhone Medium Detent (402 × 874)

| Layer | Size @position | Content |
|---|---|---|
| root | 402 × 874 | no fill, `corners 0`, `stack v gap0 pad0,8,8,8` |
| `use "Overlay"` | 402 × 874 @0,0 | → `Sheets/􀻃/Overlay/<Appearance>` |
| `group "Stack"` (the sheet) | 386 × 451 @8,415 | `style="Liquid Glass/<Appearance>/Regular - Medium"`, `corners 34 smoothing0.6 style1`, `stack v gap0` |
| `use "Toolbar Top"` | 386 × 70 @0,0 | → `Toolbars/<Appearance>/iPhone/Top - Sheet/Title`, with two button swaps |

Derived: the sheet is inset 8 from the sides and 874 − (415 + 451) = 8 from the bottom; it covers 451 of the 874 pt screen.

### iPhone Large Detent (402 × 874)

| Layer | Size @position | Content |
|---|---|---|
| root | 402 × 874 | no fill, `corners 0` |
| `use "Overlay"` | 402 × 874 @0,0 | → `Sheets/􀻃/Overlay/<Appearance>` |
| `group "Stack"` (the sheet) | 402 × 812 @0,62 | opaque fill (below), `shadow x0 y15 blur50 spread0 #000000@18%`, `corners 38/38/0/0 smoothing0.6 style1`, `stack v gap0` |
| `use "Toolbar Top"` | 402 × 70 @0,0 | → `Toolbars/<Appearance>/iPhone/Top - Sheet/Title`, corners 38, no swaps |

Derived: the sheet starts 62 from the top and reaches the bottom edge (62 + 812 = 874); it is full width. The corner value has four parts as stored: 38, 38, 0, 0 (rounded top, square bottom).

Button swaps on the Inspector and Medium Detent toolbars (the swapped-in components are not on this page):

| Appearance | Primary button | Close button |
|---|---|---|
| Light | `Sheets (iPhone)/􀻃/Buttons (for Inspectors)/Light/Active/Primary` | `Sheets (iPhone)/􀻃/Buttons (for Inspectors)/Light/Active/Close Button` |
| Dark | `Sheets (iPhone)/􀻃/Buttons (for Inspectors)/Dark/Primary` | `Sheets (iPhone)/􀻃/Buttons (for Inspectors)/Dark/Close Button` |

### iPad sheet (1210 × 834 screen)

| Layer | Size @position | Content |
|---|---|---|
| root | 1210 × 834 | fill #FFFFFF (Light) / #000000 (Dark), no swatch |
| `rect "Overlay"` | 1210 × 834 @0,0 | fill #000000@16.2% (both appearances) |
| `group "Sheet"` | 936 × 770 @137,32 | fill #FFFFFF (Light) / #1C1C1E (Dark), no swatch; `corners 32 smoothing0.6 style1`; `stack v gap0 pad10,0,10,0` |
| `group "Toolbar Top"` | 936 × 54 @0,10 | three groups below |
| `group "Leading"` | 44 × 44 @10,0 | `stack h gap12`; `use "Back Button"` → `Toolbars/<Appearance>/Buttons/44pt/Active/Symbol 1` [text="􀯶" U+100BF6] |
| `use "Title"` | 81.49 × 22 @428.42,13 | → `Toolbars/􀻃/<Appearance>/Titles - iPhone/Title` |
| `group "Trailing"` | 44 × 44 @882,0 | `stack h gap12`; `use "Trailing - Button 3"` → `Toolbars/<Appearance>/Buttons/44pt/Active/Symbol 1 - Prominent` |

Derived: the sheet is centred horizontally ((1210 − 936) / 2 = 137) and leaves 32 above and 834 − 32 − 770 = 32 below. The toolbar buttons are inset 10 from the sheet's sides (936 − 882 − 44 = 10). The iPad sheet has no shadow or blur in the dump.

### Overlay (building block)

| Component | Size | Fill |
|---|---|---|
| `Sheets/􀻃/Overlay/Light` | 200 × 200 | #000000@20%, corners 0 |
| `Sheets/􀻃/Overlay/Dark` | 200 × 200 | #000000@48%, corners 0 |

These are unbound in the dump; the values equal `Overlays/Default` in `colors.md` (Light α 0.2, Dark α 0.48). The iPad sheet does not use this component; it draws its own 16.2% overlay rect.

### iPhone Duo examples

Each example is a screen with the app's toolbar (`use "Toolbar"` → `Toolbars/<Appearance>/iPhone Duo/Top - Standard/Title`, 82 tall, or a vertical bar at the right edge), then `use "Overlay"` → `Sheets/􀻃/Overlay/<Appearance>`, then `group "Sheet"`. Full Screen examples have no overlay and no sheet, only the toolbar and buttons.

Sheet geometry:

| Screen | Size | Small Detent | Medium Detent | Large Detent |
|---|---|---|---|---|
| Landscape / Inner - Folded | 951 × 669 | 453 × 80 @28,561 | 468 × 356 @8,305 | 468 × 661 @8,8 |
| Landscape / Inner | 951 × 669 | 653 × 80 @134,561 | 653 × 356 @149,305 | 653 × 661 @149,8 |
| Portrait / Inner | 669 × 951 | 613 × 80 @28,843 | 653 × 356 @8,587 | 653 × 869 @8,82 |
| Landscape / Outer | 678 × 466 | 410 × 80 @134,358 | 662 × 458 @8,8 | 662 × 458 @8,8 |
| Portrait / Outer | 466 × 678 | 410 × 80 @28,570 | 450 × 356 @8,314 | 450 × 670 @8,8 |

Derived bottom gap (screen height − y − sheet height): Small Detent 28 on every screen (669 − 561 − 80, 951 − 843 − 80, 466 − 358 − 80, 678 − 570 − 80); Medium Detent 8 where the sheet is glass (669 − 305 − 356, 951 − 587 − 356, 678 − 314 − 356); Large Detent 0 (the sheet reaches the bottom edge). Landscape / Outer Medium and Large are identical.

Sheet parts by detent:

| Detent | Sheet surface | Corners | Toolbar |
|---|---|---|---|
| Small Detent | `style="Liquid Glass/<Appearance>/Regular - Medium"` | max | `use "Toolbar Top"` (W × 74) → `Toolbars/<Appearance>/iPhone Duo/Top - Sheet/Title`, corners max; plus `group "Vertical Bar"` 76 wide (`stack v gap8 pad16,16,24,12`) holding one 48 × 48 button |
| Medium Detent (glass) | `Liquid Glass/<Appearance>/Regular - Medium` | 40 (Landscape Inner and Folded), 40/40/48/48 (Portrait Inner), 40/40/48/8 (Portrait Outer) | `Toolbar Top` (W × 70), corners 40 or 48 |
| Large Detent, and Landscape / Outer Medium | opaque fill (below) | 40/40/0/0 | `Toolbar Top` (W × 70), corners 40 |

The one button in the Small Detent's vertical bar is `Share` (􀈂 U+100202) in Dark and `Close` (􀆄 U+100184) in Light; both → `Toolbars/<Appearance>/Buttons/48pt/Active/Symbol 1`.

Outer-display Medium and Large sheets also carry a `Vertical Bar` (76 wide, `stack v gap8 pad16,16,24,12`, or `pad24,16,24,12` in Portrait Outer Large) with `Close` (􀆄) and `Share` (􀈂) 48 × 48 buttons, 12 apart (corners 24 or 32 on the instances).

## Sizes

| Part | Size | Corner radius | Insets |
|---|---|---|---|
| iPhone Inspector sheet | 386 × 452 | 34 | 8 left, right and bottom (root padding 0,8,8,8) |
| iPhone Medium Detent sheet | 386 × 451 | 34 | 8 left, right and bottom |
| iPhone Large Detent sheet | 402 × 812 | 38/38/0/0 | 62 from top, 0 sides and bottom |
| iPhone sheet toolbar | 386 × 70 (402 × 70 Large) | 34 (38 Large) | — |
| iPad sheet | 936 × 770 | 32 | 137 sides, 32 top and bottom; inner padding 10 top and bottom |
| iPad sheet toolbar | 936 × 54 | — | buttons 10 from the sides |
| iPad toolbar buttons | 44 × 44 | — | — |
| iPhone Duo Small Detent sheet | W × 80 | max | 28 from bottom |
| iPhone Duo Small Detent toolbar | W × 74 | max | — |
| iPhone Duo Medium / Large toolbar | W × 70 | 40 / 48 | — |
| iPhone Duo vertical bar in sheet | 76 wide | — | padding 16,16,24,12; gap 8 |
| iPhone Duo sheet buttons | 48 × 48 | — | 12 apart |

The iPhone glass styles store `corners 20` in the token; the sheets override it with 34, 40, 48 or max.

## Colours and states

| Part | Light | Dark |
|---|---|---|
| iPhone Inspector root fill | #FFFFFF@70% | #FFFFFF@70% |
| iPhone Inspector sheet | `Liquid Glass/Light/Regular - Large` | `Liquid Glass/Dark/Regular - Large` |
| iPhone Medium Detent sheet | `Liquid Glass/Light/Regular - Medium` | `Liquid Glass/Dark/Regular - Medium` |
| iPhone Large Detent sheet | #FFFFFF (no swatch) | #1C1C1E (no swatch) |
| iPhone overlay | #000000@20% | #000000@48% |
| iPad screen | #FFFFFF | #000000 |
| iPad overlay | #000000@16.2% | #000000@16.2% |
| iPad sheet | #FFFFFF | #1C1C1E |
| iPhone Duo screen | #FFFFFF {Backgrounds/Light/Primary} | #000000 {Backgrounds/Dark - Base/Primary} |
| iPhone Duo Small and Medium sheets | `Liquid Glass/Light/Regular - Medium` | `Liquid Glass/Dark/Regular - Medium` |
| iPhone Duo Large sheet, Inner displays | #FFFFFF {Backgrounds/Light/Primary} | #1C1C1E {Backgrounds/Dark - Base/Secondary} |
| iPhone Duo Large sheet, Outer displays (and Landscape Outer Medium) | #FFFFFF {Backgrounds/Light/Primary} | #1C1C1E {Backgrounds/Dark - Elevated/Primary} |

The kit has no interactive states for sheets (no pressed, dragging or disabled variants). A grabber, a drag handle and the sheet's content area: Not in the kit.

## Text

Text on this page lives in the nested toolbar components (titles and buttons, see `toolbars.md`). The only text layers stored here are:

| Part | Font | Size | Line height | Colour | Align |
|---|---|---|---|---|---|
| Back glyph in the Outer-display glass button (`text "Symbol"` "􀆉" U+100189) | SFPro-Medium | 17 | 22 | Light #1A1A1A {Labels - Liquid Glass/Light/1 Primary} `blend plus-darker`; Dark #EDEDED {Labels - Liquid Glass/Dark/1 Primary} `blend plus-lighter` | centre |
| iPhone Duo vertical status bar time "9:41" | SFProRounded-Bold | 16 | Not in the kit | #000000 | centre |

Glyph overrides on the toolbar instances: 􀆉 U+100189 (Back), 􀆄 U+100184 (Close), 􀈂 U+100202 (Share), 􀯶 U+100BF6 (iPad Back Button).

## Effects

| Part | Effect |
|---|---|
| iPhone Large Detent sheet | `shadow x0 y15 blur50 spread0 #000000@18%` |
| iPhone Inspector | `Liquid Glass/<Appearance>/Regular - Large` |
| iPhone Medium Detent and iPhone Duo Small/Medium | `Liquid Glass/<Appearance>/Regular - Medium` |
| iPhone Duo outer-display Back button | `Liquid Glass/<Appearance>/Regular - Small`, `corners max`, `stack v gap0 pad4,4,4,4` |

The inline expansions match the tokens except for the corner value (checked by script on every styled line). Key values from `materials.md`:

| Style | Fill stack (bottom first) | Glass blur | Drop shadow |
|---|---|---|---|
| Liquid Glass/Light/Regular - Large | #FFFFFF@70% (lighten) + #BFBFBF@10% (darken) | radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 | x0 y18 blur46 #000000@25% |
| Liquid Glass/Dark/Regular - Large | #1A1A1A@50% + #1A1A1A@90% (luminosity) + #1A1A1A (lighten) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 | x0 y18 blur48 #000000@45% |
| Liquid Glass/Light/Regular - Medium | #CCCCCC@70% (lighten) + #BFBFBF@10% (darken) | radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 | x0 y18 blur46 #000000@25% |
| Liquid Glass/Dark/Regular - Medium | #1A1A1A@30% + #1A1A1A@30% (luminosity) + #1A1A1A (lighten) | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 | x0 y18 blur48 #000000@45% |

Each also has five inner shadows, a 0.3 pt edge shadow (blur0.3 spread0.3) and two ±1.25 pt side shadows; see `materials.md`.

The outer-display Back button's inner group (`"Label"` in Dark, `"Button 1"` in Light, 40 × 40 @4,4) stores `border 15 inside #FF0000` in all six examples that have it. This is how the kit stores it.

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Sheets" and a description the dump cuts off after "A sheet helps people perform a scoped ta…". The full text is Not in the dump.

What the components show (summarised from their layout): a medium-detent iPhone sheet is a glass panel floating 8 pt from the screen edges; a large-detent sheet is opaque, full width, rounded only at the top and casts a soft shadow; an inspector uses the heavier Regular - Large glass. On iPhone Duo, the small detent is an 80 pt glass capsule floating 28 pt above the bottom, the medium detent is glass 8 pt from the bottom, and the large detent is opaque and reaches the bottom edge.

## Finding it in the spec

| Family / part | grep |
|---|---|
| iPhone sheets | `grep -n '^COMPONENT "Sheets/[A-Za-z]*/iPhone/' specs/sheets.txt` |
| iPad sheet | `grep -n '^COMPONENT "Sheets/[A-Za-z]*/iPad"' specs/sheets.txt` |
| Overlay | `grep -n '^COMPONENT "Sheets/􀻃/Overlay' specs/sheets.txt` |
| iPhone Duo examples | `grep -n '^COMPONENT "Examples/Sheet/' specs/sheets.txt` |
| One detent, e.g. Medium | `grep -n '^COMPONENT .*Medium Detent' specs/sheets.txt` |
| Sheet surfaces (38: 30 iPhone Duo, 2 iPad, 6 iPhone) | `grep -nE '^  group "(Sheet\|Stack)"' specs/sheets.txt` |
| Toolbars inside sheets | `grep -n 'use "Toolbar Top"' specs/sheets.txt` |
| Per-corner radii | `grep -n 'corners [0-9]*/' specs/sheets.txt` |
