
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env': {
      VITE_SHOPIFY_DOMAIN: JSON.stringify(process.env.VITE_SHOPIFY_DOMAIN || ''),
      VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN: JSON.stringify(process.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN || ''),
      VITE_GEMINI_API_KEY: JSON.stringify(process.env.VITE_GEMINI_API_KEY || '')
    }
  }
});
