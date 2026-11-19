# Castella Browser AI

Browser AI runs a small language model directly on the visitor’s device through WebGPU. No Ollama installation, model API key, login, inference server or paid inference service is required. Standard remains the default and works without a model. Existing Ollama Local AI remains available.

## Enable

Open Assistant → Assistant settings → Browser AI → **Download & enable Browser AI**. This explicit action checks WebGPU/shader-f16 support and starts the download. The page does not fetch model assets or initialize a worker before opt-in, including when a remembered Browser AI preference is restored.

Model: Qwen2.5-0.5B-Instruct-q4f16_1-MLC, public MLC conversion at revision `32ff081fe7e4dfe4ffb167b94c66fdf11e02b8ad`. The weight manifest totals **277,996,288 bytes** across eight shards, plus tokenizer/compiler/runtime files. The self-hosted WebLLM 0.2.89 JavaScript bundle is about 6.15 MB before transfer compression. Its catalog estimates about 945 MB GPU memory for this model; actual use depends on browser/device. Context is capped at 2,048 tokens and output at 160 tokens. A compatible GPU, shader-f16, sufficient memory and network access to the asset hosts are necessary. No speed or universal mobile compatibility is promised.

Cancel download terminates the worker. Stop during generation terminates the worker, preserves verified conversation state and requires reloading the model. Unload releases model resources. Delete model cache removes this model’s relevant WebLLM Cache API entries; it does not delete scenarios, achievements, preferences or other model assets. Browser caching is best effort and may be evicted, restricted in private mode, or unavailable under storage quotas. Mode settings persist but no automatic model reload occurs. New/Clear conversation removes in-page dialogue.

## Privacy and data flow

Runtime JavaScript is self-hosted and pinned. Compiler WASM comes from the WebLLM versioned MLC GitHub library path; pinned model/tokenizer assets come from Hugging Face, possibly through their download CDN redirects. Asset hosts see normal download requests and network metadata, not inference prompts. Prompts, recent dialogue and verified tool results are passed to a local worker/GPU; no inference server receives them. Raw chat is not persisted by Castella. Existing typography requests remain independent. No model-generated URL, HTML, file operation or command becomes an application action.

## Calculations and model limitations

Browser AI reuses the trusted Standard dialogue engine to parse factual requests and execute deterministic scenario, operating, research and historical functions. The small model composes prose around those verified outputs and handles casual qualitative conversation. It does **not** perform native model-selected tool calls; Ollama’s separate provider still supports those. Existing supported phrasing and context rules apply to numerical requests.

Cards, sources, validated actions and state always come from trusted code. A numerical/evidence guard, required primary scenario/operation result and selected unsupported-claim checks reject unsafe wording and use verified fallback. Quantitative drafts remain withheld; casual text streams directly. Model summaries never update scenario state. These checks do not prove semantic correctness. This 0.5B model has limited reasoning and instruction following; generic greetings, extra claims and verified fallback were observed. It should not be presented as equivalent to a large hosted model or a validated forecasting estimator.

Reported historical attendance remains distinct from gate scans, unique physical attendees and assumed ticket utilization. No new dataset or model forecast was introduced.

## Verification

24 mocked Browser AI tests cover capability checks, no automatic download, cancellation before adapter resolution, streaming, all three tone settings, calculations, historical records, unsupported wording, context retention, timeouts/errors and scoped cache deletion. All previous suites remain in CI. Optional browser UI tests cover mobile, missing GPU fallback, canceled download, Stop/unload/cache controls and persistence without automatic loading.

Real Chromium testing successfully downloaded and ran the model on the development M1 Mac without unsafe WebGPU flags. It generated a casual reply and a parking explanation; 35,000 tickets × 90% and the 80% follow-up retained 31,500 and 28,000 arrivals, using verified wording fallback when generation failed the checks. Parking retained 28,000 arrivals and 7,280 vehicles. Actual timings and screenshots are in `verification/browser-ai/`; generated text in these files uses synthetic prompts only. One missing favicon request returned 404; no JavaScript page errors occurred. No Safari/Firefox, broad mobile GPU, CPU/WASM fallback or long-conversation quality benchmark is claimed.

Run the existing static build/preview normally. For optional tests, install Playwright separately as described in TEST_REPORT.md, start `python3 scripts/serve_local.py`, then run `tests/test_browser_model_ui.js`. Explicitly add `--real` to `tests/test_browser_model_real.js` to authorize the model download and real GPU inference. The ordinary CI test is `node tests/test_browser_ai.js`; CI/build never require model weights or GPU access.

## Licensing and reproduction

WebLLM, its bundled MLC runtime/tokenizer components and the original Qwen2.5 0.5B model use Apache 2.0; inspect the upstream artifacts before redistribution. Castella redistributes runtime code with notices in `scripts/vendor/`, not model weights. The model conversion is fetched from the public source after consent.

To recreate the runtime bundle:

```sh
npm install --prefix work/browser-runtime --no-audit --no-fund @mlc-ai/web-llm@0.2.89 esbuild@0.25.12
node -e "require('./work/browser-runtime/node_modules/esbuild').buildSync({entryPoints:['work/browser-runtime/node_modules/@mlc-ai/web-llm/lib/index.js'],bundle:true,format:'esm',platform:'browser',minify:true,outfile:'scripts/vendor/webllm-0.2.89.js'})"
```

Retain the accompanying license/third-party notices. This maintenance command is not part of the public build. GitHub Pages serves the static assets; optional models do not require a hosted backend.

Official references: https://webllm.mlc.ai/docs/user/basic_usage.html, https://github.com/mlc-ai/web-llm, https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct, https://huggingface.co/mlc-ai/Qwen2.5-0.5B-Instruct-q4f16_1-MLC.
