# Task notification acceptance

This checklist separates policy tests, native command receipts and visible desktop behavior. `VERIFIED` always names the layer observed. A successful process exit is not proof that a user saw or clicked a notification.

## Reproduce against the actual package

Extract the candidate to its own directory. Keep the existing Koder installation and active sessions running unchanged. From the extracted `koder-cli` directory:

```text
node docs/task-notification-check.mjs --accept-eula --send --output task-notification-check.json
```

Read the package's `EULA.md` first. The explicit `--accept-eula` flag accepts that exact bundled license only in the new test profile; without it, the checker exits before creating a profile. The checker creates a fresh private configuration directory under the OS temporary directory. It runs the package's real `notifications status` and `notifications test task-done` commands, records their output and exit codes, and retains the isolated directory for inspection. It does not copy the user's credentials, activate a service, register a protocol or run a model task. Omit `--send` for status-only inspection.

The report includes the package version, native adapter SHA-256, actual platform, desktop-session flags and structured receipts. Both `displayVerified` and `clickVerified` remain false. Add separate human observations when testing display and continuation.

An unavailable channel can be an expected result, such as Linux over SSH. A crash, timeout, malformed JSON result or failed status command makes the checker fail. Do not turn its exit 0 into a claim that every channel displayed a notification.

## Matrix

Recorded on 2026-10-26 (Asia/Shanghai). Source snapshot: `365424bc9660f115db954096890be005257f4964`. The first extracted candidate was 121,649,967 bytes, SHA-256 `6ec658e04d5e2a6f11b878849b422a71142b2ae24dd228f43dadb3174ef2647d`; its 29 changed packaged files matched source bytes. That initial artifact is retained as evidence and is superseded by the reviewed source fixes below. Do not treat a later tarball with the same candidate label as those exact bytes; use its companion manifest and handoff receipts.

The actual macOS ARM64 command checker exited 0: version, isolated EULA acceptance and both status calls exited 0; the native test exited 0 with `submitted` / `NOTIFICATION_SUBMITTED`. Status retained that diagnostic with dailyCount 0. macOS kernel was 27.0.0. Visibility and clicking were not observed.

The [private GitHub acceptance run](https://github.com/KarmenLoop/koder-desktop/actions/runs/40226737770) did not start a runner: GitHub reported failed recent payments or a spending limit requiring attention. The transfer job failed before any steps; all target-platform jobs were skipped. This is an infrastructure block, not a product failure or a native pass. No billing setting was changed or quota bypass attempted.

| Surface | Native command | Display / refusal observation | Click or text continuation |
| --- | --- | --- | --- |
| Windows 10 client | NOT_RUN | NOT_RUN | NOT_RUN |
| Windows 11 client | NOT_RUN | NOT_RUN | NOT_RUN |
| Windows Server hosted runner | NOT_RUN — runner blocked by account billing | Not a Windows 10/11 desktop proof | NOT_RUN |
| Windows 11 ARM hosted runner | NOT_RUN — runner blocked by account billing | Hosted ARM command execution does not prove a visible client banner | NOT_RUN |
| Linux X11 desktop | NOT_RUN | NOT_RUN | Text fallback implemented; native hand check NOT_RUN |
| Linux Wayland desktop | NOT_RUN | NOT_RUN | Text fallback implemented; native hand check NOT_RUN |
| Linux virtual desktop runner | NOT_RUN — runner blocked by account billing | Virtual session does not prove physical visibility | Text fallback |
| Linux with no desktop / SSH | NOT_RUN — runner blocked by account billing | Expect `unavailable` / `NO_NOTIFICATION_SESSION` | Text fallback |
| macOS ARM64 | VERIFIED command submission: submitted, exit 0 | NOT_RUN; silent OS suppression cannot be inferred | Text fallback implemented; native hand check NOT_RUN |

The final review found and corrected original-account continuity, revocation before fallback, Windows focus argv and the focused-long silence rule in source commit `cf3cc563f508e78836b57e804958c3fe91e32647`. The affected notification/session-input/agentd batch passed 105/105, followed by a 15/15 focused run after the final identity-lookup check. These suites overlap and are not additive. Full TAP/commands/exits are retained in the isolated task handoff.

One initial red protocol-await regression did not have a working injection seam and reached the macOS adapter unexpectedly; it did not retain a native receipt. Any extra submission/display remains unknown. The baseline case was not repeated. Later runs install a fail-closed process guard before importing adapters and assert zero uninjected effects. This incident is preserved, not counted as native acceptance.

The cross-platform JavaScript adapter tests inject command runners; they do not execute PowerShell, notify-send or AppleScript. State-machine tests use temporary private state and scripted task providers. Neither category replaces the matrix above.

## Windows 10 and 11

1. Open the candidate in PowerShell, CMD or Git Bash. Confirm `--version` matches the candidate being tested.
2. Run the checker above. Confirm the payload uses the Windows adapter and the receipt has `displayVerified: false`.
3. Check Settings → System → Notifications and the notification center. Record whether the toast was visible and which application identity was shown.
4. Turn off Koder notifications in Windows settings, then issue a new explicit test. Expect `denied` or definite unavailability, never a guaranteed-success claim. Restore the original setting afterward.
5. Test the supported current-user protocol registration from the stable candidate installation. Confirm a valid notification returns to the correct workspace/session without re-running the task. A conflicting protocol registration must be retained and produce text fallback.
6. Record the exact Windows edition/build, shell, package hash, command output and click observation. A PowerShell syntax test or Windows Server job is insufficient for this row. A Windows 11 ARM hosted job records real client-OS command execution, but remains separate from a user seeing/clicking a banner and from an x64 client installation.

No administrator request, UAC bypass or global execution-policy change is part of notification acceptance. WSL uses the Linux adapter, even when hosted by Windows.

## Linux desktop and SSH

1. In X11, run the checker in the actual user session with `DISPLAY`. Repeat under Wayland with `WAYLAND_DISPLAY`. Record which desktop and notification daemon were used.
2. If `notify-send` is missing, expect `NOTIFICATION_PROGRAM_MISSING`. Installing the distribution's libnotify tools is a separate user action; Koder does not install them.
3. Repeat from a context with no desktop session variables. For an isolated test process:

   ```sh
   env -u DISPLAY -u WAYLAND_DISPLAY -u DBUS_SESSION_BUS_ADDRESS \
     node docs/task-notification-check.mjs --accept-eula --send --output no-desktop.json
   ```

4. Expect a structured `unavailable` result, not an uncaught exception or false submission. A retained D-Bus environment may still refer to a desktop; record the report's session flags.
5. For text fallback, use the private resume command from a real task receipt. Confirm the correct existing conversation opens without executing its old prompt.

An Xvfb/D-Bus/dunst runner verifies native command transport in a virtual desktop. It does not establish a visible notification on a user's X11 or Wayland desktop.

## macOS

1. Run the checker without registering a LaunchAgent or altering active Koder sessions.
2. Record both its receipt and the actual Notification Center observation. AppleScript may return successfully while system notification settings suppress the banner.
3. An explicit authorization refusal must be `denied`; an ambiguous process interruption must be `UNKNOWN` and must not send a second channel.
4. Check the textual `koder open` continuation using a real task record. This adapter does not claim a clickable macOS notification.

## Lifecycle acceptance on each desktop

| Exercise | Expected result |
| --- | --- |
| Successful chat while using the input, including a long task | No completion banner unless explicitly requested |
| Long task; switch to another application | One completion candidate; default threshold two minutes |
| Background task in an actual desktop session | One terminal-outcome candidate |
| Two windows finish simultaneously at the last daily slot | At most one dispatch reservation |
| Replay the same lifecycle event | No second dispatch |
| Native command times out after a possible submission | `UNKNOWN`; no automatic resend or self-DM fallback |
| Quiet hours, eligible success | Bounded queue, no immediate notice |
| Quiet hours, needs input or long failure | Eligible despite quiet hours, still capped |
| Cancel with the default setting | No cancellation banner |
| Explicit “notify me when done” on a short task | Candidate, still subject to switch, quiet hours and cap |
| Approval notice then terminal outcome for the same task | Reconciled state, no second task notice |
| Frontend chat proxied through agentd | Frontend owns completion notification; no daemon duplicate |
| Turn off task reminders during a task or pending native attempt | No later native or fallback effect after settings are rechecked |
| Remove fallback channel during the first native attempt | No fallback delivery |
| Switch account before first notice, between needs-input and terminal, or during native await | Old identity's event/record is not adopted; no second delivery into the new account |

Run these in a dedicated test profile. Record original settings before changing thresholds, quiet hours or daily limits. Restore them after the test, and retain failed/unknown records alongside later passes.
