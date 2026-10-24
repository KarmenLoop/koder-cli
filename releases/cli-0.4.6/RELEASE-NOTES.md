# Koder CLI 0.4.6

This release fixes gaps between the shipped Skills, their CLI controls and the MCP runtime. Windows CMD, PowerShell and macOS installers use the same versioned CLI archive. Existing features, permissions, BYOK settings, project histories and background services are preserved.

## What changed

- **One shipped Skill catalog.** Built-in methods can be discovered, read and selected through the CLI and Agent. Setup and CLI switches use the same owners. Disabled Skills stay unavailable, project names keep their precedence, and selections beyond the first catalog page are recognized.
- **MCP package installation works from the distribution.** The previously omitted private npm 10.9.8 component and its pinned dependencies are included. Local installation tests verify that package lifecycle scripts do not run. This does not install a global npm or automatically install third-party software.
- **Explicit legacy SSE support.** Add/import preserves SSE rather than treating every remote endpoint as Streamable HTTP. Invalid or conflicting transport types fail before connecting. Existing credential, HTTPS, origin, approval and receipt controls remain in force; transport changes do not replay operations.
- **Less irrelevant Skill text in small contexts.** Basic task-method bodies are loaded when relevant instead of all being injected into every request. The Code Graph 8K-context regression passes while app-use guidance and permission policies remain present.
- **Tool failures remain failures when JIT is off.** Missing tools and execution errors carry an error result instead of appearing as successful calls.

## Install, upgrade and learn

Use the [Windows CMD installer](https://karmenloop.com/install/koder-cli.cmd), [PowerShell installer](https://karmenloop.com/install/koder-cli.ps1) or [macOS shell installer](https://karmenloop.com/install/koder-cli.sh), following the [installation guide](INSTALLATION.md). These are CLI installers, not desktop EXE/DMG files. Node is reused when compatible or downloaded and verified privately.

```text
koder update
koder --version
koder skills list --limit 200
koder mcp presets
koder setup
koder learn
```

The version should be `koder 0.4.6`. Clients at 0.4.4 or earlier that reject the larger manifest should run the official installer once without deleting configuration or history. The updater limit introduced in 0.4.5 remains 512 MiB.

Start with the [English guide](USER-GUIDE.en.md), [Chinese guide](USER-GUIDE.zh.md), [MCP and Skill compatibility guide](MCP-SKILL-COMPATIBILITY.en.md), [中文适配教程](MCP-SKILL-COMPATIBILITY.zh.md), and [complete inventory](MCP-SKILL-INVENTORY.md). Thirty interactive lessons and eight bilingual terminal manuals are included.

## Evidence and limits

The selected CLI/kernel regressions cover Skill discovery, guarded resources, selection/switches, MCP stdio/HTTP/SSE, npm installation, app continuation, JIT, Headroom and permissions. The packaged app tests passed after running under their existing 180-second allowance; an earlier aggregate 60-second file timeout is retained. A desktop Electron UI test could not load Electron in this CLI-only environment and remains NOT_RUN for GUI behavior. Artifact and public-download receipts are recorded separately.

The 72-entry inventory contains 68 readable entries, two disabled interface notes and two license-excluded references. This is not a claim that every external application is installed or every Skill workflow has been exercised. Rendering dependencies, target applications, real cloud/mail accounts, live-model quality, Windows 10/11 cold install/update and MCP GUI, OS credential/notification behavior, and macOS Intel-device checks remain separate. Unavailable model presets are not re-enabled by this release.

Published at the user's request without waiting for complete native acceptance. Previous releases and failure records remain available. Preserve configuration, history and uncertain-operation receipts when rolling back. Personal noncommercial use follows the included EULA; third-party licenses and notices retain their original terms.
