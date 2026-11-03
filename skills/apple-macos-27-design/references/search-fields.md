# Search Fields — macOS 27

**Read when:** you need an exact macOS 27 value for search Fields (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Search Fields in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/search-fields.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

The page has 76 components in two families:

| Family | Name path | Count |
|---|---|---|
| Search field | `Search Fields/<Appearance>/<Size>/<State>` | 60 (2 × 5 × 6) |
| Glyph building blocks | `Search Fields/<Appearance>/􀻃/<Size group>/<Glyph>/<Variant>` | 16 (2 × 8) |

The building-block names contain the glyph 􀻃 (U+100EC3).

| Axis | Values |
|---|---|
| Appearance | Light, Dark |
| Size (field) | 1 Mn, 2 Sm, 3 Rg, 4 Lg, 5 XL |
| State (field) | Empty, Empty + Typing, Empty + Disabled, Value, Value + Typing, Value + Disabled |
| Size group (glyphs) | 1 Mn, SM - XL |
| Glyph / variant | Magnifying Glass / with Menu, Magnifying Glass / without Menu, Clear / 1 - Idle, Clear / 3 - Clicked |

- The page has no Content Area / Over-glass axis.
- It has no hover or clicked state for the field itself.
- Every field component is 120 pt wide.

## Anatomy

The field is a horizontal auto-layout row (`stack h`). It is a capsule (`corners max`) carrying the field style. Its children:

| Layer | Kind | In which states | What it is |
|---|---|---|---|
| `Symbol` | `use` → `…/􀻃/<group>/Magnifying Glass/with Menu` | All | The leading magnifier with a small chevron |
| `Search` | text | Empty, Empty + Typing, Empty + Disabled | Placeholder, content "Search" |
| `Value` | text | Value, Value + Typing, Value + Disabled | Entered text, content "Value" |
| `Stack` | group, `stack h gap0` | Both Typing states | Holds the text and the `I-beam` |
| `I-beam` | rect, inside `Stack` | Both Typing states | The text cursor: 2 pt wide, corners 2.5, system blue |
| `Clear` | `use` → `…/􀻃/<group>/Clear/1 - Idle` | Value, Value + Typing, Empty + Typing, Empty + Disabled | The trailing clear button |
| `Focus Ring` | rect, full field size @0,0, corners max | Both Typing states | The focus ring, style `…/Input Fields/03 - Focus Ring` |

- In Empty + Typing the `I-beam` is at the start of the Stack (x 0) and the placeholder follows at x 2.
- In Value + Typing the `I-beam` follows the text (x = text width).
- The `Clear` button is absent from Empty and from Value + Disabled. It is present in Empty + Disabled.
- The magnifier and clear masters (`Magnifying Glass/without Menu`, `Clear/3 - Clicked`) exist, but no field on this page uses them.

### Glyph building blocks

Each master has a background fill that the kit names as a kit swatch: #CCE6FF {x. Kit/Nested Symbol BG Light} or #366799 {x. Kit/Nested Symbol BG Dark}.

| Master | W × H | Layers |
|---|---|---|
| 1 Mn/Magnifying Glass/with Menu | 17 × 13 | text "􀊫" (U+1002AB) 14 × 13 @0,0 + path "􀆈" (U+100188) 5 × 3 @10.67,4.75 |
| SM - XL/Magnifying Glass/with Menu | 21 × 15 | text "􀊫" (U+1002AB) 16 × 15 @0,0 + path "􀆈" (U+100188) 6 × 3.67 @12.5,5.75 |
| 1 Mn/Magnifying Glass/without Menu | 14 × 13 | text "􀊫" 14 × 13 @0,0 |
| SM - XL/Magnifying Glass/without Menu | 16 × 15 | text "􀊫" 16 × 15 @0,0 |
| 1 Mn/Clear/1 - Idle, 1 Mn/Clear/3 - Clicked | 13 × 13 | text "􀁡" (U+100061) 13 × 13 @0,0 |
| SM - XL/Clear/1 - Idle, SM - XL/Clear/3 - Clicked | 16 × 15 | text "􀁡" (U+100061) 16 × 15 @0,0 |

## Sizes

Geometry is identical in Light and Dark (checked for every size and state). The field style's own corner radius is 9; every field overrides it with `corners max`.

| Size | Field W × H | Corners | Stack (Empty, Value, Disabled) | Stack (Typing) | Text font |
|---|---|---|---|---|---|
| 5 XL | 120 × 36 | max | h, gap 3, pad 0,8,0,10 (Empty and Value: pad 11,8,10,10) | h, gap 1, pad 0,8,0,10 | SFPro-Medium 13 |
| 4 Lg | 120 × 28 | max | h, gap 3, pad 0,6,0,8 | h, gap 1, pad 0,6,0,8 | SFPro-Medium 13 |
| 3 Rg | 120 × 24 | max | h, gap 3, pad 0,4,0,8 | h, gap 1, pad 0,4,0,8 | SFPro-Medium 13 |
| 2 Sm | 120 × 20 | max | h, gap 3, pad 0,2.5,0,6 | h, gap 1, pad 0,2.5,0,6 | SFPro-Medium 11 |
| 1 Mn | 120 × 16 | max | h, gap 3, pad 0,2,0,6 | h, gap 1, pad 0,2,0,6 | SFPro-Medium 10 |

Children in the non-typing states:

| Size | Symbol instance @ | Symbol master | Text @ | Text W × H (no Clear / with Clear) | Clear instance @ | Clear master |
|---|---|---|---|---|---|---|
| 5 XL | 21 × 36 @10,0 (Empty, Value: 21 × 15 @10,11) | SM - XL, 21 × 15 | 34, 0 (Empty, Value: 34, 11) | 78 × 36 / 59 × 36 (Empty, Value: 78 × 15 / 59 × 15) | 16 × 15 @96,10.5 (Value: @96,11) | SM - XL, 16 × 15 |
| 4 Lg | 21 × 28 @8,0 | SM - XL | 32, 0 | 82 × 28 / 63 × 28 | 16 × 15 @98,6.5 | SM - XL |
| 3 Rg | 21 × 24 @8,0 | SM - XL | 32, 0 | 84 × 24 / 65 × 24 | 16 × 15 @100,4.5 | SM - XL |
| 2 Sm | 21 × 20 @6,0 | SM - XL | 30, 0 | 87.5 × 20 / 68.5 × 20 | 16 × 15 @101.5,2.5 | SM - XL |
| 1 Mn | 17 × 16 @6,0 | 1 Mn, 17 × 13 | 26, 0 | 92 × 16 / 76 × 16 | 13 × 16 @105,0 | 1 Mn, 13 × 13 |

Children in the Typing states:

| Size | Stack W × H @ | I-beam W × H | Value text (Value + Typing) | I-beam @ (Value + Typing) | Placeholder (Empty + Typing) | I-beam @ (Empty + Typing) |
|---|---|---|---|---|---|---|
| 5 XL | 63 × 18 @32,9 | 2 × 18 | 35 × 15 @0,1.5 | 35, 0 | 44 × 15 @2,1.5 | 0, 0 |
| 4 Lg | 67 × 18 @30,5 | 2 × 18 | 35 × 15 @0,1.5 | 35, 0 | 44 × 15 @2,1.5 | 0, 0 |
| 3 Rg | 69 × 18 @30,3 | 2 × 18 | 35 × 15 @0,1.5 | 35, 0 | 44 × 15 @2,1.5 | 0, 0 |
| 2 Sm | 72.5 × 16 @28,2 | 2 × 16 | 30 × 13 @0,1.5 | 30, 0 | 38 × 13 @2,1.5 | 0, 0 |
| 1 Mn | 80 × 14 @24,1 | 2 × 14 | 28 × 12 @0,1 | 28, 0 | 35 × 12 @2,1 | 0, 0 |

In the Typing states the Symbol and Clear instances keep the positions in the first table.

Derived values:

- Text x = left padding + Symbol width + gap 3 (Rg: 8 + 21 + 3 = 32; Mn: 6 + 17 + 3 = 26).
- Typing Stack x = left padding + Symbol width + gap 1 (Rg: 8 + 21 + 1 = 30).
- Clear x = field width − right padding − Clear width (Rg: 120 − 4 − 16 = 100).
- Clear y = (field height − 15) ÷ 2 (Rg: (24 − 15) ÷ 2 = 4.5). At Mn the Clear instance is full height (13 × 16 @0).
- The text frame fills the space between the Symbol and the Clear button (Rg, with Clear: 120 − 8 − 21 − 3 − 3 − 16 − 4 = 65).
- Typing Stack width = field width − Stack x − gap 1 − Clear width − right padding (Rg: 120 − 30 − 1 − 16 − 4 = 69).
- Symbol instances are stretched to the field height (Rg 21 × 24, from a 21 × 15 master), except in XL Empty and XL Value. The Mn Clear instance is 13 × 16, from a 13 × 13 master; the other Clear instances keep the master size, 16 × 15.
- Leading inset (left padding): XL 10, Lg 8, Rg 8, Sm 6, Mn 6. Trailing inset (right padding): XL 8, Lg 6, Rg 4, Sm 2.5, Mn 2.

## Colours and states

Field styles are in `control-styles-content-area.md` / `control-styles-over-glass.md` (`Content Area/<Appearance>/Input Fields/…`).

- The page has one context only. Its styles are the Content Area input-field styles.
- Colours are the same in every size (checked across all five sizes).

### Light

| State | Field style | Field fill | Field border | Field opacity | Text colour | Extra layers |
|---|---|---|---|---|---|---|
| Empty | Content Area/Light/Input Fields/01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | "Search" #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary} | — |
| Empty + Typing | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | "Search" #737373 | Focus Ring; I-beam #0088FF {System Colors/Light/8 Blue}; Clear |
| Empty + Disabled | Content Area/Light/Input Fields/04 - Disabled | #FFFFFF@50% | 1 outside #000000@4% (blend plus-darker) | — | "Search" #737373 | Clear |
| Value | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | "Value" #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | Clear |
| Value + Typing | 01 - Idle | #FFFFFF | 1 outside #000000@5% (blend plus-darker) | — | "Value" #363636 | Focus Ring; I-beam #0088FF; Clear |
| Value + Disabled | 04 - Disabled | #FFFFFF@50% | 1 outside #000000@4% (blend plus-darker) | — | "Value" #363636 | — |

Light Focus Ring: style `Content Area/Light/Input Fields/03 - Focus Ring`. Border 3.5 outside #0088FF {System Colors/Light/8 Blue} + border 1 inside #0088FF, layer opacity 50%, corners max.

### Dark

| State | Field style | Field fill | Field border | Field opacity | Text colour | Extra layers |
|---|---|---|---|---|---|---|
| Empty | Content Area/Dark/Input Fields/01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | "Search" #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary} | — |
| Empty + Typing | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | "Search" #8A8A8A | Focus Ring; I-beam #0091FF {System Colors/Dark/8 Blue}; Clear |
| Empty + Disabled | Content Area/Dark/Input Fields/04 - Disabled | #1E1E1E@50% | 1 outside #000000@4% | 50% | "Search" #8A8A8A | Clear |
| Value | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | "Value" #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | Clear |
| Value + Typing | 01 - Idle | #1E1E1E | 1 outside #FFFFFF@4% | — | "Value" #FFFFFF@96% | Focus Ring; I-beam #0091FF; Clear |
| Value + Disabled | 04 - Disabled | #1E1E1E@50% | 1 outside #000000@4% | 50% | "Value" #FFFFFF@96% | — |

Dark Focus Ring: style `Content Area/Dark/Input Fields/03 - Focus Ring`. Border 3.5 outside #0091FF {System Colors/Dark/8 Blue} (blend plus-lighter) + border 1 inside #0091FF (blend plus-lighter), layer opacity 50%, corners max.

### Glyph colours

| Glyph | Light | Dark |
|---|---|---|
| Magnifier "􀊫" and chevron "􀆈" | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary}, blend plus-darker | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary}, blend plus-lighter |
| Clear "􀁡", 1 - Idle | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary}, blend plus-darker | #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary}, blend plus-lighter |
| Clear "􀁡", 3 - Clicked (unused on this page) | #363636 {…/1 Primary}, blend plus-darker | #FFFFFF@96% {…/1 Primary}, blend plus-lighter |

How Disabled differs from Idle:

- In Light: only the field fill (50% white) and the border alpha (4% instead of 5%) change. Text and glyph colours stay the same.
- In Dark: the whole field also drops to opacity 50%.

## Text

| Part | Font | Size | Line height | Tracking | Alignment | Colour |
|---|---|---|---|---|---|---|
| Value / placeholder, XL, Lg, Rg | SFPro-Medium | 13 | Not in the kit | Not in the kit | left | see tables |
| Value / placeholder, Sm | SFPro-Medium | 11 | Not in the kit | Not in the kit | left | see tables |
| Value / placeholder, Mn | SFPro-Medium | 10 | Not in the kit | Not in the kit | left | see tables |
| Magnifier "􀊫", SM - XL with Menu | SFProRounded-Medium | 12.2 | 15 | Not in the kit | left | see Glyph colours |
| Magnifier "􀊫", 1 Mn with Menu | SFProRounded-Medium | 10.5 | 13 | Not in the kit | left | |
| Magnifier "􀊫", SM - XL without Menu | SFProRounded-Medium | 13 | 15 | Not in the kit | left | |
| Magnifier "􀊫", 1 Mn without Menu | SFProRounded-Medium | 11 | 13 | Not in the kit | left | |
| Clear "􀁡", SM - XL | SFProRounded-Medium | 13 | 15 | Not in the kit | center | |
| Clear "􀁡", 1 Mn | SFProRounded-Medium | 11 | 12.25 | Not in the kit | center | |

- No shared text style is linked on this page.
- Placeholder text is "Search"; entered text is "Value".
- Text blend: plus-darker (Light), plus-lighter (Dark).

## Effects

| Where | Effect |
|---|---|
| Focus Ring, Light | border 3.5 outside + border 1 inside, #0088FF, layer opacity 50% |
| Focus Ring, Dark | border 3.5 outside + border 1 inside, #0091FF, each border blend plus-lighter, layer opacity 50% |
| Field border, Light | blend plus-darker on the border |
| Field, Dark Disabled | layer opacity 50% |
| Text and glyphs | plus-darker (Light), plus-lighter (Dark) |

The page has no shadows, blurs or glass.

## Kit notes

The page has no documentation boards and no notes from Apple. Its only top-level text layers are the headings "Search Fields", "Light" and "Dark".

## Finding it in the spec

| Find | Pattern |
|---|---|
| All fields | `grep -n '^COMPONENT "Search Fields/\(Light\|Dark\)/[1-5] ' specs/search-fields.txt` |
| One size and state, with layers | `grep -n -A8 '^COMPONENT "Search Fields/Light/3 Rg/Value + Typing"' specs/search-fields.txt` |
| Glyph building blocks | `grep -n -A2 '^COMPONENT "Search Fields/.*/􀻃/' specs/search-fields.txt` |
| Field styles in use | `grep -o '^COMPONENT.*style="[^"]*"' specs/search-fields.txt \| grep -o 'style="[^"]*"' \| sort \| uniq -c` |
| Focus rings and cursors | `grep -n 'rect "Focus Ring"\|rect "I-beam"' specs/search-fields.txt` |
| Which masters the fields use | `grep -o '→ .*' specs/search-fields.txt \| sort \| uniq -c` |
