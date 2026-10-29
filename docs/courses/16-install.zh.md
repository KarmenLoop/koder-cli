# 16. 安装、更新和换引擎

建议 40 分钟

**目标**：正确安装和更新，确认启动的确是新版，保留用户配置与恢复路径。

**准备**：记录系统、架构、当前版本和命令入口。使用官网或官方GitHub下载；具体安装脚本见INSTALLATION，不照搬别的终端语法。

## 手把手操作

1. 先运行 koder version 和 koder update status，记录安装位置与更新策略。

   **应看到**：分清系统入口、版本目录与数据目录；多份安装可能指向旧版。

2. 阅读许可与安装说明，选择对应系统安装器；更新先运行 koder update --check。

   **应看到**：检查动作不等于已安装；下载失败保留阶段和错误。

3. 确认后运行 koder update；让当前任务按提示保存并切换，不强杀其他任务。

   **应看到**：下载、校验、安装、入口核验分别完成；未明结果不能标成功。

4. 新开终端运行 koder version、koder doctor，再查看原项目与配置。

   **应看到**：新入口确实启动目标版本，项目与凭据仍在；实际问题保留日志后排查。

## 常见问题与恢复

- **自动更新说还需手动**：查看安装所有权、路径与具体错误；必要时使用同一官方安装器覆盖，不手删配置。
- **PowerShell策略拦截**：按安装文档使用对应启动器；不全局设置Unrestricted，不关闭系统保护。

## 作业与自查

写一张升级记录：升级前后版本、入口、配置是否保留、失败时回退方式。没有真实升级就写演练。

**自查标准**：命令输出与实际版本一致；包下载成功不能替代启动成功；Windows/macOS分别记录。

## 开发者教学

1. 验收矩阵分CMD、PowerShell5.1、macOS与目标架构；无Node冷启动要隔离PATH，不卸载用户Node。

2. 校验包SHA、文件清单、旧→新更新和EOF退出；保留原超时与失败。

3. Windows Server runner可提供原生证据，但不能冒充Windows10/11客户端GUI验收。

交件要求：按本课步骤选择自有测试目标，保存前置、实际命令/退出码、产物、正反例、未验和恢复方式。使用 [验收模板](../tutorial-labs/acceptance-template.md)。

## 延伸阅读

- [INSTALLATION.md](../INSTALLATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)
- [AUTO-UPDATE.en.md](../AUTO-UPDATE.en.md)
- [WINDOWS-INSTALL-CHECKS.md](../WINDOWS-INSTALL-CHECKS.md)

<details><summary>powershell · 原教练讲解与命令</summary>

```text
这份文字版按「Windows PowerShell」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 16 课 / 共 30 课 · 安装、更新和换引擎 ━━
教练 › 想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
    先在浏览器阅读：
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        官方团队 KARMENLOOP 官方团队，中国上海。官网 https://karmenloop.com 邮箱 info@karmenloop.com
        普通安装会在真实终端提示输入 accept 并回车；decline 或 Ctrl+C 取消；空回车会重新询问，不会安装。请完整输入 accept 再回车。
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
        已阅读并同意的自动部署（不要替未阅读的人预先填写；KODER_EULA_ACCEPT=1 只接受软件许可）：
    $env:KODER_EULA_ACCEPT = "1"
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
    Remove-Item Env:KODER_EULA_ACCEPT
        Windows 10 / 11：装完重新打开命令提示符或 PowerShell；当前窗口的 PATH 不会自动刷新。
    koder version
    koder setup
    koder learn
    koder update --check
        只检查 GitHub 更新
    koder update
        下载校验并安装新版本；preview.6 起的会话自动重启接续，保留配置、记忆和绑定
        升到 preview.7 请运行上面的普通安装命令，阅读后输入 accept。preview.6 的更新器会在许可校验变化时于下载安装器前停止，KODER_EULA_ACCEPT 不能跳过这道检查。配置、记忆和绑定保留
    koder uninstall
        卸载程序，保留配置；需要删除配置时另行选择 --purge
  提示 · 装在 %LOCALAPPDATA%\koder-cli，设置在 %USERPROFILE%\.koder-cli，不需要管理员权限。如果提示执行策略不允许，就改用 CMD 那一行（带 -ExecutionPolicy Bypass）。
教练 › Windows XP、7、8 没法直接装：Node.js 22 最低要求 Windows 10，XP 连连接大模型接口需要的 TLS 1.2 都不支持。想在老电脑上用，可以用 PuTTY 之类的工具 SSH 登录另一台装了 Koder 的电脑，或者在手机上通过聊天软件网关给 Koder 发任务。
  提示 · 要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。
教练 › 安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
    koder update auto status
    koder update auto off
    koder update --check
    koder update
教练 › 默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。
    koder engine list
    koder model show
    koder engine use koder
  （小声）卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。
```

</details>

<details><summary>cmd · 原教练讲解与命令</summary>

```text
这份文字版按「Windows 命令提示符（CMD）」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 16 课 / 共 30 课 · 安装、更新和换引擎 ━━
教练 › 想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
    先在浏览器阅读：
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        官方团队 KARMENLOOP 官方团队，中国上海。官网 https://karmenloop.com 邮箱 info@karmenloop.com
        普通安装会在真实终端提示输入 accept 并回车；decline 或 Ctrl+C 取消；空回车会重新询问，不会安装。请完整输入 accept 再回车。
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
        已阅读并同意的自动部署（不要替未阅读的人预先填写；KODER_EULA_ACCEPT=1 只接受软件许可）：
    set "KODER_EULA_ACCEPT=1"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
    set "KODER_EULA_ACCEPT="
        Windows 10 / 11：装完重新打开命令提示符或 PowerShell；当前窗口的 PATH 不会自动刷新。
    koder version
    koder setup
    koder learn
    koder update --check
        只检查 GitHub 更新
    koder update
        下载校验并安装新版本；preview.6 起的会话自动重启接续，保留配置、记忆和绑定
        升到 preview.7 请运行上面的普通安装命令，阅读后输入 accept。preview.6 的更新器会在许可校验变化时于下载安装器前停止，KODER_EULA_ACCEPT 不能跳过这道检查。配置、记忆和绑定保留
    koder uninstall
        卸载程序，保留配置；需要删除配置时另行选择 --purge
  提示 · 装在 %LOCALAPPDATA%\koder-cli，设置在 %USERPROFILE%\.koder-cli，不需要管理员权限。装完一定要重开窗口：CMD 窗口的 PATH 是打开时定下的，不会自己刷新。
教练 › Windows XP、7、8 没法直接装：Node.js 22 最低要求 Windows 10，XP 连连接大模型接口需要的 TLS 1.2 都不支持。想在老电脑上用，可以用 PuTTY 之类的工具 SSH 登录另一台装了 Koder 的电脑，或者在手机上通过聊天软件网关给 Koder 发任务。
  提示 · 要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。
教练 › 安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
    koder update auto status
    koder update auto off
    koder update --check
    koder update
教练 › 默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。
    koder engine list
    koder model show
    koder engine use koder
  （小声）卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。
```

</details>

<details><summary>mac · 原教练讲解与命令</summary>

```text
这份文字版按「macOS 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 16 课 / 共 30 课 · 安装、更新和换引擎 ━━
教练 › 想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
    先在浏览器阅读：
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        官方团队 KARMENLOOP 官方团队，中国上海。官网 https://karmenloop.com 邮箱 info@karmenloop.com
        普通安装会在真实终端提示输入 accept 并回车；decline、空回车或 Ctrl+C 取消，取消前不下载。
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | bash
        已阅读并同意的自动部署（不要替未阅读的人预先填写；KODER_EULA_ACCEPT=1 只接受软件许可）：
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
        macOS 11 以上，Apple 芯片或 Intel；装完重开终端。
    koder version
    koder setup
    koder learn
    koder update --check
        只检查 GitHub 更新
    koder update
        下载校验并安装新版本；preview.6 起的会话自动重启接续，保留配置、记忆和绑定
        升到 preview.7 请运行上面的普通安装命令，阅读后输入 accept。preview.6 的更新器会在许可校验变化时于下载安装器前停止，KODER_EULA_ACCEPT 不能跳过这道检查。配置、记忆和绑定保留
    koder uninstall
        卸载程序，保留配置；需要删除配置时另行选择 --purge
  提示 · 装在 ~/.koder-cli，启动命令放在 ~/.local/bin/koder，不需要 sudo。第一次用 git 时 macOS 可能弹窗让你装“命令行开发者工具”，点“安装”就行。
  提示 · 要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。
教练 › 安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
    koder update auto status
    koder update auto off
    koder update --check
    koder update
教练 › 默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。
    koder engine list
    koder model show
    koder engine use koder
  （小声）卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。
```

</details>

<details><summary>linux · 原教练讲解与命令</summary>

```text
这份文字版按「Linux / Ubuntu 终端」来写；换别的系统：koder learn --print --os powershell|cmd|mac|linux

━━ 第 16 课 / 共 30 课 · 安装、更新和换引擎 ━━
教练 › 想把 Koder 装到别的电脑上？先阅读使用许可与授权说明，再按对应系统的命令安装：缺少运行时会下载 Node.js，安装包校验 SHA-256。安装后运行 setup 和 learn。
    先在浏览器阅读：
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        官方团队 KARMENLOOP 官方团队，中国上海。官网 https://karmenloop.com 邮箱 info@karmenloop.com
        普通安装会在真实终端提示输入 accept 并回车；decline、空回车或 Ctrl+C 取消，取消前不下载。
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | bash
        已阅读并同意的自动部署（不要替未阅读的人预先填写；KODER_EULA_ACCEPT=1 只接受软件许可）：
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
        Linux / WSL：按安装器的运行时检测结果安装，装完重开终端。
    koder version
    koder setup
    koder learn
    koder update --check
        只检查 GitHub 更新
    koder update
        下载校验并安装新版本；preview.6 起的会话自动重启接续，保留配置、记忆和绑定
        升到 preview.7 请运行上面的普通安装命令，阅读后输入 accept。preview.6 的更新器会在许可校验变化时于下载安装器前停止，KODER_EULA_ACCEPT 不能跳过这道检查。配置、记忆和绑定保留
    koder uninstall
        卸载程序，保留配置；需要删除配置时另行选择 --purge
  提示 · 不需要 sudo，全装在你自己的家目录里。Ubuntu 18.04 这类老系统（glibc 低于 2.28）和 Alpine 这类 musl 系统，会自动换成 Node.js 的非正式构建；树莓派 32 位（armv7l）也支持。装完提示找不到 koder，就执行 source ~/.bashrc 或者重开一个终端。
  提示 · 要给别的系统装？koder learn 16 --os powershell（或者 cmd、mac、linux）能看那一套的写法。
教练 › 安装版每次进入交互对话都会后台检查新版，运行中每六小时检查一次。等任务、排队输入和草稿都处理完，再自动安装、校验并恢复会话。换了使用许可就停下来，请你先读清楚。想自己掌握节奏？输入 /update auto off；重新开启用 /update auto on，或直接说“开启自动更新”，当前窗口立即检查。忙时可继续输入引导；空行按 / 选择草稿，Tab 填入。用 koder logs --tail 100 排查本地错误。更新也懂排队，不会抢你的键盘。
    koder update auto status
    koder update auto off
    koder update --check
    koder update
教练 › 默认使用内置 Koder 原生接口。备用引擎内部保留，默认关闭并置灰，正常使用无需安装或开启它。先检查当前模型与协议；网络错误不会偷偷切换引擎、密钥或计费地址。
    koder engine list
    koder model show
    koder engine use koder
  （小声）卸载命令写在这里，不是因为我们希望你用它，而是因为我们相信你不会用它。
```

</details>
