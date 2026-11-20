# Phase 9 architecture

The shell in `index.html` now has a profile gate, a welcome overlay and three views (Chat, Explore with five sections, and Settings). All element IDs used by the existing modules are preserved. `go()` maps legacy page names onto Explore sections. `scripts/profiles.js` (loaded first) owns profile selection, per-profile storage keys, storage-failure fallback and opt-in legacy import; inline code and `chat-ui.js` read and write through `window.castellaApp`. A `castella:profilechange` event reloads per-profile data without a page refresh.

Stadium operations has one arrivals basis (`castellaOpsArrivals()`): an optional override or tickets × utilization. The simulator, the operations calculators, the operating-costs module and Chat all use it. `chat-ui.js` renders typed cards, SVG charts and validated actions (`open`, `scenario`, `history`, and the new `operations` with arrivals/focus). Script order is profiles, scenario, tools, history, history-dialogue, operations-research, operations-dialogue, conversation, local-ai-tools, local-ai, inline app, history-ui, browser-ai, operations-ui, chat-ui.

# Phase 7 operations architecture

Static GitHub Pages remains the host. operations_pipeline.py collects explicitly, normalizes and checks source evidence; approved data/operations assets are bundled and content-versioned offline. Collection is never required in the browser or normal build.

operations-research.js is the pure validation/labor/spending/sensitivity core. operations-dialogue.js retrieves provenance and performs deterministic multi-turn cost explanations. operations-ui.js renders benchmark/custom controls, role inputs, source cards, sensitivity and comparisons. conversation.js calls the optional operations adapter before general parsing; it retains structured operations context and saved cost input receipts. chat-ui.js passes current source/assumption snapshots to the adapter. local-ai-tools.js exposes operations_research for Ollama; Browser AI composes around the same trusted result.

There are 13 versioned main JS modules, plus the versioned Browser AI worker and self-hosted WebLLM runtime. New operations modules sit after history-dialogue and before/after conversation as required; operations-ui loads before chat-ui. Existing simulator calc dispatches a scenario update so derived operations panels remain aligned. Invalid original inputs also refresh the new panel’s errors.

No source-backed benchmark is selected automatically. Editing a wage clears its research source classification. Counts/hours/burden remain user assumptions. Financial references retain annual scope and are never converted to per-fan defaults. All sourced text is inserted with textContent; original-source links are validated HTTPS hosts. Model actions remain allowlisted.

## Earlier integrated architecture

# Integrated Castella architecture

Castella remains a static single-page application in index.html, with responsive navy/lime styling and inline navigation/simulator/achievement logic.

## Modules

- scenario.js: existing ticket scenario parser.
- tools.js: validated deterministic scenario/comparison/operations functions, original research facts, and action schemas. Simulator and chat share operations formulas.
- history.js: pure selection, aggregation, distribution and historical query utilities.
- history-dialogue.js: historical entity/filter resolution, real-data lookups, previous/current results, source and denominator explanations, historical/scenario comparisons and chart action payloads.
- conversation.js: pure dialogue state transitions, context, personality and tool routing. The historical adapter runs before ticket parsing so season years cannot become ticket counts.
- history-ui.js: static data loading, four charts, filters and validated selection execution.
- chat-ui.js: accessible text/cards/chips, resets, keyboard input and allowlisted app actions.

Script order is scenario, tools, history, history-dialogue, conversation, inline app setup, history-ui, chat-ui. Relative data/script paths work under a project subpath. The historical loader supplies availability state, allowing honest retry messages if records are loading or unavailable.

## Data and build

attendance_pipeline.py downloads with caching/retries, validates the original schema and every row, reconciles weekly and season totals, deduplicates season fields, and writes a compact export with provenance and a checksummed manifest. Raw data stays outside the public build. The build verifies approved local assets, validates JavaScript syntax and emits a clean dist/ containing the HTML, all seven scripts and data/processed. It never downloads data.

## State and actions

Current/previous ticket and historical results, assumptions, pending clarifications, sources and conversation references stay in page memory. Existing localStorage holds scenarios, tone and achievements; legacy key migration is retained. Chat is not externally transmitted. Actions allow navigation, validated scenario transfer and validated historical team/range/metric selection. A selection must match real records before controls change. Text is rendered with textContent and never executed as code. No API, backend, account system or generative model is connected.
