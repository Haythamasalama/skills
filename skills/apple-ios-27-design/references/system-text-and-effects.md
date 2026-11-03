# System: text, effects and kit notes — iOS 27

**Read when:** you need the text, effects and kit notes of system on iOS 27, as Apple's kit draws them.
**Owns:** System in Apple's iOS 27 kit: text, effects, kit notes.

Source: `specs/system.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `system.md` and `system-screens.md`.

## Text

Only one text layer on the page is bound to a shared text style: the example body text in `Examples/Windows` uses `06 Body/1 Default` (SFPro-Regular 17, lh22). All other text is set directly.

| Part | Font | Size | Line height | Tracking | Align |
|---|---|---|---|---|---|
| iPad status bar time, AM/PM, date, battery % | SFPro-Medium | 14 | Not in the kit | 0 | left (% right) |
| iPad menu bar item | SFPro-Medium | 14 | 16 | 0 | centre |
| iPad menu bar App Menu | SFPro-Bold | 14 | 16 | 0 | centre |
| iPhone 17 Pro / 18 Pro status bar time | SFPro-Semibold | 17.67 | 22 | 0 | centre |
| iPhone 18 Pro Max status bar time | SFPro-Semibold | 18.67 | 22 | 0 | centre |
| iPhone Duo status bar time | SFProRounded-Bold | 16 | Not in the kit | 0 | centre |
| App name under icons | SFPro-Medium | 12 | Not in the kit | 0 | centre |
| Widget name (iPhone) | SFPro-Medium | 12 | Not in the kit | 0 | centre |
| Badge count | SFPro-Regular | 16 | Not in the kit | 0 | — |
| Home Screen search field | SFPro-Semibold | 12 | 16 | -0.1 | centre |
| Quick Actions row label and symbol | SFPro-Regular | 17 | 22 | 0 | — |
| Quick Actions widget glyphs | SFPro-Medium | 15 | 25 | 0 | — |
| Banner title | SFPro-Semibold | 15 | 17 | 0 | — |
| Banner time | SFPro-Regular | 15 | 17 | 0 | — |
| Banner description | SFPro-Regular | 15 | 18 | 0 | — |
| Expanded card title | SFPro-Semibold | 15 | 17 | 0 | — |
| Expanded card description, body | SFPro-Regular | 15 | 18 (iPhone Light 17) | 0 | — |
| Expanded card time "now" | SFPro-Regular | 13 | 17 | 0 | — |
| Notification action label and symbol | SFPro-Regular | 17 | 22 | 0 | — |
| iPhone Lock Screen date | SFPro-Semibold | 22 | Not in the kit | 0 | centre |
| iPad lockup date | SFPro-Medium | 23 | Not in the kit | 0 | — |
| iPad lockup lock glyph | SFPro-Medium | 19 | Not in the kit | 0 | — |
| Lock Screen control symbol | SFPro-Semibold | 18 | Not in the kit | 0 | centre |
| CC tile title, 2x1 label | SFPro-Semibold | 14 | Not in the kit | 0 | left |
| CC tile detail | SFPro-Medium | 14 | 20 | 0 | left |
| CC menu indicator "􀆏" | SFPro-Regular | 14 | 20 | 0 | — |
| CC button glyph "􀆺" | SFPro-Bold | 15 | Not in the kit | 0 | centre |
| CC 1x1 glyph "􀑚" | iPad SFPro-Regular 32; iPhone SFPro-Bold 21 | — | Not in the kit | 0 | — |
| CC Rotation Lock glyph | SFPro-Medium 31 (iPad), 32 (iPhone) | — | — | 0 | — |
| CC Camera glyph "􀌟" | SFPro-Bold | 19 | — | 0 | — |
| CC Airplane glyph "􀑓" | SFPro-Medium 16 (iPad), SFPro-Bold 16 (iPhone) | — | — | 0 | — |
| CC brightness glyph "􀆮" | SFPro-Medium | 25 | — | 0 | centre |
| CC Now Playing track / artist | SFPro-Semibold 14 / SFPro-Medium 14 lh20 | — | — | 0 | — |
| CC playback glyphs | SFPro-Semibold 25 (play) and 16 (back, forward) | — | — | 0 | centre |
| CC plus, power glyphs | SFPro-Bold | 15 | — | 0 | — |
| CC status row "100%", Wi-Fi glyph (iPad) | SFPro-Medium | 15 | — | 0 | — |
| iPad Clock Big numerals | SFPro-Semibold | 17 | — | 0 | — |
| iPad Date weekday, month | SFPro-Semibold | 32 | — | 0 | — |
| Tab bar helper label / symbol | SFPro-Semibold 10 kern-0.1 / SFPro-Semibold 18 lh22 | — | — | — | centre |

Lock Screen widget text:

| Widget part | Font | Size | Line height |
|---|---|---|---|
| Modular with Bar title | SFPro-Semibold | 16 | 19 |
| Modular with Bar subtitles | SFPro-Regular | 16, 15 | 17 |
| Rectangular with Chart icon / title / content | SFPro-Regular 12 / SFPro-Bold 15 / SFPro-Regular 15 | — | 16 / 20 / 20 |
| Rectangular Text Gauge symbol / title / second line | SFPro-Regular 15 / SFPro-Semibold 15 / SFPro-Regular 15 | — | 20 / 20 / 16 |
| Tall Body with Icon header / content | SFPro-Semibold 15 / SFPro-Regular 43 | — | 20 / 34 |
| Tall Body title / content | SFPro-Bold 15 / SFPro-Regular 34 | — | 20 / 40 |
| Modular Columns symbol / title / content | SFPro-Regular 12 / SFPro-Semibold 15 / SFPro-Regular 15 | — | 16 / 20 / 20 |
| Modular Table header symbol / header / rows | SFPro-Semibold 17 / SFPro-Semibold 15 / SFPro-Regular 15 | — | 16 / 18 / 16 |
| Modular Standard icon / "HEADER" / preview | SFPro-Semibold 13 / SFPro-Heavy 13 / SFPro-Medium 12 | — | 13 / 13 / 16 |
| Modular List symbol / item | SFPro-Medium 12 / SFPro-Semibold 15 | — | 16 / 20 |
| Circular Icon glyph | SFPro-Regular | 24 | 29 |
| Open Gauge 2/3 value / labels | SFPro-Medium 24.52 / SFPro-Medium 12.26 | — | Not in the kit |
| Open Gauge value / icon | SFPro-Regular 17 / SFPro-Semibold 15 | — | 24 / 20 |
| Closed Gauge icon | SFPro-Semibold | 19 | 28 |
| Stack 2 Rows small row / main row | SFPro-Regular 11 / SFPro-Regular 15 | — | 13 / 20 |
| Clock city | SFPro-Medium | 9.49 | Not in the kit |
| Stack 3 Rows icon / time / "PM" | SFPro-Regular 12 / SFPro-Semibold 15 / SFPro-Regular 11 | — | 16 / 20 / 13 |

Lock Screen widget text layers also carry a background blur (radius 70, 72, 75 or 112.5) and blend plus-lighter; see Effects.

SF Symbols glyphs used on the page (character, code point, where):

| Glyph | Code point | Used in |
|---|---|---|
| 􀓔 | U+1004D4 | Quick Actions rows, notification actions |
| 􀁎 | U+10004E | Quick Actions "Remove App" |
| 􀎽 | U+1003BD | Quick Actions "Require Face ID" |
| 􀮖 | U+100B96 | Quick Actions "Edit Home Screen" |
| 􂘬, 􂘭, 􂘮 | U+10262C, U+10262D, U+10262E | Quick Actions widgets row |
| 􀊫 | U+1002AB | Home Screen search field |
| 􀎡 | U+1003A1 | iPad lockup "Lock" |
| 􀇕 | U+1001D5 | iPad lockup date line |
| 􀌟 | U+10031F | Lock Screen control, CC Camera |
| 􀝌 | U+10074C | Lock Screen control override (Action 1) |
| 􀿫 | U+100FEB | Lock Screen widget icons |
| 􀀀 | U+100000 | Modular List item symbol |
| 􀆴 | U+1001B4 | Circular Stack 3 Rows icon |
| 􀙖 | U+100656 | 4 Circular override |
| 􀛤 | U+1006E4 | Rectangular with Chart override (iPad example) |
| 􀆺 | U+1001BA | CC button glyph |
| 􀆏 | U+10018F | CC menu indicator |
| 􀑚 | U+10045A | CC 1x1 and Rotation Lock |
| 􀛮 | U+1006EE | CC 2x2 Control override |
| 􀋚 | U+1002DA | CC 1x1 Control override |
| 􀆮 | U+1001AE | CC brightness |
| 􀊊, 􀊆, 􀊌 | U+10028A, U+100286, U+10028C | CC playback |
| 􀑓 | U+100453 | CC Airplane Mode |
| 􀙇 | U+100647 | CC iPad status Wi-Fi |
| 􀅼 | U+10017C | CC plus |
| 􀆨 | U+1001A8 | CC power |
| 􀟉 | U+1007C9 | Tab bar helper symbol |
| 􀈎, 􀉌, 􀈕, 􀈟, 􀋉, 􀈣, 􀋂, 􀈩 | U+10020E, U+10024C, U+100215, U+10021F, U+1002C9, U+100223, U+1002C2, U+100229 | Overrides on the sidebar and navigation bar in `Examples/Windows` |
| 􀟞 | U+1007DE | Page title |
| 􀻃 | U+100EC3 | Component path segment for building blocks |

## Effects

Shared glass styles used on this page (full values in `materials.md`):

| Style | Where | Layer values that differ from the shared style |
|---|---|---|
| `Liquid Glass/Clear` | banners, CC tiles, Lock Screen controls (59 uses) | iPhone CC tiles: blur glass radius13.5 (style: radius3); iPhone Dark CC 1x2 sliders keep radius3; inline CC tiles corners 34 |
| `Liquid Glass/Dark/Dock`, `…/Light/Dock` | iPad, iPhone and Duo docks; iPhone search field | corners 38 (iPhone), 41 (search), 24/32 (Duo) |
| `Liquid Glass/Dark/App Library`, `…/Light/App Library` | iPad dock folder frames | corners 16/15 on the back frames |
| `Liquid Glass/Widget Glass` | every Home Screen widget | corners 21 (iPad) / 28 (iPhone); the iPad Extra Large "Glass" layer has no blur glass entry |
| `Liquid Glass/Lock Screen Time` | Lock Screen time shapes | — |
| `Liquid Glass/Dark/Regular - Medium` | Dark Quick Actions menu (No Widgets), iPhone Dark notification menu | — |
| `Liquid Glass/Light/Regular - Medium` | Light Quick Actions menus | — |
| `Liquid Glass/Dark/Regular - Small`, `…/Light/Regular - Small` | active window controls | — |
| `Liquid Glass/Dark/Regular - Small - Inactive` | Dark inactive window controls | — |
| `Materials/Light/4 Ultrathin` | iPad Clock Big face | layer adds blur background radius45 saturation1.1 |

Glass values as stored on the layers:

| Layer | blur glass | Other effects |
|---|---|---|
| Dock (all), search field, CC iPad tiles, banners, widgets, Lock Screen control | radius3 saturation1 brightness1 distortion0.2 depth0.5 chromatic0 | per style |
| App Library frames | radius5 saturation1.3 brightness1 distortion0.2 depth0.5 chromatic0 | — |
| Lock Screen time | radius3 saturation1.4 brightness1 distortion0.2 depth0.5 chromatic0 | — |
| iPhone CC tiles | radius13.5 saturation1 brightness1 distortion0.2 depth0.5 chromatic0 | — |
| Window controls, active | Dark: radius6 saturation1 brightness1 distortion0.4 depth0.8; Light: radius6 saturation2 brightness1 distortion0.4 depth0.8 | — |
| Quick Actions menu, Dark | radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0 | shadow x0 y18 blur48 spread0 #000000@45% |
| Quick Actions menu, Light | radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0 | shadow x0 y18 blur46 spread0 #000000@25% |
| Notification action menu, Dark (iPad) | radius12 saturation0.69 brightness0.85 distortion0.3 depth0.2 chromatic0 | inner-shadow x0 y1 blur2 spread0 #000000 (blend screen); inner-shadow x-2 y-2 blur2 spread-2.5 #666666 (plus-lighter); inner-shadow x2 y2 blur2 spread-2.5 #666666 (plus-lighter) |
| Notification action menu, Light (iPad, iPhone) | radius12 saturation0.7 brightness2.2 distortion0.3 depth0.2 chromatic0 | same three inner shadows |
| Notification action menu, Dark (iPhone) | radius30 saturation1.2 (via `Liquid Glass/Dark/Regular - Medium`) | inner-shadows x0 y±4 blur8 spread-4 #222222, x0 y±1 blur1.5 spread-0.5 #404040 (plus-lighter), x0 y2 blur0.2 spread-1.2 #FFFFFF@20%; shadow x0 y18 blur48 #000000@45%; shadows x0 y0 blur0.3 spread0.3 and x±1.25 spread-0.75 #A6A6A6 (plus-darker) |

Background blurs:

| Layer | Value |
|---|---|
| iPhone blurred wallpaper | blur background radius30 saturation1, over fill #F2F2F2 (plus-darker) |
| iPad status bar, Full Screen / Menu Expanded | Dark: blur background radius10 saturation1 progressive; Light: radius8 saturation1 progressive |
| iPhone Duo status bar "Blur" group | blur background radius16 saturation1, corners max, opacity 30% |
| Scroll edge, hard | radius6 saturation1 |
| Scroll edge, soft | radius100 saturation1 under a 60% gradient mask |
| iPhone CC overlay | radius13.5 saturation1.4 |
| iPad CC (Dark only) "Blur" group | three mask + blur pairs: mask 446×596 @-75,-75 (blur gaussian radius30) over background blur 696×846 @-200,-200 radius1.5; mask 406×556 @-55,-55 (gaussian 20) over radius1.5; mask 326×476 @-15,-15 (gaussian 10) over radius4.5 |
| CC slider fills | radius60 saturation1 (iPad both, iPhone Dark; none on iPhone Light) |
| iPhone notifications, Collapsed (Dark) | rect "Overlay Blurred" #000000@32%, blur gaussian radius100 |
| iPhone Lock Screen date | radius90 (Expanded notification screens) / radius60 (Collapsed notification screens and Lock Screen examples) saturation1 |
| Lock Screen circular widgets | "Blur" groups radius20 (Icon, Stack, Clock, Closed Gauge) or radius40 (Open Gauges) saturation1 |
| Lock Screen widget text and parts | radius70, 72 (saturation0.85), 75, 108 (saturation0.85) or 112.5, blend plus-lighter |
| iPad Date | radius70 saturation1 |

Shadows:

| Layer | Shadow |
|---|---|
| Window (master and examples) | x0 y30 blur146 spread0 #000000@30% |
| Menu bar item, Selected | x0 y2 blur16 spread0 #000000@8.3% |
| App name label | x0 y2 blur25 spread0 #000000 |
| CC album artwork | x0 y4 blur13 spread0 #000000@15% |
| Quick Actions menus | see glass table |
| Window controls, inactive | x0 y0 blur0 spread0.5 #E6E6E6 (Dark) / #EBEBEB (Light), plus-darker |
| CC index scrubber, active item | x0 y0 blur24 spread0 #000000@15% |

Blend modes: vibrant text and glyphs over glass use plus-lighter on dark surfaces and plus-darker on light surfaces (Quick Actions rows, banners, CC detail text, Lock Screen widgets). Glass fills use luminosity (Clear, Dock, Light App Library), screen (Dark App Library) or lighten/darken (Quick Actions menus).

## Kit notes

The System page has no documentation boards. Its only free text is the section headings ("Hardware", "Window", "Control Center", "Status Bar and Menu Bar", "Home Indicator", "Lock Screen Widgets", "System - Notifications", "Home Screen Quick Actions", "Home Screen", "Home Screen Widgets", "Scroll Edge Effect", "Wallpapers", all SFPro-Bold 60 #FFFFFF) and the caption in the two scroll edge examples, which describes them as an example of the soft scroll edge style.

What the kit shows by construction:

- Every iPhone screen uses the iPhone 18 Pro status bar on its Dark Background variant, and every iPad screen uses the Dark Background / Full Screen / Menu Collapsed bar, in the Light and the Dark screens alike.
- The iPhone Home Screen icon grid is 4 columns, 342 wide, 30 from each edge; the iPad grid is 6 columns, 886 wide, 162 from each edge.
- Widgets take whole icon cells: layouts replace covered icons with blank cells of icon size.
- Notification banners stack by shrinking each banner behind by 20 per side and showing 8 of it.
- Control Center on iPad is a 4-column grid of 66-pt cells with 10 gaps (derived), placed at the top-right.

## Finding it in the spec

| Family | grep pattern on `specs/system.txt` |
|---|---|
| Wallpapers | `^COMPONENT "Wallpapers/` |
| Window example | `^COMPONENT "Examples/Windows"` |
| Menu bar examples | `^COMPONENT "Examples/Menubar/` |
| Window, controls, resize | `^COMPONENT "Windows/` |
| iPad status bars | `^COMPONENT "Status Bars/iPad/` and `Status Bars/􀻃/iPad/` |
| iPhone status bars | `^COMPONENT "Status Bars/iPhone 1[78]` |
| iPhone Duo status bars | `^COMPONENT "Status Bars/iPhone Duo/` |
| Menu bar items | `^COMPONENT "Menu Bar (iPad)/` |
| Home indicators | `^COMPONENT "Home Indicators/` |
| Docks | `Dock - iPad/iPad"` and `Dock - iPhone/iPhone"` |
| Home Screen layouts | `^COMPONENT "System/Home Screen/􀻃/Layouts - ` |
| Home Screen screens | `^COMPONENT "System/Home Screen/(Dark|Light)/` (grep -E) |
| Home Screen widgets | `^COMPONENT "System/Home Screen/Widgets/` and `Padding Guide (18pt)` |
| Search field | `^COMPONENT "System/Home Screen/􀻃/Search Field/` |
| Quick Actions | `^COMPONENT "System/Home Screen Quick Actions/` |
| Notification screens | `^COMPONENT "System/Notifications/(Dark|Light)/` (grep -E) |
| Banners | `^COMPONENT "System/Notifications/Over (Light|Dark)/Banners/` (grep -E) |
| Lock Screen widgets | `^COMPONENT "System/Lock Screen Widgets/Widgets/` |
| Lock Screen lockup, control, examples | `iPad - Lock Screen Date & Time Lockup`, `^COMPONENT "System/Lock Screen Widgets/Control"`, `Lock Screen Widgets/Examples/` |
| Control Center tiles | `^COMPONENT "System/Control Center/􀻃/Controls - (iPad|iPhone)/` (grep -E) |
| Control Center screens | `^COMPONENT "System/Control Center/(Dark|Light)/` (grep -E) and `Control Center/􀻃/Overlay` |
| App icon artwork | `^COMPONENT "App Icons/Artwork/(Default|Dark)/` (grep -E) |
| App icon frames, badge | `^COMPONENT "App Icons/Home Screen/` and `App Icons/􀻃 - Badge/Badge` |
| Duo lens | `^COMPONENT "iPhone Duo/Outer Display Lens"` |
| Scroll edge | `^COMPONENT "Scroll Edge Effect/` and `group "Scroll Edge Effect Example"` |
| Tab bar helper | `^COMPONENT "Tab Bars/􀻃/` |
| Section headings | `^text ".*" [0-9.]+×71` (grep -E) |
