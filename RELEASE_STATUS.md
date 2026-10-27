# Koder CLI 0.5.8

Pending mail inquiry notifications can recover after a monitor restart, temporary notification unavailability or a daily notification limit. The existing notification ledger controls retries and deduplication. Previously handled inquiries no longer hide newer ones, and recovery does not spend a second mailbox inquiry allowance.

A send with a lost SMTP acknowledgement now carries its uncertain effect receipt through the Agent tool layer. The task is incomplete and exits with code 3; it cannot report a verified send or replay the message automatically. Definite SMTP acceptance remains distinct from recipient delivery. Native tool failures retain their diagnostic code.

Website layout choices made through an actual terminal question can now be recorded by `project_visuals select`. The answer must belong to the current task, follow the current layout review, and identify one of its complete option names. Earlier, conflicting, combined or negative answers cannot authorize a choice. Browser review and explicitly delegated choices retain their existing behavior. Selection never authorizes deployment.

Preview status, open and stop are scoped to the current process. When another process owns the preview, the CLI reports `not-owned` and an unknown external state instead of claiming that the site stopped. Todo revision conflicts explain which revision is current and how to reread it before retrying, without overwriting newer edits.

## Install or update

Use the Windows PowerShell/CMD or macOS shell installer attached to this release. Existing installations can run `koder update`, then `koder --version`; the expected version is `0.5.8`. See [installation](docs/INSTALLATION.md), [mail setup and recovery](docs/MAIL-RECOVERY.en.md), [website delivery](docs/website-delivery.md), and [task result codes](docs/task-results.md).

## Evidence and limits

`ACCEPTANCE-RESULTS.json` binds source regression, packaged-runtime checks, an isolated macOS upgrade and actual MiniMax-M3 task results to this runtime archive. The long-task exercise completed 33 model requests and independently checked the generated audit. Mail runs used native inbox/read/send tools with synthetic local TLS accounts, including a lost-acknowledgement case with exactly one received message. Website evidence records the automatic design workflow, scripted test-user answers, saved source, layout selection and preview checks. Earlier failures remain in the evidence; these exercises are not blind model-quality scores.

Windows 10/11 installation, GUI/MCP operation and visible notifications are assigned to the beta device track. Live 163 authentication and recipient delivery, Linux/macOS notification display, and signed macOS locked-screen operation are not established by these local checks. Notification submission is not proof that a user saw it. The production website is unchanged; this publication updates GitHub only.

Existing provider/BYOK routing, skills, permissions, cancellation, explicit cost budgets, workspace isolation and unknown-effect protection remain in force. Tool steps remain unlimited by default.
