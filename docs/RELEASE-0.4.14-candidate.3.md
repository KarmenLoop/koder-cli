# Koder CLI 0.4.14-candidate.3

This unpublished candidate fixes a reproducible command-reconciliation loop reported in Windows screenshots. A completed, literal read-only PowerShell search with suppressed read errors was classified as an uncertain effect, blocking later commands. The classifier now recognizes a small read-only grammar and reports partial coverage. Writes, opaque scripts, actual timeouts and uncertain cleanup retain the original protection.

Unknown command receipts now identify the originating call and explain the reason, exit status, approved wait and readback options. Repeated requests for blocked effects terminate with exit 3 instead of consuming the whole task budget. Conversation storage and JSON output retain the diagnostic evidence. Old UNKNOWN receipts are not reclassified or replayed.

Authorized file search skips inaccessible descendants and supports a narrower path. Workspace listing and reading accept absolute paths inside the workspace. Authority loss, root errors, cancellation and identity failures remain errors. Partial coverage is visible in the terminal. Missing Skills provide an exact-ID catalog route. Background mailbox failures use a normalized error key, avoiding repeated messages for the same code-less network failure until recovery.

The executor, approvals, memory boundaries, providers, MCP/Apps, mail authority and prior notification/session-control features are retained. There is no new scheduler, permission authority or automatic replay mechanism. Shell timeout defaults are unchanged.

## Verification layers

The final source run passed all 282 tests across 33 selected files, with no failures, skips or cancellations. It covers the new reproduction plus existing command ownership, permission, cancellation, memory, session, delivery, mail and notification contracts. Earlier red probes remain in the handoff; overlapping runs are not added to this total. Three unrelated test-entry failures were reproduced on the untouched baseline and corrected in fixtures, without changing product update or ACP behavior.

Local regressions exercise the screenshot command classifier using a synthetic Windows process, the actual harness approval/resume loop with a scripted model, receipt persistence, terminal rendering and protected-file traversal. Owned macOS processes test timeout/cancellation and an owned unreadable directory tests partial content search. These are not native PowerShell or Windows device results.

The extracted package can run `node docs/shell-recovery-check.mjs`. It reports native Windows PowerShell as NOT_RUN on non-Windows hosts. Native Windows 10/11, PowerShell 5.1, MCP GUI, live model behavior and real mailbox connectivity retain separate acceptance requirements. Historical failing probes, stale-test evidence and prior HOLD records remain in the task handoff.

## Use and rollback

Follow the [Chinese recovery guide](SHELL-RECOVERY.zh.md). Keep this candidate in a separate directory until deliberately selecting it. The included installers retain their configured distribution endpoints; merely running a copied installer does not select a local candidate. Switch back to the retained runtime to roll back and keep all conversations and uncertain receipts. Building this package does not change active installations or publish a release.
