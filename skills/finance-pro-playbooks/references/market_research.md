# Market & Industry Research

Playbooks for understanding markets: industry primers, market sizing (TAM/SAM/SOM), competitive landscape mapping, and sector news tracking. These produce research reports (Markdown primary); load `formats/excel_standards.md` only if the user wants an Excel sizing model.

## Contents

| Task | Use when |
|---|---|
| [Industry Primer](#industry-primer) | A user needs a trends-driven synthesis of a sector or sub-sector, drawing on recent broker research, thematic reports, and earnings commentary |
| [Top-Down TAM Sizing](#top-down-tam-sizing) | The buyer universe is too broad to enumerate individually, or the engagement requires a defensible TAM/SAM/SOM for an IC memo, sell-side pitch, CIM industry section, S-1 opportunity page, board/fundraising deck, investment screen, or commercial due diligence. |
| [Bottom-Up TAM Sizing](#bottom-up-tam-sizing) | You need a defensible, auditable TAM/SAM/SOM build for a SaaS or tech-services business where the buyer universe can be enumerated |
| [Market Map](#market-map) | A client or internal team needs a structured visual map of all meaningful players in a defined market, organized by a single analytical axis |

---

## Industry Primer

**Use when**: A user needs a trends-driven synthesis of a sector or sub-sector, drawing on recent broker research, thematic reports, and earnings commentary | **Deliverable**: Structured primer (chat / PDF / slides) covering Market Overview, Recent Trends, Tailwinds/Headwinds & Key Debates, What to Watch, and two required appendices

---

### Ask First

1. **Output format** — chat, PDF, or slides?
2. **Sector / sub-sector** — how narrow or broad? (If too broad, push back with 2–4 sub-sector options before proceeding.)
3. **Focus angle** — general survey or a specific lens (e.g., fuel-price dynamics within LTL trucking)? The entire primer will be oriented around this if provided.
4. **Time horizon** — default is 3 years; confirm if the user wants the 5-year cycle view or a shorter window.
5. **Geography** — ask only if the sector has meaningful regional variation or if the request is ambiguous.

> **Scope gate**: Confirm ≥ 3 listed companies exist in the defined universe before proceeding. If the defined scope yields only 1–2 names, it is too narrow a niche — surface this immediately.

---

### Workflow

1. **Confirm all gating questions** (Steps above) before beginning any research. Do not research first and clarify later. Skip only questions whose answers are already explicit in the request.

2. **Define the company universe** — list all publicly traded companies in scope, including relevant *segments* of diversified conglomerates (not the consolidated parent). Flag any material private competitors (e.g., OpenAI / Anthropic alongside Alphabet / Meta) for inclusion in the competitive landscape section; note them as private with approximate scale. Confirm the universe reaches ≥ 3 listed names.

3. **Conduct date-first reconnaissance** — retrieve the most recent broker research by sorting *descending by date with no keyword filter first*. Anchor to the latest thinking before applying topic filters. Keyword-first retrieval surfaces relevant but stale notes and misses the newest publications — this is an explicit error mode to avoid. Prioritize top-tier investment bank coverage and top-ranked analysts for deep-covered names.

4. **Apply the full report-type mix**:
   - *Initiation reports* → structural background and competitive framing
   - *Thematic notes* → trend identification
   - *Earnings commentaries* → current state, management guidance, and consensus revision direction

   Using only initiations produces a static view; using only earnings commentaries loses the long arc. Use all three types.

5. **Check thematic data for recency** — before citing any TAM / CAGR sourced from a thematic report, check whether a more recent publication has revised it. Apply the recency floor: if the most current available figure is still materially stale (e.g., a TAM estimate ~5 years old in a fast-evolving sector), do not use it as a current figure. If it may still be directionally valid, use it but label with the as-of date.

6. **Draft the primer** in the four-section structure plus two appendices (see Content Structure below).

7. **Run all Pre-Delivery Checks** before output.

---

#### Content Structure

**Section 1 — Market Overview**
Size, structural characteristics, top 3–5 players and competitive dynamics. Source primarily from initiation reports.

**Section 2 — Recent Trends** *(core section)*
3–5 trends, ranked by industry impact. Weight toward the most recent 6–12 months even if the overall time horizon is longer. Frame each trend as *what has changed*, not *what has always been true*. Note which companies are affected and flag where analysts disagree.

**Section 3 — Tailwinds, Headwinds & Key Debates**
Separate structural from cyclical forces. The Key Debates sub-section is frequently the highest-value part of the primer — do not skip or abbreviate it. For each debate, steelman both sides (see Rules & Pitfalls).

**Section 4 — What to Watch**
Discrete, falsifiable catalysts only. Each item must include: the publishing entity or data source, release frequency, and the next expected date, so the reader can build a watch calendar. End the body of the primer here — do not add a Conclusion section.

---

#### Appendix Requirements

**Appendix A — Source Research Table**

| Bank | Analyst | Report Title | Date |
|------|---------|--------------|------|

Every claim sourced from research must be traceable to a row in this table via inline citation in the body.

**Appendix B — Ratings & Estimates Snapshot**

| Company | Rating | Price Target | Current Price | Implied Upside/Downside | Rating Skew | PT Direction (trend) | Consensus Estimates | Estimate Revision Direction | Forward Valuation vs. Historical Range |
|---------|--------|--------------|---------------|--------------------------|-------------|----------------------|---------------------|-----------------------------|----------------------------------------|

- Exclude private companies from this appendix (they appear in Section 1 only).
- Mark any company without active coverage as "Not Covered."
- Flag and resolve any inconsistency where a Buy / Outperform rating accompanies a stock price above the price target, or a Sell accompanies a price below the price target (see Rules & Pitfalls).

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|-----------|---------|-----------|
| Time horizon | 3 years (refresh each December; extend to 5 years when the user explicitly wants a cycle view) | Balances actionability with structural context |
| Minimum company universe | ≥ 3 listed companies | Fewer names produce a company note, not a sector primer |
| Recent trend weighting | Last 6–12 months | Ensures the primer reflects current dynamics, not historical description |
| Trend count | 3–5, ranked by industry impact | Prevents both superficiality and information overload |
| Primary sources | Broker / equity research reports (initiation, thematic, earnings commentary) | Goes to primary research; avoids news-wire or aggregator paraphrases of research |
| Tone | Objective, non-promotional; strip superlatives unless backed by cited data | Broker research sells; the primer does not |
| Title format | `[Sub-Sector] Industry Primer — [Date]` | Do not embed the time horizon in the title |

---

### Rules & Pitfalls

**Never:**
- **Never use consolidated parent-level ratings, price targets, or forecasts for a diversified company whose sector exposure is only one segment** — the parent metrics are dominated by unrelated businesses and will misrepresent the sector view. Scope to the relevant segment, or footnote parent-level figures as "parent-level, not sector-specific."
- **Never treat the most recent single data point as the complete story** — point-in-time data (TAM, CAGR, guidance) must be labeled with an as-of date and contextualized against the longer trend arc.
- **Never present a stale thematic TAM / CAGR as current** — if no updated publication exists and the figure is materially aged (rule of thumb: ~5 years in a fast-evolving sector), omit it rather than embed stale data in current narrative.
- **Never average or split qualitative analyst disagreements** — a both-sides summary that gives equal weight to structurally opposed views obscures the debate rather than exposing it; readers cannot act on a washed-out synthesis.
- **Never run keyword-first research retrieval** — it preferentially surfaces thematically relevant but stale notes and systematically misses the latest publications; always sort descending by date first.
- **Never reproduce source text verbatim** — always paraphrase; direct quotation of proprietary research creates legal and credibility risk.
- **Never use buy-side or sell-side superlatives** ("best-in-class," "industry-leading," "premier," "world-class") unless a cited quantitative data point supports the claim — in that case, cite the data, not the adjective.
- **Never add a Conclusion section** — the primer ends at What to Watch; a conclusion implies the analyst is recommending rather than informing.

**Conditional:**
- **If the requested sector is too broad** (e.g., "industrials," "technology"), do not produce a shallow primer — push back by proposing 2–4 sub-sector options, framed as "this will get you a sharper output."
- **If the user specifies a focus angle**, orient the entire primer around that lens rather than providing a generic sector tour. All trend selection, debate framing, and What to Watch items should connect back to that angle.
- **If a thematic TAM figure may still be directionally valid despite its age**, include it but attach a visible as-of date label and note the publication date so readers can assess staleness themselves.
- **If a Buy / Outperform rating exists where the current stock price exceeds the price target, or a Sell where price is below the price target**, flag the inconsistency explicitly in Appendix B and either resolve it with a note (e.g., PT not yet updated post-move) or footnote it — do not silently carry the inconsistency.
- **If a material private competitor exists** (e.g., a leading AI lab competing with listed hyperscalers), include it in the competitive landscape in Section 1 with a "private" label and approximate scale indicator; exclude it from Appendix B because no covering research exists.

**Judgment:**
- **Expose analyst disagreements on substantive questions (pricing power, capex cycle duration, structural vs. cyclical demand); steelman both sides** — the Key Debates section is where a primer earns credibility with experienced readers. A primer that papers over genuine disagreement is less useful than the underlying reports.
- **For quantitative disagreements** (e.g., two conflicting TAM estimates), compute an outlier-adjusted average and disclose the range and divergence — this is legitimate synthesis. For qualitative disagreements (e.g., whether demand is structural or cyclical), present both theses with their supporting logic; do not average.
- **Weight the most recent 6–12 months of broker output most heavily for trend content**, even when the stated time horizon is 3–5 years — the long arc provides context, but the primer's value is in current dynamics.
- **Cite inline for every research-sourced claim** (bank / analyst / date / report name); name banks in prose sparingly (1–2 times per paragraph for readability) but never let a claim float without a traceable citation — these are independent disciplines.
- **Prefer top-tier investment bank and top-ranked analyst coverage** when multiple sources cover the same point — depth of analytical resource correlates with reliability of channel checks and model rigor.
- **Frame every trend as "what has changed"** rather than "what is true" — static description of an industry is encyclopedia work; the primer's job is to convey momentum and inflection.

---

### Pre-Delivery Checks

- Confirm all gating questions were asked and answered before research began.
- Verify the company universe contains ≥ 3 listed names; confirm diversified-company entries are scoped to the relevant segment, not the consolidated parent.
- Verify that private competitors are flagged in Section 1 with "private" label and approximate scale, and excluded from Appendix B.
- Confirm top-tier investment bank / top-ranked analyst sources were prioritized for deeply covered names.
- Confirm all three report types (initiation, thematic, earnings commentary) are represented in the source mix.
- Verify all point-in-time data (TAM, CAGR, rating, price target, guidance) carries an explicit as-of date.
- Confirm no thematic TAM / CAGR is presented as current without first checking for a more recent revision; confirm any figure retained despite age is labeled with its publication date.
- Verify that research retrieval was conducted date-first (descending), not keyword-first.
- Confirm Recent Trends section contains 3–5 items, ranked by industry impact, weighted toward the last 6–12 months, and framed as "what has changed."
- Confirm at least one substantive analyst disagreement is explicitly exposed and steelmanned from both sides — not averaged.
- Verify all qualitative disagreements are presented as dual theses; verify any quantitative disagreements are resolved via outlier-adjusted average with range disclosed.
- Confirm every research-sourced claim has an inline citation (bank / analyst / date / report name).
- Confirm no verbatim reproduction of source text exists anywhere in the document.
- Verify all prose is free of unsupported superlatives ("best-in-class," "industry-leading," "premier," "world-class").
- Confirm Appendix B rating-vs.-price-target consistency: flag and resolve any Buy with price > PT or Sell with price < PT.
- Confirm the What to Watch section contains only discrete, falsifiable catalysts, each with publishing entity, release frequency, and next expected date.
- Confirm the document ends at What to Watch with no Conclusion section.
- Confirm the title format is `[Sub-Sector] Industry Primer — [Date]` with no time horizon embedded.
- Confirm Appendix A contains a complete source research table traceable to every cited claim.
- Confirm Appendix B marks all uncovered names as "Not Covered" and excludes all private companies.

---

### Scope Boundaries

**Earnings Update** handles single-company post-earnings analysis and management commentary synthesis — use that playbook when the request is company-specific rather than sector-wide.
**Broker Research Digest** handles "what is the Street's current view" on one or several specific companies — use that playbook when the deliverable is a consensus/sentiment summary rather than a sector trends synthesis.
**Top-Down TAM / Market Map** handles standalone market-sizing and competitive landscape mapping as independent deliverables — use that playbook when the user needs market size or structure as the primary output, not embedded context within a primer.
PDF and slides formatting are handled by their respective format playbooks; this playbook governs research content and structure only.

---

## Top-Down TAM Sizing

**Use when**: The buyer universe is too broad to enumerate individually, or the engagement requires a defensible TAM/SAM/SOM for an IC memo, sell-side pitch, CIM industry section, S-1 opportunity page, board/fundraising deck, investment screen, or commercial due diligence. | **Deliverable**: Excel workbook with 7 tabs (Assumptions / TAM / SAM / SOM / Triangulation / Sensitivity / Sources), formula-driven and fully editable; PDF or slide export only if explicitly requested.

---

### Ask First

1. **Market definition**: What is the one-sentence boundary — product/service scope, buyer profile, use case, and geography? Request the user's sign-off on this definition plus an explicit exclusion list before building anything (mandatory when the boundary is contested, involves multiple buyer types, or covers a new category).
2. **Audience and use case**: IC memo, S-1, CIM, board deck, or investment screen? (Determines scenario depth and sourcing standard.)
3. **Business model / pricing mechanism**: Subscription (accounts × ACV), marketplace (GMV × take rate), advertising (impressions × CPM), hardware (units × ASP + replacement cycle), healthcare (addressable population × penetration × frequency × net price by payer), or other? Confirm before building the TAM formula.
4. **Bottom-up data availability**: Are logo lists, customer counts, or unit-level pricing data available? If yes, run bottom-up in parallel for triangulation. If no, proceed top-down only and flag the absence.

---

### Workflow

1. **Confirm the one-sentence market definition and exclusion list** — obtain user sign-off before any build. Every downstream filter must trace back to this definition; if the boundary changes, rebuild from scratch. *(Prevents scope drift that invalidates all subsequent math.)*

2. **Layer and evaluate sources** — classify every source on a five-tier scale:
   - Tier 1: regulatory filings, official statistics
   - Tier 2: audited third-party research (paid reports)
   - Tier 3: reputable industry associations
   - Tier 4: sell-side / analyst estimates
   - Tier 5: web aggregators / secondary compilations
   Assign H/M/L confidence to each input. Flag any key input with only a single source. Apply date-stamp to every source and check against freshness windows (see Defaults). *(Sourcing quality drives the width of Sensitivity intervals; do this before touching numbers.)*

3. **Build TAM** — apply the pricing formula confirmed in Ask First (Step 3). Segment into enterprise / mid-market / SMB before applying ARPU; do not blend a single ARPU across tiers. For forward years, apply segmented CAGRs (not a single static roll) and decompose growth into real (volume) and price components. Record the raw source figure, the explicit discount applied, and the adjusted figure in three adjacent cells — never bury the haircut. Flag: TAM > 2× reported industry revenue → boundary is too wide; CAGR > 25% → requires explanation.

4. **Build SAM — one row per filter, explicit % retained** — apply filters in this sequence (adjust for market): geography → product fit → customer size/segment → regulatory eligibility → channel reach. Each filter row must name the specific buyers being excluded (e.g., "exclude government entities — procurement cycle incompatible with SaaS ACV"); a confidence haircut ("assume 70% of TAM") with no named buyers is not a valid filter and must be moved to Sensitivity. Every filter row shows: filter name | mechanism | % retained | source | confidence. Flag any retained % outside 25–90%.

5. **Build SOM — decompose win rate into named drivers** — do not use a flat "take 1% of SAM." Structure as:
   `SOM = SAM × win rate`
   Decompose win rate into individually adjustable cells: competitive structure | GTM capacity | channel reach | switching friction. Derive each driver from market characteristics, not from a fixed bucket. Cross-check against the comp set: a win rate > 70% in a market with strong regional incumbents must be flagged. Build a SOM ramp table showing Year 1–5 progression.

6. **Apply the competitor-revenue reality floor** — sum known competitor revenues: this is the minimum revenue already transacting within SAM. `SAM < sum of competitor revenues` → filters are too tight; revisit Step 4. `SOM > largest single competitor's revenue` → implied share is aggressive; flag prominently.

7. **Triangulate against bottom-up** — if bottom-up data exist, run the parallel build and compare. A triangulation ratio > 3× requires a full reconciliation before proceeding; do not average without explaining the gap. If bottom-up data are unavailable, note this explicitly in the Sources tab. *(Top-down is often used precisely because bottom-up data are unobtainable — absence is normal, but must be disclosed.)*

8. **Apply analog-market fallback for unanchored inputs** — when penetration rate, win rate, or share has no direct source, calibrate using 2–3 structurally similar analog markets. Label these inputs Low confidence, widen their Sensitivity ranges, and document the analogs. Never leave an input as N/A or block the build.

9. **Build Sensitivity table** — vary the two or three highest-impact inputs (typically CAGR, key SAM filter %, win rate). Produce Bear / Base / Bull scenarios with a mini-funnel for each. Any input that failed the "named buyers" test in Step 4 must appear here as a Sensitivity lever, not in the base SAM.

10. **Populate Sources tab** — for each source record: name | title | publisher | publication date | confidence tier | inputs supported | URL. Flag sources outside the freshness window.

11. **Run pre-delivery checks** (see Pre-Delivery Checks section).

---

#### Deliverable Structure

| Tab | Contents |
|---|---|
| **Assumptions** | One-sentence market definition, exclusion list, pricing formula, segment definitions, CAGR inputs with source and confidence, all explicit discounts |
| **TAM** | Segmented build (enterprise / mid / SMB), pricing formula cells, real vs. price growth split, flag cells |
| **SAM** | Filter table: filter name / mechanism / % retained / source / confidence; highlight rows outside 25–90% retained |
| **SOM** | Win rate decomposition table (one named driver per row), SOM ramp Year 1–5 |
| **Triangulation** | Bottom-up figure (or explicit "not available" note), top-down figure, ratio, reconciliation notes |
| **Sensitivity** | Bear / Base / Bull scenario table, mini-funnel per scenario, inputs that failed "named buyers" test |
| **Sources** | Full source log per above |

**Required visual**: TAM → SAM → SOM funnel chart with absolute values and % of TAM labeled at each step; include in the SAM or SOM tab.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Forecast horizon | 5 years | Standard IC and CIM convention |
| CAGR methodology | Segmented CAGR per tier | Static single-year roll misrepresents inflection markets |
| Source freshness window — most categories | 24 months | Balances data availability against staleness |
| Source freshness window — fast-moving (AI, crypto, etc.) | 6–12 months | Category dynamics change faster than standard research cycles |
| Source freshness window — industrial / regulated | 36+ months | Slower structural change justifies older data |
| Minimum independent sources per key input (incl. CAGR) | 2 | Single-source inputs flagged H/M/L; single source alone is flag-worthy |
| Third-party CAGR discount | 100–300 bps reduction | Thematic research CAGRs are systematically optimistic; record the adjustment and rationale |
| SAM filter retained % highlight threshold | Outside 25–90% | Extreme retention signals filter is either trivially loose or unreasonably tight |
| Triangulation ratio threshold requiring reconciliation | > 3× | Top-down and bottom-up divergence beyond 3× is not explainable by methodology alone |
| Scenario count | 3 (Bear / Base / Bull) | Single-scenario output is not defensible in IC or DD settings |
| Win rate cap requiring flag | > 70% in markets with named regional incumbents | Implies implausible competitive displacement |
| SOM flag threshold | > 50% of SAM | Implies dominant share from a standing start; requires explicit justification |
| TAM flag threshold | > 2× Tier 1–reported industry revenue | Signals boundary is drawn too broadly |
| CAGR flag threshold | > 25% | Triggers mandatory sourcing and decomposition note |
| New category treatment | Dual-view: substitution + expansion | New categories have no single credible anchor; both views required |

---

### Rules & Pitfalls

**Never:**
- **Never accept a SAM filter expressed as a confidence haircut** ("conservative 70%," "risk-adjusted 60%") without naming the specific excluded buyers — this rewords the number without adding information. A filter that cannot name the removed buyers does not belong in the base SAM; move it to Sensitivity.
- **Never set SAM% as a free parameter** ("assume 20% of TAM") — SAM must be derived arithmetically from explicit, sequential filters, each with a documented % retained and source. An assumed SAM% is a disclosure failure.
- **Never use a flat share grab for SOM** ("capture 1% of SAM") — SOM must equal SAM × win rate, with win rate decomposed into named, individually editable drivers (competitive structure, GTM capacity, channel reach, switching friction).
- **Never bury source discounts inside another cell** — the reader must see: raw source figure | explicit discount % | adjusted figure. Hidden haircuts destroy auditability.
- **Never apply a blended ARPU across customer tiers** — enterprise / mid-market / SMB ASPs diverge materially; blending overstates revenue for small customers and understates it for large ones.
- **Never double-count** — if a global report already includes a geography, do not stack a separate regional report on top; net out overlapping categories (e.g., endpoint security vs. network security); verify that regional segments sum to the global figure.
- **Never equate GMV with revenue in marketplace models** — TAM (revenue) = GMV × take rate; disclose GMV and take rate separately.
- **Never roll a static current-year figure forward without decomposing growth** — apply segmented CAGRs; flag any forward projection with implied price inflation > 5% in a non-inflationary category.
- **Never output N/A or block the build when a direct source is unavailable** — apply the analog-market fallback (2–3 structurally similar markets), label Low confidence, widen Sensitivity, and document the analogs.
- **Never begin building before the market definition is signed off** — a contested or ambiguous boundary renders the entire model unreliable and forces a full rebuild.

**Conditional:**
- **If the category is new (no established market revenue data)**, build both a substitution view (cannibalized existing spend, anchored to a specific data set — e.g., Uber modeled against city taxi medallion revenues) and an expansion view (net-new demand, explicitly modeled elasticity/latent demand — not a multiplier applied without basis). Present both views side by side; do not merge them.
- **If SOM exceeds the largest single competitor's revenue**, flag as aggressive implied share and require explicit justification in the Assumptions tab before delivery.
- **If SAM is smaller than the sum of known competitor revenues**, the filters are too tight — revisit Step 4 and loosen or re-justify each filter.
- **If TAM exceeds Tier 1-reported industry revenue by more than 2×**, the market boundary is too broad — tighten the one-sentence definition before proceeding.
- **If the triangulation ratio (top-down ÷ bottom-up) exceeds 3×**, stop and reconcile before delivering; do not average the two figures without a documented explanation of the gap.
- **If a source is outside its freshness window**, flag it in the Sources tab and, if no fresher source exists, widen the Sensitivity range for all inputs it supports.
- **If the forward CAGR is sourced from a single third-party research report**, apply a 100–300 bps downward adjustment for systematic optimism, document the rationale, and flag as single-source.
- **If the market has strong regional incumbents**, cap the unadjusted win rate at 70% and require explicit documentation of displacement mechanism for any assumption above that level.

**Judgment:**
- **Prefer named-buyer exclusion logic over mechanical filter sequences** — the intellectual test for any SAM filter is whether a skeptical IC reviewer could identify the excluded segment in an independent data source. If they cannot, the filter is not defensible.
- **Calibrate source freshness to market velocity, not calendar convention** — a 24-month-old report on industrial HVAC may be perfectly fresh; a 24-month-old report on generative AI infrastructure is likely obsolete.
- **Use analog markets as a calibration check, not a substitution for primary research** — analog-market fallback produces a Low-confidence anchor that widens Sensitivity; it is a floor for credibility, not a primary input.
- **Treat competitor revenue as a built-in sanity mechanism** — assembling the comp set revenue sum early (Step 6) constrains both the SAM and the SOM before you finalize either; this is faster and more convincing than ex-post rationalization.
- **When two sources produce materially different TAM figures**, do not average them silently — document both, explain the definitional difference, and select one as base with the other as a Sensitivity bound.
- **Run top-down and bottom-up in parallel whenever bottom-up data exist** — two independent methodologies converging below 3× is the strongest credibility signal available; divergence above 3× is itself a finding worth disclosing.

---

### Pre-Delivery Checks

- Confirm the one-sentence market definition and exclusion list are in the Assumptions tab and match what the user signed off on.
- Verify every SAM filter row contains: mechanism | named excluded buyers | % retained | source | confidence — flag any row missing named buyers and move it to Sensitivity if unresolved.
- Verify no SAM filter's % retained is set as a free parameter; trace every retained % to a calculation from explicit filter logic.
- Confirm SAM ≥ sum of all identified competitor revenues; if not, document the filter adjustment.
- Confirm SOM ≤ largest single competitor revenue, or flag with written justification if exceeded.
- Confirm TAM ≤ 2× Tier 1-reported industry revenue, or flag boundary-too-wide.
- Verify SOM is ≤ 50% of SAM, or flag and justify.
- Verify no CAGR input exceeds 25% without a decomposition note and ≥ 2 sources.
- Confirm every key input (including all CAGRs) has ≥ 2 independent sources; flag any single-source inputs.
- Confirm all third-party CAGRs have an explicit 100–300 bps discount applied and documented.
- Confirm every source has a date-stamp and has been checked against the applicable freshness window (6–12 months: fast-moving; 24 months: general; 36+: industrial/regulated); flag stale sources.
- Verify raw source figure | explicit discount | adjusted figure are in three visible adjacent cells for every discounted input — no buried haircuts.
- Confirm enterprise / mid-market / SMB are segmented separately before ARPU is applied — no blended ARPU across tiers.
- For marketplace models, confirm TAM formula is GMV × take rate with each disclosed separately.
- Confirm forward projections decompose real (volume) growth from price growth; flag any non-inflationary category showing implied price inflation > 5%.
- Confirm no double-counting: global and regional reports do not overlap; overlapping categories are netted.
- Verify the triangulation ratio is < 3×; if > 3×, confirm a reconciliation note is present.
- Confirm Bear / Base / Bull scenarios and mini-funnels are present in the Sensitivity tab.
- Confirm the TAM → SAM → SOM funnel visual is present with absolute values and % of TAM labeled.
- Confirm the Sources tab is complete: name | title | publisher | date | confidence tier | inputs supported | URL for every source.
- Confirm all flag cells are active: CAGR > 25%, SOM > 50% of SAM, TAM > 2× industry revenue, single-source inputs.
- For new categories, confirm both substitution view and expansion view are present side by side.
- If analog-market fallback was used, confirm inputs are labeled Low confidence and Sensitivity ranges are widened accordingly.

---

### Scope Boundaries

The **Bottom-Up TAM** playbook handles sizing from logo enumeration × ASP × penetration rate upward; use it when individual customer lists or unit-level pricing data are available, and run it in parallel with this playbook for triangulation. The **Private Company Screen** playbook handles enumeration of competitor and target company lists. The **Market Map** playbook handles visual competitive landscape layouts. This playbook is responsible only for the top-down funnel from public market data to a defensible TAM/SAM/SOM.

---

## Bottom-Up TAM Sizing

**Use when**: You need a defensible, auditable TAM/SAM/SOM build for a SaaS or tech-services business where the buyer universe can be enumerated | **Deliverable**: Excel workbook with tabs for Market Definition, Logo Universe, Penetration & Pricing, TAM/SAM/SOM Summary, Greenfield & Switching Opportunity, Scenarios/Sensitivity, and Sources

---

### Ask First

1. **Competitive position**: Is the subject an incumbent or a new entrant? What is the category lifecycle — emerging, growth, or mature?
2. **Audience & decision**: Who is this for (IC, board, due diligence), and what decision does it support?
3. **Segment & geography**: What SaaS sub-vertical? Single region or multi-region?
4. **Pricing model**: Flat per-logo, per-seat, usage-based, modular (with attach rates), or hybrid? Do not default to flat — confirm before building.

---

### Workflow

1. **Define market scope and build the header table** — document category, geography, subject's competitive position, and audience. This anchors every assumption that follows and makes the market definition auditable.

2. **Build the logo universe by tier** — enumerate all potential buyer logos, segmented at minimum by Enterprise vs. SMB (different ASPs require separate tiers). Hard-code total logos as the universe constant. Deduplicate across tiers and geographies (e.g., strip S&P 500 names out of a Russell 2000 count; no cross-region overlap).

3. **Build penetration assumptions** — for each tier, model two states: current penetration and forecast penetration at each year-end. Add a **"% of maximum penetration"** column showing how far along the adoption curve each segment is at the forecast terminal year; amber-flag any segment below 50% (signals long runway). Cap maximum penetration realistically — flag anything above 85%; flag 100% as unrealistic.

4. **Build the pricing model inputs** — apply the confirmed pricing model (per-seat requires an average seats-per-logo assumption; usage-based requires average consumption per logo; modular requires individual attach rates and ASPs per module). Never default to flat per-logo without confirmation.

5. **Calculate ASP and TAM$** — `TAM$ = total logos × ASP` per tier, summed across tiers. Apply regional ASP discounts where applicable (see Defaults). ASP should generally increase year-over-year; flat or declining ASP requires explicit confirmation.

6. **Calculate growth and CAGR** — derive implied TAM and SAM CAGRs from the build. Cross-validate the bottom-up SAM CAGR against published Gartner/IDC consensus market CAGR; if the bottom-up figure exceeds the public benchmark by more than 1.5×, flag immediately — assumptions are either too aggressive or the market definition is too narrow.

7. **Calculate SAM** — `SAM = logos × penetration rate (current and forecast)`. SAM logo count must be a formula linked to penetration rates — never hard-code SAM logos. SAM ≠ TAM; SAM ≠ SOM.

8. **Calculate SOM and win rate** — `SOM = SAM × win rate`. Build SOM as a separate layer; SOM (win-rate-adjusted) must never be conflated with maximum penetration.

9. **Frame the opportunity: Greenfield and Switching** — split total opportunity into two distinct sources:
   - **Greenfield** = (forecast-year SAM logos − current SAM logos) ÷ N years (annualized new-logo opportunity)
   - **Switching jump balls** = (already-penetrated logos − subject's own installed base) × switching rate; floor at zero — if subject's installed base already exceeds the remaining penetrated-logo pool, the switching pool is zero. Omitting the installed-base subtraction causes double-counting.

10. **Build scenarios** — Base / Upside / Downside, stressing maximum penetration, ASP CAGR, and win rate each by ±25%.

11. **Build the Sources tab** — log every key assumption with its source document or data provider and a **High / Med / Low** confidence rating. Explicitly flag any input with weak sourcing.

#### TAM / SAM / SOM Formula Reference

| Layer | Formula |
|---|---|
| TAM$ | Total logos (by tier) × ASP (by tier), summed |
| SAM | TAM logos × penetration rate (current or forecast) |
| SOM | SAM × win rate |
| Greenfield (ann.) | (Forecast SAM logos − Current SAM logos) ÷ N |
| Switching pool | (Penetrated logos − Subject installed base) × switching rate; min = 0 |

#### Multi-Region Build Requirements (apply when geography > 1 region)

- Build separate logo / penetration / ASP inputs for each region.
- Apply regional ASP discount factors (see Defaults).
- Use region-specific penetration curves; do not copy the North America curve across regions.
- Normalize all regions to a single currency (FX-adjust to USD or reporting currency).
- Include a **global consolidation row** that ties to the sum of all regional outputs with zero cross-region duplication.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Forecast horizon | 5 years; all CAGRs and annualized figures flex on this variable | Standard SaaS market-sizing period; long enough to capture S-curve inflection |
| Win rate (SOM) | 20–30% for competitive markets | Reflects realistic market-share capture absent dominant positioning |
| Scenario stress | Base / Upside / Downside; max penetration, ASP CAGR, and win rate each ±25% | Surfaces assumption sensitivity without over-engineering |
| Regional ASP discount vs. North America | EMEA 90% / APAC 70% / LATAM 60% | Reflects typical SaaS contract-value differentials by geography |
| Pricing model | Confirm before building — no default to flat per-logo | Flat-per-logo assumption is a known credibility failure mode |

---

### Rules & Pitfalls

**Never:**
- Never use a single top-down headline market number as the sole TAM basis — it is non-auditable, non-decomposable, and signals hockey-stick thinking to any IC reviewer. The entire value of this approach is the logo × ASP × penetration build.
- Never hard-code SAM logo counts — SAM logos must be a formula linked to penetration rates; hard-coding SAM decouples it from assumptions and breaks scenario logic.
- Never conflate SOM with maximum penetration — SOM is win-rate-adjusted and will always be smaller than maximum-penetration SAM; building them as the same line destroys analytical credibility.
- Never omit the subject's own installed base from the switching-pool calculation — counting already-owned logos as switching opportunity double-counts the addressable pool and inflates SOM.
- Never default ASP to flat per-logo without confirming the pricing model — per-seat, usage, and modular structures each require distinct unit assumptions (seats per logo, consumption per logo, or attach rate per module).

**Conditional:**
- If the bottom-up SAM CAGR exceeds published Gartner/IDC market CAGR by more than 1.5×, flag in red before delivery — either the penetration or ASP assumptions are too aggressive, or the market definition is narrower than the benchmark and requires reconciliation.
- If penetration in any segment exceeds 85% at any forecast year, flag as aggressive; if it reaches 100%, flag as unrealistic and require explicit justification.
- If any segment's CAGR exceeds 25%, require explicit documentation of the growth driver before delivery — this threshold triggers a red/warning flag cell.
- If the win rate assumption exceeds 30%, require a stated rationale (e.g., documented market leadership, sole-source contract position); 30% is the default ceiling for competitive markets.
- If ASP is flat or declining year-over-year, confirm with the user — flat or declining ASP is valid in commoditizing markets but must be an explicit assumption, not an oversight.
- If the switching pool computes to zero or negative (subject installed base ≥ remaining penetrated logos), floor at zero and flag — do not carry a negative switching opportunity.
- If the engagement scope is multi-region, build independent inputs per region and include a global consolidation tie-out; do not extrapolate a single-region model by multiplier.

**Judgment:**
- Prefer segmenting by at least two buyer tiers (Enterprise and SMB) even when the client has not requested it — the ASP differential between tiers is almost always material, and a single blended ASP obscures the true TAM shape.
- When confidence ratings on key inputs are predominantly Medium or Low, surface this explicitly in the Sources tab and in the IC-ready summary — a defensible number with transparent uncertainty is more valuable than a precise-looking number with hidden assumptions.
- Run bottom-up and top-down TAM in parallel whenever possible — triangulating both directions is the strongest defense of the output number; neither method alone is sufficient for a high-stakes IC or diligence context.
- Penetration growth rate should generally not exceed overall market growth rate — if it does, that is a useful sense check and warrants a flag.

---

### Pre-Delivery Checks

- Confirm maximum penetration is ≤85% in all segments; flag anything above 85%; hard-flag 100% as requiring explicit justification.
- Confirm bottom-up SAM CAGR ÷ public consensus CAGR ≤ 1.5×; flag and document if breached.
- Confirm ASP increases year-over-year in all tiers; if flat or declining, obtain and document explicit confirmation.
- Confirm any segment with CAGR >25% has a documented growth driver; flag the cell in red.
- Confirm total logo count is hard-coded as the universe constant; confirm SAM logo count is a formula linked to penetration, not hard-coded.
- Confirm per-seat models include an average seats-per-logo assumption benchmarked to industry; confirm usage-based models include an average consumption-per-logo assumption benchmarked to industry; confirm modular models include per-module attach rates and ASPs.
- Confirm multi-region builds have a global consolidation row that ties exactly to the sum of all regional subtotals with zero cross-region duplication.
- Confirm win rate >30% has a documented rationale; flag all unsourced win rate assumptions above 40% in red.
- Confirm every key input in the Sources tab has a High / Med / Low confidence rating and a traceable source; flag all Low-confidence inputs explicitly.
- Confirm greenfield and switching opportunity are built as separate line items; confirm the switching pool has a zero floor and that the subject's own installed base has been subtracted.
- Confirm scenario table stresses maximum penetration, ASP CAGR, and win rate each at ±25% across Base / Upside / Downside.
- Confirm flag cells are active: CAGR >25% in red; unsourced win rate >40% in red; penetration at 100% in red; segments below 50% of maximum penetration in amber.

---

### Scope Boundaries

Top-Down TAM handles cases where the buyer universe is too broad to enumerate or where an industry-overview funnel (published market → TAM → SAM → SOM) is the primary deliverable; use that playbook when bottom-up logo enumeration is not feasible. For the strongest output, run both playbooks in parallel and triangulate. Competitive benchmarking and win-rate substantiation beyond default ranges are handled by the Competitive Positioning playbook.

---

## Market Map

**Use when**: A client or internal team needs a structured visual map of all meaningful players in a defined market, organized by a single analytical axis | **Deliverable**: PowerPoint workbook, exactly 3 sections (title slide / landscape slide / appendix)

---

### Ask First
1. **Market definition & geography** — What is the market scope (e.g., "vertical construction SaaS in North America")? Is it narrow enough to form a coherent universe, yet wide enough to support 5–8 substantive sub-sectors?
2. **Starting material** — Is there an existing company list (Option A), or must the universe be built from scratch (Option B)?
3. **Organizing axis** — What single axis should segment the market (e.g., industry served, value-chain position, buyer persona, product type)? Present a recommendation and obtain Gate 1 sign-off before proceeding.
4. **Reference companies** — Are there specific companies that must appear with a highlight border on the landscape and in the appendix?

---

### Workflow

1. **Clarify inputs and obtain Gate 1 sign-off** — Confirm market definition, geography, starting material (Option A or B), and the proposed organizing axis. Document the agreed axis in writing before any build work begins. *(Gate 1 locks scope and axis; rework at Step 3 is expensive.)*

2. **Build the company universe** — Cast the net wide across multiple sources (databases, press, trade coverage, referrals). Apply a **lean-toward-inclusion** default: add borderline companies rather than exclude them. Flag if the universe exceeds 100 companies (tighten market definition or geography — do not raise a size threshold) or falls below 10 (flag and recommend broadening scope). Disclose any screening criteria applied.

3. **Define sub-sectors and obtain Gate 2 sign-off** — Derive sub-sector labels from the actual universe, not from a blank template. Default to **5–8 sub-sectors**. Apply the MECE test (mutually exclusive, collectively exhaustive, no "Other" bucket, comparable scale — no sub-sector with 30 companies alongside one with 2). Present sub-sector labels to the user and obtain Gate 2 sign-off before placing any company. *(Gate 2 lets the user validate the analytical framework against reality before visual assembly begins.)*

4. **Place companies** — Assign each company to its **primary sub-sector only; a logo may never appear in two boxes**. For companies spanning multiple sub-sectors, place in the primary box and note secondary positioning in the appendix description. If **more than 20% of companies span sub-sectors, the axis is wrong** — return to Step 3. When a box is full, select logos by **fit-first, size-second**: a pure-play in that sub-sector outranks a four-segment conglomerate. Preserve all companies in the appendix; mark those omitted from the landscape as "not shown due to space" in their description. Apply internal sub-groupings within a sub-sector only where genuine internal structure exists — this is a per-segment option, not a uniform secondary axis.

5. **Apply the logo-cover test** — Redact all logos. If the framework alone cannot communicate an interesting structural insight about the market, the axis or sub-sectors must be rebuilt. Do not default to the most generic "by sub-type" segmentation; choose the axis that tells the sharpest story. *(This is the single most reliable quality gate for axis selection.)*

6. **Assemble the .pptx** — Build exactly 3 sections:
   - **Section 1 — Title slide**: market name, geography, "as of [date]", sources footer.
   - **Section 2 — Landscape slide**: single-axis grid; sub-sector box sizes may vary with company count (do not force equal sizing; preserve whitespace; do not crowd logos); reference companies highlighted with a distinct border; "as of [date]" and sources footer.
   - **Section 3 — Appendix**: one section per sub-sector (overflow paginated with Roman numerals); rows sorted by estimated revenue descending, NAs at the bottom; sub-sector header color mirrors the corresponding landscape box color; reference companies highlighted; each page carries "as of [date]" and a footer listing **only the sources actually used**. Public companies: include ticker. Private company revenues: ranges only, never point estimates.

   Do **not** add an executive summary, market sizing, why-now narrative, next-steps slide, prioritization tiers, outreach status, or any content outside these 3 sections.

7. **Run sanity checks** — See Pre-Delivery Checks below before sharing any version.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Deliverable format | .pptx, exactly 3 sections | Scope boundary: visual landscape only |
| Sub-sector count | 5–8 | Fewer lacks analytical texture; more fragments the story |
| "Other" bucket | Never permitted | Violates MECE exhaustiveness; signals axis failure |
| Sub-sector scale comparability | No sub-sector may be >5× the size of another | Comparable ranges preserve visual and analytical integrity |
| Universe size — upper trigger | >100 companies → tighten market definition or geography, disclose screening | Avoids inflating scope to solve MECE pressure |
| Universe size — lower trigger | <10 companies → flag and recommend broadening | Landscape with <10 companies is not analytically useful |
| Universe inclusion bias | Lean toward inclusion; add borderline companies | MECE pressure is solved via primary-placement + appendix notation, not by shrinking the universe |
| Multi-sector companies | Primary sub-sector placement only; secondary noted in appendix description | Logo duplication destroys MECE and confuses readers |
| Logo sourcing | Official brand assets only; if unavailable, use clean typeset company name | Fabricated or approximated logos are a legal and credibility risk |
| Unverifiable data fields | Display as "NA" | Fabrication is not recoverable; revenue and headcount are the most commonly invented fields |
| Private company revenue | Range only, never a single-point estimate | Point estimates for private companies imply precision that does not exist |
| Public companies | Include when analytically meaningful; mark ticker in appendix | Exclude only when scope is explicitly private-only |
| Logo selection when box is full | Fit-first (pure-play in that sub-sector), size-second | Size-based selection systematically misrepresents sub-sector composition |
| Company descriptions | Factual language only | Marketing descriptors ("leading," "premier," "trusted") are not verifiable and reduce credibility |
| Appendix sort order | Estimated revenue descending; NAs at bottom | Consistent, reviewer-legible ordering |
| Appendix overflow | Roman numeral pagination (e.g., Appendix I, II) | Applied only when a sub-sector's companies exceed one slide |
| Sources footer | List only sources actually used | Padding a footer with unused sources is misleading |
| Color linkage | Each sub-sector box color mirrored exactly in the corresponding appendix section header | Visual tie-out confirms appendix maps to landscape |
| Date stamp | "as of [date]" on landscape slide and every appendix page | Markets move; undated slides lose validity immediately |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate or estimate data to fill a cell** — use "NA" for any field that cannot be verified from a real source. Revenue and headcount are the two fields most frequently invented; they are also the two most frequently checked by reviewers.
- **Never display private company revenue as a point estimate** — always show a range, because precision implies source quality that does not exist for private financials.
- **Never place a company logo in more than one sub-sector box** — duplication signals that the axis is wrong and makes the landscape unreadable as an analytical document.
- **Never include an "Other" bucket** — it is proof that the axis does not achieve MECE exhaustiveness and must be redesigned.
- **Never generate, approximate, or alter a logo** — use official brand assets only; if unavailable, substitute a clean typeset name. Fabricated brand assets create legal exposure and are immediately visible to clients.
- **Never use marketing descriptors** ("leading," "premier," "trusted," "best-in-class") in company descriptions — they are unverifiable and signal that the description was copied from a website rather than independently assessed.
- **Never select logos for the landscape by company size or brand recognition when a box is full** — doing so systematically overstates the presence of diversified players and understates pure-plays, distorting the sub-sector story.
- **Never add content outside the 3 defined sections** — no executive summary, market sizing, why-now, next-steps, outreach status, or prioritization tiers. Those deliverables belong to adjacent playbooks (see Scope Boundaries).
- **Never proceed past Step 1 without Gate 1 sign-off, or past Step 3 without Gate 2 sign-off** — building the landscape on an unvalidated axis or unvalidated sub-sector labels forces a full rebuild if the user disagrees.

**Conditional:**
- **If more than 20% of companies span multiple sub-sectors**, the organizing axis is wrong — return to Step 3, propose a revised axis, and re-obtain Gate 2 sign-off before proceeding.
- **If the universe exceeds 100 companies**, tighten the market definition or geography (do not raise a minimum-size threshold to exclude companies); disclose the screening criteria applied in the sources footer.
- **If the universe falls below 10 companies**, flag the issue explicitly and recommend broadening the market definition or geography before proceeding.
- **If a sub-sector has genuine internal structure** (e.g., two clearly distinct workflow stages within one segment), apply an internal sub-grouping within that sub-sector only — do not propagate it as a uniform secondary axis across all sub-sectors.
- **If a company is omitted from the landscape because a box is full**, mark it in the appendix description as "not shown on landscape due to space" so the tie-out count remains accurate.
- **If the user supplies a pre-existing company list (Option A)**, still supplement with independent research to ensure the universe is complete before defining sub-sectors.
- **If scope is explicitly private-company-only**, exclude public companies; otherwise include them when analytically meaningful and mark their tickers in the appendix.

**Judgment:**
- **Choose the organizing axis that tells the sharpest structural story, not the most generic one.** "By sub-type" is almost always the default and almost never the most insightful. Use the industry axis conventions below as a starting point, then override based on what makes the market structure legible.
- **Use the logo-cover test as the primary quality gate for axis selection**: if redacting all logos leaves a framework that cannot independently communicate an interesting insight about market structure, the axis must be rebuilt regardless of how tidy it looks.
- **Solve MECE pressure through primary-placement + appendix notation, not by shrinking the universe** — leaning toward inclusion produces a more credible and more useful landscape; an artificially small universe makes the map look incomplete to anyone who knows the space.
- **Market definition should be "just right"**: narrow enough to form a coherent, bounded universe; wide enough to generate 5–8 substantive sub-sectors. "Vertical construction SaaS" is well-scoped; "fintech" is too broad; "general-contractor on-site operations software" is too narrow.
- **Sub-sector box sizes need not be equal** — let them reflect the actual distribution of companies. Forcing equal-size boxes at the expense of whitespace or logo legibility is a visual error, not a design virtue.

---

### Pre-Delivery Checks

- **Confirm** the landscape uses a single organizing axis and that axis is stated explicitly in the slide title.
- **Confirm** sub-sector count is between 5 and 8 inclusive and no "Other" bucket exists.
- **Confirm** all sub-sectors are mutually exclusive (no company appears in two boxes) and collectively exhaustive (every company in the universe appears in exactly one sub-sector).
- **Confirm** sub-sector scales are comparable — no sub-sector is more than approximately 5× the size of another.
- **Confirm** no company logo appears more than once across the entire landscape slide.
- **Confirm** the count of companies on the landscape slide equals the cumulative count across all appendix pages (tie-out).
- **Confirm** every sub-sector box color on the landscape is mirrored exactly in the corresponding appendix section header.
- **Confirm** reference companies carry a highlight border on the landscape slide and in their appendix row.
- **Confirm** all logos are sourced from official brand assets; any company without a retrievable logo is represented by a clean typeset name.
- **Confirm** no company description contains marketing language ("leading," "premier," "trusted," or equivalent).
- **Confirm** all unverifiable data fields display "NA."
- **Confirm** all private company revenue figures are ranges, not point estimates.
- **Confirm** public company tickers are present in the appendix (unless scope is private-only).
- **Confirm** appendix rows within each sub-sector are sorted by estimated revenue descending, with NAs at the bottom.
- **Confirm** Roman numeral overflow pagination is applied only where a sub-sector's companies exceed one slide.
- **Confirm** "as of [date]" appears on the landscape slide and on every appendix page.
- **Confirm** sources footers on the landscape slide and every appendix page list only sources actually used.
- **Confirm** the deliverable contains exactly 3 sections and no additional slides (no executive summary, market sizing, why-now, next-steps, or outreach content).
- **Run the logo-cover test**: redact all logos and verify that the framework alone communicates a clear and interesting structural insight about the market.
- **Confirm** that if any internal sub-groupings are present within a sub-sector, every company in that sub-sector is assigned to exactly one internal group.
- **Confirm** companies omitted from the landscape due to box capacity are marked "not shown on landscape due to space" in their appendix description.

---

### Industry Axis Conventions (starting points, not rules — override when context warrants)

| Market Type | Default Starting Axis |
|---|---|
| Vertical SaaS | Industry served; internal sub-grouping by workflow stage |
| Workflow-heavy verticals (construction, healthcare, logistics) | Value-chain position |
| Horizontal software | Buyer persona / purchasing role |
| Fintech | Financial product type |
| Marketplace | What is being transacted + which side of the two-sided market |
| Fragmented services / roll-up plays | Service type + geography |
| Energy / industrials | Upstream / midstream / downstream |
| Healthcare | Provider / payer / supply chain; for biopharma, indication + regulatory stage |

---

### Scope Boundaries

This playbook produces a visual landscape and sub-sector appendix only — it does not generate prioritization tiers, outreach status, or deep company financial profiles (use the **Private Company Screen** playbook for target lists with detailed data). It does not produce a comparable-company group for valuation (use the **Peer Identification** playbook). It does not produce a buyer universe with payment-capacity analysis (use the **Buyer List** playbook).
