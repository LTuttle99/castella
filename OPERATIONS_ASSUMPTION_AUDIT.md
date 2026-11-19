# Operations assumption audit — before Phase 7 formula changes

Inspected production main `ae6bf1009a6d39f2de6489fe1f87ad6f1d5f1b2b` (Browser AI release), `index.html`, `scripts/tools.js`, `conversation.js`, history modules, build/workflows and existing source/provenance documentation. Static frontend only; no production database or backend. Data/operations research did not yet exist. No formulas have been changed for this audit.

| Input | Existing default | Unit | Formula/use | Origin/evidence | Editable |
|---|---:|---|---|---|---|
| Ticket count | 35,000 | eligible tickets | arrivals = round(tickets × show-up) | Illustrative placeholder; no NFL average | Yes |
| Show-up | 90 | percent | illustrative arrivals | User planning assumption, not measured no-show data | Yes |
| Low/high show-up | 80 / 98 | percent | separate stress scenarios, not confidence bounds | Illustrative placeholders | Yes |
| Capacity / inventory | blank | seats / eligible tickets | occupancy / entered-inventory sellout | User supplied; no venue default | Yes |
| Staff ratio | 250 | arrivals per staff member | ceil(arrivals / ratio × (1 + buffer/100)) | Hardcoded illustrative default, no empirical staffing standard | Yes |
| Staff buffer | 10 | percent | formula above | Hardcoded illustrative buffer | Yes |
| Purchases per attendee | 0.7 | purchases per illustrative arrival | ceil(arrivals × purchases × units × (1 + buffer/100)) | Hardcoded illustrative mean, not a probability or observed NFL rate | Yes |
| Units per purchase | 1.4 | inventory items per purchase | formula above | Illustrative placeholder | Yes |
| Inventory buffer | 15 | percent | formula above | Illustrative placeholder | Yes |
| Car share | 65 | percent of arrivals assumed arriving by car | ceil(arrivals × share/100 / occupancy) | Illustrative placeholder; no venue mode-share study | Yes |
| Vehicle occupancy | 2.5 | people per vehicle | formula above | Illustrative placeholder; no NFL average | Yes |
| Parking spaces | blank | available spaces | max(0, vehicles − spaces) | Optional user input, not verified facility supply | Yes |
| Arrival window | 3 | hours | ceil(arrivals / (window × lane rate)) | Illustrative placeholder, uniform-demand simplification | Yes |
| Lane throughput | 1,200 | people per lane/hour | formula above | Illustrative placeholder, not measured ticket/security processing | Yes |

The existing live interface calls these editable assumptions and illustrative outputs, and disclaims staffing/safety certification. It does not label them NFL industry averages. `tools.js` is shared by simulator/chat and rounds staff, inventory, vehicles and lanes up. Existing tested baseline at 31,500 arrivals: 139 staff, 35,501 items, 8,190 vehicles, nine lanes. Some static HTML result placeholders predate the live formulas; page initialization recalculates them. Source files alone are not proof of working behavior; earlier Chromium regression tests exercised actual inputs and errors.

No labor wage, paid-hours, payroll burden, overtime, per-attendee spending or labor-cost calculator exists in the base implementation. Concession inventory units are not revenue. Reported attendance is not gate scans. The supplied research MAEs and 2000–2019 supplemental attendance export are separate evidence and must remain unchanged.

## Gaps and design decision

Retain all existing formulas/defaults as clearly identified illustrative placeholders. Add source-selected occupational wage references and an explicit role-cost model; leave staffing quantities, paid hours and burden user supplied. Do not turn national cross-industry wages into NFL pay scales. Add custom gross-spending scenarios with no fabricated dollar-per-fan benchmark. Treat annual authority statements, operator-reported percentage changes and UK entry guidance as scoped references rather than transferable current NFL defaults. Record unavailable benchmarks explicitly. Add user-defined stress cases, source inspection and chatbot provenance retrieval.
