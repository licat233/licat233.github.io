# GSAP official-first workflow — verified primitives before custom effects

This is a **selection and implementation contract**, not a vendored or
rewritten copy of GreenSock's Skills. Keep upstream as the authority on API
behavior. Preserve this Skill's separate responsibility for **content meaning,
ambition, originality, accessibility, performance and user acceptance**.

## 1. Source of truth

- Official AI Skills: <https://github.com/greensock/gsap-skills>
- Verified upstream snapshot for the Licat V2 study:
  `aed9cfd3277740755f6bfc1155c7aa645403b760` (2026-10-11).
- Read only the relevant official Skills, **before writing animation code**:
  - [gsap-timeline](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-timeline) for `gsap.timeline`, labels, positioning and nested timelines.
  - [gsap-scrolltrigger](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-scrolltrigger) for scroll-driven playback, responsive ranges, `scrub`, `pin` and refresh.
  - [gsap-plugins](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-plugins) for native `Flip`, `MorphSVGPlugin`, `MotionPathPlugin`, `DrawSVGPlugin`, `SplitText` and others.
  - [gsap-performance](https://github.com/greensock/gsap-skills/tree/main/skills/gsap-performance) for transform-first movement, batching reads, lifecycle and `will-change` budget.
- Canonical up-to-date API docs: <https://gsap.com/docs/v3/>.
  Check version/API availability in the **actual project**; a historically
  checked SHA is provenance, not a claim that upstream never changes.
- If upstream AI Skills cannot be read, consult the official API docs already
  available in the project or via web. Do not guess a plugin API. If offline
  and API uncertain, use an already verified pattern or stop and ask.
- Do not copy a demo's design, typography, brand identity or scripted effects
  without matching its semantic purpose.

## 2. Design the story before selecting a plugin

In this order:

1. Read the actual content: stages, causal sequence, dependencies,
   contrast, hierarchy and necessary children.
2. Explain the audience takeaway **without** animation terminology.
3. Draw a 0/20/45/70/100% storyboard: source → physical change →
   destination, both downscroll and reverse.
4. Choose the **smallest set of official primitives** that realizes
   those changes. Do not treat plugin count as evidence of quality.
5. Identify what can stay statically readable; do not hide copy merely
   to create something to animate.
6. Prove intermediate *perceptual* states with a browser and human review,
   then record implementation/API evidence and responsive behavior.

**Only write bespoke JS for scene-specific orchestration** (DOM discovery,
geometry measurement, lifecycle, semantic mapping). When a native GSAP plugin
does the motion itself, do not write an interpolation engine, custom request
animation loop, SVG `d` tween, random-direction choreography or homegrown
scroll controller to replace it.

## 3. Choose based on effect semantics

| Desired real transition | Official primitive | Qualification |
| --- | --- | --- |
| Causal stages, overlap, chapter progression | `gsap.timeline()` with `addLabel()` and position parameters | One master narrative, not independent competing child ScrollTriggers |
| Physical scroll controls an overall scene | `ScrollTrigger` on the **master** timeline | Derive viewport `start/end` from chapter geometry; test phone and page end |
| A path is progressively traced | `DrawSVGPlugin` on an actual SVG stroke | Decorative border tracing **alone** is not a chapter narrative |
| One marker travels on a real path | `MotionPathPlugin` | Verify alignment of **each meaningful waypoint**; on resize remeasure/rebuild if path coordinates were cached |
| One graphical concept transforms into another | `MorphSVGPlugin` | SVG shapes express a semantic change; watch path direction, intermediate self-intersections and `shapeIndex` |
| Elements move between **actual** layout/DOM states | `Flip.getState()` → layout change → `Flip.from()` | **Do not use Flip** for a static SVG diagram whose nodes only move by `transform` |
| Heading needs chapter typography | `SplitText` | Accessible full text, responsive re-splitting, `revert()` cleanup; avoid per-character body-copy noise |
| Parent branches into dependent nodes | GSAP transforms + timeline + DrawSVG connectors | Animate the *relationship*; don't simply fade every dependent card |

**No blanket ban on Flip.** Reject fake FLIP rearrangement to simulate a
scene, not official Flip when there are genuine before/after layout states.
Equally, **no mandatory Flip** when transforms and MorphSVG fit better.

## 4. Scroll choreography without readability gating

- Pin only where the visual story truly requires it. Prefer CSS `sticky`
  with natural document flow when sufficient; no fake scroll length or
  footer padding added to manufacture animation time.
- `scrub` progress depends on physical scroll distance; child durations
  determine **relative chapter proportions**, not fixed seconds.
  Mild numeric smoothing is allowed **only when tested for lag**.
- Bind positions to chapter visibility: screenshot real natural-scroll
  chapter centers, not only arbitrary `timeline.progress(x)` frames.
- Use `gsap.matchMedia()` or explicit remeasurement/cleanup as appropriate;
  listen only for real layout changes, not every frame.
- If meaningful content is intentionally hidden mid-scroll, use the
  existing idle visibility fallback (see IMPLEMENTATION.md), then test
  continuous reverse without snapping. If **all content stays readable**
  and only an SVG illustration is scrubbed, the idle timeout is **not**
  necessary and must not be added out of habit.
- Keep every essential heading, link and paragraph in ordinary DOM order.
  For blocked GSAP/CDN or reduced motion, show a coherent static final
  state or equivalent fully readable content.

## 5. Glass materials & performance

- Prefer transform-driven semantic node movement and drawing small SVG
  paths. Avoid animating `backdrop-filter`, blur, layout dimensions,
  border thickness, or other expensive full-card material properties.
- A glass UI stays transparent; **do not add opaque white gradient/fog**
  just to rescue text. Adjust text contrast, shadow or background art.
- Budget GPU layers: `will-change` is targeted, not global; avoid dozens
  of permanent compositing layers and unnecessary concurrent tweens.
- Inspect browser performance and long scrolls on mobile. Real quality
  includes no jank, no horizontal overflow, no blocked reading, no JS
  exceptions and no animation when reduced motion is requested.

## 6. Release gate

Record separately:

1. **Technical**: plugin availability, source/API provenance, viewport
   matrix, mobile resize, reverse, fallback, no layout drift or 404s.
2. **Semantic/visual**: can a visitor tell what changed and why at normal
   touch/wheel speed? Are children and connectors causally timed?
3. **Approval**: was the specific visual revision reviewed? An approved
   isolated demo **does not authorize replacing** the production page.

Study [Licat Journey V1 → V2](licat-journey-v1-v2.md) before implementing
a timeline, workflow, diagram or chapter evolution.
