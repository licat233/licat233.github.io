# Licat / 233 — Personal Website

Website: https://licat233.github.io/

Static publishing: GitHub Pages + Jekyll. No client-side framework or additional backend is required for the content site.

## Information architecture

| Category | Chinese | English | Navigation role |
| --- | --- | --- | --- |
| Home | `/` | `/en/` | Main site navigation |
| Projects | `/projects/` | `/en/projects/` | Main site navigation |
| Skills | `/skills/` | `/en/skills/` | Main site navigation |
| Blog | `/blog/` | `/en/blog/` | Main site navigation |
| Prompt Library | `/prompts/` | `/en/prompts/` | Main site navigation |

The homepage has separate **on-this-page** links to `#projects`, `#skills`, `#journey`, and `#principles`. These are homepage sections, **not** global navigation destinations. `/zh/` is a backwards-compatible redirect to the canonical Chinese homepage `/`; legacy queries and fragments are preserved.

## Shared architecture

- `_data/site_nav.yml`: authoritative five-item site-level navigation routes and language labels.
- `_includes/site-header.html`: one global header for Home, Projects, Skills, Blog and Prompt Library.
- `assets/site-header.css` and `assets/site-nav.js`: shared header appearance, language-independent theme and active-page behavior.
- `_includes/home-sections.html`: separate homepage-only anchors.
- `_layouts/site-section.html`: shared bilingual Projects and Skills listing template.
- `_data/projects.yml` and `_data/skills.yml`: published project/Skill listing metadata. Homepage featured content remains an editorial preview, not a separate category.
- `_layouts/blog.html`: Jekyll Blog site shell. Post-to-post language links only point to a translated post when one exists; otherwise they return to the corresponding Blog listing.
- `_includes/site-context.html` and `assets/site-context.css`: common **Licat › Projects › Current project** hierarchy and the same five site destinations on dedicated project pages. Those pages intentionally keep independent **project-local** navigation and visuals.
- Normal project pages share `licat-theme` with the content site. EAO and ToolScout retain their own project-local theme/design systems.

The HTML project pages covered by the shared site-context include are five bilingual project pairs, EAO (Chinese canonical, English, and legacy Chinese alias), and ToolScout (Chinese and English). `/lottery-calculate/` is a separately built interactive application rather than a content page; experiments under `/demo/` are not part of the public primary navigation. Existing project and article URLs remain intact.

## Blog publishing

Write a Markdown file in `_posts/YYYY-MM-DD-slug.md` with Jekyll front matter: `layout: post`, `title`, `date`, `description`, and `lang`. Use `translation_url` only when the paired article is actually published. Commit to `main`; GitHub Pages builds the article and updates the corresponding Blog list.

## Quality gates

The `.github/workflows/site-navigation.yml` workflow executes:

1. `python3 scripts/check_site_navigation.py` — verify source structure, five authoritative destinations, both language routes, the standalone project shell, and the homepage/local-nav distinction.
2. `node --check` — check critical shared/site-specific JavaScript syntax.
3. Jekyll build and `python3 scripts/check_rendered_site.py` — inspect actual generated HTML, not just Liquid templates, for 12 core views and 15 project context pages.

GitHub Pages `pages build and deployment` must also pass. Automated markup/build checks do **not** substitute for real desktop/mobile browser interaction and visual regression testing.

When adding content: update the single navigation/catalog data sources and shared includes where appropriate. Do **not** copy a navigation implementation or add a top-level page for an ordinary homepage section. Preserve existing canonical URLs and deep links.
