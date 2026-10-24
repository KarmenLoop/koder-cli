# 通用应用操作与“不会就学”

适用版本：**0.4.2**。原有模型、工具、历史和授权保持；平台及真实账号限制见更新说明。

## 默认行为

`builtin:universal-app-use` 随包提供、默认开启，进入 `koder`、`koder chat`、`koder run` 使用的同一 harness。涉及操作应用或网站时，system 只提供一句入口和当前配置，正文由 `skill_read` 按需读取。旧 ID `builtin:app-use-and-learn` 仍能读取同一正文；已有关闭设置继续有效，不生成第二套技能或引擎。

默认按 **能覆盖任务的已连接 Apps/MCP → 浏览器 → 桌面** 选择通道。实际 schema、授权和驱动可用性优先于工具名称。已有工具或本地 playbook 能完成时直接调用；流程未知或首次安全的 GUI 定位失败时，先查官方文档、帮助中心或应用内帮助，再考虑可信公开教程。读取真实正文后给出短步骤，继续操作并重新观察，回复保留来源 URL、实际动作与结果或卡点。

复用 `koder-computer:browser-work`、`ecosystem:agent-browser:core`、`koder-computer:local-files` 和原 Apps/MCP。需要时发现准确 ID 并读取，不复制脚本、不自动安装。没有搜索通道时使用已知帮助 URL，或明确缺少哪种能力；不会把 GitHub 搜索冒充全网搜索。

## Setup 与配置

在 `/setup` 或 `koder setup` → **技能 / Skills** → **通用应用操作（不会就学）**，可分别设置：

- **启用通用应用操作**：关闭自动编排和该技能读取。
- **不会就学**：保留编排、已知工具和本地 playbook，但不自动外搜未知流程。

“一键关闭全部”也关闭本技能。设置保存在现有 CLI 配置中；重开会话后生效。在当前聊天打开 Setup 后，下一回合重新读取。正在执行的回合沿已开始的策略；关闭教程读取开关会在下一次 `app_guide` 调用时检查。Steer 中途补充“改用某网站”使用原回合和权限，不新建执行器，也不重置教程额度。

配置位置为 `$KODER_CLI_HOME/config.json`，未设置时为用户目录下 `.koder-cli/config.json`。编辑时保留其他字段：

```json
{"universalAppUse":{"enabled":true,"learnWhenUnknown":true,"preferMcpOverGui":true,"maxLearnFetches":3,"maxRecoverAttempts":2,"allowSkillProposeOnSuccess":false}}
```

`enabled:false` 在运行时并入 `disabledSkills`；通过 Setup 保存时也会写入 `builtin:universal-app-use`。旧 ID 的关闭设置同样有效。显式重新启用只移除这两个别名的关闭记录，不开启其他技能或电脑权限。部分配置更新保留其他值，缺省字段取上述默认值。

`maxLearnFetches` 为 0–20 的整数，默认 3；`maxRecoverAttempts` 为 0–10 的整数，默认 2。0 表示不自动读取教程或不在首次失败后重试。默认优先 MCP；显式 `preferMcpOverGui:false` 允许在发现连接后，对同样适用且独立获准的 GUI 优先。默认不提议持久技能；`allowSkillProposeOnSuccess:true` 仅允许经原 skill-maintenance/学习授权提出候选，不自动采用。

## 权限与预算的实际边界

本轮学习只是为当前任务读公开资料，不代开持久学习、记忆、同步或权限。`--yes` 不授予电脑、网络或登录权限。缺少权限或连接时引导用户使用原入口：

```text
koder permissions status
koder permissions request --capability network --capability browser
koder permissions request --capability desktop
koder apps list
koder apps connect <实际应用 id>
koder mcp list
koder mcp enable <已配置服务 id>
```

Agent 不能用这些命令自行授权。登录走已授权本机浏览器或可见安全宿主流程，不在聊天或明文记忆收集密码。拒绝动作不换通道绕过；发送、提交等结果 UNKNOWN 时核对原回执后再决定，不重复执行。不自动安装陌生软件、提权或改系统安全设置。

- `app_use_status` 只读查询真实连接、权限、驱动状态和当前配置；不会安装、授权或点击。
- `app_guide` 沿原 network 权限门读取公开 HTTPS 页面。匿名 GET，不带 Cookie、不执行脚本；阻止凭据 URL、私网和跨源重定向。最多两次同源重定向，单页 256 KiB、正文 12,000 字符、12 秒期限，完成后复核撤权/取消。返回标题、URL、正文、哈希和时间；来源始终是不可信参考，URL 外观不证明官方身份。
- `app_guide` 的次数由程序按同一用户回合限制；失败也计次，并发调用先占额度，中途补充不重置。关闭学习、关闭技能或额度为 0 都在请求前拒绝。
- 其他已连接浏览器/搜索工具的教程预算，以及 `maxRecoverAttempts`，属于模型工作方法约束和状态提示，尚无跨所有工具的硬拦截器。原 Core 的任务预算、审批、取消和副作用回执仍是执行边界。关闭学习不会全局关闭用户明确要求的独立检索功能。

## 平台限制

复用现有驱动，没有新增浏览器引擎。独立 CLI 只有宿主实际注入合规 driver 时才有直接 `computer_inspect/capture/act`；Windows-MCP 等通过原连接器调用。缺驱动时如实提示当前环境不能操作 GUI；授权本身不安装驱动。`workspace_preview` 只做本地项目预览，不是任意站点浏览器。找不到应用给出路径/安装建议，不静默安装。

## 六项手测

在独立工作区与专用测试账号执行，记录版本、平台、模型、实际调用、退出码、授权前后和截图/结果；真实模型可能收费。无显示环境的 GUI 项记 NOT_RUN。

1. `koder chat`：授权 network/browser 并提供可用浏览器宿主或 MCP，请求“打开 https://example.com 读标题”。确认实际浏览器读取和返回标题，而非只给链接；有覆盖任务的连接时优先核实 schema 并调用。Windows/macOS 分开记录。
2. **未授权**：新配置请求相同任务。确认提示 permissions/apps/mcp 原设置入口，不截图、不点击、不教程外搜、不称完成。驱动缺失时准确报告缺失。
3. **陌生流程**：在无适用 playbook 的测试站点做无副作用操作，或制造安全的按钮失配。确认先读帮助正文、输出来源 URL/短步骤，再继续操作并核对。核查 3 次教程与 2 次恢复的默认预算；模拟未知提交结果时只对账、不重放。
4. **关闭主开关**：Setup 关闭，重开 chat/run。确认 system 无自动入口，catalog 不暴露该技能，canonical/旧别名都拒绝读取。直接编辑 enabled=false 同样生效；全部关闭菜单后再查。
5. **关闭学习**：启用技能但 learnWhenUnknown=false，重开会话。已知工具可用；未知流程不自动搜索/读教程，app_guide 在联网前拒绝。保留来源和说明，不假称已学会。
6. **--yes 不扩权**：新配置无电脑权限，加 --yes 运行步骤 1。确认仍拒绝，授权记录不变。另测普通安装缺失只建议，不自行 apt/brew/npx 或提权。

本地脚本模型、合成 GUI 和自有 stdio MCP 检查验证 CLI 调用与边界，不证明真实模型在任意应用都选对通道。真实模型、真实账号、Windows/macOS/Linux 原生 GUI 和安装发布分别保留 NOT_RUN。此前候选的失败记录不因本次检查覆盖或消失。
