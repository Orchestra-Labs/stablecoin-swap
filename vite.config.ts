import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import path from 'path'


export default defineConfig({
  define: {
    global: "window",
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
    // proxy: {
    //   '/api': {
    //     target: 'https://symphony-api.kleomedes.network',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/api/, ''),
    //   },
    //   '/rpc': {
    //     target: 'https://symphony-rpc.kleomedes.network',
    //     changeOrigin: true,
    //     rewrite: path => path.replace(/^\/rpc/, ''),
    //   },
    // },
  },
  preview: {
    open: false,
  },
});
