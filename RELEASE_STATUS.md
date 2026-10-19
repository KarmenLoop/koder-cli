# Koder CLI 0.4.0-preview.6 release status

Preview release with verified assets. Publication and artifact checks are recorded in the release metadata.

Automatic update activation uses a single supervisor with fresh workers. Existing chat history, workspace, mode, named session, buffered input and volatile no-memory conversations are continued. Running gateways wait for admitted tasks, approvals and outbound replies, then release original Core ownership before reconnecting with retained bindings. Recently admitted message IDs and app/file effect receipts prevent update-induced replay. Disabled channels stay disabled. Configuration and memory directories are not replaced.

Updates still compare the official GitHub feed, verify installer/package hashes, and check the actual installed entry before activation. A replacement that cannot start before receiving work falls back once. A worker that has accepted work is never automatically replayed after a crash. An ordinary shell update activates the new version and exits; open chats and gateways resume independently. A pending approval delays gateway activation rather than silently authorizing it.

Migration: preview.5 and older processes do not implement this restart protocol. Start preview.6 once after that initial upgrade; subsequent upgrades are automatic. No settings reset or channel rebinding is required for migration. Platform-expired/revoked credentials can still require platform authorization.

Validation: real subprocess update/continuation, local model server, local WeChat HTTP protocol fixture and serial regression suite. These are local fixture results, not native Windows, real WeChat/Feishu/WeCom account or cross-device acceptance. Those environments remain unavailable. New implementation stays proprietary under the existing EULA; bundled third-party notices and legacy source remain unchanged.
