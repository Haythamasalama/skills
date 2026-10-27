#!/usr/bin/env python3
"""Find the structures that give away Arabic translated from English.

Walks a locale tree and reports candidates with file and line, split into
prose (where the rules apply) and console strings (where they do not, because
the text is imitating a product screen and should read like one).

    python3 scan_markers.py lang/ar
    python3 scan_markers.py lang/ar --all        # don't hide console strings
    python3 scan_markers.py lang/ar --json       # machine-readable
    python3 scan_markers.py lang/ar --console-words 'ticker|receipt'
                                                 # extra key words that draw a screen

Works on string literals in PHP arrays, JSON, YAML, JS/TS and Vue, and on
Markdown or plain text line by line. Exits 1 when prose hits remain.

Every hit needs a human decision. An em dash between two clauses is English
rhythm; an em dash in a search placeholder is a separator doing its job. The
script guesses which is which and is wrong often enough that you should look.
A false positive means fixing the pattern here, not the copy.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

# Key words whose values draw a product screen rather than address the reader.
# These keep their separators, their handles and their lowercase Latin. A key
# counts when one of these is a whole segment of it: `log_run`, `searchHint`
# and `console.footer` match; `login`, `catalog` and `transaction` do not.
CONSOLE_WORDS = [
    "search", "placeholder", "path", "paths", "filter", "filters", "footer",
    "breadcrumb", "chip", "log", "logs", "entries", "activity", "status",
    "state", "action", "actions", "label", "caption", "console", "terminal",
    "command", "run", "demo", "sample", "mock", "preview",
]

# An identifier right before `=>` (PHP), `:` (JSON, YAML, JS) or `=` (an
# HTML attribute), quoted or not.
KEY_TOKEN = re.compile(r"""(['"]?)([A-Za-z][A-Za-z0-9_.\-]*)\1\s*(?:=>|:|=)""")


def console_word_pattern(words: list[str]) -> re.Pattern[str]:
    forms = "|".join(f"{w}|{w.capitalize()}" for w in words)
    return re.compile(rf"(?<![a-z])(?:{forms})(?![a-z])")


CONSOLE_KEY_WORD = console_word_pattern(CONSOLE_WORDS)


def has_console_key(line: str) -> bool:
    return any(CONSOLE_KEY_WORD.search(m.group(2)) for m in KEY_TOKEN.finditer(line))


# A value that is mostly identifiers, SQL or a timestamp is console furniture
# whatever its key is called.
CONSOLE_SHAPE = re.compile(
    r"(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|WHERE|FROM|LIMIT|CONCAT"
    r"|\b\d{1,2}:\d{2}\b|·"
    # a host-like handle: web-01, db-02
    r"|\b[a-z][a-z0-9]*-\d+\b"
    # a snake_case identifier, or any Latin run the author bothered to wrap in
    # bidi isolates, means the string is naming something on a screen
    r"|\b[a-z]+_[a-z_]+\b|⁦)"
)

MARKERS: list[tuple[str, str, str]] = [
    (
        "em-dash",
        "—",
        "English joint. Ask what it was doing: adding (و), listing (:), "
        "joining two sentences (.), or giving a reason (فـ).",
    ),
    (
        "yatimm",
        r"يتم\s+ا?ل?[ء-ي]",
        "يتم + مصدر is English passive periphrasis. Use the verb itself.",
    ),
    (
        "min-qibal",
        r"من\s+قِ?بَ?ل",
        "من قِبَل calques the passive 'by'. Make the doer the subject.",
    ),
    (
        "bishakl",
        r"بشكل\s",
        "بشكل calques an '-ly' adverb. Usually deletable.",
    ),
    (
        "al-khas-bi",
        # not «الخاصة بموجب/بين/بعد…», where the ب opens its own word
        r"الخاصة?\s+ب(?!موجب|ين|عد|شأن|سبب|إذن|فضل|حكم|مقتضى)",
        "الخاص بـ calques the possessive. The suffix already says it.",
    ),
    (
        "qum-bi",
        r"\bقم\s+بـ?[ء-ي]",
        "قم بـ calques the English imperative. Use the plain imperative.",
    ),
    (
        "sawfa",
        r"\bسوف\s",
        "سوف for a simple present. The Arabic present already covers it.",
    ),
    (
        "nafs-before-noun",
        # «نفس الفريق» for «the same team»; Arabic puts the emphasis after the
        # noun: «الفريق نفسه»
        r"(?<![ء-ي])نفس\s+ال[ء-ي]",
        "نفس + معرفة is a calque of 'the same X'. Write «الفريق نفسه».",
    ),
    (
        "sawaa-aw",
        r"سواء[^.،]{0,60}\sأو\s+لا(?![ء-ي])",
        "«سواء … أو لا» — سواء takes أم: «سواء كنت على مكتبك أم لا».",
    ),
    (
        "doubling",
        # «ضابطاً ضابطاً»، «مزيةً مزية» — the same word twice, give or take a
        # case ending. Correct Arabic as a تمييز after a verb («قرأته كلمةً
        # كلمة»), and a stutter on a heading, which is where it lands when it
        # is carrying an English «X by X».
        r"(?<![ء-ي])([ء-ي]{3,}?)[ً-ْ]*\s+\1[ً-ْةا]{0,2}(?![ء-ي])",
        "A doubled word carrying English's «X by X». After a verb it is a "
        "real تمييز — «قرأه كلمةً كلمة» — so check which one this is. On a "
        "heading it stutters: «:group بالتفصيل», not «:group مزيةً مزية».",
    ),
    (
        "trailing-anta",
        # the value is scanned without its quotes, so the end of it counts
        r"[ء-ي]\s+(أنت|أنتم)\s*(?:[.،!؟'\"]|$)",
        "A trailing أنت/أنتم is usually English's emphatic 'your own'. Keep it "
        "only where the contrast is the point.",
    ),
    (
        "bidi-risk",
        r"[ء-ي][^'\"]{0,12}(?<![⁦⁧⁨])#\d",
        "A #number inside Arabic reorders on screen. Wrap it in \\u2066…\\u2069.",
    ),
    (
        "colloquial",
        # One dialect word in فصحى copy. «بس» for «فقط» was the one that
        # shipped; the rest are its family. «زي» alone is also a word for
        # dress, so read the hit.
        r"(?<![ء-ي])(بس|عشان|علشان|زي|شو|هيك|هاد|هادي|مش|ليش|كمان|برضو|برضه|هلق|بدي|بدك|أبغى|ابغى|تبي|تبغى|ايش|إيش|وش)(?![ء-ي])",
        "A dialect word in formal copy. Replace it, then grep the file for "
        "its siblings — one is never alone.",
    ),
    (
        "shay-shay-akhar",
        r"شيء[^.،]{0,40}شيء آخر",
        "«X شيء و Y شيء آخر» is English's 'not the same as'. State the "
        "actual rule instead of the contrast.",
    ),
]

STRING_LITERAL = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"")
ARABIC = re.compile(r"[ء-ي]")


@dataclass
class Hit:
    marker: str
    path: str
    line: int
    console: bool
    text: str
    note: str


# Two places a dash is a convention rather than English rhythm, and both are
# conventions in Arabic too: a glossary entry (**Term** — definition) and an
# annex or section title (## Annex A — Measures). Legal documents are full of
# the first and it is how the English reads as well.
CONVENTION = re.compile(r"^\s*(#{1,6}\s|\*\*[^*]+\*\*[^—]{0,40}—)")


def looks_like_console(line: str, value: str) -> bool:
    return bool(
        has_console_key(line)
        or CONSOLE_SHAPE.search(value)
        or CONVENTION.search(value)
    )


# Markdown and plain text hold the copy directly rather than inside a quoted
# literal, so the line itself is the value. Scanning them with the literal
# regex finds nothing and reports clean, which is worse than not scanning.
PROSE_SUFFIXES = {".md", ".mdx", ".txt"}


def values_in(path: Path, line: str) -> list[str]:
    if path.suffix in PROSE_SUFFIXES:
        return [line]

    values = [m.group(1) or m.group(2) or "" for m in STRING_LITERAL.finditer(line)]

    # YAML holds most copy unquoted: `title: نص`.
    if not values and path.suffix in {".yml", ".yaml"} and ":" in line:
        values = [line.split(":", 1)[1].strip()]

    return values


def scan_file(path: Path) -> list[Hit]:
    hits: list[Hit] = []
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except (UnicodeDecodeError, OSError):
        return hits

    for number, line in enumerate(lines, 1):
        for value in values_in(path, line):
            if not ARABIC.search(value):
                continue
            console = path.suffix not in PROSE_SUFFIXES and looks_like_console(line, value)
            for name, pattern, note in MARKERS:
                if re.search(pattern, value):
                    hits.append(
                        Hit(
                            marker=name,
                            path=str(path),
                            line=number,
                            console=console,
                            text=value if len(value) <= 160 else value[:157] + "…",
                            note=note,
                        )
                    )
    return hits


def walk(root: Path) -> list[Hit]:
    if root.is_file():
        return scan_file(root)
    hits: list[Hit] = []
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix in {
            ".php", ".json", ".yml", ".yaml", ".ts", ".js", ".vue", *PROSE_SUFFIXES,
        }:
            hits.extend(scan_file(path))
    return hits


def report(hits: list[Hit], show_console: bool) -> int:
    prose = [h for h in hits if not h.console]
    console = [h for h in hits if h.console]

    by_marker: dict[str, list[Hit]] = {}
    for hit in prose:
        by_marker.setdefault(hit.marker, []).append(hit)

    if not prose:
        print("No prose markers found.")
    for name, _, note in MARKERS:
        group = by_marker.get(name)
        if not group:
            continue
        print(f"\n=== {name}  ({len(group)})")
        print(f"    {note}")
        for hit in group:
            print(f"  {hit.path}:{hit.line}")
            print(f"    {hit.text}")

    if console:
        if show_console:
            print(f"\n=== console strings  ({len(console)})")
            print("    These imitate a product screen. Their separators are")
            print("    usually correct as they are — check before changing.")
            for hit in console:
                print(f"  {hit.path}:{hit.line}  [{hit.marker}]")
                print(f"    {hit.text}")
        else:
            print(
                f"\n{len(console)} hit(s) in strings that look like console or demo "
                "text, hidden. Pass --all to see them."
            )

    print(f"\nprose: {len(prose)}   console: {len(console)}")
    return 1 if prose else 0


def main() -> int:
    global CONSOLE_KEY_WORD

    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("root", type=Path, help="a locale directory or a single file")
    parser.add_argument("--all", action="store_true", help="include console strings")
    parser.add_argument("--json", action="store_true", help="machine-readable output")
    parser.add_argument(
        "--console-words",
        metavar="WORDS",
        help="extra key words, separated by |, whose values imitate a product screen",
    )
    args = parser.parse_args()

    if args.console_words:
        extra = [w.strip() for w in args.console_words.split("|") if w.strip()]
        CONSOLE_KEY_WORD = console_word_pattern(CONSOLE_WORDS + extra)

    if not args.root.exists():
        print(f"not found: {args.root}", file=sys.stderr)
        return 2

    hits = walk(args.root)

    if args.json:
        print(json.dumps([asdict(h) for h in hits], ensure_ascii=False, indent=1))
        return 0

    return report(hits, args.all)


if __name__ == "__main__":
    raise SystemExit(main())
