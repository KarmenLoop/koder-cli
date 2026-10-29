# 16. Install, update and switch engines

Allow 40 minutes

**Goal**：Install or update correctly, verify the running version and retain configuration and recovery options.

**Preparation**：Record OS, architecture, installed version and executable path. Use the official site or GitHub and the shell-specific installation guide.

## Hands-on steps

1. Run koder version and koder update status and note location and policy.

   **Check**：Distinguish the launcher, version directory and data directory; multiple installs may launch an old copy.

2. Read license and installation instructions, choose the correct installer and start updates with koder update --check.

   **Check**：A check is not an installation. Preserve the failing stage on download errors.

3. Run koder update when ready and follow save/switch prompts without killing other tasks.

   **Check**：Download, verification, installation and entry checks are distinct stages.

4. Open a new terminal, run koder version and koder doctor, then inspect your project and settings.

   **Check**：The new entry launches the intended version and retains data; keep logs for any failure.

## Troubleshooting and recovery

- **Auto-update asks for manual action**：Inspect ownership, path and the precise error; use the official installer when needed without deleting configuration.
- **PowerShell blocks a script**：Use the documented launcher; do not globally set Unrestricted or disable protection.

## Assignment and acceptance

Write an upgrade record: before/after version, launcher, retained settings and recovery path. Label a dry run as such.

**Acceptance**：Actual launch agrees with version output. A download is not startup acceptance; record each platform separately.

## Developer track

1. Separate CMD, PowerShell 5.1, macOS and architectures. Isolate PATH for no-Node startup rather than removing the user’s Node.

2. Check hashes, manifests, upgrades and EOF exit with original deadlines.

3. Windows Server evidence does not replace Windows 10/11 client GUI acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [INSTALLATION.md](../INSTALLATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)
- [AUTO-UPDATE.en.md](../AUTO-UPDATE.en.md)
- [WINDOWS-INSTALL-CHECKS.md](../WINDOWS-INSTALL-CHECKS.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 16 of 30 · Install, update and switch engines ━━
Coach › Want Koder on another machine? Read the license and consent guide, then use your shell’s installer. Missing Node.js is downloaded and the package is checked with SHA-256. Run setup and learn afterwards.
    Read in your browser first:
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        Official team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.
        A normal install asks you to type accept and press Enter. decline or Ctrl+C cancels; an empty Enter asks again without installing. Type the full word accept, then press Enter.
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
        Unattended deployment after you have read and agreed (do not prefill this for someone else; KODER_EULA_ACCEPT=1 accepts only the software license):
    $env:KODER_EULA_ACCEPT = "1"
    $ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script
    Remove-Item Env:KODER_EULA_ACCEPT
        Windows 10 / 11: reopen Command Prompt or PowerShell; this window does not refresh PATH.
    koder version
    koder setup
    koder learn
    koder update --check
        Check the CLI website without installing
    koder update
        Verify and install a newer release; preview.6+ sessions restart and resume with config, memory and bindings retained
        To move to preview.7, run the normal install command above and type accept after reading. The preview.6 updater stops before downloading the installer when the license checksum changes, and KODER_EULA_ACCEPT does not bypass that check. Configuration, memory and bindings are kept
    koder uninstall
        Remove the app, keep config; choose --purge separately to delete config
  Tip · It lives in %LOCALAPPDATA%\koder-cli with settings in %USERPROFILE%\.koder-cli; no administrator rights. If the execution policy complains, use the CMD line (it passes -ExecutionPolicy Bypass).
Coach › Windows XP, 7 and 8 can't install it: Node.js 22 needs Windows 10, and XP can't even speak the TLS 1.2 that model APIs require. On an old PC, SSH into another machine running Koder with a tool like PuTTY, or send tasks from your phone through the chat gateway.
  Tip · Installing on another system? koder learn 16 --os powershell (or cmd, mac, linux) shows that edition.
Coach › Installed copies check at the start of each interactive chat and every six hours while it stays open. Installation waits until tasks, queued input and drafts are clear, then verifies the new entry and resumes the conversation. A changed license requires your attention first. Prefer your own timing? Use /update auto off, or /update auto on (or “enable automatic updates”) to re-enable it in this window. Keep typing to steer a running task; press / on an empty line for editable choices. Use koder logs --tail 100 for local diagnostics. Even updates can wait their turn.
    koder update auto status
    koder update auto off
    koder update --check
    koder update
Coach › Koder uses its built-in native adapters. The internal fallback is disabled and gray by default; ordinary use needs no extra engine. Check the selected model and protocol first. A network error never silently changes the engine, key, or billing endpoint.
    koder engine list
    koder model show
    koder engine use koder
  (whispering) The uninstall command is here not because we want you to use it, but because we trust you won't.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 16 of 30 · Install, update and switch engines ━━
Coach › Want Koder on another machine? Read the license and consent guide, then use your shell’s installer. Missing Node.js is downloaded and the package is checked with SHA-256. Run setup and learn afterwards.
    Read in your browser first:
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        Official team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.
        A normal install asks you to type accept and press Enter. decline or Ctrl+C cancels; an empty Enter asks again without installing. Type the full word accept, then press Enter.
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
        Unattended deployment after you have read and agreed (do not prefill this for someone else; KODER_EULA_ACCEPT=1 accepts only the software license):
    set "KODER_EULA_ACCEPT=1"
    powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; $ProgressPreference='SilentlyContinue'; [Net.ServicePointManager]::SecurityProtocol=[Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12; $u='https://karmenloop.com/install/koder-cli.ps1'; Write-Host ('Koder: loading installer from '+([Uri]$u).Host+'...'); $limit=100000000; if($env:KODER_DOWNLOAD_TIMEOUT_SECONDS){$v=0; if([int]::TryParse($env:KODER_DOWNLOAD_TIMEOUT_SECONDS,[ref]$v) -and $v -ge 1 -and $v -le 100000000){$limit=$v}else{throw 'KODER_DOWNLOAD_TIMEOUT_SECONDS must be 1..100000000'}}; $client=New-Object Net.WebClient; $client.Encoding=[Text.Encoding]::UTF8; $clock=[Diagnostics.Stopwatch]::StartNew(); $next=5; try{$task=$client.DownloadStringTaskAsync([Uri]$u); $wait=([IAsyncResult]$task).AsyncWaitHandle; while(-not $wait.WaitOne(200)){if($clock.Elapsed.TotalSeconds -ge $limit){throw ('Installer download timed out after '+$limit+'s')}; if($clock.Elapsed.TotalSeconds -ge $next){Write-Host ('Still loading installer: '+[int]$clock.Elapsed.TotalSeconds+'s elapsed. Ctrl+C cancels.'); $next+=5}}; $script=$task.GetAwaiter().GetResult()}finally{$client.CancelAsync(); $client.Dispose()}; Invoke-Expression $script"
    set "KODER_EULA_ACCEPT="
        Windows 10 / 11: reopen Command Prompt or PowerShell; this window does not refresh PATH.
    koder version
    koder setup
    koder learn
    koder update --check
        Check the CLI website without installing
    koder update
        Verify and install a newer release; preview.6+ sessions restart and resume with config, memory and bindings retained
        To move to preview.7, run the normal install command above and type accept after reading. The preview.6 updater stops before downloading the installer when the license checksum changes, and KODER_EULA_ACCEPT does not bypass that check. Configuration, memory and bindings are kept
    koder uninstall
        Remove the app, keep config; choose --purge separately to delete config
  Tip · It lives in %LOCALAPPDATA%\koder-cli with settings in %USERPROFILE%\.koder-cli; no administrator rights. Reopen the window afterwards: a CMD window fixes its PATH when it opens.
Coach › Windows XP, 7 and 8 can't install it: Node.js 22 needs Windows 10, and XP can't even speak the TLS 1.2 that model APIs require. On an old PC, SSH into another machine running Koder with a tool like PuTTY, or send tasks from your phone through the chat gateway.
  Tip · Installing on another system? koder learn 16 --os powershell (or cmd, mac, linux) shows that edition.
Coach › Installed copies check at the start of each interactive chat and every six hours while it stays open. Installation waits until tasks, queued input and drafts are clear, then verifies the new entry and resumes the conversation. A changed license requires your attention first. Prefer your own timing? Use /update auto off, or /update auto on (or “enable automatic updates”) to re-enable it in this window. Keep typing to steer a running task; press / on an empty line for editable choices. Use koder logs --tail 100 for local diagnostics. Even updates can wait their turn.
    koder update auto status
    koder update auto off
    koder update --check
    koder update
Coach › Koder uses its built-in native adapters. The internal fallback is disabled and gray by default; ordinary use needs no extra engine. Check the selected model and protocol first. A network error never silently changes the engine, key, or billing endpoint.
    koder engine list
    koder model show
    koder engine use koder
  (whispering) The uninstall command is here not because we want you to use it, but because we trust you won't.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 16 of 30 · Install, update and switch engines ━━
Coach › Want Koder on another machine? Read the license and consent guide, then use your shell’s installer. Missing Node.js is downloaded and the package is checked with SHA-256. Run setup and learn afterwards.
    Read in your browser first:
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        Official team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.
        A normal install asks you to type accept and press Enter. decline, an empty Enter, or Ctrl+C cancels before download.
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | bash
        Unattended deployment after you have read and agreed (do not prefill this for someone else; KODER_EULA_ACCEPT=1 accepts only the software license):
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
        macOS 11+, Apple silicon or Intel; reopen your terminal.
    koder version
    koder setup
    koder learn
    koder update --check
        Check the CLI website without installing
    koder update
        Verify and install a newer release; preview.6+ sessions restart and resume with config, memory and bindings retained
        To move to preview.7, run the normal install command above and type accept after reading. The preview.6 updater stops before downloading the installer when the license checksum changes, and KODER_EULA_ACCEPT does not bypass that check. Configuration, memory and bindings are kept
    koder uninstall
        Remove the app, keep config; choose --purge separately to delete config
  Tip · It lives in ~/.koder-cli with the launcher at ~/.local/bin/koder; no sudo. The first git use may ask to install the Command Line Developer Tools: click Install.
  Tip · Installing on another system? koder learn 16 --os powershell (or cmd, mac, linux) shows that edition.
Coach › Installed copies check at the start of each interactive chat and every six hours while it stays open. Installation waits until tasks, queued input and drafts are clear, then verifies the new entry and resumes the conversation. A changed license requires your attention first. Prefer your own timing? Use /update auto off, or /update auto on (or “enable automatic updates”) to re-enable it in this window. Keep typing to steer a running task; press / on an empty line for editable choices. Use koder logs --tail 100 for local diagnostics. Even updates can wait their turn.
    koder update auto status
    koder update auto off
    koder update --check
    koder update
Coach › Koder uses its built-in native adapters. The internal fallback is disabled and gray by default; ordinary use needs no extra engine. Check the selected model and protocol first. A network error never silently changes the engine, key, or billing endpoint.
    koder engine list
    koder model show
    koder engine use koder
  (whispering) The uninstall command is here not because we want you to use it, but because we trust you won't.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 16 of 30 · Install, update and switch engines ━━
Coach › Want Koder on another machine? Read the license and consent guide, then use your shell’s installer. Missing Node.js is downloaded and the package is checked with SHA-256. Run setup and learn afterwards.
    Read in your browser first:
    https://github.com/KarmenLoop/koder-cli/blob/main/EULA.md
    https://github.com/KarmenLoop/koder-cli/blob/main/ACCEPTANCE.md
    https://github.com/KarmenLoop/koder-cli/blob/main/LEGAL-NOTICE.md
        Official team: KARMENLOOP Official Team, Shanghai, China. Website: https://karmenloop.com. Email: info@karmenloop.com.
        A normal install asks you to type accept and press Enter. decline, an empty Enter, or Ctrl+C cancels before download.
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | bash
        Unattended deployment after you have read and agreed (do not prefill this for someone else; KODER_EULA_ACCEPT=1 accepts only the software license):
    curl -fsSL https://kodermodule.com/install/cli-0.5.21/koder-cli.sh | KODER_EULA_ACCEPT=1 bash
        Linux / WSL: follow runtime detection from the installer, then reopen your terminal.
    koder version
    koder setup
    koder learn
    koder update --check
        Check the CLI website without installing
    koder update
        Verify and install a newer release; preview.6+ sessions restart and resume with config, memory and bindings retained
        To move to preview.7, run the normal install command above and type accept after reading. The preview.6 updater stops before downloading the installer when the license checksum changes, and KODER_EULA_ACCEPT does not bypass that check. Configuration, memory and bindings are kept
    koder uninstall
        Remove the app, keep config; choose --purge separately to delete config
  Tip · No sudo; everything goes in your home folder. Older systems such as Ubuntu 18.04 (glibc below 2.28) and musl systems such as Alpine get the Node.js unofficial build automatically; 32-bit Raspberry Pi (armv7l) works too. koder not found afterwards? Run source ~/.bashrc or open a new terminal.
  Tip · Installing on another system? koder learn 16 --os powershell (or cmd, mac, linux) shows that edition.
Coach › Installed copies check at the start of each interactive chat and every six hours while it stays open. Installation waits until tasks, queued input and drafts are clear, then verifies the new entry and resumes the conversation. A changed license requires your attention first. Prefer your own timing? Use /update auto off, or /update auto on (or “enable automatic updates”) to re-enable it in this window. Keep typing to steer a running task; press / on an empty line for editable choices. Use koder logs --tail 100 for local diagnostics. Even updates can wait their turn.
    koder update auto status
    koder update auto off
    koder update --check
    koder update
Coach › Koder uses its built-in native adapters. The internal fallback is disabled and gray by default; ordinary use needs no extra engine. Check the selected model and protocol first. A network error never silently changes the engine, key, or billing endpoint.
    koder engine list
    koder model show
    koder engine use koder
  (whispering) The uninstall command is here not because we want you to use it, but because we trust you won't.
```

</details>
