import resourceRecords from '../data/resources.json';
import resourceCategoryRecords from '../data/resource-categories.json';
import resourceCollectionRecords from '../data/resource-collections.json';

export const RESOURCE_STATUSES = [
  'candidate', 'researching', 'approved', 'published', 'needs-review', 'archived',
] as const;
export type ResourceStatus = typeof RESOURCE_STATUSES[number];
export type ResourcePricing = 'free' | 'freemium' | 'paid' | 'free-trial' | 'open-source' | 'unknown';
export type ResourceAvailability = 'global' | 'region-limited' | 'restricted' | 'unknown';
export type ResourceType =
  | 'web-app' | 'desktop-app' | 'mobile-app' | 'browser-extension' | 'api'
  | 'open-source-project' | 'library' | 'course' | 'documentation' | 'community'
  | 'dataset' | 'service' | 'other' | 'unknown';

export interface Resource {
  id: string;
  slug: string;
  name: { en: string; 'zh-CN': string };
  aliases: string[];
  url: string;
  description: { en: string; 'zh-CN': string };
  category: string | null;
  subcategory: string | null;
  tags: string[];
  resourceType: ResourceType;
  pricing: ResourcePricing;
  platforms: string[];
  interfaceLanguages: string[];
  availability: ResourceAvailability;
  featured: boolean;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  iconUrl?: string | null;
}

export interface ResourceCollection {
  slug: string;
  name: { en: string; 'zh-CN': string };
  description: { en: string; 'zh-CN': string };
  resourceIds: string[];
}

const pricingValues = new Set<ResourcePricing>([
  'free', 'freemium', 'paid', 'free-trial', 'open-source', 'unknown',
]);
const availabilityValues = new Set<ResourceAvailability>([
  'global', 'region-limited', 'restricted', 'unknown',
]);
const typeValues = new Set<ResourceType>([
  'web-app', 'desktop-app', 'mobile-app', 'browser-extension', 'api',
  'open-source-project', 'library', 'course', 'documentation', 'community',
  'dataset', 'service', 'other', 'unknown',
]);
const statusValues = new Set<string>(RESOURCE_STATUSES);
const categoryMap = new Map(
  (resourceCategoryRecords as Array<{id:string;subcategories:Array<{id:string}>}>)
    .map(category => [category.id, new Set(category.subcategories.map(item => item.id))]),
);
const sensitiveQueryKey = /^(token|access_token|refresh_token|api_key|apikey|client_secret|password|passwd|session|sessionid|auth|authorization|secret|signature|sig|key|code)$/i;

function isPrivateOrLocalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\\[|\\]$/g, '');
  if (/^(localhost|.+\\.localhost|.+\\.local|.+\\.lan|.+\\.internal|.+\\.home|.+\\.test|.+\\.example|.+\\.invalid)$/i.test(host)) return true;
  if (/^\\d{1,3}(?:\\.\\d{1,3}){3}$/.test(host)) {
    const [a, b] = host.split('.').map(Number);
    return a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  return host === '::1' || (host.includes(':') && (host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')));
}

function requireText(value: unknown, field: string, allowEmpty = false): asserts value is string {
  if (typeof value !== 'string' || (!allowEmpty && !value.trim())) {
    throw new Error('Invalid resource field: ' + field);
  }
}

function validDate(value: unknown, field: string): asserts value is string {
  requireText(value, field);
  if (!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error('Invalid resource date: ' + field + ' (' + value + ')');
  }
}

/** Conservative URL normalization: remove known tracking parameters, keep functional query/hash data. */
export function normalizeResourceUrl(raw: string): string {
  const url = new URL(raw.trim());
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('Resource URLs must be credential-free HTTP(S) URLs: ' + raw);
  }
  for (const key of [...url.searchParams.keys()]) {
    if (/^(utm_.+|gclid|dclid|fbclid|msclkid|mc_cid|mc_eid|_hsenc|_hsmi|igshid|ref_src|ref_url|mkt_tok)$/i.test(key)) {
      url.searchParams.delete(key);
    }
  }
  url.searchParams.sort();
  if (isPrivateOrLocalHost(url.hostname)) throw new Error('Private or local resource host is not publishable: ' + url.hostname);
  if ([...url.searchParams.keys()].some(key => sensitiveQueryKey.test(key))) {
    throw new Error('Resource URL contains a sensitive query parameter: ' + raw);
  }
  if (url.pathname === '') url.pathname = '/';
  return url.toString();
}

export function validateResourceRecords(input: unknown): asserts input is Resource[] {
  if (!Array.isArray(input)) throw new Error('Resources data must be a JSON array.');
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const urls = new Set<string>();

  for (const [index, value] of input.entries()) {
    const item = value as Resource;
    const prefix = 'resources[' + index + ']';
    requireText(item?.id, prefix + '.id');
    requireText(item?.slug, prefix + '.slug');
    if (ids.has(item.id) || slugs.has(item.slug)) {
      throw new Error('Duplicate resource id or slug: ' + item.id + ' / ' + item.slug);
    }
    ids.add(item.id);
    slugs.add(item.slug);
    if (!/^[a-z0-9][a-z0-9_-]{1,79}$/.test(item.id) ||
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)) {
      throw new Error('Unsafe resource id or slug: ' + item.id + ' / ' + item.slug);
    }

    requireText(item.url, prefix + '.url');
    const normalized = normalizeResourceUrl(item.url);
    if (normalized !== item.url) throw new Error('Resource URL is not normalized: ' + item.url);
    if (urls.has(normalized)) throw new Error('Duplicate normalized resource URL: ' + normalized);
    urls.add(normalized);

    requireText(item.name?.en, prefix + '.name.en', item.status !== 'published');
    requireText(item.name?.['zh-CN'], prefix + '.name.zh-CN', item.status !== 'published');
    requireText(item.description?.en, prefix + '.description.en', item.status !== 'published');
    requireText(item.description?.['zh-CN'], prefix + '.description.zh-CN', item.status !== 'published');
    const lists = {
      aliases: item.aliases, tags: item.tags,
      platforms: item.platforms, interfaceLanguages: item.interfaceLanguages,
    };
    for (const [field, values] of Object.entries(lists)) {
      if (!Array.isArray(values) || !values.every(value => typeof value === 'string' && value.trim()) ||
          new Set(values).size !== values.length) {
        throw new Error('Resource list must contain unique non-empty strings: ' + item.id + ' / ' + field);
      }
    }
    if (item.category !== null && !categoryMap.has(item.category)) {
      throw new Error('Unknown resource category: ' + item.id + ' / ' + item.category);
    }
    if (item.subcategory !== null &&
        (!item.category || !categoryMap.get(item.category)?.has(item.subcategory))) {
      throw new Error('Unknown resource subcategory: ' + item.id + ' / ' + item.subcategory);
    }
    if (!typeValues.has(item.resourceType) || !pricingValues.has(item.pricing) ||
        !availabilityValues.has(item.availability) || !statusValues.has(item.status)) {
      throw new Error('Invalid resource classification: ' + item.id);
    }
    if (typeof item.featured !== 'boolean') throw new Error('Resource featured must be boolean: ' + item.id);
    if (item.featured && item.status !== 'published') throw new Error('Only published resources can be featured: ' + item.id);
    validDate(item.createdAt, prefix + '.createdAt');
    validDate(item.updatedAt, prefix + '.updatedAt');
    if (Date.parse(item.updatedAt) < Date.parse(item.createdAt)) throw new Error('Resource updatedAt predates createdAt: ' + item.id);
    if (item.verifiedAt !== null) {
      validDate(item.verifiedAt, prefix + '.verifiedAt');
      if (Date.parse(item.verifiedAt) > Date.parse(item.updatedAt)) throw new Error('Resource verification date is later than updatedAt: ' + item.id);
    }
    if (item.iconUrl) {
      const icon = new URL(item.iconUrl);
      if (icon.protocol !== 'https:' || isPrivateOrLocalHost(icon.hostname)) throw new Error('Resource icon must use a public HTTPS URL: ' + item.id);
    }
    if (item.status === 'published') {
      const resourceUrl = new URL(item.url);
      if (!item.category || item.resourceType === 'unknown' || item.pricing === 'unknown' ||
          item.availability === 'unknown' || !item.verifiedAt || resourceUrl.protocol !== 'https:' ||
          item.platforms.length === 0 || item.interfaceLanguages.length === 0) {
        throw new Error('Published resources need verified category, type, pricing, platform, language, availability and HTTPS URL: ' + item.id);
      }
      if (!item.name.en.trim() || !item.name['zh-CN'].trim() ||
          !item.description.en.trim() || !item.description['zh-CN'].trim()) {
        throw new Error('Published resources need complete English and Chinese names/descriptions: ' + item.id);
      }
    }
  }
}

validateResourceRecords(resourceRecords);

export const resourceCategories = resourceCategoryRecords;
export const getPublishedResources = (): Resource[] =>
  (resourceRecords as Resource[]).filter(item => item.status === 'published');

export function getPublishedCollections(resources = getPublishedResources()) {
  const byId = new Map(resources.map(item => [item.id, item]));
  return (resourceCollectionRecords as ResourceCollection[])
    .filter(collection => Array.isArray(collection.resourceIds) &&
      collection.resourceIds.length >= 3 &&
      collection.resourceIds.every(id => byId.has(id)))
    .map(collection => ({
      ...collection,
      resources: collection.resourceIds.map(id => byId.get(id)!),
    }));
}
