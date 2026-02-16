
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  preview: {
    // Render provides a $PORT environment variable
    port: parseInt(process.env.PORT || '4173'),
    strictPort: true,
    // Allow Render domains to access the preview server
    allowedHosts: ['moems-master.onrender.com', '.onrender.com']
  },
  build: {
    outDir: 'dist',
  }
});
