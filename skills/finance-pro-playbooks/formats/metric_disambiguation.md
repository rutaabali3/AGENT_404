# Metric Disambiguation & Definition Log

This document serves as the "Metric Log" for financial data retrieval. Standardized data providers (e.g., Yahoo Finance, CapIQ, FactSet) use specific naming conventions. Analysts must know exactly what these standard metrics include or exclude, and when to abandon standard endpoints in favor of manual reconstruction from primary filings.

## 1. Operating Profit vs. EBIT vs. EBITDA

| Metric | Standard Endpoint Behavior | When to use | When to avoid |
| --- | --- | --- | --- |
| **Operating Income (Profit)** | Typically includes D&A. Does NOT include non-operating income/expenses (e.g., interest, taxes, equity in earnings of affiliates). | Standard margin analysis. | Do not use if the user explicitly asks for EBIT, as Operating Income excludes non-operating items that are part of EBIT. |
| **EBIT** | Earnings Before Interest and Taxes. Often calculated as Net Income + Interest + Taxes. | Standard valuation multiples (EV/EBIT). | Do not confuse with Operating Income. |
| **EBITDA** | EBIT + D&A. Standardized endpoints usually provide a clean, unadjusted EBITDA. | Standard valuation multiples, basic screening. | **Never use for "Adjusted EBITDA", "Covenant EBITDA", or "Management EBITDA".** Standard endpoints do not capture company-specific add-backs (e.g., restructuring, SBC, litigation). You MUST parse the earnings release or 10-K/Q reconciliation table to get Adjusted EBITDA. |

## 2. Earnings Per Share (EPS)

| Metric | Standard Endpoint Behavior | When to use | When to avoid |
| --- | --- | --- | --- |
| **Basic EPS** | Net Income / Basic Weighted Average Shares. | Rarely used in valuation. | Avoid in almost all valuation contexts. |
| **Diluted EPS** | Net Income / Diluted Shares (includes options, warrants, convertible debt). | Standard P/E multiples. | Avoid if the user asks for "Adjusted EPS" or "Non-GAAP EPS". |
| **Adjusted / Non-GAAP EPS** | Excludes one-time items, amortization of intangibles, and often Stock-Based Compensation (SBC). | Tech/Software valuation, management performance tracking. | Rarely available cleanly via standard endpoints. Parse the company's Non-GAAP reconciliation. |

## 3. Enterprise Value (TEV) & Debt

| Metric | Standard Endpoint Behavior | When to use | When to avoid |
| --- | --- | --- | --- |
| **Total Debt** | Usually includes Short-Term Debt, Current Portion of Long-Term Debt, and Long-Term Debt. | Basic capital structure. | Be careful with Operating Leases. Post-ASC 842 / IFRS 16, operating lease liabilities are on the balance sheet. Standard "Total Debt" endpoints may or may not include them. |
| **Net Debt** | Total Debt - Cash & Equivalents (- Short Term Investments). | Enterprise Value calculation. | Ensure you know if restricted cash or long-term investments are excluded. |
| **Enterprise Value (TEV)** | Market Cap + Total Debt + Preferred Stock + Minority Interest - Cash & Equivalents. | EV/EBITDA, EV/Revenue multiples. | **Operating Leases Trap**: If you are calculating EV/EBITDA, and EBITDA *excludes* rent expense (because leases are capitalized), TEV *must include* the operating lease liability to be apples-to-apples. If EBITDA *includes* rent expense (EBITDAR), TEV must *exclude* the lease liability. Always ensure numerator and denominator treat leases consistently. |

## 4. Multiples: Trailing vs. Forward

| Metric | Standard Endpoint Behavior | When to use | When to avoid |
| --- | --- | --- | --- |
| **LTM (Trailing) Multiples** | Uses Last Twelve Months (LTM) financial data. | Precedent transactions, mature company comps. | Ensure the LTM period is explicitly dated (e.g., "LTM as of Q3 2024"). |
| **NTM (Forward) Multiples** | Uses Next Twelve Months (NTM) consensus estimates. | High-growth tech, software, forward-looking comps. | **Never mix NTM multiples with LTM financials.** If the user asks for "Forward P/E", you must fetch consensus estimates, not trailing Net Income. |

## 5. Free Cash Flow (FCF)

| Metric | Standard Endpoint Behavior | When to use | When to avoid |
| --- | --- | --- | --- |
| **Levered FCF (FCFE)** | Cash Flow from Operations - CapEx. Available to equity holders. | Dividend analysis, share buyback capacity. | Do not use for Enterprise Value DCF. |
| **Unlevered FCF (FCFF)** | NOPAT + D&A - CapEx - Change in NWC. Available to all investors. | Standard DCF Modeling. | Standard endpoints rarely provide clean UFCF. You must calculate this manually in a DCF. |

## Golden Rule for Custom Metrics

If a user requests a metric with prefixes like **"Adjusted", "Covenant", "Pro Forma", "Run-rate", or "Management"**, **DO NOT** rely on standardized data API endpoints. These metrics are bespoke to the company or the specific deal. You MUST route the task to document retrieval, parse the original SEC filing, CIM, or Earnings Release, and extract the specific reconciliation table.
