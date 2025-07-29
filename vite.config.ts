import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [react(), viteTsconfigPaths()],
  server: {
    open: true,
    host: true,
    proxy: {
      '/test-stablestaking-rest': {
        target: 'http://34.67.182.102:1317',
        changeOrigin: true,
        rewrite: pathStr => pathStr.replace(/^\/test-stablestaking-rest/, ''),
      },
    },
  },
  preview: {
    open: false,
  },
});
