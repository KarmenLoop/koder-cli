# Koder CLI 0.4.5

This compatibility update raises the updater's package-size limit from 100,000,000 bytes to a bounded 512 MiB. The complete Windows-MCP bundle exceeds the old limit. Manifest structure, exact archive name, agreement checks and installer SHA-256 verification remain required. All 0.4.4 features are retained.

## Upgrading from 0.4.4 or earlier

An old updater may report that the update manifest is invalid. Its local limit cannot be changed by the server. Run the current official installer once to upgrade in place: use the [Windows CMD installer](https://karmenloop.com/install/koder-cli.cmd), [PowerShell installer](https://karmenloop.com/install/koder-cli.ps1) or [macOS installer](https://karmenloop.com/install/koder-cli.sh), following the [installation guide](INSTALLATION.md). Do not uninstall or delete your data. The normal installer preserves separate configuration and history. Read and accept the license when prompted; this does not enable computer or mail permissions.

Afterward, `koder --version` should report 0.4.5 and `koder update --check` can read the larger package manifest. Version 0.4.5 and later can use the normal update command within the new bound.

## Included capabilities and guides

[0.4.4 feature notes](RELEASE-0.4.4.md) describe bundled Windows-MCP and private Python, bounded installation recovery, native mailbox sending and background inbox alerts, and default-on Headroom. [English user guide](USER-GUIDE.en.md) · [Chinese user guide](USER-GUIDE.zh.md) · [Mail](MAIL-DELIVERY.en.md) · [Windows-MCP](WINDOWS-MCP-BUNDLED.en.md) · [Headroom](HEADROOM.en.md). Thirty lessons, eight bilingual terminal manuals and the complete command reference remain included.

## Evidence and limits

The real 0.4.3 updater rejected the 0.4.4 manifest before installing; that failure is retained. The new regression checks the real CLI against a 111,893,848-byte manifest and rejects over-limit, zero, negative and fractional sizes without executing an installer. Final artifact and public migration results are recorded separately.

Native Windows 10/11 cold installation/update, MCP GUI, UAC/ConPTY/IME, OS login/reboot/notification display, real mail accounts and model quality remain NOT_RUN for this release. macOS Intel-device checks and previous 8K-context failures remain separate. Published at the user's explicit request without waiting for full native acceptance. Prior releases remain available for rollback; preserve settings, histories and uncertain-effect receipts.
