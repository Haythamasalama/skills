"""Write the colour, text-style, material and control-style reference pages from the Sketch kit's shared tokens.

Usage: python3 scripts/gen_tokens.py <kit-json-dir> <skill-dir> [<dump-dir>]
  <kit-json-dir>  document.json, meta.json and pages/ unzipped from Apple's .sketch kit
  <skill-dir>     this skill's folder; pages are written to <skill-dir>/references
  <dump-dir>      optional output of extract.py; copied to <skill-dir>/specs for local lookups
"""
import collections, datetime, os, re, shutil, sys
sys.path.insert(0, os.path.dirname(__file__))
from extract import Kit, num

PLATFORM = "mac"

KITS = {
    "mac": {
        "kit": "Apple macOS 27 UI Kit", "label": "macOS 27",
        "pages": {
            "materials.md": ("Materials and Liquid Glass", ["Liquid Glass", "Materials"],
                             "These are the kit's shared layer styles for glass and materials."),
            "surface-styles.md": ("Window, panel, sidebar and global styles", ["Windows", "Panels", "Sidebar", "Global"],
                                  "These are the kit's shared layer styles for window, panel and sidebar surfaces, plus global helpers."),
            "control-styles-content-area.md": ("Control fill styles, Content Area", ["Content Area"],
                                               "Shared layer styles the controls use for each state on window content."),
            "control-styles-over-glass.md": ("Control fill styles, Over-glass", ["Over-Glass"],
                                             "Shared layer styles the controls use for each state on glass bars."),
        },
    },
    "ios": {
        "kit": "Apple iOS 27 UI Kit", "label": "iOS 27",
        "pages": {
            "materials.md": ("Materials and Liquid Glass", ["Liquid Glass", "Materials"],
                             "These are the kit's shared layer styles for glass, materials and surfaces."),
            "control-styles.md": ("Control fill styles", ["Controls"],
                                  "Shared layer styles the controls use for each state. Component pages name the style each part uses."),
        },
    },
}


def natural(s):
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", s)]


def header(title, cfg, owns, note):
    return [f"# {title} — {cfg['label']}", "",
            f"**Read when:** you need an exact {cfg['label']} value for {title[0].lower() + title[1:]} as Apple's kit stores it.",
            f"**Owns:** {owns}", "",
            f"Source: `{cfg['kit']}.sketch` from Apple Design Resources (developer.apple.com/design/resources), read {datetime.date.today()}. "
            f"Every value below is copied from the kit's shared tokens by a script; nothing is estimated. {note}", ""]


def colour_table(k):
    groups = collections.OrderedDict()
    for o in k.doc["sharedSwatches"]["objects"]:
        parts = o["name"].split("/")
        if len(parts) < 3 or parts[0].startswith("x."):
            continue
        fam, variant, name = parts[0], parts[1], "/".join(parts[2:])
        groups.setdefault(fam, collections.OrderedDict()).setdefault(name, {})[variant] = k.color(o["value"]).split(" {")[0]
    out = []
    for fam, rows in groups.items():
        variants = []
        for r in rows.values():
            for v in r:
                if v not in variants:
                    variants.append(v)
        variants.sort(key=lambda v: (("Dark" in v), ("Vibrant" in v or "plus" in v), v))
        out += [f"## {fam}", "", "| Name | " + " | ".join(variants) + " |", "|---|" + "---|" * len(variants)]
        for name in sorted(rows, key=natural):
            out.append(f"| {name} | " + " | ".join(rows[name].get(v, "—") for v in variants) + " |")
        out.append("")
    return out


def text_styles(k):
    rows = []
    for o in k.doc["layerTextStyles"]["objects"]:
        ts = o["value"].get("textStyle", {}).get("encodedAttributes", {})
        font = ts.get("MSAttributedStringFontAttribute", {}).get("attributes", {})
        ps = ts.get("paragraphStyle", {})
        lh = ps.get("maximumLineHeight") or ps.get("minimumLineHeight")
        rows.append((o["name"], font.get("name", "?"), num(font.get("size")), num(lh) if lh else "—",
                     num(ts["kerning"]) if ts.get("kerning") else "0",
                     k.color(ts["MSAttributedStringColorAttribute"]) if "MSAttributedStringColorAttribute" in ts else "—"))
    rows.sort(key=lambda r: natural(r[0]))
    out = ["| Style | Font (PostScript name) | Size | Line height | Tracking | Colour |", "|---|---|---|---|---|---|"]
    out += [f"| {' | '.join(r)} |" for r in rows]
    return out


def layer_styles(k, prefixes):
    out, current = [], None
    names = sorted((o for o in k.doc["layerStyles"]["objects"] if o["name"].split("/")[0] in prefixes),
                   key=lambda o: natural(o["name"]))
    for o in names:
        fam = "/".join(o["name"].split("/")[:2])
        if fam != current:
            out += ["", f"## {fam}", ""]
            current = fam
        out.append(f"- **{o['name']}**")
        for p in k.style(o["value"]):
            out.append(f"  - {p}")
    return out


LEGEND = ["## How to read the effect lines", "",
          "- Colours are `#RRGGBB`, with `@NN%` for alpha below 100%. A name in `{braces}` is the kit swatch the colour is bound to.",
          "- `blend plus-darker` / `blend plus-lighter` are the Plus Darker / Plus Lighter blend modes the kit uses for vibrant colours.",
          "- `shadow` / `inner-shadow`: x offset, y offset, blur radius, spread, colour.",
          "- `blur background`: background blur radius and saturation. `blur glass`: Sketch's glass effect with its radius, saturation, brightness, distortion, depth and chromatic aberration values.",
          "- `corners R smoothingS styleN`: corner radius R (`max` = fully rounded, a capsule or circle), corner smoothing S and the kit's corner style number N, as stored.",
          "- `opacity` is the layer opacity; a fill's own opacity and blend mode are in brackets after it.", ""]


def write(path, lines):
    open(path, "w").write("\n".join(lines) + "\n")


def main(kit_dir, skill_dir, dump_dir=None):
    cfg = KITS[PLATFORM]
    k = Kit(kit_dir)
    ref = os.path.join(skill_dir, "references")
    os.makedirs(ref, exist_ok=True)

    if dump_dir:
        specs = os.path.join(skill_dir, "specs")
        os.makedirs(specs, exist_ok=True)
        for fn in sorted(os.listdir(dump_dir)):
            shutil.copy(os.path.join(dump_dir, fn), os.path.join(specs, re.sub(r"^\d+-", "", fn)))

    if PLATFORM == "mac":
        write(f"{ref}/colors.md", header("Colours", cfg, "every swatch in the kit, per appearance and vibrancy.",
                                         "Columns are the kit's own swatch groups. Vibrant columns are meant to be drawn with the blend mode in their name.")
              + colour_table(k))
    else:
        # The iOS colour page is written by hand from the Figma kit; only the Liquid Glass labels come from Sketch.
        path = f"{ref}/colors.md"
        existing = open(path).read() if os.path.exists(path) else ""
        if "## Labels - Liquid Glass (Sketch kit)" not in existing and "## Where the Sketch kit differs" not in existing:
            keep, on = [], False
            for line in (l for l in colour_table(k) if l):
                if line.startswith("## "):
                    on = line == "## Labels - Liquid Glass"
                    continue
                if on:
                    keep.append(line)
            intro = ["", "## Labels - Liquid Glass (Sketch kit)", "",
                     f"From `{cfg['kit']}.sketch`, read {datetime.date.today()}. The Figma variables above have no Liquid Glass label group; the Sketch kit's swatches do.", ""]
            open(path, "a").write("\n".join(intro + keep) + "\n")

    lines = header("Text styles", cfg, "every shared text style: font, size, line height, tracking and colour.",
                   "Font names are PostScript names as stored (SFPro-Bold = SF Pro Bold). Tracking is Sketch kerning in points.")
    lines += text_styles(k)
    if PLATFORM == "ios":
        lines += ["", "The Dynamic Type size tables are on the kit's Text Styles page; see `text-styles-and-dynamic-type.md`."]
    write(f"{ref}/text-styles.md", lines)

    for fname, (title, prefixes, note) in cfg["pages"].items():
        owns = "the shared layer styles in the groups " + ", ".join(prefixes) + "."
        write(f"{ref}/{fname}", header(title, cfg, owns, note) + LEGEND + layer_styles(k, prefixes))

    print(PLATFORM, "->", ref)


if __name__ == "__main__":
    if len(sys.argv) not in (3, 4):
        sys.exit(__doc__)
    main(*sys.argv[1:])
