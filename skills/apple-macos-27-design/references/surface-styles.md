# Window, panel, sidebar and global styles — macOS 27

**Read when:** you need an exact macOS 27 value for window, panel, sidebar and global styles as Apple's kit stores it.
**Owns:** the shared layer styles in the groups Global, Panels, Sidebar, Windows.

Source: `Apple macOS 27 UI Kit.sketch` from Apple Design Resources (developer.apple.com/design/resources), read 2026-11-01. Every value below is copied from the kit's shared tokens by a script; nothing is estimated. These are the kit's shared layer styles for glass, materials and surfaces.

## How to read the effect lines

- Colours are `#RRGGBB`, with `@NN%` for alpha below 100%. A name in `{braces}` is the kit swatch the colour is bound to.
- `blend plus-darker` / `blend plus-lighter` are the Plus Darker / Plus Lighter blend modes the kit uses for vibrant colours.
- `shadow` / `inner-shadow`: x offset, y offset, blur radius, spread, colour.
- `blur background`: background blur radius and saturation. `blur glass`: Sketch's glass effect with its radius, saturation, brightness, distortion, depth and chromatic aberration values.
- `corners R smoothingS styleN`: corner radius R (`max` = fully rounded, a capsule or circle), corner smoothing S and the kit's corner style number N, as stored.
- `opacity` is the layer opacity; a fill's own opacity and blend mode are in brackets after it.


## Global/Color Area Outline

- **Global/Color Area Outline**
  - border 0.5 inside #000000@10%

## Global/Focus Ring

- **Global/Focus Ring**
  - border 3.5 outside #0088FF@25% (blend plus-darker)
  - border 1 outside #0088FF@15% (blend plus-darker)
  - blend plus-darker

## Global/Glyphs

- **Global/Glyphs/Dark/Colored - 1 Idle**
  - fill #0091FF {System Colors/Dark/8 Blue}
  - inner-shadow x0 y0 blur0 spread10 #FFFFFF@18% (blend plus-lighter)
  - blend plus-darker
- **Global/Glyphs/Dark/Colored - 4 Disabled**
  - fill #0091FF {System Colors/Dark/8 Blue}
  - inner-shadow x0 y0 blur0 spread10 #000000@18% (blend plus-darker)
  - opacity 30% blend plus-darker
- **Global/Glyphs/Dark/Neutral - 1 Idle**
  - fill #FFFFFF@70%
  - corners 1 smoothing0.6 style1
  - blend plus-lighter
- **Global/Glyphs/Dark/Neutral - 4 Disabled**
  - fill #FFFFFF@22%
  - corners 1 smoothing0.6 style1
  - blend plus-lighter
- **Global/Glyphs/Dark/Primary - 1 Idle**
  - fill #FFFFFF
- **Global/Glyphs/Dark/Primary - 4 Disabled**
  - fill #FFFFFF
  - opacity 50%
- **Global/Glyphs/Light/Colored - 1 Idle**
  - fill #0088FF {System Colors/Light/8 Blue}
  - inner-shadow x0 y0 blur0 spread10 #000000@18% (blend plus-darker)
  - blend plus-darker
- **Global/Glyphs/Light/Colored - 4 Disabled**
  - fill #0088FF {System Colors/Light/8 Blue}
  - inner-shadow x0 y0 blur0 spread10 #000000@18% (blend plus-darker)
  - opacity 30% blend plus-darker
- **Global/Glyphs/Light/Neutral - 1 Idle**
  - fill #000000@70%
  - corners 1 smoothing0.6 style1
  - blend plus-darker
- **Global/Glyphs/Light/Neutral - 4 Disabled**
  - fill #000000@22%
  - corners 1 smoothing0.6 style1
  - blend plus-darker
- **Global/Glyphs/Light/Primary - 1 Idle**
  - fill #FFFFFF
- **Global/Glyphs/Light/Primary - 4 Disabled**
  - fill #FFFFFF
  - opacity 50%

## Global/Progress Indicator Fill Fade Mask

- **Global/Progress Indicator Fill Fade Mask**
  - fill gradient linear {1, 0.5}→{0.0467012099365383, 0.499999999999999} [#000000 0%, #000000@40% 39.72%, #000000@0% 100%]
  - blur zoom radius15

## Panels/Dark

- **Panels/Dark**
  - fill #1E1E1E {Window Backgrounds/Dark Background}
  - border 1 inside #FFFFFF@20%
  - shadow x0 y16 blur33 spread0 #000000@40%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 15 smoothing0.6 style1

## Panels/Light

- **Panels/Light**
  - fill #FFFFFF
  - shadow x0 y5 blur20 spread0 #000000@30%
  - corners 15 smoothing0.6 style1

## Sidebar/Background

- **Sidebar/Background/Dark/Active**
  - fill #0C0C0C@85%
  - blur background radius80 saturation2
  - corners 0 smoothing0.6 style1
- **Sidebar/Background/Dark/Inactive**
  - fill #2E2E2E@85%
  - blur background radius70 saturation1.8
  - corners 0 smoothing0.6 style1
- **Sidebar/Background/Light/Active**
  - fill #FAFAFA@80%
  - blur background radius100 saturation1
  - corners 0 smoothing0.6 style1
- **Sidebar/Background/Light/Inactive**
  - fill #F4F4F4
  - blur background radius100 saturation1
  - corners 0 smoothing0.6 style1

## Windows/Dark

- **Windows/Dark/No Sidebar/Active**
  - fill #1E1E1E {Window Backgrounds/Dark Background}
  - border 1 inside #FFFFFF@20%
  - shadow x0 y16 blur33 spread0 #000000@40%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Dark/No Sidebar/Inactive**
  - fill #1E1E1E {Window Backgrounds/Dark Background}
  - shadow x0 y16 blur32 spread0 #000000@20%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Dark/With Sidebar/Active**
  - fill #000000 (blend screen)
  - shadow x0 y36 blur100 spread0 #000000@40%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Dark/With Sidebar/Inactive**
  - fill #000000 (blend screen)
  - shadow x0 y16 blur32 spread0 #000000@20%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1

## Windows/Light

- **Windows/Light/No Sidebar/Active**
  - fill #FFFFFF {Window Backgrounds/Light Background}
  - shadow x0 y36 blur100 spread0 #000000@40%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Light/No Sidebar/Inactive**
  - fill #FFFFFF {Window Backgrounds/Light Background}
  - shadow x0 y16 blur32 spread0 #000000@20%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Light/With Sidebar/Active**
  - fill #FFFFFF (blend multiply)
  - shadow x0 y36 blur100 spread0 #000000@40%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
- **Windows/Light/With Sidebar/Inactive**
  - fill #FFFFFF (blend multiply)
  - shadow x0 y16 blur32 spread0 #000000@20%
  - shadow x0 y0 blur1 spread0 #000000@80%
  - corners 16 smoothing0.6 style1
