(() => {
  const root=document.documentElement;
  const toggle=document.querySelector(".theme-toggle");
  const system=window.matchMedia("(prefers-color-scheme: dark)");
  const key="licat-project-theme";
  const stored=()=>{try{const v=localStorage.getItem(key);return v==="light"||v==="dark"?v:null}catch(_){return null}};
  const apply=(theme,persist=false)=>{
    root.dataset.theme=theme;root.style.colorScheme=theme;
    if(persist){try{localStorage.setItem(key,theme)}catch(_){}}
    if(toggle){
      const dark=theme==="dark";
      toggle.setAttribute("aria-pressed",String(dark));
      toggle.title=dark?"Switch to light mode":"Switch to dark mode";
    }
  };
  apply(stored()||(system.matches?"dark":"light"));
  toggle?.addEventListener("click",()=>apply(root.dataset.theme==="dark"?"light":"dark",true));
  const onSystem=e=>{if(!stored())apply(e.matches?"dark":"light")};
  system.addEventListener?.("change",onSystem);

  const links=[...document.querySelectorAll(".nav-links a[href^='#']")];
  const pairs=links.map(link=>({link,target:document.querySelector(link.getAttribute("href"))})).filter(x=>x.target);
  if("IntersectionObserver" in window&&pairs.length){
    const io=new IntersectionObserver(entries=>{
      const hit=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(!hit)return;
      pairs.forEach(({link,target})=>link.classList.toggle("is-active",target===hit.target));
    },{rootMargin:"-28% 0px -58% 0px",threshold:[0,.1,.25,.5]});
    pairs.forEach(({target})=>io.observe(target));
  }
})();