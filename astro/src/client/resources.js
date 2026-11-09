(() => {
  'use strict';

  const catalogueNode = document.getElementById('resource-catalogue');
  const uiNode = document.getElementById('resource-ui-copy');
  const taxonomyNode = document.getElementById('resource-taxonomy');
  if (!catalogueNode || !uiNode || !taxonomyNode) return;

  const catalogue = JSON.parse(catalogueNode.textContent || '[]');
  const ui = JSON.parse(uiNode.textContent || '{}');
  const taxonomy = JSON.parse(taxonomyNode.textContent || '[]');
  const byId = new Map(catalogue.map(item => [item.id, item]));
  const categoryById = new Map(taxonomy.map(item => [item.id, item]));
  const storageKey = 'licat-resources-favorites-v1';

  const $ = selector => document.querySelector(selector);
  const search = $('#resource-search');
  const results = $('#resource-results');
  const empty = $('#resource-empty');
  const status = $('#resource-result-status');
  const categorySelect = $('#resource-category');
  const subcategorySelect = $('#resource-subcategory');
  const tagSelect = $('#resource-tag');
  const pricingSelect = $('#resource-pricing');
  const platformSelect = $('#resource-platform');
  const sortSelect = $('#resource-sort');
  const favoritesToggle = $('#resource-favorites-toggle');
  const favoriteCount = $('#resource-favorite-count');
  const toastNode = $('#resource-toast');
  const cards = new Map([...results.querySelectorAll('[data-resource-card]')]
    .map(card => [card.dataset.resourceCard, card]));

  function readFavorites() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return new Set(Array.isArray(value) ? value.filter(id => typeof id === 'string') : []);
    } catch (_) {
      return new Set();
    }
  }

  let savedIds = readFavorites();
  let favoritesOnly = false;
  let selectedCollectionIds = null;
  let toastTimer;

  function persistFavorites() {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...savedIds]));
    } catch (_) {
      showToast(ui.storageUnavailable || ui.importError);
    }
  }

  function showToast(message) {
    if (!toastNode || !message) return;
    clearTimeout(toastTimer);
    toastNode.textContent = message;
    toastNode.classList.add('is-visible');
    toastTimer = setTimeout(() => toastNode.classList.remove('is-visible'), 2800);
  }

  function updateFavoriteButtons() {
    for (const button of document.querySelectorAll('[data-favorite-id]')) {
      const isSaved = savedIds.has(button.dataset.favoriteId);
      button.setAttribute('aria-pressed', String(isSaved));
      button.setAttribute('aria-label', isSaved
        ? (button.dataset.removeSavedLabel || ui.removeSaved)
        : (button.dataset.saveLabel || ui.save));
      button.classList.toggle('is-saved', isSaved);
    }
    if (favoriteCount) favoriteCount.textContent = String(savedIds.size);
    if (favoritesToggle) {
      favoritesToggle.setAttribute('aria-pressed', String(favoritesOnly));
      favoritesToggle.classList.toggle('is-active', favoritesOnly);
    }
    const exportButton = $('#resource-export');
    if (exportButton) exportButton.disabled = savedIds.size === 0;
  }

  function normalize(value) {
    return String(value ?? '')
      .normalize('NFKC')
      .toLocaleLowerCase()
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\p{L}\p{N}]+/gu, ' ')
      .trim();
  }

  function editDistance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit) return limit + 1;
    let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
    for (let i = 1; i <= a.length; i++) {
      const current = [i];
      let rowMinimum = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        const value = Math.min(
          current[j - 1] + 1,
          previous[j] + 1,
          previous[j - 1] + cost,
        );
        current[j] = value;
        rowMinimum = Math.min(rowMinimum, value);
      }
      if (rowMinimum > limit) return limit + 1;
      previous = current;
    }
    return previous[b.length];
  }

  function tokenMatches(queryToken, fieldToken) {
    if (fieldToken.includes(queryToken) || queryToken.includes(fieldToken)) return true;
    if (queryToken.length < 3 || fieldToken.length < 3) return false;
    const limit = queryToken.length <= 4 ? 1 : Math.max(1, Math.floor(queryToken.length * 0.22));
    return editDistance(queryToken, fieldToken, limit) <= limit;
  }

  function searchMatches(item, query) {
    if (!query) return true;
    const category = categoryById.get(item.category);
    const subcategory = category?.subcategories.find(entry => entry.id === item.subcategory);
    const corpus = normalize([
      item.name?.en, item.name?.['zh-CN'],
      item.description?.en, item.description?.['zh-CN'],
      ...(item.aliases || []), ...(item.tags || []), ...(item.platforms || []),
      item.resourceType, item.pricing,
      category?.name, subcategory?.name,
    ].join(' '));
    if (corpus.includes(query)) return true;
    const fieldTokens = corpus.split(/\s+/).filter(Boolean);
    const queryTokens = query.split(/\s+/).filter(Boolean);
    return queryTokens.every(token => fieldTokens.some(field => tokenMatches(token, field)));
  }

  function updateSubcategories() {
    const category = categoryById.get(categorySelect.value);
    const options = [new Option(ui.allSubcategories, '')];
    for (const item of category?.subcategories || []) {
      options.push(new Option(item.name, item.id));
    }
    subcategorySelect.replaceChildren(...options);
    subcategorySelect.disabled = !category;
  }

  function visibleCards() {
    return [...results.querySelectorAll('[data-resource-card]:not([hidden])')];
  }

  function render() {
    const query = normalize(search.value);
    const category = categorySelect.value;
    const subcategory = subcategorySelect.value;
    const tag = tagSelect.value;
    const pricing = pricingSelect.value;
    const platform = platformSelect.value;
    const matched = catalogue.filter(item => {
      if (favoritesOnly && !savedIds.has(item.id)) return false;
      if (selectedCollectionIds && !selectedCollectionIds.has(item.id)) return false;
      if (category && item.category !== category) return false;
      if (subcategory && item.subcategory !== subcategory) return false;
      if (tag && !(item.tags || []).includes(tag)) return false;
      if (pricing && item.pricing !== pricing) return false;
      if (platform && !(item.platforms || []).includes(platform)) return false;
      return searchMatches(item, query);
    });

    const sort = sortSelect.value;
    matched.sort((a, b) => {
      if (sort === 'name') {
        return String(a.name.en).localeCompare(String(b.name.en));
      }
      if (sort === 'newest') return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      return Number(b.featured) - Number(a.featured) ||
        Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });

    const matchedIds = new Set(matched.map(item => item.id));
    for (const [id, card] of cards) card.hidden = !matchedIds.has(id);
    const fragment = document.createDocumentFragment();
    for (const item of matched) {
      const card = cards.get(item.id);
      if (card) fragment.append(card);
    }
    results.append(fragment);

    const count = matched.length;
    status.textContent = ui.resultCount.replace('{count}', String(count));
    results.hidden = count === 0;
    empty.hidden = count > 0;
    if (count === 0) {
      const heading = empty.querySelector('h3');
      const help = empty.querySelector('p');
      if (favoritesOnly && savedIds.size === 0) {
        heading.textContent = ui.noFavorites;
        help.textContent = ui.noFavoritesHelp;
      } else if (catalogue.length === 0) {
        heading.textContent = ui.emptyCatalog;
        help.textContent = ui.emptyCatalogHelp;
      } else {
        heading.textContent = ui.noResults;
        help.textContent = ui.noResultsHelp;
      }
    }
    updateFavoriteButtons();
  }

  function clearFilters() {
    search.value = '';
    categorySelect.value = '';
    updateSubcategories();
    tagSelect.value = '';
    pricingSelect.value = '';
    platformSelect.value = '';
    sortSelect.value = 'featured';
    selectedCollectionIds = null;
    favoritesOnly = false;
    render();
  }

  document.addEventListener('click', event => {
    const favoriteButton = event.target.closest('[data-favorite-id]');
    if (favoriteButton) {
      const id = favoriteButton.dataset.favoriteId;
      if (savedIds.has(id)) savedIds.delete(id);
      else savedIds.add(id);
      persistFavorites();
      render();
      return;
    }

    const categoryCard = event.target.closest('[data-category-card]');
    if (categoryCard) {
      clearFilters();
      categorySelect.value = categoryCard.dataset.categoryCard;
      updateSubcategories();
      render();
      $('#resource-directory').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const collectionCard = event.target.closest('[data-collection-ids]');
    if (collectionCard) {
      clearFilters();
      selectedCollectionIds = new Set(collectionCard.dataset.collectionIds.split('|').filter(Boolean));
      render();
      $('#resource-directory').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  search.addEventListener('input', render);
  categorySelect.addEventListener('change', () => {
    updateSubcategories();
    render();
  });
  for (const control of [subcategorySelect, tagSelect, pricingSelect, platformSelect, sortSelect]) {
    control.addEventListener('change', render);
  }
  $('#resource-clear-filters').addEventListener('click', clearFilters);
  $('#resource-reset').addEventListener('click', clearFilters);
  favoritesToggle.addEventListener('click', () => {
    favoritesOnly = !favoritesOnly;
    render();
  });

  function focusResult(direction) {
    const visible = visibleCards();
    if (!visible.length) return;
    const target = direction > 0 ? visible[0] : visible[visible.length - 1];
    target.querySelector('.resource-card__visit')?.focus();
  }

  search.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      focusResult(event.key === 'ArrowDown' ? 1 : -1);
    } else if (event.key === 'Enter') {
      const link = visibleCards()[0]?.querySelector('.resource-card__visit');
      if (link) {
        event.preventDefault();
        link.click();
      }
    } else if (event.key === 'Escape') {
      if (search.value || categorySelect.value || tagSelect.value || pricingSelect.value || platformSelect.value) {
        event.preventDefault();
        clearFilters();
      } else {
        search.blur();
      }
    }
  });

  results.addEventListener('keydown', event => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const visible = visibleCards();
    const current = event.target.closest('[data-resource-card]');
    const currentIndex = visible.indexOf(current);
    const nextIndex = currentIndex + (event.key === 'ArrowDown' ? 1 : -1);
    event.preventDefault();
    if (nextIndex < 0) search.focus();
    else if (nextIndex < visible.length) visible[nextIndex].querySelector('.resource-card__visit')?.focus();
  });

  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      search.focus();
      search.select();
    }
  });

  $('#resource-export').addEventListener('click', () => {
    if (!savedIds.size) {
      showToast(ui.exportEmpty);
      return;
    }
    const payload = {
      format: 'licat-resources-favorites',
      version: 1,
      exportedAt: new Date().toISOString(),
      resourceIds: [...savedIds],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'licat-resources-favorites.json';
    anchor.click();
    URL.revokeObjectURL(url);
  });

  const importInput = $('#resource-import-file');
  $('#resource-import-trigger').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', async () => {
    const file = importInput.files?.[0];
    importInput.value = '';
    if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('File too large');
      const payload = JSON.parse(await file.text());
      if (payload?.format !== 'licat-resources-favorites' || payload.version !== 1 ||
          !Array.isArray(payload.resourceIds)) throw new Error('Unsupported export format');
      const imported = payload.resourceIds.filter(id => typeof id === 'string' && byId.has(id));
      savedIds = new Set(imported);
      persistFavorites();
      render();
      showToast(imported.length === payload.resourceIds.length
        ? ui.importSuccess
        : ui.importSuccess + ' ' + ui.importSkipped);
    } catch (_) {
      showToast(ui.importError);
    }
  });

  for (const icon of document.querySelectorAll('[data-resource-icon]')) {
    icon.addEventListener('error', () => { icon.hidden = true; });
  }

  window.addEventListener('storage', event => {
    if (event.key === storageKey) {
      savedIds = readFavorites();
      render();
    }
  });

  updateSubcategories();
  updateFavoriteButtons();
  render();
  document.documentElement.dataset.resourcesReady = 'true';
})();
