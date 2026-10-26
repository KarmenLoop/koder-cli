# Find Skills and delegate work

For Koder CLI 0.4.21. The existing Core owns execution, permissions, cancellation, conversation state and the shared budget. [Full task configuration](TASK-ORCHESTRATION.en.md) · [中文逐步操作课](SELF-FETCH-AND-SUBAGENTS.zh.md).

## Check your installation

Open a disposable project and run:

```text
koder --version
koder harness status --json
koder model list
koder tools seek node --local --json
```

Expect version 0.4.21. Task rounds are unlimited by default (`maxSteps:null`); `koder harness steps unlimited` restores that setting. Explicit owner limits, cancellation, budgets, provider failures, context bounds and uncertain-result protection still apply. Local tool discovery reports presence, not execution.

## Find and read a pinned Skill

Use the existing permission flow, then select a public source:

```text
koder permissions request --capability network --capability skills.update
koder skills seek "repo:anthropics/skills" --json
```

Replace the source with your reviewed repository. Repository qualifiers narrow both fresh and cached results. They no longer hide discovered Skills or silently trigger unrelated repository searches. Check the returned source, license information, `id` and 40-character `ref`. A null license field is not permission to redistribute.

```text
koder skills fetch "ID_FROM_SEEK" --ref "COMMIT_FROM_SEEK"
koder skills show "ID_FROM_SEEK" --json
```

Use actual returned values. Downloads verify fixed commits and resource hashes. Installation stores inert resources; it does not execute scripts. Follow `nextOffset`, `scan` and `nextPage` to continue reading or discovering. A per-request page is not a lifetime catalog limit. Respect GitHub rate-limit responses.

In chat, ask Koder to find the relevant Skill, read it and finish the original project task. The observable sequence is seek, fetch, read, then the existing tool operation and result verification. `installed` alone is not completion. Source instructions do not grant permissions, and `--yes` does not enable computer capabilities.

## Delegate two independent outputs

Create `input-a.txt` containing `2 + 3` and `input-b.txt` containing `8 - 3`. Ask:

```text
Create Todo items a, b and verify. Verify depends on both a and b.
Delegate a and b to two children. Each reads its input and writes only
results/a.txt or results/b.txt. Collect their tool receipts, read both
files, verify both equal 5, and then complete the parent checklist.
Use existing models and the shared budget. No shell or external accounts.
```

Inspect `/subagents status`; use `/subagents status 2` for another page and `/subagents cancel CHILD_ID` to cancel. Unfinished prerequisites, dependency cycles and overlapping write paths are rejected before the affected work runs. Child checklist completion does not certify the parent result.

The cap is 180 created, unreleased children in one root task. The 181st returns `SUBAGENT_CAP_REACHED`. Collection releases settled terminal work and retains the receipts. Children execute through the original tool and approval loop; they are not advisory MoA calls or read-only flow steps. MCP, GUI, mail and external-account operations remain with the parent.

## Models, effort and recovery

Choose only configured model bindings. Effort (`deep`, `standard`, `fast`, `off`) shares the same definition as session controls; a model named Flash can still request deep effort. Status distinguishes requested and effective effort. All children use the parent's cost ledger; configure prices for every model that might run.

Cancel the parent to propagate cancellation. Never replay uncertain effects: UNKNOWN receipts remain protected after collection. Setup can disable self-fetch or subagents independently. Queue, steering, Ctrl+P/Ctrl+E and existing Skills remain available.

## Execution evidence

The 0.4.21 check downloaded and read a pinned public Skill over ten real GitHub requests, then wrote and read back a local artifact. Another check ran 180 child readers through the actual CLI/Core and collected all receipts. An HTTP protocol fixture verified two distinct model/effort bindings, real file writes/reads and one shared cost ledger.

Model answers and owner consent were deterministic test fixtures. Public transport and local tools actually ran. These checks do not establish autonomous model quality, paid-account billing reconciliation, Windows device acceptance or production-account effects. See [the evidence matrix](ORCHESTRATION-ACCEPTANCE.md).
