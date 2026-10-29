# Original Rainy Window Background — isolated EAO demo

- Source: user-uploaded Realistic Living Rainy Window Generator ZIP,
  original demo: https://codepen.io/fyildiz1974/pen/RNRgjpj
- raindrops.js: copied WITHOUT changing the original engine from the
  external background-script URL referenced by the uploaded demo:
  https://fyildiz1974.github.io/web/files/raindrops.js
- It is self-booting WebGL with built-in PNG droplet maps and dark
  city-reflection JPEG; this is the real effect, not a CSS clone.
- index.html: isolated background-only runtime with original canvas and
  mix-blend-mode:screen;opacity:.7 (default rain intensity in original demo).
- frame-fallback.webp: pre-rendered still from the exact original engine
  for unsupported WebGL, reduced-motion and reduced-transparency modes.
- The surrounding EAO page embeds this via a non-interactive same-origin
  iframe to prevent vendor event handlers from altering application UI.
  Pointer events are disabled, so original mouse parallax is not applied.

No rain controls, geolocation, weather, HUD, video, external API, rain sounds,
font files, or third-party runtime requests. Original source engine DOES
contain continuous animation; do not claim static-background performance.
The original Demo's MIT license notice is preserved in LICENSE.txt.


## Active EAO /eao/demo/ background (performance mode)

Since 2026-10-10, EAO demo pages do not embed this WebGL runtime.
They display frame-fallback.webp directly through a fixed, decorative
CSS background layer. This stops both original requestAnimationFrame loops,
avoids WebGL contexts, and removes the nested iframe entirely. The original
WebGL files are retained here as archived reference/rollback material and
are not fetched by normal demo page loads. To see the original moving demo,
open this asset folder's index.html explicitly; it is NOT in the EAO page.
