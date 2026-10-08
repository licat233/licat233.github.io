# Browser acceptance checklist

This Skill is only complete when **a user can actually read and use the page**. Passing a JS unit test or printing GSAP's progress is not sufficient.

## Preflight

- [ ] Exact repository branch/commit recorded; worktree clean or unrelated user changes preserved.
- [ ] Scope agreed: demo first, production only with authorization.
- [ ] All content and navigation paths match baseline.
- [ ] Existing runtime/dependencies inspected; no unnecessary framework introduced.
- [ ] Browser can reach actual GSAP and optional SplitText/MorphSVG resources.

## Test matrix

| Device | Viewport | Languages | Extra |
| --- | --- | --- | --- |
| Desktop | 1440×900 | Each | Light & dark |
| Short desktop | 1280×720 | Default | Header overlaps, short visible range |
| Tall tablet/desktop | 820×1180 | Each where applicable | Last-card scrollHeight inflation |
| Phone | 390×844 | Each | Single column, touch |
| Small phone | 375×667 | Each | Near-bottom footer |
| Reduced motion | desktop and phone | At least one | All text visible, no active scene |
| Resize | 1440→390→1440 | At least one | New grouping, no stale listeners |
| Failure | GSAP request blocked | At least one | Essential text/links still visible |

## Required scroll choreography checks

For each scene: heading, projects (ALL rows), timeline (ALL rows), principles (ALL rows), footer.

1. Scroll to just before the scene begins: original grid geometry unchanged, no page-wide overflow.
2. At ~25% and ~50% physical scroll progress, screenshot and inspect the *actual* item transform/opacity. Scene should be visibly in progress **inside** viewport.
3. Stop moving for at least 1.2 seconds with incomplete content in view. The scene should finish without scroll; collect opacity and transform values.
4. Scroll up 30–200px: it should reverse smoothly **from the visible state**; no abrupt snap to the physical scrub position.
5. Scroll upward until the scene naturally leaves the viewport: it must not leave ghost text or half-opacity cards.
6. Scroll down again: same animation replays cleanly.
7. Fast jump from first screen to page bottom: all footer links, project cards, principle cards and timeline labels visible, focusable.
8. Repeat the **stop with footer just entering the bottom 5–20% of viewport** scenario. Footer does **not** have to reach the middle of screen.
9. Scroll to the page bottom and record natural footer position, not an assumed midpoint.
10. Repeated visits / language navigation / page reload with saved scroll position: visible content remains readable.

## Instrumentation hints

Puppeteer/Playwright:
```js
const state = await page.evaluate(() => ({
  scrollMax: ScrollTrigger.maxScroll(window),
  physicalHeight: document.documentElement.scrollHeight,
  bodyHeight: document.body.offsetHeight,
  overflowX: document.documentElement.scrollWidth - innerWidth,
  footerPadding: getComputedStyle(document.querySelector("footer")).paddingBottom,
  targetOpacity: +getComputedStyle(document.querySelector("[data-motion-item]")).opacity,
  pins: ScrollTrigger.getAll().filter(x => x.pin).length
}));
```

For controlled testing, first disable native smooth scrolling:
```js
await page.evaluate(() => {
  document.documentElement.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, behavior: "instant" });
});
```

If browser scroll-behavior stays smooth, a test that samples immediately after `window.scrollTo` can mistake the browser's own travel for GSAP scrub delay.

Assert scrollHeight at initial load, after first card settles and at page bottom; differences caused by transforms are a blocker.

## Ship gates

- [ ] No JS errors or asset 404s.
- [ ] No unexpected horizontal overflow, scroll pin/lock, huge blank footer or changing scrollHeight.
- [ ] No permanently hidden content after scrolling stops.
- [ ] Reduced-motion and offline/failure fallback make content visible.
- [ ] Real links work; tab order, theme, language, SEO metadata remain intact.
- [ ] Screenshots reviewed, not merely generated.
- [ ] Commit only intended paths; verify remote HEAD before updating.
- [ ] Live deployment success and changed file bytes/versions confirmed via public URL.
- [ ] Post-release same smoke tests run on actual public pages.
