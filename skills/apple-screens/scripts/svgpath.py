"""Print SVG path data for named shape layers inside a Sketch symbol master."""
import json, re, sys

def pt(s, f):
    x, y = map(float, re.findall(r"-?[\d.e+-]+", s)[:2])
    return f["x"] + x * f["width"], f["y"] + y * f["height"]

def path_d(layer, ox=0.0, oy=0.0):
    f = dict(layer["frame"]); f["x"] += ox; f["y"] += oy
    pts = layer.get("points", [])
    if not pts:
        return ""
    def fmt(p): return f"{p[0]:.3f} {p[1]:.3f}"
    d = [f"M{fmt(pt(pts[0]['point'], f))}"]
    n = len(pts)
    segs = range(1, n + 1) if layer.get("isClosed") else range(1, n)
    for i in segs:
        a, b = pts[i - 1], pts[i % n]
        if a.get("hasCurveFrom") or b.get("hasCurveTo"):
            d.append(f"C{fmt(pt(a['curveFrom'], f))} {fmt(pt(b['curveTo'], f))} {fmt(pt(b['point'], f))}")
        else:
            d.append(f"L{fmt(pt(b['point'], f))}")
    if layer.get("isClosed"):
        d.append("Z")
    return "".join(d)

def collect(layer, ox=0.0, oy=0.0):
    if layer["_class"] in ("shapePath", "rectangle", "oval", "triangle", "star", "polygon"):
        return [path_d(layer, ox, oy)]
    out = []
    f = layer.get("frame", {"x": 0, "y": 0})
    for ch in layer.get("layers", []):
        out += collect(ch, ox + f["x"], oy + f["y"])
    return out

kit_dir, master_name = sys.argv[1], sys.argv[2]
wanted = sys.argv[3:]
doc = json.load(open(f"{kit_dir}/document.json"))
for ref in doc["pages"]:
    page = json.load(open(f"{kit_dir}/pages/{ref['_ref'].split('/')[-1]}.json"))
    stack = list(page["layers"])
    while stack:
        n = stack.pop()
        if n.get("_class") == "symbolMaster" and n["name"] == master_name:
            def walk(l, ox, oy):
                if l.get("name") in wanted:
                    f = l["frame"]
                    if l["_class"] in ("shapeGroup",):
                        ds = []
                        for ch in l.get("layers", []):
                            ds += collect(ch, 0, 0)
                    else:
                        ds = [path_d(l, -f["x"], -f["y"])]
                    print(f"{l['name']} {f['width']:.2f}x{f['height']:.2f} rule={l.get('windingRule', l.get('style', {}).get('windingRule'))}")
                    print("  " + " ".join(ds))
                    return
                f = l.get("frame", {"x": 0, "y": 0})
                for ch in l.get("layers", []):
                    walk(ch, ox + f["x"], oy + f["y"])
            for ch in n["layers"]:
                walk(ch, 0, 0)
            sys.exit()
        stack += n.get("layers", [])
