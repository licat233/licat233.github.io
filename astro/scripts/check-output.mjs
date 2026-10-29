import { readFile, stat, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const core=[
 ['index.html','zh','home'],['en/index.html','en','home'],
 ['projects/index.html','zh','projects'],['en/projects/index.html','en','projects'],
 ['skills/index.html','zh','skills'],['en/skills/index.html','en','skills'],
 ['ai/index.html','zh','ai'],['en/ai/index.html','en','ai'],
 ['blog/index.html','zh','blog'],['en/blog/index.html','en','blog'],
 ['prompts/index.html','zh','prompts'],['en/prompts/index.html','en','prompts'],
 ['blog/website-seo-geo-basics/index.html','zh','blog'],
 ['blog/advanced-seo-geo-guide/index.html','zh','blog'],
];
const allNav=JSON.parse(await readFile(new URL('../src/data/navigation.json',import.meta.url),'utf8'));
const siteKeys=allNav.map(x=>x.key);
const primaryKeys=allNav.filter(x=>!x.parent).map(x=>x.key);
const childKeys=allNav.filter(x=>x.parent==='ai').map(x=>x.key);
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
 const nav=html.match(/<div class="nav-links">([\s\S]*?)<div class="nav-actions">/)?.[1]||'';
 assert(nav,'Missing navigation '+filename);
 const current=nav.match(/<a\s[^>]*aria-current="page"[^>]*>/g)||[];
 assert(current.length===1,'Expected one active nav item '+filename);
 const wanted=(lang==='en'?'/en/':'/')+(active==='home'?'':active+'/');
 assert(current[0].includes('href="'+wanted+'"'),'Wrong active '+active+' for '+filename);
 for(const url of routes(lang))assert(nav.includes('href="'+url+'"'),'Missing '+url+' on '+filename);
 assert((nav.match(/class="nav-pill(?: active)?"/g)||[]).length===primaryKeys.length,
  'Primary nav must have four links on '+filename);
 assert(nav.includes('class="ai-subnav') && nav.includes('aria-controls="ai-subnav"'),
  'AI sub-navigation is missing on '+filename);
 if(active==='skills'||active==='prompts'){
  const parent=(lang==='en'?'/en/':'/')+'ai/';
  assert(nav.includes('href="'+parent+'"') && nav.includes('aria-current="location"'),
   'AI parent section not marked active on '+filename);
 }
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
 for(const key of primaryKeys){
  const url=(language==='en'?'/en/':'/')+(key==='home'?'':key+'/');
  assert(html.includes('href="'+url+'"'), 'Project primary nav missing '+url+' in '+filename);
 }
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
assert((await read('zh/index.html')).includes('location.replace'),
       'Legacy Chinese homepage URL lost');
// The person's public name is Licat; "233" is only the GitHub account suffix.
// Do not allow old account-style labels to return in generated public pages.
const publicNamePages=[
 ...core.map(([filename])=>filename),
 ...independent,
 ...['demo/index.html','demo/zh/index.html','demo/en/index.html'],
 'prompts/ai-coding-minimal-defensive-v1/index.html',
 'en/prompts/ai-coding-minimal-defensive-v1/index.html',
];
for(const filename of publicNamePages){
 const html=await read(filename);
 assert(!/Licat\s*\/\s*233|<small>\s*\/\s*233\s*<\/small>|<title>[^<]*Licat233|>Licat233</i.test(html),
   'Old account suffix is still presented as a personal name: '+filename);
}
for(const [filename] of core){
 const html=await read(filename);
 assert(html.includes('property="og:site_name" content="Licat"'),
  'Personal site metadata must say Licat: '+filename);
}
console.log('ASTRO_PUBLIC_NAME_PASS: display identity Licat, GitHub account URLs unchanged');

console.log('ASTRO_MIGRATION_OUTPUT_PASS',core.length,'core pages,',independent.length,
 'project pages, original content, navigation, permalink and asset coverage');

// Disallow regressions to brittle Jekyll HTML scraping in future Astro pages.
for (const removed of ['src/lib/legacy.ts','src/layouts/LegacyPage.astro']) {
  try { await access(new URL('../'+removed,import.meta.url)); throw new Error('Obsolete adapter reintroduced: '+removed); }
  catch(error) { if(error?.code!=='ENOENT') throw error; }
}
for(const page of ['src/pages/index.astro','src/pages/en/index.astro','src/pages/prompts/index.astro','src/pages/en/prompts/index.astro']){
 const markup=await readFile(new URL('../'+page,import.meta.url),'utf8');
 assert(markup.includes('PortfolioShell')&&markup.includes('PageContent'),'Native Astro page component missing: '+page);
}
console.log('ASTRO_NATIVE_COMPONENTS_PASS: home and prompt content no longer parsed from Jekyll HTML');

const untranslated=await read('blog/advanced-seo-geo-guide/index.html');
assert(!/hreflang="en"/.test(untranslated),
       'Untranslated Chinese article must not claim English Blog index as a translation');
// Documentation belongs in the repository, not in the public Blog.
for(const route of ['blog/publish-markdown-notes/index.html',
                    'en/blog/publish-markdown-notes/index.html']){
 try{await stat(path.join(root,route));throw Error('Removed tutorial reappeared: '+route);}
 catch(error){if(error?.code!=='ENOENT')throw error;}
}
console.log('ASTRO_BLOG_HREFLANG_PASS: no fake translation or retired tutorial pages');

const source=(file)=>readFile(new URL('../'+file,import.meta.url),'utf8');
const documentShell=await source('src/layouts/BaseLayout.astro');
const portfolioShell=await source('src/layouts/PortfolioShell.astro');
assert((documentShell.match(/<html\b/g)||[]).length===1,'Global HTML document must have exactly one BaseLayout shell');
assert(!/<html\b|<!doctype/i.test(portfolioShell),'Portfolio wrapper must not duplicate site-wide HTML');
const home=await source('src/components/home/Home.astro');
const homeData=await source('src/data/home.ts');
assert(home.includes('<FeaturedProjects')&&home.includes('<HomeSkills'),
 'Shared homepage must use project and Skill card components');
assert(home.includes('homeCopy[lang]')&&homeData.includes('homeCopy'),
 'Homepage must render both languages from shared structure and language data');
assert(!home.includes('<a class="liquid-demo project'),
 'Homepage reverted to copy/pasted project card markup');
for(const locale of ['Zh','En']){
 const prompts=await source('src/components/prompts/Prompts'+locale+'.astro');
 assert(prompts.includes('<PromptLibrary'),'Prompt page reverted to locale-specific layout: '+locale);
}
const englishHome=await read('en/index.html');
assert(englishHome.includes('href="/eao/en/"'),
 'English homepage links to Chinese EAO project page');
const englishProjects=await read('en/projects/index.html');
assert(englishProjects.includes('href="/eao/en/"'),
 'English projects page links to Chinese EAO project page');
assert((await source('src/components/home/FeaturedProjects.astro')).includes('getProjects()'),
 'Featured cards must use the same project YAML data as the Projects category');
assert((await source('src/components/home/HomeSkills.astro')).includes('getSkills()'),
 'Skills cards must use the same catalog as the Skills category');
assert((await source('src/components/prompts/PromptLibrary.astro')).includes("import promptCatalogue from '../../data/prompts.json'"),
 'Prompt initial list should use the unified structured catalogue');
console.log('ASTRO_ARCHITECTURE_PASS: one bilingual home component, shared cards and prompt templates');

const prompts=JSON.parse(await readFile(new URL('../src/data/prompts.json',import.meta.url),'utf8'));
assert(prompts.length===17 && new Set(prompts.map(x=>x.id)).size===17,
 'Prompt metadata must contain 17 unique records');
assert(prompts.some(x=>x.id==='ai-coding-minimal-defensive-v1' && x.category==='design' && x.translatedEnglish===true),
 'Missing AI coding guideline in Astro prompt catalogue');
assert(prompts.filter(x=>x.translatedEnglish).length===prompts.length,
 'English prompt-content coverage changed');
for(const lang of ['','en/']){
 const html=await read(lang+'prompts/index.html');
 const embedded=html.match(/<script\b[^>]*id="prompt-catalogue"[^>]*>([\s\S]*?)<\/script>/);
 assert(embedded,'Astro metadata script missing from '+lang+'prompt page');
 const parsed=JSON.parse(embedded[1]);
 assert(parsed.items.length===prompts.length && parsed.translatedEnglish.length===prompts.length,
  'Incomplete embedded prompt metadata '+lang);
 assert(parsed.items.map(x=>x.id).join(',')===prompts.map(x=>x.id).join(','),
  'SSR prompt IDs drifted from common catalogue '+lang);
}
// Prompt detail pages are real, crawlable HTML with stable bilingual SEO URLs.
for(const item of prompts){
 for(const [lang,prefix] of [['zh',''],['en','en/']]){
  const route=prefix+'prompts/'+item.id+'/';
  const html=await read(route+'index.html');
  const base='https://licat233.github.io/';
  assert(html.includes('rel="canonical" href="'+base+route+'"'),
   'Prompt has wrong canonical: '+route);
  assert(html.includes('hreflang="zh-CN" href="'+base+'prompts/'+item.id+'/"') &&
         html.includes('hreflang="en" href="'+base+'en/prompts/'+item.id+'/"'),
   'Prompt translations are not paired: '+route);
  assert(html.includes('id="prompt-initial-content"') &&
         html.includes('id="detail-title"') &&
         html.includes('id="prompt-article"') &&
         /<article\s[^>]*id="prompt-article"[^>]*>\s*<(?:p|h[1-6]|ul|ol|blockquote)\b/.test(html),
   'Prompt detail missing actual SSR content: '+route);
  assert(html.includes('name="description"'), 'Prompt missing description: '+route);
 }
}
for(const prefix of ['','en/']){
 const html=await read(prefix+'prompts/index.html');
 assert(!/href="\?p=/.test(html),'Catalogue still links to query-param SPA: '+prefix);
 for(const item of prompts)assert(html.includes('href="/'+prefix+'prompts/'+item.id+'/"'),
  'Prompt missing crawlable list link: '+prefix+item.id);
}
console.log('ASTRO_PROMPT_DETAIL_ROUTES_PASS: 32 static localized articles with canonical, hreflang and SSR body');

for(const [prefix,lead] of [['','以下是强制执行约束'],['en/','The following are mandatory execution constraints']]){
 const text=await read(prefix+'prompts/content/ai-agent-minimal-necessary-execution-v1.md');
 const part=text.split('<!-- prompt:begin -->')[1]?.split('<!-- prompt:end -->')[0]?.trim();
 assert(part?.includes(lead) && (part.match(/^\d+\./gm)||[]).length===6,
  'Minimum necessary agent prompt missing or incomplete in '+prefix);
}
const codingPrompt=await read('prompts/content/ai-coding-minimal-defensive-v1.md');
assert(codingPrompt.includes('<!-- prompt:begin -->') && codingPrompt.includes('<!-- prompt:end -->') &&
       codingPrompt.includes('### 九、必要的安全与正确性边界'),
 'Coding prompt missing, truncated, or copy bounds invalid in Astro output');
const promptClient=await read('prompts/prompt-library.js');
assert(promptClient.includes("getElementById('prompt-catalogue')") && !promptClient.includes('const enItems='),
 'Browser prompt data must come only from Astro JSON');
try {
 await access(new URL('../src/data/prompt-previews.ts',import.meta.url));
 throw new Error('Redundant prompt-previews.ts reappeared');
} catch(e) {if(e?.code!=='ENOENT') throw e}
// A catalogue flag is not evidence of a translation unless the published
// English Markdown actually exists and contains one complete copyable body.
for(const item of prompts){
 assert(item.translatedEnglish===true,'Untranslated prompt in English catalogue: '+item.id);
 const file=await read('en/prompts/content/'+item.id+'.md');
 assert(file.length>300,'English prompt is empty or unexpectedly short: '+item.id);
 assert((file.match(/<!-- prompt:begin -->/g)||[]).length===1 &&
        (file.match(/<!-- prompt:end -->/g)||[]).length===1 &&
        file.indexOf('<!-- prompt:begin -->')<file.indexOf('<!-- prompt:end -->'),
        'English prompt copy boundaries missing or ambiguous: '+item.id);
}
for(const id of ['ai-natural-communication-v1.3.1','ai-high-value-writing-audit-v1.1',
                 'detailflow-ecommerce','ai-coding-minimal-defensive-v1']){
 const file=await read('en/prompts/content/'+id+'.md');
 const body=file.split('<!-- prompt:begin -->')[1].split('<!-- prompt:end -->')[0];
 assert(!/[\u3400-\u9fff]/.test(body),'New English prompt still contains Chinese body text: '+id);
}
console.log('ASTRO_PROMPT_SINGLE_SOURCE_PASS: 17 localized records, 17 real English prompt files, SSR/client parity');

const preservedDemo=await read('demo/index.html');
assert(preservedDemo.includes('name="robots" content="noindex,follow"'),
 'Legacy nonindexed design demo missing or accidentally made indexable');
console.log('ASTRO_DEMO_PRESERVED: public demos remain noindex and reachable');

for(const route of ['blog/index.html','en/blog/index.html','blog/website-seo-geo-basics/index.html']){
 const html=await read(route);
 assert(html.includes('class="blog-footer"'),'Jekyll Blog footer missing from '+route);
 assert(html.includes('/assets/blog.css?v=20261027'),'Original blog stylesheet URL changed in '+route);
}
console.log('ASTRO_BLOG_SHELL_PARITY_PASS: original footer and styles present');

const {readdir:readDirectories}=await import('node:fs/promises');
const skillFolders=(await readDirectories(new URL('../../skills/',import.meta.url),{withFileTypes:true}))
 .filter(entry=>entry.isDirectory()&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(entry.name))
 .map(entry=>entry.name);
const skillSources=[];
for(const name of skillFolders){
 try{await access(new URL('../../skills/'+name+'/SKILL.md',import.meta.url));skillSources.push(name)}
 catch(error){if(error.code!=='ENOENT')throw error}
}
for(const route of ['projects/index.html','en/projects/index.html','skills/index.html','en/skills/index.html']){
 const html=await read(route);
 const expected=route.includes('projects')?8:skillSources.length;
 assert((html.match(/class="site-section-card liquid-demo apple-glass-base apple-glass-regular"/g)||[]).length===expected,
   'Missing material classes on '+route);
 for(const layer of ['lg-glass-filter','lg-glass-overlay','lg-glass-specular']){
   // Astro can render component attributes in a different order; the real
   // class and one-layer-per-card contract is checked in Playwright's DOM.
   assert(html.includes(layer),'Optical layer entirely absent '+layer+' in '+route);
 }
}
console.log('ASTRO_DIRECTORY_GLASS_PASS: projects and Skills share existing Liquid Glass optics');

for (const [route,lang] of [['ai/index.html','zh'],['en/ai/index.html','en']]) {
 const html=await read(route);
 assert(html.includes('AI '+(lang==='zh'?'开发工具箱':'Developer Toolkit')),'Toolkit heading absent '+route);
 assert((html.match(/class="site-section-card liquid-demo apple-glass-base apple-glass-regular"/g)||[]).length===5,
  'Public AI hub must have five shared material cards: '+route);
 for(const dest of [lang==='zh'?'/skills/':'/en/skills/',lang==='zh'?'/prompts/':'/en/prompts/'])
  assert(html.includes('href="'+dest+'"'),'Toolkit destination missing '+dest+' on '+route);
 assert(html.includes('href="'+(lang==='zh'?'/en/ai/':'/ai/')+'"'),'Toolkit language counterpart absent '+route);
}
console.log('ASTRO_AI_TOOLBOX_HUB_PASS: public bilingual hub, real destinations, shared glass');


const sourceDir=new URL('../src/',import.meta.url);
async function inspectAstroTemplates(dir,relative=''){
 const {readdir}=await import('node:fs/promises');
 for(const entry of await readdir(dir,{withFileTypes:true})){
  const rel=relative+entry.name;
  if(entry.isDirectory()){
   await inspectAstroTemplates(new URL(entry.name+'/',dir),rel+'/');
  } else if(entry.name.endsWith('.astro') && rel!=='components/GlassSurface.astro'){
   const code=await readFile(new URL(entry.name,dir),'utf8');
   assert(!/<span\s+class="lg-glass-(filter|overlay|specular)"/.test(code),
    'Use GlassSurface, not hand-copied optical layers: '+rel);
   assert(!/class="[^"]*\bliquid-demo\b/.test(code),
    'Use GlassSurface instead of manually adding material classes: '+rel);
   if(code.includes('<GlassSurface')){
    assert(code.includes('import GlassSurface from '),
      'GlassSurface needs an explicit import: '+rel);
   }
  }
 }
}
await inspectAstroTemplates(sourceDir);
for(const route of ['index.html','en/index.html','projects/index.html','en/projects/index.html',
                    'skills/index.html','en/skills/index.html','ai/index.html','en/ai/index.html','blog/index.html','prompts/index.html']){
 const html=await read(route);
 assert(html.includes('/assets/portfolio-liquid-glass.css?v=20261028-ai-active-group1'),
   'Glass material stylesheet missing from '+route);
}
console.log('ASTRO_GLASS_SINGLE_COMPONENT_PASS: no duplicate optical markup; material CSS linked on all owned pages');
const headerGlass=await read('assets/site-header.css');
const liquidGlass=await read('assets/portfolio-liquid-glass.css');
assert(/\.site-header \.ai-subnav\s*\{[^}]*background:\s*transparent/s.test(headerGlass),
 'AI dropdown must not override GlassSurface with opaque white');
assert(/\.site-header \.ai-subnav\.liquid-demo\s*>\s*\.lg-glass-filter\s*\{/.test(liquidGlass),
 'AI dropdown needs its own real backdrop refraction layer');
console.log('ASTRO_AI_MENU_GLASS_PASS: no opaque wash, shared optical backdrop');

for(const route of ['index.html','en/index.html']){
 const html=await read(route);
 assert(!html.includes('portfolio-skills.js'),
  'Astro homepage must not load obsolete visitor-side GitHub Skills API discovery');
 for(const name of skillSources)assert(html.includes(name),
  'Locally published SKILL.md was not discovered during build: '+name+' on '+route);
 const count=(html.match(/<article\s+class="[^"]*\bskill-card\b[^"]*"/g)||[]).length;
 assert(count===skillSources.length,
  'Skills catalogue/visible card count drift: '+route+' ('+count+'/'+skillSources.length+')');
}
const githubSVG=await source('src/components/SiteHeader.astro');
assert(githubSVG.includes('M12 .297a12 12 0 0 0-3.793'),
 'Known valid GitHub SVG path must be used');
assert(!githubSVG.includes('7.75-10.76C23.25'),
 'Previously broken GitHub SVG path has reappeared');
console.log('ASTRO_CONSOLE_ERRORS_GUARD_PASS: valid GitHub icon; '+skillSources.length+' build-time Skills; no browser REST dependency');
