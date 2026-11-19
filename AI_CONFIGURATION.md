# Browser AI update — 19 November 2026

Castella now includes opt-in **Browser AI**, using self-hosted WebLLM 0.2.89 and a pinned 278 MB Qwen 0.5B model download. No installation, paid API or inference backend is required. Standard remains the default; Ollama remains optional. See [BROWSER_AI.md](BROWSER_AI.md) for setup, architecture, privacy, limitations and test evidence.

Browser factual routing uses the existing deterministic engine; the small model composes explanations, not arithmetic or model-selected tools. Verified cards/state/actions remain authoritative. Real Chromium GPU inference was tested, and weak generated wording triggered verified fallbacks. No broad device compatibility or large-model quality is claimed. Model assets are fetched only after explicit Download & enable, including on return visits. Stop/cancel/unload release the worker; browser caching and scoped deletion are supported.

## Earlier Phase 6 release notes

# Castella AI configuration

Standard is the reliable default: the deterministic assistant runs entirely in the browser, with no model installation or inference requests. Phase 6 adds explicitly opt-in Local AI using the visitor’s own loopback Ollama service. No paid API, login, commercial credential, mandatory backend or cloud provider is configured.

Use `python3 scripts/serve_local.py` and open http://127.0.0.1:8765/. Open Assistant → Local AI settings, choose Local AI and click Connect. Select an installed local completion model with tool support. Settings persist; every page load requires a fresh explicit connection. Chat remains in page memory and is cleared by New/Clear conversation.

The default direct endpoint is http://127.0.0.1:11434. Only HTTP loopback hosts are accepted; an optional same-origin `/ollama` adapter is available in the local preview. Model names and metadata indicating remote/cloud inference are rejected. No model download happens in the app. Never expose Ollama publicly or use wildcard allowed origins.

See [LOCAL_AI_SETUP.md](LOCAL_AI_SETUP.md) for operating-system instructions, [OLLAMA_INTEGRATION.md](OLLAMA_INTEGRATION.md) for privacy and trust boundaries, and [LOCAL_MODEL_EVALUATION.md](LOCAL_MODEL_EVALUATION.md) for observed performance. A local model on this development Mac is not available to public-site visitors. GitHub Pages continues to support Standard independently of Ollama.
