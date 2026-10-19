# CLI source and installer status

Checked on 2026-10-19. Source, package metadata and a published installer are separate artifacts.

| Item | Observed version/status | Evidence |
| --- | --- | --- |
| Public CLI source | 0.3.1 | [`package.json`](package.json) |
| Default installer manifest | 0.3.0 | [`koder-cli-latest.json`](https://karmenloop.com/install/koder-cli-latest.json) |
| Package named by that manifest | `koder-cli-0.3.0.tgz`, 735,988 bytes; its internal package version is 0.3.0 | Download read and SHA-256 checked on 2026-10-19 |
| GitHub Releases | No published release at the check time | [Releases](https://github.com/KarmenLoop/koder-cli/releases) |
| New shared-memory/personalization and capability work | Unreleased; acceptance incomplete | Not an installable-version claim |

Verified installer SHA-256:

```text
281e31d96ce1764a0da8c7fbd08633118b21a04b595703f81d304a7f60f78f94
```

The README install commands fetch the website's manifest and archive. Updating GitHub source or its version string does not replace that archive. At this check, running the documented installer still selected 0.3.0; the installer download was not a newer build mislabeled by the terminal.

The attribution update adds [upstream credits](OPEN_SOURCE_CREDITS.md), full licence/NOTICE copies and explicit source/install version information. It does not replace the archive, create a new binary release, or claim that the unreleased features are available.

Before the next installer update, the following must be resolved:

- Include the complete pinned Open Code Review Apache licence and the corresponding resource-manifest digest. The inspected old archive contains a truncated copy; [the full notice is available here](licenses/open-code-review/LICENSE).
- Resolve the GPL CLI / in-process proprietary-kernel distribution boundary without silently changing licences or removing upstream rights.
- Complete the original account/channel owner, daily-reflection/proactive runtime integration and required platform/device acceptance for features included in the selected release scope. Local tests alone do not establish live channel or cross-device acceptance.
- Build from a fixed accepted source, verify the actual package and installation/upgrade path, then update the archive, manifest, download pages and release notes together. Keep a unique version, digest and rollback record for each published artifact.

Until that release is validated, 0.3.0 remains the observed installer version. A new documentation commit must not be presented as a new installed CLI build.
