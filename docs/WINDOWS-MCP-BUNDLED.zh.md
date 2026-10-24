# 内置 Windows-MCP

适用：0.4.4。Koder 为原生 Windows 10/11 x64 随包提供 Windows-MCP 0.8.8、CPython 3.14.8 与锁定依赖。无需另外安装 Python、pip 或 uvx。macOS 不启动此 Windows 组件；Windows ARM64 原生运行包尚未提供。

上游是 [CursorTouch/Windows-MCP](https://github.com/CursorTouch/Windows-MCP)，锁定发布提交 `b74c507d9e709223a0904cf08019edf55f2a75bb`。Windows-MCP 使用 MIT 许可证；Python 和依赖保留各自许可证，不把第三方代码宣传为自研。完整声明与相关依赖源代码归档随包放在 `vendor/windows-mcp/`。

## 当前窗口启用

输入 `/setup` → 应用与 MCP → Windows-MCP → 配置内置 Windows-MCP，再选择“测试握手与工具发现”和“启用已配置的连接”。保存配置时不运行程序；启用是明确授权启动第三方桌面 MCP，具体操作继续走 Koder 原审批。

也可在 Windows CMD 或 PowerShell 逐行执行：

```text
koder mcp doctor windows-mcp --json
koder mcp add windows-mcp --preset windows-mcp
koder mcp test windows-mcp
koder mcp enable windows-mcp
koder mcp tools windows-mcp
```

`doctor` 核对本地文件与校验值，不操作桌面；`test` 启动真实程序并发现工具，结束后恢复原停用状态。确认连接返回 `connected` 后，在同一项目的 Koder 对话中说：“打开计算器并计算 12 × 7”。Agent 应先用 `app_tools` 发现实际工具，再用 `app_call` 调用，观察界面后报告结果。

支持的工具以当前连接的真实 schema 为准，包括应用启动/切换、窗口快照、点击、输入、滚动、快捷键与 PowerShell 等。不要把工具声明当作操作已成功。工具报告与实际窗口矛盾时保留未确认回执，不自动重放。Windows-MCP 的用户接管机制保留，用户接管鼠标后 Agent 应停止输入。

关闭：`koder mcp disable windows-mcp`；移除：`koder mcp remove windows-mcp`。这些命令只处理该连接，不关闭其他任务。已有 installed/uvx 配置不自动替换；显式使用 `--runner installed --command "C:\\path\\windows-mcp.exe"` 或 `--runner uvx` 仍受支持。已有同名配置时先查看列表，避免重复新增。

## 范围和诊断

- 随包运行器固定使用 stdio，不监听 HTTP、不添加开机任务、不修改 PowerShell 执行策略、不提权、不在首次启动时下载依赖。匿名遥测关闭。
- 需要已登录的交互桌面。锁屏、无显示会话、UAC 安全桌面、管理员窗口与不同权限级别可能限制操作；不绕过系统安全控制。
- Windows ARM64、32 位 Windows、WSL、macOS 不会被误报为此 x64 本地运行组件可用。可另用通用 MCP 连接配置合适的远程 Windows 主机。
- `WINDOWS_MCP_BUNDLE_INTEGRITY`：文件缺失或被修改，重新核对安装包；不要关闭校验。
- 启用失败：保留 `mcp test` 的错误与 `mcp doctor` 输出。只有工具发现成功才显示连接成功，只有实际结果才报告完成。
- 安装更新后若使用旧版本绝对路径，查看现有配置并在停用后重新配置内置连接；不会在运行其他窗口的任务时强制迁移连接。

验收区分：文件完整性、SDK/Agent 脚本回归、隔离 Windows Server 工具调用、Windows 10/11 用户实机。前者不替代后者，也不代表任意应用、管理员界面或付费模型均已验收。当前证据和未验项见本版更新说明。
