# 14. 接入编辑器：Zed、Neovim、Emacs

建议 35 分钟

**目标**：让编辑器使用同一个Koder入口，并学会导入跨工具Skill而不执行陌生脚本。

**准备**：先确认CLI独立可启动。编辑器插件的版本与ACP支持以其实际安装状态为准。准备自己获授权使用的一份SKILL.md。

## 手把手操作

1. 运行 koder editor zed（或nvim/emacs），阅读生成的配置片段。

   **应看到**：命令路径指向实际安装版；Windows按输出使用对应启动器。

2. 先备份编辑器设置，再把片段合入已有配置；打开一个测试工程。

   **应看到**：不覆盖原插件设置，工作区是当前测试工程。

3. 在编辑器发起只读问题，再提一次小修改并拒绝。

   **应看到**：读、提案和审批能往返；拒绝后文件不变。

4. 运行 koder skills list 和 koder help skills；按导入帮助选择目录，再show检查内容。

   **应看到**：Codex/Cursor等SKILL.md可按兼容范围发现；宿主专有API不会因导入而自动可用。

## 常见问题与恢复

- **编辑器找不到koder**：核对绝对命令路径、系统环境和启动参数，不反复复制不同版本。
- **Skill里命令不可用**：把宿主专有工具标为缺依赖，走已有工具映射或说明限制，不伪装完整兼容。

## 作业与自查

在测试工程导入一份只读说明Skill，记录发现、读取、适用任务与不支持的工具。

**自查标准**：导入未安装依赖、未授予权限、未自动执行脚本；编辑器任务仍受原审批控制。

## 开发者教学

1. ACP协议输出与诊断日志分流，避免stdout动画破坏协议。

2. 测试启动、提案、拒绝、取消和退出资源回收；连接成功不代表每个能力已验证。

3. 开发自有Skill采用明确when-to-use、步骤、成功标准与失败恢复；不要把不可信仓库说明变成系统授权。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [PORTABLE-SKILLS.en.md](../PORTABLE-SKILLS.en.md)
- [MCP-SKILL-COMPATIBILITY.zh.md](../MCP-SKILL-COMPATIBILITY.zh.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 14 课 / 共 30 课 · 接入编辑器：Zed、Neovim、Emacs ━━
教练 › 喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：
  · （这里显示 koder editor zed 的配置片段。）
    koder editor nvim
        Neovim（CodeCompanion），配置文件在 %LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua
    koder editor emacs
        Emacs（agent-shell），配置文件在 %APPDATA%\.emacs.d\init.el
  提示 · Windows 上编辑器启动程序时只会自动补 .exe，所以片段里写的是 koder.cmd，别改成 koder。Zed 的设置文件在 %APPDATA%\Zed\settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。
  （小声）Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 14 课 / 共 30 课 · 接入编辑器：Zed、Neovim、Emacs ━━
教练 › 喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：
  · （这里显示 koder editor zed 的配置片段。）
    koder editor nvim
        Neovim（CodeCompanion），配置文件在 %LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua
    koder editor emacs
        Emacs（agent-shell），配置文件在 %APPDATA%\.emacs.d\init.el
  提示 · Windows 上编辑器启动程序时只会自动补 .exe，所以片段里写的是 koder.cmd，别改成 koder。Zed 的设置文件在 %APPDATA%\Zed\settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。
  （小声）Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 14 课 / 共 30 课 · 接入编辑器：Zed、Neovim、Emacs ━━
教练 › 喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：
  · （这里显示 koder editor zed 的配置片段。）
    koder editor nvim
        Neovim（CodeCompanion），配置文件在 ~/.config/nvim/lua/plugins/codecompanion.lua
    koder editor emacs
        Emacs（agent-shell），配置文件在 ~/.emacs.d/init.el
  提示 · Zed 的设置文件在 ~/.config/zed/settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。
  （小声）Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 14 课 / 共 30 课 · 接入编辑器：Zed、Neovim、Emacs ━━
教练 › 喜欢在编辑器里干活？Zed、Neovim、Emacs 都能通过 ACP 协议启动 koder acp，在编辑器里对话、看差异、批准修改。比如 Zed 只要这几行：
  · （这里显示 koder editor zed 的配置片段。）
    koder editor nvim
        Neovim（CodeCompanion），配置文件在 ~/.config/nvim/lua/plugins/codecompanion.lua
    koder editor emacs
        Emacs（agent-shell），配置文件在 ~/.emacs.d/init.el
  提示 · Zed 的设置文件在 ~/.config/zed/settings.json。懒得复制？koder setup 里的「编辑器」能一键复制到剪贴板。
  （小声）Vim 用户请放心，退出 Koder 比退出 Vim 简单多了：Ctrl+D。
```

</details>
