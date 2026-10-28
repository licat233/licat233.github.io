import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PRODUCTION = 'https://licat233.github.io';
const CANDIDATE = 'http://127.0.0.1:4321';
const views: Array<{ route: string; name: string; selectors: string[] }> = [
 {route:'/',name:'home-zh',selectors:['.site-header','.hero','#projects .projects','#skills .skills-grid']},
 {route:'/en/',name:'home-en',selectors:['.site-header','.hero','#projects .projects','#skills .skills-grid']},
 {route:'/projects/',name:'projects-zh',selectors:['.site-header','.site-section-main h1','.site-section-grid']},
 {route:'/skills/',name:'skills-zh',selectors:['.site-header','.site-section-main h1','.site-section-grid']},
 {route:'/blog/',name:'blog-zh',selectors:['.site-header','.blog-intro h1','.blog-list']},
 {route:'/en/blog/',name:'blog-en',selectors:['.site-header','.blog-intro h1','.blog-list']},
 {route:'/blog/website-seo-geo-basics/',name:'blog-article-zh',selectors:['.site-header','.blog-article-header h1','.blog-prose']},
 {route:'/prompts/',name:'prompts-zh',selectors:['.site-header','.hero h1','#filters','#prompt-grid']},
 {route:'/en/prompts/',name:'prompts-en',selectors:['.site-header','.hero h1','#filters','#prompt-grid']},
 {route:'/prompts/?p=agent-efficient-execution-v3',name:'prompt-detail',selectors:['.site-header','#detail-title','#prompt-article']},
 {route:'/eao/',name:'eao',selectors:['.site-context']},
 {route:'/toolscout/en/',name:'toolscout',selectors:['.site-context']},
];
type Measure = {exists:boolean;visible?:boolean;top?:number;left?:number;width?:number;height?:number;size?:string;weight?:string;color?:string};
async function inspect(page:import('@playwright/test').Page, selectors:string[]){
 return await page.evaluate((selectors)=>{
   const metrics:Record<string,Measure>={};
   for(const sel of selectors){
     const element=document.querySelector(sel);
     if(!element){metrics[sel]={exists:false};continue}
     const rect=element.getBoundingClientRect(),css=getComputedStyle(element);
     metrics[sel]={
       exists:true,visible:rect.width>0&&rect.height>0,
       top:Math.round(rect.top+scrollY),left:Math.round(rect.left),width:Math.round(rect.width),
       height:Math.round(rect.height),size:css.fontSize,weight:css.fontWeight,color:css.color
     };
   }
   return {metrics,scrollWidth:document.documentElement.scrollWidth,
           viewportWidth:innerWidth,scrollHeight:document.documentElement.scrollHeight,
           pageTitle:document.title,documentLang:document.documentElement.lang};
 },selectors);
}
async function settle(page:import('@playwright/test').Page,detail:boolean){
 await page.evaluate(async ()=>{await document.fonts.ready;});
 if(detail) await expect(page.locator('#prompt-article')).not.toBeEmpty();
 else if(await page.locator('#prompt-grid').count())
   await expect(page.locator('#prompt-grid .prompt-card')).toHaveCount(17);
 await page.waitForTimeout(170);
}
test('compare live Jekyll and local Astro DOM geometry, typography and screenshots', async ({page},info)=>{
 test.setTimeout(180000);
 const reference=await page.context().newPage();
 const outputDir=path.join('test-results','visual-parity',info.project.name);
 await mkdir(outputDir,{recursive:true});
 await page.emulateMedia({reducedMotion:'reduce',colorScheme:'light'});
 await reference.emulateMedia({reducedMotion:'reduce',colorScheme:'light'});
 const report:any={reference:PRODUCTION,candidate:CANDIDATE,viewport:page.viewportSize(),pages:[],issues:[]};
 try{
   for(const view of views){
     const detail=view.route.includes('?p=');
     for(const [target,host,which] of [[reference,PRODUCTION,'jekyll'],[page,CANDIDATE,'astro']] as const){
       const response=await target.goto(host+view.route,{waitUntil:'domcontentloaded',timeout:30000});
       expect(response?.status(),which+' HTTP status for '+view.route).toBe(200);
       await settle(target,detail);
     }
     const baseline=await inspect(reference,view.selectors),astro=await inspect(page,view.selectors);
     const diffs:any[]=[];
     for(const selector of view.selectors){
       const a=baseline.metrics[selector],b=astro.metrics[selector];
       if(!a.exists||!b.exists){diffs.push({selector,issue:'missing element',jekyll:a,astro:b});continue}
       const widthDifference=Math.abs((a.width||0)-(b.width||0));
       const heightDifference=Math.abs((a.height||0)-(b.height||0));
       const topDifference=Math.abs((a.top||0)-(b.top||0));
       const fontDifference=Math.abs(parseFloat(a.size||'0')-parseFloat(b.size||'0'));
       const delta={width:widthDifference,height:heightDifference,top:topDifference,font:fontDifference};
       // Explicit, reviewable thresholds rather than claiming pixel equality.
       if(widthDifference>Math.max(20,(a.width||0)*.08)||
          heightDifference>Math.max(24,(a.height||0)*.14)||
          topDifference>50||fontDifference>2){
          diffs.push({selector,issue:'significant computed-layout drift',delta,jekyll:a,astro:b});
       }
     }
     const scrollRatio=Math.abs(baseline.scrollHeight-astro.scrollHeight)/Math.max(1,baseline.scrollHeight);
     if(scrollRatio>.18) diffs.push({issue:'page-height drift over 18%',ratio:scrollRatio,
       jekyll:baseline.scrollHeight,astro:astro.scrollHeight});
     const overflow=astro.scrollWidth>astro.viewportWidth+3;
     if(overflow)diffs.push({issue:'Astro horizontal overflow',extra:astro.scrollWidth-astro.viewportWidth});
     const jekyllScreen=await reference.screenshot({path:path.join(outputDir,view.name+'-jekyll.png'),animations:'disabled'});
     const astroScreen=await page.screenshot({path:path.join(outputDir,view.name+'-astro.png'),animations:'disabled'});
     // Same Chromium device, viewport and reduced-motion setting on both sites.
     // Pixel metrics are review evidence, not a hard equivalence claim: text
     // antialiasing and runtime timing can vary even with preserved CSS.
     const pixel=await page.evaluate(async ({reference,candidate})=>{
       const decode=async (base64:string)=>{
         const image=await createImageBitmap(await (await fetch('data:image/png;base64,'+base64)).blob());
         const c=document.createElement('canvas');c.width=image.width;c.height=image.height;
         const context=c.getContext('2d',{willReadFrequently:true})!;
         context.drawImage(image,0,0);
         return {width:image.width,height:image.height,rgba:context.getImageData(0,0,image.width,image.height).data};
       };
       const a=await decode(reference),b=await decode(candidate);
       if(a.width!==b.width||a.height!==b.height)return {sameSize:false,jekyll:[a.width,a.height],astro:[b.width,b.height]};
       let sum=0,changed=0,large=0;
       for(let i=0;i<a.rgba.length;i+=4){
         const delta=Math.abs(a.rgba[i]-b.rgba[i])+Math.abs(a.rgba[i+1]-b.rgba[i+1])+Math.abs(a.rgba[i+2]-b.rgba[i+2]);
         sum+=delta;
         if(delta>60)changed++;
         if(delta>180)large++;
       }
       const pixels=a.rgba.length/4;
       return {sameSize:true,width:a.width,height:a.height,
         meanRgbDifference:Number((sum/(pixels*3*255)).toFixed(4)),
         changedPixelRatio:Number((changed/pixels).toFixed(4)),
         largeDeltaRatio:Number((large/pixels).toFixed(4))};
     },{reference:jekyllScreen.toString('base64'),candidate:astroScreen.toString('base64')});
     // A 5% visibly changed pixel ceiling is intentionally more permissive
     // than the currently observed <1.5%, but catches real style regressions.
     // This is screenshot evidence, not a declaration of pixel perfection.
     if(!pixel.sameSize||((pixel.changedPixelRatio||0)>.05)||((pixel.meanRgbDifference||0)>.02)){
       diffs.push({issue:'material visual pixel drift',pixel});
     }
     report.pages.push({route:view.route,name:view.name,baseline,astro,diffs,pixel});
     for(const diff of diffs)report.issues.push({route:view.route,...diff});
   }
 }finally{
   await writeFile(path.join(outputDir,'comparison.json'),JSON.stringify(report,null,2));
   await reference.close();
 }
 console.log('ASTRO_JEKYLL_PIXEL_REVIEW',JSON.stringify(report.pages.map(({route,pixel})=>({route,...pixel}))));
 console.log('ASTRO_JEKYLL_VISUAL_PARITY',JSON.stringify({views:report.pages.length,issues:report.issues}));
 expect(report.issues,'Jekyll→Astro visual drift; see astro-visual-parity artifact').toEqual([]);
});
