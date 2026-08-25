# Valuation

Playbooks for answering "what is this company worth": intrinsic (DCF), market-based (trading comps, precedent transactions), segment-based (SOTP), and share-count mechanics. Always load `formats/excel_standards.md` and `formats/metric_disambiguation.md` alongside this file when producing Excel output.

## Contents

| Task | Use when |
|---|---|
| [DCF Model](#dcf-model) | Building a standalone discounted cash flow valuation for a company |
| [Public Comps](#public-comps) | Valuing a company using current market pricing of publicly traded peers |
| [Precedent Transactions](#precedent-transactions) | Valuing a target using actual M&A transaction multiples paid by acquirers |
| [SOTP Valuation](#sotp-valuation) | A multi-segment company requires segment-level valuation with distinct growth, margin, or risk profiles |
| [Fully Diluted Share Count](#fully-diluted-share-count) | Calculating fully diluted shares outstanding (FDSO) for use in market cap, per-share value, EPS, or valuation inputs |

---

## DCF Model

**Use when**: Building a standalone discounted cash flow valuation for a company | **Deliverable**: Excel workbook (DCF tab + WACC tab) formatted for direct PPT screenshot extraction

### Ask First
1. Which capital structure to use when relevering beta — target company's own structure, the comparable-company average, or a user-specified optimal structure?
2. Is a management-case forecast available, or should the model rely on consensus estimates / broker research / internally constructed assumptions?
3. What is the valuation date (default: most recent fiscal year-end)?
4. Are public bonds outstanding for the cost-of-debt calculation, or must interest expense / average debt be used?

### Workflow

1. **DCF Tab — Key Assumptions cell block** — Lock in valuation date, marginal tax rate, diluted share count (TSM), cash, debt, and terminal value method selection. *(Define all inputs before writing any formula; inserting rows after formulas are written silently breaks every reference downstream.)*
2. **DCF Tab — Free Cash Flow build and discounting** — Construct the Revenue → UFCF schedule and compute the NPV of each year's cash flow using mid-year convention. *(Revenue drives everything below it; complete the full FCF structure before introducing discount factors.)*
3. **DCF Tab — Terminal value, equity bridge, and sensitivity table** — Calculate both terminal value methods in parallel (perpetuity-growth left, exit-multiple right), run the equity bridge under each, and generate sensitivity tables dynamically. *(Terminal value sizing must be confirmed before the equity bridge can foot.)*
4. **WACC Tab — Key Assumptions cell block** — Enter risk-free rate, equity risk premium, cost of debt, and size premium. *(Build WACC after the DCF shell exists so tax rate and capital structure can be linked in rather than re-entered.)*
5. **WACC Tab — Comparable-company beta analysis** — Unlever each comp's raw beta, summarize the distribution, and select the relevered beta using the capital structure confirmed in Ask First Q1.
6. **WACC Tab — CAPM and WACC calculation** — Compute cost of equity via CAPM, then blend to WACC using the target capital structure.
7. **Link WACC back into DCF discount factors** — Make the model fully dynamic so any assumption change propagates end-to-end; then run the full sanity-check suite before delivery.

#### Deliverable Layout (PPT-ready format)
Structure each tab so any analyst can screenshot a region directly into a slide deck without reformatting:

- **Top of DCF tab**: Revenue → EBITDA → UFCF schedule with annual columns
- **Below FCF schedule**: Terminal value block (perpetuity-growth | exit-multiple side by side), NPV summary, equity bridge, implied share price — both methods in parallel columns
- **Bottom of DCF tab**: D&A, capex, and NWC detail tables *(these are working paper rows; do not surface them in PPT by default)*
- **Sensitivity tables**: WACC vs. perpetuity-growth rate; WACC vs. exit multiple — right-aligned beside their respective terminal value blocks

#### Dual Terminal Value Display
Present both methods simultaneously — never a dropdown toggle:

| Column group | Perpetuity Growth (left) | Exit Multiple (right) |
|---|---|---|
| Terminal value formula | FCF_{n+1} / (WACC − g) | Multiple × EBITDA_{reference year} |
| Equity bridge | ✓ | ✓ |
| Implied share price | ✓ | ✓ |
| Cross-validation output | Implied exit multiple | Implied growth rate |

#### Sensitivity Table Construction
- Center value: blue hard-input cell equal to the DCF base-case result
- All axis values: formula-driven as `center ± offset` (no hard-coded axis labels)
- Output cells: data-table formula referencing WACC and the relevant terminal value driver
- Entire table regenerates automatically when the center cell changes

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Forecast period | 5 years | Industry convention for visible-horizon planning |
| Discounting convention | Mid-year (periods 0.5, 1.5, 2.5, 3.5, 4.5) | Reflects cash received throughout the year, not only at year-end |
| Valuation date | Most recent fiscal year-end | Ties to audited financials |
| Tax rate | Federal + state for HQ jurisdiction; placeholder **25%** if data unavailable | Consistency with WACC's after-tax cost of debt |
| Perpetuity growth rate (PGR) | **2.5%** (in line with long-run nominal GDP) | Prevents terminal value inflation |
| Exit multiple metric | **LTM EBITDA** based on current trading / comparable company / precedent transaction levels | Most widely accepted terminal multiple basis |
| Equity risk premium (ERP) | Latest Duff & Phelps publication; **5.5%** if unavailable | Authoritative market-standard source |
| Size premium | Kroll decile corresponding to company market cap | Adjusts for systematic small-cap risk |
| Cost of debt | YTM on public bonds if available → interest expense / average debt → risk-free rate + credit spread if no debt | Hierarchy ensures best available market signal |
| Forecast assumption priority | **Consensus estimates > broker research > internally constructed assumptions** (revenue growth tapers from recent trend to long-run industry rate; margins held stable) | Defensible to IC; minimises model subjectivity |

### Rules & Pitfalls

**Never:**
- **Never use basic share count** — always use the fully diluted count via the treasury stock method (TSM). Basic share count overstates per-share value and is the single fastest credibility-killer with an MD or IC reviewer.
- **Never hard-code values inside formulas** — the entire value of a DCF is the live, interactive model that MDs and IC members stress-test in real time. A buried constant silently breaks that contract and will be caught.
- **Never insert rows after formulas are written** — doing so shifts every cell reference in the model without warning, producing errors that are extremely difficult to trace. Define all row structure before entering a single formula.
- **Never use the company's effective book tax rate for cash flow** — WACC's after-tax cost of debt uses the marginal tax rate; applying a different rate in the FCF build creates internal inconsistency that invalidates the entire discount framework.
- **Never include growth-phase capex or abnormal NWC movements in the terminal year** — terminal value assumes a steady-state perpetuity. Any non-recurring or expansion item gets permanently capitalised, severely distorting the valuation.
- **Never silently swallow model errors** — flag every #REF!, #DIV/0!, and any anomalous output to the user rather than masking or ignoring it.

**Conditional:**
- **If terminal value as a percentage of EV falls outside ~50–70%**, flag this explicitly to the user. A terminal value below 50% suggests an overly pessimistic long-run view; above 90% indicates the explicit forecast period is doing almost no work — both signal unbalanced assumptions requiring review.
- **If using an NTM exit multiple**, apply it to the EBITDA of the year *after* the terminal year (year n+1). If using an LTM exit multiple, apply it to the terminal year's EBITDA. Mismatching vintage to multiple is a common hidden error.
- **If implied share price deviates more than ±30–50% from the current market price**, flag the gap with a note that it may reflect a genuine market mispricing, but do not automatically adjust assumptions to close it — the deviation is information, not a bug.
- **If the company has net cash (cash exceeds gross debt)**, net debt is negative; the equity bridge must add back this net cash position, increasing implied equity value. Confirm the sign convention is correct before delivery.
- **If a public bond is unavailable and the company carries no debt**, estimate cost of debt as the risk-free rate plus an appropriate credit spread consistent with the company's implied rating.

**Judgment:**
- **Run a reverse DCF (market-implied analysis) as a reality check** — back-solve the growth rate and/or exit multiple that the current share price implies. If the implied growth rate exceeds ~5% or the implied multiple is materially above the comparable-company range, your forward assumptions may be too aggressive or too conservative; investigate before finalising.
- **When selecting comparable companies for beta**, prefer relevance (business model, geography, end-market) over size. A closer business analogue with a noisier beta is more defensible than a large-cap with a cleaner beta but a different risk profile.
- **D&A and capex should converge in the terminal year** — a sustained D&A >> capex gap implies the asset base is shrinking, which is inconsistent with a going-concern perpetuity assumption.

### Pre-Delivery Checks
- Confirm terminal value perpetuity growth rate **does not exceed the risk-free rate** (a PGR above the risk-free rate implies the company eventually outgrows the economy indefinitely)
- Confirm WACC falls within its appropriate range: **7–9%** for large/stable companies; **9–12%** for growth companies; **12–15%** for high-risk/early-stage companies
- Confirm **NPV(FCFs) + NPV(terminal value) = Enterprise Value in the equity bridge** — these must foot exactly
- Confirm **discount factors decrease monotonically** year over year (any uptick signals a formula error in the exponent)
- Confirm **net debt sign convention** is correct — net cash produces a negative net debt that increases implied equity value
- Confirm **D&A and capex trend toward convergence** by the terminal year
- Confirm **diluted share count uses TSM**, not basic shares outstanding
- Confirm **sensitivity table center cell equals the DCF base-case result** exactly
- Confirm **terminal value is normalised** — no one-time items, growth capex, or abnormal NWC in the terminal year inputs
- Confirm **exit multiple vintage is matched correctly** (NTM multiple × year n+1 EBITDA; LTM multiple × year n EBITDA)
- Confirm the model is **free of #REF!, #DIV/0!, and circular errors** (except intentional WACC circularity if iteration is enabled)
- Confirm **implied share price deviation from spot is flagged** if outside ±30–50%

### Scope Boundaries
Comparable company analysis (trading comps) and precedent transaction analysis are handled by their respective playbooks; the beta comp table built here feeds the WACC but does not replace a full trading-comps deliverable. Capital structure optimisation and LBO entry/exit analysis are out of scope and require separate models. Merger-consequence analysis (accretion/dilution, contribution analysis) is handled by the M&A model playbook.

---

## Public Comps

**Use when**: Valuing a company using current market pricing of publicly traded peers | **Deliverable**: Excel workbook with a single "Comps Sheet" tab containing peer groupings, market and operating statistics, valuation multiples, historical trading context, and summary statistics

### Ask First
1. Which company is the subject, and what is the pricing date (default: most recent trading day)?
2. What is the target universe — industry, geography, and any anchor peers the client has already identified?
3. What reporting currency should the table use (default: USD)?
4. Is the target company public or private? (If private: confirm the user will supply financials; market-data columns will be omitted with a footnote citing the non-public source.)

### Workflow

**Step 0 — Confirm inputs**
Lock pricing date, currency, subject company identity, and any seed peer list before touching data.

**Step 1 — Define the comp set**
1. Start with the subject company's self-reported peer group from its most recent proxy statement or 10-K.
2. Refine the list by business model similarity, then scale, growth profile, and margin profile — in that priority order.
3. Segment into **Core (6–10 peers)** and **Secondary (6–10 peers)**; document the rationale for each inclusion/exclusion.
4. Flag and remove any peer with **fewer than 2 quarters of public trading history** unless it is uniquely relevant, in which case add a footnote.
5. Flag peers affected by transformative M&A, spin-offs, carve-outs, restatements, segment reclassifications, or short listing history — these impair comparability and must be footnoted.

**Step 2 — Build the table (11-column group structure)**

Construct columns in the following dependency order (later columns require earlier ones to be locked):

| Column Group | Contents |
|---|---|
| **Company info** | Name, ticker, group label (Core / Secondary / Target) |
| **Market data** (all as-of same pricing date) | Share price, fully diluted shares outstanding (TSM), market cap, TEV, % of 52-week high |
| **Capital structure bridge** | Gross debt (excl. operating lease liabilities), cash, preferred equity, minority interest → TEV reconciliation |
| **LTM operating statistics** | Revenue, Adj EBITDA, Adj EBITDA margin, capex, Adj net income |
| **NTM estimates** | Revenue, Adj EBITDA, EPS (consensus median, direct — do not derive from NI ÷ FDSO) |
| **LTM multiples** | TEV/Revenue, TEV/EBITDA, P/E |
| **NTM multiples** | TEV/Revenue, TEV/EBITDA, P/E |
| **Historical trading context** | L5YA TEV/NTM EBITDA (monthly-end observations, 60 data points; mark NM if insufficient history; disclose observation frequency) |
| **Summary statistics** (per group + All Comps) | Mean, 25th percentile, Median, 75th percentile |

Build the target company row last: highlight it distinctly, populate it on an identical line-item basis, and **exclude it from all summary statistics**.

**Step 3 — Apply industry adjustments**
Replace or supplement standard TEV-based columns based on sector:

| Sector | Use instead of / in addition to standard multiples |
|---|---|
| Banks | P/TBV, P/E, NIM; drop TEV-based columns |
| REITs | FFO, AFFO, NAV multiples |
| SaaS / software | ARR, NRR multiples |
| Insurance | P/BV, combined ratio |
| E&P | EV/EBITDAX |

Remove columns that are not applicable to the sector; do not leave blank columns in the deliverable.

**Step 4 — Populate summary statistics and run sanity checks**
Build live formula-based summary statistics; run all Pre-Delivery Checks before delivery.

#### Summary Statistics — Excel Mechanics

- Use `PERCENTILE(range, 0.25)`, `PERCENTILE(range, 0.75)`, `MEDIAN(range)`, and `AVERAGE(range)` exclusively.
- Use `IFERROR(formula, "")` to suppress errors; apply a number format that displays zero as a dash — do **not** hard-code the string `"-"`.
- For the **All Comps** row that spans groups separated by header/spacer rows: build hidden helper columns that collect each group's values into a contiguous range, then point the summary formulas at those helper columns.
- Display negative numbers in parentheses; place units in column headers only — cells must contain pure numbers to remain sortable.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Pricing date | Most recent trading day | Ensures all market data is contemporaneous |
| Reporting currency | USD | Converts non-USD peers at as-of spot FX rate; disclose rate and source in footnote |
| SBC treatment | Expense — **not** added back to EBITDA | Applied uniformly across entire comp set; disclosed in footnotes |
| TEV construction | Market cap + gross debt (excl. operating lease liabilities) + preferred equity + minority interest − cash | Consistent with pre-IFRS 16 / pre-ASC 842 treatment; note if lease capitalisation is material |
| Diluted share count | Treasury Stock Method (TSM) across all equity-value and per-share metrics | Captures dilution from options/RSUs/warrants on a net basis |
| Forward estimates | Sell-side consensus **median** (NTM) | Median is more robust to outlier estimates than mean |
| NTM EPS source | Direct consensus EPS estimate | Preserves each analyst's embedded share-count assumption; do not reconstruct from consensus NI ÷ FDSO |
| Adj EBITDA definition | Company self-reported Adj EBITDA; if unavailable, start from GAAP and apply only the SBC convention used across the comp set | Limits analyst discretion; analyst-calculated adjustments must be footnoted |
| Historical trading context | L5YA (last 5 years) average TEV/NTM EBITDA, monthly-end, ~60 observations | Provides valuation cycle context |
| Peer selection priority | Relevance (business model, growth, margin) over size | Avoids defaulting to largest-cap peers, which may be structurally different |
| Comp set size | Core 6–10 + Secondary 6–10 | Balances comparability with statistical robustness |
| NM trigger | Denominator is zero, negative, missing, or not applicable | Ensures meaningless multiples do not pollute summary statistics |
| Outlier flag thresholds | TEV/Revenue > 30×, TEV/EBITDA > 50×, P/E > 75× | Triggers data verification before including in or excluding from statistics |

---

### Rules & Pitfalls

**Never:**
- **Never use a mixed pricing date across peers** — even a one-day lag on share price corrupts the comparability of all market-derived columns and is immediately visible to any reviewer.
- **Never add back SBC for a subset of peers** — partial add-back makes multiples incomparable across the set; SBC treatment must be identical for every row in the table.
- **Never silently substitute unadjusted GAAP EBITDA for Adj EBITDA** — the resulting multiple is not comparable to company-reported or consensus Adj EBITDA multiples and will misstate the valuation reference range.
- **Never approximate percentiles using `SMALL` / `LARGE` with a hand-picked array** — results differ from true PERCENTILE interpolation and are not reproducible; use `PERCENTILE()` exclusively.
- **Never use the `@` implicit intersection operator in array formulas** — it silently breaks array functions without producing a visible error, causing summary statistics to compute on a single cell rather than the intended range.
- **Never include the target company row in summary statistics** — including it creates circular logic; the comp set exists to benchmark the target, not to be contaminated by it.
- **Never mix calendar-year and fiscal-year periods in the same LTM or NTM column** — peers with non-December fiscal year-ends must be calendarised; if calendarisation is not performed, disclose the fiscal year-end dates in a footnote.
- **Never use basic share count for market cap or per-share metrics** — it understates dilution and is immediately flagged by any deal team reviewer.

**Conditional:**
- **If a peer follows IFRS 16 (or ASC 842) and has capitalised its operating leases**, flag the accounting standard difference; IFRS 16 capitalisation inflates reported EBITDA relative to US GAAP peers and impairs comparability of TEV/EBITDA multiples — quantify the impact or exclude the lease-adjusted figures with a footnote.
- **If a peer has multiple share classes or a dual primary listing**, include all share classes that participate in common equity when computing market cap; use the primary-listing share price and share count, convert to reporting currency at as-of spot FX rate, and disclose the FX rate and listing choice in a footnote.
- **If fewer than 3 sell-side analysts cover a peer's NTM estimates**, flag the low coverage count in a footnote; exclude that peer's NTM multiples from NTM summary statistics and mark the cells NM.
- **If a peer's LTM financials include a material acquisition**, present pro-forma LTM revenue, EBITDA, and margins as if the combined entity existed for the full period; footnote the source and nature of pro-forma adjustments.
- **If analyst-calculated adjustments to EBITDA deviate materially from the company's self-reported figure**, footnote the methodology and flag unusually aggressive adjustments for senior review before locking the model.
- **If an outlier multiple is triggered** (TEV/Revenue > 30×, TEV/EBITDA > 50×, P/E > 75×), verify source data first; if the data is correct and the peer is structurally different, consider reporting a "Mean (ex. outliers)" row for multiples exceeding 100× — note that median and percentile statistics are naturally robust to outliers.

**Judgment:**
- **Prefer business-model relevance over market-cap size when selecting comps** — a smaller but structurally identical peer produces a more defensible multiple than the largest-cap name in a broadly defined sector.
- **Use the subject company's proxy/10-K self-reported peer group as the starting point, not the endpoint** — self-reported peers reflect management's own framing but may be aspirational or stale; refine by business model fit, growth, and margin profile.
- **When Adj EBITDA adjustments appear abnormally large relative to GAAP EBITDA**, flag for senior review before using — the multiple implied by an aggressively adjusted denominator may not be credible to a counterparty or fairness opinion reviewer.
- **For private targets, omit all market-data columns rather than leaving them blank** — blank market columns on a private target invite misreading; footnote the non-public financial data source.

---

### Pre-Delivery Checks

- Confirm all share prices, market caps, TEVs, % 52-week highs, and current multiples reference the **identical pricing date** — no peer deviates by even one trading day.
- Verify **market cap = share price × fully diluted shares outstanding (TSM)** for every peer row.
- Verify **TEV = market cap + gross debt (excl. operating lease liabilities) + preferred equity + minority interest − cash** for every peer row; confirm net debt definition is consistent across all rows.
- Confirm a single reporting currency throughout; verify FX conversion rates are as-of the pricing date and are disclosed.
- Confirm LTM and NTM periods are calendarised and that no column mixes calendar-year and fiscal-year end dates without a footnote.
- Confirm NTM estimates are sourced from sell-side consensus median; flag any peer with fewer than 3 analyst estimates.
- Confirm NTM EPS is the direct consensus EPS figure, not NI ÷ FDSO.
- Confirm SBC is treated as an operating expense (not added back) uniformly across every peer, and that this treatment is disclosed in the footnotes.
- Confirm TEV construction excludes operating lease liabilities for all peers; flag any IFRS 16 / ASC 842 capitalisation differences.
- Confirm all zero or negative denominators are marked **NM**, not zero, blank, or a dash string.
- Confirm NM cells and blank cells do not distort `MEDIAN`, `PERCENTILE`, or `AVERAGE` summary statistics — test by temporarily hard-coding an extreme value and verifying the statistic does not shift.
- Confirm no `@` implicit intersection operator appears in any array formula used for summary statistics.
- Confirm summary statistics use `PERCENTILE(range, 0.25)`, `PERCENTILE(range, 0.75)`, `MEDIAN()`, and `AVERAGE()` exclusively — no `SMALL`/`LARGE` approximations.
- Confirm the target company row is highlighted distinctly and **excluded from all summary statistics**.
- Confirm All Comps summary statistics span all groups (using hidden helper columns if groups are separated by spacer rows) and return the same result as manually combining the groups.
- Flag any multiple exceeding the outlier thresholds (TEV/Revenue > 30×, TEV/EBITDA > 50×, P/E > 75×) and document the verification outcome.
- Confirm TEV-based multiples and equity-value multiples are not mixed within the same column.
- Confirm L5YA historical trading context discloses the observation frequency (~60 monthly-end data points) and marks NM where history is insufficient.
- Confirm all cell values in the data range are pure numbers; units appear in column headers only; zeros display as dashes via number format (not a hard-coded string); negatives display in parentheses.

---

### Scope Boundaries

**Precedent Transaction Comps** handles deal-implied multiples from historical M&A transactions (which embed control premiums) rather than current market trading multiples — use that playbook when the valuation context is a change-of-control transaction.
**DCF** handles intrinsic valuation from projected free cash flows — use that playbook when the engagement requires an independent view of fundamental value rather than a market-derived reference range.
**Peer Identification** handles the research and screening process for candidate peers without building the comp table — use that playbook when the comp set itself is under debate and requires a stand-alone deliverable.

---

## Precedent Transactions

**Use when**: Valuing a target using actual M&A transaction multiples paid by acquirers | **Deliverable**: Excel workbook with 4 tabs — Transaction Data, Valuation Multiple Chart, Implied Target Valuation, Deal Profiles and Rationale

---

### Ask First
1. What is the target company's industry, sub-sector, and key financials (LTM revenue, EBITDA, EBITDA margin)?
2. Which valuation multiples are required (default: EV/LTM Revenue, EV/LTM EBITDA — confirm if sector norms differ, e.g. EV/NTM Revenue for high-growth Tech, EV/AUM for asset managers, P/FFO for REITs)?
3. What is the target's approximate transaction size (used to apply the 0.25x–5.0x revenue size filter)?
4. Should the universe include minority/structural transactions, or control transactions only (default: control)?

---

### Workflow

1. **Define the transaction universe** — Source deals from SEC filings, press releases, investor presentations, CapIQ, FactSet, and Bloomberg. Exclude rumored, withdrawn, and cancelled transactions from the core set. Limit to the past 5 years (especially for the primary tier); flag any deal outside this window and explain its inclusion. Prefer ≥10 transactions total; if M&A activity is sparse, accept ≥5 with explicit notation.

2. **Apply size filter** — Include only transactions where target revenue falls within **0.25x–5.0x** of the subject target's revenue. If target financials are not yet available, build the universe on industry/business-model criteria and annotate: *"Size filter to be applied once target metrics are confirmed."*

3. **Tier the universe into 2–3 layers (maximum 4)** — Segment by a combination of size, growth profile, margin profile, business model, geography, end market, or acquirer type. Every tier must have a specific, written rationale. Label tiers dynamically and descriptively (e.g., Core / Adjacent / Broader / Aspirational) — do not use static or generic names. Never collapse all transactions into a single catch-all bucket.

4. **Build the Transaction Data tab** *(anchor tab — single source of truth)*
   - Columns: Target, Acquirer, Close Date, Transaction EV, LTM Revenue, LTM EBITDA, LTM EBITDA Margin, EV/LTM Revenue, EV/LTM EBITDA, Control Premium (and initial premium if competitive bid), Tier assignment, Source annotation per cell.
   - Rows: All transactions grouped by tier, then the full universe.
   - Statistics: Compute **Max / 75th percentile / Median / 25th percentile / Min** for each tier and for the full universe.
   - For tiers with **fewer than 4 transactions**, replace percentile labels with **Min / Median / Max** and add a note flagging the small sample.
   - Where a metric is unavailable, return **"NM"** in the cell; still compute all summary statistics using available observations.

5. **Normalize EBITDA across all transactions** *(do before computing multiples)* — Apply consistent treatment for operating vs. capitalized leases, capitalized software, stock-based compensation, and restructuring charges. Do not use synergy-adjusted metrics unless they are explicitly disclosed and labeled as such.

6. **Verify EV construction for every transaction** — When a source reports only equity value, reconstruct EV via the equity bridge: **EV = Equity Value + Net Debt + Preferred Stock + Minority Interest**, where net debt is pulled from the most recent filing prior to announcement. Even when EV is reported directly, cross-check against the bridge. Never mix equity value with EV in the same column.

7. **Verify LTM period integrity** — Confirm that each transaction's LTM period ends **before its announcement date**. Never use a forward metric in a column designated LTM, and never mix LTM and forward multiples in the same table.

8. **Determine the unaffected share price for control premium calculations** — Unaffected price = closing price on the trading day immediately before whichever comes first: (a) public announcement date, (b) first media report of a potential transaction, or (c) the date of a material, anomalous share price move suggesting a leak. For competitive bidding situations, record **both the initial offer premium and the final deal premium**.

9. **Build the Valuation Multiple Chart tab** *(combo chart: bars + median lines)*
   - One bar per transaction, colored by tier, sorted within each tier high-to-low, and tiers ordered high-to-low left-to-right.
   - Label each bar on the x-axis as: **Target / Acquirer (Close Date)**.
   - Overlay each tier's median as a **line spanning only the bars in that tier** — not the full chart width.
   - Overlay the full-universe median as a line spanning all bars.
   - Add clear data labels. (See Chart Discipline rules below.)

10. **Build the Implied Target Valuation tab** — Apply the selected multiples' **25th percentile / Median / 75th percentile** to the target's corresponding metrics to produce Low / Mid / High implied EVs. Present one row per tier and one row for the full universe. Highlight the Median/Mid column; use a deeper highlight for the primary tier row as the valuation anchor. Add an "Analyst Notes" section below the table with specific, transaction-referenced rationale for the chosen multiple (see Rules & Pitfalls — Judgment).

11. **Build the Deal Profiles and Rationale tab** — One profile card per transaction, in the same order as the chart. Each card includes: parties, close date, deal size, EV construction, multiples, control premium, tier assignment rationale, and macro regime flag where relevant. All numeric values must **link back to the Transaction Data tab** — no hardcoded figures.

12. **Flag macro regime differences** — Note the interest rate environment, credit cycle phase (e.g., GFC, COVID, post-COVID rebound), and market conditions at each transaction's announcement date. Multiples from different regimes are not directly comparable without comment.

---

#### Deliverable Tab Map

| Tab | Content |
|---|---|
| **Transaction Data** | Full deal table, tiered, with per-tier and full-universe Max/75th/Median/25th/Min statistics |
| **Valuation Multiple Chart** | Combo chart: bars by tier + tier median lines + full-universe median line |
| **Implied Target Valuation** | 25th/Median/75th applied to target metrics → Low/Mid/High EV per tier and full universe; Analyst Notes below |
| **Deal Profiles and Rationale** | Per-deal cards linked to Transaction Data; tier rationale; macro regime flags |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Multiple period | LTM | Industry standard for precedent transactions; forward multiples used only where sector convention requires (high-growth Tech: EV/NTM Revenue; asset managers: EV/AUM; REITs: P/FFO) |
| Transaction type | Control transactions only | Minority and structural transactions reflect different pricing dynamics and should be excluded unless explicitly requested |
| Transaction count | ≥10; ≥5 if low M&A activity | Minimum for statistical validity; sub-4 tiers use Min/Median/Max instead of percentiles |
| Lookback window | 5 years, primary tier | Recent transactions best reflect current market conditions; older deals flagged and justified |
| Size filter | 0.25x–5.0x target LTM revenue | Ensures transactional relevance; deferred if target financials unavailable |
| Tier count | 2–3 (maximum 4) | Granularity without fragmentation; no catch-all bucket |
| Summary statistics | Max / 75th / Median / 25th / Min per tier and full universe | Full distribution disclosure |
| Excluded transactions | Rumored, withdrawn, cancelled | Only completed deals reflect actual market-clearing prices |
| EBITDA normalization | Consistent treatment of leases, capitalized software, SBC, restructuring | Ensures like-for-like comparability across the universe |
| Synergy-adjusted metrics | Excluded unless disclosed and labeled | Synergy-adjusted figures overstate achievable stand-alone multiples |
| Small-sample tier statistics | Min / Median / Max (no percentiles) with sample-size footnote | Percentiles are statistically unreliable below 4 observations |

---

### Rules & Pitfalls

**Never:**
- **Never use a catch-all single-bucket universe** — collapsing all transactions into one tier destroys the analytical signal of relative relevance and is treated as a fundamental structural error by reviewers.
- **Never mix equity value with enterprise value** — the two measure different claims; using equity value where EV is required systematically misstates multiples and is immediately detectable.
- **Never mix LTM and forward multiples in the same table** — doing so renders every multiple in the table uninterpretable and invalidates the distribution statistics.
- **Never use a synergy-adjusted EBITDA metric without explicit disclosure and labeling** — it inflates the denominator, deflates the implied multiple, and misrepresents what a buyer actually paid for stand-alone performance.
- **Never use an LTM period that ends after the announcement date** — it incorporates post-announcement financial performance that was not available to transaction participants.
- **Never rely solely on press release summaries without cross-checking the underlying SEC filing or official disclosure** — press releases regularly omit or misstate EV components.
- **Never write generic multiple-selection rationale** (e.g., "reflects value drivers and risk profile") — this is a cited error; rationale must name specific comparable transactions and articulate concrete operating or market conditions.
- **Never present LTM revenue and LTM EBITDA margin as independent metrics in separate columns without recognizing that they are derived from the same revenue base** — they are not additively independent; treat them as linked for consistency checks.

**Conditional:**
- **If a source reports only equity value**, reconstruct EV via the equity bridge (Equity Value + Net Debt + Preferred Stock + Minority Interest), using net debt from the most recent filing prior to announcement, before computing any multiple.
- **If a tier contains fewer than 4 transactions**, replace 25th/75th percentile labels with Min/Median/Max and add a footnote noting the small sample size.
- **If M&A activity in the sector is thin (total universe <10 transactions)**, accept ≥5 transactions with explicit notation and apply heightened scrutiny to outliers.
- **If target financials are not yet available**, build the transaction universe on industry and business-model criteria alone and annotate every size-filtered column: *"Size filter (0.25x–5.0x revenue) to be applied once target metrics are confirmed."*
- **If the deal involved a competitive bidding process**, record both the initial offer premium and the final deal premium as separate fields; use the final premium for the primary table and footnote the initial.
- **If transactions span materially different macro regimes** (e.g., GFC, COVID, post-COVID rebound, rising-rate environment), flag each affected transaction and explain the multiple compression or expansion attributable to regime rather than fundamental value.
- **If the sector uses non-standard multiples** (high-growth Tech → EV/NTM Revenue; asset managers → EV/AUM; REITs → P/FFO), override the LTM default and document the substitution in Analyst Notes.

**Judgment:**
- **Prefer relevance over volume when tiering** — a Core tier of 5 directly comparable transactions anchors the valuation more credibly than a broad tier of 15 loosely comparable ones.
- **Use the primary tier's median as the valuation anchor** — the 25th/75th percentile bounds frame the range, but the median of the most directly comparable tier is the reference point you must be prepared to defend.
- **Cite specific transactions when justifying multiple selection** — state which deal(s) in the Core tier set the median, what operational profile they share with the target, and what specific conditions (growth rate, margin, strategic fit, market timing) would support a multiple above or below the median.
- **Treat the Adjacent/Broader tiers as context, not the anchor** — they establish an aspirational ceiling or a floor discount, not the central estimate.
- **Flag any transaction that looks like a distressed sale, minority stake, or carve-out anomaly** — exclude it from the primary tier even if it passes the size and industry filters, unless the target is also in distress.
- **Anchor control premium analysis to the unaffected price, not the pre-announcement market price** — if the stock moved materially on leak speculation before announcement, the pre-announcement price overstates the unaffected baseline and understates the true control premium.

---

### Pre-Delivery Checks
- Confirm every EV in the Transaction Data tab has been reconstructed or verified via the equity bridge (Equity + Net Debt + Preferred + Minority Interest).
- Confirm every LTM period ends **before** the corresponding transaction's announcement date — no exceptions.
- Confirm no LTM and forward multiples appear in the same column or the same summary statistics block.
- Confirm EBITDA normalization treatment (leases, SBC, restructuring, capitalized software) is applied **consistently** across all transactions in the universe.
- Confirm no synergy-adjusted metric is used without explicit disclosure and a labeled column header.
- Confirm every metric cell in Transaction Data carries a **source annotation** (comment/footnote) linking to the specific SEC filing, press release, or vendor pull.
- Confirm control premiums use the **unaffected price** (earliest of: announcement date, first media report, leak-date anomalous move), not the pre-announcement close.
- Confirm competitive bid transactions record **both** initial and final premiums.
- Confirm every tier with fewer than 4 transactions displays **Min / Median / Max** (not 25th/75th percentiles) with a sample-size footnote.
- Confirm "NM" cells are present where metrics are unavailable, and that summary statistics are still computed across available observations.
- Confirm the chart has tier-colored bars sorted high-to-low within each tier, tier median lines covering **only that tier's bars**, and the full-universe median line covering all bars.
- Confirm the Implied Target Valuation tab highlights the Median/Mid column and uses a deeper highlight for the primary tier anchor row.
- Confirm Deal Profiles and Rationale tab contains **no hardcoded numbers** — all figures link to Transaction Data.
- Confirm Analyst Notes provide **transaction-specific** rationale (named deals, specific operating/market conditions) — reject any generic language.
- Confirm macro regime differences are flagged for any transaction announced during a materially different interest rate or credit environment than the current period.

---

### Scope Boundaries
Public trading multiples (EV/EBITDA, P/E on publicly traded comparables without a control premium) are handled by the **Public Comps** playbook. Intrinsic valuation via discounted cash flows, WACC derivation, and terminal value construction are handled by the **DCF** playbook. This playbook covers only actual completed M&A transactions and the control premiums embedded in them.

---

## SOTP Valuation

**Use when**: A multi-segment company requires segment-level valuation with distinct growth, margin, or risk profiles | **Deliverable**: Excel workbook with SOTP summary table, explicit equity bridge block, and sensitivity tables; supporting segment comp sheets

---

### Ask First
1. Which business segments should be valued — use the company's self-reported segment disclosures (10-K/10-Q/earnings supplements) as the authoritative starting point; confirm if any segments should be combined or split differently.
2. What is the valuation purpose — conglomerate discount analysis, spin-off / RemainCo sizing, activist break-up thesis, or internal portfolio review? (Drives which optional modules to build.)
3. Are broker SOTP reports available for this company? If yes, obtain them before building — use as a reference baseline and document any departures.
4. Is a spin-off scenario required? If yes, confirm availability of separation cost estimates, dis-synergy assumptions, and intended debt allocation.

---

### Workflow

1. **Identify segments and extract financials from self-reported disclosures** (10-K/10-Q/earnings supplement segment footnotes). Reconcile inter-segment revenue eliminations so that segment revenues sum to consolidated revenue. This anchors every subsequent step to audited, company-defined figures rather than top-down estimates.

2. **Classify each segment by nature and assign a valuation method** (determines peer universe in Step 3):
   - Mature / profitable → EV/EBITDA comps
   - Unprofitable / high-growth → EV/Revenue comps
   - Real estate / heavy asset → NAV
   - Biotech pipeline → probability-weighted DCF (rNPV)

3. **Build a dedicated peer group for each segment**; pull LTM (default) trading multiples. Flag any outlier peer trading at >2× the median — present two versions of the range, with and without that peer. Derive a low/high multiple range per segment using 25th/75th percentile as boundary defaults.

4. **Apply normalized (adjusted) EBITDA or the appropriate metric to each segment** before applying multiples. Strip one-time items before this step; never apply multiples to unadjusted figures containing one-time charges.

5. **Run a segment-level DCF where warranted** (typically high-growth or hard-to-comp segments). Present DCF output as a clearly labeled separate row in the SOTP table — never blend it into the comps range row.

6. **Capitalize corporate overhead as a standalone negative EV line**. Do not bury it in any segment, do not ignore it, and do not deduct it in both a segment and the overhead line (double-count is the most common mechanical error here).

7. **Build the equity bridge using the consolidated balance sheet** (not segment-level balance sheets). Include, on separate signed lines: + Cash / + Equity investments / + NOL value / − Total debt / − Preferred equity / − Non-controlling interests (NCI) / − Unfunded pension obligations → **Implied Equity Value** → Diluted shares (treasury stock method, TSM) → **Implied Share Price (bold)** → Current price → Premium / (Discount).

8. **Compute % of Total Combined EV per segment** and flag any segment exceeding 80% of Combined EV — at that threshold the marginal benefit of SOTP over a single-entity valuation is minimal and must be disclosed.

9. **Build sensitivity tables**: primary segment multiple × secondary segment multiple as a two-way table; if DCF is used, discount rate × terminal growth rate; optionally, conglomerate discount % × implied share price. Place the base case at the center cell of each table.

10. **Run spin-off scenario (if requested)**: model separation costs, dis-synergies, tax leakage, debt allocation to each entity, and post-separation stand-alone values. A spin-off scenario that omits dis-synergies or a debt allocation assumption is incomplete.

11. **Perform all pre-delivery sanity checks** (see Pre-Delivery Checks below) before sharing output.

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Earnings metric period | LTM | Most recently available actuals; flag explicitly if any segment uses NTM |
| Multiple range boundaries | 25th / 75th percentile of peer set | Avoids distortion from outliers while preserving peer distribution |
| Outlier peer threshold | >2× peer median | Peer at this level skews the range materially; present with / without |
| Precedent transaction multiples | Separate reference row only; never merged into comps range | Transactions reflect control premium and are not comparable to trading multiples |
| Corporate overhead treatment | Standalone negative EV line item | Ensures no double-count and full visibility to reviewers |
| Equity bridge balance sheet source | Consolidated (not segment-level) | Cash, debt, NCI, pension, and NOL exist only at the consolidated entity |
| Share count for implied price | Diluted shares via treasury stock method (TSM) | Basic share count overstates per-share value |
| Conglomerate discount sensitivity range | 0–20% | Covers the observable range of conglomerate discounts in practice |
| Segment dominance flag threshold | Single segment >80% of Combined EV | Above this level, SOTP analytical value is limited; flag and disclose |
| Peer multiple deviation flag threshold | Any segment multiple deviating >30% from peer median | Requires written justification in the model |

---

### Rules & Pitfalls

**Never:**
- **Never apply a single blended multiple to consolidated financials** — it masks value in premium segments and inflates value in weaker ones, destroying the entire analytical rationale for SOTP.
- **Never estimate segment financials via top-down ratios when self-reported segment disclosures exist** — actual disclosures are audited and defensible; constructed estimates introduce unverifiable assumptions that reviewers will immediately challenge.
- **Never bury corporate overhead inside a segment or omit it** — either approach misattributes the overhead drag and produces an inflated Combined EV that cannot be reconciled to reality.
- **Never build the equity bridge from segment-level balance sheets** — cash, debt, NCI, pension obligations, and NOL tax assets exist only at the consolidated entity; using segment figures produces an equity bridge that cannot be tied to the actual balance sheet.
- **Never use basic share count for implied share price** — it overstates per-share value and is an immediate credibility failure with any sophisticated reviewer.
- **Never apply NTM multiples to LTM financial metrics within the same segment** — mixing periods produces a mathematically inconsistent implied value; flag any cross-period use explicitly.
- **Never merge precedent transaction multiples into the trading comps range** — transactions embed a control premium; blending them inflates the high end of the range without disclosure.
- **Never count NOL value twice** — if NOL is modeled inside a segment DCF (as a tax shield), do not add it again as a positive item in the equity bridge; and conversely, if it is in the bridge, ensure it is absent from segment DCFs.
- **Never apply multiples to unadjusted EBITDA containing one-time items** — normalize (strip non-recurring charges) before applying any multiple.

**Conditional:**
- If a single segment exceeds 80% of Combined EV, flag that the SOTP structure provides limited incremental insight over single-entity valuation, and disclose this to the reader before presenting conclusions.
- If broker SOTP reports exist for the company, use them as the reference starting point; document and explain every material departure from their segment definitions, peer choices, or methodology.
- If LTM and NTM metrics are mixed across segments (unavoidable in some cases), flag every mixed-period cell in the SOTP table — do not leave mixed periods unmarked.
- If a spin-off scenario is built, it must include separation costs, dis-synergies, tax leakage, debt allocation to each resulting entity, and a post-separation stand-alone value comparison; omitting any of these four elements makes the scenario analytically incomplete.
- If a segment peer is flagged as an outlier (>2× median), present the multiple range in two versions — including and excluding the outlier — and let the user choose which to carry forward.
- If conglomerate discount is a key output, build a two-way sensitivity table with discount assumption (0–20%) against implied share price.

**Judgment:**
- Match valuation method to segment economics, not to convenience — forcing EV/EBITDA onto an unprofitable growth segment or a real-estate-heavy segment produces a meaningless implied value; choose EV/Revenue, NAV, or rNPV where those are the industry standard.
- Prefer company self-reported segment definitions over analyst-constructed reclassifications — internal definitions reflect how management allocates capital and how peers report, making comparisons cleaner.
- When a segment multiple deviates more than 30% from the peer median, provide a written rationale (higher growth, structurally different margin profile, different capital intensity) rather than silently accepting the deviation — silence reads as an error to reviewers.
- A conglomerate discount showing SOTP value above market price is an expected and analytically valid output; treat it as a key finding, not a model error, and stress-test the discount assumption in the sensitivity table.

---

### Pre-Delivery Checks

- **Verify** that segment revenues (net of inter-segment eliminations) sum exactly to consolidated revenue.
- **Verify** that segment EBITDA plus corporate overhead equals consolidated EBITDA.
- **Verify** that Combined EV equals the arithmetic sum of all segment implied EVs before subtracting corporate overhead.
- **Verify** that Adjusted Combined EV = Combined EV − capitalized corporate overhead.
- **Verify** that Implied Equity Value = Adjusted Combined EV + non-operating assets − non-operating liabilities (using the explicit equity bridge block).
- **Verify** that the implied blended SOTP multiple falls within a reasonable range relative to observable trading and transaction multiples for the company's sector.
- **Flag** any single segment exceeding 80% of Combined EV; confirm disclosure is present.
- **Flag** any segment multiple deviating >30% from its peer group median; confirm written justification is present.
- **Confirm** that NOL appears in only one location (either inside a segment DCF as a tax shield, or as a line item in the equity bridge — never both).
- **Confirm** that precedent transaction multiples, if referenced, appear only as a standalone reference row and are not blended into the trading comps range.
- **Confirm** that all multiples are applied to normalized (adjusted) metrics with one-time items stripped.
- **Confirm** that diluted share count (TSM) is used throughout; basic share count must not appear in the implied price calculation.
- **Confirm** that the sensitivity table base case sits at the center cell of each two-way table.

---

### SOTP Summary Table Structure

#### Main Table Layout

| Column | Content |
|---|---|
| Segment | Segment name (per self-reported disclosure) |
| Metric | Applicable financial metric (e.g., EBITDA, Revenue, NAV) |
| Low Multiple | 25th percentile of peer range |
| High Multiple | 75th percentile of peer range |
| Implied EV — Low | Metric × Low Multiple |
| Implied EV — High | Metric × High Multiple |
| % of Total EV | Segment midpoint EV ÷ Combined EV midpoint |

**Row order:**
1. Each operating segment (comps range rows)
2. Segment DCF range row (if applicable — labeled clearly as DCF, not merged with comps)
3. Blended range row (if any hybrid is presented — labeled and explained)
4. **Combined EV** (sum of all segment rows)
5. **(−) Corporate Overhead** (capitalized negative EV, shown as a deduction)
6. **Adjusted Combined EV**

#### Equity Bridge Block (below main table — every item on its own signed line with source notation)

```
Adjusted Combined EV (Low / High)
  + Cash and cash equivalents                [Consolidated B/S]
  + Equity investments / minority stakes     [Consolidated B/S]
  + NOL value                                [Tax footnote — only if not in segment DCF]
  − Total debt (gross)                       [Consolidated B/S]
  − Preferred equity                         [Consolidated B/S]
  − Non-controlling interests (NCI)          [Consolidated B/S]
  − Unfunded pension obligations             [Pension footnote]
  ─────────────────────────────────────────
  = Implied Equity Value (Low / High)
  ÷ Diluted shares outstanding (TSM)
  ─────────────────────────────────────────
  = **Implied Share Price (Low / High)**
    Current share price
    Premium / (Discount) to current price
```

#### Sensitivity Tables

- **Table 1 — Primary segment multiple × Secondary segment multiple** (two-way; base case at center)
- **Table 2 — Discount rate × Terminal growth rate** (if DCF used in any segment; base case at center)
- **Table 3 (optional) — Conglomerate discount % × Implied share price** (0–20% range; base case at center)

---

### Scope Boundaries

DCF handles single-entity discounted cash flow modeling and provides segment-level DCF inputs where needed; it does not produce segment-aggregated equity bridge output. Public Comps handles universe screening, multiple calculation, and trading comparable analysis at the whole-company level. The 3-Statement Model provides the integrated financial forecast from which segment operating metrics are sourced when management guidance is required.

---

## Fully Diluted Share Count

**Use when**: Calculating fully diluted shares outstanding (FDSO) for use in market cap, per-share value, EPS, or valuation inputs | **Deliverable**: Single-tab Excel workbook with formula-driven TSM build (or inline chat output if specified)

### Ask First
1. Which company and as-of date should be used?
2. Should the share price be the latest closing price, or a specific transaction/reference price?
3. Is the output format Excel (default) or chat summary?
4. Are there any known convertible notes, multiple share classes, or non-standard settlement warrants that require special handling?

### Workflow
1. **Confirm scope** — lock in company, as-of date, share price source, and output format before pulling any data.
2. **Build the General Details header block** — populate: as-of date, ticker, share price used, filing(s) sourced, currency, latest FYE, latest FQE. (Establishes audit trail before any arithmetic begins.)
3. **Identify all dilutive securities from the most recent 10-K or 10-Q** — enumerate every security type: RSU, RSA, PSU/PSA, stock options, warrants, SARs, ESPP, and any other instrument disclosed. Create one row per security type even if the dilutive impact is zero or N/A. (Omitting a row class is a compliance gap, not a space-saving measure.)
4. **Pull per-tranche data** — for each tranche record: exercise/strike price, shares outstanding, and vested/unvested split where disclosed.
5. **Apply TSM tranche by tranche** — do not aggregate tranches before computing:
   - Gross proceeds = strike price × shares in tranche
   - Shares repurchased = gross proceeds ÷ current share price
   - Net dilution = shares in tranche − shares repurchased
   - For RSU / RSA / PSU / PSA (zero cost basis): net dilution = all shares outstanding in tranche (no repurchase offset).
6. **Apply special-case logic** before summing (see Rules & Pitfalls).
7. **Sum the FDSO table** — Basic shares outstanding (BSO) + total net dilution from all tranches = Total FDSO.
8. **Run all pre-delivery checks** (see Pre-Delivery Checks section) before finalising the file.
9. **Disclose sources** — annotate each data input with a cell comment (Excel) or inline citation (chat) referencing the specific filing and page/exhibit.

#### Deliverable Tab Layout

| Block | Contents |
|---|---|
| **General Details** | As-of date · Ticker · Share price & source · Filing(s) used · Currency · Latest FYE · Latest FQE |
| **FDSO Calculation** | One row per security type; columns: tranche description · strike price · shares outstanding (vested) · shares outstanding (unvested) · gross proceeds · shares repurchased · net dilution |
| **Total FDSO** | BSO + sum of all net dilution rows = Total FDSO |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Share price | Latest closing price | Most current observable market price; confirm if a transaction reference price is needed |
| Output format | Excel, formula-driven, no hard-coded values | Preserves auditability and allows instant price-sensitivity refresh |
| Tab count | Single tab | Keeps the FDSO build self-contained as a plug-in input to downstream models |
| PSU / PSA achievement rate | 100% of target | Reflects the standard merger agreement and proxy convention; flag any non-target assumption |
| Shares included by vesting status | All outstanding (vested + unvested) | TSM captures the full potential dilution pool; already-exercised, forfeited, and expired shares are excluded |
| BSO source | Most recent as-of date (cover page vs. balance sheet — whichever is closer to the as-of date) | Cover page is typically more current than the balance sheet equity schedule |
| ESPP shares | Next purchase-date estimated issuance; if undisclosed, use authorised shares and apply the disclosed purchase-price discount to market | Reflects likely near-term dilution from the plan |

---

### Rules & Pitfalls

**Never:**
- Never substitute GAAP diluted weighted-average shares for FDSO — GAAP diluted shares are time-weighted over a reporting period and already incorporate an average-price TSM adjustment; they are not a point-in-time FDSO and will systematically understate or misstate dilution. This is the single fastest credibility killer with buy-side reviewers.
- Never produce a negative net dilution figure for any tranche — if the strike price exceeds the current share price (out-of-the-money), net dilution is exactly zero; label the tranche "anti-dilutive" and leave the dilution cell at zero.
- Never compute convertible note dilution within this workflow — convertibles require the if-converted method (interest add-back, conversion share calculation), which is materially more complex; flag every convertible for manual review and leave the dilution cell blank with a prominent flag.
- Never merge multiple warrant tranches with different strike prices into a single row when those warrants are cash-less / net-share-settled — each tranche must be computed independently and shown on its own row.
- Never double-count participating RSAs that are already included in the basic share count under the two-class method — read the filing to confirm treatment before including them in the dilution section.
- Never perform arithmetic across line items before confirming all units are on the same basis (thousands vs. millions) — convert all figures to a single unit first.

**Conditional:**
- If warrants are cash-less or net-share-settled (no cash exercise), replace the standard TSM formula with the net-settlement formula: net dilution = gross shares × (market price − strike price) / market price. Apply per tranche; do not aggregate tranches first.
- If a company has multiple share classes, display each class on a separate row and sum to Total FDSO. If the classes carry different economic rights (e.g., different per-share merger consideration), flag for confirmation before computing total equity value — a blended or class-specific price approach may be required. If the classes differ only in voting rights (standard dual-class structure), sum directly without further adjustment.
- If PSU/PSA performance achievement is disclosed at a rate other than 100% in the filing or merger agreement, use the disclosed rate and flag the deviation from the 100% default.
- If BSO data is sourced from multiple filings (e.g., basic shares from the most recent 10-Q cover page, option strike-price schedules from the prior 10-K), use the most recently available data for each input, note the specific filing source for each, and flag the cross-filing splice to the user.
- If participating RSA shares appear in the basic share count under the two-class method, confirm via filing before including them in the dilution rows to avoid double-counting.

**Judgment:**
- Prefer the cover page share count over the equity rollforward balance sheet figure when the two differ, because the cover page is updated to a more recent record date — but always reconcile both and note the discrepancy if it is material.
- Flag total dilution exceeding 15–20% of BSO as potentially anomalous even if every tranche calculation is mechanically correct — this threshold is a data-integrity prompt, not a hard cap, and the cause (large option overhang, heavy PSU grants, etc.) should be explained to the user.
- When filing data is ambiguous on vesting status, include all outstanding shares (vested and unvested) rather than restricting to vested only — erring toward full inclusion is the conservative and defensible position for valuation purposes.

---

### Pre-Delivery Checks
- Confirm the filing(s) used were the most current available as of the as-of date.
- Tie the cover-page basic share count to the shareholders' equity rollforward schedule; flag any discrepancy.
- Verify all share counts and proceeds figures are in the same unit (thousands or millions) throughout the entire tab.
- Confirm that every security type disclosed in the filing has a dedicated row in the FDSO table, including types with zero dilution or no data.
- Confirm that every out-of-the-money tranche shows net dilution of exactly zero (not blank, not negative).
- Confirm no tranche shows net dilution greater than its gross share count.
- Confirm Total FDSO ≥ BSO in all cases.
- Confirm total net dilution does not exceed 15–20% of BSO without a documented explanation.
- Confirm convertible notes are flagged for manual review and not included in the dilution sum.
- Confirm no cell in the FDSO calculation references or imports GAAP diluted weighted-average shares.
- Confirm every data input carries a source annotation (cell comment or inline citation).
- If data was sourced across multiple filings, confirm the cross-filing splice is disclosed to the user.

---

### Scope Boundaries
FDSO is a foundational input component; it does not itself produce market cap, equity value, or enterprise value. Market cap computation (price × FDSO), the equity bridge (equity value + net debt + preferred + minority interest = EV), EPS build, and comparable company / precedent transaction analysis all consume FDSO as an input and are handled by their respective valuation and modelling playbooks. Convertible note dilution (if-converted method) is explicitly out of scope here and must be handled separately.
