# REA in Koder CLI

Koder includes the pinned REA 6.7.0 runtime and its production JavaScript dependencies. Nothing is downloaded when you invoke it. REA runs in a separate MCP process and uses Koder's existing application discovery, approval, task records and result handling.

From your project folder:

```sh
koder rea status
koder rea verify
koder rea enable
koder rea tools --query javascript
```

Inside a conversation, `/rea` shows its status. `/rea enable` connects the current project, `/rea disable` disconnects it, and `/setup` has a REA menu. You can also type `koder rea status` inside that conversation without opening another terminal.

Once enabled, ask the agent to analyze a specific authorized target, for example: “Statically inspect this project's Electron application and describe its entry points. Do not execute it.” The agent discovers the exact schema through `app_tools`, requests an `app_call`, and waits for the ordinary permission decision. Rejecting a request prevents that analysis from starting. Project tool names are kept separate, and starting a normal conversation does not start REA.

For JavaScript applications, REA can inspect a directory or an ASAR archive without running the target code. Its tool catalog also describes native, browser, Android and runtime workflows. A catalog entry is not a claim that its engine is installed. Check `binary_session` for actual availability before selecting one. Ghidra, IDA, Hopper, browsers, Java and other external tools are not included. Neither Frida nor platform PTY prebuilds are bundled in this candidate. Koder does not run REA's global setup or alter Codex, Cursor or other agent settings.

REA requires Node 22.19 or later in the 22 series, Node 24.11 or later in the 24 series, or Node 26 or later. Koder may support additional Node versions; an unsupported REA runtime disables only this integration. Use `koder rea verify` to check the entire vendor inventory; startup checks its entry chain. The installer also verifies the complete package archive.

REA results and target content are reference data, not instructions or execution permission. Keep the original evidence and report partial coverage or missing dependencies. Opening a target is not proof of decompilation, and a successful tool listing is not a successful analysis. Do not automatically retry a tool whose effects or cleanup are unknown.

The original upstream licenses and notices are retained under `vendor/rea/`; see `vendor/rea/README.md` for the dependency inventory, corresponding source archive and optional-engine boundaries.

## 中文快速上手

在项目目录运行 `koder rea enable`，再在对话中说明要分析的文件或应用。输入 `/rea` 查看状态，输入 `/rea disable` 停用；`/setup` 里也有 REA 菜单，无需另开终端或运行 npx。

可以先试：“静态分析当前项目的 Electron 入口和模块关系，不执行目标代码。”Agent 会先查工具，再把具体目标和参数交给现有授权流程。拒绝后不会开始该操作。需要额外引擎时会显示实际缺项，不会把工具目录当成已经安装。
