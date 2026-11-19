# Operations validation report

Actual collection: 17 normalized records, four source documents, zero duplicate IDs, 12 occupational wage statistics, three annual financial statement figures and two contextual capacity/ingress references. Two records have explicitly undated source pages. MSFA publication year is 2025, observation year 2024. No NFL-wide spending or staffing standard was inferred.

The BLS national ZIP was actually retrieved and parsed. Initial robots access succeeded; later robots refresh failed with 403 and was skipped, using the prior hashed source. Metropolitan and Indianapolis source attempts failed with 403. MSFA PDF, Lucas Oil page and SGSA page were retrieved; their subsequent pipeline refreshes also succeeded. See acquisition logs in OPERATIONS_PROVENANCE.json. No access controls were bypassed, no full copyrighted source files were republished, and no production scrape is required.

Offline checks verify metadata, source traceability, duplicate IDs, finite values, wage/benefit scope, financial units, availability gaps and the approved bundle hash. Tests include synthetic invalid fixtures only in tests; these values are never published as research.

All existing regression suites remain required. Phase 7 adds 42 JavaScript operations/provenance/dialogue cases and six Python data cases, bringing Python discovery to 20 tests. The Ollama mock suite includes an actual new operations-tool composition check (80 scenarios total). Browser AI’s 24 mock cases remain required. Actual browser verification results and limitations are recorded in TEST_REPORT.md and the final handoff.

Known limitations: archived rather than current wages; no Indianapolis dataset; annual all-authority financial scope; approximate undated capacity; UK guidance rather than measured NFL screening; no reliable USD-per-attendee benchmark; no observed role staffing quantities, burden or paid-hours standard. User-defined stress cases are not confidence intervals.
