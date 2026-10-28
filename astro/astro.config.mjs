import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://licat233.github.io',
  output: 'static',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: { prefixDefaultLocale: false },
  },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
