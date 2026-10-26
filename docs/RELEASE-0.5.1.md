# Koder CLI 0.5.1

Control context size and automatic compaction from Setup, `koder context` or `/context` in chat. Windows and macOS installers use the same updated runtime.

## What changed

- Set the model window and response reserve without rewriting credentials. Project and session model selection is respected.
- Enable or disable automatic compaction; choose trigger and target percentages and how many recent turns to prefer. Defaults are on, 80%, 60% and four turns.
- Use one history projection policy in foreground sessions, agentd tasks, child agents and MoA. Remove early child trimming and fixed advisor text truncation that bypassed the selected policy.
- Keep current instructions and steering together. Protect pending/unknown receipts and preserve signed groups or reconstruct a complete returned group atomically at hard overflow; retain original local history. Signed tool metadata is included in request estimates.
- Inspect estimated input, tool schemas, output reserve and compaction results. These estimates are separate from provider billing. Turning compaction off returns a local error if the full request cannot fit, rather than silently deleting history.

## Start

```sh
koder context status
koder context set --trigger-percent 85 --target-percent 65 --keep-turns 6
koder context off
koder context on
```

Set model limits only to values your provider supports. `koder context reset` resets compaction preferences without changing model limits, credentials or Headroom. [Step-by-step guide](CONTEXT-CONTROLS.en.md) · [中文教程](CONTEXT-CONTROLS.zh.md).

## Verification scope

Acceptance receipts accompany the release and identify source tests, packaged commands and installer/upgrade checks separately. Provider-request checks use local HTTP/scripted models; they do not establish a paid model's long-context answer quality. Native Windows device testing remains beta-owned. Linux desktop/Windows notification display, live private mail and external account writes are not newly certified by this update. The unsigned macOS locked-use helper remains on hold.

Original Core permissions, BYOK routing, project history isolation, cancellation and optional cost budgets remain. Headroom is a separate reversible tool-result stage. External ACP engines retain their own context implementation. GitHub is the publication destination; no official website content is changed.
