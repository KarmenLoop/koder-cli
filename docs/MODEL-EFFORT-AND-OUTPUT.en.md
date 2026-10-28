# Model reasoning effort and output limits

Available in Koder CLI 0.5.4. This guide describes Koder's built-in model adapters. External engines such as Hermes/ACP retain their own controls.

## Choose effort in a chat

1. Run `koder --version` and confirm 0.5.4 or later.
2. Start `koder chat`, then use `/model` to select a configured model.
3. Enter `/effort`. The menu lists levels for that model, endpoint and request protocol.
4. Choose a listed value. You can also type, for example, `/effort high` when `high` appears in the menu.
5. Run `/model show` to inspect the current model and effective effort. While work is active, a model or effort change follows the existing next-turn boundary; it does not replay completed tools.

Ctrl+E cycles supported choices. Setup can change this shortcut to open a picker. A noninteractive task can use `koder run --effort high "Review this module"` when the selected model supports that level.

The menu is based on an installed capability table, not a live account-entitlement check. It matches the model ID, HTTPS service path and actual wire protocol. A familiar model name on an unverified proxy does not inherit the official service's controls. Custom ports, paths and regional endpoints are not guessed. Explicit `modelMeta` can describe a compatible service after its operator's contract has been checked.

## Defaults and compatibility

Without an explicit session, project or user effort selection, Koder retains the selected model's existing `reasoningEffort` configuration. It does not replace that field with an empty override in a child task. If there is no configured effort, the adapter's existing behavior remains in effect.

The effective display distinguishes three cases:

| Display | Meaning |
| --- | --- |
| A native level, such as `low` | The retained or selected level is recognized for this model. |
| Existing model setting | An existing legacy value is retained, but the capability table does not verify its level. |
| Provider default | No effort override is active. The service determines its own default. |

An unsupported explicit value produces `THINKING_EFFORT_UNSUPPORTED`; it is not sent as a new invalid field. If the model already has a configured effort, that setting stays in effect. This matters for MiniMax: an unsupported “off” choice must not accidentally discard an existing low setting and fall back to the service's max default.

The old `deep`, `standard`, `fast` and `off` names remain configuration aliases. Usually they map to high, medium, low and none, respectively, but only if the target supports the mapping. Provider-specific aliases follow the installed contract: for example, Qwen's deep maps to xhigh, and some DeepSeek/GLM standard values map to high. Off is a separate thinking toggle for supported adapters; it is unavailable for always-thinking models such as MiniMax M3.1 Flash. There is no universal four-level cycle.

## Verified contract examples

This table records source contracts checked on 2026-10-27. It is not a claim that a paid request succeeded or that every account can use these models. Only the listed endpoint/protocol combinations receive these defaults. Held presets remain held.

| Model or group | Choices | Endpoint and limits |
| --- | --- | --- |
| MiniMax M3.1 Flash | low, medium, high, xhigh, max | `api.minimax.cn`, `api.minimax.io`, `api.minimaxi.com`: Chat at `/v1`; Messages at `/anthropic`. Responses is not mapped. Thinking cannot be disabled; omission defaults to max in the service contract. |
| GPT-5 / mini / nano | minimal, low, medium, high | `api.openai.com/v1`, Chat or Responses. |
| GPT-5.1 | none, low, medium, high | Same official OpenAI path and protocols. |
| GPT-5.2 / 5.4 / 5.4 mini / 5.4 nano / 5.5 | none, low, medium, high, xhigh | Same official OpenAI path and protocols. |
| GPT-5.2 Pro / 5.4 Pro | medium, high, xhigh | Responses only. |
| GPT-5.6 / Sol / Terra / Luna; GPT-6 Sol / Luna | none, low, medium, high, xhigh, max | Official OpenAI Chat/Responses; the provider layer retains tool-protocol restrictions. GPT-6 Luna Chat tool use is restricted to none. |
| GPT-6 Astra / GPT-6.1 Sol | low, medium, high, xhigh, max | Official OpenAI Chat/Responses; task tools use the existing Responses routing. No none/minimal. |
| o3 / o3-mini / o4-mini | low, medium, high | Official OpenAI Chat/Responses. |
| Claude Sonnet 4.6 / Opus 4.6 | low, medium, high, max; off | `api.anthropic.com/v1` Messages, adaptive thinking plus effort. Off uses the separate disabled-thinking setting. |
| Claude Opus 4.7 / 4.8 / 5 / 5.5; Sonnet 5 / 5.5; Haiku 5.5; Fable 5 / 5.1; Mythos 5 / 5.1 | low, medium, high, xhigh, max | Official Anthropic Messages. These are explicit model entries, not a wildcard for future Claude models. No generic off control. |
| Claude Mythos Preview | low, medium, high, max | Official Anthropic Messages; no xhigh. |
| Gemini 4 Argon / 3.8 Flash / 3.1 Pro Preview | low, medium, high | `generativelanguage.googleapis.com/v1beta/openai`, OpenAI-compatible Chat. Not a Vertex mapping. |
| Gemini 3.6 Flash / 3.5 Flash Lite / 3 Flash Preview | minimal, low, medium, high | Same Google compatibility endpoint. |
| Gemini 3 Pro Preview | low, high | Medium is not offered. |
| Gemini 2.5 Pro | minimal, low, medium, high | Compatibility endpoint translates effort to its documented thinking budget; no none. |
| Gemini 2.5 Flash / Flash Lite | none, minimal, low, medium, high | Same compatibility endpoint. |
| DeepSeek Flash / V4 Pro | low, high, max; off or none | `api.deepseek.com`: Chat at root or `/v1`, Messages at `/anthropic`, Responses at root. Chat/Messages expose off; Responses exposes none. Held status is unchanged. |
| GLM 5.3 / 5.3-Flash; GLM 5.2 | 5.3: low, high, max; 5.2: none, high, max | `api.z.ai/api/paas/v4`, Chat. The CN bigmodel endpoint is not inferred. Older toggle-only GLM models are not presented as graded effort. |
| Kimi K3 / K3.1 Pro | low, high, max | `api.moonshot.ai/v1`, Chat. CN `api.moonshot.cn` and older K2 controls are not inferred. Held presets remain held. |
| Grok 4.5; 4.6 / 4.7 | 4.5: low, medium, high; 4.6/4.7 also xhigh | `api.x.ai/v1`, Chat/Responses. Multi-agent count is not effort. |
| Qwen3.8 Max / Max-0902 | low, medium, xhigh; off | `ap-southeast-1.maas.qwencloudapi.com/compatible-mode/v1`, Chat. Old Dashscope hosts and Responses are not inferred. Thinking budget and effort are mutually exclusive in the provider contract. |

The adapter sends the proper field for the protocol: Chat generally uses `reasoning_effort`, Responses uses `reasoning.effort`, and supported Messages adapters use `output_config.effort` with their own thinking rules. MiniMax Messages does not receive Claude's adaptive-thinking object.

For a compatible service with independently confirmed Responses support, an existing model record can contain:

```json
{
  "modelMeta": {
    "supportsThinking": true,
    "thinkingProtocol": "responses",
    "allowedEfforts": ["low", "medium", "high"]
  }
}
```

This metadata declares an adapter contract; it does not grant access, validate an API key or install a plugin. Use the protocol and levels documented by that service. A declared protocol that disagrees with the model's actual request protocol does not enable the controls.

## Child tasks

An explicit child effort overrides an explicit parent selection. Otherwise, a child inherits the parent's explicit selection. If neither selected a level, the child retains the selected child model's own default. Automatic task classification must not silently replace an explicit parent choice.

Every child choice is mapped against the child model. If a parent asks for xhigh but a selected child only supports low/medium, the child records an unsupported-effort diagnostic and keeps its model configuration or provider default; it does not invent an equivalent level. Status and collected results retain that diagnostic. Delegated requests still share the task's cost accounting, cancellation and permissions.

## Input context and output ceiling are different

Run `koder context status`, or `/context` inside chat. The input estimate includes conversation, tool descriptions and the output reserve. A standalone status command reports configuration; it does not read live usage from another terminal.

Use the exact model's documented limits. For a model that supports these values:

```sh
koder context set --context-window 128000 --max-output 8192
koder context status
```

These values are an example, not a universal recommendation. Raising the saved ceiling does not enlarge the provider's model. Some services include reasoning tokens in the output budget, so higher effort can leave less room for visible text. Setting both flags makes the desired window and output reserve explicit; the existing single-window change may lower the output reserve. See [context controls](CONTEXT-CONTROLS.en.md) for compaction switches and retention rules.

## When a reply reaches its output limit

Koder preserves the visible text before accounting for its usage. When the adapter identifies an output-limit finish, the reply contains usable text, and there is no incomplete tool call, it may request up to **two text-only continuations** in the same task.

- The next request continues the unfinished answer; it receives no tools.
- A provider that nevertheless returns a tool request is stopped with `MODEL_RECOVERY_REQUIRES_REVIEW`. That call is not executed.
- Cancellation, cost reservations, known/unknown usage and configured task budgets remain in force. With a configured cost budget, unknown usage stops continuation; accounting failures also stop it. Without a cost budget, missing usage stays unknown rather than zero.
- A partial tool argument is never executed. If tool work is still necessary, the task must say what remains.
- With no usable visible text, no automatic text continuation starts. Lower effort or a larger supported output ceiling may help; the error retains the reason.
- After two continuations, remaining truncation is reported and all generated text remains available.
- Saved fragments retain their association across conversation storage and reload. Reloading does not automatically restart generation.

`MODEL_CONTEXT_LIMIT` is a provider context-window limit, while `CONTEXT_BUDGET_EXCEEDED` is the local context-budget check. Neither triggers this output-continuation loop. Use compaction, reduce the request or choose a model with more actual context capacity. A network interruption and content filtering also retain their own diagnostics; they are not relabeled output truncation.

## Evidence and platform scope

Local tests use temporary homes and scripted/loopback providers. They cover request fields, explicit/default child inheritance, cross-model fallback, cost and cancellation controls, continuation persistence, and rejection of incomplete tool calls. They do not establish paid-provider quality, account entitlement or Windows device behavior.

Windows 10/11 installation, ConPTY/IME and Windows-MCP graphical operation remain with the beta acceptance team. The unsigned macOS locked-use helper remains on hold. Current runtime packages and updates are distributed through GitHub Releases.

## Official references

- MiniMax: [Chat](https://platform.minimax.cn/docs/api-reference/text-openai-api), [Messages](https://platform.minimax.cn/docs/api-reference/text-anthropic-api).
- OpenAI: [reasoning guide](https://developers.openai.com/api/docs/guides/reasoning), [model catalog](https://developers.openai.com/api/docs/models), [latest-model guide](https://developers.openai.com/api/docs/guides/latest-model).
- Anthropic: [effort](https://platform.claude.com/docs/en/build-with-claude/effort), [thinking](https://platform.claude.com/docs/en/build-with-claude/thinking).
- Google: [thinking](https://ai.google.dev/gemini-api/docs/thinking), [OpenAI compatibility](https://ai.google.dev/gemini-api/docs/openai).
- DeepSeek: [thinking mode](https://api-docs.deepseek.com/guides/thinking_mode/), [Responses](https://api-docs.deepseek.com/guides/responses_api/), [Messages](https://api-docs.deepseek.com/guides/anthropic_api/).
- Z.ai: [Chat API](https://docs.z.ai/api-reference/llm/chat-completion).
- Kimi: [reasoning effort](https://platform.kimi.ai/docs/guide/use-reasoning-effort).
- xAI: [reasoning](https://docs.x.ai/developers/model-capabilities/text/reasoning).
- Qwen: [thinking](https://docs.qwencloud.com/developer-guides/text-generation/thinking).

