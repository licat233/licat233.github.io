# EAO case study — animate the information, not random geometry

This is a **historical, preview-only case** from October 2026, not a
production implementation contract. The EAO demo animation was revised
after users found that noticeable motion lacked logical ordering.
Reference:
[a19c6c6](https://github.com/licat233/licat233.github.io/commit/a19c6c6ec5c8ad20de27c17beab79a78cb686752).
Inspect current source; do not copy the entire EAO controller or its selectors.

## Declare the narrative before creating a GSAP timeline

| Information | Invariant order | Appropriate choreography | Failure to avoid |
| --- | --- | --- | --- |
| A → B → C → D workflow | A, arrow, B, arrow, C, arrow, D | Explicit card-and-connector stages | Tiny simultaneous stagger |
| Organization hierarchy | Source node, branching connectors, department nodes, summary | Source first; dependent nodes by actual row | Five unrelated random flights |
| Section heading | Characters in reading order, falling from above | Negative-Y glyph descent, optional bounded 3D | One whole-title translation claiming to be char animation |
| Parent card + 7 facts | Carrier card, then subitems in grid reading order | Independent child timeline after parent establishes context | Only the frame animates, internal items pop all at once |
| About EAO / FAQ list | Heading then question items | Alternating side entrances, limited vertical shift | Hiding interactive summaries or cards overlapping while flying |

Large translations (e.g. 70–120px), rotation and scaling are suitable
**only where supported by composition**. More amplitude is not a
substitute for narrative order. Long reading paragraphs, navigation,
forms and focusable controls should not be unnecessarily hidden.

## Recipe A — explicit sequential flow

Build one timeline per **visible natural layout row**. Do not merely
apply the same stagger to unrelated cards. Stagger must leave time
for each card to become legible and its arrow to connect forward.

~~~js
function addOrderedSteps(tl, cards, compact) {
  cards.forEach((card, index) => {
    const at = index * 1.10; // relative timeline units, NOT seconds with scrub
    const dir = index % 2 ? 1 : -1;
    tl.fromTo(card, {
      x: compact ? 0 : dir * 66,
      y: compact ? 48 : 94,
      rotationY: compact ? 0 : dir * 12,
      scale: compact ? .95 : .87,
      autoAlpha: 0
    }, {
      x: 0, y: 0, rotationY: 0, scale: 1, autoAlpha: 1,
      duration: .82, ease: "power1.inOut"
    }, at);
    const arrow = card.nextElementSibling;
    if (arrow?.matches(".step-arrow") &&
        getComputedStyle(arrow).display !== "none") {
      tl.fromTo(arrow, { autoAlpha: 0, scale: .65 },
        { autoAlpha: 1, scale: 1, duration: .23 }, at + .84);
    }
  });
}
~~~

The timeline is an **example of sequencing**, not a full controller.
Wire it into the existing stable trigger, layout grouping,
gsap.matchMedia(), scene registration, reanchored scroll/idle
completion, cleanup, and readable error fallback from
[implementation](IMPLEMENTATION.md).

Actual responsive rows matter: wide desktop may be 4 in one row;
tablet may be 2+2; mobile is commonly four independent rows.
Group by *natural*, untransformed row coordinates with small
tolerance. Rebuild on breakpoint changes and do not animate an
offscreen row merely because the previous row entered. Connectors
must appear after their source and before the destination dominates.

**Sequence QA**: at timeline ~20/45/70/100%, capture card and
arrow opacity/transform, not only a settled screenshot. Verify
A → B → C → D and that the user can pause, reverse and replay without
a missing or half-invisible step. If the user pauses with an
incomplete *visible* row, shared idle completion must reveal it;
otherwise leave offscreen rows untouched.

## Recipe B — characters fall from TOP to DOWN

For Chinese use user-perceived graphemes (Intl.Segmenter where
available; Array.from is a limited fallback). For English keep word
wrappers (display:inline-block;white-space:nowrap), with spaces
as normal text nodes; do not break Western words across lines.

~~~js
// Once glyph wrappers are constructed, initialize EVERY glyph together.
gsap.set(chars, {
  y: -92, rotationX: -55,
  autoAlpha: 0, transformPerspective: 900
});
timeline.to(chars, {
  y: 0, rotationX: 0, autoAlpha: 1,
  duration: .62, ease: "power1.inOut",
  stagger: { each: Math.min(.04, .9 / Math.max(1, chars.length - 1)) }
});
~~~

This fixes a real EAO failure: staggering separate fromTo initializers
allowed later characters to flash before their turn.
Use visual glyph spans with aria-hidden, preserve a **single** full
accessible heading/label, restore the original text on context
teardown, and do not distort normal line wrapping after settle.
Test Chinese punctuation, long English headings and font loading.
Avoid making a long sentence into minutes of motion: bound total
stagger spread and skip the effect for reduced-motion.

## Recipe C — parent first, nested facts second

When a large glass card contains multiple facts, **two semantic
layers need two corresponding animations**:

- Parent/section establishes the glass frame with a stable layout.
- Inner facts enter by actual grid-row and DOM reading order; use
  small child movement after the parent is legible.
- Do not animate optical filter, tint or rim as separate layout
  containers; child and parent transforms *compose*.
- Child scenes need their own visible-area/idle completion; a card
  must not sit half-empty if the user stops scrolling.
- Preserve text, links, focus and layout; do not use FLIP/fake
  absolute cards to fake a reveal.

## Real regressions to check

1. Large horizontal PLUS vertical FAQ flight overlapped readable
   questions mid-animation. Prefer one clear direction; keep
   interactive summary controls at least partially visible/focusable.
2. Perspective/rotation expanded document scrollWidth at 1280px
   even when CSS Grid had not changed. Cap X travel based on
   *viewport edge including rotated-card margin*, then use
   overflow-x:clip on the **appropriate section**, not globally.
3. Existing mobile SVG rule hid the newly converted HTML diagram.
   Scope responsive visibility changes to the new component.
4. A timeline can have progress=1 while content is below viewport.
   Verify physical rects and footer at max scroll, not progress only.
5. Per-child and per-row scenes add timers/listeners if copied
   carelessly. Use the **existing single debounced idle fallback**
   and clean every GSAP context upon breakpoint/route change.

## Acceptance: mechanics AND human experience

- Browser matrix at 1440×900, 1280×720, 820×1180, 390×844 and
  375×667; supported locales/themes.
- Check intermediate 20/45/70/100% frames for card and arrow order.
- Check glyph initial invisibility without flash and final heading
  wrapping/accessible name.
- Check parent/child staging, idle for partly visible subitems, smooth
  reverse and re-entry, no changed document height, 0 horizontal
  overflow or text clipping.
- Block GSAP/CDN, emulate reduced motion, test keyboard/FAQ clicks
  and the Footer: content must remain readable.
- Confirm actual live JS/CSS versions, not merely a passing commit
  or old HTTP 200.
- Report Safari, frame-rate and GPU limits honestly. Historical
  EAO matrix checks were reported 30/30, but **the user rejected
  earlier aesthetic results despite those tests**. Automated
  layout QA is not human approval.

See [motion grammar](MOTION-GRAMMAR.md),
[implementation](IMPLEMENTATION.md), [failure modes](FAILURE-MODES.md),
[acceptance](ACCEPTANCE.md) and
[glass diagram case](../../design-liquid-glass-ui/references/eao-native-diagrams.md).
