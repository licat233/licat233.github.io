export type Lang = 'zh' | 'en';
export type NavKey = 'home' | 'projects' | 'skills' | 'blog' | 'prompts';
export const origin = 'https://licat233.github.io';
export const nav = [
  { key: 'home', zh: '首页', en: 'Home', zhUrl: '/', enUrl: '/en/' },
  { key: 'projects', zh: '项目', en: 'Projects', zhUrl: '/projects/', enUrl: '/en/projects/' },
  { key: 'skills', zh: 'Skills', en: 'Skills', zhUrl: '/skills/', enUrl: '/en/skills/' },
  { key: 'blog', zh: '博客', en: 'Blog', zhUrl: '/blog/', enUrl: '/en/blog/' },
  { key: 'prompts', zh: '提示词', en: 'Prompts', zhUrl: '/prompts/', enUrl: '/en/prompts/' },
] as const;
export const localeUrl = (lang: Lang, key: NavKey) => nav.find(n => n.key === key)![lang === 'en' ? 'enUrl' : 'zhUrl'];
export const blogSlug = (id: string) =>
  id.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-en$/, '');
