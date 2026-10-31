# 本机自检、错误上报与用户反馈

**云端服务状态：尚未配置**（`DIAGNOSTICS_SERVICE_NOT_READY`）。本地检查和队列可用，排队记录不能视为上传成功。

本功能复用原有体检、运行日志、错误报告和权限体系。自检读取当前本机 Koder 数据目录，既不能选择另一用户的日志，也没有云端日志读取接口。检查结果中的原因推测会标为 `hypothesis`；只有证据能证明根因，错误码本身不能证明。

## 先运行自检

在系统终端输入：

```sh
koder diagnostics check --json
koder diagnostics recent --hours 168 --json
koder diagnostics status --json
```

在 `koder ›` 对话内，把 `koder diagnostics` 换成 `/diagnostics`。`/learn /diagnostics` 可以学习每个子命令。`koder doctor --full --json` 是同一自检入口。

自检逐项检查配置有效性、启用与禁用 Skill 的冲突、内置工具参数契约、技能正文与资源完整性，以及最近 7 天保留下来的错误报告；`--hours` 可设为 1–720。每一项独立报告，某项失败不会隐藏后续检查。近期错误包括首次/末次时间、次数、场景、模块、原因假设和下一步。读取历史不能证明旧故障已经解决；返回 `attention` 时应核对关联报告。

这不等于对全部外部服务进行了实操验收。需要时分别运行 `koder doctor --tools --computer`、`koder mail doctor --json`、`koder mcp test <id>` 或 `koder model test`。后者请求真实模型，可能计费；GUI、邮箱送达和通知展示需要对应平台与授权。模型也可调用现有 `diagnostics_runtime_log`，使用 `action: recent` 或 `action: check`；没有路径、其他账号或云端查询参数。

`koder diagnostics check --repair` 仅沿用原体检中“回退已确认损坏的本地自修复补丁”的能力。不会清除失败回执、重放结果未知的命令、删除用户数据、重置配置、扩大权限或改写内核。配置冲突会给出位置和修复入口，由用户选择正确意图后修改。

## 自动错误上报

设置默认开启，但新错误只有在首次交互说明已展示并保存、KARMEN 已登录、专用服务就绪时才有自动上传路径。CI 默认不自动上传；不会批量补传旧历史。无需为了自检购买模型额度。

```sh
koder setup diagnostics off
koder setup diagnostics on
koder diagnostics status --json
```

也可进入 Setup → 自检与错误上报。关闭本地遥测 `koder setup telemetry off` 会一并停止自动错误上报，保留取消、费用预算和执行回执。查看 `/error`、复制 `/error copy`、运行自检不会把原始日志送到服务器。

自动上报只允许固定字段：发生时间、版本、操作系统、错误码、关联白名单码、场景、模块、工具结果计数、原因假设、排查方向及可选协议阶段/HTTP 状态。原始对话、文件和路径、命令参数、邮件正文、账号邮箱、密钥、凭据、会话 ID 和异常原文均排除。未知原始错误码只在本机保留，云端用 `UNCLASSIFIED_ERROR`。诊断不会把假设当成已经确认的故障原因。

队列与本地账号绑定，位于当前数据目录 `diagnostics/queue.json`，最多 100 条错误和 20 条反馈，私有文件权限，最长 7 天；每次处理清理过期项。关闭上报会停止自动处理，保留已有数据供用户决定。每项最多尝试 5 次，失败退避并遵守 `Retry-After`；不无限刷请求。网络请求最多 5 秒，CLI 退出最多额外等待 3 秒。切换账号不会上传原账号的待处理数据。`koder diagnostics discard <id>` 只移除选中的本机队列项，不删除原始任务或已提交的服务器记录。

`pending` 表示本机待提交，`blocked` 表示需要处理原因，`submitted` 仅表示获得匹配编号、内容摘要和持久存储状态的服务器回执，不代表故障已被修复。服务缺少正式入口或专用上传权限时显示 `DIAGNOSTICS_SERVICE_NOT_READY`，不会转发普通登录令牌或假报成功。手动重试已排队内容：`koder diagnostics upload --confirm UPLOAD`；不会上传未经确认的反馈草稿。

## 单独提交反馈

交互终端运行 `/feedback`，填写问题后查看脱敏结果，输入 `SEND` 提交；直接回车只保留草稿。不要输入密码或客户端授权码。脱敏识别不能保证清除自由文本中的姓名或其他个人信息，需要检查完整预览。

脚本入口分为草稿与提交两步：

```sh
koder feedback draft --text "邮箱绑定后检查失败，希望增加重试说明" --category bug --json
koder feedback show <返回的KF编号> --json
koder feedback submit <KF编号> --confirm <预览返回的draftHash> --json
```

分类可选 `bug`、`suggestion`、`documentation`、`other`。`--report <KR编号>` 可引用本账号已提交的错误报告；服务端会核对归属，未提交或其他账号的引用都会被拒绝。`--yes` 不代替确认，草稿内容变化后旧摘要失效。`koder feedback discard <KF编号>` 删除本机草稿。原官方反馈邮箱仍保留；CLI 不自动发邮件、不自动附加历史或附件。

## 服务与验收状态

客户端与服务器共用 v1 白名单、32 KiB 请求上限、固定 POST 路由和幂等键；没有报告列表、搜索或下载路由。专用服务器目录与服务身份已分配，错误对象、反馈和元数据独立保存，不计入普通账号共享空间。

本候选尚未接通正式 HTTPS 接收入口和账号侧专用上传授权，因此生产采集未开启。合成测试、接口校验和本地队列测试不等于真实公网落库。服务候选默认错误保留 30 天、反馈 365 天，需以后续部署验收为准；不承诺备份或账号注销自动删除联动。Windows/Ubuntu 原生 GUI、真实邮箱和系统通知仍按各自验收记录标注，不能据本自检改为通过。
