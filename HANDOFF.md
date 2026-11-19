# Phase 7 operations research — review branch

The separate Browser AI upgrade was merged in PR #7 and successfully deployed to GitHub Pages; actual public-browser model loading and conversation were verified. Phase 7 builds on that production release and is prepared on feature/phase7-operations-research for its own review, not automatically deployed.

The pre-change audit, 17 scoped reference records, four-source provenance, explicit role-cost formulas, custom gross spending, user-defined sensitivity, benchmark/source controls and contextual assistant are documented in PHASE7_IMPLEMENTATION_REPORT.md and OPERATIONS_RESEARCH.md. Missing empirical inputs remain labeled assumptions; unsupported benchmark modes are unavailable. No historical attendance bytes were changed.

Current validation: 42 operations JS cases, 80 Ollama mock scenarios, 24 Browser AI cases, original JavaScript suites, 20 Python tests and offline build/data checks. Browser results and the PR link are appended after verification. Production deployment remains the existing main-only GitHub Actions workflow. No source collection is needed for a normal build.

## Earlier release notes

# Browser AI update — 19 November 2026

Castella now includes opt-in **Browser AI**, using self-hosted WebLLM 0.2.89 and a pinned 278 MB Qwen 0.5B model download. No installation, paid API or inference backend is required. Standard remains the default; Ollama remains optional. See [BROWSER_AI.md](BROWSER_AI.md) for setup, architecture, privacy, limitations and test evidence.

Browser factual routing uses the existing deterministic engine; the small model composes explanations, not arithmetic or model-selected tools. Verified cards/state/actions remain authoritative. Real Chromium GPU inference was tested, and weak generated wording triggered verified fallbacks. No broad device compatibility or large-model quality is claimed. Model assets are fetched only after explicit Download & enable, including on return visits. Stop/cancel/unload release the worker; browser caching and scoped deletion are supported.

## Earlier Phase 6 release notes

# Castella Phase 6 handoff

Implemented optional local Ollama generative conversation around the existing Standard engine. Standard remains default and works without Ollama. Local AI requires explicit opt-in and Connect on each page load; the visitor must run their own compatible local model. No paid or cloud inference service is configured.

The new provider handles discovery, model selection, streamed responses, Stop, loading/error states, timeout and malformed data. A strict registry routes calculations, historical retrieval and actions through existing trusted functions. Source cards and user-triggered simulator/analytics navigation are preserved. Structured state and a bounded transcript support follow-ups; the model cannot rewrite verified memory. Local preferences persist, raw chat does not.

Verified: 79 mocked Local AI cases, all pre-existing regression suites, 14 Python tests, data integrity and production build. Chromium verified navigation, model discovery, Standard context, mocked generation/cancel/failure, mobile layout and safe rendering. Actual local qwen3.5:4b generated replies and tool calls succeeded; a six-turn sequence also exposed one malformed call and one wording fallback. See TEST_REPORT.md and LOCAL_MODEL_EVALUATION.md for precise limits. 10-/20-turn benchmarks remain incomplete after severe memory pressure on the 8 GB M1. No Safari/Firefox or public HTTPS-to-local browser compatibility claim is made.

Start with `python3 scripts/serve_local.py`; open http://127.0.0.1:8765/ and connect in Assistant settings. The app uses an already installed local model; it does not pull weights. See LOCAL_AI_SETUP.md for installation and OS-specific configuration. Do not expose Ollama or wildcard its origins.

Release: feature/phase6-local-ai targets main through a pull request. Do not merge until checks/review are complete. The public website has not been updated by this branch. Model quality, long-run performance and additional browser coverage remain review items.

## Earlier integrated release handoff (historical)

# Castella integrated handoff

The integrated application combines Phase 4's validated TidyTuesday attendance dataset, four charts, filters, provenance and data checks with Phase 5's local conversation state, personality, deterministic tools, cards and app actions.

The assistant calculates real historical team/season results, retains the metric for year follow-ups, compares previous/current historical means, explains sample sizes and sources, and compares a historical metric with the active illustrative ticket scenario. It opens analytics with validated team, season-range and metric filters and can explain the selected chart. Casual conversation and all three tone modes remain available. No API or model service is connected.

The export has 638 team-seasons, 10,846 team-week observations, 638 missing weekly observations, 20 seasons (2000–2019), and 34 historical team/location labels. There are no verified unique-game IDs or paired ticket/scan records. Reported attendance is not gate-scan attendance or a measured no-show rate. Original research metrics remain separate and unchanged.

Ticket utilization, decimal assumptions, operations calculators, saved comparisons, legacy browser data migration, achievements and reduced-motion-aware celebrations are retained. Build/test/release evidence is recorded in TEST_REPORT.md and INTEGRATION_RELEASE_REPORT.md. Production publication is confirmed there only after the Pages workflow and public browser checks succeed.

## Phase 7 browser verification

Chromium 153 verified explicit wage selection and edited-wage reclassification, $2,666.08 labor from entered synthetic role/time/burden inputs, custom $12-per-attendee gross spending, sensitivity/invalid bounds, saved comparison, 17 source cards/links, year/scope labels, operations chat and follow-ups, no live third-party research requests, and 390px layout with no page errors. A simulated HTTP 503 confirmed missing evidence is acknowledged while custom labor, all navigation and Standard ticket chat still work. Original simulator/operations inputs, errors, achievements/persistence and reduced-motion behavior also passed browser regression. Historical data retained 638 team-seasons, 10,846 weekly slots including 638 missing (10,208 nonmissing); no historical data was altered. Source/evidence screenshots and logs are in verification/phase7/. Safari/Firefox and new real-model operations benchmark inference were not separately tested; Ollama's new tool was exercised through a mocked provider with actual deterministic benchmark retrieval.
