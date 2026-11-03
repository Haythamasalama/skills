# Buttons — macOS 27

**Read when:** you need an exact macOS 27 value for buttons (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Buttons in Apple's macOS 27 kit: components, anatomy, sizes.

Source: `specs/buttons.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

The page has 880 components in two name trees. There are no documentation boards (`BOARD`) on this page.

| Name tree | Axes, in path order | Components |
|---|---|---|
| `Buttons/<Appearance>/<Context>/<Family>/<Size>/<State>` | Appearance: `Light`, `Dark` · Context: `Content Area`, `Over-glass` · Family: 7 values (below) · Size: `1 Mn`, `2 Sm`, `3 Rg`, `4 Lg`, `5 XL` · State: below | 800 |
| `Arrow Buttons/<Appearance>/<Context>/<Size>/<State>` | Appearance: `Light`, `Dark` · Context: `Content Area`, `Over-glass` · Size: `1 Mn` … `5 XL` · State: below | 80 |

### Families and their states

| Family (path value) | Page heading | States | Components |
|---|---|---|---|
| `Bordered` | Bordered | `Active, Off, 1 Idle` · `Active, Off, 3 Clicked` · `Active, Off, 4 Disabled` · `Inactive, Off, 1 Idle` · `Inactive, Off, 4 Disabled` | 100 |
| `Bordered Tinted` | Bordered Tinted | same five | 100 |
| `Bordered Destructive` | Bordered Destructive | same five | 100 |
| `Bordered Default` | Bordered Default | same five | 100 |
| `Bordered Default Destructive` | Bordered Default Desctructive (sic) | same five | 100 |
| `Borderless (on = bezel)` | Borderless | same five, except Over-glass Mn has `Active, Off, 2 Hover` instead of `Active, Off, 1 Idle` | 100 |
| `Toggle` | Toggle Button | `Active, Off` and `Active, On` × `1 Idle`, `3 Clicked`, `4 Disabled` · `Inactive, Off` and `Inactive, On` × `1 Idle`, `4 Disabled` (Over-glass Mn has `Active, Off, 2 Hover` instead of `Active, Off, 1 Idle`) | 200 |
| Arrow Buttons | Arrow Button | Content Area: `1 - Idle`, `3 - Clicked`, `4 - Disabled` (30) · Over-glass: those three plus `Inactive, 1 - Idle`, `Inactive, 4 - Disabled` (50) | 80 |

Every family has all five sizes in both appearances and both contexts. Only Toggle has an On value; the other `Buttons` families are Off only. Borderless has no On variant, so the bezel its name refers to is not drawn on this page. The kit doesn't define Active and Inactive; it uses them only as axis values and page headings.

### Which shared style each family uses

Style names are in `control-styles-content-area.md` / `control-styles-over-glass.md`. The style group is the same in every size.

| Family | Active states | Inactive states |
|---|---|---|
| Bordered | `<Context>/<Appearance>/01 - Bordered/…` | `01 - Bordered` |
| Bordered Tinted | Content Area: `02 - Bordered Tinted/…` on the `BG` rect · Over-glass: no style (plain fills on `BG`) | `01 - Bordered` |
| Bordered Destructive | Content Area: `03 - Bordered Destructive/…` on the `BG` rect · Over-glass: no style (plain fills on `BG`) | `01 - Bordered` |
| Bordered Default | `04 - Prominent (Default)/…` | `01 - Bordered` |
| Bordered Default Destructive | `05 - Prominent (Default) Destructive/…` | `01 - Bordered` |
| Borderless (on = bezel) | none | none |
| Toggle | none | none |
| Arrow Buttons | `01 - Bordered/…` | `01 - Bordered` |

Derived: in Inactive states the default (prominent), tinted and destructive buttons all switch to the `01 - Bordered` grey fill and a neutral label colour. The style prefix is `Content Area/…` or `Over-Glass/…` (capital G), while component paths spell the context `Over-glass`.

## Anatomy

No component on this page contains a nested component (`use`). Each one is a frame with one or two child layers.

### Push buttons: Bordered, Bordered Tinted, Bordered Destructive, Bordered Default, Bordered Default Destructive

| Layer | Kind | Size and position | Role |
|---|---|---|---|
| (component) | frame, `stack h gap0` with padding per size | W × H from the Sizes table | Carries the fill, corner radius and shared style in most states |
| `BG` | `rect` | same W × H as the component, `@0,0` | Carries the fill when the state needs layer opacity on the fill only. Present in: Bordered Tinted and Bordered Destructive, all `Active` states, both contexts · Bordered Default `Active, Off, 4 Disabled`, both contexts · Bordered Default Destructive `Active, Off, 4 Disabled`, Content Area only. The dump lists no corner radius on `BG` |
| `Label` | `text`, content "Label", centred | `@padL,padT`, size from the Sizes table | The button's text |

Derived and checked on all 800 `Buttons` components: W = left padding + label width + right padding, and H = top padding + label height + bottom padding, with the label at (left padding, top padding). The width hugs the label. The kit's widths are for the text "Label" only.

### Toggle

| Layer | Kind | Size and position | Role |
|---|---|---|---|
| (component) | frame, `stack h gap0` | Sizes table | Fill in Content Area Off states, in Content Area Inactive On states, in Over-glass Inactive states, and in all Dark Over-glass states |
| `BG` | `rect` | full size, `@0,0` | Present in Content Area `Active, On` states and in every Over-glass `Active` state (Off and On) |
| `􀊶 Toggle` / `􀊴 Toggle` | `text`, centred | Sizes table | One text layer: an SF Symbols glyph, a space, then "Toggle". Off states use 􀊶 (U+1002B6); On states use 􀊴 (U+1002B4) |

### Borderless (on = bezel)

| Layer | Kind | Size and position | Role |
|---|---|---|---|
| (component) | frame, `stack h gap0` | Sizes table | Never has a fill. Over-glass frames carry a blend mode only |
| `Borderless` | `text`, content "Borderless", centred | Sizes table | The button's text; the only visible layer |

### Arrow Buttons

| Layer | Kind | Size and position | Role |
|---|---|---|---|
| (component) | frame, square, `corners max` (a circle), no auto layout | Sizes table | Fill and `01 - Bordered` shared style |
| `􀆏` | `text`, content 􀆏 (U+10018F), centred | Sm–XL: the whole button `@0,0` · Mn: 9×14 `@3,1` (Idle, Clicked) or `@3.5,1` (Disabled) | The glyph. There is one glyph only; the kit has no other directions |

## Sizes

All five sizes share one height scale: Mn 16, Sm 20, Rg 24, Lg 28, XL 36. Every listed corner has smoothing 0.6. The `stack` gap is 0 in every `Buttons` component.

### Push buttons (Bordered, Bordered Tinted, Bordered Destructive, Bordered Default, Bordered Default Destructive)

| Size | W × H (label "Label") | Corner radius | Padding T, R, B, L | Label box | Label font |
|---|---|---|---|---|---|
| 5 XL | 66 × 36 | max | 10, 16, 10, 16 | 34 × 16 `@16,10` | SFPro-Medium 13, lh16 |
| 4 Lg | 66 × 28 | max | 6, 16, 6, 16 | 34 × 16 `@16,6` | SFPro-Medium 13, lh16 |
| 3 Rg | 66 × 24 | 6 (5 in Content Area Bordered Destructive) | 4, 16, 4, 16 | 34 × 16 `@16,4` | SFPro-Medium 13, lh16 |
| 2 Sm | 50 × 20 | 5 | 4, 10, 3, 10 | 30 × 13 `@10,4` | SFPro-Medium 11, no line height (lh13 in Bordered Tinted `Active, Off, 1 Idle`) |
| 1 Mn | 41 × 16 | 4 | 2, 7, 1, 7 (2, 7, 2, 7 in Bordered Idle states) | 27 × 13 `@7,2` (27 × 12 in Bordered Idle states) | SFPro-Medium 10, lh13 (no line height in Bordered Idle states) |

"Bordered Idle states" means `Active, Off, 1 Idle` and `Inactive, Off, 1 Idle` of the `Bordered` family, in both appearances and contexts (8 components).

### Toggle

| Size | W × H (label "􀊶 Toggle") | Corner radius | Padding T, R, B, L | Label box | Label font |
|---|---|---|---|---|---|
| 5 XL | 94 × 36 | max | 10, 16, 10, 16 | 62 × 16 `@16,10` | SFPro-Medium 13, lh16 |
| 4 Lg | 94 × 28 | max | 6, 16, 6, 16 | 62 × 16 `@16,6` | SFPro-Medium 13, lh16 |
| 3 Rg | 94 × 24 | 6 | 4, 16, 4, 16 | 62 × 16 `@16,4` | SFPro-Medium 13, lh16 |
| 2 Sm | 73 × 20 | 5 | 4, 10, 3, 10 | 53 × 13 `@10,4` | SFPro-Medium 11, no line height |
| 1 Mn | 63 × 16 | 4 | 2, 7, 1, 7 | 49 × 13 `@7,2` | SFPro-Medium 10, lh13 |

### Borderless (on = bezel)

| Size | W × H (label "Borderless") | Corner radius | Padding T, R, B, L | Label box | Label font |
|---|---|---|---|---|---|
| 5 XL | 99 × 36 | max | 10, 16, 10, 16 | 67 × 16 `@16,10` | SFPro-Medium 13, lh16 |
| 4 Lg | 99 × 28 | max | 6, 16, 6, 16 | 67 × 16 `@16,6` | SFPro-Medium 13, lh16 |
| 3 Rg | 99 × 24 | 6 | 4, 16, 4, 16 | 67 × 16 `@16,4` | SFPro-Medium 13, lh16 |
| 2 Sm | 78 × 20 | 5 | 4, 10, 3, 10 | 58 × 13 `@10,4` | SFPro-Medium 11, no line height |
| 1 Mn | 68 × 16 | 4 | 2, 7, 1, 7 | 54 × 13 `@7,2` | SFPro-Medium 10, lh13 |

Borderless has a corner radius although it never draws a fill.

### Arrow Buttons

| Size | W × H | Corner radius | Glyph box | Glyph font |
|---|---|---|---|---|
| 5 XL | 36 × 36 | max | 36 × 36 `@0,0` | SFPro-Semibold 13, lh16 |
| 4 Lg | 28 × 28 | max | 28 × 28 `@0,0` | SFPro-Semibold 13, lh16 |
| 3 Rg | 24 × 24 | max | 24 × 24 `@0,0` | SFPro-Semibold 13, lh16 |
| 2 Sm | 20 × 20 | max | 20 × 20 `@0,0` | SFPro-Semibold 13, lh16 |
| 1 Mn | 16 × 16 | max | 9 × 14 `@3,1`; `@3.5,1` in Disabled states | SFPro-Semibold 11, lh14 |

Derived: the glyph size is 13 from Sm to XL; only the circle grows.

## More on this component

Colours and states, text and effects: `buttons-colours.md`.
