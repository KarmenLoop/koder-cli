# MCP 与 Skill 兼容使用指南

适用于 Koder CLI 0.4.17。Skill 是工作方法，MCP 是工具连接；能读到方法不代表目标软件、账号或渲染器已经可用。两者都复用原任务、权限、取消和回执系统。

## 查询、读取与选择

```text
koder skills list --limit 200
koder skills list --query browser --json
koder skills show builtin:做表单
koder skills show ecosystem:agent-browser:core
koder ask "读取所选方法并说明需要哪些工具。" --skill ecosystem:agent-browser:core
koder skills disable ecosystem:agent-browser:core
koder skills enable ecosystem:agent-browser:core
koder skills doctor builtin:做表单
```

对话内使用 `/skills list`、`/skill <id或名称>`，用 `/skill clear` 清除选择。可用逗号分隔多个选择；不再设四项总上限，仍受实际模型窗口与资源预算约束。重名时优先使用准确 ID；项目内方法与随包方法同名时，项目方法保持优先。

Setup、CLI 和 Agent 共用原技能定义与开关。关闭后不再自动调用，也不能用手动选择绕过。关闭全部不会删除文件；自主学习、个性化、电脑访问仍分别授权。

兼容 Codex、Cursor、Workbuddy/CodeBuddy 的 `SKILL.md` 目录，包括项目/用户目录下的 `.agents/skills`、`.codex/skills`、`.cursor/skills`、`.codebuddy/skills`、`.workbuddy/skills`。保留手动调用限制、路径范围及相对资源。原宿主的专用 API、账号、Hook 和权限不会自动变成 Koder 的能力。读取脚本只得到源码，执行仍走原工具和审批。

## 方法已装好，为什么还缺软件

```text
koder skills catalog
koder skills doctor video-shotcraft
koder skills doctor playwright-cli
koder skills prepare koder-media-workflow --target media-workflow
```

`list` 列出可选方法；`catalog` 查看随包源码库和仅供参考的条目；`doctor` 只查依赖；`prepare` 将已核对的源码库复制到新项目目录，不自动安装或运行。

视频方法可能需要 FFmpeg、浏览器和项目依赖；Playwright CLI 需要对应程序；CLI-Anything 不会把所有目标软件都装进电脑。剪映包的 Windows 界面导出需单独验证，macOS 自动导出及 CapCut 不受该包支持。

代码动画工作室与文章自动发布器因许可边界继续仅供参考，不作为可执行 Skill 分发。两项旧记忆/个性化说明保持停用，本次检查没有替用户开启它们。

## 连接 MCP

支持 stdio、Streamable HTTP、明确指定的旧式 HTTP+SSE。支持协议不等于认证了所有第三方服务器。

```text
koder mcp list --json
koder mcp add local-tools --command node --arg /absolute/path/server.mjs
koder mcp add remote-tools --url https://YOUR_SERVER/mcp
koder mcp add legacy-tools --url https://YOUR_SERVER/sse --transport sse
koder mcp import /absolute/path/mcp-config.json
koder mcp test legacy-tools
koder mcp enable legacy-tools
koder mcp tools legacy-tools
koder mcp resources legacy-tools
koder mcp prompts legacy-tools
koder mcp disable legacy-tools
```

将占位地址换成服务商给出的真实地址。添加、导入后默认关闭；test 临时连接，之前关闭的服务会恢复关闭。导入配置保留 `type: "sse"` / `transport: "sse"`，`http` 表示 Streamable HTTP。未知或冲突类型会在连接前报错。地址不得夹带密码；远程使用 HTTPS，无令牌的本机服务可用回环 HTTP。认证继续使用原凭据管理，不因切换传输类型重复发送或提交。

本版补入固定 npm 10.9.8 安装组件、依赖及许可证，解决发布包缺组件导致 MCP 安装失败。安装仍需确认来源与版本、校验完整性，并禁用生命周期脚本；不会替换系统 npm。

## Windows-MCP 与 Code Graph

```text
koder mcp presets
koder mcp doctor windows-mcp
koder mcp add desktop --preset windows-mcp
koder mcp test desktop
koder mcp add graph --preset codegraph
koder mcp doctor codegraph
koder mcp test graph
```

Windows-MCP 0.8.8 在 Windows 使用随包的私有 Python，macOS 不运行这个驱动。CodeGraphContext 0.6.13 仍需独立配置启动程序，工作区和索引路径保持隔离。陈旧图只能辅助定位，不能代替源码或测试。本版修复了原 8K 上下文用例：无关方法正文按需加载，权限和工具回执保留。

## 排错

- 找不到 Skill：先查询列表与发现诊断，使用准确 ID。
- 提示停用：在 Setup 或 enable 命令中开启需要的方法。
- 提示只能手动调用：使用 `--skill` 或 `/skill` 选择。
- 缺少依赖：先 doctor，再按项目授权安装需要的组件。
- MCP 连不上：核对传输类型、地址、凭据和启动程序。已配置不等于已连接。
- 写操作结果未知：先核对原回执，不盲目重试；连接关闭不代表远程操作没发生。

本轮验证包括真实本地 SDK stdio/HTTP/SSE 会话、关闭安装脚本的本地 npm 包安装、技能读写入口、权限和打包隔离。模型回复使用脚本桩，不能冒充真实模型能力验收。Windows 图形操作、系统凭据与真实账号仍需单独验证。详见[逐项清单](MCP-SKILL-INVENTORY.md)、[接入教程](MCP-INTEGRATIONS.zh.md)和[更新说明](RELEASE-0.4.17.zh.md)。
