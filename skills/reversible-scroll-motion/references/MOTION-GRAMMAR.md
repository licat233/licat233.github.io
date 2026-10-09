# Motion grammar — expressive but readable

## Design before code

The Licat production site illustrates **technique**, not mandatory appearance. Customize the direction, depth and timing around real content. Awwwards-level polish comes from a clear visual hierarchy and disciplined pacing, not covering every component with movement.

| Scene | Purpose | Motion | Why it works |
| --- | --- | --- | --- |
| Hero | Introduce the product | One-time opening; optional SVG morph or gentle depth | Establishes the page, then stops competing with reading |
| Section title | Signal a new chapter | Character masks/3D rotation and small kicker/note wipes | Starts while entering view, finishes legibly before leaving |
| Portfolio/project grid | Show variety, emphasize composition | Eight directional flights, stagger by actual grid row; scale .72–.85 and ±8–13° rotation | Expressive approach followed by stable original grid |
| Journey/timeline | Explain progression | Alternating directional clip reveal with rotating nodes | Natural reading sequence |
| Principles/values | Convey structure | Perspective `rotationY` fold, brief stagger | Depth without changing the real card layout |
| Footer | End with functional navigation | Short fade-and-rise | Should become usable even if its top never reaches mid-viewport |

Do not use these movements to hide essential menus, CTA, error messages, legal text, or focus outlines.

## Pacing without scroll traps

A scene has four logical phases:
1. **Visible introduction** — content is near the lower part of the viewport, not hidden before any possible interaction.
2. **Primary travel** — most movement occurs while the target is visibly crossing the viewport.
3. **Fine settle** — remaining 7–15% of displacement approaches the final position.
4. **Stable composition** — 10–15% of the timeline is a held last frame, provided the target is still in view.

In `scrub: true`, set a useful scroll distance through `end - start`. Example: 50% of a 900px viewport is 450px. Changing a single Tween's duration from 1s to 3s without changing the scroll range does **not** create a 3-second animation.

An expressive entrance that completes above the viewport is **worse** than a shorter one that the user sees.

## Example trigger heuristics

All values are *position ratios of viewport height*, not seconds.

| Target | Begin at | Finish at | Considerations |
| --- | --- | --- | --- |
| Heading | top at 87% | top at 45–50% | SplitText should not compromise text wrapping |
| Cards | top at 89% | top at 38–45% | Use layout row positions, not card transforms |
| Timeline | top at 88% | top at 44% | Group by real row; shorter on phone |
| Principle cards | top at 89% | top at 42% | Avoid perspective causing horizontal overflow |
| Footer | top at 98–94% | as soon as possible | Most pages cannot scroll it to 50%; use idle fallback |

These are **starting proposals**, not hard-coded standards. The footer may have no user-reachable midpoint. Test actual scroll max and element's final screen coordinates.

## Motion depth and restraint

- Prefer geometric transform choreography, not neon glows or a pile of floaty SaaS cards.
- Keep real CSS grid intact. Transform card content inside grid cells; no change to `position` or `display` to build a temporary stack.
- Use a 2-step `fromTo` + `to` for large flights to avoid abrupt landings; let `timeline.progress()` reverse them.
- Use mild translation for explanatory text. Avoid complex masking on long paragraphs.
- Favor one intentional focal animation in each region, supported by subtle sibling movement.
- Theme, navigation and accessibility remain independent of scroll and should not be animated away.

## References

- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/)
- [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Production page](https://licat233.github.io/zh/)

*Apple product pages are a source of inspiration for visible choreography and phase pacing, not a license to copy their assets, proprietary source or exact design.*

## Narrative grammar discovered on EAO

A workflow is A → connector → B → connector → C → connector → D,
not four visually simultaneous cards. A title can drop each character
from above, while a parent information card first establishes context
and then reveals its child facts. Motion distance may be substantial
when the story justifies it, but large X+Y on FAQ cards caused
mid-flight overlap. See [EAO story case](eao-story-choreography.md).

## Parent + children = intentional detail, not decoration

When a card contains multiple meaningful subitems, stage the card
first and then its children in semantic reading order. This adds
depth and precision without moving all elements randomly. Do not
assume all subitems warrant separate motion: long body text, forms,
links, status alerts and FAQ focusable controls must remain usable.
Check composed parent and child transforms, physical bounds and
pause-with-half-visible-content. See [EAO case](eao-story-choreography.md).
