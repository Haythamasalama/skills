<script setup lang="ts">
defineProps<{ title: string; mono?: boolean }>();
</script>

<template>
  <section class="pt-16 md:pt-[88px]">
    <slot name="eyebrow" />
    <h1
      class="text-[28px] leading-tight font-semibold tracking-[-0.02em] md:text-[30px]"
      :class="mono && 'font-mono font-medium tracking-[-0.01em]'"
    >
      {{ title }}
    </h1>
    <div class="mt-4 space-y-2.5 text-[17px] leading-[1.7] text-soft">
      <slot />
    </div>
  </section>
</template>
