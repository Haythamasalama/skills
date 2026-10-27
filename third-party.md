# Skills installed from other people

These are not copied here: they belong to their authors and get updates there. This is the list to
reinstall them on a new machine (checked 2026-10-27, from `~/.agents/.skill-lock.json` and the
`skills-lock.json` files of the projects).

Install with the skills CLI: `npx skills add <source>` and pick the skills from the list it shows.

## Personal (all projects)

| Source | Skills |
|---|---|
| `anthropics/skills` | frontend-design |
| `vercel-labs/skills` | find-skills |
| `vercel-labs/agent-browser` | agent-browser |
| `emilkowalski/skills` | animate, animate-expo, animation-vocabulary, apple-design, ask-sonner, emil-design-eng, find-animation-opportunities, improve-animations, mobile-native, pick-ui-library, prototype, review-animations, write-swift |
| `Leonxlnx/taste-skill` | brandkit, design-taste-frontend, design-taste-frontend-v1, full-output-enforcement, gpt-taste, high-end-visual-design, image-to-code, imagegen-frontend-mobile, imagegen-frontend-web, industrial-brutalist-ui, minimalist-ui, redesign-existing-projects, stitch-design-taste |
| `JuliusBrussee/caveman` | cavecrew, caveman, caveman-commit, caveman-compress, caveman-discover, caveman-evidence-review, caveman-explore, caveman-help, caveman-learn, caveman-manage, caveman-optimize, caveman-review, caveman-setup, caveman-stats, lean-build, migration, safe-refactor, verify-and-stop |
| `mattpocock/skills` | grilling, teach |
| `blader/humanizer` | humanizer |
| `sergebulaev/linkedin-skills` | linkedin-marketing (posting through the Publora API) |
| `pbakaus/impeccable` (Apache 2.0, installed by hand) | impeccable |

## Per project (install inside the project)

| Source | Skills | Used for |
|---|---|---|
| `vuejs-ai/skills` | vue-best-practices, vue-debug-guides, vue-pinia-best-practices, vue-router-best-practices, vue-testing-best-practices, create-adaptable-composable | Vue 3 apps |
| `onmax/nuxt-skills` | nuxt, nuxt-content, nitro, vue, vue-best-practices, vue-debug-guides | Nuxt apps |
| `unovue/shadcn-vue` | shadcn-vue | shadcn-vue UIs |
| `vercel-labs/agent-skills` | web-design-guidelines | web UI reviews |
| `marksalpeter/skills` | grill-me | plan interrogation |
| Laravel Boost (`composer require laravel/boost --dev`, then `php artisan boost:install`) | laravel-best-practices, pest-testing, inertia-vue-development, pennant-development, tailwindcss-development, wayfinder-development, configuring-horizon | Laravel apps; Boost writes them for the installed packages |
