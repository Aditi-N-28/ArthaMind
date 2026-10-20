// vite.config.ts
import { defineConfig } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [pluginReact()],

  // Correct root
  root: './client',

  base: './',

  build: {
    outDir: '../dist/client',
  },

  resolve: {
    alias: {
      '@': path.resolve(projectRoot, './client/src'),
      '@shared': path.resolve(projectRoot, './shared')
    },
  },

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
});