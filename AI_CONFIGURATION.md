# AI configuration — no API

The project owner explicitly requested **no API** during Phase 5. There is no provider integration, API gateway, model endpoint, API key, server deployment, paid usage, or external chat transmission in this implementation. No .env file or visitor credential is needed.

Run the static app with `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/. Build with `python3 scripts/build.py`. All conversation handling and calculations run locally in the browser. Google Fonts remains an optional existing typography request; it does not receive chat content.

Castella must be described as a local conversational research and calculation assistant. Genuine generative AI is not active. Unrestricted natural conversation remains an outstanding capability, deliberately not addressed with a hosted model under the no-API instruction. A model integration would require a separate future decision and authorization; there are no activation steps or paid services to configure for this release.
