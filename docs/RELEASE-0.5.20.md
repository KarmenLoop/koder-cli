# Koder CLI 0.5.20

This patch connects explicit file requirements to the existing delivery checker and keeps bounded command output from stopping otherwise healthy tasks.

## Changes

- Derive a frozen file contract from a user's literal delivery list. Check every listed file, including extensionless names, code, exit-code files and TSV manifests. An explicit `--delivery-contract` still takes precedence.
- Drain command output after the capture limit without terminating the process solely because the preview is full. Timeouts, cancellation and uncertain process cleanup retain their existing protections.
- Discard incomplete tool arguments. File-contract tasks can rebuild a complete, small artifact call within the same task and cost budget. Artifact recovery and delivery repair share a two-attempt limit.
- Apply task scope to file tools, shell execution and plugin dispatch. Scope cannot be expanded by `--yes`, task materials or model-generated instructions.
- Save a contracted failure or refusal record when authorized and safe. Preserve existing files. A host-recorded denial is distinguished from a model's unverified refusal statement; neither is a completed answer.
- Record artifact recovery in local task telemetry. Cloud uploads remain disabled; Setup's telemetry off switch is unchanged.

## Use

For a literal list, write the requested paths in the task itself:

```text
Required files: out/report/answer.mjs, out/report/NOTES.txt, out/report/MANIFEST.tsv.
```

For exact verification and SKIP rules, use a workspace-local contract with `--delivery-contract contract.json`. Run the checker command exactly as declared, after saving the implementation. A valid SKIP returns exit 3. A nonempty directory or a printed DONE token does not establish success.

The [headless delivery guide](HEADLESS-DELIVERY.zh.md) documents the schema, manifest format, recovery limits and platform boundaries.

## Platform boundaries

macOS contract-scoped shell execution uses `sandbox-exec`. Linux uses an already installed `/usr/bin/bwrap`; namespace restrictions can still make it unavailable. Windows does not yet have a shipped shell sandbox for these restricted tasks. When the required sandbox is unavailable, arbitrary shell execution is refused with `TASK_SCOPE_SANDBOX_UNAVAILABLE`; confined file tools remain available. Ordinary tasks without a file contract retain the existing permissions and shell behavior.

Linked or sensitive input trees are refused by the scoped shell. Use a dedicated workspace containing only the required inputs. No component is installed or elevated automatically.

## Evidence

`ACCEPTANCE-RESULTS.json` records source tests, exact package hashes and the paid MiniMax-M3.1-Flash rerun. Local protocol tests and genuine provider calls are reported separately. The supplied ten-question set contains truncated sections and missing task data; a failure record or SKIP is not credited as a correct answer. The rerun report retains failed attempts and distinguishes files, validation receipts, SKIP and semantic correctness.

Physical Windows and the dedicated 163 mailbox remain beta-owned. This patch does not certify mail delivery or native notification display on those devices. It does not publish the private kernel source or deploy the website. Current Skills and platform features remain in the existing packages; no duplicate Skill framework is added.

A separate 8K website/learning-context regression also fails on the published 0.5.19 runtime with `CONTEXT_BUDGET_EXCEEDED`. It remains an open issue; the targeted P0 checks must not be read as an all-suite pass.
