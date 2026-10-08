# Licat / Reversible GSAP Motion Lab

This experimental version modifies only /demo/. The original homepage and
shared assets are unchanged.

Every scroll-driven entrance is reversible using GSAP ScrollTrigger with
scrub:true (no catch-up delay), and no scroll lock or pin:

- Project cards: eight-direction flights, staggered within desktop rows.
- Section headings: persistent GSAP SplitText character masks, staggered 3D
  reveals; the split is reverted only when the responsive animation context
  is destroyed, never on completion.
- Section kicker and notes: sliding reveal, returning along the same path.
- Journey milestones: directional wipes and spinning nodes.
- Principle cards: reversible 3D fold.
- Footer: compact staggered rise and unfold.

Each trigger is tied to a stable parent/header, not a moving card. Hero and
site-header load animation remain a one-time *page-load introduction* to avoid
conflicting with the site navigation. Theme controls and navigation are not
scroll-animated. Reduced motion bypasses all animation entirely.

At a fixed scroll position, the animation has a deterministic visual state.
