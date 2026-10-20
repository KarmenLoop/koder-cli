# Install Koder CLI, configure a model, and start working

Official team: **KARMENLOOP Official Team**, Shanghai, China. [Website](https://karmenloop.com) · [Email](mailto:info@karmenloop.com)

This guide covers the downloadable **0.4.0-preview.11** release. Basic local use is free. Bring your own provider API key or run a supported local model; providers may charge for requests. The new Koder-owned application source is proprietary. Third-party components retain their own licenses.

## 1. Choose the correct terminal

Use Windows 10/11 with Windows PowerShell 5.1 or PowerShell 7, macOS 11+, or Linux/WSL. Windows XP/7/8 cannot run the required Node.js runtime. Use the Windows instructions in PowerShell or Command Prompt, and the Linux instructions inside WSL.

The installer reuses Node.js 22+ when available, or downloads and verifies the platform runtime. A normal installation does not need administrator rights. OS permissions are separate choices later.

Read the [license](../EULA.md), [consent and data guide](../ACCEPTANCE.md), and [copyright notice](../LEGAL-NOTICE.md) before accepting. Accepting the software license does not enable preference learning, synchronization, application access, messaging, or computer permissions.

## 2. Install

Paste **one complete command** into your chosen terminal and press Enter. Wait for the installer's `accept / decline:` question. Type the word `accept`, then press Enter. Do not paste the CMD command into PowerShell.

### Windows PowerShell

```powershell
$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
```

### Windows Command Prompt (CMD)

```bat
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
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

`koder version` should show `0.4.0-preview.11` for this release. Windows installs the application under `%LOCALAPPDATA%\koder-cli` and keeps configuration separately under `%USERPROFILE%\.koder-cli`. macOS/Linux use `~/.koder-cli` and a launcher in `~/.local/bin`. A separately configured memory directory is retained.

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

The tutorial contains 23 lessons, in Chinese and English, with distinct PowerShell, CMD, macOS and Linux commands. View the matching printable edition without a model request:

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

See [the MiMo guide](MIMO.md) for separate pay-as-you-go and Token Plan presets, Pro/Flash model IDs, Hermes routing, a hidden key prompt and connection checks.

## Provider compatibility

See [PROVIDERS.md](PROVIDERS.md) for the dated model catalog, native protocols, removed entries, account verification, and optional fallback engine.
