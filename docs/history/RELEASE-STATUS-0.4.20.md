# Release status — 0.4.20

This release integrates Awesome LLM Apps references and Koder-native methods into the existing runtime. Publication is authorized on GitHub only; no official website files or deployments are part of this release.

The integration is on by default for relevant tasks and can be disabled through its CLI or existing Setup controls. Local reference inspection and retrieval require no model. Agent operations retain the existing provider, approval, workspace, budget and cancellation owners.

The CLI compatibility suite passed 125 tests. After correcting a pre-existing provenance expectation without changing product provenance, the kernel suite passed 56 tests; original failures remain in local evidence. Final targeted checks passed 13 tests, including parent-off plugin registration and model-free retrieval/check commands. Release artifacts undergo source/hash checks and isolated installer/update verification separately.

Upstream dependencies, accounts, UIs and paid-model quality are NOT_RUN. Windows and Intel Mac native execution remain beta acceptance. Existing GUI, account, resident-service and unsigned locked-use limits remain; inclusion of the reference library does not close them. SolidCraft binaries from 0.4.19 are retained.

See [release notes](docs/RELEASE-0.4.20.md), [中文说明](docs/RELEASE-0.4.20.zh.md) and [the hands-on guide](docs/AWESOME-LLM-APPS.en.md). Initial failures remain in the local task evidence. The previous status is preserved in [the 0.4.19 record](docs/history/RELEASE-STATUS-0.4.19.md).
