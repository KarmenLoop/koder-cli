import { RESET, displayWidth, fg, gradientText } from "./color.mjs";
import { theme } from "./theme.mjs";

const L = (zh, en) => ({ zh, en });

const PLACEHOLDERS = {
  "<目录>": "<dir>", "<格式>": "<format>", "<文件>": "<file>", "<级别>": "<level>", "<说明>": "<text>",
  "<命令>": "<cmd>", "<次数>": "<n>", "<秒>": "<sec>", "<名称>": "<name>", "<天数>": "<days>", "<数量>": "<n>",
  "<地址>": "<url>", "<型号>": "<model>", "<变量名>": "<NAME>", "<分支>": "<ref>", "<任务>": "<task>",
  "<问题>": "<question>", "<模式>": "<mode>", "<步骤号>": "<step>", "<命令名>": "<command>",
  "[描述]": "[description]", "[文件...]": "[files...]", "[名称]": "[name]", "[步骤号]": "[step]", "[命令]": "[command]",
  "[选项]": "[options]", "   或   ": "   or   ",
  "<模型,模型>": "<model,model>", "<模型>": "<model>", "<平台>": "<platform>", "<配对码>": "<code>", "<策略>": "<policy>",
  "<键=值>": "<key=value>", "<节奏>": "<fanout>", "|名称>": "|name>",
};

function localize(text, lang) {
  if (lang === "zh") return text;
  let out = text;
  for (const [zh, en] of Object.entries(PLACEHOLDERS)) out = out.split(zh).join(en);
  return out;
}

function pad(text, width) {
  return text + " ".repeat(Math.max(1, width - displayWidth(text)));
}

export const GLOBAL_OPTIONS = [
  ["-w, --workspace <目录>", L("工作区，默认当前目录", "Workspace folder, default: current directory")],
  ["-y, --yes", L("自动接受文件修改和命令；仍不回答提问、不收集密码", "Auto-accept edits and commands; never answers questions or collects passwords")],
  ["--json", L("每行输出一个 JSON 事件，方便脚本解析", "One JSON event per line, for scripts")],
  ["--lang zh|en", L("这一次用中文或英文", "Use Chinese or English for this run")],
  ["--mode <模式>", L("standard、code、minimal、plan、execute、report、enhance", "standard, code, minimal, plan, execute, report, enhance")],
  ["--provider <文件>", L("临时使用另一份模型 JSON", "Use another model JSON for this run")],
  ["--moa", L("这一次用 MoA：参考模型先给意见，当前模型汇总执行", "Use MoA for this run: references advise, the current model acts")],
  ["--engine <名称>", L("这一次换引擎：koder（默认）、hermes 或自己添加的 ACP 智能体", "Engine for this run: koder (default), hermes or an added ACP agent")],
  ["--no-color", L("关闭颜色", "Disable colors")],
  ["-h, --help", L("显示该命令的说明", "Show help for the command")],
];

export const COMMANDS = [
  {
    name: "chat", aliases: ["对话"], group: "start",
    summary: L("进入交互对话（直接输入 koder 即可）", "Interactive session (just type koder)"),
    usage: "koder [chat]",
    detail: L(
      "打开开屏后进入对话。直接输入任务，Koder 会读文件、提出修改和命令，每一步都先让你确认。斜杠命令可以随时切换语言、模式和自动确认。",
      "Shows the banner and opens a session. Type a task; Koder reads files and proposes edits and commands, asking before each one. Slash commands switch language, mode and auto-approve.",
    ),
    examples: [
      ["koder", L("进入对话", "Start a session")],
      ["koder -w ~/code/app", L("在指定工程里对话", "Chat inside another project")],
    ],
  },
  {
    name: "run", aliases: ["运行", "做"], group: "start",
    summary: L("执行一个任务：可改文件、跑命令（需确认）", "Run a task with edits and commands (with approval)"),
    usage: "koder run <任务>   或   koder \"<任务>\"",
    detail: L(
      "一次性跑完一轮代理。管道输入会作为附加材料交给 Koder。在终端里会逐项询问；脚本里没有 --yes 时，修改和命令一律拒绝。",
      "Runs one agent turn. Piped stdin is attached as extra material. In a terminal each step is confirmed; in scripts without --yes every edit and command is rejected.",
    ),
    examples: [
      ["koder run \"把 utils.js 里的 var 改成 const\"", L("临时修复", "Quick fix")],
      ["npm test 2>&1 | koder run \"根据这段失败输出修好测试\"", L("用管道交给 Koder", "Pipe output into Koder")],
      ["koder run --yes --json \"补上 README 的安装说明\"", L("脚本里自动执行并输出 JSON", "Automate in a script with JSON output")],
    ],
  },
  {
    name: "ask", aliases: ["提问", "问"], group: "start",
    summary: L("只读提问：不改文件、不跑命令", "Read-only question: no edits, no commands"),
    usage: "koder ask <问题>",
    detail: L("Koder 只能列目录、读文件和搜索，适合理解代码、快速答疑。", "Koder may only list, read and search. Good for understanding code."),
    examples: [
      ["koder ask \"登录流程从哪个文件开始？\"", L("理解代码", "Understand code")],
      ["git diff | koder ask \"这段改动有什么风险？\"", L("配合管道", "With a pipe")],
    ],
  },
  {
    name: "review", aliases: ["审查", "评审"], group: "quality",
    summary: L("上下文感知的代码审查，可直接修复", "Context-aware code review, with optional fix"),
    usage: "koder review [--base <分支>] [--staged] [--format text|markdown|json|github] [--fix]",
    flags: [
      ["--base <ref>", L("和这个分支比较（取共同祖先），默认自动找 main/master", "Compare against this ref (merge base); default: main/master")],
      ["--staged", L("只审查已暂存的改动", "Review staged changes only")],
      ["--commit <sha>", L("审查某一个提交", "Review a single commit")],
      ["--files <a,b>", L("只看这些路径", "Limit to these paths")],
      ["--format <格式>", L("text、markdown、json、github（输出 Actions 注释）", "text, markdown, json, github (Actions annotations)")],
      ["--out <文件>", L("同时把结果写入文件", "Also write the result to a file")],
      ["--fail-on <级别>", L("出现 high、medium 或 low 及以上问题时退出码为 1", "Exit 1 when findings reach high, medium or low")],
      ["--focus <说明>", L("额外关注点，例如 PR 评论里的要求", "Extra focus, e.g. from a PR comment")],
      ["--fix", L("审查后让 Koder 按问题修复（逐项确认或 --yes）", "Fix the findings afterwards (confirm each, or --yes)")],
      ["--check <命令>", L("修复后运行的检查命令", "Check command to run after fixing")],
    ],
    detail: L(
      "Koder 会收集改动、仓库结构、AGENTS.md 等规则文件、最近提交，以及被改动符号在其他文件里的引用，再让模型带着只读工具核实后给出问题。每条问题都有文件、行号、级别和修改建议。",
      "Koder gathers the diff, repo layout, rule files such as AGENTS.md, recent commits and where changed symbols are used, then lets the model verify with read-only tools. Each finding has file, line, severity and a suggestion.",
    ),
    examples: [
      ["koder review", L("审查当前未提交的改动；没有就审查当前分支", "Review uncommitted changes, else the current branch")],
      ["koder review --base origin/main --format markdown --out review.md", L("生成 PR 评论", "Produce a PR comment")],
      ["koder review --fix --check \"npm test\"", L("审查、修复、再跑测试", "Review, fix, then test")],
    ],
  },
  {
    name: "fix", aliases: ["修复"], group: "quality",
    summary: L("运行检查，失败就修，修完再查", "Run a check, fix failures, re-check"),
    usage: "koder fix [描述] --check <命令> [--attempts 3]",
    flags: [
      ["--check <命令>", L("检查命令，例如 npm test、pytest、go test ./...", "Check command, e.g. npm test, pytest, go test ./...")],
      ["--attempts <次数>", L("最多修几次，默认 3", "Maximum fix attempts, default 3")],
      ["--timeout <秒>", L("检查命令超时，默认 600", "Check timeout in seconds, default 600")],
    ],
    detail: L("检查失败时，把失败输出交给 Koder 修复，然后重新检查，直到通过或用完次数。退出码反映最后一次检查。", "On failure the output goes to Koder, which fixes and re-checks until it passes or attempts run out. The exit code reflects the last check."),
    examples: [
      ["koder fix --check \"npm test\"", L("修到测试通过", "Fix until tests pass")],
      ["koder fix \"首页按钮点击没反应\"", L("按描述修复", "Fix from a description")],
    ],
  },
  {
    name: "test", aliases: ["测试", "补测试"], group: "quality",
    summary: L("为改动或指定文件生成测试", "Generate tests for changed or given files"),
    usage: "koder test [文件...] [--base <分支>] [--check <命令>]",
    flags: [
      ["--base <ref>", L("取这个分支以来改动的文件", "Use files changed since this ref")],
      ["--check <命令>", L("写完测试后运行，失败会继续修", "Run after writing tests; failures are fixed")],
    ],
    detail: L("Koder 先读现有测试，沿用同样的框架、目录和写法，再补测试。", "Koder reads existing tests first and follows the same framework, folders and style."),
    examples: [
      ["koder test src/price.js --check \"npm test\"", L("给一个文件补测试", "Test one file")],
      ["koder test --base main", L("给本分支改过的文件补测试", "Test files changed on this branch")],
    ],
  },
  {
    name: "flow", aliases: ["流程", "编排"], group: "automate",
    summary: L("按流程文件编排多个智能体与检查步骤", "Orchestrate agent and check steps from a flow file"),
    usage: "koder flow init [名称] | koder flow run <文件> | koder flow list",
    detail: L(
      "流程文件是 JSON，步骤类型有 shell、run、ask、review、fix、test。可以用 when 写条件（例如 unit.failed），用 {{步骤.output}} 引用前面的输出，用 parallel 并行跑只读步骤。approve 设为 auto 时自动确认，适合 CI。",
      "A flow is JSON with steps of type shell, run, ask, review, fix, test. Use when for conditions (e.g. unit.failed), {{step.output}} to reuse output and parallel for read-only steps. approve: auto confirms automatically for CI.",
    ),
    examples: [
      ["koder flow init pr-gate", L("生成示例流程 .koder/flows/pr-gate.json", "Create .koder/flows/pr-gate.json")],
      ["koder flow run .koder/flows/pr-gate.json", L("运行流程", "Run it")],
    ],
  },
  {
    name: "ci", aliases: ["流水线"], group: "automate",
    summary: L("生成 GitHub Actions 工作流，处理 /koder 评论", "GitHub Actions workflow and /koder comment triggers"),
    usage: "koder ci init [--force] | koder ci comment [--event <文件>]",
    detail: L(
      "ci init 写入 .github/workflows/koder.yml：PR 打开或更新时自动审查并评论；在 PR 里评论 /koder review、/koder fix、/koder test、/koder ask <问题> 会触发对应动作。修改类指令只接受仓库成员。",
      "ci init writes .github/workflows/koder.yml: PRs are reviewed and commented on automatically; comments /koder review, /koder fix, /koder test, /koder ask <question> trigger actions. Edit commands are accepted from repository members only.",
    ),
    examples: [
      ["koder ci init", L("生成工作流", "Create the workflow")],
      ["koder ci comment --event event.json", L("本地模拟一条评论事件", "Simulate a comment event locally")],
    ],
  },
  {
    name: "acp", aliases: ["协议"], group: "connect",
    summary: L("通过 ACP 协议在标准输入输出上提供 Koder", "Serve Koder over ACP on stdio"),
    usage: "koder acp",
    detail: L("编辑器（Zed、Neovim、Emacs）用 ACP 启动 koder acp，就能在编辑器里对话、看差异、批准修改。", "Editors (Zed, Neovim, Emacs) launch koder acp to chat, see diffs and approve edits inside the editor."),
    examples: [["koder editor nvim", L("查看 Neovim 配置写法", "Show the Neovim setup")]],
  },
  {
    name: "editor", aliases: ["编辑器"], group: "connect",
    summary: L("显示 Zed、Neovim、Emacs 的接入配置", "Show Zed, Neovim and Emacs setup"),
    usage: "koder editor [zed|nvim|emacs] [--os powershell|cmd|mac|linux]",
    flags: [["--os <系统>", L("按另一个系统给出配置文件位置；Windows 上命令写成 koder.cmd", "Paths for another system; on Windows the command becomes koder.cmd")]],
    examples: [["koder editor emacs", L("Emacs 配置", "Emacs setup")], ["koder editor zed --os powershell", L("Windows 上的 Zed 配置", "Zed on Windows")]],
  },
  {
    name: "scan", aliases: ["扫描"], group: "connect",
    summary: L("扫描本机 Koder、Codex、Claude Code、Cursor 的项目与任务", "Scan projects and tasks from Koder, Codex, Claude Code and Cursor"),
    usage: "koder scan [--tool koder|codex|claude|cursor] [--days 30] [--limit 20] [--no-titles] [--json]",
    flags: [
      ["--tool <名称>", L("只看某个工具，可写多次", "Only these tools; repeatable")],
      ["--days <天数>", L("只看最近多少天，默认 30；0 表示全部", "Only the last N days, default 30; 0 for all")],
      ["--limit <数量>", L("最多列多少个项目，默认 20", "Maximum projects listed, default 20")],
      ["--no-titles", L("不显示任务标题", "Hide task titles")],
      ["--all", L("也列出找不到工作目录的会话", "Also list sessions without a known folder")],
    ],
    detail: L(
      "只读取各工具在本机会话记录里的工作目录、时间和标题：Codex 的会话首行与标题索引，Claude Code 的 projects 记录，Cursor 的对话记录首条消息。不读取账号、密钥或数据库，不解密 Koder 的加密记录，也不上传任何内容。扫描后可以选一个项目，让 Koder 审查改动、修复检查，或结合最近的任务先列出现在最值得做的事。",
      "Reads only working folders, times and titles from local session records: Codex session headers and its title index, Claude Code project logs, and the first message of Cursor transcripts. Never accounts, keys or databases; Koder's sealed records are counted, not decrypted; nothing is uploaded. Then pick a project to review, fix, or have Koder list what is most worth doing given recent tasks.",
    ),
    examples: [
      ["koder scan", L("扫描并选择项目", "Scan and pick a project")],
      ["koder scan --tool codex --tool cursor --days 7", L("只看最近一周的 Codex 和 Cursor", "Codex and Cursor from the last week")],
      ["koder scan --json --no-titles", L("给脚本用", "For scripts")],
    ],
  },
  {
    name: "moa", aliases: ["混合"], group: "automate",
    summary: L("Mixture of Agents：多个模型先给意见，当前模型汇总执行", "Mixture of Agents: several models advise, the current one acts"),
    usage: "koder moa set [名称] --refs <模型,模型> [--aggregator <模型>] [--fanout user_turn|every_step] | use <名称> | show | run <任务>",
    flags: [
      ["--refs <a,b>", L("参考模型（先用 koder model add 登记）", "Reference models (register with koder model add)")],
      ["--aggregator <模型>", L("汇总模型，默认当前模型", "Aggregator model, default: current model")],
      ["--fanout <节奏>", L("user_turn：每个用户回合问一次（默认，省钱）；every_step：每步都问", "user_turn: once per user turn (default, cheaper); every_step: every step")],
      ["--privacy <模式>", L("display：显示时隐去邮箱、电话、密钥；full：交给汇总模型前也隐去；off", "display: redact emails, phones, keys when shown; full: also before the aggregator; off")],
    ],
    detail: L(
      "参照 Hermes 的 MoA：参考模型不带工具，只看对话文字给建议；汇总模型把建议当私有参考，照常决定回答或调用工具，修改和命令照样逐项确认。部分参考失败会注明，全部失败就由汇总模型自己判断。",
      "Follows Hermes' MoA: references see only the conversation text and advise without tools; the aggregator treats the advice as private context and still decides to answer or call tools, with the usual approvals. Failed references are noted; if all fail, the aggregator acts alone.",
    ),
    examples: [
      ["koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY", L("登记参考模型", "Register a reference model")],
      ["koder moa set --refs kimi,qwen", L("建默认预设", "Create the default preset")],
      ["koder --moa \"重构支付模块并补测试\"", L("用 MoA 跑一个任务", "Run a task with MoA")],
    ],
  },
  {
    name: "connect", aliases: ["连接", "apps"], group: "connect",
    summary: L("连接聊天应用并启动收发消息", "Connect chat apps and start receiving messages"),
    usage: "koder connect [<平台>] [--qr | --manual] [--no-start | --foreground]",
    flags: [
      ["--qr", L("微信、飞书、企业微信扫码连接", "Connect WeChat, Feishu or WeCom by QR code")],
      ["--manual", L("手动填写已有机器人的凭据", "Enter credentials for an existing bot")],
      ["--no-start", L("只保存和校验，暂不启动网关", "Save and verify without starting the gateway")],
      ["--foreground", L("在当前终端运行网关", "Keep the gateway in this terminal")],
    ],
    detail: L("不带平台时可选择应用。微信、飞书、企业微信默认扫码；也可以手动填写已有机器人的凭据。连接成功后自动在后台收消息。陌生人仍需配对，执行文件修改和命令仍需确认。更多控制见 koder gateway help。", "Choose an app interactively or name it. WeChat, Feishu and WeCom support QR connection and manual credentials. A successful connection starts receiving messages in the background. Other people still need pairing, and edits and commands still need approval. See koder help gateway for policies and diagnostics."),
    examples: [["koder connect weixin", L("微信扫码连接", "Connect WeChat")], ["koder connect feishu", L("飞书扫码连接", "Connect Feishu")], ["koder connect wecom", L("企业微信扫码连接", "Connect WeCom")]],
  },
  {
    name: "gateway", aliases: ["网关", "接入"], group: "connect",
    summary: L("一键接入飞书、企业微信、微信、钉钉、Telegram、Slack、Discord、WhatsApp", "Connect Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, WhatsApp"),
    usage: "koder gateway connect [<平台>] | setup [<平台>] | doctor <平台> | start [--background] | status | stop | pair <配对码> | policy <平台> --dm … --group … | list",
    flags: [
      ["--set <键=值>", L("非交互地填写接入信息，可写多次", "Fill credentials non-interactively; repeatable")],
      ["--background", L("后台运行网关", "Run the gateway in the background")],
      ["--platform <a,b>", L("只启动这些平台", "Start only these platforms")],
      ["--qr / --manual", L("扫码连接或手动填写已有机器人凭据", "QR connection or credentials for an existing bot")],
      ["--no-start", L("连接时只保存和校验配置", "Save and verify without starting")],
      ["--dm <策略>", L("私聊：pairing（默认，需配对）、allowlist、open、disabled", "Direct messages: pairing (default), allowlist, open, disabled")],
      ["--group <策略>", L("群聊：disabled（默认）、allowlist、open；群里要 @ 机器人", "Groups: disabled (default), allowlist, open; the bot must be mentioned")],
    ],
    detail: L(
      "每个平台一条命令接入：按提示填写后台给的凭据，Koder 会在线校验；微信直接扫码。飞书、企业微信、钉钉、Slack、Discord 用长连接，不需要公网地址；WhatsApp 官方接口需要把本地端口通过隧道暴露。陌生人私聊会收到配对码，你在电脑上 koder gateway pair 之后才能使用；修改文件和运行命令前会在聊天里问你，回复「允许」才执行。",
      "One command per platform: fill in the credentials from its console and Koder verifies them online; WeChat just scans a QR code. Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel. Strangers get a pairing code you approve with koder gateway pair; edits and commands are confirmed in the chat with a reply of \"yes\".",
    ),
    examples: [
      ["koder connect feishu", L("扫码连接飞书并开始收消息", "Connect Feishu and receive messages")],
      ["koder connect weixin", L("扫码连接微信并开始收消息", "Connect WeChat by QR code")],
      ["koder gateway doctor wecom", L("检查企业微信凭据和连接", "Check WeCom credentials and connection")],
      ["koder gateway start --background", L("后台收消息", "Receive messages in the background")],
      ["koder gateway pair K7Q2MX", L("同意一位用户", "Approve a user")],
    ],
  },
  {
    name: "setup", aliases: ["设置", "配置", "settings", "config"], group: "setup",
    summary: L("设置界面：方向键或鼠标就能配好全部选项", "Settings screen: configure everything with arrow keys or the mouse"),
    usage: "koder setup",
    detail: L(
      "全屏菜单：语言、模型（选服务商、选型号、粘贴密钥，也能直接打开拿密钥的网页）、官网深浅配色、开屏样式和动画、引擎、聊天软件、编辑器配置（一键复制）、互动教程和体检。↑↓ 或 Tab 移动，回车确定，Esc 返回，数字直达，列表里直接打字可以筛选；终端支持鼠标时点一下就选中，滚轮翻页。每一项改完立刻保存。第一次进入 koder 且还没配模型时会自动打开，对话里输入 /setup 也能打开。",
      "A full-screen menu: language, model (provider, model, paste the key, or open the key page), the website's dark or light palette, banner style and animation, engine, chat apps, editor config (copied in one go), the tutorial and a check-up. Arrow keys or Tab to move, Enter to pick, Esc to go back, digits to jump, type to filter lists; where the terminal reports the mouse, a click picks and the wheel scrolls. Every change is saved at once. Opens by itself on the first start without a model; /setup opens it inside a chat.",
    ),
    examples: [["koder setup", L("打开设置界面", "Open the settings screen")], ["koder 设置", L("中文命令也行", "The Chinese alias works too")]],
  },
  {
    name: "onboard", aliases: ["向导", "初始化"], group: "setup",
    summary: L("同 koder setup，安装脚本装完会自动打开", "Same as koder setup; the installers open it after installing"),
    usage: "koder onboard",
  },
  {
    name: "engine", aliases: ["引擎"], group: "setup",
    summary: L("切换引擎：内置 Koder 内核或 Python 版 Hermes（ACP）", "Switch engine: built-in Koder kernel or Python Hermes (ACP)"),
    usage: "koder engine list | install hermes | use <koder|hermes|名称> | test <名称> | add <名称> --command <命令> [--args \"acp\"]",
    detail: L(
      "默认引擎是内置的 Node 版 Koder 内核。install hermes 会调用 Hermes 官方安装脚本（固定到核对过的提交）；之后 run、ask、对话、审查和网关都可以交给 Hermes，批准请求仍由 Koder 的确认界面处理。任何支持 ACP 的智能体都能用 add 接进来。",
      "The default engine is the built-in Node Koder kernel. install hermes runs the official Hermes installer pinned to the checked commit; afterwards run, ask, chat, review and the gateway can use Hermes, with approvals still handled by Koder. Any ACP agent can be added with add.",
    ),
    examples: [["koder engine install hermes", L("安装 Hermes 引擎", "Install the Hermes engine")], ["koder engine use hermes", L("切到 Hermes", "Switch to Hermes")]],
  },
  {
    name: "update", aliases: ["更新"], group: "setup",
    summary: L("更新到最新版", "Update to the latest version"),
    usage: "koder update",
  },
  {
    name: "uninstall", aliases: ["卸载"], group: "setup",
    summary: L("卸载 Koder CLI（--purge 同时删除配置）", "Uninstall Koder CLI (--purge also removes settings)"),
    usage: "koder uninstall [--purge]",
  },
  {
    name: "memory", aliases: ["记忆"], group: "setup",
    summary: L("查看、检索和管理本地会话记忆", "Inspect, search and manage local conversation memory"),
    usage: "koder memory show | search <内容> | add <记忆> | remove <id> | clear | forget",
    detail: L("同一工作目录和会话自动衔接历史。--session <名称> 可分开任务，--new 开始新会话，--no-memory 停用本次自动保存与恢复。clear 开始新会话并保留明确记忆；forget 删除此会话的历史、明确记忆和归档。", "History continues within the same workspace and session. Use --session <name> to separate tasks, --new for a fresh conversation, and --no-memory to disable automatic save/restore for this invocation. clear starts fresh while keeping explicit notes; forget deletes this session's history, notes and archives."),
  },
  {
    name: "model", aliases: ["模型"], group: "setup",
    summary: L("配置模型（复用 Koder 的 31 个预设）", "Configure the model (31 Koder presets)"),
    usage: "koder model show [名称] | test [名称] | context [名称] | presets | set | add <名称> | list | use <名称> | remove <名称> | clear",
    flags: [
      ["--preset <id>", L("用 Koder 预设，例如 deepseek、kimi、qwen、claude、chatgpt、local", "Koder preset such as deepseek, kimi, qwen, claude, chatgpt, local")],
      ["--base-url <地址>", L("兼容接口地址", "Compatible API base URL")],
      ["--model <型号>", L("型号名", "Model name")],
      ["--protocol openai|anthropic", L("接口协议", "API protocol")],
      ["--key-env <变量名>", L("从环境变量读密钥（推荐，配置里只存变量名）", "Read the key from an env var (recommended; only the name is saved)")],
      ["--key-stdin", L("从标准输入读密钥", "Read the key from stdin")],
      ["--context-window <tokens>", L("服务商实际支持的上下文窗口", "The actual model context window")],
      ["--max-output <tokens>", L("每次输出上限，也计入上下文窗口", "Output ceiling, counted within the context window")],
    ],
    detail: L(
      "配置保存在 ~/.koder-cli/provider.json，权限 600。直接粘贴的密钥是明文保存的，推荐改用 --key-env。CI 里可以只设 KODER_MODEL、KODER_BASE_URL、KODER_API_KEY 环境变量。",
      "Saved to ~/.koder-cli/provider.json with mode 600. A pasted key is stored in plain text; prefer --key-env. In CI just set KODER_MODEL, KODER_BASE_URL and KODER_API_KEY.",
    ),
    examples: [
      ["koder model set --preset deepseek --key-env DEEPSEEK_API_KEY", L("用 DeepSeek", "Use DeepSeek")],
      ["koder model set --preset local --model qwen3:8b", L("用本机 Ollama", "Use local Ollama")],
      ["koder model context --context-window 1048576 --max-output 8192", L("仅调整窗口与输出，保留当前模型和密钥", "Change limits while keeping the current model and credentials")],
    ],
  },
  {
    name: "lang", aliases: ["语言"], group: "setup",
    summary: L("切换中文或英文", "Switch between Chinese and English"),
    usage: "koder lang [zh|en]",
    examples: [["koder lang en", L("切换为英文", "Switch to English")], ["koder lang zh", L("切换回中文", "Back to Chinese")]],
  },
  {
    name: "theme", aliases: ["主题"], group: "setup",
    summary: L("切换官网深色或浅色配色", "Switch the website's dark or light palette"),
    usage: "koder theme [auto|dark|light]",
    detail: L("颜色取自官网样式表：深色舞台 #12141c、文字 #ededeb、强调蓝 #7ca6ff；浅色舞台 #e4e1d8、文字 #1d1c1a、强调蓝 #2455d3。auto 会根据终端的 COLORFGBG 判断，判断不了时按深色。", "Colours come from the website stylesheet: dark stage #12141c, text #ededeb, accent #7ca6ff; light stage #e4e1d8, text #1d1c1a, accent #2455d3. auto reads the terminal's COLORFGBG and falls back to dark."),
    examples: [["koder theme light", L("浅色终端用", "For light terminals")], ["koder theme auto", L("恢复自动判断", "Back to automatic")]],
  },
  {
    name: "help", aliases: ["帮助"], group: "setup",
    summary: L("查看命令说明", "Show help"),
    usage: "koder help [命令]",
    examples: [["koder help review", L("看 review 的全部参数", "All options of review")]],
  },
  {
    name: "learn", aliases: ["教程", "教学"], group: "setup",
    summary: L("17 课互动教程：在练习场里边学边动手", "17-lesson interactive tutorial in a practice project"),
    usage: "koder learn [课号] [--print] [--os powershell|cmd|mac|linux]",
    flags: [
      ["--print", L("不进入互动，直接输出完整的文字版教程", "Print the whole tutorial as text instead")],
      ["--os <系统>", L("按哪个系统讲：powershell、cmd、mac、linux；默认自动识别", "Which system to teach for: powershell, cmd, mac or linux; detected by default")],
    ],
    detail: L(
      "教练会在临时目录里建一个练习场，用写好台词的教练模型带你真实地走一遍：看差异、批准或拒绝修改、确认命令、做选择、斜杠命令、审查、修复循环、流程编排、MoA、聊天软件、编辑器、扫描和安装。不需要配置模型，也不产生任何费用。每个系统一套教程：PowerShell、CMD、macOS、Linux 的环境变量、管道、退出码、复制粘贴、危险命令、安装和配置文件位置都按各自的写法来讲；第一课会告诉你识别到的是哪套，也可以换。回车下一步，b 回上一课，q 退出，进度会记住。没有终端时自动输出文字版。",
      "The coach builds a practice project in a temp folder and walks you through it for real with a scripted coach model: diffs, approving and rejecting edits, command approval, choices, slash commands, review, the fix loop, flows, MoA, chat apps, editors, scanning and installation. No model setup and no cost. Each system gets its own edition: environment variables, pipes, exit codes, copy and paste, dangerous commands, installation and config paths are written for PowerShell, CMD, macOS or Linux; lesson 1 says which one was detected and lets you switch. Enter for next, b for back, q to quit; progress is saved. Without a terminal it prints the text edition.",
    ),
    examples: [["koder learn", L("从头开始（或接着上次）", "Start, or resume")], ["koder learn 4", L("直接跳到第 4 课", "Jump to lesson 4")], ["koder learn --print --os cmd", L("输出 CMD 版的文字教程", "Print the CMD edition")]],
  },
  {
    name: "doctor", aliases: ["体检"], group: "setup",
    summary: L("检查环境、模型和启动耗时", "Check environment, model and startup time"),
    usage: "koder doctor [--api]",
    detail: L("默认检查本机配置；--api 会实际请求当前模型，可能产生少量 API 用量。也可运行 koder model test。", "Checks local configuration by default; --api sends a small real model request and may incur API usage. You can also run koder model test."),
  },
  {
    name: "banner", aliases: ["开屏"], group: "setup",
    summary: L("显示折光体开屏", "Show the prism banner"),
    usage: "koder banner [--ascii] [--no-anim]",
  },
  {
    name: "version", aliases: ["版本"], group: "setup",
    summary: L("显示版本，以及官网更新页", "Show the version and the official updates page"),
    usage: "koder version",
  },
  {
    name: "about", aliases: ["关于", "官网"], group: "setup",
    summary: L("按官网介绍 Koder 是谁做的，并给出更新页", "Introduce Koder from the official site, with the updates page"),
    usage: "koder about",
    detail: L(
      "内容与官网关于我们、更新页、下载页一致：KARMEN LOOP 自己编写，内核名叫 KARMEN LOOP。对话里问“这工具是谁开发的”也会给出同一段介绍。",
      "Matches the website's about, updates and download pages: written by KARMEN LOOP, kernel named KARMEN LOOP. Asking in chat who made the tool prints the same introduction.",
    ),
  },
];

const GROUPS = [
  ["start", L("开始干活", "Get work done")],
  ["quality", L("审查、修复、测试", "Review, fix, test")],
  ["automate", L("自动化与编排", "Automation and orchestration")],
  ["connect", L("接入工具链与本机工程", "Toolchain and local projects")],
  ["setup", L("设置与帮助", "Setup and help")],
];

function style(depth) {
  const c = (rgb, bold) => (text) => (depth === "none" ? text : `${fg(rgb, depth, bold)}${text}${RESET}`);
  const p = theme();
  return { head: c(p.accent, true), cmd: c(p.text, true), dim: c(p.text3), ok: c(p.accent) };
}

export function findCommand(name) {
  return COMMANDS.find((item) => item.name === name || item.aliases.includes(name)) || null;
}

export function overview(lang, depth, version) {
  const s = style(depth);
  const zh = lang === "zh";
  const lines = [gradientText(`KODER CLI ${version}`, depth, { bold: true }), zh ? "轻量即用的终端编程代理" : "A lightweight terminal coding agent", ""];
  lines.push(s.head(zh ? "用法" : "Usage"), localize("  koder [命令] [选项]", lang), localize("  koder \"<任务>\"", lang), "");
  for (const [group, title] of GROUPS) {
    lines.push(s.head(title[lang]));
    for (const command of COMMANDS.filter((item) => item.group === group)) {
      const alias = zh && command.aliases.length ? s.dim(`  ${command.aliases.join("、")}`) : "";
      lines.push(`  ${s.cmd(command.name.padEnd(9))}${command.summary[lang]}${alias}`);
    }
    lines.push("");
  }
  lines.push(s.head(zh ? "通用选项" : "Global options"));
  for (const [flag, text] of GLOBAL_OPTIONS) lines.push(`  ${pad(localize(flag, lang), 26)}${text[lang]}`);
  lines.push("", s.dim(zh ? "koder help <命令> 看详细说明；koder learn 跟着教程走；koder lang en 切换英文。" : "koder help <command> for details; koder learn for the tutorial; koder lang zh for Chinese."));
  return lines.join("\n");
}

export function commandHelp(command, lang, depth) {
  const s = style(depth);
  const zh = lang === "zh";
  const lines = [`${s.cmd(`koder ${command.name}`)}  ${command.summary[lang]}`];
  if (command.aliases.length) lines.push(s.dim(`${zh ? "别名" : "Aliases"}: ${command.aliases.join(", ")}`));
  lines.push("", s.head(zh ? "用法" : "Usage"), `  ${localize(command.usage, lang)}`);
  if (command.detail) lines.push("", command.detail[lang]);
  if (command.flags?.length) {
    lines.push("", s.head(zh ? "选项" : "Options"));
    for (const [flag, text] of command.flags) lines.push(`  ${pad(localize(flag, lang), 30)}${text[lang]}`);
  }
  if (command.examples?.length) {
    lines.push("", s.head(zh ? "例子" : "Examples"));
    for (const [cmd, text] of command.examples) lines.push(`  ${s.ok(cmd)}`, `    ${s.dim(text[lang])}`);
  }
  lines.push("", s.dim(zh ? "通用选项见 koder help。" : "Global options: koder help."));
  return lines.join("\n");
}

