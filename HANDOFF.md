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
