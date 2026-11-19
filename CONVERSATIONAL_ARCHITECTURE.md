# Phase 6 conversational architecture

The existing Standard engine remains the default. Local AI adds an Ollama provider around the same structured scenario, historical and operating state. `local-ai-tools.js` validates model arguments, executes approved frontend tools and returns provenance and cards. `local-ai.js` passes results back for model explanation, bounds the transcript and rejects unsupported numerical wording. `chat-ui.js` commits a completed result once, handles Stop, retry, new/clear chat, mode/model selection and Standard fallback.

No request is sent before explicit Connect. The mode preference persists without automatically reconnecting. Single-flight generation prevents duplicate sends; epochs discard late canceled responses. Retries replace the assistant message for that turn and reuse the tool ledger. Newer state disables stale retry. State is page memory; saved simulator scenarios and achievements remain in their existing browser stores.

See OLLAMA_INTEGRATION.md for the trust boundary and LOCAL_MODEL_EVALUATION.md for tested quality and limitations. The 79 mocked cases test the integration deterministically; actual model quality requires the separate optional runtime evaluation.

## Earlier Standard architecture

# Integrated conversation architecture

conversation.js manages pure structured dialogue state and personality; tools.js provides verified deterministic scenario and operations tools. chat-ui.js renders structured replies and executes only allowlisted actions. scenario.js remains the existing parser. history.js aggregates approved records and history-dialogue.js adapts those records into conversational answers and source-specific context.

On each message the UI injects a historical adapter backed by the locally loaded export, current chart filters and loader status. Historical questions and follow-ups are resolved before scenario parsing. Current/previous team, season, metric and result are preserved separately from current/previous ticket scenarios. Source and denominator requests reuse the current historical result. Year changes retain team and metric. Comparisons use actual sample means and valid denominators; missing/ambiguous records request clarification or return an unavailable state.

Historical actions carry validated team, start/end seasons and metric. The executor checks real records, sets all matching controls, re-renders charts and opens Analytics. Scenario actions carry immutable validated snapshots and update the simulator and active chat scenario. Navigation actions are limited to existing pages. No response text is executed as HTML or JavaScript.

New/Clear conversation resets page-memory dialogue without deleting saved scenarios. Reset scenario context clears only ticket context. Tone, saved scenarios and achievements remain in the existing local storage system with legacy migration. Raw chat is not persisted across reloads or sent elsewhere.

Professional, Balanced and Fun wording all use the same tools and evidence. This is a bounded local conversational assistant, with no API gateway, paid model or generative capability. Original study facts and supplemental historical records remain distinct. Historical reported attendance cannot establish gate-scan counts or measured ticket utilization.
