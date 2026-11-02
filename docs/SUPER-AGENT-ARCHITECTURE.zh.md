# 主任务与 Worker 协作

[English](SUPER-AGENT-ARCHITECTURE.en.md) · [简体中文](SUPER-AGENT-ARCHITECTURE.zh.md)

Koder CLI 0.8.1 沿用现有任务引擎的 Worker 协作。主任务可以拆分独立工作、向原 Worker 补充要求，并在结果保存后继续。不需要另装 Agent 服务，也不要求更换模型服务商。

## 开始前

从 [CLI 官网](https://kodermodule.com/cli-download.html)安装或更新，用 `koder --version` 核对版本，保留已有账号与模型配置。在 Setup 查看子任务设置。原有 `subagents.enabled`、并发、费用预算、权限、截止时间与取消控制继续生效。简单任务可以由一个 Agent 完成，增加 Worker 不代表结果一定更好。

## 用两项独立工作试一次

1. 进入你自己的项目，运行 `koder`，让它分别检查界面错误提示与安装教程。事先分清各任务负责的文件，避免互相覆盖。
2. 用 `/subagents status` 查看真实 Worker。需要澄清范围时，让 Koder 把补充要求发给原 Worker。补充消息不会增加权限，也不能批准正在等待确认的操作。
3. 相同的稳定请求 ID 与内容会复用已记录请求；同 ID 换内容会报冲突。对于结果未知的外部操作，不会为了得到一份完整报告而自动重放。
4. Worker 完成后，主任务收到结果并可继续。消息排队或事件已保存，不代表模型已实际读到；已经关闭的 Worker 可以拒绝补充要求。
5. 要求主任务读回改动文件，并按你的原始要求验收。Worker 说“完成”不等于最终通过；交付中应保留实际路径与相关工具结果。

取消单个 Worker 时，使用状态中查到的实际 ID：`/subagents cancel <id>`。取消主任务沿用已有的子任务取消与资源清理。恢复任务时，未核实的副作用仍需核对，恢复记录本身不授权重放。

## 已核对的范围

0.7.2 安装包确认覆盖 13 个实现、测试与文档文件；这是文件清单，不是 13 项独立功能。受控 CLI 用例与一次有界 MiniMax-M3 任务覆盖协作及结果保存，不代表小时级自主任务、所有模型行为或 Windows/Ubuntu 原生 GUI 已验收。见[本版发行核对](RELEASE-0.7.2.zh.md#发行核对与未验范围)。

## 设计参考

协作设计参考 [DeepSeek DSH SuperAgent 研究原型](https://github.com/deepseek-ai/dsh-superagent-prototype/tree/6337fc823ce20251c8de8085948165c81aaa701e)。Koder 继续使用自身已有的执行器、权限和任务记录；这不代表安装了 DeepSeek Harness、接入了原型中的服务、要求使用 DeepSeek 模型或获得 DeepSeek 认证。上游是研究参考，不是官方生产产品。

[任务编排](TASK-ORCHESTRATION.zh.md) · [上下文处理](HEADROOM.zh.md)
