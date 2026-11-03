<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { findItem } from './catalog';
import SignatureMark from './components/SignatureMark.vue';
import ThemeToggle from './components/ThemeToggle.vue';
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

const nav = [
  { label: 'Skills', to: '#/', current: () => route.value.view === 'skills' || route.value.view === 'item' },
  { label: 'Recommended', to: '#/recommended', current: () => route.value.view === 'recommended' },
];
</script>

<template>
  <div class="min-h-dvh">
    <div class="mx-auto max-w-[1040px] px-6">
      <header class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pt-4 md:pt-7">
        <a href="#/" class="inline-flex min-h-11 items-center" aria-label="Skills, home">
          <SignatureMark :key="`s${route.view}`" :width="80" />
        </a>

        <nav aria-label="Primary" class="flex flex-wrap items-center gap-x-5 text-sm">
          <a
            v-for="item in nav"
            :key="item.to"
            :href="item.to"
            class="link-muted inline-flex min-h-11 items-center"
            :class="item.current() && '!text-fg'"
            :aria-current="item.current() ? 'page' : undefined"
          >
            {{ item.label }}
          </a>
          <a
            href="https://github.com/Haythamasalama/skills"
            target="_blank"
            rel="noopener"
            class="inline-flex min-h-9 items-center rounded-full border border-chip px-3.5 text-fg transition-colors hover:bg-surface"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="main">
        <ItemPage v-if="route.view === 'item'" :item="route.item" :path="route.path" :anchor="route.anchor" />
        <RecommendedPage v-else-if="route.view === 'recommended'" />
        <SkillsPage v-else />
      </main>

      <footer class="mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-line pt-7 pb-10">
        <p class="text-[13px] text-faint">
          Haytham A. Salama · skills for Claude Code · install with <code class="font-mono">npx skills add</code>
        </p>
        <div class="-mr-3 flex items-center">
          <ThemeToggle />
        </div>
      </footer>
    </div>
  </div>
</template>
