# Ubuntu 24.04：从安装到完成第一个任务

当前下载命令使用官网已发布的 0.5.21 安装器；本文保留 0.5.20 的操作示例及验收证据。查看新版本说明请进入 [官网教程](https://kodermodule.com/cli-tutorials.html)，旧记录不代表 0.5.21 真机验收已完成。

使用新系统？[Ubuntu 26.04.1 Desktop amd64 独立教程](UBUNTU-26.04.zh.md)。本页继续保留 24.04 说明。

[返回 GitHub 首页](../README.zh-CN.md) · [English](UBUNTU.md) · [下载 Koder CLI](https://kodermodule.com/cli-download.html)

本教程对应 **Koder CLI 0.5.20**，适用于 Ubuntu **24.04 LTS / 24.04.x** 的 x64 和 ARM64。Linux 包保留当前平台支持的运行功能、Skills、自主学习及现行课堂。Windows-MCP、macOS 锁屏组件只用于各自系统；Ubuntu 使用 Linux AT-SPI 图形驱动。Ubuntu 24.10 不在当前适配范围。

## 先解决“安装好了，但进不去”

如果屏幕已经显示“安装完成”，不用重新下载。在 **Ubuntu 系统终端**（提示符类似 `karmen@电脑名:~$`）逐条执行：

```bash
"$HOME/.local/bin/koder" --version
"$HOME/.local/bin/koder"
```

第二条直接启动对话，不依赖 PATH。如果尚未配置模型，先运行下面的向导，保存退出后再运行上一条启动命令：

```bash
"$HOME/.local/bin/koder" setup
```

默认路径如上；自定义安装时使用安装器末尾打印的实际完整路径。看到 **`koder >`** 才是在 Koder 对话里；看到 `用户名@电脑名:~$` 仍是系统终端。

| 你看到的界面 | 含义 | 下一步 |
| --- | --- | --- |
| `accept / decline:` | 软件许可确认 | 阅读后同意才输入 `accept`；这不是任务输入框。 |
| 模型服务商、Key、模型等菜单 | 首次配置 | 按第 4 节填写并保存。不要在这里输入任务。 |
| `输入 activate…` | 可选后台常驻 | 只想先聊天，直接回车跳过；需要后台常驻才输入 `activate`。 |
| 一大段 `taskDone` / `service` JSON | 旧版激活或状态命令的输出 | 不是聊天，也不能单凭这些字段判断激活成功；看 `running`，然后单独启动 `koder`。 |
| `karmen@电脑名:~$` | 系统等待下一条命令 | 输入完整路径启动，或修复 PATH 后输入 `koder`。 |
| `koder >` | Koder 已准备接收任务 | 输入自然语言任务并回车。 |

**“安装完成”“模型已配置”“后台常驻”“进入对话”是四个独立步骤。** 常驻成功不会替你打开前台聊天；跳过常驻也能正常聊天。

第一次使用按 1–5 节操作；已有安装看第 9 节。下载或任务卡住看第 10 节，不必先卸载或清空历史。

## 目录

1. [打开终端，确认系统](#prepare)
2. [下载并安装：wget / curl / 两者都没有](#install)
3. [看懂进度，确认安装成功](#progress)
4. [配置模型，完成首次连接](#model)
5. [第一个文件任务与网站预览](#first-task)
6. [文件、网络与完整工作范围](#permissions)
7. [图形桌面配置与实操](#desktop)
8. [邮箱、通知、后台与 GitHub](#services)
9. [升级、Skills 与日常使用](#update)
10. [故障排查](#troubleshooting)
11. [服务器 / SSH 与开发者验证](#server)
12. [验证范围与进一步学习](#evidence)

<a id="prepare"></a>
## 1. 打开终端，确认系统

在 Ubuntu 桌面按 **Ctrl+Alt+T**。复制命令，用 **Ctrl+Shift+V** 粘贴，按 Enter 执行；不要输入代码框边框或额外的 `$`。

```bash
cat /etc/os-release
uname -m
```

第一条应显示 Ubuntu、`VERSION_ID="24.04"`；第二条通常是 `x86_64` 或 `aarch64`。其他环境先看[通用安装指南](INSTALLATION.md)。

用当前登录的普通用户安装和运行 Koder。下面的 `sudo apt` 仅用于 Ubuntu 系统依赖；输入本机账户密码时终端不显示字符属于正常现象。不要把密码发到聊天中。

<a id="install"></a>
## 2. 下载并安装

先检查已有下载工具：

```bash
command -v wget
command -v curl
```

有一个返回 `/usr/bin/...` 即可。**A、B、C 选一条路线，不用全部执行。** `&&` 表示只有下载成功后才运行安装器。

### A. 已有 wget（Ubuntu 推荐入口）

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-ubuntu-install.sh https://kodermodule.com/install/cli-0.5.21/koder-cli.sh && bash /tmp/koder-ubuntu-install.sh
```

### B. 已有 curl

```bash
curl -fL --retry 3 --connect-timeout 20 https://kodermodule.com/install/cli-0.5.21/koder-cli.sh -o /tmp/koder-ubuntu-install.sh && bash /tmp/koder-ubuntu-install.sh
```

### C. 两个工具都找不到

逐条执行，确认没有 apt 错误后，再使用上面的 B 命令：

```bash
sudo apt update
sudo apt install curl ca-certificates
```

apt 正被系统更新占用时等它完成，不要删除锁文件。也可用浏览器下载[Ubuntu 安装脚本](https://kodermodule.com/install/cli-0.5.21/koder-cli.sh)，但运行脚本时仍需要 curl 或 wget。

### 安装器询问时怎么选

1. 阅读 [EULA](../EULA.md) 和[数据与同意说明](../ACCEPTANCE.md)。同意后输入小写 `accept` 并回车；不同意输入 `decline` 或按 Ctrl+C。
2. 安装器自动选择 Linux 包，复用兼容 Node，或下载并校验托管 Node。**不要求先安装 npm 或自行选 Node 架构。**
3. 等待下载、SHA-256 校验和解压。下载到 100% 后仍要等安装完成；不要在解压过程中再运行一次安装。
4. 出现配置向导时，按第 4 节选择模型并保存。想稍后配置，可按向导返回/跳过，再运行完整路径加 `setup`。
5. 出现“输入 activate…”时，**直接回车是跳过后台常驻，不是取消安装**。输入 `activate` 是安装用户级后台服务，不是进入聊天。
6. 等安装器退出，回到 `用户名@电脑名:~$`。按第 3 节的完整路径命令启动。不要使用 `sudo bash /tmp/koder-ubuntu-install.sh` 或 `sudo koder`。

接受软件许可不自动授予电脑、邮箱、GitHub 或常驻权限。个人非商业本地使用免费；模型请求由服务商计费，商业/组织使用按许可另行授权。

<a id="progress"></a>
## 3. 看懂进度，确认安装成功

下载开始时和下载期间约每 5 秒显示：已下载 **MB**、已知总量和百分比、已用秒数、平均速度及尝试次数。以下只是格式示例，不是速度承诺：

```text
下载进度：45.0 MB / 150.2 MB (29%)；已用 30 秒；平均 1.5 MB/s；尝试 1/6。
正在校验下载内容（SHA-256）……
```

未知总量会显示“总大小未知”。本版 Linux 运行包的准确大小见发行清单，首次安装还可能下载 Node；总下载量和解压后的磁盘占用会更大。下载完成不等于全部安装完成，后面还有校验、解压和激活。

断网或 Ctrl+C 后，重新运行第 2 节同一条命令即可恢复。可恢复下载保存在 `~/.koder-cli/cache/downloads`，校验通过才启用，不必手动拼包或删除缓存。

### 3.1 立刻启动，不必重装

在安装所在的同一个终端逐条执行：

```bash
"$HOME/.local/bin/koder" --version
"$HOME/.local/bin/koder" --help
"$HOME/.local/bin/koder"
```

前两条分别显示版本和帮助；第三条进入对话。应显示 `koder 0.5.20`。旧版 0.5.12 已装好时完整路径也适用，先进入或升级即可，不必删除历史。

### 3.2 让当前终端识别简短的 koder 命令

安装脚本作为子进程运行，不能改变已打开的父终端 PATH。安装器写入启动文件后，新终端可读取；当前终端先执行：

```bash
export PATH="$HOME/.local/bin:$PATH"
hash -r
command -v koder
koder
```

`command -v` 应输出 `/home/你的用户名/.local/bin/koder`。`export` 这一行只在当前终端生效；0.5.20 安装器还会更新 Bash 的 `.profile`、`.bashrc` 和已有登录配置，并按需处理 zsh。使用 `--no-modify-path` 的高级用户需自行配置。自定义 bin 路径请使用安装器打印的实际命令。

### 3.3 后台状态 JSON 怎么看

0.5.12 在输入 `activate` 后可能打印完整 JSON；0.5.20 交互激活改为简短说明，`--json` 仍供脚本使用。系统终端中检查：

```bash
"$HOME/.local/bin/koder" status
```

- `activated` 是保存的常驻意图，`running` 才表示这次检查能否连接后台进程。两者不要混淆。
- `service: "systemd-user"` 表示使用当前用户服务。
- `taskDone.policy.enabled: true` 是完成提醒开关；`dailyCount: 0` 是今天还没有该类推送，不是任务失败。
- `unavailableSources` 包含 calendar/browserHistory 等时，表示这些来源没有接入；不影响基本聊天。
- `TASK_PROTOCOL_PLATFORM_UNSUPPORTED` 或 `notificationClickSupported: false` 表示通知点击续聊不可用，不代表 Koder 命令不可用。手动进入终端继续即可。
- `displayVerified: false` 表示没有验证用户真的看见通知，不能改写成“提醒已读”。

后台没运行也可以先用前台 `koder`。若确实需要常驻，按第 8 节排查，不要反复安装覆盖。

<a id="model"></a>
## 4. 配置模型，完成首次连接

```bash
koder setup
```

在模型配置中按顺序操作：

1. 选择实际购买的服务商、地区和 API 产品。网页聊天会员不等于 API 额度。
2. 在密钥输入处填写 Key，不贴进任务、截图或示例文件。
3. 选择该接口可用的模型和思考档位。置灰项不能强行选用，参见[服务商说明](PROVIDERS.md)。
4. 保存并退出向导。回到系统终端提示符时，配置已结束，但聊天还没有打开。
5. 先测试连接，再按需测试工具调用：

```bash
koder model test
koder model test --tools
```

测试会真实请求所选模型，可能产生少量费用。连接通过不等于所有工具已授权；工具测试用于确认模型接口能够表达工具调用。

测试通过后，运行 `koder`；若命令还未被 PATH 识别，运行 `"$HOME/.local/bin/koder"`。先输入“只回复连接成功，不做其他操作”，确认实际回复，再做文件任务。未配置、密钥错误、服务商拒绝和没有电脑权限属于不同问题，分别按提示修复。

Linux 保存受保护凭据需要当前用户的 Secret Service（密钥环）。若提示存储不可用，看第 8、10 节；不要改用 root 或把密钥明文写入项目。

<a id="first-task"></a>
## 5. 第一个文件任务与网站预览

### 先完成一个容易核对的小任务

新建独立练习目录，不把生成文件放进 Koder 安装目录：

```bash
mkdir -p "$HOME/Koder Projects/ubuntu-first-task"
cd "$HOME/Koder Projects/ubuntu-first-task"
koder
```

在 `koder >` 内输入自然语言：

```text
在当前项目新建 HELLO.md，写明这个项目的用途和三条下一步计划。请实际保存文件，完成后告诉我文件路径并读取核对。
```

如出现文件或命令审批，核对路径和内容后再选择。完成后在**另一个终端**检查文件：

```bash
cat "$HOME/Koder Projects/ubuntu-first-task/HELLO.md"
```

验收是文件实际存在、内容符合要求；只有“我可以帮你”或计划文本不算完成。若未完成，记录最后原因码和项目路径，不把同一命令连续提交多次。

### 5.1 认识任务执行和交付

| 阶段 | 你要看什么 | 不符合时怎么做 |
| --- | --- | --- |
| 已提交 | 输入框出现工作中/等待模型提示 | 不重复提交；超过期限保留原因码。 |
| 请求补充 | Koder 问用途、内容或目标 | 回答缺失信息；忙时补充默认进入当前任务。 |
| 请求审批 | 明确文件、命令或外部目标 | 同意才允许；排队文字不能代替审批。 |
| 工具执行 | 有具体工具结果或保存路径 | 只有计划没有工具结果，不能算交付。 |
| 结束 | 有成果位置、核对结果和未完成事项 | 让它基于已有结果继续，避免重复外部动作。 |

需要暂停时按 Esc；Ctrl+C 也用于取消。取消不能撤回已经发生的发信或文件改动，先读回结果。想退出聊天，在空闲输入框输入 `/exit`；回到系统提示符后再运行系统命令。

### 5.2 再做网站

在这个练习项目的 Koder 对话中输入：

```text
制作一个咖啡店单页网站，适配手机和电脑。先问我缺少的品牌、受众、页面内容和风格信息，确认后保存项目方向，再实际完成页面。最后检查页面并启动可用预览，给我预览 URL 和文件路径。
```

先回答需求问题，再继续实现。适用的网站任务沿用内置设计/交付流程；旧网站应沿用项目方向，不无理由重做。打开交付的 URL，检查标题、按钮、手机宽度和加载错误。`127.0.0.1` 只对运行预览的机器可达，不是公开上线地址；远程服务器见第 11 节。

完整步骤：[网站项目与标准锚点](WEBSITE-PROJECTS.zh.md) · [网站交付](website-delivery.md)。

<a id="permissions"></a>
## 6. 文件、网络与完整工作范围

**Koder 授权、工具是否可用、Ubuntu 系统权限是三件事。** 配好模型不会自动得到整台电脑的访问权。

```bash
koder permissions status
koder doctor --computer
```

只需要用户目录内的文件与网络能力时：

```bash
koder permissions request --home
```

需要完整工作范围时，改用下面这一条。阅读列出的范围，再按提示输入 `GRANT`：

```bash
koder permissions request --mode full
```

完整范围请求文件读写/搜索、网络、浏览器、桌面、渠道文件和技能更新等类别。文件范围可包含 `/`，但**不会得到 root**；实际文件仍受 Ubuntu 当前用户权限限制。缺少浏览器宿主、桌面驱动、密钥环或渠道连接时，状态仍可能是 `missing` / `unknown`，须补齐对应组件。`--yes` 不代替此授权。

执行审批独立于能力授权：安装软件、命令或外部动作仍可能询问。需要 sudo 的操作由你在本地终端确认。撤销 Koder 电脑范围使用：

```bash
koder permissions revoke
```

撤销阻止后续访问，不追回已完成的文件改动。不要为了一个项目故障关闭全部系统保护。

<a id="desktop"></a>
## 7. 图形桌面配置与实操

### 7.1 确认正在使用桌面会话

在已登录 Ubuntu 桌面的终端执行：

```bash
printf 'session=%s\nDISPLAY=%s\nWAYLAND_DISPLAY=%s\n' "$XDG_SESSION_TYPE" "$DISPLAY" "$WAYLAND_DISPLAY"
test -n "$DBUS_SESSION_BUS_ADDRESS" && echo "用户会话 D-Bus 已设置"
```

X11、Wayland 均可，不要求两个 DISPLAY 变量同时有值。手动填写一个环境变量不会创建桌面；SSH/容器内不要照抄别人的显示号。

### 7.2 安装缺少的系统依赖

```bash
sudo apt update
sudo apt install python3-gi gir1.2-atspi-2.0 at-spi2-core libsecret-tools gnome-keyring libnotify-bin
```

前三项供 Python/AT-SPI 控件访问，`libsecret-tools` 和 `gnome-keyring` 供受保护凭据存储，`libnotify-bin` 供通知。这里是你主动执行系统安装；Koder 不会因为模型读到教程就自动安装。安装后服务仍未就绪时，保存工作、注销并重新登录，再打开新终端。

### 7.3 检查驱动，单独授权

```bash
koder doctor --computer
koder permissions request --capability desktop
koder permissions status
```

在授权提示输入 `GRANT`。doctor 的 `Ubuntu desktop` 项应显示 `backend: "at-spi"`、`available: true`，或明确原因码。驱动就绪和 desktop 获准需要分别核对。

### 7.4 实际操作一个空白文档

1. 在 Ubuntu 应用列表打开“文本编辑器”，新建空白文档，暂不打开私人文件。
2. 回到 Koder 练习项目，输入：

   ```text
   检查这台 Ubuntu 的桌面驱动，找到我刚打开的空白文本编辑器。先读取控件，向空白正文输入“Koder Ubuntu 桌面测试”，再重新读取确认。不要关闭其他窗口，不要读取其他文档。
   ```

3. 核对日志里有电脑检查、控件读取、操作和重新观察，编辑器中确实出现文字。不能只看模型说“完成”。
4. 没暴露可访问输入控件时，记录应用名称与错误码；改用已支持的连接器或文件任务，不冒充已操作成功。

当前驱动支持对应用暴露的控件点击、输入、聚焦、选择和滚动；读取的是**无障碍控件树，不是像素截图**。密码内容不返回模型；旧快照拒绝重放。动作结果不确定时保留 `UNKNOWN`，先核对当前 UI。

纯画布、游戏、远程桌面图像、自绘且不支持无障碍的控件、登录屏幕和锁屏不在此 AT-SPI 驱动范围。装有 Firefox/Chrome 不等于已经接通浏览器自动化。已有 Apps/MCP 覆盖任务时优先使用，否则按[应用调用与学习](APP-USE-AND-LEARN.zh.md)配置；扩大权限不能补出缺失驱动。

<a id="services"></a>
## 8. 邮箱、通知、后台与 GitHub

### 先让密钥环就绪

```bash
command -v secret-tool
```

返回路径只证明工具存在，还需要用户 D-Bus 和已解锁密钥环。自动登录后密钥环可能仍锁定，用系统“密码和密钥”界面解锁；密码不写入命令，也不交给模型。

### 绑定邮箱、查信、收信提醒

以 163 为例：

```bash
koder mail setup 163
koder mail status
koder mail check
```

按向导核对 IMAP/SMTP、范围并输入客户端授权码。先确认 check 实际成功，再使用 `koder mail send` 输入收件人、主题和正文，并核对发送确认；只向自己控制或已同意的测试地址发送。SMTP 接受不保证对方收件箱已投递。

关终端后继续检查：

```bash
koder mail monitor on
koder mail monitor status
```

审阅范围后输入 `watch-mail`，核对 `running`、`lastMailSuccess`。默认约每 30 秒轮询，受网络、休眠、安静时段和预算影响，不保证瞬时推送。关闭用 `koder mail monitor off`。模型读信、主动问询和发送各自授权，详见[邮箱收发与排查](MAIL-RECOVERY.zh.md)。

### 测通知，再考虑常驻

```bash
koder notifications status
koder notifications test task-done
```

查看 Ubuntu 通知中心。`submitted` 表示系统接收提交，不证明用户看到；没有桌面时 `NO_NOTIFICATION_SESSION` 是明确降级。

一般后台任务可单独运行 `koder activate`，用 `koder status` 核对，`koder deactivate` 关闭。Ubuntu 使用**用户级 systemd**，不创建 root 服务、不自动启用 lingering；退出登录后的持续运行不能当成已经保证。邮箱 monitor 已托管时不必再开多个 watcher。见[常驻教程](ALWAYS-ON.zh.md)。

### GitHub、MCP 与应用

```bash
koder github connect
koder github status
koder mcp list
koder apps list
```

在 GitHub 绑定向导输入令牌，仅给需要的仓库和操作范围。connect 不自动上传项目；后续上传/编辑核对仓库、分支、文件并确认。令牌不写入聊天、项目或日志。详见[GitHub 项目教程](GITHUB-PROJECTS.zh.md)、[MCP 兼容清单](MCP-SKILL-COMPATIBILITY.zh.md)。列表可见不等于实际调用成功。

<a id="update"></a>
## 9. 升级、Skills 与日常使用

保存当前工作后执行：

```bash
koder update
koder --version
```

旧进程须退出后重新启动。升级失败可重跑第 2 节安装器原位更新，保留配置与工作区；不要先删除 `~/.koder-cli`。很旧的更新器若报包体积/清单错误，也使用当前安装器。

| 目的 | 操作 |
| --- | --- |
| 模型、思考档位、上下文和自动压缩 | `koder setup`，选择对应设置 |
| 本地任务记忆状态 / 暂停 | `koder learning status` / `koder learning off` |
| 可移植 Skills / 按需技能目录 | `koder skills list` / `koder skills catalog` |
| 教程 | `koder learn` |
| 运行中补充 | 输入后回车，默认引导；Setup 可选 FIFO 排队 |
| 取消任务 | Esc 或 Ctrl+C；外部动作可能已执行，须核对结果 |
| 模板与命令菜单 | 空输入按 `/`，Tab 填草稿，编辑后再发送 |
| 多项目并行 | 各开终端，进入不同项目目录 |

工具轮次默认不限，取消、费用预算、权限和恢复边界继续有效。Skill 文件不是每份各启动一个常驻进程，具体调用仍取决于依赖、连接与任务选择。[Skills 使用](PORTABLE-SKILLS.zh.md) · [任务编排](TASK-ORCHESTRATION.zh.md) · [上下文控制](CONTEXT-CONTROLS.zh.md)。

<a id="troubleshooting"></a>
## 10. 故障排查

| 现象 | 下一步 |
| --- | --- |
| `curl: command not found` | 下载尚未开始，用 wget 或先安装 curl、ca-certificates。 |
| 小脚本下载失败 | 不单独执行残留文件，重跑带 `&&` 的完整命令。 |
| 下载中断 / 长时间 0 MB/s | 检查网络，重跑安装器续传；不关闭 TLS 校验、不用 `curl -k`。 |
| SHA-256 校验失败 | 坏包不会启用，重试官方源并保留原因码；不跳过校验。 |
| 找不到 koder / 版本旧 | 新开终端，检查 `$HOME/.local/bin` 和 `type -a koder`。 |
| 提交后一直等 | 核对 0.5.20 和每 10 秒等待提示；单独检测模型连接，见下方时限说明。 |
| `API_HEADERS_TIMEOUT` | 服务商可能仍在生成，不连发同一任务；确认模型/网络后决定是否调长等待。 |
| 密钥环 / 凭据存储失败 | 检查 secret-tool、用户 D-Bus、密钥环解锁；不用 sudo 绕过。 |
| `COMPUTER_NO_DESKTOP_SESSION` | 从已登录桌面终端运行；无桌面服务器使用 CLI 文件任务。 |
| desktop missing / AT-SPI 不可用 | 补第 7 节依赖、重新登录、运行 doctor，检查应用无障碍支持。 |
| `EACCES` / `EPERM` | 核对路径、所有者和授权；完整范围不改变系统文件权限。 |
| `SHELL_RECONCILIATION_REQUIRED` / `UNKNOWN` | 先看前次操作和回执，不把未核实当未执行而重复重放。 |
| `STORAGE_BUSY` / 邮箱后台失败 | 看 mail status、mail monitor status，不删除凭据或锁。 |
| 通知 submitted 但没看到 | 查通知中心、勿扰和应用设置；submitted 不是已读。 |
| 别的设备打不开预览 | 127.0.0.1 指向运行预览的机器，使用 SSH 转发或另行批准部署。 |

### 10.1 command not found：逐层定位

先在系统终端运行：

```bash
ls -l "$HOME/.local/bin/koder"
"$HOME/.local/bin/koder" --version
type -a koder
```

- 完整路径能显示版本，但 `koder` 找不到：安装文件在，按第 3.2 节修复当前 PATH。不要重新下载整包。
- `ls` 也说文件不存在：核对安装器末尾的实际路径、当前用户名及是否用了自定义目录。只下载 `.tgz` 没有运行安装器，不算安装完成。
- 完整路径存在但启动报 Node/文件错误：保留原文，运行官方安装器修复同一用户安装。不要手工把目录拷到 `/usr/bin`。
- `type -a` 列出多个版本：完整路径先确认目标版本，检查旧 alias/启动文件；不要删除整个用户配置。
- 新终端仍找不到：确认使用 Bash 还是 zsh（`printf '%s\n' "$SHELL"`），有自定义启动文件时查它是否重置 PATH。0.5.20 会保留旧内容并补准确路径。

### 10.2 解压出现 LIBARCHIVE.xattr.com.apple.provenance

旧包在 macOS 制作时带了 Apple 扩展属性，Ubuntu 的 GNU tar 不认识这些元数据，会反复打印“忽略未知的扩展头关键字”。若后面明确出现安装完成且完整路径能显示版本，这些行本身不是安装失败。

0.5.20 的打包步骤排除 Apple 扩展属性、ACL 和文件标志；程序、Skills 和教程文件保留。若看到 `Unexpected EOF`、`No space left on device`、校验失败或安装中止，那是另一类实际错误，不能当成上述提示忽略。

### 10.3 activate 后没有进入聊天

`activate` 只开启后台常驻。输出状态后回到系统终端是该命令结束，不是闪退。随后运行 `koder` 或完整路径；只有出现 `koder >` 才开始输入任务。想关闭后台用 `koder deactivate`，不需要卸载 CLI。

### 10.4 区分模型等待、命令等待和下载等待

0.5.20 任务模型的响应头默认等 **180 秒**，正文还有独立空闲/总请求期限。Shell、curl 下载、model test 快速诊断各有时限，一个参数不能调整全部。

确认模型确实需要更久时，在**启动 Koder 前**设置（毫秒，最大 600000）：

```bash
export KODER_API_HEADERS_TIMEOUT_MS=600000
koder
```

恢复默认：

```bash
unset KODER_API_HEADERS_TIMEOUT_MS
```

这不是无限等待或成功保证。超时不自动重复推理，任务与已有结果仍保留。快速 model test 可能有较短诊断期限，不能据此断言任务的等待设置未生效。

反馈请提供版本、系统/架构、问题步骤、最后原因码和去除隐私的 `koder logs --tail 100` 片段。不要附 API Key、授权码、完整邮件或令牌。

<a id="server"></a>
## 11. 服务器 / SSH 与开发者验证

服务器保留文件、模型、编程、撰写和任务编排；GUI、通知需要对应用户图形会话，受保护账号绑定需要可用密钥环。非交互自动化须配置原有许可、凭据与授权，见[无头 / CI 契约](HEADLESS-0.5.zh.md)，不能依靠流水线弹窗授权。

远程预览可在**本机终端**转发。下面用户名、地址和端口是占位符，替换成实际有权访问的值：

```text
ssh -L 8080:127.0.0.1:实际预览端口 用户名@服务器地址
```

保持 SSH 连接，在本机打开 `http://127.0.0.1:8080`。这不会把网站公开上线。

开发者核对手动下载包：从同一 Release 下载 `SHA256SUMS` 和 `koder-cli-0.5.20-linux.tgz` 至同一目录：

```bash
sha256sum koder-cli-0.5.20-linux.tgz
grep 'koder-cli-0.5.20-linux.tgz' SHA256SUMS
```

两行摘要须完全相同。`.tgz` 是运行归档，不是 `.deb` 或双击安装程序；一般用户仍使用第 2 节安装器。

<a id="evidence"></a>
## 12. 验证范围与进一步学习

本版验收以 [0.5.20 发行附件 ACCEPTANCE-RESULTS.json](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.20/ACCEPTANCE-RESULTS.json) 中的包 SHA-256、任务链接和平台结果为准。安装/重装、PATH、实际归档元数据、PTY 慢响应、AT-SPI 控件操作与通知分别记录，不用旧包测试替代新版验收。

0.5.12 的 [x64/ARM64 任务测试](https://github.com/KarmenLoop/koder-cli/actions/runs/40555216774) 和 [安装/图形矩阵](https://github.com/KarmenLoop/koder-cli/actions/runs/40555225654) 是历史对照；后者首次 x64 Wayland 依赖下载超时，重跑该 job 后四组均通过，原失败保留。它们不是 0.5.20 的结果。

Xvfb/无头 Sway 不等于物理 GNOME、重启自启、全部显卡和每个应用均验收。0.5.8 草稿的 GI 文本接口冲突失败记录保留；修复后使用明确 Text 接口，保留空输入、文字及密码隐藏回归。对照结果须核对包 SHA-256，不能混用不同构建。

进一步学习：[教程总入口](START-HERE.zh.md) · [1800 课课堂说明](courses/README.zh.md) · [用户指南](USER-GUIDE.zh.md) · [命令参考](COMMAND-REFERENCE.zh.md) · [下载恢复与包组成](DOWNLOADS.zh.md)。GitHub 文件页不直接运行 HTML 课堂；本地课堂用 `koder learn` 或按课堂说明打开下载后的文件。

系统资料：[Ubuntu 官方桌面文档](https://documentation.ubuntu.com/desktop/) · [Ubuntu 发行维护周期](https://ubuntu.com/about/release-cycle)。

## 13. 练习路线：每一步都检查实际结果

| 顺序 | 实际练习 | 完成标准 |
| --- | --- | --- |
| 1 | 安装、跳过常驻、用完整路径启动 | 出现 `koder >`，版本正确。 |
| 2 | 配模型，发送一句测试问题 | 有真实模型回复，未暴露密钥。 |
| 3 | 在独立目录保存 HELLO.md | 用另一个终端读取到同一文件。 |
| 4 | 制作网站并回答需求 | 文件存在，给出的预览地址可打开，手机宽度检查通过。 |
| 5 | 执行时补充、排队、取消 | 看见对应状态；不重复已执行动作。 |
| 6 | 授权桌面并操作空白编辑器 | 实际出现文字，重新读取一致。 |
| 7 | 可选邮箱/GitHub | 分别验证只读、写入、提醒；不把绑定当作全部通过。 |
| 8 | 退出、重开同一项目、升级 | 项目文件和已保存设置仍在，版本按预期变化。 |

完成前四项即可日常使用，不必一次开完全部权限。更深入的 1800 课、专业角色、OCR、文档问答和开发者练习按上方教程入口继续；各课对应的外部账号、系统依赖和验收标准仍分别适用。

## 账号密码、令牌和系统授权

0.5.14 起支持对话内隐藏输入与私有使用。邮箱、GitHub、模型密钥、Ubuntu 登录控件与 sudo 分别有实际入口。参见[完整凭据教程](CREDENTIALS.zh.md)，包括输入提示、取消、绑定、填入与登录成功的区别，以及后台/CI 边界。
