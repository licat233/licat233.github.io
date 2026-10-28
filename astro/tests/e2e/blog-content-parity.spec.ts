import { test, expect } from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';

test('Jekyll article text, heading structure and canonical URLs survive Astro migration',async ({page},info)=>{
 test.setTimeout(120000);
 const live=await page.context().newPage();
 const paths=[
   '/blog/publish-markdown-notes/',
   '/en/blog/publish-markdown-notes/',
   '/blog/website-seo-geo-basics/',
   '/blog/advanced-seo-geo-guide/'
 ];
 const failures:string[]=[];
 const reports:any[]=[];
 // These two guides are being deliberately updated from Jekyll to Astro.
 // Preserve URL/SEO metadata while checking their NEW article content rather
 // than requiring byte-for-byte equality with the previously published prose.
 const revisedGuides=new Map([
  ['/blog/publish-markdown-notes/',{
   title:'我是如何用 Markdown 发布博客的',section:'写一篇 Markdown'}],
  ['/en/blog/publish-markdown-notes/',{
   title:'How I Publish Blog Posts with Markdown',
   section:'Write a Markdown post'}],
 ]);
 const clean=(v:string)=>v.replace(/\s+/g,'').replace(/\u00a0/g,'');
 try{
   for(const route of paths){
     const l=await live.goto('https://licat233.github.io'+route,{waitUntil:'domcontentloaded',timeout:30000});
     const v=await page.goto('http://127.0.0.1:4321'+route,{waitUntil:'domcontentloaded',timeout:30000});
     expect(l?.status()).toBe(200);expect(v?.status()).toBe(200);
     // The real snapshots are collected from each page's own DOM, without a
     // Jekyll/Markdown parsing assumption.
     const get=async (p:typeof page)=>await p.evaluate(()=>{
       const el=document.querySelector('.blog-prose');
       return {
         title:document.title,
         text:el?.textContent||'',
         headings:[...el?.querySelectorAll('h1,h2,h3,h4,h5,h6')||[]]
           .map(h=>({tag:h.tagName,text:(h.textContent||'').trim()})),
         canon:document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
         alts:[...document.querySelectorAll('link[hreflang]')].map(a=>a.getAttribute('hreflang')+':'+a.getAttribute('href'))
       };
     });
     const j=await get(live),a=await get(page);
     const cJ=clean(j.text),cA=clean(a.text);
     const lengthRatio=cA.length/Math.max(1,cJ.length);
     const titleSame=j.title===a.title;
     const headingsSame=JSON.stringify(j.headings)===JSON.stringify(a.headings);
     const canonicalSame=j.canon===a.canon;
     const revised=revisedGuides.get(route);
     const editorialContentPass=revised
       ? a.title.includes(revised.title) &&
         a.headings.some(h=>h.text===revised.section) &&
         a.text.includes('Astro + GitHub Pages') &&
         a.text.includes('GitHub Actions')
       : true;
     const error=revised
       ? (!canonicalSame || !editorialContentPass)
       : (!titleSame||!headingsSame||!canonicalSame||lengthRatio<.96||lengthRatio>1.04);
     reports.push({route,editorialRevision:Boolean(revised),editorialContentPass,
       jekyllChars:cJ.length,astroChars:cA.length,
       lengthRatio:Number(lengthRatio.toFixed(4)),titleSame,headingsSame,canonicalSame,
       jekyllHeadings:j.headings,astroHeadings:a.headings,jekyllAlternates:j.alts,astroAlternates:a.alts});
     if(error)failures.push(route);
   }
 }finally{
   const folder=path.join('test-results','content-parity',info.project.name);
   await mkdir(folder,{recursive:true});
   await writeFile(path.join(folder,'seo-text.json'),JSON.stringify(reports,null,2));
   await live.close();
 }
 console.log('ASTRO_BLOG_TEXT_PARITY',JSON.stringify(reports.map(({route,lengthRatio,titleSame,headingsSame,canonicalSame})=>({route,lengthRatio,titleSame,headingsSame,canonicalSame}))));
 expect(failures,'Markdown content SEO parity errors; see content-parity artifact').toEqual([]);
});
