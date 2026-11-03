# Titlebars and Toolbars: sizes, colours, text and effects — macOS 27

**Read when:** you need the sizes, colours, text and effects of titlebars and Toolbars on macOS 27, as Apple's kit draws them.
**Owns:** Titlebars and Toolbars in Apple's macOS 27 kit: sizes, colours and states, text, effects, kit notes.

Source: `specs/titlebars-and-toolbars.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `titlebars-and-toolbars.md`.

## Sizes

### Toolbar items

| Item | XL | Medium |
|---|---|---|
| Height | 36 | 24 |
| Container corner radius | max (capsule, from the glass style) | max |
| Single button | 36 × 36 | 24 × 24 |
| Button group, n = 1…6 | 36, 73, 110, 147, 184, 221 wide | 24, 48, 72, 96, 120, 144 wide |
| Button group width rule | derived: 8 + 28n + 9(n − 1) | derived: 4 + 20n + 4(n − 1) |
| Inner button | 28 × 28, corners max | 20 × 20, corners 100 (Selected: 12) |
| Inset of inner buttons | 4 | 2 |
| Gap between inner buttons | 9 | 4 |
| Segmented control, n = 2…6 | 74, 108, 142, 176, 210 wide | 54, 80, 106, 132, 158 wide |
| Segmented width rule | derived: 8 + 32n + 2(n − 1) | derived: 4 + 24n + 2(n − 1) |
| Segment | 32 × 28, corners max, padding 6.5 / 6 | 24 × 20, corners 100 (Selected: 12), padding 4 |
| Separator | 2 × 22 instance (line 0.1 wide) | 2 × 16 |
| Search field | 159 × 36 | 149 × 24 |
| Search padding / gap | 10 / 6 | 6 / 4 |
| Search text x | 32 (derived: 10 + 16 + 6) | 26 (derived: 6 + 16 + 4) |
| Caret | 2 × 18, corners 1 | 2 × 18, corners 1 |
| Clear Search | 12 × 15 | 12 × 15 |
| Pop-up | 62 × 36 (derived: 8 + 34 + 2 + 10 + 8) | 62 × 24 |
| Pull-down | 50 × 36 (derived: 8 + 20 + 2 + 12 + 8) | 43 × 24 (derived: 8 + 15 + 2 + 10 + 8) |
| Item padding (pop-up, pull-down) | 8 left and right, gap 2 | same |
| Glyph font size | 13 | 10 (search and pop-up glyphs stay 13) |
| Search field minimum or maximum width | Not in the kit | Not in the kit |

### Window controls, titles and panel bars

| Part | Value |
|---|---|
| Window control button | 14 × 14 circle |
| Window control spacing | 9 between buttons (centre-to-centre 23, derived) |
| Window controls group | 68 × 14 including 8 trailing padding |
| Utility panel control button | 10 × 10, spacing 7 (centre-to-centre 17, derived) |
| Window title block | 112 × 30 (no sidebar), 113 × 30 (with sidebar) |
| Title symbol → text gap | 3 (symbol 17 wide, text at x 20) |
| Title → subtitle gap | 2 (subtitle at y 17) |
| Utility panel bar with tabs | 280 × 56 (derived: 7 + 12 + 4 + 28 + 5 = 56) |
| Utility panel titlebar | 280 × 24 |
| Tab bar | 220 × 30; tab buttons 44 wide |
| Selected tab corner radius | 9 |
| Toolbar heights (32, 33, 40, 52, 76, 77) | see `windows.md` |

## Colours and states

### Toolbar item containers (all sizes, all toolbar families)

| Appearance | Active window | Inactive window |
|---|---|---|
| Light | `Liquid Glass/Light/Regular - Small` | `Liquid Glass/Light/Regular - Small - Inactive` |
| Dark | `Liquid Glass/Dark/Regular - Small` | `Liquid Glass/Dark/Regular - Small - Inactive` |

The containers use these styles unchanged; the only addition on any of the 304 toolbar item masters is one stray border (see Kit notes). Disabled items keep their window state's style; only the glyph colour changes. Pop-up and pull-down `Clicked` masters are identical to `Idle` in the dump (checked for all 16 pairs), so a pressed look is Not in the kit.

### Glyphs and labels (button-group buttons, segments, pop-ups, pull-downs)

| Appearance | Window state | Default / Idle / Clicked | Selected | Disabled | Blend |
|---|---|---|---|---|---|
| Light | Active | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #363636 | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary} | plus-darker |
| Light | Inactive | #B2B2B2 {…/3 Tertiary} | #B2B2B2 | #D9D9D9 {Labels/Light Vibrant (use plus darker)/4 Quaternary} | plus-darker |
| Dark | Active | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #FFFFFF@96% | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary} | plus-lighter |
| Dark | Inactive | #4C4C4C {…/3 Tertiary} | #4C4C4C | #262626 {Labels/Dark Vibrant (use plus lighter)/4 Quaternary} | plus-lighter |

### Selected background (button-group buttons and segments)

| Appearance | Fill | Layer blend | Corners |
|---|---|---|---|
| Light | #000000@7% {Fills/Light Vibrant (use plus darker)/2 Secondary} | plus-darker | max (XL), 12 (Medium) |
| Dark | #FFFFFF@8% {Fills/Dark Vibrant (use plus lighter)/2 Secondary} | plus-darker, as stored | max (XL), 12 (Medium) |

Default and Disabled items have no fill.

### Separators

| Master | Line fill | Blend |
|---|---|---|
| Light Active | #000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary} | fill plus-darker |
| Light Inactive | same | fill plus-darker, line layer plus-darker |
| Dark Active | #FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary} | line layer plus-lighter |
| Dark Inactive | same | fill plus-lighter, master plus-lighter |

### Search field

Active and Inactive windows use the same text colours; only the container glass and the caret differ.

| Field state | Glyph 􀊫 | Text | Caret | Clear |
|---|---|---|---|---|
| Placeholder | Secondary | placeholder "Search", Secondary | — | — |
| Focused | Secondary | none | Active only: System Blue | — |
| Typing | Secondary | "Search term", Primary | Active only: System Blue, after the text | ✓ |
| Value | Secondary | "Search term", Primary | — | ✓ |
| Placeholder + Disabled | Tertiary | "Search", Tertiary | — | — |
| Value + Disabled | Tertiary | Tertiary | — | ✓ |

| Token | Light | Dark |
|---|---|---|
| Primary | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} |
| Secondary | #737373 {…/2 Secondary} | #8A8A8A {…/2 Secondary} |
| Tertiary | #B2B2B2 {…/3 Tertiary} | #4C4C4C {…/3 Tertiary} |
| Caret | #0088FF {System Colors/Light/8 Blue} | #0091FF {System Colors/Dark/8 Blue} |
| Clear Search glyph | #737373 {Labels/Light Vibrant (use plus darker)/2 Secondary}, plus-darker | #8A8A8A {Labels/Dark Vibrant (use plus lighter)/2 Secondary}, plus-lighter |

The Clear glyph keeps the Secondary colour in `Value + Disabled` (it's the shared master).

### Window controls

| Appearance | State | Close | Minimize | Expand |
|---|---|---|---|---|
| Light | Active | #FA9891 | #FFDA66 | #ADE392 |
| Light | Inactive | #6C7680@5% | #6C7680@5% | #6C7680@5% |
| Dark | Active | #F06E6A | #FFCD30 | #58C73B |
| Dark | Inactive | #3A3A3A | #3A3A3A | #3A3A3A |

Utility panel controls use the same fills at 10 × 10, with two extra states:

| Master | Close | Minimize | Expand |
|---|---|---|---|
| Light `Stoplights/Active` | #FA9891 | #FFDA66 | #ADE392 |
| Light `Stoplights/Active - Minimize Enabled` | #FA9891 | #6C7680@5% (grey) | #ADE392 |
| Light `Stoplights/Inactive`, `Inactive - Minimize Enabled` | #6C7680@5% | #6C7680@5% | #6C7680@5% |
| Dark `Panel/Active` | #F06E6A | #FFCD30 | #58C73B |
| Dark `Panel/Active - Minimize Enabled` | #F06E6A | #FFFFFF@17% · inner-shadow x0 y0 blur0 spread0.5 #FFFFFF@3% (plus-lighter) | #58C73B |
| Dark `Panel/Inactive`, `Inactive - Minimize Enabled` | #3A3A3A | #3A3A3A | #3A3A3A |

None of the window-control fills is bound to a swatch.

### Window title

| Appearance | State | Title and symbol | Subtitle and "— Edited" | Blend |
|---|---|---|---|---|
| Light | Active | #363636 {Labels/Light Vibrant (use plus darker)/1 Primary} | #B2B2B2 {…/3 Tertiary} | plus-darker |
| Light | Inactive | #B2B2B2 {…/3 Tertiary} | #B2B2B2 | plus-darker |
| Dark | Active | #FFFFFF@96% {Labels/Dark Vibrant (use plus lighter)/1 Primary} | #4C4C4C {…/3 Tertiary} | plus-lighter |
| Dark | Inactive | #4C4C4C {…/3 Tertiary} | #4C4C4C | plus-lighter |

### Utility panel bars and tabs

| Appearance | Part | Active | Inactive |
|---|---|---|---|
| Light | Bar border | 1 outside #3C3C43@12% | same |
| Light | Title | #363636 {…/1 Primary}, plus-darker | #B2B2B2 {…/3 Tertiary}, plus-darker |
| Dark | Bar border | 1 outside #3C3C43@12% | same |
| Dark | Title (`Titlebar`) | #FFFFFF@96% {…/1 Primary}, plus-lighter | #4C4C4C {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}, plus-lighter |
| Dark | Title (`Toolbar with Tabs`) | #FFFFFF@96%, plus-lighter | #B2B2B2 {Labels/Light Vibrant (use plus darker)/3 Tertiary}, plus-lighter, as stored |
| Light | Selected tab | style `Liquid Glass/Light/Regular - Small`, corners 9 | (one tab bar master for both states) |
| Dark | Selected tab | style `Liquid Glass/Dark/Regular - Small`, corners 9 | |

The utility panel title texts (`Title + Symbol`, `Title Only`) are #363636 (Light) and #FFFFFF@96% (Dark), the Primary vibrant labels.

## Text

| Part | Font | Size | Line height | Tracking | Alignment |
|---|---|---|---|---|---|
| Window title, no sidebar | SFPro-Bold | 13 | 15 | — | left (not stored on the Active masters) |
| Window title, with sidebar | SFPro-Bold | 15 | 15 | −0.2 (none on Dark Active) | left (not stored on Light Active) |
| Window title symbol 􀈕 | SFPro-Semibold | 15 | 15 | — | center |
| Subtitle, "— Edited" | SFPro-Medium | 11 | — | — | left |
| Utility panel title | SFPro-Medium | 11 | — | — | center |
| Utility panel title symbol 􀈕 | SFPro-Medium | 11 | — | — | center |
| XL button and segment glyph 􀓞 | SFPro-Medium | 13 | — | — | center |
| Medium button and segment glyph 􀓞 | SFPro-Semibold | 10 | — | — | center |
| Search glyph 􀊫 (both sizes) | SFPro-Medium | 13 | — | — | center |
| Search placeholder and value (both sizes) | SFPro-Medium | 13 | — | — | left |
| Clear Search 􀁡 | SFProRounded-Medium | 13 | 15 | — | center |
| Pop-up label (both sizes) | SFPro-Medium | 13 | — | — | left |
| Pop-up chevron 􀆏 (both sizes) | SFPro-Semibold | 13 | — | — | center |
| Pull-down glyph 􀓔 | SFPro-Medium | 13 (XL), 10 (Medium) | — | — | left |
| Pull-down chevron 􀆈 | SFPro-Bold | 13 (XL), 10 (Medium) | — | — | center |

No layer on this page is bound to a shared text style.

## Effects

### Toolbar item glass

**`Liquid Glass/Light/Regular - Small`** (Light, Active window)

- fill #000000@25% + #FFFFFF@25% + #444444@60% (blend plus-lighter) + #F8F8F8@20% (blend luminosity)
- inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
- inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
- inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
- inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
- inner-shadow x0 y-1 blur0 spread0 #171717 (blend plus-lighter)
- inner-shadow x0 y1 blur0 spread0 #171717 (blend plus-lighter)
- inner-shadow x0 y40 blur30 spread-40 #E6E6E6 (blend plus-darker)
- inner-shadow x0 y-40 blur10 spread-40 #282828 (blend plus-lighter)
- inner-shadow x0 y40 blur10 spread-40 #282828 (blend plus-lighter)
- shadow x0 y8 blur15 spread0 #000000@2%
- shadow x0 y0 blur0 spread0.5 #DBDBDB (blend plus-darker)
- shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
- blur glass radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0
- corners max smoothing0.6 style1

**`Liquid Glass/Light/Regular - Small - Inactive`** (Light, Inactive window): no glass blur.

- fill #000000@2% {Fills/Light/5 Quinary}
- shadow x0 y0 blur0 spread0.5 #EBEBEB (blend plus-darker)
- shadow x-0.75 y0 blur0 spread-0.25 #F2F2F2 (blend plus-darker)
- shadow x0.75 y0 blur0 spread-0.25 #F2F2F2 (blend plus-darker)
- corners max smoothing0.6 style1

**`Liquid Glass/Dark/Regular - Small`** (Dark, Active window)

- fill #000000 (blend screen) + #999999@17%
- inner-shadow x20 y0 blur20 spread-30 #B2B2B2 (blend plus-darker)
- inner-shadow x-20 y0 blur20 spread-30 #B2B2B2 (blend plus-darker)
- inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
- inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
- inner-shadow x0 y-1 blur0 spread0 #171717 (blend plus-lighter)
- inner-shadow x0 y1 blur0 spread0 #171717 (blend plus-lighter)
- shadow x0 y8 blur15 spread0 #000000@4%
- shadow x0 y0 blur0 spread0.5 #A6A6A6 (blend plus-darker)
- shadow x-1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
- shadow x1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
- inner-shadow x0 y-40 blur10 spread-40 #1A1A1A (blend plus-lighter)
- inner-shadow x0 y40 blur10 spread-40 #1A1A1A (blend plus-lighter)
- blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0
- corners max smoothing0.6 style1

**`Liquid Glass/Dark/Regular - Small - Inactive`** (Dark, Inactive window): no glass blur.

- fill #FFFFFF@5% {Fills/Dark/3 Tertiary}
- shadow x0 y0 blur0 spread0.5 #E6E6E6 (blend plus-darker)
- shadow x-1 y0 blur0 spread-0.5 #CCCCCC (blend plus-darker)
- shadow x1 y0 blur0 spread-0.5 #CCCCCC (blend plus-darker)
- corners max smoothing0.6 style1

### Bar background

The titlebar and toolbar components on this page draw no bar background. In the Windows page, bars sit over `Scroll Edge Effect/<A> - Top - Hard` (from `specs/kit.txt`):

| Appearance | Layers |
|---|---|
| Light | `Color` #FFFFFF {Window Backgrounds/Light Background}, opacity 85% · `Blur` border 0.67 inside #000000@5%, blur background radius6 saturation1 |
| Dark | `Color` #1E1E1E {Window Backgrounds/Dark Background}, opacity 55% · `Blur` border 0.67 inside #FFFFFF@10%, blur background radius6 saturation1 |

Utility panel bars draw only their `border 1 outside #3C3C43@12%`; the panel surface is `Panels/<A>` (see `windows.md`).

### Window controls

Each oval carries its own stack of effects, bottom first:

| Master | Effects on each coloured oval |
|---|---|
| Light Active, Close | inner-shadow x0 y11 blur9 spread-5 #000000@55% (blend overlay) · inner-shadow x0 y5 blur4 spread-5 #1A1A1A (blend plus-lighter) · inner-shadow x0 y0 blur1 spread0 #C40000@40% · inner-shadow x2 y0 blur0.25 spread-1.5 #C40000 · inner-shadow x-2 y0 blur0.25 spread-1.5 #C40000 · shadow x0 y1.5 blur1 spread0 #FA8178@15% |
| Light Active, Minimize | inner-shadow x0 y11 blur9 spread-5 #000000 (blend overlay) · inner-shadow x0 y5 blur4 spread-5 #0D0D0D (blend plus-lighter) · inner-shadow x0 y0 blur1 spread0 #9E0A00@40% · inner-shadow x2 y0 blur0.25 spread-1.5 #9E0A00 · inner-shadow x-2 y0 blur0.25 spread-1.5 #9E0A00 · shadow x0 y1.5 blur1 spread0 #FFD759@15% |
| Light Active, Expand | inner-shadow x0 y11 blur9 spread-5 #000000@94% (blend overlay) · inner-shadow x0 y5 blur4 spread-5 #0D0D0D (blend plus-lighter) · inner-shadow x0 y0 blur1 spread0 #005600@40% · inner-shadow x2 y0 blur0.25 spread-1.5 #005600 · inner-shadow x-2 y0 blur0.25 spread-1.5 #005600 · shadow x0 y1.5 blur1 spread0 #ADE392@15% |
| Light Inactive, all three | inner-shadow x0 y11 blur9 spread-5 #000000@5% · inner-shadow x0 y5 blur4 spread-5 #1F1F1F (blend plus-lighter) · inner-shadow x0 y0 blur1 spread0 #000000@20% · inner-shadow x2 y0 blur0.25 spread-1.5 #000000@20% · inner-shadow x-2 y0 blur0.25 spread-1.5 #000000@20% · shadow x0 y1.5 blur1 spread0 #6C7680@1% |
| Dark Active, Close | inner-shadow x0 y17 blur4 spread-10 #991F00@40% (blend overlay) · inner-shadow x0 y0 blur3 spread0 #991F00@60% (blend overlay) · inner-shadow x0 y5 blur4 spread-3 #262626 (blend plus-lighter) · inner-shadow x0 y-1.5 blur0.25 spread-1 #808080 (blend plus-lighter) · inner-shadow x0 y1.5 blur0.25 spread-1 #999999 (blend plus-lighter) |
| Dark Active, Minimize | inner-shadow x0 y17 blur4 spread-10 #4D2E0F (blend overlay) · inner-shadow x0 y0 blur3 spread0 #4C2E0F (blend overlay) · inner-shadow x0 y5 blur4 spread-3 #161616 (blend plus-lighter) · inner-shadow x0 y-1.5 blur0.25 spread-1 #808080 (blend plus-lighter) · inner-shadow x0 y1.5 blur0.25 spread-1 #999999 (blend plus-lighter) |
| Dark Active, Expand | inner-shadow x0 y17 blur4 spread-10 #113300@60% (blend overlay) · inner-shadow x0 y0 blur3 spread0 #113300@80% (blend overlay) · inner-shadow x0 y5 blur4 spread-3 #262626 (blend plus-lighter) · inner-shadow x0 y-1.5 blur0.25 spread-1 #808080 (blend plus-lighter) · inner-shadow x0 y1.5 blur0.25 spread-1 #999999 (blend plus-lighter) |
| Dark Inactive, all three | inner-shadow x0 y17 blur4 spread-10 #FFFFFF@15% (blend overlay) · inner-shadow x0 y-1.5 blur0.25 spread-1 #8C8C8C (blend plus-lighter) · inner-shadow x0 y1.5 blur0.25 spread-1 #999999 (blend plus-lighter) |

The 10 × 10 utility panel controls use the same effect lists as the 14 × 14 ones of their appearance and state.

### Blend modes on text

Light text and glyphs use plus-darker with the Light Vibrant label swatches; Dark text and glyphs use plus-lighter with the Dark Vibrant label swatches.

## Kit notes

There are no documentation boards on this page. Points from checking the variants that a builder should know:

- Segmented-control separators: the 6 masters that break the "hide the separators next to the selected segment" pattern are Light XL Inactive `3 Items/3 Selected`, `4 Items/1 Selected`, `4 Items/3 Selected` and `6 Items/5 Selected`, and Light and Dark Medium Inactive `6 Items/6 Selected` (in each, one separator next to the selected segment stays visible).
- Dark Medium Inactive segmented controls use `Separator - Active` in 26 of their 70 separator slots; Dark XL Inactive `3 Items/1 Selected`, `3 Items/2 Selected` and `4 Items/2 Selected` use the Light `Separator - Inactive`.
- Dark Medium Inactive `3 Items/1 Selected` alone carries `border 1 inside #979797` on its container.
- The utility panel `… - Minimize Enabled` masters show the minimize button grey, and the plain `Active` masters show it yellow.

## Finding it in the spec

| Family | grep |
|---|---|
| Toolbar buttons | `grep -n '^COMPONENT "Titlebars and Toolbars/\(Light\|Dark\)/\(XL\|Medium\)/Buttons/' specs/titlebars-and-toolbars.txt` |
| Segmented controls | `grep -n '^COMPONENT "Titlebars and Toolbars/.*/Segmented Control/' specs/titlebars-and-toolbars.txt` |
| Search fields | `grep -n '^COMPONENT "Titlebars and Toolbars/.*/Search/' specs/titlebars-and-toolbars.txt` |
| Pop-up and pull-down | `grep -n '^COMPONENT "Titlebars and Toolbars/.*/\(Pop-up\|Pulldown\)/' specs/titlebars-and-toolbars.txt` |
| Inner buttons and segments | `grep -n '^COMPONENT "Titlebars and Toolbars/􀻃/.*/\(Button Group\|Segmented Control\) Buttons/' specs/titlebars-and-toolbars.txt` |
| Separators, Clear Search | `grep -n '^COMPONENT "Titlebars and Toolbars/􀻃/.*/\(Separator\|Clear Search\)' specs/titlebars-and-toolbars.txt` |
| Window titles | `grep -n '^COMPONENT "Titlebars and Toolbars/.*/Window/Title' specs/titlebars-and-toolbars.txt` |
| Window controls (all) | `grep -n '^COMPONENT "Titlebars/\|Stoplights' specs/titlebars-and-toolbars.txt` |
| Utility panel bars and tabs | `grep -n '^COMPONENT "Titlebars and Toolbars/.*\(Panel/\|PanelPanel/\|Tab Bar\|Titles/\)' specs/titlebars-and-toolbars.txt` |
| Lines are long: trim them | append `\| cut -c1-300` |
