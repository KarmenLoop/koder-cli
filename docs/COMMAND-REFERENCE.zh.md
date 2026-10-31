# 完整命令参考

Koder CLI 0.5.1 · 1800 课中文课堂；原 30 课英文教程

根据本版命令定义生成。 [GitHub](GITHUB-PROJECTS.zh.md) · [Setup](USER-GUIDE.zh.md) · [长任务与子任务操作](TASK-ORCHESTRATION.zh.md)

```text
KODER CLI 0.5.1
轻量即用的终端编程代理

用法
  koder [命令] [选项]
  koder "<任务>"

开始干活
  project  新建、打开与查看独立项目文件夹  项目
  chat     进入交互对话（直接输入 koder 即可）  对话
  run      执行任务：智能审批、可保存许可  运行、做
  ask      只读提问：不改文件、不跑命令  提问、问

审查、修复、测试
  review   上下文感知的代码审查，可直接修复  审查、评审
  fix      运行检查，失败就修，修完再查  修复
  test     为改动或指定文件生成测试  测试、补测试

自动化与编排
  flow     按流程文件编排多个智能体与检查步骤  流程、编排
  ci       生成 GitHub Actions 工作流，处理 /koder 评论  流水线
  moa      Mixture of Agents：多个模型先给意见，当前模型汇总执行  混合

接入工具链与本机工程
  github   绑定 GitHub 令牌、托管项目和编辑仓库
  netlify  绑定自己的 Netlify 站点并授权预览部署
  reverse  Koder 自研静态逆向引擎（预览）
  rea      内置 REA 逆向分析工具  逆向
  apps     应用连接与状态  应用
  mcp      添加、导入和验证 MCP
  acp      通过 ACP 协议在标准输入输出上提供 Koder  协议
  editor   显示 Zed、Neovim、Emacs 的接入配置  编辑器
  scan     扫描本机 Koder、Codex、Claude Code、Cursor 的项目与任务  扫描
  connect  连接聊天应用并启动收发消息  连接
  gateway  一键接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord、WhatsApp  网关、接入

设置与帮助
  ocr      离线识别图片与扫描 PDF
  design   网站需求问询与内置设计参考  awesome-design-md
  pageindex按文档目录回读原文与核对引用
  llm-apps 内置 AI 应用参考与 Koder 工作流  awesome-llm-apps
  tools    先查本机工具，再找公开候选
  subagents专业角色目录与子 Agent 检查点
  notifications任务完成通知、测试与回执
  open     用通知编号打开原会话
  cad      SolidCraft 参数化三维建模  solidcraft
  cli-anything发现、注册并审批调用本机应用 CLI
  migrate  加密迁移项目、配置与本地历史  migration、迁移
  logs     查看本机运行日志
  activate 显式开启用户级常驻
  deactivate关闭常驻并取消自启
  status   查看常驻、提醒和网关状态
  agentd   常驻诊断与主动提醒设置
  harness  按任务选配执行配置
  visuals  三方向浏览器评审、图示抉择与项目 H5 结构图
  mail     绑定邮箱、收信分类与独立授权回复
  preview  在旁边浏览器实时预览当前网页或 Web APP
  growth   内置自主学习 Skill：状态、方法与开关  自主学习
  resources资料库：远程按需检索，或导入自己的私有合集  资料、资源库
  business 公司商业授权与专用私有仓库洽询  商业授权、企业服务
  star     自愿为 Koder 点一颗 GitHub Star  点星
  privacy  离线查看完整消费者隐私条款与声明  隐私
  feedback 官方反馈邮箱与空白模板  反馈、投诉
  celebrate可跳过的六秒彩蛋、节日与生日设置  彩蛋
  eula     查看使用许可、授权与数据说明，或明确接受许可
  account  跨设备记忆账号、登录与退出  账号、帳號
  prompts  根据对话预选下一句，也可使用常用模板  prefill、预填词、预填
  skills   发现、导入并调用 Codex、Cursor 和 WorkBuddy 兼容技能  skill、技能
  permissions智能审批、始终允许、全面开放与电脑授权  权限
  setup    设置界面：方向键或鼠标就能配好全部选项  设置、配置、settings、config
  onboard  同 koder setup，安装脚本装完会自动打开  向导、初始化
  engine   切换引擎：内置 Koder 内核或 Python 版 Hermes（ACP）  引擎
  update   更新到最新版  更新
  uninstall卸载 Koder CLI（--purge 同时删除配置）  卸载
  memory   查看、检索和管理本地与共享记忆  记忆
  context  上下文窗口与自动压缩设置
  model    配置模型与真实上下文窗口  模型
  lang     切换中文或英文  语言
  theme    切换官网深色或浅色配色  主题
  help     查看命令说明  帮助
  learn    1800 课互动教程：在练习场里边学边动手  教程、教学
  doctor   检查环境、模型和启动耗时  体检
  banner   显示折光体开屏  开屏
  version  显示版本，以及官网更新页  版本
  about    按官网介绍 Koder 是谁做的，并给出更新页  关于、官网

通用选项
  --harness <id>            本轮选配 Harness；不改变权限或模型
  --skill <id,name>         本轮指定本机 Skill；正文按需读取，脚本仍走原审批
  --stdin                   将标准输入附加到显式提示词；没有提示词时自动读取
  --stdin-timeout <秒>      完整输入的等待上限，默认 5 秒，范围 0.01–3600 秒
  -w, --workspace <目录>    工作区，默认当前目录
  -y, --yes                 自动接受文件修改和命令；仍不回答提问、不收集密码、不代开学习或电脑权限
  --approval auto|ask|full|deny 本次审批模式；--yes 不会覆盖显式 deny
  --json                    每行输出一个 JSON 事件，方便脚本解析
  --lang zh|en              这一次用中文或英文
  --mode <模式>             standard、code、minimal、plan、execute、report、enhance
  --provider <文件>         临时使用另一份模型 JSON
  --moa                     这一次用 MoA：参考模型先给意见，当前模型汇总执行
  --engine <名称>           默认 koder；内部备用引擎默认禁用并置灰，不自动切换
  --no-color                关闭颜色
  -h, --help                显示该命令的说明

koder help <命令> 看详细说明；koder learn 跟着教程走；koder lang en 切换英文。
```

## ocr

```text
koder ocr  离线识别图片与扫描 PDF

用法
  koder ocr status|on|off | read <file> [--page N] [--language eng|chi_sim|eng+chi_sim] [--sha SHA256] [--json]

中英文 OCR 数据与 WebAssembly 随包，默认启用。按页返回源 SHA、文字与置信度；无需 Python 或 OCR 云账号。Setup → Skills 可关。OCR 需核对原图；Agent 模式的文字仍会进入已选模型。

通用选项见 koder help。
```

## design

```text
koder design  网站需求问询与内置设计参考
别名: awesome-design-md

用法
  koder design status|list|read|verify|on|off [id] [--query text] [--offset N] [--limit N] [--json]

默认随建站/改版任务询问缺失需求；离线查阅 DESIGN.md，沿原三方案、代码和预览完成网站。Setup → Skills 可关闭。无交互或要求直接做时明确假设并继续。

通用选项见 koder help。
```

## pageindex

```text
koder pageindex  按文档目录回读原文与核对引用

用法
  koder pageindex status|index|tree|search|read|export|check|on|off [file] [--node id] [--sha sha256] [--query text] [--json]

默认自动调度：本地 Markdown/文本/PDF 目录、章节回读、逐字引用核验。无需 Python 或新云账号。Setup → Skills 可关闭。扫描件需 OCR，PDF 使用实际页码；索引不自动持久化。

通用选项见 koder help。
```

## llm-apps

```text
koder llm-apps  内置 AI 应用参考与 Koder 工作流
别名: awesome-llm-apps

用法
  koder llm-apps status|list|read|plan|retrieve|check|verify|on|off [id] [--query text] [--path file] [--json]

默认启用：离线目录、固定提交源码、Koder 方法适配、本地词法检索及引文核验。Setup → Skills 可关闭主技能或单项方法。不会自动安装或运行上游应用；外部账号、服务及依赖需按项目实际配置。

通用选项见 koder help。
```

## tools

```text
koder tools  先查本机工具，再找公开候选

用法
  koder tools status|audit [--json] | seek <public query> [--command executable-name] [--local] [--page N] [--json]

只读检查 PATH，不执行文件。找到本机工具时默认不联网；--local 仅查本机。远程搜索仍需 network；安装由任务中的 tool_bootstrap 走原审批。

通用选项见 koder help。
```

## subagents

```text
koder subagents  专业角色目录与子 Agent 检查点

用法
  koder subagents roles [--query text] [--group id] | role <id> | match <task> [--role id] | status [--session name] [-w workspace] [--thread ID] [--offset N] [--limit N] [--json]

90 个角色、25 个领域；180 是任务槽位，默认 4 个子任务同时执行，可在 Setup 调整。读取原会话存储，不恢复或重做任务。检查点中的 running 只显示为 unconfirmed；实时状态和取消在原聊天使用 /subagents status|cancel。

通用选项见 koder help。
```

## notifications

```text
koder notifications  任务完成通知、测试与回执

用法
  koder notifications status | test task-done | task-done on|off | flush | register

短对话默认安静；长任务、失败与真实待确认按设置提醒。测试实际调用系统适配器；submitted 只证明已提交。register 仅在 Windows 显式注册本用户继续会话入口。Setup → 任务完成提醒可调整阈值和安静时段。

通用选项见 koder help。
```

## open

```text
koder open  用通知编号打开原会话

用法
  koder open <opaque-token>

核实当前账号、原项目和原会话后打开；不自动发送消息或重做任务。

通用选项见 koder help。
```

## cad

```text
koder cad  SolidCraft 参数化三维建模
别名: solidcraft

用法
  koder cad status|enable|disable|test|verify [-w <dir>] [--command <absolute-cli-path>]

Windows x64 与 macOS 内置 CLI。按项目开启，每回合独立设计实例；经原 MCP 审批建模、测量、保存与导出。test 仅验证握手，实际尺寸另行核对。

通用选项见 koder help。
```

## cli-anything

```text
koder cli-anything  发现、注册并审批调用本机应用 CLI

用法
  koder cli-anything catalog [query] | register <manifest> | list | inspect <id> | invoke <id> [-- args...] | install <id> [--yes]

固定上游目录不代表已安装。只注册工作区内的可执行文件；执行复用原命令审批和进程回执。

通用选项见 koder help。
```

## migrate

```text
koder migrate  加密迁移项目、配置与本地历史
别名: migration, 迁移

用法
  koder migrate | export --output <file> | inspect --file <file> | import --file <file> --yes | send --to user@host --yes | status | open <id> | rollback <id> --yes

迁移向导默认选择 Koder Projects；--project 可指定目录。目标使用独立配置，凭据和权限重新授权。SSH 需要已有登录与已知主机。参阅 docs/DEVICE-MIGRATION.zh.md。

通用选项见 koder help。
```

## github

```text
koder github  绑定 GitHub 令牌、托管项目和编辑仓库

用法
  koder github connect | status | repos | read owner/repo README.md | create name | commit owner/repo file... | edit owner/repo --description text | pr owner/repo --head branch --title text | reconcile owner/repo | disconnect

Setup → 应用与 MCP → GitHub。受保护输入令牌，或 --key-env 变量名；不把令牌写进命令。新仓库默认私有，提交仅包含列出的文本文件，写入需本地确认；不删除仓库或强制推送。

通用选项见 koder help。
```

## logs

```text
koder logs  查看本机运行日志

用法
  koder logs [--tail 100] [--path] [--json]

只读查看有界事件与错误码，不记录任务正文或凭据，不自动上传。

通用选项见 koder help。
```

## activate

```text
koder activate  显式开启用户级常驻

用法
  koder activate

默认不读取邮件、日历或浏览历史。常驻不增加权限；原 Core 控制执行与取消。详见 docs/ALWAYS-ON.zh.md。

通用选项见 koder help。
```

## deactivate

```text
koder deactivate  关闭常驻并取消自启

用法
  koder deactivate

默认不读取邮件、日历或浏览历史。常驻不增加权限；原 Core 控制执行与取消。详见 docs/ALWAYS-ON.zh.md。

通用选项见 koder help。
```

## status

```text
koder status  查看常驻、提醒和网关状态

用法
  koder status

默认不读取邮件、日历或浏览历史。常驻不增加权限；原 Core 控制执行与取消。详见 docs/ALWAYS-ON.zh.md。

通用选项见 koder help。
```

## agentd

```text
koder agentd  常驻诊断与主动提醒设置

用法
  koder agentd status|doctor|logs|wake|proactive on|off

默认不读取邮件、日历或浏览历史。常驻不增加权限；原 Core 控制执行与取消。详见 docs/ALWAYS-ON.zh.md。

通用选项见 koder help。
```

## harness

```text
koder harness  按任务选配执行配置

用法
  koder harness status|list|experiences [--offset N --limit N]|on|off|use <id|auto>|default <id>|archive <on|off>|steps <unlimited|N>|budget <amount> <USD|CNY> <model> <input-per-million> <output-per-million>|budget off

复用原工具、预算、权限与经验接口；Setup → 技能 → 任务 Harness。关闭时保持默认 ReAct。

例子
  koder harness list
    查看五种 Profile

通用选项见 koder help。
```

## project

```text
koder project  新建、打开与查看独立项目文件夹
别名: 项目

用法
  koder project create <name> [--kind website|slides|app|project] | open <path> | list | status | anchor | check [--kind project|website|service|generator]

新项目统一放在用户的 Koder Projects 文件夹。/project create 或 open 在当前聊天切换项目并重建会话；已有工程可用 -w。默认任务历史按项目与会话隔离。project anchor 读取项目身份、中心思想与验收锚点；新项目自动建草稿，方向变更保留历史并经原审批。project check 只检查文件结构，缺项退出3，不运行脚本。

通用选项见 koder help。
```

## visuals

```text
koder visuals  三方向浏览器评审、图示抉择与项目 H5 结构图

用法
  koder visuals review|decision --file directions.json | status | deliver

先比较三种不同版式再完整制作；低分先改稿，明确跳过时不强制。浏览器意见只用于当前任务，不授予上传或执行权限。交付图基于实际文件，排除凭据与依赖。

通用选项见 koder help。
```

## netlify

```text
koder netlify  绑定自己的 Netlify 站点并授权预览部署

用法
  koder netlify login | connect --key-env NAME | sites | bind | plan --directory dist | deploy --directory dist | publish <deploy-id> | status | disconnect

Koder 自有 OAuth 应用配置后支持浏览器登录；未配置时明确提示，可使用受保护 Token。默认只上传已构建静态文件为草稿地址；正式发布单独确认。会员与 Netlify 额度、费用分别处理，Koder 托管尚未开通。

通用选项见 koder help。
```

## mail

```text
koder mail  绑定邮箱、收信分类与独立授权回复

用法
  koder mail setup|status|check|inquire on|off|inquiries|choose <id> A|send-inquiry <id>|dismiss <id>|watch|disconnect

模型读取、习惯学习与自主回复分别授权；/mail auto on --allow-from friend@example.com --daily-limit 5。收信主动问询：先 /mail model on，再 /mail inquire on。A/B 选择后起草，发送须输入 send。验证码只在本地显式查看。Koder 或 mail watch 运行时才提醒。

通用选项见 koder help。
```

## preview

```text
koder preview  在旁边浏览器实时预览当前网页或 Web APP

用法
  koder preview start [--directory dist] [--url http://127.0.0.1:5173] | status | open | stop

静态页面自动刷新，保留正在输入的内容；框架项目接入已启动的本地服务器。不自动安装依赖或执行项目脚本。原生 APP 需要模拟器或真机。

通用选项见 koder help。
```

## growth

```text
koder growth  内置自主学习 Skill：状态、方法与开关
别名: 自主学习

用法
  koder growth status|show|on|off

personal-agent-growth 0.3.2 随包离线提供，相关任务按需调用。on/off 在下次 CLI 会话生效；show 查看方法。任务经验只写获准工作区；画像学习、同步、技能激活与后台调度仍需各自授权和实际宿主支持。

通用选项见 koder help。
```

## resources

```text
koder resources  资料库：远程按需检索，或导入自己的私有合集
别名: 资料, 资源库

用法
  koder resources status | import <zip> [--model-access] | search <query> | read <id> | export <id> --out <file> | allow-model <collection-id> --confirm MODEL | disable <collection-id> | remove <collection-id>

远程默认关闭；--remote 授权本次命令，KODER_REMOTE_RESOURCES=1 才向 Agent 提供远程工具；仅发送简短检索词和资源编号，不预装整库。KODER_REMOTE_RESOURCES=0 可关闭，--remote 显式选择远程。自己导入的合集默认仅本地保存；--model-access 允许本机对话模型按需检索并接收片段。资料加密、不同步、不公开、不自动安装或运行脚本。视频和未完成下载不作为文本。remove 只移除目录关联，保留加密对象与原始 ZIP。旧 DOC 在 macOS 可读，其它系统需先转 DOCX；扫描 PDF 需 OCR。

通用选项见 koder help。
```

## business

```text
koder business  公司商业授权与专用私有仓库洽询
别名: 商业授权, 企业服务

用法
  koder business

个人非商业使用免费；商用与组织部署另需书面授权。通过 info@karmenloop.com 洽询交付范围，不自动发送邮件或创建仓库。

通用选项见 koder help。
```

## star

```text
koder star  自愿为 Koder 点一颗 GitHub Star
别名: 点星

用法
  koder star

仅显示官方仓库链接，完全自愿，不弹出浏览器、不阻塞工作、不影响已授权功能。

通用选项见 koder help。
```

## privacy

```text
koder privacy  离线查看完整消费者隐私条款与声明
别名: 隐私

用法
  koder privacy [consumer|statement|desktop|agreement|sources]

CLI 专用条款及官网原始全文全部随包提供；不需要模型或先接受许可。

通用选项见 koder help。
```

## feedback

```text
koder feedback  官方反馈邮箱与空白模板
别名: 反馈, 投诉

用法
  koder feedback

info@karmenloop.com；不自动发送或附加历史，请先移除密钥与私人资料。

通用选项见 koder help。
```

## celebrate

```text
koder celebrate  可跳过的六秒彩蛋、节日与生日设置
别名: 彩蛋

用法
  koder celebrate [menu|code|confetti|fireworks|christmas|halloween|national|new-year|birthday|status]

任意键跳过。auto off|notice|on 控制自动提示；birthday --date MM-DD 单独确认；music on|off|play 与 locale --language zh|en|auto / --ip 分别选择。脚本和 JSON 输出不播放动画。

通用选项见 koder help。
```

## eula

```text
koder eula  查看使用许可、授权与数据说明，或明确接受许可

用法
  koder eula [accept]

eula 可在接受前查看；accept 只接受当前使用许可，不代开学习、同步、应用或电脑权限。安装包内 EULA.md 为使用许可；ACCEPTANCE.md 为功能与授权说明。

通用选项见 koder help。
```

## account

```text
koder account status [--json]
koder login [--qr] [--no-open] [--reauth]
koder logout
koder account memory login|status|logout [--server <地址>]
```

前三项管理 KARMEN 任务登录。`account memory` 保留独立的共享记忆账号流程，需要兼容的已部署服务；它不代替 KARMEN 登录。退出共享记忆只停止此设备，不删除服务器副本。`koder memory forget` 删除当前共享空间，离线设备同步时应用。模型 Key 与电脑权限不属于记忆同步。详情见[账号登录教程](ACCOUNT-LOGIN.zh.md)。

## prompts

```text
koder prompts  根据对话预选下一句，也可使用常用模板
别名: prefill, 预填词, 预填

用法
  koder prompts list | show <id> | choose | add <id> --title <title> --text <text> | update <id> --title <title> --text <text> | remove <id>

在空输入框按 / 立即展开预输入菜单；方向键或 PgUp/PgDn 浏览，继续键入可筛选，Tab 只填入可编辑草稿，Esc 关闭；已有的斜杠命令和粘贴输入继续可用。回复后按当前对话给出可选下一句，/prefill 1–3 填入本轮建议，/prefill 打开选择器；/suggest clear 清除，/suggest off 关闭，/suggest on 重新开启。/prefill fix 等填入常用模板。模板只作为草稿，编辑后由你按回车发送；有输入或排队消息时不覆盖。支持中英文内置模板和本机自定义模板；不自动提交、不修改系统提示词、不代替审批。

例子
  koder prompts list
    查看常用预填词

通用选项见 koder help。
```

## skills

```text
koder skills  发现、导入并调用 Codex、Cursor 和 WorkBuddy 兼容技能
别名: skill, 技能

用法
  koder skills list | catalog | doctor <name> | prepare <name> | show <id> [--path <file>] | import <folder-or-zip> | enable|disable <id>

读取项目和用户的 .agents/skills、.codex/skills、.cursor/skills、.codebuddy/skills，以及 Koder 的技能目录。SKILL.md、references、scripts、templates 与原始许可保留。导入不执行脚本、不安装依赖；运行仍受原工具与审批约束。用 --skill name 或在任务中写 $name 显式选择；同名用完整 id。/skills list 和 /skill name 可在当前会话使用。

例子
  koder skills list
    列出可手动调用的技能
  koder run "Review the module" --skill review
    指定技能处理任务

通用选项见 koder help。
```

## reverse

```text
koder reverse  Koder 自研静态逆向引擎（预览）

用法
  koder reverse status | tools | enable | disable | inspect/strings/symbols/disassemble/graph/query <file> | diff <file> <other>

当前项目内静态分析：PE、ELF、Mach-O、WASM 元数据，JavaScript 词法候选，ARM64 部分指令与保守控制流。不会执行目标。尚未具备完整反编译和 REA 全量替换资格。/reverse 在当前对话使用；enable 后可通过 Agent 的 app_tools/app_call 按原流程授权。

例子
  koder reverse inspect sample.exe --json
    查看文件结构与实际覆盖

通用选项见 koder help。
```

## rea

```text
koder rea  内置 REA 逆向分析工具
别名: 逆向

用法
  koder rea [status|verify|enable|disable|tools|help]

在当前项目启用后，通过 Agent 按需调用并经过原审批；无需 npx。外部反编译器等依赖按实际操作核验。

例子
  koder rea enable
    为当前项目启用

通用选项见 koder help。
```

## apps

```text
koder apps  应用连接与状态
别名: 应用

用法
  koder apps [list|status|connect <id>|disconnect <id>] [--key-env <variable>]

与桌面和 Agent 共用本机连接。Gamma API 与官方 MCP 授权条件分别显示；聊天软件继续使用 koder connect。第三方可接收经连接提交的数据并收取费用。disconnect 停止本机使用；服务端授权需在服务方撤销。

选项
  --key-env <variable>          读取 Gamma API Key 的环境变量
  --api-key                     在交互界面输入 API Key
  --oauth                       按服务支持发起浏览器授权
  --mcp                         使用 Gamma MCP 授权路径

例子
  koder apps
    查看连接

通用选项见 koder help。
```

## mcp

```text
koder mcp  添加、导入和验证 MCP

用法
  koder mcp presets|doctor <preset>|list/add/import/login/tools/test/enable/disable/remove/resources/prompts/read/prompt [<id>] [<uri|name>] [--params <JSON>]

add/import 默认不启用，也不执行命令或安装依赖。Windows-MCP 只在原生 Windows 启动；CodeGraphContext 绑定当前工作区和独立运行配置。presets/doctor 不打开连接宿主；doctor 只检查启动程序存在，不证明 Python 或实际工具可用。enable 明确启动；test 只握手与发现，不调用写入工具。不需要配置模型或登录 Koder。Linux 连接宿主需要 secret-tool、DBus 与已解锁的 Secret Service。

选项
  --preset windows-mcp|codegraph [--runner bundled|installed|uvx] 配置可选版本化预设，默认不启动
  --command <program> --arg <value> 本地 stdio 服务，不自动安装
  --url <url>                   远程 Streamable HTTP
  --bearer-env <variable>       从环境变量读取凭据

例子
  koder mcp import servers.json
    导入后审阅，再 enable
  koder mcp test <id>
    验证连接与工具列表

通用选项见 koder help。
```

## permissions

```text
koder permissions  智能审批、始终允许、全面开放与电脑授权
别名: 权限

用法
  koder permissions execution status|auto|ask|full|deny|revoke|reset [--scope workspace|profile] | status|request|repair|revoke

execution 默认智能判断；敏感操作可选择始终允许；full --confirm FULL 保存全面开放，默认仅本项目，--scope profile 用于全部工作区；revoke/reset 可撤销。status 展示实际宿主、授权根和系统检查。request 由本机用户交互授权；--yes 不授予系统或电脑范围权限。repair 只执行已支持的修复入口。revoke 撤销后续电脑工具授权，不恢复已改文件或撤销系统设置中的权限。完整工作模式覆盖所选可见磁盘根，仍受系统权限限制。

例子
  koder permissions request --home
    授权当前用户主目录的文件工作

通用选项见 koder help。
```

## chat

```text
koder chat  进入交互对话（直接输入 koder 即可）
别名: 对话

用法
  koder [chat]

打开开屏后进入对话。直接输入任务，Koder 会读文件、提出修改和命令，默认自动处理低风险检查与普通项目修改，敏感操作询问并可选择始终允许。斜杠命令可以随时切换语言、模式和自动确认。

例子
  koder
    进入对话
  koder -w ~/code/app
    在指定工程里对话

通用选项见 koder help。
```

## run

```text
koder run  执行任务：智能审批、可保存许可
别名: 运行, 做

用法
  koder run <任务>   或   koder "<任务>"

一次性跑完一轮代理。有任务文字时加 --stdin 才附加管道内容；无任务文字时自动读取，等待有时限。默认智能判断；未授权的敏感操作在无交互终端时拒绝。--approval ask 强制使用询问模式，deny 拒绝所有执行操作。

例子
  koder run "把 utils.js 里的 var 改成 const"
    临时修复
  npm test 2>&1 | koder run "根据这段失败输出修好测试"
    用管道交给 Koder
  koder run --yes --json "补上 README 的安装说明"
    脚本里自动执行并输出 JSON

通用选项见 koder help。
```

## ask

```text
koder ask  只读提问：不改文件、不跑命令
别名: 提问, 问

用法
  koder ask <问题>

Koder 只能列目录、读文件和搜索，适合理解代码、快速答疑。

例子
  koder ask "登录流程从哪个文件开始？"
    理解代码
  git diff | koder ask "这段改动有什么风险？"
    配合管道

通用选项见 koder help。
```

## review

```text
koder review  上下文感知的代码审查，可直接修复
别名: 审查, 评审

用法
  koder review [--base <分支>] [--staged] [--format text|markdown|json|github] [--fix]

Koder 会收集改动、仓库结构、AGENTS.md 等规则文件、最近提交，以及被改动符号在其他文件里的引用，再让模型带着只读工具核实后给出问题。每条问题都有文件、行号、级别和修改建议。

选项
  --base <ref>                  和这个分支比较（取共同祖先），默认自动找 main/master
  --staged                      只审查已暂存的改动
  --commit <sha>                审查某一个提交
  --files <a,b>                 只看这些路径
  --format <格式>               text、markdown、json、github（输出 Actions 注释）
  --out <文件>                  同时把结果写入文件
  --fail-on <级别>              出现 high、medium 或 low 及以上问题时退出码为 1
  --focus <说明>                额外关注点，例如 PR 评论里的要求
  --fix                         审查后让 Koder 按问题修复（按审批设置或 --yes）
  --check <命令>                修复后运行的检查命令

例子
  koder review
    审查当前未提交的改动；没有就审查当前分支
  koder review --base origin/main --format markdown --out review.md
    生成 PR 评论
  koder review --fix --check "npm test"
    审查、修复、再跑测试

通用选项见 koder help。
```

## fix

```text
koder fix  运行检查，失败就修，修完再查
别名: 修复

用法
  koder fix [描述] --check <命令> [--attempts 3]

检查失败时，把失败输出交给 Koder 修复，然后重新检查，直到通过或用完次数。退出码反映最后一次检查。

选项
  --check <命令>                检查命令，例如 npm test、pytest、go test ./...
  --attempts <次数>             最多修几次，默认 3
  --timeout <秒>                检查命令超时，默认 600

例子
  koder fix --check "npm test"
    修到测试通过
  koder fix "首页按钮点击没反应"
    按描述修复

通用选项见 koder help。
```

## test

```text
koder test  为改动或指定文件生成测试
别名: 测试, 补测试

用法
  koder test [文件...] [--base <分支>] [--check <命令>]

Koder 先读现有测试，沿用同样的框架、目录和写法，再补测试。

选项
  --base <ref>                  取这个分支以来改动的文件
  --check <命令>                写完测试后运行，失败会继续修

例子
  koder test src/price.js --check "npm test"
    给一个文件补测试
  koder test --base main
    给本分支改过的文件补测试

通用选项见 koder help。
```

## flow

```text
koder flow  按流程文件编排多个智能体与检查步骤
别名: 流程, 编排

用法
  koder flow init [名称] | koder flow run <文件> | koder flow list

流程文件是 JSON，步骤类型有 shell、run、ask、review、fix、test。可以用 when 写条件（例如 unit.failed），用 {{步骤.output}} 引用前面的输出，用 parallel 并行跑只读步骤。approve 设为 auto 时自动确认，适合 CI。

例子
  koder flow init pr-gate
    生成示例流程 .koder/flows/pr-gate.json
  koder flow run .koder/flows/pr-gate.json
    运行流程

通用选项见 koder help。
```

## ci

```text
koder ci  生成 GitHub Actions 工作流，处理 /koder 评论
别名: 流水线

用法
  koder ci init [--force] | koder ci comment [--event <文件>]

ci init 写入 .github/workflows/koder.yml：PR 打开或更新时自动审查并评论；在 PR 里评论 /koder review、/koder fix、/koder test、/koder ask <问题> 会触发对应动作。修改类指令只接受仓库成员。

例子
  koder ci init
    生成工作流
  koder ci comment --event event.json
    本地模拟一条评论事件

通用选项见 koder help。
```

## acp

```text
koder acp  通过 ACP 协议在标准输入输出上提供 Koder
别名: 协议

用法
  koder acp

编辑器（Zed、Neovim、Emacs）用 ACP 启动 koder acp，就能在编辑器里对话、看差异、批准修改。

例子
  koder editor nvim
    查看 Neovim 配置写法

通用选项见 koder help。
```

## editor

```text
koder editor  显示 Zed、Neovim、Emacs 的接入配置
别名: 编辑器

用法
  koder editor [zed|nvim|emacs] [--os powershell|cmd|mac|linux]

选项
  --os <系统>                   按另一个系统给出配置文件位置；Windows 上命令写成 koder.cmd

例子
  koder editor emacs
    Emacs 配置
  koder editor zed --os powershell
    Windows 上的 Zed 配置

通用选项见 koder help。
```

## scan

```text
koder scan  扫描本机 Koder、Codex、Claude Code、Cursor 的项目与任务
别名: 扫描

用法
  koder scan [--tool koder|codex|claude|cursor] [--days 30] [--limit 20] [--no-titles] [--json]

只读取各工具在本机会话记录里的工作目录、时间和标题：Codex 的会话首行与标题索引，Claude Code 的 projects 记录，Cursor 的对话记录首条消息。不读取账号、密钥或数据库，不解密 Koder 的加密记录，也不上传任何内容。扫描后可以选一个项目，让 Koder 审查改动、修复检查，或结合最近的任务先列出现在最值得做的事。

选项
  --tool <名称>                 只看某个工具，可写多次
  --days <天数>                 只看最近多少天，默认 30；0 表示全部
  --limit <数量>                最多列多少个项目，默认 20
  --no-titles                   不显示任务标题
  --all                         也列出找不到工作目录的会话

例子
  koder scan
    扫描并选择项目
  koder scan --tool codex --tool cursor --days 7
    只看最近一周的 Codex 和 Cursor
  koder scan --json --no-titles
    给脚本用

通用选项见 koder help。
```

## moa

```text
koder moa  Mixture of Agents：多个模型先给意见，当前模型汇总执行
别名: 混合

用法
  koder moa set [名称] --refs <模型,模型> [--aggregator <模型>] [--fanout user_turn|every_step] | use <名称> | show | run <任务>

参照 Hermes 的 MoA：参考模型不带工具，只看对话文字给建议；汇总模型把建议当私有参考，照常决定回答或调用工具，修改和命令遵守本机审批设置。部分参考失败会注明，全部失败就由汇总模型自己判断。

选项
  --refs <a,b>                  参考模型（先用 koder model add 登记）
  --aggregator <模型>           汇总模型，默认当前模型
  --fanout <节奏>               user_turn：每个用户回合问一次（默认，省钱）；every_step：每步都问
  --privacy <模式>              display：显示时隐去邮箱、电话、密钥；full：交给汇总模型前也隐去；off

例子
  koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY
    登记参考模型
  koder moa set --refs kimi,qwen
    建默认预设
  koder --moa "重构支付模块并补测试"
    用 MoA 跑一个任务

通用选项见 koder help。
```

## connect

```text
koder connect  连接聊天应用并启动收发消息
别名: 连接

用法
  koder connect [<平台>] [--qr | --manual] [--no-start | --foreground]

不带平台时可选择应用。微信、飞书、企业微信默认扫码；也可以手动填写已有机器人的凭据。连接成功后自动在后台收消息。陌生人仍需配对，执行文件修改和命令仍需确认。更多控制见 koder gateway help。

选项
  --qr                          微信、飞书、企业微信扫码连接
  --manual                      手动填写已有机器人的凭据
  --no-start                    只保存和校验，暂不启动网关
  --foreground                  在当前终端运行网关

例子
  koder connect weixin
    微信扫码连接
  koder connect feishu
    飞书扫码连接
  koder connect wecom
    企业微信扫码连接

通用选项见 koder help。
```

## gateway

```text
koder gateway  一键接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord、WhatsApp
别名: 网关, 接入

用法
  koder gateway connect [<平台>] | setup [<平台>] | doctor <平台> | start [--background] | status | stop | pair <配对码> | policy <平台> --dm … --group … | list

每个平台一条命令接入：按提示填写后台给的凭据，Koder 会在线校验；微信直接扫码。飞书、企业微信、钉钉、Slack、Discord 用长连接，不需要公网地址；WhatsApp 官方接口需要把本地端口通过隧道暴露。陌生人私聊会收到配对码，你在电脑上 koder gateway pair 之后才能使用；修改文件和运行命令前会在聊天里问你，回复「允许」才执行。

选项
  --set <键=值>                 非交互地填写接入信息，可写多次
  --background                  后台运行网关
  --platform <a,b>              只启动这些平台
  --qr / --manual               扫码连接或手动填写已有机器人凭据
  --no-start                    连接时只保存和校验配置
  --dm <策略>                   私聊：pairing（默认，需配对）、allowlist、open、disabled
  --group <策略>                群聊：disabled（默认）、allowlist、open；群里要 @ 机器人

例子
  koder connect feishu
    扫码连接飞书并开始收消息
  koder connect weixin
    扫码连接微信并开始收消息
  koder gateway doctor wecom
    检查企业微信凭据和连接
  koder gateway start --background
    后台收消息
  koder gateway pair K7Q2MX
    同意一位用户

通用选项见 koder help。
```

## setup

```text
koder setup  设置界面：方向键或鼠标就能配好全部选项
别名: 设置, 配置, settings, config

用法
  koder setup

全屏菜单：语言、模型（选服务商、选型号、粘贴密钥，也能直接打开拿密钥的网页）、官网深浅配色、开屏样式和动画、引擎、聊天软件、编辑器配置（一键复制）、互动教程、体检、上下文与输出、记忆与灵魂、电脑授权与撤销、应用/MCP，以及使用许可和授权说明。↑↓ 或 Tab 移动，回车确定，Esc 返回，数字直达，列表里直接打字可以筛选；终端支持鼠标时点一下就选中，滚轮翻页。每一项改完立刻保存。第一次进入 koder 且还没配模型时会自动打开，对话里输入 /menu、菜单 或 /setup，也能直接输入 koder setup；彩蛋用 /celebrate 或 彩蛋菜单。Esc 返回当前对话。

例子
  koder setup
    打开设置界面
  koder 设置
    中文命令也行

通用选项见 koder help。
```

## onboard

```text
koder onboard  同 koder setup，安装脚本装完会自动打开
别名: 向导, 初始化

用法
  koder onboard

通用选项见 koder help。
```

## engine

```text
koder engine  切换引擎：内置 Koder 内核或 Python 版 Hermes（ACP）
别名: 引擎

用法
  koder engine list | install hermes | use <koder|hermes|名称> | test <名称> | add <名称> --command <命令> [--args "acp"]

默认引擎是内置的 Node 版 Koder 内核。install hermes 会调用 Hermes 官方安装脚本（固定到核对过的提交）；之后 run、ask、对话、审查和网关都可以交给 Hermes，批准请求仍由 Koder 的确认界面处理。任何支持 ACP 的智能体都能用 add 接进来。

例子
  koder engine install hermes
    安装 Hermes 引擎
  koder engine use hermes
    切到 Hermes

通用选项见 koder help。
```

## update

```text
koder update  更新到最新版
别名: 更新

用法
  koder update [--check] | koder update auto on|off|status

从 GitHub 检查并安装当前发布版本；--check 只检查。交互会话空闲后可自动更新，auto off 关闭。校验安装器和安装包，保留配置与记忆，不自动降级；许可变化需重新阅读。预览版会明确标注。

通用选项见 koder help。
```

## uninstall

```text
koder uninstall  卸载 Koder CLI（--purge 同时删除配置）
别名: 卸载

用法
  koder uninstall [--purge]

通用选项见 koder help。
```

## memory

```text
koder memory  查看、检索和管理本地与共享记忆
别名: 记忆

用法
  koder memory status | sync | personalization status | reflection run | show | search <内容> | add <记忆> | remove <id> | clear | forget | learning on|off | daily-state on|off | evolution on|off | proactive on|off | profile show|remember|identity|forget | soul show|preview|save|rollback

同一工作目录和会话自动衔接历史。--session <名称> 可分开任务，--new 开始新会话，--no-memory 停用本次自动保存与恢复。clear 开始新会话并保留明确记忆；登录共享账号时，forget 会忘记当前共享空间；离线设备需再次同步才应用。learning、daily-state、evolution、proactive 分别可用 on/off/status，默认关闭；关闭不删除历史。profile forget 需要记录ID。详见 koder eula 和教程17–22。

通用选项见 koder help。
```

## context

```text
koder context  上下文窗口与自动压缩设置

用法
  koder context status|set|on|off|reset [name] [--json]

默认开启自动压缩，触发 80%、目标 60%、优先保留最近 4 轮。占用为输入、工具和输出预留的估算。on/off/reset 只修改压缩偏好，reset 保留模型窗口、凭据和 Headroom。关闭压缩后，超窗请求报告 CONTEXT_BUDGET_EXCEEDED。也可用 /context 或 Setup → 上下文与输出；无需模型即可设置压缩。环境变量模型的窗口请修改 KODER_CONTEXT_WINDOW / KODER_MAX_OUTPUT。

选项
  --context-window <tokens>     当前模型或指定已保存模型的窗口
  --max-output <tokens>         输出上限，也占用模型窗口
  --trigger-percent <1–99>      自动压缩触发占比，必须大于目标占比
  --target-percent <1–99>       压缩目标占比，必须小于触发占比
  --keep-turns <0–100>          优先保留近期轮次；仍受模型窗口限制

例子
  koder context set --trigger-percent 85 --target-percent 60 --keep-turns 6
    调整自动压缩偏好
  koder context set work --context-window 128000 --max-output 8192
    修改已保存的 work 模型窗口

通用选项见 koder help。
```

## model

```text
koder model  配置模型与真实上下文窗口
别名: 模型

用法
  koder model show [名称] | test [名称] | context [名称] | models | refresh [名称] | catalog-refresh | presets | set | add <名称> | list | use <名称> | remove <名称> | clear

配置保存在 ~/.koder-cli/provider.json，权限 600。直接粘贴的密钥是明文保存的，推荐改用 --key-env。CI 里可以只设 KODER_MODEL、KODER_BASE_URL、KODER_API_KEY 环境变量。

选项
  --preset <id>                 用 Koder 预设，例如 deepseek、kimi、qwen、claude、chatgpt、local
  --base-url <地址>             兼容接口地址
  --model <型号>                型号名
  --protocol openai|anthropic   接口协议
  --key-env <变量名>            从环境变量读密钥（推荐，配置里只存变量名）
  --key-stdin                   从标准输入读密钥
  --context-window <tokens>     服务商实际支持的上下文窗口
  --max-output <tokens>         每次输出上限，也计入上下文窗口

例子
  koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
    用 DeepSeek
  koder model set --preset local --model qwen3:8b
    用本机 Ollama
  koder model context --context-window 1048576 --max-output 8192
    仅调整窗口与输出，保留当前模型和密钥

通用选项见 koder help。
```

## lang

```text
koder lang  切换中文或英文
别名: 语言

用法
  koder lang [zh|en]

例子
  koder lang en
    切换为英文
  koder lang zh
    切换回中文

通用选项见 koder help。
```

## theme

```text
koder theme  切换官网深色或浅色配色
别名: 主题

用法
  koder theme [auto|dark|light]

颜色取自官网样式表：深色舞台 #12141c、文字 #ededeb、强调蓝 #7ca6ff；浅色舞台 #e4e1d8、文字 #1d1c1a、强调蓝 #2455d3。auto 会根据终端的 COLORFGBG 判断，判断不了时按深色。

例子
  koder theme light
    浅色终端用
  koder theme auto
    恢复自动判断

通用选项见 koder help。
```

## help

```text
koder help  查看命令说明
别名: 帮助

用法
  koder help [命令]

例子
  koder help review
    看 review 的全部参数

通用选项见 koder help。
```

## learn

```text
koder learn  1800 课互动教程：在练习场里边学边动手
别名: 教程, 教学

用法
  koder learn [课号] [--print] [--track hands-on|developer|all|overview] [--os powershell|cmd|mac|linux]

教练会在临时目录里建一个练习场，用写好台词的教练模型带你真实地走一遍：看差异、批准或拒绝修改、确认命令、做选择、斜杠命令、审查、修复循环、流程编排、MoA、聊天软件、编辑器、扫描和安装，并新增使用许可、电脑权限、共享记忆、学习与灵魂、应用/MCP、API与上下文排障。旧版已毕业用户从新增第17课续学。内置教练不需要配置模型，也不调用付费 API。扩展手把手和开发者作业按说明自行执行，真实模型与外部账号可能计费。每个系统一套教程：PowerShell、CMD、macOS、Linux 的环境变量、管道、退出码、复制粘贴、危险命令、安装和配置文件位置都按各自的写法来讲；第一课会告诉你识别到的是哪套，也可以换。回车下一步，b 回上一课，q 退出，进度会记住。没有终端时自动输出文字版。

选项
  --print                       不进入互动，直接输出完整的文字版教程
  --track <路线>                hands-on 手把手；developer 开发者；all 全部；overview 原教练速览。互动默认 hands-on，文字默认 all
  --os <系统>                   按哪个系统讲：powershell、cmd、mac、linux；默认自动识别

例子
  koder learn
    从头开始（或接着上次）
  koder learn 4
    直接跳到第 4 课
  koder learn --print --os cmd
    输出 CMD 版的文字教程

通用选项见 koder help。
```

## doctor

```text
koder doctor  检查环境、模型和启动耗时
别名: 体检

用法
  koder doctor [--api] [--computer]

默认检查本机配置；--api 会实际请求当前模型，可能产生少量 API 用量。也可运行 koder model test。

通用选项见 koder help。
```

## banner

```text
koder banner  显示折光体开屏
别名: 开屏

用法
  koder banner [--ascii] [--no-anim]

通用选项见 koder help。
```

## version

```text
koder version  显示版本，以及官网更新页
别名: 版本

用法
  koder version

通用选项见 koder help。
```

## about

```text
koder about  按官网介绍 Koder 是谁做的，并给出更新页
别名: 关于, 官网

用法
  koder about

内容与官网关于我们、更新页、下载页一致：KARMEN LOOP 自己编写，内核名叫 KARMEN LOOP。对话里问“这工具是谁开发的”也会给出同一段介绍。

通用选项见 koder help。
```


## 旧会话卡住与人工核对（0.5.19）

在聊天输入 `/reconcile` 查看；实际核对后输入 `/reconcile checked <调用编号>`。该命令保留原 UNKNOWN，不重放，也不代替后续审批。整行 `ESC`/`Escape` 可取消，空闲时不会启动模型。详细步骤见[会话恢复教程](SESSION-RECOVERY.zh.md)。

## KARMEN 账号登录 · 0.6.2

```text
koder login
koder login --qr --no-open
koder account status --json
koder logout
koder login --reauth
```

在官方账号网页核对并批准设备后，返回原终端继续。Setup 和聊天内的 `/login`、`/logout` 共用此流程。无头任务需要已有受保护会话，`--yes` 不能代替登录。共享记忆的独立登录保留在 `koder account memory ...`，不能代替 KARMEN 任务登录。[设置、取消与恢复教程](ACCOUNT-LOGIN.zh.md)。
