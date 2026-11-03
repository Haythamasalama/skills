# System — iOS 27

**Read when:** you need an exact iOS 27 value for system (size, colour, text, effect) as Apple's kit draws it.
**Owns:** System in Apple's iOS 27 kit: components, anatomy.

Source: `specs/system.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The page holds the system surfaces an app sits in or next to: wallpapers, iPad windows and the iPad menu bar, status bars, home indicators, the Home Screen with its dock, widgets and Quick Actions menu, the Lock Screen with its widgets and notifications, Control Center, app icon artwork, the scroll edge effect and one tab bar helper. Colours in `{braces}` are swatches from `colors.md`; `style="…"` names are shared styles in `materials.md`.

Reading notes for this page:

- A component path segment `􀻃` (U+100EC3) marks the building-block components that the full screens are assembled from (for example `System/Home Screen/􀻃/Dock - iPhone/iPhone`).
- Many masters carry a placeholder background that is not part of the design: `#5856D6`, `#A9A9A9`, `fill #FFFFFF + #FFFFFF`, or a kit helper swatch named `x. Kit/Symbol BG Dark` (#333333@60%), `x. Kit/Symbol BG Light` (#CCCCCC@60%), `x. Kit/Nested Symbol BG Dark` (#0059B3@60%), `x. Kit/Nested Symbol BG Light` (#4DA6FF@60%, written #4CA6FF@60% on the tab bar helper). Widget masters use `#6155F5 {System Colors/Light/9 Indigo}` as a stand-in for widget content.
- A `fill` on a group (for example `group "Contents - Trailing" … fill #FFFFFF` over children drawn `#000000`) is stored on the group, not on the children. In Sketch a group fill tints its contents.
- Text layers can carry a second colour: the text colour comes first, then an optional layer `fill` and `blend`. Both are listed below where the kit stores both.

## Components

301 components in 15 families.

| Family | Variant axes (values) | Count |
|---|---|---|
| Wallpapers | Appearance (Dark, Light) × Device (iPad Pro M4 11, iPhone, iPhone - Blurred, iPhone Duo/Outer, iPhone Duo/Inner Portrait, iPhone Duo/Inner Landscape) | 12 |
| Examples | Windows; Menubar/Windowed; Menubar/Full Screen | 3 |
| Windows | Window Controls: Appearance (Dark, Light) × State (Inactive, Active) = 4; Resize: Appearance × (Floating, Full Screen) = 4; Window = 1 | 9 |
| Status Bars | iPad: Background (Dark Background, Light Background) × Mode (Full Screen, Windowed) × Menu (Menu Collapsed, Menu Expanded) = 8; `􀻃/iPad` accessories (Leading, Trailing) = 2; iPhone 17 Pro, iPhone 18 Pro, iPhone 18 Pro Max × Background (Dark, Light) = 6; iPhone Duo: Background × (Vertical, Horizontal) = 4 | 20 |
| Menu Bar (iPad) | Appearance (Dark, Light) × Item (Menu, App Menu) × State (Selected, Unselected) | 8 |
| Home Indicators | Landscape - Dark - iPad, Landscape - Light - iPad, Portrait - Dark - iPhone, Portrait - Light - iPhone | 4 |
| System/Home Screen | See below | 52 |
| System/Home Screen Quick Actions | Building blocks: Appearance (Dark, Light) × (Menu Item - Default, Menu Item - Destructive, Widgets, HSQA Menu - Widgets, HSQA Menu - No Widgets) = 10; screens: Appearance × (iPad, iPhone) = 4 | 14 |
| System/Notifications | Screens: Appearance (Dark, Light) × Device (iPad, iPhone) × (Expanded, Collapsed) = 8; Banners: Context (Over Light, Over Dark) × (1 Single, 2 Double, 3 Triple, 1 Single with Image) = 8 | 16 |
| System/Lock Screen Widgets | iPad widgets (iPad Clock Big, iPad Date) = 2; `􀻃/iPad - Lock Screen Date & Time Lockup` = 1; Control = 1; `Widgets/􀻃/iPhone` single widgets = 18; `Widgets/iPhone` rows = 8; Examples: Appearance × (iPad, iPhone) = 4 | 34 |
| System/Control Center | Controls: Device (iPad, iPhone) × Size (2x2, 2x1 - Menu, 2x1 - Toggle, 1x1) × State (Off, On) = 16; screens: Appearance × Device = 4; `􀻃/Overlay` = 1 | 21 |
| App Icons | Artwork: Appearance (Default, Dark) × 48 apps = 96; Home Screen icon frames = 6 (iPad, iPhone, iPhone Duo Inner Landscape / Inner Portrait / Outer Portrait, Home Screen Quick Action); `􀻃 - Badge/Badge` = 1 | 103 |
| iPhone Duo | Outer Display Lens | 1 |
| Scroll Edge Effect | Dark/Top - Hard, Light/Top - Hard, Top - Soft (no text) | 3 |
| Tab Bars | `􀻃/Light/iPhone/Horizontal/Tab - Default/Default` (one helper item) | 1 |

System/Home Screen (52):

| Group | Components | Count |
|---|---|---|
| `􀻃/Dock - iPad/iPad` | Two masters with the same name, one with `Liquid Glass/Dark/Dock`, one with `Liquid Glass/Light/Dock` | 2 |
| `Widgets/iPad` | Extra Large, Large, Medium, Small | 4 |
| `􀻃/Layouts - iPad` | Default, Widget - Small, Widget - Medium, Widget - Large, Widget - Extra Large | 5 |
| `Dark/iPad`, `Light/iPad` | Default + Custom Icon, Widgets - Small, Widgets - Medium, Widgets - Large, Widgets - Extra Large (each appearance) | 10 |
| `􀻃/Dock - iPhone/iPhone` | Two masters with the same name (Dark Dock glass, Light Dock glass) | 2 |
| `􀻃/Search Field` | Dark, Light | 2 |
| `􀻃/Layouts - iPhone` | Default, Default + Custom Icon, Widget - Small, Widget - Medium, Widget - Large, Widget - XL | 6 |
| `Dark/iPhone` | Default, Widgets - Small, Widgets - Medium, Widgets - Large, Widgets - XL | 5 |
| `Light/iPhone` | Default + Custom Icon, Widgets - Small, Widgets - Medium, Widgets - Large, Widgets - XL | 5 |
| `Dark/iPhone Duo`, `Light/iPhone Duo` | Outer Portrait, Inner Portrait, Inner Landscape (all "Default + Custom Icon") | 6 |
| `􀻃/Widget Layout Guide` | Padding Guide (18pt) | 1 |
| `Widgets/iPhone` | Small, Medium, Large, XL | 4 |

Device canvases used by the screens: iPad Pro M4 11 1210×834; iPhone 402×874; iPhone Duo Outer Portrait 466×678, Inner Portrait 669×951, Inner Landscape 951×669. The iPhone 18 Pro Max status bar is 440 wide; no 440-wide screen is in the kit.

## Anatomy

### Windows (iPad)

`Windows/Window` 400×400: fill #FFFFFF, shadow x0 y30 blur146 spread0 #000000@30%, corners 34 smoothing0.6. Child `use "Resize"` 32×32 @368,368 → `Windows/Light/Resize - Floating` (sits flush in the bottom-right corner; derived 368 = 400 − 32).

| Component | Size | Parts |
|---|---|---|
| Window Controls/Inactive (Dark) | 41×22, corners max, stack h gap3 | oval Close 5×5 @10,8.5; Minimize 5×5 @18,8.5; Expand 5×5 @26,8.5 |
| Window Controls/Inactive (Light) | 41×22, corners max, stack h gap5 | Close 5×5 @8,8.5; Minimize @18,8.5; Expand @28,8.5 |
| Window Controls/Active (Dark, Light) | 41×22, corners max, stack h gap4.5 | Close 6×6 @7,8; Minimize 6×6 @17.5,8; Expand 6×6 @28,8 |
| Resize - Floating | 32×32 | path "Grabber" 19.91×19.91 @5.42,5.42, border 3.5 center |
| Resize - Full Screen | 32×32 | path "Grabber" 12×12 @14,14, border 3.5 center |

`Examples/Windows` 1210×834 (fill #000000): wallpaper `Wallpapers/Light/iPad Pro M4 11`; "Inactive Window" 880×580 @60,60 and "Active Window" 880×580 @270,194, both fill #FFFFFF, shadow x0 y30 blur146 #000000@30%, corners 34; status bar `Status Bars/iPad/Dark Background/Windowed/Menu Collapsed` @0,0. Each window is a "Split View" (stack h gap0):

- "Sidebar" 320×834 @0,0, stack v gap0 pad10,16,10,16: BG → `Sidebar/􀻃/Light/BG/Active` (Inactive on the inactive window); Toolbar 288×54 @16,10 → `Sidebar/Light/Toolbar/Floating Window` (inactive one swaps in `Windows/Light/Window Controls/Inactive`); Search 288×64 @16,64 → `Sidebar/􀻃/Light/Search/Placeholder`; Source List Items 288×44 from y128 every 44 (derived from positions 128, 172, 216 …) → `Sidebar/Light/Items/Level 0` and `Level 1`; Source List Header 288×54 @16,304 → `Sidebar/Light/Header/Header`. These parts belong to the Sidebars page.
- "Content View" 560×834 @320,0, stack v gap0, pad 32,20,0,20 (active) or 72,20,0,20 (inactive): Navigation Bar 560×54 @0,10 → `Toolbars/Light/iPad/Top/Default Title`; on the active window a `Scroll Edge Effect - Toolbar` 560×64 @0,0 → `Scroll Edge Effect/Light/Top - Hard`; body text 520 wide @20,32 (active) / @20,72 (inactive), `06 Body/1 Default`.
- Active window only: Resize 32×32 @848,548 → `Windows/Light/Resize - Floating`.

`Examples/Menubar/Windowed`: wallpaper, menu bar `Status Bars/iPad/Dark Background/Windowed/Menu Collapsed` @0,0, `Windows/Window` 880×580 @165,127 (centred horizontally; derived (1210 − 880) / 2 = 165).
`Examples/Menubar/Full Screen`: fill #FFFFFF {Backgrounds/Light/Primary}, menu bar `Status Bars/iPad/Light Background/Full Screen/Menu Collapsed`, `Windows/Light/Resize - Full Screen` 32×32 @1178,802 (flush bottom-right; derived).

### Status bars — iPad

All 8 iPad status bars are 1210×32, stack h, pad 0,16,0,16 (grep-checked).

| Part | Size, position | Contents |
|---|---|---|
| Leading Accessories (`Status Bars/􀻃/iPad/Leading Accessories`) | 129×16 @16,8, stack h gap8 | group "Time" 53×16 @0,0 (gap2): text "Time" "9:41" 29×16 @0,0; text "AM/PM" "AM" 22×16 @31,0. Text "Date" "Wed Apr 1" 68×16 @61,0 |
| Menu Bar / Stack | 960.15×32 @145,0, stack h gap0 pad0,6,0,6 | App Menu instance 88×32 @6,0; menu items (expanded variants) |
| Trailing Accessories (`Status Bars/􀻃/iPad/Trailing Accessories`) | 88.85×16 @1105.15,8, stack h gap5 | shape "Wifi" 13.51×10 @0,3; text "100%" 38×16 @18.51,0 (right aligned); shape "Battery" 25×13 @61.51,1.5 |
| Window Controls (Full Screen / Menu Expanded only, replaces Leading Accessories) | 129×16 @16,8, stack h gap12 | Close 16×16 @57,0; Minimize 16×16 @85,0; Fullscreen 16×16 @113,0 (corners max). Close symbol 8×1.5 @4,7.25; Minimize symbol rect 6.5×1.5 @4.75,7.25 corners 1.5; Fullscreen symbol 8×8 @4,4 |

Derived: trailing inset 16 = 1210 − (1105.15 + 88.85); the menu bar starts at x145 = 16 + 129.

Menu item instance widths in the expanded bar (Mail example, line 97): App Menu "AppName" 88 @6; File 44 @94 (Selected); Edit 46 @138; View 53 @184; Mailbox 72 @237; Message 80 @309; Format 68 @389; Window 74 @457; Help 51 @531.

Which menu item appearance each bar uses:

| Status bar | Menu items |
|---|---|
| Dark Background / Windowed / Menu Expanded, Menu Collapsed | `Menu Bar (iPad)/Dark/…` |
| Dark Background / Full Screen / Menu Expanded, Menu Collapsed | `Menu Bar (iPad)/Light/…` |
| Light Background / all four | `Menu Bar (iPad)/Light/…` |

### Menu Bar (iPad) items

| Component | Size | Stack | Text layer |
|---|---|---|---|
| Menu (Selected, Unselected) | 57×32 | h gap0 pad0,10,0,10 | "Menu" 37×16 @10,8, centre |
| App Menu (Selected, Unselected) | 59×32 | h gap0 pad0,10,0,10 | "Menu" 39×16 @10,8, centre |

### Status bars — iPhone

All six are 402×62 or 440×62, stack h gap0 pad3,0,0,0. Three groups: "Contents - Leading" (time), "Stack" (Dynamic Island), "Contents - Trailing" (cellular, Wi-Fi, battery).

| Part | iPhone 17 Pro (402×62) | iPhone 18 Pro (402×62) | iPhone 18 Pro Max (440×62) |
|---|---|---|---|
| Contents - Leading | 138.5×22 @0,21.5, pad0,4,0,0 | 153.5×22 @0,21.5, pad0,0,0,10 | 172.5×22 @0,21.5, pad0,0,0,8 |
| Time text | 37×22 @48.75,0 | 37×22 @63.25,0 | 39×22 @70.75,0 |
| Island group "Stack" | 125×37 @138.5,14, pad0 | 95×59 @153.5,3, pad11,0,0,0 | 95×59 @172.5,3, pad11,0,0,0 |
| rect "Dynamic Island" | 125×37 @0,0, corners max | 95×36.67 @0,11, corners max (top at y14, derived 3 + 11) | 95×36.67 @0,11, corners max |
| Contents - Trailing | 138.5×15 @263.5,25, gap8, pad0,0,0,2 | 153.5×15 @248.5,25, gap8, pad0,10,0,0 | 172.5×16.33 @267.5,24.33, gap8, pad0,4,0,0 |
| Cellular group | 20.32×15 @27.76,0 | 20.32×15 @29.26,0 | 20.32×16.33 @39.76,0 |
| Cellular bars (3.33 wide, corners 4, stack h gap2.33 pad1.33,0,0,0) | 6.33 @0,8.67; 8.67 @5.66,6.33; 11 @11.33,4; 13.67 @16.99,1.33 | same as 17 Pro | 7 @0,9.33; 9.67 @5.66,6.67; 12.33 @11.33,4; 15 @16.99,1.33 |
| Wifi shape | 19.33×14.33 @56.08,0.33 | 19.33×14.33 @57.58,0.33 | 20.67×15.33 @68.08,0.5 |
| Battery group (stack h gap1) | 29.33×13.67 @83.41,0.67: Body 26.33×13.67, Contact 2×5 @27.33,4.33 | 29.33×13.67 @84.91,0.67 (same parts) | 32×15 @96.74,0.67: Body 29×15, Contact 2×5 @30,5 |
| Battery right edge (derived, screen x) | 376.24 (inset 25.76) | 362.74 (inset 39.26) | 396.24 (inset 43.76) |
| Cellular / Wi-Fi / battery screen x (derived, trailing x + child x) | 291.26 / 319.58 / 346.91 | 277.76 / 306.08 / 333.41 | 307.26 / 335.58 / 364.24 |

The Lock Screen examples (iPhone) draw their status bar inline, as a group with the iPhone 17 Pro geometry (lines 1949–1961, 1971–1983), while every other iPhone screen uses an instance of `Status Bars/iPhone 18 Pro/Dark Background`.

### Status bars — iPhone Duo

| Component | Size | Stack | Parts |
|---|---|---|---|
| Vertical (Dark, Light) | 48×83 | v gap6 pad11,0,1,0 | text "Time" "9:41" 48×19 @0,11; group "Ring" 46×46 @1,36 with path "Battery" 41×31.67 @2.5,2.33, shape "Wifi" 18×13.33 @14,16, shape "Cell" 23.04×6.42 @11.48,36.45; group "Blur" 54×86 @-3,0 |
| Horizontal (Dark, Light) | 98×48 | h gap3 pad1,1,1,2 | "Time" 46×19 @2,14.5; "Ring" 46×46 @51,1 (Battery 41×31.67 @2.5,2.33, Wifi 16.71×12.35 @14.65,16, Cell 23.04×6.42 @11.29,37); "Blur" 96×55 @6,-4 |

On the Duo Home Screens the vertical status bar sits in a "Vertical Bar" column 84 wide on the trailing edge (see Home Screen). `iPhone Duo/Outer Display Lens` 95.67×95.67: oval "Lens" 37×37 @29.33,29.33 fill #080808. The outer screen also has group "Camera Punchout" 48×42 @12,24 inside the vertical bar (no fill in the dump).

### Home indicators

| Component | Size | Bar |
|---|---|---|
| Landscape - Dark - iPad / Landscape - Light - iPad | 314×20 | rect 314×5 @0,7, corners 100 |
| Portrait - Dark - iPhone / Portrait - Light - iPhone | 144×20 | rect 144×5 @0,7, corners 100 |

Placement: iPad screens put it at @448,814 (centred and flush to the bottom; derived (1210 − 314) / 2 = 448, 814 + 20 = 834). iPhone Lock Screen examples use an instance stretched to 402×34 @0,840.

### Scroll edge effect

| Component | Size | Layers |
|---|---|---|
| Dark/Top - Hard | 100×112, border 0.67 inside #FFFFFF@10% | rect "Color" 100×112; rect "Blur" 100×112 |
| Light/Top - Hard | 100×112 | rect "Color"; rect "Blur" |
| Top - Soft (no text) | 200×77 | rect "Gradient Mask" 200×77 (mask); rect "Blur" 200×77 |

Two example groups 130×280 (Light and Dark) put Top - Soft (130×77) over a 110×280 text column @10,0.

### Tab bar helper

`Tab Bars/􀻃/Light/iPhone/Horizontal/Tab - Default/Default` 72×54: text "Symbol" "􀟉" (U+1007C9) 54×28 @9,7; text "Label" 54×12 @9,36. The full tab bar family is on the Tab Bars page.

## More on this page

- Wallpapers, Home Screen, widgets, Quick Actions, Lock Screen, notifications, Control Center, app icons: `system-screens.md`.
- Sizes and colours for every part: `system-values.md`.
- Text, effects, kit notes and grep patterns: `system-text-and-effects.md`.
