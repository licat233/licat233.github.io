# Product Detail Designer — Page-First Eight-Slice Ecommerce Detail Page Workflow

<!-- prompt:begin -->

Use the Product Detail Designer Skill to create my product detail page. This prompt is designed for the standard ChatGPT chat window.

**Product Detail Designer Skill v1.0.6 (selected open-source release):**
- GitHub repository: https://github.com/licat233/product-detail-designer
- Selected version: `v1.0.6`
- Skill file: https://raw.githubusercontent.com/licat233/product-detail-designer/v1.0.6/SKILL.md

Read the `SKILL.md` from this exact release and follow its general execution rules.

**This prompt is the authoritative production brief and takes precedence over the Skill's generic defaults.** The requested page count, blueprint, 1:3 visual master, approval gates, final image ratio, and deliverables are defined by this prompt. The Skill provides general safeguards for product identity, factual accuracy, visual consistency, image generation, and quality review. Do not add dependencies, separate background assets, HTML, scripts, extra approval gates, or other intermediate steps that this prompt does not request.

Also verify that this ChatGPT session has an actually invokable image-generation capability. If it does not, state the limitation plainly and do not pretend to generate images.

## Production brief confirmation (Product Detail Designer v1.0.6)

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

## 4. Product Identity Lock — P0 Product Appearance Integrity

The real product is the subject of the page, not a visual suggestion for the image model. Product identity is a non-negotiable P0 acceptance condition, not a weighted design score. A beautiful image that depicts a different product is a failed deliverable.

### Build an internal Product Identity Lock

Before planning the page, establish a compact internal identity record from the supplied evidence. Do not turn it into a form the user must fill in or an unsolicited long report.

Record:

- `product_identity`: exact product name, model, version, and visually similar variants that must not be mixed.
- `identity_anchor_assets`: filenames or asset IDs of original, unedited product photographs. Original CAD/product renders may be identity anchors only when the user confirms they are current and exact.
- `supporting_visual_assets`: genuine close-ups, additional views, installation photos, and application photos.
- `identity_markers`: visible silhouette and proportions; component count and arrangement; distinctive geometry; ports, connectors, fasteners, markings, logos, and labels; color, finish, texture, material appearance, included parts, and assembly relationships.
- `unknown_or_unseen`: sides, internal structures, hidden parts, colors, dimensions, or details that the supplied evidence does not establish.
- `forbidden_changes`: identity markers that must not be added, removed, reshaped, recolored, relocated, or replaced.

If the model or variant is ambiguous, or two assets appear to show different versions, ask one concise question before generating product imagery. Never silently combine them.

### Keep the three reference roles separate

1. **Product identity anchors** — Original product photos and genuine close-ups establish the real appearance. CAD/product renders may be anchors only when the user confirms they are current and exact. Engineering drawings may establish documented geometry and component relationships.
2. **Page-continuity reference** — The previously accepted slice establishes only the page background, scene, composition, lighting, perspective, and content handoff. It is not a source of truth for product geometry, color, construction, markings, or component count.
3. **Visual-style reference** — Design material explicitly designated by the user guides only the visual aspects the user wants it to guide; it never overrides product identity.

Original product identity anchors always take precedence over generated images and page-continuity references. Never promote an AI-generated slice, Visual Master, 1:3 continuity master, moodboard, or previous AI rendering into an authoritative product reference. Any product depiction inside a Visual Master is illustrative unless it is the untouched original source photo.

For every product-bearing slice, include the relevant original identity anchor(s) whenever the tool supports multiple references. If the tool accepts only one image reference, prioritize the original product identity anchor and describe page continuity through written handoff. **Product identity outranks page continuity.**

### Choose a product-depiction mode for each slice

Set an internal `product_depiction_mode` for every slice that shows the product:

- **`original-photo` — safest default.** Use the actual supplied product photograph. Non-destructive cropping and uniform scaling are acceptable when they do not hide or distort identity-critical details.
- **`source-photo-composite`** — Keep the original product photo or cutout as the foreground subject and create the surrounding scene separately. Use masking/layers only when the tool actually supports them and the original product pixels can remain unchanged. A reference-based redraw is not a pixel-preserving composite.
- **`constrained-edit`** — Edit from the actual source image only when the tool supports it and the change does not require inventing a new product view. Inspect the result against the original anchor.
- **`evidence-based-diagram`** — Build a schematic from an authoritative drawing or clearly visible structure. Preserve engineering meaning; never present an inferred diagram as a product photograph.
- **`no-product-depiction`** — When evidence is insufficient, use copy, typography, application context, or a neutral explanatory visual rather than inventing unseen details.

Prefer `original-photo` whenever it communicates the point clearly.

### P0 appearance verification and recovery

Compare every generated product depiction side by side with its original identity anchor(s), not merely with the previous generated slice.

- **Critical — automatic fail:** wrong model or variant; changed functional structure; missing, extra, duplicated, or merged component; altered connector, port, or assembly; invented or removed identity-defining part; or any change that could make the image depict a different product.
- **Major — fail:** clearly changed silhouette, proportions, component spacing or placement, product color/material/finish, labels, logo, model marking, or other recognisable construction detail.
- **Minor — review:** background, surrounding props, lighting outside the product, or a crop/composition issue that does not alter or conceal an identity marker. If a reflection, shadow, or crop makes a critical feature unverifiable, it is not a minor pass.

The P0 result must be **PASS / FAIL / UNVERIFIED**. Any Critical or Major discrepancy, or any unverified critical marker, means FAIL. A high visual-design score cannot override a P0 failure.

When a depiction fails, reject it as a product-accurate deliverable. Prefer replacing the product region with the original photo or rebuilding the composition around the untouched source. If reliable compositing is unavailable, revert to `original-photo` or `no-product-depiction`; do not keep prompting the model to redraw inaccurate geometry. Recheck any following slice that used the rejected image as a continuity reference, and continue only from the last accepted slice. If the evidence is insufficient, request the specific missing real photo or drawing.

Never pass a failed or unverified product depiction forward as an accepted reference.

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
- `top_edge_mode` / `bottom_edge_mode`: non-final slices use `open`, and only the final slice uses `closed`; open means the page content continues and does not require an object to cross the edge.
- `continuity_strategy`: choose `canvas-extension`, `reference-continuation`, or `tonal-continuity` according to actual tool capability.
- `continuity_intent`: how this slice relates to the preceding and following content and scene.
- `next_slice_handoff`: the actual visual and content state the next slice should continue, derived from the previous accepted image.
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

**The design unit is one complete vertical ecommerce page. Image files are only delivery slices of that page.** Do not design eight unrelated canvases and disguise them as one long page by reusing colors, backgrounds, or typography.

### 1. Open the page once; do not restart it in every image

- The complete page has one primary title / H1 only, placed at the beginning of Slice 01.
- Slices 02–08 must not repeat the product-introduction title, page headline, standalone hero headline, brand title bar, or page masthead.
- Intermediate slices may contain genuine in-flow section headings, but these must not become a repeated title area.
- Do not add a website footer, contact-information bar, repeated logo, repeated product-name bar, copyright strip, or decorative sign-off to any slice.
- The final slice may contain one CTA at the actual end of the complete page, but it is page content, not a repeated footer.

### 2. File boundaries are not section boundaries

Plan the complete page before choosing slice boundaries. Content modules may cross boundaries, and adjacent slices may continue the same feature, scene, or visual thread. Intermediate images do not need to be independently complete, but cut lines must not sever copy, specifications, labels, or critical product details.

### 3. No per-image title or footer

Repeated large titles or product introductions at the top, repeated footers / logos / contact details / CTAs / summaries at the bottom, or a fixed “title + content + closing” structure on every image are failures. Do not frame each image as an independent poster, slide, or complete advertisement.

### 4. Choose continuity strategies based on actual image-tool capability

Choose an internal `continuity_strategy` for every slice boundary:

1. **`canvas-extension`** — Use only when the current image tool explicitly supports extending the existing canvas / outpainting while preserving the original area. Do not assume this capability exists merely because the tool accepts a reference image.
2. **`reference-continuation`** — Use when the tool can reference a previous image but does not provide verified canvas extension. Use the previously accepted image as a page-continuity reference and describe the handoff. This is visual continuation, not a promise of pixel-perfect edge matching.
3. **`tonal-continuity`** — Use when the content naturally moves into a different scene or forcing the previous physical scene to continue would look artificial. Maintain coherent palette, lighting, material language, spatial depth, and hierarchy so the transition still feels like the same ecommerce page.

### 5. Continuity and boundary acceptance

- `top_edge_mode`: `opening` for Slice 01; `continuation` for Slice 02 onward.
- `bottom_edge_mode`: `open` for every non-final slice; `closed` only for the final slice. Open means the page content and visual flow continue; it does not require a physical object to cross the edge.
- Internally record `top_edge_anchor`, `bottom_edge_anchor`, `continuity_intent`, and `next_slice_handoff`. Derive the handoff from the actual previously generated and accepted image; “same style” alone is not enough.
- Do not force a physical object to cross every non-final bottom edge. Do not reserve a fixed 10–15% bottom strip or add artificial cables, rails, surfaces, or other objects to satisfy a mechanical seam rule.
- A continuous surface, line, shadow, or light strip may reach an edge when it naturally belongs to the scene, but it is optional.
- Non-final slices must avoid visual closing cues such as summaries, sign-offs, CTAs, footers, fades to blank, or completed compositions. Natural content and scene transitions are allowed; a visual page ending is not.
- Keep important copy, specifications, labels, and critical product geometry away from crop boundaries.
- Only the final slice may use `bottom_edge_mode: closed` and conclude the complete page.

### 6. Continuity capability and honesty

If the user requires pixel-level continuity or seamless canvas extension and the available tool cannot reliably provide it, explain the limitation before proceeding. Never describe reference-based generation as pixel-preserving outpainting or guarantee a seamless join without verification. Generate one slice at a time; use a slice as the next page-continuity reference only after it passes review.

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

Once the master passes review, produce Slice 01 and Slice 02. The default final aspect ratio is **9:21 vertical**, unless the user specifies otherwise.

Save the final images as separate high-resolution files, but generate them one at a time in sequence; never batch-generate Slices 03–08.

Every product-bearing slice must include its relevant original product identity anchor(s) and pass the P0 appearance check in Section 4. The previously accepted image is only a page-continuity reference; it must not replace the original product asset. If the tool accepts only one image reference, prioritize the original identity anchor and describe the previous page state and handoff in text.

Choose `canvas-extension`, `reference-continuation`, or `tonal-continuity` for each boundary according to actual tool capability. Use outpainting only when the tool explicitly supports extending the existing canvas while preserving its original area. Ordinary reference-based generation does not guarantee pixel-perfect edge matching. Do not force a physical object to cross the bottom edge or reserve a fixed 10–15% continuation strip.

Every non-final slice must use `bottom_edge_mode: open`; the final slice must use `closed`. Open means the page content continues, not that an object must cross the image boundary. Intermediate images must not contain an independent sign-off, summary, CTA, footer, fade-to-blank, or completed page composition.

After each image, inspect P0 product identity, copy and factual accuracy, the chosen continuity strategy, and the next-slice handoff. Repair any failed check before continuing. A failed or unverified product depiction must never be used as the next image's reference. Continue only from the last accepted slice.

Do not directly turn the 1:3 master, an overview graphic, contact sheet, moodboard, Blueprint illustration, low-resolution sketch, or preview into a finished slice. If the composition does not match the final aspect ratio, recompose it, adjust the layout, regenerate the environment, or use canvas extension when supported. Do not force the ratio through blurred padding, mirroring, stretching, arbitrary enlargement, low-resolution crops, or oversized borders.

## 14. Authentic product asset usage — P0

Authentic product photos are the preferred evidence of product identity. Default to `original-photo`: use real product assets with AI-generated settings and environments plus professional layout, rather than asking the model to redraw a vaguely similar product.

- **Direct use of the original photo:** Non-destructive cropping and uniform scaling are acceptable. Do not use non-uniform stretching, perspective warping, or retouching that changes product construction.
- **Compositing the original photo into a scene:** Use only when the tool supports masking/layers and the original product pixels can remain unchanged. Reference-image input followed by a generative redraw is not pixel-preserving compositing.
- **Constrained editing:** Use only when the tool can edit from the actual source image and the change does not require an unseen angle or unsupported construction. Compare the result with the original anchor afterward.
- **Technical diagrams:** Base them on authoritative engineering drawings or clearly visible structures. Distinguish a diagram from an authentic product photograph.
- **Insufficient evidence:** Use `no-product-depiction` or request the specific real photo / engineering drawing needed. Never guess a rear view, internal structure, connector, or hidden component.

Protect the product's shape, color, logo, material, pattern, ports, component count, spatial relationships, construction, and packaging text. Compare every product depiction side by side with its original identity anchor and record PASS / FAIL / UNVERIFIED. Do not excuse product drift because the overall image looks good, and never pass a failed or unverifiable depiction to a later slice.

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

After generating the first two slices, audit each separately. Every product-bearing slice must pass its own P0 appearance check; do not merely compare whether the two images look similar.

### Product Identity (P0)

- Does the depiction show the exact product model / variant?
- Was it checked against the relevant original identity anchor?
- Are silhouette, proportions, color, material, and finish consistent?
- Are component count, arrangement, spacing, ports, solder points, markings, and logo correct?
- Has any unsupported angle, hidden structure, or extra component appeared?
- Is the P0 result PASS?

P0 must be marked PASS / FAIL / UNVERIFIED. Any Critical / Major discrepancy or unverified critical marker is a failure. A failed image must not enter the preview or be used as the next slice's page-continuity reference.

### Copy

- Does the copy match text_exact?
- Are spelling, specifications, numbers, and units correct?
- Are there garbled characters, internal fields, or unwanted screen numbers?

### Claim Safety

- Were unconfirmed specifications, certifications, performance figures, or commercial claims added?
- Have creative inferences been presented as verified product facts?

### Commercial Quality

- Does the image look like a usable ecommerce detail page?
- Does it look obviously AI-generated, sketch-like, slide-based, templated, or like a cheap promotional poster?
- Is the product clear, with professional visual hierarchy?

### Continuity

- Do Slices 01 and 02 belong to the same page?
- Are lighting, typography, background world, visual direction, and content flow coherent?
- Was the continuity strategy selected according to actual tool capability?
- Is the handoff based on the previous image that was actually generated and accepted?
- Is reference continuation honestly distinguished from pixel-level canvas extension?
- Does the page avoid the PowerPoint rhythm of every image restarting and ending independently?
- Are repeated titles, footers, contact bars, and independent sign-offs absent?
- Were physical continuity carriers and fixed bottom strips avoided as mandatory requirements?

Revise any failed critical check before proceeding to approval. Do not sacrifice product authenticity or natural composition to satisfy mechanical stitching rules.

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

Only after the second approval may you begin generating Slices 03–08, one image at a time. Never batch-generate the remaining slices.

For every product-bearing slice, attach the relevant original identity anchor(s) again and complete the P0 appearance check. The previously accepted slice is only a page-continuity reference. After each image, inspect P0 product appearance, copy and factual accuracy, the selected continuity strategy, `bottom_edge_mode` (open for non-final slices, closed for the final slice), and the next-slice handoff.

Generate the next slice only after these checks pass. A failed or unverifiable image must never be used as the next reference. Repair it and continue from the last accepted slice.

Continue following the approved Blueprint, Text Master, Product Identity Lock, Visual Style DNA, and Visual Master. Do not redesign the visual system halfway through.

## 20. Full-page Audit

After completing all eight slices, create a full concatenated preview and inspect the complete reading experience. The preview reviews page flow; it does not mean every boundary must join pixel-perfectly.

### Product Consistency (P0)

Compare every product-bearing slice with its corresponding original identity anchor. Check model, variant, silhouette, proportions, color, material, component count, construction, logo, and markings. There must be no Critical / Major discrepancy or unverified critical marker, and every product depiction must have P0 PASS. If any depiction is FAIL or has an unverified critical marker, the complete page cannot pass final acceptance.

### Text Accuracy

Are all copy, specifications, numbers, and units accurate and consistent with the approved text_exact?

### Claim Continuity

Can every central selling point be traced back to the page-level claim seeds?

### Visual Continuity

Does the set read as one naturally scrolling ecommerce page? Natural scene changes are allowed, but the images must not become unrelated posters or slides.

### Page-First Integrity

- Does the primary title / H1 appear exactly once, in the first image?
- Do intermediate images avoid restarting the product introduction or hero?
- Are all slices free of footers, repeated logos, contact bars, and independent sign-offs?
- Does every non-final slice use `bottom_edge_mode: open`, with only the final slice set to `closed`?
- Was a continuity strategy chosen for every boundary according to actual tool capability?
- Is each handoff derived from the previous image that was actually generated and accepted?
- Does the page avoid the PowerPoint rhythm of every image starting with its own title and ending with its own footer?
- Were physical continuity carriers and fixed bottom strips avoided as mandatory requirements?

### Composition Variety

Do successive screens avoid repeating the same layout without forcing meaningless variation?

### Unsupported Claims

Is there any assertion the user has not confirmed?

### Commercial Readiness

Ask:

> Could I place these eight images directly on a real product page without explaining the production process to a customer?

If not, the work does not pass final acceptance.

## 21. Failure criteria

Stop production rather than continuing if any of these occurs:

- Any product-bearing slice has a P0 result of FAIL or an unverified critical identity marker.
- The model or variant is wrong, or AI has changed the product into a different product.
- Product construction, component count, spatial relationships, logo, packaging, or patterns are wrong.
- A previous AI image has replaced the original product identity anchor, or a failed depiction has been passed to a later slice.
- Important copy, specifications, or units are incorrect.
- Unconfirmed certifications, functions, or commercial claims appear.
- The visual style differs materially from the approved reference.
- Every image looks like an independent poster or PowerPoint slide and page continuity disappears.
- Every image repeats its own title and footer.
- Intermediate images restart the product introduction, hero, or an independent CTA.
- Any non-final image ends with a clear visual sign-off, fade, blank ending, or completed page composition.
- No continuity strategy was selected for the actual tool capability, or the next handoff contradicts the previous image.
- Slices 03–08 are batch-generated instead of being generated and inspected one at a time.
- Final images are cut out of a low-resolution overview.
- Blurred padding is used to force the aspect ratio.
- Results are obviously only sketch-quality.

**“Generated” does not mean “approved for quality.” P0 product authenticity cannot be compensated for by visual polish.**

## 22. Revision principles

Prefer the smallest effective revision:

- Copy error → repair only the text layer.
- Product error → repair only the product layer.
- Background error → repair only the setting/background.
- One-slice composition issue → revise only that slice.
- A non-final slice reads as a visual ending or its handoff does not match → revise it using the selected continuity strategy, then recheck the next slice's transition.
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
