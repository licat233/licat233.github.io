import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const core=[
 ['index.html','zh','home'],['en/index.html','en','home'],
 ['projects/index.html','zh','projects'],['en/projects/index.html','en','projects'],
 ['skills/index.html','zh','skills'],['en/skills/index.html','en','skills'],
 ['blog/index.html','zh','blog'],['en/blog/index.html','en','blog'],
 ['prompts/index.html','zh','prompts'],['en/prompts/index.html','en','prompts'],
 ['blog/publish-markdown-notes/index.html','zh','blog'],
 ['en/blog/publish-markdown-notes/index.html','en','blog'],
 ['blog/website-seo-geo-basics/index.html','zh','blog'],
 ['blog/advanced-seo-geo-guide/index.html','zh','blog'],
];
const siteKeys=['home','projects','skills','blog','prompts'];
const routes=(lang)=>[lang==='en'?'/en/':'/',...siteKeys.slice(1).map(k=>(lang==='en'?'/en/':'/')+k+'/')];
function read(rel){return readFile(path.join(root,rel),'utf8');}
function assert(ok,message){if(!ok)throw Error(message)}
function hrefs(block){return [...block.matchAll(/<a\s[^>]*href="([^"]+)"[^>]*class="[^"]*nav-pill[^"]*"|<a\s[^>]*class="[^"]*nav-pill[^"]*"[^>]*href="([^"]+)"/g)].map(m=>m[1]||m[2]);}
for(const [filename,lang,active] of core){
 const html=await read(filename);
 assert(html.length>450,'Suspiciously empty '+filename);
 assert(!/\{%\s*include /.test(html),'Unresolved Liquid '+filename);
 assert(html.includes('lang="'+(lang==='en'?'en':'zh-CN')+'"'),'Wrong HTML language '+filename);
 const canon='https://licat233.github.io/'+filename.replace(/index\.html$/,'');
 assert(html.includes('rel="canonical" href="'+canon+'"'),'Wrong canonical '+filename);
 const nav=html.match(/<div class="nav-links">([\s\S]*?)<\/div>/)?.[1]||'';
 assert(nav,'Missing navigation '+filename);
 const current=nav.match(/<a\s[^>]*aria-current="page"[^>]*>/g)||[];
 assert(current.length===1,'Expected one active nav item '+filename);
 const wanted=(lang==='en'?'/en/':'/')+(active==='home'?'':active+'/');
 assert(current[0].includes('href="'+wanted+'"'),'Wrong active '+active+' for '+filename);
 for(const url of routes(lang))assert(nav.includes('href="'+url+'"'),'Missing '+url+' on '+filename);
 assert(html.includes('/assets/site-nav.js'),'Shared navigation JS not loaded: '+filename);
 if(filename.endsWith('prompts/index.html')){
  assert(html.includes('id="library-view"'),'Prompt library view absent '+filename);
  assert(html.includes('id="copy-btn"'),'Prompt copy interface absent '+filename);
  assert(html.includes('/prompts/prompt-library.js'),'Prompt JS absent '+filename);
 }
 if(filename==='index.html'||filename==='en/index.html'){
  for(const section of ['projects','skills','journey','principles']){
   assert(html.includes('id="'+section+'"'),'Missing homepage section '+section);
   assert(html.includes('href="#'+section+'"'),'Missing homepage anchor '+section);
  }
  assert(html.includes('/assets/portfolio-motion.js'),'GSAP entrypoint absent '+filename);
 }
}
const independent=[
 'eao/index.html','eao/en/index.html','eao/zh/index.html',
 'toolscout/zh/index.html','toolscout/en/index.html',
 ...['ai-writing-audit','armor-memory','disable-macos-auto-updates','greenram','opencore-h81'].flatMap(x=>[x+'/index.html',x+'/zh/index.html'])
];
for(const filename of independent){
 const html=await read(filename);
 assert(html.length>500,'Missing independent project '+filename);
 assert(!/\{%\s*include /.test(html),'Project Liquid not expanded '+filename);
 assert(html.includes('class="site-context"'),'Project site context missing '+filename);
 const language=filename.startsWith('eao/') ? (filename.startsWith('eao/en/')?'en':'zh')
   : filename.startsWith('toolscout/') ? (filename.startsWith('toolscout/en/')?'en':'zh')
   : (filename.includes('/zh/')?'zh':'en');
 for(const url of routes(language))assert(html.includes('href="'+url+'"'),
   'Project navigation missing '+url+' in '+filename);
}
for(const asset of [
 'assets/portfolio.css','assets/portfolio-liquid-glass.css','assets/site-header.css',
 'assets/portfolio-motion.js','assets/licat-logo.svg',
 'prompts/prompt-library.css','prompts/prompt-library.js',
 'prompts/content/ai-natural-communication-v1.3.1.md',
 'en/prompts/content/agent-efficient-execution-v3.md',
 'skills/design-liquid-glass-ui/SKILL.md',
 'eao/assets/eao-hero-devices-zh.webp',
 'lottery-calculate/static/js/main.974eb048.js'
])await stat(path.join(root,asset));
assert((await read('blog/advanced-seo-geo-guide/index.html')).includes('独立站 SEO/GEO'),
       'Long-form Chinese Markdown body missing');
assert((await read('blog/publish-markdown-notes/index.html')).includes('新建文章'),
       'Blog body missing');
assert((await read('zh/index.html')).includes('location.replace'),
       'Legacy Chinese homepage URL lost');
console.log('ASTRO_MIGRATION_OUTPUT_PASS',core.length,'core pages,',independent.length,
 'project pages, original content, navigation, permalink and asset coverage');
