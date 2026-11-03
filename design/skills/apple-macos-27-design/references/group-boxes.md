# Group Boxes — macOS 27

**Read when:** you need an exact macOS 27 value for group Boxes (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Group Boxes in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/group-boxes.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀂒 (U+100092).

## Components

2 components, one family.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Group box | `Group Boxes/<Appearance>` | Appearance: Light, Dark | 2 |

## Anatomy

A single filled rounded rectangle with no child layers. A title label, border, separator or inner padding is not in the kit.

## Sizes

| Part | Size | Corners | Smoothing |
|---|---|---|---|
| Group box | 100×100 (sample size) | 12 | 0.6 |

Content insets: Not in the kit.

## Colours and states

| Appearance | Fill |
|---|---|
| Light | #000000@3% {Fills/Light/4 Quatenary} |
| Dark | #FFFFFF@3% {Fills/Dark/4 Quatenary} |

The swatch name is spelled `Quatenary` in the kit. No states.

## Effects

None: no border, shadow, blur or blend.

## Kit notes

The page has no documentation boards. Its only text is the headings Group Box, Light and Dark.

## Finding it in the spec

| Family | grep |
|---|---|
| Group boxes | `grep -n '^COMPONENT "Group Boxes/' specs/group-boxes.txt` |
