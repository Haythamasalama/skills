import { type Item, repoPath } from './catalog';

export const REPO = 'haythamasalama/skills';

export function installCommands(item: Item) {
  return [
    { label: 'From GitHub, in the project folder', text: `npx skills add ${REPO} --skill ${item.name}` },
    { label: 'From this machine', text: `npx skills add ${repoPath} --skill ${item.name}` },
    { label: 'Or ask Claude in any project', text: `Install the ${item.name} skill from ${REPO} in this project` },
  ];
}

export interface Pick {
  /** What `npx skills add` takes: owner/repo, or a site's URL. */
  from: string;
  name: string;
}

export function bulkCommands(picks: Pick[]): string[] {
  const bySource = new Map<string, string[]>();

  for (const pick of picks) bySource.set(pick.from, [...(bySource.get(pick.from) ?? []), pick.name]);

  return [...bySource].map(([from, names]) => `npx skills add ${from} --skill ${names.join(' ')}`);
}
