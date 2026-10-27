import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root=new URL('../dist/',import.meta.url);
const files=['index.html','en/index.html','blog/index.html','en/blog/index.html',
 'projects/index.html','en/projects/index.html','skills/index.html','en/skills/index.html',
 'prompts/index.html','en/prompts/index.html','blog/publish-markdown-notes/index.html',
 'en/blog/publish-markdown-notes/index.html','eao/index.html','toolscout/en/index.html',
 'ai-writing-audit/zh/index.html','lottery-calculate/index.html'];
for(const filename of files){
 const file=new URL(filename,root);
 const html=await readFile(file,'utf8');
 if(html.length<300)throw Error('Suspiciously empty output: '+filename);
 if(/\{%\s*include /.test(html))throw Error('Unprocessed Liquid: '+filename);
 if(filename.startsWith('prompts/')&&!html.includes('id="library-view"'))throw Error('Prompt functionality missing: '+filename);
 if(filename.startsWith('blog/')&&!html.includes('href="/blog/"'))throw Error('Blog navigation missing: '+filename);
 if(filename.startsWith('eao/')&&!html.includes('site-context'))throw Error('Project site context missing: '+filename);
 if(!filename.includes('/en/')&&filename==='index.html'&&!html.includes('class="home-section-nav'))throw Error('Homepage section links missing');
}
for(const asset of ['assets/portfolio-motion.js','prompts/prompt-library.js','prompts/content/ai-natural-communication-v1.3.1.md','skills/design-liquid-glass-ui/SKILL.md']){
 await stat(new URL(asset,root));
}
const main=await readFile(new URL('index.html',root),'utf8');
if(!main.includes('href="/projects/"')||!main.includes('href="/prompts/"'))throw Error('Global navigation broken');
console.log('ASTRO_MIGRATION_OUTPUT_PASS:',files.length,'pages plus original assets');
