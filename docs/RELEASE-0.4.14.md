# Koder CLI 0.4.14

This release combines the reviewed 0.4.14 candidate increments into the Windows and macOS distribution. The existing 180-lesson classroom is retained; the proposed 1,800-lesson expansion is deferred.

## What changed

- Choose a saved model with Ctrl+P and thinking effort with Ctrl+E. Changes during work apply to the next turn; the footer separates active and pending choices. Unsupported provider settings are reported rather than silently claimed.
- Manage later tasks separately from Todo with `/queue on`, `/queue remove N` and `/queue clear --yes`. Queue receipts preserve ordering, and drafts never approve tool actions.
- Receive configurable task-completion reminders through the existing Windows Toast, macOS and Linux notification adapters. Short focused successful conversations stay quiet. Task notices have separate daily limits, quiet hours and durable deduplication; submission does not prove a visible banner.
- Discover and invoke reviewed CLI-Anything adapters through the existing approval and process-control path. The bundled catalog does not automatically install native apps or grant computer access.
- Recover more clearly from uncertain commands. Narrow read-only PowerShell searches with suppressed read errors report partial results instead of blocking later work after a clean exit. Uncertain writes, timeouts and incomplete cleanup still require reconciliation.
- Show the original command and uncertainty reason. Read-only preview status/discovery remains available during reconciliation; steering explains that it stays in the same turn. Repeated blocked effects stop with an actionable receipt rather than looping indefinitely.
- Skip inaccessible search descendants without ignoring root authorization failures, identify missing Skills by exact ID, and suppress duplicate mailbox-network warnings until recovery.

## Install or update

Use the [official downloads](https://karmenloop.com/download.html#cli) or `koder update`, then confirm `koder --version` reports **0.4.14**. Windows CMD and PowerShell and macOS shell installers select the same versioned CLI archive. Desktop and TUI application versions are separate.

Existing conversations, configuration, mail connections, GitHub tools, workspace isolation, permissions and 180 lessons remain. The release does not activate a service, authorize computer control, send email or retry an unresolved external effect on its own.

## Verification and limits

The fixed candidate source passed 357 targeted no-key regressions with zero failures, skips or cancellations. Release-package, installer and public-download checks are recorded separately. Scripted providers and process fixtures do not establish model-quality gains or real-account delivery.

Native Windows 10/11 installation, PowerShell 5.1 cold start, ConPTY/IME, Windows-MCP GUI, real mailbox/API/account operations, and visible notification/click behavior retain their separate NOT_RUN status. The earlier macOS notification command returned submitted with displayVerified=false. The unsigned macOS locked-use prototype is excluded. Publication is authorized without relabeling these outstanding checks as passed.

## Recovery

Run `koder notifications status` for notification diagnostics. An uncertain command receipt remains in history: inspect it and the target state before requesting remaining work. An existing preview URL does not prove that an earlier command succeeded.

Keep the versioned 0.4.13 package for rollback. Do not remove configuration, conversations or UNKNOWN receipts to force retries. Historical candidate notes and failure records remain available.

[Session controls](SESSION-CONTROLS.en.md) · [Task notifications](TASK-NOTIFICATIONS.en.md) · [Command recovery](SHELL-RECOVERY.zh.md) · [CLI-Anything](cli-anything.md)
