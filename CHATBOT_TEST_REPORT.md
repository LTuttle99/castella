# Chatbot evaluation report

## Baseline and commands

The production baseline passed 45 scenario assertions, 2 Python tests, and the static build before changes. Phase 4 is unmerged and was not used as a release dependency.

Final automated commands:

- `node tests/test_scenario.js`: 45 original parser assertions passed.
- `node tests/test_conversation.js --report`: 62 realistic conversations, 171 turns, plus numerical/tool/action/personality invariants passed. The per-conversation results are in tests/conversation-results.json.
- `python3 -m unittest discover -s tests -v`: 2 original Python tests passed.
- `python3 scripts/build.py`: syntax-checked the inline app and all conversation assets, then produced a clean dist/ with no stale Phase 4 assets.

Evaluation categories include casual conversation in all three modes; 20 varied show-up/no-show phrases; implied-rate follow-ups; percentage points versus proportional changes; scenario comparisons; staffing/concessions/parking/entry; clarification across a casual detour; historical-unavailable memory; topic changes; simpler explanations; forecast limits; injection attempts; invalid counts/rates; resets; navigation and safe actions. Exact assertions check numerical values, state, sources, intentions and action schemas. Phrase variety and selected response expectations are covered; these checks do not constitute a human study of conversational quality.

Examples: 35,000 tickets and 10% no-shows returns 31,500. A follow-up at 80% returns 28,000. The comparison is 3,500 fewer / 11.11% lower. Five percentage points below 90% yields 85%; a proportional five percent decrease yields 85.5% and 29,925 arrivals. Parking at 31,500 under displayed defaults is 8,190 vehicles. Staffing is 139; concessions 35,501; entry lanes 9.

Initial evaluation defects repaired: implied rates after a ticket-count question; stale ambiguity changing a later rate's meaning; “Nobody shows up” classification; scenario reset followed by explanation; decimal rate transfer; low-occupancy humor when capacity was missing.

## Browser verification

The production artifact was served at localhost /dist/. Verified new chat controls, suggestion-driven count/rate dialogue, result cards and sources, Enter-to-send, no-show phrasing, parking follow-up, proportional-rate calculation, decimal simulator transfer, prior-card snapshot transfer, and preservation of existing saved scenarios. Final additional checks and limits are recorded in TEST_REPORT.md.

No LLM was connected, called, mocked, or evaluated, following the owner's no-API instruction. No generative capability or unrestricted natural-language coverage is claimed.

The final browser pass also verified scenario-context reset, New conversation, honest historical unavailability, persistent Fun tone after reload, mobile layout at 375×812, Shift+Enter without sending, Enter-to-send, a casual thanks detour followed by correct parking, immutable old-card transfer, and no console warnings/errors. The saved tone JSON/plain-text compatibility bug was repaired. A mobile screenshot is saved alongside the deliverable. Assistive-technology testing and exhaustive rechecks of old achievement/confetti combinations were not performed.

GitHub Actions independently passed the conversation validation workflow for PR #2 (https://github.com/LTuttle99/castella/pull/2). Numeric low/base/high controls all support decimal utilization consistently.
