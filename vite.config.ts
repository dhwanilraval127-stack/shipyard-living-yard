import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { host: true, port: 5173, strictPort: true, allowedHosts: true },
  preview: { host: true, port: 4173, strictPort: true, allowedHosts: true },
  build: { target: 'es2022', sourcemap: false, chunkSizeWarningLimit: 1200 },
});
