# Phase 6 implementation report

Base inspected: main at `6f0bc168c8db1d6928866c9931cd16b25f08dfaf`. Integrated historical analytics, stateful Standard chat, deterministic tools and static deployment were present and reused. Work is isolated on `feature/phase6-local-ai`.

## Changes

- New `scripts/local-ai.js`: loopback-only Ollama adapter, local model capabilities, bounded context, real NDJSON deltas, native tool calls, abort/timeouts, evidence checks and retry-compatible results.
- New `scripts/local-ai-tools.js`: strict schema registry wrapping existing scenario/operations/research/history functions and validated actions. Numeric inputs must come from the user or verified state; duplicate calls do not reapply deltas.
- `scripts/chat-ui.js` and `index.html`: compact Standard/Local AI settings, explicit opt-in, model selection, connection states, Stop, Retry, safe text rendering, source cards and existing app actions.
- New optional `scripts/serve_local.py`: same-origin loopback preview; no required hosted backend and no public model exposure.
- `scripts/build.py`: packages nine versioned JS modules and escaped setup help; build remains independent of runtime/model installation.
- Tests: 79 mocked Local AI scenarios, local-server validation, optional real runtime evaluator and optional browser QA. Existing suites and CI retained, Local AI suite added.
- Documentation: setup, model evaluation, architecture, personality, configuration, handoff and test report updated. No private system components or unrelated business data were copied.

## Results and limitations

Real installed qwen3.5:4b ran on M1 GPU and completed greeting/scenario/parking interactions. The separate six-turn sequence retained 35,000 tickets through 90% then 80% follow-ups, with one rejected malformed call and one verified wording fallback. The model is imperfect; numeric guards reduce risk but do not prove semantic correctness. Cards and sources remain authoritative. It is slow on the tested 8 GB machine; 10-/20-turn benchmarks are incomplete. See LOCAL_MODEL_EVALUATION.md for actual timings and failures.

Chromium browser checks passed using local preview and actual model discovery; streaming/error/cancel UI tests used synthetic inference responses. Other browsers and direct public-site local-network permissions remain unverified. Existing public-origin Ollama request was rejected, so the secure local preview is documented and implemented.

All automated regression suites, data integrity and static build pass. No new attendance records, model weights, paid API or cloud backend were added. Production main and the public GitHub Pages site remain unchanged pending PR review. This implementation provides optional local generative conversation, not generative service for all website visitors.
