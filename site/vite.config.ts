import { homedir } from 'node:os';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const repo = resolve(import.meta.dirname, '..');

export default defineConfig(({ command }) => ({
  plugins: [vue(), tailwindcss()],
  define: {
    // Only the local dev server shows where the repo lives; a public build must not carry a machine path.
    __REPO_PATH__: JSON.stringify(command === 'serve' ? repo.replace(homedir(), '~') : ''),
  },
  server: {
    port: 4321,
    fs: { allow: [repo] },
  },
}));
