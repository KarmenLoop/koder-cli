# Koder CLI 0.4.13

## What changed

- Keep an editable input line visible while replies stream and tools run. The compact layout uses two rows without a checklist, or three with a collapsed Todo summary. Multiline drafts grow as needed.
- Track multi-step work in a session Todo list. Press Ctrl+T or enter `/todo toggle` to expand it, up to six rows. The same session restores its list; cancellation returns active items to pending and preserves completed entries. Checklist marks are not proof of execution.
- Show the current model, task state, queued count and shortcuts in one footer. Configure the layout in Setup → Session interface; `/reload-tui` reloads those preferences without resetting the conversation.
- Open a scrollable `/help` panel and use `/` to select an editable prompt. Menus fill drafts without sending. Mid-run steering, FIFO queueing, cancellation and fresh approval remain in the existing execution path.

The 180-lesson Chinese classroom, original 30 English lessons, encrypted device migration, GitHub integration, mail, MCP, Skills, provider routing, independent windows and permission boundaries remain available. This release does not replace the executor or add a second memory store.

## Install or update

Use the [official download page](https://karmenloop.com/download.html#cli) or run `koder update`. Confirm `koder --version` reports **0.4.13**. Windows CMD, Windows PowerShell and macOS use their platform installers and the same versioned CLI runtime. Desktop application versions are separate.

Start `koder chat`, type `/help`, then try a multi-step task. Keep typing during work; Enter steers by default, or queues when that mode is selected in Setup. A steering receipt means the input was accepted for the next safe boundary, not that an in-flight model request was rewritten. Ctrl+J inserts a newline only when the terminal distinguishes it from Enter; paste multiline input otherwise.

[Compact input and Todo guide](SESSION-DOCK.en.md) · [Complete guide](USER-GUIDE.en.md) · [Chinese classroom](courses/index.zh.html) · [Device migration](DEVICE-MIGRATION.en.md)

## Verification and remaining limits

The session-dock candidate passed 146 targeted no-key regressions with no failures or skips. A real macOS PTY exercised seven CLI stages with a scripted provider: idle input, Todo, steering, draft retention, completion and help navigation. These checks cover local terminal rendering, authenticated loopback IPC, session isolation, approvals and mail-input regressions; they do not measure model quality or establish real-account delivery. Release-package, installer and publication checks are recorded separately.

Native Windows 10/11 cold installation, PowerShell 5.1, ConPTY/IME and Windows-MCP GUI remain NOT_RUN for this release. The broader macOS terminal/IME matrix, live model quality, mailbox delivery, remote migration and account reconnection retain their separate unverified status. Previous failures and HOLD records remain historical evidence; the separate unsigned macOS locked-use prototype is not included.

Non-TTY and JSON runs retain their existing behavior and do not draw the interactive dock. An approval temporarily owns the input prompt: queued tasks, unsent drafts and Todo items cannot approve an operation. Missing context telemetry is shown as unknown.
