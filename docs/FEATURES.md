# Koder CLI 0.6.3: features and tutorials

Install using the [platform guide](INSTALLATION.md), sign in with `koder login`, configure a model with `koder setup`, then run `koder`. Installation and background activation do not open chat automatically. Enter tasks only at the `koder >` prompt.

| Workflow | Entry point | Guide and limits |
| --- | --- | --- |
| Code, writing and file delivery | `koder`, `koder run` | [Task results](task-results.md): check actual files and verification receipts. |
| Website planning, design and preview | Describe the website in chat | [Website delivery](website-delivery.md): applicable design stages load by default; a local preview is not deployment. |
| Models, reasoning and context | Setup, `koder model`, `koder context` | [User guide](USER-GUIDE.en.md), [context controls](CONTEXT-CONTROLS.en.md): only configured models and supported settings are used. |
| Independent chats and live input | Separate terminals; steer, queue or cancel | [Multiple windows](MULTI-WINDOW.md): queued text does not approve actions. |
| Skills and local learning | `koder skills`, `koder learning status` | [Learning](AUTONOMOUS-LEARNING.md): one canonical resource per capability, with persistent off controls. |
| Apps, MCP and installed software | `koder apps`, `koder mcp` | [App use](APP-USE-AND-LEARN.en.md): connected tools first, then authorized browser or desktop tools. A launch request is not proof of GUI completion. |
| Disk, memory, settings and antivirus | `koder care status` | [Computer care](COMPUTER-CARE.zh.md): bounded inspection, reversible file plans and user confirmation; no automatic malware removal. |
| Mail and GitHub | Setup, `koder mail doctor --json`, `koder github` | [User guide](USER-GUIDE.en.md): private credential input, actual account permissions and explicit write confirmation. |
| Background work and reminders | `koder activate`, `koder notifications status` | [Always-on guide](ALWAYS-ON.zh.md): quiet hours, limits and off controls; submitted notifications are not display verification. |
| OCR, indexing and application resources | `koder ocr`, `koder pageindex`, `koder llm-apps` | [User guide](USER-GUIDE.en.md): resource availability and successful execution are separate evidence. |
| Migration, headless work and telemetry | `koder migrate`, `koder run --json`, Setup | [User guide](USER-GUIDE.en.md): exact artifact contracts; local telemetry is on by default and can be disabled. Cloud log upload is not enabled. |
| Installation and updates | `koder update`, `koder update auto status` | [Installation](INSTALLATION.md): official website updates, checksums and specific failure reasons. The retained GitHub channel ends at 0.5.21 and cannot confirm the newest release. |

Use [Start here](START-HERE.en.md) for a first task. The [English course](courses/README.en.md) has 30 lessons; the [Chinese course](courses/README.zh.md) has 1,800 lessons. Both offer hands-on and developer material. Run `koder learn`, or print a lesson with `koder learn 3 --print --os linux --lang en`. Select `--track hands-on` or `--track developer`. The complete guides link the eight current-version terminal exports.

The [release notes](RELEASE-0.6.2.md) and `ACCEPTANCE-RESULTS.json` distinguish source tests, archive checks and device/account verification. Windows physical testing remains beta-owned. Signed macOS locked-screen operation remains an unsigned candidate. Platform-specific archives retain applicable features while excluding other-platform binaries.


For a restored session blocked by an old unconfirmed operation, follow [session recovery](SESSION-RECOVERY.en.md). `/reconcile` retains evidence and never replays the old action.

For opt-in repairs to Koder itself, use `koder self-repair on` and describe a reproducible error in a local task. [Local repair](SELF-REPAIR.md) covers seven feature modules, typed reproduction tests, next-start activation and rollback. It does not replace core control modules or train model weights.

## Local failure reports (0.6.2)

Failed or unverified tasks provide a report ID, specific codes and execution state. Use `/error copy` in chat or `koder logs report --json` in a terminal. Reports stay local, exclude content and credentials, and honor the Setup telemetry switch. [Guide](ERROR-REPORTS.md) · [中文教程](ERROR-REPORTS.zh.md).

## Included since 0.6.1

[Goals and continuous delivery](GOALS-AND-PLANS.zh.md), [long-task context controls](CONTEXT-CONTROLS.en.md), [30,000-second command waits](COMMAND-DURATION.md), [device, audio and security tools](DEVICES-AUDIO-SECURITY.zh.md), and [interface composition](INTERFACE-COMPOSITION.zh.md) use the existing runtime. Interface templates do not rewrite the kernel. Mail cleanup recovery and official-site updates are included. See [release evidence and known limits](RELEASE-0.6.2.md).

## Included since 0.6.2

Sign in through the [KARMEN browser or QR flow](ACCOUNT-LOGIN.md) before your first task. [Local feature repair](SELF-REPAIR.md) runs synchronous functions in an isolated interpreter without kernel or host I/O access. Existing interface composition, cancellation, permissions and cost budgets remain in place.

## New in 0.6.3: account state, sessions and learning

Correct signed-in status, valid refresh grants and first-message `MEMORY_BUSY` caused by a default-session collision. Explicit session ownership is retained. [Sign-in and recovery](ACCOUNT-LOGIN.md).

[Command and topic lessons](COMMAND-LEARNING.en.md) explain slash commands and provide unit selection and title search. [Local checks and diagnostics](DIAGNOSTICS.en.md) inspect configuration, Skills and local errors. The cloud service is still unconfigured; a local queue is not an upload receipt.
