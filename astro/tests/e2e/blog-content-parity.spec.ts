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


test('Blog table of contents uses a single-open H2/H3 accordion on desktop and mobile', async ({ page }) => {
  const route = '/blog/seo-keyword-research-guide/';
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4321' + route, { waitUntil: 'domcontentloaded' });

  const headings = page.locator('.blog-prose h2[id], .blog-prose h3[id]');
  const desktopToc = page.locator('.blog-toc-desktop');
  const desktopLinks = desktopToc.locator('[data-blog-toc-link]');
  const toggles = desktopToc.locator('[data-blog-toc-toggle]');
  const globalToggle = desktopToc.locator('[data-blog-toc-global-toggle]');
  await expect(desktopToc).toBeVisible();
  expect(await desktopToc.evaluate(element => getComputedStyle(element).position)).toBe('sticky');
  expect(await desktopLinks.count()).toBe(await headings.count());
  expect(await toggles.count()).toBeGreaterThan(0);
  await expect(globalToggle).toHaveText('全部展开');
  await expect(desktopToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  for (let i = 0; i < await toggles.count(); i++) {
    await expect(toggles.nth(i)).toHaveAttribute('aria-expanded', 'false');
  }

  const firstToggle = toggles.nth(0);
  const firstSlug = await firstToggle.getAttribute('data-blog-toc-toggle');
  const firstChildrenId = await firstToggle.getAttribute('aria-controls');
  const firstChildren = desktopToc.locator('[id="' + firstChildrenId + '"]');
  await firstToggle.click();
  await expect(firstToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(firstChildren).toBeVisible();
  await expect(globalToggle).toHaveText('全部收起');

  if (await toggles.count() > 1) {
    const secondToggle = toggles.nth(1);
    const secondChildrenId = await secondToggle.getAttribute('aria-controls');
    const secondChildren = desktopToc.locator('[id="' + secondChildrenId + '"]');
    await secondToggle.click();
    await expect(secondToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(secondChildren).toBeVisible();
    await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(firstChildren).toBeHidden();
  }

  // The global action opens every H3 list, then closes them all in one click.
  await globalToggle.click();
  await expect(globalToggle).toHaveText('全部展开');
  await expect(desktopToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);
  await globalToggle.click();
  await expect(globalToggle).toHaveText('全部收起');
  await expect(desktopToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(await toggles.count());
  for (let i = 0; i < await toggles.count(); i++) {
    await expect(toggles.nth(i)).toHaveAttribute('aria-expanded', 'true');
  }
  // After a global expand, an individual arrow can close only its own chapter.
  await firstToggle.click();
  await expect(firstToggle).toHaveAttribute('aria-expanded', 'false');
  await expect(firstChildren).toBeHidden();
  await expect(desktopToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(await toggles.count() - 1);
  await expect(globalToggle).toHaveText('全部收起');
  await globalToggle.click();
  await expect(globalToggle).toHaveText('全部展开');
  await expect(desktopToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  // The chapter title navigates; the separate chevron controls expansion.
  const chapterLink = desktopToc.locator('.blog-toc-link--chapter').first();
  const targetId = await chapterLink.getAttribute('data-blog-toc-link');
  await chapterLink.click();
  await expect.poll(() => page.evaluate(() => decodeURIComponent(location.hash.slice(1)))).toBe(targetId);
  await expect.poll(() =>
    desktopToc.locator('[data-blog-toc-link][aria-current="location"]').getAttribute('data-blog-toc-link')
  ).toBe(targetId);

  // A long article stays compact initially: only H2 chapters are visible.
  await page.goto('http://127.0.0.1:4321/blog/overseas-b2b-social-media-infrastructure-guide/', {
    waitUntil: 'domcontentloaded',
  });
  const longToc = page.locator('.blog-toc-desktop');
  const longHeadings = page.locator('.blog-prose h2[id], .blog-prose h3[id]');
  const lastHeading = longHeadings.last();
  const lastHeadingInfo = await lastHeading.evaluate(element => {
    let chapter = element;
    while (chapter && chapter.tagName !== 'H2') chapter = chapter.previousElementSibling;
    return { id: element.id, tag: element.tagName, chapterId: chapter?.id ?? element.id };
  });
  expect(await longToc.locator('.blog-toc-item').count()).toBeLessThan(await longHeadings.count());
  await expect(longToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  await lastHeading.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const collapsedActiveId = lastHeadingInfo.tag === 'H3' ? lastHeadingInfo.chapterId : lastHeadingInfo.id;
  await expect.poll(() =>
    longToc.locator('[data-blog-toc-link][aria-current="location"]').getAttribute('data-blog-toc-link')
  ).toBe(collapsedActiveId);

  if (lastHeadingInfo.tag === 'H3') {
    const activeChapterToggle = longToc.locator('[data-blog-toc-toggle="' + lastHeadingInfo.chapterId + '"]');
    const activeChapterChildrenId = await activeChapterToggle.getAttribute('aria-controls');
    await activeChapterToggle.click();
    await expect(longToc.locator('[id="' + activeChapterChildrenId + '"]')).toBeVisible();
    await expect.poll(() =>
      longToc.locator('[data-blog-toc-link][aria-current="location"]').getAttribute('data-blog-toc-link')
    ).toBe(lastHeadingInfo.id);
    await expect.poll(() => longToc.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
  }

  // Mobile keeps its outer TOC disclosure and uses the same inner accordion.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4321' + route, { waitUntil: 'domcontentloaded' });
  const mobileToc = page.locator('.blog-toc-mobile');
  await expect(mobileToc).toBeVisible();
  expect(await mobileToc.evaluate(element => element.open)).toBe(false);

  await mobileToc.locator('summary').click();
  await expect(mobileToc).toHaveAttribute('open', '');
  await expect(mobileToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  const mobileGlobalToggle = mobileToc.locator('[data-blog-toc-global-toggle]');
  const mobileToggles = mobileToc.locator('[data-blog-toc-toggle]');
  await expect(mobileGlobalToggle).toHaveText('全部展开');
  await mobileGlobalToggle.click();
  await expect(mobileGlobalToggle).toHaveText('全部收起');
  await expect(mobileToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(await mobileToggles.count());
  await mobileGlobalToggle.click();
  await expect(mobileGlobalToggle).toHaveText('全部展开');
  await expect(mobileToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  const mobileToggle = mobileToggles.first();
  const mobileChildrenId = await mobileToggle.getAttribute('aria-controls');
  await mobileToggle.click();
  await expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
  await expect(mobileToc.locator('[id="' + mobileChildrenId + '"]')).toBeVisible();
  await expect(mobileGlobalToggle).toHaveText('全部收起');
  await mobileGlobalToggle.click();
  await expect(mobileGlobalToggle).toHaveText('全部展开');
  await expect(mobileToc.locator('.blog-toc-children:not([hidden])')).toHaveCount(0);

  await mobileToggle.click();
  const mobileChildLink = mobileToc.locator('.blog-toc-children a[data-blog-toc-link]').first();
  const mobileTargetId = await mobileChildLink.getAttribute('data-blog-toc-link');
  await mobileChildLink.click();
  await expect.poll(() => page.evaluate(() => decodeURIComponent(location.hash.slice(1)))).toBe(mobileTargetId);
  await expect(mobileToc).not.toHaveAttribute('open', '');

  // English pages use the same global behavior with localized control labels.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://127.0.0.1:4321/en/blog/seo-keyword-research-guide/', {
    waitUntil: 'domcontentloaded',
  });
  const englishGlobalToggle = page.locator('.blog-toc-desktop [data-blog-toc-global-toggle]');
  await expect(englishGlobalToggle).toHaveText('Expand all');
  await englishGlobalToggle.click();
  await expect(englishGlobalToggle).toHaveText('Collapse all');
  await expect(page.locator('.blog-toc-desktop .blog-toc-children:not([hidden])'))
    .toHaveCount(await page.locator('.blog-toc-desktop [data-blog-toc-toggle]').count());
});