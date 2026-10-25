# Koder CLI 0.4.15

Long tasks no longer stop at the old default of 16 model/tool rounds. Cancellation, approvals and optional cash budgets still apply. This release also adds tool-enabled subagents, approved Skill retrieval and a 1,800-lesson Chinese classroom.

## Task execution

- Default task rounds are unlimited. Existing implicit profile limits no longer shorten a task. An explicit `koder harness steps N` remains available; `koder harness steps unlimited` restores the default.
- `koder harness budget` records an optional per-task amount, currency and prices for the exact configured models. The Core reserves the possible cost before each model request and reconciles reported usage. Parent and child requests share the same budget. Missing usage or uncertain charges stop new calls for review; they are not treated as free.
- Cancel remains available through Esc, Ctrl+C and the existing stop commands. An interrupted effect retains its evidence and is not replayed automatically.
- Todo lists support dependencies, updates and pages without the previous list-count ceiling. Independent task queues retain their existing behavior.

## Delegation and Skills

The agent can match configured models, spawn tool-enabled children and inspect, collect or cancel them. A root task can hold up to **180 unreleased children**, subject to machine capacity, provider limits and its budget. Children use the existing execution and approval paths. File writers receive disjoint paths; broad shell work requires exclusive ownership. MCP, mail and GUI actions remain with the parent. Nested delegation returns to the parent scheduler.

Results, in-flight effects and tool receipts are checkpointed to the existing conversation store. Collection offers pages for complete text and raw receipts. Releasing a child slot does not clear an unknown result. `/subagents status` and `/subagents cancel` work locally and through the daemon session.

Seek → fetch a pinned Skill → read → retry uses the existing Skill library. Network and Skill-update grants are checked before fetching; installing executable tooling uses the original approval path. Repeated identical failures request a different candidate or explicit continuation. `--yes` does not grant computer permissions. Setup can disable self-fetch and subagents separately.

[Complete task orchestration guide](TASK-ORCHESTRATION.en.md) · [Chinese guide](TASK-ORCHESTRATION.zh.md)

## Classroom

The Chinese classroom expands from 180 to **1,800 lessons**, organized into 120 units. It retains the original 180 lesson IDs and content and adds 1,620 case lessons with concrete inputs, operations, result checks, explanations and extension exercises. Hands-on and developer tracks, search, paging, bookmarks, notes and local progress remain available. The original 30 English lessons are retained; they are not labeled as 1,800 English lessons.

[Open the classroom](courses/index.zh.html). Use `koder learn 1800 --print --lang zh` for a terminal lesson. Reading or answering a quiz does not automatically certify a practical exercise as completed.

The bundled runtime includes the CLI-selected child-model matcher; a package-only startup check caught and corrected its missing build entry before publication.

## Verification and limits

- 144 combined no-key source checks passed, covering unlimited rounds, budget handling, Todo, Skills, child execution and CLI/daemon/input regressions.
- Six independent boundary checks passed: queued and active approval cancellation, delayed collection, path ownership, durable in-flight and completed receipts, full result paging and UNKNOWN recovery.
- All 26 classroom checks passed after integration. The classroom's 72 embedded JavaScript programs and an additional changed-input case were run against their stated outputs in disposable directories. The original 180 lessons, questions and progress compatibility are retained. There are 189 multiple-choice questions and 1,611 manual self-checks; reading or self-checking is not certification of practical completion. Content review and browser checks were bounded, not a claim that all 1,800 exercises have been performed.
- These are local and synthetic checks. They do not establish a real-model quality improvement or demonstrate 180 simultaneous paid model jobs.
- Native Windows 10/11 cold installation, PowerShell 5.1/ConPTY/IME, Windows-MCP GUI, real mail/GitHub writes and notification display remain **NOT_RUN** for this exact release. The unsigned macOS locked-use component remains a separate candidate.

Windows CMD/PowerShell and macOS shell installers use one versioned runtime archive with SHA-256 verification. Configuration, conversations and the previous installed version remain available to the existing updater. See [installation](INSTALLATION.md). For a rollback, reinstall an earlier pinned official release; retain current data and review any unfinished or unknown effect before resuming.
