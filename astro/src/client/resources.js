(() => {
    'use strict';
    const STORAGE_KEY = 'licat-resources-favorites-v1';
    const $ = id => document.getElementById(id);
    const state = { lang:document.documentElement.lang === 'en' ? 'en' : 'zh', category:'', subcategory:'', tag:'', pricing:'', platform:'', sort:'featured', query:'', favoritesOnly:false, collection:null, view:'resources' };
    let resources = [], categories = [], collections = [], saved = new Set(), toastTimer = null;
    let resourceCards = new Map();
    let categoryMap = new Map(), categoryCounts = new Map(), subcategoryCounts = new Map();
    let searchIndex = new Map(), sortedResources = { featured:[], newest:[], name:[] };
    let collectionResourceSets = new Map(), tagOptions = [], platformOptions = [];
    let renderedSort = 'featured', searchFrame = 0, searchNeedsNavigationSync = false;
    const faviconQueue = [];
    const MAX_CONCURRENT_FAVICONS = 6;
    let activeFaviconLoads = 0;
    const labels = {
      en: {
        pageTitle:'Resources', pageSubtitle:'Find what you need by task, category or keyword.',
        searchHint:'Search across English and Chinese names, descriptions, aliases and tags.',
        quickTitle:'Explore by topic', quickNote:'Choose a specific area',
        browseLabel:'Browse', personalLabel:'Your library', collections:'Collections', saved:'Saved resources', savedShort:'Saved',
        export:'Export', import:'Import', clear:'Clear filters',
        all:'All resources', noResults:'No matching resources', noResultsHelp:'Try another keyword or clear one or more filters.',
        resultSuffix:'resources', searchResults:'Search results', featured:'Featured', open:'Open website',
        free:'Free', freemium:'Freemium', paid:'Paid', 'free-trial':'Free trial', 'open-source':'Open source', unknown:'Pricing unverified',
        allTags:'All tags', anyPricing:'Any pricing', anyPlatform:'Any platform',
        sortFeatured:'Featured first', sortNewest:'Recently added', sortName:'Name A–Z',
        collectionSubtitle:'Editorially curated shortlists. Choose one to see its resources.',
        savedSubtitle:'Resources you have saved in this browser.',
        clearCollection:'Clear collection',
        importSuccess:'Saved resources imported.', importError:'Choose a valid Licat Resources JSON export.',
        importSkipped:'Some unknown resources were skipped.', exportEmpty:'Save at least one resource before exporting.',
        storageError:'Browser storage is unavailable.',
        footerMotto:'Turn complex problems into systems.',
        footerNote:'Better tools, more effective work, and a more self-directed life.',
        types:{'web-app':'Web app','desktop-app':'Desktop app','mobile-app':'Mobile app','browser-extension':'Browser extension','api':'API','open-source-project':'Open-source project','library':'Library','course':'Course','documentation':'Documentation','community':'Community','dataset':'Dataset','service':'Online service','other':'Other','unknown':'Unverified'}
      },
      zh: {
        pageTitle:'资源导航', pageSubtitle:'按用途、分类或关键词，快速找到需要的资源。',
        searchHint:'支持中英文名称、简介、别名与标签搜索。',
        quickTitle:'按主题快速查找', quickNote:'选择具体用途领域',
        browseLabel:'资源分类', personalLabel:'个人收藏', collections:'主题合集', saved:'我的收藏', savedShort:'收藏',
        export:'导出', import:'导入', clear:'清除筛选',
        all:'全部资源', noResults:'没有找到匹配的资源', noResultsHelp:'试试其他关键词，或清除部分筛选条件。',
        resultSuffix:'个资源', searchResults:'搜索结果', featured:'精选', open:'访问官网',
        free:'免费', freemium:'免费增值', paid:'付费', 'free-trial':'免费试用', 'open-source':'开源', unknown:'价格待确认',
        allTags:'全部标签', anyPricing:'全部价格', anyPlatform:'全部平台',
        sortFeatured:'精选优先', sortNewest:'最近收录', sortName:'名称 A–Z',
        collectionSubtitle:'经过编辑整理的主题资源清单，选择合集即可查看其中资源。',
        savedSubtitle:'保存在当前浏览器中的资源。',
        clearCollection:'清除合集',
        importSuccess:'收藏数据已导入。', importError:'请选择有效的 Licat Resources 收藏 JSON 文件。',
        importSkipped:'部分无法识别的资源已跳过。', exportEmpty:'至少收藏一个资源后才能导出。',
        storageError:'浏览器存储不可用。',
        footerMotto:'将复杂问题转化为系统。',
        footerNote:'更好的工具、更高效的工作，以及更自主的生活。',
        types:{'web-app':'Web 应用','desktop-app':'桌面应用','mobile-app':'移动应用','browser-extension':'浏览器扩展','api':'API','open-source-project':'开源项目','library':'开发库','course':'课程','documentation':'文档','community':'社区','dataset':'数据集','service':'在线服务','other':'其他','unknown':'待确认'}
      }
    };
    const tr = key => labels[state.lang][key] || key;
    const localeKey = () => state.lang === 'en' ? 'en' : 'zh-CN';
    const localName = item => item.name?.[localeKey()] || item.name?.en || '';
    const localDescription = item => item.description?.[localeKey()] || item.description?.en || '';
    const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const getCategory = id => categoryMap.get(id);
    const getSubcategory = (category,id) => category?.subcategories?.find(item => item.id === id);
    const pricingLabel = value => tr(value || 'unknown');
    function readSaved() {
      try { const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); return new Set(Array.isArray(data) ? data.filter(id => typeof id === 'string') : []); }
      catch (_) { return new Set(); }
    }
    function persistSaved() {
      try { localStorage.setItem(STORAGE_KEY,JSON.stringify([...saved])); }
      catch (_) { toast(tr('storageError')); }
    }
    function toast(message) {
      const node = $('rd-toast'); node.textContent = message; node.classList.add('is-visible');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('is-visible'),2600);
    }
    function normalize(value) {
      return String(value ?? '').normalize('NFKC').toLocaleLowerCase().replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
    }
    function buildIndexes() {
      categoryMap = new Map(categories.map(category => [category.id, category]));
      categoryCounts = new Map(categories.map(category => [category.id, 0]));
      subcategoryCounts = new Map();
      const tags = new Set(), platforms = new Set();
      searchIndex = new Map();

      for (const category of categories) {
        for (const subcategory of category.subcategories || []) {
          subcategoryCounts.set(category.id + ':' + subcategory.id, 0);
        }
      }

      for (const item of resources) {
        categoryCounts.set(item.category, (categoryCounts.get(item.category) || 0) + 1);
        const subcategoryKey = item.category + ':' + item.subcategory;
        subcategoryCounts.set(subcategoryKey, (subcategoryCounts.get(subcategoryKey) || 0) + 1);
        (item.tags || []).forEach(tag => tags.add(tag));
        (item.platforms || []).forEach(platform => platforms.add(platform));

        const category = categoryMap.get(item.category);
        const subcategory = getSubcategory(category, item.subcategory);
        const corpus = normalize([
          item.name?.en, item.name?.['zh-CN'], item.description?.en, item.description?.['zh-CN'],
          ...(item.aliases || []), ...(item.tags || []), ...(item.platforms || []), item.resourceType, item.pricing,
          category?.name?.en, category?.name?.['zh-CN'], subcategory?.name?.en, subcategory?.name?.['zh-CN']
        ].join(' '));
        searchIndex.set(item.id, { corpus, fields: corpus.split(/\s+/).filter(Boolean) });
      }

      tagOptions = [...tags].sort((a, b) => a.localeCompare(b));
      platformOptions = [...platforms].sort((a, b) => a.localeCompare(b));
      sortedResources = {
        featured: [...resources].sort((a, b) => Number(b.featured) - Number(a.featured) || localName(a).localeCompare(localName(b))),
        newest: [...resources].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)),
        name: [...resources].sort((a, b) => localName(a).localeCompare(localName(b)))
      };
      collectionResourceSets = new Map(collections.map(collection => [collection.slug, new Set(collection.resourceIds)]));
    }
    function editDistance(a,b,limit) {
      if (Math.abs(a.length-b.length)>limit) return limit+1;
      let previous = Array.from({length:b.length+1},(_,i)=>i);
      for(let i=1;i<=a.length;i++){
        const current=[i]; let minimum=i;
        for(let j=1;j<=b.length;j++){
          const value=Math.min(current[j-1]+1,previous[j]+1,previous[j-1]+(a[i-1]===b[j-1]?0:1));
          current[j]=value; minimum=Math.min(minimum,value);
        }
        if(minimum>limit) return limit+1;
        previous=current;
      }
      return previous[b.length];
    }
    function fuzzyTokenMatches(query,field) {
      if(field===query) return true;
      if(query.length<3||field.length<3) return false;
      if(field.includes(query)||query.includes(field)) return true;
      const limit=query.length<=4?1:Math.max(1,Math.floor(query.length*.22));
      return editDistance(query,field,limit)<=limit;
    }
    function matchesQuery(item,query,tokens) {
      if(!query) return true;
      const indexed=searchIndex.get(item.id);
      if(!indexed) return false;
      if(indexed.corpus.includes(query)) return true;
      return tokens.every(token=>indexed.fields.some(field=>fuzzyTokenMatches(token,field)));
    }
    function renderCopy() {
      document.querySelectorAll('[data-copy]').forEach(node => {
        const key=node.dataset.copy; if(tr(key)) node.textContent=tr(key);
      });
      $('rd-search').placeholder=state.lang==='en'?'Search by tool, task, feature or keyword…':'搜索工具、用途、功能或关键词…';
      $('rd-search').setAttribute('aria-label',state.lang==='en'?'Search resources':'搜索资源');
      $('rd-tag').setAttribute('aria-label',state.lang==='en'?'Filter by tag':'按标签筛选');
      $('rd-pricing').setAttribute('aria-label',state.lang==='en'?'Filter by pricing':'按价格模式筛选');
      $('rd-platform').setAttribute('aria-label',state.lang==='en'?'Filter by platform':'按平台筛选');
      $('rd-sort').setAttribute('aria-label',state.lang==='en'?'Sort resources':'资源排序');
      $('rd-tag').options[0].text=tr('allTags');
      $('rd-pricing').options[0].text=tr('anyPricing');
      $('rd-platform').options[0].text=tr('anyPlatform');
      $('rd-sort').options[0].text=tr('sortFeatured');
      $('rd-sort').options[1].text=tr('sortNewest');
      $('rd-sort').options[2].text=tr('sortName');
      $('rd-clear').textContent=tr('clear');
      $('rd-export').textContent=tr('export');
      $('rd-import-trigger').textContent=tr('import');
    }
    function updateSaveButton(button) {
      const isSaved=saved.has(button.dataset.saveId);
      button.classList.toggle('is-saved',isSaved);
      button.setAttribute('aria-pressed',String(isSaved));
      button.setAttribute('aria-label',isSaved?(button.dataset.removeSavedLabel||tr('saved')):(button.dataset.saveLabel||tr('savedShort')));
    }
    function syncSavedButtons() {
      document.querySelectorAll('[data-save-id]').forEach(updateSaveButton);
    }
    function syncLibraryControls() {
      const allActive=!state.category&&!state.favoritesOnly&&state.view==='resources';
      document.querySelectorAll('#rd-category-nav [data-category]').forEach(button=>{
        const id=button.dataset.category;
        button.classList.toggle('is-active',id?id===state.category:allActive);
      });
      document.querySelectorAll('#rd-category-nav [data-subcategory]').forEach(button=>{
        button.classList.toggle('is-active',button.dataset.subcategory===state.subcategory);
      });
      $('rd-favorite-count').textContent=String(saved.size);
      $('rd-mobile-favorite-count').textContent=String(saved.size);
      $('rd-collection-count').textContent=String(collections.length);
      $('rd-mobile-collection-count').textContent=String(collections.length);
      $('rd-collections-button').classList.toggle('is-active',state.view==='collections');
      $('rd-favorites-button').classList.toggle('is-active',state.favoritesOnly);
      $('rd-mobile-favorites').classList.toggle('is-active',state.favoritesOnly);
      $('rd-mobile-collections').classList.toggle('is-active',state.view==='collections');
    }
    function renderSidebar() {
      let html='<button class="rd-side-button '+(!state.category&&!state.favoritesOnly&&state.view==='resources'?'is-active':'')+'" type="button" data-category=""><span class="rd-side-button__icon">⌘</span><span>'+escapeHtml(tr('all'))+'</span><span class="rd-side-button__count">'+resources.length+'</span></button>';
      categories.forEach((category,index)=>{
        const count=categoryCounts.get(category.id)||0, active=state.category===category.id;
        const symbol=['✦','⌘','↗','◈','⏱','◎','▤'][index]||'•';
        html+='<button class="rd-side-button '+(active?'is-active':'')+'" type="button" data-category="'+escapeHtml(category.id)+'"><span class="rd-side-button__icon">'+symbol+'</span><span>'+escapeHtml(category.name[localeKey()])+'</span><span class="rd-side-button__count">'+count+'</span></button>';
        if(active){
          const subHtml=category.subcategories.filter(sub=>(subcategoryCounts.get(category.id+':'+sub.id)||0)>0).map(sub=>{
            const subActive=state.subcategory===sub.id;
            return '<button type="button" class="'+(subActive?'is-active':'')+'" data-subcategory="'+escapeHtml(sub.id)+'"><span>'+escapeHtml(sub.name[localeKey()])+'</span><small>'+subcategoryCounts.get(category.id+':'+sub.id)+'</small></button>';
          }).join('');
          if(subHtml) html+='<div class="rd-subnav">'+subHtml+'</div>';
        }
      });
      $('rd-category-nav').innerHTML=html;
      syncLibraryControls();
    }
    function getQuickSubcategories() {
      const all=[];
      categories.forEach(category=>{
        category.subcategories.forEach(sub=>{
          const count=subcategoryCounts.get(category.id+':'+sub.id)||0;
          if(count>0 && (!state.category||category.id===state.category)) all.push({category:category,sub:sub,count:count});
        });
      });
      if(!state.category) return all.sort((a,b)=>b.count-a.count).slice(0,10);
      return all.sort((a,b)=>b.count-a.count);
    }
    function renderQuick() {
      const quick=getQuickSubcategories();
      $('rd-quick-list').innerHTML=quick.map(entry=>{
        const active=state.subcategory===entry.sub.id;
        return '<button type="button" class="rd-chip '+(active?'is-active':'')+'" data-quick-category="'+escapeHtml(entry.category.id)+'" data-quick-subcategory="'+escapeHtml(entry.sub.id)+'">'+escapeHtml(entry.sub.name[localeKey()])+' <small>'+entry.count+'</small></button>';
      }).join('') || '<span class="rd-search-hint">'+(state.lang==='en'?'No subcategories with published resources yet.':'当前分类还没有已发布的子分类资源。')+'</span>';
    }
    function renderFilterOptions() {
      const tagValue=state.tag, platformValue=state.platform;
      $('rd-tag').innerHTML='<option value="">'+escapeHtml(tr('allTags'))+'</option>'+tagOptions.map(tag=>'<option value="'+escapeHtml(tag)+'">'+escapeHtml(tag)+'</option>').join('');
      $('rd-platform').innerHTML='<option value="">'+escapeHtml(tr('anyPlatform'))+'</option>'+platformOptions.map(platform=>'<option value="'+escapeHtml(platform)+'">'+escapeHtml(platform)+'</option>').join('');
      $('rd-pricing').innerHTML='<option value="">'+escapeHtml(tr('anyPricing'))+'</option>'+['free','freemium','paid','free-trial','open-source','unknown'].map(key=>'<option value="'+key+'">'+escapeHtml(tr(key))+'</option>').join('');
      $('rd-tag').value=tagValue; $('rd-platform').value=platformValue; $('rd-pricing').value=state.pricing; $('rd-sort').value=state.sort;
    }
    function getFilteredResources() {
      const query=normalize(state.query);
      const queryTokens=query.split(/\s+/).filter(Boolean);
      const collectionIds=state.collection?collectionResourceSets.get(state.collection.slug):null;
      const ordered=sortedResources[state.sort]||sortedResources.featured;
      const matched=[];
      for(const item of ordered){
        if(state.category&&item.category!==state.category) continue;
        if(state.subcategory&&item.subcategory!==state.subcategory) continue;
        if(state.tag&&!(item.tags||[]).includes(state.tag)) continue;
        if(state.pricing&&item.pricing!==state.pricing) continue;
        if(state.platform&&!(item.platforms||[]).includes(state.platform)) continue;
        if(state.favoritesOnly&&!saved.has(item.id)) continue;
        if(collectionIds&&!collectionIds.has(item.id)) continue;
        if(!matchesQuery(item,query,queryTokens)) continue;
        matched.push(item);
      }
      return matched;
    }
    function loadFavicon(img,onComplete) {
      if(img.dataset.faviconStarted==='true'){onComplete();return;}
      img.dataset.faviconStarted='true';
      const fallback=img.previousElementSibling;
      const domain=img.dataset.faviconHost;
      const origin=img.dataset.faviconOrigin;
      const candidates=[
        img.dataset.faviconCustom,
        domain?'https://favicon.yandex.net/favicon/v2/'+domain+'?size=32':'',
        ...(origin?[
          new URL('/favicon.ico',origin).href,
          new URL('/favicon.svg',origin).href,
          new URL('/apple-touch-icon.png',origin).href,
          new URL('/apple-touch-icon-precomposed.png',origin).href
        ]:[])
      ].filter(Boolean);
      let index=0,attempt=0,timer=null,finished=false;
      const finish=()=>{
        if(finished) return;
        finished=true;
        if(timer) clearTimeout(timer);
        onComplete();
      };
      const failover=()=>{
        if(timer){clearTimeout(timer);timer=null;}
        if(index>=candidates.length){
          attempt++;
          img.onload=null;
          img.onerror=null;
          img.hidden=true;
          finish();
          return;
        }
        const currentAttempt=++attempt;
        const url=candidates[index++];
        img.onload=()=>{
          if(currentAttempt!==attempt) return;
          if(timer){clearTimeout(timer);timer=null;}
          if(img.naturalWidth>1&&img.naturalHeight>1){
            fallback.hidden=true;
            img.classList.add('is-loaded');
            finish();
          } else failover();
        };
        img.onerror=()=>{if(currentAttempt===attempt) failover();};
        img.src=url;
        const timeoutMs=index===1?5000:1800;
        timer=setTimeout(()=>{if(currentAttempt===attempt) failover();},timeoutMs);
      };
      failover();
    }
    function pumpFaviconQueue() {
      while(activeFaviconLoads<MAX_CONCURRENT_FAVICONS&&faviconQueue.length){
        const img=faviconQueue.shift();
        img.dataset.faviconQueued='false';
        const card=img.closest('.rd-card');
        if(!img.isConnected||img.dataset.faviconStarted==='true'||card?.hidden||!card?.classList.contains('is-near-viewport')) continue;
        activeFaviconLoads++;
        loadFavicon(img,()=>{
          activeFaviconLoads--;
          pumpFaviconQueue();
        });
      }
    }
    function enqueueFavicon(img) {
      if(img.dataset.faviconStarted==='true'||img.dataset.faviconQueued==='true') return;
      img.dataset.faviconQueued='true';
      faviconQueue.push(img);
      pumpFaviconQueue();
    }
    const cardObserver='IntersectionObserver' in window?new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        const card=entry.target;
        card.classList.toggle('is-near-viewport',entry.isIntersecting);
        if(entry.isIntersecting){
          const img=card.querySelector('img[data-favicon-host]');
          if(img) enqueueFavicon(img);
        }
      });
    },{rootMargin:'300px 0px'}):null;
    function hydrateCards(root) {
      root.querySelectorAll('.rd-card').forEach(card=>{
        if(cardObserver) cardObserver.observe(card);
        else {
          card.classList.add('is-near-viewport');
          const img=card.querySelector('img[data-favicon-host]');
          if(img) enqueueFavicon(img);
        }
      });
    }
    function renderCollections() {
      $('rd-results').hidden=true; $('rd-collections').hidden=false; $('rd-empty').hidden=true;
      $('rd-collections').innerHTML=collections.map((collection,index)=>{
        const count=collection.resourceIds.filter(id=>resources.some(item=>item.id===id)).length;
        return '<button type="button" class="rd-collection" data-collection="'+escapeHtml(collection.slug)+'"><small>'+String(index+1).padStart(2,'0')+' / '+count+' '+escapeHtml(tr('resultSuffix'))+'</small><strong>'+escapeHtml(collection.name[localeKey()])+'</strong><p>'+escapeHtml(collection.description[localeKey()])+'</p><span>'+(state.lang==='en'?'Explore collection ↗':'查看合集 ↗')+'</span></button>';
      }).join('');
      $('rd-results-title').textContent=tr('collections');
      $('rd-results-subtitle').textContent=tr('collectionSubtitle');
      $('rd-result-count').textContent=String(collections.length)+(state.lang==='en'?' collections':' 个合集');
    }
    function renderResults() {
      if(state.view==='collections'){renderCollections();return;}
      if($('rd-results').hidden) $('rd-results').hidden=false;
      if(!$('rd-collections').hidden) $('rd-collections').hidden=true;
      const root=$('rd-results');
      if(state.sort!==renderedSort){
        const fragment=document.createDocumentFragment();
        for(const item of (sortedResources[state.sort]||sortedResources.featured)){
          const card=resourceCards.get(item.id);
          if(card) fragment.append(card);
        }
        root.append(fragment);
        renderedSort=state.sort;
      }
      const matched=getFilteredResources();
      const matchedIds=new Set(matched.map(item=>item.id));
      for(const [id,card] of resourceCards){
        const shouldHide=!matchedIds.has(id);
        if(card.hidden!==shouldHide) card.hidden=shouldHide;
      }
      const resultCount=String(matched.length)+' '+tr('resultSuffix');
      if($('rd-result-count').textContent!==resultCount) $('rd-result-count').textContent=resultCount;
      const isEmpty=matched.length===0;
      if($('rd-empty').hidden!==isEmpty) $('rd-empty').hidden=isEmpty;
      if(matched.length===0){
        const heading=$('rd-empty').querySelector('strong'),help=$('rd-empty').querySelector('p');
        const emptyTitle=state.favoritesOnly&&saved.size===0?tr('noFavorites'):tr('noResults');
        const emptyHelp=state.favoritesOnly&&saved.size===0?tr('noFavoritesHelp'):tr('noResultsHelp');
        if(heading.textContent!==emptyTitle) heading.textContent=emptyTitle;
        if(help.textContent!==emptyHelp) help.textContent=emptyHelp;
      }
      const category=getCategory(state.category),sub=getSubcategory(category,state.subcategory);
      const title=state.favoritesOnly?tr('saved'):state.query?tr('searchResults'):state.collection?state.collection.name[localeKey()]:sub?.name?.[localeKey()]||category?.name?.[localeKey()]||tr('all');
      if($('rd-results-title').textContent!==title) $('rd-results-title').textContent=title;
      let subtitle=state.favoritesOnly?tr('savedSubtitle'):category?.description?.[localeKey()]||(state.lang==='en'?'Browse the complete directory or narrow it down by topic.':'浏览全部资源，或按主题进一步缩小范围。');
      if(state.collection) subtitle=state.collection.description[localeKey()];
      if($('rd-results-subtitle').textContent!==subtitle) $('rd-results-subtitle').textContent=subtitle;
      if(state.collection) $('rd-results-subtitle').innerHTML=escapeHtml(subtitle)+' <button type="button" id="rd-clear-collection" class="rd-chip">'+escapeHtml(tr('clearCollection'))+'</button>';
    }
    function render() {
      renderSidebar(); renderQuick(); renderFilterOptions(); renderResults();
    }
    function clearFilters() {
      state.category=''; state.subcategory=''; state.tag=''; state.pricing=''; state.platform=''; state.query='';
      state.favoritesOnly=false; state.collection=null; state.view='resources'; state.sort='featured';
      $('rd-search').value=''; render();
    }
    document.addEventListener('click',event=>{
      const categoryButton=event.target.closest('[data-category]');
      if(categoryButton){state.category=categoryButton.dataset.category;state.subcategory='';state.favoritesOnly=false;state.collection=null;state.view='resources';render();return;}
      const subButton=event.target.closest('[data-subcategory]');
      if(subButton){state.subcategory=subButton.dataset.subcategory;state.favoritesOnly=false;state.collection=null;state.view='resources';render();return;}
      const quickButton=event.target.closest('[data-quick-subcategory]');
      if(quickButton){state.category=quickButton.dataset.quickCategory;state.subcategory=quickButton.dataset.quickSubcategory;state.favoritesOnly=false;state.collection=null;state.view='resources';render();return;}
      const saveButton=event.target.closest('[data-save-id]');
      if(saveButton){const id=saveButton.dataset.saveId;if(saved.has(id))saved.delete(id);else saved.add(id);persistSaved();updateSaveButton(saveButton);syncLibraryControls();renderResults();return;}
      const collectionButton=event.target.closest('[data-collection]');
      if(collectionButton){state.collection=collections.find(item=>item.slug===collectionButton.dataset.collection)||null;state.category='';state.subcategory='';state.favoritesOnly=false;state.view='resources';render();return;}
      if(event.target.closest('#rd-clear-collection')){state.collection=null;render();return;}
    });
    $('rd-search').addEventListener('input',event=>{
      if(state.favoritesOnly||state.view==='collections') searchNeedsNavigationSync=true;
      state.query=event.target.value;
      state.favoritesOnly=false;
      state.collection=null;
      state.view='resources';
      if(searchFrame) cancelAnimationFrame(searchFrame);
      searchFrame=requestAnimationFrame(()=>{
        searchFrame=0;
        renderResults();
        if(searchNeedsNavigationSync){syncLibraryControls();searchNeedsNavigationSync=false;}
      });
    });
    $('rd-search').addEventListener('keydown',event=>{
      if(event.key==='Enter'){event.preventDefault();}
      else if(event.key==='ArrowDown'){const first=$('rd-results').querySelector('.rd-card-title');if(first){event.preventDefault();first.focus();}}
      else if(event.key==='Escape'){if(state.query){state.query='';$('rd-search').value='';if(searchFrame)cancelAnimationFrame(searchFrame);searchFrame=0;searchNeedsNavigationSync=false;render();}else event.target.blur();}
    });
    ['tag','pricing','platform','sort'].forEach(key=>{
      $('rd-'+key).addEventListener('change',event=>{state[key]=event.target.value;renderResults();});
    });
    $('rd-clear').addEventListener('click',clearFilters);
    $('rd-favorites-button').addEventListener('click',()=>{state.favoritesOnly=!state.favoritesOnly;state.collection=null;state.view='resources';if(state.favoritesOnly){state.category='';state.subcategory='';state.tag='';state.pricing='';state.platform='';state.query='';$('rd-search').value='';}render();});
    $('rd-collections-button').addEventListener('click',()=>{state.view='collections';state.favoritesOnly=false;state.collection=null;render();});
    $('rd-mobile-favorites').addEventListener('click',()=>$('rd-favorites-button').click());
    $('rd-mobile-collections').addEventListener('click',()=>$('rd-collections-button').click());
    document.addEventListener('keydown',event=>{
      if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();$('rd-search').focus();$('rd-search').select();}
    });
    $('rd-export').addEventListener('click',()=>{
      if(!saved.size){toast(tr('exportEmpty'));return;}
      const payload={format:'licat-resources-favorites',version:1,exportedAt:new Date().toISOString(),resourceIds:[...saved]};
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
      const anchor=document.createElement('a');anchor.href=url;anchor.download='licat-resources-favorites.json';anchor.click();URL.revokeObjectURL(url);
    });
    $('rd-import-trigger').addEventListener('click',()=>$('rd-import-file').click());
    $('rd-import-file').addEventListener('change',async()=>{
      const file=$('rd-import-file').files?.[0];$('rd-import-file').value='';if(!file)return;
      try{
        if(file.size>1024*1024)throw new Error('large');
        const payload=JSON.parse(await file.text());
        if(payload?.format!=='licat-resources-favorites'||payload.version!==1||!Array.isArray(payload.resourceIds))throw new Error('format');
        const known=new Set(resources.map(item=>item.id));const ids=payload.resourceIds.filter(id=>typeof id==='string'&&known.has(id));
        saved=new Set(ids);persistSaved();syncSavedButtons();syncLibraryControls();renderResults();toast(ids.length===payload.resourceIds.length?tr('importSuccess'):tr('importSuccess')+' '+tr('importSkipped'));
      }catch(_){toast(tr('importError'));}
    });
    window.addEventListener('storage',event=>{if(event.key===STORAGE_KEY){saved=readSaved();syncSavedButtons();syncLibraryControls();renderResults();}});
    async function init() {
      const readJson=id=>{
        const node=$(id);
        if(!node) throw new Error('Missing embedded resource data: '+id);
        return JSON.parse(node.textContent||'[]');
      };
      resources=readJson('resource-catalogue');
      categories=readJson('resource-taxonomy');
      collections=readJson('resource-collections');
      Object.assign(labels[state.lang],readJson('resource-ui-copy'));
      saved=readSaved();
      buildIndexes();
      resourceCards=new Map([...$('rd-results').querySelectorAll('[data-resource-id]')].map(card=>[card.dataset.resourceId,card]));
      $('rd-collection-count').textContent=String(collections.length);
      renderCopy();
      render();
      syncSavedButtons();
      hydrateCards($('rd-results'));
      document.documentElement.dataset.resourcesReady='true';
    }
    init().catch(error=>{
      console.error(error);
      $('rd-results').innerHTML='<div class="rd-empty"><strong>Could not load resources</strong><p>Refresh the page and try again.</p></div>';
    });
  })();