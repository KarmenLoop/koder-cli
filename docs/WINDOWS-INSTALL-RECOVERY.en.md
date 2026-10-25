# Windows installation recovery

Applies to Koder CLI 0.4.10; earlier failure records remain available in the release history. Start with the [bundled Windows-MCP guide](WINDOWS-MCP-BUNDLED.en.md). Windows x64 already includes its private Python runtime; no global winget or pip installation is necessary.

## A command timed out

Ordinary shell commands default to 300 seconds (5 minutes). Recognized direct winget, pip, npm/pnpm and yarn installs default to 900 seconds (15 minutes). An explicit request can allow 1–1,800,000 milliseconds (up to 30 minutes) and remains part of the original command approval. Explicit shorter deadlines and existing approvals are not extended. A command such as curl -m 20 has its own independent limit. See [command duration and saved progress](COMMAND-DURATION.md). A larger wait does not grant administrator access or change system execution policy.

`COMMAND_RESULT_UNCONFIRMED` or `SHELL_RECONCILIATION_REQUIRED` means the result is uncertain. Keep the output and inspect the install status/log before trying again. A detached `start` or `Start-Process` returning 'started' proves only that a launch was attempted. Cleanup does not prove that installation changes were rolled back.

The existing task loop can continue bounded read-only diagnosis. It must not replay the original install, send mail or publish while that shell result needs reconciliation. `HARNESS_JIT_STOP` reports the orchestration limit, not a proven network, SMTP or Python failure.

## Inspect the bundled connection

Run these one at a time in CMD or PowerShell:

```text
koder --version
koder mcp doctor windows-mcp --json
koder mcp list
```

If no connection exists, follow the add/test/enable steps in the bundled guide. An older installed/uvx entry is preserved: do not start a second installer while it is still running. Integrity failures need a clean official package, not disabled verification. Keep the exact diagnostic for support at info@karmenloop.com; never include an API key or mail authorization code.

Windows client cold installation, GUI and UAC acceptance remain unverified for this release. The local regression checks do not establish those outcomes.
