(() => {
  'use strict';

  const catalogue = [
    {
      id:'ai-natural-communication-v1.3.1',title:'AI 说人话指南 V1.3.1',
      category:'thinking',label:'表达与思考',type:'正式使用版 · V1.3.1',
      summary:'让 AI 自然表达、独立判断，更重视内容价值。新增执行优先级、内容生成与自审机制。',
      tags:['表达风格','内容价值','优先级','自审机制','任务边界','长文'],
      companion:'ai-high-value-writing-audit-v1.1',featured:true
    },
    {
      id:'ai-high-value-writing-audit-v1.1',title:'AI 高价值内容生成与自审指令 V1.1',
      category:'thinking',label:'表达与思考',type:'配套执行指令 · V1.1',
      summary:'配合《AI 说人话指南 V1.3.1》使用，把价值判断、事实核实、内容写作和针对性审稿落实到实际工作。',
      tags:['内容创作','内容自审','事实核实','SEO','AI 说人话指南'],
      companion:'ai-natural-communication-v1.3.1',featured:true
    },
    {
      id:'agent-efficient-execution-v3',title:'AI Agent 高效执行与防漂移指令 V3.0',
      category:'agent',label:'Agent 与工作流',type:'执行规范 · V3.0',
      summary:'强化任务锚定与长会话连续性，防止子任务变成主线，同时坚持连续执行、最小验证和完成即停。',
      tags:['Agent','任务锚定','防漂移','连续执行','长任务'],featured:true
    },
    {
      id:'agent-efficient-execution',title:'AI Agent 高效执行指令 V2.0',
      category:'agent',label:'Agent 与工作流',type:'执行规范 · V2.0',
      summary:'交付优先、连续执行、最小验证、控制成本和任务漂移，适合复杂工作中的执行型 Agent。',
      tags:['Agent','交付','效率','工作流'],featured:true
    },
    {
      id:'detailflow-ecommerce',title:'DetailFlow｜八屏电商详情图工作流',
      category:'design',label:'开发与设计',type:'完整工作流 · 25 节',
      summary:'从真实产品素材到连续式八屏详情页：蓝图、视觉母版、审核、确认节点与最终交付。',
      tags:['DetailFlow','电商设计','产品真实性','长文'],featured:true
    },
    {
      id:'anti-sycophancy',title:'让 AI 不再一味迎合：独立判断指令',
      category:'thinking',label:'表达与思考',type:'判断约束 · 5 条',
      summary:'让 AI 主动检查错误前提、逻辑跳跃与认知偏差，有依据地表达不同意见。',
      tags:['反迎合','事实核查','批判性思维']
    },
    {
      id:'four-quadrant-assistance',title:'四象限协作：发现盲区与未知',
      category:'agent',label:'Agent 与工作流',type:'协作框架 · 4 象限',
      summary:'从共同已知到共同未知，让 AI 补齐关键限制、主动发现盲区并提出最小验证。',
      tags:['协作','问题拆解','需求澄清']
    },
    {
      id:'first-principles-reasoning',title:'第一性原理：事实与约束审查',
      category:'thinking',label:'表达与思考',type:'简洁指令',
      summary:'从事实、前提与约束出发推导结论，而不是顺从表面叙述或未经验证的假设。',
      tags:['第一性原理','推理','决策']
    },
    {
      id:'prompt-engineer',title:'AI 提示词优化专家：双梯度生成器',
      category:'agent',label:'Agent 与工作流',type:'提示词生成器',
      summary:'只需描述实际用途，就输出精简通用版与高阶专业版，并适配不同 AI 工具。',
      tags:['Prompt Engineering','角色设定','优化']
    },
    {
      id:'codex-workflow-tips',title:'Codex 高效使用的 10 个技巧',
      category:'design',label:'开发与设计',type:'技巧清单 · 10 条',
      summary:'从侧边提问、计划模式、审查与上下文管理，到 AGENTS.md 和 Skill 复用。',
      tags:['Codex','开发效率','Skills']
    },
    {
      id:'award-level-web-design',title:'获奖级网站视觉品质提示词',
      category:'design',label:'开发与设计',type:'设计补充指令',
      summary:'以 Awwwards、Webby Awards、FWA 的视觉标准，系统审视网页的质感与体验。',
      tags:['网页设计','Awwwards','视觉质量']
    },
    {
      id:'logo-motion',title:'6 秒品牌 Logo 开场动画',
      category:'design',label:'开发与设计',type:'视频生成指令',
      summary:'用指定首尾帧和动画参考制作 Logo 动效，严格保持品牌配色与标识一致。',
      tags:['Logo','动画','视频生成']
    },
    {
      id:'daily-fable-learning',title:'每天一个研究生概念：寓言式学习',
      category:'learning',label:'学习与探索',type:'趣味学习指令',
      summary:'不急着揭晓概念，先用寓言引导理解，再揭开隐喻与理论之间的对应关系。',
      tags:['学习','寓言','知识探索']
    },
    {
      id:'memory-insight-skills',title:'历史对话洞察与 Skill 封装机会',
      category:'agent',label:'Agent 与工作流',type:'复盘与发现',
      summary:'从可访问的历史记录中发现你未注意到的决策线索，并找出三项值得 Skill 化的重复工作。',
      tags:['记忆','复盘','Skill','工作优化']
    }
  ];
  const categoryLabel={agent:'Agent 与工作流',thinking:'表达与思考',design:'开发与设计',learning:'学习与探索'};
  const byId=new Map(catalogue.map(item=>[item.id,item]));
  const legacyIds={'ai-natural-communication-v1.3':'ai-natural-communication-v1.3.1'};
  const resolveId=id=>legacyIds[id]||id;
  const $=selector=>document.querySelector(selector);
  const root=document.documentElement;
  const grid=$('#prompt-grid');
  const library=$('#library-view');
  const detail=$('#detail-view');
  const article=$('#prompt-article');
  const search=$('#search');
  const status=$('#result-status');
  const filters=[...document.querySelectorAll('[data-filter]')];
  let filter='all';
  let currentId=null;
  let currentContent='';
  let loadToken=0;
  let toastTimer;

  function esc(value){
    return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function mdInline(value){
    // Only auto-link an entire URL line; never rewrite links already in HTML.
    const raw=String(value).trim();
    if(/^https:\/\/[^\s<>]+$/.test(raw)){
      return '<a href="'+esc(raw)+'" target="_blank" rel="noopener noreferrer">'+esc(raw)+'</a>';
    }
    let s=esc(value);
    s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+)\)/g,(_,label,url)=>'<a href="'+url+'" target="_blank" rel="noopener noreferrer">'+label+'</a>');
    return s;
  }
  // Source markdown may include a display title, preface, or editorial notes.
  // Copy and reader view use only the explicitly delimited executable prompt.
  function extractPrompt(src){
    const begin='<!-- prompt:begin -->';
    const end='<!-- prompt:end -->';
    const start=src.indexOf(begin);
    const stop=src.indexOf(end);
    if(start<0 || stop<start+begin.length ||
       src.indexOf(begin,start+begin.length)!==-1 ||
       src.indexOf(end,stop+end.length)!==-1){
      throw new Error('Prompt content boundary missing or ambiguous');
    }
    const body=src.slice(start+begin.length,stop).trim();
    if(!body)throw new Error('Prompt body is empty');
    return body;
  }

  function renderMarkdown(src){
    const lines=src.replace(/\r/g,'').split('\n');
    let result='',paragraph=[],listKind=null,listEntries=[];
    const flushP=()=>{if(paragraph.length){result+='<p>'+mdInline(paragraph.join(' '))+'</p>';paragraph=[];}};
    const flushList=()=>{if(listKind){result+='<'+listKind+'>'+listEntries.map(v=>'<li>'+mdInline(v)+'</li>').join('')+'</'+listKind+'>';listEntries=[];listKind=null;}};
    const cells=s=>s.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(v=>v.trim());
    for(let i=0;i<lines.length;i++){
      const line=lines[i].trim();
      if(!line){flushP();flushList();continue;}
      const heading=line.match(/^(#{1,5})\s+(.+)$/);
      if(heading){flushP();flushList();const level=heading[1].length;result+='<h'+level+'>'+mdInline(heading[2])+'</h'+level+'>';continue;}
      if(line.startsWith('|') && i+1<lines.length && /^\s*\|?\s*:?-{2,}/.test(lines[i+1])){
        flushP();flushList();
        const headings=cells(line);i+=1;
        const rows=[];
        while(i+1<lines.length && lines[i+1].trim().startsWith('|'))rows.push(cells(lines[++i]));
        result+='<div class="table-scroll"><table><thead><tr>'+headings.map(c=>'<th>'+mdInline(c)+'</th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr>'+headings.map((_,j)=>'<td>'+mdInline(r[j]||'')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
        continue;
      }
      const bullet=line.match(/^[-*]\s+(.+)$/);
      const number=line.match(/^\d+\.\s+(.+)$/);
      if(bullet||number){
        flushP();const kind=bullet?'ul':'ol';if(listKind && listKind!==kind)flushList();
        listKind=kind;listEntries.push((bullet||number)[1]);continue;
      }
      if(line.startsWith('>')){
        flushP();flushList();result+='<blockquote>'+mdInline(line.replace(/^>\s?/,''))+'</blockquote>';continue;
      }
      flushList();
      paragraph.push(line);
    }
    flushP();flushList();
    return result;
  }

  function card(item,index){
    const classes='prompt-card'+(item.featured?' featured':'');
    return '<a class="'+classes+'" href="?p='+item.id+'" data-open="'+item.id+'" aria-label="阅读 '+esc(item.title)+'">'+
      '<span class="card-kicker">'+esc(item.label)+' <span aria-hidden="true">/</span> '+esc(item.type)+'</span>'+
      '<h3>'+esc(item.title)+'</h3><p>'+esc(item.summary)+'</p>'+
      '<div class="card-foot"><span class="card-cta">阅读并复制 <span aria-hidden="true">↗</span></span><span class="card-count">'+String(index+1).padStart(2,'0')+' / '+catalogue.length+'</span></div></a>';
  }
  function showCards(){
    const q=search.value.trim().toLocaleLowerCase();
    const matched=catalogue.filter(item=>(filter==='all'||item.category===filter) &&
      (item.title+' '+item.summary+' '+item.tags.join(' ')+' '+item.label).toLocaleLowerCase().includes(q));
    grid.innerHTML=matched.map(item=>card(item,catalogue.indexOf(item))).join('');
    status.textContent=(q||filter!=='all')?'找到 '+matched.length+' 条提示词':'';
    $('#heading-count').textContent='/ '+catalogue.length;
    $('#empty-state').hidden=matched.length>0;
    grid.hidden=matched.length===0;
  }
  function changeFilter(next){
    filter=next;
    filters.forEach(el=>{const selected=el.dataset.filter===next;el.classList.toggle('active',selected);el.setAttribute('aria-pressed',String(selected));});
    showCards();
  }
  function showLibrary(updateUrl=true){
    loadToken++;
    currentId=null;
    currentContent='';
    detail.hidden=true;
    library.hidden=false;
    document.title='AI 提示词库 · Prompt Library — Licat';
    if(updateUrl)history.pushState({},'',location.pathname);
    showCards();
    scrollTo({top:0,behavior:'auto'});
  }
  async function showDetail(id,updateUrl=true){
    const resolvedId=resolveId(id);
    const item=byId.get(resolvedId);
    if(!item){showLibrary(updateUrl);return;}
    id=resolvedId;
    currentId=id;currentContent='';
    const token=++loadToken;
    library.hidden=true;
    detail.hidden=false;
    $('#detail-title').textContent=item.title;
    $('#detail-type').textContent=item.label+' / '+item.type;
    $('#detail-index').textContent=String(catalogue.indexOf(item)+1).padStart(2,'0')+' / '+catalogue.length;
    $('#detail-summary').textContent=item.summary;
    const companion=item.companion&&byId.get(item.companion);
    $('#detail-tags').innerHTML=item.tags.map(t=>'<span class="detail-tag">'+esc(t)+'</span>').join('')+
      (companion?'<a class="detail-tag" href="/prompts/?p='+encodeURIComponent(companion.id)+'" title="阅读配套提示词">配套阅读：'+esc(companion.title)+' ↗</a>':'');
    $('#source-btn').href='https://github.com/licat233/licat233.github.io/blob/main/prompts/content/'+id+'.md';
    article.innerHTML='<p>正在载入完整内容…</p>';
    $('#copy-btn').disabled=true;$('#copy-bottom').disabled=true;
    document.title=item.title+' — Licat Prompt Library';
    if(updateUrl)history.pushState({},'',location.pathname+'?p='+encodeURIComponent(id));
    else if(new URLSearchParams(location.search).get('p')!==id)history.replaceState({},'',location.pathname+'?p='+encodeURIComponent(id));
    scrollTo({top:0,behavior:'auto'});
    try{
      const response=await fetch('/prompts/content/'+encodeURIComponent(id)+'.md');
      if(!response.ok)throw new Error('HTTP '+response.status);
      const text=await response.text();
      if(token!==loadToken)return;
      currentContent=extractPrompt(text);
      article.innerHTML=renderMarkdown(currentContent);
      $('#copy-btn').disabled=false;$('#copy-bottom').disabled=false;
    }catch(error){
      if(token!==loadToken)return;
      article.innerHTML='<h2>暂时无法加载提示词正文</h2><p>正文缺失、尚未标记可复制范围，或网络请求失败。为避免复制混入标题和说明，已暂时禁用复制；可通过 GitHub 源文件查看。</p>';
    }
  }

  async function copy(text,message){
    if(!text){toast('内容尚未载入，请稍后重试');return;}
    try{
      if(navigator.clipboard && window.isSecureContext){await navigator.clipboard.writeText(text);}
      else{
        const box=document.createElement('textarea');box.value=text;box.setAttribute('readonly','');
        box.style.cssText='position:fixed;left:-9999px;top:0';document.body.appendChild(box);
        box.select();if(!document.execCommand('copy'))throw new Error('Copy failed');box.remove();
      }
      toast(message);
    }catch(_){toast('复制失败，请手动选择文字复制');}
  }
  function toast(message){
    const el=$('#toast');clearTimeout(toastTimer);el.textContent=message;el.classList.add('show');
    toastTimer=setTimeout(()=>el.classList.remove('show'),2600);
  }

  $('#theme-toggle').addEventListener('click',()=>{
    const newTheme=root.dataset.theme==='dark'?'light':'dark';
    root.dataset.theme=newTheme;
    try{localStorage.setItem('licat-theme',newTheme);}catch(_){}
  });
  search.addEventListener('input',showCards);
  filters.forEach(el=>el.addEventListener('click',()=>changeFilter(el.dataset.filter)));
  grid.addEventListener('click',event=>{
    const link=event.target.closest('[data-open]');
    if(!link||event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();showDetail(link.dataset.open);
  });
  $('#reset-search').addEventListener('click',()=>{search.value='';changeFilter('all');search.focus();});
  $('#back-link').addEventListener('click',()=>showLibrary());
  $('#back-bottom').addEventListener('click',()=>showLibrary());
  $('#copy-btn').addEventListener('click',()=>copy(currentContent,'完整提示词已复制'));
  $('#copy-bottom').addEventListener('click',()=>copy(currentContent,'完整提示词已复制'));
  $('#share-btn').addEventListener('click',()=>copy(location.origin+location.pathname+'?p='+encodeURIComponent(currentId),'独立分享链接已复制'));
  window.addEventListener('popstate',()=>{
    const id=new URLSearchParams(location.search).get('p');
    if(id&&byId.has(resolveId(id)))showDetail(id,false);else showLibrary(false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key!=='/'||event.ctrlKey||event.metaKey||event.altKey||library.hidden)return;
    if(/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName||''))return;
    event.preventDefault();search.focus();
  });
  const initial=new URLSearchParams(location.search).get('p');
  if(initial&&byId.has(resolveId(initial)))showDetail(initial,false);else showLibrary(false);
})();
