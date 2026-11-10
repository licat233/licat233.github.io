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
