# Koder CLI 0.4.3

Koder CLI 0.4.3 adds an optional resident agent and scoped reminders, fixes masked mail authorization-code input, and brings mail inquiries into the existing task workflow. Windows CMD/PowerShell and macOS Apple silicon/Intel installers share the same verified archive and stable update feed. Existing Skills, task profiles, model routing, project history and permissions remain in place.

## Changes since 0.4.2

- **Stay available after closing a terminal:** explicitly run `koder activate`, or choose activation at the end of installation. `koder status` reports the host and `koder deactivate` removes login startup. Installation and license acceptance alone do not activate it. The user-level adapters are LaunchAgent on macOS, a limited scheduled task on Windows, and systemd --user on Linux.
- **One task runtime:** frontend chat, ask and run use the same Core through authenticated local IPC. Each window retains its own cancellation and task history. Connected gateway messages reuse the existing gateway. A manual gateway already running is reported before activation; it is never taken over or killed.
- **Useful reminders with limits:** explicit follow-ups, interrupted tasks, authorized public URL watches and separately authorized mail checks feed a bounded local decision step. Defaults are 30-minute checks, quiet hours 23:00–08:00 and eight notification attempts per day. Mail, calendar and browser history remain off by default. Calendar/history/file collectors are not yet available.
- **Mail binding and inquiries:** protected authorization-code input supports paste, backspace and clearing without leaking the value into chat or queued tasks. Separate grants enable model reading and proactive inquiries. Choose an option, edit the draft and confirm its final recipient/body before sending. Background checks do not send replies automatically; advertisements and verification codes are excluded from inquiry summaries.
- **Preview and update continuity:** preview/visual commands use their owning background session; `--no-open` is honored. The resident launcher follows the managed installation record, including Windows UTF-8 BOM records, once active work is safely idle. Other windows and tasks are not interrupted to force an update.
- **Preserved capabilities:** portable Codex, Cursor and WorkBuddy Skills, live steer/queue input, five task harness profiles, application-use learning, existing BYOK routes and original permissions remain. The unavailable provider routes remain disabled as documented.

## Install, update and get started

Use the [installation guide](INSTALLATION.md) for the exact command for your shell. Downloads: [Windows CMD](https://karmenloop.com/install/koder-cli.cmd), [Windows PowerShell](https://karmenloop.com/install/koder-cli.ps1), [macOS shell](https://karmenloop.com/install/koder-cli.sh). These are CLI installers and a shared runtime archive, not desktop EXE/DMG packages. The installer reuses compatible Node or prepares a verified private runtime.

```text
koder update
koder --version
koder setup
koder learn
```

Expect `koder 0.4.3`. Existing users retain settings and project histories. Optional residency:

```text
koder activate
koder status
koder agentd doctor
koder agentd proactive off
koder deactivate
```

Activation does not grant computer access, mail access or message-sending authority. In Setup, configure the resident agent and each visible source separately. If a manually started gateway is running, finish its tasks and use `koder gateway stop` before activation. Do not terminate unrelated processes.

## Complete documentation

Start with the [English user guide](USER-GUIDE.en.md) or [Chinese user guide](USER-GUIDE.zh.md). Read [resident-agent operation](ALWAYS-ON.en.md), [Chinese resident guide](ALWAYS-ON.zh.md), [mail binding and inquiries](MAIL-PROACTIVE-INQUIRY.en.md), [Chinese mail guide](MAIL-PROACTIVE-INQUIRY.zh.md), [command reference](COMMAND-REFERENCE.en.md), [Skills](PORTABLE-SKILLS.en.md), [task profiles](HARNESS-JIT.md), [live input](SESSION-INPUT-AND-SKILLS.en.md), and [app-use learning](APP-USE-AND-LEARN.en.md). All 30 interactive lessons and eight complete shell/language text editions remain available, with a 0.4.3 quick reference.

## Verification and limits

The frozen candidate passed 199 broad local regressions, followed by 39 final agent/gateway checks and 29 unpacked-runtime checks. An actual packaged CLI subprocess completed through authenticated IPC and the original Core with stdin held open. These counts overlap and use scripted models or isolated service fixtures. Final stable-package checks and public download verification are recorded separately in the release acceptance receipt.

Native Windows 10/11 PowerShell 5.1 no-Node cold install/update, ConPTY/IME input, login/reboot, Toast and MCP GUI operations are NOT_RUN for this exact release. macOS LaunchAgent login/reboot and visible notifications, Linux systemd login, real mail/gateway accounts and real-model quality are also NOT_RUN. Existing inherited failures are retained in earlier release records; selected passing checks are not a claim that the entire product suite is green.

Native notification `submitted` means the call was accepted, not that the user saw it. Notification-click resume is not implemented: use `koder status` to find the original session or `koder mail inquiries` for mail. URL changes are review signals, not proof of a corrected conclusion. No autonomous-correction quality score is claimed. Uncertain external outcomes are not automatically resent. Cross-task profile evolution still requires the original authorized maintenance owner and otherwise returns NO_ENTRY.

Published at the user's explicit request with these limits retained. Prior releases and website deployments remain available for rollback. Stop residency through `koder deactivate` and reconcile active work before restoring an earlier version; retain configuration, history and unknown-outcome receipts. Personal noncommercial local use is free under the included EULA; commercial use requires separate written authorization. Third-party licenses and notices are preserved.
