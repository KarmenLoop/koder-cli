# Command duration and saved progress

Applies to Koder CLI 0.4.10. Windows CMD, PowerShell and macOS share these rules; native Windows acceptance remains NOT_RUN.

## Time limits

Ordinary shell commands now default to 300 seconds (5 minutes). Direct winget,
pip, npm/pnpm ci or install, and yarn install commands default to 900 seconds
(15 minutes). A tool request may specify timeout_ms from 1 to 1800000 (30
minutes). The proposed duration is shown before approval and recorded in the
receipt. An explicit shorter limit is binding. Existing approvals and remembered
allow rules do not silently acquire a longer duration. Cancellation remains
available throughout the wait.

The command may have its own deadline: curl -m 20 still stops after 20 seconds,
even when the outer shell limit is five minutes. The Agent is instructed to use
the normal default for downloads/builds and reserve shorter limits for deliberate
diagnostics. This guidance does not rewrite user commands or guarantee a model
will always choose the right duration. Provider/connect/diagnostic and process
cleanup limits are separate and have not been raised.

## When work cannot continue

TASK_STEP_LIMIT identifies a tool-step budget stop, with consumed and allowed
steps. It is not a network timeout. The same conversation retains prior tool
results and files. Continue with a bounded pending step using the saved results;
do not start a fresh session merely to continue this work.

A real shell timeout still yields COMMAND_RESULT_UNCONFIRMED. Stopping a process
does not prove that its writes or external effects were rolled back. The current
turn switches to read-only diagnosis and returns exit 3 while the result remains
unverified. Do not retry an installation, send or publish automatically.

MAIL_CHECK_FAILED: NETWORK comes from the background mailbox check. Its failure
does not cancel the foreground task. Investigate mail separately with the mail
settings and koder logs --tail 100; never paste an authorization code into logs.

## 中文使用说明

- 普通命令默认等待 5 分钟；直接安装命令默认 15 分钟；单次最多申请 30 分钟。
- Agent 通常应省略 timeout_ms 使用默认值。明确指定的短时限仍有效；审批后不会偷偷延长。
- curl -m 20/25 是命令内部的独立时限，提高 Koder 等待上限不能覆盖它。
- TASK_STEP_LIMIT 会显示已用/上限步数，并说明当前会话和已有结果保留；后续可根据结果继续待办。
- 真正超时仍先核对日志、文件及外部状态，不自动重放可能已经完成的操作。
- 邮箱网络检查失败与前台任务分开；Ctrl+C 仍可取消当前任务。

## Evidence

Local tests cover a real 45-second macOS foreground process, virtual Windows
command invocation, explicit short deadlines, legacy approvals, history
continuity and mailbox failure isolation. Scripted-provider tests are not
authenticated model or mailbox acceptance. Native Windows 10/11 and PowerShell
5.1 remain NOT_RUN. Two existing input-interaction tests also fail on the
unchanged 0.4.9 baseline; their records are retained separately.
