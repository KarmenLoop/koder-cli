# Independent Koder terminal tasks

This guide covers the native Koder engine in 0.4.0-preview.30 Beta. Open two or three terminal windows normally. Each active task needs a distinct session identity; no second scheduler, memory database or permission authority is introduced.

## Start independent tasks

For explicit names in the same project:

```text
koder chat --session website
koder chat --session slides
koder chat --session tests
```

Run each command in a separate window. Different workspaces already have separate session keys. In the same workspace, the first default window keeps the existing default history. If that session is occupied, a later default window gets a new `window-...` name before reading conversation history and prints the name. Keep the name to resume later with `--session`. Sequential default resume remains unchanged.

An explicitly named session that is already occupied returns `MEMORY_BUSY` instead of taking over, sharing an in-flight conversation or silently forking. Close its owner normally or choose another name. Read-only memory inspection of an occupied name also follows this ownership guard; use the owner's window to inspect its session.

## What remains separate

Each native task has its own conversation ID, conversation history, task-memory retrieval, pending prompts and approvals, cancellation and session checkpoints. The active ownership record remains held while a chat window is idle between turns. Original atomic per-turn storage and revision checks remain in place. A closed owner releases only its own record. A dead owner's record can be reclaimed using the existing stale-owner mechanism; a live or unverifiable owner is not stolen.

`/new` and `/memory` use the current window's session identity. Mutation paths check active ownership before changing stored history. Cancellation of one task does not authorize cancelling another process.

Long-context projection reserves its history disclaimer separately and prioritizes the first task and explicit constraints within the existing hard budget. Saved history is unchanged, and quoted history never becomes a new approval. This reduces lost task markers without increasing the configured model window.

## Recovery in preview.30

New default tasks check legacy turn-only owners before loading history. A disconnected supervisor cancels its own worker and releases its lease. A process-instance identifier distinguishes the current process from an earlier incarnation that used the same PID. A different live or unverifiable owner is preserved; no age-based force unlock is added. Explicit `--session` contention still returns `MEMORY_BUSY`.

If a notice persists, start the independent task with another name. Finish an older active task in its own window and close it normally. Keep the reported session name to resume it. Do not delete memory or kill unrelated processes.

## Shared boundaries

Session isolation does not create separate copies of project files. Two tasks that edit the same path still need normal file checks, permissions and coordination. Choose separate project folders when the artifacts must be independent. Explicitly saved shared notes, account settings, configured providers and deliberately shared preferences retain their existing scope; task history is not automatically promoted into a global note.

The optional external engine is outside this concurrency acceptance. Native Koder tests must not be presented as proof of external-engine ask/run session handling. Windows CMD, PowerShell, Windows Terminal, IME and close/restart behavior also require native client acceptance; local subprocess tests do not certify Windows UI behavior.

## 中文速用

分别打开两个或三个命令窗口，可以指定 `--session website`、`--session slides`、`--session tests`。同一项目里，默认会话已被占用时，后开的窗口会自动获得独立会话名，并显示恢复方法。不同项目仍按项目隔离。明确指定的会话正在使用时会提示 `MEMORY_BUSY`，不会抢占。

每个任务的对话、任务记忆、审批和取消各自处理；`/new` 清理当前会话。这里隔离的是任务上下文，同一项目文件仍是共享文件。需要完全分开产物时，请分别使用项目文件夹。原有明确保存的共享记忆和全局设置继续保持原用途。

本版按 Beta 发布；Windows 实机多窗口与完整安装更新验收仍待补齐。

preview.30 修复：旧版本只持有回合锁时，新默认任务也会先分配独立会话；监督进程断开时，自己的工作进程会取消请求并释放占用。提示不再断言一定存在另一个可见窗口。明确指定的忙碌会话仍受保护。请保留会话名以便恢复，不要删除记忆目录。
