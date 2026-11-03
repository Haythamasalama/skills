# Tells and rewrites

The full catalogue behind the "tells" section of SKILL.md, in the order to fix them. Each row is a
shape seen in shipped copy, with a rewrite. The rewrite is one good answer, not the only one: the
point is the shape.

## 1. Copy that describes the picture

Fix this first; it is the cheapest win.

| Seen | Why it fails | Fix |
|---|---|---|
| «ثلاثة مشاريع، وثلاث قوائم أعضاء» under a drawing of three project rows | restates what the reader sees | delete it, in both languages, with its key |
| a section header right under the page title, saying the same thing | the reader reads it twice | keep one |
| the same claim in the hero, a card and the FAQ | repetition reads as filler | keep it where a reader looks for it |
| «عرض 1–3 من 3» inside a drawn table | part of the picture | keep |

## 2. Shapes of machine-written Arabic

| Shape | Example | Rewrite |
|---|---|---|
| Aphorism title, «لا X، بل Y», a reversal | «الاختصار يظهر في السجل، لا يختفي فيه» | «كل استعلام في الجلسة يظهر في السجل» |
| «X شيء و Y شيء آخر» | «الموافقة شيء والتنفيذ شيء آخر» | «الموافقة لا تعني التنفيذ» |
| No verb, naming an idea | «قاعدة البيانات تُسنَد، ولا تُفترض» | «أنت من يحدد أي مشروع يستخدم أي قاعدة بيانات» |
| Vowelled passive on every line | «يُستنتجان من التحليل لا من الكلمات» | «نعرفهما من التحليل لا من الكلمات» |
| Product name as the subject of every line | «ويطبّقها [المنتج] على كل طلب» (the fifth time) | «وتُطبَّق على كل طلب تلقائياً» |
| Metaphor carried over whole | «باب يدخل منه أحد، لا باب يُترك مفتوحاً» | drop it, or one plain clause |
| One dialect word in formal copy | «استعلام واحد **بس**» | «فقط», then grep the family |
| Heading that names an abstraction | «ما الذي يحدث بلا حوكمة.» | «ما يحدث حين يكون الوصول يدوياً» |
| A scene-setting opening, stacked synonyms | «في ظل التطور المتسارع الذي يشهده العالم...» | start with the point |
| Rhetorical split title translated word by word | "Nobody chases the numbers. The numbers arrive." → «لا أحد يطارد الأرقام. الأرقام تصل بنفسها.» | negation + affirmation to the reader: «لا تلاحق التقارير. التقارير تصلك في موعدها.» |

**Balance the subject.** Naming the product as the doer once or twice a page is right: verb-first
with the product as agent («يتخطى Ledgerly الإجازات الرسمية») is ordinary Arabic. The tell is the
name as the subject of sentence after sentence, or the vowelled passive on every line. Mix the
reader as subject, the product as subject, and a plain passive.

**The first-pass trap.** A fluent rewrite often lands in another shape from this table. A
heading rewritten to «التجاوز يظهر في السجل، لا يختفي فيه» is still the «لا X، بل Y» reversal.
Scan what you wrote.

### Heading test

A heading must say what the section is about to a reader who skipped the body.

- Fails: «ليس كل سؤال يستحق طلباً جديداً» (a riddle).
- Passes: «للاستعلام السريع: محرر للقراءة فقط، بلا طلب ولا انتظار».
- Fails: «الفرق قبل الأداة وبعدها» when the next line also starts with «الفرق». Drop the repeat:
  «قبل الأداة وبعدها».

## 3. English joints

### The em dash

The biggest tell. Ask what it did, then use the Arabic joint for that job.

| The dash was | Use | Before → after |
|---|---|---|
| adding a clause | و | «الخوادم التي تصل إليها — والأوامر…» → «الخوادم التي تصل إليها، والأوامر…» |
| introducing a list or a gloss | : | «عبر دورة موافقة — ضوابط، وتسجيل…» → «عبر دورة موافقة: ضوابط، وتسجيل…» |
| joining two sentences | . | split them |
| giving a reason | فـ | «موافقتين — فالقائمة تمشي» → «موافقتين، فالطلبات تمضي» |

`;` does no work in Arabic prose. Use . or و.

Two places a dash stays, in Arabic as in English: a glossary entry (**Term** — definition) and an
annex or section title (Annex A — Measures). Console strings keep theirs too.

### Calques

| Calque | Before | After |
|---|---|---|
| «يتم + مصدر» | «يتم تسجيله» | «يُسجَّل» |
| «من قِبَل» | «يُراجَع من قِبَل المسؤول» | «يراجعه المسؤول» |
| «بشكل …» (an -ly adverb) | «يعمل بشكل تلقائي» | «يعمل تلقائياً» |
| «الخاص بـ» | «الصلاحيات الخاصة بك» | «صلاحياتك» (or a promise: «صلاحياتك على قدر دورك») |
| «قم بـ» | «قم بتحديد ما…» | «حدّد ما…» |
| «سوف» for a present | «سوف يصلك التقرير كل أحد» | «يصلك التقرير كل أحد» |
| «العديد من» | «العديد من التقارير» | a plural: «تقارير كثيرة», or the real number |
| «نفس + معرفة» | «نفس الفريق ونفس الخوادم» | «الفريق نفسه والخوادم نفسها» |
| a doubled word for "X by X" on a heading | «:group مزيةً مزية» | «:group بالتفصيل» |
| «يرى فقط ما…» | «يرى فقط ما هو مسموح له» | أسلوب القصر: «لا يرى إلا المصرّح له به» |
| «حيّ» for "live" | «نظام محاسبي حيّ» | «نظامك المحاسبي الفعلي» |
| «خلف» for "behind" | «يمرّ خلف عقد واحد» | «يمرّ من مكان واحد» |

A doubled word after a verb can be a real تمييز («قرأته كلمةً كلمة»). Check which one it is.

### Emphasis and comparison

- **Trailing «أنت / أنتم»** is English's emphatic "your own". The suffix already said it.
  «جرّبه على خوادمك أنت» → «جرّبه على خوادمك». If the contrast was the meaning, write the contrast:
  «جرّبه على خوادمك، لا على عرض جاهز». Keep a trailing أنت only where the contrast is the point.
- **A comparative with no second term** («يُسجَّل بوضوح أكبر لا أقل»): bigger than what? Name the
  comparison or drop it: «كل أمر بلا موافقة يظهر في السجل».
- **The wink.** A joke in English is an accusation in Arabic. "The system that eats it" → «النظام
  الذي يستوردها». Turn it into an invitation or plain words.

### Idioms and fragments

Take the job of the line, not its words.

| English | Literal trap | Rewrite |
|---|---|---|
| "The right numbers to the right desk." | «الأرقام الصحيحة إلى المكتب الصحيح» | «لكل مسؤول الأرقام التي تخصّه.» |
| "Whatever they open it in." (a fragment heading) | no Arabic shape | the real objection: «لا أحد يضطر إلى تحويل الملف.» |
| "Talk to sales" | «التحدث إلى المبيعات» (reads as a page title) | a verb: «تواصل مع المبيعات» |

## 4. Grammar and usage slips

| Slip | Before | After |
|---|---|---|
| «سواء» with «أو» | «سواء كنت على مكتبك أو لا» | «سواء كنت على مكتبك أم لا» |
| «تجيب على» with a question | «تجيب على المراجعة الأمنية» | «تجيب عن أسئلة المراجعة الأمنية» |
| a pronoun before its noun | «اضبطها مرة واحدة» (the rules come later) | «اضبط القواعد مرة واحدة» |
| the wrong subject | «الدور يحدّد الخوادم التي يصل إليها» (a role does not reach) | «… الخوادم التي تصل إليها» |
| an imperative with no job | «جرّب كل واحدة منها.» | the benefit: «… فلا تعود تراجعها مع كل طلب.» |
| a closing line that soothes | «ثم توقّف عن المتابعة.» | what happens: «ويُرفض ما زاد.» (only if the code refuses) |
| a full stop on a heading or button | «ابدأ اليوم.» | «ابدأ اليوم». Arabic headings take no full stop; unify the file |
| a question shape ending in a full stop | «ما الذي يحدث بلا حوكمة.» | a question mark, or rewrite as a statement |
| a colloquial verb in formal copy | «القائمة تمشي» | «الطلبات تمضي» |
| a literary word that means something else | «ارتقِ حين يرتقي فريقك» (rise in rank or morals) | «ارفع الباقة حين يكبر فريقك» |
| a pronoun with no clear referent | «جرّبه» after a heading with no singular noun | name the thing: «شغّل أول أمر على خوادمك» |

## 5. Meaning: read the Arabic beside the English

No scanner finds these. The side-by-side dump does.

| Defect | Example | Fix |
|---|---|---|
| Inverted modality | "a reviewer should not **have to** ask" → «ولا ينبغي للمراجع أن يسأل» (forbids asking, on a page written for the reviewer) | «فلا يبقى للمراجع ما يسأل عنه» |
| A word with two senses on this page | «كيف يحفظ X دفترك» on a security page (store or protect?) | «يحمي» |
| A word that means something else in context | «عنوان» on a page about hosts | say «عنوان الخادم» or the thing itself |
| The codebase's own nouns | «يمرّ خلف عقد واحد» ("contract" is an interface name in the repo) | «يمرّ من مكان واحد في الكود», or drop the claim if unverified |
| A product word defined elsewhere | «الدورة» on a page people land on cold | say what it is |
| Two blocks, one sentence, clauses swapped | a pillar and the section lead under it | make one the promise and the other the detail |
| A number that contradicts another page or the code | "enforced twice over" when the code enforces it in three places | fix both languages; grep for the number, not the sentence |
| A version that drifted | "PHP 8.2, Laravel 11" when the lockfile requires ^8.3 and ^12 | read the lockfile; claim the floor the repo guarantees |

## 6. Bidi

- A `#41`, a bare identifier, a host or a version next to punctuation reorders on screen.
- Wrap the run in U+2066 … U+2069 (LRI … PDI) in a string, or `<bdi dir="ltr">` in markup. Add
  isolates only where the rendered page shows a flip: they are invisible in the source and easy to
  duplicate.
- Check the rendered page first. A Latin word right before an Arabic comma («Slack،») usually
  renders fine. Look before you wrap.
- A horizontal arrow typed as a character cannot flip; use an icon that
  flips in RTL (chevrons, arrows, send, external link). Clocks, checkmarks and logos never flip.

## What the scanner covers

`scripts/scan_markers.py` finds: the em dash, «يتم + مصدر», «من قِبَل», «بشكل», «الخاص بـ»,
«قم بـ», «سوف», «نفس + معرفة», «سواء … أو لا», doubled words, a trailing أنت/أنتم, a `#number`
inside Arabic, dialect words, and «شيء … شيء آخر». Everything in sections 1, 2 (most rows), 4
(most rows) and 5 needs a reader.
