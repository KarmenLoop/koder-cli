# Koder CLI 0.4.9

This release fixes live task input and makes incomplete tasks easier to diagnose. Windows CMD, PowerShell and macOS use the same versioned CLI runtime with shell-specific installers.

## What changed

- Local steering now waits for session preparation. Agentd steering waits for the real acceptance receipt. Rejected input shows a specific reason before queueing; an unknown remote receipt is not replayed automatically.
- Busy chat keeps its slash menu. Context suggestions, templates and commands fill editable drafts without sending them. Narrow or unsupported terminals receive a readable fallback. Escape closes an open menu; another Escape cancels the task.
- Interruption uses exact words or punctuation-delimited replacements. “stop a server” remains task text; “stop, say NEXT” cancels and queues the replacement. Asynchronous rejection receipts preserve FIFO input order.
- New koder logs commands and the read-only diagnostics_runtime_log tool expose bounded local runtime metadata. Logs rotate at 4 MiB and omit task bodies, model text, mail content and credentials.
- Unresolved permission failures and empty results now produce actionable text and a nonzero result. Successful diagnostic reads of earlier errors do not count as new failures.

## Use it

Run koder --version after upgrading. In chat, open /setup and choose Mid-run input: Steer (default) or Queue. While a task runs, type another sentence and press Enter. Press / on an empty line to browse options; Tab fills the selected draft. Press Ctrl+C to cancel the current task.

Use koder logs --tail 100, koder logs --path or koder logs --json. koder doctor shows the log location and input-module status. The privacy guide documents storage and deletion.

Version 0.3.0 does not contain these input modules. Run the current official installer or a supported koder update to obtain them; changing Setup cannot retrofit an old binary. If a 0.4.4-or-earlier updater rejects the larger package manifest, rerun the official installer without deleting user data.

## Preserved behavior and verification limits

Automatic software/model updates, Skills, MCP, mail, independent windows, authorization, EULA consent and agentd remain in place. --yes does not grant computer access. Queued text cannot approve a pending operation. Headless run --json does not receive an interactive menu.

No-key regression checks exercise actual CLI/readline, the harness, local IPC, temporary files and scripted providers. They do not certify native PowerShell 5.1 cold startup, Windows Console/ConPTY/IME, Windows-MCP GUI operation, real mailbox delivery or model quality. Those items remain NOT_RUN for this release.

[Live input](SESSION-INPUT-AND-SKILLS.en.md) · [Prompt menu](PROMPT_PREFILLS.md) · [Runtime diagnostics](RUNTIME-DIAGNOSTICS.md) · [Automatic updates](AUTO-UPDATE.en.md) · [Installation](INSTALLATION.md)

---

## Preserved 0.4.8 and earlier release records

# Koder CLI 0.4.8

This hotfix repairs automatic-update activation in the current chat and adds direct natural-language controls. It retains model discovery and the complete 0.4.7 feature set. Windows and macOS use the same versioned archive.

0.4.8 fixes `createAutomaticUpdater is not defined` when automatic updates are enabled inside chat. Previously the setting was saved, but the current window could not restart its updater. The same window now checks for a release and installs it when tasks, queued input and drafts are clear, then resumes the conversation.

## Turn updates on or off

In Koder chat, use `/update auto on` or say “enable automatic updates.” Use `/update auto off` or “disable automatic updates” to turn them off. `/update auto status` or “show automatic update status” reads the current setting. You can turn updates off and back on in the same window. No model is needed for these local settings.

From a system terminal, run `koder update auto on`, then enter `koder`. Official managed interactive installations check at chat startup and every six hours while running. Installation waits for idle input; the background download leaves task input usable. The installer and archive are verified before a restart is requested. Closing the conversation cancels its update job; this feature does not start another service when no terminal is open.

## Boundaries

`ask` and plan/report/enhance modes only inspect settings. `KODER_AUTO_UPDATE=0` remains an explicit process opt-out, even if the saved preference is on. CI, noninteractive sessions and unmanaged source checkouts do not install in the background. Changed license text requires renewed consent. Network or integrity failures retain the current installation and report failure; a manual retry remains available.

Software updates and Setup → Model → Automatic model updates are separate settings. Model discovery does not replace the software or switch the selected model.

## Upgrade an affected copy

Run `koder update` once to obtain the fix, then check that `koder --version` reports 0.4.8. That initial upgrade installs code the affected version does not have; once updated, enabling automatic updates needs no additional manual update. If a 0.4.4-or-earlier updater rejects the larger manifest, run the current official installer in place without deleting settings or history.

The 57 update regressions cover actual chat routing, natural-language settings, isolated installer subprocesses, toggling, responsive input, changed licenses and conversation recovery. Fixtures do not certify native Windows consoles or physical client installations.


---

## Preserved 0.4.7 and earlier release records

# Koder CLI 0.4.7

This release adds automatic model discovery, account-scoped caches, reviewed configuration hints and refresh controls to Setup, preserving the complete 0.4.6 feature set. Windows and macOS use the same versioned CLI archive. Run `koder update`, then confirm `koder --version` reports 0.4.7. If a 0.4.4-or-earlier updater rejects the larger manifest, run the official installer once without deleting settings or history.

Starting with 0.4.7, **Setup → Model** checks the current account's Models API and downloads public provider configuration hints. Refreshing never changes your selected model, API key or billing route.

## Use it

1. Run `koder setup`, or `/setup` in chat. A configured account is queried at its existing endpoint. During initial setup, choose a provider and initial model, then enter the key; discovery follows key entry.
2. Open **Current account models** to choose a newly discovered ID. Type that label to filter the menu. You can still enter an ID manually.
3. Inspect the source, retrieval time, declared tool capability and any returned context/output limits. Only an explicit model selection is saved. Environment or provider-file overrides remain owned by that source.
4. **Refresh model information now** bypasses the cache. **Automatic model updates** turns automatic discovery off; manual refresh remains available.

```text
koder model refresh
koder model refresh <saved-model-name>
koder model catalog-refresh
koder model models
koder model test --tools
```

Account lists have a six-hour cache; public hints have a 24-hour cache. Checks run when the model page opens or a key is first configured, with a five-second default deadline covering pagination. Esc cancels. A failed refresh keeps the last good list and saved configuration. No additional daemon or inference request is started.

## Sources and boundaries

The provider Models API supplies IDs visible to the configured account. Cache identity includes the endpoint, protocol and credential fingerprint; the cache does not store the API key. Unknown tool capability is labeled rather than silently filtered out. Explicitly tool-incompatible or retired models are unavailable in the task picker. A listed model is not proof of a successful tool loop: use `model test --tools`.

Public configuration hints come from `https://karmenloop.com/install/model-catalog-v1.json` without credentials. Each entry records its provider documentation URL and review date. This is a maintained snapshot, not a claim of continuous live coverage of every provider. New hints can arrive without reinstalling the CLI; protocol implementation changes still require a runtime update. Invalid or older data cannot replace the cache. A changed endpoint or protocol is flagged for review, never used to move a saved key or change billing products. Existing unavailable providers remain disabled.

Alibaba Coding Plan documents that it does not expose its model list through an API. That route uses documented presets and manual IDs instead of treating a missing Models API as inference failure. Metered APIs, Token/Coding Plans and regions retain separate credentials and endpoints.

Missing token limits are not guessed from names. Unknown models keep conservative defaults; declared limits are bounded and applied only when a model is explicitly selected. Refreshing alone does not increase the current model's context. Limits can still be set in Setup.

`fresh` means retrieved this time; `cached` means within TTL; `stale` means refresh failed and previous data remains. `unavailable`, `unsupported`, `held`, `disabled` and `cancelled` distinguish missing listings, unsupported listing APIs, known integration issues, disabled refresh and user cancellation. HTTP 401 requires checking credentials for that exact service. A listing failure is not an inference failure.

Tests use isolated protocol fixtures and terminal input. Native Windows consoles, real provider accounts and paid inference retain separate acceptance status.

## Official references

- [OpenAI Models API](https://developers.openai.com/api/reference/resources/models/methods/list)
- [Claude Models API](https://platform.claude.com/docs/en/api/models/list)
- [Alibaba Coding Plan FAQ](https://help.aliyun.com/en/model-studio/coding-plan-faq)
- [MiniMax OpenAI-compatible configuration](https://platform.minimax.cn/docs/api-reference/text-openai-api)

Published at the user's request. Native Windows cold installation, MCP GUI, real-account calls and model quality are not certified by this release. Prior artifacts, failed evidence and rollback paths remain available.


---

## Preserved 0.4.6 and earlier release records

# Koder CLI 0.4.6

This release fixes gaps between the shipped Skills, their CLI controls and the MCP runtime. Windows CMD, PowerShell and macOS installers use the same versioned CLI archive. Existing features, permissions, BYOK settings, project histories and background services are preserved.

## What changed

- **One shipped Skill catalog.** Built-in methods can be discovered, read and selected through the CLI and Agent. Setup and CLI switches use the same owners. Disabled Skills stay unavailable, project names keep their precedence, and selections beyond the first catalog page are recognized.
- **MCP package installation works from the distribution.** The previously omitted private npm 10.9.8 component and its pinned dependencies are included. Local installation tests verify that package lifecycle scripts do not run. This does not install a global npm or automatically install third-party software.
- **Explicit legacy SSE support.** Add/import preserves SSE rather than treating every remote endpoint as Streamable HTTP. Invalid or conflicting transport types fail before connecting. Existing credential, HTTPS, origin, approval and receipt controls remain in force; transport changes do not replay operations.
- **Less irrelevant Skill text in small contexts.** Basic task-method bodies are loaded when relevant instead of all being injected into every request. The Code Graph 8K-context regression passes while app-use guidance and permission policies remain present.
- **Tool failures remain failures when JIT is off.** Missing tools and execution errors carry an error result instead of appearing as successful calls.

## Install, upgrade and learn

Use the [Windows CMD installer](https://karmenloop.com/install/koder-cli.cmd), [PowerShell installer](https://karmenloop.com/install/koder-cli.ps1) or [macOS shell installer](https://karmenloop.com/install/koder-cli.sh), following the [installation guide](docs/INSTALLATION.md). These are CLI installers, not desktop EXE/DMG files. Node is reused when compatible or downloaded and verified privately.

```text
koder update
koder --version
koder skills list --limit 200
koder mcp presets
koder setup
koder learn
```

The version should be `koder 0.4.6`. Clients at 0.4.4 or earlier that reject the larger manifest should run the official installer once without deleting configuration or history. The updater limit introduced in 0.4.5 remains 512 MiB.

Start with the [English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md), [MCP and Skill compatibility guide](docs/MCP-SKILL-COMPATIBILITY.en.md), [中文适配教程](docs/MCP-SKILL-COMPATIBILITY.zh.md), and [complete inventory](docs/MCP-SKILL-INVENTORY.md). Thirty interactive lessons and eight bilingual terminal manuals are included.

## Evidence and limits

The selected CLI/kernel regressions cover Skill discovery, guarded resources, selection/switches, MCP stdio/HTTP/SSE, npm installation, app continuation, JIT, Headroom and permissions. The packaged app tests passed after running under their existing 180-second allowance; an earlier aggregate 60-second file timeout is retained. A desktop Electron UI test could not load Electron in this CLI-only environment and remains NOT_RUN for GUI behavior. Artifact and public-download receipts are recorded separately.

The 72-entry inventory contains 68 readable entries, two disabled interface notes and two license-excluded references. This is not a claim that every external application is installed or every Skill workflow has been exercised. Rendering dependencies, target applications, real cloud/mail accounts, live-model quality, Windows 10/11 cold install/update and MCP GUI, OS credential/notification behavior, and macOS Intel-device checks remain separate. Unavailable model presets are not re-enabled by this release.

Published at the user's request without waiting for complete native acceptance. Previous releases and failure records remain available. Preserve configuration, history and uncertain-operation receipts when rolling back. Personal noncommercial use follows the included EULA; third-party licenses and notices retain their original terms.

## Prior release records

# Koder CLI 0.4.5

This compatibility update raises the updater's package-size limit from 100,000,000 bytes to a bounded 512 MiB. The complete Windows-MCP bundle exceeds the old limit. Manifest structure, exact archive name, agreement checks and installer SHA-256 verification remain required. All 0.4.4 features are retained.

## Upgrading from 0.4.4 or earlier

An old updater may report that the update manifest is invalid. Its local limit cannot be changed by the server. Run the current official installer once to upgrade in place: use the [Windows CMD installer](https://karmenloop.com/install/koder-cli.cmd), [PowerShell installer](https://karmenloop.com/install/koder-cli.ps1) or [macOS installer](https://karmenloop.com/install/koder-cli.sh), following the [installation guide](INSTALLATION.md). Do not uninstall or delete your data. The normal installer preserves separate configuration and history. Read and accept the license when prompted; this does not enable computer or mail permissions.

Afterward, `koder --version` should report 0.4.5 and `koder update --check` can read the larger package manifest. Version 0.4.5 and later can use the normal update command within the new bound.

## Included capabilities and guides

[0.4.4 feature notes](RELEASE-0.4.4.md) describe bundled Windows-MCP and private Python, bounded installation recovery, native mailbox sending and background inbox alerts, and default-on Headroom. [English user guide](USER-GUIDE.en.md) · [Chinese user guide](USER-GUIDE.zh.md) · [Mail](MAIL-DELIVERY.en.md) · [Windows-MCP](WINDOWS-MCP-BUNDLED.en.md) · [Headroom](HEADROOM.en.md). Thirty lessons, eight bilingual terminal manuals and the complete command reference remain included.

## Evidence and limits

The real 0.4.3 updater rejected the 0.4.4 manifest before installing; that failure is retained. The new regression checks the real CLI against a 111,893,848-byte manifest and rejects over-limit, zero, negative and fractional sizes without executing an installer. Final artifact and public migration results are recorded separately.

Native Windows 10/11 cold installation/update, MCP GUI, UAC/ConPTY/IME, OS login/reboot/notification display, real mail accounts and model quality remain NOT_RUN for this release. macOS Intel-device checks and previous 8K-context failures remain separate. Published at the user's explicit request without waiting for full native acceptance. Prior releases remain available for rollback; preserve settings, histories and uncertain-effect receipts.

## Prior release records

# Koder CLI 0.4.4

Koder CLI 0.4.4 ships Windows CMD/PowerShell and macOS Apple silicon/Intel installers together. It adds a bundled Windows-MCP runtime, more useful installation recovery, native mail sending and background inbox alerts, and default-on Headroom context optimization. It preserves the existing Core, BYOK routes, permissions, Skills, resident agent and isolated task histories.

## Changes since 0.4.3

- **Windows-MCP without a separate Python install.** The Windows x64 bundle contains Windows-MCP 0.8.8, CPython 3.14.8 and pinned dependencies. Setup and discovery now show the bundled connection before it has been added. Configure, test and enable it through the existing MCP controls. A global winget/Python/pip installation is unnecessary. Existing installed or uvx connections are preserved. macOS continues to use its existing computer drivers; it does not run Windows-MCP.
- **Bounded installation waits and honest recovery.** Ordinary shell commands retain their 20-second default. Direct winget/pip installations receive a 120-second default, with explicit per-command waits up to 300 seconds subject to the existing approval. A timeout or detached launcher is an uncertain result, not a completed installation. The task can inspect receipts and diagnose without automatically repeating the installation or sending/publishing anything. This addresses the reported default-react stop after an installation timeout without treating a background 'started' message as success.
- **Send through the mailbox you bound.** Native mail_send and mail_reply use the configured SMTP account directly. A request to send mail no longer needs to search Apps/MCP or invoke nested Koder commands. The final sender, recipient, subject and body still require send approval. SMTP acceptance is recorded; uncertain deliveries require reconciliation, not a blind retry.
- **Background inbox alerts.** Binding can offer a separately consented monitor. An activated running resident host checks the bound inbox every 30 seconds by default, with persisted notices and cursor tracking. Mail polling is separate from the general proactive interval. Quiet hours and daily limits remain adjustable in Setup. This is polling, not guaranteed instant push; sleep, connectivity and OS notification restrictions can delay alerts. Spam/custom folders are not watched.
- **Headroom enabled by default.** Reversible projections reduce repeated structure in eligible tool results while retaining original evidence in the same thread. Setup can turn optimization and output guidance off. No separate proxy, model or Python process is required. Byte reduction is not a promise of lower token charges or higher model quality.

## Install and update

Download [Windows CMD](https://karmenloop.com/install/koder-cli.cmd), [Windows PowerShell](https://karmenloop.com/install/koder-cli.ps1) or [macOS shell](https://karmenloop.com/install/koder-cli.sh). Follow the [installation guide](docs/INSTALLATION.md) for the command appropriate to your terminal. These CLI installers use the same versioned runtime archive, not desktop EXE/DMG packages. Compatible Node is reused; otherwise the installer prepares a verified private runtime.

```text
koder update
koder --version
koder setup
koder learn
```

The version should be `koder 0.4.4`. Settings, histories and active-task ownership remain in place. For Windows-MCP, run the following commands separately in CMD or PowerShell:

```text
koder mcp doctor windows-mcp --json
koder mcp add windows-mcp --preset windows-mcp --runner bundled
koder mcp test windows-mcp
koder mcp enable windows-mcp
koder mcp tools windows-mcp
```

Configuration alone does not enable desktop access. An interactive Windows x64 desktop is required. Windows ARM64/32-bit, WSL, UAC secure desktop and elevated applications are not established by this bundle.

## Complete guides

Start with the [English user guide](docs/USER-GUIDE.en.md) or [Chinese user guide](docs/USER-GUIDE.zh.md). The package and website include 30 interactive lessons, eight full text editions for CMD, PowerShell, macOS and Linux in Chinese and English, and a command reference generated from the actual CLI definitions.

- [Windows-MCP setup](docs/WINDOWS-MCP-BUNDLED.en.md) / [中文](docs/WINDOWS-MCP-BUNDLED.zh.md)
- [Installation recovery](docs/WINDOWS-INSTALL-RECOVERY.en.md) / [中文](docs/WINDOWS-INSTALL-RECOVERY.zh.md)
- [Mail sending and monitoring](docs/MAIL-DELIVERY.en.md) / [中文](docs/MAIL-DELIVERY.zh.md)
- [Headroom](docs/HEADROOM.en.md) / [中文](docs/HEADROOM.zh.md)
- [Resident agent](docs/ALWAYS-ON.en.md), [portable Skills](docs/PORTABLE-SKILLS.en.md), [live input](docs/SESSION-INPUT-AND-SKILLS.en.md), [task profiles](docs/HARNESS-JIT.md) and [app-use learning](docs/APP-USE-AND-LEARN.en.md)

## Verification and known limits

The frozen candidate.5 passed 132 distinct selected source checks and 100 checks against its actual unpacked artifact. Those layers overlap and use local children, scripted models or isolated protocol fixtures. Seven targeted reproductions failed before the fixes and passed afterward. Final 0.4.4 artifact and public-download checks are recorded separately; these numbers are not a full-product or native-device acceptance claim.

Windows 10/11 no-Node/PowerShell 5.1 cold installation and update, MCP GUI operations, UAC/ConPTY/IME, native login/reboot/notification display, real 163 accounts and real-model quality remain NOT_RUN for this exact release. The isolated Windows CI job did not start because of account billing limits. macOS LaunchAgent login/reboot and Intel-device checks also remain unverified. Earlier 8K-context failures and other historical failure records are retained. Unavailable model presets remain disabled; this release does not declare them repaired.

Mail alerts respect quiet hours and notification budgets; a submitted OS notification is not proof it was displayed. Inbox collection never sends replies automatically. No universal application-coverage, instant delivery or benchmark improvement is claimed.

Published at the user's explicit request without waiting for complete native acceptance. Prior releases remain available. Reconcile active work before rollback; preserve configuration, histories and uncertain-outcome receipts. Personal noncommercial local use is free under the included EULA. Commercial licensing requires separate authorization; all third-party licenses and corresponding-source obligations remain intact.

## Historical records (unchanged)

# 0.4.4-candidate.5 — Windows-MCP discovery and command recovery

Unpublished increment from candidate.4. An unconnected Windows x64 CLI now reports its bundled Python and Windows-MCP before suggesting installation. Shell proposals preserve and display a bounded wait: 20 seconds for ordinary commands, 120 seconds for direct winget/pip installations, and an explicit override up to 300 seconds. The original approval and cancellation path remains in use.

Timeouts and detached Windows launches retain uncertain receipts. A successful launcher exit is not an installation receipt. The remainder of that task is restricted to read-only diagnosis, including tools requested in the same batch. Unverified CLI outcomes return exit 3 rather than API-unreachable or success. Known completed shell calls followed by read failures can use bounded, read-only JIT repair without replaying commands.

This does not claim native Windows cold-start or GUI acceptance, real-account mail delivery, or real-model quality improvements. See docs/WINDOWS-INSTALL-RECOVERY.zh.md. Candidate.4 and earlier evidence remain below.

# 0.4.4-candidate.4 — bundled Windows-MCP

Unpublished candidate. Adds an offline Windows x64 MCP runtime, a bundled launcher, Setup controls and agent routing guidance. Pre-creates the COM wrapper package so repeated launches do not mutate the verified runtime. Retains mail and Headroom changes from candidate.2. See the task handoff for tests and native acceptance limits.

# Koder CLI 0.4.4-candidate.2

Unpublished mail delivery and background notification repair. Retains candidate.1 Headroom changes. Native new-message sending now uses the existing account/SMTP service with explicit local approval; ordinary inbox events persist, and authorized daemon checks run every 30 seconds. Read-only app discovery no longer blocks bounded JIT repair. See [mail usage and limitations](docs/MAIL-DELIVERY.en.md). Real 163 account delivery and native Windows notification display remain NOT_RUN. The historical records below are retained.

# Koder CLI 0.4.4-candidate.1

Unpublished Headroom integration candidate based on released 0.4.3. Default-on native reversible tool-result projection, same-thread raw retrieval, Setup controls and pinned Apache-2.0 reference resources are included. Existing Core, permissions, task history and provider routes are preserved. See [the Headroom guide](docs/HEADROOM.en.md).

Candidate acceptance is separate from the retained release records below. Two existing 8K-context failures reproduce on unchanged 0.4.3; real-model quality/cost and native Windows acceptance remain unverified. No claim of unlimited context or measured billing savings is made. Public downloads are unchanged.

## Retained distribution records

# Koder CLI 0.4.3

Koder CLI 0.4.3 adds an optional resident agent and scoped reminders, fixes masked mail authorization-code input, and brings mail inquiries into the existing task workflow. Windows CMD/PowerShell and macOS Apple silicon/Intel installers share the same verified archive and stable update feed. Existing Skills, task profiles, model routing, project history and permissions remain in place.

## Changes since 0.4.2

- **Stay available after closing a terminal:** explicitly run `koder activate`, or choose activation at the end of installation. `koder status` reports the host and `koder deactivate` removes login startup. Installation and license acceptance alone do not activate it. The user-level adapters are LaunchAgent on macOS, a limited scheduled task on Windows, and systemd --user on Linux.
- **One task runtime:** frontend chat, ask and run use the same Core through authenticated local IPC. Each window retains its own cancellation and task history. Connected gateway messages reuse the existing gateway. A manual gateway already running is reported before activation; it is never taken over or killed.
- **Useful reminders with limits:** explicit follow-ups, interrupted tasks, authorized public URL watches and separately authorized mail checks feed a bounded local decision step. Defaults are 30-minute checks, quiet hours 23:00–08:00 and eight notification attempts per day. Mail, calendar and browser history remain off by default. Calendar/history/file collectors are not yet available.
- **Mail binding and inquiries:** protected authorization-code input supports paste, backspace and clearing without leaking the value into chat or queued tasks. Separate grants enable model reading and proactive inquiries. Choose an option, edit the draft and confirm its final recipient/body before sending. Background checks do not send replies automatically; advertisements and verification codes are excluded from inquiry summaries.
- **Preview and update continuity:** preview/visual commands use their owning background session; `--no-open` is honored. The resident launcher follows the managed installation record, including Windows UTF-8 BOM records, once active work is safely idle. Other windows and tasks are not interrupted to force an update.
- **Preserved capabilities:** portable Codex, Cursor and WorkBuddy Skills, live steer/queue input, five task harness profiles, application-use learning, existing BYOK routes and original permissions remain. The unavailable provider routes remain disabled as documented.

## Install, update and get started

Use the [installation guide](docs/INSTALLATION.md) for the exact command for your shell. Downloads: [Windows CMD](https://karmenloop.com/install/koder-cli.cmd), [Windows PowerShell](https://karmenloop.com/install/koder-cli.ps1), [macOS shell](https://karmenloop.com/install/koder-cli.sh). These are CLI installers and a shared runtime archive, not desktop EXE/DMG packages. The installer reuses compatible Node or prepares a verified private runtime.

```text
koder update
koder --version
koder setup
koder learn
```

Expect `koder 0.4.3`. Existing users retain settings and project histories. Optional residency:

```text
koder activate
koder status
koder agentd doctor
koder agentd proactive off
koder deactivate
```

Activation does not grant computer access, mail access or message-sending authority. In Setup, configure the resident agent and each visible source separately. If a manually started gateway is running, finish its tasks and use `koder gateway stop` before activation. Do not terminate unrelated processes.

## Complete documentation

Start with the [English user guide](docs/USER-GUIDE.en.md) or [Chinese user guide](docs/USER-GUIDE.zh.md). Read [resident-agent operation](docs/ALWAYS-ON.en.md), [Chinese resident guide](docs/ALWAYS-ON.zh.md), [mail binding and inquiries](docs/MAIL-PROACTIVE-INQUIRY.en.md), [Chinese mail guide](docs/MAIL-PROACTIVE-INQUIRY.zh.md), [command reference](docs/COMMAND-REFERENCE.en.md), [Skills](docs/PORTABLE-SKILLS.en.md), [task profiles](docs/HARNESS-JIT.md), [live input](docs/SESSION-INPUT-AND-SKILLS.en.md), and [app-use learning](docs/APP-USE-AND-LEARN.en.md). All 30 interactive lessons and eight complete shell/language text editions remain available, with a 0.4.3 quick reference.

## Verification and limits

The frozen candidate passed 199 broad local regressions, followed by 39 final agent/gateway checks and 29 unpacked-runtime checks. An actual packaged CLI subprocess completed through authenticated IPC and the original Core with stdin held open. These counts overlap and use scripted models or isolated service fixtures. Final stable-package checks and public download verification are recorded separately in the release acceptance receipt.

Native Windows 10/11 PowerShell 5.1 no-Node cold install/update, ConPTY/IME input, login/reboot, Toast and MCP GUI operations are NOT_RUN for this exact release. macOS LaunchAgent login/reboot and visible notifications, Linux systemd login, real mail/gateway accounts and real-model quality are also NOT_RUN. Existing inherited failures are retained in earlier release records; selected passing checks are not a claim that the entire product suite is green.

Native notification `submitted` means the call was accepted, not that the user saw it. Notification-click resume is not implemented: use `koder status` to find the original session or `koder mail inquiries` for mail. URL changes are review signals, not proof of a corrected conclusion. No autonomous-correction quality score is claimed. Uncertain external outcomes are not automatically resent. Cross-task profile evolution still requires the original authorized maintenance owner and otherwise returns NO_ENTRY.

Published at the user's explicit request with these limits retained. Prior releases and website deployments remain available for rollback. Stop residency through `koder deactivate` and reconcile active work before restoring an earlier version; retain configuration, history and unknown-outcome receipts. Personal noncommercial local use is free under the included EULA; commercial use requires separate written authorization. Third-party licenses and notices are preserved.

## Historical records (unchanged)

# Koder CLI 0.4.3-candidate.2

Unpublished incremental candidate based on candidate.1. Adds explicit activation, user-level service adapters, authenticated loopback IPC, original gateway supervision and bounded proactive notification decisions. Foreground tasks use the original Core, JIT profiles, universal application guidance, permissions and project history. Mail input and inquiry changes from candidate.1 remain included.

Local IPC and subprocess tests are separate from OS service acceptance. Windows login/reboot/Toast, macOS LaunchAgent registration/notification visibility, Linux systemd user sessions, live accounts and live model tasks remain NOT_RUN. No service is registered on the development Mac. See [Always-on guide](docs/ALWAYS-ON.zh.md) and the task acceptance receipt. The historical records below are preserved; “no daemon” in candidate.1 describes that earlier build only.

## Retained candidate.1 record

# Koder CLI 0.4.3-candidate.1

Candidate built from published 0.4.2. Adds exclusive masked mailbox credential input and consented proactive mail inquiry in chat/watch. Public 0.4.2 assets are unchanged. See docs/MAIL-PROACTIVE-INQUIRY.zh.md and the task acceptance receipt for actual test scope.

Native Windows ConPTY/IME binding, live mailbox providers, real-model draft quality and native system notification delivery remain NOT_RUN. No separate daemon is shipped. All prior release failure and NOT_RUN records remain historical evidence; this focused mail change does not close them.

# Koder CLI 0.4.2

Koder CLI 0.4.2 brings task-specific harness profiles, portable Skills, an editable input line during agent work, and guided application use to the existing terminal runtime. Windows CMD/PowerShell and macOS installers share the same version, package checksums and update feed. Existing tools, model routing, permissions and project history remain in place.

## What changed since 0.4.1

- **Portable Skills:** discover and call standard Codex, Cursor and WorkBuddy/CodeBuddy Skill folders. Use `koder skills list`, `--skill`, `/skill` and `/skills`; import local folders or ZIPs with their references and scripts. Reading/importing a Skill does not run its scripts, import another host's permissions or install dependencies.
- **Bundled workflows:** pinned browser, media and application Skill resources use the existing execution path, with original licenses and notices. Koder-authored helpers prepare local timeline, CSV, article and render artifacts. Reference-only packages are identified as unavailable for bundled execution. Account-dependent publishing and native editor export require separate authorization and acceptance.
- **Input while working:** the current terminal keeps an editable input line. Steer is the default; queue mode retains ordered follow-up tasks. New approval prompts do not consume queued tasks. Stop/cancel behavior retains the original owner and receipts.
- **Setup controls:** enable or disable individual Skills, use the confirmed disable-all action, configure input handling, and control universal app use and tutorial learning independently.
- **Application use:** covering Apps/MCP tools are preferred, followed by authorized browser and desktop tools. Unfamiliar workflows use bounded public documentation reads before another attempt. Missing drivers, missing grants and unknown effects remain explicit; no new computer permission is granted.
- **Task harness profiles:** five fixed M/P/A/F profiles select context projection, planning guidance, tool/Skill exposure and step limits. Use `/harness deep-research`, `--harness`, or Setup. Hidden tools are rejected before invocation. At most two repairs share the existing budget; external or unknown side effects are not replayed. `koder harness off` restores the baseline path.
- **Startup updates:** eligible managed interactive launches check the official release feed visibly. Saved update-off settings, process overrides and noninteractive exclusions remain. Activation waits for idle input and retains integrity and license checks.

## Install and update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd) and run it in Command Prompt.
- Windows PowerShell: download [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1). Follow the shell-specific command in the [installation guide](docs/INSTALLATION.md); no permanent system execution-policy change is required by this release.
- macOS, Apple silicon or Intel: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh`.
- Existing installation: run `koder update`, then `koder --version`; expect `koder 0.4.2`.

The CLI archive, installers, release manifests, SHA256SUMS and eight English/Chinese PowerShell/CMD/macOS/Linux tutorials are published together. The desktop application has its own channel; these are CLI installers, not a new desktop EXE or DMG.

## Guides

Read the [English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md), [portable Skills](docs/PORTABLE-SKILLS.en.md), [bundled workflows](docs/VIDEO-BROWSER-SKILLS.en.md), [input and Setup](docs/SESSION-INPUT-AND-SKILLS.en.md), [application use](docs/APP-USE-AND-LEARN.en.md), and [task harness profiles](docs/HARNESS-JIT.md). All 30 interactive lessons remain, and complete printable editions include a new feature quick reference. Original preview and candidate notes remain as historical evidence.

## Verification and known limitations

The frozen candidate.6 passed 35 selected kernel tests and 70 CLI regressions. Its unpacked runtime passed 38 package checks across 27 CLI subprocesses, 35 JIT checks and 19 application-use checks. These layers overlap; they are not a count of unique scenarios. Final 0.4.2 packaging, website and live-download checks are recorded separately in the release acceptance receipt.

Seven inherited regression failures remain recorded: four earlier planning/suggestion/tutorial fixture failures and three 8K-context cases reproduced on the unchanged candidate.5. Selected passing suites are not a fully green product suite. Native Windows 10/11 GUI, final-package no-Node cold installation/update and authenticated external accounts remain unverified by this Mac publication run. No new real-model quality score or cost reduction is claimed. Existing unavailable provider routes remain unavailable as documented.

The standalone CLI has no default persistent Skill maintenance owner. Cross-task profile evolution reports `NO_ENTRY: experience-port-unavailable` without that existing authorized host port. A completed task alone never establishes a winning profile; paired evidence is still required. Bounded delegation runs serially unless an existing authorized delegation tool is present.

Published at the user's explicit request with these limitations retained. Previous releases remain available for rollback. Personal noncommercial local use is free under the included EULA; commercial use requires separate written authorization. Original third-party licenses and notices remain intact.

## Historical records (unchanged)

# 0.4.2-candidate.6 — task harness profiles (unpublished)

This increment retains candidate.5 and adds five fixed M/P/F/A profiles to the existing CLI: default ReAct, deep research, office dependencies, bounded subtasks and universal app use. Task cues, explicit chat/command overrides and Setup settings select the profile. Tool and Skill filtering is enforced before invocation; profile changes retain existing approvals and consumed budgets.

The original loop handles at most two bounded repairs. Completed outcomes use the original Skill maintenance port, with NO_ENTRY unless task receipts and isolated comparison evidence justify a recommendation. Standalone CLI has no default persistent maintenance owner; it reports that boundary without creating another database. No new model, executor, permission authority or credentials are introduced.

Read [the usage guide, configuration and acceptance checklist](docs/HARNESS-JIT.md). The local evidence covers 35 kernel checks and 70 selected CLI checks, including disabled behavior, Setup, profile filtering, repair, context projection and existing session/permission contracts. Three older 8K-context tests still fail identically on candidate.5; their failure records remain. Native Windows GUI/cold installation, real accounts, model quality and cost benchmarks are not established by these fixtures. This candidate has not changed the public download.

---

# 0.4.2-candidate.5 — universal app use configuration

This unpublished increment preserves candidate.4 and registers `builtin:universal-app-use` in the existing CLI harness. It adds independent Setup controls for the method and tutorial learning, a validated `universalAppUse` config object, legacy-ID compatibility and disable-all integration. The system message now uses a short pointer instead of repeating the full method.

Known Apps/MCP remain the default first choice, followed by authorized browser/desktop channels. The existing tutorial helper enforces per-turn attempts, including failures and concurrent calls; steering does not reset them. Unknown external results still require reconciliation. Other connected-tool learning limits and UI recovery limits are model workflow constraints, not universal hard gates.

No drivers, permission authority, task engine or memory store are replaced. No EULA or default grant changes. Read the [English guide](docs/APP-USE-AND-LEARN.en.md) and [Chinese guide with six acceptance cases](docs/APP-USE-AND-LEARN.zh.md). This candidate is not a production update; native client, account and real-model tests remain distinct from local fixture checks. Prior failures are retained in the task evidence and release history.

---

# Koder CLI 0.4.2-candidate.4 — unpublished

This increment adds a default-on app-operation method to the existing Skill and Setup controls. It prioritizes covering connected Apps/MCP tools, then authorized browser/desktop channels. Unfamiliar workflows and UI mismatches call for documentation before another attempt; sources, actual actions and observed outcomes remain distinct.

Two read-only tools expose current channels/grants and bounded public tutorial reads. They reuse the existing connection and computer-permission owners and anonymous public-page transport. Tutorial access does not grant persistent learning, computer control or installation permission. Unknown external effects require reconciliation before retry or fallback. No driver, host, model route, permission authority or memory store is replaced.

The prior busy composer, steering/queue modes, startup update scan, Skills, histories and release records remain. Read the [English guide](docs/APP-USE-AND-LEARN.en.md) or [Chinese guide and seven-case checklist](docs/APP-USE-AND-LEARN.zh.md). Local scripted-provider and owned MCP tests do not establish real-model quality or native GUI compatibility. Candidate.3's unresolved failures and platform gates remain; no public upload or production update is claimed.

---

# Koder CLI 0.4.2-candidate.3 — unpublished

This increment retains candidate.2 and adds an editable input line during agent work. Steer is the default: supplements enter the existing turn at the next safe model boundary without aborting the active request. Queue mode shows a count and short previews, then runs later turns in FIFO order. Esc, Ctrl+C and explicit English/Chinese stop controls still cancel. A stop phrase with a suffix queues that suffix after cancellation.

Setup now exposes persistent Skill controls, confirmed disable-all for currently discovered switchable methods/collections, and the mid-run input preference. Existing model routing, project/session isolation, consent and permission owners remain intact. Fresh approval prompts never consume queued tasks, and a draft survives streaming and the return to the ordinary prompt.

Each eligible managed interactive launch performs a visible official CLI release check regardless of the six-hour cache. Saved automatic-update off, process overrides, CI and non-TTY exclusions are preserved. Installation still waits for idle input and passes the existing license and integrity checks.

Read the [English usage and ten-case checklist](docs/SESSION-INPUT-AND-SKILLS.en.md) or [Chinese guide](docs/SESSION-INPUT-AND-SKILLS.zh.md). This package is a local candidate, not an available remote update. Native Windows terminal/device acceptance and real-model evaluation are not established by local scripted-provider or macOS PTY tests. Earlier failures are retained in the task receipt; no full-suite or production publication claim is made.

---

# Koder CLI 0.4.2-candidate.2 — unpublished

This increment retains candidate.1 and adds pinned media, browser and application Skill sources to the same discovery and execution path. It adds dependency discovery and verified project-local preparation, original timeline/CSV/article/render helpers, and a Jianying draft adapter that preserves existing drafts and rejects invented media metadata.

Nine third-party source bundles and one Koder-authored workflow are callable. Two upstreams remain reference-only because their redistribution terms do not cover this package. Original sources, attribution and adaptation records are retained. See the [English guide](docs/VIDEO-BROWSER-SKILLS.en.md), [Chinese guide](docs/VIDEO-BROWSER-SKILLS.zh.md) and [third-party inventory](THIRD_PARTY_COMPONENTS.json).

Local functional acceptance covers a fresh browser session, a rendered video with audio, file exports, Jianying draft JSON and a Draw.io adapter. It does not certify every style, native Windows UI export, real accounts or real-model output quality. The four baseline failures recorded in [candidate.1](docs/RELEASE-0.4.2-candidate.1.md) remain open. Production remains 0.4.1; this is not an available remote update.

---

# Koder CLI 0.4.2-candidate.1 — unpublished

This candidate adds local Agent Skills discovery, import and invocation to the stable 0.4.1 runtime. It retains existing built-in methods, model routing, workspace history and execution authority.

- Discover standard Codex, Cursor and WorkBuddy/CodeBuddy skill folders. Keep same-name packages separate with stable IDs.
- Search metadata through the existing `skill_catalog` and read instructions or relative text resources through `skill_read` only when needed.
- Select a Skill with `--skill`, a known `$name` in a task, or `/skill` in the current chat. `/skills` lists, reads and imports without leaving chat.
- Import a local folder or ZIP without running its scripts or installing dependencies. Preserve resources and original notices; reject invalid paths, unsafe links and malformed manifests.
- Retain manual-only and user-invocable flags and bounded file-pattern matching. Host-specific hooks, accounts and execution policy are not imported.

See [the guide](docs/PORTABLE-SKILLS.en.md) and [Chinese guide](docs/PORTABLE-SKILLS.zh.md). No real-model planning score, native Windows client acceptance or production publication is claimed. Local scripted-provider and unpacked-package evidence is recorded in the task acceptance receipt. Stable 0.4.1 remains the production download; this candidate is not an available remote update.


## Retained regression failures

Expanded local regression ran 192 CLI checks: 188 passed and four failed. The same four failures were reproduced against the unchanged 0.4.1 source: the older development-plan fixture expects an implementation request to finish after planning; two terminal suggestion checks no longer receive their expected choices; the full interactive tutorial does not reach its expected second repair. Original assertions and time limits remain unchanged. These remain unresolved baseline failures, not a fully green release gate. The portable Skill cases and selected kernel regressions passed separately.

## Retained release records

# Koder CLI 0.4.1

Koder CLI 0.4.1 updates the Windows CMD/PowerShell and macOS/Linux terminal installers together. It retains the complete 0.4.0 feature set and includes the credential, delivery and generation-method repairs developed in the 0.4.1 candidates.

## Changes

- Coding guidance follows the requested work: reproduce bugs and trace their causes, measure performance, preserve behavior during refactoring, and check real integration boundaries.
- Writing guidance focuses on the reader, supported facts, useful tradeoffs and next actions. Repeated revisions retain the nearest user task, while new requests take priority.
- Technical emails and proposals are classified by their requested deliverable. Explicit requests to analyze and repair code keep their execution scope; Ask, Plan and report modes keep their existing limits.
- Stable, candidate and preview release sources are recognized correctly. Migration/dependency headings cannot masquerade as another product release. Revising release copy retains attribution checks, and comparisons retain predecessor checks.
- Current-task delivery checks identify selected missing artifacts, plan-only completions, stale verification and incomplete drafts. Up to two corrections stay within the original permissions and budget; unresolved gaps remain incomplete with exit 3.
- Windows credentials use the bundled integrity-checked helper. A contradictory Windows-MCP target report remains UNKNOWN rather than being reported as success. The Humanizer catalog description and English rewrite matching are repaired; its pinned upstream source and license remain.

## Install or update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd) and run it in Command Prompt.
- Windows PowerShell: download [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1) and follow the [installation guide](docs/INSTALLATION.md).
- macOS, Apple silicon or Intel: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh`.
- Existing installations: run `koder update`, then `koder --version`; expect `koder 0.4.1`. Keep settings and history in place.

Read the [English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md), [coding and writing methods](docs/CONTENT-QUALITY.en.md), [current-task delivery checks](docs/TASK-DELIVERY.en.md) and [multiwindow guide](docs/MULTI-WINDOW.md). All 30 lessons and eight printable shell/language editions are retained. Windows and Mac use CLI installers; the desktop app has its own release channel.

## Verification scope

The candidate.4 source passed 233 local regressions with one preserved skip; 51 selected checks passed against its unpacked runtime. Those scripted-provider checks establish request transport and selected behavior, not better real-model programming or writing scores. The final 0.4.1 package and publication checks are recorded separately in the release acceptance receipt.

Candidate.2 passed isolated no-Node CMD/PowerShell 5.1 installation and real update checks on Windows Server and Windows 11 ARM, plus Mac Apple silicon/Intel installation/update and a Server MCP GUI sequence. These are historical checks of that exact candidate, not native acceptance of the final 0.4.1 archive. Windows 10/11 x64 full GUI/ConPTY/IME/UAC, Windows 11 ARM client GUI focus, final-package Windows installation/update and authenticated external accounts remain incomplete. The release is published at the user's explicit request with those limits retained.

MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano remain unavailable as documented. No new real-model quality score or complete third-party reverse-tool replacement is claimed. Original releases, notices, failure records and rollback downloads remain available.

## Historical build records

# Koder CLI 0.4.1-candidate.4 — unpublished

This increment retains candidate.3 and adds bounded coding and writing methods to the existing model request. It distinguishes the requested artifact from facts mentioned in the prompt, carries user context through short refinements, and preserves explicit implementation, Ask, Plan and report scopes.

Release-source checks recognize stable, candidate and preview versions, distinguish product headings from migration/dependency headings, and keep attribution checks active when revising an update draft. Chinese and English unsupported increment claims are checked. Humanizer catalog metadata is repaired without changing its pinned upstream source or license.

Local protocol and regression evidence is recorded separately. Scripted replies do not establish better prose or code: the original short-prompt blind suite still needs same-model evaluation. Native installation, update and Windows client GUI gates are retained. This candidate is not published to the production feed, website or GitHub. See [generation methods](docs/CONTENT-QUALITY.en.md) and [Chinese guide](docs/CONTENT-QUALITY.zh.md).

Historical notes below describe their original builds and remain unchanged.

---

# Koder CLI 0.4.1-candidate.3 — unpublished

This build retains candidate.2 and adds current-request delivery checks for common implementation and writing tasks. Missing files, unfulfilled explicit output paths, stale test receipts, plan-only replies and selected missing draft formats receive bounded repair within the existing executor. Remaining gaps return exit 3 and stay marked incomplete in local history. The existing source-evidence checks remain in force.

The candidate does not claim a new coding or writing score. Validation receipts are recorded separately; local scripted checks are not real-provider or Windows client GUI acceptance. Production remains 0.4.0. See [the current-task guide](docs/TASK-DELIVERY.en.md) and [Chinese guide](docs/TASK-DELIVERY.zh.md).

The historical candidate notes below are retained as build-time records. Candidate.2 later passed its recorded isolated installation/update checks on Windows Server, Windows 11 ARM and both Mac architectures, plus a Server GUI sequence. Client GUI limitations remained; these receipts do not certify the changed candidate.3 runtime.

---

> Unpublished 0.4.1-candidate.2: native package and Windows client GUI acceptance remain separate release gates. Production remains 0.4.0.

# Koder CLI 0.4.1-candidate.1 — unpublished

This candidate preserves the published 0.4.0 feature set and changes the Windows credential subprocess. It is not the production download or a completed Windows GUI acceptance.

- Use a bundled, SHA-256-checked DPAPI helper instead of starting PowerShell for ordinary Windows credential transforms. CurrentUser protection, the existing encrypted file format, and the 10-second operation deadline remain.
- Reassemble bounded Windows output bytes before strict UTF-8 decoding, so multibyte text split across pipe chunks remains intact.
- Preserve the explicit legacy PowerShell backend for compatibility checks. An absent, modified, or linked packaged helper fails integrity verification; it never silently falls back to another executable.

Local checks: 12 new tests and 14 existing credential, personalization, and bundle checks passed. Two Windows-only tests were not run on macOS. The native candidate cold-start and compatibility receipts are pending; local checks are not native acceptance.

The unchanged 0.4.0 installers passed four fresh no-discoverable-Node paths on Windows Server and Windows 11 ARM, including actual runtime downloads, startup, and same-version update checks. These results belong to 0.4.0, not this candidate. Windows client GUI, candidate installation and cross-platform package checks remain separate release gates.

All original limitations and historical failures remain recorded. No production website or release feed has been changed by this candidate build.

---

# Koder CLI 0.4.0

Koder CLI 0.4.0 is the formal release based on the published preview.30 runtime. Windows CMD and PowerShell installers and the macOS/Linux shell installer are available alongside the shared CLI archive. This is a release-channel promotion with consistent version, installer, license-record and update metadata. It does not add the separate pricing or inline-reverse candidates.

## Included improvements

The preview.30 multiwindow fixes remain: independent default sessions when an older task owns a turn lock, cleanup after supervisor disconnects, process-instance checks for recycled PIDs, and accurate ownership notices. Existing models and BYOK routing, workspace history, permissions, tools, memory, Skills and all 30 tutorial lessons remain available.

## Install and update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd), then run it in Command Prompt. The PowerShell installer is [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1).
- macOS: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh` in Terminal. The installer selects the runtime for Apple silicon or Intel when needed.
- Existing users: run `koder update`, then `koder --version`. The expected version is `0.4.0`. Settings and stored history remain in place.
- These are CLI installers, not signed desktop EXE or DMG applications. The separate desktop product keeps its own release channel.

Read the [installation guide](docs/INSTALLATION.md), [English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md) and [independent task guide](docs/MULTI-WINDOW.md). All eight printable tutorial editions are linked in the guides.

## Verification boundaries

The preview.30 baseline passed 353 local regressions. Its changed components passed 34 applicable subprocess checks on Windows Server x64 and Windows 11 ARM, plus nine real CLI-entry checks using a local synthetic model on each platform. Those are baseline results, not a claim that every 0.4.0 installer or Windows client path was rerun. The 0.4.0 release-channel, exact package, installation and public readback results are recorded separately in the release acceptance receipt.

PowerShell 5.1-only cold startup, Windows 10/Windows 11 x64 full client GUI/ConPTY/IME/UAC and authenticated external-provider/mailbox accounts remain incomplete. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as documented. Formal distribution does not turn these records into passes. No new writing score, complete REA replacement or optional external-engine concurrency certification is claimed.

Previous preview releases and their checksums remain available for rollback. This release does not remove user data, enable synchronization, grant new execution authority or accept a license on the user's behalf.

## Historical preview.30 and earlier records

# Koder CLI 0.4.0-preview.30 Beta

This is a focused multiwindow hotfix on the complete preview.29 runtime. Existing models, BYOK settings, permissions, Skills, project history, tutorials and recovery remain available. New writing-price and inline-script research remains in a separate unpublished candidate.

## Fixed

- A new default task now checks both lifetime ownership and the older per-turn lock before reading history. If an older Koder process holds only the per-turn lock, the new task receives an independent session immediately. An explicitly named busy session remains protected.
- A CLI worker that loses its supervisor connection cancels its own pending request, closes its input wait and releases its own session. Disconnects during startup and restart acknowledgement no longer leave a 15-second waiter behind. Normal updates retain their existing restart and recovery flow.
- Ownership records include a process-instance identifier. A record from an earlier Koder incarnation with the current recycled PID no longer blocks the current process. Legacy live owners and other unverifiable processes remain protected; records are not deleted merely because they are old.
- A busy notice describes unavailable ownership rather than asserting that another visible window exists. Automatic isolation prints the new session name and its resume command.

## Use two or three independent tasks

Open separate terminal windows. Running `koder` in each window automatically separates occupied default sessions. To choose stable names, use `koder chat --session website`, `koder chat --session slides` and `koder chat --session tests` in separate windows. Resume with the displayed session name. Same-project files remain shared; use separate project directories when outputs must be independent. Do not delete the memory directory or terminate unrelated Node processes to clear a notice.

## Update

Run `koder update --check`, then `koder update`, and verify `koder --version`. Close a finished older window normally. Updates retain settings and stored history. All eight printable tutorials and the complete English and Chinese guides describe preview.30.

## Evidence and limits

The original public preview.29 archive reproduced the legacy-lock and recycled-current-PID defects. The focused candidate passed 35 local regressions. Independent review found no required fixes in the three changed runtime components. Windows subprocess checks use synthetic loopback responses, not paid provider accounts. Exact packaged checks and native results are recorded separately in the publication receipt.

PowerShell 5.1-only cold startup, Windows 10 and Windows 11 x64 client coverage, unobstructed GUI focus/input, ConPTY/IME/UAC and live account acceptance remain incomplete. Windows Server is not a Windows 10/11 client. Earlier failures remain recorded. This Beta does not claim full Windows certification, a new writing score, a full third-party reverse-tool replacement or validation of the optional external engine. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as previously documented.

Read [the multiwindow guide](docs/MULTI-WINDOW.md), [installation](docs/INSTALLATION.md), [complete English guide](docs/USER-GUIDE.en.md) or [Chinese guide](docs/USER-GUIDE.zh.md).

## Historical preview.29 and earlier records

# Koder CLI 0.4.0-preview.29 Beta

This beta combines the retained preview.28 runtime with the two preview.29 candidates. It is an incremental release; existing provider routes, BYOK settings, permissions, Skills, project history, tutorials and recovery remain available. Beta publication does not close the platform and account checks listed below.

## Changes in this beta

- MiniMax content-review replies with recognized code 1026 or 1027 now report `MODEL_FILTERED`, including the HTTP 422 path, instead of an API-unreachable notice. Only bounded, redacted diagnostics leave the provider parser. Credential, quota, parameter and network failures remain distinct; rejected content is not automatically rewritten, resent or sent to another endpoint.
- Native Koder chats can run in two or three terminal windows with separate session ownership. A second default window gets its own session before loading history; an explicitly named busy session is not taken over. Same-project files remain shared. Local subprocess acceptance is not Windows terminal acceptance, and the optional external engine is outside this test scope.
- Typing `/` at an empty interactive prompt opens contextual suggestions, saved templates and commands. Choose with arrows or PageUp/PageDown, fill with Tab, then edit and send. Selection itself never sends. Esc closes the list; direct commands, pasted input and noninteractive usage retain their behavior.
- Long-context carryover reserves its warning and framing before selecting excerpts. Early task markers and constraints survive tight-budget checks without increasing the model window or turning historical text into fresh permission.
- Writing checks measure the verified main deliverable, accept explicit English or Chinese non-increment disclosure and read bounded versioned release/acceptance records plus installed public facts. A named predecessor file is recorded with its path and SHA. Acceptance terms and installed versions cannot prove new features. Unknown pricing may be disclosed; unsupported numeric competitor prices remain conservative.
- Harness²-inspired comparison uses the existing Core and growth method. Baselines remain available, probes compare actual local artifacts and conditional lessons can be rejected as `NO_ENTRY`. Global adoption still requires the existing trusted replay and owner-authorization ports. No fixed model, second scheduler or new permission authority is added.
- Scoped crawling uses a task-specified site and bounded same-origin HTML/external JavaScript reads, then the existing first-party reverse worker. Local static analysis does not execute the inspected target. It is not authenticated browsing, complete decompilation, vulnerability proof or a full REA replacement.
- On Windows, the credential helper prefers a regular installed PowerShell 7 executable at its fixed system path. DPAPI CurrentUser, private input and the existing deadline remain in place. PowerShell 7 is not installed automatically.

## Evidence and open checks

The original C01–C07 and W01–W05 prompts are unchanged. Local deterministic and subprocess regressions, native disposable-runner observations, exact-package checks and authenticated provider tests are separate evidence categories. No new writing score, competitor win or full Windows certification is claimed.

Windows PowerShell 5.1-only cold startup remains unresolved. The available Windows 11 ARM64 image blocked owned-window foreground focus; no click/type proceeded after that failure. Native Windows 10 and Windows 11 x64, this release's full CMD/PowerShell install and update/restart, ConPTY/IME/UAC, unobstructed GUI input, real provider accounts and independent product QA remain open. Earlier failures remain recorded. A successful syntax check or fixture is not a passing client run.

MiMo Token Plan, Kimi API/Code, DeepSeek, Alibaba Token Plan and Volcano Coding Plan/Ark remain gray and unavailable. Optional MCP, mail, browser, graph and deployment services require their documented dependencies and separate authorization. The backup engine stays disabled by default.

## Install, update and learn

Use [installation](docs/INSTALLATION.md), the [complete English guide](docs/USER-GUIDE.en.md) or [Chinese guide](docs/USER-GUIDE.zh.md). Run `koder update --check`, then `koder update`, and verify `koder --version`. Keep your credentials, project folders and memory when updating. `koder update auto status` reports background-update settings.

The release includes eight complete, 30-lesson printable editions for PowerShell, CMD, macOS and Linux in English and Chinese. `koder learn` runs the scripted local tutorial without paid model calls. Read [provider and input changes](docs/PROVIDER-WRITING-INPUT.md), [multiple windows](docs/MULTI-WINDOW.md), [Harness increment](docs/HARNESS-INCREMENTAL.md), [reverse analysis](docs/AUTONOMOUS-REVERSE.md) and [Windows evidence](docs/WINDOWS-COLD-CANDIDATE.md) for limits and examples.

## Historical records retained below

# Local candidate 0.4.0-preview.29-candidate.2

Unpublished incremental candidate. This update addresses MiniMax content-review error reporting, writing source and predecessor evidence, an editable slash-input picker, and concurrent native Koder session ownership. Prior Harness², reverse, Skills, providers, permissions, history isolation, tutorials and platform work are retained. Synthetic regression and package checks are distinct from paid-model writing scores and native Windows acceptance. No writing-score improvement or formal release is claimed.

## Retained candidate record

# Local candidate 0.4.0-preview.29-candidate.1

Unpublished. The complete previous source and release record are retained below. New candidate scope: additive Harness²-style contrast metadata and artifact probing, original-Core-controlled skill adoption, scoped crawler/static reverse Agent tools, and installed-system-PowerShell-7 credential startup. No new fixed provider, background scheduler or permission authority. Paid-model evaluation and complete Windows client acceptance are not claimed. See docs/HARNESS-INCREMENTAL.md, docs/AUTONOMOUS-REVERSE.md and docs/WINDOWS-COLD-CANDIDATE.md.

## Retained published record

# Koder CLI 0.4.0-preview.28 Beta

## Actual-call addendum — October 23, 2026

Windows-MCP calls and public preview.28 Agent continuation passed on an isolated Windows Server 2025 runner. CodeGraphContext with Ladybug and the Koder graph flow passed on an isolated Apple-silicon Mac with its native OpenSSL 3 prerequisite. Read docs/MCP-ACTUAL-ACCEPTANCE.en.md for exact versions, driver limitations and remaining platform gates. The initial publication evidence below remains historical; the installer was not rebuilt.

This beta adds optional Windows-MCP and CodeGraphContext integration presets through the existing MCP host. Upstream Python executables and dependencies are not bundled.

- mcp presets and mcp doctor inspect catalog/platform/launcher data without opening the connection host or running the upstream program. Launcher presence is not native acceptance.
- The Windows-MCP target is 0.8.8, serve entry, native Windows 10/11 and Python 3.14+. Python stdio is UTF-8, upstream anonymized telemetry is off. No elevation, PowerShell-policy change or login task is added.
- CodeGraphContext targets 0.6.13. The preset binds cwd/allowed roots to the workspace and separates runtime HOME and graph paths per project. Agent discovery, calls and protocol reads filter other known preset workspaces.
- Agent guidance discovers actual graph schemas and checks indexed roots/freshness before relationship queries and source reads. Stale or unavailable graphs fall back to source search. Indexing, watching, arbitrary Cypher, deletion and desktop actions retain original approvals; graph results are not test evidence.
- /setup provides current-terminal integration entries. Saving configuration keeps the server disabled. The optional pinned uvx runner can download its target package and Python only when explicitly started.
- Explicit MCP add --enable or enable returns nonzero when connection fails instead of reporting configuration as successful connectivity.

## Verification and limits

The existing 12 benchmark prompts remain unchanged. Real MCP SDK tests use an owned stdio fixture to check discovery, approval, calls, durable results, same-turn continuation, workspace guards and failed-connection semantics. The fixture is not either upstream binary. This development Mac installs no Python dependencies and uses no paid model key. Native Windows UI actions, actual upstream binaries and a real graph database require separate acceptance. Existing unavailable model routes remain disabled. No new model capability score or competitor result is claimed.

Installers and complete bilingual manuals: https://karmenloop.com/cli.html#install

## Earlier release record

# Koder CLI 0.4.0-preview.27 Beta

This beta adds deterministic writing and project delivery checks to preview.26. It does not assign a new capability score or claim competitor performance.

- Technical-decision-maker Koder introductions with an explicit approximate Chinese length receive a 90–110% Han-character check. The original W01 request requires 720–880 Han characters. A short draft returns 3 with measured length.
- Release writing can call writing_sources to read a bounded list of workspace release documents. Matching changelog sections with two facts require two distinct actual line references. Acceptance terms, README text and a version label alone do not establish release increments.
- Compression of an actual preceding competitor comparison records its SHA-256 and flags new numbers and selected named technology claims. Missing predecessors and unknown information are disclosed. These checks do not establish semantic factual equivalence.
- project check inspects README, test/verify entries, Docker files or static HTML basics without running scripts. Recognized service, generator and landing-page creation turns return 3 when required structure is missing. Existing artifacts remain on disk. A file-structure check is not a successful test, security review or design grade.
- Task-specific delivery instructions favor a runnable first slice, tests, a small diff and saving work before a soft time target. No time-based process killer, automatic install or new execution permission is added.
- model presets derives total, selectable and unavailable counts from the current catalog. Selectable does not mean authenticated account acceptance. The seven held integrations stay blocked.

## Verification boundaries

Original C01–C07 and W01–W05 prompts are unchanged. Synthetic protocol tests cover gates, input handling, workspace recall, headless clarification and context compaction. They do not grade real-model output. Native Windows, authenticated providers, original missing fixtures, the 15-test generator target and competitor timing remain separate acceptance items. No paid model benchmark or recurring automation is started.

## Historical status

# Koder CLI 0.4.0-preview.26 Beta

This beta is prepared from the frozen preview.26-candidate.8 runtime. It includes explicit-stdin handling, workspace-scoped task recall, Koder Projects folders, bounded provider diagnostics, model-only recovery, refreshed pinned browser/design method resources, opt-in remote references, noninteractive clarification, safe rejected-request history rollback and deterministic writing-disclosure checks. The original 12 benchmark prompts are preserved; no new capability score is assigned.

Local contracts: 63 passed. Windows-related portable logic: 30 passed on macOS. Native Windows and authenticated provider behavior have not been executed in this publication task. The unavailable provider entries remain disabled. A written draft rejected by evidence checks returns 3 without being mislabeled an API fault. Read docs/WINDOWS-INSTALL-CHECKS.md and docs/BLIND-BENCHMARKS.md for precise test limits.

## Historical candidate notes

# 0.4.0-preview.26-candidate.8 - unpublished source candidate

Noninteractive ask_user returns unanswered without user consent. Repeated questions are bounded. Rejected requests before any reply/tool/effect restore prior history; completed-action recovery remains separate. Release and competitor writing gain observed-source guidance and deterministic disclosure/attribution checks. Original benchmark prompts are preserved; real capability grading has not been rerun. Native Windows and provider-account behavior has not been established here. The historical desktop motion/glass Actions job is not a CLI test or a current CLI blocker; see docs/WINDOWS-INSTALL-CHECKS.md. Beta publication is coordinated by the product team. This candidate is not a public installer.

# Koder CLI 0.4.0-preview.26-candidate.7

Source-only reliability and workflow skill candidate. Explicit ask/run prompts no longer wait for unrelated stdin; --stdin enables attachment, and incomplete input has a deadline. Automatic task facts are projected only into their own conversation; explicit shared notes retain their separate semantics. New creation tasks use the users Koder Projects folder while explicit/existing workspaces remain selected. Provider errors include bounded redacted reasons, model diagnostics use a short single-attempt budget, and explicit language reaches the actual request. Skill catalogs load on demand; the browser workflow is pinned with its license. Native Windows, whole-product, account and production release gates remain open. Not packaged or published.

## Retained candidate.6 source

# Koder CLI 0.4.0-preview.26-candidate.6

Source-only visual workflow and Netlify extension. Not packaged, published or accepted for production. Three real HTML directions, visual decisions and H5 project maps use the existing local preview and Agent service ports. Netlify supports protected token entry, configured ticket OAuth, exact-site binding, consented site creation, draft digest uploads, reconciliation and separately approved production publication. Local synthetic acceptance is separate from real OAuth, account, hosting, Windows and release acceptance. Koder-managed membership hosting is not configured.

# Retained candidate.5 mail and preview source

Source-only mail and preview extension. Not packaged for release, accepted for production or published. Preserves candidate.4 API and update-order repairs and integrates the frozen r7 mail/preview delta. Mainstream presets include Spacemail (Spaceship) with IMAP 993, POP3 995 and SMTP 465 over TLS. Custom POP3 TLS/STLS receiving, receive-only login and task-aware companion preview have focused local acceptance. Windows Actions and real mailbox/provider gates remain unverified. Microsoft server presets are present; OAuth login remains unavailable until configured.

## Retained candidate.4 API and update repairs

Internal lifecycle acceptance repair candidate, based on preview.26-candidate.3. Not accepted for production or published. The official preview.22 release and website remain unchanged.

MiniMax Messages responses retain their complete interleaved block sequence. Stream EOF before a completion marker is reported as an interrupted reply; incomplete tool calls remain blocked. A valid omitted-thinking response can resume in the same live chat without inventing a reasoning field. The in-memory absence witness is not reconstructed from disk or another account. HTTP 401 remains a credential rejection; memory isolation warnings still use disclosed RAM fallback. These are synthetic regressions, not acceptance of the reporting user account or Windows machine.

Koder Reverse 0.1.0 adds independently authored PE/ELF/Mach-O/WASM/ASAR metadata analysis, JS lexical project candidates, an ARM64 instruction subset, conservative graphs, evidence, query and extracted-fact comparison. Its analysis core uses only Node.js and first-party modules. It runs without the third-party REA directory. Existing REA remains available: full decompilation, dynamic analysis, complete architecture coverage and replacement acceptance are not finished. See docs/KODER_REVERSE.md.

After each eligible chat reply, up to three optional drafts use the visible conversation: explicit answer options first, then goal and phase-specific follow-ups. /prefill 1–3 fills a draft; the picker also lists current suggestions first. Users can edit, clear, ignore or disable them. Suggestions use local rules, make no additional model request, and do not persist conversation-derived text. Session, account and model changes invalidate stale suggestions.

The CLI and current chat expose editable task templates through /prefill, /prompts and the setup menu. Eight bilingual built-ins and explicitly saved local custom templates are available. Choosing a template does not submit it. Existing drafts, queued messages and approval input are protected; unsupported terminals receive copyable text. Multiline bodies are flattened before entering the single-line editor. See docs/PROMPT_PREFILLS.md.

This candidate retains the earlier API repair and bundled REA. Their previous host/Agent timeout failures, Windows NOT_RUN and provider availability holds remain open. A passing prefill check does not close those release gates. Optional Frida, platform PTY prebuilds and external native engines remain outside the bundle. See docs/REA.md and the prior acceptance record.

The updater recognizes the existing Koder private candidate spelling as part of the numeric preview track. A preview.26 candidate can discover preview.26 and later previews without changing precedence for unrelated prerelease identifiers. Candidate.3 remains preserved as a failed update-discovery baseline. Real Windows and provider-account acceptance remain separate gates.
