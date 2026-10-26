# 子 Agent 角色、队列与费用

0.5.0 将原专业工作配方接入子任务执行，提供 90 个角色、25 个领域。每个角色列明输入材料、交付物和检查事项，并记录角色版本与 SHA；原法律、投标、人事配方继续保留。角色是任务方法，不授予执业资质或新的操作权限。

## 先查角色，再派真实工作

```text
koder subagents roles --json
koder subagents roles --group legal --json
koder subagents roles --query 审查 --json
koder subagents role legal-contract --json
koder subagents match "审查这份合同" --role legal-contract --json
```

这些命令只查目录，不调用模型、不启动子任务。随后在项目中发任务：

```text
koder run "读取 contract.txt，使用 legal-contract 子任务检查付款条款，把 review.md 写在本项目，缺少法域时列为待确认，不编法律结论。" --yes
```

父任务通过 subagent_roles、subagent_spawn 选角色；roleId 进入真实子会话的 system 约束。子任务仍通过同一个 Core、原模型配置、工作区、审批和费用账本调用 read_file/write_file 等工具。父任务 collect 时核对原始回执、文件和失败信息，再汇总。只看“我完成了”的文字不能算交付。

每个写任务先声明 writePaths。两个子任务不能同时占有同一路径；shell 写入按原规则需要独占范围。外部账号、GUI、发送邮件等仍由父任务沿原权限处理，不因“律师”“审查员”名称增加权限。

## 180、并发和模型额度是三件事

- **cap**：每个根任务最多 180 个尚未收集释放的子任务槽位。
- **maxConcurrent**：本 runtime 同时执行多少个子任务，默认 4；其余 FIFO 等待。Setup → Task Harness 可设 1–180。
- **付费并发**：由提供商、账号、限流和价格决定；180 个槽位不代表 180 个付费调用可同时成功。多个窗口和父模型调用不计入这一子任务并发值。

```json
{
  "subagents": {"enabled": true, "cap": 180, "maxConcurrent": 4},
  "taskExecution": {"maxSteps": null}
}
```

修改前保留自己的 config.json，其余配置字段不动；更推荐 Setup。maxSteps: null 表示没有工具/模型轮次硬上限，不表示取消、费用、上下文、单工具资源或真实授权上限失效。费用预算继续沿原 taskExecution.costBudget 配置；价格须对应实际模型，不把未知费用当零。

## 查看、取消和恢复

原聊天中使用 `/subagents roles` 查目录、`/subagents role legal-contract` 看角色约束；`/subagents status` 查看执行状态、`/subagents cancel` 取消。结果由父任务使用 `subagent_collect` 工具收集，聊天没有 `/subagents collect` 命令。模型工具可按 ids 取消指定子任务。排队中的任务取消后不调用模型；已运行的任务等待原取消路径结算，UNKNOWN 回执必须核对，不能自动重放。

`koder subagents status --json` 读取保存的检查点。saved running 显示 unconfirmed，不能作为当前进程仍活着的证据。原会话恢复、代际、写入归属、费用和撤权规则继续有效，不偷偷复活子任务。

法律、医学、税务、财务、工程等高风险内容需要合适的一手来源和专业复核；工具可访问性不证明专业质量。目录覆盖具体角色，不宣称已经验证世界上所有职业。[查看每个角色的材料和交付检查表](SUBAGENT-ROLE-CATALOG.zh.md)。
