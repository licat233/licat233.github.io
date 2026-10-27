# Astro migration — isolated branch

This is an **unpublished Astro workspace**. The production `main` branch still uses Jekyll.

## Commands

```sh
cd astro
npm ci
npm run build
npm run check
npm run dev
```

Node.js 24 recommended, Astro 7.4.2 pinned. No Ruby or Bundler in this build.

## Migration strategy

- `src/components/SiteHeader.astro` and `src/layouts/BaseLayout.astro`: real Astro navigation and shared content layout.
- `src/content.config.ts` reads original repository `_posts/*.md` with a Content Collection; original Markdown stays in place, including the 2026 SEO/GEO articles.
- `src/lib/catalog.ts` reads the original `_data/projects.yml` and `_data/skills.yml` (no copy of metadata).
- The homepage and Prompt Library temporarily use `src/layouts/LegacyPage.astro`, which injects an Astro navigation component but preserves the existing HTML, CSS, GSAP and prompt search/copy JS.
- `scripts/prepare-public.mjs` copies static assets and standalone projects, strips Jekyll YAML headers and replaces project breadcrumb includes. It is a **temporary compatibility bridge**, not the final maintainable project architecture.
- Both Chinese root and English `/en/` routes are retained. `/zh/` still redirects. Existing `?p=` prompt share links and blog article URLs remain valid.
- This branch does NOT deploy to the public GitHub Pages URL. A separate Actions workflow builds and checks it and uploads its `dist/` as a CI artifact. Do not enable an Astro Pages deployment before final approval.

## Remaining before cutover

1. Convert home/prompt visual templates from the compatibility adapter into native Astro components incrementally.
2. Move each standalone project microsite to Astro layouts or isolate it as a deliberately independent static app with explicit ownership.
3. Verify all existing URLs, browser interactions, image assets, SEO metadata, mobile layouts and visual parity against the live Jekyll site.
4. Review generated assets and lockfile; cut over GitHub Pages only after side-by-side QA and rollback preparation.
