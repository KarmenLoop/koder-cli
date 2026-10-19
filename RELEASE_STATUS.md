# CLI installer and validation status

Current GitHub preview: **[Koder CLI 0.4.0-preview.3](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.3)**. The README commands and repository `install/` entrypoints resolve the current published preview. The legacy public source remains 0.3.1 under its original terms; it is not the new proprietary download.

| Item | Result |
| --- | --- |
| Installer archive | 0.4.0-preview.3, 4,652,524 bytes |
| SHA-256 | `d7b7af255a9f172f44c56812105f082087bd04efdced91a57f1b793557ec729c` |
| GitHub updating | `koder update --check` checks only; `koder update` verifies and installs a newer version |
| One-time migration | Old 0.3.x / preview.1 / preview.2 users run the new README installer once |
| Independent installation | macOS: actual old 0.3.0 to current preview, model settings and memory retained, installed local model request, same-version no-op and uninstall passed |
| Integrity | 215 source files checked; 3,838 kernel files and license copies unchanged; all three installer hashes verified |
| Full serial regression | 352 tests: 349 passed, 0 failed, 0 cancelled, 3 configured-Core skips; exit 0 |
| Initial parallel run | 344 tests reported: 336 passed, 2 failed, 3 cancelled, 3 skipped; exit 1; preserved below |
| Live/platform limits | Windows, second physical device, live messaging/Gamma, paid providers and production Core remain unverified |

The initial parallel run encountered a 872.925208 ms version-startup measurement against the original 250 ms limit, a Discord heartbeat timing assertion, and 60-second timeouts in three test files. The same complete suite then passed serially with unchanged assertions and timeout. This resolves the serial functional check; parallel-load performance is still not accepted. No tests were removed or thresholds relaxed.

The update check uses a bounded GitHub metadata request and reports previews explicitly. Before execution it verifies the selected installer hash; the installer compares the checked version and archive hash and verifies the downloaded archive. Same or older versions are not reinstalled. Update tests confirm failures before replacement leave existing installation records and memory unchanged. Agreement consent is reused only for identical text. Updates run only on request.

[Asset hashes and validation record](releases/0.4.0-preview.3.json) · [Release notes](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.3) · [Published update channel](updates/koder-cli-latest.json)

## License and provenance

Read [EULA.md](EULA.md), [license scope](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md) and [upstream credits](OPEN_SOURCE_CREDITS.md). The adopted proprietary development tree is not published. The tag contains distribution metadata only; install from its assets. Existing GPL source and third-party terms remain intact. Complete legacy GPL and Open Code Review license copies are retained. The two experimental user-supplied skill texts remain excluded pending redistribution terms; original Koder interface notes are packaged instead. Preference learning and evolution are opt-in.

## Earlier downloads

The original website archive was 0.3.0, SHA-256 `281e31d96ce1764a0da8c7fbd08633118b21a04b595703f81d304a7f60f78f94`. An earlier website preview.1 used SHA-256 `1793a21cdf5519a8cd0db8edaa60a26e8bee38480cfb94b55ab848340e0326eb`. GitHub preview.2 used SHA-256 `2d4e162f5800414e24be816b0aeea3d929f1e4a35cd64c39644eae7238dc9bbc`. These remain historical observations; the GitHub channel now identifies this distinct preview.3 package. Website publication is a separate channel.
