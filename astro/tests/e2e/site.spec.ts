import { test, expect } from '@playwright/test';

test('global navigation routes and selected state work', async ({page}) => {
 await page.goto('/');
 await expect(page.locator('.site-header .nav-pill')).toHaveCount(5);
 await expect(page.locator('#journey')).toBeAttached();
 await expect(page.locator('.home-section-nav a[href="#journey"]')).toBeVisible();
 await page.locator('.site-header .nav-pill[href="/prompts/"]').click();
 await expect(page).toHaveURL(/\/prompts\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/prompts/');
 await page.locator('.site-header .lang a').filter({hasText:'EN'}).click();
 await expect(page).toHaveURL(/\/en\/prompts\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/en/prompts/');
 await page.locator('.site-header .nav-pill[href="/en/blog/"]').click();
 await expect(page).toHaveURL(/\/en\/blog\/$/);
 await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href','/en/blog/');
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
 await expect(page.locator('.site-section-card')).toHaveCount(2);
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
   await expect(page.locator('#skills .skill-card')).toHaveCount(2);
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
