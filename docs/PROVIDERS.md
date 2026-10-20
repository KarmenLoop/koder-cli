# Model providers and compatibility

This guide covers **0.4.0-preview.12**, checked on **October 20, 2026**. Koder directly handles Chat Completions, Anthropic Messages, and Responses. It does not require a separate agent engine to adapt a model API.

## What the catalog means

The 35 visible presets contain 94 curated model choices. Each cloud preset has a local native tool-call/result round trip. Local fixtures check request fields, response parsing and continuation; they do not establish your account’s model access, region, quota, billing or reliability. Some providers require model activation or a deployment endpoint in their console. The list contains task models, not every audio, image, embedding or batch service a vendor sells.

| Preset | Curated model IDs | Native protocol | Source |
| --- | --- | --- | --- |
| zhipu | glm-5.3, glm-5.3-flash | openai | [Official reference](https://docs.bigmodel.cn/cn/guide/models/text/glm-5.3) |
| qwen | qwen3.8-max, qwen3.8-flash | openai | [Official reference](https://help.aliyun.com/en/model-studio/qwen3-8-max) |
| mimo | mimo-v2.6-pro, mimo-v2.6-flash | openai | [Official reference](https://platform.xiaomimimo.com/#/docs) |
| mimo-token-plan | mimo-v2.6-pro, mimo-v2.6-flash | openai | [Official reference](https://platform.xiaomimimo.com/#/docs) |
| kimi | kimi-k3, kimi-k2.7-code, kimi-k2.6 | openai | [Official reference](https://platform.moonshot.cn/docs/intro) |
| doubao | doubao-seed-2-1-pro-260915, doubao-seed-2-1-lite-260915 | openai | [Official reference](https://docs.volcengine.com/docs/ark/model-list?lang=zh) |
| hunyuan | hunyuan-turbos-latest, hunyuan-t1-latest | openai | [Official reference](https://cloud.tencent.com/document/product/1729/111007) |
| stepfun | step-3.7-flash, step-3.5-flash | openai | [Official reference](https://static.stepfun.com/blog/step-3.7-flash/) |
| baichuan | Baichuan4-Turbo, Baichuan4-Air, Baichuan4 | openai | [Official reference](https://platform.baichuan-ai.com/docs/) |
| spark | 4.0Ultra, generalv3.5 | openai | [Official reference](https://www.xfyun.cn/doc/spark/HTTP%E8%B0%83%E7%94%A8%E6%96%87%E6%A1%A3.html) |
| qianfan | ernie-5.0 | openai | [Official reference](https://intl.cloud.baidu.com/en/doc/qianfan/s/7m95lyy43-intl-en) |
| minimax | MiniMax-M3.1-Flash, MiniMax-M3, MiniMax-M2.7 | openai | [Official reference](https://platform.minimax.io/docs/guides/models-intro) |
| minimax-cn | MiniMax-M3.1-Flash, MiniMax-M3, MiniMax-M2.7 | openai | [Official reference](https://platform.minimax.io/docs/guides/models-intro) |
| deepseek | deepseek-v4-pro, deepseek-flash | openai | [Official reference](https://api-docs.deepseek.com/quick_start/pricing) |
| chatgpt | gpt-6.1-sol, gpt-6-astra, gpt-6-luna, gpt-6-sol | responses | [Official reference](https://developers.openai.com/api/docs/guides/latest-model) |
| claude | claude-opus-5-5, claude-fable-5-1, claude-sonnet-5-5, claude-haiku-5-5 | anthropic | [Official reference](https://platform.claude.com/docs/en/models/overview) |
| gemini | gemini-4-argon, gemini-3.8-flash, gemini-3.6-flash | openai | [Official reference](https://ai.google.dev/gemini-api/docs/models) |
| grok | grok-4.7 | openai | [Official reference](https://docs.x.ai/developers/models) |
| mistral | mistral-large-4, mistral-medium-3-5, devstral-latest, mistral-small-latest | openai | [Official reference](https://docs.mistral.ai/models/mistral-large-4-0) |
| groq | openai/gpt-oss-120b, openai/gpt-oss-20b, llama-3.3-70b-versatile | openai | [Official reference](https://console.groq.com/docs/models) |
| cerebras | qwen-3.8-27b, gpt-oss-120b | openai | [Official reference](https://inference-docs.cerebras.ai/models/overview) |
| nvidia | deepseek-ai/deepseek-v4.1-flash, z-ai/glm-5.3, nvidia/nemotron-3.5-super-vl-120b-a12b | openai | [Official reference](https://integrate.api.nvidia.com/v1/models) |
| huggingface | openai/gpt-oss-120b, moonshotai/Kimi-K3, Qwen/Qwen3.8-27B | openai | [Official reference](https://router.huggingface.co/v1/models) |
| siliconflow | deepseek-ai/DeepSeek-V4-Flash | openai | [Official reference](https://api-docs.siliconflow.cn/docs/api/models-get) |
| openrouter | openai/gpt-6.1-sol, anthropic/claude-sonnet-5.5, google/gemini-4-argon, deepseek/deepseek-v4.1-flash | openai | [Official reference](https://openrouter.ai/api/v1/models) |
| together | moonshotai/Kimi-K3, openai/gpt-oss-120b | openai | [Official reference](https://docs.together.ai/docs/serverless/models) |
| fireworks | accounts/fireworks/models/kimi-k3, accounts/fireworks/models/gpt-oss-120b | openai | [Official reference](https://docs.fireworks.ai/getting-started/quickstart) |
| perplexity | openai/gpt-6.1-sol, google/gemini-4-argon | responses | [Official reference](https://docs.perplexity.ai/docs/agent-api/models) |
| local | 本地模型 | openai | Endpoint and model selected by the user |
| kilo-free | Enter an actual available model ID | openai | Endpoint and model selected by the user |
| custom | Enter an actual available model ID | openai | Endpoint and model selected by the user |
| hunyuan-tokenhub | hy4-preview | openai | [Official reference](https://intl.cloud.tencent.com/zh/document/product/1300/80695) |

A model’s presence in a public listing does not guarantee access with every account. NVIDIA, Hugging Face and OpenRouter entries were compared with their live public model APIs. Other entries use the linked official model documentation. SiliconFlow’s current available models are account-specific; its official documented model example is bundled, and the account refresh below returns the exact IDs your key can access. Do not infer a reseller ID by copying the original vendor’s ID.

Tencent HY4 TokenHub is a separate endpoint and credential choice. It does not move legacy Hunyuan keys to a different host. Xiaomi pay-as-you-go and Token Plan keys also stay separate; see [MIMO.md](MIMO.md).

## Verify your selected account

First save a provider in `koder setup`. Then run:

```sh
koder model test
koder model test --tools
```

The first command checks a text reply only. The second explicitly makes up to two model requests using a harmless fixed probe function and its result; the provider may bill those requests. It does not read files, run a shell command or grant computer permissions. Only successful tool calling and continuation produces the task-capability success message. A 401, permission failure, quota error or text-only result is reported as a failed check, without changing the account or selecting another model.

## Get current account model IDs

```sh
koder model models
koder model models chatgpt
koder model refresh
```

The first two commands show the bundled catalog without network access. Refresh performs authenticated, read-only model-list requests to the configured endpoint. It writes a local metadata cache, without changing the active model, endpoint or API key and without making an inference request. Models explicitly marked as supporting tools can appear in the next setup picker. Entries with unknown tool support remain listed in the refresh output as unverified; enter an ID manually and run the tool check before relying on it. Unsupported model-list APIs fail clearly and keep the previous cache.

## Removed or excluded choices

- Yi is hidden because its inherited provider notice marks the API as stopped. A saved official Yi endpoint receives a clear local error. Koder never moves that key to another service.
- Legacy Perplexity Sonar choices are removed after the provider’s announced September 27, 2026 retirement. Perplexity now uses the Agent API through its Responses alias and supports local custom function loops.
- Batch-only IDs, transcription/TTS, safety classifiers and dedicated computer-use API models are excluded from the general task picker. A third-party SDK catalog entry alone is not proof of task compatibility.
- Baichuan medical M3 variants are not offered as general task models until their model-specific tool contract is established. The documented Baichuan4 tool-capable models remain available.

This is a statement about this release’s supported task contracts, not a claim that every excluded model is impossible to integrate forever. Custom endpoints remain explicit user configurations. No account acceptance is claimed for any vendor in this repair.

## Backup engine state

Koder is the default and handles the configured API directly. The internal fallback integration is retained but **disabled and gray in setup by default**. A saved old Hermes selection cannot launch it unless the internal fallback-enabled setting is already explicit. There is no automatic fallback after an API failure. The pinned fallback runtime cannot preserve a non-OpenAI Responses custom route and rejects that route before handing off a credential. Improve or change the native API configuration instead.

## Download completion deadline

The installer bootstrap, program/runtime downloads and CLI updater default to **100000000 seconds**. You may explicitly set `KODER_DOWNLOAD_TIMEOUT_SECONDS` to an integer from 1 through 100000000 for a shorter limit. Progress remains visible and Ctrl+C cancels. Long Node deadlines are scheduled in bounded chunks, avoiding timer overflow. This setting does not increase the five-second existing-Node probe or model API timeouts. Checksums and agreement checks still apply.

## Alibaba and Volcano subscriptions

Checked October 20, 2026. These are separate native API routes; subscription access is not implied by an ordinary provider key. A custom proxy remains explicit and is never silently redirected.

### Alibaba Cloud: aliyun-token-plan

Base URL: https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1. Default: qwen3.8-max. Models: qwen3.8-max, qwen3.8-flash, qwen3.7-plus, deepseek-v4-pro, glm-5.2.

[Official setup](https://help.aliyun.com/zh/model-studio/token-plan-personal-overview). Account and regional availability must be checked in the plan console.

### Alibaba Cloud: aliyun-coding-plan

Base URL: https://coding.dashscope.aliyuncs.com/v1. Default: qwen3.7-plus. Models: qwen3.7-plus, qwen3.6-plus, kimi-k2.5, glm-5, MiniMax-M2.5, qwen3-coder-next, qwen3-coder-plus.

[Official setup](https://help.aliyun.com/zh/model-studio/coding-plan). Account and regional availability must be checked in the plan console.

### Volcano Engine: volcano-coding-plan

Base URL: https://ark.cn-beijing.volces.com/api/coding/v3. Default: ark-code-latest. Models: ark-code-latest, doubao-seed-2.1-pro, doubao-seed-2.1-lite, doubao-seed-evolving, minimax-m3, glm-5.3, glm-5.3-flash, deepseek-v4.1-flash, deepseek-v4-pro, kimi-k3, kimi-k2.8-preview.

[Official setup](https://ark.volcengine.com/region:cn-beijing/docs/coding-plan-personal-get-started). Account and regional availability must be checked in the plan console.

Alibaba Token Plan personal/team subscriptions share the documented Token Plan service path but have their own issued keys and data terms. Coding Plan is a separate subscription with different supported versions and no Responses route. Both use their own sk-sp- key; the prefix alone cannot prove which subscription issued it. Ordinary Alibaba API credentials do not substitute for a subscription.

Volcano Coding Plan uses /api/coding/v3 for Chat Completions or Responses, and /api/coding for Anthropic Messages. Standard /api/v3 is a separate metered route. Use ark-code-latest to follow the console selection, or an exact supported model name; metered ep- endpoint IDs are not Coding Plan model names.

Token Plan Anthropic base: https://token-plan.cn-beijing.maas.aliyuncs.com/apps/anthropic. Alibaba Coding Plan Anthropic base: https://coding.dashscope.aliyuncs.com/apps/anthropic. Koder appends /v1/messages for these documented compatibility bases.

Provider subscription rules and data practices remain the provider’s terms. In particular, review the current Alibaba personal/team data terms before submitting private work. No compatibility test here establishes live account access or billing eligibility.
