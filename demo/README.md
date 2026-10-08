# Licat — GSAP reversible motion, visibility-bound pacing

Scope: /demo/ only. Production /zh/ and /en/ are not modified.

Fix for the long-travel and false-scroll-height regressions:

A scroll trigger reaching 100% by maxScroll is not enough. The content must
settle WHILE IT IS IN THE VIEWPORT, instead of after it crosses the sticky
header. This demo ties each entrance's start/end to the element's natural
(untransformed) top position.

- Section headings: begin near 87% viewport height, settle near 47%.
- Projects: retain eight distinct offscreen directional flights. Begin around
  89-90% viewport height, settle near 37-38%.
- Journey milestones: begin near 88%, settle near 44%.
- Principles: begin near 89%, settle near 42-43%.
- For bottom-origin flights, cap the offscreen displacement to the stable
  document body height. Previously the last project inflated scrollHeight by
  145px on a tall tablet viewport, so ScrollTrigger computed a false maximum
  and failed to complete the last Principles animation.
- The footer uses its own short visible range.
- The last 15% of each scrub timeline holds the finished state; scrolling
  upward reverses the same path.
- Modest footer-internal breathing room (~8–10rem instead of >14rem) suffices
  for the last section. No pin, scroll lock, external dependencies, or layout
  changes to the original Bento cards.

At a 900px viewport, project flights now span ~477px, not ~630px. This is
intentional: a longer duration with no pin or extended physical section can
make the animation invisible or hide finished content beneath the nav.

Responsive breakpoints, keyboard-accessible content and reduced-motion behavior
are preserved. Validate target visibility at both start and end, not only
ScrollTrigger's progress=1 and total page scroll reachability.
