import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Lang } from './site';
const root = fileURLToPath(new URL('../../../', import.meta.url));
export async function readLegacyPage(kind: 'home'|'prompts', lang: Lang) {
  const route = kind === 'home' ? (lang === 'en' ? 'en/index.html':'index.html') : (lang === 'en'?'en/prompts/index.html':'prompts/index.html');
  const source = (await readFile(path.join(root, route), 'utf8')).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
  const head = source.match(/<head>([\s\S]*?)<\/head>/i)?.[1];
  const body = source.match(/<body([^>]*)>([\s\S]*?)<\/body>/i);
  if(!head||!body) throw new Error('Legacy document missing head/body: '+route);
  const parts = body[2].split(/\{%\s*include site-header\.html[^%]*%\}/);
  if(parts.length !== 2) throw new Error('Legacy header token missing: '+route);
  const section = parts[1].split(/\{%\s*include home-sections\.html[^%]*%\}/);
  if (kind==='home' && section.length!==2) throw new Error('Homepage local navigation missing: '+route);
  if(kind==='prompts' && section.length!==1) throw new Error('Unexpected prompt sections: '+route);
  // Head and body artwork/scripts stay byte-for-byte until each interaction is ported.
  return {head,bodyAttrs:body[1],beforeHeader:parts[0],beforeSection:section[0],afterSection:section[1]||''};
}
