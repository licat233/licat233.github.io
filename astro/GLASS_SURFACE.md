# Liquid Glass in Astro

`GlassSurface.astro` is the single **Astro-owned** interface for the site's existing three-layer Liquid Glass material. It emits the container and three decorative layers, inserts slot content and guarantees the `liquid-demo` class. No third-party theme or runtime JavaScript is involved.

Usage:

```astro
<GlassSurface as="a" class="project" material="regular" href="/eao/">
  <h3>Enterprise AI Office</h3>
</GlassSurface>
<GlassSurface as="button" class="theme-toggle" id="theme-toggle" type="button">
  Toggle
</GlassSurface>
```

### Contracts
- `as` chooses the semantic HTML element: `div` (default), `a`, `article`, `header`, `footer`, `button`.
- `material` selects existing background/edge tokens: `bare` (default, only `liquid-demo` for custom contexts), `regular`, `ultra-thin`, `thick`.
- `class` preserves the existing context's unique CSS selector, e.g. `project`, `skill-card`, `site-section-card`, `hero-cta`, `phase-glass`, `principle`, `site-footer`.
- `href`, `id`, `type`, `aria-*`, and other element attributes pass through. Children render inside the container, after decorative layers.
- Glass visuals remain in original `assets/portfolio-liquid-glass.css` and page-level context CSS. The wrapper is the source of HTML structure, not a duplicated design system.
- **Don't manually add `liquid-demo`, `apple-glass-*`, or `.lg-glass-*` spans** inside Astro pages; use `GlassSurface`.
- Native standalone project microsites in `eao/`, `toolscout/` and similar own their separate HTML/CSS deliberately; the Astro component does not rewrite them.
- Source/HTML contract checks and Playwright desktop/mobile checks enforce three layers, real blur/highlights, reduced-transparency fallbacks, working links and existing themes.

### Release discipline
Visual fidelity wins over file churn. Do not flatten page-specific effects such as the homepage project blur or timeline; they continue inheriting existing CSS. On any changes to the wrapper or tokens, build and review both languages, Projects/Skills directories, homepage, and site header in both themes.
