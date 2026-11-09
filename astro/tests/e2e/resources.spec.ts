import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const routes = [
  { url: '/resources/', lang: 'zh-CN', alternate: '/en/resources/' },
  { url: '/en/resources/', lang: 'en', alternate: '/resources/' },
] as const;

test.describe('Resources directory', () => {
  for (const route of routes) {
    test('renders the shared bilingual shell and indexable Resources page: ' + route.url, async ({ page }) => {
      const response = await page.goto(route.url, { waitUntil: 'domcontentloaded' });
      expect(response?.status()).toBe(200);
      await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');

      await expect(page.locator('html')).toHaveAttribute('lang', route.lang);
      await expect(page.locator('.site-header .nav-pill.active')).toHaveAttribute('href', route.url);
      await expect(page.locator('.site-header .lang a[data-locale="' + (route.lang === 'en' ? 'zh' : 'en') + '"]'))
        .toHaveAttribute('href', route.alternate);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href', 'https://licat.xyz' + route.url,
      );
      await expect(page.locator('link[hreflang="zh-CN"]')).toHaveAttribute(
        'href', 'https://licat.xyz/resources/',
      );
      await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
        'href', 'https://licat.xyz/en/resources/',
      );
      await expect(page.locator('meta[name="robots"][content*="noindex"]')).toHaveCount(0);
      await expect(page.locator('.site-footer.liquid-demo')).toHaveCount(1);
      await expect(page.locator('.resources-search-panel')).toBeVisible();
      await expect(page.locator('#resource-search')).toBeVisible();
      await expect(page.locator('.resource-category-card')).toHaveCount(7);
      await expect(page.locator('.resource-collection-card')).toHaveCount(7);
      await expect(page.locator('#resource-category')).toBeVisible();
      await expect(page.locator('#resource-subcategory')).toBeDisabled();
      await expect(page.locator('#resource-tag')).toBeVisible();
      await expect(page.locator('#resource-pricing')).toBeVisible();
      await expect(page.locator('#resource-platform')).toBeVisible();
      await expect(page.locator('#resource-favorites-toggle')).toBeVisible();

      const payload = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');
      const taxonomy = JSON.parse((await page.locator('#resource-taxonomy').textContent()) || '[]');
      expect(taxonomy).toHaveLength(7);
      expect(await page.locator('#resource-results [data-resource-card]').count()).toBe(payload.length);

      for (const card of await page.locator('.resource-category-card').all()) {
        await expect(card).toHaveClass(/liquid-demo/);
        for (const layer of ['lg-glass-filter', 'lg-glass-overlay', 'lg-glass-specular']) {
          await expect(card.locator(':scope > .' + layer)).toHaveCount(1);
        }
      }

      const schemaTypes = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(schemaTypes.some(value => value.includes('"@type":"WebSite"'))).toBe(true);
      expect(schemaTypes.some(value => value.includes('"@type":"BreadcrumbList"'))).toBe(true);
      expect(schemaTypes.some(value => value.includes('"@type":"ItemList"'))).toBe(true);

      await page.keyboard.press('Control+k');
      await expect(page.locator('#resource-search')).toBeFocused();
      await page.keyboard.press('Escape');
    });
  }

  test('pressing Enter in the search field does not open the first matching resource', async ({ page }) => {
    await page.goto('/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');

    const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');
    const claude = catalogue.find((item: { name?: { en?: string } }) => item.name?.en === 'Claude');
    expect(claude).toBeTruthy();

    const search = page.locator('#resource-search');
    const claudeCard = page.locator('#resource-results [data-resource-card="' + claude.id + '"]');
    await search.fill('Claude');
    await expect(claudeCard).toBeVisible();
    await expect(page.locator('#resource-results [data-resource-card]:visible').first())
      .toHaveAttribute('data-resource-card', claude.id);
    await expect(claudeCard.locator('.resource-card__visit')).toHaveAttribute('href', 'https://claude.ai/');

    const popupPromise = page.waitForEvent('popup', { timeout: 500 }).catch(() => null);
    await search.press('Enter');
    expect(await popupPromise).toBeNull();
    await expect(search).toBeFocused();
    await expect(claudeCard).toBeVisible();
    await expect(page).toHaveURL(/\/resources\/$/);
  });

  test('category filters, local favorites and import/export work without an account', async ({ page }) => {
    await page.goto('/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    const catalogue = JSON.parse((await page.locator('#resource-catalogue').textContent()) || '[]');

    await page.locator('#resource-category').selectOption('ai-automation');
    await expect(page.locator('#resource-subcategory')).toBeEnabled();
    await expect(page.locator('#resource-subcategory option')).toHaveCount(6);
    await page.locator('#resource-clear-filters').click();
    await expect(page.locator('#resource-subcategory')).toBeDisabled();

    await page.locator('[data-category-card="development-engineering"]').click();
    await expect(page.locator('#resource-category')).toHaveValue('development-engineering');
    await page.locator('#resource-clear-filters').click();

    const firstCollection = page.locator('.resource-collection-card').first();
    const collectionIds = (await firstCollection.getAttribute('data-collection-ids')) || '';
    const collectionCount = collectionIds.split('|').filter(Boolean).length;
    await firstCollection.click();
    await expect(page.locator('#resource-results [data-resource-card]:visible')).toHaveCount(collectionCount);
    await page.locator('#resource-clear-filters').click();

    if (catalogue.length > 0) {
      const first = catalogue[0];
      const card = page.locator('#resource-results [data-resource-card="' + first.id + '"]');
      await page.locator('#resource-search').fill(first.name.en);
      await expect(card).toBeVisible();

      const fuzzyToken = String(first.name.en).split(/\s+/).find(token => token.length >= 4);
      if (fuzzyToken) {
        const typo = fuzzyToken.slice(0, 1) + (fuzzyToken[1] === 'x' ? 'y' : 'x') + fuzzyToken.slice(2);
        await page.locator('#resource-search').fill(typo);
        await expect(card).toBeVisible();
      }

      await page.locator('#resource-clear-filters').click();
      await card.locator('[data-favorite-id]').click();
      await expect(card.locator('[data-favorite-id]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#resource-favorite-count')).toHaveText('1');
      await page.locator('#resource-favorites-toggle').click();
      await expect(page.locator('#resource-results [data-resource-card]:visible')).toHaveCount(1);

      const downloadPromise = page.waitForEvent('download');
      await page.locator('#resource-export').click();
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('licat-resources-favorites.json');
      const downloadPath = await download.path();
      expect(downloadPath).not.toBeNull();
      const exported = JSON.parse(await readFile(downloadPath!, 'utf8'));
      expect(exported.format).toBe('licat-resources-favorites');
      expect(exported.resourceIds).toContain(first.id);

      await page.locator('#resource-import-file').setInputFiles({
        name: 'licat-resources-favorites.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify(exported)),
      });
      await expect(page.locator('#resource-toast')).toContainText(/imported|导入/);

      await page.reload();
      await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
      await expect(page.locator('#resource-favorite-count')).toHaveText('1');
      await page.locator('#resource-favorites-toggle').click();
      await expect(page.locator('#resource-results [data-resource-card]:visible')).toHaveCount(1);
      await page.locator('#resource-results [data-favorite-id]:visible').click();
      await expect(page.locator('#resource-favorite-count')).toHaveText('0');
    } else {
      await expect(page.locator('#resource-empty')).toBeVisible();
      await expect(page.locator('#resource-export')).toBeDisabled();
      await page.locator('#resource-favorites-toggle').click();
      await expect(page.locator('#resource-empty h3')).toContainText(/saved|收藏/);
      await page.locator('#resource-favorites-toggle').click();

      await page.locator('#resource-import-file').setInputFiles({
        name: 'licat-resources-favorites.json',
        mimeType: 'application/json',
        buffer: Buffer.from(JSON.stringify({
          format: 'licat-resources-favorites', version: 1, resourceIds: [],
        })),
      });
      await expect(page.locator('#resource-toast')).toContainText(/imported|导入/);
    }
    await page.evaluate(() => localStorage.removeItem('licat-resources-favorites-v1'));
  });

  test('Resources layout stays within desktop, tablet and mobile viewports in both themes', async ({ page }) => {
    await page.goto('/en/resources/');
    await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ['light', 'dark']) {
        await page.evaluate(value => { document.documentElement.dataset.theme = value; }, theme);
        const dimensions = await page.evaluate(() => ({
          document: document.documentElement.scrollWidth,
          viewport: window.innerWidth,
          body: document.body.scrollWidth,
        }));
        expect(dimensions.document, 'Document overflow at ' + width + 'px / ' + theme)
          .toBeLessThanOrEqual(width + 3);
        expect(dimensions.body, 'Body overflow at ' + width + 'px / ' + theme)
          .toBeLessThanOrEqual(width + 3);
      }
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

test('offscreen directory cards keep crawlable HTML and render when scrolled into view', async ({ page }) => {
  await page.goto('/resources/');
  await page.waitForFunction(() => document.documentElement.dataset.resourcesReady === 'true');
  const cards = page.locator('#resource-results [data-resource-card]');
  await expect(cards).toHaveCount(114);
  const last = cards.last();
  await expect(last).toHaveCSS('content-visibility', 'auto');
  const href = await last.locator('.resource-card__visit').getAttribute('href');
  expect(href).toMatch(/^https:\/\//);
  await last.scrollIntoViewIfNeeded();
  await expect(last.locator('.resource-card__visit')).toBeVisible();
  await page.locator('#resource-search').fill('Claude');
  await page.locator('#resource-search').press('Enter');
  await expect(page).toHaveURL(/\/resources\/$/);
});
