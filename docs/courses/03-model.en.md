# 03. Configure a model: give Koder a brain

Allow 35 minutes

**Goal**：Configure the service, protocol and model your account actually supports, then test text and tool round trips separately.

**Preparation**：Have your product type, model ID and official base URL ready. Supply the key only through the dedicated input or a secret manager. Live diagnostics may incur charges.

## Hands-on steps

1. Open model settings in koder setup. Choose region and metered API or plan before the model.

   **Check**：The route matches the key. Disabled entries remain unavailable; a web subscription is not API credit.

2. Save the key, then run koder model show to inspect the model, protocol and address.

   **Check**：Settings match your console. Review and redact output before sharing it.

3. Run koder model test, followed by koder model test --tools after success.

   **Check**：Keep both results. Text success with tool failure is not a working agent integration.

4. Use koder model presets and koder model models <preset-id> where supported; compare with help and your console.

   **Check**：Discovery and account access are different. Refreshed model metadata does not grant quota.

## Troubleshooting and recovery

- **HTTP 401/403**：Check region, product, permissions and key validity instead of repeatedly retrying.
- **422 with 1026/1027**：Treat it as MiniMax content filtering; use lesson 22 to isolate input, not as a connectivity outage.

## Assignment and acceptance

Create a key-free connection card: preset, model, protocol, base URL, text result, tool result and billing source.

**Acceptance**：Support each field with configuration or output. Mark unrun checks NOT_RUN rather than assuming success.

## Developer track

1. Use --key-env VARIABLE_NAME for a secret variable in CI, never the key value in arguments.

2. Use local fixtures for success, 401, 429, 5xx, content filtering and tool-protocol errors; check classification and redaction.

3. Keep diagnostic deadlines separate from long-task retry budgets, and distinguish fixture results from paid calls.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)
- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 3 of 30 · Configure a model: give Koder a brain ━━
  Tip · The model page now discovers current account IDs automatically. Choose Current account models to select one; refresh never switches it for you. A listing is not a tool-call test: run koder model test --tools. Automatic discovery can be disabled, or use koder model refresh manually.
Coach › Koder can't think on its own; it needs a model. The easiest way is the settings screen:
    koder setup
        pick a provider and model with the arrow keys or mouse, paste the key; it can even open the key page
Coach › Prefer commands? Put the key in an environment variable and save only its name:
    setx OPENAI_API_KEY "sk-your-key"
        saved to your account; new windows see it
    $env:OPENAI_API_KEY = "sk-your-key"
        this window only
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        a preset; only the variable name is saved
    koder model set --preset local --model qwen3:8b
        local Ollama, no key
    $env:KODER_MODEL = "gpt-6.1-sol"; $env:KODER_BASE_URL = "https://api.openai.com/v1"; $env:KODER_API_KEY = "sk-…"; koder review
        environment variables, handy in CI
  Tip · koder model presets lists the available presets; koder model show prints the current setup with only the last four characters of the key.
  (whispering) Careful typing keys into commands: PowerShell saves every line in PSReadLine's history file and remembers better than your ex. Paste it in koder setup instead: only the last four show, and it skips shell history, but the key is stored in plaintext in local configuration. Environment-setting commands may enter history too; redact keys before sharing.
Coach › Today the practice project uses the coach model, so this lesson is look-only. Set up a real one after you graduate.
  · You can run koder model presets right there to list them.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 3 of 30 · Configure a model: give Koder a brain ━━
  Tip · The model page now discovers current account IDs automatically. Choose Current account models to select one; refresh never switches it for you. A listing is not a tool-call test: run koder model test --tools. Automatic discovery can be disabled, or use koder model refresh manually.
Coach › Koder can't think on its own; it needs a model. The easiest way is the settings screen:
    koder setup
        pick a provider and model with the arrow keys or mouse, paste the key; it can even open the key page
Coach › Prefer commands? Put the key in an environment variable and save only its name:
    setx OPENAI_API_KEY "sk-your-key"
        saved to your account; new windows see it
    set "OPENAI_API_KEY=sk-your-key"
        this window only; quote the whole assignment
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        a preset; only the variable name is saved
    koder model set --preset local --model qwen3:8b
        local Ollama, no key
    set "KODER_MODEL=gpt-6.1-sol" && set "KODER_BASE_URL=https://api.openai.com/v1" && set "KODER_API_KEY=sk-…" && koder review
        environment variables, handy in CI
  Tip · koder model presets lists the available presets; koder model show prints the current setup with only the last four characters of the key.
  (whispering) CMD forgets your commands when the window closes; the colleague behind you does not. Paste keys in koder setup: only the last four show, but the stored key is plaintext.
Coach › Today the practice project uses the coach model, so this lesson is look-only. Set up a real one after you graduate.
  · You can run koder model presets right there to list them.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 3 of 30 · Configure a model: give Koder a brain ━━
  Tip · The model page now discovers current account IDs automatically. Choose Current account models to select one; refresh never switches it for you. A listing is not a tool-call test: run koder model test --tools. Automatic discovery can be disabled, or use koder model refresh manually.
Coach › Koder can't think on its own; it needs a model. The easiest way is the settings screen:
    koder setup
        pick a provider and model with the arrow keys or mouse, paste the key; it can even open the key page
Coach › Prefer commands? Put the key in an environment variable and save only its name:
    echo 'export OPENAI_API_KEY=sk-your-key' >> ~/.zshrc
        into zsh's config (macOS uses zsh); every new terminal sees it
    export OPENAI_API_KEY=sk-your-key
        this window only
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        a preset; only the variable name is saved
    koder model set --preset local --model qwen3:8b
        local Ollama, no key
    KODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review
        environment variables, handy in CI
  Tip · koder model presets lists the available presets; koder model show prints the current setup with only the last four characters of the key.
  (whispering) Careful typing keys into commands: your shell history (~/.zsh_history, ~/.bash_history) remembers better than your ex. Paste it in koder setup instead: only the last four show, and it skips shell history, but the key is stored in plaintext in local configuration. Environment-setting commands may enter history too; redact keys before sharing.
Coach › Today the practice project uses the coach model, so this lesson is look-only. Set up a real one after you graduate.
  · You can run koder model presets right there to list them.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 3 of 30 · Configure a model: give Koder a brain ━━
  Tip · The model page now discovers current account IDs automatically. Choose Current account models to select one; refresh never switches it for you. A listing is not a tool-call test: run koder model test --tools. Automatic discovery can be disabled, or use koder model refresh manually.
Coach › Koder can't think on its own; it needs a model. The easiest way is the settings screen:
    koder setup
        pick a provider and model with the arrow keys or mouse, paste the key; it can even open the key page
Coach › Prefer commands? Put the key in an environment variable and save only its name:
    echo 'export OPENAI_API_KEY=sk-your-key' >> ~/.bashrc
        into bash's config (Ubuntu's default; ~/.zshrc for zsh); every new terminal sees it
    export OPENAI_API_KEY=sk-your-key
        this window only
    koder model set --preset chatgpt --key-env OPENAI_API_KEY
        a preset; only the variable name is saved
    koder model set --preset local --model qwen3:8b
        local Ollama, no key
    KODER_MODEL=… KODER_BASE_URL=… KODER_API_KEY=… koder review
        environment variables, handy in CI
  Tip · koder model presets lists the available presets; koder model show prints the current setup with only the last four characters of the key.
  (whispering) Careful typing keys into commands: your shell history (~/.zsh_history, ~/.bash_history) remembers better than your ex. Paste it in koder setup instead: only the last four show, and it skips shell history, but the key is stored in plaintext in local configuration. Environment-setting commands may enter history too; redact keys before sharing.
Coach › Today the practice project uses the coach model, so this lesson is look-only. Set up a real one after you graduate.
  · You can run koder model presets right there to list them.
```

</details>
