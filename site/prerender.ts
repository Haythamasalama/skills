import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { frontmatter } from './src/frontmatter';
import { renderMarkdown } from './src/markdown';
import { summaries } from './src/recommended';
import * as seo from './src/seo';
import { socials } from './src/site';

const { AUTHOR, REPO_NAME, SITE_URL } = seo;
const OG_IMAGE = `${SITE_URL}/og.png`;
const INSTALL_ALL = `npx skills add ${REPO_NAME}`;

const escape = (text: string) => text.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const jsonLd = (data: unknown) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

interface Page {
  path: string;
  seo: seo.Seo;
  body: string;
  schema: unknown[];
  type?: 'website' | 'article';
  noindex?: boolean;
}

const author = { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url, sameAs: socials.filter(s => s.to.startsWith('http')).map(s => s.to) };

function headOf(page: Page): string {
  const url = `${SITE_URL}${page.path}`;
  const { title, description, keywords } = page.seo;

  return [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta name="keywords" content="${escape(keywords.join(', '))}" />`,
    `<meta name="author" content="${escape(AUTHOR.name)}" />`,
    `<meta name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="${page.type ?? 'website'}" />`,
    `<meta property="og:site_name" content="${REPO_NAME}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    ...page.schema.map(jsonLd),
  ].join('\n    ');
}

const shell = (content: string) => `<main class="mx-auto max-w-[1040px] px-6 pt-16 md:pt-[88px]">${content}</main>`;
const h1 = (text: string) => `<h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]">${escape(text)}</h1>`;
const command = (text: string) => `<p class="mt-6 font-mono text-[13px] text-fg"><code>${escape(text)}</code></p>`;
const list = (rows: { href: string; name: string; summary: string }[]) =>
  `<ul class="mt-6 flex flex-col gap-4">${rows
    .map(r => `<li><a class="font-mono text-[15px] font-medium text-fg" href="${r.href}">${escape(r.name)}</a><br /><span class="text-[14px] text-muted">${escape(r.summary)}</span></li>`)
    .join('')}</ul>`;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const path = join(dir, entry);

    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const firstHeading = (body: string, fallback: string) => body.match(/^#\s+(.+)$/m)?.[1]?.trim().replace(/[*`]/g, '') ?? fallback;

const firstParagraph = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map(block => block.trim())
    .find(block => block && !/^(#|```|\||-|\*\*See also)/.test(block))
    ?.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*`]/g, '')
    .replace(/\s+/g, ' ') ?? '';

export function prerender(repo: string): Plugin {
  return {
    name: 'prerender',
    apply: 'build',
    closeBundle() {
      const dist = resolve(repo, 'site/dist');
      const template = readFileSync(join(dist, 'index.html'), 'utf8');
      const skillsDir = join(repo, 'skills');

      const skills = readdirSync(skillsDir)
        .filter(name => existsSync(join(skillsDir, name, 'SKILL.md')))
        .sort()
        .map(name => {
          const source = readFileSync(join(skillsDir, name, 'SKILL.md'), 'utf8');
          const { data, body } = frontmatter(source);

          return { name, source, body, summary: data.summary ?? '', tags: (data.tags ?? '').split(',').map(t => t.trim()).filter(Boolean) };
        });

      const lock = JSON.parse(readFileSync(join(repo, 'skills-lock.json'), 'utf8')).skills as Record<string, { source: string; sourceType: string; sourceUrl?: string }>;
      const others = Object.entries(lock).map(([name, entry]) => ({
        name,
        source: entry.source,
        url: entry.sourceType === 'well-known' ? entry.sourceUrl! : `https://github.com/${entry.source}`,
        summary: summaries[name] ?? '',
      }));

      const pages: Page[] = [
        {
          path: '/',
          seo: seo.home,
          body: shell(
            `${h1('Claude Code Skills')}${command(INSTALL_ALL)}<h2 class="eyebrow mt-14">My skills</h2>${list(skills.map(s => ({ href: `/skills/${s.name}`, name: s.name, summary: s.summary })))}<h2 class="eyebrow mt-14">Recommended</h2>${list(others.map(o => ({ href: o.url, name: o.name, summary: o.summary })))}`,
          ),
          schema: [
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Claude Code Skills',
              alternateName: REPO_NAME,
              url: `${SITE_URL}/`,
              description: seo.home.description,
              inLanguage: 'en',
              author,
              potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: 'Claude Code skills by Haytham A. Salama',
              itemListElement: skills.map((s, i) => ({ '@type': 'ListItem', position: i + 1, name: s.name, url: `${SITE_URL}/skills/${s.name}` })),
            },
          ],
        },
        {
          path: '/recommended',
          seo: seo.recommended,
          body: shell(`${h1(seo.recommended.title)}${list(others.map(o => ({ href: o.url, name: o.name, summary: `${o.summary} (${o.source})` })))}`),
          schema: [
            {
              '@context': 'https://schema.org',
              '@type': 'ItemList',
              name: seo.recommended.title,
              itemListElement: others.map((o, i) => ({ '@type': 'ListItem', position: i + 1, name: o.name, url: o.url })),
            },
          ],
        },
        { path: '/explore', seo: seo.explore, body: shell(h1(seo.explore.title)), schema: [], noindex: true },
      ];

      for (const skill of skills) {
        const path = `/skills/${skill.name}`;

        pages.push({
          path,
          type: 'article',
          seo: seo.skill(skill.name, skill.summary, skill.tags),
          body: shell(
            `${h1(skill.name)}<p class="mt-3 text-[17px] text-soft">${escape(skill.summary)}</p>${command(`${INSTALL_ALL} --skill ${skill.name}`)}<article class="prose-site prose mt-8 max-w-none">${renderMarkdown(skill.source, skill.name, 'SKILL.md')}</article>`,
          ),
          schema: [
            {
              '@context': 'https://schema.org',
              '@type': 'SoftwareSourceCode',
              name: skill.name,
              description: skill.summary,
              url: `${SITE_URL}${path}`,
              codeRepository: `https://github.com/${REPO_NAME}`,
              keywords: skill.tags.join(', '),
              license: 'https://opensource.org/licenses/MIT',
              author,
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Skills', item: `${SITE_URL}/` },
                { '@type': 'ListItem', position: 2, name: skill.name, item: `${SITE_URL}${path}` },
              ],
            },
          ],
        });

        const root = join(skillsDir, skill.name);

        for (const file of walk(root)) {
          const rel = relative(root, file);

          if (!rel.endsWith('.md') || rel === 'SKILL.md' || rel.startsWith('specs/')) continue;

          const source = readFileSync(file, 'utf8');
          const { body } = frontmatter(source);
          const heading = firstHeading(body, rel);

          pages.push({
            path: `${path}/${rel}`,
            type: 'article',
            seo: seo.skillFile(skill.name, heading, firstParagraph(body) || skill.summary, skill.tags),
            body: shell(`<p class="font-mono text-[12px] text-faint"><a href="${path}">${escape(skill.name)}</a> / ${escape(rel)}</p><article class="prose-site prose mt-6 max-w-none">${renderMarkdown(source, skill.name, rel)}</article>`),
            schema: [
              {
                '@context': 'https://schema.org',
                '@type': 'TechArticle',
                headline: heading,
                url: `${SITE_URL}${path}/${rel}`,
                author,
                isPartOf: { '@type': 'SoftwareSourceCode', name: skill.name, url: `${SITE_URL}${path}` },
              },
            ],
          });
        }
      }

      for (const page of pages) {
        const html = template
          .replace(/<!--seo-->[\s\S]*?<!--\/seo-->/, headOf(page))
          .replace('<div id="app"></div>', `<div id="app">${page.body}</div>`);
        const target = page.path === '/' ? join(dist, 'index.html') : join(dist, `${page.path.slice(1)}.html`);

        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, html);
      }

      for (const skill of skills) {
        writeFileSync(join(dist, 'skills', `${skill.name}.md`), `# ${skill.name}\n\n> ${skill.summary}\n\nInstall: \`${INSTALL_ALL} --skill ${skill.name}\`\n\n${skill.body}`);
      }

      const indexed = pages.filter(p => !p.noindex);

      writeFileSync(
        join(dist, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexed.map(p => `  <url><loc>${SITE_URL}${p.path}</loc></url>`).join('\n')}\n</urlset>\n`,
      );

      writeFileSync(
        join(dist, 'llms.txt'),
        [
          `# ${REPO_NAME}`,
          '',
          `> Agent skills for Claude Code and other coding agents, by ${AUTHOR.name}. Each skill is a folder with a SKILL.md, stands alone, and installs with the standard skills CLI.`,
          '',
          `Install all of them with \`${INSTALL_ALL}\`, or one with \`${INSTALL_ALL} --skill <name>\`. The recommended skills are others' work: each lists its own source.`,
          '',
          '## Skills',
          '',
          ...skills.map(s => `- [${s.name}](${SITE_URL}/skills/${s.name}.md): ${s.summary}`),
          '',
          '## Recommended',
          '',
          ...others.map(o => `- [${o.name}](${o.url}): ${o.summary} Source: ${o.source}.`),
          '',
          '## Optional',
          '',
          `- [Search all of skills.sh](${SITE_URL}/explore)`,
          `- [About the author](${AUTHOR.url})`,
          '',
        ].join('\n'),
      );

      console.log(`prerender: ${pages.length} pages, sitemap.xml, llms.txt`);
    },
  };
}
