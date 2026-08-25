# Due Diligence

Playbooks for running buy-side diligence: request lists and trackers, data-room gap reviews, quality of earnings, customer revenue analytics, interview guides, and credit document summaries. Load `formats/excel_standards.md` for Excel trackers/analytics and `formats/document_standards.md` for memos.

## Contents

| Task | Use when |
|---|---|
| [DD Request List (DRL)](#dd-request-list-drl) | User requests a due diligence request list (DRL) for an M&A or PE transaction |
| [DD Tracker](#dd-tracker) | Building an M&A or PE due diligence tracking workbook from scratch |
| [VDR Gap Analysis](#vdr-gap-analysis) | A buy-side investment team has received a data room and needs to map its contents to standard diligence questions, assess coverage, and identify gaps |
| [Buy-Side QoE Review](#buy-side-qoe-review) | A sell-side QoE report is available and the buyer needs an independent underwrite of true go-forward EBITDA |
| [Revenue Data Cleanup & Audit](#revenue-data-cleanup-&-audit) | MRR/customer-level time-series data requires quality audit before analysis |
| [Customer-Level Revenue Analytics](#customer-level-revenue-analytics) | Raw customer-level revenue data ("customer cube") is available and the engagement requires NRR, cohort, concentration, and churn/new/expansion drill-downs |
| [Retention & Cohort Analysis](#retention-&-cohort-analysis) | Customer-level revenue data is available and the goal is to quantify retention, churn, upsell/downsell, and cohort decay |
| [Management Meeting Questions](#management-meeting-questions) | Preparing qualitative discussion questions for a live management meeting in an M&A or PE due diligence context |
| [Expert Call Guide](#expert-call-guide) | A scheduled expert-network call (GLG, Third Bridge, Tegus, AlphaSights, or equivalent) requires a structured discussion guide |
| [Credit Agreement Summary](#credit-agreement-summary) | A credit agreement requires distillation for a partner-level audience before a client call |

---

## DD Request List (DRL)

**Use when**: User requests a due diligence request list (DRL) for an M&A or PE transaction | **Deliverable**: Excel workbook (.xlsx) — 13-column standalone DRL with conditional formatting, AutoFilter, and ≥200 pre-populated rows (or structured request rows when called by the DD Tracker playbook)

---

### Ask First

Confirm all six intake questions before generating. **At minimum, Q1 (depth) and Q3 (focus areas) must be answered before any output is produced.** The remaining four are required for a complete build; do not skip them unless the call originates from DD Tracker (in which case all parameters are passed programmatically — proceed immediately with no questions).

1. **Depth** — IOI / pre-LOI stage (~10–15 requests) or second-round full diligence (25–100 requests)?
2. **Industry** — What sector or sub-vertical is the target in?
3. **Focus areas** — Which workstreams or risk themes should be prioritised (e.g., customer concentration, unit economics, management, capex)?
4. **Time horizon** — How many historical years are in scope? *(Default: 3 years — confirm or override.)*
5. **Existing template** — Has the buyer or their counsel provided a DRL template with defined columns, tabs, or dropdowns?
6. **Existing materials** — Are any materials available (CIM, VDR index, prior DRL, management presentation)? If yes, attach before generation begins.

> **Note on uploaded materials**: A CIM or VDR answers factual questions about the company but cannot answer questions about the user's priorities and investment focus. Depth and focus areas cannot be inferred from a CIM — always ask Q1 and Q3 even when a CIM is provided.

---

### Workflow

1. **Determine invocation mode** *(establishes the entire output path)*
   - Called by DD Tracker → skip all intake questions; consume the passed workstream list, depth, and available materials; return structured request rows (Mode A).
   - Called directly by user → complete all six intake questions before proceeding.

2. **Read all uploaded materials in full before generating a single request** *(prevents duplication and sets the scope baseline)*
   - Review every file, including spreadsheet hidden tabs — file names are not reliable indicators of content.
   - Build an inventory of what has already been provided or is visible in the VDR index.
   - Identify: (a) value drivers, (b) unexplained material trends (accelerating growth, margin inflections, forecast step-changes, deterioration), (c) segmentation structure, and (d) concentration or risk flags (customer, supplier, cycle, moat).

3. **Generate requests** *(apply depth guidance, mandatory items, industry-specific metrics, and sensitivity handling simultaneously)*
   - Each identified risk theme → 1–3 requests.
   - Each unexplained material trend → at minimum 1 request.
   - Each mandatory item not already in hand → include; each item already provided → exclude with a disclosure note at delivery.
   - Apply industry-specific metrics for the confirmed sector (see table below).
   - Flag sensitive requests with anonymisation / blinding language where direct identification is not required.
   - Do not pad: include only requests with genuine analytical value.

4. **Select output mode and build the Excel file**
   - **Mode A (DD Tracker call):** Return request rows with columns: Workstream, Description, Priority, Status, Notes. Leave date columns blank for the Tracker to populate.
   - **Mode B (user-supplied template):** Mirror the template's columns, tab names, dropdowns, and formatting exactly. Do not impose any alternative schema.
   - **Mode C (default standalone):** Build the 13-column workbook per the schema below.

5. **Run pre-delivery sanity checks** *(see Pre-Delivery Checks section)*

6. **Deliver with a written disclosure note** explaining: (a) any mandatory item not requested and the specific reason (e.g., "Historical P&L not requested — available at VDR index 4.2.1"), and (b) any open requests on an uploaded DRL that can be closed based on reviewed materials, pending user confirmation.

---

#### Mode C Default Schema (13 columns)

| Column | Content / Formula |
|---|---|
| Request # | Auto-incrementing formula |
| Workstream | Category label (primary sort key) |
| Description | Full, specific, prescriptive request text |
| Priority | Dropdown: High / Medium / Low |
| Status | Dropdown: Open / Partial / Received / Closed |
| Third Party | Counterparty or provider responsible |
| Date Requested | Date field |
| Last Response Date | Date field |
| Buyer Comments | Free text |
| Seller Comments | Free text |
| VDR Reference | Document path or index reference |
| Days Outstanding | Calculated formula |
| Notes | Assumptions, gap descriptions, anonymisation flags |

**Formatting rules for Mode C:**
- Conditional formatting: High = red fill, Medium = orange fill, Low = yellow fill
- AutoFilter enabled on all columns
- Print area set
- Text wrap enabled
- Pre-populate ≥200 rows
- Schema must remain compatible with the DD Tracker workbook structure

---

#### Mandatory Items (include unless already provided)

| Item | Specification |
|---|---|
| Historical financials | Quarterly, 3 years minimum, split by core segment |
| Forward projections | 5+ years |
| Cash flow / capex / NWC | Full detail including maintenance vs. growth capex split |
| Management & organisation | Org chart, bios, retention, succession |
| Top-10 customers + concentration | Revenue by customer, trend, contract terms |
| Cap table | Fully diluted, option schedule, any preference stack |
| Employee census | Blinded (role, level, comp band, tenure) |

---

#### Industry-Specific Request Additions

| Sector | Key Additional Metrics |
|---|---|
| SaaS / Software | NRR, gross and net churn, CAC, CAC payback, ARR bridge |
| Retail / Consumer | Same-store sales, individual store P&L, traffic vs. ticket split |
| Healthcare | Payor mix, reimbursement rates by payor, prior-auth denial rates |
| Industrial / Manufacturing | Capacity utilisation, maintenance vs. growth capex, backlog aging |
| Distribution / Logistics | Inventory turnover, supplier concentration, freight cost per unit |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Historical period | 3 years | Standard M&A diligence convention; covers a full business cycle for most assets |
| High-priority share of total requests | ≤50% of total request count | Prevents priority inflation; forces genuine triage and preserves the signal value of "High" |
| Output format | .xlsx (Mode C 13-column workbook) | DRL is a working document with dropdowns, filters, and status tracking — prose lists are not usable in process |
| Depth at IOI / pre-LOI stage | ~10–15 requests | Proportionate to deal stage; avoids burdening the target before exclusivity |
| Depth at second-round / full diligence | 25–100 requests | Reflects full workstream coverage expected post-exclusivity |
| Assumptions | Noted in the Notes column, not stated as facts | Prevents fabrication of company-specific data not in hand |
| Anonymisation on sensitive items | Flagged as "blinded acceptable" where direct identification is not required | Reduces seller friction while preserving analytical utility |

---

### Rules & Pitfalls

**Never:**
- **Never output a Word document or plain-text list as the primary DRL deliverable** — the DRL is a live working file used for status tracking, filtering, and counterparty exchange; a prose list cannot serve this function.
- **Never fabricate company-specific information** — if a fact is assumed rather than sourced from provided materials, it must be written into the Notes column explicitly, not stated as verified.
- **Never repeat a request for materials already in hand** — read all files (including hidden spreadsheet tabs) before generating; duplicating requests wastes counterparty goodwill and signals poor preparation.
- **Never silently modify existing requests on an uploaded DRL** — output only net-new requests and a separate "Suggested Revisions" section; the decision to amend the existing DRL belongs to the user.
- **Never auto-close open requests on an uploaded DRL** even when reviewed VDR documents appear to satisfy them — flag the potential closure and require explicit user confirmation.
- **Never include out-of-scope workstreams (tax, legal IP, insurance, HR/employment, regulatory/ESG, financing) without explicit user instruction** — these disciplines have dedicated specialist processes; including them unsolicited conflates business diligence with legal and compliance diligence and signals scope confusion to the counterparty.
- **Never pad the list with low-value requests to inflate length** — every item must have genuine analytical justification; length is not a quality signal.
- **Never surface investment thesis language, deal opinions, or risk conclusions in the request text** — the DRL is sent to the counterparty; exposing the buyer's investment view or concerns in the request language undermines negotiating position.

**Conditional:**
- **If the user has supplied an existing template (Mode B):** mirror its columns, tab names, dropdowns, and formatting exactly; do not introduce additional columns or restructure the schema even if the Mode C schema would be more complete.
- **If a mandatory item is already present in the provided materials:** exclude it from the DRL and document the reason in the post-delivery disclosure note (e.g., "Historical P&L not requested — provided at VDR index 4.2.1").
- **If a request item is partially answered in available materials:** set Status = Partial and describe the gap precisely in the Notes column (e.g., "Top-10 customer names provided; quarterly revenue by customer absent").
- **If a sensitive item (customer identities, compensation data, equity ownership) is required:** include the request and annotate Notes with "blinded / anonymised format acceptable" where direct identification is not analytically necessary.
- **If a workstream explicitly listed in a DD Tracker call falls into an out-of-scope category (tax, legal IP, HR, etc.):** skip it entirely unless the user has separately and explicitly requested its inclusion, in which case include it and label each such request "Note: outside standard business diligence scope."
- **If the user uploads an existing DRL alongside a VDR index:** flag which open requests appear closable based on the VDR documents, but do not close them — list them for user confirmation only.

**Judgment:**
- **Calibrate request specificity to be prescriptive, not generic** — "Top-10 customers by quarterly revenue for the past 3 years, segmented by product line" is acceptable; "top customer detail" is not. Every request must specify quantity, time period, and granularity.
- **Map requests to identified value drivers and risk themes, not to exhaustive checklists** — each identified concentration risk, moat question, or cyclicality concern warrants 1–3 requests; each unexplained material trend (margin inflection, growth acceleration, forecast step-change) warrants at least 1 request. Mechanical checklist generation without material-driven rationale produces noise.
- **Maintain professional, M&A-process-appropriate language throughout** — the DRL will be transmitted directly to the sell-side or target management; informal phrasing, leading questions, or adversarial tone create friction and may prejudice the diligence relationship.
- **Sort output by workstream first, then by priority within each workstream** — this is how deal teams navigate and assign the document; priority-only sorting obscures workstream ownership.
- **Prefer depth on fewer, higher-conviction requests over breadth across many workstreams** — at IOI stage especially, a tight, well-prioritised list signals diligence sophistication more effectively than a long undifferentiated one.

---

### Pre-Delivery Checks

- Confirm output format is .xlsx; reject any plain-text or Word output path before delivery.
- Verify High-priority requests constitute ≤50% of the total request count; redistribute to Medium or Low if over threshold.
- Confirm every request contains a specified quantity, time period, and level of granularity — flag and revise any generic descriptions.
- Cross-check every request against all uploaded materials (including hidden spreadsheet tabs); remove any item already fully satisfied by provided documents.
- Confirm all partially satisfied items carry Status = Partial with a specific gap description in Notes.
- Confirm all sensitive requests (customer names, salary data, equity detail) include an anonymisation / blinding note in Notes where applicable.
- Verify no request text contains investment thesis language, valuation opinions, or risk conclusions visible to the counterparty.
- Confirm all out-of-scope items (tax, legal IP, insurance, HR, regulatory/ESG, financing) are absent unless the user explicitly requested inclusion, in which case each is labelled out-of-scope.
- Verify the post-delivery disclosure note lists every mandatory item excluded and the specific reason for each exclusion.
- For Mode C: confirm conditional formatting is applied (High = red, Medium = orange, Low = yellow), AutoFilter is enabled, print area is set, text wrap is on, and the workbook contains ≥200 pre-populated rows.
- For Mode B: confirm the output schema matches the user-supplied template exactly — no additional columns, no schema changes.
- For Mode A: confirm date columns are left blank and the row structure is compatible with the DD Tracker schema.
- Verify requests are sorted by workstream (primary) and priority (secondary within workstream).

---

### Scope Boundaries

The DD Tracker playbook handles multi-workstream status tracking, ownership assignment, and deadline management across the full diligence process — it calls this playbook to generate the underlying request rows. The VDR Review & Gaps playbook produces a Word memo mapping received documents to outstanding information needs. The Management Questions / Expert Agenda playbook generates interview and expert-call guides directed at individuals rather than document requests. Tax, legal IP, insurance, HR/employment, regulatory environment, ESG, and financing diligence are handled by specialist advisors under separate mandates and are outside this playbook's scope unless explicitly directed by the user.

---

## DD Tracker

**Use when**: Building an M&A or PE due diligence tracking workbook from scratch | **Deliverable**: Excel workbook with 4 tabs — Summary Dashboard, DRL, Working Group Roster, Gantt Deal Calendar

### Ask First
1. What is the deal name / code name?
2. Use the 13 default workstreams, or add / remove custom ones?
3. Single consolidated DRL tab, or split high-volume workstreams into dedicated tabs?
4. Are there existing requests to import, or should the DRL be generated from scratch via DD Question Creator?
5. Who are the confirmed deal team members and advisors (buy-side only) to populate the Working Group Roster?
6. What are the known key milestone dates (IOI, LOI, IC, signing, close)?
7. What is the timeline start date and total duration? *(Default: the most recent past Monday, 12 weeks.)*
8. Will this file be shared externally with sell-side bankers or other outside parties?

### Workflow

1. **Confirm all 8 intake answers before building any tab.** Use placeholders for any unanswered items — do not infer or fabricate. *(Front-loading prevents rework caused by workstream naming inconsistencies across tabs.)*

2. **Build Tab 2 — DRL first.** Lay out all 13 columns, assign actual column letters, pre-populate ≥200 rows with formatting, dropdowns, and row-level formulas. *(The Summary Dashboard is entirely dependent on DRL column letters; building DRL first eliminates the #1 source of COUNTIF errors.)*

3. **Record the real column letters for each DRL field before writing a single Summary formula.** Do not assume workstream = column B or status = column F. Read back the actual layout after construction. *(Hardcoding wrong column letters is the most common cause of the dashboard showing all zeros.)*

4. **Populate DRL rows.** If the user supplies requests, map them to the 13-column schema. If no requests exist, invoke DD Question Creator — pass the exact workstream name, available materials, desired depth, and focus areas; instruct it to skip its own intake. Map the returned questions into the DRL using the confirmed column letters, then apply dropdowns, conditional formatting, and row-level formulas.

5. **Ensure every workstream has ≥1 DRL row.** For workstreams where DD Question Creator does not generate output (Tax, Legal/IP, Insurance, HR, Regulatory/Environmental/ESG, Financing), insert one placeholder row: Status = `Closed`, Description = `[Placeholder]`. This guarantees the Summary COUNTIF has at least one row to count per workstream.

6. **If any workstream is split into its own dedicated tab, exclude it from the main DRL entirely — no duplicate rows.** The Summary must aggregate across the main DRL tab and all split tabs simultaneously.

7. **Build Tab 1 — Summary Dashboard.** One row per workstream. COUNTIF/SUMIF formulas reference the verified DRL column letters. Totals row uses weighted completion (total completed ÷ total requests), not a row-average of percentages. Apply IFERROR to all percentage formulas to prevent divide-by-zero errors. Add conditional formatting on Status and % Complete columns. Link the Key Upcoming Dates table to Tab 4 calendar.

8. **Build Tab 3 — Working Group Roster.** Populate only with names, firms, and contact details the user has explicitly provided. Fill all other cells with `[To Be Updated]`. *(See Never rules below — this tab is a common source of serious errors.)*

9. **Build Tab 4 — Gantt Deal Calendar.** Set start date to the confirmed timeline anchor (default: most recent past Monday). Apply weekly columns for timelines ≤12 weeks; switch to bi-weekly columns for longer timelines. Freeze the workstream name column at column B. Apply professional color scheme per milestone type. Explicitly test that single-day milestones (Start = End) highlight exactly one cell. For any date the user has not provided, leave the milestone row blank or mark `[TBD]`.

10. **Run all Pre-Delivery Checks** before handing off.

#### Tab Specifications

**Tab 1 — Summary Dashboard**

| Column | Content |
|---|---|
| Workstream | Matches DRL/Roster/Calendar exactly (case, spacing, spelling) |
| Total Requests | `COUNTIF(DRL[Workstream], name)` |
| Complete | `COUNTIFS(…, Status, "Closed")` |
| Partial | `COUNTIFS(…, Status, "Partial")` |
| Open | `COUNTIFS(…, Status, "Open")` |
| % Complete | `IFERROR(Complete/Total, 0)` — conditional format |
| High-Priority Open | `COUNTIFS(…, Priority, "High", Status, "<>Closed")` |
| Completed Items | Mirror of Complete column |
| **Totals row** | Weighted %: `SUM(Complete column) / SUM(Total column)` |

- Key Upcoming Dates table linked to Tab 4 calendar
- **If file is going external: remove the Key Upcoming Dates table entirely** (deal timeline is confidential)

**Tab 2 — DRL (13 columns)**

| # | Field | Notes |
|---|---|---|
| 1 | Request No. | Formula-generated |
| 2 | Workstream | Must match Summary/Roster/Calendar exactly |
| 3 | Description | Free text; wrap if >60 chars |
| 4 | Priority | Dropdown: High / Medium / Low; conditional format Red / Orange / Yellow |
| 5 | Status | Dropdown: Open / Partial / Closed |
| 6 | Third Party | Advisor or counterparty |
| 7 | Date Requested | Manual entry |
| 8 | Last Response | Manual entry |
| 9 | Buy-Side Comments | Free text |
| 10 | Sell-Side Comments | Free text |
| 11 | VDR Reference | Folder/document path |
| 12 | Days Outstanding | Formula: `=IFERROR(IF(Status="Closed","",TODAY()-DateRequested),"")` |
| 13 | Notes | Free text |

- AutoFilter on header row
- Pre-populated ≥200 rows with formulas and formatting; users can add rows without manually extending formulas
- Print area set; text wrap enabled

**Tab 3 — Working Group Roster (12 columns)**

| # | Field |
|---|---|
| 1 | Category (must match a workstream name OR "Deal Team") |
| 2 | Firm |
| 3 | Name |
| 4 | Title |
| 5 | Email |
| 6 | Phone |
| 7 | Primary Contact (Y/N) |
| 8 | EA / Assistant Name |
| 9 | EA Email |
| 10 | EA Phone |
| 11 | Role on Deal |
| 12 | Notes |

**Tab 4 — Gantt Deal Calendar**

| Milestone Type | Color |
|---|---|
| In Progress | Steel Blue |
| IOI / LOI | Slate Grey |
| IC Presentation | Gold |
| Signing | Teal |
| Close | Dark Green |

- Column width: 1 week per column (≤12-week timeline); 2 weeks per column (>12 weeks)
- Workstream name column frozen at column B
- Formula-driven fill: `=IF(AND(weekStart>=milestoneStart, weekStart<=milestoneEnd), 1, 0)` drives conditional format
- Single-day milestones: Start = End; verify exactly one cell is highlighted after build

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Timeline start | Most recent past Monday | Aligns workbook to the current work week |
| Timeline duration | 12 weeks | Standard M&A / PE diligence window |
| Column width per Gantt period | 1 week (≤12 wks) / 2 weeks (>12 wks) | Keeps calendar readable at standard zoom |
| DRL pre-populated rows | ≥200 | Users can add data without extending formulas manually |
| Workstreams | 13 defaults: Business, Commercial/Markets, Financial DD, Tax, Legal/IP, Technology/IT, Operations, Product/Engineering, HR, Regulatory/Environmental/ESG, Insurance, Management/Key Personnel, Financing | Covers standard M&A diligence scope |
| Placeholder text | `[To Be Updated]` / `[TBD]` / `[Placeholder]` | Makes gaps visible and prevents fabrication |
| Formulas | Native Excel (COUNTIF, SUMIF, IFERROR) — never hardcoded Python values | Ensures the workbook recalculates when users edit data |
| % Complete formula | `IFERROR(complete/total, 0)` | Prevents divide-by-zero errors on empty workstreams |

### Rules & Pitfalls

**Never:**
- **Never write Summary Dashboard formulas before verifying the real DRL column letters** — hardcoding an incorrect column letter (e.g., assuming Workstream = B or Status = F when the layout differs) is the single most common cause of every COUNTIF returning zero, which destroys dashboard credibility instantly.
- **Never populate the Working Group Roster with names, firms, or contact details sourced from the CIM, management presentation, or any sell-side document** — those are the seller's people, not your deal team. Inserting them conflates counterparty personnel with your own advisory team, a visible and professionally embarrassing error.
- **Never fabricate dates, names, or contact information** — use `[TBD]` or `[To Be Updated]` for all unknowns. Invented milestone dates will be treated as commitments by downstream users.
- **Never use a row-average of workstream-level percentages for the Summary totals row** — it is statistically incorrect; use weighted completion (`SUM(complete column) / SUM(total requests column)`).
- **Never use hardcoded static values in formula cells** — all counts, percentages, and dates must recalculate dynamically so the workbook remains live as data changes.
- **Never include the Key Upcoming Dates / deal timeline table in any version of the file distributed to sell-side bankers or other external parties** — deal timelines are confidential.

**Conditional:**
- If a workstream is split into its own dedicated tab, remove all its rows from the main DRL tab (no duplication), and update every Summary formula to aggregate across both the main DRL tab and all split tabs.
- If DD Question Creator does not generate questions for a given workstream (Tax, Legal/IP, Insurance, HR, Regulatory/Environmental/ESG, Financing), insert one placeholder row (Status: `Closed`, Description: `[Placeholder]`) to ensure the Summary COUNTIF has at least one row and does not return a false zero.
- If the file is to be shared externally with sell-side advisors or bankers, remove the Key Upcoming Dates table from Tab 1 before distribution.
- If a user-supplied workstream name differs in case, spacing, or spelling from the name used in any other tab, halt and reconcile before proceeding — silent COUNTIF/VLOOKUP failures will make the dashboard appear broken.
- If the timeline exceeds 12 weeks, switch Gantt column granularity from weekly to bi-weekly to maintain readability.

**Judgment:**
- Confirm workstream naming convention (exact string) once at the DRL build stage, then copy-paste — never retype — into Summary, Roster, and Calendar tabs to guarantee character-level consistency.
- When invoking DD Question Creator, pass the exact workstream name string (matching the DRL), the available source materials, desired question depth, and focus areas; instruct it to skip its own intake to avoid redundant scope questions.
- Pre-populating ≥200 DRL rows with formulas and formatting is preferable to building only the rows needed today — diligence request lists always grow, and users should never need to manually extend formula ranges.
- Flag to the user at delivery any tab where all values remain placeholder — it signals a data gap, not a formula error.

### Pre-Delivery Checks

- Confirm Summary total request count equals `COUNTIF` of all DRL rows across main and any split tabs — numbers must foot exactly.
- Confirm Complete + Partial + Open = Total for every workstream row and the totals row.
- Confirm % Complete = `IFERROR(Complete / Total, 0)` — no row should show a raw division or a `#DIV/0!` error.
- Confirm zero formula errors (`#REF!`, `#VALUE!`, `#DIV/0!`, `#NAME?`) across all tabs.
- Confirm workstream names are character-for-character identical across Tab 1, Tab 2, Tab 3, and Tab 4 (case, spacing, spelling).
- Confirm every workstream has ≥1 row in the DRL (including placeholder rows for workstreams with no live requests).
- Confirm every workstream has ≥1 row in the Working Group Roster (placeholder acceptable).
- Re-read the actual DRL column letters and verify each Summary COUNTIF/SUMIF references the correct column — if any workstream shows 0 in the dashboard but has rows in the DRL, this is the cause.
- Confirm the Working Group Roster contains zero names, firms, or contact details sourced from the CIM or any sell-side document.
- Confirm single-day Gantt milestones (Start = End) highlight exactly one cell — test at least two milestone rows explicitly.
- Confirm the number of highlighted Gantt cells per milestone equals the correct date span in weeks.
- Confirm AutoFilter is active on the DRL header row.
- Confirm print area is set and text wrap is enabled on all columns wider than 60 characters.
- Confirm conditional formatting is applied to Priority (Red/Orange/Yellow) and % Complete columns.
- Confirm the Gantt workstream name column is frozen at column B.
- If file is flagged for external distribution, confirm the Key Upcoming Dates table has been removed from Tab 1.

### Scope Boundaries

The **DD Question Creator** playbook handles generation of the actual diligence questions populated into the DRL — invoke it during Step 4 when no requests are supplied, passing the exact workstream name and available materials.
The **VDR Review & Gaps** playbook handles mapping received documents against outstanding requests and producing a gap memo (Word) — run it after the DRL is live and VDR access is granted.
Working Group Roster population, deal economics, and valuation work are out of scope for this playbook.

---

## VDR Gap Analysis

**Use when**: A buy-side investment team has received a data room and needs to map its contents to standard diligence questions, assess coverage, and identify gaps | **Deliverable**: Q&A memo rendered in full in chat + saved as .docx Word file

---

### Ask First
1. What is the target company name? (Resolve all `[COMPANY_NAME]` placeholders — never print brackets.)
2. Which files and documents are present in the data room? Upload all available materials.
3. Has the team prepared a VDR request list? If yes, provide it — dual-mapping will be applied.
4. Are there specific diligence sections (of the seven standard segments) that require deeper focus or that the team has already covered independently?

---

### Workflow

1. **Inventory the data room** — log every file by type and skim what diligence questions each document addresses. This orientation step determines what is actually present before any claims of coverage are made. (Do not skip: coverage statements made without this step will be fabricated.)

2. **Build the 7-segment Q&A table** — structure a two-column table across all seven segments in dependency order:
   - ① Company Overview & Management
   - ② Products, Services & Operations
   - ③ Sales, Marketing & Customers
   - ④ Market & Competitive Landscape
   - ⑤ Financial Performance
   - ⑥ Growth Strategy & M&A
   - ⑦ Legal, Regulatory & Risk

   Column headers: **Key Diligence Question** | **Relevant Data Room Files**

   Right-column format per entry: **File name → page / slide / section → one-line description of what it addresses**. For Excel files: cite tab and cell range.

   Number questions consecutively across all seven segments (Q1, Q2, Q3… never reset per segment) so question numbers tie directly to the completeness checklist and gap list.

3. **If the user provided a VDR request list**: add a third column mapping each question simultaneously to (a) the user's request list items and (b) the standard seven-segment map (dual-mapping).

4. **Build the Completeness Checklist** — four columns: **Section / Key Question / Status / Coverage Notes**
   - Status symbols: ✓ Complete / Δ Partial / ✗ Not Addressed
   - For every Δ entry: state both what was provided and what is still missing
   - Display section name only in the first row of each section group (do not repeat per row)

5. **Write the Summary Assessment** — one sentence containing: (a) qualitative rating (Strong / Adequate / Weak) and (b) quantitative count in the form "[X] of [Y] questions fully addressed, [Z] partial." Follow with gap bullets referencing specific Q-numbers. The rating, counts, and gap list must be internally consistent with the checklist.

6. **Draft Follow-Up Requests** — one action item per specific gap, written as direct imperatives ("Request…", "Provide…", "Clarify…"). If only minor gaps remain, append one standing request for the most recent LTM operating KPIs.

7. **Deliver** — render the full memo in chat and save as .docx. Both outputs are required on every delivery without exception.

#### Financial Performance Segment — Additional Build Notes

- Treat this segment as a comprehensive index of every financial file in the room.
- Distinguish explicitly between underlying source data present in the room (audit files, working financial model) versus financial information that has been summarized or excerpted in a CIM or management presentation only.
- Multiple EBITDA versions are expected (seller-reported, seller-side Quality of Earnings). Index every version to its source document; do not collapse them.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Delivery format | Chat full render + .docx on every output | Ensures the team has both a reviewable and a distributable version |
| Question numbering | Continuous across all 7 segments, never reset | Enables direct cross-reference between Q&A table, checklist, and gap list |
| Right-column citation depth | File name + page/slide/section + one-line description; Excel → tab + cell range | Citations must be independently verifiable by any team member |
| Status vocabulary | ✓ Complete / Δ Partial / ✗ Not Addressed only | Standardised symbols lock the checklist to the summary counts |
| Summary assessment format | One sentence: qualitative rating + "[X]/[Y] full, [Z] partial" + gap bullets with Q-numbers | Forces internal consistency check before delivery |
| Follow-up request style | Direct imperatives ("Request…", "Provide…", "Clarify…"), one per gap | Requests must be actionable enough to paste directly into a seller communication |
| Placeholder resolution | `[COMPANY_NAME]` and equivalent placeholders resolved to true name; never printed as brackets | Professionalism and document usability |

---

### Rules & Pitfalls

**Never:**
- **Never fabricate a file name, page number, slide number, section reference, tab name, or cell range** — the entire value of this memo rests on citations being independently verifiable; a single invented reference destroys the tool's credibility with the investment team and with reviewers.
- **Never write "see the CIM" or any similarly vague pointer** — every citation must resolve to a specific page, slide, or section; "see the CIM" is not an acceptable location and signals the citation was not checked.
- **Never repeat or paraphrase seller marketing language as fact** — this is a buy-side navigation document; seller claims are inputs to be interrogated, not conclusions to be restated.
- **Never assess investment merit in the Q&A table or completeness checklist** — qualitative investment judgment belongs only in the summary assessment paragraph, not embedded in coverage notes.
- **Never apply a Strong rating or inflate ✓ counts to make a data room appear more complete than it is** — a memo that looks clean but masks weak coverage is a failed deliverable; Partial and Not Addressed statuses are the primary output of value.

**Conditional:**
- **If the user provides a VDR request list**: apply dual-mapping — add a third column that maps each question to both the user's request list items and the standard seven-segment framework simultaneously.
- **If a document is cited across multiple questions**: list it in full under each relevant question; one file legitimately appears under several segments and should not be artificially consolidated.
- **If a segment has thin coverage**: do not invent questions to pad it — flag the weakness explicitly and note that the DD Question Creator playbook should be used to generate additional targeted questions for that segment.
- **If a gap exists in the Financial Performance segment**: distinguish whether the gap is (a) a content gap (data never provided), (b) a time gap (e.g., only one year provided where three years are needed), or (c) a basis gap (M&A-inclusive figures cited elsewhere but no organic/standalone numbers present) — all three gap types must be labelled distinctly.
- **If M&A activity is referenced anywhere in the data room**: check whether organic/standalone figures exist for revenue, EBITDA margin, and customer metrics. Absence of organic/standalone data when an acquisition is referenced is a basis gap and must be flagged ✗ or Δ — buy-side underwriting requires organic performance.

**Judgment:**
- **Treat Partial and Not Addressed items as the primary deliverable** — a data room with strong coverage is easy to navigate; the memo earns its value by surfacing what is missing before the team commits diligence resources.
- **Evaluate financial files for substance, not presence** — a file being present does not mean the underlying data is available; a CIM that summarises financials is not a substitute for audit financials or a working model. Flag the distinction explicitly in the Financial Performance segment.
- **Gap dimensions are multi-axis** — assess gaps across content (topic not addressed), time (insufficient historical or forward period), and basis (organic vs. acquired, or different consolidation scope); a data room can pass a content check and still carry significant time and basis gaps.

---

### Pre-Delivery Checks

- Confirm question numbers run consecutively from Q1 through the final question across all seven segments with no resets and no duplicate numbers.
- Confirm every right-column bullet contains a real file name, a specific location (page / slide / section; tab + cell for Excel), and a one-line description — flag and remove any entry that cannot satisfy all three elements.
- Confirm no file name, page, slide, section, tab, or cell range was inferred or generated rather than directly observed in the uploaded data room materials.
- Confirm the Summary Assessment qualitative rating (Strong / Adequate / Weak) is consistent with the distribution of ✓ / Δ / ✗ statuses in the checklist.
- Confirm the quantitative count ("[X]/[Y] full, [Z] partial") in the Summary Assessment exactly matches the ✓ and Δ counts in the checklist — foot the numbers.
- Confirm every gap bullet in the Summary Assessment references a specific Q-number that exists in the Q&A table.
- Confirm the Financial Performance segment indexes all EBITDA versions present in the room as separate line items.
- Confirm the Financial Performance segment distinguishes source data files (audit, model) from summary presentations.
- Confirm each Follow-Up Request targets exactly one specific gap and is written as a direct imperative ready to send to the seller.
- Confirm both chat full-text render and .docx file are produced before closing the deliverable.

---

### Scope Boundaries

The **DD Question Creator** playbook generates a fresh diligence question list when a data room has not yet been received or when a specific segment requires additional questions beyond what the room prompted — use it to supplement thin segments identified here. The **DD Tracker** playbook manages a multi-tab Excel tracker for ongoing diligence status across the full process. The **Management Questions** playbook produces structured question sets for management meetings — requests surfaced in the Follow-Up Requests section of this memo that require management clarification should be escalated there.

---

## Buy-Side QoE Review

**Use when**: A sell-side QoE report is available and the buyer needs an independent underwrite of true go-forward EBITDA | **Deliverable**: Excel workbook (Buyside tab + Source tabs) with optional PowerPoint stoplight deck

---

### Ask First
1. **Output scope** — Excel only, or Excel + PPT stoplight?
2. **Participation mode** — (a) full build: populate accept/reject/partial decisions directly; (b) guided review: walk through each item and provide recommendations for user to decide; or (c) blank framework only: build the shell without populating decisions?
3. **Conservatism stance** — 1 through 5 (1 = most conservative, 5 = most aggressive)?
4. **Buyer adjustments** — Has the buyer identified any under-burdened cost items or buyer-specific synergies to include in the Buyer Adjustments section at the bottom?

---

### Workflow

1. **Ingest source material** — If an Excel file is provided, fully verify calculations, flag inconsistencies, and identify missing adjustments. If PDF only, extract line items from each section of the sell-side QoE, and flag any cross-section conflicts or contradictions. *(PDF requires manual extraction before any build step; resolve conflicts before populating decisions.)*

2. **Map sell-side adjustments** — List every sell-side addback and pro-forma adjustment exactly as presented in the report. Do not alter lookback periods; use the report's stated LTM and/or fiscal year periods as-is.

3. **Apply conservatism stance item by item** — Evaluate each adjustment against the governing question: *Does this item normalize the business to its true go-forward earnings?* Apply the stance consistently across all items (see Rules & Pitfalls). Flag any unfamiliar adjustment types to the user before deciding.

4. **Identify missed adjustments** — Flag items the sell-side could have adjusted but did not, in either direction. *(Sell-side reports can under-adjust as well as over-adjust; surface both.)*

5. **Build the Excel workbook** *(dependency: steps 2–4 must be complete before building)*
   - Place the **Buyside tab first**, formatted in a distinct color scheme
   - Place all source data tabs **after a "Source >>" divider tab**
   - Link every Buyside value to the source tab via formula — hard-code **no pre-existing values**
   - For each adjustment, apply IF logic: Accept → link to sell-side value; Reject → 0; Partial → custom placeholder
   - Maintain a **single hard-coded selection source**: Accept / Reject / Partial decisions live in exactly one tab; all other references pull from it
   - Add a **Buyer View dropdown** per line with conditional formatting: green = Accept, yellow = Partial, red = Reject
   - Add a **Buyer Commentary column** for each item
   - Any period where a decision is neither full Accept nor full Reject must be marked Partial
   - Add a **Buyer Adjustments section** at the bottom (separate from the QoE bridge) for buyer-identified synergies or under-burdened costs — never commingle with the sell-side adjustment items
   - Format for print: one page wide, repeat headers on each printed page

6. **Build PPT stoplight** *(if requested; dependency: Excel must be final)*

   #### PPT Stoplight Layout

   **Slide 1 — Executive Summary**
   - Sell-side → buyer-side adjusted EBITDA bridge
   - Key drivers of the difference
   - Critical diligence questions requiring follow-up
   - Summary count and dollar value of Accepted / Partial / Rejected items

   **Slide 2+ — Stoplight Page(s)**
   - *Left two-thirds*: table running from reported EBITDA to fully adjusted EBITDA; columns: sell-side periods (2–4 columns) + buyer-side periods (2–4 columns) + optional variance column; each row has a numbered color block on the left (green / yellow / red)
   - *Right one-third*: numbered commentary keyed to the color blocks — each entry: bolded and underlined adjustment name, description, buyer view, and rationale in sufficient detail that a reader without the Excel can form a judgment
   - Include a color legend
   - Slide title must **not** reference the conservatism stance (do not write "conservative" or "aggressive" in any title)
   - If content does not fit on one slide, paginate as (1/N), (2/N), etc.
   - All figures must tie exactly to the Excel

7. **Run pre-delivery checks** *(see section below)*

---

### Defaults *(apply silently, disclose at delivery)*

| Parameter | Default | Rationale |
|---|---|---|
| Conservatism stance | 3 (balanced) if user does not specify | Neutral underwriting baseline; disclose stance used at delivery |
| Lookback period | Use report's stated LTM / FY periods unchanged | Changing lookback introduces comparability risk and scope creep |
| Participation mode | Guided review (mode b) if user does not specify | Preserves user judgment on final decisions |
| Hardcode source for Accept / Reject / Partial | Single tab only | Prevents conflicting decision states across the model |
| Sell-side view | Replicated exactly as reported | Buyer view is meaningless unless sell-side baseline is verified |
| Revenue pro-forma without corresponding cost | Partially reverse; record at segment gross margin rate | Unless item is already being rejected outright |
| SBC threshold for accept consideration | < 3–5% of revenue | Above threshold, treat as recurring; reject addback |
| Owner / related-party compensation | Adjust to market rate; do not zero out | Under-burdened compensation is a normalization item, not a pure addback |
| M&A transaction fees — serial acquirer | Conservative default: treat as recurring | Single-event acquirers may accept; serial acquirers cannot |
| Sponsor management fee | Accept addback unless fee continues post-close | Fee elimination is a genuine one-time structural change |
| Capitalized software development costs | Do not accept addback; treat as recurring | Reclassifying recurring opex to capex does not eliminate the economic cost |

---

### Rules & Pitfalls

**Never:**
- **Never accept the sell-side's adjusted EBITDA at face value** — adjusted EBITDA is the pricing anchor (EV = multiple × adj. EBITDA), giving sellers a systematic incentive to inflate it; the entire purpose of a buyer-side QoE is to independently underwrite whether each addback is legitimate
- **Never hard-code a pre-existing value in the Buyside tab** — breaking the formula chain makes the model unauditable and creates silent errors when source data changes
- **Never place Accept / Reject / Partial decisions in more than one tab** — multiple decision sources create conflicting states and undermine model integrity
- **Never include buyer synergies inside the QoE adjustment bridge** — buyer synergies belong in a separate Buyer Adjustments section; including them in the QoE bridge overstates normalized standalone EBITDA and conflates two economically distinct concepts
- **Never accept a "one-time" item that appears in two or more periods** — recurrence in multiple periods is definitional evidence of an operating cost; the sell-side labeling it "one-time" is the single most common EBITDA inflation technique
- **Never add back revenue pro-forma without the corresponding COGS / expenses required to deliver it** — doing so overstates margins and distorts the go-forward EBITDA; at minimum, apply a partial reversal at the relevant segment gross margin rate
- **Never accept capitalized software development costs as an addback** — capitalizing recurring development expense shifts an operating cost to the balance sheet without eliminating it economically; treat as recurring and reject

**Conditional:**
- **If an earnout is structured as retention compensation rather than true contingent consideration**, reject the addback — it is a recurring labor cost dressed as a deal cost
- **If a legal, consulting, or restructuring cost is industry-endemic** (e.g., regulatory legal fees in healthcare or insurance), treat as recurring and reject; accept only if the item is demonstrably isolated and non-recurring relative to that industry's norms
- **If a pro-forma revenue item lacks a signed contract or committed ramp**, reject under stance 1–2; at stance 4–5, partial acceptance requires documented support
- **If a price increase pro-forma is presented**, at minimum apply a partial reversal — price increases carry volume risk and cannot be accepted at face value without demand elasticity support
- **If the sell-side Excel is provided**, verify all arithmetic before populating decisions; flag calculation errors and cross-adjustment contradictions before proceeding
- **If stance is 1–2 (conservative)**, accept only items that are: (a) documented one-time events, or (b) signed / already-implemented pro-formas; reject speculative, unsigned, synergy-dependent, or recurring-in-disguise items
- **If stance is 4–5 (aggressive)**, accept items a reasonable person could view as valid run-rate adjustments with supporting evidence; apply partial for items with 3+ periods of recurrence rather than outright rejection
- **If any adjustment type is unfamiliar or ambiguous**, flag it to the user before assigning a decision — do not default to accept or reject without disclosure
- **If the buyer view or stance is changed post-build**, verify that all subtotals and the adjusted EBITDA total update dynamically through the formula chain; no subtotal should require manual override

**Judgment:**
- **Owner / related-party compensation at well-below-market rates signals under-burdening** — a CEO compensated at $200K is a classic example; the correct treatment is to adjust upward to market rate, not to accept the addback as presented, because the go-forward business will bear the market rate
- **High-growth software companies with large SBC are structurally different from mature businesses** — in high-growth software, SBC is a core recurring compensation mechanism, not a non-cash anomaly; do not accept the addback even if the dollar amount appears modest relative to size
- **Treat method transparency as non-negotiable for all pro-forma and run-rate items** — regardless of whether you accept or reject, document the methodology and flag it in the Buyer Commentary column so diligence can verify
- **Look for missed adjustments actively, not passively** — the sell-side may have left legitimate buyer-favorable normalizations on the table; surfacing these builds credibility with the IC and produces a more accurate go-forward EBITDA
- **Prefer substance over label when categorizing items** — an item labeled "restructuring" that recurs annually is an operating cost; an item labeled "operating" that is genuinely isolated may qualify for acceptance; apply the governing test (*does this normalize to true go-forward earnings?*) rather than relying on the sell-side's category heading

---

### Pre-Delivery Checks
- Confirm the sell-side view in the model **ties exactly** to every figure in the sell-side QoE report — no rounding, no reclassification
- Confirm reported EBITDA + sum of all adjustments = sell-side adjusted EBITDA (the bridge must foot and tie out)
- Scan all adjustment items for **double-counting** (two items capturing the same economic event) and **contradictory logic** (an item accepted in one period and rejected in another without explanation)
- Confirm every figure in the PPT stoplight ties exactly to the corresponding cell in the Excel workbook, especially the final buyer-side adjusted EBITDA
- Confirm that changing the Buyer View dropdown on any line item causes the buyer subtotal and adjusted EBITDA total to update automatically — no static values downstream
- Confirm there is **exactly one hard-coded selection source** for Accept / Reject / Partial across the entire workbook
- Confirm all Buyside tab cells link to the source tab and no pre-existing numerical values are hard-coded
- Confirm row alignment between source tab and Buyside tab — verify cell references are not offset by inserted or deleted rows
- Confirm any adjustment appearing in **2 or more periods without a full-Accept rationale** is marked Partial or Reject
- Confirm the Buyer Adjustments section is physically separated from the QoE bridge and contains no sell-side adjustment items

---

### Scope Boundaries
Building a sell-side QoE from scratch (i.e., constructing the initial adjustment schedule from raw financials rather than reviewing an existing report) is a separate workflow not covered here. Consuming QoE output to populate a single Base Earnings line in a broader screening checklist is handled by the Business Quality Checklist playbook. This playbook covers only the independent buyer-side review and challenge of an existing sell-side QoE report.

---

## Revenue Data Cleanup & Audit

**Use when**: MRR/customer-level time-series data requires quality audit before analysis | **Deliverable**: Highlighted Excel workbook with Cleaned Data tab + audit log + dollar-impact bridge memo

### Ask First
1. What is the sheet name, data range, and header row structure (date columns, customer label columns)?
2. What is the start date of the time series (required if no column headers are present)?
3. Should the default 6-month lookback window for gap vs. churn classification be kept, or adjusted?
4. Is the spike/fade sensitivity appropriate for this business (e.g., highly seasonal or volatile revenue may warrant higher thresholds to reduce false positives)?

### Workflow

**Phase 1 — Data Mapping & Summary**

1. Confirm sheet scope, data range, date column headers, and customer label columns before touching any data (mapping errors compound everything downstream).
2. Run fuzzy deduplication on customer names (≥80% confidence required); classify each match as either *delete duplicate* or *sum rows into parent* — do not default to deletion without determining whether the second row is a subsidiary.
3. Strip pseudo-header rows (rows with no monthly numeric data).
4. Produce the **Anomaly Summary Table + Bridge** and deliver it to the user *before* making any workbook changes. The bridge must show dollar impact by anomaly category from raw to cleaned state.

**Phase 2 — Technical Detection (5 Rules, Color-Coded)**

5. Run all five detection rules simultaneously across the cleaned row set, applying MIN\_THRESH first to suppress immaterial flags:

| Rule | Highlight Color | Trigger | Default Action |
|---|---|---|---|
| Rule 1 — Gap | Yellow | Revenue on both sides of a zero/blank span | Auto-backfill with prior month value **only after user approval** |
| Rule 2 — Spike-Revert / Double-Count | Orange | Month-over-month jump followed by revert, or value ≈ 2× neighbor average | Flag only |
| Rule 3 — Sustained Abnormal Spike | Light Green | >3× prior level and does not revert | Flag only; treat as possible expansion event pending manual review |
| Rule 4 — Onboarding Fade | Lavender | Mean of first 6 months >2× mean of subsequent 6 months | Flag only; raise the standing due-diligence question: *"Is all revenue in this file genuinely recurring?"* |
| Rule 5 — Text / Symbol in Numeric Field | Red | Cells containing `"-"`, text-formatted numbers, or text-formatted dates (invisible to EOMONTH) | Flag with exact fix instruction |

6. Attach to every flag: specific cell reference, customer name, anomaly value, and surrounding context (prior month, following month).
7. Translate every flag into a dollar impact statement (e.g., *"This double-count overstates January MRR by $45k"*).

**Phase 3 — Threshold Review & Output Assembly**

8. Apply or adjust sensitivity thresholds (see Defaults); for large files (15+ months or thousands of rows), sort findings by dollar materiality before presenting.
9. Assemble final deliverables:
   - **Validation Summary**: total MRR/ARR overstatement and understatement in dollars
   - **Findings Table**: one row per flag with cell ref, rule, raw value, cleaned value (or "flag — no change"), dollar impact
   - **Cleaned Data tab**: Original sheet untouched; Cleaned Data tab contains side-by-side "Original Value" and "Cleaned Value" columns for every modified cell; flagged-but-unchanged cells are also marked for user review
   - **Highlighted Workbook**: color coding per the five-rule scheme above
   - **Threshold Recommendation Note**: document which thresholds were used and suggest alternatives if rerun is warranted
10. Hand off the completed Cleaned Data workbook explicitly to the Customer Cube Analytics workflow for retention/cohort/top-customer analysis — do not re-run detection inside the analytics workflow.

#### Audit Log Self-Consistency Check
The audit log must satisfy: **churned customer rows + active customer rows = total observed rows**. No hardcoded counts. Every figure in the bridge must be fully traceable to a source cell.

#### Delta Report (Threshold Reruns)
If thresholds are changed and the detection is rerun, produce a **delta report** showing which flags were added and which were removed versus the prior run — do not simply overwrite the prior findings table.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| MIN\_THRESH | <1st percentile of customer MRR ignored | Suppresses immaterial noise (a 2× spike on $5 MRR is irrelevant); omitting this filter is an explicit error |
| SPIKE\_UP | 1.5× prior month | Lower bound for flagging a suspicious month-over-month increase |
| REVERT\_TOL | 40% | Maximum revert tolerance before a spike is classified as Spike-Revert / double-count |
| FADE\_RATIO | 2.0× | First-6-month mean vs. subsequent-6-month mean threshold for Onboarding Fade |
| LOOKBACK | 6 months | Window for distinguishing a gap or win-back from a permanent churn event |
| Fuzzy dedup confidence | ≥80% | Minimum match confidence before merging or collapsing customer name variants |
| Tone / reporting register | Second-year analyst briefing a VP | Concise, precise, no hedging language |

---

### Rules & Pitfalls

**Never:**
- Never overwrite, delete, or modify the original source sheet — all changes live exclusively in the Cleaned Data tab, because irreversible raw-data edits destroy auditability and are unrecoverable in due diligence review.
- Never present modifications before delivering the Anomaly Summary and Bridge — users must approve the scope of changes before any cell is altered, because silent edits to revenue figures are a critical trust failure.
- Never auto-correct anything other than a Rule 1 Gap without explicit user approval — all other anomaly types (spikes, fades, negatives) are flag-only until confirmed, because what looks like an error may be a legitimate business event.
- Never zero out negative revenue or refund entries silently — list them as pending user-confirmed actions, because negative MRR can represent valid credit memos or contract adjustments that the user may want to preserve.
- Never flag immaterial anomalies below MIN\_THRESH — reporting a 2× spike on a $5 MRR customer wastes reviewer time and buries material findings.
- Never hardcode row counts or dollar totals in the audit log — every figure must be formula-driven and traceable, because a self-inconsistent bridge will immediately fail a finance review.

**Conditional:**
- If a customer's revenue drops to zero and *stays at zero*, classify as **Churn (legitimate business event)** — do not flag as a Gap; the Gap rule applies only when revenue resumes on the other side of the zero span.
- If a month-over-month spike exceeds 3× and does *not* revert, classify as **potential expansion event (Rule 3, light green)** — do not classify as a billing error; route for manual business verification.
- If the first 6 months of a customer's revenue are materially higher than subsequent months (FADE\_RATIO ≥ 2.0×), flag as **Onboarding Fade** and raise the standing question: *"Is all revenue in this file genuinely recurring?"* — because implementation or setup fees misclassified as MRR will overstate ARR and mislead valuation.
- If the file has no column headers, ask the user for the series start date before proceeding — EOMONTH-based date detection will fail silently on text-formatted date fields.
- If the business is highly seasonal or exhibits known revenue volatility, raise SPIKE\_UP and FADE\_RATIO thresholds before running detection to reduce false-positive flags.
- If a Rule 1 Gap backfill is approved, record both the original value and the filled value in side-by-side columns in the Cleaned Data tab; never overwrite in place.
- If two customer name variants are matched at ≥80% fuzzy confidence, determine whether to *delete the duplicate* or *sum the rows* based on whether the second record represents the same entity or a distinct subsidiary being rolled up to a parent.

**Judgment:**
- Treat the Gap / Churn boundary, Spike-Revert / Expansion boundary, and Onboarding Fade as classification decisions requiring analyst judgment — the five rules are triggers for investigation, not automatic corrections.
- Sort findings by dollar materiality on large files (15+ months, thousands of rows) — leading with the highest-impact issues ensures the findings table is actionable rather than exhaustive.
- When Onboarding Fade is flagged, use it as an entry point for the broader due-diligence question about revenue quality — this is the moment to surface whether the MRR schedule has been constructed correctly, not after cohort analysis has already been run on inflated figures.

---

### Pre-Delivery Checks
- Confirm the Anomaly Summary and Bridge were delivered and acknowledged by the user *before* the Cleaned Data tab was built.
- Verify original source sheet is entirely unmodified (no cell values, formats, or formulas altered).
- Verify the Cleaned Data tab contains "Original Value" and "Cleaned Value" columns for every touched cell, including cells that were flagged but not changed.
- Confirm every flag cites: specific cell reference, customer name, raw anomaly value, and prior/subsequent month context.
- Confirm every flag has an associated dollar impact statement (MRR/ARR overstatement or understatement).
- Verify the audit log satisfies: churned rows + active rows = total observed rows, with no hardcoded values.
- Confirm MIN\_THRESH was applied and no sub-1st-percentile MRR customers generated flags.
- Confirm the 6-month lookback threshold was disclosed to the user before the audit began and user either confirmed or adjusted it.
- Confirm negative revenue/refund entries were listed as pending user confirmation — not silently zeroed.
- If a threshold rerun was performed, confirm a delta report (flags added / flags removed) was produced rather than an overwritten findings table.
- Confirm the Onboarding Fade section includes the recurring-revenue quality question if Rule 4 was triggered.
- Confirm the handoff note explicitly directs the Cleaned Data workbook to Customer Cube Analytics — detection logic is not to be re-run in the downstream workflow.

---

### Scope Boundaries
This playbook covers data quality audit only — retention curves, cohort tables, logo churn rates, net revenue retention, and top-customer concentration analysis are handled by the **Customer Cube Analytics** playbook, which consumes the Cleaned Data tab produced here. Retention and cohort sub-methods within that workflow are handled by the **Retention-Cohort** playbook. Do not perform analytical modeling within this cleanup workflow.

---

## Customer-Level Revenue Analytics

**Use when**: Raw customer-level revenue data ("customer cube") is available and the engagement requires NRR, cohort, concentration, and churn/new/expansion drill-downs | **Deliverable**: Excel workbook with 8+ tabs: Master → Retention → Cohorts → Top Customers → Churn Drill-Down → New Customers Drill-Down → Largest Movers Drill-Down → Raw Data

---

### Ask First

1. **Resurrected customers**: If a customer churned to $0 and later returned — but had revenue in earlier periods — classify as "Churn then New" or "Downsell then Upsell"? *(This directly changes NRR, churn count, and new logos; never assume.)*
2. **Segmentation cuts**: Should Retention and Cohorts be replicated by region, size band, end market, and/or product? If yes, specify which dimensions.
3. **Revenue size banding**: Should customers be segmented by revenue tier? If yes, confirm thresholds (e.g., $0–$100K = Small, $100K–$1M = Mid, $1M+ = Large).
4. **Display counts and negative revenue handling**: How many customers to show in Top Customers / Churn / New / Largest Movers (top 10 / 20 / 30)? And for negative revenue (refunds, credits): zero-floor with footnote, retain as-is, or reclassify to a returns line?

---

### Workflow

1. **Ingest Raw Data → Raw Data tab** *(first, to establish the immutable source of truth before any transformation)*
   - Paste the user's file verbatim into the Raw Data tab. Zero modifications. This tab is read-only for all downstream steps.

2. **Build Master tab** *(all analysis columns are added here, never in Raw Data)*
   - Link every cell back to Raw Data; do not re-key values.
   - Sort rows chronologically: earliest period → latest period.
   - Add computed columns in this order:
     - `Cohort (Month)` and `Cohort (Year)` — derived from start date or earliest period with revenue; leave `Cohort (Month)` blank for annual data with no explicit start date.
     - `Current Status` — `Active` or `Churn` (flag propagates forward; see Rules & Pitfalls).
     - `Size Band` — IF formula against confirmed thresholds (conditional on Ask First Q3).
     - `Change in Revenue ($)` — period-over-period delta.
     - `Revenue Growth %` — wrapped in `IFERROR(..., NA())` to suppress divide-by-zero.
     - `In-Year Status` — `New / Upsell / Flat / Downsell / Churn` using IF formulas only; never hard-code.
     - `Total` row at the bottom.
   - Convert any error values in raw revenue fields to `"NM"` — not zero, not left as errors — so they cannot propagate into retention calculations.
   - Flag any negative revenue cells and surface them to the user before proceeding (see Rules & Pitfalls).

3. **Build Retention tab** *(depends on Master being complete and validated)*
   - Apply retention-cohort methodology (see Scope Boundaries for the underlying method).
   - Sign convention: Downsell and Churn stored as **negative values**; all NRR formulas use addition throughout.

4. **Build Cohorts tab** *(depends on Retention tab logic being confirmed)*
   - Add two sub-tables:
     - **Revenue by cohort table** — dollar revenue for each cohort across periods.
     - **NRR by cohort table** — net revenue retention % for each cohort across periods, formatted with red-yellow-green heat map (yellow midpoint = 90% unless user specifies otherwise).

5. **Build Top Customers tab** *(depends on Master; requires understanding of two distinct views — do not merge them)*
   - **Top Customer Revenue table**: Rank customers by the most recent complete period (static ranking — never re-rank by historical year). Map each ranked customer's revenue back across all historical periods.
   - **Concentration Over Time table**: Each year, independently rank that year's largest customers (no anchor to the latest period). This is a separate view from the static ranking above.

6. **Build Churn Drill-Down tab** *(depends on Master `In-Year Status` labels being finalized)*
   - Columns: Rank | Customer ID | Starting Cohort | Churn Date | Starting Revenue | Peak Revenue | $ Lost

7. **Build New Customers Drill-Down tab** *(depends on Master; resurrected-customer classification from Ask First Q1 must be confirmed)*
   - Columns: Rank | all dimension tags | Cohort | $ New Revenue

8. **Build Largest Movers Drill-Down tab** *(depends on Master)*
   - Produce two tables per year: **Largest Upsells** and **Largest Downsells**.
   - Columns for each: Customer ID | YoY Revenue Change ($) | relevant tags.

9. **If segmentation cuts were requested (Ask First Q2): replicate all output tabs for each dimension** *(final step; all upstream tabs must be stable before replication)*

10. **Insert cross-tab check cells throughout** *(embed throughout build, validate at the end)*
    - For every metric that appears in more than one tab (total revenue, NRR, growth rates, customer counts, gross and net retention), add a `check` cell: formula returns `TRUE` if values match, `FALSE` if not. Resolve all `FALSE` and `#REF!` / `#DIV/0!` before delivery.

#### Double-Click Tab Column Structures

| Tab | Columns |
|---|---|
| Churn Drill-Down | Rank · Customer ID · Starting Cohort · Churn Date · Starting Revenue · Peak Revenue · $ Lost |
| New Customers Drill-Down | Rank · All dimension tags · Cohort · $ New Revenue |
| Largest Movers Drill-Down | (Two tables per year) Customer ID · YoY Revenue Change ($) · Relevant tags |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| All formulas | Fully dynamic; zero hard-coded values | Auditability and traceability throughout the workbook |
| Raw Data tab | Included verbatim in deliverable, unmodified | Immutable source of truth; enables full audit trail |
| Error values in revenue fields | Converted to `"NM"` in Master | Prevents error propagation into retention and NRR calculations |
| In-Year Status labels | Assigned via IF formulas only | Ensures labels update automatically with data changes |
| NRR sign convention | Downsell and Churn stored as negative; NRR formulas use addition | Consistency across all retention calculations |
| Heat map midpoint (NRR cohort table) | 90% = yellow | Standard PE diligence reference point for SaaS retention benchmarking |
| Cohort (Month) for annual data with no start date | Left blank | No date available to infer month-level cohort |
| Churn label propagation | Once a customer hits $0, Current Status = Churn for that period and all subsequent periods | Ensures `# Churn` is cumulative, not point-in-time |

---

### Rules & Pitfalls

**Never:**
- **Never hard-code any value in the workbook** — every figure must be formula-driven and traceable to Master or Raw Data, because a single hard-coded cell breaks the audit trail and will be the first thing a diligence reviewer questions.
- **Never modify the Raw Data tab** — all transformation and labeling happens in Master columns; Raw Data must be deliverable as-is, because altering source data destroys the evidentiary foundation of the analysis.
- **Never leave error values (`#REF!`, `#DIV/0!`, etc.) in the workbook** — convert revenue errors to `"NM"` in Master and resolve all formula errors before delivery.
- **Never silently zero-floor or reclassify negative revenue** — flag it and ask the user, because the treatment (zero-floor, retain, or reclassify to returns) changes reported churn and NRR.
- **Never conflate the two Top Customer views** — Top Customer Revenue uses a static ranking anchored to the most recent complete period; Concentration Over Time re-ranks independently each year. Mixing them produces a metric that is neither view and misleads on both concentration risk and customer tenure.
- **Never mix retention definitions** — NRR, gross retention, and fully-burdened gross retention are distinct metrics; using them interchangeably will invalidate comparisons against benchmarks or prior-period figures.

**Conditional:**
- **If a customer's revenue dropped to $0 in a prior period and is now positive again**, classify per Ask First Q1 before labeling In-Year Status — this decision directly changes NRR, churn count, and new logo count, and there is no safe default.
- **If segmentation cuts are requested**, replicate the full set of output tabs (Retention, Cohorts, Top Customers, all drill-downs) once per segment dimension; partial replication produces an internally inconsistent workbook.
- **If source data contains gaps, duplicate customer IDs, or onboarding fade patterns**, run the Data Cube Cleanup playbook on the raw file before beginning this workflow — building on dirty data produces NRR and cohort figures that will not survive diligence scrutiny.
- **If the user confirms annual data with no start date field**, leave `Cohort (Month)` blank; do not impute or estimate.

**Judgment:**
- **Treat the "resurrected customer" classification as a material definition question, not a formatting choice** — the answer can shift reported NRR by several points and new logo counts materially; raise it explicitly even if the user has not flagged it, because most data owners have not thought through the implication.
- **Build cross-tab check cells as you go, not at the end** — catching a mismatch after all tabs are built is significantly more expensive to debug than catching it at the tab-level during construction.
- **Validate the two Churn count formulas independently before delivery**:
  - *(a)* `# New + # Upsell + # Flat + # Downsell = Active customer count for that period`
  - *(b)* `# New + # Upsell + # Flat + # Downsell + # Churn = Cumulative customers tracked through that period` — this total must be monotonically non-decreasing over time; a dip signals a labeling error.
- **Prefer explicit confirmation over inference on all definition questions** — in PE diligence, the cost of reworking a model due to a misclassification is far higher than one additional scoping question.

---

### Pre-Delivery Checks

- Confirm Raw Data tab is identical to the user's original file — zero additions, deletions, or reformatting.
- Confirm zero hard-coded values exist anywhere in Master or downstream tabs.
- Confirm all revenue error values have been converted to `"NM"` in Master; none remain as `#VALUE!` or `#N/A`.
- Confirm all negative revenue cells have been flagged to the user and a handling decision has been received.
- Confirm `In-Year Status` column uses IF formulas exclusively; spot-check at least five rows manually.
- Confirm sign convention: all Downsell and Churn values are negative; all New and Upsell values are positive.
- Confirm NRR heat map yellow midpoint is set to 90% (or user-specified threshold if overridden).
- Run validation formula *(a)*: `# New + # Upsell + # Flat + # Downsell = Active customer count` for every period — must equal `TRUE` across all periods.
- Run validation formula *(b)*: `# New + # Upsell + # Flat + # Downsell + # Churn = Cumulative tracked customers` for every period — must be monotonically non-decreasing.
- Confirm all cross-tab check cells return `TRUE`; no `FALSE`, `#REF!`, or `#DIV/0!` anywhere in the workbook.
- Confirm Top Customer Revenue tab ranking is anchored to the most recent complete period (static) and does not re-sort by historical years.
- Confirm Concentration Over Time tab re-ranks customers independently for each year (not anchored to latest period).
- If segmentation cuts were requested, confirm all output tabs are replicated once per segment dimension with consistent totals.
- Confirm `Cohort (Month)` is blank for any annual data series where no start date field exists.
- Confirm the deliverable package includes the Raw Data tab.

---

### Scope Boundaries

The Retention and Cohort tab methodology is governed by the Retention-Cohort playbook, which this workflow calls as a component; for a retention/cohort-only engagement on clean data, use that playbook directly. If source data contains gaps, duplicate customer records, or onboarding fade artifacts, run the Data Cube Cleanup playbook as a mandatory prerequisite before executing any step of this workflow. Customer-level unit economics, LTV/CAC, and ARR bridge analyses are handled by separate playbooks and are out of scope here.

---

## Retention & Cohort Analysis

**Use when**: Customer-level revenue data is available and the goal is to quantify retention, churn, upsell/downsell, and cohort decay | **Deliverable**: Excel workbook with 4 tabs — Retention, Cohorts, Raw Data (untouched), Calculations

---

### Ask First

1. **Periodicity** — annual, quarterly, or monthly? (Must be ≥ the granularity of the underlying data.)
2. **Period-over-period vs. rolling LTM** — which view is required? (Skip for annual data; LTM is not applicable.)
3. **Re-engagement treatment** — when a customer drops to $0 then returns, classify as: (a) churn + re-engaged, (b) upsell/downsell, or (c) new? Departure and return must be symmetric — confirm the business model (subscription → option a; project/transactional → option b).
4. **Data quality issues present** — duplicate or near-duplicate customer names? Negative revenue rows? Partial/stub periods (annualise, exclude, or label as partial)? Segment cuts required?

---

### Workflow

1. **Preserve raw data** — paste source data into the Raw Data tab without any modification; all analysis runs in separate columns and tabs. (This is the foundation of auditability — never touch the source.)

2. **Build the Calculations tab — customer × period classification matrix** — for each customer, each period, assign one and only one label from: `new | existing | upsell | downsell | churn | re-engaged`. Store these as intermediate columns before any aggregation. (This order is mandatory: classification must exist before summarisation so every roll-up cell can be traced back to a single customer row.)

3. **Apply sign convention throughout** — new and upsell carry positive values; churn and downsell carry negative values. NRR and all waterfall formulas depend on this convention being consistent.

4. **Assign cohort membership** — use the customer's explicit start date if available; otherwise use the first period with recorded revenue. If no start date exists, label the first cohort **"[Period 1] and prior"** to avoid misattributing all legacy customers to a single vintage. For customers whose first period is a partial month, confirm treatment (annualise / use as-is / assign to first full period) with the user.

5. **Build the Retention tab** — present sections in this order within the tab, separated by bold colour-bar dividers:
   - ① $ retention waterfall
   - ② $ retention KPIs
   - ③ Count retention waterfall
   - ④ Count retention KPIs
   - ⑤ Supplemental KPIs (revenue per customer, revenue per new customer, YoY growth)

   Display churn and downsell lines as **black negative numbers**; period-end balance = the arithmetic sum of its components. Attach a definitions footnote to the waterfall tab.

6. **Build the Cohort tab** — construct a cohort decay table indexed to Period 0 = 100%. At the bottom of the percentage table, include both a **simple average row** and a **size-weighted average row**, computed using only cohorts that have data for each respective period. Apply a red-amber-green heat map. Do **not** add a sum/total row to the percentage table. Do not produce charts by default; flag the option to the user if >20 cohorts are present.

7. **Run balance and tie-out checks** (see Pre-Delivery Checks).

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Retention KPI denominator | Beginning-of-period balance | Period-end and average denominators already embed the churn/expansion effects being measured, producing a circular misstatement |
| New customer treatment in NRR | Excluded from net retention entirely | NRR measures expansion/contraction within the existing customer base; including new customers overstates NRR and masks whether existing relationships are being retained and grown |
| Count basis when revenue is absent | Count-only; flag that revenue basis is unavailable | Never fabricate revenue figures; present what the data supports |
| Gross retention — fully burdened | Includes downsell (not churn-only) | Churn-only gross retention is a separate, narrower KPI; the default fully-burdened version is more conservative and complete |
| Cohort percentage base | Period 0 revenue or count for that cohort | Consistent basis allows cross-cohort comparison |
| Charts | Not produced by default | Confirmed deliverable is tables; charts available on request |
| Formula style | All dynamic, zero hard-coded values | A single input change must flow through the entire model |
| Stub/partial periods | Ask user — do not silently annualise or drop | Treatment materially affects cohort assignment and KPI levels |

---

### Rules & Pitfalls

**Never:**
- **Never modify the raw data tab** — all transformations live in Calculations and the output tabs; reviewers must be able to compare outputs to source without reconstruction.
- **Never hard-code any value anywhere in the model** — hard-coded numbers cannot be audited or updated; a single undisclosed constant destroys model integrity.
- **Never use opaque aggregation formulas (e.g. SUMPRODUCT across multiple criteria arrays) without exposed intermediate steps** — reviewers who are not Excel experts will lose confidence the moment a cell formula is unreadable; intermediate classification columns in Calculations make every number traceable to a single customer.
- **Never include new customers in the NRR calculation** — doing so inflates NRR and conceals whether the existing customer base is actually being retained and expanded.
- **Never use period-end balance or average balance as the retention denominator** — both already incorporate the churn and expansion effects you are trying to measure, producing circular misstatement.
- **Never fabricate revenue figures** — if the data contains only customer names and dates, build a count-only basis and flag the limitation explicitly.
- **Never add a sum/total row to a cohort percentage table** — summing percentage rows produces a number that appears meaningful but is mathematically meaningless.

**Conditional:**
- **If no customer start date is provided**, use first revenue period as the cohort anchor, and label the earliest cohort "[Period 1] and prior" — failing to do so incorrectly assigns the entire existing customer stock to one vintage, distorting all cohort decay curves.
- **If NRR ≈ 100% but the cohort table shows average decay to ~25%**, stop and do not deliver — these two metrics are logically constrained to be consistent; a material divergence indicates a classification error or denominator error in one of the two tabs. Identify and resolve the bug before delivery.
- **If revenue data contains negative values**, confirm treatment with the user before classifying — negative revenue may represent credits, refunds, or data errors, each requiring different handling.
- **If duplicate or near-duplicate customer names are detected**, flag them and ask the user how to consolidate — do not make silent judgement calls on entity identity; for minor issues, apply best judgement and add a footnote.
- **If the data is substantially dirty**, run the Data Cube Cleanup workflow upstream before beginning this analysis.
- **If re-engagement is treated as churn + re-engaged**, the departure event must be classified as churn and the return event must be classified as re-engaged — asymmetric treatment (e.g. departure = churn, return = upsell) will cause customer counts to fail to foot and will distort churn rate, NRR, and cohort decay curves simultaneously.
- **If >20 cohorts are present**, ask the user whether a chart view is wanted before building one.
- **If period-over-period vs. rolling LTM is ambiguous**, ask — except for annual data where rolling LTM is not applicable.

**Judgment:**
- **Re-engagement classification should follow the business model**: subscription businesses typically use churn + re-engaged (the customer relationship lapsed and restarted); project/transactional businesses typically use upsell/downsell (revenue fluctuation is a normal operating pattern, not a relationship event). Confirm with the user regardless.
- **Distinguish clearly among multiple gross retention variants**: (a) churn-only gross retention, (b) fully-burdened gross retention (including downsell), and (c) net retention. Conflating any two of these is a common credibility error with sophisticated reviewers.
- **Supplemental KPIs — revenue per customer, revenue per new customer, and YoY growth** — add explanatory power but are subordinate to the waterfall and should always be presented after, not instead of, the primary KPIs.

---

### Pre-Delivery Checks

- **Foot the retention waterfall**: for every period, verify that (beginning balance + new + upsell − downsell − churn ± re-engaged) = ending balance, for both $ and count bases; check cell must equal zero.
- **Tie each period's ending balance to the sum of individual customer revenues for that period**: roll-up total must equal the customer-by-customer sum; check cell must equal zero.
- **Tie each new cohort's Period 0 size to the new customer count and new customer revenue on the Retention tab**: mismatch indicates a cohort assignment or classification error.
- **Tie cohort period totals to the corresponding retention tab period-end balances**: cohort table and retention waterfall are built from the same underlying data and must reconcile at every period.
- **Verify NRR and cohort decay are directionally consistent**: if NRR is near or above 100%, average cohort retention at equivalent tenure must support that level; a material contradiction (e.g. NRR ~100% with cohort average ~25%) is definitive evidence of a bug.
- **Confirm new customers are fully excluded from the NRR denominator and numerator**.
- **Confirm all formulas are dynamic**: search for hard-coded constants in all formula cells before delivery.
- **Confirm Raw Data tab is byte-for-byte identical to the source file**.
- **Confirm sign convention is consistent throughout**: new/upsell positive, churn/downsell negative in every formula that feeds NRR or the waterfall.
- **Confirm re-engagement is treated symmetrically**: whichever label is used for departure, the paired label for return must be the logical complement, and customer counts must foot.
- **Confirm cohort percentage rows have no sum/total row**.
- **Confirm both simple average and size-weighted average rows in the cohort percentage table use only cohorts with data for each respective period** (do not include zero-data cohorts in the denominator).

---

### Scope Boundaries

**Customer Cube Analytics** handles the full customer analytics suite including top-customer analysis and drill-down views; this playbook is the retention and cohort methodology that Customer Cube Analytics calls as a component.
**Data Cube Cleanup** is the upstream workflow for substantially dirty data; execute that playbook first if the source data requires entity resolution, deduplication, or structural normalisation before this analysis can proceed.

---

## Management Meeting Questions

**Use when**: Preparing qualitative discussion questions for a live management meeting in an M&A or PE due diligence context | **Deliverable**: Word document + PDF with consecutively numbered, open-ended questions organized by category (optional timed agenda included)

---

### Ask First

1. **Meeting type** — Broad/general (Mode A), focused deep-dive on a specific topic (Mode B), or hybrid (Mode C)?
2. **Depth level** — Preliminary (relationship-building, wide coverage) or deep-dive (sharp probing, assumption stress-testing)?
3. **Meeting duration** — How many minutes is the session?

> These three inputs cannot be inferred from materials or defaulted; generation is blocked until all three are confirmed.

Optional (confirm if not self-evident from materials): target company name and industry; priority topics or areas of concern; whether a timed agenda should be included.

---

### Workflow

1. **Collect mandatory inputs** — Gate on meeting type, depth, and duration before any generation. Do not proceed with incomplete responses to the three Ask First items; request them explicitly if missing.

2. **Analyze available materials** — Review any CIM, management presentation, or financials provided. For public companies, pull regardless of whether materials are supplied: last 2 years of 10-K/10-Q/8-K filings, broker research from the past 90 days, and news from the past 12 months (e.g., acquisitions, new facilities). Identify key theses, value drivers, and risks. Flag every unexplained trend, margin inflection, or revenue acceleration — each flags at minimum one question requiring management to explain it verbally. *(This step must precede question drafting so that questions are company-specific, not template-generic.)*

3. **Set meeting mode** — Confirm Mode A (broad), Mode B (focused), or Mode C (hybrid) and calibrate category scope accordingly:
   - **Mode A**: Use all six default categories (Company Overview, Financial Performance, Commercial/Sales, Operations, Management & Organization, Growth & Strategy/M&A — include M&A only if deal-relevant).
   - **Mode B**: Derive 4–6 sub-topics from the company's specific context (do not pull from a generic fixed list); collapse all questions into those sub-topics; total question count does not decrease — each sub-topic receives more questions.
   - **Mode C**: Apply Mode A structure with Mode B depth on the designated focal area.

4. **Calibrate question count to depth and duration** — Apply the depth/volume scale: preliminary meetings target 15–20 questions per 60 minutes; deep-dive meetings target 20–40. Scale proportionally for other durations. In deep-dive mode, minimize questions on Company Overview (foundational coverage is assumed from earlier sessions); concentrate volume on financial performance, operational drivers, and strategic assumptions.

5. **Draft questions by category** — Write every question in open, discussion-driving form (e.g., "Walk us through…", "How do you think about…", "What gives you confidence that…", "Can you describe how…"). Apply consecutive numbering across all categories without resetting at each new category (enables in-meeting reference by number, e.g., "Let's come back to Question 12"). For known industries, include industry-specific questions probing metrics and dynamics unique to that sector. Vary sentence openers — do not repeat the same lead phrase across consecutive questions.

6. **Apply internal thesis screening (without disclosing it)** — Questions must covertly probe identified theses, risks, and value-driver assumptions. The output must not expose the deal team's analytical judgments, risk flags, or investment thesis language; management will see this document.

7. **Build the Word document** — Structure: document title (see Rules & Pitfalls), optional timed agenda (see #### Agenda Construction below), questions grouped by category with consecutive numbering, consistent formatting throughout. Export to both .docx and PDF. Run sanity checks (see Pre-Delivery Checks) before delivery.

#### Agenda Construction (when requested)

- Allocate time across categories proportionally to question count within that category.
- Round all time slots to the nearest 5 minutes.
- Include a wrap-up/closing buffer at the end.
- Verify that all time blocks sum exactly to the stated meeting duration.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Meeting type | Mode A — broad/general | Most common format for initial management introductions |
| Depth level | Preliminary | First meetings are relationship-building and orientation |
| Meeting duration | 60 minutes | Standard management call length in M&A processes |
| Question count (preliminary / 60 min) | 15–20 | Calibrated to keep conversation flowing without rushing |
| Question count (deep-dive) | 20–40 | Sufficient coverage for comprehensive operational or financial probing |
| Output format | Word (.docx) + PDF | Standard deal-team delivery format |
| Default categories (Mode A) | Company Overview; Financial Performance; Commercial/Sales; Operations; Management & Organization; Growth & Strategy/M&A | Covers full business landscape; M&A sub-category included only when deal-relevant |
| Numbering | Consecutive across all categories | Enables precise in-meeting reference |
| Timed agenda | Not included unless requested | Reduces document length; included on request |
| Public company research | Always pulled (2-yr filings + 90-day research + 1-yr news) | Ensures questions are grounded in current disclosed information even when no materials are provided |

---

### Rules & Pitfalls

**Never:**
- **Never write a question that can be answered by uploading a document** — any question answerable from a file is a data room list (DRL) item, not a management question. The line is: DRL requests data points; management questions explore the *why* and *how* behind them.
- **Never convert a DRL request into spoken form** — if a DRL has already been issued, do not generate verbal versions of its items. DRL and management questions are complementary, not interchangeable.
- **Never include questions requiring specific numbers, data points, or documents** — e.g., "What was your 2019 EBITDA?" belongs in the DRL, not here.
- **Never include confirmatory or advisor-domain topics** (legal, tax, insurance, regulatory) unless the user explicitly requests them — these fall outside the deal team's direct diligence scope and belong to specialist workstreams.
- **Never fabricate company-specific information** — if a detail is assumed rather than sourced, label it explicitly as an assumption.
- **Never generate when mandatory inputs are missing** — if meeting type, depth, and duration are all absent and cannot be inferred, request them before producing any output; offer a generic template or blank structure as a placeholder only.
- **Never use a long, internally descriptive document title** (e.g., "Mid-Depth Meeting with Sales and Financial Focus") — the title must be presentable to the company, e.g., "Introductory Meeting" or "Commercial Deep Dive."
- **Never expose the deal team's thesis, risk flags, or analytical framing in the output** — management will read this document; internal screening logic must remain invisible.
- **Never write leading, adversarial, or confrontational questions** — even when probing a risk or a suspected weakness, phrasing must remain professional and respectful of the management audience.

**Conditional:**
- **If no materials are provided and the target is a public company**, still pull 2-year SEC filings, 90-day broker research, and 12-month news before drafting — questions must be grounded in disclosed information, not generic.
- **If no materials are provided and the target is a private company with no public information**, request materials before generating; if the user cannot supply any, produce a clearly labeled generic template or blank structure.
- **If depth is deep-dive**, shift tone toward sharper probing of assumptions, forecast confidence, and risk scenarios; reduce question allocation to Company Overview; increase allocation to Financial Performance and Operations.
- **If Mode B (focused)**, derive sub-topics from the specific company context (e.g., from the CIM or disclosed strategy) — do not apply a generic fixed sub-topic table. Total question count stays the same; volume per sub-topic increases.
- **If an unexplained trend, margin inflection, or revenue acceleration appears in any material**, generate at least one question in that category asking management to walk through the explanation verbally — do not skip anomalies.
- **If a timed agenda is requested**, verify that all time slots sum exactly to the stated meeting duration before delivery.
- **If the industry is known**, include questions probing industry-specific KPIs and competitive dynamics — do not substitute with generic business questions.

**Judgment:**
- **Vary question openers deliberately** — repeating the same lead phrase (e.g., "Can you walk us through…" for every question) signals template use and reduces engagement; vary phrasing while maintaining open, discussion-driving form.
- **In deep-dive mode, weight early Company Overview questions lightly** — foundational context is typically established in preliminary meetings; spending question budget on it in a deep-dive wastes session time with senior management.
- **Frame every risk-probing question from a position of curiosity, not suspicion** — the goal is to let management reveal their narrative; an adversarial tone closes off information rather than surfacing it.
- **Treat each question as a real-time insight tool** — before finalizing, ask whether each question could generate a genuine, unexpected data point in the room. If the answer is likely a scripted IR response, reframe or deepen it.

---

### Pre-Delivery Checks

- Confirm output files are .docx and PDF.
- Verify **every question is open-ended and discussion-driving** — no question should be answerable with a number, a yes/no, or by referencing a document.
- Confirm **zero DRL items appear** in verbal form — no specific data points, file requests, or numeric confirmations.
- Confirm **no confirmatory or advisor-domain questions** (legal, tax, insurance, regulatory) appear unless explicitly requested.
- Verify question count matches depth calibration: **15–20 for preliminary/60 min; 20–40 for deep-dive**; proportionally scaled for other durations.
- Verify **numbering is consecutive across all categories** with no reset between sections.
- For Mode A: confirm all six default categories are present; confirm M&A sub-category appears only if deal-relevant.
- For Mode B: confirm all categories have been collapsed into 4–6 company-context-derived sub-topics (not a generic fixed list); confirm total question count is not reduced.
- Confirm **every flagged anomaly or unexplained trend has at least one corresponding question**.
- If the company is in a known industry, confirm **industry-specific questions** are present and not substitutable with generic alternatives.
- If a timed agenda was requested, verify **all time blocks sum exactly to the stated meeting duration**, slots are rounded to 5-minute increments, and a wrap-up buffer is included.
- Confirm the **document title is presentable to the target company** — no internal descriptors, depth labels, or analytical framing in the heading.
- Confirm **no internal thesis, risk hypothesis, or deal team judgment** is visible in the question text or section headers.
- For any assumed information, confirm it is **explicitly labeled as an assumption**.

---

### Scope Boundaries

**DD Question Creator** handles written, document-based data requests sent to the counterparty — all specific data points, financials, files, and numeric confirmations belong there, not here. **Expert Call Agenda** handles third-party expert interviews (including required MNPI declarations) — questions directed at independent industry sources, former executives, or channel checks are out of scope for this playbook.

---

## Expert Call Guide

**Use when**: A scheduled expert-network call (GLG, Third Bridge, Tegus, AlphaSights, or equivalent) requires a structured discussion guide | **Deliverable**: Word document with compliant header, tiered question set, and time-permitting addendum (`/workspace/outputs/expert-call-agenda-[surname]-[YYYYMMDD].docx`)

---

### Ask First

1. **Target company** — name and, if masking is required, the preferred circumlocution (e.g., sub-vertical label).
2. **Expert profile** — full bio text or LinkedIn URL/slug; relationship to the target (current employee, recent departure, competitor, customer, supplier); recency of direct exposure.
3. **Primary learning objective** — select one of the eight conversation flows listed in the Workflow section; note any sub-focus (e.g., if Market Map → which sub-verticals).
4. **Call duration and flags** — 60 / 45 / 30 min or custom; topics the user wants to prioritise (≥50 % of questions must land here); whether to mask the target name; any known thesis points or sensitive areas to probe or avoid.

---

### Workflow

1. **Intake** — Collect only the information that is missing; ask one question at a time; offer defaults so the user can confirm with a single "yes." Required intake fields: target company, expert background + relationship + recency, primary learning objective (eight options), conditional follow-ups (e.g., market map → which sub-verticals), call duration, flags (thesis points, sensitive areas, masking preference).

2. **Identity verification** — Before drafting, resolve the expert's identity using the **LinkedIn slug as the sole authoritative ID** (same name + different slug = different person; never conflate them). LinkedIn is gated: if direct retrieval fails, request the user to paste the bio text or a screenshot. While waiting, **do not fabricate employer, school, or tenure details**. If the user provides nothing, draft with only what is explicitly supplied and note: *"No prior background assumed — expert to self-introduce on the call."*

3. **Pre-draft research** — Retrieve current background, industry news, target news, and sub-vertical data. Every named fact intended for a question (acquisition, competitor, funding round, regulatory action, product launch, market statistic, executive title) must be traceable to a source retrieved **in this session** — not to training memory. Unverifiable facts must be generalised or deleted before drafting.

4. **Select conversation flow** — Choose the matching flow from the eight options and pull questions accordingly:
   - General market & business model
   - Market map & target identification
   - Due diligence on a former employer / competitor
   - Customer due diligence
   - Supplier due diligence
   - Management due diligence
   - Other (user-defined)

5. **Draft the Word document** — Assemble in this order: (a) header block, (b) verbatim MNPI / compliance disclaimer, (c) standard opening, (d) primary agenda, (e) time-permitting questions, (f) standard closing. See the document structure subsection below.

6. **Apply sanity checks** — Run every item in Pre-Delivery Checks before saving.

7. **Deliver** — Save to `/workspace/outputs/`, share via markdown link in chat, and state the editorial trade-offs made (e.g., *"GTM questions promoted to primary agenda given your stated priority; competitive dynamics moved to time-permitting"*).

---

#### Document Structure

| Section | Content |
|---|---|
| **Header block** | Expert name/slug, target company (or masked label), call date, duration |
| **Verbatim MNPI / compliance disclaimer** | Fixed text — see Rules & Pitfalls; must appear verbatim and unedited |
| **Standard opening** | Background warm-up; confirm expert's role, tenure, and direct exposure to the target |
| **Primary agenda** | Most critical questions only; ordered rapport-first (background / high-level before sensitive / pointed) |
| **Time-permitting** | Secondary questions demoted from primary; labelled explicitly |
| **Standard closing (3 questions — always include all three)** | (1) *"What keeps you up at night about this industry / company?"* (2) *"Is there anything you expected me to ask that I didn't?"* (3) *"Who else should we be talking to?"* |

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Output format | Word document | Required for compliance header and legal disclaimer formatting |
| MNPI disclaimer | Verbatim fixed text at top of document | Non-negotiable legal protection; content may not be paraphrased or relocated |
| Question density | Scaled to call duration: full set for 60 min, proportionally reduced for 45 / 30 min | Prevents overloading shorter calls |
| Conversation ordering | Rapport-first: background and high-level questions precede sensitive or pointed questions | Builds rapport, surfaces the expert's strongest area before probing weak spots |
| Time allocation | ≥ 50 % of questions assigned to user-flagged highest-priority topic | Ensures the call's primary purpose is not crowded out |
| Standard opening and closing | Always included | Opening confirms expert relevance; closing yields unsolicited intelligence and referrals |
| Unverified LinkedIn identity | Draft with user-supplied information only; note assumption explicitly | Prevents fabricated credentials from entering the agenda |
| Masked target reference | *"A company like [target]"* or sub-vertical label | Conceals identity while preserving the substance of the question |

---

### Rules & Pitfalls

**Never:**
- **Never use a name-match search result as a substitute for slug-verified LinkedIn identity** — the same name can belong to a different person, and attaching the wrong person's background to the expert is an unrecoverable credibility failure.
- **Never fabricate or infer employer names, school names, job titles, or tenures** when the expert's LinkedIn is inaccessible — doing so poisons every question anchored to that false credential.
- **Never include a named fact (acquisition, competitor, funding round, regulatory action, product launch, market statistic, executive title) that cannot be traced to a source retrieved in this session** — relying on training memory is the primary vector for hallucinated fact hooks.
- **Never confirm or deny the target's identity if the expert guesses it during a masked call** — and audit every question in the agenda for details that could allow reverse identification.
- **Never ask questions at the level of industry common knowledge** — IB/PE practitioners already know this material; including it wastes scarce call time and signals poor preparation.
- **Never apply software-business question language (per-seat pricing, ARR, retention) to non-software companies** — e.g., asking a retailer about per-seat pricing destroys credibility instantly.
- **Never alter or paraphrase the verbatim MNPI / compliance disclaimer** — it is a legal instrument, not boilerplate.

**Conditional:**
- **If the expert is a current employee or recent departure:** actively steer questions away from content that could constitute MNPI (non-public financials, unannounced transactions or products, live pipeline); reframe toward market and industry dynamics instead. This is the primary legal risk on the call.
- **If the expert's separation from the target is 3+ years old:** flag knowledge staleness explicitly in the agenda header and weight questions toward structural / historical insight rather than current operational detail.
- **If masking is requested:** replace all direct references to the target with *"a company like [target]"* or the relevant sub-vertical label; ask about the target and key competitors simultaneously to prevent inference; scan the full agenda for any detail (deal size, geography, product name, org structure) that could enable reverse identification, and remove or generalise it.
- **If the call is a customer due diligence:** before drafting, confirm — has the expert actually purchased or used the product? At what scale? How recently? Do not assume relevance.
- **If the call is a supplier due diligence:** confirm — has the expert actually contracted with the target? How long ago? Was the relationship direct? Do not assume relevance.
- **If the user provides no expert bio and cannot supply one:** draft a generic agenda using only the stated objective, note the limitation clearly, and instruct the interviewer to open with a full self-introduction from the expert before proceeding.

**Judgment:**
- **Anchor at least 50 % of the agenda to the user's highest-priority topic** — a balanced agenda that spreads time evenly often means the most important question runs out of time.
- **Customise question language to the target's business model** — software: per-seat / ARR / retention; industrials: supply chain / operations; consumer: brand / CAC; retail: site selection / AUV / payback period / single-store maturity curve; healthcare services: payer mix (government vs. commercial); pharma: therapeutic area. Mismatched vocabulary signals you don't understand the business.
- **Place the most sensitive and pointed questions after rapport is established** — experts become more candid after they have been invited to speak at length about what they know best.
- **Demote secondary questions to time-permitting rather than deleting them** — this preserves optionality if the primary agenda runs short, and signals prioritisation to the interviewer.

---

### Pre-Delivery Checks

- **Verify every credential claim** — each named employer, title, school, and tenure in the agenda is traceable to (a) user message, (b) slug-verified LinkedIn/bio, or (c) an identified matching public source; if unverifiable, delete.
- **Audit every fact hook for session-traceable sourcing** — go question by question; any named acquisition, competitor, funding round, regulatory action, product launch, market statistic, or executive title must point to a source retrieved in this session; generalise or delete anything that cannot.
- **Confirm zero redundant questions** — no two questions elicit the same information.
- **Confirm industry-appropriate question language** — no per-seat / ARR framing for non-software businesses; no retail-specific metrics for non-retail businesses.
- **Confirm no common-knowledge questions remain** — remove anything an IB/PE professional would already know.
- **Confirm rapport-first ordering** — background and high-level questions precede sensitive and pointed questions throughout the primary agenda.
- **Confirm ≥ 50 % of questions are allocated to the user's flagged highest-priority topic.**
- **Confirm questions are anchored to this expert's specific experience** — the agenda must not read as a generic industry primer.
- **Run masking check (if applicable)** — no question or contextual detail enables reverse identification of the target; confirm the target and key competitors are queried in parallel.
- **Confirm standard opening and all three standard closing questions are present.**
- **Confirm verbatim MNPI / compliance disclaimer is at the top of the document, unedited.**

---

### Scope Boundaries

**Management Questions List** handles calls with the target company's own management team (not third-party experts) and produces a separate Word question set without MNPI steering logic.
**DD Question Creator** produces a written document-request list (Excel) sent to the counterparty, not a real-time conversation guide.
This playbook covers only third-party expert calls (former employees, competitors, customers, suppliers) conducted through expert networks or equivalent channels.

---

## Credit Agreement Summary

**Use when**: A credit agreement requires distillation for a partner-level audience before a client call | **Deliverable**: 2-page PowerPoint memo readable in 10 minutes by a PE Partner/Principal/VP or IB MD

---

### Ask First
1. Has the full credit agreement been uploaded? If not, request it now — do not begin until the source document is in hand.
2. Are all ancillary documents available: fee letter, intercreditor agreement, security/guarantee agreement, purchase agreement, schedules, and any amendments?
3. Is there a specific industry vertical (software, retail, healthcare, etc.) that requires sector-specific clause attention?
4. Are 2–3 recent comparable credit agreements available for benchmark comparison if off-market terms are identified?

---

### Workflow

1. **Collect all source documents before touching the memo** (fee letter, intercreditor, security agreement, purchase agreement, schedules, amendments — flag any that are missing or referenced but not provided; note their existence without speculating on content).

2. **Build Page 1 — upper half: Transaction Overview**
   - Open with 3–5 sentences establishing the big picture: parties and jurisdiction, the borrower's position within the group structure, facility type(s) and size, and use of proceeds.
   - Then lay out in structured form: Borrower / Guarantors; Lenders / Syndicate and Agent; Facility type(s) and commitment amount(s); Use of proceeds; Closing date and conditions precedent.

3. **Build Page 1 — lower half: Key Economic Terms**
   - Pricing: margin, reference rate, SOFR adjustment / floor, pricing grid / step-down mechanics.
   - Fees: upfront, commitment, agency, and any other disclosed fees.
   - Tenor and amortization schedule.
   - Prepayment: voluntary mechanics, soft call protection, make-whole premium; mandatory prepayment triggers and sweep percentages.
   - Collateral and guarantees.
   - M&A and incremental debt: delayed-draw term loan (DDTL) mechanics, incremental basket sizing, permitted acquisition definition.

4. **Build Page 2 — five blocks in order**:
   - **Definitions & Reporting Requirements**: EBITDA definition extracted verbatim (as a defined term in quotation marks) with all addback categories and any stated caps (e.g., "pro forma adjustments not to exceed 10% of Consolidated EBITDA"); reporting covenant timeline.
   - **Covenants**: financial covenants (springing vs. maintenance, equity cure rights), affirmative covenants, negative covenants; flag any basket that is fixed vs. grower; note MFN provisions and margin ratchets.
   - **Events of Default**: cross-default threshold stated in dollar amount; grace periods with flag if shorter than market (payment: 5 days; covenant: 30 days); state whether acceleration is automatic or lender-elected.
   - **Notable / Off-Market Provisions**: flag clearly, state the issue, do not editorialize — let the partner draw the conclusion (see Rules & Pitfalls).
   - **Closing Paragraph ("So What")**: 2–3 sentences on open items, unsatisfied conditions precedent, and follow-up points for the client; if the agreement is clean, say so and note 1–2 minor improvement suggestions.

5. **Apply section-number citations to every factual claim throughout** (e.g., "Leverage covenant steps to 5.5x in Q4 2026 (Section 2.01)") — do this as you draft each block, not as a post-pass (traceability is structural, not cosmetic).

6. **Final length check**: confirm the memo is ≤ 2 pages, single-spaced; cut to fit — never add a third page or allow content to bleed over.

---

### Defaults (apply silently, disclose at delivery)

| Parameter | Default | Rationale |
|---|---|---|
| Memo length | 2 pages, hard cap | Sized for partner to read in 10 minutes before a client call |
| Line spacing | Single | Maximises information density within 2-page limit |
| Page 1 structure | Transaction Overview (upper) + Key Economic Terms (lower) | Most time-critical terms surfaced immediately |
| Page 2 structure | Definitions & Reporting → Covenants → Events of Default → Notable Provisions → Closing Paragraph | Dependency order: definitions gate covenant interpretation |
| No cover page, no table of contents, no filler | Begin directly with Transaction Overview | Eliminates non-content pages that would consume the 2-page limit |
| No glossary | Readers are senior professionals; basic terms are not defined | |
| Font colour | Black body text; aggressive / anomalous terms highlighted | Draws the eye to risk items without editorialising |
| Defined terms | Quoted verbatim as they appear in the agreement | Credit agreement definitions are the negotiating battlefield |
| Off-market indicators (trigger for comp request) | Total leverage > 8x; fees > 3%; non-SOFR benchmark; spread > 10% | Thresholds where terms deviate sufficiently to warrant benchmarking against 2–3 recent comparables |
| Cross-default threshold | Expressed in dollar amount | Required for partner to assess materiality instantly |
| Grace period market benchmarks | Payment: 5 days; covenant: 30 days | Flag any grace period shorter than these as below-market |
| External documents referenced but not provided | Note existence only; never speculate on content | Intercreditor and fee letter terms are legally distinct and not inferrable |

---

### Rules & Pitfalls

**Never:**
- **Never begin drafting before the source credit agreement is in hand** — assumptions about missing documents are the single fastest way to produce an unreliable memo that embarrasses the partner on a client call.
- **Never fabricate, estimate, or fill gaps** — if a figure is absent, ambiguous, or appears intentionally left blank, state "not identified / blank" explicitly; guessing creates legal and credibility exposure.
- **Never copy-paste raw contract language** — rewrite everything in plain prose; the sole exception is defined terms, which must be quoted verbatim in quotation marks.
- **Never add a third page or allow bleed** — the 2-page constraint is a functional requirement, not a style preference; a memo that does not fit is a memo the partner will not use.
- **Never editorialize on flagged provisions** — state the issue clearly and let the partner decide; inserting conclusions is editorialising and removes the partner's ability to exercise independent judgment on the call.
- **Never omit a section-number citation from a factual claim** — uncited claims cannot be traced to the agreement and destroy the memo's core value proposition.
- **Never speculate on the content of unreceived ancillary documents** (fee letter, intercreditor, security agreement) — note that they exist and were referenced; stop there.

**Conditional:**
- **If off-market indicators are present** (leverage > 8x, fees > 3%, non-SOFR benchmark, spread > 10%), flag the anomaly in the Notable Provisions block and ask the user whether to pull 2–3 recent comparable credit agreements for benchmarking before finalising the memo.
- **If a clause is absent, ambiguous, or appears deliberately left vague**, call it out explicitly in the relevant block — do not skip it or soften the language; deliberate ambiguity is itself a material term.
- **If the agreement is a software credit**, flag ARR treatment in the EBITDA/definitions block. **If retail**, flag inventory coverage levels. **If healthcare**, flag regulatory-event defaults. **If ESG-linked**, extract the adjuster mechanics and any ratchet.
- **If a SOFR fallback or benchmark transition clause is present**, extract its mechanics; if absent in a new facility, flag as notable.
- **If an equity cure right is present**, note the number of permitted cures per year and the cumulative cap, as these are frequently negotiated and material to covenant tightness.
- **If acceleration on an Event of Default is automatic** (rather than lender-elected), flag this explicitly — it is a material asymmetry that affects the borrower's cure window.

**Judgment:**
- **Flag unrestricted subsidiary designation rights prominently** — the ability to move assets outside the collateral package (J.Crew-style IP transfer / trapdoor) is among the most consequential creditor-hostile provisions and is routinely buried; identifying it is where domain expertise separates a summary from a clause list.
- **Flag EBITDA addback categories and caps as a standalone item**, not folded into the general covenant discussion — this definition is the most frequently negotiated and most frequently abused in leveraged credit documents; the cap percentage is the key number.
- **Flag debt reclassification between baskets** — the ability to move debt from one basket to another post-closing is a structural risk often overlooked at origination.
- **Distinguish fixed from grower baskets** — grower baskets scale with EBITDA and can expand materially in a growth scenario; this changes the effective incurrence test over the life of the facility.
- **Prefer precision over comprehensiveness** when the 2-page constraint forces a trade-off — the selection criterion is: "Would the partner need this to conduct the client call?" If yes, include it; if no, cut it.

---

### Pre-Delivery Checks

- Confirm memo is exactly 2 pages, single-spaced; trim any overage before delivery.
- Verify every factual claim carries a Section citation; reject any unsupported assertion.
- Verify all defined terms appear in quotation marks and match the agreement's exact wording.
- Confirm no content has been copy-pasted from the agreement (other than quoted defined terms).
- Confirm no blanks have been estimated or assumed; all gaps are labelled "not identified / blank."
- Confirm all referenced external documents (fee letter, intercreditor, security agreement) are noted as existing but their content is not characterised.
- Check the Events of Default block: cross-default threshold is in dollar amount; grace periods are stated; acceleration mechanic (automatic vs. elected) is noted; any grace period shorter than 5 days (payment) or 30 days (covenant) is flagged.
- Check the Notable Provisions block for the following liability-management landmines: unrestricted subsidiary designation rights; trapdoor / J.Crew-style IP transfer capability; EBITDA addback categories and percentage cap; debt reclassification between baskets; fixed vs. grower basket characterisation; MFN and margin ratchet provisions; springing covenant triggers; equity cure rights and limits.
- Check for off-market indicators (leverage > 8x, fees > 3%, non-SOFR benchmark, spread > 10%); if any are present, confirm whether comp benchmarking was requested and either completed or explicitly deferred by the user.
- Confirm the closing paragraph addresses: open items, unsatisfied conditions precedent, client follow-up points (or a clean confirmation plus 1–2 minor improvement suggestions if the agreement is clean).
- Confirm there is no cover page, table of contents, glossary, or other filler ahead of the Transaction Overview.

---

### Scope Boundaries

Model Audit handles formula integrity checks, assumption validation, and tie-out of financial models (Excel/PDF); that work begins only after the credit agreement summary is complete and the debt terms are confirmed. LBO Debt Schedule handles the mechanics-level build of tranche structures, revolving credit facilities, and interest-carry loops in a model. Neither adjacent playbook reviews or interprets legal text.
