# Exact AI Character Counts with Python

Use this when AI-generated text must meet a strict character limit. The example below uses an SEO Title limit of 60 characters and a Meta Description limit of 160 characters.

Python's `len()` counts Unicode code points, including spaces and punctuation. Passing these editorial limits does not guarantee complete display in Google's search results, where pixel width, device, and snippet generation also matter.

<!-- prompt:begin -->

Optimize the SEO Title and Meta Description for this page.

**Strict limits:**
- The SEO Title must not exceed 60 characters.
- The Meta Description must not exceed 160 characters.
- Count spaces, punctuation, and the brand name.

**Execution rules:**
1. First draft candidate text based on the page's search intent and value to the reader.
2. Actually run Python and use `len()` to calculate the precise character count. Do not estimate or count by eye.
3. Reject over-limit candidates. Rewrite them, then rerun Python to validate.
4. Output only candidates that passed Python validation.
5. Show the complete final text and the actual character counts calculated by Python.
6. Do not meet the limits by mechanically truncating text, deleting essential product information, or producing unnatural wording.
7. If Python is unavailable, say so explicitly. Do not claim that code-based validation was performed.

<!-- prompt:end -->
