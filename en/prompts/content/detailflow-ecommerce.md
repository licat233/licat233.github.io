# DetailFlow Ecommerce Product Detail Page Prompt V2.0

<!-- prompt:begin -->

Use the DetailFlow Skill strictly to create a professional ecommerce product detail page.

**Official DetailFlow Skill repository (use this current URL):**
https://github.com/AJbeckliy/detail-flow-V2-Ajie

## 1. Before execution: load the latest Skill

Before starting, you must:

1. Read the complete SKILL.md of the currently installed DetailFlow Skill.
2. Confirm that the locally installed version matches the current official version. If it is outdated, update it according to the official installation instructions, then verify the actual installation path and version.
3. Read the latest reference documents relevant to this task, especially:
   - references/reviewed-workflow.md
   - references/visual-planning.md
   - references/copy-review-editor.md
   - references/unified-executor.md
   - references/starcanvas-execution.md
4. Strictly follow the workflow, data structures, executor, image-generation process, and revision methods currently specified by the Skill.

Rule priority:

- The DetailFlow Skill governs workflow, technical execution, review mechanisms, image generation, revisions, and file management.
- This prompt defines product authenticity, commercial accuracy, content requirements, visual preferences, approval authority, and delivery requirements.
- If the two conflict, do not combine old and new rules arbitrarily. Follow the current Skill for workflow and the facts confirmed by the user for product information.

Do not continue using obsolete workflows, outdated task packages, or deprecated generation procedures.

## 2. Core task

Create a complete **8-screen ecommerce product detail page**.

Default settings:

- Number of screens: 8
- Aspect ratio: 9:16
- Final copy: English
- Target market: international markets
- Visual positioning: professional, authentic, commercial-grade ecommerce detail pages

Use these defaults unless I explicitly specify otherwise.

### Overall page requirements

All eight screens must belong to one coherent visual system, with consistent:

- Brand visual language
- Color system
- Lighting and material treatment
- Typography
- Information hierarchy
- Page margins
- Visual rhythm

However, each screen is an independent content panel. Pixel-perfect continuity between the top and bottom edges is not required. Do not add repeated edge decorations just to create the illusion of a continuous long image.

Do not turn the eight screens into:

- Eight unrelated promotional posters
- Eight PowerPoint slides
- Eight infographics
- Eight social media ads
- Eight product images that mechanically reuse the same template

Keep one coherent visual system, but let each screen's content determine its composition.

## 3. Product information and factual accuracy

Product authenticity and commercial accuracy take priority over visual creativity.

Handle information in this order:

1. Product facts explicitly confirmed by the user.
2. Official product specifications, manuals, packaging information, and other formal documents supplied by the user.
3. Authentic product photos, videos, and physical product materials supplied by the user.
4. Product information and copy already confirmed by the user.
5. Information that can be directly observed in authentic product photos.
6. Reasonable creative suggestions proposed by AI based on the product category, images, and buyer needs.

Classify the analysis results into four categories:

**A. Confirmed Facts**

Facts explicitly confirmed by the user or formal documentation.

**B. Observed Facts**

Facts directly observable from authentic product images.

**C. Reasonable Creative Inferences**

Reasonable selling points, scenarios, and creative expressions proposed by AI based on the product category, appearance, and buyer needs.

These inferences may inform creative planning, but must never be presented as verified product functions or technical facts.

**D. Unknown / Do Not Invent**

Information that cannot be confirmed, conflicts across sources, or lacks supporting evidence.

If sources conflict:

- Identify the conflict clearly.
- Do not arbitrarily choose one version as fact.
- Record the issue in risk_unknowns.
- Do not put information that affects product authenticity or commercial accuracy into final copy until it is confirmed.

Never invent:

- Technical specifications, performance figures, or test results
- Unconfirmed materials, functions, or product construction
- Certifications, awards, or patents
- Medical or efficacy claims
- Sales figures, conversion rates, or market rankings
- Brand partnerships
- Discounts or promotional commitments
- Warranty, MOQ, lead-time, or shipping commitments
- Package contents or accessory quantities

You may propose reasonable marketing ideas, but must not disguise creative ideas as verified product facts.

## 4. Product Identity Lock

Once authentic product images are provided, establish a Product Identity Lock.

Lock the characteristics relevant to the specific product, including:

- Overall shape and proportions
- Length, width, and thickness
- Actual color
- Material and surface texture
- Logo and brand marks
- Packaging and printed graphics
- Buttons, openings, and ports
- Screens, knobs, and connection structures
- Accessories, brackets, and special components
- Product quantity and spatial relationships between components

Do not require the complete product to appear on every screen.

For each screen, explicitly choose how the product is represented:

- **primary**: the product is the main visual subject of the screen.
- **secondary**: the product appears as a supporting recognition element.
- **absent**: the complete product is not shown on this screen; product materials are used only to verify identity.

A real-product detail screen must show the corresponding authentic details. Do not replace them with AI-invented internal structures or nonexistent components.

When authentic product assets are sufficient, prioritize:

Authentic product assets + AI-generated settings and environments + professional layout.

Never change the product's SKU identity to make an image look more attractive.

## 5. Reference image analysis

Product images, people images, style references, and composition references must be treated as different reference roles.

Follow DetailFlow's reference-asset management rules. Define each image's role, intended use, and elements that must not be transferred.

If style references are provided, focus on the visual characteristics that genuinely affect this set of pages:

- Color and tonal relationships
- Lighting direction
- Material treatment
- Camera angles and shot types
- Composition and spatial depth
- Product scale within the frame
- Typography and information hierarchy
- Information density and negative space
- Visual variation between screens

Do not mechanically copy reference-page layouts. Do not place headlines, images, and text boxes in the same positions on every screen.

Do not copy other brands, trademarks, original products, text, or personal identities from reference images.

By default, translate style references into a written visual specification first. Use selected and approved style or composition reference images only when they genuinely help.

If no style reference is supplied, propose a visual direction based on the product, target buyers, and screen content. Clearly identify it as an AI design proposal.

## 6. Eight-screen Blueprint

Create eight screens by default.

Each screen must clearly define:

- buyer_question
- screen_job
- Main information
- Product presentation method
- Evidence source
- Copy structure
- Visual composition
- Information hierarchy

Use the Blueprint Schema currently specified by the DetailFlow Skill. Do not reuse deprecated fields or create a duplicate planning system.

Follow the Skill's current 19 planning fields and provide layout.blocks in the same Blueprint as required for layout review and the HTML editor.

### Claim Seeds

Screen 01 must establish 2–4 core Claim Seeds first.

All subsequent selling-point screens must develop these core claims through:

- Explanation
- Demonstration
- Proof
- Scenarios
- Comparison
- Trust building

Do not invent a new selling point on every screen.

Buyer-service information such as size charts, usage instructions, and care instructions may have its own buyer_question. Do not force it into a marketing claim.

### Screen differentiation

Every screen must have its own information task.

Choose compositions according to the content. Do not prescribe eight fixed templates in advance.

Avoid mechanical repetition of:

- Headline + subtitle + three icons
- A centered product hero
- The same card layout
- The same camera angle
- The same information density
- The same copy rhythm

Create meaningful variation through shot scale, camera angle, visual focus, text placement, information density, and the relationship between the product and its setting.

Do not force meaningless variation just to make screens look different. Pages suited to product comparison may deliberately use a consistent layout.

## 7. Final copy requirements

During planning, explain the design proposal to me in Chinese.

By default, use English copy in the final images for international buyers.

Final copy must be:

- Specific, concise, and easy to understand
- Written in natural commercial English
- Free from generic AI marketing language
- Free from exaggerated or empty adjectives
- Free from unnecessary technical jargon
- Focused on the product's actual value

text_exact is the sole authoritative source for final copy.

Product names, model numbers, specifications, dimensions, units, parameters, steps, and CTAs must be accurate.

Do not let the image-generation model freely rewrite copy that has already been confirmed.

Final images must not display internal workflow fields such as:

- slice_id
- module_type
- screen_job
- claim_seed
- evidence_type
- Blueprint
- Product Overview
- Feature Breakdown
- Parameter Trust

### Prohibition on sequential screen numbers

Do not display sequential screen numbers in buyer-visible final images, including:

- 01 / 02 / 03
- Screen 01
- 01 Product Overview
- 02 Features
- 03 Applications

Screen numbers are only for file management and internal workflows.

Numbering required by the actual content, such as instructional steps, specification references, model numbers, and quantities, is allowed.

## 8. Design review and approval

After completing Analyze Inputs, continue with the planning and design-review workflow required by the latest Skill.

The first and only routine design approval must include:

1. Product-asset analysis.
2. The complete eight-screen Blueprint.
3. The overall visual specification (visual_master_spec; this is a written specification, not an image master).
4. Accurate English copy for every screen.
5. The layout and composition plan for every screen.
6. Layout sketches required by the Skill.
7. An editable HTML review page.

### HTML review requirements

The HTML page must support:

- Editing page copy
- Adjusting text positions
- Resizing text boxes
- Adjusting layouts
- Adding or removing necessary modules
- Exporting the revised result

Actually build the review HTML and try to present it through an available browser or file-opening method.

Provide an HTML link or file path that I can actually access.

Do not present a written proposal or static PNG as a substitute for an editable review page.

If the current environment genuinely cannot provide the review capabilities required by the Skill, state exactly what is missing and pause for resolution. Do not pretend the requirement has been met.

Exporting the review page does not mean I have approved image generation.

After presenting the review materials, stop and wait for my explicit approval.

## 9. Final image production

Only after receiving my explicit approval may you begin final image generation.

Strictly use the current DetailFlow execution process:

- Prioritize Starcanvas MCP.
- Use the Unified Executor built into the Skill.
- Use the approved product assets with their correct reference roles.
- Use the approved Blueprint and text_exact.
- Follow the model, aspect ratio, parameters, and task-execution method specified by the current Skill.
- By default, submit the complete eight-screen final-image task in one batch.
- Respect actual service concurrency limits.

Do not write another image-generation executor or reimplement capabilities already provided by the Skill.

If Starcanvas encounters a genuine blocking issue:

- Explain the specific error.
- Preserve existing work.
- Pause tasks that depend on the blocked capability.
- Do not silently switch to another image-generation tool.
- Obtain my explicit approval before using another generation backend.

### Processes that must not be added by default

Unless I explicitly request them:

- Do not generate a 1:3 image master.
- Do not generate two formal images as a preliminary test.
- Do not add a second visual approval stage.
- Do not require approval of each image before generating the next one.
- Do not generate extra paid preview images for internal inspection.

If I explicitly ask to see a visual preview first, use the optional preview workflow provided by the Skill. A preview cannot replace a formal image or serve as a substitute for final image review.

## 10. Final image quality audit

After all eight screens have been generated, inspect every original image and review the complete set in vertical order.

### 1. Product Identity

- Is the product shape correct?
- Is the SKU consistent?
- Have color or material characteristics drifted?
- Is the logo correct?
- Are any key components missing or added?
- Are the packaging and accessories correct?

### 2. Text Accuracy

- Does the copy match text_exact?
- Is the spelling correct?
- Are parameters, numbers, and units accurate?
- Are there garbled or missing characters?
- Are there unwanted sequential screen numbers?
- Are any internal workflow fields visible?

### 3. Claim Safety

- Have any product functions been invented?
- Have any technical specifications been invented?
- Are there unconfirmed certifications?
- Are there unconfirmed performance or commercial claims?
- Have inferences been presented as verified facts?

### 4. Visual Quality

- Does the work follow the approved overall visual specification?
- Does it have the quality of professional commercial photography?
- Is the product sufficiently clear?
- Is the information hierarchy reasonable?
- Is the copy easy to read?
- Are there obvious AI-generation artifacts?
- Does it look like a low-quality promotional poster or templated infographic?

### 5. Set Coherence

- Are color and tonal relationships consistent across the set?
- Are typography, spacing, and margins consistent?
- Is the product identity consistent?
- Is the information sequence reasonable?
- Is there obvious composition repetition?
- Has the visual style drifted?
- Does every screen genuinely serve a different buyer question?

### Quality decision

Inspect the technical quality, copy, product identity, and composition of each image separately. Also review the consistency of the complete set.

When an issue is found, record:

- Which screen contains the issue
- The specific error
- The level or category of the issue
- The smallest effective revision

Do not treat successful image generation as proof that image quality has passed.

## 11. Revision rules

Follow the current DetailFlow original-canvas revision mechanism.

Fix the smallest responsible scope first:

- Copy error: correct the copy layer.
- Product error: correct the product reference and product representation.
- Background error: revise only the background or setting.
- Single-screen composition issue: revise only the affected screen.
- Multi-screen style drift: revise the affected screens.
- Selling-point logic issue: return to the Blueprint.

You must:

- Preserve the original images.
- Preserve historical generation prompts.
- Add revision nodes to the original canvas.
- Preserve revision reasons and source records.
- Never overwrite images that have already passed review.

Obtain my approval before any additional paid generation or revisions beyond the already authorized revision allowance.

Do not conceal problems by blurring, stretching, mirroring, arbitrarily enlarging, or cropping away the incorrect area.

## 12. Final delivery

After all reviews pass, deliver:

1. Eight separate high-resolution final images.
2. A complete vertically concatenated long image (concatenate the panels in order as they are; pixel-perfect seamless continuity is not required).
3. A lightweight long-image preview.
4. A complete ZIP delivery package.

File names:

- product_screen_01.png
- product_screen_02.png
- product_screen_03.png
- product_screen_04.png
- product_screen_05.png
- product_screen_06.png
- product_screen_07.png
- product_screen_08.png

Also:

- Preserve the original resolution of the final images.
- Never substitute preview images for final images.
- Do not include discarded versions in the final package.
- Confirm that every delivered file actually exists.
- Provide the delivery directory and file links.
- Briefly report the audit result, image count, and unresolved issues.

The long image is only a vertical combination of eight independent content panels. Do not claim that they form a seamless continuous scene.

## 13. Final commercial standard

The final result must be:

Professional, authentic, clear, credible, and ready to use on a real ecommerce product page.

Visual impact must never take priority over product authenticity.

Marketing creativity must never take priority over commercial facts.

Visual appeal must not come at the expense of information efficiency.

Do not add irrelevant selling points just to fill the layout.

Do not add elements or production steps that have no practical value merely to demonstrate AI capabilities.

Generation does not mean completion. The task is complete only when the quality audit has passed and all deliverables have been provided.

I will now provide product images, specification materials, and possible style references.

Start with DetailFlow's Analyze Inputs stage. First analyze the authentic product materials, then follow the latest Skill to complete page planning and the editable HTML review.

Do not generate final product-detail images without my explicit approval.

<!-- prompt:end -->
