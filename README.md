# pi-agy

Standalone **Antigravity (`agy`)** provider extension for [Pi Coding Agent](https://pi.dev) — written in TypeScript, following the exact authentication, wire protocol, and backend RPC identification of the official `agy` CLI (`v1.4.2`, `cl=985595000`) **without requiring `agy.exe` to be installed**.

---

## Key Features

1. **Zero Binary Dependency**: Runs 100% natively in TypeScript over HTTPS/SSE (`daily-cloudcode-pa.googleapis.com/v1internal:*`). Does not spawn or require `agy.exe`.
2. **Native Pi `/login agy` & `/logout` Support**:
   - Registers provider ID `agy` (and display name `agy` in `/model`, `/login`, and `/logout`).
   - Uses single-account OAuth 2.0 + PKCE stored directly in Pi's `~/.pi/agent/auth.json` (no multi-account failover bloat).
3. **Live Model Catalog & Dynamic Refresh**:
   - Automatically discovers and updates models via `/v1internal:fetchAvailableModels` on startup and via `/agy-refresh`.
   - Includes **Gemini 4 Argon** (`low` / `medium` / `high`), **Gemini 3.8 Flash** (`low` / `medium` / `high`), **Claude Opus 5.5** (`low` / `medium` / `high`), **Claude Sonnet 5.5** (`low` / `medium` / `high`), and **GPT-OSS 120B** (`medium`).
4. **Usage, Quota Pools & Model Availability**:
   - `/agy-usage`: Inspect shared 5-hour and weekly quota pools via `/v1internal:retrieveUserQuotaSummary`.
   - `/agy-models [all]`: View per-model availability, remaining pool percentage, reset timers, and capability flags.
5. **Image Generation (`/generate-image` & `generate_image` tool)**:
   - Generate images via Gemini image models (`gemini-3.1-flash-image` / `gemini-3-pro-image`) with aspect ratio control (`1:1`, `16:9`, `9:16`, `4:3`, `3:4`, etc.).
6. **Google Search Grounding (`/agy-search` & `google_search` tool)**:
   - Real-time Google Search grounding with source citations and optional URL analysis.
7. **Health & Diagnostics (`/agy-doctor`)**:
   - Inspects authentication state, resolved Cloud Companion `projectId`, wire User-Agent fingerprint, active model catalog, last endpoint status, and latency.

---

## Installation

### From GitHub
```bash
pi install git:github.com/amirulaliffcherahim/pi-agy
```

### From Local Directory
```bash
pi install /path/to/pi-agy
```

---

## Authentication

### Sign In
Run in Pi:
```text
/login agy
```
This opens your browser to Google OAuth 2.0 with PKCE (`S256`), captures the callback on `http://localhost:51121/oauth-callback` (or accepts a pasted callback URL on headless machines), resolves your Cloud Code Companion project via `/v1internal:loadCodeAssist`, and saves the credential under `"agy"` in `~/.pi/agent/auth.json`.

### Sign Out
Run in Pi:
```text
/logout
```
Select `agy` from the selector to remove the stored OAuth credentials from `~/.pi/agent/auth.json`.

---

## Model Selection

Open `/model` or select directly:
```text
/model agy/gemini-4-argon
/model agy/gemini-3.8-flash
/model agy/claude-opus-5-5
/model agy/claude-sonnet-5-5
/model agy/gpt-oss-120b
```
Use `/thinking` (or `Ctrl+T`) to switch reasoning effort (`low`, `medium`, `high`), which routes to the corresponding backend runtime variant and thinking budget.

---

## Slash Commands

| Command | Description |
| :--- | :--- |
| `/agy-doctor` | Show sanitized `pi-agy` provider health, auth status, project ID, wire fingerprint, and last request diagnostics. |
| `/agy-usage` | Show shared quota pools (Gemini pool, Claude/GPT pool, 5-hour and 7-day reset windows). |
| `/agy-models [all]` | List available backend models, remaining pool percentage, reset countdowns, and supported modalities. |
| `/agy-refresh` | Force refresh the dynamic model catalog from `/v1internal:fetchAvailableModels`. |
| `/generate-image [--ratio 16:9] [--model <id>] [--path <file>] <prompt>` | Generate an image using Antigravity Gemini image models and save to disk. |
| `/agy-search [--thinking] [--url <url>] <query>` | Run a grounded Google web search with citations. |

---

## Model-Facing Tools

- **`generate_image`**: Allows the active agent to generate images on demand and saves them under `.pi/generated-images/` (or a custom path). Disable with `AGY_NO_IMAGE_TOOL=1`.
- **`google_search`**: Allows the active agent to perform grounded Google searches with citations. Disable with `AGY_NO_SEARCH_TOOL=1`.
- Disable both extra tools with `AGY_NO_EXTRA_TOOLS=1`.

---

## Architecture & Wire Protocol Details

### 1. Client Identity & Wire Headers
All requests to `daily-cloudcode-pa.googleapis.com` use the exact `agy` CLI v1.4.2 wire fingerprint:
```text
User-Agent: antigravity/cli/1.4.2 (aidev_client; os_type=linux; arch=amd64; cl=985595000; auth_method=consumer)
Authorization: Bearer <oauth_access_token>
Content-Type: application/json
```

### 2. Endpoint Fallback Chain
1. `https://daily-cloudcode-pa.googleapis.com` (Primary)
2. `https://daily-cloudcode-pa.sandbox.googleapis.com` (Sandbox fallback)
3. `https://cloudcode-pa.googleapis.com` (GA fallback)

### 3. RPC Methods
- **Project Discovery**: `POST /v1internal:loadCodeAssist` & `POST /v1internal:listCloudAICompanionProjects`
- **Catalog & Per-Model Quotas**: `POST /v1internal:fetchAvailableModels` (`{ project: projectId }`)
- **Quota Summary**: `POST /v1internal:retrieveUserQuotaSummary` (`{ project: projectId }`)
- **Streaming Chat / Tool Calls**: `POST /v1internal:streamGenerateContent?alt=sse`

### 4. Environment Overrides

| Variable | Description |
| :--- | :--- |
| `AGY_PROJECT_ID` | Override the discovered Cloud Companion project ID. |
| `AGY_BASE_URL` | Override the Cloud Code PA endpoint base URL. |
| `AGY_USER_AGENT` | Override the `User-Agent` header. |
| `AGY_RUNTIME_MODEL` | Pin a specific backend runtime model ID. |
| `AGY_CATALOG_REFRESH_INTERVAL_MS` | Override automatic catalog refresh TTL (default: 4 hours). |
| `AGY_NO_EXTRA_TOOLS` | Set to `1` to disable both `google_search` and `generate_image` tools. |
| `AGY_NO_IMAGE_TOOL` | Set to `1` to disable the `generate_image` tool. |
| `AGY_NO_SEARCH_TOOL` | Set to `1` to disable the `google_search` tool. |

---

## License

MIT
