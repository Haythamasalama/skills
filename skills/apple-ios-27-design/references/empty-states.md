# Empty States — iOS 27

**Read when:** you need an exact iOS 27 value for empty States (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Empty States in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/empty-states.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page heading glyph: 􀓔 U+1004D4.

## Components

6 components, all full iPhone screens (402 × 874) in one family.

| Family | Name pattern | Axis values | Count |
|---|---|---|---|
| Empty state example | `Examples/Empty State/[Light/]<Layout>` | Layout: Large Symbol, Symbol in Circle, Title and Subtitle. Appearance: names with `Light/` (3), names without (3) | 6 |

Naming, as stored: the three components named `Examples/Empty State/Light/…` are drawn in Dark (black background, Dark label swatches, Dark buttons and bars), and the three without an appearance level are drawn in Light. The tables below go by what is drawn and give the stored name.

| Drawn appearance | Stored names |
|---|---|
| Light | `Examples/Empty State/Large Symbol`, `…/Symbol in Circle`, `…/Title and Subtitle` |
| Dark | `Examples/Empty State/Light/Large Symbol`, `…/Light/Symbol in Circle`, `…/Light/Title and Subtitle` |

## Anatomy

All six roots: 402 × 874, `stack v gap0 pad62,0,88,0`, with a status bar instance 402 × 62 @0,0 → `Status Bars/iPhone 17 Pro/<Appearance> Background` and a `Button` at the bottom.

### Large Symbol

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| `Content` | group | 402 × 724 @0,62 | `stack v gap16 pad0,16,0,16` |
| `Symbol` | text | 52 × 41 @175,277.5 | glyph 􀋃 U+1002C3 |
| `Stack` | group | 338 × 112 @32,334.5 | `stack v gap2` |
| `VIP` (title) | text | 338 × 26 @0,0 | "VIP" |
| `Quickly access mail` (message) | text | 338 × 84 @0,28 | "Quickly access mail from important people in your VIP mailbox." |
| `Button` | instance | 334 × 52 @36,786 | → `Buttons/<Appearance>/Large/Glass Prominent/Default`, text "Add VIP" |

No navigation bar.

### Symbol in Circle

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| `Navigation Bar` | instance | 402 × 105 @0,62 | → `Toolbars/<Appearance>/iPhone/Top - Standard/Large`, title "Work", glyphs 􀈂 U+100202 and 􀍠 U+100360, swap to `…/Buttons/48pt/Active/Horizontal Group - Symbol 2` (Dark) or `…/Buttons/44pt/…` (Light) |
| `Content` | group | 402 × 619 @0,167 | `stack v gap16 pad0,16,0,16` |
| `Symbol` | group | 50 × 50 @176,249.5 | fill, `stack v gap0 pad13,13,13,13` |
| `Oval` | oval | 50.08 × 50 @0,0 | fill #D8D8D8, `opacity 15%` |
| `Symbol` (glyph) | text | 24 × 22 @13,14 | glyph 􀆅 U+100185 |
| `Stack` | group | 338 × 54 @32,315.5 | `stack v gap2` |
| `No Reminders` (title) | text | 338 × 26 @0,0 | "No Reminders" |
| `You’ve completed all` (message) | text | 338 × 26 @0,28 | "You’ve completed all tasks." |
| `Button` | instance | 334 × 52 @36,786 | → `Buttons/<Appearance>/Large/Glass Prominent/Default`, text "New Reminder" |

### Title and Subtitle

| Part (layer) | Kind | Size @ position | Notes |
|---|---|---|---|
| `Navigation Bar` | instance | 402 × 105 @0,62 | → `Toolbars/<Appearance>/iPhone/Top - Standard/Large`, title "Notes" |
| `Content` | group | 402 × 619 @0,167 | `stack v gap2 pad0,16,0,16` |
| `No Notes` (title) | text | 338 × 26 @32,282.5 | "No Notes" |
| `Start by adding a no` (message) | text | 338 × 26 @32,310.5 | "Start by adding a note." |
| `Button` | instance | 330 × 52 @36,786 | → `Buttons/<Appearance>/Large/Glass Prominent/Default`, text "Create Note " (trailing space as stored) |

## Sizes

All values derived from positions unless marked stored.

| Item | Large Symbol | Symbol in Circle | Title and Subtitle |
|---|---|---|---|
| Content area | 402 × 724 from y 62 (stored) | 402 × 619 from y 167 (stored) | 402 × 619 from y 167 (stored) |
| Symbol | 52 × 41 glyph box | 50 × 50 circle, glyph inset 13 (stored padding) | — |
| Symbol → text gap | 334.5 − (277.5 + 41) = 16 | 315.5 − (249.5 + 50) = 16 | — |
| Title → message gap | 28 − 26 = 2 | 28 − 26 = 2 | 310.5 − (282.5 + 26) = 2 |
| Block vertical centre | (277.5 + 446.5) / 2 = 362 = 724 / 2 | (249.5 + 369.5) / 2 = 309.5 = 619 / 2 | (282.5 + 336.5) / 2 = 309.5 = 619 / 2 |
| Text column | 338 wide at x 32 → 32 each side | same | same |
| Button | 334 × 52 at x 36 (36 left, 32 right) | 334 × 52 at x 36 (36 left, 32 right) | 330 × 52 at x 36 (36 each side) |
| Button bottom | 786 + 52 = 838 → 36 above the screen bottom | same | same |

So the content block is centred vertically in the area between the bars and the bottom padding (88, stored), and the text column is inset 32 from each screen edge although the `Content` stack pads only 16.

## Colours and states

### Light (names without `Light/`)

| Part | Large Symbol | Symbol in Circle | Title and Subtitle |
|---|---|---|---|
| Screen fill | #FFFFFF {Backgrounds/Light/Primary} | same | same |
| Symbol | #FFCC00 {System Colors/Light/3 Yellow} | circle group fill #FF0000 (no swatch); `Oval` #D8D8D8 at 15%; glyph #3C3C43@60% {Labels/Light/2 Secondary} | — |
| Title | #000000 {Labels/Light/1 Primary} | #000000 {Labels/Light/1 Primary} | #3C3C43@60% {Labels/Light/2 Secondary} |
| Message | #3C3C43@60% {Labels/Light/2 Secondary} | #3C3C43@60% {Labels/Light/2 Secondary} | #3C3C43@60% {Labels/Light/2 Secondary} |
| Button tint overrides | #FFCC00 {System Colors/Light/3 Yellow} (several fills), one #FFD600 {System Colors/Dark/3 Yellow} | #FF2D55 {System Colors/Light/11 Pink} (fills and a shadow), one #FF375F {System Colors/Dark/11 Pink} | #0088FF {System Colors/Light/8 Blue}, plus one #FFCC00 {System Colors/Light/3 Yellow} |

### Dark (names with `Light/`)

| Part | Large Symbol | Symbol in Circle | Title and Subtitle |
|---|---|---|---|
| Screen fill | #000000 {Backgrounds/Dark - Base/Primary} | same | same |
| Symbol | #FFD600 {System Colors/Dark/3 Yellow} | circle group fill #FF375F {System Colors/Dark/11 Pink}; `Oval` #D8D8D8 at 15%; glyph #3C3C43@60% {Labels/Light/2 Secondary} (as stored: Light swatch) | — |
| Title | #FFFFFF {Labels/Dark/1 Primary} | #FFFFFF {Labels/Dark/1 Primary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Message | #EBEBF5@60% {Labels/Dark/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} | #EBEBF5@60% {Labels/Dark/2 Secondary} |
| Button tint overrides | #FFCC00 {System Colors/Light/3 Yellow}, #FFD600 {System Colors/Dark/3 Yellow} | #FF2D55 {System Colors/Light/11 Pink} (fill and shadow), #FF375F {System Colors/Dark/11 Pink} | #0091FF {System Colors/Dark/8 Blue} |

The button colour overrides are listed as `color:fill-N→` / `color:shadow-N→` in the dump; which layer each index targets is in `specs/buttons.txt` (Glass Prominent masters), see `references/buttons.md`. In the Title and Subtitle layout the title uses the Secondary label colour, the same as the message.

## Text

| Part | Font | Size | Line height | Tracking | Align | Text style bound |
|---|---|---|---|---|---|---|
| Large symbol 􀋃 | SFPro-Regular | 40 | 41 | Not in the kit | left | `01 LargeTitle/1 Default` |
| Circle glyph 􀆅 | SFPro-Semibold | 21 | 22 | Not in the kit | center | none |
| Title (all layouts) | SFPro-Bold | 22 | Not in the kit (layer 26 tall) | Not in the kit | center | `06 Body/1 Default` in Large Symbol and Title and Subtitle; none in Symbol in Circle |
| Message, Large Symbol | SFPro-Medium | 22 | 28 | Not in the kit | center | `06 Body/1 Default` |
| Message, other layouts | SFPro-Medium | 22 | Not in the kit (layer 26 tall) | Not in the kit | center | `06 Body/1 Default` in Title and Subtitle; none in Symbol in Circle |

The bound styles do not match the drawn text: `06 Body/1 Default` is SFPro-Regular 17 / lh22 and `01 LargeTitle/1 Default` is SFPro-Regular 34 / lh41 (`references/text-styles.md`), but the layers store the sizes and weights above.

## Effects

- `Oval` behind the circle glyph: fill #D8D8D8 at layer `opacity 15%`.
- Button glass and bar effects come from the referenced masters (`references/buttons.md`, `references/toolbars.md`, `references/system.md`).
- No other shadows, blurs or blend modes are stored on this page.

## Kit notes

The page header hides its description (`isVisible→0`), so the page has no written guidance. The three layouts show the pattern: a centred block (optional symbol, a title and a message) with one prominent glass button near the bottom of the screen. Not in the kit: iPad layouts, a layout with a secondary button, and maximum text widths other than the 338-pt column.

## Finding it in the spec

| Family | grep |
|---|---|
| All six | `grep -n '^COMPONENT "Examples/Empty State/' specs/empty-states.txt` |
| One layout with children | `grep -n -A11 'Empty State/Symbol in Circle"' specs/empty-states.txt` |
| Text layers | `grep -n '  text "' specs/empty-states.txt` |
