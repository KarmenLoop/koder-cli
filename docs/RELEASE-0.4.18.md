# Koder CLI 0.4.18

This release fixes three incomplete invocation paths in 0.4.17: long MCP operations, durable foreground mail alerts, and downloaded GitHub Skills. Windows CMD/PowerShell and macOS installers select the same versioned runtime. Update with `koder update`, reopen Koder, and check that `koder --version` reports `0.4.18`.

## Changes

- Approved MCP tool calls now have a three-minute operation deadline. Worker and local bridge deadlines allow the operation and its receipt to finish. Connection/discovery checks remain short; cancellation and explicit request deadlines still work. A lost or cancelled remote effect remains uncertain and is never automatically replayed.
- Foreground mail monitoring recovers saved alerts after a restart. It acknowledges an alert only after printing it; putting it into a busy chat queue does not count as display. Failed display/acknowledgement keeps the event recoverable. The 1,000-event backlog can drain and polling can resume.
- Downloaded GitHub Skills appear in Setup and support individual enable/disable and all-off. They can be selected using a unique short name with `$name` or `--skill name`, and read with `skills show name`. Agent tools continue to use exact IDs. Local package precedence and ambiguity checks remain; re-enabling an installed Skill needs no new download.

Default task rounds remain unlimited. Cancellation, explicit cost budgets, approvals, task/workspace isolation, the 1,800-lesson Chinese classroom and original features are retained. No model-quality score increase is claimed.

## Verification boundary

An actual local MCP subprocess completes a 33-second approved call and returns its result through the CLI Agent. Local TLS IMAP/POP/SMTP fixtures exercise receipt-based sending, including 163-style AUTH LOGIN. Downloaded synthetic Skill resources are read and used to produce a real file through existing approval paths. Mail recovery tests include restart, display failure and a full backlog. These are local protocol/process checks with synthetic accounts and scripted models, not live-provider or Windows-GUI certification.

Windows 10/11 native cold installation and MCP graphical operations remain the product beta team's acceptance track and do not block this authorized release. Real mailbox delivery, paid-model planning and native notification display require their own account/device evidence. The unsigned macOS locked-use component remains a candidate.

See [the invocation audit](INVOCATION-AUDIT-0.4.18.md), [mail guide](MAIL-DELIVERY.en.md), [Skill guide](PORTABLE-SKILLS.en.md) and [Chinese release notes](RELEASE-0.4.18.zh.md). Prior failed checks remain in the audit record. The previous release remains available at the pinned official installation path `/install/cli-0.4.17/` and GitHub tag `cli-0.4.17`.
