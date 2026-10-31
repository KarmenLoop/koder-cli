# KARMEN 账号登录：首次使用、扫码与恢复

[English](ACCOUNT-LOGIN.md) · [简体中文](ACCOUNT-LOGIN.zh.md)

适用于 Koder CLI 0.6.3。首次执行任务前必须登录 KARMEN 账号；升级后的旧安装如果没有 CLI 账号会话，也需要登录一次。账号登录与模型 API Key、邮箱授权码、电脑权限是四件独立的事。登录不会自动绑定邮箱、授予电脑权限或上传对话日志。

## 从安装完成到第一个任务

1. 安装完成后新开终端，输入 `koder --version`，确认显示 `0.6.3`。如果找不到命令，macOS/Linux 输入 `"$HOME/.local/bin/koder" --version`，再按安装教程修复 PATH；Windows 按安装器给出的完整启动路径执行。
2. 输入 `koder login`。终端提供“打开系统浏览器登录”和“显示二维码，用手机扫码登录”。用方向键选择，Enter 确认，Esc 取消。直接运行 `koder` 并提交任务也会触发登录。
3. 浏览器打开 **https://karmensecurity.com/account**。仅在这个官方网页输入账号、密码、验证码或完成 MFA，不要把这些内容粘到聊天里。
4. 网页显示设备授权时，核对设备名称和终端显示的确认码，再批准这台 CLI。二维码与链接是同一次短期授权，通常十分钟有效；不要把它分享给其他人。
5. 网页完成后返回终端即可。CLI 按服务器要求轮询，领取并保存受保护会话，自动继续原入口。不需要复制授权码，也不会监听 localhost 端口。
6. 登录成功后运行 `koder setup` 配置模型，再运行 `koder`。看到 `koder >` 后输入任务。启动后台常驻是另一个选项，`koder activate` 本身不会打开聊天。

## 手机扫码、远程终端与浏览器打不开

```sh
koder login --qr --no-open
```

在终端扫描二维码，或手动打开显示的同一官方链接。手机完成登录与设备确认后，原终端自动继续。二维码不是密码，也不包含领取令牌所需的秘密。显示错位时放大终端或直接使用链接。

Linux 桌面自动打开浏览器依赖 `xdg-open`；系统没有默认浏览器时，会给出可手动打开的链接。SSH 可在另一台设备完成网页步骤，但登录凭据保存在运行 CLI 的那台机器与当前用户的数据目录；不会自动迁移 Mac/Windows 的钥匙串。

## 查看、退出和重新验证

```sh
koder account status --json
koder logout
koder login --reauth
```

- `status` 不输出 access/refresh token；本机有效状态不等于实时服务器可达。
- `logout` 先退出本机，再尝试服务器撤销。若网络中断，`remoteRevoked: false` 会如实显示；可在账号网页管理设备。
- 会话被服务器锁定时，`--reauth` 要求在网页重新验证密码/MFA。
- Setup 有“KARMEN 账号登录”菜单；聊天内可用 `/login` 与 `/logout`。退出或另一窗口换号后，旧会话不能以新账号继续执行，重新进入 `koder`。
- 共享记忆的独立服务器登录保留在 `koder account memory ...`。它不是 KARMEN 首次登录，不会因本次升级被自动开启。

## 凭据保存在何处

默认数据目录是 `~/.koder-cli`，可由既有 `KODER_CLI_HOME` 改变。`account-session.json` 只存非秘密状态和并发代次；令牌通过已有原生凭据层保存：macOS Keychain、Windows 当前用户 DPAPI、Linux Secret Service。不同系统用户不能共用一个凭据目录。

Linux 需要已解锁的 Secret Service 与 `secret-tool`（Ubuntu 通常由 libsecret-tools 提供）；纯 SSH/CI 若没有受保护凭据服务，会返回 `LOGIN_STORAGE_UNAVAILABLE`，不会降级为明文令牌文件。请先在该运行用户的受保护环境完成登录。不能靠 `--yes` 绕过账号或系统钥匙串权限；不要在 CI 日志打印 token。

## CI 与无头任务

已有有效受保护会话时，原来的 `koder run ... --json` 可继续使用。没有登录时，任务返回 exit 2 与稳定 `LOGIN_REQUIRED`，不会启动模型、静默打开浏览器或卡在交互输入。要建立会话，单独执行 `koder login --qr --no-open` 并完成网页授权，再运行 CI。服务器身份验证需要联网；本版没有离线账号缓存授权或服务账号 token 导入功能。

## 常见原因码

| 原因码 | 处理 |
| --- | --- |
| `LOGIN_REQUIRED` | 运行 `koder login`。配置模型 Key 不能替代账号登录。 |
| `LOGIN_CANCELLED` | 用户取消；任务没有启动，重新运行登录即可。 |
| `LOGIN_EXPIRED` | 旧链接已过期，重新生成链接/二维码。 |
| `LOGIN_DENIED` | 网页拒绝设备授权，核对设备后重新登录。 |
| `LOGIN_LOCKED` | 运行 `koder login --reauth`，在官方网页完成验证。 |
| `LOGIN_NETWORK` / `LOGIN_SERVICE_UNAVAILABLE` | 检查网络/代理并稍后重试；不要求重新配置模型 Key。 |
| `LOGIN_CLAIM_UNCONFIRMED` / `LOGIN_REFRESH_REQUIRED` | 领取或轮换响应中断，为避免重放旧令牌，重新运行登录。 |
| `LOGIN_STORAGE_UNAVAILABLE` | 解锁钥匙串或配置 Secret Service；不会保存明文凭据。 |
| `LOGIN_STORAGE_INVALID` | `koder logout` 后重新登录，保留错误报告。 |
| `LOGIN_CHANGED` | 另一窗口换号或退出；重新进入 CLI，不跨账号续用旧任务。 |
| `LOGIN_PROTOCOL_INVALID` | 身份/端点/响应不匹配，停止保存并提供错误报告。 |

## 验收边界

协议假服务覆盖取消、到期、拒绝、轮询退避、刷新、并发换号、受保护存储失败与 CI。隔离账号服务完成真实 HTTP 注册/确认/设备授权/领取/刷新/任务/撤销链路，使用合成账号和凭据适配器。正式服务 discovery 已通过 CLI 原生 HTTPS 运输核对。真人手机扫码、真实 macOS/Windows/Linux 凭据存储与系统浏览器组合仍由 beta 专员实机验收；不能把合成账号联测当成全部平台通过。

## 已经登录，还需要再登录吗？

聊天和 Setup 会展示已保存的账号。短期访问令牌过期但刷新授权仍有效时，账号仍保持可见，下一次任务前自动续期并校验。运行 `koder account status` 查看可读摘要，脚本使用 `--json`。不要仅因短期令牌过期就反复登录。

浏览器选项仍打开官方设备授权页。网页已有有效 KARMEN 会话时，核对确认码并确认设备授权即可；服务端锁定或重新验证策略仍可能要求密码。`koder login --open` 可直接打开该入口。CLI 不读取浏览器 Cookie，也不跳过设备确认。

## 第一句消息报 MEMORY_BUSY

`MEMORY_BUSY` 表示指定会话被另一任务占用，与账号登录和可用内存是两回事。0.6.3将常驻入口与前台的隐式默认会话隔离，也兼容升级后尚在运行的旧常驻进程。显式同名会话仍保留原任务的所有权；等待原任务结束或换一个会话名，不删除历史或活锁。
