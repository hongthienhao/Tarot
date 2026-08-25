import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const hotlinkProtection = () => ({
  name: 'hotlink-protection',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/assets/cards/')) {
        // Allow all local dev traffic to prevent broken images during development
        const host = req.headers.host || '';
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
          return next();
        }

        const dest = req.headers['sec-fetch-dest'];
        const site = req.headers['sec-fetch-site'];
        const referer = req.headers['referer'];
        
        // Ensure the request comes from our own app
        const isDirectAccess = dest === 'document' || site === 'cross-site';
        const isMissingReferer = !referer;
        
        if (isDirectAccess || isMissingReferer) {
          res.statusCode = 403;
          res.end('Access Denied: Direct asset access is forbidden.');
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    hotlinkProtection(),
  ],
  build: {
    // Target modern Safari (iOS 14+) for ES2020+ support while keeping broad compat
    target: ['es2020', 'safari14'],
    // Increase chunk warning threshold (framer-motion is large by design)
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        // Manual chunk splitting to improve caching and parallel loading
        // NOTE: Vite 8 (rolldown) requires manualChunks as a function, not object
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Google OAuth — loaded lazily, separate chunk so it doesn't block initial paint
          if (id.includes('node_modules/@react-oauth') || id.includes('node_modules/jwt-decode')) {
            return 'vendor-oauth';
          }
          // Axios — API client, separate from app code
          if (id.includes('node_modules/axios')) {
            return 'vendor-axios';
          }
        },
      },
    },
  },
})
