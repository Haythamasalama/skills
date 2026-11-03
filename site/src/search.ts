import { allItems, type Item, type RepoFile } from './catalog';

export interface Hit {
  item: Item;
  file: RepoFile;
  score: number;
  snippet: string;
}

export async function search(query: string, limit = 40): Promise<Hit[]> {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (terms.length === 0) {
    return [];
  }

  // The full text of every skill is the largest thing on the site, so only a search downloads it.
  const { default: contents } = await import('virtual:skills-content');
  const hits: Hit[] = [];

  for (const item of allItems) {
    for (const file of item.files) {
      const content = contents[`${item.name}/${file.path}`];

      if (content === undefined) {
        continue;
      }

      const haystack = content.toLowerCase();

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
      const snippet = (start > 0 ? '…' : '') + content.slice(start, at + 130).replace(/\s+/g, ' ').trim() + '…';
      hits.push({ item, file, score, snippet });
    }
  }

  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
