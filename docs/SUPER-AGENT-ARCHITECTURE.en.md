# Coordinate a task with workers

[English](SUPER-AGENT-ARCHITECTURE.en.md) · [简体中文](SUPER-AGENT-ARCHITECTURE.zh.md)

Koder CLI 0.7.2 includes worker coordination in its existing task engine. A parent task can split independent work, send a follow-up to the same worker, and continue when a worker saves its result. You do not need to install another agent server or change model providers.

## Before you start

Install or update from the [CLI website](https://kodermodule.com/en/cli-download.html), check `koder --version`, and keep your existing account and model settings. Review the child-task setting in Setup. The existing `subagents.enabled`, concurrency, cost, permission, deadline and cancellation controls still apply. A small task can stay with one agent; more workers do not guarantee a better result.

## Try two independent pieces of work

1. Open a project you own and start `koder`. Ask it to review interface error messages and the installation guide as separate tasks. Give each task its own files so workers cannot overwrite one another.
2. Use `/subagents status` to inspect the actual workers. If you need to clarify a worker's scope, ask Koder to send that instruction to the existing worker. A follow-up does not create a new permission grant or approve a pending action.
3. Repeating the same stable request ID and content reuses its recorded request; different content under that ID is a conflict. It does not repeat an uncertain side effect just to obtain a cleaner result.
4. When a worker finishes, the parent receives its result and can continue. A queued instruction or saved event is not proof that a model has read it. A worker that has already closed can reject a follow-up.
5. Ask the parent to read the changed files and check the result against your request. A worker's completion message is not final acceptance. Keep the actual file paths and relevant tool results in the delivery.

Use `/subagents cancel <id>` with an ID from status to cancel that worker. Cancelling the parent retains the existing child cancellation and cleanup behavior. When a task resumes, unknown effects remain unknown until checked; restoring a session does not authorize replaying them.

## What was checked

The 0.7.2 package confirmation covers a 13-file implementation, test and documentation set. That is a file inventory, not 13 separate features. Controlled CLI cases and one bounded MiniMax-M3 task exercised coordination and saved results. They do not establish hour-scale autonomy, every model's behavior or native Windows/Ubuntu GUI operation. See [release checks](RELEASE-0.7.2.md#release-checks-and-remaining-limits).

## Design reference

The coordination design draws on [DeepSeek's DSH SuperAgent research prototype](https://github.com/deepseek-ai/dsh-superagent-prototype/tree/6337fc823ce20251c8de8085948165c81aaa701e). Koder uses its own existing executor, permissions and task records. This reference does not mean that Koder installs DeepSeek Harness, includes the prototype's service integrations, requires a DeepSeek model or has DeepSeek certification. The upstream project is a research reference, not an official production product.

[Task orchestration](TASK-ORCHESTRATION.en.md) · [Context handling](HEADROOM.en.md)
