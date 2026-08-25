# Company Analysis & Screening

Playbooks for understanding and finding companies: earnings analysis, public info compilation, red-flag screening, company profiles, target screening, and thematic risk scoring.

## Contents

| Task | Use when |
|---|---|
| [Earnings Update](#earnings-update) | A listed company has reported earnings and requires a structured update covering actuals vs. consensus/guidance, price reaction, call highlights, and revised outlook |
| [Public Information Book (PIB)](#public-information-book-pib) | A compiled reference of all public materials on a target company is needed for deal preparation, coverage initiation, or diligence |
| [Adverse Media Screen](#adverse-media-screen) | A PE/VC/credit diligence engagement requires an adverse-media and reputational risk screen of a target company and its key principals |
| [Private Company Screening](#private-company-screening) | Building a sourced, data-attributed target list of private companies for M&A origination, sector coverage, or mandate preparation |
| [AI Disruption Assessment](#ai-disruption-assessment) | Structuring an investment judgment on whether AI will disrupt a target company into a scoreable, IC-ready framework |

---

## Earnings Update

**Use when**: A listed company has reported earnings and requires a structured update covering actuals vs. consensus/guidance, price reaction, call highlights, and revised outlook | **Deliverable**: Email, Word memo, or PowerPoint deck (3–4 slides) per user-specified format

### Ask First
1. What is the output format — email, Word memo, or PowerPoint deck? (If the user supplies a template, that template governs all layout choices.)
2. Which company and which reporting period? (Confirm fiscal year type — calendar vs. non-standard — before labeling any quarter.)
3. Is this a quarterly update, a full-year (Q4) update, or both?
4. Are there any recent M&A transactions that require organic vs. acquisition-driven separation?

### Workflow

1. **Source and validate inputs** — Collect the latest earnings release, press release, earnings call transcript, investor presentation, and supplemental filings. Confirm all documents are dated within the past three months. Identify the fiscal year convention (calendar year, or non-standard end-month such as Nike/May or Apple/late-September) before assigning any quarter label. Use broker research and news *only* for consensus estimates and sentiment/context; cross-verify every figure cited in those sources back to official filings before use.

2. **Build financial and operating analysis** — Extract actuals for all P&L, balance sheet, cash flow, and segment KPIs. Perform apples-to-apples comparisons (strip one-time items, align GAAP vs. adjusted definitions to the *company's own disclosure*; cross-broker non-GAAP definitions must be reconciled to that same company-reported definition). Isolate organic growth from M&A contribution where a recent acquisition exists.

3. **Define consensus estimates** — Compute the arithmetic mean of the most recent pre-announcement broker estimates. Remove statistical outliers and note how many estimates were excluded and why. Flag any metric with fewer than five covering brokers. Record source, estimate count, and broker list in a table footnote.

4. **Determine beat/miss for each metric** — Classify direction by the *nature* of the metric: for revenue, gross profit, and other "higher-is-better" metrics, actual > consensus = beat; for costs, expenses, and cash outflows ("lower-is-better" metrics), actual < consensus = beat. Apply green shading for beat, red for miss throughout.

5. **Perform price reaction analysis** — Use the *same-day* return for pre-market or intraday releases; use the *next-day* return for after-market releases. Benchmark against a geographically and sector-appropriate index (e.g., do not benchmark a UK-listed stock against the S&P 500). Where the price move is counterintuitive (e.g., beat yet stock fell), apply whisper-number and management-tone analysis to explain the divergence.

6. **Analyze the earnings call** — Identify management tone (confident / cautious / defensive) as a standalone qualitative signal; note that tone often carries more explanatory power than the numbers themselves. Extract key Q&A exchanges. Summarize prepared remarks separately from Q&A; tag whether each theme is quarterly or full-year in scope.

7. **Draft strategic insights** — Present historical context before forward-looking commentary. Limit each section to 3–5 bullets. Every number in a bullet must carry at least one comparator (vs. prior year, vs. consensus, or vs. prior guidance). Note whether the company is continuing or breaking a multi-quarter beat/miss streak. Where a direct competitor has recently reported, include a head-to-head comparison on top KPIs.

8. **Build the financial table(s)** — Follow the mandatory column order and footnote conventions described in the [Financial Table Structure](#financial-table-structure) subsection below.

9. **Assemble deliverable** — Package per the format confirmed in Ask First (deck, email, or PIB handoff). Apply the layout specifications in the [Deliverable Layouts](#deliverable-layouts) subsection below.

10. **Run pre-delivery checks** — Complete every item in Pre-Delivery Checks before releasing.

---

#### Financial Table Structure

**Quarterly table — mandatory column order (left to right):**

| Column | Content |
|---|---|
| 1 | Actual — labeled `Q# 'YY` |
| 2 | Consensus estimate |
| 3 | Beat/Miss — integer-metric variances in %; percentage-point metrics in bps; green = beat, red = miss |
| 4 | Prior-year same period |
| 5 | YoY change |
| 6 | Prior guidance (include whenever the company has previously issued guidance for that KPI and period) |

- KPIs follow P&L line order; underlying/segment KPIs appear *above* their corresponding P&L line.
- Table footnote must state: consensus source, number of estimates included, broker names or identifiers used.
- Annotate each row that has a corresponding commentary bullet with a circled number (e.g., ②); the same circled number appears in the bullet — the two must stay in sync.

**Annual / full-year table (Q4 update):**
- Remove the consensus estimate and Beat/Miss columns.
- Retain the vs. Prior Guidance column.
- Provide both a quarterly table *and* a full-year table when reporting a fiscal year-end quarter.

---

#### Deliverable Layouts

**Deck (3–4 slides):**

| Slide | Content |
|---|---|
| 1 | Quarterly overview — financial table + price reaction; *must function as a standalone executive summary for the entire deck* |
| 2 | Annual overview (include for Q4 / full-year reports) |
| 3 | Outlook & guidance — guidance table with prior-guidance comparison column, revised-guidance color coding (green / red / neutral), qualitative characterization |
| 4 | Key themes & Q&A summary |

- Apply the company's own brand color palette.

**Email:**
- Opening: 2–3 sentences covering beat/miss verdict, price reaction and its explanation, and the analyst's view.
- Body: detailed bullet points by topic.
- Attachment or inline: financial table.
- Closing section: guidance update and analyst focus points.

**PIB handoff:** If a full Public Information Book is required, invoke the PIB Builder playbook (standard 3–5 broker reports) as a separate deliverable.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Reporting period | Most recent completed quarter | Avoids ambiguity when no period is specified |
| Consensus definition | Arithmetic mean of the most recent pre-announcement broker estimates, outliers removed | Represents the market's effective expectation at announcement |
| Outlier removal | Remove estimates with extreme deviations; note count and rationale in footnote | Prevents distortion of the consensus anchor |
| Low-coverage flag threshold | < 5 covering brokers | Below this count, consensus reliability is materially reduced |
| One-time items vs. guidance/consensus comparison | Strip true one-time items by default when comparing to guidance or consensus | Guidance is typically given on an adjusted basis; mixing distorts beat/miss assessment |
| Beat/Miss display | Integer metrics: percentage variance; percentage-point metrics: bps variance | Consistent unit presentation avoids reader confusion |
| Guidance characterization threshold | Midpoint vs. consensus median ±10% = more aggressive / more conservative | Provides a standardized definition of "positive" or "negative" guidance |
| Guidance range display | Full range shown; when only one bound changes, state explicitly which bound moved and by how much | Collapsing a range to its midpoint loses information about management's asymmetric confidence |
| Price reaction window | Same-day for pre-market/intraday releases; next-day for after-market releases | Aligns the measured reaction to when the market actually processes the news |
| Price reaction benchmark | Geographically and sector-matched index | Isolates the company-specific signal from broader market moves |
| Deck color scheme | Company's brand palette | Maintains professionalism and client-readiness |

---

### Rules & Pitfalls

**Never:**
- **Never use news articles or broker reports as the source for financial figures** — news-reported numbers are unverified and frequently imprecise; any figure from a secondary source must be traced back to and confirmed in the official filing or transcript before use, or it will introduce errors that undermine the credibility of the entire update.
- **Never apply annual commentary to a standalone quarterly result, or quarterly commentary to a full-year result** — management at Q4 calls routinely discusses full-year themes; mislabeling the scope of a comment is a factual error, not a style issue.
- **Never mix GAAP and non-GAAP figures within the same comparison or row** — always label each metric as GAAP or adjusted; never compare a GAAP actual to a non-GAAP consensus estimate (or vice versa) unless you have explicitly reconciled the two on a like-for-like basis.
- **Never collapse a guidance range to its midpoint** — doing so discards information about which end of the range management is more confident about and strips the reader of the ability to assess scenario outcomes.
- **Never apply a beat/miss direction without first determining whether the metric is "higher-is-better" or "lower-is-better"** — classifying a cost line as a miss because it came in below consensus is among the most common and most damaging errors in an earnings update.
- **Never produce an earnings update for a private company** — privately held companies do not have audited public filings or tradeable share prices; flag immediately and do not proceed.

**Conditional:**
- If the company completed a material acquisition recently, disaggregate reported growth into organic and acquisition-driven components before presenting any revenue or volume KPI; do not present blended growth without disclosure.
- If the company has a non-calendar fiscal year (e.g., fiscal year ending in May, September, or another non-December month), resolve the fiscal quarter label *before* building any table or writing any commentary — mislabeled quarter tags propagate errors throughout the entire document.
- If a competitor in the same sector has reported in the same earnings season, include a relative comparison on the most important headline KPIs at the top of the analysis.
- If the company has previously issued guidance for a specific KPI and period, always include a "Prior Guidance" column for that KPI — omitting it when it exists conceals a meaningful reference point.
- If non-GAAP definitions differ across brokers contributing to the consensus, reconcile all broker estimates to the company's own disclosed non-GAAP definition before computing the consensus mean.
- If actual results deviate from consensus or guidance by more than ±10% on any metric, flag the variance explicitly, confirm whether it is attributable to a one-time item, and verify that the non-GAAP/GAAP scope is correctly aligned before finalizing the beat/miss assessment.
- If the stock price reaction is counterintuitive relative to the reported beat/miss (e.g., beat on revenue and earnings yet the stock declines), apply whisper-number analysis (buy-side expectations that diverged from published consensus) and management-tone assessment to provide a substantive explanation; do not leave an anomalous price move unexplained.

**Judgment:**
- Treat management tone (confident / cautious / defensive) as an independent qualitative data point that frequently explains more of the share price move than the quantitative results alone — give it a dedicated section or clearly labeled bullet rather than burying it in the call summary.
- When consensus coverage is thin (5–8 brokers) but above the flag threshold, note the limited sample in the footnote even without a formal flag; readers should be aware of reduced statistical reliability.
- When characterizing a guidance revision as positive or negative, specify *which* KPI was revised, *which* end of the range moved, and *by how much* — qualitative labels alone ("positive revision") are insufficient for an institutional audience.
- When a company has beaten consensus for multiple consecutive quarters, note the streak and assess whether the current result continues or breaks the pattern; this context shapes how the market is likely to interpret the update.
- Prefer the company's own disclosed adjusted metric over a broker-constructed adjusted metric when both are available; the company's definition is the one management uses internally and the one investors ultimately hold them accountable to.

---

### Pre-Delivery Checks
- Confirm every financial figure traces directly to an official filing, earnings release, or call transcript — not to a news article or broker note used as a primary source.
- Verify that every number in the commentary bullets carries at least one comparator (vs. prior year, vs. consensus, or vs. prior guidance); standalone numbers with no context must be revised before delivery.
- Confirm beat/miss direction is determined by metric nature ("higher-is-better" vs. "lower-is-better") — spot-check at least one cost or cash-outflow line explicitly.
- Verify beat/miss color coding: green = beat, red = miss; confirm cost/expense lines are coded on the inverse logic.
- Confirm GAAP and non-GAAP figures are not mixed in any single comparison row; every metric is labeled with its accounting basis.
- Confirm that non-GAAP broker estimates used in consensus are reconciled to the company's own non-GAAP definition.
- Confirm true one-time items have been stripped from actuals when comparing to guidance or adjusted consensus.
- Verify the fiscal year type is correctly identified and all quarter labels are accurate.
- Confirm quarterly commentary and annual commentary are scoped separately; for a Q4/year-end update, verify both a quarterly table and a full-year table are present.
- Verify any actuals vs. consensus/guidance variance exceeding ±10% has been flagged and the cause (one-time item, non-GAAP mismatch, or genuine operating surprise) is documented.
- Confirm consensus footnote is present on the quarterly table, including: source, number of estimates, broker identifiers, and any outliers removed.
- Flag and note in the document if consensus coverage is fewer than 5 brokers.
- Confirm the guidance table includes a "Prior Guidance" column for every KPI for which prior guidance has been issued.
- Confirm guidance ranges are displayed in full; verify no range has been collapsed to a midpoint.
- Where only one bound of a guidance range changed, confirm the document specifies which bound moved and by how much.
- Confirm guidance characterization (aggressive / in-line / conservative) is based on midpoint vs. consensus median with the ±10% threshold applied.
- Verify price reaction uses the correct window: same-day for pre-market/intraday releases, next-day for after-market releases.
- Confirm the price reaction benchmark is geographically and sector-matched to the subject company.
- Where a counterintuitive price move exists, confirm a whisper-number and/or management-tone explanation is present.
- If a recent acquisition exists, confirm organic and acquisition-driven growth are disaggregated in all relevant KPIs.
- Verify circled-number cross-references are consistent: every circled number in a commentary bullet has a matching circled number on the corresponding table row, and no orphaned references exist in either direction.
- Confirm all units are consistent within each table (currency, millions/billions, %, bps).
- Confirm the deck's first slide can serve as a standalone executive summary.
- Confirm the company's brand color palette is applied to the deck.
- If the subject company is private, stop and flag — do not deliver.

---

### Scope Boundaries
The PIB Builder playbook handles compilation and formatting of public information books from multiple broker reports and is invoked as a separate deliverable when a full PIB is required alongside this update. The Broker Research Digest playbook handles aggregation and summarization of broker viewpoints and is the correct tool when the primary output is an analysis of analyst opinions rather than company-reported results. This playbook covers only listed companies reporting earnings from official disclosed documents.

---

## Public Information Book (PIB)

**Use when**: A compiled reference of all public materials on a target company is needed for deal preparation, coverage initiation, or diligence | **Deliverable**: Single merged PDF with cover page, clickable table of contents, section divider pages, and up to 5 content sections

---

### Ask First
1. **Time window** — How many days back should the news, press releases, and non-core research reach? *(Default: 90 days)*
2. **Section selection & order** — Which of the 5 standard sections are needed, and in what order? *(Default: I Earnings Releases → II Investor Presentations → III Transcripts → IV News Run → V Sell-Side Research)*
3. **Rating agency reports** — Do you have Moody's/S&P/Fitch reports to upload? *(Behind paywalls; cannot be retrieved independently)*
4. **SEC filings** — Include 10-K / 10-Q? *(If the company had an IPO within the last 2 years, also ask: include S-1?)*

---

### Workflow

1. **Confirm scope** — Resolve all four Ask First items before retrieving any content. Lock section list, section order, and time window. *(Do this first to avoid re-pulling content under different parameters.)*

2. **Pull Section I — Earnings Releases** — Retrieve the single most recent full earnings release document in its entirety. This item is time-window-exempt; always include regardless of the window set in step 1.

3. **Pull Section II — Investor Presentations** — Retrieve the single most recent full investor / earnings presentation deck in its entirety. Time-window-exempt; always include.

4. **Pull Section III — Transcripts** — Retrieve the 2 most recent transcripts (earnings calls, investor days, or conferences). These 2 are time-window-exempt; always include. Add further transcripts only if they fall within the confirmed time window.

5. **Pull Section IV — News Run** — Retrieve full-text news articles and press releases within the confirmed time window. Apply the news filtering rules (see Rules & Pitfalls) to arrive at ≤10 articles. Sort newest-to-oldest within the section.

6. **Pull Section V — Sell-Side Research** — Retrieve the 3 most recent top-tier sell-side notes plus the 2 most recent initiation-of-coverage reports. Initiation reports are time-window-exempt; always include. Non-initiation research must fall within the confirmed time window. Strip all trailing disclaimer / disclosure / analyst certification pages before inclusion. *(If no research access: see Conditional rules below.)*

7. **Pull optional Section VI — Rating Agency Reports** — Include only if the user has uploaded the files; retrieve nothing independently.

8. **Pull optional Section VII — SEC Filings** — If elected, include 10-K, 10-Q, and S-1 (IPO within 2 years only). Place this section after sell-side research and rating agency reports.

9. **Apply 12-month extended window for major transaction materials** — For any presentation, transcript, or press release directly related to M&A, capital markets transactions (debt issuance, equity follow-on, IPO), or a significant refinancing: extend the retrieval window to 12 months regardless of the window confirmed in step 1. Flag to the user any relevant items older than 12 months but do not include them.

10. **Clean all PDFs before assembly** — For each retrieved document, render a test conversion. If the output contains embedded ads, full-page images, or broken layout, fall back: extract headline, date, source, and full body text into a clean Word document, convert to PDF, and retain the source URL at the top. *(Direct conversion of web content frequently produces unacceptable artifacts.)*

11. **Assemble merged PDF in confirmed section order**:
    - **Cover page**: company name, company logo (high-quality; transparent background preferred), date of compilation
    - **Table of contents**: one entry per section, each entry hyperlinked to its corresponding section divider page
    - **Section divider page** (portrait): section number and title
    - **Section content**: documents sorted newest-to-oldest within each section
    - Repeat divider → content block for each included section

12. **Run Pre-Delivery Checks** (see checklist below) before releasing the PDF.

#### Summary Table Structure — Fallback for Sell-Side Research

If no sell-side research is accessible and the user cannot supply documents, replace Section V with a single-page summary table:

| Field | Source |
|---|---|
| Latest closing price | Market data |
| Market capitalisation | Market data |
| Enterprise value | Market data / latest filing |
| 52-week high / low | Market data |
| LTM revenue multiple | Calculated |
| NTM revenue multiple | Consensus estimates |

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Time window | 90 days | Captures one earnings cycle plus intervening news without burying readers in stale material |
| Number of sections | 5 (I–V as listed in Workflow) | Covers the standard IR source hierarchy used by buyside and advisory teams |
| Section content sort order | Newest-to-oldest within each section | Ensures readers encounter the most current view first |
| Earnings release included | Most recent full release, time-window-exempt | Core IR document; must always be present |
| Investor presentation included | Most recent full deck, time-window-exempt | Core IR document; must always be present |
| Transcripts included | 2 most recent, time-window-exempt | Minimum needed for Q&A colour; not capped by window |
| Initiation-of-coverage research | Always included regardless of time window | Initiation notes contain the most complete fundamental thesis and are not stale in the same way periodic updates are |
| Sell-side research pull | 3 most recent top-tier notes + 2 most recent initiations | Balances recency with analytical depth |
| Major transaction extended window | 12 months | M&A and capital markets materials remain relevant well beyond a 90-day window |
| News article cap | ≤10 articles total | Prevents the news section from dominating the book |
| Same-topic article cap | ≤2 articles per topic | Eliminates redundancy; keep the 2 most authoritative/complete |
| Same-day article cap | ≤2 articles per calendar day | Prevents event-day pile-up |
| Page numbers | None | PIB is a compiled reference, not a paginated report; internal navigation is handled by clickable TOC links |
| Page orientation — cover / TOC / dividers | Portrait | — |
| Presentation orientation | Native (do not rotate) | Reader-friendly; sideways presentations are a common and cited quality failure |
| Logo quality | High-resolution; transparent background preferred | Substandard logos on the cover are a visible credibility signal |
| Disclaimer / disclosure pages in research | Stripped | Reduces bulk; pages add no analytical content |

---

### Rules & Pitfalls

**Never:**
- **Never include summary or paraphrased versions of source documents** — the PIB is a compilation of original, complete source documents (full earnings releases, full presentation decks, full transcripts, full news articles). A book that reads like a company profile or executive summary is wrong by definition and defeats the buyside's purpose of accessing primary sources.
- **Never include only article headlines for news items** — each article must contain its complete body text, because a headline provides no verifiable information and will be flagged immediately by any senior reviewer.
- **Never add page numbers** — the PDF uses internal hyperlinks for navigation; page numbers create a false pagination that breaks when documents are later updated or reordered.
- **Never include a sell-side research note that strips the investment thesis while retaining the disclosure pages** — strip disclosures, retain content; doing the reverse is both useless and legally sloppy.
- **Never rotate a landscape presentation to portrait** — preserve native orientation; a sideways-rotated presentation is unusable and signals poor production quality.
- **Never fabricate content** — if a document cannot be retrieved, flag the gap explicitly and fall back to the approved substitute (e.g., summary table for missing research). No placeholders, no synthesised text presented as source material.

**Conditional:**
- **If a PDF conversion produces embedded ads, full-page images, or broken layout**: fall back to extracting title, date, source name, and full body text into a clean Word document, convert that to PDF, and preserve the original source URL at the top of the page.
- **If the user has no access to sell-side research and cannot upload documents**: replace Section V with the fallback summary table (latest close, market cap, EV, 52-week high/low, LTM and NTM revenue multiples).
- **If rating agency reports (Moody's, S&P, Fitch) are required**: request that the user upload the files directly — these sit behind paywalls and cannot be retrieved independently under any circumstance.
- **If a presentation, transcript, or press release is related to M&A, a capital markets transaction, or a significant refinancing**: apply a 12-month retrieval window to that item regardless of the time window confirmed with the user; flag any relevant items older than 12 months to the user but do not include them.
- **If the company IPO'd within the last 2 years**: ask whether to include the S-1 before building; do not assume inclusion or exclusion.
- **If the user requests fewer than 5 sections**: include only the elected sections; never pad the book with unrequested content.
- **If more than 2 articles cover the same topic**: retain only the 2 most authoritative or information-complete articles and discard the rest — do not include all of them on the grounds that they fall within the time window.

**Judgment:**
- **Prioritise relevance over volume in the news run** — focus on M&A activity, capital markets transactions, management / board changes, new product launches, partnerships and joint ventures, and litigation. Exclude industry overview articles that merely mention the company in passing, because they add noise and dilute the signal for a reader looking for company-specific developments.
- **Select "most authoritative / most information-complete" when deduplicating same-topic articles** — a wire service original typically outranks a secondary aggregator republication; a longer article with named sources outranks a brief item.
- **When the company logo is unavailable in high resolution**: source the highest-quality available version and flag the limitation at delivery rather than omitting the logo — a missing logo is a listed quality failure and must be disclosed.

---

### Pre-Delivery Checks

- Verify cover page logo is present, high-quality, and correctly identifies the target company
- Verify every section listed in the table of contents has a corresponding section divider page in the body of the PDF
- Verify every section divider page in the body of the PDF appears in the table of contents (no orphaned sections)
- Verify every table of contents hyperlink resolves correctly to its corresponding section divider page (internal links only; no external URLs in the TOC)
- Verify each section divider is immediately followed by the correct section's content
- Verify the most recent earnings release is included in full and is the latest publicly available version
- Verify the most recent investor presentation is included in full and is the latest publicly available version
- Verify the 2 most recent transcripts are present
- Verify all time-window-constrained content (news, non-initiation research, non-latest presentations) falls within the confirmed window
- Verify no content has been fabricated, paraphrased, or substituted without explicit disclosure
- Verify all embedded PDFs render cleanly — no blank pages, corrupted pages, missing pages, or blurred text
- Verify all presentation pages display in their native orientation (no sideways / rotated pages)
- Verify no page numbers appear anywhere in the assembled PDF
- Verify all portrait-orientation requirements are met for cover, table of contents, and section divider pages
- Verify trailing disclaimer / disclosure / analyst certification pages have been removed from all sell-side research notes
- Verify total news article count is ≤10, same-topic count is ≤2, and same-day count is ≤2
- Verify the news section contains full-text articles, not headlines only

---

### Scope Boundaries

The PIB is a compilation of original source documents and performs no analysis or summarisation — analytical work on the same materials (e.g., screening for negative press, synthesising earnings results) is handled by the Negative News Screener and Earnings Update playbooks respectively. SEC filing diligence beyond simple inclusion in a PIB section (e.g., covenant analysis, footnote extraction) falls outside this playbook's scope.

---

## Adverse Media Screen

**Use when**: A PE/VC/credit diligence engagement requires an adverse-media and reputational risk screen of a target company and its key principals | **Deliverable**: Stacked-event-block screening report delivered as both an in-chat summary and a .docx file

---

### Ask First
1. What is the target entity — company name, ticker, URL, or uploaded CIM/data-room documents?
2. Which five risk categories are in scope, or should all five defaults apply?
3. Are there specific key principals (executives, founders, board members) the client has already identified, or should entity identification proceed from defaults below?
4. Is there a known lookback threshold for recency classification, or should the standard four-tier default apply?

---

### Workflow
*(Analysis order is bottom-up; presentation order is top-down — build in steps 1–5 before assembling the final report)*

1. **Identify entities** — Extract the target company plus the top 5–7 executives, founders, owners, key managers, and current board members. If input is a CIM or data-room document, seed entity identification from those materials; if input is a name, ticker, or URL, identify principals via outside-in research. Flag departed high-profile C-suite figures even if absent from the CIM. Optionally include Sponsor investment professionals, General Counsel, CRO, and CHRO.

2. **Run exhaustive per-entity, per-category searches** — For each identified entity, execute searches across all five risk categories. Record every query verbatim, in quotation marks, numbered sequentially, in the Search Log as you go *(logging in real time prevents reconstruction error and ensures auditability)*.

3. **Build the incident list with verbatim evidence** — For each flagged item, confirm the source text explicitly names the target entity or principal. Assign three attributes per incident:
   - **Category**: one of the five standard categories
   - **Recency**: Real-Time / Very Recent / Recent / Not Recent *(assess against the most recent substantive event, not the original filing date; if an old event has a recent settlement or outcome, anchor Recency to that outcome)*
   - **Severity**: Minor / Moderate / Major *(scale relative to company size — a $1M fine is Moderate for a $2M-EBITDA company; calibrate through an investor/banker reputational lens — insider trading and child-labor claims are inherently Major; routine employee disputes at large companies may be Minor)*

4. **Aggregate to per-category risk ratings** — Synthesize incident-level Severity and Recency into a category-level rating of Low / Moderate / High. These are two distinct scales; do not conflate them. Categories with no incidents receive Low + "no incidents identified" — do not silently omit them. Select the 3–5 most critical incidents across all categories for the Executive Summary.

5. **Assemble the report in presentation order** (Section 1 → Section 2 → Section 3 → Search Log — see Report Structure below).

#### Report Structure

**Section 1 — Summary**
- Header: *Report as of MM/DD/YYYY* (report generation date, not event date)
- Two-column table: five risk categories × Low / Moderate / High rating
- 3–5 most critical incidents listed by recency (one line each: category, approximate date, one-sentence description)

**Section 2 — Identified Negative News**
- One **stacked event block** per incident, sorted first by Severity (Major → Moderate → Minor), then by Recency (most recent first)
- Each block contains:
  - **Bold numbered headline** (include status tag: *alleged / charged / settled / convicted*)
  - One-line classification bar: `Date | Category | Severity [color-coded] | Recency`
  - Full-width descriptive paragraph — must contain verbatim quotation from the source that explicitly names the target
  - Source line with a live, clickable hyperlink (blue underline in Word; confirmed live in PDF); if no stable URL exists (data-room docs, paywalled dockets), write the document name and path (e.g., *Data room → Folder 4.2 → litigation_summary.pdf*)
- **Do not use a wide table with a narrow description column** — this forces all narrative into a single cramped column beside four blank-looking columns.
- Incidents older than five years but materially significant: move to a clearly labeled appendix covering approximately the five-to-fifteen-year window. Apply judgment (a $50K employee settlement from ten years ago is not notable; a systemic abuse pattern that seeded ongoing litigation is).

**Section 3 — Methodology**
- Two-column entity table: Name | Role/Description
- Entity-selection rationale (explain how principals were identified under each input mode)
- Methodology narrative: how sources were collected, how events were categorized, how Recency and Severity were assessed, source hierarchy applied

**Search Log**
- Numbered, quoted, exhaustive list of every query run, organized by entity then by category

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Dual delivery format | In-chat summary + .docx | Reviewers need an archivable document alongside the interactive response |
| Number of principals screened | Top 5–7 executives / founders / owners / key managers / current directors | Captures control persons most likely to carry personal reputational risk |
| Departed C-suite inclusion | Yes — flag high-profile former C-suite even if not in CIM | Outside-in research surfaces history the deal document intentionally omits |
| Risk categories | Five standard categories (Financial Crime / Legal & Regulatory / Governance / ESG / Operational) | Covers the full PE/VC/credit diligence risk universe |
| Recency tiers | Real-Time / Very Recent / Recent / Not Recent | Anchored to most recent substantive event or resolution, not original event date |
| Severity tiers | Minor / Moderate / Major — scaled to company size | Materiality is relative; $1M fine means different things at different EBITDA levels |
| Category risk rating | Low / Moderate / High — separate scale from incident Severity | Two-scale system prevents rating inflation from minor-but-numerous incidents |
| Empty categories | Explicitly listed as "no incidents identified" + Low rating | Omitting them creates ambiguity about whether the category was searched |
| Source hierarchy | Primary: regulatory filings, court records, SEC/regulator databases, newswires. Secondary (flag as lower reliability): real-time non-traditional sources (X/Reddit/Glassdoor/G2) | First-party and institutional sources are auditable; social/review platforms are not |
| Historical appendix window | ~5–15 years for materially significant incidents | Keeps the main body current while preserving legally or reputationally relevant history |
| All sources hyperlinked | Yes — live links in Word (blue underline), confirmed live in PDF | Every finding must be traceable to a clickable source for client verification |

---

### Rules & Pitfalls

**Never:**
- **Never flag an incident unless the source text explicitly names the target entity or principal** — inferring involvement from industry context or corporate family proximity without a direct naming citation generates false positives, exposes the bank to credibility risk, and can damage an innocent target's deal process.
- **Never use a wide table with a narrow description column for event display** — it forces all narrative into a single cramped cell and renders the report unreadable; always use the stacked event block format.
- **Never conflate per-incident Severity (Minor/Moderate/Major) with per-category Risk (Low/Moderate/High)** — they are independent scales; blending them produces misleading category ratings.
- **Never silently omit a searched category with no findings** — omission signals the category was skipped; always write "no incidents identified" with a Low rating.
- **Never assess Recency from the original event date alone when a more recent resolution exists** — a 2015 lawsuit settled in 2023 is Recent, not Not Recent; burying the settlement date understates current relevance.

**Conditional:**
- If the input is a CIM or data-room upload, seed the entity list from those documents, then supplement with outside-in research to catch departed C-suite and principals the CIM omits.
- If the input is only a name, ticker, or URL, identify all principals entirely via outside-in research before beginning category searches.
- If a flagged source is a real-time non-traditional platform (X, Reddit, Glassdoor, G2), include it but explicitly label it as lower-reliability — it surfaces signals but cannot serve as stand-alone evidence.
- If a source lacks a stable public URL (data-room document, paywalled court docket), replace the hyperlink with a precise document path (e.g., *Data room → Folder 4.2 → litigation_summary.pdf*) so the reviewer can locate it manually.
- If an incident is more than five years old, assess materiality: if it is minor and resolved, omit; if it is significant or has ongoing consequences, move to the historical appendix rather than the main incident list.
- If a target is a large company with many employees, calibrate whether employee disputes fall within a statistically normal range before assigning Moderate or higher Severity — context prevents over-flagging routine HR matters.

**Judgment:**
- **Prefer precision over volume** — one well-evidenced, verbatim-supported incident is more valuable to a diligence reader than five weakly sourced flags; accuracy is the metric that matters in a legal document.
- **Apply an investor/banker reputational lens when rating Severity** — ask: "Would an investor or a banker representing a client be comfortable associated with this?" Insider trading allegations and child-labor findings are inherently Major regardless of resolution status; a single minor employment dispute at a 10,000-person firm is likely immaterial.
- **Distinguish allegation status explicitly in every headline** — tagging *alleged / charged / settled / convicted* and the resolution status is not a legal formality; it directly drives Severity and the Summary framing, and sophisticated readers will downgrade a report that conflates open allegations with convictions.
- **Scale materiality to company size** — a $1M regulatory fine at a $2M-EBITDA company is Moderate to High; the same fine at a $500M-EBITDA company may be Minor; always state the scaling rationale briefly in the event block.
- **Log every query as you run it** — reconstructing the search log after the fact introduces gaps and undermines the auditability that gives the report its legal and reputational defensibility.

---

### Pre-Delivery Checks
- Confirm every flagged incident contains a verbatim quotation from the source that explicitly names the target entity or principal — remove any item that relies on inference or corporate adjacency alone.
- Confirm per-incident Severity labels (Minor/Moderate/Major) and per-category Risk ratings (Low/Moderate/High) are on separate scales and have not been conflated.
- Confirm all five risk categories appear in the Summary table, including those rated Low with "no incidents identified."
- Confirm every source line carries a live, clickable hyperlink in both the in-chat and .docx outputs; for non-URL sources, confirm a precise document path is written out.
- Confirm all incidents are sorted within Section 2 by Severity (Major first) then Recency (most recent first), not chronologically or alphabetically.
- Confirm Recency for each incident is anchored to the most recent substantive event or resolution, not the original filing or publication date.
- Confirm the report header reads *Report as of MM/DD/YYYY* using today's generation date, not an event date.
- Confirm the Search Log is numbered, quoted, and exhaustive — every entity × every category must be represented by at least one logged query.
- Confirm incident headlines include the appropriate status tag (*alleged / charged / settled / convicted*).
- Confirm incidents older than five years have been assessed for materiality: minor resolved matters omitted, significant matters moved to the historical appendix.
- Confirm Severity for each incident has been scaled relative to the target's size and calibrated through the investor/banker reputational lens.
- Confirm all event blocks use the stacked format (bold headline → classification bar → full-width paragraph → source line) — no wide tables with narrow description columns.

---

### Scope Boundaries
The PIB Builder handles aggregation of publicly available company profile materials into a compiled PDF — it is the source of factual background, not reputational screening. The VDR Review & Gaps playbook covers data-room document inventory and completeness analysis. The Earnings Update playbook handles financial results synthesis. This playbook covers only adverse-media and reputational risk screening; financial model or valuation work is out of scope here.

---

## Private Company Screening

**Use when**: Building a sourced, data-attributed target list of private companies for M&A origination, sector coverage, or mandate preparation | **Deliverable**: Single-tab Excel workbook (Screen tab) with 14 standard columns + industry-specific columns, every cell annotated with source, vintage, and confidence rating

---

### Ask First
1. **Screen mode** — criteria-based (define parameters from scratch) or similarity-based (match against a reference company)?
2. **Business type** — state as narrowly as possible (e.g., "hospital revenue cycle management software," not "healthcare IT"; "specialty chemicals distribution," not "specialty chemicals")
3. **Geography** — target headquarters region(s); note if divisional/subsidiary coverage is required
4. **Revenue range and ownership filter** — confirm revenue band and whether to include PE-backed, founder-owned, corporate subsidiaries, or carve-outs in scope

---

### Workflow

**Step 0 — Confirm mode and parameters**
Lock screen mode (criteria / similarity), business type, geography, revenue range, ownership filter (default: private), and explicit exclusions before sourcing a single company. Narrowing business type here prevents universe bloat and rework.

**Step 1 — Build the company universe**
Cast wide; include edge cases. Calibrate inclusion threshold to universe size (see Rules & Pitfalls — Judgment: count thresholds). Multi-segment companies with a relevant division qualify; include them and annotate which division applies. Exclude companies that have been fully acquired and integrated into a buyer with no independent operation; include carve-outs that now operate independently.

**Step 2 — Populate the Screen tab**

Build all four column groups in order (overview → scale → ownership & deal history → notes) before sourcing financials, so the structural skeleton is consistent across rows and gaps surface immediately.

#### Column Structure (14 standard columns + industry-specific)

| Group | Column | Notes |
|---|---|---|
| **① Company Overview** | Company Name | — |
| | Website | — |
| | HQ | — |
| | Founded Year | Point-in-time event; no stale flag needed |
| | Description | ≤30 words; specific and differentiating; no marketing language; no ownership info (ownership has its own column) |
| | CEO | — |
| **② Scale** | Revenue | Require ≥2 independent sources; annotate each cell |
| | Employees | Require ≥2 independent sources; annotate each cell |
| | EBITDA & Margin | Annotate; mark stale if >2 years old |
| **③ Ownership & Deal History** | Ownership | Default: Private; verify per company — do not trust database defaults |
| | Most Recent Valuation | Flag as rumored/estimated if not confirmed; include round, source, and date |
| | Most Recent Financing | Must be internally consistent with Ownership column |
| **④ Flags** | Notes / Flags | Active processes, stale data, acquisition status, material issues |

**Industry-specific columns (add; remove irrelevant defaults):**
- SaaS → ARR
- Multi-unit → Unit Count / AUV
- Asset management → AUM

**Step 3 — Source and annotate every data point**

Apply the cell comment format to every financial and ownership entry:

```
Source: [Source Name], [Year] | Confidence: [H/M/L] | [URL]
```

Confidence tiers:
- **H** — company disclosure or regulatory filing
- **M** — institutional database (PitchBook, CapIQ) or corroborated by multiple sources
- **L** — single secondary source or derived estimate

Source name must match the URL domain. If a data aggregator surfaces a primary source, cite both the primary source and the discovery channel.

**Step 4 — Sort and flag**
Sort by revenue descending; use midpoint for range estimates. Place NA rows at the bottom. Apply "(stale)" tag inline where required. Flag active processes in Notes/Flags.

**Step 5 — Run pre-delivery checks** (see Pre-Delivery Checks section)

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Ownership filter | Private only | Avoids mixing public-market comps into a sourcing list; override explicitly if divisions/subsidiaries are in scope |
| Universe approach | Include all qualifying companies; no fixed count | Long lists are more useful; count-based trimming is done by the user, not the analyst |
| Sort order | Revenue descending; range estimates use midpoint; NA rows at bottom | Enables instant size-tier reading by reviewer |
| Stale threshold | Revenue, EBITDA, and employee data >2 years old tagged "(stale)" with as-of date | Prevents stale financials from driving sizing decisions silently |
| Currency | Single currency throughout; cross-border figures converted with FX rate footnoted | Unit inconsistency is a credibility failure |
| Missing data | "NA" — not estimated, not left blank | Blank cells imply data exists but was not found; NA signals genuine absence |
| Valuation treatment | Rumored/estimated valuations labeled with round, source, date, and basis; never treated as confirmed | Rumor treated as fact is the most common ownership section error |
| Derived estimate sourcing | Derived/benchmark estimates (e.g., stores × AUV) count as one source only; a direct revenue citation (PitchBook / CapIQ / press release / news) must still be found | Derived logic is not independent corroboration |
| Source concentration cap | If any single secondary source would be the sole citation for >40% of rows, find at least one additional corroborating source for each of those rows | Over-reliance on one source makes the entire screen fragile |
| Derived values in structure | Derivation logic, benchmarks, and assumptions go into the cell comment of the number they support; they never appear as standalone columns | Every column must represent a company-specific data point |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate or estimate without explicit disclosure** — private company data is scarce and tempting to fill; unverifiable data points must be "NA," and any estimate must be labeled and sourced in the cell comment. This is the single most credibility-destroying failure in a private screen.
- **Never treat a rumored or derived valuation as a confirmed value** — label every valuation with round, source, date, and basis (e.g., "Most recent round post-money, per PitchBook, Series D, Mar 2024"). Conflating rumor with fact misleads every downstream user.
- **Never trust ownership classifications from databases without verification** — PitchBook, Crunchbase, and CapIQ ownership data goes stale; each PE-backed designation requires a verifiable sponsor name and acquisition year in the cell comment, confirmed by press release, sponsor portfolio page, or news. If unverifiable, write "Ownership Unknown" or "PE-Backed (sponsor NA)" — never guess.
- **Never include a fully integrated acquired company** — once absorbed with no independent operations, it is no longer a target. Carve-outs that now operate independently are included.
- **Never let derived estimates, benchmarks, or assumptions appear as standalone columns** — they belong in cell comments only; each column must be a company-specific data point.
- **Never use crowdsourced or algorithmic sources (Reddit, Statista, Owler, ZoomInfo, listicles) as the basis for financial estimates** — these sources are acceptable for company discovery and directional context only; they do not count toward the ≥2 independent source requirement unless corroborated by a primary source.
- **Never exclude public companies from the universe silently** — they must be actively excluded (or explicitly included if the ownership filter covers divisions/subsidiaries) so the screen is mode-consistent.

**Conditional:**
- **If revenue or employee data has only one source:** find a second independent source before finalizing the row. A derived estimate (e.g., store count × per-unit benchmark) counts as one source only; a direct revenue citation must still be found.
- **If two sources report different revenue figures:** present a range, exclude the outlier with a note, and disclose the discrepancy in the cell comment.
- **If a source provides a revenue range rather than a point estimate:** use the midpoint and disclose the range and source in the cell comment.
- **If a single secondary source would be the sole citation for >40% of rows:** find at least one additional corroborating source per affected row before delivery.
- **If a company is multi-segment with only one relevant division:** include the company, note in the description and Notes/Flags which division qualifies, and source financials for that division only where possible.
- **If a process is active (for sale, LOI signed, exclusivity, confidential S-1 filed):** flag prominently in the Notes/Flags column — do not omit or bury.
- **If count falls below 5 companies:** flag the shortfall and recommend parameter relaxation before delivering.
- **If count exceeds 100 companies:** tighten criteria and disclose the narrowing rationale at delivery.
- **If sourcing European companies:** prioritize local registries (UK Companies House, Irish CRO, French Infogreffe, German Bundesanzeiger, Nordic registries) over third-party estimates — these are primary sources and supersede database estimates.
- **If ownership and most recent financing entries are inconsistent** (e.g., sponsor named in financing but not in ownership): reconcile before delivery — both fields must reflect the same sponsor.

**Judgment:**
- **Define business type as narrowly as the mandate allows** — "hospital revenue cycle management software" is a screen anchor; "healthcare IT" produces an unworkable universe. Narrow definitions catch relevant targets; broad definitions generate noise.
- **Calibrate universe inclusion loosely at Step 1** — a company the user never sees cannot be evaluated. Long lists with good flagging are preferable to short lists with silent exclusions.
- **Prefer local regulatory filings over third-party databases for financial data** — a Companies House filing is H-confidence; a PitchBook estimate of the same number is M at best.
- **Revenue vs. employee count is a built-in sanity signal** — a 50-person company claiming $500M revenue warrants a flag and re-verification before the screen is finalized.
- **Descriptions should differentiate, not describe** — "cloud-based prior authorization software for specialty pharmacy" is useful; "leading provider of healthcare solutions" is noise. Cap at 30 words; strip all marketing language and ownership information.

---

### Pre-Delivery Checks

- Confirm every row meets all stated screening criteria with no exceptions
- Confirm no duplicate companies appear in any row
- Confirm every financial estimate cell comment includes source name, vintage year, confidence tier (H/M/L), and URL; source name matches URL domain
- Confirm revenue and employee count each have ≥2 independent sources per row; flag any row where only one source exists
- Confirm every PE-backed designation has a verifiable sponsor name and acquisition year in the cell comment; rows sourced from database alone are corroborated by press release, portfolio page, or news; unverifiable ownership is labeled "Ownership Unknown" or "PE-Backed (sponsor NA)"
- Confirm all revenue, EBITDA, and employee data older than 2 years is tagged "(stale)" with an as-of date inline; confirm valuation, financing date, and founding year are NOT stale-tagged (they are point-in-time events)
- Confirm all valuations carry round label, source, date, and basis; none are presented as confirmed without primary-source support
- Confirm companies that have been fully acquired and integrated are excluded; carve-outs operating independently are included
- Confirm active processes (for sale, LOI, exclusivity, confidential S-1) are visible in Notes/Flags
- Confirm revenue vs. employee count is directionally coherent for every row; flag any outlier for re-verification
- Confirm ownership column and most recent financing column are internally consistent — same sponsor appears in both where applicable
- Confirm descriptions are ≤30 words, free of marketing language, and contain no ownership information
- Confirm industry-specific columns are present and populated where relevant; confirm irrelevant default columns are removed
- Confirm all figures are in a single currency with FX conversion footnoted for cross-border entries
- Confirm "NA" is used for all genuinely missing data — no blank cells, no fabricated proxies
- Confirm no single secondary source is the sole citation for >40% of rows; if so, additional corroboration has been added
- Confirm sort order is revenue descending, range midpoints used for sort key, NA rows at bottom
- If row count <5: flag and recommend parameter relaxation before delivery; if row count >100: confirm criteria were tightened and disclose narrowing rationale

---

### Scope Boundaries

Market Map playbook handles visual landscape mapping of the same universe. Buyer List playbook covers acquirer identification and payment capacity analysis. Public Comps playbook handles publicly traded trading multiples. This playbook produces only the private company target list with attributed data; hand off to those playbooks for adjacent outputs.

---

## AI Disruption Assessment

**Use when**: Structuring an investment judgment on whether AI will disrupt a target company into a scoreable, IC-ready framework | **Deliverable**: Markdown scorecard + .docx scorecard + 3-page .pptx IC deck

---

### Ask First
1. What is the target company's primary business model — services-led (labour leverage) or software-led (system-of-record / data moat)?
2. Does the company operate multiple materially distinct business units (e.g., a TPA with both software and services segments)? If so, provide a revenue breakdown by unit.
3. What is the pricing model — outcome-based / premium / regulated revenue vs. seat-based / time-and-materials?
4. What is the intended holding period, and is there a specific investment decision (underwrite / pass / monitor) this assessment must inform?

> **If only a company name and sector are available:** Ask one focused clarifying question before scoring. Do not fabricate six-dimension scores from insufficient inputs.

---

### Workflow

1. **Collect inputs** — Gather the four required inputs (company description, business model, pricing structure, competitive landscape) plus any supplementary inputs (data assets, regulatory environment, AI investment disclosures). Score with what is available; never refuse to score due to missing supplementary inputs — instead reduce confidence and flag gaps in the watch-list.

2. **Score all six dimensions independently on a 1–5 scale** (5 = strong moat / favourable; 1 = weak / exposed) — see dimension definitions below. Attach 1–2 lines of evidence per dimension. If evidence is mixed, assign 3; never force a 2.5 to take a side. Never assign 1 or 5 without explicit supporting evidence.

3. **Compute composite scores** using only the formula below — do not deviate:

   ```
   Disruption Risk  = avg(6−D1, 6−D2, 6−D3)   // higher = more at risk
   Defensive Power  = avg(D4, D5, D6)            // higher = stronger defence
   ```

   *(The 6−x inversion exists solely in the composite formula; the raw 1–5 scale is never reversed on the scorecard itself — keeping all dimensions directionally consistent avoids sign confusion.)*

4. **Plot the 2×2 quadrant** — x-axis: Disruption Risk (1–5), y-axis: Defensive Power (1–5). Assign the quadrant label per the matrix in the Defaults section. If the plotted point falls within ~0.3 of a quadrant boundary, flag the position as borderline in the written commentary and explain which watch-list signal would push it to each adjacent quadrant.

5. **Separate multi-segment companies** — If the target spans materially different business units, score each unit independently across all six dimensions, plot each unit on its own 2×2, then derive a revenue-weighted composite point. Present **both** the unit-level plots and the composite — never collapse a conglomerate into a single averaged point without showing the underlying unit dispersion. *(A single averaged point masks divergent AI exposure across segments — the most common analytical shortcut to avoid.)*

6. **Write underwriting implications** — Quadrant-specific and company-specific; do not paste generic templates. See quadrant guidance in the Defaults section.

7. **Write the migration thesis** — For every quadrant, answer: *"What must be believed, and what dated evidence must appear within the holding period, for this company to move to an adjacent quadrant?"* Axis movement rules: x-axis (risk) migration requires a change in at least one of D1–D3; y-axis (defensive power) migration requires a change in at least one of D4–D6. See migration rules in Rules & Pitfalls.

8. **Compile watch-list** — 4–6 items, each formatted as: *[Named catalyst] by [date/fiscal period] → [specific dimension] re-scored from [old score] to [new score].* Generic competitive alerts are not acceptable.

9. **Assemble deliverables** — Produce markdown scorecard, then render .docx and 3-page .pptx per the specifications in the Deliverable Specifications subsection.

---

#### Six Dimension Definitions

| Code | Dimension | What to Score |
|---|---|---|
| D1 | Automation Resistance | Degree to which the work requires judgment that current LLMs cannot replicate — score the **depth of judgment produced**, not the structure of the output format |
| D2 | Disintermediation Resistance | Switching cost and workflow stickiness; ability to be bypassed by a general-purpose LLM or AI-native entrant |
| D3 | Pricing Model Durability | Outcome-based / premium / regulated revenue (durable) vs. seat-based / time-and-materials (compressible by AI) |
| D4 | Proprietary Data & Context | Exclusive longitudinal data generated by customers inside the product vs. publicly purchasable data |
| D5 | Regulatory & Independence Moat | Licences, fiduciary obligations, mandated independence requirements |
| D6 | AI Tailwind Capture | Whether the company itself converts AI into margin expansion, capacity growth, or new SKUs |

#### Quadrant Labels

| | **Defensive Power High (≥3)** | **Defensive Power Low (<3)** |
|---|---|---|
| **Disruption Risk Low (<3)** | **Fortress** | **Niche** |
| **Disruption Risk High (≥3)** | **Battleground** | **Vulnerable** |

#### Underwriting Implications by Quadrant

| Quadrant | Underwriting Stance |
|---|---|
| **Fortress** | Underwrite multiple expansion + AI-driven margin/capacity upside. Stress-test which specific pillars, if lost, would break the thesis. |
| **Battleground** | Assess whether moat build-out is outpacing commoditisation. Run sensitivity on exit multiple compression. |
| **Niche** | Underwrite stability and execution. Do **not** pay for an AI growth story — the scores do not support it. |
| **Vulnerable** | Require either a credible moat-building roadmap with explicit milestones, or underwrite on commoditisation assumptions (multiple and margin compression). If neither is present, pass. |

#### Deliverable Specifications

**.docx Scorecard** must contain in order:
- Cover: company name, quadrant label, date
- Two composite scores with confidence levels
- Six-dimension table: dimension name | raw score | evidence (1–2 lines) | confidence flag if evidence is weak
- Underwriting implications (quadrant-specific and company-specific)
- 4–6 watch-list items (named catalyst / date / dimension / score change)
- Confidence summary and information gaps

**3-Page .pptx IC Deck**:
- Page 1: Risk-framing 2×2 with the target plotted as an annotated point (and unit-level points if multi-segment)
- Pages 2–3: Three-dimension detail tables each — narrow left column: dimension name + score chip (red→green colour scale) + anchor prompt; wide right column: evidence and rationale; visually grouped by composite score

**Visual system** (apply consistently):
- Navigation-blue section headers
- Red→green risk colour scale: 1 = red, 2 = orange-red, 3 = amber, 4 = light green, 5 = green
- Battleground quadrant: gold highlight
- All score chips use the same colour scale across both decks

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Scale direction | 5 = strong/favourable; 1 = weak/exposed — never reversed on raw scorecard | Prevents sign confusion; inversion occurs only in the composite formula via 6−x |
| Uncertain / mixed-evidence score | 3 | Preserves epistemic honesty; avoids forcing a false directional view with a 2.5 |
| Extreme score threshold | 1 or 5 requires explicit named evidence | Prevents false precision; intermediate scores exist precisely for insufficient-evidence situations |
| Evidence requirement | 1–2 lines attached to each dimension | Enforces evidence discipline and distinguishes scored judgment from unscored intuition |
| Confidence flag | Applied when only industry intuition supports a score (no company-specific evidence) | Surfaces information gaps for the reader |
| Scoring with incomplete inputs | Score all six dimensions using available inputs; reduce confidence; name gaps in watch-list | Never refuse to score due to missing supplementary data |
| Borderline boundary flag | Flag and explain if plotted point is within ~0.3 of any quadrant boundary | Prevents false precision in quadrant assignment |
| Applicable sectors | Technology and white-collar services: SaaS, data/information, professional services, insurance/brokerage, fintech | Physical/heavy industry companies are AI-augmented not AI-disrupted — a different analytical framework applies |

---

### Rules & Pitfalls

**Never:**
- Never score the **format** of a company's output (structured reports, templates, dashboards) as a proxy for D1 automation resistance — score the **depth of judgment required to produce** the output. Investment banking analysis, legal opinions, and clinical assessments produce structured outputs but require non-replicable professional judgment; they should score above 2 on D1. Conflating format with judgment depth is the most common misapplication of this framework and will produce a systematically wrong quadrant assignment.
- Never collapse a multi-segment company into a single composite point without first scoring each business unit separately and plotting each unit on its own 2×2. A single averaged score conceals divergent AI exposure across segments and misleads capital allocation decisions.
- Never assign a score of 1 or 5 without citing named, explicit evidence — extreme scores without evidence are false precision and will fail IC scrutiny.
- Never cut a watch-list item to a generic competitive alert (e.g., "monitor competitive dynamics"). Every item must name a specific catalyst, a specific date or fiscal period, the specific dimension affected, and the direction of score change.
- Never apply boilerplate underwriting language across quadrants — implications must be quadrant-specific **and** company-specific.
- Never apply this framework to physical/heavy-industry companies — those businesses face AI augmentation, not AI disruption, and require a separate analytical lens.

**Conditional:**
- If a company spans both services-type and software-type business units, apply the services lens (labour leverage, AI productivity impact) to services segments and the software lens (system-of-record status, data moat, replicability) to software segments separately — never blend the two evaluation logics into a single assessment.
- If the plotted point falls within ~0.3 of a quadrant boundary, include a dedicated borderline paragraph in the written commentary explaining which watch-list trigger would push the company into each adjacent quadrant.
- If only a company name and sector are provided with no business detail: ask one focused clarifying question; do not construct six-dimension scores from insufficient inputs.

**Judgment:**
- A diagonal quadrant migration (e.g., Vulnerable → Fortress) is nearly never underwritable within a single holding period. When a migration thesis implies a diagonal move, decompose it into two sequential steps through an intermediate quadrant (Battleground or Niche), and present each step with its own dated evidence requirements. Treat diagonal migration as a base-case red flag, not a base-case scenario.
- Prefer scoring the services and software components of a mixed business through their respective lenses rather than averaging across lenses — blended logic produces a score that is precise but wrong.
- When evidence is genuinely insufficient to differentiate a score directionally, a 3 is more defensible at IC than a forced 2 or 4, because it signals an information gap rather than a false conviction.

---

### Pre-Delivery Checks

- Verify that all six dimensions are scored on the 1–5 scale with no reversals on the raw scorecard (inversion only in the 6−x formula).
- Verify that the composite formula is applied exactly as: Disruption Risk = avg(6−D1, 6−D2, 6−D3); Defensive Power = avg(D4, D5, D6).
- Confirm that no dimension scored 1 or 5 lacks an explicit, named evidence citation.
- Confirm that every dimension has at least 1–2 lines of evidence or a low-confidence flag if only industry intuition was available.
- Confirm that any plotted point within ~0.3 of a quadrant boundary carries a borderline flag and a directional watch-list explanation.
- Confirm that multi-segment companies show unit-level 2×2 plots **and** a revenue-weighted composite — not the composite alone.
- Verify that each watch-list item contains: named catalyst + date/fiscal period + specific dimension + directional score change.
- Verify that underwriting implications are quadrant-specific and company-specific — no generic templates.
- Confirm that the migration thesis specifies dated evidence triggers and that any diagonal migration has been decomposed into two sequential steps through an intermediate quadrant.
- Confirm the visual system is consistent: navigation-blue headers, red→green colour scale (1=red … 5=green), Battleground in gold.
- Confirm the .pptx runs to exactly three pages per the layout specification.

---

### Scope Boundaries

Quantitative valuation (DCF, 3-statement modelling, LBO, comps) is handled by the financial modelling playbooks — this playbook produces qualitative structured scoring that informs underwriting stance, not a standalone valuation. Physical and heavy-industry companies fall outside this framework's applicable scope; AI-augmentation analysis for those sectors requires a separate playbook. Credit memo drafting and full IC memo composition are handled by their respective writing playbooks; this playbook produces the AI risk scorecard section and IC deck insert only.
