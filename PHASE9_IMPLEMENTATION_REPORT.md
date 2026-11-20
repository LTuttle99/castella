# Phase 9 implementation report — chat-first redesign and personalized profiles

Base: production `main` at `9b766854` ("Integrate operations research, labor costs and sensitivity (#8)"). Branch: `feature/phase9-chat-first-redesign`. Main was not modified. Not deployed until the pull request is reviewed and merged.

## Inspection findings

- `main` already contained Phases 4–7 (historical data, Standard dialogue, Ollama, Browser AI, operations research). PR #8 had been merged, although HANDOFF/TEST_REPORT still described it as open; that is now corrected.
- **No forecasting module exists** (no Phase 8 branch or code), so no prediction feature was added or claimed. Forecast requests still answer that the trained estimator isn't connected.
- The baseline suites all passed (see CHAT_FIRST_TEST_REPORT.md).
- A scripted probe of the brief's example dialogues found more than a dozen wrong or unsupported answers. These drove the conversation work below.

## What was built

1. **Profile selection** (`scripts/profiles.js`, `index.html`): a full-screen "Select an account" screen with the three named profiles and initials avatars. Keyboard support, a ≈1.5 s personalized welcome (skipped under reduced motion), remembered selection, Switch account in the header and Settings, per-profile storage and opt-in, copy-only legacy import. See PROFILE_SELECTION.md.
2. **Chat-first shell:** Chat is the home page ("What can I help you figure out?"), with a large composer, five working starter prompts and contextual follow-ups. Navigation is Chat / Explore / Settings. Explore holds the five existing tool areas with progressive disclosure; Settings holds profile, assistant, privacy, reset and achievements. See CHAT_FIRST_DESIGN.md.
3. **Conversation engine** (`conversation.js`, `history-dialogue.js`, `operations-dialogue.js`):
   - clause planning for multi-intent messages;
   - staffing cost with explicit hours and a BLS or custom wage (asks only for what's missing);
   - wage provenance and wage-change follow-ups;
   - "10% lower" points-versus-proportional clarification;
   - first/second scenario comparison and "go back";
   - explain the Nth number;
   - "last year", "how much higher" and out-of-range years;
   - historical, scenario and research charts;
   - "What changed?" after Explore edits;
   - context-aware evidence and assumption answers;
   - no-show knowledge, research summary and cost methodology answers;
   - profile-name greetings;
   - a fix so the no-data fallback only runs when no history adapter is loaded.
4. **Chat UI** (`chat-ui.js`): typed cards (calculation, historical, operations, comparison, source, evidence), accessible SVG charts with data tables, "Open in Explore" actions including the new validated `operations` action, per-profile assistant preferences, an empty state, a docked composer, and a typing indicator for local models.
5. **Shared state:** Stadium operations has an explicit arrivals basis with an optional override, used by Explore and Chat alike. The calculation layer (`tools.js`, `operations-research.js`) is still the single source; `uniformLabor` was added for chat staffing cost.

## Preserved

- Historical data, which is byte-identical and checksum-verified.
- The original research MAEs (4,401 / 4,344 / 3,045) and 5,104-game scope.
- Operations research records and evidence classes.
- The labor, spending, sensitivity, parking, entry and concession calculators, and the ticket simulator.
- Saved scenarios and comparison, research citations, all six achievements, sellout confetti, the three personalities, Standard, Ollama and Browser AI.
- Content-versioned static assets and the GitHub Pages workflow.

## Tests

All prior suites pass unchanged. New suites: `test_profiles.js` (17) and `test_chat_first.js` (47 tests, 97 turns), both added to the validate and deploy workflows. Browser verification was done in Chromium. See CHAT_FIRST_TEST_REPORT.md.

## Files

Created: `scripts/profiles.js`, `tests/test_profiles.js`, `tests/test_chat_first.js`, `PROFILE_SELECTION.md`, `CHAT_FIRST_DESIGN.md`, `CHAT_FIRST_TEST_REPORT.md`, this report.

Modified: `index.html`, `scripts/chat-ui.js`, `scripts/conversation.js`, `scripts/history-dialogue.js`, `scripts/operations-dialogue.js`, `scripts/operations-research.js`, `scripts/operations-ui.js`, `scripts/tools.js`, `scripts/local-ai.js`, `scripts/build.py`, `tests/test_build_assets.py`, both workflows, `README.md`, `ARCHITECTURE.md`, `HANDOFF.md`, `TEST_REPORT.md`, `DEPLOYMENT.md`, `CONVERSATIONAL_ARCHITECTURE.md`, `CASTELLA_PERSONALITY.md`, `AI_CONFIGURATION.md`.

## Remaining limitations

- Profiles are not authentication and offer no privacy from other users of the same browser.
- The optional Playwright scripts `tests/test_browser_*.js` still use the removed seven-page selectors (`.nav [data-page=…]`, `.local-ai-settings summary`, `.bubble`). They are not part of CI, were not run, and need updating before reuse.
- Browser AI and Ollama were not exercised with real models in this phase. Safari and Firefox were not tested. Reduced motion was verified by simulating `matchMedia`, not by OS emulation.
- The Standard engine is still rule-based. Phrasings far outside the tested patterns can still fall back to "I'm not sure what you mean yet."
- Chat history is not persisted across reloads (by design, unchanged).
