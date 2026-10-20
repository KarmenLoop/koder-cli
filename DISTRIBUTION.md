# Distribution and licensing policy

Policy revised on 2026-10-20: future Koder-owned releases are proprietary software for end-user installation and use. Users may download and install official builds and use them for personal, noncommercial activities under [Koder-EULA-1.1](EULA.md). Commercial use, paid client work and internal organizational work or deployment require separate prior written authorization. The personal license does not permit secondary development or changes to proprietary implementation code. Personal, noncommercial local use remains free; users can connect their own model/API provider.

## Public downloads and private development

The public repository hosts product instructions, the end-user agreement, release information, third-party notices and legacy source. Future proprietary development source is not to be uploaded here. New downloadable builds must come from an accepted private development source and carry the agreement and all applicable notices. A public download does not mean an open-source grant; readable runtime scripts do not themselves grant permission to develop or redistribute the proprietary implementation.

Old public commits and copies already distributed are not recalled by this policy. In particular, the CLI source through [54e17fcf](https://github.com/KarmenLoop/koder-cli/commit/54e17fcf484638f6cf22a48b52a0533c82816191), including the public 0.3.1 source tree, remains under [GPL v3](licenses/legacy-cli/GPL-3.0.txt) with the existing [limited kernel permission](LICENSE-EXCEPTION.txt). The existing `package.json` continues to describe that legacy source. Its license field must not be changed to claim that an old GPL copy has lost its rights.

The current download and installation links remain available. The new terms apply only to distributions that expressly adopt them and do not retroactively change earlier accepted terms. See [RELEASE_STATUS.md](RELEASE_STATUS.md) for the last verified installer information.

## Requirements for a new proprietary build

- Identify the exact release version, accepted source revision and artifact digest. Include `EULA.md`, identify `Koder-EULA-1.1` and its digest in the release/license manifest, and clearly present the terms before acceptance. An older package is not relabeled by this document.
- Apply proprietary terms only to portions whose relevant copyright holders have authorized them. Preserve original third-party licenses, attribution, NOTICE files, and any applicable source obligations. If a component cannot be included on that basis, resolve its permission or replace/exclude it before distribution.
- Set the new package's license metadata to the included agreement only when it is actually the new proprietary distribution. Carry a component manifest that explains any separately licensed material; do not use the EULA as a blanket replacement for dependency licenses.
- Keep source code and private credentials out of the public release preparation tree. Publish the accepted installer, checksums, user documentation and required license material. Release the source of third-party components when their licenses require it; proprietary policy does not remove that duty.
- Complete feature, platform, installation and upgrade acceptance. Update the actual artifact, download manifest and release notes together, with a rollback record. The current product acceptance holds still apply.

## Rights retained by users

Users can share official download links, retain permitted personal backups, install official updates and use supported skills, plugins, configuration and MCP interfaces. Their own files, code and outputs are not relicensed by Koder's end-user agreement. No broad computer access, data collection or message-sending permission is inferred from agreement acceptance.

The new agreement does not remove rights granted for previously published GPL versions or for third-party components. See [license scope](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md).

## Company licensing and private repositories

Run koder business or contact [info@karmenloop.com](mailto:info@karmenloop.com) about company licensing and dedicated private repository delivery. A separate written agreement defines users, deployment, repository contents, access, maintenance, support and any development rights. An inquiry or repository access does not itself grant commercial, source or modification rights. GitHub stars are optional and never gate installation or licensed features. User-provided private reference collections are excluded from public packages and release preparation trees.


The official reference library is a separate collection of MIT-licensed Koder adaptations. Those materials retain their original license rights and required notices. Application license restrictions do not override the reference licenses. GitHub stores encrypted bundles with opaque names; the official server returns selected excerpts. Unknown-license materials are withheld. See docs/REMOTE-RESOURCES.md.
