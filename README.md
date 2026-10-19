# Koder CLI 0.4.0-preview.2

Downloadable CLI preview with the context-budget and API recovery changes, request deadline handling, and Windows file-identity fix. The package also includes the current shared-memory, personalization, authorized-file, app-connection and MCP implementation. These integrations have the acceptance limits listed below.

Use the installer assets attached to this release. The Shell, PowerShell, CMD and installed updater routes all use this exact GitHub tag. Read [Koder-EULA-1.0](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.2/EULA.md) before installing; acceptance is explicit. The Koder-owned implementation is proprietary. Legacy published CLI source and third-party components retain their original licenses and notices. New development source is not published.

## Verified for this preview

- The 4,647,395-byte archive and its manifest match SHA-256 `2d4e162f5800414e24be816b0aeea3d929f1e4a35cd64c39644eae7238dc9bbc`. All 3,838 planned kernel members match their manifest. The latest CLI context/API and file-path fixes are present.
- Independent macOS installation from the actual old 0.3.0 archive, upgrade to 0.4.0-preview.2, saved provider and memory preservation, and an installed CLI request to a local HTTP model endpoint passed. This does not represent a paid-provider test.
- Updating from the persisted installation channel and uninstalling without an agreement-acceptance record passed. Declining the agreement prevents installation. Final version/channel changes are separately checked against the accepted package.
- Complete legacy GPL and third-party license copies are included, including the repaired Open Code Review license. Two experimental user-supplied skill texts are omitted; original Koder interface notes take their place. Preference learning and evolution remain opt-in.

## Known limits

- The full regression run before the final version/channel increment reported **338 passed, 1 failed, 3 skipped** (342 tests, exit 1). The failure was the 250 ms version-startup timing assertion: 594.367625 ms on a heavily loaded build host. The assertion was retained; performance acceptance remains open. Three configured-Core integration tests were skipped. Final agreement/uninstall and installer checks passed (3 and 5 tests respectively).
- Windows-native installation and the Windows file-access fix still need real-device acceptance. Live WeChat, Feishu, WeCom, Gamma, paid model providers, a second physical device and production Core deployment were not tested.
- Cross-device memory and proactive services require a compatible configured Core service and identity. Including their implementation does not establish deployment or end-to-end acceptance. System permissions still require user and operating-system authorization.

This is a **prerelease**, not a stable-release acceptance claim. An earlier `0.4.0-preview.1` artifact appeared on the website with a different hash, so this final package uses a new version. Use this release's version-specific links and [SHA256SUMS](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.2/SHA256SUMS). GitHub's automatic source archives for this tag contain distribution documentation only.


This tag contains distribution documentation only. Install Koder from the release assets. The implementation is proprietary; legacy GPL source remains on the main branch under its original terms.
