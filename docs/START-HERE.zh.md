> 上下文设置：[窗口、自动压缩与请求估算教程](CONTEXT-CONTROLS.zh.md)。

[Ubuntu 26.04.1 Desktop amd64 完整教程](UBUNTU-26.04.zh.md)

[不限工具轮次、费用预算、子任务与按需获取技能](TASK-ORCHESTRATION.zh.md)

[1800 课完整课堂：手把手与开发者路线](courses/index.zh.html)

保留 0.5.0 的 [Awesome LLM Apps 工作流](AWESOME-LLM-APPS.zh.md)，保留 [SolidCraft 参数化 CAD](SOLIDCRAFT.zh.md)；原有[排队、快捷切模型与思考强度](SESSION-CONTROLS.zh.md)及 [CLI-Anything 应用 CLI](CLI-ANYTHING.zh.md)继续保留。

# 从这里开始：Koder CLI 0.5.18

## 安装完成后，怎么进入 Koder？

Ubuntu / macOS：在系统终端逐条执行。已配置模型可跳过第一条。

```bash
"$HOME/.local/bin/koder" setup
"$HOME/.local/bin/koder"
```

看到 `koder >` 后才输入任务。`activate` 只开启后台常驻，不会进入聊天；出现状态 JSON 后运行第二条即可。完整路径能用但 `koder` 找不到时，按 [PATH 排查](UBUNTU.zh.md#progress) 操作，不必重新下载。自定义安装路径以安装器末尾为准。


Koder 是在终端中执行编程和撰写任务的 Agent，使用你选择的模型 API 或兼容本地模型。它可以处理项目文件、运行获批命令，并按需调用已配置的 Skills、MCP 和应用。模型费用由服务商单独结算；目录中有一个选项，不代表该账号或设备已连接成功。

## 1. 安装或升级

**Ubuntu 用户先看 [24.04 中文手把手教程](UBUNTU.zh.md)：从没有 curl 的新电脑开始，逐步完成下载、模型、权限、图形操作和故障排查。**

从 [GitHub 正式发行](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.18)选择 Windows CMD、PowerShell、macOS 或 Ubuntu 24.04 安装入口。安装器按平台选择同版本运行包；CLI 与桌面应用分别下载安装。

已有托管安装可运行：

```text
koder update
koder --version
```

应显示 `koder 0.5.18`。0.4.4 或更早的更新器若提示清单无效，用 GitHub 当前安装器覆盖升级，不必卸载或删除配置。各终端安装命令、许可确认和恢复步骤见[安装说明](INSTALLATION.md)。若更新后仍启动旧版，Windows 用 `where.exe koder`、macOS/Ubuntu 用 `type -a koder` 检查 PATH 中是否有多个入口。

## 2. 配模型，完成第一个任务

```text
koder setup
koder model test
koder model test --tools
koder
```

选择正确地区、API 产品或套餐及可用模型。两种模型测试可能产生少量服务商用量。置灰接口暂不可用，详见[模型与接口说明](PROVIDERS.md)；不要把 API Key 或邮箱授权码写进任务、截图或反馈。

先进入独立项目目录，让 Koder 检查现有工程或创建一个小网页，再查看实际文件、改动和测试结果。新网站、PPT、应用可使用用户目录中的 **Koder Projects**。多个独立任务使用不同工程或明确的会话名，见[多窗口任务](MULTI-WINDOW.md)。

## 3. 控制正在执行的任务

交互聊天中按 `/` 打开建议、模板和命令，选中后只填入草稿，编辑确认后才发送。Setup 可选择运行中引导（默认）或先进先出排队。Esc/Ctrl+C 可取消；提前排队的文字不能批准后来出现的权限问题。具体行为、回退原因和终端限制见[实时输入与 Skills](SESSION-INPUT-AND-SKILLS.zh.md)。

普通命令默认等待 5 分钟，识别到的直接安装命令默认 15 分钟，单次可明确申请最多 30 分钟。明确设置的短时限和 curl 自身时限仍有效。工具轮次默认不限；只有显式配置有限步数预算时才可能出现 `TASK_STEP_LIMIT`。取消、费用预算、会话和已有结果继续保留。见[命令时限与恢复](COMMAND-DURATION.md)。

## 4. 按任务找到完整教程

| 要完成的事 | 教程 |
| --- | --- |
| 从安装走到交付 | [完整中文指南](USER-GUIDE.zh.md) |
| 查命令、参数和退出码 | [命令参考](COMMAND-REFERENCE.zh.md)、[CLI 契约](CLI-CONTRACTS.zh.md) |
| 写代码或交付文稿 | [当前任务交付](TASK-DELIVERY.zh.md)、[内容质量](CONTENT-QUALITY.zh.md) |
| 导入 Codex、Cursor、WorkBuddy Skills | [技能兼容与调用](PORTABLE-SKILLS.zh.md) |
| 配置工具与排障 | [MCP/Skill 兼容](MCP-SKILL-COMPATIBILITY.zh.md)、[逐项清单](MCP-SKILL-INVENTORY.md) |
| 使用 Windows 内置电脑驱动 | [Windows-MCP](WINDOWS-MCP-BUNDLED.zh.md)、[安装恢复](WINDOWS-INSTALL-RECOVERY.zh.md) |
| 操作应用或陌生网站 | [应用调用与学习](APP-USE-AND-LEARN.zh.md) |
| 参数化零件建模、测量和导出 | [SolidCraft 手把手 CAD 教程](SOLIDCRAFT.zh.md) |
| 实时预览并发布获批网页 | [可视化流程与 Netlify](VISUAL-WORKFLOW-AND-NETLIFY.md) |
| 绑定邮箱、发信和接收提醒 | [邮箱投递](MAIL-DELIVERY.zh.md)、[主动问询](MAIL-PROACTIVE-INQUIRY.zh.md) |
| 开启本机常驻 | [常驻完整教程](ALWAYS-ON.zh.md) |
| 配置任务策略和上下文 | [Harness 配置](HARNESS-JIT.md)、[Headroom](HEADROOM.zh.md) |
| 刷新模型或升级软件 | [模型发现](MODEL-DISCOVERY.zh.md)、[自动更新](AUTO-UPDATE.zh.md) |
| 排查没完成、接口失败 | [运行诊断](RUNTIME-DIAGNOSTICS.md)、[接口与输入诊断](PROVIDER-WRITING-INPUT.md) |

邮箱监控需要单独授权且宿主持续运行；轮询、睡眠、网络与通知设置都会影响提醒时间。绑定邮箱不等于允许发送，电脑操作也需要独立权限。使用前阅读内置 EULA 和隐私文本；个人非商业使用与单独授权的商业使用遵循不同条款。

## 5. 学习并核对结果

`koder learn` 提供 1800 课中文课堂，前 30 课带互动练习场，不调用付费模型；`koder learn --print` 查看文字版。Windows PowerShell、CMD、macOS、Linux 共八套中英文教程，可从发行页或[完整指南](USER-GUIDE.zh.md)下载。

符合条件的托管交互安装会在启动及运行期间检查更新，等待任务、队列和草稿空闲后安装。`koder update auto off` 关闭；`koder update --check` 仅检查。

[0.4.23 更新说明](RELEASE-0.4.23.zh.md)区分本版网站设计工作流与保留功能。Windows 客户端实机、PowerShell 5.1 冷启动、ConPTY/IME、Windows-MCP 图形操作和真实账号/模型验收仍分别交由设备与 beta 检查。SolidCraft 已在 Apple silicon 上完成原生建模调用；Windows 和 Intel Mac 运行在本轮为 NOT_RUN。安装成功和本地检查不代表所有设备与服务均已通过。

## 绑定 GitHub 与托管项目

运行 koder github connect，或 Setup → Apps / MCP → GitHub。绑定自己的令牌后，可以读取仓库、创建私有仓库、提交选定文件、编辑 README 和仓库介绍、创建草稿 PR。远程写入逐次确认，断线先对账。详见[完整教程](GITHUB-PROJECTS.zh.md)。


## 换设备与1800课学习

运行 `koder migrate` 或 Setup → 设备迁移。按[迁移教程](DEVICE-MIGRATION.zh.md)导出、导入、核对并在新设备重绑账号。[进入1800课课堂](courses/index.zh.html)，选择手把手或开发者路线；学习记录在浏览器本地保存，可导出。


## 保留：紧凑常驻输入与 Todo

输入区默认只占两行，有 Todo 时为三行。执行时继续输入；Enter 按当前引导/排队设置提交。Ctrl+T 展开清单，`/todo` 看全表，`/help` 查看快捷键；空输入按 `/` 后 Tab 只填草稿。Setup → 会话界面可调整底栏，`/reload-tui` 立即加载。[完整手把手与开发说明](SESSION-DOCK.zh.md)。


## 0.4.21：自寻与子任务调用

[手把手操作](SELF-FETCH-AND-SUBAGENTS.zh.md)：指定 GitHub 仓库查找、固定提交安装、读取后续做原任务、子任务模型与思考强度、费用与取消。


## 0.4.22：网站需求与设计参考

默认先询问缺失需求，离线读取 84 份设计原文，通过原审批落实页面、检查与预览。[完整手把手教程](AWESOME-DESIGN-MD.zh.md).


## 0.4.23：网站交付与项目锚点

默认使用 Fullstack Web Delivery 探讨需求、沿用项目方向，再实现或修复网站。[手把手教程](WEBSITE-PROJECTS.zh.md).


## 0.4.24：文档问答

默认 PageIndex Skill 会按目录选择章节、回读原文并核对引用，沿用现有模型和项目权限。[手把手教程](PAGEINDEX.zh.md).


## 0.5.0：真实调用、OCR 与专业角色

[完整操作教程](FRAMEWORK-0.5.zh.md) · [OCR 逐步操作](OCR.zh.md) · [角色与队列](SUBAGENT-ROLES.zh.md) · [无头/CI](HEADLESS-0.5.zh.md)。先检查可用通道和权限，再执行并核对回执。
