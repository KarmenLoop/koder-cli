# Koder CLI 0.5.0：从任务到可核对结果

0.5.0 继续使用原 Core、模型/BYOK、任务历史、权限、费用账本和取消控制。新增能力在这一条执行链中工作：

```text
用户目标与项目目录
  → 当前 Harness Profile / 所需角色
  → 实际工具清单 / 权限与依赖检查
  → 原 Core 调用工具
  → 原始回执、文件、来源页码或错误码
  → 核对结果 / 继续 / 取消 / 保留未确认状态
```

先运行 `koder --version`，确认是 0.5.0。运行 `koder tools status --json` 查看配置与通道，再运行 `koder tools audit --json` 检查 Skill 正文和本地解析资源。audit 的 exit 0 表示这一层检查通过，不表示所有账号、电脑应用或工具业务均已执行通过。缺授权和缺驱动会单独列出；资源损坏或 Skill 无法读取会返回非零码。

## 能力怎么进入真实任务

| 任务 | 现有入口 | 0.5.0 的补强 | 结果依据 |
| --- | --- | --- | --- |
| 找不到工具或遇到调用失败 | tool_inventory、app_use_status、app_tools | 查询实际挂载入口和限制，不通过 shell 套开另一个 Koder | 工具返回值、原因码与后续调用回执 |
| 图片、扫描 PDF | document_ocr；koder ocr read | 内置离线中英文 OCR，默认用于文档任务 | 源文件 SHA、物理页、识别文字、置信度 |
| 文字 PDF、Markdown | pageindex | 保留目录、原文回读和引用校验；扫描页转 OCR | 来源哈希、节点、页码/行号、逐字引文 |
| 专业协作 | subagent_roles、spawn/status/collect/cancel | 90 个角色、25 个领域；角色检查表进入原子任务 | 子任务角色版本、原始工具回执、实际文件 |
| 长任务 | 原 taskExecution、Headroom、会话恢复 | 小窗口按需读取无关方法，默认不设工具轮次上限 | 保存的历史、费用预留/结算、取消状态 |
| 无头/CI | ask/run --json、--stdin | 启动失败也有终态 JSON；任一输入输出不是 TTY 即不等键盘 | exitCode、completionState、reasonCode |
| 邮箱 | 原 mail 工具与常驻监听 | 保留绑定、读取同意、发送审批、去重和网络退避 | SMTP 回执；不冒充收件人已收到 |
| 本机软件、网站 | 已连接 Apps/MCP → 浏览器 → 桌面 | 原通道优先；未知流程先查获准来源 | 驱动返回的真实状态；未安装/未授权明确说明 |

小模型窗口中，无关的逆向与预览方法延后到 skill_read；遇到能力问题或失败时再暴露工具目录。工具权限与执行端仍保留完整能力。大窗口直接提供目录；不是把全部角色和全部 Skill 正文塞进每一次请求。

## 权限不是“全部默认打开”

运行 `koder permissions status` 核对 network/browser/desktop/files 等授权。按需要通过原 permissions request、apps connect 或 mcp enable 开启对应范围。绑定邮箱或 GitHub 不等于允许所有外发和仓库写入；`--yes` 不授予电脑、学习、账号或操作系统权限。安装了某个软件也不意味着它有可用自动化接口。

可读入口与可执行能力分开。computer 驱动需要图形会话和系统授权；缺少这些条件时只能报告限制。已有网站登录态可沿宿主能力使用，验证码和登录仍需用户按原流程处理。Skill 中写了安装命令不等于已经安装，存在 MCP 配置不等于握手和业务调用成功。

## 本轮证据与仍未达到的范围

本轮在独立目录实际运行中英文图片识别、无文本扫描 PDF、PDF 页码渲染、Core 工具调用、子任务文件读写和 FIFO 取消。模型选择使用确定性测试夹具；不能据此宣布付费模型质量提高，或所有职业任务都能达到专业交付。

原邮箱 TLS 回环、MCP 子进程与权限/通知适配测试随回归运行；真实客户邮箱、GitHub 写入、Windows GUI/冷安装、Linux 桌面通知、付费模型并发各自需要独立回执。Windows 10/11 交 beta 专员实测，本机状态仍是 NOT_RUN。未签名的 macOS 锁屏组件继续 HOLD，不因 0.5.0 而变成可用的完整锁屏控制。

真实商业 SaaS、任意电脑应用、全部行业专业质量和“所有隐藏 bug 都清零”不能用这次本地测试证明。安装包保留这些边界；查看发行附件 ACCEPTANCE-RESULTS.json 获取本次实际命令、统计与未验项。只发布 GitHub，官网由原负责人维护。

[离线 OCR](OCR.zh.md) · [角色与并发](SUBAGENT-ROLES.zh.md) · [无头/CI](HEADLESS-0.5.zh.md) · [完整角色目录](SUBAGENT-ROLE-CATALOG.zh.md)
