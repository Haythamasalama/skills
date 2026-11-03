import { type Item, repoPath } from './catalog';

const script = `sh ${repoPath}/scripts/install.sh`;

export function packCommand(pack: string): string {
  return `${script} ${pack}${pack === 'tooling' ? ' --global' : ''}`;
}

export function installCommands(item: Item) {
  const global = item.pack === 'tooling';

  return [
    { label: global ? 'On this machine' : 'Only this one, from the project folder', text: `${script} ${item.name}${global ? ' --global' : ''}` },
    { label: `The whole ${item.pack} pack`, text: packCommand(item.pack) },
    { label: 'Or ask Claude in any project', text: `Install the ${item.name} ${item.kind} in this project` },
  ];
}
