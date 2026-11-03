---
name: apple-macos-27-design
description: Use when designing, building, restyling or reviewing a Mac app or Mac-style UI so it matches Apple's own components, or when you need an exact macOS value. Holds the values from Apple's macOS 27 UI Kit (Apple Design Resources, Sketch v27.0.3, October 2026) — every component's sizes, corner radii, insets, colours for each state in light and dark, text styles, materials and Liquid Glass — for buttons, toolbars and titlebars, sidebars, windows, menus, pop-up buttons, segmented controls, toggles, sliders, fields, popovers and alerts. Also for drawing Mac UI in images for a website or App Store page. Triggers include "macOS 27 kit", "Apple's style", "match Apple's sidebar", "exact macOS colour", "Liquid Glass values", «ستايل آبل», «مقاسات الماك», «ألوان آبل», «مكونات الماك».
metadata:
  summary: "Exact values from Apple's macOS 27 UI Kit."
  tags: design, apple
---

# macOS 27 design kit

**Read when:** you build, restyle, review or draw Mac UI and need the exact number Apple's kit uses.
**Owns:** the macOS 27 kit's measured values — colours, text styles, materials, control styles and every component page.

The values come from Apple's macOS 27 UI Kit (developer.apple.com/design/resources, Sketch v27.0.3, 28 October 2026),
read by script. Apple's licence for the Apple Design Resources applies to the kits themselves; this skill holds only
measured values and written descriptions, not Apple's files or artwork.

## TL;DR

- Take values only from these files. If a value is not here, say "not in the kit". **Why:** a guess from memory,
  the HIG or a framework default looks right and is off by a point or a shade, which is the error this skill exists to stop.
- Every colour has a light and a dark value. Vibrant colours (`… Vibrant (use plus darker)` / `(use plus lighter)`)
  only look right drawn with that blend mode.
- Content Area and Over-glass are two contexts. The kit draws a control one way on window content and another way
  on glass bars (toolbars, sidebars). Pick the one where the control sits.
- The system control comes first. Use these specs to check a custom part against Apple's, to restyle a custom
  component so it matches, or to draw Mac UI in images (website art, App Store pages).
- Start with the component's reference. Go to the raw page dump only for a value no reference lists, and name the
  component line it came from.

## Where each topic lives

| Need | File |
|---|---|
| A colour (system colours, labels, fills, grays, separators, window backgrounds) | `references/colors.md` |
| A text style (Large Title … Caption 2, emphasized, loose and tight leading) | `references/text-styles.md` |
| Liquid Glass and materials | `references/materials.md` |
| Window, panel, sidebar backgrounds and global helpers (focus ring, glyph styles) | `references/surface-styles.md` |
| The fill a control uses per state (Idle, Hover, Clicked, Disabled) on window content | `references/control-styles-content-area.md` |
| The same on glass bars | `references/control-styles-over-glass.md` |
| The kit's setup notes and licence, in summary | `references/getting-started.md` |
| One component | `references/<component>.md`, listed below |

## Components

**Windows and bars:** [windows](references/windows.md), [titlebars-and-toolbars](references/titlebars-and-toolbars.md) (values in [titlebars-and-toolbars-values](references/titlebars-and-toolbars-values.md)), [sidebars](references/sidebars.md), [menu-bar-and-dock](references/menu-bar-and-dock.md), [popovers](references/popovers.md), [alerts](references/alerts.md), [dialogs](references/dialogs.md), [notifications](references/notifications.md), [tooltips](references/tooltips.md)

**Buttons and menus:** [buttons](references/buttons.md) (colours in [buttons-colours](references/buttons-colours.md)), [pop-up-and-pull-down-buttons](references/pop-up-and-pull-down-buttons.md), [segmented-controls](references/segmented-controls.md), [menus](references/menus.md), [disclosure-controls](references/disclosure-controls.md)

**Toggles:** [checkboxes](references/checkboxes.md), [radio-buttons](references/radio-buttons.md), [switches](references/switches.md)

**Fields and forms:** [text-fields](references/text-fields.md), [search-fields](references/search-fields.md), [combo-boxes](references/combo-boxes.md), [forms](references/forms.md), [steppers](references/steppers.md), [color-wells](references/color-wells.md), [image-wells](references/image-wells.md)

**Values and progress:** [sliders](references/sliders.md), [progress-indicators](references/progress-indicators.md), [scrollbars](references/scrollbars.md), [group-boxes](references/group-boxes.md)

**Other:** [pointers](references/pointers.md), [product-bezels](references/product-bezels.md)

Each component file lists what the kit leaves out and where the kit contradicts itself, so you can name the source
instead of guessing.

## The raw page dump (`specs/`, built locally)

Component references cite `specs/<page>.txt`. That folder is not shipped: it is a full dump of Apple's kit file,
so you build it on your own machine from your own download of the kit (steps 1–3 under "Updating to a newer kit",
then pass the dump folder to `gen_tokens.py`). Keep it out of anything you publish.

Each line is one layer; indentation shows nesting.

| Token | Meaning |
|---|---|
| `COMPONENT "A/B/C" W×H` | A kit component. The name path holds its variant axes: appearance, context, size (Mn, Sm, Rg, Lg, XL) and state |
| `BOARD` | A documentation artboard |
| `@x,y` | Position inside the parent, in points |
| `use "…" → Path [overrides]` | An instance of another component, with its overrides |
| `text "layer" "content" Font size lhN kernN colour align` | Font is a PostScript name, lh is line height, kern is tracking |
| `fill …` | Stacked fills, bottom first |
| `border W inside` | Border width and position |
| `shadow` / `inner-shadow` | x, y, blur, spread, colour |
| `blur background` / `blur glass` | Background blur or Sketch's glass effect, with radius and the other values |
| `corners R smoothingS styleN` | Corner radius (`max` = capsule or circle) and smoothing |
| `radius R` | Corner radius set per point |
| `stack h\|v gapN padT,R,B,L` | Auto layout |
| `#RRGGBB@NN%` | Colour with alpha |
| `{Name}` | The kit swatch the colour is bound to |
| `style="…"` | A shared layer style |
| `blend plus-darker` / `blend plus-lighter` | Blend mode |

Hidden layers are left out. `specs/change-log.txt` lists Apple's changes per kit version.

## Updating to a newer kit

Run from this skill's folder. Python 3.10 or newer.

1. Download the macOS Sketch kit from Apple Design Resources (its link is a sketch.com share with a Download button).
   Accept Apple's licence there yourself.
2. Unzip its JSON into a work folder outside this skill:
   `unzip "Apple macOS 27 UI Kit.sketch" 'document.json' 'meta.json' 'pages/*' -d <work>/kit`.
3. Dump the pages: `python3 scripts/extract.py <work>/kit <work>/dump`.
4. Rebuild the token pages: `python3 scripts/gen_tokens.py <work>/kit . <work>/dump`. This rewrites `colors.md`,
   `text-styles.md`, `materials.md`, `surface-styles.md` and both control-style pages, and copies the dump to `specs/`.
5. Rewrite the component references whose pages changed; `specs/change-log.txt` lists what Apple changed.
6. Check the new pages stay under 400 lines; split a long one into `<name>.md` and `<name>-values.md`.
