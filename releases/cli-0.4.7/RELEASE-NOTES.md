# Koder CLI 0.4.7

This release adds automatic model discovery, account-scoped caches, reviewed configuration hints and refresh controls to Setup, preserving the complete 0.4.6 feature set. Windows and macOS use the same versioned CLI archive. Run `koder update`, then confirm `koder --version` reports 0.4.7. If a 0.4.4-or-earlier updater rejects the larger manifest, run the official installer once without deleting settings or history.

Starting with 0.4.7, **Setup → Model** checks the current account's Models API and downloads public provider configuration hints. Refreshing never changes your selected model, API key or billing route.

## Use it

1. Run `koder setup`, or `/setup` in chat. A configured account is queried at its existing endpoint. During initial setup, choose a provider and initial model, then enter the key; discovery follows key entry.
2. Open **Current account models** to choose a newly discovered ID. Type that label to filter the menu. You can still enter an ID manually.
3. Inspect the source, retrieval time, declared tool capability and any returned context/output limits. Only an explicit model selection is saved. Environment or provider-file overrides remain owned by that source.
4. **Refresh model information now** bypasses the cache. **Automatic model updates** turns automatic discovery off; manual refresh remains available.

```text
koder model refresh
koder model refresh <saved-model-name>
koder model catalog-refresh
koder model models
koder model test --tools
```

Account lists have a six-hour cache; public hints have a 24-hour cache. Checks run when the model page opens or a key is first configured, with a five-second default deadline covering pagination. Esc cancels. A failed refresh keeps the last good list and saved configuration. No additional daemon or inference request is started.

## Sources and boundaries

The provider Models API supplies IDs visible to the configured account. Cache identity includes the endpoint, protocol and credential fingerprint; the cache does not store the API key. Unknown tool capability is labeled rather than silently filtered out. Explicitly tool-incompatible or retired models are unavailable in the task picker. A listed model is not proof of a successful tool loop: use `model test --tools`.

Public configuration hints come from `https://karmenloop.com/install/model-catalog-v1.json` without credentials. Each entry records its provider documentation URL and review date. This is a maintained snapshot, not a claim of continuous live coverage of every provider. New hints can arrive without reinstalling the CLI; protocol implementation changes still require a runtime update. Invalid or older data cannot replace the cache. A changed endpoint or protocol is flagged for review, never used to move a saved key or change billing products. Existing unavailable providers remain disabled.

Alibaba Coding Plan documents that it does not expose its model list through an API. That route uses documented presets and manual IDs instead of treating a missing Models API as inference failure. Metered APIs, Token/Coding Plans and regions retain separate credentials and endpoints.

Missing token limits are not guessed from names. Unknown models keep conservative defaults; declared limits are bounded and applied only when a model is explicitly selected. Refreshing alone does not increase the current model's context. Limits can still be set in Setup.

`fresh` means retrieved this time; `cached` means within TTL; `stale` means refresh failed and previous data remains. `unavailable`, `unsupported`, `held`, `disabled` and `cancelled` distinguish missing listings, unsupported listing APIs, known integration issues, disabled refresh and user cancellation. HTTP 401 requires checking credentials for that exact service. A listing failure is not an inference failure.

Tests use isolated protocol fixtures and terminal input. Native Windows consoles, real provider accounts and paid inference retain separate acceptance status.

## Official references

- [OpenAI Models API](https://developers.openai.com/api/reference/resources/models/methods/list)
- [Claude Models API](https://platform.claude.com/docs/en/api/models/list)
- [Alibaba Coding Plan FAQ](https://help.aliyun.com/en/model-studio/coding-plan-faq)
- [MiniMax OpenAI-compatible configuration](https://platform.minimax.cn/docs/api-reference/text-openai-api)

Published at the user's request. Native Windows cold installation, MCP GUI, real-account calls and model quality are not certified by this release. Prior artifacts, failed evidence and rollback paths remain available.
