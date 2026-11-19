# Castella

*Smarter crowds. Better game days.*

**NFL Attendance Intelligence & Stadium Operations Assistant**

Repository: https://github.com/LTuttle99/castella

Website: https://ltuttle99.github.io/castella/

Castella is a free static application combining historical reported NFL attendance analytics, original research summaries, a local conversational assistant, ticket-utilization scenarios, and game-day operations calculations. No login, API key, backend, or paid model is required.

## Browser AI — no installation

Choose Browser AI in Assistant settings, then **Download & enable Browser AI**. A small Qwen model runs directly in a compatible WebGPU browser. The initial download is about 280 MB plus runtime assets; no Ollama, API key or inference server is required. Your prompts stay on the device. It is a small model with limited quality, so verified calculations and Standard fallback remain authoritative. See [Browser AI setup and limitations](BROWSER_AI.md).

## Optional Local AI

Standard works for every visitor without setup. Optional generative conversation runs through your own locally installed Ollama model, with no paid API or cloud inference. On the tested 8 GB M1, the installed `qwen3.5:4b` worked but was slow. Run `python3 scripts/serve_local.py`, open http://127.0.0.1:8765/, choose Local AI in Assistant settings and explicitly Connect. No model is downloaded by the application. See [setup](LOCAL_AI_SETUP.md), [evaluation](LOCAL_MODEL_EVALUATION.md) and [integration](OLLAMA_INTEGRATION.md). A developer’s local model is not available to public visitors.

## Run and verify

Serve this directory with `python3 -m http.server 8000 --bind 127.0.0.1` and open http://127.0.0.1:8000/. Build with `python3 scripts/build.py`; deployable files are written to `dist/`.

Run:

```sh
node tests/test_scenario.js
node tests/test_conversation.js
node tests/test_history.js
node tests/test_integration.js
node tests/test_local_ai.js
node tests/test_browser_ai.js
python3 -m unittest discover -s tests -v
python3 scripts/attendance_pipeline.py --check
python3 scripts/build.py
```

## Explore and converse

Analytics includes season trends, historical team/location comparisons, team-week distributions and coverage. Filter team, seasons and metric. Ask “What was the Colts' average reported attendance in 2015?”, then “What about 2016?”, “Did that increase?”, “How many games are included?” or “Where did you get that?”. Chat cards can open the matching analytics filters. “Explain the selected chart” reads the current selection. Historical comparisons use the active ticket scenario without confusing reported attendance and assumed physical arrivals.

The assistant maintains context through supported casual detours, handles no-show/show-up phrasing and proportional versus percentage-point changes, calculates staffing/concessions/parking/entry, and offers validated scenario transfer buttons. Professional, Balanced and Fun wording shares the same numerical tools. Enter sends; Shift+Enter adds a line. Chat context stays in page memory. New/Clear conversation clears chat context; Reset scenario context preserves the transcript and saved scenarios. Saved scenarios, achievements, celebrations and tone remain in local storage, including same-origin legacy key migration.

## Data and research boundaries

The supplemental TidyTuesday 2020-02-04 export contains 638 historical team-season records with 10,846 team-week observations, 2000–2019. There are 638 missing weekly values. Historical names are preserved. Weekly means include home and away appearances; samples are not verified unique-game counts. Season totals are deduplicated across weeks. No gate scans, historical no-show rates, verified home-game means, or unique-game rankings are inferred.

The original research reports 5,104 games and CV MAEs of 4,401, 4,344 and 3,045. Those original findings remain separate and unchanged. No original trained estimator or validation predictions are connected. The assistant is deterministic and bounded; there is no generative model or API integration.

See DATA_SOURCES.md, DATA_DICTIONARY.md, DATA_PROVENANCE.json, DATA_QUALITY_REPORT.md, CONVERSATIONAL_ARCHITECTURE.md, TEST_REPORT.md and DEPLOYMENT.md. Normal builds use validated local assets and never download third-party data. Refreshes run separately with `python3 scripts/attendance_pipeline.py`; source checksum changes require inspection and explicit `--approve-source` before publishing an updated manifest.
