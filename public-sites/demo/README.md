# Licat Glass UI Live Demo

This directory hosts the independent Liquid Glass study for browser review.

- Live: https://licat233.github.io/demo/ (Chinese by default)
- Chinese: https://licat233.github.io/demo/zh/
- English: https://licat233.github.io/demo/en/
- Production homepage /, /zh/, /en/ remains unchanged.
- Search indexing disabled with noindex,follow.
- Base styling: demo/portfolio.css (isolated snapshot).
- Glass styling: demo/portfolio-liquid-glass.css (isolated).
- The approved moderate-frost and theme-aware text contrast now extend to
  Hero resource links, Journey milestones, Principles cards and footer.
- The original opaque primary Hero CTA remains intentionally opaque.
- Mobile disables costly SVG refraction across repeated cards; clear solid
  materials are used for increased contrast / forced colors.
- Restore this pre-rollout Demo independently from branch
  backup/demo-before-full-glass-20261009 (commit b439441).
- Entrance and reversible motion: demo/entrances.css + demo/portfolio-motion.js
  (preserves the previous /demo motion behavior).
- Theme preference uses licat-demo-theme, separate from production.
- Open Props and image/logo assets are loaded from existing shared /assets paths.
- No additional images, API services or external dependencies are required.

The former Motion Study version is preserved in the backup branch
backup/portfolio-demo-motion-before-glass-20261009 at commit
376c18189f3b9475b0d407b1308ad5d0dcd5e287.

The production homepage is deliberately not synchronized from /demo.
Changes are reviewed here first, then promoted only on approval.

## Fixed shared landscape (2026-10-09)

The Hero image (`/assets/licat-hero.webp`) is now the single fixed, viewport-sized
background on all Demo sections. It is rendered by `body::before` with
`position: fixed` and `100svh` on mobile, rather than CSS
`background-attachment: fixed` (unreliable on iOS Safari).
The former cropped Hero image is visually hidden, but remains in markup
as an inert GSAP animation target. No additional image, dependency or script
was introduced. Background pixel-position has been tested as stable during
scroll on both desktop and mobile, in light and dark modes.

Use branch `backup/demo-before-fixed-scenery-20261009` to restore the previous
Demo. As always, the production homepage and EAO are untouched.
