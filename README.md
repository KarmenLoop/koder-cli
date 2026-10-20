# Koder CLI

**0.4.0-preview.13** · [Download](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.13) · [Installation guide](docs/INSTALLATION.md) · [Provider setup](docs/PROVIDERS.md)

Koder is a local task tool from the KARMEN LOOP team. Bring your own model API, choose a project, and work through plans, tools, approvals, and recorded results. Basic local use is free and does not require membership. A provider may charge for API requests.

The KARMEN LOOP kernel connects task planning, permission checks, tool execution, and saved results. Public descriptions cover capabilities; new application runtime source remains proprietary under the [EULA](EULA.md). Third-party components retain their own licenses and [credits](OPEN_SOURCE_CREDITS.md).

## Install

Use Windows 10/11, macOS, Linux, or WSL with the matching shell. The installer reuses Node.js 22+ or downloads and verifies the runtime. Normal installation does not require administrator access. Read the [license](EULA.md), [consent guide](ACCEPTANCE.md), [copyright notice](LEGAL-NOTICE.md), and [CLI privacy terms](docs/privacy/consumer-privacy.en.md).

Choose **one** command. Wait for the license question, type `accept`, and press Enter. `decline` or Ctrl+C cancels. Empty Windows input asks again. License acceptance enables no optional permissions.

### Windows PowerShell

```powershell
$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
```

### Windows Command Prompt (CMD)

Paste the complete line at a CMD prompt. It launches PowerShell with progress reporting before the first script download. Do not paste this CMD wrapper into a PowerShell prompt.

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
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

Koder directly implements Chat Completions, Anthropic Messages, and Responses. The dated catalog has 35 visible presets and 94 curated model choices. Protocol fixtures cover the 32 cloud presets; account permissions, quota, and live availability require your own verification.

Alibaba Token Plan, Alibaba Coding Plan, and Volcano Coding Plan have independent entries and billing paths. MiMo pay-as-you-go and Token Plan are separate too. No fallback silently changes the host, key, or billing route. The internal backup engine is disabled and gray by default.

```text
koder model presets
koder model models aliyun-token-plan
koder model models aliyun-coding-plan
koder model models volcano-coding-plan
koder model test
koder model test --tools
```

The last two commands call your configured API and may incur charges. A text reply proves text access only. The tools check explicitly requests a harmless tool call and continuation. See [PROVIDERS.md](docs/PROVIDERS.md) and [MIMO.md](docs/MIMO.md) for exact endpoints and safe setup.

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

Rules stay in the local CLI home as execution-permissions.json, with host/workspace scope and action hashes rather than raw commands or keys. Execution authority is not synchronized as memory. Corrupt or unsafe permission files fail closed. Use the settings menu's Execution permissions section to manage the same controls.
