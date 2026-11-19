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

## Phase 4 supplemental data

Successfully retrieved TidyTuesday's 2020-02-04 attendance.csv through the authorized GitHub connector. Local shell DNS failed; the connector retrieved the complete 570,885-byte UTF-8 repository asset. The repository license is CC0 1.0 (https://github.com/rfordatascience/tidytuesday/blob/main/LICENSE). The weekly README attributes the attendance to Pro Football Reference. We publish a compact transformed export under that repository license with both attributions retained, and do not bundle the raw CSV. CC0 does not grant rights the publisher does not own; upstream measurement precision and rights are not independently guaranteed. No restricted original research material is included.

Schema inspection showed 10,846 team-week rows and repeated season home/away/total values. Validation produced 638 team-season records, covering 20 seasons and 34 historical location/team labels. There are 638 missing weekly values. All nonmissing weekly values reconcile to source season totals. No unique game mapping is claimed. See DATA_DICTIONARY.md, DATA_QUALITY_REPORT.md, and DATA_PROVENANCE.json for fields, counts, checksums, and limitations.

The additional research repository README explicitly says its original Kaggle dataset has no explicit license. Its raw records and model files were not copied. nflverse release metadata was inspected, but the CSV retrieval failed at local DNS. No schedule join was forced. Weather enrichment is deferred because verified historical game venues and coordinates are absent.
