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
