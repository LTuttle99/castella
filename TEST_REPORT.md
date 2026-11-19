# Test report

## Automated checks

- `node tests/test_scenario.js` passed 45 assertions across ticket-count and rate phrases, no-show conversion, clarification on ambiguous relative changes, multi-turn scenario updates, previous-scenario comparisons, and parking follow-ups.
- `python3 -m unittest discover -s tests -v` passed 2 tests for schedule normalization, deduplication, and missing/invalid reported attendance handling.
- `python3 scripts/build.py` passed JavaScript syntax checks for the inline app and scenario module, then wrote `dist/index.html` and `dist/scripts/scenario.js`.

## Browser checks

- Started the app on localhost and visited Overview, Assistant, Analytics, Ticket simulator, Operations, Research & sources, and Achievements.
- Verified “35,000 tickets, 10% won’t show up” produces 31,500 arrivals. A follow-up at 80% show-up yields 28,000, and a comparison question reports 3,500 fewer arrivals.
- Verified assistant-to-simulator transfer, scenario saving, delete controls, distinct-rate No-Show Detective unlock, and Full House unlock for an entered inventory match within capacity.
- Verified Operations Manager unlocks after editing assumptions in all four tool groups, and Research Rookie unlocks after opening a research knowledge card.
- Verified capacity/inventory conflict shows a warning and suppresses sellout celebration. A valid entered inventory match shows the sellout message and confetti when reduced motion is not requested.
- Confirmed legacy scenario and achievement data migrated on the same browser origin.
- Checked operations outputs for 28,000 arrivals: staffing 124, parking 7,280 vehicles, and 8 entry lanes under displayed assumptions.
- Confirmed model comparison values: 4,401, 4,344, and 3,045 MAE.
- The generated `dist/` app was opened over localhost and its assistant returned the correct 31,500-arrival result for 35,000 tickets with 10% no-shows. A fresh source and production page load produced no browser console warnings or errors. An earlier initialization error from a prior development iteration remained in the older tab's captured log and did not reproduce on a clean load.
- Re-ran the nflverse download; DNS resolution failed and no dataset was written.

## Limits

Browser testing used a desktop viewport. A dedicated mobile viewport and assistive-technology audit were not available in this run. Reduced-motion behavior is supported in CSS and JavaScript but was not browser-emulated. Phase 4 adds a validated supplemental dataset and explorer on its development branch. GitHub Pages deployment succeeded. The public site was opened and its assistant calculation, operations page, branding, and clean console were verified.

## Phase 4 verification

Baseline production SHA: 6626171c2b217aae742a58744aa795c9f5f5ef0d. Baseline build, 45 scenario assertions, and 2 Python tests passed. Local Git had no commits and all source files were untracked from prior connector publication. The remote feature branch was created from the exact production commit. Local Git fetch failed DNS; remote history is preserved using GitHub Git object APIs.

Commands passing after implementation:

- node tests/test_scenario.js — 45 assertions.
- node tests/test_history.js — historical aggregation and conversational assertions.
- python3 -m unittest discover -s tests -v — 10 tests.
- python3 scripts/attendance_pipeline.py --check — pinned export checksum, schema, record count, uniqueness, coverage and metric integrity.
- python3 scripts/build.py — all JS syntax plus data integrity; includes static data and historical scripts in dist.

Browser verified source and dist at localhost, including a nested /dist/ path. Analytics loaded all four charts. Team=Indianapolis Colts, season=2015, metric=weekly updated every chart to mean 66,717.3, n=16 nonmissing team-week values, one missing value. Chatbot computed the same figure, then answered the sample-size follow-up with retained context. Simulator comparison displayed 31,500 illustrative arrivals and the correctly labeled 35,217.3 numeric difference. Legacy saved scenarios remained visible. The explorer was checked at 375×812 with readable single-column controls; the viewport was restored. The dist console reported no warnings or errors.

Synthetic fixtures are confined to tests. Original research metrics remain unchanged. Game-specific rankings, verified home-game means, weather, assistive-technology testing, and exhaustive regression of every older UI action remain outside verified coverage. Phase 4 is not deployed to production pending pull-request review.

The missing-data state was browser-verified for Los Angeles Chargers in 2000–2001. The app displayed the exact unavailable-records message and cleared the charts.
