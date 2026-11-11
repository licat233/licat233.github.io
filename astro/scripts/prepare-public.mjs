/* Compatibility bridge: keep existing published assets and independent microsites.
 * Does not build Jekyll. Later replace raw microsites with Astro layouts one by one. */
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { transform as minifyCss } from 'lightningcss';
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

// One CSS request per page family, preserving the original cascade order.
// Bundled from existing public assets at build time; no dependency or visual rewrite.
const styleBundles = {
  // Hero, navigation, shared materials and their original cascade order.
  'home': ['vendor/open-props/open-props-core-1.7.23.min.css','portfolio.css','site-header.css',
    'portfolio-liquid-glass.css'],
  // Only below-the-fold sections use these rules. Load them without blocking the Hero.
  'home-deferred': ['portfolio-entrances.css','portfolio-skills.css',
    'portfolio-journey-v2.css','portfolio-prompts.css','site-sections.css'],
  'prompts': ['vendor/open-props/open-props-core-1.7.23.min.css','prompt-library.css',
    'site-header.css','portfolio-liquid-glass.css'],
  'content': ['vendor/open-props/open-props-core-1.7.23.min.css','portfolio.css',
    'site-header.css','portfolio-liquid-glass.css','site-sections.css'],
  'blog': ['vendor/open-props/open-props-core-1.7.23.min.css','portfolio.css',
    'site-header.css','portfolio-liquid-glass.css','blog.css'],
  'resources': ['vendor/open-props/open-props-core-1.7.23.min.css','portfolio.css',
    'site-header.css','portfolio-liquid-glass.css','site-sections.css','resources.css'],
};
for (const [name, files] of Object.entries(styleBundles)) {
  const chunks = await Promise.all(files.map(async file =>
    '/* Source: '+file+' */\n'+await readFile(path.join(publicDir,
      file === 'prompt-library.css' ? 'prompts/prompt-library.css':'assets/'+file),'utf8')));
  const css = chunks.join('\n');
  // Limit this optimization to the homepage. Other page bundles remain byte-for-byte unchanged.
  const output = name === 'home' || name === 'home-deferred'
    ? minifyCss({ filename: 'bundle-'+name+'.css', code: Buffer.from(css), minify: true }).code
    : css;
  await writeFile(path.join(publicDir,'assets','bundle-'+name+'.css'),output);
}

// Only retained assets and independently published project pages are copied.
await cp(path.join(root,'favicon.ico'),path.join(publicDir,'favicon.ico'));
await cp(path.join(root,'llms.txt'),path.join(publicDir,'llms.txt'));

// Optional agent-friendly full-text bundle: derived from published Blog sources.
// This is not an indexing/ranking signal and never includes private project data.
const blogSourceDir = path.join(here,'../src/content/blog');
const { readdir: listBlogFiles } = await import('node:fs/promises');
const publishedBlog = [];
for (const name of (await listBlogFiles(blogSourceDir)).filter(name => name.endsWith('.md')).sort()) {
  const src = await readFile(path.join(blogSourceDir,name),'utf8');
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) throw new Error('Published blog post missing YAML frontmatter: '+name);
  const frontmatter = match[1];
  const value = key => frontmatter.match(new RegExp('^'+key+':\\s*(.+)$','m'))?.[1]?.replace(/^["']|["']$/g,'')?.trim();
  const title = value('title');
  const lang = value('lang') || 'zh';
  if (!title || !['zh','en'].includes(lang)) throw new Error('Invalid published blog metadata: '+name);
  const slug = name.replace(/^\d{4}-\d{2}-\d{2}-/,'').replace(/-en\.md$/,'.md').replace(/\.md$/,'');
  const canonical = 'https://licat.xyz/' +(lang==='en'?'en/':'')+'blog/'+slug+'/';
  publishedBlog.push('## '+title+'\n\nCanonical: '+canonical+'\nLanguage: '+(lang==='en'?'en':'zh-CN')+
    '\n\n'+src.slice(match[0].length).trim());
}
await writeFile(path.join(publicDir,'llms-full.txt'),
  '# Licat — Published Blog Full Text\n\n' +
  '> Automatically generated from the public, published Markdown articles. The canonical HTML URLs are authoritative; this file is for agents that need bulk reading.\n\n' +
  publishedBlog.join('\n\n---\n\n')+'\n');

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
function siteContext(lang,project,html){
 const en=lang==='en';
 const home=legacyLocalizedUrl(lang,'home');
 const projects=legacyLocalizedUrl(lang,'projects');
 const canonical = /<link\s+rel=['"]canonical['"]\s+href=['"]([^'"]+)['"]/i.exec(html)?.[1];
 if(!canonical) throw new Error('Project missing canonical for breadcrumb: '+project);
 const schema = JSON.stringify({
   '@context':'https://schema.org','@type':'BreadcrumbList',
   itemListElement:[
     {'@type':'ListItem',position:1,name:en?'Home':'首页',item:'https://licat.xyz'+home},
     {'@type':'ListItem',position:2,name:en?'Projects':'项目',item:'https://licat.xyz'+projects},
     {'@type':'ListItem',position:3,name:project,item:canonical},
   ],
 }).replace(/</g,'\\u003c');
 return `<script type="application/ld+json">${schema}</script><nav class="site-context" aria-label="${en?'Site navigation and project location':'全站导航与项目位置'}"><div class="site-context__path"><a href="${home}">Licat</a><span aria-hidden="true">›</span><a href="${projects}">${en?'Projects':'项目'}</a><span aria-hidden="true">›</span><strong>${project.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;')}</strong></div><div class="site-context__links">${links.filter(link=>!link.parent).map(link=>`<a href="${legacyLocalizedUrl(lang,link.key)}"${link.key==='projects'?' class="is-section"':''}>${en?link.en:link.zh}</a>`).join('')}</div></nav>`;
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


// Social previews are independent from search indexing, but complete
// Open Graph and Twitter cards make shared links useful. Use the same
// existing Licat image as a stable fallback; don't manufacture project imagery.
const defaultSocialImage = 'https://licat.xyz/assets/licat-social.jpg';
function addSocialPreview(html) {
 const canonical = /<link\b[^>]*rel=['"]canonical['"][^>]*href=['"]([^'"]+)['"]/i.exec(html)?.[1];
 if (!canonical || !canonical.startsWith('https://licat.xyz/')) return html;
 if (!/<\/head>/i.test(html)) throw new Error('Canonical project missing head close');
 const title = /<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1]?.trim();
 const description = /<meta\b[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"]/i.exec(html)?.[1]?.trim();
 if (!title || !description) throw new Error('Project social preview needs a title and description: '+canonical);
 const escapedTitle = title.replaceAll('"', '&quot;');
 const escapedDescription = description.replaceAll('"', '&quot;');
 const hasProperty = name => new RegExp('<meta\\b[^>]*property=["\\x27]'+name+'["\\x27]', 'i').test(html);
 const hasName = name => new RegExp('<meta\\b[^>]*name=["\\x27]'+name+'["\\x27]', 'i').test(html);
 const additions = [];
 const addProperty = (name, value) => {
   if (!hasProperty(name)) additions.push('<meta property="'+name+'" content="'+value+'">');
 };
 const addName = (name, value) => {
   if (!hasName(name)) additions.push('<meta name="'+name+'" content="'+value+'">');
 };
 addProperty('og:type', 'website');
 addProperty('og:site_name', 'Licat');
 addProperty('og:title', escapedTitle);
 addProperty('og:description', escapedDescription);
 addProperty('og:url', canonical);
 addProperty('og:image', defaultSocialImage);
 addProperty('og:image:type', 'image/jpeg');
 addProperty('og:image:width', '1200');
 addProperty('og:image:height', '630');
 addProperty('og:image:alt', 'Licat: a cat overlooking a mountain lake');
 addName('twitter:card', 'summary_large_image');
 addName('twitter:image', defaultSocialImage);
 return html.replace(/<\/head>/i, additions.join('\n')+'\n</head>');
}
const microsites=['eao','toolscout','ai-writing-audit','armor-memory','disable-macos-auto-updates','greenram','opencore-h81','lottery-calculate'];
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
   html=html.replace(/\{%\s*include site-context\.html\s+lang=['"]([^'"]+)['"]\s+project=['"]([^'"]+)['"]\s*%\}/g,(_m,lang,project)=>siteContext(lang,project,html));
   if(/\{%\s*include /.test(html))throw Error('Unresolved legacy Liquid include: '+p);
   const landing=path.relative(path.join(publicDir,dir),p).replaceAll(path.sep,'/');
   if(['index.html','zh/index.html','en/index.html'].includes(landing) &&
      !/<meta\b[^>]*name=['\"]robots['\"][^>]*content=['\"][^'\"]*noindex/i.test(html)) {
     html=addAnalytics(html);
     html=addSocialPreview(html);
   }
   await writeFile(p,html);
  }
 }
}
console.log('Prepared compatibility assets and independent project pages (Ruby/Jekyll not used).');
