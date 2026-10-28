> Context controls: [window, compaction and request estimates](CONTEXT-CONTROLS.en.md).

[Ubuntu 26.04.1 Desktop amd64 walkthrough](UBUNTU-26.04.md)

[Unlimited task rounds, budgets, subagents and Skill retrieval](TASK-ORCHESTRATION.en.md)

[Detailed 30-lesson course: hands-on and developer tracks](courses/README.en.md)

Retained since 0.5.0: [Awesome LLM Apps workflows](AWESOME-LLM-APPS.en.md); [SolidCraft CAD](SOLIDCRAFT.en.md) remains available. Existing [queue, model and effort controls](SESSION-CONTROLS.en.md) and [local application CLIs](cli-anything.md) remain available. The [Chinese classroom](courses/index.zh.html) contains 1,800 lessons.

# Start with Koder CLI 0.5.16

## Open Koder after installation

Ubuntu / macOS: run these in the system terminal. Skip setup if the model is already configured.

```bash
"$HOME/.local/bin/koder" setup
"$HOME/.local/bin/koder"
```

Enter tasks only after `koder >` appears. `activate` enables a background service; it does not open chat. If the full path works but `koder` does not, follow the [PATH walkthrough](UBUNTU.md) rather than downloading again. Use the actual installer path for custom installations.


Koder is a terminal coding and writing agent that uses your selected model API or compatible local model. It can work on project files, run approved commands and use configured Skills, MCP connections and applications. Your provider bills model usage separately. A catalog entry or an enabled setting is not proof of a working account or device connection.

## 1. Install or update

**On Ubuntu, start with the [24.04 walkthrough](UBUNTU.md) for downloads, model setup, permissions, desktop operations and troubleshooting. [中文教程](UBUNTU.zh.md).**

Use the [GitHub release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.16). Choose Windows CMD/PowerShell, macOS Terminal or Ubuntu 24.04; the installers select the matching platform package for the same release. The CLI is a separate download from the desktop application.

For an existing managed installation:

```text
koder update
koder --version
```

Expect `koder 0.5.16`. If an updater from 0.4.4 or earlier rejects the manifest, run the current GitHub installer in place without uninstalling or deleting settings. Follow [Installation](INSTALLATION.md) for shell-specific commands, license review and troubleshooting. An old executable earlier on PATH can still launch an older version: inspect `where.exe koder` on Windows or `type -a koder` on macOS/Ubuntu.

## 2. Configure a model and try a task

```text
koder setup
koder model test
koder model test --tools
koder
```

Choose your provider's correct region, API product or plan and an available model. The two model tests may incur provider charges. Gray integrations remain unavailable; the current list and limitations are in [Providers](PROVIDERS.md). Do not put a key or mail authorization code in a task or screenshot.

Start in a dedicated project directory. Ask Koder to inspect an existing project or create a small page, then inspect the produced files, changes and test results. New website, presentation and app projects can use the user's **Koder Projects** folder. Independent tasks should use separate project directories or explicit session names; see [Multi-window tasks](MULTI-WINDOW.md).

## 3. Control a running task

In interactive chat, `/` opens editable suggestions, templates and commands. A selected choice fills a draft; it does not send automatically. Setup lets you choose steering (the default) or FIFO queueing during a task. Esc/Ctrl+C cancel; queued text cannot approve a later permission prompt. See [Session input and Skills](SESSION-INPUT-AND-SKILLS.en.md) for fallback reasons and terminal limitations.

Ordinary commands have five minutes by default and recognized direct installs have fifteen minutes. An explicit request may allow up to thirty minutes. A short explicit deadline or curl's own limit still applies. Tool rounds are unlimited by default; `TASK_STEP_LIMIT` applies when a finite step budget was explicitly configured. Cancellation, cost limits and earlier results remain. See [Command duration and recovery](COMMAND-DURATION.md).

## 4. Find a workflow

| Goal | Guide |
| --- | --- |
| Follow the complete workflow | [Complete user guide](USER-GUIDE.en.md) |
| Look up commands and script exit codes | [Command reference](COMMAND-REFERENCE.en.md), [CLI contracts](CLI-CONTRACTS.md) |
| Improve code or deliver a document | [Task delivery](TASK-DELIVERY.en.md), [Content quality](CONTENT-QUALITY.en.md) |
| Import Codex, Cursor or WorkBuddy Skills | [Portable Skills](PORTABLE-SKILLS.en.md) |
| Configure and troubleshoot tools | [MCP/Skill compatibility](MCP-SKILL-COMPATIBILITY.en.md), [Inventory](MCP-SKILL-INVENTORY.md) |
| Use the bundled Windows driver | [Windows-MCP](WINDOWS-MCP-BUNDLED.en.md), [Install recovery](WINDOWS-INSTALL-RECOVERY.en.md) |
| Work with applications and unfamiliar websites | [Application use and learning](APP-USE-AND-LEARN.en.md) |
| Model, measure and export a parametric part | [SolidCraft CAD](SOLIDCRAFT.en.md) |
| Preview a website and publish an approved build | [Visual workflow and Netlify](VISUAL-WORKFLOW-AND-NETLIFY.md) |
| Bind mail, send and receive alerts | [Mail delivery](MAIL-DELIVERY.en.md), [Proactive inquiry](MAIL-PROACTIVE-INQUIRY.en.md) |
| Enable a local resident agent | [Always-on setup](ALWAYS-ON.en.md) |
| Manage task profiles or context | [Harness profiles](HARNESS-JIT.md), [Headroom](HEADROOM.en.md) |
| Refresh model IDs or update Koder | [Model discovery](MODEL-DISCOVERY.en.md), [Automatic updates](AUTO-UPDATE.en.md) |
| Diagnose incomplete work or API errors | [Runtime diagnostics](RUNTIME-DIAGNOSTICS.md), [Provider and input diagnosis](PROVIDER-WRITING-INPUT.md) |

Mail monitoring requires explicit authorization and a running host; polling, sleep, network conditions and notification settings affect timing. Binding an account alone does not authorize sending. Computer control still requires its own permissions. Read the installed EULA and privacy texts before accepting; personal noncommercial use and separately authorized commercial use have different terms.

## 5. Learn and verify

`koder learn` provides 1,800 Chinese lessons and the original 30 English lessons without a paid model call; the first 30 include interactive exercises. `koder learn --print --lang en` prints the English lessons. Eight Chinese/English editions cover Windows PowerShell, CMD, macOS and Linux; download them from the release or [complete guide](USER-GUIDE.en.md).

Eligible managed chat installations check for updates at startup and periodically, then install only while tasks, queues and drafts are idle. `koder update auto off` disables this; `koder update --check` only inspects the feed.

[0.4.23 release notes](RELEASE-0.4.23.md) distinguish the new website design workflow from retained features. Native Windows client, PowerShell 5.1 cold startup, ConPTY/IME, Windows-MCP GUI and live account/model acceptance remain separate device and beta checks. SolidCraft native modeling was exercised on Apple silicon; Windows and Intel Mac execution remain NOT_RUN here. Installation and local checks do not certify every device or service.

## Connect GitHub and host a project

Run koder github connect, or choose Setup → Apps / MCP → GitHub. Bind your own token to read repositories, create a private repository, commit selected files, edit README or repository copy, and open a draft PR. Each write needs approval; uncertain results require reconciliation. Follow the [complete guide](GITHUB-PROJECTS.en.md).


## Move devices and learn

Run `koder migrate` or use Setup. Follow the [migration guide](DEVICE-MIGRATION.en.md), verify the imported profile, then reconnect accounts. Open the [1,800-lesson Chinese classroom](courses/index.zh.html) for hands-on and developer tracks; the original 30 English lessons remain available. Browser notes can be exported.


## Retained: compact input and session Todo

The default dock uses two rows, or three with a Todo summary. Keep typing while work runs; Enter uses the selected steer/queue mode. Ctrl+T expands Todo, `/todo` prints the full list, and `/help` opens shortcuts. Press `/` in empty input and Tab to fill a draft. Adjust the footer in Setup → Session interface and apply changes with `/reload-tui`. [User and developer guide](SESSION-DOCK.en.md).


## 0.4.21: Skill discovery and child execution

[Walk through discovery and delegation](SELF-FETCH-AND-SUBAGENTS.en.md): source-scoped search, pinned installation, same-task continuation, model and effort selection, shared budgets and cancellation.


## 0.4.22: Website requirements and design

Default website intake, 84 offline reference documents, original approval and implementation workflow. [Hands-on guide](AWESOME-DESIGN-MD.en.md).


## 0.4.23: Website delivery and project anchors

Use the default Fullstack Web Delivery Skill to clarify requirements, retain project direction and implement or repair a website. [Hands-on guide](WEBSITE-PROJECTS.en.md).


## 0.4.24: Document questions

Use the default PageIndex Skill to navigate local documents, read selected sections and verify citations. [Hands-on guide](PAGEINDEX.en.md).


## 0.5.0: Invocation, OCR and professional roles

Read the [complete execution guide](FRAMEWORK-0.5.en.md). It covers installation checks, local OCR, role selection, FIFO concurrency, headless completion and platform limits.
