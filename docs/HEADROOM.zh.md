# Headroom 上下文优化

Koder CLI 0.4.5 将 Headroom Skill 的方法接入原任务循环，默认启用。
直接运行 koder、koder chat、koder ask 或 koder run 即可使用，无需先发一条“调用 Headroom”。
已激活常驻宿主时，任务仍通过同一 Core 使用这项能力。

## 做了什么
- JSON 表格重复字段可以变成列名与逐行值；保留全部行、顺序、大整数、负零、重复键和字符串。
- 其他有效 JSON 只移除字符串以外的格式空白。
- 完全相同的连续命令日志或搜索行可以记录一次并附次数，保留原始顺序和换行。
- 在采用变换的请求中，方法提示默认减少重复展示代码、日志及客套开头；用户要求的完整成稿、代码、详细解释和字数要求始终优先。

所有变换先检查可还原性，并计算包含格式标记后的实际大小。少于 15% 或 256 字节的收益不会采用。
整次请求还要覆盖额外说明和原文读取工具的估算字节开销；收益不足时保持原样。
仅在确有采用的变换时加入说明及读取工具，避免空任务的小窗口被额外定义占用。
默认处理 1,200 至 262,144 字符的单项工具结果，每次请求最多扫描 2,097,152 字符的工具正文。
这里只是节省上下文空间，不会扩大神经网络的上下文窗口，也不保证回答质量或费用提升。

## 原文与权限
原始工具结果仍在原会话；不另建共享缓存或第二套记忆库。
需要逐字核对时，Agent 可通过 headroom_read 使用当前会话的 toolCallId 和 SHA-256 分页读回。
工具不会重新执行命令、不联网、不读取其他会话或文件；授权码结果不进入此读回路径。
保留权限、取消、回执和 UNKNOWN 对账。没有新授权，也不改变 BYOK 或模型路由。

源码文件读取、用户和助手文字、系统提示、签名推理块、失败及不确定结果不做此变换。
成功命令日志允许压缩表示，但它的退出码及完成回执保持原样。
原有 JIT 和窗口预算仍可能进一步节选超大历史；那是原上下文策略，不是 Headroom 的无损结果。
在低窗口下应按原文引用读回需要核对的片段，不能把节选当完整证据。

## 与历史自动压缩的关系

从 Koder CLI 0.5.1 起，可在 Setup → 上下文与输出或 `/context` 中单独设置历史自动压缩。默认开启，触发占比 80%、目标占比 60%，优先保留最近 4 轮；近期轮次仍受模型窗口限制。它可能为请求节选较早历史，磁盘原文保留。Headroom 负责可还原的工具结果表示，两者分别设置。`/context off` 不会关闭 Headroom，关闭 Headroom 也不会关闭历史自动压缩。

关闭历史自动压缩后，必要的协议恢复仍会处理缺失的私有模型状态；输入超出硬窗口时报告错误，保留历史。设置步骤、模型窗口、上次请求估算和超窗处理见 [上下文窗口与自动压缩](CONTEXT-CONTROLS.zh.md)。

## 开关
进入 /setup（或 koder setup）→ 技能 → Headroom 上下文优化：
1. “自动优化工具结果”控制原生处理和方法提示。
2. “减少答复重复”单独控制表达指导。
3. “一键关闭全部技能”也关闭 Headroom。关闭保留原文和设置；下个重建会话生效。

也可以使用：
```sh
koder skills show builtin:headroom
koder skills doctor builtin:headroom
koder skills disable builtin:headroom
koder skills enable builtin:headroom
```

当前聊天使用 /skills 执行同样命令。独立终端改设置后请重开原会话；不会强行中断其他窗口。
配置仍存于已有 config.json，可合并以下字段，不要覆盖其他配置：
```json
{"headroom":{"enabled":true,"shapeOutput":true,"minChars":1200,"maxChars":262144}}
```

## 查看是否生效
koder run --json 的最终 result 含 headroom：
enabled 为开关状态，transformed 为本次模型请求变换的结果数，
beforeBytes / afterBytes 为这些结果变换前后的 UTF-8 字节数，含新格式标记。
overheadBytes 是额外方法提示与读取工具定义的估算字节开销，不是模型分词结果。
metrics 只含调用 ID、哈希、变换种类和字节数，不含原始正文。
这是单次投影数据，不是累计省下的付费 token、完整请求差额或服务商缓存命中。
没有适合压缩的数据时 transformed 为 0，这是正常情况。

## 来源和适配
固定来源：[roman-ryzenadvanced/headroom-skill](https://github.com/roman-ryzenadvanced/headroom-skill)，
提交 118466d7737ebc42806c331e44bd251b5222d59b，Apache-2.0。
包内保留上游方法、Python 参考脚本、LICENSE 和 NOTICE，并另放 Koder 适配说明。
自动执行部分是本地 Node 适配，不需要 Python、代理服务、额外模型或新账号。
上游抽样删行、代码骨架化、历史淘汰和 .headroom-cache 不是 Koder 默认行为；
参考脚本不会自动启动。不能照搬上游宣传的节省比例作为 Koder 实测结果。

## 发行与验收边界
0.4.5 已在官网和 GitHub 发布，当前安装入口提供同版运行包。
本轮另发现 8K 上下文在旧版 0.4.3 已存在的两项回归失败，保留原记录，没有更改断言。
本轮验证原生转换、正反例、配置、Setup 输入、CLI 命令、原文读回、双会话隔离及本机 IPC，
使用合成数据和脚本模型。真实付费模型费用与质量、原生 Windows 10/11 GUI、
PowerShell 5.1 无 Node 冷安装、登录重启和 MCP 图形操作仍按各自验收记录标记。
