import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://licat.xyz',
  output: 'static',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: { prefixDefaultLocale: false },
  },
  experimental: { redirectPage: true },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
