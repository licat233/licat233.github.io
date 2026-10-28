# Licat — Personal Website

Website: https://licat233.github.io/

**Production stack:** Astro 7 (static output), GitHub Actions, and GitHub Pages. The GitHub account/URL suffix `233` is not part of the public name **Licat**. Jekyll is retained only in historical source/rollback materials; it no longer builds the live site.

## Navigation and language routes

| Section | Chinese | English | Navigation |
| --- | --- | --- | --- |
| Home | `/` | `/en/` | Top level |
| Projects | `/projects/` | `/en/projects/` | Top level |
| AI | `/ai/` | `/en/ai/` | Top level |
| Skills | `/skills/` | `/en/skills/` | Under AI |
| Prompts | `/prompts/` | `/en/prompts/` | Under AI |
| Blog | `/blog/` | `/en/blog/` | Top level |

The `astro/astro.config.mjs` i18n configuration controls localized paths (default Chinese locale without a prefix, English under `/en/`). The top navigation and AI child links are defined in `astro/src/data/navigation.json` and `astro/src/lib/site.ts`.

Existing project paths, historic compatibility pages, and stable article URLs are intentionally preserved.

## Source architecture

- `astro/src/layouts/BaseLayout.astro`: shared page shell and metadata.
- `astro/src/components/SiteHeader.astro`: bilingual navigation and Liquid Glass header.
- `astro/src/lib/catalog.ts`: shared Projects/Skills data from the original repository metadata.
- `astro/src/content.config.ts`: Astro Content Collection loading `_posts/*.md`.
- `astro/src/pages/blog/[slug].astro` and `astro/src/pages/en/blog/[slug].astro`: generated bilingual blog posts.
- `astro/src/layouts/BlogIndex.astro`: generated Blog lists.
- `astro/src/data/prompts.json`: 16 prompt entries; `astro/src/pages/**/prompts/[id].astro` generates the 32 bilingual prompt detail pages.
- `astro/scripts/prepare-public.mjs`: build-time compatibility copying for certain older standalone pages and static assets. Do not edit `astro/dist/` directly.

## Publish Markdown blog posts

Create a file such as `_posts/2026-10-28-my-first-note.md` with Astro-compatible frontmatter:

```yaml
---
title: "My first note"
date: 2026-10-28
lang: zh
description: "A short summary."
---
```

For an English translation, create `_posts/2026-10-28-my-first-note-en.md` with `lang: en`. Add `translation_url` to **each** article only after both language versions exist. The generated routes are `/blog/my-first-note/` and `/en/blog/my-first-note/`. Historic Jekyll `layout` keys are unnecessary, and `permalink` is not used to determine these routes.

See the live publishing guides:

- [中文：如何用 Astro + GitHub Pages 发布 Markdown 博客](https://licat233.github.io/blog/publish-markdown-notes/)
- [English: Publishing Markdown Posts with Astro and GitHub Pages](https://licat233.github.io/en/blog/publish-markdown-notes/)

## Develop and verify

Node.js 24 is used in GitHub Actions. From the repository root:

```bash
cd astro
npm ci
npm run build
npm run check
node scripts/check-legacy-routes.mjs
```

For a local preview: `npm run dev`. For browser regression tests: `npm run test:e2e` (install the Playwright Chromium browser first if needed).

Make changes on a branch, open a Pull Request, and merge to `main` when checks pass. `.github/workflows/deploy-astro-pages.yml` builds, verifies, and deploys `astro/dist/` to GitHub Pages when the repository variable `ASTRO_PAGES_ACTIVE` is enabled. The `astro/README.md` file describes source ownership and release checks in more detail.

A pre-Astro Jekyll backup remains at `backup/jekyll-production-20261027`; consult `JEKYLL_BACKUP_AND_ROLLBACK.md` for recovery context. Do not change or deploy that branch as part of ordinary content updates.
