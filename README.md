# Castella

*Smarter crowds. Better game days.*

**NFL Attendance Intelligence & Stadium Operations Assistant**

Castella is a browser-based NFL attendance research and game-day planning demo. It distinguishes evidence from scenarios and does not claim to forecast future games with the original study's model.

## Run

Open `index.html` in a modern browser, or serve this folder with `python3 -m http.server 8000` and browse to `http://localhost:8000`. No install, sign-in, API key, or backend is needed. The app uses browser JavaScript and local storage for saved scenarios, tone preference, and achievements. On the same origin, legacy `cc_*` values migrate to `castella_*` keys on first run. A Google Fonts import is optional for typography. Core features work with system fallback fonts when offline.

## Included

- Research summary and comparison of the three reported cross-validated MAEs.
- Deterministic research assistant with source labels and ticket-utilization arithmetic.
- Low, expected, and high scenario simulator with optional capacity check.
- Assumption-based staffing, concession, parking, and entry throughput calculations.
- Locally saved scenario comparisons and achievements.
- Research and limitation notes.
- Multi-turn assistant context, explicit no-show/show-up parsing, three tones, ambiguity clarification, and deterministic calculations.
- Optional nflverse schedule retrieval and normalization script with provenance output.

## Important boundary

The poster title “Forecasting NFL Game Attendance” was supplied, though its file was not present in the inspected workspace. No game-level source dataset, notebook, trained estimator, validation predictions, or stadium operating ratios were provided. The 35,000 tickets at 90% utilization example is arithmetic based on an explicit assumption. No public NFL utilization rate or new prediction is claimed.

See [IMPLEMENTATION_AUDIT.md](IMPLEMENTATION_AUDIT.md), [DATA_SOURCES.md](DATA_SOURCES.md), [MODEL_VALIDATION.md](MODEL_VALIDATION.md), and [DEPLOYMENT.md](DEPLOYMENT.md). Run `node tests/test_scenario.js`, `python3 -m unittest discover -s tests -v`, and `python3 scripts/build.py` to test and create `dist/`.

## GitHub publication

Repository: https://github.com/LTuttle99/castella

The GitHub Actions workflow in `.github/workflows/deploy.yml` tests and builds the site into `dist/`, then deploys GitHub Pages on every push to `main`. The configured site address is https://ltuttle99.github.io/castella/ (publication verification is recorded in DEPLOYMENT.md).

## Historical NFL Attendance Explorer (Phase 4 branch)

Analytics includes an independent TidyTuesday reported-attendance explorer for 2000–2019 with team/location, season-range, and metric controls. Four charts show trends, team comparisons, team-week distributions, and coverage. Historical answers are calculated from local static records with sample counts and sources. Ask “What was the average reported attendance for the Colts in 2015?” and follow with “How many games are included?” Season home totals and home/away weekly averages are distinct metrics. The simulator can compare a selected historical mean with illustrative arrivals without inferring no-shows.

Refresh: `python3 scripts/attendance_pipeline.py` (cached), or `--refresh`. An already downloaded file can be supplied with `--input /path/attendance.csv`. Invalid source records fail before exports are replaced. Source checksum changes require inspection and explicit --approve-source before the manifest is replaced. Normal builds never download data. Verify with `python3 scripts/attendance_pipeline.py --check`, `node tests/test_history.js`, the original test commands, and the production build. Raw downloads remain ignored; only data/processed is published. See DATA_DICTIONARY.md and DATA_QUALITY_REPORT.md.
