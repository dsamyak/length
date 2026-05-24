import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor':   ['react', 'react-dom', 'framer-motion'],
          'audio':    ['howler'],
          'dnd':      ['@dnd-kit/core', '@dnd-kit/sortable']
        }
      }
    },
    chunkSizeWarningLimit: 600,
  }
});
