#!/usr/bin/env python3
"""Zero-dependency source-level integrity checks for Licat's Jekyll site."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def get(path):
    return (ROOT / path).read_text(encoding="utf-8")
def assert_ok(condition, message):
    if not condition:
        raise AssertionError(message)

DATA = get("_data/site_nav.yml")
links = re.findall(r"(?m)^- key: ([a-z]+)$", DATA)
assert_ok(links == ["home", "projects", "skills", "blog", "prompts", "journey", "principles"],
          "Global navigation must preserve the seven agreed items in order.")
for locale in ["zh", "en"]:
    for label in ["blog", "prompts"]:
        route = f"/{locale}/{label}/" if locale == "en" else f"/{label}/"
        assert_ok(f"{locale}_url: {route}" in DATA, f"Missing {locale} {label} route: {route}")
include = get("_includes/site-header.html")
assert_ok("site.data.site_nav" in include, "Header must use central navigation data.")
assert_ok('class="nav-links"' in include and 'class="nav-indicator"' in include,
          "Shared header lost its indicator.")
assert_ok('class="liquid-demo theme-toggle"' in include, "Shared header lost theme toggle.")
assert_ok('aria-current="page"' in include, "Shared header must indicate active page.")
assert_ok("page.translation_url" in include, "Blog translation routes must respect the article mapping.")
for path, lang, active in [
    ("index.html", "zh", "home"),
    ("en/index.html", "en", "home"),
    ("prompts/index.html", "zh", "prompts"),
    ("en/prompts/index.html", "en", "prompts"),
]:
    src = get(path)
    expected = "{% include site-header.html lang='" + lang + "' active='" + active + "' %}"
    assert_ok(expected in src, f"{path} does not use shared global header.")
    assert_ok(src.startswith("---\nlang: " + lang + "\n---\n"), f"{path} missing Jekyll front matter.")
    assert_ok('<header class="liquid-demo site-header' not in src,
              f"{path} reintroduced a copy/pasted site header.")
    assert_ok("/assets/site-header.css?" in src and "/assets/site-nav.js?" in src,
              f"{path} must load shared navigation assets.")
    assert_ok("/prompts/nav.css" not in src, f"{path} loads obsolete independent nav CSS.")
blog = get("_layouts/blog.html")
assert_ok("{% include site-header.html lang=page.lang active='blog' %}" in blog,
          "Blog layout does not share navigation.")
assert_ok("const storedTheme" not in blog, "Blog layout reintroduced duplicate theme logic.")
for anchor in ["projects", "skills", "journey", "principles"]:
    assert_ok(f'id="{anchor}"' in get("index.html") and
              f'id="{anchor}"' in get("en/index.html"),
              f"Navigation references a missing homepage section: {anchor}")
for path in ["assets/portfolio-motion.js", "prompts/prompt-library.js"]:
    assert_ok("const themeToggle = document.querySelector" not in get(path),
              f"{path} has duplicate navigation theme handler.")
assert_ok("window.LicatSiteNav" in get("assets/site-nav.js"),
          "Global JS API is missing.")
assert_ok("window.LicatSiteNav" in get("assets/portfolio-motion.js"),
          "Homepage section tracker must reuse the global nav API.")
assert_ok("setLocaleLinks" in get("prompts/prompt-library.js"),
          "Prompt detail language-switch links were lost.")
assert_ok("location.replace('/' + location.search + location.hash)" in get("zh/index.html"),
          "Legacy Chinese homepage should preserve bookmark query and fragment.")
assert_ok("noindex,follow" in get("zh/index.html"), "Legacy alias must not be separately indexed.")
print("SITE_NAVIGATION_SOURCE_CHECK_PASS: bilingual routes, shared header/styles/JS, legacy alias, prompt deep links")
