# 按任务自动选择模型与思考强度

当前实现随 Koder 原生执行链路加载，默认开启。只有一个已配置模型时保留该型号，按任务调整它支持的思考强度；有多个已配置模型时，先选择模型，再按该模型的实际协议映射强度。`koder`、`chat`、`run`、`ask` 和 agentd 托管的原生会话共用这一实现。

## 第一次使用

1. 运行 `koder setup`，在“模型”中配置可以使用的模型。只配置一个也能使用自动强度。
2. 打开“智能选模与强度”，确认“按任务自动选择”为开、“模型选择”为自动。若以前保存过手动强度，把“强度选择”设为“按任务自动”。
3. 有多个模型时，在该页将它们分为“快速”“均衡”“强”。不知道怎样分可以保留 `auto`，但 `auto` 只是型号名称提示，不是性能测评结果。
4. 进入 `koder`，先输入简单问题，再输入需要分析、验证、多个步骤的任务。任务开始会打印 `MODEL_ROUTE`，列出难度、配置名、型号、实际强度和理由。
5. 任务执行中查看底栏确认实际使用的型号与强度；`/model show` 可以查看当前或上一任务的选择回执。

例如，“你好”通常选择快速档和 `low`；“分析分布式支付系统的并发竞态、安全边界、迁移与回滚方案并验证”会选择强档与更高的已支持强度。翻译一段含这些术语的短文本会按翻译任务处理，不只因出现术语就提高档位。

## 判别与选择顺序

判别在本地完成，不另外调用模型，不上传任务到分类服务。它使用当前用户任务的语义关键词、步骤、长度和明确的深度要求；工具返回内容不作为判别指令。简单的“继续／重试”继承上一任务的判别。此版本是可解释的启发式，不保证对所有问题都选到全球最优模型。

| 判别 | 倾向模型档 | 目标强度 |
| --- | --- | --- |
| 简单／常规短处理 | 快速 | low |
| 一般开发、分析或较详细的请求 | 均衡 | medium |
| 多项复杂要求 | 强 | high |
| 多项高难度、高影响要求 | 强 | xhigh |
| 用户明确要求最高思考强度 | 强 | max |

选择受以下约束：

- 只在已配置、能正常读取、未被标记暂不可用的模型中选择。不会凭一个 API Key 自动猜测它能调用哪些型号。
- 用户分档优先；否则按 `flash/mini` 等型号提示分档；未知型号按均衡处理。同档优先当前基线模型。
- 已知上下文窗口过小的候选会让位于能容纳当前输入和近期上下文的候选。最终上下文检查和压缩仍由原有实现负责。
- 启用费用预算时只考虑已配置费率的候选。发送每次请求前仍需通过原有费用预留；未知用量不会当成零，不会自动提高预算。
- 任务或项目的手动模型、手动强度优先于自动判别。环境变量和 `--provider` 指定的来源保持固定，不自动切到另一个账号。
- 同一个任务的模型／强度在工具循环、审批等待、引导补充期间固定。切换从下一根任务开始生效，已完成的工具不会因切换而重放。

## 单模型怎样调整强度

强度只采用已经核对的型号、服务地址与协议能力表，复用 Koder 原有映射。不同品牌不共用一个未经确认的请求字段。没有已支持强度接口时显示 `provider-default` 或已有模型设置，不把不支持的参数发出去。

例如 MiniMax M3.1 Flash 官方支持 `low / medium / high / xhigh / max`；OpenAI 兼容协议使用 `reasoning_effort`，Anthropic 兼容协议使用 `output_config.effort`，不能用 `off/none` 关闭思考。默认自动策略可以为同一个 Flash 型号选低档或高档，并不代表换成了另一型号。[MiniMax 官方说明](https://platform.minimax.io/docs/guides/text-generation)、[Anthropic 兼容接口](https://platform.minimax.cn/docs/api-reference/text-anthropic-api)。

模型不支持目标等级时，选择它支持的最近等级，并记录 `EFFORT_NEAREST_SUPPORTED`。第三方代理不因型号同名就继承官方接口能力；需要它自己的已核实 `modelMeta`，否则保留服务商设置。强度不会突破上下文、输出长度或费用限制，高强度仍可能增加时延和消耗。

## 开关与手动覆盖

查看与关闭：

```bash
koder model auto status
koder model auto off
koder model auto on
# 同一配置入口，也可在 Setup 中点击
koder setup routing status
```

为已经保存的模型配置名分档，下面的 `quick` 和 `reasoner` 需要替换成 `koder model list` 中的名字：

```bash
koder model auto tier quick fast
koder model auto tier reasoner strong
koder model auto tier reasoner auto
```

本次任务手动指定：

```bash
koder run "分析这个项目" --model reasoner --effort high
koder run "分析这个项目" --model auto --effort auto
```

交互会话内：

```text
/model reasoner
/effort high
/model auto
/effort auto
/model show
```

`/model` 与 `/effort` 的选择器中也有自动项。忙时切换会明确保留本回合选择，下一任务生效。总开关关闭时 `auto` 不会绕过关闭设置。

`koder model use reasoner` 会持久固定当前模型，但仍允许自动调整强度。`koder model auto on` 恢复全局自动选模；如保留过手动强度，可在 Setup 中另设自动。项目 `.koder/config.json` 的 `activeModel` / `thinkingEffort` 优先于全局设置，本次命令的 `--model auto` / `--effort auto` 可取消对应项目覆盖。

关闭自动功能后，回到当前基线模型和原有强度配置，不删除模型、密钥、记忆或 Skills。

## 配置与观察

配置保存在现有用户配置文件中：

```json
{
  "modelRouting": {
    "enabled": true,
    "selection": "auto",
    "tiers": {"quick": "fast", "reasoner": "strong"}
  },
  "thinkingEffort": "auto"
}
```

`selection: "current"` 固定当前模型。分档为 `auto` 时采用型号提示。旧配置没有 `modelRouting` 时默认开启；原来的全局、项目和命令行手动强度继续优先。

`--json` 输出增加 `type: "model-routing"` 事件，最终 `result.modelRouting` 保存同一回执。包含难度、规则理由、配置名、型号、手动／自动来源与实际强度，不包含 API Key、完整用户问题或工具正文。

本地任务遥测开启时记录一条精简选模日志；关闭遥测后不写这条遥测日志。会话中的执行回执仍然保留，便于确认实际模型以及安全恢复。云日志上传没有启用。

## 长任务、重试与限制

- 普通新任务重新判别；候选配置在任务边界重新读取。运行中修改配置不会更换已经开始的请求。
- 模型请求失败后输入“重试”，会保持原任务的模型与强度，只恢复模型续答。若凭据、协议或模型配置已经改变，报告 `MODEL_RECOVERY_CONFIG_CHANGED`，不会擅自换模型重放操作。
- 切换模型保留可见对话与工具回执，清除不应跨模型传递的私有思考块、签名和响应标识。
- 取消、权限、审批、无头交付检查、工具结果未知的恢复限制、费用预算继续生效。此功能不会为工具次数增加新上限。
- 外部 ACP 引擎、MoA 顾问预设和测试注入 provider 继续由各自既有配置管理，不假称已被此原生自动选模控制。
- 这不是自动故障转移。请求报错不会自动换另一账号或型号重试已产生副作用的任务。

## 验证方法

自动化覆盖本地判别、配置开关、实际 CLI 协议序列化、单模型与多模型、手动覆盖、费用拒绝、19 次模型请求的长任务、引导补充、取消、模型重试不重复写入、agentd IPC、Setup 持久化和遥测关闭。

```bash
node --test test/model-routing.test.mjs test/session-controls.test.mjs
```

协议测试使用受控模型响应，真实执行 CLI 请求构造和本机文件工具。它不等于真实付费账号质量测评，也不证明 Windows／Ubuntu 桌面实机已经验收。用自己的账号体验前，可先运行 `koder model test <配置名>`，确认对应账号和接口实际可用。
