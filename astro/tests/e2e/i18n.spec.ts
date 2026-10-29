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

test('untranslated Blog posts never advertise fake English translations', async ({ page }) => {
  await page.goto('/blog/advanced-seo-geo-guide/');
  await expect(page.locator('link[hreflang="en"]')).toHaveCount(0);
  await expect(page.locator('.site-header a[data-locale="en"]')).toHaveAttribute('href', '/en/blog/');
});

test('prompt detail pages preserve ID and language-specific canonical URLs', async ({ page }) => {
  await page.goto('/prompts/codex-workflow-tips/');
  await expect(page.locator('.site-header a[data-locale="en"]')).toHaveAttribute('href', '/en/prompts/codex-workflow-tips/');
  await page.locator('.site-header a[data-locale="en"]').click();
  await expect(page).toHaveURL(/\/en\/prompts\/codex-workflow-tips\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://licat233.github.io/en/prompts/codex-workflow-tips/');
  await expect(page.locator('#prompt-article')).not.toBeEmpty();
  await expect(page.locator('.site-header a[data-locale="zh"]')).toHaveAttribute('href', '/prompts/codex-workflow-tips/');
});

test('legacy Chinese alias redirects to canonical homepage', async ({ page }) => {
  await page.goto('/zh/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://licat233.github.io/');
});

test('featured and directory project links retain the language of their entry page', async ({ page, request }) => {
  for (const [route, expected] of [
    ['/', 'zh-CN'], ['/en/', 'en'],
    ['/projects/', 'zh-CN'], ['/en/projects/', 'en'],
  ] as const) {
    await page.goto(route);
    const links = await page.locator('.hero-resources a.hero-resource, #projects .projects a.project, .site-section-grid a.site-section-card')
      .evaluateAll(elements => elements.map(element => element.getAttribute('href')).filter((href): href is string => Boolean(href)));
    expect(links.length, 'No project links on ' + route).toBeGreaterThan(0);
    for (const href of new Set(links)) {
      // Lottery calculator is a single, language-neutral legacy application.
      if (href === '/lottery-calculate/') continue;
      expect(href.startsWith('/'), 'External/unknown project link on ' + route).toBe(true);
      const response = await request.get(href);
      expect(response.ok(), 'Broken project link ' + route + ' -> ' + href).toBe(true);
      const html = await response.text();
      const actual = /<html\b[^>]*\blang=['"]([^'"]+)['"]/.exec(html)?.[1];
      expect(actual, 'Wrong project language ' + route + ' -> ' + href).toBe(expected);
    }
  }
});
