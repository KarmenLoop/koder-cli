# PageIndex：目录导航、原文问答与可核对引用

Koder 0.4.24 默认把 PageIndex 方法接入本机 CLI。面对本地 PDF、长文档或文档问答，先建立目录树，由当前模型选择章节，回读原文，再核对引用。继续使用你的现有模型、BYOK、费用预算、取消和项目权限。

这是 Koder 对 [VectifyAI/PageIndex](https://github.com/VectifyAI/PageIndex) 的本地适配。没有另装 Python Agent、第二套会话引擎、向量数据库或必需的 PageIndex 云账号。它也不等同于上游 Flash/cloud OCR，不承诺复现论文分数。

## 1. 先确认安装与开关

在 Windows PowerShell、CMD、macOS Terminal 或 Linux 终端运行：

```text
koder --version
koder pageindex status
koder skills read builtin:pageindex
```

版本应为 0.4.24 或更新版本。状态应有 `enabled: true`、`formats` 和本地 PDF 解析器信息。`modelCalls: 0` 仅指索引、检索、回读和引用校验工具没有额外模型调用；完整问答仍会按你已选模型正常计费。

Setup → Skills 中可单独关闭“PageIndex · 文档目录与原文问答”，也支持全部 Skill 关闭。命令等价入口：

```text
koder pageindex off
koder pageindex on
```

关闭会阻止新会话的自动提示与工具曝光；显式 `pageindex` 诊断命令仍可用。正在运行的会话以启动时配置为准，改开关后重开会话。

## 2. 第一份练习文档

建立一个独立文件夹，例如 `Koder Projects/Document Lab`，把下面内容保存成 UTF-8 的 `manual.md`：

```markdown
# 服务说明
## 退款
退款需要七天。
### 例外
购买超过三十天不支持退款。
## 联系方式
请在服务台提交问题。
```

在该文件夹打开终端。不要在整个主目录或系统盘发起递归搜索。已有项目则进入原项目目录，或者每条命令使用 `-w "项目绝对路径"`。

```text
koder pageindex index manual.md --json
```

你会得到相对路径、文件 SHA-256、`nodes`、父节点 `parentId`、行号与 `nextOffset`。这一步实际读取文件，不需要模型或密钥，也不会隐藏写入一个全局知识库。目录很长时用 `--offset <nextOffset>` 继续查看，目录每次最多 60 个节点。

## 3. 让当前模型完成问答

已配置模型后运行：

```text
koder ask "读取 manual.md 文档，退款需要多久，有哪些例外？给出可核对引用。"
```

交互会话也可以直接输入同一句。模型应使用 `pageindex` 的 index/tree/read/verify：选择“退款”及其“例外”章节，实际回读，再给出文件与行号。模型偶尔选错章节时，可以补充“请读取退款的子章节，核对例外”，仍在原 Core 中继续。

`search` 是词法导航提示，不是语义答案。零命中时应继续看目录或报告证据不足，不能直接声称“文档没有相关内容”。也不能只看到标题就回答正文结论。

## 4. 手动检查目录、原文与引用

```text
koder pageindex search manual.md --query "退款" --json
koder pageindex tree manual.md --json
koder pageindex read manual.md --node <上一步的nodeId> --sha <上一步的sha256> --json
```

把尖括号占位符替换为真实返回值，不要原样执行。`read` 最多返回 12,000 字符；默认 6,000。若有 `nextOffset`，带 `--offset` 继续读取。文本行号以规范化的 UTF-8 换行为准。

把 `read` 返回的整个 `citation` 对象复制到 `citations.json` 的数组里，并添加原文逐字 `quote`：

```json
{"citations":[{"path":"manual.md","projectId":"复制返回值","sha256":"复制返回值","parserVersion":1,"nodeId":"复制返回值","offset":0,"length":12,"startLine":2,"endLine":3,"quote":"退款需要七天。"}]}
```

这里的数字只展示形状，实际使用必须完整复制返回值，尤其是 `length`、行号、offset、projectId。执行：

```text
koder pageindex check citations.json --json
```

全部来源、版本、区间与逐字引文吻合时退出码 0；不吻合时退出码 3。校验不判断结论是否符合逻辑。引用正确但推理不成立，仍应修改答案。校验文件读取错误等参数/操作错误返回 2。

修改 `manual.md` 后，再用旧 `--sha` 回读会得到 `PAGEINDEX_SOURCE_CHANGED`。请重新索引并核对新内容；不能继续使用旧证据冒充当前事实。复制到另一个项目后的旧引用也需要重新建立。

## 5. PDF：真实物理页码

将可复制文字的 `report.pdf` 放进项目：

```text
koder pageindex index report.pdf --json
koder pageindex read report.pdf --node p0002 --json
koder ask "读取 report.pdf，比较相关章节并给出实际页码与原文引文。"
```

内置 PDFium WebAssembly 在本机解析压缩文本；不需要 Python、系统 PDF 工具或外部下载。存在书签时保留书签层级，同时提供每页节点；没有书签则使用物理页目录。`p0002` 表示文件的第 2 页，不是纸面印刷页码。页内文本来自 PDF 提取结果，多栏或复杂排版可能需要人工对照。

- 全文无可提取文字：`PAGEINDEX_OCR_REQUIRED`。先通过你已授权的 OCR 流程生成带文字的副本，再读取；不会默默外发原件。
- 部分页无文字：结果明确列出需要 OCR 的页，不能把这些页当成已读。
- 加密文件：`PAGEINDEX_PDF_PASSWORD_REQUIRED`，请自行提供已解锁副本，不向聊天发送密码。
- 无效文件或解析失败：返回具体原因；不会把解析失败当作空白成功。

## 6. 导出目录，沿原项目交付

```text
koder pageindex export report.pdf --json > report.pageindex.json
```

这是用户明确的文件重定向。导出包含 `doc_name`、嵌套 `structure`、`node_id`、`start_index/end_index` 等 PageIndex 字段，以及 Koder 的源文件版本信息。它可用作项目交件或目录对照，不是上游云文档 ID，也不承诺兼容全部云 API。

Agent 工具本身只读。需要保存报告、索引或答案时，走现有 `write_file` 与原审批。自动索引只使用有界进程缓存，每次调用重新核对源字节；退出后可以重建。不会建立第二套跨项目记忆库。

## 7. 隐私、费用与失败处理

本工具不会把文档上传到 PageIndex 或新服务。当前模型问答仍会将选定章节送往你配置的模型供应商；按原模型和隐私设置处理。文档里的指令、链接和脚本都是不可信内容，不授予执行或联网权限。

单文件上限 64 MiB；文本文件 16 MiB；最多 2,000 页、1,000 万提取字符、250,000 文本行、10,000 PDF 目录/页节点。Markdown 最多识别 2,000 标题，剩余正文保留并提示。PDF 每次解析最多等待 120 秒且可以取消。这些是解析资源界限，不是任务工具次数上限；原无限工具轮次、费用预算与取消保持不变。

`PAGEINDEX_SOURCE_CHANGED` → 重新读取版本；`PAGEINDEX_QUOTE_NOT_FOUND` → 修正引文；`PAGEINDEX_CITATION_SCOPE/RANGE` → 重新复制本项目真实回读收据；`PAGEINDEX_*_LIMIT/TOO_LARGE` → 将资料按实际章节拆成独立文件；不支持的格式 → 用已有工具导出为 UTF-8 文本或带文字 PDF。不要为了绕过报错跨盘扫描或重复执行有副作用操作。

## 8. 验收边界

本版覆盖本地真实 Markdown/PDF 解析、目录/分页、原文读取、引用校验、现有 Core 调用链、Setup 开关和打包安装。自动化中的模型选择是确定性夹具，不代表付费模型盲测分数。Windows 实机由 beta 专员验证；OCR、上游 Flash、云文档服务和真人私有资料问答不在本轮通过范围内。各平台使用同一 Node/WASM 实现，实际设备验证状态另列在发行记录。
