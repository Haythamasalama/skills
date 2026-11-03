# Notifications — macOS 27

**Read when:** you need an exact macOS 27 value for notifications (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Notifications in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/notifications.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

9 components. `􀻃` (U+100EC3) is the path segment the kit puts in front of building-block components.

| Family | Variant axes | Components |
|---|---|---|
| `Notifications/<Appearance>/<Kind>` | Appearance: `Light`, `Dark` · Kind: `Single`, `Stacked` | 4 |
| `Notifications/􀻃/BG/<Appearance>` | Light, Dark | 2 |
| `Notifications/􀻃/Icon` | — | 1 |
| `Notifications/Examples/<Appearance>` | Light, Dark (full desktop, 1512 × 993) | 2 |

The page has no documentation boards; its only free text layers are the page title ("Notifications") and the "Light" / "Dark" headings.

## Anatomy

### Single (344 × 78)

The notification is `stack h gap8 pad12,14,12,10` with `blend multiply` and `corners 0` on the frame. Layers top to bottom of the dump:

| Layer | Kind | Size | Position | Contents |
|---|---|---|---|---|
| `BG` | use → `Notifications/􀻃/BG/<Appearance>` | 344×78 | @0,0 | glass background |
| `Stack` (trailing) | group, `stack v gap8` | 32×54 | @298,12 | `Timestamp` text 22×14 @10,0 "now" (right-aligned) · `Image` rect 32×32 @0,22, `fill image`, corners 6 |
| `Stack` (text) | group, `stack v gap0` | 232×32 | @58,12 | `Title` text 232×16 @0,0 "Title" · `Description` text 232×16 @0,16 ("Message" in Light, "Description" in Dark) |
| `Stack` (icon) | group, `stack v gap0 pad0,4,0,4` | 40×54 | @10,12 | `App Icon` use 32×32 @4,11 → `Notifications/􀻃/Icon` |

`Notifications/􀻃/Icon` (32 × 32) holds one `App Icon` use → `App Icons/Calendar/Default`. Both Single masters override it with `swap→App Icons/Calendar/Dark`.

### Stacked

The Stacked master is a Single with a second card peeking out below it.

| Layer | Light/Stacked (344 × 78) | Dark/Stacked (344 × 84) |
|---|---|---|
| frame | `stack v gap0`, `blend multiply` | same |
| `Notification` | use 344×78 @0,0 → `Notifications/Light/Single` | use 344×78 @0,0 → `Notifications/Dark/Single` |
| `Frame` | group 344×8 @0,78 | group 344×6 @0,78 |
| ↳ `BG` (back card) | group 312×88 @16,-80, corners 22 | group 312×86 @16,-80, corners 16 |

Derived: the back card is inset 16 on each side (16 + 312 + 16 = 344) and its bottom edge sits 8 (Light) or 6 (Dark) below the front card (−80 + 88 = 8; −80 + 86 = 6).

### Examples (1512 × 993)

| Layer | Light | Dark |
|---|---|---|
| `Wallpaper` | use 1512×993 → `Wallpaper/Light` | use 1512×982 → `Wallpaper/Dark` |
| `Menu Bar` | use 1512×45 @0,0 → `Menu Bar/Over Dark Wallpaper` | same |
| `Dock` | in `Stack` 1512×62 @0,931; use 1107×58 @202.5,0 → `Dock/Light Dock` | → `Dock/Dark Dock` |
| Notification column | `Stack` 344×144 @1152,49, `stack v gap16` | `Stack` 344×150 @1152,49 |
| ↳ `Notification` | use 344×72 @0,0 → `…/Single`, title "Dinner in Timber Cove", body "Invitation from Kristina / Today at 8:00 P…" | same text |
| ↳ `Notification Stacked` | use 344×56 @0,88 → `…/Stacked`, title "Home", body "Outdoor Light was turned off", time "7:04 AM", icon swapped to `App Icons/Home/…` | use 344×62 @0,88 |

Derived placement: the column is 16 from the right edge of the screen (1512 − 1152 − 344 = 16) and 4 below the 45-tall menu bar (49 − 45 = 4). The example instances are resized below their masters' heights (72 instead of 78; 56 and 62 instead of 78 and 84).

## Sizes

| Property | Value |
|---|---|
| Single size | 344 × 78 |
| Padding (top, right, bottom, left) | 12, 14, 12, 10 |
| Gap between columns | 8 |
| Corner radius (front card) | 20 (from `BG`) |
| Corner radius (stacked back card) | 22 Light, 16 Dark, as stored |
| App icon | 32 × 32, inside a 40-wide column with 4 padding each side; icon at y 11 within a 54-tall column |
| Text column | 232 wide; title and body 16 tall each, no gap |
| Trailing column | 32 wide, gap 8: timestamp 22×14 at x 10, image 32×32 at y 22 |
| Attachment image corner radius | 6 |
| Width check | derived: 10 + 40 + 8 + 232 + 8 + 32 + 14 = 344 |
| Height check | derived: 12 + 54 + 12 = 78 |
| Action buttons, close button, expanded state | Not in the kit |

## Colours and states

One state per appearance.

| Appearance | Part | Colour | Blend |
|---|---|---|---|
| Light | Title | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | plus-darker |
| Light | Description | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | plus-darker |
| Light | Timestamp | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary} | plus-darker |
| Dark | Title | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | plus-lighter |
| Dark | Description | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | plus-lighter |
| Dark | Timestamp | #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary} | plus-lighter |

| Appearance | Background style | Fill (bottom first) |
|---|---|---|
| Light | `Liquid Glass/Light/Notification` | #BFBFBF@25% (blend lighten) + #1A1A1A (blend plus-lighter) |
| Dark | `Liquid Glass/Dark/Notification` | #666666@10% (blend lighten) |

## Text

| Part | Font | Size | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| Title | SFPro-Bold | 13 | 16 | — | left |
| Description | SFPro-Regular | 13 | 16 | — | left |
| Timestamp | SFPro-Regular | 11 | 14 | — | right |

No layer is bound to a shared text style. By value, Title matches `05 Headline/Default`, Description matches `06 Body/Default` and Timestamp matches `08 Subheadline/Default`.

## Effects

**Front card `BG` — Light (`Liquid Glass/Light/Notification`, corners changed from the style's 16 to 20)**

- fill #BFBFBF@25% (blend lighten) + #1A1A1A (blend plus-lighter)
- shadow x0 y4 blur16 spread0 #000000@10%
- shadow x0 y0 blur0.3 spread0.3 #ABABAB (blend plus-darker)
- inner-shadow x0 y-6 blur4 spread-6 #222222 (blend plus-lighter)
- inner-shadow x0 y6 blur4 spread-6 #222222 (blend plus-lighter)
- inner-shadow x0 y-1 blur1.5 spread-1 #676767 (blend plus-lighter)
- inner-shadow x0 y1 blur1.5 spread-1 #676767 (blend plus-lighter)
- inner-shadow x0 y2 blur0.2 spread-1.2 #FFFFFF@20%
- blur glass radius15 saturation1 brightness1 distortion0.1 depth0.9 chromatic0
- corners 20 smoothing0.6 style1

**Front card `BG` — Dark (`Liquid Glass/Dark/Notification`, unchanged)**

- fill #666666@10% (blend lighten)
- shadow x0 y4 blur16 spread0 #000000@10%
- shadow x0 y0 blur0.3 spread0.3 #ABABAB (blend plus-darker)
- the same five inner shadows as Light
- blur glass radius10 saturation1 brightness1 distortion0.1 depth0.9 chromatic0
- corners 20 smoothing0.6 style1

**Stacked back card** uses the same style as its front card, but without the two drop shadows (`shadow x0 y4 blur16…` and `shadow x0 y0 blur0.3…` are absent), with corners 22 (Light) or 16 (Dark).

The Single and Stacked frames carry `blend multiply`.

## Finding it in the spec

| Family | grep |
|---|---|
| Notifications | `grep -n '^COMPONENT "Notifications/\(Light\|Dark\)/' specs/notifications.txt` |
| Backgrounds and icon | `grep -n '^COMPONENT "Notifications/􀻃/' specs/notifications.txt` |
| Examples | `grep -n '^COMPONENT "Notifications/Examples/' specs/notifications.txt` |
| Text layers | `grep -n 'text "\(Title\|Description\|Timestamp\)"' specs/notifications.txt` |
