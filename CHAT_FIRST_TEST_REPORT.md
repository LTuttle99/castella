# Chat-first test report (Phase 9)

Base: `main` at `9b76685` (PR #8, operations research). Branch: `feature/phase9-chat-first-redesign`. Tested 20 November 2026 on macOS, Node 24.21, Python 3.9 locally (CI uses Node 22 and Python 3.12).

## Baseline before changes

All pre-existing suites passed on `main`: 45 scenario, 64 conversations / 174 turns, 20 history, 28 integration, 80 Local AI, 24 Browser AI, 42 operations research, 20 Python tests, both data integrity checks and the build.

## Automated results after changes

| Suite | Result |
|---|---|
| `tests/test_scenario.js` | 45 passed (unchanged) |
| `tests/test_conversation.js` | 64 conversations / 174 turns passed (unchanged) |
| `tests/test_history.js` | 20 passed (unchanged) |
| `tests/test_integration.js` | 28 passed (unchanged) |
| `tests/test_local_ai.js` | 80 passed (unchanged) |
| `tests/test_browser_ai.js` | 24 passed (unchanged) |
| `tests/test_operations_research.js` | 42 passed (unchanged) |
| **`tests/test_profiles.js`** (new) | 17 passed |
| **`tests/test_chat_first.js`** (new) | 47 passed, 97 turns |
| **`tests/test_event_references.js`** (new) | 25 passed |
| `scripts/event_references.py --check` | passed (5 records, derived ratio 55.84 recomputed) |
| `python3 -m unittest discover -s tests` | 20 passed (`test_build_assets` now expects 14 versioned scripts because `profiles.js` was added) |
| `operations_pipeline.py --check`, `attendance_pipeline.py --check` | passed; data bytes unchanged |
| `scripts/build.py` | passed |

No existing assertion was removed or loosened. All three new suites and the reference check were added to `validate.yml` and `deploy.yml`.

**Profile tests:** the three exact names and initials; first visit; selecting and remembering each profile; rejecting unknown profiles; switching; namespaced separation; blocked or missing storage; corrupt JSON; legacy data summarized but not assigned; import copies once without deleting originals; the claim guard; no duplicates on re-import; original `cc_*` keys; invalid legacy values skipped; profile records contain no secrets.

**Chat-first tests:**
- Historical: retrieval and the "what about / increase" chain; "last year" and "how much higher"; source citation.
- Charts: historical chart values checked against raw records; overview chart; scenario chart; research MAE chart.
- No invented out-of-range years.
- Scenarios: the brief's 50,000 / 10% example; the ambiguous "10% lower" asks first, then resolves to points or proportional; explicit points; compare to the first scenario; go back to the first scenario; explain the second number; explain more simply.
- Operations: staffing for a stated crowd size and a follow-up; cost asks only for missing inputs; cost with the BLS benchmark and its provenance; custom wage, burden and wage change.
- Multi-intent: the brief's example and variants, with no duplicate execution.
- Explore sync: Explore role inputs take precedence; "What changed?" with changed, unchanged and override inputs.
- Evidence: assumption classification; "real NFL average"; reliability; no-show knowledge; original research and cost methodology.
- Guardrails: forecasts stay unavailable; injection refusal.
- Personality and profiles: name used only in greetings; name sanitization; tones differ but numbers match; quips don't repeat; unexpected input.
- Actions: action allowlist; generated text can't overwrite state.

## Bugs found and fixed during this phase

A probe of the brief's example dialogues against the old engine found:

- "What if it's 10% lower?" set show-up to **10%**.
- "Estimate staffing for 50,000 fans" ignored 50,000.
- The multi-intent cost request failed entirely.
- "What do we know about no-shows?" ran a calculation.
- "Explain the original research" returned historical data.
- "Show me a chart", "What would that cost?", "Compare that to the first one", "Explain the second number", "What assumptions are we making?", "What about last year?" and "How much higher?" were unsupported or answered the wrong question.
- With history loaded, "predict … next season" wrongly claimed historical data was unavailable.

All of these are fixed and covered by tests. Browser verification found three more, all fixed: historical charts were dropped between layers, the Operating costs section overflowed at 375px, and the docked chips overlapped messages.

See `CHAT_FIRST_DESIGN.md`, `PROFILE_SELECTION.md` and `PHASE9_IMPLEMENTATION_REPORT.md`.

## Browser verification (Chromium, built-in app browser)

Served from the production `dist/` build over a local static server. Verified:

1. First visit shows the profile screen with all three profiles; the app is inert; focus is on the first card.
2. Keyboard selection (ArrowDown, Enter) chose Anika. The welcome appeared at ≈0.3 s, the app was revealed at ≈1.5 s and the overlay was gone at ≈1.8 s. Focus moved to the composer.
3. Reload opened directly to Chat with "Welcome back, Anika." Lori's mouse selection and welcome screen were also checked visually.
4. Chat is the landing page; Enter sends; suggestion chips send their prompts.
5. Multi-intent cost → BLS chip → $17,496 (150 × 6 × $19.44) → wage provenance card with the BLS URL. Real benchmark data loaded.
6. "Show me staffing for 40,000 arrivals" → Open in Explore set the override to 40,000 and focused the staffing ratio. Changing the ratio to 200 and asking "What changed?" reported 250 → 200 and 176 → 221, matching Explore.
7. Historical chain: 66,717.25 → 68,763.13 → +2,045.88. Charts rendered (20 season columns; 3 MAE bars) with data tables.
8. Profile separation: Anika saved a scenario and set Fun; Johnny saw no scenarios, no achievements and Balanced, plus an offer to import 1 unassigned legacy scenario. Import copied it and left the original key in place. Back on Anika, her scenario, Fun tone and achievement were intact.
9. Mobile (375×812): no horizontal overflow on Chat, all five Explore sections, Settings or the profile screen after the fix. Screenshots reviewed for the profile screen, empty chat and active chat.
10. Desktop (1280×800 emulated): profile screen, welcome, empty chat, active chat with cards and chart, Explore and Settings reviewed.
11. Reduced motion: simulated by overriding `matchMedia` in the page (the tool cannot emulate the media feature). Selection revealed Chat in about 6 ms with no welcome overlay, and the welcome was announced in the live region. The CSS `prefers-reduced-motion` rule disabling all animation is unchanged from earlier phases.
12. No console errors in any session.

**Not tested:** Browser AI model download and inference, and Ollama, in this phase (no model was loaded or connected; their mocked suites pass unchanged). Safari and Firefox. The existing optional Playwright scripts (`tests/test_browser_*.js`) target the old seven-page selectors and have not been updated or run (Playwright is not installed here); see the remaining issues in `PHASE9_IMPLEMENTATION_REPORT.md`. The public GitHub Pages URL was not checked because this branch is not deployed.
