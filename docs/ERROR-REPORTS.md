# Task diagnostics and support reports

Koder CLI 0.5.21 adds a diagnostic card for failed or unverified tasks. It shows a report ID, machine-readable codes, a bounded explanation, execution counts and the next step. Unknown causes remain unknown. Report creation does not retry a task or grant permissions.

In chat, use `/error` to view the most recent diagnostic from that window, `/error json` for JSON, and `/error copy` to copy it. These commands do not call a model or send the report. A new chat does not inherit another window's report.

From a system terminal:

```text
koder logs report
koder logs report KR-20261029-012345abcdef --json
koder logs report KR-20261029-012345abcdef --copy
```

Replace the example ID with the ID on your card. Without an ID, the command reads the latest retained report in the current Koder data directory. This may be from another window. To save a file, redirect `--json` to `koder-error-report.json`. `koder feedback` provides the support address; users choose whether to send it.

Reports distinguish verified operations, returned results, failed calls, unconfirmed effects and calls that were not attempted. They include version, platform, time, codes, bounded counts, hashed task/call identifiers, reported usage, recognizable model metadata and available internal relative source locations. They exclude prompts, arguments, tool output, absolute paths, raw exception messages, raw stacks, email content and credentials. JSON is projected through the same allowlist again when read.

The reports reuse the existing private runtime log and its rotation. Each log generation is bounded at about 4 MiB; current and previous generations are retained. Explicit report lookup reads up to the latest 1,000 reports in those generations. Save important reports before they rotate out. If storage is unavailable, the card says so instead of claiming it was saved.

Local telemetry is on by default. `koder setup telemetry off` stops automatic report storage for subsequent tasks. The current chat still supports viewing and explicit copying. Existing logs, execution receipts, cancellation, cost limits and permission checks remain intact. Nothing is uploaded automatically.

Clipboard support reuses Windows `clip`, macOS `pbcopy`, and Linux `wl-copy`, `xclip` or `xsel`, with bounded waits. An unavailable clipboard produces `REPORT_CLIPBOARD_UNAVAILABLE` and the report for manual copying. No software is installed automatically.

Common distinctions:

- `MODEL_INCOMPLETE` is a single-response output limit; context limits have separate codes.
- `MAIL_SMTP_NOT_CONFIGURED` concerns sending. Run `koder mail doctor --json` to inspect receiving and SMTP separately.
- `MAIL_AUTH_FAILED` means authentication was rejected, not that the saved binding disappeared.
- `TOOL_RESULT_UNCONFIRMED` and `SHELL_RECONCILIATION_REQUIRED` require checking receipts and actual state before another operation.
- `TASK_DELIVERY_INCOMPLETE` is not a verified deliverable. A saved SKIP is not a correct answer.
- `COMMAND_TYPE_ERROR` identifies an internal type exception; an available relative source location helps support locate it.

Background-mail reports are marked `background-mail` and use existing error deduplication. They do not mark the foreground task as failed. Failure JSON for `run` and `ask` gains an additive `diagnostic` object. Early exceptions also produce a nonempty explanation.

See the [Chinese walkthrough](ERROR-REPORTS.zh.md) for step-by-step instructions. Windows physical checks and the dedicated 163 mailbox remain beta-owned; source and loopback tests do not establish production mailbox or native desktop acceptance.
