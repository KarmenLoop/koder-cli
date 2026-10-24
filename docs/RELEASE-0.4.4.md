# Koder CLI 0.4.4

Koder CLI 0.4.4 ships Windows CMD/PowerShell and macOS Apple silicon/Intel installers together. It adds a bundled Windows-MCP runtime, more useful installation recovery, native mail sending and background inbox alerts, and default-on Headroom context optimization. It preserves the existing Core, BYOK routes, permissions, Skills, resident agent and isolated task histories.

## Changes since 0.4.3

- **Windows-MCP without a separate Python install.** The Windows x64 bundle contains Windows-MCP 0.8.8, CPython 3.14.8 and pinned dependencies. Setup and discovery now show the bundled connection before it has been added. Configure, test and enable it through the existing MCP controls. A global winget/Python/pip installation is unnecessary. Existing installed or uvx connections are preserved. macOS continues to use its existing computer drivers; it does not run Windows-MCP.
- **Bounded installation waits and honest recovery.** Ordinary shell commands retain their 20-second default. Direct winget/pip installations receive a 120-second default, with explicit per-command waits up to 300 seconds subject to the existing approval. A timeout or detached launcher is an uncertain result, not a completed installation. The task can inspect receipts and diagnose without automatically repeating the installation or sending/publishing anything. This addresses the reported default-react stop after an installation timeout without treating a background 'started' message as success.
- **Send through the mailbox you bound.** Native mail_send and mail_reply use the configured SMTP account directly. A request to send mail no longer needs to search Apps/MCP or invoke nested Koder commands. The final sender, recipient, subject and body still require send approval. SMTP acceptance is recorded; uncertain deliveries require reconciliation, not a blind retry.
- **Background inbox alerts.** Binding can offer a separately consented monitor. An activated running resident host checks the bound inbox every 30 seconds by default, with persisted notices and cursor tracking. Mail polling is separate from the general proactive interval. Quiet hours and daily limits remain adjustable in Setup. This is polling, not guaranteed instant push; sleep, connectivity and OS notification restrictions can delay alerts. Spam/custom folders are not watched.
- **Headroom enabled by default.** Reversible projections reduce repeated structure in eligible tool results while retaining original evidence in the same thread. Setup can turn optimization and output guidance off. No separate proxy, model or Python process is required. Byte reduction is not a promise of lower token charges or higher model quality.

## Install and update

Download [Windows CMD](https://karmenloop.com/install/koder-cli.cmd), [Windows PowerShell](https://karmenloop.com/install/koder-cli.ps1) or [macOS shell](https://karmenloop.com/install/koder-cli.sh). Follow the [installation guide](INSTALLATION.md) for the command appropriate to your terminal. These CLI installers use the same versioned runtime archive, not desktop EXE/DMG packages. Compatible Node is reused; otherwise the installer prepares a verified private runtime.

```text
koder update
koder --version
koder setup
koder learn
```

The version should be `koder 0.4.4`. Settings, histories and active-task ownership remain in place. For Windows-MCP, run the following commands separately in CMD or PowerShell:

```text
koder mcp doctor windows-mcp --json
koder mcp add windows-mcp --preset windows-mcp --runner bundled
koder mcp test windows-mcp
koder mcp enable windows-mcp
koder mcp tools windows-mcp
```

Configuration alone does not enable desktop access. An interactive Windows x64 desktop is required. Windows ARM64/32-bit, WSL, UAC secure desktop and elevated applications are not established by this bundle.

## Complete guides

Start with the [English user guide](USER-GUIDE.en.md) or [Chinese user guide](USER-GUIDE.zh.md). The package and website include 30 interactive lessons, eight full text editions for CMD, PowerShell, macOS and Linux in Chinese and English, and a command reference generated from the actual CLI definitions.

- [Windows-MCP setup](WINDOWS-MCP-BUNDLED.en.md) / [中文](WINDOWS-MCP-BUNDLED.zh.md)
- [Installation recovery](WINDOWS-INSTALL-RECOVERY.en.md) / [中文](WINDOWS-INSTALL-RECOVERY.zh.md)
- [Mail sending and monitoring](MAIL-DELIVERY.en.md) / [中文](MAIL-DELIVERY.zh.md)
- [Headroom](HEADROOM.en.md) / [中文](HEADROOM.zh.md)
- [Resident agent](ALWAYS-ON.en.md), [portable Skills](PORTABLE-SKILLS.en.md), [live input](SESSION-INPUT-AND-SKILLS.en.md), [task profiles](HARNESS-JIT.md) and [app-use learning](APP-USE-AND-LEARN.en.md)

## Verification and known limits

The frozen candidate.5 passed 132 distinct selected source checks and 100 checks against its actual unpacked artifact. Those layers overlap and use local children, scripted models or isolated protocol fixtures. Seven targeted reproductions failed before the fixes and passed afterward. Final 0.4.4 artifact and public-download checks are recorded separately; these numbers are not a full-product or native-device acceptance claim.

Windows 10/11 no-Node/PowerShell 5.1 cold installation and update, MCP GUI operations, UAC/ConPTY/IME, native login/reboot/notification display, real 163 accounts and real-model quality remain NOT_RUN for this exact release. The isolated Windows CI job did not start because of account billing limits. macOS LaunchAgent login/reboot and Intel-device checks also remain unverified. Earlier 8K-context failures and other historical failure records are retained. Unavailable model presets remain disabled; this release does not declare them repaired.

Mail alerts respect quiet hours and notification budgets; a submitted OS notification is not proof it was displayed. Inbox collection never sends replies automatically. No universal application-coverage, instant delivery or benchmark improvement is claimed.

Published at the user's explicit request without waiting for complete native acceptance. Prior releases remain available. Reconcile active work before rollback; preserve configuration, histories and uncertain-outcome receipts. Personal noncommercial local use is free under the included EULA. Commercial licensing requires separate authorization; all third-party licenses and corresponding-source obligations remain intact.
