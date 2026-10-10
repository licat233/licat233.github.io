---
name: reversible-scroll-motion
version: 1.4.0
description: Build and repair production-grade, GSAP-powered, reversible scroll animations for websites. Use for cinematic entrances, meaning-driven spatial card choreography, SplitText headings, timeline wipes, 3D panels, footer reveals, ScrollTrigger scrub timing, idle/setTimeout visibility fallback, mobile/reduced-motion support, and browser QA. Also use when scroll animations hide content, fail at page bottom, inflate document height, or stop working on reverse scroll. Includes semantic A-to-D workflows, falling glyph headings, parent-child item choreography, and animated FAQ lists. Requires choosing L1-L4 ambition by content meaning and separate perceptual-motion review, with a hard ban on presentation microanimations.
---

# Reversible Scroll Motion — production workflow

Create expressive, readable, accessible page motion without scroll hijacking. This Skill was distilled from the launched bilingual Licat homepage. Do **not** copy its colors, typography, text, layout, or site identity; transfer its **technique** to the user's existing page.

> **Invariant:** Scrolling can control *how* content moves; it must never be the only thing controlling *whether content can be read*. An element in the viewport must become fully readable even if scrolling stops.

## HARD RULE — Ban presentation microanimations

**Default mode: NO MICROANIMATIONS for storytelling and showcase content.**
For heroes, chapter headings, project/skill cards, product showcases,
timelines, comparisons and meaningful card children, a generic
`opacity: 0 → 1`, `autoAlpha` reveal, tiny `translateY` fade-up,
or decorative `stagger` is **NOT an animation design**. Reject it as
the primary effect even when browser/JS tests pass.

This is a *visual outcome gate*, not a ban on every use of opacity.
Apply these enforceable requirements:

1. **Movement before appearance:** Design a readable spatial event —
   directional travel tied to layout/meaning, path following, SVG drawing
   or morphing, perspective unfolding, scale/depth choreography,
   connecting-line progress or a real causal transformation. A viewer must
   see meaningful travel/change in the viewport at normal scroll speed.
2. **Never treat fade-in as the story.** Opacity can support occlusion or
   prevent awkward overlap, but cannot supply the principal motion or
   conceal most of an otherwise large movement. Prefer visible motion
   over items simply materializing at their final coordinates.
3. **No random showmanship:** Eight-direction/random card flights,
   arbitrary rotation or uniform stagger for unrelated items are also
   rejected. Movement must express parent→child, step→connector→next
   step, source→result, or actual position in the composition.
4. **No consolation microanimations:** If a paragraph or practical UI
   region has no meaningful motion story, **leave it static** rather than
   add a token 20–40px fade-up to claim the page is animated.
5. **Every major content scene requires a distinct storyboard** stating
   what physically changes, why, what its child items do, what a human
   sees at 20/45/70% playback and how it reverses/settles. Motion that
   only reads as “hidden → visible” is **VISUAL NOT ACCEPTED**.
6. **Exceptions are scoped, not loopholes:** L1 press/hover/focus,
   functional state feedback, reduced-motion accessibility and
   unobtrusive dense reading copy may use restrained motion or remain
   static. These must not replace the main site's L3/L4 choreography.

Read the **[mandatory anti-microanimation gate](references/MOTION-AMBITION-GATE.md#gate-0--hard-ban-on-presentation-microanimations)**
before any motion implementation. **Do not deploy** a visually failing
preview regardless of engineering QA or a passing static validator.

## 0. Before touching code

1. Inspect the **actual** repository, entry pages, CSS/JS, existing animation dependencies and Git state. Do not trust earlier chat SHA values.
2. Confirm which pages are approved for edits. For unapproved production changes, work in an isolated demo or worktree first. Preserve other concurrent changes; never force-push or reset legitimate commits.
3. Record a baseline with real browser screenshots at desktop, mobile, light/dark and `prefers-reduced-motion: reduce`. Identify scroll containers, sticky headers, page-end behavior and links.
4. **Pass the Motion Design Ambition Gate before coding**: inspect content
   semantics, parent/child structure and the visitor's desired insight;
   choose **L1–L4** purpose and ambition **per scene** with a rationale.
   Record entry path, real viewing window, causal order and visual QA
   evidence. See the mandatory [ambition gate](references/MOTION-AMBITION-GATE.md).
   Do not use 20–40px Fade Up / opacity reveal as an L3/L4 substitute.
5. **Choose movement by information meaning**: a sequence is not an
   unordered card grid; a heading has reading order; a parent card can
   contain facts that need their own sequence. Decide this before GSAP.
6. Decide which sections merit expressive choreography. Do not animate every word or control: keep navigation, forms, accessibility controls and reading surfaces usable.
7. Prefer the site's existing GSAP; avoid introducing frameworks, services or large 3D engines for simple entrances.

Read the **[Motion Design Ambition Gate](references/MOTION-AMBITION-GATE.md)**
*first* whenever designing or substantially revising motion. It is a
mandatory decision/visual-quality gate, not optional inspiration.
Record an internal per-scene storyboard: meaning → chosen L1/L2/L3/L4
→ direction/timing/children → actual visible travel → visual evidence.
If the user requests expressive or cinematic motion, do not deliver
generic fade-up as the hero effect without a specific reason; conversely
do not force heavy 3D into FAQ controls or text-heavy reading content.

Read [the motion grammar](references/MOTION-GRAMMAR.md) before designing. For runnable implementation, see [the reusable demo](assets/example.html) and [controller](assets/reversible-motion.js).

## Semantic narrative patterns (EAO field work)

Read [EAO information choreography](references/eao-story-choreography.md)
for explicit A → arrow → B → arrow → C → arrow → D sequencing,
character-by-character top-down falling titles, and parent-card followed
by internal child facts. It includes real regressions: visually concurrent
stages, late-initialized flashing glyphs, FAQ mid-flight overlap, rotated
card overflow and mobile row-grouping errors.

The user rejected arbitrary weak stagger despite layout tests passing.
Animation must explain relationships, not merely demonstrate motion.

## Parent + child animation is a first-class scene type

Before animating a container, inventory its meaningful internal units:
individual workflow steps, fact/list/grid rows, feature items and
decorative connectors. If the parent contains multiple *visually distinct*
items, consider BOTH a parent entrance and a second story-driven child
timeline rather than animating the outer card alone. For every child,
record reading/causal order, visibility trigger, starting/final geometry,
reverse path and idle-completion fallback.

Do not animate every glyph of body paragraphs or duplicate hover/
focus interactions just for spectacle. Never independently transform
glass filter/tint/rim layers or make FAQ buttons inaccessible. See
[EAO information-story case](references/eao-story-choreography.md).

## 1. Plan scenes according to their visible geometry

For each scene, record: **content story, ambition level, stable trigger,
target(s), viewport entry, viewport finish, idle fallback, reverse exit,
real mid-flight viewing window**. Suggested defaults, not universal:

| Scene | Motion grammar | Start | Finish while visible |
| --- | --- | --- | --- |
| Hero | One-time load intro, optional SVG morph | Initial load | Before interaction |
| Section heading | Masked SplitText chars, modest 3D rotation, note wipe | Top near 85–90% viewport height | Top near 40–50% |
| Grid cards | Layout-grounded paths, position-aware spatial placement, semantic parent/child staging | Top near 88–90% | Top near 37–45% |
| Timeline | Alternating clip masks, node rotation | Top near 85–90% | Top near 42–50% |
| Principles | Perspective unfold | Top near 85–90% | Top near 40–50% |
| Footer | Short fade/rise | As soon as actually visible | **Never require screen midpoint** |

Measure real viewport, section heights, sticky headers and document max
scroll; shorten passages when necessary. The objective is **legible,
purposeful and perceivable** motion, not arbitrary long distances.
A declared 175px initial transform can still LOOK like microanimation if
the actual travel is invisible or the idle-completion compresses a five-step
story into a blink. Validate the perceptual effect, not just CSS values.

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

### Extra choreography contracts

- Sequential diagrams: explicit timeline offsets for each step and outgoing
  connector. Validate intermediate stages, not just the fully settled result.
- Falling characters: initialize *all* glyphs with gsap.set before a stagger,
  preserve the accessible full heading and English word wrapping, and
  restore original DOM on context teardown.
- Nested facts: parent glass surface first, then children in visual reading
  order, with separate visibility/idle coverage.
- Expressive moves can be large, but cap translation **including rotated
  bounds**. Don't combine huge horizontal and vertical FAQ displacements.
  Never animate optical layers independently or hide interactive summaries.

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

### Depth budget for nested timelines

- Outer surface first: reveal the card's place in the composition.
- Inner items second: enter row-by-row or one-by-one according to
  semantic and visible reading order, not random shuffle.
- Allow intentional overlap for a smooth sequence; do not compound
  X/Y/rotation until items overlap or fly outside the screen.
- The shared idle fallthrough must complete any *visible* incomplete
  child timeline after scroll stops, while offscreen children wait.
- Parent and child animation use the existing reversible controller,
  not a new independent timer or library per item.
- Mobile shortens translation and may regroup rows; reduced-motion
  and GSAP failure keep **all** children readable.

## 4. Accessibility, performance and safety

- Missing CDN, blocked JS, reduced motion or unsupported GSAP must **fail open to visible content**, never permanently `opacity: 0`.
- Preserve semantic headings, reading order, tab navigation and focus outlines. Do not animate critical controls out of reach.
- Use `transform` and `opacity`; avoid heavyweight per-frame layout reads or animating `height`/`left`/`top`. Do not default to `once: true` when reversible playback was requested.
- No default scroll pin, wheel interception, programmatic scroll hijack, snap or 1-second scrub catch-up. Only use these when the user expressly wants them.
- Prevent horizontal overflow without clipping important text vertically.
- Preserve content, real links, SEO metadata, localization, theme and responsive behavior. Do not copy demo banners or `noindex` into production.

### Design ambition QA (independent from engineering QA)

- Check the [ambition gate](references/MOTION-AMBITION-GATE.md):
  per-scene **L1–L4** classification, semantic storyboard, chosen
  motion vocabulary and specific reason for any L3/L4 downgrade.
- When expressive motion was requested, **generic 20–40px opacity
  Fade Up is insufficient as the main choreography** if the content
  supports narrative/cinematic staging. A suitable L1/L2 for controls
  and dense text is not a failure.
- Inspect real normal-speed wheel/touch playback and **0/20/45/70/100%**
  states: ensure visible travel, comprehensible causal ordering,
  interesting spatial layers and landing, not merely working JS.
- Run separate **engineering acceptance** and **visual-motion acceptance**.
  If an L3/L4 scene is primarily fade-in, generic stagger, or visibly
  imperceptible, mark **visual NOT ACCEPTED** regardless of a perfect
  viewport test matrix; revise and review with the user before production.

### Narrative QA (in addition to scroll mechanics)

- At ~20/45/70/100% compare the step and connector states: A must
  precede B, C and D; no premature arrow or invisible visible row.
- Check the heading first and last glyph for flashes, accessible naming
  and final correct wrap in both languages.
- Check the large-card child items independently after parent arrival;
  pausing and reversing may not strand half a visible card blank.
- In FAQ, controls remain focusable throughout any row entry.

## 5. Test locally AND on the published page

Read [acceptance checklist](references/ACCEPTANCE.md) and [historical failures](references/FAILURE-MODES.md). Test:

- 1440×900 desktop, 1280×720 short desktop, 820×1180 tall viewport, 390×844 and 375×667 phones, dark/light and reduced motion.
- Stop scrolling with an element **partly visible at screen bottom**: it completes after the idle delay. Repeat for Footer.
- Scroll down → stop → automatically complete → scroll back up → reverse **from the current visual state** → scroll down again. No jumping.
- Scroll rapidly to the bottom and return. All cards, timeline entries, methods and footer text remain readable at the end of the page.
- Check **physical geometry**, not only `ScrollTrigger.progress===1`: finished content must be in the viewport, and `document.documentElement.scrollHeight` must remain stable while transforms run.
- No JS errors, asset 404s, horizontal overflow, scroll pins or locks. All links, theme switchers and keyboard navigation work.
- Capture screenshots at 0/20/45/70/100%, footer entrance and page
  bottom; **review real playback at normal scroll speed**. Geometry and
  automated PASS alone cannot certify animation quality or originality.

Never claim tests passed without actually running them. Do not claim a deployment succeeded before the public URL loads the new files and CI/deployment state is confirmed.

## 6. Deliver an auditable result

Include: modified files, scenes implemented, screenshots/demo, viewport test matrix, idle/reverse/Footer findings, code commit and rollback route if deployed. Communicate the final experience rather than internal planning or debug notes.

The [EAO narrative case](references/eao-story-choreography.md) provides
portable snippets and failure evidence; do not copy EAO-specific selectors.

### Portable starter

- [Example website](assets/example.html) — standalone HTML using standard CDN GSAP.
- [Motion controller](assets/reversible-motion.js) — reversible scenes + single idle fallback.
- [CSS](assets/motion.css) — responsive layout and motion defaults; no padding hack.
- [Mandatory ambition/visual gate](references/MOTION-AMBITION-GATE.md)
  — L1–L4 selection, anti-generic-fade policy, real perceptual QA.
- [Design grammar](references/MOTION-GRAMMAR.md), [code patterns](references/IMPLEMENTATION.md), [failure cases](references/FAILURE-MODES.md), [QA checklist](references/ACCEPTANCE.md).
- [Static Skill validator](scripts/validate_skill.py) — no third-party Python dependencies.

**Field-tested reference:** [Licat's live production controller](https://github.com/licat233/licat233.github.io/blob/main/assets/portfolio-motion.js) and [production entrance CSS](https://github.com/licat233/licat233.github.io/blob/main/assets/portfolio-entrances.css). These files are site-specific; **do not copy the whole controller blindly** into another site's selectors.
