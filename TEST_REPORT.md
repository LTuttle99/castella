# Phase 6 verification — 19 November 2026

## Automated checks

All passing: 45 scenario/parser assertions; 64 Standard conversations / 174 turns; 20 historical assertions; 28 real-data integration tests; **79 Local AI mocked scenarios**; **14 Python tests** including local model/origin/request validation and asset-version checks; processed data integrity; static production build. CI runs the Local AI suite alongside every pre-existing suite. Model weights, Ollama and a paid API are not needed for CI or build.

Reproduce with the commands in README. `tests/local-ai-results.json` records the mocked outcomes. `scripts/evaluate_local_ai.js --real` is explicitly optional; see LOCAL_MODEL_EVALUATION.md for actual results and incomplete longer benchmarks.

## Browser verification

Headless Chromium 153.0.8010.12 tested the local-only preview at 1440 px and 390 px. Seven navigation destinations passed. Standard numerical follow-ups, safe rendering, mode persistence, no requests before opt-in, actual local tags/show and installed-model discovery passed. Synthetic local inference routes exercised generated labels, Stop, failure fallback retaining scenario context and Retry visibility. Simulator count/rate/bounds/capacity/inventory/definition/reset/save controls, all operating assumptions, negative-count and zero-denominator errors, action-earned achievement persistence, and reduced-motion sellout behavior also passed. No page errors or mobile document overflow were observed. Screenshots and test results are under `verification/phase6/`.

The in-app browser could not attach and the Chrome computer-use connector was unavailable; a temporary Playwright driver used the installed Chromium instead. This verifies Chromium only. Safari, Firefox, Windows/Linux browsers and HTTPS production-page local-network permission behavior have not been browser-verified. Actual public-origin metadata request returned 403 with the unchanged existing Ollama configuration. The same-origin local preview successfully discovered the real installed model.

Real local generated replies and native tool calls were tested separately in Node against the same adapter and installed model. Browser streaming/cancellation/error checks used synthetic responses, not a claim of real model generation through every browser. The six-turn real run included one rejected malformed call and one verified wording fallback; long-run quality remains limited.

## Evidence and remaining verification

The historical export remains 2000–2019, with 638 team-seasons and 10,846 weekly observations. Existing data provenance/integrity assertions pass. No new source download or current-year dataset is claimed. Reported attendance remains separate from ticket assumptions and physical gate scans.

The Phase 6 branch is not merged or deployed. Public GitHub Pages remains on the previous release. The build retains relative versioned assets and emits a local setup page. No model weights enter the artifact.

## Earlier release verification (historical)

# Castella integration test report

## Baselines and integration

Both PRs were open with passing validation at their inspected heads: Phase 4 81d036391369323362521b3921e60319bf454a54 and Phase 5 f5c5059479b25162d7ac5bfbb0f3946bcb5279bb. Production before release was 6626171c2b217aae742a58744aa795c9f5f5ef0d. Phase 4 was merged as d292571fda507f33c068a9920b5a307abf833c7a. Its main was merged into Phase 5 for explicit integration, preserving both histories.

Conflicts in index.html, build.py, both workflows and five shared documents were resolved by combining functionality. No phase was discarded. Data/provenance files and original research results were preserved.

## Automated checks

Commands: node tests/test_scenario.js; node tests/test_conversation.js; node tests/test_history.js; node tests/test_integration.js; python3 -m unittest discover -s tests -v; python3 scripts/attendance_pipeline.py --check; python3 scripts/build.py.

Coverage includes original ticket parsing, local dialogue/personality, historical aggregation, real-record historical context/source/denominators, missing data, ambiguity, chart action schemas, historical versus scenario comparisons, topic switching, schema/deduplication/reconciliation and pinned data integrity. The integration suite uses the actual approved static export rather than synthetic historical records. The separate existing fixture tests remain confined to tests.

The required live-data dialogue calculates Colts weekly means of 66,717.25 for 2015 (16 nonmissing team-week observations) and 68,763.125 for 2016 (16 observations), a change of 2,045.875. It does not claim verified unique games, gate scans or actual no-shows. Final command results, browser coverage and production release evidence are recorded in INTEGRATION_RELEASE_REPORT.md.

## Production and responsive correction

Combined PR #2 validation succeeded (run 44461838918); its production Pages workflow succeeded (44461906263, merge 7ae7635631dd304cda1ce12a4cdf40b931139b3a). Public checks confirmed the historical dialogue, provenance and sample counts, active ticket comparison, chart-filter actions, all navigation pages and an empty historical selection.

The final public mobile pass found a long-source-URL overflow. The follow-up CSS correction was tested against a source reply and a historical result card: document client width 375, scroll width 375. Desktop cards remained readable. No numerical, data, or workflow logic changed in that correction. See the integration release report and associated follow-up PR for the release evidence.

A further real-data regression verifies the exact historical-first dialogue using current simulator inputs without first creating a ticket scenario in chat. Integration suite: 28 tests.

Static asset regression: test_build_assets.py builds the real output, checks seven relative versioned script URLs against their file checksums, and checks the versioned historical data URL. Python suite: 11 tests. Browser verification of the versioned local artifact passed the historical-first simulator comparison.

## Optional browser reproduction

Start `python3 scripts/serve_local.py` separately. Install Playwright in a temporary directory with `npm install --prefix work/browser-qa playwright-core` and install/use a compatible Chromium. Then run `PLAYWRIGHT_MODULE=../work/browser-qa/node_modules/playwright-core CASTELLA_BROWSER_EXECUTABLE=/absolute/path/to/chromium node tests/test_browser_local.js` and the same command for `tests/test_browser_product.js`. The first script requires a running local tool-capable Ollama model for discovery, but mocks inference. Screenshots/logs are written to ignored `work/`. Neither browser script runs in offline CI.
