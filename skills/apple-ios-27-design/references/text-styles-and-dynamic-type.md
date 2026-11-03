# Text Styles and Dynamic Type — iOS 27

**Read when:** you need an exact iOS 27 value for text Styles and Dynamic Type (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Text Styles and Dynamic Type in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, kit notes.

Source: `specs/text-styles-and-dynamic-type.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The shared text style table (every style with its regular, loose and tight leading) is in `text-styles.md`. This page adds the Dynamic Type size tables and the specimen boards that show each style in the four label colours.

## Components

The page has no components (0 `COMPONENT` lines) and no `BOARD` lines. It holds four top-level documentation groups and one header instance:

| Group | Size | Background | Content |
|---|---|---|---|
| `Dynamic Type Table` | 1380 × 1160 | `#FFFFFF`, frame `#999999 {Disabled - Light}` | 11 text styles × 7 standard sizes |
| `Dynamic Type Table - Accessibility Sizes` | 1320 × 1160 | `#FFFFFF`, frame `#999999 {Disabled - Light}` | 11 text styles × 5 accessibility sizes |
| `Text Styles - Dark` | 910 × 1540 | `#000000` | 34 style specimens × 4 label colours (Dark) |
| `Text Styles - Light` | 910 × 1540 | `#FFFFFF` | 34 style specimens × 4 label colours (Light) |
| `use "_Header"` | 1600 × 194 | — | page title and description |

Size axis values: xSmall, Small, Medium, Large (Default), xLarge, xxLarge, xxxLarge (standard); AX1, AX2, AX3, AX4, AX5 (accessibility).

Text style axis values (layer names in the tables): Large Title, Title 1, Title 2, Title 3, Headline, Body, Callout, Subhead, Footnote, Caption 1, Caption 2.

## Anatomy

### Dynamic Type tables

| Part (layer) | Size | Position | Notes |
|---|---|---|---|
| `Labels + BG` / `Frame` | 1380 × 1160 (standard), 1320 × 1160 (AX) | @0,0 | fill `#999999 {Disabled - Light}` |
| `Title` | 1213 × 28 (standard), 1153 × 28 (AX) | @20,8 | "Dynamic Type Table" / "Dynamic Type Table (Accessibility Sizes)" |
| Subtitle (`Fonts sizes are in p` / `Subtitle`) | 1340 × 40 / 1280 × 40 | @20,41 | the legend key (see Kit notes) |
| Size label (`xSmall` … `AX5`) | 21–80 × 13 | y 116 | one per column |
| Legend column (`R31, 38L R25, 31L R1` …) | 51–55 × 990 (standard), 100 × 990 (AX) | y 165–166 | weight + size + leading per row, white text |
| Specimen column (`group "xSmall"` … `group "AX5"`) | 141–265 wide × 933–966 tall | x 19–1099, y 133–159 | 11 text layers, one per style, black `#000000` |

Column x positions (size label and legend): standard 20, 190, 360, 530, 710, 900, 1100; AX 20, 250, 500, 760, 1040.

Row y positions inside a specimen column (Large (Default) column): Large Title 0, Title 1 97, Title 2 192, Title 3 283, Headline 378, Body 468, Callout 559, Subhead 650, Footnote 741, Caption 1 833, Caption 2 925. Derived: row-to-row steps are 90–97 (differences of those y values); the legend text uses `lh90`, one legend line per row.

### Text Styles boards (Dark and Light)

| Part | Value |
|---|---|
| Board | 910 × 1540 |
| Column header group `Labels` | 825 × 16 @20,30; four texts at x 0, 239, 470, 690: "Label Color", "Secondary Label Color", "Tertiary Label Color", "Quaternary Label Color" |
| Specimen columns | x 20 (Primary), 259 (Secondary), 490 (Tertiary), 710 (Quaternary) |
| Specimens per column | 34 (one per local text style except `06 Body/Default`) |

Specimen rows (y, same in every column of both boards; the x 20 Large Title Bold sits at y 121, the other columns at y 120):

| Style | Variants shown (y) |
|---|---|
| LargeTitle | 1 Default (69), 2 Bold (120) |
| Title1 | 1 Default (202), 2 Bold (249) |
| Title2 | 1 Default (330), 2 Bold (368) |
| Title3 | 1 Default (445), 2 Bold (479) |
| Headline | 1 Default (545), 4 Bold Italic (577) |
| Body | 1 Default (639), 2 Bold (671), 3 Italic (702), 4 Bold Italic (735) |
| Callout | 1 Default (807), 2 Bold (838), 3 Italic (868), 4 Bold Italic (899) |
| Subheadline | 1 Default (970), 2 Bold (1000), 3 Italic (1029), 4 Bold Italic (1060) |
| Footnote | 1 Default (1130), 2 Bold (1158), 3 Italic (1185), 4 Bold Italic (1214) |
| Caption1 | 1 Default (1282), 2 Bold (1308), 3 Italic (1333), 4 Bold Italic (1360) |
| Caption2 | 1 Default (1426), 2 Bold (1449), 3 Italic (1471), 4 Bold Italic (1495) |

The Dark and Light boards are identical apart from colours (checked by comparing all 142 layer lines with colours removed).

## Sizes

Cells are weight, point size / line height, from the specimen text layers. R = SFPro-Regular, SB = SFPro-Semibold. No layer on the page has tracking (`kern`) set. Headline is Semibold at every size and every other style is Regular at every size (checked across all 132 specimen layers).

### Standard sizes

| Style | xSmall | Small | Medium | Large (Default) | xLarge | xxLarge | xxxLarge |
|---|---|---|---|---|---|---|---|
| Large Title | R 31/38 | R 32/39 | R 33/40 | R 34/41 | R 36/43 | R 38/46 | R 40/48 |
| Title 1 | R 25/31 | R 26/32 | R 27/33 | R 28/34 | R 30/36 ⚠ | R 32/39 | R 34/41 |
| Title 2 | R 19/23 ⚠ | R 20/24 ⚠ | R 21/28 ⚠ | R 22/28 | R 24/30 | R 26/32 | R 28/34 |
| Title 3 | R 17/22 | R 18/23 | R 19/24 | R 20/25 | R 22/28 | R 24/30 | R 26/32 |
| Headline | SB 14/19 | SB 15/20 | SB 16/21 | SB 17/22 | SB 19/24 | SB 21/26 | SB 23/29 |
| Body | R 14/19 | R 15/20 | R 16/21 | R 17/22 | R 19/24 | R 21/26 | R 23/29 |
| Callout | R 13/18 | R 14/19 | R 15/20 | R 16/21 | R 18/23 | R 20/24 ⚠ | R 22/28 |
| Subhead | R 12/16 | R 13/18 | R 14/19 | R 15/20 | R 17/22 | R 19/24 | R 21/28 |
| Footnote | R 12/16 | R 12/16 | R 12/16 | R 13/18 | R 15/20 | R 17/22 | R 19/24 |
| Caption 1 | R 11/13 | R 11/13 | R 11/13 | R 12/16 | R 14/19 | R 16/21 | R 18/23 |
| Caption 2 | R 11/13 | R 11/13 | R 11/13 | R 11/13 | R 13/18 | R 15/20 | R 17/22 |

### Accessibility sizes

| Style | AX1 | AX2 | AX3 | AX4 | AX5 |
|---|---|---|---|---|---|
| Large Title | R 44/52 | R 48/57 | R 52/61 | R 56/66 | R 60/70 |
| Title 1 | R 38/46 | R 43/51 | R 48/57 | R 53/62 | R 58/68 |
| Title 2 | R 34/41 | R 43/51 ⚠ | R 44/52 | R 50/59 | R 56/66 |
| Title 3 | R 31/38 | R 37/44 | R 43/51 | R 43/51 ⚠ | R 55/65 |
| Headline | SB 28/34 | SB 33/40 | SB 40/48 | SB 47/56 | SB 53/62 |
| Body | R 28/34 | R 33/40 | R 40/48 | R 47/56 | R 53/62 |
| Callout | R 26/32 | R 32/39 | R 38/46 | R 44/52 | R 51/60 |
| Subhead | R 25/31 | R 30/37 | R 36/43 | R 42/50 | R 49/58 |
| Footnote | R 23/29 | R 27/33 | R 33/40 | R 38/46 | R 44/52 |
| Caption 1 | R 22/28 | R 26/32 | R 32/39 | R 37/44 | R 43/51 |
| Caption 2 | R 20/25 | R 24/30 | R 29/35 | R 34/41 | R 40/48 |

### Where the specimen layer and the printed legend disagree (⚠)

Each column also prints its values as a legend ("R34, 41L" = Regular 34 pt, 41 leading). The dump truncates each legend after the Footnote row, so Caption 1 and Caption 2 can only be read from the specimen layers. Where both exist they agree except for these seven cells:

| Size | Style | Specimen layer (line) | Legend (line) |
|---|---|---|---|
| xSmall | Title 2 | R 19/23 (L107) | R19, 24L (L84) |
| Small | Title 2 | R 20/24 (L119) | R20, 25L (L85) |
| Medium | Title 2 | R 21/28 (L131) | R21, 26L (L86) |
| xLarge | Title 1 | R 30/36 (L156) | R30, 37L (L88) |
| xxLarge | Callout | R 20/24 (L163) | R20, 25L (L89) |
| AX2 | Title 2 | R 43/51 (L39) | R39, 47L (L9) |
| AX4 | Title 3 | R 43/51 (L62) | R49, 58L (L11) |

The two AX cells look like copy errors in the specimen layer: AX2 Title 2 equals AX2 Title 1, and AX4 Title 3 equals AX3 Title 3 and is smaller than AX4 Body. The legend values keep each style between its neighbours. Line numbers are `grep -n` line numbers (the AX4 and several standard legend texts contain carriage returns, which some tools count as extra lines).

### Large (Default) and the shared text styles

The Large (Default) specimens are the only ones bound to text styles: library styles `lib:<Style>/1 Default/1 Light/1 Label Color/1 Left Aligned` (for example `lib:Body/1 Default/1 Light/1 Label Color/1 Left Aligned`). Their values match the `1 Default` rows in `text-styles.md` for all 11 styles (derived by comparing the two tables).

## Colours and states

Text Styles boards: one column per label colour. All 34 specimens in a column use the same swatch (counted: 34 per column per board).

| Column (x) | Header text | Light board | Dark board |
|---|---|---|---|
| 20 | Label Color | `#000000 {Labels/Light/1 Primary}` | `#FFFFFF {Labels/Dark/1 Primary}` |
| 259 | Secondary Label Color | `#3C3C43@60% {Labels/Light/2 Secondary}` | `#EBEBF5@60% {Labels/Dark/2 Secondary}` |
| 490 | Tertiary Label Color | `#3C3C43@30% {Labels/Light/3 Tertiary}` | `#EBEBF5@30% {Labels/Dark/3 Tertiary}` |
| 710 | Quaternary Label Color | `#3C3C43@18% {Labels/Light/4 Quaternary}` | `#EBEBF5@16% {Labels/Dark/4 Quaternary}` |
| Board background | — | `#FFFFFF` | `#000000` |
| Column headers (`Labels`) | — | `#000000` (no swatch) | `#FFFFFF {Labels/Dark/1 Primary}` |

Dynamic Type tables: specimens `#000000` on `#FFFFFF`; titles, subtitles, size labels and legends `#FFFFFF` on the `#999999 {Disabled - Light}` frame. `Disabled - Light` is not one of the swatches in `specs/tokens.txt`.

## Text

Specimen fonts per text style on the Text Styles boards (font, size, line height, `textstyle=`). These match `text-styles.md` except where marked.

| Style token | Font | Size / lh |
|---|---|---|
| 01 LargeTitle/1 Default · /2 Bold | SFPro-Regular · SFPro-Bold | 34 / 41 |
| 02 Title1/1 Default · /2 Bold | SFPro-Regular · SFPro-Bold | 28 / 34 |
| 03 Title2/1 Default · /2 Bold | SFPro-Regular · SFPro-Bold | 22 / 28 |
| 04 Title3/1 Default · /2 Bold | SFPro-Regular · SFPro-Semibold | 20 / 25 |
| 05 Headline/1 Default · /4 Bold Italic | SFPro-Semibold · SFPro-SemiboldItalic | 17 / 22 |
| 06 Body/1–4 | Regular · Semibold · RegularItalic · SemiboldItalic | 17 / 22 |
| 07 Callout/1–4 | Regular · Semibold · RegularItalic · SemiboldItalic | 16 / 21 |
| 08 Subheadline/1–4 | Regular · Semibold · RegularItalic · SemiboldItalic | 15 / 20 |
| 09 Footnote/1–4 | Regular · Semibold · RegularItalic · SemiboldItalic | 13 / 18 |
| 10 Caption1/1–4 | Regular · **Semibold** · RegularItalic · **SemiboldItalic** | 12 / 16 |
| 11 Caption2/1–4 | Regular · Semibold · RegularItalic · SemiboldItalic | 11 / 13 |

Caption1: the specimens bound to `10 Caption1/2 Bold` and `10 Caption1/4 Bold Italic` use SFPro-Semibold and SFPro-SemiboldItalic (lines 190 and 188 on the Dark board, and the same on the Light board), while the tokens store SFPro-Medium and SFPro-MediumItalic. The column headers bound to `10 Caption1/2 Bold` use SFPro-Medium 12 / 16, as the token does.

Documentation text on the Dynamic Type tables:

| Layer | Font | Size / lh | Colour | Text style |
|---|---|---|---|---|
| Title | SFPro-Bold | 22 / 28 | `#FFFFFF` | `lib:Title2/2 Bold/2 Dark/1 Label Color/1 Left Aligned` |
| Subtitle | SFPro-Regular | 15 / 20 | `#FFFFFF` | `lib:Subheadline/1 Default/2 Dark/1 Label Color/1 Left Aligned` |
| Size labels | SFPro-Regular | 11 / 13 | `#FFFFFF` | none |
| Legend columns | SFPro-Regular | 11 / 90 | `#FFFFFF` | none |

All text is left aligned.

## Kit notes

- The tables state that font sizes are in points. Legend key, from the subtitle: L = Light, R = Regular, SB = Semibold for the weight letter before the size; the L after the second number means leading. Both subtitles are cut off in the dump ("L=Leading (Tight l…" on the standard table, "B=Sugge…" on the AX table), so the rest of the key is not available.
- Light (L) never appears in the legends or specimens; only R and SB are used.
- Large (Default) is marked as the default size in its column label.
- The header begins "Apple provides two typeface families tha…"; the rest is truncated in the dump.
- The Text Styles boards show each style in the four label colours for Light and Dark. Headline has only Default and Bold Italic; LargeTitle, Title1, Title2 and Title3 have only Default and Bold.
- Loose and tight leading values are not on this page; they are in `text-styles.md` (`Loose Leading/…`, `Tight Leading/…`). Dynamic Type sizes for loose or tight leading: Not in the kit.

## Finding it in the spec

| What | Pattern |
|---|---|
| Both Dynamic Type tables | `grep -n '^group "Dynamic Type Table' specs/text-styles-and-dynamic-type.txt` |
| One size column | `grep -n -A11 '^  group "xLarge"' specs/text-styles-and-dynamic-type.txt` (swap the size name; `"Large (Default)"`, `"AX3"` …) |
| One style at every size | `grep -n '^    text "Title 2" ' specs/text-styles-and-dynamic-type.txt` |
| Legend columns | `grep -n '^    text "R[0-9]' specs/text-styles-and-dynamic-type.txt` |
| Text Styles boards | `grep -n '^group "Text Styles' specs/text-styles-and-dynamic-type.txt` |
| Specimens of one token | `grep -n 'textstyle="10 Caption1/2 Bold"' specs/text-styles-and-dynamic-type.txt` |
| One label colour | `grep -n '{Labels/Light/3 Tertiary}' specs/text-styles-and-dynamic-type.txt` |
