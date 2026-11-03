<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { findItem } from './catalog';
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import ToolsBanner from './components/ToolsBanner.vue';
import ItemPage from './pages/ItemPage.vue';
import RecommendedPage from './pages/RecommendedPage.vue';
import SkillsPage from './pages/SkillsPage.vue';

const hash = ref(location.hash);
const onHash = () => (hash.value = location.hash);

onMounted(() => addEventListener('hashchange', onHash));
onUnmounted(() => removeEventListener('hashchange', onHash));

// Routes: #/ · #/recommended · #/item/<name>[/<file>][::<anchor>]
const route = computed(() => {
  const [path, anchor = ''] = decodeURIComponent(hash.value.replace(/^#\/?/, '')).split('::');
  const [kind, name, ...rest] = path.split('/');
  const item = kind === 'item' ? findItem(name) : undefined;

  if (item) return { view: 'item' as const, item, path: rest.join('/'), anchor };
  if (kind === 'recommended') return { view: 'recommended' as const };

  return { view: 'skills' as const };
});

</script>

<template>
  <div class="min-h-dvh">
    <div class="mx-auto max-w-[1040px] px-6">
      <AppHeader :path="hash" :view="route.view === 'item' ? 'skills' : route.view" />

      <main id="main">
        <ItemPage v-if="route.view === 'item'" :item="route.item" :path="route.path" :anchor="route.anchor" />
        <RecommendedPage v-else-if="route.view === 'recommended'" />
        <SkillsPage v-else />
      </main>

      <ToolsBanner />
      <AppFooter />
    </div>
  </div>
</template>
