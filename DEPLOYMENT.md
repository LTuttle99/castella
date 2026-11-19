# Castella GitHub Pages deployment

Repository: https://github.com/LTuttle99/castella

Website: https://ltuttle99.github.io/castella/

Build: `python3 scripts/build.py`. Serve locally with `python3 -m http.server 8000 --bind 127.0.0.1`. The production artifact is `dist/`; it contains index.html, seven scripts and the validated data/processed export/manifest. All runtime paths are relative and support /castella/.

Pull requests run validate.yml: all four JavaScript suites, Python tests, historical asset integrity and the production build. Main runs the same checks before deploying dist/ through the existing configure-pages, upload-pages-artifact and deploy-pages Actions. Pages publishing source remains GitHub Actions. No external data download, backend, API secret or paid provider is needed during normal deployment.

To update: create a branch from current main, edit the application, run every command listed in README.md, verify browser behavior, open/review a PR, and merge after validation. Main then deploys automatically. A successful merge alone is not deployment evidence: confirm the Pages job succeeded and open the public site.

Data refresh is separate. Run attendance_pipeline.py in a network-enabled development environment, inspect source rights and generated quality/provenance, explicitly approve any changed source checksum after review, and submit the validated assets in a PR. Failed downloads and invalid data must not replace approved exports. Never publish raw restricted research material or API credentials.

Phase 4 and Phase 5 integration/release commits, conflicts and verification are recorded in INTEGRATION_RELEASE_REPORT.md.
