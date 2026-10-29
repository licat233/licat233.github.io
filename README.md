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

The `astro/astro.config.mjs` i18n configuration controls localized paths (default Chinese locale without a prefix, English under `/en/`). The route keys are in `astro/src/data/navigation.json`, while Chinese/English navigation labels and UI copy are maintained in `astro/src/i18n/zh.json` and `astro/src/i18n/en.json`. All page types share locale-parameterized Astro routes under `astro/src/pages/[...locale]/`.

Existing project paths, historic compatibility pages, and stable article URLs are intentionally preserved.

## Repository structure

- `astro/`: active Astro production application, language routing, shared components, build and tests.
- `astro/src/content/blog/`: blog Markdown; `astro/src/content/projects/` and `astro/src/content/skills/`: structured YAML entries, loaded and validated through Astro Content Collections.
- `prompts/content/` and `en/prompts/content/`: source translations; `astro/src/data/prompts.json`: catalogue records.
- `assets/` and `skills/`: shared assets and published skills.
- `public-sites/`: independent project microsites and preserved demos/previews (`eao/`, `toolscout/`, `demo/`, etc.). Astro copies them to their **original public URLs**, so `public-sites/eao/` publishes as `/eao/`, not `/public-sites/eao/`.

Retired Jekyll page templates, duplicate HTML entry pages, and obsolete Jekyll CI are no longer on `main`. The recovery branch retains them.

## Source architecture

- `astro/src/layouts/BaseLayout.astro`: shared page shell and metadata.
- `astro/src/components/SiteHeader.astro`: shared localized navigation and Liquid Glass header.
- `astro/src/lib/catalog.ts`: projects and Skills from Astro's typed content collections, with local Skill discovery preserved.
- `astro/src/i18n/{zh,en}.json`: per-language interface dictionaries for the shared Astro pages; adding a language must not duplicate page templates.
- `astro/src/content.config.ts`: schemas and glob loaders for blog, projects and Skills.
- `astro/src/pages/blog/[slug].astro` and `astro/src/pages/en/blog/[slug].astro`: generated bilingual blog posts.
- `astro/src/layouts/BlogIndex.astro`: generated Blog lists.
- `astro/src/data/prompts.json`: shared prompt metadata; `astro/src/pages/**/prompts/[id].astro` generates bilingual prompt detail pages.
- `astro/scripts/prepare-public.mjs`: build-time compatibility copying for certain older standalone pages and static assets. Do not edit `astro/dist/` directly.

## Publish Markdown blog posts

See [PUBLISHING.md](PUBLISHING.md) for the Markdown template, bilingual naming rules and publishing steps.

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

Historical Jekyll source is retained exclusively on [the recovery branch](https://github.com/licat233/licat233.github.io/tree/backup/jekyll-production-20261027) at commit `f7d58cee5c2eb953696870f6931c441ec8f9ad74`. Do not modify or deploy this branch during ordinary updates.
