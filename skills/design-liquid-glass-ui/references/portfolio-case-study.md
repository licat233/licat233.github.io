# Case study: from source Demo to approved glass portfolio (October 2026)

**This is an implementation history, not a rule that every web site must copy
this design.** Inspect current source and user approval before making changes.

- Case: bilingual portfolio, `https://licat233.github.io/`
  and isolated `https://licat233.github.io/demo/`.
- Reference implementation in repo: `assets/portfolio-liquid-glass.css`,
  `assets/portfolio.css`, `index.html` / `zh/index.html` / `en/index.html`.
- Exact style tested on Demo: `demo/portfolio-liquid-glass.css`.
- Source inspiration: an original Liquid Glass source Demo provided by the
  user. The site is a CSS/SVG browser approximation, **not Apple's native
  rendering engine**. Check licenses before using any outside source.
- Approved production promotion: Git commit
  [0f7dcb0](https://github.com/licat233/licat233.github.io/commit/0f7dcb039341d530ba8e599d948de07a37590348).
- The preceding milestone positioning repair:
  [27e00e8](https://github.com/licat233/licat233.github.io/commit/27e00e81c19e2cff0842fd5f124c4b84e8c1f88c).
- Original portfolio backup:
  `backup/portfolio-before-approved-glass-20261009`.
  These are *historical* IDs, **never assume they remain HEAD**.

## Iteration evidence: why visual fidelity improved

| Phase | Observed failure | Actual correction | Generalizable lesson |
| --- | --- | --- | --- |
| Initial port | Existing white site looked like white plastic/paper | Added meaningful backdrop; differentiated rim/frost instead of repainting the site | Material visibility depends on what lies behind it |
| CSS ambient gradients | Not remotely as refractive as original Demo | Stopped treating gradient colour alone as optical reproduction | Gradients do not substitute for layer structure/refraction |
| Optical pass | Better but foggy and washed out | Brought in distinct filter + rim layers; reused scenic photograph | Inspect real Demo's mechanism, not just CSS aesthetic |
| Too much frost | 22% white film, 4px blur obscured image detail | Reduced tint/blur toward 6.5%/1.3px | White translucent alpha compounds with gradient, shine and filter |
| Too clear | Image showed through, words blended with scenery | Settled at ~12% tint/2.35px blur light, ~11%/2.1px dark | Adjust transparency and readability together |
| Text colour polluted | Foreground lost definition on bright/dark scenery | Narrow white/light or dark-mode charcoal text shadow plus real foreground contrast | Shadow is assistance, not contrast compliance |
| Multiple sections | Some cards acquired thick / duplicate glass outline; icon/number overlap | One real glass containing block, optical layers checked, restore absolute icon positioning | Layout CSS, optical CSS and positioned children interact |
| Single fixed backdrop | Moving background hindered perception of stationary scene | One viewport-fixed `body::before` with existing WebP, `100svh` fallback | Background can be fixed without an image per section or scroll JS |
| Timeline double frame | Three lens layers appeared as an extra bordered card above content | Set `position:relative` on the actual `.phase-glass` | Always check actual optical child bounds, not just CSS declaration |
| Production promotion | Risk of Demo `noindex` / `/demo/` routes leaking to main | Promote only approved layers/markup, preserve canonical SEO, URLs, theme storage | Demo ≠ production, compare semantic content and route metadata |

## Material values and control hierarchy

The approved case was **not one identical blur applied everywhere**:

- Scenery-backed project and milestone cards: moderate blur (~2.35px light,
  ~2.1px dark), neutral overlay (~.12/.11), thin rim and close shadow.
- Text-heavy areas: preserve legibility; use darker/local solid material when
  necessary. No broad opaque white coating.
- Selected navigation pill and small controls: may use stronger local blur,
  sharper directional highlights, smaller separate edge filtering.
- Long/repeated mobile cards: disable expensive SVG edge filtering and lower
  blur to ~1.8px, preserving layout and touch targets.
- Page environment: the already-existing `licat-hero.webp` (historically
  ~89 KB) reused as one fixed scene, with different dark/light scrims.
  This reduced need for new images; a cache or one network request per
  controlled browser test is not a promise for all devices.

**Do not treat these values as universal or claim native Apple parity.**
A very white or untextured background still cannot demonstrate comparable
depth. Text shadows cannot compensate for failing composited contrast.

## Minimum Agent handoff: implementation sequence

1. **Inspect facts, save rollback:** remote HEAD, dirty worktree, reference
   screenshots and actual Demo source, current theme/language/animation rules.
   Work in an isolated worktree; do not discard others' edits.
2. **Establish environment:** reuse appropriately optimized existing imagery,
   design a stationary or patterned backdrop with controlled brightness. Do
   not make all section backgrounds opaque. Keep local legibility masks.
3. **Implement one surface first:** `position:relative` on the *actual bordered
   glass card*, 3 passive layers under semantic content, correct clip/radius;
   no nested borders.
4. **Tune material progressively:** remove white fog, then add back moderate
   frost, edge specular and narrow text shadows. Inspect dark mode *separately*.
   Preserve original text, images, card count, locale and interactions.
5. **Expand carefully:** nav, Hero resource links, milestones, principles,
   footer. Respect underlying layout-specific positioning. A Primary CTA may
   intentionally stay solid; equal treatment is not inherently good design.
6. **Check responsive + fallback:** small phones, reduce expensive repeated
   SVG filters, reduced motion/transparency, higher contrast and forced colours.
7. **Deploy in isolated preview:** keep production untouched while iterating.
   Save user-approved candidate; only then promote to original site.
8. **Verify real release:** update static CSS version query (not globally
   disabling caching), wait for Pages, confirm every public route loads the new
   CSS; use fresh browser to check computed style and actual layout. A Git
   commit or HTTP 200 to an old CSS file is not deployment acceptance.

## Browser acceptance: DOM geometry matters as much as screenshots

For each surface (particularly timeline milestones), run equivalent checks
in the target browser after content/fonts settle:

```js
const surface = document.querySelector(".phase-glass");
const bounds = surface.getBoundingClientRect();
const edge = parseFloat(getComputedStyle(surface).borderLeftWidth) || 0;
const layers = [...surface.children].filter(el =>
  el.matches(".glass-filter, .glass-tint, .glass-specular")
);
console.assert(getComputedStyle(surface).position === "relative");
console.assert(layers.length === 3);
console.assert(layers.every(el => {
  const r = el.getBoundingClientRect();
  return Math.abs(r.left - (bounds.left + edge)) < 1.5 &&
         Math.abs(r.top - (bounds.top + edge)) < 1.5 &&
         Math.abs(r.width - (bounds.width - edge * 2)) < 1.5 &&
         Math.abs(r.height - (bounds.height - edge * 2)) < 1.5;
}), "Optical layers should cover the single card padding box");
console.assert(!layers.some(el => getComputedStyle(el).pointerEvents !== "none"));
```

Adapt selectors and border measurements to the actual component. A border
inset of exactly 1px happened in this case; it is **not a general invariant**.

Also verify:
- Language route and SEO canonical/hreflang; no preview `noindex` promoted.
- Theme state persists, selected-language indicator matches current route.
- Background remains visibly fixed after scrolling at identical viewport;
  compare **isolated background pixels**, not the moving content image.
- 8 projects / 3 milestones / 3 principles in *this case* (not generic counts).
- Links, focus, hover, click targets, controls and reversible scroll animations.
- No horizontal overflow, JS errors, new large image requests or broken lazy
  images. Product images and page content must not get blurred themselves.
- Actual browser light/dark, desktop/phone; Safari and reduced-transparency
  support require device tests where available.

### What was actually tested and what was not

Historical local and published Chrome/browser automation compared the approved
Demo with the promoted portfolio in four combinations: desktop light Chinese,
desktop dark English, mobile-width light Chinese, mobile-width dark English.
Tests covered page geometry, fixed backdrop, matching material computed
styles, layer alignment, theme toggle, route metadata, errors and overflow.
The published pages loaded the versioned CSS and passed 4/4 checks.

This **does not establish** real iPhone Safari compatibility, WCAG compliance
against every image pixel, universal 60 FPS/GPU usage, or pixel-identical native
Apple effects. A future agent must test those separately before claiming them.

### Reusable recipe smoke test

The new `optical-implementation.md` example was extracted directly from the
Markdown (HTML and three CSS blocks) and rendered in a local Chrome browser
fixture, without adding a framework or changing the production site. At
1440px light/dark and 390px light/dark it passed 4/4 checks for:
exactly three passive layers aligned inside the bordered card, correct
theme-specific tint/blur, one image resource, no horizontal overflow,
no browser JS errors, and pixel-stable isolated background across scroll.
This is **render/geometry evidence**, not an automated human taste test,
performance benchmark, Safari certification or WCAG audit.

## Cross-references

- Read `references/optical-implementation.md` for working portable code.
- Read `references/css-patterns.md` for token/editing conventions.
- Read `references/material-and-color.md` for light, colour roles and contrast.
- Read `references/qa-and-case-study.md` for broader EAO lessons/QA gates.
