# Case study: Licat "开发轨迹" V1 → V2 (2026-10-11)

**Status:** V2 was positively reviewed as **substantially better than V1**.
This is a **design-direction endorsement**, not authorization to overwrite
the formal Licat homepage. Both remain independent public studies.

- V1 source archive (immutable commit): <https://github.com/licat233/licat233.github.io/tree/91d2dd46192c322784759998e17e08c8d8177cc6/motion-preview/gsap-journey>
- V2 source archive (immutable commit): <https://github.com/licat233/licat233.github.io/tree/754493a5be24f8034580cc16b4ede119a1f8c79f/motion-preview/gsap-journey-v2>
- Approved production implementation: <https://licat233.github.io/#journey>
- **Housekeeping:** The short-lived public \`/motion-preview/\` review pages were deliberately retired once production integration passed. These immutable Git history links preserve the implementation evidence; do not recreate disposable public demos as permanent site navigation.
- GSAP official Skill snapshot consulted:
  `greensock/gsap-skills@aed9cfd3277740755f6bfc1155c7aa645403b760`.
  This case does not copy or vendor the upstream Skills.

## 1. What failed in V1

V1 called official `ScrollTrigger`, `DrawSVGPlugin` and
`MotionPathPlugin`. The track was drawn, a small traveler advanced
and card borders were traced. Text stayed readable and technical QA
passed, but **content remained essentially static**: three unrelated
cards beside a decorative timeline.

**Failure mode:** "using GSAP" was mistaken for "designing motion."
A frame showing all three static cards with a partly drawn line
still says little about *why* each stage led to the next.
**Do not make this technique the primary effect of a storytelling scene.**

A concrete V1 regression was also caught by real dynamic resize:
`MotionPathPlugin` cached desktop path geometry, leaving the traveler
as much as ~946 px away from its milestone when switched to phone.
Rebuild the relevant official tweens when path geometry changes and
**test waypoint alignment**, not merely that the SVG `d` changed.
The repaired V1 measured 0 px at three milestone checkpoints in
1440 → 390 → 768 → 1440 browser QA.

## 2. The successful V2 story

**User takeaway:** the same capabilities evolve from isolated software
construction to tooling/automation and then coordinated AI work.

| Semantic stage | Visual state and real event | Official mechanism |
| --- | --- | --- |
| 01 BUILD | One visible system module is assembled; core drawn | `Timeline` + `DrawSVG` |
| 02 AUTOMATE | Core moves, two capabilities grow out of it, a workflow line is drawn, a packet travels, core SVG changes into a flow symbol | GSAP transforms, `DrawSVG`, `MotionPath`, `MorphSVG` |
| 03 ORCHESTRATE | Three workflow nodes reorganize; knowledge & governance join; six connectors establish dependencies; central form becomes a network symbol | GSAP transforms, `MorphSVG`, `DrawSVG` |

The expressive centerpiece is **a persistent diagram that changes
structure**, not a sequence of already-placed cards lighting up.
Visible travel spans hundreds of SVG units. All explanatory paragraphs
remain in semantic DOM; they are **not** hidden to manufacture reveals.

**The plugin choice mattered:** official Flip is for actual DOM/layout
state transitions. V2 uses static SVG nodes transformed in a fixed
coordinate system. It intentionally does **not** use Flip. This is
selective adoption of upstream guidance, not maximizing plugin count.

V2 has one `gsap.timeline()`, named chapter labels, a top-level
`ScrollTrigger`, CSS `sticky` instead of pinned spacer, and
chapter-specific viewport synchronization. The responsive mobile
start threshold differs from desktop because the sticky diagram
occupies a much larger fraction of the viewport.

## 3. Real QA findings and fixes

**Evidence from Playwright/Chromium on MacStudio.local:**

- Desktop 1440, tablet 768, phone 390: official plugins loaded;
  three chapters and five visual nodes present, no page errors,
  no horizontal overflow.
- Scroll to each *real chapter's viewport center* (not only force
  timeline progress in a test): visible chapter and diagram advanced
  through BUILD → AUTOMATE → ORCHESTRATE.
- Scroll chapter 3 → chapter 1: coherent reverse on 1440/390,
  ending with one visible core again.
- Reduced-motion preference: no active ScrollTrigger, all readable
  content remains visible, and a static connected diagram is available.
- First phone review found the sticky diagram **covered the first
  year marker**. A later CSS mobile chapter-offset change restored
  visibility. This is why visual screenshots are mandatory.
- Browser state and screenshot review found early connector paths
  crossing node content. Routing was revised to connect outside
  visible node surfaces.
- Public deployment: GitHub Pages responded 200; Chromium loaded
  the public page on desktop and mobile with the GSAP controllers
  active, no console errors. Private MacStudio localhost was **not**
  presented as the user's only viewing option.

These are factual results for **this snapshot**, not universal
performance, guaranteed FPS, or aesthetic acceptance of every scene.

## 4. Portable animation recipe

1. **Model semantics.** Write a one-sentence story: "A capability
   becomes a process, which becomes an interconnected system."
2. **Inventory semantic actors.** Here: core, tooling, delivery,
   knowledge, governance and six links; ordinary prose stays static.
3. **Storyboard 0/20/45/70/100%.** Each checkpoint shows a
   *structural change*, not simply more elements visible.
4. **Choose primitives** from [GSAP official-first workflow](GSAP-OFFICIAL-FIRST.md);
   avoid a custom interpolation system when MorphSVG/MotionPath exists.
5. **Tie to real content placement.** Time transitions to chapter
   centers and mobile sticky geometry, not only numeric progress.
6. **Protect semantics and optics.** Keep text readable throughout,
   no animated glass blur/white fog overlay, no arbitrary micro fades.
7. **Test visual outcomes.** Capture mid-flight and final desktop/
   phone screenshots, natural scroll, stopped scroll, reverse,
   resize, reduced motion, missing CDN and post-deploy real URL.
8. **Keep acceptance separate.** A visually promising independent
   demo is not permission to replace any production page.

**Anti-pattern:** "All my JavaScript tests passed so the animation is
excellent." V1 disproved this. Instead ask: **What relationship does
the viewer understand *because* the scene moved?**

## 5. Reuse responsibly

Transfer the **storyboarding, plugin selection, lifecycle and QA
methods**, never the Licat texts, dates, colors, layout, background
image, or hard-coded selectors. EAO, product pages and employee
tools have their own semantic actors and approved visual language.
