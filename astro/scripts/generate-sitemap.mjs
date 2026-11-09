import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(here, '../dist');
const origin = 'https://licat.xyz';
const pages = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(absolute);
      continue;
    }
    if (!entry.isFile() || entry.name !== 'index.html') continue;

    const html = await readFile(absolute, 'utf8');
    if (/<meta\b[^>]*name=["'](?:robots|googlebot)["'][^>]*content=["'][^"']*noindex/i.test(html)) continue;

    const canonical = /<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1];
    if (!canonical) continue;
    let canonicalUrl;
    try { canonicalUrl = new URL(canonical, origin); } catch { continue; }
    if (canonicalUrl.origin !== origin || canonicalUrl.search || canonicalUrl.hash) continue;

    const alternates = [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi)]
      .map(match => ({ lang: match[1], href: match[2] }))
      .filter(item => {
        try { return new URL(item.href, origin).origin === origin; }
        catch { return false; }
      });
    pages.push({ loc: canonicalUrl.href, alternates });
  }
}

function xml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

await walk(dist);
const unique = new Map(pages.map(page => [page.loc, page]));
const urls = [...unique.values()].sort((a, b) => a.loc.localeCompare(b.loc));
const body = urls.map(page => {
  const links = [...new Map(page.alternates.map(item => [item.lang, item])).values()]
    .map(item => '    <xhtml:link rel="alternate" hreflang="' + xml(item.lang) +
      '" href="' + xml(item.href) + '" />').join('\n');
  return '  <url>\n    <loc>' + xml(page.loc) + '</loc>' +
    (links ? '\n' + links : '') + '\n  </url>';
}).join('\n');

const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
  'xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + body +
  '\n</urlset>\n';
await writeFile(path.join(dist, 'sitemap.xml'), sitemap, 'utf8');
await writeFile(path.join(dist, 'robots.txt'),
  'User-agent: *\nAllow: /\nSitemap: ' + origin + '/sitemap.xml\n', 'utf8');
console.log('SITEMAP_GENERATED:', urls.length, 'canonical pages; noindex pages excluded.');
