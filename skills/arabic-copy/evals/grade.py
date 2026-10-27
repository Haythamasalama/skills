#!/usr/bin/env python3
"""Check the mechanically verifiable assertions for one eval run.

    python3 grade.py <run-dir> --eval weak-sentence

`run-dir` is the directory holding `outputs/`. Emits the checks it can decide
on stdout as JSON; the assertions that need judgement are left for a human or
a grader agent to fill in.

Deliberately does not shell out to php — the point is to work in whatever
environment the run happened in.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

STRING = re.compile(r"'((?:[^'\\]|\\.)*)'", re.S)
ARABIC = re.compile(r"[ء-ي]")

# A verb immediately before or after the product name. Arabic is verb-first, so
# «يرسل Ledgerly التقرير» is the ordinary order and requiring subject-then-verb
# would be testing for an English sentence.
SUBJECT = re.compile(r"[يت][ء-ي]{2,}\s+Ledgerly|Ledgerly\s+[يت][ء-ي]{2,}")


def php_strings(text: str) -> list[str]:
    """Every single-quoted literal in a PHP array, in order."""
    return [m.group(1) for m in STRING.finditer(text)]


def arabic_values(text: str) -> list[str]:
    """Quoted literals that contain Arabic — i.e. the copy, not the keys."""
    return [s for s in php_strings(text) if ARABIC.search(s)]


def words(value: str) -> int:
    return len([w for w in re.split(r"\s+", value.strip()) if w])


def check(text: str, passed: bool, evidence: str) -> dict:
    return {"text": text, "passed": passed, "evidence": evidence}


def grade_weak_sentence(out: Path) -> list[dict]:
    ar = (out / "ar.php").read_text(encoding="utf-8") if (out / "ar.php").exists() else ""
    response = (out / "response.md").read_text(encoding="utf-8") if (out / "response.md").exists() else ""
    values = arabic_values(ar)
    prose = [v for v in values if "—" in v]

    # the three console strings must survive with their separators
    console_intact = sum(
        1
        for marker in ("ابحث في الأوامر", "نفّذ أمراً على", "رُفض عند التفويض")
        if any(marker in v and "—" in v for v in values)
    )

    results = [
        check(
            "Rewrites the flagged CTA «جرّبه على خوادمك أنت» without a trailing أنت",
            "جرّبه على خوادمك أنت" not in ar,
            "original CTA string is gone" if "جرّبه على خوادمك أنت" not in ar else "still present",
        ),
        check(
            "Generalises: also fixes the SECOND trailing أنت in «لا أحد ينتظرك أنت»",
            "لا أحد ينتظرك أنت" not in ar,
            "second أنت handled" if "لا أحد ينتظرك أنت" not in ar else "left as-is",
        ),
        check(
            "Replaces all three prose em dashes with Arabic joints",
            len(prose) <= console_intact,
            f"{len(prose)} value(s) still carry an em dash; {console_intact} of those are console strings",
        ),
        check("Fixes يتم + مصدر in points.1.body", "يتم تسجيله" not in ar, "يتم تسجيله" not in ar and "removed" or "still present"),
        check("Fixes قم بـ in points.3.body", "قم بتحديد" not in ar, "قم بتحديد" not in ar and "removed" or "still present"),
        check("Fixes الخاص بـ in points.2.title", "الخاصة بك" not in ar and "الخاص بك" not in ar, "removed" if "الخاص بك" not in ar and "الخاصة بك" not in ar else "still present"),
        check(
            "Fixes the comparative with no second term",
            "بوضوح أكبر لا أقل" not in ar,
            "removed" if "بوضوح أكبر لا أقل" not in ar else "still present",
        ),
        check(
            "Replaces «ارتقِ حين يرتقي فريقك» with everyday register",
            "ارتقِ حين يرتقي" not in ar,
            "removed" if "ارتقِ حين يرتقي" not in ar else "still present",
        ),
        check(
            "Leaves all three console strings untouched",
            console_intact == 3,
            f"{console_intact}/3 console strings kept their separator",
        ),
        check(
            "Hands back a before/after table with a reason per row",
            response.count("|") >= 12,
            f"{response.count('|')} pipe characters in response.md",
        ),
        check(
            "The written ar.php is valid PHP and keeps every original key",
            ar.strip().startswith("<?php") and ar.count("=>") >= 24,
            f"starts with <?php: {ar.strip().startswith('<?php')}; {ar.count('=>')} arrows (fixture has 24)",
        ),
    ]
    return results


def grade_write_arabic(out: Path) -> list[dict]:
    ar = (out / "ar.php").read_text(encoding="utf-8") if (out / "ar.php").exists() else ""
    values = arabic_values(ar)
    long_bodies = [v for v in values if words(v) > 25]
    social = re.search(r"\d{3,}\s*(شركة|عميل|فريق|منشأة)|[٤4]\.[89]", ar)

    return [
        check(
            "ar.php is valid PHP with the same key structure as en.php",
            ar.strip().startswith("<?php") and ar.count("=>") >= 14,
            f"starts with <?php: {ar.strip().startswith('<?php')}; {ar.count('=>')} arrows (en.php has 16)",
        ),
        check(
            "No em dash in any prose value",
            not any("—" in v for v in values),
            f"{sum(1 for v in values if '—' in v)} value(s) contain an em dash",
        ),
        check(
            "Ledgerly, PDF, XLSX and CSV stay in Latin script",
            all(t in ar for t in ("Ledgerly", "PDF", "XLSX", "CSV")),
            "all four present" if all(t in ar for t in ("Ledgerly", "PDF", "XLSX", "CSV")) else "one or more transliterated",
        ),
        check(
            "Invents no social proof absent from en.php",
            social is None,
            "none found" if social is None else f"found: {social.group(0)}",
        ),
        check(
            "Body values stay at or under roughly 25 words",
            not long_bodies,
            f"{len(long_bodies)} value(s) over 25 words" + (f": {long_bodies[0][:60]}…" if long_bodies else ""),
        ),
        check(
            "Ledgerly appears as a grammatical subject at least once",
            bool(SUBJECT.search(ar)),
            SUBJECT.search(ar).group(0) if SUBJECT.search(ar) else "never an agent",
        ),
    ]


def grade_review_page(out: Path) -> list[dict]:
    def read(name: str) -> str:
        p = out / name
        return p.read_text(encoding="utf-8") if p.exists() else ""

    ar, en, vue, response = read("ar.php"), read("en.php"), read("Panel.vue"), read("response.md")
    blob = ar + en + vue + response

    return [
        check(
            "Catches the inverted modality in ar.php header.lead",
            "ولا ينبغي للمراجع أن يسأل" not in ar,
            "rewritten" if "ولا ينبغي للمراجع أن يسأل" not in ar else "left inverted",
        ),
        check(
            "Removes عقد / contract as codebase vocabulary, on both sides",
            "خلف عقد واحد" not in ar and "behind one contract" not in en,
            f"ar clean: {'خلف عقد واحد' not in ar}; en clean: {'behind one contract' not in en}",
        ),
        check(
            "Corrects append-only from two layers to three",
            "بطبقتين" not in ar and "twice over" not in en,
            f"ar clean: {'بطبقتين' not in ar}; en clean: {'twice over' not in en}",
        ),
        check(
            "Flags or corrects the PHP and Laravel versions against NOTES.md",
            "8.2" not in blob or "8.3" in blob or "أحدث إصدار" in blob or "latest" in blob.lower(),
            "version claim addressed" if ("8.3" in blob or "أحدث" in blob or "latest" in blob.lower()) else "8.2/11 left standing",
        ),
        check(
            "Handles the English placeholder, aria-label and title in Panel.vue",
            "Search the audit log" not in vue and "Back to top" not in vue,
            f"placeholder handled: {'Search the audit log' not in vue}; title handled: {'Back to top' not in vue}",
        ),
        check(
            "Flags the hardcoded Latin initial in Panel.vue",
            ">A<" not in vue.replace(" ", "").replace("\n", "") or "initial" in response.lower() or "حرف" in response,
            "initial addressed or mentioned" if (">A<" not in vue.replace(" ", "").replace("\n", "") or "حرف" in response) else "left hardcoded and unmentioned",
        ),
    ]


GRADERS = {
    "weak-sentence": grade_weak_sentence,
    "write-arabic": grade_write_arabic,
    "review-page": grade_review_page,
}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("--eval", required=True, choices=sorted(GRADERS))
    args = parser.parse_args()

    outputs = args.run_dir / "outputs"
    if not outputs.is_dir():
        print(json.dumps({"error": f"no outputs/ under {args.run_dir}"}))
        return 2

    results = GRADERS[args.eval](outputs)
    passed = sum(1 for r in results if r["passed"])
    print(
        json.dumps(
            {
                "eval_name": args.eval,
                "run": args.run_dir.name,
                "passed": passed,
                "total": len(results),
                # the aggregator reads this block; the flat fields above are for
                # reading the file by eye
                "summary": {
                    "passed": passed,
                    "failed": len(results) - passed,
                    "total": len(results),
                    "pass_rate": round(passed / len(results), 4) if results else 0.0,
                },
                "expectations": results,
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
