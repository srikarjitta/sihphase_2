import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  // Dev server proxy — routes /api/* to the local backend during development.
  // In production (Vercel), set VITE_API_BASE_URL to the deployed backend URL instead.
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  build: {
    // No sourcemaps in production (keeps bundle size small and hides internals)
    sourcemap: false,
    // Raise the warning threshold slightly — leaflet + react-leaflet are large
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Split vendor chunks so the main app chunk stays small and browser caching works better
        // Note: Vite 8 (rolldown) requires manualChunks as a function
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/leaflet') || id.includes('node_modules/react-leaflet')) {
            return 'leaflet-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons-vendor';
          }
        }
      }
    }
  }
});

