#!/usr/bin/env python3
"""Source contract for site-level vs page-local navigation (no extra dependencies)."""
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def read(path): return (ROOT/path).read_text(encoding="utf-8")
def check(ok, message):
    if not ok: raise AssertionError(message)

nav=read("_data/site_nav.yml")
keys=re.findall(r"(?m)^- key: ([a-z]+)$",nav)
check(keys==["home","projects","skills","blog","prompts"],f"Unexpected site nav {keys}")
for lang in ["zh","en"]:
    for key in keys:
        url=("/en/" if lang=="en" else "/")+(key+"/" if key!="home" else "")
        check(f"{lang}_url: {url}" in nav, f"Missing {lang} {key} route {url}")
check("journey" not in keys and "principles" not in keys,"Home sections leaked into global nav")
header=read("_includes/site-header.html")
check("site.data.site_nav" in header and 'class="nav-links"' in header, "Shared site header missing")
check("data-nav-target=" not in header, "Site navigation should not be homepage scroll nav")
check("page.translation_url" in header,"Blog translation route support missing")
check("include.active == 'projects'" in header and "include.active == 'skills'" in header,
      "Category language counterpart routing missing")
check('class="home-section-nav' in read("_includes/home-sections.html"),
      "Homepage-only secondary navigation missing")
for lang,path in [("zh","index.html"),("en","en/index.html")]:
    s=read(path)
    check(f"{{% include site-header.html lang='{lang}' active='home' %}}" in s,
          f"Homepage shared header missing: {path}")
    check(f"{{% include home-sections.html lang='{lang}' %}}" in s,
          f"Homepage local navigation missing: {path}")
    for anchor in ["projects","skills","journey","principles"]:
        check(f'id="{anchor}"' in s, f"Broken homepage section {anchor} in {path}")
for key in ["projects","skills","prompts"]:
    for lang in ["zh","en"]:
        path=(f"en/{key}/index.html" if lang=="en" else f"{key}/index.html")
        s=read(path)
        if key in ["projects","skills"]:
            check("layout: site-section" in s and f"section: {key}" in s,
                  f"Missing content category page {path}")
        else:
            check(f"{{% include site-header.html lang='{lang}' active='prompts' %}}" in s,
                  f"Prompt global header missing {path}")
check("site.data.projects" in read("_layouts/site-section.html"),"Projects catalog missing")
check("site.data.skills" in read("_layouts/site-section.html"),"Skills catalog missing")
check(read("_data/projects.yml").count("- name:")==8, "Project catalog unexpectedly changed")
check(read("_data/skills.yml").count("- name:")==2, "Skills catalog unexpectedly changed")
check("{% include site-header.html lang=page.lang active='blog' %}" in read("_layouts/blog.html"),
      "Blog global header missing")
for path in ["assets/portfolio-motion.js","prompts/prompt-library.js"]:
    check("const themeToggle = document.querySelector" not in read(path),
          "Duplicate theme handler in "+path)
check("window.LicatSiteNav" in read("assets/site-nav.js"),"Shared navigation JavaScript missing")
check("window.LicatSiteNav" in read("assets/portfolio-motion.js"),"Homepage animation lost shared nav reference")
check("setLocaleLinks" in read("prompts/prompt-library.js"),"Prompt language deep links missing")
check("site.data.site_nav" in read("_includes/site-context.html"),
      "Project site shell isn't derived from global navigation")
for name in ["ai-writing-audit","armor-memory","disable-macos-auto-updates","greenram","opencore-h81"]:
    for suffix,lang in [("","en"),("zh/","zh")]:
        path=f"{name}/{suffix}index.html"
        s=read(path)
        check(f"{{% include site-context.html lang='{lang}' project=" in s,
              f"Project lacks site context: {path}")
        check("licat-project-theme" not in s and "/assets/site-context.css" in s,
              f"Project shell or theme drifted: {path}")
for path,lang in [("eao/index.html","zh"),("eao/zh/index.html","zh"),("eao/en/index.html","en"),
                  ("toolscout/zh/index.html","zh"),("toolscout/en/index.html","en")]:
    s=read(path)
    check(f"{{% include site-context.html lang='{lang}' project=" in s,
          f"Microsite lacks common site context {path}")
check("location.replace('/' + location.search + location.hash)" in read("zh/index.html"),
      "Legacy Chinese homepage compatibility lost")
print("SITE_IA_SOURCE_PASS: 5 global destinations, homepage secondary nav, 4 category pages, 15 project shells")
