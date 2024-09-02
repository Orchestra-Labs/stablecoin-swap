import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), nodePolyfills()],
  server: {
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://symphony-api.kleomedes.network',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/rpc': {
        target: 'https://symphony-rpc.kleomedes.network',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/rpc/, ''),
      },
    },
  },
  preview: {
    open: false,
  },
});
