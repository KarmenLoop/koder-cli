# Koder CLI 0.4.14-candidate.2

This unpublished candidate adds task-completion reminders on top of candidate.1. It preserves the existing executor, model and effort controls, queue, Todo, Skills, CLI-Anything integration, permissions, mail and conversation history.

## Task reminders

Completed chat, run and resident-agent tasks share one notification decision and dispatch path. The default long-task threshold is two minutes. Short successful conversations and positively focused foreground successes stay quiet unless explicitly requested; failure, waiting for input and cancellation have separate controls. Cancellation reminders default to off. Notifications use generic text and never include task prompts, email bodies, source code or diffs.

The task-notice daily budget is separate from proactive reminders. Quiet hours inherit the resident-agent setting unless overridden. Eligible successes retain only the latest configured backlog, defaulting to three, for a later summary. Changing the retention limit also removes older excess entries, so they cannot appear in successive stale summaries.

Deduplication is reserved before native dispatch under the existing private cross-process lease. A submitted or uncertain result never falls through to another channel. A needs-input notice and the later terminal state share one task identity; terminal metadata can update without a second notification. Task ownership is fixed at the starting account, and live authority is rechecked before each native or fallback effect. The Windows focus query uses a validated flat PowerShell argument list.

Use `koder notifications status` to inspect, `koder notifications test task-done` to test the local channel, and `koder notifications task-done off` to disable task reminders. The explicit test is a diagnostic, not a completed model task or an automatic-budget charge. Setup exposes the same preferences.

## Continuation and platform limits

`koder open <opaque-token>` opens the original workspace and conversation through the existing session path, without submitting the old prompt again. Lookup rejects foreign identities, invalid tokens and changed workspaces. Windows protocol support requires verified current-user registration. Linux and macOS use textual continuation when clicking is unavailable.

Native command receipts are distinct from visible display. Windows Server does not establish Windows 10/11 desktop acceptance; a virtual Linux desktop does not establish physical X11 or Wayland display; successful AppleScript submission does not prove a macOS banner was visible. The [acceptance record](TASK-NOTIFICATIONS-ACCEPTANCE.md) records each layer separately. macOS ARM64 command submission returned submitted in the extracted candidate. Windows/Linux hosted acceptance was blocked before job startup by GitHub account billing; those native rows remain NOT_RUN. Previous failures and untested device behavior remain open.

## Test and roll back

Use the [Chinese walkthrough](TASK-NOTIFICATIONS.zh.md), [English guide](TASK-NOTIFICATIONS.en.md) and the included `docs/task-notification-check.mjs` to test an extracted package in a private temporary profile. The checker does not activate a service, use model credentials or replace an active CLI installation.

Keep the retained candidate.1 or released 0.4.13 installation for rollback. Task notification configuration is additive. Turning the feature off leaves all conversations and original permissions intact. Preserve notification receipts, especially UNKNOWN outcomes, rather than deleting them to retry an uncertain effect. This file is not a public release receipt.
