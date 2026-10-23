# Windows CLI verification

Current CLI beta: **0.4.0-preview.28**. This page scopes the CLI checks for the test team. It does not define a whole-product QA program or decide when the team ships a beta.

## What the local evidence establishes

The current development host is macOS. Local checks exercise CMD/bootstrap source contracts, the exact Windows extraction JavaScript under an ESM temporary directory with Chinese characters and spaces, workspace permission recovery, private-memory boundaries, ACP stdio, startup and update/restart subprocess behavior. These are source and macOS process checks. They do not execute Windows PowerShell 5.1, CMD, ConPTY, Windows ACLs or Windows replacement-file semantics.

Candidate.8 changes noninteractive clarification, pre-response failed-request history, writing disclosure checks and task-scoped prompt composition. Native Windows checks for those paths need no paid model: use the same scripted providers or an owned loopback model fixture. Missing credentials are not a reason to skip these cases.

## Remaining Windows steps for the test team

Use the matched candidate CLI/kernel revision and a disposable Windows user or VM. Record the source manifest or package digest, Windows version, terminal, exact command, exit code and output. Use an isolated candidate asset endpoint when checking an unpublished package; the public download currently points to a different version.

| Case | Procedure and expected result | Relevant source or test |
|---|---|---|
| CMD and PowerShell installation | Run the candidate installer in native CMD and Windows PowerShell 5.1. Accept the license; check stage/progress output, completion, launcher and `koder --version`. Repeat empty Enter, decline and Ctrl+C; refusal must not install or alter PATH. Normal installation must not require changing machine-wide execution policy. | `install/koder-cli.cmd`, `install/koder-cli.ps1`, `test/windows-bootstrap.test.mjs`, `test/install-consent.test.mjs` |
| Runtime and extraction | Use Chinese/space-containing user and TEMP paths, including TEMP below an ESM package. Test an existing supported Node runtime, missing runtime and an outdated runtime. Verify checksum failure leaves the existing installation intact. | `install/koder-cli.ps1`, `test/installer.test.mjs` |
| Startup and current-window menus | Run `koder --version`, `koder doctor`, `koder chat`, `/setup` and `/exit` in the same terminal. Skip startup animations; input, menu return and cancellation must remain responsive. These commands do not require granting admin privileges. | `src/commands/chat.mjs`, `test/one-shot-startup.test.mjs`, `test/automatic-update-responsive.test.mjs` |
| Noninteractive requests | Run the scripted headless/history tests with a matched kernel. An unrelated open stdin must not hold an explicit task; ask_user returns unanswered, not consent; repeated questions are bounded. Failed pre-response 400/401 requests must not increase history. | `test/reliability-regression.test.mjs`, `test/headless-history-contracts.test.mjs` |
| Windows permissions and memory | Exercise native ACL readback, Chinese user paths and corrupt execution-record recovery. Read-only directory commands must not fail solely because a BOM or damaged saved record was mistaken for an OS execution-policy denial. Refusal and revoked grants must remain effective. | `src/shared-memory/windows-acl.mjs`, `bin/koder-memory-acl.exe`, `src/execution-permissions.mjs`, `test/windows-acl-helper.test.mjs`, `test/execution-permissions-recovery.test.mjs` |
| ACP and process shutdown | Run initialize/new-session/prompt/cancel and close the host while an ACP child is active. Only protocol frames belong on stdout; no owned child or terminal should remain after shutdown. | `test/acp.test.mjs`, `test/acp-close.test.mjs`, `src/acp.mjs` |
| Update and restart | With two exact test package revisions, verify one restart, queued input consumed once, settings/history retained and startup failure falling back once. After replacement worker admission, failure must not replay input or completed tools. Check real Windows locks and file replacement. | `src/automatic-update.mjs`, `src/update-lifecycle.mjs`, `src/update-release.mjs`, `test/update-restart-process.test.mjs`, `test/candidate-update-order.test.mjs` |
| Writing failure versus API failure | Run writing contracts: a draft rejected by the evidence check exits 3 and retains its file; it must not say that the API failed or invite a model-only recovery retry. A real failure after a write retains the original recovery behavior. | `test/writing-evidence-contracts.test.mjs`, `test/api-continuation-audit.test.mjs` |

For an existing authorized source checkout, `node scripts/check-contracts.mjs --list` shows the deterministic runner and prompt hashes; `node scripts/check-contracts.mjs --kernel C:\path\to\matched-private-kernel` runs the source contracts. Native installer/ConPTY cases remain separate from this portable runner. Never send API keys with a report.

After the team publishes an accepted beta, read back the actual website/GitHub download, compare its digest with the release manifest, and repeat the normal CMD/PowerShell user journey. That is public-distribution verification, separate from candidate loopback assets.

## Historical desktop job correction

GitHub Actions run **39812325888**, head `9a420e5f181320dd7f74cbf2d0fd69e5e4bca670`, has a misleading older workflow display name. The workflow body at `.github/workflows/windows-followup.yml` is **Windows native motion and original glass verification**. It downloads `desktop-054-lifecycle-20261022.exe` and `desktop-motion-source-20261023-a.zip`, then invokes `.github/verification/run-motion.ps1` for motion/original groups. Both jobs have zero executed steps. This is not a CLI candidate run, a CLI failure, or evidence that current CLI validation is blocked. Its billing result does not justify a CLI billing change or repeated cloud dispatch. Historical raw records remain intact.

Provider account access is a separate fact. MiMo Token Plan, Kimi, Kimi Code, DeepSeek, Alibaba Token Plan and Volcano integrations remain gray and unavailable by the user's earlier decision; local adapter fixtures do not establish authenticated service access. Core, desktop glass/motion, account, OAuth and hosting checks are not dependencies of the candidate.8 CLI-only changes above.
