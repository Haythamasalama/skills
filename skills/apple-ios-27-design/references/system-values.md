# System: sizes, colours and states — iOS 27

**Read when:** you need the sizes, colours and states of system on iOS 27, as Apple's kit draws them.
**Owns:** System in Apple's iOS 27 kit: sizes, colours and states.

Source: `specs/system.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `system.md` and `system-screens.md`.

## Sizes

| Item | Width × height | Corner radius | Insets, gaps |
|---|---|---|---|
| iPad screen | 1210×834 | — | — |
| iPhone screen | 402×874 | — | — |
| iPad status bar | 1210×32 | 0 | pad 0,16,0,16; accessories y8 |
| iPhone status bar | 402×62 (17 Pro, 18 Pro), 440×62 (18 Pro Max) | Dynamic Island max | pad top 3 |
| iPhone Duo status bar | 48×83 vertical, 98×48 horizontal | Blur group max | see Anatomy |
| Menu bar item | 57×32 (Menu), 59×32 (App Menu) | max (Selected) | pad 0,10,0,10 |
| Window | 400×400 (master), 880×580 (examples) | 34 | — |
| Window controls | 41×22 | max | dots 5×5 inactive, 6×6 active |
| Resize handle | 32×32 | — | grabber stroke 3.5 |
| Home indicator | 314×20 iPad, 144×20 iPhone (bar height 5) | 100 | bar y7 |
| iPad dock | 740×107 | 36 | pad 19.5, gap 19.5 |
| iPhone dock | 368×103 | 38 | pad 20,19,19,19 |
| Duo dock | 72×264 (Outer, Inner Landscape), 320×92 (Inner Portrait) | 24 / 32 | pad 12, gap 16 / pad 16, gap 16 |
| Search field (iPhone Home Screen) | 78×30 | 41 | text @11,6.66 |
| Home Screen icon | 68 iPad, 64 iPhone, 60 Duo | Not in the kit for the frame (artwork is a bitmap) | label gap 6 / 5 (derived) |
| Badge | 44×24 master; 24×24 or 26×24 instances | 100 | pad 2.5,8,2.5,8 |
| iPad widgets | 136×136, 300×136, 300×300, 628×300 | 21 | padding guide 18 |
| iPhone widgets (body) | 164.67×164.67, 349.67×164.33, 349.67×365, 349.67×565.67 | 28 | name label gap 6 |
| Padding guide | 120×120 | 27.88 outer, 10 inner | 18 |
| Quick Actions menu | 243/250 × 328, 221/250 × 295 | 30 | pad 10,16,8,16 or 10,16,21,16 |
| Quick Actions row | 101×44 master | — | pad 11,8,11,8, gap 12 |
| Notification banner | 300×62.33 (single), 300×78 (with image) | 22 (front), 24 (stacked behind) | pad 12,14,12,14, gap 10 |
| Expanded notification | 501×340 iPad, 370×370 iPhone | 26 | header 66 tall, pad 14 |
| Notification action menu | 250×104 | 32 | pad 20,26,20,26, gap 20 |
| Lock Screen control | 58×58 | 1000 | symbol 50×50 @4,4 |
| Lock Screen rectangular widget | 162×72 | Not in the kit (no corner on the masters) | see Anatomy |
| Lock Screen circular widget | 72×72 (content 58×58) | max | inset 7 |
| iPad Lock Screen widget | 162×162 | — | — |
| CC 1x1 | 66×66 iPad, 68×68 or 70×70 iPhone | max iPad, 34 iPhone | — |
| CC 2x1 | 142×66 iPad, 155×69 iPhone | max iPad, 34 iPhone | pad 0,14,0,14, gap 8 |
| CC 2x2 | 142×142 iPad, 155×155 iPhone | 28 iPad master (34 in the layout), 34 iPhone | pad 14 |
| CC 1x2 | 66×142 iPad, 70×155 iPhone | 34 | — |
| CC button | 40×40 (41×41 iPhone 2x1) | 28 / 20 / 21 | — |
| Scroll edge, hard | 100×112 (example instance 560×64) | — | — |
| Scroll edge, soft | 200×77 (example instance 130×77) | — | — |
| Tab item helper | 72×54 | — | symbol @9,7, label @9,36 |

## Colours and states

### Windows

| Component | Fill | Border / shadow | Dots | Style |
|---|---|---|---|---|
| Dark / Inactive | #767680@24% {Fills/Dark/3 Tertiary} | shadow x0 y0 blur0 spread0.5 #E6E6E6 (plus-darker) | #EBEBF5@60% {Labels/Dark/2 Secondary} | `Liquid Glass/Dark/Regular - Small - Inactive` |
| Light / Inactive | #000000@2% {Fills/Light/5 Quinary} | shadow spread0.5 #EBEBEB (plus-darker) | #3C3C43@60% {Labels/Light/2 Secondary} | none named |
| Dark / Active | #000000 (blend screen) + #999999@17% | glass stack (see Effects) | Close #FF5F57, Minimize #FEBC2F, Expand #27C840 | `Liquid Glass/Dark/Regular - Small` |
| Light / Active | #F8F8F8@20% (luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (plus-lighter) | glass stack | same three colours | `Liquid Glass/Light/Regular - Small` |
| Resize grabber | — | stroke #FFFFFF (Dark), #000000 (Light) | — | — |

### Status bars

| Bar | Content colour |
|---|---|
| iPad, Light Background | accessories #000000 (Trailing instance fill #000000) |
| iPad, Dark Background | accessories tinted #FFFFFF (instance fill #FFFFFF; Leading override `fillColor→#FFFFFF` on Full Screen / Menu Collapsed) |
| iPad Full Screen window controls | Close #FF0B18, Minimize #FFC700, Fullscreen #00C847; symbols #000000@55% (blend plus-darker) |
| iPhone, Light Background | parts #000000 |
| iPhone, Dark Background | parts drawn #000000 inside groups that carry fill #FFFFFF ("Contents - Trailing", "Contents - Leading") |
| iPhone Duo, both | parts #000000; the two variants differ only in their master background (#000000 + #CCCCCC@60% Light, #FFFFFF + #333333@60% Dark) |
| Dynamic Island | #000000 |

### Menu Bar (iPad)

| Appearance | State | Fill | Shadow | Text |
|---|---|---|---|---|
| Dark | Selected | #767680@24% {Fills/Dark/3 Tertiary} (blend plus-darker), corners max | x0 y2 blur16 spread0 #000000@8.3% | #FFFFFF {Labels/Dark/1 Primary} |
| Dark | Unselected | none | none | #FFFFFF {Labels/Dark/1 Primary} |
| Light | Selected | #767680@12% {Fills/Light/3 Tertiary} (blend plus-lighter), corners max | x0 y2 blur16 spread0 #000000@8.3% | #000000 {Labels/Light/1 Primary} |
| Light | Unselected | none | none | #000000 {Labels/Light/1 Primary} |

### Home indicators

| Component | Bar fill |
|---|---|
| Landscape - Dark - iPad, Portrait - Dark - iPhone | #FFFFFF |
| Landscape - Light - iPad, Portrait - Light - iPhone | #000000 |

### Home Screen

| Part | Dark | Light |
|---|---|---|
| Dock (iPad, iPhone, Duo) | `Liquid Glass/Dark/Dock`: fill #333333@33% (blend luminosity) | `Liquid Glass/Light/Dock`: fill #999999@33% (blend luminosity) |
| Search field | `Liquid Glass/Dark/Dock`, #333333@33% (luminosity) | `Liquid Glass/Light/Dock`, #999999@33% (luminosity) |
| Search text | #FFFFFF | #FFFFFF |
| iPad dock separator | #1F1F1F {Fills/Dark - Vibrant/2 Secondary} (blend plus-lighter) | #E0E0E0 {Fills/Light - Vibrant/2 Secondary} (blend plus-darker) |
| App Library frames | `Liquid Glass/Dark/App Library`: #F8F8F8@5% (blend screen) | `Liquid Glass/Light/App Library`: #F8F8F8@8% (blend luminosity) |
| Dimming overlay (Default screens) | #000000@8% | #000000@10% |
| App name label | #FFFFFF, shadow x0 y2 blur25 spread0 #000000 | same |
| Widget name label (iPhone) | #FFFFFF | same |
| Badge | #FF383C {System Colors/Light/1 Red}, text #FFFFFF | same |

### Home Screen Quick Actions

| Part | Dark | Light |
|---|---|---|
| Menu - Widgets | fill #1A1A1A (blend lighten); shadow x0 y18 blur48 spread0 #000000@45%; no named style | fill #CCCCCC@70% (lighten) + #BFBFBF@10% (darken); `Liquid Glass/Light/Regular - Medium`; shadow x0 y18 blur46 #000000@25% |
| Menu - No Widgets | fill #1A1A1A@30% + #1A1A1A@30% (luminosity) + #1A1A1A (lighten); `Liquid Glass/Dark/Regular - Medium`; shadow x0 y18 blur48 #000000@45% | same as Light Menu - Widgets |
| Default row text and symbol | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, blend plus-lighter | #000000 {Labels/Light - Vibrant/1 Primary}, blend plus-darker |
| Destructive row | #FF453A, blend plus-lighter | #FF3B30, blend plus-darker |
| Widgets row glyphs (Frames 2–5) | #404040 {Labels/Dark - Vibrant/3 Tertiary} | #BFBFBF {Labels/Light - Vibrant/3 Tertiary} |
| Widgets row Frame 1 | shape #FFFFFF {Labels/Dark - Vibrant/1 Primary}, no frame fill | frame #E6E6E6, shape #000000 {Labels/Light - Vibrant/1 Primary} |
| Screen overlay | iPad #000000@48%, iPhone #000000 opacity 50% | iPad #000000@20%, iPhone #000000 opacity 20% |

### Notifications

| Part | Over Light | Over Dark |
|---|---|---|
| Banner | `Liquid Glass/Clear` (#F8F8F8@12%, luminosity) | same |
| Title | #000000 {Labels/Light - Vibrant/1 Primary}, blend plus-darker | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, blend plus-lighter |
| Description | #000000 {Labels/Light - Vibrant/1 Primary}, plus-darker | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, plus-lighter |
| Time | #999999 {Labels/Light - Vibrant/2 Secondary}, plus-darker | #999999 {Labels/Dark - Vibrant/2 Secondary}, plus-lighter |
| Image | bitmap, opacity 50% | same |

| Expanded card part | Dark | Light |
|---|---|---|
| Card | #111111 | #FFFFFF |
| Header title / description | #FFFFFF {Labels/Dark - Vibrant/1 Primary} | #000000 {Labels/Light/1 Primary} |
| Header time "now" | #EBEBF5@60% {Labels/Dark/2 Secondary} | #3C3C43@60% {Labels/Light/2 Secondary} |
| Body | #0088FF@50% (content placeholder); text #FFFFFF {Labels/Dark/1 Primary} | same fill; text #000000 {Labels/Light/1 Primary} |
| Action menu | unnamed glass (iPad) / `Liquid Glass/Dark/Regular - Medium` with #1A1A1A fills (iPhone) | unnamed glass |
| Action text and symbol | #FFFFFF@95% | #000000@95% |

| Screen overlay | Dark | Light |
|---|---|---|
| iPad Expanded | #000000, opacity 25% | same |
| iPad Collapsed | #000000, opacity 5% | same |
| iPhone Expanded | #000000@60% | #000000@60% |
| iPhone Collapsed | #000000@25% + #000000@5% (opacity 32%, blend saturation); plus "Overlay Blurred" #000000@32% | #000000@52% |

### Lock Screen

| Part | Colour |
|---|---|
| iPhone date text | #000000 {Labels/Light - Vibrant/1 Primary}, layer fill #000000@25% + #999999 (blend plus-lighter) |
| iPad lockup date and lock glyph | #FFFFFF |
| Time shape | `Liquid Glass/Lock Screen Time`: #F8F8F8@25% (luminosity) + #1A1A1A (plus-lighter) |
| Lock Screen control | `Liquid Glass/Clear`; symbol #FFFFFF |
| Swipe-down indicator | #404040 (blend plus-lighter) |
| Widget primary text, icons, filled gauge | #999999 {Labels/Dark - Vibrant/2 Secondary}, mostly blend plus-lighter |
| Widget tertiary text, gauge track | #404040 {Labels/Dark - Vibrant/3 Tertiary} |
| Circular widget backplate ("Plus Lighter") | #262626 {Labels/Dark - Vibrant/4 Quaternary} (blend plus-lighter) |
| Modular Table header symbol | text #FFFFFF, layer fill #999999 {Labels/Dark - Vibrant/2 Secondary} |
| iPad Clock Big numerals and hands | #999999 {Labels/Dark - Vibrant/2 Secondary}; second hand #404040 {Labels/Dark - Vibrant/3 Tertiary}; ticks #1A1A1A |
| iPad Date | "Wed" fill #404040 Tertiary, "Apr" fill #999999 Secondary (text colour #FFFFFF, both plus-lighter) |

The kit draws the Lock Screen widgets only once, with the Dark - Vibrant label swatches; there are no Light variants.

### Control Center

| Part | Off | On |
|---|---|---|
| Tile surface | `Liquid Glass/Clear` (#F8F8F8@12%, luminosity) | the same `Liquid Glass/Clear` stack (no extra fill in the dump) |
| Title | #FFFFFF | #000000 |
| Detail | iPad #FFFFFF@40% (plus-lighter); iPhone #FFFFFF@33% | iPad #000000@40% (plus-darker); iPhone 2x2 #000000 with layer fill #000000@40% (plus-darker); iPhone Toggle #000000@40% |
| Button (iPad) | #1F1F1F {Fills/Dark - Vibrant/2 Secondary} | 2x2 and Toggle: none; Menu: #333333 {Fills/Dark - Vibrant/1 Primary} |
| Button (iPhone) | #FFFFFF@15% | 2x2 and Toggle: none; Menu: #FFFFFF@30% + #333333@40% (plus-lighter) |
| Button glyph "􀆺" | #FFFFFF | #FF453A |
| 1x1 glyph "􀑚" | #FFFFFF | #000000 |
| 2x1 Menu label / indicator | #FFFFFF / #FFFFFF@40% (plus-lighter) | same as Off |

| CC screen part | Dark | Light |
|---|---|---|
| Overlay iPad | #000000@45% (`􀻃/Overlay`) | same |
| Overlay iPhone | #000000@50%, blur background radius13.5 saturation1.4 | same |
| Index scrubber, inactive items | #FFFFFF, opacity 40% (plus-lighter) | iPad: #000000, opacity 25% (plus-darker); iPhone: as Dark |
| Index scrubber, active item | #FFFFFF, shadow x0 y0 blur24 spread0 #000000@15% | same |
| Plus / Power circles (iPhone) | #1F1F1F {Fills/Dark - Vibrant/2 Secondary} (plus-lighter), glyph #FFFFFF | same |
| Enabled toggles in 2x2 - Group | Wi-Fi / Bluetooth: #FFFFFF@60% (iPhone) or @50% (iPad) + #0088FF {System Colors/Light/8 Blue} (plus-darker); Cellular: iPhone #FFFFFF@60% + #34C759 {System Colors/Light/4 Green} (plus-darker), iPad #34C759 | same |
| Disabled toggles in 2x2 - Group | iPhone #1F1F1F {Fills/Dark - Vibrant/2 Secondary}; iPad #FFFFFF@15% | same |
| Slider fill ("Stack") | #333333@35% + #000000@20% (plus-darker) + #CCCCCC@20% + #FFFFFF@70% (plus-lighter) | same |
| Brightness glyph | text #FFFFFF, layer fill #FFCC00 | same |
| Volume speaker | #32ADE6 (one part at opacity 50%) | same |
| Now Playing glyphs | 􀊆 #FFFFFF {Labels/Dark - Vibrant/1 Primary}; 􀊊 and 􀊌 #404040 {Labels/Dark - Vibrant/3 Tertiary}, all plus-lighter (iPad text colour stored as #000000 under these fills) | same |
| Track / Artist | #FFFFFF / #FFFFFF@40% | same |
| Album artwork | iPad #FFFFFF + image; iPhone Dark #D8D8D8, iPhone Light #FFFFFF + image | — |
| Battery and Mirror Screen shapes | iPhone: #FFFFFF and #FFFFFF opacity 50% | iPhone: #404040 {Labels/Dark - Vibrant/3 Tertiary} and #FFFFFF, plus-lighter |

### Scroll edge effect

| Component | Colour layer | Blur |
|---|---|---|
| Dark/Top - Hard | #000000 {Backgrounds/Dark - Base/Primary}, opacity 55%; border 0.67 inside #FFFFFF@10% | blur background radius6 saturation1 |
| Light/Top - Hard | #FFFFFF {Backgrounds/Light/Primary}, opacity 85% | blur background radius6 saturation1 |
| Top - Soft (no text) | mask: linear gradient top to bottom, #FFFFFF 0% → #FFFFFF@0% 100%, opacity 60% | blur background radius100 saturation1 |

### Tab bar helper

Symbol and label #1A1A1A {Labels - Liquid Glass/Light/1 Primary}, centre aligned, blend plus-darker.
