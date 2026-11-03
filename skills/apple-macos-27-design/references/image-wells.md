# Image Wells — macOS 27

**Read when:** you need an exact macOS 27 value for image Wells (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Image Wells in Apple's macOS 27 kit: components, anatomy, sizes, colours and states, effects, kit notes.

Source: `specs/image-wells.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Page glyph: 􀏅 (U+1003C5).

## Components

2 components, one family.

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| Image well | `Image Wells/<Appearance>` | Appearance: Light, Dark | 2 |

There is no size, state or context axis.

## Anatomy

| Layer | Kind | Position and size | Notes |
|---|---|---|---|
| (component frame) | filled rounded rect with shadows | 28×28 | the well |
| `Image` | rect filled with a bitmap | 24×24 @2,2 | the picture; no corner radius in the dump |

## Sizes

| Part | Size | Corners | Inset (derived) |
|---|---|---|---|
| Well | 28×28 | 2 (smoothing 0.6) | — |
| `Image` | 24×24 | Not in the kit (none stored) | 2 on every side = (28 − 24)/2 |

The kit has one size only. Larger wells are not in the kit.

## Colours and states

| Appearance | Fill | Inner shadow | Shadows (in stored order) |
|---|---|---|---|
| Light | #000000@2% {Fills/Light/5 Quinary} | x0 y0 blur0 spread0.5 #000000@5% (blend plus-darker) | x0 y0 blur0 spread1.5 #000000@5% (blend plus-darker) · x0 y0 blur0 spread1 #FFFFFF |
| Dark | #FFFFFF@2% {Fills/Dark/5 Quinary} | x0 y0 blur0 spread0.5 #000000@5% (blend plus-darker) | x0 y0 blur0 spread1.5 #000000@5% (blend plus-darker) · x0 y0 blur0 spread1 #FFFFFF |

States (hover, selected, drop target, disabled): Not in the kit.

## Effects

All shadows have zero offset and zero blur, so they draw hard rings (derived):

- a 0.5-pt inside ring of #000000@5% (plus-darker)
- a 1-pt outside ring of #FFFFFF
- a 1.5-pt outside ring of #000000@5% (plus-darker)

The values are identical in Light and Dark; only the fill changes.

## Kit notes

The page has no documentation boards. Its only text is the headings Image Well, Light and Dark.

Kit inconsistency: the Dark well keeps the Light shadow set, including the solid #FFFFFF 1-pt ring.

## Finding it in the spec

| Family | grep |
|---|---|
| Image wells | `grep -n -A1 '^COMPONENT "Image Wells/' specs/image-wells.txt` |
