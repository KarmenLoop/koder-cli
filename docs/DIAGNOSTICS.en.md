# Local checks, error reports and feedback

**Cloud service status:** not configured (`DIAGNOSTICS_SERVICE_NOT_READY`). Local checks and queues are available; a queued record is not proof of upload.

Run `koder diagnostics check --json` or `koder doctor --full --json` to inspect this local Koder profile. Checks cover configuration validity, enabled/disabled Skill conflicts, bundled tool schemas, readable Skill resources and retained recent error reports. Each check returns independently. A historical error stays an attention item until its real outcome is checked; reading it does not resolve it. Candidate causes are marked `hypothesis`, never asserted as proven root causes.

`koder diagnostics recent --hours 168 --json` groups errors by code and scenario with first/last timestamps, counts, component and next steps. Hours range from 1 to 720; history is bounded to retained local logs. The Agent uses the existing `diagnostics_runtime_log` tool with `action: recent` or `action: check`. There is no arbitrary file path, other-account parameter or cloud log-reading API.

Schema/resource checks do not invoke tool handlers or prove real mail delivery, GUI behavior, notifications or paid-model quality. Use the existing `doctor --tools --computer`, `mail doctor --json`, `mcp test <id>` and `model test` commands for the relevant checks. Model testing can incur provider charges. `diagnostics check --repair` only reuses the existing rollback of a known invalid local repair patch; it never replays uncertain effects, clears receipts, deletes user data, resets configuration, grants permissions or rewrites the kernel.

## Reporting controls

Automatic reporting is configured on by default. New errors become eligible only after the first interactive disclosure is shown and saved, the user is signed in, and the dedicated service is ready. CI does not automatically upload. There is no historical backfill. Change the setting in Setup → Self-check and error reports, or run:

```sh
koder setup diagnostics off
koder setup diagnostics on
koder diagnostics status --json
```

Local telemetry off also stops automatic reports. Cancellation, cost budgets and execution receipts remain active. Reading/copying `/error` or running self-checks does not upload raw logs.

Automatic reports contain only allowlisted timestamps, version, platform, error codes, scenario, component, result counts, cause hypotheses, next-step categories and optional protocol stage/HTTP status. They exclude conversations, file contents and paths, command arguments, mail bodies, email addresses, credentials, session IDs and raw exceptions. Unknown raw codes remain local and map to `UNCLASSIFIED_ERROR` on upload.

The private queue at `<KODER_CLI_HOME>/diagnostics/queue.json` binds entries to the local account. It holds at most 100 errors and 20 feedback records for seven days; expiration runs during queue processing. Turning reporting off stops automatic processing and preserves existing data. Retries back off, honor `Retry-After` and stop after five attempts. Requests have a five-second deadline; CLI exit waits at most three additional seconds. Changing accounts cannot submit the former account's entries. `diagnostics discard <id>` removes only the selected local queue entry, not task history or server records.

`pending` means queued locally. `blocked` requires attention. `submitted` requires a durable server receipt with matching ID and payload hash; it does not mean the bug is fixed. `DIAGNOSTICS_SERVICE_NOT_READY` means the official endpoint or dedicated upload grant is unavailable. Ordinary profile/refresh tokens are never forwarded to a support origin. Explicit retry is `koder diagnostics upload --confirm UPLOAD`; it cannot submit an unconfirmed feedback draft.

## Feedback

Use `/feedback` interactively. Describe the issue, inspect the redacted draft, then type `SEND`; Enter keeps a local draft. Review all text because automatic masking cannot prove arbitrary prose contains no personal information. Never enter passwords or mail authorization codes.

For scripts:

```sh
koder feedback draft --text "Describe the issue without private details" --category bug --json
koder feedback show <KF-id> --json
koder feedback submit <KF-id> --confirm <draftHash-from-preview> --json
```

Categories are `bug`, `suggestion`, `documentation` and `other`. An optional `--report <KR-id>` must reference a report already submitted by the same account; missing and foreign references are rejected. A changed draft requires a new hash. `--yes` cannot confirm. Use `feedback discard <KF-id>` to remove the local draft. The official feedback email remains available; Koder sends no automatic email and attaches no history or files.

## Service readiness

Support upload requires a separately configured service and a dedicated upload grant. Ordinary account credentials do not authorize support uploads, and there is no cloud log-reading interface.

The production HTTPS ingestion entry and dedicated upload grant are not configured for 0.6.3, so production collection remains disabled. Local fixtures and schema checks are not public end-to-end acceptance. The service candidate proposes 30-day error and 365-day feedback retention, subject to deployment verification; backup and account-deletion integration are not implied. Native Windows/Ubuntu GUI, real mail and notification acceptance retain their independent `NOT_RUN` boundaries.
