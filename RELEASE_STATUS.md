# Koder CLI 0.4.0-preview.8 release status

Installers ask for `accept` on a real terminal. Windows now asks again on an empty or unrecognized answer and trims spaces around an explicit answer. `decline` or Ctrl+C cancels before download. The Mac/Linux shell installer also cancels on an empty Enter. `KODER_EULA_ACCEPT=1` remains the explicit unattended acceptance and is not implied by another value. PowerShell 7.6.7 PTY regression reproduces the old empty-answer cancellation and verifies the repair. Native Windows installer checks are published separately in the [Windows installer acceptance workflow](https://github.com/KarmenLoop/koder-cli/actions/workflows/windows-installer.yml); they do not establish acceptance on user devices or real channels.

Preview candidate; publication and artifact verification are recorded separately.

Automatic update activation uses a single supervisor with fresh workers. Existing chat history, workspace, mode, named session, buffered input and volatile no-memory conversations are continued. Running gateways wait for admitted tasks, approvals and outbound replies, then release original Core ownership before reconnecting with retained bindings. Recently admitted message IDs and app/file effect receipts prevent update-induced replay. Disabled channels stay disabled. Configuration and memory directories are not replaced.

Updates still compare the official GitHub feed, verify installer/package hashes, and check the actual installed entry before activation. A replacement that cannot start before receiving work falls back once. A worker that has accepted work is never automatically replayed after a crash. An ordinary shell update activates the new version and exits; open chats and gateways resume independently. A pending approval delays gateway activation rather than silently authorizing it.

Migration: preview.5 and older processes do not implement this restart protocol. Start preview.6 once after that initial upgrade; subsequent upgrades are automatic. No settings reset or channel rebinding is required for migration. Platform-expired/revoked credentials can still require platform authorization.

Validation: real subprocess update/continuation, local model server, local WeChat HTTP protocol fixture and serial regression suite. These are local fixture results, not native Windows, real WeChat/Feishu/WeCom account or cross-device acceptance. Those environments remain unavailable. New implementation stays proprietary under the existing EULA; bundled third-party notices and legacy source remain unchanged.

This candidate: serial 400 tests, 397 pass, 0 fail, 3 existing Core skips; focused installer/consent 18 pass. EULA unchanged from preview.7. The package includes the step-by-step installation guide and this release-status document.
