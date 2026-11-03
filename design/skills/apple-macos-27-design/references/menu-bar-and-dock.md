# Menu Bar and Dock — macOS 27

**Read when:** you need an exact macOS 27 value for menu Bar and Dock (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Menu Bar and Dock in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/menu-bar-and-dock.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

114 components in six families.

| Family | Variant axes | Components |
|---|---|---|
| `Menu Bar/Item/<Background>/<Kind>/<State>` | Background: `On Lighter Background`, `On Darker Background` · Kind: `Item`, `App Name` (states `Idle`, `Selected`), `Apple Logo` (no state) | 10 |
| `Menu Bar/Over <Wallpaper> Wallpaper` | `Light`, `Dark` | 2 |
| `Menu Bar/Examples/<Appearance>` | `Light`, `Dark` (1512 × 993 desktops) | 2 |
| `Dock/<Appearance> Dock`, `Dock/Icon` | `Light`, `Dark` | 3 |
| `Dock/Examples/<Appearance>` | `Light`, `Dark` (1512 × 993 desktops) | 2 |
| `App Icons/<App>/<Variant>` | 47 apps × `Default`, `Dark`, plus `App Icons/Folder Icon` | 95 |

App Icons apps: Airdrop, App Store, Apps, Books, Calculator, Calendar, Contacts, Custom, FaceTime, Final Cut Pro, Find My, Finder, Freeform, Games, Home, Keynote, Mail, Maps, Messages, Mirroring, Music, News, Notes, Numbers, Pages, Passwords, Phone, Photo Booth, Photos, Podcasts, Preview, Quicktime Player, Reminders, Safari, Shortcuts, Siri, Stocks, System Settings, TV, Terminal, TextEdit, Trash Empty, Trash Full, Voice Memos, Weather, Xcode, iMovie. Each is a 72 × 72 master holding one 72 × 72 `image` (for example `Trashfull.light`, `Trashfull.dark`); `Custom` holds `placeholder-Default` / `placeholder-Dark`.

The page has no documentation boards; its only free text layers are the page title ("Menu Bar and Dock") and the "Light" / "Dark" headings.

## Anatomy

### Menu bar (`Menu Bar/Over Light Wallpaper`, `Menu Bar/Over Dark Wallpaper`, 1000 × 45)

`stack h gap202 pad10,20,11,10`. The masters have no fill, blur or glass of their own in the dump: the bar draws only its items over the wallpaper.

| Layer | Over Light Wallpaper | Over Dark Wallpaper |
|---|---|---|
| `Leading` (`stack h gap0`) | 529×24 @10,10 | 537×24 @10,10 |
| `Trailing` (`stack h gap0`) | 237×24 @743,10 | 237×24 @743,10, holding a second `Trailing` 237×24 @0,0 (outer `stack h gap3`) |

`Leading` items, left to right (Light widths, Dark widths in brackets):

| Instance | Component | Size | x | Text |
|---|---|---|---|---|
| `Apple Menu` | `…/Apple Logo` | 33×24 | 0 | 􀣺 U+1008FA |
| `App Menu` | `…/App Name/Idle` | 87×24 | 33 | "App Name" |
| `Menu 1` | `…/Item/Idle` | 41 (42) ×24 | 120 | "File" |
| `Menu 2` | Light: `…/Item/Selected`; Dark: `…/Item/Idle` | 43 (44) ×24 | 161 (162) | "Edit" |
| `Menu 3` | `…/Item/Idle` | 49 (50) ×24 | 204 (206) | "View" |
| `Menu 4`–`Menu 6` | `…/Item/Idle` | 53 (54) ×24 each | 253, 306, 359 (256, 310, 364) | "Menu" |
| `Menu 7` | `…/Item/Idle` | 69 (70) ×24 | 412 (418) | "Window" |
| `Menu 8` | `…/Item/Idle` | 48 (49) ×24 | 481 (488) | "Help" |

Over Light Wallpaper uses the `On Lighter Background` items; Over Dark Wallpaper uses `On Darker Background`.

`Trailing` contents (same positions in both):

| Layer | Size | Position | Contents |
|---|---|---|---|
| `Stack` (`stack h gap6`) | 103×16 | @0,4 | `Wifi` 30×12.5 @0,1.75 (`stack h pad0,0,0.5,0`; shape `Wifi` 16.36×12 @6.82,0) · `Spotlight` 31×16 @36,0 (`pad0,10,1,6`; text `Symbol` 16×15 @6,0 "􀊫" U+1002AB) · `Control Center` 30×16 @73,0 (`pad0,1.5,0,0`; group `switch.2` 13.39×13.42 @7.55,1.29 of three shapes) |
| `Date` (`stack h pad4,0,5,12`) | 75×24 | @103,0 | text `Date` 63×15 @12,4 "Wed Apr 1" |
| `Time` (`stack h pad0,0,1,8`) | 59×16 | @178,4 | text `Time` 51×15 @8,0 "9:41 AM" |

### Menu bar items (`Menu Bar/Item/…`)

| Component | Size | Auto layout | Text layer | Selection layer |
|---|---|---|---|---|
| `On Lighter Background/Item/Idle` | 53×24 | `stack h pad4,9,5,9` | `Menu` 35×15 @9,4 | — |
| `On Lighter Background/Item/Selected` | 53×24 | `stack h pad4,9,5,9`, layer `blend plus-darker` | `Menu` 35×15 @9,4 | rect `Selection` 60.93×25 @-4,-1, corners 13 |
| `On Darker Background/Item/Idle` | 54×24 | `stack h pad4,9,5,10` | `Menu` 35×15 @10,4 | — |
| `On Darker Background/Item/Selected` | 54×24 | `stack h pad4,9,5,10`, layer `blend plus-darker` | `Menu` 35×15 @10,4 | rect `Selection` 62×25 @-4,-1, corners 13 |
| `…/App Name/Idle` (both) | 87×24 | `stack h pad4,9,5,11` | `App Name` 67×15 @11,4 | — |
| `…/App Name/Selected` (both) | 87×24 | `stack h pad4,9,5,11` | `App Name` 67×15 @11,4 | rect `Selection` 95×25 @-4,-1, corners 13 |
| `On Lighter Background/Apple Logo` | 33×24 | none | `Apple Logo` 15×20 @9.5,0.5 "􀣺" | — |
| `On Darker Background/Apple Logo` | 33×24 | none | `Apple Logo` 15×20 @9.5,1 "􀣺" | — |

The Idle, App Name and Apple Logo masters carry `fill #8E8E8E` on the master frame itself; the two `Item/Selected` masters don't.

### Menu Bar examples (1512 × 993)

| Layer | Light | Dark |
|---|---|---|
| frame fill | none | gradient linear {-1.355686396475875e-15, 0}→{0.999999999999999, 0.98940625} [#7A4D9A 0%, #3B6890 100%] |
| `Wallpaper` | `Wallpaper/Light` 1512×993 | `Wallpaper/Dark` 1512×993 |
| `Menu Bar` | `Menu Bar/Over Dark Wallpaper` 1512×45 @0,0, text "Wed Apr 1" | same |
| `Menu without Selection` | group 270×342 @166,43, style `Liquid Glass/Light/Menus` | group 270×342 @165,43, style `Liquid Glass/Dark/Menus` |

The open menu is `stack v gap0 pad5,16,5,16`, corners 12, and holds `Menus/<A>/Regular/…` instances (documented on the Menus page): 12 items of 238×24 and 4 separators of 238×11, each with `corners 7`. Top to bottom: Undo, Redo (`4 - Disabled`), separator, Cut, Copy, Paste (`2 - Hover`), Delete, Select All, separator, Search, separator, Writing Tools (`Items - Submenu`), separator, AutoFill (`Items - Submenu`), Start Dictation…, Emoji & Symbols. Derived: 5 + 12 × 24 + 4 × 11 + 5 = 342. The menu's top (y 43) is 2 above the bottom of the 45-tall bar (derived).

### Dock (`Dock/Light Dock`, `Dock/Dark Dock`, 1107 × 58)

`stack h gap9 pad11,8,0,8`, corners 15.

| Layer | Size | Position | Notes |
|---|---|---|---|
| 22 app slots | 36×47 (`Dock/Icon`), or 36×36 for the Dark Dock's bare `Icon` | x 8, 53, 98 … 953 (step 45), y 11 | instance names, left to right: Finder, Launch Pad, Safari, Messages, Mail, Maps, Photos, FaceTime, Calendar, Contacts, Reminders, Freeform, TV, Music, Keynote, Numbers, Pages, App Store, Games, then three more slots (Light: three `iPhone Mirroring` instances showing Mirroring, Siri and System Settings; Dark: two `iPhone Mirroring` showing Mirroring and Siri, and a bare `Icon` → `App Icons/System Settings/Dark`) |
| `Separator` group (`stack v pad0,5,0,5`) | 11×36 | @998,11 | rect `Separator` 1×41 @5,-2.5 |
| `Folder` | 36×36 | @1018,11 | → `App Icons/Folder Icon` |
| `Trash` | 36×36 | @1063,11 | → `App Icons/Trash Empty/Default` (Light) / `…/Dark` (Dark) |

Derived: icon pitch 45 = 36 + gap 9; 1063 + 36 + 8 = 1107.

Some slot names don't match the icon swapped in: `Calendar` shows Phone, `Contacts` shows Calendar, `Reminders` shows Contacts and `Freeform` shows Notes (both docks).

`Dock/Icon` (36 × 47, `stack v gap3 pad0,0,4,0`): `Icon` use 36×36 @0,0 → `App Icons/Finder/Default`, and `Dot` 4×4 @16,39, corners max. Derived: the dot is centred ((36 − 4) / 2 = 16) and sits 3 below the icon. Dock instances carry `isVisible` overrides; the dump doesn't say which layer they toggle.

### Dock examples (1512 × 993)

`Wallpaper` + `Stack` 1512×62 @0,931 holding the `Dock` 1107×58 @202.5,0 + `Menu Bar` → `Menu Bar/Over Dark Wallpaper`. Derived: the Dock is centred ((1512 − 1107) / 2 = 202.5) and its bottom is 4 above the screen edge (993 − 931 − 58 = 4). Frame gradients: Light [#CBABE2 0%, #9DC6EA 100%], Dark [#7A4D9A 0%, #3B6890 100%], same direction as above.

## Sizes

| Part | Size | Padding / spacing |
|---|---|---|
| Menu bar | 1000 × 45 master (1512 × 45 in examples) | pad 10 top, 20 right, 11 bottom, 10 left; item row 24 tall at y 10 |
| Menu item | text width + 18 (derived: 35 + 9 + 9 = 53 Light) | Light pad 9 / 9; Dark pad 10 left, 9 right |
| App Name item | 87 × 24 | pad 11 left, 9 right |
| Apple Logo item | 33 × 24 | glyph 15×20 at x 9.5 |
| Selection highlight | 60.93 × 25 (Light item), 62 × 25 (Dark item), 95 × 25 (App Name), at @-4,-1 | corners 13 |
| Status icons gap | 6 | |
| Dock | 1107 × 58 | pad 11 top, 8 sides, 0 bottom; gap 9; corners 15 |
| Dock icon | 36 × 36 (from 72 × 72 masters) | |
| Running-app dot | 4 × 4 | 3 below the icon |
| Dock separator | 1 × 41 line in an 11-wide slot | |
| Dock magnification, hover labels, menu bar heights for other displays | Not in the kit | |

## Colours and states

### Menu bar text and icons

| Background | Part | Colour |
|---|---|---|
| On Lighter / Over Light | Menu titles, App Name, Apple Logo, Time, Date, Spotlight glyph, Wi-Fi and Control Center shapes | #000000@85% (not bound to a swatch) |
| On Darker / Over Dark | Menu titles, App Name, Apple Logo, Time, Date | #FFFFFF |
| On Darker / Over Dark | Spotlight glyph, Wi-Fi and Control Center shapes | #FFFFFF@85% |

### Menu bar selection

| Background | `Selection` fill | Blur | Corners |
|---|---|---|---|
| On Lighter | #000000@8% (blend plus-darker) | blur background radius30 saturation1 | 13 |
| On Darker | #FFFFFF@20% (blend plus-lighter) | blur background radius30 saturation1.05 | 13 |

### Dock

| Part | Light | Dark |
|---|---|---|
| Dock background | style `Liquid Glass/Light/Dock` (+ corners 15) | style `Liquid Glass/Dark/Dock` |
| Separator line | #404040, blend plus-lighter | #404040, blend plus-lighter |
| Running-app dot | #707070 (blend plus-lighter) | same (one `Dock/Icon` master) |
| Icons | `App Icons/<App>/Default` | `App Icons/<App>/Dark` |

## Text

| Part | Font | Size | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| Menu titles | SFPro-Semibold | 13 | — | — | left |
| App Name | SFPro-Heavy | 13 | — | −0.2 | left |
| Apple Logo 􀣺 | SFPro-Regular | 16.3 | 20 | — | center |
| Time, Date | SFPro-Semibold | 13.1 | — | −0.18 | right |
| Spotlight 􀊫 | SFPro-Semibold | 13 | — | — | left |

No layer is bound to a shared text style.

## Effects

**Menu bar items**: only the `Selection` background blurs listed above. The bar itself has no material.

**Dock — Light (`Liquid Glass/Light/Dock`)**

- fill #4D4D4D@30% (blend luminosity) + #1A1A1A@10% (blend plus-darker) + #FFFFFF@8% (blend lighten)
- shadow x0 y0 blur0 spread0.5 #000000@25% (blend plus-darker)
- inner-shadow x0 y-12 blur12 spread-12 #161616@70% (blend plus-lighter)
- inner-shadow x1 y16 blur16 spread-16 #161616 (blend plus-lighter)
- inner-shadow x0 y-1 blur0.5 spread-0.5 #FFFFFF (blend overlay)
- inner-shadow x0 y1 blur0.5 spread-0.5 #FFFFFF (blend overlay)
- inner-shadow x0 y-1 blur0.5 spread-0.5 #FFFFFF@10% (blend plus-lighter)
- inner-shadow x0 y1 blur0.5 spread-0.5 #FFFFFF@10% (blend plus-lighter)
- blur glass radius1 saturation1 brightness1 distortion0.08 depth0.9 chromatic0
- corners 15 smoothing0.6 style1 (set on the Dock; the style itself has none)

**Dock — Dark (`Liquid Glass/Dark/Dock`)**: the same list, except the first fill is #454545@50% (blend luminosity); corners 15 comes from the style.

**Open menu in the examples**: `Liquid Glass/Light/Menus` (fill #E6E6E6@55% luminosity, blur glass radius20 saturation0.8) and `Liquid Glass/Dark/Menus` (fill #5A5A5A@50% luminosity, blur glass radius20 saturation1.2); full lists in `materials.md`.

## Finding it in the spec

| Family | grep |
|---|---|
| Menu bar items | `grep -n '^COMPONENT "Menu Bar/Item/' specs/menu-bar-and-dock.txt` |
| Menu bars | `grep -n '^COMPONENT "Menu Bar/Over' specs/menu-bar-and-dock.txt` |
| Docks | `grep -n '^COMPONENT "Dock/' specs/menu-bar-and-dock.txt` |
| App icons | `grep -n '^COMPONENT "App Icons/' specs/menu-bar-and-dock.txt` |
| Examples | `grep -n '^COMPONENT ".*/Examples/' specs/menu-bar-and-dock.txt` |
