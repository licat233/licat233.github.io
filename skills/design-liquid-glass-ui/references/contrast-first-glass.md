# Contrast-first readability without destroying Liquid Glass

**Primary invariant:** When glass content is hard to read, **change the ink, not the
glass** (文字不好读，先改文字颜色，不要把玻璃刷成白色). A glass
material already approved for an existing site is a protected design constraint.
Poor contrast is a typography/compositing bug, **not permission** to convert
the transparent card into an opaque white, grey, or coloured block.

This rule applies to navigation, information cards, text-heavy panels, diagrams
and optical-layer content. It also applies to "quick fixes" carried out by agents
after a screenshot review. Treat opacity/blur/edge geometry as independent
variables; do not silently mutate them in a text-only repair.

## Diagnose in the correct order

1. **Capture the actual failure.** Inspect the real page, language, theme,
   responsive size, scroll position, hover/focus state and the actual background
   showing *through the card*. Confirm CSS inheritance, active selectors,
   pseudo-overlays, and whether text is rendered above the optical stack.
2. **Change foreground colour first.** Use a theme- and context-aware ink token
   (for example `--glass-ink`, `--glass-muted-ink`, `--glass-ink-on-photo`).
   Darken light-theme copy or lighten dark-theme copy as needed. Muted text must
   still be readable; do not inherit a low-opacity `color` or parent `opacity`.
   Adjust links, labels, paragraphs, list items, icons and interactive states.
3. **Validate the composite, not one HEX pair.** Sample the brightest and
   darkest *actually reachable* backdrop regions under the transparent card;
   inspect after scroll, themes and scene changes. Aim for WCAG 2.2 AA 4.5:1
   normal text / 3:1 large text, and 3:1 for essential non-text boundaries,
   subject to the applicable success criterion. Evaluate computed opacity and
   the full composited backdrop; an opaque token-pair calculator alone does
   not establish contrast on glass.
4. **Adjust typography when warranted.** Increase weight, legible font size or
   line-height, or improve separation of body/secondary text. A tiny
   *opposite-polarity* text-edge shadow may help with textured scenery, but
   keep it crisp and local. Shadow/stroke is never evidence of WCAG contrast.
5. **Preserve optics.** Glass overlay alpha, blur, rim, refraction, shadows,
   and component background must stay unchanged for a text-only fix. Compare
   their computed styles/screenshot pixels before and after.
6. **Escalate transparently if a single colour cannot work.** When backgrounds
   range from very bright to very dark under the same text, no fixed foreground
   colour may achieve contrast everywhere. Prefer a user-approved steadier
   *page environment* or separate theme/region-aware text treatments; explain
   the trade-off instead of silently inserting a solid white card.
7. **Accessibility is an explicit exception, not the default.**
   `prefers-reduced-transparency: reduce`, `prefers-contrast: more`, and
   `forced-colors: active` may legitimately request a solid system or
   accessible fallback. Scope that to the preference or explicit user decision;
   do not let its solid fill leak into the normal glass theme.

## Prohibited "readability fixes" in the default glass mode

- `background: white`, `#fff`, or a near-opaque white alpha on the whole
  card merely because text looks washed out.
- Raising a transparent card to an opaque coloured tile or applying a broad
  frosted white `::before` behind all its text.
- Blurring screenshots, filtering the content layer, lowering parent `opacity`
  or adding white/black full-area text containers without design approval.
- Invoking "accessibility" without measuring composite contrast, or asserting
  a shadow alone satisfies contrast.

## Portable CSS pattern: ink-only correction

```css
/* Demonstration only: choose and TEST colours against your site. */
.glass-surface {
  --glass-ink: #172b38;
  --glass-muted-ink: #405566;
  /* Existing approved transparent material is deliberately untouched. */
}
[data-theme="dark"] .glass-surface {
  --glass-ink: #edf5fb;
  --glass-muted-ink: #d2e0ec;
}
.glass-surface .glass-content {
  color: var(--glass-ink);
  position: relative;
  z-index: 3;
}
.glass-surface .glass-content :is(p, li, small, .muted) {
  color: var(--glass-muted-ink);
}
/* Optional edge separation, NOT contrast conformance. */
.glass-surface .glass-content.glass-content--textured p {
  text-shadow: 0 1px 0 rgb(255 255 255 / .24);
}
[data-theme="dark"] .glass-surface .glass-content.glass-content--textured p {
  text-shadow: 0 1px 0 rgb(0 0 0 / .28);
}
```

Do not paste these HEX values as an official palette. Sample the
existing environment, then test each relevant text class and state.

## Unified page environment without section-by-section background blocks

A single page environment gives the eye one consistent backdrop to sample
through glass. If the user requests **one continuous background**, keep
`body` (or one dedicated global fixed/scrolling layer) as the background
owner. Sections are transparent layout regions; **cards and controls retain
their independent materials**. Do not blindly clear card
`background` or every `::before`/ `::after`: some are optical rims,
meaningful watermarks, arrows or diagrams.

```css
/* Schematic: gradients stand in for a licensed asset if none exists. */
body.eao-v2 {
  background: linear-gradient(130deg, #fafbfd, #e7f1f9);
  background-attachment: fixed;
}
body.eao-v2 :is(.hero, main > section, footer) {
  background: transparent;
  background-image: none;
}
@media (max-width: 700px) {
  body.eao-v2 { background-attachment: scroll; }
}
```

Audit *actual selector specificity and stylesheet load order*; don't assume
the sample selector wins over an older theme rule. Avoid piling up global
`!important` except a narrowly documented migration override.
Do not claim a CSS gradient is a downloadable background image.
On mobile, check Safari fixed-background behavior; where uncertain, use
one continuous scrolling gradient/image rather than a per-section replica.

## Readability & material-regression release gate

- Record baseline `background`, `background-color`, `backdrop-filter`,
  border, pseudo-overlay, opacity, and text colour for each glass component.
- For a text fix, **diff the computed text properties first** and assert
  optical material geometry/surface alpha did not change.
- Measure representative composite contrast in both themes, all locales,
  mobile and desktop, focus/hover/disabled and scrolled positions.
- Confirm no double rims, no white-fog panels, no coloured rectangle
  replacing a glass card, no missing content after scroll animation.
- Verify disabled CSS filter/reduced-transparency/forced-colors fallbacks
  **separately** from the normal look.
- Compare screenshots visually, and report browser/device limitations
  honestly. If the user has not approved a material redesign, stop and ask
  before one becomes necessary.

## EAO October 2026 evidence

The EAO Demo's rain-scene material looked glassy, but its high-complexity
scenery was not suitable for the production reading experience. Production
adopted reusable animations and selected glass components **without** the
Demo rain backdrop. A later revision moved coloured gradients from individual
chapters to one page-level environment. The glass panels still owned their
optical rims and text remained semantic. This demonstrates a key separation:
**environment**, **material**, **ink**, **motion**, and **layout** are distinct
design responsibilities. Updating one is not permission to overwrite another.

This describes historical implementation decisions, not proof about the
repository's current HEAD or a Safari performance guarantee.
