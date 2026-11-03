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
