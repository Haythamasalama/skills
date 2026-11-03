import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';
import { frontmatter } from './src/frontmatter.ts';

export interface SkillFile {
  path: string;
  title: string;
  lines: number;
}

export interface SkillMeta {
  name: string;
  description: string;
  summary: string;
  tags: string[];
  files: SkillFile[];
  lines: number;
}

const TEXT = /\.(md|mjs|js|ts|sh|py|json|css|html|php|vue|svg)$/;
const BINARY = /\.(png|ico|jpg|jpeg|webp)$/;

const KIND_TITLES: Record<string, string> = { sh: 'Shell script', py: 'Python script', mjs: 'Node script', js: 'Script', ts: 'Config', json: 'Data', css: 'Stylesheet', html: 'Template', svg: 'Image', png: 'Image', ico: 'Icon', php: 'PHP fixture', vue: 'Vue fixture' };

function titleOf(path: string, content: string | null): string {
  if (path === 'SKILL.md') return 'Overview';

  const heading = content?.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (heading && path.endsWith('.md')) return heading.replace(/[*`]/g, '');

  return KIND_TITLES[path.split('.').pop() ?? ''] ?? 'File';
}

const order = (path: string) => (path === 'SKILL.md' ? 0 : !path.includes('/') ? 1 : path.startsWith('references/') ? 2 : 3);

export function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);

    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

export function readSkills(repo: string) {
  const root = join(repo, 'skills');
  const contents: Record<string, string> = {};
  const sources: string[] = [];

  const meta: SkillMeta[] = readdirSync(root)
    .filter(name => statSync(join(root, name)).isDirectory())
    .sort()
    .map(name => {
      const skill: SkillMeta = { name, description: '', summary: '', tags: [], files: [], lines: 0 };

      for (const file of walk(join(root, name))) {
        const path = relative(join(root, name), file);

        // specs/ is Apple's own material and stays on the owner's machine; it is gitignored and never published.
        if (path.startsWith('specs/') || !(TEXT.test(path) || BINARY.test(path))) continue;

        const content = TEXT.test(path) ? readFileSync(file, 'utf8') : null;
        const lines = content === null ? 0 : content.split('\n').length;

        sources.push(file);
        skill.files.push({ path, title: titleOf(path, content), lines });
        skill.lines += lines;

        if (content !== null) contents[`${name}/${path}`] = content;

        if (path === 'SKILL.md' && content !== null) {
          const { data } = frontmatter(content);

          skill.description = data.description ?? '';
          skill.summary = data.summary ?? '';
          skill.tags = (data.tags ?? '').split(',').map(t => t.trim()).filter(Boolean);
        }
      }

      skill.files.sort((a, b) => order(a.path) - order(b.path) || a.path.localeCompare(b.path));

      return skill;
    });

  return { meta, contents, sources };
}

const IDS: Record<string, 'meta' | 'contents'> = { 'virtual:skills-meta': 'meta', 'virtual:skills-content': 'contents' };

/** Serves the list data and, in its own chunk, the full text that only the search inside files needs. */
export function skillsData(repo: string): Plugin {
  return {
    name: 'skills-data',
    resolveId: id => (IDS[id] ? `\0${id}` : undefined),
    load(id) {
      const key = id.startsWith('\0') ? IDS[id.slice(1)] : undefined;

      if (!key) return;

      const data = readSkills(repo);

      for (const file of data.sources) this.addWatchFile(file);

      return `export default JSON.parse(${JSON.stringify(JSON.stringify(data[key]))});`;
    },
  };
}
