# Koder CLI

[English](README.md) | 简体中文

Koder CLI **0.4.0-preview.29 Beta** 是自接模型 API 的终端编程工具。个人非商业本地使用免费，不要求会员；商业使用和组织部署需另行书面授权，个人许可不允许专有代码二次开发或修改。模型提供方可能按请求收费。

[下载当前版](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.29) · [完整中文指南](docs/USER-GUIDE.zh.md) · [English guide](docs/USER-GUIDE.en.md) · [中文命令参考](docs/COMMAND-REFERENCE.zh.md)

本版包含按工作区隔离的历史、独立项目目录、有界 API 诊断、非交互补问与源码披露检查。KARMEN LOOP 内核负责计划、权限、工具执行与结果保存，新运行时源码按 [EULA](EULA.md) 保持专有。第三方组件保留自己的许可与[归属](OPEN_SOURCE_CREDITS.md)。

仓库中的 `package.json` 与 `src/` 保留历史 GPL **0.3.1** 源码，不能据此构建当前专有 Beta 安装包。当前分发版本以指定发行页和官方更新源为准，见[源码与分发状态（英文）](SOURCE-STATUS.md)。

## preview.29 更新

新增 MiniMax 内容审核分类、按 `/` 打开的可编辑输入选项、原生 Koder 多窗口会话隔离、长对话任务约束保留、撰写来源与前稿证据。此前候选中的 Harness² 增量对照和爬虫／自研静态逆向一并纳入。详见[完整更新说明](docs/RELEASE-preview.29.md)和[多窗口教程](docs/MULTI-WINDOW.md)。

本版按 Beta 发布：PS5.1 冷启动、Windows 图形焦点／输入、完整客户端安装更新及真实模型账号仍有未验项，不宣称已全部认证。灰色模型路线继续停用。

## 安装

按系统选择 Windows 10/11、macOS、Linux 或 WSL 的对应命令。安装器复用 Node.js 22.21+ 或 24+，缺少时下载并校验运行时；正常安装不需管理员权限。先阅读原始[许可](EULA.md)、[同意说明](ACCEPTANCE.md)、[版权声明](LEGAL-NOTICE.md)及[中文 CLI 隐私条款](docs/privacy/consumer-privacy.zh.md)。本页不替代法律文件。

只选择一条命令。许可提问出现后输入 `accept` 并 Enter；`decline` 或 Ctrl+C 取消。Windows 空输入会再次询问。同意软件条款不会启用可选权限。

### Windows PowerShell

```powershell
$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
```

### Windows CMD

把完整一行粘贴到 CMD，不要将此包装命令粘贴到 PowerShell：

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
```

### macOS / Linux / WSL

```sh
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | bash
```

下载显示进度并核对 SHA-256。完成期限默认值和上限为 100000000 秒，可用 `KODER_DOWNLOAD_TIMEOUT_SECONDS` 设置 1–100000000 的较短期限。Ctrl+C 取消；更新失败保留旧安装。此设置不延长模型 API 超时或已有 Node 的五秒探测。

安装排错见[故障参考（英文）](docs/TROUBLESHOOTING.md)和[完整中文指南](docs/USER-GUIDE.zh.md)。Mac 测试替身不能证明所有 Windows 设备或真实提供方账号可用。

## 第一次使用

```text
koder setup
koder learn
koder
```

30 课教程在一次性练习项目中操作真实文件和审批，教练为脚本，不需付费模型。支持中英文与 PowerShell、CMD、macOS、Linux 版本，记录进度；Enter 继续、b 返回、q 退出。`koder learn --print --os cmd --lang en` 可打印离线英文版。

会话内 `/setup` 设置、`/model` 管理模型、`/new` 新话题、`/exit` 退出。恢复历史后的一句问候不会自动恢复旧编程任务；明确要求继续时仍可使用保留历史。

## 模型接口与套餐

**因已知集成问题暂不可用：** MiMo Token Plan、Kimi API、Kimi Code、DeepSeek、Alibaba Token Plan、Volcano Coding Plan、Volcano Ark API。设置中置灰并禁止选择。旧配置保留供查看或删除；激活、测试、刷新与执行在网络请求前拦截，不自动切换备用引擎或计费线路。

CLI 实现 Chat Completions、Anthropic Messages、Responses。目录保留历史模型信息并显示当前可用性，可选条目仍需核实账号权限。Alibaba Token Plan、Alibaba Coding Plan、Volcano Coding Plan 的入口和计费路径各自独立；MiMo 按量与 Token Plan 也分别维护。内部备用引擎默认关闭、置灰，不静默换域名、密钥或付费产品。

```text
koder model presets
koder model models aliyun-coding-plan
koder model test
koder model test --tools
```

最后两条会调用已配置 API，可能产生费用。文字响应只证明文字访问；`--tools` 明确请求无害工具调用及后续续答。端点细节见 [PROVIDERS.md](docs/PROVIDERS.md)、[MIMO.md](docs/MIMO.md)（英文参考）。

## Windows 与代码图谱

可选预设通过现有 MCP 宿主配置 Windows-MCP 0.8.8 与 CodeGraphContext 0.6.13。明确测试或启用前保持关闭；图谱配置与发现绑定工作区，真实工具仍沿用原审批。外部 Python 程序需单独安装。

阅读[中文集成指南](docs/MCP-INTEGRATIONS.zh.md)与[真实调用验收](docs/MCP-ACTUAL-ACCEPTANCE.zh.md)。发布后在一次性 Windows Server 2025 runner 与隔离 Apple Silicon Mac 做过真实调用检查；报告列出成功路径、Mac OpenSSL 3 前提和未验证组合。Agent 派发采用脚本，不代表真实模型规划能力评分，安装器字节与默认权限未因此改变。

## 内置学习方法

CLI 随附 `personal-agent-growth` **0.3.2**。相关任务可通过 `skill_read` 读取本地方法，预习下一步、保留失败、核查修订候选并从记录接续；简单请求直接处理。独立技能仓库可能有更新版本，不据此改写 CLI 随包版本。

```sh
koder growth status
koder growth show
koder growth off
koder growth on
```

开关在下次 CLI 会话生效。方法使用当前模型、工具和执行审批，记录保存在已授权工作区，不启用画像、同步、后台服务或新 API 预算。定时接续仍需独立授权且可用的宿主后端，保存计划不等于注册计划任务。原方法保留 AGPL-3.0-only 许可与声明；见[使用参考（英文）](docs/AUTONOMOUS-LEARNING.md)。

## 可选庆祝效果

```text
koder celebrate
koder celebrate fireworks
koder celebrate auto notice
koder celebrate auto off
koder celebrate birthday --date 03-14
koder celebrate music on
koder celebrate music off
koder celebrate locale --language en
```

代码雨、彩纸、烟花和节日/生日效果约六秒，任意键跳过；菜单 Enter、q、Esc 可离开。重定向输出与 JSON 不动画，`KODER_REDUCED_MOTION=1` 显示静态问候。

节日默认只给可选问候，`auto on` 才自动播放。自定义日期可用 `celebrate custom --date MM-DD --name "Our day"`。生日只在确认后本地保存月日；`celebrate birthday forget` 删除并关音乐。

音乐和 IP 国家查询默认关闭、分别确认。生日音乐启用后当天最多请求一个浏览器标签，本地旋律无需音乐账号；浏览器仍可能需要手动 Play。可选 QQ Music/YouTube Music 搜索按所选语言和服务条款运行。明确语言与启用的本地语言统计优先于可选 IP 提示。

## 隐私与反馈

```text
koder privacy consumer
koder privacy statement
koder privacy desktop
koder privacy agreement
koder privacy sources
koder feedback
koder permissions status
```

中英文 CLI 声明与未修改的官方消费者原文随包提供，可离线阅读。CLI 配置/环境变量密钥与桌面加密密钥库分别说明。模型请求、可选同步、应用连接、国家查询和音乐具有不同范围。

会话中提出反馈或运行 `koder feedback` 可取得邮箱与空白模板，不自动发送或附文件。联系前移除密钥、密码、私人路径和个人记录。

应用审批、脱敏与校验不替代 OS 权限。`--yes` 不授予电脑、隐私、生日、音乐或国家查询的额外同意。

## 执行权限

默认 smart：已识别的低风险本地检查与普通项目修改可直接进行；代码执行、删除、秘密/配置路径、shell 副作用、未知命令和外部应用动作需要提问。决定由本地代码作出，不由模型自述决定，也不是 OS 沙箱。

敏感提问时 `y` 单次允许，`a`/`always` 保存该工作区的确切动作，`f`/`full` 保存该工作区完全访问，Enter/`n` 拒绝。

```sh
koder permissions execution status
koder permissions execution ask
koder permissions execution auto
koder permissions execution full --confirm FULL
koder permissions execution full --scope profile --confirm FULL
koder permissions execution revoke all
koder permissions execution reset
```

完全访问可在已有权限内无逐项提问执行命令、改删文件和操作应用，默认只针对当前项目；`--scope profile` 明确覆盖该本地 profile 的所有项目。`reset` 清空保存设置；`revoke all` 返回 smart 并移除适用规则。`--approval auto|ask|full|deny` 和 `--yes` 为当前运行选择，不能覆盖明确 deny。它们不接受软件条款、不填写密码、不启用学习/同步或授予 OS 权限；ACP/编辑器和远程网关保留各自策略。

规则在本地 CLI home 的 `execution-permissions.json`，保存主机/工作区范围与动作哈希，不保存原始命令或密钥，不作为记忆同步。损坏记录不授予权限，可重新选择单次允许或在备份损坏记录后保存新规则；不安全路径和不可读文件仍阻塞。

## 更新、私人资料与商业许可

`koder update --check` 查看，`koder update` 安装接受的版本。已完成动作不会仅因进程重启而重做。重装保留配置与记忆，旧版迁移见[中文指南](docs/USER-GUIDE.zh.md)。

托管的交互会话最多每六小时后台查更新；仅在活跃任务、排队输入和草稿处理完后交接，校验替换并恢复会话。新任务可与准备并行，最后安装仍等待当前任务。关闭会话取消未完成准备，许可变化需手动审阅。`koder update auto off|on|status` 控制自动更新，`KODER_AUTO_UPDATE=0` 禁用本进程自动检查；脚本、单次命令和未托管副本不会自动安装。

远程参考默认关闭。`koder resources search "1688" --remote` 或 `koder resources read RESOURCE_ID --remote` 单次启用；`KODER_REMOTE_RESOURCES=1` 允许本地模型任务请求远程参考，`0` 禁止。查询发往官方服务，请用简短且不含私密信息的关键词。见[远程检索参考（英文）](docs/REMOTE-RESOURCES.md)。

`koder resources import /path/to/collection.zip` 可导入自己的归档；仅在允许模型检索并取得摘录时加 `--model-access`。资料本地加密、按需读取，不进入同步与公开发行，导入不执行附带脚本。见[私人资料参考（英文）](docs/PRIVATE-RESOURCES.md)。

公司许可和专用私有交付可运行 `koder business` 或联系 [info@karmenloop.com](mailto:info@karmenloop.com)，范围与权利以单独书面协议为准。[商业参考（英文）](docs/COMMERCIAL-LICENSING.md)。Star 自愿，不影响安装和许可功能。

## 菜单、证据与第三方组件

会话中 `/menu`/`菜单` 打开设置，`/celebrate`/`彩蛋菜单` 打开效果，`/growth status` 查看学习方法。也可直接输入 `koder setup`、`koder celebrate`。Escape 离开设置，Enter 跳过效果菜单，任意键跳过动画，仍在原终端继续任务。普通提到网站或菜单的工作请求进入任务引擎，只有明确询问 Koder 自身时才显示产品介绍。

[CLI 契约](docs/CLI-CONTRACTS.zh.md)、[质量检查](docs/QUALITY-CHECKS.zh.md)、[盲测说明](docs/BLIND-BENCHMARKS.zh.md)与[Windows 安装记录（英文）](docs/WINDOWS-INSTALL-CHECKS.md)分别区分源码、安装包、协议替身、原生平台、真实账号和用户设备。新的公开标签用于分发文档，不发布新专有运行时源码；实际包、安装器与校验文件位于发行资产。

REA 6.7.0 保留 MIT，其依赖各自保留许可（含 LGPL-3.0+ 的 OpenPGP.js）。详见原包 `vendor/rea/README.md`、`components.json`、第三方声明及 `sources/`；不附外部分析引擎。

KARMENLOOP 官方团队 · 中国上海 · [官网](https://karmenloop.com) · [联系](mailto:info@karmenloop.com)
