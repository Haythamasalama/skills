# Claude Code Skills

Agent skills (`SKILL.md`) for Claude Code, Cursor, Codex and other coding agents: Laravel DDD, Laravel +
Inertia + Vue, Nuxt UI, shadcn-vue, Apple iOS 27 and macOS 27 design, Liquid Glass, Coolify deploys, git
workflow and the WhatsApp Cloud API. Each skill stands alone: install the ones you need into a project with
the standard [skills CLI](https://skills.sh).

Browse and search them at [skills.haythamasalama.me](https://skills.haythamasalama.me).

```bash
npx skills add haythamasalama/skills                          # pick from the list
npx skills add haythamasalama/skills --skill laravel-ddd      # one skill
```

## Skills

| Skill | Tags | What it covers |
|---|---|---|
| [laravel-ddd](skills/laravel-ddd/SKILL.md) | laravel, php, ddd, domain-driven-design, architecture | A Domain-Driven Design layout for Laravel: Actions, DTOs, Contracts, Services, controllers, JSON API, tests |
| [laravel-code-quality](skills/laravel-code-quality/SKILL.md) | laravel, php, security, code-review, clean-code | Code style, security, sensitive operations, the anti-pattern catalogue and code review |
| [laravel-inertia-vue](skills/laravel-inertia-vue/SKILL.md) | inertia, laravel, vue, vue3, typescript | A Laravel + Inertia + Vue 3 front-end blueprint: folders, day-one files, house components, forms, lists, theme, RTL |
| [shadcn-vue-kit](skills/shadcn-vue-kit/SKILL.md) | shadcn-vue, vue, ui, tailwindcss, rtl | shadcn-vue setup with a ready theme, the component catalogue, wrappers, charts and RTL fixes |
| [nuxt-ui-kit](skills/nuxt-ui-kit/SKILL.md) | nuxt-ui, nuxt, vue, ui, tailwindcss, rtl | A Nuxt UI 4 blueprint with a copy-ready theme, dashboard shell, i18n and RTL, static sites and SEO |
| [apple-macos-27-design](skills/apple-macos-27-design/SKILL.md) | macos, apple, design, liquid-glass, ui-kit | Exact values from Apple's macOS 27 UI Kit |
| [apple-ios-27-design](skills/apple-ios-27-design/SKILL.md) | ios, apple, design, liquid-glass, ui-kit | Exact values from Apple's iOS 27 UI Kit |
| [apple-screens](skills/apple-screens/SKILL.md) | mockups, apple, design, macos, ios | Drawn Mac windows and iPhone screens as HTML, rendered to PNG |
| [liquid-glass-web](skills/liquid-glass-web/SKILL.md) | liquid-glass, glassmorphism, css, design, ui | Apple-style Liquid Glass for websites and landing pages |
| [haythamasalama-brand](skills/haythamasalama-brand/SKILL.md) | brand, design | The author's personal brand: signature, colours, type and voice |
| [coolify-deploy](skills/coolify-deploy/SKILL.md) | coolify, deploy, docker, nginx | Dockerfiles, nginx and Coolify settings for SPA, prerendered and server apps |
| [git-workflow](skills/git-workflow/SKILL.md) | git, conventional-commits, pull-requests | Conventional Commits, branch names, pull requests and merging |
| [whatsapp-business-manager](skills/whatsapp-business-manager/SKILL.md) | whatsapp, whatsapp-cloud-api, meta, webhooks, api | What Meta's WhatsApp Cloud API can do: webhooks, templates, limits and pricing |

## Recommended skills from others

[skills-lock.json](skills-lock.json) lists official and community skills that work well with these
(shadcn-vue, Nuxt UI, Laravel, Vue, a security audit, front-end design and motion, browser automation,
and everyday agent workflows). Skills that need a paid service or a sign-in to work are left out. To install
all of them in a project, copy the file into the project root and run:

```bash
npx skills experimental_install
```

Laravel's own Boost package adds more Laravel skills and an MCP server:
`composer require laravel/boost --dev && php artisan boost:install`.

## Browse locally

```bash
sh scripts/site.sh     # http://localhost:4321
```

## Contributing

Read [CONVENTIONS.md](CONVENTIONS.md). Before every commit both checks must pass:

```bash
sh scripts/check.sh
sh scripts/privacy-scan.sh
```

## License

[MIT](LICENSE). The license does not cover the name, signature and logos in `skills/haythamasalama-brand/` and
`site/public/logos/`, or the third-party trademarks mentioned in the skills.
