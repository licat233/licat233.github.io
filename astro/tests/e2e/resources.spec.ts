import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const routes = [
  { url: '/resources/', lang: 'zh-CN', alternate: '/en/resources/' },
  { url: '/en/resources/', lang: 'en', alternate: '/resources/' },
] as const;

test.describe('Resources compact bookmark directory', () => {
  for (const route of routes) {
    test('renders the bilingual compact directory and indexable static resources: ' + route.url, async ({ page }) => {
      const response = await page.goto(route.url, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');

      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href', route.url);
      await expect(page.locator('.site-header .lang a[data-locale="' + (route.lang === 'en' ? 'zh' : 'en') + '"]'))
        .toHaveAttribute('href', route.alternate);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://licat.xyz' + route.url);
      await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute('href', 'https://licat.xyz/resources/');
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href', 'https://licat.xyz/en/resources/');
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      await expect(page.locator('.site-footer.liquid-demo')).toHaveCount(1);

      await expect(page.locator('.rd-search-panel')).toBeVisible();
      await expect(page.locator('#rd-search')).toBeVisible();
      await expect(page.locator('#rd-category-nav .rd-side-button')).toHaveCount(8);
      await expect(page.locator('#rd-quick-list .rd-chip').first()).toBeVisible();
      await expect(page.locator('#rd-tag')).toBeVisible();
      await expect(page.locator('#rd-pricing')).toBeVisible();
      await expect(page.locator('#rd-platform')).toBeVisible();
      await expect(page.locator('#rd-sort')).toBeVisible();
      await expect(page.locator('#rd-favorites-button')).toBeVisible();
      await expect(page.locator('#rd-collections-button')).toBeVisible();

      const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');
      const taxonomy = JSON.parse((await page.locator('#resource-taxonomy').textContent()) || '[]');
      const collections = JSON.parse((await page.locator('#resource-collections').textContent()) || '[]');
      expect(taxonomy).toHaveLength(7);
      expect(collections).toHaveLength(7);
      await expect(page.locator('#rd-results [data-resource-card]')).toHaveCount(catalogue.length);
      await expect(page.locator('#rd-results .rd-card')).toHaveCount(catalogue.length);

      const schemaTypes = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(schemaTypes.some(value => value.includes('"@type":"WebSite"'))).toBe(true);
      expect(schemaTypes.some(value => value.includes('"@type":"BreadcrumbList"'))).toBe(true);
      expect(schemaTypes.some(value => value.includes('"@type":"ItemList"'))).toBe(true);

      await page.keyboard.press('Control+k');
      await expect(page.locator('#rd-search')).toBeFocused();
      await page.keyboard.press('Escape');
    });
  }

  test('search Enter keeps the user on the directory and does not open a resource', async ({ page }) => {
    await page.goto('/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');
    const claude = catalogue.find((item: { name?: { en?: string } }) => item.name?.en === 'Claude');
    expect(claude).toBeTruthy();

    const search = page.locator('#rd-search');
    const claudeCard = page.locator('#rd-results [data-resource-card="' + claude.id + '"]');
    await page.evaluate(() => {
      (window as any).__resourcePerfNodes = {
        category: document.querySelector('#rd-category-nav')?.firstElementChild,
        quick: document.querySelector('#rd-quick-list')?.firstElementChild,
        tagOption: document.querySelector('#rd-tag')?.firstElementChild,
      };
    });
    await search.fill('Claude');
    await expect(claudeCard).toBeVisible();
    const preservedSearchChrome = await page.evaluate(() => {
      const nodes = (window as any).__resourcePerfNodes;
      return nodes.category === document.querySelector('#rd-category-nav')?.firstElementChild &&
        nodes.quick === document.querySelector('#rd-quick-list')?.firstElementChild &&
        nodes.tagOption === document.querySelector('#rd-tag')?.firstElementChild;
    });
    expect(preservedSearchChrome).toBe(true);
    await expect(page.locator('#rd-results .rd-card:visible').first()).toHaveAttribute('data-resource-id', claude.id);
    await expect(claudeCard.locator('.rd-card-title')).toHaveAttribute('href', 'https://claude.ai/');

    const popupPromise = page.waitForEvent('popup', { timeout: 500 }).catch(() => null);
    await search.press('Enter');
    expect(await popupPromise).toBeNull();
    await expect(search).toBeFocused();
    await expect(claudeCard).toBeVisible();
    await expect(page).toHaveURL(/\/resources\/$/);
  });

  test('category, subcategory, quick chips and collections filter the static cards', async ({ page }) => {
    await page.goto('/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');

    await page.locator('#rd-category-nav [data-category="ai-automation"]').click();
    const aiCount = catalogue.filter((item: { category: string }) => item.category === 'ai-automation').length;
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(aiCount);
    await page.locator('#rd-quick-list [data-quick-subcategory="ai-assistants"]').click();
    const assistantCount = catalogue.filter((item: { category: string; subcategory: string }) =>
      item.category === 'ai-automation' && item.subcategory === 'ai-assistants').length;
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(assistantCount);
    await page.locator('#rd-clear').click();
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(catalogue.length);

    const expectedNameFirst = await page.evaluate(() => {
      const items = JSON.parse(document.querySelector('#resource-catalogue')!.textContent || '[]');
      return items.sort((a: any, b: any) => a.name['zh-CN'].localeCompare(b.name['zh-CN']))[0].id;
    });
    await page.locator('#rd-sort').selectOption('name');
    await expect(page.locator('#rd-results .rd-card:visible').first()).toHaveAttribute('data-resource-id', expectedNameFirst);
    await page.locator('#rd-search').fill('Claude');
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(1);
    await page.locator('#rd-search').fill('');
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(catalogue.length);
    const expectedFeaturedFirst = await page.evaluate(() => {
      const items = JSON.parse(document.querySelector('#resource-catalogue')!.textContent || '[]');
      return items.sort((a: any, b: any) => Number(b.featured) - Number(a.featured) || a.name['zh-CN'].localeCompare(b.name['zh-CN']))[0].id;
    });
    await page.locator('#rd-sort').selectOption('featured');
    await expect(page.locator('#rd-results .rd-card:visible').first()).toHaveAttribute('data-resource-id', expectedFeaturedFirst);

    await page.locator('#rd-collections-button').click();
    await expect(page.locator('#rd-results')).toBeHidden();
    await expect(page.locator('#rd-collections .rd-collection')).toHaveCount(7);
    const collections = JSON.parse((await page.locator('#resource-collections').textContent()) || '[]');
    const firstCollection = page.locator('#rd-collections .rd-collection').first();
    const firstSlug = collections[0].slug;
    const collectionCount = collections[0].resourceIds.length;
    await expect(firstCollection).toHaveAttribute('data-collection', firstSlug);
    await firstCollection.click();
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(collectionCount);
    await page.locator('#rd-clear').click();
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(catalogue.length);
  });

  test('favorites stay local and JSON export/import work', async ({ page }) => {
    await page.goto('/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');
    const first = catalogue[0];
    const card = page.locator('#rd-results [data-resource-card="' + first.id + '"]');

    await card.locator('[data-save-id]').click();
    await expect(card.locator('[data-save-id]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#rd-favorite-count')).toHaveText('1');
    await page.locator('#rd-favorites-button').click();
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(1);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#rd-export').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('licat-resources-favorites.json');
    const downloadPath = await download.path();
    expect(downloadPath).not.toBeNull();
    const exported = JSON.parse(await readFile(downloadPath!, 'utf8'));
    expect(exported.format).toBe('licat-resources-favorites');
    expect(exported.resourceIds).toContain(first.id);

    await page.locator('#rd-import-file').setInputFiles({
      name: 'licat-resources-favorites.json', mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(exported)),
    });
    await expect(page.locator('#rd-toast')).toContainText(/imported|导入/);
    await page.reload();
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    await expect(page.locator('#rd-favorite-count')).toHaveText('1');
    await page.locator('#rd-favorites-button').click();
    await expect(page.locator('#rd-results .rd-card:visible')).toHaveCount(1);
    await page.locator('#rd-results [data-save-id]:visible').click();
    await expect(page.locator('#rd-favorite-count')).toHaveText('0');
    await page.evaluate(() => localStorage.removeItem('licat-resources-favorites-v1'));
  });

  test('restores compact cards and progressive favicon avatar replacement', async ({ page }) => {
    let releaseFavicon!: () => void;
    let markFaviconRequest!: () => void;
    let activeFaviconRequests = 0;
    let maxConcurrentFaviconRequests = 0;
    const faviconGate = new Promise<void>(resolve => { releaseFavicon = resolve; });
    const faviconStarted = new Promise<void>(resolve => { markFaviconRequest = resolve; });
    await page.route('https://favicon.yandex.net/**', async route => {
      activeFaviconRequests++;
      maxConcurrentFaviconRequests = Math.max(maxConcurrentFaviconRequests, activeFaviconRequests);
      markFaviconRequest();
      await faviconGate;
      await route.fulfill({
        status: 200,
        contentType: 'image/svg+xml',
        body: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#1686c7"/><circle cx="16" cy="16" r="8" fill="white"/></svg>',
      });
      activeFaviconRequests--;
    });
    await page.goto('/en/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');

    const firstCard = page.locator('#rd-results .rd-card').first();
    const lastCard = page.locator('#rd-results .rd-card').last();
    const avatar = firstCard.locator('.rd-card-icon img');
    await firstCard.scrollIntoViewIfNeeded();
    await faviconStarted;
    await expect(firstCard.locator('.rd-icon-fallback')).toBeVisible();
    expect(await avatar.evaluate(element => getComputedStyle(element).filter)).toContain('drop-shadow(');
    releaseFavicon();
    await expect(avatar).toHaveClass(/is-loaded/, { timeout: 8000 });
    await expect(firstCard.locator('.rd-icon-fallback')).toBeHidden();
    expect(maxConcurrentFaviconRequests).toBeLessThanOrEqual(6);

    await expect(firstCard).toHaveClass(/is-near-viewport/);
    await expect(firstCard).toHaveCSS('backdrop-filter', 'blur(12px) saturate(1.3)');
    await expect(lastCard).not.toHaveClass(/is-near-viewport/);
    await expect(lastCard).toHaveCSS('backdrop-filter', 'none');
    await lastCard.scrollIntoViewIfNeeded();
    await expect(lastCard).toHaveClass(/is-near-viewport/);
    await expect(lastCard).toHaveCSS('backdrop-filter', 'blur(12px) saturate(1.3)');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(lastCard).not.toHaveClass(/is-near-viewport/);

    for (const [width, columns] of [[1440, 3], [768, 2], [390, 1]] as const) {
      await page.setViewportSize({ width, height: 900 });
      const layout = await page.evaluate(() => {
        const grid = document.querySelector('#rd-results')!;
        const card = grid.querySelector('.rd-card')!;
        return {
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          cardHeight: card.getBoundingClientRect().height,
          viewport: window.innerWidth,
          document: document.documentElement.scrollWidth,
        };
      });
      expect(layout.columns).toBe(columns);
      const expectedCardHeight = width === 390 ? 87.28 : 106.02;
      expect(Math.abs(layout.cardHeight - expectedCardHeight)).toBeLessThan(1);
      expect(layout.document).toBeLessThanOrEqual(layout.viewport + 3);
    }
  });
});

test('homepage keeps its existing section anchors and exposes the shared Resources footer link', async ({ page }) => {
  for (const route of [
    { url: '/', resources: '/resources/', projects: '#projects', skills: '#skills', prompts: '/prompts/' },
    { url: '/en/', resources: '/en/resources/', projects: '#projects', skills: '#skills', prompts: '/en/prompts/' },
  ]) {
    await page.goto(route.url);
    await expect(page.locator('#projects')).toBeAttached();
    await expect(page.locator('#skills')).toBeAttached();
    const footer = page.locator('.site-footer');
    await footer.scrollIntoViewIfNeeded();
    await expect(footer).toBeVisible();
    await expect(footer.locator('.footer-links a[href="' + route.resources + '"]')).toBeVisible();
    await expect(footer.locator('.footer-links a[href="' + route.projects + '"]')).toBeVisible();
    await expect(footer.locator('.footer-links a[href="' + route.skills + '"]')).toBeVisible();
    await expect(footer.locator('.footer-links a[href="' + route.prompts + '"]')).toBeVisible();
  }
});
