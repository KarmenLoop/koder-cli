# Koder CLI

Koder works on your own computer. The CLI is Koder in the terminal: you name a task, and it reads the current project, proposes edits, and runs commands. Every file change and every command stops for your confirmation first.

Website: <https://karmenloop.com>  
Product page: <https://karmenloop.com/en/cli.html>  
Updates: <https://karmenloop.com/en/updates.html>  
Download: <https://karmenloop.com/en/download.html>  
Email: <info@karmenloop.com>

Koder also ships as a desktop app and as a full-screen TUI. The desktop app is on the download page. The TUI command is `koder-tui`. It shares the CLI's model and language settings. This repository is the CLI source.

The kernel is KARMEN LOOP. It is not public, it is not in this repository, and it is not covered by the licence on this source. Copyright © KARMEN / Koder. All rights reserved. The kernel is not offered for further development. The official installer runs this kernel; downloading the installer does not give you the kernel source.

## What it does

- Chat: type `koder` and give a task in the project directory.
- One-shot tasks: `koder run` edits files and runs commands; `koder ask` is read-only.
- Quality: `koder review` reviews changes, `koder fix` repairs until the check passes, `koder test` adds tests in the style of the tests already in the project.
- Orchestration: `koder flow` runs a JSON pipeline; `koder ci init` writes a GitHub Actions workflow that reviews and comments on pull requests.
- Connections: Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, and WhatsApp. Editors connect through `koder acp` and `koder editor`.
- Setup: `koder setup` chooses language, model, colors, the opening screen, the engine, and chat apps with the arrow keys or the mouse.
- Tutorial: `koder learn` is 17 lessons. Commands are written separately for PowerShell, CMD, macOS, and Linux. Progress is saved.

You connect your own model and pay that provider. This version of Koder does not include a model.

## Screens

The first time you type `koder`, setup opens. Until a model is set, that row says it is not configured. Arrow keys or the mouse choose the next item.

![Setup menu the first time Koder opens](docs/screenshots/cli-start-en-dark.jpg)

When `koder run` wants to edit a file, it shows the diff first. Red lines are removed. Green lines are added. Type y to write the file. Any other key leaves it unchanged.

![Confirming an edit](docs/screenshots/cli-diff-en-dark.jpg)

`koder help review` lists the usage, options, and examples for that command. Every other command has the same page: `koder help <command>`.

![Help for review](docs/screenshots/cli-review-en-dark.jpg)

`koder-tui` fills the terminal. The top bar shows the version, workspace, model, and mode. The middle is the conversation. The bottom is the input.

![Koder TUI after it opens](docs/screenshots/tui-home-en-dark.jpg)

In the TUI, an edit opens a diff window. y accepts it. n or Esc rejects it.

![Confirming an edit in the TUI](docs/screenshots/tui-diff-en-dark.jpg)

The two edit screens were captured against a local scripted test endpoint, not a connected model provider. The interface itself is a real Koder CLI 0.2.0 and Koder TUI 0.1.0 screen.

## Install

Copy the line for your system, paste it into a terminal, and press Enter. No invite code and no administrator account. When it finishes, type `koder`.

The scripts:

- <https://karmenloop.com/install/koder-cli.sh>
- <https://karmenloop.com/install/koder-cli.ps1>
- <https://karmenloop.com/install/koder-cli.cmd>

macOS 11 or later, Linux, and WSL:

```bash
curl -fsSL https://karmenloop.com/install/koder-cli.sh | bash
```

Windows 10 / 11, PowerShell:

```powershell
irm https://karmenloop.com/install/koder-cli.ps1 | iex
```

Windows 10 / 11, Command Prompt:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "irm https://karmenloop.com/install/koder-cli.ps1 | iex"
```

On Mac and Linux the install lives in `~/.koder-cli` and the command is placed in `~/.local/bin`. On Windows it lives in `%LOCALAPPDATA%\koder-cli`. If Node.js 22 or later is already installed, that copy is used. Otherwise the installer downloads Node.js 22 from nodejs.org and checks the SHA-256 before unpacking. The Koder package is checked the same way and the install stops if the hash does not match.

Windows XP, 7, and 8 are not supported. Node.js 22 requires Windows 10.

After a successful install:

![Install finished](docs/screenshots/cli-install-en-dark.jpg)

When it is already installed, show the version and the official site, or update:

```bash
koder version
koder about
koder update
```

The TUI is a separate install. After it finishes, type `koder-tui`.

```bash
curl -fsSL https://karmenloop.com/install/koder-tui.sh | bash
```

```powershell
irm https://karmenloop.com/install/koder-tui.ps1 | iex
```

Scripts: <https://karmenloop.com/install/koder-tui.sh> · <https://karmenloop.com/install/koder-tui.ps1> · <https://karmenloop.com/install/koder-tui.cmd>

## Guide

### 1. Open setup and connect a model

Setup opens at the end of install. Arrow keys or the mouse choose the language, model, and colors. Each change is saved immediately.

```bash
koder setup
koder lang en
```

DeepSeek is the example. Put the key in an environment variable, then tell Koder to read that variable. The config file stores the variable name.

macOS and Linux:

```bash
export DEEPSEEK_API_KEY="your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

Windows PowerShell:

```powershell
$env:DEEPSEEK_API_KEY = "your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

Local Ollama:

```bash
koder model set --preset local --model qwen3:8b
```

`koder model presets` lists every preset. The config is `~/.koder-cli/provider.json`, mode 600. With `--key-env` the file stores the variable name. A pasted key is stored in plain text. Then check:

```bash
koder doctor
```

### 2. Enter the project and start

```bash
cd your-project
koder
```

Type the task and press Enter. Koder reads and writes only inside this folder.

In the session: `/help` lists commands, `/setup` opens settings, `/about` shows the website and the updates page, `/lang en` switches to English, `/exit` or Ctrl+D quits.

### 3. Confirm an edit

You can also give the task in one line:

```bash
koder run "npm test failed. Fix total() in cart.mjs"
```

File edits and commands both wait for you. Type y to accept. Any other key rejects. A rejected edit is not written.

In a script, `--yes` accepts edits and commands. Without it, every edit and command is rejected. `--yes` does not answer questions for you and does not type passwords.

```bash
koder run --yes --json "Add install instructions to the README"
```

`--json` prints one event per line. Exit code 0 means finished, 1 means cancelled or the task failed, 2 means it could not start, for example because no model is configured or a flag is wrong.

### 4. Review, fix, and add tests

```bash
koder ask "Which file starts the login flow?"
npm test 2>&1 | koder run "Fix the tests from this failure output"
koder review --base origin/main --format markdown --out review.md
koder fix --check "npm test"
koder test src/price.js --check "npm test"
```

`review` reads the diff, the repository layout, rule files such as `AGENTS.md`, and recent commits, then reports each issue with a file, a line, a severity, and a suggested change. `fix` runs the check, hands the failure to Koder, and checks again until it passes or the attempt limit is used. The default limit is 3.

### 5. Tutorial, flows, and CI

```bash
koder learn
koder learn 3
koder learn --print --os powershell
koder flow init pr-gate
koder ci init
```

`koder learn` teaches in the terminal and remembers where you stopped. `--print` prints the text. `--os` is `powershell`, `cmd`, `mac`, or `linux`. Lesson 16 is install and update.

`koder ci init` writes `.github/workflows/koder.yml`. A pull request is reviewed and commented on when it opens or updates. A comment of `/koder review` or `/koder fix` runs that action. Instructions that change the repository are accepted only from repository members.

### 6. Chat apps and editors

```bash
koder gateway setup feishu
koder gateway start --background
koder editor zed
koder acp
```

`koder editor` takes `zed`, `nvim`, or `emacs` and prints the config for that editor.

### 7. TUI

```bash
cd your-project
koder-tui
```

Type a task, press Enter to send, and Ctrl+J for a new line. Type `/` for commands: `/help`, `/learn`, `/lang`, `/mode`, `/yes`, `/model`, `/sidebar`, `/about`, `/exit`. Esc stops the current turn. Edits you already accepted stay written.

The TUI reads the model saved by `koder setup`. If none is set, finish step 1 first.

## Common flags

| Flag | Effect |
| --- | --- |
| `-w`, `--workspace` | Workspace folder. Default: current directory |
| `-y`, `--yes` | Accept file edits and commands |
| `--json` | One JSON event per line |
| `--mode` | standard, code, minimal, plan, execute, report, enhance |
| `--lang` | Chinese or English for this run |
| `--no-color` | Turn color off |

Full help: `koder help`, or `koder help <command>`.

## Licence

The Koder CLI source in this repository is under the GNU General Public License v3.0. The text is `LICENSE`. Third-party components are listed in `THIRD_PARTY_NOTICES.md`.

The KARMEN LOOP kernel is not in this repository, is not public, and is not under that licence. Copyright © KARMEN / Koder. All rights reserved. The kernel is not offered for further development.

Website <https://karmenloop.com> · Email <info@karmenloop.com>
