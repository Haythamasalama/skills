# Before and after

Worked examples from reviews of three test pages (the fixtures in `evals/`): one weak sentence that
turned out to be a pattern, an English page written into Arabic, and a security page reviewed
against the code. Where a first rewrite fell into another tell, the table shows the better one.

## A. "This sentence is weak" → the whole family

The user flagged one CTA: «جرّبه على خوادمك أنت.» The trailing «أنت» is the visible symptom; the
emphasis was doing the job of a contrast. The same habit ran through the file, so the answer fixed
every member of the family and left the console strings alone.

| Key | Before | After | Reason |
|---|---|---|---|
| `hero.cta` | جرّبه على خوادمك أنت. | جرّبه على خوادمك، لا على عرض جاهز | the emphasis was a contrast; write the contrast, the suffix already owns |
| `hero.lead` | …دورة موافقة — ضوابط، و… | …دورة موافقة: ضوابط، و… | the dash introduced a list; that is the colon's job |
| `hero.title` | أوقف الوصول المباشر إلى الخوادم. | أوقف الوصول المباشر إلى الخوادم | Arabic headings take no full stop; the file mixed both |
| `sections.today.title` | ما الذي يحدث بلا حوكمة. | ما يحدث حين يكون الوصول يدوياً | named an abstraction instead of opening the section |
| `sections.how.title` | الفرق قبل الأداة وبعدها | قبل الأداة وبعدها | «الفرق» repeats in the line under it |
| `sections.how.lead` | نفس الفريق ونفس الخوادم | الفريق نفسه والخوادم نفسها | «نفس + معرفة» is a calque; the emphasis follows the noun |
| `sections.rules.title` | اضبطها مرة واحدة | اضبط القواعد مرة واحدة | the pronoun came before its noun |
| `sections.rules.lead` | …قبل أن يطلب أحد شيئاً. جرّب كل واحدة منها. | …قبل أن يطلب أحد شيئاً، فلا تعود تراجعها مع كل طلب | an imperative with no job; give the benefit |
| `points.0.title` | لا أحد ينتظرك أنت | لا أحد ينتظرك | the same trailing أنت |
| `points.0.body` | موافقتين — فالقائمة تمشي سواء كنت على مكتبك أو لا | موافقتين، فالطلبات تمضي سواء كنت على مكتبك أم لا | the dash gave a reason (فـ was already there); «سواء» takes «أم»; «تمشي» is colloquial |
| `points.1.title` | يُسجَّل بوضوح أكبر لا أقل | كل أمر بلا موافقة يظهر في السجل | comparative with no second term. A first rewrite, «التجاوز يظهر في السجل، لا يختفي فيه», was still the «لا X، بل Y» shape |
| `points.1.body` | يتم تسجيله | يُسجَّل | «يتم + مصدر» |
| `points.2.title` | الصلاحيات الخاصة بك | صلاحياتك على قدر دورك | «الخاص بـ»; the heading became a promise, not a sign |
| `points.2.body` | الخوادم التي يصل إليها — والأوامر… | الخوادم التي تصل إليها، والأوامر… | a role does not reach a server, you do; the dash added a clause → و |
| `points.3.title` | سقف لا يحتاج من يراقبه | حدّ يومي لكل شخص | sold ease on a page that sells control; glossary term, not «كوتة» |
| `points.3.body` | قم بتحديد … ثم توقّف عن المتابعة. | حدّد … ويُرفض ما زاد. | «قم بـ»; say what happens, not a vague comfort (needs the code to refuse) |
| `cta.title` | ابدأ اليوم. | ابدأ اليوم | a heading, not a sentence |
| `cta.lead` | ثم ارتقِ حين يرتقي فريقك | ثم ارفع الباقة حين يكبر فريقك | «ارتقى» is rising in rank; nobody writes it on a plan card |
| `console.*` | ابحث في الأوامر — deploy، restart، … | unchanged | a column separator imitating the product screen; `web-01`, `deploy` stay Latin |

Decisions handed back, not made:

- The lead says «أربع حالات» and another says «ست قواعد», and the file has four cards. One count
  is wrong. Left both and asked which.
- «ويُرفض ما زاد» claims the daily limit refuses. Asked for the code to confirm it, or to drop it.
- No English file sat next to this one, so meaning could not be checked side by side. Two finds
  (the comparative, the abstract heading) are defects in the English too.
- No social proof on the page. Advised against borrowing any; offered the product's own numbers.

## B. Writing Arabic from an English page

Brief: a scheduled accounting-report product («Ledgerly») for finance managers and business owners
in Saudi Arabia. Written as Arabic, not translated.

| Key | English | Arabic | Why |
|---|---|---|---|
| `hero.badge` | Scheduled reporting | التقارير المجدولة | one noun phrase |
| `hero.title_*` | Nobody chases the numbers. / The numbers arrive. | لا تلاحق التقارير. / التقارير تصلك في موعدها. | the rhetorical split dies word for word; negation + affirmation to the reader |
| `hero.lead` | …and Ledgerly sends it — to email, to Slack, to a folder… | …ويرسله Ledgerly في موعده: إلى البريد، أو إلى Slack، أو إلى مجلد يفتحه محاسبك أصلاً. | the dash opened a list → colon; a triad joined with و/أو; the product as agent, verb first |
| `hero.start` | Start free | ابدأ مجاناً | verb |
| `hero.contact` | Talk to sales | تواصل مع المبيعات | a verb, not «التحدث إلى المبيعات», which reads as a page title |
| `features.0.body` | Ledgerly skips weekends and holidays in your calendar… | يتخطى Ledgerly عطلة نهاية الأسبوع والإجازات الرسمية في تقويمك، فلا يصل تقرير في يوم لا يقرأه أحد. | the reason joined with فـ |
| `features.1.title` | The right numbers to the right desk. | لكل مسؤول الأرقام التي تخصّه. | an English idiom; «المكتب» reads literal. The heading carries the outcome |
| `features.1.body` | Each recipient sees only… | لا يرى المستلم إلا الفروع ومراكز التكلفة المصرّح له بها. | أسلوب القصر instead of «يرى فقط» |
| `features.2.title` | Whatever they open it in. | لا أحد يضطر إلى تحويل الملف. | a fragment that cannot move; take the real objection |
| `features.2.body` | …CSV for the system that eats it. | …وملف CSV للنظام الذي يستوردها. | the joke reads as sarcasm; «يستورد» is the accountant's own word |
| `cta.lead` | …see it land on Sunday morning. | …وشاهده يصل صباح الأحد. | Sunday is the first working day in Saudi Arabia, so it stays |

Kept Latin: Ledgerly, Slack, PDF, XLSX, CSV. Bodies 14 to 23 words. Scanner clean. Same keys as
the English file, counted.

Handed back as decisions:

- No reassurance line under «ابدأ مجاناً». Gulf SaaS sites put one there (trial length, no card);
  not added because the trial terms were unknown and a new key breaks parity. Asked for the terms.
- No social proof. Not invented; asked for real product numbers instead.

## C. Reviewing a page against the code

Inputs: `ar.php`, `en.php`, a Vue component, and notes on what the code does. The scanner found
nothing: every defect was one of meaning or honesty.

**Arabic fixes**

| Key | Before | After | Reason |
|---|---|---|---|
| `header.lead` | ولا ينبغي للمراجع أن يسأل عن أي منها | فلا يبقى للمراجع ما يسأل عنه | inverted modality: "should not have to ask" became a ban on asking |
| `header.lead` | نطلب منك ربط نظام محاسبي حيّ | … نظامك المحاسبي الفعلي | «حيّ» is a calque of "live" |
| `header.title` | كيف يحفظ Ledgerly دفترك. | كيف يحمي Ledgerly دفترك | «يحفظ» means store or protect; on a security page it must mean one thing. No full stop |
| `checks.intro.lead` | سبعة فحوص، بهذا الترتيب، في مكان واحد… | هذه الفحوص السبعة بترتيب تنفيذها، وأول واحد يفشل يوقف التصدير. | the pillar above said the same sentence with the clauses swapped |
| `checks.intro.title` | كيف يُنفَّذ التصدير. | كيف يجري التصدير | the English is intransitive, not passive; no full stop |
| `architecture.items.0.text` | يمرّ خلف عقد واحد | يمرّ من مكان واحد في الكود | «عقد» is an interface name from the repo. Fixed in English too ("behind one contract") |

**Not translation problems: wrong in both languages**

| Claim | Page said | Code says | Now |
|---|---|---|---|
| append-only layers | «بطبقتين» / "twice over" | three: no route edits or deletes, model events throw, database triggers refuse | «بثلاث طبقات» / "in three places" |
| PHP version | 8.2 or newer | the lockfile requires ^8.3 | 8.3 or newer |
| framework version | 11 | pinned at ^12.0 | 12 |

The first one understated the product: protected three times, claimed twice.

**The component**

- `placeholder`, `aria-label` and `title` were hardcoded English. Moved to new keys in both
  locale files. A text search and a screenshot never see these.
- `<span aria-hidden="true">A</span>` in a "back to top" button: a single Latin letter, too short
  for any pattern. Flagged as a leftover icon placeholder; «↑» needs no RTL flip.

**Checked and clean**: key parity after the new keys; no Arabic value identical to its English
twin; proper nouns Latin on both sides; no Latin run next to punctuation that needs isolates.
**Not run**: no PHP on the machine and no dev server, so no scripted diff and no rendered sweep.
Asked for the sweep on the page in both languages before merge.

## D. Corrections from the native speaker, and their families

| They said | The family to fix |
|---|---|
| «احذف الوصف الي زي هيك» (pointing at one caption) | every line on the site that restates the picture above it |
| «هذا نص غير مفهوم» | the shape behind it (aphorism, verbless heading, metaphor), in every heading |
| one «بس» in shipped copy | grep for every dialect word; one is never alone |
| "stop repeating the product name" | every sentence where the name is the grammatical subject |
| "this sounds translated" | run the scanner, then read Arabic beside English for the whole page |

## E. One-line rewrites worth remembering

| Before | After |
|---|---|
| الموافقة شيء والتنفيذ شيء آخر | الموافقة لا تعني التنفيذ |
| قاعدة البيانات تُسنَد، ولا تُفترض | أنت من يحدد أي مشروع يستخدم أي قاعدة بيانات |
| يُستنتجان من التحليل لا من الكلمات | نعرفهما من التحليل لا من الكلمات |
| ليس كل سؤال يستحق طلباً جديداً | للاستعلام السريع: محرر للقراءة فقط، بلا طلب ولا انتظار |
| استعلام واحد بس | استعلام واحد فقط |
