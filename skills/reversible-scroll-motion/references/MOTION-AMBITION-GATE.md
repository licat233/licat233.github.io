# Motion Design Ambition Gate — choose choreography before code

**Mandatory when designing or substantially revising a website's motion.**
This is a design-decision and visual-acceptance contract, **not** an
instruction to animate everything dramatically. It upgrades the Skill from
"implement a correct GSAP entrance" to "choose the appropriate story,
then prove users can actually perceive it".

## The failure we are correcting

When asked for "appropriate animation", an AI agent may apply the same
20–40px upward fade to every heading, card, timeline, graph and control.
That is a relatively safe **implementation default**, not evidence of
good design. It ignores the meaning of content and requested visual
ambition. EAO users rejected microanimations even after responsive
browser matrices passed.

This does not establish that models consciously avoid risk or that
subtle animation is always bad. The verified problem is that generic
fade-up code can pass technical QA while failing the visual brief.

## Gate 1 — read the content and choose ambition deliberately

Before writing GSAP/CSS, prepare a small **internal storyboard** per
meaningful scene:

| Field | Decision required |
| --- | --- |
| Content meaning | Causal sequence, hierarchy, comparison, grouped facts, prose, interface feedback? |
| Parent and children | Which meaningful subitems are present, and in what order? |
| Audience takeaway | What relationship should movement make obvious? |
| User brief | Subtle, expressive, cinematic, product storytelling, or unspecified? |
| Level | Choose L1–L4 and justify this scene's selection |
| Choreography | Entry direction, path, depth, scale/rotation, connectors, step order, landing, hold |
| Actual viewing window | Where is the object on-screen while it visibly moves? |
| Safety and validation | Responsive/reverse/idle/focus performance, intermediate screenshots, normal user scroll |

### L1–L4 motion vocabulary (purpose, NOT a pixel quota)

| Level | Job | Techniques | Use for |
| --- | --- | --- | --- |
| **L1 — Microinteraction** | Confirm a small action | Press/hover/selection/feedback | Buttons, switch, navigation, forms |
| **L2 — Editorial reveal** | Support reading/hierarchy | Measured text/card rise, simple reveal, modest stagger | Paragraphs, FAQ, secondary content |
| **L3 — Narrative choreography** | Explain sequence, dependency, contrast | Distinct side flights, 3D, parent-child staging, arrows after source | Workflows, diagrams, comparison cards |
| **L4 — Cinematic scene** | Give a major hero/product chapter a spatial story | Multi-layer composition, directed perspective, coordinated transitions | Hero, product demo, major chapter transition **when requested and warranted** |

Levels encode **meaning and perceptual intention**, not hard minimum
translation distance. A 180px flight may still look like L1 if all travel
occurs at near-zero opacity or outside the viewing window. An expressive
L3 can use restrained geometry if it clearly communicates causal order.
High motion is not automatically good design.

### Reject the default microanimation when inappropriate

- If the user explicitly requests **expressive, dramatic, large-travel,
  cinematic, impressive or Apple-like product storytelling** and the
  content supports L3/L4, generic opacity + tiny upward translation
  is **not an acceptable primary deliverable**. It can remain a
  supporting effect for explanatory copy.
- To choose L1/L2 instead, name a **concrete reason** such as a text-heavy
  paragraph, focusable form, reduced-motion mode, limited visual space
  or real performance limitation. Do not merely say "professional".
- **Professional restraint means purposeful movement, not small movement.**
- When the user gives no motion ambition, choose by semantic meaning
  and page tone, not a universal fade preset. Do not inflate all elements
  to L4 without justification.

## Gate 2 — map narrative relationships to motion

| Content | Story | Choreography candidate |
| --- | --- | --- |
| A → B → C → D | Causal order | A settles → connector → B → connector → C → D |
| Traditional vs new workflow | Visual contrast between processes | Different incoming directions and rhythm; readable comparative ending |
| Organization hierarchy | Source causes branches | Parent → connecting lines → department nodes |
| Reference card with 7 facts | Parent gives context to facts | Parent frame → visible-row child facts |
| Hero/chapter title | Reading flow | Falling graphemes or masked words, original accessible title |
| FAQ/actions | Practical use, not spectacle | Restrained list reveals; controls remain visible and focusable |
| Decoration | Atmosphere | Optional depth, not motion for its own sake |

**Parent-child gate:** When a visual parent contains many meaningful
items, explicitly inspect whether those items need their **own animation
layer**. Decide between sequential children, real grid rows or grouped
clusters. Do not stop at an outer card fade. Do not independently animate
glass filter/tint/rim layers. Initialize all scheduled children, preserve
document flow and focusability, and reuse the existing reversible/idle
controller rather than spawning many timers.

**Mobile gate:** Real layout decides grouping. When a desktop comparison
stacks vertically, use row/step triggers that keep offscreen children
waiting. Do not allow the entering second column to fast-forward five
steps outside the viewport.

**No chaos:** Larger flight does not authorize arbitrary randomization,
persistent floating, text collisions, fake scroll, or hidden controls.

## Gate 3 — prove PERCEIVED amplitude, not numeric amplitude

A person perceives motion only when the object has enough **visibility,
contrast and time within the real viewport**. Check:

1. **Early visibility:** Is the object almost fully transparent during
   most of its physical displacement?
2. **Physical viewing range:** Does it travel while its rect intersects
   the screen, not entirely before or after?
3. **Scrub geometry:** With scrub mode, timeline durations describe
   *relative proportions*; ScrollTrigger start/end distance determines
   how much user scroll produces that movement.
4. **Sequencing:** Can a viewer distinguish A, then B, then C? Are icons
   and text visible *after* the respective parent/step?
5. **Idle completion:** Visible content must finish without scrolling,
   but completing five expressive steps in 0.5 seconds may look like
   a single flash. Choose a **bounded scene-specific completion time**
   that preserves the story while respecting reading and accessibility.
6. **Reverse:** Does the timeline rewind smoothly from the frame the
   person last saw, even after idle completion?
7. **Geometry:** Does perspective movement widen scrollWidth, overlap
   neighbors or detach from a glass card's true bounds?
8. **Mobile:** Shorten travel when necessary, but don't silently degrade
   a justified L3 to an invisible L1. Inspect actual phone captures.

Inspect **0/20/45/70/100%** intermediate timeline states *and* record
normal wheel/touch scrolling, pause and reverse at realistic speed.
Manually seeking a GSAP timeline proves transform math, **not**
perceptual quality during natural interaction.

Avoid arbitrary translation minimums. A real halfway screenshot or
video is stronger evidence than stating that X starts at 175px.

## Gate 4 — independent engineering AND artistic acceptance

### Engineering (binary safety gate)

- Layout, content, locale, theme and page access remain correct.
- No JS failures, overflow, clipped text, page bottom padding hacks,
  broken links, FAQ/keyboard problems or illegible glass layers.
- Scrub, reverse, idle finish, no-GSAP, reduced motion and mobile
  fallback work; scene lifecycle cleans up correctly.
- No new heavy rendering dependencies or custom scroll hijacking
  unless specifically authorized.

### Visual motion (separate, judgment-based gate)

Review the **original brief beside the live preview**:

- **Semantic fit:** Does the movement explain the actual content?
- **Perceived ambition:** Can visitors SEE the requested L3/L4 motion
  in normal scrolling, not just the source code?
- **Sequence clarity:** Does the order visibly communicate cause/effect?
- **Spatial craft:** Direction, depth, rotation, landing, easing and
  visual hold work together without generic SaaS-template motion?
- **Compositional hierarchy:** One focal action, calmer supporting
  elements, no movement competing with critical controls.
- **Parent and children:** Subitems move for a purpose, and their
  timelines do not compound into chaotic simultaneous travel.
- **UX:** Works in both directions, under idle completion, on a phone,
  and under keyboard/focus interaction.

If L3/L4 was requested and the browser looks like a generic little
fade, report **VISUAL NOT ACCEPTED** even if the automated tests pass.
Revise story, entry visibility, scroll window, timing and hierarchy
before declaring completion. Technical PASS is not visual approval.

No automated score or scripted check can certify originality or
Awwwards-level quality. If user approval is required, provide an
isolated live preview first; production change needs explicit approval.

### Minimal internal storyboard template — never inject into the website

Scene: Traditional process vs EAO process
Meaning: two contrasting methods, each five ordered steps
Level: L3 — causal sequence must be visible
Parent: two columns; each child step then icon and text
Design: opposing directions, distinct visual rhythm, coherent landing
Window: natural wheel/touch with readable bounded idle completion
Fallback: no-GSAP/reduced-motion static content
Engineering evidence: desktop/tablet/phone, two themes/locales, reverse
Visual evidence: normal-speed entry plus 20/45/70/100% frames
Status: engineering PASS / visual PENDING HUMAN REVIEW

This storyboard is an **implementation artifact**, not public-site text.

## EAO field lesson (case-specific, not a universal preset)

1. A common small rise/fade passed automated tests but looked generic.
2. Increasing card translation/3D **alone** did not create causality.
3. Explicit process ordering and parent-child item reveals fixed meaning.
4. Even 175px side flights may look like a flash if their five steps
   are compressed into an overly fast idle finish.
5. Subsequent iterations considered normal-scroll visibility, stop
   behavior, mobile stacking and genuinely observable interim states.

See [EAO choreography](eao-story-choreography.md),
[motion grammar](MOTION-GRAMMAR.md),
[implementation](IMPLEMENTATION.md) and
[acceptance checklist](ACCEPTANCE.md).
