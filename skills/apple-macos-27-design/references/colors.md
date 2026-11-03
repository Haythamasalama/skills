# Colours — macOS 27

**Read when:** you need an exact macOS 27 value for colours as Apple's kit stores it.
**Owns:** every swatch in the kit, per appearance and vibrancy.

Source: `Apple macOS 27 UI Kit.sketch` from Apple Design Resources (developer.apple.com/design/resources), read 2026-11-01. Every value below is copied from the kit's shared tokens by a script; nothing is estimated. Columns are the kit's own swatch groups. Vibrant columns are meant to be drawn with the blend mode in their name.

## System Colors

| Name | Light | Light Vibrant (use plus darker) | Dark | Dark (use plus lighter) |
|---|---|---|---|---|
| 1 Red | #FF383C | #F52F32 | #FF4245 | #FF4747 |
| 2 Orange | #FF8D28 | #F58625 | #FF9230 | #FF9E33 |
| 3 Yellow | #FFCC00 | #F5C200 | #FFD600 | #FFE014 |
| 4 Green | #34C759 | #26BF4D | #30D158 | #3BDB63 |
| 5 Mint | #00C8B3 | #00BDA9 | #00DAC3 | #2DE0CD |
| 6 Teal | #00C3D0 | #00B3BF | #00D2E0 | #2DD7E0 |
| 7 Cyan | #00C0E8 | #00ABCF | #3CD3FE | #47D8FC |
| 8 Blue | #0088FF | #0078F0 | #0091FF | #0A99FF |
| 9 Indigo | #6155F5 | #5C50E6 | #6D7CFF | #7163FF |
| 10 Purple | #CB30E0 | #B72BC9 | #DB34F2 | #E647FC |
| 11 Pink | #FF2D55 | #F5234B | #FF375F | #FF4169 |
| 12 Brown | #AC7F5E | #9E7354 | #B78A66 | #C29672 |

## Labels

| Name | Light | Light Vibrant (use plus darker) | Dark | Dark Vibrant (use plus lighter) |
|---|---|---|---|---|
| 1 Primary | #000000@85% | #363636 | #FFFFFF | #FFFFFF@96% |
| 2 Secondary | #000000@50% | #737373 | #FFFFFF@55% | #8A8A8A |
| 3 Tertiary | #000000@25% | #B2B2B2 | #FFFFFF@25% | #4C4C4C |
| 4 Quaternary | #000000@10% | #D9D9D9 | #FFFFFF@10% | #262626 |
| 5 Quinary | #000000@5% | #E6E6E6 | #FFFFFF@5% | #121212 |
| 6 Seximal | #000000@3% | #FAFAFA | #FFFFFF@3% | — |

## Fills

| Name | Light | Light Vibrant (use plus darker) | Dark | Dark Vibrant (use plus lighter) |
|---|---|---|---|---|
| 1 Primary | #000000@10% | #000000@15% | #FFFFFF@10% | #FFFFFF@14% |
| 2 Secondary | #000000@8% | #000000@7% | #FFFFFF@8% | #FFFFFF@8% |
| 3 Tertiary | #000000@5% | #000000@5% | #FFFFFF@5% | #FFFFFF@5% |
| 4 Quatenary | #000000@3% | #000000@3% | #FFFFFF@3% | #FFFFFF@4% |
| 5 Quinary | #000000@2% | #000000@2% | #FFFFFF@2% | #FFFFFF@3% |

## Grays

| Name | Light | Light Vibrant (use plus darker) | Dark | Dark (use plus lighter) |
|---|---|---|---|---|
| Black | #000000 | #000000 | #000000 | #000000 |
| Grey | #8E8E93 | #848489 | #98989D | #A2A2A7 |
| White | #FFFFFF | #FFFFFF | #FFFFFF | #FFFFFF |

## Where the Sketch and Figma kits differ

Apple's Figma version of this kit (`macOS 27 (Community)`, variables read through the Figma MCP on 2026-11-01) disagrees with the Sketch swatches above on two dark values. Every other dark value that was read from Figma matches.

| Token | Sketch swatch (above) | Figma variable |
|---|---|---|
| Labels, Dark, Primary | #FFFFFF | #FFFFFF@85% (`#FFFFFFD9`) |
| Grays, Dark, Grey | #98989D | #98989F |

The Sketch components themselves draw dark primary labels with the `Labels/Dark/1 Primary` swatch, so the Sketch value is the one its specs use. Name the source when you use either value.
