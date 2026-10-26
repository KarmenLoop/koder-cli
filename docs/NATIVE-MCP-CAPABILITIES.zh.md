# Koder 的原生能力与 MCP 边界

[English](NATIVE-MCP-CAPABILITIES.en.md) · [MCP 预设](MCP-INTEGRATIONS.zh.md) · [第三方声明](../THIRD_PARTY_NOTICES.md)

本文说明 0.5.2 的能力范围，区分 Koder 自己实现的功能、基于上游的衍生部分，以及需要独立运行时或账号的服务。“原生”说明实现归属，不表示所有电脑已经通过验收。MCP 是连接协议：Koder 自有工具也可以通过 MCP 暴露，随包 MCP 服务也可能完全属于第三方。

## 已有的 Koder 能力

| 能力 | 当前可以做什么 | 使用范围 |
| --- | --- | --- |
| 项目文件 | 读取、搜索，以及获授权后的写入 | 使用原有工作区和权限检查；没有因此获得全盘访问权 |
| 公开网页与 GitHub 研究 | 读取公开页面、研究公开仓库的指定引用 | 公共读取保留地址检查和取消；私有仓库、账号写入走专用 GitHub 授权流程 |
| Koder Reverse 0.1.0 预览 | 提取 PE、ELF、Mach-O、WASM、ASAR 与 JavaScript 的静态事实，查询和比较结果，解码有限 ARM64 指令 | 不执行目标；不提供完整反编译或动态调试。未知指令和不完整覆盖保持明确 |
| JS/TS 项目导航 | `koder reverse project` 和 Agent 的 `code_graph` 返回文件级依赖与符号候选，保留文件散列和来源位置 | 词法候选，不是完整语法、作用域、类型或运行时调用图；不解析外部包和动态模块 |
| 工具编排 | 选择工具、检查审批、管理任务生命周期、取消与结果回执 | 这些控制不会把被调用的第三方实现变成 Koder 自有代码 |

Koder Reverse 的静态分析核心使用项目自有模块和 Node.js 内置模块；Agent 接入复用现有宿主及 MCP 传输。项目分析目前限 256 个源文件、累计 8 MiB，另有目录遍历、输出与 Worker 时间限制。完整能力与限制见 [Koder Reverse](KODER_REVERSE.md)。

浏览器绑定和电脑驱动接口也已存在，但需要可用的实际宿主和驱动。普通 CLI 未注入 `computerDriver` 时，不能据此承诺鼠标、键盘、截图或浏览器控制可用。LCU 和 Windows-MCP 等运行时仍单独核对平台、安装状态与权限。工作区外文件读取和部分电脑调用尚未完整接入任务取消；取消任务也不保证撤销已经发生的外部动作。

## 需要保留来源的运行时

| 组件 | 当前接入 | 归属与边界 |
| --- | --- | --- |
| Windows-MCP 0.8.8 | Windows x64 随包 Python 子进程，预设默认关闭 | CursorTouch / JEOMON GEORGE 的 MIT 项目；Python 依赖还包含 GPL、MPL 等许可。不是 Koder 自研桌面引擎，也未被完整替代 |
| CodeGraphContext 0.6.13 | 外部可选预设，使用独立项目配置与图数据库路径 | MIT 上游项目；现有程序版本需另核。多语言解析、数据库及高级查询不是 Koder 词法导航的等价能力 |
| REA 6.7.0 | 随包独立 Node MCP 进程 | morluto 的 MIT 项目及各自授权的依赖；OpenPGP.js 保留 LGPL。外部分析引擎仍需单独准备，完整 REA 替代尚未验收 |
| SolidCraft 0.23.0 | macOS universal / Windows x64 的 headless CLI/MCP | SolidCraft contributors 的 MIT OR Apache-2.0 项目；Koder 提供集成和生命周期管理，不把它称作自研 CAD 内核 |
| 官方 MCP TypeScript SDK 1.30.0 | 既有应用连接宿主的协议实现 | Anthropic, PBC 的 MIT 软件及独立依赖；Koder 的任务策略与 SDK 版权分别记录 |

详细使用方法见 [Windows 随包运行时](WINDOWS-MCP-BUNDLED.zh.md)、[REA](REA.md) 与 [MCP 预设](MCP-INTEGRATIONS.zh.md)。原始版本、许可证、源归档和完整性记录继续保留；产品许可不会替换第三方许可。

## 已接通的 JS/TS 导航

Agent 的 `code_graph` 入口已接入已有 Koder Reverse Worker，提供项目概览、imports、imported_by 和 symbols，并保留工作区、分页、快照变化与取消检查。这条路径不启动额外 MCP 服务、不安装图数据库，也不执行被分析源码。可以让 Agent 先查某个文件的导入方，再读取对应源文件核实。

本地 23 项相关测试通过，其中链路测试实际经过 CLI `run`、脚本模型提供器、原生 Worker、`read_file` 和后续模型步骤。它验证本地调用链与合成项目，未调用真实付费模型，也未运行 Windows GUI。此结果不扩大为真实模型、全平台或上游 CodeGraphContext 的完整验收。

当前范围是有界的 JS/TS 文件级候选。Python、多语言语义查询和高级 Cypher 继续使用可选 CodeGraphContext，或明确退回源文件搜索。候选关系不能证明代码无用、测试通过或允许删除，也不代表全面替代 CodeGraphContext。

## 远程应用仍是远程服务

应用目录包含 OAuth 连接、文档入口和当前不可连接的项目。列表中有名字不等于已登录、已授权、已安装或已验证可用。Notion、Figma、Slack、Gamma 等服务的服务器、账号、订阅与数据仍由对应服务及用户控制。

Koder 可以独立实现客户端连接、工具发现、审批与回执，但不能由此声称实现了服务商的服务器。Gamma 的 API 接入与 MCP 接入使用不同认证路径；GitHub 使用专用命令和权限流程。Twilio 的目录项是文档入口。真实能力以当前账号授权、服务状态和实际工具发现为准。

## 查看当前状态

在项目目录中可以先查看：

```text
koder mcp capabilities --json
koder reverse status
koder reverse tools --json
koder mcp presets --json
koder mcp doctor codegraph
koder rea status
```

`mcp capabilities` 只读出实现归属和有限覆盖，不启动 MCP 宿主或联系账号。它不等于本次任务已挂载全部工具，也不会授予权限；任务内的实际工具发现和执行结果仍要分别检查。预设中的版本是目标版本；`doctor` 找到启动程序不证明其版本、实际行为或桌面权限正确。

独立新写的实现、移植或修改上游的衍生实现、原样分发的外部运行时，必须分别标注。fork 后改名、换语言或增加包装不会消除来源。完整替换 Windows-MCP、REA 或 SolidCraft 前，需要按具体能力完成目标、失败、取消、并发和平台验收；本页不作全面替代或全平台通过声明。

8K 及以下的小模型窗口按当前任务加载图谱 schema：涉及图谱、依赖、导入、符号，或已显式查询工具目录时才展示；其他任务优先保留历史空间。原生路由规则是简短运行时提示，不作为可独立 skill_read 的目录技能。
