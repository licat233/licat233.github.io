# Acceptance checklist and EAO case study

## Browser QA evidence matrix

Run these before asserting UI completion. Mark "not tested" when an environment
is unavailable rather than treating a checklist as proof.

| Dimension | Inspect / acceptance |
| --- | --- |
| 1440 / 1024 / 768 / 390 / 360 px | no horizontal scroll, readable nav, card grids preserve agreed breakpoints |
| Light and dark | label/body contrast across the *real composite* surface, image pixels unfiltered |
| Hover / pressed / selected | sensible elevations and roles, no false "current" indicators |
| Keyboard | visible focus, correct DOM order, links/buttons usable without mouse |
| Language routes | current = actual page, both options visible, round-trip EN ↔ 中文 |
| Section navigation | targets valid, sticky nav offset, scrolling and active indicator stable |
| FAQ / drawers / modals | open and close, no overlay trapping, no layout jump |
| Animation | reduced-motion obeyed, scroll entry never leaves content invisible |
| Image loading | wait for all lazy images; check `naturalWidth`, cropping and alt text |
| Browser | Chrome + Safari when accessible; state gaps honestly |
| Compatibility | `@supports` opaque fallback, forced-colors, supported preference queries |
| Performance | filter count/coverage, long-card scrolling, mobile GPU and stable nav |
| Release | clean diff, sync with remote, no force push, live CSS URL & computed style |

Use screenshots with **the same viewport and same loaded image state** for
baseline and after. Screenshot tools can accidentally capture midway through
View Transitions, before scroll/lazy loading finishes, or at a preserved scroll
position. Fix capture timing rather than blaming the page prematurely.

## Qualitative scoring (0–2 per axis)

Score separately and report failures, not a fabricated numerical guarantee.

- Environmental light: colour behind clear glass visibly informs its surface.
- Material authenticity: believable rim, consistent highlights, tasteful shadow.
- Visual hierarchy: brand, controls and dense information remain distinct.
- Usability: content contrast and focus are legible in all supported modes.
- Fidelity: approved layout/copy/media are retained.
- Responsive/performance: no occlusion/overflow/heavy permanent filters.
- Originality: not a generic neon SaaS template, not a glass shader demo.

A clear blocker on usability, fidelity or layout means **do not release**, regardless
of overall aesthetics. For remaining style choices, seek human review rather than
an endless autonomous "polish" loop.

## EAO Homepage — documented lessons (October 2026)

Context: bilingual static Enterprise AI Office homepage
(https://licat233.github.io/eao/ and /eao/zh/),
Open Props / rem-based CSS and existing animations, five department cards,
illustrations and a product UI screenshot. Review the current repository for
facts; these historical details are examples, not instructions to reset HEAD.

**What failed**:
1. An editorial "enterprise redesign" replaced the liked visual hierarchy.
   It was rejected and rolled back; a stale CSS cache then made recovery appear
   incomplete. Lesson: *scope preservation and asset-version verification matter*.
2. Several glass iterations changed surface alpha/shadow but retained uniform
   near-white/green environmental light. Result: panels looked like ordinary
   translucent paper. Lesson: *background colour / illumination is half the glass*.
3. The model became anchored on teal/green as full-page background and repeatedly
   "recommended" speculative palettes from text. The user could not evaluate
   colours from prose/HEX codes. Lesson: *swatch visuals + realistic approval first*.
4. Text-heavy cards received overly prominent glass effects. Lesson: *Apple-style
   visual language works best in navigation/controls; quieter material for content*.
5. Dept Grid and GSAP had previously interfered with transforms. Lesson: *do not
   animate transform on grid card children if the layout/reveal system relies on it*.
6. EAO's language HTML had the correct current-page token but CSS painted the
   non-current link like the selected one, and mobile CSS hid current text.
   Lesson: *test DOM semantics AND computed colour/visibility and round-trip navigation*.
7. Lazy-loading screenshots appeared to miss illustrations; transition snapshots
   sometimes looked black. Lesson: *scroll-and-wait screenshot capture*.

**What succeeded**:
- Logo colour was measured as #00B8AE (the supplied file), then used as an
  *accent* on UI selections and action emphasis, not as mandatory green wash.
- Approved Quartz Glass palette used porcelain white #F7F8FB, mist white
  #EEF3FA, ice blue #DCE8F6, silver-blue #C9D8EA, champagne #F7E7D8,
  graphite #182334 and EAO teal #00B8AE as a *case-specific sample*, not
  universal parameters.
- Coloured fields sit **behind** mostly neutral glass; strong edge light,
  delicate shadows, responsive layout, preserved business illustrations and
  readable product screenshot.
- Existing animations and CSS architecture remained; no WebGL dependency.
- CSS changes and bilingual locale UI were verified in real local + live
  browsers, including mobile, theme, FAQ and cache-busted asset URLs.
- Final published Quartz+logo revision in `licat233/licat233.github.io`
  had a verified fast-forward and GitHub Pages deployment in the historical
  task. **Never assume that historical deployment represents current site state.**

## External authoritative reading

- Apple Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Radix Colors scale: https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- WCAG 2.2 SC 1.4.3: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2 SC 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- LiquidGlass-UI code/Skill: https://github.com/hwyuanzi/LiquidGlass-UI

No upstream CSS or library is vendored by this reference.
