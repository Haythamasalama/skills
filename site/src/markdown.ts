import hljs from 'highlight.js/lib/common';
import MarkdownIt from 'markdown-it';
import { frontmatter } from './catalog';

const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: true,
  highlight(code, lang) {
    const language = lang && hljs.getLanguage(lang) ? lang : '';
    const html = language ? hljs.highlight(code, { language, ignoreIllegals: true }).value : md.utils.escapeHtml(code);

    return `<pre class="hljs"><code>${html}</code></pre>`;
  },
});

function resolvePath(from: string, target: string): string {
  const base = from.split('/').slice(0, -1);

  for (const part of target.split('/')) {
    if (part === '..') base.pop();
    else if (part !== '.' && part !== '') base.push(part);
  }

  return base.join('/');
}

// Relative links inside a skill open the target file in the app instead of leaving it.
export function renderMarkdown(source: string, item: string, path: string): string {
  const { body } = frontmatter(source);
  const env = {};
  const tokens = md.parse(body, env);

  tokens.forEach((token, i) => {
    if (token.type === 'heading_open') {
      const slug = tokens[i + 1].content
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .trim()
        .replace(/\s+/g, '-');
      token.attrSet('id', slug);
    }
  });

  for (const token of tokens) {
    for (const child of token.children ?? []) {
      if (child.type !== 'link_open') continue;

      const href = child.attrGet('href') ?? '';

      if (/^(https?:|mailto:)/.test(href)) {
        if (href.startsWith('http')) child.attrSet('target', '_blank');
        continue;
      }

      const [file, anchor] = href.split('#');
      const target = file ? resolvePath(path, file) : path;
      child.attrSet('href', `#/item/${item}/${target}${anchor ? `::${anchor}` : ''}`);
    }
  }

  return md.renderer.render(tokens, md.options, env);
}

export function renderCode(source: string, path: string): string {
  const ext = path.split('.').pop() ?? '';
  const language = { mjs: 'javascript', js: 'javascript', ts: 'typescript', sh: 'bash', py: 'python', vue: 'xml', html: 'xml', svg: 'xml' }[ext] ?? ext;
  const html = hljs.getLanguage(language) ? hljs.highlight(source, { language, ignoreIllegals: true }).value : md.utils.escapeHtml(source);

  return `<pre class="hljs code-file"><code>${html}</code></pre>`;
}
