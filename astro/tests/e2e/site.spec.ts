import { test, expect } from '@playwright/test';
import { readdir, access } from 'node:fs/promises';
import path from 'node:path';
const discoveredSkillCountPromise=(async ()=>{
  const entries=await readdir(path.resolve(process.cwd(),'../skills'),{withFileTypes:true});
  const slugs=entries.filter(e=>e.isDirectory()&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(e.name)).map(e=>e.name);
  const real=await Promise.all(slugs.map(async slug=>{
    try{await access(path.resolve(process.cwd(),'../skills',slug,'SKILL.md'));return true}
    catch{return false}
  }));
  return real.filter(Boolean).length;
})();

test('global navigation nests Skills and Prompts under AI', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('.site-header .nav-pill')).toHaveCount(4);
 await expect(page.locator('#journey')).toBeAttached();
 await expect(page.locator('.home-section-nav a[href="#journey"]')).toBeVisible();
 const trigger=page.locator('.site-header .nav-submenu-trigger');
 await trigger.click();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('.site-header .ai-subnav a')).toHaveCount(2);
 await page.locator('.site-header .ai-subnav a[href="/prompts/"]').click();
 await expect(page).toHaveURL(/\/prompts\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/ai/');
 await expect(page.locator('.site-header .ai-subnav a[aria-current="page"]')).toHaveAttribute('href','/prompts/');
 await page.locator('.site-header .lang a').filter({hasText:'EN'}).click();
 await expect(page).toHaveURL(/\/en\/prompts\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/en/ai/');
 await expect(page.locator('.site-header .ai-subnav a[aria-current="page"]')).toHaveAttribute('href','/en/prompts/');
 await page.locator('.site-header .nav-pill[href="/en/blog/"]').click();
 await expect(page).toHaveURL(/\/en\/blog\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/en/blog/');
});

test('AI subnavigation supports Escape, keyboard and mobile click without clipping',async ({page})=>{
 await page.goto('/en/skills/');
 const trigger=page.locator('.site-header .nav-submenu-trigger');
 await trigger.click();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 const menu=page.locator('.site-header .ai-subnav');
 await expect(menu).toBeVisible();
 const position=await menu.evaluate(el=>{
  const menu=el.getBoundingClientRect();
  const header=document.querySelector('.site-header')!.getBoundingClientRect();
  return {width:menu.width,overlap:menu.bottom-header.bottom};
 });
 expect(position.width).toBeGreaterThan(100);
 expect(position.overlap).toBeGreaterThan(0);
 // Bounding boxes can extend outside their container but still be paint-clipped.
 const hitTest=await menu.evaluate(el=>{
   const header=document.querySelector<HTMLElement>('.site-header')!;
   const links=[...el.querySelectorAll<HTMLAnchorElement>('a')];
   return {
     headerOverflow:getComputedStyle(header).overflow,
     reachable:links.map(link=>{
       const r=link.getBoundingClientRect();
       const target=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);
       return target===link || link.contains(target);
     })
   };
 });
 expect(hitTest.headerOverflow).toBe('visible');
 expect(hitTest.reachable).toEqual([true,true]);
 await page.keyboard.press('Escape');
 await expect(menu).toBeHidden();
 await trigger.click();
 await page.locator('.site-header .ai-subnav a[href="/en/prompts/"]').click();
 await expect(page).toHaveURL(/\/en\/prompts\/$/);
});

test('prompt library search, detail and share deep links work', async ({page}) => {
 await page.goto('/prompts/');
 await expect(page.locator('#library-view')).toBeVisible();
 await page.locator('#search').fill('Codex');
 await expect(page.locator('#prompt-grid [data-open]').first()).toBeVisible();
 await page.locator('#prompt-grid [data-open]').first().click();
 await expect(page.locator('#detail-view')).toBeVisible();
 await expect(page).toHaveURL(/\?p=[\w.-]+$/);
 await expect(page.locator('#prompt-article')).not.toBeEmpty();
 const deepLink=page.url();
 await page.reload();
 await expect(page).toHaveURL(deepLink);
 await expect(page.locator('#detail-view')).toBeVisible();
 await page.locator('#back-link').click();
 await expect(page.locator('#library-view')).toBeVisible();
});
test('English prompt library displays its translated copy', async ({page}) => {
 await page.goto('/en/prompts/?p=agent-efficient-execution-v3');
 await expect(page.locator('#detail-view')).toBeVisible();
 await expect(page.locator('#prompt-article')).toContainText(/execution agent/i);
 await expect(page.locator('#copy-btn')).toBeEnabled();
});

test('theme preference persists between content pages',async ({page})=>{
 await page.goto('/');
 const toggle=page.locator('.site-header .theme-toggle');
 const before=await page.locator('html').getAttribute('data-theme');
 await toggle.click();
 await expect.poll(()=>page.locator('html').getAttribute('data-theme')).not.toBe(before);
 const after=await page.locator('html').getAttribute('data-theme');
 await page.locator('.site-header .nav-pill[href="/blog/"]').click();
 await expect(page.locator('html')).toHaveAttribute('data-theme',after!);
});

test('project and Skill pages load with correct site hierarchy',async ({page})=>{
 await page.goto('/projects/');
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/projects/');
 await expect(page.locator('.site-section-card')).toHaveCount(8);
 await page.locator('.site-section-card[href="/eao/"]').click();
 await expect(page).toHaveURL(/\/eao\/$/);
 await expect(page.locator('.site-context')).toContainText('Enterprise AI Office');
 await expect(page.locator('.site-context a[href="/projects/"]').first()).toBeVisible();
 await page.goto('/skills/');
 await expect(page.locator('.site-section-card')).toHaveCount(await discoveredSkillCountPromise);
});

test('critical local links and assets return no HTTP errors', async ({page}) => {
 const failures: string[] = [];
 page.on('response', response => {
   if (response.url().startsWith('http://127.0.0.1:4321/') && response.status() >= 400)
     failures.push(response.status() + ' ' + response.url());
 });
 for (const route of ['/', '/en/', '/projects/', '/skills/', '/blog/', '/en/blog/',
                      '/prompts/', '/en/prompts/', '/eao/', '/toolscout/en/']) {
   await page.goto(route, {waitUntil:'domcontentloaded'});
   await expect(page.locator('main').first()).toBeAttached();
   await page.waitForTimeout(120);
 }
 await page.goto('/prompts/?p=codex-workflow-tips');
 await expect(page.locator('#prompt-article')).not.toBeEmpty();
 expect(failures, 'Broken local resources: ' + failures.join(', ')).toEqual([]);
});

test('prompt copy and cross-language sharing preserve the selected prompt', async ({page,context}) => {
 await context.grantPermissions(['clipboard-read','clipboard-write'], {
   origin: 'http://127.0.0.1:4321'
 });
 await page.goto('/prompts/?p=codex-workflow-tips');
 await expect(page.locator('#copy-btn')).toBeEnabled();
 await expect(page.locator('.site-header .lang a').filter({hasText:'EN'}))
   .toHaveAttribute('href','/en/prompts/?p=codex-workflow-tips');
 await page.locator('#copy-btn').click();
 await expect(page.locator('#toast')).toContainText(/已复制/);
 const copied=await page.evaluate(() => navigator.clipboard.readText());
 expect(copied.length).toBeGreaterThan(100);
});

test('homepage project and Skill previews share one bilingual data structure',async ({page})=>{
 const expected=['Enterprise AI Office','OpenCore · Haswell H81','ToolScout',
 'ai-writing-audit','armor-memory','lottery-calculate','GreenRAM','disable-macos-auto-updates'];
 for(const url of ['/','/en/']){
   await page.goto(url);
   const cards=page.locator('#projects .projects > a.project');
   await expect(cards).toHaveCount(8);
   await expect(cards.locator('h3')).toHaveText(expected);
   await expect(page.locator('#skills .skill-card')).toHaveCount(await discoveredSkillCountPromise);
   await expect(page.locator('#skills .skill-card h3'))
     .toHaveText(['design-liquid-glass-ui','reversible-scroll-motion']);
   await expect(cards.first().locator('.project-icon svg')).toBeAttached();
 }
});

test('both prompt languages render the shared catalog UI and all 15 items',async ({page})=>{
 for(const url of ['/prompts/','/en/prompts/']){
   await page.goto(url);
   await expect(page.locator('#prompt-grid .prompt-card')).toHaveCount(15);
   await expect(page.locator('#filters [data-filter]')).toHaveCount(5);
   await expect(page.locator('#copy-btn')).toBeAttached();
   await expect(page.locator('#share-btn')).toBeAttached();
 }
});

test('single Astro prompt catalogue powers SSR cards and search without second JS copy',async ({page})=>{
 for(const lang of ['','en/']){
   await page.goto('/'+lang+'prompts/');
   const data=await page.locator('#prompt-catalogue').textContent();
   const payload=JSON.parse(data!);
   expect(payload.items).toHaveLength(15);
   expect(payload.translatedEnglish).toHaveLength(12);
   await expect(page.locator('#prompt-grid [data-open]')).toHaveCount(15);
   await page.locator('#search').fill(lang?'memory':'记忆');
   await expect(page.locator('#prompt-grid [data-open]').first()).toBeVisible();
   await page.locator('#search').fill('');
 }
});

test('Projects and Skills directories use original three-layer Liquid Glass', async ({page}) => {
 for(const route of ['/projects/','/en/projects/','/skills/','/en/skills/']){
   await page.goto(route);
   const cards=page.locator('.site-section-grid > .site-section-card');
   const count=route.includes('projects')?8:2;
   await expect(cards).toHaveCount(count);
   for(const mode of ['light','dark']){
     await page.evaluate(mode=>document.documentElement.setAttribute('data-theme',mode),mode);
     for(const card of await cards.all()){
       await expect(card).toHaveClass(/\bliquid-demo\b/);
       await expect(card.locator(':scope > .lg-glass-filter')).toHaveCount(1);
       await expect(card.locator(':scope > .lg-glass-overlay')).toHaveCount(1);
       await expect(card.locator(':scope > .lg-glass-specular')).toHaveCount(1);
     }
     const optical=await cards.first().evaluate(el=>{
       const filter=el.querySelector<HTMLElement>(':scope > .lg-glass-filter')!;
       const overlay=el.querySelector<HTMLElement>(':scope > .lg-glass-overlay')!;
       const specular=el.querySelector<HTMLElement>(':scope > .lg-glass-specular')!;
       const text=el.querySelector<HTMLElement>('h2')!;
       const card=getComputedStyle(el),blur=getComputedStyle(filter);
       return {
         cardBg:card.backgroundColor,
         blur:blur.backdropFilter||blur.webkitBackdropFilter,
         overlay:getComputedStyle(overlay).backgroundImage,
         rim:getComputedStyle(specular).boxShadow,
         textZ:getComputedStyle(text).zIndex,
         cardPosition:card.position
       };
     });
     expect(optical.cardBg).toMatch(/(?:rgba?\(0, 0, 0, 0\)|transparent|#0000)/);
     expect(optical.blur).toContain('blur(');
     expect(optical.overlay).toContain('linear-gradient');
     expect(optical.rim).toContain('inset');
     expect(Number(optical.textZ)).toBeGreaterThan(2);
     expect(optical.cardPosition).toBe('relative');
   }
 }
 // The existing homepage featured cards must keep their previously accepted
 // glass structure; do not fix the directory by changing the homepage UI.
 await page.goto('/');
 await expect(page.locator('#projects .project.liquid-demo')).toHaveCount(8);
 await expect(page.locator('#projects .project > .lg-glass-filter')).toHaveCount(8);
});

test('every Astro-owned glass surface uses the complete material in both languages',async ({page})=>{
 const routes=[
  {url:'/',minimum:23},{url:'/en/',minimum:23},
  {url:'/projects/',minimum:12},{url:'/en/projects/',minimum:12},
  {url:'/skills/',minimum:6},{url:'/en/skills/',minimum:6},
  {url:'/blog/',minimum:4},{url:'/en/blog/',minimum:4},
  {url:'/prompts/',minimum:4},{url:'/en/prompts/',minimum:4}
 ];
 for(const {url,minimum} of routes){
  await page.goto(url);
  const report=await page.evaluate(()=>{
   const nodes=[...document.querySelectorAll('.liquid-demo')];
   const classes=['lg-glass-filter','lg-glass-overlay','lg-glass-specular'];
   return {
    count:nodes.length,
    bad:nodes.flatMap(node=>{
     const children=[...node.children] as HTMLElement[];
     const layers=classes.map(name=>children.filter(child=>child.classList.contains(name)));
     const found=layers.every(items=>items.length===1 && items[0].getAttribute('aria-hidden')==='true');
     return found?[]:[{tag:node.tagName,classes:node.className,layers:layers.map(x=>x.length)}];
    }),
    cssLinked:!!document.querySelector('link[href*="portfolio-liquid-glass.css"]')
   };
  });
  expect(report.count, 'Glass surfaces missing on '+url).toBeGreaterThanOrEqual(minimum);
  expect(report.cssLinked, 'Optical CSS not loaded on '+url).toBe(true);
  expect(report.bad, 'Glass surfaces missing layers on '+url).toEqual([]);
 }
});

test('shared GlassSurface keeps link, button, nav, and footer semantics',async ({page})=>{
 for(const route of ['/','/en/']){
   await page.goto(route);
   await expect(page.locator('header.site-header.liquid-demo nav')).toBeVisible();
   await expect(page.locator('button.theme-toggle.liquid-demo')).toHaveCount(1);
   await expect(page.locator('.site-header a.github-cta.liquid-demo')).toHaveAttribute('href','https://github.com/licat233');
   await expect(page.locator('.hero-actions a.hero-cta.liquid-demo')).toHaveAttribute('href','/eao/');
   await expect(page.locator('footer.site-footer.liquid-demo')).toHaveCount(1);
   await expect(page.locator('#projects a.project.liquid-demo')).toHaveCount(8);
   await expect(page.locator('#skills article.skill-card.liquid-demo')).toHaveCount(await discoveredSkillCountPromise);
   await expect(page.locator('.principles article.principle.liquid-demo')).toHaveCount(3);
 }
});

test('bilingual Astro home does not hit unauthenticated GitHub REST or log malformed SVG',async ({page})=>{
  const errors:string[]=[];
  const forbidden:string[]=[];
  const dynamicApi:string[]=[];
  page.on('console',message=>{
    if(message.type()==='error' && /(?:<path> attribute d|Expected number)/i.test(message.text()))
      errors.push(message.text());
  });
  page.on('request',request=>{
    if(request.url().startsWith('https://api.github.com/'))dynamicApi.push(request.url());
  });
  page.on('response',response=>{
    if(response.url().startsWith('https://api.github.com/')&&response.status()>=400)
      forbidden.push(response.status()+' '+response.url());
  });
  for(const route of ['/','/en/']){
    await page.goto(route,{waitUntil:'load'});
    await expect(page.locator('.site-header .github-mark path')).toHaveCount(1);
    const result=await page.locator('.site-header .github-mark path').evaluate(el=>{
      const path=el as SVGPathElement;
      return {len:path.getTotalLength(),d:path.getAttribute('d')||''};
    });
    expect(result.len,'GitHub mark rendered as broken path').toBeGreaterThan(45);
    expect(result.d).toContain('M12 .297');
    await expect(page.locator('#skills .skill-card')).toHaveCount(await discoveredSkillCountPromise);
    await expect(page.locator('script[src*="portfolio-skills.js"]')).toHaveCount(0);
    await page.waitForTimeout(350);
  }
  expect(errors,'SVG parsing errors leaked into Chrome console').toEqual([]);
  expect(dynamicApi,'Site must not call GitHub REST in visitor browser').toEqual([]);
  expect(forbidden,'Unnecessary GitHub API 403s').toEqual([]);
});

test('AI toolkit links real published sources in both languages and preserves glass',async ({page})=>{
 for(const route of ['/ai/','/en/ai/']){
   await page.goto(route);
   await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href',route);
   const cards=page.locator('.site-section-grid > a.site-section-card');
   await expect(cards).toHaveCount(5);
   for(const card of await cards.all()){
     await expect(card).toHaveClass(/\bliquid-demo\b/);
     for(const name of ['lg-glass-filter','lg-glass-overlay','lg-glass-specular'])
       await expect(card.locator(':scope > .'+name)).toHaveCount(1);
   }
   const en=route.startsWith('/en/');
   await expect(cards.nth(0)).toHaveAttribute('href',en?'/en/skills/':'/skills/');
   await expect(cards.nth(1)).toHaveAttribute('href',en?'/en/prompts/':'/prompts/');
   await expect(cards.nth(2)).toHaveAttribute('href',en?'/toolscout/en/':'/toolscout/zh/');
   await expect(cards.nth(3)).toHaveAttribute('href',en?'/eao/en/':'/eao/');
   await expect(cards.nth(4)).toHaveAttribute('href',en?'/armor-memory/':'/armor-memory/zh/');
   await expect(page.locator('.site-header .lang a').filter({hasText:en?'中':'EN'}))
     .toHaveAttribute('href',en?'/ai/':'/en/ai/');
 }
});

