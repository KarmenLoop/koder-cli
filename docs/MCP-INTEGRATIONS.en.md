# Windows-MCP and code graph setup

Koder provides optional presets for **Windows-MCP 0.8.8** and **CodeGraphContext 0.6.13**. The upstream Python programs and their dependencies are not bundled. The default installed runner uses an existing executable. Configuration does not download, start a service, change PowerShell policy, request elevation or add a login task.

Sources checked October 23, 2026: [Windows-MCP](https://github.com/CursorTouch/Windows-MCP), [its package requirements](https://github.com/CursorTouch/Windows-MCP/blob/e28abb5c6934cb3427190bdb970e02644c915ae3/pyproject.toml), [CodeGraphContext](https://github.com/CodeGraphContext/CodeGraphContext), and [its configuration implementation](https://github.com/CodeGraphContext/CodeGraphContext/blob/93c9685bff9151f50a3121e9913e5ba2d27c1191/src/codegraphcontext/cli/config_manager.py). Preset versions are targets; an installed executable's version must be checked separately.

## Choose from the current terminal

Open `/setup`, then **Applications and MCP**, then **Windows-MCP** or **Code Graph · CodeGraphContext**. Choose diagnostics or save a disabled configuration. You stay in the current terminal. Windows-specific configuration choices are disabled on non-Windows hosts. Existing generic MCP import and remote HTTP configurations still work.

These read-only commands do not need a model, keyring or connection host:

```sh
koder mcp presets --json
koder mcp doctor windows-mcp --json
koder mcp doctor codegraph --json
```

Doctor checks platform and launcher presence without executing it. `launcher-found` is not a verified Python version, successful handshake or working desktop. Missing or unsupported launchers return 2. Explicit enable/connect failure returns 1.

## Windows-MCP

Use native Windows 10/11 with Python 3.14 or newer. WSL is not a native Windows process; run this preset from Windows or explicitly configure an authenticated remote Windows MCP through the existing generic transport. Koder does not silently select a remote computer.

After installing and checking the upstream program yourself, run in the project directory:

```powershell
koder mcp add windows --preset windows-mcp
koder mcp test windows
koder mcp enable windows
koder chat
```

The first command saves a disabled connection. Test connects and discovers actual schemas, then restores the previous disabled state; it does not click or type. Enable explicitly allows the server to run. If PATH discovery fails, give `--command "C:\Users\you\.local\bin\windows-mcp.exe"` during add. The fixed argument is `serve`; no startup installer or task is invoked. Python stdio is configured for UTF-8 and upstream anonymized telemetry is disabled.

Ask Koder to discover this server's tools and perform a specific task. Desktop actions still use Koder's original application approval and durable result records. Full task approval does not grant Windows administrator rights or bypass UAC. An uncertain action result must be checked before retrying.

## Code Graph per project

An installed CodeGraphContext entry point is `codegraphcontext mcp start`. Native dependencies, database drivers and their Python compatibility must be checked locally. The preset chooses LadybugDB and an isolated runtime home and database path per workspace, rather than relying on the user's global graph configuration. The original user's HOME/USERPROFILE are unchanged; only this server process receives the dedicated paths.

In the project you want to inspect:

```sh
koder mcp add graph --preset codegraph
koder mcp test graph
koder mcp enable graph
koder run "Use the configured code graph to inspect the parser callers, read the actual source, and propose the smallest fix."
```

When using `-w`, give the same workspace to each command. Preset aliases resolve within that workspace; a different project does not silently reuse the old alias. The server cwd and allowed roots point to the selected project. Known graph connections for other workspaces are filtered from Agent tool discovery, calls and resource/prompt access. The preset sets `CGC_ALLOW_ALL_PATHS=false`; it never enables a global wildcard.

The Agent is instructed to discover actual tools, inspect indexed repositories/jobs/freshness, then query symbols, callers/callees or imports and read the real source before editing. A missing or stale index is disclosed and source search remains available. Initial indexing, watching directories, arbitrary Cypher and deletion are not run automatically; original approvals apply. A graph edge or dead-code candidate is not proof of behavior, safety or permission to delete a file. Verify the change with the real project tests.

The graph server can read local code; selected tool results enter the configured model conversation. Its native program operates with that OS account's rights. These defaults reduce accidental cross-project use; they are not an OS sandbox for an untrusted executable. Do not supply extra roots, remote DB credentials or a custom executable unless you intend that access.

## Optional pinned uvx runner

If you deliberately choose uvx, Koder records an exact package and Python target. The first explicit start may download packages and Python into the package manager's cache. The ordinary Koder installer and preset configuration do not do this. Prepare dependencies in a visible terminal first if a cold download would exceed an MCP handshake deadline.

```sh
koder mcp add windows --preset windows-mcp --runner uvx
koder mcp add graph --preset codegraph --runner uvx
```

The Windows runner requests Python 3.14 and windows-mcp==0.8.8; the graph runner requests Python 3.13 and codegraphcontext==0.6.13. A full executable path can be provided with `--command`. Do not paste a shell pipeline into that argument. There are no automatic retries that reinstall or replay desktop actions after a timeout.

## Disconnect and verification limits

```sh
koder mcp disable graph
koder mcp remove graph
koder mcp disable windows
```

Disable stops future use; remove deletes the connection and local binding. Graph runtime data remain under the CLI profile's `graph-runtimes` folder until explicitly removed; removal does not delete source files or undo prior desktop actions. Disabling does not revoke remote service tokens at their issuer.

Actual upstream acceptance was added on October 23, 2026: Windows-MCP PowerShell, Snapshot, Click, Type and the public CLI Agent passed on Windows Server 2025; the real graph database and Koder calls passed in an isolated Mac environment. See [actual-call acceptance](MCP-ACTUAL-ACCEPTANCE.en.md) for exact combinations, the Mac OpenSSL 3 prerequisite, resource settings and remaining limits. Windows 10/11 user PCs, other platform combinations and real-model planning are not certified by these tests.
