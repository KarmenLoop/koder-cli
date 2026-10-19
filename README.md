# Koder

Koder is an AI assistant for your terminal. Open a project, connect a model, and ask it to read code, review a change, or work on a task. Edits show a diff before they are saved, and commands ask for approval by default.

[Website](https://karmenloop.com) · [CLI](https://karmenloop.com/en/cli.html) · [Download CLI preview](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.3) · [Updates](https://karmenloop.com/en/updates.html) · [Email](mailto:info@karmenloop.com)

CLI preview: **0.4.0-preview.3** — [download the installer assets](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.3). This is a downloadable proprietary preview, not a stable release. The legacy public source in this repository remains **0.3.1**. The GitHub install commands below discover the current published preview. Website downloads follow a separate publication channel.

[Release status and download checks](RELEASE_STATUS.md) · [Open-source credits](OPEN_SOURCE_CREDITS.md) · [Third-party notices](THIRD_PARTY_NOTICES.md)

**License for 0.4.0-preview.3:** this official Koder-owned distribution uses the [Koder End-User License Agreement](EULA.md): download, install and use for personal or internal organizational work, with free basic local use. The new distribution is proprietary, not open source. Its development source is not published here.

The existing public CLI source and already distributed versions retain their original licenses, including GPL v3 and the [limited kernel permission](LICENSE-EXCEPTION.txt) where applicable. Third-party components retain their own terms. See [license scope](LICENSE) and [distribution policy](DISTRIBUTION.md).

## What it is

Koder works in the folder you choose. You can use it for a conversation, a single task, a script, or CI. Read-only questions use `koder ask`; tasks that edit files or run commands use `koder run`.

This repository retains legacy CLI source and publishes agreements, notices and download instructions. The desktop app is a separate download, and `koder-tui` is a separate full-screen terminal interface. The runtime underneath them is KARMEN LOOP.

Connect a model provider you already use, or a local model through a service such as Ollama. This release does not include a model. An official model is planned but is not available in Settings yet.

## What you can do

- **Chat.** Type `koder` in a project and talk. `/setup`, `/about`, `/lang`, `/memory`, and `/exit` are right there.
- **One shot.** `koder run` edits and runs commands. `koder ask` only reads.
- **Plan, then do.** `--mode plan` lays the work out before it touches files. Other modes: `standard`, `code`, `minimal`, `execute`, `report`, `enhance`.
- **Review, fix, test.** `koder review` writes up the diff. `koder fix` reruns your check until it passes or hits the limit. `koder test` adds tests in the style already in the repo.
- **Memory.** Same folder, named session, still there after you quit. `--session`, `--new`, `--no-memory`. `koder memory` can show, search, add, remove, clear, or forget. Old approvals are not restored, and old tools are not run again.
- **Flows and CI.** `koder flow` runs a JSON pipeline. `koder ci init` adds a GitHub Actions workflow that reviews a pull request and answers `/koder` comments from repo members.
- **Chat apps.** Adapters for Feishu, Lark, WeCom, WeChat, DingTalk, Telegram, Slack, Discord and WhatsApp are included. Pairing controls access. Live-channel acceptance for this preview is still pending; see release status.
- **Editors.** Zed, Neovim, and Emacs talk to `koder acp`. `koder editor` prints the snippet.
- **Setup.** Arrow keys or a click. Language, model, colors, banner, chat apps, editor config. `koder learn` is 17 lessons in a practice folder, and it does not spend model money.
- **A second opinion.** `koder moa` asks other models you registered, then the current model does the work. You still approve every edit.

## Quick start

You need macOS 11 or later, Linux, WSL, or Windows 10 or 11. Windows XP, 7, and 8 will not run it. No invite code and no admin account for the CLI. The desktop beta on the website is a different installer.

If Node.js 22 or newer is already there, the installer uses it. If not, it downloads Node.js 22 from nodejs.org, checks the SHA-256, and stops if the hash is wrong. The Koder package is checked the same way.

### Install the preview

Read [Koder-EULA-1.0](EULA.md) before installing. The commands below explicitly accept that agreement. Accepting it does not grant file, computer-control, learning, or messaging permissions; configure those separately in Koder.

Windows installers are included, but native Windows installation and the reported Windows file-access fix still need device testing. Live WeChat, Feishu, WeCom, Gamma and cross-device workflows have not completed end-to-end acceptance. See [release status](RELEASE_STATUS.md) before relying on these integrations.

Mac, Linux, WSL:

```bash
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
```

Windows PowerShell:

```powershell
$env:KODER_EULA_ACCEPT = "1"
irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex
```

Windows Command Prompt:

```bat
set KODER_EULA_ACCEPT=1
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.ps1 | iex"
```

The scripts: [koder-cli.sh](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/koder-cli.sh) · [koder-cli.ps1](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/koder-cli.ps1) · [koder-cli.cmd](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/koder-cli.cmd)

Mac and Linux land in `~/.koder-cli`, with the command in `~/.local/bin`. Windows lands in `%LOCALAPPDATA%\koder-cli`. If the shell says `koder` is missing, open a new terminal. The installer adds `~/.local/bin` to your PATH, and the window you already have does not see that yet.

```bash
koder version
koder about
```

`koder version` prints the version, the site, the updates page, and the download page.

![Install finished](docs/screenshots/cli-install-en-dark.jpg)

The bootstrap commands resolve the published GitHub channel, verify the release installer SHA-256, then install its pinned package version and digest. The current channel selects **0.4.0-preview.3**. The direct scripts linked above remain fixed to that release. [SHA256SUMS](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/SHA256SUMS) and [the package manifest](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/koder-cli-latest.json) are included. The automatic GitHub source archives for this preview contain distribution documentation, not the proprietary implementation. Legacy 0.3.1 source remains available on `main` under its original terms.

### Update from GitHub

From **0.4.0-preview.3** onward:

```bash
koder update --check
koder update
koder version
```

`--check` reports the published version without installing. `koder update` compares versions, labels previews, verifies the downloaded installer and package, and keeps your model settings and memory. It does not reinstall the same version or downgrade. A failed download or checksum stops before the existing installation is replaced. An explicit `KODER_INSTALL_BASE` mirror is still respected.

**If you have 0.3.0, 0.3.1, preview.1 or preview.2, run the install command above once to move to the new updater.** The old updater cannot gain this discovery fix until it is upgraded. You do not need to uninstall or remove your settings. Later upgrades reuse agreement acceptance only when the agreement text is unchanged; a changed agreement requires your explicit acceptance. Updates start when you run the command, not in a hidden background job.

### Connect a model

The first `koder` opens setup. The Model row says it is not set. Arrow keys, Tab, or a click. Enter selects. Esc goes back. Every change saves immediately.

![Setup the first time](docs/screenshots/cli-start-en-dark.jpg)

Pick a provider, then a model, then a key. Prefer an environment variable. The file stores the name, not the key. A pasted key is stored in plain text on this computer, mode 600, and the screen shows only the last four characters. Do not paste a key into the variable-name field. A name is letters, digits, and underscores, and it does not start with a digit.

DeepSeek, this terminal:

```bash
export DEEPSEEK_API_KEY="your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

Windows PowerShell, this window:

```powershell
$env:DEEPSEEK_API_KEY = "your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

Keep it for later terminals by adding the `export` line to `~/.zshrc` or `~/.bashrc`, or with `setx` on Windows. `setx` does not affect the current window. Open a new one.

Other presets work the same way. `koder model presets` lists them.

```bash
koder model set --preset local --model qwen3:8b
koder model set --base-url https://api.example.com/v1 --model your-model --protocol openai --key-env YOUR_API_KEY
```

`--protocol` is `openai` or `anthropic`. Local models need Ollama or LM Studio already running. They do not need a key.

MiniMax-M3, when you do not set a limit, uses a 1,048,576 context window and 32,768 output tokens. A number you set yourself wins. Unknown custom models stay conservative until you fill in the provider's real limits.

```bash
koder model context --context-window 1048576 --max-output 32768
koder doctor
koder ask "Reply with the single word ready"
```

`koder doctor` checks Node, Git, the model, colors, and startup. If the model line fails, the usual cause is an empty variable in this window, a wrong preset id, or a key pasted into the name field. Exit code 0 means the ask finished. 1 means it failed or you cancelled. 2 means it never started.

In CI you can skip the file and set `KODER_MODEL`, `KODER_BASE_URL`, and `KODER_API_KEY`.

If you change the model or the window in another terminal, the next turn picks that up and keeps the local history.

### Do the work

```bash
cd your-project
koder
```

Type the task and press Enter. Project tools start inside this folder. Broader computer or home-directory access requires the permissions you choose in setup and any required operating-system authorization.

Or skip the session:

```bash
koder run "npm test failed. Fix total() in cart.mjs"
```

A file edit shows the diff first. Red is gone, green is new. Type `y` to write it. Any other key leaves it.

![Confirming an edit](docs/screenshots/cli-diff-en-dark.jpg)

Commands wait the same way. In a script, `--yes` accepts edits and commands. It does not answer questions and it does not type passwords. Without `--yes`, a non-interactive run rejects them.

```bash
koder run --yes --json "Add install notes to the README"
koder ask "Which file starts the login flow?"
koder review --base origin/main --format markdown --out review.md
koder fix --check "npm test"
koder test src/price.js --check "npm test"
```

`review` reads the diff, the layout, rule files such as `AGENTS.md`, and recent commits. `fix` defaults to 3 attempts.

![Help for review](docs/screenshots/cli-review-en-dark.jpg)

A long tool result is trimmed on the way to the model. The full text stays on disk. The current request is not cut to make room. If the raw prompt itself is bigger than the model's window, Koder says so. It does not pretend the window is infinite.

Named sessions:

```bash
koder --session feature-a
koder --new
koder --no-memory run "a one-off"
koder memory show
```

Inside chat, `/new` starts a fresh session. `/connect weixin` starts WeChat binding without asking the model to do it. Feishu and WeCom use the same slash command with their own names.

### Chat apps and editors

Skip this if the terminal is enough.

Editors. The model from above has to work first.

```bash
koder editor zed
koder editor nvim
koder editor emacs
```

Paste the snippet into the file it names. Zed: `~/.config/zed/settings.json`, then pick Koder in the Agent panel. Neovim needs CodeCompanion. Emacs needs `agent-shell` from MELPA. On Windows the command in the snippet is `koder.cmd`.

Chat apps. Each one is an account you create on that company's site. Koder checks the credentials before it saves them. WeChat is the exception: a QR code, no key.

```bash
koder gateway setup telegram
koder gateway setup feishu
koder gateway setup weixin
koder gateway start --background
koder gateway pair K7Q2MX
```

Direct messages use pairing until you change that. Groups are off until you opt in, and the bot has to be mentioned. Edits still ask in the chat. Reply `yes` to allow one. Feishu, Lark, WeCom, DingTalk, Slack, and Discord do not need a public URL. WhatsApp does: expose the local port and set the callback to `https://…/webhook`.

`koder gateway status` shows what is configured. `koder gateway stop` shuts the background process down.

### The full-screen TUI

Separate install. It reads the model you just saved.

```bash
curl -fsSL https://karmenloop.com/install/koder-tui.sh | bash
```

```powershell
irm https://karmenloop.com/install/koder-tui.ps1 | iex
```

Scripts: [koder-tui.sh](https://karmenloop.com/install/koder-tui.sh) · [koder-tui.ps1](https://karmenloop.com/install/koder-tui.ps1) · [koder-tui.cmd](https://karmenloop.com/install/koder-tui.cmd)

```bash
cd your-project
koder-tui
```

Enter sends. Ctrl+J is a new line. `/` opens the command list. Esc stops the turn. Edits you already accepted stay written. `y` accepts a diff, `n` or Esc rejects it.

![Koder TUI](docs/screenshots/tui-home-en-dark.jpg)

![Confirming an edit in the TUI](docs/screenshots/tui-diff-en-dark.jpg)

Those two edit shots were taken against a local scripted endpoint, not a live model. The chrome is a real Koder CLI 0.2.0 and Koder TUI 0.1.0 screen.

### You are done when

- `koder version` prints a version and the updates page.
- The Model row in `koder setup` no longer says it is not set.
- `koder doctor` is happy with the model.
- `koder ask` comes back with an answer.
- `koder run` shows a diff and waits for `y`.

## In the product

| | |
| --- | --- |
| `koder help` | Every command. `koder help review` for one of them. |
| `koder learn` | 17 lessons. `--print` for text. `--os powershell`, `cmd`, `mac`, or `linux`. |
| `koder setup` | The menu again. |
| `koder update --check` | Check the published GitHub channel without installing. |
| `koder update` | Verify and install a newer GitHub CLI release. |
| `koder lang en` | English. `koder lang zh` for Chinese. |
| [karmenloop.com](https://karmenloop.com) | Product, download, updates. |
| [Updates](https://karmenloop.com/en/updates.html) | What changed. |

`koder help` inside the installed CLI matches that build. Preview validation and known limits are listed in [release status](RELEASE_STATUS.md).

## License

Future Koder-owned official builds that expressly adopt **Koder-EULA-1.0** are proprietary software, available for end users to download, install and use under the [end-user agreement](EULA.md). Personal and internal business use, internal backups, official updates, and supported configuration, skills, plugins and MCP integrations are permitted. Redistribution, resale, repackaging and derivative development of the proprietary implementation require separate permission, subject to applicable law and third-party license rights. You may share official download links. Your own files, code and work products are not relicensed by the agreement.

The CLI source already published here through [54e17fcf](https://github.com/KarmenLoop/koder-cli/commit/54e17fcf484638f6cf22a48b52a0533c82816191), including version 0.3.1, remains under [GNU GPL v3](licenses/legacy-cli/GPL-3.0.txt) with the [limited kernel linking permission](LICENSE-EXCEPTION.txt). Already distributed packages retain their applicable original terms. The new agreement does not withdraw those rights, make old public source confidential, or retroactively change their terms.

The KARMEN LOOP kernel is not published in this repository and retains its applicable proprietary terms. Third-party components keep their own licenses, notices and any source obligations; see [third-party notices](THIRD_PARTY_NOTICES.md) and [credits](OPEN_SOURCE_CREDITS.md). Readable files in an installer are not a grant to develop or redistribute proprietary code.

[License scope](LICENSE) · [End-user agreement / 使用许可协议](EULA.md) · [Distribution policy](DISTRIBUTION.md) · [Release status](RELEASE_STATUS.md)

## Contact

[karmenloop.com](https://karmenloop.com) · [info@karmenloop.com](mailto:info@karmenloop.com) · [GitHub](https://github.com/KarmenLoop/koder-cli)
