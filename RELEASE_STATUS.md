# Koder CLI 0.4.0-preview.18

Preview.18 repairs damaged execution-permission records only after a fresh explicit choice, backs up their original bytes, and reads valid UTF-8 BOM records. The full-access prompt no longer fails before the user can answer in this recovery case. Unsafe or inaccessible files remain blocked. Animated colors now use valid RGB sequences rather than malformed escapes. Automatic installer failures are reported without stopping the current chat.

The repair candidate passed the original CLI and MCP lifecycle suites on hosted Windows, macOS and Linux, plus a real Windows terminal approval/recovery check. Windows stress checks covered 20 cold compile-cache starts, 10 WeChat update handoffs and four full animation/skip suites with the original deadlines. Final versioned-package and public-download checks are recorded separately; earlier failures remain evidence rather than being erased. A PowerShell-to-Node pipeline used only by installer test fixtures was replaced with the real installer's argument transport, keeping script bodies and assertions intact.


Preview.17 introduced automatic updates for consenting, installed interactive sessions. Discovery runs in the background; installation waits for tasks, queued input and drafts to clear, verifies the new entry, and resumes the saved conversation. `koder update auto off` disables it. Changed license text is never accepted automatically. Concurrent manual and automatic installation attempts share one local lease.

Windows MCP readiness publication now retries short filesystem sharing denials within a fixed bound and closes the owned Core if publication still fails. MiniMax official host/protocol normalization and fixed-code business errors are corrected. Shared timeout and network categories survive the public diagnostic boundary. Version queries no longer load model adapters.

Provider protocol fixtures are not authenticated account acceptance. Dedicated MiniMax API/Plan test credentials were unavailable. Historical Windows startup, animation and WeChat failures remain recorded; no benchmark threshold or privacy check was relaxed.

This build includes Windows CMD and PowerShell download progress, explicit license acceptance, verified extraction under paths with spaces or Chinese characters, private Node.js 22.23.3 selection when needed, and update restart and rollback protection. Download total time defaults to a maximum of 100000000 seconds; separate stalled-transfer checks remain bounded and cancellable.

## Temporarily unavailable integrations

Known integration bugs prevent use of MiMo Token Plan, Kimi API, Kimi Code, DeepSeek, Alibaba Token Plan, Volcano Coding Plan, and Volcano Ark API. Their setup entries are gray and cannot be selected. Existing profiles are kept, but activation, model tests, refresh and task execution stop before network access. No backup engine or billing-route switch happens automatically. Re-enablement requires separate acceptance.

MiMo metered API, Alibaba Coding Plan and unrelated providers retain their own availability. Protocol fixtures establish request/response behavior; they do not establish paid-account access. Run koder model test --tools only for an available, configured service, with awareness that the provider may charge for the requests.

## Included features

- Thirty interactive lessons and eight complete text editions: Chinese and English for CMD, PowerShell, macOS and Linux. The website manuals are generated from the same lessons.
- Smart approval for recognized low-risk checks and ordinary project edits, with explicit once, remembered-action and full-workspace controls for sensitive tasks. Permissions can be inspected, downgraded and revoked. OS and optional privacy grants remain separate.
- Local memory and opt-in personalization, shared-memory identity-scoped cursors, and the configured Core service integration. No API keys or execution authority are synchronized.
- Optional six-second celebrations that skip immediately, independent birthday/music/language settings, local private references and the licensed encrypted remote workflow library. Unknown-license collections are not distributed.
- Complete bilingual consumer privacy material, personal noncommercial terms under Koder-EULA-1.1, company-licensing and dedicated-private-repository inquiry details, a voluntary GitHub star link and a feedback template that never sends email by itself.

The application introduces KARMEN LOOP and its task kernel without exposing development sources or credentials. Runtime distribution is governed by the included license and third-party notices; it is not a promise of unextractable code or an operating-system firewall.

## Installation help

See [installation](docs/INSTALLATION.md), [troubleshooting](docs/TROUBLESHOOTING.md), [provider availability](docs/PROVIDERS.md) and [Windows checks](docs/WINDOWS-INSTALL-CHECKS.md). Release-specific verification records distinguish isolated hosted tests, public readback and physical-device or paid-account evidence. The reporting user's Windows machine and authenticated accounts for the disabled services have not been tested.
