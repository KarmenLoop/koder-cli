# Koder CLI 0.5.20

This patch connects explicit file requirements to the existing delivery checker and keeps bounded command output from stopping otherwise healthy tasks.

## Changes

- Derive a frozen file contract from a user's literal delivery list. Check every listed file, including extensionless names, code, exit-code files and TSV manifests. An explicit `--delivery-contract` still takes precedence.
- Drain command output after the capture limit without terminating the process solely because the preview is full. Timeouts, cancellation and uncertain process cleanup retain their existing protections.
- Discard incomplete tool arguments. File-contract tasks can rebuild a complete, small artifact call within the same task and cost budget. Artifact recovery and delivery repair share a two-attempt limit.
- Apply task scope to file tools, shell execution and plugin dispatch. Scope cannot be expanded by `--yes`, task materials or model-generated instructions.
- Save a contracted failure or refusal record when authorized and safe. Preserve existing files. A host-recorded denial is distinguished from a model's unverified refusal statement; neither is a completed answer.
- Record artifact recovery in local task telemetry. Cloud uploads remain disabled; Setup's telemetry off switch is unchanged.
- Reuse host-checked failure experience in later matching tasks through the existing local learning library. Record observed, retested and reopened states without copying answers or creating duplicate Skills. Learning remains optional and adds no separate model requests.
- Explain when a later tool call invalidates an earlier self-check and provide the exact recovery command. Read-only learning queries no longer invalidate a completed check.
- Defer ancillary tool schemas under 8K context pressure. The existing tool inventory can restore them while preserving the current task's constraints and permissions.

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

The 8K website/learning-context regression that failed on 0.5.19 passes in this release: native model requests stay within the context budget and retain the current constraints. This is a protocol regression, not a completed real-model website evaluation.

A separate complete-input control used MiniMax-M3.1-Flash with local learning enabled. The first real run saved files but failed final verification after an extra shell call. After the diagnostic fix, a new session in the same owned workspace loaded three procedural checks, passed the file contract and self-check, and updated their retest records. Nine independent checks then passed against the actual generated program; the three manifest rows matched the files. This recovery control does not replace the original ten questions, prove a causal quality gain or qualify the release by itself. The original ten-question release gate remains pending.

## Opt-in local code repair

This release also adds [opt-in local code repair](SELF-REPAIR.md) for seven supported feature modules. It reproduces the error, validates the patch, applies it at the next start and keeps original package bytes for recovery. The native tool cannot enable its own grant. See [source and actual-provider evidence](SELF-REPAIR-0.5.20.md). This control does not satisfy or replace the original ten-question release gate.

## Publication and remaining acceptance

The product owner requested this GitHub release after reviewing the candidate results. The original ten-question rerun still has zero verified complete deliveries, eight qualified SKIP records and two deadline cancellations. Its eight-delivery target remains unmet; neither recovery controls nor self-repair checks count toward that score. Windows/Linux native local-repair checks, the dedicated 163 mailbox and visible notifications remain separately unverified.

The published runtime archives are byte-for-byte the tested candidate archives. The release provides [limited permission for built-in local repair](../LOCAL-REPAIR-PERMISSION.md), without publishing private runtime Git source or changing the shipped EULA hash. Packaged documents retain their build-time candidate context; the release notes and attached acceptance record describe the publication decision.
