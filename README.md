# مهاراتي

مهارات لـ Claude Code مرتبة بحزم حسب الموضوع. كل مهارة مكتوبة بطريقة عامة (بدون أسماء شركات أو عملاء أو بيانات خاصة)، وكل وحدة بتشتغل لحالها: بتقدر تنزّل مهارة وحدة بدون ما تحتاج غيرها.

## الحزم

| الحزمة | شو فيها |
|---|---|
| [laravel](laravel/README.md) | كود Laravel بطريقة DDD، وجودة الكود والأمان |
| [vue-inertia](vue-inertia/README.md) | واجهات Vue مع Inertia، وفحص الواجهة |
| [brand](brand/README.md) | هويتي: الشعار والألوان والخطوط والأسلوب |
| [writing](writing/README.md) | النص العربي والمقالات التقنية |
| [deploy](deploy/README.md) | Docker والنشر على Coolify |
| [git](git/README.md) | رسائل الـ commits |
| [whatsapp](whatsapp/README.md) | منصة واتساب للأعمال |
| [tooling](tooling/README.md) | أدوات الريبو نفسه (بتنزل على الجهاز كله) |

## تنزيل مهارات بمشروع

```bash
sh scripts/install.sh --list
sh scripts/install.sh laravel vue-inertia --to ~/path/to/project
sh scripts/install.sh laravel-ddd --to ~/path/to/project
```

بتنتسخ لمجلد `.claude/` جوا المشروع. كل نسخة فيها ملف `.skills-repo`، فإذا شغّلت الأمر مرة ثانية بيحدّث اللي نزل من هون، وما بيلمس مهارات ثانية بنفس الاسم إلا مع `--force`.

المهارات اللي نزّلتها من ناس ثانيين مش منسوخة هون. قائمتها مع طريقة تنزيلها بملف [third-party.md](third-party.md).

## إضافة أو تعديل مهارة

القواعد بملف [CONVENTIONS.md](CONVENTIONS.md). قبل أي commit لازم الاثنين ينجحوا:

```bash
sh scripts/check.sh
sh scripts/privacy-scan.sh
```
