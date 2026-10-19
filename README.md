# Koder

Koder is an AI assistant for your terminal. Open a project, connect a model, and ask it to read code, review a change, or work on a task. Edits show a diff before they are saved, and commands ask for approval by default.

[Website](https://karmenloop.com) · [CLI](https://karmenloop.com/en/cli.html) · [Download](https://karmenloop.com/en/download.html) · [Updates](https://karmenloop.com/en/updates.html) · [Email](mailto:info@karmenloop.com)

Source in this repo: **0.3.1**. Published installer checked on 2026-10-19: **0.3.0**.

[Release status and download checks](RELEASE_STATUS.md) · [Open-source credits](OPEN_SOURCE_CREDITS.md) · [Third-party notices](THIRD_PARTY_NOTICES.md)

The CLI source here is under the GNU General Public License v3.0, with the limited [kernel linking permission](LICENSE-EXCEPTION.txt). The KARMEN LOOP kernel is not in this repo, and it is not under that license. See [License](#license).

## What it is

Koder works in the folder you choose. You can use it for a conversation, a single task, a script, or CI. Read-only questions use `koder ask`; tasks that edit files or run commands use `koder run`.

This repository contains the CLI. The desktop app is a separate download, and `koder-tui` is a separate full-screen terminal interface. The runtime underneath them is KARMEN LOOP.

Connect a model provider you already use, or a local model through a service such as Ollama. This release does not include a model. An official model is planned but is not available in Settings yet.

## What you can do

- **Chat.** Type `koder` in a project and talk. `/setup`, `/about`, `/lang`, `/memory`, and `/exit` are right there.
- **One shot.** `koder run` edits and runs commands. `koder ask` only reads.
- **Plan, then do.** `--mode plan` lays the work out before it touches files. Other modes: `standard`, `code`, `minimal`, `execute`, `report`, `enhance`.
- **Review, fix, test.** `koder review` writes up the diff. `koder fix` reruns your check until it passes or hits the limit. `koder test` adds tests in the style already in the repo.
- **Memory.** Same folder, named session, still there after you quit. `--session`, `--new`, `--no-memory`. `koder memory` can show, search, add, remove, clear, or forget. Old approvals are not restored, and old tools are not run again.
- **Flows and CI.** `koder flow` runs a JSON pipeline. `koder ci init` adds a GitHub Actions workflow that reviews a pull request and answers `/koder` comments from repo members.
- **Chat apps.** Feishu, Lark, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, WhatsApp. Strangers get a pairing code. You approve it on your machine.
- **Editors.** Zed, Neovim, and Emacs talk to `koder acp`. `koder editor` prints the snippet.
- **Setup.** Arrow keys or a click. Language, model, colors, banner, chat apps, editor config. `koder learn` is 17 lessons in a practice folder, and it does not spend model money.
- **A second opinion.** `koder moa` asks other models you registered, then the current model does the work. You still approve every edit.

## Quick start

You need macOS 11 or later, Linux, WSL, or Windows 10 or 11. Windows XP, 7, and 8 will not run it. No invite code and no admin account for the CLI. The desktop beta on the website is a different installer.

If Node.js 22 or newer is already there, the installer uses it. If not, it downloads Node.js 22 from nodejs.org, checks the SHA-256, and stops if the hash is wrong. The Koder package is checked the same way.

### Install

Mac, Linux, WSL:

```bash
curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash
```

Windows PowerShell:

```powershell
irm https://karmenloop.com/install/koder-cli.ps1 | iex
```

Windows Command Prompt:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://karmenloop.com/install/koder-cli.ps1 | iex"
```

The scripts: [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh) · [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1) · [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd)

Mac and Linux land in `~/.koder-cli`, with the command in `~/.local/bin`. Windows lands in `%LOCALAPPDATA%\koder-cli`. If the shell says `koder` is missing, open a new terminal. The installer adds `~/.local/bin` to your PATH, and the window you already have does not see that yet.

```bash
koder version
koder about
```

`koder version` prints the version, the site, the updates page, and the download page.

![Install finished](docs/screenshots/cli-install-en-dark.jpg)

The scripts download the package currently published at `karmenloop.com/install`. This repository is the 0.3.1 source. Those two stay in step when the site is updated. Until then, the installer can still be an older package than this tree.

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

Type the task and press Enter. Koder reads and writes only inside this folder.

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
| `koder update` | Update the installed CLI. |
| `koder lang en` | English. `koder lang zh` for Chinese. |
| [karmenloop.com](https://karmenloop.com) | Product, download, updates. |
| [Updates](https://karmenloop.com/en/updates.html) | What changed. |

`koder help` inside the installed CLI matches that build. This README matches the 0.3.1 source.

## License

The Koder CLI source in this repository is under the GNU General Public License v3.0. The text is [LICENSE](LICENSE); the granting copyright holders adopted the limited [additional permission](LICENSE-EXCEPTION.txt) on 2026-10-19. Third-party components that ship in this tree are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

The KARMEN LOOP kernel is not in this repository. It is not public, and it is not under the GPL. Copyright © KARMEN / Koder. All rights reserved. The kernel is not offered for further development. The installer runs it. Installed kernel modules may contain readable JavaScript under the bundled terms. A proprietary licence does not encrypt those files. The [additional permission](LICENSE-EXCEPTION.txt) covers only the CLI portions its granting holders have authority to license. Kernel and third-party terms still apply; see [credits and outstanding corrections](OPEN_SOURCE_CREDITS.md#scope-and-outstanding-corrections).

## Contact

[karmenloop.com](https://karmenloop.com) · [info@karmenloop.com](mailto:info@karmenloop.com) · [GitHub](https://github.com/KarmenLoop/koder-cli)
