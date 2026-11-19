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
 // Prompts is now an AI child; the keyboard first expands the disclosure.
 const trigger=page.locator('.site-header .nav-submenu-trigger');
 await trigger.focus();
 await page.keyboard.press('Enter');
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 const child=page.locator('.site-header .ai-subnav a[href="/prompts/"]');
 await expect(child).toBeVisible();
 await child.focus();
 await page.keyboard.press('Enter');
 await expect(page).toHaveURL(/\/prompts\/$/);
});

// Motion initialization must not compete with the initial desktop render.
// Hero animation stays active; below-the-fold timelines initialize on demand.

test('Hero starts without third-party libraries and never re-hides its static shell',async ({page})=>{
 test.setTimeout(90000);
 for(const route of ['/en/','/']){
  for(const viewport of [{width:1350,height:940},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await page.emulateMedia({reducedMotion:'no-preference'});
   const errors:string[]=[];
   const onError=(e:Error)=>errors.push(e.message);
   page.on('pageerror',onError);
   // Cold-load the hero even when all optional animation dependencies fail.
   await page.route('**/assets/vendor/gsap/**',r=>r.abort());
   await page.addInitScript(()=>{
     const state={hidden:false,frames:0};
     (window as any).__heroShell=state;
     const observe=()=>{
       const nodes=['.site-header','.system-flow','.eyebrow','.hero-subtitle','.hero-actions','.hero-resources'].map(s=>document.querySelector(s));
       if(nodes.every(Boolean)){
         state.frames++;
         if(nodes.some(n=>{const c=getComputedStyle(n!);return Number(c.opacity)<=.1||c.visibility==='hidden'}))state.hidden=true;
       }
       if(document.querySelector('.hero-title')?.getAttribute('data-motion-state')!=='complete')requestAnimationFrame(observe);
     };
     requestAnimationFrame(observe);
   });
   await page.goto(route,{waitUntil:'domcontentloaded',timeout:30000});
   const title=page.locator('.hero-title');
   await expect(title).toHaveClass(/hero-native-motion/);
   await expect(title).toHaveCSS('visibility','visible');
   expect(await title.locator('.hero-word-primary .hero-char').count()).toBeGreaterThan(0);
   if(route==='/en/'){
     const second=title.locator('.hero-word-source .hero-char');
     const frames=await second.first().evaluate(el=>el.getAnimations().flatMap(a=>(a.effect as KeyframeEffect).getKeyframes()).map(k=>k.transform));
     expect(frames.some(v=>typeof v==='string'&&v.includes('translateY'))).toBe(true);
     await expect(title.locator('.hero-scan-line')).toHaveCount(1);
   }else{
     await expect(title.locator('.hero-script-art path[data-glyph]')).toHaveCount(5);
     await expect(title.locator('.hero-writing-stroke')).toHaveCount(28);
     await expect(title.locator('.hero-script-scan')).toHaveCount(0);
   }
   await expect(title).toHaveAttribute('data-motion-state','complete',{timeout:15000});
   expect(await page.evaluate(()=>(window as any).__heroShell.hidden)).toBe(false);
   expect(await page.evaluate(()=>Boolean((window as any).gsap))).toBe(false);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(2);
   if(route==='/en/'){
      const settled=await title.locator('.hero-word-source .hero-char').evaluateAll(els=>els.every(el=>getComputedStyle(el).opacity==='1'&&getComputedStyle(el).color===getComputedStyle(el.closest('.hero-word-secondary')!).color));
      expect(settled).toBe(true);
      await expect(title.locator('.hero-scan-line')).toHaveCSS('opacity','0');
   }else await expect(title.locator('.hero-script-art')).toHaveCSS('mask-image','none');
   expect(errors).toEqual([]);
   page.off('pageerror',onError);
   await page.unroute('**/assets/vendor/gsap/**');
  }
 }
});

test('desktop defers below-fold motion while preserving project and journey animation',async ({page})=>{
 test.setTimeout(80000);
 await page.setViewportSize({width:1350,height:940});
 await page.emulateMedia({reducedMotion:'no-preference'});
 const errors:string[]=[];
 const onError=(e:Error)=>errors.push(e.message);
 page.on('pageerror',onError);
 await page.goto('/',{waitUntil:'load',timeout:30000});
 expect(await page.evaluate(()=>Boolean((window as any).gsap))).toBe(false);
 expect(await page.evaluate(()=>Boolean((window as any).__licatScrollScenesReady))).toBe(false);
 expect(await page.evaluate(()=>Boolean((window as any).__gsapJourneyV2))).toBe(false);
 await page.evaluate(()=>document.querySelector('#projects')?.scrollIntoView({behavior:'instant'}));
 await expect.poll(()=>page.evaluate(()=>Boolean((window as any).__licatScrollScenesReady)),
   {timeout:15000}).toBe(true);
 await expect(page.locator('#projects .project').first()).toBeAttached();
 await page.evaluate(()=>document.querySelector('#journey')?.scrollIntoView({behavior:'instant'}));
 await expect.poll(()=>page.evaluate(()=>Boolean((window as any).__gsapJourneyV2)),
   {timeout:15000}).toBe(true);
 await expect(page.locator('#stage-frame')).toBeVisible();
 await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
 await expect.poll(()=>page.evaluate(()=>window.scrollY),{timeout:10000}).toBeLessThan(80);
 await expect(page.locator('.site-header')).toBeVisible();
 expect(errors).toEqual([]);
 page.off('pageerror',onError);
});
