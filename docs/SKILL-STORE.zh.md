# Skill 商店：查找、安装与适配

[English](SKILL-STORE.en.md) · [简体中文](SKILL-STORE.zh.md)

Koder CLI 0.8.1 已包含 Skill 商店，下方说明面向已发布版本。已有实际包检查覆盖固定提交安装及原 Harness 内使用，不代表每个第三方 Skill 都已跑通。

## 进入商店

在 Koder 对话中输入：

```text
/skills store
```

或在系统终端输入：

```sh
koder skills store
```

也可以打开 Setup → 技能 / Skills → Skill 商店 · GitHub。上下键选择，回车查看详情或安装，Esc 返回。原来的技能总开关、单个开关、本地导入和资源库继续使用。

商店联网需要原有 network 和 skills.update 授权。没有授权时会给出命令，不会自动授予：

```sh
koder permissions request --capability network --capability skills.update
```

## 浏览与刷新

目录会显示名称、GitHub 仓库、固定提交、许可证信息、仓库星数和安装状态。可以选择星数、最近更新或增长排序，输入搜索词筛选，也可以使用 repo:owner/repository 限定仓库。

“星数”属于仓库，不是单个 Skill 的评分。“最近更新”使用仓库 pushed 时间；增长需要至少两次采样。GitHub 搜索有结果窗口和速率限制，目录按批次扫描，界面会说明是否还有后续页；不能把当前页面称为全网完整排名。

默认每天检查一次。在交互聊天开始后延迟 15 秒启动后台检查；不会阻塞聊天开屏，不会把用户对话作为搜索条件。退出聊天后停止这一检查。不是一个新的系统常驻服务。

```sh
koder skills store status --json
koder skills store auto off
koder skills store auto on
koder skills store refresh
koder skills store refresh --query 'repo:hardikpandya/stop-slop'
koder skills store list --sort stars --json
koder skills store list --sort newest --offset 20 --json
```

自动刷新开关保存在原 Skill 同步配置中。Setup 的“遇缺自寻”总开关关闭时，商店也不会联网；打开商店开关不会暗中打开总开关。关闭刷新会保留缓存和已安装内容。

非 TTY 和 --json 默认只读本地目录。CI 必须显式运行 refresh 或 install，失败返回非零退出码；不会弹出选择器等待输入。

## 安装后发生什么

首次看到一个 Skill 时，它只有目录信息，未下载、未接入 Agent。用户选择“下载并适配”后，依次执行：

1. 固定 GitHub commit，确认文件树完整，检查路径和包大小。
2. 下载 SKILL.md 及该 Skill 目录中的配套文件，保留上层 LICENSE、NOTICE 等许可文件。
3. 比较 Git blob 摘要和文件大小，再生成本地 SHA-256 清单。原始文件保持原样。
4. 生成独立的 Koder 宿主适配信息：Read、Write、Bash、AskUserQuestion 等映射到当前 CLI 工具；资源改用同一 Skill ID 的 skill_read 读取。
5. 检查资源引用、脚本类型、依赖清单、宿主专用工具与路径、手动调用限制，再只读检查本机运行时。
6. 安装成功才加入原有 Skill 目录。交互商店退出后，下一个回合能发现并使用新技能。

该过程不会执行下载脚本、读取浏览器账号、安装应用、授予权限或用第三方配置覆盖用户模型。发现 Python 脚本时优先报告 Koder 已有的私有 Python 运行时，不下载第二份解释器。远端 Hook 不会成为启动脚本。

原始文件服务器连接失败时，可以切换到 GitHub API 读取同一个 git blob；仍校验 TLS、提交、大小和摘要。两个路径均失败会保留已有目录并报告原因，不会显示“成功刷新了空目录”。

安装界面展示的关键状态：

| 状态 | 实际含义 |
| --- | --- |
| 未安装 | 只有公开目录信息，Agent 不会加载 |
| adapted / 方法已接入 | 已生成工具和资源适配信息，未证明业务结果 |
| needs-setup / 待配置 | 有外部工具、缺资源或宿主差异，报告列出具体项目 |
| ready-to-attempt | 本机基础条件允许开始任务，仍需实际执行验收 |
| requires-review-and-test | 存在脚本、依赖清单或宿主设置，需在任务中检查并验证 |
| runtimeVerified: false | 尚未实际跑通业务，不应写“全部兼容” |

安装不会自动更新已经使用的固定版本。发现上游新提交会提示 updateAvailable；现用包保持不变，避免在长任务途中替换行为。

## 使用与检查

在详情页查看适配报告；需要可复制的结果时：

```sh
koder skills store inspect github:技能ID --json
koder skills read github:技能ID --json
koder skills enable github:技能ID
koder skills disable github:技能ID
```

其中“技能ID”是目录返回的实际值，不要照抄占位词。禁用的技能仍能查看商店诊断，但不能被 Agent 调用。

对话中可以用 /skill 名称选择，再提交任务；也可使用 $名称，或在非交互任务中显式指定：

```sh
koder run '请按选定方法整理这份报告，保存为 report.md，并核对实际文件' --skill stop-slop
```

原文声明只允许用户手动选择的技能，不会在模型自动目录里出现。模型只能调用本轮真正挂载的工具，工具名称映射不会创造不存在的连接器，也不会跳过正常审批。

非交互安装必须从目录复制实际 ID 与完整固定提交，不接受 main、latest 等浮动引用：

```sh
koder skills store refresh --query 'repo:owner/repository' --json
koder skills store install github:实际ID --ref 完整40位提交
```

## 还缺什么工具

运行本机诊断，而不是按广告或仓库星数推断：

```sh
koder tools audit --json
koder skills audit --json
koder skills doctor playwright-cli
koder skills doctor video-shotcraft
koder skills doctor rea
koder mcp presets
koder mcp doctor earshot
koder mcp doctor codegraph
```

常见缺口包括视频的 FFmpeg / ffprobe、Playwright 启动器和浏览器、EARSHOT 本地模型、CodeGraph 启动器，以及目标应用或账号。REA 的入口已内置不等于 Ghidra、IDA、Frida 等外部引擎都已安装。Windows-MCP 的 Windows 包与 macOS 上“平台不支持”的诊断要分别看。

下载一个 Skill 不能自动补齐任何商业应用、外部服务凭据或 OS GUI 驱动。报告会给出已找到、未安装和待验证的项目；需要执行安装或测试时继续走现有项目任务、预算、取消与审批。

## 排障

| 错误码 | 处理 |
| --- | --- |
| COMPUTER_PERMISSION_REQUIRED | 按提示授予需要的 network / skills.update，已有技能可继续用 |
| SELF_FETCH_DISABLED | Setup → 任务 Harness 中检查遇缺自寻总开关 |
| RATE_LIMIT / SKILL_STORE_BACKOFF | 等待 status 中的重试时间，缓存不丢失 |
| SKILL_DISCOVERY_UNAVAILABLE | 候选资源无法读取；检查网络后再刷新，不会将空目录记为成功 |
| SKILL_SOURCE_CHANGED | 目录已更新，重新查看并选择实际固定提交 |
| SKILL_INSTALLED_VERSION_DIFFERS | 本机已有不同固定版本，未自动覆盖；保留原包并检查差异 |
| HASH_MISMATCH | 源文件与提交或本地清单不符，停止使用该候选 |
| UNSAFE_PATH / UNSAFE_RESOURCE | 路径含平台冲突、链接或不受支持的资源，拒绝安装 |
| SKILL_STORE_CANCELLED | 操作已取消，原目录与现有安装保留 |
| SKILL_NOT_FOUND / SKILL_DISABLED | 核对实际 ID、安装状态和 Setup 开关 |

参考：[Agent Skills 格式](https://agentskills.io/specification)、[GitHub 搜索 API](https://docs.github.com/en/rest/search/search#search-repositories)。第三方原作者与许可仍保留，不将第三方源码称为自研。


托管引擎的准备步骤另见[运行时教程](TOOL-RUNTIMES.zh.md)，配置后仍需核对实际任务结果。
