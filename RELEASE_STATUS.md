# CLI installer and validation status

Updated 2026-10-19. **[Koder CLI 0.4.0-preview.2](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.0-preview.2) is an installable preview.** The GitHub README commands select this exact release. The legacy public development source on `main` remains 0.3.1 under its original terms.

| Item | Result |
| --- | --- |
| New GitHub installer | 0.4.0-preview.2, 4,647,395 bytes |
| Archive SHA-256 | `2d4e162f5800414e24be816b0aeea3d929f1e4a35cd64c39644eae7238dc9bbc` |
| License | Koder-EULA-1.0 for Koder-owned new distribution; third-party and legacy rights retained |
| Independent installation | macOS: old 0.3.0 install, upgrade, provider/memory preservation, installed local HTTP model request, updater and uninstall passed |
| Package integrity | Manifest and 3,838 planned kernel members verified; complete GPL and third-party notices retained |
| Full regression baseline | 342 tests: 338 passed, 1 startup-timing failure, 3 configured-Core skips; exit 1 |
| Final focused checks | Agreement/uninstall 3 passed; installer 5 passed; version/channel delta independently verified |
| Native/live acceptance | Windows, second physical device, live messaging, Gamma, paid providers and deployed Core remain unverified |

Download the assets from the linked release and compare [SHA256SUMS](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.4.0-preview.2/SHA256SUMS). The [machine-readable release record](releases/0.4.0-preview.2.json) lists each asset's size and digest. Source, installer, local validation and live acceptance are distinct.

The baseline startup failure recorded 594.367625 ms against a 250 ms limit on the loaded build host. A separate single-sample run was faster, but that is not a performance pass. The three skipped tests require configured Core lease, host-review and formal-service integrations. No tests were removed to obtain the result. Final changes after the full run were reviewed and checked separately; the full suite was not repeated.

Shared memory, personalization, daily reflection, proactive services, applications and MCP code are included in the CLI dependency closure. Cross-device and channel behavior still depends on configured identity, services and credentials. This preview does not claim live communication or multi-device acceptance. Computer access requires user authorization and applicable system permissions.

## License and provenance

Read [EULA.md](EULA.md), [license scope](LICENSE), [third-party notices](THIRD_PARTY_NOTICES.md) and [upstream credits](OPEN_SOURCE_CREDITS.md). The new proprietary development tree is not published. The release tag contains distribution metadata only; install from its assets. Readable runtime files inside an installer do not grant new open-source rights. Existing GPL source and third-party terms are preserved.

The old 0.3.0 archive had a truncated Open Code Review license. The new archive contains the complete checked copy. The experimental user-provided shared-memory and personalization skill texts are excluded while redistribution terms remain unresolved; original Koder interface notes are packaged instead. Learning and self-evolution require opt-in.

## Earlier download observations

At the initial 2026-10-19 check, the website selected 0.3.0, SHA-256 `281e31d96ce1764a0da8c7fbd08633118b21a04b595703f81d304a7f60f78f94` (735,988 bytes). Later that day, its manifest selected an earlier 0.4.0-preview.1 archive, SHA-256 `1793a21cdf5519a8cd0db8edaa60a26e8bee38480cfb94b55ab848340e0326eb`. These observations are historical, not a claim about every current website cache.

This GitHub release uses the distinct version 0.4.0-preview.2 and a fixed tag URL. Running an old installed updater may still follow its old channel; use the new README installer commands to move to this preview. Website publication is a separate channel. Do not label the older package as this release by changing a manifest alone.
