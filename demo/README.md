# Licat / Reversible GSAP Motion Lab

An experiment isolated to /demo/. The original homepages are unchanged.

All scroll-driven entrances remain reversible using GSAP ScrollTrigger with
scrub:true (no catch-up delay), no pin or scroll lock.

**Viewport choreography:**
- Section titles wait until their top is around 73% of viewport height, then
  spread character-mask motion through the middle of the screen.
- Journey and Principles begin around 72%, not at 93% (barely entering).
- Less front-loaded easing makes the movement visible throughout the passage.
- Bottom-of-document ranges are clamped to the actual maximum scroll position,
  so the final Principles row finishes rather than remaining half folded.
- Footer has a shorter custom range (96% to 84%), since it has very little
  scroll room at the bottom; its small entrance remains bidirectional.
- Project cards keep the previously approved eight-direction reversible flight.

The page does not change layout, add spacer scroll sections, or force the user
to wait for animations. Responsive mobile breakpoints and reduced motion remain
supported. Hero stays a one-time page-load introduction by design.
