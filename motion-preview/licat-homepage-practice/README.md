# Reversible Scroll Motion v1.5.0 — Licat Homepage Field Practice

> Isolated full-homepage practice for visual review. **Not production.** Do not replace the root, /zh or /en pages without separate explicit approval.

This applies `skills/reversible-scroll-motion@1.5.0` and the official GreenSock implementation-first guidance to the **existing** Licat homepage (not a synthetic demonstration page).

## Review URLs

- Chinese: https://licat233.github.io/motion-preview/licat-homepage-practice/zh/
- English: https://licat233.github.io/motion-preview/licat-homepage-practice/en/
- Default: https://licat233.github.io/motion-preview/licat-homepage-practice/

Only the "开发轨迹" / "Development Journey" section is structurally adapted. All original dates, article headings and description copy are retained verbatim. The header/nav, projects, skills, methods, footer and site theme materials are inherited from the production page. Page duplication uses `noindex,nofollow` to avoid SEO confusion.

## How it differs from the detached V2 demo

- Kept the real transparent Liquid Glass `.phase-glass` layers and original brand background; did not paste standalone V2 page styling.
- A persistent capability illustration (BUILD → AUTOMATE → ORCHESTRATE) is adjacent to three real chronological cards.
- Used official GSAP 3.15.0 Timeline, ScrollTrigger, MorphSVG, DrawSVG, MotionPath; the master timeline is reversible. Existing site's entrance animator is preserved for the *other* sections.
- Avoided conflict with the old journey animation by replacing only the preview copy's `.timeline` class with the scoped `.journey-story`, while retaining each original `.phase` and `.phase-glass`.
- Real-site-only failure: `#journey {overflow:hidden}` prevented the `position:sticky` art from remaining onscreen. Scoped preview override `overflow:clip` solved it, without changing the root stylesheet.
- Real-site-only mobile failure: fixed glass navigation overlapped the first preview stage. Adjusted sticky `top`, stage size and mobile chapter padding; header and year headings are no longer occluded.

## Verified locally (2026-10-11, MacStudio.local, Chromium/Playwright)

- Three actual section centers read BUILD → AUTOMATE → ORCHESTRATE and show 1 → 3 → 5 capability nodes. Not merely forced timeline progress.
- Normal browser loading, GSAP plugins, 1440×900 Chinese and English, 768×960 Chinese, 390×844 Chinese and English, 375×667 Chinese.
- No Playwright page error, asset 404, or horizontal overflow in the above matrix.
- 390 mobile: navigation lower edge y≈120, diagram top y≈128 and bottom y≈440, chapter year y≈516. 375×667: art y=128..375, year y≈409 (both visible).
- Reduced-motion: no active GSAP journey controller; underlying coherent static graphic and all text remain available.
- Dark theme: 390×844, no JS errors or art/card overlap.
- User aesthetic review and real-device feel are **pending**. Testing a draft does not constitute design approval.
- Public deployment needs a separate live smoke test after GitHub Pages publishes.

## Lessons for the Skill

Use V2 as a semantic choreography reference, but expect full-site CSS / sticky / scroll logic to differ. The full-homepage integration caught ancestor overflow and existing header occlusion that isolated demo testing missed. Hence a production-ready Skill must validate the **actual page** before claiming success.
