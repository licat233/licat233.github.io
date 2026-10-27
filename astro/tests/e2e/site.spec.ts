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
