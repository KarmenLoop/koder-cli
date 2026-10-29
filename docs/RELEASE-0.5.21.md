# Koder CLI 0.5.21

Failed and unverified tasks now produce a local diagnostic report instead of only a generic incomplete message. The report provides a copyable ID, specific error codes, a known reason or an explicit unknown cause, execution state and the next step.

- Use `/error`, `/error copy` or `koder logs report [id] --json` to view and share redacted diagnostics. Reports are local and follow the Setup telemetry switch.
- Preserve specific mail/provider errors through task summaries. Background mailbox failures produce a deduplicated report without marking the foreground task as failed.
- Cover pre-task exceptions, interactive chat, native task results and resident-agent transport. JSON keeps its existing result contract and adds diagnostic metadata.
- Keep design reading and preview tools visible for website delivery under an 8K context budget, including the fallback when the fullstack Skill is disabled.
- Include the existing limited local-repair permission in the package and release assets, with no expansion of supported repair modules.

Cancellation, cost limits, execution receipts and permissions remain active. Reports do not automatically retry operations, send messages or upload data. Unknown effects require review.

## Validation

210 focused source checks passed on macOS with Node 22.23.2. They cover actual CLI failure paths, a simulated interactive terminal, redacted report retrieval and copying, log rotation and linked-file refusal, telemetry opt-out, headless delivery, model cleanup, mailbox chains, resident-agent behavior, local repair and website delivery. The earlier two failing regressions are retained in the task evidence; both have been corrected without weakening their assertions.

Packaged-runtime checks are recorded in the release acceptance attachment. No new paid-model benchmark score is claimed. The original ten-question exam still lacks input material and has not met its effective-answer target. Real Windows checks and the dedicated 163 account remain beta-owned; macOS locked-use signing is still outstanding. This release does not claim every earlier feature has completed native acceptance.

[Support-report guide](ERROR-REPORTS.md) · [Chinese walkthrough](ERROR-REPORTS.zh.md) · [Local repair](SELF-REPAIR.md) · [Repair permission](../LOCAL-REPAIR-PERMISSION.md)
