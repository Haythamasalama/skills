# Keyboards — iOS 27

**Read when:** you need an exact iOS 27 value for keyboards (size, colour, text, effect) as Apple's kit draws it.
**Owns:** Keyboards in Apple's iOS 27 kit: components, anatomy.

Source: `specs/keyboards.txt` from Apple's iOS 27 UI Kit (Sketch, v27.1.3), read 2026-11-01. Values are copied from the kit; derived values say so.

The page holds the system keyboards for iPhone, iPad and iPhone Duo (inner and outer displays, portrait and landscape): key masters, key pads, bottom rows, the number pad, the emoji keyboard, suggestion bars and the accessory bars that sit above the keyboard. Swatch names in `{…}` are in `colors.md` / `specs/tokens.txt`; `style="…"` names are in `materials.md`; text style names are in `text-styles.md`.

## Components

384 components, no documentation boards. Every family exists in Dark and Light (192 each).

| Family | Name pattern | Axes and values | Count |
|---|---|---|---|
| iPad keyboards | `Keyboard/{Dark,Light}/iPad/{Lower Case, Upper Case}` | | 4 |
| iPad keys | `Keyboard/{Dark,Light}/􀻃/iPad/Keys/<key>` | Command-Left, Command-Right, Return, Return - Prominent, 1-Story-Punctuation, 2-Story-Punctuation, 2-Story-Upper, 2-Story-Lower | 16 |
| iPad suggestions | `Keyboard/{Dark,Light}/iPad/Suggestions` | | 2 |
| iPhone keyboards | `Keyboard/Dark/iPhone/Alpha`, `Keyboard/Light/iPhone` (same part, different names), `…/iPhone/Number Pad`, `…/iPhone/Emoji` | | 6 |
| iPhone suggestions | `Keyboard/{Dark,Light}/iPhone/Suggestions` | | 2 |
| iPhone key pads | `Keyboard/{Dark,Light}/iPhone/Key Pad/<pad>` | Letters Upper Case, Letters Lower Case, Numbers and Punctuation, Punctuation and Special Characters | 8 |
| iPhone bottom rows | `Keyboard/{Dark,Light}/Key Pad - Bottom Row/<type>` | Default, Email, URL, Web Search | 8 |
| iPhone keys | `Keyboard/{Dark,Light}/􀻃/Keys/iPhone/<key>` | 15 keys (see Sizes) | 30 |
| Number pad keys | `Keyboard/{Dark,Light}/􀻃/iPhone/Keys - Number Pad/<key>` | Number, 0, Delete, Lower Left/{., +*#, Hide} | 12 |
| Bottom controls | `Keyboard/{Dark,Light}/􀻃/iPhone/Bottom Controls/{ABC and Mic, Emoji and Mic}` | | 4 |
| Accessories | `Keyboard/{Dark,Light}/iPhone/Accessories/…` | Toolbar, Toolbar Action, Find (+10 parts), Find and Replace (+8 parts), Search - Placeholder | 46 |
| iPhone Duo keyboards | `Keyboard/{Dark,Light}/iPhone Duo/{Outer,Inner}/{Portrait,Landscape}` | | 8 |
| iPhone Duo key pads | `…/iPhone Duo/{Outer,Inner}/{Portrait,Landscape}/Key Pad/<pad>` | the 4 pads | 32 |
| iPhone Duo bottom rows | `…/iPhone Duo/{Outer,Inner}/{Portrait,Landscape}/Key Pad - Bottom Row/<type>` | Default, Email, URL, Web Search | 32 |
| iPhone Duo keys | `Keyboard/{Dark,Light}/􀻃/Keys/iPhone Duo - {Outer,Inner} {Portrait,Landscape}/<key>` | 15 keys | 120 |
| Examples | `Examples/Keyboard/{Dark,Light}/{iPad, iPhone, iPhone Duo}/…` | iPad: Lower Case, Upper Case · iPhone: 9 · iPhone Duo: {Portrait,Landscape} × {Outer,Inner} × 4 | 54 |

The 15 key masters per device group: UpperCase, LowerCase, Punctuation, Symbol, Shift/On, Shift/Off, Delete, Return/Default, Return/Prominent, Keyboard Switch/123, Keyboard Switch/ABC, Number and Punctuation Switch/123, Number and Punctuation Switch/#+=, .com, and a punctuation key named `Key-Punctuation (not capitalized)` (Dark iPhone) or `Special Charaters (not capitalized)` (all others; the kit's spelling).

Accessory parts: `Find/{Previous,Next}/{Enabled,Disabled}`, `Find/Search Menu`, `Find/Text Field/{Placeholder,Value}`, `Find/Done/{Enabled,Disabled}`, `Find/Previous and Next`, `Find and Replace/{Previous,Next}/{Enabled,Disabled}`, `Find and Replace/{Find Field,Replace Field}/{Empty,Value}`.

Components from other pages used here: `Toolbars/{Dark,Light}/Buttons/48pt/Active/Symbol 1`, `Text Fields/􀻃/Cursor`, `Status Bars/iPhone 17 Pro/…`, `Status Bars/iPad/…/Full Screen/Menu Collapsed`, `iPhone Duo/Outer Display Lens`.

## Anatomy

### iPhone keyboard (Alpha)

`Keyboard/Dark/iPhone/Alpha` / `Keyboard/Light/iPhone`, 402×390, `stack v gap10`:

| Layer | Size @ position | Contents |
|---|---|---|
| "Accessory Bar" | 402×48 @0,0 | → Accessories/Toolbar |
| group "Stack" | 402×332 @0,58 | glass `Liquid Glass/{Dark,Light}/Keyboard Background`, `corners 27/27/62/62`, `stack v gap0 pad24,0,0,0` |
| └ "Suggestions" | 402×25 @0,24 | → iPhone/Suggestions |
| └ "Stack" / "Key Pad" | 402×205 @0,49 | → iPhone/Key Pad/Letters Upper Case |
| └ "Emoji and Mic" | 402×78 @0,254 | → Bottom Controls/Emoji and Mic |

Derived: 332 = 24 + 25 + 205 + 78.

### iPhone key pad

402×205, `stack v gap11 pad0,6.67,0,6.67`. Rows are 388.66×43 at x 6.67, y 0, 54, 108, 162 (row 4 is a Key Pad - Bottom Row instance).

| Pad | Row 1 | Row 2 | Row 3 | Row 4 |
|---|---|---|---|---|
| Letters Upper Case | Q–P (UpperCase) | A–L (UpperCase), side pad 20 | Shift/On · Z–M · Delete | Bottom Row/Default |
| Letters Lower Case | q–p (LowerCase) | a–l | Shift (Dark: Shift/On, Light: Shift/Off) · z–m · Delete | Default |
| Numbers and Punctuation | 1 2 3 4 5 6 7 8 9 0 | - / : ; ( ) $ & @ “ | #+= · . , ? ! ‘ · Delete | Default with Keyboard Switch swapped to ABC |
| Punctuation and Special Characters | [ ] { } # % ^ * + = | _ \ \| ~ < > € £ ¥ ・ | 123 · . , ? ! ‘ · Delete | same |

Row 3 holds the side keys and an inner group "Stack" (`gap6`) with the middle keys. Delete instances override the glyph to `􁂈` U+101088.

### Bottom row (iPhone)

`Key Pad - Bottom Row/<type>`, 388.66×43, `stack h gap6`:

| Type | Keyboard Switch (→ 123) | Middle | Enter |
|---|---|---|---|
| Default | 92.67×43 @0 | "Spacebar" 191.99×43 @98.67 (UpperCase, text " ") — Light 190.99 | Return/Default 92×43 @296.66 — Light 93 @295.66 |
| Email | 92.67 @0 | group 191.99 (`gap6`): Spacebar 93.33 · "@" 43.33 · "." 43.33 — Light Spacebar 92.33 | Return/Default 92 (Light 93) |
| URL | 92.67 @0 | group: "." 59.67 · "/" 60.16 · .com 60.16 — Light: three × 59.66 | Return/Default 92 (Light 93) |
| Web Search | 92.67 @0 | group 220.99: Spacebar 181.66 (Light 180.66) · "." key 33.33 | Return/Prominent 63×43 @325.66 with `􀄫` U+10012B |

### Number pad

`iPhone/Number Pad`, 402×308, glass Keyboard Background, `corners 27/27/62/62`, `stack v gap6 pad24,6.67,74,6.67`. Four rows "Stack" 388.66×48 at y 24, 78, 132, 186, `stack h gap6`, keys 125.55×48 at x 0, 131.55, 263.11.

| Row | Left | Middle | Right |
|---|---|---|---|
| 1 | 1 (no override: master's "1" / "ABC") | 2 (letters keep "ABC") | 3 DEF |
| 2 | 4 GHI | 5 JKL | 6 MNO |
| 3 | 7 PQRS | 8 TUV | 9 WXYZ |
| 4 | Lower Left/. (the iPhone example swaps in Lower Left/Hide) | 0 | Delete `􀆛` U+10019B |

Number key: 125×48, `corners 10`, `stack v gap2.67 pad7,0,0,0`: digit 125×22 @0,7, letters 125×11 @0,31.67. Key 0: digit 125×47 @0,0.5 (Light @0,-4.5 with `pad0,0,10,0`). Delete and Lower Left keys have no key fill, only the glyph or text 125×48. Lower Left/Hide has no visible layers in the dump.

### Emoji keyboard

`iPhone/Emoji`, 402×393, glass Keyboard Background, `corners 27/27/62/62`.

| Layer | Size @ position | Contents |
|---|---|---|
| group "Emoji Search" | 378×40 @12,12, `stack h gap10` | "Stack" 250×40 @0,0 (`corners 20`, `stack h gap6 pad10,40,10,10`): `􀊫` U+1002AB 20×20 @10,10 + "Describe an Emoji" 173×20 @36,10 · "Genmoji" 118×40 @260,0 (`corners 20`, `pad10,15,10,15`, `gap5`): shape 18×17 @15,11.5 + text "Genmoji" 65×20 @38,10 |
| rect "Mask" | 402×253 @0,62 | clipping mask |
| group "Emoji" | 634×209 @13.5,62, `stack v gap3` | Rows 1–4, 50 tall at y 0, 53, 106, 159; 12 emoji each, cells 40×50, `gap14` (Row 4: 38×50, `gap16`); some cells are 40×40 bitmaps (IMG_25xx) |
| group "Tabs" | 402×30 @0,278.5, `stack h gap15 pad0,12,0,12` | 10 "Tab" groups 30×30 at x 12, 42.73, 73.45, 104.18, 134.91, 165.64, 196.36, 227.09, 257.82, 288.55, 319.27 (pitch 30.73, derived) · delete `􀆛` 40×24 @350,3 |
| "Emoji and Mic" | 402×78 @0,315 | → Bottom Controls/ABC and Mic |

Tabs: the selected tab @73.45 has a fill, `corners 15`, `pad6,6,6,6`, and `􀐫` U+10042B 18×18 @6,6. Other tabs hold shapes named "Stickers", "Doggos and other animals", "Food and Drink", "Sports", "Favorites", "Shape", or glyphs `􀛭` U+1006ED (14×18 @8,6) and `􀋉` U+1002C9 (30×30).

### Bottom controls (below the iPhone key pad)

402×78 (Dark ABC and Mic 402×79), `stack h gap0 pad26,32,24,32`.

| Component | Left | Right |
|---|---|---|
| Emoji and Mic | shape "Emoji" 27×27 @32,26.5 | mic `􀊰` U+1002B0: Dark shape 18×28 @352,26; Light text 28×28 @342,26 |
| ABC and Mic | text `􀥊` U+10094A: Dark 50×29 @32,26, Light 43×25 @32,27.5 | mic as above (Dark @352,26.5) |

### Suggestion bars

| Component | Size | Layout |
|---|---|---|
| iPhone/Suggestions | Dark 394×25, Light 388×25 | group "Stack" 377×24 (Light 371×24) @8.5,-14, `stack h gap6`: three texts 117×21 (Light 115×21) at x 0, 130, 260 (Light 0, 128, 256) @y1.5, rect "Divider" 1×24 between them (@123, @253; Light @121, @249), `corners max` |
| iPad/Suggestions | 768×28 | texts "“Design”" 213×28 @22, "Designs" 216×28 @276, "Designed" 213×28 @533; "Divider" 1×23 @255 and @512, `corners 1` |

### iPad keyboard

`iPad/{Lower Case, Upper Case}`, 1210×428, glass Keyboard Background. Light stores `corners 27` (from its style); Dark stores no corner radius.

| Part | Size @ position |
|---|---|
| Glyph group "Stack" (top left) | 116×28 @21,14, `gap16` (Light 120×28, `gap18`): `􀱍` U+100C4D @0, `􀱓` U+100C53 @44, `􀉃` U+100243 @88 (Light 0, 46, 92), each 28×28 |
| "Suggestions" | 768×28 @283,14 |
| Rows 1–4 | 1183×74 at x 13.5, y 66, 152, 238, 324 (derived: row gap 12, side insets 13.5, bottom 30 = 428 − 324 − 74) |

Keys (x inside the row; all 74 tall):

| Row | Keys |
|---|---|
| 1 | Command-Left 105 @0 (master glyph `􀅂` U+100142) · ten 2-Story keys 82.25 @119, 215, … 983 (q/1 … p/0) · Command-Right 105 @1078 with `􀆛` U+10019B |
| 2 | Command-Left 138 @0 with `􀆡` U+1001A1 · nine 2-Story keys @152 … 920 (a/@ s/# d/$ f/& g/* h/( j/) k/‘ l/“) · Return 167 @1016 with `􀅇` U+100147 (Dark: Return; Light: Return - Prominent) |
| 3 | Command-Left 182 @0 with `􀆝` U+10019D (Upper Case `􀆞` U+10019E) · seven 2-Story keys @196 … 772 (z/% x/- c/+ v/= b// n/; m/:) · two punctuation keys @868 (82.25) and @963 (82.5 Lower Case, 82.25 Upper Case) · Command-Right 125 @1058 with `􀆝` (Upper Case `􀆞`) |
| 4 | emoji key 85 @0 (Dark: group "Key" with fill and shape "Emoji" 21.67×21.67 @15,37.67; Light: Command-Left with `􀜬` U+10072C) · Command-Left 85 @98 ".?123" · Command-Left 82 @196 `􀊰` · Command-Left 620 @292 (space, text " ") · Command-Right 119.25 @926 ".?123" · Command-Right 125 @1058 `􀓖` U+1004D6 |

Lower Case uses 2-Story-Lower keys and 2-Story-Punctuation (! , and ? .); Upper Case uses 2-Story-Upper keys and 1-Story-Punctuation (! and ?). Derived letter pitch 96, so the letter gap is 13.75 (96 − 82.25); row 4 gaps 13, 13, 14, 14, 12.75.

iPad key masters:

| Key | Size | Layers |
|---|---|---|
| Command-Left / Command-Right | 105×74 | glyph 92×49 @13,13 left-aligned / @0,13 right-aligned |
| Return / Return - Prominent | 105×74 | `􁂆` U+101086 92×49 @0,15, right-aligned |
| 1-Story-Punctuation | 82×74 | "!" 82×37 @0,18 |
| 2-Story-Punctuation | 83×74 | top "?" 82.25×37 @0,4 · bottom "." 82.25×49 @0,23.01 |
| 2-Story-Upper | 82×74 | top "1" 82×37 @0,-1 · main "Q" 82×49 @0,26 |
| 2-Story-Lower | 82×74 | top "1" @0,-1 · main "Q" 82×49 @0,23, stored `transform2` |

Instances override both texts in one list, top character first (e.g. `[text="2"; text="W"]`).

### Accessory bars (iPhone)

| Component | Size | Layout and children |
|---|---|---|
| Toolbar | 402×48 | Dark `stack h pad0`, Light `pad0,12,0,12` · group "Stack" 194×48 @208,0 (Light @196,0), glass Regular - Small, `corners max`, `stack h gap10 pad0,10,0,10` · four "Toolbar Action" 36×36 at x 10, 56, 102, 148, y 6 |
| Toolbar Action | 36×36 | text "Symbol" `􀀀` U+100000 36×36 |
| Find | 402×58, `stack h gap10 pad0,12,10,12` | "Stack" 320×48 @12,0 (gap 10 Dark, 8 Light): "Previous and Next Stepper" @0,0 + "Text Field" 230×48 @90,0 · "Done Button" 48×48 @342,0 |
| Find/Text Field (Placeholder, Value) | 230×48, glass, `corners 100` (Light `max`) | "Search Menu" 27×22 @15,13 (Light Value @14,13) · text "Find" @48,13 (Value: "Text and Cursor" with "Find" 33×22 and Cursor 5×22 @33,0) |
| Find/Previous and Next | Dark 80×48, Light 82×48 (`stack h gap10 pad12,12,12,12`), glass, `corners 100` / `max` | Button 1 24×22 @11,13 (Light @12,13) → Previous/Enabled · Button 2 @45,13 (Light @46,13) → Next/Disabled |
| Find/Previous, Find/Next | 24×22 | `􀆇` U+100187 / `􀆈` U+100188 24×22 |
| Find/Search Menu | 27×22 | text "Search Menu" `􀰖` U+100C16 26×22 |
| Find/Done (Enabled, Disabled) | 48×48, glass, `corners 100` / `max` | text "Done" `􀆅` U+100185: Dark 28×49 @10,-1, Light 27×22 @10.5,13 |
| Find and Replace | 402×111 | rect "Background" 378×101 @12,0, glass, `corners 27` · Previous 30×36 @24,11 · Next 30×36 @53,11 · Find Field 234×36 @92,11 · "Done Button" text 40×22 @336,17 · "Replace Button" text 58×19 @25,64 · Replace Field 234×36 @92,55 (Light 235×36 @91,55) |
| Find and Replace/Previous, Next | 30×36 | glyph 30×36 |
| Find Field/Empty | 234×36, `corners 18`, `stack h gap2 pad7,9,7,9` (Light `pad0,9,0,9`) | Search Menu 27×22 @9,7 · placeholder "Find" @38,7 |
| Find Field/Value | 234×36, `corners 18` | left "Stack" @9,7: Search Menu + "Text and Cursor" (Find 33×22, Cursor 4×22 @33,0) · right "Stack" 87×36 @147,0: "1 of 6" 51×22 @0,7 + `􀁡` U+100061 36×36 @51,0 |
| Replace Field/Empty | 235×36, `corners 18` | `􀈊` U+10020A 24×22 @10,7 · placeholder "Replace" 61×22 @39,7 |
| Replace Field/Value | Dark 236×36, Light 235×36, `corners 18` | `􀈊` @10,7 · "Dukes" 156×22 @39,7 · `􀁡` 36×36 @200,0 (Light @199,0) |
| Search - Placeholder | 402×48, `stack h gap10 pad0,12,0,12` | group "Text Field" 320×48 @12,0, glass Regular - Small, `corners max`, `stack h gap6 pad0,16,0,12`: "Search Symbol" `􀊫` U+1002AB 21×22 @12,13, "Text and Cursor" 241×22 @39,13 (`gap-2`: Cursor 5×22 @0,0, "Search" 54×22 @3,0), "Mic" `􀊰` U+1002B0 18×22 @286,13 · "Button" 48×48 @342,0 → Toolbars/…/48pt/Active/Symbol 1 with `􀆄` U+100184 |

The Alpha keyboard overrides the four toolbar actions with `􀉢` U+100262, `􀅒` U+100152, `􀉥` U+100265, `􂷴` U+102DF4. Master defaults: `􀀀` U+100000, `􀂒` U+100092, `􀛣` U+1006E3, `􀅼` U+10017C.

### iPhone Duo keyboards

Each is `stack v gap12`: an accessory row at y 0 (→ Accessories/Search - Placeholder, 48 tall), then the glass group at y 60 with Suggestions (→ iPhone/Suggestions) @0,24 and the key pad.

| Keyboard | Size | Accessory bar | Glass group | Corners | Key pad |
|---|---|---|---|---|---|
| Outer/Portrait | 466×346 | 442×48 @12 | 466×286, `stack v gap-2 pad24,0,39,0` | 24/24/59/5 | 466×200 @0,47 |
| Outer/Landscape | 678×288.9 (Light 289) | 574×48 @52 | 678×228.9, `pad24,0,20,0` | 24/24/59/59 | 678×159.9 @0,49 |
| Inner/Portrait | 669×420.67 | 561×48 @54 | 669×360.67, `gap-2 pad24,0,19,0` | 32/32/59/59 | 669×294.67 @0,47 |
| Inner/Landscape | 951×337 | 535×48 @208 | 951×277, `pad24,0,20,0` | 32/32/59/59 | 951×208 @0,49 |

Duo key pads (Letters Upper Case shown; the other pads keep the frame):

| Key pad | Frame | Rows (W×H, y) | Emoji and mic |
|---|---|---|---|
| Outer/Portrait | 466×200, `stack v gap10.67 pad0,17.67,0,17.67` | 430.66×42 at y 0, 52.67, 105.33, 158 | in row 4: "Stack" 42×42 @0 (Emoji 22×22 @10,10) · bottom row 334.66×42 @48 · "Stack" 42×42 @388.66 (mic: Dark shape 18×28 @12,7, Light text `􀊰` 28×28 @7,7) |
| Outer/Landscape | 678×159.9, `stack h gap4 pad0,10,0,10` | group "Key Pad" 514×159.9 @82 (`stack v gap9`): rows 33.3 tall at y 0, 42.3, 84.6; row 4 33 tall @126.9 | side "Stack" 68 wide @10 (Emoji 28×28 @20,128.57) and @600 (`􀊰` 28 wide @20) |
| Inner/Portrait | 669×294.67, `stack v gap14 pad0,17.67,0,17.67` | 633.66×49.67 at y 0, 63.67, 127.33, 191 | group "Emoji and Mic" 633.66×40 @17.67,254.67 (`pad4,63,0,63`): Emoji 28×28 @63,8 · `􀊰` 28×36 @542.66,4 |
| Inner/Landscape | 951×208, `stack h gap5 pad0,12,0,12` | group "Key Pad" 781×208 @85 (`gap13`): rows 42.33 tall at y 0, 55.33, 110.67; row 4 42 tall @166 | side "Stack" 68 wide @12 (Emoji 28×28 @20,177) and @871 (`􀊰`) |

### Examples

| Example | Canvas | Keyboard instance |
|---|---|---|
| iPhone: Alpha - Lower Case, Alpha - Upper Case (Dark: "Dark"), Numeric, Punctuation, Email, URL, Web Search | 402×874 | 402×393 @0,481 (→ Alpha, with key pad and bottom row swaps) + Status Bar 402×62 |
| iPhone: Emoji | 402×874 | 402×393 @0,481 |
| iPhone: Number Pad | 402×874 | 402×308 @0,566, Lower Left swapped to Hide |
| iPad: Lower Case, Upper Case | 1210×834 | 1210×428 @0,406 + Status Bar 1210×32 |
| iPhone Duo Outer Portrait | 466×678 | 466×346 @0,332 + Lens 95.67×95.67 @370.33,0 |
| iPhone Duo Outer Landscape | 678×466 | 678×288.9 @0,177.1 + Lens @0,0 |
| iPhone Duo Inner Portrait | 669×951 | 669×420.67 @0,530.33 |
| iPhone Duo Inner Landscape | 951×669 | 951×337 @0,332 |

Derived: every example puts the keyboard flush with the bottom edge (481 + 393 = 874, 566 + 308 = 874, 406 + 428 = 834, 332 + 346 = 678, 177.1 + 288.9 = 466, 530.33 + 420.67 = 951, 332 + 337 = 669).

## More on this component

Sizes, colours, text and effects: `keyboards-values.md`.
