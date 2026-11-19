# Castella Phase 4 + Phase 5 integration and release

## Strategy and history

Both PRs were inspected while open, including their latest successful validation, changed-file lists, data pipeline, scripts, shared HTML/build/workflows, tests and documentation. Phase 4 head: 81d036391369323362521b3921e60319bf454a54. Phase 5 head: f5c5059479b25162d7ac5bfbb0f3946bcb5279bb. Original production baseline: 6626171c2b217aae742a58744aa795c9f5f5ef0d.

Following the owner's integration/release instruction, PR #1 was merged as d292571fda507f33c068a9920b5a307abf833c7a. The new main was merged into Phase 5. Actual conflicts occurred in index.html, scripts/build.py, deploy.yml, validate.yml, README, ARCHITECTURE, HANDOFF, TEST_REPORT and DEPLOYMENT. They were resolved by combining both phases rather than selecting an entire branch's file. No force-push or unrelated branch changes were used.

## Combined functionality

The validated 638-team-season / 10,846-team-week TidyTuesday export, provenance, filters, charts, schema/manifest integrity and source definitions are retained. history-dialogue.js connects real records to Phase 5's structured state and personality. Historical team, year, metric, source/sample follow-ups and comparisons remain separate from ticket scenarios. A historical-versus-scenario reply uses the active ticket scenario and explicitly distinguishes reported attendance from illustrative physical arrivals. Ambiguous relocations ask for a historical city. No unique-game counts, scans, historical no-show rates, home-game averages or weather records are invented.

Validated actions open analytics and set an available historical team, season range and metric. The executor verifies real records before changing controls. It can also explain selected chart filters and transfer immutable ticket scenarios. Local-only conversation, all three tone modes, casual detours, saved comparisons, legacy storage migration, achievements and confetti remain. There is no API, backend, paid model or external transcript storage.

## Files changed in integration

Shared HTML, build script, deployment/validation workflows and consolidated docs were resolved. conversation.js, tools.js, chat-ui.js and history-ui.js were connected. New files are scripts/history-dialogue.js, tests/test_integration.js and this report. Original data/provenance assets and source-specific tests are preserved. Prior phase implementation reports are labeled historical and point to the current integrated reports.

## Validation before combined release

Passed commands:

- node tests/test_scenario.js — 45 parser assertions.
- node tests/test_conversation.js — 64 conversations / 174 turns plus tool/action/personality invariants.
- node tests/test_history.js — 20 historical aggregation/conversation assertions.
- node tests/test_integration.js — 27 real-data integration tests.
- python3 -m unittest discover -s tests -v — 10 tests.
- python3 scripts/attendance_pipeline.py --check — export/schema/checksum/count/coverage integrity.
- python3 scripts/build.py — clean integrated build with seven modules and approved local data assets.

The nested /dist/ localhost build was browser-tested on desktop and 375×812 mobile. Verified all seven navigation pages, original research values, chart loading and filters, required historical conversation, provenance and denominator follow-ups, chat actions updating charts, selected-chart explanation, 35,000 × 90% = 31,500, operations outputs (139 staffing, 35,501 inventory items, 8,190 vehicles, 9 lanes under defaults), existing earned achievements and saved scenarios. A temporary saved test scenario was added via keyboard and deleted, leaving the prior saved rows intact. The console reported no warnings/errors. Actual public release verification is recorded below only after successful production deployment.

## Limitations

The assistant remains bounded deterministic local software, not generative AI. Historical weekly observations can include both teams' appearances in one game and have missing values. Their figures are not verified unique physical attendees. Supplemental records are separate from the original 5,104-game research sample. Full assistive-technology testing and a new exhaustive check of all achievement/confetti combinations were not repeated. Dataset refreshes remain separately reviewed; normal builds do not download data.

## Production release evidence

PR #1 merged as d292571fda507f33c068a9920b5a307abf833c7a. PR #2's integrated head 80e912d2eda4b56fb2a51b84929002057955c99a passed validation run 44461838918, then merged as 7ae7635631dd304cda1ce12a4cdf40b931139b3a. Production Pages workflow 44461906263 succeeded.

The public https://ltuttle99.github.io/castella/ was independently opened and the required Colts 2015/2016 comparison, sample/source follow-ups, historical-versus-31,500-arrivals comparison and chart-selection actions were exercised. All seven navigation destinations and an unavailable historical selection were checked publicly. No API or credentials are required.

A final public mobile check exposed a long-source-URL overflow (scroll width 579 at viewport width 375). A focused follow-up limits chat/grid minimum widths, wraps long text, and uses equal bounded result-card columns on desktop and a single column on mobile. The corrected production artifact was browser-checked locally with the same source-and-follow-up sequence: viewport width 375 and scroll width 375, with readable wrapped cards. It also passed desktop visual inspection and the production build. This corrective release is tracked separately rather than concealing the discovered defect.

The historical-first conversation also supports comparing with the currently selected simulator inputs before a separate chat ticket scenario exists. A validated simulator snapshot is used as fallback; active chat scenarios retain priority, and invalid or mismatched counts still require clarification. The added real-data regression brings integration coverage to 28 tests.

The final public reload test exposed stale browser script behavior even while unauthenticated HTTP retrieval showed the corrected JavaScript on the server. The build now gives each emitted script a content-derived version query, and the history loader uses a content-versioned data URL. Asset paths remain relative. A new build-output test verifies all seven query versions against emitted bytes and the data version against the approved export. Final Python coverage is 11 tests. The historical-first dialogue passed in the browser against this versioned artifact, including 31,500 arrivals without a separate chat scenario setup.
