import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://licat233.github.io',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
});
