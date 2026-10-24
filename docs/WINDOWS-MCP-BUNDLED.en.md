# Bundled Windows-MCP

Koder CLI 0.4.5 includes Windows-MCP 0.8.8, CPython 3.14.8 and pinned dependencies for native Windows 10/11 x64. No global Python, pip or uvx installation is needed. This component does not run on macOS. A native ARM64 bundle is not included.

The upstream project is [CursorTouch/Windows-MCP](https://github.com/CursorTouch/Windows-MCP), pinned to release commit `b74c507d9e709223a0904cf08019edf55f2a75bb`. Windows-MCP is MIT-licensed. Python and its dependencies retain their own licenses, including the GPL and MPL components identified in `vendor/windows-mcp/NOTICE.md`. Corresponding source archives are included. Koder's proprietary restrictions do not replace those component licenses.

Open `/setup` → Applications and MCP → Windows-MCP. Configure the bundled connection, test its handshake and discovered tools, then enable it. Configuration alone stays disabled. Alternatively, run these commands one at a time in CMD or PowerShell:

```text
koder mcp doctor windows-mcp --json
koder mcp add windows-mcp --preset windows-mcp
koder mcp test windows-mcp
koder mcp enable windows-mcp
koder mcp tools windows-mcp
```

`doctor` verifies local files without starting desktop automation. `test` starts the real server and discovers its schemas, then restores a previously disabled connection. After it reports `connected`, ask Koder in the same project to perform an authorized desktop task. The agent uses `app_tools` and `app_call`, observes the result, and reports any uncertainty. Tool coverage includes application/window operations, snapshots, input, shortcuts and PowerShell; the connected server's schemas are authoritative.

Use `koder mcp disable windows-mcp` to disconnect it or `koder mcp remove windows-mcp` to remove its configuration. Existing installed/uvx configurations remain unchanged. `--runner installed --command "C:\\path\\windows-mcp.exe"` and `--runner uvx` are still supported. Check existing entries before adding a duplicate. After upgrading, an older absolute launcher path can be replaced by explicitly disabling and reconfiguring that connection; Koder does not force a migration while another task may be using it.

The bundled runner uses stdio, opens no HTTP listener, creates no startup task, disables anonymized telemetry, and performs no runtime package download or privilege elevation. Original Koder approvals, cancellation and uncertain-effect receipts remain in charge. A contradictory window-switch receipt is not treated as verified success. Respect upstream user takeover; do not seize control back from the user.

An interactive logged-in desktop is required. Lock screens, UAC secure desktop and elevated applications may be inaccessible. ARM64, 32-bit Windows, WSL and macOS are not silently treated as supported local x64 hosts. Use the existing generic transport for an explicitly configured remote Windows service.

`WINDOWS_MCP_BUNDLE_INTEGRITY` indicates missing or changed files: verify the installation rather than disabling checks. Keep `mcp test` and `mcp doctor` diagnostics when startup fails. Package integrity, SDK/agent fixtures, isolated Windows Server execution and native Windows 10/11 acceptance are separate evidence levels. Consult the release notes for exact results; none certifies every application or a real model's planning quality.
