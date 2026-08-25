# Deal Materials & Decision Support

Playbooks for sell-side marketing, capital markets, investment committee, and daily deal support documents. Load `formats/document_standards.md` when producing docx/pptx; `formats/excel_standards.md` for Excel buyer lists.

## Contents

| Task | Use when |
|---|---|
| [Deal Teaser](#deal-teaser) | Drafting a sell-side investment teaser (blind or named) |
| [CIM Executive Summary](#cim-executive-summary) | Building the opening executive summary / investment highlights section of a sell-side CIM or CIP |
| [Buyer List Development](#buyer-list-development) | Building a sell-side / sponsor-exit buyer universe for a target |
| [Cross-Holder Analysis](#cross-holder-analysis) | Identifying actionable institutional investors for an equity offering (follow-on or IPO) by mapping cross-ownership across a peer set |
| [Initiating Coverage Report](#initiating-coverage-report) | Drafting a sell-side initiation-of-coverage report on a new ticker |
| [Business Quality Scorecard](#business-quality-scorecard) | A PE deal requires a one-page due diligence diagnostic for IC presentation |
| [Project Overview](#project-overview) | A project is opened and a deal-team-facing overview must be auto-generated from uploaded project materials |

---

## Deal Teaser

**Use when**: Drafting a sell-side investment teaser (blind or named) | **Deliverable**: 1-page (maximum 2-page for complex multi-segment businesses) Word (.docx) or PowerPoint (.pptx) + PDF

---

### Ask First
1. **Blind or named?** (Determines whether the full anonymisation audit runs; blind is default.)
2. **Company description, sector/vertical, and ownership background** (founder-owned, PE-backed, carve-out — this frames the narrative).
3. **Key financials** (revenue, Adjusted EBITDA, margins, growth rates, LTM period, any forecast data you want included or withheld) and **sector-specific KPIs** (e.g. ARR/NRR/Rule of 40 for SaaS; relevant operating metrics for other verticals).
4. **Buyer audience** (financial sponsors, strategic acquirers, or both) and **distribution scope** — plus, if both: confirm whether to produce a single dual-purpose version or two tailored versions.

---

### Workflow

1. **Collect all inputs** — blind vs. named flag; company description; format (docx/pptx); ownership background; sector/vertical; financials; buyer audience; distribution scope; transaction structure; timeline; contact information; code name (blind only). *(Having the code name confirmed before drafting prevents a last-minute substitution that re-introduces identifying terms.)*

2. **Draft the header block** — code name (blind) or company name (named); sector headline following the formula **[Positioning] + [Category] + [platform/provider] + [End-market]**, ≤15 words on one line.

3. **Draft the company description** — keep to ≤4 sentences; apply ownership-background narrative frame:
   - Founder-owned → legacy/stewardship angle
   - PE-backed → institutionalised platform angle
   - Carve-out → standalone-readiness angle

4. **Draft the investment highlights** — each highlight uses the structure **[Bold thesis statement] + [Data/evidence] + [Why it matters to the buyer]**. Tailor emphasis by audience:
   - Sponsors: recurring revenue, margin expansion, fragmented-market M&A thesis, low customer concentration, FCF conversion
   - Strategics: market share, geographic/product expansion, technology/IP, end-market positioning
   - Both: lead with universal points, then append 1–2 audience-specific bullets per type

5. **Draft the financial summary** — include revenue, Adjusted EBITDA, and margin; include growth rates; label all adjusted figures "Adjusted EBITDA" with a note that add-back detail is in the CIM (do not list individual add-backs inline). If the current-year forecast shows revenue or EBITDA decline, **omit the forecast column entirely and handle the outlook qualitatively in the highlights**.

6. **Draft the Transaction Overview** — must state clearly: what is being sold, indicative timeline, and how a buyer expresses interest (the explicit call to action). IOI deadline may be included if needed; no other dates.

7. **Include contact information block** — banker name(s), firm, phone, email. *(This is non-negotiable; without it the document cannot function as a teaser.)*

8. **Run the anonymisation audit (blind version only)** — scan every field in the order below before any output is generated:

   #### Anonymisation Audit Checklist (Blind Version)
   | Scan target | Requirement |
   |---|---|
   | Company name / DBA / brand names / product names / logos | Remove entirely; replace with code name or descriptor |
   | Competitor names | Remove; reverse-engineering by named competitor is a primary identification vector |
   | City names / facility addresses | Replace with region (e.g. "Midwest," "Southeast U.S.") — never use city |
   | Customer / supplier / partner names | Replace with descriptors (e.g. "Fortune 500 aerospace OEM") — applies to named teasers too |
   | Employee headcount (niche sector, <20 peers at similar scale) | Use range, not exact figure |
   | Founding year / exact incorporation date | Omit or approximate |
   | Exclusivity / scarcity language ("only provider of X," "one of X companies") | Generalise — unnamed uniqueness claims still identify; e.g. "one of 3 national providers" → "among a select group of national providers" |
   | Revenue / EBITDA precision (niche sector) | Use range (e.g. "$75–$100M") rather than exact; ensure ranges are internally consistent — do not mix a point estimate in highlights ($82M) with a range in the table ($75–$100M) |
   | File name | Must not contain company name, brand, or any identifying term |
   | File metadata (author, organisation, revision history) | Scrub before delivery |
   | Code name | Must have no linguistic or thematic connection to the company's name, sector, or products |

9. **Apply page-length overflow resolution** — if content exceeds 1 page, trim in this sequence (stop as soon as it fits):
   1. Reduce white space
   2. Cut the weakest investment highlight
   3. Reduce financials to LTM only
   4. Compress company description prose
   - **Never cut the Transaction Overview or contact block under any circumstance.**
   - Minimum font size: 10pt.

10. **Output** — deliver docx or pptx (per user's format choice) plus PDF.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Blind vs. named | **Blind** | Preserves confidentiality until NDA is signed |
| Page length | **1 page** (2 pages only for complex multi-segment businesses) | Teaser must be scannable in 60 seconds |
| Valuation / asking price | **Omitted entirely** | Teaser generates interest; it does not anchor price |
| Dates (calendar) | **Omitted entirely** | A dated teaser signals the process has dragged and the deal has been shopped |
| Financial period references | **FY[year] / LTM** labels retained | Period references are expected and do not constitute prohibited date disclosure |
| IOI deadline | **Omitted unless user specifies** | Include only if explicitly requested |
| Adjusted EBITDA labelling | **"Adjusted EBITDA" with CIM-detail footnote; no inline add-back list** | Labelling as plain "EBITDA" creates buyer confusion; listing add-backs in the teaser pre-empts CIM diligence |
| Forecast column | **Omitted if current-year forecast shows revenue or EBITDA decline** | Weak forward numbers undermine the thesis; handle outlook qualitatively in highlights |
| "leading" usage | **≤2 occurrences; only where rank/share/scale evidence exists** | Unsubstantiated superlatives erode credibility |
| Preferred adjectives when "leading" is unearned | **Rapidly Growing / Differentiated / Scaled / Established** | Each implies a verifiable characteristic rather than a subjective ranking |
| Ranges vs. exact figures | **Ranges for blind + niche sectors (<20 peers at similar scale)** | Exact figures in a narrow peer set enable single-search identification |
| Chart type for ranges | **Table only; no bar charts** | Bar charts imply precision and anchor readers to the midpoint |
| Management highlight placement | **Last investment highlight** | Quantitative proof (tenure, organic revenue CAGR) precedes qualitative characterisation |
| Buyer audience default | **Dual-purpose if not specified; flag and ask before finalising** | Sponsor and strategic priorities differ materially |

---

### Rules & Pitfalls

**Never:**
- **Never include the company name, brand, product name, logo, competitor name, city, facility address, or any uniquely identifying term anywhere in a blind teaser — including the file name and file metadata.** Revealing the company identity in a blind document is the single most common and most fatal error; it exposes the seller before NDAs are signed and destroys process control.
- **Never include a valuation, asking price, or price indication.** The teaser's function is to generate interest, not to anchor price negotiations prematurely.
- **Never include calendar dates** (beyond financial period labels like FY25/LTM and, if requested, an IOI deadline). A dated teaser signals a stale, shopped process.
- **Never omit the Transaction Overview.** A document without it is a company profile, not a teaser. The Transaction Overview is what makes the document actionable.
- **Never omit the contact block.** Without it the teaser has no mechanism to advance the process.
- **Never use isolated adjectives as investment highlights** ("leading," "strong," "experienced management team" etc. without supporting data). A purely qualitative highlight will be rejected by sophisticated buyers. "Experienced management team" says nothing; "Management team averaging 12+ years tenure with 15%+ organic revenue CAGR during tenure" is a highlight.
- **Never list individual EBITDA add-backs inline.** Note that adjustments exist and that detail is in the CIM. Listing them in the teaser both pre-empts diligence and signals aggressive quality of earnings.
- **Never go below 10pt font**, even to fit content on one page.
- **Never use a bar chart to display a financial range.** Bar charts imply precision and anchor the reader to the midpoint; use a table.
- **Never include customer, supplier, or partner names — in either blind or named teasers.** Over-disclosure of customer identity narrows identification and reduces negotiating leverage (e.g. "3 of the top 5 airlines" → "several leading national carriers").
- **Never fabricate explanations for weak or declining metrics.** Flag the issue, ask the user for the explanation, then add a footnote with the user's context.

**Conditional:**
- **If the current-year budget shows revenue or EBITDA declining vs. prior year**, omit the forecast column entirely and address the outlook qualitatively within the investment highlights. Weak forward numbers placed in the financial table undermine the entire thesis before the buyer has context.
- **If the sector is niche (fewer than ~20 peers at similar scale)**, replace all exact employee counts, revenue figures, and EBITDA figures with ranges. Verify that any range used in the highlights is consistent with the range used in the financial table — mixing a point estimate in one place with a range in another creates an implicit identification path.
- **If the teaser describes exclusivity or scarcity** ("only national provider of X," "one of three companies that…"), generalise the claim even in a blind teaser — unnamed uniqueness claims are identification vectors. "One of 3 national providers" → "among a select group of national providers."
- **If the buyer audience includes both sponsors and strategics**, produce 1–2 additional tailored bullets per audience type appended to a universal core; confirm with the user whether to deliver a single dual-use document or two separately customised versions before drafting.
- **If the user provides an existing teaser for review**, produce a structured critique ranked by severity — do not rewrite it without explicit instruction.
- **If the turnaround or distressed-asset context is confirmed**, pivot the highlights to asset value, contracted/recurring revenue, brand equity, and improvement opportunity rather than historical growth metrics.
- **If "leading" appears more than twice in the draft**, flag each instance and require rank, market share, or scale evidence to retain it; otherwise substitute Rapidly Growing / Differentiated / Scaled / Established.
- **If a non-software business shows EBITDA margin >50%, a company with >$50M revenue shows CAGR >30%, margin is declining, a business claiming >90% recurring revenue carries no retention metric, or capex exceeds 15% of revenue without context**, flag each anomaly in the pre-delivery check and ask the user to confirm or correct before delivery.
- **If LTM equals the most recently completed full fiscal year** (i.e. it is stale), flag and ask whether more recent trailing data is available.

**Judgment:**
- **Calibrate highlight order to buyer audience.** Sponsors weight recurring revenue, margin expansion potential, fragmented-market M&A thesis, low customer concentration, and FCF conversion. Strategics weight market share, geographic or product expansion, technology/IP, and end-market positioning. Misaligning the emphasis to the wrong buyer type wastes the teaser's limited real estate.
- **Apply the ownership-background narrative frame early.** Founder-owned → legacy and stewardship story. PE-backed → institutionalised platform with systems and management depth. Carve-out → standalone readiness and clean separation thesis. The frame shapes which highlights are compelling and which feel generic.
- **Use the sector headline formula consistently:** [Positioning] + [Category] + [platform/provider] + [End-market], ≤15 words. Deviation produces headlines that read as generic company descriptions rather than investment theses.
- **Lead highlights with quantitative evidence; place management last.** Management tenure and organic CAGR under management are data; character adjectives are not. Putting management first implies the financial story is weak.
- **Include sector-specific KPIs where relevant** — SaaS: ARR, NRR, Rule of 40; manufacturing: utilisation, backlog; healthcare: same-store growth, patient volumes; etc. Generic financial metrics alone fail to speak to sector-specialist buyers.
- **Prefer "region" over "city" in all geographic references** — even in named teasers, city-level precision in combination with sector and size narrows identification unnecessarily.

---

### Pre-Delivery Checks

**Content integrity:**
- Confirm document fits within 1 page (2 pages maximum for complex multi-segment businesses)
- Confirm every investment highlight contains at least one quantitative data point — flag and rework any highlight consisting solely of adjectives
- Confirm financial summary includes revenue, Adjusted EBITDA, and margin line
- Confirm at least one growth rate (revenue or EBITDA CAGR) appears in the document
- Confirm Transaction Overview is present and contains: what is being sold, indicative timeline, and explicit next step for a buyer to express interest
- Confirm sector headline follows [Positioning] + [Category] + [platform/provider] + [End-market] formula and is ≤15 words
- Confirm code name (blind) appears in the header and has no linguistic or thematic connection to the company, sector, or products
- Confirm contact block is present

**Anonymisation (blind version only):**
- Confirm body text, header, footer, and metadata contain no company name, brand name, product name, or DBA
- Confirm no competitor names appear anywhere
- Confirm no city names or facility addresses appear (region descriptors only)
- Confirm no customer, supplier, or partner names appear
- Confirm no exact employee headcount for niche sectors (<20 peers)
- Confirm no exclusivity or scarcity language that would identify the company by process of elimination
- Confirm financial figures use ranges (not exact numbers) for niche sectors, and that ranges are internally consistent across highlights and financial table
- Confirm file name contains no identifying information
- Confirm file metadata (author, organisation, revision history) has been scrubbed

**Financial reasonableness — flag any of the following and seek user confirmation before delivery:**
- Non-software business with EBITDA margin >50%
- Company with >$50M revenue showing CAGR >30%
- Margin declining period-over-period without explanatory footnote
- Business claiming >90% recurring revenue with no retention metric (NRR, churn, logo retention)
- Capex >15% of revenue without contextual explanation
- LTM period equals the most recently completed full fiscal year (potentially stale)

**Tone and language:**
- Flag any unsubstantiated superlative
- Flag any instance of "leading" beyond the second occurrence
- Flag any company description exceeding 4 sentences
- Flag any single investment highlight exceeding 3 sentences

---

### Scope Boundaries

CIM Executive Summary covers the 10–20 page CIM opening section in PowerPoint format and is the appropriate output once NDAs are signed and full process disclosure begins. Pre-deal Investor Briefing (PIB) covers synthesis of public market materials into a PDF. Neither is a substitute for the teaser's function as a pre-NDA marketing hook.

---

## CIM Executive Summary

**Use when**: Building the opening executive summary / investment highlights section of a sell-side CIM or CIP | **Deliverable**: 10–20 slide PowerPoint deck (content and narrative only; formatting handed off to brand/PPTX template)

---

### Ask First

Confirm all six items before producing any content — even for public companies:

1. **Deal codename & naming mode** — blind (pre-NDA) or named (post-NDA)?
2. **Buyer universe & investment type** — strategic, financial, or both? Growth equity, buyout, recapitalization, carve-out, distressed/DIP?
3. **Headline period** — LTM, current calendar year, or both available? (Default logic applied if unspecified — see Defaults.)
4. **Lead narrative themes** — which 3–5 investment highlights should anchor the story?
5. **Source materials** — confirm receipt of: CIM draft inputs, financial Excel, and 5-year management forecast model. Flag any gaps before proceeding.
6. **EBITDA definition** — QoE-defined, management-adjusted (list common add-backs for confirmation), or reported only?

---

### Workflow

1. **Run Intake Gate** — first reply contains only the six questions above; do not produce any deck content until all six are answered. This is the single most common failure point.
2. **Ingest materials and classify industry vertical** — load financial Excel and 5-year forecast model; pull the corresponding industry reference block (see Industry Reference Library below).
3. **Compute headline financials** — calculate revenue growth rates, EBITDA margins, CAGRs, and key volume metrics from the confirmed source data. Flag any missing forecast years as "[TO CONFIRM — pending management model]"; do not extrapolate.
4. **Map company strengths to investment highlight categories** — assign each strength to a named highlight type and determine narrative lead (see Defaults for buyer-range and investment-type logic).
5. **Build slides in slide-map order** — construct every page in sequence; never skip or merge pages due to thin data. Use "[TO CONFIRM]" placeholders where data is absent.
6. **Run pre-delivery checklist** — verify all items in Pre-Delivery Checks before submitting.

#### Slide Map (~16 pages, build every page)

| # | Section |
|---|---------|
| 1 | Section divider |
| 2 | Company snapshot |
| 3 | Overview & history |
| 4 | Market overview (TAM rules apply) |
| 5 | Products & services |
| 6 | Sales & customers |
| 7 | Operations |
| 8 | Management team (Named mode only; omit page entirely in blind mode) |
| 9 | Growth levers |
| 10 | Financial performance |
| 11 | Key investment highlights |
| 12–16 | Additional supporting pages per vertical / deal specifics |

#### Industry Reference Library (apply after vertical classification)

| Vertical | Headline KPIs | Lead Volume Metrics | Preferred Highlight Themes | Vocabulary |
|----------|--------------|---------------------|---------------------------|------------|
| SaaS / Software | ARR, NRR, Rule of 40, gross margin | Seats, logos, expansion revenue | Recurring revenue, net retention, path to profitability | ARR, NRR, Rule of 40, CAC, LTV |
| Industrial / Manufacturing | Revenue, Adj. EBITDA margin, backlog | Backlog, aftermarket mix %, utilization | Installed base, aftermarket annuity, backlog visibility | Backlog, aftermarket, capacity utilization |
| Real Estate / PropCo | NOI, occupancy rate, WAULT | Sq ft, units, properties | Lease stability, diversified tenancy, development pipeline | NOI, cap rate, WAULT, occupancy |
| Healthcare Services | Revenue, Adj. EBITDA, same-store growth | Locations, providers, patient volumes | Reimbursement mix, organic + M&A platform, acuity | Same-store, payor mix, census |
| Consumer / Retail | Revenue, Adj. EBITDA, SSS growth | Stores, SKUs, loyalty members | Brand equity, omnichannel, unit economics | SSS, AUV, LTV, four-wall EBITDA |
| Business Services | Revenue, ARR/contracted revenue %, EBITDA | Clients, FTEs, retention rate | Recurring contracts, cross-sell, scalable platform | Retention, contracted revenue, NPS |

*Pick the most favorable volume metric available. If no volume metric reflects well, omit rather than lead with a weak one.*

#### Investment Highlight Ordering by Investment Type

| Investment Type | Lead Highlights |
|-----------------|----------------|
| Growth equity / acquisition | TAM size, revenue CAGR, organic + M&A levers |
| Buyout / recapitalization | FCF generation, leverage capacity, cash conversion |
| Distressed / DIP / turnaround | Liquidity position, downside protection, inflection point narrative |
| Portfolio / uncertain | Balance growth story + downside protection equally |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|-----------|---------|-----------|
| Naming mode | Blind pre-NDA; named post-NDA | Protects seller identity until confidentiality is established |
| Buyer universe | Both strategic and financial — independent standalone narrative as primary + one light synergy hook per relevant page | Most processes run dual-track; synergy language must never lead the highlights |
| Headline period | If in Q3/Q4, use current calendar year; otherwise use LTM; if unspecified, use whichever period is more favorable — provided it is accurate and ties to source data | Maximize presentation without misrepresentation |
| Investment type (if unspecified) | Balanced: growth story + downside protection | Covers both buyer types |
| EBITDA definition priority | QoE-defined → management-adjusted (with common add-backs confirmed) → reported (labeled "reported," not "Adj.") | Hierarchy ensures consistency and avoids overstating quality of earnings |
| Slide deck formatting | Company PPT brand template; if unavailable, banker house default | Content only — layout is handled by brand/PPTX workflow |
| Financial number precision | One decimal place for all financial figures and percentages | Consistency and readability |
| Percentage display | Growth % and margin % in italics | Distinguishes rates from absolute figures |
| Bullet length | Maximum 2 lines per bullet; prefer more bullets over longer ones | Executive readability |
| TAM citation threshold | 2–3 high-fidelity third-party sources, or one commissioned market study provided by client | No sourced data = qualitative statement only |

---

### Rules & Pitfalls

**Never:**
- **Never include valuation, asking price, implied EV, or any transaction multiple** — pricing silence is non-negotiable in a CIM; the buyer sets price, not the document.
- **Never fabricate or extrapolate data** — every claim must be supported by provided materials. If the forecast model is missing, show historical bars only, label forecast years "TBD — pending management model," and issue a blocking follow-up question to the user.
- **Never use favorable directional language ("accelerating," "expanding," "improving") unless it is true within the specific period shown** — if FY26E margin is below FY25 actual, you cannot describe profitability as expanding; either explain the trend honestly or cite a CAGR/period where the statement is genuinely true.
- **Never apply best-in-class language to a company with a weak operating history in a distressed/turnaround context** — doing so destroys credibility with sophisticated buyers and exposes the bank to diligence embarrassment.
- **Never skip or merge slide-map pages due to thin data** — use "[TO CONFIRM]" placeholders; omitting pages signals gaps to buyers.
- **Never allow rounding drift** — a single LTM revenue or Adj. EBITDA figure that differs by even $0.1M between slides is a credibility-killer with buy-side diligence teams.

**Conditional:**
- **If the company has negative or near-zero EBITDA**, do not lead with EBITDA; instead headline revenue, revenue growth, gross margin/gross profit, ARR/NRR, Rule of 40, or path-to-breakeven. Show EBITDA honestly but do not position it as the investment thesis metric.
- **If distress or turnaround signals are present** (guidance reset in the last 12 months, interim or newly appointed CFO/CEO, forecast-year margin compression, multiple consecutive quarters of deceleration, ongoing strategic review), apply the inflection-point framework: explicitly name what was fixed (cost reduction, restructuring, refinancing, management change) and present a forward trajectory — do not bury the trough.
- **If QoE definition is unavailable**, surface common adjustment items (one-time legal costs, M&A transaction fees, management add-backs) as a blocking confirmation question to the user before computing Adj. EBITDA.
- **If TAM data does not meet the 2–3 high-fidelity source threshold**, replace the TAM figure with a qualitative statement ("large and growing addressable market") or label estimates "(est.)" with a source footnote.
- **If in blind mode**, do not merely swap the company name — actively remove all identity signals: use non-brand-matching color palette, remove all company-specific images and logos, and generalize unique data points (specific geographies, distinctive facility counts, named customers) into ranges or descriptors (e.g., "Fortune 100 retailer," "3 of the top 5 U.S. carriers").
- **If synergy language is used with a dual buyer universe**, keep it to one light hook per relevant page; never let synergy language headline an investment highlight bullet.
- **If a volume metric does not reflect well on the company**, omit it rather than including a weak KPI — lead with the most favorable accurate metric available for that vertical.

**Judgment:**
- **Prefer the more favorable headline period (LTM vs. CY) provided it is accurate and supported by source data** — sell-side framing is legitimate; fabrication is not. The line is accuracy, not conservatism.
- **In blind mode, the principle is: blur identity, never blur the investment story** — over-anonymizing financials or KPIs to the point of making the deck uninvestable defeats the purpose.
- **In a dual buyer universe, let the standalone narrative carry the deck** — synergy hooks should feel incidental to a strategic buyer, not primary, because leading with synergies alienates financial buyers and signals the seller needs a strategic to justify the price.
- **For EBITDA add-backs under management-adjusted treatment**, flag the most common items (one-time legal, M&A fees, management add-backs) and confirm with the user rather than assuming — silent inclusion of contested add-backs is a diligence liability.
- **When selecting which CAGR period or KPI to lead**, choose the period that is both most favorable and most representative of the current business trajectory — cherry-picking a single high-growth year that is clearly an outlier invites skepticism.

---

### Pre-Delivery Checks

- Confirm all slide-map pages are present, in order, and total between 10 and 20 slides.
- Tie out every figure that appears on more than one page (LTM revenue, Adj. EBITDA, EBITDA margin, CAGR, employee count, store/facility/location count) — values must be identical, including footnotes, with no rounding drift and no stale numbers.
- Verify the market page complies with the TAM rule: either 2–3 sourced citations are present or the page uses qualitative language / "(est.)" labeling.
- Confirm naming/confidentiality mode is applied consistently across every page: blind mode uses non-brand color palette, zero company logos or images, and all customer references converted to descriptors with concentration context.
- Confirm the company snapshot slide contains: revenue with growth rate, LTM revenue, LTM Adj. EBITDA (with margin), and at least one volume metric; all in bullet form, not paragraph prose.
- Confirm the financial performance slide contains: revenue and Adj. EBITDA bar chart, margin line overlay, supported historical and forecast years, and labeled CAGR(s).
- Verify no data points are extrapolated or fabricated; all forecast years either tie to the provided management model or are labeled "[TO CONFIRM — pending management model]."
- Confirm EBITDA definition is applied consistently per the confirmed hierarchy (QoE → management-adjusted → reported) and any run-rate figures are labeled as such.
- If distress/turnaround signals were present, confirm the inflection-point framework is used and no unsupported best-in-class language appears.
- Confirm the closing investment highlights slide lists 5–8 discrete highlight bullets and that every applicable highlight category is covered.
- Confirm zero instances of valuation, asking price, implied EV, or transaction multiples anywhere in the deck.
- Confirm the deck is self-contained: all industry abbreviations are defined in a terminology footnote on first use, and every chart or exhibit has a source line in the page footer.
- Confirm all financial figures and percentages are formatted to one decimal place; growth % and margin % are in italics; no bullet exceeds two lines.
- Confirm management team page: Named mode displays real names and titles; blind mode omits the management page entirely and references senior leadership generically (e.g., "seasoned management team") in body copy with no names.

---

### Scope Boundaries

The **Teaser** playbook handles 1–2 page blind/named interest teasers distributed before CIM distribution — shorter format, different narrative density, and no slide map.
The **PIB (Public Information Book) Builder** handles compilation of publicly sourced materials into a reference PDF — assembly workflow, not origination.
Slide formatting, master template application, and brand compliance are handled by the **PPTX / Brand** workflow — this playbook governs content and narrative only.

---

## Buyer List Development

**Use when**: Building a sell-side / sponsor-exit buyer universe for a target | **Deliverable**: Excel workbook (primary, multi-tab) or PowerPoint summary deck (only when explicitly requested)

### Ask First
1. **Target identity & confidentiality** — What is the target's name and project code name? Has the engagement been marked confidential?
2. **Financial profile** — What are the target's LTM Revenue and LTM Adj. EBITDA? What is the indicative TEV range?
3. **Universe scope** — Strategic buyers only, financial sponsors only, or both? Any parties to exclude?
4. **Geography & format** — Confirm geography (default: North America only) and output format (Excel vs. PPT). How many tiers?

---

### Workflow

1. **Collect all required inputs in sequence** — output format / target name / project code / confidentiality flag / underwritten financials (LTM Revenue + LTM Adj. EBITDA) / TEV range / geography / strategic-only vs. both / number of tiers / exclusion list / (if private) marketing materials (CIM). Do not proceed until financials and confidentiality status are confirmed.

2. **Research the target independently before building the list** — For public targets: anchor to SEC filings (10-K / 10-Q / 8-K) and IR materials. For private targets: anchor to the CIM, then triangulate with PitchBook and Preqin (minimum two independent sources). Cross-check the target's 10-K customer and supplier disclosures to catch obvious buyer candidates that a sector-map scan would miss.

3. **Map management career trajectories to surface hidden competitors** — Use LinkedIn and public searches to trace where current and departed senior executives (prior five years) came from and went. Companies repeatedly appearing in these paths are often direct competitors absent from standard industry maps; add qualifying ones to the strategic buyer pool.

4. **Build the Strategic Buyer tab** (four buyer types in parallel):

   | Type | Definition |
   |---|---|
   | Direct competitors | Same product/service, overlapping customers |
   | Adjacent competitors | Neighboring segment; target expands their TAM |
   | Vertical integrators | Customers or suppliers acquiring for vertical control |
   | Platform builders | Acquirers entering the sector to establish a new platform |

   For each candidate:
   - Run payment-ability analysis (see math rules below).
   - Research M&A posture: for public strategics, read earnings call transcripts; for sponsor-backed or private strategics, review press releases and deal patterns from the prior 2–3 years. Note source type in the rationale column for traceability.
   - Record 2 contacts (M&A lead + CEO) per strategic; 3 maximum.

5. **Build the Financial Sponsor tab** — Include only sponsors treating the target as a **new platform investment**. Apply the two-step fund sizing method (see Defaults and Rules). Record up to 3 contacts per sponsor; never list IR contacts.

6. **Handle the sponsor / sponsor-backed portfolio company decision** — For each sponsor whose portfolio company operates in the same sector and is large enough to absorb the target (same industry + larger scale): list the **portfolio company** as a sponsor-backed strategic buyer and **remove the sponsor from the financial sponsor tab**. If the portfolio company does not meet both criteria, keep the sponsor in the financial sponsor tab and reference the portfolio company only under "representative investments" to show sector exposure. Never list both the sponsor and its portfolio company simultaneously.

7. **Apply tiering logic (Tier A / Tier B)** — A buyer reaches Tier A only when all three conditions for its category are met:

   | Category | Tier A conditions (all three required) |
   |---|---|
   | Strategic | Same industry ✓ + Active M&A signal ✓ + Payment ability confirmed ✓ |
   | Sponsor | Sector exposure ✓ + Fund size fit ✓ + Active deployment ✓ |

   Document in the rationale column which specific condition was not met for every Tier B placement. Do not sort or assign tiers arbitrarily.

8. **Apply downgrade triggers** — Evaluate every candidate against the six triggers below. Downgrade (do not silently delete); record the reason in the rationale column:
   - Leverage exceeds threshold post-acquisition
   - Implied acquisition multiple materially above buyer's own trading multiple (target is too expensive for this acquirer)
   - Publicly signaled exit from M&A activity
   - Large acquisition completed within the prior 6 months (requires integration time)
   - Recently divested a comparable asset
   - Fund is near end-of-life with no successor fund raised

9. **Produce output and run pre-delivery checks** (see Pre-Delivery Checks section).

#### Payment-Ability Math

```
Current net leverage    = Net Debt ÷ LTM Adj. EBITDA (buyer standalone)

Pro forma net leverage  = (Buyer Net Debt + Target TEV, fully debt-financed)
                          ÷ (Buyer LTM Adj. EBITDA + Target LTM Adj. EBITDA)
                          — no synergies assumed

Check 1:  Can buyer's cash alone cover full TEV?
Check 2:  Does pro forma leverage exceed threshold? → equity financing required
Check 3:  Is target's implied acquisition multiple materially above buyer's own
          trading multiple? → downgrade; note in rationale
```

Sponsor-backed and private strategic buyers: mark **all** financial fields (including trading multiples) as **NA**.

#### Two-Step Fund Sizing Method

```
Step 1:  Identify actual number of platform investments across the most recent
         2–3 funds. If figure is unavailable or falls outside 8–15, apply
         fallback of 10–12.

Step 2:  Equity check = (Fund size × 80%) ÷ Average platform investment count
         Implied viable TEV = Equity check ÷ 40–50%

If implied viable TEV diverges from target TEV by 2x or more → exclude or
downgrade the sponsor.
```

#### Excel Tab Structure

| Tab | Contents |
|---|---|
| Strategic Buyers | Buyer name (plain language), type (one of four), HQ, LTM Revenue, LTM Adj. EBITDA, net leverage (current + pro forma), leverage threshold, cash vs. TEV check, implied acquisition multiple vs. buyer multiple, Tier, rationale (2–3 substantive sentences), contacts |
| Financial Sponsors | Fund name, fund size, deployment status, platform investment count, equity check, implied viable TEV, sector exposure, Tier, rationale, contacts |
| Exclusions | Excluded party name, reason for exclusion |

#### PPT Rationale Character Limits (when PPT output is required)

| Rows in cell | Max characters |
|---|---|
| ≤ 8 | < 220 |
| 9–14 | < 160 |
| ≥ 15 | < 110 |

Never truncate to a sentence fragment. If content exceeds the limit: first remove lower-priority columns, then condense language. Always preserve the single most important strategic-fit or check-size / sector-match point.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Output format | Excel (full fields); PPT only if explicitly requested | Excel preserves all data fields for diligence and internal review |
| Universe size | Tier A: 5–8 strategics + 5–8 sponsors; total list 20–40 buyers | Broad enough for market coverage; tight enough to be actionable |
| Geography | North America only | Avoids cross-border regulatory and process complexity unless client scope expands |
| Tier structure | Tier A + Tier B | Standard two-tier read for sell-side process prioritization |
| Leverage threshold | 5.0x net debt / Adj. EBITDA | Conservative market convention; adjusted by asset profile (see below) |
| Leverage threshold — asset-light / high-growth | 6.0x | Higher cash-flow predictability supports incremental leverage |
| Leverage threshold — capital-intensive | 5.0x | Capex drag constrains debt service capacity |
| Fund deployment assumption | 80% of fund size deployed as equity | Industry convention for LP commitment utilization |
| Platform investment count fallback | 10–12 | Applied when actual count is unavailable or falls outside the 8–15 range |
| Equity check as % of TEV | 40–50% of TEV | Reflects typical sponsor equity contribution range in leveraged buyouts |
| Strategic buyer contacts | 2 per buyer (M&A lead + CEO); 3 maximum | Sufficient decision-maker coverage without creating noise |
| Sponsor contacts | Up to 3 per sponsor; never include IR | IR contacts have no decision-making authority on new investments |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate contacts, financials, or acquisition history.** Acceptable sources: SEC filings, company websites, LinkedIn, CapIQ, FactSet, PitchBook, Bloomberg, AlphaSense. When sources conflict, official filings and the company's own website override aggregators. If a data point cannot be verified, leave the field blank or mark **NA** — never estimate or infer.
- **Never list a contact who is no longer in role.** Spot-check every name against LinkedIn and the company website at time of delivery; replace departed individuals before sending.
- **Never fabricate email addresses.** Sponsor emails must appear verbatim on the firm's official website. Do not construct addresses from naming conventions.
- **Never include the target's real name anywhere in the deliverable when the engagement is marked confidential** — this includes tab names, slide headers, table headers, footers, file names, and body text. If no code name has been assigned, request one from the user before building.
- **Never include outreach strategy, relationship status, or tactical approach guidance.** The deliverable answers only "who would buy" and "how to reach them." Engagement strategy is out of scope by design.
- **Never list the same person in two separate contact slots** within or across tabs.
- **Never silently delete a buyer who triggers a downgrade condition.** Downgrade and document the specific reason in the rationale column so tier assignments are transparent to the client.
- **Never list a sponsor and its qualifying portfolio company simultaneously on the financial buyer tab.** Apply the binary selection rule (see Conditional below).
- **Never allow the same buyer to appear on both the Strategic and Sponsor tabs.**

**Conditional:**
- **If the target is marked confidential and no project code name has been assigned,** stop and request one from the user before proceeding. Do not use the target's real name as a placeholder.
- **If a mega-cap acquirer (e.g., Oracle, SAP, Microsoft) is under consideration,** include it only if the rationale explicitly establishes that the target is strategically material to that acquirer. If the target represents an immaterial toehold with no specific strategic significance, exclude it entirely — do not downgrade to Tier B, because a weak rationale means the buyer should not appear on the list at all.
- **If a sponsor's portfolio company operates in the same sector and is of sufficient scale to absorb the target (same industry + larger scale, both criteria required),** list the portfolio company as a sponsor-backed strategic buyer and remove the parent sponsor from the financial sponsor tab. If either criterion is not met, retain the sponsor on the financial sponsor tab and reference the portfolio company only as a "representative investment" reflecting sector exposure.
- **If the target's implied acquisition multiple is materially above the buyer's own trading multiple,** downgrade the buyer and note in the rationale that the acquisition would be dilutive on a multiple basis. Do not exclude silently.
- **If a strategic buyer completed a large acquisition within the prior six months,** downgrade (not delete) and note the integration timeline risk in the rationale.
- **If actual platform investment count is unavailable or falls outside 8–15,** apply the 10–12 fallback for fund sizing.
- **If pro forma leverage exceeds the applicable threshold,** note that equity financing would be required; do not automatically exclude — flag it in the rationale and let the tier assignment reflect the added execution risk.
- **If a source is a private target with no CIM available,** triangulate PitchBook and Preqin with at least one additional independent source before using any financial figure.

**Judgment:**
- **Prefer strategic relevance over company size when screening strategic buyers.** A mid-cap acquirer with a clear product adjacency and active M&A cadence belongs in Tier A ahead of a larger acquirer with a tenuous rationale.
- **Use management career-path mapping as a systematic step, not an afterthought.** Executives who migrated between the target and another company frequently signal competitive relationships that do not appear in standard sector classifications.
- **When researching M&A posture for public strategics, prioritize earnings call transcripts over press releases** — management commentary on capital allocation strategy is more forward-looking and candid than press releases.
- **Write rationale in 2–3 sentences with substantive content.** Each rationale should cover: (1) strategic fit or sector exposure, (2) payment-ability or fund-size fit, and (3) any notable qualifier or downgrade flag. Generic phrases ("a leading acquirer in the space") do not satisfy this standard.
- **Use plain-language buyer names** — drop legal suffixes (Inc., Corp., LLC, L.P.) throughout the deliverable for readability.

---

### Pre-Delivery Checks

- **Confirm no sponsor and its qualifying portfolio company appear simultaneously** on the financial sponsor tab.
- **Confirm no buyer appears on both the Strategic Buyers tab and the Financial Sponsors tab.**
- **Confirm every party on the exclusion list is absent from all other tabs.**
- **Confirm every buyer rationale contains 2–3 substantive sentences** covering strategic fit or sector exposure, payment ability or fund sizing, and any applicable qualifier.
- **Confirm all financial fields for sponsor-backed and private strategic buyers are marked NA** — no estimated or inferred figures.
- **Confirm every contact is currently in role** (LinkedIn / company website spot-check); replace any departed individual before delivery.
- **Confirm no email address appears that is not verbatim from the firm's official website.**
- **Confirm the confidentiality sweep:** search the entire deliverable (all tabs, headers, footers, file name) for the target's real name and replace every instance with the project code name.
- **Confirm multiple conventions are consistent across the entire workbook** — Adj. EBITDA vs. Revenue multiples are not mixed; the buyer multiple used in payment-ability analysis is on the same basis as the target's implied acquisition multiple.
- **Confirm implied viable TEV for each sponsor aligns within 2x of the target TEV range;** flag and downgrade any sponsor outside this band.
- **Confirm the completeness cross-check:** verify that obvious direct competitors, key customers, and key suppliers identified in the target's 10-K (or CIM) are either present in the buyer universe or explicitly excluded with a documented reason.
- **Confirm PPT rationale cells do not truncate mid-sentence** and fall within the character limits for their respective row counts (≤8 rows: <220 chars; 9–14 rows: <160 chars; ≥15 rows: <110 chars).

---

### Scope Boundaries

This playbook covers sell-side / exit buyer universe construction: identifying who would acquire the target, their payment ability, and verified contact information. It does not cover buy-side target screening (handled by the **Private Company Screen** playbook), outreach strategy, relationship mapping, or process management. Engagement tactics and contact prioritization remain the responsibility of the deal team.

---

## Cross-Holder Analysis

**Use when**: Identifying actionable institutional investors for an equity offering (follow-on or IPO) by mapping cross-ownership across a peer set | **Deliverable**: Single-page PowerPoint slide (exported as `.pptx` + `.pdf`) + Excel workbook with 5 tabs containing live formulas

### Ask First
None — proceed with defaults below.
*(Mode A vs. Mode B is determined automatically via `companyLookup`; do not ask the user.)*

### Workflow

1. **Resolve the target company** — run `companyLookup` on the ticker or name provided. If the target resolves with an exchange listing → **Mode A (follow-on)**. If resolution fails, no ticker exists, or the company is explicitly private → **Mode B (IPO)**. If ambiguous, default to Mode B and note the assumption in the deliverable.

2. **Screen and select 6–7 comparable companies** — apply ±3× market cap filter within the same GICS sub-industry; confirm the peer set is plausible before proceeding. *(This order matters: peer set must be locked before pulling holdings so all data pulls are consistent.)*

3. **Retrieve all company IDs in parallel** — fetch CapIQ entity IDs for the target and all peers simultaneously to minimize latency.

4. **Pull institutional holdings in parallel** — for each entity, query CapIQ holdings for the most recent six months; retrieve the top 40 holders by position size per company. Set `latestFlag=1` to retain only the most recent filing period for each investor.

5. **Load full data from `sourceFile`** — the summary response returns only the first 5 rows; read the complete JSON payload from `sourceFile` before any filtering. Never filter on a truncated dataset.

6. **Filter investors by type** — apply the active-manager filter (see Rules & Pitfalls). Retain only: Traditional Investment Manager (LO), Hedge Fund Manager (HF), and blank/null investor type (treat as LO). Discard all other categories.

7. **Clean investor names** — apply standard normalizations: FMR → Fidelity; Capital Research → Capital Group; T. Rowe Price Group → T. Rowe Price. Strip legal-entity suffixes (LLC, LP, Inc., Ltd.) from display names.

8. **Build the cross-holder matrix** — apply qualification thresholds (≥$1mm aggregate peer holdings; holdings in ≥2 peer companies). Compute per-investor totals across all peers and sort descending by aggregate peer position. Cap the output at the top 18 rows (standard slide capacity); if the user has explicitly approved a wider layout, extend to 25. *(Sorting before capping ensures the most relevant accounts appear.)*

9. **Apply OW/UW color coding** — for Mode A only: calculate `%Diff` = investor's actual % ownership in target vs. peer-average % ownership. Positive `%Diff` (overweight) → **red**. Negative `%Diff` (underweight) → **green**. *(Green = underweight = primary placement target. This is the semantic core of the deliverable; do not reverse the convention.)*

10. **Assemble the single-page slide** — follow the layout specification in the **Slide Layout** subsection below.

11. **Export all deliverables** — output `.pptx`, `.pdf`, and `.xlsx` (with live formulas) in a single delivery package. Confirm the subtitle `[N]` equals the actual number of rendered data rows.

---

#### Slide Layout

- **Logo band**: Fetch a real logo for each peer and (in Mode A) the target. Place all logos in a horizontal band **above the data table**, not inside it. Each logo column width must not exceed 90% of its allocated cell width. Before saving, **assert that no two adjacent logos overlap**; if overlap is detected, reduce padding and re-render.
- **Table header**: Navigation-blue fill for column headers.
- **OW/UW semantic color**: Applied only to the `%Diff` column (Mode A). Do not apply OW/UW coloring to any other column.
- **Page dimensions**: 13.33 × 7.5 inches (standard widescreen). Safe row capacity at this size is ~18 rows. Never silently overflow the page; if the qualified list exceeds the row cap, truncate to the cap and note the total qualified count in the subtitle.
- **Branding**: If a PPT branding skill is loaded in the same session, delegate title, subtitle, and footer styling to that skill. Retain ownership of: analysis content, column structure, navigation-blue header, and OW/UW semantic colors. Do not embed any single bank's pitch-deck graphics or footer language.

---

#### Excel Workbook Structure (5 tabs — live formulas required)

| Tab | Contents |
|---|---|
| **Summary** | Cross-holder matrix with `SUMIFS`/`AVERAGEIFS` formulas referencing Raw Holdings — no hard-coded values; user edits to Raw Holdings automatically recalculate Summary |
| **All Qualified** | Full list of investors that passed the ≥$1mm / ≥2-peer filter, before the 18-row display cap |
| **Peer Set** | Peer company names, tickers, CapIQ IDs, and market caps used in this run |
| **Methodology** | Plain-language description of all filter rules, thresholds, and data sources applied |
| **Raw Holdings** | Complete CapIQ pull with columns: `investor_name`, `investor_type`, `period_end`, `filing_date`, `accession_#`, `source_type`, `owner_id`, `shares_held`, `market_value`, `pct_outstanding`, `latestFlag` |

Apply conditional formatting to Summary so OW/UW red/green updates automatically when underlying formula values change.

---

#### Mode A vs. Mode B Column Differences

| Column | Mode A — Follow-On (Public) | Mode B — IPO (Private) |
|---|---|---|
| Target holdings column | ✅ Include | ❌ Remove entirely |
| % of target outstanding | ✅ Include | ❌ Remove entirely |
| % Peer Avg | ✅ Include | ❌ Remove entirely |
| OW/UW label + %Diff | ✅ Include | ❌ Remove entirely |
| Target logo in logo band | ✅ Include | ❌ Omit |
| Sort order | Aggregate peer holdings, descending | Aggregate peer holdings, descending |

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Number of comparable companies | 6–7 | Sufficient cross-ownership signal without diluting the peer average |
| Investor qualification threshold — minimum position size | ≥$1mm aggregate across peer set | Screens out negligible / tracking positions |
| Investor qualification threshold — minimum peer breadth | Holdings in ≥2 peer companies | Confirms genuine sector focus, not single-stock concentration |
| Ranking metric | Aggregate peer holdings, descending | Prioritizes accounts with the largest potential allocation capacity |
| Maximum displayed rows (standard layout) | 18 | Hard capacity of a 13.33×7.5-inch slide without overflow |
| Maximum displayed rows (wide layout, user-approved) | 25 | Extended layout only; requires explicit user sign-off |
| Holdings lookback window | Most recent 6 months | Balances data freshness with filing-lag reality |
| Filing period filter | `latestFlag=1` only | Prevents double-counting across restated or superseded filings |
| Mode when target is ambiguous | Mode B (IPO) | Conservative default; removes target-specific columns that would be meaningless for a private company |

### Rules & Pitfalls

**Never:**
- **Never substitute any data source other than CapIQ institutional holdings** — the workflow requires per-investor `%` ownership, market value, and `latestFlag` fields at the individual-filer level; no public web source or alternative database provides this granularity. If CapIQ access is not confirmed, stop immediately and instruct the user to contact their CapIQ administrator before proceeding.
- **Never filter from the summary/truncated API response** — the summary returns only the first 5 rows; filtering on it silently drops qualified investors. Always load the full JSON from `sourceFile` first.
- **Never apply the ≥$1mm threshold to the target column** — the threshold applies only to peer holdings and peer-average calculations. The target column must show each investor's full position in the target regardless of size, because bankers need to see the complete existing ownership picture.
- **Never silently overflow the slide** — if qualified investors exceed the row cap, truncate to the cap, update the subtitle `[N]` to reflect actual rendered rows, and note the total number of qualified accounts.
- **Never hard-code values in the Summary Excel tab** — Summary cells must use `SUMIFS`/`AVERAGEIFS` referencing Raw Holdings so the model remains live; hard-coded values break the deliverable the moment a user updates the raw data.
- **Never reverse OW/UW color semantics** — overweight (positive `%Diff`) is red; underweight (negative `%Diff`) is green. Green signals available capacity to buy, which is the primary placement target. Reversing this is a material presentation error.

**Conditional:**
- **If CapIQ classifies an investor as "Traditional Investment Manager" but the name is a well-known hedge fund, flag the misclassification to the user before finalizing** — CapIQ systematically mislabels many HFs as LOs (known examples: Renaissance Technologies, D.E. Shaw, Marshall Wace, Lone Pine Capital, Tiger Management, Coatue Management, Viking Global). The override list is explicitly incomplete. Scan the top 25 LO-labeled investors in every run; do not blindly trust the LO tag.
- **If a firm name matches a broker-dealer or bank parent entity (e.g., "Goldman Sachs Group", "Morgan Stanley"), exclude it** — but if the same firm has a distinct asset-management arm (e.g., "Goldman Sachs Asset Management"), retain that arm as an active manager. Apply the same logic to ETF arms vs. active arms (e.g., exclude "Invesco Capital Management LLC" [ETF arm]; retain "Invesco Ltd." [active arm]).
- **If a PPT branding skill is active in the same session, defer title/subtitle/footer formatting to that skill** — retain ownership of analysis content, column structure, navigation-blue headers, and OW/UW semantic colors only.
- **If logo fetch fails, retry before accepting failure** — a real logo is required; placeholder or missing logos are not acceptable on the final deliverable.

**Judgment:**
- **Prefer the mode inferred from `companyLookup` over any assumption** — automatic mode detection (exchange listing present → Mode A; absent → Mode B) removes a common source of deliverable error and avoids interrupting the user's workflow.
- **When selecting peers, weight relevance (GICS sub-industry alignment) over market cap alone** — the ±3× cap filter is a screen, not a selection criterion; a tighter business-model match with a slightly wider cap delta is preferable to a size-matched but operationally dissimilar comp.
- **Treat blank/null investor type as LO, not as a disqualifier** — many legitimate active managers have incomplete CapIQ type fields; discarding them would systematically undercount the actionable investor universe.

### Pre-Delivery Checks

- Confirm `latestFlag=1` is applied; verify no investor appears more than once (duplicate filings from restated periods).
- Confirm full `sourceFile` data was loaded, not the truncated 5-row summary response.
- Verify investor type filter: only LO, HF, and blank types remain; confirm no index/passive managers (Vanguard, BlackRock, State Street, Geode), no market-makers/HFT (Jane Street, Susquehanna, Virtu), no systematic quant funds (Two Sigma), no broker-dealer parent entities, no sovereign wealth funds (Norges), no family offices, no government/corporate pension plans, no VC/PE firms, and no insurance companies are present in the final list.
- Scan the top 25 LO-labeled investors for known HF misclassifications; flag any identified to the user.
- Confirm parent/asset-management-arm disambiguation has been applied (broker parent excluded, AM arm retained).
- Verify Mode A/B column structure matches the resolved mode; confirm target columns are fully removed in Mode B.
- Confirm row count ≤18 (standard) or ≤25 (wide, user-approved); confirm subtitle `[N]` equals actual rendered row count.
- Assert no adjacent logos overlap; confirm all logos are in the band above the table and not inside any data row.
- Confirm `%Diff` color coding: positive = red, negative = green; verify no reversal.
- Confirm the ≥$1mm threshold was applied to peer holdings only, not to the target column.
- Confirm the Excel Summary tab uses `SUMIFS`/`AVERAGEIFS` formulas referencing Raw Holdings with zero hard-coded values.
- Confirm Raw Holdings tab includes all required reference columns: `period_end`, `filing_date`, `accession_#`, `source_type`, `owner_id`.
- Confirm conditional formatting in the Summary tab triggers on formula output, not static values.
- Confirm all three export formats (`.pptx`, `.pdf`, `.xlsx`) are present in the delivery package.

### Scope Boundaries

This playbook is an ECM-specific investor-targeting tool; it does not perform general buy-side ownership analysis or comparable company selection for valuation purposes — those workflows are handled by separate playbooks. The Excel workbook produced here is a live-formula reference file, not a financial model; DCF, trading comps, and transaction comps outputs are out of scope. Equity bridge calculations, share count reconciliations, and offering-size sizing are handled by the ECM pricing and structuring playbooks.

---

## Initiating Coverage Report

**Use when**: Drafting a sell-side initiation-of-coverage report on a new ticker | **Deliverable**: Scaffold document (docx / pdf / pptx) with 14 fixed sections; analyst supplies rating, price target, and investment thesis

---

### Ask First
1. Is there a precedent initiation report to mirror for layout and tone?
2. Which format: **launch note** (3–5 pp) / **standard** (15–25 pp, default) / **comprehensive** (30–50 pp)?
3. Is a financial model being uploaded? (If yes, all figures pull from the model; none are self-generated.)
4. What is the analyst's preliminary rating, 12-month price target, and core thesis points? (Leave as flagged placeholders if not yet confirmed — never fabricate.)

---

### Workflow

1. **Confirm intake** — lock format, precedent template, and model availability before building any section. (Order matters: formatting choices govern all subsequent layout decisions.)

2. **Build the cover / executive summary** — populate one-sentence lede in the form: `[Company], [Ticker] | [Rating] | 12-month PT: $[X] ([Method]) | Current: $[Y] | [±Z%]`. Place numbered thesis bullets directly on cover; cover must be self-contained (rating, PT, thesis, key reasoning — all readable without turning a page).

3. **Draft the Investment Thesis section** — state the primary variant view in ≤3 numbered points; these exact points must recur verbatim in the cover and the Investment Positives section (three-point consistency check).

4. **Build Investment Positives (deep-dives)** — each positive must add at least one of: new data, new chart, deeper causal mechanism, or competitor / historical comparison. Never restate thesis language without incremental substance.

5. **Draft Key Debates section** — source from recent earnings Q&A, short-seller reports, and 10-K risk factors. Format each debate as: *question-style header → 1–2 sentence bear case → 2–3 sentence data-backed rebuttal*. Every bear argument must be directly confronted, not sidestepped.

6. **Write Company Overview and Industry & TAM** — cite every external data point (TAM size, market share, regulatory facts, competitor multiples) with source name and as-of date. Tier-1 sources (10-K, regulatory filings, CapIQ / FactSet / Bloomberg) take priority; Tier-2 sources acceptable only if named and dated.

7. **Build Competitive Positioning** — use competitor sell-side notes for bear-case context only; never cite or quote them as sources.

8. **Construct Financial Forecasts** — decompose revenue growth into volume × price × mix (or segment-by-segment); never use a single blended growth rate. All assumptions must be named and explicit; no hard-coded growth rates embedded in formulas. Flag any figure pulled from an uploaded model as pending analyst verification.

9. **Build House vs. Consensus table** — compare your estimates to consensus on all key line items; flag meaningful divergences as thesis drivers.

10. **Build Valuation section** — select one primary method to anchor the PT, supported by secondary methods as cross-checks. State explicitly: *"PT anchored to [Year]E [Metric] at [X]x, validated by DCF and precedent transactions."* Produce a **football field** chart showing all methods. If primary and secondary methods diverge by >~30%, write a reconciliation paragraph.

11. **Build Bull / Base / Bear scenarios** — differentiate each scenario by operating assumptions (revenue growth, margin, industry KPI), not by terminal value multiples alone. Each scenario must include one sentence stating *"what the investor is betting on."* Confirm that **cover PT = base-case PT**; if they diverge, re-anchor before delivery.

12. **Write Catalysts section** — list only externally visible events with a named expected date (e.g., "Q3 earnings release, est. [Month Year]"). This section answers: *"When will the market know?"*

13. **Write Risks section** — quantify each risk (downside PT, sensitivity range, or threshold). Map bear-scenario outcomes to specifically named High-Impact risks. Include 2–3 explicit data points that would trigger a rating downgrade ("What would change our view").

14. **Draft Management & Governance section** — include real biographical detail and at least one concrete, named performance achievement per executive (flag any generic language for analyst replacement). Assess compensation alignment: flag any mismatch between incentive structure and thesis driver (e.g., comp tied to revenue when thesis depends on margin expansion). Flag board independence issues, chairman structure, and any governance red flags.

15. **Build Appendix** — include comp table (labeled NTM or LTM, never mixed), detailed model outputs, source list.

16. **Run sanity checks** (see Pre-Delivery Checks below).

---

#### Section Map (14 Fixed Sections — order is invariant)

| # | Section |
|---|---------|
| 1 | Cover / Executive Summary |
| 2 | Investment Thesis |
| 3 | Investment Positives |
| 4 | Key Debates |
| 5 | Company Overview |
| 6 | Industry & TAM |
| 7 | Competitive Positioning |
| 8 | Financial Forecasts |
| 9 | House vs. Consensus |
| 10 | Valuation |
| 11 | Bull / Base / Bear Scenarios |
| 12 | Catalysts |
| 13 | Risks |
| 14 | Management & Governance |
| + | Appendix |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|-----------|---------|-----------|
| Price target horizon | 12 months | Sell-side convention; 3- or 5-year only if analyst explicitly requests |
| Report format | Standard (15–25 pp) | Balanced depth vs. readability for initiation audience |
| Primary valuation method | One explicit anchor method + secondary cross-checks | Prevents blended PT that obscures analytical view |
| Scenario differentiation | Operating assumptions (growth, margin, KPI) | Price-only differentiation is not analytically meaningful |
| Forecasts | Named, explicit assumptions only | Hard-coded rates are unauditable and uncreditable |
| Revenue decomposition | Volume × price × mix (or by segment) | Single blended rate masks the thesis driver |
| External data citation | Source name + as-of date on every data point | Enables verification; absence is a compliance and credibility risk |
| Tone | Analytical, not promotional | Sell-side credibility depends on objectivity signaling |
| EBITDA definition | Company-reported figures (before adjustment) | Consistency across cover, financials, multiples, and comp table is required; definition must be disclosed |
| WACC | Derived from capital structure; never hard-coded | Hard-coded WACC is unauditable; flag any result <6% or >14% |
| Terminal growth rate cap | ≤3% (GDP ceiling) unless explicit rationale provided | Growth above long-run GDP is not sustainable by definition |
| Comp table multiples | As-of date labeled; NTM and LTM never mixed | Mixing conventions produces meaningless cross-company comparisons |
| Price staleness threshold | Re-pull any price >7 days old | Stale prices corrupt implied upside/downside and rating consistency |
| Consensus update cadence | Refreshed every quarter and after each earnings event | Consensus drift is the single most common source of House vs. Consensus error |
| Unprofitable company multiples | P/E and EV/EBITDA labeled NM; industry-appropriate substitute multiples added | Presenting NM without substitutes leaves valuation section incomplete |
| Missing data | Flagged placeholder inserted | Never fabricate; analyst fills all judgment-dependent gaps |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate a rating, price target, thesis point, or data point** — these are the analyst's signed professional judgments; AI-generated opinions breach the fundamental integrity of research authorship.
- **Never present a blended price target without identifying the primary anchor method** — blending obscures the analytical view and prevents reviewers from stress-testing the key assumption.
- **Never use a single blended growth rate in forecasts** — it hides the volume/price/mix driver that is typically the core of the variant thesis.
- **Never mix NTM and LTM multiples in the same comp table or football field** — the comparison becomes arithmetically meaningless and is immediately spotted by institutional readers.
- **Never use unquantified superlatives** ("best-in-class," "industry-leading," "transformational") — replace with the specific metric and data point, or delete; unsupported superlatives are the fastest credibility signal that a report is promotional rather than analytical.
- **Never use a price more than 7 days old** without re-pulling — stale prices corrupt implied return calculations and can misstate the rating's implied upside.
- **Never hard-code WACC** — derive it from the actual capital structure; flag outputs below 6% or above 14% for analyst review.
- **Never cite a competitor's sell-side research note as a source** — use it only to understand the bear case; quoting it creates attribution, independence, and compliance issues.
- **Never let cover PT diverge from base-case scenario PT** — the disconnect signals an internal inconsistency that will surface immediately in client Q&A.

**Conditional:**
- **If primary and secondary valuation methods diverge by more than ~30%, write a reconciliation paragraph** before delivery — do not let the football field carry an unexplained gap.
- **If the company is unprofitable**, label P/E and EV/EBITDA as NM, add sector-appropriate substitute multiples (SaaS: EV/ARR, EV/Revenue; early-stage: EV/Gross Profit; biotech: rNPV or pipeline sum), and surface the earnings inflection year and cumulative cash consumption in the cover summary and forecast section — do not bury them in the body.
- **If compensation structure is misaligned with the thesis driver** (e.g., executive pay indexed to revenue while the thesis depends on margin expansion), flag the mismatch explicitly in the Management section — do not omit.
- **If any governance red flag is present** (board independence deficit, combined chairman/CEO without explanation, related-party transactions), flag it in the Management section — do not sanitize.
- **If an uploaded financial model is provided**, pull all figures from the model and flag each as pending analyst verification — never self-generate figures that conflict with or bypass the model.
- **If a Tier-2 external data source is used** (industry reports, company presentations, press releases), it is acceptable only if the source is named and dated; Tier-1 sources (10-K, regulatory filings, CapIQ / FactSet / Bloomberg) must be exhausted first.
- **If a terminal growth rate above 3% is used**, provide explicit written justification — GDP-ceiling exceptions require a named structural reason (e.g., secular category expansion with documented precedent).

**Judgment:**
- **Treat this document as a scaffold for the analyst to edit, not a finished product** — the analyst owns every judgment call; the scaffold enforces structure, completeness, and internal consistency.
- **Distinguish Milestones from Catalysts rigorously**: Milestones are internal company KPIs ("maintain NRR >120%") answering *"what must the company achieve"*; Catalysts are externally dated events ("Q3 earnings release") answering *"when will the market know."* They belong in different sections and must never be conflated — conflation is a common tell of less-experienced research.
- **"Optionality" is not a standalone thesis point** — balance sheet strength, M&A capacity, or strategic flexibility must be bound to a specific executable action (named acquisition target, named capacity investment, explicit capital return program) or converted to that action; free-floating optionality language should be cut.
- **Each Investment Positive deep-dive must add incremental substance** — new data, new chart, a deeper causal mechanism, or a competitor/historical comparison. Restating the thesis bullet with different wording fails the institutional standard.
- **Prefer EBITDA definition consistency over convenience** — disclose the definition (reported vs. adjusted; SBC treatment) on first use and apply it identically across the cover, financial tables, multiples, and comp table throughout the document.
- **Apply sector-specific KPIs as the primary operating metrics** — SaaS: ARR, NRR, Rule of 40; Banks: NII, NIM, efficiency ratio (do not apply EBITDA to banks); REITs: FFO, AFFO, NAV; Consumer: same-store sales, AUV, four-wall EBITDA. Using generic metrics in a sector-specific context signals analytical unfamiliarity.

---

### Pre-Delivery Checks

- **Verify** cover implied return = (PT − current price) / current price; confirm sign and magnitude are correct.
- **Verify** rating language is consistent with implied return (Buy conventionally implies >10% upside; adjust or flag any mismatch).
- **Verify** cover PT equals base-case scenario PT exactly; if not, re-anchor before delivery.
- **Verify** primary and secondary valuation methods do not diverge by more than ~30%; if they do, confirm reconciliation paragraph is present and complete.
- **Verify** bull and bear scenarios are differentiated by operating assumptions (growth rate, margin, industry KPI) — not only by terminal value multiple.
- **Verify** bear scenario outcomes map to specifically named High-Impact risks in the Risks section.
- **Verify** every numbered thesis point appears with consistent wording in three locations: cover, Investment Thesis section, and Investment Positives section.
- **Verify** every external data claim (TAM, market share, competitor multiple, regulatory fact) carries a named source and as-of date, or a flagged placeholder.
- **Verify** historical actuals match the most recent 10-K / 10-Q filing.
- **Verify** all comp table multiples are labeled NTM or LTM and that NTM and LTM multiples are never mixed in the same column or comparison.
- **Verify** all stock prices and consensus estimates are no older than 7 days; re-pull if stale.
- **Verify** all Catalysts entries carry a named expected date.
- **Verify** each Management entry includes tenure and at least one specific, named performance achievement; flag any generic biographical language for analyst replacement.
- **Verify** all 14 canonical sections are present; flag any missing section before delivery.
- **Verify** any company with material working capital has DSO / DPO / DIO table present; flag if absent.
- **Verify** EBITDA definition is disclosed and applied identically across cover, financials, multiples table, and comp table.
- **Verify** WACC is derived from capital structure; flag if output is below 6% or above 14%.
- **Verify** terminal growth rate is ≤3% or carries written justification.
- **Verify** unprofitable company sections label P/E and EV/EBITDA as NM and include sector-appropriate substitute multiples.
- **Verify** earnings inflection year and cumulative cash consumption appear in the cover summary and forecast section (for unprofitable companies), not only in body text.
- **Verify** milestone descriptions in scenario narratives are numerically consistent with the corresponding model outputs for that scenario.
- **Verify** all figures sourced from an uploaded model are flagged as pending analyst verification.

---

### Scope Boundaries

**Initiation Report Analysis** handles reading and summarizing a third party's existing initiation — use that playbook when the task is to extract, critique, or reformat someone else's research rather than author original coverage.
**Earnings Update** handles the quarterly results flash note — use that playbook for post-print estimate revisions, EPS beat/miss commentary, and guidance changes on a ticker already under coverage.
Valuation sub-tasks (comps build, DCF build, precedent transactions) are constructed inline as part of this workflow's Valuation section; if a standalone valuation deliverable is required independently of an initiation, use the dedicated Comps, DCF, or Precedent Transactions playbooks.

---

## Business Quality Scorecard

**Use when**: A PE deal requires a one-page due diligence diagnostic for IC presentation | **Deliverable**: Single-page PPTX (landscape) with four fixed sections, six-state rating dots, and number-anchored comments — 16–22 rows total

---

### Ask First
1. **Target basics**: Company name, one-line business description, and investment thesis.
2. **Deal context**: Investment stage, transaction type (buyout, carve-out, add-on, take-private, sponsor-to-sponsor, etc.), and sponsor name (exact firm name — never a placeholder).
3. **Vertical**: Industry sector/sub-vertical (determines conditional row logic — see Workflow Step 2).
4. **Available materials**: QoE received (yes/no), CIM, management presentation, or other source documents; list what exists so TBD rows can be scoped correctly.

---

### Workflow

**1. Lock scope** (Steps 1–4 above must be confirmed before building; do not proceed on partial inputs.)

**2. Select rows by section using default counts and conditional vertical logic**
Apply the four fixed sections in this order — **INDUSTRY → COMPANY → FINANCIAL → INVESTMENT** — and target the following row budgets:

| Section | Default row count |
|---|---|
| INDUSTRY | 4–6 |
| COMPANY | 5–6 |
| FINANCIAL | 3–5 |
| INVESTMENT | 4–5 |
| **Total** | **16–22** |

Then layer conditional rows for the deal's vertical before finalising the row list:

| Vertical / Deal Type | Add / Substitute |
|---|---|
| Healthcare services | Add **Pricing / Reimbursement** row; note reimbursement exposure and state concentration |
| Building materials / Industrial | Cyclicality skews Yellow/Red by default; comment must reference end-market mix (residential % / non-residential %) |
| SaaS | Add **Mission-Criticality** and **Cash Conversion** rows; comments must carry ARR, NRR, GRR, Rule of 40 |
| Restaurant / Multi-unit | Add **White Space** row; comments must carry SSS, AUV, four-wall EBITDA, unit capex, cash-on-cash return, payback period |
| Carve-out | Rate **Controls / Enterprise Risk** Yellow/TBD; comment must name TSA, stranded costs, stand-alone cost estimate |
| Add-on | Prepend a **Platform Snapshot** block; substitute one row for **Strategic Fit with Platform** |
| Take-private | Valuation comment must cite premium to 30-day VWAP (e.g., "X% premium to 30-day VWAP") |
| Sponsor-to-sponsor | Base Earnings defaults to TBD pending QoE |

**3. Extract facts from materials** (extract → do not invent)
Pull every numeric anchor you need: TAM ($bn), growth rate (% CAGR with period), market share (% of $X bn addressable market), turn multiples (x), leverage (x), equity (%), MOIC, IRR. Where a required number is absent from materials, record the row as TBD — do not fabricate.

**4. Write two-part italic comments in punchline-first format**
Structure every comment as: *"[Conclusion]; [counter-fact / mitigant / diligence flag]"*
- Lead with the single most important point; target ~25 words; hard cap at 40 words — cut anything beyond.
- Strip all sell-side CIM language ("world-class," "premier," "leading" without evidence); replace with specific facts (e.g., "#2 by share, ~25% of ~$4.5bn addressable market").

**5. Assign six-state ratings**

| Rating | Rendering |
|---|---|
| Green | Solid green dot |
| Green/Yellow | Diagonal split dot |
| Yellow | Solid yellow dot |
| Yellow/Red | Diagonal split dot |
| Red | Solid red dot |
| TBD | Grey background, white text |

The dot must match the comment's tone — if the comment contains a caveat or counter-fact, the rating must be split, not solid.

**6. Apply slide metadata**
- Slide title: include phase label (e.g., "Preliminary IC")
- Top-right / subtitle: project name + IC round (e.g., "Project X IC #1")
- Footer: date
- Footnotes: cite all third-party sources

**7. Enforce the one-page constraint**
If the row count threatens to exceed the page, merge rows or delete the lowest-priority row. Never flow to a second page.

**8. Run Pre-Delivery Checks** (see section below) before rendering.

**9. Render** — pass final content to the PPTX rendering skill with firm brand template applied. If QoE materials are available, call the buy-side QoE skill to extract adjustments and adjusted EBITDA, then populate the Base Earnings row.

---

#### Slide Layout
Four-column structure (left to right):
1. **Section label** — rotated, merged vertically (INDUSTRY / COMPANY / FINANCIAL / INVESTMENT)
2. **Parameter name** — bold, not italic
3. **Comment** — italic, two-part punchline format
4. **Rating dot** — rightmost column

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Output format | PPTX (landscape, one page) | Standard IC deck format; Word landscape or PDF on request |
| Rows without factual support | TBD (grey dot) | First-order discipline: never fabricate a number |
| Rows with both positive and negative evidence | Split rating (diagonal two-colour dot) | Reflects real-world ambiguity; pure-colour majority signals imbalance |
| Total row count | 16–22 | Enough granularity to diagnose; hard ceiling to fit one page |
| Row distribution | Industry 4–6 / Company 5–6 / Financial 3–5 / Investment 4–5 | Balanced coverage across diligence dimensions |
| Base Earnings row (QoE not yet received) | TBD | Cannot assert adjusted EBITDA without QoE sign-off |
| Naturally TBD rows (absent sourced data) | TBD: Initial valuation, Fan of Returns, Capital structure, Base Earnings, Process/Sponsor Angle, Size/TAM (when unsized) | These rows require deal-specific data that cannot be inferred |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate a number.** If a required metric (TAM, CAGR, share %, leverage multiple, MOIC, IRR) is not in the source materials, rate the row TBD. Invented figures are the fastest credibility killer in sponsor diligence.
- **Never quote a bare market-share percentage without a dollar denominator.** Write "~25% of ~$4.5bn addressable market," not "25% share" — the denominator is what validates the sizing claim.
- **Never leave "[Firm]" or any placeholder in the Process / Sponsor Angle row.** Use the sponsor's actual name. Vague placeholders signal the slide was never personalised and will be rejected immediately.
- **Never assert "attractive relative to comps" without actual comparable company data in hand.** Conjecture on relative valuation is treated as fabrication.
- **Never let the scorecard overflow to a second page.** Merge or cut lowest-priority rows; a two-page BQC defeats the format's purpose.
- **Never use sell-side CIM superlatives ("world-class," "premier," "leading") without quantified evidence.** Replace every instance with a specific fact; sponsor diligence defaults to scepticism.
- **Never misclassify rows across sections.** Cyclicality belongs in INDUSTRY, not COMPANY; management quality belongs in COMPANY, not INVESTMENT; initial valuation belongs in INVESTMENT, not FINANCIAL.

**Conditional:**
- **If more than 50% of rows carry pure-colour (non-split) ratings, flag the scorecard as potentially unbalanced** before delivery and review whether counter-facts were omitted.
- **If more than 30% of rows are TBD, flag to the user** — the deal may be too early-stage for a full BQC; offer the choice of a 6–8-row abbreviated version or a prose diligence note instead.
- **If a comment contains any caveat or counter-fact, the rating dot must be split (Green/Yellow or Yellow/Red), not solid** — dot and comment tone must be consistent.
- **If the transaction is a carve-out**, rate Controls / Enterprise Risk Yellow/TBD by default and name TSA duration, stranded-cost estimate, and standalone cost build in the comment.
- **If a high-synergy strategic buyer is present in an auction process**, rate the Process / Sponsor Angle row Red — the sponsor is structurally disadvantaged on price.
- **If QoE materials are available**, call the buy-side QoE skill to extract adjustments and adjusted EBITDA before populating the Base Earnings row; do not populate from CIM EBITDA directly.
- **For small tuck-ins, re-ups / co-investments, or very early-stage screening**, ask the user whether a full 16–22-row BQC is warranted or whether a 6–8-row abbreviated version or a single-paragraph diligence note is more appropriate.

**Judgment:**
- **Split ratings are the norm, not the exception.** In most real deals, the majority of rows carry evidence on both sides; a scorecard dominated by solid greens reads as a sell-side endorsement, not a sponsor diagnostic.
- **Punchline-first comment discipline forces honest prioritisation.** Leading with the single most important conclusion — positive or negative — prevents burying the lead behind hedging language.
- **Specific relationship language in Process / Sponsor Angle is a differentiator.** "9-year relationship with CEO originating from portfolio company overlap at Bain Capital" is defensible; "long-standing relationship" is not.
- **Vertical customisation of rows signals real diligence.** A SaaS scorecard without NRR or a restaurant scorecard without four-wall EBITDA reads as generic — add vertical-specific rows even when they rate TBD.

---

### Pre-Delivery Checks
- Confirm every row has an assigned rating (no blank dot cells).
- Confirm all parameter names are bold and non-italic; all comments are italic.
- Confirm Size & Growth rows carry both a dollar market-size figure and a CAGR with period (e.g., "7% CAGR, 2022–2027").
- Confirm Valuation row cites a turn multiple (or absolute valuation for early-stage deals); for take-privates, confirm premium to 30-day VWAP is stated.
- Confirm no bare percentages appear without a dollar denominator in any market-position or share reference.
- Confirm Returns row cites both MOIC and IRR (or is rated TBD if data is absent).
- Confirm Exit row names at least one specific exit pathway.
- Confirm Capital Structure row cites leverage (x EBITDA), equity (%), and liquidity position (or is rated TBD).
- **Flag if pure-colour rows exceed 50%** of total rows — scorecard may not be sufficiently balanced.
- **Flag if TBD rows exceed 30%** of total rows — offer user the option to wait for additional diligence materials.
- Confirm all section-row assignments are correct: cyclicality in INDUSTRY, management in COMPANY, initial valuation in INVESTMENT.
- Confirm slide metadata is complete: phase label in title, project name + IC round in subtitle, date in footer, third-party source footnotes present.
- Confirm the entire scorecard fits on one page with no overflow.

---

### Scope Boundaries
PPTX visual rendering and firm brand template application are handled by the dedicated PPTX rendering skill — pass final content there rather than building slide formatting manually. Adjusted EBITDA extraction, normalisation adjustments, and QoE-level Base Earnings population are handled by the buy-side QoE skill — call it when QoE materials are in hand rather than deriving adjustments from CIM figures. AI disruption and defensive-positioning scoring uses a separate six-dimension 1–5 framework with a 2×2 output and is handled by the AI Disruption Scorer playbook.

---

## Project Overview

**Use when**: A project is opened and a deal-team-facing overview must be auto-generated from uploaded project materials | **Deliverable**: HTML dashboard (transaction headline + key financials/metrics + risks & highlights, with per-figure source citations)

### Ask First
1. Has the full deal materials package (CIM, model, legal documents, etc.) been uploaded to this project? Coverage quality is capped by what is in the data room.
2. Should the default template be customized for this deal type (e.g., credit, growth equity, M&A)? If yes, confirm which sections and metrics to emphasize before generating.

### Workflow
1. **Ingest all project-uploaded materials** — read every document in the project's data room to build a ground-truth understanding of the transaction (do not query external networks or public sources).
2. **Identify the transaction headline** — extract deal type, parties, size, and structure from the source documents.
3. **Extract key financials and metrics** — pull the figures most relevant to the deal type; tag each figure with its source document and page reference at time of extraction (source attribution must be embedded at extraction, not retrofitted).
4. **Surface risks and highlights** — actively identify items the deal team needs to be alerted to: customer/revenue concentration, anomalous trends, open items, covenant thresholds, integration risk, or ARR/retention irregularities, depending on deal type. Do not merely list financials; flag what requires attention.
5. **Assemble the HTML dashboard** — structure output as three skimmable panels: (a) Transaction Summary, (b) Key Financials / Metrics, (c) Risks & Highlights. Apply the built-in dashboard design specification for layout and styling; do not override it.
6. **Verify every figure has a live source citation** — before delivery, confirm each number in the dashboard links back to the originating document so reviewers can trace and verify.

#### Deal-Type Customization: Recommended Section Emphasis

| Deal Type | Emphasize |
|---|---|
| Credit / Leveraged Finance | Leverage multiples, interest coverage, covenant package, debt schedule |
| Growth Equity | ARR, net revenue retention, growth rate, burn / runway |
| M&A | Synergy estimates, integration risks, purchase price vs. precedent, open diligence items |
| Default (fallback) | Revenue, EBITDA, net debt, key operational KPIs, material risk factors |

### Defaults (apply silently, disclose at delivery)
| Parameter | Default | Rationale |
|---|---|---|
| Data source | Project-uploaded files only (no external web or market data) | Ensures the dashboard reflects the actual data room; prevents unverifiable external data from entering deal-team views |
| Source citation | Every figure cited to originating document | Traceability is the feature that distinguishes this from a generic summary |
| Output format | HTML dashboard | Interactive, skimmable; layout governed by built-in design specification |
| Dashboard density | Skimmable pre-meeting alignment, not exhaustive report | Deal teams need fast orientation, not document duplication |
| Template | Default fallback skeleton; customizable per project | Project-level edits override the global default without affecting other projects |

### Rules & Pitfalls

**Never:**
- Never source any figure from external networks, public databases, or AI-generated estimates — the dashboard must exclusively reflect what is in the uploaded project materials, because deal teams use it to verify against the actual data room, and any external figure that cannot be traced back will immediately undermine credibility.
- Never omit source citations on any figure — a dashboard number without a traceable document reference is indistinguishable from a fabrication; traceability is the core feature.
- Never treat the default template as final for a specialized deal type — the default is a fallback skeleton, and deploying it unchanged on a credit or growth deal will surface irrelevant metrics and miss deal-critical ones.

**Conditional:**
- If uploaded materials are incomplete or thin, flag the coverage gap explicitly in the dashboard before delivery — the overview is only as good as what has been uploaded, and a silent gap is more dangerous than a disclosed one.
- If deal type is identified as credit/leveraged finance, add a dedicated Leverage & Covenants panel and promote those metrics above general financials.
- If deal type is identified as growth equity, replace or supplement EBITDA-centric metrics with ARR, net revenue retention, and runway.
- If deal type is identified as M&A, include a Synergies & Integration Risks panel and flag any open diligence items prominently.

**Judgment:**
- Calibrate dashboard density to "team alignment before a meeting" — surface only what a deal professional needs to orient quickly; omit detail that belongs in the full model or memo rather than the overview.
- Actively surface risks and anomalies rather than waiting for them to be noticed — the overview's value to the deal team lies precisely in proactive flagging of concentration risk, unusual trends, and unresolved items that could affect deal execution.
- Prefer project-level template customization over post-generation editing — configuring the right sections and metrics upfront (via the project's Edit Generation settings) produces consistently on-format overviews and reduces manual cleanup.

### Pre-Delivery Checks
- Confirm every figure displayed has a citation linking it to the source document and page.
- Confirm no figure originates from outside the project's uploaded materials.
- Confirm the Risks & Highlights panel contains at least one actively surfaced risk or anomaly, not only positive metrics.
- Confirm the three core panels are present: Transaction Summary, Key Financials / Metrics, Risks & Highlights.
- If the project is a specialized deal type (credit, growth equity, M&A), confirm deal-type-specific metrics are present and prominently placed per the customization table above.
- Confirm layout and styling comply with the built-in dashboard design specification (no ad-hoc formatting overrides).
- If any section of the dashboard is limited by incomplete uploads, confirm a coverage-gap disclosure is visible to the reader.

### Scope Boundaries
Dashboard (standalone request) handles user-initiated dashboards that may draw on broader data sources beyond the project data room. PIB / IC memo playbooks handle formal narrative deliverables in PDF/Word format requiring synthesis and written analysis. This playbook governs only the automatic project-level overview generated from project-uploaded materials.
