# Licat website — Astro production guide

The live website at https://licat233.github.io/ is built from this **Astro** workspace. Jekyll was the previous implementation and is no longer the production renderer.

- Astro: `7.4.2` (pinned in `package.json`)
- Node.js: 24 in the GitHub Actions workflows
- Output: static, with trailing slashes
- Languages: `zh` (unprefixed default) and `en` (`/en/`) via Astro's official i18n router
- Deployment: GitHub Actions → GitHub Pages

## Local commands

From the repository root:

```bash
cd astro
npm ci
npm run build
npm run check
node scripts/check-legacy-routes.mjs
```

Use `npm run dev` for interactive work. `npm run test:e2e` runs Playwright browser regression tests; install its Chromium browser as needed. `npm run check` inspects the generated `dist/` and therefore runs **after** the build.

Do not hand-edit the generated `dist/` directory or introduce another CMS or deployment stack for routine content changes.

## Source of truth

| Content or feature | Source |
| --- | --- |
| Blog Markdown | `src/content/blog/*.md` (glob loader) |
| Content Collection / validation | `src/content.config.ts` |
| Blog listing | `src/layouts/BlogIndex.astro` |
| Chinese and English blog detail routes | `src/pages/blog/[slug].astro`, `src/pages/en/blog/[slug].astro` |
| Blog article layout / SEO / alternates | `src/layouts/BlogArticle.astro`, `src/layouts/BaseLayout.astro` |
| Navigation route keys and locale URLs | `src/data/navigation.json`, `src/lib/site.ts` and `src/lib/locale-routes.ts` |
| UI language dictionaries | `src/i18n/zh.json`, `src/i18n/en.json` via `src/lib/translation.ts` |
| Shared homepage markup | `src/components/home/Home.astro` with `src/i18n/*.json` home translations |
| Shared header | `src/components/SiteHeader.astro` |
| Projects and Skills | `src/content/projects/*.yaml`, `src/content/skills/*.yaml` (glob loaders and Zod schemas) |
| Prompts catalogue | `src/data/prompts.json` |
| Localized prompt detail route | `src/pages/[...locale]/prompts/[id].astro` (one shared template) |
| Published standalone microsites and demos | `../public-sites/` → `scripts/prepare-public.mjs` → original URLs (e.g. `/eao/`, `/demo/`) |
| Shared public files and Skill sources | `../assets/`, `../prompts/`, `../en/prompts/content/`, `../skills/` |

All localized pages use the eight `src/pages/[...locale]/` page-type routes and the same layouts/components, not separate `src/pages/en/` trees. The home component reads `dictionary(lang).home`, and homepage project links resolve from the `projects` content collection. Do not restore per-language page wrappers or copies.

Adding a locale means configuring it in `astro.config.mjs`, providing a complete dictionary `src/i18n/<locale>.json` and translating applicable content. No per-language page files are needed. `src/lib/locale-routes.ts` reads official Astro configuration and rejects missing dictionaries. The default Chinese homepage is `/`; there is no `/zh/` alias.

The Prompt Library has 17 entries with independent Chinese and English Markdown files and 34 static detail pages. Older query-based `?p=` prompt shares use a browser-side compatibility redirect to their path-based URLs; GitHub Pages does not provide an HTTP 301 specifically for those query values.

## Publish a blog article

1. Add a Markdown file under `src/content/blog/`. Example: `2026-10-28-my-first-note.md` for `/blog/my-first-note/`.
2. Include `title`, `date`, `lang: zh` (or `en`), and preferably `description`. Do not add the old Jekyll-only `layout: post` field.
3. For an English article use a `-en.md` filename (such as `2026-10-28-my-first-note-en.md`) and `lang: en`; the route becomes `/en/blog/my-first-note/`.
4. Add `translation_url` only when the actual counterpart article exists. Untranslated posts should not claim a translated `hreflang` page.
5. Run the build and checks; use a Pull Request, merge into `main` after CI passes, and verify the published URL and Blog index.

The build uses `glob({pattern:'*.md',base:'./src/content/blog'})` in `src/content.config.ts`. Both blog detail routes call `getCollection('blog')` and `getStaticPaths()`. The `blogSlug()` helper removes the filename's date prefix and trailing `-en`; it does **not** use a legacy `permalink` frontmatter value to determine routes. Keep filenames stable after publishing.

For a practical publishing tutorial, see the repository-root [PUBLISHING.md](../PUBLISHING.md).

## Release and quality checks

- `.github/workflows/astro-ui-regression.yml` runs PR build and browser checks.
- `.github/workflows/deploy-astro-pages.yml` runs on `main`, checks the Jekyll recovery branch, builds and validates Astro output, runs browser tests, and publishes `dist/` to GitHub Pages when `ASTRO_PAGES_ACTIVE=true`.
- `scripts/check-output.mjs` checks core pages, Blog and Prompt URLs, localized metadata, navigation and static assets.
- `scripts/check-legacy-routes.mjs` prevents loss of historical standalone HTML routes.

New projects and Skills belong in individual `.yaml` files under their matching `src/content/` folders. Each entry has a unique file name, `order` preserves directory display order, and `src/content.config.ts` validates fields during the build. Existing `skills/<slug>/SKILL.md` auto-discovery remains in place. Public URLs are not derived from content file locations.

The Jekyll recovery branch is `backup/jekyll-production-20261027` (commit `f7d58cee5c2eb953696870f6931c441ec8f9ad74`) and must remain unchanged. Retired Jekyll templates and CI were removed from `main`. Astro is already the production renderer, **not** a pending migration.

Do not link to `/public-sites/` in the deployed website; it is a repository source folder only. Retain existing Liquid Glass components, current i18n routes, theme behavior, blog permalinks and standalone app URLs when editing content.
