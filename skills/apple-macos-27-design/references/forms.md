# Forms — macOS 27

**Read when:** you need an exact macOS 27 value for forms (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Forms in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/forms.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

The page has 13 components in two families:

| Family | Name path | Count |
|---|---|---|
| Example forms | `Forms/Example Forms/<Appearance>` (Light, Dark) | 2 |
| Leading-accessory building blocks | `Forms/􀻃 Rows - Leading/<group>/…` | 11 |

The building-block names start with the glyph 􀻃 (U+100EC3).

| Building block | Variants |
|---|---|
| `<Appearance>/Disclosure/<state>` | Light, Dark × Expanded, Collapsed (4) |
| `Icon Background/Gray` | 1 |
| `Sidebar Icon/<kind>` | Memoji, Image Icon Round, Image Icon, Image Icon Rounded Corner, Service Icon 32pt, Service Icon 24pt (6) |

- The page has no standalone row component. Rows exist only as groups inside the two example forms.
- The examples use these building blocks: Disclosure/Collapsed, Service Icon 24pt, Service Icon 32pt and Image Icon Rounded Corner.
- No example uses Disclosure/Expanded, Memoji, Image Icon Round or Image Icon.

## Anatomy

### Example form (`Forms/Example Forms/<Appearance>`)

| Layer | Kind | W × H @ | What it is |
|---|---|---|---|
| (component) | — | 1440 × 900 | Fill: linear gradient #CBABE2 0% → #9DC6EA 100%, the same in Light and Dark |
| `Wallpaper` | `use` → `Wallpaper/Light` or `Wallpaper/Dark` | 1512 × 982 @0,0 | Desktop picture |
| `Window` (leading-accessory examples) | group, `stack v gap0 pad20,20,20,20` | 500 × 682 @160,110 | Window holding the form |
| `Window` (trailing-accessory examples) | group, `stack v gap0 pad20,20,20,20` | 500 × 664 @780,110 | Window holding the form |
| `Form` | group in each Window, `stack v gap0 pad0,10,0,10` | 460 × 642 / 460 × 624 @20,20 | The grouped form background |
| `Row` | group in Form, `stack h gap2 pad12,0,12,0` | 440 × (40–116) @10,y | One form row |
| `Leading` | group in Row, `stack h` | @0,12 | Title side |
| `Trailing` | group in Row, `stack h` | right-aligned @(440 − width),12 | Control side |

- The Dark example also has two headings over the windows; see Kit notes.
- In the leading-accessory window every `Trailing` group is an empty 30 × 16 group.

### Rows in the trailing-accessory window (top to bottom)

| y | Height | Leading title | Trailing content (stack gap) |
|---|---|---|---|
| 0 | 40 | "Label" | text "Label" (Secondary) |
| 40 | 40 | group `Text` (`stack v gap2`) with text "Info" | text "􀅴" (U+100174), 20 × 16 |
| 80 | 48 | "Popup" | gap 6: text "Label" 34 × 16 @0,4 + `Arrow Button` 24 × 24 @40,0 → `Arrow Buttons/<A>/Content Area/3 Rg/1 - Idle` |
| 128 | 40 | "Toggle" | `Toggle` 36 × 16 → `Toggles - Switches/<A>/Content Area/1 Mn/Active, On, 1 - Idle` |
| 168 | 40 | "Info Button + Toggle" | gap 10: "􀅴" 20 × 16 @0,0 + `Toggle` 36 × 16 @30,0 → `…/1 Mn/Active, Off, 1 - Idle` |
| 208 | 40 | "Label + Info Button" | gap 10: text "Label" 34 × 16 @0,0 + "􀅴" 20 × 16 @44,0 |
| 248 | 48 | "Stepper" | `Stepper` 84 × 24 → `Steppers/<A>/Content Area/Inside Field/3 Rg` [text "3.00"] |
| 296 | 48 | "Stepper + Label" | gap 10: `Stepper` 84 × 24 @0,0 + text "seconds" 53 × 16 @94,4 |
| 344 | 48 | "Text Field" | `Textfield` 120 × 24 → `Text Fields/<A>/3 Rg/Value` |
| 392 | 48 | "Radio buttons" | gap 16: `Radio Button` 71 × 24 @0,0 → `Toggles - Radio Buttons/<A>/Content Area/3 Rg/Active, Checked - 1 - Idle` [text "Option 1"] + `Radio Button` 73 × 24 @87,0 → `…/Active, Unchecked - 1 - Idle` [text "Option 2"] |
| 440 | 40 | "More button" | text "􀍠" (U+100360), 18 × 16 |
| 480 | 48 | "Combo Box" | `Combo Box` 120 × 24 → `Combo Boxes/<A>/3 Rg/1 - Idle` |
| 528 | 48 | "Menu + Button" | gap 10: group `Stack` 97 × 24 (gap 4: text "Full Screen" 69 × 16 @0,4 + `Arrow Button` 24 × 24 @73,0) + `Push Button` 127 × 24 @107,0 → `Buttons/<A>/Content Area/Bordered/3 Rg/Active, Off, 1 Idle` [text "Choose Display..."] |
| 576 | 48 | "Button" | `Push Button` 93 × 24 → same button [text "Advanced..."] |

### Rows in the leading-accessory window (top to bottom)

| y | Height | Leading content (stack gap) |
|---|---|---|
| 0 | 40 | text "Title only" |
| 40 | 40 | group `Text` (`stack v gap2`) with text "Subtitle only" 68 × 14 |
| 80 | 54 | group `Text` 42 × 30 (`stack v gap2`): two "Subtitle" texts @0,0 and @0,16 |
| 134 | 56 | group `Text` 42 × 32 (`stack v gap2`): "Title" @0,0 + "Subtitle" @0,18 |
| 190 | 40 | gap 10: text "􀓔" (U+1004D4) 20 × 16 @0,0 + "Title + Symbol" @30,0 |
| 230 | 56 | gap 8: `Symbol` 32 × 32 @0,0 → `Sidebar Icon/Image Icon Rounded Corner` + "Title + Image" @40,0 |
| 286 | 56 | gap 8: `Symbol` 32 × 32 @0,0 → `Sidebar Icon/Service Icon 32pt` + "Title + Large icon" @40,0 |
| 342 | 48 | gap 8: `Symbol` 24 × 24 @0,0 → `Sidebar Icon/Service Icon 24pt` + "Title + Icon" @32,0 |
| 390 | 40 | gap 0: `Disclosure` 18 × 16 @0,0 → `<A>/Disclosure/Collapsed` + "Disclosure" @18,0 |
| 430 | 56 | gap 0: `Disclosure` 18 × 16 @0,0 + group `Stack` 172 × 32 @18,0 (`stack v gap2`: title @0,0 + "Subtitle" @0,18) |
| 486 | 40 | text "Radio button group" |
| 526 | 116 | group `Stack` 410 × 92 (`stack v gap2`): title @0,0 + "Subtitle" 42 × 14 @0,18 + group `Radio button group` 266 × 58 @0,34 (`stack v gap2 pad4,0,4,0`) with two radio buttons: Checked 244 × 24 @0,4 and Unchecked 266 × 24 @0,30, both → `Toggles - Radio Buttons/<A>/Content Area/3 Rg/…` with long sample labels |

### Building blocks

| Master | W × H | Layers and paint |
|---|---|---|
| `<A>/Disclosure/Expanded` | 18 × 16 | master fill #FFFFFF; text `Chevron` 12 × 16 @0,0, "􀆈" (U+100188) |
| `<A>/Disclosure/Collapsed` | 18 × 16 | master fill #FFFFFF; text `Chevron` 8 × 16 @0,0, "􀆊" (U+10018A) |
| `Icon Background/Gray` | 40 × 40 | fill linear gradient top → bottom, #BFBFBF 0% → #919191 100%; corners 0 |
| `Sidebar Icon/Memoji` | 40 × 40 | fill #FFF0B2 + image; corners 20 |
| `Sidebar Icon/Image Icon Round` | 40 × 40 | fill image; corners max |
| `Sidebar Icon/Image Icon` | 40 × 40 | fill image; corners 0 |
| `Sidebar Icon/Image Icon Rounded Corner` | 40 × 40 | fill image; border 0.5 inside #000000@10%; corners 9, smoothing 0.6; blend plus-darker |
| `Sidebar Icon/Service Icon 32pt` | 32 × 32 | fill #FFFFFF; corners 7.2, smoothing 0.6. `Background` 32 × 32 → `Icon Background/Gray`; text `Symbol` 32 × 32 @0,0, "􀓔" (U+1004D4) |
| `Sidebar Icon/Service Icon 24pt` | 24 × 24 | fill #FFFFFF; corners 5.4, smoothing 0.6. `Background` 24 × 24 → `Icon Background/Gray`; text `Symbol` 24 × 24 @0,−0.5, "􀓔" |

## Sizes

| Part | Value |
|---|---|
| Example frame | 1440 × 900 |
| Window | 500 wide; padding 20 on every side; corners 26, smoothing 0.6 |
| Form | 460 wide; side padding 10 (`pad0,10,0,10`); corners 12, smoothing 0.6 |
| Row | 440 wide; padding 12 top and bottom, 0 at the sides; stack gap 2 |
| Row heights | 40, 48, 54, 56, 116 (see the row tables) |
| Trailing control height | 24 for Rg controls (buttons, arrow button, combo box, text field, stepper, radio buttons); 16 for the Mn switch and text items |
| Gaps inside Trailing | 10 (control + text or two controls), 6 (Popup: value + arrow button), 16 (radio buttons), 4 (inside "Menu + Button" stack) |
| Gaps inside Leading | 8 (icon + title), 10 (symbol + title), 0 (disclosure + title) |
| Icon sizes in Leading | 24 × 24 (Service Icon 24pt), 32 × 32 (Service Icon 32pt, Image Icon Rounded Corner instance from a 40 × 40 master) |
| Disclosure | 18 × 16 |

Derived values:

- Row height = 12 + tallest child + 12 (16 → 40, 24 → 48, 30 → 54, 32 → 56, 92 → 116).
- Form height = sum of its row heights: 624 in the trailing window (row 576 + 48), 642 in the leading window (row 526 + 116). Window height = form height + 2 × 20 (664 and 682).
- Leading width + Trailing width = 440 in every row (for example 347 + 93), so the stack gap of 2 doesn't show between them.
- Text next to a 24 pt control sits at y 4: (24 − 16) ÷ 2.
- Leading titles start at the top of the row content (y 12). Next to a 24 pt trailing control the title is not vertically centred: its centre is at 20, the control's at 24.
- Leading text after an icon: x = icon width + gap (24 + 8 = 32; 32 + 8 = 40; 20 + 10 = 30; 18 + 0 = 18).
- Service icon corner radius = 0.225 × side (7.2 ÷ 32; 5.4 ÷ 24).
- Light and Dark examples have identical geometry (checked layer by layer: 150 matching layers).

## Colours and states

The examples show controls in their Idle states only.

### Containers

| Part | Light | Dark |
|---|---|---|
| Window fill | #FFFFFF | #1E1E1E {Window Backgrounds/Dark Background} |
| Window shadows | shadow x0 y36 blur100 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% | same |
| Form fill | #000000@3% {Fills/Light/4 Quatenary} | #FFFFFF@3% {Fills/Dark/4 Quatenary} |
| Row border | 1 outside #000000@5% {Fills/Light/3 Tertiary} | 1 outside #FFFFFF@5% {Fills/Dark/3 Tertiary} |

- Every row has the border except the last row of the Light leading-accessory window (y 526), which has none.
- In Dark, that row has the border.

### Text in the trailing-accessory window

| Role | Light | Dark |
|---|---|---|
| Row titles (Leading) | #000000@85% {Labels/Light/1 Primary} | #FFFFFF@55% {Labels/Dark/2 Secondary} |
| "Info" title (row y 40) | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, blend plus-darker | #FFFFFF@55% {Labels/Dark/2 Secondary}, blend plus-darker |
| Trailing text "Label", "seconds" | #000000@50% {Labels/Light/2 Secondary} | #FFFFFF@55% {Labels/Dark/2 Secondary} |
| Popup value "Label" | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #FFFFFF@55% {Labels/Dark/2 Secondary} |
| "Full Screen" | #000000@85% {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| "􀅴" glyphs | #000000@50% {Labels/Light/2 Secondary} | #FFFFFF@55% {Labels/Dark/2 Secondary} |
| "􀍠" glyph | #000000@50% {Labels/Light/2 Secondary}, blend plus-darker | #FFFFFF@55% {Labels/Dark/2 Secondary} |

### Text in the leading-accessory window

| Role | Light | Dark |
|---|---|---|
| Titles | #000000@85% {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| "Title" above a subtitle (row y 134) | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, blend plus-darker | #FFFFFF {Labels/Dark/1 Primary}, blend plus-darker |
| Subtitles | #000000@50% {Labels/Light/2 Secondary} | #FFFFFF@55% {Labels/Dark/2 Secondary} |
| "􀓔" symbol (Title + Symbol) | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary}, blend plus-darker | the same Light value, as stored |
| Disclosure chevron | #000000@85% {Labels/Light/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} |
| Service icon symbol | #FFFFFF {2 White} on the gray gradient | same (the masters have no appearance axis) |

## Text

| Part | Font | Size | Line height | Tracking | Linked text style |
|---|---|---|---|---|---|
| Row titles, trailing text | SFPro-Medium | 13 | 16 | Not in the kit | 06 Body/Default |
| Subtitles | SFPro-Medium | 11 | 14 | Not in the kit | 08 Subheadline/Default |
| Subtitle in "Disclosure + Title + Subtitle" | SFPro-Regular | 11 | 14 | Not in the kit | 08 Subheadline/Default |
| "􀅴", "􀍠" glyphs | SFPro-Regular | 13 | 16 | Not in the kit | 06 Body/Default (center-aligned) |
| "􀓔" in Title + Symbol | SFPro-Medium | 13 | 16 | Not in the kit | 06 Body/Default |
| Disclosure chevron | SFPro-Semibold | 13 | 16 | Not in the kit | none |
| Service Icon 32pt symbol | SFPro-Regular | 17.6 | Not in the kit | −0.42 | none (center) |
| Service Icon 24pt symbol | SFPro-Regular | 13 | Not in the kit | Not in the kit | none (center) |
| Dark example headings | SFPro-Medium | 24 | Not in the kit | Not in the kit | none |

- In `text-styles.md`, 06 Body/Default is SFPro-Regular 13/16 and 08 Subheadline/Default is SFPro-Regular 11/14.
- The form's text layers carry those styles but are stored as SFPro-Medium, except the glyphs and one subtitle.

## Effects

| Where | Effect |
|---|---|
| Window | shadow x0 y36 blur100 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% |
| Row | border 1 outside, 5% black (Light) or 5% white (Dark) |
| Image Icon Rounded Corner | border 0.5 inside #000000@10%; layer blend plus-darker |
| Vibrant labels | blend plus-darker where listed in the tables |
| Dark example headings | blend plus-lighter |

The page has no blurs or glass.

## Kit notes

The page has no documentation boards. Apple's only notes are two headings above the windows, and only the Dark example has them:

- "Leading accessory options" (@159,57), over the left window. That window shows leading-side variations: title and subtitle stacks, symbols, icons, disclosure and a radio group.
- "Trailing accessory options" (@780,57), over the right window. That window shows each control as a row's trailing accessory.
- Both headings are SFPro-Medium 24, #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary}, blend plus-lighter.

The page's other top-level text layers are the headings "Forms", "Light" and "Dark".

## Finding it in the spec

| Find | Pattern |
|---|---|
| Example forms | `grep -n '^COMPONENT "Forms/Example Forms/' specs/forms.txt` |
| All rows, with sizes | `grep -n 'group "Row"' specs/forms.txt` |
| Controls nested in rows | `grep -n '→ ' specs/forms.txt \| grep -v 'Forms/􀻃'` |
| Building blocks | `grep -n -A3 '^COMPONENT "Forms/􀻃 Rows - Leading/' specs/forms.txt` |
| Linked text styles | `grep -o 'textstyle="[^"]*"' specs/forms.txt \| sort \| uniq -c` |
| Dark headings | `grep -n 'accessory' specs/forms.txt` |
