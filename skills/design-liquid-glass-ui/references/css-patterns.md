# Minimal native-CSS implementation patterns

**Which recipe?** The starter below is a **functional, restrained translucent**
glass control/content pattern, not the accepted
scenery-backed optical glass from the October 2026 portfolio. For the
visually reproduced clear/frosty specular layer, fixed scenic background,
SVG filter limits and per-layer positioning, use
`references/optical-implementation.md` first. Do not reuse a 16px blur
and ~.6 white film indiscriminately on a scenic card: that produced white fog
in the real iteration. Match the environment, component role and browser.


The following examples are **schematic**, not mandatory names, brand colours, or
permission to append another override to an existing site. First find the active
source of truth and semantic tokens; modify the right rules in place.
Prefer *one* token layer per theme. Avoid repeated permanent override stages.

## Material tokens, decoupled from brand

\`\`\`css
:root {
  /* Site owns --site-accent, --site-bg, --site-ink: supply from approved palette. */
  --glass-fill-subtle: rgb(255 255 255 / .14);
  --glass-fill-control: rgb(255 255 255 / .22);
  --glass-fill-emphasized: rgb(255 255 255 / .30);
  --glass-rim: rgb(255 255 255 / .75);
  --glass-rim-shadow: rgb(49 79 118 / .16);
  --glass-bevel: rgb(255 255 255 / .92);
  --glass-elevation: 0 14px 35px rgb(30 58 95 / .13);
  --glass-focus: #136f75; /* example only: check against local backgrounds */
  --glass-frost: blur(8px) saturate(125%);
  --glass-motion: 220ms cubic-bezier(.16, 1, .3, 1);
}
[data-theme="dark"] {
  --glass-fill-subtle: rgb(24 38 55 / .21);
  --glass-fill-control: rgb(27 43 60 / .29);
  --glass-fill-emphasized: rgb(34 50 68 / .38);
  --glass-rim: rgb(225 243 255 / .19);
  --glass-rim-shadow: rgb(0 0 0 / .35);
  --glass-bevel: rgb(238 252 255 / .21);
  --glass-elevation: 0 18px 45px rgb(0 0 0 / .32);
}
\`\`\`

These are **starting values**, not universal accessibility-approved colours.
A high-emphasis, small action button can have a deliberately stronger semantic
colour; this is distinct from making existing glass content cards opaque as
a "readability fix". Foreground ink, not whitened glass, is the first lever.

## Foreground-first legibility correction (material unchanged)

When existing glass text is washed out, patch `color` and typography
using approved theme-aware ink tokens, **not a new white glass background**.
The same surface opacity, rim and blur must remain computed-identical before
and after a text-only fix. See
[contrast-first glass](contrast-first-glass.md).

```css
.glass-content { color: var(--glass-ink); }
.glass-content :is(p, li, .muted) { color: var(--glass-muted-ink); }
/* Set/test --glass-ink and --glass-muted-ink against actual composites
   in every supported theme, image and scroll state. */
```

## Ambient environment, separate from surface

\`\`\`css
.site-hero {
  background:
    radial-gradient(ellipse at 82% 28%, rgb(175 208 238 / .42), transparent 72%),
    radial-gradient(ellipse at 7% 69%, rgb(249 220 194 / .30), transparent 70%),
    var(--site-bg); /* approved palette role */
}
\`\`\`

Why: colour beneath a translucent surface gives the eye evidence of depth.
Do not create glowing blobs on every section or a constant blue–purple gradient.

## Interactive glass and a quieter content panel

\`\`\`css
.ui-glass-control {
  position: relative;
  background:
    linear-gradient(140deg, rgb(255 255 255 / .22), transparent 56%),
    var(--glass-fill-control);
  border: 1px solid var(--glass-rim);
  border-radius: .75rem;
  box-shadow:
    var(--glass-elevation),
    inset 0 1px 0 var(--glass-bevel),
    inset 0 -1px 0 var(--glass-rim-shadow);
  -webkit-backdrop-filter: var(--glass-frost);
  backdrop-filter: var(--glass-frost);
  transition: background var(--glass-motion), box-shadow var(--glass-motion);
}
.ui-glass-control:hover {
  background: var(--glass-fill-emphasized);
}
.ui-glass-control:focus-visible {
  outline: 3px solid var(--glass-focus);
  outline-offset: 3px;
}
.ui-content-panel {
  /* Intentionally stronger and less filtered than the glass controls. */
  background: var(--glass-fill-emphasized);
  border: 1px solid var(--glass-rim);
  box-shadow: var(--glass-elevation), inset 0 1px 0 var(--glass-bevel);
}
\`\`\`

Re-use native grid/flex positioning. A pseudo-element for a rim must be
\`pointer-events:none\`, visually below text, and must not introduce opacity,
filter or transform to the text/screenshot itself.

## Current-language segmented control

The state represents **where the user is**, not the target of a navigation link:

\`\`\`html
<nav aria-label="Language">
  <span class="locale-current" lang="en" aria-current="page">EN</span>
  <a href="/zh/" lang="zh-CN" hreflang="zh-CN">中文</a>
</nav>
\`\`\`

For the Chinese page, reverse which element is current, but keep the visual
sequence EN / 中文. Current element must remain visible on narrow screens.

\`\`\`css
.locale-current {
  color: var(--site-ink);
  background: var(--glass-fill-emphasized);
  border: 1px solid var(--glass-rim);
  box-shadow: inset 0 1px 0 var(--glass-bevel);
}
\`\`\`

Test both real navigation directions; CSS appearance can contradict correct
HTML when the old \`.lang\` receives accent colour and \`.lang-current\` grey.

## Graceful degradation

\`\`\`css
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  /* Blur-free glass stays translucent in normal mode; test real contrast. */
  .ui-glass-control { background: var(--glass-fill-control); }
  [data-theme="dark"] .ui-glass-control { background: var(--glass-fill-control); }
}
@media (prefers-reduced-motion: reduce) {
  .ui-glass-control { transition: none; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  /* Explicit user accessibility preference, NOT the default glass look. */
  .ui-glass-control { -webkit-backdrop-filter: none; backdrop-filter: none; }
  .ui-glass-control { background: #fff; }
  [data-theme="dark"] .ui-glass-control { background: #26394c; }
}
@media (forced-colors: active) {
  .ui-glass-control {
    background: Canvas;
    border: 1px solid CanvasText;
    box-shadow: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}
\`\`\`

Notes:
- \`prefers-reduced-transparency\` is not supported everywhere; fallback is
  intentionally independent of this media query.
- In **normal glass mode**, first repair headings, paragraphs and muted
  text using foreground ink tokens; do not add an opaque white card fill.
- Only when a **contrast/reduced-transparency preference explicitly requests**
  reduced transparency, disable both blur and translucent material for that
  preference scope. This is an accessibility exception, not a visual shortcut.
- On small GPUs, prioritize nav blur and turn off backdrop sampling on many
  repeated content cards. Do not add permanent \`will-change\` hints indiscriminately.
- For CSS/JS changes on static sites, bump versioned asset URL query strings
  only when needed. Do not turn off site-wide caching.

## Safe code editing & smoke verification

1. Check remote HEAD and clean worktree. Use an isolated branch/worktree if
   other agents may edit simultaneously.
2. Patch current design tokens and component selectors in place. Never blindly
   concatenate dozens of one-off override blocks.
3. Keep baseline markup/copy/assets unchanged unless scoped otherwise. Assert
   no unexpected changes to images, text, scripts or pages.
4. Check syntax, render browser snapshots, inspect fixed nav clearances and
   layout reflow, then look at light/dark and accessibility states.
5. Commit only scoped files. Fast-forward/reconcile remote without forced update;
   validate actual public deployment, asset version and component computed styles.

## Full control coverage and glass-inspired scrollbar

When every button should match the glass language, use semantic
control material roles, NOT one alpha pasted onto every control.
CTA, nav selection, icon-only, language/theme, menu, dialog and
disabled/focus/hover states all need coverage and accessible labels.
Scrollbar thumb styling is platform-dependent and not true optical
refraction; keep the browser's scrolling mechanics intact.

Read [glass controls and scrollbar patterns](glass-controls-scrollbars.md)
for full CSS examples, limitations and test gates.
