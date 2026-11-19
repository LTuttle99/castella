> Historical phase report. Its pre-integration availability/release statements are superseded by INTEGRATION_RELEASE_REPORT.md and TEST_REPORT.md.

# Phase 4 implementation report

## Owner summary

Castella can now explore genuine historical reported NFL attendance, filter by historical team and season, and answer supported attendance questions from locally bundled records. A reproducible pipeline checks every row and keeps the original research results separate. The site remains free and static. These changes are on a review branch; the production website has not been changed by Phase 4.

## Implementation

New files: scripts/attendance_pipeline.py, scripts/history.js, scripts/history-ui.js, tests/test_attendance.py, tests/test_history.js, data/processed/attendance.json, data/processed/manifest.json, DATA_DICTIONARY.md, DATA_QUALITY_REPORT.md, DATA_PROVENANCE.json, and .github/workflows/validate.yml. Existing index.html, build.py, deployment workflow, .gitignore, README, source/architecture/model/handoff/test/deployment docs were updated. No existing feature was removed.

The successful source was TidyTuesday 2020-02-04 attendance.csv, retrieved through the authorized GitHub connector. CC0 repository license and upstream Pro Football Reference attribution were inspected. Only a compact derived export is bundled. Raw research assets, external model files, credentials, and raw downloaded CSVs are excluded.

Validated: 10,846 team-week observations; 638 team-seasons; 20 seasons, 2000–2019; 34 historical city/name labels. Zero invalid rows and zero duplicates. The 638 missing weekly values remain null. All home + away totals and all nonmissing weekly sums reconcile. No joins were performed, so no verified unique-game counts or ambiguous match statistics are claimed. See provenance for checksum and retrieval timestamp.

Four charts use deterministic computations: seasonal means, team comparison, team-week distribution, and nonmissing coverage. Filters apply historical team/location, start/end season, and metric. Empty/invalid selections clear results. Chatbot supports team-season weekly means, season totals, comparisons, changes between endpoints, rankings, sample sizes, source follow-ups, and metric limitations. Historical context does not pass years into ticket-count parsing. The simulator can compare the selected historical mean with assumed arrivals, with explicit measurement caveats.

## Integrity and release

Production baseline: 6626171c2b217aae742a58744aa795c9f5f5ef0d. Remote feature/phase4-attendance-data branches from that commit. No production branch overwrite or force-push. Local Git fetch failed DNS; GitHub connector Git APIs preserve remote parent history. Pull requests run validate.yml, while main retains the existing Pages deploy.yml model. Normal builds use validated local assets and never download data. Source changes require explicit review/approval; malformed data or export-manifest mismatch fails the build.

All available original and new tests and the build passed. Browser checks covered historical chart loading, Colts 2015 filtering, historical answer 66,717.3 across 16 observations, follow-up denominator, comparison with 31,500 simulated arrivals, missing-data state, mobile width 375, legacy scenario visibility, and clean dist console. A screenshot was saved alongside the project output. Full assistive-technology and all older interactive-feature regressions were not repeated.

## Limitations and next data needs

nflverse CSV download failed DNS despite accessible release metadata. No game mapping, home-game denominator, unique-game rankings, or weather enrichment is claimed. The additional research repository explicitly warns of unclear original dataset redistribution rights, so its raw records were excluded. Original trained estimator and validation predictions remain unavailable. The historical source's attendance definition is not proof of physical attendees or gate scans. Historical relocations retain their source city/name rather than being combined silently.

For a stronger next release, obtain licensed unique-game records with dates, home/away identity, stadium history, and documented attendance definitions. Paired tickets and scans would be needed to study actual no-shows. Original research artifacts would be needed to reproduce the reported model results. Phase 4 should be merged only after review; production live verification follows that release.

Pull request: https://github.com/LTuttle99/castella/pull/1. Merge instructions: review Files changed and source rights/provenance, wait for Validate Castella changes to pass, then select Merge pull request. Main automatically deploys to Pages. No Phase 4 production merge has been performed.
