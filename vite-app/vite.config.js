import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/OUMI/vite-app/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
});
