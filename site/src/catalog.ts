declare const __REPO_PATH__: string;

export const repoPath = __REPO_PATH__;

const text = import.meta.glob<string>(
  ['../../*/skills/**/*.{md,mjs,js,ts,sh,py,json,css,html,php,vue,svg}', '../../*/agents/*.md', '../../*/README.md', '!../../site/**'],
  { query: '?raw', import: 'default', eager: true },
);

const binary = import.meta.glob<string>(['../../*/skills/**/*.{png,ico,jpg,jpeg,webp}', '!../../site/**'], {
  query: '?url',
  import: 'default',
  eager: true,
});

export interface RepoFile {
  path: string;
  content: string | null;
  url: string | null;
  lines: number;
}

export interface Item {
  kind: 'skill' | 'agent';
  name: string;
  pack: string;
  description: string;
  files: RepoFile[];
  lines: number;
}

export interface Pack {
  name: string;
  summary: string;
  readme: string;
  items: Item[];
}

export function frontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { data: {}, body: source };
  }

  const data: Record<string, string> = {};

  for (const line of match[1].split('\n')) {
    const pair = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);

    if (pair) {
      data[pair[1]] = pair[2].replace(/^["']|["']$/g, '');
    }
  }

  return { data, body: source.slice(match[0].length) };
}

const packs = new Map<string, Pack>();
const items = new Map<string, Item>();

function pack(name: string): Pack {
  if (!packs.has(name)) {
    packs.set(name, { name, summary: '', readme: '', items: [] });
  }

  return packs.get(name)!;
}

function add(key: string, content: string | null, url: string | null) {
  const parts = key.replace(/^\.\.\/\.\.\//, '').split('/');
  const packName = parts[0];

  if (parts[1] === 'README.md' && content !== null) {
    const p = pack(packName);
    p.readme = content;
    p.summary = content.split('\n\n')[1]?.trim() ?? '';

    return;
  }

  const kind = parts[1] === 'agents' ? 'agent' : 'skill';
  const name = kind === 'agent' ? parts[2].replace(/\.md$/, '') : parts[2];
  const path = kind === 'agent' ? `${name}.md` : parts.slice(3).join('/');

  if (!items.has(name)) {
    const item: Item = { kind, name, pack: packName, description: '', files: [], lines: 0 };
    items.set(name, item);
    pack(packName).items.push(item);
  }

  const item = items.get(name)!;
  const lines = content === null ? 0 : content.split('\n').length;
  item.files.push({ path, content, url, lines });
  item.lines += lines;

  if ((path === 'SKILL.md' || kind === 'agent') && content !== null) {
    item.description = frontmatter(content).data.description ?? '';
  }
}

for (const [key, content] of Object.entries(text)) {
  add(key, content, null);
}

for (const [key, url] of Object.entries(binary)) {
  add(key, null, url);
}

const order = (path: string) => (path === 'SKILL.md' || path.endsWith('.md') && !path.includes('/') ? 0 : path.startsWith('references/') ? 1 : 2);

for (const item of items.values()) {
  item.files.sort((a, b) => order(a.path) - order(b.path) || a.path.localeCompare(b.path));
}

for (const p of packs.values()) {
  p.items.sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === 'skill' ? -1 : 1));
}

export const allPacks = [...packs.values()].sort((a, b) => a.name.localeCompare(b.name));
export const allItems = [...items.values()];

export function findItem(name: string): Item | undefined {
  return items.get(name);
}

export function mainFile(item: Item): RepoFile {
  return item.files.find(f => f.path === 'SKILL.md' || f.path === `${item.name}.md`) ?? item.files[0];
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
