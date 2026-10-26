# Koder CLI 0.4.21

A repository-scoped Skill lookup such as `repo:anthropics/skills` could discover a Skill and then filter it out because the qualifier was treated as ordinary text. The lookup now applies repository scope to fresh and cached results and keeps remote fallback searches within that scope.

Session controls, child model matching and subagent tool schemas now share one definition of the four effort levels: `deep`, `standard`, `fast` and `off`. Model selection remains separate from effort; existing provider support and fallback reporting are retained.

## Use it

Install or update with the attached Windows PowerShell/CMD or macOS shell installer. Existing users can run `koder update`, then `koder --version` and expect `0.4.21`. The shared runtime archive is used by all supported installers; Windows-MCP and SolidCraft platform payloads are retained.

Follow the [hands-on guide](SELF-FETCH-AND-SUBAGENTS.en.md) or [中文操作课](SELF-FETCH-AND-SUBAGENTS.zh.md) to find a pinned Skill, read it and complete a local task, or to delegate two independent outputs and collect their receipts. The example ZIP supplies both input files and the exercise instructions.

Task rounds remain unlimited by default. Owner-selected limits, cost budgets, cancellation and safety guards still apply. The 180 limit counts created, unreleased children in one root task; it is not a promise of 180 concurrent paid-model calls. The original permissions and approvals govern downloads, bootstrap commands and child writes.

## Verification

- Integrated CLI regression: 127 passed. Kernel regression: 76 passed. Additional context/budget regression: 13 passed. These suites overlap.
- Public Skill transport: ten actual GitHub requests, commit/hash verification, installation as inert resources, read, local write and readback.
- Actual CLI/Core invocation: 180 child readers, 181st-slot rejection, all 180 receipts collected. No paid model was used.
- Loopback HTTP invocation: distinct child model IDs and effort fields, real local writes/reads, shared parent cost settlement. A local bootstrap fixture also creates and invokes a command through the original approval gate.
- The original repository-query failure and a bounded diagnosis of a TTY fixture hang are preserved. Declaring the fixture model window resolved the hang without changing context-budget protection.

The model responses, consent and prices above were test fixtures. Autonomous model quality, real provider billing, Windows native GUI/cold installation and production account operations are NOT_RUN. Windows beta acceptance remains separate. See the [retention and evidence matrix](ORCHESTRATION-ACCEPTANCE.md).

The release retains Awesome LLM Apps, SolidCraft, existing Skills/MCP, mail, migration, queue/steering, model controls and the 1,800-lesson Chinese course. There are no website deployments in this release. Rollback uses the pinned `cli-0.4.20` installer; preserve configuration, conversations and UNKNOWN receipts.
