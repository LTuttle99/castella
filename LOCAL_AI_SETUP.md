# Browser AI alternative

For installation-free browser inference, choose **Browser AI** and click **Download & enable Browser AI** in Assistant settings. Requires compatible WebGPU/shader-f16, roughly 1 GB GPU memory and a roughly 280 MB initial model download. Prompts stay in the browser. See BROWSER_AI.md in the repository for details. Standard remains available without a download. The instructions below apply to the separate Ollama mode.

# Castella Local AI setup

Standard mode works immediately without a model, login, API key or payment. Local AI is optional and runs on your own device. A model running on one person's computer is not available to other visitors.

## Install and run

Install Ollama from https://ollama.com/download for your operating system. Start the application, then in a terminal:

    ollama pull qwen3.5:4b
    ollama run qwen3.5:4b

Only one suitable model is needed. If you already have qwen3.5:4b locally, select that instead; Castella does not download weights. On smaller-memory devices consider qwen3.5:2b, after checking its license and local availability. Use a smaller model if memory pressure or response time is excessive. No fixed speed is promised.

In Castella, open Assistant settings, choose Local AI, and click Connect to Ollama. Select an installed local model. Your current message, bounded recent conversation, verified scenario context and tool results go to your local Ollama only. Raw chat is not saved externally. Standard is always available. Stop cancels generation; New/Clear conversation clears in-page dialogue without deleting saved scenarios.

Default endpoint: http://127.0.0.1:11434. Only loopback connections are accepted. Never expose this port, bind it to all network interfaces, or enable wildcard origins.

## Reliable local-only preview

If your browser blocks an HTTPS website from reaching local Ollama, use the local preview:

    python3 scripts/serve_local.py

Open http://127.0.0.1:8765/. Its settings automatically use the same-origin /ollama endpoint. The helper binds only to 127.0.0.1, serves the built application, and forwards only bounded tags/show/chat requests to loopback Ollama. It rejects other origins, foreign Host headers, cloud model tags and arbitrary routes. It is optional and is never deployed to GitHub Pages. Python 3.9+ and Node are required to build locally.

## Direct public-site origin configuration

Direct browser access may require both an exact allowed origin and a browser local-network permission. The origin includes scheme and hostname but no repository path: https://ltuttle99.github.io. For another host, use that page's actual origin. CORS is not authentication. Do not allow arbitrary origins or expose Ollama publicly. Local AI sends messages only after explicit opt-in and Send.

For a terminal-managed Ollama process, use:

    OLLAMA_HOST=127.0.0.1:11434 OLLAMA_ORIGINS=https://ltuttle99.github.io OLLAMA_NO_CLOUD=1 ollama serve

If Ollama is already running, do not start a second process on the same port. Configure/restart your own instance instead, or use the local preview without changing its origins.

macOS application: quit Ollama, then set exact environment values with `launchctl setenv OLLAMA_HOST 127.0.0.1:11434`, `launchctl setenv OLLAMA_ORIGINS https://ltuttle99.github.io`, and `launchctl setenv OLLAMA_NO_CLOUD 1`; reopen Ollama. These settings affect future launches of the app and should be removed with launchctl unsetenv if no longer wanted.

Windows application: quit Ollama, set the same three values in your user environment variables, and restart it. In a PowerShell-managed process, set `$env:OLLAMA_HOST`, `$env:OLLAMA_ORIGINS`, and `$env:OLLAMA_NO_CLOUD` to those exact values before `ollama serve`.

Linux service: use `systemctl edit ollama.service` with [Service] Environment entries for those values, then reload the service manager and restart Ollama. Keep the host loopback-only. Administrative service changes are optional; the local preview avoids widening origins.

## Troubleshooting

Unavailable: start Ollama, run `ollama list`, then reconnect. No models: install one supported local GGUF completion model. Origin rejection: verify the exact origin or use the local preview. Browser permission denied: use the browser's per-site local-network controls if supported, or use the local preview; never disable browser security. Timeout: wait for model loading, select a smaller model, retry, or switch to Standard. Stop is available while loading/responding. Retry replaces the failed turn and reuses its verified-tool ledger; it does not create saved scenarios or execute actions automatically.

No paid inference, cloud credentials or model files are part of Castella. Do not select cloud models. Model wording is untrusted; numerical cards and source references come from validated Castella tools. Quantitative drafts may be withheld until their figures can be checked.

Official references: https://docs.ollama.com/api/chat, https://docs.ollama.com/capabilities/tool-calling, https://docs.ollama.com/faq, https://docs.ollama.com/cloud.
