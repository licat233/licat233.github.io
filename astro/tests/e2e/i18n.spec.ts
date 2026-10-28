import { test, expect } from '@playwright/test';

const paths = ['', 'projects/', 'ai/', 'skills/', 'blog/', 'prompts/'];

for (const suffix of paths) {
  test('Astro i18n URLs, nav and alternates: '+(suffix||'home'), async ({ page }) => {
    for (const lang of ['zh', 'en'] as const) {
      const url = (lang === 'zh' ? '/' : '/en/') + suffix;
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await expect(page.locator('html')).toHaveAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://licat233.github.io' + url);
      const selected=page.locator(suffix==='skills/'||suffix==='prompts/'
        ? '.site-header .ai-subnav [aria-current="page"]'
        : '.site-header .nav-pill[aria-current="page"]');
      await expect(selected).toHaveAttribute('href', url);
      if(suffix==='skills/'||suffix==='prompts/'){
        await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute(
          'href',lang==='zh'?'/ai/':'/en/ai/');
      }
      await expect(page.locator('.site-header .lang a[data-locale="zh"]')).toHaveAttribute('href', '/' + suffix);
      await expect(page.locator('.site-header .lang a[data-locale="en"]')).toHaveAttribute('href', '/en/' + suffix);
      await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://licat233.github.io/' + suffix);
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://licat233.github.io/en/' + suffix);
    }
  });
}

test('translated Blog articles retain their exact language counterpart', async ({ page }) => {
  await page.goto('/blog/publish-markdown-notes/');
  await expect(page.locator('.site-header a[data-locale="en"]')).toHaveAttribute('href', '/en/blog/publish-markdown-notes/');
  await page.locator('.site-header a[data-locale="en"]').click();
  await expect(page).toHaveURL(/\/en\/blog\/publish-markdown-notes\/$/);
  await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://licat233.github.io/blog/publish-markdown-notes/');
});

test('untranslated Blog posts never advertise fake English translations', async ({ page }) => {
  await page.goto('/blog/advanced-seo-geo-guide/');
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(0);
  await expect(page.locator('.site-header a[data-locale="en"]')).toHaveAttribute('href', '/en/blog/');
});

test('prompts preserve selected ID during Astro-managed locale switch', async ({ page }) => {
  await page.goto('/prompts/?p=codex-workflow-tips');
  await expect(page.locator('.site-header a[data-locale="en"]')).toHaveAttribute('href', '/en/prompts/?p=codex-workflow-tips');
  await page.locator('.site-header a[data-locale="en"]').click();
  await expect(page).toHaveURL(/\/en\/prompts\/\?p=codex-workflow-tips$/);
  await expect(page.locator('#prompt-article')).not.toBeEmpty();
  await expect(page.locator('.site-header a[data-locale="zh"]')).toHaveAttribute('href', '/prompts/?p=codex-workflow-tips');
});

test('legacy Chinese alias redirects to canonical homepage', async ({ page }) => {
  await page.goto('/zh/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://licat233.github.io/');
});
