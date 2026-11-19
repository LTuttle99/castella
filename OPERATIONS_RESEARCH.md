# Operations research and acquisition

Phase 7 preserves the static application and original calculators. The pre-change review is in OPERATIONS_ASSUMPTION_AUDIT.md. No operational ratio was silently replaced by a national wage, another sport’s guidance or an annual authority expense.

## Successfully retrieved and integrated

- **BLS May 2023 national OEWS workbook**: https://www.bls.gov/oes/special.requests/oesm23nat.zip. Actual ZIP/XLSX download, parsed into mean and median hourly estimates for six occupations. Published 2024; cross-industry national observations, not NFL or Indianapolis wages. Government statistical facts with attribution; no benefits, payroll burden or contractor markup included.
- **MSFA 2024 Legislative Report**: https://www.msfa.com/df-data/files/Final%20-%20MSFA%202024%20Legislative%20Report.pdf. Retrieved PDF; cover letter January 15, 2025, observation fiscal year ended June 30, 2024. Financial statement visually inspected at PDF page 46 / printed page 24. Three annual authority figures retained as context, not event/per-attendee defaults. Total expenses include depreciation/amortization; stadium operating revenue is not identified as concession gross sales.
- **Lucas Oil Stadium background/history**: https://www.lucasoilstadium.com/tours-stadium-info/background-history/. Venue reference approximately 67,000 football seats, not current event inventory. Page is undated; no invented publication year.
- **Sports Grounds Safety Authority ingress guidance**: https://sgsa.org.uk/physical-factors/circulation/ingress/. UK reference of 660 persons per entry point/hour with lower measured rates taking precedence. This is not measured NFL ticket/security throughput or a safe-lane certification. Undated page, reference-only.

Only selected factual observations and metadata are published. Full source HTML, XLSX and PDF files remain in ignored work/phase7/. Public availability is not described as a blanket license for source-text redistribution. Source hashes, retrieval timestamps, usage scope and exact URLs are recorded in OPERATIONS_PROVENANCE.json and the data bundle.

## Investigated but not suitable as a default

The operator’s report at https://www.mercedesbenzstadium.com/news/mercedes-benz-stadium-cuts-food-prices-for-second-time describes a 16% change in average spending per fan in 2017 versus 2016. It was examined through public web research; no separate bulk scrape or absolute dollar benchmark is claimed. A percentage change cannot supply a USD-per-attendee level without its baseline. Merchandise, transaction value, cashless purchasing effects and venue-retained concession revenue were not obtained as suitably defined absolute NFL benchmarks.

BLS metropolitan ZIP https://www.bls.gov/oes/special.requests/oesm23ma.zip and Indianapolis table https://www.bls.gov/oes/2023/may/oes_26900.htm returned HTTP 403. No bypass was attempted. National data are not substituted as Indianapolis observations. No measured venue-specific transportation mode share, vehicle occupancy, security throughput or universal NFL staffing ratio was verified. These inputs remain editable assumptions.

## Reproduce

`python3 scripts/operations_pipeline.py --check` validates approved static data offline. `--fetch` explicitly checks robots policies, bounds source downloads to 20 MB, uses an identified research agent, waits between requests and records failures. `--rebuild` parses downloaded files, checks the exact financial/source statements, normalizes and deduplicates records, then emits provenance, quality and export hashes. The collector uses the Python standard library; rebuilding PDF facts additionally requires pypdf. No scraping runs in the website or normal deployment.

The initial BLS robots and national archive retrievals succeeded. A subsequent pipeline refresh received 403 for BLS robots and conservatively skipped that refresh; the export reused the previously retrieved, hashed archive. The other three source refreshes succeeded. This distinction is retained in acquisition logs rather than calling every refresh successful. Normal builds never depend on third-party availability.

## Next research priorities

Obtain current/local occupational wage tables or staffing contract quotes; role-level event rosters and paid-hours logs; actual gate/security service observations and arrival profiles; local transport surveys and parking supply; and event-specific concession gross sales with a verified attendee denominator. Refresh archived wage observations before using them for current budgeting. None of these missing inputs is fabricated.
