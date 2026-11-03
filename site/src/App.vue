<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { findItem } from './catalog';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import BulkBar from './components/BulkBar.vue';
import ToolsBanner from './components/ToolsBanner.vue';
import ItemPage from './pages/ItemPage.vue';
import SkillsPage from './pages/SkillsPage.vue';
import { picks } from './picks';

const hash = ref(location.hash);
const onHash = () => (hash.value = location.hash);

onMounted(() => addEventListener('hashchange', onHash));
onUnmounted(() => removeEventListener('hashchange', onHash));

// Routes: #/ · #/recommended · #/explore, each with an optional ?q=<search> · #/item/<name>[/<file>][::<anchor>]
const route = computed(() => {
  const [target, search = ''] = hash.value.split('?');
  const q = new URLSearchParams(search).get('q') ?? '';
  const [path, anchor = ''] = decodeURIComponent(target.replace(/^#\/?/, '')).split('::');
  const [kind, name, ...rest] = path.split('/');
  const item = kind === 'item' ? findItem(name) : undefined;

  if (item) return { view: 'item' as const, item, path: rest.join('/'), anchor };
  if (kind === 'recommended') return { view: 'recommended' as const, q };
  if (kind === 'explore') return { view: 'skillssh' as const, q };

  return { view: 'skills' as const, q };
});

</script>

<template>
  <div class="min-h-dvh">
    <div class="mx-auto max-w-[1040px] px-6">
      <AppHeader :path="hash" />

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
