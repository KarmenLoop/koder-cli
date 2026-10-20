# Koder CLI 0.4.0-preview.10 release status

Preview.10 adds explicit Xiaomi MiMo V2.6 pay-as-you-go and Token Plan setup, Pro/Flash model IDs, the official completion-budget field, and the Anthropic-compatible endpoint/header mapping. Credential-class mismatches fail locally before a request. Custom proxy endpoints and explicit account limits are preserved. Streaming/tool-call/reasoning-history checks are local fixture evidence. Authenticated Xiaomi service and the reported Windows device remain unverified.

Selecting Hermes with a saved official MiMo model creates a Koder-managed Hermes profile. Its selected model and endpoint are explicit; the key stays in the child environment. Existing Hermes configuration is not overwritten or copied. The pinned installed Hermes runtime is checked against a local model fixture and an actual synthetic-file read; this does not establish Xiaomi account access.

The installer keeps the preview.9 post-consent progress, bounded existing-Node probe, transfer deadlines, checksum gates and official mirror fallback. The EULA and optional permissions are unchanged.

## Previous preview.9 evidence


Installers ask for `accept` on a real terminal. Windows package checksums use the built-in .NET SHA-256 implementation, so installation does not depend on Get-FileHash being discoverable through the PowerShell module path. Windows now asks again on an empty or unrecognized answer and trims spaces around an explicit answer. `decline` or Ctrl+C cancels before download. The Mac/Linux shell installer also cancels on an empty Enter. `KODER_EULA_ACCEPT=1` remains the explicit unattended acceptance and is not implied by another value. PowerShell 7.6.7 PTY regression reproduces the old empty-answer cancellation and verifies the repair. Native Windows installer checks are published separately in the [Windows installer acceptance workflow](https://github.com/KarmenLoop/koder-cli/actions/workflows/windows-installer.yml); they do not establish acceptance on user devices or real channels.

Preview candidate; publication and artifact verification are recorded separately.

Automatic update activation uses a single supervisor with fresh workers. Existing chat history, workspace, mode, named session, buffered input and volatile no-memory conversations are continued. Running gateways wait for admitted tasks, approvals and outbound replies, then release original Core ownership before reconnecting with retained bindings. Recently admitted message IDs and app/file effect receipts prevent update-induced replay. Disabled channels stay disabled. Configuration and memory directories are not replaced.

Updates still compare the official GitHub feed, verify installer/package hashes, and check the actual installed entry before activation. A replacement that cannot start before receiving work falls back once. A worker that has accepted work is never automatically replayed after a crash. An ordinary shell update activates the new version and exits; open chats and gateways resume independently. A pending approval delays gateway activation rather than silently authorizing it.

Migration: preview.5 and older processes do not implement this restart protocol. Start preview.6 once after that initial upgrade; subsequent upgrades are automatic. No settings reset or channel rebinding is required for migration. Platform-expired/revoked credentials can still require platform authorization.

Validation: real subprocess update/continuation, local model server, local WeChat HTTP protocol fixture and serial regression suite. These are local fixture results, not native Windows, real WeChat/Feishu/WeCom account or cross-device acceptance. Those environments remain unavailable. New implementation stays proprietary under the existing EULA; bundled third-party notices and legacy source remain unchanged.

Previous application regression: serial 400 tests, 397 pass, 0 fail, 3 existing Core skips; focused installer/consent 18 pass. EULA unchanged from preview.7. The package includes the step-by-step installation guide and this release-status document.

Preview.9 addresses silent waiting after consent. It immediately reports the accepted/runtime-check stage, bounds an existing Node process probe to five seconds, and reports each network phase and progress every five seconds. Each download source has a 120-second limit (explicit KODER_DOWNLOAD_TIMEOUT_SECONDS may set 1–600 seconds). A stalled transfer fails with a network/proxy diagnostic; it does not record an installed update. The EULA and optional permissions remain unchanged. Native Windows stall and happy-path evidence is recorded separately.

Windows release and Node runtime downloads use byte-identical official website mirrors with official-host fallback. Explicit custom download bases are respected, and checksum failures are not retried against a different source.


## Preview.10 validation

Full local regression: 409 tests, 406 pass, 0 fail, 3 existing Core skips, exit 0. Ten MiMo protocol/ACP checks and the Token Plan/Flash terminal setup interaction passed. The installed pinned Hermes 517b5e10 runtime completed a real local-file read and a second model turn against a local HTTP/SSE fixture, retaining reasoning history. Its upstream asynchronous title callback emitted a shutdown RuntimeWarning; the actual tool result and completed response were verified. Authenticated Xiaomi service and the reported user device remain unverified.

[Native Windows candidate acceptance](https://github.com/KarmenLoop/koder-cli/actions/runs/39395431998): nine installer checks plus ten checks against the actual installed MiMo package passed. Public-command validation is recorded separately after publication.

Package SHA-256: `0c9054de7fb1815385bccb0425b10e955854ccb5f1f69b97fa53a3d72a4632a8`.
