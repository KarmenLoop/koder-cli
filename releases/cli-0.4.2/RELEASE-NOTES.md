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
- Windows PowerShell: download [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1). Follow the shell-specific command in the [installation guide](INSTALLATION.md); no permanent system execution-policy change is required by this release.
- macOS, Apple silicon or Intel: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh`.
- Existing installation: run `koder update`, then `koder --version`; expect `koder 0.4.2`.

The CLI archive, installers, release manifests, SHA256SUMS and eight English/Chinese PowerShell/CMD/macOS/Linux tutorials are published together. The desktop application has its own channel; these are CLI installers, not a new desktop EXE or DMG.

## Guides

Read the [English guide](USER-GUIDE.en.md), [Chinese guide](USER-GUIDE.zh.md), [portable Skills](PORTABLE-SKILLS.en.md), [bundled workflows](VIDEO-BROWSER-SKILLS.en.md), [input and Setup](SESSION-INPUT-AND-SKILLS.en.md), [application use](APP-USE-AND-LEARN.en.md), and [task harness profiles](HARNESS-JIT.md). All 30 interactive lessons remain, and complete printable editions include a new feature quick reference. Original preview and candidate notes remain as historical evidence.

## Verification and known limitations

The frozen candidate.6 passed 35 selected kernel tests and 70 CLI regressions. Its unpacked runtime passed 38 package checks across 27 CLI subprocesses, 35 JIT checks and 19 application-use checks. These layers overlap; they are not a count of unique scenarios. Final 0.4.2 packaging, website and live-download checks are recorded separately in the release acceptance receipt.

Seven inherited regression failures remain recorded: four earlier planning/suggestion/tutorial fixture failures and three 8K-context cases reproduced on the unchanged candidate.5. Selected passing suites are not a fully green product suite. Native Windows 10/11 GUI, final-package no-Node cold installation/update and authenticated external accounts remain unverified by this Mac publication run. No new real-model quality score or cost reduction is claimed. Existing unavailable provider routes remain unavailable as documented.

The standalone CLI has no default persistent Skill maintenance owner. Cross-task profile evolution reports `NO_ENTRY: experience-port-unavailable` without that existing authorized host port. A completed task alone never establishes a winning profile; paired evidence is still required. Bounded delegation runs serially unless an existing authorized delegation tool is present.

Published at the user's explicit request with these limitations retained. Previous releases remain available for rollback. Personal noncommercial local use is free under the included EULA; commercial use requires separate written authorization. Original third-party licenses and notices remain intact.
