# Use Xiaomi MiMo V2.6 with Koder CLI

Koder supports the OpenAI-compatible MiMo endpoint. Choose the credential type first. A Token Plan subscription and a pay-as-you-go API account use different keys and endpoints.

| Account | Koder preset | Default Base URL | Key type |
|---|---|---|---|
| Pay as you go | `mimo` | `https://api.xiaomimimo.com/v1` | `sk-` |
| Token Plan | `mimo-token-plan` | `https://token-plan-cn.xiaomimimo.com/v1` | `tp-` or `ttp-` |

The Token Plan console is authoritative for your cluster. Singapore uses `token-plan-sgp.xiaomimimo.com`; Europe uses `token-plan-ams.xiaomimimo.com`. The setup screen lets you enter the console address. Explicit custom proxy URLs remain available through the custom-provider option.

## Configure without putting your key in command history

Run `koder setup`, choose either **MiMo · pay as you go** or **MiMo · Token Plan**, choose `mimo-v2.6-pro` or `mimo-v2.6-flash`, and paste the key at the masked prompt. In the Chinese UI the preset names are 小米 MiMo · 按量付费 and 小米 MiMo · Token Plan 套餐. Token Plan also asks for the console Base URL.

Alternatively, run one of these in a normal interactive terminal. The command asks for the key without displaying it:

```text
koder model set --preset mimo-token-plan --model mimo-v2.6-pro
koder model test
koder ask "Reply with the single word ready."
```

For Flash, change the model ID to `mimo-v2.6-flash`. For pay as you go, change the preset to `mimo`. An existing environment-variable credential can be selected with `--key-env MIMO_API_KEY`; do not put the actual key in that option.

The API request uses `/chat/completions`, the exact selected model ID and `max_completion_tokens`. Tool-call IDs and reasoning history are retained through subsequent calls. Private reasoning is not printed as the answer. The preset uses a 1,048,576-token context setting and an 8,192-token output ceiling; explicit smaller endpoint/account limits take precedence. Model tests and tasks use your provider quota.

## Use the Hermes engine

The built-in Koder engine can use MiMo without installing Hermes. If Hermes is already installed in your current environment:

```text
koder engine use hermes
koder ask "Reply with the single word ready."
```

With an official MiMo model selected in Koder, the bridge creates a Koder-managed profile under `~/.koder-cli/engines/hermes/mimo-<id>/` (or your explicit Koder CLI home). Its model and endpoint match your choice. The key is passed in the child environment and is not written to the Hermes profile or command line. ACP model selection must succeed before a prompt is sent; refusal does not silently use another model.

Your original Hermes profile, settings and credentials are not overwritten or copied. Its separate conversation history and custom settings are not imported into this new profile. Koder's own conversation continuity remains separate. A changed profile destination is rejected before credential transfer. Non-model settings in the managed profile are retained.

This integration targets the pinned Hermes revision `517b5e10febd619ce30bb22580e29b160266eb43`. Koder's existing Hermes installer uses bash; on Windows use the built-in Koder engine or run the Hermes integration inside WSL. Native Windows Hermes installation is outside this change.

## Check a failure

Run `koder engine list`, `koder model show` and `koder model test`. The model test checks the saved Koder API configuration; a Hermes task additionally checks the actual external engine route. A 401 can indicate the wrong key/endpoint class; 403 can indicate model or region access; 404 can indicate a URL or model-ID error; 429 can indicate rate limits or exhausted quota. Share only redacted output.

The implementation and local protocol checks do not establish access on your Xiaomi account. Complete a live `koder model test` with your own configured key before relying on a task. No membership, learning, sync or computer permission is granted by choosing a model.

Sources: [Xiaomi model IDs and capabilities](https://mimo.mi.com/docs/en-US/quick-start/summary/model), [Token Plan endpoints and credentials](https://mimo.mi.com/docs/en-US/tokenplan/Token%20Plan/quick-access), [Xiaomi's Hermes configuration guide](https://mimo.mi.com/docs/en-US/tokenplan/integration/hermes-agent).
