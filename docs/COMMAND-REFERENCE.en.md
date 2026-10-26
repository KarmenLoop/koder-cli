# Complete command reference

Koder CLI 0.4.19 · 1,800 Chinese lessons; original 30 English lessons

Generated from this release’s command definitions. [GitHub](GITHUB-PROJECTS.en.md) · [Setup](USER-GUIDE.en.md) · [Task orchestration](TASK-ORCHESTRATION.en.md)

```text
KODER CLI 0.4.19
A lightweight terminal coding agent

Usage
  koder [command] [options]
  koder "<task>"

Get work done
  project  Create, open and inspect isolated project folders
  chat     Interactive session (just type koder)
  run      Run tasks with smart approval and saved permissions
  ask      Read-only question: no edits, no commands

Review, fix, test
  review   Context-aware code review, with optional fix
  fix      Run a check, fix failures, re-check
  test     Generate tests for changed or given files

Automation and orchestration
  flow     Orchestrate agent and check steps from a flow file
  ci       GitHub Actions workflow and /koder comment triggers
  moa      Mixture of Agents: several models advise, the current one acts

Toolchain and local projects
  github   Connect GitHub, host projects and edit repositories
  netlify  Connect your Netlify site and authorize draft deployments
  reverse  First-party Koder static reverse engineering (preview)
  rea      Use bundled REA reverse-engineering tools
  apps     Application connections and status
  mcp      Add, import and verify MCP servers
  acp      Serve Koder over ACP on stdio
  editor   Show Zed, Neovim and Emacs setup
  scan     Scan projects and tasks from Koder, Codex, Claude Code and Cursor
  connect  Connect chat apps and start receiving messages
  gateway  Connect Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, WhatsApp

Setup and help
  tools    Check local tools before searching public candidates
  subagentsInspect saved subagent checkpoints for a workspace session
  notificationsTask notifications, tests and receipts
  open     Open the original session from a notification
  cad      Parametric 3D CAD with SolidCraft
  cli-anythingDiscover, register and approve local app CLIs
  migrate  Move projects, preferences and local history between devices
  logs     Inspect local runtime diagnostics
  activate Enable the local user agent
  deactivateStop the agent and remove login startup
  status   Inspect the resident agent
  agentd   Resident-agent diagnostics and notification settings
  harness  Choose a task harness
  visuals  Review three directions, compare visual choices and export the project H5 map
  mail     Bind mail, classify messages and authorize replies
  preview  Open a live companion browser for a website or Web app
  growth   Built-in autonomous learning Skill: status, method and controls
  resourcesReferences: official remote workflows or your optional private collections
  business Company licensing and dedicated private repository inquiries
  star     An optional GitHub star for Koder
  privacy  Read full consumer privacy terms and notices offline
  feedback Official feedback address and blank template
  celebrateSkippable six-second effects, holidays, and birthday settings
  eula     Read the license and consent guide, or explicitly accept the license
  account  Account, sign-in and sign-out for cross-device memory
  prompts  Choose a contextual next message or a saved template
  skills   Discover and import Codex, Cursor and WorkBuddy-compatible skills
  permissionsSmart approval, saved permissions, full access and computer grants
  setup    Settings screen: configure everything with arrow keys or the mouse
  onboard  Same as koder setup; the installers open it after installing
  engine   Switch engine: built-in Koder kernel or Python Hermes (ACP)
  update   Update to the latest version
  uninstallUninstall Koder CLI (--purge also removes settings)
  memory   Inspect, search and manage local and shared memory
  model    Configure models and actual context windows
  lang     Switch between Chinese and English
  theme    Switch the website's dark or light palette
  help     Show help
  learn    1800-lesson interactive tutorial in a practice project
  doctor   Check environment, model and startup time
  banner   Show the prism banner
  version  Show the version and the official updates page
  about    Introduce Koder from the official site, with the updates page

Global options
  --harness <id>            Select a task harness without changing permissions or the model
  --skill <id,name>         Select local skills for this turn; read on demand, scripts retain approvals
  --stdin                   Attach stdin to an explicit prompt; read it automatically when there is no prompt
  --stdin-timeout <sec>     Complete-input deadline, default 5 seconds, range 0.01–3600 seconds
  -w, --workspace <dir>     Workspace folder, default: current directory
  -y, --yes                 Auto-accept edits and commands; never answers questions, collects passwords or enables learning or computer grants
  --approval auto|ask|full|deny Approval mode for this run; --yes never overrides explicit deny
  --json                    One JSON event per line, for scripts
  --lang zh|en              Use Chinese or English for this run
  --mode <mode>             standard, code, minimal, plan, execute, report, enhance
  --provider <file>         Use another model JSON for this run
  --moa                     Use MoA for this run: references advise, the current model acts
  --engine <name>           Koder is the default; the internal fallback is disabled and gray, with no automatic switch
  --no-color                Disable colors
  -h, --help                Show help for the command

koder help <command> for details; koder learn for the tutorial; koder lang zh for Chinese.
```

## tools

```text
koder tools  Check local tools before searching public candidates

Usage
  koder tools seek <public query> [--command executable-name] [--local] [--page N] [--json]

Reads PATH metadata without executing files. A local match skips remote search; --local always stays local. Remote searches require network permission; task installations use tool_bootstrap and existing approvals.

Global options: koder help.
```

## subagents

```text
koder subagents  Inspect saved subagent checkpoints for a workspace session

Usage
  koder subagents status [--session name] [-w workspace] [--thread ID] [--offset N] [--limit N] [--json]

Reads the original session store without resuming or replaying work. A saved running state is reported as unconfirmed. Use /subagents status|cancel in the original chat for live controls.

Global options: koder help.
```

## notifications

```text
koder notifications  Task notifications, tests and receipts

Usage
  koder notifications status | test task-done | task-done on|off | flush | register

Short interactive replies stay quiet. Long tasks, failures and actual input requests follow your settings. Tests call the native adapter; submitted means submitted, not visibly displayed. Register explicitly adds the current-user continuation handler on Windows. Setup → Task notifications controls the threshold and quiet hours.

Global options: koder help.
```

## open

```text
koder open  Open the original session from a notification

Usage
  koder open <opaque-token>

Checks the current account, original workspace and persisted session. Opens chat without submitting a message or replaying a task.

Global options: koder help.
```

## cad

```text
koder cad  Parametric 3D CAD with SolidCraft
Aliases: solidcraft

Usage
  koder cad status|enable|disable|test|verify [-w <dir>] [--command <absolute-cli-path>]

Bundled on Windows x64 and macOS. Enable per workspace; each turn gets an isolated headless design. Modeling uses the existing MCP approval path. Save designs before finishing. test verifies handshake, not geometry.

Global options: koder help.
```

## cli-anything

```text
koder cli-anything  Discover, register and approve local app CLIs

Usage
  koder cli-anything catalog [query] | register <manifest> | list | inspect <id> | invoke <id> [-- args...] | install <id> [--yes]

Pinned catalog entries are not installed apps. Register workspace executables; execution uses the existing command approval and process receipts.

Global options: koder help.
```

## migrate

```text
koder migrate  Move projects, preferences and local history between devices
Aliases: migration, 迁移

Usage
  koder migrate | export --output <file> | inspect --file <file> | import --file <file> --yes | send --to user@host --yes | status | open <id> | rollback <id> --yes

The wizard selects Koder Projects by default; use --project to select a folder. The destination uses an isolated profile and requires fresh credentials and permissions. SSH requires an existing login and known host. See docs/DEVICE-MIGRATION.en.md.

Global options: koder help.
```

## github

```text
koder github  Connect GitHub, host projects and edit repositories

Usage
  koder github connect | status | repos | read owner/repo README.md | create name | commit owner/repo file... | edit owner/repo --description text | pr owner/repo --head branch --title text | reconcile owner/repo | disconnect

Setup → Applications and MCP → GitHub. Enter a token through the protected prompt or use --key-env VARIABLE. New repositories default to private; commits include only listed text files and require local confirmation. No repository deletion or force push.

Global options: koder help.
```

## logs

```text
koder logs  Inspect local runtime diagnostics

Usage
  koder logs [--tail 100] [--path] [--json]

Read bounded events and error codes. Prompts and credentials are not recorded; nothing is uploaded.

Global options: koder help.
```

## activate

```text
koder activate  Enable the local user agent

Usage
  koder activate

Sensitive sources remain off. Residency grants no tool permissions; Core still owns execution and cancellation. See docs/ALWAYS-ON.zh.md.

Global options: koder help.
```

## deactivate

```text
koder deactivate  Stop the agent and remove login startup

Usage
  koder deactivate

Sensitive sources remain off. Residency grants no tool permissions; Core still owns execution and cancellation. See docs/ALWAYS-ON.zh.md.

Global options: koder help.
```

## status

```text
koder status  Inspect the resident agent

Usage
  koder status

Sensitive sources remain off. Residency grants no tool permissions; Core still owns execution and cancellation. See docs/ALWAYS-ON.zh.md.

Global options: koder help.
```

## agentd

```text
koder agentd  Resident-agent diagnostics and notification settings

Usage
  koder agentd status|doctor|logs|wake|proactive on|off

Sensitive sources remain off. Residency grants no tool permissions; Core still owns execution and cancellation. See docs/ALWAYS-ON.zh.md.

Global options: koder help.
```

## harness

```text
koder harness  Choose a task harness

Usage
  koder harness status|list|experiences [--offset N --limit N]|on|off|use <id|auto>|default <id>|archive <on|off>|steps <unlimited|N>|budget <amount> <USD|CNY> <model> <input-per-million> <output-per-million>|budget off

Reuses existing tools, budgets, permissions and experience ports. Setup → Skills → Task harness. Disabling restores baseline ReAct.

Examples
  koder harness list
    List the five profiles

Global options: koder help.
```

## project

```text
koder project  Create, open and inspect isolated project folders
Aliases: 项目

Usage
  koder project create <name> [--kind website|slides|app|project] | open <path> | list | status | check [--kind project|website|service|generator]

New projects live in the users Koder Projects folder. /project create or open switches the current chat and its session. Use -w for an existing workspace. Automatic task history is isolated by project and session. project check inspects file structure only; missing items return 3. It never runs scripts.

Global options: koder help.
```

## visuals

```text
koder visuals  Review three directions, compare visual choices and export the project H5 map

Usage
  koder visuals review|decision --file directions.json | status | deliver

Compare three distinct layouts before production, revise low scores and honor explicit skips. Browser feedback never grants upload or execution authority. Delivery maps use actual files and exclude credentials and dependencies.

Global options: koder help.
```

## netlify

```text
koder netlify  Connect your Netlify site and authorize draft deployments

Usage
  koder netlify login | connect --key-env NAME | sites | bind | plan --directory dist | deploy --directory dist | publish <deploy-id> | status | disconnect

Browser login requires a configured Koder OAuth app; protected token entry is available. Upload prebuilt static files as a draft by default; production needs separate consent. Koder membership and Netlify billing/quotas are separate. Managed hosting is not configured.

Global options: koder help.
```

## mail

```text
koder mail  Bind mail, classify messages and authorize replies

Usage
  koder mail setup|status|check|inquire on|off|inquiries|choose <id> A|send-inquiry <id>|dismiss <id>|watch|disconnect

Model reading, learning, and automatic replies need separate grants. Use /mail auto on --allow-from friend@example.com --daily-limit 5. For decision questions, enable /mail model on, then /mail inquire on. Choose A/B to draft; sending still requires send. Codes are local-only. Checks run while chat or mail watch is running.

Global options: koder help.
```

## preview

```text
koder preview  Open a live companion browser for a website or Web app

Usage
  koder preview start [--directory dist] [--url http://127.0.0.1:5173] | status | open | stop

Static pages refresh live without discarding active form input. Framework projects attach to an existing local server. Preview runs no installers or project scripts. Native apps need a simulator or device.

Global options: koder help.
```

## growth

```text
koder growth  Built-in autonomous learning Skill: status, method and controls
Aliases: 自主学习

Usage
  koder growth status|show|on|off

personal-agent-growth 0.3.2 ships offline for relevant tasks. on/off applies to the next CLI session; show reads the method. Task experience stays in the authorized workspace. Profile learning, sync, skill activation and scheduling retain their separate consent and host requirements.

Global options: koder help.
```

## resources

```text
koder resources  References: official remote workflows or your optional private collections
Aliases: 资料, 资源库

Usage
  koder resources status | import <zip> [--model-access] | search <query> | read <id> | export <id> --out <file> | allow-model <collection-id> --confirm MODEL | disable <collection-id> | remove <collection-id>

Remote retrieval defaults off. --remote authorizes one command; KODER_REMOTE_RESOURCES=1 offers remote tools to the Agent. Only short queries and resource IDs are sent. No bulk preload. KODER_REMOTE_RESOURCES=0 disables it; --remote explicitly selects it. Your own imports use local storage by default. --model-access allows the local chat model to find and receive excerpts on demand. Collections are encrypted, excluded from sync and public packages, and never install or execute scripts. Videos and incomplete downloads are not text resources. Remove unlinks a collection while retaining encrypted objects and original ZIPs. Legacy DOC can be read on macOS; other systems need DOCX conversion. Scanned PDFs need OCR.

Global options: koder help.
```

## business

```text
koder business  Company licensing and dedicated private repository inquiries
Aliases: 商业授权, 企业服务

Usage
  koder business

Personal, noncommercial use is free. Commercial use and organizational deployment require separate written authorization. Ask info@karmenloop.com about delivery scope; nothing is sent or provisioned automatically.

Global options: koder help.
```

## star

```text
koder star  An optional GitHub star for Koder
Aliases: 点星

Usage
  koder star

Shows the official repository link. Completely optional, with no browser launch, interruption or effect on licensed features.

Global options: koder help.
```

## privacy

```text
koder privacy  Read full consumer privacy terms and notices offline
Aliases: 隐私

Usage
  koder privacy [consumer|statement|desktop|agreement|sources]

CLI-specific terms and complete official originals ship in the package. No model or prior license acceptance is needed.

Global options: koder help.
```

## feedback

```text
koder feedback  Official feedback address and blank template
Aliases: 反馈, 投诉

Usage
  koder feedback

info@karmenloop.com. Nothing is sent or attached automatically; remove keys and private information first.

Global options: koder help.
```

## celebrate

```text
koder celebrate  Skippable six-second effects, holidays, and birthday settings
Aliases: 彩蛋

Usage
  koder celebrate [menu|code|confetti|fireworks|christmas|halloween|national|new-year|birthday|status]

Any key skips. auto off|notice|on controls automatic greetings. birthday --date MM-DD needs its own confirmation; music on|off|play and locale --language zh|en|auto / --ip are independent choices. Script and JSON output never plays an animation.

Global options: koder help.
```

## eula

```text
koder eula  Read the license and consent guide, or explicitly accept the license

Usage
  koder eula [accept]

Read eula before acceptance; accept licenses this build without enabling learning, sync, apps or computer grants. EULA.md is the license; ACCEPTANCE.md explains features and consent.

Global options: koder help.
```

## account

```text
koder account  Account, sign-in and sign-out for cross-device memory
Aliases: 账号, 帳號

Usage
  koder account login|status|logout [--server <url>]

Requires a deployed compatible Core service. Linked channels, devices, groups and private chats share the account default space; linked-group members can use linked private-chat memory and see group replies. Logout stops this device without erasing server copies. memory forget deletes the current shared space, applied to offline devices on sync. Model API keys and computer grants are not memory-sync data.

Global options: koder help.
```

## prompts

```text
koder prompts  Choose a contextual next message or a saved template
Aliases: prefill, 预填词, 预填

Usage
  koder prompts list | show <id> | choose | add <id> --title <title> --text <text> | update <id> --title <title> --text <text> | remove <id>

Type / in an empty input to open suggestions, templates and commands. Use arrows or PgUp/PgDn to browse, keep typing to filter, Tab to fill an editable draft, and Esc to close. Existing slash commands and pasted input still work. After a reply, optional suggestions follow the current conversation. /prefill 1–3 fills a suggestion; /prefill opens the picker. /suggest clear dismisses the current suggestions; /suggest off and /suggest on change the setting. /prefill fix fills a saved draft. Edit it and press Enter yourself to send it. Existing drafts and queued input are kept. Includes bilingual built-ins and local custom templates. Selection never submits a task, changes system instructions, or grants tool permission.

Examples
  koder prompts list
    List prompt templates

Global options: koder help.
```

## skills

```text
koder skills  Discover and import Codex, Cursor and WorkBuddy-compatible skills
Aliases: skill, 技能

Usage
  koder skills list | catalog | doctor <name> | prepare <name> | show <id> [--path <file>] | import <folder-or-zip> | enable|disable <id>

Reads project/user .agents, .codex, .cursor and .codebuddy skill directories and Koder local skills. Preserves SKILL.md, resources and notices. Import executes nothing and installs no dependencies. Use --skill name or $name; disambiguate with the full id. /skills list and /skill name work in the current chat.

Examples
  koder skills list
    List user-invocable skills
  koder run "Review the module" --skill review
    Use a selected skill

Global options: koder help.
```

## reverse

```text
koder reverse  First-party Koder static reverse engineering (preview)

Usage
  koder reverse status | tools | enable | disable | inspect/strings/symbols/disassemble/graph/query <file> | diff <file> <other>

Static analysis inside the current project: PE, ELF, Mach-O, WASM metadata, JavaScript lexical candidates, an ARM64 instruction subset and conservative control flow. Targets are never executed. Full decompilation and REA replacement are not accepted. Use /reverse in chat; enable it for Agent discovery and calls through existing approvals.

Examples
  koder reverse inspect sample.exe --json
    Inspect structure and actual coverage

Global options: koder help.
```

## rea

```text
koder rea  Use bundled REA reverse-engineering tools
Aliases: 逆向

Usage
  koder rea [status|verify|enable|disable|tools|help]

Enable it in the current project, then discover and invoke tools through the agent and existing approvals. No npx download. External engines are checked per operation.

Examples
  koder rea enable
    Enable for this project

Global options: koder help.
```

## apps

```text
koder apps  Application connections and status
Aliases: 应用

Usage
  koder apps [list|status|connect <id>|disconnect <id>] [--key-env <variable>]

Share local connections with desktop and agents. Gamma API and official MCP have separate authorization requirements. Chat channels use koder connect. Third parties receive submitted data and may charge fees. Disconnect stops local use; revoke tokens with the provider separately.

Options
  --key-env <variable>          Environment variable containing a Gamma API key
  --api-key                     Enter an API key interactively
  --oauth                       Start supported browser authorization
  --mcp                         Use the Gamma MCP authorization path

Examples
  koder apps
    List connections

Global options: koder help.
```

## mcp

```text
koder mcp  Add, import and verify MCP servers

Usage
  koder mcp presets|doctor <preset>|list/add/import/login/tools/test/enable/disable/remove/resources/prompts/read/prompt [<id>] [<uri|name>] [--params <JSON>]

add/import leave servers disabled and never execute commands or install dependencies. Windows-MCP needs native Windows. CodeGraphContext binds this workspace and a separate runtime profile. presets/doctor do not open the connections host; doctor only checks launcher presence, not Python or actual tool behavior. enable explicitly starts them; test only connects and discovers tools. No model configuration or Koder login is required. The Linux connections host needs secret-tool, DBus and an unlocked Secret Service.

Options
  --preset windows-mcp|codegraph [--runner bundled|installed|uvx] Configure an optional versioned preset without starting it
  --command <program> --arg <value> Local stdio server; does not install software
  --url <url>                   Remote Streamable HTTP
  --bearer-env <variable>       Read credentials from an environment variable

Examples
  koder mcp import servers.json
    Review imported configuration before enable
  koder mcp test <id>
    Verify connection and tool discovery

Global options: koder help.
```

## permissions

```text
koder permissions  Smart approval, saved permissions, full access and computer grants
Aliases: 权限

Usage
  koder permissions execution status|auto|ask|full|deny|revoke|reset [--scope workspace|profile] | status|request|repair|revoke

Execution defaults to smart approval. Sensitive prompts offer Always allow. full --confirm FULL saves full access for this workspace; --scope profile covers all workspaces. Revoke/reset removes saved permissions. Status shows the host, roots and OS probes. Request requires interactive local owner consent; --yes does not grant computer or system authority. Repair preserves unknown or missing states until verified. Revoke withdraws future computer-tool grants; it does not undo writes or OS permissions. Full work mode selects visible disk roots within actual OS access.

Examples
  koder permissions request --home
    Authorize file work in the current user home

Global options: koder help.
```

## chat

```text
koder chat  Interactive session (just type koder)
Aliases: 对话

Usage
  koder [chat]

Shows the banner and opens a session. Type a task; Koder reads files and proposes edits and commands, using smart approval for low-risk checks and ordinary edits, with a prompt for sensitive actions and an Always allow choice. Slash commands switch language, mode and auto-approve.

Examples
  koder
    Start a session
  koder -w ~/code/app
    Chat inside another project

Global options: koder help.
```

## run

```text
koder run  Run tasks with smart approval and saved permissions
Aliases: 运行, 做

Usage
  koder run <task>   or   koder "<task>"

Runs one agent turn. With a prompt, add --stdin to attach piped input; without a prompt, stdin is read with a deadline. Smart approval is the default. Unapproved sensitive actions fail closed without a terminal. --approval ask selects ask mode; deny rejects all execution actions.

Examples
  koder run "把 utils.js 里的 var 改成 const"
    Quick fix
  npm test 2>&1 | koder run "根据这段失败输出修好测试"
    Pipe output into Koder
  koder run --yes --json "补上 README 的安装说明"
    Automate in a script with JSON output

Global options: koder help.
```

## ask

```text
koder ask  Read-only question: no edits, no commands
Aliases: 提问, 问

Usage
  koder ask <question>

Koder may only list, read and search. Good for understanding code.

Examples
  koder ask "登录流程从哪个文件开始？"
    Understand code
  git diff | koder ask "这段改动有什么风险？"
    With a pipe

Global options: koder help.
```

## review

```text
koder review  Context-aware code review, with optional fix
Aliases: 审查, 评审

Usage
  koder review [--base <ref>] [--staged] [--format text|markdown|json|github] [--fix]

Koder gathers the diff, repo layout, rule files such as AGENTS.md, recent commits and where changed symbols are used, then lets the model verify with read-only tools. Each finding has file, line, severity and a suggestion.

Options
  --base <ref>                  Compare against this ref (merge base); default: main/master
  --staged                      Review staged changes only
  --commit <sha>                Review a single commit
  --files <a,b>                 Limit to these paths
  --format <format>             text, markdown, json, github (Actions annotations)
  --out <file>                  Also write the result to a file
  --fail-on <level>             Exit 1 when findings reach high, medium or low
  --focus <text>                Extra focus, e.g. from a PR comment
  --fix                         Fix the findings afterwards (follow your approval policy, or use --yes)
  --check <cmd>                 Check command to run after fixing

Examples
  koder review
    Review uncommitted changes, else the current branch
  koder review --base origin/main --format markdown --out review.md
    Produce a PR comment
  koder review --fix --check "npm test"
    Review, fix, then test

Global options: koder help.
```

## fix

```text
koder fix  Run a check, fix failures, re-check
Aliases: 修复

Usage
  koder fix [description] --check <cmd> [--attempts 3]

On failure the output goes to Koder, which fixes and re-checks until it passes or attempts run out. The exit code reflects the last check.

Options
  --check <cmd>                 Check command, e.g. npm test, pytest, go test ./...
  --attempts <n>                Maximum fix attempts, default 3
  --timeout <sec>               Check timeout in seconds, default 600

Examples
  koder fix --check "npm test"
    Fix until tests pass
  koder fix "首页按钮点击没反应"
    Fix from a description

Global options: koder help.
```

## test

```text
koder test  Generate tests for changed or given files
Aliases: 测试, 补测试

Usage
  koder test [files...] [--base <ref>] [--check <cmd>]

Koder reads existing tests first and follows the same framework, folders and style.

Options
  --base <ref>                  Use files changed since this ref
  --check <cmd>                 Run after writing tests; failures are fixed

Examples
  koder test src/price.js --check "npm test"
    Test one file
  koder test --base main
    Test files changed on this branch

Global options: koder help.
```

## flow

```text
koder flow  Orchestrate agent and check steps from a flow file
Aliases: 流程, 编排

Usage
  koder flow init [name] | koder flow run <file> | koder flow list

A flow is JSON with steps of type shell, run, ask, review, fix, test. Use when for conditions (e.g. unit.failed), {{step.output}} to reuse output and parallel for read-only steps. approve: auto confirms automatically for CI.

Examples
  koder flow init pr-gate
    Create .koder/flows/pr-gate.json
  koder flow run .koder/flows/pr-gate.json
    Run it

Global options: koder help.
```

## ci

```text
koder ci  GitHub Actions workflow and /koder comment triggers
Aliases: 流水线

Usage
  koder ci init [--force] | koder ci comment [--event <file>]

ci init writes .github/workflows/koder.yml: PRs are reviewed and commented on automatically; comments /koder review, /koder fix, /koder test, /koder ask <question> trigger actions. Edit commands are accepted from repository members only.

Examples
  koder ci init
    Create the workflow
  koder ci comment --event event.json
    Simulate a comment event locally

Global options: koder help.
```

## acp

```text
koder acp  Serve Koder over ACP on stdio
Aliases: 协议

Usage
  koder acp

Editors (Zed, Neovim, Emacs) launch koder acp to chat, see diffs and approve edits inside the editor.

Examples
  koder editor nvim
    Show the Neovim setup

Global options: koder help.
```

## editor

```text
koder editor  Show Zed, Neovim and Emacs setup
Aliases: 编辑器

Usage
  koder editor [zed|nvim|emacs] [--os powershell|cmd|mac|linux]

Options
  --os <系统>                   Paths for another system; on Windows the command becomes koder.cmd

Examples
  koder editor emacs
    Emacs setup
  koder editor zed --os powershell
    Zed on Windows

Global options: koder help.
```

## scan

```text
koder scan  Scan projects and tasks from Koder, Codex, Claude Code and Cursor
Aliases: 扫描

Usage
  koder scan [--tool koder|codex|claude|cursor] [--days 30] [--limit 20] [--no-titles] [--json]

Reads only working folders, times and titles from local session records: Codex session headers and its title index, Claude Code project logs, and the first message of Cursor transcripts. Never accounts, keys or databases; Koder's sealed records are counted, not decrypted; nothing is uploaded. Then pick a project to review, fix, or have Koder list what is most worth doing given recent tasks.

Options
  --tool <name>                 Only these tools; repeatable
  --days <days>                 Only the last N days, default 30; 0 for all
  --limit <n>                   Maximum projects listed, default 20
  --no-titles                   Hide task titles
  --all                         Also list sessions without a known folder

Examples
  koder scan
    Scan and pick a project
  koder scan --tool codex --tool cursor --days 7
    Codex and Cursor from the last week
  koder scan --json --no-titles
    For scripts

Global options: koder help.
```

## moa

```text
koder moa  Mixture of Agents: several models advise, the current one acts
Aliases: 混合

Usage
  koder moa set [name] --refs <model,model> [--aggregator <model>] [--fanout user_turn|every_step] | use <name> | show | run <task>

Follows Hermes' MoA: references see only the conversation text and advise without tools; the aggregator treats the advice as private context and still decides to answer or call tools, with the usual approvals. Failed references are noted; if all fail, the aggregator acts alone.

Options
  --refs <a,b>                  Reference models (register with koder model add)
  --aggregator <model>          Aggregator model, default: current model
  --fanout <fanout>             user_turn: once per user turn (default, cheaper); every_step: every step
  --privacy <mode>              display: redact emails, phones, keys when shown; full: also before the aggregator; off

Examples
  koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY
    Register a reference model
  koder moa set --refs kimi,qwen
    Create the default preset
  koder --moa "重构支付模块并补测试"
    Run a task with MoA

Global options: koder help.
```

## connect

```text
koder connect  Connect chat apps and start receiving messages
Aliases: 连接

Usage
  koder connect [<platform>] [--qr | --manual] [--no-start | --foreground]

Choose an app interactively or name it. WeChat, Feishu and WeCom support QR connection and manual credentials. A successful connection starts receiving messages in the background. Other people still need pairing, and edits and commands still need approval. See koder help gateway for policies and diagnostics.

Options
  --qr                          Connect WeChat, Feishu or WeCom by QR code
  --manual                      Enter credentials for an existing bot
  --no-start                    Save and verify without starting the gateway
  --foreground                  Keep the gateway in this terminal

Examples
  koder connect weixin
    Connect WeChat
  koder connect feishu
    Connect Feishu
  koder connect wecom
    Connect WeCom

Global options: koder help.
```

## gateway

```text
koder gateway  Connect Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, WhatsApp
Aliases: 网关, 接入

Usage
  koder gateway connect [<platform>] | setup [<platform>] | doctor <platform> | start [--background] | status | stop | pair <code> | policy <platform> --dm … --group … | list

One command per platform: fill in the credentials from its console and Koder verifies them online; WeChat just scans a QR code. Feishu, WeCom, DingTalk, Slack and Discord use long connections and need no public URL; the WhatsApp Cloud API needs the local port exposed through a tunnel. Strangers get a pairing code you approve with koder gateway pair; edits and commands are confirmed in the chat with a reply of "yes".

Options
  --set <key=value>             Fill credentials non-interactively; repeatable
  --background                  Run the gateway in the background
  --platform <a,b>              Start only these platforms
  --qr / --manual               QR connection or credentials for an existing bot
  --no-start                    Save and verify without starting
  --dm <policy>                 Direct messages: pairing (default), allowlist, open, disabled
  --group <policy>              Groups: disabled (default), allowlist, open; the bot must be mentioned

Examples
  koder connect feishu
    Connect Feishu and receive messages
  koder connect weixin
    Connect WeChat by QR code
  koder gateway doctor wecom
    Check WeCom credentials and connection
  koder gateway start --background
    Receive messages in the background
  koder gateway pair K7Q2MX
    Approve a user

Global options: koder help.
```

## setup

```text
koder setup  Settings screen: configure everything with arrow keys or the mouse
Aliases: 设置, 配置, settings, config

Usage
  koder setup

A full-screen menu: language, model (provider, model, paste the key, or open the key page), the website's dark or light palette, banner style and animation, engine, chat apps, editor config (copied in one go), the tutorial, check-up, context/output limits, memory and soul, computer grants and revocation, apps/MCP and the license and consent guide. Arrow keys or Tab to move, Enter to pick, Esc to go back, digits to jump, type to filter lists; where the terminal reports the mouse, a click picks and the wheel scrolls. Every change is saved at once. Opens by itself on the first start without a model; /menu, /setup, or koder setup opens it inside a chat. Use /celebrate for effects and Esc to return to the conversation.

Examples
  koder setup
    Open the settings screen
  koder 设置
    The Chinese alias works too

Global options: koder help.
```

## onboard

```text
koder onboard  Same as koder setup; the installers open it after installing
Aliases: 向导, 初始化

Usage
  koder onboard

Global options: koder help.
```

## engine

```text
koder engine  Switch engine: built-in Koder kernel or Python Hermes (ACP)
Aliases: 引擎

Usage
  koder engine list | install hermes | use <koder|hermes|name> | test <name> | add <name> --command <cmd> [--args "acp"]

The default engine is the built-in Node Koder kernel. install hermes runs the official Hermes installer pinned to the checked commit; afterwards run, ask, chat, review and the gateway can use Hermes, with approvals still handled by Koder. Any ACP agent can be added with add.

Examples
  koder engine install hermes
    Install the Hermes engine
  koder engine use hermes
    Switch to Hermes

Global options: koder help.
```

## update

```text
koder update  Update to the latest version
Aliases: 更新

Usage
  koder update [--check] | koder update auto on|off|status

Discover the current release on GitHub; --check only checks. Installed interactive sessions can update while idle; auto off disables this. Verify installer and package checksums, retain configuration and memory, and never downgrade automatically. A changed license needs review. Preview releases are labeled.

Global options: koder help.
```

## uninstall

```text
koder uninstall  Uninstall Koder CLI (--purge also removes settings)
Aliases: 卸载

Usage
  koder uninstall [--purge]

Global options: koder help.
```

## memory

```text
koder memory  Inspect, search and manage local and shared memory
Aliases: 记忆

Usage
  koder memory status | sync | personalization status | reflection run | show | search <内容> | add <记忆> | remove <id> | clear | forget | learning on|off | daily-state on|off | evolution on|off | proactive on|off | profile show|remember|identity|forget | soul show|preview|save|rollback

History continues within the same workspace and session. Use --session <name> to separate tasks, --new for a fresh conversation, and --no-memory to disable automatic save/restore for this invocation. clear starts fresh while keeping explicit notes; When signed into shared memory, forget forgets the current shared space; offline devices apply it on sync. learning, daily-state, evolution and proactive each support on/off/status and default off; disabling retains history. profile forget takes record IDs. See koder eula and lessons 17–22.

Global options: koder help.
```

## model

```text
koder model  Configure models and actual context windows
Aliases: 模型

Usage
  koder model show [name] | test [name] | context [name] | models | refresh [name] | catalog-refresh | presets | set | add <name> | list | use <name> | remove <name> | clear

Saved to ~/.koder-cli/provider.json with mode 600. A pasted key is stored in plain text; prefer --key-env. In CI just set KODER_MODEL, KODER_BASE_URL and KODER_API_KEY.

Options
  --preset <id>                 Koder preset such as deepseek, kimi, qwen, claude, chatgpt, local
  --base-url <url>              Compatible API base URL
  --model <model>               Model name
  --protocol openai|anthropic   API protocol
  --key-env <NAME>              Read the key from an env var (recommended; only the name is saved)
  --key-stdin                   Read the key from stdin
  --context-window <tokens>     The actual model context window
  --max-output <tokens>         Output ceiling, counted within the context window

Examples
  koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
    Use DeepSeek
  koder model set --preset local --model qwen3:8b
    Use local Ollama
  koder model context --context-window 1048576 --max-output 8192
    Change limits while keeping the current model and credentials

Global options: koder help.
```

## lang

```text
koder lang  Switch between Chinese and English
Aliases: 语言

Usage
  koder lang [zh|en]

Examples
  koder lang en
    Switch to English
  koder lang zh
    Back to Chinese

Global options: koder help.
```

## theme

```text
koder theme  Switch the website's dark or light palette
Aliases: 主题

Usage
  koder theme [auto|dark|light]

Colours come from the website stylesheet: dark stage #12141c, text #ededeb, accent #7ca6ff; light stage #e4e1d8, text #1d1c1a, accent #2455d3. auto reads the terminal's COLORFGBG and falls back to dark.

Examples
  koder theme light
    For light terminals
  koder theme auto
    Back to automatic

Global options: koder help.
```

## help

```text
koder help  Show help
Aliases: 帮助

Usage
  koder help [command]

Examples
  koder help review
    All options of review

Global options: koder help.
```

## learn

```text
koder learn  1800-lesson interactive tutorial in a practice project
Aliases: 教程, 教学

Usage
  koder learn [课号] [--print] [--track hands-on|developer|all|overview] [--os powershell|cmd|mac|linux]

The coach builds a practice project in a temp folder and walks you through it for real with a scripted coach model: diffs, approving and rejecting edits, command approval, choices, slash commands, review, the fix loop, flows, MoA, chat apps, editors, scanning and installation, plus license and consent, computer scope, shared memory, learning and soul, apps/MCP, and API/context recovery. Old graduates resume at new lesson 17. The built-in coach needs no model setup or paid API calls. Extended hands-on and developer assignments are optional; live models and external services may incur charges. Each system gets its own edition: environment variables, pipes, exit codes, copy and paste, dangerous commands, installation and config paths are written for PowerShell, CMD, macOS or Linux; lesson 1 says which one was detected and lets you switch. Enter for next, b for back, q to quit; progress is saved. Without a terminal it prints the text edition.

Options
  --print                       Print the whole tutorial as text instead
  --track <路线>                hands-on, developer, all, or overview for the original coach. Interactive defaults to hands-on; text defaults to all
  --os <系统>                   Which system to teach for: powershell, cmd, mac or linux; detected by default

Examples
  koder learn
    Start, or resume
  koder learn 4
    Jump to lesson 4
  koder learn --print --os cmd
    Print the CMD edition

Global options: koder help.
```

## doctor

```text
koder doctor  Check environment, model and startup time
Aliases: 体检

Usage
  koder doctor [--api] [--computer]

Checks local configuration by default; --api sends a small real model request and may incur API usage. You can also run koder model test.

Global options: koder help.
```

## banner

```text
koder banner  Show the prism banner
Aliases: 开屏

Usage
  koder banner [--ascii] [--no-anim]

Global options: koder help.
```

## version

```text
koder version  Show the version and the official updates page
Aliases: 版本

Usage
  koder version

Global options: koder help.
```

## about

```text
koder about  Introduce Koder from the official site, with the updates page
Aliases: 关于, 官网

Usage
  koder about

Matches the website's about, updates and download pages: written by KARMEN LOOP, kernel named KARMEN LOOP. Asking in chat who made the tool prints the same introduction.

Global options: koder help.
```
