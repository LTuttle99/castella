# Operations data dictionary

`data/operations/benchmarks.json` is schema version 1. It contains sources, normalized records, explicit availability gaps, evidence definitions and acquisition attempts. `validation.json` contains record/source counts, quality results and the SHA-256 of the exact approved bundle. No raw source files are publicly bundled.

Every record has: `id` (unique); `value` (finite nonnegative number); `unit`; `category`; `title`; `source_id`; `source_url`; `publisher`; `publication_year`; `publication_year_note`; `observation_year`; `geography`; `venue_type`; `methodology`; `evidence_type`; `measurement_type`; `limitations`; `retrieved_at` (UTC); and `usage_status`.

Publication and observation years are distinct. An undated page uses null plus an explicit note, displayed as undated. Null is not the retrieval year or a guessed publication year. Observation year is null where no observation year is given.

Wage records add occupation_code, role, statistic (mean/median), table_field, includes_benefits=false and includes_employer_burden=false. Wages use USD/hour, nominal May 2023. Annual authority financial figures use USD/fiscal-year; revenue has category financial-revenue, distinct from expenses. Capacity uses seats; ingress guidance uses people/entry-point/hour. Financial values cannot be switched to per-attendee units without a valid denominator.

Evidence classes: verified-observed-data (documented historical/audited facts); published-benchmark (published survey estimate or scoped reference); derived-estimate (calculation); user-assumption (explicit hypothetical input); illustrative-placeholder (unsupported initial example). The published research collection excludes user assumptions/placeholders. Derived outputs in the app never upgrade their underlying assumptions into observations.

`availability` records unavailable research modes and reasons; missing data are not zero. `acquisition_attempts` records successful downloads, denied requests and policy failures. `OPERATIONS_PROVENANCE.json` mirrors source metadata and retrieval attempts. Source hashes identify actual downloaded snapshots; approved export hashes detect drift. No historical attendance schema or bytes are modified.
