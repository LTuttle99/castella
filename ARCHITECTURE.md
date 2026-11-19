# Architecture

Castella is a static single-page application in `index.html`. Inline CSS provides responsive navigation and layouts. `scripts/scenario.js` parses attendance statements and maintains explicit conversational scenario state. Inline JavaScript owns navigation, deterministic calculations, local knowledge retrieval, assistant responses, achievement state, and saved comparisons. `scripts/ingest_public.py` is a separate optional public data pipeline. There is no backend or LLM integration.

## Information flow

User inputs → browser-side scenario calculation → visual outputs and operations estimates. Assistant questions → local keyword matching against a small structured knowledge list → fixed research-grounded answer with source label. There is no server, language model, external data fetch, or API credential.

## Reuse assessment

Research answers and simulator calculations run locally. No generative AI provider is connected.

## Persistence and privacy

Local storage holds saved scenarios, assistant tone, and earned achievements on the visitor's device. Chat history is held in page memory only. No account or remote service is used.

## Phase 5 dialogue modules

conversation.js manages pure state transitions and response composition; tools.js validates and calculates scenarios and resource estimates shared with the simulator; chat-ui.js renders text/cards and executes only validated app actions. Context stays in page memory. Static build emits these three scripts and scenario.js after syntax checks, and cleans stale output first. There is no API, backend or model service. See CONVERSATIONAL_ARCHITECTURE.md.
