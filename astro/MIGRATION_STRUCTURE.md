# Astro source ownership

Native `.astro` files now contain the Chinese and English homepage and prompt library markup. No runtime loading of Jekyll HTML. The visual SVG, CSS classes, existing GSAP and prompt copy/search JS are retained. `PortfolioShell.astro` owns metadata, theme initialization, linked CSS, and the shared SiteHeader. Site-level navigation lives in `src/lib/site.ts` and `src/components/SiteHeader.astro`; homepage sections are rendered by `src/components/HomeSections.astro`.

The independently designed EAO, ToolScout and five project pairs are still static microsites copied by `scripts/prepare-public.mjs`, with their shared navigation context translated at build time. Next milestone: retire unnecessary adapter logic, run browser visual regression, audit URLs, then cut over only with an explicit production verification gate.

Global navigation routes and labels now have one JSON source, `src/data/navigation.json`, reused by the Astro `SiteHeader` and the static microsite context producer. No second hard-coded route list is allowed.
