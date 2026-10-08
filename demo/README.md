# Licat Motion Study — GSAP Cursor-Tracking Preview

Scope: `/demo/` only. Production homepages `/zh/`, `/en/` and shared `/assets/` are unchanged.

Reference implementation:
- GSAP Demo Hub: https://demos.gsap.com/demo/cursor-tracking-image-preview/
- Official GreenSock CodePen source: https://codepen.io/GreenSock/pen/PwqrzeG
- GSAP quickTo reference: https://gsap.com/docs/v3/GSAP/gsap.quickTo/

The demo uses the official per-item quickTo + paused fade pattern.
It does not install another framework, pin scroll, force scroll smoothing, or use 3D/WebGL effects.

- Desktop with a fine pointer: hovering a project row shows a screenshot following the pointer.
- Touch or reduced-motion: screenshots remain in normal document flow with no pointer animation.
- All project titles, destinations, and primary descriptions come from the existing portfolio.
- 16 screenshots in `previews/` were captured from public pages already hosted by this GitHub Pages site, in zh/en where available.
- GSAP and Open Props come from the site's existing shared resources; the new script/style stay inside `demo/`.
- If JavaScript or GSAP fails, the projects and static previews remain readable.

Keep screenshots current when project websites change. The demo is deliberately not linked from the production homepage.
