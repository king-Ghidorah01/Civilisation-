import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['emsdk']
  },
  server: {
    watch: {
      ignored: ['**/emsdk/**']
    }
  }
});
