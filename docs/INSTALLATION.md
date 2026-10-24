# Install Koder CLI, configure a model, and start working

> Older updaters can reject this package above their 100 MB limit. Run the current official installer once to upgrade in place while retaining configuration and history; see the [migration guide](RELEASE-0.4.7.md).

**Known integration bugs; temporarily unavailable:** MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan, Volcano Coding Plan, and Volcano Ark API. Setup displays these entries in gray and prevents selection. Existing profiles are retained for viewing or removal; activation, model tests, refresh and execution are blocked before network access. No automatic backup engine or billing-route switch is used. See [provider availability](PROVIDERS.md#current-availability).

Official team: **KARMENLOOP Official Team**, Shanghai, China. [Website](https://karmenloop.com) · [Email](mailto:info@karmenloop.com)

This guide describes **0.4.7**. The official website provides the installer, package, checksums and tutorials. The complete [English guide](USER-GUIDE.en.md) and [Chinese guide](USER-GUIDE.zh.md) describe this release and its remaining acceptance limits. Personal, noncommercial local use is free. Commercial use and organizational deployment require separate written authorization. Bring your own provider API key or run a supported local model; providers may charge for requests. The new Koder-owned application source is proprietary. Third-party components retain their own licenses.

## 1. Choose the correct terminal

Use Windows 10/11 with Windows PowerShell 5.1 or PowerShell 7, macOS 11+, or Linux/WSL. Windows XP/7/8 cannot run the required Node.js runtime. Use the Windows instructions in PowerShell or Command Prompt, and the Linux instructions inside WSL.

The installer reuses Node.js 22.21+ or 24+ when available, or downloads and verifies the platform runtime. A normal installation does not need administrator rights. OS permissions are separate choices later.

Read the [license](../EULA.md), [consent and data guide](../ACCEPTANCE.md), and [copyright notice](../LEGAL-NOTICE.md) before accepting. Accepting the software license does not enable preference learning, synchronization, application access, messaging, or computer permissions.

## 2. Install

Paste **one complete command** into your chosen terminal and press Enter. Wait for the installer's `accept / decline:` question. Type the word `accept`, then press Enter. Do not paste the CMD command into PowerShell.

### Windows PowerShell

```powershell
$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
```

### Windows Command Prompt (CMD)

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $connect=30; if($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 3600){$connect=$v}else{throw 'KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS must be 1..3600'}}; $bootstrapLimit=[Math]::Min($limit,$connect); $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $bootstrapLimit){if($limit -le $connect){throw ('Installer download timed out after '+$limit+'s')}; throw ('Installer bootstrap stalled after '+$connect+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
```

On Windows, an empty Enter or unrecognized answer now asks again. It does not accept the license or start downloading. Leading/trailing spaces around `accept` are ignored. Type `decline` or press Ctrl+C to cancel. Redirected input cannot silently accept the license.

### macOS, Linux, or WSL

```bash
curl -fsSL https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh | bash
```

The shell installer reads the answer from the controlling terminal. Type `accept` and press Enter to continue. `decline`, empty Enter, Ctrl+C, or a closed terminal cancels. Without a terminal it stops with an explanation.

Only a person who has already read and agreed may explicitly use `KODER_EULA_ACCEPT=1` for unattended deployment. It is **not required for a normal install**, and tutorials or wrappers must not set it for someone else.

## 3. Reopen the terminal and verify the installation

After the installer reports success, close that terminal and open a new one so its PATH refreshes.

```text
koder version
koder setup
```

`koder version` should show `0.4.7` for this release. Windows installs the application under `%LOCALAPPDATA%\koder-cli` and keeps configuration separately under `%USERPROFILE%\.koder-cli`. macOS/Linux use `~/.koder-cli` and a launcher in `~/.local/bin`. A separately configured memory directory is retained.

If Windows says `koder` is not recognized, reopen the terminal first. You can inspect the installed launcher directly:

```powershell
& "$env:LOCALAPPDATA\koder-cli\bin\koder.cmd" version
```

In CMD:

```bat
"%LOCALAPPDATA%\koder-cli\bin\koder.cmd" version
```

## 4. Configure a real model

In `koder setup`, choose your language, open the model settings, and select your provider. Enter its model ID, API endpoint, protocol and your own API key. Follow that provider's exact API documentation. A website subscription does not necessarily include API access. A local model must already be installed and running.

Set the context and output limits to values the selected model supports. Keep space for input, history and tool results. Do not increase the limit beyond the provider's actual window.

Test the actual connection:

```text
koder model test
koder doctor --api
```

If a key is rejected, check its provider, permission and quota. If the endpoint fails, check the complete API URL, proxy and network. A model-context error is different from a network failure. Do not paste keys into GitHub issues or screenshots.

## 5. Complete your first task

Change to a project folder, then start Koder:

```text
koder
```

Ask it to explain a file first. Review proposed changes and commands before approving them. Start the guided practice with:

```text
koder learn
```

The tutorial contains 30 lessons, in Chinese and English, with distinct PowerShell, CMD, macOS and Linux commands. View the matching printable edition without a model request:

```text
koder learn --print --lang en --os powershell
koder learn --print --lang en --os cmd
koder learn --print --lang en --os mac
koder learn --print --lang en --os linux
```

Configure memory, learning, computer scope and applications separately in setup. Use `koder permissions` to inspect or explicitly grant directory access. The operating system still controls its own permissions. Connecting an application does not automatically grant another conversation authority to send messages or execute work.

## 6. Update without clearing your data

```text
koder update --check
koder update
```

You can also ask to update Koder CLI in a local conversation. If the installed version is already current, it reports that and does not reinstall. Newer sessions switch at a safe point and retain configuration, memory and bindings. A provider-revoked credential still needs that provider's authorization again.

For old 0.3.x/preview.1/2 installations, run the normal install command once to obtain the current updater. The license checksum changed in preview.7; preview.6 may stop and request review. Read the current terms and rerun the normal installer to explicitly accept them. Do not edit acceptance records or uninstall first. Preview.7 to preview.8 keeps the same EULA checksum.

## Troubleshooting the PowerShell cancellation screenshot

`Koder CLI cancelled: Not accepted. Nothing was downloaded or installed` means the old installer stopped at its license question. It does not establish an API or download-network failure. Preview.7 cancelled immediately on an empty answer; preview.8 asks again instead.

Run the current command again, wait for `accept / decline:`, type `accept` and press Enter. If you do not agree, type `decline` or press Ctrl+C. If it still fails, report the terminal name, Windows version, exact command and complete redacted error to [GitHub Issues](https://github.com/KarmenLoop/koder-cli/issues) or the official email.

See [release status](../RELEASE_STATUS.md) for the precise test coverage. Windows CI checks do not replace acceptance on your own machine, real messaging/Gamma accounts, or physical multi-device testing.

## If installation stops producing output after accept

Preview.11 reports the accepted/runtime-check stage immediately. An unresponsive existing Node probe is stopped after five seconds. Downloads report progress every five seconds and default to a 100000000-second completion deadline. Set KODER_DOWNLOAD_TIMEOUT_SECONDS to an integer from 1 through 100000000 to use a shorter deadline. Ctrl+C cancels. The download deadline does not change the Node probe or model API deadlines. Failed transfers never activate a new version or write an acceptance record. The updater uses the same download setting; it schedules long deadlines in bounded timer chunks to prevent overflow.

The default Windows installer first uses the official website mirror, then the official GitHub/Node host if the mirror cannot be reached. The mirrored package/runtime bytes retain the original checksums; a checksum mismatch stops installation. Explicit custom KODER_INSTALL_BASE or KODER_NODE_DIST values are respected.

## Xiaomi MiMo V2.6

See [the MiMo guide](MIMO.md) for separate pay-as-you-go and Token Plan presets, Pro/Flash model IDs, regional endpoints, a hidden key prompt and connection checks.

## Provider compatibility

See [PROVIDERS.md](PROVIDERS.md) for the dated model catalog, native protocols, removed entries, account verification, and optional fallback engine.

## Offline privacy, feedback, and optional celebrations

Run `koder privacy consumer` or `koder privacy statement` for the complete installed CLI notices; `desktop` and `agreement` retain the official originals, and `sources` shows hashes. No model or prior license acceptance is needed to read them. `koder feedback` supplies info@karmenloop.com and an empty template without sending anything.

The 30-lesson tutorial includes native subscription routes, safe API checks, and privacy controls. `koder celebrate` offers skippable six-second effects. Birthday month/day, music, and optional IP country lookup have separate choices; none is enabled by accepting the license or --yes. Music autoplay depends on the browser and keeps a one-click fallback. These optional features do not change installer consent, checksums, or runtime download behavior.

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

Windows memory directories now use native ACL inspection. New empty directories are protected for the local owner, SYSTEM and Administrators, then read back before use. Existing nonempty directories with broader access stay blocked without changing their ACL or contents. No administrator elevation is requested. A junction or changed root is rejected.

## Personal-use terms and private collections in preview.15

This release adopts Koder-EULA-1.1. Earlier acceptance records do not accept the new terms, and older updaters stop before installation when the agreement changes. Read the new EULA and run the ordinary installer above; type accept only if you agree. Configuration, memory and model settings are retained. Commercial use requires a separate written authorization; koder business explains company licensing and dedicated private repository inquiries.

For local archives, see [private reference collections](PRIVATE-RESOURCES.md). Imported originals are never included in the public download. A voluntarily chosen GitHub star is welcome and never required to install or use licensed features.


The official encrypted workflow library is available on demand with `koder resources search "1688"`. No full library is installed locally. The server receives short query keywords; use `KODER_REMOTE_RESOURCES=0` to disable it. See [remote references](REMOTE-RESOURCES.md) for privacy, licenses and controls.


## Download progress and stalled connections

The overall transfer limit remains 100,000,000 seconds by default and can be lowered with KODER_DOWNLOAD_TIMEOUT_SECONDS. Windows checks for a connection with no received file bytes (30 seconds by default) and for an active transfer that stops growing (60 seconds). Official mirrors are tried within the same overall budget; checksum failures never trigger a fallback. The small bootstrap script has a separate 30-second phase limit. KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS accepts 1..3600 and also controls the bootstrap limit; KODER_DOWNLOAD_IDLE_TIMEOUT_SECONDS accepts 1..86400. Raise those only for a genuinely slow connection. Cancellation and failures leave the previous installation active.

Model replies terminate at the provider's stream completion marker, even if an intermediary keeps HTTP open. `koder model test --tools` checks a harmless tool call and its continuation. An empty, incomplete or malformed HTTP 200 response is reported as the specific model error rather than as an HTTP failure. The three providers' paid API keys, subscription keys and regions are distinct; select the matching preset and product.

The installer uses private Node.js 22.23.3 when an existing runtime lacks the required SQLite or environment-proxy support. It leaves the global Node.js installation unchanged.
# Automatic updates in preview.17

An installed CLI checks the official GitHub update feed during interactive chats, at most once every six hours. The check runs without blocking input. Installation waits for an idle conversation with no running task, queued line or unfinished draft. The updater checks installer and package hashes, verifies the installed entry, and uses the existing conversation handoff and startup fallback. It does not replay completed work or grant permissions.

Run `koder update auto off` (or `/update auto off` in chat) to disable it. Use `on` to enable it and `status` to inspect it. `KODER_AUTO_UPDATE=0` disables automatic checks in the current process. Scripts, one-shot questions, unmanaged copies, explicit private mirrors, and read-only chat modes do not automatically install. A changed license stops automatic installation and requires review. Manual `koder update --check` and `koder update` remain available.


## Project folders, scripts and diagnostic checks

New creation tasks use the users Koder Projects folder unless an existing or explicit workspace is selected. Use koder project create, open, list or status; /project switches the current chat. Task history and automatically captured facts stay in their selected conversation. Private records remain in the local Koder profile.

An explicit ask/run prompt does not consume unrelated stdin. Add --stdin to attach a pipe; with no prompt, stdin supplies the task. Input has a five-second complete-read deadline, adjustable with --stdin-timeout. Model diagnosis uses a separate ten-second budget with no inference retries. Provider reasons are bounded and redacted. See the complete guide for platform-specific pipes, language, approvals, browser methods and H5 delivery.

## 0.4.7 quick reference

Use `koder skills list` and `/skill` for portable methods. Add input while the agent works; Setup selects steer or queue. Use `/harness deep-research` for research, or `koder harness off` for baseline behavior. App operations keep existing grants and driver limits. Missing persistent experience owners produce NO_ENTRY.

[Skills](PORTABLE-SKILLS.en.md) · [Input and Setup](SESSION-INPUT-AND-SKILLS.en.md) · [App use](APP-USE-AND-LEARN.en.md) · [Harness](HARNESS-JIT.md) · [Changes and limits](RELEASE-0.4.7.md)

## 0.4.7: residency and mail inquiries

After installation, verify `koder --version` reports 0.4.7, then configure a model with `koder setup`. Optionally run `koder activate`; inspect with `koder status` and disable with `koder deactivate`. Residency does not grant tool permissions. Mail, calendar and browser history are off by default. Setup controls quiet hours, reminder limits and visible sources.

Bind mail in Setup using masked authorization-code input. Separately enable `/mail model on` and `/mail inquire on` with their consent phrases. Related incoming mail can offer choices; a choice creates a draft, and sending still requires final preview and confirmation. Background mail checks also require mail visibility in resident settings. Advertisements and verification codes are excluded from inquiries.

[Complete resident guide](ALWAYS-ON.en.md) · [Complete mail guide](MAIL-PROACTIVE-INQUIRY.en.md) · [Changes and unverified paths](RELEASE-0.4.7.md). All 30 lessons and eight text editions remain; start with `koder learn`.
