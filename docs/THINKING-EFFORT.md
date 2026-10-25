# Thinking effort

`koder chat --effort deep`, `koder run --effort fast`, and `koder ask --effort off` select effort without changing the model or execution permissions. IDs are `deep`, `standard` (default), `fast`, and `off`. Invalid IDs exit with code 2.

Resolution order is session options (`thinkingEffort` or `effort`), workspace `.koder/config.json` `thinkingEffort`, then user `config.json` `thinkingEffort`. A session binds requests at construction; changes apply when the frontend constructs the next session between turns.

`normalizeThinkingEffort(value)`, `resolveThinkingEffort({opts,project,config})`, and `mapThinkingEffort(record, effort, {explicit})` live in `src/thinking-effort.mjs`. The mapping returns `requested`, `effective`, `supported`, `fields`, `preserveLegacy`, and `notice`. Session `modelInfo()` exposes requested/effective effort, support, and notice. Unknown capability falls back to standard provider behavior with no speculative request fields. Explicit unsupported selections receive one notice per constructed session; frontends may deduplicate notices and set `io.suppressEffortNotice`.

Known official OpenAI endpoints map deep/standard/fast to high/medium/low. GPT-5.1, GPT-5.2, and GPT-5.4 can map off to none; GPT-5, o3/o4 and GPT-6 family off are conservatively unsupported here. Responses uses `reasoning.effort`; Chat Completions uses `reasoning_effort`. Known Claude Sonnet 4.6 and Opus 4.6 on the official Anthropic endpoint use adaptive thinking and `output_config.effort`, or disabled thinking for off. Arbitrary compatible endpoints never inherit capability merely from a model name.

An explicit model record may declare `modelMeta: {supportsThinking:true, thinkingProtocol:"openai", allowedEfforts:["deep","standard","fast"]}`. Supported protocol declarations are `openai`, `responses`, and `anthropic-adaptive`; declarations must match the endpoint's real capability and the final normalized wire protocol. If provider normalization selects Responses, metadata must declare `responses`; an `openai` declaration falls back to standard behavior without emitting incompatible fields. Omitted allowedEfforts conservatively excludes off. An explicit false capability disables inferred mappings. Existing vendor reasoning settings remain active when the user has not explicitly selected a new effort; their effective label is `provider-default`. External ACP engines report effort control as unsupported. Agentd forwards the original opts and returns the server session's modelInfo.

Official references checked during implementation:

- [OpenAI reasoning guide](https://developers.openai.com/api/docs/guides/reasoning)
- [OpenAI deployment checklist](https://developers.openai.com/api/docs/guides/deployment-checklist)
- [OpenAI GPT-5 controls](https://help.openai.com/en/articles/5072518-controlling-the-length-of-openai-model-responses)
- [Anthropic adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- [Anthropic effort](https://platform.claude.com/docs/en/build-with-claude/effort)

Focused fixtures inspect actual serialized request bodies without keys or network. Live provider and target-device validation remain NOT_RUN.

## Request fields

| Capability | deep | standard | fast | off |
| --- | --- | --- | --- | --- |
| Supported OpenAI Chat Completions | `reasoning_effort: high` | `medium` | `low` | `none` only where explicitly supported |
| Supported OpenAI Responses | `reasoning.effort: high` | `medium` | `low` | `none` only where explicitly supported |
| Supported Anthropic adaptive thinking | `thinking.type: adaptive`, `output_config.effort: high` | adaptive / medium | adaptive / low | `thinking.type: disabled` |
| Unknown endpoint, incompatible metadata or unsupported effort | no speculative fields; standard fallback | standard provider behavior | no speculative fields; standard fallback | no speculative fields; standard fallback |
| Existing provider reasoning with no explicit new effort | preserve original fields; effective `provider-default` | preserve original fields | preserve original fields | preserve original fields |
| External ACP engine | unsupported; engine retains authority | engine retains authority | unsupported | unsupported |

The existing provider and BYOK route remain authoritative. MOA maps each member independently and reports the aggregator's effective value in the footer. The table documents the adapter, not live service certification.
