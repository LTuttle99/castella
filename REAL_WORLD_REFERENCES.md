# Real-world staffing and money references

Castella's original staffing, parking, concession and entry ratios are illustrative placeholders. This addition brings in **published, attributed figures** so chat and Explore can show real-world context. These figures sit beside your assumptions; they never silently replace them.

File: `data/operations/event-references.json`. It is checked offline by `python3 scripts/event_references.py --check` (provenance, allowed hosts, approved SHA-256, and a recomputation of the derived ratio from the bundled attendance export) and validated again in the browser by `CastellaOperations.validateReferences`. Values were read manually on each cited page on 20 November 2026. Nothing is scraped at build or run time.

| Record | Value | Source (as read) | Evidence class | Key limitation |
|---|---|---|---|---|
| Average NFL ticket, 2024 | $136.38 | Team Marketing Report Fan Cost Index, as reported by [Fortune, Sept 15 2026](https://fortune.com/2026/09/15/shrinkflation-sports-nfl-cost-fan/) | Published benchmark | League average price, not a venue's prices or revenue collected. The TMR page itself returned 404. |
| Raiders no-show rate, 2021 | 14.3% | Sports Business Journal (Ben Fischer) via [ProFootballTalk, May 19 2022](https://www.nbcsports.com/nfl/profootballtalk/rumor-mill/news/in-first-year-with-fans-at-allegiant-stadium-the-no-show-rate-was-14-3-percent) | Published benchmark | One team, one unusual season (vaccine mandate, casino ticket blocks), reconstructed from box scores and stadium-authority reports. |
| Workers per NFL game | 3,739 | NFLPA estimate via [AP, March 9 2011](https://www.foxnews.com/sports/nfl-game-day-employees-businesses-to-take-hit-if-nfl-lockout-happens.amp) | Published benchmark | 2011 union estimate with no published method; covers all game-day jobs. |
| Superdome game-day employees | 2,500 | AP, same story | Published benchmark | Reporter's figure, unattributed; one venue; 2011. |
| Workforce per 1,000 attendees | 55.84 | Castella derivation: 3,739 ÷ 66,956.48 (2010 mean reported attendance, 512 team-week observations in the bundled export) × 1,000 | Derived estimate | Mixes an undocumented estimate with reported attendance and assumes linear scaling. Order of magnitude only. |

**Not used, and why:**

- **Per-fan concession spending:** survey figures conflict, and none was read on an attributable primary page.
- **Per-item 2024 Fan Cost Index prices:** the TMR page was unavailable.
- **A SoFi Stadium headcount:** the page redirected elsewhere.
- **A league no-show rate:** the NFL doesn't publish one.

Per-fan spending therefore remains a user assumption.

## How it shows up

- **Chat — "What's the money impact?"** Ticket face value at the league-average price, the share held by no-shows, and (when you give a spend per fan, or set one in Explore) in-stadium spending and the spending no-shows never make. Works inside multi-intent messages.
- **Chat — "Is 90% show-up realistic?"** The Raiders 14.3% reference, with caveats and a chip to apply it as a labeled assumption.
- **Chat — staffing answers** add the all-roles workforce reference scaled to your arrivals. "How many people actually work a game?" compares it with the 1-per-250 placeholder, which looks more like crowd-facing staff alone. "What would the full workforce cost?" costs that headcount with your hours and a BLS or custom wage.
- **Explore:** a "Money at stake" panel in Ticket scenarios, a workforce line under Staffing, and five new source cards in Research & sources.
- **Evidence answers** classify each of these figures.

Tests: `tests/test_event_references.js` (25 cases: integrity, derivation, calculations, chat behavior, and no invention when the file is missing).
