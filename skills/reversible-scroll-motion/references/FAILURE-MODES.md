# Failure modes — actual regression lessons

These occurred or were identified during the Licat animation work and should become **test cases**, not post-release surprises.

| Failure | Cause | Repair | Evidence to demand |
| --- | --- | --- | --- |
| Cards jump / 3+2 grid becomes chaotic | Temporary FLIP stack changed real layout/positions | Animate the **real** cards inside unchanged CSS grid cells using transforms | Compare grid-cell positions before/after |
| Plays only once | `once: true`; clear transforms after completion | Scroll-driven reversible timeline; keep progress state | Down → up → down |
| Cards disappear or briefly flash on revisit | Staggered tweens initialize children at different times | Pre-set every item/char's initial transform and opacity | Screenshot before first row starts |
| Reversing snaps | Idle timeout finishes a scene but ScrollTrigger retains stale scroll percentage | Re-anchor to actual `scrollY` + visual progress; sync on scroll | Idle-completed card reverses from its current frame |
| At top, a partly visible ghost remains | Not enough remaining upward scroll after early idle finish | Reset to fully hidden when the scene's natural slot has left viewport | Return completely to page top |
| Screen's lower half remains invisible when user stops | `scrub: true` alone progresses only when moving scroll | One shared debounced timeout completes visible incomplete content | Pause for >1s after partial appearance |
| Footer never reaches a mid-screen trigger | Bottom of document limits scroll | Footer-specific near-bottom visibility gate and short range | Scroll to bottom, check real footer top |
| Empty 8–10rem footer tail | Added `padding-block-end` to artificially extend scroll length | Remove artificial padding; solve via geometry + idle fallback | Computed bottom padding, screenshot at bottom |
| Bottom cards never reach 100% | Large positive Y moved a card below body bottom and inflated `scrollHeight` | Bound positive offscreen displacement inside real document | Compare `scrollHeight` before/after |
| Animation becomes too fast/invisible | Range begins at ~95% screen height; ease front-loads progress | Begin when visibly entering; use longer **visible** range / balanced ease | Screenshots at 25%, 50%, 85% |
| Slowing Tween from 1s to 3s does nothing | `scrub: true` maps total timeline across scroll distance | Change `start/end` distance; duration for internal phase ratios | Same wheel delta visibly advances less |
| Slow catch-up or scroll feels hijacked | `scrub: 1.2`, page pin or manual wheel interception | Default to `scrub: true`, no pin, no hijack | Scroll response and no fixed progress freezes |
| Mobile horizontal scrollbar | Large rotation, perspective or left/right flight affects layout | `overflow-x: clip` on appropriate section and cap flight | 375/390/414px overflow test |
| SplitText headings snap or lose reverse | `split.revert()` called on initial completion | Keep split until animation context cleanup | Repeated reverse and breakpoint resize |
| Mysterious white space at document bottom | Padding hack or transform expands scroll height | Inspect `body.offsetHeight` vs `documentElement.scrollHeight`, remove cause | Before/after measurements |
| Production navigation points into demo | Copied demo HTML verbatim | Keep original page, switch **only** approved assets | Check all language/brand links |
| Production disappears from search | Copied demo `noindex` | Preserve original robots/canonical/hreflang | Inspect live page head |
| JS/CDN unavailable leaves invisible page | CSS hides content regardless of script readiness | Default visible, animate only when GSAP initialized | Block GSAP request; content still visible |
| Timer leaks after theme/breakpoint change | Listener and timeout not removed by animation context | Clean up `setTimeout`, event handler, GSAP and SplitText on exit | Toggle viewport breakpoint repeatedly |

## Review checklist before every deployment

1. Confirm the reported bug in the **browser**, not only by reading source.
2. Explain the smallest real root cause. Do not use layout padding, dependency additions, or design changes to conceal the failure.
3. Fix in demo/worktree; test desktop/mobile/short/tall viewport and deep-link restore.
4. Compare all real content, typography, pictures and links to baseline.
5. Check concurrent Git changes, then release and validate **live** served assets. No speculative success claims.
