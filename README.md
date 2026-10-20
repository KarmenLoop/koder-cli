# Koder CLI

**0.4.0-preview.10** · [下载 / Download](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.10) · [使用许可 / License](EULA.md) · [授权与数据说明 / Consent guide](ACCEPTANCE.md) · [版权与国际用户说明 / Copyright notice](LEGAL-NOTICE.md) · [第三方来源 / Credits](OPEN_SOURCE_CREDITS.md)

Koder 是自接 API 或本地模型的终端助手。基础本地使用免费，不强制购买会员；模型服务可能另行收费。本预览版按专有使用许可提供下载安装，新的自有开发源码不公开。已经发布的旧 CLI 源码、历史版本及第三方组件保留原许可。公开仓库中的旧源码仍是 0.3.1；下载版本以本页 Release 与安装后的 `koder version` 为准。

Koder is a terminal assistant using your own API or an installed local model. Basic local use is free, with no required membership; model providers may charge. This downloadable preview uses a proprietary end-user license. New Koder-owned development source is not published. Legacy public source (0.3.1), prior distributions and third-party components retain their applicable licenses.

## 安装前 / Before installing

官方发布与维护团队：KARMENLOOP 官方团队 / KARMENLOOP Official Team。所在地：中国上海 / Shanghai, China。官网：https://karmenloop.com。邮箱：info@karmenloop.com。

先阅读 [EULA.md](EULA.md)、[ACCEPTANCE.md](ACCEPTANCE.md) 与 [LEGAL-NOTICE.md](LEGAL-NOTICE.md)。普通安装会在真实终端请你输入 `accept` 并回车表示同意；输入 `decline` 或按 Ctrl+C 取消；Windows 空回车会重新询问，Mac/Linux 空回车取消，取消后不会下载或安装。接受软件许可**不会开启学习、同步、应用连接或电脑权限**。这些能力分别配置。API请求可能包含任务、选择的文件、相关记忆和工具结果；关联群全员可使用关联私聊记忆，群回复对群成员可见。

Official publisher and maintenance team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.

Read the license, consent guide and copyright notice first. A normal install asks you to type `accept` and press Enter on a real terminal. Type `decline` or press Ctrl+C to cancel before any download. On Windows an empty Enter asks again; on Mac/Linux it cancels. License acceptance does not enable learning, synchronization, application connections or computer grants. Your selected model may receive tasks, selected file contents, relevant memory and tool results. All linked-group members can use linked private-chat memory and see replies posted to the group.

安装器面向 macOS 11+、Linux/WSL、Windows 10/11，使用 Node.js 22+ 或按平台下载运行时，并校验安装器与程序包。Windows 真机安装/文件操作、真实微信/飞书/企业微信/Gamma及多设备端到端验收仍待完成。本版是预览版，请查看 [RELEASE_STATUS.md](RELEASE_STATUS.md) 中证据与限制。

Installers target macOS 11+, Linux/WSL and Windows 10/11, using Node.js 22+ or downloading the platform runtime. Installer and package checksums are verified. Native Windows, live messaging/Gamma and physical multi-device acceptance remain pending. See [release status](RELEASE_STATUS.md).

See the complete [step-by-step installation and troubleshooting guide](docs/INSTALLATION.md), including Windows PowerShell/CMD, model setup and the first successful request.

See the [MiMo V2.6 setup guide](docs/MIMO.md) for pay-as-you-go, Token Plan, model selection, Hermes configuration and account-test limits.

## 安装 / Install

普通安装在终端里输入 `accept` 并回车。`decline` 或 Ctrl+C 会取消；Windows 空回车会重新询问，Mac/Linux 空回车取消。

macOS / Linux / WSL:

```bash
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | bash
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex
```

Windows CMD:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex"
```

### 已阅读并同意的自动部署 / Unattended install after you have read and agreed

下面的变量只给已经阅读并有权同意的人使用。不要把它写成普通安装的必做步骤，也不要替未阅读的用户预先填写。只有精确值 `1` 表示同意。

The variable below is only for someone who has already read the terms and is allowed to accept them. It is not a required step for a normal install, and it must not be prefilled for someone who has not read the terms. Only the exact value `1` is acceptance.

```bash
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
```

```powershell
$env:KODER_EULA_ACCEPT = "1"
irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex
Remove-Item Env:KODER_EULA_ACCEPT
```

```bat
set "KODER_EULA_ACCEPT=1"
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex"
set "KODER_EULA_ACCEPT="
```

装完重新打开终端，让新的 PATH 生效。Mac/Linux 默认安装到 `~/.koder-cli`、启动器在 `~/.local/bin`；Windows 程序默认在 `%LOCALAPPDATA%\koder-cli`，配置在 `%USERPROFILE%\.koder-cli`。记忆目录另见实际状态。

Reopen the terminal after installation so PATH refreshes. Mac/Linux default to `~/.koder-cli` with the launcher in `~/.local/bin`. Windows installs the program in `%LOCALAPPDATA%\koder-cli` and stores configuration in `%USERPROFILE%\.koder-cli`. Inspect the separate memory location below.

```text
koder version
koder setup
koder learn
```

安装包包含 `EULA.md`、`ACCEPTANCE.md`、`LEGAL-NOTICE.md`、完整第三方许可、来源说明与教程。GitHub 自动生成的本预览版 source archives 仅含发行文档；开发源码不随新标签公开。可从 Release 下载 [校验清单](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.10/SHA256SUMS)。

The package includes the license, consent guide, complete third-party notices and tutorials. GitHub's automatic source archives for this preview contain distribution documentation only. Checksums are available on the release.

## 首次使用与教程 / First use and tutorial

设置界面包含语言、模型、上下文/输出、记忆与灵魂、电脑权限、应用/MCP、渠道、编辑器、教程与使用许可说明。四项学习相关功能默认关闭，可独立选择或跳过。对话中使用 `/setup` 返回设置，`/learn` 返回教程。

Setup covers language, models, context/output limits, memory and soul, computer scope, apps/MCP, channels, editors, tutorials and the consent guide. The four learning-related features default off and can be selected independently or skipped. Use `/setup` or `/learn` in a chat.

教程共 **23课**，支持中文/英文、PowerShell/CMD/macOS/Linux；练习场使用脚本化教练，真实练习差异、拒绝修改和命令，但不请求付费模型。新增功能章节只演示，不会自动连接账号或授权。旧教程已毕业用户会从新第17课继续，未完成进度会保留。

The **23-lesson** tutorial has Chinese and English editions for four shells. A scripted coach runs real edits and command exercises in a disposable practice folder without paid model requests. New feature chapters only explain actions; they do not connect accounts or grant permissions. Old graduates resume at lesson 17, while unfinished progress is retained.

| 课号 / Lessons | 内容 / Content |
| --- | --- |
| 1–16 | 开屏、模型、差异/命令批准、提问、模式、审查/修复/测试、流程、MoA、渠道、编辑器、扫描、安装 / Core CLI workflow |
| 17 | 使用许可与各项可选授权 / License and optional consent |
| 18 | 文件与电脑授权、Windows路径、撤销 / Files, computer scope, Windows paths, revocation |
| 19 | 存储位置、共享空间、群私聊与跨设备 / Storage, groups, private chats and devices |
| 20 | 习惯、当天状态、灵魂、每日反思与主动服务 / Learning, daily state, soul, reflection, proactive service |
| 21 | Gamma、应用与MCP / Gamma, apps and MCP |
| 22 | API、上下文、更新与卸载排障 / API, context, updates and uninstall |
| 23 | 速查表与毕业 / Reference and graduation |

```text
koder learn --print
koder learn --print --lang en --os powershell
koder learn 17
koder help permissions
koder eula
```

只读帮助与 `learn --print` 可以在接受协议前查看。交互练习会建临时文件，需先接受软件许可。通过其他方式安装时，阅读后运行 `koder eula accept`。

Read-only help and `learn --print` work before acceptance. Interactive practice creates temporary files and requires the software license. For another installation method, read the agreement and explicitly run `koder eula accept`.

## 开发任务：先理解、检索，再实现 / Development workflow

开发任务默认读取内置 `development-workflow`。新项目先用 GitHub 公开技术关键词检索候选，核对固定提交的许可证、架构与安装说明，再按实际缺口分轮提问。通常每轮 1–3 个关键问题，记住已经回答的场景、功能、风格、平台与验收条件。已有项目沿用原架构和内核，小修复按比例简化。

规划与决策保存在当前项目的需求、选型、架构、任务、工具和验收 Markdown 中，可合并成适合项目大小的文档。只读 `github_research` 和 `skill_read` 是真实内置工具；写文件与安装开发工具复用原批准流程。工具优先项目目录/虚拟环境和固定版本，安装后检查实际版本与最小运行结果。上游 README 不授予执行权，未知许可证不会被自动当成可二次发行；来源和第三方要求随复用内容保留。用户禁止联网或指定基础项目时遵从其选择。检索限流或离线时会报告缺口。

For development tasks, the bundled workflow researches public GitHub candidates, inspects fixed-commit licenses and source, clarifies the decisions that affect the result, and records requirements, architecture, tasks, tools and verification in project Markdown. Existing projects retain their architecture. Read-only research tools are built in; file changes and tool installation use existing approvals and project-local environments. Prior answers and authorization remain applicable. Unknown licenses require review; upstream instructions grant no execution rights.

```text
koder run "开发一个团队任务管理应用，先比较可复用的开源项目，再问我关键需求"
koder run "帮我更新 Koder CLI"
koder update --check
```

在本机对话中直接说“更新”“帮我更新 Koder CLI”，或输入 `/update`，会先比较官方 GitHub 通道和本机版本，有新版才下载、校验并安装；安装结束再运行新版入口核验版本。无需先配置模型。同版或本机版本较新时报告已是最新，不覆盖。Ask/计划模式下的自然语言请求只检查。更新项目依赖、引用文本、管道输入不会触发 CLI 自我更新。配置、记忆和微信／飞书等渠道绑定保留。以 preview.6 或更新版本启动的会话会自动重启到已核验新版，接回原工作区、会话、模式和待处理输入；已完成的请求不重放。正在运行的渠道任务、确认和回复先完成，再释放原宿主并重连，禁用的渠道不会自动开启。更改过的许可仍需明确接受。

Say “update Koder CLI” or “更新” in a local chat, or use `/update`. The updater compares versions, verifies downloads, installs a newer release and runs the installed entry to verify its version, without requiring a model. Ask/plan mode only checks. Project edits, quoted text and piped input do not trigger self-update. Sessions launched with preview.6 or later automatically restart into the verified update with their workspace, session, mode and buffered input restored. Completed requests are not replayed. Running gateways finish admitted work, approval waits and replies before releasing ownership and reconnecting; disabled channels stay disabled. Configuration, memory and bindings are retained, and changed terms require acceptance.

渠道连接会在限定时间内重试临时网络故障，保留正在确认的二维码；握手卡住会重新连接。无效凭据、拒绝和登录过期会明确失败。重复 `connect` 复用健康连接，避免企业微信多次订阅挤掉原连接。发送消息或文件不因这项连接修复自动重放。真实账号与目标网络环境仍需验收。

Connection startup retries transient failures within a deadline, retains pending QR authorization, recovers stalled handshakes and reuses healthy connections. Invalid credentials, denied and expired login remain explicit failures. This connection recovery does not replay message or file sends. Live accounts and target networks still require acceptance.

## 模型、API与上下文 / Models, API and context

在 `koder setup` 选真实可用的服务商、型号、地址和协议。推荐使用 `--key-env` 保存环境变量名；直接粘贴的密钥在本机配置中明文存储，屏幕遮盖不等于加密。设置环境变量的命令也可能留在 shell 历史里。选择本地预设之前，需实际安装并启动本地模型。

Choose a working provider, model, endpoint and protocol in setup. Prefer `--key-env` so configuration stores only the variable name. A pasted key is stored in plaintext; masking the screen is not encryption. Shell commands setting environment variables can enter history too. A local model must be installed and running.

```text
koder model presets
koder model show
koder doctor
koder model test
```

`model test` / `doctor --api` 会真实请求配置的模型，可能计费。API错误先核对地址/协议/凭据/网络，并保留错误码：401/403核对授权，429核对额度与限流，5xx/超时查看服务状态。分享日志前隐藏密钥与敏感内容。

`model test` / `doctor --api` make real requests and may incur cost. Check endpoint, protocol, credentials and network. Keep error codes: 401/403 suggest access issues, 429 quota/rate limits, 5xx/timeouts service problems. Redact secrets before sharing logs.

上下文在「设置 → 上下文与输出」调整，必须符合当前型号与接口真实窗口，输出也占用窗口。压缩历史与检索记忆可延续任务；修改客户端数字不会突破服务端上限。超大文件分段读取或检索相关部分。

Set actual supported limits under Context and output; output shares the window. Compaction and memory retrieval help retain continuity, but a larger client number cannot enlarge provider limits. Read oversized files in chunks or retrieve relevant parts.

## 记忆、学习和主动服务 / Memory, learning and proactive service

```text
koder memory status
koder memory personalization status
koder memory learning status
koder memory daily-state status
koder memory evolution status
koder memory proactive status
koder memory profile show
koder memory soul show
koder account status
```

新Windows记忆优先可写D盘，否则可写C盘用户专属位置；已有位置或手动配置保留。以实际状态输出为准。跨设备需兼容Core服务、账号和授权渠道，查看 `koder help account`。登录共享空间后默认跨关联终端、渠道、设备、群与私聊互通；群全员可用关联私聊记忆。API密钥与电脑权限不会作为记忆同步。

New Windows memory prefers writable D, falling back to a writable per-user C location. Existing/explicit locations are retained; inspect actual status. Cross-device memory needs a compatible Core service, an account and authorized channels. See `koder help account`. The account default space shares linked terminals, channels, devices, groups and private chats. Model keys and computer grants are not memory-sync data.

习惯学习、当天状态、自我进化、主动服务分别通过 `on/off/status` 管理，先显示用途、存储、共享范围和费用，再要求 `ENABLE` 或 `DISABLE`。手动灵魂风格保存用 `SAVE`，可回退。每日反思需要兼容Core宿主与授权来源，默认每日最多4次模型调用；`waiting-account-host` 表示尚不具备条件。主动服务依赖运行中的宿主，默认22:00–08:00安静时段。关闭功能保留旧记录；删除记录、删除共享空间与账号退出是不同操作。

Learning, daily state, evolution and proactive service each use `on/off/status`, with scope/cost explanations and explicit ENABLE/DISABLE. Manual soul edits use SAVE and support rollback. Daily reflection needs an authorized source and compatible Core host, with a default four-call daily budget; waiting-account-host is not completion. Proactive service needs a running host and has default quiet hours 22:00–08:00. Disabling retains records; deleting records, forgetting shared space and signing out are separate actions.

## 电脑、文件与应用 / Computer, files and applications

```text
koder permissions status
koder help permissions
koder apps
koder help apps
koder mcp list
koder help mcp
```

主目录授权、指定目录和完整工作模式都需核对能力后输入 `GRANT`；操作系统权限仍由系统控制。`koder permissions revoke` 撤销本机Koder后续电脑工具调用，不能追回已发送文件或恢复已覆盖文件，也不撤销系统设置中的权限。

Home, custom-root and full work modes require reviewing scope and typing GRANT. The OS still controls its own permissions. `koder permissions revoke` withdraws future Koder computer-tool grants; it does not unsend files, restore overwritten files or change OS settings.

Gamma可选API Key或服务支持的浏览器授权；MCP支持本地程序与远端服务。导入MCP默认关闭，启用或 `test` 会启动真实连接/本地程序。连接由同一配置内的对话和Agent复用，第三方能收到经连接提交的数据并可能收费。关闭用 `apps disconnect <id>` 或 `mcp disable <id>`；服务端令牌在服务方撤销。真实业务效果需查看结果，连接在线不等于任务完成。

Gamma supports API-key or service-supported browser authorization; MCP supports local programs and remote services. Imports default disabled. Enable or test starts real connections/programs. Chats and agents in the same profile reuse connections. Providers receive submitted data and may charge. Disconnect/disable locally and revoke provider tokens separately. Inspect actual results; a connection is not a completed task.

## 从GitHub更新与卸载 / GitHub updates and uninstall

从preview.3起：

```text
koder update --check
koder update
koder version
```

`--check`只检查。更新时校验安装器和程序包，保留配置/记忆，同版不重复安装、旧版不自动回退；许可文本变化时需重新阅读并明确接受。下载更新只在运行更新命令时发生；同一安装中已经运行的新版会话和网关会自动发现核验完成的安装，并在安全节点重启。独立 shell 中的 `koder update` 启动新版核验后返回 shell；已有对话自行恢复，不强制另开聊天。

Since preview.3, the updater discovers GitHub releases. Check is read-only; update verifies the installer and package, retains config/memory, avoids equal-version reinstalls and downgrades, and requires explicit acceptance if the license changes. Updates run only when invoked.

0.3.0、0.3.1、preview.1/2 用户先执行本页安装命令一次，获得新的更新器，无需卸载或清空配置。preview.6 升到 preview.7 时，许可头部校验已经变化：已安装的更新器会在下载安装器之前停止，设置 KODER_EULA_ACCEPT 也不能跳过这道检查。请运行上面的普通安装命令，阅读后输入 accept。配置、记忆和绑定保留。preview.5 及更早已经运行的进程没有重启协议：首次升级后仍需正常退出旧会话并启动一次新版；从 preview.6 启动后，许可校验一致的后续升级会自动接续。跨版本迁移不要求重新配置 API、记忆或渠道。第三方自行撤销或过期的登录凭据仍需按平台重新授权。

`--no-memory` 会话只通过本机进程间通信接续，不因升级写入聊天历史文件。未响应的渠道批准会继续等待，更新不代替用户批准，也不强制终止正在执行的工具。新版在接收会话前启动失败时恢复原进程一次；已经开始接管后不会自动重放工作。电脑重启或系统崩溃后的任务恢复不属于本次软件升级接续。普通 `koder uninstall` 保留配置；`--purge` 是删除配置的独立选择，先备份。外置记忆目录与服务器副本另行管理。

Users on 0.3.0, 0.3.1 or preview.1/2 should run the installer above once to obtain the new updater, without uninstalling or clearing config. Moving from preview.6 to preview.7 changes the license checksum: the installed updater stops before downloading the installer, and KODER_EULA_ACCEPT does not bypass that check. Run the normal install command above and type accept after reading. Configuration, memory and bindings are kept. Later updates whose license checksum matches can continue through koder update. Normal uninstall keeps config; --purge deletes it separately. Back up first and manage external memory/server copies separately.

## 来源与许可 / Provenance and license

KARMEN LOOP自有代码、旧CLI的GPL权利、私有内核与第三方许可分别保留。可选Hermes引擎来自Nous Research，需明确选择另行安装并适用其原许可；未安装时不会自动使用。具体依赖与来源以 [OPEN_SOURCE_CREDITS.md](OPEN_SOURCE_CREDITS.md)、[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)、[LICENSE](LICENSE) 和 [LICENSE-EXCEPTION.txt](LICENSE-EXCEPTION.txt) 为准。

KARMEN LOOP-owned code, legacy GPL CLI rights, the private kernel and third-party licenses keep their stated scopes. The optional Hermes engine is from Nous Research, requires explicit separate installation and retains its own license. See the credits, notices, license scope and kernel linking permission above.

[karmenloop.com](https://karmenloop.com) · [info@karmenloop.com](mailto:info@karmenloop.com)

外部 ACP 引擎会收到升级前的对话与工具结果作为历史参考，Koder 不重放旧请求或批准；引擎内部隐藏状态是否可加载由该引擎决定。


## Preview.10 validation

Full local regression: 409 tests, 406 pass, 0 fail, 3 existing Core skips, exit 0. Ten MiMo protocol/ACP checks and the Token Plan/Flash terminal setup interaction passed. The installed pinned Hermes 517b5e10 runtime completed a real local-file read and a second model turn against a local HTTP/SSE fixture, retaining reasoning history. Its upstream asynchronous title callback emitted a shutdown RuntimeWarning; the actual tool result and completed response were verified. Authenticated Xiaomi service and the reported user device remain unverified.

[Native Windows candidate acceptance](https://github.com/KarmenLoop/koder-cli/actions/runs/39395431998): nine installer checks plus ten checks against the actual installed MiMo package passed. Public-command validation is recorded separately after publication.

Package SHA-256: `0c9054de7fb1815385bccb0425b10e955854ccb5f1f69b97fa53a3d72a4632a8`.
