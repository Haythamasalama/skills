# Review and verify

How to read a page the way its reader does, compare languages, run the scanner, sweep the rendered
page, and check RTL before saying done.

## 1. Dump a page in reading order

Strings for one page are often spread across files: names in one, summaries in another, points in
a third. Reading one file top to bottom hides repetition and contradictions. Print the page as the
reader meets it, headings first, then summaries, then bodies.

Laravel `lang/` arrays (adapt the file names, group key and slugs):

```bash
php -r '
$names = require "lang/ar/site/catalogue.php";
$sums  = require "lang/ar/site/pricing.php";
$pts   = require "lang/ar/site/features.php";
$slugs = ["alpha", "beta", "gamma"];
foreach ($slugs as $i => $slug) {
  printf("%02d %s\n   %s\n", $i + 1, $names["features"][$slug], $sums["summaries"][$slug]);
  foreach ($pts["points"][$slug] as $pt) printf("   • %s\n", $pt["title"]);
}'
```

## 2. Dump Arabic beside English by key

Where the two disagree is where the valuable finds are: inverted modality, a dropped clause, a
number that changed, a joke translated.

PHP arrays:

```bash
php -r '
function walk($en, $ar, $p = "") {
  foreach ($en as $k => $v) {
    $key = $p === "" ? (string) $k : "$p.$k";
    if (is_array($v)) { walk($v, $ar[$k] ?? [], $key); continue; }
    if (mb_strlen($v) < 25) continue;
    printf("%s\n  EN %s\n  AR %s\n", $key, $v, $ar[$k] ?? "<<missing>>");
  }
}
walk(require "lang/en/site.php", require "lang/ar/site.php");'
```

JSON locale files:

```bash
python3 - lang/en.json lang/ar.json <<'PY'
import json, sys
en, ar = (json.load(open(p, encoding="utf-8")) for p in sys.argv[1:3])
def walk(e, a, p=""):
    for k, v in e.items():
        key = f"{p}.{k}" if p else k
        if isinstance(v, dict):
            walk(v, a.get(k, {}) if isinstance(a, dict) else {}, key)
        elif isinstance(v, str) and len(v) >= 25:
            print(f"{key}\n  EN {v}\n  AR {a.get(k, '<<missing>>') if isinstance(a, dict) else '<<missing>>'}")
walk(en, ar)
PY
```

The same walk is the key-parity check: a `<<missing>>` or an Arabic value identical to its English
twin is a defect.

## 3. Scan, rewrite, scan again

```bash
python3 scripts/scan_markers.py lang/ar           # prose hits; exits 1 if any
python3 scripts/scan_markers.py lang/ar --all     # include console/demo strings
python3 scripts/scan_markers.py lang/ar --console-words 'ticker|receipt'
```

- Run it on what you wrote, not only on what you found. Fluent writers reach for English joints.
- A hit in a console string (a log line, a search placeholder, a chip) is usually correct.
- A false positive means fixing the scanner's pattern. A gate that cries wolf is a gate nobody runs.
- Clean scanner output proves only that the mechanical tells are gone. Sections 1, 2 and 5 of
  `tells-and-rewrites.md` still need a reader.

## 4. Sweep the rendered page

Paste `scripts/sweep_page.js` into a browser tool's JavaScript evaluator on a loaded page, in each
language. It returns:

- `mounted`: did the app render? A page that never mounted sweeps clean and tells you nothing.
- `latinRuns`: Latin prose left in the rendered text.
- `attributes`: Latin in `placeholder`, `aria-label`, `title`, `alt`, which `innerText` cannot see.
- `initials`: one- and two-letter Latin strings, usually hardcoded avatar initials.
- `overflow`: `scrollWidth - clientWidth`, which must be 0.

Everything it returns needs judgement: SQL keywords, table names, engine names and the brand are
meant to stay Latin.

Rules that came from false clean reports:

- **Rendered text only.** The raw HTML of a server-rendered SPA carries a props payload full of
  "remaining English" strings nobody sees.
- **Confirm the page mounted.** The root has children and `body.innerText.length` is plausible.
- **If the asset dev server is unreachable from the browser tool,** serve the built assets
  instead. (Laravel + Vite: move `public/hot` aside, build, sweep, put it back.)
- **Serve over HTTP, not `file://`,** and read `pageerror`.

## 5. RTL checklist

The rules behind these checks (logical classes, isolation, which icons flip, digits, Arabic fonts)
live once in the `nuxt-ui` skill's [i18n-rtl.md](../../nuxt-ui/references/i18n-rtl.md#layout-once-both-directions); they hold for
any stack. On the rendered page, check:

- no physical direction class (`ml-`, `pr-`, `left-`, `text-left`) on anything that should flip;
- no typed directional glyph («→»): each is an icon that flips;
- no horizontal overflow at mobile width;
- Arabic text has normal letter spacing and no uppercase transform, labels and eyebrows included;
- Latin text keeps its own face;
- light and dark, mobile and desktop, in both languages.

## 6. Gates, in order

1. Key-parity test between the locale files.
2. Type check and lint.
3. Build.
4. Rendered sweep of every translated page, in both languages.
5. The full test suite. It is the only thing that catches a helper deleted from under a script.
6. Static analysis.

Report what actually ran, and say plainly what could not run (no PHP on the machine, no dev
server, a blocked browser).

## 7. "It does not appear" is not a copy question

When text or a component does not show at all:

- Mount the real component, not a hand-copy of its template. A copy leaves the script block behind
  and cannot reproduce a `setup` error. (A real case: `Cannot access 't' before initialization`
  rendered nothing at any width in either language, while a harness of the template measured a
  3px collision and shipped the wrong fix.)
- Serve over HTTP and read the console and `pageerror` first.
- Check which build the user is looking at. A local host that serves the main checkout does not
  show a worktree's changes until they are merged.

## 8. Hand-back template

```markdown
## Before / after

| Key | Before | After | Reason |
|---|---|---|---|
| `group.key` | … | … | one clause |

## Needs your decision (not translation problems)

1. A count that contradicts the code or another page, with both values and the source.
2. A claim I could not verify, and what would prove it.
3. A missing piece (reassurance line, real numbers instead of social proof).

## Checked and clean

- Scanner: 0 prose hits after the rewrite (N before).
- Keys: same N keys in both files.
- Console strings left as they are, and why.

## Not run

- What could not run here, and the command to run before merge.
```

Write it in the user's language. Keep assumptions you made at the end, one line each, so they can
be corrected.
