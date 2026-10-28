# Koder CLI 0.5.19

本版继续检查 0.5.18 的邮箱链路，修复收信中断、重试漏查、旧问询无法处理和后台状态误报，保留此前授权码隐藏输入与绑定恢复修复。

- 列出邮件后，若服务器确认该邮件已删除或失效（`MAIL_STALE`），记录原因并继续后续邮件。网络、认证和存储失败不会被当成已读跳过。
- IMAP 重试按 UID 顺序处理，后来收到的新邮件不会把扫描位置提前推进，越过尚未读取的旧邮件。
- 待处理问询和 CLI 最近邮件仍需要的已知引用，不随最近收件列表滚动立即清除；保留量有上限，不接受任意猜测的邮件 ID。
- 后台状态同时核对常驻进程、邮箱认证和提醒开关。认证失败或提醒关闭时，不再显示 `active: true`。
- 未绑定邮箱时，`mail monitor status --json` 仍返回结构化原因；解绑或存储异常后仍可运行 `mail monitor off`，不停止其他后台任务。

先运行 `koder update`，退出旧进程后重开，确认 `koder --version` 为 `0.5.19`。依次运行 `koder mail doctor --json`、`koder mail check`、`koder mail monitor status --json`。如果检查仍为 `AUTH_FAILED`，在 `koder mail setup 163` 的隐藏输入中更新授权码；关闭终端后的提醒需单独授权 `koder mail monitor on`。

已在服务器删除的邮件不能恢复。本版会保留升级时仍已知的问询引用，不会补造旧版本已经淘汰的邮件头。发信仍须预览收件人和正文，并单独确认。

[邮箱恢复与 beta 实机验收步骤](MAIL-RECOVERY.zh.md) · [全部平台安装](INSTALLATION.md) · [English release notes](RELEASE-0.5.19.md)。

本地验证使用真实 TLS IMAP/SMTP 连接、加密状态、常驻进程和 IPC；交互工具链使用合成凭据与脚本模型响应。提醒派发使用测试适配器。测试没有向外部邮箱发信，不代表真实 163 收件或系统弹窗已经验收。Windows 实机及专用 163 邮箱由 beta 专员验收，此处为 NOT_RUN。包哈希和具体结果见 Release 附件 `ACCEPTANCE-RESULTS.json`。本补丁只更新 GitHub。
