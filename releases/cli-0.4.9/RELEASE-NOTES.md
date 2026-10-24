# Koder CLI 0.4.9

This release fixes live task input and makes incomplete tasks easier to diagnose. Windows CMD, PowerShell and macOS use the same versioned CLI runtime with shell-specific installers.

## What changed

- Local steering now waits for session preparation. Agentd steering waits for the real acceptance receipt. Rejected input shows a specific reason before queueing; an unknown remote receipt is not replayed automatically.
- Busy chat keeps its slash menu. Context suggestions, templates and commands fill editable drafts without sending them. Narrow or unsupported terminals receive a readable fallback. Escape closes an open menu; another Escape cancels the task.
- Interruption uses exact words or punctuation-delimited replacements. “stop a server” remains task text; “stop, say NEXT” cancels and queues the replacement. Asynchronous rejection receipts preserve FIFO input order.
- New koder logs commands and the read-only diagnostics_runtime_log tool expose bounded local runtime metadata. Logs rotate at 4 MiB and omit task bodies, model text, mail content and credentials.
- Unresolved permission failures and empty results now produce actionable text and a nonzero result. Successful diagnostic reads of earlier errors do not count as new failures.

## Use it

Run koder --version after upgrading. In chat, open /setup and choose Mid-run input: Steer (default) or Queue. While a task runs, type another sentence and press Enter. Press / on an empty line to browse options; Tab fills the selected draft. Press Ctrl+C to cancel the current task.

Use koder logs --tail 100, koder logs --path or koder logs --json. koder doctor shows the log location and input-module status. The privacy guide documents storage and deletion.

Version 0.3.0 does not contain these input modules. Run the current official installer or a supported koder update to obtain them; changing Setup cannot retrofit an old binary. If a 0.4.4-or-earlier updater rejects the larger package manifest, rerun the official installer without deleting user data.

## Preserved behavior and verification limits

Automatic software/model updates, Skills, MCP, mail, independent windows, authorization, EULA consent and agentd remain in place. --yes does not grant computer access. Queued text cannot approve a pending operation. Headless run --json does not receive an interactive menu.

No-key regression checks exercise actual CLI/readline, the harness, local IPC, temporary files and scripted providers. They do not certify native PowerShell 5.1 cold startup, Windows Console/ConPTY/IME, Windows-MCP GUI operation, real mailbox delivery or model quality. Those items remain NOT_RUN for this release.

[Live input](SESSION-INPUT-AND-SKILLS.en.md) · [Prompt menu](PROMPT_PREFILLS.md) · [Runtime diagnostics](RUNTIME-DIAGNOSTICS.md) · [Automatic updates](AUTO-UPDATE.en.md) · [Installation](INSTALLATION.md)
