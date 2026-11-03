# KARMEN 账号登录：首次使用、扫码与恢复

[English](ACCOUNT-LOGIN.md) · [简体中文](ACCOUNT-LOGIN.zh.md)

适用于 Koder CLI 0.8.5。首次任务可选择 KARMEN 网页/二维码登录，或在交互终端运行 `koder login --key` 输入团队私下提供的访问密钥，开启本机模式。本机模式不是云端账号身份，详见[本机密钥与返回 CLI](LOCAL-ACCESS-AND-RETURN.zh.md)。账号登录与模型 API Key、邮箱授权码、电脑权限是四件独立的事。登录不会自动绑定邮箱、授予电脑权限或上传对话日志。

## 从安装完成到第一个任务

以下按网页或二维码授权说明；选择本机密钥时，使用[本机模式教程](LOCAL-ACCESS-AND-RETURN.zh.md)。

1. 安装完成后新开终端，输入 `koder --version`，确认显示 `0.8.5`。如果找不到命令，macOS/Linux 输入 `"$HOME/.local/bin/koder" --version`，再按安装教程修复 PATH；Windows 按安装器给出的完整启动路径执行。
2. 输入 `koder login`。终端提供“一键打开系统浏览器登录”、“显示二维码，用手机扫码登录”和“输入密钥，进入本机模式”。用方向键选择，Enter 确认，Esc 取消。直接运行 `koder` 并提交任务也会触发登录。
3. 浏览器打开 **https://karmensecurity.com/account**。仅在这个官方网页输入账号、密码、验证码或完成 MFA，不要把这些内容粘到聊天里。
4. 网页显示设备授权时，核对设备名称和终端显示的确认码，再批准这台 CLI。二维码与链接是同一次短期授权，通常十分钟有效；不要把它分享给其他人。
5. 保留原终端，CLI 继续按服务器要求轮询、核验身份并保存受保护会话。账号网页的“返回 Koder CLI”按钮部署及真人返回验收仍需单独确认；入口可用后也只请求切回窗口，不会把点击记为登录成功。浏览器或系统拒绝切换时，手动回到原终端即可。不需要复制授权码，也不会监听 localhost 端口。
6. 登录成功后运行 `koder setup` 配置模型，再运行 `koder`。看到 `koder >` 后输入任务。启动后台常驻是另一个选项，`koder activate` 本身不会打开聊天。

## 已经在网页或 CLI 登录

- 对话中直接输入 `登录`、`打开网站登录` 或 `login` 即可打开系统浏览器；这条指令不会交给模型，也不消耗模型请求。`/login` 保留浏览器/二维码选择菜单。任务运行中输入“登录”会排队，当前任务结束后打开，不会把它当作任务引导。

- 浏览器已经登录 KARMEN 时，在 CLI 的默认选项按一次 Enter，仍会打开系统浏览器的官方设备授权页。核对确认码并确认授权后，CLI 自动继续；无需再次输入密码，除非服务端要求解锁或重新验证。可运行 `koder login --open` 直接打开此入口。
- CLI 已有有效云账号会话时，启动聊天会显示 `KARMEN · 已登录 · 名称`；Setup 主菜单及账号页显示同一身份，默认选中“查看登录状态”，不会把已登录用户带到重复登录。
- `koder account status` 显示可读状态；`--json` 保留机器可读输出。短期 access token 过期但刷新授权仍有效时，显示“下次任务前自动续期”，任务入口仍会向服务端校验。
- 网页登录和设备授权是两步。不能仅凭其他网站显示“账户”就跳过 CLI 授权，也不会读取浏览器 Cookie 或静默绕过确认。

## 手机扫码、远程终端与浏览器打不开

```sh
koder login --qr --no-open
```

在终端扫描二维码，或手动打开显示的同一官方链接。手机完成登录与设备确认后，原终端自动继续。二维码不是密码，也不包含领取令牌所需的秘密。显示错位时放大终端或直接使用链接。

Linux 桌面自动打开浏览器依赖 `xdg-open`；系统没有默认浏览器时，会给出可手动打开的链接。SSH 可在另一台设备完成网页步骤，但登录凭据保存在运行 CLI 的那台机器与当前用户的数据目录；不会自动迁移 Mac/Windows 的钥匙串。

自动切回支持 macOS Terminal/iTerm、可识别原窗口的 Windows 控制台，以及已有 `wmctrl` 的 Linux X11 窗口。Wayland、嵌入式终端或系统阻止切换时显示“登录已经完成，切回原窗口即可”。不会为聚焦安装软件、请求管理员权限或辅助功能授权，也不会打开第二个 CLI 会话。

## 查看、退出和重新验证

```sh
koder account status --json
koder logout
koder login --reauth
```

- `status` 不输出 access/refresh token；本机有效状态不等于实时服务器可达。
- `logout` 先退出本机，再尝试服务器撤销。若网络中断，`remoteRevoked: false` 会如实显示；可在账号网页管理设备。
- 会话被服务器锁定时，`--reauth` 要求在网页重新验证密码/MFA。
- Setup 有“KARMEN 账号”菜单；聊天内可用 `/login` 与 `/logout`。退出或另一窗口换号后，旧会话不能以新账号继续执行，重新进入 `koder`。
- 共享记忆的独立服务器登录保留在 `koder account memory ...`。它不是 KARMEN 首次登录，不会因本次升级被自动开启。

## 凭据保存在何处

默认数据目录是 `~/.koder-cli`，可由既有 `KODER_CLI_HOME` 改变。`account-session.json` 只存非秘密状态和并发代次；令牌通过已有原生凭据层保存：macOS Keychain、Windows 当前用户 DPAPI、Linux Secret Service。不同系统用户不能共用一个凭据目录。

Linux 需要已解锁的 Secret Service 与 `secret-tool`（Ubuntu 通常由 libsecret-tools 提供）；纯 SSH/CI 若没有受保护凭据服务，会返回 `LOGIN_STORAGE_UNAVAILABLE`，不会降级为明文令牌文件。请先在该运行用户的受保护环境完成登录。不能靠 `--yes` 绕过账号或系统钥匙串权限；不要在 CI 日志打印 token。

## Windows 提示 LOGIN_STORAGE_UNAVAILABLE

这表示 CLI 无法确认本机登录凭据已安全保存，不代表网页密码错误。Windows 使用当前用户 DPAPI，不需要 Linux 的 `secret-tool`。先运行：

```powershell
koder account doctor --json
```

该检查不要求先登录，也不联网。Windows 会用随机合成数据检查内置凭据组件、DPAPI 加密解密和目录写入，清除测试文件，并保留现有账号文件。`ready` 只表示本机存储测试通过，不表示已经登录。随后运行 `koder login --open`，完成网页设备授权，再用 `koder account status --json` 核对。

报告会区分 `HELPER_UNVERIFIED`（组件缺失或校验失败）、`PROCESS_TIMEOUT`（组件未在限时内返回）、`DPAPI_FAILED`（系统保护操作失败）、`ACCESS_DENIED`（访问被拒绝）和 `DISK_FULL`（磁盘已满）。把原因码、操作阶段、版本和 KR 编号交给支持人员；不要发送令牌、授权链接或确认码。组件被安全软件拦截时，请核对系统拦截记录，不要关闭防护或换管理员账号绕过。只有明确的组件损坏才按官方下载入口重新安装。

本版保留 0.8.2 的 Windows 存储修复：在打开网页登录前执行存储检查。一次失败不会使当前进程永久停留在临时存储；解决原因后可以直接重试。失败的原子写入不会主动删除已有凭据。所有平台仍禁止明文令牌回退。Linux 的 doctor 先检查 secret-tool 能否启动；缺组件时报告原因，可启动仍返回 `not-probed`，不代表 Secret Service 已解锁或受保护写入与读回已完成。macOS Keychain 的交互就绪状态也需独立核实。

## CI 与无头任务

已有有效受保护会话时，原来的 `koder run ... --json` 可继续使用。没有已验证账号或先前明确开启的本机模式时，任务返回 exit 2 与稳定 `LOGIN_REQUIRED`，不会启动模型、静默打开浏览器或卡在交互输入。要建立会话，单独执行 `koder login --qr --no-open` 并完成网页授权，再运行 CI。服务器身份验证需要联网；本机模式不授予云端账号权限，也不会导入服务账号 token。

## 常见原因码

| 原因码 | 处理 |
| --- | --- |
| `LOGIN_REQUIRED` | 运行 `koder login`。配置模型 Key 不能替代账号登录。 |
| `LOGIN_CANCELLED` | 登录已取消，任务没有启动。运行 `koder login --open` 并在新页面确认；若没有主动取消，保留报告编号。 |
| `LOGIN_EXPIRED` | 旧链接已过期，重新生成链接/二维码。 |
| `LOGIN_DENIED` | 网页拒绝设备授权，核对设备后重新登录。 |
| `LOGIN_LOCKED` | 运行 `koder login --reauth`，在官方网页完成验证。 |
| `LOGIN_NETWORK` / `LOGIN_SERVICE_UNAVAILABLE` | 检查网络/代理并稍后重试；不要求重新配置模型 Key。 |
| `LOGIN_CLAIM_UNCONFIRMED` / `LOGIN_REFRESH_REQUIRED` | 领取或轮换响应中断，为避免重放旧令牌，重新运行登录。 |
| `LOGIN_STORAGE_UNAVAILABLE` | 运行 `koder account doctor --json` 检查本机存储；Windows 用 DPAPI，macOS 用钥匙串，Linux 用 Secret Service。 |
| `LOGIN_STORAGE_INVALID` | `koder logout` 后重新登录，保留错误报告。 |
| `LOGIN_CHANGED` | 另一窗口换号或退出；重新进入 CLI，不跨账号续用旧任务。 |
| `LOGIN_PROTOCOL_INVALID` | 身份/端点/响应不匹配，停止保存并提供错误报告。 |

`KR-日期-编号` 是本机诊断报告编号。输入 `/error` 查看具体 `LOGIN_*` 错误码，以及 discovery（发现）、start（建立授权）、claim（领取）、identity（身份校验）或 refresh（续期）阶段。报告只保留固定技术字段，不含登录链接、授权 state、密码或令牌。

- `LOGIN_TIMEOUT`：账号接口等待超时，检查网络。
- `LOGIN_ACCESS_BLOCKED`：服务端或网关拒绝；提交阶段、HTTP 状态和 Ray 编号，不要反复输入密码。
- `LOGIN_ENDPOINT_NOT_FOUND`：官方接口不存在或路由异常，保留报告交给支持团队。
- `LOGIN_BROWSER_OPEN_FAILED`：手动打开同一个已显示链接，CLI 会继续等待授权。

## 旧版在网页操作后取消，随后出现 UPDATE_WORKER_FAILED

0.7.1 修复首次登录被 15 秒进程启动检查提前取消的问题，也修复终端切换焦点或方向键中的 ESC 序列被误当成取消。先运行 `koder update`，确认 `koder --version` 至少为 0.7.1，然后运行 `koder login --open`。保留原终端等待，在新打开的页面完成登录和设备确认；旧版本已经取消的二维码或页面无法让新事务登录。真正的 Esc / Ctrl+C 仍可停止本次授权，重新登录不会重放业务任务。

## MEMORY_BUSY 与登录无关

该错误表示指定会话正由另一窗口或任务使用，不是内存不足，也不是账号退出。0.6.3 修复常驻入口把默认会话误当显式指定会话的问题；普通新窗口会隔离到 `window-...`，升级时旧常驻进程尚未退出也可兼容。显式 `--session` 仍不能抢占正在运行的同名任务；换名或等待原任务结束，不删除历史与活锁。

## 验收边界

协议假服务覆盖取消、到期、拒绝、轮询退避、刷新、并发换号、受保护存储失败与 CI。隔离账号服务完成真实 HTTP 注册/确认/设备授权/领取/刷新/任务/撤销链路，使用合成账号和凭据适配器。此前 discovery 记录与本次 CLI 网站提升分别记录，不代表正式服务真人登录通过。真人手机扫码、真实 macOS/Windows/Linux 凭据存储与系统浏览器组合仍由 beta 专员实机验收；不能把合成账号联测当成全部平台通过。

## 本机访问密钥与网页返回入口

[本机访问密钥与网页返回入口](LOCAL-ACCESS-AND-RETURN.zh.md)

0.8.5 账号/会话与 agentd 套件合计 208 项通过、2 项本机密钥条件跳过；凭据套件另有 24 项通过、2 项 Windows 条件跳过。跳过项不能当成本轮已跑通本机密钥任务。真人注册及浏览器到桌面返回仍为 **NOT_RUN**。

## 历史 Windows VM 检查：0.8.4

[Windows Server 2022 x64 Actions 实测](https://github.com/KarmenLoop/koder-cli/actions/runs/41535590608)核对了已发布 0.8.4 全平台包和 PowerShell 安装器的完整哈希，七项检查通过：CurrentUser DPAPI、普通及含空格/Unicode 路径的新进程读回、旧密文互通、合成账号授权/持久化/刷新/退出、组件启动失败后的重试、退出登录状态下的存储诊断。这不是生产真人登录或 Windows 10/11 原生 GUI 验收。

## 0.8.5 的登录稳定性修复

- Ubuntu/Linux 在打开浏览器前检查 `secret-tool` 是否可执行。缺少时会给出 `PROGRAM_MISSING`；可先运行 `koder account doctor --json`。工具存在仍显示 `not-probed`，不代表 Secret Service 已解锁或已验证，真正登录需完成受保护写入和读回。
- 账号身份检查遇到 HTTP 503 等临时服务故障或 429 限流时，报告服务错误，不把 HTML 网关页面误判为账号损坏，不删除原会话。等待服务恢复后重试即可。
- 正在读凭据时取消不会开始刷新或清除原账号。更换账号的凭据已经写入但读回失败时，尝试在原锁内恢复旧受保护凭据；无法验证恢复时明确失败，不宣称仍可用。
- 多窗口刷新按同一账号锁串行执行，等待最多 45 秒，始终可取消。不按锁年龄抢锁，不重复轮换同一个 refresh token。
- Linux 凭据输出按完整 UTF-8 解码，中文和 emoji 不再因管道分块而损坏；非法字节会显示 `INVALID_UTF8`，不会悄悄替换用户名。
- 已保存的授权到期后，即使是跳过远程检查的本地状态路径也不能启动任务；交互入口会引导重新登录。

令牌领取或刷新响应中断，仍可能无法确认令牌是否已被消费；这种情况必须重新登录，不会为减少错误提示而盲目重放。网页登录与返回按钮由独立账号服务部署；包版本不能代替生产网页验收。测试结果与真人 Windows、Ubuntu、扫码/浏览器验收分别记录。

## 0.8.5 Windows 存储实测

[本版精确 Actions 实测](https://github.com/KarmenLoop/koder-cli/actions/runs/41622933939)使用 Windows Server 2022 x64 与 Node 22.23.4，官网通用包和 PowerShell 安装器的大小、SHA-256 均与冻结原件一致。七项全部通过：原生 DPAPI、普通及空格/Unicode 路径的新进程读回、旧密文互通、合成账号授权/持久化/刷新/退出、组件启动失败后的重试，以及退出状态下的存储诊断。这不代表生产真人登录或 Windows 10/11 图形界面已验收。
