# EAO native glass diagrams — material hierarchy and SVG conversion

**Historical preview case (October 2026), not a production approval or a universal palette.**
Study the current source before copying anything. Reference commits:
[3cb4d4a](https://github.com/licat233/licat233.github.io/commit/3cb4d4afb114323ec4ca00f2586f7ac38cd3210c)
(neutral organization carrier) and
[c005a11](https://github.com/licat233/licat233.github.io/commit/c005a11c34b5641a9b66815cc2c87eb2336fcc64)
(knowledge diagram replacement). These changes were reviewed on the
isolated EAO /eao/demo/ route, not promoted to the production /eao/ page.

## Diagnose the *actual* paint source first

| Symptom | Wrong shortcut | Verified design direction |
| --- | --- | --- |
| Department workflow looks like a flat white SVG | Blur the image wrapper | Replace material-bearing nodes with independently translucent DOM cards |
| Large diagram background looks like an unrelated blue block | Increase blur or paint it white | Make the carrier almost colourless and let the common page ambience show through |
| Outer carrier plus inner cards look double-framed | Add another glowing border | Carrier has **weak or no rim**; inner cards own the clear optical borders |
| Summary looks like a beige/teal notice | Apply a coloured wash | Quiet neutral summary material with readable semantic text |
| Replacement diagram is missing on mobile | Hide original SVG and assume done | Audit legacy mobile display:none for infographic wrappers; unhide only the responsive replacement |

A painted, opaque SVG **loaded as an image** cannot turn into *several*
independently backdrop-sampling glass elements by styling its wrapper.
An SVG can absolutely be transparent and responsive in its own right:
**edit the SVG** when alpha/artwork is sufficient; convert the structure to
HTML/CSS only when distinct materials, live text, themes, per-node motion,
or mobile reflow make it worthwhile. Preserve SVG paths for icons/arrows.

## Three roles in one shared environment

1. **Ambient page**: one coherent light environment (subtle silver-blue,
   warm off-white, limited accent). Avoid independent coloured plates on
   every chapter. On desktop a fixed background can reinforce glass; on
   phones prefer the least expensive tested fallback. A fixed body
   pseudo-element and background-attachment:fixed are different strategies,
   each requiring real browser verification.
2. **Carrier**: large neutral reading canvas, almost no visible rim, cheap
   optional frost. **This is not a second full optical stack** around a
   collection of smaller glass cards. If nested backdrop-filter or isolation
   changes the inner glass sampling, remove the outer filter first.
3. **Nodes**: separate semantic cards (main organization node, five
   departments, four steps, navigation selection). Each has its own one
   positioned surface, three passive optical layers and readable content.
   Summary and dense text may use a quieter material.

EAO-preview example only: neutral carrier
rgb(255 255 255 / .045) and blur(1.5px) saturate(102%);
interior card blur about 5–6px, distinct dark-mode tokens and delicate
top-left bevel. These are not universal values and do **not** prove WCAG
contrast, Safari support, physical refraction or satisfactory GPU cost.
The strong blue-grey board was rejected despite automated layout tests.

## Minimal hierarchy pattern

~~~html
<section class="diagram-carrier" aria-labelledby="diagram-title">
  <h3 id="diagram-title">A reusable method</h3>
  <div class="diagram-grid">
    <article class="diagram-card">
      <span class="diagram-filter" aria-hidden="true"></span>
      <span class="diagram-tint" aria-hidden="true"></span>
      <span class="diagram-rim" aria-hidden="true"></span>
      <div class="diagram-content">Step text and optional vector icon</div>
    </article>
  </div>
</section>
~~~

~~~css
.diagram-carrier {
  position: relative;
  background: rgb(255 255 255 / .045);
  border: 1px solid rgb(255 255 255 / .25);
  /* Add very light backdrop filtering only if nested materials still work. */
}
.diagram-card {
  position: relative; isolation: isolate; overflow: hidden;
  background: transparent; border: 1px solid var(--glass-rim);
  border-radius: 1rem;
}
.diagram-card > :is(.diagram-filter,.diagram-tint,.diagram-rim) {
  position: absolute; inset: 0; pointer-events: none;
  border-radius: inherit;
}
.diagram-card > .diagram-filter {
  z-index: 0;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
}
.diagram-card > .diagram-tint { z-index: 1; background: var(--glass-tint); }
.diagram-card > .diagram-rim {
  z-index: 2; box-shadow: inset 1px 1px 1px var(--glass-specular);
}
.diagram-card > .diagram-content { position: relative; z-index: 3; }
~~~

This is a **structural fragment**, not a ready-to-ship theme or WCAG-
certified component. Apply the light/dark, high contrast, reduced-transparency,
forced-colors, no-backdrop, focus and mobile fallbacks from
[optical implementation](optical-implementation.md) and then test them.

## SVG → responsive DOM contract

1. Read the actual SVG viewBox, text elements and nested tspans in both
   languages. Record exact headings, descriptions, item order, bullets,
   connectors, icons, summary and decorative shapes.
2. Preserve text, imagery, accessibility, language routes, theme and SEO.
   Keep vector arrows/icons or recreate them as inline SVG; avoid
   duplicating accessible text in both hidden image and visible DOM.
3. Use the *minimum* semantic DOM to create independent optical cards.
   No extra nested rim or blanket white overlay. The real card anchors
   its filter/tint/specular children. Test optical bounds against the
   **bordered card's padding box** after fonts load.
4. Check existing breakpoints before replacing image markup: a legacy
   mobile ".infographic-visual { display:none }" may hide the new DOM.
   Restore display only for the truly responsive replacement. Reflow
   desktop columns → tablet rows → phone stack; keep arrow meaning.
5. Verify source-text parity: compare source-SVG text with new visible text in each locale.
   Validate labels, number of steps, connector relationships and no
   product-image drift.
6. Test actual backdrop under weak carrier and interior cards in
   light/dark modes; drop carrier blur if descendant sampling weakens.
7. In isolated preview, inspect 1440 / 1024 / 768 / 390 / 360px,
   glass-layer rectangles, 0 horizontal overflow, interactions,
   cache versions, reduced transparency and JS errors. Run Safari
   separately when available; browser automation is not aesthetic
   sign-off. Promotion needs independent explicit approval.

Historical EAO browser matrices reported 30/30 language × theme ×
viewport checks for both information diagrams, but the user still
requested visible design changes. **Technical PASS != visual acceptance.**

Further study: [material hierarchy](material-and-color.md),
[portfolio case](portfolio-case-study.md),
[QA](qa-and-case-study.md) and
[related animation case](../../reversible-scroll-motion/references/eao-story-choreography.md).
