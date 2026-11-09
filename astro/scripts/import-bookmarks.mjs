#!/usr/bin/env node
/**
 * Import a Chrome/Netscape bookmark export into a PRIVATE review workspace.
 * This script never writes candidate links into src/data/resources.json.
 *
 * Usage:
 *   npm run resources:import -- --input /path/to/bookmarks.html
 *   node scripts/import-bookmarks.mjs --input /path/to/bookmarks.html --output-dir .local/review
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
function argument(name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] ?? fallback : fallback;
}
const inputPath = argument('--input');
if (!inputPath) {
  console.error('Missing --input <Chrome bookmarks HTML file>.');
  process.exit(1);
}
const outputDir = path.resolve(root, argument('--output-dir', '.local/resources-review'));
const html = await readFile(path.resolve(inputPath), 'utf8');
const importedAt = new Date().toISOString();

const namedEntities = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘',
  rdquo: '”', ldquo: '“', copy: '©', reg: '®', trade: '™',
};
function decodeEntities(value) {
  return String(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const hex = entity[1]?.toLowerCase() === 'x';
      const code = Number.parseInt(entity.slice(hex ? 2 : 1), hex ? 16 : 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return namedEntities[entity.toLowerCase()] ?? match;
  });
}
function textContent(value) {
  return decodeEntities(String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}
function attributes(source) {
  const result = {};
  const pattern = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  for (const match of source.matchAll(pattern)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return result;
}
function parseBookmarks(source) {
  const output = [];
  const folders = [];
  let pendingFolder = null;
  const tokens = /<H3\b([^>]*)>([\s\S]*?)<\/H3\s*>|<DL\b[^>]*>|<\/DL\s*>|<A\b([^>]*)>([\s\S]*?)<\/A\s*>/gi;
  for (const match of source.matchAll(tokens)) {
    const token = match[0];
    if (match[1] !== undefined) {
      pendingFolder = textContent(match[2]);
      continue;
    }
    if (/^<DL\b/i.test(token)) {
      if (pendingFolder !== null) {
        folders.push(pendingFolder);
        pendingFolder = null;
      }
      continue;
    }
    if (/^<\/DL/i.test(token)) {
      if (folders.length) folders.pop();
      pendingFolder = null;
      continue;
    }
    const attrs = attributes(match[3] || '');
    output.push({
      title: textContent(match[4] || ''),
      url: attrs.href || '',
      addDate: attrs.add_date || null,
      icon: attrs.icon || null,
      folders: [...folders],
    });
  }
  return output;
}
function normalizeUrl(raw) {
  try {
    const url = new URL(raw.trim());
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return null;
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_.+|gclid|dclid|fbclid|msclkid|mc_cid|mc_eid|_hsenc|_hsmi|igshid|ref_src|ref_url|mkt_tok)$/i.test(key)) {
        url.searchParams.delete(key);
      }
    }
    url.searchParams.sort();
    if (!url.pathname) url.pathname = '/';
    return url.toString();
  } catch {
    return null;
  }
}
function privateOrLocalHost(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (/^(localhost|.+\.localhost|.+\.local|.+\.lan|.+\.internal|.+\.home)$/i.test(host)) return true;
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(host)) {
    const octets = host.split('.').map(Number);
    const [a, b] = octets;
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  return host === '::1' || (host.includes(':') && (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')));
}
function reviewFlags(bookmark, normalized) {
  const flags = [];
  if (!normalized) flags.push('non-public-or-invalid-url');
  if (!bookmark.title) flags.push('missing-bookmark-title');
  if (!normalized) return flags;
  const url = new URL(normalized);
  if (privateOrLocalHost(url.hostname)) flags.push('private-or-local-host');
  if ([...url.searchParams.keys()].some(key =>
    /^(token|access_token|refresh_token|api_key|apikey|client_secret|password|passwd|session|sessionid|auth|authorization|secret|signature|sig|key|code)$/i.test(key)
  )) flags.push('sensitive-query-parameter');
  if (/(^|\.)(docs\.google\.com|drive\.google\.com|notion\.so|slack\.com|sharepoint\.com|onedrive\.live\.com|dropbox\.com)$/i.test(url.hostname)) {
    flags.push('possible-private-workspace-link');
  }
  if (url.protocol !== 'https:') flags.push('http-not-https');
  return flags;
}
function stableId(url, title, index) {
  return 'res-' + createHash('sha256').update([url, title, index].join('\\0')).digest('hex').slice(0, 12);
}
function slugify(title, host, id) {
  const slug = String(title || host || 'resource').toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  return (slug || 'resource') + '-' + id.slice(-6);
}
function dateFromAddDate(value) {
  if (!value || !/^\d+$/.test(value)) return importedAt;
  const date = new Date(Number(value) * 1000);
  return Number.isNaN(date.getTime()) ? importedAt : date.toISOString();
}
function csvCell(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return '"' + text.replaceAll('"', '""') + '"';
}

const bookmarks = parseBookmarks(html);
const seen = new Map();
const candidates = bookmarks.map((bookmark, index) => {
  const normalizedUrl = normalizeUrl(bookmark.url);
  const id = stableId(normalizedUrl || bookmark.url, bookmark.title, index);
  const flags = reviewFlags(bookmark, normalizedUrl);
  const duplicateOf = normalizedUrl && seen.has(normalizedUrl) ? seen.get(normalizedUrl) : null;
  if (normalizedUrl && !seen.has(normalizedUrl)) seen.set(normalizedUrl, id);
  const host = normalizedUrl ? new URL(normalizedUrl).hostname : '';
  return {
    id,
    slug: slugify(bookmark.title, host, id),
    name: { en: bookmark.title || host || 'Untitled bookmark', 'zh-CN': bookmark.title || host || '未命名书签' },
    aliases: [],
    url: normalizedUrl || bookmark.url,
    description: { en: '', 'zh-CN': '' },
    category: null,
    subcategory: null,
    tags: [],
    resourceType: 'unknown',
    pricing: 'unknown',
    platforms: [],
    interfaceLanguages: [],
    availability: 'unknown',
    featured: false,
    status: flags.length || duplicateOf ? 'needs-review' : 'candidate',
    createdAt: dateFromAddDate(bookmark.addDate),
    updatedAt: importedAt,
    verifiedAt: null,
    iconUrl: null,
    sourceFolders: bookmark.folders,
    sourceTitle: bookmark.title,
    sourceUrl: bookmark.url,
    flags,
    duplicateOf,
  };
});

await mkdir(outputDir, { recursive: true });
const jsonPath = path.join(outputDir, 'resources-candidates.json');
const csvPath = path.join(outputDir, 'resources-review.csv');
await writeFile(jsonPath, JSON.stringify(candidates, null, 2) + '\n', 'utf8');
const columns = ['id', 'sourceTitle', 'sourceUrl', 'url', 'sourceFolders', 'status', 'duplicateOf', 'flags'];
const csv = [columns.map(csvCell).join(','), ...candidates.map(item =>
  columns.map(column => csvCell(item[column])).join(',')
)].join('\n') + '\n';
await writeFile(csvPath, csv, 'utf8');

const duplicateCount = candidates.filter(item => item.duplicateOf).length;
const flaggedCount = candidates.filter(item => item.flags.length).length;
console.log(JSON.stringify({
  input: path.resolve(inputPath),
  totalBookmarks: candidates.length,
  uniqueNormalizedUrls: seen.size,
  duplicatesRetainedForReview: duplicateCount,
  flaggedForManualReview: flaggedCount,
  candidateJson: jsonPath,
  reviewCsv: csvPath,
}, null, 2));
