# Licat GSAP Motion Lab — Scroll-paced scenes

Only /demo/ changes; original / and /zh/ /en/ remain unchanged.

Pacing inspired by studying Apple product pages and GSAP official ScrollTrigger
guidance. **Not** a copy of Apple's private animation system.

Reversible scroll choreography with no pin, scroll lock or delayed scrub:

- Section headings: ~0.54–0.57 viewport-height travel (around 486–513px
  on a 900px screen). SplitText uses masked, staggered character transforms.
- Project cards: 0.67–0.70 viewport-height travel (about 600–630px on 900px),
  starting with card top in the visible lower viewport.
  Flight (68 timeline units) → precision settling (22) → held final frame
  (15% of full scroll range), still completely reversible.
- Journey milestones: ~0.45–0.46 viewport-height travel.
- Principles: ~0.55–0.59 viewport-height travel.
- Footer: shorter ~0.17 viewport-height travel, with a completed final state.
- Section titles, milestones, principles and footer also hold their final
  arrangement for the last 15% of their scroll ranges.

A modest amount of *footer-internal* bottom breathing room gives the final
principles enough natural scroll distance to complete on desktop and mobile.
This is not a separate spacer section and does not fix/pin any content.
All scene boundaries are clamped to real maximum scroll distance. CSS grid
geometry never changes, and reduced-motion keeps all content static.
