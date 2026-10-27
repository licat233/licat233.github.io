# Jekyll production backup and rollback

## Verified backup

The production **Jekyll source tree** was saved before the Astro release.

- Backup branch: `backup/jekyll-production-20261027`
- Exact Git commit SHA: `f7d58cee5c2eb953696870f6931c441ec8f9ad74`
- Browser: https://github.com/licat233/licat233.github.io/tree/backup/jekyll-production-20261027
- Source ZIP: https://github.com/licat233/licat233.github.io/archive/refs/heads/backup/jekyll-production-20261027.zip
- Verified: backup ref SHA equals the then-current `main` ref SHA; the branch was created from the SHA, not reconstructed manually.

**Coverage:** all repository-tracked Jekyll layouts, includes, blog Markdown, scripts, CSS, pictures, public project pages and GitHub Actions config at that commit. Git does not capture files outside the repository, GitHub Pages settings, workflow secrets, or an independent snapshot of the rendered live HTML.

**Retention rule:** do not delete, rewrite, rebase, rename, or force-push this backup branch. Astro CI checks that the backup still points to the fixed commit on every migration push.

## Before Astro production cutover

1. Recheck the backup branch and SHA above against `main`'s old production baseline. Download the ZIP to independent storage as a second copy if desired.
2. Document GitHub Settings > Pages > Build and deployment > Source; record whether Pages is deploying from a branch or GitHub Actions. Source mode must be restored in a rollback.
3. Record the Astro release SHA and preserve the previous Jekyll working version. Verify full route/asset/SEO parity and real desktop/mobile visual/animation behavior.
4. Cut over only with an approved, tested Pages deployment. Do not create the AI Toolkit navigation during framework migration.

## Restoring the Jekyll source *without rewriting Git history*

Execute on a trusted local clone after determining the active Pages deployment. Confirm branch protections, pull requests, and uncommitted working changes first.

```sh
git fetch origin
git switch main
git pull --ff-only origin main
git restore --source=origin/backup/jekyll-production-20261027 --staged --worktree :/
git diff --cached --stat
git commit -m "revert(site): restore verified Jekyll production snapshot"
git push origin main
```

This commits a restoration rather than force-pushing history. If `main` requires PR review, push the restore commit on a dedicated branch and merge through the protected review process. If the Pages source was switched to Actions, also restore the previous Pages deployment setting; restoring files alone may not restart the original Jekyll publishing workflow. Re-run GitHub Pages and link/asset tests on the restored site.

**Important:** the backup represents the site at the snapshot commit. Changes intentionally made after that point must be reapplied separately if rollback should preserve them. Do not silently overwrite such changes.
