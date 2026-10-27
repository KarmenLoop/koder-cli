# Windows VM acceptance

The packaged-release workflow uses disposable Windows Server 2025 x64 runners. It downloads an exact GitHub release archive, verifies its SHA-256, and invokes the packaged runtime without a development-source fallback. It does not use existing local VMs, user accounts, mailbox passwords, or paid model credentials.

## Run the checks

From a checkout with GitHub Actions permission:

```sh
gh workflow run windows-installer.yml --repo KarmenLoop/koder-cli \
  --ref main -f phase=windows-vm-install -f release=cli-0.5.11
gh workflow run windows-installer.yml --repo KarmenLoop/koder-cli \
  --ref main -f phase=windows-vm-runtime -f release=cli-0.5.11
```

The installer phase runs native PowerShell 5.1 and CMD through ConPTY. It covers a clean install, spaces and Chinese characters in paths, managed Node installation, consent refusal, timeout cleanup, public GitHub downloads, and preservation of the previous installation after a failed update. The public-download case requires a published release.

The runtime phase covers concurrent sessions, tasks beyond 16 tool rounds, mailbox state locking and recovery, loopback TLS SMTP/IMAP transport, native notification submission and refusal, and the bundled Windows MCP through Koder's transport. Its GUI check opens an owned WinForms fixture, observes the window, types a unique value, clicks Save, and verifies the file written by the button handler. A successful tool return alone cannot pass this check.

Notification refusal changes only the disposable runner's Koder preference and restores the previous value. The test does not enable system-wide notifications. A `submitted` receipt does not assert that a banner was visible or clicked.

## Evidence and limits

Each run uploads terminal logs, structured receipts, TAP output and owned-fixture screenshots. Failed attempts remain available with their run IDs. The release's `ACCEPTANCE-RESULTS.json` identifies the exact package and accepted runs.

The original concurrent-session case retains its 30-second limit. A separate, explicitly labeled timing diagnostic may allow more time to locate a failure; it cannot replace that acceptance result. Likewise, a fixture correction is recorded separately from a product fix.

Windows Server VM results do not establish physical Windows 10/11 behavior, real 163 or Gmail delivery, desktop login/reboot recovery, visible notification delivery, or paid-provider end-to-end quality. Those checks retain their own acceptance status.
