# 任务未完成：查看原因和复制错误报告

适用 Koder CLI 0.5.21 及更新版本。诊断功能默认随本地遥测开启；不会上传日志，也不会发送邮件。

## 1. 出错时先看什么

任务失败、结果待核实或模型回复被截断时，终端会显示“任务诊断”卡片。卡片包含报告编号、错误码、已知原因、工具执行状态和下一步。未知根因会明确写“尚未确认”，不会把所有失败说成断网。

- **已核实**：工具有明确的 verified 回执。
- **已返回**：工具已返回，但未宣称产生的所有副作用都已核实。
- **失败**：工具返回错误或失败回执。
- **待核实**：操作结果未知，不能直接重放。
- **未执行**：有明确的 not_attempted 回执。

后台邮箱检查失败也会生成独立报告，并标记 `background-mail`；同类错误按原有规则去重。它不代表当前前台任务失败。

## 2. 在 Koder 对话中复制

在 `koder >` 后输入：

```text
/error
/error copy
```

第一条重新显示**这个窗口**最近的诊断；第二条复制脱敏 JSON。它们不调用模型、不消耗模型费用、不自动发送。然后将内容粘贴给支持团队即可，也可以补充你希望完成的操作、实际现象和复现步骤。不要附上授权码、密码、完整邮件或 API Key。

另一个新窗口的 `/error` 不会擅自显示这个窗口的错误。需要跨窗口查找时使用报告编号。`/error json` 可以直接打印结构化报告。

## 3. 已退出 Koder 时怎么查

在 Windows PowerShell、CMD、macOS 或 Ubuntu 系统终端中输入：

```text
koder logs report
koder logs report KR-20261029-012345abcdef --json
koder logs report KR-20261029-012345abcdef --copy
```

用卡片上的真实编号替换示例编号。没有编号时，第一条读取当前 Koder 数据目录最近保留的一份报告，可能来自另一个窗口，因此应核对时间、版本和场景。

要保存成文件，在终端执行：

```text
koder logs report KR-20261029-012345abcdef --json > koder-error-report.json
```

反馈入口 `koder feedback` 会显示支持邮箱与填写提示。复制和保存不等于提交；报告不会自动发给任何人。

## 4. 剪贴板不可用

Windows 复用 `clip`，macOS 复用 `pbcopy`，Linux 尝试 `wl-copy`、`xclip` 或 `xsel`。Koder 不会为了复制自动安装软件。无图形会话、远程终端或缺少剪贴板程序时，会输出 `REPORT_CLIPBOARD_UNAVAILABLE` 和可手动复制的报告正文。也可以直接使用 `--json` 保存文件。

## 5. 常见错误如何分辨

| 错误码 | 含义及下一步 |
| --- | --- |
| `MODEL_INCOMPLETE` | 单次模型回复达到输出上限；保留输出，续写未完成内容。不是工具次数用完。 |
| `MODEL_CONTEXT_LIMIT` / `CONTEXT_BUDGET_EXCEEDED` | 上下文超限；运行 `koder context status`，检查压缩及模型窗口。 |
| `MODEL_TIMEOUT` / `MODEL_STREAM_INTERRUPTED` | 模型请求超时或流中断；先核对已完成操作再决定重试。 |
| `MAIL_SMTP_NOT_CONFIGURED` | 未找到可用发信通道；运行 `koder mail doctor --json`，分别检查收信与 SMTP。 |
| `MAIL_AUTH_FAILED` | 服务商拒绝认证，不代表绑定记录丢失；用 `koder mail check` 重新验证，必要时在 `koder mail setup` 隐藏输入中更新授权码。 |
| `TOOL_RESULT_UNCONFIRMED` / `SHELL_RECONCILIATION_REQUIRED` | 前次操作结果未知。先运行 `/reconcile` 核对回执和目标状态，不要反复重放命令。 |
| `TASK_DELIVERY_INCOMPLETE` / `TASK_EMPTY_RESULT` | 没有通过交付检查的完整结果；核对实际文件和预览。 |
| `TASK_COST_*` | 费用预算停止任务；明确调整预算后再继续。 |
| `COMMAND_TYPE_ERROR` | CLI 内部发生类型异常；报告附带可获得的内部相对源码位置，交给支持团队定位。 |

错误报告是定位线索，不会解除审批、授予电脑权限、修改预算或重放未知副作用。`TASK_SKIPPED` 仍是合格跳过，不算正确答卷。

## 6. 隐私、保存和关闭

报告仅含版本、平台、时间、错误码、执行计数、少量失败工具名及哈希标识、已报告的用量、可安全识别的模型信息，以及可获得的内部相对源码位置。它不导出任务正文、工具参数、工具输出、绝对路径、原始堆栈、密码、令牌或邮件内容。根因未知时不伪造分析。

报告复用 `runtime.log` 的权限检查和轮换。日志每份约 4 MiB，保留当前及上一份；报告查询最多返回这两份中最近 1,000 份报告。被轮换清除的旧报告无法靠编号恢复，重要报告应及时复制。

在 Setup 关闭“本地任务遥测”，或运行：

```text
koder setup telemetry off
koder setup telemetry status
```

关闭后，后续诊断仍可在当前窗口查看、手动复制，但不会自动保存报告；退出前请复制。已有日志保留。重新启用用 `koder setup telemetry on`。文件执行回执、取消、费用预算和权限检查不受影响。

## 7. CI 与开发者

`run --json` / `ask --json` 的失败结果增加 `diagnostic` 对象。任务开始前的异常也会输出一条有解释的 result。取消、退出码和交付闸门保持原语义；不要仅凭存在报告判断任务成功。

开发者可按报告编号、版本、错误码、内部相对位置和失败工具哈希关联本地证据。报告不会自动触发云端收集或付费模型诊断。真实 Windows 桌面和专用 163 账号的验收由 beta 专员补齐；本地回归不能代替这些验收。
