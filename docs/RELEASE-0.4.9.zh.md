# Koder CLI 0.4.9

本版修复实时输入，并补齐“任务没完成却没有说明”的诊断。Windows CMD、PowerShell 与 macOS 使用同一版本化运行包和各自的安装脚本。

## 新增与修复

- 本地引导等待会话准备完成，agentd 引导等待真实接收回执；不能接收时显示具体原因再排队，回执未知时不会自动重放。
- 忙时仍可按 / 打开预输入菜单，建议、模板和命令只填入可编辑草稿。窄终端和不支持的终端显示降级提示。菜单开启时 Esc 先关闭菜单，再按 Esc 取消任务；Ctrl+C 始终取消当前任务。
- “stop a server”等普通任务不再误触打断；“停下，改做 X”会取消并排队后续文本。异步回执乱序也保持输入的 FIFO 顺序。
- 新增 koder logs 和 Agent 只读日志工具；日志仅记录版本、事件、错误码等元数据，4 MiB 轮换，不记录任务正文、模型正文、邮件内容或凭据。
- 未解决的权限拒绝和空结果给出具体原因、下一步命令及非零结果；读取历史错误日志不会误判本次诊断失败。

## 升级后怎么用

先运行 koder --version 核对 0.4.9。聊天内 /setup → 回答中的输入方式，选择默认“引导”或“排队”。任务中直接输入补充并回车；空输入按 /，方向键选择，Tab 填入后可继续编辑。

查看近期记录：koder logs --tail 100；查看路径：koder logs --path；结构化输出：koder logs --json。koder doctor 展示日志与输入模块状态。

0.3.0 不含这些输入模块，需要使用当前官网安装器或受支持的 koder update 升级。旧版设置不能补上缺失源码；0.4.4 及更早更新器若拒绝大包清单，可用官网安装器覆盖升级，保留用户配置与历史。本次不替用户安装到原 Mac。

## 保留与未验

保留软件/模型自动更新、Skills、MCP、邮件、多窗口、权限、许可与 agentd。--yes 不授予电脑权限；预先排队文本不能批准写入；无头 run --json 不强制显示菜单。

本地无密钥检查覆盖真实 CLI/readline、harness、回环 IPC、临时目录及脚本模型。PowerShell 5.1 冷启动、Windows Console/ConPTY/IME、Windows-MCP 图形操作、真实邮箱与模型质量仍分别标记 NOT_RUN；不能以本地桩验证代替实机验收。

[实时输入教程](SESSION-INPUT-AND-SKILLS.zh.md) · [预输入菜单](PROMPT_PREFILLS.md) · [运行日志](RUNTIME-DIAGNOSTICS.md) · [自动更新](AUTO-UPDATE.zh.md) · [安装教程](INSTALLATION.md)
