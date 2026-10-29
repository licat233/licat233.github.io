import { i18n } from 'astro:config/server';
import type { Lang } from './site';

// Astro's configured locale list is the single route source of truth.
// An optional rest param emits the default locale at / and others at /en/, /de/...
export const localePaths = () => {
 if(!i18n)throw new Error('Astro i18n configuration is required');
 return i18n.locales.map(entry => {
  if(typeof entry!=='string')throw new Error('Expected flat Astro locale codes');
  const lang=entry as Lang;
  return {params:{locale:entry===i18n.defaultLocale?undefined:entry},props:{lang}};
 });
};
