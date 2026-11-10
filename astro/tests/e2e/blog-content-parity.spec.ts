import { test, expect } from '@playwright/test';

// Check the current published articles, rather than comparing their text with
// a live snapshot: editorial improvements must not be treated as regressions.
test('Blog articles keep canonical SEO metadata and readable content after updates', async ({ page }) => {
  const routes = [
    '/blog/website-seo-geo-basics/',
    '/blog/advanced-seo-geo-guide/',
    '/blog/seo-keyword-research-guide/',
    '/blog/ga4-gtm-lead-tracking/',
    '/en/blog/seo-keyword-research-guide/',
    '/en/blog/ga4-gtm-lead-tracking/',
    '/blog/overseas-b2b-social-media-infrastructure-guide/',
    '/en/blog/overseas-b2b-social-media-infrastructure-guide/',
  ];

  for (const route of routes) {
    const response = await page.goto('http://127.0.0.1:4321' + route, {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status(), route).toBe(200);

    const data = await page.evaluate(() => {
      const prose = document.querySelector('.blog-prose');
      const headline = document.querySelector('.blog-article-header h1')?.textContent?.trim() ?? '';
      const schema = [...document.querySelectorAll('script[type="application/ld+json"]')]
        .map(script => {
          try { return JSON.parse(script.textContent ?? '{}'); }
          catch { return {}; }
        })
        .find(item => item['@type'] === 'BlogPosting');

      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute('content'),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        headline,
        proseChars: (prose?.textContent ?? '').trim().length,
        proseH1Count: prose?.querySelectorAll('h1').length ?? 0,
        internalBlogLinks: prose?.querySelectorAll('a[href^="/blog/"], a[href^="/en/blog/"]').length ?? 0,
        articleHeadline: schema?.headline,
        articleUrl: schema?.mainEntityOfPage?.['@id'],
      };
    });

    expect(data.headline.length, route).toBeGreaterThan(5);
    expect(data.title, route).toContain(data.headline);
    expect(data.description?.length, route).toBeGreaterThan(20);
    expect(data.canonical, route).toBe('https://licat.xyz' + route);
    expect(data.proseChars, route).toBeGreaterThan(1000);
    expect(data.proseH1Count, route).toBe(0);
    expect(data.internalBlogLinks, route).toBeGreaterThan(0);
    expect(data.articleHeadline, route).toBe(data.headline);
    expect(data.articleUrl, route).toBe('https://licat.xyz' + route);
  }
});


test('Blog table of contents follows article headings on desktop and mobile', async ({ page }) => {
  const route = '/blog/seo-keyword-research-guide/';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4321' + route, { waitUntil: 'domcontentloaded' });

  const headings = page.locator('.blog-prose h2[id], .blog-prose h3[id]');
  const desktopToc = page.locator('.blog-toc-desktop');
  const desktopLinks = desktopToc.locator('[data-blog-toc-link]');
  await expect(desktopToc).toBeVisible();
  expect(await desktopToc.evaluate(element => getComputedStyle(element).position)).toBe('sticky');
  expect(await desktopLinks.count()).toBe(await headings.count());

  const firstLink = desktopLinks.first();
  const targetId = await firstLink.getAttribute('data-blog-toc-link');
  expect(targetId).toBeTruthy();
  await firstLink.click();
  await expect.poll(() => page.evaluate(() => location.hash)).not.toBe('');
  await expect.poll(() =>
    desktopToc.locator('[data-blog-toc-link][aria-current="location"]').getAttribute('data-blog-toc-link')
  ).toBe(targetId);

  // Long articles must keep the active entry visible inside the independently
  // scrollable sticky TOC, rather than highlighting an off-screen item.
  await page.goto('http://127.0.0.1:4321/blog/overseas-b2b-social-media-infrastructure-guide/', {
    waitUntil: 'domcontentloaded',
  });
  const longToc = page.locator('.blog-toc-desktop');
  const lastHeading = page.locator('.blog-prose h2[id], .blog-prose h3[id]').last();
  const lastHeadingId = await lastHeading.getAttribute('id');
  await lastHeading.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() =>
    longToc.locator('[data-blog-toc-link][aria-current="location"]').getAttribute('data-blog-toc-link')
  ).toBe(lastHeadingId);
  await expect.poll(() => longToc.evaluate(element => element.scrollTop)).toBeGreaterThan(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4321' + route, { waitUntil: 'domcontentloaded' });
  const mobileToc = page.locator('.blog-toc-mobile');
  await expect(mobileToc).toBeVisible();
  expect(await mobileToc.evaluate(element => element.open)).toBe(false);

  await mobileToc.locator('summary').click();
  await expect(mobileToc).toHaveAttribute('open', '');
  await mobileToc.locator('[data-blog-toc-link]').first().click();
  await expect.poll(() => page.evaluate(() => location.hash)).not.toBe('');
  await expect(mobileToc).not.toHaveAttribute('open', '');
});