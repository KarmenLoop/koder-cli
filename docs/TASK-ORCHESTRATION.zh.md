# 长任务、费用预算、Todo 与子 Agent

[English](TASK-ORCHESTRATION.en.md)

本指南描述当前源码中的内置 Koder Core。默认任务可以继续完成后续模型与工具步骤，`taskExecution.maxSteps` 为 `null`。模型仍按服务商规则计费；取消、用户设置的金额预算、权限、审批和结果待核实保护继续生效。安装包是否包含本增量，需要核对该包的版本、发布说明及 `koder harness status --json`，不能仅凭源码文档判断已升级。

## 先检查当前设置

在终端运行：

```sh
koder --version
koder harness status --json
koder model list
```

`taskExecution.maxSteps` 应为 `null`，或你之前明确设置的正整数。恢复默认不限轮数：

```sh
koder harness steps unlimited
```

需要自己设置保护值时，可用 `koder harness steps 60`。这是整项根任务的模型调用上限；工具审批恢复和引导补充不重置已用计数，子 Agent 也使用父任务的账。它不表示某条命令可等待 60 秒。命令的批准等待时间、取消、连接限制仍分别处理。

| 项目 | 当前规则 |
| --- | --- |
| 模型/工具循环 | 默认不设 16 或 24 轮产品上限；可显式设置 `maxSteps` |
| Todo | 无 64 项总数上限；保存完整清单，按页查看 |
| 选择和发现 Skill | 无四项选择或 200 项发现总数上限；目录与正文按需分页 |
| 子 Agent | 同一根用户任务最多 180 个已创建、尚未收集释放的子任务；可配置更低值 |
| 状态显示 | 子任务每页默认 20 条；分页不改变占用名额 |
| JIT 修复 | 原有最多两次自动修复仍保留；修改步骤上限不扩充修复额度 |

有限的单条文本、响应字节、压缩包、上下文投影和等待时间保护仍然存在。分页或截短的模型视图不等于删除完整计划、历史或原始回执。

## 设置一份父子共享的金额预算

预算使用用户提供的逐模型价格，不自动查价，也不保证等于服务商最终账单。先从当前模型配置及你的计费合同核对模型 ID、币种、输入/输出单价，再运行：

```text
koder harness budget <金额> USD|CNY <实际模型ID> <每百万输入token价格> <每百万输出token价格>
```

例如，以下 `YOUR_MODEL_ID` 和数字都是说明用占位值，必须替换后使用：

```sh
koder harness budget 1 USD "YOUR_MODEL_ID" 2 8
koder harness status --json
```

这表示单项根任务的预算为 1 USD，输入价格为 2 USD/百万 token，输出价格为 8 USD/百万 token。若子任务会使用另一模型，再以**同一总金额、同一币种**为该模型配置价格：

```sh
koder harness budget 1 USD "YOUR_CHILD_MODEL_ID" 1 4
```

同币种调用保留之前的模型价格，并更新总金额；更换币种会重新建立该币种的价格表。这里增加的是可计价模型，不是另给子任务 1 USD。每个可能使用的实际模型 ID 都需要价格，不能用配置别名代替账中的模型 ID。

每次请求前，Core 根据模型配置的输入窗口与输出上限预留金额：

```text
本次预留 = (输入窗口 × 输入单价 + 输出上限 × 输出单价) / 1,000,000
可用金额 = 总预算 - 已结算金额 - 所有父子任务正在占用的预留
```

例如输入窗口 10,000、输出上限 1,000，单价分别为 1 和 2，预留为 0.012；收到 5,000 个输入 token、0 个输出 token 的可信用量后结算 0.005。它采用配置窗口作保守预留，因此可能在剩余金额仍大于零时拒绝下一次调用。

| 诊断 | 应如何处理 |
| --- | --- |
| `TASK_COST_PRICE_REQUIRED` | 为将使用的实际模型补全同币种价格，再核对配置 |
| `TASK_COST_BUDGET_EXHAUSTED` | 查看已完成结果与预留；由用户决定是否调整后续任务预算 |
| `TASK_COST_UNCONFIRMED` | 用量缺失或已有未结算请求；先核对，不能当作零费用重试 |
| `TASK_COST_RESERVATION_EXCEEDED` | 实际用量超出配置预留；检查模型窗口/输出上限及用量记录 |
| `TASK_COST_ENGINE_UNMETERED` | 当前外部引擎或多模型顾问没有统一逐请求预留，启用金额预算时不启动该路径 |

`koder harness budget off` 移除本地金额保护，服务商继续正常计费。设置是新建会话读取的策略；修改后先结束当前工作并重新打开聊天，核对状态。不要通过新建任务来掩盖未知用量。预算只核算这里收到的模型 token 用量，不覆盖第三方工具或云服务的其他收费。

## 实操一：保存可调整的任务计划

1. 在独立练习目录新建 `input-a.txt`，内容为 `2 + 3`，再建 `input-b.txt`，内容为 `7 - 2`。启动 `koder chat`，明确这次只处理这两个文件。
2. 请求“创建 a、b、verify 三项 Todo；a 和 b 分别处理两个输入，verify 依赖 a 和 b；先展示计划”。只有 `a`、`b` 应当就绪。Todo 的 `completed` 是计划状态，实际完成还要查文件与工具回执。
3. 用 `/todo` 查看第一页、`/todo 2` 查看后续页。展开底栏后，`/todo next`、`/todo prev` 或 PgUp/PgDn 切页；Ctrl+T 折叠时草稿保留。
4. 要调整计划，说明具体项 ID、依赖和优先级。模型可以调用 `todo_set` 的 `upsert`、`set_deps`、`reorder` 或 `replan`，不必替换成一份失去历史的新清单。`revision` 不匹配会返回 `TODO_REVISION_CONFLICT`，应先读取最新版本再修改。
5. 完成后逐项核对产物，再将验证项标记完成。输入缺失时标记 `blocked` 并写明缺什么；执行失败用 `failed`。取消会把执行中的项恢复为待办，已完成项保留。

供开发者核对的 `todo_set` 参数示例；这是模型工具参数，不是终端命令：

```json
{
  "op": "replace",
  "items": [
    {"id":"a","title":"计算 input-a.txt","status":"pending","priority":2,"assignee":"parent"},
    {"id":"b","title":"计算 input-b.txt","status":"pending","priority":1,"assignee":"parent"},
    {"id":"verify","title":"核对两个计算结果","status":"pending","dependsOn":["a","b"],"assignee":"parent"}
  ]
}
```

验收：`readyIds` 为 `a`、`b`；给 `a` 添加对 `verify` 的依赖应报 `TODO_CYCLE`，清单不接受循环。读取参数 `{"op":"read","offset":0,"limit":20}` 返回 `total`、`revision` 和 `nextOffset`。删除一个仍被其他项依赖的 ID 会报 `TODO_DEPENDENCY_MISSING`，需要一起调整相关依赖。

## 实操二：委派两个独立子任务并收回结果

接着上面的练习，在同一聊天明确请求：

```text
将 a 和 b 分别交给两个子 Agent。它们各自读取 input-a.txt、input-b.txt，
分别把结果写到 results/a.txt、results/b.txt；只授权各自的结果文件。
先声明互不重叠的 writePaths，沿用当前已配置模型和费用预算。
父任务等待并收集工具回执，再读取两个结果文件验证，最后完成 verify。
不要调用 shell、外部账号或发送消息。
```

两个文件的预期结果都为 `5`。实际模型可能采用不同步骤；验收依据是两份文件与已保存回执，不能只看子任务自述。

1. 输入 `/subagents status`。每行显示 ID、状态、模型、请求的思考强度和实际映射强度。超过一页时用 `/subagents status 2`；`active` 是全部未释放名额，不是当前页面行数。
2. 模型使用 `subagent_collect` 收取结果；终态 `done`、`failed`、`cancelled` 且执行已经收尾的子任务，被收集后才释放名额。运行中或正在取消的任务尚未释放，重复读取状态不会自动释放名额。
3. 要取消一个任务，使用列表中的真实 ID：`/subagents cancel a`。不带 ID 的 `/subagents cancel` 取消本根任务的所有运行中子任务。停止父任务也会传播取消；已执行的效果不会撤销。
4. 收集后检查原始回执与文件。结果中保留子任务引用、工具回执和产物；展示文本可能截短，完整内容仍保存在原会话。若存在 UNKNOWN，收集可以释放名额，但父任务仍不能继续写入、运行 shell 或通过新子任务重放。
5. 由父任务统一核对 Todo、合并结果和总结。子任务需要继续分工时向父任务提出；直接嵌套创建会被 `SUBAGENT_DELEGATE_VIA_PARENT` 拒绝。

`writePaths` 是相对工作区的明确文件或目录，例如 `results/a.txt`、`src/parser`。目录覆盖子路径；`src` 与 `src/a.mjs` 冲突，`src` 与 `src-two` 不冲突。未释放的归属也约束父任务。一般子任务未声明写路径时只读；任意 shell 命令需要独占 `**`，仍须原审批。路径归属不能替代电脑权限或文件审批。

父任务当前不允许的工具不会交给子任务，显式指定越界工具返回 `SUBAGENT_TOOL_REQUIRES_PARENT`。MCP、GUI、邮件和其他外部账号操作交给父任务按原授权处理。子任务在原 Core 中运行，使用同一根任务的成本与取消机制，不借用多模型顾问替代执行。

模型和思考强度是两个独立字段。`model` 只能选已配置的唯一模型绑定或明确模型 ID；未知或有歧义的 ID 返回 `SUBAGENT_MODEL_UNKNOWN`。`thinkingEffort` 只接受 `deep`、`standard`、`fast`、`off`。名称含 `flash` 的模型可以请求 `deep`，`fast` 也不是一个模型名。服务商不支持所请求强度时会显示映射结果/提示，不宣称该强度已生效。参见[模型与思考强度](SESSION-CONTROLS.zh.md)。

长结果可通过 `subagent_collect` 按返回的游标继续读取，不必重新执行任务：

| 要读取的内容 | 下次请求参数 | 本次响应的后续位置 |
| --- | --- | --- |
| 子任务列表 | `offset`、`limit`（默认 20，最多 180） | 顶层 `nextOffset` |
| 子任务回答 | `textOffset`（每页最多 12,000 字符） | 每项 `nextTextOffset` |
| 回执列表 | `receiptOffset`、`receiptLimit`（默认 20，最多 180） | 每项 `nextReceiptOffset` |
| 某条回执正文 | `contentOffset`（每页最多 1,200 字符） | 每条回执 `nextContentOffset` |

用 `ids` 固定一个子任务，再用 `receiptOffset` 和 `receiptLimit:1` 定位某条长回执，按其 `nextContentOffset` 继续读；`null` 表示该部分已读完。这些是模型工具参数，`/subagents status [page]` 只提供状态列表分页。收集已释放结果仍可回读，不会重复工具操作。

## 实操三：缺 Skill 时查找、固定版本、学习再继续

先用现有本机目录：

```sh
koder skills list --query "csv" --json
koder skills list --query "csv" --offset 50 --limit 50 --json
```

找到后用 `koder skills show <完整ID>` 阅读；未在第一页看到不代表不存在。需要公开检索和安装时，当前电脑 owner 必须已批准 `network` 与 `skills.update`。授权入口为：

```sh
koder permissions request --capability network --capability skills.update
koder skills seek "csv report" --json
```

查询词只包含适合公开的任务类别，不包含密钥或私有项目内容。检查返回的仓库、许可证、候选 ID 和固定提交 `ref`，再替换下面两个占位值：

```sh
koder skills fetch "ID_FROM_SEEK" --ref "COMMIT_FROM_SEEK"
koder skills show "INSTALLED_ID_FROM_FETCH" --json
```

`ref` 必须是候选的完整 40 位提交 SHA。来源变化或版本不匹配会失败，不能猜一个分支名跳过检查。下载的完整包经过哈希检查后进入原 Skill 库；脚本和资源保持未执行，返回 `executed:false`。安装成功只表示资源可读。

Agent 路径对应 `skill_seek → skill_fetch → skill_read → 重试原来尚未完成的一步`。先读 `SKILL.md` 及相关资源，再用当前真实工具和原审批执行。下载内容是来源资料，不能授权新账号、扩大工具范围、覆盖用户限制或解除 UNKNOWN。

若缺的是 CLI，`tool_seek` 可查询公开候选；核对官方固定版本说明、许可证、命令与目标目录后，`tool_bootstrap` 沿用原 shell 审批、等待和取消流程。工作区外目标还要电脑写入范围授权；审批返回后再次检查授权。`--yes` 不绕过 `network`、`skills.update` 或电脑 owner 的拒绝。权限拒绝、取消或来源问题应报告实际卡点。

Agent 的自寻工具连续三次使用相同参数、得到相同错误且没有新信息时，下一次相同尝试返回 `SELF_FETCH_NEEDS_DECISION`。可改用有依据的新候选/参数，或由用户明确要求“继续找”。这是重复失败保护，不是整项任务只能尝试三次；明确继续也不会解除权限、金额预算或 UNKNOWN 保护。

## 设置与恢复

Setup → 技能 → 任务 Harness 提供「可选模型轮次上限」、「带工具的子 Agent」和「遇缺自寻 Skill / 工具」开关。以下字段属于现有配置，示例是要合并的片段，不能覆盖整个配置文件：

```json
{
  "taskExecution":{"maxSteps":null},
  "subagents":{"enabled":true,"cap":180},
  "selfFetch":{"enabled":true}
}
```

`subagents.cap` 可为 1–180，不能超过 180。两个 `enabled` 开关控制功能可用性，开启不授予电脑或账号权限。源码已接通这些菜单；已安装旧版本仍需核对实际功能。新开聊天后再核对。引导、排队及恢复规则参见[会话输入](SESSION-INPUT-AND-SKILLS.zh.md)、[Todo 界面](SESSION-DOCK.zh.md)和[命令结果核对](SHELL-RECOVERY.zh.md)。

## 已验证范围与回归入口

隔离任务 `CK-20261026-cli-task-steps` 的 `evidence/subagent-regression-final-27.tap` 记录 27/27 通过：实际 runtime 的 180/181 边界、收集、取消、归属、分页、根任务隔离、模型选择、UNKNOWN 保持阻断、父工具范围，以及真实 Core 的共享金额账。180 个子任务使用受控执行 port；费用测试使用合成 provider，没有 180 个付费服务商会话或真实多人测试。

`evidence/subagent-budget-integration.log` 记录 11/11，覆盖 CLI 长任务、显式轮次上限和金额预算回归；`evidence/todo-cli-regression.log` 记录 10/10，包含 100 项 Todo。源码中的 [self-fetch 回归](../test/self-fetch.test.mjs)使用自有仓库响应、原工具与隔离目录，不代表联网安装任意第三方包已通过。早期失败及取消日志保留，不用后续局部通过覆盖整套验收状态。

后续 `evidence/orchestration-regression-v1.log` 记录一次综合回归 144/144 通过、0 失败、0 取消。这是该次隔离源码回归的结果；新增边界复查和发布验收分别记录，不由这个数字推断。

从源码根目录可运行下面的有限回归，不需真实模型账号：

```sh
node --test koder-desktop/test/subagent-runtime.test.mjs koder-desktop/test/subagent-match.test.mjs
node --test koder-cli/test/task-step-budget.test.mjs koder-desktop/test/task-cost-budget.test.mjs
node --test koder-cli/test/self-fetch.test.mjs koder-cli/test/subagents.test.mjs
```

Windows 原生终端、macOS 原生交互、真实模型自主规划质量、生产费用准确性、真实账号效果和线上发布仍需分别验收。本指南不把源码、夹具或本地 IPC 结果算作这些项目的通过。
