# Koder CLI 0.5.2

本版将已有原生能力接入默认调用路径，并修复 MCP 别名和可选服务发现问题。

- 新增原生 `code_graph`：复用 Koder Reverse 查询 JS/TS 依赖、被依赖和符号候选，提供哈希、行号证据与分页变化检查。无需 Python、图数据库、MCP 子进程或新云账号。
- `koder mcp capabilities` 查看实现归属和覆盖边界；任务中的 `tool_inventory` 按常见 MCP 名称定位真正挂载的原生入口。覆盖同一操作时优先原生，缺覆盖保留外部接入。
- 长 MCP 别名不再因截断丢失工作区身份；旧绑定按已保存 ID 与工作区核对修复；重复添加同一预设别名明确报错。
- REA/Reverse/CAD 可选服务失败不再阻断无关应用发现；明确请求该服务仍如实报错。Twilio 文档入口不再被当成 MCP 服务器。

JS/TS 词法导航不等于完整调用图。其他语言、高级图谱继续可用 CodeGraphContext；Windows-MCP、REA、SolidCraft、官方 SDK 继续保留来源和许可证，不能因适配或改名宣称独立原创。GitHub、邮箱和 SaaS 服务仍依赖原服务与账号授权。

原权限、取消、费用预算、上下文控制、项目历史与 UNKNOWN 对账保持。Windows 真机冷安装/升级与图形操作交由 beta 专员，本机记录仍为 NOT_RUN；本轮未测试付费模型质量、私人邮箱投递或真实账号写入。macOS 锁屏原生组件仍是未签名 HOLD。本版仅同步 GitHub，不修改官网。

[完整能力说明](NATIVE-MCP-CAPABILITIES.zh.md)。准确本地回归与安装包证据见发布资产 ACCEPTANCE-RESULTS.json。
