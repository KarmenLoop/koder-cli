# 无头、脚本与 CI：0.5.0 契约

精确文件交付、逐题隔离、自检与本地遥测见 [无头交付手册](HEADLESS-DELIVERY.zh.md)。当前 `run` 默认新建独立会话；继续已有任务请显式使用 `--session`，聊天和 `ask` 的连续历史保持原行为。

有显式任务参数时默认不读 stdin；只有 `--stdin` 才把管道输入附加到任务。没有任务参数时自动读 stdin，但完整输入的等待有界，默认 5 秒，可用 `--stdin-timeout` 调整。不要把 shell 等待左侧生产者退出的时间当作 Koder 子进程仍运行的时间。

```sh
koder ask "简短解释本仓库入口" --json </dev/null
git diff | koder ask "检查这份差异" --stdin --stdin-timeout 10 --json
koder run "只修改指定文件并运行相关测试" --yes --json > task.ndjson
code=$?
printf '%s\n' "$code"
```

PowerShell：`koder run "你的任务" --yes --json > task.ndjson`，随后查看 `$LASTEXITCODE`。CMD：调用后查看 `echo %ERRORLEVEL%`。API Key 通过 CI secret/environment 输入，不写进任务文字、日志或命令参数。

stdin 或 stdout 任一个不是 TTY，就使用无头决策。可选澄清可在说明可逆假设后继续；必要登录、批准或缺少信息要返回明确原因，不等不存在的键盘、不捏造答案。`--yes` 只沿现有文件/命令审批，不授予电脑权限、学习权限或登录凭据。

## 终态 JSON

ask/run 的模型事件按 NDJSON 输出。最后一条 type: result 保留原字段，并增加：

```json
{"type":"result","contractVersion":1,"status":"failed","completionState":"failed","exitCode":2,"reasonCode":"NO_PROMPT","text":""}
```

completionState 为 succeeded、failed、cancelled、needs_input 或 unverified。历史 status 字段兼容原会话；CI 以真实进程退出码和 completionState 判断。启动参数错误、输入超时等发生在模型创建前，也会产生终态结果。不要把“有一行 JSON”当成功；reasonCode 记录稳定原因而不输出密钥。

需要人工输入时，常见 reasonCode 为 APPROVAL_REQUIRED 或 LOGIN_OR_SECRET_REQUIRED；预算、API、未确认操作保留自己的失败代码。取消会保留已完成结果，未知副作用仍需对账。review --format json 保留独立的 parsed 契约：未解析结果不能返回假绿。

## 本地无密钥复验

发行测试使用本地 HTTP 模型夹具：保持 stdin 管道打开，Koder ask 子进程仍退出；显式等待 stdin 时按期限返回非零且不请求模型。其他测试覆盖无头澄清、退出码、审批、费用与取消。它们证明运行时契约，不等于某个付费模型的能力评测。

在自己的 CI 中先跑 `koder --version`、`koder tools audit --json`、`koder model test --tools`，再执行限定工作区的真实任务。model test 会调用你配置的模型；没有密钥时跳过并标 NOT_RUN，不能把它写成通过。
