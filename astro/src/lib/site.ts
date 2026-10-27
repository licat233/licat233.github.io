import entries from '../data/navigation.json';
export type Lang = 'zh' | 'en';
export type NavKey = 'home' | 'projects' | 'skills' | 'blog' | 'prompts';
export const origin = 'https://licat233.github.io';
interface NavItem {key:NavKey;zh:string;en:string;zhUrl:string;enUrl:string}
export const nav: readonly NavItem[] = entries as NavItem[];
export const localeUrl = (lang: Lang, key: NavKey) => nav.find(n => n.key === key)![lang === 'en' ? 'enUrl' : 'zhUrl'];
export const blogSlug = (id: string) =>
  id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-en$/, '');
