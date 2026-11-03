# Sidebars — macOS 27

**Read when:** you need an exact macOS 27 value for sidebars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Sidebars in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/sidebars.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so. How the sidebar sits inside a window (pane size, background material, titlebar) is not on this page; it comes from the window components in `specs/windows.txt` and the `Sidebar/Background/*` styles in `surface-styles.md`, and each such value names that source.

The 􀻃 (U+100EC3) folder in component names is the kit's folder for building-block parts.

## Components

220 components, 110 per appearance. No documentation boards.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Examples (whole sidebar list) | `Sidebars/{Dark,Light}/Examples/{Inactive,Active}/{Large,Medium,Small}` | appearance × window state × size | 12 |
| Folder rows | `Sidebars/{A}/{Large,Medium,Small}/Folders/Level {0,1,2,3,4} - {Default,Selected,Disabled}` | appearance × size × level × state | 90 |
| Item rows | `Sidebars/{A}/{Large,Medium,Small}/Items/Level 0 - {Default,Selected,Disabled}` | appearance × size × state (Level 0 only) | 18 |
| Section header | `Sidebars/{A}/{Large,Medium,Small}/Header` | appearance × size | 6 |
| Row parts | `Sidebars/{A}/􀻃/{Large,Medium,Small}/{L1,L1+}/{Leading/Disclosure/Open, Leading/Disclosure/Closed, Leading/Image, Leading/Folder, Leading/Symbol, Trailing/Details}` | appearance × size × level group × part (Small L1+ Folder is stored as `Leading/Folder/`, with a trailing slash) | 72 |
| Header parts | `Sidebars/{A}/􀻃/{Large,Medium,Small}/Headers - Trailing/{Submenu/Open, Submenu/Closed, Details}` | appearance × size × part | 18 |
| Window Controls + Disclosure | `Sidebars/{A}/Window Controls + Disclosure/{Monobar,Default}` | appearance × titlebar type | 4 |

`L1` parts are used by Level 0 rows and Item rows; `L1+` parts by Folder rows at Levels 1–4 (see Anatomy).

## Anatomy

### The sidebar in a window (from `specs/windows.txt`)

The macOS 27 kit draws the sidebar **edge to edge**, not as a floating inset panel.

| Property | Value in the kit | Where |
|---|---|---|
| Pane | `group "Left Pane"` 256 wide at `@0,0`, as tall as the window (256×300 in the 600×300 `Window BG (with Sidebar)` components, 256×400 in the 840×400 windows) | every `Windows/*/…+ Sidebar/*` and `Window BG (with Sidebar)` component |
| Insets from the window edges | 0 top, 0 leading, 0 bottom (derived: pane at x 0, y 0, height = window height) | same |
| Pane corner radius | `corners 0` | same |
| Window corner radius | `corners 16` (`Windows/{Dark,Light}/With Sidebar/{Active,Inactive}`) | same |
| Border or divider between the panes | none in the dump; `Right Pane` starts at x 256 | same |
| Shadow on the pane | none; only the window has shadows | same |
| Glass | none; the pane uses a background-blur material (`Sidebar/Background/*`), not a Liquid Glass style | same |
| Content pane | `group "Right Pane"` 584×400 @256,0, fill #1E1E1E (Dark) / #FFFFFF (Light) | 840×400 windows |
| Sidebar list used | `use "Sidebar" 256×1050` → `Sidebars/{A}/Examples/{Active,Inactive}/Small` (the Small list is the only one used in windows) | 840×400 windows |

Sidebar background (`rect "BG" 256×400 @0,0`, the bottom layer of the Left Pane). Values from `surface-styles.md`:

| Style | Fill | Background blur | Corners |
|---|---|---|---|
| `Sidebar/Background/Light/Active` | #FAFAFA@80% | radius 100, saturation 1 | 0 |
| `Sidebar/Background/Light/Inactive` | #F4F4F4 | radius 100, saturation 1 | 0 |
| `Sidebar/Background/Dark/Active` | #0C0C0C@85% | radius 80, saturation 2 | 0 |
| `Sidebar/Background/Dark/Inactive` | #2E2E2E@85% | radius 70, saturation 1.8 | 0 |

How it sits under the titlebar and toolbar: the `BG` rect starts at y 0, so the sidebar material runs up behind the titlebar. The Left Pane carries its own titlebar group, drawn on top of the list, with the window controls and the sidebar toggle; the list starts below it. The Right Pane has a `Scroll Edge Effect/{Dark,Light} - Top - Hard` under its toolbar; the Left Pane has none.

| Window component | Left-pane titlebar group | Window Controls (68×14) | Sidebar toggle | List `y` |
|---|---|---|---|---|
| `Expanded Toolbar + Title + Sidebar` | `Stack` 256×76: `Titlebar` 256×32 (pad 9) over `Toolbar` 256×44 @0,32 (pad 0,8,8,8) | @9,9 | `Titlebars and Toolbars/{A}/XL/Buttons/{Active,Inactive}/1` 36×36 @212,0 inside `Toolbar` (pane y 32) | 76 |
| `Unified Toolbar + Title + Sidebar` | `Titlebar and Toolbar` 256×52, stack h gap8 pad0,8,0,18 | @18,19 | XL button 36×36 @212,8 | 52 |
| `Unified Compact Toolbar + Title + Sidebar` | `Titlebar and Toolbar` 256×40, stack h gap12 pad0,8,0,13 | @13,13 | `…/Medium/Buttons/{Active,Inactive}/1` 24×24 @224,8 | 40 |
| `Default + Title + Sidebar` | `Titlebar` 256×52, stack h gap16 pad0,8,0,18 | @18,19 | XL button 36×36 @212,8 (layer named `Button`) | 52 |

The toggle text override in these windows is 􀰱 (U+100C31). Derived: the toggle's trailing inset is 8 in every window (256 − 212 − 36 = 8; 256 − 224 − 24 = 8).

Layer order in the Left Pane is `BG`, then the list, then the titlebar group (bottom to top), in every window except `Windows/Light/Default + Title + Sidebar/Active`, which stores the list below `BG`. The Light Inactive windows use the `Examples/Active/Small` list over the Inactive background; the Dark Inactive windows use `Examples/Inactive/Small`.

Window style with a sidebar (`surface-styles.md`): `Windows/Dark/With Sidebar/*` fill #000000 (blend screen), `Windows/Light/With Sidebar/*` fill #FFFFFF (blend multiply); Active shadows x0 y36 blur100 #000000@40% + x0 y0 blur1 #000000@80%; Inactive shadows x0 y16 blur32 #000000@20% + x0 y0 blur1 #000000@80%; corners 16.

In the 600×300 `Window BG (with Sidebar)` components that have panes (Active and Inactive, in each appearance), the `Sidebar/Background` style sits on the Left Pane itself, with `stack v gap0 pad8,8,8,8`. The other two components with that name in each appearance use the `No Sidebar` window style and have no panes.

### Sidebar list (Examples)

| Layer | Value |
|---|---|
| Component | 256 wide; Large 974, Medium 816, Small 648 tall; `corners 0`; no fill, border, shadow or blur |
| Auto layout | `stack v gap0 pad0,14,16,14` (top 0, trailing 14, bottom 16, leading 14) |
| `group "Section"` | 228 wide @14,y; `stack v gap0 pad0,0,14,0` (header then rows, 14 below) |
| Content width | 228 (derived: 256 − 14 − 14) |
| Gap between sections | 14 (derived: the Section's bottom padding; sections themselves have gap 0) |
| Rows in a Section | `use "Items" 228×H` at x 0, stacked with no gap from y = header height |
| Header in a Section | `use "Header" 228×20` (Large) or 228×18 (Medium, Small) at @0,0 |

Section order, top to bottom, with each section's y in the list:

| Section (header text) | Contents | Large y | Medium y | Small y |
|---|---|---|---|---|
| Opened Section (Small Dark/Light: "Favorites") | Basic Row; Basic Row w/ Count (symbol 􀋂 U+1002C2, detail "64"); Basic Row (symbol 􀐫 U+10042B) | 0 | 0 | 0 |
| Closed Section | header only | 154 | 128 | 104 |
| Closed Section w/ Count | header only, detail "8" | 188 | 160 | 136 |
| Section w/ Hierarchy | Parent Closed (detail "20"), Parent Opened, Child Opened (L1), Childless Child (L2, "16"), Non-Parent ("9"), Closed Parent ("3") | 222 | 192 | 168 |
| Section w/ Deep Nesting | Parent (L0), Child L1, L2, L3, L4 ("16" on L2–L4) | 496 | 416 | 320 |
| Section w/ Icons | one Item row with an image | 730 | 608 | 472 |
| Section w/ Icons | Parent Opened (L0), Child Opened (L1), Non-Parent (L0), all with images | 804 | 672 | 528 |

Which row is selected: in Dark examples, "Basic Row w/ Count"; in Light examples, the first "Basic Row".

### Row (Folders and Items)

Each row master is 240 wide (instanced at 228 in the examples), `fill #FFFFFF` on the master, `stack h pad0,2,0,L` where L is the indent below.

| Layer | Folder rows | Item rows |
|---|---|---|
| `rect "Background"` (Selected only) | 248×H @-4,0, corners 8 | same |
| `group "Leading"` (stack h gap4) | [`Disclosure`] + `Symbol` + `text "Title"` | `Leading - Icon` + `text "Title"` |
| `group "Trailing"` | `use "Trailing - Detail"` → `􀻃/{Size}/L1/Trailing/Details` | same |

Indent (the row's left padding = `Leading` x):

| Row | Leading x | Disclosure | Leading part used |
|---|---|---|---|
| Folders Level 0 | 0 | `L1/Leading/Disclosure/Open` @0 | `L1/Leading/Folder` |
| Folders Level 1 | 12 | yes @0 | `L1+/Leading/Folder` |
| Folders Level 2 | 24 | yes @0 | `L1+/Leading/Folder` |
| Folders Level 3 | 36 | yes @0 | `L1+/Leading/Folder` |
| Folders Level 4 | 64 | none | `L1+/Leading/Folder` @0 |
| Items Level 0 | 14 | none | `L1/Leading/Symbol` (layer `Leading - Icon`) @0 |

Positions inside `Leading`, by size (checked across all appearances and states):

| Size | Disclosure | Symbol (Levels 0–3) | Title (Levels 0–3) | Symbol / Title (Level 4) | Icon / Title (Items) | Leading width (Folders L0–3 / L4 / Items) |
|---|---|---|---|---|---|---|
| Large | 16×40 @0 | 24×40 @20 | 31×20 @48,10 | 24×40 @0 / @28,10 | 24×40 @0 / 30×20 @28,10 | 79 / 59 / 58 |
| Medium | 16×32 @0 | 20×32 @20 | 28×16 @44,8 | 20×32 @0 / @24,8 | 20×32 @0 / 27×16 @24,8 | 72 / 52 / 51 |
| Small | 12×24 @0 | 16×24 @16 | 24×14 @36,5 | 16×24 @0 / @20,5 | 16×24 @0 / 24×14 @20,5 | 60 / 44 / 44 |

Derived title x inside the 240 row (Leading x + Title x):

| Size | L0 | L1 | L2 | L3 | L4 | Items |
|---|---|---|---|---|---|---|
| Large | 48 | 60 | 72 | 84 | 92 | 42 |
| Medium | 44 | 56 | 68 | 80 | 88 | 38 |
| Small | 36 | 48 | 60 | 72 | 84 | 34 |

Derived: Levels 0–3 step 12 points each; Level 4 drops the disclosure and sets its symbol at x 64.

Trailing: Large 41×40 @197, Medium 36×32 @202, Small 32×24 @206. Derived: each ends at x 238, 2 from the row's right edge (the row's right padding).

### Row parts (􀻃)

| Part | Large | Medium | Small |
|---|---|---|---|
| `L1/Leading/Disclosure/{Open,Closed}` | 16×40; text 16×40 @0,0 | 16×32; text 16×32 @0,0 | 12×24; text 16×24 @-4,0 |
| `L1+/Leading/Disclosure/{Open,Closed}` | same as L1 | same as L1 | same as L1 |
| `L1/Leading/Folder` | 24×40; text 28×40 @-4,0, 􀈕 | 20×32; text 24×32 @-4,0 | 16×24; text 24×24 @-6,0 |
| `L1+/Leading/Folder` | 24×40; text 24×40 @-2,0 | 20×32; text 20×32 @-2,0 | 16×24; text 20×16 @-4,4 |
| `L1/Leading/Symbol` | 24×40; text 28×40 @-4,0, 􀈷 | 20×32; text 24×32 @-4,0 | 16×24; text 24×16 @-6,4 |
| `L1+/Leading/Symbol` | 24×40; text 24×40 @-2,0 | 20×32; text 20×32 @-2,0 | 16×24; text 20×16 @-4,4 |
| `L1/Leading/Image` | 24×40; `rect "Icon"` 20×20 @0,10, corners 5 | 20×32; 18×18 @-1,7, corners 4 | 16×24; 14×14 @-1,5, corners 3 |
| `L1+/Leading/Image` | 24×40; 18×18 @1,11, corners 4 | 20×32; 16×16 @0,8, corners 4 | 16×24; 12×12 @0,6, corners 3 |
| `{L1,L1+}/Trailing/Details` | 41×40, stack pad10,0,10,0; text 41×20 @0,10 | 36×32, pad8,0,8,0; text 36×16 @0,8 | 32×24, pad5,0,5,0; text 32×14 @0,5 |

Glyphs: Disclosure Open 􀆈 (U+100188), Closed 􀆊 (U+10018A); Folder 􀈕 (U+100215); Symbol 􀈷 (U+100237). All image corners use smoothing 0.6.

### Section header

| Layer | Large | Medium | Small |
|---|---|---|---|
| Component | 240×20, stack h gap44 pad2,0,2,0 | 240×18, stack h gap63 pad2,0,2,0 | 240×18, gap63 pad2,0,2,0 |
| `text "Title"` | 107×16 @0,2, "Section Heading" | 92×14 @0,2 | 92×14 @0,2 |
| `group "Stack"` (stack h gap1), Dark | 57×16 @183,2: `Detail` 36×16 @0 + `Disclosure` 20×16 @37 → `Headers - Trailing/Submenu/Closed` | 53×14 @187,2: `Detail` 32×14 @0 + `Disclosure` 20×14 @33 | same as Medium |
| `group "Stack"`, Light | 36×16 @204,2: `Detail` only | 32×14 @208,2: `Detail` only | same as Medium |

Header parts: `Submenu/{Open,Closed}` Large 20×16 (text 20×16), Medium and Small 20×14 (text 20×14); `Details` Large 36×16, Medium and Small 32×14, all `stack h gap0 pad0`. Derived: the header title starts at the Section's x 0, which is x 14 in the 256 sidebar, the same leading edge as the rows.

The examples override every open header with `swap→Sidebars/{A}/􀻃/Small/Headers - Trailing/Submenu/Open`, including Large and Medium headers.

### Window Controls + Disclosure

| Component | Size, layout | Window Controls | Sidebar Toggle |
|---|---|---|---|
| `…/Monobar` | 200×40, stack h gap15 pad0,8,0,12 | 60×14 @12,13 → `Titlebars/{A}/Window Controls/Standard/Active` | 24×24 @168,8 → `Titlebars and Toolbars/{A}/Medium/Buttons/Active/1`, text 􀏚 (U+1003DA) |
| `…/Default` | 200×52, stack h gap15 pad0,8,0,19 | 60×14 @19,19 → same | 40×38 @152,7 → `Titlebars and Toolbars/{A}/XL/Buttons/Active/1`, text 􀏚 |

Derived: the toggle ends 8 from the component's right edge in both (168 + 24 = 192; 152 + 40 = 192; 200 − 192 = 8).

## Sizes

### Rows

| Size | Row H | Master W (instance W) | Selection `Background` | Leading gap | Title frame (Levels 0–3) | Symbol glyph | Image L1 / L1+ | Disclosure frame | Detail frame | Text style on title |
|---|---|---|---|---|---|---|---|---|---|---|
| Large | 40 | 240 (228) | 248×40 @-4,0, radius 8 | 4 | 31×20 @48,10 | SFPro-Medium 15 lh20 | 20×20 r5 / 18×18 r4 | 16×40 | 41×20, pad 10 top/bottom | `04 Title3/Default` |
| Medium | 32 | 240 (228) | 248×32 @-4,0, radius 8 | 4 | 28×16 @44,8 | SFPro-Medium 13 lh16 | 18×18 r4 / 16×16 r4 | 16×32 | 36×16, pad 8 | `06 Body/Default` |
| Small | 24 | 240 (228) | 248×24 @-4,0, radius 8 | 4 | 24×14 @36,5 | SFPro-Medium 11 lh16 | 14×14 r3 / 12×12 r3 | 12×24 | 32×14, pad 5 | `08 Subheadline/Default` |

Derived: the selection highlight overhangs the row master by 4 on each side (−4 left; 248 − 240 − 4 = 4 right). In the 256 sidebar, where rows sit at x 14 and are 228 wide, the highlight would run from x 10 to x 246, 10 from each sidebar edge and 236 wide, if the `Background` keeps that 4-point overhang when the row is resized. The kit stores only the 240-wide master.

### Sections and headers

| Size | Header H | Header padding (T,R,B,L) | Header title frame | Section bottom padding | Closed section height |
|---|---|---|---|---|---|
| Large | 20 | 2,0,2,0 | 107×16 @0,2 | 14 | 34 |
| Medium | 18 | 2,0,2,0 | 92×14 @0,2 | 14 | 32 |
| Small | 18 | 2,0,2,0 | 92×14 @0,2 | 14 | 32 |

### Sidebar list

| Size | Width | Height (as drawn) | Padding T,R,B,L | Content width |
|---|---|---|---|---|
| Large | 256 | 974 | 0,14,16,14 | 228 |
| Medium | 256 | 816 | 0,14,16,14 | 228 |
| Small | 256 | 648 | 0,14,16,14 | 228 |

## Colours and states

### Rows — Dark (all text layers use blend plus-lighter)

| State | Background | Title | Symbol / Folder | Disclosure | Detail | Layer opacity |
|---|---|---|---|---|---|---|
| Default | none | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #0A99FF {System Colors/Dark (use plus lighter)/8 Blue} | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary} | — |
| Selected | `Background` fill #FFFFFF@11%, layer opacity 50%, corners 8 | same | same | same | same | — |
| Disabled | none | same | same | same | same | `Leading` and `Trailing` groups 50.05% |

### Rows — Light (all text layers use blend plus-darker)

| State | Background | Title | Symbol / Folder | Disclosure | Detail | Layer opacity |
|---|---|---|---|---|---|---|
| Default | none | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary} | — |
| Selected | `Background` fill #000000@11%, layer opacity 50%, corners 8 | same | same | same | same | — |
| Disabled | none | same | same | same | same | `Leading` and `Trailing` groups 50.05% |

Checked across all 108 row components: the title colour is the same in every state of an appearance, and the Selected rows use the same symbol parts as Default. Selection is a neutral fill, not the accent colour. Derived: the selection's effective alpha is 5.5% (11% fill × 50% layer opacity).

### Window state (Active and Inactive examples)

| Appearance | Difference between `Examples/Inactive/*` and `Examples/Active/*` |
|---|---|
| Light | Inactive adds `fillColor→#737373 {Labels/Light Vibrant (use plus darker)/2 Secondary}` on the selected row instance (the dump doesn't say which layer it targets). Nothing else changes. |
| Dark | No colour override. The only difference is that the Active Large and Medium examples swap a Light disclosure part into "Parent Closed". |

In windows the material changes with window state (see the `Sidebar/Background` table under Anatomy).

### Section header

| Part | Dark (plus-lighter) | Light (plus-darker) |
|---|---|---|
| Title | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} |
| Detail | #8A8A8A {…/2 Secondary} | #737373 {…/2 Secondary} |
| Disclosure (􀆈 / 􀆊) | #4C4C4C {…/3 Tertiary} | #B2B2B2 {…/3 Tertiary} |

## Text

No sidebar text layer has tracking (no `kern` on this page). Fonts are PostScript names.

| Part | Large | Medium | Small | Text style named on the layer | Align |
|---|---|---|---|---|---|
| Folder row title | SFPro-Medium 15 lh20 | SFPro-Medium 13 lh16 | SFPro-Medium 11 lh14 | `04 Title3/Default` / `06 Body/Default` / `08 Subheadline/Default` | left |
| Item row title | SFPro-Regular 15 lh20 | SFPro-Regular 13 lh16 | SFPro-Medium 11 lh14 | same as above | left |
| Row detail ("Detail") | SFPro-Medium 15 lh20 | SFPro-Medium 13 lh16 | SFPro-Medium 11 lh14 | none | right |
| Row symbol / folder glyph | SFPro-Medium 15 lh20 | SFPro-Medium 13 lh16 | SFPro-Medium 11 lh16 | none | center |
| Row disclosure glyph | SFPro-Bold 11 lh18 | SFPro-Bold 11 lh18 | SFPro-Bold 11 lh18 | none | center |
| Header title ("Section Heading") | SFPro-Bold 13 lh16 | SFPro-Bold 11 lh14 | SFPro-Bold 11 lh14 | none | left |
| Header detail | SFPro-Medium 13 lh16 | SFPro-Medium 11 lh14 | SFPro-Medium 11 lh14 | none | right |
| Header disclosure glyph | SFPro-Bold 13 lh16 | SFPro-Bold 11 lh18 | SFPro-Bold 11 lh18 | `05 Headline/Default` (Large only) | center |

The shared styles define `04 Title3/Default` as SFPro-Regular 15/20, `06 Body/Default` as SFPro-Regular 13/16 and `08 Subheadline/Default` as SFPro-Regular 11/14 (`text-styles.md`). Folder rows at every size, and Item rows at Small, set the weight to Medium over those styles.

## Effects

| Where | Effect |
|---|---|
| All sidebar text and glyphs | blend plus-lighter (Dark) / plus-darker (Light) |
| Selected row | `rect "Background"` fill #FFFFFF@11% (Dark) / #000000@11% (Light), layer opacity 50%, corners 8 smoothing 0.6 |
| Disabled row | `Leading` and `Trailing` group opacity 50.05% |
| Sidebar components | no shadows, inner shadows, blurs or glass |
| Sidebar pane in windows | background blur from `Sidebar/Background/*` (table under Anatomy); no shadow |

## Kit notes

- The page has no documentation boards. Its only free text is the page labels "Sidebar" with "Dark" or "Light" (SFPro-Bold 60).
- The example lists act as Apple's usage guide: open and closed sections, a closed section showing a count in the header detail, parents with open and closed disclosures, children up to Level 4, a row with a count ("64"), and rows with images instead of symbols.
- Open sections use the open header chevron (􀆈) and closed sections keep the closed one (􀆊). Closed parents swap in `Disclosure/Closed`.
- Counts sit in the row's trailing `Detail` text.
- The kit's change log (`specs/change-log.txt`) lists "Updated appearance of windown controls" under 27.0.2; the sidebar's `Window Controls + Disclosure` components use those controls.

## Finding it in the spec

| Family | grep pattern on `specs/sidebars.txt` |
|---|---|
| Examples | `grep -n '^COMPONENT "Sidebars/[A-Za-z]*/Examples/'` |
| Folder rows | `grep -n '^COMPONENT "Sidebars/[A-Za-z]*/[A-Za-z]*/Folders/'` |
| Item rows | `grep -n '^COMPONENT "Sidebars/[A-Za-z]*/[A-Za-z]*/Items/'` |
| Selected highlight | `grep -n 'rect "Background"'` |
| Section headers | `grep -n '^COMPONENT "Sidebars/[A-Za-z]*/[A-Za-z]*/Header"'` |
| Row parts | `grep -n '^COMPONENT "Sidebars/[A-Za-z]*/􀻃/[A-Za-z]*/L1'` |
| Header parts | `grep -n 'Headers - Trailing'` |
| Window controls + toggle | `grep -n -A2 'Window Controls + Disclosure'` |
| Sidebar in windows (`specs/windows.txt`) | `grep -n -e 'Left Pane' -e 'use "Sidebar"' -e 'Sidebar/Background' -e 'Sidebar Toggle' specs/windows.txt` |
