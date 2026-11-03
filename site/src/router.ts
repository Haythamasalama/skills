import { ref } from 'vue';

const current = () => location.pathname + location.search + location.hash;

export const url = ref(current());

export const syncUrl = () => (url.value = current());

export function replaceUrl(to: string) {
  history.replaceState(history.state, '', to);
  syncUrl();
}

// Internal links stay in the app; anything else (new tab, modified click, another origin) is the browser's.
export function followLink(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = (event.target as Element).closest('a');

  if (!link || link.target || link.origin !== location.origin) return;

  event.preventDefault();
  history.pushState(null, '', link.href);
  syncUrl();
}
