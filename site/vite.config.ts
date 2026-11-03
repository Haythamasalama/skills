import { homedir } from 'node:os';
import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { prerender } from './prerender.ts';
import { skillsData } from './skills-data.ts';

const repo = resolve(import.meta.dirname, '..');

// Production gets the same proxy from the rewrite in vercel.json.
const proxy = { '/api': { target: 'https://skills.sh', changeOrigin: true } };

export default defineConfig(({ command }) => ({
  plugins: [vue(), tailwindcss(), skillsData(repo), prerender(repo)],
  define: {
    // Only the local dev server shows where the repo lives; a public build must not carry a machine path.
    __REPO_PATH__: JSON.stringify(command === 'serve' ? repo.replace(homedir(), '~') : ''),
  },
  server: {
    port: 4321,
    fs: { allow: [repo] },
    proxy,
  },
  preview: { proxy },
}));
