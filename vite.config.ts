import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@hupa/core': path.resolve(__dirname, './packages/core/src'),
      '@hupa/graph': path.resolve(__dirname, './packages/graph/src'),
      '@hupa/shared': path.resolve(__dirname, './packages/shared/src'),
      '@hupa/storage': path.resolve(__dirname, './packages/storage/src'),
      '@hupa/auth': path.resolve(__dirname, './packages/auth/src'),
      '@hupa/sync': path.resolve(__dirname, './packages/sync/src'),
      '@hupa/state': path.resolve(__dirname, './packages/state/src'),
      '@hupa/ui': path.resolve(__dirname, './packages/ui/src'),
      '@hupa/editor': path.resolve(__dirname, './packages/editor/src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
