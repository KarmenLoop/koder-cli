# 无头任务：先落盘、自检、交件，再收卷

本契约适用于内置 Koder 引擎的 `koder run`。不会强制联网、上传日志、读取账号密码或改变电脑权限。调用模型仍使用原模型配置；下面的本地回归不需要模型密钥。

## 1. 每题一个任务，续接必须明确

`run` 未指定 `--session` 时使用新的 `run-<UUID>` 会话，并打印 `RUN_SESSION`。不再自动恢复上一条批量任务的 `default` 历史。聊天与 `ask` 的历史连续性保留；独立会话不等于独立文件沙箱，批量题目仍应分别使用工作区或输出目录。

```sh
koder run "完成 Q001 的交付要求" -w /absolute/exam --yes --json > Q001.ndjson
# 继续同一题：用上一条 RUN_SESSION 中的完整名称
koder run "先核对已保存结果，只补剩余工作" -w /absolute/exam --session run-UUID --yes --json
```

旧任务和未知操作回执不删除。恢复时残留的 `running` 标记转为 `unknown`，允许读取文件、回执等诊断；不会重复执行旧命令，也不会因此获得新的写权限。新任务不应重放旧任务尚未核实的操作。

## 2. 文件要求复杂时使用显式交付合约

从 0.5.20 起，普通 Agent 任务中明确写出的“必交清单 / 全部交付 / required files”会自动生成文件合约。例如：“必交清单：out/report/answer.mjs、out/report/NOTES.txt、out/report/DONE、out/report/MANIFEST.tsv”。缺件不能退出成功。无扩展名、`.code`、`.tsv` 和准确大小写都保留。抽取器优先处理明确标记的任务区，不从引用、围栏内的示例、工具返回或手册诱饵替换清单。它是有限的字面抽取器，不能推断缺失的公式、数据或任意自然语言条件；复杂要求应提供显式合约。

把 `contract.json` 放在工作区内，通过 `--delivery-contract contract.json` 指定。显式合约优先于自动抽取。网页、日志、工具返回的 `SUBMITTED` 或模型生成的清单不能更改宿主要求。外部引擎没有同等回执接口时会明确拒绝该参数，避免假装验过。

```json
{
  "version": 1,
  "questionId": "Q001",
  "outputRoot": "out/Q001",
  "files": [
    {"path": "answer.mjs", "kind": "code", "minBytes": 10},
    {"path": "result.json", "kind": "json"},
    {"path": "verify.mjs", "kind": "code"},
    {"path": "selfcheck.code", "kind": "exit-code"},
    {"path": "MANIFEST.tsv", "kind": "manifest"}
  ],
  "verification": {"command": "node out/Q001/verify.mjs"},
  "skip": {"path": "SKIP.md", "minBytes": 120}
}
```

```sh
koder run "按 contract.json 完成当前题。先写可运行的最小解，再自检修复。" \
  -w /absolute/exam --delivery-contract contract.json --yes --json > Q001.ndjson
code=$?
printf 'Koder exit: %s\n' "$code"
```

PowerShell：把命令写成一行，结束后读取 `$LASTEXITCODE`。不要把 Bash 的 `code=$?` 直接粘贴到 PowerShell。

`--yes` 仍只适用原本可批准的任务操作，不能提供系统权限、密码或学习权限。合约中的验证命令是直接调用（不接受管道、重定向、串接或命令替换）；需要这些步骤时写进单独的自检脚本，并如实传递失败退出码。命令仍走原审批。不要在合约中填写密钥。

建议目录：

```text
exam/
  contract.json
  inputs/                  # 只读题目材料，不放判题金标
  out/
    Q001/
      answer.mjs           # 实现，不带 Markdown 外围围栏
      result.json          # 有效 JSON，不是解释文字
      verify.mjs           # 真正验证题目要求的程序
      selfcheck.code       # 验证程序记录的退出码
      MANIFEST.tsv         # 文件路径、字节数和 SHA256
      SKIP.md              # 只有合约允许且确实无法完成时才写
```

每题日志保存在独立日志目录，避免把整棵历史文件树拼进答卷。题目有不同要求时分别提供合约；不要从旧题的 `PASS` 或已有 `.code` 文件跳过本题。

## 3. 宿主实际检查什么

文件路径相对 `outputRoot`，必须准确匹配大小写。拒绝绝对路径、`..`、软链接、硬链接、大小写碰撞及不兼容路径字符。逐个读取合约文件，不因旁边有上百道旧题而扫描失真。

每文件默认最多 200,000 字节，可用 `maxBytes` 在此范围内收紧；最多 64 个文件，总量最多 2,000,000 字节。这是检查器读取范围，不是工具次数或任务时长限制。超出检查范围返回未核实，不截断后当合格。

`code`、`json`、`exit-code` 文件不能以三反引号或波浪号围栏开头。`json` 必须能解析。大小以 UTF-8 实际字节计，不能用字符串长度或聊天字数代替。

`MANIFEST.tsv` 每行是以下三列，以真正的 Tab 分隔，不加表头：

```text
answer.mjs<TAB>实际字节数<TAB>64 位 SHA256
```

清单覆盖其余合约文件，不包含清单自身。宿主重新读取文件验证，不信模型自报哈希。多清单均须覆盖全部非清单文件。

验证必须出现当前任务中、命令与合约一致的工具调用，以及 `process-exited`、`exitCode=0`、`cleanupComplete=true` 的回执。输出中写“测试成功”、生成 `selfcheck.code=0`、创建 `SUBMITTED`、旧的 PASS，都不能替代这个回执。

实现、结果及验证脚本在验证前后必须保持相同哈希；验证后修改任何这些文件需要重新检查。`selfcheck.code` 与清单可由验证程序在检查结束时生成，随后仍绑定当次文件哈希。验证脚本应保留失败退出码，不能用 `|| true`、结尾 `echo` 等把失败变成成功。

普通任务也修正了 `bash selfcheck.sh` 等自检入口的识别，但脚本退出 0 只证明该检查完成。测试是否覆盖题意、算法是否正确、文稿是否有深度，仍需要独立评审；宿主不把空测试等同于高质量。

## 4. 合格 SKIP 与终态

只有合约声明 `skip` 才接受 SKIP。必须由本轮真实写入，达到配置大小，并包括三节非空实质内容：

```markdown
## Reason
说明缺少的关键输入、实际约束或无法完成的原因。
## Evidence
说明已完成、未执行及未知部分，引用现有产物或检查结果。
## Next step
给出继续需要的输入和具体下一步，不重复未知副作用。
```

合格 SKIP 的 `taskDeliveryEvidence.disposition` 为 `skipped`，`reasonCode` 为 `TASK_SKIPPED`，退出码仍为 3，不冒充成功，也不自动开展新的修复轮次。不能保证外部考试给 SKIP 的分数高于空题。CLI 不凭未知时间预算自动替用户交卷；外层超时或被强杀仍应记为中断/未知。

0.5.20 为模型截断或未通过检查的任务增加收尾：只有合约允许、没有取消或未知副作用、原审批允许写入且文件尚不存在时，宿主才保存 `SKIP.md`。这份文件明确标为运行时失败记录，列出原因码、已有与缺失文件数量、继续条件；它不是模型答卷，也不证明 SKIP 的语义理由被外部评审接受。已有或部分写入的文件不覆盖。

合约要求 `REFUSAL.md` 时，宿主的真实范围拒绝回执可生成“未执行”记录。只有模型口头拒绝时，文件会说明缺少宿主拦截证据，保留 `TASK_REFUSAL_UNVERIFIED`。不能用一句“不执行”冒充危险操作确实被拦截。

自动化读取最后一条 `type: result`，同时核对真实进程退出码、`completionState` 和 `taskDeliveryEvidence`。成功要求退出 0、`completionState=succeeded`、交付检查 `checked`。答卷长度、日志里出现 PASS、目录非空，都不是收卷条件。

## 5. 本地逐题遥测

默认开启，可在 `koder setup` → **本地任务遥测** 关闭。也支持无头配置：

```sh
koder setup telemetry status --json
koder setup telemetry off
koder setup telemetry on
```

开关保存为 `telemetry.enabled`，从下一任务开始读取。关闭后不创建逐题统计器、不向日志或会话写入新的 `task-telemetry`，终态仅带 `telemetry: {enabled: false, scope: "local"}`；不会删除既有日志。必要的执行回执、故障诊断、取消、费用预算以及独立配置的学习功能继续工作。配置非法时停止可选统计，Setup 可以重新保存有效设置。

以下字段说明适用于遥测开启时的内置执行器。ACP 等外部执行器的内部统计没有接入，不伪造其 token 或重试。

终态 JSON 包含 `telemetry`：任务与会话编号、合约 `questionId`、起止时间、模型请求数、工具调用/失败/未知、重复调用指纹计数、传输重试次数、交付修复次数和 `artifactRecoveries` 截断产物恢复次数。统计也进入原本的本地 `logs/runtime.log`（`event=task-telemetry`），沿用原日志权限、脱敏字段白名单和轮转。

在任务已进入会话、但合约加载等前置步骤失败时，终态 JSON 返回错误码；本地 `task-telemetry` 仍记录零模型请求和对应失败退出码。更早的参数解析或 EULA 拒绝尚未创建任务，不伪造任务用量，保留原 CLI 诊断事件。

`tokens.input/output` 只有所有请求都返回服务商用量且没有未核实的传输重试时才给出总数，否则为 `null`。`reportedInput/reportedOutput` 是已报告小计；`unknownRequests` 明确列出缺口。不会用 `输出字节数/4` 冒充 token。中断回复携带的正式用量仍计入已报告小计。

`wasted.tokens` 保留 `null`：目前没有足够证据把特定 token 因果归为浪费。失败工具和重复指纹是观察数据，重复读取也可能合理，不能直接换算浪费费用。子 Agent、外部 runner 内部重试不混算成本；若评测需要全树费用，必须另接各执行者的用量回执。

已有金额预算和取消机制不变，工具次数仍不新增上限。遥测不包含任务原文、邮件正文、命令参数或密钥，也不上传云端。断电/强杀导致没有终态时，由外层进程监考记录退出与 UNKNOWN，不能补造成功。

## 6. Meta 回归

```sh
npm run test:headless-meta
```

本地回归包含：短路径、准确大小写、输出被围栏包住、伪造 code/清单/SUBMITTED、旧题目录污染、实际自检退出失败、未知回执、验证后改文件、合格与不合格 SKIP、逐题实际用量与缺失报告，以及 CLI 子进程终态。它们依据 harder 暴露的失效类型设计，运行的是隔离夹具，不读取判题金标，不把这组测试算成原三场考试的语义成绩。

已延期：云端强制联网、自动上传故障日志、一键服务器反馈。本文没有开启这些机制。

## 7. 输出截断、恢复与任务范围

命令输出超过显示捕获上限时，继续排空输出并保留有界预览，回执标记 `outputTruncated`。只有输出较多且进程正常退出，不再直接制造 UNKNOWN 或锁住后续文件交付。需要完整输出时由任务把它保存到获准的文件；CLI 不承诺在内存里保存无限日志。命令期限、取消、仍存活的子进程和清理失败依然保留未知结果保护，不自动重放。

模型输出截断且工具参数不完整时，这个调用执行零次。文件合约任务可在原回合重建一个完整的小文件调用；截断恢复和交付修复合计最多两次。每次新请求仍检查取消和原费用预算；缺失用量或预算不足不会再请求模型。最终检查不通过仍是非零退出。

合约任务具有工作区范围：文件读取限定在当前工作区，自动抽取的 v2 合约把写入限制在 `outputRoot`；显式 v1 合约为兼容原流程保留整个工作区写入。Apps、外部插件及子 Agent 不在该受限工具集合中，`--yes` 不扩展范围。普通没有文件合约的任务继续沿用原电脑权限与审批。

任意脚本需要真正的系统隔离，不能只检查命令字符串。当前实现如下：

| 平台 | 合约内 shell | 当前证据 |
| --- | --- | --- |
| macOS | 系统 `sandbox-exec`；任务目录和必要系统运行库可读，输出根可写，网络禁止 | 本机真实进程验证：允许当前任务写入，直接读取、脚本、子进程和变量展开均不能读相邻目录 |
| Linux | 已安装 `/usr/bin/bwrap` 时使用独立 namespace 与只读输入挂载 | 适配代码已提供；目标机器的 bubblewrap / user namespace 可用性需实测 |
| Windows | 尚无可用的受限 shell 宿主，返回 `TASK_SCOPE_SANDBOX_UNAVAILABLE`；文件工具可继续交付 | 不宣称任意 Windows 脚本已隔离；实机由 beta 专员验收 |

不会为了运行 shell 自动安装隔离组件、申请管理员权限或降级成不隔离执行。目录内含软链接、硬链接、`.git`、`.env` 等敏感树，或预检超过有界目录规模时，受限 shell 会明确拒绝。把题目所需的非敏感输入复制到专用工作区再运行；不要把个人主目录或含密钥的项目当考试沙箱。它保护任务范围，不证明范围内任意程序的业务语义正确，也不替代目标平台的安全审计。
