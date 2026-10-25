[从这里开始：安装、首个任务和功能导航](START-HERE.zh.md)

当前版本：**0.4.11**。先看[本版更新](RELEASE-0.4.11.zh.md)、[输入菜单与接口诊断](PROVIDER-WRITING-INPUT.md)、[独立多窗口任务](MULTI-WINDOW.md)。下方保留完整原有功能教程；Windows 实机与真实账号未验项见更新说明。

> 旧版更新器可能因包超过 100 MB 报“清单无效”。请用官网下载的当前安装器覆盖升级一次，保留配置和历史；详见 [安装与升级说明](INSTALLATION.md)。

当前版本默认开启 [Headroom 上下文优化](HEADROOM.zh.md)。以下安装入口和教程均对应本次正式发行。

# Koder CLI 完整使用教程

版本：**0.4.11**。先运行 `koder --version`；旧安装版不一定具备本页功能。本机回归、Windows 原生测试和真实账号检查分别记录，不把本机通过当作所有电脑与账号都已验收。

## 1. 先选对命令窗口

Windows PowerShell、CMD、macOS、Linux 和 WSL 的命令不能混用。完整安装命令见 [安装教程](INSTALLATION.md)，下载认准 [官网](https://karmenloop.com/download.html) 和 [KarmenLoop/koder-cli](https://github.com/KarmenLoop/koder-cli)。先阅读许可与隐私全文。个人非商业使用免费；商业使用与组织部署须另行取得书面授权。

正常安装不需要全局放开 PowerShell 执行策略，也不需要关闭安全软件。输入 `accept` 只接受许可，不会开启电脑、邮件、自主学习或同步权限。网络等待、主动取消和系统策略拦截是三回事；排查时保留实际阶段与最后几行报错。

## 2. 配置自己的模型

运行 `koder setup`，核对服务商、国内或国际账号、API 或套餐产品、模型 ID、协议和地址。网页会员不一定包含 API。灰色条目表示当前不可用，换计费路线不是自动修复。默认使用 Koder 原生内核，备用引擎单独控制。

如果希望只保存环境变量名，不把 Key 值保存到模型配置，可使用：

```text
koder model set --model ACTUAL_MODEL_ID --base-url OFFICIAL_API_BASE --protocol openai --key-env MY_PROVIDER_KEY
koder model test
koder model test --tools
```

先通过安全输入或 CI secrets 提供 `MY_PROVIDER_KEY`；这里是变量名，不是密钥。`--key-stdin` 是另一种配置方式，会把输入的 Key 保存到本机模型配置；要求只在环境中使用密钥时不要选择它。不要把 Key 放进任务、命令参数、截图或反馈。临时环境配置支持 `KODER_MODEL`、`KODER_BASE_URL`、`KODER_PROTOCOL`、`KODER_API_KEY`、`KODER_CONTEXT_WINDOW`、`KODER_MAX_OUTPUT`，窗口必须是模型实际支持的大小。

`model test` 总诊断上限为十秒，不套用普通推理的多次重试；`--tools` 还检查无副作用的工具调用与续答。文字通了不等于整套任务能力已经验收。真实套餐、余额和权限仍须用获授权的账号核实。

## 3. 每个项目都有自己的文件夹

新建网站、PPT 或应用时，如果没有显式指定工作区，也不是在已有工程里继续开发，Koder 会在用户主目录的 **Koder Projects** 中建立独立文件夹。已有项目原地继续；`-w` 明确指定的工作区优先。项目文件不应散落到 Koder 的程序安装目录。

```text
koder project create "Studio Site" --kind website
koder project create "Quarterly Review" --kind slides
koder project create "Studio App" --kind app
koder project list --json
koder project status
koder chat -w /absolute/path/to/existing-project
```

当前聊天内可以直接用 `/project create "Another Site" --kind website` 新建并切换；用 `/project open "/absolute/path"` 回到旧项目。切换会关闭空闲旧会话，按新项目重建，不搬走旧文件。重名时提示选择打开或改名，不合并。`.koder/project.json` 只保存项目身份和路径，不复制聊天与 API Key。

## 4. default 不是全局聊天

`default` 表示**当前规范工作路径下**的默认会话。同一项目、同一会话可继续历史；不同项目和命名会话不会自动继承彼此的任务聊天或任务事实。明确管理的共享笔记是另一项功能，沿用其声明的范围。

```text
koder ask "继续本项目发布任务" --session release
koder ask "单独排查一个问题" --session investigation
koder ask "本项目从头开始" --new
koder ask "这次不用历史" --no-memory
koder memory show --json
```

私有记录按项目路径和会话标识保存在用户 Koder 配置区，不放进将来上传的网站目录。“按工作区隔离”是数据身份边界，并非全部私有记录都在项目文件夹中。旧记录保留；不要为了解决串话直接删除整份配置。

## 5. 管道要明确，终端就不用猜

有提示词的 `ask/run` 默认不等待无关的标准输入。确实需要把管道内容附加到提示词时，加 `--stdin`；没有提示词时，把输入作为任务读取。输入必须完整结束，超时不会把半截内容交给模型。

```sh
koder ask "解释当前工程"
printf '%s\n' '这里是构建输出' | koder ask "总结这段输出" --stdin
cat task.txt | koder run
cat report.txt | koder ask "检查这份报告" --stdin --stdin-timeout 30
```

PowerShell 使用 `Get-Content -Raw .\report.txt | koder ask "总结输出" --stdin`；CMD 使用 `type report.txt | koder ask "总结输出" --stdin`。

完整输入默认等五秒，`--stdin-timeout` 可设为 0.01–3600 秒；输入上限为 400000 字节。生产者一直不关闭时，这是输入问题，不是 API 连不上。有提示词时不再需要补 `</dev/null` 绕过卡住。过大或不完整输入会明确报错，不悄悄截断执行。

## 6. Ask、执行和本次语言

`koder ask` 用来回答，不提出文件修改或命令；`koder run` 使用实际工具执行任务；直接输入 `koder` 进入聊天。`standard/code/minimal/plan/execute/report/enhance` 是工作模式，不是权限授权。

```text
koder ask "Explain the architecture" --lang en
koder run "修复失败检查" --lang zh
```

`--lang` 只控制本次调用，并给实际模型请求加入明确回答语言。`koder lang en` 保存偏好；`/lang en` 切换当前聊天。代码、标识符和用户要求原样保留的引文不被翻译。服务商未遵守指令与请求根本没带指令，要分别排查。

## 7. 权限跟着具体操作走

智能审批处理可识别的低风险检查和普通工程修改；敏感或未知操作会询问。“始终允许”只对记录下来的范围生效。`--approval auto|ask|full|deny` 控制本次策略；`--yes` 不覆盖显式 deny，不代填密码、开启系统权限、批准发信或正式发布。

完整模式不是操作系统权限。先看清目标、命令和差异再同意。未知结果不能当完成，发送、付款、部署前先核对状态，避免重复操作。Windows 的系统授权问题也不能靠在模型对话里反复输入 Y 解决。

## 8. 审阅、修复和检查

```text
koder review
koder fix "修复登录失败" --check "npm test"
koder fix --check "npm test" --attempts 3
koder test
```

`fix` 需要修复描述、检查命令或明确输入。`--attempts` 为 1–20，`--timeout` 为大于零且不超过 86400 秒的检查时限。缺内容时会显示示例，不再只说“没完成”。检查会运行工程代码，仍按原命令权限和工程依赖要求执行。一项小检查通过，不等于全产品或安装包已经通过。

## 9. 先看三种方向，再完整制作

新网站、PPT 和应用先做三个真实 HTML 方向稿，比较版式、信息组织和交互，不只换颜色。在本地浏览器里切换、并排比较、评分、说明保留什么。低于三分先改稿；已有确认设计、小修或明确跳过时不重复折腾。

遇到抉择，可以用 2–6 个步骤图方案说明取舍。浏览器反馈只回到当前任务，不代替发送任务或授权执行。PPT 展示代表页和叙事；App 浏览器原型不冒充原生真机验收。详见 [可视化工作流](VISUAL-WORKFLOW-AND-NETLIFY.md)。

## 10. 旁边开一个实时预览

当前聊天用 `/preview`。静态页面用本地预览，框架接入已启动且实际就绪的 loopback 开发地址。成功的工程写入或已批准启动结果可触发一次伴随预览；`/preview auto off` 关闭自动行为。

预览不会擅自安装依赖或启动未知脚本。框架保留原 HMR；静态页面保留输入，编辑中由用户选择刷新。原生应用仍需模拟器或真机。退出只回收自有预览，不停其他任务服务。详见 [邮箱和实时预览](MAIL-AND-LIVE-PREVIEW.md)。

## 11. 浏览器自动化与网页设计 Skill

可以直接要求 Koder 检查网页、填写已授权表单或测试流程。Agent 用 `skill_catalog` 按需检索，再用 `skill_read` 读取 `ecosystem:agent-browser:core`。Vercel agent-browser 的核心方法、参考页、三个示例模板和 Apache-2.0 许可已固定版本内置；这不代表外部可执行程序或浏览器安装包也被安装了。

Koder 先检查宿主驱动和目标范围，获取新快照，用本次快照的元素标识动作，再观察结果。`COMPUTER_DRIVER_MISSING` 表示宿主未接通驱动。上游 `@eN` 与 Koder 元素 ID 不能混用。登录态、Cookie、发送和上传须取得各自实际授权；未知结果先核对，示例脚本不会自动执行。

现有 `ecosystem:skills:frontend-design` 的内容与许可已经逐字节核对为 Anthropic 当前固定上游版本，继续内置，没有为“更新”伪造改动，也没有顺带升级其他技能。方法不能覆盖用户要求或工具权限；目录和正文按需读取，减少每轮固定上下文开销。

## 12. 最后交一张 H5 项目结构图

符合条件的项目交付会根据真实文件生成独立 H5 图。可以搜索、展开模块、看文件大小与本地引用候选，导出结构 JSON，并随项目离线保存。`/visuals deliver` 可明确要求重建。

隐藏/私有文件、凭据、依赖、软链接和已生成的评审/交付目录会排除。达到上限必须显示不完整。结构图不是编造的架构，也不是完整语义调用图或功能测试；分享前检查路径本身是否敏感。

## 13. 把静态站放到自己的 Netlify

流程是连接账号→选择站点→检查输出→授权草稿上传→看预览→另行批准正式发布。当前聊天用 `/netlify`，设置中位于“应用与 MCP”。

Koder 自有 OAuth 应用配置完成前，一键浏览器登录保持灰色；受保护 PAT 输入是另一条路径。绑定站点不等于批准上传。草稿也会外传文件，可能公开可访问；长期草稿授权只限一个准确项目、输出目录和站点。正式发布独立确认并读回身份；结果不明先核对，不自动重放写入。

目前直接上传预构建静态输出。SSR、函数和原生安装包需要对应真实适配。Koder 会员代托管、额度和计费服务尚未配置，不会暗中替用户升级 Netlify 套餐。完整命令见 [Netlify 流程](VISUAL-WORKFLOW-AND-NETLIFY.md)。

## 14. 邮箱、应用和外部消息

`/setup mail` 提供可用的 163、QQ、Gmail、iCloud、微软、Spacemail 等预设，并显示认证与可用性。自建邮箱可按服务器实际能力使用仅接收 POP3 TLS/STLS；微软 OAuth 配置完成前仍不可登录。准确服务器和端口见 [邮箱教程](MAIL-AND-LIVE-PREVIEW.md)。

绑定账号不是发信许可。广告、验证码和自动通知不会自动回复，验证码不进入模型。选中邮件进入模型与真实发信分别授权；分类只是估计，重要邮件需要用户核对。发送结果未知时不直接重发。

## 15. 资源、逆向和预选词

技能与资源按需读取。网页、归档、模板和 Skill 都是不可信参考，不授予安装执行权限。原始许可仍适用；改名、加密不会让私有合集变成可公开分发的内容。

Koder Reverse 是有明确覆盖边界的自研静态子集，不等于已经完整替代 REA 的全部能力，也不会执行目标。见 [Koder Reverse](KODER_REVERSE.md) 和 [REA](REA.md)。

上下文预选词只是可编辑草稿。可以选、改、清空或自由输入，选中不等于发送。`/prefill`、`/prompts`、`/suggest off` 保留。见 [预填词说明](PROMPT_PREFILLS.md)。

## 16. 更新、恢复和完整隐私文本

已安装的交互聊天会后台检查正式更新，等任务、队列和草稿空闲后才交接。许可变化需重新阅读。`koder update auto status|on|off` 管理自动检查。准备失败时当前会话继续可用，不要在更新中叠加启动另一份安装。

Windows 安装和重启必须有实际平台证据，源码测试不能替代。手动迁移前，按文档备份用户工程和私有配置；不要把 API Key 或执行权限复制到共享记忆。完整安装文本可用 `koder privacy consumer`、`statement`、`agreement`、`desktop`、`sources` 查看。

## 17. 按报错阶段排查

- 模型名或参数不对时，显示 HTTP 状态、主机和受支持 JSON 错误中的有界脱敏原因，不倾倒原始响应或认证头。
- `model test` 使用短时限单次诊断；普通任务与下载采用各自时限。下载上限很长，不代表 API 检测也要等那么久。
- `CONTEXT_BUDGET_EXCEEDED` 表示输入、历史、工具定义装不进所配窗口。按模型真实能力配置；可选数字回执只含计数，不含聊天正文。目录按需读取减少固定开销。
- 不完整流或工具调用不会被执行。已经核对的文件动作之后模型续答失败时，恢复续答，不重做文件动作。
- 记忆隔离告警可按提示退到临时 RAM，会说明限制；它与 HTTP 401、管理员权限不是一回事。

参数和无效配置退出码为 2；任务或检查失败用非零结果，成功为 0。脚本应把任何非零退出码当失败，不要只匹配一句提示。反馈请附版本、命令、阶段和脱敏后的最后几行。

## 18. 完整教程和所有命令

互动教练共 **30 课**，分别提供 PowerShell、CMD、macOS、Linux 写法；使用临时练习工程与脚本教练，不调用付费模型。`koder learn --print` 查看文字版，`koder help 命令名` 查当前用法。

[完整命令参考](COMMAND-REFERENCE.zh.md) 由本版的真实命令目录生成，覆盖每个文档命令及通用参数。版本号、教程课数与实际配置模型分别来自自己的来源；没有一个对所有用户通用的默认付费模型，也不代表已购买套餐。

`koder feedback` 和 `koder business` 提供 **info@karmenloop.com**，不会自动发送。官网为 [karmenloop.com](https://karmenloop.com)。

## 下载八份完整文字教程

- [koder-cli-0.4.11-en-cmd.txt](tutorials/koder-cli-0.4.11-en-cmd.txt)
- [koder-cli-0.4.11-en-linux.txt](tutorials/koder-cli-0.4.11-en-linux.txt)
- [koder-cli-0.4.11-en-mac.txt](tutorials/koder-cli-0.4.11-en-mac.txt)
- [koder-cli-0.4.11-en-powershell.txt](tutorials/koder-cli-0.4.11-en-powershell.txt)
- [koder-cli-0.4.11-zh-cmd.txt](tutorials/koder-cli-0.4.11-zh-cmd.txt)
- [koder-cli-0.4.11-zh-linux.txt](tutorials/koder-cli-0.4.11-zh-linux.txt)
- [koder-cli-0.4.11-zh-mac.txt](tutorials/koder-cli-0.4.11-zh-mac.txt)
- [koder-cli-0.4.11-zh-powershell.txt](tutorials/koder-cli-0.4.11-zh-powershell.txt)

## 结构化审查与无桌面的 Linux

`koder review --format json` 在模型请求成功但缺少结构化结果时，最多追问一次。仍无法解析完整审查时返回退出码 3，并显示 `REVIEW_UNPARSED`，CI 不能把它当作没有问题。API 请求失败保留失败退出码，不触发这次追问。

Linux 应用连接宿主需要 `secret-tool`（常见包名 `libsecret-tools`）、可用的 DBus 会话以及已解锁的 Secret Service，例如 gnome-keyring。缺少这些条件的无桌面容器不能使用受保护的应用连接。Koder 不会自动安装系统软件包或降低凭据保护；仅在进程内保存凭据也不能替代宿主的受保护存储。

仅使用环境变量配置模型时，`model list` 与 `model context` 可查看当前模型；上下文和输出额度用 `KODER_CONTEXT_WINDOW` 与 `KODER_MAX_OUTPUT` 修改。设置了 `KODER_AUTO_UPDATE=0` 时，`update auto status` 会同时说明保存的设置与当前进程实际关闭的状态。

远程资料默认关闭。`koder resources search "关键词" --remote` 仅为本次命令授权向 karmenloop.com 发送检索词；设置 `KODER_REMOTE_RESOURCES=1` 后才向 Agent 提供远程检索工具，`0` 可强制关闭。本机私有资料检索不会自动转到远程服务。

## 无交互运行与来源检查

[CLI 行为契约](CLI-CONTRACTS.zh.md)说明管道输入、未回答的澄清、临时审批、失败请求不增加历史的条件以及退出码。[原始盲测题](BLIND-BENCHMARKS.zh.md)区分确定性流程检查和真实模型评测。审查无法解析或发版文案归因缺少支持时返回 3，不能当作 CI 通过。

## 文案与项目交付检查

完整规则见[质量检查教程](QUALITY-CHECKS.zh.md)。文案或项目缺项时退出码为 3，已写文件保留，并列出未通过项；这不会误报为 API 故障。下面的检查无需模型，也不运行项目脚本：

```sh
koder project check --kind service --json -w /path/to/project
koder project check --kind website --json -w /path/to/site
```

之后再运行当前授权范围内的真实测试。找到测试文件不代表测试通过，就像找到跑鞋不代表已经跑完马拉松。模型预设会按实际目录显示可选与暂不可用数量；账号能否使用还要单独检测。


## Windows 操作与代码图谱

参见[Windows-MCP 与 Code Graph 完整教程](MCP-INTEGRATIONS.zh.md)：当前窗口配置、平台/启动器诊断、按项目隔离、实际调用和停用。


[Windows-MCP 与 Code Graph 真实调用验收](MCP-ACTUAL-ACCEPTANCE.zh.md)：已测平台、原生依赖与未测范围。

## 功能速查

`koder skills list` 查看技能；聊天中 `/skill` 选择技能。执行中可继续输入补充，Setup 可选择 steer 或 queue。`/harness deep-research` 选择研究配置，`koder harness off` 关闭 JIT。应用操作沿用已授权的 Apps/MCP、浏览器和桌面；缺权限或驱动会明确提示。持久经验 owner 未接入时返回 NO_ENTRY。

[技能教程](PORTABLE-SKILLS.zh.md) · [输入与设置](SESSION-INPUT-AND-SKILLS.zh.md) · [应用操作](APP-USE-AND-LEARN.zh.md) · [Harness 配置](HARNESS-JIT.md) · [更新与已知限制](RELEASE-0.4.11.md)

## 常驻与邮件问询

安装后先 `koder --version` 核对 0.4.11，再 `koder setup` 配置模型。可选 `koder activate` 开启登录后常驻，`koder status` 查看状态，`koder deactivate` 停用。默认不读邮箱、日历或浏览历史；常驻不增加工具权限。Setup 中可设置安静时段、提醒次数和来源。

邮箱在 Setup 绑定，授权码以星号显示。分别开启 `/mail model on` 与 `/mail inquire on` 并确认后，相关来信可以提出选项；选择只生成草稿，发送仍需最终预览和确认。后台查收还需在常驻页打开邮箱可见性。广告和验证码不参与问询。

[常驻完整教程](ALWAYS-ON.zh.md) · [邮箱完整教程](MAIL-PROACTIVE-INQUIRY.zh.md) · [本版更新与未验项](RELEASE-0.4.11.md)。30 课和八套中英文教程仍在，运行 `koder learn` 开始。

## 已有功能导航

- [内置 Windows-MCP](WINDOWS-MCP-BUNDLED.zh.md)
- [安装超时与恢复](WINDOWS-INSTALL-RECOVERY.zh.md)
- [163 等邮箱发送与后台提醒](MAIL-DELIVERY.zh.md)
- [Headroom 上下文优化](HEADROOM.zh.md)

## MCP 与 Skill 适配

[统一目录、开关、依赖诊断和协议设置](MCP-SKILL-COMPATIBILITY.zh.md) · [逐项清单](MCP-SKILL-INVENTORY.md) · [0.4.11 更新说明](RELEASE-0.4.11.zh.md)。


模型自动更新：Setup → 模型，可自动获取、手动刷新或关闭；[完整教程](MODEL-DISCOVERY.zh.md)。


[自动更新完整说明](AUTO-UPDATE.zh.md)：修复本窗口开启失败，支持“开启自动更新”。


[实时输入与排障](SESSION-INPUT-AND-SKILLS.zh.md)：忙时引导、排队、取消、预输入菜单与本地日志。


[长命令等待与进度保留](COMMAND-DURATION.md)

## 绑定 GitHub 与托管项目

运行 koder github connect，或 Setup → Apps / MCP → GitHub。绑定自己的令牌后，可以读取仓库、创建私有仓库、提交选定文件、编辑 README 和仓库介绍、创建草稿 PR。远程写入逐次确认，断线先对账。详见[完整教程](GITHUB-PROJECTS.zh.md)。
