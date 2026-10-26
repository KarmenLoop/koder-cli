# Koder CLI 0.5.4

Koder now matches reasoning controls to the selected model and preserves long answers that reach a provider's output limit. Delegated tasks keep the intended effort setting, and eligible answers can continue without repeating tool actions.

## Model-specific reasoning controls

The effort picker checks the model ID, official endpoint and request protocol before offering native levels. The choices depend on that combination. An unverified proxy or a similar model name does not inherit the official service's settings.

For example, MiniMax M3.1 Flash exposes low, medium, high, xhigh and max on its supported Chat/Messages endpoints; it does not offer an off switch. GPT-6.1 Sol has five native levels, while earlier OpenAI models have different lists. Claude, Gemini, DeepSeek, GLM, Kimi, Grok and Qwen use their own verified protocol mappings. Existing held presets remain held. See the [capability table and official references](MODEL-EFFORT-AND-OUTPUT.en.md#verified-contract-examples).

Existing model settings remain active until a supported explicit selection overrides them. An unsupported selection reports a diagnostic and retains the existing model setting when present. The footer distinguishes a verified level, an existing unverified model setting, and the provider default. The old deep/standard/fast/off aliases remain compatible where a valid mapping exists.

An explicit child setting overrides the parent. Otherwise, a child inherits the parent's explicit choice; when neither selects one, the child keeps its own model's default. Switching child models triggers a fresh capability check, and an unsupported inherited level is reported rather than sent as an invalid field.

## Preserve an answer at its output limit

Koder saves the visible partial answer before usage accounting. If the provider identifies an output-limit finish, usable text exists and no incomplete tool call is present, the task may make up to two text-only continuation requests.

These requests use the same cancellation controls and cost budget. They have no tools. An unexpected tool call during continuation is rejected, and incomplete tool arguments from the truncated reply are never executed. With a configured cost budget, unknown usage stops continuation; accounting failures also stop it. Without a cost budget, missing usage stays unknown and is never recorded as zero.

Saved answer fragments retain their association across a conversation reload. Reopening the conversation does not automatically restart generation. If the continuation allowance is exhausted, the generated text stays available and the remaining limit is reported.

Context-window errors are separate from output truncation. Koder does not repeatedly resend an oversized context through this continuation path. Higher reasoning effort can use more of a provider's combined reasoning/output budget; increasing a local setting cannot enlarge the model's actual limits.

## Use the controls

1. After installing the update, check `koder --version`.
2. Open `/effort` in a chat, select a listed level, then inspect `/model show`.
3. Use `koder context status` or `/context` to inspect the configured window, output ceiling and compaction policy.
4. When a limit is reported, review the saved text and the specific reason before asking for the remaining work. Do not repeat a completed or unconfirmed operation to recover an answer.

The [step-by-step guide](MODEL-EFFORT-AND-OUTPUT.en.md) covers defaults, child inheritance, supported endpoints, output limits and recovery. Existing [session keys](SESSION-DOCK.en.md) and [context controls](CONTEXT-CONTROLS.en.md) remain available.

## Validation scope

Local automated checks cover request serialization, explicit and default child inheritance, cross-model fallback, shared cost accounting, cancellation, context compaction and persisted answer fragments. They use isolated homes and scripted or loopback providers. Exact final source, package and installer receipts belong in [ACCEPTANCE.md](../ACCEPTANCE.md); local fixtures are not paid-model quality scores.

Paid-provider tasks, authenticated mailbox delivery and external account writes were not run for this change. Native Windows 10/11 installation, ConPTY/IME and Windows-MCP graphical behavior remain with the beta team. The unsigned macOS locked-use helper remains on hold. Existing permissions, approvals, licensing and third-party boundaries remain in effect.

Windows PowerShell/CMD and macOS/Linux installer entry points remain on GitHub Releases. Website content is outside this update.
