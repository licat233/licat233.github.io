# Licat / Creative Entrance Lab

The experimental /demo/ pages preserve the original Bento grid and site content.
The production /en/ and /zh/ remain unchanged.

GSAP SplitText provides heading masks, MorphSVG drives the Hero ribbon,
and the projects use an eight-direction, off-viewport flying entrance:

NW / NE / SW / SE / W / E / N / S.

Each pair of cards (one card per mobile row) animates only as its row becomes
visible. Staggered flights land in final CSS grid cells. No GSAP Flip, layout
mutation, pin, scrub, scroll hijacking, permanent animation loop, or WebGL.
Animation is transform/opacity-only, cleared after landing, with responsive
and reduced-motion fallbacks.
