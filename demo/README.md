# Licat / Bidirectional Flying Card Entrances

Isolated experiment in /demo/; production homepage is unchanged.

GSAP ScrollTrigger now maps each card row's progress directly to scroll position.
Scrolling downward flies cards from distinct viewport edges into the original
Bento grid; scrolling upward retraces the exact path. Downward repeats it.
The second card in desktop rows is staggered; mobile has one card per row.

No pin, scroll-lock, delayed scrub, Flip, layout mutation, or once-only logic.
This is reversible scroll-position control, not a wheel event listener.
Each row has a short scroll range and uses transform/opacity only. GSAP
invalidateOnRefresh recomputes offsets on resize. Reduced motion is static.
