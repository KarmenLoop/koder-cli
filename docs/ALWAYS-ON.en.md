# Resident agent and proactive reminders

Koder CLI 0.4.3 includes an optional local resident agent. After explicit activation it can receive authorized messages and check enrolled follow-ups while terminal windows are closed. Your computer must be on and your user session logged in; sleep, shutdown and disconnection prevent timely checks. Native login, reboot and notification-display acceptance remains incomplete. Existing model billing, Skills, history and permissions remain unchanged.

## Enable, inspect and stop

```text
koder activate
koder status
koder agentd doctor
koder agentd logs
koder deactivate
```

Activation registers a current-user login service and starts it. Repeating the command checks that same supervised host. A manually started `agentd serve` is not a login service. Deactivation asks Core to cancel and clean up before unregistering startup. `AGENTD_CLEANUP_PENDING` or `AGENTD_OWNER_UNREACHABLE` means cleanup or ownership could not be verified; do not kill unrelated processes based on an old PID.

The installer offers activation: type `activate` to accept, or press Enter to skip. An automated installation may explicitly set `KODER_ACTIVATE=1`. License acceptance and `--yes` alone never activate residency. Setup → Resident agent and reminders provides the same controls.

| Platform | User-level service |
| --- | --- |
| macOS | LaunchAgent after graphical login |
| Windows | Limited scheduled task at the current user's login; no administrator or permanent execution-policy change |
| Linux | systemd --user after user-session startup; no automatic linger/root service |

## Tasks and multiple windows

The frontend uses authenticated loopback IPC to the original Core. Model/BYOK routing, JIT profiles, app-use Skills, approvals, cancellation and project history keep their existing authority. No second executor or memory database is created.

Two default windows in the same directory receive separate session names. An explicitly named busy session cannot be taken over. Closing a frontend cancels that window's task; it does not silently convert it into unattended work. Other windows and the gateway continue. `/preview` and `/visuals` use the owning session; full host shutdown cleans up their preview services. Approvals stay in the initiating window. An unreachable activated host gives a clear error instead of starting a competing executor.

An existing manual gateway produces `MANUAL_GATEWAY_RUNNING` before activation. Finish its work, use the original `koder gateway stop`, then activate. While residency is active, gateway start/stop controls the hosted gateway. If an older process introduces a conflict, deactivate, stop that manual gateway, then activate again. Do not force-kill an unknown owner.

Managed updates preserve active tasks. The startup launcher reads the existing installation record; when frontend sessions finish and the gateway can safely stop, the host exits so its OS supervisor can launch the updated version. `status.updatePending` explains why a restart is waiting.

## What reminders can see

Defaults: wake every 30 minutes, quiet hours 23:00–08:00, at most eight notification attempts per day. A wake checks relevant events and can remain silent. It is not a fixed news broadcast.

- Enrolled project memory: interrupted tasks and explicit follow-ups use the existing records. A reminder does not automatically resume an operation with side effects.
- Explicit public URL watches: original network authorization is required. At most three public pages are checked per wake, eight seconds each. A changed page invites review; it does not prove an earlier conclusion was wrong.
- Mail: off by default. Enable resident mail visibility separately from the existing mailbox and notification grants. The original IMAP/POP cursor and inquiry flow are reused. Background checks never send replies automatically.
- Calendar, browser history and arbitrary file collectors are not connected. Status reports them as unavailable; setting a field does not make these adapters operational.

```text
koder agentd follow 2026-10-25T09:00:00+08:00 Review the project acceptance results
koder agentd watch-url https://example.com/help Track this help page
koder agentd proactive off
koder agentd proactive on
koder agentd wake
```

Follow-ups and watches are notes in the current project's original memory. Inspect with `koder memory show` and remove with `koder memory remove <id>`. Existing explicit shared-note semantics remain. Use `--session <name>` when needed. Account/space changes and withdrawn source permissions are checked again before notification.

## Notifications and continuing work

System notifications hide private content. macOS uses its notification service, Windows uses Toast, and Linux uses notify-send. Missing desktop sessions, unavailable programs and denied access are recorded honestly. `submitted` means the call was accepted, not that a notification was displayed.

Reliable notification-click resume is not implemented. Run `koder status` and use `resume.workspace` and `resume.session` to reopen the original task; use `koder mail inquiries` for mail.

Optional private-message fallback requires an explicitly selected, already paired self chat that has received a message during the current connection:

```text
koder agentd self <platform> <userId> <chatId>
```

Koder does not guess which contact is you or notify a group. A submitted or uncertain notification is not sent through a second channel. Dedupe and daily budget are reserved before dispatch; UNKNOWN is not automatically retried.

## Setup, privacy and cost

Setup controls activation, proactive reminders, wake interval, daily limit, quiet hours and memory/mail visibility. Turning reminders off does not stop an already configured gateway. Use `koder deactivate` to stop residency entirely. The initial `agentd.activated` value is false; editing it is not a substitute for OS registration. Skills, tutorial learning and JIT controls remain separate.

Local reminder scoring does not call a paid model. URL checks use network access; mail checks use the existing mailbox grants. Subsequent tasks and gateway conversations use your configured provider and normal budget. Web pages and emails are untrusted content, not instructions that can grant access.

IPC accepts up to 32 simultaneous connections and 8 MiB per frame. Oversized output fails clearly without silently truncating persistent history. Notification receipts contain scoped metadata rather than another copy of private mail bodies. Existing encrypted mail storage remains.

## Verification limits and recovery

Isolated checks cover local IPC, the original Core, JIT/approval wiring, cancellation, multiwindow isolation, detached child processes and notification/service adapters. Native Windows 10/11 login/reboot/Toast, macOS LaunchAgent registration/display, Linux login, real accounts and real-model quality remain NOT_RUN. No verified autonomous-correction performance is claimed.

Read the [platform acceptance checklist](ALWAYS-ON-ACCEPTANCE.zh.md), [mail guide](MAIL-PROACTIVE-INQUIRY.en.md) and [release notes](RELEASE-0.4.3.md). Before rollback, deactivate and verify cleanup, restore the prior managed version, and retain settings, history and unknown-outcome receipts.
