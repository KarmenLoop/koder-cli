# Recover a session with an unconfirmed operation

Applies to Koder CLI 0.5.17 and later on Windows, macOS and Linux. Enter slash commands at the `koder >` prompt, not in PowerShell or Bash.

## Upgrade and restore

Run `koder update` in your system terminal, then check `koder --version`. Close the old CLI window and start `koder` again. To select the original session, use its working directory and `koder chat --session default`. Do not delete configuration or history. If updating fails, use the [versioned installer](INSTALLATION.md).

Older sessions can contain a pending operation without a state field. Version 0.5.17 allows read-only inspection of those sessions instead of rejecting every diagnostic tool. Unconfirmed writes and external actions remain protected against automatic replay.

## Recovery steps

1. Stop the active turn with Esc or Ctrl+C and wait for the ready prompt. If a slash menu is open, Esc closes the menu first. Exact `ESC`, `Escape`, `/cancel` and `/stop` inputs also cancel; at idle they do not call the model.
2. Enter `/reconcile`. It lists each pending call ID, tool and reason without running a model task.
3. Inspect the saved receipt and actual target. Read the affected file or check the relevant process or remote service. `koder logs --tail 100` is a diagnostic entry point. A model's completion claim alone does not verify a write or submission.
4. Only after checking, enter `/reconcile checked <call-id>`, replacing the placeholder with the complete ID from step 2. This records your review of that operation. An incorrect ID leaves the session intact.
5. Give a new instruction for the remaining work. No old command is replayed, and new operations still require their normal permissions and approvals.

Reviews survive restart. Original UNKNOWN receipts remain unchanged. If there are no pending items, no acknowledgement is needed. Sessions hosted by agentd use the same commands.

## Limits and diagnostics

`RECONCILIATION_TASK_BUSY` or `AGENTD_TURN_BUSY` means the turn has not stopped. A steering message cannot clear the gate. `RECONCILIATION_CALL_NOT_FOUND` means the ID is not currently listed. `RECONCILIATION_INTERACTIVE_REQUIRED` prevents scripts, headless runs and `--yes` from impersonating a human review.

Cancellation before dispatch records an unattempted tool call. Cancellation after dispatch cannot undo an external effect; inspect its receipt and target. Late model responses cannot start tools after cancellation. Ordinary sentences containing words such as `escape` are not cancellation commands.

Isolated tests cover legacy recovery, a 928-message history, persisted reviews, native diagnostic visibility, cancellation boundaries and local agentd communication. Physical Windows terminal and original user-session verification remain beta-owned and are not reported as passed by these tests.
