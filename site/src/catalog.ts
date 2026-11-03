import metadata from 'virtual:skills-meta';
import { summaries } from './recommended';

declare const __REPO_PATH__: string;

export const repoPath = __REPO_PATH__;

// One chunk per file, so a visit downloads only the files it opens.
const loaders = import.meta.glob<string>(['../../skills/*/**/*.{md,mjs,js,ts,sh,py,json,css,html,php,vue,svg}', '!../../skills/*/specs/**'], {
  query: '?raw',
  import: 'default',
});

const binary = import.meta.glob<string>(['../../skills/*/**/*.{png,ico,jpg,jpeg,webp}', '!../../skills/*/specs/**'], {
  query: '?url',
  import: 'default',
  eager: true,
});

const lock = import.meta.glob<string>('../../skills-lock.json', { query: '?raw', import: 'default', eager: true });

export interface RepoFile {
  path: string;
  title: string;
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

const fileKey = (name: string, path: string) => `../../skills/${name}/${path}`;

export const allItems: Item[] = metadata.map(skill => ({
  ...skill,
  files: skill.files.map(file => ({ ...file, url: binary[fileKey(skill.name, file.path)] ?? null })),
}));

const items = new Map(allItems.map(item => [item.name, item]));
const contents = new Map<string, string>();

export const contentOf = (name: string, file: RepoFile) => contents.get(fileKey(name, file.path)) ?? null;

export async function loadContent(name: string, file: RepoFile): Promise<string | null> {
  const key = fileKey(name, file.path);

  if (!contents.has(key) && loaders[key]) contents.set(key, await loaders[key]());

  return contents.get(key) ?? null;
}

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

export function findItem(name: string): Item | undefined {
  return items.get(name);
}

export function mainFile(item: Item): RepoFile {
  return item.files.find(f => f.path === 'SKILL.md') ?? item.files[0];
}
