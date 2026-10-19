# Koder CLI 0.4.0-preview.3

This preview fixes GitHub self-updates. `koder update --check` discovers the published channel without installing. `koder update` compares versions, verifies the installer and package SHA-256, and installs a newer release while retaining model settings and memory. Same-version and older releases are left alone. Official installations no longer stay pinned to their original release tag; an explicit custom mirror still works.

The repository's Shell, PowerShell and CMD install entrypoints now resolve the current GitHub preview. **If you are on 0.3.0, 0.3.1, preview.1 or preview.2, run the updated [README installer command](https://github.com/KarmenLoop/koder-cli#install-the-preview) once.** Older updater code cannot acquire this fix until it is upgraded. Afterward use `koder update --check` and `koder update`.

Read [Koder-EULA-1.0](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/EULA.md) before installing. The Koder-owned distribution is proprietary and downloadable for end users. New development source is not published. Existing public GPL source, third-party licenses and notices keep their original terms.

## Validation

- Actual archive: 4,652,524 bytes; SHA-256 `d7b7af255a9f172f44c56812105f082087bd04efdced91a57f1b793557ec729c`. All 3,838 planned kernel files and all license copies match the previously verified package. The 215-file candidate was checked against its fixed source manifest.
- Full serial regression: **352 tests, 349 passed, 0 failed, 3 skipped**, exit 0, with the original assertions and 60-second test timeout retained. The initial parallel run is preserved: 336 passed, 2 failed, 3 cancelled and 3 skipped; it showed startup/heartbeat timing failures and three file timeouts on the loaded build host. Passing serial tests does not establish parallel-load performance.
- Independent macOS install from the actual old 0.3.0 archive, upgrade, saved model settings and memory, installed local HTTP model request, same-version update no-op and uninstall passed. Update tests also cover a newer version, numeric preview ordering, transient and persistent HTTP failures, modified installers and changed release metadata.
- The package manifest now contains the exact installer hashes. Both installers compare the expected version and archive hash before replacing an existing installation. A changed agreement requires explicit acceptance.

## Limits

This is a preview. Native Windows installation, second-device operation, live WeChat/Feishu/WeCom, Gamma, paid model providers and production Core services remain unverified. Three configured-Core tests were skipped. Learning and computer capabilities still require the user's selected authorization and applicable operating-system permission.

Download the installer assets and compare [SHA256SUMS](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.3/SHA256SUMS). GitHub's automatic source archives for this tag contain distribution documentation only. The previous preview.2 remains available as a distinct release.


This tag contains distribution documentation only. Install Koder from the release assets. The implementation is proprietary; legacy GPL source remains on the main branch under its original terms.
