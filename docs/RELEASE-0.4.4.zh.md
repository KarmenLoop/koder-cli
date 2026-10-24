# Koder CLI 0.4.4 更新说明

Windows 与 macOS 安装器、共享运行包、官网入口和中英文教程同步更新到 0.4.4。

## 本版新增与修复

- Windows x64 内置 Windows-MCP 0.8.8、Python 3.14.8 和固定依赖。先在 Setup 配置、测试，再启用；无需另装系统 Python。macOS 继续使用原有电脑驱动。
- 安装命令采用更合适的等待时间；超时或后台“started”不再冒充安装完成。保留回执并允许只读诊断，避免重复安装和误触其他操作。
- 绑定邮箱后，发送与回复走原生 SMTP 工具；163 使用客户端授权码。发送前仍核对发件人、收件人、主题和正文。SMTP 接受不等于对方已收到，结果不明时先核对再重试。
- 单独授权后台监控后，已激活且运行中的常驻宿主默认每 30 秒检查收件箱；提醒会持久化。安静时段和每日上限仍生效，可在 Setup 调整。这是轮询，睡眠、网络或系统限制可能延迟通知；不监控垃圾箱和自定义文件夹。
- Headroom 默认优化可还原的工具结果，保留同会话原文；Setup → Skills 可关闭。未宣称真实模型费用或质量提升。

## 安装与教程

已有用户运行 `koder update`，再用 `koder --version` 核对 `0.4.4`。新用户从 [官网下载](https://karmenloop.com/download.html) 选择 CMD、PowerShell 或 macOS 安装器；这些是 CLI 安装脚本与共享运行包，不是桌面 EXE/DMG。

[完整中文教程](USER-GUIDE.zh.md) · [安装步骤](INSTALLATION.md) · [Windows-MCP](WINDOWS-MCP-BUNDLED.zh.md) · [安装超时恢复](WINDOWS-INSTALL-RECOVERY.zh.md) · [邮箱发送与监控](MAIL-DELIVERY.zh.md) · [Headroom](HEADROOM.zh.md) · [常驻](ALWAYS-ON.zh.md)。30 课互动教程及八套中英文终端文本教程继续随包提供。

## 实际验证范围

candidate.5 的 132 项选定源码检查和 100 项实际解包检查通过；两层有重叠，不能相加当全量验收。7 项针对性复现先失败、修复后通过。正式包及公开下载核对另记发布回执。

本版 Windows 10/11 无 Node 冷安装/更新、MCP 图形操作、UAC/ConPTY/IME、系统登录重启与通知显示、真实 163 邮箱及真实模型质量仍未验收。Windows CI 因账号计费限制没有启动。macOS 登录重启与 Intel 实机也未完成本版验证。历史 8K 上下文失败继续保留；灰色禁用模型没有在本版宣称修好。

根据用户明确发布要求直接上线，未验项目不阻止发布，但不会标成通过。旧版本与旧部署保留；回退前处理活动任务，保留配置、历史和结果不明的回执。
