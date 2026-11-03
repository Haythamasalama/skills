# Control fill styles — iOS 27

**Read when:** you need an exact iOS 27 value for control fill styles as Apple's kit stores it.
**Owns:** the shared layer styles in the groups Controls.

Source: `Apple iOS 27 UI Kit.sketch` from Apple Design Resources (developer.apple.com/design/resources), read 2026-11-01. Every value below is copied from the kit's shared tokens by a script; nothing is estimated. Shared layer styles the controls use for each state. Component pages name the style each part uses.

## How to read the effect lines

- Colours are `#RRGGBB`, with `@NN%` for alpha below 100%. A name in `{braces}` is the kit swatch the colour is bound to.
- `blend plus-darker` / `blend plus-lighter` are the Plus Darker / Plus Lighter blend modes the kit uses for vibrant colours.
- `shadow` / `inner-shadow`: x offset, y offset, blur radius, spread, colour.
- `blur background`: background blur radius and saturation. `blur glass`: Sketch's glass effect with its radius, saturation, brightness, distortion, depth and chromatic aberration values.
- `corners R smoothingS styleN`: corner radius R (`max` = fully rounded, a capsule or circle), corner smoothing S and the kit's corner style number N, as stored.
- `opacity` is the layer opacity; a fill's own opacity and blend mode are in brackets after it.


## Controls/Dark

- **Controls/Dark/Knobs - Toggle/03 - Clicked - Glow**
  - border 1 outside #000000@20% (blend plus-darker)
  - corners 50 smoothing0.6 style1
- **Controls/Dark/Knobs - Toggle/03 - Clicked - Shadow**
  - border 1 inside #000000
  - blur gaussian radius3
  - corners max smoothing0.6 style1
- **Controls/Dark/Tracks/Active, Filled, 01 - Idle**
  - fill #0091FF {System Colors/Dark/8 Blue}
- **Controls/Dark/Tracks/Active, Filled, 03 - Clicked**
  - fill #0091FF {System Colors/Dark/8 Blue} + #FFFFFF@8%
- **Controls/Dark/Tracks/Active, Unfilled, 01 - Idle**
  - fill #FFFFFF@10%
- **Controls/Dark/Tracks/Active, Unfilled, 03 - Clicked**
  - fill #FFFFFF@19%
- **Controls/Dark/Tracks/Active, Unfilled, 04 - Disabled**
  - fill #FFFFFF@10%

## Controls/Light

- **Controls/Light/Knobs - Toggle/01 - Idle**
  - fill #FFFFFF
  - shadow x0 y3 blur36 spread0 #000000@5%
  - corners 50 smoothing0.6 style1
- **Controls/Light/Knobs - Toggle/03 - Clicked - Glow**
  - border 1 outside #D9D9D9 (blend plus-darker)
  - border 0.5 outside #FFFFFF@45%
  - corners 50 smoothing0.6 style1
- **Controls/Light/Knobs - Toggle/03 - Clicked - Shadow**
  - border 1 inside #000000
  - blur gaussian radius3
  - corners max smoothing0.6 style1
- **Controls/Light/Tracks/Active, Filled, 01 - Idle**
  - fill #0088FF {System Colors/Light/8 Blue}
- **Controls/Light/Tracks/Active, Filled, 03 - Clicked**
  - fill #0088FF {System Colors/Light/8 Blue} + #000000@8%
- **Controls/Light/Tracks/Active, Unfilled, 01 - Idle**
  - fill #000000@10%
- **Controls/Light/Tracks/Active, Unfilled, 03 - Clicked**
  - fill #000000@19%
- **Controls/Light/Tracks/Active, Unfilled, 04 - Disabled**
  - fill #000000@10%
