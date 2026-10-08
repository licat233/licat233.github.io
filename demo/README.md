# Licat / Entrance Motion Lab

This demo is intentionally isolated at /demo/. The original personal homepage remains unchanged.

Reference: GSAP 3.15 core, ScrollTrigger and official SplitText for masked heading reveal.
The Hero intro is retained from the original site, but all continuous mouse-follow,
tilt and scroll-scrub motion is removed in the experimental copy.

Entrance patterns:
- Section titles: staggered SplitText masked glyph reveal (reverted after entrance)
- Projects: distinct 3D lift, lateral slide, depth and scale entrances
- Journey: waypoint / dot arrivals
- Principles: subtle 3D spring-in
- Footer: low-distance rise

Each entrance runs once without locking scroll. Animation uses transforms and
opacity only; prefers-reduced-motion displays all content statically. No photos,
WebGL, Swiper, custom scroll drivers, or additional frameworks.
