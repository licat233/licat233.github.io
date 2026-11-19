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

test('Hero starts invisible, reveals each line from depth, then scans only the second line', async ({page})=>{
 test.setTimeout(90000);
 for(const route of ['/', '/en/']){
  for(const viewport of [{width:1350,height:940},{width:390,height:844}]){
   await page.setViewportSize(viewport);
   await page.emulateMedia({reducedMotion:'no-preference'});
   const errors:string[]=[];
   const onError=(error:Error)=>errors.push(error.message);
   page.on('pageerror',onError);

   let releaseGsap!:()=>void;
   const gsapGate=new Promise<void>(resolve=>{releaseGsap=resolve;});
   await page.route('**/gsap@3.15.0/dist/gsap.min.js',async route=>{
    await gsapGate;
    await route.continue();
   });
   await page.goto(route,{waitUntil:'domcontentloaded',timeout:30000});

   // Freeze the optional animation loader to inspect the true first frame.
   await expect(page.locator('html')).toHaveClass(/hero-motion-pending/);
   await expect(page.locator('.hero-title')).toHaveCSS('visibility','hidden');
   releaseGsap();

   await expect(page.locator('.hero-title')).toHaveAttribute('data-motion-state','first-line',{timeout:30000});
   await page.waitForTimeout(120);
   const firstFlight=await page.evaluate(()=>{
    const inspect=(el:Element)=>{
     const style=getComputedStyle(el);
     return {opacity:Number(style.opacity),y:new DOMMatrixReadOnly(style.transform).m42};
    };
    return {
     first:[...document.querySelectorAll('.hero-word-primary .hero-char')].map(inspect),
     second:[...document.querySelectorAll('.hero-word-source .hero-char')].map(inspect)
    };
   });
   expect(firstFlight.first.some(g=>g.opacity>.05&&g.y < -2)).toBe(true);
   expect(firstFlight.second.every(g=>g.opacity<.01)).toBe(true);

   await expect(page.locator('.hero-title')).toHaveAttribute('data-motion-state','second-line',{timeout:15000});
   await page.waitForTimeout(220);
   const secondFlight=await page.evaluate(()=>{
    const inspect=(el:Element)=>{
     const style=getComputedStyle(el);
     return {opacity:Number(style.opacity),y:new DOMMatrixReadOnly(style.transform).m42};
    };
    return {
     first:[...document.querySelectorAll('.hero-word-primary .hero-char')].map(inspect),
     second:[...document.querySelectorAll('.hero-word-source .hero-char')].map(inspect),
     secondColors:[...document.querySelectorAll('.hero-word-source .hero-char')].map(el=>getComputedStyle(el).color),
     baseColor:getComputedStyle(document.querySelector('.hero-word-source .hero-char')!).color,
     blueColor:getComputedStyle(document.querySelector('.hero-word-secondary')!).color
    };
   });
   expect(secondFlight.first.every(g=>g.opacity>.99&&Math.abs(g.y)<1.5)).toBe(true);
   expect(secondFlight.baseColor).not.toBe(secondFlight.blueColor);
   expect(secondFlight.secondColors.every(color=>color===secondFlight.baseColor)).toBe(true);

   await expect(page.locator('.hero-title')).toHaveAttribute('data-motion-state','scanning',{timeout:15000});
   await page.waitForFunction(()=>Number(getComputedStyle(document.querySelector('.hero-scan-line')!).opacity)>.8,{timeout:5000});
   const scanStart=await page.evaluate(()=>{
    const accent=document.querySelector<HTMLElement>('.hero-word-secondary')!;
    const scan=document.querySelector<HTMLElement>('.hero-scan-line')!;
    const second=[...document.querySelectorAll('.hero-word-source .hero-char')];
    return {
     allSecondSettled:second.every(el=>{
      const style=getComputedStyle(el);
      return Number(style.opacity)>.99&&Math.abs(new DOMMatrixReadOnly(style.transform).m42)<1.5;
     }),
     secondColors:[...document.querySelectorAll('.hero-word-source .hero-char')].map(el=>getComputedStyle(el).color),
     baseColor:getComputedStyle(document.querySelector('.hero-word-source .hero-char')!).color,
     scanOpacity:Number(getComputedStyle(scan).opacity)
    };
   });
   expect(scanStart.allSecondSettled).toBe(true);
   expect(scanStart.scanOpacity).toBeGreaterThan(.8);

   await page.waitForFunction(()=>{
    const accent=document.querySelector<HTMLElement>('.hero-word-secondary')!;
    const scan=document.querySelector<HTMLElement>('.hero-scan-line')!;
    const a=accent.getBoundingClientRect(),s=scan.getBoundingClientRect();
    const progress=(s.left+s.width/2-a.left)/a.width;
    return progress>=.2&&progress<=.8;
   },{timeout:10000});
   const midScan=await page.evaluate(()=>{
    const accent=document.querySelector<HTMLElement>('.hero-word-secondary')!;
    const scan=document.querySelector<HTMLElement>('.hero-scan-line')!;
    const a=accent.getBoundingClientRect();
    const s=scan.getBoundingClientRect();
    return {
     scanProgress:(s.left+s.width/2-a.left)/a.width,
     colors:[...document.querySelectorAll('.hero-word-source .hero-char')].map(el=>getComputedStyle(el).color),
     blueColor:getComputedStyle(accent).color,
     baseColor:getComputedStyle(document.querySelector('.hero-word-source .hero-char')!).color,
     scanOpacity:Number(getComputedStyle(scan).opacity),
     scanInside:s.left>=a.left-1&&s.right<=a.right+1,
     scanHeightMatches:Math.abs(s.height-a.height)<2,
     overflowX:document.documentElement.scrollWidth-innerWidth
    };
   });
   expect(midScan.scanProgress).toBeGreaterThan(.2);
   expect(midScan.scanProgress).toBeLessThan(.8);
   expect(midScan.colors.some(color=>color===midScan.blueColor)).toBe(true);
   expect(midScan.colors.some(color=>color!==midScan.blueColor)).toBe(true);
   expect(midScan.scanOpacity).toBeGreaterThan(.8);
   expect(midScan.scanInside).toBe(true);
   expect(midScan.scanHeightMatches).toBe(true);
   expect(midScan.overflowX).toBeLessThanOrEqual(2);

   await expect(page.locator('.hero-title')).toHaveAttribute('data-motion-state','complete',{timeout:15000});
   const final=await page.evaluate(()=>{
    const accent=document.querySelector<HTMLElement>('.hero-word-secondary')!;
    const scan=document.querySelector<HTMLElement>('.hero-scan-line')!;
    const colors=[...document.querySelectorAll('.hero-word-source .hero-char')].map(el=>getComputedStyle(el).color);
    return {
     colors,
     finalColor:getComputedStyle(accent).color,
     scanOpacity:Number(getComputedStyle(scan).opacity),
     accessibleTitle:document.querySelector('.hero-title')?.getAttribute('aria-label'),
     overflowX:document.documentElement.scrollWidth-innerWidth
    };
   });
   expect(final.colors.every(color=>color===final.finalColor)).toBe(true);
   expect(final.scanOpacity).toBeLessThan(.01);
   expect(final.accessibleTitle).toBeTruthy();
   expect(final.overflowX).toBeLessThanOrEqual(2);
   expect(errors).toEqual([]);
   page.off('pageerror',onError);
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
 await expect.poll(()=>page.evaluate(()=>Boolean((window as any).gsap)),
   {timeout:18000}).toBe(true);
 expect(await page.evaluate(()=>Boolean((window as any).__licatScrollScenesReady))).toBe(false);
 expect(await page.evaluate(()=>Boolean((window as any).__gsapJourneyV2))).toBe(false);
 await page.evaluate(()=>window.scrollTo({top:450,behavior:'instant'}));
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
