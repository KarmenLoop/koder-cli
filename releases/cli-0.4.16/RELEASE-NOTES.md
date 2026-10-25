# Koder CLI 0.4.16

This release completes several task-orchestration paths introduced in 0.4.15. Windows CMD and PowerShell installers and the macOS shell installer select the same versioned runtime archive. Run `koder update`, then verify `koder --version` reports `0.4.16`.

## What changed

- Tool discovery checks the local PATH first. `koder tools seek node --local --json` performs metadata lookup without downloading or executing anything. A known executable is returned before public search; missing tools use the existing network permission path.
- A child assigned Todo IDs receives those items and their internal dependencies in its own editable plan. Unfinished prerequisites outside the assignment and duplicate active assignments are rejected. The parent shows the assignee and verifies receipts before marking its own work complete.
- Child collection includes paged Todo results, along with existing text, artifacts and tool receipts. Paging retains access to all saved rows.
- `koder subagents status` reads the workspace/session checkpoint without taking over another terminal's lock. Saved running entries are labeled unconfirmed, not live. Current chat status and cancellation remain available through `/subagents`.
- `/skill seek` and `/skills seek` reach the same discovery command. Fetching a Skill refreshes the current session's library. Read-only catalogs no longer initialize computer permissions unnecessarily.

## Preserved behavior

Default model/tool rounds remain unlimited; there is no automatic stop at 16 steps. Explicit limits, cancellation, shared parent/child cash budgets, approvals and UNKNOWN-effect reconciliation remain. The single product cap is 180 created, unreleased children per root task; byte, path, transport and repetitive-failure safeguards still apply. The existing 1,800-lesson Chinese classroom, original 30 English lessons, migration, mail, GitHub, Apps/MCP and session history remain in the package.

See the [step-by-step Chinese guide](TASK-ORCHESTRATION.zh.md), [English guide](TASK-ORCHESTRATION.en.md), and [retention and verification matrix](ORCHESTRATION-ACCEPTANCE.md).

## Verification scope

139 no-key source regressions passed with zero failures, skips or cancellations. They cover the 180/181 boundary, more than 30 model rounds, cancellation, shared budgets, workspace isolation, approved child writes, Todo dependencies, full result paging, Skill discovery and the persistent input controls. Tests use owned directories and scripted providers; they do not establish a model-quality score or 180 simultaneous paid jobs.

Initial failures remain recorded. They exposed missing local tool discovery and Todo handoff, a null checkpoint status path, and unnecessary permission-runtime creation for catalog reads. The narrow-terminal test also needed its simulated xterm and Node readline environment aligned; no production cursor behavior was weakened to pass it.

Native Windows 10/11 cold installation, PowerShell 5.1/ConPTY/IME, Windows-MCP GUI, real mailbox/GitHub application operations and visible native notifications remain **NOT_RUN** for this release. The unsigned macOS locked-use component stays a separate candidate. Package, public-download and isolated upgrade receipts are recorded separately from source tests.

## Rollback

The pinned 0.4.15 release remains available. Reinstall that version using its official pinned installer if necessary; retain configuration, conversations and saved UNKNOWN receipts. A rollback does not undo external effects or make an uncertain request safe to repeat.
