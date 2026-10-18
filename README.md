# Koder CLI

KARMEN / Koder is our product. We wrote KARMEN and Koder ourselves. The kernel is called KARMEN LOOP. On your computer it works in a loop: perceive, decide, act. Koder works in the folder you name. KARMEN BOT is the personal assistant in the same family. This page is the terminal product: install it, set a model, and use it. The desktop app is a separate installer on the website.

Website: <https://karmenloop.com>  
Product page: <https://karmenloop.com/en/cli.html>  
Updates: <https://karmenloop.com/en/updates.html>  
Download: <https://karmenloop.com/en/download.html>  
Email: <info@karmenloop.com>  
GitHub: <https://github.com/KarmenLoop>

This version does not include a model. You connect a provider you already have, or a local model such as Ollama, and you pay that provider. An official model will be published later. Until then, Settings has no model of ours.

The kernel is not public and it is not in this repository. The installer runs it. Downloading the installer does not give you the kernel source. Copyright © KARMEN / Koder. All rights reserved. The kernel is not offered for further development. The CLI source in this repository is under the GNU General Public License v3.0. See [Licence](#licence).

## What you are installing

| Piece | Command | What it is |
| --- | --- | --- |
| CLI | `koder` | Terminal agent. Reads the current project, proposes edits, runs commands. Every file change and every command waits for you. |
| TUI | `koder-tui` | Full-screen terminal. Separate install. Shares the CLI's model and language. |
| Desktop | website download page | Separate installer. Not installed by the commands below. |

Chat apps and editors are optional. The CLI is usable as soon as a model answers `koder doctor` and a small task. Connect Feishu, WeCom, WeChat, DingTalk, Telegram, Slack, Discord, WhatsApp, Zed, Neovim, or Emacs only if you want them.

## Hand-holding tutorial

Do the steps in order. Stop at the end of step 6 if you only want the terminal. Steps 7 and 8 are the third-party tools.

### 1. Check the computer

You need one of these:

- macOS 11 or later
- Linux or WSL
- Windows 10 or Windows 11

Windows XP, 7, and 8 cannot install it. Node.js 22 requires Windows 10.

You do not need an invite code or an administrator account. If Node.js 22 or later is already installed, the installer uses it. Otherwise it downloads Node.js 22 from nodejs.org, checks the SHA-256, and unpacks it. The Koder package is checked the same way. A mismatch stops the install.

Open a normal terminal:

- macOS: Terminal, or the terminal inside your editor
- Linux: your usual terminal
- Windows: PowerShell, or Command Prompt. Windows Terminal is fine. The classic console is fine.

### 2. Install

Copy one line, paste it, and press Enter.

The scripts themselves:

- <https://karmenloop.com/install/koder-cli.sh>
- <https://karmenloop.com/install/koder-cli.ps1>
- <https://karmenloop.com/install/koder-cli.cmd>

macOS, Linux, and WSL:

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

Where it lands:

- Mac and Linux: files in `~/.koder-cli`, command in `~/.local/bin`
- Windows: `%LOCALAPPDATA%\koder-cli`

If `~/.local/bin` is not already on `PATH`, the installer adds it to `~/.zshrc` and `~/.bashrc` and tells you to open a new terminal. Do that, then type:

```bash
koder version
```

You should see the version on the first line, then the official site and the updates page. `koder about` prints the same introduction you can read on the website.

If the shell says `koder` is not found, the current window was opened before `PATH` changed. Close it and open a new one. Do not reinstall yet.

A successful install looks like this:

![Install finished](docs/screenshots/cli-install-en-dark.jpg)

The installer opens setup when the terminal can show it. If it does, stay in that screen and continue at step 3. If it only prints a line telling you to run setup, type:

```bash
koder setup
```

Later updates:

```bash
koder update
```

### 3. Walk through setup

`koder setup` is a full-screen menu. Arrow keys or Tab move. Enter selects. Esc goes back. Digits jump. Type to filter a long list. If the terminal reports a mouse, a click selects and the wheel scrolls. Every change is saved immediately.

The menu rows are: Language, Model, Colours, Banner style, Banner animation, Engine, Chat apps, Editors, Tutorial, Check-up, Done.

![Setup menu the first time Koder opens](docs/screenshots/cli-start-en-dark.jpg)

Until a model is saved, the Model row says it is not set. Start there after the language.

**Language.** Enter on Language. Choose English or 中文. It applies at once.

The same choice from a shell, if you are not inside the menu:

```bash
koder lang en
koder lang zh
```

**Colours.** Enter on Colours. `auto` follows the terminal background and uses dark when it cannot tell. `dark` is the website dark palette (stage `#12141c`, text `#ededeb`, accent `#7ca6ff`). `light` is the website light palette (stage `#e4e1d8`, text `#1d1c1a`, accent `#2455d3`). On a white terminal, pick light.

```bash
koder theme light
koder theme auto
```

**Banner.** Banner style `auto` uses plain characters on the classic Windows console and the colour refractor elsewhere. Banner animation is the short spin at startup, about 0.2 seconds. Leave both on `auto` / on unless the banner breaks.

**Engine.** Leave it on the built-in Koder kernel. That is the default and it needs nothing else.

**Done.** Do not press Done until the Model row no longer says "not set". Chat apps and Editors can wait until steps 7 and 8.

### 4. Configure a model

Koder does not ship a model. Pick a provider you can actually call, then a model name, then a key. The file is `~/.koder-cli/provider.json` (on Windows, under `%LOCALAPPDATA%\koder-cli`), mode 600.

Prefer an environment variable. The file then stores the variable name, not the key. A key you paste is stored in plain text on this computer. The screen shows only the last four characters. Do not paste a key into the variable-name field. A variable name is letters, digits, and underscores, and it does not start with a digit.

#### 4a. Inside the setup menu

1. Enter on Model.
2. Filter by typing, for example `deep`, and pick a provider. The list is the built-in presets. `koder model presets` prints the same list: id, model name, protocol, and display name. There are 31 presets.
3. Pick a model. The recommended one is marked. Or choose "Type another model…" and enter the name from that provider's docs.
4. Choose how the key is stored:
   - Paste the key. On macOS paste with ⌘V. On Linux paste with Ctrl+Shift+V or the middle button. On Windows Terminal paste with Ctrl+V. In the classic Windows console, right-click.
   - Or read it from an environment variable. The menu suggests a name and shows the exact `export`, `setx`, or `$env:` line for your shell.
   - Or open the provider's key page in a browser, create a key there, come back, and choose Paste the key.
5. Wait for "Model saved". It names the provider and the model, and either the variable name or the last four characters of a pasted key.

Local models: pick the local preset. Start Ollama or LM Studio first, then enter the model it is serving, for example `qwen3:8b`. A local model does not need a key.

#### 4b. From the shell, DeepSeek

Create the key in the DeepSeek console, then put it in the environment. Replace `your-key` with the real key. Do not commit that value.

macOS and Linux, this terminal only:

```bash
export DEEPSEEK_API_KEY="your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

To keep it for later terminals, add the `export` line to `~/.zshrc` (macOS default) or `~/.bashrc` (many Linux shells), then open a new terminal and run the `koder model set` line again.

Windows PowerShell, this window only:

```powershell
$env:DEEPSEEK_API_KEY = "your-key"
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

Windows, saved for new windows (`setx` does not affect the current window; open a new one afterwards):

```bat
setx DEEPSEEK_API_KEY "your-key"
```

Then, in that new window:

```bat
koder model set --preset deepseek --key-env DEEPSEEK_API_KEY
```

#### 4c. Other presets and a custom endpoint

Same pattern. The preset id is the first column of `koder model presets`. Examples that exist: `kimi`, `qwen`, `claude`, `chatgpt`, `local`.

```bash
koder model presets
koder model set --preset kimi --key-env MOONSHOT_API_KEY
koder model set --preset local --model qwen3:8b
```

A provider that is not in the list:

```bash
koder model set --base-url https://api.example.com/v1 --model your-model --protocol openai --key-env YOUR_API_KEY
```

`--protocol` is `openai` or `anthropic`. The base URL must start with `http://` or `https://`.

In CI, you can skip the file and set `KODER_MODEL`, `KODER_BASE_URL`, and `KODER_API_KEY` in the job environment.

More than one saved model:

```bash
koder model add kimi --preset kimi --key-env MOONSHOT_API_KEY
koder model list
koder model use kimi
koder model show
```

`show` prints the current setup and only the last four characters of a stored key.

#### 4d. Prove the model is configured

```bash
koder doctor
```

Doctor checks Node.js, Git, the model, colours, and startup time. If the model line fails, the usual causes are:

- The environment variable is empty in this window. Open a new terminal after `setx` or after editing `.zshrc` / `.bashrc`.
- The preset id is wrong. Run `koder model presets` and copy the id.
- The key was pasted into the variable-name field. Run `koder model set` again with a real variable name, or paste the key as the key.
- The provider rejected the key. Create a new key on that provider's site and set the variable again.

A read-only check that does not edit files and does not run commands:

```bash
koder ask "Reply with the single word ready"
```

When that returns, the model is usable. Exit code 0 means finished. Exit code 1 means the task failed or was cancelled. Exit code 2 means it could not start: no model, or a bad flag.

### 5. Use it on a real project

```bash
cd your-project
koder
```

Type the task and press Enter. Koder reads and writes only inside this folder.

Inside the session:

| Type | Effect |
| --- | --- |
| `/help` | Command list |
| `/setup` | The same settings screen |
| `/about` | Website and updates page |
| `/lang en` | English for this session |
| `/exit` or Ctrl+D | Quit |

One-shot, without staying in the chat:

```bash
koder run "npm test failed. Fix total() in cart.mjs"
```

When it wants to edit a file, it prints a diff first. Red lines are removed. Green lines are added. Type `y` and Enter to write the file. Any other key leaves the file unchanged.

![Confirming an edit](docs/screenshots/cli-diff-en-dark.jpg)

Commands wait the same way. A rejected edit is not written.

In a script, `--yes` accepts edits and commands. Without `--yes`, a non-interactive run rejects them. `--yes` does not answer questions for you and does not type passwords.

```bash
koder run --yes --json "Add install instructions to the README"
```

`--json` prints one event per line.

Other everyday commands, after the model works:

```bash
koder ask "Which file starts the login flow?"
npm test 2>&1 | koder run "Fix the tests from this failure output"
koder review --base origin/main --format markdown --out review.md
koder fix --check "npm test"
koder test src/price.js --check "npm test"
koder help review
```

`review` reads the diff, the repository layout, rule files such as `AGENTS.md`, and recent commits, then reports each issue with a file, a line, a severity, and a suggested change. `fix` runs the check, hands the failure to Koder, and checks again until it passes or the attempt limit is used. The default limit is 3.

![Help for review](docs/screenshots/cli-review-en-dark.jpg)

Global flags:

| Flag | Effect |
| --- | --- |
| `-w`, `--workspace` | Workspace folder. Default: current directory |
| `-y`, `--yes` | Accept file edits and commands |
| `--json` | One JSON event per line |
| `--mode` | `standard`, `code`, `minimal`, `plan`, `execute`, `report`, `enhance` |
| `--lang` | Chinese or English for this run |
| `--no-color` | Turn colour off |

Full help: `koder help`, or `koder help <command>`.

At this point the CLI is fully usable. Steps 6 through 8 are optional.

### 6. Optional: the full-screen TUI

Install it separately, then open a new terminal if `PATH` was just changed.

```bash
curl -fsSL https://karmenloop.com/install/koder-tui.sh | bash
```

```powershell
irm https://karmenloop.com/install/koder-tui.ps1 | iex
```

Scripts: <https://karmenloop.com/install/koder-tui.sh> · <https://karmenloop.com/install/koder-tui.ps1> · <https://karmenloop.com/install/koder-tui.cmd>

```bash
cd your-project
koder-tui
```

The TUI reads the model you saved in step 4. If the model is missing, finish step 4 first. The top bar shows version, workspace, model, and mode. Type a task, press Enter to send, and Ctrl+J for a new line. Type `/` for `/help`, `/learn`, `/lang`, `/mode`, `/yes`, `/model`, `/sidebar`, `/about`, `/exit`. Esc stops the current turn. Edits you already accepted stay written.

![Koder TUI after it opens](docs/screenshots/tui-home-en-dark.jpg)

An edit opens a diff window. `y` accepts it. `n` or Esc rejects it.

![Confirming an edit in the TUI](docs/screenshots/tui-diff-en-dark.jpg)

The two edit screenshots were captured against a local scripted test endpoint, not a connected model provider. The interface itself is a real Koder CLI 0.2.0 and Koder TUI 0.1.0 screen.

### 7. Optional: editors

You need the model from step 4 first. The editor starts `koder acp` and shows diffs and approvals inside the editor. Koder prints the snippet. You paste it into the editor's own settings file.

From the setup menu, open Editors, pick Zed, Neovim, or Emacs, and choose Copy to clipboard. On Linux the clipboard needs `wl-copy`, `xclip`, or `xsel`. If copy fails, print the snippet instead:

```bash
koder editor zed
koder editor nvim
koder editor emacs
```

On Windows the command in the snippet is `koder.cmd`. To print the Windows paths from another machine:

```bash
koder editor zed --os powershell
```

**Zed.** Paste into `~/.config/zed/settings.json` (Windows: `%APPDATA%\Zed\settings.json`). The snippet adds an `agent_servers` entry named Koder that runs `koder acp`. In Zed's Agent panel, start a thread and pick Koder.

**Neovim.** This needs CodeCompanion.nvim. Paste into `~/.config/nvim/lua/plugins/codecompanion.lua` (Windows: `%LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua`). Then `:CodeCompanionChat` uses Koder.

**Emacs.** This needs `agent-shell` from MELPA. Paste into `~/.emacs.d/init.el`. Run `M-x agent-shell` and pick Koder.

### 8. Optional: chat apps

Same model as step 4. Each app is one platform account that you create on that company's site. Koder stores the credentials under the Koder home directory and checks them online before saving. WeChat is the exception: it shows a QR code and does not ask for a key.

Strangers in direct messages receive a pairing code. They cannot use the bot until you approve it on this computer. Group chats are off until you change the policy. In a group the bot must be mentioned. File edits and commands are asked again in the chat. Reply `yes` to allow one.

From the setup menu, open Chat apps, pick a platform, and fill the prompts. Or use the commands below.

List and status:

```bash
koder gateway list
koder gateway status
```

After at least one platform is saved, receive messages:

```bash
koder gateway start --background
```

That keeps running after the terminal closes. Logs are in the gateway directory under the Koder home. Stop it with:

```bash
koder gateway stop
```

Approve a pairing code shown in the chat, for example:

```bash
koder gateway pair K7Q2MX
```

Direct-message policy is `pairing` by default. Also `allowlist`, `open`, or `disabled`. Group policy is `disabled` by default. Also `allowlist` or `open`.

```bash
koder gateway policy feishu --dm pairing --group allowlist
```

`--set key=value` fills a field without prompts. Repeat the flag for each field. Do not put real tokens in a shell history you share. The interactive prompt hides secret fields.

#### Feishu / Lark

Console: <https://open.feishu.cn/app>

1. Create a custom app and add the Bot feature.
2. Grant `im:message` and `im:message:send_as_bot`.
3. Under Events, choose long connection and subscribe to `im.message.receive_v1`.
4. Publish a version.
5. Copy the App ID and App Secret.

```bash
koder gateway setup feishu
```

The prompts are App ID, App Secret, and an optional domain: `feishu` (default) or `lark`. Feishu and Lark use a long connection. No public URL.

#### WeCom

Console: <https://work.weixin.qq.com/wework_admin/frame#/aiHelper/create>

1. In the WeCom admin console open App Management, then AI Bot.
2. Create a bot with long-connection (API) mode.
3. Copy the Bot ID and Secret.

```bash
koder gateway setup wecom
```

No public URL.

#### WeChat

No key. The terminal prints a QR code. Scan it with WeChat on your phone and confirm.

```bash
koder gateway setup weixin
```

#### DingTalk

Console: <https://open-dev.dingtalk.com/fe/app>

1. Create an internal app.
2. Add the Robot feature, set the receive mode to Stream, and publish.
3. Copy the Client ID (AppKey) and Client Secret (AppSecret) from credentials.

```bash
koder gateway setup dingtalk
```

No public URL.

#### Telegram

Open <https://t.me/BotFather>, send `/newbot`, follow the prompts, and copy the bot token.

```bash
koder gateway setup telegram
```

#### Slack

Console: <https://api.slack.com/apps>

1. Create an app.
2. Enable Socket Mode and create an app token (`xapp-`) with `connections:write`.
3. Under OAuth & Permissions add `chat:write`, `app_mentions:read`, and `im:history`. Install the app to the workspace and copy the bot token (`xoxb-`).
4. Under Event Subscriptions subscribe to `app_mention` and `message.im`.

```bash
koder gateway setup slack
```

Prompts: App token, then Bot token. No public URL.

#### Discord

Console: <https://discord.com/developers/applications>

1. Create an application.
2. On the Bot page copy the token and enable Message Content Intent.
3. In OAuth2, URL Generator, pick `bot` with Send Messages and Read Message History.
4. Open the generated link and invite the bot to the server.

```bash
koder gateway setup discord
```

#### WhatsApp

Console: <https://developers.facebook.com/apps>

This one does need a public HTTPS address. Meta calls a webhook on your machine.

1. Create an app, add WhatsApp, and copy the Phone number ID and a permanent access token.
2. Choose a verify token yourself.
3. Run setup, then start the gateway. The local port defaults to `8788`.
4. Expose that port with cloudflared or ngrok.
5. Set the callback to that HTTPS URL with path `/webhook`, and subscribe to `messages`.
6. App secret is optional and recommended. It checks the signature.

```bash
koder gateway setup whatsapp
koder gateway start --background
```

### 9. Optional extras

These are not required for normal use.

**Tutorial inside the product.** 17 lessons in a temporary practice project. No model and no cost. Enter goes forward, `b` goes back, `q` quits, and progress is saved. Lesson 1 names the detected system. Lesson 16 is install and update.

```bash
koder learn
koder learn 3
koder learn --print --os powershell
```

`--os` is `powershell`, `cmd`, `mac`, or `linux`.

**Flows and GitHub Actions.**

```bash
koder flow init pr-gate
koder ci init
```

`koder ci init` writes `.github/workflows/koder.yml`. A pull request is reviewed and commented on when it opens or updates. A comment of `/koder review`, `/koder fix`, `/koder test`, or `/koder ask <question>` runs that action. Instructions that change the repository are accepted only from repository members.

**Local session scan.** This only reads working folders, times, and titles from Koder, Codex, Claude Code, and Cursor session records on this computer. It does not read accounts, keys, or databases, and it does not upload anything.

```bash
koder scan
koder scan --tool codex --tool cursor --days 7
```

### 10. You are done when

- `koder version` prints a version and the updates page.
- The Model row in `koder setup` is no longer "not set".
- `koder doctor` passes the model check.
- `koder ask "Reply with the single word ready"` returns.
- In a project, `koder run` shows a diff and waits for `y` before it writes.

If you connected a chat app, `koder gateway status` shows that platform as configured, and `koder gateway start --background` is running. If you connected an editor, a new thread in that editor can select Koder.

## Licence

The Koder CLI source in this repository is under the GNU General Public License v3.0. The text is `LICENSE`. Third-party components are listed in `THIRD_PARTY_NOTICES.md`.

The KARMEN LOOP kernel is not in this repository, is not public, and is not under that licence. Copyright © KARMEN / Koder. All rights reserved. The kernel is not offered for further development.

Website <https://karmenloop.com> · Email <info@karmenloop.com>
