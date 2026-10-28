import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

// These are review snapshots, NOT automatic proof of pixel-perfect parity.
// Compare them against the currently published Jekyll pages before approving cutover.
test('capture Astro release candidate visuals for manual Jekyll comparison',async ({page},testInfo)=>{
 const folder=path.join('test-results','visual-review',testInfo.project.name);
 await mkdir(folder,{recursive:true});
 const pages=[
  {url:'/',name:'home-zh'},
  {url:'/en/',name:'home-en'},
  {url:'/projects/',name:'projects-zh'},
  {url:'/skills/',name:'skills-zh'},
  {url:'/blog/',name:'blog-zh'},
  {url:'/prompts/',name:'prompts-zh'},
  {url:'/prompts/agent-efficient-execution-v3/',name:'prompts-detail-zh'},
  {url:'/eao/',name:'eao-zh'},
  {url:'/toolscout/en/',name:'toolscout-en'},
 ];
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const item of pages){
   await page.goto(item.url,{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('body')).toBeAttached();
   if(item.url.includes('/prompts/agent-efficient-execution-v3/'))await expect(page.locator('#prompt-article')).not.toBeEmpty();
   await page.screenshot({path:path.join(folder,item.name+'.png'),animations:'disabled',fullPage:false});
 }
});
