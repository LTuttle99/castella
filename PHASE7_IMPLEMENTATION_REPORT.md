# Phase 7 implementation report

Base: production Browser AI release `ae6bf1009a6d39f2de6489fe1f87ad6f1d5f1b2b`. Branch: feature/phase7-operations-research. Existing calculations, historical attendance data, visual styling, personalities, achievements, simulator and Pages deployment were retained. The pre-change audit is OPERATIONS_ASSUMPTION_AUDIT.md.

Implemented a robots-aware, bounded source acquisition/rebuild/check pipeline and a checksummed static operations collection. Seventeen records from four official sources include national occupational wage estimates, scoped annual financial facts, approximate venue capacity and UK ingress context. All records carry units, dates, geography, methods, evidence class, source URL, retrieval and limitations. Source text/archives remain outside the build. Actual failures are recorded.

Operations adds explicit wage benchmark/custom selection per role, six role quantity/time/wage forms, setup/teardown and additional overtime hours, custom premium/burden/fixed costs, hypothetical gross spending, combined user-defined stress cases, baseline comparison and source inspection. Unsupported benchmark modes remain unavailable. Existing ratios/defaults remain illustrative. No current NFL labor standard or dollar-spending default is fabricated.

The deterministic assistant retrieves selected wage origins, distinguishes national/Indy scope and assumptions, computes labor/gross spending, retains wage-change context and saves input receipts for follow-up provenance even after dashboard edits. The Ollama tool registry exposes operations_research with validated deterministic results. Browser AI consumes the same trusted dialogue result. No model generates source URLs or research values.

The public 2000–2019 attendance export is unchanged. Financial annual totals remain separate from attendee denominators. No forecasting estimator, gate scans, new historical no-show data, profit estimator or safety certification is claimed.

Validation: 42 operations JavaScript cases, 80 Ollama mock scenarios, 24 Browser AI cases, all prior JavaScript suites, 20 Python tests, offline data checks and static build. Browser tests, the review URL and release status are recorded in the final handoff. Phase 7 is prepared for review; it is not automatically deployed by source collection.

Research limitations and next inputs required are documented in OPERATIONS_RESEARCH.md and OPERATIONS_BENCHMARKS.md. The separate Browser AI upgrade is already deployed; this operations branch preserves it.

## Phase 7 browser verification

Chromium 153 verified explicit wage selection and edited-wage reclassification, $2,666.08 labor from entered synthetic role/time/burden inputs, custom $12-per-attendee gross spending, sensitivity/invalid bounds, saved comparison, 17 source cards/links, year/scope labels, operations chat and follow-ups, no live third-party research requests, and 390px layout with no page errors. A simulated HTTP 503 confirmed missing evidence is acknowledged while custom labor, all navigation and Standard ticket chat still work. Original simulator/operations inputs, errors, achievements/persistence and reduced-motion behavior also passed browser regression. Historical data retained 638 team-seasons, 10,846 weekly slots including 638 missing (10,208 nonmissing); no historical data was altered. Source/evidence screenshots and logs are in verification/phase7/. Safari/Firefox and new real-model operations benchmark inference were not separately tested; Ollama's new tool was exercised through a mocked provider with actual deterministic benchmark retrieval.
