# Phase 7 operations research — review branch

The separate Browser AI upgrade was merged in PR #7 and successfully deployed to GitHub Pages; actual public-browser model loading and conversation were verified. Phase 7 builds on that production release and is prepared on feature/phase7-operations-research for its own review, not automatically deployed.

The pre-change audit, 17 scoped reference records, four-source provenance, explicit role-cost formulas, custom gross spending, user-defined sensitivity, benchmark/source controls and contextual assistant are documented in PHASE7_IMPLEMENTATION_REPORT.md and OPERATIONS_RESEARCH.md. Missing empirical inputs remain labeled assumptions; unsupported benchmark modes are unavailable. No historical attendance bytes were changed.

Current validation: 42 operations JS cases, 80 Ollama mock scenarios, 24 Browser AI cases, original JavaScript suites, 20 Python tests and offline build/data checks. Browser results and the PR link are appended after verification. Production deployment remains the existing main-only GitHub Actions workflow. No source collection is needed for a normal build.

## Earlier release notes

# Phase 6 deployment notes

This branch adds optional Local AI assets to the existing static GitHub Pages build. It does not deploy a server or weights. `python3 scripts/build.py` produces `dist/` with no Ollama dependency. Existing GitHub Actions deployment remains main-only; Phase 6 must be reviewed and merged before publication. The local Python helper is a development/visitor preview only and must never be hosted publicly. Standard works on Pages without setup. Every visitor’s Local AI requires their own local runtime, explicit connection and browser compatibility; see LOCAL_AI_SETUP.md.

## Earlier deployment instructions

# Castella GitHub Pages deployment

Repository: https://github.com/LTuttle99/castella

Website: https://ltuttle99.github.io/castella/

Build: `python3 scripts/build.py`. Serve locally with `python3 -m http.server 8000 --bind 127.0.0.1`. The production artifact is `dist/`; it contains index.html, seven scripts and the validated data/processed export/manifest. All runtime paths are relative and support /castella/.

Pull requests run validate.yml: all four JavaScript suites, Python tests, historical asset integrity and the production build. Main runs the same checks before deploying dist/ through the existing configure-pages, upload-pages-artifact and deploy-pages Actions. Pages publishing source remains GitHub Actions. No external data download, backend, API secret or paid provider is needed during normal deployment.

To update: create a branch from current main, edit the application, run every command listed in README.md, verify browser behavior, open/review a PR, and merge after validation. Main then deploys automatically. A successful merge alone is not deployment evidence: confirm the Pages job succeeded and open the public site.

Data refresh is separate. Run attendance_pipeline.py in a network-enabled development environment, inspect source rights and generated quality/provenance, explicitly approve any changed source checksum after review, and submit the validated assets in a PR. Failed downloads and invalid data must not replace approved exports. Never publish raw restricted research material or API credentials.

Phase 4 and Phase 5 integration/release commits, conflicts and verification are recorded in INTEGRATION_RELEASE_REPORT.md.
