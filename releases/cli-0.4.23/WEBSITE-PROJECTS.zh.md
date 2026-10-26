# 网站设计、跨平台开发与项目锚点

适用版本：Koder CLI 0.4.23。[English](WEBSITE-PROJECTS.en.md) · [更新说明](RELEASE-0.4.23.zh.md)

Koder 默认接入 `builtin:fullstack-web-delivery`：先理解用途和读者，复用已有决定，讨论关键缺项，再完成设计、实现与验证。新站、改版和旧站修复共用这条流程。这里的跨平台指网站在桌面、手机和不同浏览器中的适配；不能据此宣称原生 Windows/macOS 应用已验收。

## 1. 更新与检查

在 Windows PowerShell/CMD 或 macOS Terminal 中运行：

```text
koder update
koder --version
koder skills list --query fullstack-web-delivery
koder skills doctor builtin:fullstack-web-delivery
```

预期版本为 `0.4.23`，列表中存在该 Skill。`doctor` 的 `readyToAttempt: true` 证明文本可读，`runtimeVerified: false` 仍表示没有替你完成网站或浏览器验收。若旧版本仍启动，Windows 用 `where.exe koder`，macOS 用 `type -a koder` 查找旧入口。

这套方法随安装包离线提供，不要求新模型或新账号。联网研究、安装依赖、编辑文件、命令和发布继续使用现有授权与审批。

## 2. 新项目独立建目录

```text
koder project create "Community Library" --kind website
```

项目位于用户主目录的 `Koder Projects/Community Library`，包含 `.koder/project.json` 和 `PROJECT-ANCHOR.md`。每个项目有独立编号。重名会明确报错，不覆盖原目录。交互终端会进入这个项目；否则按输出的 `koder chat -w ...` 命令进入。

在普通空目录或用户主目录中说“帮我建站”，也会自动创建独立目录。在已有项目里修改，继续使用原目录。若明确要另一个项目，说“另建一个独立的网站项目”，或使用 `/project create "Second Site" --kind website`。仅说“改一下首页”不会新建项目。

不要靠不断新建目录解决旧项目中的错误。需要修改现有工程时，使用实际路径：

```text
koder chat -w "C:\Users\你的用户名\Koder Projects\Community Library"
```

macOS 示例：

```text
koder chat -w "$HOME/Koder Projects/Community Library"
```

## 3. 先说目标，再讨论未知项

可以只输入：

> 做一个社区图书馆网站。

Agent 先读项目、锚点和设计约定，再通过原 `ask_user` 询问缺失的关键需求。例如服务谁、最重要的用户行动、页面范围和完成标准。问题按宿主上限分组，已有答案不重复问。你可以回答：

> 主要给附近家庭看。最重要的是找到开放时间，其次查看活动。首页、活动、联系即可。中文、手机优先、温暖编辑风格。只有馆名，没有照片；不要编开放时间，不加账号、支付或后台。

可逆的设计决定可以委托：“按合理假设先做原型，并标明未知项。”选“我补充需求”不等于已经提供需求。脚本或无交互运行不会被可选问卷卡住；未知项继续标为假设。假设不能替代账号、发布授权或真实业务数据。

## 4. 标准锚点如何使用

`PROJECT-ANCHOR.md` 保存稳定项目编号、用途、服务对象、主要结果、范围、非目标、约束和可观察的验收标准。文件中的结构化段可被工具读取，段外仍可放你自己的笔记。新建项目先是空白草稿，不会自动填入虚构目标。

```text
koder project anchor -w "你的实际项目路径"
koder project anchor -w "你的实际项目路径" --json
```

模型侧的 `project_anchor read` 读取；`project_anchor propose` 只生成提案，`written` 始终为 `false`。保存继续走原 `write_file` / `str_replace` 审批。提案依据当前文件 SHA；版本变了会报 `ANCHOR_STALE`，需要重新读取。工具不会替你取消原有权限。

局部修复不需要改中心思想。若从“居民查开放时间”改成“书店经营者采购图书”，工具会返回 `reframe-proposed` 和旧/新差异；Agent 要把影响讲清楚，根据真实用户决定后再保存。项目编号保持不变，历史记录保存之前的方向与哈希。真正不同的产品应另建项目。

原来已有纯文本锚点时，工具返回 `manual-review`，不会用模板覆盖。先阅读原文、核对含义，再用原编辑流程迁移；保留旧文和笔记。损坏的结构、符号链接和硬链接不会被静默当成可覆盖文件。

`DESIGN.md` 管视觉与交互约定，锚点管目标和范围，页面/实现计划管怎么做，测试报告管实际结果。不要用“写了锚点”代替“功能已完成”。

## 5. 需求确定后怎样推进

1. 明确主用户路径、页面、动作、加载/空/失败/成功状态及验收标准。仅在需要时安排后端、认证、数据库和内容管理。
2. 用原 `website_brief` 复用锚点和已知需求；按需用 `design_catalog` / `design_read` 查看随包设计参考，不重新发一轮相同问卷。
3. 新站或明显视觉改版通过原 `project_visuals` 展示三种有实质差异的版式。已有明确版式、简单修复或用户明确委托时，记录理由后按已定方向推进。
4. 先展示完整实施计划，再按主要业务路径落代码与测试。使用真实文案、原品牌、键盘焦点、移动布局及失败恢复；缺材料标注占位。
5. 用 `workspace_preview` 实际启动/打开预览，核对主要操作，再生成 `project_visuals` H5 结构图。交付文件、启动方式、实际命令、结果和未验项。

浏览器驱动不可用时，报告限制。HTTP 回读证明页面可访问，不证明视觉、触摸或键盘操作已通过。Windows 实机验收仍由 beta 专员完成。

## 6. 修复旧网站

```text
koder chat -w "旧网站的实际目录"
```

> 修复手机宽度下的导航换行。保持原网站目标、品牌、页面与技术栈。先读锚点，只改相关文件，运行原测试并给出预览。

Agent 默认调用同一个 Skill，但只执行适用步骤：读取已有事实、定位问题、提出必要取舍、修复、回归、预览。不会强制重做三稿、重填整套问卷或把旧工程搬到新目录。没有锚点时先从 README、设计约定和代码提取事实；无法确定的核心业务决定才询问。

## 7. 阅读原 Skill 与配套规格

```text
koder skills read builtin:fullstack-web-delivery --limit 4000
koder skills read builtin:fullstack-web-delivery --offset 4000 --limit 4000
koder skills read builtin:fullstack-web-delivery --path references/discovery.md
koder skills read builtin:fullstack-web-delivery --path references/specification-pack.md
koder skills read builtin:fullstack-web-delivery --path references/platforms.md
```

JSON 输出的 `nextOffset` 可用于完整分页读取。原包的 29 个文件保持逐字节不变，包括教程、UI/交互/动效/平台参考和可选规格生成脚本。脚本读取不会执行；默认主流程不依赖 Python。需要使用脚本时先读其说明，在当前项目内准备已回答的 brief，通过原命令审批输出到新修订目录；已有目录拒绝覆盖。生成规格不证明实际实现或测试通过。

## 8. 关闭和恢复

Setup → Skills 中可以单独开关，也可运行：

```text
koder skills disable builtin:fullstack-web-delivery
koder skills enable builtin:fullstack-web-delivery
```

关闭后新任务不再自动加入该流程和 `project_anchor` 模型工具。文件仍保留，`koder project anchor` 仍能查看。Awesome DESIGN.md、浏览器和其他 Skill 各自有开关；关闭此项不关闭整个建站能力，也不绕过原交付检查。Setup 的“全部关闭 Skill”包含此项。

## 开发者接点与验证边界

统一接线：`fusion/fullstack-delivery.mjs` → 原 Skills/host → 原 harness；`fusion/project-anchor.mjs` 只读和生成提案；CLI 项目创建写初始草稿，项目命令读取。JIT profile 仍过滤工具与 Skill，显式 deny、取消和费用预算保留。模型提示只加入短挂钩，详细原文按需分页，普通聊天不带锚点 schema。

本地自动验证包含新项目目录隔离、读原 Skill、问询/回答、原审批写入、旧站修改和真实 Node 测试、假设与变更提案、关停、原功能回归。模型决策使用确定性夹具；真实模型的设计质量、原生浏览器视觉操作和 Windows 设备结果不能由这些测试推定。

来源：KarmenLoop/fullstack-web-delivery 0.9.1，commit `72e05993c485210e255c1e950f424a53fb05be49`。原文件遵守其 Source-Available No-Modification License 1.0；Koder 接线代码单独实现，保留完整 LICENSE/NOTICE。此项不是 OSI 开源许可，也不替参考品牌授予商标或素材许可。
