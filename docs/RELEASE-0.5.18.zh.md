# Koder CLI 0.5.18

本版修复 Windows 用户反馈的邮箱恢复链路：明明保存了授权码，却被提示 SMTP 未配置；在对话里输入 `use` 后又出现读取 `isTTY` 的异常。

- 修复对话上下文继承导致隐藏凭据输入丢失终端信息。
- 分开报告“已保存绑定”“已保存 SMTP”“当前验证通过”，认证失败不再冒充未配置。
- `koder mail check` 和原生 `mail_inbox` 的明确刷新可重新核对已有收信凭据及 SMTP 登录；验证不发送邮件。
- AUTH_FAILED 时暂停自动认证重试，明确提示重新检查或更新授权码。
- 同一邮箱更新授权码保留提醒、模型阅读许可、未读通知与发送账本；换邮箱不继承旧授权。
- 已发送或结果未知的邮件不会因重新绑定而重复提交。发信仍需准确预览与独立 `send` 确认。
- 成功检查后清除之前绑定尝试留下的旧错误。

先运行 `koder update`，退出旧进程并重开，确认 `koder --version` 为 `0.5.18`。然后运行 `koder mail doctor --json` 和 `koder mail check`。若服务商仍拒绝认证，再通过 `koder mail setup 163` 的隐藏输入更新客户端授权码。关闭终端后的提醒需单独开启 `koder mail monitor on`，并核对 `active: true`。

[邮箱手把手恢复教程](MAIL-RECOVERY.zh.md) · [全部平台安装](INSTALLATION.md) · [English release notes](RELEASE-0.5.18.md)。

验收：真实 CLI 输入及工具调用栈使用合成凭据、脚本模型响应验证；另有本地 TLS 收发协议与恢复测试。没有使用真实 163 账号对外投递。Windows 实机、专用 163 邮箱和通知可见性仍由 beta 专员验收，标记 NOT_RUN。一次桌面 Electron 界面测试因隔离 CLI 工程未安装 Electron 而未能启动，原失败保留，不代表 CLI 交互失败。

本版包哈希和测试结果见 Release 附件 `ACCEPTANCE-RESULTS.json`。保留完整适用功能与独立 Skill；未改变 macOS 未签名锁屏候选状态。本补丁只更新 GitHub，未部署官网。
