# Koder CLI 0.4.17

This release repairs execution and delivery paths found by checking the current CLI against its documented contracts. Windows CMD, PowerShell and macOS shell installers select the same versioned runtime archive. Run `koder update`, restart the CLI, and check `koder --version` for `0.4.17`.

## Repairs

- Fix, review-fix and test-generation workflows keep their coding contract even when their internal prompt asks for a short summary or quotes a diagnostic mentioning email. The command owner runs its configured check after edits; uncertain effects and cancellation still stop execution. Owned workflow sessions now close reliably.
- Tool-context accounting uses the schema actually sent to the provider. Host-only policy metadata no longer consumes a small model's reported context budget. Full history, paired calls/results and authorization remain intact.
- Old conversation records without task/subagent IDs no longer crash recovery. Unknown shell receipts remain unknown and still require reconciliation.
- Prefill drafts are inserted before the persistent composer measures and paints them. Choosing a suggestion does not send it. An empty initial Todo list no longer emits a spurious JSON event.
- Completed calls are released from the delivery checker's pending-call bookkeeping. More than 256 completed tools no longer cause an artificial incomplete-delivery result. Explicit monetary budgets, cancellation, finite pending-request/resource bounds and unknown-effect guards remain.
- Competitor prices require a matched successful read from an allowed official pricing/help page, a short exact source quote, and its URL next to the claim. A bare link, failed read, different price or invented plan does not pass. An honest statement that pricing is unknown remains valid. This is a receipt/quotation contract, not a claim of model-quality improvement.
- Successful harness observations persist with the original session history and are inspectable with `koder harness experiences --json`. They are `NO_ENTRY` until a trusted paired comparison exists; an observation never silently changes the selected profile. The old 24-step restriction is removed from the existing experience-owner port.
- `koder model presets --json` returns a structured catalog with selectable/unavailable counts and an explicit account-verification boundary. The offline coach follows the real outer `fix` check instead of consuming later correction steps prematurely.
- Update fallback and all three installer pins now use this release. Current compatibility guides remove the obsolete four-Skill limit and correctly describe the 1,800-lesson Chinese classroom.

## Preserved features

BYOK providers, Skills and MCP, Windows-MCP payload, Code Graph, CLI-Anything, mail, GitHub hosting, project previews, migration, concurrent windows, steering/queue/cancel, Todo, task notifications, agentd, the 1,800-lesson classroom and the original English lessons remain. Default task rounds are unlimited. The 180 unreleased-child bound and real resource, account, approval and budget boundaries remain.

See the [commitment audit](PROMISE-AUDIT-0.4.17.md) and [Chinese changes and checks](RELEASE-0.4.17.zh.md). The original failed full-suite run is retained alongside the repaired run. The source, archive and public-download checks are recorded separately.

## Device and account scope

Windows 10/11 cold installation, PowerShell 5.1/IME, Windows-MCP GUI and account-bound operations are assigned to the product's beta testers; they do not block this user-authorized publication. Local fixtures do not certify those devices. Real-provider comparative scores were not rerun. macOS locked-use remains an unsigned native candidate because a Developer ID signing route and dedicated locked-screen test machine are unavailable. Native notification visibility, service restart after login and external mailbox/GitHub writes require their own device/account receipts.

## Rollback

Close the affected CLI session, retain its project/history and UNKNOWN receipts, and use the immutable `cli-0.4.16` installers from GitHub or `https://karmenloop.com/install/cli-0.4.16/`. Do not replay an uncertain operation while rolling back. Installer/update recovery uses the existing atomic version switch. Previous classroom files and release assets are preserved.
