# Product Detail Designer — Page-First Eight-Slice Ecommerce Detail Page Workflow

<!-- prompt:begin -->

Use the Product Detail Designer Skill to create my product detail page. This prompt is designed for the standard ChatGPT chat window.

**Product Detail Designer Skill v1.0.5 (pinned open-source release):**
- GitHub repository: https://github.com/licat233/product-detail-designer
- Pinned version: `v1.0.5`
- Skill file: https://raw.githubusercontent.com/licat233/product-detail-designer/v1.0.5/SKILL.md

Read the `SKILL.md` from this exact release and follow its general execution rules.

**This prompt is the authoritative production brief and takes precedence over the Skill's generic defaults.** The requested page count, blueprint, 1:3 visual master, approval gates, final image ratio, and deliverables are defined by this prompt. The Skill provides general safeguards for product identity, factual accuracy, visual consistency, image generation, and quality review. Do not add dependencies, separate background assets, HTML, scripts, extra approval gates, or other intermediate steps that this prompt does not request.

Also verify that this ChatGPT session has an actually invokable image-generation capability. If it does not, state the limitation plainly and do not pretend to generate images.

## Production brief confirmation (Product Detail Designer v1.0.5)

After reviewing the product materials and before creating the Blueprint or starting production, follow the Skill's Production Brief Confirmation checkpoint. Confirm these four items:

1. **Output language** — the language shown in the final images.
2. **Image dimensions / aspect ratio** — pixel dimensions or the aspect ratio for each final image.
3. **Ecommerce platform / placement** — for example, Amazon product images, Amazon A+ Content, Shopify product-page media, or an Alibaba.com product detail page.
4. **Sales region / target market** — a specific country or region, or an explicit global-market scope.

This prompt already specifies:
- English as the output language. Do not ask again unless the user changes it.
- A 9:21 vertical aspect ratio. Do not ask again about the ratio unless the user changes it. If the confirmed platform placement also requires an exact pixel size, recommend and confirm it after the placement is known.

The phrase “overseas market” does not identify a specific country or region, and this prompt does not name a target ecommerce platform or placement. Ask for those missing items unless the user has already supplied them in the conversation or explicitly delegates the decisions.

Combine all remaining missing items into one concise message. If the user delegates a decision, choose a sensible option and briefly state the assumption. Once resolved, continue with the existing Blueprint workflow. This is a production-parameter checkpoint, not an additional visual approval gate.

## Separate product evidence from visual design (mandatory)

**Content reference is not visual reference.** Product manuals, specification sheets, brochure PDFs, and technical documents are supplied to understand the product and verify facts, not to be redesigned as the ecommerce page.

- PDFs / brochures / specifications: extract verified specifications, functions, features, materials, applications, limitations, and approved copy.
- Real product photos / pack shots / close-ups / installation photos: identify and depict the actual product.
- Engineering drawings / diagrams: understand construction, dimensions, wiring, and operation. Redraw a clear explanatory diagram only when useful, preserving its technical meaning and never inventing data.
- Visual style references: only files I explicitly designate as design references may guide the final visual style.

Unless I explicitly ask for a faithful reproduction, redesign, conversion, or use a PDF as a layout/style template, never:

1. Trace, recreate, recolor, retype, translate, or rearrange the PDF's page UI or layout.
2. Copy its page sequence, composition, title placement, text blocks, tables, icon grids, backgrounds, or information hierarchy.
3. Use a complete PDF page or screenshot as an image-generation visual reference.
4. Turn each PDF page into a corresponding ecommerce detail screen.

You may extract verified facts, copy, and individual product images from the PDF, but must independently plan the content and visual design around the target buyer, purchase decision, market, and ecommerce platform. The final work must be a newly conceived ecommerce detail page, not a restyled brochure.

If product photos exist only inside the PDF, extract an individual image only when its quality is sufficient. Never substitute an entire PDF page for a real product photo. If the product cannot be identified clearly, request a proper image or explain the limitation.

**Acceptance test:** if the final images look like the source PDF with different colors, fonts, or layout, or still follow its page-by-page structure, they fail and must be independently redesigned.

Pay particular attention to:

- Image Generation Workflow
- Page-first 8-slice ecommerce product detail page
- Continuity Rules
- Revision Routing
- Post-generation Audit

This is a production ecommerce detail-page assignment, not concept art, a PPT, brochure, infographic, moodboard, or visual experiment.

## 1. Core objective

Create **eight separate image files that together form one continuous vertical ecommerce product detail page**. They are file slices of one page, not eight independent pages.

The eight panels must look like:

> Eight consecutive slices of one continuous, long ecommerce product page.

They must NOT look like:

- Eight independent advertising posters
- Eight PowerPoint slides
- Eight infographics
- Eight social-media ads
- One overview image cut into eight parts

All final images must be commercially suitable for direct use on a real product listing.

## 2. Information and source-material priority

Always apply the following order, from highest to lowest:

1. Facts explicitly confirmed by the user
2. Official product specifications, packaging data, manuals, listings, and other documents supplied by the user
3. Authentic product photographs and video frames supplied by the user
4. The approved Blueprint
5. The approved Text Master, Visual Master, and Style Reference
6. Facts reasonably observable in the images
7. Reasonable AI inferences
8. Free AI creativity

A lower-priority source must never override a higher-priority fact.

When sources conflict:

- Identify the conflict explicitly.
- Do not arbitrarily select one version as fact.
- Prefer conservative wording.
- Record the uncertainty under risk_unknowns.
- If it materially affects commercial accuracy, obtain confirmation before using the claim.

## 3. Analyze Inputs

After receiving product materials, do not immediately generate the final images.

First analyze all supplied materials, where available:

- Real product photographs
- Product photographs on white backgrounds
- Close-up product details
- Packaging photographs
- Accessories
- Usage, installation, and application photographs
- Technical specifications
- Product pages
- Manuals and documents
- Brand assets
- Style-reference images
- Competitor references
- Requirements for content that must be preserved or excluded

Separate findings strictly into four categories:

**A. Confirmed Facts** — Facts explicitly confirmed by the user or official materials.

**B. Observed Facts** — Facts directly visible in supplied imagery.

**C. Reasonable Inferences** — Reasonable interpretations based on product category, construction, and visible evidence.

**D. Unknown / Do Not Invent** — Missing, conflicting, or unverified information that may not be fabricated.

Never invent any of the following without confirmation:

- Technical specifications or materials
- Features or functions
- Certifications, awards, or patents
- Tests, performance results, or durability data
- Sales volume or conversion figures
- Medical, efficacy, or protection-rating claims
- Brand partnerships
- Discounts, warranties, or minimum order quantities (MOQ)
- Lead times or shipping commitments
- Package contents

## 4. Product Identity Lock

If authentic product images were supplied, establish a **Product Identity Lock**.

Record the product's immutable visual characteristics wherever relevant:

- Overall shape, proportions, thickness, and color
- Materials, surface texture, and patterns
- Logo and brand marks
- Packaging design and packaging text
- Buttons, openings, ports, and screens
- Knobs, zippers, handles, and brackets
- Connectors and joining structures
- Accessories and distinctive forms
- Number of products and components
- Spatial relationships among components

Lock only characteristics that genuinely apply to this particular product.

> Product authenticity takes priority over making an image look prettier.

Reject any enhancement that turns the product into a different SKU, structure, color, or material.

When sufficient authentic images are available, prefer **real product assets + AI-generated environment/scene + professional layout**, not asking AI to redraw a vaguely similar product.

## 5. Style Reference Analysis

If style references are supplied, analyze more than their colors. Extract:

- palette
- lighting
- contrast
- camera angle
- lens language
- depth of field
- composition
- negative space
- product scale
- typography
- information hierarchy
- icon language
- label / badge style
- material treatment
- scene density
- visual rhythm
- background world
- recurring motifs
- transition language
- commercial photography level

Extract the reference's **Style DNA**.

Do not copy a reference image's brand, identifiable people, text, products, or trademarks.

When the user explicitly approves a particular reference or visual master, treat it as a binding visual constraint for subsequent panels, not merely inspiration.

## 6. Page Blueprint — Plan the Complete Page First

Plan **one complete vertical ecommerce detail page** first. Only then divide it into eight image files according to the required delivery dimensions. Do not design eight independent images and try to stitch them together afterward.

### Page-level fields (defined once for the complete page)

- `page_h1`: the single primary title, shown only in the first image.
- `page_promise`: the central value the complete page communicates.
- `buyer_journey`: the complete reading sequence from product introduction through value, proof, and configuration.
- `page_claim_seeds`: 2–4 verified facts and selling points supporting the whole page.
- `visual_style_dna`: the shared background world, lighting, palette, materials, typography, and visual flow.
- `page_end_action`: an optional final CTA, shown once at the actual end of the complete page.
- `footer`: default `none`; do not create a website footer or image footer.

### Slice-level fields (describe only each file's position within the complete page)

- `slice_id`: internal file-management identifier only.
- `buyer_journey_role`: the role of this portion of the page; it does not need to answer a separate buyer question.
- `content_thread`: the content carried forward from the previous image; it may be `continue`, not a new topic.
- `modules_present`: the content modules actually visible in this portion; a module may span two or more slices.
- `content_entry_state` / `content_exit_state`: where the content is when this slice begins and ends.
- `slice_entry_state` / `slice_exit_state`: the visual state at the top and bottom edges.
- `top_edge_anchor` / `bottom_edge_anchor`: concrete, reproducible descriptions of the image edges.
- `top_edge_mode` / `bottom_edge_mode`: edge state; every non-final slice must be `open`, and only the final slice may be `closed`.
- `continuity_carrier`: a non-text visual element that crosses a non-final bottom edge and continues in the next image.
- `next_slice_handoff`: the exact position, direction, scale, perspective, lighting, and background state the next slice must continue.
- `text_exact`: the copy that genuinely belongs in this portion; do not add a headline merely to fill each image.
- `risk_unknowns`: factual risks to avoid.

**Do not assign an independent page title, product-introduction title, hero headline, summary, or footer to every slice.** A file boundary is not a content-section boundary; a content module may continue naturally into the next image.

## 7. Claim Seed rules

Establish **2–4 page-level claim seeds** before planning the individual image slices.

Each seed must:

- Matter to the overall purchasing decision.
- Be specific enough to substantiate in later screens.
- Not be an empty adjective.
- Not assert unverified technical or commercial claims.

All later page content must develop these seeds by explaining, demonstrating, substantiating, comparing, showing details, placing them in context, building trust, and guiding the buying decision.

Do not invent a new unrelated selling point for every image.

If later content cannot be traced back to the page-level claim seeds, revise the seed or the relevant content.

## 8. Page-Level Content Rhythm and Composition

The **complete page** answers the buyer's questions. Each image does not need to answer a different question on its own.

- Establish the complete purchase-decision journey before arranging content modules and image slices.
- Adjacent slices may continue the same buyer question, feature explanation, or visual scene.
- Vary the content modules, product angles, information density, and visual organization across the complete page. Do not turn every image into an independent poster just to make it look different.
- Avoid mechanically repeating hero layouts, headline/subtitle/icon rows, or standalone feature-card grids.
- Product close-ups, construction details, feature proof, operation, installation, applications, configurations, and specifications may flow naturally across slice boundaries.
- If needed, show one final CTA only at the actual end of the complete page. Do not add a CTA or summary to the bottom of every image.
- Do not invent empty sections, headlines, or repeated content just to fill eight files.

## 8A. Page First, Slices Second (Mandatory Production Method)

**The design unit is one complete vertical ecommerce page. Image files are only slices of that page.** Do not design eight independent canvases and disguise them as one long page by reusing colors, backgrounds, or typography.

### 1. Open the page once; do not restart it in every image

- The complete page has **one primary title / H1 only**, placed at the beginning of Slice 01.
- Slices 02–08 must not repeat the product-introduction title, page headline, standalone hero headline, brand title bar, or page masthead.
- Intermediate slices may contain genuine in-flow section headings, but these must belong to the page's content—not become a repeated title area at the top of every image.
- Do not add a website footer, contact-information bar, repeated logo, repeated product-name bar, copyright strip, or decorative sign-off to any slice.
- The final slice may contain one CTA at the actual end of the complete page, but it is page content, not a footer repeated on every image.

### 2. File boundaries are not section boundaries

- Finish planning the complete page's content and composition before choosing the slice boundaries based on the target image dimensions.
- Do not make every image begin with a new section or end with a completed module.
- Content modules may cross slice boundaries; the same feature explanation, scene, or visual thread may continue from one image into the next.
- An intermediate slice may enter partway through an ongoing visual scene or content module and may exit before that module is complete.
- Images do not need to be independently complete, explain the product on their own, or independently close a sale. Together they form one continuous scrolling experience.
- Do not let cut lines sever text, specifications, sentences, or labels. Use the background, product scene, spatial environment, lighting, and non-text visual elements to carry continuity across boundaries.

### 3. No per-image title or footer

The following are automatic failures:

- A large headline or product-introduction title at the top of every image.
- A new product hero and product name repeated in every image.
- A footer, logo, contact details, copyright text, CTA, or summary block at the bottom of every image.
- A repeated structure of “title area at top + content area in the middle + closing area at bottom.”
- Every image being framed as a separate card, poster, PowerPoint slide, or complete advertisement.

### 4. Design the page first, then generate slices in sequence

- Slice 01 naturally opens the complete page and may contain its one H1 and opening hero.
- Slice 02 must continue the visual and content state of Slice 01; it must not start a new page.
- Continue Slice 03 onward in the same sequential way.
- When generating a later slice, use the previous image as a visual reference. If the image tool supports image extension / outpainting, prefer extending downward from the previous image's bottom edge. If it does not, explicitly use the previous bottom-edge state as the next image's top-edge composition reference. Never start again from a blank canvas and independently redesign the page.
- If the available tool cannot produce reliable continuity, state the limitation and revise; do not pass the continuity check merely because the images share a similar style.

### 5. Concatenation acceptance test

Stack the actual final images vertically in order and inspect them as one naturally scrolling page. Check especially:

- Does Slice 01 keep an open bottom edge, with a continuity carrier extending beyond the frame instead of a visual ending?
- Does Slice 02 continue the previous image directly, without a new title, hero, or product introduction?
- Do intermediate slices avoid repeated title areas, card frames, and bottom closing areas?
- Does the page avoid the PowerPoint rhythm of “every image starts over and every image ends”?

Any repeated title/footer or standalone-page structure is a failure. Repair it before asking the user for approval.

### 6. Open-ended Slice (mandatory open bottom edge)

v1.0.4 prohibited repeated titles and footers, but an image can still look finished without either through a balanced composition, empty space, a fade-out, or a completed content module. Add this stricter rule:

**Every image except the final image of the complete page must have an open bottom edge. The bottom of an image is a viewport crop boundary in the middle of the page, not the end of the design.**

#### Required edge states

- `top_edge_mode`: `opening` for Slice 01; `continuation` for Slice 02 onward.
- `bottom_edge_mode`: `open` for every non-final slice; `closed` only for the final slice.
- `continuity_carrier`: at least one concrete non-text visual element that reaches or crosses the bottom edge and continues into the next slice.
- `next_slice_handoff`: the exact scene and element the next slice must pick up, including position, direction, scale, perspective, lighting, and background state.

#### Open-bottom rules for every non-final slice

1. The bottom 10–15% is a **visual continuation zone**, not a closing zone. Keep headlines, body copy, specifications, and critical labels out of it.
2. At least one concrete non-text visual element must reach or cross the bottom edge and continue into the next image at a compatible position and direction. Examples include a shelf/track, cable, supporting surface, perspective line, diagram path, light strip, shadow, or architectural plane.
3. Matching background colors alone do not count. A recognizable visual carrier must cross the boundary.
4. Do not place any visual ending at the bottom of an intermediate image: no large blank margin, fade-to-blank, vignette, darkening, completed card grid, bottom-aligned card row, isolated centered product composition, divider line, decorative bottom band, summary, CTA, or other closing treatment.
5. Do not let the background, lighting environment, spatial plane, supporting surface, or perspective appear to stop at the bottom edge.
6. Do not cut through important product geometry or text to fake an open edge. Continue the surrounding environment or a secondary visual carrier instead.
7. The next image must continue the previous carrier and scene directly. It must not begin a new composition.

**Only the final slice may use `bottom_edge_mode: closed`** and conclude the visual scene. If needed, the page's one final CTA may appear only there.

#### Generation order must also change

- Generate one image at a time. Never batch-generate Slices 03–08.
- Inspect each image's bottom edge immediately after generation. If it looks finished, revise that image before using it as the reference for the next one.
- Generate the next slice only after the current open edge and `next_slice_handoff` pass inspection.
- The next generation must receive both the actual previous image and the next slice's planned content/handoff.
- If the image tool cannot reliably preserve an open edge, use a supported continuous-canvas/extension workflow or state the limitation. Do not concatenate separately closed images and call them continuous.

## 9. Internal fields must not appear in the delivered imagery

These Blueprint/workflow fields are for internal use only:

- slice_id
- module_type
- module_label
- claim_seed
- evidence_type
- content_density
- risk_unknowns

Unless the user explicitly requests otherwise, never put any of these internal labels into buyer-visible graphics:

- 01 / 02 / 03 / 04 / 05 / 06 / 07 / 08
- Slice 01
- Product Overview
- Feature Breakdown
- Parameter Trust
- FAQ
- Module
- Section
- Blueprint-style labels

A filename may be product_screen_01.png, but the image itself must not automatically display "01".

Numbering that describes actual product instructions, such as steps 1, 2, and 3, is permitted.

## 10. Approval Gate 1

**Stop after completing the Blueprint. Wait for the user's first approval.**

Without that approval:

- Do not generate final detail images.
- Do not produce formal slices.
- Do not advance to final visual production.

## 11. Master stage after the first approval

Once the Blueprint is approved, establish:

1. Text Master
2. Visual Style DNA
3. Visual Master Spec
4. Product Identity Lock
5. Structure Blueprint
6. If appropriate, a continuous 1:3 long-page visual master

The Visual Master Spec must establish, at minimum:

- palette
- lighting direction
- background world
- product rendering strategy
- typography
- spacing system
- information hierarchy
- material language
- icon language
- camera language
- product scale rhythm
- section rhythm
- transition logic
- recurring motifs
- negative space rules

## 12. Rules for the 1:3 Visual Master

The 1:3 master is a **visual continuity reference only**, not a finished product.

Never:

- Deliver it as the final detail page.
- Cut it directly into eight final slices.
- Enlarge it to produce final-resolution imagery.
- Take screenshots of it to use as finished slices.
- Treat it as a contact sheet.
- Split it into a final package for convenience.

The master must represent one continuous page-level composition, not a stack of independent poster panels. It may contain the page's primary title only once at the opening; do not repeat titles, logos, footers, or CTAs across its visual regions.

Use the master only to establish a shared background world, space, lighting, color, product scale, visual rhythm, typography, hierarchy, page continuity, and transitions between upper and lower portions.

Reject a master if:

- It looks like eight separate posters, slides, brochure pages, an infographic grid, or a contact sheet.
- The product's identity or construction drifts.
- The style diverges from the reference.
- There is no spatial continuity across the long page.
- The information hierarchy conflicts with the Blueprint.

A failed master must not be used for final slice production.

## 13. Sequential continuation production for final slices

Once the master passes review, produce:

- Slice 01
- Slice 02

The default final aspect ratio is **9:21 vertical**, unless the user specifies otherwise.

Save the final images as separate high-resolution files, but generate them **one at a time in sequence**; never batch-generate Slices 03–08. Slice 01 is the only page opening, and its bottom edge must remain open. Slice 02 onward must use the actual previous image as a visual reference and also include the next slice's planned content and `next_slice_handoff`. Every non-final slice must have `bottom_edge_mode: open`; its bottom 10–15% is a visual continuation zone, with at least one non-text `continuity_carrier` reaching or crossing the lower edge and continuing into the next image. No blank bottom margin, fade, vignette, completed card grid, decorative bottom band, divider, or other visual ending is allowed on an intermediate slice. Only the final slice may use `bottom_edge_mode: closed`. Inspect each image immediately; if its bottom looks finished, revise it before generating the next. If the image tool supports extension / outpainting, prefer extending downward from the previous image's bottom edge. Otherwise, use the previous `bottom_edge_anchor` and `next_slice_handoff` as concrete references for the next image.

Do not directly turn any of the following into a finished slice:

- The 1:3 master
- An overview graphic
- A contact sheet
- A moodboard
- A Blueprint illustration
- A low-resolution sketch
- A preview image

If the existing composition does not match the final aspect ratio, use proper recomposition, layout adjustments, a regenerated environment, sensible outpainting, and repositioned product/copy modules.

Do not force the ratio through Gaussian-blurred padding, mirrored padding, stretching, arbitrary enlargement, low-resolution crops, background blur filler, or oversized borders.

## 14. Authentic product asset usage

When real product photographs are supplied, retain the authentic product as faithfully as possible.

AI may work on the environment, setting, props, lighting, extended space, backgrounds, atmosphere, and nonessential decorative elements.

Reject any generated result that changes the product's SKU identity, including:

- Shape or color changes
- Logo, material, or pattern changes
- Different ports or component counts
- Altered construction
- Incorrect packaging text
- Missing or newly invented key parts

## 15. Text rules

The Blueprint's **text_exact** is authoritative for all final copy.

Important text includes:

- headline
- subtitle
- specifications
- dimensions
- model
- feature names
- steps
- CTA
- warnings
- certification text

Do not let an image-generation model freely rewrite this content.

Prefer reserving areas for copy, applying typography after image generation, and using deterministic text composition with controllable fonts.

Correct any spelling mistakes, incorrect numbers or units, garbled characters, omissions, or unauthorized copy rewrites in generated imagery.

Never overlook incorrect text merely because the overall image looks good.

## 16. Internal audit of Slices 01–02

After generating the first two slices, audit each separately. Neither is the final page image, so **both bottom edges must remain open**; Slice 02 must not look like the end of the page merely because it is the second image in the preview.

### Product Identity

- Is the product authentic and consistent?
- Did the SKU, shape, color, or material drift?
- Are the logo and construction correct?

### Copy

- Does the copy match text_exact?
- Are spelling, technical specifications, and units correct?
- Are there garbled characters, internal fields, or unwanted screen numbers?

### Claim Safety

- Were unverified parameters, certifications, performance figures, commercial claims, awards, or brand partnerships added?

### Commercial Quality

- Does the image look like a real ecommerce detail page?
- Does it look obviously AI-generated, sketch-like, slide-based, infographic-like, or like a cheap promotional poster?
- Is the product sufficiently sharp, with professional visual hierarchy?

### Continuity

- Do Slices 01 and 02 look like parts of the same long page?
- Are lighting, typography, product depiction, and background world consistent?
- Is the vertical transition convincing?
- Do the previous slice's bottom edge and the next slice's top edge join naturally?
- Does the page-level title appear only once, in Slice 01?
- Does Slice 02 restart with a page title, product-introduction title, or independent hero?
- Does any slice end with a footer, repeated logo, contact information, CTA, or separate sign-off?
- Does Slice 01 continue naturally at its bottom instead of ending like a complete page?
- Does Slice 02 begin as a direct continuation and keep its own bottom edge open, without blank space, fading, or a completed composition?
- Do content modules continue naturally across slice boundaries?
- Are there any headers, footers, repeated logos/title bars, corner ornaments, borders, or slide-like frames?
- Has any slice been designed as a self-contained poster?
- Does the page avoid repeating full-size heroes?

**If any critical check fails, revise before proceeding to the approval stage.**

## 17. Two-Slice Preview

After both slices pass their internal audits, create a **2-slice concat preview**.

The preview serves only to evaluate continuity. Creating it must not alter the final slices through:

- Added blurred backgrounds
- Added borders
- Re-layout
- Product changes
- Copy changes
- Ratio changes

The preview should simply concatenate the actual finished images as they are.

## 18. Approval Gate 2

Present together:

- The 1:3 Visual Master (if used)
- Slice 01
- Slice 02
- The 2-Slice Preview
- A brief audit

Then **stop and wait for the user's second approval**.

## 19. After the second approval

Only after the second approval may you begin generating **Slices 03–08, one image at a time**. Never batch-generate the remaining slices.

After each image, inspect that `bottom_edge_mode` is `open`, the `continuity_carrier` visibly continues beyond the frame, and `next_slice_handoff` is concrete. Generate the next slice only after the current one passes.

Continue following the approved Blueprint, Text Master, Product Identity Lock, Visual Style DNA, and Visual Master.

Do not redesign the visual system halfway through.

## 20. Full-page Audit

After completing all eight slices, create a full concatenated preview and check:

### Product Consistency

Does the product retain the same identity throughout?

### Text Accuracy

Are all copy, technical specifications, numbers, and units accurate?

### Claim Continuity

Can every central selling point be traced back to the page-level claim seeds?

### Visual Continuity

Does it read as one continuous long page?

### Page-First Integrity

- Does the primary title / H1 appear exactly once, in the first image?
- Do intermediate images avoid restarting the product introduction or hero?
- Are all slices free of footers, repeated logos, contact bars, and independent sign-offs?
- Does every non-final slice use `bottom_edge_mode: open`, with only the final slice set to `closed`?
- Does every non-final slice have a concrete `continuity_carrier` and `next_slice_handoff`?
- Does a CTA appear at most once, at the actual end of the complete page?
- Does every image continue the previous image instead of starting with its own title and ending with its own footer?


### Composition Variety

Do successive screens avoid repeating the same layout?

### Unsupported Claims

Is there any assertion the user has not confirmed?

### Commercial Readiness

Ask:

> Could I place these eight images directly on a real product page without explaining the production process to a customer?

If not, the work does not pass final acceptance.

## 21. Failure criteria

Stop production rather than continuing if any of these occurs:

- AI changes the product into a different product.
- Product construction is clearly wrong.
- Logo, packaging, or patterns are wrong.
- Important copy or specifications are incorrect.
- Unverified certifications or claims appear.
- Visual style differs materially from the approved reference.
- Every image looks like an independent poster or PowerPoint slide.
- The long-page continuity disappears.
- Every image repeats its own title and footer.
- Intermediate images restart the product introduction, hero, or an independent CTA.
- Any non-final image ends visually through blank space, fading, a completed card grid, or another closing composition.
- Slices 03–08 are batch-generated instead of being generated and inspected one at a time.
- Final images are cut out of a low-resolution overview.
- Blurred padding is used to force the aspect ratio.
- Results are obviously only sketch-quality.

**"Generated" does not mean "approved for quality."**

## 22. Revision principles

Prefer the smallest effective revision:

- Copy error → repair only the text layer.
- Product error → repair only the product layer.
- Background error → repair only the setting/background.
- One-slice composition issue → revise only that slice.
- A non-final slice has a closed bottom edge → revise that slice to create an open edge, then recheck the next slice's top transition.
- Transition between adjacent slices → fix the neighboring transition.
- Widespread style drift → return to the Visual Master.
- Incorrect selling-point logic → return to the Blueprint.

Do not regenerate the entire set by default.

Do not conceal failures with blur, mirroring, forced enlargement, borders, cropping out the problem, excessive filler icons, or recutting an overview.

## 23. Final deliverables

Deliver:

- Approved Visual Master, if used
- High-resolution final Slices 01–08
- 2-Slice Preview
- Full-resolution Long-page Concat
- Lightweight Long-page Preview
- ZIP Package

File names may use:

- product_screen_01.png
- product_screen_02.png
- ...
- product_screen_08.png

File numbering does not imply that the number must appear inside the artwork.

## 24. Default international-market requirements

Unless I explicitly specify otherwise:

- Use English for all buyer-visible copy.
- Follow international B2B/ecommerce visual conventions.
- Keep claims specific, restrained, and credible.
- Avoid cheap promotional styling.
- Avoid generic AI marketing language.
- Avoid slide, infographic-template, or brochure aesthetics.
- Invent no technical or commercial claims.
- Never sacrifice product authenticity for visual impact.
- Do not add irrelevant selling points to fill empty space.

## 25. Prohibition on sequential slice numbering

Do not display sequential slice numbers in the final buyer-visible artwork, for example:

- Screen 1 showing "1", "01", "Screen 1", or "01 Product Overview"
- Screen 2 showing "2", "02", or "Screen 2"
- Screen 3 showing "3" or "03"
- ...
- Screen 8 showing "8" or "08"

"Eight-slice" describes the internal file-production process, **not** a buyer-visible numbering system.

Allowed:

- Filename: product_screen_01.png
- Blueprint field: slice_id: 01
- Production-management label: Slice 01
- Actual instructional steps: 1 / 2 / 3 / 4
- Real specification, model, or quantity numbers

Not allowed:

- Sequentially labeling all eight buyer-visible panels 01–08
- Decorating the top-left corner with large page numbers
- Using "01 / PRODUCT OVERVIEW" as a decorative headline
- Using "02 / FEATURES" or "03 / APPLICATIONS" as artificial section numbers
- Displaying eight sequential numbers just because this is an eight-slice workflow

Unless I explicitly request numbered sections, no final detail image should carry a sequential page-number motif.

The goal is a **professional, authentic, continuous ecommerce product detail page ready to publish**.

I will now provide the product photographs and product information.

**Begin strictly with DetailFlow's Analyze Inputs stage.**

<!-- prompt:end -->
