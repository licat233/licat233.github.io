# Implementation recipes — adapting the template

Use [assets/reversible-motion.js](../assets/reversible-motion.js) as the starting implementation. The shipped site-specific implementation is linked in the root SKILL.md.

## 1. Choose stable references

A grid card flying from offscreen has an unstable transformed rectangle. Compute its row from an unmoving parent:

```js
const absTop = el => el.getBoundingClientRect().top + window.scrollY;
const naturalRowY = absTop(grid) + firstCard.offsetTop;
```

Create `start` and `end` functions that use the **natural** row coordinate, not `card.getBoundingClientRect()` after GSAP applies transforms. Set `invalidateOnRefresh: true` and call `ScrollTrigger.refresh()` after layout changes.

## 2. Keep a physical travel distance with a visible finish

```js
function visibleRange(naturalTop, entryRatio = .89, travelRatio = .48) {
  const max = Math.max(1, ScrollTrigger.maxScroll(window) - 24);
  const desiredStart = Math.max(0, naturalTop - innerHeight * entryRatio);
  const distance = innerHeight * travelRatio;
  const start = Math.max(0, Math.min(desiredStart, max - distance));
  return [start, Math.max(start + 1, Math.min(max, start + distance))];
}
```

Do not confuse **end reached** with **element can be seen**. At minimum assert:

```js
const rect = target.getBoundingClientRect();
const intersectsViewport = rect.bottom > stickyHeaderBottom &&
  rect.top < innerHeight;
```

If `maxScroll` is too short, prefer a shorter animation; let the idle fallback finish rather than adding extra footer padding.

## 3. Do not inflate scrollHeight with positive Y offsets

If a last-row card begins thousands of pixels below its natural position, it can temporarily expand `document.documentElement.scrollHeight`. ScrollTrigger caches a **false** end-of-page value and late scenes appear not to trigger.

```js
const naturalBottom = absTop(grid) + card.offsetTop + card.offsetHeight;
const remainingWithinDocument = Math.max(0,
  document.body.offsetHeight - naturalBottom - 100);
const positiveFlyY = Math.min(innerHeight + card.offsetHeight + 50,
  remainingWithinDocument);
```

For downward-moving origins (positive Y), use `positiveFlyY`. Clip offscreen horizontal transforms at a suitable section boundary with `overflow-x: clip`; don't clip text vertically.

## 4. A held final scene is a timeline phase

```js
function appendHold(timeline, fraction = .15) {
  const active = timeline.duration();
  if (active > 0) timeline.to({ state: 0 }, {
    state: 1,
    duration: active * fraction / (1 - fraction),
    ease: "none"
  }, ">");
}
```

Do **not** use `once: true` or clear GSAP transforms after completion if reverse playback is required.

## 5. A scroll + timeout state machine, not two fighting animations

The following is the essential logic (see `assets/reversible-motion.js` for complete cleanup and registration):

```js
const state = new WeakMap();
const scenes = [];
let idleTimer;

function onScroll() {
  for (const scene of scenes) {
    if (!scene.latched) continue;
    if (scene.idleTween) {
      scene.base = scene.timeline.progress();
      scene.anchorY = window.scrollY;
      scene.idleTween.kill();
      scene.idleTween = null;
    }
    scene.timeline.progress(gsap.utils.clamp(0, 1,
      scene.base + (window.scrollY - scene.anchorY) /
      Math.max(1, scene.scrollTrigger.end - scene.scrollTrigger.start)));
  }
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    for (const scene of scenes) {
      if (!actuallyVisible(scene) || scene.latched ||
          scene.timeline.progress() >= .999) continue;
      scene.latched = true;
      scene.anchorY = scrollY;
      scene.base = 1;
      scene.idleTween = gsap.to(scene.timeline, {
        progress: 1, duration: .6, ease: "power2.out"
      });
    }
  }, 480);
}
```

**Critical:** ScrollTrigger will try to apply its original progress after the idle tween. Its `onUpdate` should map the **latched** scene to the new scroll anchor and override stale progress. Without this, the next scroll causes a visible jump.

**Critical:** If scrolling restarts during the 600ms idle tween, kill the tween and re-anchor from the **current frame**, not the intended endpoint.

**Critical:** a completed scene may have less upward scroll available than its travel distance. Once the scene leaves view above and its natural trigger has been crossed, reset it fully rather than leaving an 8%-opacity ghost.

## 6. Footer has no midpoint guarantee

At 1440×900 on the field-tested page, Footer's top was still ~627px down the screen even at maximal scroll. Do not wait for `top 50%` or create huge bottom padding to force it there. Give Footer its own short range and a visibility threshold near the lower viewport. The shared idle fallback must make Footer usable at the bottom.

## 7. Responsive teardown and failure safety

Use `gsap.matchMedia()` with separate desktop/mobile card grouping; tear down event listeners and timer and revert SplitText only when context is destroyed. When assets fail or reduced motion is enabled, content must remain visible. Do not combine vanilla GSAP with another framework's scroll manager without testing ownership conflicts.

## 8. What to copy and what not to copy

Copy: state machine, stable grid geometry, cap on positive Y travel, breakpoint cleanup, QA.

Do not copy: Licat-specific selectors or artwork, an `overflow: hidden` on the entire page, fixed section heights, debug overlays, demo `noindex` tags, or site identity.

Prefer a small, native implementation: GSAP + ScrollTrigger with optional SplitText. A heavy rendering framework is unnecessary for this style of DOM entrance animation.
