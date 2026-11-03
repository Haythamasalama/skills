# Scrollbars — macOS 27

**Read when:** you need an exact macOS 27 value for scrollbars (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Scrollbars in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/scrollbars.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀤏 (U+10090F).

## Components

4 components, one family.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Scroller | `Scrollbars/<Appearance>//<Orientation>` | Appearance: Light, Dark · (an empty level) · Orientation: Vertical, Horizontal | 4 |

The names have an empty level between the appearance and the orientation (`Scrollbars/Dark//Vertical`), as stored.

## Anatomy

| Layer | Kind | Notes |
|---|---|---|
| (component frame) | no fill | — |
| `Rectangle` | rect, corners max | the only visible layer |

Not in the kit: a track behind the `Rectangle`, arrows, or a wider hovered version.

## Sizes

| Orientation | Component | `Rectangle` | Inset (derived) | `Rectangle` thickness | Corners |
|---|---|---|---|---|---|
| Vertical | 12×64 | 6×58 @3,3 | 3 on every side = (12 − 6)/2 | 6 | max |
| Horizontal | 64×12 | 58×6 @3,3 | 3 on every side | 6 | max |

The component is 12 thick. The 64 length is the only length in the kit; a minimum length is not in the kit.

## Colours and states

| Appearance | `Rectangle` fill | Layer opacity | Blend |
|---|---|---|---|
| Light | #000000 | 50% | none |
| Dark | #FFFFFF | 55% | none |

The fills are plain hex values, not kit swatches. Hover and pressed states are not in the kit.

## Effects

None: no shadows, blurs or blend modes.

## Kit notes

The page has no documentation boards. Its only text is the headings Scrollbars, Light and Dark.

## Finding it in the spec

| Family | grep |
|---|---|
| Scrollers | `grep -n -A1 '^COMPONENT "Scrollbars/' specs/scrollbars.txt` |
