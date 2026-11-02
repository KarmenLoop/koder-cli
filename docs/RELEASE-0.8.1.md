# Koder CLI 0.8.1

[English](RELEASE-0.8.1.md) · [简体中文](RELEASE-0.8.1.zh.md)

Koder 0.8.1 brings the current task runtime, browser and data tools, context controls and managed components into one documented milestone release. It carries forward the implementation shipped in 0.7.2, updates every platform installer and current guide to 0.8.1, and makes the boundary between Koder-owned code and third-party components explicit. The version change is not a new benchmark result.

## Koder task runtime

Koder's own kernel connects goals, plans, model routing, tool execution, saved receipts and delivery checks. The task coordinator uses stable child request IDs, sends follow-up instructions to an existing worker, wakes the parent on result events and includes child file receipts in the parent's delivery check. Cancellation, permissions and cost budgets remain on the existing execution path. See [task orchestration](TASK-ORCHESTRATION.en.md) and [architecture and provenance](ARCHITECTURE-AND-PROVENANCE.en.md).

## Browser and data work

Web Data supports CSS and XPath extraction, saved records and evidence, and adaptive recovery from verified same-origin structural fingerprints. Dynamic pages use the managed Playwright runtime. Existing interactive browser tools cover navigation, clicking, form entry, keyboard input, frames, tabs, screenshots, PDF and authorized file transfers. Ambiguous matches remain partial. See [Web Data](WEB-DATA.md).

## Context, components and learning

Context budgeting, compaction and saved-history retrieval retain original receipts. Managed setup and diagnostics cover FFmpeg/ffprobe, Playwright, EARSHOT and CodeGraph, with platform and model prerequisites reported explicitly. The Skill store uses the existing installation and adaptation workflow. The package retains 79 unique Skill registrations and the current classroom, without carrying duplicate historical tutorial exports. See [context controls](CONTEXT-CONTROLS.en.md), [managed runtimes](TOOL-RUNTIMES.en.md) and [the Skill store](SKILL-STORE.en.md).

## Install and update

Use the [official download page](https://kodermodule.com/en/cli-download.html) for Windows, macOS or Ubuntu. Existing users can run `koder update`, then `koder --version`. Download progress, resume and checksum verification stay enabled. The [complete guide](USER-GUIDE.en.md) includes first launch, account sign-in, model setup and command learning. Settings, history, project files and existing grants are retained.

Koder develops its task orchestration, permission boundary and delivery logic in its private kernel. The distribution also includes adapted open-source runtimes and resources under their own licenses. Those components and their notices remain attributed; they are not presented as Koder-authored code. No third-party project endorses this release.

Exact 0.8.1 archive and command checks are recorded in ACCEPTANCE-RESULTS.json. Earlier real-model and browser evidence is labeled by version. Native Windows/Ubuntu installation and GUI, production human sign-in, live mail, visible system notifications, hour-long workloads and benchmark quality remain separate acceptance items.

## Release checks and remaining limits

The frozen 0.8.1 build record lists 44 source release checks and 348 checks against the extracted package (299 CLI and 49 kernel checks). These are separate sets, not a new model-quality score. It also records 14 macOS command checks and an isolated installation using an existing compatible Node runtime and an owned loopback mirror. That installation does not establish a public-network download or a no-Node cold install on another OS.

The runtime comparison found 20,760 unchanged files, excluding the version file. The 79 unique Skill registrations and eight license/attribution files match 0.7.2. This milestone consolidates the existing implementation, installers and documentation; it does not introduce a replacement executor or claim every bundled dependency as Koder-authored.

The one bounded MiniMax-M3 task and 19 macOS browser checks were run on **0.7.2** and were **not rerun on 0.8.1**. The model task used synthetic local data and an in-process account fixture. The browser matrix used an owned local page. They do not establish production authentication, all browser engines, hour-scale autonomy or a benchmark improvement.

Native Windows/Ubuntu installation and GUI, production human sign-in, live mail, visible OS notifications, hour-long workloads and MiniMax-M3.1-Flash benchmark quality remain **NOT_RUN**. Earlier failures remain in the [verification record](AGENT-VERIFICATION.zh.md). The original 0.7.2 Mac download timeouts are retained in that release's [download record](RELEASE-0.7.2.md#release-checks-and-remaining-limits); an independent machine's success did not prove recovery of the Mac network path.

**Published November 2, 2026.** The website owner's final delivery record reports **403/403 public checks** from an independent H3C machine using normal DNS and the default certificate store. All 32 original files, totaling 1,111,623,159 bytes, passed complete size and SHA-256 verification. The checks also cover 290 current guides, 12 localized page bodies, the stable feed, and the specified Range/If-Range and resume cases.

Two default updater checks completed successfully in 6.27 seconds: 0.7.2 discovered 0.8.1, and 0.8.1 reported that it was current. Both exited 0; neither installed an update. These are update-check results, not fresh platform installation acceptance. The website and updater records are separate from the frozen build checks above.

The public downloads were verified on H3C. Recovery of the original Mac network path and download throughput in mainland China remain **NOT_ESTABLISHED**. The publication does not expand the native-device, human-account or model-quality acceptance scope.

[Architecture and component provenance](ARCHITECTURE-AND-PROVENANCE.en.md) · [0.7.2 reference screenshots](screenshots/README.md)
