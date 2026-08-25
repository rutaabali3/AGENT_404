# Quality Checklist

Use this checklist only as a **lightweight pass/fail gate** before delivery. Its purpose is to decide whether the image is usable for the user's stated scenario, not to trigger open-ended inspection, local crop previews, scripted repair pipelines, or extra generation after a deliverable is already good enough.

## Stop Conditions

If the generated or edited image satisfies the user's explicit request and has no obvious fatal defect, deliver it. Do not keep checking or improving it for speculative issues, subjective polish, minor spacing/crop preferences, uncertain microtext, or alternate versions the user did not request.

| Situation | Required behavior |
| --- | --- |
| The requested final artifact is present and broadly usable | Deliver immediately and stop |
| A minor issue is visible but does not block the user's stated use | Mention only if useful; do not regenerate or patch automatically |
| A critical requested element is missing, wrong, unreadable, or unusable | Make one focused correction targeting that single failure |
| The user already received the final artifact | Do not continue generating, fixing, or adding variants unless the user asks |
| A check would require writing scripts, cropping local previews, finding fonts, masking labels, OCR-style inspection, or repeated file probing | Do not perform it unless the user explicitly requested that technical workflow or a visible fatal problem blocks delivery |

## Universal Lightweight Check

| Dimension | Pass condition | If it clearly fails |
| --- | --- | --- |
| Scenario fit | The image serves the stated medium and purpose | Re-prompt once with explicit use case and layout constraint |
| Subject accuracy | The main subject is correct, complete, and not obviously deformed | Narrow the subject description or preserve product/identity anchors |
| Composition | Framing and hierarchy are suitable enough for the deliverable | Correct only if the composition makes the image unusable |
| Style consistency | The style reasonably matches the request or reference | Re-prompt only if the mismatch is material |
| Background | The background supports the subject without obvious unwanted clutter | Simplify only if clutter blocks use |
| Text handling | Required text is readable enough, in the right language, placed reasonably, and rendered as part of the generated final image | Use one targeted direct-generation correction for critical missing/wrong text. Do not generate an empty background and overlay text with Python, scripts, canvas, HTML, SVG, PIL, or manual compositing |
| Artifacts | No obvious artifact makes the result unusable | Re-edit or regenerate only the blocking issue |
| Delivery fit | The file type, dimensions, and aspect ratio are acceptable for the request | Convert format or downscale deterministically when the user requested a specific format or smaller size. If the target aspect ratio differs from the source, default to preserving all content via AI editing unless the user explicitly accepted cropping |

## Scenario-Specific Lightweight Checks

### Website Or Landing Page

A website image passes if it supports the intended layout and does not obviously fight the page content. Do not test multiple responsive crops or produce crop previews unless the user requested responsive assets.

### Product Or Commerce

A product image passes if the product identity, shape, material, and key labels remain credible enough for the stated use. If a source product image was provided, reject only material changes to core product identity or claims.

### Marketing, Poster, Or Social

A campaign visual passes if the focal point, message, and requested title/CTA/date/label are readable enough at the intended scale. Do not crop out label regions, run font checks, or create scripted text repair previews as a self-audit.

### UI Mockup

A UI image passes if it looks like a plausible visual mockup and satisfies the user's visual intent. Do not judge success by whether HTML/CSS/React source exists, and do not build a screenshot workflow unless explicitly requested.

### Logo, Icon, Or Brand Mark

A logo or icon passes if it has a recognizable silhouette and reasonable balance at small size. Do not over-optimize concept marks for production brand standards unless the user requested production identity files.

### Game Asset

A game asset passes if it is reusable enough for the requested role, with suitable silhouette, viewpoint, and edge quality. Do not generate asset sheets, previews, or alternates unless requested.

### Character Or Portrait

A character image passes if the key identity anchors are preserved and no obvious anatomy defect blocks use. Do not keep regenerating for minor facial preference differences.

### Transparent Asset

A transparent asset passes if it has a true usable alpha and no obvious colored box or severe edge contamination. Perform background removal or cleanup only if transparency was requested and visibly failed.

### Image Upscale Or Restore

An upscale or restore passes if the output image has visibly higher clarity or resolution while strictly maintaining the original content, composition, style, colors, and identity. Do not run forensic pixel comparisons or crop local regions for inspection. If the user reports hallucinated new elements or identity drift, make one focused correction by re-running the exact upscale/restore prompt.

### Precise Image Edit

An edit passes if it changes the target area and preserves non-target areas well enough for the requested purpose. Compare before and after visually, but do not conduct forensic pixel-level review unless the user requires exact preservation.

### Structured Diagram Or Infographic

A structured diagram passes only if relationships, sequence, grouping, connectors, and labels are correct. For formal diagrams, validate the deterministic source as the primary artifact.

A conceptual infographic passes if its factual structure, grouping, and requested labels are clear enough for the intended medium. If it fails, first reorganize content and make one focused direct-generation correction. A blank/background-only image plus Python/scripted text overlay is not an acceptable repair path for Chinese text, non-English text, multilingual layouts, or a large amount of text.

## Iteration Limits

When iteration is necessary, correct the single most important blocking failure first. Prefer one focused edit or regeneration. A second targeted attempt is acceptable only when the first correction clearly failed and the task would otherwise be unusable. After that, deliver the best available result with a brief limitation note or ask the user which tradeoff they prefer.

Do not rewrite the whole prompt, change routes, add deterministic post-processing, or generate extra variants unless the original scenario was misclassified, the user explicitly requested a different deliverable, or the current artifact is plainly unusable.

## Delivery Note

When delivering the result, briefly state the chosen scenario only if it helps the user understand the artifact. Once delivery is complete, stop. Do not continue with additional checks, variants, refinements, or follow-up generation unless the user asks for them.
