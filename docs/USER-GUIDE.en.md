[Start here: installation, first task and feature navigation](START-HERE.en.md)

Current release: **0.4.10**. Start with [release changes](RELEASE-0.4.10.md), [input and provider diagnosis](PROVIDER-WRITING-INPUT.md) and [independent terminal tasks](MULTI-WINDOW.md). The complete guide below retains existing workflows. Native Windows and authenticated-account limits are explicit in the release notes.

> Older updaters can reject this package above their 100 MB limit. Run the current official installer once to upgrade in place while retaining configuration and history; see the [migration guide](INSTALLATION.md#update).

This release includes default-on [Headroom context optimization](HEADROOM.en.md). The official installers and documentation identify the same release.

# Koder CLI complete user guide

Version: **0.4.10**. Check `koder --version`; older installations may have different behavior. Native Windows and real-account checks are recorded separately from local regressions.

## 1. Install in the right terminal

Use the matching Windows PowerShell, CMD, macOS, Linux or WSL instructions in [Installation](INSTALLATION.md). Download only from [the official website](https://karmenloop.com/download.html) or [KarmenLoop/koder-cli](https://github.com/KarmenLoop/koder-cli). Read the installed EULA and privacy documents before accepting. Personal noncommercial use is free; commercial use and organizational distribution need separate written authorization.

Normal installation does not require changing the machine-wide PowerShell execution policy or disabling security software. `accept` accepts the license; it grants no optional computer, messaging, learning or synchronization authority. A network delay, a canceled installation and an OS policy rejection are different conditions. The installer reports its stage and download progress; keep the exact error for diagnosis.

## 2. Connect your own model

Run `koder setup`. Choose the provider, exact account region and product, model ID, protocol and endpoint issued for your API or plan. A website subscription is not automatically API access. Gray provider entries are unavailable; switching billing routes is not a recovery method. Koder's native engine is the default; the optional fallback remains separately disabled.

Use an environment-variable reference when you want a saved profile without saving the key value:

```text
koder model set --model ACTUAL_MODEL_ID --base-url OFFICIAL_API_BASE --protocol openai --key-env MY_PROVIDER_KEY
koder model test
koder model test --tools
```

Supply `MY_PROVIDER_KEY` through your shell's protected secret input or CI secrets; the example names a variable, not a key. `--key-stdin` is a separate configuration path that saves the supplied key in the local model profile. Do not use that path if you require an environment-only key. Never paste a key into a task, command argument, screenshot or issue. A one-shot environment configuration can use `KODER_MODEL`, `KODER_BASE_URL`, `KODER_PROTOCOL`, `KODER_API_KEY`, `KODER_CONTEXT_WINDOW` and `KODER_MAX_OUTPUT`; use limits the provider actually supports.

`model test` has a ten-second overall diagnostic budget and no inference retries; it checks text or a harmless tool round trip. A normal task has a different inference budget. A diagnostic failure cannot establish whether an account's plan is valid without a real authorized account check.

## 3. Keep every project in its own folder

New website, presentation and app creation tasks launched without an explicit workspace use a new folder under **Koder Projects** in the user's home directory. Existing projects are reused. An explicit `-w` always selects that existing workspace. Project files do not belong in Koder's program installation.

```text
koder project create "Studio Site" --kind website
koder project create "Quarterly Review" --kind slides
koder project create "Studio App" --kind app
koder project list --json
koder project status
koder chat -w /absolute/path/to/existing-project
```

Inside the current chat, `/project create "Another Site" --kind website` creates and selects a separate project; `/project open "/absolute/path"` returns to an existing one. Switching closes the idle session and rebuilds it for the chosen workspace. Named collisions are rejected instead of merging files. Project metadata lives in `.koder/project.json`; it contains a project identity and path, not API credentials or a copied conversation.

## 4. Understand conversation isolation

The displayed session name `default` means the default session **of that canonical workspace**, not one global conversation. The same workspace and session can continue their saved history. Different workspaces and named sessions do not inherit one another's task transcript or automatically captured task facts. Explicitly managed shared notes are a separate feature and retain their declared scope.

```text
koder ask "Continue this project's task" --session release
koder ask "Start a separate investigation" --session investigation
koder ask "Start fresh in this project" --new
koder ask "Use no saved task history" --no-memory
koder memory show --json
```

Conversation storage is in the user's private Koder profile, indexed by canonical workspace and session. It is not put in the public website output folder. “Workspace isolation” describes the identity boundary; it does not mean every private record is physically inside the project. Old records are retained. Do not delete the whole profile to solve a context problem.

## 5. Use scripts and pipes deliberately

An explicit `ask` or `run` prompt does not wait for unrelated stdin. Add `--stdin` when you want to attach pipe contents. With no prompt, stdin supplies the task. Input must finish within the configured deadline; partial input is rejected before a model call.

```sh
koder ask "Explain the current project"
printf '%s\n' 'Build output to inspect' | koder ask "Summarize this" --stdin
cat task.txt | koder run
cat slow-report.txt | koder ask "Inspect this" --stdin --stdin-timeout 30
```

PowerShell: `Get-Content -Raw .\report.txt | koder ask "Summarize this" --stdin`. CMD: `type report.txt | koder ask "Summarize this" --stdin`.

The default complete-input limit is five seconds, configurable from 0.01 to 3600 seconds with `--stdin-timeout`. Input is bounded at 400,000 bytes. A producer that never closes is an input error, not an API failure. Explicit prompts no longer need `</dev/null` to work around an open pipe. Large or incomplete input is not silently submitted as a truncated task.

## 6. Choose Ask, Agent and language

`koder ask` answers without proposing file edits or commands. `koder run` performs a task using the available tools and original approval policy. `koder` starts chat. Use `--mode plan`, `code`, `execute`, `report`, `enhance`, `minimal` or `standard` when appropriate; a mode is not a new permission grant.

```text
koder ask "Explain the architecture" --lang en
koder run "Repair the failing check" --lang zh
```

`--lang` applies only to this invocation and reaches the model as an explicit response-language instruction. `koder lang en` saves a preference; `/lang en` changes the current chat. Code, identifiers and explicitly requested quotations retain their content. A provider may still fail to follow an instruction; that is distinct from omitting it from the request.

## 7. Approve operations by scope

Smart approval handles recognized low-risk checks and ordinary project edits. Sensitive or unknown effects ask for approval. Always allow applies to its recorded scope. `--approval auto|ask|full|deny` chooses the policy for a run. `--yes` does not override explicit deny, collect a password, grant OS accessibility/recording permissions or approve email and production publication. Full mode is not an operating-system permission bypass.

Inspect the exact target, command or diff before approving. An unknown result is not success; verify the state before retrying a send, payment or deployment. Repeated command approval and missing Windows OS authority are separate problems.

## 8. Review, fix and test

```text
koder review
koder fix "Repair the login failure" --check "npm test"
koder fix --check "npm test" --attempts 3
koder test
```

`fix` needs a description, a check command or explicit input. `--attempts` accepts 1–20; `--timeout` is a positive check deadline up to 86400 seconds. The missing-input message includes a usable example. A check may run a project's code; use the normal execution approval and the project's actual dependency/setup instructions. A green narrow check is not proof that the whole application or installer works.

## 9. Compare three directions before building

New website, presentation and app tasks use three real HTML directions. Compare layout, content organization and interaction, not just colors. Open the local browser review, switch tabs or compare all, choose a direction and leave a rating and comments. A rating below 3 requests revision. A confirmed existing design, small fix or explicit skip avoids unnecessary exploration.

Consequential choices can use 2–6 step diagrams with tradeoffs. Browser feedback returns to the current Koder task; it does not submit a task or grant execution/upload authority. A PPT preview represents sample slides and narrative order; an app browser prototype is not native-device acceptance. See [Visual workflow](VISUAL-WORKFLOW-AND-NETLIFY.md).

## 10. Keep a live companion preview

Use `/preview` in the current chat. Static pages use the local preview; frameworks attach to an already started, ready loopback development URL. Approved project writes or startup results can open the companion browser automatically. `/preview auto off` disables that behavior.

Preview does not install dependencies or start arbitrary scripts. Existing development-server HMR remains intact. Static refresh preserves active input or asks the user to refresh. Native apps need their simulator or device. The preview owner stops only its own resources. See [Mail and live preview](MAIL-AND-LIVE-PREVIEW.md).

## 11. Use the bundled browser and design methods

Ask Koder to inspect or test a page. The Agent can use `skill_catalog` to find the browser workflow, then `skill_read` with `ecosystem:agent-browser:core`. The core guide, references, three starter templates and Apache-2.0 license are pinned locally from Vercel's agent-browser repository. They are on-demand method files; this update does not install the external executable or a browser binary.

Koder first inspects the actual computer driver and authorized target, captures a fresh snapshot, acts with that snapshot's element identity, and observes the result. `COMPUTER_DRIVER_MISSING` means the host driver is not connected. Upstream `@eN` refs and Koder element IDs are different. Authentication state, cookies, sending and uploads require their actual authorization. Unknown results are checked before replay. Reference templates are never automatically executed.

The existing `ecosystem:skills:frontend-design` content and license already match the verified Anthropic upstream commit. It remains built in; unrelated skills were not repinned. Skill methods do not override user instructions or tool permissions. Loading every manual into every turn is unnecessary: catalogs are searched and resources read only when needed.

## 12. Deliver an H5 project atlas

At eligible project handoff, Koder creates a standalone H5 map from real project files. Search files, expand groups, inspect sizes and local reference candidates, and export its structure JSON. Keep the map with the delivered project.

Hidden/private paths, credentials, dependencies, symlinks and generated review/delivery folders are excluded. A limit or unreadable scope must be visible. The map is neither a fabricated architecture nor a semantic call graph or functional test. Inspect filenames and structure before sharing. `/visuals deliver` requests a fresh map explicitly.

## 13. Connect your own Netlify site

The intended flow is Connect → choose site → inspect output → authorize draft upload → review preview → separately approve publication. Use `/netlify` in chat or the Applications and MCP settings group.

Koder's browser login is gray until its own OAuth application is configured. Protected PAT entry is a separate path. Binding a site does not authorize upload. Drafts upload content externally and may be publicly accessible. A saved draft grant is restricted to one exact workspace/output folder/site. Production publication is separate, with identity readback. Unknown writes are reconciled rather than automatically repeated.

The first adapter accepts prebuilt static output. SSR, functions and native bundles need their real adapters. Koder-managed membership hosting, quotas and billing are not configured; a Koder membership cannot silently change a Netlify plan. See the complete [Netlify workflow](VISUAL-WORKFLOW-AND-NETLIFY.md).

## 14. Mail, apps and external messages

`/setup mail` supports the available 163, QQ, Gmail, iCloud, Microsoft and Spacemail presets, with actual availability and authentication requirements shown. Custom receive-only POP3 with TLS/STLS is supported where the server provides it. Microsoft OAuth remains unavailable until configured. Use the exact server and port table in [Mail and live preview](MAIL-AND-LIVE-PREVIEW.md).

Connecting an account is not sending authorization. Advertising, verification-code and automated messages are not automatically replied to. Verification codes remain outside model context. Model access to selected mail and actual sending have their separate consent. Classifications are estimates; inspect important mail yourself. An uncertain send is checked instead of resent.

## 15. Skills, resources, reverse analysis and suggestions

Use skills and resource-library results on demand. Downloaded pages, skills, archives and templates are untrusted reference data; they do not grant installation or execution authority. Resource rights remain with their sources. A privately licensed archive is not made redistributable by renaming or encryption.

Koder Reverse is a first-party static subset with explicit coverage, not an accepted complete replacement for every REA engine. It does not execute the target. See [Koder Reverse](KODER_REVERSE.md) and [REA](REA.md).

Context suggestions are optional editable drafts. Choose one, change it or type your own; selection is not submission. `/prefill`, `/prompts` and `/suggest off` remain available. See [Prompt prefills](PROMPT_PREFILLS.md).

## 16. Updates, recovery and privacy

Installed interactive chats check the official feed in the background and wait for an idle, verified handoff. Active tasks and unfinished drafts delay replacement. A changed license needs review. `koder update auto status|on|off` controls automatic checks. A failed preparation keeps the current conversation available; do not run a second installer over an active update.

A native Windows installation/restart check is separate from source-level tests. Back up the user's project and private profile using the documented paths before a manual migration. Never copy API keys or execution authority into shared memory. Read `koder privacy consumer`, `statement`, `agreement`, `desktop` or `sources` for the full installed notices.

## 17. Diagnose a failure without exposing secrets

- An invalid model or parameter reports HTTP status, host and a bounded, redacted provider reason when a supported JSON error supplies one. It does not dump response bodies or authorization headers.
- A diagnostic network failure uses a short single-attempt budget. Normal task transport has separate limits; downloads have their own much longer completion setting. Do not confuse these timeouts.
- `CONTEXT_BUDGET_EXCEEDED` means configured input/history/tools do not fit. Use the model's actual context/output limits; an optional numeric budget receipt contains counts, not conversation text. Catalogs load on demand to reduce fixed overhead.
- Incomplete streams or tool calls remain unexecuted. After a verified file action followed by a model failure, resume the model reply instead of replaying the action.
- A memory isolation warning may use the disclosed temporary RAM fallback. It does not mean administrator privileges will fix the model's HTTP 401.

Usage and invalid configuration return exit 2. Task/check failures use a nonzero result; successful commands return 0. Treat every nonzero status as unsuccessful in scripts rather than relying on the wording of the message. Preserve version, command, stage and redacted final lines for support.

## 18. Learn and find every command

The interactive coach has **30 lessons**, with PowerShell, CMD, macOS and Linux editions. It uses a disposable practice project and a scripted coach, so the tutorial needs no paid model call. `koder learn --print` gives the text edition; `koder help COMMAND` shows current usage.

The complete generated [command reference](COMMAND-REFERENCE.en.md) covers every documented command and global option in this beta. The version, lesson count and actual configured model are distinct values; there is no universal default paid model or implied subscription.

For a bug or licensing inquiry, `koder feedback` or `koder business` provides **info@karmenloop.com**. Nothing is sent automatically. The official site is [karmenloop.com](https://karmenloop.com).

## Download the eight text editions

- [koder-cli-0.4.10-en-cmd.txt](tutorials/koder-cli-0.4.10-en-cmd.txt)
- [koder-cli-0.4.10-en-linux.txt](tutorials/koder-cli-0.4.10-en-linux.txt)
- [koder-cli-0.4.10-en-mac.txt](tutorials/koder-cli-0.4.10-en-mac.txt)
- [koder-cli-0.4.10-en-powershell.txt](tutorials/koder-cli-0.4.10-en-powershell.txt)
- [koder-cli-0.4.10-zh-cmd.txt](tutorials/koder-cli-0.4.10-zh-cmd.txt)
- [koder-cli-0.4.10-zh-linux.txt](tutorials/koder-cli-0.4.10-zh-linux.txt)
- [koder-cli-0.4.10-zh-mac.txt](tutorials/koder-cli-0.4.10-zh-mac.txt)
- [koder-cli-0.4.10-zh-powershell.txt](tutorials/koder-cli-0.4.10-zh-powershell.txt)

## Structured reviews and headless Linux

`koder review --format json` follows up at most once when a successful model answer has no structured findings. If it still cannot parse a complete review, it exits 3 with `REVIEW_UNPARSED`; CI must not interpret that as a clean review. API failures retain their failure exit and are not retried by this follow-up.

On Linux, the application/connections host requires `secret-tool` (commonly supplied by `libsecret-tools`), a DBus session and an unlocked Secret Service such as gnome-keyring. A headless container without these cannot use protected connections. Koder does not install system packages or weaken credential protection automatically. Process-only memory does not satisfy the protected host requirement.

For a model configured only through environment variables, `model list` and `model context` inspect that model; change its limits with `KODER_CONTEXT_WINDOW` and `KODER_MAX_OUTPUT`. `update auto status` reports both a saved setting and the effective `KODER_AUTO_UPDATE=0` override when present.

Remote references are off by default. `koder resources search "keywords" --remote` authorizes that command to send keywords to karmenloop.com. Set `KODER_REMOTE_RESOURCES=1` to offer these tools to the Agent; set it to `0` to block them. Local private searches never fall back to the remote service.

## Headless operation and evidence checks

[CLI contracts](CLI-CONTRACTS.md) define stdin, unanswered clarification, temporary approvals, unchanged history after a rejected pre-response request, and exit codes. [Preserved blind prompts](BLIND-BENCHMARKS.md) separate deterministic runtime checks from real model grading. Unparsed reviews and unsupported writing attribution exit 3; they are not clean CI results.

## Writing and project delivery checks

See [Quality checks](QUALITY-CHECKS.en.md) for exact behavior and limits. A failed writing or delivery check returns exit 3, preserves files, and reports what remains unverified. It does not masquerade as an API failure. Project inspection is available without a model:

```sh
koder project check --kind service --json -w /path/to/project
koder project check --kind website --json -w /path/to/site
```

Use the existing authorized test command separately. A test file's presence does not prove it passed. Model presets now report catalog-derived selectable and temporarily unavailable counts; check your own account separately.


## Windows interaction and code graph context

Read [Windows-MCP and Code Graph setup](MCP-INTEGRATIONS.en.md) for current-terminal setup, platform/launcher checks, workspace binding, actual calls and disconnect behavior.


[Actual Windows-MCP and Code Graph acceptance](MCP-ACTUAL-ACCEPTANCE.en.md): tested platforms, native prerequisites and remaining limits.

## Feature quick reference

Use `koder skills list` and `/skill` for portable methods. Add input while the agent works; Setup selects steer or queue. Use `/harness deep-research` for research, or `koder harness off` for baseline behavior. App operations keep existing grants and driver limits. Missing persistent experience owners produce NO_ENTRY.

[Skills](PORTABLE-SKILLS.en.md) · [Input and Setup](SESSION-INPUT-AND-SKILLS.en.md) · [App use](APP-USE-AND-LEARN.en.md) · [Harness](HARNESS-JIT.md) · [Changes and limits](RELEASE-0.4.10.md)

## Residency and mail inquiries

After installation, verify `koder --version` reports 0.4.10, then configure a model with `koder setup`. Optionally run `koder activate`; inspect with `koder status` and disable with `koder deactivate`. Residency does not grant tool permissions. Mail, calendar and browser history are off by default. Setup controls quiet hours, reminder limits and visible sources.

Bind mail in Setup using masked authorization-code input. Separately enable `/mail model on` and `/mail inquire on` with their consent phrases. Related incoming mail can offer choices; a choice creates a draft, and sending still requires final preview and confirmation. Background mail checks also require mail visibility in resident settings. Advertisements and verification codes are excluded from inquiries.

[Complete resident guide](ALWAYS-ON.en.md) · [Complete mail guide](MAIL-PROACTIVE-INQUIRY.en.md) · [Changes and unverified paths](RELEASE-0.4.10.md). All 30 lessons and eight text editions remain; start with `koder learn`.

## Existing workflow guides

- [Bundled Windows-MCP](WINDOWS-MCP-BUNDLED.en.md)
- [Installation recovery](WINDOWS-INSTALL-RECOVERY.en.md)
- [Mail sending and background alerts](MAIL-DELIVERY.en.md)
- [Headroom context optimization](HEADROOM.en.md)

## MCP and Skill compatibility

[Catalog, switches, dependency checks and transport setup](MCP-SKILL-COMPATIBILITY.en.md) · [Inventory](MCP-SKILL-INVENTORY.md) · [0.4.10 changes](RELEASE-0.4.10.md).


Model updates: Setup → Model supports automatic discovery, manual refresh and an off switch. [Complete guide](MODEL-DISCOVERY.en.md).


[Automatic update guide](AUTO-UPDATE.en.md): activation now starts the updater in the current chat; natural-language controls are supported.


[Live input and diagnostics](SESSION-INPUT-AND-SKILLS.en.md): steering, queueing, cancellation, editable prompt choices and local logs.


[Command duration and saved progress](COMMAND-DURATION.md)
