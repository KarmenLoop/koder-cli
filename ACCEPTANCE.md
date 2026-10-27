# Koder CLI — 使用前与授权说明 / Before you enable features

适用于 0.5.8；保留已有能力的授权说明。此文件解释功能与授权，不替代或修改 EULA.md，不代表用户已接受或开启任何功能。版权、下载与国际用户说明见 LEGAL-NOTICE.md。官方团队：KARMENLOOP 官方团队，中国上海。官网：https://karmenloop.com。邮箱：info@karmenloop.com。

For 0.5.8; existing feature-consent guidance is retained. This guide explains features and consent; it does not replace or amend EULA.md or record acceptance. Copyright, download and international-use information is in LEGAL-NOTICE.md. Official team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.

0.5.5 本地任务记忆默认开启，原关闭选择保留；这与下面默认关闭的画像学习等独立授权选项不同。请查看本文件末尾“本地 Markdown 任务记忆”及 `koder learning status`。

Local task memory is on by default in 0.5.5 and respects existing off choices. Profile learning and the other separately authorized features below retain their defaults. See “Local Markdown task memory” at the end and `koder learning status`.

授权与数据使用说明

使用许可：个人非商业本地使用免费；商用与组织部署须单独书面授权，个人许可不授二次开发或修改自有实现代码的权利；新自有发行版采用专有的 Koder-EULA-1.1，第三方和旧 GPL 权利保留。接受协议只取得软件使用许可，不会开启以下任何可选能力。查看协议：koder eula；明确接受：koder eula accept。

模型与网络：任务、选择的文件内容、检索到的记忆及工具结果可能发给你配置的模型/API；自带API费用由服务商收取。本地模型也必须实际安装运行，选择本地预设不等于已离线可用。使用 --key-env 保存变量引用；粘贴到模型配置的密钥是本机明文，界面仅隐藏显示。

电脑范围：文件读取/写入/搜索、联网、浏览器、桌面、渠道发文件和技能更新分别检查。完整工作模式覆盖所选可见磁盘根，仍受操作系统权限与实际能力限制。输入GRANT前核对执行程序、目录及远端成员；接受协议或 --yes 不会授予电脑权限。koder permissions revoke 撤销本机Koder的后续电脑工具授权；系统权限仍在系统设置中撤销。已经发生的写入或发送不会被自动追回。

跨设备记忆服务：你配置的Core地址
登录后，此账号默认共享空间可在已关联的终端、渠道和设备间同步对话与记忆。已关联群的所有成员可使用关联私聊记忆，回复到群的内容会被群成员看到。请只关联允许共享的会话。模型API密钥、电脑执行授权不作为记忆同步。退出本机账号：koder account logout；删除共享空间记忆：koder memory forget。退出不等于删除服务器副本；离线设备需再次同步才应用删除。

喜好习惯学习
默认关闭。开启后从已授权来源的对话中提炼表达习惯、明确喜好和工作背景，保存带来源的画像，并用于后续回答。一天想喝的饮料不应自动变成永久偏好；你可以查看、纠正或删除记录。
关闭: koder memory learning off

当天状态
默认关闭。单独允许总结当天的心情、临时需求和情境，作为短期状态使用。与长期喜好学习分开选择，不把情绪描述当作诊断。
关闭: koder memory daily-state off

技能改进
默认关闭。允许根据已授权任务和反馈提出技能改进候选；来源、检查和回退记录仍需保留。开启不允许自行提权、安装任意软件、修改系统安全设置或跳过工具批准。
关闭: koder memory evolution off

主动服务与提醒
默认关闭。允许根据已确认的背景主动问候、提出工作问题和提醒，并把你的回复关联到原问题。默认安静时段为本地时间22:00–08:00；当前终端提醒需要进程运行及兼容的Core服务。开启不代表允许给联系人或群自动发消息。
关闭: koder memory proactive off

每日反思：需已授权来源、已开启的相关选项、有效账号和兼容Core宿主。默认每日模型调用预算为4次；使用已配置的API或本地模型，可能产生费用。缺少宿主/凭据时显示等待状态，不表示已经反思完成。关闭学习会停止相应后续使用，不等于擦除历史；使用 profile forget 或 memory forget 管理记录。

本地存储：新Windows记忆目录优先使用可写的D盘，否则使用可写的C盘用户专属目录；已有记忆位置和手动设置会保留。记忆位置与安装位置、密钥存储不同，请以 memory status / memory personalization status 的实际输出为准。灵魂风格可手动编辑与回退，不能赋予权限。普通卸载保留配置；--purge 是删除配置的独立选择，外置记忆和服务器副本需单独处理。

应用与 MCP：连接会使用所选服务的 API Key 或浏览器授权；第三方能接收你通过该连接提交的数据，费用和服务条款由该服务决定。同一连接配置可由当前配置范围内的对话与 Agent 复用，外部写入仍走工具批准。stdio MCP 会在本机启动配置的程序；导入默认关闭，启用或 test 会启动连接。可用 koder apps disconnect <id>、koder mcp disable <id> 停用；在服务方撤销授权后才能终止其持有的令牌。

更改选择：四项可选功能互不代开；按每项提示输入ENABLE开启、DISABLE关闭，风格保存使用SAVE。只读帮助和 koder learn --print 可在接受协议之前查看。预览版的Windows真机、真实渠道和多设备仍待验收，连接状态与实际结果为准。

---

Permissions and data guide

License: personal, noncommercial local use is free; commercial use and organizational deployment require separate written authorization, and the personal license grants no proprietary development or code-modification rights. New Koder-owned distributions use proprietary Koder-EULA-1.1; third-party and legacy GPL rights remain intact. Acceptance licenses the software and enables none of the optional capabilities below. Read: koder eula. Explicitly accept: koder eula accept.

Model and network: tasks, selected file contents, retrieved memories and tool results may be sent to your configured model/API. Provider charges apply. A local model must actually be installed and running; selecting a preset does not make offline inference available. Use --key-env for a variable reference. A key pasted into provider configuration is stored locally in plaintext even when the display masks it.

Computer scope: file read/write/search, network, browser, desktop, channel attachments and skill updates are checked separately. Full work mode selects visible disk roots, subject to actual operating-system permissions and capabilities. Review the executable, roots and remote actors before typing GRANT. Agreement acceptance or --yes grants no computer authority. koder permissions revoke withdraws future Koder computer-tool grants on this device; revoke OS permissions in system settings separately. Completed writes or sends are not automatically undone.

Cross-device memory service: your configured Core endpoint
After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.

Preference learning
Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
Turn off: koder memory learning off

Daily state
Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
Turn off: koder memory daily-state off

Skill evolution
Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
Turn off: koder memory evolution off

Proactive service and reminders
Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
Turn off: koder memory proactive off

Daily reflection needs authorized sources, the relevant opt-ins, a valid account and a compatible Core host. The default model-call budget is four per day, using your configured API or local model and potentially incurring charges. A waiting-host or credential state means reflection has not completed. Turning learning off stops the corresponding future use; it does not erase history. Manage records with profile forget or memory forget.

Local storage: new Windows memory prefers a writable D drive, falling back to a writable per-user location on C. Existing and explicitly configured locations are retained. Memory, installation and credential locations differ; inspect memory status / memory personalization status. Manually edit or roll back the assistant style without granting authority. Normal uninstall keeps configuration; --purge separately removes configuration. External memory and server copies need separate handling.

Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.

Changing choices: the four optional features do not enable one another. Type ENABLE to turn one on, DISABLE to turn it off, and SAVE for a manual style edit. Read-only help and koder learn --print are available before agreement acceptance. Native Windows, live channels and multiple physical devices remain unverified for this preview; rely on observed connection states and results.

## SolidCraft CAD

SolidCraft is included but its connection is enabled separately per project with `koder cad enable`. This launches an isolated local headless MCP process when tested or used. It does not attach to a desktop window, grant computer permissions or authorize a third-party cloud account. The existing model provider can receive task text, tool results and selected design information. Saved designs belong to the project; private recovery files remain in the CLI data folder.

SolidCraft 随包提供，但需对每个项目单独开启。测试或任务调用会启动本机无界面 MCP 进程，不自动接管桌面、不代开电脑权限、不绑定云账号。模型仍使用现有 BYOK 路由，任务及工具结果可能发给所选服务商。设计保存到项目，恢复文件保留在 CLI 私有目录。

## Bundled AI application references

Awesome LLM Apps provides offline text references and adapted Koder methods. Reading the library is local; selected source excerpts and project evidence can enter the existing model context when used in an Agent task. This does not grant new network, account, filesystem or execution permissions. External example dependencies and accounts are not automatically installed or bound. Disable the integration with koder llm-apps off or Setup → Skills.

## Website design references / 网站设计参考

0.4.22 bundles MIT-licensed design text for offline reference. The default method asks about missing website requirements; supplied facts and assumptions are distinguished. It does not authorize copying brand assets, installing dependencies, network access or publishing. Existing file and command approvals remain. Disable the method in Setup Skills or koder design off.

随包设计原文可离线阅读。默认建站询问缺失需求；用户可跳过可选问题，缺项须标为假设。设计参考不授予商标/图片/字体许可、联网、安装或发布权限；原文件与命令审批继续生效。可在 Setup Skills 或 koder design off 关闭。

## Website project anchors / 网站项目锚点

0.4.23 integrates the exact Fullstack Web Delivery 0.9.1 Skill and a separate Koder host adapter. The original custom license and notices remain. Anchor proposals do not write or grant permission; edits and commands use the existing Core. Local scripted execution is not paid-model quality or native Windows/browser acceptance.

默认用于新站、改版和旧站修复。新项目独立建目录；锚点保留编号、方向、历史与笔记，改中心思想先对照提案和真实用户决定。模型决策夹具不代表真实模型表现。

## PageIndex / 文档目录与原文问答

0.4.24: real local Markdown and compressed PDF parsing, bookmark/page navigation, readback and exact citation verification. Scripted model choices exercise the existing Core and read-only subagents without a new model service. Source regression: 138 passed; package and upgrade results are separate receipts. Native Windows beta, paid-model document reasoning quality, upstream Flash/cloud OCR and private production documents remain NOT_RUN. Existing platform/account limitations are retained.

## Version 0.5.0

Local OCR, professional child-task roles, FIFO admission and headless completion contracts extend the original Core. See [execution guide](docs/FRAMEWORK-0.5.en.md) and [release notes](docs/RELEASE-0.5.0.md). Actual command, package and installer results are recorded separately in ACCEPTANCE-RESULTS.json; deterministic model fixtures are not paid-model quality evidence. Windows native acceptance remains beta-owned NOT_RUN. No official website deployment is included.


## Native capability routing · 0.5.2

`koder mcp capabilities` reports the scope and provenance of built-in capabilities. `tool_inventory` lists the tools mounted in the current task; neither command grants permission or certifies an external service. Native JS/TS source navigation is a bounded lexical analysis and does not execute target code. Hashes and dependency candidates must be checked against source.

Windows-MCP, REA, SolidCraft and the MCP SDK retain their upstream attribution and license obligations. CodeGraphContext remains an optional service for broader language and graph operations. Existing account scopes, write confirmations, cancellation, budgets and UNKNOWN reconciliation apply. Native Windows device checks remain beta-owned; local fixture results are not Windows GUI, mailbox or provider-account acceptance.


## Local Markdown task memory · 0.5.5 / 本地 Markdown 任务记忆

Task memory is enabled by default when the growth method and Skills are enabled. Existing feature, growth, all-Skills and selected-library off choices are retained. Use `koder learning status` to inspect the current account/workspace location and effective setting; Setup, `koder learning on|off` and `/learning on|off` control the same feature. `koder growth off` pauses the integration. Turning a switch off preserves saved files. Status does not initialize a new library.

Records use local Markdown documents under the selected account/workspace scope, with a separate default project per task session. They retain goals, decisions, checkpoints, next steps and bounded task evidence; they do not replace explicit notes or grant access to another conversation. Selected relevant records may enter your existing task's model context under the original model and data permissions. Local review itself makes no additional model call. Reviews run while the CLI session is open or at a later task; no new OS scheduler or background service is installed.

Profile learning, daily state, proactive service, skill evolution, synchronization and agentd activation keep their separate controls and existing off defaults. This feature grants no network, account, computer-tool or global Skill installation/adoption permission. The original Harness experience store and native maintenance verification gates remain authoritative. A completion claim stays `pending_verification` until required evidence is present; the model's own rating cannot confirm it. Missing usage/cost stays unknown rather than zero.

本地任务记忆在成长方法与 Skills 启用时默认开启，已有单项、成长总开关、全部 Skills 或所选库关闭选择继续保留。用 `koder learning status` 查看当前账号/工作区位置和实际状态；Setup、`koder learning on|off` 与 `/learning on|off` 控制同一功能，`koder growth off` 一并暂停。关闭保留文件，只读状态查询不创建学习库。

Markdown 记录按账号、工作区和默认任务会话隔离，保存目标、决策、进度和下一步，保留原明确笔记。相关内容可按原模型与数据权限进入当前任务上下文；本地复盘不额外调用模型，只在现有 CLI 会话中或下次任务时运行，不安装新的操作系统调度器或后台服务。画像学习、当天状态、主动服务、技能演化、同步与常驻仍独立控制，不授予联网、外部账号、电脑工具或全局 Skill 安装/采纳权限。模型自评不能将 `pending_verification` 变成已核实成功；未知用量与费用不计为零。

Source checks, packaged execution and installer/update checks for 0.5.5 are recorded separately in the release attachment `ACCEPTANCE-RESULTS.json`; public readback is checked against that runtime digest. Local scripted checks are not live paid-provider, private-account, native Windows or model-quality acceptance. Windows remains beta-owned NOT_RUN; the unsigned macOS locked-use helper remains HOLD. This update excludes website changes and deployment.

源码检查、实际包执行和安装升级结果分别记录于发行附件 `ACCEPTANCE-RESULTS.json`；公开读回按同一运行包摘要核对。本地脚本化验证不代表付费模型、真实账号、Windows 真机或模型质量验收；Windows 保持 beta/NOT_RUN，未签名 macOS 锁定组件保持 HOLD。本次不更新或发布官网。
