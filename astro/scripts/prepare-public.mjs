/* Compatibility bridge: keep existing published assets and independent microsites.
 * Does not build Jekyll. Later replace raw microsites with Astro layouts one by one. */
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const publicDir=path.resolve(here,'../public');
await rm(publicDir,{recursive:true,force:true});
await mkdir(publicDir,{recursive:true});
// The repository groups standalone sites in public-sites/, but their published
// URL paths remain unchanged (e.g. public-sites/eao/ -> /eao/).
const publicSites=['eao','toolscout','ai-writing-audit','armor-memory',
 'disable-macos-auto-updates','greenram','opencore-h81',
 'lottery-calculate','demo','previews'];
const sections=['assets','prompts','en/prompts/content','skills'];
for(const dir of [...sections,...publicSites]){
 const dest=path.join(publicDir,dir);
 const source=publicSites.includes(dir)?path.join(root,'public-sites',dir):path.join(root,dir);
 await mkdir(path.dirname(dest),{recursive:true});
 await cp(source,dest,{recursive:true});
}
// Only retained assets and independently published project pages are copied.
await cp(path.join(root,'favicon.ico'),path.join(publicDir,'favicon.ico'));
await cp(path.join(root,'llms.txt'),path.join(publicDir,'llms.txt'));
// The Astro-owned JS is a pure interaction controller; SSR and client both read
// the same single prompt catalogue from the Astro page (not legacy JS literals).
await cp(path.join(root,'astro/src/client/prompt-library.js'),
         path.join(publicDir,'prompts/prompt-library.js'));
const entries=JSON.parse(await readFile(new URL('../src/data/navigation.json',import.meta.url),'utf8'));
const zh=JSON.parse(await readFile(new URL('../src/i18n/zh.json',import.meta.url),'utf8'));
const en=JSON.parse(await readFile(new URL('../src/i18n/en.json',import.meta.url),'utf8'));
const links=entries.map(item=>({
 ...item,zh:zh.navigation[item.key],en:en.navigation[item.key]
}));
// Independent legacy HTML pages are copied outside Astro's generated routes.
const legacyLocalizedUrl=(lang,key)=>'/' + (lang==='en'?'en/':'') +
  (key==='home'?'':key+'/');
function siteContext(lang,project){
 const en=lang==='en';
 const home=legacyLocalizedUrl(lang,'home');
 const projects=legacyLocalizedUrl(lang,'projects');
 return `<nav class="site-context" aria-label="${en?'Site navigation and project location':'全站导航与项目位置'}"><div class="site-context__path"><a href="${home}">Licat</a><span aria-hidden="true">›</span><a href="${projects}">${en?'Projects':'项目'}</a><span aria-hidden="true">›</span><strong>${project.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}</strong></div><div class="site-context__links">${links.filter(link=>!link.parent).map(link=>`<a href="${legacyLocalizedUrl(lang,link.key)}"${link.key==='projects'?' class="is-section"':''}>${en?link.en:link.zh}</a>`).join('')}</div></nav>`;
}

// The Astro pages already use this GTM container. Standalone project pages
// must use it too so their traffic is not missing from site-wide analytics.
// Apply only to the independently published landing pages, not demos/previews.
const analyticsHead = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-W68HGFLR');</script>
<!-- End Google Tag Manager -->`;
const analyticsBody = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W68HGFLR"
height="0" width="0" style="display:none;visibility:hidden"
title="Google Tag Manager"></iframe></noscript>
<!-- End Google Tag Manager -->`;
function addAnalytics(html) {
 if (/GTM-[A-Z0-9]+/.test(html)) return html;
 if (!/<\/head>/i.test(html) || !/<body\b[^>]*>/i.test(html)) throw new Error('Standalone project lacks a complete document');
 return html.replace(/<\/head>/i, analyticsHead + '\n</head>')
            .replace(/<body\b[^>]*>/i, match => match + '\n' + analyticsBody);
}

const microsites=['eao','toolscout','ai-writing-audit','armor-memory','disable-macos-auto-updates','greenram','opencore-h81'];
for(const dir of microsites){
 const pending=[path.join(publicDir,dir)];
 while(pending.length){
  const d=pending.pop();
  const {readdir}=await import('node:fs/promises');
  for(const ent of await readdir(d,{withFileTypes:true})){
   const p=path.join(d,ent.name);
   if(ent.isDirectory())pending.push(p);
   if(!ent.isFile() || !p.endsWith('.html'))continue;
   let html=await readFile(p,'utf8');
   if(html.startsWith('---\n'))html=html.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/,'');
   html=html.replace(/\{%\s*include site-context\.html\s+lang=['"]([^'"]+)['"]\s+project=['"]([^'"]+)['"]\s*%\}/g,(_m,lang,project)=>siteContext(lang,project));
   if(/\{%\s*include /.test(html))throw Error('Unresolved legacy Liquid include: '+p);
   const landing=path.relative(path.join(publicDir,dir),p).replaceAll(path.sep,'/');
   if(['index.html','zh/index.html','en/index.html'].includes(landing) &&
      !/<meta\b[^>]*name=['\"]robots['\"][^>]*content=['\"][^'\"]*noindex/i.test(html)) {
     html=addAnalytics(html);
   }
   await writeFile(p,html);
  }
 }
}
console.log('Prepared compatibility assets and independent project pages (Ruby/Jekyll not used).');
