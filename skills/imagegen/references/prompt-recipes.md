# Prompt Recipes

Use these recipes as starting structures. Replace bracketed fields with concrete details from the user's request. Keep prompts concise and specific. Do not include every possible field if it is irrelevant.

## General Prompt Pattern

```text
Create [image type] for [specific use case].
Subject: [main subject with necessary visual details].
Composition: [aspect ratio, framing, focal point, safe area, background relationship].
Style: [photographic/vector/3D/editorial/pixel/etc.], [lighting], [palette], [mood].
Constraints: [transparent background/text/no text/brand colors/reference matching/format needs].
Avoid: [scenario-specific errors that would make the image unusable].
```

For user-facing explanations, summarize the assumptions briefly. For internal prompting, optimize for visual specificity.

## Website Hero

Use for landing pages, SaaS websites, product websites, and section headers.

```text
Create a wide website hero image for [product/company/page purpose].
Subject: [main concept/product/scene], communicating [benefit or emotion].
Composition: wide landscape layout with the main visual on [left/right/center], [35–50%] clean negative space on [opposite side] for headline and CTA, clear foreground-midground-background separation.
Style: [brand style], [color palette], polished digital illustration or commercial 3D/photographic style, soft depth, modern lighting.
Constraints: include embedded text only when the user provides or requests it; otherwise keep copy-safe areas readable under website text, avoid clutter near the text-safe area.
Avoid: busy patterns, random UI elements, excessive realism if brand is clean, cropped key subject.
```

If the website already has a color system, include exact colors. If the image will sit behind text, explicitly require low-detail space behind the text.

## Product Commercial Visual

Use for product renders, ecommerce images, launch visuals, and packaging/product mockups.

```text
Create a commercial product image for [product and use case].
Subject: [product name/type], accurate [shape/material/color/key features], shown from [angle].
Composition: product is fully visible, centered or rule-of-thirds placement, clean background, controlled reflections and shadow, enough padding for cropping.
Style: premium studio photography or high-end 3D render, [lighting style], [surface/background material], [brand mood].
Constraints: preserve product proportions and labels exactly if provided; do not invent logos, claims, certifications, or readable text.
Avoid: distorted geometry, extra accessories unless requested, incorrect packaging, impossible reflections, noisy backgrounds.
```

For a source product image, use editing language and require preservation of product geometry, label placement, color, and material unless the user requests a change.

## Social Campaign Or Poster Key Visual

Use for ads, event posters, campaign images, social posts, and thumbnails.

```text
Create a campaign key visual for [campaign/event/product] targeting [audience].
Subject: [main visual metaphor/person/product/action].
Composition: strong single focal point, clear hierarchy, space reserved for [title/logo/CTA] at [location], high readability at small size.
Style: [mood], [palette], [lighting], [graphic/photographic/illustration style].
Text to render: [exact title/subtitle/date/location/CTA or “none”].
Text layout: place the text at [top/center/bottom/left/right], with clear hierarchy and enough contrast for readability.
Constraints: render the specified text directly in the finished image; do not invent extra copy; keep typography readable at the target size.
Avoid: overcrowding, tiny details, illegible typography, multiple competing focal points, unrelated props.
```

When exact poster text matters, use direct generation with the full wording, language, and hierarchy. Do not treat Chinese, non-English, multilingual text, or dense copy as a reason to generate an empty background and add text later with Python, scripts, canvas, HTML, SVG, PIL, or manual compositing. Use a deterministic design/layout route only when the user explicitly asks for editable/print-ready source files, strict brand typography, legally exact fine print, exact long tables, or production layout files; do not present that route as a workaround for language limitations.

## Text-Rich Poster, Menu, Card, Or Flyer

Use when the user wants a finished visual whose text is part of the design, including restaurant menus, price cards, event flyers, quote posters, sale cards, comparison cards, educational cards, Chinese-label posters, and multilingual posters. Default to direct image generation of the complete final visual with all text rendered by the image generation model itself. Never generate a blank/background-only image and then insert Chinese, English, or any other text with Python, scripts, canvas, HTML, SVG, PIL, or manual compositing. If the user explicitly requests editable source, deterministic typography, or production-ready layout files, choose a deterministic layout route as a separate source-file workflow, not an AI-background-plus-text-overlay workflow.

```text
Create a finished [poster/menu/flyer/card/infographic] for [use case and audience].
Organized content block to render exactly: Title: [title]. Subtitle: [subtitle]. Sections: [section names]. Items: [grouped items, prices, numbers, or labels]. CTA: [CTA]. Optional small notes: [only if necessary].
Language and typography: render all text directly in the finished image in [language or languages], with clear hierarchy, readable display typography, and consistent alignment.
Composition: [aspect ratio], [layout grid], [where each text group appears], strong visual focal point, enough margins and spacing.
Style: [visual style], [palette], [mood], [materials/illustration/photo elements].
Constraints: do not invent extra text, do not omit required text, keep numbers and proper nouns accurate, keep small text minimal.
Avoid: misspelled characters, duplicated labels, cramped paragraphs, low contrast, random placeholder text.
```

If the text list is long, first organize it into title, subtitle, sections, item groups, callouts, CTA, and optional notes. Remove redundancy that hurts readability, but preserve exact required phrases, proper nouns, prices, dates, numbers, Chinese characters, and technical terms. Then pass the organized content block into direct image generation. Do not split the work into “AI background plus scripted text overlay.” Switch to a deterministic layout route only when the user explicitly needs editable files, pixel-perfect brand typography, print production accuracy, legally exact fine print, exact long tables, or machine-readable structure, and not because the text is Chinese, non-English, multilingual, or lengthy.

## UI Mockup

Use for images of apps, dashboards, product interfaces, device mockups, and SaaS visuals. Default to direct image generation when the requested deliverable is an image of a UI. Do not build HTML/CSS/React and screenshot it unless the user explicitly asks for functional software, editable front-end code, a working prototype, or deterministic source files.

```text
Create a visual UI mockup image for [app/product feature].
Subject: [screen type: dashboard, mobile app, settings page, analytics view, onboarding, etc.].
Composition: [device frame or browser window], clean grid, realistic spacing, clear navigation, primary content area showing [feature].
UI content to render: [organized screen title, navigation labels, primary card labels, button text, key metrics, sample rows, chart labels, empty-state copy, or onboarding text].
Style: modern product design, [light/dark] mode, [brand colors], consistent components, subtle shadows.
Constraints: directly generate the finished UI image; use plausible readable labels and short UI copy when useful; avoid tiny filler paragraphs; do not imply the interface is functional.
Avoid: inconsistent controls, impossible charts, random icons, distorted device perspective, excessive decorative elements, HTML screenshot artifacts.
```

For actual product screenshots, preserve the real UI unless the user asks for redesign. For conceptual UI images, summarize the intended information architecture first, then generate the mockup image directly.

## Logo Concept

Use for brand mark exploration, app icon symbols, and identity concepts.

```text
Create a logo concept for [brand/product] in the [industry/category].
Subject: a simple symbolic mark representing [brand idea].
Composition: centered, balanced, scalable, works in one color, clear silhouette, no background clutter.
Style: [minimal/geometric/organic/premium/playful/technical], [palette if any].
Constraints: symbol-first; avoid relying on exact generated text unless the user accepts concept typography.
Avoid: overly detailed illustration, generic stock-like icons, gradients that fail at small size, unreadable lettering.
```

For app icons, request a square composition and strong symbol readability at small sizes.

## Game Asset

Use for props, sprites, characters, tiles, items, icons, and asset-pack visuals.

```text
Create a game asset for [game genre/platform].
Subject: [asset type and details].
Composition: [front/side/top-down/isometric] view, complete object visible, centered with padding, readable silhouette.
Style: [2D/3D/pixel art/hand-painted/low-poly], consistent with [reference style or game mood].
Constraints: transparent background if used as a standalone asset; consistent lighting direction; no ground plane unless requested.
Avoid: cropped edges, busy background, inconsistent perspective, tiny fragile details, cinematic scene instead of usable asset.
```

If producing multiple assets, define a common camera angle, outline thickness, palette, and lighting direction before generation.

## Character Consistency

Use for portraits, mascots, avatars, and recurring characters.

```text
Create a character image for [use case].
Identity anchors: [age range], [face shape], [hair], [skin tone if relevant], [outfit], [signature accessory], [body type/silhouette].
Composition: [portrait/full body/action pose], [camera angle], [background].
Style: [visual style], [lighting], [palette], [mood].
Constraints: preserve identity anchors across variations; keep anatomy natural; keep outfit and color palette consistent.
Avoid: extra fingers, changed age, changed face structure, inconsistent costume, style drift.
```

For edits to a provided character, explicitly preserve face identity, pose, costume, and style unless those are the target changes.

## Transparent Cutout Or Sticker

Use for stickers, compositing assets, product cutouts, icons, and overlays.

```text
Create a transparent-background asset of [subject].
Subject: [full subject details], complete and uncropped.
Composition: centered with even padding, clean silhouette, [optional thick sticker outline].
Style: [photoreal/vector/3D/illustration], [lighting/palette].
Constraints: true transparent background, no white box, no colored fringe, no unwanted cast shadow unless requested.
Avoid: clipped edges, background remnants, hair/edge artifacts, text errors, overly thin details.
```

If the output must be composited over unknown backgrounds, avoid semi-transparent colored halos and overly subtle edge contrast.

## Image Upscale Or Restore

Use whenever the user provides an image and explicitly asks to upscale, restore, enhance resolution, improve quality, or increase clarity without changing the content. This includes requests such as "放大这张图", "提升画质", "高清修复", "upscale this", "enhance this image", or "restore this photo".

Use this prompt in the image variation tool exactly as written. Do not add, remove, or rephrase any part of it:

```text
Restore and upscale this image to high resolution while preserving every detail exactly as in the original.
```

Do not build a custom prompt, do not add bracketed fields, and do not append style or composition instructions. The goal is strict preservation with enhanced resolution, not creative reinterpretation.

## Precise Image Edit

Use whenever the user provides an image and asks for a specific change.

```text
Edit the provided image. Change only [specific object/region/text/background].
Keep unchanged: [subject identity/product shape/pose/clothing/background/camera angle/lighting/color palette/style/other objects].
New result: [desired change], matching original perspective, lighting, shadows, and image quality.
Constraints: preserve all non-target areas; do not add unrelated elements; maintain natural edges and realistic integration.
Avoid: global restyling, identity drift, changed product details, mismatched lighting, artifacts around edited region.
```

If the user asks for text replacement, include the exact replacement text, language, location, and surrounding text to preserve. Use image editing directly first. Consider layout post-processing only when the user explicitly requires pixel-perfect typography, editable source, or long/legal/technical copy.

## Infographic Or Conceptual Explanatory Visual

Use when the user wants a finished presentation visual, educational visual, framework image, decorative schematic, or infographic where visual communication matters more than exact graph syntax. Do not use this recipe for formal flowcharts, sequence diagrams, ER/class/state/Gantt diagrams, architecture diagrams with precise nodes and edges, dependency graphs, or machine-readable structures; follow the authoritative routing in `SKILL.md` for those structured diagrams.

```text
Create a finished explanatory visual for [topic].
Organized content block to render exactly: Title: [exact title]. Sections or steps: [ordered groups]. Labels: [short card/arrow/callout labels]. Key phrases and numbers: [short exact phrases, metrics, or claims].
Structure: [number of sections/steps], showing [high-level relationships or flow].
Composition: clear left-to-right or top-to-bottom hierarchy, ample spacing, simple connectors, readable labels and callouts.
Style: [flat/vector/editorial/technical], restrained palette, high contrast, minimal decoration.
Constraints: render the specified text directly and clearly; do not invent extra facts, labels, numbers, or claims.
Avoid: unreadable tiny text, wrong sequence, decorative clutter, ambiguous arrows, fabricated data.
```

When both exact structure and visual polish are required, create or confirm the structured diagram first, then use this recipe only for a polished conceptual version.
