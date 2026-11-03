---
name: apple-ios-27-design
description: Use when designing, building, restyling or reviewing an iPhone or iPad app or iOS-style UI so it matches Apple's own components, or when you need an exact iOS value. Holds the values from Apple's iOS and iPadOS 27 UI Kit (Apple Design Resources, Sketch v27.1.3) — every component's sizes, corner radii, insets, colours for each state in light and dark, text styles and Dynamic Type sizes, materials and Liquid Glass — for toolbars and navigation bars, tab bars, sidebars, sheets, popovers, buttons, menus, segmented controls, lists, text fields, keyboards, toggles, sliders, pickers, alerts, the status bar, Home Screen, Lock Screen and Control Center, including iPhone Duo. Also for drawing iPhone screens in images for a website or App Store page. Triggers include "iOS 27 kit", "iPhone tab bar size", "match Apple's toolbar", "exact iOS colour", "Liquid Glass values", «ستايل الآيفون», «مقاسات الآيفون», «ألوان iOS», «مكونات الآيفون».
metadata:
  tags: design, apple
---

# iOS 27 design kit

**Read when:** you build, restyle, review or draw iPhone or iPad UI and need the exact number Apple's kit uses.
**Owns:** the iOS 27 kit's measured values — colours, text styles and Dynamic Type, materials, control styles and every component page.

The values come from Apple's iOS and iPadOS 27 UI Kit (developer.apple.com/design/resources, Sketch v27.1.3), read by
script; the colour page also uses the kit's Figma community copy. Apple's licence for the Apple Design Resources applies
to the kits themselves; this skill holds only measured values and written descriptions, not Apple's files or artwork.

## TL;DR

- Take values only from these files. If a value is not here, say "not in the kit". **Why:** a guess from memory,
  the HIG or a framework default looks right and is off by a point or a shade, which is the error this skill exists to stop.
- Every colour has a light and a dark value. Vibrant labels and fills only look right drawn with the blend mode
  the kit names (plus-darker on light surfaces, plus-lighter on dark ones).
- The kit's screens are iPhone 402 × 874, iPad Pro 11 1210 × 834 and three iPhone Duo canvases. Keep the kit's part
  sizes and scale the finished image, never the parts. **Why:** scaled parts stop matching every other value here.
- Glass bars and buttons use shared Liquid Glass styles; the component page names the style, `materials.md` holds it.
- The system control comes first. Use these specs to check a custom part against Apple's, to restyle a custom
  component so it matches, or to draw iPhone and iPad UI in images (website art, App Store pages).
- Start with the component's reference. Go to the raw page dump only for a value no reference lists, and name the
  component line it came from.

## Where each topic lives

| Need | File |
|---|---|
| A colour (accents, grays, backgrounds, labels, fills, separators, overlays) | `references/colors.md` |
| A text style (font, size, line height, tracking) | `references/text-styles.md` |
| Dynamic Type sizes per content size category | `references/text-styles-and-dynamic-type.md` |
| Liquid Glass and materials | `references/materials.md` |
| The fill a control uses per state | `references/control-styles.md` |
| Safe areas and margins (the kit has them for iPhone Duo only) | `references/layout-guides.md` |
| The kit's setup notes and licence, in summary | `references/getting-started.md` |
| One component | `references/<component>.md`, listed below |

## Components

**Bars and navigation:** [toolbars](references/toolbars.md) (values in [toolbars-values](references/toolbars-values.md)), [tab-bars](references/tab-bars.md), [sidebars](references/sidebars.md), [sheets](references/sheets.md), [popovers](references/popovers.md)

**Buttons and menus:** [buttons](references/buttons.md), [menus](references/menus.md), [segmented-controls](references/segmented-controls.md), [action-sheets](references/action-sheets.md), [activity-views](references/activity-views.md), [alerts](references/alerts.md)

**Lists and input:** [lists](references/lists.md), [text-fields](references/text-fields.md), [keyboards](references/keyboards.md) (values in [keyboards-values](references/keyboards-values.md)), [toggles](references/toggles.md), [sliders](references/sliders.md), [steppers](references/steppers.md), [date-and-time-pickers](references/date-and-time-pickers.md), [color-pickers](references/color-pickers.md), [page-controls](references/page-controls.md), [progress-indicators](references/progress-indicators.md)

**System and screens:** [system](references/system.md) (status bars, home indicators, iPad windows and menu bar, scroll edge effect), [system-screens](references/system-screens.md) (wallpapers, Home Screen, widgets, Quick Actions, Lock Screen, notifications, Control Center, app icon frames), [system-values](references/system-values.md) (sizes and colours), [system-text-and-effects](references/system-text-and-effects.md), [empty-states](references/empty-states.md), [faceid](references/faceid.md), [product-bezels](references/product-bezels.md)

Each component file lists what the kit leaves out and where the kit contradicts itself, so you can name the source
instead of guessing.

## The raw page dump (`specs/`, built locally)

Component references cite `specs/<page>.txt`. That folder is not shipped: it is a full dump of Apple's kit file,
so you build it on your own machine from your own download of the kit (steps 1–3 under "Updating to a newer kit",
then pass the dump folder to `gen_tokens.py`). Keep it out of anything you publish.

Each line is one layer; indentation shows nesting.

| Token | Meaning |
|---|---|
| `COMPONENT "A/B/C" W×H` | A kit component. The name path holds its variant axes: appearance, device, size, style and state |
| `BOARD` | A documentation artboard |
| `@x,y` | Position inside the parent, in points |
| `use "…" → Path [overrides]` | An instance of another component, with its overrides |
| `text "layer" "content" Font size lhN kernN colour align` | Font is a PostScript name, lh is line height, kern is tracking |
| `fill …` | Stacked fills, bottom first |
| `border W inside` | Border width and position |
| `shadow` / `inner-shadow` | x, y, blur, spread, colour |
| `blur background` / `blur glass` | Background blur or Sketch's glass effect, with radius and the other values |
| `corners R smoothingS styleN` | Corner radius (`max` = capsule or circle) and smoothing |
| `stack h\|v gapN padT,R,B,L` | Auto layout |
| `#RRGGBB@NN%` | Colour with alpha |
| `{Name}` | The kit swatch the colour is bound to |
| `style="…"` | A shared layer style |
| `blend plus-darker` / `blend plus-lighter` | Blend mode |
| `􀻃` (U+100EC3) in a path | Marks a building-block component that full screens are assembled from |

Hidden layers are left out. `specs/change-log.txt` lists Apple's changes per kit version.

## Updating to a newer kit

Run from this skill's folder. Python 3.10 or newer.

1. Download the iOS Sketch kit from Apple Design Resources and accept Apple's licence there yourself.
2. Unzip its JSON into a work folder outside this skill:
   `unzip "Apple iOS 27 UI Kit.sketch" 'document.json' 'meta.json' 'pages/*' -d <work>/kit`.
3. Dump the pages: `python3 scripts/extract.py <work>/kit <work>/dump`.
4. Rebuild the token pages: `python3 scripts/gen_tokens.py <work>/kit . <work>/dump`. This rewrites `text-styles.md`,
   `materials.md` and `control-styles.md`, adds the Liquid Glass labels to `colors.md` once, and copies the dump to `specs/`.
5. Rewrite the component references whose pages changed; `specs/change-log.txt` lists what Apple changed.
6. Check the new pages stay under 400 lines; split a long one into `<name>.md` and `<name>-values.md`.
