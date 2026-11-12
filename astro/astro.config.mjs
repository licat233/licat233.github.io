import path from 'node:path';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const here = path.dirname(fileURLToPath(import.meta.url));
const site = 'https://licat.xyz';
const siteOrigin = new URL(site).origin;
const publicDir = path.resolve(here, 'public');
const distDir = path.resolve(here, 'dist');

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
      .map((match) => [match[1].toLowerCase(), match[3]])
  );
}

function isNoindex(html) {
  const head = html.split(/<\/head>/i, 1)[0] ?? html;
  const metaTags = head.match(/<meta\b[^>]*>/gi) ?? [];
  return metaTags.some((tag) => {
    const meta = attributes(tag);
    return ['robots', 'googlebot'].includes(meta.name?.toLowerCase()) &&
      /\bnoindex\b/i.test(meta.content ?? '');
  });
}

function canonicalUrl(html) {
  const head = html.split(/<\/head>/i, 1)[0] ?? html;
  const linkTags = head.match(/<link\b[^>]*>/gi) ?? [];
  const canonical = linkTags
    .map(attributes)
    .find((link) => link.rel?.toLowerCase().split(/\s+/).includes('canonical'))?.href;
  if (!canonical) return null;

  try {
    const url = new URL(canonical, site);
    if (url.origin !== siteOrigin || url.search || url.hash) return null;
    return url.href;
  } catch {
    return null;
  }
}

function isIndexableCanonicalPage(html, expectedUrl) {
  return !isNoindex(html) && canonicalUrl(html) === expectedUrl;
}

// Astro's integration discovers Astro routes. Register independently built
// public microsites through its documented customPages option.
function collectPublicPages(directory = publicDir) {
  if (!existsSync(directory)) return [];

  const pages = [];
  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (!entry.isFile() || entry.name !== 'index.html') continue;

      const relative = path.relative(publicDir, path.dirname(file)).split(path.sep).join('/');
      const pathname = relative ? `/${relative}/` : '/';
      const url = new URL(pathname, site).href;
      if (isIndexableCanonicalPage(readFileSync(file, 'utf8'), url)) pages.push(url);
    }
  }

  walk(directory);
  return [...new Set(pages)];
}

// Keep only emitted, indexable pages whose declared canonical is their own URL.
// This excludes redirect aliases and noindex pages without reimplementing XML.
function filterSitemapPage(page) {
  let url;
  try {
    url = new URL(page);
  } catch {
    return false;
  }
  if (url.origin !== siteOrigin || url.search || url.hash || !url.pathname.endsWith('/')) return false;

  let relative;
  try {
    relative = decodeURIComponent(url.pathname.slice(1));
  } catch {
    return false;
  }
  const file = path.resolve(distDir, relative, 'index.html');
  const fromDist = path.relative(distDir, file);
  if (fromDist.startsWith('..') || path.isAbsolute(fromDist) || !existsSync(file)) return false;

  return isIndexableCanonicalPage(readFileSync(file, 'utf8'), url.href);
}

export default defineConfig({
  site,
  output: 'static',
  i18n: {
    locales: ['zh', 'en'],
    defaultLocale: 'zh',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      customPages: collectPublicPages(),
      filter: filterSitemapPage,
    }),
  ],
  experimental: { redirectPage: true },
  trailingSlash: 'always',
  build: { format: 'directory' },
});
