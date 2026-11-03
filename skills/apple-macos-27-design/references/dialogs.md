# Dialogs — macOS 27

**Read when:** you need an exact macOS 27 value for dialogs (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Dialogs in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, text, effects.

Source: `specs/dialogs.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

One family, `Dialogs/Save Dialog <Appearance>`, appearance `Light` or `Dark`. 2 components, each a full desktop (1512 × 993) with one collapsed Save dialog on it.

| Component | Size |
|---|---|
| `Dialogs/Save Dialog Light` | 1512 × 993 |
| `Dialogs/Save Dialog Dark` | 1512 × 993 |

The page has no documentation boards; its only free text layers are the page title ("Dialogs") and the "Light" / "Dark" headings. There is no expanded Save dialog and no Open dialog.

## Anatomy

| Layer | Kind | Size | Position | Notes |
|---|---|---|---|---|
| `Wallpaper` | use → `Wallpaper/Light` / `Wallpaper/Dark` | 1512×993 | @0,0 | |
| `Menu Bar` | use → `Menu Bar/Over Dark Wallpaper` | 1512×45 | @0,0 | both appearances |
| `Save Dialog - Collapsed` | group | 390×318 | @561,337.5 | window style, `stack v gap20 pad20,20,20,20` |
| ↳ `Center` | group, `stack h gap8 pad0,20,0,0` | 350×80 | @20,20 | message area |
| ↳↳ `Blank` | rect (no fill) | 92×69 | @0,5.5 | empty slot left of the text |
| ↳↳ `Title and Description` | group, `stack v gap6` | 230×80 | @100,0 | |
| ↳↳↳ `Do you want to keep` | text | 230×32 | @0,0 | "Do you want to keep this new document “Untitled”?" |
| ↳↳↳ `You can choose to sa` | text | 230×42 | @0,38 | "You can choose to save your changes, or delete this document immediately. You ca…" |
| ↳ `Stack` | group, `stack v gap12 pad0,20,2,0` | 350×134 | @20,120 | form rows |
| ↳↳ `Save As` | row 330×24 @0,0 | | | label "Save As:" · `Field` 230×24 @100,0 → `Text Fields/<A>/3 Rg/Value + Typing` (text "Untitled") |
| ↳↳ `Tags` | row 330×24 @0,36 | | | label "Tags:" · `Field` 230×24 @100,0 → `Text Fields/<A>/3 Rg/Empty` |
| ↳↳ `File Format` | row 330×24 @0,72 | | | label "File Format:" · `Pop-up Button` 230×24 @100,0 → `Pop-up Buttons/<A>/Content Area/3 Rg/1 - Idle` (text "Rich Text Document") |
| ↳↳ `Where` | row 330×24 @0,108 | | | label "Where:" · group `Pop-up and Disclosure` 230×24 @100,0: `Pop-up Button` 198×24 @0,0 (text "Desktop") + `Disclosure Button` 24×24 @206,0 → `Disclosure Buttons/<A>/Content Area/3 Rg/Down, 1 - Idle` |
| ↳ `Buttons` | group, `stack h gap8` | 350×24 | @20,274 | |
| ↳↳ `Push Button` (Delete) | use | 76×24 | @0,0 | see the button table |
| ↳↳ `Buttons` | group, `stack h gap8` | 266×24 | @84,0 | `Push Button` Cancel 76×24 @106,0 · `Push Button` Save 76×24 @190,0 |

Each row is `stack h gap8`; its label is a 92×24 text at @0,0, right-aligned. Every nested control instance carries `corners 6 smoothing0.6 style1`. `<A>` is the appearance.

Push buttons, as stored:

| Button | Light dialog | Dark dialog |
|---|---|---|
| Delete | `Buttons/Light/Over-glass/Bordered Destructive/3 Rg/Active, Off, 1 Idle` | `Buttons/Dark/Content Area/Bordered Destructive/3 Rg/Active, Off, 1 Idle` |
| Cancel | `Buttons/Light/Content Area/Bordered/3 Rg/Active, Off, 1 Idle` | `Buttons/Dark/Content Area/Bordered/3 Rg/Active, Off, 1 Idle` |
| Save | `Buttons/Light/Content Area/Bordered Default/3 Rg/Active, Off, 1 Idle` | `Buttons/Light/Content Area/Bordered Default/3 Rg/Active, Off, 1 Idle` (the Light master) |

Those controls are documented on their own pages (`specs/buttons.txt`, `specs/text-fields.txt`, `specs/pop-up-and-pull-down-buttons.txt`, `specs/disclosure-controls.txt`).

## Sizes

| Property | Value |
|---|---|
| Dialog size | 390 × 318 |
| Corner radius | 26 (the window style's 16 is overridden) |
| Padding | 20 on all sides |
| Gap between sections | 20 |
| Placement | derived: centred on the 1512 × 993 screen ((1512 − 390) / 2 = 561, (993 − 318) / 2 = 337.5) |
| Label column | 92 wide, right-aligned; control column starts at x 100 (derived: 92 + gap 8) |
| Control width | 230 (Where pop-up 198 + gap 8 + disclosure 24) |
| Row height / row gap | 24 / 12 (rows at y 0, 36, 72, 108) |
| Form right inset | 20 (stack padding right) |
| Message block | text column 230 wide at x 100, title 230×32, gap 6, description 230×42 |
| Push buttons | 76 × 24, gap 8; Delete at the leading edge, Cancel and Save at the trailing edge |
| Height check | derived: 20 + 80 + 20 + 134 + 20 + 24 + 20 = 318 |

## Colours and states

| Appearance | Part | Value |
|---|---|---|
| Light | Dialog background | style `Windows/Light/No Sidebar/Active`: fill #FFFFFF {Window Backgrounds/Light Background} |
| Light | Title, description | #000000@85% {Labels/Light/1 Primary} |
| Light | Row labels | #000000@50% {Labels/Light/2 Secondary} |
| Dark | Dialog background | style `Windows/Dark/No Sidebar/Active`: fill #1E1E1E {Window Backgrounds/Dark Background} · border 1 inside #FFFFFF@20% |
| Dark | Title, description | #FFFFFF {Labels/Dark/1 Primary} |
| Dark | Row labels | #FFFFFF@55% {Labels/Dark/2 Secondary} |

No text in the dialog uses a blend mode. Only the active (key window) state is drawn.

## Text

| Part | Font | Size | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| Title ("Do you want to keep…") | SFPro-Bold | 14 | — (not stored) | — | left |
| Description | SFPro-Medium | 11 | 14 | −0.15 | left |
| Row labels ("Save As:" etc.) | SFPro-Regular | 13 | — (not stored) | — | right |

No layer is bound to a shared text style.

## Effects

| Appearance | Shadows (from the window style) |
|---|---|
| Light | shadow x0 y36 blur100 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% |
| Dark | shadow x0 y16 blur33 spread0 #000000@40% · shadow x0 y0 blur1 spread0 #000000@80% |

The dialog is an opaque window surface: no blur or glass.

The desktop frames carry a gradient fill under the wallpaper, `linear {-1.355686396475875e-15, 0}→{0.999999999999999, 0.98940625} [#CBABE2 0%, #9DC6EA 100%]`, in both the Light and the Dark component.

## Finding it in the spec

| Family | grep |
|---|---|
| Dialog desktops | `grep -n '^COMPONENT "Dialogs/' specs/dialogs.txt` |
| Dialog window | `grep -n 'Save Dialog - Collapsed' specs/dialogs.txt` |
| Nested controls | `grep -n 'use "\(Push Button\|Field\|Pop-up Button\|Disclosure Button\)"' specs/dialogs.txt` |
