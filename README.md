# Koder CLI 0.4.0-preview.6

更新后自动重启并接续原对话，保留配置、记忆与微信／飞书等渠道绑定。

- 校验安装包和新版入口成功后，当前会话及同一安装中已运行的会话会自动切换新版；恢复原工作区、命名会话、模式、历史和排队输入。
- 渠道服务先完成已接收的任务、确认和回复，再释放原 Core 所有权并用原绑定重连。不重复扫码，不开启已禁用的渠道，不自动重放已完成请求或文件／应用操作。
- `--no-memory` 的对话只经本机私有进程通信接续，不因升级写入历史文件。外部 ACP 引擎恢复可见历史作为参考，其内部隐藏状态由引擎负责。
- 新版在接管工作前启动失败时，恢复原会话一次；已经接管后的失败不会自动重放任务。等待用户确认或长任务时，更新会等到安全节点。
- `koder update` 在普通 shell 中运行新版后返回 shell；已有聊天和网关自行接续。Ask/计划模式仍只检查更新。
- 继承之前 API/上下文、连接可靠性、共享记忆、教程、应用/MCP 和开发流程功能。新自有源码不公开；使用许可和第三方归属文本保持不变。

**首次迁移**：preview.5 及更早的进程没有自动重启协议，升级后需要正常退出旧进程并启动一次 preview.6；不需要重新配置 API、记忆或渠道。从 preview.6 启动以后，后续升级会自动接续。平台自行撤销／过期的凭据仍需重新授权；系统重启／崩溃后的任务恢复不等于本次软件升级接续。

完整串行回归 393 项：390 通过，0 失败，3 项既有 Core 环境跳过。macOS 隔离旧版安装升级 20 步通过。真实子进程与本地协议服务测试覆盖接续、重复消息和启动失败回退；这不代表真实微信／飞书／企业微信、Windows 真机、多设备或生产 Core 验收。

This preview automatically restarts verified updates and continues local conversations and running gateways after admitted work settles. Configuration, memory, channel bindings and buffered input are retained. Completed actions are not replayed. Start preview.6 once when migrating a preview.5-or-older process; subsequent updates resume automatically. Native Windows and live channel/multi-device validation remain unverified.

Basic local use remains free. New Koder-owned development source is proprietary and is not published. Source archives attached to this tag contain distribution metadata only; legacy public source keeps its original licenses.

[Install](https://github.com/KarmenLoop/koder-cli#readme) · [License](https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md) · [Data and permissions](https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md) · [Credits](https://github.com/KarmenLoop/koder-cli/blob/main/OPEN_SOURCE_CREDITS.md)


This tag contains distribution documentation only. Install Koder from the release assets. The implementation is proprietary; legacy GPL source remains on the main branch under its original terms.
