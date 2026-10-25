# Developer course

Content baseline 0.4.11 · Expanded-course candidate. Existing koder learn remains available; --track is added in this candidate. If your public build lacks it, read this page or download the material. Reading never executes commands or connects accounts.

Suggested routes: beginners start with 1–7 and 16–18; daily use covers 8, 15 and 19–29; developers focus on 4–16, 18–22, 26 and 30. Estimated study times are not execution deadlines.

[Course index](README.en.md) · [Labs](../tutorial-labs/README.en.md)

# 01. Welcome to Koder boot camp

Allow 25 minutes

**Goal**：Distinguish the system shell, Koder chat and the practice project; finish an offline exercise and locate its files.

**Preparation**：Use a terminal with copy and paste. Read the installation guide if needed; do not reinstall a working copy. The coach uses a temporary directory, retained only if you choose to keep it. Use a separate folder for extended exercises.

## Developer track

1. Record the command, version, working directory, exit code and artifact path.

2. Run node --test in the bundled cart-lab first and observe the planted failure; then ask Koder to fix it and inspect the diff.

3. Require a failing baseline, passing checks and the resulting files. A model completion message is not evidence.

4. Keep teaching examples separate from live-account acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Write a learning record with version, shell, project path and temporary practice path. Identify which steps are offline and which need your model.

All four values must come from actual output. The learn coach is offline; ordinary ask/run uses the configured model. Temporary exercises are not durable deliverables.

## References

- [INSTALLATION.md](../INSTALLATION.md)
- [START-HERE.zh.md](../START-HERE.zh.md)
- [START-HERE.en.md](../START-HERE.en.md)

---

# 02. The banner and the prompt

Allow 20 minutes

**Goal**：Read the active directory, model and mode, and find help without mistaking the prompt for a completed task.

**Preparation**：Complete lesson 1, widen the terminal to at least 80 columns and prepare a harmless task.

## Developer track

1. Treat selection, draft insertion, submission and cancellation as separate events.

2. Check the menu at 80×24 and in a narrow terminal; fallback must remain readable.

3. For non-TTY/JSON calls, verify that animation and menus do not pollute output. Check session boundaries with two separate projects.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Annotate a redacted banner with version, directory, model and mode. Fill a menu draft, then cancel it without sending.

Explain the difference between configuration and execution. Canceling the draft must create no model task or file edit.

## References

- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)
- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)

---

# 03. Configure a model: give Koder a brain

Allow 35 minutes

**Goal**：Configure the service, protocol and model your account actually supports, then test text and tool round trips separately.

**Preparation**：Have your product type, model ID and official base URL ready. Supply the key only through the dedicated input or a secret manager. Live diagnostics may incur charges.

## Developer track

1. Use --key-env VARIABLE_NAME for a secret variable in CI, never the key value in arguments.

2. Use local fixtures for success, 401, 429, 5xx, content filtering and tool-protocol errors; check classification and redaction.

3. Keep diagnostic deadlines separate from long-task retry budgets, and distinguish fixture results from paid calls.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Create a key-free connection card: preset, model, protocol, base URL, text result, tool result and billing source.

Support each field with configuration or output. Mark unrun checks NOT_RUN rather than assuming success.

## References

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)
- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)

---

# 04. First task: read the diff, decide

Allow 30 minutes

**Goal**：Turn a vague request into a verifiable deliverable; inspect the diff and check the disk after rejecting or approving it.

**Preparation**：Use the coach cart or bundled cart-lab, not a critical project. Record existing changes before working in your own repository.

## Developer track

1. Translate the requirement into inputs, outputs, edge cases and invariants. Write tests that catch the actual bug.

2. Use git diff --check and inspect the diff; passing tests do not justify deleted assertions.

3. Record workspace, files, checks and exit codes. A final reply is not a file deliverable.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Add a zero-quantity case to cart-lab, fix the implementation and retain before/after test results and the diff.

An empty cart is 0; 200 cents ×3 plus 150 cents ×1 is 750; zero quantity contributes 0. Keep existing tests.

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 05. Command approval: run tests, stop shady ones

Allow 25 minutes

**Goal**：Distinguish ordinary checks, sensitive actions and OS permissions; reject unsafe commands and handle long tasks.

**Preparation**：Use a disposable directory. Read the working path, destination and files, not just the command name.

## Developer track

1. Test allow, deny and cancel using synthetic local files; denied or canceled writes must not execute.

2. Separate tool deadlines, task budgets and provider diagnostics rather than extending everything indefinitely.

3. Preserve UNKNOWN results and reconcile before retrying. Shell text alone cannot establish an external receipt.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Classify reading README, deleting a directory and sending mail; identify target, grants, confirmation and evidence.

Reading grants no deletion authority. Deletion needs a defined target and authorization; mail needs final-content approval and a receipt.

## References

- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

---

# 06. Choices: Koder asks you too

Allow 25 minutes

**Goal**：Use reviewable choices to move a task forward while distinguishing selection, action approval and delivery.

**Preparation**：Prepare a short website brief with audience, goal, content, style and constraints; omit passwords and customer lists.

## Developer track

1. Treat choices as task input, not permission to act.

2. Define acceptable headless defaults and test missing-approval cases separately.

3. Deliver preview URLs, files, start/stop instructions and unconnected services; visual feedback does not replace runnable artifacts.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Write a brief under 150 words requesting three options, then give three concrete revisions and two acceptance checks.

Each revision identifies a page region. Checks are observable, such as no horizontal overflow and the button opening the intended form.

## References

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 07. Slash commands: gears, brakes and undo

Allow 30 minutes

**Goal**：Steer, interrupt or queue during work, and insert slash-menu drafts without sending them accidentally.

**Preparation**：Use interactive Koder and a harmless task lasting several seconds. Non-TTY/JSON calls do not provide the same menu interaction.

## Developer track

1. Cover local sessions and agentd failure paths; local input must work without activation.

2. Verify steering in subsequent requests or the transcript, not just a status message.

3. Test that queued text cannot approve actions and that Esc/Ctrl+C leaves no dangling input listeners.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Record one steering input, two queued requests, a cancellation and a menu draft without external writes.

Steering is accepted or explicitly falls back; FIFO order is preserved, cancel does not replay tools and menus do not auto-send.

## References

- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)
- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)

---

# 08. Read-only questions, pipes and scripts

Allow 35 minutes

**Goal**：Write scripts with intentional stdin behavior and decide whether to continue from the exit code.

**Preparation**：Prepare a non-sensitive report.txt and configure a model before live ask calls. Use the pipeline syntax for your shell.

## Developer track

1. Use the bundled stdin-producer.mjs to exercise delayed EOF without paid calls.

2. For Koder acceptance use a local model fixture or an authorized test key; cover prompts, no prompts, --stdin, timeout and oversized input.

3. Check structured output as well as exit status. Preserve the detailed error code alongside usage or quality-gate failures.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Ask directly and via an explicit pipe using the same report.txt; record input usage, exit code and duration.

A prompt does not consume an unrelated pipe; --stdin requires complete input and failure prevents downstream publication.

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CLI-CONTRACTS.zh.md](../CLI-CONTRACTS.zh.md)

---

# 09. Code review with context

Allow 35 minutes

**Goal**：Get actionable review findings and prevent an unparsed JSON review from passing a CI gate.

**Preparation**：Prepare a small, explainable change in a test repository; define the scope when there is no repository or diff.

## Developer track

1. Treat review as a data interface: validate JSON shape, status and parsed rather than searching for “pass”.

2. Cover prose, empty output, partial JSON and provider errors; keep unparsed output nonzero.

3. Use constrained workspaces and read-only tokens; commenting and pushing are separately authorized actions.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Review the cart fix and report a substantiated finding or no demonstrated issue, with test evidence.

Do not invent a quota of findings. Real issues must be locatable and reproducible; parse or model failures cannot become approvals.

## References

- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 10. Fix until green: fix --check

Allow 40 minutes

**Goal**：Drive a fix with a reproducible failing check and preserve evidence instead of weakening tests.

**Preparation**：Copy cart-lab into a separate project. Its examples require Node; use the built-in coach if Node is unavailable.

## Developer track

1. For performance work, fix the input and measurement conditions; for refactors, preserve behavior rather than changing the test data.

2. Save runnable files, tests and next steps during long tasks.

3. Record actual attempts and duration. Targeted checks do not prove a full-suite pass.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Keep a failure, a fix and an independent rerun; explain root cause, change and validation in three sentences.

The bug omitted quantity. Fix the implementation, not the expectation; original and new edge tests pass.

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)

---

# 11. Flows and CI: agents in formation

Allow 45 minutes

**Goal**：Split repeated work into checked steps and prevent publication after a failed prerequisite.

**Preparation**：Complete lessons 8–10. Read the bundled flow-lab.json and use it with cart-lab. This example only runs local checks: no publication or model calls.

## Developer track

1. Define each artifact’s path, format, producer and consumer. Check a step succeeded before using {{step.output}}.

2. Use minimal CI permissions and protected secrets; repository or PR text is not authority.

3. Record cancellation, timeout and failure separately, and avoid replaying external effects on recovery.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Draw a check-to-summary dependency graph and inject a failure that prevents the success branch from running.

The dependency graph matches logs; failures, skips and passes are distinct, and nothing was published.

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [COMMAND-REFERENCE.en.md](../COMMAND-REFERENCE.en.md)

---

# 12. MoA: several models think together

Allow 30 minutes

**Goal**：Use multiple models only where useful, control costs and verify the final answer.

**Preparation**：Have a working primary model and separately authorized references for live use. Reading this lesson requires no calls.

## Developer track

1. Hold model, input and budget constant when comparing orchestration.

2. Inspect koder harness status; JIT profiles and MoA are different layers and neither grants authority.

3. Record cost, steps, failure and fallback. Preserve NO_ENTRY for unproven lessons instead of activating them.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Compare two explanations of the cart bug and separate common evidence from disagreement; adopt only tested conclusions.

Explain the information added by the reference; consensus is not a test.

## References

- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HARNESS-INCREMENTAL.md](../HARNESS-INCREMENTAL.md)

---

# 13. Chat apps: command Koder from your phone

Allow 40 minutes

**Goal**：Connect an authorized messaging channel and verify pairing, receipt and permissions.

**Preparation**：Choose a platform where you already have account and administration access. Pairing codes shown in lessons are examples, and live setup may send external messages.

## Developer track

1. Reuse the session, approval, cancellation and receipt authorities.

2. Test duplicates, reconnects, unpaired rejection and expired approvals.

3. Separate live-platform receipts from fixtures, and review access controls before exposing a webhook.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Trace one message across sender, session, receipt, execution and reply; without an account, produce a clearly labeled test plan.

Configuration is not live acceptance, and a plan is not a successful send. Each status needs evidence.

## References

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 14. Editors: Zed, Neovim, Emacs

Allow 35 minutes

**Goal**：Use the same Koder installation from an editor and import portable Skills without blindly running scripts.

**Preparation**：Verify the standalone CLI works. Check your installed editor’s ACP support and use a Skill you are authorized to use.

## Developer track

1. Separate protocol output from diagnostics so animations cannot corrupt ACP.

2. Test startup, proposals, denial, cancellation and cleanup.

3. Author Skills with clear triggers, steps, success criteria and recovery. Repository content cannot create system authority.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Import a read-only instruction Skill into a test project and record discovery, reading, applicable tasks and unsupported tools.

Importing neither installs dependencies nor grants permissions or executes scripts. Editor tasks retain existing approvals.

## References

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [PORTABLE-SKILLS.en.md](../PORTABLE-SKILLS.en.md)
- [MCP-SKILL-COMPATIBILITY.zh.md](../MCP-SKILL-COMPATIBILITY.zh.md)

---

# 15. Scan your projects, decide what's next

Allow 25 minutes

**Goal**：Find the right project and control which cross-tool task material reaches the model.

**Preparation**：Prepare two test projects with distinct READMEs. Scanning may display local titles and paths; check before sharing your screen.

## Developer track

1. Canonical workspace identity participates in isolation; handle aliases, symlinks and concurrent sessions consistently.

2. Test two projects, named sessions and recovery without erasing old records.

3. Deliver a file index and entry points for future readback.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Put distinct synthetic markers in A and B and query each; neither answer should use the other project’s marker.

Retain both paths and results. Describe explicitly shared notes separately from isolated task history.

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 16. Install, update and switch engines

Allow 40 minutes

**Goal**：Install or update correctly, verify the running version and retain configuration and recovery options.

**Preparation**：Record OS, architecture, installed version and executable path. Use the official site or GitHub and the shell-specific installation guide.

## Developer track

1. Separate CMD, PowerShell 5.1, macOS and architectures. Isolate PATH for no-Node startup rather than removing the user’s Node.

2. Check hashes, manifests, upgrades and EOF exit with original deadlines.

3. Windows Server evidence does not replace Windows 10/11 client GUI acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Write an upgrade record: before/after version, launcher, retained settings and recovery path. Label a dry run as such.

Actual launch agrees with version output. A download is not startup acceptance; record each platform separately.

## References

- [INSTALLATION.md](../INSTALLATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)
- [AUTO-UPDATE.en.md](../AUTO-UPDATE.en.md)
- [WINDOWS-INSTALL-CHECKS.md](../WINDOWS-INSTALL-CHECKS.md)

---

# 17. License and optional consent

Allow 20 minutes

**Goal**：Distinguish license acceptance, feature settings and action grants, and enable only what you need.

**Preparation**：Read bundled license, privacy and commercial-use information; use the documented contact for organizational licensing questions.

## Developer track

1. Model consent separately from availability; test defaults, migration and revocation.

2. Retain prior settings and never enable sensitive sources through an upgrade.

3. Name the missing layer in diagnostics rather than suggesting disabling protection.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

List the separate decisions for license acceptance, model access to mail and automatic replies.

None substitutes for another; sending must follow final confirmation or an explicitly authorized rule.

## References

- [COMMERCIAL-LICENSING.md](../COMMERCIAL-LICENSING.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 18. Computer and files: inspect, grant, revoke

Allow 45 minutes

**Goal**：Operate the browser or desktop within explicit grants and verify actual state after each step.

**Preparation**：Use owned test windows and public pages, leaving personal windows untouched. GUI work needs a supported driver and interactive desktop.

## Developer track

1. Bind target identity to observed platform handles/PIDs; matching titles alone are insufficient.

2. Clean up only owned resources and never terminate unrelated processes.

3. Separate discovery, calls, visible effects and user-task acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Type and read back in an owned window, revoke the relevant grant and verify later actions are blocked.

Retain target, grant, receipt and observed content. The revocation case must perform no extra clicks.

## References

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [WINDOWS-MCP-BUNDLED.en.md](../WINDOWS-MCP-BUNDLED.en.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 19. Memory storage, groups and devices

Allow 35 minutes

**Goal**：Understand workspace, session and shared-memory boundaries for concurrent work and recovery.

**Preparation**：Use two test directories and synthetic markers, never actual secrets.

## Developer track

1. Keep identity, storage, retrieval and caches aligned to the same workspace/session scope.

2. Test concurrent tasks and stale-lock ownership rather than blindly deleting locks.

3. Headroom changes the model view while retaining retrievable evidence; compaction is not authorization to erase data.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Perform an A→B→A isolation check and record visible content and expectations.

B lacks A’s private marker and A resumes; untested remote sync stays NOT_RUN.

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)
- [HEADROOM.en.md](../HEADROOM.en.md)

---

# 20. Learning, soul, reflection and proactive service

Allow 45 minutes

**Goal**：Configure learning, task harnesses, residency and mail alerts separately and verify when each actually runs.

**Preparation**：Start with minimal visibility. Residency is explicit; installation does not grant mail, calendar or browser-history access.

## Developer track

1. JIT chooses serializable seeds and uses existing provider, budget, permission and cancellation paths.

2. Experiences need cues, lessons, evidence and outcomes; self-evaluation alone proves nothing.

3. Test notify/silence, quiet hours, deduplication, unknown receipts and revocation.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Map binding, monitoring, reading, drafting and sending, including each input and approval; enable only needed stages.

Alerts need not expose full mail to a model; drafting is not sending, and SMTP acceptance is not proof the recipient read it.

## References

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [APP-USE-AND-LEARN.zh.md](../APP-USE-AND-LEARN.zh.md)
- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)

---

# 21. Gamma, applications and MCP

Allow 60 minutes

**Goal**：Turn connected tools into verifiable outcomes: invoke MCP, approve a mail send and upload or edit GitHub content safely.

**Preparation**：Use authorized test accounts, a test recipient and a private test repository. Enter secrets only in dedicated prompts. Reading the lesson requires no account binding; external actions are optional exercises.

## Developer track

1. Route external writes through existing approval, idempotency and UNKNOWN reconciliation rules; --yes does not replace mail/GitHub confirmation.

2. Keep artifact IDs, hashes, sizes and readback methods when shortening large results.

3. Test repository identity casing, head changes, rejection, timeout and recovery without normalizing case-sensitive paths or branches.

4. Fail explicitly when secure storage is unavailable; never leak tokens into prompts or plaintext.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Choose one connection and record status, operation and readback. Without an account, label the exercise NOT_RUN. Upload only a secret-free README.

Separate discovery, invocation and external effect. Distinguish SMTP submission from arrival and verify GitHub content against the receipt.

## References

- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)
- [MAIL-DELIVERY.en.md](../MAIL-DELIVERY.en.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
- [GITHUB-PROJECTS.en.md](../GITHUB-PROJECTS.en.md)
- [MCP-INTEGRATIONS.zh.md](../MCP-INTEGRATIONS.zh.md)

---

# 22. API, context and update troubleshooting

Allow 40 minutes

**Goal**：Identify the failing layer, collect minimal evidence and recover without repeating completed actions.

**Preparation**：Save current work without wiping history. Collect version, OS, failing command, error code and a few redacted log lines.

## Developer track

1. Preserve HTTP status, provider code and a redacted reason, with consistent user-facing wording.

2. Failed calls must not masquerade as successful history; unknown usage is not zero.

3. Recovery depends on task input, baseline, model settings and experience versions; recheck scope after cancellation or revocation.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Write recovery plans for an uncertain mail send and an empty web search. Start with evidence, not resending or reinstalling.

Reconcile mail submission and inbox state; check search URL, status and body rather than treating an empty response as absence of information.

## References

- [MINIMAX-CONTENT-REVIEW.md](../MINIMAX-CONTENT-REVIEW.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

---

# 23. Keep the right door open: Alibaba and Volcano plans

Allow 25 minutes

**Goal**：Distinguish plans from metered APIs and avoid mismatched regions, endpoints and billing products.

**Preparation**：Use key-free console product information. Do not run live exercises against disabled routes.

## Developer track

1. Route by preset and product identity, not a fuzzy model-name match that changes billing.

2. Track discovery timestamps and errors while retaining settings on failure.

3. Reconcile disabled entries with runtime metadata instead of inflating available counts.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Build a key-free product, region, endpoint, model and availability table.

Mark uncertain values pending and disabled entries unavailable rather than tested.

## References

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)

---

# 24. MiMo checkup: a reply is only the first step

Allow 25 minutes

**Goal**：Understand a tool round trip: request, execution, result and model continuation.

**Preparation**：When the MiMo Token Plan route is disabled, study it offline; use an available authorized provider for live checks.

## Developer track

1. Use scripted models for tool names, arguments, call-ID pairing and redacted HTTP errors.

2. Cover empty content with tool calls, streaming fragments, missing results and duplicate IDs.

3. Without credentials mark live MiMo acceptance NOT_RUN; a compatible fixture is not a live plan test.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Draw the four stages of a tool round trip and identify evidence for each.

A declaration proves visibility; a receipt records execution; continuation must use that result.

## References

- [MIMO.md](../MIMO.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)

---

# 25. Privacy paperwork, even with the Wi-Fi off

Allow 25 minutes

**Goal**：Find bundled privacy documents, understand data destinations and minimize disclosure.

**Preparation**：Use synthetic material rather than passwords, private mail or customer data.

## Developer track

1. Redact nested fields, URL parameters and error causes; never publish sensitive fixtures.

2. Test revocation, export and deletion against actual scope rather than UI labels.

3. Verify privacy text and provenance are bundled and respect third-party distribution rights.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Draw a synthetic project’s data flow from files to model, tools and receipts, marking external transfers.

Keys stay out of model context; selected task content may reach the model, and external writes need separate authorization and receipts.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [PRIVATE-RESOURCES.md](../PRIVATE-RESOURCES.md)

---

# 26. A real feedback address, without the secrets

Allow 25 minutes

**Goal**：Produce reproducible, secret-free feedback and grounded writing deliverables.

**Preparation**：Prepare a minimal reproduction and actual output. For writing, supply verified facts without implying nonexistent release changes.

## Developer track

1. Measure the primary written file rather than the chat sign-off and retain its path/hash.

2. Release writing needs sources or explicit non-increment disclosure; unsupported attribution still fails.

3. Record predecessor evidence for compression and add no new facts. Quality-gate exit 3 is not an API outage.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Write but do not send a bug email with version in the subject, minimal steps, actual error and requested help.

Facts are traceable, no keys or full private chats are included and unrun tests are not claimed.

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)

---

# 27. Six seconds of fun, with an exit right there

Allow 20 minutes

**Goal**：Use skippable animations without disrupting work or polluting script output.

**Preparation**：Use an interactive terminal. Animation needs no model and proves no task outcome; disable automatic effects when inappropriate.

## Developer track

1. Restore cursor, raw mode and listeners on completion, error and cancel.

2. Check TTY, dumb, CI and JSON paths without ANSI pollution.

3. Respect date-level deduplication and user settings instead of playing on every command.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Play, skip and disable an effect, then verify /help still works.

Skipping preserves input and animation is not used as acceptance evidence.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 28. Remember a birthday, not a dossier

Allow 20 minutes

**Goal**：Store minimal birthday information only by explicit choice, with review and removal.

**Preparation**：Practice with a fictional month/day. No birth year, age or ID is needed; mentioning someone else is not consent to record yours.

## Developer track

1. Distinguish explicit self-memory requests from quotations and third-party information.

2. Test invalid dates, leap days, repeated settings and removal, with notification deduplication.

3. Verify deletion in storage, not only in displayed text.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Set, inspect and remove a fictional date and record the final state.

The practice date is removed and no year or extra personal data was added.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 29. A birthday song, and a language you choose

Allow 20 minutes

**Goal**：Choose language and music explicitly without silently sharing location or opening audible pages.

**Preparation**：Check whether sound is appropriate. Prefer explicit language settings over IP-based guesses.

## Developer track

1. Use existing URL validation and browser grants; do not inject passwords or bypass site controls.

2. Keep localization natural and locale choices independent; inferred regions are not user facts.

3. Separate launch failure, unverified playback and refusal.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Record language, external-link consent, page opening and actual playback separately.

Opening is not playback, and playback does not grant download rights; unselected external actions do not occur.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [APP-USE-AND-LEARN.en.md](../APP-USE-AND-LEARN.en.md)

---

# 30. Graduation

Allow 90 minutes

**Goal**：Deliver a runnable, previewable project with verifiable results and a sourced written artifact.

**Preparation**：Choose a small website, app or presentation task in a separate Koder Projects directory. Use synthetic data and authorize deployment or GitHub writes separately.

## Developer track

1. Reproduce from a clean test directory using README and check the failure baseline, minimal diff, tests and package files.

2. Keep static previews local and never expose the home directory. Netlify login, site selection and deployment use existing approval flows.

3. Record version, hashes, commands, exit codes and platform; distinguish real Windows, models, accounts and signing.

4. Use the 30-lesson checklist to retain both regression and new-feature evidence.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## Scenario for validation

Submit README, runnable files, test logs, project-map.html, intro.md, release-email.md and an untested list. Exclude secrets, account caches and node_modules.

Check runnability, explanation, validation, recovery and grounded facts. Report gaps; screenshots do not replace execution and fixtures do not prove live-account success.

## References

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
