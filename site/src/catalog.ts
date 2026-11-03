import { frontmatter } from './frontmatter';
import { summaries } from './recommended';

declare const __REPO_PATH__: string;

export const repoPath = __REPO_PATH__;

const text = import.meta.glob<string>('../../skills/*/**/*.{md,mjs,js,ts,sh,py,json,css,html,php,vue,svg}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const binary = import.meta.glob<string>('../../skills/*/**/*.{png,ico,jpg,jpeg,webp}', {
  query: '?url',
  import: 'default',
  eager: true,
});

const lock = import.meta.glob<string>('../../skills-lock.json', { query: '?raw', import: 'default', eager: true });

export interface RepoFile {
  path: string;
  title: string;
  content: string | null;
  url: string | null;
  lines: number;
}

export interface Item {
  name: string;
  description: string;
  summary: string;
  tags: string[];
  files: RepoFile[];
  lines: number;
}

export interface Recommended {
  name: string;
  summary: string;
  avatar: string | null;
  tags: string[];
  source: string;
  owner: string;
  repo: string;
  url: string;
  /** What `npx skills add` takes: owner/repo, or the site's URL for a site-hosted source. */
  from: string;
  command: string;
}

export interface Publisher {
  owner: string;
  repo: string;
  url: string;
  avatar: string | null;
  skills: Recommended[];
}

const KIND_TITLES: Record<string, string> = { sh: 'Shell script', py: 'Python script', mjs: 'Node script', js: 'Script', ts: 'Config', json: 'Data', css: 'Stylesheet', html: 'Template', svg: 'Image', png: 'Image', ico: 'Icon', php: 'PHP fixture', vue: 'Vue fixture' };

function titleOf(path: string, content: string | null): string {
  if (path === 'SKILL.md') return 'Overview';

  const heading = content?.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (heading && path.endsWith('.md')) return heading.replace(/[*`]/g, '');

  return KIND_TITLES[path.split('.').pop() ?? ''] ?? 'File';
}

const items = new Map<string, Item>();

function add(key: string, content: string | null, url: string | null) {
  const [, name, ...rest] = key.replace(/^\.\.\/\.\.\//, '').split('/');
  const path = rest.join('/');

  if (!items.has(name)) {
    items.set(name, { name, description: '', summary: '', tags: [], files: [], lines: 0 });
  }

  const item = items.get(name)!;
  const lines = content === null ? 0 : content.split('\n').length;
  item.files.push({ path, title: titleOf(path, content), content, url, lines });
  item.lines += lines;

  if (path === 'SKILL.md' && content !== null) {
    const { data } = frontmatter(content);
    item.description = data.description ?? '';
    item.summary = data.summary ?? '';
    item.tags = (data.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
  }
}

for (const [key, content] of Object.entries(text)) {
  add(key, content, null);
}

for (const [key, url] of Object.entries(binary)) {
  add(key, null, url);
}

const order = (path: string) => (path === 'SKILL.md' ? 0 : !path.includes('/') ? 1 : path.startsWith('references/') ? 2 : 3);

for (const item of items.values()) {
  item.files.sort((a, b) => order(a.path) - order(b.path) || a.path.localeCompare(b.path));
}

export const allItems = [...items.values()].sort((a, b) => a.name.localeCompare(b.name));

export const OWNER = 'haythamasalama';

// A site-hosted source has no GitHub owner; these are the owners behind the ones we list.
const SITE_OWNERS: Record<string, string> = { 'ui.nuxt.com': 'nuxt' };

export function avatarOf(source: string, wellKnown = false): string | null {
  const owner = wellKnown ? SITE_OWNERS[source] : source.split('/')[0];

  return owner ? `https://github.com/${owner}.png?size=64` : null;
}

export const CATEGORIES = [
  { id: 'backend', label: 'Backend', tags: ['laravel', 'php'] },
  { id: 'frontend', label: 'Frontend', tags: ['vue', 'nuxt', 'inertia', 'ui'] },
  { id: 'design', label: 'Design', tags: ['design', 'apple', 'brand'] },
  { id: 'ai', label: 'AI & agents', tags: ['ai'] },
  { id: 'devops', label: 'DevOps', tags: ['deploy', 'docker', 'git'] },
  { id: 'security', label: 'Security', tags: ['security'] },
  { id: 'integrations', label: 'Integrations', tags: ['whatsapp', 'api'] },
];

export const inCategory = (tags: string[], id: string) => CATEGORIES.find(c => c.id === id)?.tags.some(t => tags.includes(t)) ?? false;

// The lock file has no tags, so recommended skills are filed by name and source.
function tagsFor(name: string, source: string): string[] {
  if (name.startsWith('laravel')) return ['laravel'];
  if (name === 'nuxt-ui') return ['nuxt', 'vue', 'ui'];
  if (name.startsWith('vue') || name === 'shadcn-vue') return ['vue'];
  if (name === 'security-audit') return ['security'];
  if (name === 'write-swift' || name === 'apple-design') return ['design', 'apple'];
  if (source.startsWith('emilkowalski') || ['design-taste-frontend', 'frontend-design', 'impeccable'].includes(name)) return ['design'];

  return ['ai'];
}

export const recommended: Recommended[] = (() => {
  const raw = Object.values(lock)[0];

  if (!raw) return [];

  const entries = Object.entries(JSON.parse(raw).skills ?? {}) as [string, Record<string, string>][];

  return entries.map(([name, entry]) => {
    const wellKnown = entry.sourceType === 'well-known';
    const [owner, repo = ''] = entry.source.split('/');
    const from = wellKnown ? entry.sourceUrl : entry.source;

    return {
      name,
      summary: summaries[name] ?? '',
      avatar: avatarOf(entry.source, wellKnown),
      tags: tagsFor(name, entry.source),
      source: entry.source,
      owner,
      repo,
      url: wellKnown ? entry.sourceUrl : `https://github.com/${entry.source}`,
      from,
      command: `npx skills add ${from} --skill ${name}`,
    };
  });
})();

export const publishers: Publisher[] = (() => {
  const map = new Map<string, Publisher>();

  for (const skill of recommended) {
    if (!map.has(skill.source)) {
      map.set(skill.source, {
        owner: skill.owner,
        repo: skill.repo,
        url: skill.url,
        avatar: skill.repo ? `https://github.com/${skill.owner}.png?size=64` : null,
        skills: [],
      });
    }

    map.get(skill.source)!.skills.push(skill);
  }

  return [...map.values()].sort((a, b) => a.owner.localeCompare(b.owner));
})();

export function findItem(name: string): Item | undefined {
  return items.get(name);
}

export function mainFile(item: Item): RepoFile {
  return item.files.find(f => f.path === 'SKILL.md') ?? item.files[0];
}

export interface Hit {
  item: Item;
  file: RepoFile;
  score: number;
  snippet: string;
}

export function search(query: string, limit = 40): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  const hits: Hit[] = [];

  for (const item of allItems) {
    for (const file of item.files) {
      if (file.content === null) {
        continue;
      }

      const haystack = file.content.toLowerCase();

      if (!terms.every(t => haystack.includes(t) || item.name.includes(t))) {
        continue;
      }

      let score = 0;

      for (const t of terms) {
        if (item.name.includes(t)) score += 20;
        if (file.path.toLowerCase().includes(t)) score += 8;
        if (item.description.toLowerCase().includes(t)) score += 5;
        score += Math.min(haystack.split(t).length - 1, 10);
      }

      const at = Math.max(0, haystack.indexOf(terms[0]));
      const start = Math.max(0, at - 70);
      const snippet = (start > 0 ? '…' : '') + file.content.slice(start, at + 130).replace(/\s+/g, ' ').trim() + '…';
      hits.push({ item, file, score, snippet });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
