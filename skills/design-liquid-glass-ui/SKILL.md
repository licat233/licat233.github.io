---
name: design-liquid-glass-ui
description: Design, prototype, implement, and visually validate restrained Liquid Glass interfaces for websites and web apps. Use when asked for glassmorphism, frosted/translucent navigation, glass cards, glass buttons, optical edge highlights, brand-based color palettes, or improving an existing glass UI. Guides brand color extraction, visual approval, native CSS, accessibility, responsive QA, and safe deployment; does not grant code or deployment permissions.
version: 1.0.0
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
7. **Do not mistake polish for completion**: Git commit, Pages deployment and
   actual asset loading are separate checks. Invalidate versioned CSS/JS URL on
   static sites after a change; do not disable all browser caching.

Apple's Liquid Glass guidance prioritizes a distinct *control/navigation* layer.
Website content panels may use subtler glass-inspired standard materials if readable.
See `references/material-and-color.md` before setting opacity or choosing a palette.

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

**D. Implement minimally**
- First reuse existing CSS architecture; do not add React, WebGL, a new framework,
  or another animation runtime merely for a marketing page.
- Prefer CSS gradients + semi-transparent fills, `backdrop-filter`, fine borders,
  top/inset highlights, restrained shadows and transitions. Edge refraction
  (SVG displacement or shader) is opt-in, rare, budgeted, and must not distort
  readable content or product screenshots.
- Keep component layout and animation transforms independent. In particular, never
  let reveal animations overwrite Grid-card transforms or hide untriggered sections.
- For language/theme segmented controls, **current state is the current page/state**,
  not the destination link. Use `aria-current="page"` for current language and keep
  the active option visible on mobile.
- Use `prefers-reduced-motion`, `prefers-reduced-transparency` (where supported),
  `prefers-contrast`, `forced-colors`, visible keyboard focus, and no-filter fallback.
- Reference starter patterns in `references/css-patterns.md`. Adapt to real selectors.

**E. QA & release gate**
- Check at least 1440, 1024, 768, 390, 360 px where site warrants it;
  all supported language routes, light/dark, hover, focus, FAQ/dialog, links,
  sticky nav, images, lazy loading, contrast, overflow and reduced motion.
- Test from a real local browser; capture *after* screenshots and review by eye.
  A successful CSS edit or generated visual does not count as UI acceptance.
- If authorized to deploy: fetch latest remote, protect concurrent work,
  commit isolated changes, run repo checks, push without force, wait for deploy,
  inspect live CSS URL and computed styles in a fresh browser.
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
