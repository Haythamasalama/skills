<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import { computed } from 'vue';
import { allItems, allPacks, type Item } from '../catalog';
import CopyButton from '../components/CopyButton.vue';
import CompanionList from '../components/CompanionList.vue';
import PackTile from '../components/PackTile.vue';
import PageHeader from '../components/PageHeader.vue';
import { packCommand } from '../install';

const { only } = defineProps<{ only?: string }>();

const packs = computed(() => (only ? allPacks.filter(p => p.name === only) : allPacks));
const pack = computed(() => (only ? packs.value[0] : undefined));
const maxLines = Math.max(...allItems.map(i => i.lines));

const folders = (item: Item) => {
  const counts = new Map<string, number>();

  for (const f of item.files) {
    const dir = f.path.includes('/') ? `${f.path.split('/')[0]}/` : f.path;
    counts.set(dir, (counts.get(dir) ?? 0) + 1);
  }

  return [...counts.entries()];
};
</script>

<template>
  <div>
    <PageHeader v-if="pack" :title="pack.name" mono>
      <template #eyebrow>
        <a href="#/map" class="go link-muted mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm">
          <ArrowLeft class="size-4" />
          The map
        </a>
      </template>
      <p>{{ pack.summary }}</p>
    </PageHeader>
    <PageHeader v-else title="Map">
      <p>
        Every pack, the skills inside it, and what each skill is made of. Skills never point at each other, so the
        map is a tree: a pack groups them, nothing ties them together.
      </p>
    </PageHeader>

    <div v-if="pack" class="mt-8 flex items-center gap-2 rounded-[14px] border border-line py-1 pr-2 pl-4">
      <span class="shrink-0 text-[13px] text-faint">Whole pack</span>
      <code class="min-w-0 flex-auto overflow-x-auto font-mono text-[12.5px] whitespace-nowrap text-fg">{{ packCommand(pack.name) }}</code>
      <CopyButton :text="packCommand(pack.name)" :label="`the install command for ${pack.name}`" />
    </div>

    <section v-if="pack && pack.companions.length" aria-labelledby="companions" class="mt-10">
      <h2 id="companions" class="eyebrow">Works well with</h2>
      <CompanionList class="mt-4" :companions="pack.companions" />
    </section>

    <section aria-label="Packs and skills" class="mt-12 flex flex-col gap-12">
      <div v-for="p in packs" :key="p.name" class="grid gap-x-8 gap-y-4 md:grid-cols-[200px_1fr]">
        <a :href="`#/pack/${p.name}`" class="group flex items-start gap-3 md:sticky md:top-6 md:self-start">
          <PackTile :pack="p.name" />
          <span class="flex flex-col gap-1">
            <span class="font-mono text-[15px] font-medium text-fg group-hover:underline group-hover:decoration-(--underline) group-hover:underline-offset-4">
              {{ p.name }}
            </span>
            <span class="text-[13px] leading-[1.55] text-faint">{{ p.items.length }} {{ p.items.length === 1 ? 'item' : 'items' }}</span>
          </span>
        </a>

        <ul class="relative ml-[17px] flex flex-col gap-3 border-l border-line pl-6 md:ml-0">
          <li v-for="item in p.items" :key="item.name" class="relative">
            <span class="absolute top-[22px] -left-6 h-px w-5 bg-line" aria-hidden="true" />
            <span class="absolute top-[19px] -left-[27px] size-[7px] rounded-full border border-chip bg-bg" aria-hidden="true" />
            <a
              :href="`#/item/${item.name}`"
              class="flex flex-col gap-2.5 rounded-[14px] border border-line px-4 py-3 transition-colors hover:border-chip hover:bg-raised"
            >
              <span class="flex items-center justify-between gap-3">
                <span class="font-mono text-[14px] font-medium text-fg">{{ item.name }}</span>
                <span
                  class="rounded-[5px] px-1.5 font-mono text-[9.5px] leading-4 tracking-[0.1em] uppercase"
                  :class="item.kind === 'agent' ? 'border-gradient' : 'border border-chip text-faint'"
                >
                  <span :class="item.kind === 'agent' && 'text-gradient'">{{ item.kind }}</span>
                </span>
              </span>
              <span class="block h-[3px] overflow-hidden rounded-full bg-line" :title="`${item.lines} lines`">
                <span class="block h-full rounded-full" :style="{ width: `${Math.max(4, (item.lines / maxLines) * 100)}%`, background: 'var(--gradient)' }" />
              </span>
              <span class="flex flex-wrap gap-1.5">
                <span
                  v-for="[dir, n] in folders(item)"
                  :key="dir"
                  class="inline-flex items-center rounded-md border border-line px-1.5 font-mono text-[11px] text-muted"
                >
                  {{ dir }}<span v-if="n > 1" class="ml-1 text-faint">{{ n }}</span>
                </span>
                <span class="ml-auto font-mono text-[11px] text-faint">{{ item.lines.toLocaleString('en-US') }} lines</span>
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
