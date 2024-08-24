import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), nodePolyfills()],
  server: {
    open: true,
    host: true,
  },
  preview: {
    open: false,
  },
});
