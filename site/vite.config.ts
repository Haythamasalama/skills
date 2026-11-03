import { homedir } from 'node:os';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const repo = resolve(__dirname, '..');

export default defineConfig({
  plugins: [vue()],
  define: {
    __REPO_PATH__: JSON.stringify(repo.replace(homedir(), '~')),
  },
  server: {
    port: 4321,
    fs: { allow: [repo] },
  },
});
