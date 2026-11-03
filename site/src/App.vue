<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { allItems, allPacks, findItem, repoPath, search } from './catalog';
import CopyButton from './CopyButton.vue';
import ItemView from './ItemView.vue';
import MapView from './MapView.vue';
import { renderMarkdown } from './markdown';

const hash = ref(location.hash);
const query = ref('');
const theme = ref(document.documentElement.className === 'light' ? 'light' : 'dark');
const searchBox = ref<HTMLInputElement>();

const onHash = () => {
  hash.value = location.hash;
  query.value = '';
};

const onKey = (e: KeyboardEvent) => {
  if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && document.activeElement !== searchBox.value) {
    e.preventDefault();
    searchBox.value?.focus();
  }

  if (e.key === 'Escape') query.value = '';
};

onMounted(() => {
  addEventListener('hashchange', onHash);
  addEventListener('keydown', onKey);
});
onUnmounted(() => {
  removeEventListener('hashchange', onHash);
  removeEventListener('keydown', onKey);
});

const route = computed(() => {
  const [path, anchor = ''] = decodeURIComponent(hash.value.replace(/^#\/?/, '')).split('::');
  const [kind, name, ...rest] = path.split('/');

  if (kind === 'item' && name && findItem(name)) return { view: 'item' as const, item: findItem(name)!, path: rest.join('/'), anchor };
  if (kind === 'pack' && allPacks.some(p => p.name === name)) return { view: 'pack' as const, pack: allPacks.find(p => p.name === name)! };

  return { view: 'home' as const };
});

const hits = computed(() => search(query.value));
const skills = allItems.filter(i => i.kind === 'skill').length;
const agents = allItems.length - skills;
const files = allItems.reduce((n, i) => n + i.files.length, 0);

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
  document.documentElement.className = theme.value;

  try {
    localStorage.setItem('theme', theme.value);
  } catch {}
}

const highlight = (snippet: string) => {
  const escaped = snippet.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
  const terms = query.value.trim().split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  return terms.length ? escaped.replace(new RegExp(`(${terms.join('|')})`, 'gi'), '<mark>$1</mark>') : escaped;
};
</script>

<template>
  <div class="shell">
    <aside class="side">
      <a href="#/" class="brand">
        <span class="brand-mark" />
        <span>مخزن المهارات</span>
      </a>

      <nav class="side-nav" aria-label="الحزم">
        <div v-for="p in allPacks" :key="p.name" class="side-pack">
          <a :href="`#/pack/${p.name}`" class="side-pack-name" :class="{ active: route.view === 'pack' && route.pack.name === p.name }" dir="ltr">{{ p.name }}</a>
          <a
            v-for="item in p.items"
            :key="item.name"
            :href="`#/item/${item.name}`"
            class="side-item"
            :class="{ active: route.view === 'item' && route.item.name === item.name }"
            dir="ltr"
          >
            <span class="dot" :class="item.kind" />{{ item.name }}
          </a>
        </div>
      </nav>
    </aside>

    <div class="main">
      <header class="top">
        <label class="search">
          <span class="sr-only">بحث</span>
          <input ref="searchBox" v-model="query" type="search" placeholder="ابحث بكل المهارات والملفات…" autocomplete="off" />
          <kbd v-if="!query">/</kbd>
        </label>
        <button type="button" class="ghost" :aria-label="theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الغامق'" @click="toggleTheme">
          {{ theme === 'dark' ? 'فاتح' : 'غامق' }}
        </button>
      </header>

      <main class="content">
        <section v-if="query.trim()" class="results">
          <p class="eyebrow">{{ hits.length ? `${hits.length} نتيجة` : 'ما في نتائج' }}</p>
          <a
            v-for="h in hits"
            :key="h.item.name + h.file.path"
            :href="`#/item/${h.item.name}/${h.file.path}`"
            class="result"
            @click="query = ''"
          >
            <span class="result-path" dir="ltr">{{ h.item.pack }} / {{ h.item.name }} / {{ h.file.path }}</span>
            <span class="result-snippet" dir="auto" v-html="highlight(h.snippet)" />
          </a>
        </section>

        <ItemView v-else-if="route.view === 'item'" :item="route.item" :path="route.path" :anchor="route.anchor" />

        <section v-else-if="route.view === 'pack'" class="pack">
          <p class="eyebrow">حزمة</p>
          <h1 dir="ltr">{{ route.pack.name }}</h1>
          <div class="install-row single">
            <code dir="ltr">sh {{ repoPath }}/scripts/install.sh {{ route.pack.name }}{{ route.pack.name === 'tooling' ? ' --global' : '' }}</code>
            <CopyButton :text="`sh ${repoPath}/scripts/install.sh ${route.pack.name}${route.pack.name === 'tooling' ? ' --global' : ''}`" />
          </div>
          <div class="prose readme" v-html="renderMarkdown(route.pack.readme, '', 'README.md')" />
          <MapView :only="route.pack.name" />
        </section>

        <section v-else class="home">
          <p class="eyebrow">{{ allPacks.length }} حزم · {{ skills }} مهارة · {{ agents }} وكيل · {{ files }} ملف</p>
          <h1>مهاراتي <em>لكل مشروع</em></h1>
          <p class="lede">
            كل حزمة موضوع، وكل مهارة بتشتغل لحالها. اختار اللي بدك ياه، انسخ الأمر، وشغّله جوا مجلد المشروع:
            بتنزل بـ <code dir="ltr">.claude/skills</code>.
          </p>
          <MapView />
        </section>
      </main>
    </div>
  </div>
</template>
