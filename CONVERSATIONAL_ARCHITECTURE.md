# Castella conversational architecture

## Current release base

Phase 5 branches from production commit 6626171c2b217aae742a58744aa795c9f5f5ef0d. Phase 4 PR #1 is unmerged; historical records are therefore not bundled or advertised as available here. Production is unchanged until this branch is reviewed and merged.

## Three local layers

1. `scripts/conversation.js`: dialogue interpretation, normalization, context resolution, turn tracking, intent routing, ambiguity handling, personality and response composition. It returns data rather than changing the DOM.
2. `scripts/tools.js`: pure validated ticket utilization, no-show conversion, scenario comparison, operations calculations, immutable research facts, and action validation. The simulator and chat use the same operating functions.
3. `scripts/chat-ui.js`: accessible text and result-card rendering, suggestion chips, textarea keyboard handling, reset controls and allowlisted app actions. Output is inserted with textContent, not executable HTML.

The existing scenario parser remains in `scripts/scenario.js`. The dialogue layer normalizes supported phrases before passing calculations to it and validates the resulting scenario. Unhandled relative rate requests ask for clarification. A proportional 5% reduction from 90% is 85.5%; a five-percentage-point reduction is 85%.

## State

A pure state transition returns a new state for each message. State includes the current/previous scenario, ticket definition, show-up/no-show rates, current/previous team and season, historical metric/results, editable operations assumptions, last tool result, last reply, bounded conversation references, pending clarification, turn count, and one-time reaction markers. Current context stays in page memory. New/Clear conversation replaces it; Reset scenario context clears only scenario context. Saved scenarios and tone remain in the existing localStorage system. Raw chat is not saved across reloads or sent elsewhere.

Scenario transfer buttons contain validated snapshots of their original results. Clicking an older card does not accidentally transfer a newer result. Selecting a scenario updates both simulator inputs and the current dialogue scenario. Historical action execution checks dataset presence and a real matching row; arbitrary model strings or JavaScript are never executed.

## Facts and missing evidence

Research replies compose verified fields from the supplied original research summary. Source labels distinguish research, user assumptions, formulas and unavailable assets. Casual conversation is routed before scenario parsing, so greetings and thanks do not reset numeric context. Historical requests remember team/year but return an unavailable response on the actual production base. An optional injected historical adapter interface is defined for a future reviewed integration; it is not connected here.

This is a bounded deterministic assistant, not unrestricted generative AI. Local response variants can make supported conversations smoother, but do not provide a language model's general reasoning or breadth. There is no API, gateway, paid usage, token streaming, or external transcript storage.
