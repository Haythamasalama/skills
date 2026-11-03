export const SITE_URL = 'https://skills.haythamasalama.me';
export const REPO_NAME = 'haythamasalama/skills';
export const AUTHOR = { name: 'Haytham A. Salama', url: 'https://haythamasalama.me' };

const clip = (text: string, max = 158) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

const COMMON_KEYWORDS = ['claude code skills', 'agent skills', 'claude skills', 'SKILL.md', 'npx skills add', 'skills.sh', 'ai coding agent skills'];

export interface Seo {
  title: string;
  description: string;
  keywords: string[];
}

export const home: Seo = {
  title: 'Claude Code Skills for Laravel, Vue, Nuxt UI and Apple Design',
  description: clip('Agent skills for Claude Code, Cursor and Codex: Laravel DDD, Inertia + Vue, Nuxt UI, shadcn-vue, iOS 27 and macOS 27 design. Install with npx skills add.'),
  keywords: [
    ...COMMON_KEYWORDS,
    'cursor skills',
    'codex skills',
    'laravel skill',
    'laravel ddd',
    'domain driven design laravel',
    'laravel inertia vue',
    'vue 3 skill',
    'nuxt ui skill',
    'shadcn-vue skill',
    'apple design skill',
    'ios 27 design',
    'macos 27 design',
    'liquid glass css',
    'coolify deploy',
    'whatsapp cloud api',
    'conventional commits',
  ],
};

export const recommended: Seo = {
  title: 'Recommended Agent Skills for Claude Code',
  description: clip('Agent skills worth installing, from Laravel, Vue, Nuxt, Cloudflare, Anthropic and others, each with its one-line install command.'),
  keywords: [...COMMON_KEYWORDS, 'best claude code skills', 'recommended agent skills', 'laravel boost', 'vue best practices', 'security audit skill', 'taste skill', 'frontend design skill', 'impeccable skill', 'animation skills'],
};

export const explore: Seo = {
  title: 'Search Agent Skills on skills.sh',
  description: 'Search every agent skill on skills.sh, pick a few, and install them with one command.',
  keywords: [...COMMON_KEYWORDS, 'search agent skills', 'bulk install skills'],
};

// The words people search for, which a skill's kebab-case folder name does not always contain.
const SKILL_TOPICS: Record<string, string> = {
  'apple-ios-27-design': 'iOS 27 Design',
  'apple-macos-27-design': 'macOS 27 Design',
  'apple-screens': 'Mac and iPhone Mockups',
  'coolify-deploy': 'Coolify Deploy',
  'git-workflow': 'Git Workflow',
  'haythamasalama-brand': 'Personal Brand',
  'laravel-code-quality': 'Laravel Code Quality',
  'laravel-ddd': 'Laravel DDD',
  'laravel-inertia-vue': 'Laravel Inertia Vue',
  'liquid-glass-web': 'Liquid Glass CSS',
  'nuxt-ui-kit': 'Nuxt UI',
  'shadcn-vue-kit': 'shadcn-vue',
  'whatsapp-business-manager': 'WhatsApp Cloud API',
};

const skillTitle = (name: string) => `${SKILL_TOPICS[name] ?? name} Skill for Claude Code`;

export const skill = (name: string, summary: string, tags: string[] = []): Seo => ({
  title: skillTitle(name),
  description: clip(`${summary} Install with npx skills add ${REPO_NAME} --skill ${name}.`),
  keywords: [skillTitle(name).toLowerCase(), name, ...tags, ...COMMON_KEYWORDS],
});

export const skillFile = (name: string, heading: string, summary: string, tags: string[] = []): Seo => ({
  title: `${heading} | ${skillTitle(name)}`,
  description: clip(summary),
  keywords: [name, heading.toLowerCase(), ...tags, ...COMMON_KEYWORDS],
});
