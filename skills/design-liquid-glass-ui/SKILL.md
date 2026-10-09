---
name: design-liquid-glass-ui
description: Design, prototype, implement, and visually validate restrained Liquid Glass interfaces for websites and web apps. Use when asked for glassmorphism, frosted/translucent navigation, glass cards, glass buttons, optical edge highlights, brand-based color palettes, or improving an existing glass UI. Guides optical layering, moderate frost, pinned scenic backgrounds, text contrast, brand palettes, single-surface geometry, responsive QA, visual approval, and safe deployment; does not grant code or deployment permissions. Includes native glass infographic reconstruction, quiet neutral carriers, and responsive SVG-to-DOM auditing.
version: 1.3.0
author: Enterprise AI Office
metadata:
  hermes:
    tags: [design, frontend, ui, glass]
---

# Liquid Glass UI — Evidence → Visual Approval → Implementation → Browser QA

Use this Skill for **glass material and visual systems**, not as permission to redesign a site.
Be bilingual (中文 / English) as requested. Respect existing design tokens, page structure,
brand assets, permissions, and tooling. The procedure is portable across agents; tool names
and repo paths below are illustrative.

## Entry conditions

- The request explicitly concerns glass, translucent surfaces, material aesthetics,
  or a design system intended to produce such effects.
- If this is an existing site: collect the URL/source, authorized workspace, active
  branch, existing visual baselines, current color tokens, supported browsers, and
  explicit scope. Check for concurrent changes before any write.
- If this is a new design: collect logo/brand identity, audience, page hierarchy,
  interaction needs, accessibility target, and output medium (mockup or working UI).
- Confirm whether the user authorized **color redesign**, **layout/content changes**,
  and **production deployment** independently. Permission for one does not imply others.
- Missing browser, repository, or publishing access is a blocker for those claims;
  never simulate a successful test or release.

## Non-negotiable design lessons

1. **Backdrop makes the material**: provide coherent light, colour, and depth *behind*
   glass before increasing surface blur. Over-white backgrounds erase translucency.
2. **Brand hue is an accent, not a compulsory full-page wash**: distinguish logo colour,
   environment/background colours, semantic UI states, glass material, and readable text.
   Do not anchor on an agent's favorite hue.
3. **Show colours to humans**: provide visible swatches, preferably a real-page preview,
   with role labels and HEX values. Seek user approval before implementing a major
   palette change when the workflow calls for approval.
4. **Use a material hierarchy**: clearer glass for navigation/selected controls;
   quieter or mostly opaque surfaces for text-heavy content; images remain sharp.
   Do not apply blur to every section, image, paragraph, or card.
5. **Light must be coherent**: use one dominant highlight direction, thin rim/reflection,
   restrained bottom edge, soft shadow, and modest hover/pressed states.
   Neither cyan neon nor full-page blue/purple glow is a synonym for Apple-like glass.
6. **Evidence beats adjectives**: compare before/after screenshots at real viewports,
   both languages and themes where applicable. Fix overlap, unreadable text,
   unexpected card transforms, image loading, and layout bugs before delivery.
7. **Material hierarchy includes quiet carriers**: a large infographic
   canvas may be near-colourless while inner cards own the clear glass rim.
   Do not add a competing second optical stack around them.
8. **Diagnose opaque images before glassifying**: a painted SVG shown as an
   image cannot become separate backdrop-sampling cards through outer blur.
   Edit the SVG for transparency; convert semantic nodes to HTML/CSS only
   when independent lenses, themes, responsive text or motion need them.
9. **Inventory all interactive controls when full-site glass is requested**:
   buttons, CTA, icon controls, selection, language/theme switch, FAQ
   toggles, menu triggers, dialog close, hover/focus/pressed/disabled.
   Design ONE family with distinct contrast-oriented material roles;
   do not paint every button with the same transparent alpha.
10. **A scrollbar is not a normal DOM glass element**: native
    scrollbar colour and thumb styling may be glass-inspired, but
    true optical refraction is not guaranteed, especially with
    platform overlay scrollbars. Never replace native scrolling
    merely to create a glass decoration.
11. **Do not mistake polish for completion**: Git commit, Pages deployment and
   actual asset loading are separate checks. Invalidate versioned CSS/JS URL on
   static sites after a change; do not disable all browser caching.

## Reproducing the approved optical look (start here for a Demo recreation)

For a request to **match the user's clear Apple-like glass Demo**, read
`references/optical-implementation.md` *before* choosing CSS opacity or blur.
That reference is the portable **one-positioned-surface / three-passive-layers**
recipe, with optional SVG, moderate frost and tiny theme-aware text edge
shadow. Numeric settings are case-tuned starting points, not universal rules.

1. Establish a *real* environment behind glass. Smooth gradients alone did
   **not** reproduce the source Demo's optical character. Reuse existing
   optimized, appropriately licensed photography when that suits the site.
2. Material order: **backdrop sampling** (`z=0`) → **neutral tint**
   (`z=1`) → **thin specular rim** (`z=2`) → **semantic content** (`z>=3`).
   The *single visible glass card* must own the border, radius,
   `position:relative` and clipping. All optics are non-interactive.
3. Calibrate against a *real* browser screenshot in this order: too-white
   fog → too-clear material → moderate frost → contrast → edge refinement.
   A 22% white wash looked foggy; reducing to ~6.5% went too far. The
   accepted *case-specific* range was ~12%/2.35px (light), ~11%/2.1px
   (dark) and a simplified ~1.8px mobile path.
4. Small white or dark text-edge shadows can separate glyphs from scenic
   detail, but **do not count as contrast compliance**. Verify foreground
   contrast on bright/dark composites; use a solid content scrim when needed.
5. SVG edge filters (the case used large-card displacement scale 32) are
   *optional*. CSS filter ≠ universal physical backdrop refraction. Check
   actual browser output and turn expensive SVG off on repeated mobile cards.
6. For a fixed full-page scene, consider a `body::before` fixed layer with
   `100svh` and one reused image (rather than unreliable mobile
   `background-attachment:fixed`). Test its pixels across scroll while
   hiding moving content *without collapsing scroll height*.
7. Never ship double glass borders: inspect each optical child's
   `getBoundingClientRect()` against the **actual bordered surface's padding
   box**. A missing `position:relative` on a milestone inner card created
   a visible second frame, later fixed without rewriting the HTML.

Review `references/portfolio-case-study.md` for the rejection/acceptance
history, reusable debugging decisions, and documented local/live QA.
This workflow is **inspired by** Apple, not a claim of pixel-identical native
Liquid Glass or universal Safari/GPU support.

Apple's Liquid Glass guidance prioritizes a distinct *control/navigation* layer.
Website content panels may use subtler glass-inspired standard materials if readable.
See `references/material-and-color.md` before setting opacity or choosing a palette.

## EAO information-diagram material case (read when applicable)

See [native glass diagrams](references/eao-native-diagrams.md) for the
observed rejected blue-grey board, almost-colourless outer carrier,
independently layered inner nodes, SVG-versus-DOM decision, bilingual
text parity, mobile infographic-hide rules and visual approval gates.
These are site-specific observations, not reusable brand values.
A passing browser test does not constitute the user's aesthetic approval.

## Whole-site glass controls and native scrollbar

For a request to turn EVERY button into glass, read
[glass controls and native scrollbars](references/glass-controls-scrollbars.md).
Inventory all actual interactive elements (not just Hero/nav), apply one
consistent tokenized material family with role-based opacity/contrast,
and preserve keyboard/focus/selected/destructive semantics. Do not
misrepresent the native scrollbar as a true backdrop-filter glass
surface: use a tested glass-inspired thumb and browser-native fallbacks.

## Workflow — execute in order

**A. Audit & reference study (read only)**
- Inspect live design and markup/CSS/JS, component inventory, colour roles, images,
  motion library, Grid/Flex transforms, dark theme, media rules, cache versions.
- Save baseline desktop/tablet/mobile screenshots. When screenshots use lazy loading,
  scroll to trigger images and wait for loading before capturing.
- Review reputable colour/material guidance and inspect upstream open-source demos;
  check license and browser/CPU/GPU costs. Do **not** copy external code blindly.
- Decide whether glass is needed at all. Too much glass can harm comprehension.

**B. Colour direction & visual approval**
- Extract logo colour from supplied assets when allowed. Mark sampled colours as
  *observed from the provided asset*, not an unverified official brand standard.
- Develop 2–3 *distinct* environmental directions, with role-labelled real swatches,
  page excerpts in at least one realistic viewport, and plausible dark-mode variants.
- Pick the direction based on brand coherence, contrast, legibility and visual rhythm.
  If user asks for approval, stop at this gate; do not patch production.
- Treat generated images as moodboards, not proof of existing UI functionality or
  a source of replacement marketing copy, product imagery or screenshots.

**C. Design system**
- Specify **environment** (background, coloured light, neutral), **material** (subtle,
  regular, emphasized), **semantic UI** (primary, hover, selected, focus, error),
  **content** (text, separator) separately. Use semantic variables, not raw one-off
  rgba in every component. Aim for the smallest viable token set.
- Use an almost neutral glass tint against purposeful background colours. Distinguish
  light and dark themes. Prefer a single direction of rim light.
- Treat transparent surface + actual backdrop = composited final colour. Validate
  foreground contrast against *worst-case composite*, not bare HEX swatches.
- See `references/material-and-color.md`.

**Diagram-specific scope guard**
- Preserve the original SVG text in every locale, icon meaning and
  connector order before replacing any painted infographic with live DOM.
- Never treat a faint, colourless organizing surface as another prominent
  glass card; check nested backdrop sampling in the browser.
- Check old mobile media rules that may still hide the converted diagram.

**D. Implement minimally**
- First reuse existing CSS architecture; do not add React, WebGL, a new framework,
  or another animation runtime merely for a marketing page.
- Prefer CSS gradients + semi-transparent fills, `backdrop-filter`, fine borders,
  top/inset highlights, restrained shadows and transitions. Edge refraction
  (SVG displacement or shader) is opt-in, rare, budgeted, and must not distort
  readable content or product screenshots. Consult the precise optical-layer
  pattern and fallback in `references/optical-implementation.md`.
- Keep component layout and animation transforms independent. In particular, never
  let reveal animations overwrite Grid-card transforms or hide untriggered sections.
- For language/theme segmented controls, **current state is the current page/state**,
  not the destination link. Use `aria-current="page"` for current language and keep
  the active option visible on mobile.
- Use `prefers-reduced-motion`, `prefers-reduced-transparency` (where supported),
  `prefers-contrast`, `forced-colors`, visible keyboard focus, and no-filter fallback.
- Reference starter patterns in `references/css-patterns.md`. Adapt to real selectors.

**Material QA additions**
- Distinguish the parent carrier from the independently positioned
  rim/filter/tint of every semantic child card.
- Compare SVG originals with new DOM text/structure, mobile reflow and
  arrow meaning for all supported languages.

**Control coverage & scrollbar QA**
- Audit every button role and focus/hover/pressed/current/disabled state
  across desktop/mobile and both themes; primary CTA may need an
  opaque readable core within the glass design family.
- Scrollbar cosmetic styling is optional; check actual OS overlay and
  always-visible states, Firefox/Chrome/Safari differences, forced
  colours, keyboard scrolling and native touch. Never force custom
  scrolling to manufacture an optical scrollbar.

**E. QA & release gate**
- Check at least 1440, 1024, 768, 390, 360 px where site warrants it;
  all supported language routes, light/dark, hover, focus, FAQ/dialog, links,
  sticky nav, images, lazy loading, contrast, overflow and reduced motion.
- Compare positioned glass-layer rectangles with each component border/padding
  box; verify exactly one rim, timeline dots and icon/number geometry.
- For fixed scenes, isolate background pixels and compare scroll positions at
  stable viewport dimensions (not screenshots with moving cards).
- Test from a real local browser; capture *after* screenshots and review by eye.
  A successful CSS edit or generated visual does not count as UI acceptance.
- If authorized to deploy: fetch latest remote, protect concurrent work,
  commit isolated changes, run repo checks, push without force, wait for deploy,
  inspect live CSS URL and computed styles in a fresh browser.
  Preserve production canonical/hreflang and indexability when promoting from
  a noindex preview; do not leak Demo-only routes or theme storage keys.
- Do not state success for untested Safari, unsupported reduced-transparency flags,
  or unmeasured GPU performance. Report limits.
- Use `references/qa-and-case-study.md` for acceptance evidence and lessons.

## Output contract

For concept work: swatch *visuals*, design rationale, realistic page preview, variants,
trade-offs, and an approval question. For implementation: changed components,
tokens/material strategy, untouched content/assets, screenshots/QA facts,
accessibility and performance limitations, commit, deployment status and rollback.
Always distinguish **CSS simulated edge depth** from **actual optical refraction**.

## Boundaries

A Skill is **instruction**, not filesystem/network/deploy authority. Respect Profile
tool constraints and existing company guards. Don't read secrets, change OAuth,
install dependencies, mutate unrelated components, or silently grant agent permissions.
Company-owned source editing must be explicitly authorized; autonomously learned
procedures must follow the existing Profile-local `learned-*` guard. External examples
are references, not company SOPs. Do not write process explanations into page content.
