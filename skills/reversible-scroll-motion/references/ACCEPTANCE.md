# Browser acceptance checklist

This Skill is only complete when **a user can actually read and use the page**. Passing a JS unit test or printing GSAP's progress is not sufficient.

## Separate technical and visual acceptance

**Never call a narrative-animation request done because responsive
test counts pass.** Run the independent [Motion Design Ambition Gate](MOTION-AMBITION-GATE.md) and present the approved visual demo
alongside engineering findings.

- [ ] Per-scene meaning and **L1/L2/L3/L4** choice documented before code.
- [ ] Explicit expressive/cinematic requests get an intentional L3/L4
  design (or a specific justified downgrade), **not a generic Fade Up**.
- [ ] Parent and meaningful children have planned order and visible
  entrances, instead of all entering at once.
- [ ] Normal wheel/touch playback is recorded/reviewed; transforms are
  visible for useful time and **not hidden at near-zero opacity**.
- [ ] Check **0/20/45/70/100%** actual intermediate states AND natural
  scroll + stop. The sequence must read at real speed.
- [ ] Scroll-stop idle completion does not compress a multi-step sequence
  into an indistinguishable flash, yet leaves visible text fully readable.
- [ ] Independent outcome reported: **engineering PASS/FAIL** and
  **visual ACCEPTED/NOT ACCEPTED/PENDING USER REVIEW**.
- [ ] Any user-required aesthetic approval is obtained before production
  promotion; a perfect automation matrix does not grant it.

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

## EAO semantic-scene acceptance

- [ ] Annotate meaning and order before choosing transforms.
- [ ] A, connector, B, connector, C, connector, D verified at
  intermediate progress, in DOM/layout order.
- [ ] Top-down characters pre-initialized; no flash, normal wrapping
  and one accessible heading.
- [ ] Parent cards and their child fact items settle and reverse;
  pause with a partly visible last child to verify idle completion.
- [ ] FAQ remains clickable while animated; no large X+Y overlap.
- [ ] Perspective card flights do not widen page; actual rows and
  responsive breakpoint teardown are tested.
- [ ] Automated geometry PASS and user aesthetic sign-off are separate.

See [EAO story case](eao-story-choreography.md).

## Nested-item audit

- [ ] Each visual parent inventoried for meaningful subitems; no
  obvious feature/list/grid children unintentionally remain static.
- [ ] Semantic order captured and visually observed (parent then
  children, or source then connector then dependent node).
- [ ] The last visible child reaches readable opacity after idle
  timeout; reversing restores a coherent original state.
- [ ] Mid-animation screenshots reveal no child overlap, clipping,
  focus loss, distorted glass optics or widened scrollWidth.
- [ ] Parent and children are statically readable if GSAP fails
  or prefers-reduced-motion is enabled.
