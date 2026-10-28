# Koder CLI 0.5.19: features and tutorials

Install using the [platform guide](INSTALLATION.md), configure a model with `koder setup`, then run `koder`. Installation and background activation do not open chat automatically. Enter tasks only at the `koder >` prompt.

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
| Installation and updates | `koder update`, `koder update auto status` | [Installation](INSTALLATION.md): official GitHub fallback, checksums and specific failure reasons. |

Use [Start here](START-HERE.en.md) for a first task. The [English course](courses/README.en.md) has 30 lessons; the [Chinese course](courses/README.zh.md) has 1,800 lessons. Both offer hands-on and developer material. Run `koder learn`, or print a lesson with `koder learn 3 --print --os linux --lang en`. Select `--track hands-on` or `--track developer`. The complete guides link the eight current-version terminal exports.

The [release notes](RELEASE-0.5.19.md) and `ACCEPTANCE-RESULTS.json` distinguish source tests, archive checks and device/account verification. Windows physical testing remains beta-owned. Signed macOS locked-screen operation remains an unsigned candidate. Platform-specific archives retain applicable features while excluding other-platform binaries.


For a restored session blocked by an old unconfirmed operation, follow [session recovery](SESSION-RECOVERY.en.md). `/reconcile` retains evidence and never replays the old action.
