import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const hotlinkProtection = () => ({
  name: 'hotlink-protection',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url.startsWith('/assets/cards/')) {
        const dest = req.headers['sec-fetch-dest'];
        const site = req.headers['sec-fetch-site'];
        const referer = req.headers['referer'];
        
        // Ensure the request comes from our own app
        const isDirectAccess = dest === 'document' || dest === 'image' || site === 'cross-site';
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
})
