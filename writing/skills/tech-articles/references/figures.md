# Hand-drawn figures

Figures look like Excalidraw sketches: one idea per figure, little text, icons and small people,
and one highlighted path that matters. They are written as code, stored as plain `.excalidraw`
files, and rendered to SVG whose colours are theme tokens, so one figure works in light and dark.

## The method

1. **Source:** a small script per figure builds the scene with `scripts/excalidraw-scene.mjs` and
   writes `<figures>/<project>/<name>.excalidraw`. It is a normal Excalidraw file.
2. **Render:** at build time, turn each `.excalidraw` file into inline SVG drawn the way Excalidraw
   draws (rough.js, with each element's `seed` so strokes stay stable), mapping the palette's exact
   hex values to CSS variables. Nothing renders in the browser.
3. **Embed:** inline the SVG in a `<figure>` with a full `alt` (or `aria-label`) and a one-sentence
   `<figcaption>`. Inline, so the page's CSS variables reach it.
4. **Edit by hand if you like:** a `.excalidraw` file opens in excalidraw.com. After editing it
   there, its script is out of date: update the script, or delete it and treat the file as the
   source.

Without a build-time renderer, export SVG from excalidraw.com and replace the palette's hex values
with the same CSS variables; the theming works the same way.

**No AI image generation for diagrams.** It gets the details wrong.

## Palette

Use only these colours; the renderer maps them to theme tokens.

| Use | Stroke / text | Fill |
|---|---|---|
| main ink | `#1e1e1e` | — |
| secondary text | `#495057` (soft), `#868e96` (muted) | — |
| faint lines | `#ced4da` | — |
| the highlighted path or element | iris `#7f7cf2` | iris tint `#e9ebfe` |
| optional, outside or alternative paths | azure `#4f9bff` | azure tint `#e2eeff` |
| text on an iris pill | `#ffffff` | — |
| page and raised surfaces | — | `#ffffff`, `#f8f9fa`, chip `#e9ecef` |

Keep iris to the one path or element that matters, plus pills. Product logos are drawn in one
colour, like every other icon.

### Mapping colours to tokens

`#ffffff` means two things: as a **stroke** it is text on an accent (stays white); as a **fill** it
is the page. Map strokes and fills separately:

| Hex | As stroke | As fill |
|---|---|---|
| `#1e1e1e`, `#000000` | `--fig-ink` | `--fig-ink` |
| `#495057` | `--fig-soft` | — |
| `#868e96` | `--fig-muted` | — |
| `#ced4da` | `--fig-line` | — |
| `#7f7cf2` | `--fig-iris` | `--fig-iris` |
| `#4f9bff` | `--fig-azure` | `--fig-azure` |
| `#ffffff` | `--fig-on-accent` | `--fig-paper` |
| `#f8f9fa` | — | `--fig-raised` |
| `#e9ecef` | — | `--fig-chip` |
| `#e9ebfe` | — | `--fig-iris-tint` |
| `#e2eeff` | — | `--fig-azure-tint` |

Any other colour is drawn as it is (and will not follow the theme).

```css
.figure {
  --fig-ink: var(--fg);
  --fig-soft: var(--soft);
  --fig-muted: var(--muted);
  --fig-line: var(--chip);
  --fig-paper: var(--bg);
  --fig-raised: var(--surface);
  --fig-chip: var(--chip);
  --fig-iris: var(--accent-2);
  --fig-azure: var(--accent);
  --fig-iris-tint: color-mix(in oklab, #7f7cf2 16%, transparent);
  --fig-azure-tint: color-mix(in oklab, #4f9bff 14%, transparent);
  --fig-on-accent: #ffffff;
}
```

Tints are mixes with `transparent`, so the same figure sits on a light or a dark card.

Fonts: map Excalidraw's hand-drawn font ids to the site's sketch face (Excalifont) and its code font
ids to the site's mono face, through CSS variables as well.

## Helpers (`scripts/excalidraw-scene.mjs`)

```js
import { createScene } from './excalidraw-scene.mjs';

const s = createScene('orders-architecture');   // the prefix keeps ids, and so the strokes, stable
const { C } = s;                               // the palette above

s.frame({ w: 1120, h: 480 });                  // the canvas; the SVG is cropped to it
s.text({ x: 32, y: 24, text: 'How an order is placed', size: 30 });
s.squiggle({ x: 34, y: 70, w: 330 });          // iris wave under the title, ~15px per character
s.rect({ x, y, w, h, label, size: 18, stroke, fill, dashed, dotted });
s.ellipse({ … }); s.diamond({ … });
s.iconBox({ x, y, w, h, icon: 'bell', label: 'Notifications', layout: 'row' /* or 'stack' */, iconSize: 24 });
s.icon({ x, y, size: 28, name: 'database' /* or 'simple-icons:postgresql' */, color });
s.person({ x, y, size: 46 });                  // a hand-drawn person
s.pill({ x, y, w, label: 'Requester' });       // iris pill with white text
s.arrow({ points: [[x1, y1], [x2, y2]], color, dashed, dotted, curved, start: 'arrow' });
s.line({ … });
s.write('figures/orders/architecture.excalidraw');
```

Icons are Lucide names, or `simple-icons:<name>` for product logos, read from
`@iconify-json/lucide` and `@iconify-json/simple-icons` in the project. A missing name throws; look
it up in the set's `icons.json` first.

## Layout conventions

- **Canvas:** 1120 wide, height to fit. The title sits at (32, 24), size 30, with a squiggle under
  it. The title matches the section heading the figure sits under.
- **Text sizes:** labels 16–18, notes 15–16, never below 14. Cards usually shrink a figure to about
  0.75× on desktop.
- **Text width:** the helper estimates half the font size per character, which runs short. Leave
  padding, and check the preview for labels touching box edges.
- **Flow:** left to right, top to bottom. Solid iris arrows for the main path, muted dotted arrows
  for exits, dashed boxes for groups and outside things.
- **One idea per figure.** An icon in each box, and a person and a pill where people act.
- **No exact internal numbers** in figures about employers.
- On a phone, a wide figure scrolls sideways inside its card rather than shrinking to unreadable.

## Figure types that earn their place

- **Before/after**, for "the solution": the old flow on the left, the new on the right, the change
  in iris.
- **Architecture**: the moving parts and how they talk; outside systems dashed.
- **Feature map**: every module and what it does, to show the size of a system without paragraphs.
- **One flow**: a request, an event or an approval, step by step, with who acts as a pill.

## Workflow

1. Build the figures from their scripts.
2. **Preview in both themes**: a local page showing every figure on the dark and the light tokens
   side by side, with its size. Look for overlaps, cut-off labels and crossing arrows, and iterate.
3. **Check on the real page** at desktop and 375px after a build.
4. **Export for social posts**: a second local page draws each figure on a fixed light card (the
   palette's own hex values, about 1200px wide, generous padding, the site address small in a
   corner). Open it in a browser at a 1400px-wide viewport, wait for `document.fonts.ready`, and
   screenshot each card element at device scale. Playwright writes PNG or JPEG, so convert to WebP
   (with `sharp`) for upload.
5. **Serve both pages over HTTP**; browser tools often block `file://`.

Write alt text as the whole figure in words (boxes, arrows, outcome) and the caption as one sentence
on what to notice.
