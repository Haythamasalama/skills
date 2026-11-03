declare module 'virtual:skills-meta' {
  const meta: import('../skills-data').SkillMeta[];
  export default meta;
}

declare module 'virtual:skills-content' {
  const contents: Record<string, string>;
  export default contents;
}
