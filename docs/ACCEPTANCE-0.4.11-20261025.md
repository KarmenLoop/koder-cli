# Koder CLI 0.4.11 acceptance follow-up

Date: October 25, 2026. This record distinguishes the published package from subsequent, unreleased source repairs. No installer, update feed, release tag or production download was replaced during this work.

## Published package

The tested runtime is `koder-cli-0.4.11.tgz` from `cli-0.4.11`, 118,057,773 bytes, SHA-256 `7d56d6520421a301f93dc22d0af4a00bc9bc95cf5613a440ee2ae4def7188136`.

[Windows acceptance run 40188043928](https://github.com/KarmenLoop/koder-cli/actions/runs/40188043928) completed seven jobs successfully. Its test branch is `verify/cli-0411-acceptance-20261025`, commit `6e29a1ffaa92ea957bd1c2e4c67015bb96ef826a`. The workflow contains acceptance scripts, not private runtime source or credentials.

| Native environment | Case | Result |
| --- | --- | --- |
| Windows Server 2025 x64 | CMD, no available Node on the child PATH | Passed |
| Windows Server 2025 x64 | Windows PowerShell 5.1, same runtime isolation | Passed |
| Windows Server 2025 x64 | Original installed 0.4.10 updater to 0.4.11 | Passed |
| Windows 11 ARM64, build 26200 | CMD, no available Node on the child PATH | Passed |
| Windows 11 ARM64, build 26200 | Windows PowerShell 5.1, same runtime isolation | Passed |
| Windows 11 ARM64, build 26200 | Original installed 0.4.10 updater to 0.4.11 | Passed |

All cases used the original published installers/updater and an owned Node 22.23.3 runtime. Each final installation matched all 25,542 regular archive files. Commands completed with verified stdout/stderr EOF; no case exceeded its existing 100-second limit. Both upgrades preserved the fixture's user settings. Existing global Node files were unchanged, and the fixture's user PATH changes were restored.

The installer feed was a versioned loopback server containing verified published bytes. These results exercise native installation and replacement, but do not represent the complete public website download journey. Node was absent from the installer child's PATH; preinstalled global runtimes were left untouched. No machine-wide PowerShell execution policy was changed.

## Actual Windows-MCP GUI calls

The seventh job used the published bundled Windows-MCP 0.8.8 and its embedded x64 Python in an interactive Windows Server desktop. The original CLI registered the bundled preset and discovered the actual tool schemas. A scripted model then requested App, Click, Type and Snapshot through the original Agent and approval path. Independent HWND, process and point-occlusion checks fenced two disposable Tk windows. Text arrived only in the intended window; the screenshot and digest were saved. Core workers and both windows exited normally without forced cleanup.

This is actual GUI execution, with nine scripted model requests and no paid model calls. It does not establish natural-language model planning, Windows 10/11 x64 client GUI, UAC interaction, IME, multiple monitors or native ARM64 MCP support. The bundled Windows-MCP distribution is x64; ARM64 CLI installation passing does not change that restriction.

## Actual GitHub operations

Two isolated runs used an existing authorized GitHub account through Koder's protected native credential adapter and synthetic private repositories. Each run executed 13 CLI commands: connect, inspect binding, create a private repository, commit selected local files, read them back, edit and reread a file, update description/homepage, verify the repository, disconnect, inspect the disconnected state, and confirm that further repository access is rejected. Four remote writes required confirmation in each run. The final denied command exited 1 as expected; the preceding commands exited 0.

The baseline used the archived 0.4.11 package. The second run exercised the case-normalization repair with an uppercase account spelling. Tokens were held in process memory and the original protected credential store; they were not written to plaintext logs or files. Temporary credential items were removed. The two private repositories retain synthetic acceptance content for audit.

The input and confirmation UI were test ports around the real credential adapter and real GitHub requests. Windows token entry, new PAT issuance, OAuth/device login, SSO, organization policy restrictions, draft PR creation and real-model task planning remain untested. The later repair that prioritizes an older unresolved receipt was tested locally, not by deliberately creating an uncertain live remote write.

## Unreleased repairs

| Problem | Change | Verification |
| --- | --- | --- |
| Case changes could miss unresolved GitHub receipts or misroute personal-repository creation | Compare account/repository identities without case; preserve case-sensitive Git branches and file paths. Reconcile pending/unknown records before newer confirmed records. | Five added regression cases, existing GitHub tests and the uppercase-owner live round |
| MCP result compaction could turn an artifact envelope into invalid JSON | Keep the bounded artifact ID, SHA-256, size, reader and unknown/error state in a valid JSON projection. Protected raw results and task-scoped read authority remain unchanged. | A two-MiB result is read back through the original paging path; compaction and JIT projection tests |
| Unselected Skill metadata crowded an 8K model window | Defer unselected portable metadata in small windows; retain explicit selections and the original catalog/read tools. | Original long-conversation test and portable Skill discovery/read tests |
| A fast model diagnostic claimed retries it had not performed | Describe provider unavailability without inventing retry activity. Task calls retain bounded retries; diagnostic calls retain their fast single-request behavior. | HTTP 503 diagnostics in both languages plus Anthropic task retry/query tests |

Three older test contracts were corrected: permission denial now expects an incomplete-task exit, the Anthropic retry case exercises a task instead of the intentionally nonretrying diagnostic, and the healthy-gateway fixture uses the same HOME as its CLI invocation. No permission or no-dispatch assertion was removed. The package test was rerun independently under its existing 180-second per-test allowance; the earlier broad runner had overridden it with a 60-second file limit.

Final targeted local checks: 56 task/API/context tests, 81 MCP/Skills/context/gateway tests, 41 kernel GitHub/portable-Skill tests, 71 Windows/update/GitHub/MCP/permission tests, and two unpacked-package tests: **251 passed**. The package tests loaded their own bundled workers and SDK and also verified that an incomplete package cannot borrow a source checkout or global SDK. These are local/scripted checks, separate from the seven native Windows jobs above.

The earlier broad suite was stopped after exposing seven failures. Its raw failures and interruption record are retained; every observed failure was subsequently classified and covered by a targeted passing check. The full suite was not rerun to completion, so this is not a full-suite pass. Published-package Windows results do not certify the repaired source on Windows.

## Remaining checks and rollback

- Windows 10 and Windows 11 x64 client install/update and GUI, physical keyboard/IME, ConPTY, UAC, multi-monitor behavior, locked-file rollback and user-session restart.
- Windows GitHub credential entry/protected storage and real-model upload/edit planning.
- A native Windows run of the repaired build, public installer download journey, full regression completion and the previously deferred real-provider/mailbox checks.

Source changes are isolated from the published package. The private handoff contains an exact diff, baseline and changed-file digests, commands, exit codes, raw receipts and a mechanically checked forward/reverse patch. Rollback means discarding that isolated repair copy or applying the reverse diff to its exact baseline; never reverse it over unrelated work. A future distribution must use a new version and new digests, not replace `cli-0.4.11` in place.
