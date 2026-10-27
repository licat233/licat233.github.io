import { test, expect } from '@playwright/test';

// Actual animation behavior must be checked separately from reduced-motion
// Jekyll/Astro screenshots. Each page is a fresh context.
test('Astro home GSAP entrance, scroll and reduced-motion behavior remain usable',async ({page})=>{
 test.setTimeout(80000);
 for(const mode of ['no-preference','reduce'] as const){
   await page.emulateMedia({reducedMotion:mode});
   const errors:string[]=[];
   const onError=(e:Error)=>errors.push(e.message);
   page.on('pageerror',onError);
   await page.goto('/',{waitUntil:'load',timeout:30000});
   await page.waitForTimeout(mode==='no-preference'?2600:350);
   const result=await page.evaluate(()=>{
     const visible=(selector:string)=>{
       const el=document.querySelector(selector);
       if(!el)return false;
       const r=el.getBoundingClientRect();
       const css=getComputedStyle(el);
       return r.width>0&&r.height>0&&Number(css.opacity)>.7&&css.visibility!=='hidden';
     };
     return {hasGSAP:typeof (window as any).gsap==='function'||typeof (window as any).gsap==='object',
       hasScrollTrigger:typeof (window as any).ScrollTrigger!=='undefined',
       header:visible('.site-header'),
       hero:visible('.hero')};
   });
   expect(result.header,'Header disappeared in '+mode).toBe(true);
   expect(result.hero,'Hero disappeared in '+mode).toBe(true);
   const oldY=await page.evaluate(()=>window.scrollY);
   await page.locator('#journey').scrollIntoViewIfNeeded({timeout:12000});
   await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:12000}).toBeGreaterThan(oldY+80);
   await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
   await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:12000}).toBeLessThan(80);
   expect(errors,'Runtime page exceptions in '+mode).toEqual([]);
   console.log('ASTRO_SCROLL_MOTION',JSON.stringify({mode,...result,errors:errors.length}));
   page.off('pageerror',onError);
 }
});
test('desktop and mobile keyboard access to global nav works',async ({page})=>{
 await page.goto('/blog/');
 const nav=page.locator('.site-header');
 await expect(nav).toBeVisible();
 await page.keyboard.press('Tab');
 const hasVisibleFocus=await page.evaluate(()=>{
   const el=document.activeElement as HTMLElement|null;
   return Boolean(el&&el!==document.body&&el.matches('a,button,input,[tabindex]'));
 });
 expect(hasVisibleFocus,'No keyboard-focusable site control').toBe(true);
 await expect(page.locator('html')).toHaveAttribute('lang','zh-CN');
 await page.locator('.site-header a[href="/prompts/"]').first().focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/prompts\/$/);
});
