# Buttons — iOS 27

**Read when:** you need an exact iOS 27 value for buttons (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Buttons in Apple's iOS 27 kit: components, anatomy, sizes, colours and states, text, effects, kit notes.

Source: `specs/buttons.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

## Components

264 components in two families. The page has no documentation boards, only a `_Header` instance (see Kit notes).

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Filled and borderless buttons | `Buttons/<Appearance>/<Size>/[<Tone>/]<Style>/<Content>/<State>` | Appearance: Light, Dark · Size: Large, Medium, Small · Tone: Default, Destructive · Style: Bordered, Bordered Prominent, Borderless · Content: Symbol, Text, Symbol + Text · State: 1 - Idle, 4 - Disabled | 216 (2 × 3 × 2 × 3 × 3 × 2) |
| Glass buttons | `Buttons/<Appearance>/<Size>/<Style>/<Variant>` | Appearance: Light, Dark · Size: Large, Regular, Small · Style: Glass, Glass Prominent, Destructive · Variant: Default, Disabled, Destructive, Destructive + Disabled (not every style has every variant, see below) | 48 |

Naming quirk in the first family: the tone segment is left out for Default Bordered and Bordered Prominent (`Buttons/Light/Large/Bordered/Text/1 - Idle`), but present for Default Borderless (`Buttons/Light/Large/Default/Borderless/Text/1 - Idle`) and for every Destructive button (`Buttons/Light/Large/Destructive/Bordered/Text/1 - Idle`).

Glass-family variants that exist, per appearance (each exists in all three sizes):

| Style | Light | Dark |
|---|---|---|
| Glass | Default, Disabled | Default (two components with the same name), Destructive |
| Glass Prominent | Default, Disabled, Destructive, Destructive + Disabled | Default, Disabled, Destructive, Destructive + Disabled |
| Destructive | Destructive, Disabled | Destructive |

## Anatomy

### Filled and borderless buttons

The root is the button shape: one fill (the style colour), `corners max smoothing0.6 style1` (a capsule, or a circle when square). No border or shadow on any of the 216.

| Content | Layout | Children (layer name: size @position, Large size shown) |
|---|---|---|
| Symbol | No auto layout | `text "Symbol"`: 50×50 @0,0, fills the button, centre-aligned |
| Text | `stack h gap4 pad16,20,16,20` | `text "Label"` "Play": 32×18 @20,16, left-aligned |
| Symbol + Text | `stack h gap4 pad16,20,16,20` | `text "Symbol"`: 15×18 @20,16; `text "Label"` "Play": 32×18 @39,16 |

The glyph is drawn as a text layer, not an image: 􀊄 (U+100284), in every Symbol and Symbol + Text component. No nested components.

### Glass buttons

Glass, Destructive, and the disabled Glass Prominent variants: the root carries the shared glass style (`style="Liquid Glass/<Appearance>/Regular - Small"`), `corners max smoothing0.6 style1`, `stack h gap0`, and one child `text "Label"` "Label", centre-aligned.

Glass Prominent Default and Destructive (the tinted ones) are built from three layers; the root has `corners 0` and no fill:

| Layer | Size @position (Large Dark) | Content |
|---|---|---|
| `group "Tint Color"` | 84×47 @-0.5,-0.5 (button size + 1 on each axis) | `fill #FFFFFF@96% + <tint> (blend plus-darker)`, `corners max smoothing0.6 style1` |
| `group "Tinted Glass"` | 83×46 @0,0 | `style="Liquid Glass/<other appearance>/Regular - Small - Tinted"`, `corners max` |
| `text "Label"` | 43×18 @20,14 | "Label", #FFFFFF, centre |

The tinted glass uses the opposite appearance's style: Light buttons use `Liquid Glass/Dark/Regular - Small - Tinted` and Dark buttons use `Liquid Glass/Light/Regular - Small - Tinted`. This is how the kit stores it.

## Sizes

### Filled and borderless buttons

The same geometry holds across Light, Dark, both tones, all three styles and both states (checked across all 216).

| Size | Symbol | Text | Symbol + Text | Padding T,R,B,L | Gap | Corner | Label font | Label layer | Symbol layer (in Symbol + Text) |
|---|---|---|---|---|---|---|---|---|---|
| Large | 50 × 50 | 72 × 50 | 91 × 50 | 16, 20, 16, 20 | 4 | max | SFPro-Regular 17, lh 18 | 32 × 18 | 15 × 18 @20,16 |
| Medium | 34 × 34 | 56 × 34 | 75 × 34 | 8, 12, 8, 12 | 4 | max | SFPro-Regular 17, lh 18 | 32 × 18 | 15 × 18 @12,8 |
| Small | 28 × 28 | 49 × 28 | 66 × 28 | 5, 10, 5, 10 | 4 | max | SFPro-Regular 15, lh 18 | 29 × 18 | 13 × 18 @10,5 |

Derived from the padding and layer sizes (the widths hug the "Play" label):

- Height = pad top + 18 + pad bottom: 16 + 18 + 16 = 50; 8 + 18 + 8 = 34; 5 + 18 + 5 = 28.
- Text width = pad left + label + pad right: 20 + 32 + 20 = 72; 12 + 32 + 12 = 56; 10 + 29 + 10 = 49.
- Symbol + Text width = pad left + symbol + gap + label + pad right: 20 + 15 + 4 + 32 + 20 = 91; 12 + 15 + 4 + 32 + 12 = 75; 10 + 13 + 4 + 29 + 10 = 66.
- Symbol-only buttons are square with the side equal to the height; the glyph layer is the whole button, centred.

Glyph size: drawn at the label's font size (17 for Large and Medium, 15 for Small).

### Glass buttons

| Size | Size (W × H) | Padding T,R,B,L | Gap | Corner | Label font | Label layer |
|---|---|---|---|---|---|---|
| Large | 83 × 46 | 14, 20, 14, 20 | 0 | max | SFPro-Medium 17, lh 18 | 43 × 18 @20,14 |
| Large, Light Glass Prominent only | 83 × 50 | 16, 20, 16, 20 | 0 | max | SFPro-Medium 17, lh 18 | 43 × 18 @20,16 |
| Regular | 67 × 34 | 8, 12, 8, 12 | 0 | max | SFPro-Medium 17, lh 18 | 43 × 18 @12,8 |
| Small | 59 × 28 | 5, 10, 5, 10 | 0 | max | SFPro-Medium 15, lh 18 | 39 × 18 @10,5 |

Derived: width = pad left + label + pad right (20 + 43 + 20 = 83; 12 + 43 + 12 = 67; 10 + 39 + 10 = 59); height = pad top + 18 + pad bottom (14 + 18 + 14 = 46; 8 + 18 + 8 = 34; 5 + 18 + 5 = 28).

Glass buttons have text only; the kit has no symbol variants for them.

## Colours and states

### Filled and borderless buttons — Light

| Tone / Style | State | Fill | Label and symbol colour | Other |
|---|---|---|---|---|
| Default / Bordered | 1 - Idle | #767680@12% {Fills/Light/3 Tertiary} | #0088FF {System Colors/Light/8 Blue} | — |
| Default / Bordered | 4 - Disabled | #747480@8% {Fills/Light/4 Quaternary} | #3C3C43@30% {Labels/Light/3 Tertiary} | — |
| Default / Bordered Prominent | 1 - Idle | #0088FF {System Colors/Light/8 Blue} | #FFFFFF | — |
| Default / Bordered Prominent | 4 - Disabled | #747480@8% {Fills/Light/4 Quaternary} | #3C3C43@30% {Labels/Light/3 Tertiary} | — |
| Default / Borderless | 1 - Idle | #FFFFFF + #FFFFFF (as stored) | #0088FF {System Colors/Light/8 Blue} | — |
| Default / Borderless | 4 - Disabled | #FFFFFF + #FFFFFF (as stored) | #3C3C43@30% {Labels/Light/3 Tertiary} | — |
| Destructive / Bordered | 1 - Idle | #FF383C@14% (no swatch) | #FF383C {System Colors/Light/1 Red} | text layers `blend darken` |
| Destructive / Bordered | 4 - Disabled | #747480@8% {Fills/Light/4 Quaternary} | #3C3C43@30% {Labels/Light/3 Tertiary} | text layers `blend darken` |
| Destructive / Bordered Prominent | 1 - Idle | #FF383C {System Colors/Light/1 Red} | #FFFFFF | — |
| Destructive / Bordered Prominent | 4 - Disabled | #747480@8% {Fills/Light/4 Quaternary} | #3C3C43@30% {Labels/Light/3 Tertiary} | — |
| Destructive / Borderless | 1 - Idle | #FFFFFF + #FFFFFF (as stored) | #FF383C {System Colors/Light/1 Red} | — |
| Destructive / Borderless | 4 - Disabled | #FFFFFF + #FFFFFF (as stored) | #3C3C43@30% {Labels/Light/3 Tertiary} | — |

### Filled and borderless buttons — Dark

| Tone / Style | State | Fill | Label and symbol colour | Other |
|---|---|---|---|---|
| Default / Bordered | 1 - Idle | #EBEBF5@30% {Labels/Dark/3 Tertiary} | #0091FF {System Colors/Dark/8 Blue} | — |
| Default / Bordered | 4 - Disabled | #EBEBF5@16% {Labels/Dark/4 Quaternary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} | — |
| Default / Bordered Prominent | 1 - Idle | #0091FF {System Colors/Dark/8 Blue} | #FFFFFF | — |
| Default / Bordered Prominent | 4 - Disabled | #EBEBF5@16% {Labels/Dark/4 Quaternary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} | — |
| Default / Borderless | 1 - Idle | #FFFFFF + #FFFFFF (as stored) | #0091FF {System Colors/Dark/8 Blue} | — |
| Default / Borderless | 4 - Disabled | #FFFFFF + #FFFFFF (as stored) | #EBEBF5@30% {Labels/Dark/3 Tertiary} | — |
| Destructive / Bordered | 1 - Idle | #FF4245@14% (no swatch) | #FF4245 {System Colors/Dark/1 Red} | — |
| Destructive / Bordered | 4 - Disabled | #767680@18% {Fills/Dark/4 Quaternary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} | — |
| Destructive / Bordered Prominent | 1 - Idle | #FF4245 {System Colors/Dark/1 Red} | #FFFFFF | — |
| Destructive / Bordered Prominent | 4 - Disabled | #767680@18% {Fills/Dark/4 Quaternary} | #EBEBF5@30% {Labels/Dark/3 Tertiary} | — |
| Destructive / Borderless | 1 - Idle | #FFFFFF + #FFFFFF (as stored) | #FF4245 {System Colors/Dark/1 Red} | — |
| Destructive / Borderless | 4 - Disabled | #FFFFFF + #FFFFFF (as stored) | #EBEBF5@30% {Labels/Dark/3 Tertiary} | text layers `opacity 49.2%` |

Notes on these tables:

- Borderless roots store two white fills (`fill #FFFFFF + #FFFFFF`) in both appearances; the dump gives no opacity for them.
- The idle Bordered fill differs by appearance: Light uses a Fills swatch (Fills/Light/3 Tertiary), Dark uses a Labels swatch (Labels/Dark/3 Tertiary).
- Disabled fills differ by tone in Dark: Default uses #EBEBF5@16% {Labels/Dark/4 Quaternary}, Destructive uses #767680@18% {Fills/Dark/4 Quaternary}. In Light both tones use #747480@8% {Fills/Light/4 Quaternary}.
- The 14% destructive tint (#FF383C@14%, #FF4245@14%) is unbound in this page. `colors.md` lists the matching Figma variable `Miscellaneous/Buttons/BG - Destructive`.
- No shared layer style (`style="…"`) is used by this family; it uses swatches only.
- Only Idle and Disabled exist. Pressed, focused or highlighted states: Not in the kit.

### Glass buttons — Light

| Style / Variant | Glass layer | Tint layer | Label colour |
|---|---|---|---|
| Glass / Default | `Liquid Glass/Light/Regular - Small` | — | #000000 {Labels/Light/1 Primary} |
| Glass / Disabled | `Liquid Glass/Light/Regular - Small` | — | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Glass Prominent / Default | `Liquid Glass/Dark/Regular - Small - Tinted` | #FFFFFF@96% + #0088FF {System Colors/Light/8 Blue} (blend plus-darker) | #FFFFFF |
| Glass Prominent / Disabled | `Liquid Glass/Light/Regular - Small` | — | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Glass Prominent / Destructive | `Liquid Glass/Dark/Regular - Small - Tinted` | #FFFFFF@96% + #FF383C {System Colors/Light/1 Red} (blend plus-darker) | #FFFFFF |
| Glass Prominent / Destructive + Disabled | `Liquid Glass/Light/Regular - Small` | — | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Destructive / Destructive | `Liquid Glass/Light/Regular - Small` | — | #FF383C {System Colors/Light/1 Red} |
| Destructive / Disabled | `Liquid Glass/Light/Regular - Small` | — | #3C3C43@30% {Labels/Light/3 Tertiary} |

### Glass buttons — Dark

| Style / Variant | Glass layer | Tint layer | Label colour |
|---|---|---|---|
| Glass / Default (first of two) | `Liquid Glass/Dark/Regular - Small` | — | #FFFFFF {Labels/Dark/1 Primary} |
| Glass / Default (second of two) | `Liquid Glass/Dark/Regular - Small` | — | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Glass / Destructive | `Liquid Glass/Dark/Regular - Small` | — | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Glass Prominent / Default | `Liquid Glass/Light/Regular - Small - Tinted` | #FFFFFF@96% + #0091FF {System Colors/Dark/8 Blue} (blend plus-darker) | #FFFFFF |
| Glass Prominent / Disabled | `Liquid Glass/Dark/Regular - Small` | — | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Glass Prominent / Destructive | `Liquid Glass/Light/Regular - Small - Tinted` | #FFFFFF@96% + #FF4245 {System Colors/Dark/1 Red} (blend plus-darker) | #FFFFFF |
| Glass Prominent / Destructive + Disabled | `Liquid Glass/Dark/Regular - Small` | — | #EBEBF5@30% {Labels/Dark/3 Tertiary} |
| Destructive / Destructive | `Liquid Glass/Dark/Regular - Small` | — | #FF4245 {System Colors/Dark/1 Red} |

The Dark Glass names don't line up with Light: the Dark "Glass / Destructive" and the second Dark "Glass / Default" both have the tertiary (disabled) label colour, where Light has "Glass / Disabled" and "Destructive / Disabled". Dark has no component named "Destructive / Disabled". In the spec file the tertiary-label Dark Glass/Default set comes first (Large at line 759), the primary-label set second (Large at line 795).

Disabled glass buttons keep the full glass style; only the label colour changes. Tinted variants lose the tint layer and go back to plain glass when disabled.

## Text

| Part | Font | Size | Line height | Tracking | Align | Content |
|---|---|---|---|---|---|---|
| Label, Large and Medium filled/borderless | SFPro-Regular | 17 | 18 | Not in the kit (no kern value) | left | "Play" |
| Label, Small filled/borderless | SFPro-Regular | 15 | 18 | Not in the kit | left | "Play" |
| Symbol, Large and Medium | SFPro-Regular | 17 | 18 | Not in the kit | left in Symbol + Text, centre in Symbol | 􀊄 U+100284 |
| Symbol, Small | SFPro-Regular | 15 | 18 | Not in the kit | left / centre | 􀊄 U+100284 |
| Label, glass Large and Regular | SFPro-Medium | 17 | 18 | Not in the kit | centre | "Label" |
| Label, glass Small | SFPro-Medium | 15 | 18 | Not in the kit | centre | "Label" |

No text layer on this page binds a shared text style (no `textstyle` reference). Compared with `text-styles.md`: the 15 / 18 labels match the values of `Tight Leading/08 Subheadline/1 Default` (SFPro-Regular 15 / 18); no style there pairs size 17 with line height 18 (Body is 17 / 22, Tight Leading Body 17 / 20), and no style uses SFPro-Medium at 17 or 15.

## Effects

Filled and borderless buttons have no shadows, blurs or borders. The only effects are:

- `blend darken` on the text layers of Light Destructive Bordered (Idle and Disabled).
- `opacity 49.2%` on the text layers of Dark Destructive Borderless 4 - Disabled.

Glass buttons use four shared styles from `materials.md`. The inline expansion on every glass component matches the token exactly (checked by script on all 48 lines that use a style); the components add `corners max smoothing0.6 style1` where the token has none.

| Style | Fill stack (bottom first) | Glass blur | Outer shadows |
|---|---|---|---|
| Liquid Glass/Light/Regular - Small | #F8F8F8@20% (luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (plus-lighter) | radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0 | x0 y8 blur15 #000000@2%; spread0.5 #DBDBDB (plus-darker); x±1.25 spread-0.75 #DBDBDB (plus-darker) |
| Liquid Glass/Dark/Regular - Small | #000000 (screen) + #999999@17% | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 | x0 y8 blur15 #000000@4%; spread0.5 #BFBFBF (plus-darker); x±1.25 spread-0.75 #BFBFBF (plus-darker) |
| Liquid Glass/Light/Regular - Small - Tinted | #FFFFFF (multiply) | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 | x0 y8 blur15 #000000@4%; x±1.25 spread-0.75 #E6E6E6 (plus-darker) |
| Liquid Glass/Dark/Regular - Small - Tinted | #000000 (screen) | radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0 | x0 y8 blur15 #000000@4%; x±1.25 spread-0.75 #E6E6E6 (plus-darker) |

Each of these also has eight to nine inner shadows (edge highlights in plus-lighter and side shading in plus-darker); `materials.md` lists them all.

Tint layer on Glass Prominent: `fill #FFFFFF@96% + <System Blue or Red> (blend plus-darker)`, drawn 0.5 pt larger than the button on every side (W+1 × H+1 @-0.5,-0.5), under the tinted glass.

## Kit notes

The page has no documentation boards. Its only non-component layer is a `_Header` instance (1600 × 126) with the title "Buttons" and a description that the dump cuts off after "A button initiates an instantaneous acti…". The full text is Not in the dump.

## Finding it in the spec

| Family / part | grep |
|---|---|
| All filled and borderless buttons (216) | `grep -nE '^COMPONENT "Buttons/.*/(1 - Idle\|4 - Disabled)"' specs/buttons.txt` |
| One style, e.g. Bordered Prominent | `grep -n '^COMPONENT .*/Bordered Prominent/' specs/buttons.txt` |
| Destructive filled and borderless (108) | `grep -n '^COMPONENT "Buttons/[A-Za-z]*/[A-Za-z]*/Destructive/Border' specs/buttons.txt` |
| Disabled filled and borderless | `grep -n '^COMPONENT .*4 - Disabled' specs/buttons.txt` |
| All glass buttons (48) | `grep -nE '^COMPONENT "Buttons/[^/]*/[^/]*/(Glass\|Glass Prominent\|Destructive)/[^/]*"' specs/buttons.txt` |
| Glass Prominent tint layers | `grep -n 'group "Tint Color"' specs/buttons.txt` |
| Tinted glass layers | `grep -n 'group "Tinted Glass"' specs/buttons.txt` |
| Page header | `grep -n '_Header' specs/buttons.txt` |
