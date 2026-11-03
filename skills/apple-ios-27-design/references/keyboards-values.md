# Keyboards: sizes, colours, text and effects — iOS 27

**Read when:** you need the sizes, colours, text and effects of keyboards on iOS 27, as Apple's kit draws them.
**Owns:** Keyboards in Apple's iOS 27 kit: sizes, colours and states, text, effects, kit notes.

Source: `specs/keyboards.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `keyboards.md`.

## Sizes

### Key masters (iPhone and iPhone Duo)

Masters are 50×43 (Dark iPhone: 48×43); instances are resized in the key pads. Cells give size, corner radius, label font and size.

| Key | iPhone | Duo Outer Portrait | Duo Outer Landscape | Duo Inner Portrait | Duo Inner Landscape |
|---|---|---|---|---|---|
| UpperCase "Q" | r8.5 · Compact-Regular 23 | r10 · 24 | r10 · 24 | r12 · 29 | r12 · 29 |
| LowerCase "q" | r8.5 · 25 | r10 · 25 | r10 · 25 | r12 · 31 | r12 · 30 |
| Punctuation "." | r8.5 · 27 | r10 · 27 | r10 · 27 | r12 · 27 | r12 · 34 |
| Special / Key-Punctuation "#" | r8.5 · 23 | r10 · 23 | r10 · 23 | r12 · 27 | r12 · 23 |
| Symbol `􀰑` U+100C11 | r8.5 · 19 | r10 · 20 | r10 · 20 (Light 19) | r12 · 22 | r12 · 22 |
| Shift/On `􀆞`, Shift/Off `􀆝` | r8.5 · 20 (Dark), 23 (Light) | r10 · 23 | r10 · 23 | r12 · 23 | r12 · 23 |
| Delete `􀆛` U+10019B | r8.5 · 20 | r10 · 21 | r10 · 20 | r12 · 22 | r12 · 21 |
| Return/Default, Return/Prominent `􀅇` | r8.5 · 20 | r10 · 20 | r10 · 20 | r12 · 22 | r12 · 22 |
| Keyboard Switch/123 | r8.5 · 18 lh23 (Dark), 19 (Light) | r10 · 19 | r10 · 19 | r12 · 24 | r12 · 23 |
| Keyboard Switch/ABC | r8.5 · 18 lh23 kern0.28 (Dark), 19 kern0.3 (Light) | r10 · 19 kern0.3 | r10 · 19 kern0.3 | r12 · 24 kern0.37 | r12 · 23 kern0.36 |
| .com | r8.5 · 18 lh23 (Dark), 19 (Light) | r10 · 19 | r10 · 19 | r12 · 19 | r12 · 19 |
| Number and Punctuation Switch/123 | r8.5 · CompactRounded-Medium 16 | 16 | 16 | 18 | 18 |
| Number and Punctuation Switch/#+= | r8.5 · SFPro-Medium 14 kern0.22 | 14 | 14 | 14 | 14 |

Fonts are SFCompact-Regular unless the cell says otherwise. Some masters pad the label box (UpperCase, Keyboard Switch `pad0,0,2,0`; LowerCase `pad0,0,3,0`; .com `pad0,0,5,0`; Delete `pad2,0,0,0`).

### iPhone and iPhone Duo key pad rows (Letters Upper Case)

| Key pad | Row 1 | Row 2 | Row 3 | Row 4 |
|---|---|---|---|---|
| iPhone, Dark | 10 × 33.47, gap 6 | 9 × 33.41, gap 6, side pad 20 | Shift and Delete 48, 7 × 32.76 (gap 6), row gap 13.66 | bottom row 388.66×43 |
| iPhone, Light | 10 × 33.47 | 9 × 33.41, pad 20 | Shift and Delete 45.67, 7 × 33.52, row gap 13.33 | 388.66×43 |
| Duo Outer Portrait, Dark | 10 × 37.06, gap 6.67 | 9 × 36.89, gap 7, pad 21.33 | 50.67 side keys, 7 × 38, row gap 13.66 | 334.66×42 between 42×42 emoji and mic cells, gap 6 |
| Duo Outer Portrait, Light | 10 × 37.67, gap 6 | 9 × 37.78, gap 6, pad 21.33 | 50.67, 7 × 37.71, row gap 14.67 | same |
| Duo Outer Landscape | 10 × 45.4, gap 6.67 | 9 × 45.11, gap 7, pad 26 | 60.67, 7 × 45.14 (Light 45.05), row gap 17.33 (Light 17.67) | 399.33×33 inside pad 57.33 (Light 514×33, no pad) |
| Duo Inner Portrait | 10 × 55.27, gap 9 | 9 × 55.07, gap 9, pad 33 | 74.33, 7 × 55.28, row gap 22 | 633.66×49.67 |
| Duo Inner Landscape, Dark | 10 × 69.1, gap 10 | 9 × 72.04, gap 10, pad 26.33 | 92.67, 7 × 71.67 (inner gap 7), row gap 26 | 733.67×42 inside pad 23.67 |
| Duo Inner Landscape, Light | 10 × 69.1 | 9 × 69.07, pad 39.67 | 92.67, 7 × 69.09 (inner gap 10) | same |

Row heights: iPhone 43; Duo Outer Portrait 42; Outer Landscape 33.3 (Light 33.33); Inner Portrait 49.67; Inner Landscape 42.33.

Numbers and Punctuation / Punctuation and Special Characters: rows 1 and 2 are 10 keys at the Row 1 width; row 3 has two side keys and 5 middle keys:

| Key pad | Row 3 side / middle keys | Row 3 gap |
|---|---|---|
| iPhone, Dark | 48 / 5 × 48.26 | 13.67 |
| iPhone, Light | 45.67 (Numbers: 45.67 and 45.33) / 5 × 49.27 (Numbers), 49.2 (Punctuation) | 13.67 |
| Duo Outer Portrait | 51 / 55.46 (Light 50.67 / 55.6) | 13.67 |
| Duo Outer Landscape | 61.67 / 68.67 (Numbers), 67.33 (Punctuation); Light 60.67 / 67.47 | 13.67 / 17 (Light 17.67) |
| Duo Inner Portrait | 74.67 / 80.86 (Light 74.33 / 81) | 22 |
| Duo Inner Landscape | 92.67 / 100.73 | 26 |

### Bottom rows

| Device | W×H | Gap | Keyboard Switch | Space (Default) | Enter |
|---|---|---|---|---|---|
| iPhone | 388.66×43 | 6 | 92.67 | 191.99 (Light 190.99) | 92 (Light 93); Web Search 63 |
| Duo Outer Portrait | 388.66×42 (Dark Email, URL, Web Search: ×43) | 6 | 81 | 214.66 | 81 |
| Duo Outer Landscape | 518×33 | 7 | 98 | 308 | 98 |
| Duo Inner Portrait | 500×45 (Light ×42) | 9 | 151.67 | 178.67 | 151.67 |
| Duo Inner Landscape | 518×33 | 10 | 148.33 | 201.33 | 148.33 |

In Email, URL and Web Search the middle group keeps the Default space width and splits it: Email adds "@" and "." keys of 43.33; Web Search adds a 33.33 "." key and uses a 63-wide Return/Prominent on iPhone (Duo keeps the full Enter width).

### Other parts

| Part | W×H | Corner radius | Insets / gap |
|---|---|---|---|
| iPad key | 82–620 × 74 | 13 | letter gap 13.75 (derived) |
| Number pad key | 125×48 (instances 125.55×48) | 10 | gap 6 |
| Accessory Toolbar actions group | 194×48 | max | pad 0,10,0,10, gap 10 |
| Toolbar Action | 36×36 | — | — |
| Find text field | 230×48 | 100 (Light max) | label x 48 |
| Find and Replace background | 378×101 | 27 | 12 from each side |
| Find / Replace fields | 234–236 × 36 | 18 | gap 2 / 5 |
| Search - Placeholder field | 320×48 | max | pad 0,16,0,12, gap 6 |
| Emoji search field / Genmoji button | 250×40 / 118×40 | 20 | gap 10 between them |
| Emoji selected tab | 30×30 | 15 | pad 6 |
| Keyboard glass, iPhone | 402 wide | 27/27/62/62 | top pad 24 |

## Colours and states

### Keyboard background

| Appearance | Style |
|---|---|
| Dark | `style="Liquid Glass/Dark/Keyboard Background"` (exception: Dark iPhone Alpha's glass group stores a variant, see Effects) |
| Light | `style="Liquid Glass/Light/Keyboard Background"` |

### Keys

| Key | Dark fill | Dark label | Light fill | Light label |
|---|---|---|---|---|
| iPhone and Duo keys | #EDEDED@17% (unbound) | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, plus-lighter | #191919 (blend plus-lighter) + #FFFFFF@67% | #000000 {Labels/Light/1 Primary}, plus-darker |
| Return/Prominent (all devices) | #0091FF {System Colors/Dark/8 Blue} | #FFFFFF, no blend | #0088FF {System Colors/Light/8 Blue} | #FFFFFF |
| iPad keys | #454545 (unbound), component blend plus-lighter | main #A6A6A6, top character #4C4C4C (unbound), plus-lighter | #191919 (plus-lighter) + #FFFFFF@67% | main #595959, top character #B2B2B2 (unbound), plus-darker |
| iPad Return - Prominent | #0091FF {System Colors/Dark/8 Blue} | #FFFFFF | #0088FF {System Colors/Light/8 Blue} | #FFFFFF |
| Number pad Number and 0 | #EDEDED@17% | #FFFFFF {Labels/Dark/1 Primary}, plus-lighter | #191919 (plus-lighter) + #FFFFFF@67% | #000000 {Labels/Light/1 Primary}, plus-darker |
| Number pad Delete, Lower Left | none | #FFFFFF {Labels/Dark/1 Primary} | none | #000000 {Labels/Light/1 Primary} |

### Keyboard chrome

| Part | Dark | Light |
|---|---|---|
| Emoji, mic and ABC glyphs (bottom controls, Duo pads) | #FFFFFF {Labels/Dark/1 Primary} | #000000 {Labels/Light/1 Primary} |
| iPad top-left glyphs | #999999 {Labels/Dark - Vibrant/2 Secondary}, plus-lighter | #999999 {Labels/Light - Vibrant/2 Secondary}, plus-darker |
| iPhone suggestions text | #FFFFFF {Labels/Dark/1 Primary}, opacity 90% | #000000 {Labels/Light/1 Primary}, opacity 90% |
| iPhone suggestions divider | #FFFFFF, opacity 18.4%, plus-lighter | #000000, opacity 18.4%, plus-darker |
| iPad suggestions text | #FFFFFF {Labels/Dark/1 Primary}, opacity 90%, plus-lighter | #000000 (unbound), opacity 90%, plus-darker |
| iPad suggestions divider | #333333 {Fills/Dark - Vibrant/1 Primary}, plus-lighter | #CCCCCC {Fills/Light - Vibrant/1 Primary}, plus-darker |
| Emoji search field, Genmoji button | #767680@24% {Fills/Dark/3 Tertiary} | #767680@12% {Fills/Light/3 Tertiary}, plus-lighter |
| Emoji search placeholder and `􀊫` | #EBEBF5@30% {Labels/Dark/3 Tertiary}, plus-lighter | #3C3C43@30% {Labels/Light/3 Tertiary}, plus-darker |
| "Genmoji" text and shape | #FF0000 text with `fill image + #000000@5% (plus-darker)` | same |
| Emoji tabs, unselected | #EBEBF5@60% {Labels/Dark/2 Secondary} | #000000@40%, plus-darker (`􀋉`: #3C3C43@60% {Labels/Light/2 Secondary}) |
| Emoji selected tab | fill #767680@24% {Fills/Dark/3 Tertiary}; glyph #EBEBF5@60% | fill #000000@8% (plus-darker); glyph #000000 |
| Emoji tab-row delete `􀆛` | #EBEBF5@60% {Labels/Dark/2 Secondary} | #000000@40%, plus-darker |
| Emoji characters | AppleColorEmoji, text colour #007AFF stored | same |

### Accessory bars

| Part / state | Dark | Light |
|---|---|---|
| Glass (Toolbar group, Find field, stepper, Done, Find and Replace background, Search field) | `Liquid Glass/Dark/Regular - Small` | `Liquid Glass/Light/Regular - Small` |
| Toolbar Action symbol | #FFFFFF {Labels/Dark/1 Primary} | #000000 {Label Colors/1 Label Light} |
| Previous / Next, Enabled | #FFFFFF {Labels/Dark/1 Primary}, plus-lighter | #000000 {Labels/Light - Vibrant/1 Primary}, plus-darker |
| Previous / Next, Disabled | #404040 {Labels/Dark - Vibrant/3 Tertiary}, plus-lighter | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, plus-darker |
| Find Done, Enabled | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, plus-lighter | #0088FF {System Colors/Light/8 Blue}, no blend |
| Find Done, Disabled | #404040 {Labels/Dark - Vibrant/3 Tertiary} | #BFBFBF {Labels/Light - Vibrant/3 Tertiary} |
| Search Menu glyph | #FFFFFF {Labels/Dark/1 Primary} | #000000 {Labels/Light - Vibrant/1 Primary}, plus-darker |
| Find placeholder | #EBEBF5@30% {Labels/Dark/3 Tertiary}, plus-lighter | #BFBFBF {Labels/Light - Vibrant/3 Tertiary}, plus-darker |
| Find value | #FFFFFF {Labels/Dark/1 Primary} | #000000 {Labels/Light/1 Primary} |
| Find / Replace field fill | #121212 {Fills/Dark - Vibrant/3 Tertiary}, plus-lighter | #EDEDED {Fills/Light - Vibrant/3 Tertiary}, plus-darker |
| Field placeholders ("Find", "Replace") | #EBEBF5@30% {Labels/Dark/3 Tertiary} | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Field values ("Find", "Dukes") | #FFFFFF {Labels/Dark/1 Primary} | #000000 {Labels/Light/1 Primary} |
| "1 of 6", `􀁡` | #999999 {Labels/Dark - Vibrant/2 Secondary} | "1 of 6" #3C3C43@60% {Labels/Light/2 Secondary}; `􀁡` #999999 {Labels/Light - Vibrant/2 Secondary} |
| `􀈊` in Replace field | #999999 {Labels/Dark - Vibrant/2 Secondary} | #3C3C43@60% (unbound) |
| "Done", "Replace" text buttons | #0091FF {System Colors/Dark/8 Blue} | #0088FF {System Colors/Light/8 Blue} |
| Search - Placeholder glyphs (`􀊫`, mic) | #FFFFFF {Labels/Dark - Vibrant/1 Primary}, plus-lighter | #000000 {Labels/Light - Vibrant/1 Primary}, plus-darker |
| Search - Placeholder text | #404040 {Labels/Dark - Vibrant/3 Tertiary} | #3C3C43@30% {Labels/Light/3 Tertiary} |
| Cursor (Find Field/Value) | override #0091FF {System Colors/Dark/8 Blue} | master colour (no override) |

The Find stepper default instance shows Previous Enabled and Next Disabled; Light Find and Replace uses Previous Disabled, Dark uses Previous Enabled.

## Text

| Part | Font | Size | Line height | Tracking | Text style |
|---|---|---|---|---|---|
| iPhone / Duo key labels | SFCompact-Regular | 19–34 (table in Sizes) | — (Dark iPhone ABC/123/.com: lh23) | 0, ABC 0.28–0.37 | none |
| "123" switch | SFCompactRounded-Medium | 16 (Duo Inner 18) | — | 0 | none |
| "#+=" switch | SFPro-Medium | 14 | — | 0.22 | none |
| iPad main characters | SFCompact-Regular | 30 (Upper), 33 (Lower), 29 (2-story punctuation), 34 (1-story) | — | 0 | none |
| iPad top characters | SFCompact-Regular | 18 | — | 0 | none |
| iPad command / return glyphs, ".?123" | SFCompact-Regular | 23 | — | 0 | none |
| Number pad digits | SFCompact-Regular | 23 | 22 (Number key) | 0 | none |
| Number pad letters "ABC" | SFCompact-Medium (Dark), SFCompact-Regular (Light) | 13 | 11 | 0 | none; stored `transform1` |
| Suggestions | SFPro-Regular | 18 | 21 (iPhone), — (iPad) | 0 | none |
| Bottom-control mic `􀊰` (Light text) | SFCompact-Regular | 24 | — | -0.52 | none |
| Bottom-control `􀥊` | SFCompact-Regular | 24.32 (Dark), 21 (Light) | — | -0.52 / -0.45 | none |
| Duo landscape mic | SFCompact-Regular | 28 | — | -0.6 | none |
| Duo Inner Portrait mic | SFCompact-Regular | 30 | — | -0.65 | none |
| Accessory actions | SFPro-Regular | 17 | — | 0 | none |
| Find / Replace text, field values, "1 of 6" | SFPro-Regular | 17 | 22 | 0 | 06 Body/1 Default on most Dark layers; Light stores it only on the Replace field texts |
| Find / Replace glyphs `􀆇` `􀆈` `􀈊` `􀁡` | SFPro-Regular | 17 | 22 | 0 | none |
| Search Menu `􀰖` | SFCompact-Regular | 13 | 22 | 0 | none |
| Done glyph `􀆅` | SFPro-Semibold | 19 | 22 | 0 | none |
| "Done" text button | SFPro-Semibold | 16 | 22 | 0 | none |
| "Replace" text button | SFPro-Regular | 16 | — | 0 | none |
| Search - Placeholder text | SFPro-Regular | 17 | 22 | 0 | none |
| Search - Placeholder glyphs | SFCompact-Medium | 14 | 22 | 0 | none |
| Emoji search placeholder, `􀊫` | SFPro-Regular | 17 | — | 0 | none |
| "Genmoji" | SFPro-Medium | 17 | — | 0 | none |
| Emoji tab glyphs | SFPro-Regular | 15 (delete 20) | — | 0 | none; `transform1` on tab glyphs |
| Emoji | AppleColorEmoji | 38 | — | 0 | none |

Every layer that names `06 Body/1 Default` matches the style's font, size and line height (SFPro-Regular 17 lh22).

## Effects

```
Liquid Glass/Dark/Keyboard Background
  fill #000000@25% + #CCCCCC (blend plus-darker) + #0D0D0D (blend plus-lighter) + #262626@90% (blend luminosity)
  inner-shadow x0 y0 blur8 spread0 #000000@10% (blend overlay)
  inner-shadow x0 y-1.5 blur0.25 spread-1.25 #4C4C4C (plus-lighter)
  inner-shadow x0 y-1.5 blur0.25 spread0 #1A1A1A (blend color-dodge)
  inner-shadow x0 y1.5 blur0.25 spread-1.25 #4C4C4C (plus-lighter)
  inner-shadow x0 y1 blur0.25 spread0 #1A1A1A (blend color-dodge)
  blur glass radius8 saturation1 brightness1 distortion0.4 depth0.8 chromatic0

Dark iPhone Alpha glass group (same style name, stored differently)
  fill as above · inner-shadow x0 y0 blur8 spread0 #000000@10% (overlay)
  inner-shadow x0 y-1.5 blur0.25 spread-1.25 #4C4C4C (plus-lighter) · inner-shadow x0 y1.5 blur0.25 spread-1.25 #4C4C4C (plus-lighter)
  inner-shadow x0 y-1 blur0.25 spread0 #1A1A1A (color-dodge) · inner-shadow x0 y1 blur0.25 spread0 #1A1A1A (color-dodge)
  blur glass radius8 saturation1 brightness1 distortion0.4 depth0.8 chromatic0

Liquid Glass/Light/Keyboard Background
  fill #D4D4D4@74% (blend luminosity) + #1B1B1B (blend plus-lighter) + #E6E9ED (blend plus-darker)
  inner-shadow x0 y0 blur8 spread1 #000000@20% (plus-lighter)
  inner-shadow x0 y-1 blur2 spread0 #1A1A1A (plus-lighter) · inner-shadow x0 y1 blur2 spread0 #1A1A1A (plus-lighter)
  inner-shadow x0 y2 blur0.25 spread-1.5 #FFFFFF@70%
  blur glass radius4 saturation1 brightness1 distortion0.3 depth0.8 chromatic0
  corners 27 smoothing0.6 style1
```

The accessory bars use `Liquid Glass/{Dark,Light}/Regular - Small`; its full stack is listed in `toolbars.md` (Effects) and `materials.md`. A script check confirmed that every inline effect list on this page equals its named style, except the Dark iPhone Alpha group above.

| Part | Effect |
|---|---|
| Keys | Dark key labels blend plus-lighter; Light key labels plus-darker; Light key fill's dark layer #191919 blends plus-lighter |
| iPad Dark keys | the whole key component blends plus-lighter |
| Suggestions dividers | opacity 18.4% + plus-lighter / plus-darker |
| Emoji grid | clipped by rect "Mask" 402×253 @0,62 |

## Kit notes

- The page has no documentation boards. Its header (`_Header`, title "Keyboards") has a description that the dump keeps only up to "On devices without physical keyboards, t".
- The examples show each keyboard type in place: alpha (upper and lower case), numeric, punctuation, email, URL and web search versions of the iPhone keyboard (the latter three only change the bottom row), the number pad, the emoji keyboard, the iPad keyboard, and the iPhone Duo keyboards. All sit at the bottom edge of the screen.
- On iPhone the keyboard sits in one glass panel with the accessory bar floating 10 pt above it (derived: 58 − 48). On iPhone Duo the accessory bar is a search field with a close button, 12 pt above the panel.
- `specs/change-log.txt`: 27.1.0 added iPhone Duo symbols and examples, keyboards among them.

## Finding it in the spec

| Family | grep in `specs/keyboards.txt` |
|---|---|
| iPad keyboards and keys | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/\(􀻃/\)\?iPad/'` |
| iPhone keyboards (Alpha, Number Pad, Emoji) | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/iPhone\(/Alpha\|/Number Pad\|/Emoji\)\?"'` |
| iPhone key pads | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/iPhone/Key Pad/'` |
| iPhone bottom rows | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/Key Pad - Bottom Row/'` |
| iPhone keys | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/􀻃/Keys/iPhone/'` |
| Number pad keys, bottom controls | `grep -n 'Keys - Number Pad\|Bottom Controls'` |
| Suggestions | `grep -n '^COMPONENT "Keyboard/.*/Suggestions"'` |
| Accessories | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/iPhone/Accessories/'` |
| iPhone Duo keys | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/􀻃/Keys/iPhone Duo - '` |
| iPhone Duo keyboards, pads, bottom rows | `grep -n '^COMPONENT "Keyboard/[A-Za-z]*/iPhone Duo/'` |
| Examples | `grep -n '^COMPONENT "Examples/Keyboard/'` |
| Keyboard glass | `grep -n 'Keyboard Background'` |
