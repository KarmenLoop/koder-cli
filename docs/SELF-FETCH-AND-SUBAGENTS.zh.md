# 自寻 Skill、长任务与子 Agent：操作课

适用版本：0.4.21。完整配置、Todo 参数和恢复规则见[任务编排](TASK-ORCHESTRATION.zh.md)。本课沿用原 Core、模型绑定、权限、会话存储和费用账。历史 0.4.14 方案中的主要能力已在 0.4.15–0.4.20 加入；0.4.21 修复指定仓库搜索，并补真实工具调用证据。

## 1. 准备一个独立练习项目

在新目录中打开终端，运行：

```text
koder --version
koder harness status --json
koder model list
```

确认版本为 0.4.21，选择已配置的模型。默认 `taskExecution.maxSteps:null`，不会在第 16/24 轮自动停止。恢复这个默认值可运行 `koder harness steps unlimited`。用户取消、金额预算、权限拒绝、模型故障、上下文和结果待核实保护仍然生效。

先创建两个文本文件：`input-a.txt` 内容为 `2 + 3`，`input-b.txt` 内容为 `8 - 3`。整个练习只操作这个目录。

## 2. 先找本机工具

```text
koder tools seek node --local --json
```

`local.found:true` 表示在 PATH 找到可执行文件；`executed:false` 表示还没运行。私有内置 Node 不一定在 PATH，因此 false 不能等同于 Koder 无法启动。让 Agent 用原 shell 工具运行找到的工具，才得到运行结果。

缺少其他工具时，任务会优先查看已有能力，再使用 `tool_seek` 找公开候选。核实来源、固定版本、许可证、安装命令和安装目录后，通过 `tool_bootstrap` 和原审批执行；安装成功后继续核对原任务。不会把任意来源脚本视为授权。

## 3. 从指定 GitHub 仓库找 Skill

公开查询与安装需要已有 `network`、`skills.update` 权限。用户可通过原入口授权：

```text
koder permissions request --capability network --capability skills.update
koder skills seek "repo:anthropics/skills" --json
```

`repo:组织/仓库` 限定来源，0.4.21 不再把它当作 Skill 名称，也不会自动转去无关仓库查询。替换为你已核实的公开仓库。结果含完整 `id`、40 位提交 `ref`、`repository`、来源 URL 和许可证线索；许可证字段为空不代表没有许可限制。

每次扫描和响应都有分页，完整目录不会被删到只剩第一页。用 `scan`、`nextOffset`、`nextPage` 继续查询；同页刷新会推进保存的仓库/Skill 游标。GitHub 限流时遵守返回的等待信息。

复制实际返回的两个值：

```text
koder skills fetch "ID_FROM_SEEK" --ref "COMMIT_FROM_SEEK"
koder skills show "ID_FROM_SEEK" --json
```

不要把示例占位符直接当成真实 ID。下载按提交与 git blob 验证完整资源；安装到原 Skill 库，脚本保持未执行。长正文按返回的 `nextOffset` 配合 `--offset` 继续读。目录、正文或引用资源缺失都需要如实处理。

## 4. 在同一任务里学习后继续

启动 `koder chat`，输入：

```text
先查本机 Skill。缺少时在我指定的公开仓库中查找合适的 Skill，
说明来源与固定提交，经已有授权安装并阅读。
然后在当前项目生成 report.md，写清输入、处理结果和核验方式，
用工具读回文件。不要运行来源内的安装脚本，不要向外部账号发送内容。
```

可观察链路为 `skill_seek → skill_fetch → skill_read → write_file/read_file`。`installed` 不是原任务完成；应检查最终文件与工具回执。`--yes` 不能代开电脑权限。相同候选、参数和错误连续失败且没有新信息时会请求用户决策；不会静默重复安装。

## 5. 安排 Todo 与两个子 Agent

接着输入：

```text
建立三个 Todo：a 计算 input-a.txt；b 计算 input-b.txt；verify 核验结果。
verify 依赖 a 和 b。a、b 分别交给两个子 Agent，
只允许写 results/a.txt 和 results/b.txt，各自先读输入再写结果。
父任务收集回执，读回结果，确认两个结果都是 5，再完成 verify。
沿用现有模型与费用预算；不要使用外部账号和 shell。
```

Todo 支持排序、编辑、依赖、失败重排；100 项也可保存。依赖环返回 `TODO_CYCLE`，未完成的外部前置项返回 `SUBAGENT_TODO_BLOCKED`。Todo 勾选不是工具成功证据，父任务应核验文件后再更新总清单。

查看与取消：

```text
/subagents status
/subagents status 2
/subagents cancel CHILD_ID
```

同一根任务最多 180 个尚未收集释放的子 Agent；第 181 个返回 `SUBAGENT_CAP_REACHED`。终态执行实际收尾且被收集后才释放。子任务共用父权限、费用预算与取消，写入路径不能重叠；MCP、GUI、邮件和外部账号操作仍由父任务处理。原始长结果与回执支持分页取回。

## 6. 模型和思考强度分别选择

`model` 必须是已有绑定。`thinkingEffort` 为 `deep/standard/fast/off`，与会话 Ctrl+E 共用同一产品定义。型号里的 `flash` 仍是型号。工具返回请求与有效强度；服务商不支持时不会假称已生效。

可明确要求：“a 用我已配置的模型 A，深度；b 用模型 B，快速。”不指定时按父绑定和任务特征选择。不同模型仍计入同一个父任务预算；每个模型应配置其实际价格。示例价格不是服务商账单，请按[金额预算教程](TASK-ORCHESTRATION.zh.md)设置。

## 7. 失败、取消和关闭

Esc/Ctrl+C 或取消父任务会传播到子任务；取消不会撤销已完成的写入。审批中取消不得执行尚未批准的变更。UNKNOWN 回执保留，收集释放名额也不解除待核实保护，不重放不确定的命令、发送或发布。

Setup → 技能 → 任务 Harness 可关闭自寻或子 Agent。`selfFetch.enabled:false`、`subagents.enabled:false` 分别控制入口；原 Skills、排队、引导和模型快捷键继续保留。

## 8. 这次实际验证了什么

- 公网 GitHub：10 次真实请求，固定提交下载 Skill、校验资源、当轮读取，再写入并读回项目产物；没有执行上游脚本。
- 内置 Core：180 个子任务各实际读取本地文件，360 次确定性模型步；第 181 个拒绝，180 份回执逐页收齐。
- 原 HTTP provider：两个子模型分别发送 high/low 推理字段，写入与读回不同文件；全部请求由父费用账结算。
- 权限、取消、依赖、冲突、长任务及恢复反例继续回归。

模型响应和 owner 同意使用隔离测试夹具；公网传输、本地工具和文件是实际执行。真实模型自主寻源/拆解质量、付费账单对账、Windows 设备和生产账号操作仍为 NOT_RUN。参见[逐项证据表](ORCHESTRATION-ACCEPTANCE.md)。
