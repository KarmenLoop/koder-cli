# Koder CLI 0.4.10

普通 shell 命令的默认等待从 20 秒提高到 5 分钟；直接 winget、pip、npm/pnpm 和 yarn 安装默认等待 15 分钟。单次可明确申请最多 30 分钟。已有审批和明确指定的短时限仍有效，运行中仍可取消。

到达工具步数上限会显示 TASK_STEP_LIMIT、已用/上限步数及继续方式，保留当前会话、已执行结果和文件。命令内的 curl -m/--max-time 是独立时限；本版补充了模型指引，不能用延长外层等待覆盖命令内部期限。真实超时仍先核实结果，不自动重装、重发或重复执行。

运行 koder update 或使用[官网安装器](https://karmenloop.com/download.html)，然后核对 koder --version 为 0.4.10。Windows CMD、PowerShell 与 macOS 安装入口同时更新，共用版本化运行包。原有 Skills、MCP、邮箱、模型路由、实时输入、多窗口和权限机制保留。

[命令时限与恢复](COMMAND-DURATION.md) · [完整中文教程](USER-GUIDE.zh.md)

本机真实命令耗时 45.06 秒，退出码 0；本地测试验证取消、短时限、旧审批、历史保留和邮箱故障隔离。两项合成输入交互测试在未修改的 0.4.9 基线也失败，记录继续保留。Windows 10/11 实机、PowerShell 5.1 冷启动、ConPTY/IME、Windows-MCP 图形操作和真实模型/邮箱账号仍为 NOT_RUN。本版按此前直接发布的授权上线，不把未验项目写成通过。未签名 macOS 锁屏原型继续独立保留。
