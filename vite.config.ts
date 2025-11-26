// vite.config.ts
import { defineConfig } from 'vite';
import pluginReact from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [pluginReact()],

  // Correct root
  root: './client',

  base: './',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared')
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