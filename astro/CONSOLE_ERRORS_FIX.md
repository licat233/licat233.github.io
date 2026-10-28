# SVG and Skills console regression (Astro)

The browser console previously showed a malformed SVG path in the global GitHub navigation icon and a 403 GET from `portfolio-skills.js` to GitHub REST.

## Changes
- Replaced only the invalid GitHub icon `path[d]` with a valid standard 24×24 Github mark; retained the existing `.github-mark` styling and accessible anchor.
- Removed the obsolete deferred `portfolio-skills.js` tag from both Astro homepages. The old root Jekyll script remains in the repository for historical compatibility, but is not loaded in Astro.
- Extended `getSkills()` to discover `skills/<slug>/SKILL.md` **at build time**, with curated `_data/skills.yml` metadata taking precedence. New skills appear on the next GitHub Pages build, without visiting browsers calling unauthenticated GitHub REST or dynamically shifting card layout.
- Local SKILL.md frontmatter must contain a matching `name` and nonempty `description`; malformed newly discovered files fail the build rather than silently shipping an empty card. New skills use safe fallback copy for both languages until localized metadata is added to the YAML catalog.
- Build-output checks ensure that each published skill has a homepage card and no Astro homepage references the obsolete script. Chromium regression tests reject GitHub REST requests and malformed SVG console errors.

The browser-extension `content.js` Core Web Vitals log (`CLS 0.00 (good)`) is informational, not a site error.

This is a targeted remediation; the site's original layout, CSS, animations, and existing bilingual Skills content remain unchanged.

## Regression verification
The CI smoke checks count actual `<article class="…skill-card…">` nodes rather than nested `skill-card-content` elements, assert that every local Skill is built into both homepages, and run Chromium console/request checks in both supported viewport sizes.
