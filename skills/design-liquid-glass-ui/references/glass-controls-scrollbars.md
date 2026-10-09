# Consistent glass buttons and glass-inspired native scrollbar

Use these rules when a user wants a *complete* glass treatment across
website controls. A button inventory is required; do not stop at the Hero
CTA or selected navigation pill. It is still wrong to make every button
identically transparent or to replace native browser scroll mechanics.

## Audit ALL controls, then design ONE material family

Inspect navigation and selection pills, primary and secondary CTA,
language/theme switches, icon-only buttons, menus, modal close controls,
carousel arrows, FAQ toggles, footer actions, busy/disabled states,
keyboard focus and mobile/touch targets.

| Role | Appearance | Safety |
| --- | --- | --- |
| Selected navigation / segmented pill | Clear, bright rim, relatively transparent | Current route and aria-current agree |
| Secondary or icon control | Neutral clear glass, gentle specular | Large enough target, label and visible focus |
| Primary CTA | Same optical family, stronger core tint / optionally solid backing | Text contrast and priority must be preserved |
| Destructive or warning | Same optical system with semantic accent | Do not signal status with colour alone |
| Disabled / busy | Material still recognizable | Native disabled/aria semantics and legibility |

**All buttons in the glass family** does not mean all share the same
opacity. Stronger opaque backing for important CTAs or alerts is
compatible with a coherent glass design. Never turn a non-action card
into a fake button merely to make it shine.

Each control owns ONE visually distinct border. If it already has a
glass stack, do not nest a second rim wrapper. Keep content and
focus outline crisp: optical layers may not intercept pointer events
or filter text/icons. Use theme-aware material tokens and restrained
hover/active/pressed states.

## Minimal semantic action CSS (illustrative, not universal)

~~~css
:root {
  --action-tint: rgb(255 255 255 / .16);
  --action-rim: rgb(255 255 255 / .78);
  --action-text: #17323b;
}
[data-theme="dark"] {
  --action-tint: rgb(12 32 43 / .34);
  --action-rim: rgb(237 248 255 / .38);
  --action-text: #f4f8fa;
}
.glass-action {
  position: relative;
  color: var(--action-text);
  border: 1px solid var(--action-rim);
  background: var(--action-tint);
  border-radius: .75rem;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .5),
              0 8px 20px rgb(22 45 60 / .10);
  -webkit-backdrop-filter: blur(5px) saturate(125%);
  backdrop-filter: blur(5px) saturate(125%);
  transition: background .18s, box-shadow .18s, transform .18s;
}
.glass-action:active { transform: translateY(1px); }
.glass-action:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
@supports not ((-webkit-backdrop-filter: blur(1px)) or
               (backdrop-filter: blur(1px))) {
  .glass-action { background: #edf4f6; }
  [data-theme="dark"] .glass-action { background: #26343c; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glass-action { -webkit-backdrop-filter: none; backdrop-filter: none; background: #edf4f6; }
  [data-theme="dark"] .glass-action { background: #26343c; }
}
@media (prefers-reduced-motion: reduce) {
  .glass-action { transition: none; }
  .glass-action:active { transform: none; }
}
@media (forced-colors: active) {
  .glass-action { background: ButtonFace; color: ButtonText; border: 1px solid ButtonText; box-shadow: none; }
}
~~~

Example alpha/blur values are starting points only. Buttons embedded
inside other glass material can sample a different backdrop than expected.
Check actual light/dark composite contrast, hit-target size, focus,
hover/active, reduced transparency, forced colours and theme state.

## Native scrollbar: glass *inspired*, not actual refractive glass

Browser/OS scrollbars are a platform-controlled UI affordance. macOS
and mobile frequently show **overlay scrollbars** that disappear when
idle. There is no reliable cross-browser way to put a 3-layer backdrop
filter, SVG lens and true refraction onto the scrollbar thumb.

Standard scrollbar-color/scrollbar-width are supported by some
engines; the non-standard WebKit-family ::-webkit-scrollbar selectors
are engine/OS-dependent, may be ignored for overlay scrollbars, and
standard properties may take precedence over the pseudo-element styles.
Do not claim universal Safari behavior without real Safari testing.

Prefer one transparent-looking colour theme around the **native**
scrollbar. Do not install a JS scroll-replacement library or hide the
native scrollbar just to imitate glass: it risks scrolling, keyboard,
touch, screen readers, accessibility and performance.

~~~css
:root {
  --scroll-thumb: rgb(118 154 165 / .55);
  --scroll-track: rgb(255 255 255 / .06);
}
[data-theme="dark"] {
  --scroll-thumb: rgb(193 211 225 / .55);
  --scroll-track: rgb(8 23 31 / .08);
}
html {
  scrollbar-width: thin;
  scrollbar-color: var(--scroll-thumb) var(--scroll-track);
}
html::-webkit-scrollbar { width: 11px; }
html::-webkit-scrollbar-track { background: var(--scroll-track); }
html::-webkit-scrollbar-thumb {
  border-radius: 999px;
  border: 2px solid transparent;
  background: var(--scroll-thumb);
  background-clip: padding-box;
}
@media (forced-colors: active) {
  html { scrollbar-width: auto; scrollbar-color: auto; }
}
~~~

This is *cosmetic fallback* rather than true Liquid Glass. Do not
apply backdrop-filter to scrollbar pseudo-elements and promise it
works. Default native rendering when styling is ignored is acceptable.

## Acceptance gates

- Button inventory covers every applicable control and interaction
  state in all supported languages, themes and viewport sizes.
- A single optical rim per button, clean text/icons and no pointer
  interception; primary CTA/warning text remains distinguishable.
- Native scrollbar remains usable with mouse, keyboard, trackpad and
  touch, including auto-hide/always-visible OS settings.
- Firefox, Chrome and actual Safari are reported separately; do not
  extrapolate from Chrome.
- Forced-colors, reduced motion/transparency, contrast, no-backdrop,
  focus indicators, horizontal overflow, gutter stability pass.
- Human visual approval and production deployment require separate
  authorization even when automated tests pass.

Related: [optical implementation](optical-implementation.md),
[material and colour](material-and-color.md), and
[CSS patterns](css-patterns.md).
