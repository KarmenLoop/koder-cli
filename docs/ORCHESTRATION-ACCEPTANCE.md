# Task orchestration: retention and verification

## 0.4.21 actual invocation follow-up

Retained baseline: 0.4.20, private source `04763177bb8d6a3fe863cd0157c0e8bc59f0ed8a`. The three user-supplied 0.4.14 plans were compared with this newer implementation rather than replacing it. The local delivery is `CK-20261026-cli-self-fetch-invocation`.

| Requirement | Retained location and increment | Executed evidence |
| --- | --- | --- |
| Seek, fetch, learn, retry | CLI `self-fetch.mjs`; existing `fusion/skill-library.mjs` and `self-fetch-tools.mjs`; fixes `repo:` filtering and fallback scope | `self-fetch.test.mjs`: approval, revocation, fixed hashes, same-task read/write; public `invoke-public-skill.mjs`: ten real requests, exit 0 |
| Actual command bootstrap | Original shell approval and execution path | `self-fetch.test.mjs`: install an owned `fixture-cli.cjs`, invoke it, read stdout 42; revoked permission prevents execution |
| Unlimited rounds | Existing `task-budget.mjs` and task/profile settings | `task-step-budget.test.mjs`; 180-child invocation retains `maxSteps:null` |
| 180 unreleased children | Original `subagent-runtime.mjs`; no second worker engine | `subagent-invocation.test.mjs`: 180 real child readers, 360 scripted child model steps, 180 collected receipts, 181st refused |
| Models and four effort levels | `harness/thinking-efforts.mjs` now shared by CLI controls, matcher and schemas | Identity/schema regression plus real loopback HTTP: two child IDs, high/low protocol fields, 9 total requests |
| One cost ledger | Original root reservation and settlement | HTTP fixture verifies spent amount from supplied token usage and prices; boundary tests cover unknown usage and cancellation |
| Dependency Todo and ownership | Existing `session-todo.mjs`, child write-path and prerequisite checks | Todo/subagent suites retain DAG, pagination, parent plan, ownership and conflict assertions |
| Input and Setup | Existing Ctrl+P/E/T, steer/queue and independent enable switches | Session/Setup tests retained; two model fixtures now declare 64K context and use a bounded wait; no production limit change |
| Prior features | Existing mail, Apps/MCP, Skill loader, SolidCraft, Awesome LLM Apps and migration | Integrated CLI and later extracted-package checks; no source replacement or account effects |

Final source commands (run in an isolated HOME with the private kernel selected):

```text
python3 work/run-tests.py cli integration-regression-v2 test/self-fetch.test.mjs test/subagent-invocation.test.mjs test/subagents.test.mjs test/subagent-boundaries-review.test.mjs test/task-step-budget.test.mjs test/orchestration-commands.test.mjs test/thinking-effort.test.mjs test/session-controls.test.mjs test/setup-skills-input.test.mjs test/session-todo.test.mjs test/session-input.test.mjs test/session-dock.test.mjs test/portable-skills-cli.test.mjs test/builtin-skills-cli.test.mjs test/mail-delivery-regression.test.mjs test/app-use-mcp.test.mjs test/llm-apps.test.mjs test/solidcraft.test.mjs
# exit 0; 127 passed, 0 failed, 0 cancelled, 0 skipped
python3 work/run-tests.py desktop kernel-regression test/subagent-runtime.test.mjs test/subagent-match.test.mjs test/todo-orchestration.test.mjs test/skill-library.test.mjs test/task-cost-budget.test.mjs test/harness-jit.test.mjs test/harness.test.mjs
# exit 0; 76 passed
python3 work/run-tests.py desktop context-regression test/context-keep.test.mjs test/context-slack.test.mjs test/harness-context-retention.test.mjs test/task-cost-budget.test.mjs
# exit 0; 13 passed
```

The suites overlap. Exact argv, duration, stdout and exit codes are in `evidence/*.json` and `*.tap`. The original `red-qualified-seek` failure and `integration-regression` timeout remain preserved. `dock-diagnostic` identifies the fixture's 8192-token fallback and `CONTEXT_BUDGET_EXCEEDED`; `dock-green` passes 12 tests after fixture repair. No context assertion or production guard was weakened.

Public invocation source: `anthropics/skills`, commit `dbd4588f9e1033efb41dad4bef2f7947c8993d44`, Skill `algorithmic-art`. `public-skill-network.json` records each actual URL/status; `learned-skill.json` is an owned local readback artifact. Downloaded upstream scripts were not executed or added to Koder's distribution. The repository API license field was null; no redistribution permission is inferred from it.

The model response sequence and owner consent were deterministic fixtures; public transport, loopback HTTP and local tool effects actually ran. Real-model autonomous learning, 180 simultaneous paid calls, real billing reconciliation, Windows GUI/cold install and production-account operations are NOT_RUN. Package, installer, publication and native-device evidence remain separate. Parent-only MCP/GUI/mail effects and exclusive shell ownership are retained compatibility boundaries, not a claim of unconstrained child access.

[中文操作课](SELF-FETCH-AND-SUBAGENTS.zh.md) · [English guide](SELF-FETCH-AND-SUBAGENTS.en.md). Roll back with pinned 0.4.20 while retaining user data and uncertain receipts.

## Historical 0.4.16 evidence (retained)

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
