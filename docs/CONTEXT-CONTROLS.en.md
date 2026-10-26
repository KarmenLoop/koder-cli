# Context limits and automatic compaction

For Koder CLI 0.5.1.

Enter `/context` in chat, or run `koder context status` in a terminal, to inspect the selected model's window, output limit and compaction settings. You can change compaction preferences before configuring a model.

Three controls serve different purposes:

| Control | What it changes | Where to set it |
| --- | --- | --- |
| Model window and output limit | The capacity supported by your model, endpoint and account, and the maximum response length | `context set --context-window … --max-output …` |
| Automatic compaction | When older conversation content is excerpted for a request, and how many recent turns to prefer | `context on/off`, thresholds and recent turns |
| Headroom | Reversible compact representations of eligible tool results | Setup → Skills → Headroom context optimization |

Automatic compaction cannot increase a model's window. See [Headroom context optimization](HEADROOM.en.md) for its separate controls and behavior.

## First setup: use the menu

1. Run `koder setup`, or enter `/setup` in an existing chat.
2. Choose **Context and output**.
3. Choose **Model window and output limit**. Enter `contextWindow (tokens)`, then `maxOutput (tokens)`. Use the limits supported by your exact model, endpoint and account. After the second value is saved, the menu confirms **Context limits saved**. Your saved model name, endpoint and credentials are retained.
4. Back in the context submenu, select **Automatic compaction** to switch it on or off.
5. Select **Trigger and target percentages**. Enter the trigger first, then a lower target. Both values are saved together; pressing Esc before finishing cancels that threshold change.
6. Select **Preferred recent turns** and enter an integer from 0 through 100.
7. Choose **Reset compaction preferences** to restore on, an 80% trigger, a 60% target and four recent turns. Model limits, credentials and Headroom settings retain their values.
8. Press Esc to return to the main settings menu, then Esc again to return to chat or your terminal.

Without a model, step 3 needs model configuration first. The compaction controls remain available. When the menu displays a model selected by the project, its limit changes apply to that model.

## Defaults and valid values

| Setting | Default | Valid values |
| --- | --- | --- |
| Automatic compaction | On | `on` or `off` |
| Trigger percentage | 80% | Integer greater than the target, up to 99% |
| Target percentage | 60% | Integer of at least 1%, below the trigger |
| Preferred recent turns | 4 | Integer from 0 through 100 |
| Model window | Current model configuration | Integer from 2,048 through 16,777,216 |
| Output limit | Current model configuration | Integer of at least 256, below the window |

A turn normally includes a user request and its associated assistant responses and tool calls. Recent-turn retention is a preference. Large content may still be excerpted, and recent turns may yield space when necessary. Setting 0 does not permit dropping the current request; setting 100 does not permit exceeding the model window.

Model windows do not have one universal default. Values may come from model defaults, presets or saved records. A provider's advertised maximum may also exceed the limit of a particular proxy endpoint or account. Entering a larger number changes local budgeting; it does not provision a larger provider window.

## Change settings with commands

Inspect the settings:

```sh
koder context status
koder context status --json
```

Change compaction preferences:

```sh
koder context set --trigger-percent 85 --target-percent 60 --keep-turns 6
koder context off
koder context on
koder context reset
```

`on` and `off` change only the switch, retaining thresholds and recent turns. `reset` restores only compaction defaults and can recover invalid compaction values introduced by manual configuration edits. Use `set` for numeric changes; do not attach numeric settings to `status`, `on`, `off` or `reset`.

Change the selected model's limits. These numbers are examples; check your endpoint's limits before using them:

```sh
koder context set --context-window 128000 --max-output 8192
```

Limits are saved in the existing model record, preserving its credentials and endpoint. If you supply only `--context-window`, the output limit follows the existing rule: the smaller of the previous output limit and one quarter of the new window. Supply both flags when you want to set each explicitly.

To choose a saved model, use its configuration name rather than the provider's model ID:

```sh
koder model list
koder context status work
koder context set work --context-window 128000 --max-output 8192
koder context set --model work --context-window 128000 --max-output 8192
```

Without a name, the command follows the current project and model selection. Use `-w` to select a project:

```sh
koder context status -w ./my-project
koder context set -w ./my-project --context-window 128000 --max-output 8192
```

Compaction preferences belong to the current CLI user configuration and are shared by sessions using it. Adding a model name does not create a separate compaction policy for that model.

### Environment models and external provider files

A model configured entirely through `KODER_MODEL`, `KODER_BASE_URL` and related environment variables supports status and compaction preferences. Its limits come from `KODER_CONTEXT_WINDOW` and `KODER_MAX_OUTPUT`; `context set` will not replace it with a saved model.

For the current terminal on macOS, Linux or another shell supporting `export`:

```sh
export KODER_CONTEXT_WINDOW=128000
export KODER_MAX_OUTPUT=8192
koder context status
```

In PowerShell:

```powershell
$env:KODER_CONTEXT_WINDOW = "128000"
$env:KODER_MAX_OUTPUT = "8192"
koder context status
```

These examples assume the model and endpoint are already configured. A project-selected saved model continues to take precedence for that project.

With `--provider path/to/provider.json`, status shows the actual external file's limits. This settings command treats external files as read-only. Select a saved model name to edit limits; the command will not silently update your global default instead.

## Change settings and inspect usage in chat

Chat has the same commands:

```text
/context
/context set --trigger-percent 85 --target-percent 60 --keep-turns 6
/context off
/context on
/context reset
/context status --json
```

Settings commands do not send a model request. The built-in Koder engine reads saved compaction preferences for subsequent requests, including changes made from another terminal using the same user configuration. Limit changes still follow the selected model.

`/context` can show the estimate from this session's last request. When no request record is available, JSON returns `lastRequest: null`. A separately launched `koder context status` primarily inspects configuration; it does not connect to another running chat for live usage.

In JSON, `contextCompaction` contains the current settings and `model` identifies the selected model. `lastRequest` describes the last recorded request. Editing a setting does not recalculate that request under the new settings.

| `lastRequest` field | Meaning |
| --- | --- |
| `estimated` | Estimated tokens in request messages |
| `toolTokens` | Estimated tokens in tool definitions |
| `output` | Output reserved for this request |
| `window` | Model window used for this request |
| `compaction.triggered` | Whether the automatic compaction trigger was reached |
| `compaction.applied` | Whether the model-visible context actually changed |
| `compaction.beforeTokens` / `afterTokens` | Budget estimates before and after compaction |
| `compaction.removedMessages` / `compactedMessages` | Message counts removed from the request or represented as excerpts |
| `compaction.reason` | A reason such as below trigger, target reached or protected content |

The before/after totals include the configured output reserve; `output` is the actual request reserve after fitting the window. A soft-target total may stay high while the actual request uses a smaller output reserve. These are local estimates, not billed tokens, cache hits or evidence of cost savings. Chat shows a brief notice when history compaction is applied, without repeating notices for unchanged context.

## Triggers, targets and oversized requests

The trigger compares estimated full input, tool definitions and reserved output against the model window. The default attempts compaction at 80%, aiming for about 60%. Output reserve occupies the same window; it is not extra capacity beyond the input allowance.

The target is best effort. The current request, system content, preferred recent turns and protected records can keep a request above the target. Reaching the trigger does not guarantee that content can be reduced. The configured output limit is a ceiling; the request's actual reserve also depends on remaining room.

Turning automatic compaction off retains full history for requests, subject to necessary protocol restoration. Some providers require private reasoning state that is not retained on disk. A restored session cannot invent that state or replay old protocol calls with missing state; visible history may be restored as quoted reference material. If Headroom is still enabled, it can also continue using reversible representations for eligible tool results.

When input and tool definitions cannot fit within the hard window, the command reports `CONTEXT_BUDGET_EXCEEDED`. Saved history and original tool receipts remain available. Depending on the cause:

1. Check the actual model and endpoint limits, and correct a window set too low.
2. Reduce the output ceiling to leave more input space, taking the required response length into account.
3. Enable automatic compaction and adjust its thresholds or preferred recent turns.
4. Remove unnecessary large material from the current request, or choose a model that actually supports a larger window.

Increasing a local number cannot resolve a provider's real limit. Failure also does not undo earlier tool operations; check their receipts before continuing.

## History, execution state and supported paths

Compaction changes what is sent to the model. It does not replace complete conversation history on disk or create a second memory store. An excerpt does not supply new instructions, approval or proof that an operation succeeded.

Incomplete, pending, `UNKNOWN` and unconfirmed tool records are preserved. Signed protocol groups remain intact below the hard window. If enabled compaction still cannot fit a complete returned signed group, Koder may atomically turn it into quoted visible receipts: call identities, arguments and tool results remain, visible assistant text may be excerpted, and private blocks and signatures are omitted together. It never attaches an old signature to edited text. This reconstruction is unavailable for pending or unknown groups and when compaction is off. Calls and their results are handled as groups. A summary cannot convert an unknown outcome into success or authorize a replay. Existing permissions, cost budgets, cost reservations and cancellation remain in effect.

The built-in Koder engine applies the same user compaction policy to main chat, `ask`/`run`, child agents and MoA requests. Each request remains subject to its own model window and output limit. Restored sessions retain their original saved history. External engines such as Hermes/ACP manage their own context; this guide does not claim that these settings control their internal requests.

### If saving fails

A combined model-limit and compaction change validates every parameter before writing. Invalid parameters do not cause one part to be saved first. The two configuration files are still written sequentially. A later file operation can produce `CONTEXT_SAVE_PARTIAL`; read its report of saved and unsaved settings, run `koder context status` to check, and retry the unsaved part.

This guide describes settings and behavior. It is not a paid-model quality, billing, device-compatibility or release acceptance report.

Disk persistence still follows the existing memory setting. `--no-memory` keeps the live session records in RAM; this feature does not silently turn disk memory on.
