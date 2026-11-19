# Castella implementation audit

## Project inspected

The available project is a static site in `outputs/castella/`. The product runs from one `index.html` file with inline styling and JavaScript, plus `scripts/scenario.js`, a Python schedule importer, two test files, and a static build script. There is no package manifest, server, backend, hosted database, model endpoint, raw research data, validation prediction file, or trained estimator in the inspected project. A read-only review of the authorized utility repository found general-purpose tools but no compatible NFL attendance assistant, knowledge base, or operating calculator to reuse. All Castella-specific parsing, retrieval, calculations, simulator behavior, and UI were implemented in this project. No private business data was copied.

## Initial-state findings

| Feature | Evidence inspected | Initial finding |
|---|---|---|
| Research dashboard | `index.html`, inline research/model data | Rendered a small set of supplied study summary values. No underlying observations were loaded. |
| Simulator | Inline `calc()` and form markup | Client-side ticket utilization arithmetic existed. It did not distinguish saleable inventory from capacity and did not persist stable scenario IDs. |
| Operations | Inline attendance formulas and editable input fields | Calculators existed, but minimum staffing, vehicle, inventory, and lane counts needed whole-unit ceiling rules and stronger validation. |
| Assistant | Inline `answer(q)` and local `research` entries | Keyword-based fixed responses, without robust context or clear no-show/show-up interpretation. No LLM was connected. |
| Personality | `#tone` selector | Response tone had limited effect. |
| Achievements | `achievementDefs`, `unlock()`, local storage | Triggers were too permissive in some cases and not all declared achievements were reliably achievable. |
| Celebrations | Toast and CSS motion preference | Confetti was absent. |
| Public data | No importer in the initial app | No public schedule or attendance ingestion existed. |
| Tests/build | No tests or build script in the initial app | No automated verification path existed. |

## Current implementation and verification

- `scripts/scenario.js` now parses varied ticket counts, show-up rates, no-show rates, fractions, and follow-ups. It stores current and previous scenario values and operational assumptions, asks for clarification when percentage change is ambiguous, and sends numerical results through deterministic arithmetic.
- The assistant uses local research retrieval with source labels, explicit evidence limits, tone-specific answers, contextual comparisons, parking explanations, and a simulator transfer action. It is a deterministic local assistant. No generative model is configured.
- The simulator separates ticket basis, assumed utilization, expected arrivals, capacity, and saleable inventory. It validates nonnegative whole-count fields and bounded assumptions, orders utilization cases, warns on capacity overflow, saves stable-ID scenarios, supports deletion/reset, and can receive chatbot scenarios.
- Operations calculators use `Math.ceil()` for whole-resource estimates. Invalid denominators, percentages, negative values, and extreme inputs produce a visible warning. Staffing, concessions, parking, and entry assumptions recalculate with attendance.
- Achievement triggers are tied to completing a simulation, saving multiple utilization values, saving a valid ticket-inventory sellout scenario, interacting with analytics, changing assumptions in all four operations groups, and opening a research card. Browser checks verified all six achievement triggers, including Operations Manager and Research Rookie after their event bindings were fixed.
- Sellout celebrations use confetti and a toast, honor reduced-motion CSS settings, and track the last celebrated ticket/inventory pair to avoid repeat celebrations for unchanged inputs.
- `scripts/ingest_public.py` normalizes, deduplicates, and reports provenance for an nflverse schedule release. The live download attempt failed because DNS resolution was unavailable. No data were obtained, so no historical attendance chart is claimed.
- The research prompt supplies the poster title “Forecasting NFL Game Attendance.” The poster file itself was not present in the inspected workspace. The original notebook, estimator, validation predictions, and supplemental historical dataset were also not present.
- `tests/test_scenario.js` covers 45 parser and conversation assertions. `tests/test_ingest_public.py` covers two normalization and deduplication cases. `scripts/build.py` validates JavaScript syntax and emits `dist/`.
- Local browser testing confirmed the app title and Castella identity, section navigation, multi-turn no-show arithmetic and comparisons, simulator transfer/save, capacity warning, model comparison metrics, operations outputs, and same-origin migration of legacy scenarios/achievements. Remaining browser limits are listed in `TEST_REPORT.md`.

## Brand and data persistence

The user-facing app and documentation are named Castella, with the tagline “Smarter crowds. Better game days.” On the same browser origin, saved scenario, tone, achievement, and celebration state is copied from legacy `cc_*` storage keys to `castella_*` keys. Legacy key names remain in migration code solely to preserve user data.
