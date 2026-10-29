# Local failure learning in the 0.5.20 candidate

This candidate adds procedural recall to the existing local learning library. It does not train model weights or rewrite installed code. Recognized delivery failures produce evidence-linked checks for later tasks in the same account, workspace and task/model binding. Up to three checks enter the normal model context. They add no separate model calls, but their prompt tokens still have ordinary provider cost.

An entry moves from observed to retested only after it reached an actual provider request and a later task passed its file contract and genuine self-check. A repeated error reopens it. Missing or changed source checkpoints prevent reuse. Stored model prose, previous answers and credentials do not become cross-task instructions. Cancellation, costs, approvals and unknown-effect protections retain their existing authority.

Use `koder learning status --json` to inspect `outcomes.counts`. Task JSON exposes `learning.loaded`, `recorded`, `retested` and `extraModelCalls`. Learning is enabled by default and can be disabled in Setup, with `koder learning off`, or for one run with `--no-learning`. `--no-memory` also excludes it. Cloud upload remains deferred.

## Repairs and verification

- Fixed an 8K context overflow by deferring ancillary tool schemas through the existing tool inventory. Current constraints remain present; deferred tools retain their original permissions.
- Added the exact cause and recovery command when a later tool invalidates a self-check. Read-only learning queries no longer invalidate it. Arbitrary shell commands still require a new check afterward.
- Passed 148 related source regressions. Two legacy tests were first reproduced against the baseline, then corrected to use explicit session names; cross-session privacy assertions were retained.
- Ran MiniMax-M3.1-Flash on a complete-input transaction-summary control. An engineered invalid-file seed was followed by a real run that saved artifacts but failed final verification. After the diagnostic repair, a new session in the same workspace loaded three checks and completed verification. This was recovery of existing files, not a fresh-generation or causal quality comparison.
- Independently checked nine behaviors in the actual generated program, verified three manifest rows and reran its self-check in the macOS sandbox. Artifacts remained unchanged. The recovery run reported 10 model requests, 102496 input tokens and 1337 output tokens, with two delivery-repair attempts.

## Unresolved exam evidence

The original ten-question rerun remains at zero verified complete deliveries, eight qualified SKIP records and two deadline cancellations. The supplied merged stems omit formulas, datasets and task details. Some model responses also pursued unnecessary work. This control does not replace those questions, establish full marks or show that all distractors are handled.

The original release gate requires at least eight effective deliveries in that ten-question set. It is still pending. Stable update channels remain unchanged while 0.5.20 stays a draft candidate. Windows physical acceptance and the dedicated 163 mailbox remain beta-owned. Native Linux sandbox acceptance and visible platform notifications are not established here. The website is unchanged; private runtime Git source is not included in the public documentation branch.

## Publication update — October 29, 2026

The product owner subsequently requested publication of 0.5.20 with the recorded limitations. Earlier candidate results above remain historical evidence. The original ten-question target is still unmet; publication does not turn SKIP, cancellation or separate controls into correct answers. See [current release notes](RELEASE-0.5.20.md).
