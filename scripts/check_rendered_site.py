#!/usr/bin/env python3
"""Validate Jekyll's real HTML output, not merely its source templates."""
from html.parser import HTMLParser
from pathlib import Path

SITE = Path(__file__).resolve().parents[1] / "_site"

class Navigation(HTMLParser):
    def __init__(self):
        super().__init__()
        self.headers = 0
        self.in_header = False
        self.in_nav_items = False
        self.in_language = False
        self.items = []
        self.languages = []
        self.theme = False
        self.github = False
        self.canonicals = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = set(a.get("class", "").split())
        if tag == "header" and "site-header" in cls:
            self.headers += 1
            self.in_header = True
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href"))
        if not self.in_header:
            return
        if tag == "div" and "nav-links" in cls:
            self.in_nav_items = True
        if tag == "div" and "lang" in cls:
            self.in_language = True
        if tag == "button" and "theme-toggle" in cls:
            self.theme = True
        if tag == "a":
            if self.in_nav_items and "nav-pill" in cls:
                self.items.append(a)
            if self.in_language:
                self.languages.append(a)
            if "github-cta" in cls:
                self.github = True

    def handle_endtag(self, tag):
        if tag == "div" and self.in_nav_items:
            self.in_nav_items = False
        if tag == "div" and self.in_language:
            self.in_language = False
        if tag == "header":
            self.in_header = False

def assert_ok(condition, message):
    if not condition:
        raise AssertionError(message)

def read(path):
    file = SITE / path
    assert_ok(file.is_file(), f"Jekyll did not render {file}")
    return file.read_text(encoding="utf-8")

def verify(path, lang, active, homepage=False, paired=None):
    text = read(path)
    p = Navigation()
    p.feed(text)
    assert_ok(p.headers == 1, f"{path}: expected one global header, got {p.headers}")
    assert_ok(len(p.items) == 7, f"{path}: expected seven navigation items, got {len(p.items)}")
    home = "/en/" if lang == "en" else "/"
    route = home
    sections = ["top", "projects", "skills", None, None, "journey", "principles"]
    expected = []
    for section in sections:
        if section:
            expected.append(("#" if homepage else home + "#") + section)
        elif len(expected) == 3:
            expected.append("/en/blog/" if lang == "en" else "/blog/")
        else:
            expected.append("/en/prompts/" if lang == "en" else "/prompts/")
    got = [a.get("href") for a in p.items]
    assert_ok(got == expected, f"{path}: nav URLs mismatch.\nexpected={expected}\nactual={got}")
    expected_active = {"home": 0, "blog": 3, "prompts": 4}[active]
    selected = [i for i, a in enumerate(p.items) if "active" in a.get("class", "").split()]
    assert_ok(selected == [expected_active], f"{path}: wrong active navigation index {selected}")
    assert_ok(p.items[expected_active].get("aria-current") == "page",
              f"{path}: selected navigation item missing aria-current")
    assert_ok(p.theme and p.github, f"{path}: theme or GitHub action missing")
    assert_ok(len(p.languages) == 2, f"{path}: expected two language switches")
    if paired:
        assert_ok([x.get("href") for x in p.languages] == paired,
                  f"{path}: language-switch URLs incorrect: {p.languages}")
    expected_canonical = "https://licat233.github.io/" + ("" if path == "index.html" else path.removesuffix("index.html"))
    assert_ok(expected_canonical in p.canonicals, f"{path}: canonical URL does not match rendered route: {p.canonicals}")

verify("index.html", "zh", "home", True, ["/", "/en/"])
verify("en/index.html", "en", "home", True, ["/", "/en/"])
verify("blog/index.html", "zh", "blog", paired=["/blog/", "/en/blog/"])
verify("en/blog/index.html", "en", "blog", paired=["/blog/", "/en/blog/"])
verify("prompts/index.html", "zh", "prompts", paired=["/prompts/", "/en/prompts/"])
verify("en/prompts/index.html", "en", "prompts", paired=["/prompts/", "/en/prompts/"])
verify("blog/publish-markdown-notes/index.html", "zh", "blog",
       paired=["/blog/publish-markdown-notes/", "/en/blog/publish-markdown-notes/"])
verify("en/blog/publish-markdown-notes/index.html", "en", "blog",
       paired=["/blog/publish-markdown-notes/", "/en/blog/publish-markdown-notes/"])
for project in ["ai-writing-audit", "armor-memory", "disable-macos-auto-updates", "greenram", "opencore-h81"]:
    for locale in ["", "zh/"]:
        path = f"{project}/{locale}index.html"
        html = read(path)
        target = "/#projects" if locale else "/en/#projects"
        assert_ok(f'href="{target}"' in html, f"{path}: rendered project breadcrumb missing")
        assert_ok("{% include" not in html, f"{path}: Jekyll include was not expanded")
assert_ok('location.replace' in read("zh/index.html"), "Legacy Chinese alias lost its redirect")
print("SITE_NAVIGATION_RENDERED_HTML_PASS: 8 bilingual routes, 10 project breadcrumbs, canonical, active state, language, theme")
