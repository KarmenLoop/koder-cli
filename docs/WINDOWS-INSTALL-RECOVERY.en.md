# Windows installation recovery

Applies to Koder CLI 0.4.5. Start with the [bundled Windows-MCP guide](WINDOWS-MCP-BUNDLED.en.md). Windows x64 already includes its private Python runtime; no global winget or pip installation is necessary.

## A command timed out

Ordinary shell commands default to 20 seconds. Direct winget/pip installs default to 120 seconds. An explicitly requested timeout can be between 1 and 300,000 milliseconds and remains part of the original command approval. A larger wait does not grant administrator access or change system execution policy.

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
