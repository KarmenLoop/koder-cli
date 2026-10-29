# Local code repair validation — 0.5.20

This release adds a native read/propose/test/apply/rollback path and a persistent Setup opt-in. It supports seven feature modules. It does not expose the execution, mail, credential, cancellation, cost, permission, verifier or update controllers for automatic replacement.

## Recorded results

- 73 related source checks passed on macOS with Node 22.23.2. Coverage includes repair behavior, Setup persistence, task scope, cancellation, cost enforcement, input handling, compact tool context, failure learning and update recovery.
- The native scripted-model loop proposed and activated an actual source patch. A separate process loaded the changed implementation; original package bytes remained unchanged. Rollback restored the original behavior.
- A genuine MiniMax-M3.1-Flash control completed in 20.472 seconds: 7 model requests, 6 tool calls, no failed tools, one reproduced baseline failure and 3 passing candidate checks. Provider-reported usage was 91,105 input tokens and 2,235 output tokens. This was an owned reproduction with a copied diagnostic module, not an original exam question or an end-user production failure.
- The first provider run failed. The supplied cases arrived with numeric values represented as strings, and inadequate mismatch feedback led to unnecessary edits. That failure is retained. Native checks now use typed JSON text and return bounded actual/expected values. The successful follow-up used a fresh owned installation and the same model and task.
- Each run had a CNY 2 accounting limit using explicitly configured test rates; these are estimates, not a provider invoice. No extra background model was started.

The source checks verify refusal of protected paths, changed or damaged patches, verification failures, revoked grants and workspace-only tasks. They also verify timeout/cancellation cleanup, per-task proposal bounds, startup quarantine and recovery. Node permission checks reduce mistakes during validation; they are not a hostile-code sandbox.

## Remaining boundaries

The local tests and genuine provider control do not establish native Windows or Linux behavior. Those remain `NOT_RUN` here. Runtime hangs and errors caught outside the startup handler may require manual recovery. A passing reproduction cannot establish that arbitrary code is safe or that the whole CLI is correct.

The original ten-question effective-delivery gate is still pending. The self-repair control does not replace missing formulas, datasets or task instructions, and is not counted toward the original score. The product owner subsequently requested publication of 0.5.20 with these limits disclosed. This publication decision does not change the recorded scores or unrun checks. No website changes or publication of private runtime Git source are included.

[Enable and recover](SELF-REPAIR.md) · [Chinese walkthrough](SELF-REPAIR.zh.md) · [Failure-learning evidence](https://github.com/KarmenLoop/koder-cli/blob/main/docs/FAILURE-LEARNING-0.5.20.md)

## Exact package checks

All three package inventories were verified by SHA-256. The extracted macOS package passed 15 repair tests and a native entry check. A full-package patch was loaded in two new processes with the Node compile cache enabled; rollback restored the original implementation, with original package bytes unchanged. All 74 unique Skills remain. The shipped EULA text is unchanged. [Supplemental permission](../LOCAL-REPAIR-PERMISSION.md) covers the official built-in local repair workflow only. The repair tests were explicitly authorized by the product owner.
