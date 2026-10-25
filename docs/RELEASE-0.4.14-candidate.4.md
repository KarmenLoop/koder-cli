# Koder CLI 0.4.14-candidate.4

This unpublished candidate follows the Windows 0.4.11 reconciliation report. It keeps all candidate.3 fixes and adds two recovery paths: inspecting an existing preview without starting anything, and explaining that a mid-turn supplement does not clear an unconfirmed command result.

## Behavior

`workspace_preview status/discover` remain available while shell reconciliation is required. Status reads the current process's preview owner and can return its existing URL. With no owner it returns `not-running`. Discovery reads project metadata and entry points; it does not execute scripts or start a server. Linked directories are rejected before package metadata is read.

The tool schema exposes only those two actions in diagnostic mode. Invocation checks independently reject `start`, `open` and `stop`, including a model request that ignores the schema. JIT diagnostic profiles use the same action check. Existing profile restrictions and tool availability still apply. No new executor, permission, automatic retry or model-controlled unlock is introduced.

When steering is accepted during reconciliation, the receipt includes `restriction: SHELL_RECONCILIATION_REQUIRED`. Local chat and the existing agentd IPC path display that the supplement remains in the current turn. The user can continue readback, verify the target state, then issue an explicit instruction for remaining work after the turn ends. Old UNKNOWN receipts remain unchanged; neither a new instruction nor an existing URL proves the previous operation succeeded.

## Verification and use

The final source run passed 357 tests across 40 files, with zero failures, skips or cancellations. It includes the previous 282-test selection plus preview, agentd and JIT checks. The initial seven failing probes and later passing results are retained separately; overlapping runs are not added together.

The regression fixtures cover schema narrowing, actual read-only service calls, rejected preview mutations, JIT host enforcement, retained UNKNOWN receipts, local steering and terminal rendering over authenticated loopback IPC. They also exercise a real owned directory link pointing outside the fixture project. Models and Windows process output are scripted; no live provider, mailbox or desktop UI is involved.

Run `node docs/shell-recovery-check.mjs` from the extracted package for the bundled checks. The native PowerShell step remains `NOT_RUN` on non-Windows hosts. Native Windows 10/11, PowerShell 5.1, MCP GUI and installed upgrade acceptance remain separate. Building this candidate does not update an installed runtime, the official website or GitHub's public release.

Read the [recovery walkthrough](SHELL-RECOVERY.zh.md) before continuing an unknown operation. Roll back by selecting the retained candidate.3 runtime; preserve configuration, conversation history and receipts. Installer scripts continue to use their original published endpoints and do not select this local candidate merely because they are copied beside it.
