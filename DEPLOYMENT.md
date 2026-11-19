# GitHub Pages deployment

Repository: https://github.com/LTuttle99/castella

Configured site: https://ltuttle99.github.io/castella/

Pages source is GitHub Actions. `.github/workflows/deploy.yml` runs on pushes to main and manual workflow dispatch. It uses Python 3.12 and Node 22, executes both test suites, runs `python3 scripts/build.py`, checks the output, uploads `dist/`, and deploys to the github-pages environment. Source script URLs are relative and work under `/castella/`.

For future changes, clone the repository, edit the source, run the tests and build, commit, and push to main. Check Actions for the deployment result. The production artifact contains index.html and scripts/scenario.js. No secrets, raw research materials, or downloaded datasets are published.

The first workflow passed tests/build and failed at configure-pages before Pages was enabled. Pages was enabled and the failed job restarted. The restarted workflow succeeded. The public URL was opened and verified: branding, assistant 35,000 × 90% = 31,500, operations outputs, and no console warnings/errors. Mobile viewport testing was not performed.

## Phase 4

Phase 4 release safety: validate.yml checks pull requests without Pages permissions. Normal deployment continues to use deploy.yml on main, with additional historical JS tests and export integrity checks. Build uses approved data/processed assets and never runs live ingestion. Review source rights and generated provenance before approving refreshes. A failed download cannot replace an existing export. Merge the Phase 4 pull request only after checks succeed; main then redeploys automatically.
