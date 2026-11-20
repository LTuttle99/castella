# Chat-first design (Phase 9)

Castella is now a conversation first and a dashboard second. Every earlier tool remains available, behind progressive disclosure.

## Structure

**Profile selection → Welcome → Chat.** Three top-level destinations replace the seven-item sidebar:

| Destination | Contents |
|---|---|
| **Chat** (home) | "What can I help you figure out?", a large composer, five starter prompts, the conversation, structured cards, charts and validated action buttons |
| **Explore** | Historical attendance · Ticket scenarios · Stadium operations · Operating costs · Research & sources. One section shows at a time. |
| **Settings** | Profile and Switch account, legacy import, personality, assistant mode, Browser AI and Ollama controls, privacy and data definitions, reset options, Achievements |

Achievements moved out of the main navigation into Settings and the profile menu. All six triggers are unchanged. The old Overview page was removed: its model-comparison chart lives in Research & sources, and its headline numbers are reachable in Chat. Legacy page names (`simulator`, `analytics`, `operations`, `research`, `achievements`) still route correctly through `go()`, so existing actions keep working.

## Visual language

- Deep navy (`#101b26`) for the selection and welcome screens and for user messages; warm off-white paper (`#f6f4ee`) for the app; lime used sparingly (the brand dot, send icon, avatar focus).
- Space Grotesk for headings and DM Sans for body text, both retained from the existing identity.
- Thin borders, almost no shadows, no gradients except a short fade above the docked composer, and no glassmorphism or glow.
- The assistant's messages are unboxed text with a small "C" mark; user messages are compact navy bubbles. Cards carry a thin colored left rule by type (calculation, historical, operations, comparison, source/evidence) and an evidence footer.
- Motion is limited to card hover lift, the welcome sequence (chosen-card highlight, staggered name reveal, lime underline sweep, blur-out into Chat, about 2.4 s and skippable) and a three-dot typing indicator for local models. Under `prefers-reduced-motion` all movement is removed; the welcome remains as a short opacity-only cross-fade.

## Chat components

- **Composer:** auto-growing textarea, Enter sends, Shift+Enter adds a newline (IME composition respected), send button, Stop (only while a local model is generating), mode/tone summary and a link to assistant settings. It's centered in the empty state and docks to the bottom once a conversation starts.
- **Suggested prompts:** five starters in the empty state, each verified to do what it says. Once a conversation starts, at most three contextual follow-ups appear.
- **Cards:** calculation (tickets, show-up, arrivals, no-shows), historical (team, seasons, metric, verified mean, sample, home total, source), operations (staffing, assumptions, wage and evidence class, cost), comparison (original, updated, absolute and relative difference), source (name, publication year, URL, metric, limitations) and evidence classification. Multi-intent answers can show several cards.
- **Charts:** inline SVG built only from deterministic tool output (historical season means, scenario arrivals, the original model MAEs). Each has a caption, an expandable data table and an `aria-label`; the SVG itself is `aria-hidden`.
- **Actions:** "Open in Explore · …" buttons validated by `CastellaTools.validateAction`. The new `operations` action sets Explore's arrivals override and focuses the relevant input.

## Chat ↔ Explore synchronization

One calculation layer (`tools.js` and `operations-research.js`) serves both. Stadium operations gained an optional **Plan for arrivals** override; its "Arrivals basis" is shown explicitly. Chat reads Explore's current assumptions and arrivals basis on every turn, so after you edit an input in Explore, "What changed?" reports the specific differences and recomputes. Chat never writes Explore values except through a user-clicked, validated action.

## Responsive and accessibility notes

- At ≤980px, Explore and Settings subnavs become horizontal chips. At ≤700px, profile cards stack, cards collapse to one column, result-card rows stack, and the docked hint text is hidden. Verified with no horizontal overflow at 375px on every view.
- Semantic landmarks (`header`, `nav`, `main`, labelled sections), `aria-current` on navigation, a live-region conversation log, labelled composer, a menu with arrow-key and Escape support, `inert` app content behind the profile screen, visible focus rings and live-region status messages.
