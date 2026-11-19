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

Browser testing used a desktop viewport. A dedicated mobile viewport and assistive-technology audit were not available in this run. Reduced-motion behavior is supported in CSS and JavaScript but was not browser-emulated. No public historical dataset or chart is available. GitHub Pages deployment succeeded. The public site was opened and its assistant calculation, operations page, branding, and clean console were verified.
