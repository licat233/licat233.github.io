import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Validate the complete published Sitemap, not a hand-picked set of pages.
// This is a build-output audit. Search indexing and Rich Results eligibility
// still require the external Google tools and cannot be inferred from this run.
const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');
const origin = 'https://licat.xyz';
const text = name => readFile(path.join(dist, name), 'utf8');
function ensure(ok, message) {
  if (!ok) throw new Error('SEO_AUDIT_FAIL: ' + message);
}
function tags(html, tag) {
  return html.match(new RegExp('<' + tag + '\\b[^>]*>', 'gi')) || [];
}
function attrs(markup) {
  return Object.fromEntries([...markup.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(match => [match[1].toLowerCase(), match[3]]));
}
const sitemapIndex = await text('sitemap-index.xml');
ensure(sitemapIndex.includes('<loc>https://licat.xyz/sitemap-0.xml</loc>'),
  'Official Sitemap Index does not reference sitemap-0.xml');
const xml = await text('sitemap-0.xml');
ensure(!/<xhtml:link\b/.test(xml),
  'Sitemap should keep hreflang in page HTML rather than duplicate it in XML');
const urls = [...xml.matchAll(/<loc>(https:\/\/licat\.xyz\/[^<]*)<\/loc>/g)]
  .map(match => match[1].replaceAll('&amp;', '&'));
ensure(urls.length >= 60, 'Sitemap unexpectedly short');
ensure(new Set(urls).size === urls.length, 'Sitemap repeats canonical URLs');
const inbound = new Map(urls.map(url => [url, 0]));
let imageCount = 0, structuredCount = 0, linkCount = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname;
  ensure(pathname.endsWith('/'), 'noncanonical trailing slash: ' + url);
  const file = pathname.slice(1) + 'index.html';
  const html = await text(file);
  const head = html.split(/<\/head>/i)[0] || '';
  const htmlTag = tags(html, 'html')[0] || '';
  ensure(['zh-CN', 'en'].includes(attrs(htmlTag).lang), 'missing/invalid language: ' + url);
  ensure(/<title[^>]*>[^<]+<\/title>/i.test(head), 'missing title: ' + url);
  const description = tags(head, 'meta').find(tag => attrs(tag).name === 'description');
  ensure(Boolean(description && attrs(description).content?.trim()),
    'missing meta description: ' + url);
  const ogImages = tags(head, 'meta').filter(tag => attrs(tag).property === 'og:image');
  const twitterImages = tags(head, 'meta').filter(tag => attrs(tag).name === 'twitter:image');
  const twitterCards = tags(head, 'meta').filter(tag => attrs(tag).name === 'twitter:card');
  const expectedImage = origin + '/assets/licat-social.jpg';
  ensure(ogImages.length === 1 && attrs(ogImages[0]).content === expectedImage,
    'missing/duplicate/wrong Open Graph image: ' + url);
  ensure(twitterImages.length === 1 && attrs(twitterImages[0]).content === expectedImage,
    'missing/duplicate/wrong Twitter preview image: ' + url);
  ensure(twitterCards.length === 1 && attrs(twitterCards[0]).content === 'summary_large_image',
    'missing/wrong Twitter card type: ' + url);
  const ogTitles = tags(head, 'meta').filter(tag => attrs(tag).property === 'og:title');
  ensure(ogTitles.length === 1 && Boolean(attrs(ogTitles[0]).content),
    'Open Graph title is missing: ' + url);
  const canonicals = tags(head, 'link').filter(tag => attrs(tag).rel === 'canonical');
  ensure(canonicals.length === 1 && attrs(canonicals[0]).href === url,
    'canonical mismatch/duplicate: ' + url);
  ensure(!tags(head, 'meta').some(tag =>
      /noindex/i.test(attrs(tag).content || '') &&
      ['robots', 'googlebot'].includes(attrs(tag).name)),
    'unexpected noindex: ' + url);
  const headings = html.match(/<h1\b/gi) || [];
  ensure(headings.length === 1, 'expected exactly one H1: ' + url + ' found ' + headings.length);
  for (const image of tags(html, 'img')) {
    imageCount++;
    ensure(Object.hasOwn(attrs(image), 'alt'), 'image lacks alt attribute: ' + url);
  }
  const schemas = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match, i) => {
      try { return JSON.parse(match[1]); }
      catch (error) { throw new Error('SEO_AUDIT_FAIL: invalid JSON-LD: ' + url + ' script ' + i + ' ' + error); }
    });
  structuredCount += schemas.length;
  const crumbs = schemas.filter(schema => schema['@type'] === 'BreadcrumbList');
  const isHome = pathname === '/' || pathname === '/en/';
  if (isHome) ensure(crumbs.length === 0, 'homepage should not have a breadcrumb: ' + url);
  else {
    ensure(crumbs.length === 1, 'missing/duplicate BreadcrumbList: ' + url);
    const steps = crumbs[0].itemListElement;
    ensure(Array.isArray(steps) && steps.length >= 2 &&
      steps.every((step, i) => step.position === i + 1 && step.name && step.item) &&
      steps.at(-1).item === url, 'invalid breadcrumb path: ' + url);
    ensure(html.includes('class="seo-breadcrumbs"') ||
      html.includes('class="site-context"') ||
      html.includes('aria-label="面包屑导航"'),
      'visible breadcrumb missing: ' + url);
  }
  for (const tag of tags(html, 'a')) {
    const href = attrs(tag).href;
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
    let target;
    try { target = new URL(href, url); }
    catch { continue; }
    if (target.origin !== origin || target.pathname === pathname) continue;
    const canonicalTarget = origin + target.pathname;
    if (inbound.has(canonicalTarget)) {
      inbound.set(canonicalTarget, inbound.get(canonicalTarget) + 1);
      linkCount++;
    }
  }
}
const orphans = [...inbound].filter(([_, count]) => count === 0).map(([url]) => url);
ensure(orphans.length === 0, 'orphaned Sitemap page(s): ' + orphans.join(', '));
const full = await text('llms-full.txt');
ensure(full.startsWith('# Licat — Published Blog Full Text') &&
  full.includes('https://licat.xyz/blog/website-seo-geo-basics/'),
  'missing/invalid published blog Markdown bundle');
const articleUrls = urls.filter(url => /\/blog\/[^/]+\/$/.test(url));
const bundleUrls = [...full.matchAll(/^Canonical: (https:\/\/licat\.xyz\/[^\n]+)$/gm)].map(m => m[1]);
ensure(articleUrls.length === bundleUrls.length &&
  articleUrls.every(url => bundleUrls.includes(url)),
  'llms-full.txt must match only the published blog URLs');
const llms = await text('llms.txt');
ensure(llms.includes('https://licat.xyz/llms-full.txt'), 'llms.txt full bundle link missing');
const socialJpeg = await readFile(path.join(dist, 'assets/licat-social.jpg'));
ensure(socialJpeg.length > 10000 && socialJpeg[0] === 0xFF && socialJpeg[1] === 0xD8,
  'Social image is missing or not a valid JPEG');
console.log('SEO_SITEWIDE_AUDIT_PASS ' + JSON.stringify({
  pages: urls.length, canonical: urls.length, oneH1: urls.length, socialCards: urls.length,
  visibleBreadcrumbs: urls.length - 2, jsonLdScripts: structuredCount,
  imageAlts: imageCount, localLinks: linkCount, orphanPages: 0,
  publishedMarkdownArticles: bundleUrls.length,
}));

