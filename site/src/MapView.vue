<script setup lang="ts">
import { computed } from 'vue';
import { allItems, allPacks, type Pack } from './catalog';

const props = defineProps<{ only?: string }>();

const packs = computed<Pack[]>(() => (props.only ? allPacks.filter(p => p.name === props.only) : allPacks));
const maxLines = Math.max(...allItems.map(i => i.lines));

const folders = (files: { path: string }[]) => {
  const counts = new Map<string, number>();

  for (const f of files) {
    const dir = f.path.includes('/') ? f.path.split('/')[0] : 'SKILL.md';
    counts.set(dir, (counts.get(dir) ?? 0) + 1);
  }

  return [...counts.entries()];
};
</script>

<template>
  <div class="map">
    <section v-for="p in packs" :key="p.name" class="map-pack">
      <a class="map-pack-head" :href="`#/pack/${p.name}`">
        <span class="map-pack-name" dir="ltr">{{ p.name }}</span>
        <span class="map-pack-sum">{{ p.summary }}</span>
      </a>

      <ul class="map-items">
        <li v-for="item in p.items" :key="item.name">
          <a :href="`#/item/${item.name}`" class="map-item">
            <span class="map-item-top">
              <span class="map-item-name" dir="ltr">{{ item.name }}</span>
              <span class="tag" :class="item.kind">{{ item.kind === 'agent' ? 'وكيل' : 'مهارة' }}</span>
            </span>
            <span class="map-bar"><i :style="{ inlineSize: `${Math.max(4, (item.lines / maxLines) * 100)}%` }" /></span>
            <span class="map-folders" dir="ltr">
              <span v-for="[dir, n] in folders(item.files)" :key="dir" class="chip">{{ dir }}<b v-if="n > 1">{{ n }}</b></span>
            </span>
          </a>
        </li>
      </ul>
    </section>
  </div>
</template>
