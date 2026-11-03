# Buttons: colours and states, text and effects — macOS 27

**Read when:** you need the colours and states, text and effects of buttons on macOS 27, as Apple's kit draws them.
**Owns:** Buttons in Apple's macOS 27 kit: colours and states, text, effects, kit notes.

Source: `specs/buttons.txt` from Apple's macOS 27 UI Kit (Sketch, v27.0.3), read 2026-11-01. Values are copied from the kit; derived values say so.

Components and anatomy are in `buttons.md`.

## Colours and states

How to read the tables:

- Each row is one appearance · context · state. It holds for all five sizes unless the State cell names sizes.
- "Frame" is the component layer itself; "BG rect" is its `BG` child. Fills are stacked bottom first, as in the spec.
- A shared style is named only where the layer references one. Where both the frame and `BG` reference one, both are given.
- "text fill" is a fill set on the text layer on top of its colour, as stored.
- No layer on this page has a border, shadow, inner shadow or blur.

### Disabled at a glance (derived from the tables below)

| Family | Content Area, Active disabled | Over-glass, Active disabled |
|---|---|---|
| Bordered, Arrow Buttons | `04 - Disabled` fill; label/glyph `{Labels/…/3 Tertiary}` | `04 - Disabled` fill; Bordered label `#B2B2B2` / `#4C4C4C` (vibrant Tertiary, Light / Dark); Arrow glyph `#000000@25%` / `#4C4C4C` |
| Bordered Tinted, Bordered Destructive | `BG` opacity 10% (Light) / 12% (Dark); label opacity 40% | `BG` opacity 10%; label opacity 25% |
| Bordered Default | `BG` opacity 40%; label opacity 50% (Light also sets frame opacity 40%) | `BG` opacity 40%; label opacity 50% |
| Bordered Default Destructive | `BG` opacity 40%; label opacity 50% | frame opacity 50%; label opacity 50% |
| Borderless | label opacity 50% | label opacity 50% |
| Toggle, Off | frame fill `#000000@2%` (Light) / `#FFFFFF@2%` (Dark); label Tertiary | `BG` opacity 3% (Dark adds a `#000000@5% (blend overlay)` frame fill); label opacity 30% |
| Toggle, On | `BG` opacity 2%; label opacity 40% | Light: frame opacity 50%, `BG` opacity 3% · Dark: frame fill `#000000@35% (blend overlay)`, `BG` opacity 20%; label opacity 30% |

### Bordered

| Appearance · context | State | Frame fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | `#000000@8%` | `Content Area/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Active, Off, 3 Clicked | `#000000@16%` | `Content Area/Light/01 - Bordered/03 - Clicked` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Active, Off, 4 Disabled | `#000000@4%` | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8%` | `Content Area/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Active, Off, 3 Clicked | `#000000@12% (blend overlay) + #000000@13% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/03 - Clicked` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Active, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle | `#FFFFFF@7%` | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Active, Off, 3 Clicked | `#FFFFFF@16%` | `Content Area/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary} |
| Dark · Content Area | Active, Off, 4 Disabled | `#FFFFFF@4%` | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@7%` | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Active, Off, 3 Clicked | `#FFFFFF@12% (blend overlay) + #FFFFFF@13% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Active, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Bordered Tinted

| Appearance · context | State | Frame fill · effects | BG rect fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | no fill | `#0088FF {System Colors/Light/8 Blue} + #000000@10% {Fills/Light/1 Primary} (blend plus-darker)`; opacity 22% | BG: `Content Area/Light/02 - Bordered Tinted/01 - Idle` | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Content Area | Active, Off, 3 Clicked | no fill | `#0091FF {System Colors/Dark/8 Blue} + #000000@10% {Fills/Light/1 Primary} (blend plus-darker)`; opacity 28% | BG: `Content Area/Light/02 - Bordered Tinted/03 - Clicked` | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Content Area | Active, Off, 4 Disabled | no fill | `#0088FF {System Colors/Light/8 Blue} + #000000@10% {Fills/Light/1 Primary} (blend plus-darker)`; opacity 10% | BG: `Content Area/Light/02 - Bordered Tinted/04 - Disabled` | `#0088FF` {System Colors/Light/8 Blue}; opacity 40% |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8%` | — | `Content Area/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | — | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle | no fill | `#0088FF {System Colors/Light/8 Blue} + #000000@2% {Fills/Light Vibrant (use plus darker)/5 Quinary}`; opacity 20%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Over-glass | Active, Off, 3 Clicked | no fill | `#0088FF {System Colors/Light/8 Blue} + #000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary}`; opacity 30%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Over-glass | Active, Off, 4 Disabled | no fill | `#0088FF {System Colors/Light/8 Blue}`; opacity 10%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue}; opacity 25% |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle | no fill | `#0091FF {System Colors/Dark/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 20% | BG: `Content Area/Dark/02 - Bordered Tinted/01 - Idle` | `#0091FF` {System Colors/Dark/8 Blue}; blend plus-lighter |
| Dark · Content Area | Active, Off, 3 Clicked | no fill | `#0091FF {System Colors/Dark/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 28% | BG: `Content Area/Dark/02 - Bordered Tinted/03 - Clicked` | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Content Area | Active, Off, 4 Disabled | no fill | `#0091FF {System Colors/Dark/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 12% | BG: `Content Area/Dark/02 - Bordered Tinted/04 - Disabled` | `#0091FF` {System Colors/Dark/8 Blue}; opacity 40% |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@7%` | — | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | — | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle | no fill | `#0091FF {System Colors/Dark/8 Blue} + #FFFFFF@3% {Fills/Dark Vibrant (use plus lighter)/5 Quinary} (blend plus-lighter)`; opacity 20%; blend plus-lighter | none | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Over-glass | Active, Off, 3 Clicked | no fill | `#0091FF {System Colors/Dark/8 Blue} + #FFFFFF@4% {Fills/Dark Vibrant (use plus lighter)/4 Quatenary} (blend plus-lighter)`; opacity 30%; blend plus-lighter | none | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Over-glass | Active, Off, 4 Disabled | no fill | `#0091FF {System Colors/Dark/8 Blue}`; opacity 10%; blend plus-lighter | none | `#0091FF` {System Colors/Dark/8 Blue}; opacity 25% |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Bordered Destructive

| Appearance · context | State | Frame fill · effects | BG rect fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | no fill | `#FF383C {System Colors/Light/1 Red} + #000000@10% {Fills/Light/1 Primary}`; opacity 20% | BG: `Content Area/Light/03 - Bordered Destructive/01 - Idle` | `#FF383C` {System Colors/Light/1 Red} |
| Light · Content Area | Active, Off, 3 Clicked | no fill | `#FF383C {System Colors/Light/1 Red} + #000000@10% {Fills/Light/1 Primary} (blend plus-darker)`; opacity 28% | BG: `Content Area/Light/03 - Bordered Destructive/03 - Clicked` | `#FF383C` {System Colors/Light/1 Red}; blend plus-darker |
| Light · Content Area | Active, Off, 4 Disabled | no fill | `#FF383C {System Colors/Light/1 Red} + #000000@10% {Fills/Light/1 Primary}`; opacity 10% | BG: `Content Area/Light/03 - Bordered Destructive/04 - Disabled` | `#FF383C` {System Colors/Light/1 Red}; opacity 40% |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8%` | — | `Content Area/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | — | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle (XL) | no fill | `#FF383C {System Colors/Light/1 Red} + #000000@2% {Fills/Light Vibrant (use plus darker)/5 Quinary}`; opacity 20%; blend plus-darker | none | `#FF383C` {System Colors/Light/1 Red} |
| Light · Over-glass | Active, Off, 1 Idle (Lg, Rg, Sm, Mn) | no fill; blend plus-darker | `#FF383C {System Colors/Light/1 Red} + #000000@2% {Fills/Light Vibrant (use plus darker)/5 Quinary}`; opacity 20%; blend plus-darker | none | `#FF383C` {System Colors/Light/1 Red} |
| Light · Over-glass | Active, Off, 3 Clicked | no fill | `#FF383C {System Colors/Light/1 Red} + #000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary}`; opacity 30%; blend plus-darker | none | `#FF383C` {System Colors/Light/1 Red} |
| Light · Over-glass | Active, Off, 4 Disabled | no fill | `#FF383C {System Colors/Light/1 Red}`; opacity 10%; blend plus-darker | none | `#FF383C` {System Colors/Light/1 Red}; opacity 25% |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle (XL) | no fill | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 20% | frame: `Content Area/Dark/03 - Bordered Destructive/01 - Idle`<br>BG: `Content Area/Dark/03 - Bordered Destructive/01 - Idle` | `#F52F32` {System Colors/Light Vibrant (use plus darker)/1 Red}; blend plus-lighter |
| Dark · Content Area | Active, Off, 1 Idle (Lg, Rg, Sm, Mn) | no fill | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 20% | frame: `Content Area/Light/03 - Bordered Destructive/01 - Idle`<br>BG: `Content Area/Dark/03 - Bordered Destructive/01 - Idle` | `#FF4245` {System Colors/Dark/1 Red}; blend lighten |
| Dark · Content Area | Active, Off, 3 Clicked | no fill | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 28% | frame: `Content Area/Light/03 - Bordered Destructive/03 - Clicked`<br>BG: `Content Area/Dark/03 - Bordered Destructive/03 - Clicked` | `#FF4245` {System Colors/Dark/1 Red}; blend plus-lighter |
| Dark · Content Area | Active, Off, 4 Disabled (XL) | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 12% | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 12% | frame: `Content Area/Dark/03 - Bordered Destructive/04 - Disabled`<br>BG: `Content Area/Dark/03 - Bordered Destructive/04 - Disabled` | `#FF4245` {System Colors/Dark/1 Red}; opacity 40%; blend plus-lighter |
| Dark · Content Area | Active, Off, 4 Disabled (Lg, Rg, Sm, Mn) | `#FF383C {System Colors/Light/1 Red} + #000000@10% {Fills/Light/1 Primary}`; opacity 10% | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary} (blend plus-lighter)`; opacity 12% | frame: `Content Area/Light/03 - Bordered Destructive/04 - Disabled`<br>BG: `Content Area/Dark/03 - Bordered Destructive/04 - Disabled` | `#FF4245` {System Colors/Dark/1 Red}; opacity 40%; blend plus-lighter |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@7%` | — | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | — | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle | no fill; blend plus-lighter | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@3% {Fills/Dark Vibrant (use plus lighter)/5 Quinary} (blend plus-lighter)`; opacity 20%; blend plus-lighter | none | `#FF4245` {System Colors/Dark/1 Red} |
| Dark · Over-glass | Active, Off, 3 Clicked | no fill | `#FF4245 {System Colors/Dark/1 Red} + #FFFFFF@4% {Fills/Dark Vibrant (use plus lighter)/4 Quatenary}`; opacity 30%; blend plus-lighter | none | `#FF4245` {System Colors/Dark/1 Red} |
| Dark · Over-glass | Active, Off, 4 Disabled | no fill | `#FF4245 {System Colors/Dark/1 Red}`; opacity 10%; blend plus-lighter | none | `#FF4245` {System Colors/Dark/1 Red}; opacity 25% |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Bordered Default

| Appearance · context | State | Frame fill · effects | BG rect fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | `#0088FF {System Colors/Light/8 Blue} + #000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary} (blend plus-darker)` | — | `Content Area/Light/04 - Prominent (Default)/01 - Idle` | `#FFFFFF` |
| Light · Content Area | Active, Off, 3 Clicked | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@10% (blend plus-darker)` | — | `Content Area/Light/04 - Prominent (Default)/03 - Clicked` | `#FFFFFF` |
| Light · Content Area | Active, Off, 4 Disabled | no fill; opacity 40% | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 40% | BG: `Content Area/Light/04 - Prominent (Default)/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8%` | — | `Content Area/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | — | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; blend plus-darker | — | `Over-Glass/Light/04 - Prominent (Default)/01 - Idle` | `#FFFFFF` |
| Light · Over-glass | Active, Off, 3 Clicked | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@15% {Fills/Light Vibrant (use plus darker)/1 Primary} (blend plus-darker)`; blend plus-darker | — | `Over-Glass/Light/04 - Prominent (Default)/03 - Clicked` | `#FFFFFF` |
| Light · Over-glass | Active, Off, 4 Disabled | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 40%; blend plus-darker | BG: `Over-Glass/Light/04 - Prominent (Default)/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle | `#0091FF {System Colors/Dark/8 Blue}` | — | `Content Area/Dark/04 - Prominent (Default)/01 - Idle` | `#FFFFFF` |
| Dark · Content Area | Active, Off, 3 Clicked | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue} + #FFFFFF@10% (blend plus-lighter)` | — | `Content Area/Dark/04 - Prominent (Default)/03 - Clicked` | `#FFFFFF` |
| Dark · Content Area | Active, Off, 4 Disabled | no fill | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 40% | BG: `Content Area/Dark/04 - Prominent (Default)/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@7%` | — | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | — | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; blend plus-lighter | — | `Over-Glass/Dark/04 - Prominent (Default)/01 - Idle` | `#FFFFFF` |
| Dark · Over-glass | Active, Off, 3 Clicked | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #FFFFFF@14% {Fills/Dark Vibrant (use plus lighter)/1 Primary}`; blend plus-lighter | — | `Over-Glass/Dark/04 - Prominent (Default)/03 - Clicked` | `#FFFFFF` |
| Dark · Over-glass | Active, Off, 4 Disabled | no fill | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 40%; blend plus-lighter | BG: `Over-Glass/Dark/04 - Prominent (Default)/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Bordered Default Destructive

| Appearance · context | State | Frame fill · effects | BG rect fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | `#FF383C {System Colors/Light/1 Red}` | — | `Content Area/Light/05 - Prominent (Default) Destructive/01 - Idle` | `#FFFFFF` |
| Light · Content Area | Active, Off, 3 Clicked | `#F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red} + #000000@10% (blend plus-darker)` | — | `Content Area/Light/05 - Prominent (Default) Destructive/03 - Clicked` | `#FFFFFF` |
| Light · Content Area | Active, Off, 4 Disabled | no fill | `#F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red}`; opacity 40% | BG: `Content Area/Light/05 - Prominent (Default) Destructive/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8%` | — | `Content Area/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | — | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red}`; blend plus-darker | — | `Over-Glass/Light/05 - Prominent (Default) Destructive/01 - Idle` | `#FFFFFF` |
| Light · Over-glass | Active, Off, 3 Clicked | `#F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red} + #000000@15%`; blend plus-darker | — | `Over-Glass/Light/05 - Prominent (Default) Destructive/03 - Clicked` | `#FFFFFF` |
| Light · Over-glass | Active, Off, 4 Disabled | `#F52F32 {System Colors/Light Vibrant (use plus darker)/1 Red}`; opacity 50%; blend plus-darker | — | `Over-Glass/Light/05 - Prominent (Default) Destructive/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | — | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle | `#FF4245 {System Colors/Dark/1 Red}` | — | `Content Area/Dark/05 - Prominent (Default) Destructive/01 - Idle` | `#FFFFFF` |
| Dark · Content Area | Active, Off, 3 Clicked | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red} + #FFFFFF@10% (blend plus-lighter)` | — | `Content Area/Dark/05 - Prominent (Default) Destructive/03 - Clicked` | `#FFFFFF` |
| Dark · Content Area | Active, Off, 4 Disabled | no fill | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red}`; opacity 40% | BG: `Content Area/Dark/05 - Prominent (Default) Destructive/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@7%` | — | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | — | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red}`; blend plus-darker | — | `Over-Glass/Light/05 - Prominent (Default) Destructive/01 - Idle` | `#FFFFFF` |
| Dark · Over-glass | Active, Off, 3 Clicked | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red} + #FFFFFF@15%`; blend plus-lighter | — | `Over-Glass/Dark/05 - Prominent (Default) Destructive/03 - Clicked` | `#FFFFFF` |
| Dark · Over-glass | Active, Off, 4 Disabled | `#FF4747 {System Colors/Dark (use plus lighter)/1 Red}`; opacity 50%; blend plus-lighter | — | `Over-Glass/Dark/05 - Prominent (Default) Destructive/04 - Disabled` | `#FFFFFF`; opacity 50% |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | — | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Borderless (on = bezel)

| Appearance · context | State | Frame fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | no fill | none | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Content Area | Active, Off, 3 Clicked | no fill | none | `#0088FF` {System Colors/Light/8 Blue}; text fill `#0088FF {System Colors/Light/8 Blue} + #000000@18% (blend plus-darker)` |
| Light · Content Area | Active, Off, 4 Disabled | no fill | none | `#0088FF` {System Colors/Light/8 Blue}; opacity 50% |
| Light · Content Area | Inactive, Off, 1 Idle | no fill | none | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Content Area | Inactive, Off, 4 Disabled | no fill | none | `#0088FF` {System Colors/Light/8 Blue}; opacity 50% |
| Light · Over-glass | Active, Off, 1 Idle (XL, Lg, Rg, Sm) | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue} |
| Light · Over-glass | Active, Off, 2 Hover (Mn) | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue} |
| Light · Over-glass | Active, Off, 3 Clicked | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; text fill `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@18% (blend plus-darker)` |
| Light · Over-glass | Active, Off, 4 Disabled | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; opacity 50% |
| Light · Over-glass | Inactive, Off, 1 Idle (XL) | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue} |
| Light · Over-glass | Inactive, Off, 1 Idle (Lg, Rg, Sm, Mn) | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; text fill `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue} + #000000@18% (blend plus-darker)` |
| Light · Over-glass | Inactive, Off, 4 Disabled | no fill; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; opacity 50% |
| Dark · Content Area | Active, Off, 1 Idle | no fill | none | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Content Area | Active, Off, 3 Clicked | no fill | none | `#0091FF` {System Colors/Dark/8 Blue}; text fill `#0091FF {System Colors/Dark/8 Blue} + #000000@18% (blend plus-darker)` |
| Dark · Content Area | Active, Off, 4 Disabled | no fill | none | `#0091FF` {System Colors/Dark/8 Blue}; opacity 50% |
| Dark · Content Area | Inactive, Off, 1 Idle | no fill | none | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Content Area | Inactive, Off, 4 Disabled | no fill | none | `#0091FF` {System Colors/Dark/8 Blue}; opacity 50% |
| Dark · Over-glass | Active, Off, 1 Idle (XL, Lg, Rg, Sm) | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue} |
| Dark · Over-glass | Active, Off, 2 Hover (Mn) | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue} |
| Dark · Over-glass | Active, Off, 3 Clicked | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; text fill `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue} + #FFFFFF@18% (blend plus-darker)` |
| Dark · Over-glass | Active, Off, 4 Disabled | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; opacity 50% |
| Dark · Over-glass | Inactive, Off, 1 Idle (XL) | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue} |
| Dark · Over-glass | Inactive, Off, 1 Idle (Lg, Rg, Sm, Mn) | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; text fill `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue} + #FFFFFF@18% (blend plus-darker)` |
| Dark · Over-glass | Inactive, Off, 4 Disabled | no fill; blend plus-lighter | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; opacity 50% |

### Toggle

| Appearance · context | State | Frame fill · effects | BG rect fill · effects | Shared style | Label colour · effects |
|---|---|---|---|---|---|
| Light · Content Area | Active, Off, 1 Idle | `#000000@5% {Fills/Light/3 Tertiary}` | — | none | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | Active, Off, 3 Clicked | `#000000@13%` | — | none | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | Active, Off, 4 Disabled | `#000000@2% {Fills/Light/5 Quinary}` | — | none | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Content Area | Active, On, 1 Idle | no fill | `#0088FF {System Colors/Light/8 Blue}`; opacity 6%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue} |
| Light · Content Area | Active, On, 3 Clicked | no fill | `#0088FF {System Colors/Light/8 Blue}`; opacity 16%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue}; text fill `#0088FF {System Colors/Light/8 Blue}` |
| Light · Content Area | Active, On, 4 Disabled | no fill | `#0088FF {System Colors/Light/8 Blue}`; opacity 2%; blend plus-darker | none | `#0088FF` {System Colors/Light/8 Blue}; opacity 40% |
| Light · Content Area | Inactive, Off, 1 Idle | `#000000@8% {Fills/Light/2 Secondary}` | — | none | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | Inactive, Off, 4 Disabled | `#000000@4%` | — | none | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Content Area | Inactive, On, 1 Idle | `#000000@8% {Fills/Light/2 Secondary}` | — | none | `#000000@85%` {Labels/Light/1 Primary} |
| Light · Content Area | Inactive, On, 4 Disabled | `#000000@4%` | — | none | `#000000@25%` {Labels/Light/3 Tertiary} |
| Light · Over-glass | Active, Off, 1 Idle (XL, Lg, Rg, Sm) | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 6%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; blend plus-darker |
| Light · Over-glass | Active, Off, 2 Hover (Mn) | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 6%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; blend plus-darker |
| Light · Over-glass | Active, Off, 3 Clicked | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 15%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; blend plus-darker |
| Light · Over-glass | Active, Off, 4 Disabled | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 3%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; opacity 30%; blend plus-darker |
| Light · Over-glass | Active, On, 1 Idle | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 16%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; blend plus-darker |
| Light · Over-glass | Active, On, 3 Clicked | no fill | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 30%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; blend plus-darker |
| Light · Over-glass | Active, On, 4 Disabled | no fill; opacity 50% | `#0078F0 {System Colors/Light Vibrant (use plus darker)/8 Blue}`; opacity 3%; blend plus-darker | none | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue}; opacity 30%; blend plus-darker |
| Light · Over-glass | Inactive, Off, 1 Idle | `#000000@6%`; blend plus-darker | — | none | `#737373` {Labels/Light Vibrant (use plus darker)/2 Secondary}; blend plus-darker |
| Light · Over-glass | Inactive, Off, 4 Disabled | `#000000@3% {Fills/Light Vibrant (use plus darker)/4 Quatenary}`; blend plus-darker | — | none | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Light · Over-glass | Inactive, On, 1 Idle | `#000000@11%`; blend plus-darker | — | none | `#737373` {Labels/Light Vibrant (use plus darker)/2 Secondary}; blend plus-darker |
| Light · Over-glass | Inactive, On, 4 Disabled | `#000000@5% {Fills/Light Vibrant (use plus darker)/3 Tertiary}`; blend plus-darker | — | none | `#B2B2B2` {Labels/Light Vibrant (use plus darker)/3 Tertiary}; blend plus-darker |
| Dark · Content Area | Active, Off, 1 Idle | `#FFFFFF@5% {Fills/Dark/3 Tertiary}` | — | none | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Active, Off, 3 Clicked | `#FFFFFF@13%` | — | none | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Active, Off, 4 Disabled | `#FFFFFF@2% {Fills/Dark/5 Quinary}` | — | none | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Content Area | Active, On, 1 Idle | no fill | `#0091FF {System Colors/Dark/8 Blue}`; opacity 6%; blend plus-darker | none | `#0091FF` {System Colors/Dark/8 Blue} |
| Dark · Content Area | Active, On, 3 Clicked | no fill | `#0091FF {System Colors/Dark/8 Blue}`; opacity 16%; blend plus-darker | none | `#0091FF` {System Colors/Dark/8 Blue}; text fill `#0091FF {System Colors/Dark/8 Blue}` |
| Dark · Content Area | Active, On, 4 Disabled | no fill | `#0091FF {System Colors/Dark/8 Blue}`; opacity 2%; blend plus-darker | none | `#0091FF` {System Colors/Dark/8 Blue}; opacity 40% |
| Dark · Content Area | Inactive, Off, 1 Idle | `#FFFFFF@8% {Fills/Dark/2 Secondary}` | — | none | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, Off, 4 Disabled | `#FFFFFF@4%` | — | none | `#FFFFFF@25%` {Labels/Dark/3 Tertiary}; blend plus-lighter |
| Dark · Content Area | Inactive, On, 1 Idle | `#FFFFFF@8% {Fills/Dark/2 Secondary}` | — | none | `#FFFFFF` {Labels/Dark/1 Primary} |
| Dark · Content Area | Inactive, On, 4 Disabled | `#FFFFFF@4%` | — | none | `#FFFFFF@25%` {Labels/Dark/3 Tertiary} |
| Dark · Over-glass | Active, Off, 1 Idle (XL, Lg, Rg, Sm) | `#000000@20% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 9% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; blend plus-lighter |
| Dark · Over-glass | Active, Off, 2 Hover (Mn) | `#000000@20% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 9% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; blend plus-lighter |
| Dark · Over-glass | Active, Off, 3 Clicked | `#000000@0% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 16% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; blend plus-lighter |
| Dark · Over-glass | Active, Off, 4 Disabled | `#000000@5% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 3% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; opacity 30%; blend plus-lighter |
| Dark · Over-glass | Active, On, 1 Idle | `#000000@25% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 20% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; blend plus-lighter |
| Dark · Over-glass | Active, On, 3 Clicked | `#000000@0% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 25% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; blend plus-lighter |
| Dark · Over-glass | Active, On, 4 Disabled | `#000000@35% (blend overlay)` | `#0A99FF {System Colors/Dark (use plus lighter)/8 Blue}`; opacity 20% | none | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue}; opacity 30%; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 1 Idle | `#FFFFFF@6%`; blend plus-lighter | — | none | `#8A8A8A` {Labels/Dark Vibrant (use plus lighter)/2 Secondary}; blend plus-lighter |
| Dark · Over-glass | Inactive, Off, 4 Disabled | `#FFFFFF@4% {Fills/Dark Vibrant (use plus lighter)/4 Quatenary}`; blend plus-lighter | — | none | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |
| Dark · Over-glass | Inactive, On, 1 Idle | `#FFFFFF@11%`; blend plus-lighter | — | none | `#8A8A8A` {Labels/Dark Vibrant (use plus lighter)/2 Secondary}; blend plus-lighter |
| Dark · Over-glass | Inactive, On, 4 Disabled | `#FFFFFF@5% {Fills/Dark Vibrant (use plus lighter)/3 Tertiary}`; blend plus-lighter | — | none | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Arrow Buttons

| Appearance · context | State | Frame fill · effects | Shared style | Glyph colour · effects |
|---|---|---|---|---|
| Light · Content Area | 1 - Idle | `#000000@8%` | `Content Area/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Content Area | 3 - Clicked | `#000000@16%` | `Content Area/Light/01 - Bordered/03 - Clicked` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Content Area | 4 - Disabled | `#000000@4%` | `Content Area/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary}; blend plus-darker |
| Light · Over-glass | 1 - Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Over-glass | 3 - Clicked | `#000000@12% (blend overlay) + #000000@13% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/03 - Clicked` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Over-glass | 4 - Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary}; blend plus-darker |
| Light · Over-glass | Inactive, 1 - Idle | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/01 - Idle` | `#000000@85%` {Labels/Light/1 Primary}; blend plus-darker |
| Light · Over-glass | Inactive, 4 - Disabled | `#000000@6% (blend overlay) + #000000@2.5% (blend plus-darker)` | `Over-Glass/Light/01 - Bordered/04 - Disabled` | `#000000@25%` {Labels/Light/3 Tertiary}; blend plus-darker |
| Dark · Content Area | 1 - Idle | `#FFFFFF@7%` | `Content Area/Dark/01 - Bordered/01 - Idle` | `#FFFFFF` {Labels/Dark/1 Primary}; blend plus-lighter |
| Dark · Content Area | 3 - Clicked | `#FFFFFF@16%` | `Content Area/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF` {Labels/Dark/1 Primary}; blend plus-lighter |
| Dark · Content Area | 4 - Disabled | `#FFFFFF@4%` | `Content Area/Dark/01 - Bordered/04 - Disabled` | `#FFFFFF@25%` {Labels/Dark/3 Tertiary}; blend plus-lighter |
| Dark · Over-glass | 1 - Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 3 - Clicked | `#FFFFFF@12% (blend overlay) + #FFFFFF@13% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/03 - Clicked` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | 4 - Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |
| Dark · Over-glass | Inactive, 1 - Idle | `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/01 - Idle` | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}; blend plus-lighter |
| Dark · Over-glass | Inactive, 4 - Disabled | `#FFFFFF@6% (blend overlay) + #FFFFFF@2.5% (blend plus-lighter)` | `Over-Glass/Dark/01 - Bordered/04 - Disabled` | `#4C4C4C` {Labels/Dark Vibrant (use plus lighter)/3 Tertiary}; blend plus-lighter |

### Irregular values in these tables

These are stored this way in the kit. They are listed so a builder can decide whether to follow them.

- Dark · Over-glass · Bordered Default Destructive · `Active, Off, 1 Idle` references the Light style `Over-Glass/Light/05 - Prominent (Default) Destructive/01 - Idle` and uses blend plus-darker; the other Dark Over-glass states use plus-lighter. No component references `Over-Glass/Dark/05 - Prominent (Default) Destructive/01 - Idle`.
- Light · Over-glass · Bordered Default Destructive · Idle binds the dark swatch `{System Colors/Dark (use plus lighter)/1 Red}` (`#FF4747`), as its shared style does.
- Dark · Over-glass · Bordered Default · Clicked binds the light swatch `{System Colors/Light Vibrant (use plus darker)/8 Blue}` (`#0078F0`), as its shared style does. Its Idle layer uses blend plus-lighter where the shared style says plus-darker.
- Light · Content Area · Bordered Tinted · Clicked binds `{System Colors/Dark/8 Blue}` (`#0091FF`), as its shared style does.
- Dark · Content Area · Bordered Destructive: the Lg–Mn frames reference `Content Area/Light/03 - Bordered Destructive/…` while their `BG` uses the Dark style. In Disabled, Lg–Mn frames also carry the Light fill at 10 % under the Dark `BG`, and the XL frame repeats the Dark `BG` fill at 12 %. The Idle `BG` is at 20 % while the shared style says 22 %. The Idle label is `#F52F32` {System Colors/Light Vibrant (use plus darker)/1 Red} with plus-lighter at XL, and `#FF4245` with `lighten` at Lg–Mn.
- Light · Content Area · Bordered Default · Disabled sets opacity 40 % on the frame as well as on `BG`; the other appearance and context do not.
- Light · Over-glass · Bordered Destructive · Idle: the XL frame has no blend; Lg–Mn frames use plus-darker. Borderless Over-glass `Inactive, Off, 1 Idle` has the Clicked text fill at Lg–Mn but not at XL.
- `Active, Off, 2 Hover` exists only for Over-glass Mn Toggle and Borderless, in place of `Active, Off, 1 Idle`. Its values are the same as Idle at the other four sizes.
- Dark Toggle `BG` rects in Content Area use plus-darker. Dark · Over-glass Borderless Clicked adds `#FFFFFF@18%` with plus-darker. Dark · Content Area Toggle `Inactive, Off, 4 Disabled` labels use plus-lighter; `Inactive, On, 4 Disabled` labels don't.
- In Light · Content Area, the Bordered labels use the vibrant swatch `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary} without its blend mode.
- The shared styles store their own corner value (often `max`, sometimes 0, 4 or 6, sometimes none), but the components set their own radius per size (Mn 4, Sm 5, Rg 6, Lg max, XL max). The component value is the one drawn.

## Text

No text layer on this page references a shared text style (the file has no `textstyle` token). No component text sets tracking; `kern` appears only on the page headings.

| Part | Sizes | Font | Size | Line height | Align | Colour |
|---|---|---|---|---|---|---|
| `Label` (push buttons), `􀊶 Toggle` / `􀊴 Toggle`, `Borderless` | XL, Lg, Rg | SFPro-Medium | 13 | 16 | center | per state, see Colours and states |
| same | Sm | SFPro-Medium | 11 | not set (13 on Bordered Tinted `Active, Off, 1 Idle`) | center | per state |
| same | Mn | SFPro-Medium | 10 | 13 (not set on Bordered Idle states) | center | per state |
| Arrow glyph `􀆏` | XL, Lg, Rg, Sm | SFPro-Semibold | 13 | 16 | center | per state |
| Arrow glyph `􀆏` | Mn | SFPro-Semibold | 11 | 14 | center | per state |

Label colours in Idle and Clicked states (collected from the tables above):

| Family | Light · Content Area | Light · Over-glass | Dark · Content Area | Dark · Over-glass |
|---|---|---|---|---|
| Bordered, Bordered Default (Inactive), Bordered Default Destructive (Inactive), Bordered Tinted (Inactive) | `#363636` {Labels/Light Vibrant (use plus darker)/1 Primary}, no blend | `#363636`, blend plus-darker | `#FFFFFF` {Labels/Dark/1 Primary} (Bordered Clicked: `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}) | `#FFFFFF@96%` {Labels/Dark Vibrant (use plus lighter)/1 Primary}, blend plus-lighter |
| Bordered Destructive (Inactive) | `#000000@85%` {Labels/Light/1 Primary} | `#000000@85%`, blend plus-darker | `#FFFFFF` {Labels/Dark/1 Primary} | `#FFFFFF@96%`, blend plus-lighter |
| Bordered Default, Bordered Default Destructive (Active) | `#FFFFFF` (no swatch) | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| Bordered Tinted (Active) | `#0088FF` {System Colors/Light/8 Blue} | `#0088FF` | `#0091FF` {System Colors/Dark/8 Blue} | `#0091FF` |
| Bordered Destructive (Active) | `#FF383C` {System Colors/Light/1 Red} | `#FF383C` | `#FF4245` {System Colors/Dark/1 Red} (XL Idle: `#F52F32`) | `#FF4245` |
| Borderless | `#0088FF` {System Colors/Light/8 Blue} | `#0078F0` {System Colors/Light Vibrant (use plus darker)/8 Blue} | `#0091FF` {System Colors/Dark/8 Blue} | `#0A99FF` {System Colors/Dark (use plus lighter)/8 Blue} |
| Toggle (Active) | Off `#000000@85%` {Labels/Light/1 Primary} · On `#0088FF` | `#0078F0`, blend plus-darker | Off `#FFFFFF` · On `#0091FF` | `#0A99FF`, blend plus-lighter |
| Toggle (Inactive) | `#000000@85%` | `#737373` {Labels/Light Vibrant (use plus darker)/2 Secondary} | `#FFFFFF` | `#8A8A8A` {Labels/Dark Vibrant (use plus lighter)/2 Secondary} |
| Arrow Buttons | `#000000@85%` {Labels/Light/1 Primary}, blend plus-darker | same | `#FFFFFF` {Labels/Dark/1 Primary}, blend plus-lighter | `#FFFFFF@96%`, blend plus-lighter |

Disabled labels use the Tertiary label colour or a layer opacity; see Disabled at a glance.

Derived: SFPro-Medium is not one of the weights in `text-styles.md` (those use Regular, Semibold, Bold and Heavy). The 13 / 16 size and line height match `06 Body`, but the weight does not.

## Effects

There are no shadows, inner shadows, background blurs, glass effects or borders on this page. Every layer line carries only `fill`, `corners`, `stack`, `opacity` and `blend` tokens. The glass that Over-glass variants are drawn on is in `materials.md`.

| Effect | Where | Values |
|---|---|---|
| Fill blend `overlay` | Over-glass fills from the `01 - Bordered` styles (Bordered, Arrow Buttons and every Inactive push-button state); Dark · Over-glass Toggle frames | `#000000@12% (blend overlay) + #000000@7% (blend plus-darker)` (Light Idle), `#FFFFFF@12% (blend overlay) + #FFFFFF@5% (blend plus-lighter)` (Dark Idle); Toggle Dark frames `#000000@0%`…`@35% (blend overlay)` |
| `plus-darker` | Most Light · Over-glass labels, frames and `BG` rects; second fill of several Light Content Area fills; Toggle `BG` in both appearances in Content Area | layer or fill blend, as listed per row |
| `plus-lighter` | Dark labels in Over-glass and some in Content Area; Dark Over-glass frames and `BG` rects | layer or fill blend, as listed per row |
| `lighten` | Only on 4 labels: Dark · Content Area · Bordered Destructive · `Active, Off, 1 Idle`, Lg, Rg, Sm, Mn | label `#FF4245` |
| Layer opacity | `BG` rects (2 %–40 %); disabled labels (25 %, 30 %, 40 %, 50 %); a few frames (see Disabled at a glance) | as listed per row |
| Text fill | Borderless `Active, Off, 3 Clicked` (all) and Over-glass `Inactive, Off, 1 Idle` (Lg–Mn); Toggle Content Area `Active, On, 3 Clicked` | Borderless: label blue + `#000000@18% (blend plus-darker)` (Dark Over-glass: `#FFFFFF@18% (blend plus-darker)`); Toggle: the same blue as the label |

## Kit notes

The page has no documentation boards and no notes from Apple. It holds only section headings, which give the page's own names for the groups:

- Large headings: "Button" (layer name "Button, Bordered"), "Toggle Button", "Arrow Button", and "Light" / "Dark" at 50 % opacity.
- Context headings: "Content Area" and "Over-Glass".
- Family headings: "Bordered", "Bordered Tinted", "Bordered Destructive", "Bordered Default", "Bordered Default Desctructive" (spelled so), "Borderless".
- State headings: "Active", "Inactive", "Off, Active", "Off, Inactive", "On, Active", "On, Inactive".

The page also has a few loose layers outside any component. Two instances named `Buttons/Dark/Content Area/Neutral/5 XL/Active, Off, 1 Idle` point to the Light XL Bordered Idle and Disabled components (the second with a `style→Content Area/Light/01 - Bordered/04 - Disabled` override). Three instances named `Buttons/Dark/Content Area/Bordered Destructive/5 XL/Active, Off, 1 Idle` point to Light XL Bordered Destructive Idle and Disabled components with the override `color:fill-0→#FF383C@5%`; one of them is also at `opacity 40%`. There are also a `Rectangle` 42 × 6 `#FF2E32@30%`, and two `Rectangle 5` bars 129 × 9 in `#0088FF` {System Colors/Light/8 Blue} and `#0091FF` {System Colors/Dark/8 Blue}. No `Neutral` family exists among the components.

## Finding it in the spec

| What | Command |
|---|---|
| One family | `grep -n '^COMPONENT "Buttons/[^/]*/[^/]*/Bordered/' specs/buttons.txt` (swap in `Bordered Tinted`, `Bordered Destructive`, `Bordered Default`, `Bordered Default Destructive`, `Borderless (on = bezel)`, `Toggle`) |
| Arrow buttons | `grep -n '^COMPONENT "Arrow Buttons/' specs/buttons.txt` |
| One appearance and context | `grep -n '^COMPONENT "Buttons/Dark/Over-glass/' specs/buttons.txt` |
| One size | `grep -n '^COMPONENT "Buttons/.*/3 Rg/' specs/buttons.txt` |
| Toggle On states (Active and Inactive) | `grep -n '^COMPONENT "Buttons/.*, On, ' specs/buttons.txt` |
| The four Hover variants | `grep -n '2 Hover"' specs/buttons.txt` |
| A component with its children | `grep -n -A2 '^COMPONENT "Buttons/Dark/Over-glass/Toggle/3 Rg/Active, On, 1 Idle"' specs/buttons.txt` |
| Loose page layers | `grep -n '^use \|^rect ' specs/buttons.txt` |
