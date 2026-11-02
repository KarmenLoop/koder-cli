# Managed tool runtimes

[English](TOOL-RUNTIMES.en.md) · [简体中文](TOOL-RUNTIMES.zh.md)

This guide applies to builds with `koder skills runtime media|playwright|earshot|codegraph`. Koder installs optional engines in its own user directory. It does not replace system Python, install global npm packages, duplicate Skills or enable MCP connections during installation.

Open `/setup` → **Applications and MCP**, then choose FFmpeg / ffprobe, Playwright, EARSHOT or Code Graph. Readiness, installation, connection and successful business calls are separate checks.

```sh
koder skills runtime list
koder skills runtime media install
koder skills runtime media test
koder skills runtime playwright install
koder skills runtime playwright test
```

Installation requires the existing network and skills.update grants. When requested, review and confirm `koder permissions request --capability network --capability skills.update`. `--yes` does not grant them. Fixed downloads show MB progress, retain partial files and verify complete SHA-256 digests before use. Ctrl+C cancels the installation and terminates its owned process tree. Cancelled or failed installations do not publish partial runtimes.

## Browser and media tools

FFmpeg and ffprobe install together. Distribution tag `b6.1.1` is not the binary version; `media test` prints the actual versions. Playwright installs a pinned CLI and matching modules. Use an installed Chrome or explicitly download an isolated browser:

```sh
koder skills runtime playwright browser
```

The launcher selects managed Chromium when Chrome is absent. Version probes do not run the upstream npm update check. Ubuntu still needs the browser's OS libraries. Missing libraries produce a process error; Koder does not run sudo or change system security settings. No browser or desktop grant is created by installing the launcher.

Approved Koder shell tools receive the managed PATH plus `KODER_FFMPEG`, `KODER_FFPROBE`, `KODER_PLAYWRIGHT_MODULE` and `PLAYWRIGHT_BROWSERS_PATH`. An installed Chrome can also supply `KODER_CHROME`. These are child-process settings, not global shell configuration. Browser tasks use their own profile, not the user's browsing profile.

## EARSHOT

```sh
koder skills runtime media install
koder skills runtime earshot install
koder skills runtime earshot test
koder skills runtime earshot models
koder mcp add earshot --preset earshot --runner managed
koder mcp test earshot
koder mcp enable earshot
koder mcp doctor earshot --runner managed --probe
```

The models step downloads and loads about 1.1 GB of CLAP / AST weights. Tasks then use the offline cache. `needs-setup` means the program starts but a decoder or model is still missing; inspect `checks.problems`. Do not use `pip install earshot`: that PyPI name identifies a different project. Koder pins Leonxlnx/earshot to the recorded source commit.

The engine has its own Python target and CPU PyTorch. It does not share CodeGraph's incompatible MCP dependency version. Windows uses a separate Python 3.13 without replacing Windows-MCP's Python 3.14. Managed semantic audio targets Apple Silicon macOS 14+, Windows x64 and Linux x64/arm64. The current Python/PyTorch combination has no macOS Intel wheel; that target is rejected explicitly. A separately validated external `--runner installed` engine remains available.

Ask the Agent to measure and describe a known audio file in the selected project. It must discover real schemas with `app_tools`, request approval through `app_call`, and report actual results. Installation does not enable microphone recording or cloud audio upload. Native `koder audio measure` WAV measurements remain available independently.

## CodeGraphContext

Run from the project to index, or pass the same `-w` directory to each command:

```sh
koder skills runtime codegraph install
koder skills runtime codegraph test
koder mcp add graph --preset codegraph --runner managed
koder mcp test graph
koder mcp enable graph
koder mcp doctor codegraph --runner managed --probe
```

The managed engine uses Kuzu 0.11.3 and a pinned parser bundle. It needs no Neo4j server, Docker or Homebrew OpenSSL. Each project has its own runtime home, index and allowed root. Existing installed/uvx configurations are unchanged.

Indexing is an explicit operation. The Agent calls `add_code_to_graph`, polls the returned `job_id` through `check_job_status`, and waits for `job.status === "completed"`. It then queries `find_code` or `analyze_code_relationships` and reads the source. The actual caller query is `find_callers`. An accepted background job is not a completed index. Out-of-workspace indexing is rejected. Graph results guide navigation; they do not prove tests pass or authorize deletion of dead-code candidates.

## Storage and diagnostics

Pinned URLs, sizes, hashes and dependency versions are in `src/tool-runtime-assets.json`. Prepared engines retain `runtime.json`, `inventory.json`, upstream licenses and, for Python, `constraints.txt` and `pip-report.json`. Explicit `test` validates the full inventory. Ordinary status checks do not scan gigabytes of dependencies on every turn.

EARSHOT writes its Numba compilation cache to `audio-runtime/numba` in the data directory, outside the verified dependency inventory. Normal analysis does not modify the installed code, so later tasks do not require weakening integrity checks.

Measured macOS arm64 runtime sizes were roughly 87 MiB for media, 18 MiB for Playwright, 990 MiB for EARSHOT and 660 MiB for CodeGraph, excluding shared Python, browser files, download caches and audio weights. Allow several GB for the complete workflow. Engines are shared across projects; models and indexes load only for relevant tasks.

`TOOL_RUNTIME_CHECKSUM` or `TOOL_RUNTIME_FILES_CHANGED` blocks use of mismatched content. Preserve the report rather than bypassing verification. `TOOL_RUNTIME_PROCESS_FAILED` includes the exit code and bounded stderr; `TOOL_RUNTIME_TIMEOUT` and `TOOL_RUNTIME_CANCELLED` distinguish waiting from cancellation. Missing permissions follow the existing permissions flow.

## Acceptance recorded November 2, 2026

Real macOS arm64 checks covered WAV creation and probing; isolated Chrome and managed Chromium launch, title, click, snapshot and close; the media Skill's HTML-to-MP4 render; EARSHOT discovery of 16 tools plus measurement and description; CodeGraph discovery of 29 tools, Python/JavaScript indexing, caller lookup and an out-of-workspace denial. The Koder Agent route used a deterministic model fixture with real MCP processes and tools, including approval, receipt and model continuation.

Windows and Ubuntu native installation/GUI, macOS Intel, broader business media and paid-model tool-selection quality are **NOT_RUN**. A successful startup probe is not acceptance of every upstream tool. See [third-party notices](../THIRD_PARTY_NOTICES.md) and the [MCP integration guide](MCP-INTEGRATIONS.en.md).
