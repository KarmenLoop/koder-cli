# Windows-MCP 与安装命令恢复

适用版本：0.4.5。本版已按用户要求发布，未验项见更新说明。

## 截图中的问题

安装 Python 的命令被普通 shell 的 20 秒上限截断，随后又通过
`start ... & echo started` 启动后台安装。这个输出只能证明启动器返回，
不能证明 Python 或 Windows-MCP 已装好。此前 JIT 也会因为本轮执行过
shell，在连续工具失败后直接停止，显示“已修复 0 次”。

## 内置组件怎么启用

Windows x64 完整包已带有独立 Python 3.14.8 和 Windows-MCP 0.8.8。
不需要为它安装系统 Python、pip、uvx，也不需要修改全局 PowerShell
执行策略。macOS 不运行这个 Windows 组件；Windows ARM64 原生包未验收。

在当前 Koder 对话里进入：

1. `/setup` → 应用与 MCP → Windows-MCP。
2. 配置内置 Windows-MCP。
3. 测试握手与工具发现，然后启用连接。

也可在系统终端逐行执行：

```text
koder mcp doctor windows-mcp --json
koder mcp add windows-mcp --preset windows-mcp --runner bundled
koder mcp test windows-mcp
koder mcp enable windows-mcp
koder mcp tools windows-mcp
```

已有配置时不用重复 add。旧的 installed/uvx 配置保留，不静默替换；
需要迁移时在 Setup 中明确调整。doctor 只核查文件，test 才启动程序
并发现工具；连接状态和原电脑操作审批分别有效。

新会话与 `app_use_status` 会在连接前显示随包运行环境，不能把
“当前直接 GUI 驱动缺失”解释为“必须安装系统 Python”。

## 真正需要安装其他软件时

只有用户授权安装的任务才执行。普通 shell 默认 20 秒；直接 winget
install 或 pip install 默认 120 秒。工具可显式请求 `timeout_ms`，
上限 300000 毫秒。上限在审批处展示并记录，可以取消；不是管理员权限，
也不会自动接受 UAC。

等待超时、输出不完整或后台启动后，保留
`COMMAND_RESULT_UNCONFIRMED` 回执。进程已清理不表示安装已回滚。
本轮仅能读取已有日志、目录和连接信息，不能重复执行、改用另一个工具
重放、自动发送或发布。只读排查结束仍未核实，CLI 返回 exit 3 和
`SHELL_RECONCILIATION_REQUIRED`；这不表示 API 连接故障。

若截图中的旧安装仍可能在运行，请先确认系统安装界面或既有安装日志，
不要再次粘贴安装命令。确认实际状态后再向 Koder 发出新的操作指令。
不要把密码、客户端授权码或 API Key 发到聊天或日志中。

## 验收边界

本地回归验证配置发现、真实受控子进程超时/取消、JIT 与权限边界，
以及 CLI 的退出码。Windows start 的测试为注入进程夹具，不证明
Windows 10/11 上的 winget、UAC、冷启动或桌面点击已通过。
这些原生验收仍需 Windows 测试环境；历史失败和未验项保留。
