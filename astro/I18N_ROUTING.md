# Native Astro i18n routing

Astro 7 owns the language-aware URLs, not a separate client-side language router.

- Config: zh/en locales, default zh, no prefix for default.
- Routing helpers in src/lib/site.ts use getRelativeLocaleUrl from astro:i18n.
- Navigation data contains only route keys and language labels, not duplicated URLs.
- Both home locales render `src/components/home/Home.astro` with text from `src/data/home.ts`; no locale-specific HTML duplicates.
- Home project destinations are obtained from the shared Astro `projects` Content Collection so localized EAO and other project links cannot diverge.
- BaseLayout validates Astro.currentLocale against the chosen language.
- Blog canonical and language URLs come from Astro. Only real translations get
  reciprocal hreflang links. Untranslated posts switch to the alternate archive.
- The prompt reader consumes Astro-generated locale URLs; query deep links survive.
- Independently published old project microsites are outside Astro page routing.
  The static build-time bridge preserves their historical paths and nav links.
- /zh/ remains a legacy noindex redirect to the canonical Chinese home.
- Do not auto-redirect by browser language on static GitHub Pages.
- Dark/light theme, CSS, Liquid Glass, GSAP and visual design are unchanged.

Validation: npm run build, npm run check, legacy route parity and Playwright
desktop/mobile i18n, navigation, prompt, SEO and glass regression tests.
