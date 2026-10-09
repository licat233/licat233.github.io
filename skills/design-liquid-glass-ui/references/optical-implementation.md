# Reproducing clear, rim-lit, moderately frosted Liquid Glass

This is a **portable browser approximation**, not the proprietary Apple-native
rendering engine. Match the source Demo's appearance using real composited
backgrounds, a single glass surface, edge light, moderate frost, and accessible
text. See `portfolio-case-study.md` for the observed tuning history.

## Structural invariant: ONE glass card, three passive layers

```html
<article class="glass-surface" aria-labelledby="glass-title">
  <span class="glass-filter" aria-hidden="true"></span>
  <span class="glass-tint" aria-hidden="true"></span>
  <span class="glass-specular" aria-hidden="true"></span>
  <div class="glass-content">
    <h3 id="glass-title">A glass panel</h3>
    <p>Readably sharp foreground text, never blurred with the background.</p>
    <a href="#detail">Details</a>
  </div>
</article>
```

The **same** surface must own border, border-radius, `position:relative`,
`overflow:hidden`, and the three absolutely positioned **direct children**.
All optical layers have `pointer-events:none`; semantic content is z >= 3.
Never nest a second visibly bordered glass panel inside a first one.

```css
:root {
  /* Case-tuned scenery-backed LIGHT example, not universal palette tokens. */
  --glass-tint: rgb(250 253 255 / .12);
  --glass-frost: blur(2.35px) saturate(125%) brightness(1.015);
  --glass-rim: rgb(255 255 255 / .86);
  --glass-ink: #263e4c;
  --glass-text-edge: rgb(255 255 255 / .9);
}
[data-theme="dark"] {
  --glass-tint: rgb(8 24 32 / .11);
  --glass-frost: blur(2.1px) saturate(127%);
  --glass-rim: rgb(231 244 251 / .4);
  --glass-ink: #f5f7fa;
  --glass-text-edge: rgb(0 12 20 / .88);
}
.glass-surface {
  position: relative; /* CRITICAL: anchor optical layers to this card */
  isolation: isolate;
  overflow: hidden;
  border-radius: 1.125rem;
  border: 1px solid var(--glass-rim);
  color: var(--glass-ink);
  background: transparent;
  box-shadow: 0 14px 27px rgb(22 52 67 / .17),
              inset 0 1px 0 rgb(255 255 255 / .72);
}
.glass-surface > .glass-filter,
.glass-surface > .glass-tint,
.glass-surface > .glass-specular {
  position: absolute;
  inset: 0;
  display: block;
  border-radius: inherit;
  pointer-events: none;
}
.glass-surface > .glass-filter {
  z-index: 0;
  -webkit-backdrop-filter: var(--glass-frost);
  backdrop-filter: var(--glass-frost);
}
.glass-surface > .glass-tint { z-index: 1; background: var(--glass-tint); }
.glass-surface > .glass-specular {
  z-index: 2;
  box-shadow:
    inset 1px 1px 1px rgb(255 255 255 / .97),
    inset -1px -1px 0 rgb(255 255 255 / .62),
    inset 5px 5px 11px -9px rgb(255 255 255 / .87),
    inset -5px -8px 15px -14px rgb(27 65 87 / .48);
}
[data-theme="dark"] .glass-surface > .glass-specular {
  box-shadow: inset 1px 1px 1px rgb(245 251 255 / .7),
              inset -1px -1px 0 rgb(204 227 236 / .26),
              inset -5px -8px 14px -13px rgb(0 10 18 / .55);
}
.glass-surface > .glass-content { position: relative; z-index: 3; padding: 1.25rem; }
.glass-content h3, .glass-content p {
  text-shadow: 0 1px 1px var(--glass-text-edge),
               0 0 2px var(--glass-text-edge);
}
```

Text-shadow is **only edge separation**, never a substitute for real WCAG
contrast on the composite bright/dark image. Use opaque or near-opaque content
material when changing scenery cannot provide adequate readability.

## Optional SVG edge distortion — not guaranteed background refraction

```html
<svg aria-hidden="true" width="0" height="0" focusable="false"
     xmlns="http://www.w3.org/2000/svg">
  <filter id="glass-card-lens" x="-6%" y="-10%" width="112%" height="120%"
          color-interpolation-filters="sRGB">
    <feGaussianBlur in="SourceAlpha" stdDeviation="50" result="softEdge"/>
    <feDisplacementMap in="SourceGraphic" in2="softEdge"
                       scale="32" xChannelSelector="A" yChannelSelector="A"/>
  </filter>
</svg>
```

Optionally apply `filter: url("#glass-card-lens")` **only to the optical
filter layer**, after testing browser output. Original reference Demo used
`scale=50`; the accepted large-card example used `scale=32` because
50 distorted corners excessively. Compact controls used an independent,
smaller lens. Unique SVG IDs per document are mandatory.

`backdrop-filter` composites sampled backdrop, but `filter:url(...)` can act
on the optical element rather than physically refract the background.
A changed screenshot pixel / non-`none` computed filter alone does not prove
background refraction. Describe the observed rim/blur effect accurately and
fall back to pure CSS if SVG is ineffective.

## Troubleshooting by symptom

| Appearance | First correction | Avoid |
| --- | --- | --- |
| White fog / plastic | Decrease large white overlay, blur and broad shine | Adding more white gradients |
| Too transparent / unreadable | Modestly raise neutral tint/blur, adjust text contrast, then tiny theme-aware shadow | Heavy text strokes / neon glow |
| Weak glass edge | Thin inner rim and coherent light direction | Fat opaque borders |
| Two nested glass frames | Fix containing block and duplicated borders | Another wrapper |
| Over-warped corners | Reduce/disable SVG displacement | Filtering whole card/text |
| Sluggish mobile cards | Disable expensive SVG on repeated cards, reduce blur coverage | Indiscriminate will-change |

Observed progression: 22% overlay + 4px blur looked foggy; 6.5% overlay +
1.3px blur looked too clear. A middle range (~12%, 2.35px light; ~11%, 2.1px
dark; ~1.8px mobile) was accepted **for one specific scenic page**. Always tune
against actual content/background, never universalize these numbers.

## Mobile and accessible fallback

```css
@media (max-width: 760px) {
  .glass-surface > .glass-filter {
    filter: none; /* repeated SVG refraction too expensive */
    -webkit-backdrop-filter: blur(1.8px) saturate(125%);
    backdrop-filter: blur(1.8px) saturate(125%);
  }
}
@supports not ((-webkit-backdrop-filter: blur(1px)) or
               (backdrop-filter: blur(1px))) {
  .glass-surface > .glass-filter { filter: none; }
  .glass-surface > .glass-tint { background: rgb(245 249 252 / .96); }
  [data-theme="dark"] .glass-surface > .glass-tint { background: #202d35; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .glass-surface > .glass-filter {
    filter: none; -webkit-backdrop-filter: none; backdrop-filter: none;
  }
  .glass-surface > .glass-tint { background: #f5f9fc; }
  [data-theme="dark"] .glass-surface > .glass-tint { background: #202d35; }
  .glass-content h3, .glass-content p { text-shadow: none; }
}
@media (forced-colors: active) {
  .glass-surface {
    color: CanvasText; background: Canvas;
    border: 1px solid CanvasText; box-shadow: none;
  }
  .glass-surface > .glass-filter,
  .glass-surface > .glass-tint,
  .glass-surface > .glass-specular { display: none; }
  .glass-content h3, .glass-content p { text-shadow: none; }
}
```

Reduced-transparency support varies by browser. Passing Chrome simulation does
not establish real-device iOS Safari compatibility.

## One fixed scenic photo beneath all sections

```css
body { position: relative; isolation: isolate; background: #d9e5e9; }
body::before {
  content: "";
  position: fixed;
  inset: 0;
  height: 100vh; /* fallback */
  height: 100svh; /* stable mobile viewport */
  z-index: 0;
  pointer-events: none;
  background:
    linear-gradient(rgb(230 240 245 / .30), rgb(227 237 242 / .29)),
    url("/assets/existing-hero.webp") 58% center / cover no-repeat;
}
body > main, body > footer { position: relative; z-index: 1; }
[data-theme="dark"] body::before {
  background:
    linear-gradient(rgb(8 17 24 / .68), rgb(8 19 27 / .70)),
    url("/assets/existing-hero.webp") 58% center / cover no-repeat;
}
```

Reuse **one existing, optimized, appropriately licensed** background image,
rather than loading a giant new bitmap. Check transfer and decode costs;
WebP and CSS backgrounds are not free. A fixed pseudo-layer is generally more
reliable on iOS than `background-attachment:fixed`, **but test actual Safari**.
Make sections translucent, retaining local scrims where text needs contrast.
Remove a duplicated Hero photo only after preserving accessibility/animation.
Prove stability by hiding content **without collapsing document height** and
comparing same-viewport background pixels before and after scrolling.

## Critical 2026 bug: timeline looks like two nested glass cards

The milestone timeline owns its connecting line and numbered dot. The inner
`.phase-glass` owns exactly one visible border and MUST be `position:relative`.
The actual bug came from its three absolutely positioned optical layers anchoring
to outer `.phase`, creating a false second rounded frame.

Do not rewrite the markup to fix a missing containing block. Compare each
layer's `getBoundingClientRect()` against the glass surface's **padding box**
(typically border inset by 1px), and verify one rim and correct dot placement.
Likewise, a general rule such as `.principle > * {position:relative}` may
override the absolute icon/number positioning: inspect computed geometry.

For the full sequence, browser acceptance matrix and rollback practices, read
`references/portfolio-case-study.md`.
