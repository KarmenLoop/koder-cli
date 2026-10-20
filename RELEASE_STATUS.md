# Koder CLI 0.4.0-preview.11 release status

Preview.11 is published on GitHub and the official website. Native Koder is the default engine. The internal Hermes fallback is disabled and gray by default, requires an explicit internal opt-in, and is never selected automatically.

Koder directly implements Chat Completions, Anthropic Messages, and Responses tool loops. The dated catalog contains 32 visible presets and 71 curated model choices. Each of the 29 cloud presets has a native tool/result protocol fixture. Current OpenAI and Perplexity Agent routes use Responses. Gemini tool signatures, Anthropic thinking blocks, and provider reasoning survive actual harness tool continuation. MiMo pay-as-you-go and Token Plan endpoints remain separate; credentials are never silently moved between hosts.

Stopped Yi and obsolete Sonar entries are removed from the task picker. Batch, speech-only, safety-only, and models requiring a separate computer-use protocol are excluded from general task choices. Account model refresh preserves the active model and key. A text reply alone is reported as text-only evidence; `koder model test --tools` explicitly checks a harmless tool call and continuation.

Windows installation reports the initial download host immediately and displays progress before consent as well as during subsequent downloads. CMD uses a monitored PowerShell bootstrap. The extractor uses .cjs so TEMP may be inside an ESM project, including Chinese and space-containing paths. Download default and maximum are 100000000 seconds, including installer, runtime, and updater transfers. Progress, cancellation, checksums, explicit shorter deadlines, and rollback protection remain. The EULA digest and optional permissions are unchanged.

Validation passed 424 source tests with no failures and three existing skips, 66 website tests, and [13 native Windows installer cases plus 24 installed protocol/ACP checks](https://github.com/KarmenLoop/koder-cli/actions/runs/39405078337). All 74 production pages, 10 download assets, and eight tutorials were read back and compared with the accepted publication. The Windows public commands installed without preinstalled Node in Chinese paths.

These protocol checks do not establish authenticated provider access, account quota, or live model availability. The reporting user's Windows device and real messaging-channel accounts remain unverified. The unrelated desktop release gates are unchanged.

Package SHA-256: `7adf763f02b3f919225023a9232ce1610a06d8ef93f6a14e8f0db5d1b9cf8864`.

See [installation](docs/INSTALLATION.md), [provider setup](docs/PROVIDERS.md), [MiMo setup](docs/MIMO.md), and [Windows evidence](docs/WINDOWS-INSTALL-CHECKS.md). Earlier release history remains in the [GitHub releases](https://github.com/KarmenLoop/koder-cli/releases).
