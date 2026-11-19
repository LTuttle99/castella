# Data sources and definitions

## Research facts

The research numbers presented in Castella come from the project prompt's supplied research summary for “Forecasting NFL Game Attendance.” It reports 5,104 games from 2000–2019, model cross-validated MAEs, feature descriptions, and the 2019 final test reservation. The project owner supplied the poster title, though the file itself was not found in the inspected workspace. The dataset, notebook, and author citation were not supplied, so the app attributes these facts to the supplied summary and does not fabricate a bibliographic citation.

## Public schedule pipeline

`scripts/ingest_public.py` retrieves the nflverse `schedules/games.csv` release over HTTPS, normalizes schedule and score columns, deduplicates by `game_id`, and writes `data/games-normalized.csv` plus retrieval provenance. The source release describes this collection as NFL game and schedule data ([nflverse-data schedules release](https://github.com/nflverse/nflverse-data/releases/tag/schedules), [nflverse-data repository](https://github.com/nflverse/nflverse-data)). Source-reported attendance, if present, is kept under `reported_attendance` and explicitly described as distinct from gate scans. This environment's retrieval attempt failed at DNS resolution, so no dataset was written and the app contains no externally sourced historical chart. Confirm upstream license and redistribution terms before publishing downloaded records.

No Open-Meteo history or verified stadium coordinates were obtained. Weather retrieval is not implemented because a reliable stadium coordinate mapping is not present. No original research data, entry scans, or unique attendee dataset is bundled.

## Definitions

- Ticket count: user-entered eligible tickets sold or distributed.
- Utilization: user-entered fraction of that count assumed to arrive.
- Illustrative arrivals: ticket count × assumed utilization.
- Unused tickets: ticket count − illustrative arrivals.
- Capacity occupancy: illustrative arrivals ÷ entered capacity.

Ticket sales, distribution, announced attendance, scans, and unique physical attendees are distinct measures. Public announced attendance cannot establish a historical no-show rate.
