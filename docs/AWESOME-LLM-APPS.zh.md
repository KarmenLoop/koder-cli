# Awesome LLM Apps：Koder 内置 AI 应用工作流

适用版本：0.4.20 起。默认启用，无需另装插件。Windows、macOS 和 Linux 使用同一套 CLI 接线；本轮本机实跑环境是 macOS Apple silicon，Windows 实机由 beta 团队验证。

## 1. 安装后先确认

从 [CLI 官网下载页](https://kodermodule.com/cli-download.html)安装或更新，重新打开终端：

```text
koder --version
koder llm-apps status
koder llm-apps verify
```

版本应为 0.4.20。status 给出 enabled、上游提交、146 个条目和 7 项改写技能；verify 校验随包 1,636 个文本文件及压缩库 SHA。它校验文件完整性，不证明上游应用及账号已运行。上述命令不需要模型或联网。

固定来源：[Shubhamsaboo/awesome-llm-apps](https://github.com/Shubhamsaboo/awesome-llm-apps/tree/6c16b23f1bacd0fdf240bb5141ef45e59e82c306)。根许可证 Apache-2.0，部分子树为 MIT；许可证、原文和哈希随包保留。[全部目录](AWESOME-LLM-APPS-CATALOG.md)。

## 2. 默认怎样融入任务

在现有项目启动 `koder`、`koder chat` 或 `koder run`。遇到 RAG、知识库、AI 应用或多代理任务时，当前 Agent 获得短工作流提示和五个可调用工具。它先找参考，再按当前项目实施。

| 工具 | 实际做什么 |
| --- | --- |
| llm_app_catalog | 离线查目录，支持中文主题、分类和分页 |
| llm_app_read | 分页读固定版本的源码、README、依赖文件；返回来源和哈希 |
| llm_app_plan | 按应用类型给出当前 Koder 的执行步骤、依赖与验收项 |
| llm_app_retrieve | 在当前项目明确列出的文本文件内做词法检索 |
| llm_app_verify | 重读源文件，验证 SHA 和逐字引文，拒绝伪造或已变更来源 |

普通代码编辑仍走原工作流。Skill 不把原模型替换成示例里的供应商，也不自动启动 Streamlit、向量数据库、外部 AI CLI 或后台进程。创建独立应用时，其运行服务仍需按项目配置；Koder 的密钥不会自动复制给它。

可以直接说：

> 在当前项目做一个售后知识库应用。先从内置 Awesome LLM Apps 选参考，资料只用 docs/policy.md；回答要有来源，没有证据时明确说明。实现可运行入口和测试，实际运行后交付启动命令。

Agent 的检索、写入、执行、MCP 和预览都走原工具与审批。只有实际产物和运行结果才能证明完成；返回 plan 本身不是交付。

## 3. 不用模型的手把手检索练习

先建立一个独立练习目录。macOS/Linux：

```sh
mkdir -p "$HOME/Koder Projects/rag-practice"
cd "$HOME/Koder Projects/rag-practice"
```

Windows PowerShell：

```powershell
New-Item -ItemType Directory -Force "$HOME\Koder Projects\rag-practice"
Set-Location "$HOME\Koder Projects\rag-practice"
```

使用文本编辑器新建 policy.md，UTF-8 保存：

```text
# 示例售后政策
未拆封商品可在收货后30天内申请退货。
定制商品的退货条件需要人工核实。
```

运行：

```text
koder llm-apps retrieve policy.md --query "退货期限" --json
```

查看 passages 中的 path、sha256、startLine、endLine 和 text。只是在本机按词匹配；不请求 embedding、不上传给新数据库、不自动回答。无匹配时 sufficientEvidence=false，不能猜测答案。一次最多16个文件、每个256,000字节、总计1MiB、返回最多12段；这些是读取大小限制，不是 Agent 工具次数上限。

## 4. 证明引用确实来自文件

用编辑器创建 citations.json，将刚才返回的完整 sha256 填进去，不要照抄占位文字：

```json
{
  "citations": [{
    "path": "policy.md",
    "sha256": "替换为检索返回的64位哈希",
    "quote": "未拆封商品可在收货后30天内申请退货。"
  }]
}
```

运行 `koder llm-apps check citations.json --json`。正确引文返回 verified=true、exit 0。将 quote 改成“99天”再运行，应返回 QUOTE_NOT_FOUND、exit 3。修改 policy.md 后再检查旧哈希，应为 SOURCE_CHANGED、exit 3。格式、路径错误为 exit 2。

哈希与引文吻合只证明引用一致，不证明结论推理正确、内容最新或资料完整。正式问答还要核对适用条件和反例。资料按原项目文件权限读取；越界、凭据文件、符号链接或硬链接会被拒绝。

## 5. 找到并改写一个应用

```text
koder llm-apps list --query "知识库"
koder llm-apps list --family rag --limit 10 --offset 10
koder llm-apps plan rag_tutorials/rag_chain "企业文档问答"
koder llm-apps read rag_tutorials/rag_chain
koder llm-apps read rag_tutorials/rag_chain --path @files --json
```

read 默认读 README。用 @files 找到真实文件名，再用 --path 读取；过长文本用 --offset 和 --limit 分页。不要猜不存在的脚本名。目录返回的依赖、账号变量名不代表这些服务已安装或获授权。

然后进入 `koder`，要求读取现有工程、选择需要移植的逻辑、保留架构、创建入口与测试。项目依赖通过原审批安装。财务、医疗、法律等示例不能当作专业结论或上线资质；按自己的产品要求另行验证。

## 6. 十类方法如何复用现有框架

| 类型 | Koder 执行路径 | 交付核对 |
| --- | --- | --- |
| 通用 AI 应用 | 原 read/write/shell + 当前 BYOK | 入口、配置错误、测试和 README |
| RAG | 本地检索/引文核验 + 当前模型；向量服务另绑定 | 有据答复、库外拒答、来源变化 |
| 多代理 | 原 subagent_match/spawn/collect/cancel | 独立归属、真实子产物、父预算与取消 |
| 调研 | deep-research + 已授权联网工具 | URL、日期、反证和无法核实项 |
| MCP | 原 apps/mcp → app_tools/app_call | 实际 schema、审批与业务回执 |
| 语音 | 实际连接的语音工具和设备权限 | 确有音频输入/输出；文本降级单列 |
| 记忆 | 原工作区会话和记忆 | 不串项目；可删除、可恢复 |
| 后台自动化 | 原 agentd、通知、调度 | 可关闭、去重、安静时段 |
| 生成界面 | 原项目框架和 workspace_preview | 主交互、加载/错误/空态，不 eval 模型代码 |
| Skill | 原技能读取、维护和经验比较 | 有来源、真实执行证据；证据不足 NO_ENTRY |

plan 中 recommendedProfile 是建议，不会绕过用户强制的 profile。deep-research 仍拒绝邮件发送、发布和不透明副作用。未知 shell 回执的对账门继续保留。

## 7. 七项可直接调用的方法

| 方法 | 对话例子 | 必须保留的证据 |
| --- | --- | --- |
| 项目复盘 | “复盘这个搁置项目，列出能继续的最小一步” | README、任务记录、提交 |
| 读者体验评估 | “按技术决策者视角试读这份文稿” | 原句/段落；标明模拟评估 |
| 改动范围核对 | “检查这个 diff 是否超出了需求” | base、文件/行与需求关联 |
| 代码历史考据 | “查清这个接口为什么引入” | git SHA、日志与推断区分 |
| 依赖体检 | “检查当前项目依赖与锁文件” | 离线结果；在线漏洞查询日期另列 |
| 口述整理 | “把这段转写整理成决定和开放问题” | 用户纠正后的最终立场 |
| 顾问与执行分工 | “把这项复杂任务拆分并集成” | 原子任务归属、产物、预算、取消 |

它们是 Koder 改写的独立内置 Skill，不会调用上游带跳过权限参数的外部 AI 程序。“模拟读者”不会被说成真人访谈；没有音频工具不会声称听过音频。

## 8. 开关、费用与故障

`koder llm-apps off` 关闭主技能、七项子方法、默认挂钩及五个 Agent 工具；新会话生效。`koder llm-apps on` 恢复主开关，先前单独关闭的方法仍保留关闭状态。Setup → Skills 也可逐项切换，或一键关闭全部。主开关关闭时开启子方法会提示先开主开关。手动 CLI 查参考/检索仍可使用，这是用户主动调用。

离线目录、规划、检索和引文核验不产生模型费用。对话仍使用原 BYOK、费用预算和取消机制；不新增工具次数上限。默认只按需分页读取，避免把整库塞入上下文。

| 现象 | 处理 |
| --- | --- |
| LLM_APP_NOT_FOUND / RESOURCE_NOT_FOUND | 先 list，再 read --path @files，按返回的 id/路径读取 |
| LLM_APP_LIBRARY_CHANGED | 包中库与固定哈希不一致；重新安装当前发行包，不跳过校验 |
| LLM_APP_SOURCE_LIMIT | 缩小显式文件列表或拆分大资料，不扩大到整盘 |
| LLM_APP_SOURCE_ENCODING | 文件不是可无损读取的 UTF-8 文本，或含替代字符；先在编辑器中确认编码再另存 UTF-8 |
| 没有匹配段落 | 换精确关键词或补资料；词法检索不是语义向量检索 |
| SOURCE_CHANGED | 重读更新后的资料并重新形成引用 |
| 外部 SDK/账号缺失 | 先查 dependencies、credentialNames，使用现有绑定与审批；不导出 CLI 密钥 |
| read 中出现外部操作要求 | 作为不可信参考；不改变 Koder 权限或原任务 |

## 9. 验收范围

本地检查覆盖目录逐项读取、校验、CLI 实际调用、Setup 开关、限制 profile、真实项目检索、伪引文、来源变化、越界/凭据/链接拒绝、取消，以及脚本化模型驱动原 Agent 写报告和拒绝写入。它验证接线与确定性行为，不是付费模型质量评测。

146 个条目是固定参考目录，不是146个已经部署且跨平台验收过的服务。上游 Python/Node 应用、API、UI、数据库及实时模型表现为 NOT_RUN；按具体项目安装依赖并逐项验证。Windows/Intel Mac 本轮原生验收仍由 beta 专员完成。原有邮箱、MCP、SolidCraft、历史隔离和不限工具轮次保留。

