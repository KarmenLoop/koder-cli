# Koder CLI

English | [简体中文](README.zh-CN.md)

Koder CLI **0.4.0-preview.28 Beta** is a terminal coding agent for personal, noncommercial local use with your own model API. This build includes workspace-isolated task history, independent project folders, bounded API diagnosis, noninteractive clarification and source-disclosure checks. Local regression evidence and Windows-specific follow-up are documented in [CLI contracts](docs/CLI-CONTRACTS.md) and [Windows checks](docs/WINDOWS-INSTALL-CHECKS.md). Native Windows and authenticated provider behavior are not established by macOS fixture tests.

**0.4.0-preview.28** · [Download](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.28) · [Installation guide](docs/INSTALLATION.md) · [Provider setup](docs/PROVIDERS.md)

Koder is a local task tool from the KARMEN LOOP team. Bring your own model API, choose a project, and work through plans, tools, approvals, and recorded results. Personal, noncommercial local use is free and does not require membership. Commercial use and organizational deployment require separate written authorization. The personal license does not permit secondary development or changes to proprietary code. A provider may charge for API requests.

The KARMEN LOOP kernel connects task planning, permission checks, tool execution, and saved results. Public descriptions cover capabilities; new application runtime source remains proprietary under the [EULA](EULA.md). Third-party components retain their own licenses and [credits](OPEN_SOURCE_CREDITS.md).

## Windows and code graph integrations

Optional presets configure Windows-MCP 0.8.8 and CodeGraphContext 0.6.13 through the existing MCP host. Configuration stays disabled until an explicit test or enable. Graph settings and discovery are workspace-bound; actual tool calls retain the original approvals. External Python programs are installed separately. Read [the integration guide](docs/MCP-INTEGRATIONS.en.md) for requirements and unverified native limits.

Actual-call checks were completed after publication on a disposable Windows Server 2025 runner and an isolated Apple-silicon Mac. See [the dated acceptance report](docs/MCP-ACTUAL-ACCEPTANCE.en.md) for the successful tool/Agent paths, the Mac OpenSSL 3 prerequisite and unverified combinations. Agent dispatch was scripted; no real-model planning score is claimed. Installer bytes and default permissions are unchanged.

## Complete guides

Use the [complete English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md), and generated [command reference](docs/COMMAND-REFERENCE.en.md). They distinguish source candidates from the published installer. New projects use Koder Projects; explicit stdin attachment, project-scoped task context, short model diagnostics and on-demand skills are documented with their limits.

## Install

This beta includes the stdin, workspace-history and project-folder repairs. Use the official installer below. The Windows checklist records the remaining native checks for the dedicated test team; local checks do not certify every PC or provider account.

Use Windows 10/11, macOS, Linux, or WSL with the matching shell. The installer reuses Node.js 22.21+ or 24+ or downloads and verifies the runtime. Normal installation does not require administrator access. Read the [license](EULA.md), [consent guide](ACCEPTANCE.md), [copyright notice](LEGAL-NOTICE.md), and [CLI privacy terms](docs/privacy/consumer-privacy.en.md).

Choose **one** command. Wait for the license question, type `accept`, and press Enter. `decline` or Ctrl+C cancels. Empty Windows input asks again. License acceptance enables no optional permissions.

Installed interactive chats check the official update feed in the background at most once every six hours. Updates install only after active tasks, queued input and unfinished drafts are clear, verify the replacement, and resume the conversation. Preparation continues in the background if you start new work; the final handoff waits for the active task. Closing chat cancels unfinished preparation. A changed license requires manual review. Use `koder update auto off` to disable automatic updates, `koder update auto on` to enable them, or `koder update auto status` to inspect the setting. Scripts, one-shot commands and unmanaged copies do not auto-install. `KODER_AUTO_UPDATE=0` disables automatic checks for that process.

### Windows PowerShell

```powershell
$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
```

### Windows Command Prompt (CMD)

Paste the complete line at a CMD prompt. It launches PowerShell with progress reporting before the first script download. Do not paste this CMD wrapper into a PowerShell prompt.

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
```

### macOS / Linux / WSL

```sh
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | bash
```

Downloads show progress and verify SHA-256. Their default and maximum completion deadline are 100000000 seconds. Set `KODER_DOWNLOAD_TIMEOUT_SECONDS` to 1–100000000 for a shorter deadline. Ctrl+C cancels; a failed update retains the previous installation. This setting does not lengthen model API timeouts or the five-second existing-Node probe.

## Start working

```text
koder setup
koder learn
koder
```

The 30-lesson tutorial uses a disposable practice project and a scripted coach, without a paid model. It practices real edits and approvals. It remembers your place, supports English and Chinese, and has PowerShell, CMD, macOS, and Linux editions. Enter continues, b goes back, and q leaves. `koder learn --print --os cmd --lang en` prints an offline text edition.

In chat, `/setup` opens settings, `/model` manages the model, `/new` starts a new topic, and `/exit` leaves. A greeting after restored history does not project an old coding task as the current request. Explicit continuation can still use the retained history.

## Native model APIs and subscriptions

**Known integration bugs; temporarily unavailable:** MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan, Volcano Coding Plan, and Volcano Ark API. Setup displays these entries in gray and prevents selection. Existing profiles are retained for viewing or removal; activation, model tests, refresh and execution are blocked before network access. No automatic backup engine or billing-route switch is used.

Koder implements Chat Completions, Anthropic Messages, and Responses. The catalog retains historical model references, with current availability shown next to each entry. Available entries still require account and model-access verification.

Alibaba Token Plan, Alibaba Coding Plan, and Volcano Coding Plan have independent entries and billing paths. MiMo pay-as-you-go and Token Plan are separate too. No fallback silently changes the host, key, or billing route. The internal backup engine is disabled and gray by default.

```text
koder model presets
koder model models aliyun-coding-plan
koder model test
koder model test --tools
```

The last two commands call your configured API and may incur charges. A text reply proves text access only. The tools check explicitly requests a harmless tool call and continuation. See [PROVIDERS.md](docs/PROVIDERS.md) and [MIMO.md](docs/MIMO.md) for exact endpoints and safe setup.

## Built-in autonomous learning method

KARMEN LOOP's `personal-agent-growth` 0.3.2 ships with the CLI. For relevant tasks, Koder can read its method and references locally through `skill_read`, prepare for the next step, retain failed checks, verify a revised candidate, and resume from task records. Simple requests stay direct.

```sh
koder growth status
koder growth show
koder growth off
koder growth on
```

The switch applies to the next CLI session. This method uses the current model, tools and execution approvals. Task records stay in the authorized workspace. It does not enable personal profiling, synchronization, a background service or a new API budget. Timed continuation requires a separately authorized, available host backend; a saved plan is not a registered schedule. See [the usage guide](docs/AUTONOMOUS-LEARNING.md). The unmodified method retains its own AGPL-3.0-only license and notice.

## Optional celebrations

```text
koder celebrate
koder celebrate fireworks
koder celebrate auto notice
koder celebrate auto off
koder celebrate birthday --date 03-14
koder celebrate music on
koder celebrate music off
koder celebrate locale --language en
```

Code rain, confetti, fireworks, Christmas, Halloween, National Day, New Year, and birthday effects last about six seconds. Any key skips. Menus accept Enter, q, or Esc to leave. Redirected output and JSON never animate. `KODER_REDUCED_MOTION=1` uses a static greeting.

The default holiday behavior is one optional greeting on a supported date. Choose `auto on` for automatic effects; custom annual dates can be added with `celebrate custom --date MM-DD --name "Our day"`. Birthdays store only a confirmed month and day locally. A clear request to remember your own birthday can save it; casual mentions offer a choice. `celebrate birthday forget` removes it and turns music off.

Music and IP country lookup are off by default and confirmed separately. Enabled birthday music requests at most one browser tab that day. The local melody needs no music account. Browser autoplay restrictions may require Play; Koder does not bypass them. Optional QQ Music and YouTube Music searches follow the chosen language and their own service terms. Explicit language and enabled local language counts outrank the optional IP-country hint.

## Privacy, feedback, and permissions

```text
koder privacy consumer
koder privacy statement
koder privacy desktop
koder privacy agreement
koder privacy sources
koder feedback
koder permissions status
```

Full Chinese and English CLI notices, and the unchanged official consumer originals, ship for offline reading. CLI configuration and environment-variable keys are distinguished from the desktop encrypted key store. Model requests, optional sync, app connections, country lookup, and music have separate scopes.

Say that you want to give feedback in chat, or run `koder feedback`, for **info@karmenloop.com** and a blank template. Nothing is sent or attached automatically. Remove keys, passwords, private paths, and personal records before sending.

Permissions, confirmations, redaction, and checksum checks are application safeguards. Operating-system permissions remain separate. `--yes` does not grant optional computer, privacy, birthday, music, or country-lookup consent.

## Updates and evidence

Run `koder update --check` to inspect a release, and `koder update` to install an accepted update. Already completed actions are not replayed merely because a process restarts. Keep your configuration and memory when reinstalling; see the full guide for legacy-version migration.

Release notes and [Windows installation checks](docs/WINDOWS-INSTALL-CHECKS.md) distinguish source tests, installed protocol fixtures, hosted native Windows, real provider accounts, and user devices. New tags contain distribution documentation rather than new proprietary runtime source. Ready-to-use packages, installers, and checksums are attached release assets.

KARMENLOOP Official Team · Shanghai, China · [karmenloop.com](https://karmenloop.com) · [info@karmenloop.com](mailto:info@karmenloop.com)

## Execution permissions

Smart approval is the default: recognized low-risk local checks and ordinary project edits run without a question. Code execution, deletion, secret/configuration paths, shell effects, unknown commands and external application actions ask. The decision comes from local code, not a model's claim. This is an approval policy, not an OS sandbox.

At a sensitive prompt, y allows once, a or always saves that exact action for this workspace, and f or full saves full access for this workspace. Enter/n declines. Saved choices are loaded in later sessions and can be inspected or revoked:

```sh
koder permissions execution status
koder permissions execution ask
koder permissions execution auto
koder permissions execution full --confirm FULL
koder permissions execution full --scope profile --confirm FULL
koder permissions execution revoke all
koder permissions execution reset
```

Full access runs commands, modifies/deletes files and uses already authorized applications without per-action questions. The default scope is this project. --scope profile explicitly covers every project in this local profile. reset removes all saved execution settings; revoke all returns this workspace to smart mode and removes applicable saved rules. --approval auto|ask|full|deny applies only to the current run, while --yes is also temporary and cannot override explicit deny. These choices do not accept software terms, supply passwords, enable learning/sync or grant OS access. ACP/editor and remote gateway callers retain their own approval policies.

Rules stay in the local CLI home as execution-permissions.json, with host/workspace scope and action hashes rather than raw commands or keys. Execution authority is not synchronized as memory. Damaged records do not grant permission. Koder offers a fresh decision: y allows only the current action; always or full backs up the damaged record and saves the chosen permission. Other workspaces return to smart approval. Unsafe paths and unreadable files remain blocked. Use the settings menu's Execution permissions section to manage the same controls.

## Private collections and company licensing

Remote references are off by default. Opt in for one command with `koder resources search "1688" --remote` or `koder resources read RESOURCE_ID --remote`. Set `KODER_REMOTE_RESOURCES=1` to offer remote references to local model tasks. Queries go to the official service; use short keywords without private data. `KODER_REMOTE_RESOURCES=0` blocks remote retrieval. See [remote retrieval and privacy](docs/REMOTE-RESOURCES.md).

Optionally import your own archives with koder resources import /path/to/collection.zip. Add --model-access only if local model sessions may search the collection and receive selected excerpts. References are encrypted locally, loaded on demand and excluded from sync and public releases; bundled scripts never run on import. See [private collection controls](docs/PRIVATE-RESOURCES.md).

For company licensing and dedicated private repository delivery, run koder business or contact [info@karmenloop.com](mailto:info@karmenloop.com). A separate written agreement defines the delivery scope and rights. See [commercial licensing](docs/COMMERCIAL-LICENSING.md).

If Koder is useful, an optional [GitHub star](https://github.com/KarmenLoop/koder-cli) helps others find it. Skip freely; stars never affect installation or licensed features.

Installation stalled or an integration is gray? See [troubleshooting](docs/TROUBLESHOOTING.md).

## Menus in the current terminal

In a Koder conversation, type `/menu` (or `菜单`) for settings, `/celebrate` (or `彩蛋菜单`) for optional effects, and `/growth status` to inspect the built-in learning method. `koder setup` and `koder celebrate` also work directly at the chat prompt. Escape leaves settings; Enter skips the effect menu; any key skips an animation. Continue the task in the same terminal.

Ordinary task requests that mention a website or a menu go to the task engine. Only an explicit question about Koder itself uses the local product introduction.


REA 6.7.0 is bundled under its original MIT license. Its dependencies retain their own licenses and notices, including OpenPGP.js under LGPL-3.0+. See vendor/rea/README.md, vendor/rea/components.json, vendor/rea/node_modules/rea-agents/THIRD_PARTY_NOTICES.md and vendor/rea/sources/. External analysis engines are not included.
