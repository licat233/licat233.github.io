# Licat Reversible Scroll + Idle Visibility Fallback

Only /demo/ is modified. Production homepage /en/ and /zh/ are unchanged.

Primary control: GSAP ScrollTrigger with scrub true. Scrolling down plays forward;
scrolling up reverses.

Fallback: one shared window.setTimeout reset on scroll. After 480ms idle,
visible incomplete scenes finish over 600ms. The anchor must actually be in
the viewport. Footer does not need to reach screen center.

Scenes: section headings, every project row, journey, principles and footer.
A timeout-settled scene is latched to its current scroll position. Subsequent
scroll maps to a new continuous path rather than jumping back to the old partial
scrub position. The latch resets after fully reversing and leaving the viewport.

At initial load the timeout also handles restored deep-link positions. Reduced
motion skips these effects and timers. Cleanups remove listeners and timers.
No new service, library, pinned scroll, or layout mutation.
