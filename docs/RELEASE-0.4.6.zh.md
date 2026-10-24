# Koder CLI 0.4.6

本版修复内置 Skill、命令入口与 MCP 运行时之间的接线问题。Windows CMD、PowerShell 与 macOS 安装器使用同一份版本化 CLI 包，保留原有功能、权限、模型配置、项目历史和常驻服务。

## 本次更新

- 内置 Skill 可在 CLI 和 Agent 中统一发现、读取、选择；Setup 与命令开关使用同一配置。已关闭的技能不能被绕过调用；同名项目技能优先。修复目录超过一页时预选技能识别遗漏。
- 补齐安装包中遗漏的私有 npm 10.9.8 及固定依赖，恢复 MCP 包安装能力。仍须按现有安装计划确认，禁用安装脚本，不修改系统 npm。
- 支持显式选择旧版 HTTP+SSE：`--transport sse`。导入时保留协议，未知或冲突的类型在连接前报错。保留 HTTPS、凭据、同源、审批和回执规则，不自动重放业务操作。
- 按任务读取基础方法正文，减少无关上下文；Code Graph 的 8K 上下文回归通过，通用应用操作与权限策略继续保留。
- JIT 关闭时，工具不存在或执行报错也会返回失败，不再包装成成功结果。

## 安装、升级与教程

从[官网下载](https://karmenloop.com/download.html)，按[安装教程](INSTALLATION.md)选择 CMD、PowerShell 或 macOS。它们是 CLI 安装脚本，不是桌面 EXE/DMG。

```text
koder update
koder --version
koder skills list --limit 200
koder mcp presets
koder setup
koder learn
```

版本应显示 `koder 0.4.6`。0.4.4 及更早版本若拒绝大包清单，运行官网安装器覆盖升级一次；不要删除配置与历史。继续保留 0.4.5 引入的 512 MiB 更新包上限。

新增[完整 MCP / Skill 适配教程](MCP-SKILL-COMPATIBILITY.zh.md)和[逐项清单](MCP-SKILL-INVENTORY.md)，并更新[中文手册](USER-GUIDE.zh.md)、[英文手册](USER-GUIDE.en.md)、30 课互动教程和 8 份双语终端教程。

## 验证范围

已执行隔离的目录、资源读取、开关、MCP stdio/HTTP/SSE、npm 本地安装、Agent 续答、JIT、Headroom 与权限回归。真实打包后的两项应用测试在原有 180 秒预算内通过；先前统一测试入口的 60 秒取消记录保留。桌面 UI 测试因 CLI 验证环境没有 Electron，图形行为仍未验，不计作通过。

72 个条目中，68 个正文/资源可读，2 个接口说明按策略停用，2 个因许可限制只保留引用。可读不代表外部软件已安装或完整业务已执行。视频渲染依赖、目标应用、真实邮箱/云账号、真实模型质量、Windows 10/11 冷安装更新和 MCP 图形操作、系统凭据/通知、macOS Intel 实机仍需分别验证。本版没有解禁此前不可用的模型预设。

按用户要求发布，未等待全部实机验收。保留旧版、失败记录和回退入口；回退前保存配置、历史及结果不明的操作回执。第三方许可与版权声明保持原样。
