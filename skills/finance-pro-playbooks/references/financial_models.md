# Financial Models

Playbooks for building and maintaining operating and transaction models: 3-statement forecasts, merger math, synergies, IPO models, and auditing/editing existing workbooks. Always load `formats/excel_standards.md` and `formats/metric_disambiguation.md` alongside this file when producing Excel output.

## Contents

| Task | Use when |
|---|---|
| [3-Statement Model](#3-statement-model) | Building a fully integrated income statement, balance sheet, and cash flow statement for a company |
| [Merger Model (Accretion/Dilution)](#merger-model-accretiondilution) | Sizing EPS accretion/dilution impact of a proposed acquisition for buy-side analysis, pitch book, or fairness opinion |
| [Synergy Analysis](#synergy-analysis) | Building a post-merger synergy quantification for a deal |
| [IPO Model](#ipo-model) | Building a full IPO pricing and issuance model for a company going public |
| [Model Audit](#model-audit) | A financial model (Excel workbook, PDF, or oral description) requires independent diagnosis before a transaction, IC presentation, or internal review |
| [Live Model Editing](#live-model-editing) | User supplies an existing Excel file with a specific change request |

---

## 3-Statement Model

**Use when**: Building a fully integrated income statement, balance sheet, and cash flow statement for a company | **Deliverable**: Excel workbook with linked IS / BS / CF tabs, supporting schedules, scenario toggle, and BS check row

---

### Ask First

1. **Historical data source** — Is the client providing audited financials, or should you pull from SEC filings? (Private companies with no ticker: leave the data feed blank to avoid #REF errors.)
2. **Forecast period and scenario count** — Confirm years to project and whether three scenarios (Base / Upside / Downside) are required, or a different set.
3. **Revenue architecture** — Does the business have multiple segments? Confirm segment-level build vs. single-line top-down (default to segment-level for any multi-segment company; use single-line only on explicit instruction).
4. **Forecast seed** — Which source drives the projection: broker estimates, consensus estimates, historical extrapolation, or a hybrid (e.g., broker for years 1–2, historical trend from year 3 onward)? Also confirm: detailed COGS build required? Headcount-driven opex required? Tax rate — effective-rate percentage or calculated from statutory + book differences?

---

### Workflow

1. **Build the Assumptions page** — Define every driver (growth rates, margin targets, DSO, DIO, DPO, capex %, tax rate, debt rates, dividend policy) before touching any other tab. All subsequent tabs must pull from here; hard-coded assumptions anywhere else are prohibited.

2. **Lock all row positions across every tab** — Freeze the row layout for IS, BS, CF, and every supporting schedule *before* writing a single cross-tab formula. Inserting rows after formulas are live silently shifts all cross-sheet references and is the single most destructive modeling error. This step is non-negotiable.

3. **Build the Income Statement** — Populate historical periods first; normalize them (see Rules & Pitfalls) before extending to forecast years. EBITDA and Adj. EBITDA must appear as explicit line items — never implied.

4. **Build supporting schedules** — In this order, because each feeds the BS:
   - **PP&E schedule**: opening balance → capex additions → D&A charge → disposals → closing balance. D&A flows to IS and CF from here, never calculated inline.
   - **Intangibles / software schedule**: amortization charge flows to IS and CF from here. IS D&A line = sum of all component schedules.
   - **Working capital schedule**: DSO-driven receivables, DIO-driven inventory (feed with ABS(COGS) to ensure positive BS balances), DPO-driven payables. Flag sign conventions explicitly (receivables increase = cash outflow; payables increase = cash inflow).
   - **Debt schedule**: model each tranche separately with opening balance, draws, repayments, closing balance, and interest = average balance × rate. Include commitment fees on undrawn revolver capacity. Aggregate interest flows to a single IS line — do not split tranches on the IS.
   - **Revolver**: code dynamically using MAX/MIN logic — auto-draw when cash falls below the minimum cash floor, auto-repay when cash exceeds it. Revolver balance must remain within [0, facility limit] at all times.

5. **Build the Balance Sheet** — Link every line item from the supporting schedules and IS. APIC must be an explicit line; SBC flows into APIC, not retained earnings. Retained earnings roll: `Opening RE + Net Income − Dividends = Closing RE`; closing RE each period must be a formula reference to the prior-period closing RE, never hard-coded.

6. **Build the Cash Flow Statement** — Derive CFO via the indirect method starting from IS net income. Every BS line item's period-end minus period-start change must have an equal and opposite entry in CFO, CFI, or CFF (cash tie-out, line by line). As the final closure step, link CF ending cash back to BS cash — this is the model's closing loop.

7. **Manage the circular reference with the Circ Switch** — The natural loop is: interest expense → net income → ending cash → revolver balance → interest expense. Procedure: (a) set the Circ Switch cell to 0 while building; (b) once all three statements balance, enable Excel iterative calculation and flip the Circ Switch to 1; (c) interest then calculates on average debt balances for the period. Failing to enable iterative calculation before setting the switch to 1 is a named model error.

8. **Run pre-delivery checks** (see Pre-Delivery Checks section).

---

#### Supporting Schedule Structure Reference

| Schedule | Key Line Items | Downstream Destination |
|---|---|---|
| PP&E | Opening NBV → Capex → D&A → Disposals → Closing NBV | D&A → IS; Closing NBV → BS; Capex → CFI |
| Intangibles | Opening → Additions → Amortization → Closing | Amortization → IS; Closing → BS |
| Working Capital | AR, Inventory, AP, Accruals (DSO / DIO / DPO driven) | Balances → BS; Δ Balances → CFO |
| Debt (by tranche) | Opening → Draws → Repayments → Closing; Avg balance × rate = Interest | Interest → IS (single aggregated line); Closing → BS; Draws/Repayments → CFF |
| Revolver | MAX/MIN dynamic draw/repay vs. cash floor and facility cap | Balance → BS; Net movement → CFF; Commitment fee → IS |
| Tax / NOL | EBT → NOL offset → Taxable income → Tax payable | Tax → IS; Deferred tax → BS; NOL: `tax = MAX(0, (EBT − NOL) × rate)` |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Forecast period | 5 years | Standard for LBO, credit, and M&A modeling; aligns with typical DCF horizon |
| Scenario count | 3 (Base / Upside / Downside) | Minimum required to stress-test revolver and debt covenants |
| Revenue build | Segment-level for multi-segment companies | Single-line build masks mix shift; default to granularity |
| Forecast seed (years 1–2) | Broker / consensus estimates | Market-anchored; reduces assumption defensibility burden |
| Forecast seed (year 3+) | Historical trend extrapolation | Broker coverage typically thins beyond year 2 |
| Interest calculation | Average of opening and closing debt balance × stated rate | Approximates true accrual; standard across IBD models |
| Revolver mechanics | Dynamic MAX/MIN vs. minimum cash floor | Ensures model remains valid in Downside / stress scenarios |
| Tax floor | `MAX(0, (EBT − NOL) × statutory rate)` | Tax is never negative; NOL exhaustion handled automatically |
| Goodwill | Static (no growth) unless an acquisition is modeled | Goodwill cannot increase without a transaction |
| EBITDA / Adj. EBITDA | Explicit line items; Adj. EBITDA excludes SBC when SBC is material | Required for valuation multiples; must never be implied |
| BS check row | `Assets − Liabilities − Equity = 0`; conditional format red if non-zero | Continuous audit trail; non-zero = model is broken |
| Merger/centering format | Center across selection (never merge cells) | Merged cells break range references and sort functions |

---

### Rules & Pitfalls

**Never:**
- **Never use a plug to force the balance sheet to balance.** A plug hides an error rather than resolving it. If BS does not foot, simplify the model or identify the broken link — a plug is an immediate credibility disqualifier in any review.
- **Never round or hard-code values to make numbers tie.** Rounding introduces permanent error that compounds across periods and corrupts sensitivity output.
- **Never insert rows after cross-tab formulas are live.** Row insertion silently shifts all cross-sheet range references without triggering an error — the model breaks invisibly. Lock the row layout first (Step 2), always.
- **Never hard-code the revolver as zero.** A static zero revolver causes model failure in Downside and stress scenarios — the most common structural defect found in junior models.
- **Never route SBC through retained earnings.** SBC is a non-cash charge that creates equity value via stock issuance; it must flow into APIC. Misrouting SBC to RE produces a persistent BS imbalance that is notoriously difficult to trace.
- **Never calculate D&A inline on the IS or CF.** D&A must originate from the PP&E and intangibles schedules. Treating all D&A as depreciation (ignoring amortization of intangibles, software, etc.) is a named error.
- **Never copy-paste values across tabs in place of live cell references.** Pasting values severs the link without raising an error, producing stale data that silently diverges from the source schedule.

**Conditional:**
- If the company reports Adjusted EBITDA, reconcile it line-by-line against your own normalized EBITDA calculation before projecting. Only use management's figure after the reconciliation confirms it is arithmetically and conceptually consistent.
- If a column header is misaligned by even one period, historical data will be pulled into forecast years. Audit every cross-tab reference against its period column header before delivery.
- If units differ across source documents (thousands vs. millions), standardize to one unit on the Assumptions page and apply a single conversion factor there — never mix units within the model.
- If a cell could produce a divide-by-zero (e.g., margin ratios in a loss year), wrap with `IFERROR`; display "N/M" rather than an error value.
- If a line item has no applicable value in an edge-case scenario (e.g., 0% growth, negative EBITDA), verify that the tax line returns zero, the revolver logic still operates within its bounds, and all ratios display "N/M" rather than distorted figures.
- If the client has an existing model template, use only designated blue input cells and do not overwrite formula cells under any circumstances — even if the existing formula appears incorrect; flag it instead.

**Judgment:**
- Prefer segment-level revenue modeling over single-line top-down even when segment data is incomplete — a rough segment build surfaces mix-shift risk that a single blended growth rate conceals.
- When using a hybrid forecast seed, document the crossover year explicitly on the Assumptions page so reviewers understand where broker estimates end and historical extrapolation begins.
- Normalize at least three years of historical data before projecting. One normalized year is insufficient to establish a reliable trend baseline.
- When SBC is material relative to net income, present both EBITDA and Adj. EBITDA (ex-SBC) as explicit rows; valuation work should anchor to the ex-SBC figure.
- Treat the Circ Switch as a permanent structural element of the model, not a temporary fix — it must remain in place so any collaborator can safely rebuild or audit the circular logic.

---

### Pre-Delivery Checks

- **Verify BS check row = 0 for every period** (Assets − Liabilities − Equity); any non-zero value must be resolved before delivery — conditional formatting should flag it red automatically.
- **Confirm CF ending cash = BS cash via live formula link** (not a hard-coded value) for every period.
- **Self-audit historical periods first**: IS net income must equal the opening net income line on the CF statement; BS cash must equal CF ending cash. Only extend to forecast years after historical periods are clean.
- **Confirm cash ≥ minimum cash floor every period**; confirm revolver balance stays within [0, facility limit] every period; confirm revolver does not show simultaneous draws and repayments in the same period.
- **Run line-by-line cash tie-out**: for every BS account, `(Ending Balance − Opening Balance)` must equal the corresponding CFO / CFI / CFF entry in sign and magnitude; BS must still foot after confirming each line.
- **Flag hockey-stick growth**: any single forecast year showing revenue or EBITDA growth more than 10 percentage points above the prior forecast year must be flagged to the user.
- **Flag terminal-year EBITDA**: if the final forecast year EBITDA exceeds 150% of the last historical year's EBITDA, flag for review.
- **Confirm scenario logic**: after toggling to each scenario, verify all three statements balance, and confirm directionality — Upside > Base > Downside for revenue and EBITDA; Downside > Base > Upside for leverage multiples.
- **Flag DSO > 90 days**, **DIO > 180 days**, **DPO > 120 days**, **leverage > 10×**, or **dividends > net income** — surface each anomaly explicitly rather than allowing it to pass silently.
- **Confirm Circ Switch is set to 1 and iterative calculation is enabled** in Excel settings; verify interest lines are calculating on average balances, not period-end balances.
- **Confirm no merged cells exist** anywhere in the workbook; replace any found with center-across-selection formatting.
- **Audit all cross-tab references for period column alignment** — one column of misalignment pulls historical actuals into forecast cells without raising an error.

---

### Scope Boundaries

DCF valuation (WACC derivation, mid-year convention, terminal value normalization, sensitivity tables, and equity bridge) is handled by the DCF playbook, which treats the 3-Statement model as its upstream input. Comparable companies analysis and precedent transaction analysis (trading and transaction multiple selection, spread, and football field) are handled by their respective comps playbooks. This playbook ends at a balanced, scenario-toggled, fully auditable three-statement model ready to feed downstream valuation work.

---

## Merger Model (Accretion/Dilution)

**Use when**: Sizing EPS accretion/dilution impact of a proposed acquisition for buy-side analysis, pitch book, or fairness opinion | **Deliverable**: Excel workbook with 9 tabs (Cover, Assumptions, Sources & Uses, PPA, Standalone Financials, Pro Forma IS, Accretion/Dilution Summary, Sensitivity, Checks)

---

### Ask First
1. **Entity type**: Is the acquirer public or private? Is the target public or private? (Defaults: both public)
2. **Consideration mix**: What is the cash/stock split? (Default: 50% debt-funded cash / 50% stock)
3. **Synergies**: What are the cost and revenue synergy assumptions? (Default: 5% cost synergies / 2% revenue synergies)
4. **Scope flags**: Is this a pitch or a live deal? Asset deal or stock deal? Full synergy scenario analysis required? (Defaults: stock deal, pitch, full synergy analysis included)

---

### Workflow

1. **Build the Cover tab** — title, transaction summary, key output metrics (GAAP and Cash EPS accretion/dilution, implied multiples, breakeven synergies); no live formulas yet, populated last.

2. **Build the Assumptions tab** — enter all deal inputs here and only here: offer price, premium, consideration mix toggle (with sum-to-100% validation cell), synergy amounts and phase-in schedule, tax rate, forecast period (default: 3 years), earnings basis (default: NTM primary, LTM reference), cost-to-achieve, transaction fees. Every downstream tab pulls from this single source; hard-code nothing elsewhere.

3. **Build Sources & Uses (S&U)** — Sources: new debt raised, stock issued (shares × issue price), acquirer cash used. Uses: equity purchase price (target market cap × (1 + premium)), assumed net debt, transaction fees, financing fees. Confirm Sources − Uses = 0 before proceeding. *(Must balance before PPA can be anchored.)*

4. **Build the PPA tab** *(Purchase Price Allocation)* — derive the equity purchase price from the S&U; add assumed net debt to get implied EV. Allocate premium over book net assets:
   - Identify PP&E write-up and intangible write-up as separate line items.
   - Compute **DTL = (total write-ups) × tax rate**; record as a liability — this reduces goodwill.
   - **Goodwill = Equity purchase price − Book net equity − PP&E write-up − Intangible write-up + DTL** (GAAP: not amortized).
   - Derive annual D&A step-up from intangible and PP&E write-ups using assumed useful lives — this feeds directly into the Pro Forma IS as the primary driver of GAAP EPS dilution.

5. **Build Standalone Financials** — input or link acquirer and target income statements (NTM basis) independently. Show: revenue, EBITDA, D&A, EBIT, interest expense, pre-tax income, taxes, net income, diluted share count, diluted EPS. Keep the two companies in separate column blocks; do not combine here.

6. **Build the Pro Forma IS** — combine acquirer and target, then apply each adjustment as a **separate signed line item** (never net multiple adjustments into one line):
   - Add: target revenue and EBITDA.
   - Add: synergies (phased per schedule, tax-effected at acquirer's marginal rate; gross synergies and cost-to-achieve shown separately — never netted at the assumption level).
   - Deduct: D&A step-up from PPA (intangibles + PP&E write-up amortization).
   - Deduct: **foregone interest income** on cash deployed = (pre-tax yield × cash used) × (1 − tax rate), shown as a standalone cost line.
   - Deduct: incremental interest expense on new debt.
   - Remove: **target's pre-existing interest expense** (it was extinguished/refinanced in S&U; recording it again is double-counting).
   - Deduct: transaction fees (Year 1 only — do not carry to Year 2+).
   - Compute pro forma pre-tax income → apply blended tax rate → pro forma GAAP net income.
   - **Pro forma diluted share count = Acquirer existing diluted shares + New shares issued for stock consideration only.** Never include target shares in the denominator.
   - Compute **GAAP diluted EPS** and **Cash EPS** (GAAP net income + PPA amortization after tax, divided by same pro forma share count) in clearly separated rows.

7. **Build the Accretion/Dilution Summary tab** — display:
   - Year 1 / Year 2 / Year 3 GAAP EPS accretion/(dilution) in $ and %.
   - Year 1 / Year 2 / Year 3 Cash EPS accretion/(dilution) in $ and %.
   - Implied acquisition P/E vs. acquirer P/E (relative P/E comparison — see Rules).
   - Contribution analysis: acquirer and target % contribution to combined revenue, EBITDA, and net income vs. implied pro forma ownership split.
   - Breakeven synergy required for Year 1 EPS neutrality, expressed both in $ and as % of target EBITDA.
   - Pro forma net debt / EBITDA leverage ratio with threshold flags.

8. **Build the Sensitivity tab** — use native Excel Data Tables (not static paste) so tables update dynamically when inputs change. Recommended axes:
   - GAAP EPS accretion/(dilution) vs. (offer premium × synergy amount).
   - Cash EPS accretion/(dilution) vs. (% cash consideration × % stock consideration).
   - Breakeven synergy vs. offer premium.

9. **Build the Checks tab** — see Pre-Delivery Checks. All checks resolve before the Cover is finalized.

---

#### Synergy Phase-In Schedule (default)

| Year | Cost Synergies | Revenue Synergies |
|------|---------------|-------------------|
| 1 | 25% | 25% |
| 2 | 75% | 75% |
| 3 | 100% | 100% |

Apply after-tax at the acquirer's marginal tax rate. Revenue synergies receive a **50% confidence haircut** relative to cost synergies in the base case (lower conviction; show gross and haircut-adjusted as separate rows in assumptions).

Year 1 net synergy contribution is frequently negative once cost-to-achieve and transaction fees are included — model this explicitly; do not smooth it away.

---

#### Pro Forma EPS Bridge (display structure)

| Line | Treatment |
|------|-----------|
| Acquirer standalone EPS | Starting point |
| + Target net income contribution | Separate line |
| − D&A step-up (PPA, after-tax) | Separate line |
| − Foregone interest income (after-tax) | Separate line |
| +/− Incremental interest on new debt (after-tax) | Separate line |
| − Transaction fees (Year 1 only, after-tax) | Separate line |
| + Net synergies (after-tax, phased) | Separate line |
| = Pro forma net income | Subtotal |
| ÷ Pro forma diluted shares | New shares only added |
| = Pro forma GAAP EPS | Bolded |
| + PPA amortization add-back (after-tax) | Separate line |
| = Pro forma Cash EPS | Bolded |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|-----------|---------|-----------|
| Consideration mix | 50% debt-funded cash / 50% stock | Balanced capital structure; stress-test both extremes in sensitivity |
| Forecast period | 3 years | Sufficient to show phase-in convergence without spurious precision |
| Earnings basis | NTM primary, LTM as reference | Market prices deals on forward earnings; LTM anchors to actuals |
| Cost synergy assumption | 5% of target cost base | Conservative but credible without deal-specific data |
| Revenue synergy assumption | 2% of combined revenue | Reflects execution uncertainty |
| Revenue synergy confidence haircut | 50% applied in base case | Revenue synergies are harder to achieve and defend in diligence |
| Synergy phase-in | 25% / 75% / 100% over Years 1–3 | Standard ramp; Year 1 reflects partial-year realization |
| PPA | Always included | Required for GAAP compliance and correct EPS computation |
| Deal structure | Stock acquisition | Asset deals require separate flag and tax basis step-up analysis |
| Acquirer/target status | Both public | Drives use of market cap as equity value anchor |
| Foregone interest pre-tax yield | Match to prevailing short-term rate or acquirer return assumption | Opportunity cost must be deal-specific; flag if yield not provided |
| Leverage flag thresholds | Yellow ≥ 5.0× net debt/EBITDA; Red ≥ 7.0× | Standard leveraged-deal risk benchmarks |

---

### Rules & Pitfalls

**Never:**
- **Never mix GAAP EPS and Cash EPS into a single reported figure** — PPA amortization depresses GAAP net income while Cash EPS may be accretive; conflating them produces a number that is neither and misleads the IC on the true economic return.
- **Never skip DTL in the PPA** — omitting the deferred tax liability (write-ups × tax rate) overstates goodwill by the full DTL amount, misrepresents balance sheet leverage, and will be caught immediately by any diligence reviewer.
- **Never include target shares in the pro forma diluted share count** — target shareholders receive cash or acquirer shares; their original shares are retired. Adding them to the denominator deflates pro forma EPS and produces a nonsensical blended share count.
- **Never carry transaction fees (advisory, financing) into Year 2 or beyond** — they are one-time Year 1 costs; rolling them forward artificially suppresses multi-year EPS and distorts the accretion trajectory.
- **Never double-count target interest expense** — once the target's debt is assumed or refinanced in S&U, its historical interest charge is extinguished; re-recording it in the pro forma IS produces a fictitious additional cost line.
- **Never apply the offer premium to EV** — the premium is computed relative to the target's equity value (market cap); EV is separately derived as equity purchase price plus assumed net debt.
- **Never net gross synergies against cost-to-achieve at the assumption level** — keep them as separate signed rows so reviewers can stress each independently; netting hides execution risk.
- **Never hardcode values in downstream tabs** — all assumptions cascade from the Assumptions tab; hardcoded constants break when inputs change and create version-control failures.

**Conditional:**
- **If the deal is an asset transaction (not a stock acquisition), flag immediately and do not proceed with defaults** — asset deals generate a tax basis step-up that materially alters after-tax cash returns and PPA mechanics; model must be rebuilt under asset-deal logic.
- **If GAAP EPS is accretive but Cash EPS is dilutive (or vice versa), add an explanatory annotation on the Accretion/Dilution Summary tab** — the divergence signals that PPA amortization is the dominant driver and must be surfaced explicitly for the deal team.
- **If the acquirer's P/E is less than the implied acquisition P/E and synergies are zero or minimal, flag as structurally dilutive** — no amount of phase-in will rescue accretion without meaningful synergy realization; this must appear as a named risk in the output.
- **If new shares issued exceed 20% of acquirer's existing share count, flag for disclosure** — most jurisdictions require shareholder approval above this threshold; the deal timeline and vote risk must be noted.
- **If the source reports only equity value for the target, rebuild EV via the bridge** (equity purchase price + net debt assumed + preferred + minority interest) before computing implied EV/EBITDA multiples.
- **If target debt is being assumed rather than refinanced, confirm whether change-of-control provisions are triggered** — failure to flag this can invalidate the S&U structure.

**Judgment:**
- **Display the relative P/E comparison explicitly on the summary tab** — when acquirer P/E > implied acquisition P/E, the deal is naturally accretive before any synergies because the acquirer is exchanging expensive equity for cheaper earnings; this is the single most persuasive pitch narrative and must be shown, not merely mentioned.
- **Express breakeven synergies in both $ and as % of target EBITDA** — the dollar figure conveys magnitude; the EBITDA percentage conveys feasibility relative to the target's earnings base and is the metric deal teams argue over.
- **In the base case, haircut revenue synergies by 50% relative to cost synergies** — revenue synergies depend on customer behavior, competitive response, and cross-sell execution that cost synergies do not; the discount reflects the asymmetry in conviction, not excessive conservatism.
- **Prefer NTM as the primary earnings basis for accretion analysis** — the market prices the deal on forward earnings; LTM is useful as a sanity check anchor but should not drive the headline accretion number.
- **Build the consideration mix as a live toggle that simultaneously updates new shares issued, new debt drawn, foregone interest income, and incremental interest expense** — a toggle that only updates one variable creates silent model errors that are extremely difficult to trace.

---

### Pre-Delivery Checks

- **Verify S&U balances to zero** (Sources − Uses = $0); any non-zero gap means the financing structure is incomplete.
- **Verify PPA goodwill ties out**: Equity purchase price − Book net equity − PP&E write-up − Intangible write-up + DTL = Goodwill as modeled; a mismatch indicates DTL was omitted or write-ups are inconsistent with S&U.
- **Verify pro forma diluted share denominator** = Acquirer existing diluted shares + New shares issued for stock consideration only; confirm target shares are absent.
- **Verify consideration mix sums to exactly 100%**; flag any toggle state that does not sum to 100% as a hard model error.
- **Verify the pro forma IS net income ties back to the EPS bridge** — the bridge must foot/tie out line-for-line to the IS; unexplained differences indicate a hidden hardcode or double-counted adjustment.
- **Verify synergy phase-in percentages flow correctly through all three years** and that each year's synergy is tax-effected at the acquirer's marginal rate before reaching net income.
- **Verify sensitivity tables are live Data Tables** (not pasted values) by changing an input and confirming automatic recalculation.
- **Flag (non-blocking) if offer premium > 50%** — document rationale.
- **Flag (non-blocking) if Year 1 phase-in > 50%** — aggressive ramp requires explicit support.
- **Flag (non-blocking) if implied EV/EBITDA > 20×** — note in output with comparable context.
- **Flag (non-blocking) if Year 1 EPS dilution > 15%** — note recovery timeline.
- **Flag (non-blocking) if pro forma net debt/EBITDA ≥ 5.0× (yellow) or ≥ 7.0× (red)** — include risk notation in the Accretion/Dilution Summary.
- **Flag (non-blocking) if breakeven synergy exceeds 10% of target EBITDA** — signals deal is economically marginal without aggressive execution.
- **Flag (non-blocking) if GAAP and Cash EPS diverge in direction** (one accretive, the other dilutive) — add annotation explaining the PPA amortization effect.
- **Flag (non-blocking) if acquirer P/E < implied acquisition P/E and synergies are minimal** — label as "structurally dilutive; synergy-dependent."
- **Flag (non-blocking) if new shares issued > 20% of acquirer share count** — note potential shareholder approval requirement.
- **Flag (non-blocking) if blended tax rate < 10% or > 40%** — verify inputs; unusual rates should be documented.

---

### Scope Boundaries

Bolt-On M&A (LBO context): tuck-in acquisitions within a leveraged buyout, including cohort triangles and IRR roll-up mechanics, are handled by the Bolt-On M&A playbook — not this one.
Standalone Sources & Uses: when a client needs only a formatted S&U table without a full pro forma income statement or PPA, use the Sources & Uses playbook.
This playbook covers public-to-public and public/private acquisitions with full accretion/dilution output; it does not cover merger-of-equals exchange ratio analysis or fairness opinion valuation ranges, which require dedicated playbooks.

---

## Synergy Analysis

**Use when**: Building a post-merger synergy quantification for a deal | **Deliverable**: Excel workbook (Bridge + supporting detail tabs); PowerPoint deck optional and built only on request

---

### Ask First
1. What materials are available? (employee census, P&L by department, vendor/supplier schedules, facilities data, revenue breakdown by product/geography, org chart)
2. What is the deal type and target's Adjusted EBITDA? (sole hard-coded anchor in the bridge)
3. Are revenue synergies required? (underwriting decision — do not assume yes)
4. Are dis-synergies required? (underwriting decision — do not assume yes)

---

### Workflow

1. **Intake — inventory available inputs** (determines which tabs to build; omit any tab for which no input exists rather than fabricating data)
2. **Open workbook, create tab structure**: Bridge | Headcount | Non-Headcount | Revenue Synergies *(omit if not requested)* | Dis-Synergies *(omit if not requested)* | Costs to Achieve | Assumptions
3. **Build Assumptions tab first** — define all parameters by name (Target Adj. EBITDA, Target EBITDA Margin, headcount multipliers, scenario flags); all other tabs reference parameter names, never raw cell addresses, so the tab order can be rearranged without broken links
4. **Build Headcount tab** — choose method based on available data:
   - *Bottom-up* (census available): one row per eliminated role; run-rate savings = salary × 1.25 (fully-loaded); severance = salary × 1.0 (cash only) → feeds Costs to Achieve tab
   - *Top-down* (P&L only): apply departmental redundancy rates (G&A 20%, Ops 5%, R&D 0%, Sales 0%) + Executive overlay; **before applying the 20% G&A rate, strip C-suite/senior-EVP compensation out of the G&A salary base** to prevent double-counting with the Executive overlay row
5. **Build Non-Headcount tab** — apply category defaults (see Defaults table); yellow-highlight any cell where spend base is unknown and insert label `"Enter estimated annual spend"` — do not invent a number
6. **Build Revenue Synergies tab** *(only if user explicitly requested)*; apply margin treatment by sub-type (see Rules & Pitfalls — Conditional)
7. **Build Dis-Synergies tab** *(only if user explicitly requested)*; store all dis-synergy values as negatives and roll them into the signed Bridge total — do not apply a second negative sign and do not subtract them in a separate line
8. **Build Costs to Achieve tab** — one-time items only; visually and structurally separated from the run-rate bridge; retention bonuses default off unless requested
9. **Build Bridge tab last** (all cell values trace to supporting tabs; the only hard-coded value is Target Adj. EBITDA)
   - Add a Scenario dropdown (Conservative / Base / Upside) to every synergy row
   - Use SUMPRODUCT to aggregate the bridge by scenario; the same row can carry different values across scenarios (e.g., public-company costs $1.5M Conservative / $3.0M Upside)
   - Conservative ⊆ Base ⊆ Upside in absolute value (dis-synergies grow more negative moving upside)
   - Add Time to Realize columns (Y1 %, Y2 %) and a **Year-1 Realized** row; auto-flag in Bridge Notes with a formula any row where Y1% ≤ 50%
   - Display zeros as dashes; use $000s for values < $1M, $MM otherwise; summary rows at top, detail below
10. **Deliver Excel** → ask whether a PowerPoint deck is also needed
11. *(If PPT requested)* Build one slide: three-scenario bridge table + Notes column; include a headcount-by-scenario summary row if the headcount method was used; **omit Costs to Achieve from the slide by default**

#### Bridge Layout (tab-level row order)
| Row | Notes |
|---|---|
| Target Adj. EBITDA | Blue fill; only hard-coded value |
| Headcount synergies — itemized | From Headcount tab |
| Non-headcount synergies — itemized | From Non-Headcount tab |
| **Total Cost Synergies** | Sum of above |
| **Pro Forma EBITDA (Run-Rate)** | Target Adj. EBITDA + Total Cost Synergies |
| Revenue synergies — itemized *(if requested)* | From Revenue Synergies tab |
| Dis-synergies — itemized *(if requested)* | Stored as negatives; from Dis-Synergies tab |
| **Total Synergy-Adjusted Pro Forma EBITDA** | Full adjusted total |
| Costs to Achieve (One-Time) *(separate block)* | Visually separated; does not affect run-rate rows above |

---

### Defaults (apply silently, disclose at delivery)
| Parameter | Default | Rationale |
|---|---|---|
| Revenue synergies | **OFF** (entire tab + bridge section omitted; no zero rows) | Underwriting decision, not an assumption; including without user direction inflates deal value |
| Dis-synergies | **OFF** (entire tab + bridge section omitted; no zero rows) | Same underwriting discipline |
| Retention bonuses | **OFF** | Activate only on explicit user instruction |
| Run-rate headcount savings multiplier | **1.25× base salary** (covers bonus, equity comp, employer taxes, benefits) | Fully-loaded cost is the true P&L impact of eliminating a role |
| Severance (Costs to Achieve) multiplier | **1.0× base salary, cash only** | Severance is a cash outlay, not a fully-loaded obligation |
| Executive scope | **True C-suite and senior EVP only** | Functional managers/directors/analysts with "senior" in title belong in their functional department |
| G&A headcount redundancy rate | **20%** (applied only after stripping C-suite from G&A base) | Industry standard for corporate function overlap |
| R&D headcount redundancy rate | **0% floor** | Do not cut without explicit user direction |
| Sales headcount redundancy rate | **0% floor** | Same; revenue-generating roles require explicit rationale |
| Ops headcount redundancy rate | **5%** | Conservative default for operational overlap |
| Insurance savings | **6–8% of spend** | Standard market benchmark |
| Public-company costs | **$1.5M–$3.0M** | D&O, SEC filings, board fees, audit premium |
| Software/SaaS savings | **15–20% of spend** | License consolidation typical range |
| Professional services savings | **10–15% of spend** | Outside counsel, accounting, consulting overlap |
| Facilities savings | **10–15% of spend, or $28/sqft** | Use whichever has better data support |
| Procurement savings | **User input required; no default** | Highly deal-specific; do not fabricate |
| G&A non-headcount catch-all | **5% of G&A non-headcount spend** | Used only when zero line-item breakdown is available |
| Scenario default classification | Conservative: C-suite redundancy, public-company costs, insurance, clear software overlap; Base: G&A headcount, professional services, facilities; Upside: facilities consolidation, procurement, revenue synergies, ops headcount | Reflects increasing confidence/execution risk |
| Payback period denominator | **Year-1 Realized synergies** (not run-rate) | Using run-rate overstates payback speed |
| Assumption cell formatting | **Yellow highlight + comment** | Flags every editable assumption for reviewer |
| Number format threshold | **$000s if < $1M; $MM if ≥ $1M** | Readability |

---

### Rules & Pitfalls

**Never:**
- Never hard-code any synergy value directly in the Bridge — every line must trace to a supporting tab; the only permissible hard-coded value is Target Adj. EBITDA, because breaking traceability makes the model unauditable and kills reviewer confidence
- Never populate revenue synergies or dis-synergies without explicit user input — both are underwriting decisions, not modeling assumptions; filling them in speculatively inflates the deal thesis and misrepresents what has been diligenced
- Never apply the 1.25× fully-loaded multiplier to severance — severance is a cash payment equal to 1.0× base salary; conflating the two overstates one-time costs and understates run-rate savings
- Never let Costs to Achieve flow into or reduce the run-rate EBITDA bridge — one-time costs are not run-rate improvements; mixing them causes the Pro Forma EBITDA line to be wrong on both a run-rate and transaction basis
- Never apply the 20% G&A redundancy rate to a salary base that still includes C-suite compensation when an Executive overlay row is also present — this double-counts the C-suite reduction and overstates headcount synergies
- Never cut Sales or R&D headcount beyond the 0% floor without an explicit user instruction and rationale — zero is the floor, not a placeholder
- Never invent a spend base — if category spend is unknown, insert a yellow placeholder cell with the label `"Enter estimated annual spend"` and leave the synergy value blank
- Never back-solve revenue or EBITDA margin to imply a revenue figure — leave the cell yellow and blank rather than plugging an implied number
- Never count the same synergy in more than one line or category — each dollar of synergy lives in exactly one row
- Never mix periods (different fiscal years or quarters) in the same bridge column — maintain apples-to-apples comparability across all inputs
- Never place dis-synergy values as positives and then subtract them separately — store as negatives and include in the signed total so the arithmetic is self-evident

**Conditional:**
- If the user provides an IC memo, CIM, or management presentation, those stated figures override every default — user-supplied documents take unconditional precedence
- If only a top-down P&L is available (no census), apply departmental redundancy rates; if a census is available, switch to bottom-up and build one row per eliminated role
- If a synergy row has Y1 realization ≤ 50%, automatically insert a formula-driven flag in the Bridge Notes column — no separate phasing schedule is needed, but the timing risk must be visible
- If the payback period calculates to < 1.0 year using Year-1 Realized synergies, flag the result explicitly — this almost always means run-rate is being used inadvertently or the Costs to Achieve are understated
- If the user requests revenue synergies, apply margin by sub-type: pricing synergies at 100% margin (pure flow-through; note the assumption of zero volume loss or churn); cross-sell, geographic expansion, and volume at the target's existing EBITDA margin (from the Assumptions tab Target EBITDA Margin parameter); new product or other categories require user-supplied margin input
- If the user explicitly confirms high confidence in a synergy category, reclassify it upward (e.g., Conservative → Base) — document the rationale in the Assumptions tab

**Judgment:**
- Prefer bottom-up headcount analysis whenever a census exists — it is more defensible in diligence and IC review than top-down rates, because each eliminated role can be named and explained
- Flag every row where Y2 realization is assumed (i.e., Y1% < 100%) with a note in Bridge Notes — reviewers will ask about phasing risk and the model should surface it proactively rather than burying it
- When classification of a role is ambiguous (e.g., a "Senior Director of Finance" who reports to the CFO), default to the functional department (Finance/G&A), not Executive — the Executive tier should be narrow enough to defend to a skeptical IC
- Scenario boundaries are cumulative: every item in Conservative must also appear in Base and Upside; do not allow a line to exist in Base but not Upside, as this implies higher confidence assumptions are excluded from the optimistic case — which is internally inconsistent

---

### Pre-Delivery Checks
- Confirm every Bridge row traces to a cell in a supporting tab; verify no synergy value is hard-coded in the Bridge except Target Adj. EBITDA
- Confirm Conservative ≤ Base ≤ Upside in absolute value for every cost synergy row; confirm dis-synergy rows grow more negative (larger absolute value) moving from Conservative to Upside
- Confirm Costs to Achieve rows are in a visually separated block and do not affect any run-rate EBITDA line above them
- Confirm severance uses 1.0× base salary (cash) and run-rate headcount savings use 1.25× fully-loaded — verify these are not swapped
- Confirm Revenue Synergies and Dis-Synergies tabs and bridge sections are entirely absent (no zero rows, no section headers) if the user did not request them
- Confirm dis-synergy values are stored as negatives and not double-negated anywhere in the bridge
- Confirm the Executive overlay and G&A 20% redundancy rate are applied to mutually exclusive salary bases — no C-suite compensation appears in both
- Confirm all assumption cells are yellow-highlighted and no spend base has been fabricated (all unknowns show the placeholder label)
- Confirm the Payback Period calculation uses Year-1 Realized synergies as the denominator, not run-rate; flag if result < 1.0 year
- Confirm all period data is consistent (same fiscal year or LTM period) across Target Adj. EBITDA, margin parameters, and headcount cost inputs
- Confirm SUMPRODUCT scenario logic is correct: changing a row's Scenario dropdown updates the Bridge total without manual intervention
- Confirm no formula errors (#REF!, #DIV/0!, #VALUE!) exist in any tab
- Confirm number formatting: values < $1M displayed in $000s; values ≥ $1M displayed in $MM; zeros displayed as dashes

---

### Scope Boundaries
The **Merger Model** playbook consumes synergy outputs as a single input line within a full accretion/dilution or merger consequence analysis — build the synergy bridge here, then hand off the total to that model. The **Bolt-On / LBO** playbook handles synergy phase-in scheduling within a roll-up or leveraged buyout context. The **Quality of Earnings** playbook owns historical EBITDA normalization and one-time addback analysis — do not re-adjust the Target Adj. EBITDA anchor here; take it as given from QoE output or user input.

---

## IPO Model

**Use when**: Building a full IPO pricing and issuance model for a company going public | **Deliverable**: Excel workbook covering offer pricing range, underwriting fees, proceeds waterfall, three-stage pro forma cap table, dilution analysis, implied valuation and multiples, float, lock-up schedule, pre-IPO investor returns, and sensitivity tables

---

### Ask First
1. What is the target raise, and what is the primary/secondary share split (i.e., how much is the company raising vs. how much are existing shareholders selling)?
2. What is the preliminary valuation range or target price range for the offering?
3. Are there convertible notes, preferred stock, or warrants outstanding that must be converted or settled pre-IPO? If so, confirm conversion terms, any anti-dilution provisions, and price caps.
4. For any equity awards (options, RSUs, warrants): provide the full schedule by tranche with strike prices, vesting status, and settlement method. If no cost basis is available for any pre-IPO investor group, confirm before proceeding — do not assume.

---

### Workflow

1. **Build the offer pricing range** *(establish the spine before anything downstream depends on it)* — set low / mid / high price points; mid = blended peer valuation less IPO discount; low / high = ±10–15% around mid; all downstream modules run independently at each price point, never collapsed into a single number.

2. **Convert all pre-IPO convertible instruments to common** *(must precede cap table construction; IPO triggers automatic conversion)* — apply adjusted conversion ratios if anti-dilution or price-cap provisions are triggered; if terms are not provided, pause and request before proceeding.

3. **Build the pre-IPO cap table (Snapshot 1)** — use fully diluted share count (FDSO) on a treasury stock method (TSM) basis; calculate RSU net settlement at the default 40% withholding rate (net shares = RSU count × (1 − withholding rate)); for dual-class structures, compute economic ownership % and voting % independently and never commingle them.

4. **Determine primary and secondary share counts** *(define each before any proceeds calculation; the two must never be mixed)* — primary = newly issued shares, proceeds flow to the company; secondary = existing shareholders selling, proceeds flow to sellers only.

5. **Calculate gross spread and underwriting fees** — apply gross spread separately to primary gross proceeds and secondary gross proceeds, never to the combined total; use the size-tiered defaults below. Compute net primary proceeds = gross primary proceeds − primary spread − other offering expenses.

6. **Build the proceeds waterfall (Sources & Uses)** *(waterfall must foot at every price point)* — Uses must equal net primary proceeds exactly; use "general corporate purposes / cash to balance sheet" as the plug line; debt repayment may not exceed the outstanding balance of each tranche; Sources & Uses table above the waterfall must include secondary proceeds, greenshoe proceeds, and any cash on hand; total sources must equal total uses.

7. **Build post-IPO cap table without greenshoe (Snapshot 2)** — post-IPO basic shares = pre-IPO basic shares + primary shares issued; verify all holder group ownership percentages sum to 100%.

8. **Build post-IPO cap table with full greenshoe exercise (Snapshot 3)** — greenshoe = 15% of the base deal (primary + secondary, before greenshoe); allocate greenshoe between primary and secondary per deal terms (default: primary); secondary greenshoe does not add cash to the company; do not double-count greenshoe inside the base deal.

9. **Run dilution analysis** — compare pre-IPO FDSO to post-IPO FDSO at each price point; confirm dilution decreases as offer price rises (directional sanity check).

10. **Calculate implied valuation and multiples** — compute on three bases: pre-money (offer price × pre-IPO FDSO), post-money excluding greenshoe, and post-money including full greenshoe; enterprise value = post-money equity value + net debt (net debt must include IPO proceeds received and reflect all debt repaid from the waterfall — apply the adjusted balance sheet, not the pre-IPO one); confirm EV-based multiples are consistent with the same net debt definition throughout; pre-money + net primary proceeds = post-money (tie out at every price point).

11. **Float analysis** — public float = primary shares + secondary shares sold + greenshoe − directed share program (DSP) allocations; provide a daily trading volume estimate; flag if float < 15% (liquidity risk) or > 40% (anomalous).

12. **Build the lock-up expiry table** — list each holder group, shares subject to lock-up, expiry date, shares entering the market at expiry, and implied post-lock-up float.

13. **Pre-IPO investor return analysis** — compute MOIC and IRR by investor group and funding round; where cost basis is unavailable, mark as N/A and request the data — do not impute; for sponsor secondary sales, report net cash proceeds and remaining unrealized position separately.

14. **Build sensitivity tables** *(four tables, base case centered, no hard-coded values)* — (i) offer price × valuation multiple; (ii) offer price × net primary proceeds; (iii) offer price × dilution (%); (iv) implied equity value varying revenue growth rate or margin assumption.

15. **Final tie-out and pre-delivery checks** *(see Pre-Delivery Checks section)*.

#### Operating Model Independence
Keep the operating forecast model (revenue, EBITDA, net income projections) in a separate linked workbook or tab. Changes to offer terms — price, size, greenshoe, fee structure — must never disrupt the operating forecast. The IPO mechanics module pulls from the operating model; it does not overwrite it.

#### Sponsor IPO Exit Module (PE-Backed Transactions)
Handle in the dedicated sponsor-exit module, which covers: sell-down schedule, post-listing operating model, debt and tax schedules, management incentive plan (MIP), and sponsor return analysis. Do not embed these within the core IPO model tabs.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Offer price structure | Low / mid / high range; mid = peer median less IPO discount; low/high = ±10–15% of mid | IPO pricing is inherently a range exercise; single-point pricing is not credible at marketing stage |
| Greenshoe size | 15% of base deal (primary + secondary, pre-greenshoe) | Standard FINRA/market convention |
| Greenshoe allocation | Primary shares (company receives proceeds) | Most common structure; override if deal terms specify secondary or split |
| Primary issuance size | 10–20% of post-IPO shares outstanding | Typical institutional bookbuild sizing |
| Lock-up period | 180 days | Standard U.S. IPO lock-up convention |
| Gross spread — deal < $500M | 7% | Market convention by deal size |
| Gross spread — deal $500M–$2B | 5–6% | Market convention by deal size |
| Gross spread — deal > $2B | 3–4% | Market convention by deal size |
| FDSO methodology | Treasury stock method (TSM) for all in-the-money options and warrants | Out-of-the-money options carry zero dilution; TSM avoids the overcount of direct-add |
| RSU withholding | 40% net settlement (net shares = RSU count × 0.60) | Standard supplemental withholding rate assumption |
| IPO discount benchmark | Displayed as % discount to peer group median | Allows reviewers to assess aggressiveness of pricing |
| Valuation snap points | Pre-money / post-money ex-greenshoe / post-money incl. full greenshoe | Three-stage cap table requires three matching valuation bases |
| Cap table snapshots | Three: pre-IPO / post-IPO ex-greenshoe / post-IPO incl. full greenshoe | Consistency skeleton for all downstream outputs |
| Proceeds waterfall plug | "General corporate purposes / cash to balance sheet" | Ensures waterfall foots while preserving flexibility |

---

### Rules & Pitfalls

**Never:**
- **Never commingle primary and secondary proceeds** — primary proceeds flow to the company and affect the balance sheet, net debt, and enterprise value; secondary proceeds flow directly to selling shareholders and do not touch company cash. Mixing the two corrupts the cash position, the proceeds waterfall, and every investor return calculation downstream.
- **Never apply gross spread to combined primary + secondary gross proceeds** — fees must be calculated on primary proceeds and secondary proceeds separately; blending overstates or understates the net amount reaching the company.
- **Never build the pre-IPO FDSO before converting all convertible instruments to common** — convertible notes and preferred stock convert automatically at IPO; omitting this step understates pre-IPO share count and corrupts pre-money valuation.
- **Never add option shares directly to basic share count** — out-of-the-money options carry zero dilution; applying TSM tranche-by-tranche at each strike price is required. Direct addition inflates FDSO and is an immediate credibility failure with reviewers.
- **Never hard-code values in the sensitivity tables** — all four sensitivity tables must be formula-driven with the base case at center; hard-coded cells break the model when offer terms change.
- **Never impute a cost basis for pre-IPO investors when it is not provided** — mark MOIC and IRR as N/A and request the data; fabricated return figures expose the firm to legal and reputational risk.
- **Never double-count greenshoe inside the base deal** — the base deal is primary + secondary before greenshoe; greenshoe is incremental (15% on top of the base).
- **Never use pre-IPO net debt to compute post-IPO enterprise value** — post-IPO EV requires the adjusted balance sheet reflecting IPO proceeds received and debt repaid per the waterfall; using the unadjusted balance sheet produces a structurally wrong EV.

**Conditional:**
- If anti-dilution provisions or price caps are present on convertible instruments, use the adjusted conversion ratio before building the pre-IPO cap table; if terms are not provided, stop and request them before proceeding.
- If the greenshoe is exercised as secondary (not primary), do not add those proceeds to company cash — secondary greenshoe flows to selling shareholders only.
- If the deal includes a directed share program (DSP), subtract DSP allocations from the float calculation: float = primary + secondary sold + greenshoe − DSP.
- If the company has dual-class share structure, maintain two parallel columns throughout the cap table — economic ownership % and voting % — and never report a single blended ownership figure.
- If sponsor sell-down, post-listing operations, MIP, or LBO debt/tax schedules are required, route those to the sponsor-exit module; do not embed them in the core IPO model.
- If offer price changes (e.g., revised range at roadshow), update the pricing input only; the operating forecast model must remain unchanged and all IPO mechanics must repopulate automatically via linked formulas.

**Judgment:**
- When benchmarking IPO discount, display it relative to the peer group median so the coverage team and issuer can assess aggressiveness in context — the number alone is not actionable.
- When structuring the waterfall plug, general corporate purposes is preferable to a specific use when the company has not committed proceeds; this preserves flexibility and avoids disclosure issues if plans change.
- When allocating greenshoe between primary and secondary, default to primary (proceeds to company) unless deal terms explicitly specify otherwise; confirm with the coverage banker before finalizing.
- When RSU withholding rate is deal- or jurisdiction-specific, override the 40% default and document the source; the default exists only where no other rate is available.
- Prefer running all downstream outputs at each of the three price points rather than using only the midpoint — a single price point IPO model is considered incomplete for any live transaction.

---

### Pre-Delivery Checks

- Confirm **proceeds waterfall foots at every price point**: total uses = net primary proceeds (zero residual).
- Confirm **post-IPO basic shares = pre-IPO basic shares + primary shares issued** at each price point.
- Confirm **greenshoe = exactly 15% of base deal** (primary + secondary, pre-greenshoe).
- Confirm **gross spread $ = gross spread % × gross proceeds**, computed separately for primary and secondary at each price point.
- Confirm **all holder group ownership percentages sum to 100%** in each of the three cap table snapshots.
- Confirm **FDSO ≥ basic share count** in every snapshot (dilution cannot be negative).
- Confirm **pre-money + net primary proceeds = post-money (ex-greenshoe)** at each price point.
- Confirm **EV = post-money equity value + net debt**, where net debt uses the post-IPO adjusted balance sheet (proceeds in, repaid debt out), consistently across all multiples.
- **Flag if IPO discount < 5%** (pricing too aggressive — likely to break issue) or **> 35%** (leaving too much money on the table — question the valuation basis).
- **Flag if primary issuance > 30% of post-IPO shares outstanding** (unusual dilution — confirm with coverage banker).
- **Flag if float < 15%** (liquidity risk; institutional investors may decline to participate) or **> 40%** (anomalous; investigate structural cause).
- Confirm **multiples increase as offer price increases and dilution decreases as offer price increases** — if either direction inverts, there is a formula error.
- Confirm **primary and secondary proceeds are never summed into the company cash bridge** — secondary proceeds must be absent from the company's Sources & Uses flow.
- Confirm **debt repayment in the waterfall does not exceed the outstanding balance of any individual tranche**.
- Confirm **all four sensitivity tables are formula-driven** with base case at center and no hard-coded override cells.

---

### Scope Boundaries

The operating forecast (income statement, balance sheet, cash flow statement, and associated KPI projections) lives in a separate 3-statement or LBO model; the IPO model pulls from it but never modifies it.

Fully diluted share count components (TSM calculations by tranche, RSU net settlement, warrant schedules) are governed by the FDSO/TSM playbook, which this model consumes as an input.

PE sponsor exit analysis — including sell-down schedule, post-listing operating model, LBO debt and tax schedules, management incentive plan (MIP), and sponsor MOIC/IRR — is handled exclusively in the sponsor-exit module and must not be embedded in the core IPO model tabs.

---

## Model Audit

**Use when**: A financial model (Excel workbook, PDF, or oral description) requires independent diagnosis before a transaction, IC presentation, or internal review | **Deliverable**: Structured audit report comprising a one-line summary, Model Map, Critical Findings table, Analytical Red Flags table, and Assumption Dashboard (with charts for top 3–5 drivers)

---

### Ask First
1. What model type is this — 3-statement, LBO, DCF, M&A, comps, credit, or operating model?
2. Which scenario/case is currently active in the model (base, upside, downside, or other)?
3. Is this a sell-side or management-prepared model, or an internal model?
4. Audit scope: full workbook audit, or a specific section (e.g., returns, debt schedule, operating assumptions only)?

---

### Workflow

**Phase 1 — Understand (always first; never skip to findings)**

1. Map the entire workbook before diagnosing anything: tab layout, data-flow direction, model type, version markers, and any anomalies (external links, hard-coded values pasted over formulas, inconsistent formatting, named ranges pointing to `#REF!`, mixed-author comments/TODOs). *(Rationale: a user cannot interpret "IS!D14 ≠ Assumptions!B5" without first knowing what D14 represents.)*
2. Identify the analytical narrative in one sentence — e.g., *"2.3x MOIC / 18% IRR driven primarily by 400 bps margin expansion and 2.5 turns of deleveraging; growth contributes minimally — this is a margin-and-leverage story, not a growth story."*
3. Identify and document the currently active case/scenario switch. Audit the active case; compare other cases at the output-level delta only (unless a full cross-case audit is requested).
4. Open and inspect all hidden rows, columns, and tabs. *(Rationale: deal models routinely conceal old deal structures, deleted scenarios, and counterparty assumptions that continue feeding visible outputs. Skipping hidden content is an explicit error.)*
5. Document version anomalies as background flags: external links, formulas replaced with hard-coded values, formatting inconsistencies, multi-author comments, hidden content. These signal how many hands have touched the model.

**Phase 2 — Formula-Level Audit**

6. Immediately check balance sheet balance (Assets = Liabilities + Equity) for every period. If it does not foot, flag as Critical before proceeding — all downstream outputs are unreliable until resolved.
7. Scan every tab for formula errors: `#REF!`, `#DIV/0!`, `#VALUE!`, `#NAME?`, and similar. Flag each instance immediately as Critical.
8. Perform the full self-calculated tie-out suite (do not rely on any internal check rows that may or may not exist in the model):

   | Tie-Out Check | Pass / Fail Threshold |
   |---|---|
   | Balance sheet balance (each period) | Non-zero variance = Critical |
   | Cash flow tie-out | Non-zero variance = Critical |
   | Retained earnings rollforward | Non-zero variance = Critical |
   | Segment / cube roll-up to consolidated | Non-zero variance = Critical |
   | Working capital schedule | Non-zero variance = Critical |
   | D&A schedule (vs. PP&E roll) | Non-zero variance = Critical |
   | Interest expense (vs. debt schedule) | Non-zero variance = Critical |
   | Sources & uses balance | Non-zero variance = Critical |
   | Debt balance by tranche (each period) | Non-zero variance = Critical |
   | EBITDA definition reconciliation | Non-zero variance = Critical |

9. Audit formula consistency across each row/column:
   - Hardcoded values embedded inside formulas
   - Inconsistent formulas across a row or column (may be intentional override — flag and investigate before concluding)
   - Absolute vs. relative reference misuse
   - Off-by-one period errors
   - Paste-over overwrites (formula replaced by static value without notation)
   - Circular references (may be intentional — check for iteration settings and flags before flagging as error)
   - Broken cross-sheet links
   - Unit mismatches (e.g., thousands vs. millions in the same calculation)
   - Period misalignment (e.g., beginning-of-period vs. end-of-period inconsistency)
   - VLOOKUP/INDEX-MATCH fragility (lookups that break on sort or column insertion)

**Phase 3 — Analytical Reasonableness**

10. Review all analytical red flags (functioning formulas that produce analytically suspicious outputs):
    - Revenue growth hockey-stick with no identified catalyst
    - Margin expansion >500 bps in a single year without a corresponding cost action in the model
    - Terminal value >75% of total EV
    - Growth rates >50% with no catalyst
    - Working capital improvement that is aggressive or inflects sharply
    - Cash conversion rate step-changes
    - Scenario spread that is implausibly narrow or wide
    - Leverage multiples inconsistent with deal structure
    - EBITDA definition that adds back items inconsistently or aggressively

11. Build the Assumption Dashboard:
    - Separate operating assumptions from transaction assumptions
    - Present as a time-series table with each value hyperlinked back to its source cell
    - Include a CAGR column
    - Produce charts for the top 3–5 most critical drivers, showing projected values against historical actuals, so deviations are visible at a glance

**Output Assembly**

12. Compile the four-section deliverable in this order:

#### Output Structure

**One-Line Summary**
> `Model Type [X] — Overall Assessment [Clean / Minor Issues / Major Issues] — [N] Critical, [N] Warning, [N] Info`

**Section 1 — Model Map** *(from Phase 1)*
Tab inventory, data-flow diagram, active case, version anomaly flags, narrative summary.

**Section 2 — Critical Findings** *(from Phase 2)*
Formula and structural errors only. Finding table format:

| # | Sheet | Cell (hyperlink) | Severity | Category | Issue | Quantified Impact | Recommended Fix |
|---|---|---|---|---|---|---|---|

Sort by severity descending. Group as **Formula / Structural Errors**.

All Critical findings must include a quantified impact statement — not *"formula error in cell X"* but *"overstates EBITDA by $3M → inflates EV by ~$25M at current multiple."* If precise quantification is impossible, state directional impact (e.g., *"overstates FCF — magnitude indeterminate without corrected depreciation schedule"*).

**Section 3 — Analytical Red Flags** *(from Phase 3)*
Analytically suspicious assumptions that are functionally correct. Same table format as Section 2. Group as **Analytical Reasonableness Flags**.

**Section 4 — Assumption Dashboard** *(from Phase 11)*
Time-series table + CAGR column + source-cell hyperlinks + charts for top 3–5 drivers.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Phase execution order | Phase 1 → Phase 2 → Phase 3 always | Understanding before diagnosis prevents misidentified findings |
| Scope of hidden content | Expand and inspect all hidden rows, columns, and tabs | Hidden content frequently feeds visible outputs in deal models |
| Scenario audit scope | Audit active case only; cross-case comparison at output-level delta | Full cross-case audit only if explicitly requested |
| Tie-out method | Self-calculated for all 10 tie-out checks; do not rely on model's internal check rows | Internal checks may themselves be broken |
| Non-zero tie-out variance threshold | Any non-zero variance = Critical | No materiality threshold applies to structural integrity checks |
| Terminal value flag threshold | >75% of total EV = Red Flag | Industry norm is 50–70%; beyond 75% the story is driven by terminal assumptions, not the forecast |
| Margin expansion flag threshold | >500 bps single-year improvement without a corresponding cost action = Red Flag | Sell-side inflation pattern |
| Revenue growth flag threshold | >50% growth without an identified catalyst = Red Flag | Hockey-stick pattern common in optimistic sell-side models |
| Sell-side / management model skepticism | Elevated scrutiny on hockey-stick growth, working capital improvements, and cash conversion rate inflections | These are the three most common seller inflation vectors |
| Reporting tone | Second-year analyst reporting to VP | Precise, direct, no editorial inflation of severity |
| Severity: Critical | Output is incorrect, process must stop | Balance sheet imbalance, #REF!/#DIV/0!, any tie-out failure, formula error with material impact |
| Severity: Warning | Output is fragile or assumption is suspicious but model functions | VLOOKUP fragility, aggressive but internally consistent assumptions |
| Severity: Info | Style, documentation, or hygiene observation | Inconsistent formatting, unlabeled hardcodes, missing source citations |
| Assumption dashboard split | Operating assumptions and transaction assumptions in separate sections | Conflation obscures what is a deal-structure choice vs. a business forecast choice |
| Charts in dashboard | Top 3–5 most critical drivers | Sufficient for one-glance deviation identification without over-engineering |

---

### Rules & Pitfalls

**Never:**
- **Never edit any cell in the model** — this is an audit, not an editing engagement. Any cell change requires an explicit instruction from the user and must be handed off to the modeling/editing workflow. Editing during an audit contaminates the audit trail and removes your objectivity.
- **Never assume the model is wrong before reading it** — manual overrides, circular references, and scenario switches may be intentional design decisions. Pre-judging before completing Phase 1 produces false positives that destroy credibility with reviewers.
- **Never skip hidden content** — hidden rows, columns, and tabs in deal models routinely contain old deal structures, deleted scenarios, and counterparty assumptions that continue feeding visible outputs. Skipping them is an explicit audit failure.
- **Never file a finding without a specific cell reference and hyperlink** — *"revenue looks high"* is not a finding. A finding must cite the exact cell (formatted as a `HYPERLINK("#'SheetName'!CellRef","Label")`) so the user can navigate directly to it.
- **Never report a Critical finding without quantifying its impact on the bottom-line conclusion** — if exact quantification is impossible, state the directional impact (e.g., *"overstates FCF — magnitude indeterminate"*). An unquantified Critical is not actionable.
- **Never escalate a formatting or style issue to Critical severity** — doing so trains reviewers to ignore Critical flags and is the fastest way to lose credibility with a VP or MD.
- **Never reference a tab or cell in a finding that does not exist in the model** — all citations must be verified against the actual workbook.

**Conditional:**
- **If a circular reference is present**, check for iteration settings, a dedicated circuit-breaker switch, or a comment/notation (e.g., *"Manual override per MD"*) before classifying it as an error. Flag it as *"Circular reference — appears intentional; confirm iteration settings are correct"* rather than auto-Critical.
- **If an inconsistent formula is found across a row or column**, check whether it represents an intentional override before filing it as an error. The majority pattern is not necessarily correct; the deviation may be the intentional one.
- **If the model is sell-side or management-prepared**, apply elevated skepticism to: hockey-stick revenue growth, aggressive working capital improvement, cash conversion rate step-changes, and terminal value as a share of EV. These are the canonical sell-side inflation vectors.
- **If the balance sheet does not balance in any period**, flag as Critical immediately and note that all downstream outputs (returns, coverage ratios, cash flows) are unreliable until resolved. Do not proceed to deeper Phase 2 or Phase 3 analysis on outputs that depend on the broken period.
- **If a detailed reasonableness check is required for a specific model type** (DCF, LBO, M&A, 3-statement), defer that model-type-specific analysis to the corresponding specialist playbook. This playbook performs universal flags only.
- **If the user requests a cross-case full audit**, expand Phase 2 and Phase 3 to cover all scenarios, not just the active case.

**Judgment:**
- **Separate "broken" from "I disagree"** — Critical findings are things that are structurally or computationally wrong. Analytical Red Flags are things that function correctly but are analytically suspicious. Conflating the two signals analytical inexperience and will be challenged by any MD or IC reviewer.
- **Flag overrides and anomalies as background context, not automatic bugs** — a comment reading *"Manual override per MD"* is context, not a defect. Your job is to surface it so the user understands what they are looking at.
- **Treat version anomalies as diagnostic signals** — external links, formulas replaced with hard-coded values, mixed-author comments, and hidden content collectively indicate how many contributors have touched the model and how much structural drift may have accumulated.
- **Calibrate the one-sentence narrative before writing findings** — knowing whether the model is fundamentally a *margin story*, a *leverage story*, or a *growth story* allows you to prioritize which assumptions and findings are material to the investment thesis and which are peripheral.

---

### Pre-Delivery Checks
- Confirm every Critical finding is genuinely material — verify no formatting or style issue has been elevated to Critical severity
- Confirm every finding references a tab and cell that actually exists in the model — no phantom citations
- Confirm the Phase 1 Model Map describes what is actually in the workbook, not what should theoretically be there for this model type
- Confirm the Assumption Dashboard reflects actual current values — historical actuals vs. real historical data, projections vs. the active case (not a non-active scenario)
- Confirm finding count in Section 2 and Section 3 tables matches the count stated in the one-line summary exactly
- Confirm every Critical finding includes a quantified or directional impact on the bottom-line conclusion
- Confirm all balance sheet periods have been checked for Assets = Liabilities + Equity; any non-zero variance is Critical
- Confirm all 10 tie-out checks have been self-calculated and each is recorded as Pass or Fail; any non-zero variance = Critical
- Confirm all hidden rows, columns, and tabs have been expanded and inspected
- Confirm the active scenario is correctly identified and stated in the Model Map
- Confirm terminal value as a percentage of EV is calculated and flagged if >75%
- Confirm sell-side / management models have been reviewed specifically for hockey-stick growth, working capital inflection, and cash conversion rate step-changes
- Confirm cell hyperlinks follow `HYPERLINK("#'SheetName'!CellRef","Label")` format and are navigable

---

### Scope Boundaries
This playbook covers universal audit logic applicable to all financial model types. Model-type-specific analytical reasonableness checks (e.g., mid-year convention in DCF, returns waterfall in LBO, purchase price allocation in M&A) are handled by the corresponding DCF, LBO, M&A, or 3-statement specialist playbook — defer detailed model-type reasonableness review there. Any cell-level corrections, formula rewrites, or structural rebuilds identified during the audit are out of scope here and must be handed off to the Excel Editing / Modeling playbook.

---

## Live Model Editing

**Use when**: User supplies an existing Excel file with a specific change request | **Deliverable**: Modified Excel workbook with a written change summary listing every affected tab and any cell-level changes beyond the explicitly requested additions/deletions

### Ask First
1. Which tab(s) should the change apply to, or should it propagate across all relevant year-tabs (IS / BS / CF / Debt Schedule)?
2. For assumption changes: are the assumptions centralised in a single assumptions tab, or are they hard-coded in multiple locations?
3. For adding a year: what assumptions should drive the new column, or should the prior year's assumptions roll forward by default?
4. For deleting data: confirm which rows/columns are in scope so dependency mapping can be completed before any deletion.

### Workflow
1. **Read the entire file before touching anything** — scan all sheets, formulas, formatting rules, and structure; identify where forecast formulas differ from historical formulas and locate all driver inputs (growth rates, margins, interest rates). (Skipping this step causes invisible dependency breaks downstream.)
2. **Map the period/year header row and all driver-input locations** across every tab — confirm the forecast column range and where each assumption feeds from.
3. **Execute only the explicitly requested change** using the relevant default handling below; do not reformat, reorganise, rename, or reorder anything else.
4. **Audit all cross-sheet references** after editing — verify no historical data has been pulled into forecast periods and no reference points to the wrong tab. (These are silent errors; they will not surface as formula errors.)
5. **Deliver with a written change summary** — state exactly which tabs changed, whether any cells beyond the requested row/column additions or deletions were modified, and any flags raised (see Conditional rules).

#### Default Handling by Operation Type

| Operation | Default Procedure |
|---|---|
| **Add a year** | Locate the last forecast column on each year-tab → insert a new column to the right → label it as last year + 1 → copy **all** formatting from the adjacent column (number format, borders, bold, colour, column width) → apply the same new column to **all** year-tabs (IS / BS / CF / Debt Schedule) unless the user has explicitly limited scope → default assumptions: roll forward the last column's assumptions |
| **Delete data** | Audit all dependencies first → create a **"Removed Links"** section in the Assumptions tab → hard-code the deleted values there → relink every dependent tab to that section → then delete the source data (no #REF! errors remain) |
| **Add a tab** | Insert at the user-specified position (default name: "New Tab" if none given) → replicate the formatting conventions of existing tabs → if the new tab corresponds to a modelled schedule (e.g. Debt Build, DCF), apply the relevant modelling playbook for content; formatting follows the file's existing style guide |
| **Change an assumption** | Locate the assumption's position and all downstream dependencies first → if a central assumptions tab exists, change that single cell only → if assumptions are scattered as hard-coded values, **flag to the user** and present two options: (A) update each instance individually, or (B) create a single assumption cell and relink all instances |

### Defaults (apply silently, disclose at delivery)
| Parameter | Default | Rationale |
|---|---|---|
| New-year assumption | Roll forward last forecast column's assumptions | Preserves model continuity; user can override after delivery |
| New-year propagation scope | All year-tabs (IS / BS / CF / Debt Schedule) | A one-tab extension breaks model integrity |
| New tab name | "New Tab" | Neutral placeholder until user specifies |
| Deleted-data handling | Hard-code values into "Removed Links" section before deletion | Preserves downstream formula integrity; eliminates #REF! cascade |
| Scattered hard-coded assumptions | Flag and present two options; do not select unilaterally | User must retain control over structural decisions in their own model |
| Driver inputs in new columns | Linked to the assumptions row, never hard-coded into the formula | Consistent with modelling standards; keeps drivers auditable |

### Rules & Pitfalls

**Never:**
- Never make any unrequested reformatting, restructuring, renaming, or row/column reordering — the existing model is someone else's work and unsolicited "improvements" destroy trust and can break downstream references invisibly.
- Never hard-code growth rates, margins, or interest rates directly into formulas — always link to the assumptions row, because hard-coded drivers cannot be stress-tested and are invisible to future editors.
- Never delete data before completing dependency mapping — direct deletion leaves #REF! errors throughout every dependent tab.
- Never add a year to only one tab when the model has multiple year-tabs — a partial extension creates period mismatches across IS / BS / CF reconciliations.

**Conditional:**
- If assumptions are scattered as hard-coded values rather than centralised, do not choose a fix unilaterally — flag the situation and present both options (A: update each instance; B: consolidate into one cell and relink) so the user decides the structural approach.
- If adding a new tab that corresponds to a specific modelled schedule (Debt Build, DCF, etc.), invoke the relevant modelling playbook to build the content; the editing playbook governs formatting and placement only.
- If cross-sheet reference audit (Step 4) reveals that a historical value has been pulled into a forecast period, flag it explicitly in the change summary before delivery — do not silently correct it without disclosure.

**Judgment:**
- Treat the change summary at delivery as a trust instrument, not a formality — confirming "nothing else was touched" is as important to the user as the change itself, because they are responsible for the model's integrity with their own stakeholders.
- When in doubt about scope (e.g. it is ambiguous whether a tab is a "year-tab"), default to broader propagation and disclose — it is easier for a user to say "revert that tab" than to discover a missing column in a review.

### Pre-Delivery Checks
- Verify no formatting inconsistencies exist within any tab (number format, border, bold, colour, column width).
- Verify no new tabs have been created that were not explicitly requested.
- Verify tab order matches the original file, except for explicitly added or deleted tabs.
- Verify row and column counts equal the starting counts ± the number of rows/columns explicitly requested to be added or deleted.
- Verify no formula errors have been introduced: check all tabs for #REF!, #DIV/0!, #VALUE!, #NAME?, or any other error flag.
- Verify no cross-sheet references have shifted such that historical data appears in forecast columns.
- Verify all driver inputs in new columns (growth rates, margins, rates) are linked to assumption rows, not hard-coded.
- Verify the "Removed Links" section exists in the Assumptions tab for any deletion operation, and that all downstream formulas relink cleanly to it.

### Scope Boundaries
Build-from-scratch modelling (new file, new model structure) is handled by the relevant modelling playbooks, not this one. Model review, error-finding, and assumption critique are handled by the Model Audit playbook. When a new tab added under this playbook requires schedule-specific content (e.g. a Debt Build or DCF), delegate content construction to the corresponding modelling playbook while this playbook retains ownership of formatting, placement, and the change summary.
