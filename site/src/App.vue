<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, onUnmounted, watchEffect } from 'vue';
import { findItem } from './catalog';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import BulkBar from './components/BulkBar.vue';
import ToolsBanner from './components/ToolsBanner.vue';
import SkillsPage from './pages/SkillsPage.vue';
import { picks } from './picks';
import { followLink, syncUrl, url } from './router';
import * as seo from './seo';

const ItemPage = defineAsyncComponent(() => import('./pages/ItemPage.vue'));

onMounted(() => {
  addEventListener('popstate', syncUrl);
  document.addEventListener('click', followLink);
});
onUnmounted(() => {
  removeEventListener('popstate', syncUrl);
  document.removeEventListener('click', followLink);
});

// Routes: / · /recommended · /explore, each with an optional ?q=<search> · /skills/<name>[/<file>][#<anchor>]
const route = computed(() => {
  const { pathname, search, hash } = new URL(url.value, location.origin);
  const q = new URLSearchParams(search).get('q') ?? '';
  const [kind, name, ...rest] = decodeURIComponent(pathname).split('/').filter(Boolean);
  const item = kind === 'skills' ? findItem(name) : undefined;

  if (item) return { view: 'item' as const, item, path: rest.join('/'), anchor: hash.slice(1) };
  if (kind === 'recommended') return { view: 'recommended' as const, q };
  if (kind === 'explore') return { view: 'skillssh' as const, q };

  return { view: 'skills' as const, q };
});

watchEffect(() => {
  const page = route.value;

  if (page.view === 'item') {
    const file = page.path ? page.item.files.find(f => f.path === page.path) : undefined;

    document.title = file ? seo.skillFile(page.item.name, file.title, '').title : seo.skill(page.item.name, page.item.summary).title;
  } else document.title = { skills: seo.home, recommended: seo.recommended, skillssh: seo.explore }[page.view].title;
});

</script>

<template>
  <div class="min-h-dvh">
    <div class="mx-auto max-w-[1040px] px-6">
      <AppHeader :path="url" />

      <main id="main">
        <ItemPage v-if="route.view === 'item'" :item="route.item" :path="route.path" :anchor="route.anchor" />
        <SkillsPage v-else :tab="route.view" :q="route.q" />
      </main>

      <ToolsBanner />
      <AppFooter />
      <div v-if="picks.size" class="h-44" aria-hidden="true" />
    </div>

    <BulkBar />
  </div>
</template>
