#!/usr/bin/env python3
"""Check generated Jekyll HTML, navigation hierarchy, and language routes."""
from html.parser import HTMLParser
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]/"_site"
def read(path):
    p=ROOT/path
    if not p.is_file(): raise AssertionError(f"Missing generated page: {p}")
    return p.read_text(encoding="utf-8")
def check(v,message):
    if not v: raise AssertionError(message)

class Nav(HTMLParser):
    def __init__(self):
        super().__init__()
        self.site_headers=0
        self.in_header=False
        self.nav_pills=[]
        self.language=[]
        self.in_pills=False
        self.in_lang=False
        self.theme=False
        self.github=False
        self.canonicals=[]
        self.local_nav=False
        self.project_links=[]
        self.in_context=False
        self.contexts=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs); c=set(a.get("class","").split())
        if tag=="link" and a.get("rel")=="canonical": self.canonicals.append(a.get("href"))
        if tag=="header" and "site-header" in c: self.site_headers+=1;self.in_header=True
        if tag=="nav" and "site-context" in c: self.contexts+=1;self.in_context=True
        if tag=="nav" and ("eao-optical-surface" in c or "shell" in c) and not self.in_header: self.local_nav=True
        if self.in_context and tag=="a": self.project_links.append(a.get("href"))
        if not self.in_header:return
        if tag=="div" and "nav-links" in c:self.in_pills=True
        if tag=="div" and "lang" in c:self.in_lang=True
        if tag=="button" and "theme-toggle" in c:self.theme=True
        if tag=="a":
            if self.in_pills and "nav-pill" in c:self.nav_pills.append(a)
            if self.in_lang:self.language.append(a.get("href"))
            if "github-cta" in c:self.github=True
    def handle_endtag(self,tag):
        if tag=="nav":self.in_context=False
        if tag=="div" and self.in_pills:self.in_pills=False
        if tag=="div" and self.in_lang:self.in_lang=False
        if tag=="header":self.in_header=False

KEYS=["home","projects","skills","blog","prompts"]
def paths(lang):
    base="/en/" if lang=="en" else "/"
    return [base]+[base+key+"/" for key in KEYS[1:]]
def verify(path,lang,active,paired):
    p=Nav();p.feed(read(path))
    check(p.site_headers==1,f"{path} missing common site header")
    check(len(p.nav_pills)==5,f"{path} expected five global links, got {p.nav_pills}")
    actual=[x.get("href") for x in p.nav_pills]
    check(actual==paths(lang),f"{path} global routes wrong: {actual}")
    selected=[i for i,x in enumerate(p.nav_pills) if "active" in x.get("class","").split()]
    check(selected==[KEYS.index(active)],f"{path} wrong active nav {selected}")
    check(p.nav_pills[selected[0]].get("aria-current")=="page",f"{path} current item semantics missing")
    check(p.theme and p.github, f"{path} missing global theme/GitHub")
    check(p.language==paired, f"{path} language switch wrong: {p.language} expected={paired}")
    canonical="https://licat233.github.io/"+path.removesuffix("index.html")
    check(canonical in p.canonicals,f"{path} canonical mismatch: {p.canonicals}")

for lang,pre in [("zh",""),("en","en/")]:
    for key in KEYS:
        path=pre+("" if key=="home" else key+"/")+"index.html"
        paired=["/"+("" if key=="home" else key+"/"),"/en/"+("" if key=="home" else key+"/")]
        verify(path,lang,key,paired)
    home=read(pre+"index.html")
    check('class="home-section-nav' in home and 'href="#journey"' in home,
          f"{lang} homepage section nav lost")
for name in ["ai-writing-audit","armor-memory","disable-macos-auto-updates","greenram","opencore-h81"]:
    for suffix,lang in [("","en"),("zh/","zh")]:
        path=f"{name}/{suffix}index.html";html=read(path);p=Nav();p.feed(html)
        check(p.contexts==1,f"{path} missing site context")
        expected=paths(lang)
        check(all(url in p.project_links for url in expected),f"{path} global site links broken")
        check("site-context__path" in html and "{% include" not in html,f"{path} breadcrumb not rendered")
for path,lang in [("eao/index.html","zh"),("eao/zh/index.html","zh"),("eao/en/index.html","en"),
                  ("toolscout/zh/index.html","zh"),("toolscout/en/index.html","en")]:
    p=Nav();p.feed(read(path))
    check(p.contexts==1,f"{path} lacks site context")
    check(all(url in p.project_links for url in paths(lang)), f"{path} global site routes broken")
check("location.replace" in read("zh/index.html"),"Legacy alias lost")
print("SITE_IA_RENDER_PASS: 12 core routes, 5 destinations, 15 project shells, localized navigation")
