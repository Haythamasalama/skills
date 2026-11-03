# Activity Views — iOS 27

**Read when:** you need an exact iOS 27 value for activity Views (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Activity Views in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/activity-views.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

38 components. Everything except the four cards is a building block (`Activity View/􀻃/…`, U+100EC3). The page has no documentation boards; its header describes an activity view as what is often called a share sheet.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Cards (full share sheet on a screen) | `Activity View/<Appearance>/Card - <Height>` | Appearance: Light, Dark · Height: Full Height, Half Height | 4 |
| Contents (the sheet's scrolling body) | `Activity View/􀻃/<Appearance>/Contents` | Light, Dark | 2 |
| Headers | `Activity View/􀻃/<Appearance>/Headers/<Type>` | Type: Title + Subtitle, Title + Subtitle + Drill-in Button, Title + Subtitle + Drill-in Shaped Button, Title + Pop Up Button, Title + Pop Up Button + Drill-in Button, SharePlay | 12 |
| Buttons | `Activity View/􀻃/<Appearance>/Buttons/<Button>` | Button: Options, Send Copy, Collaborate, SharePlay Button | 8 |
| Share targets and rows | `Activity View/􀻃/<Appearance>/<Part>` | Part: App, Person, List/List Row | 6 |
| Thumbnails | `Activity View/􀻃/Thumbnails/<Size>` | 64pt, 90pt | 2 |
| Person photos | `Activity View/􀻃/Person - Photo - <Kind>` | Single, Double | 2 |
| Other blocks | `Activity View/􀻃/Notification Badge`, `Activity View/􀻃/Options` | — (neither is used by another component on this page) | 2 |

## Anatomy

### Cards (402 × 874)

| Layer | Full Height | Half Height |
|---|---|---|
| root | fill #FFFFFF@70% (Light) / #000000@70% (Dark) | same |
| `use "Overlay"` | 402 × 874 @0,0 → `Sheets/􀻃/Overlay/<Appearance>` | same |
| `group "Stack"` (the sheet) | 402 × 812 @0,72, `corners 38/38/0/0 smoothing0.6 style1`, `stack v gap0` | 402 × 501 @0,373, same corners |
| `use "Activity View"` | → `Activity View/􀻃/<Appearance>/Contents` (402 × 812 Light, 402 × 1063 Dark) | → Contents with the header swapped to `Headers/Title + Pop Up Button + Drill-in Button` (402 × 812 Light, 402 × 1087 Dark) |

Derived: both sheets reach the bottom edge (72 + 812 = 874; 373 + 501 = 874). The sheet has rounded top corners only and clips the taller contents.

### Contents (402 × 1063)

`stack v gap0`, top to bottom:

| Layer | Size @position | Content |
|---|---|---|
| `use "Header"` | 402 × 132 @0,0 | → `Headers/Title + Subtitle` |
| `group "Recent Contacts"` | 402 × 133 @0,132 | `stack h gap14 pad16,0,16,24`; five `Person` instances 78 × 101 at x 24, 116, 208, 300, 392 (y 16) |
| `group "Recent Apps"` | 402 × 122 @0,265 | `stack h gap14 pad16,0,16,24`; five `App` instances 78 × 90 at x 24 … 392 ("Airdrop", "Messages", "Mail", "Notes", "Reminders") |
| `group "Actions"` (circles) | 402 × 126 @0,387 | `stack h gap14 pad16,0,24,24`; four action stacks 78 × 86 at x 24, 116, 208, 300 ("Copy", "Annotate", "Archive", "Lock") |
| `group "Actions"` (list) | 402 × 456 @0,513 | `stack v gap20 pad0,16,0,16`; three sections (below) |
| `group "Stack"` | 134 × 94 @134,969 | `pad24,0,24,0`; `use "Edit Actions..."` 134 × 46 @0,24 → `Buttons/<Appearance>/Large/Glass/Default` [text="Edit Actions"] |

Derived: rows step 92 (78 + 14); the fifth contact and app start at 392, so they run past the 402 pt width (392 + 78 = 470): the row scrolls sideways. Row heights: 16 + 101 + 16 = 133; 16 + 90 + 16 = 122; 16 + 86 + 24 = 126. The Edit Actions button is centred ((402 − 134) / 2 = 134) and the contents end at 969 + 94 = 1063.

Action circle stack (78 × 86, `stack v gap7`): `group "Stack"` 66 × 66 @6,0 (`corners 100`) holding a 66 × 66 glyph text layer; label text 78 × 13 @0,73. Derived: 66 + 7 + 13 = 86. Glyphs: 􀉁 U+100241 (Copy), 􀦇 U+100987 (Annotate), 􀈭 U+10022D (Archive), 􀎠 U+1003A0 (Lock).

Action list sections (370 wide, `corners 26 smoothing0.6 style1`, `stack v gap0`), each row an instance of `List/List Row` 370 × 52:

| Section | Size @position | Rows (glyph override) |
|---|---|---|
| 1 | 370 × 52 @16,0 | Copy (􀉁) |
| 2 | 370 × 260 @16,72 | Add to Reading List (􀖆 U+100586), Add Bookmark (􀉚 U+10025A), Add to Favorites (􀋂 U+1002C2), Find on Page (􀊫 U+1002AB), Add to Home Screen (􀑍 U+10044D) |
| 3 | 370 × 104 @16,352 | Markup (􀉥 U+100265), Print in Light / More in Dark (􀎚 U+10039A) |

Derived: 52 + 20 = 72; 72 + 260 + 20 = 352; 352 + 104 = 456.

### List Row (158 × 52 master; 370 wide in use)

| Layer | Size @position | Content |
|---|---|---|
| root | 158 × 52 | `stack h gap8 pad0,16,0,16` (root fill is the kit's `x. Kit/Nested Symbol BG` swatch + 70% white or black) |
| `group "Stack"` | 32 × 22 @16,15 | `text "Symbol"` 48 × 22 @-8,0 "􀋂", centred |
| `group "Stack"` | 86 × 52 @56,0 | `fill #FFFFFF (blend multiply)`, a 0.5 pt separator shadow (see Effects); `text "Label"` 86 × 22 @0,15 |

Derived: 16 + 32 + 8 = 56 (label x); (52 − 22) / 2 = 15.

### Headers (402 wide)

All six share the root: fill #FFFFFF, `border 0.5 inside` separator colour, `corners 0`, `stack h gap14 pad16,16,32,16`; a thumbnail stack at @16,16 (`pad14,0,0,3`, thumbnail @3,14); a text stack; and `use "Close Button"` 44 × 44 → `Toolbars/<Appearance>/Buttons/44pt/Active/Symbol 1` [text="􀅾" U+10017E] at x 342 (343 in the 403-wide masters).

| Header | Height | Thumbnail stack → thumbnail | Text stack @x | Text stack contents |
|---|---|---|---|---|
| Title + Subtitle | 132 | 75 × 84 → `Thumbnails/64pt` drawn 72 × 70 | 223 × 84 @105 (`pad12,0,0,0`) | Title 223 × 20 @0,12; Subtitle 223 × 16 @0,32 |
| Title + Subtitle + Drill-in Button | 128 | 67 × 78 → 64 × 64 | 232 × 80 @97 (Light 289 × 80), `gap14 pad12,0,0,0` | Title/Subtitle stack 255 × 36 @0,12; `group "Drill In Button"` 141 × 18 @0,62 (`stack h gap6 pad0,4,0,0`): "Location Included" 122 × 18, 􀆊 (U+10018A) 9 × 18 @128 |
| Title + Subtitle + Drill-in Shaped Button | 140 | 75 × 84 → 72 × 70 | 223 × 92 @105, `gap8 pad12,0,0,0` | Title/Subtitle stack 223 × 36 @0,12; `use "Custom Button"` 93 × 36 @0,56 → `Buttons/Options` |
| Title + Pop Up Button | 130 | 67 × 78 → 64 × 64 | 231 × 82 @97, `gap14 pad12,0,0,0` | Title 231 × 20 @0,12; `use "Pop Up Button"` 190 × 36 @0,46 → `Buttons/Send Copy` |
| Title + Pop Up Button + Drill-in Button | 156 | 67 × 78 → 64 × 64 | 289 × 108 @97, `gap14` | inner stack 289 × 76 (`gap14`): `group "Title and Menu"` 231 × 76 (`gap10 pad12,0,0,0`: Title @0,12, Pop Up Button 190 × 34 @0,42 → `Buttons/Collaborate`) and the Close Button @245,0; then Drill In Button 214 × 18 @0,90 "Everyone can make changes" |
| SharePlay | 152 | 93 × 104 → `Thumbnails/90pt` 90 × 90 | 205 × 64 @123, `pad12,0,0,0` | Title 205 × 20 @0,12; Subtitle 205 × 32 @0,32 (two lines); `use "SharePlay Button"` 131.76 × 36 @253.95,101 (in the header, not the text stack) |

Derived: text x = 16 + thumbnail stack width + 14 (16 + 67 + 14 = 97; 16 + 75 + 14 = 105; 16 + 93 + 14 = 123); Close Button 342 + 44 + 16 = 402; height = 16 + tallest child + 32 (16 + 84 + 32 = 132, 16 + 80 + 32 = 128, 16 + 92 + 32 = 140, 16 + 82 + 32 = 130, 16 + 108 + 32 = 156, 16 + 104 + 32 = 152). Inside text stacks: 12 + 20 = 32 (subtitle y); 12 + 36 + 14 = 62; 12 + 36 + 8 = 56; 12 + 20 + 14 = 46; 76 + 14 = 90.

### Buttons

| Button | Size | Root | Children |
|---|---|---|---|
| `Options` | 93 × 36 | `style="Liquid Glass/<App>/Regular - Small"`, `corners max`, `stack h gap8 pad8,11,8,11` | `text "Permission Text"` 54 × 18 @11,9 "Options"; `text "􀆊"` 9 × 18 @73,9 |
| `Send Copy` | 190 × 36 | same | `text "Label"` 147 × 18 @11,9 "􀈸 Send Copy" (U+100238); `text "􀆏"` (U+10018F) 13 × 18 @166,9 |
| `Collaborate` | 190 × 36 | same | `text "Label"` 147 × 18 @11,9 "􀉬 Collaborate" (U+10026C); `text "􀆏"` 13 × 18 @166,9 |
| `SharePlay Button` | 131.76 × 36 | `corners max`, `stack h gap5 pad7,13,7,13` | `group "Tint Color"` 132.76 × 37 @-0.5,-0.5; `group "Tinted Glass"` 131.76 × 36 @0,0 (`style="Liquid Glass/<App>/Regular - Small - Tinted"`); `group "Symbol"` 24.76 × 14.18 @13,10.91 (vector glyph); `text "Label"` 76 × 20 @42.76,8 "SharePlay" |

Derived: Options 11 + 54 + 8 = 73, 73 + 9 + 11 = 93; Send Copy 11 + 147 + 8 = 166, 166 + 13 + 11 = 190; SharePlay 13 + 24.76 + 5 = 42.76; height 8 + 18 + 8 = 36 (SharePlay 7 + 20 + 7 = 34 inside a 36 frame, as stored).

### Share targets

| Block | Light | Dark |
|---|---|---|
| `App` | 78 × 90: `use "App Icon"` 66 × 66 @6,0 → `App Icons/Artwork/Default/Messages`; `text "Label"` 78 × 13 @0,77 | 78 × 82: same icon; label @0,67 |
| `Person` | 78 × 101: `use "Image Type"` 70 × 70 @4,0 → `Person - Photo - Single`; `use "App Icon"` 20 × 20 @54,50 → `App Icons/Artwork/Default/Messages`; two-line label 78 × 26 @0,75 | 78 × 93: same photo; app badge drawn as a masked bitmap group 20 × 20 @53.24,44; label @0,67 |

Both Contents components (Light and Dark) use the Light `App` and `Person` blocks; the Dark ones are not used. Instances override the app icon (`App Icons/Artwork/<Default|Dark>/…`) and the name.

| Block | Size | Content |
|---|---|---|
| `Person - Photo - Single` | 70 × 70 | bitmap fill + #FFFFFF@70%, `corners 100` |
| `Person - Photo - Double` | 70 × 70 | fill #FFFFFF@70% + #787880@16% {Fills/Light/2 Secondary}, `corners 35`; two bitmap frames 37 × 37 @9,9 and 22 × 22 @39,39 (`corners 21`) |
| `Thumbnails/64pt` | 64 × 64 | fill #808080 + bitmap, `corners 16`, two shadows |
| `Thumbnails/90pt` | 90 × 90 | same fills, corners and shadows |
| `Notification Badge` | 40 × 24 | fill #FF383C {System Colors/Light/1 Red}, `corners 100`, `stack h gap0 pad2.5,6,2.5,6`; `text "Count"` 28 × 19 @6,2.5 "247" |
| `Options` | 62 × 18 | fill #CCE6FF + #FFFFFF@70%, `stack h gap4`; "Options" 48 × 18 and 􀆊 10 × 18 @52 |

`App 1` ("Airdrop") in Contents sets a text override "2" whose target layer is not in the dump.

## Sizes

| Part | Size | Corner | Padding / gaps |
|---|---|---|---|
| Sheet, Full Height | 402 × 812 @y72 | 38/38/0/0 | — |
| Sheet, Half Height | 402 × 501 @y373 | 38/38/0/0 | — |
| Header | 402 × 128–156 | 0 | 16,16,32,16; gap 14 |
| Header thumbnail | 64 × 64 (72 × 70 in two headers), 90 × 90 (SharePlay) | 16 | 14 top and 3 left inside its stack |
| Close button | 44 × 44 | — | 16 from the right |
| Header pop-up button | 190 × 36 (34 in the drill-in variant) | max | 8,11,8,11; gap 8 |
| Options button | 93 × 36 | max | 8,11,8,11; gap 8 |
| SharePlay button | 131.76 × 36 | max | 7,13,7,13; gap 5 |
| Contact / app tile | 78 × 101 / 78 × 90 | photo 100, app icon 66 × 66 | 14 between tiles, 24 leading inset, 16 top and bottom |
| Action circle | 66 × 66 in a 78 × 86 stack | 100 | label 7 below |
| Action list section | 370 wide, rows 52 | 26 | 16 sides; 20 between sections |
| List row | 52 tall | — | 0,16,0,16; gap 8; symbol box 32 × 22 |
| Edit Actions button | 134 × 46 | (Large glass button) | 24 above and below |
| Notification badge | 40 × 24 | 100 | 2.5,6,2.5,6 |

## Colours and states

| Part | Light | Dark |
|---|---|---|
| Card screen fill | #FFFFFF@70% | #000000@70% |
| Overlay | `Sheets/􀻃/Overlay/Light` (#000000@20%) | `Sheets/􀻃/Overlay/Dark` (#000000@48%) |
| Sheet, Full Height | #F2F2F7 {Backgrounds Grouped/Light/Primary} | #1C1C1E {Backgrounds Grouped/Dark - Elevated/Primary} |
| Sheet, Half Height | #FFFFFF (no swatch) | #1C1C1E (no swatch) |
| Header root fill | #FFFFFF | #FFFFFF (as stored) |
| Header border | 0.5 inside #000000@12% {Separators/Light/Non-Opaque} | 0.5 inside #FFFFFF@12% {Separators/Dark/Non-Opaque} |
| Header title | #000000 (no swatch) | #FFFFFF (no swatch) |
| Header subtitle | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, `blend plus-darker` | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `blend plus-lighter` |
| Drill-in text | #999999 {Labels/Light - Vibrant/2 Secondary}, `plus-darker` | #999999 {Labels/Dark - Vibrant/2 Secondary}, `plus-lighter` |
| Drill-in 􀆊 | #BFBFBF (bound to Labels/Light - Vibrant/3 Tertiary in one header, unbound in the other), `plus-darker` | #404040, `plus-lighter` |
| Options / pop-up button label | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| Options / pop-up chevron (􀆊, 􀆏) | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-darker` (Light uses the Dark swatch, as stored) | #404040 {Labels/Dark - Vibrant/3 Tertiary}, `plus-lighter` |
| Options / pop-up button surface | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Dark/Regular - Small` |
| SharePlay tint | #FFFFFF@96% + #34C759 {System Colors/Light/4 Green} (blend plus-darker) | same (Light green swatch) |
| SharePlay glass | `Liquid Glass/Light/Regular - Small - Tinted` | `Liquid Glass/Dark/Regular - Small - Tinted` |
| SharePlay label | #FFFFFF {Labels/Dark - Vibrant/1 Primary} | #FFFFFF {Labels/Dark - Vibrant/1 Primary} |
| Action circle and list section fill | #EDEDED {Fills/Light - Vibrant/3 Tertiary}, `blend plus-darker` | #121212 {Fills/Dark - Vibrant/3 Tertiary}, `blend plus-lighter` |
| Action circle glyph and label | #000000 {Labels/Light - Vibrant/1 Primary}, `plus-darker` | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, `plus-lighter` |
| List row label and symbol | #000000 (no swatch) | #FFFFFF (no swatch) |
| App / person label (Light blocks, used in both) | #000000 | #000000 (Dark Contents uses the Light block) |
| Thumbnail placeholder | #808080 under the image | same |
| Notification badge | #FF383C {System Colors/Light/1 Red}, text #FFFFFF | (no Dark variant) |

The kit has no pressed, selected or disabled states for any part of the activity view.

## Text

| Part | Font | Size | Line height | Align |
|---|---|---|---|---|
| Header title | SFPro-Semibold | 15 | 20 | left |
| Header subtitle | SFPro-Regular | 13 | 16 | left |
| Drill-in text | SFPro-Regular | 15 | 18 | left |
| Drill-in and Options 􀆊, pop-up 􀆏 | SFPro-Semibold | 15 | 20 | right (Dark) / left (Light) |
| Options and pop-up button label | SFPro-Regular | 15 | 18 | left |
| SharePlay label | SFPro-Regular | 17 | 20 | centre |
| Contact and app name | SFPro-Regular | 11 | 13 | centre |
| Action circle label | SFPro-Regular | 11 | Not in the kit | centre |
| Action circle glyph | SFPro-Regular | 25 | Not in the kit | centre |
| List row label and symbol | SFPro-Regular | 17 | 22 | left / centre |
| Notification badge count | SFPro-Regular | 16 | Not in the kit | centre |
| `Options` block | SFPro-Regular | 13 | 18 | left |

No text layer on this page binds a shared text style. Placeholder text: "Title", "Subtitle", "Subtitle Line 1⏎Subtitle Line 2", "Location Included", "Everyone can make changes", "Label Line 1⏎Label Line 2".

## Effects

| Part | Effect |
|---|---|
| Thumbnails | `shadow x0 y0 blur2 spread0 #000000@10%` + `shadow x0 y1 blur8 spread0 #000000@12%`, `corners 16` |
| Recent Contacts and Recent Apps rows | fill #FFFFFF@0% (blend multiply); Dark `shadow x0 y0.5 blur0 spread0 #FFFFFF@12% {Separators/Dark/Non-Opaque}`; Light `inner-shadow x0 y0.5 blur0 spread0 #000000@12% {Separators/Light/Non-Opaque}` |
| Action circles row | Light only: fill #FFFFFF@0% (multiply) + the same Light inner shadow; Dark has none |
| List row label stack | fill #FFFFFF (blend multiply) + `shadow x0 y0.5 blur0 spread0` #FFFFFF@12% (Dark) / #000000@12% (Light), unbound |
| Header | `border 0.5 inside` separator colour |
| Options, Send Copy, Collaborate | `Liquid Glass/<App>/Regular - Small`, `corners max` |
| SharePlay Button | tint layer (#FFFFFF@96% + green, plus-darker) drawn 0.5 pt larger on every side, under `Liquid Glass/<App>/Regular - Small - Tinted` |
| Vibrant content | `plus-darker` in Light, `plus-lighter` in Dark |

The inline glass expansions match the tokens (checked by script on all 8 styled lines). Key values from `materials.md`:

| Style | Fill stack (bottom first) | Glass blur |
|---|---|---|
| Liquid Glass/Light/Regular - Small | #F8F8F8@20% (luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (plus-lighter) | radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0 |
| Liquid Glass/Dark/Regular - Small | #000000 (screen) + #999999@17% | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 |
| Liquid Glass/Light/Regular - Small - Tinted | #FFFFFF (multiply) | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 |
| Liquid Glass/Dark/Regular - Small - Tinted | #000000 (screen) | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 |

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Activity Views" and a description the dump cuts off after "An activity view — often called a share …". The full text is Not in the dump.

What the components show (summarised from their layout): the share sheet opens at half or full height over the dimmed screen; from the top it shows the item being shared with a close button, a scrolling row of people, a scrolling row of apps, a row of round quick actions, grouped lists of further actions, and an Edit Actions glass button. The header type changes with what is shared: plain title and subtitle, a permission drill-in, a Send Copy or Collaborate pop-up, or a SharePlay button.

## Finding it in the spec

| Family / part | grep |
|---|---|
| Cards | `grep -n '^COMPONENT "Activity View/[A-Za-z]*/Card' specs/activity-views.txt` |
| Contents | `grep -n '^COMPONENT "Activity View/􀻃/[A-Za-z]*/Contents' specs/activity-views.txt` |
| Headers | `grep -n '^COMPONENT "Activity View/􀻃/[A-Za-z]*/Headers/' specs/activity-views.txt` |
| Buttons | `grep -n '^COMPONENT "Activity View/􀻃/[A-Za-z]*/Buttons/' specs/activity-views.txt` |
| App, person, list row | `grep -nE '^COMPONENT "Activity View/􀻃/(Light\|Dark)/(App\|Person\|List)' specs/activity-views.txt` |
| Thumbnails, photos, badge | `grep -nE '^COMPONENT "Activity View/􀻃/(Thumbnails\|Person - Photo\|Notification\|Options)' specs/activity-views.txt` |
| Rows inside Contents | `grep -nE 'group "(Recent Contacts\|Recent Apps\|Actions)"' specs/activity-views.txt` |
| Close buttons | `grep -n 'use "Close Button"' specs/activity-views.txt` |
