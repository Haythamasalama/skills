# Text Fields — iOS 27

**Read when:** you need an exact iOS 27 value for text Fields (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Text Fields in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/text-fields.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀅫 U+10016B. `􀻃` (U+100EC3) marks the kit's internal building-block level in names.

## Components

11 components in three families.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Text field (row) | `Text Fields/<Appearance>/<State>` | Appearance: Light, Dark. State: Default, Placeholder, Empty Typing, Typing | 8 |
| Cursor | `Text Fields/􀻃/Cursor` | — | 1 |
| Example screen | `Examples/Text Fields/<Appearance>` | Light, Dark | 2 |

The fields are used elsewhere: the Alerts page puts `Text Fields/<Appearance>/Default` and `/Placeholder` inside its input alerts, and the sidebar search field uses the Cursor.

## Anatomy

### Text field row (all 8)

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| Root | component | 288 × 52 | `stack h gap0 pad0,16,0,16` |
| `Stack` | group | 256 × 52 @16,0 | border (separator), `stack h gap0` |
| `Placeholder` (Default, Placeholder) | text | 256 × 20 @0,16 | value or placeholder text |
| `Cursor` (Empty Typing) | instance | 4 × 22 @0,15 | → `Text Fields/􀻃/Cursor` |
| `Stack` (Typing) | group | 227 × 22 @0,15 | `stack h gap1` |
| `Placeholder` (Typing, inside the inner Stack) | text | 43 × 20 @0,1 | typed value |
| `Cursor` (Typing, inside the inner Stack) | instance | 4 × 22 @44,0 | after the text: 43 + gap 1 = 44 (derived) |
| `􀁡` (Typing) | text | 29 × 36 @227,8 | trailing glyph 􀁡 U+100061 |

The text layer is named `Placeholder` in every state, including Default and Typing where it holds the value "Value".

### Cursor (`Text Fields/􀻃/Cursor`)

| Part | Kind | Size @ position | Value |
|---|---|---|---|
| Root | component | 4 × 22 | — |
| `Shape` | rect | 2 × 22 @1,0 | fill #007AFF, `corners 2` |

### Example screens (`Examples/Text Fields/Light`, `/Dark`)

| Part | Size @ position | Notes |
|---|---|---|
| Root | 402 × 874 | `stack v gap0 pad62,16,0,16` |
| `Status Bar` | 402 × 62 @0,0.07 | → `Status Bars/iPhone 17 Pro/<Appearance> Background` |
| `Content` | 370 × 208 @16,62 | `stack v gap20` |
| `Section` | 370 × 208 @0,0 | `corners 26`, `stack v gap0`; four rows |
| Rows | 370 × 52 each, at y 0 / 52 / 104 / 156 | Default, Empty Typing, Placeholder, Typing (top to bottom) |

The rows are 288-wide masters placed at 370 wide.

## Sizes

| Item | Value | Derived |
|---|---|---|
| Row | 288 × 52 (370 × 52 in the example) | — |
| Horizontal inset | 16 leading and trailing (`pad0,16,0,16`) | — |
| Text top | y 16 in a 20-tall layer | bottom space 52 − 16 − 20 = 16 |
| Cursor | 4 × 22 frame, visible bar 2 × 22, radius 2 | cursor top y 15 → (52 − 22) / 2 = 15, centred |
| Text → cursor gap | 1 (`gap1`) | — |
| Trailing glyph | 29 × 36 @227,8 (Typing only) | right edge 227 + 29 = 256 = Stack width; top 8 = (52 − 36) / 2 |
| Example section | 370 wide, corner radius 26 | side margin 16 = (402 − 370) / 2 |

## Colours and states

### Light

| State | Text | Text colour | Separator (`Stack` border) | Cursor | Trailing glyph |
|---|---|---|---|---|---|
| Default | "Value" | #000000 {Labels/Light/1 Primary} | 1 outside #E6E6E6 {Separators/Light/Vibrant} (blend plus-darker) | — | — |
| Placeholder | "Placeholder" | #3C3C43@30% {Labels/Light/3 Tertiary} | same | — | — |
| Empty Typing | none | — | same | #007AFF (master value) | — |
| Typing | "Value" | #000000 {Labels/Light/1 Primary} | same | #007AFF (master value) | 􀁡 U+100061 #3C3C43@30% {Labels/Light/3 Tertiary} |

### Dark

| State | Text | Text colour | Separator (`Stack` border) | Cursor | Trailing glyph |
|---|---|---|---|---|---|
| Default | "Value" | #FFFFFF {Labels/Dark/1 Primary} | 1 outside #1A1A1A {Separators/Dark/Vibrant} (blend plus-lighter) | — | — |
| Placeholder | "Placeholder" | #EBEBF5@30% {Labels/Dark/3 Tertiary} | same | — | — |
| Empty Typing | none | — | same | override #0091FF {System Colors/Dark/8 Blue} | — |
| Typing | "Value" | #FFFFFF {Labels/Dark/1 Primary} | same | override #0091FF {System Colors/Dark/8 Blue} | 􀁡 U+100061 #EBEBF5@30% {Labels/Dark/3 Tertiary} |

The row roots have no fill; the background comes from the container. In the examples:

| Appearance | Screen fill | Section fill |
|---|---|---|
| Light | #F2F2F7 {Backgrounds Grouped/Light/Primary} | #FFFFFF {Backgrounds Grouped/Light/Secondary} |
| Dark | #000000 {Backgrounds Grouped/Dark - Base/Primary} | #1C1C1E {Backgrounds Grouped/Dark - Base/Secondary} |

No shared layer styles (`style=`) are used on this page.

## Text

| Part | Font | Size | Line height | Tracking | Colour | Align |
|---|---|---|---|---|---|---|
| Value / placeholder | SFPro-Medium | 17 | Not in the kit (layer is 20 tall) | Not in the kit | per state | left |
| Trailing glyph 􀁡 | SFPro-Regular | 24 | 36 | Not in the kit | Labels/3 Tertiary | Not in the kit |

No text style is bound to these layers.

## Effects

Only the separator borders' blend modes: `plus-darker` in Light, `plus-lighter` in Dark. No shadows, blurs or glass.

## Kit notes

The header description is cut off in the dump; only its opening survives ("A text field is a rectangular area in wh…"). No other notes are on the page. Not in the kit: a focused-field highlight, error or disabled states, clear-button behaviour beyond the static glyph, and a leading label.

## Finding it in the spec

| Family | grep |
|---|---|
| Rows | `grep -n '^COMPONENT "Text Fields/\(Light\|Dark\)/' specs/text-fields.txt` |
| Cursor | `grep -n -A1 'Text Fields/􀻃/Cursor"' specs/text-fields.txt` |
| Examples | `grep -n -A8 '^COMPONENT "Examples/Text Fields/' specs/text-fields.txt` |
