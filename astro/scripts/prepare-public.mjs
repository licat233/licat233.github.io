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
const sections=['assets','prompts','en/prompts/content','skills','eao','toolscout',
 'ai-writing-audit','armor-memory','disable-macos-auto-updates','greenram',
 'opencore-h81','lottery-calculate','armor'];
for(const dir of sections){
 const dest=path.join(publicDir,dir);
 await mkdir(path.dirname(dest),{recursive:true});
 await cp(path.join(root,dir),dest,{recursive:true});
}
// Astro owns the category pages and prompt library; copy only prompt data/CSS/JS.
for(const remove of ['prompts/index.html','prompts/nav.css','en/prompts/index.html','skills/index.html']){
 await rm(path.join(publicDir,remove),{force:true});
}
await cp(path.join(root,'favicon.ico'),path.join(publicDir,'favicon.ico'));
const links=[
 {key:'home',zh:'首页',en:'Home',zhUrl:'/',enUrl:'/en/'},
 {key:'projects',zh:'项目',en:'Projects',zhUrl:'/projects/',enUrl:'/en/projects/'},
 {key:'skills',zh:'Skills',en:'Skills',zhUrl:'/skills/',enUrl:'/en/skills/'},
 {key:'blog',zh:'博客',en:'Blog',zhUrl:'/blog/',enUrl:'/en/blog/'},
 {key:'prompts',zh:'提示词',en:'Prompts',zhUrl:'/prompts/',enUrl:'/en/prompts/'},
];
function siteContext(lang,project){
 const en=lang==='en';
 const home=en?'/en/':'/';
 const projects=en?'/en/projects/':'/projects/';
 return `<nav class="site-context" aria-label="${en?'Site navigation and project location':'全站导航与项目位置'}"><div class="site-context__path"><a href="${home}">Licat</a><span aria-hidden="true">›</span><a href="${projects}">${en?'Projects':'项目'}</a><span aria-hidden="true">›</span><strong>${project.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}</strong></div><div class="site-context__links">${links.map(link=>`<a href="${en?link.enUrl:link.zhUrl}"${link.key==='projects'?' class="is-section"':''}>${en?link.en:link.zh}</a>`).join('')}</div></nav>`;
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
   await writeFile(p,html);
  }
 }
}
console.log('Prepared compatibility assets and independent project pages (Ruby/Jekyll not used).');
