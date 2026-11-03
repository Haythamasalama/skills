"""Dump Apple's Sketch UI kits into plain text: every component, layer, colour, type and effect, exactly as stored."""
import json, os, re, sys

BLEND = {0: "", 1: "darken", 2: "multiply", 3: "color-burn", 4: "lighten", 5: "screen", 6: "color-dodge",
         7: "overlay", 8: "soft-light", 9: "hard-light", 10: "difference", 11: "exclusion", 12: "hue",
         13: "saturation", 14: "color", 15: "luminosity", 16: "plus-darker", 17: "plus-lighter"}
BLUR = {0: "gaussian", 1: "motion", 2: "zoom", 3: "background", 4: "glass"}
GRAD = {0: "linear", 1: "radial", 2: "angular"}
ALIGN = {0: "left", 1: "right", 2: "center", 3: "justified", 4: "natural"}
BORDER_POS = {0: "center", 1: "inside", 2: "outside"}
FLOAT_MAX = 3.0e38


def num(v):
    if v is None:
        return "?"
    if abs(v) >= FLOAT_MAX:
        return "max"
    r = round(v, 2)
    return str(int(r)) if r == int(r) else str(r)


class Kit:
    def __init__(self, root):
        self.root = root
        self.doc = json.load(open(f"{root}/document.json"))
        self.meta = json.load(open(f"{root}/meta.json"))
        self.swatches = {o["do_objectID"]: o for o in self.doc["sharedSwatches"]["objects"]}
        self.layer_styles = {o["do_objectID"]: o["name"] for o in self.doc["layerStyles"]["objects"]}
        self.text_styles = {o["do_objectID"]: o["name"] for o in self.doc["layerTextStyles"]["objects"]}
        for f in self.doc.get("foreignTextStyles", []):
            lo = f.get("localSharedStyle") or {}
            if lo.get("do_objectID"):
                self.text_styles[lo["do_objectID"]] = "lib:" + lo.get("name", "?")
        for f in self.doc.get("foreignSwatches", []):
            lo = f.get("localSwatch") or {}
            if lo.get("do_objectID"):
                self.swatches[lo["do_objectID"]] = lo
        self.symbols = {}
        self.pages = []
        for ref in self.doc["pages"]:
            pid = ref["_ref"].split("/")[-1]
            page = json.load(open(f"{root}/pages/{pid}.json"))
            self.pages.append(page)
            self._index(page)

    def _index(self, node):
        if node["_class"] == "symbolMaster":
            self.symbols[node["symbolID"]] = node["name"]
        for ch in node.get("layers", []):
            self._index(ch)

    def color(self, c):
        if not c:
            return "?"
        r, g, b = (round(max(0, min(1, c[k])) * 255) for k in ("red", "green", "blue"))
        s = f"#{r:02X}{g:02X}{b:02X}"
        a = c.get("alpha", 1)
        if a < 0.9999:
            s += f"@{round(a * 100, 1):g}%"
        sid = c.get("swatchID")
        if sid:
            if sid in self.swatches:
                s += " {" + self.swatches[sid]["name"] + "}"
        return s

    def ctx(self, cs):
        if not cs:
            return ""
        out = []
        if cs.get("opacity", 1) < 0.9999:
            out.append(f"opacity {num(cs['opacity'] * 100)}%")
        if BLEND.get(cs.get("blendMode", 0)):
            out.append("blend " + BLEND[cs["blendMode"]])
        return " ".join(out)

    def gradient(self, g):
        stops = ", ".join(f"{self.color(s['color'])} {num(s['position'] * 100)}%" for s in g.get("stops", []))
        return f"{GRAD.get(g.get('gradientType'), g.get('gradientType'))} {g.get('from')}→{g.get('to')} [{stops}]"

    def paint(self, f):
        t = f.get("fillType", 0)
        if t == 0:
            s = self.color(f.get("color"))
        elif t == 1:
            s = "gradient " + self.gradient(f.get("gradient", {}))
        else:
            s = "image"
        extra = self.ctx(f.get("contextSettings"))
        return s + (f" ({extra})" if extra else "")

    def style(self, st, node=None):
        if not st:
            return []
        parts = []
        fills = [f for f in st.get("fills", []) if f.get("isEnabled")]
        if fills:
            parts.append("fill " + " + ".join(self.paint(f) for f in fills))
        borders = [b for b in st.get("borders", []) if b.get("isEnabled")]
        for b in borders:
            parts.append(f"border {num(b.get('thickness'))} {BORDER_POS.get(b.get('position'), b.get('position'))} {self.paint(b)}")
        bo = st.get("borderOptions") or {}
        if borders and bo.get("dashPattern"):
            parts.append("dash " + ",".join(num(x) for x in bo["dashPattern"]))
        for sh in st.get("shadows", []) + st.get("innerShadows", []):
            if not sh.get("isEnabled"):
                continue
            kind = "inner-shadow" if sh.get("isInnerShadow") or sh.get("_class") == "innerShadow" else "shadow"
            extra = self.ctx(sh.get("contextSettings"))
            parts.append(f"{kind} x{num(sh['offsetX'])} y{num(sh['offsetY'])} blur{num(sh['blurRadius'])} spread{num(sh.get('spread', 0))} {self.color(sh.get('color'))}" + (f" ({extra})" if extra else ""))
        for bl in st.get("blurs", []) + ([st["blur"]] if isinstance(st.get("blur"), dict) else []):
            if not bl.get("isEnabled"):
                continue
            t = BLUR.get(bl.get("type"), bl.get("type"))
            s = f"blur {t} radius{num(bl.get('radius'))}"
            if bl.get("type") in (3, 4):
                s += f" saturation{num(bl.get('saturation', 1))}"
            if bl.get("type") == 4:
                s += f" brightness{num(bl.get('brightness', 1))} distortion{num(bl.get('distortion'))} depth{num(bl.get('depth'))} chromatic{num(bl.get('chromaticAberrationMultiplier'))}"
            if bl.get("isProgressive"):
                s += " progressive"
            parts.append(s)
        co = st.get("corners")
        if co and co.get("radii"):
            radii = co["radii"]
            r = num(radii[0]) if len(set(radii)) == 1 else "/".join(num(x) for x in radii)
            parts.append(f"corners {r} smoothing{num(co.get('smoothing'))} style{co.get('style')}" + (" concentric" if co.get("prefersConcentric") else ""))
        cs = self.ctx(st.get("contextSettings"))
        if cs:
            parts.append(cs)
        return parts

    def text(self, n):
        a = n.get("attributedString", {})
        s = a.get("string", "").replace("\n", "⏎")
        if len(s) > 80:
            s = s[:80] + "…"
        runs = []
        for at in a.get("attributes", []):
            v = at.get("attributes", {})
            font = v.get("MSAttributedStringFontAttribute", {}).get("attributes", {})
            ps = v.get("paragraphStyle", {})
            r = f"{font.get('name')} {num(font.get('size'))}"
            lh = ps.get("maximumLineHeight") or ps.get("minimumLineHeight")
            if lh:
                r += f" lh{num(lh)}"
            if v.get("kerning"):
                r += f" kern{num(v['kerning'])}"
            if "MSAttributedStringColorAttribute" in v:
                r += " " + self.color(v["MSAttributedStringColorAttribute"])
            if "alignment" in ps:
                r += " " + ALIGN.get(ps["alignment"], str(ps["alignment"]))
            if v.get("MSAttributedStringTextTransformAttribute"):
                r += f" transform{v['MSAttributedStringTextTransformAttribute']}"
            if v.get("underlineStyle"):
                r += " underline"
            runs.append(r)
        runs = list(dict.fromkeys(runs))
        return f"\"{s}\" " + " | ".join(runs)

    def overrides(self, n):
        out = []
        for o in n.get("overrideValues", []):
            name, val = o.get("overrideName", ""), o.get("value")
            kind = name.split("_", 1)[-1]
            if kind == "stringValue":
                out.append(f"text=\"{str(val)[:40]}\"")
            elif kind == "symbolID":
                out.append(f"swap→{self.symbols.get(val, 'none' if not val else 'ext')}")
            elif kind == "layerStyle":
                out.append(f"style→{self.layer_styles.get(val, val)}")
            elif kind == "textStyle":
                out.append(f"textstyle→{self.text_styles.get(val, val)}")
            elif kind.startswith("color") or kind.startswith("fillColor") or kind.startswith("borderColor"):
                out.append(f"{kind}→{self.color(val) if isinstance(val, dict) else val}")
            elif kind == "isVisible" or kind == "layerVisibility":
                out.append(f"{kind}→{val}")
            elif kind == "image":
                out.append("image")
        return out

    def node(self, n, depth, lines):
        if n.get("isVisible") is False:
            return
        f = n.get("frame", {})
        cls = n["_class"]
        label = {"symbolMaster": "COMPONENT", "artboard": "BOARD", "symbolInstance": "use", "shapeGroup": "shape",
                 "shapePath": "path", "rectangle": "rect", "oval": "oval", "text": "text", "group": "group",
                 "bitmap": "image", "triangle": "triangle", "star": "star", "polygon": "polygon",
                 "slice": "slice", "hotspot": "hotspot"}.get(cls, cls)
        if cls in ("slice", "hotspot", "MSImmutableHotspotLayer"):
            return
        head = f"{'  ' * depth}{label} \"{n.get('name')}\" {num(f.get('width'))}×{num(f.get('height'))}"
        if depth:
            head += f" @{num(f.get('x'))},{num(f.get('y'))}"
        parts = []
        if cls == "symbolInstance":
            parts.append("→ " + self.symbols.get(n.get("symbolID"), "external symbol"))
            ov = self.overrides(n)
            if ov:
                parts.append("[" + "; ".join(ov) + "]")
        if cls == "text":
            parts.append(self.text(n))
        if n.get("sharedStyleID"):
            sid = n["sharedStyleID"]
            if sid in self.layer_styles:
                parts.append(f"style=\"{self.layer_styles[sid]}\"")
            elif sid in self.text_styles:
                parts.append(f"textstyle=\"{self.text_styles[sid]}\"")
        parts += self.style(n.get("style"), n)
        if cls in ("rectangle", "shapePath") and not (n.get("style", {}).get("corners") or {}).get("radii"):
            radii = [p.get("cornerRadius", 0) for p in n.get("points", [])]
            if any(radii):
                parts.append("radius " + (num(radii[0]) if len(set(radii)) == 1 else "/".join(num(r) for r in radii)))
        if n.get("hasClippingMask"):
            parts.append("mask")
        gl = n.get("groupLayout") or {}
        if gl.get("_class") == "MSImmutableInferredGroupLayout":
            pass
        elif gl.get("_class") == "MSImmutableFlexGroupLayout":
            pad = [n.get(k) for k in ("topPadding", "rightPadding", "bottomPadding", "leftPadding")]
            s = f"stack {'h' if gl.get('flexDirection') == 0 else 'v'} gap{num(gl.get('allGuttersGap'))}"
            if any(p is not None for p in pad):
                s += " pad" + ",".join(num(p or 0) for p in pad)
            parts.append(s)
        if cls == "symbolMaster" and n.get("backgroundColor") and n.get("hasBackgroundColor"):
            parts.append("background " + self.color(n["backgroundColor"]))
        lines.append(head + ("  " + " · ".join(parts) if parts else ""))
        if cls in ("shapeGroup",):
            return
        for ch in n.get("layers", []):
            self.node(ch, depth + 1, lines)


def slug(name):
    name = re.sub(r"[^\w\s-]", "", name).strip().lower()
    return re.sub(r"[\s_]+", "-", name) or "page"


def dump(kit_dir, out_dir):
    k = Kit(kit_dir)
    os.makedirs(out_dir, exist_ok=True)
    index = []
    for i, page in enumerate(k.pages):
        name = page["name"].strip()
        if set(name) <= set("— "):
            continue
        lines = [f"# {name}", ""]
        tops = page.get("layers", [])
        for t in tops:
            k.node(t, 0, lines)
            lines.append("")
        fn = f"{i:02d}-{slug(name)}.txt"
        open(f"{out_dir}/{fn}", "w").write("\n".join(lines))
        index.append((fn, name, len(lines)))
    tokens = [f"# Tokens"]
    tokens.append("\n## Swatches (name: colour)")
    for o in k.doc["sharedSwatches"]["objects"]:
        tokens.append(f"{o['name']}: {k.color(o['value'])}")
    tokens.append("\n## Layer styles")
    for o in k.doc["layerStyles"]["objects"]:
        tokens.append(f"{o['name']}: " + " · ".join(k.style(o["value"])))
    tokens.append("\n## Text styles")
    for o in k.doc["layerTextStyles"]["objects"]:
        ts = o["value"].get("textStyle", {}).get("encodedAttributes", {})
        font = ts.get("MSAttributedStringFontAttribute", {}).get("attributes", {})
        ps = ts.get("paragraphStyle", {})
        line = f"{o['name']}: {font.get('name')} {num(font.get('size'))}"
        lh = ps.get("maximumLineHeight") or ps.get("minimumLineHeight")
        if lh:
            line += f" lh{num(lh)}"
        if ts.get("kerning"):
            line += f" kern{num(ts['kerning'])}"
        if "MSAttributedStringColorAttribute" in ts:
            line += " " + k.color(ts["MSAttributedStringColorAttribute"])
        if "alignment" in ps:
            line += " " + ALIGN.get(ps["alignment"], str(ps["alignment"]))
        tokens.append(line)
    open(f"{out_dir}/00-tokens.txt", "w").write("\n".join(tokens))
    for fn, name, n in index:
        print(f"{fn:<44} {n:>7} lines")


if __name__ == "__main__":
    dump(sys.argv[1], sys.argv[2])
