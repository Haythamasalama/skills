import { findItem, loadContent, mainFile } from './catalog';

// Vue replaces the prerendered page when it mounts, so a skill page waits for what it needs to avoid a blank flash.
export async function preloadRoute() {
  const [kind, name, ...rest] = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const item = kind === 'skills' ? findItem(name) : undefined;

  if (!item) return;

  const file = item.files.find(f => f.path === rest.join('/')) ?? mainFile(item);

  await Promise.all([import('./pages/ItemPage.vue'), loadContent(item.name, file)]);
}
