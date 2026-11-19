# Deployment

Castella is a static application. Its build output contains `index.html` and `scripts/scenario.js`.

## Build and preview

Run `python3 scripts/build.py` from this directory. Preview the source with `python3 -m http.server 8000 --bind 127.0.0.1`, then open `http://localhost:8000`.

## GitHub Pages

1. Push the project to a GitHub repository.
2. Run `python3 scripts/build.py`.
3. Publish the contents of `dist/` using a GitHub Pages Actions workflow, or copy `dist/` into a `/docs` directory on the deployment branch.
4. In repository Settings, open Pages and select that workflow or branch and `/docs` folder.
5. Open the resulting Pages URL and verify navigation, scenario calculations, assistant answers, and local storage.

No backend, sign-in, visitor API key, or secret is needed. The optional nflverse importer needs outbound network access. The production build succeeds, but no public deployment was performed or verified.
