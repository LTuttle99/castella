# Ollama integration

## Reused and new code

The existing `conversation.js` structured state, scenario parser, `tools.js` calculations, historical adapter and validated app actions are reused. No other private system or business data was copied. New `local-ai.js` implements model discovery, capability checks, native tool calling, NDJSON streaming, cancellation, timeouts, bounded context and local endpoint validation. New `local-ai-tools.js` provides 10 allowlisted tool schemas. `chat-ui.js` integrates these with existing cards, personality and scenario/analytics navigation.

The model interprets requests and composes prose. Trusted browser functions execute calculations and retrieve actual historical records. The model cannot execute code, fetch URLs, inspect files, access shell commands or save a scenario automatically. Tool actions become validated buttons. Each request permits at most four unique tool calls and three inference rounds. A request ledger prevents repeated delta application and permits safe retry. Failed generation leaves the UI able to answer through Standard.

## State and evidence

Every request sends a system prompt, a bounded verified state snapshot, up to 1,800 characters of recent conversation (350 characters per message), the current user message and tool schemas. Tool results and source metadata are returned for explanation. The snapshot includes ticket assumptions, current/previous calculations, operating assumptions and historical selection/results. It excludes local files, credentials and unrelated business data. A model-written summary never updates verified state. Generated prose is checked against numeric literals from tool evidence; unrecognized quantities/URLs and selected integrity violations use the verified result instead. This is a defensive filter, not a proof of semantic truth. The verified card remains authoritative.

Raw chat is not persisted or logged by the app or local preview. Local preferences contain only endpoint, model and mode. Ollama itself is separately installed software with its own configuration. No third-party inference endpoint is supported. Existing Google Fonts typography requests carry no conversation payload.

## Connection boundaries

The adapter accepts HTTP 127.0.0.1, localhost or IPv6 loopback only, with no credentials/query/fragment. `/api/tags` lists installed local GGUF models; `/api/show` must report completion and tools capabilities. Remote/cloud metadata or names are excluded. `/api/chat` uses streaming, `think:false`, context 4096, output limit 384 and two-minute residency. Hidden reasoning is not shown.

The optional Python preview binds 127.0.0.1 only. It serves `dist/` and proxies only tags/show/chat to fixed local Ollama; exact Host/Origin and cross-site checks prevent arbitrary website access. It bounds request size, roles and inference options. It exposes no model download/delete/filesystem routes, adds no wildcard CORS and does not alter Ollama settings. A disconnect closes the upstream stream; model-runtime cancellation timing is runtime dependent.

GitHub Pages requires no server change. Direct HTTPS-page to local HTTP access depends on browser permissions and exact Ollama origin configuration. The existing runtime rejected the production origin with HTTP 403; that setting was not changed. The supported alternative is the same-origin loopback preview.

Official interfaces: https://docs.ollama.com/api/chat, https://docs.ollama.com/api/tags, https://docs.ollama.com/api/streaming, https://docs.ollama.com/capabilities/tool-calling, https://docs.ollama.com/faq.
