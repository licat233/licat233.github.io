import entries from '../data/navigation.json';
import { getRelativeLocaleUrl } from 'astro:i18n';

export type Lang = 'zh' | 'en';
export type NavKey = 'home' | 'projects' | 'ai' | 'skills' | 'blog' | 'prompts';
export const origin = 'https://licat233.github.io';

// Astro's configured i18n router owns all Astro page paths. Keep this
// catalogue limited to labels + keys: no hardcoded duplicate localized URLs.
export const localizedPath = (lang: Lang, ...parts: string[]): string =>
  getRelativeLocaleUrl(lang, parts.filter(Boolean).join('/'));

export const localeUrl = (lang: Lang, key: NavKey): string =>
  localizedPath(lang, key === 'home' ? '' : key);

type Entry = { key: NavKey; zh: string; en: string; parent?: NavKey };
export const nav = (entries as Entry[]).map(item => ({
  ...item,
  zhUrl: localeUrl('zh', item.key),
  enUrl: localeUrl('en', item.key),
}));

// Parentage is content navigation only: old stable URLs stay unchanged.
export const primaryNav = nav.filter(item => !item.parent);
export const aiChildren = nav.filter(item => item.parent === 'ai');

export const blogSlug = (id: string) =>
  id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-en$/, '');
