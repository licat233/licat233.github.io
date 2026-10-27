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

**Recovery:** a verified Jekyll source backup exists at `backup/jekyll-production-20261027` (commit `f7d58cee5c2eb953696870f6931c441ec8f9ad74`). Read `JEKYLL_BACKUP_AND_ROLLBACK.md` before any Pages cutover.

## Migration strategy

- `src/components/SiteHeader.astro` and `src/layouts/BaseLayout.astro`: real Astro navigation and shared content layout.
- `src/content.config.ts` reads original repository `_posts/*.md` with a Content Collection; original Markdown stays in place, including the 2026 SEO/GEO articles.
- `src/lib/catalog.ts` reads the original `_data/projects.yml` and `_data/skills.yml` (no copy of metadata).
- Home and Prompt Library use native, editable `.astro` content components and `src/layouts/PortfolioShell.astro`, preserving existing markup, original SVGs, GSAP, copy/search and deep links. The prior Jekyll HTML parsing layer is removed.
- `scripts/prepare-public.mjs` copies static assets and standalone projects, strips Jekyll YAML headers and replaces project breadcrumb includes. It is a **temporary compatibility bridge**, not the final maintainable project architecture.
- Both Chinese root and English `/en/` routes are retained. `/zh/` still redirects. Existing `?p=` prompt share links and blog article URLs remain valid.
- This branch does NOT deploy to the public GitHub Pages URL. A separate Actions workflow builds and checks it and uploads its `dist/` as a CI artifact. Do not enable an Astro Pages deployment before final approval.

## Remaining before cutover

1. The home and prompt body sources are now native Astro components. Further reduce duplicate bilingual markup only when it does not jeopardize visual parity.
2. Move each standalone project microsite to Astro layouts or isolate it as a deliberately independent static app with explicit ownership.
3. Verify all existing URLs, browser interactions, image assets, SEO metadata, mobile layouts and visual parity against the live Jekyll site.
4. Review generated assets and lockfile; cut over GitHub Pages only after side-by-side QA and rollback preparation.

## Browser regression

`npm run test:e2e` uses pinned Playwright Chromium on desktop and mobile emulation. CI runs 20 end-to-end browser cases covering actual clicks, canonical routes, prompt search/detail/deep-links, persistent theme state, the Projects/Skills hierarchy, and English translations. Use `npx playwright install chromium` before running locally. The migration branch never deploys Pages. Browser checks cover functional interactions, but full visual pixel parity still needs a reviewed comparison before cutover.

CI uses `npm ci` with a committed lockfile, not `npm install` or on-the-fly dependency changes.

## Component and data ownership (no copy/paste HTML)
- `src/layouts/BaseLayout.astro` is the **only full HTML document shell**. `PortfolioShell.astro` provides homepage/prompt-specific settings but does not duplicate `<html>`, `<head>` or the global header.
- `src/components/home/FeaturedProjects.astro` reads the same `_data/projects.yml` used by the Projects directory; eight homepage cards use `featured_*` fields (rank, localized description/url, tags/meta). Decorative SVGs live separately in `src/data/project-icons.ts`.
- `src/components/home/HomeSkills.astro` reads the same `_data/skills.yml` as the Skills category, including localized featured usage lists.
- `src/components/prompts/PromptLibrary.astro` renders the same HTML structure in both languages, deriving cards and serialized browser metadata from `src/data/prompts.json`.
- The Astro-specific `src/client/prompt-library.js` reads the same embedded `src/data/prompts.json` metadata; the old root `prompts/prompt-library.js` remains for the unmodified production Jekyll site until cutover.
- Independent microsites still use the intentional build-time static compatibility copier.

### 2026-10-27 prompt catalogue consolidation
Astro now has **one** `src/data/prompts.json` source for 15 prompt records and both UI languages. `PromptLibrary.astro` renders its initial cards and embeds that exact same metadata into the page. The `src/client/prompt-library.js` controller reads the embedded payload; it no longer hardcodes 15 records, English translations or file-translation IDs. `scripts/prepare-public.mjs` overlays only the Astro-owned browser controller onto the copied legacy `/prompts/prompt-library.js`; it leaves the Jekyll production version alone. `src/data/prompt-previews.ts` was removed to prevent drift. Original prompt Markdown, URL slugs, copy delimiters and search behavior remain unchanged.

## Pre-existing routes preserved

The Astro compatibility build retains the published `/demo/` pages, archived project/demo resources and `previews/` assets. The `scripts/check-legacy-routes.mjs` audit scans the original repository HTML files and requires the same public HTML paths in the Astro output; a missing page now fails CI. This validation complements the Playwright 20 desktop/mobile browser checks and protects less-visited routes.
