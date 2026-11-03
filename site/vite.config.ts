import { homedir } from 'node:os';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const repo = resolve(import.meta.dirname, '..');

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  define: {
    __REPO_PATH__: JSON.stringify(repo.replace(homedir(), '~')),
  },
  server: {
    port: 4321,
    fs: { allow: [repo] },
  },
});
