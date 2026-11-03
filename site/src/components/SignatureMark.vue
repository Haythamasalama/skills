<script setup lang="ts">
import { computed } from 'vue';
import { SIGNATURE_VIEWBOX, signatureStrokes } from '../utils/signature';

const { width = 80 } = defineProps<{ width?: number }>();

const height = computed(() => Math.round((width * 79) / 156));
const gradientId = `signature-${Math.random().toString(36).slice(2)}`;
</script>

<template>
  <svg
    class="signature"
    :width="width"
    :height="height"
    :viewBox="SIGNATURE_VIEWBOX"
    fill="none"
    stroke-width="3.2"
    stroke-miterlimit="2.6131"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <defs>
      <linearGradient :id="gradientId" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="152" y2="75">
        <stop offset="0" stop-color="#7F7CF2" />
        <stop offset=".5" stop-color="#6C8CF9" />
        <stop offset="1" stop-color="#4F9BFF" />
      </linearGradient>
    </defs>
    <path
      v-for="(stroke, index) in signatureStrokes"
      :key="index"
      :d="stroke.d"
      :style="{
        strokeDasharray: stroke.length,
        strokeDashoffset: stroke.length,
        animationDuration: `${stroke.duration}s`,
        animationDelay: `${stroke.delay}s`,
      }"
    />
  </svg>
</template>
