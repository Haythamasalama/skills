---
name: apple-screens
description: Use when you need drawn Mac windows or iPhone screens in Apple's macOS 27 and iOS 27 style for a website, landing page, press kit, social post or other marketing image of an app. Draws the screen as HTML from ready templates — window chrome, sidebar, toolbar glass, window controls, status bar, large title, tab bar and home indicator, already set to the values in Apple's macOS 27 and iOS 27 UI Kits — then renders sharp PNGs with headless Chrome. Supports light and dark, active and inactive windows, and English or Arabic (right to left). Triggers include "draw the app for the website", "Mac window mockup", "iPhone screen for the landing page", "render a screenshot from HTML", «صور للموقع», «ارسم نافذة ماك», «صورة آيفون للتطبيق», «صور المتجر».
metadata:
  summary: "Draw Mac windows and iPhone screens as HTML, rendered to PNG."
  tags: design, apple
---

# Apple-style screens

**Read when:** you need a picture of an app in a Mac window or on an iPhone screen, drawn rather than captured.
**Owns:** the HTML/CSS templates, the render script, and the rules for drawing and checking those images.

Draw a screen in HTML, then render it with headless Chrome. The result stays sharp at any size, follows light and
dark, and works in every language. Nothing opens on the user's screen.

## TL;DR

- The templates already carry the kit's values for every part they draw (table below). For any part they don't
  have, take the numbers from Apple's macOS 27 or iOS 27 UI Kit (Apple Design Resources). If the kit doesn't have
  it, say so; don't invent one. **Why:** a made-up part is what makes a drawn screen look fake.
- Show only what the app really has. **Why:** a drawn feature the build lacks is a false claim on a public page.
- App Store product pages are a separate question: read the current App Review Guidelines
  (developer.apple.com/app-store/review/guidelines/) before using a drawn screen there. Real captures are the safe default.
- Use your own background (a brand gradient or your own photo), never Apple's wallpapers or app icons: they are
  Apple's artwork.
- Keep the kit's part sizes; scale the finished image, never the parts.
- Open every PNG and look at it before handing it over.

## What's here

| File | What it is |
|---|---|
| `assets/mac.css` | macOS 27 window chrome as CSS |
| `assets/mac-window.html` | A sample window: sidebar, unified toolbar with title, glass toolbar items, search |
| `assets/iphone.css` | iOS 27 iPhone screen (402 × 874) as CSS |
| `assets/iphone-screen.html` | A sample screen: status bar, large-title bar, list, tab bar, home indicator |
| `scripts/render.sh` | HTML → PNG at 2x with headless Chrome (macOS, Google Chrome installed) |
| `scripts/svgpath.py` | Prints a layer's outline from your own copy of the kit as SVG path data |

## Workflow

1. Copy the template you need into the project's own folder, such as the website repository. Don't edit the
   files in this skill.
2. Put the app's interface inside the template's content area: `.content` in both templates. Build any extra part
   (sidebar rows, buttons, list cells) from the kit's numbers for that component.
3. Render each variant you need, from the folder that holds the page (`<skill>` is this skill's folder):

   ```bash
   bash <skill>/scripts/render.sh page.html out/mac-light.png 1160 760
   bash <skill>/scripts/render.sh page.html out/mac-dark-ar.png 1160 760 "theme=dark&dir=rtl&lang=ar"
   bash <skill>/scripts/render.sh page.html out/mac-inactive.png 1160 760 "state=inactive"
   ```

   - The arguments are page, output, width, height, query and scale (default 2).
   - The sample pages read `theme`, `state`, `dir`, `lang` and `sidebar=0` from the query.
4. Open every PNG and check:
   - no text is cut off or overlapping
   - the glass reads over the background
   - the light and dark versions match
   - the Arabic version reads right to left
5. Hand over the files with their pixel sizes.

## The templates, part by part

### Mac window (`.mac`)

Add `dark` for dark, `inactive` for an inactive window, and `no-sidebar` for a window without one.

| Class | Kit part | Values |
|---|---|---|
| `.mac` | Windows page, effects | Radius 16. Active shadow 0 36 100 black 40% + 0 0 1 black 80%. Inactive shadow 0 16 32 black 20% |
| `.sidebar` | Windows page, sidebar pane | 256 wide, edge to edge, runs up under the bar. Light #FAFAFA@80% blur 100. Dark #0C0C0C@85% blur 80 saturation 2 |
| `.sidebar .bar` | Windows page, Unified + Title + Sidebar | 52 tall. Controls at x 18; toggle 36 at the trailing edge, 8 in |
| `.section-title` | Sidebars page, section header | SF Pro Bold 11/14, tertiary label |
| `.row`, `.row.selected` | Sidebars page, rows (Medium) | 32 tall, 20-wide symbol, gap 4. Selection overhangs 4 each side, radius 8, 11% at 50% |
| `.toolbar` | Windows page, unified toolbar | 52 tall, items 36, gap 8, padding 8 |
| `.title` | Titlebars and Toolbars page, window title | SF Pro Bold 15/15, tracking −0.2; subtitle Medium 11 |
| `.edge` | Windows page, Scroll Edge Effect - Top - Hard | Light white 85%, dark #1E1E1E 55%, blur 6, 0.67 line |
| `.controls` | Titlebars and Toolbars page, window controls | 14 circles, gap 9, the kit's fills and normal-blend inner shadows |
| `.glass`, `.glass b` | Titlebars and Toolbars page, toolbar items | XL capsule 36 tall, inner buttons 28, inset 4, gap 9 |
| `.search` | Titlebars and Toolbars page, toolbar search field | 159 × 36, padding 10, 16-wide glyph, gap 6 |

### iPhone screen (`.iphone`)

Add `dark` for dark.

| Class | Kit part | Values |
|---|---|---|
| `.status` | System page, status bar (iPhone 18 Pro) | 402 × 62. Time SF Pro Semibold 17.67/22 at 63.25, 21.5. Island 95 × 36.67 at 153.5, 14. Wi-Fi 19.33 × 14.33 and battery 29.33 × 13.67 at the kit's positions, drawn as simple shapes |
| `.nav` | Toolbars page, iPhone top bar (Large) | 402 × 105 at y 62. 44 glass buttons at x 16 and 342. Large title Bold 34/41 at 16, 54 |
| `.edge` | System page, scroll edge effect (Top - Soft) | Blur 100 under a top-to-bottom mask at 60% |
| `.tabbar`, `.tab` | Tab Bars page | Bar 402 × 99 at y 775, padding 16/21. Capsule 62 tall. Tab 54 tall: symbol Semibold 18/22 at y 7, label Semibold 10, tracking −0.1. Selected pill item + 8 |
| `.home` | System page, home indicator | 144 × 5, radius 100, 8 from the bottom |

## Where CSS can't match the kit

- **Plus-darker and plus-lighter blends.** Chrome has no plus-darker. A plus-darker colour c is drawn as black at
  alpha 1 − c, and a plus-lighter shadow as white at alpha c. Text keeps the kit's vibrant swatch colour with
  normal blending.
- **Liquid Glass.** Only the blur and saturation are used; Sketch's distortion and depth have no CSS form. Light
  glass fill is white at 52% (the kit's four stacked fills give 0.52 over black and 0.97 over white). Dark glass
  fill is #999999 at 17% (the kit's screen-blended black adds nothing).
- **Dark window controls.** The kit draws their shine with overlay and plus-lighter effects; only the top and
  bottom rims are kept.
- **Right to left.** The kit has no right-to-left layouts; `dir=rtl` mirrors the layout through the browser. The
  Mac window controls stay in their kit order. Directional glyphs don't flip by themselves: in Arabic, swap back
  and forward (`􀆉` / `􀆊`) yourself.
- **SF Symbols.** The glyphs (such as `􀊫`) draw only where the SF Pro fonts are installed (macOS with Apple's
  fonts). Use the code points the kit lists, and check each glyph in the render.

## Device frames and exact outlines

- Apple's product bezels (MacBook, iPhone frames) are a separate download from developer.apple.com/design/resources.
  Ask the user before downloading one, and follow Apple's marketing guidelines for them.
- `scripts/svgpath.py` prints a shape's path data from the kit's JSON, for parts drawn as shapes rather than text.
  Unzip `document.json`, `meta.json` and `pages/` from your own copy of the `.sketch` kit, then:

  ```bash
  python3 <skill>/scripts/svgpath.py <kit-json-dir> "Status Bars/iPhone 18 Pro/Light Background" Wifi Body
  ```

  It prints each named layer's size and path in the layer's own coordinates. Those outlines are Apple's artwork:
  fine for your own images under Apple's licence, but don't put them in templates you share.

## Brand and copy

- Take colours, backgrounds and copy from the app's own brand guide. The accent inside the drawn UI is the kit's
  system blue unless the app sets its own accent.
- If the website already draws part of the app in HTML, keep that and use these templates for the window or
  device around it.
