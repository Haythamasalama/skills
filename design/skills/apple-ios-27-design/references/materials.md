# Materials and Liquid Glass — iOS 27

**Read when:** you need an exact iOS 27 value for materials and Liquid Glass as Apple's kit stores it.
**Owns:** the shared layer styles in the groups Liquid Glass, Materials.

Source: `Apple iOS 27 UI Kit.sketch` from Apple Design Resources (developer.apple.com/design/resources), read 2026-11-01. Every value below is copied from the kit's shared tokens by a script; nothing is estimated. These are the kit's shared layer styles for glass, materials and surfaces.

## How to read the effect lines

- Colours are `#RRGGBB`, with `@NN%` for alpha below 100%. A name in `{braces}` is the kit swatch the colour is bound to.
- `blend plus-darker` / `blend plus-lighter` are the Plus Darker / Plus Lighter blend modes the kit uses for vibrant colours.
- `shadow` / `inner-shadow`: x offset, y offset, blur radius, spread, colour.
- `blur background`: background blur radius and saturation. `blur glass`: Sketch's glass effect with its radius, saturation, brightness, distortion, depth and chromatic aberration values.
- `corners R smoothingS styleN`: corner radius R (`max` = fully rounded, a capsule or circle), corner smoothing S and the kit's corner style number N, as stored.
- `opacity` is the layer opacity; a fill's own opacity and blend mode are in brackets after it.


## Liquid Glass/Clear

- **Liquid Glass/Clear**
  - fill #F8F8F8@12% (blend luminosity)
  - shadow x0 y8 blur15 spread0 #000000@2%
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y40 blur30 spread-40 #E6E6E6 (blend plus-darker)
  - inner-shadow x0 y-1 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y-40 blur20 spread-40 #404040 (blend plus-lighter)
  - inner-shadow x0 y40 blur20 spread-40 #404040 (blend plus-lighter)
  - blur glass radius3 saturation1 brightness1 distortion0.2 depth0.5 chromatic0
  - corners max smoothing0.6 style1

## Liquid Glass/Dark

- **Liquid Glass/Dark/App Library**
  - fill #F8F8F8@5% (blend screen)
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #111111 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #111111 (blend plus-lighter)
  - blur glass radius5 saturation1.3 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 17 smoothing0.6 style1
- **Liquid Glass/Dark/Dock**
  - fill #333333@33% (blend luminosity)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #111111 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #111111 (blend plus-lighter)
  - inner-shadow x0 y-35 blur15 spread-35 #0F0F0F (blend plus-lighter)
  - inner-shadow x0 y35 blur15 spread-35 #0F0F0F (blend plus-lighter)
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - blur glass radius3 saturation1 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 36 smoothing0.6 style1
- **Liquid Glass/Dark/Keyboard Background**
  - fill #000000@25% + #CCCCCC (blend plus-darker) + #0D0D0D (blend plus-lighter) + #262626@90% (blend luminosity)
  - inner-shadow x0 y0 blur8 spread0 #000000@10% (blend overlay)
  - inner-shadow x0 y-1.5 blur0.25 spread-1.25 #4C4C4C (blend plus-lighter)
  - inner-shadow x0 y-1.5 blur0.25 spread0 #1A1A1A (blend color-dodge)
  - inner-shadow x0 y1.5 blur0.25 spread-1.25 #4C4C4C (blend plus-lighter)
  - inner-shadow x0 y1 blur0.25 spread0 #1A1A1A (blend color-dodge)
  - blur glass radius8 saturation1 brightness1 distortion0.4 depth0.8 chromatic0
- **Liquid Glass/Dark/Regular - Large**
  - fill #1A1A1A@50% + #1A1A1A@90% (blend luminosity) + #1A1A1A (blend lighten)
  - inner-shadow x0 y-4 blur8 spread-4 #222222 (blend plus-lighter)
  - inner-shadow x0 y4 blur8 spread-4 #222222 (blend plus-lighter)
  - inner-shadow x0 y-1 blur1.5 spread-0.5 #404040 (blend plus-lighter)
  - inner-shadow x0 y1 blur1.5 spread-0.5 #404040 (blend plus-lighter)
  - inner-shadow x0 y2 blur0.2 spread-1.2 #FFFFFF@20%
  - shadow x0 y18 blur48 spread0 #000000@45%
  - shadow x0 y0 blur0.3 spread0.3 #000000@50%
  - shadow x-1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - blur glass radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0
  - corners 20 smoothing0.6 style1
- **Liquid Glass/Dark/Regular - Medium**
  - fill #1A1A1A@30% + #1A1A1A@30% (blend luminosity) + #1A1A1A (blend lighten)
  - inner-shadow x0 y-4 blur8 spread-4 #222222 (blend plus-lighter)
  - inner-shadow x0 y4 blur8 spread-4 #222222 (blend plus-lighter)
  - inner-shadow x0 y-1 blur1.5 spread-0.5 #404040 (blend plus-lighter)
  - inner-shadow x0 y1 blur1.5 spread-0.5 #404040 (blend plus-lighter)
  - inner-shadow x0 y2 blur0.2 spread-1.2 #FFFFFF@20%
  - shadow x0 y18 blur48 spread0 #000000@45%
  - shadow x0 y0 blur0.3 spread0.3 #A6A6A6 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #A6A6A6 (blend plus-darker)
  - blur glass radius30 saturation1.2 brightness1 distortion0.3 depth0.9 chromatic0
  - corners 20 smoothing0.6 style1
- **Liquid Glass/Dark/Regular - Small**
  - fill #000000 (blend screen) + #999999@17%
  - inner-shadow x20 y0 blur20 spread-30 #B2B2B2 (blend plus-darker)
  - inner-shadow x-20 y0 blur20 spread-30 #B2B2B2 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #171717 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #171717 (blend plus-lighter)
  - inner-shadow x0 y-40 blur10 spread-40 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y40 blur10 spread-40 #1A1A1A (blend plus-lighter)
  - shadow x0 y8 blur15 spread0 #000000@4%
  - shadow x0 y0 blur0 spread0.5 #BFBFBF (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0
  - corners max smoothing0.6 style1
- **Liquid Glass/Dark/Regular - Small - Inactive**
  - fill #767680@24% {Fills/Dark/3 Tertiary}
  - shadow x0 y0 blur0 spread0.5 #E6E6E6 (blend plus-darker)
  - corners max smoothing0.6 style1
- **Liquid Glass/Dark/Regular - Small - Tinted**
  - fill #000000 (blend screen)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #999999 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #999999 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #262626 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #262626 (blend plus-lighter)
  - inner-shadow x0 y-40 blur10 spread-40 #111111 (blend plus-lighter)
  - inner-shadow x0 y40 blur10 spread-40 #111111 (blend plus-lighter)
  - shadow x0 y8 blur15 spread0 #000000@4%
  - shadow x-1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0
  - corners max smoothing0.6 style1

## Liquid Glass/Light

- **Liquid Glass/Light/App Library**
  - fill #F8F8F8@8% (blend luminosity)
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #333333 (blend plus-lighter)
  - blur glass radius5 saturation1.3 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 17 smoothing0.6 style1
- **Liquid Glass/Light/Dock**
  - fill #999999@33% (blend luminosity)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y-35 blur15 spread-35 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y35 blur15 spread-35 #333333 (blend plus-lighter)
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #CCCCCC (blend plus-darker)
  - blur glass radius3 saturation1 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 36 smoothing0.6 style1
- **Liquid Glass/Light/Keyboard Background**
  - fill #D4D4D4@74% (blend luminosity) + #1B1B1B (blend plus-lighter) + #E6E9ED (blend plus-darker)
  - inner-shadow x0 y0 blur8 spread1 #000000@20% (blend plus-lighter)
  - inner-shadow x0 y-1 blur2 spread0 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y1 blur2 spread0 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y2 blur0.25 spread-1.5 #FFFFFF@70%
  - blur glass radius4 saturation1 brightness1 distortion0.3 depth0.8 chromatic0
  - corners 27 smoothing0.6 style1
- **Liquid Glass/Light/Regular - Large**
  - fill #FFFFFF@70% (blend lighten) + #BFBFBF@10% (blend darken)
  - inner-shadow x0 y-4 blur2 spread-4 #272727 (blend plus-lighter)
  - inner-shadow x0 y4 blur8 spread-4 #272727 (blend plus-lighter)
  - inner-shadow x0 y-1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
  - inner-shadow x0 y1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
  - inner-shadow x0 y2 blur0.25 spread-1.2 #FFFFFF
  - shadow x0 y18 blur46 spread0 #000000@25%
  - shadow x0 y0 blur0.3 spread0.3 #DBDBDB (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #BFBFBF (blend plus-darker)
  - blur glass radius30 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0
  - corners 20 smoothing0.6 style1
- **Liquid Glass/Light/Regular - Medium**
  - fill #CCCCCC@70% (blend lighten) + #BFBFBF@10% (blend darken)
  - inner-shadow x0 y-4 blur2 spread-4 #272727 (blend plus-lighter)
  - inner-shadow x0 y4 blur8 spread-4 #272727 (blend plus-lighter)
  - inner-shadow x0 y-1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
  - inner-shadow x0 y1 blur1.5 spread-0.5 #272727 (blend plus-lighter)
  - inner-shadow x0 y2 blur0.25 spread-1.2 #FFFFFF
  - shadow x0 y18 blur46 spread0 #000000@25%
  - shadow x0 y0 blur0.3 spread0.3 #DBDBDB (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
  - blur glass radius15 saturation1.4 brightness1 distortion0.3 depth0.9 chromatic0
  - corners 20 smoothing0.6 style1
- **Liquid Glass/Light/Regular - Small**
  - fill #F8F8F8@20% (blend luminosity) + #000000@25% + #FFFFFF@25% + #444444@60% (blend plus-lighter)
  - shadow x0 y8 blur15 spread0 #000000@2%
  - shadow x0 y0 blur0 spread0.5 #DBDBDB (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #DBDBDB (blend plus-darker)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #171717 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #171717 (blend plus-lighter)
  - inner-shadow x0 y40 blur30 spread-40 #E6E6E6 (blend plus-darker)
  - inner-shadow x0 y-40 blur10 spread-40 #282828 (blend plus-lighter)
  - inner-shadow x0 y40 blur10 spread-40 #282828 (blend plus-lighter)
  - blur glass radius6 saturation2 brightness1 distortion0.4 depth0.8 chromatic0
- **Liquid Glass/Light/Regular - Small - Inactive**
  - fill #000000@2% {Fills/Light/5 Quinary}
  - shadow x0 y0 blur0 spread0.5 #EBEBEB (blend plus-darker)
  - corners max smoothing0.6 style1
- **Liquid Glass/Light/Regular - Small - Tinted**
  - fill #FFFFFF (blend multiply)
  - inner-shadow x20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x-20 y0 blur20 spread-30 #D9D9D9 (blend plus-darker)
  - inner-shadow x0 y-4 blur0.5 spread-4 #999999 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #999999 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #262626 (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #262626 (blend plus-lighter)
  - inner-shadow x0 y-40 blur10 spread-40 #111111 (blend plus-lighter)
  - inner-shadow x0 y40 blur10 spread-40 #111111 (blend plus-lighter)
  - shadow x0 y8 blur15 spread0 #000000@4%
  - shadow x-1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - blur glass radius6 saturation1 brightness1 distortion0.4 depth0.8 chromatic0
  - corners max smoothing0.6 style1

## Liquid Glass/Lock Screen Time

- **Liquid Glass/Lock Screen Time**
  - fill #F8F8F8@25% (blend luminosity) + #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y-4 blur0.5 spread-4 #333333 (blend plus-lighter)
  - inner-shadow x0 y-4 blur0.5 spread-4 #333333 (blend plus-lighter)
  - inner-shadow x0 y-0.5 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y0.5 blur0 spread0 #333333 (blend plus-lighter)
  - inner-shadow x0 y-10 blur5 spread-10 #404040 (blend plus-lighter)
  - inner-shadow x0 y10 blur5 spread-10 #404040 (blend plus-lighter)
  - shadow x0 y8 blur15 spread0 #000000@2%
  - shadow x0 y0 blur0 spread0.5 #D9D9D9 (blend plus-darker)
  - shadow x-1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - shadow x1.25 y0 blur0 spread-0.75 #E6E6E6 (blend plus-darker)
  - blur glass radius3 saturation1.4 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 0 smoothing0.6 style0

## Liquid Glass/Widget Glass

- **Liquid Glass/Widget Glass**
  - fill gradient linear {0.5, 1}→{0.5, 0} [#000000 0%, #171717 100%] (blend plus-lighter)
  - inner-shadow x0 y-4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y4 blur0.5 spread-4 #666666 (blend plus-lighter)
  - inner-shadow x0 y-1 blur0 spread0 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y1 blur0 spread0 #1A1A1A (blend plus-lighter)
  - inner-shadow x0 y-20 blur10 spread-20 #222222 (blend plus-lighter)
  - inner-shadow x0 y20 blur10 spread-20 #222222 (blend plus-lighter)
  - blur glass radius3 saturation1 brightness1 distortion0.2 depth0.5 chromatic0
  - corners 27.88 smoothing0.6 style1

## Materials/Dark

- **Materials/Dark/1 Thick**
  - fill #000000@60%
  - blur background radius75 saturation1
  - corners 10 smoothing0.6 style1
- **Materials/Dark/2 Regular (Default)**
  - fill #000000@41%
  - blur background radius75 saturation1
  - corners 10 smoothing0.6 style1
- **Materials/Dark/3 Thin**
  - fill #000000@26%
  - blur background radius75 saturation1
  - corners 10 smoothing0.6 style1
- **Materials/Dark/4 Ultrathin**
  - fill #000000@0%
  - blur background radius75 saturation1
  - corners 10 smoothing0.6 style1

## Materials/Light

- **Materials/Light/1 Thick**
  - fill #FFFFFF@34% (blend plus-lighter) + #FFFFFF@84%
  - blur background radius75 saturation1
  - corners 10 smoothing0.6 style1
- **Materials/Light/2 Regular (Default)**
  - fill #FFFFFF@25% (blend plus-lighter) + #FFFFFF@60%
  - blur background radius75 saturation1.21
  - corners 10 smoothing0.6 style1
- **Materials/Light/3 Thin**
  - fill #FFFFFF@5% (blend plus-lighter) + #FFFFFF@40%
  - blur background radius75 saturation1.45
  - corners 10 smoothing0.6 style1
- **Materials/Light/4 Ultrathin**
  - fill #FFFFFF@7% (blend plus-lighter) + #FFFFFF@3%
  - blur background radius45 saturation1
  - corners 10 smoothing0.6 style1
