---
name: reversible-scroll-motion
description: Build and repair production-grade, GSAP-powered, reversible scroll animations for websites. Use for cinematic entrances, eight-direction card flights, SplitText headings, timeline wipes, 3D panels, footer reveals, ScrollTrigger scrub timing, idle/setTimeout visibility fallback, mobile/reduced-motion support, and browser QA. Also use when scroll animations hide content, fail at page bottom, inflate document height, or stop working on reverse scroll.
---

# Reversible Scroll Motion — production workflow

Create expressive, readable, accessible page motion without scroll hijacking. This Skill was distilled from the launched bilingual Licat homepage. Do **not** copy its colors, typography, text, layout, or site identity; transfer its **technique** to the user's existing page.

> **Invariant:** Scrolling can control *how* content moves; it must never be the only thing controlling *whether content can be read*. An element in the viewport must become fully readable even if scrolling stops.

## 0. Before touching code

1. Inspect the **actual** repository, entry pages, CSS/JS, existing animation dependencies and Git state. Do not trust earlier chat SHA values.
2. Confirm which pages are approved for edits. For unapproved production changes, work in an isolated demo or worktree first. Preserve other concurrent changes; never force-push or reset legitimate commits.
3. Record a baseline with real browser screenshots at desktop, mobile, light/dark and `prefers-reduced-motion: reduce`. Identify scroll containers, sticky headers, page-end behavior and links.
4. Decide which sections merit expressive choreography. Do not animate every word or control: keep navigation, forms, accessibility controls and reading surfaces usable.
5. Prefer the site's existing GSAP; avoid introducing frameworks, services or large 3D engines for simple entrances.

Read [the motion grammar](references/MOTION-GRAMMAR.md) before designing. For runnable implementation, see [the reusable demo](assets/example.html) and [controller](assets/reversible-motion.js).

## 1. Plan scenes according to their visible geometry

For each scene, record: **stable trigger, target(s), viewport entry, viewport finish, idle fallback, reverse exit**. Suggested defaults, not universal:

| Scene | Motion grammar | Start | Finish while visible |
| --- | --- | --- | --- |
| Hero | One-time load intro, optional SVG morph | Initial load | Before interaction |
| Section heading | Masked SplitText chars, modest 3D rotation, note wipe | Top near 85–90% viewport height | Top near 40–50% |
| Grid cards | Different offscreen directions, rotate/scale, stagger per row | Top near 88–90% | Top near 37–45% |
| Timeline | Alternating clip masks, node rotation | Top near 85–90% | Top near 42–50% |
| Principles | Perspective unfold | Top near 85–90% | Top near 40–50% |
| Footer | Short fade/rise | As soon as actually visible | **Never require screen midpoint** |

Measure real viewport, section heights, sticky headers and document max scroll; shorten passages when necessary. The objective is a legible experience, not arbitrary long animation distances.

## 2. Implement reversible scenes without layout shifts

- Use official GSAP: `gsap.timeline()`, `ScrollTrigger`, `gsap.matchMedia()`, `invalidateOnRefresh: true` and `scrub: true`; refresh after font/image/layout changes.
- With `scrub: true`, tween `duration` sets relative timeline proportions, **not wall-clock seconds**. `end - start` determines the scroll travel that controls pacing.
- Animate transforms and opacity; keep CSS Grid/Flex cell geometry intact. No FLIP rearrangement, fake cards, absolute stacking or forced resizing to simulate entrance.
- Trigger against a **stable parent/natural offset**, not the moved child's `getBoundingClientRect()`.
- For cards flying up from below, cap positive initial Y so the transformed card cannot extend beyond the document's natural bottom and temporarily inflate `scrollHeight`.
- Never add enormous footer padding, fake spacers, pins or scroll locking simply to supply missing animation distance. Shorten the effect or let the idle fallback finish.
- Compose approach → fine settling → optional ~15% held final frame; verify that the **settled frame itself** is within the user's view.
- SplitText: initialize all glyphs before staggering, keep wrappers until responsive context cleanup, and call `revert()` during cleanup instead of on forward completion.
- Prefer native plugins; if SplitText/MorphSVG are missing, use a simpler fallback. Content must remain readable if animation scripts fail.

## 3. Implement scroll + `setTimeout` visibility fallback

**Scroll-only hiding is not acceptable for core content.**

1. Normal scroll uses a reversible ScrollTrigger timeline, with no delayed scrub.
2. A **single debounced timer** (~480 ms since the last scroll) checks all **actually visible** but incomplete scenes. A footer can be visible near the lower edge without reaching screen center.
3. Animate their remaining progress to `1` (~600 ms). Do not animate offscreen content and do not create a separate timer for each item.
4. **Re-anchor** a timer-completed scene to its current scroll position and animation progress. On the next wheel/touch event it must continue smoothly without snapping back to stale ScrollTrigger progress.
5. Cancel active completion tweens when scrolling resumes. Reset a scene after reversing to hidden and leaving the viewport; prevent transparent ghosts.
6. Schedule an initial check for deep links/restored scroll without waiting for a wheel event. Clean up listeners, timers and SplitText wrappers on context teardown.
7. For `prefers-reduced-motion: reduce`, leave content statically visible and skip scene animations and fallback timer.

See [implementation details](references/IMPLEMENTATION.md) and [fully runnable controller](assets/reversible-motion.js).

## 4. Accessibility, performance and safety

- Missing CDN, blocked JS, reduced motion or unsupported GSAP must **fail open to visible content**, never permanently `opacity: 0`.
- Preserve semantic headings, reading order, tab navigation and focus outlines. Do not animate critical controls out of reach.
- Use `transform` and `opacity`; avoid heavyweight per-frame layout reads or animating `height`/`left`/`top`. Do not default to `once: true` when reversible playback was requested.
- No default scroll pin, wheel interception, programmatic scroll hijack, snap or 1-second scrub catch-up. Only use these when the user expressly wants them.
- Prevent horizontal overflow without clipping important text vertically.
- Preserve content, real links, SEO metadata, localization, theme and responsive behavior. Do not copy demo banners or `noindex` into production.

## 5. Test locally AND on the published page

Read [acceptance checklist](references/ACCEPTANCE.md) and [historical failures](references/FAILURE-MODES.md). Test:

- 1440×900 desktop, 1280×720 short desktop, 820×1180 tall viewport, 390×844 and 375×667 phones, dark/light and reduced motion.
- Stop scrolling with an element **partly visible at screen bottom**: it completes after the idle delay. Repeat for Footer.
- Scroll down → stop → automatically complete → scroll back up → reverse **from the current visual state** → scroll down again. No jumping.
- Scroll rapidly to the bottom and return. All cards, timeline entries, methods and footer text remain readable at the end of the page.
- Check **physical geometry**, not only `ScrollTrigger.progress===1`: finished content must be in the viewport, and `document.documentElement.scrollHeight` must remain stable while transforms run.
- No JS errors, asset 404s, horizontal overflow, scroll pins or locks. All links, theme switchers and keyboard navigation work.
- Capture screenshots at 0%, 25%, 50%, 85%, 100%, footer entrance and page bottom; review visually.

Never claim tests passed without actually running them. Do not claim a deployment succeeded before the public URL loads the new files and CI/deployment state is confirmed.

## 6. Deliver an auditable result

Include: modified files, scenes implemented, screenshots/demo, viewport test matrix, idle/reverse/Footer findings, code commit and rollback route if deployed. Communicate the final experience rather than internal planning or debug notes.

### Portable starter

- [Example website](assets/example.html) — standalone HTML using standard CDN GSAP.
- [Motion controller](assets/reversible-motion.js) — reversible scenes + single idle fallback.
- [CSS](assets/motion.css) — responsive layout and motion defaults; no padding hack.
- [Design grammar](references/MOTION-GRAMMAR.md), [code patterns](references/IMPLEMENTATION.md), [failure cases](references/FAILURE-MODES.md), [QA checklist](references/ACCEPTANCE.md).
- [Static Skill validator](scripts/validate_skill.py) — no third-party Python dependencies.

**Field-tested reference:** [Licat's live production controller](https://github.com/licat233/licat233.github.io/blob/main/assets/portfolio-motion.js) and [production entrance CSS](https://github.com/licat233/licat233.github.io/blob/main/assets/portfolio-entrances.css). These files are site-specific; **do not copy the whole controller blindly** into another site's selectors.
