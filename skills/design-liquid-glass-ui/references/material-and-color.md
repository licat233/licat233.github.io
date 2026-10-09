# Glass material and colour research

This reference is a *workflow*, not a mandatory palette or a literal copy of Apple
system rendering. Read it for colour decisions and production material limits.

## What makes translucent UI look like glass?

Perception comes from five interacting factors:

| Layer | Design decision | Common failure |
| --- | --- | --- |
| Environment | Distinct but coherent warm/cool daylight behind glass; purposeful depth | Uniform white everywhere → opacity invisible |
| Material | Almost-neutral tinted transparency; selected surfaces stronger | Coloured opaque panels that look like plastic |
| Rim / reflection | Consistent top/upper-left white bevel, faint bottom darker rim | Neon halos on every side; inconsistent lights |
| Depth | Soft external contact shadow, inner highline, understated elevation | Heavy dark shadows or endlessly floating cards |
| Content | Stable text colour and image pixels; selective opacity | Blurred text, washed-out screenshots, low contrast |

**Functional hierarchy is primary.** Apple [Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
describes Liquid Glass mainly for controls and navigation above content,
and standard materials inside the content layer. Apply this as a restraint:
interactive nav / segmented controls can be more transparent; explanatory
cards should not lose legibility for an optical demo.

## Palette discovery, not guessing

1. Collect actual logo/brand artwork; sample emblem colours (and confirm whether
   they are official). Observe *existing* UI text, background, and semantic colours.
2. Separate **brand/accent**, **environment**, **glass surface**, **content/text**,
   **interaction states**, and **deep contrast chapters**. Avoid creating
   five similar monochromatic directions and pretending they are alternatives.
3. Build at least two differentiated light environments and realistic dark modes.
   Use adjacent hues for continuity and a modest warm–cool relationship to suggest
   real daylight. The secondary hue is a design hypothesis, not a universal rule.
4. Show visible swatches with HEX + role labels and a *realistic page excerpt*
   (actual screenshot or faithful prototype), not just prose and colour names.
5. Review in context, not in isolation. Brand HEX such as #00B8AE can be
   ideal for logo/highlights and too bright beneath white button text. Pair
   with a separately chosen darker solid-action tone; measure both.
6. Ask for directional approval if requested. Approved colour change does not
   grant permission to rewrite content or replace imagery.

The [Radix Colors 12-step scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
provides a helpful semantic vocabulary: background steps, hovered surfaces,
borders, accent solids, and accessible text, rather than a bag of hex strings.
You need not install Radix to follow this concept.

## Real contrast testing

Contrast must be evaluated on the **composited surface** for each theme and
representative light/dark area *behind* glass:

- WCAG 2.2 AA normally needs text contrast >= 4.5:1; large text >= 3:1.
- Essential component boundaries and graphical controls typically need >= 3:1
  against adjacent colours.
- Different backdrops, theme changes, hover, motion and reduced-transparency
  settings can alter the effective contrast.
- If arbitrary changing background cannot meet contrast in a translucent panel,
  use a stronger opaque or near-opaque content surface and keep only the rim glassy.
- Don't claim a palette is AA on the strength of a single token pair.

W3C normative references:
[SC 1.4.3 Text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
[SC 1.4.11 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## Three material roles

- **Subtle content panel**: quiet fill, few filters, readable copy and tables.
  Prefer standard content material over prominent Liquid Glass.
- **Regular interactive glass**: light translucent fill, careful edges, backdrop
  where useful, clear hover/focus/pressed/selected/disabled states.
- **Emphasized glass**: e.g., floating navigation, key image frame perimeter,
  small CTA control. Stronger edge and context; never distort actual media.

Keep text/images on top of optical pseudo-elements, but avoid a pseudo-element
overlay that intercepts pointer events. Do not apply filters to screenshots or
illustrations just to make a frame look refractive.

## Upstream implementation inspiration — research, not copied source

- [hwyuanzi/LiquidGlass-UI](https://github.com/hwyuanzi/LiquidGlass-UI)
  — token-driven specular rim, opt-in SVG edge-lens, fallbacks, reduced-motion.
  It also offers a separate portable Agent Skill; reuse it where full component
  integration is justified. License and source must be checked before vendoring.
- [JUNGHERZ/GlassKit](https://github.com/JUNGHERZ/GlassKit)
  — component hierarchy (cards / buttons / nav / pills), theme tokens.
- [hungduong-projects/LiquidGlassUI](https://github.com/hungduong-projects/LiquidGlassUI)
  — CSS translucent surfaces versus heavier rendering.
- [nikdelvin/liquid-glass](https://github.com/nikdelvin/liquid-glass)
  — refraction implementation, browser fallbacks and performance trade-offs.

Never imply that `backdrop-filter:blur(...)` alone implements physically accurate
refraction. Edge-lens demos may be Chromium-only or require nontrivial GPU budget.
Verify the **current** license and compatibility of any upstream package before use.

## Quiet information-diagram carrier (EAO lesson)

The coloured blue-grey department background looked incompatible even
though the inner cards were glass. It was replaced with a nearly
colourless weak carrier over one shared ambient page; inner cards
retained the actual optical rims. If nested carrier filtering reduces
descendant backdrop sampling, remove the carrier blur before increasing
inner tint. An optically quiet group is *not* a second prominent glass
frame. See [EAO native diagrams](eao-native-diagrams.md).
