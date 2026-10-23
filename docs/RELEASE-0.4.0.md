# Koder CLI 0.4.0

Koder CLI 0.4.0 is the formal release based on the published preview.30 runtime. Windows CMD and PowerShell installers and the macOS/Linux shell installer are available alongside the shared CLI archive. This is a release-channel promotion with consistent version, installer, license-record and update metadata. It does not add the separate pricing or inline-reverse candidates.

## Included improvements

The preview.30 multiwindow fixes remain: independent default sessions when an older task owns a turn lock, cleanup after supervisor disconnects, process-instance checks for recycled PIDs, and accurate ownership notices. Existing models and BYOK routing, workspace history, permissions, tools, memory, Skills and all 30 tutorial lessons remain available.

## Install and update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd), then run it in Command Prompt. The PowerShell installer is [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1).
- macOS: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh` in Terminal. The installer selects the runtime for Apple silicon or Intel when needed.
- Existing users: run `koder update`, then `koder --version`. The expected version is `0.4.0`. Settings and stored history remain in place.
- These are CLI installers, not signed desktop EXE or DMG applications. The separate desktop product keeps its own release channel.

Read the [installation guide](INSTALLATION.md), [English guide](USER-GUIDE.en.md), [Chinese guide](USER-GUIDE.zh.md) and [independent task guide](MULTI-WINDOW.md). All eight printable tutorial editions are linked in the guides.

## Verification boundaries

The preview.30 baseline passed 353 local regressions. Its changed components passed 34 applicable subprocess checks on Windows Server x64 and Windows 11 ARM, plus nine real CLI-entry checks using a local synthetic model on each platform. Those are baseline results, not a claim that every 0.4.0 installer or Windows client path was rerun. The 0.4.0 release-channel, exact package, installation and public readback results are recorded separately in the release acceptance receipt.

PowerShell 5.1-only cold startup, Windows 10/Windows 11 x64 full client GUI/ConPTY/IME/UAC and authenticated external-provider/mailbox accounts remain incomplete. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as documented. Formal distribution does not turn these records into passes. No new writing score, complete REA replacement or optional external-engine concurrency certification is claimed.

Previous preview releases and their checksums remain available for rollback. This release does not remove user data, enable synchronization, grant new execution authority or accept a license on the user's behalf.
