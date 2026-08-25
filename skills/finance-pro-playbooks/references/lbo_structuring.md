# LBO & Deal Structuring

Playbooks for leveraged buyouts and private-market deal structures: core LBO, debt schedules, sources & uses, structured equity, earnouts, roll-ups, recaps, and sale-leasebacks. Always load `formats/excel_standards.md` and `formats/metric_disambiguation.md` alongside this file when producing Excel output.

## Contents

| Task | Use when |
|---|---|
| [LBO Model](#lbo-model) | Building a full leveraged buyout model from deal mechanics through returns and IC presentation |
| [Debt Schedule (LBO)](#debt-schedule-lbo) | Building a standalone LBO debt schedule covering tranche roll-forwards, CFADS, optional repayment waterfall, and credit metrics |
| [Sources & Uses (S&U)](#sources-&-uses-s&u) | The S&U table itself is the standalone deliverable or is being independently audited |
| [Structured Equity Modeling](#structured-equity-modeling) | Adding a preferred equity sleeve to an existing LBO to model instrument-specific exit waterfalls, year-by-year conversion/redemption decisions, and separate IRR & MOIC for preferred, common, and blended cohorts |
| [Earnout Modeling](#earnout-modeling) | An M&A transaction includes contingent seller consideration payable upon post-close performance |
| [Bolt-On Acquisition Modeling](#bolt-on-acquisition-modeling) | Modeling a buy-and-build or roll-up strategy where a platform company executes multiple tuck-in acquisitions over the forecast period |
| [Dividend Recap Modeling](#dividend-recap-modeling) | A PE-backed portfolio company raises new debt and distributes proceeds as a special dividend, enabling sponsor early liquidity |
| [Sale-Leaseback Modeling](#sale-leaseback-modeling) | Modeling a sale-leaseback (SLB) transaction overlay on an existing LBO, DCF, or 3-statement model to assess accretion/dilution, cash flow impact, and equity value creation |

---

## LBO Model

**Use when**: Building a full leveraged buyout model from deal mechanics through returns and IC presentation | **Deliverable**: Excel workbook — single LBO tab (deal → operating → debt → returns → sensitivity) plus one standalone IC Summary tab

### Ask First
1. What are the entry assumptions — LTM/forward/pro forma EBITDA, entry multiple, and implied purchase price?
2. What is the debt financing structure — senior secured, subordinated, revolver size, and any DDTL tranche?
3. What is the intended hold period and exit multiple assumption, and does the entry or exit fall mid-year (triggering stub handling)?
4. Are any advanced features required — M&A add-ons, dividend recapitalization, management incentive plan (MIP), or earnout? *(Default: all off — confirm before adding complexity.)*

### Workflow

```
Deal Mechanics (transaction details + assumptions + S&U)
→ Financing Assumptions (pro forma debt structure)
→ Operating Model (P&L through net income)
→ Free Cash Flow Build
→ Debt Repayment Waterfall
→ Interest & Debt Schedule (with circular switch)
→ Returns (equity bridge / IRR / MOIC / attribution)
→ Sensitivity Tables
→ IC Summary (standalone tab)

NOTE: All circular cells left blank and linked LAST.
The selected operating case flows through this single LBO tab.
Assumption sets and multi-case toggles may live on separate tabs.
```

**1. Deal Mechanics & S&U**
Build the Sources & Uses side-by-side, same starting row, totals aligned. If rollover equity is specified, use sponsor equity check as the plug; if sponsor equity check is specified, use rollover equity as the plug. Omit irrelevant line items entirely — do not populate with zeros. Use blank columns to accommodate long labels; do not alter column widths. Include the pre-transaction capital structure in the uses side.

**2. Entry Valuation & Equity Bridge**
Match entry and exit multiples to a single consistent metric (LTM / forward / pro forma / run-rate — pick one and hold it throughout). For public targets: quoted price × (1 + control premium) × fully diluted share count (treasury-stock method). For private targets: metric × multiple. In both cases, build the full EV-to-equity-value bridge (EV − net debt − preferred − minority interest + cash) incorporating the pre-transaction capital structure.

**3. Financing Assumptions**
Set financing fee amortization at total fees ÷ tenor (default 5 years); do not amortize beyond the tranche maturity; keep entirely separate from D&A and PP&E schedules. Where no interest rate is specified, apply current approximate market rates.

**4. Operating Model**
Run a standard P&L through net income. Show **Gross Interest Expense** and **Cash Interest Income** as two separate line items. Never net them into a single "Net Interest" line while also showing a standalone interest income row — pick one presentation and hold it. Default cash interest income rate: **0.5%** on average cash balance.

**5. Free Cash Flow Build**
Standard levered FCF. If entry or exit falls mid-year, apply `YEARFRAC()` to compute partial-year cash flows. Present as: full-year row + stub adjustment row + adjusted total row. Do **not** stub debt amortization inside the FCF build — stub amortization belongs only in the individual tranche's amortization row within the debt schedule (double-stubbing is a model-breaking error).

**6. Debt Repayment Waterfall**
Mandatory repayment order: interest → cash sweep → optional repayment → ending balance. Available cash for optional repayment = beginning cash − minimum cash + operating FCF available for sweep. If available cash is negative, draw the revolver to restore minimum cash (up to the revolver limit). No tranche balance may go negative.

**7. Interest & Debt Schedule (Circular Handling)**
Compute interest on **average outstanding balance** (beginning + ending ÷ 2) — this creates the natural interest-cash circular. Build the switch cell: `=IF(Circ=1, average_balance × rate, 0)`. Leave all circular cells blank during construction; link them **last**, after the full model is wired. Enable iterative calculation in workbook settings. **Before final delivery: set Circ = 0 and confirm every circular interest formula resolves to exactly zero.**

**8. Revolver & Sweep Self-Check**
After completing the debt schedule, run these two self-checks:
- If ending cash far exceeds minimum cash yet sweepable debt remains outstanding → sweep formula is broken.
- If the revolver is drawn in a given year yet ending cash exceeds minimum cash → logic is likely broken (absent specific timing factors).
When the revolver hits its limit, flag this explicitly and recommend facility expansion. In base-case illustrative scenarios, the revolver should not be fully drawn — plug any remaining gap with an equity injection rather than leaving a cash hole.

**9. Returns: IRR and MOIC**
Use **XIRR exclusively** — reference the sponsor cash flow row and the date header row. The first value in the series must be the initial equity outflow (negative); the last value must be the exit proceeds (non-zero). `(MOIC^(1/n)) − 1` may be used only as a cross-check; it is not the primary IRR output when interim cash flows exist.

**10. Exit Valuation & Equity Bridge**
Place the exit EV-to-equity bridge in the same column as the exit-year projection. If transaction fees were assumed at entry, assume the same fees at exit (default: same % of total enterprise value). Where M&A add-ons generate new equity consideration, value that equity using linear interpolation between entry and exit multiples.

**11. Sensitivity Tables**
Build entry multiple × exit multiple as the primary sensitivity grid (two-variable data table). Highlight the base-case cell at the center. Confirm that the base-case cell in the sensitivity table equals the directly computed base-case return.

**12. IC Summary Tab (standalone)**
- Fully formula-driven — zero hard-coded values.
- Content fits a single PowerPoint slide as a compact rectangle.
- **Left panel**: transaction and valuation assumptions.
- **Center panel**: P&L summary — Revenue, Adj. EBITDA, Net Income, FCF, Cumulative FCF, Net Debt — annual columns including 2 years of historical data.
- **Bottom panel**: returns sensitivity table — entry price ($ but showing implied entry multiple) × exit multiple; base case centered and highlighted.
- Include implied entry and exit valuation multiples.

**13. Returns Attribution (build only if requested — standalone tab)**
Decompose total sponsor return into three components: (i) EBITDA / Revenue Growth, (ii) Multiple Expansion / Compression, (iii) Leverage Paydown. The three components must sum exactly to total return. If management rollover or co-invest is present, adjust the equity check accordingly — confirm treatment with the user before building.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Minimum cash balance | 2% of current-year revenue | Prevents unrealistic full-sweep scenarios |
| Financing fee amortization period | 5 years | Market convention; do not amortize beyond tranche maturity |
| Debt amortization rate | ≤ 1% p.a. of original principal | Typical institutional term loan amortization |
| Interest rate (if unspecified) | Approximate current market rate | Applied per tranche based on seniority |
| Cash interest income rate | 0.5% on average cash balance | Conservative yield on operating cash |
| IRR formula | XIRR (actual dates) | Handles irregular and mid-year cash flows correctly |
| Advanced features (M&A, div recap, MIP, earnout) | All OFF | Do not add complexity unless explicitly requested |
| Circular switch at delivery | Circ = 0 | Ensures all circular formulas resolve to zero in the final file |
| New equity consideration in M&A add-ons | Valued at linear interpolation between entry and exit multiples | Avoids arbitrary point-in-time assumption |
| Base-case revolver utilization (illustrative) | Not fully drawn | Gap filled with equity injection; fully drawn revolver is flagged, not accepted |

---

### Rules & Pitfalls

**Never:**
- Never hard-code any value that is driven by an assumption — every return, balance, and cash flow must update dynamically when inputs change, because a static cell breaks the model's entire purpose as a scenario tool.
- Never use basic (undiluted) share count for public-to-private entry equity value — it understates dilution and is an immediate credibility failure in any IC review.
- Never present a single "Net Interest" line while also showing a separate interest income row in the same P&L — the double-count corrupts EBITDA-to-FCF reconciliation.
- Never stub debt amortization inside the FCF build when entry or exit falls mid-year — stub amortization belongs only inside the individual tranche's amortization row; doing it in both places double-stubs the cash and overstates debt paydown.
- Never allow any debt tranche balance to go negative — a negative balance signals a broken waterfall and will produce nonsensical IRR outputs.
- Never draw the revolver to fund M&A add-on cash consideration — M&A cash is offset by the DDTL full draw; mixing it into the revolver double-counts the draw and misrepresents liquidity.
- Never set the first XIRR cash flow to a positive value — XIRR will return an error or a meaningless result if the initial outflow is not negative.
- Never leave a cash hole in any period (ending cash below minimum) — plug with incremental equity injection or additional leverage; an uncovered cash hole invalidates the debt schedule and all downstream returns.
- Never include the same M&A cash flow in both the revolver "draws/repayments" row and the DDTL row — that double-counts the financing source and inflates available liquidity.

**Conditional:**
- If the entry or exit date falls mid-year, apply `YEARFRAC()` to partial-year cash flows and present as full-year row + stub adjustment row + adjusted total row; do not skip the stub or simply use a full-year assumption, because it will misstate the IRR by misaligning cash timing.
- If rollover equity is specified, use sponsor equity check as the S&U plug; if sponsor equity check is specified, use rollover equity as the plug — selecting the wrong plug leaves the S&U out of balance.
- If the revolver reaches its limit in any projection period, flag the constraint explicitly and recommend facility upsizing; do not silently cap the draw and leave a cash shortfall.
- If returns attribution is requested, build it on a standalone tab and confirm management rollover / co-invest treatment before building, because adjusting the equity check retroactively breaks the attribution sum-to-total.
- If the source company reports equity value only (e.g., public market cap without disclosed net debt), rebuild EV via the equity bridge (equity + net debt + preferred + minority interest) before applying any entry multiple.
- If any tax year produces a net loss, model it as either generating a tax shield (via NOL carry-forward) or producing zero tax — never generate a negative tax expense without an explicit NOL mechanism, because it creates phantom cash that inflates returns.

**Judgment:**
- Prefer consistency of valuation metric (LTM / forward / pro forma) over mechanical convenience — a mismatch between entry and exit metric is the most common source of spurious multiple expansion in LBO returns.
- In illustrative base cases, size the capital structure so the revolver is not fully drawn — a stressed revolver at close signals insufficient cushion and undermines the investment thesis before the business has had time to perform.
- When no comparables anchor the exit multiple, default to entry multiple (i.e., zero multiple expansion) and present expansion as upside in the sensitivity table — this is the more defensible IC framing.
- Favor structuring fees and transaction costs symmetrically at entry and exit unless there is a clear reason not to (e.g., strategic acquirer exit) — asymmetric fee assumptions introduce IRR noise that is difficult to explain to an IC.

---

### Pre-Delivery Checks

- **Confirm S&U ties out exactly**: Total Sources = Total Uses to the dollar; verify the correct plug (sponsor equity or rollover equity) is active and the opposing side is formula-driven.
- **Confirm balance sheet pro forma balance**: Equity + Total Debt + Other Liabilities = Total Assets on the post-close balance sheet; any imbalance indicates a missing item in the equity bridge or capital structure.
- **Set Circ = 0 and verify all circular formulas return exactly zero**: If any interest cell is non-zero with Circ = 0, the switch is wired incorrectly.
- **Confirm ending cash formula**: `Ending Cash = Beginning Cash + Levered FCF − Mandatory Amortization − Optional Repayments − M&A Outflows − Dividends + Equity Injections` must hold for every projection period.
- **Confirm minimum cash is never breached**: Every period's ending cash ≥ minimum cash (2% of revenue); if breached in any period, plug with equity injection or incremental debt before delivery.
- **Confirm cumulative levered FCF = cumulative net debt change** (measured before dividends, M&A, and equity injections) — a mismatch signals a leak in the cash flow or debt schedule linkage.
- **Confirm no debt tranche balance is negative** in any period.
- **Confirm IRR / MOIC directional logic**: Entry multiple ↑ → IRR and MOIC ↓; exit multiple ↑ → IRR and MOIC ↑; if either relationship is inverted, the equity bridge or cash flow timeline is broken.
- **Confirm sensitivity table base case equals directly computed return**: The center cell of the entry × exit sensitivity table must match the model's own base-case IRR/MOIC to the displayed decimal place.
- **Cross-check IRR against the approximation**: Base-case return ≈ FCF yield + EBITDA growth + multiple expansion/compression; a large unexplained gap signals a structural error in the returns build.
- **If returns attribution is present, confirm the three components sum exactly to total sponsor return**: Growth + Multiple + Leverage Paydown = Total IRR/MOIC; any residual indicates an attribution formula error.
- **Confirm IC Summary tab is fully formula-driven**: Manually change one entry assumption (e.g., entry multiple) and verify that every figure on the IC Summary tab updates without manual intervention.
- **Confirm financing fee amortization does not extend beyond the tranche maturity** and that the amortization line is isolated from D&A and PP&E schedules.

---

### Scope Boundaries

The **LBO Debt Schedule** playbook handles the debt-side mechanics in isolation (tranche sizing, sweep logic, PIK toggles, covenant calculations) when a standalone debt analysis is needed without full model context. The **Dividend Recap / IRR Decomposition / Value Bridge** playbook handles overlay components — mid-hold recapitalizations, granular IRR waterfall decomposition, and management incentive plan modeling — that are additive to this full LBO model rather than built within it.

---

## Debt Schedule (LBO)

**Use when**: Building a standalone LBO debt schedule covering tranche roll-forwards, CFADS, optional repayment waterfall, and credit metrics | **Deliverable**: Excel workbook — capital structure & assumptions block, CFADS bridge, debt waterfall, per-tranche roll-forwards, interest & PIK mechanics (with circularity switch), credit metrics dashboard, and validation block

---

### Ask First
1. What is the entry date, and what is the forecast horizon? *(default: 5 years)*
2. Which tranches are in scope? *(default: Revolver + TLA + TLB; confirm whether mezz, notes, or PIK toggle is required)*
3. What are the base rate inputs — provide SOFR forward curve values for manual hard-coding? *(real-time feeds are not used; see Defaults)*
4. What is the optional repayment waterfall order, minimum cash balance, call premium schedule, and PIK compounding frequency (annual / semi-annual / quarterly)?

---

### Workflow

1. **Lock the assumptions block** — Enter entry EBITDA, leverage multiples, tranche sizes, spreads, mandatory amortization rates, sweep %, minimum cash balance, PIK toggle details, call premium schedule, and SOFR forward curve values as blue hard-coded inputs linked to all downstream driver rows. *(Do this first so every formula below references a single source of truth; no rates are embedded in formulas.)*

2. **Build the CFADS bridge** — Choose one option and apply consistently:
   - **Option 1 (from net income):** OCF = Net Income + D&A + non-cash items (SBC, PIK accrual) ± ΔNWC → FCF = OCF − Capex → CFADS = FCF − mandatory amortization
   - **Option 2 (from EBITDA):** OCF = EBITDA − cash taxes − cash interest ± ΔNWC → FCF = OCF − Capex → CFADS = FCF − mandatory amortization
   - List minimum cash balance as a standalone assumption row; it is the floor that triggers revolver draws.

3. **Build the optional repayment waterfall** — Apply in this sequence each period:
   1. Repay revolver to zero (revolver must be fully repaid before any optional prepayment of term debt)
   2. Apply remaining CFADS above minimum cash to optional prepayments, following the configured tranche order
   - **Cash outflow for any tranche with a call premium = principal × (1 + premium %)**; deduct actual cash spent (principal + premium) from remaining CFADS, not principal alone.
   - Verify that total optional repayments ≤ CFADS for the period.

4. **Build per-tranche roll-forwards** — For each tranche, apply:

   ```
   Opening Balance + Draws − Mandatory Amortization − Optional Prepayment + PIK Accrual = Closing Balance
   ```

   - Repayments and prepayments are **positive quantities** inside the roll-forward (reducing the balance); they appear as **negative (financing cash outflows)** on the cash flow statement. Maintain both sign conventions explicitly.
   - On the maturity date, set mandatory amortization = opening balance (bullet repayment).
   - For the revolver: draws and repayments are driven solely by the minimum cash maintenance logic (Step 5 below); the closing balance must remain within [0, commitment amount].

5. **Build the revolver liquidity mechanism** — The revolver is a **liquidity tool, not a repayment tranche**:
   - Draw revolver when projected cash (before revolver) falls below minimum cash balance; draw only enough to restore minimum cash.
   - Repay revolver when excess cash is available, before any other optional prepayment.
   - Never draw the revolver to fund optional prepayments of other tranches.
   - If the revolver is fully drawn and cash is still below minimum, raise a high-priority flag immediately (see Rules & Pitfalls).

6. **Build interest and PIK mechanics with the circularity switch** — Place the `Circ` toggle cell in the top-left of the sheet:
   - `Circ = 1` → interest calculated on **average balance** = (opening + closing) / 2 *(requires Excel iterative calculation to be enabled — enable before setting Circ = 1)*
   - `Circ = 0` → interest calculated on opening balance *(safe fallback during build)*
   - Formula pattern: `IF(Circ=1, average balance × rate, opening balance × rate)`
   - **Cash interest** flows through CFADS and the income statement.
   - **PIK interest** capitalises into the loan balance (non-cash): add to closing balance via the roll-forward formula; add back as a non-cash item in the cash flow statement; do **not** deduct from CFADS.
   - **Financing fee amortisation** reduces book interest expense on the income statement but is non-cash; exclude it from cash interest and from CFADS.
   - PIK compounding formula must match the compounding frequency assumption (annual / semi-annual / quarterly) — link to the compounding assumption cell.

7. **Build the credit metrics block** — Calculate per period:
   - Total Debt / EBITDA; Net Debt / EBITDA; Senior Debt / EBITDA
   - EBITDA / Cash Interest (interest coverage)
   - (EBITDA − Capex) / Cash Interest (fixed charge coverage)
   - DSCR (Debt Service Coverage Ratio)
   - FCCR (Fixed Charge Coverage Ratio)
   - Equity Cushion
   - If covenant thresholds are provided, add compliance check rows and flag any breach in red.

8. **Build the validation block** — Run every check each period; highlight failures in red:

   #### Validation Checks (Per Period)
   | Check | Test |
   |---|---|
   | Cash continuity | Opening cash = prior period closing cash |
   | Revolver bounds | Revolver balance ∈ [0, commitment amount] |
   | No simultaneous draw and repayment | Revolver draw and revolver repayment cannot both be positive in the same period |
   | Waterfall discipline | Total optional repayments ≤ CFADS for the period |
   | Tranche continuity | Each tranche opening balance = prior period closing balance |
   | No negative balances | All tranche balances ≥ 0 |
   | PIK treatment integrity | PIK accrual added back in CFS; PIK not deducted from CFADS |
   | Cash floor | Closing cash ≥ 0 in every period |

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Forecast horizon | 5 years | Standard LBO holding period |
| Tranches modelled | Revolver + TLA + TLB | Minimum representative capital structure; add mezz/PIK/notes if confirmed |
| Base rate | SOFR forward curve, manually hard-coded as blue inputs | Eliminates live-feed dependency; reviewer can audit every cell |
| Cash sweep % | 100% of excess cash above minimum | Maximises debt paydown; adjust only if credit agreement restricts |
| Call premium | 0% | Conservative base case; override with actual call schedule if provided |
| Optional repayment order | Mezz → Notes → TLB → TLA *(highest spread first)* | Minimises total interest cost; follows market convention |
| PIK tax deductibility | Deductible (treated as accrued interest expense) | Standard treatment; confirm local tax position if jurisdiction is unusual |
| Circularity switch default | Circ = 0 during build; flip to Circ = 1 at completion after enabling iterative calculation | Prevents #REF errors during construction |
| Revolver spread | Linked to TLA spread — not independently hard-coded | Preserves single-source-of-truth for pricing; consistent with typical credit agreement mechanics |

---

### Rules & Pitfalls

**Never:**
- **Never hard-code rates or spreads directly into interest formulas** — always link to the assumptions block; a single rate change should cascade to every affected cell without manual hunting.
- **Never enable Circ = 1 before turning on Excel iterative calculation** — the sheet will immediately return a #REF or circular-reference error and every balance will zero out; this is the single most common debt schedule failure in reviews.
- **Never calculate interest on closing balance only** — using closing balance instead of average balance (Circ = 1) overstates interest expense in paydown-heavy periods and understates it in draw periods, producing a model that does not reflect actual accrual mechanics.
- **Never deduct cash interest twice in the waterfall** — CFADS under Option 2 is already net of cash interest (EBITDA − cash taxes − cash interest); deducting it again in the waterfall double-counts the cash drain and understates repayment capacity.
- **Never deduct PIK interest from CFADS** — PIK is non-cash; deducting it from CFADS understates available cash for debt service and produces an artificially tight liquidity picture.
- **Never draw the revolver to fund optional prepayments of other tranches** — the revolver exists solely to maintain minimum cash; drawing it for prepayments conflates two distinct mechanics, misrepresents liquidity, and violates typical credit agreement restrictions.
- **Never allow closing cash to go negative** — a negative cash balance signals a model error; resolve by reducing optional prepayments or drawing the revolver (subject to its commitment limit), then flag if neither is sufficient.
- **Never include financing fee amortisation in cash interest or CFADS** — fee amortisation reduces book interest expense on the income statement but consumes no cash; including it overstates cash interest and understates CFADS.

**Conditional:**
- **If the revolver is fully drawn and cash remains below the minimum balance,** do not silently default to a negative cash position — raise a high-priority flag to the user that the model is incomplete and additional equity, a larger revolver, or revised operating assumptions are required.
- **If optional prepayments include a call premium,** the cash outflow equals principal × (1 + premium %); the full cash cost (not just principal) must be deducted from remaining CFADS in the waterfall to avoid overstating subsequent repayment capacity.
- **If a tranche reaches its maturity date,** set mandatory amortisation for that period equal to the full opening balance (bullet repayment); do not carry a residual balance forward.
- **If covenant thresholds are provided by the user,** add per-period compliance check rows beneath each relevant credit metric and apply conditional red formatting on any breach — do not omit covenant tracking when the data is available.
- **If PIK compounding is sub-annual (semi-annual or quarterly),** ensure the PIK accrual formula matches the specified compounding frequency and links to the compounding assumption cell; annual-only formulas applied to quarterly PIK will understate accrued principal.
- **If this schedule is embedded in a full LBO model,** link cash interest and PIK accrual rows directly to the host income statement and cash flow statement rather than duplicating figures — the debt schedule is the single source of truth for all debt-side cash flows.

**Judgment:**
- **Prefer Option 2 (EBITDA-based CFADS) when the operating model is owned separately** — it requires fewer cross-model links and makes the cash interest deduction explicit and auditable.
- **Prefer Option 1 (net income-based CFADS) when building a fully integrated model** — it naturally ties the income statement, working capital, and capex assumptions without rebuilding the tax and interest bridge.
- **Set minimum cash balance as a named assumption cell, not an embedded constant** — reviewers will immediately test whether the floor is realistic, and a named cell makes sensitivity testing straightforward.
- **Default to high-spread-first repayment order (mezz → notes → TLB → TLA) in the absence of a specific credit agreement** — this minimises total interest cost over the hold period and is the convention most PE sponsors and credit teams expect to see.

---

### Pre-Delivery Checks

- **Confirm iterative calculation is enabled** in Excel before setting Circ = 1; verify the interest row responds to a test change in the closing balance.
- **Foot each tranche roll-forward**: opening + draws − mandatory amortisation − optional prepayment + PIK accrual = closing balance; any period that does not foot must be corrected before delivery.
- **Verify cash continuity**: opening cash in each period equals closing cash from the prior period — check every column, not just year-end.
- **Confirm revolver balance stays within [0, commitment amount]** in every period; a balance below zero or above the commitment cap indicates a logic error in the draw/repayment formula.
- **Confirm draw and repayment of the revolver are never simultaneously positive** in the same period — simultaneous entries signal a formula conflict.
- **Confirm total optional repayments ≤ CFADS** in every period; a breach means the waterfall is allocating cash that does not exist.
- **Confirm PIK accrual appears as a non-cash add-back in the cash flow statement** and is not deducted anywhere in CFADS or the waterfall.
- **Confirm cash interest and PIK are not both deducted from CFADS** — run a line-by-line trace on the CFADS bridge for the first period to confirm no double-count.
- **Confirm call premium is included in the cash outflow for any prepayment of callable tranches** — spot-check by verifying cash flow out > principal repaid in any period where a premium applies.
- **Confirm closing cash ≥ 0 in every period**; flag any period at or near the minimum cash floor for user review.
- **Confirm all rates and spreads link to the assumptions block** — use Excel's "Trace Dependents" on one rate cell to verify no orphaned hard-codes remain in interest rows.
- **Confirm revolver spread links to the TLA spread cell**, not a standalone hard-coded value.
- **Confirm financing fee amortisation is excluded from the cash interest line** and from CFADS in both Option 1 and Option 2 builds.
- **Review all credit metrics for directional reasonableness**: leverage ratios should decline over the hold period under normal CFADS; coverage ratios should improve; a ratio moving in the wrong direction warrants a formula audit.

---

### Scope Boundaries

The full LBO operating model (revenue build, margin assumptions, returns analysis, IRR/MoM sensitivity tables) is handled by the **LBO Model** playbook — this schedule covers debt-side mechanics only and is designed to be embedded into or linked from that host model.

Dividend recapitalisation events (incremental debt issuance post-close, equity distribution mechanics, re-levering the balance sheet mid-hold) are handled by the **Dividend Recap** playbook, which overlays this schedule rather than replacing it.

Standalone credit agreement compliance monitoring and covenant step-down schedules beyond the flag rows built here are outside scope.

---

## Sources & Uses (S&U)

**Use when**: The S&U table itself is the standalone deliverable or is being independently audited | **Deliverable**: Excel workbook — left/right S&U table (4-column layout) + pro forma capital table with full audit trail, plus two metric reference lines

---

### Ask First
1. What is the transaction type? (LBO entry, M&A, dividend recap, pure refi, take-private, carve-out) — this determines which source and use line items are required.
2. What are the already-sized debt tranches, preferred layers, and rollover amount (in dollars)? Confirm these come from the Debt Schedule — do not re-size here.
3. What is the Purchase Price / TEV, Valuation EBITDA, and Financing EBITDA?
4. What is Cash to Balance Sheet (Day-1 injection) and Minimum Cash (working capital floor)? Confirm these are two separate inputs.

---

### Workflow

1. **Confirm transaction type** (drives which source and use rows are mandatory — do this before touching numbers, because M&A, LBO, take-private, carve-out, and recap each require a different required row set).
2. **Pull in sized debt tranches from the Debt Schedule** — list senior → junior order; do not size tranches here.
3. **Build the left (Sources) side**: Senior debt tranches → Total Debt → preferred layers → Total Preferred → equity block → Total Equity → Total Sources; apply `(x) Financing EBITDA` as the multiplier column for debt and preferred; apply `% equity` for the equity block.
4. **Build the right (Uses) side**: Lead with Purchase Price (TEV) → list fees (advisory separate from financing fees/OID) → Cash to BS → Total Uses; apply `(x) Valuation EBITDA` as the multiplier column for Purchase Price; note that Total Uses `(x)` will exceed entry multiple because it includes fees and Cash to BS — this is expected.
5. **Plug equity as residual**: Total Equity = Total Sources − Total Debt − Total Preferred (this forces Sources = Uses). Cash equity check = Total Equity − Rollover (this is the actual LP wire amount). Do not size equity directly.
6. **Place rollover on both sides**: record rollover as a non-cash source on the Sources side; deduct it from the equity purchase price on the Uses side. One side only is a hard error.
7. **Separate advisory/transaction fees (expensed) from financing fees/OID (capitalized)**: pull financing fees tranche-by-tranche from the Debt Schedule, not top-down.
8. **Hard-check**: `ROUND(Total Sources − Total Uses, 3) = 0`. Resolve before proceeding.
9. **Build pro forma capital table below S&U**: for every adjustment (+)/(−), hyperlink back to the originating S&U line; structure each row as `Pre-Close + (+) − (−) = Pro Forma`; confirm `Pro Forma Assets = Liabilities + Equity`.
10. **Add two metric reference lines** at the bottom of the table: Financing EBITDA ($ value, used for leverage) and Valuation EBITDA ($ value, used for entry multiple). Both must be populated and reconciled to their respective columns.
11. **Run all Pre-Delivery Checks** before releasing.

#### Layout Specification

| Column | Sources Side | Uses Side |
|---|---|---|
| 1 | Line-item name | Line-item name |
| 2 | `(x)` metric (Financing EBITDA for debt/preferred; `% equity` for equity block) | `(x)` metric (Valuation EBITDA for Purchase Price) |
| 3 | $ amount | $ amount |
| 4 | % of Total Sources | % of Total Uses |

**Sources row order**: Senior debt tranche 1 → … → Total Debt → Preferred tranche(s) → Total Preferred → Rollover (non-cash) → Cash Equity Check → Total Equity → **Total Sources**

**Uses row order**: Purchase Price (TEV) → Advisory / Transaction Fees → Financing Fees / OID (by tranche) → Cash to Balance Sheet → **Total Uses**

#### Pro Forma Capital Table — Landing Map

| S&U Item | Pro Forma Balance Sheet Treatment |
|---|---|
| Purchase Price | → Goodwill (excess over net assets acquired) |
| Advisory / transaction fees | → Debit retained earnings Day-1 (expensed) |
| Financing fees / OID | → Contra-debt asset, amortized over each tranche's tenor |
| Cash to BS | → Day-1 cash balance |
| Rollover equity | → Equity (non-cash; no cash settlement) |
| Preferred (debt-like terms) | → Between debt and common; flag classification if terms are debt-like |
| Earnouts / contingent consideration | → Contingent liability footnote; **exclude from S&U totals** |

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Transaction convention | Cash-free / debt-free (CFDF) | PE/M&A market standard: seller retains cash and retires existing debt from proceeds; buyer's Use = TEV |
| Equity sizing method | Residual plug | Equity is not independently sized; it closes the Sources = Uses identity |
| Cash equity check | Total Equity − Rollover | Represents the actual dollar amount the LP wires at close |
| Debt tranche sourcing | Pull from Debt Schedule; never size here | S&U consumes, does not determine, tranche amounts |
| Rollover treatment | Both sides — non-cash Source and deduction from equity purchase price on Uses side | Preserves total transaction size; reduces cash equity check dollar-for-dollar |
| Advisory/transaction fee treatment | Expensed (debit retained earnings Day-1) | GAAP: not a capitalizable asset |
| Financing fee / OID treatment | Capitalized as contra-debt; amortized over each tranche's tenor, pulled tranche-by-tranche | GAAP: debt issuance cost |
| DDTL at close | $0 drawn; committed amount shown as footnote | DDTL is committed but undrawn; drawn only upon qualifying M&A or capex trigger post-close |
| Pro forma net debt | Closing total debt − Cash to BS | Cash to BS is the operative cash figure; Minimum Cash is a separate operating input and must not substitute |
| S&U balance tolerance | `ROUND(Sources − Uses, 3) = 0` | Sub-cent rounding; any larger gap signals a formula or linkage error |
| ITM threshold for take-private option dilution | Relative to offer price, not unaffected market price | Offer price is the economic event; unaffected market price understates dilution and equity purchase price |

---

### Rules & Pitfalls

**Never:**
- **Never add "Refi of Existing Debt" as a Use in a CFDF transaction** — in a clean cash-free/debt-free deal the seller retires its own debt from the proceeds; including a refi Use double-counts the payoff and inflates Total Uses. Flag any CFDF table where refi > $0.
- **Never size debt tranches inside the S&U** — tranche sizing belongs to the Debt Schedule; the S&U pulls finalized amounts. Sizing here breaks the audit trail and creates circular dependency.
- **Never combine advisory/transaction fees with financing fees/OID into a single fee line** — their accounting treatment is opposite (expensed vs. capitalized contra-debt), and merging them misstates both retained earnings and the debt carrying value on the pro forma balance sheet.
- **Never record rollover on one side only** — omitting the rollover deduction from the equity purchase price Use overstates the total transaction size and produces a cash equity check that is too high; omitting it from Sources understates non-cash consideration. Either error causes a material misstatement of the LP wire amount.
- **Never treat buyer stock as a cash Source in an M&A deal** — buyer equity is non-cash consideration; record it as shares × value in the Sources equity block, not as cash. Treating it as cash overstates available funding and misstates the cash equity check.
- **Never use a fixed-exchange-ratio stock deal price at deal announcement as final consideration** — fixed-ratio deals float in value; fixed-value deals float in share count. Build the correct mechanic or flag the deal type.
- **Never record a DDTL as drawn at close** — a committed, undrawn DDTL contributes $0 to Sources at closing; show the commitment as a footnote only.
- **Never double-count target cash in an M&A deal** — target cash reduces TEV via the equity bridge (Purchase Price = Equity Value + Net Debt, where Net Debt = Debt − Cash); do not also add target cash as a separate Source. The buyer's own Cash to BS injection is a separate, distinct item.
- **Never substitute Minimum Cash for Cash to BS** — Minimum Cash is the operating working-capital floor held throughout the hold period; Cash to BS is the Day-1 actual injection. Confusing them misstates both opening liquidity and pro forma net debt.

**Conditional:**
- **If equity plug ≤ $0**, flag immediately — debt and/or preferred are over-financing the deal; reduce leverage or re-examine the capital structure before proceeding.
- **If cash equity check < $0**, flag immediately — rollover exceeds the equity plug; rollover amount must be confirmed and reduced, or total equity sizing must be revisited.
- **If the transaction is a take-private**, build TSM (treasury stock method) using the offer price (not the unaffected market price) to determine diluted share count; add cash settlement for in-the-money options/RSUs, CIC payments, and 280G gross-ups to the equity purchase price; then bridge to TEV by adding assumed net debt and subtracting acquired cash.
- **If preferred has debt-like terms (mandatory redemption, PIK, fixed maturity)**, flag the balance sheet classification — it may belong with debt rather than mezzanine equity; resolve before finalizing the pro forma capital table.
- **If contingent consideration (earnout) is present**, record it as a contingent liability footnote only; exclude from S&U totals to avoid overstating funded consideration.
- **If Financing EBITDA ≠ Valuation EBITDA**, document the reason explicitly in the metric reference lines — the divergence is sometimes intentional (e.g., different add-back sets for leverage vs. entry multiple) but must be disclosed so reviewers can reconcile leverage and multiple independently.
- **If the deal is not CFDF (as-is or buyer directly wires debt repayment)**, add "Refi of Existing Debt" as an explicit Use and add the assumed debt as a Source; in this case refi > $0 is correct and expected.

**Judgment:**
- **Prefer tranche-by-tranche financing fee pull over a blended rate** — lenders negotiate fees by tranche; a top-down blended allocation obscures true all-in cost per instrument and will fail a detailed debt-cost audit.
- **When Total Uses `(x)` exceeds the headline entry multiple, leave it — do not force alignment** — the excess reflects fees and Cash to BS, which are real economic costs of the transaction; flattening it hides true all-in deal cost.
- **Use Financing EBITDA for all leverage checks and Valuation EBITDA for all multiple checks** — mismatching the two (e.g., using Valuation EBITDA to check leverage) will produce leverage ratios that cannot be reconciled to the credit agreement and will be caught immediately by a credit reviewer.
- **In a mixed-consideration M&A deal, confirm whether the exchange ratio is fixed or the value is fixed before building** — the two mechanics produce opposite sensitivities to buyer stock price movements and require different formula structures.

---

### Pre-Delivery Checks
- Confirm `ROUND(Total Sources − Total Uses, 3) = 0`; any non-zero result is a hard stop.
- Confirm equity plug > $0 (negative equity flags over-leverage).
- Confirm cash equity check > $0 (negative flags rollover exceeding plug).
- Confirm rollover appears on both the Sources side (non-cash source) and the Uses side (deduction from equity purchase price).
- Confirm TEV = Entry Multiple × Valuation EBITDA.
- Confirm TEV tie-out identity holds: TEV implied by Sources side = TEV implied by Uses side, using gross TEV and gross total equity (rollover netted once per side, not re-netted in aggregate).
- Confirm two metric reference lines are populated: Financing EBITDA ($ amount, leverage basis) and Valuation EBITDA ($ amount, entry-multiple basis); confirm each is consistent with the column it drives.
- Confirm Pro Forma Net Debt = Closing Total Debt − Cash to BS (not Minimum Cash).
- Confirm financing fees/OID land in contra-debt on the pro forma balance sheet; confirm advisory fees debit retained earnings.
- Confirm financing fees were pulled tranche-by-tranche, not applied as a blended top-down rate.
- Confirm every pro forma capital table adjustment hyperlinks back to its originating S&U line.
- Confirm `Pro Forma Assets = Pro Forma Liabilities + Pro Forma Equity` (balance sheet foots).
- Confirm DDTL is shown at $0 drawn with commitment in footnote.
- **Flag if any of the following thresholds are breached** (requires explanation before delivery):
  - CFDF transaction shows Refi of Existing Debt > $0
  - Total fees > 5% of TEV
  - Total leverage > 10.0×
  - Cash to BS > 10% of TEV
  - Junior debt tranche > Senior debt tranche (inverted capital stack)
  - Cash equity check < 20% of Total Sources or > 70% of Total Sources
- In a take-private, confirm ITM dilution was calculated relative to offer price, not unaffected market price.
- In an M&A deal with buyer stock, confirm buyer stock is recorded as a non-cash source with share count and value disclosed; confirm it does not appear in the cash funding line.
- Confirm target cash is not double-counted (not both embedded in TEV bridge and added as a separate Source).

---

### Scope Boundaries
The LBO, Merger Model, Dividend Recap, and IPO playbooks each contain an integrated S&U section; load this playbook only when the S&U table is the standalone deliverable or is being independently audited — do not rebuild a full model S&U here. Debt tranche sizing (commitment amounts, pricing, amortization) is handled exclusively by the LBO Debt Schedule playbook; this playbook consumes finalized tranche outputs only. Pro forma income statement and full integrated three-statement adjustments are handled by the relevant transaction model playbook, not here.

---

## Structured Equity Modeling

**Use when**: Adding a preferred equity sleeve to an existing LBO to model instrument-specific exit waterfalls, year-by-year conversion/redemption decisions, and separate IRR & MOIC for preferred, common, and blended cohorts | **Deliverable**: Excel workbook with 4 tabs (Assumptions / S&U / LBO Model / Sensitivities)

---

### Ask First

1. **Instrument type** — Which of the four instruments applies: convertible preferred, participating preferred, redeemable + warrant, or pure PIK? If the instrument combines features (e.g., convertible with a hard liquidation preference), confirm the full feature set before proceeding.
2. **Key terms** — Face amount, coupon rate (cash vs. PIK split), liquidation preference multiple, conversion price, participation cap (if any), warrant coverage (if applicable), and any redemption schedule.
3. **Waterfall priority** — Does the credit agreement require the optional debt sweep to rank above cash preferred dividends, or does preferred rank above the sweep (confirm against actual covenants)?
4. **Cohort ownership** — Is the preferred held by the sponsor or a third party? (Determines which cohort results to foreground in delivery.)

> **Hard stop**: If the deal involves multiple preferred series with differing terms (VC-style stacked rounds, anti-dilution, MFN, or drag-along provisions), stop and inform the user — this playbook covers a single-sponsor preferred sleeve only.

---

### Workflow

1. **Build and foot the common-only baseline LBO first** *(never introduce the preferred sleeve into a model that has not yet tied out; debugging conversion logic on top of a floating baseline is the primary source of cascading errors).*

2. **Nail down the instrument type** — Confirm which of the four instruments applies and map its exit waterfall logic before touching any formula:
   - *Convertible*: exit payoff = MAX(cumulative PIK balance, liquidation preference × face, as-converted value)
   - *Participating*: liquidation preference + pro-rata participation in residual proceeds (cap applies to the participation slice only, not total proceeds; participation is automatic, not elective)
   - *Redeemable + warrant*: redemption value + warrant value; set the `detachable` flag to determine accounting treatment
   - *Pure PIK*: treat as deep subordinated debt; exits via full redemption of accreted balance

3. **Capture all terms into the Assumptions tab** — Record face value, coupon rate (split-coupon legs separately, e.g., 8% cash + 4% PIK as two distinct line items), liquidation preference multiple, conversion price, participation cap, warrant coverage, and redemption schedule.

4. **Build S&U and cap table with three blocks; list preferred as a standalone line** *(never roll preferred into debt or common equity)*:
   - Transaction Details panel
   - Two-column Sources & Uses (preferred on its own row)
   - Pro Forma Financing Structure table
   - For convertibles: show maximum dilution on full conversion
   - For participating preferred: show preferred ownership % AND participation % as two distinct figures

5. **Integrate preferred into the three financial statements** — Apply `Pref Switch (0/1)` as a gate on every preferred-related formula:
   - **Income statement**: deduct preferred dividends *below* net income (after-tax line); preferred dividends are not tax-deductible
   - **Balance sheet**: roll preferred balance as `face + cumulative accreted PIK − cash payments made`; track original face and cumulative accreted balance in separate rows
   - **Cash flow**: PIK accrual is non-cash — add back only when starting from "net income attributable to common" (i.e., already net of preferred); cash coupon payments are real outflows

6. **Position cash preferred payments in the cash waterfall** — Default sequence: mandatory debt service → **cash preferred dividends** → optional debt sweep/cash sweep. Flag that most credit agreements treat cash preferred dividends as restricted payments; confirm covenant language. Note that preferred and sweep compete for the same dollar pool; preferred-above-sweep is the default but is configurable.

7. **Build the preferred PIK roll and annual exit waterfall on the LBO Model tab** (vertical stack order: IS → FCF → debt schedule → preferred PIK roll → cash waterfall → annual exit waterfall → conversion decision → cohort returns → local restatement).

8. **Build the conversion decision as a three-way MAX with no circular reference**:
   - `Pref payoff = MAX(cumulative PIK balance, liquidation preference × face, as-converted value)`
   - `Total Equity Pre-Pref = Exit EV − transaction fees + cash − senior debt` — this figure is independent of the conversion flag, which is what eliminates the circular reference
   - Wire the conversion flag to reference `Total Equity Pre-Pref` directly; never reference a downstream cell that already depends on the flag
   - Run the decision for **every projection year**, not only the scheduled exit year; the breakeven year itself carries analytical signal (early years: floor binding, preferred takes kicker; Year 3+: typically converts)
   - Flip diluted share count only in years where conversion = "Y"; a static share count breaks per-share math

9. **Build three cohort sensitivity tables on the Sensitivities tab** (common / preferred / blended), with axes of exit multiple × exit year:
   - Preferred table behavior: cumulative PIK floor → IRR approximately flat across years; fixed liquidation preference dollar floor → IRR declines year-over-year (label which constraint is binding in each cell)
   - Each cell contains one number; no merged cells
   - Sensitivity body cells: use sign-aware `MOIC^(1/t)−1` approximation: `=SIGN(MOIC)*ABS(MOIC)^(1/n)−1` to prevent `#NUM!` on negative base

10. **Run all pre-delivery sanity checks** (see section below).

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| PIK accrual | Cumulative, annual compounding | Market standard for sponsor preferred |
| Preferred dividend type | PIK / cumulative | Most conservative baseline |
| Conversion price | Entry price (1:1 share conversion) | Standard unless term sheet specifies otherwise |
| Liquidation preference structure | Greater-of (downside protection, not additive) | More common than stacked/additive; flag and confirm against term sheet |
| Preferred tax treatment | Non-deductible (below-the-line) | U.S. GAAP; preferred dividends are not interest |
| Primary return metric | XIRR | Handles interim cash flows (cash coupons, PIK-toggle, partial redemptions, recaps); `MOIC^(1/t)−1` is reserved for single-in / single-out sensitivity bodies |
| Cash preferred position in waterfall | Preferred-above-sweep | Conservative default; configurable; flag against covenant language |
| Instrument waterfall | Convertible preferred default (three-way MAX) | Most common sponsor structure; overridden once instrument is confirmed |
| Pref Switch | 0/1 binary applied to every preferred formula | Switch = 0 must exactly restore the common-only baseline |
| Cohort reporting | All three cohorts (preferred / common / blended) | Blended alone masks cohort-level results |

---

### Rules & Pitfalls

**Never:**
- **Never use the wrong exit waterfall for the instrument type** — convertible, participating, redeemable + warrant, and pure PIK have fundamentally different exit logic; using the wrong waterfall is the single most common and most credibility-destroying error in this product.
- **Never deduct preferred dividends above the tax line** — preferred dividends are not tax-deductible in the U.S.; deducting them as interest overstates tax shield and misstates net income attributable to common equity.
- **Never add back PIK accrual to cash flow starting from net income before the preferred deduction** — PIK is non-cash but is a distribution to preferred holders; the add-back is only valid when the starting cash flow line is already net of preferred.
- **Never use a static (non-toggling) diluted share count** — include preferred-converted shares in diluted count only in years where conversion = "Y"; a static count produces wrong per-share values in every non-conversion year.
- **Never use `MOIC^(1/t)−1` as the primary IRR when interim cash flows exist** — cash coupons, PIK-toggle switches, partial redemptions, and recaps all invalidate this shortcut; use XIRR.
- **Never mix original face and cumulative accreted balance in the same cell** — face is the conversion base (`face ÷ conversion price = preferred share count`); cumulative accreted balance is the no-conversion floor; conflating them breaks conversion math.
- **Never apply a participation cap to total proceeds** — the cap constrains only the participation slice; the liquidation preference tranche is uncapped.
- **Never introduce the preferred sleeve before the baseline LBO ties out** — doing so forces simultaneous debugging of circular conversion logic and baseline errors.
- **Never use the textbook shortcut conversion formula on a "liquidation preference + kicker" structure** — it is incorrect for combined-feature instruments; use direct three-way MAX comparison.

**Conditional:**
- **If the instrument combines features** (e.g., convertible with a hard liquidation preference, or participating with a PIK toggle), confirm the complete feature set before building the waterfall — hybrid instruments require explicit mapping of which feature governs in each exit scenario.
- **If the coupon is split** (e.g., 8% cash + 4% PIK), capture each leg as a separate line item in the model; a blended rate loses the cash/non-cash distinction needed for the waterfall and cash flow statement.
- **If the credit agreement imposes a mandatory sweep covenant**, override the preferred-above-sweep default and set sweep-above-preferred; flag the change in the model header.
- **If preferred is held by a third party** (not the sponsor), report all three cohorts but foreground the common-only cohort — that is what the sponsor cares about.
- **If `Pref Switch = 0` does not exactly restore the common-only baseline**, a preferred leak exists somewhere in the model; locate and fix before proceeding to conversion logic.
- **If the liquidation preference structure is additive** (stacked, mini-participating) rather than greater-of, override the default and flag it explicitly — additive structures are less common and materially change downside payoffs.
- **If exit proceeds are insufficient to cover the liquidation preference**, preferred IRR is still calculable (partial recovery); flag the impairment scenario explicitly in the sensitivity table.

**Judgment:**
- **Confirm greater-of vs. additive liquidation preference against the actual term sheet** — the default (greater-of) is more prevalent but getting it wrong overstates or understates downside protection materially.
- **Report the conversion breakpoint year as an analytical output, not just a flag** — the year in which conversion becomes optimal is itself informative: early floor-binding years signal downside protection is active; later conversion years signal equity upside is driving preferred value.
- **Run sensitivities on all three cohorts on shared axes** — a blended-only sensitivity table is acceptable for internal speed but masks the preferred/common split that LPs and co-investors will interrogate.
- **Prefer XIRR even when a deal appears to have no interim cash flows** — PIK-toggle provisions can be exercised mid-hold; building XIRR in from the start avoids a retroactive model rebuild.
- **Flag pref-vs-sweep ordering prominently at delivery** — most credit agreements classify cash preferred dividends as restricted payments; the ordering assumption has real compliance implications and reviewers will ask.

---

### Pre-Delivery Checks

- **Verify preferred coupon rate > interest rate on all senior debt tranches above it** in the capital structure (preferred must price above senior risk).
- **Verify that in the conversion year, preferred IRR = common equity IRR** (1:1 conversion implies identical returns at the margin).
- **Verify that in all floor-binding years (no conversion), preferred IRR > common equity IRR** (preferred holder is overcompensated relative to common in downside scenarios).
- **Set `Pref Switch = 0` and verify the model output exactly equals the common-only baseline** — any residual difference indicates a preferred formula is not gated by the switch.
- **Verify fully diluted ownership across all cohorts sums to 100%** in every exit year.
- **Verify balance sheet preferred balance = original face + cumulative PIK accreted − cumulative cash payments made** at every period end.
- **Verify that in any year where conversion flag = "Y", as-converted value > cumulative accreted balance AND > liquidation preference × face** (i.e., the MAX is correctly selecting as-converted).
- **Verify that cash preferred payments reduce available cash for the optional debt sweep** — cash preferred should not reduce exit bridge proceeds independently; it must flow through the cash waterfall before sweep.
- **Verify S&U does not double-count existing debt** (rollover debt should appear once, not in both existing-debt payoff and new-debt raise).
- **Verify the primary return output uses XIRR; verify all sensitivity body cells use `SIGN(MOIC)*ABS(MOIC)^(1/n)−1`** — do not mix the two formulas.
- **Verify the conversion flag references `Total Equity Pre-Pref` and no downstream cell that itself references the flag** (circular reference test: set Excel to manual calculation and confirm no iteration is required).
- **Verify participating preferred sensitivity table shows participation cap applied only to the participation slice**, not to the total exit proceeds allocated to preferred.

---

### Scope Boundaries

This playbook covers a single-sponsor preferred equity sleeve layered onto an LBO with one set of preferred terms. For a liquidation distribution analysis with no operating model, use the **Term-Sheet Waterfall** playbook. For management incentive pool (ratchet, sweet equity, hurdle structures), use the **MIP** playbook. For multi-series preferred stacks with differing terms, anti-dilution provisions, MFN rights, or drag-along mechanics (VC-style cap table), stop and escalate — that workflow is outside this playbook's scope.

---

## Earnout Modeling

**Use when**: An M&A transaction includes contingent seller consideration payable upon post-close performance | **Deliverable**: Earnout overlay module (assumption block + payment calculation block + integrations) layered on top of an existing LBO / M&A / DCF base model

---

### Ask First

1. **Performance metric** — Which KPI governs payment? (Default: EBITDA; confirm whether the purchase agreement specifies pro-forma, adjusted, or synergy-adjusted EBITDA — never assume headline EBITDA)
2. **Payment mechanism & structure** — Binary, Sliding Scale, Tiered/ratchet, Milestone (probability-weighted), Multi-Year (with catch-up), Exit/MOIC-triggered, or Reverse/Clawback?
3. **Key economic terms** — Target threshold(s), measurement period, hard cap (if not provided, ask before proceeding — typical range: 5–25% of TEV), Change-of-Control acceleration clause, funding source, payment timing, and tax deductibility
4. **Employment linkage** — Is the earnout conditioned on continued employment of the seller/founder? (Determines whether it must be reclassified as compensation expense)

---

### Workflow

1. **Build the standalone base model first** (operating model + transaction model, with no earnout present) — earnout is a pure overlay; the base must be complete and locked before the earnout layer is added, so that performance forecasts cannot be reverse-engineered to hit earnout targets.

2. **Confirm all earnout structure inputs in one pass** (use the Ask First questions above); capture: performance metric and its exact contractual definition, payment mechanism type, target amount(s), measurement period, cap, CoC acceleration treatment, funding source, payment timing, and tax deductibility.

3. **Build the Earnout Assumption Block**
   - Hard-code only contractual terms (targets, cap, mechanism type)
   - Include an **Earnout Switch (0/1 toggle)** — mandatory; used for scenario/sensitivity toggling
   - Label the cap explicitly; if user has not provided one, pause and ask

4. **Build the Payment Calculation Block (formula-driven)**
   - Pull the performance metric via `INDEX/MATCH` or `XLOOKUP` from the operating model — never hard-code the achievement value
   - Apply mechanism logic:
     - *Binary*: `IF(metric ≥ target, max_earnout, 0)`
     - *Sliding Scale*: linear interpolation between floor and cap; apply `MAX(0, MIN(cap, formula))`
     - *Tiered/Ratchet*: nested `IF` or lookup table with `MAX`/`MIN` guards at each tier boundary
     - *Milestone*: probability-weight each event; use 0% / 50% / 100% scenario structure for biotech/venture
     - *Multi-Year with catch-up*: calculate cumulative achievement against cumulative target; include catch-up true-up row
     - *Exit/MOIC-triggered*: split into three rows — **pre-earnout MOIC (used for threshold test) → earnout payment → post-earnout MOIC (true return)**; flag manually if threshold boundary is within ±0.1x
     - *Reverse/Clawback*: model as **negative contingent consideration** (buyer cash inflow); if there is an escrow holdback, record as a Day-1 Use and release based on outcome
   - Apply the Earnout Switch: multiply all payment outputs by the switch cell so that Switch = 0 zeroes every downstream line simultaneously

5. **Integrate into the base model — four connection points**

   **a. Free Cash Flow**
   - Place earnout outflow **below EBITDA → below capex → below ΔNWC** (it is a financing/consideration cash flow, not an operating cost)
   - Record cash outflow only in the payment year
   - If funding source is revolver or acquisition debt (only when covenants permit), model the draw in the debt schedule; do **not** assume new debt funds the earnout unless explicitly specified
   - If earnout exceeds available FCF, apply the following waterfall: FCF → revolver/acquisition debt (covenant-permitting) → sponsor equity top-up → escrow
   - **Flag** if annual earnout outflow exceeds 10% of leveraged FCF for that year (potential restricted-payment covenant breach)

   **b. Tax Schedule**
   - Deduct earnout from Tax EBIT **only** in the payment year **and only** if the earnout is contractually tax-deductible
   - If employment-linked (reclassified as compensation), treat as always tax-deductible, flowing through operating profit rather than fair-value remeasurement
   - Never apply the tax shield in non-payment years; never apply it if deductibility has not been confirmed

   **c. Sources & Uses / Entry Multiples**
   - Do **not** include earnout in Day-1 S&U under any scenario
   - Strip the earnout out of any seller-quoted headline TEV (sellers commonly include maximum earnout in the headline to inflate perceived value); use **firm consideration only** for entry multiples and S&U
   - For strategic M&A: follow ASC 805 — recognize contingent consideration at fair value on Day 1 (disclosure only); subsequent fair-value remeasurement flows through P&L as non-cash; this does **not** affect the FCF model

   **d. Exit & Returns (IRR / MOIC)**
   - Earnout payments made before exit: already captured in FCF; do **not** also deduct from exit proceeds (double-count trap #1)
   - Earnout still alive at exit: deduct **remaining liability** from exit equity proceeds; CoC clause will trigger automatic payment at maximum regardless of actual performance
   - If FCF is built up from net income and the earnout has already been expensed in the P&L (as compensation or fair-value remeasurement): **add back the expense first, then deduct the earnout as a separate cash outflow** — otherwise cash is reduced twice (double-count trap #2)

   **e. Debt Covenants**
   - Flag any year where earnout outflow could breach restricted-payment or leverage covenants
   - If employment-linked earnout is reclassified as compensation, add it back to **Adjusted EBITDA** so it does not compress the EBITDA figure used for leverage ratios, exit multiples, and covenant calculations

6. **Run all sanity checks** (see Pre-Delivery Checks)

#### Earnout Assumption Block — Suggested Layout

| Row | Label | Notes |
|---|---|---|
| 1 | Earnout Switch | 0 = off, 1 = on |
| 2 | Performance Metric | e.g., Adjusted EBITDA — per purchase agreement definition |
| 3 | Target (Year N) | Contractual; one row per measurement year |
| 4 | Cap | Hard maximum; default = user-specified % of TEV |
| 5 | Mechanism Type | Binary / Sliding / Tiered / Milestone / Multi-Year / Exit / Clawback |
| 6 | CoC Acceleration | Yes → pay at max upon exit |
| 7 | Funding Source | FCF / Revolver / Escrow |
| 8 | Payment Year | Measurement year (default) or measurement year + 1 (precision mode) |
| 9 | Tax Deductible? | Yes / No |
| 10 | Employment-Linked? | Yes → reclassify as compensation |

#### Scenario Coverage by Deal Type

| Deal Type | Typical Earnout Size | Default Mechanism | Key Adjustment |
|---|---|---|---|
| Strategic M&A | 5–25% TEV | Binary or Sliding | ASC 805 fair-value disclosure; non-cash P&L remeasurement |
| Founder / Roll-up | 20–40% TEV | Sliding or Tiered | Employment-linkage → reclassify compensation; add back to Adj. EBITDA |
| Venture / Biotech | Variable | Milestone | Probability-weight at 0% / 50% / 100% |
| Minority / Growth | Valuation ratchet | Ratchet | Cash exit: deduct from proceeds; share-adjustment only: adjust effective entry multiple, no FCF impact |
| Carve-out / Turnaround | Avoid | — | Baseline unclear; performance driven by sponsor — earnout mechanism is unreliable |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Performance metric | EBITDA | Most common contractual KPI; override if purchase agreement specifies pro-forma or adjusted definition |
| Payment mechanism | Binary | Simplest and most conservative starting point |
| Measurement period | Single year | Most common; extend to multi-year only if specified |
| Cap | Must confirm with user before proceeding | Typical observed range: 5–25% of TEV |
| Change-of-Control acceleration | Yes — pay at maximum | Standard market practice; CoC triggers full payment regardless of actual performance |
| Funding source | FCF | Default cash source; revolver or new debt requires explicit covenant clearance |
| Payment timing | Same year as measurement period ends | Moves to following year (FYE + 60–120 days) when precision is required or mid-hold exit is modeled |
| Tax treatment | Deductible | Deduct from Tax EBIT in payment year only; reverse immediately if user specifies non-deductible |
| Earnout in Day-1 S&U | Excluded | Earnout is contingent — including it at Day 1 overstates equity contribution and entry leverage |
| Earnout in headline TEV / entry multiples | Excluded (firm consideration only) | Seller CIM figures often include maximum earnout; strip it out before computing entry multiples |
| EBITDA impact | Zero | Earnout is a financing/consideration cash flow; EBITDA margin is unchanged unless explicitly reclassified as compensation |

---

### Rules & Pitfalls

**Never:**
- **Never include earnout in the headline closing price or entry multiple** — it is contingent consideration; including it inflates perceived transaction value and distorts leverage/return metrics. Seller CIMs routinely embed the maximum earnout in the quoted TEV to anchor negotiations; always back it out to arrive at firm consideration.
- **Never include earnout at maximum in Day-1 Sources & Uses** — it overstates Day-1 equity contribution and implied entry leverage; this is a classic LBO model credibility error.
- **Never deduct earnout from EBITDA** — it is a financing/consideration cash flow, not an operating expense. EBITDA margin must remain unchanged (unless the earnout has been explicitly reclassified as compensation expense, in which case it flows through operating profit and must be added back to Adjusted EBITDA).
- **Never hard-code the achievement value** — always `XLOOKUP`/`INDEX-MATCH` the metric from the operating model; hard-coded achievement values cause sensitivity tables to produce incorrect results silently.
- **Never reverse-engineer the operating forecast to hit the earnout target** — build the base model on its own economic merits first; the earnout layer must overlay an independently constructed forecast.
- **Never assume new debt funds the earnout** unless the user has explicitly confirmed this and covenant headroom has been validated.
- **Never apply the tax shield outside the payment year, or when deductibility is unconfirmed** — omitting the shield overstates cash taxes; applying it incorrectly understates them.

**Conditional:**
- **If the seller has quoted a TEV that includes the maximum earnout**, back out the earnout to isolate firm consideration before calculating entry multiples and Day-1 S&U.
- **If the earnout is conditioned on continued employment**, reclassify it entirely as compensation expense: treat it as always tax-deductible, flow it through operating profit (not fair-value remeasurement), and add it back to Adjusted EBITDA so it does not compress the EBITDA used for leverage ratios, exit multiples, and covenant tests.
- **If the deal is strategic (ASC 805)**, recognize contingent consideration at fair value on Day 1 for disclosure purposes; subsequent fair-value remeasurement flows through P&L as non-cash and does not affect the FCF model.
- **If FCF is built up from net income and the earnout has already been expensed in the P&L** (as compensation or fair-value remeasurement), add back the expense before deducting the earnout as a separate cash outflow — failure to do so reduces cash twice (double-count trap #2).
- **If the same earnout is paid before exit and also deducted from exit proceeds**, eliminate one deduction — determine whether the payment occurs pre-close or is assumed by the buyer and deducted from the purchase price; it can only reduce returns once (double-count trap #1).
- **If an earnout is still outstanding at exit**, deduct the remaining liability from exit equity proceeds; apply CoC acceleration at maximum regardless of actual year-to-date performance.
- **If the earnout mechanism is MOIC-triggered**, split into three rows — pre-earnout MOIC (threshold test) → earnout payment → post-earnout MOIC (true return) — to avoid circular references; flag for manual review if the threshold boundary is within ±0.1x.
- **If funding the earnout requires drawing the revolver or acquisition debt**, confirm covenant permission (restricted-payment and leverage tests) before modeling the draw.
- **If the deal is a carve-out or turnaround**, flag that earnout mechanics are unreliable because the performance baseline is ambiguous and post-close results are sponsor-driven; recommend avoiding earnout structures in the term sheet.
- **If the seller holds both rollover equity and a large earnout**, flag management-alignment and retention risk — the seller is doubly tied to post-close performance, which concentrates key-person dependency.
- **If the earnout is a Reverse/Clawback structure** (seller refunds below a performance floor), model it as negative contingent consideration (buyer cash inflow); if there is an escrow holdback, record it as a Day-1 Use and release conditionally based on performance.
- **If payment timing precision is required or a mid-hold exit is being modeled**, shift the payment from the measurement year to the following fiscal year (FYE + 60–120 days, to reflect standard audit completion timelines).
- **If the deal is minority/growth equity with a valuation ratchet**, adjust the effective entry multiple and implied ownership percentage; record no FCF impact unless the ratchet triggers a cash payment upon exit.

**Judgment:**
- **When the earnout target is at or below LTM / entry-level performance**, treat payment as near-certain and flag to the deal team that it should be included in the headline price — a below-market target is economically equivalent to deferred fixed consideration.
- **Prefer the purchase agreement's specific EBITDA definition over any other** — pro-forma, synergy-adjusted, and as-reported EBITDA can diverge materially; using the wrong definition misstates both the achievement test and the tax shield.
- **When annual earnout outflow exceeds 10% of leveraged FCF for that year**, proactively flag potential restricted-payment covenant exposure before the model is presented — do not wait for the covenant check to surface it.
- **For venture/biotech milestone earnouts**, use the 0% / 50% / 100% three-scenario structure as the default probability framework rather than a single point estimate, because milestone achievement is binary in nature and a single probability-weighted figure obscures the distribution.

---

### Pre-Delivery Checks

- **Verify** that all achievement values are formula-driven (pulled from operating model via lookup) and that no earnout metric cell contains a hard-coded number
- **Verify** earnout payment in each year is ≥ 0 and ≤ cap; for Sliding Scale mechanisms, confirm that the MIN/MAX guards produce exactly 0% payout at the floor and exactly 100% payout at the cap
- **Verify** FCF cash outflow is recorded only in the payment year — no leakage into adjacent years
- **Verify** tax shield is applied only in the payment year and only where deductibility = Yes
- **Verify** for multi-year earnouts: sum of all annual outflows equals the total contractual earnout amount — catches phasing errors
- **Verify** Earnout Switch = 0 produces zero in every downstream cell: FCF outflow, tax shield, IRR, MOIC — no residual traces
- **Verify** Earnout Switch = 1 causes IRR and MOIC to decrease relative to Switch = 0; if they increase or are unchanged, the earnout is not flowing through the returns model
- **Verify** Sliding Scale boundary conditions: at exactly the minimum threshold → 0% payout; at exactly the maximum threshold → 100% / cap payout
- **Verify** exit-year earnout is deducted exactly once — either as a pre-exit FCF outflow or as a deduction from exit proceeds, but not both
- **Flag** if total earnout cap exceeds 25% of TEV — this is structurally abnormal and warrants deal-team discussion
- **Flag** if the earnout target is ≤ LTM or entry-level performance — near-certain payment; recommend reclassifying as headline consideration
- **Confirm** payment year is not earlier than the measurement year — a payment-year cell that precedes the measurement year indicates a formula error
- **Confirm** measurement year falls within the hold period — a measurement year beyond the exit year will return `#N/A` or a blank; flag immediately
- **If MOIC-triggered**: confirm pre-earnout MOIC (threshold test) and post-earnout MOIC (true return) are in separate rows; verify no circular reference exists; flag manually if threshold boundary is within ±0.1x

---

### Scope Boundaries

Earnout Modeling covers only the **seller's contingent consideration** layered on top of an existing LBO, M&A, or DCF base model. Management carry, options, and post-close incentive plans are handled by the **Management Incentive Plan** playbook. Liquidation preference, participation rights, and waterfall distributions among investor classes are handled by the **Term-Sheet Waterfall** playbook.

---

## Bolt-On Acquisition Modeling

**Use when**: Modeling a buy-and-build or roll-up strategy where a platform company executes multiple tuck-in acquisitions over the forecast period | **Deliverable**: Standalone M&A tab (sections A–H) bolt-on to an existing LBO workbook, plus a "With M&A vs. Without M&A" return-comparison summary

---

### Ask First
1. Is the primary acquisition input **EBITDA at acquisition** or **revenue at acquisition**?
2. Should margin expansion be modeled as **post-synergy target margin with a linear phase-in schedule**, or as **annual basis-point expansion**?
3. What is the acquisition debt instrument and structure (e.g., DDTL, revolving credit, term loan)?
4. What are the **acquisition multiple**, **organic growth rate**, and **synergy targets** for the platform?

---

### Workflow

1. **Confirm key assumptions** (primary input type, margin convention, debt instrument, acquisition multiple, organic growth rate, number of acquisitions per year) — do not build until these are locked.

2. **Build the M&A Assumptions Block** — centralize all cohort-level inputs (acquisition EBITDA or revenue, entry multiple, synergy target, phase-in periods, organic growth rate, margin at acquisition, post-synergy margin) in a single input zone at the top of the M&A tab.

3. **Section A — M&A Summary** — aggregate-level acquisition schedule: acquisition year, cohort label, acquisition EBITDA, implied acquisition price, debt drawn, equity injected. This is the control panel; all downstream sections reference it.

4. **Section B — M&A Sources & Uses (Funding Waterfall)** — build the per-acquisition waterfall: FCF available → acquisition debt capacity (DDTL draw subject to leverage constraint) → residual equity check. Equity is the residual; only drawn after FCF and debt capacity are exhausted. Compute per period: *Capacity = Maximum Leverage × Pro-Forma EBITDA − Opening Cumulative Acquisition Debt*; draw may never exceed capacity.

5. **Section C — Revenue Triangle** — rows = acquisition cohort year; columns = forecast years. Apply **three-state logic**:
   - Forecast year = acquisition year → enter acquisition-year revenue (back-solved as *EBITDA at acquisition ÷ margin at acquisition* if EBITDA-driven)
   - Forecast year > acquisition year → prior-year cohort revenue × (1 + organic growth rate)
   - Forecast year < acquisition year → 0 (cohort does not yet exist)
   
   Bottom row = cross-cohort sum rolled into the consolidated operating model. (Build before EBITDA triangle because EBITDA = Revenue × Margin.)

6. **Section D — EBITDA Margin Triangle** — same cohort/year structure. For each cohort, margin in year *t* = acquisition margin + (post-synergy target margin − acquisition margin) × linear phase-in fraction. **Phase-in clock starts at each cohort's own acquisition year, not the model's first year.** A 2026 cohort in 2030 should show a more mature margin than a 2030 cohort in the same column, unless the assumption explicitly differs.

7. **Section E — EBITDA Triangle** — each cell = Revenue Triangle × Margin Triangle (same cohort, same year). Bottom row = consolidated M&A EBITDA rolled into the LBO.

8. **Section F — Capex Triangle** — same three-state logic; rows = cohort, columns = forecast year. Apply cohort-level capex as % of revenue (or absolute) consistent with platform capex intensity.

9. **Section G — NWC Balance & Change Triangle**
   - NWC balance: three-state logic, % of revenue convention.
   - **Year-1 deflation (first year of each cohort):** Back-solve the opening NWC balance as *Year-1 Ending Balance ÷ (1 + organic growth rate)*. Year-1 ΔNWC = Ending Balance − Back-solved Opening. This isolates the true working-capital build from scratch and prevents the full balance from inflating Year-1 cash consumption. (This is the single most commonly mis-built cell in the triangle.)
   - Subsequent years: ΔNWC = Ending Balance − Prior-Year Ending Balance, grown on **full-year implied revenue**, not a stub period.

10. **Section H — Acquisition Price Triangle** — acquisition price appears **only on the diagonal** (i.e., only in the cell where forecast year = acquisition year). All off-diagonal cells = 0. This enforces that acquisition spend is recorded once and only once in the FCF bridge.

11. **Roll into the master LBO** — feed consolidated M&A outputs into:
    - Consolidated operating model (revenue, EBITDA)
    - Debt schedule (incremental DDTL draws and repayment)
    - Tax schedule (D&A step-ups if modeled)
    - Free cash flow bridge (deduct acquisition price from Section H; apply ΔNWC from Section G; deduct capex from Section F)
    - Exit & returns (use **combined organic + M&A EBITDA** as the exit multiple base; add cumulative acquisition debt to total debt in the equity bridge; include all M&A equity injections in the MOIC denominator)

12. **Build the "With M&A vs. Without M&A" Return Comparison** — rerun IRR and MOIC using organic-only EBITDA and zero acquisition cash flows. Present side-by-side to isolate the return contribution of the acquisition program. This is the standard IC deliverable for any buy-and-build mandate.

---

#### M&A Tab Section Map

| Section | Content | Key Output |
|---|---|---|
| A | M&A Summary | Cohort schedule, acquisition prices, debt/equity split |
| B | Sources & Uses Waterfall | FCF → debt → equity draw per period |
| C | Revenue Triangle | Consolidated acquired revenue by year |
| D | EBITDA Margin Triangle | Synergy phase-in by cohort age |
| E | EBITDA Triangle | Consolidated acquired EBITDA by year |
| F | Capex Triangle | Acquired capex by cohort |
| G | NWC Balance + Change Triangle | ΔNWC with Year-1 deflation |
| H | Acquisition Price Triangle | Diagonal-only spend |

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Primary acquisition input | Acquisition EBITDA; back-solve revenue = EBITDA ÷ acquisition-year margin | EBITDA is the deal metric; revenue is derived |
| Acquisition timing convention | Beginning-of-year (full-year contribution) | Conservative; matches how sponsors underwrite tuck-ins |
| Margin expansion method | Post-synergy target margin + linear phase-in | Makes synergy realization explicit and auditable |
| Acquisition debt instrument | DDTL subject to maximum leverage constraint | Preserves revolver capacity; limits over-levering |
| Acquisitions per year | 1 | Keeps model tractable; override if deal pace is specified |
| Funding waterfall order | FCF first → acquisition debt draw → equity as residual | Equity is the plug; reflects actual cash deployment priority |
| Leverage test EBITDA | Pre-synergy (conservative) | Avoids borrowing against synergies not yet realized |
| Interest calculation basis | Drawn balance only, not committed facility amount | Matches actual cash interest expense; commitment fees modeled separately if required |

---

### Rules & Pitfalls

**Never:**
- **Never embed M&A in the organic operating model tab.** Keep it in a standalone tab with clean feed lines into the master LBO. Embedding destroys auditability and introduces circular references between the acquisition cash flow and the debt schedule.
- **Never apply organic growth in the acquisition year.** Year-1 cohort revenue/EBITDA uses the acquisition-date figure as entered. Organic growth begins in Year 2 of each cohort's life. Applying growth to the acquisition year is a formula error that inflates early-period cash flows.
- **Never use organic-only EBITDA as the exit multiple base.** Exit TEV must be applied to consolidated (organic + all M&A cohort) EBITDA. Using organic-only materially understates exit value and produces a model that does not survive IC scrutiny.
- **Never omit M&A equity injections from the MOIC denominator.** Every equity check written for an acquisition is invested capital. Excluding it overstates both IRR and MOIC, and the error surfaces immediately when a reviewer ties the equity bridge.
- **Never count acquisition spend twice in the FCF bridge.** Record it once via Section H. The sole exception: when computing NTM exit valuation, deduct "(−) NTM M&A Spend" once from exit proceeds if NTM EBITDA includes EBITDA from acquisitions not yet closed and not yet paid for.
- **Never omit cumulative acquisition debt from total debt at exit.** Including only the original LBO debt in the exit equity bridge understates leverage and overstates equity proceeds to the sponsor.

**Conditional:**
- If the exit multiple is applied to **NTM EBITDA**, either (a) strip out EBITDA from acquisitions not yet closed and not yet funded, or (b) deduct the corresponding acquisition spend from exit proceeds — choose one approach and apply it consistently. Doing neither double-counts value; doing both double-penalizes.
- If the NWC triangle shows Year-1 ΔNWC more than ~3× the Year-2 figure for any cohort, verify that the Year-1 deflation (back-solved opening balance) has been applied. The most common cause of the oversize Year-1 figure is treating the full NWC balance as a Year-1 cash outflow.
- If a single year's acquisition spend exceeds 50% of consolidated EBITDA, flag to the deal team: this may be a transformative acquisition rather than a tuck-in and likely warrants a standalone LBO or merger model rather than bolt-on treatment.
- If post-synergy acquisition margin exceeds the platform's own standalone margin, flag as an assumption anomaly and confirm with the deal team before proceeding.
- If the DDTL capacity is fully drawn in Year 1 of the model, the facility is likely undersized relative to the acquisition program; flag and confirm facility sizing before finalizing the debt schedule.

**Judgment:**
- Model the synergy phase-in clock from each cohort's own acquisition year. A cohort acquired in Year 3 of the model should show younger, lower-margin synergy capture in the same calendar year as a Year 1 cohort showing more mature synergies — unless the assumption is explicitly flat or declining, which itself requires a rationale.
- The "With M&A vs. Without M&A" return comparison is not optional on a buy-and-build mandate. IC committees expect to see the return attribution isolated. Build it as a standard output, not a supplemental.
- Prefer pre-synergy EBITDA for all leverage capacity tests. Borrowing against unrealized synergies is an underwriting assumption a credit committee will reject; building the model conservatively avoids a rework cycle.

---

### Pre-Delivery Checks

**Hard checks (model must pass before delivery):**
- Confirm no `#DIV/0` errors in the triangles — these appear most often when margin or growth inputs are zero; add `IFERROR` guards or input validation.
- Verify Sources = Uses in Section B for every forecast period.
- Confirm every cell in each triangle where forecast year < acquisition year equals exactly 0.
- Confirm acquisition price entries appear **only on the diagonal** of Section H (forecast year = acquisition year); all other cells = 0.
- Confirm DDTL draw in each period ≤ computed borrowing capacity (Maximum Leverage × PF EBITDA − Opening Cumulative Acquisition Debt).
- Confirm all cohort margins fall within the range [acquisition margin, post-synergy target margin] (or the reverse if declining) at every point in their phase-in schedule.
- Confirm NTM exit computation either excludes unfunded acquisition EBITDA or deducts the corresponding acquisition spend from exit proceeds — not both, not neither.
- Confirm implied acquisition multiple (acquisition price ÷ acquisition EBITDA) ties back to the input multiple for every cohort.

**Soft checks (flag for reviewer attention, do not auto-fail):**
- Year-1 ΔNWC > 3× Year-2 ΔNWC for any cohort → likely missing Year-1 deflation on the opening NWC balance.
- Single-year acquisition spend > 50% of consolidated EBITDA → may be transformative M&A; confirm bolt-on treatment is appropriate.
- Post-acquisition cohort margin > platform standalone margin at the same point in time → anomalous; confirm with deal team.
- DDTL fully drawn in Model Year 1 → facility likely undersized relative to acquisition pace; confirm sizing.

---

### Scope Boundaries

The master LBO model (three-statement build, debt schedule, tax shield, base-case exit and returns) is a prerequisite and handled in the core LBO playbook; this bolt-on module feeds into it but does not rebuild it. Standalone acquisition analysis for a single large, transformative deal (not a tuck-in) uses a dedicated merger model or standalone LBO, not this cohort-triangle framework. Synergy quantification and diligence-level integration planning are advisory workstreams outside this model's scope.

---

## Dividend Recap Modeling

**Use when**: A PE-backed portfolio company raises new debt and distributes proceeds as a special dividend, enabling sponsor early liquidity | **Deliverable**: Excel workbook with tabs covering Sources & Uses, Dividend Recap assumptions, pro forma cap table, debt schedule, cash flows, credit metrics, and returns comparison

---

### Ask First
1. What is the recap date (or target date range), and should it be modelled as a toggle?
2. Is there an existing LBO model to overlay — or must the operating model be built from scratch?
3. What is the new debt quantum or target leverage multiple (× LTM EBITDA at recap date), and what are the instrument terms (type, rate, tenor, amortization, call protection, OID, fees)?
4. What are the exit assumptions (year range, exit multiple) and the sponsor's equity % at recap date — and do management co-investors participate in the recap distribution pari passu, or is MIP exit-only?

---

### Workflow

1. **Collect all inputs before opening a single cell** (recap date toggle, new debt amount or target leverage × LTM EBITDA at recap date, instrument type / rate / tenor / amortization schedule / call protection, OID and financing fees, existing debt at recap date, post-recap cash balance target, equity and returns inputs; if no existing model, collect full operating inputs). The only exception: extract inputs from an uploaded LBO model first, then gap-fill.

2. **Determine build mode** — if an LBO model is available, overlay the recap as an incremental financing event on the existing file; if not, build a standalone operating tab. Never rebuild operating projections when overlaying. (Preserves the strict separation between financing event and operating performance.)

3. **Build Sources & Uses at recap date** — new debt proceeds as source; special dividend (gross), financing fees, and OID as uses; cash from balance sheet as source only if explicitly instructed (default: $0 cash contribution). Display gross dividend and fees as separate line items; never net them.

4. **Build Dividend Recap tab** with three sections: (a) assumptions (date toggle, leverage multiple, instrument terms, OID, fees, existing debt, equity ownership % at recap date), (b) Sources & Uses grid, (c) pro forma cap table in three columns: Pre-Recap | Recap Adjustment | Post-Recap — line items: revolver, each tranche, new debt, total debt, cash, EBITDA, net debt, total leverage, net leverage, sponsor equity.

5. **Update debt schedule** — roll all instruments (existing + new) forward from recap date to exit, applying contractual amortization and cash sweep each period. Never use the original recap debt quantum as the exit debt figure; exit debt is the period-end balance after amortization and sweep.

6. **Update cash flows** — unlevered free cash flow is unchanged (financing event only); update levered cash flow for incremental interest on new debt and revised sweep. For a mid-year recap, accrue only the partial-period interest for the stub — do not charge a full year's interest in the recap year.

7. **Calculate financing fees and OID treatment** — capitalize both; amortize straight-line over the debt tenor. Amortization is non-cash: include it in total interest expense for P&L, but exclude it from cash interest in all coverage ratio calculations (double-counting otherwise). OID is amortized as a fee, not expensed at close.

8. **Build lender coverage and credit metrics** — total leverage, net leverage, interest coverage (cash interest only), fixed charge coverage. Apply conditional formatting: covenant headroom < 0.5× → yellow; headroom < 0.0× (breach) → red. Flag any repricing triggers, amendment fees, change-of-control clauses, or call protection on existing facilities triggered by the recap. Update revolver availability if springing covenants are linked to revolver utilization — new leverage may trigger the covenant even if the term loan has no maintenance covenant.

9. **Build returns — with vs. without recap, side by side** — for each exit year:
   - **Scenario A (no recap)**: standard sponsor IRR/MoIC using entry and exit cash flows.
   - **Scenario B (with recap)**: cash flow timeline — entry (−equity outlay) → recap date (+special dividend received) → exit (+net exit equity). Use actual calendar dates for IRR; the recap date is a distinct mid-hold cash inflow. Exit equity in Scenario B equals exit EV minus post-recap net debt — it will be lower than Scenario A in every exit year (flag a model error if it is not). The special dividend is a separate cash inflow; do not also deduct it from exit equity. Build a returns bridge showing IRR/MoIC delta (Scenario B − Scenario A) for each exit year.
   - **Directional note**: near-term exits — early dividend dominates → recap accretive to IRR; far-term exits — incremental debt cost dominates → recap may erode IRR. Show both ends.

10. **Build Sponsor Cash Flow Timeline** — a visual, auditable sequence: entry outlay → recap dividend inflow (dated) → exit proceeds, mirroring exactly the IRR cash flow inputs.

11. **Run sanity checks** (see Pre-Delivery Checks) and confirm all cross-tab links are dynamic — no hardcoded values outside explicit user-input cells.

---

#### Pro Forma Cap Table Structure (three-column layout)

| Line Item | Pre-Recap | Recap Adjustment | Post-Recap |
|---|---|---|---|
| Revolver | | | |
| Term Loan A / B / C (each tranche) | | | |
| New Recap Debt | — | +new debt | |
| Total Debt | | | |
| Cash | | | |
| EBITDA (LTM at recap date) | | | |
| Net Debt | | | |
| Total Leverage (×) | | | |
| Net Leverage (×) | | | |
| Sponsor Equity | | | |

#### Returns Bridge Layout

| Exit Year | IRR — No Recap | IRR — With Recap | Delta | MoIC — No Recap | MoIC — With Recap | Delta |
|---|---|---|---|---|---|---|
| Year 3 | | | | | | |
| Year 4 | | | | | | |
| Year 5 | | | | | | |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Cash contribution to recap Sources & Uses | $0 | Recaps are debt-funded; equity cash is not typically deployed |
| Leverage anchor | LTM EBITDA at recap date | Reflects lender underwriting at the moment of the transaction; entry or stale EBITDA is a hard error |
| OID and financing fee treatment | Capitalize; straight-line amortization over debt tenor | Matches US GAAP / credit agreement standard |
| Coverage ratio interest base | Cash interest only (excluding fee/OID amortization) | Amortization is non-cash; including it double-counts the cost |
| Dividend allocation base | Sponsor equity % at recap date | Ownership may have shifted since entry; entry-date % is stale |
| MIP participation in recap | No (exit-only) | Most MIP structures vest and pay only at exit unless explicitly documented otherwise |
| Recap date modelling | Toggle-driven discrete event | Ensures pre/post capital structures are cleanly separated at the correct date boundary |
| Covenant headroom warning threshold | < 0.5× → yellow; < 0.0× → red | Standard credit monitoring convention |
| Existing debt instruments in Scenario B | All retained and rolled forward | No existing facility is dropped in the recap scenario |

---

### Rules & Pitfalls

**Never:**
- **Never modify the operating model (revenue, EBITDA, D&A, capex, working capital) when building a recap overlay** — a dividend recap is a financing event; contaminating the operating projections makes scenario comparison meaningless and breaks any pre-existing LBO audit trail.
- **Never use entry EBITDA or a prior-period EBITDA to set recap leverage** — leverage multiples must be anchored to LTM EBITDA at the recap transaction date; using stale EBITDA is a hard model error that misstates debt capacity.
- **Never double-count the special dividend** — the dividend is a standalone mid-hold cash inflow in the IRR timeline; exit equity in Scenario B is independently determined by exit EV minus post-recap net debt. Do not deduct the dividend from exit equity a second time.
- **Never use the original recap debt balance as the exit debt figure** — exit debt is the forward-rolled period-end balance after all scheduled amortization and cash sweep; using the original notional understates exit net debt and inflates exit equity.
- **Never charge a full year of interest in the recap stub period** — if the recap occurs mid-year, accrue only the partial-period interest; a full-year charge overstates the debt burden in the recap year.
- **Never expense OID at close** — OID is amortized over the debt tenor as a non-cash fee, not recognized as an upfront income statement charge.
- **Never net financing fees against the gross dividend** — display gross dividend and fees as separate line items in Sources & Uses; netting obscures fee quantum and fails review.
- **Never hardcode cross-tab inputs** — all values pulled across tabs must be dynamic formula links; hardcoding breaks scenario toggling and is the fastest way to introduce silent errors in a recap overlay.

**Conditional:**
- **If an existing LBO model is uploaded**, extract all operating inputs directly from it and overlay the recap as an additive financing layer — do not rebuild the operating projection or alter existing debt schedules prior to the recap date.
- **If existing credit facilities include call protection, repricing triggers, change-of-control clauses, or amendment fees**, flag each triggered provision explicitly in the model before finalizing the new debt sizing.
- **If the existing credit agreement contains springing covenants tied to revolver utilization**, recalculate revolver availability under the post-recap capital structure — new leverage levels may trigger the springing covenant even where the term loan carries no maintenance covenant.
- **If management co-investors are present**, confirm at the Ask First stage whether they participate pari passu in the recap distribution or are exit-only (MIP default); apply the correct participation flag to the dividend allocation calculation.
- **If Scenario B exit equity is not lower than Scenario A in every exit year**, stop — this signals an error in the debt schedule roll-forward.

**Judgment:**
- **Show both near-term and far-term exits in the returns bridge** — for early exits, the up-front dividend dominates and recap is IRR-accretive; for late exits, incremental debt cost accumulates and recap may be IRR-dilutive. Presenting only one end misleads the IC on the full risk/reward profile.
- **Confirm sponsor equity % at recap date rather than defaulting to entry %** — in situations where equity has been partially sold down or rolled, using the entry-date percentage mismeasures the dividend received and corrupts the IRR timeline.
- **Treat the recap as a discrete, date-stamped event in the model** — pre-recap periods use the original capital structure; post-recap periods use the new one. Blending the two across periods introduces rate and balance errors that are difficult to detect in review.

---

### Pre-Delivery Checks

- **Foot Sources & Uses**: total Sources = total Uses to the dollar.
- **Verify pro forma debt**: Post-Recap total debt = Pre-Recap total debt + new recap debt (assuming no concurrent paydown of existing debt; if there is one, verify the explicit paydown line).
- **Verify sponsor dividend receipt**: special dividend received by sponsor = gross special dividend × sponsor equity % at recap date.
- **Directional interest check**: Year 1 incremental interest expense ≈ new recap debt principal × new debt rate (stub-adjusted if mid-year); flag any material deviation for formula review.
- **Confirm Scenario B exit equity < Scenario A exit equity in every modelled exit year** — if violated, the debt roll-forward contains an error.
- **Confirm IRR direction by exit horizon**: near-term exit IRR (Scenario B) > IRR (Scenario A); far-term exits may reverse — if near-term Scenario B is lower, investigate the dividend timing in the IRR cash flow series.
- **Verify fee amortization foots**: total capitalized fees ÷ annual amortization = debt tenor (in years), within rounding.
- **Confirm no formula errors or broken links** across all tabs (zero #REF!, #DIV/0!, #VALUE! errors).
- **Confirm all existing debt instruments from Scenario A appear in the Scenario B debt schedule** — no tranche should be silently dropped.
- **Confirm coverage ratio denominators use cash interest only** (exclude OID and fee amortization from the denominator).
- **Confirm mid-year recap interest is stub-period only** — full-year charge in the recap year is a fail.

---

### Scope Boundaries

The **LBO Model** playbook handles full ground-up construction of the leveraged buyout operating model, entry capital structure, and base-case returns; use that playbook when no existing LBO exists and the primary deliverable is the initial acquisition model rather than a recap overlay. The **Sources & Uses** playbook handles standalone S&U grids for initial acquisition financing. This playbook assumes the LBO operating projections are already fixed (or built as a dependency) and focuses exclusively on the incremental financing event, its effect on the debt schedule, and the with/without returns comparison.

---

## Sale-Leaseback Modeling

**Use when**: Modeling a sale-leaseback (SLB) transaction overlay on an existing LBO, DCF, or 3-statement model to assess accretion/dilution, cash flow impact, and equity value creation | **Deliverable**: SLB transaction module (Excel) integrated into the host model, covering accretion test, layered rent schedule, proceeds waterfall, post-SLB valuation, and value creation bridge contribution

---

### Ask First

1. **Proceeds or cap rate**: Is the SLB sized by a given gross proceeds figure or by a target cap rate? If the latter, confirm Year 1 base rent to back into proceeds.
2. **Tax basis and net proceeds**: Is the proceeds input already net of transaction fees and taxes? If gross only, provide tax basis (or confirm zero basis), applicable tax rate, and fees so the after-tax net can be derived.
3. **Lease terms**: Confirm annual rent escalator (default 2%), lease duration (default 15 years), lease type (NNN default), and mid-year closing adjustment if applicable (e.g., close on 7/1 → 0.5 × Year 1 rent in the closing year).
4. **Use-of-proceeds waterfall**: Confirm mandatory prepayment covenant (default 100% of net proceeds to mandatory debt repayment first), then priority order for any remainder: optional debt repayment → dividend / recap → M&A → cash on balance sheet. If no debt exists, skip debt questions entirely.

---

### Workflow

1. **Run the accretion test (Step 0 — do this first before building anything else)**
   Compute the implied real estate multiple = net SLB proceeds ÷ Year 1 base rent (= 1 ÷ cap rate). Compare to the reference business multiple (LBO exit multiple, DCF terminal multiple, or forward comps multiple in use). Spread > 0 → accretive (asset sold at a higher multiple than the business is valued — cap rate arbitrage creates value). Spread < 0 → dilutive (generates cash but destroys business value). Flag spread < 0 to the user and require explicit confirmation before proceeding. Note: this test is static — it does not capture the compounding drag of annual rent escalations and is not the final answer on value creation.

2. **Build the layered rent schedule in the operating model (Step 1)**
   Insert a dedicated rent line in the income statement below pre-SLB EBITDA. Structure the display as three clearly labeled rows: Pre-SLB EBITDA / (SLB Rent Expense) / Post-SLB EBITDA. Escalate rent at the confirmed rate (default 2% per year) for the full lease term. For partial-year closings, apply a pro-rata factor to the closing-year rent (e.g., close on 7/1 → 0.5 × Year 1 rent). Never flat-line rent — doing so understates drag in later years and makes it impossible to strip rent drag out of organic EBITDA trends for bridge analysis.

3. **Run SLB proceeds through the cash flow statement (Step 2)**
   Book the net after-tax proceeds as a one-time inflow in investing activities (asset sale proceeds) in the closing year only. Do not amortize the proceeds across periods. Rent expense flows through net income and into operating cash flow automatically; do not add a separate rent cash line — that is a double-count.

4. **Build the use-of-proceeds waterfall (Step 3)**
   Allocate net proceeds in priority order: mandatory debt repayment → optional debt repayment → dividend/recap → M&A → residual cash. The waterfall must foot to net SLB proceeds — verify this tie-out. Apply the cascade effect: each dollar of debt repaid lowers the ending balance, which reduces subsequent interest expense in all downstream periods (iterative). For mid-year closes, pro-rate the Year 1 interest saving. Flag any residual cash left idle — undeployed proceeds generate no return and should be surfaced explicitly.

5. **Apply post-SLB EBITDA to all downstream valuation and credit metrics (Step 4)**
   Use post-SLB EBITDA (never pre-SLB EBITDA) for: EV/EBITDA exit multiple, DCF terminal value, leverage ratio (Debt/EBITDA), and coverage ratios. Using pre-SLB EBITDA overstates EV and the apparent value created by the SLB, and understates leverage while overstating covenant headroom. For lease-heavy sectors (restaurant, retail, healthcare), also compute EV/EBITDAR (EBITDA before rent) and lease-adjusted EV to neutralize the mechanical multiple inflation caused by the lower EBITDA denominator.

6. **Populate the value creation bridge (Step 5, if bridge is in scope)**
   The SLB contributes exactly two components to the bridge — list them as a single labeled SLB row, never merged into organic growth or multiple expansion:
   - (a) **Negative EBITDA impact at the valuation date**: = −(rent in the valuation year) × (exit/terminal multiple)
   - (b) **Positive after-tax net proceeds**: = net SLB proceeds received

   Interest savings from debt repayment belong in the leverage bridge, not the SLB bridge row. Verify the bridge foots. Return attribution by use: debt repayment improves MOIC (moderate IRR impact); dividend/recap materially improves IRR (early cash return) with smaller MOIC lift; M&A impact depends on acquisition accretion; idle cash has no return — flag it.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Annual rent escalator | 2% per year | Market-standard NNN escalator; flat-lining understates long-run EBITDA drag |
| Lease duration | 15 years | Institutional SLB market norm |
| Transaction fee | 1% of gross proceeds | Standard sell-side advisory fee for RE monetization |
| Lease type | NNN (triple-net) | Seller retains opex items (property tax, insurance, maintenance) in existing opex lines |
| Proceeds input | After-tax net | Avoids the need to build a tax basis and rate schedule separately |
| Proceeds timing | One-time inflow in SLB closing year | Reflects single asset-sale event; never amortized |
| Mandatory prepayment | 100% of net proceeds applied to mandatory debt first | Typical term loan / credit agreement covenant default |
| Implied RE multiple denominator | Year 1 (initial) base rent | Cap rate is always defined on the starting rent, not an escalated rent |
| Valuation multiple applied to | Post-SLB EBITDA | Ensures EV reflects the permanent rent obligation the business has assumed |
| Exit/terminal multiple | Unchanged pre- vs. post-SLB (carry host model multiple) | Unless user explicitly specifies a re-rating |

---

### Rules & Pitfalls

**Never:**
- Never apply the valuation multiple (LBO exit, DCF terminal, or comps forward) to pre-SLB EBITDA — it overstates EV by ignoring the permanent rent drag and is the fastest credibility killer when the bridge is reviewed.
- Never amortize SLB proceeds across multiple years — it misrepresents the timing of the cash inflow and corrupts the waterfall and IRR calculations.
- Never add a separate rent cash outflow line in the cash flow statement when rent already flows through net income into operating cash flow — it double-counts the rent drag.
- Never count SLB proceeds twice: proceeds enter once via the waterfall (debt repayment or other use) and must not reappear as an incremental item at exit.
- Never record interest savings from SLB-driven debt repayment as a standalone SLB bridge row — route it through the leverage bridge to preserve clean attribution.
- Never flat-line rent — it understates drag in out-years and prevents stripping rent drag from organic EBITDA trends in bridge analysis.
- Never treat a PropCo/OpCo structural separation as an SLB — there is no arm's-length cash sale in that structure; flag it and treat it as out of scope.

**Conditional:**
- If gross proceeds are provided instead of after-tax net proceeds, compute cash tax on the gain: Cash Tax = MAX(Gross Proceeds − Tax Basis, 0) × Tax Rate. Flag a zero tax basis explicitly — a fully depreciated property generates maximum taxable gain and produces the largest tax leakage.
- If the lease type is gross (not NNN), use a higher rent figure reflecting the landlord's assumption of opex, and simultaneously remove property tax, insurance, and maintenance costs from the opex lines in pre-SLB EBITDA — failing to do so double-counts those costs.
- If the SLB closes mid-year, pro-rate both the Year 1 rent (e.g., close on 7/1 → 0.5 × annual rent) and the Year 1 interest saving from debt repayment.
- If the transaction involves multiple tranches (partial or phased SLB), model each tranche independently and run a separate accretion test for each — do not aggregate tranches before testing.
- If no debt exists on the balance sheet, skip all mandatory/optional prepayment questions and route proceeds directly to the remaining waterfall steps.
- If the business operates in a lease-heavy sector (restaurant, retail, healthcare), present EV/EBITDAR and a lease-adjusted EV alongside the standard EV/EBITDA — post-SLB EV/EBITDA rises mechanically (lower denominator) even when no value is created, and the unadjusted multiple will mislead reviewers.
- If the accretion test yields a spread < 0 (implied RE multiple < reference business multiple), flag dilution to the user and require explicit sign-off before proceeding.

**Judgment:**
- The accretion test is a first-pass gate, not the final verdict on value creation: it is static and ignores the compounding drag of annual rent escalations over the lease term. Present both the accretion test and the full value creation bridge to give a complete picture.
- When idle cash appears as a residual in the waterfall, flag it proactively — undeployed proceeds earn minimal return and will attract scrutiny from sponsors and credit committees.
- Return attribution framing matters for the audience: debt repayment is the MOIC story; dividend/recap is the IRR story. Frame accordingly depending on whether the sponsor audience is focused on fund-level cash yield or total return.
- Cap rate arbitrage (selling real estate at a lower cap rate than the business's implied EBITDA multiple) is the value thesis; ensure the narrative explicitly identifies the spread as the source of value, not "generating liquidity" alone.

---

### Pre-Delivery Checks

- Confirm that the accretion test is visible and signed off: implied RE multiple (proceeds ÷ Year 1 rent) vs. reference business multiple, with spread labeled and directional flag (accretive / dilutive).
- Verify rent is displayed in its own dedicated line between pre-SLB EBITDA and post-SLB EBITDA — not buried in COGS or SG&A.
- Verify rent escalates at the confirmed rate (default 2%) every year through the full lease term; confirm no flat periods unless explicitly instructed.
- Confirm the implied RE multiple denominator is Year 1 base rent, not an escalated rent figure.
- Confirm SLB proceeds appear exactly once in the cash flow statement (investing activities, closing year only) and do not reappear at exit.
- Confirm the use-of-proceeds waterfall foots exactly to net after-tax proceeds.
- Confirm all downstream metrics — leverage (Debt/EBITDA), coverage ratios, EV/EBITDA exit multiple, DCF terminal value — reference post-SLB EBITDA.
- Confirm the value creation bridge SLB row contains exactly two components: (a) −(valuation-year rent × exit multiple) and (b) +net proceeds; confirm interest savings are in the leverage bridge, not the SLB row; confirm the bridge foots.
- Flag rent/revenue ratio > 8%.
- Flag EBITDA margin decline > 500 bps post-SLB.
- Flag implied RE multiple > 30× (implied cap rate < 3.3%) or < 10× (implied cap rate > 10%) as outliers requiring user confirmation.
- For NNN leases, confirm property tax, insurance, and maintenance remain in opex (pre-SLB already contains them) and are not also included in the rent line.
- For gross leases, confirm the corresponding opex items have been removed from pre-SLB EBITDA to avoid double-counting.
- If zero tax basis was used, confirm it is explicitly flagged in the model output.

---

### Scope Boundaries

The SLB module is a transaction overlay — it layers into a host LBO, DCF, or 3-statement model and consumes that model's exit/terminal multiples and EBITDA base; build or confirm the host model first. PropCo/OpCo structural separations involve no arm's-length cash sale and are out of scope for this module — handle under a separate structural analysis playbook. Value creation bridge assembly and formatting (including the leverage and multiple-expansion rows that sit alongside the SLB row) are the responsibility of the Value Creation Bridge playbook; this module delivers only the SLB-specific inputs to that bridge.
