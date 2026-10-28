# 邮箱绑定、发件、查信与后台提醒

## 1. 绑定 163 邮箱

在交互终端运行 `koder mail setup 163`。输入邮箱地址，选择 IMAP，核对授权范围后输入 `connect-mail`，在隐藏输入框粘贴客户端授权码。不要把授权码发给 Agent 对话或写进命令。163 预设为 IMAP 993、SMTP 465，均使用 TLS；仅收信模式不能发件。

绑定现在会验证只读收件箱访问，不能只凭登录成功就显示可用。用 `koder mail status` 检查绑定地址、连接状态和各项授权。绑定不自动开启模型读取、自主回复或电脑权限。

## 2. 查信与读信

执行 `koder mail check`，再执行 `koder mail status`，根据返回 ID 运行 `koder mail read <id>`。对话中的原生 `mail_inbox` 默认先刷新，显式 `refresh: false` 才读缓存。若希望模型读信，单独运行 `koder mail model on` 并确认；验证码仍走本地受保护读取流程。

## 3. 发件

执行 `koder mail send`，依次输入收件人、主题、正文。核对预览后输入 `send` 才发送。对话里也可明确要求给指定收件人发送指定内容，然后完成原生邮箱确认。`--yes` 不代替此确认。

SMTP 接受后返回消息 ID，但不代表已核实对方收件。明确的发送前拒绝或 DATA 后负确认记为 `not_submitted`；修正问题后可重新发起并再次批准。DATA 后断线、取消或确认丢失为 `DELIVERY_UNCERTAIN`，必须先查服务商发件记录与目标状态，不会静默重发。升级保留旧 UNKNOWN 记录，不把它们自动改成失败。

## 4. 关闭终端后继续收信提醒

运行 `koder mail monitor on`，核对邮箱、轮询间隔、安静时段、每日提醒上限及用户级后台服务，输入 `watch-mail`。即使之前配置写着已激活但服务已停，也会尝试重新启动。它不代开模型读取或自主发送。

执行 `koder mail monitor status`，确认 `running: true`。`lastMailSuccess` 是实际完成检查的时间，跳过的检查单列。默认每 30 秒轮询；网络、休眠、服务状态、安静时段与提醒预算都会影响时间，不保证瞬时推送。系统必须允许通知；提交到系统不代表用户已经看到。

只想终端开着时查信，可用 `koder mail watch`。希望收到邮件后先问你是否回复，再分别开启 `koder mail model on` 和 `koder mail inquire on`；两者均不自动发送。关闭后台查信使用 `koder mail monitor off`，不会停止其他后台任务。

## 5. 排查

先运行下列命令。Windows PowerShell、CMD、macOS 和 Ubuntu 使用相同命令：

```sh
koder version
koder mail doctor --json
```

`mail doctor` 读取本地绑定、策略和后台进程状态；不登录邮件服务器，不刷新收件箱，不发信，不更改授权。它只输出预设服务商、协议、开关、检查时间、错误码及发送状态数量，不包含邮箱地址、服务器地址、密码、邮件标题/正文或消息 ID。可将这个 JSON 交给测试专员；不要改用完整 `mail status --json` 回传，后者供用户在本机查看邮件列表。诊断报告不会自动上传。

- `mail.connected`：此前保存的绑定验证状态，不能证明服务器现在仍能登录。`remoteChecksPerformed: false` 是预期结果。
- `mail.sendingAvailable: false` 且已绑定：可能是仅收信绑定。运行 `koder mail setup` 重新配置并验证 SMTP；此操作需用户输入授权码和确认。
- `monitor.active: false`：按 `blockedReasons` 定位。服务进程运行不代表后台邮箱已启用；可用 `koder mail monitor on` 查看并确认授权范围。
- `MAIL_BACKGROUND_DISABLED`：后台主动检查总开关已关。邮箱监控的授权流程会重新开启；仅查看诊断不会改开关。
- `deliveries.unconfirmed` 大于零：保留结果未知或提交中的邮件记录。先到服务商网页邮箱及测试收件箱核对，不能直接再次发送。
- `inspectionFailed: true` / 退出码 3：本地状态未能完整读取，检查 `mail.errorCode`。不要删除存储锁来“修复”。

Windows beta 的真实收发验收：先保存上述安全诊断；运行 `koder mail check` 在本机确认可收信；使用专用测试收件人和明确测试正文执行 `koder mail send` 并人工批准；在收件方核对是否收到。随后开启 `koder mail monitor on`，关闭前台终端，再从测试账号发送一封新信，记录接收和通知显示时间。最后回传安全诊断及“服务器接受 / 对方收到 / 通知显示”三个独立结论；不要回传授权码或私人邮件。

- `MAIL_CHECK_IN_PROGRESS`：有邮箱操作占用锁，后台本次跳过；不是发送失败。
- `STORAGE_BUSY`：检查后台状态及正在运行的邮箱操作；不要删除锁或凭据。持续出现时提供去除隐私的诊断。
- `MAIL_BACKGROUND_OWNER_UNAVAILABLE`：无法核实记录中的后台所有者；先看 `koder status`，不要盲目开多个轮询进程。
- `AUTH_FAILED`：核对服务商客户端授权码及 IMAP/SMTP 开关，不要在报错里附密钥。
- `NETWORK` / `PROTOCOL`：检查网络、TLS 与服务商限制；登录通过但不能读收件箱也会拒绝绑定。
- `DELIVERY_UNCERTAIN`：可能已提交，先对账，不能当作“没发出”重放。

本轮已运行合成账号本地 TLS 协议测试与真实模型工具调用。真实 163 外部投递、Windows 系统通知显示和用户设备服务重启仍须分别验收。

## 0.5.8：未送达提醒恢复与不确定发件

通知渠道暂不可用或已达日上限时，未完成的邮件问询保留在原持久记录中。后台恢复或重启后通过同一通知账本重试；已经提交或状态未知的通知不重复派发。安静时段、可见范围、模型阅读许可和日上限仍生效，撤回授权会停止恢复。系统接受通知不证明用户实际看到。

原生 Agent 发件出现 `DELIVERY_UNCERTAIN` 时，最终任务返回未完成（退出码 3），不能因为有一段解释文字就标成功。先核对已发送记录，再决定是否发起新的明确授权操作。
