import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://www.socipizza.com',
  trailingSlash: 'never',
  build: { format: 'file' },
});
