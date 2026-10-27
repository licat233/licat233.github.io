# Controlled Astro Pages release

**Not approved or deployed by creating this file.** The live site remains Jekyll until the release gate is explicitly completed.

## Recovery point
- Branch: `backup/jekyll-production-20261027`
- SHA: `f7d58cee5c2eb953696870f6931c441ec8f9ad74`
- See `JEKYLL_BACKUP_AND_ROLLBACK.md` for the exact non-force-push recovery steps.
- All Astro CI and release builds verify this branch SHA.

## Pre-release review
- [x] 39 legacy HTML routes and demo/preview resources are preserved.
- [x] Static build, prompt catalogue validation and bilingual interactions covered by CI.
- [x] Live Jekyll versus Astro DOM layout/screenshots compared in desktop and mobile Chromium.
- [ ] Review paired screenshots for major components, image crops and precise typography.
- [ ] Verify GSAP entrance/scroll animations under ordinary and reduced motion.
- [ ] Check browser console, responsive overflow, SEO links, keyboard accessibility.
- [ ] Record the current GitHub Pages Settings -> Pages -> Source publishing mode.

## Opt-in deployment
1. Obtain final release approval and merge Draft PR #12 to `main`.
2. Record the `main` SHA and existing GitHub Pages Source settings before changing them.
3. In Settings -> Pages -> Source choose GitHub Actions.
4. In Settings -> Secrets and variables -> Actions -> Variables, set repository variable `ASTRO_PAGES_ACTIVE` to the exact string `true`.
5. On Actions -> Astro Pages — explicit-release gate, choose Run workflow from `main`. The official configure-pages, upload-pages-artifact and deploy-pages actions publish the verified Astro build.
6. Future main pushes are auto-deployed only while `ASTRO_PAGES_ACTIVE` remains `true`.
7. Check the live home, English home, Blog posts, Prompts, project pages, assets and mobile layouts after deployment.

## Abort or roll back
Before cutover, leave the opt-in variable unset, do not merge the Draft PR, and do not change GitHub Pages Settings.
After release, set `ASTRO_PAGES_ACTIVE` to `false` immediately to stop further Astro deployments; restore the pinned Jekyll source through a new commit (not a force-push), switch GitHub Pages Source back to the recorded Jekyll publishing configuration, then verify the redeployed old pages.

**Important:** the current GitHub connector cannot inspect or alter Settings -> Pages. Never claim the Pages publishing mode was verified until it has been checked in GitHub Settings.
