# Koder CLI 0.4.19

This release integrates SolidCraft parametric CAD into the CLI. Windows x64 and macOS Apple silicon/Intel installers share the versioned runtime archive. Packages, update metadata and tutorials are published on GitHub; official websites are outside this release.

## SolidCraft in the existing task flow

- The package includes the unmodified SolidCraft 0.23.0 command-line executables, pinned inventories and upstream licenses. It does not run SolidCraft's installer or modify another AI client's configuration.
- `koder cad enable` enables the connection for the current project. `status`, `verify`, `test` and `disable` are available in the CLI, `/cad` and Setup. The built-in modeling Skill is available by default and can be switched off independently.
- CAD tasks use the existing Core MCP host, BYOK provider, approvals, cost limits and cancellation. Each turn gets a private headless model. Concurrent tasks share Core infrastructure without sharing the model; save `.solidcraft` and reopen it explicitly in later turns.
- Modeling guidance uses the live command schemas and upstream reference material, then measures the design and saves editable and requested exchange files. Delivery checks recognize CAD artifacts and post-edit measurements rather than requiring a software test suite. Failed or unknown mutations invalidate old evidence without replaying the operation.
- Client-owned MCP connections are hidden from other clients, removed when their owner closes and never restored after a runtime restart. Discovery no longer starts a second handshake for a connection that is already being added. Failed cleanup remains visible.

## Install and try

Use the installers attached to [cli-0.4.19](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.19), or run `koder update` from a recent supported release. Reopen the terminal and check `koder --version` for `0.4.19`. If an old updater rejects the larger archive, use the current installer once; do not erase your user configuration.

In a project, run `koder cad enable`, `koder cad verify`, `koder cad test`, then `koder`. Follow the [English CAD tutorial](SOLIDCRAFT.en.md) or [Chinese hands-on tutorial](SOLIDCRAFT.zh.md). The existing 1,800-lesson Chinese classroom, 30 English lessons, mail, GitHub integration, Skills and unlimited task rounds remain available.

## Verification and limits

Native Apple-silicon checks use the actual SolidCraft executable through Koder's Core with scripted model inputs: parameterized 20 × 10 × 5 mm plate, 1,000 mm³ measurement, editable save, STEP/STL export, CPU PNG, reopen and parameter edit to 1,500 mm³. Separate concurrent tasks create and measure different models. Approval refusal, workspace revocation, forbidden export paths, package integrity and Core lifecycle checks are recorded separately.

Windows x64 and Intel macOS payloads are included and hash-verified; native execution on those devices remains **NOT_RUN** here and belongs to the beta team. Linux has no bundled SolidCraft executable; a compatible installed runner can be configured explicitly. These checks do not establish paid-model quality, every upstream operation, manufacturing suitability or CAD GUI compatibility. The MCP operation deadline remains 180 seconds, with cancellation and UNKNOWN receipts intact.

Earlier real-account, native GUI, notification and unsigned macOS locked-use limitations remain unchanged. Initial failing checks are retained in the local release evidence rather than relabeled as passes. [SolidCraft licenses and source](../licenses/solidcraft/NOTICE) are separate from Koder's own license. Roll back with the pinned [0.4.18 release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.4.18), retaining project files and uncertain-effect receipts.
