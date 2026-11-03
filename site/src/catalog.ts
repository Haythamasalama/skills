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
  tags: string[];
  files: RepoFile[];
  lines: number;
}

export interface Recommended {
  name: string;
  tags: string[];
  source: string;
  owner: string;
  repo: string;
  url: string;
  command: string;
}

export interface Publisher {
  owner: string;
  repo: string;
  url: string;
  avatar: string | null;
  skills: Recommended[];
}

export function frontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { data: {}, body: source };
  }

  const data: Record<string, string> = {};

  for (const line of match[1].split('\n')) {
    const pair = line.match(/^\s*([a-zA-Z_-]+):\s*(.*)$/);

    if (pair) {
      data[pair[1]] = pair[2].replace(/^["']|["']$/g, '');
    }
  }

  return { data, body: source.slice(match[0].length) };
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
    items.set(name, { name, description: '', tags: [], files: [], lines: 0 });
  }

  const item = items.get(name)!;
  const lines = content === null ? 0 : content.split('\n').length;
  item.files.push({ path, title: titleOf(path, content), content, url, lines });
  item.lines += lines;

  if (path === 'SKILL.md' && content !== null) {
    const { data } = frontmatter(content);
    item.description = data.description ?? '';
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

    return {
      name,
      tags: tagsFor(name, entry.source),
      source: entry.source,
      owner,
      repo,
      url: wellKnown ? entry.sourceUrl : `https://github.com/${entry.source}`,
      command: wellKnown ? `npx skills add ${entry.sourceUrl}` : `npx skills add ${entry.source} --skill ${name}`,
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

// Tabs are each skill's main technology (its first tag); a tab lists every skill tagged with it.
export const allTags = (() => {
  const all = [...allItems.map(i => i.tags), ...recommended.map(r => r.tags)];
  const main = new Set(all.map(tags => tags[0]).filter(Boolean));

  return [...main]
    .map(tag => ({ tag, count: all.filter(tags => tags.includes(tag)).length }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
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
