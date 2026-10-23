# Actual Windows-MCP and Code Graph acceptance

Recorded October 23, 2026, after publication of Koder CLI 0.4.0-preview.28. The published installer bytes remain unchanged. This report replaces the earlier “upstream programs not run” status only for the combinations below. Presets remain disabled until the user enables them.

## Tested combinations

| Integration | Environment | Actual checks | Result |
| --- | --- | --- | --- |
| Windows-MCP 0.8.8 | Disposable GitHub-hosted Windows Server 2025, x64, Python 3.14.8; public preview.28 package | Stdio initialization and discovery; PowerShell writes an owned file and an independent reader verifies it; Snapshot sees an owned WinForms window; Click and Type enter a marker verified by the window's text-change handler; the window closes normally | Passed |
| Koder with Windows-MCP | The same runner and unmodified public preview.28 package | Explicit license acceptance, preset add/enable, connection test, Agent discovery, actual PowerShell call, independent file readback and model continuation | Passed |
| CodeGraphContext 0.6.13 with Ladybug 0.19.1 | Isolated Python 3.12.14 venv on Apple silicon, macOS 27.0; OpenSSL 3 libraries in the test directory; 256 MiB database buffer | Index three Python files, complete the real background job, reopen the index in another process, inspect stats, find a function, identify its caller, verify an absent symbol and reject an outside-root indexing request | Passed |
| Koder with Code Graph | Existing Koder host, SDK and Agent against the actual upstream process | Discover each required schema, run three real graph calls under three approvals, read the source and continue in the same task | Passed |

Windows evidence: [successful hosted run](https://github.com/KarmenLoop/koder-cli/actions/runs/39905571499), revision 47a60fe524417cd628d89549125746e0621d32fa. The test uses the public package with SHA-256 `309d6c159ca432538ff8b90afd4e77a01cf28d4b38aba9eb4f8e535aeb9e8672`.

Both Agent tests use scripted model responses to exercise tool dispatch and continuation. They do not call a paid model API or establish a real model's planning ability. The Mac graph test uses an owned encrypted credential test port to avoid the user's keychain; it does not certify macOS native credential storage. The Windows test uses the published CLI and its normal host.

## Windows setup and a first check

Use the same project directory for every command, or repeat the same `-w` argument. Start with an installed Python 3.14+ executable matching the OS architecture. A user-local environment avoids administrator installation:

```powershell
$runtime = Join-Path $env:LOCALAPPDATA 'Koder Tools\windows-mcp-0.8.8'
py -3.14 -m venv $runtime
& "$runtime\Scripts\python.exe" -m pip install 'windows-mcp==0.8.8'
koder mcp add windows --preset windows-mcp --command "$runtime\Scripts\windows-mcp.exe"
koder mcp test windows
koder mcp enable windows
```

The equivalent entry is `/setup` → Applications and MCP → Windows-MCP. If running an extracted archive directly, read `koder eula` and explicitly run `koder eula accept` only after agreeing. The installer's `KODER_EULA_ACCEPT=1` setting does not silently accept the CLI's runtime agreement.

First ask Koder to inspect its owned test window, then perform a small action there. The upstream tool names verified here are `PowerShell`, `Snapshot`, `Click` and `Type`; discover the actual schemas instead of relying on old examples named Shell or State. No administrator elevation, persistent PowerShell policy change or login task was tested or added.

## Mac graph native dependency and resource limits

The first real startup failed before MCP initialization: the Ladybug wheel linked to OpenSSL 3 libraries under `/opt/homebrew/opt/openssl@3/lib`. The visible “C API shared library missing” fallback hid the original native import error. A fresh Ladybug-only process confirmed that the missing OpenSSL libraries caused this failure; a Kuzu/Ladybug type collision was not the cause of this run.

Provide a compatible OpenSSL 3 installation before testing this combination. With Homebrew already installed, its normal dependency command is `brew install openssl@3`; this is a separate user action, not part of Koder installation. A custom, trusted library directory can instead be passed to the graph child explicitly. The test used SHA-256-verified official Homebrew libraries in its own directory and changed no system library paths.

```sh
export KODER_CGC_LIBDIR='/absolute/path/to/trusted/openssl3/lib'
export KODER_CGC_BUFFER_MB=256
koder mcp add graph --preset codegraph --command /absolute/path/to/venv/bin/codegraphcontext --env-ref DYLD_LIBRARY_PATH=KODER_CGC_LIBDIR --env-ref CGC_EMBEDDED_BUFFER_POOL_MB=KODER_CGC_BUFFER_MB
koder mcp test graph
koder mcp enable graph
```

Use `DYLD_LIBRARY_PATH` only when this native dependency needs it. The graph target is still the pinned CodeGraphContext 0.6.13 program. The 256 MiB setting was sufficient for this small acceptance project; it is not a large-repository performance guarantee. A matching native-library path must reach the actual Python process; an intervening macOS system launcher can strip DYLD variables. The tested route launches the venv executable directly.

Indexing is an explicit, approved action. `check_job_status` reports its state under `job.status`; wait for actual completion. Use the actual `find_code` schema and `analyze_code_relationships` with `query_type: find_callers` or `find_callees`. Query `app_tools` for the specific tool name rather than loading the entire catalog. Large results return an artifact reference and `app_result_read` supports bounded pages. Read the source after following graph relationships.

## Boundaries that remain open

Windows 10/11 user PCs, Chinese IME composition, UAC/admin actions, Code Graph on Windows/Linux, uvx cold downloads, real provider accounts, autonomous model planning, large repositories and long-running use have not been certified by this run. The static acceptance fields in the preview.28 catalog describe its publication snapshot, not a blanket certificate for every platform.

The seven held model routes remain unavailable. No test scanned user projects, used a real mailbox or API key, changed billing, modified global dependencies, interrupted another task, or silently enabled a preset. Earlier dependency failures and test-driver mistakes remain in the acceptance record; only the corrected, observed runs are marked passed.
