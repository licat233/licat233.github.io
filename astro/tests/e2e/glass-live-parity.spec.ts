import {test, expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
import path from 'node:path';

// This is a one-time PR regression check against the published Astro site.
// Release builds after merging intentionally skip the old-live comparison.
test('shared GlassSurface preserves live site card/header geometry and optics',async ({page})=>{
 test.skip(process.env.GITHUB_EVENT_NAME!=='pull_request','Baseline applies only before merge');
 test.setTimeout(150000);
 const live=await page.context().newPage();
 await page.emulateMedia({reducedMotion:'reduce',colorScheme:'light'});
 await live.emulateMedia({reducedMotion:'reduce',colorScheme:'light'});
 const cases=[
   {url:'/',items:['.site-header','.hero-cta.liquid-demo','.hero-resources','.phase-glass','.principle','.site-footer','#projects .project','#skills .skill-card']},
   {url:'/en/',items:['.site-header','.hero-resources','.phase-glass','.principle','#projects .project','#skills .skill-card']},
   {url:'/projects/',items:['.site-header','.site-section-card']},
   {url:'/skills/',items:['.site-header','.site-section-card']},
   {url:'/en/projects/',items:['.site-header','.site-section-card']},
   {url:'/en/skills/',items:['.site-header','.site-section-card']}
 ];
 const errors:string[]=[];
 const report:any[]=[];
 const attrs=async (p:typeof page,selectors:string[])=>p.evaluate((sels)=>{
  const obj:Record<string,object>={};
  for(const sel of sels){
   const el=document.querySelector<HTMLElement>(sel);
   if(!el){obj[sel]={missing:true};continue}
   const rec=el.getBoundingClientRect();
   const css=getComputedStyle(el);
   const filter=el.querySelector<HTMLElement>(':scope > .lg-glass-filter');
   const overlay=el.querySelector<HTMLElement>(':scope > .lg-glass-overlay');
   const specular=el.querySelector<HTMLElement>(':scope > .lg-glass-specular');
   obj[sel]={tag:el.tagName,top:Math.round(rec.top+scrollY),left:Math.round(rec.left),
    width:Math.round(rec.width),height:Math.round(rec.height),
    radius:css.borderRadius,background:css.backgroundColor,
    filter:filter?getComputedStyle(filter).backdropFilter:null,
    reflection:overlay?getComputedStyle(overlay).backgroundImage:null,
    highlight:specular?getComputedStyle(specular).boxShadow:null,
    layers:[filter,overlay,specular].every(Boolean)};
  }
  return obj;
 },selectors);
 try{
  for(const c of cases){
   const [a,b]=await Promise.all([
    live.goto('https://licat233.github.io'+c.url,{waitUntil:'domcontentloaded',timeout:30000}),
    page.goto('http://127.0.0.1:4321'+c.url,{waitUntil:'domcontentloaded',timeout:30000})
   ]);
   expect(a?.status()).toBe(200);expect(b?.status()).toBe(200);
   await Promise.all([live.evaluate(()=>document.fonts.ready),page.evaluate(()=>document.fonts.ready)]);
   await Promise.all([live.waitForTimeout(120),page.waitForTimeout(120)]);
   const old=await attrs(live,c.items),cur=await attrs(page,c.items);
   for(const selector of c.items){
     const reference=(old as any)[selector],after=(cur as any)[selector];
     if(reference.missing||after.missing){errors.push(c.url+': missing '+selector);continue}
     if(reference.tag!==after.tag||!after.layers)errors.push(c.url+': tag/optical layer mismatch '+selector);
     for(const dim of ['top','left','width','height']){
      if(Math.abs(reference[dim]-after[dim])>5)
       errors.push(c.url+': layout drift '+selector+' '+dim+' old='+reference[dim]+' new='+after[dim]);
     }
     for(const property of ['radius','background','filter','reflection','highlight']){
      if(reference[property]!==after[property])
       errors.push(c.url+': optical CSS drift '+selector+' '+property);
     }
   }
   report.push({url:c.url,baseline:old,candidate:cur});
  }
 }finally{await live.close()}
 console.log('GLASS_LIVE_BASELINE_PARITY',JSON.stringify({cases:report.length,errors}));
 expect(errors).toEqual([]);
});
