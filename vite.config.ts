import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  define: {
    global: 'globalThis',
    'process.env': '{}',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      buffer: path.resolve(__dirname, 'node_modules/buffer/'),
      process: path.resolve(__dirname, 'node_modules/process/browser.js'),
      stream: path.resolve(__dirname, 'node_modules/readable-stream/'),
      util: path.resolve(__dirname, 'node_modules/util/'),
      events: path.resolve(__dirname, 'node_modules/events/'),
    },
  },
  plugins: [react(), viteTsconfigPaths()],
  optimizeDeps: {
    include: [
      'buffer',
      'process',
      'readable-stream',
      'events',
      '@cosmos-kit/aria-extension',
      '@cosmos-kit/keplr',
      '@cosmos-kit/react',
    ],
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      inject: [path.resolve(__dirname, 'src/buffer-shim.js')],
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
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
