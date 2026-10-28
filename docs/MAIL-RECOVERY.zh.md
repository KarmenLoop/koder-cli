# 邮箱绑定、发件、查信与后台提醒

## 0.5.19：收发、查收与后台提醒逐步核对

先升级并重开进程，确认 `koder --version` 显示 `0.5.19`。以下命令在系统终端运行；已经进入 `koder ›` 对话时，将 `koder mail` 换成 `/mail`。不要删除数据目录，不要把授权码粘到普通聊天。

1. **确认绑定**：运行 `koder mail doctor --json`。`configured` 和 `smtpConfigured` 说明已保存什么；`connected` 和 `sendingAvailable` 说明当前是否验证通过。`AUTH_FAILED` 不是“没有填写授权码”。
2. **恢复认证**：运行 `koder mail check`，它会核对已有收信凭据及 SMTP 登录，不会发信。仍失败时，确认服务商已开启 IMAP/SMTP，再在 `koder mail setup 163` 的专用隐藏输入更新客户端授权码。更新同一账号不会抹掉已保存的发送结果和授权选择。
3. **验证查收**：用另一测试邮箱发送一封带唯一主题的邮件，运行 `koder mail check`。记录返回的邮件 ID，再运行 `koder mail read <实际ID>`，核对主题和正文。网络断开后恢复并重试，后来的新邮件不应越过旧失败邮件。
4. **验证发送**：运行 `koder mail send`，依次输入 beta 测试收件人、唯一主题和短正文。检查预览后输入提示要求的发送确认。`acceptedBySmtp: true` 只代表 SMTP 接受；必须在收件方另行看到同一主题，才能记录真实投递通过。
5. **开启后台**：运行 `koder mail monitor on`，阅读并确认后台检查范围及用户级常驻服务。再运行 `koder mail monitor status --json`，核对 `active`、`blockedReasons`、`lastMailSuccess`、`lastMailError`。只有进程运行、收信认证与提醒许可都有效时才显示 active。
6. **验证离开终端后提醒**：先确认当前不在安静时段、未达到提醒日上限、系统未关闭 Koder 通知，再关闭 Koder 终端。用测试收件箱接收第二封唯一主题邮件，等待后台扫描周期并记录实际弹窗。重新打开 Koder，不应重复提醒已经派发过的同一批通知。
7. **核对停止**：运行 `koder mail monitor off`。即使邮箱已解绑或凭据存储不可读取，也能撤销后台邮箱检查；其他后台任务继续。不要用 `deactivate` 替代它，除非确实要停止整个常驻服务。

| 现象 | 含义与处理 |
| --- | --- |
| `MAIL_STALE` | 服务器确认某个已列出邮件不再可读；本版记录后继续查收后面的邮件。若正文仍不可读，不编造邮件内容。 |
| `NETWORK` / `CLOSED` / `TIMEOUT` | 连接中断；保留扫描位置，恢复网络后重试。不是把失败邮件当已读。 |
| `AUTH_FAILED` | 服务商拒绝认证；自动重试暂停。明确运行 `mail check` 或更新授权码，不循环输入同一失效凭据。 |
| `MAIL_NOTIFICATIONS_DISABLED` | 邮箱提醒已关闭；需要提醒时通过 `mail monitor on` 的授权流程恢复。 |
| `AGENTD_NOT_RUNNING` / `AGENTD_NOT_ACTIVATED` | 只绑定了邮箱或常驻未运行；按 `mail monitor on` 提示启用。 |
| 进程运行但未见弹窗 | 查扫描时间、认证、许可、安静时段、日上限及系统通知权限。提交到系统不等于用户已经看见。 |
| 旧问询找不到邮件 | 本版保留仍已知的待办引用；旧版本已经淘汰的引用或服务器已删的正文无法凭空恢复，请从仍可查收的原信重新发起。 |

**beta 回传**：记录系统/版本、每一步结果、时间、唯一主题是否在收件方出现、通知是否实际弹出；附 `koder mail doctor --json` 和必要的错误码。不要附授权码、密码、邮件全文或完整私人收件列表。Windows PowerShell 5.1、CMD 和多窗口至少分别验证一次隐藏输入、绑定重开后仍在、发送确认与提醒去重。一次通过不代替其他终端的实测。

## 0.5.18：已绑定却提示未配置，或输入 use 后崩溃

先在系统终端运行 `koder --version`，升级到 0.5.18 后退出旧 Koder，再打开新进程。自动更新下载失败时不代表邮箱失效；更新与邮箱认证分别排查。不要删除 `~/.koder-cli`、Windows 用户目录下的 `.koder-cli` 或邮箱存储来重新开始。

1. 运行 `koder mail doctor --json`。`mail.configured: true` 表示仍有加密保存的绑定；`mail.smtpConfigured: true` 表示发件设置仍在；`mail.connected: false` 与 `AUTH_FAILED` 表示认证未通过。它们不等于授权码没有保存，也不等于 SMTP 没配置。
2. 运行 `koder mail check`。这是明确的重新验证：尝试现有收信凭据，必要时核对 SMTP 登录，不发送邮件。临时拒绝恢复后可以继续使用原绑定；认证继续失败时，检查 163 网页邮箱的 IMAP/SMTP 服务开关及客户端授权码是否仍有效。
3. 需要更新授权码时，运行 `koder mail setup 163`；完整邮箱地址和服务设置保持原账户，授权码只输入专用隐藏提示。也可在对话中要求修复绑定：第一次 `use` 同意收集 → 隐藏输入账号与授权码 → 第二次 `use` 核对实际收信/发信服务器后才绑定。`use` 不会发送邮件。按回车或取消可停止。
4. 同一邮箱、同一连接设置只更新授权码时，保留提醒选择、模型阅读许可和发送账本；结果未知的旧邮件不会因为重新绑定而自动重发。改成不同邮箱或连接设置，不继承原邮箱的阅读与自动回复授权。
5. 验证成功后重新提出明确的测试发件请求，核对收件人、主题、正文，再输入 `send`。`acceptedBySmtp: true` 只证明服务器接受，仍需收件方核对；更新前未完成的发件不会自动补发。
6. 要关闭终端后继续提醒，另运行 `koder mail monitor on`，确认后用 `koder mail monitor status` 核对 **active: true**。仅 `koder activate` 或 `running: true` 不证明邮箱监控已经授权。收信认证被拒绝时自动检查暂停，不会持续冲击同一失效授权码；明确重新检查或更新绑定后再恢复。

0.5.18 已验证真实 CLI 交互栈中的上述隐藏输入、重新绑定和发送确认路径；模型响应与账号为合成夹具。另有本地 TLS IMAP/SMTP 协议测试，不是向外部 163 服务发送测试信。真实 Windows、163 收件方与系统通知显示由 beta 专员分别验收；不要回传实际授权码。

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

执行 `koder mail monitor status`，确认 `active: true`。`lastMailSuccess` 是实际完成检查的时间，跳过的检查单列。默认每 30 秒轮询；网络、休眠、服务状态、安静时段与提醒预算都会影响时间，不保证瞬时推送。系统必须允许通知；提交到系统不代表用户已经看到。

只想终端开着时查信，可用 `koder mail watch`。希望收到邮件后先问你是否回复，再分别开启 `koder mail model on` 和 `koder mail inquire on`；两者均不自动发送。关闭后台查信使用 `koder mail monitor off`，不会停止其他后台任务。

## 5. 排查

先运行下列命令。Windows PowerShell、CMD、macOS 和 Ubuntu 使用相同命令：

```sh
koder version
koder mail doctor --json
```

`mail doctor` 读取本地绑定、策略和后台进程状态；不登录邮件服务器，不刷新收件箱，不发信，不更改授权。它只输出预设服务商、协议、开关、检查时间、错误码及发送状态数量，不包含邮箱地址、服务器地址、密码、邮件标题/正文或消息 ID。可将这个 JSON 交给测试专员；不要改用完整 `mail status --json` 回传，后者供用户在本机查看邮件列表。诊断报告不会自动上传。

- `mail.connected`：此前保存的绑定验证状态，不能证明服务器现在仍能登录。`remoteChecksPerformed: false` 是预期结果。
- `mail.smtpConfigured: false` 且已配置：仅收信或缺发件配置。`smtpConfigured: true` 但 `sendingAvailable: false` 是尚未通过认证，不要当作 SMTP 缺失。
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
