import { type Component, shallowRef } from 'vue';
import { findItem, loadContent, mainFile } from './catalog';

// Set before mount on a directly opened skill page, so it renders whole instead of pushing the footer down on arrival.
export const itemPage = shallowRef<Component | null>(null);

export async function loadItemPage() {
  itemPage.value ??= (await import('./pages/ItemPage.vue')).default;
}

// Vue replaces the prerendered page when it mounts, so a skill page waits for what it needs to avoid a blank flash.
export async function preloadRoute() {
  const [kind, name, ...rest] = decodeURIComponent(location.pathname).split('/').filter(Boolean);
  const item = kind === 'skills' ? findItem(name) : undefined;

  if (!item) return;

  const file = item.files.find(f => f.path === rest.join('/')) ?? mainFile(item);

  await Promise.all([loadItemPage(), loadContent(item.name, file)]);
}
