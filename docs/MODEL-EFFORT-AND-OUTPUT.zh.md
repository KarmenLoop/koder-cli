# 模型思考强度与输出上限

适用：Koder CLI 0.5.4。本文说明 Koder 内置模型适配器；Hermes/ACP 等外部引擎仍管理自己的模型控制项。

## 在会话中选择强度

1. 运行 `koder --version`，确认已安装 0.5.4 或更高版本。
2. 启动 `koder chat`，通过 `/model` 选择已配置的模型。
3. 输入 `/effort`，查看这个模型、接口地址和请求协议支持的档位。
4. 选择一个列出的值。若菜单包含 high，也可直接输入 `/effort high`。
5. 输入 `/model show`，检查当前模型与实际强度。任务运行中切换模型或强度沿用原有“下回合生效”边界，不重放已完成工具。

Ctrl+E 循环当前模型支持的档位；Setup 可以改成打开选择器。非交互任务可使用 `koder run --effort high "审查这个模块"`，前提是所选模型支持 high。

菜单依据安装包内的能力表，不是实时账号权限探测。匹配条件包含模型 ID、HTTPS 服务路径和实际请求协议。代理地址上的同名模型不会直接获得官方服务的控制项；不猜测自定义端口、路径与未核实的区域接口。确认兼容服务的实际契约后，可以用显式 `modelMeta` 描述它。

## 默认值与旧配置兼容

没有显式会话、项目或用户强度选择时，Koder 保留所选模型原有的 `reasoningEffort`。子任务不会用空覆盖字段把它抹掉。模型没有配置强度时，继续沿用原适配器行为。

底栏区分三种状态：

| 显示 | 含义 |
| --- | --- |
| 原生档位，例如 `low` | 当前能力表确认该模型支持所保留或选中的值。 |
| 已有模型配置 | 保留旧配置，但能力表尚未核实其具体档位。 |
| 服务商默认 | 当前没有强度覆盖，由服务商决定默认行为。 |

显式填写不支持的值会出现 `THINKING_EFFORT_UNSUPPORTED`，不会把这个无效值发给服务商。模型已有强度配置时仍保留原值。例如 MiniMax 不支持“关闭”，这次失败不能把原来的 low 清空，意外回到服务商的 max 默认值。

旧 `deep`、`standard`、`fast`、`off` 继续作为配置别名。通常对应 high、medium、low、none，但仅在目标支持时映射。少数服务按已核实契约使用不同映射：例如 Qwen 的 deep 对应 xhigh，部分 DeepSeek/GLM 的 standard 对应 high。支持独立思考开关的适配器使用专门的 off；MiniMax M3.1 Flash 等始终思考的模型不提供关闭。强度菜单不再固定为四档。

## 已核实的接口契约示例

下表依据 2026-10-27 核对的官方文档描述本地实现，不代表真实付费请求通过，也不代表所有账号都有这些模型权限。只有匹配的接口和协议启用对应控制项。原来标为不可用或待验证的预设不会因此解禁。

| 模型或型号组 | 可选档位 | 接口与限制 |
| --- | --- | --- |
| MiniMax M3.1 Flash | low、medium、high、xhigh、max | `api.minimax.cn`、`api.minimax.io`、`api.minimaxi.com`：Chat 使用 `/v1`，Messages 使用 `/anthropic`。未映射 Responses。不支持关闭思考；服务端省略该字段时默认 max。 |
| GPT-5 / mini / nano | minimal、low、medium、high | `api.openai.com/v1`，Chat 或 Responses。 |
| GPT-5.1 | none、low、medium、high | 同一 OpenAI 官方路径与协议。 |
| GPT-5.2 / 5.4 / 5.4 mini / 5.4 nano / 5.5 | none、low、medium、high、xhigh | 同一 OpenAI 官方路径与协议。 |
| GPT-5.2 Pro / 5.4 Pro | medium、high、xhigh | 仅 Responses。 |
| GPT-5.6 / Sol / Terra / Luna；GPT-6 Sol / Luna | none、low、medium、high、xhigh、max | OpenAI 官方 Chat/Responses；工具协议限制仍由 provider 层处理。GPT-6 Luna 的 Chat 工具仅支持 none。 |
| GPT-6 Astra / GPT-6.1 Sol | low、medium、high、xhigh、max | OpenAI 官方 Chat/Responses；任务工具沿原 Responses 路由。没有 none/minimal。 |
| o3 / o3-mini / o4-mini | low、medium、high | OpenAI 官方 Chat/Responses。 |
| Claude Sonnet 4.6 / Opus 4.6 | low、medium、high、max；off | `api.anthropic.com/v1` Messages；自适应思考加 effort，off 使用独立的关闭思考字段。 |
| Claude Opus 4.7 / 4.8 / 5 / 5.5；Sonnet 5 / 5.5；Haiku 5.5；Fable 5 / 5.1；Mythos 5 / 5.1 | low、medium、high、xhigh、max | Anthropic 官方 Messages。逐个登记明确型号，不匹配未来所有 Claude。没有通用 off。 |
| Claude Mythos Preview | low、medium、high、max | Anthropic 官方 Messages；没有 xhigh。 |
| Gemini 4 Argon / 3.8 Flash / 3.1 Pro Preview | low、medium、high | `generativelanguage.googleapis.com/v1beta/openai`，OpenAI 兼容 Chat；不覆盖 Vertex。 |
| Gemini 3.6 Flash / 3.5 Flash Lite / 3 Flash Preview | minimal、low、medium、high | 同一 Google 兼容接口。 |
| Gemini 3 Pro Preview | low、high | 不提供 medium。 |
| Gemini 2.5 Pro | minimal、low、medium、high | 兼容接口按官方规则转换为思考预算；没有 none。 |
| Gemini 2.5 Flash / Flash Lite | none、minimal、low、medium、high | 同一兼容接口。 |
| DeepSeek Flash / V4 Pro | low、high、max；off 或 none | `api.deepseek.com`：Chat 为根路径或 `/v1`，Messages 为 `/anthropic`，Responses 为根路径。Chat/Messages 提供 off，Responses 提供 none。原预设状态保持。 |
| GLM 5.3 / 5.3-Flash；GLM 5.2 | 5.3：low、high、max；5.2：none、high、max | `api.z.ai/api/paas/v4` Chat。不推定国内 bigmodel 接口。旧款只有开关的模型不冒称多档强度。 |
| Kimi K3 / K3.1 Pro | low、high、max | `api.moonshot.ai/v1` Chat。不推定 `api.moonshot.cn` 和旧 K2 控制项。原待验证预设保持。 |
| Grok 4.5；4.6 / 4.7 | 4.5：low、medium、high；4.6/4.7 增加 xhigh | `api.x.ai/v1` Chat/Responses。多 Agent 数量不是思考强度。 |
| Qwen3.8 Max / Max-0902 | low、medium、xhigh；off | `ap-southeast-1.maas.qwencloudapi.com/compatible-mode/v1` Chat。不推定旧 Dashscope 主机和 Responses。官方契约中思考预算与 effort 不能同时指定。 |

字段按协议转换：Chat 通常用 `reasoning_effort`，Responses 用 `reasoning.effort`，受支持的 Messages 用 `output_config.effort` 并遵循各家的 thinking 规则。MiniMax Messages 不会收到 Claude 的 adaptive thinking 对象。

例如，某兼容服务已独立确认支持 Responses 及下列档位，可在已有模型记录中声明：

```json
{
  "modelMeta": {
    "supportsThinking": true,
    "thinkingProtocol": "responses",
    "allowedEfforts": ["low", "medium", "high"]
  }
}
```

这只是声明适配契约，不授予账号访问权、不验证密钥、不安装插件。必须填写该服务真实支持的协议和档位；声明协议与模型实际请求协议不一致时，不启用这些控制项。

## 子任务怎样继承

子任务显式选择优先于父任务显式选择；子任务未指定时继承父任务的显式档位。两边都未指定时，保留所选子模型自己的默认配置。任务类型自动判断不能把父任务明确选择的强度静默降档。

每次都按子模型重新映射。父任务要求 xhigh，而所选子模型只支持 low/medium 时，记录不支持诊断，保留子模型已有配置或服务商默认，不擅自选择一个“近似档位”。状态与收集结果保留该诊断。子任务继续共用原费用账本、取消与权限规则。

## 上下文窗口与单次输出上限不同

运行 `koder context status`，或在会话中输入 `/context`。输入占用估算包含对话、工具说明与输出预留。另开终端的 status 主要检查配置，不读取其他窗口的实时用量。

请按实际模型文档设置。例如，模型确认支持下列值时：

```sh
koder context set --context-window 128000 --max-output 8192
koder context status
```

这些数字只是示例，不适用于所有模型。提高本地上限不会扩容服务商模型。部分服务把推理 token 也计入输出预算，提高强度可能减少最终可见正文空间。同时指定两个参数可明确窗口与输出预留；只改窗口时，原有规则可能相应降低输出预留。压缩开关与保留规则见[上下文控制](CONTEXT-CONTROLS.zh.md)。

## 达到输出上限后怎样恢复

Koder 先保存已生成的可见正文，再结算本次用量。适配器确认是输出上限、已有可续接正文且没有未完成工具调用时，同一任务最多自动发起 **两次纯文本续答**。

- 续答从未完成的正文接下去；下一次请求没有工具。
- 服务商仍返回工具调用时，以 `MODEL_RECOVERY_REQUIRES_REVIEW` 停止，该调用不执行。
- 取消、费用预留、已知/未知用量和任务预算继续生效。配置费用预算时，用量未知会停止续答；结算失败也会停止。未配置费用预算时，缺失用量仍标为未知，不记录成零。
- 不执行截断的工具参数。仍需工具完成的工作必须明确列为待办。
- 没有可见正文时，不启动文本续答。可以按模型支持范围降低强度或提高单次输出上限；诊断保留实际原因。
- 两次后仍截断则报告剩余问题，已生成正文全部保留。
- 会话保存与重新打开保留片段之间的关联；重开会话不会自动重启生成。

`MODEL_CONTEXT_LIMIT` 是服务商上下文窗口限制，`CONTEXT_BUDGET_EXCEEDED` 是本地上下文预算检查，均不进入上述输出续答循环。应压缩上下文、缩小请求或选择实际窗口更大的模型。网络中断和内容审核保留各自诊断，不改称输出截断。

## 验证范围与平台边界

本地测试使用临时 HOME 和脚本化/loopback provider，覆盖请求字段、子任务显式/默认继承、跨型号降级、费用与取消、续答片段存储及截断工具不执行。它们不等于真实付费模型质量、账号权限或 Windows 实机验收。

Windows 10/11 安装、ConPTY/输入法和 Windows-MCP 图形操作继续由 beta 专员验收。macOS 锁屏原生组件仍为未签名候选、保持 HOLD。当前运行包与升级通过 GitHub Releases 分发。

## 官方参考

- MiniMax：[Chat](https://platform.minimax.cn/docs/api-reference/text-openai-api)、[Messages](https://platform.minimax.cn/docs/api-reference/text-anthropic-api)。
- OpenAI：[推理指南](https://developers.openai.com/api/docs/guides/reasoning)、[模型目录](https://developers.openai.com/api/docs/models)、[最新模型指南](https://developers.openai.com/api/docs/guides/latest-model)。
- Anthropic：[effort](https://platform.claude.com/docs/en/build-with-claude/effort)、[thinking](https://platform.claude.com/docs/en/build-with-claude/thinking)。
- Google：[思考能力](https://ai.google.dev/gemini-api/docs/thinking)、[OpenAI 兼容](https://ai.google.dev/gemini-api/docs/openai)。
- DeepSeek：[思考模式](https://api-docs.deepseek.com/guides/thinking_mode/)、[Responses](https://api-docs.deepseek.com/guides/responses_api/)、[Messages](https://api-docs.deepseek.com/guides/anthropic_api/)。
- Z.ai：[Chat API](https://docs.z.ai/api-reference/llm/chat-completion)。
- Kimi：[思考强度](https://platform.kimi.ai/docs/guide/use-reasoning-effort)。
- xAI：[推理能力](https://docs.x.ai/developers/model-capabilities/text/reasoning)。
- Qwen：[思考能力](https://docs.qwencloud.com/developer-guides/text-generation/thinking)。

