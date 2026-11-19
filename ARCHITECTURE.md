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
