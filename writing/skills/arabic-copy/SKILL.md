---
name: arabic-copy
description: Use when Arabic user-facing or marketing copy is written, translated, reviewed or audited for a Gulf or Saudi audience (landing, feature, pricing and security pages, onboarding, email, UI strings), and when a bilingual ar/en site must read and render right in both languages. Triggers include the Arabic "reads translated" or "sounds weak", «ترجمة حرفية», «الصياغة ضعيفة», «خلّها تسويقية», «راجع النص العربي», making copy more marketing-like for the Saudi or Gulf market, sweeping a site for leftover English, checking RTL, checking that copy claims match the code, or reviewing a diff that touches the Arabic locale files. Use it even for a one-line wording fix, because one weak sentence is almost always a pattern that runs through the whole file.
---

# Arabic copy for a Gulf audience

For writing, reviewing and auditing Arabic copy on a product or marketing site, and for checking
that a bilingual site reads and renders right in Arabic and English. Every rule here was learned
on a real site. If a rule is not here, it is not a rule.

## TL;DR

- Arabic copy fails one way: it is **correct Arabic shaped like English**. Don't hunt for a better
  word. See the shape, ask what the sentence is doing, and rebuild it the way Arabic does that job.
- Register: simple modern standard Arabic. Not classical, not dialect.
- Fix in this order: captions that describe the picture → machine-written shapes → English joints
  (the em dash first) → grammar slips → meaning (read Arabic beside English) → bidi.
- One correction means fixing its whole family across the file, not one line.
- A public page claims only what the code backs. Check every count, absolute and mechanism.
- Console and demo strings imitate a product screen. Leave their separators and handles alone.
- Verify on the rendered page in both languages, light and dark, mobile width. Never trust raw
  HTML or a page that did not mount.
- Hand back a before/after table with a one-clause reason per row, the findings that need a
  decision, and what you checked and found clean.

## Scripts

```bash
python3 scripts/scan_markers.py lang/ar      # translation tells + dialect; exits 1 on prose hits
python3 scripts/scan_markers.py lang/ar --all  # also show hits in console/demo strings
# scripts/sweep_page.js: paste into a browser tool's JS evaluator on a rendered page
```

`evals/` holds three test prompts with fixtures and a grader (`grade.py`) for checking this skill
after you change it.

## Register

- **Simple modern standard Arabic (فصحى بسيطة).** Classical reads as a translation of something
  older. Dialect reads unprofessional in front of a compliance reviewer. Test: would a Saudi
  professional in the audience write it in a work message to their manager? More formal than that
  is too formal.
- **The everyday word over the literary one:** «ارفع الباقة» not «ارتقِ», «يوافق» not «يبتّ»,
  «تغيّر» not «تطال». Words an audience uses as they say them stay that way (for engineers:
  «البرودكشن», SQL keywords, engine names).
- **Fixed terms per product.** Keep a glossary and never vary it: «حدّ الاستخدام» (never «كوتة»),
  «المزايا» (never «المميزات»). See [references/glossary.md](references/glossary.md).
- **No ease adverbs** («بسهولة»، «بذكاء») on a page whose promise is control or precision. Say
  instead what is refused, counted or recorded.
- **Address:** singular («جرّب، بياناتك») for a person trying the product; formal plural
  («لديكم، بياناتكم») where they write for a company (contact, enterprise). One per page, never both
  inside one. Sweep every string of a group before calling it done. «الخاص بكم» is not the formal
  option; the suffix carries it.
- **Length:** 15 to 25 words a body, two bullets a block. A direct answer to a direct question
  (a security FAQ) runs as long as the answer.

## How strong Gulf SaaS sites write

Look at the Arabic versions of Wafeq, Jisr, Salla and Foodics. Each section is an eyebrow (one
noun) → a heading that states the **outcome** → a one-sentence body. Take from them:

- verb-first lines addressed to the reader; verb-first is ordinary Arabic order
  («يرسل Ledgerly التقرير»);
- «واحد / من مكان واحد»;
- triads joined with و, which is Arabic's replacement for the English dash plus a list;
- a CTA that is a verb plus a nudge, with a reassurance line under it (only with real terms);
- feature names as two-to-four-word noun phrases.

Don't take social proof the product does not have («أكثر من ١٨٬٠٠٠ شركة», ratings, logos). Say
that out loud to the user. The honest substitute is the product's own numbers.

For anything that carries weight (hero, heading, CTA), draft three *approaches*: the outcome, the
objection answered, the concrete moment. Pick one and give the reason in a clause.

## The tells, in the order to fix them

Full catalogue with rewrites: [references/tells-and-rewrites.md](references/tells-and-rewrites.md).

1. **Copy that describes the picture.** A line under a drawn screen, card or list that restates
   what is visible is a caption, not copy. Delete it in both languages with its key, or the key
   parity test fails. A count line inside a drawn table («عرض 1–3 من 3») is part of the picture
   and stays. A claim made three times on one page is the same defect: keep the one where a
   reader looks for it.
2. **Shapes of machine-written Arabic.** The aphorism title («لا X، بل Y», a reversal);
   «X شيء و Y شيء آخر»; a heading with no verb that names an idea; the vowelled passive on every
   line; the product name as the subject of every sentence; a metaphor carried over whole; one
   dialect word in formal copy. **Heading test:** it must say what the section is about to a
   reader who skipped the body.
3. **English joints.** The em dash is the biggest tell. Ask what it did: adding → **و**;
   introducing a list or gloss → **:**; two sentences pretending to be one → **.**; giving a
   reason → **فـ**. `;` does no work in Arabic prose. Calques: «يتم + مصدر», «من قِبَل», «بشكل…»,
   «الخاص بـ», «قم بـ», «سوف» for a present, «العديد من», «نفس + معرفة», a trailing «أنت»,
   a comparative with no second term, an English joke (in Arabic it reads as an accusation).
4. **Grammar and usage slips.** «سواء … أم لا» not «أو لا»; «تجيب عن سؤال» not «على»;
   a pronoun before its noun is named; the wrong grammatical subject («الدور يصل» → «أنت تصل»);
   an imperative that does no job; a full stop on a heading or a button.
5. **Meaning: read the Arabic beside the English.** No scanner finds these. Inverted modality
   ("should not have to ask" → «لا ينبغي له أن يسأل»); a word that means something else in context;
   the codebase's own nouns on a marketing page («العقد»، «المنفّذ»: say the thing); a product word
   defined elsewhere on a page people land on cold; two blocks saying the same sentence with the
   clauses swapped; a number that contradicts another page (grep for the number, not the sentence).
6. **Bidi.** `#41` or a bare identifier next to punctuation reorders on screen. Wrap the run in
   U+2066 … U+2069 (LRI … PDI). Check the rendered page; don't isolate everything in advance,
   because the marks are invisible in source and easy to duplicate.

## Where the rules do not apply

Console and demo strings (a log line, a chip, a placeholder, a breadcrumb) should read like the
product's screen, dash and lowercase handle included. Fix only a real meaning error there, and say
so. Proper nouns, product and engine names, file formats, SQL, table and column names and handles
stay Latin. Legal pages follow their template. Demo content: company names in Latin; project, role,
team and label names translated; people's names local; avatar initials derived from the translated
name, never hardcoded; no famous sample-data names; never the vendor's own name in the customer list.

## Honesty

A public page may only claim what the code backs. Check every falsifiable sentence (a count, an
absolute, a mechanism, a version) against a migration, an enum, a hook, a trigger or the lockfile
before it ships. Real finds: two credentials described after a migration removed one; a
notification channel the enum lacks; an enforcement count lower than the layers that exist; a
"four cases" lead over four cards and a "six rules" lead over the same four. The page sometimes
understates; fix that too. Most real findings are bugs in the English as well: change both and
say so.

## Working the review

- **Read the page in the order the reader does, not the file.** Strings for one page are often
  spread across several files (names, summaries, points). Dump them in reading order (headings,
  then summaries, then bodies) and only then judge.
- **For any other file, dump Arabic beside English by key** (`key / EN / AR` for strings over 25
  characters). Where they disagree is where the valuable finds are. Snippets:
  [references/review-and-verify.md](references/review-and-verify.md).
- **Scan, rewrite, scan again** on what you wrote. Fluent writers reach for English joints too. A
  false positive means fixing the scanner's pattern, not the copy; a gate that cries wolf is a
  gate nobody runs.
- **With the user:** they are the native speaker; you do the legwork. They paste rendered text
  and say «احذف الوصف الي زي هيك» or «هذا نص غير مفهوم». Fix the pattern everywhere, then add a
  line on what you left and why. One correction means fixing its family: «بس» → grep for dialect;
  "stop repeating the product name" → every sentence where the name is the subject. Names and taste
  may reverse twice; don't argue past the second round. Answer in their language.
- **State assumptions and move on** instead of blocking on a question (a CTA is a line, not a
  button; the audience is X). List them at the end so they can be corrected.
- **Which build are they looking at?** A local dev host often serves the main checkout, so a
  worktree's changes are invisible there until merged. If they keep flagging lines you already
  rewrote, that is why: say it once and ship the branch.

## What to hand back

1. A before/after table: key, before, after, a one-clause reason.
2. Findings that are not translation problems, separately, because they need a decision (a count
   that contradicts the code, a claim you could not verify, a missing reassurance line).
3. What you checked and found clean, and which gates you could not run.

Examples of all three: [references/examples.md](references/examples.md).

## Verify before saying done

Rendered text only. Never the raw HTML of a server-rendered SPA: its props payload hands you dozens
of "remaining English" strings nobody sees. Three things produced false clean reports:

- `innerText` cannot see `placeholder`, `aria-label`, `title`, `alt`;
- one- and two-letter strings (hardcoded Latin initials) slip past every pattern;
- a page that never mounted sweeps clean. Confirm the root has children and
  `body.innerText.length` is plausible.

RTL: logical properties only; directional glyphs flip; no horizontal overflow; normal letter
spacing and no uppercase transform under `[lang='ar']`. Check light and dark, mobile width, both
languages. Gates in order: key parity → type check and lint → build → rendered sweep of every
translated page → full test suite → static analysis. Report what actually ran. Details and the
"it does not appear" checklist: [references/review-and-verify.md](references/review-and-verify.md).

## References

- [references/tells-and-rewrites.md](references/tells-and-rewrites.md): every tell with a rewrite.
- [references/glossary.md](references/glossary.md): fixed terms, everyday words, what stays Latin,
  localisation.
- [references/examples.md](references/examples.md): before/after tables from real reviews.
- [references/review-and-verify.md](references/review-and-verify.md): dumps, scanner, rendered
  sweep, RTL checks, gates, hand-back template.
