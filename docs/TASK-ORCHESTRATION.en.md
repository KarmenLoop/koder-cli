# Long tasks, cost budgets, Todo plans, and subagents

[中文](TASK-ORCHESTRATION.zh.md)

This guide describes the built-in Koder Core in the current source. Tasks have no default model-round ceiling: `taskExecution.maxSteps` is `null`. Provider billing, cancellation, explicit cost budgets, permissions, approvals, and reconciliation of uncertain effects still apply. Check an installed package's version, release notes, and `koder harness status --json` before assuming that it includes these changes.

## Check the current policy

```sh
koder --version
koder harness status --json
koder model list
```

`taskExecution.maxSteps` should be `null`, unless you previously set a positive integer. Restore the default with:

```sh
koder harness steps unlimited
```

To choose your own ceiling, use a command such as `koder harness steps 60`. This counts model calls for the root task, including its subagents. Approval resumes and steering do not reset consumed calls. It is separate from a command's approved timeout or the provider's connection limits.

| Area | Current contract |
| --- | --- |
| Model/tool loop | No default 16- or 24-round product ceiling; an owner can set `maxSteps` |
| Todo | No 64-item total limit; the complete plan is saved and read by page |
| Skill selection and discovery | No four-selection or 200-discovery total limit; catalogs and text use paging |
| Subagents | At most 180 created, unreleased children in one root user task; a lower configured cap is allowed |
| Subagent display | 20 entries per page by default; paging does not change occupied slots |
| JIT repair | The existing allowance of at most two automatic repairs remains separate |

Individual text, response-byte, archive, context-projection, and wait limits remain. A short model-facing view does not delete the complete plan, history, or raw receipts.

## Configure one cost budget for the parent and its children

Prices are supplied by the owner for each actual model ID. Koder does not fetch prices or guarantee that its estimate equals the provider's final invoice. Verify the model, currency, and token rates before using:

```text
koder harness budget <amount> USD|CNY <actual-model-id> <input-price-per-million-tokens> <output-price-per-million-tokens>
```

The identifiers and rates below are illustrative. Replace them before running these commands:

```sh
koder harness budget 1 USD "YOUR_MODEL_ID" 2 8
koder harness status --json
koder harness budget 1 USD "YOUR_CHILD_MODEL_ID" 1 4
```

Both commands configure the same 1 USD task budget. The second adds another model's rates; it does not give each child a separate dollar. A command in the same currency retains existing model prices and updates the total limit. Changing currency starts that currency's price table again. Use actual model IDs rather than configuration aliases, and provide a rate for every model that may be selected.

Before each model call, Core reserves against the configured input window and output ceiling:

```text
reservation = (input window × input rate + output ceiling × output rate) / 1,000,000
available = task limit - settled spend - all outstanding parent and child reservations
```

For an input window of 10,000, output ceiling of 1,000, and rates of 1 and 2, the reservation is 0.012. A confirmed response with 5,000 input tokens and no output tokens settles at 0.005. This conservative reservation can reject a call while some money remains in the budget.

| Diagnostic | Next action |
| --- | --- |
| `TASK_COST_PRICE_REQUIRED` | Supply a price for the actual selected model in the budget's currency |
| `TASK_COST_BUDGET_EXHAUSTED` | Inspect completed work and reservations; the owner decides whether to change the budget for subsequent work |
| `TASK_COST_UNCONFIRMED` | Reconcile missing usage or an unsettled request; unknown spend is not zero |
| `TASK_COST_RESERVATION_EXCEEDED` | Check configured model ceilings and the reported usage |
| `TASK_COST_ENGINE_UNMETERED` | An external engine or multi-model adviser has no unified per-request reservation path and cannot start with this monetary budget enabled |

`koder harness budget off` removes the local spending guard; provider billing continues. Policy is read when a session is created. Finish current work, reopen the chat after changing it, and check the resulting settings. Do not start a new task to conceal unknown usage. This budget covers the model token usage received here, not unrelated third-party tool or cloud-service charges.

## Exercise 1: maintain a plan with dependencies

1. In a separate practice directory, create `input-a.txt` containing `2 + 3` and `input-b.txt` containing `7 - 2`. Start `koder chat` and explicitly limit the exercise to these files.
2. Ask for three Todo items: `a` and `b` process the two inputs, while `verify` depends on both. Ask to see the plan first. Only `a` and `b` should initially be ready. A completed checkbox is planning metadata; files and tool receipts still establish what happened.
3. Use `/todo` and `/todo 2` to read pages. In the expanded dock, `/todo next`, `/todo prev`, or PgUp/PgDn changes pages. Ctrl+T folds the dock without discarding your draft.
4. Request changes by item ID, dependency, and priority. `todo_set` supports `upsert`, `set_deps`, `reorder`, and `replan`. A stale `revision` produces `TODO_REVISION_CONFLICT`; read the current plan before updating it.
5. Verify the saved outputs before completing the verification item. Use `blocked` for missing input and `failed` for an unsuccessful step, with specific notes. Cancellation returns in-progress items to pending and retains completed items.

Example `todo_set` arguments for developers; this is a model tool call, not a shell command:

```json
{
  "op": "replace",
  "items": [
    {"id":"a","title":"Calculate input-a.txt","status":"pending","priority":2,"assignee":"parent"},
    {"id":"b","title":"Calculate input-b.txt","status":"pending","priority":1,"assignee":"parent"},
    {"id":"verify","title":"Verify both results","status":"pending","dependsOn":["a","b"],"assignee":"parent"}
  ]
}
```

Acceptance: `readyIds` contains `a` and `b`. Adding a dependency from `a` back to `verify` must return `TODO_CYCLE`. Read with `{"op":"read","offset":0,"limit":20}` to obtain `total`, `revision`, and `nextOffset`. Removing an ID that another item still references produces `TODO_DEPENDENCY_MISSING`; update those dependencies together.

## Exercise 2: delegate two independent outputs and collect receipts

Continue in the same practice chat:

```text
Delegate a and b to two subagents. They should read input-a.txt and input-b.txt
and write their answers to results/a.txt and results/b.txt respectively.
Declare non-overlapping writePaths for those files before starting.
Use the existing configured model and shared task budget.
The parent must collect tool receipts, read both result files, and complete verify.
Do not use shell commands, external accounts, or messaging.
```

Both output files should contain `5`. A real model may choose different intermediate steps; the acceptance evidence is the saved files and receipts.

1. Run `/subagents status`. Each row shows the ID, state, model, requested effort, and effective effort mapping. Use `/subagents status 2` for the next page. `active` counts all occupied slots, not just the visible page.
2. The model calls `subagent_collect` to inspect results. Children in `done`, `failed`, or `cancelled` release their slots when collected after execution has settled. Running or cancelling children still occupy slots; reading status does not release them.
3. Use an actual listed ID to cancel one child, for example `/subagents cancel a`. `/subagents cancel` without IDs cancels all running children in this root task. Cancelling the parent also propagates cancellation; completed effects are not undone.
4. Inspect saved receipts and files after collection. Results retain the child reference, tool receipts, and artifacts. Display text may be cropped while the complete records remain in the original session. Collecting an UNKNOWN result may release its slot, but the parent still cannot write, run shell commands, or spawn a replacement to replay the uncertain effect.
5. The parent verifies the Todo, combines results, and reports the outcome. A child that needs more delegation must ask the parent. Direct nested creation is rejected with `SUBAGENT_DELEGATE_VIA_PARENT`.

`writePaths` declares explicit workspace-relative files or directories, such as `results/a.txt` or `src/parser`. A directory owns its descendants: `src` conflicts with `src/a.mjs`, while `src-two` is separate. Unreleased ownership also constrains the parent. Children with no write paths are read-only. Arbitrary shell commands require exclusive `**` ownership and the original approval. Ownership never substitutes for computer permissions or file approvals.

A child receives only tools allowed by the parent. An explicit forbidden tool returns `SUBAGENT_TOOL_REQUIRES_PARENT`. MCP, GUI, email, and other external-account actions stay with the parent under the existing authorization. Children execute in the original Core and share the root's budget and cancellation path; a multi-model adviser is not used as their executor.

Model selection and effort are independent. `model` must identify a unique configured binding or actual model ID. Unknown or ambiguous IDs return `SUBAGENT_MODEL_UNKNOWN`. `thinkingEffort` accepts `deep`, `standard`, `fast`, or `off`. A model whose name contains `flash` can request `deep`; `fast` is not a model ID. Unsupported requests show their effective mapping or notice rather than claiming support. See [model and effort controls](SESSION-CONTROLS.en.md).

Read long results through `subagent_collect` using the returned cursors. This does not execute the task again:

| Content | Next request fields | Cursor in the response |
| --- | --- | --- |
| Children | `offset`, `limit` (default 20, maximum 180) | Top-level `nextOffset` |
| Child answer | `textOffset` (up to 12,000 characters per page) | Each result's `nextTextOffset` |
| Receipt list | `receiptOffset`, `receiptLimit` (default 20, maximum 180) | Each result's `nextReceiptOffset` |
| Receipt body | `contentOffset` (up to 1,200 characters per page) | Each receipt's `nextContentOffset` |

Select one child with `ids`, then locate a long receipt with `receiptOffset` and `receiptLimit:1`. Continue from its `nextContentOffset`; `null` means that part is complete. These are model tool arguments. `/subagents status [page]` only pages through status rows. Collected results remain readable after their slots are released, without replaying tools.

## Exercise 3: find a missing Skill, pin it, read it, and resume

Search the existing local catalog first:

```sh
koder skills list --query "csv" --json
koder skills list --query "csv" --offset 50 --limit 50 --json
```

Use `koder skills show <full-id>` to read a matching entry. An entry missing from the first page may still exist. Public discovery and installation require the current computer owner's `network` and `skills.update` grants:

```sh
koder permissions request --capability network --capability skills.update
koder skills seek "csv report" --json
```

Use public task categories as search terms, without secrets or private project content. Inspect the repository, license, candidate ID, and pinned commit. Replace these placeholders with the returned values:

```sh
koder skills fetch "ID_FROM_SEEK" --ref "COMMIT_FROM_SEEK"
koder skills show "INSTALLED_ID_FROM_FETCH" --json
```

The `ref` must be the candidate's complete 40-character commit SHA. Changed sources or mismatched versions fail; a branch name cannot bypass the check. The complete package is hash-checked and stored in the existing Skill library. Scripts remain inert and the result reports `executed:false`. Installation establishes resource availability, not task completion.

The agent sequence is `skill_seek → skill_fetch → skill_read → retry the original unfinished step`. Read the instructions and relevant resources, then use current tools and approvals. Downloaded instructions are untrusted source material; they cannot authorize accounts, expand tool access, override the user, or clear UNKNOWN effects.

For a missing CLI, `tool_seek` finds public candidates. After checking the official pinned instructions, license, command, and destination, `tool_bootstrap` uses the original shell approval, timeout, and cancellation flow. A destination outside the workspace also needs computer write-scope authorization. Grants are checked again after the approval prompt. `--yes` does not bypass computer-owner, network, or Skill-update grants. Report actual denials, cancellation, or source failures.

After three consecutive agent self-fetch tool failures with identical arguments and the same error, the next identical attempt returns `SELF_FETCH_NEEDS_DECISION`. Use a justified new candidate or changed parameters, or wait for an explicit user request such as “continue searching.” This guards repeated failure, not the total number of attempts in a task. Explicit continuation does not override permissions, cost accounting, or UNKNOWN reconciliation.

## Settings and recovery

Setup → Skills → Task harness exposes “Optional model round cap,” “Tool-enabled subagents,” and “Seek and install missing skills.” These are fields in the existing configuration; merge them rather than replacing the entire file:

```json
{
  "taskExecution":{"maxSteps":null},
  "subagents":{"enabled":true,"cap":180},
  "selfFetch":{"enabled":true}
}
```

`subagents.cap` accepts 1–180. The two `enabled` flags control availability and grant no computer or account permissions. These menu entries are wired in the source; verify availability in an older installed build. Reopen the chat and verify settings. See [session input](SESSION-INPUT-AND-SKILLS.en.md), [Todo display](SESSION-DOCK.en.md), and [command reconciliation in Chinese](SHELL-RECOVERY.zh.md).

## Evidence and regression entry points

The isolated task `CK-20261026-cli-task-steps` recorded 27/27 passes in `evidence/subagent-regression-final-27.tap`. It covers the real runtime's 180/181 boundary, collection, cancellation, ownership, paging, root-task isolation, model selection, persistent UNKNOWN blocking, inherited tool scope, and the actual Core's shared monetary budget. The 180-child case uses controlled execution ports. Cost tests use synthetic providers; this is not a 180-provider load test or a test involving 180 people.

`evidence/subagent-budget-integration.log` records 11/11 passes for CLI continuation, explicit round ceilings, and cost accounting. `evidence/todo-cli-regression.log` records 10/10, including a 100-item Todo. The [self-fetch tests](../test/self-fetch.test.mjs) use owned repository responses, original tools, and isolated directories; they do not establish live installation of arbitrary third-party packages. Earlier failure and cancellation logs remain part of the record.

The later combined run in `evidence/orchestration-regression-v1.log` records 144/144 passes, zero failures, and zero cancellations. That count describes one isolated source regression run. Additional boundary review and release acceptance have separate records.

From the source root, these bounded checks need no real model account:

```sh
node --test koder-desktop/test/subagent-runtime.test.mjs koder-desktop/test/subagent-match.test.mjs
node --test koder-cli/test/task-step-budget.test.mjs koder-desktop/test/task-cost-budget.test.mjs
node --test koder-cli/test/self-fetch.test.mjs koder-cli/test/subagents.test.mjs
```

Native Windows terminals, native macOS interaction, autonomous planning quality, production billing accuracy, real-account effects, and public deployment require separate acceptance. Source, fixture, and local IPC results do not establish those outcomes.

## Added in 0.4.16: local discovery and plan handoff

`koder tools seek node --local --json` checks local executable metadata without a network request or execution. Replace `node` with the command you need. For a multiword query, use `koder tools seek "PDF processing" --command pdftotext --json`; a missing local executable follows the existing network-authorization path. `runtimeVerified:false` distinguishes file presence from a successful tool invocation. Without a specific command, `local.checked:false` does not claim that no relevant tools are installed.

Children assigned `todoIds` receive the selected plan items and internal dependencies. External prerequisites must be completed and are supplied as plan metadata, not execution proof. Duplicate active assignment returns `SUBAGENT_TODO_CONFLICT`; unfinished prerequisites return `SUBAGENT_TODO_BLOCKED`. The parent's assignee changes, but its completion status requires parent verification. Collection accepts `todoOffset` and `todoLimit`, returning `todoTotal` and `nextTodoOffset` without dropping the full saved plan.

Use `koder subagents status -w "/path/to/project" --session default --json` from a separate terminal to inspect saved state. It does not claim the session lock or run children. `source:saved-checkpoint`, `live:false` and `unconfirmed` distinguish saved running entries from actual liveness. Use `/subagents status` and `/subagents cancel <id>` in the original chat for current operations. Status pages accept `--offset` and `--limit`.

`/skill seek` and `/skills seek` both route to discovery; fetching refreshes the chat library. The 0.4.16 source suite passed 139 checks, including child plan handoff and checkpoint reads while another owner holds the conversation lease. See the [verification matrix](ORCHESTRATION-ACCEPTANCE.md) for retained platform limits.
