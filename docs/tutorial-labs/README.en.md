# Practical labs and developer exercises

Baseline: Koder CLI 0.4.11. These fixtures contain synthetic data and no accounts or credentials. Copy them into a separate project before editing. The standalone Node examples need Node but no third-party dependencies. The built-in coach is an alternative when Node is not available in your shell.

## 1. Fix the cart (lessons 1, 4, 5, 9, 10)

1. Copy `cart-lab` into your own test project and enter it in a terminal.
2. Run `node --test cart.test.mjs`. Expect **2 passes, 2 failures, exit 1**. Quantity is deliberately ignored: the multi-item total is 350 rather than 750, and zero quantity produces 200 rather than 0.
3. Explain the cause, then ask Koder to fix `cart.mjs`, preserve every test and rerun the same command. Live agent work needs an authorized model; you can also solve it manually.
4. Inspect the diff. Fix the calculation rather than deleting tests or hard-coding the expected result.
5. Rerun the command: expect **4 passes, no failures, exit 0**.
6. Compare with `solutions/cart.mjs.txt` only after trying. Keep the failing baseline, passing result and diff.

## 2. Failure branches in a flow (lessons 8, 11)

Read `flow-lab.json`; shell commands use `run` and conditional steps reference a step’s status through `when`. Run `koder flow run flow-lab.json` in the buggy copy and review any license/approval prompts. No model calls or publication are involved.

Expect unit to fail, ready to skip and blocked to pass (its internal output is `CHECKS_FAILED`), with a nonzero overall result. In a separately fixed copy, unit and ready pass, blocked skips and the result is zero. This example omits `continueOnError`, so a failed unit check makes the overall result nonzero. Setting it to true tolerates that failure and can produce overall exit 0; do not use it for a required CI check. Shell commands are not intrinsically read-only.

## 3. Standard input and exit codes (lesson 8)

`node stdin-producer.mjs 250` writes one synthetic line, then waits 250 ms before EOF. It accepts delays from 0 to 5000 ms; invalid input exits 2. The producer itself makes no model calls.

With an authorized model, run `node stdin-producer.mjs 250 | koder ask "Summarize the input" --stdin`. Compare an explicit prompt without `--stdin`; it should not consume the unrelated pipe. Read the exit status immediately: `$LASTEXITCODE` in PowerShell, `echo %ERRORLEVEL%` in CMD or `echo $?` on macOS/Linux. Another command can overwrite it.

Consumers must check status, JSON and task requirements, not merely nonempty stdout. Without a model, test only the producer and mark the Koder request NOT_RUN.

## 4. Concurrent projects (lessons 2, 15, 19)

Create A and B with distinct READMEs and synthetic markers `TRAINING-A-ALPHA` and `TRAINING-B-BETA`. Open Koder in each. Give A its marker, ask B about A’s task, then return to A. Record paths, session names and output. B must not automatically inherit A’s private task facts; explicitly shared notes have a separate scope. Use no real secrets and clean up only your own fixtures.

## 5. Connected tools (lessons 18, 20, 21)

Plan first, then execute only with authorized accounts/devices:

| Scenario | Positive evidence | Negative/recovery case |
| --- | --- | --- |
| Windows-MCP | Doctor, actual call, readback in an owned window | No click after revocation; honest missing-driver result |
| Mail | Connection, final approval, SMTP receipt, test inbox | Cancel sends nothing; reconcile UNKNOWN |
| GitHub | Bound identity, selected README, SHA, readback | No write on denial; re-read changed heads; reconcile uncertainty |
| Background alerts | Enabled, activated, running and notification receipt | Quiet hours, daily cap and disabled checks |

Use your own recipient and a private test repository. Do not send to example placeholders. Missing accounts/devices mean NOT_RUN, not a fabricated success.

## 6. Grounded writing (lessons 26, 30)

Ask for an approximately 800-Chinese-character decision-maker introduction in `intro.md`. Review the primary file against the task’s counting rule and cover problem, benefit, risk, integration, limits and next action. Do not measure only the chat sign-off.

Next ask for an early-user email about preview.22 without supplying a change list. Read actual release/change/acceptance sources. If none exist, explicitly describe existing capabilities rather than claiming new features in that release. Never attribute current 0.4.11 functionality to a historical version without evidence.

Compress a sourced comparison while recording the predecessor path/hash. New facts must be a subset of the original. Do not invent competitor prices. Quality gates are distinct from API connectivity; this course makes no new blind-benchmark score claim.

## 7. Preview and handoff (lessons 6, 30)

Build three structurally different static options under `site/`. Open them before selecting one. In the same chat use `/preview start --directory site`, `/preview status` and `/preview stop`. A standalone `koder preview start --directory site` owns a foreground server until Ctrl+C; another process does not own its status.

For framework apps, follow README to start the dev server, then connect its real local URL. Never expose the installation or home directory. Test narrow layouts, focus, keyboard access, links and empty forms. Label unconnected backends. Request `project-map.html` grounded in actual directories, entry points, modules and data flow.

## 8. Delivery audit (all lessons)

Copy `acceptance-template.md` and record version, scope, prerequisites, commands, exit codes, evidence and cleanup. Separate local fixtures, real models, Windows GUI, live accounts and production deployment. PASS needs executed evidence; retain FAIL output; explain NOT_RUN; reconcile UNKNOWN. Finishing a lab does not authorize a release.
