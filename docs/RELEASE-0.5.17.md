# Koder CLI 0.5.17

This release fixes restored sessions that repeatedly stopped with “the previous operation still needs verification,” even when the next task only requested a read-only check.

## Changes

- Normalize legacy pending-operation records without losing their original identity. Read-only inspection remains available; unknown writes and external actions are not replayed.
- Add `/reconcile` and `/reconcile checked <call-id>` to interactive local and agentd sessions. Record an explicit human review, preserve the original UNKNOWN receipt, and require a separate new instruction with normal approvals. Headless runs and `--yes` cannot acknowledge a review.
- Treat exact `ESC` and `Escape` text as cancellation controls. Idle cancellation stays local instead of starting another model task.
- Recheck cancellation before dispatch and after saving an execution intent. A tool cancelled before invocation is recorded as not attempted. Late model responses cannot restart execution.
- Expose only the permitted native computer-care status actions during recovery, alongside the existing read-only diagnostic tools.

## Upgrade and recover

Run `koder update`, confirm `koder --version`, and reopen the original session. Follow the [recovery walkthrough](SESSION-RECOVERY.en.md). Existing histories, settings, approvals and original receipts are retained. Do not delete session files to clear a warning.

## Verification

The release acceptance attachment reports the tests and packaged checks run for this version. The targeted recovery suite includes 111 passing tests, including a saved 928-message history and agentd loopback. Physical Windows testing remains beta-owned; no new real-mailbox, signed locked-screen or Ubuntu desktop acceptance is claimed. Paid-model quality was not re-evaluated for this control-flow patch.

Windows, macOS and Linux packages retain existing applicable capabilities and a single current tutorial export set. Earlier releases remain immutable. Private runtime source is not published in the public repository.
