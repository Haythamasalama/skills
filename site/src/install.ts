import { type Item, repoPath } from './catalog';

export const REPO = 'haythamasalama/skills';

export function installCommands(item: Item) {
  return [
    { label: 'From GitHub, in the project folder', text: `npx skills add ${REPO} --skill ${item.name}` },
    { label: 'From this machine', text: `npx skills add ${repoPath} --skill ${item.name}` },
    { label: 'Or ask Claude in any project', text: `Install the ${item.name} skill from ${REPO} in this project` },
  ];
}
