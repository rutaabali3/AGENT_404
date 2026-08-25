---
name: manus-pptx
description: Write slides using Manus's PPTX-specific XML syntax (a project-custom markup language, authored by AI and losslessly exportable to pptx). This document contains syntax information only, so do not read it until you are ready to start editing (e.g. not at session start or during the research phase).
---

# Slides XML Syntax Quick Reference
One slide = one `<slide>`, composed internally of 6 element types: `<text>` `<shape>` `<image>` `<icon>` `<table>` `<chart>`. At the deck level there is also a `<design>` block. **This document is self-contained**: every tag, attribute, value syntax, and validation rule you need is here — no other document required. Tags/attributes not written here do not exist; do not invent them.

## Global Rules
- **Canvas size is defined by `<design>`'s `<size>` (standard 16:9 is 1280×720), unit px**. Numbers carry no unit suffix (`x="120"`), decimals allowed; origin is top-left, `rotation` is clockwise degrees
- **Separators**: arrays (lists of same-kind items) use commas `columns="2,5,3"`; compound values (components with different meanings) use spaces `padding="10 14"`
- **No global fallback, fail-fast**: missing required fields or unresolvable variable names are validation errors, never silently degraded. Required list: one `<background>` child per slide, a unique `id` for every content element, `font` for `text`/`table`/`chart`, `fill` for area-type shapes, a color for every chart series, `name` for `icon`
- **Writing order = stacking order**: later elements sit on top of earlier ones
- **Every content element MUST carry an `id`, short and semantic, unique within its slide**: purpose/content understandable at a glance (e.g. `cover-title`, `revenue-chart`), for locating during incremental edits and for `<a slide>` jumps; don't use meaningless `e1` or random strings. Missing or duplicate element ids are validation errors
- When a parameter is meaningless to its host (e.g. `fill` on a line, `y-axis` on a pie), it is ignored if written

## Common Parameters (inherited by all 6 elements)
```
id!         unique element identifier, required on all 6 element types, unique within the slide (for locating during incremental edits)
x y         top-left position, px
width height  size, px (table's height is required, as the authoritative total height; row heights are distributed within it)
rotation    rotation angle, default 0 (table/chart unsupported, ignored if written)
opacity     0~1, default 1, overall opacity (fill/stroke/text change together; not yet effective on chart)
```
`shadow` applies to text/shape/image/icon: `shadow="true"` gives the default shadow (4px straight below, blur 12, black 35%), fine-tunable via `shadow-x / shadow-y / shadow-blur / shadow-color / shadow-opacity`.

## Color and Fill Values
**Color** is one of two: a hex literal `#1A2B3C` (optionally 8-digit with alpha `#1A2B3C80` for semi-transparency), or a variable name defined in `<design>` such as `brand` (leading `#` means literal, otherwise looked up in the variable table; variables carry no alpha, so for semi-transparency write an 8-digit hex directly).

**Fill** has three forms (used for slide background, text box background, shape fill; table accepts solid color only). Solid color is written directly as a `fill` attribute on shape/text/table; the slide background is a `<background>` child element (see the `<slide>` section):

```xml
<shape fill="#1A2B3C" .../>  <!-- 1. Solid: written directly as an attribute -->
<background color="brand"/>  <!-- Solid form of slide background (type defaults to solid) -->
<background type="gradient" direction="135">  <!-- 2. Gradient: direction angle, 0=left-to-right clockwise, default 0; at least 2 stops; linear only, no radial -->
  <stop offset="0%" color="#0F2027"/>
  <stop offset="100%" color="#2C5364"/>
</background>
<background type="image" src="bg.jpg" fit="cover" overlay="#000000" overlay-opacity="0.4"/>  <!-- 3. Image: fit also supports contain/stretch/tile; always add an overlay to darken when placing text over an image -->
<background type="image" src="bg.jpg" fit="cover">  <!-- 3b. Gradient overlay: <overlay> child, same syntax as gradient, stops use 8-digit hex with alpha (clear at top -> darker at bottom) -->
  <overlay direction="90">
    <stop offset="0%" color="#0F172A10"/>
    <stop offset="100%" color="#0F172AF0"/>
  </overlay>
</background>
```

---

## `<design>` — deck-level design elements (canvas size / brand colors / font tiers, sibling to slides, defined once and referenced everywhere)
> `<design>` is usually already written into the result of `slide_initialize`, so **no need to rewrite it**; this section is only for understanding an existing `<design>`, tweaking it as needed, and correctly referencing its color/font variables.

```
<size width height>  canvas size in px, both required, unique across the deck (16:9 uses 1280×720, 4:3 uses 960×720)
<color name value>   name is [a-z0-9-] starting with a lowercase letter, value is #RRGGBB only
<font  name family size>   font-family + font-size binding, both required; family must be a font listed in Google Fonts (e.g. Noto Sans SC / Inter), a single font name — no comma fallback list
```

Root attributes (usually already set by `slide_initialize`, keep them as-is): `lang` — optional BCP 47 deck language, doubling as the document language for proofing/typography; `dir` — `ltr`|`rtl` (no `auto`), the deck-wide default reading direction for text, lists, and tables (omitted = ltr). Arabic decks use `<design lang="ar" dir="rtl">`. For mixed-language content, individual `<text>`/`<table>`/`<p>`/`<li>` accept their own `dir` (and, when direction cannot imply the language, `lang`) override — see those sections.

Reserved words `none/true/false` cannot be names; duplicate definitions are illegal; variables cannot reference variables. Colors and fonts are separate namespaces. Reference by bare name: `fill="brand"`, `font="heading"`. Font variables carry their own size; an explicit sibling `size` overrides it; literal fonts (`font="Inter"`, any uppercase/CJK makes it a literal) set only the font-family, and must likewise be a Google Fonts name.

## `<slide>` — page container
```
id?             page identifier (for locating during incremental edits; also the target of <a slide="..."> intra-deck jumps)
<background>!   a child tag written as a sibling of text and other elements (not a slide attribute), required exactly once per slide; position is free (write it anywhere), always rendered as the bottom-most background and never participates in content stacking; a white background must also be explicit: <background color="#FFFFFF"/>
content elements 0..n    text/shape/image/icon/table/chart, writing order is stacking order (later on top)
```

```xml
<slide id="cover">
  <background color="#0F2027"/>
  <text id="cover-title" x="80" y="280" width="800" height="120" font="heading" size="54" color="#FFFFFF">2026 Annual Performance Review</text>
</slide>
```

## `<text>` — text (titles, body, lists all use it)
Container attributes:

```
font!    font variable or literal (variable carries its own size)
size     px; overrides the variable size when written explicitly; defaults to 18 for a literal font when unset
color    default #000000        align    left|center|right|justify, default follows dir (ltr→left, rtl→right)
dir      ltr|rtl, reading-direction override for this box, default inherits <design dir>; flips bidi punctuation handling and the default alignment
lang     BCP 47 language override for this box; write it only when direction cannot imply the language (see the dir/lang bullets below)
line-height  multiplier, default 1.2   anchor   top|middle|bottom vertical alignment, default top
padding  single value or four values (top right bottom left), default 0
autofit  none|shrink, default none (shrink recommended for long text boxes: auto-reduces font size when content overflows)
wrap     true|false, default true (false = no wrapping, single-line overflow)
writing-mode  horizontal|vertical, default horizontal (vertical = East Asian vertical layout, see below)
fill     box background (full Fill)   shadow
```
Content is one of two: **clean text** (may contain inline tags, treated as a single paragraph) or **all block-level tags**; mixing them is illegal.

- Block-level: `<p>`, `<ul>` (`bullet` allows a custom single-character symbol, default •, inherited from parent when a child omits it), `<ol>` (numbering 1. 2. 3. only), `<li>`; nest `<ul>/<ol>` inside `<li>` for multi-level lists, up to 5 levels
- Inline: `<strong>`(bold) `<em>`(italic) `<u>` `<s>` `<sup>`(superscript) `<sub>`(subscript) `<span>`(pure attribute holder) `<a>`(hyperlink), all can carry `font/size/color/highlight` (highlight = text background highlight color), and can nest within each other. **`<b>` and `<i>` are not supported**, only the semantic forms; `<sup>/<sub>` are for `H<sub>2</sub>O`, `x<sup>2</sup>`, etc.
- `<a>` hyperlink: `href` (external URL) and `slide` (target page id) are **mutually exclusive, exactly one required**; referencing a nonexistent slide id is a validation error; **no automatic underline/link color** (for the traditional look, nest `<u>` or add `color` yourself); an `<a>` may not nest another `<a>`, and may not contain block-level tags
- Vertical `writing-mode="vertical"`: characters upright, top-to-bottom within a column, columns right-to-left (Chinese/Japanese covers/poetry). `align`/`anchor` value names are unchanged, but their axes rotate 90° with the text (align controls vertical position within a column, anchor controls overall horizontal position, top = toward the right-most first column). Rotating Latin text 90° is not vertical layout — use `rotation`
- `font/size/color/align/line-height` can be written on the container/`<p>`/`<li>`/inline and override level by level (field-level merge)
- `dir` (`ltr`|`rtl`): on the container/`<p>`/`<li>`, and inline as `<span dir>` — nowhere else. Nearest wins: `<design dir>` → element → block → span. Write it when a whole box/paragraph/item reads opposite to the deck, e.g. an English quote inside an Arabic deck (`<text dir="ltr">`). `dir` flips the writing direction, the DEFAULT alignment, and (on `<table>`) the visual column order; an explicit `align` is always physical (`align="right"` = right edge regardless of `dir`)
- Bare foreign WORDS (a brand name, an English term in an Arabic sentence) need no markup — the bidi algorithm places them. But a weak-direction SEQUENCE of Latin letters / ASCII digits whose internal order must not change — phone (`+966 11 234 5678`), version, date, score, formula, value+unit — MUST be ONE `<span dir="ltr">` island inside an RTL paragraph (mirror with `<span dir="rtl">` in LTR), brackets and separators INSIDE the span (`<span dir="ltr">(SQL / NoSQL)</span>`); splitting one phrase into adjacent islands reorders them and mirrors the brackets. An island holds ONLY weak or opposite-script content: never wrap RTL-letter text in `<span dir="ltr">`, nor Latin-letter text in `<span dir="rtl">`
- `lang` (BCP 47): on `<text>`/`<table>`/`<p>`/`<li>` only, and only when direction cannot imply the language (an Arabic quote in an LTR deck: `<text dir="rtl" lang="ar">`; a French passage in an Arabic deck: `<p dir="ltr" lang="fr">`); otherwise omit — a `dir` override already switches the local language context. Do NOT echo the same fact in two languages on one line; lead with one language, parenthesize or line-break the other
- `<p>`/`<li>` also have `space-before`/`space-after` (default 0)
- **Not available**: `<br>` (use multiple `<p>`), `<h1>~<h6>` (a heading is just large-size text), `letter-spacing`, columns, first-line indent

```xml
<text id="q3-highlights" x="80" y="200" width="560" height="300" font="body" line-height="1.4">
  <p font="heading" size="24">Q3 Highlights</p>
  <ul bullet="✓">
    <li>Revenue up <strong color="brand">45%</strong></li>
    <li>See the <a href="https://example.com/report"><u>annual report</u></a></li>
  </ul>
  <p><a slide="chapter-1" color="brand">01 Market Review →</a></p>
</text>
```

## `<shape>` — geometric shapes (cards, color blocks, dividers, connectors, flowchart shapes)
```
type!    rect ellipse line elbow curve arrow chevron diamond triangle parallelogram trapezoid pentagon hexagon star —— the 14 common ones; all 187 OOXML preset names may be used by their original name (e.g. cloud)
fill     required for area types (Fill or "none", a transparent background must be explicitly "none"); ignored for line types
stroke   stroke color; stroke-width default 1. Line types have a stroke by default (#000000/1px), area types have none by default
stroke-dash    solid|dash|dot, default solid, applies to all types (dashed dividers / helper boxes)
corner-radius  effective on rect only, px
arrow-start / arrow-end   none|arrow, effective on line types (line/elbow/curve) only
head-ratio     0~1, default 0.5, effective on arrow/chevron only: head depth ratio, use a small value (e.g. 0.3) for flat/long arrows
shadow
```
Line types (`line`/`elbow`/`curve`) share two-endpoint positioning: drawn from `(x,y)` to `(x+width, y+height)`; horizontal line `height="0"`, vertical line `width="0"`, width/height may be negative to express leftward/upward. `line` is straight, `elbow` is an L-shaped bend, `curve` is an S-shaped curve (bend point not adjustable; for a special bend, stitch multiple `line`s). Connector endpoints align by coordinate and do not snap to shapes.

**Shapes hold no text** — for text on a shape, overlay a `<text>` at the same coordinates (`align="center" anchor="middle"`).

```xml
<!-- Card + text on the card -->
<shape id="stat-card" type="rect" x="80" y="160" width="340" height="200" corner-radius="12" fill="#FFFFFF" shadow="true"/>
<text id="stat-card-text" x="80" y="160" width="340" height="200" font="body" align="center" anchor="middle">Text overlaid at same coordinates</text>

<!-- Decorative line / flow arrow / L-shaped connector / dashed helper box -->
<shape id="title-underline" type="line" x="80" y="130" width="120" height="0" stroke="brand" stroke-width="3"/>
<shape id="flow-connector" type="elbow" x="420" y="220" width="200" height="160" arrow-end="arrow"/>
<shape id="helper-frame" type="rect" x="700" y="120" width="300" height="180" fill="none" stroke="#999999" stroke-dash="dot"/>
```

## `<image>` — image
```
src!     path or URL
fit      cover(default, crop to fill) | contain(fully shown with letterboxing) | stretch(stretched/distorted)
mask     shape mask, same values as shape's type (ellipse=round avatar), default rect
corner-radius  effective only when mask="rect"
crop-left/top/right/bottom  ratio cropped inward from each edge, 0~1, default 0; unset means no crop
stroke / stroke-width / stroke-dash  stroke, reuses shape syntax (no border by default, strokes along the mask shape)
flip-h / flip-v  mirror flip, default false (use for subject facing direction; rotation cannot replace it)
shadow / opacity (lower opacity to use as a background texture)
```
`crop-*` is mainly produced by the editor writing back a crop; the AI cannot see pixels, so unless an exact ratio is known, leave cropping to `fit="cover"`.

```xml
<image id="cto-avatar" src="team/cto.jpg" x="120" y="200" width="160" height="160" mask="ellipse"/>
<image id="product-shot" src="product.png" x="400" y="180" width="480" height="300" fit="contain" corner-radius="16" shadow="true"/>
<image id="cover-photo" src="cover.jpg" x="400" y="180" width="480" height="300" stroke="brand" stroke-width="4"/>
```

## `<icon>` — icon (built-in vector icons, visual anchors for feature lists / advantages / flows)
```
name!    Lucide icon name, kebab-case (e.g. circle-check / mail / trending-up / rocket). Vocabulary = the full Lucide set (1600+); a name not found is a validation error
color    single-color tint, default #000000; prefer referencing a <design> variable to follow the theme color, and remember to lighten it on dark-background pages
all others are common parameters + shadow, no private parameters
```
- Icons are always square in ratio: when `width ≠ height` they scale by the smaller side and center, without stretching; the normal way is to make the two equal
- Use sparingly: prefer small (24~48px) and single-color; large sizes (64px+) only as decoration with reduced opacity; not every paragraph needs an icon
- Common name reference: `check circle-check x arrow-right chevron-right trending-up chart-column chart-pie target user users briefcase handshake mail phone send globe map-pin calendar clock settings zap rocket lightbulb sparkles award star shield-check lock search file-text clipboard-list database cloud dollar-sign wallet package truck cpu`

```xml
<icon id="rocket-icon" name="rocket" x="120" y="200" width="40" height="40" color="brand"/>
<icon id="trend-decor" name="trending-up" x="1040" y="480" width="180" height="180" color="#7DD3E0" opacity="0.15"/>  <!-- large decorative icon on a dark page -->
```

## `<table>` — table
```
columns   column-width weight array, normalized to table width ("2,5,3" or px values both work), defaults to equal width
height!   total table height, px, required (authoritative total height; row heights distributed within it; elements below are laid out absolutely against it)
rows      row-height array, mixing numbers/auto ("56,auto,auto"), defaults to all auto; length must = the number of logical rows (count of <tr>); auto = evenly split the space left after subtracting fixed rows from height (not content-based autofit), match content amount to the allotted row height when generating; validation: no auto row and sum of fixed rows ≠ height → error
font!  size  color  align  line-height   cascade to all cells, overridable per tr/td
padding   default cell inner padding        anchor  default middle (note: differs from text's top)
dir       ltr|rtl, table reading-direction override, default inherits <design dir>: mirrors the column order and flips the default cell alignment; a cell paragraph may still override with <p dir>
lang      BCP 47 language override for the table, same usage rule as text's lang (only when direction cannot imply the language)
fill / header-fill    background, solid only. header-fill = header (the first H logical rows, see below); priority td > tr > header > table level
border-h / border-v / border-outer / header-border    row lines / column lines / outer frame / header bottom line; value is a compound "[width] [style] color", component order is fixed, the first two are omittable (e.g. "brand", "2 brand", "dash #E0E0E0", "1 dot #CCC"); style is solid|dash|dot only; width 0 = explicitly no line (overrides lower-priority lines); default is no lines
border-top / border-right / border-bottom / border-left    single outer-frame edges, override the corresponding edge of border-outer
```
Child tags: `<tr>` (may carry fill + the five cascade items applied to the whole row), `<td>` (may additionally carry anchor/padding/wrap/colspan/rowspan + cell-level borders: `border` for all four sides and `border-top/right/bottom/left` for single sides, same compound value; priority cell single side > cell border > table level — a cell-side value fully replaces the table-level line on that side, incl. width 0 to explicitly remove it; content follows text's content model).

**Merged cells**: `colspan`/`rowspan` follow HTML semantics (default 1); **cells covered by a merge are not written**. Iron rule: each logical row is covered by **exactly N columns** — mental check: sum of this row's td colspans + cells intruding into this row from rowspans above = N; with no merges it reduces to "exactly N td per row". A merged cell's styles (fill/anchor/padding/cascade items) all go on the starting td and apply to the whole region; header depth H = the max rowspan among the first row's td (H=1 with no merge), header-fill covers the first H rows, header-border is drawn at the bottom edge of row H.

```xml
<table id="revenue-table" x="80" y="160" width="1120" height="280" columns="3,2,2,2" rows="40,40,auto,auto" font="body" padding="10 14" header-fill="brand" header-border="2 brand" border-h="1 dash #E0E0E0">
  <!-- Two-row grouped header: H=2 -->
  <tr color="#FFFFFF"><td rowspan="2">Product Line</td><td colspan="2">First Half</td><td rowspan="2">Q3</td></tr>
  <tr color="#FFFFFF"><td>Q1</td><td>Q2</td></tr>   <!-- 2×1 + intrusion 2 = 4 = N ✓ -->
  <tr><td>Cloud Services</td><td>120M</td><td>150M</td><td>210M</td></tr>
  <tr fill="#FFF2CC"><td><strong>Total</strong></td><td>120M</td><td>150M</td><td>210M</td></tr>
</table>
```

## `<chart>` — chart
```
type!     bar column line area pie donut scatter (these 7 only, no combo —— see combination charts); semantically = the default rendering of each series
font!     font shared by axis ticks / legend / data labels / axis titles; text-size overrides the variable size (12 when a literal font is unset); text-color default #666666 (remember to lighten on dark-background pages)
categories  category-text array (omit for scatter; category names may not contain commas)
color       color array: assigned to each series in order; for pie/donut assigned to each slice (length must be ≥ category count)
legend      none(default)|top|bottom|left|right
data-labels default false; when true, non-scatter series use label-expr when present, then legacy labels for compatibility (otherwise Cartesian charts show raw values and pie/donut show their computed shares); scatter uses labels when present, otherwise raw coordinates
x-axis / y-axis  axis toggles, default true (ignored by pie/donut)   y-min / y-max  value-axis range, default auto
y-format    number(default)|percent|thousands  value-axis tick number format
x-title / y-title   axis title strings (y-title rotates 90° along the axis; the chart title is still laid out with an adjacent text)
gridlines   none|h|v|hv, default follows the value-axis direction and its toggle (column/line/area=h, bar=v, scatter=hv); when written explicitly it decouples from the axis toggle (minimalist look with ticks but no lines: gridlines="none")
stack       none(default)|normal|percent  stacking, bar/column/area only; percent = percentage stacking (each bar stretched to 100%, value axis auto 0%~100%, y-min/max/format ignored)
smooth      smoothed curve, line only
y2-min / y2-max / y2-format / y2-title   secondary-axis set of four, same semantics as the primary y series; ignored if no series is on secondary
gap-width   bar gap as a percentage of bar width, 0~500, default 150, larger = thinner bars (bar/column only; the only lever for bar thickness, increase e.g. to 300 when categories are few and the chart is wide)
fill-opacity  area fill opacity, 0~1, default 1 (area only; lower e.g. to 0.6 when layers overlap)
line-width  line thickness, px, default 2 (line/area only)   line-dash  solid|dash|dot, default solid (line/area only)
marker      data-point marker toggle, default false (line/area only; scatter always has markers)
marker-size marker size, px, 2~72, default 5 (effective on line/area when marker is on; always effective for scatter)
gridline-color  primary-axis gridline color, default light gray (Cartesian types; must be lightened explicitly on dark pages)
hole-size   donut inner-radius ratio, 0~1, default 0.55 (donut only)
```
y-series parameters refer to the **value axis** (a bar's value axis is horizontal); x-series refer to the category axis.

Child tag `<series name? values color? label-expr? labels? type? axis?>`:

- `values` numeric array, length must = category count; accepts pure numbers only (not `"45%"`, `"120M"`)
- `label-expr` non-scatter data-label template, evaluated independently for every current value whenever data changes. Use `{value}` or `{value:format}`; safe arithmetic with numeric constants is allowed inside the placeholder (`+ - * /`, normal multiplication/division precedence). Supported formats are `.0f`~`.6f`, `,.0f`~`,.6f`, and `.0%`~`.6%`. Literal prefixes/suffixes stay outside the placeholder: `{value:.0%}` turns `0.78` into `78%`, `${value:,.0f}` turns `12400` into `$12,400`, and `¥{value / 10000:.0f}万` turns `34000000` into `¥3400万`
- `labels` display-text array. For new documents, use it only on scatter to name individual points; its length must equal the parallel `x`/`y` arrays and its text may not contain commas. Non-scatter `labels` remains readable for backward compatibility, but do not author it in new slides; when both fields exist, `label-expr` takes precedence
- `color` single value, overrides the chart-level assignment; every series/slice must resolve a color from one of the two color levels
- Pie/donut have **exactly one series**. Scatter is the exception: a series uses parallel `x`/`y` arrays (equal length)
- **Combination chart**: `type="column|line|area"` overrides this series' rendering (only when the chart-level type is also one of these three, otherwise a validation error); `axis="primary|secondary"` (default primary) attaches to the left/right axis, any series on secondary makes a right-side secondary axis appear (e.g. "revenue bars + growth-rate line"). type and axis are independent; gridlines only follow the primary axis; the value-axis upper bounds are just the primary and secondary ones

**No** chart-title parameter (lay it out with an adjacent `<text>`).

```xml
<!-- Multi-series column chart -->
<chart id="quarterly-columns" type="column" x="80" y="160" width="560" height="360" font="body" categories="Q1,Q2,Q3" color="brand,#A5A5A5" legend="bottom">
  <series name="Cloud Services"   values="1.2,1.5,2.1"/>
  <series name="Enterprise Software" values="0.8,0.9,1.0"/>
</chart>

<!-- Pie chart: the label expression is recalculated from each current value -->
<chart id="region-pie" type="pie" x="720" y="160" width="400" height="360" font="body" categories="East,South,North" color="brand,#5B9BD5,#A5A5A5" data-labels="true">
  <series values="0.45,0.30,0.25" label-expr="{value:.0%}"/>
</chart>

<!-- Scatter keeps explicit point labels; it has x/y rather than values -->
<chart id="metric-scatter" type="scatter" x="720" y="160" width="400" height="360" font="body" color="brand" data-labels="true">
  <series x="12,18,25" y="0.34,0.51,0.22" labels="Alpha,Beta,Gamma"/>
</chart>

<!-- Combination chart: revenue bars (left axis, thousands) + growth-rate line (right axis, percent) -->
<chart id="revenue-growth-combo" type="column" x="80" y="160" width="1120" height="400" font="body" categories="2024,2025,2026" color="brand,#E8A33D" legend="bottom" y-format="thousands" y-title="Revenue (K)" y2-format="percent" y2-title="Growth Rate">
  <series name="Revenue"     values="8200,12400,18100"/>
  <series name="Growth Rate" values="0.33,0.51,0.46" type="line" axis="secondary"/>
</chart>

<!-- Percentage stacking: composition over time -->
<chart id="mix-stack" type="column" x="80" y="160" width="560" height="360" font="body" categories="2024,2025,2026" color="brand,#5B9BD5,#A5A5A5" stack="percent" legend="bottom">
  <series name="Own Brand" values="120,180,260"/>
  <series name="Reseller"  values="200,190,180"/>
  <series name="Other"     values="80,70,60"/>
</chart>
```

## Validation Red Lines (self-check for the most common errors)
1. `slide` missing its `<background>` child; `text/table/chart` missing `font`; area-type shape missing `fill`; `icon`'s `name` not found in Lucide
2. Referencing a variable name that does not exist in `<design>` (spell-check!)
3. Table grid not exactly filled: some row's colspan sum + rowspan intrusion count ≠ column count (with no merge, "td count ≠ column count"); `rows` array length ≠ logical row count; colspan/rowspan out of bounds or merged regions overlapping
4. A chart series gets no color; a pie/donut with multiple series; non-scatter `values` length ≠ category count; scatter `x`/`y`/`labels` lengths differ; malformed `label-expr` or `label-expr` on scatter; a series `type` outside column/line/area, or a series has `type` while the chart-level type is not one of those three
5. Bare text mixed with block-level tags inside `<text>`; list nesting deeper than 5 levels; an `<a>` with both or neither of `href`/`slide`, a `slide` referencing a nonexistent page id, or an `<a>` nested inside an `<a>`
6. Arrays separated with spaces (should be commas); compound values separated with commas (should be spaces); commas inside category names / series labels; commas inside a font `family`/`font` (fallback lists unsupported, write a single Google Fonts name)
7. A content element without an `id`, or the same element `id` used twice within one slide
8. `dir`/`lang` misplaced: on `<ul>`/`<ol>` (put them on `<li>` items or the parent `<text>`), on `<tr>`/`<td>` (use the `<table>` attribute or `<p dir>`/`<p lang>` inside the cell), `dir` on inline tags other than `<span>` (wrap the segment in `<span dir>` instead), `lang` on any inline tag (no inline form — use the parent block), or `dir="auto"` (only `ltr`/`rtl` exist)
