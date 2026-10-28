# Koder CLI 0.5.18：功能与完整教程导航

从[安装教程](INSTALLATION.md)开始。安装完成不等于已经进入聊天：运行 `koder setup` 配置模型，再运行 `koder`，看到 `koder >` 才输入任务。第一次使用可照[中文完整指南](USER-GUIDE.zh.md)逐步操作。

## 功能、入口与实际边界

| 功能 | 怎么开始 | 教程与边界 |
| --- | --- | --- |
| 编程、写作与文件交付 | `koder` 或 `koder run "任务"` | [任务结果与恢复](task-results.md)。检查实际文件和验证结果，未完成不能当完成。 |
| 网站需求、设计、开发、预览 | 聊天中说明网站目标与现有项目 | [网站交付](website-delivery.md)。默认按适用阶段接入设计 Skill；真实预览与正式部署分开。 |
| 模型与思考强度 | `koder setup`、`koder model` | [完整指南](USER-GUIDE.zh.md)。根据已配置模型与官方能力选择，手动指定优先；禁用或不支持的型号不会伪造强度。 |
| 常驻输入、引导、排队、取消 | 工作时继续输入；Esc 取消；Setup 切换模式 | [完整指南](USER-GUIDE.zh.md)。草稿与排队不是批准；工具结果未知不重放。 |
| 独立多窗口 | 在各终端启动独立会话 | [多窗口任务](MULTI-WINDOW.md)。会话分离，明确恢复同一会话时保留占用保护。 |
| 上下文控制、自动压缩 | Setup 或 `koder context` | [上下文控制](CONTEXT-CONTROLS.zh.md)、[Headroom](HEADROOM.zh.md)。受模型实际输入/输出上限约束。 |
| Skills 与自主学习 | `koder skills`、`koder growth status`、`koder learning status` | [自主学习](AUTONOMOUS-LEARNING.md)。按需读取、可关闭；不会重复安装多份同名 Skill。 |
| Apps、MCP 与本机应用 | `koder apps`、`koder mcp`；说“打开计算器” | [应用操作与不会就学](APP-USE-AND-LEARN.zh.md)。已连接工具优先，缺权限由用户确认；启动提交不等于业务完成。 |
| 磁盘、旧文件、内存、设置、杀毒 | `koder care status` | [电脑维护](COMPUTER-CARE.zh.md)、[Windows 排查](WINDOWS-DISK-RECOVERY.zh.md)。自动清理仅限明确过期且未引用的可再生成缓存；杀毒不自动安装引擎或处置文件。 |
| 邮件收发、后台监控 | Setup 绑定；`koder mail doctor --json` | [完整指南](USER-GUIDE.zh.md)、[常驻与提醒](ALWAYS-ON.zh.md)。绑定、监控启用、SMTP 接受和最终收件是不同状态，实际账号需单独验证。 |
| GitHub 绑定与项目编辑 | `koder github` | [完整指南](USER-GUIDE.zh.md)。令牌走安全输入；提交、上传等沿原确认，不写入对话或仓库。 |
| 常驻与任务完成提醒 | `koder activate`、`koder notifications status` | [常驻与提醒](ALWAYS-ON.zh.md)。日上限、安静时段与关闭入口保留，通知 submitted 不代表用户已看到。 |
| OCR、文档索引、应用工程资源 | `koder ocr`、`koder pageindex`、`koder llm-apps` | [完整指南](USER-GUIDE.zh.md)。资源目录、可调用工具和实际执行回执分别核对；识别结果需校验。 |
| 一键迁移、无头执行、遥测 | `koder migrate`、`koder run --json`、Setup 遥测开关 | [完整指南](USER-GUIDE.zh.md)。跨机凭据和系统授权按边界重新绑定；遥测默认仅本地，不启用云日志上传。 |
| 安装与后台更新 | `koder update`、`koder update auto status` | [安装](INSTALLATION.md)。本版新增 GitHub 回退和具体失败码。 |

## 三种学习方式

1. **第一次使用**：先读[从这里开始](START-HERE.zh.md)，完成安装、配置、进入聊天、首个文件交付和结果核对。
2. **完整课堂**：[1,800 课中文课程](courses/README.zh.md)、[浏览器课堂](courses/index.zh.html)、[实操练习](tutorial-labs/README.zh.md)。课堂包含手把手与开发者路线；并非每节都需要额外安装工具。
3. **终端内学习**：运行 `koder learn`。指定课例如 `koder learn 3`；只读打印使用 `koder learn 3 --print --os powershell --lang zh`。`--track hands-on` 与 `--track developer` 选择练习或开发者内容。

macOS 用 `--os mac`，Ubuntu 用 `--os linux`，CMD 用 `--os cmd`。完整指南提供本版八份终端文本导出，断网也可阅读已安装教程。英文课堂目前为 30 课，中文为 1,800 课，不能混称两者都已扩到 1,800 课。

## 平台与验证

Windows、macOS、Ubuntu 使用同一核心；macOS/Linux 包省去其他平台二进制，保留适用功能和当前教程。原生 GUI、系统权限、通知可见性与真实账号验收分别记录。macOS 完整锁屏组件仍是未签名候选，不是正式可用功能。[本版说明](RELEASE-0.5.18.zh.md)和发行附件 `ACCEPTANCE-RESULTS.json` 列出实际执行与未执行项。


旧会话反复提示“前次操作结果仍待核实”时，按[会话恢复教程](SESSION-RECOVERY.zh.md)使用 `/reconcile`，保留历史并核对原目标，不反复重试。
