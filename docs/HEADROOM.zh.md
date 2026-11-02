# Headroom 上下文优化

[English](HEADROOM.en.md) · [简体中文](HEADROOM.zh.md)

Koder 在原任务循环内默认启用 `builtin:headroom`。直接使用 `koder`、`koder chat`、`koder ask`、`koder run`；常驻任务复用同一内核。无需手动调用 Skill，也不需要额外代理、Python、压缩模型或账号。

## 它优化什么

| 工具结果 | 原生表示 | 保留内容 |
| --- | --- | --- |
| 根数组或嵌套对象中的同结构 JSON 数组 | `json-table` / `json-tables`：列名只写一次，逐行保存值 | 全部行、列序、重复键、大整数、负零、指数写法、字符串转义与外层结构 |
| 其他有效 JSON | `json-compact` | 只去掉字符串外的格式空白；不重新序列化浮点数 |
| 完全相同的连续 shell/search 行 | `line-runs` | 原行与重复次数 |
| 交错重复的 shell/search 行 | `line-dictionary` | 原行字典与完整顺序索引；保留每次出现、CRLF 和末行 |

每个表示先做独立反向校验。JSON 校验保留原词法值，格式空白通过原文读取恢复；日志逐字还原。不会默认抽样删行、删代码体、重排消息或合并不同记录。

收益门槛包含格式头：至少减少 15% 且 256 个 UTF-8 字节，同时原生 token 估算必须下降。整次请求还要覆盖新增方法提示、读取工具定义与余量；不够就原样发送。没有变换时不加入 Headroom 提示或读取工具。

默认单结果范围为 1,200–262,144 字符，每次最多处理 2,097,152 字符的合格工具正文，优先当前结果。过大的旧结果不会耗尽这一预算。解析失败、复杂度超限、估算异常或无收益时保留原文，并在本地统计中记录原因。

## 原文、权限与会话隔离

原文保留在已有会话，不创建第二套原文数据库。格式头包含 `toolCallId`、`sha256`、`kind` 和 `rawChars`。Agent 可调用：

```json
{"toolCallId":"当前会话调用 ID","sha256":"原文 SHA-256","offset":0,"limit":1000}
```

工具为 `headroom_read`；`limit` 为 1–12000 字符。需要定位时增加 `query`，它是区分大小写的 1–256 字符字面量，不执行正则。查找每次最多扫描 2 Mi 字符，未命中但仍有后文时按返回的 `nextOffset` 继续；扫描窗口保留交界重叠，避免漏掉跨边界的关键词。

读回只访问当前 thread 的匹配原文，校验 ID 与 SHA；不读文件、不联网、不读取其他窗口、不重跑原工具。原文已不可用时报告 `HEADROOM_RESULT_UNAVAILABLE`，不会用“重执行一次”补造旧证据。授权码及 `request_login` 的结果不能通过此工具读回。

以下内容不变换：用户、助手及系统文字，`read_file` 源码，`skill_read`，写作事实源，凭据结果，签名 provider 块，未完整返回的工具批次，失败、待核实及未知回执。成功 shell 输出可以压缩表示，其退出码、清理结果和批准回执保持原样。普通 MiniMax 推理字段本身不改写，也不会错误地把整个已完成工具结果当作签名块。

每个会话有独立的派生结果缓存，最多 128 项、1 MiB 记账字节（不是整个进程的 RSS 上限）。不额外缓存原文，不跨会话共享，不写磁盘。缓存键含调用 ID、工具名和原文 SHA；正文变化重新计算，关闭后清空。它不等于服务商 prompt cache。

## 与长任务压缩的关系

Headroom 位于模型请求投影中，在已有上下文预算选择之前运行。磁盘原文、权限、取消、费用预算、JIT 和 UNKNOWN 对账继续由原实现负责。

历史自动压缩是另一项已有能力：Setup → 上下文与输出或 `/context`，默认 80% 触发、60% 目标、优先最近 4 轮，仍受实际窗口限制。`/context off` 不会关闭 Headroom；关闭 Headroom 不会关闭历史压缩。必要的协议恢复仍处理缺失的私有模型状态，硬窗口不足时保留历史并报错。详见[上下文设置](CONTEXT-CONTROLS.zh.md)。

若当前窗口放不下压缩表示或原文页，投影保留合法的 `not-loaded` 引用、原文定位和 `readWith`；正文标明 `NOT_LOADED`，不截断成损坏的表格。Agent 必须按同一 offset、较小 limit 重读后再使用证据，不能把未读页当完整结果。Skill 分页也遵守这一规则，未读页不提供可误用的下一页游标。

Headroom 不扩大模型的物理窗口，不保证无限长任务，也不保证模型一定主动读回所有所需证据。

## 设置

进入 `/setup` 或 `koder setup` → 技能 → Headroom 上下文优化：

1. “自动优化工具结果”控制原生投影和提示。
2. “减少答复重复”单独控制表达指导；完整代码、文稿、证据、解释和用户字数要求始终优先。
3. “一键关闭全部技能”包含此项，保留文件和其他设置。独立终端修改后重开原会话，不打断其他窗口。

```sh
koder skills show builtin:headroom
koder skills doctor builtin:headroom
koder skills disable builtin:headroom
koder skills enable builtin:headroom
```

聊天内可用 `/skills` 执行同样操作。合并已有 config.json 中的以下字段，不覆盖其他配置：

```json
{"headroom":{"enabled":true,"shapeOutput":true,"minChars":1200,"maxChars":262144}}
```

`minChars` 范围 256–65536，`maxChars` 不小于 minChars、最大 1048576。更大的结果原样通过。

## 如何核验

`koder run --json` 的最终 result 含最近一次请求的 `headroom`：

| 字段 | 含义 |
| --- | --- |
| enabled / transformed | 当前开关及采用变换的结果数；0 是正常情况 |
| beforeBytes / afterBytes / overheadBytes | 已变换正文及新增表示头的 UTF-8 字节、附加说明/工具开销估计 |
| beforeTokens / afterTokens / overheadTokens / estimatedNetTokens | 同一个 Koder 分词估算器的估计；`tokenBasis=estimate-not-billed` |
| scannedChars / scanLimitChars | 本次合格正文处理量与上限 |
| cache | 本地派生缓存命中、项数、记账字节上限 |
| skipped | 保护、格式不支持、复杂度、收益不足等原因计数 |
| metrics | 调用 ID、SHA、表示类型及前后计数；不含原始正文 |

这些字段不是累计付费 token、模型质量分、整个请求的准确差额或服务商缓存命中。实际账单以服务商 usage/计费为准；压缩后的额外读回也会产生输入成本。

## 来源与实现边界

原有便携 Skill 固定于 [roman-ryzenadvanced/headroom-skill](https://github.com/roman-ryzenadvanced/headroom-skill/tree/118466d7737ebc42806c331e44bd251b5222d59b)，Apache-2.0，保留其参考脚本、LICENSE 与 NOTICE，脚本不自动运行。

本轮进一步研究完整 [Headroom 项目](https://github.com/headroomlabs-ai/headroom/tree/fc1ba891bff2d1e0cb53c4ffd4037f5066988c8e)（旧地址 chopratejas/headroom），固定提交 `fc1ba891bff2d1e0cb53c4ffd4037f5066988c8e`，Apache-2.0。Koder 的有界词法压缩、会话读回、预算接线与缓存由原生 Node 实现；没有复制上游 Python/Rust 引擎、模型权重、代理或另一份 Skill。开源来源和已有第三方权利保持原样，不能把上游代码改个名字称为全部原创。

上游有损选择、代码骨架化、ML 压缩和跨调用自动扩展不作为 Koder 默认能力。其历史文档中的滚动删消息、跨用户 TOIN 描述与当前架构不一致；本实现按固定版本源码和新架构核对，不照搬旧文档。上游宣传数字不是 Koder 测试结果。

## 验收边界

回归覆盖配置与 Setup、原生表示、数值词法、失败保护、SHA 读回、查找边界、双会话隔离、run/chat/IPC 及 8K 上下文分页。合成真实模型检查证明一次指定原文核对链可调用，不等于完整任务质量或成本基准。

Windows、Ubuntu 原生运行、全部模型/协议、真实长任务质量与计费仍需各自验收。安装版本以 CLI 官网正式清单为准；源码候选和本地打包不代表已上线。

