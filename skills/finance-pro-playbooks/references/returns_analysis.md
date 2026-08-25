# Returns & Exit Analysis

Playbooks for explaining where returns come from and how exit proceeds are shared: IRR decomposition, value creation bridges, liquidation waterfalls, and management incentive plans. Load `formats/excel_standards.md` when producing Excel output.

## Contents

| Task | Use when |
|---|---|
| [IRR Attribution](#irr-attribution) | Attributing sources of LBO equity IRR to operating, inorganic, structural, and leverage components |
| [Value Creation Bridge](#value-creation-bridge) | An LBO model is complete and the sponsor needs equity value change from entry to exit decomposed by dollar contribution and MOIC attribution |
| [Liquidation Waterfall](#liquidation-waterfall) | A term sheet, LLCA, or operating agreement requires translation into a scenario-based distribution model |
| [MIP Modeling](#mip-modeling) | Modelling management incentive economics inside an LBO exit waterfall |

---

## IRR Attribution

**Use when**: Attributing sources of LBO equity IRR to operating, inorganic, structural, and leverage components | **Deliverable**: IRR Decomposition panel embedded in the LBO returns/output page, integrated with the LBO model — 4-column waterfall table with live tie-out flag

---

### Ask First
1. What is the entry multiple basis — LTM or NTM EBITDA? (Determines whether the LTM→NTM step-up rolls into Base Unlevered Yield or is isolated downstream.)
2. Are there any inorganic levers (cost synergies, sale-leaseback, tax shield, De Novo, tuck-in M&A, transformational M&A) to include, and are any financed with a Delayed Draw Term Loan (DDTL)?
3. Does the base case include any cash sweep below 100% on the unlevered side? (Triggers a standalone Balance Sheet Cash Drag line.)
4. What are the target exit years for hold-period sensitivity? (Minimum: Year 3 and Year 5; flag if any are non-integer years requiring XIRR.)

---

### Workflow

Build the panel as a **13-step toggle waterfall**: activate one toggle at a time, recalculate the cumulative IRR at each step, and record the delta as that lever's attributed contribution. The fixed sequence is non-negotiable because IRR compounds — changing order changes every line-item delta without changing the total.

**Default build sequence (organic → sponsor-led inorganic → deal structure → capital structure):**

1. **Base Unlevered Yield** — recurring trailing UFCF only; zero growth; flat exit multiple applied to fully-loaded entry TEV; 100% equity; 100% dividend sweep. This is the most underwritable, de-risked anchor: it is grounded in historical cash, not forward projections. All other levers are isolated downstream from this base.
2. **Organic revenue growth** — hold margins flat; isolate pure volume/price contribution.
3. **Organic margin improvement** — strip out discrete cost saves (those belong in Step 4); capture structural efficiency gains only.
4. **Inorganic levers** — activate individually in inside-out order to reflect rising execution dependency:
   - (4a) Cost synergies *(require one-time unlock costs — keep separate from organic margin improvement)*
   - (4b) Sale-leaseback
   - (4c) Tax shield
   - (4d) De Novo
   - (4e) Tuck-in M&A
   - (4f) Transformational M&A
5. **Exit multiple expansion/contraction** — compare against flat fully-loaded exit TEV (like-for-like: fully-loaded entry vs. fully-loaded exit); this step captures pure multiple movement only. Place this step **after** all levers that affect run-rate EBITDA (Steps 2–4) to avoid double-counting.
6. **Transaction fees & balance sheet cash drag** — switch from fully-loaded exit TEV to actual headline exit multiple; let fees and cash drag flow through here. *(Clean isolation: fees and cash drag are not mislabeled as multiple contraction.)*
7. **One-time costs** — restructuring charges, integration costs, and other non-recurring items.
8. **Other special items** — use only after three-gate check (see Rules & Pitfalls).
9. **MIP (Management Incentive Plan)** — final step of the unlevered bridge; must carry a negative delta (dilution). Placing it last ensures it participates in all prior value creation. **Cumulative IRR at this step = Unlevered IRR.**
10. **Entry debt** — restore sweep from 100% to actual contractual sweep at this step; the cash-retention timing drag is thereby attributed to leverage, not operations.
11. **Entry preferred equity**
12. **Dividend recapitalization**

    **→ Cumulative IRR at Step 12 = Levered IRR; must tie out to Live IRR.**

#### Panel Structure

| Column | Content |
|---|---|
| Component Label | Descriptive name of the lever (transaction-specific where possible) |
| Toggle | Linked to master toggle on the Assumptions page — never hardcoded 1/0 in the panel |
| Cumulative IRR | Running IRR after this toggle is activated |
| Decomp Delta | Marginal contribution of this step (= cumulative IRR this step − cumulative IRR prior step) |

- **Top of panel**: Live IRR (pulled directly from the LBO model output)
- **Bottom of panel**: Tie-out flag (Levered IRR = Live IRR: PASS / FAIL)

#### Hold-Period Sensitivity Table

Run the decomposition across at least Year 3 and Year 5 exits; add Year 6–8 for slow-compounding assets. Present as a matrix: exit year × IRR component. Note in the table header that short holds amplify multiple expansion and Entry Debt contributions; long holds amplify organic growth and margin improvement contributions. For non-integer exit dates, use XIRR with actual calendar dates.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Base Unlevered Yield cash flow basis | Recurring trailing UFCF (LTM) | Anchors the base in auditable history, not forward projections |
| Growth assumption in Base Unlevered Yield | Zero | Isolates pure cash-generative floor before any operational lever |
| Exit multiple in Base Unlevered Yield | Flat — fully-loaded entry TEV multiple | Ensures zero multiple contribution at baseline |
| Equity structure in Base Unlevered Yield | 100% equity financing | Removes all leverage effect from the base |
| Dividend sweep in unlevered steps (Steps 1–9) | 100% | Measures true recurring cash-earning power without idle cash dilution |
| Dividend sweep in levered steps (Steps 10–12) | Actual contractual sweep | Correctly attributes cash-retention timing drag to leverage |
| Entry multiple basis | Fully-Loaded TEV (= headline TEV + non-financing transaction fees + balance-sheet cash) | Prevents fees and cash drag from being mislabeled as multiple contraction |
| Inorganic lever ordering | Inside-out: cost saves → sale-leaseback → tax shield → De Novo → tuck-in → transformational M&A | Reflects rising execution dependency |
| Exit multiple step position | After all EBITDA-affecting levers (Step 5) | Avoids double-counting multiple applied to an incomplete EBITDA base |
| MIP position | Final step of unlevered bridge (Step 9) | Ensures dilution reflects all prior value creation |
| DDTL-financed M&A attribution | Financing proceeds → leverage segment; M&A line reflects operational and valuation impact only | Prevents DDTL benefit from inflating inorganic operating contribution |
| Metric polarity | Metric must be positive at both entry and exit | Prevents sign-flip distortions in the bridge |
| Toggle source | Master toggles on Assumptions page | Auditable, scenario-portable; panel formula structure preserved in all scenarios |
| "Other" bucket usage | Off by default | Forces transaction-specific labeling; see three-gate check in Rules & Pitfalls |

---

### Rules & Pitfalls

**Never:**
- **Never deliver an IRR figure without the decomposition.** IRR magnitude alone cannot answer whether returns were earned through operational improvement or manufactured through leverage and multiple expansion — the decomposition is the quality signal that IC requires to assess replicability and risk concentration.
- **Never use headline TEV as the flat entry multiple in Base Unlevered Yield.** Using headline TEV instead of fully-loaded TEV pushes transaction fees and balance sheet cash drag into the multiple expansion/contraction line, misattributing a structural cost as a valuation outcome.
- **Never place the exit multiple step before all EBITDA-affecting levers are activated.** Applying the exit multiple to an incomplete EBITDA base double-counts the value built by M&A and cost saves — the multiple would be applied to a lower base, and the inorganic levers would then re-apply the same multiple at a higher EBITDA.
- **Never bridge across different metrics within the same decomposition.** If entry metric is Revenue and exit metric is EBITDA, the multiple steps are not comparable. Mixing metrics produces a misleading bridge.
- **Never hardcode toggle values (1/0) directly in the panel.** Hard-coding breaks auditability and corrupts formula linkage when scenarios are rerun. All toggles must reference master switches on the Assumptions page.
- **Never treat a positive MIP delta as valid.** A positive MIP contribution means the model is treating management dilution as accretive — this is a model error. MIP must always be negative (dilutive) in the decomposition.
- **Never drop Base Unlevered Yield if it is negative without investigating.** A negative Base Unlevered Yield is almost always a model error (wrong FCF basis, wrong sweep assumption, or LTM cash flow not recurring). Investigate before proceeding.

**Conditional:**
- **If** the unlevered base case has no cash sweep (i.e., base case does not distribute 100% of FCF), **then** create a standalone **"Balance Sheet Cash Drag"** line item rather than embedding the drag in Base Unlevered Yield — it must not contaminate the operational baseline.
- **If** tuck-in or transformational M&A is financed with a DDTL, **then** attribute DDTL financing proceeds to the leverage segment (Step 10 or a dedicated sub-step); the M&A inorganic line (Step 4e/4f) reflects only the operational and valuation impact with the DDTL toggle off.
- **If** the entry EBITDA metric is negative at entry and positive at exit (e.g., early-stage or turnaround asset), **then** switch the bridging metric to Revenue or ARR for both entry and exit multiples; do not bridge across a sign change in the denominator.
- **If** using NTM as the entry multiple basis, **then** embed the LTM→NTM period step-up inside Base Unlevered Yield and start the organic revenue growth lever (Step 2) from Year 2 onward — the initial ramp-up is already captured in the base.
- **If** any exit year is a non-integer (e.g., 4.5 years), **then** use XIRR with actual calendar dates rather than period-end IRR convention.
- **If** the cumulative IRR at the bottom of the panel does not equal the Live IRR, **then** halt delivery and resolve the tie-out discrepancy — a stale panel is worse than no panel.

**Judgment:**
- **Default inorganic lever ordering (inside-out) reflects execution dependency, not IRR magnitude.** Resist the temptation to reorder by contribution size for presentation purposes — reordering changes every line-item delta and destroys comparability across deals.
- **Flag any single component exceeding 50% of Levered IRR as a concentration risk**, particularly multiple expansion and transformational M&A. Note the flag explicitly in the IC materials; it signals that returns depend heavily on a single lever that may be out of management's control.
- **Flag any positive exit multiple expansion ≥ 0.5x and treat it as a risk disclosure, not a return driver.** Relying on multiple expansion above 0.5x means underwriting a bet that the next buyer pays more — build a flat or compressed multiple sensitivity and present it alongside the base case in IC.
- **Prefer extending standard component labels over using the "Other" bucket.** The "Other" bucket passes only if the item (a) demonstrably does not fit any existing standard line, (b) contributes more than 50 bps to Levered IRR, and (c) is renamed with a transaction-specific label. Anything below 50 bps that does not fit should be absorbed into the nearest logical component with a footnote.
- **Rerun the full panel after any assumption change that affects IRR.** The waterfall is only valid as of the model state at time of calculation; a stale panel with updated Live IRR is misleading.

---

### Pre-Delivery Checks

- **Tie out Levered IRR (bottom of panel) to Live IRR** — if they diverge, the panel is stale or a formula link is broken; do not deliver until resolved.
- **Verify that toggling all unlevered levers on and all leverage levers off produces exactly Unlevered IRR** — confirms that Steps 1–9 are correctly isolated from the capital structure.
- **Confirm that organic revenue growth delta plus organic margin improvement delta approximates the implied unlevered EBITDA CAGR** — a material gap indicates a leak between the two steps (e.g., working capital or capex assumptions bleeding across).
- **Confirm that the multiple contribution (Step 5 delta) is exactly zero when entry fully-loaded TEV multiple equals exit fully-loaded TEV multiple** — any non-zero result signals that the flat-multiple baseline is not correctly constructed.
- **Confirm that the MIP delta is negative** — a positive MIP delta indicates a model error; investigate before delivery.
- **Confirm that the Entry Debt delta (Step 10) is positive when the deal has positive IRR and the levered debt cost is below the after-tax return** — a negative Entry Debt contribution in a standard profitable LBO is a red flag.
- **Flag any single component delta exceeding 50% of Levered IRR** — document the concentration risk for IC.
- **Flag any positive exit multiple expansion step delta ≥ 0.5x** — prepare a flat/compressed multiple sensitivity and include it in IC materials.
- **Confirm metric polarity is consistent throughout** — entry and exit multiples must reference the same metric, and that metric must be positive at both dates.
- **Rerun the panel after any assumption change that affects IRR** before distributing to reviewers.

---

### Scope Boundaries

The IRR Decomposition panel attributes **IRR (%)** by source; it does not decompose MOIC or dollar equity value — use the **Value Creation Bridge** playbook for MOIC and equity value waterfall analysis. Full model construction, debt schedule, and returns page architecture are governed by the **LBO Model** playbook, which is the parent model this panel attaches to.

---

## Value Creation Bridge

**Use when**: An LBO model is complete and the sponsor needs equity value change from entry to exit decomposed by dollar contribution and MOIC attribution | **Deliverable**: Excel workbook — side-by-side $ and MOIC(x) bridge table, waterfall chart (summary + detailed versions), foot/tie-out check rows

---

### Ask First
1. Is the LBO model fully linked with no hard-coded values? (Required before building — this playbook assumes full formula linkage throughout.)
2. What holding period and exit date should the bridge reflect?
3. Are there inorganic events (tuck-in M&A, de novo, divestitures, sale-leaseback) in the model that need separate line items, or should they roll into a single inorganic bucket?
4. Does the entry multiple in the model include transaction fees in the numerator (i.e., total acquisition cost ÷ EBITDA)? If yes, fees must be stripped before computing organic growth and multiple expansion components.

---

### Workflow

**Step 1 — Establish the equity basis**
Pull entry equity value (initial sponsor check-in) and identify all subsequent equity injections during the hold (equity deployed for M&A, equity used to fund operating losses). Sum all injections into **total equity contribution** — this is the MOIC denominator. *(Dependency: every downstream MOIC attribution divides by this total; an incomplete denominator corrupts all attribution.)*

**Step 2 — Build TEV growth components (Layer 1 of bridge)**
Decompose the change in Total Enterprise Value from entry TEV to exit TEV into the following line items; include only components present in the model and suppress zero rows:

| Component | Formula / Source |
|---|---|
| Organic revenue growth contribution | Δ organic revenue × entry EBITDA margin × entry multiple |
| Margin improvement contribution | Organic TEV growth − revenue growth contribution (residual) |
| Cost savings | Cost savings EBITDA × exit multiple |
| Sale-leaseback | Proceeds or rent savings × exit multiple, per model |
| Exit-date tax shield | PV of tax asset at exit — **add to exit proceeds; do not capitalize inside EBITDA × multiple TEV** |
| De novo contribution | De novo EBITDA × exit multiple |
| Tuck-in M&A contribution | Tuck-in EBITDA × exit multiple |
| Transformative M&A contribution | Transformative EBITDA × exit multiple |
| Divestiture | Show as negative TEV growth component; route proceeds through net debt line |
| Multiple expansion / contraction | Δ multiple × **organic-only** exit EBITDA (see covariance rule below) |

**Covariance handling (apply consistently, disclose in footnote):**
- Default convention: absorb the cross-term into multiple expansion.
  - Organic growth uses: entry multiple × Δ organic EBITDA
  - Multiple expansion uses: Δ multiple × exit EBITDA (organic basis only)
- Do **not** mix conventions (e.g., computing growth at exit multiple while computing expansion at entry EBITDA) — this double-counts the covariance and breaks the foot.
- If a non-default convention is used, label it in the footnote and apply it uniformly.

**Step 3 — Build TEV-to-equity adjustments (Layer 2 of bridge)**
Apply the following items beneath TEV to bridge from exit TEV to exit equity value received by the sponsor:

| Item | Sign | Source |
|---|---|---|
| Fees (combined drag unless split requested) | (−) | Transaction + financing fees from model |
| MIP / management incentive plan payout | (−) | Actual exit waterfall payout — not a flat percentage; apply hurdle/tier structure |
| Dividend sweep proceeds | (+) | Per model |
| Dividend recap net proceeds | (+/−) | Net of fees; debt increase must be reflected in the net debt line |
| Net debt repayment / (increase) | (+/−) | Entry net debt − exit net debt (captures both debt paydown and cash build) |
| Preferred equity accretion | (−) | Per model |
| Equity used to fund operating losses | (−) | Per model |
| Equity deployed for M&A | (−) | Per model; already captured in total equity contribution denominator |

**Step 4 — Compute exit equity value and foot the bridge**
Sum Step 1 entry equity value + all Step 2 TEV growth components + all Step 3 below-TEV adjustments = implied exit equity value. Independently calculate exit equity value from the exit waterfall's common equity value. Insert a hard check row:

```
Bridge-implied exit equity  −  Waterfall exit equity  =  Residual
Flag if |Residual| > $0.1M
```

Convert every dollar line to MOIC contribution: Component $ ÷ Total equity contribution. Insert a second hard check row:

```
Sum of all MOIC contributions  −  Independently calculated MOIC  =  Residual
Flag if |Residual| > 0.01x
```

Do not deliver until both checks clear.

**Step 5 — Build the waterfall chart**
- First bar: entry equity (grounded, anchored at zero baseline)
- Last bar: exit equity (grounded)
- Intermediate bars: floating, one per bridge component
- Label each bar with $ value and the driving assumption (e.g., "+500bps margin improvement", "+2.0x multiple expansion", "−$15M fees")
- Produce two versions: summary (major categories) and detailed (all line items)
- Size for PPT slide embed

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Build order | $ attribution first, then ÷ total equity contribution for MOIC(x) | Dollar decomposition is the numerically stable foundation; MOIC is derived |
| Covariance convention | Absorb into multiple expansion (organic at entry multiple × ΔEBITDA; expansion at Δmultiple × organic exit EBITDA) | Conservative — attributes the interaction term to the less controllable driver |
| Inorganic component valuation | Exit multiple applied to inorganic EBITDA | No entry baseline exists for items not in the business at acquisition |
| Multiple expansion EBITDA base | Organic-only exit EBITDA (M&A / de novo / cost savings EBITDA excluded) | Including inorganic EBITDA double-counts those contributions |
| Fees | Combined into single drag line | Cleaner unless client requests split |
| MOIC denominator | Initial equity check + all subsequent equity injections during hold | Total capital at risk is the correct denominator |
| Net debt | Entry net debt − exit net debt (gross debt offset by cash) | Captures both debt repayment and cash accumulation; gross debt view misses cash build |
| Tax shield treatment | Added to exit proceeds as standalone line; not capitalized in EBITDA × multiple TEV | Capitalizing inside TEV inflates the multiple expansion component |
| Divestiture treatment | Displayed as negative TEV growth component; proceeds routed to net debt line | Keeps TEV bridge clean; cash effect flows through the correct channel |
| Zero-contribution rows | Suppressed | Reduce noise; include only components present in the model |
| Waterfall chart default | Summary (major categories) sized for PPT | Detail version available on request |
| EBITDA definition consistency | Entry and exit use the same basis (LTM / NTM / run-rate); any mismatch disclosed | Apples-to-apples is required for the delta to be meaningful |

---

### Rules & Pitfalls

**Never:**
- **Never use gross debt in the net debt repayment line** — it ignores cash accumulation during the hold and will understate the leverage contribution to equity value; use entry net debt minus exit net debt, and ensure dividend recap debt increases are reflected in that line (omitting them is a categorically flagged error).
- **Never capitalize the exit-date tax shield inside EBITDA × multiple TEV** — it belongs as a standalone add-on to exit proceeds; placing it inside TEV inflates multiple expansion and misrepresents the source of value.
- **Never compute organic growth at exit multiple AND multiple expansion at entry EBITDA simultaneously** — this double-counts the covariance cross-term and will break the foot; pick one convention and apply it everywhere.
- **Never use organic-exit EBITDA inclusive of M&A / de novo / cost savings EBITDA as the base for multiple expansion** — this double-counts inorganic contributions in the expansion line and overstates organic-driven value.
- **Never omit subsequent equity injections (M&A deployment, operating-loss funding) from the MOIC denominator** — using only the initial check understates the true equity basis and artificially inflates MOIC.
- **Never use a simple flat percentage for MIP** — apply the actual exit waterfall payout respecting hurdle rates and tier structure; a flat percentage misrepresents sponsor net economics.
- **Never deliver a bridge that does not foot** — a MOIC residual above 0.01x or a dollar residual above $0.1M means a component is mislabeled, double-counted, or missing; stop and debug before sharing.

**Conditional:**
- **If the entry multiple is reported on a fully-loaded basis (total acquisition cost including fees ÷ EBITDA):** strip fees out and recompute a clean entry multiple before calculating organic growth and multiple expansion; failure to do so distorts both components.
- **If the model contains business segments or product lines:** decompose organic revenue growth and margin improvement at the segment level first, then aggregate; segment-level detail is available to support quantity / price / mix attribution.
- **If a divestiture is present:** either (a) restate entry financials on a RemainCo basis, or (b) default — show divestiture as a negative TEV growth component and route proceeds through the net debt line; disclose the treatment chosen.
- **If the model includes a dividend recap:** the associated debt increase must appear in the net debt repayment line (reducing net repayment or turning it negative); routing only the cash proceeds through dividend recap net proceeds without adjusting net debt double-counts the benefit.
- **If a non-default covariance convention is used:** state it explicitly in a table footnote and verify it is applied consistently across every component in the bridge.

**Judgment:**
- **Prefer organic-at-entry-multiple convention for covariance** — attributing the cross-term to multiple expansion is the industry-conservative default because expansion is the less controllable driver; use it unless the LP specifically requests an alternative.
- **Flag leverage-dominant returns proactively** — when debt repayment contribution exceeds organic EBITDA growth contribution, disclose this explicitly in the summary; LPs distinguish between "earned" returns and "financial engineering" returns, and obscuring this is a credibility risk.
- **Combine fees into one drag line unless the audience needs the split** — granular fee breakdowns add noise at IC without adding insight; reserve detail for due diligence or CFO-level review.
- **Verify the organic exit EBITDA subtraction explicitly** — when building organic-only exit EBITDA, confirm that M&A EBITDA, de novo EBITDA, and cost-savings EBITDA are each subtracted; it is the single most common computation error and leads to overstated organic growth attribution.

---

### Pre-Delivery Checks

- **Verify MOIC foot:** sum of all MOIC contribution rows equals independently calculated total MOIC; flag and debug if residual > 0.01x.
- **Verify dollar foot:** sum of all $ contribution rows equals independently calculated exit equity value from the exit waterfall; flag and debug if residual > $0.1M.
- **Tie exit equity value to exit waterfall:** bridge-implied exit equity must match the common equity value line in the exit waterfall exactly.
- **Confirm all EBITDA sub-components sum to consolidated exit EBITDA:** organic + M&A + de novo + cost savings + divestiture adjustment = total exit EBITDA per model.
- **Confirm equity base completeness:** total equity contribution (MOIC denominator) = initial sponsor check + all subsequent equity injections; reconcile to model capital account.
- **Confirm net debt lines:** entry net debt − exit net debt = net debt repayment figure; verify dividend recap debt increase is embedded and not omitted.
- **Confirm organic-only exit EBITDA:** starting from consolidated exit EBITDA, subtract M&A EBITDA, de novo EBITDA, and cost savings EBITDA; use this figure — and only this figure — as the multiple expansion base.
- **Confirm tax shield placement:** tax asset PV appears as a standalone below-the-TEV or exit-proceeds line, not within EBITDA × multiple.
- **Confirm sign conventions:** fees negative; MIP negative; preferred equity accretion negative; net debt repayment positive when debt falls or cash builds; dividend sweep and recap net proceeds positive.
- **Run reasonableness flags:**
  - Organic EBITDA growth > 60% on a hold < 3 years — investigate and disclose
  - Multiple expansion > 50% of total value creation — investigate; disclose if large-cap
  - Debt repayment contribution > organic EBITDA growth contribution — flag as leverage-dominant return profile
  - Fee drag > 5% of entry equity — verify no double-counting with MIP or preferred accretion
  - MIP payout > 15% of gross equity proceeds — verify waterfall hurdle/tier inputs
  - Net debt increasing at exit — confirm whether intentional (e.g., recap) and disclosed

---

### Scope Boundaries

The **IRR Decomposition** playbook handles attribution of IRR percentage (not dollars or MOIC) and introduces Base Unlevered Yield, Fully-Loaded TEV, and cash sweep timing mechanics — run that playbook when the audience requires a rate-of-return attribution rather than an equity-value attribution.

Exit waterfall construction (common equity, preferred stack, MIP tier calculations) is a prerequisite input to this playbook, not built here; confirm the waterfall is finalized before beginning Step 1.

---

## Liquidation Waterfall

**Use when**: A term sheet, LLCA, or operating agreement requires translation into a scenario-based distribution model | **Deliverable**: Excel workbook containing a terms summary tab (pending confirmation), EV-sensitivity waterfall tab, two distribution line charts, tie-out validation tab, and a 3-sentence executive summary

---

### Ask First
1. **EV range and check size** — What is the investment amount (check size) and the intended EV scenario range? Never assume either.
2. **Pre-money vs. post-money** — Which basis governs ownership percentages? This determines the equity % denominator; confirm before building any ownership column.
3. **Accumulated preference: PIK or cash-pay?** — PIK (non-cash) compounds into the liquidation preference over time; cash-pay does not. If PIK, confirm the investment date, expected exit date, compounding frequency, and exact formula (e.g., `Cost × (1 + rate/4)^(days/365 × 4)`).
4. **Seniority among preferred tranches** — For multi-tranche cap tables, confirm whether tranches rank pari passu or sequentially (senior first); if sequential, list the order.

---

### Workflow

**Phase 1 — Parse the legal document and obtain user sign-off before building**

1. Read the term sheet / LLCA / operating agreement verbatim. Extract: structure type (identify from the 7 types below), liquidation preference multiple, cumulative/PIK vs. cash-pay mechanics, participation rights, cap (if any), anti-dilution provisions, and any MOIC-threshold options or performance warrants.
2. Classify the structure into one of the **7 types**:
   - ① Simple convertible — payout = *greater of Xx liquidation preference or as-converted value*
   - ② Cumulative preferred — preference accrues over time (clarify PIK vs. cash-pay)
   - ③ Step-up multiple — preference multiple increases at defined time thresholds
   - ④ Participating preferred (uncapped) — investor receives preference *plus* pro-rata share of residual
   - ⑤ Participating preferred with cap — participation terminates once investor reaches a specified return cap
   - ⑥ SAFE — apply conversion mechanics per the specific instrument terms
   - ⑦ Hybrid — e.g., participating preferred with an additional dividend layer; flag and apply judgment

   For **edge cases** (anti-dilution adjustments, MOIC-gated options, performance warrants, multi-tranche preferred with mixed seniority) — request additional documentation before proceeding.

3. Present the parsed parameters in a structured summary to the user: structure type, multiples, cumulative terms, cap, seniority order. **Do not write a single formula until the user explicitly confirms the interpretation is correct.**

**Phase 2 — Build the model in tab sequence**

4. **Input tab**: hardcode only confirmed parameters — check size, investment date, exit date (linked to a single `Exit Year` input cell; never hardcode), PIK rate and compounding formula, preference multiple, cap level, fully diluted share count breakdown (preferred / common / options / warrants).
5. **EV scenario header row**: drive all scenario columns from MOIC inputs spanning **0.5x – 5.0x** in increments that round implied EV amounts to the nearest $0M or $5M.
6. **Liquidation preference ladder**: compute the accrued preference for each scenario column using the confirmed PIK/cash-pay formula and the linked exit date. For PIK, calculate day-count precisely from investment date to exit date.
7. **Distribution engine — apply layers strictly in order**:
   - Layer 1 — Liquidation preference (senior preferred first if tranches are ranked; pari passu split if equal rank)
   - Layer 2 — Participation (pro-rata share of residual proceeds after preference is satisfied; do not re-count preference dollars here)
   - Layer 3 — Common stock residual (including option pool, modeled as a separate third category)
   - At each layer, apply the `MIN()` / `MAX()` logic that mirrors the exact legal language; cite the specific clause in a cell comment.
8. **As-converted check**: compute the as-converted payout using fully diluted share count (preferred + common + options + warrants). Where structure type ① applies, output `MAX(preference, as-converted)`.
9. **Management option pool**: model as a distinct third tranche with its dilutive effect on common residual; display separately in charts.
10. **Low-EV scenario logic**: when EV < total liquidation preference, allocate 100% to preferred (preference is impaired pro-rata); common receives $0.

**Phase 3 — Tie-out validation layer (build before any output is shown)**

11. For every EV scenario column, calculate and display two check rows:
    - `Investor proceeds + Common proceeds – Total exit proceeds = 0`
    - `Investor % + Common % – 100% = 0`
12. Flag any non-zero result in red. **Do not deliver the workbook until all checks pass.** Debug before proceeding.

**Phase 3 — Analysis and executive summary**

13. Identify and label the following inflection points across the scenario range:
    - **Dead zone**: EV range where investor is indifferent to performance (pinned at preference floor or participation cap)
    - **Conversion point**: EV at which investor should convert to common (as-converted > preference + participation)
    - **Common stock floor**: minimum EV at which common shareholders receive their first dollar
    - **Double-dip quantification**: incremental dilution to common from participating vs. simple convertible structure at each EV
    - **Ineffective cap**: if the participation cap is set so high it is never reached within the 0.5x–5.0x scenario range, flag it as *de facto uncapped*
    - **Exit-timing sensitivity**: for cumulative/step-up structures, calculate the change in common proceeds from a one-year delay in exit

14. Write the 3-sentence executive summary (place immediately to the right of the assumptions block, not in cell comments):
    - **Sentence 1 — Investor floor**: minimum investor proceeds in a downside scenario and the EV at which that floor applies.
    - **Sentence 2 — Conversion / cap point**: the EV at which payout logic switches (investor converts to common, or participation cap is reached).
    - **Sentence 3 — Common stock threshold**: the EV required before common shareholders see any proceeds.

#### Deliverable Tab Map

| Tab | Contents |
|---|---|
| `0_Terms_Summary` | Parsed parameters pending user confirmation; source clause citations |
| `1_Waterfall` | EV scenario header (MOIC-driven), distribution engine, tie-out check rows |
| `2_Charts` | Chart A: $ distribution — investor vs. common (vs. option pool if applicable); Chart B: % distribution — same split; axes must not overlap |
| `3_Validation` | Tie-out results for all scenarios, color-coded |
| `4_Exec_Summary` | 3-sentence summary; inflection point table |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| EV scenario range | MOIC 0.5x – 5.0x | Captures both impaired and high-return exits in a single view |
| EV column increments | Round implied EV to nearest $0M or $5M | Clean presentation; avoids false precision in scenario headers |
| Fully diluted share count basis | All preferred (as-converted) + common + vested/unvested options + warrants | Correct denominator for as-converted payout; using basic count overstates per-share value |
| Exit Year | Linked input cell, not hardcoded | Enables exit-timing sensitivity without rebuilding the model |
| PIK compounding | Quarterly compounding: `Cost × (1 + rate/4)^(days/365 × 4)` | Most common contractual default; override immediately if LLCA specifies otherwise |
| Day-count for PIK | Actual days from investment date to exit date | Precision required; annual approximations misstate accrued preference |
| Option pool | Modeled as third tranche, separate from common | Isolates dilutive effect; combined treatment masks management incentive economics |
| Cell comments (clause citations) | Embedded but hidden by default | Preserves legal traceability without cluttering the working view |

---

### Rules & Pitfalls

**Never:**
- **Never build formulas before the user confirms the parsed parameter summary** — a misread of "3x capped participating" vs. "3x non-participating" produces entirely different economics; correcting post-build wastes time and erodes trust.
- **Never override explicit legal language with financial convention** — if the LLCA specifies an unusual calculation, model it verbatim and cite the clause; "this is how it's typically done" is not a valid justification.
- **Never deliver a waterfall with a failing tie-out** — investor + common ≠ total exit proceeds signals a mathematical error in the distribution engine; reviewers will catch it instantly and it invalidates the entire analysis.
- **Never use basic share count for the as-converted calculation** — it overstates per-share value and is the fastest credibility-killer with legal and finance reviewers.
- **Never hardcode the exit year** — all time-dependent calculations (PIK accrual, step-up multiples) must link to a single input cell to enable exit-timing sensitivity.
- **Never allow investor proceeds to double-count the preference amount in the participation layer** — the participation layer distributes residual proceeds *after* preference is satisfied; the preference dollars must not re-enter the participation calculation.

**Conditional:**
- **If the term sheet is silent, internally contradictory, or ambiguous on any parameter** — explicitly flag it as an unconfirmed assumption in `0_Terms_Summary`, isolate it so the user can approve or correct it, and do not resolve it by convention.
- **If accumulation is PIK** — increase the liquidation preference balance over time using the confirmed formula and precise day-count; do not treat it as a fixed multiple of original cost.
- **If accumulation is cash-pay** — do not roll cash dividends into the liquidation preference; they are a separate cash flow and do not compound into the preference balance.
- **If multiple preferred tranches exist** — confirm pari passu vs. ranked seniority before building; if ranked, apply senior tranches first and exhaust each before allocating to the next.
- **If EV < total liquidation preference** — allocate 100% of proceeds to preferred (pro-rata by preference balance if pari passu, senior-first if ranked); common receives exactly $0.
- **If the participation cap is never triggered within the 0.5x–5.0x EV range** — flag the cap as ineffective and note that the structure is economically equivalent to uncapped participating preferred within the modeled range.
- **If edge cases are present** (anti-dilution, MOIC-gated options, performance warrants) — request additional documentation and do not model these features under assumed mechanics.
- **If source reports equity value only** — rebuild EV via the equity bridge (equity value + net debt + preferred + minority interest) before using as the waterfall EV input.

**Judgment:**
- **Express results in decision language, not raw numbers** — "Investor converts to common at EV $240M; below that, investor holds the 2.0x preference floor" conveys the economic inflection far more usefully than a table of dollar amounts.
- **Prefer legal fidelity over analytical elegance** — a model that mirrors the exact contractual mechanics (even if unusual) is more valuable than a cleaner model that silently deviates from the LLCA.
- **Flag hybrid structures explicitly rather than silently resolving them** — a participating preferred with an additional dividend layer (type ⑦) has multiple plausible interpretations; surface the ambiguity and agree on the treatment before building.
- **Treat the dead zone as a key negotiating insight** — a wide dead zone means investor incentives are misaligned with company performance over a meaningful EV range; this is often the most actionable finding for management and boards.

---

### Pre-Delivery Checks

- Confirm every EV scenario column satisfies: `Investor proceeds + Common proceeds = Total exit proceeds` (difference = $0).
- Confirm every EV scenario column satisfies: `Investor % + Common % = 100%` (difference = 0%).
- Confirm all check rows are visible in the workbook (not hidden); failing cells flagged in red.
- Verify the PIK accrual formula uses actual day-count from investment date to exit date, not an annual approximation.
- Verify ownership percentages use fully diluted share count (preferred as-converted + common + options + warrants) as the denominator.
- Verify the exit year is linked to a single input cell and that changing it flows through all PIK and step-up calculations correctly.
- Verify that the as-converted payout for structure type ① returns `MAX(preference, as-converted value)` — not one or the other unconditionally.
- Verify the participation layer does not re-include preference dollars already allocated in Layer 1.
- Verify that for EV scenarios below total liquidation preference, common proceeds equal exactly $0.
- Verify the EV scenario header spans MOIC 0.5x – 5.0x with column amounts rounded to the nearest $0M or $5M.
- Verify the two charts display without overlapping axes: Chart A shows $ proceeds (investor / common / option pool); Chart B shows % proceeds (same split).
- Verify the 3-sentence executive summary is positioned to the right of the assumptions block (not in cell comments).
- Verify all clause citations are embedded as cell comments in the distribution engine rows.
- Confirm `0_Terms_Summary` reflects the parameters the user explicitly approved — not the raw term sheet language and not analyst-assumed parameters.

---

### Scope Boundaries

The **Management Incentive Plan** playbook handles management-side exit waterfall modeling (carried interest, hurdle rates, ratchet mechanisms, and incentive equity vesting economics) — hand off when the primary question is how management equity participates rather than how investor preferences are satisfied.

The **LBO Model** playbook handles the returns waterfall in a leveraged buyout context (debt repayment sequencing, sponsor equity returns, and IRR/MOIC to fund) — hand off when the capital structure is debt-driven rather than preferred-equity-driven.

---

## MIP Modeling

**Use when**: Modelling management incentive economics inside an LBO exit waterfall | **Deliverable**: Excel workbook — MIP schedule (one column per potential exit year) integrated into the exit waterfall, plus value bridge with MIP as a labelled negative row

---

### Ask First
1. **Plan type** — option pool, % of proceeds, sweet equity, profits interests, SAR, or exit bonus/phantom? (Default: option pool)
2. **Vesting / granting status** — fully vested and granted, or are specific vesting schedules / granting percentages provided?
3. **Multiple tranches** — are there separate hurdle tiers that vest independently? If yes, obtain strike / hurdle and size for each tranche.
4. **Performance hurdle** — is there a pre-MIP MOIC or proceeds hurdle that must be cleared before any payout triggers, and should it reference pre-MIP or post-MIP metrics?

---

### Workflow

1. **Confirm scope** — lock answers to the four "Ask First" questions before touching the model. (Prevents rebuilding the payout formula after the waterfall is wired.)

2. **Establish the entry equity value baseline** — calculate entry common equity value (not TEV) for use as the option strike reference and, for sweet equity, as the management co-investment entry value. (Strike is per-share and equity-based; using TEV here is the most common input error.)

3. **Build the plan-type payout module** — construct a separate block for each plan type present; sum tranches at the end rather than blending them upfront. Build all plan types as described below, keeping each mechanically distinct:

   - **Option pool**: Compute fully diluted shares using the correct dilution formula (see Defaults). Set payout per share = MAX(exit equity value per share − strike, 0). Aggregate MIP payout = diluted shares × per-share payout. If exit ≤ entry (≤ 1× strike), MIP = 0.
   - **% of proceeds**: Apply the percentage to *cumulative total proceeds*, not to gross exit equity value. Define:
     `Cumulative total proceeds = MAX(cumulative distributions − |cumulative equity invested|, 0)`. Include interim dividends in cumulative distributions and all equity injections in cumulative invested.
   - **Sweet equity** *(most complex — seven sub-steps)*:
     1. Model the **institutional strip** — split between preferred (PIK-style compounding) and common.
     2. Accrue preferred at the contractual PIK / compounding rate through each potential exit year.
     3. Determine each investor's (sponsor, management co-invest, sweet equity) proportionate share of the common equity tranche.
     4. Calculate management's *theoretical* common equity value assuming the same blended MOIC as all investors — this is the co-invest return baseline.
     5. Calculate **MIP payout = management's actual equity value − theoretical co-invest value; floor at zero**. This isolates the *incremental* upside slice above the overall return; it is not management's total equity value.
     6. At each exit year, **tie out**: sum of all investor values = total institutional strip exit value. If this does not foot, diagnose before proceeding.
     7. Confirm: at entry MOIC = 1×, sweet equity increment = 0.
   - **Profits interests (LLC)**: Set participation threshold = entry common equity value (default). Confirm with user if tiered. MIP payout = management's share of appreciation above threshold.
   - **SAR (cash-settled)**: Compute payout as value appreciation × number of units. SARs are cash-settled — do **not** issue shares and do **not** dilute the share count.
   - **Exit bonus / phantom equity**: Default — compute gross bonus on *gross* equity value to avoid circularity. If net-of-bonus treatment is required, flag to user and use goal-seek; confirm whether MOIC hurdle is measured pre- or post-bonus.

4. **Handle multi-tranche hurdles** — build each tranche as an independent block with its own hurdle and size. Do not require all hurdles to be reached before any tranche pays; each tranche vests when its own hurdle is cleared. Reference pre-MIP MOIC / proceeds in every hurdle test.

5. **Apply vesting / granting rules** — if the user provides a vesting schedule or granted percentage, calculate MIP only on vested and granted shares / units. If no schedule is provided, apply the 100% default silently.

6. **Extend across all potential exit years** — replicate the full MIP calculation for every modelled exit year (typically years 3–7). Use the same mechanism in each year; do not copy-paste a single-year result.

7. **Insert MIP into the exit waterfall at the correct position**:

   ```
   Exit TEV
   − Debt repayment
   − Preferred equity (accrued)
   = Gross common equity value
   − MIP payout                  ← insert here
   = Net common equity value
     → Sponsor share (per ownership %)
     → Management co-invest share (per ownership %, pari passu)
   ```

8. **Separate management co-invest from MIP in the waterfall** — co-invest receives its pro-rata share of net common equity on the same terms as the sponsor (pari passu). MIP is the incremental incentive layer on top. Never allocate 100% of net common equity to the sponsor while ignoring management's co-invest proportion.

9. **Wire MIP into the value bridge as a negative contribution row** — MIP is a cost to the sponsor. In the MOIC decomposition bridge, MIP must appear as a clearly labelled negative line. Sponsor IRR and MOIC are always computed on net common equity (post-MIP).

10. **Run all sanity checks** — see Pre-Delivery Checks before sharing output.

#### Sweet Equity — Detailed Sub-Build Reference

| Sub-step | Action | Key mechanic |
|---|---|---|
| 1 | Model institutional strip | Preferred + common split per term sheet |
| 2 | Accrue preferred | PIK-style compounding each exit year |
| 3 | Allocate common proportions | Sponsor / mgmt co-invest / sweet equity slices |
| 4 | Compute co-invest theoretical value | Management proportion × total common at blended MOIC |
| 5 | Compute MIP increment | Actual mgmt value − theoretical; floor = 0 |
| 6 | Tie out each exit year | ΣAll investor values = strip total exit value |
| 7 | Confirm zero-increment at 1× | Sweet equity payout = 0 when MOIC = 1× at entry |

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Plan type | Option pool | Most common PE portfolio company MIP structure |
| Vesting / granting | 100% vested and granted | PE assumes liquidity event accelerates vesting; conservative to use full authorised pool |
| Waterfall position | Debt → Preferred → Gross common → **deduct MIP** → Net common | MIP is a cost senior to sponsor/co-invest common distribution |
| Option strike basis | Entry common equity value (not TEV) | Strike is per-share and equity-based |
| Strike level | 1× entry common equity value per share | Par / at-the-money grant at close |
| Option payout floor | MAX(MIP share value − strike, 0) | Options cannot have negative value; exit ≤ entry = 0 payout |
| Hurdle reference | Pre-MIP MOIC / proceeds | Avoids circularity; hurdle tests must precede MIP deduction |
| Exit bonus computation | Gross equity basis | Avoids circular reference; net basis requires goal-seek |
| SAR settlement | Cash-settled; no share issuance | SAR mechanics are non-dilutive by definition |
| Profits interests participation threshold | Entry common equity value | Standard LLC structure; flag to user if tiered |
| Exit years modelled | All potential exit years in LBO (typically years 3–7) | MIP economics change materially with holding period |
| Tranche vesting | Each tranche vests independently at its own hurdle | Reflects standard tiered MIP term sheet mechanics |

---

### Rules & Pitfalls

**Never:**
- **Never hard-code MIP as a fixed dollar amount or a simple percentage of exit equity** — doing so ignores the dynamic effects of strike price, hurdle thresholds, preferred accrual, and dilution mechanics, and will produce wrong numbers in every exit year except the one it was calibrated to.
- **Never apply the dilution percentage directly to basic shares** — the correct formula is `Diluted shares = Basic shares × (pool% / (1 − pool%))`. Applying pool% additively overstates dilution and understates per-share value.
- **Never set the option strike based on TEV** — the strike is per-share and references *common equity value* at entry. Using TEV inflates the strike and understates MIP cost to the sponsor.
- **Never place the MIP deduction after the sponsor/co-invest common equity split** — MIP must be deducted from gross common equity *before* allocating net common equity to any investor. Placing it after is a waterfall sequencing error that overstates sponsor proceeds.
- **Never apply the % proceeds MIP to gross exit equity value** — it applies to cumulative *proceeds* (cumulative distributions minus cumulative equity invested, floored at zero). Ignoring this floor overstates MIP when the sponsor has not yet recovered its cost.
- **Never let MIP go negative** — a negative MIP payout is mechanically impossible; floor all outputs at zero.
- **Never assign 100% of net common equity to the sponsor while ignoring management co-invest** — co-invest participates pari passu; its proportionate share of net common equity must be allocated separately from MIP.
- **Never use MIP payout = management's total equity value in a sweet equity structure** — the correct MIP is the *incremental* value above what management would have received at the blended MOIC (i.e., the pure co-invest return). Conflating the two overstates incentive cost and misrepresents the payout to both management and the sponsor.
- **Never mix management co-invest returns with MIP incentive economics** — co-invest and MIP are legally and economically distinct. Do not net them together or report a single "management total" without decomposing the two components.
- **Never model only the final exit year** — MIP must be calculated independently for every potential exit year, because payout changes with holding period, preferred accrual, and MOIC.

**Conditional:**
- **If the user provides explicit vesting schedules or granted percentages**, use only vested and granted shares / units in the MIP calculation — do not revert to the 100% default.
- **If exit bonus net-of-bonus treatment is required** (i.e., MOIC hurdle references post-bonus equity), rebuild using goal-seek and confirm with the user whether the MOIC threshold is pre- or post-bonus before proceeding.
- **If the user specifies multiple tranches**, build each tranche as a fully independent block (separate hurdle test, separate size, separate payout formula) and sum at the waterfall deduction line — do not aggregate inputs before running the hurdle logic.
- **If SAR settlement is structured as equity-settled in a specific deal**, override the cash-settled default, issue shares, and include in the fully diluted share count — but confirm explicitly; default remains cash-settled.
- **If profits interests are tiered**, confirm each participation threshold with the user before building; do not assume all tiers reference entry common equity value.
- **If the sponsor MOIC bridge is prepared**, ensure the MIP row in the bridge is exactly equal to the MIP deduction in the waterfall — any discrepancy is a model integrity error.

**Judgment:**
- **Treat MIP as an economic cost to the sponsor from the first draft** — sponsors who see MIP disclosed only at closing as a surprise dilution item lose confidence in the model. Build it in from the outset even if terms are indicative.
- **Prefer the gross equity basis for exit bonus calculations unless the deal team explicitly requests net** — net treatment adds model complexity (goal-seek) and is more prone to error under scenario analysis.
- **Flag sweet equity payout > 20% of common equity value and common equity > 25% of total capitalisation** — both are structural signals that the capital structure or MIP terms may be outside typical PE ranges and warrant senior review.
- **When pre-MIP MOIC < 1×, MIP should be zero** — sponsors have not recovered capital; management participation above par in a loss scenario is both mechanically wrong and commercially indefensible. Build the hurdle logic to enforce this automatically.
- **In the MOIC value bridge, label the MIP row explicitly as a negative contribution** — reviewers (IC, lenders, auditors) will look for this row; an unlabelled or buried deduction reduces credibility.

---

### Pre-Delivery Checks

- **Verify** net common equity = gross common equity − MIP for every exit year modelled.
- **Verify** MIP = 0 in every year where exit equity value ≤ entry equity value (at-the-money or underwater options yield zero payout).
- **Verify** MIP ≥ 0 in all years; no negative MIP values exist anywhere in the model.
- **Flag** any year where MIP > 10% of gross common equity value — escalate to senior review before delivery.
- **Flag** any year where MIP > 0 but pre-MIP MOIC < 1× — this is a model logic error; sponsor has not recovered cost and no MIP should be payable.
- **Verify** sponsor IRR and MOIC are computed on net common equity (post-MIP) in all return summary tables.
- **Verify** the MIP line in the MOIC value bridge is negative and ties exactly to the MIP deduction in the waterfall.
- **Verify** option pool fully diluted share count = basic shares × (pool% / (1 − pool%)) and is consistent with the pool percentage in the term sheet.
- **Verify** option strike is referenced to entry common equity value per share, not TEV.
- **Verify** % proceeds MIP applies to cumulative proceeds (cumulative distributions − |cumulative equity invested|, floored at zero) and that interim dividends are included in cumulative distributions.
- **Verify** (sweet equity only): sum of all investor values = total institutional strip exit value, for every exit year — this tie-out must foot to zero variance.
- **Verify** (sweet equity only): preferred accrual compounds correctly through each exit year at the contractual rate.
- **Verify** (sweet equity only): management entry value equals management co-investment amount.
- **Verify** (sweet equity only): at 1× entry MOIC, sweet equity incremental MIP = 0.
- **Flag** (sweet equity only): sweet equity MIP > 20% of common equity value.
- **Flag** (sweet equity only): common equity > 25% of total capitalisation.
- **Verify** management co-invest receives its pro-rata share of net common equity separately from MIP payout; the two are not commingled.
- **Verify** each tranche in a multi-tranche structure has been tested against its own hurdle independently, not requiring all hurdles to clear simultaneously.
- **Verify** hurdle tests reference pre-MIP MOIC / proceeds, not post-MIP.

---

### Scope Boundaries

MIP covers incentive economics for **portfolio company management** in an LBO context only — option pools, % proceeds, sweet equity, profits interests, SARs, and exit/phantom bonuses tied to a PE exit event. Public company equity compensation (RSUs, public stock options, broad-based ESOP) and GP carry / promote structures are handled by separate playbooks. The LBO Model playbook owns the core returns model, debt schedule, and operating forecast into which this MIP schedule is plugged; the Liquidation Waterfall playbook handles term-sheet and LLCA-level liquidation preference analysis distinct from LBO exit modelling.
