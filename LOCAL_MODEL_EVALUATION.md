# Local model evaluation — 19 November 2026

## Selection

Hardware actually detected: Apple M1, arm64, 8 GB unified memory. Ollama 0.40.16 was already installed and listening on 127.0.0.1:11434. Existing models were inspected without downloading any weights. Selected **qwen3.5:4b**, GGUF Q4_K_M, 4.7B parameters as reported by the installed runtime, 3,389,983,735 bytes on disk, digest `2a654d98e6fba55d452b7043684e9b57a947e393bbffa62485a7aac05ee4eefd`. Model selection remains configurable. Ollama reported roughly 3.2 GB runtime use, 100% GPU, context 4096 during the initial probe.

Qwen3 4B and 8B were investigated in the official model library: approximately 2.5 GB and 5.2 GB Q4_K_M artifacts respectively, both Apache 2.0. Qwen3.5 is also listed under Apache 2.0. These catalog values do not describe every installed variant. The existing 4B avoided unnecessary downloads. An 8B model was not loaded on this memory-constrained machine. Existing qwen3.5:2b and llama3.2 were discovered but not quality-benchmarked; no comparative superiority is claimed. CPU-only latency was not measured and is expected to differ substantially. Consult each exact model’s current license before redistribution; Castella redistributes no weights.

Sources: https://ollama.com/library/qwen3:4b, https://ollama.com/library/qwen3:8b, https://ollama.com/library/qwen3.5:4b.

## Automated evaluation

`node tests/test_local_ai.js --report`: **79 passing mocked scenarios**. They exercise varied rate language, follow-ups, three tone prompts, real historical-record retrieval, comparison, operations, evidence guards, invalid actions/arguments, absent runtime, malformed streams, cancellation, timeout, retry ledger and recovery. This is a deterministic integration suite, not a claim that the real model answered 79 prompts accurately. Real data and deterministic functions are used under the mock.

## Real model observations

An initial raw greeting probe took 17.68 seconds (12.03 seconds model load), generating 18 tokens at about 5.27 tokens/second. Three integrated requests then succeeded: casual greeting, 35,000 tickets × 90% = 31,500 illustrative arrivals, and follow-up parking = 8,190 vehicles. These took 43.98, 38.85 and 92.84 seconds. The initial model prose incorrectly called scenario arrivals “actual”; a subsequent integrity guard now rejects that phrase and uses the verified result.

A separate multi-turn run completed six turns: greeting, partial 35,000-ticket scenario, “Around 90%”, “What about 80?”, comparison and parking. It correctly retained 31,500 then 28,000 arrivals. Four replies used generated wording, one used verified fallback after numeric grounding, and one malformed numeric tool call was rejected. Five of six provider requests completed (83.3%); the UI independently catches provider errors and answers through Standard. These observations demonstrate usable tool integration with imperfect model reliability, not production-grade model accuracy. Generated text still tended toward generic closings despite the personality prompt.

Recorded durations were 15.59–63.64 seconds in this run. Decoding was approximately 3.27–4.81 tokens/second. A warm greeting’s first visible text arrived at 8.40 seconds; quantitative responses intentionally wait for verification, so visible first-token latency is not recorded for them. Tool rounds add substantial latency. `verification/phase6/local-model-evaluation.json` contains per-turn timings and outcomes without generated raw chat.

The first five-turn checkpoint was reached. **10- and 20-turn real-runtime runs remain incomplete**: simultaneous browser launch and inference caused severe memory pressure; the evaluation was stopped after turn six and its test model unloaded. No crash, CPU benchmark, 20-turn success or browser-wide compatibility is claimed. Run longer tests separately from browser tests on a less constrained machine.

## Reproduction

Install/start Ollama, install one suitable model (or reuse an installed local model), then:

```sh
CASTELLA_MODEL=qwen3.5:4b CASTELLA_EVAL_TURNS=5 node scripts/evaluate_local_ai.js --real
CASTELLA_EVAL_TURNS=10 node scripts/evaluate_local_ai.js --real
CASTELLA_EVAL_TURNS=20 node scripts/evaluate_local_ai.js --real
```

The optional runner writes incremental synthetic-test metrics to ignored `work/local-model-evaluation.json`. Run one model/evaluation at a time. Standard is recommended when responsiveness matters on this Mac. More memory, a smaller model or faster hardware may help, but performance is not guaranteed.
