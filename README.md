# مهاراتي

مهارات عامة لـ Claude Code بستعملها بكل مشاريعي. كل مهارة مكتوبة بطريقة عامة: ما فيها أسماء شركات أو عملاء، ولا بيانات خاصة.

## التثبيت على أي جهاز

```bash
gh repo clone Haythamasalama/skills ~/Desktop/projects/skills
sh ~/Desktop/projects/skills/install.sh
```

السكربت بيربط كل مهارة بمجلد `~/.claude/skills`، وكل وكيل بمجلد `~/.claude/agents`، فبتشتغل بكل المشاريع مباشرة. تشغيله أكثر من مرة آمن.

المهارات اللي نزّلتها من ناس ثانيين مش منسوخة هون. قائمتها مع طريقة تنزيلها بملف [third-party.md](third-party.md).

## المهارات

| المهارة | شو بتعمل |
|---|---|
| [whatsapp-business-platform](skills/whatsapp-business-platform/SKILL.md) | كل إمكانيات واتساب للأعمال من Meta: شو بنقدر نعمل بدون إشعارات فورية، وشو بدها إشعارات، والحدود والأسعار والتواريخ المهمة |
| [linkedin-posts](skills/linkedin-posts/SKILL.md) | كتابة ونشر منشورات لينكدإن وثريدات تويتر بأسلوبي، مع الصورة وخطوات النشر |
| [nuxt-ui](skills/nuxt-ui/SKILL.md) | بناء لوحات تحكم ومواقع بـ Nuxt UI: الألوان، المكونات، العربي والإنجليزي، والمشاكل المعروفة وحلولها |
| [haytham-brand](skills/haytham-brand/SKILL.md) | هويتي: الاسم، الشعار، الألوان، الخطوط، وأسلوب الكتابة |
| [laravel-ddd](skills/laravel-ddd/SKILL.md) | طريقة تقسيم كود Laravel لطبقات (Actions و DTOs و Contracts و Services) مع قوالب جاهزة |
| [laravel-code-quality](skills/laravel-code-quality/SKILL.md) | قواعد جودة الكود والأخطاء الشائعة والأمان والمراجعة |
| [laravel-multitenancy](skills/laravel-multitenancy/SKILL.md) | تطبيقات SaaS لأكثر من عميل على Laravel |
| [admin-ui](skills/admin-ui/SKILL.md) | لوحات الإدارة بـ Inertia و Vue و shadcn-vue |
| [ui-review](skills/ui-review/SKILL.md) | فحص الواجهة بالمتصفح: كل صفحة بالوضع الفاتح والغامق وباللغتين |
| [arabic-copy](skills/arabic-copy/SKILL.md) | كتابة ومراجعة النصوص العربية للمواقع والمنتجات |
| [commit-messages](skills/commit-messages/SKILL.md) | كتابة رسائل الكوميت حسب Conventional Commits، وتقسيم الشغل، وفتح الـ PR ووصفه والرد على المراجعات والدمج |
| [coolify-deploy](skills/coolify-deploy/SKILL.md) | تجهيز التطبيق بـ Docker ونشره على Coolify |
| [tech-articles](skills/tech-articles/SKILL.md) | كتابة مقالات تقنية وقصص المشاريع، والرسومات، وتحويلها لمنشورات |

## إضافة مهارة جديدة

اطلب من Claude بأي مشروع: "حوّل هاد لمهارة". الوكيل [skill-publisher](agents/skill-publisher.md) بيكتبها بطريقة عامة حسب [CONVENTIONS.md](CONVENTIONS.md)، وبيفحص الخصوصية، وبيربطها بجهازك، وبيرفعها هون.

قبل أي رفع: `sh scripts/privacy-scan.sh` لازم يطبع `clean`.
