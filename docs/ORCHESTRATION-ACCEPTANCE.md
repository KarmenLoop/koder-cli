# Task orchestration: retention and verification

Baseline: published 0.4.15, private source `9b01b3dc67714bf861249e601395262b815ed035`. The 0.4.16 increment keeps the same Core, provider routing, conversation store, permissions and installer. It does not introduce a second executor or budget authority.

| Requirement | Retained implementation and increment | Actual source regression |
| --- | --- | --- |
| Unlimited tool/model rounds | `harness/task-budget.mjs`, existing task config and all five profiles; explicit user limits still apply | `task-step-budget.test.mjs`: long task, explicit limit, cancellation |
| Cash budget and cancel | Original root budget shared by all child provider calls; unknown usage is not zero | `task-cost-budget.test.mjs`, `subagent-boundaries-review.test.mjs` |
| 180 unreleased children | Existing `subagent-runtime.mjs` cap, root isolation, cleanup and receipt retention | 180th accepted, 181st refused, collection releases slots, pending work stays owned |
| Real child execution | Existing tool/approval loop; now copies assigned Todo items and prerequisite context | `subagents.test.mjs`: real child Core reads input, writes owned output, returns updated Todo; parent remains pending |
| Dependency and ownership | Reject unfinished external dependencies and duplicate active Todo assignment; preserve disjoint write paths | `subagent-runtime.test.mjs`, `subagent-boundaries-review.test.mjs` |
| Full results | Existing text/receipt cursors plus new Todo cursors | 75 child Todo items remain accessible across pages; large original receipt and text tests retained |
| Dynamic Todo | Original replace/upsert/remove/reorder/set_deps/replan, revisions and DAG checks | `todo-orchestration.test.mjs`, `session-todo.test.mjs`, 100-item CLI list |
| Self-fetch | Existing local Skill library, fixed commit/hash, approval and grant checks; tool discovery now checks PATH first | `self-fetch.test.mjs`: local hit causes no fetch or execution; cancelled/disabled lookup; pinned install and revoked grants |
| Model and effort | Existing configured-model matcher and supported effort mapping | `subagent-match.test.mjs`, `subagents.test.mjs` |
| CLI and chat | New `tools seek` and checkpoint-only `subagents status`; singular Skill alias and fetch refresh | `orchestration-commands.test.mjs`: held lease, workspace isolation, alias and Windows PATH/PATHEXT metadata |
| Setup and input | Existing independent switches, persistent draft, steering, queue and cancellation | `setup-skills-input.test.mjs`, `session-dock.test.mjs`, `turn-approval-progress.test.mjs` |
| Prior content | Existing Skill resources, migration, mail, Apps/MCP, 1,800 Chinese lessons and 30 English lessons | Release package copies the retained source/docs; native service/account behavior is separately unverified |

The integrated source run contains **139 tests: 139 passed, 0 failed, 0 skipped, 0 cancelled**. The exact command and raw TAP are retained under isolated delivery `CK-20261026-cli-orchestration-followup/evidence/regression-source-v2.*`. Earlier red runs remain in the same delivery; they are not rewritten as passes.

`saved-checkpoint` status is not a process heartbeat. Todo completion is not an external-effect receipt. Finding or fetching a tool is not proof that it ran. Partial display pages do not impose a lifetime task-count ceiling.

## Practical verification after installation

1. Confirm `koder --version` is 0.4.16, then inspect `koder harness status --json`. Default `maxSteps` is null unless explicitly configured.
2. In a disposable project, run `koder tools seek node --local --json`. Expect `local.found:true`, `executed:false` when Node is on PATH. A bundled private runtime need not be on PATH.
3. Follow the two-file exercise in [task orchestration](TASK-ORCHESTRATION.en.md). Assign separate Todo IDs and write paths to two children. Verify the files and collect their receipts before completing the parent plan.
4. While the original chat owns the conversation, open a second terminal and run `koder subagents status -w <project> --session <name> --json`. Expect a checkpoint receipt without lock takeover or a claim of live running status.
5. Cancel a pending child in the original chat. Confirm no unapproved write occurs and completed or unknown receipts remain available.
6. With network/Skill grants absent, local discovery still works. A remote request must report the existing permission requirement; `--yes` must not enable it.

Real-model autonomy, provider billing reconciliation against account statements, 180 paid concurrent tasks, native Windows 10/11 cold install, PowerShell 5.1/ConPTY/IME, Windows-MCP GUI and real application/account effects are **NOT_RUN** for this increment. Source, extracted package, isolated macOS upgrade and production publication evidence are separate layers. The unsigned macOS locked-use candidate is excluded.

Rollback uses the retained pinned 0.4.15 installer. Keep user configuration and conversation data. Never delete UNKNOWN receipts or replay an uncertain send, publication or process effect to make a regression appear green.
