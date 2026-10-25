# Hands-on course

Content baseline 0.4.11 · Expanded-course candidate. Existing koder learn remains available; --track is added in this candidate. If your public build lacks it, read this page or download the material. Reading never executes commands or connects accounts.

Suggested routes: beginners start with 1–7 and 16–18; daily use covers 8, 15 and 19–29; developers focus on 4–16, 18–22, 26 and 30. Estimated study times are not execution deadlines.

[Course index](README.en.md) · [Labs](../tutorial-labs/README.en.md)

# 01. Welcome to Koder boot camp

Allow 25 minutes

**Goal**：Distinguish the system shell, Koder chat and the practice project; finish an offline exercise and locate its files.

**Preparation**：Use a terminal with copy and paste. Read the installation guide if needed; do not reinstall a working copy. The coach uses a temporary directory, retained only if you choose to keep it. Use a separate folder for extended exercises.

## Hands-on steps

1. Run koder --version in the system shell, note the version, then run koder help.

   **Check**：Both commands return readable output. If the executable is missing, use lesson 16 before continuing.

2. Run koder learn and select your actual shell in lesson 1.

   **Check**：A practice path appears. The scripted coach makes no paid model calls, but its file edits and tests are real.

3. Press Enter to continue, jump to lesson 4 with 4, reject one edit and accept another. Quit with q, then reopen koder learn.

   **Check**：Progress can resume. Quitting normally removes the practice files; saved progress does not mean saved project files.

4. For your own work, leave the lesson and run koder project create "Learning Site" --kind website, then koder project list --json.

   **Check**：The project has its own directory. Use the returned path instead of guessing or reusing a temporary practice path.

## Troubleshooting and recovery

- **The cart disappears after q**：This is practice cleanup. Choose to keep it in the graduation lesson if you need the files.
- **The shell does not recognize /setup**：Enter koder chat first, or use koder setup in the shell.

## Assignment and acceptance

Write a learning record with version, shell, project path and temporary practice path. Identify which steps are offline and which need your model.

**Acceptance**：All four values must come from actual output. The learn coach is offline; ordinary ask/run uses the configured model. Temporary exercises are not durable deliverables.

## References

- [INSTALLATION.md](../INSTALLATION.md)
- [START-HERE.zh.md](../START-HERE.zh.md)
- [START-HERE.en.md](../START-HERE.en.md)

---

# 02. The banner and the prompt

Allow 20 minutes

**Goal**：Read the active directory, model and mode, and find help without mistaking the prompt for a completed task.

**Preparation**：Complete lesson 1, widen the terminal to at least 80 columns and prepare a harmless task.

## Hands-on steps

1. Run koder and read the version, model and directory before entering a task.

   **Check**：The directory must match your project. A displayed model name is configuration, not a connectivity test.

2. Enter /help, then /setup; exit Setup back to the conversation.

   **Check**：Help and Setup open in the current CLI session.

3. Press / on an empty line, select with arrows and fill with Tab. Edit before submitting.

   **Check**：Selection fills a draft. Esc closes the menu; use /help or completion if the terminal cannot render it.

4. Open Koder in a different project in a second window and inspect both directories.

   **Check**：Each window should work independently. Preserve the full occupancy message if you intentionally share a session.

## Troubleshooting and recovery

- **Broken borders or wrapped menu**：Widen the window or choose a plain banner in Setup; retain model settings.
- **A session appears occupied with one window visible**：Record version and session name; inspect other terminals or residency before deleting anything.

## Assignment and acceptance

Annotate a redacted banner with version, directory, model and mode. Fill a menu draft, then cancel it without sending.

**Acceptance**：Explain the difference between configuration and execution. Canceling the draft must create no model task or file edit.

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

## Hands-on steps

1. Open model settings in koder setup. Choose region and metered API or plan before the model.

   **Check**：The route matches the key. Disabled entries remain unavailable; a web subscription is not API credit.

2. Save the key, then run koder model show to inspect the model, protocol and address.

   **Check**：Settings match your console. Review and redact output before sharing it.

3. Run koder model test, followed by koder model test --tools after success.

   **Check**：Keep both results. Text success with tool failure is not a working agent integration.

4. Use koder model presets and koder model models <preset-id> where supported; compare with help and your console.

   **Check**：Discovery and account access are different. Refreshed model metadata does not grant quota.

## Troubleshooting and recovery

- **HTTP 401/403**：Check region, product, permissions and key validity instead of repeatedly retrying.
- **422 with 1026/1027**：Treat it as MiniMax content filtering; use lesson 22 to isolate input, not as a connectivity outage.

## Assignment and acceptance

Create a key-free connection card: preset, model, protocol, base URL, text result, tool result and billing source.

**Acceptance**：Support each field with configuration or output. Mark unrun checks NOT_RUN rather than assuming success.

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

## Hands-on steps

1. Ask: “Fix cart totals so quantity is counted; preserve other behavior, test an empty cart and run node --test.”

   **Check**：The request specifies scope, constraints and a check, rather than only “improve it”.

2. Inspect the proposed files and diff; reject the first edit.

   **Check**：The file remains unchanged. Verify it rather than relying only on the reply.

3. Retry and approve only the target function and relevant tests.

   **Check**：Changes stay in the project and do not add unrelated formatting or dependencies.

4. Open the files, run the check and request a list of changes, validation and remaining work.

   **Check**：Files, test output and the report agree. Preserve output if the check fails.

## Troubleshooting and recovery

- **Only advice, no files**：Use an execution task with file targets and checks; confirm you are not in ask or plan mode.
- **Execution result is unknown**：Inspect files and receipts before asking for a full replay.

## Assignment and acceptance

Add a zero-quantity case to cart-lab, fix the implementation and retain before/after test results and the diff.

**Acceptance**：An empty cart is 0; 200 cents ×3 plus 150 cents ×1 is 750; zero quantity contributes 0. Keep existing tests.

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 05. Command approval: run tests, stop shady ones

Allow 25 minutes

**Goal**：Distinguish ordinary checks, sensitive actions and OS permissions; reject unsafe commands and handle long tasks.

**Preparation**：Use a disposable directory. Read the working path, destination and files, not just the command name.

## Hands-on steps

1. Ask Koder to run tests and read the entire proposed command.

   **Check**：Identify the operation, working directory, writes and network access.

2. Approve the test, but reject an unknown downloaded script executed immediately.

   **Check**：Rejection is a valid outcome; files and permissions remain intact.

3. Inspect approval policy in Setup and run koder permissions status.

   **Check**：Full approval and OS grants are separate; --yes does not grant computer access or approve mail/GitHub writes.

4. For a long task, check its deadline; after timeout inspect process, logs and artifacts before continuing or canceling.

   **Check**：Timeout does not imply rollback, and “started” does not prove installation finished.

## Troubleshooting and recovery

- **EXECUTION_PERMISSIONS_INVALID**：Inspect Koder permissions and workspace state; do not globally relax PowerShell policy.
- **The approval prompt cannot accept input**：Record version and terminal type; cancel and retry interactively rather than bypassing approval.

## Assignment and acceptance

Classify reading README, deleting a directory and sending mail; identify target, grants, confirmation and evidence.

**Acceptance**：Reading grants no deletion authority. Deletion needs a defined target and authorization; mail needs final-content approval and a receipt.

## References

- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

---

# 06. Choices: Koder asks you too

Allow 25 minutes

**Goal**：Use reviewable choices to move a task forward while distinguishing selection, action approval and delivery.

**Preparation**：Prepare a short website brief with audience, goal, content, style and constraints; omit passwords and customer lists.

## Hands-on steps

1. Ask for three browsable course-signup layouts for beginners, with signup as the main action and no publication yet.

   **Check**：The layouts differ in hierarchy or structure, not only color.

2. Review audience, tradeoffs and artifact paths; use lesson 30 for local preview.

   **Check**：Open actual artifacts. A concept image is not a working website.

3. Choose one: “Keep B’s navigation, use A’s signup block and remove autoplay.”

   **Check**：The feedback is actionable; choosing a design does not approve deployment, payment or sending.

4. Check a narrow viewport, links and form behavior; label controls without a backend.

   **Check**：Separate demos from real services. No backend means no claim of a stored signup.

## Troubleshooting and recovery

- **Repeated clarification**：State the goal and constraints and continue the selected option; retain final confirmation for consequential actions.
- **A headless script waits for a choice**：Specify low-risk defaults in the task; missing authorization must not become fabricated consent.

## Assignment and acceptance

Write a brief under 150 words requesting three options, then give three concrete revisions and two acceptance checks.

**Acceptance**：Each revision identifies a page region. Checks are observable, such as no horizontal overflow and the button opening the intended form.

## References

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)

---

# 07. Slash commands: gears, brakes and undo

Allow 30 minutes

**Goal**：Steer, interrupt or queue during work, and insert slash-menu drafts without sending them accidentally.

**Preparation**：Use interactive Koder and a harmless task lasting several seconds. Non-TTY/JSON calls do not provide the same menu interaction.

## Hands-on steps

1. Select steer in /setup. During a task enter “Use English, keeping file paths unchanged.”

   **Check**：Check that steering was accepted; if queued instead, retain the reason code.

2. Try “stop”, then “stop, list the next steps”.

   **Check**：The first cancels; the second cancels and queues the suffix. The CLI remains usable.

3. Switch to queue and submit two distinct requests while busy.

   **Check**：A queue count and preview appear; requests run FIFO. Queued text must not approve a pending action.

4. Press / on an empty line, filter /he, fill /help with Tab, close with Esc and reopen; try /prefill.

   **Check**：Drafts remain editable and require submission. Unsupported rendering has an explicit fallback.

## Troubleshooting and recovery

- **An old build lacks input features**：Check koder version, update using lesson 16 and verify the executable path.
- **An ordinary sentence triggers cancellation**：Keep the exact sentence. “Stop a server” is a task, not an exact interrupt command.

## Assignment and acceptance

Record one steering input, two queued requests, a cancellation and a menu draft without external writes.

**Acceptance**：Steering is accepted or explicitly falls back; FIFO order is preserved, cancel does not replay tools and menus do not auto-send.

## References

- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)
- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)

---

# 08. Read-only questions, pipes and scripts

Allow 35 minutes

**Goal**：Write scripts with intentional stdin behavior and decide whether to continue from the exit code.

**Preparation**：Prepare a non-sensitive report.txt and configure a model before live ask calls. Use the pipeline syntax for your shell.

## Hands-on steps

1. Run koder ask "Explain this project without changing files".

   **Check**：A read-only answer returns; an explicit prompt does not wait for unrelated stdin by default.

2. Pipe report.txt to koder ask "Summarize the input" --stdin using your shell’s example below.

   **Check**：Submission waits for complete input; --stdin explicitly requests the pipe.

3. To write, use koder run "Save the summary to summary.md and read it back", reviewing the approval scope.

   **Check**：The file exists; ask is not a substitute for execution.

4. Read the exit code using your shell’s syntax; stop downstream work on nonzero and retain stderr.

   **Check**：Text on stdout does not prove success. Parse JSON output separately.

## Troubleshooting and recovery

- **Input never finishes**：Check whether the producer closes its pipe. A stdin timeout must not submit partial input as a complete task.
- **Chinese remains with --lang en**：Separate UI text from model output; state the requested language and retain invocation parameters.

## Assignment and acceptance

Ask directly and via an explicit pipe using the same report.txt; record input usage, exit code and duration.

**Acceptance**：A prompt does not consume an unrelated pipe; --stdin requires complete input and failure prevents downstream publication.

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CLI-CONTRACTS.zh.md](../CLI-CONTRACTS.zh.md)

---

# 09. Code review with context

Allow 35 minutes

**Goal**：Get actionable review findings and prevent an unparsed JSON review from passing a CI gate.

**Preparation**：Prepare a small, explainable change in a test repository; define the scope when there is no repository or diff.

## Hands-on steps

1. Inspect git diff, then run koder review.

   **Check**：Findings refer to the actual diff and explain location, trigger, impact and a remedy.

2. Reproduce a finding before requesting the smallest fix.

   **Check**：Do not rewrite everything based on a suggestion; mark unconfirmed findings for investigation.

3. For automation run koder review --format json and capture stdout, stderr and exit code.

   **Check**：Check parseability, parsed status and exit code; an empty-repository error must not pass.

4. After the fix, rerun the original tests and review the relevant diff.

   **Check**：Closure has evidence; remaining findings have reasons. Review does not deploy anything.

## Troubleshooting and recovery

- **REVIEW_UNPARSED**：Retain the output and fail the gate; never insert parsed=true manually.
- **Advice refers to different files**：Check branch, workspace and uncommitted changes, then narrow the scope.

## Assignment and acceptance

Review the cart fix and report a substantiated finding or no demonstrated issue, with test evidence.

**Acceptance**：Do not invent a quota of findings. Real issues must be locatable and reproducible; parse or model failures cannot become approvals.

## References

- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

---

# 10. Fix until green: fix --check

Allow 40 minutes

**Goal**：Drive a fix with a reproducible failing check and preserve evidence instead of weakening tests.

**Preparation**：Copy cart-lab into a separate project. Its examples require Node; use the built-in coach if Node is unavailable.

## Hands-on steps

1. Run node --test and record the failing case and expected/actual values.

   **Check**：Keep the baseline log; the test should demonstrate the total-price bug.

2. Run koder fix "Fix cart totals without removing existing tests" --check "node --test".

   **Check**：The check/fix loop is visible and edits remain reviewable.

3. Check price × quantity behavior and add empty, zero-quantity and multi-item cases.

   **Check**：Tests cover the requirement rather than hard-coding one result of 750.

4. Run the check independently and verify README instructions.

   **Check**：Completion requires a passing check; budget exhaustion reports blockers and existing artifacts.

## Troubleshooting and recovery

- **An unhelpful fix error**：Provide a task and --check command, then run the check alone to confirm it exists.
- **Dependency failure leads to repeated code edits**：Separate setup failures from product failures; do not hide missing dependencies in tests.

## Assignment and acceptance

Keep a failure, a fix and an independent rerun; explain root cause, change and validation in three sentences.

**Acceptance**：The bug omitted quantity. Fix the implementation, not the expectation; original and new edge tests pass.

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)

---

# 11. Flows and CI: agents in formation

Allow 45 minutes

**Goal**：Split repeated work into checked steps and prevent publication after a failed prerequisite.

**Preparation**：Complete lessons 8–10. Read the bundled flow-lab.json and use it with cart-lab. This example only runs local checks: no publication or model calls.

## Hands-on steps

1. Read flow-lab.json and identify step IDs, types, commands and dependencies.

   **Check**：Each step has one clear responsibility and uses project checks.

2. Run koder flow run flow-lab.json in the example directory.

   **Check**：The planted cart bug fails a check. Save step states; skipped does not mean passed.

3. Fix the cart with lesson 10 and rerun the same flow.

   **Check**：Checks pass with the same inputs and workflow; the change is explainable.

4. For CI, read koder help ci, generate configuration in a test repository and review it.

   **Check**：Check permissions, branches and secret references. Generated YAML is not a completed CI run.

## Troubleshooting and recovery

- **Parallel steps overwrite files**：Parallelize only independent steps. A shell command is not inherently read-only.
- **A failed workflow says it finished**：Read step states and the final exit code; finished only means execution ended.

## Assignment and acceptance

Draw a check-to-summary dependency graph and inject a failure that prevents the success branch from running.

**Acceptance**：The dependency graph matches logs; failures, skips and passes are distinct, and nothing was published.

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [COMMAND-REFERENCE.en.md](../COMMAND-REFERENCE.en.md)

---

# 12. MoA: several models think together

Allow 30 minutes

**Goal**：Use multiple models only where useful, control costs and verify the final answer.

**Preparation**：Have a working primary model and separately authorized references for live use. Reading this lesson requires no calls.

## Hands-on steps

1. Run a small task with one model and record duration, validation and available usage.

   **Check**：You have a single-model baseline.

2. Register and test a reference model before configuring MoA.

   **Check**：References have valid configuration and matching credential routes.

3. Enable MoA for the same task and inputs and inspect the synthesis.

   **Check**：The primary executor owns tools and approvals; references cannot act independently.

4. Compare correctness, duration and cost before keeping it.

   **Check**：Unknown usage stays unknown. More calls do not automatically mean a better result.

## Troubleshooting and recovery

- **A reference is unavailable**：Disable that reference and inspect its configuration; do not change billing routes silently.
- **References disagree**：Resolve with facts, tests and sources rather than votes.

## Assignment and acceptance

Compare two explanations of the cart bug and separate common evidence from disagreement; adopt only tested conclusions.

**Acceptance**：Explain the information added by the reference; consensus is not a test.

## References

- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [HARNESS-INCREMENTAL.md](../HARNESS-INCREMENTAL.md)

---

# 13. Chat apps: command Koder from your phone

Allow 40 minutes

**Goal**：Connect an authorized messaging channel and verify pairing, receipt and permissions.

**Preparation**：Choose a platform where you already have account and administration access. Pairing codes shown in lessons are examples, and live setup may send external messages.

## Hands-on steps

1. Run koder gateway status before setup.

   **Check**：Reuse an existing host rather than creating competing receivers.

2. Run koder gateway setup <platform-id> and follow the current account flow.

   **Check**：Configuration or connection success does not prove every message path.

3. Send a harmless message from your own test chat and verify the generated pairing code before approving it.

   **Check**：Unpaired accounts cannot run tasks; approve only an identity you recognize.

4. Run a read-only task and check both ends and session identity, then test cancellation.

   **Check**：Receive, execute, reply and cancel each have evidence; a disconnect is not a delivered reply.

## Troubleshooting and recovery

- **Messages stop after closing the terminal**：Check residency with lesson 20; a background child alone does not prove restart persistence.
- **Group and private context appear mixed**：Inspect linking and sharing scope; remove unnecessary links instead of erasing all history.

## Assignment and acceptance

Trace one message across sender, session, receipt, execution and reply; without an account, produce a clearly labeled test plan.

**Acceptance**：Configuration is not live acceptance, and a plan is not a successful send. Each status needs evidence.

## References

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 14. Editors: Zed, Neovim, Emacs

Allow 35 minutes

**Goal**：Use the same Koder installation from an editor and import portable Skills without blindly running scripts.

**Preparation**：Verify the standalone CLI works. Check your installed editor’s ACP support and use a Skill you are authorized to use.

## Hands-on steps

1. Run koder editor zed, nvim or emacs and inspect the generated snippet.

   **Check**：The command points to the real installation and the correct Windows launcher where applicable.

2. Back up editor settings and merge the snippet; open a test project.

   **Check**：Existing plugins remain configured and the workspace is correct.

3. Ask a read-only question, then request a small edit and reject it.

   **Check**：Requests and approval reach the editor; rejection leaves files unchanged.

4. Run koder skills list and koder help skills; import the selected directory and inspect it with show.

   **Check**：Portable SKILL.md content can be discovered within compatibility limits; host-specific APIs do not become available automatically.

## Troubleshooting and recovery

- **The editor cannot find Koder**：Check the absolute executable path, environment and arguments.
- **A Skill references unavailable tools**：Map to existing tools where possible or report the missing dependency; do not claim complete compatibility.

## Assignment and acceptance

Import a read-only instruction Skill into a test project and record discovery, reading, applicable tasks and unsupported tools.

**Acceptance**：Importing neither installs dependencies nor grants permissions or executes scripts. Editor tasks retain existing approvals.

## References

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [PORTABLE-SKILLS.en.md](../PORTABLE-SKILLS.en.md)
- [MCP-SKILL-COMPATIBILITY.zh.md](../MCP-SKILL-COMPATIBILITY.zh.md)

---

# 15. Scan your projects, decide what's next

Allow 25 minutes

**Goal**：Find the right project and control which cross-tool task material reaches the model.

**Preparation**：Prepare two test projects with distinct READMEs. Scanning may display local titles and paths; check before sharing your screen.

## Hands-on steps

1. Run koder scan --limit 6 without starting a follow-up task.

   **Check**：Inspect source and path; listing is local, while a follow-up may send selected material to the model.

2. Select project A, verify the path and request a README summary.

   **Check**：The summary concerns A, not unrelated facts from B.

3. Use separate directories or sessions for parallel tasks and inspect koder project list --json.

   **Check**：Tasks have clear ownership and do not scatter files into the installation.

4. When resuming, name the project, completed work and next goal.

   **Check**：Existing artifacts are inspected; a chat title is not a complete project state.

## Troubleshooting and recovery

- **Too many old projects appear**：Limit the list or use -w with the intended path; do not delete history merely to tidy the list.
- **A project moved**：Open the new path explicitly and inspect files rather than assuming an old mapping.

## Assignment and acceptance

Put distinct synthetic markers in A and B and query each; neither answer should use the other project’s marker.

**Acceptance**：Retain both paths and results. Describe explicitly shared notes separately from isolated task history.

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 16. Install, update and switch engines

Allow 40 minutes

**Goal**：Install or update correctly, verify the running version and retain configuration and recovery options.

**Preparation**：Record OS, architecture, installed version and executable path. Use the official site or GitHub and the shell-specific installation guide.

## Hands-on steps

1. Run koder version and koder update status and note location and policy.

   **Check**：Distinguish the launcher, version directory and data directory; multiple installs may launch an old copy.

2. Read license and installation instructions, choose the correct installer and start updates with koder update --check.

   **Check**：A check is not an installation. Preserve the failing stage on download errors.

3. Run koder update when ready and follow save/switch prompts without killing other tasks.

   **Check**：Download, verification, installation and entry checks are distinct stages.

4. Open a new terminal, run koder version and koder doctor, then inspect your project and settings.

   **Check**：The new entry launches the intended version and retains data; keep logs for any failure.

## Troubleshooting and recovery

- **Auto-update asks for manual action**：Inspect ownership, path and the precise error; use the official installer when needed without deleting configuration.
- **PowerShell blocks a script**：Use the documented launcher; do not globally set Unrestricted or disable protection.

## Assignment and acceptance

Write an upgrade record: before/after version, launcher, retained settings and recovery path. Label a dry run as such.

**Acceptance**：Actual launch agrees with version output. A download is not startup acceptance; record each platform separately.

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

## Hands-on steps

1. Run koder privacy statement and read the full terms and license files.

   **Check**：Local documents remain readable offline.

2. Inspect learning, sync, computer, mail and residency settings separately.

   **Check**：Each has its own purpose, data scope and off switch.

3. Enable only the needed feature and inspect its status.

   **Check**：License acceptance does not enable unrelated capabilities; full approval does not expand grants.

4. Disable the optional feature and check again.

   **Check**：Disabling stops future use; deleting retained data is a separate action.

## Troubleshooting and recovery

- **Assuming accept grants everything**：Inspect feature states; license acceptance has no such meaning.
- **Old memories remain after disabling learning**：Retention is expected; remove specific records if desired instead of erasing everything.

## Assignment and acceptance

List the separate decisions for license acceptance, model access to mail and automatic replies.

**Acceptance**：None substitutes for another; sending must follow final confirmation or an explicitly authorized rule.

## References

- [COMMERCIAL-LICENSING.md](../COMMERCIAL-LICENSING.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 18. Computer and files: inspect, grant, revoke

Allow 45 minutes

**Goal**：Operate the browser or desktop within explicit grants and verify actual state after each step.

**Preparation**：Use owned test windows and public pages, leaving personal windows untouched. GUI work needs a supported driver and interactive desktop.

## Hands-on steps

1. Run koder permissions status and inspect network, browser, desktop and file grants.

   **Check**：Missing grants are visible; --yes does not grant computer access.

2. Request the necessary scope through Setup or koder permissions request.

   **Check**：Grant only the required scope and review OS prompts yourself.

3. On Windows run koder mcp doctor windows-mcp --json, then test/enable the bundled driver in Setup.

   **Check**：Missing dependencies, architecture support or grants are reported; do not create a competing installation.

4. Ask: “Type HELLO-KODER into my new test text window and read it back; do not save into personal directories.”

   **Check**：Identify the target before acting and observe afterward; success needs actual window state.

## Troubleshooting and recovery

- **No driver or display server**：Use available file/API paths and mark GUI untested rather than claiming clicks.
- **GUI operation fails while locked**：Background tasks and locked-screen GUI are separate capabilities; the native companion still needs signing and dedicated acceptance.

## Assignment and acceptance

Type and read back in an owned window, revoke the relevant grant and verify later actions are blocked.

**Acceptance**：Retain target, grant, receipt and observed content. The revocation case must perform no extra clicks.

## References

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [WINDOWS-MCP-BUNDLED.en.md](../WINDOWS-MCP-BUNDLED.en.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

---

# 19. Memory storage, groups and devices

Allow 35 minutes

**Goal**：Understand workspace, session and shared-memory boundaries for concurrent work and recovery.

**Preparation**：Use two test directories and synthetic markers, never actual secrets.

## Hands-on steps

1. Run koder memory status in A and note its scope and storage.

   **Check**：Understand ownership instead of assuming all data lives in the project folder.

2. Give A a synthetic marker, then ask B for it without supplying it.

   **Check**：B should not automatically retrieve A’s task facts.

3. Return to A, then use a named session for separate investigation.

   **Check**：A can resume; the named session has its own identity, with shared notes explicitly scoped.

4. Inspect a specific record and scope before using forget commands.

   **Check**：Logout, disabling learning and deletion differ; sync needs a compatible Core and readback evidence.

## Troubleshooting and recovery

- **Windows share unrelated context**：Record paths, version, sessions and shared-note settings; reproduce without erasing evidence.
- **Login succeeds but sync does not**：Check account, device and sync state; verify readback on both devices.

## Assignment and acceptance

Perform an A→B→A isolation check and record visible content and expectations.

**Acceptance**：B lacks A’s private marker and A resumes; untested remote sync stays NOT_RUN.

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [HEADROOM.zh.md](../HEADROOM.zh.md)
- [HEADROOM.en.md](../HEADROOM.en.md)

---

# 20. Learning, soul, reflection and proactive service

Allow 45 minutes

**Goal**：Configure learning, task harnesses, residency and mail alerts separately and verify when each actually runs.

**Preparation**：Start with minimal visibility. Residency is explicit; installation does not grant mail, calendar or browser-history access.

## Hands-on steps

1. Run koder growth status and koder harness status and inspect Skill settings in Setup.

   **Check**：An available method Skill does not prove a running daemon; toggles affect applicable future tasks.

2. Review app-use learning in Setup: connected Apps/MCP first, then browser and desktop, with official help for unfamiliar flows.

   **Check**：Missing grants are reported; learned steps cite sources and do not invent actions.

3. If you need alerts after closing the terminal, explicitly run koder activate, then koder status.

   **Check**：Only running establishes a live host; quiet hours, limits and source settings still apply.

4. Bind mail in Setup, separately enable koder mail monitor on and inspect monitor status.

   **Check**：Binding, monitoring, model access and autonomous replies are separate; polling is not instant delivery.

## Troubleshooting and recovery

- **No background alert**：Check host, visibility, quiet hours, budget and network; sleep can delay checks.
- **Stop alerts but retain the mailbox**：Use mail monitor off for mail checks; deactivate stops residency without disconnecting mail.

## Assignment and acceptance

Map binding, monitoring, reading, drafting and sending, including each input and approval; enable only needed stages.

**Acceptance**：Alerts need not expose full mail to a model; drafting is not sending, and SMTP acceptance is not proof the recipient read it.

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

## Hands-on steps

1. Run koder apps status and koder mcp list, then read koder help mcp.

   **Check**：Discovery alone does not establish a configured, enabled, callable service.

2. Inspect executable, arguments, endpoint and environment variable names, then run koder mcp test <server-id> for an authorized service.

   **Check**：This makes a real connection. Record tools and server errors separately from business completion.

3. Bind 163 through /setup using the full address and client authorization code in send/receive mode; inspect /mail status.

   **Check**：Receive and SMTP settings are distinct. Use the dedicated secret input; receive-only accounts cannot send.

4. Replace YOUR_TEST_ADDRESS with your own test recipient and run the mail send command; inspect the final message before typing send.

   **Check**：Keep the SMTP submission receipt and check the test inbox. Reconcile uncertain delivery instead of resending.

5. Use koder github connect with its secret input, then status, repos and read on your test README.

   **Check**：Confirm identity and repository scope. Read access does not prove write access; keep tokens out of project files.

6. Prepare README.md and run koder github commit OWNER/REPO README.md --message "Improve learning notes"; read it back and separately edit repository metadata.

   **Check**：Approve each target explicitly and verify SHA/state. Only listed files are uploaded, not a whole directory.

## Troubleshooting and recovery

- **Mail requests loop through skill discovery or shell**：Use the bound native mail_send path or /mail send, not a nested Koder process.
- **GITHUB_PENDING_REVIEW_REQUIRED**：Run koder github reconcile OWNER/REPO; preserve unresolved state rather than force-pushing or replaying.

## Assignment and acceptance

Choose one connection and record status, operation and readback. Without an account, label the exercise NOT_RUN. Upload only a secret-free README.

**Acceptance**：Separate discovery, invocation and external effect. Distinguish SMTP submission from arrival and verify GitHub content against the receipt.

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

## Hands-on steps

1. Run koder version and koder doctor and identify installation, model, tool, grant or external-submit failure.

   **Check**：Separate unrelated events such as mail polling errors and a coding timeout.

2. Inspect model show and run one model test; check access for 401/403, quota for 429 and provider/network state for 5xx.

   **Check**：Keep status and provider reason without endless retries; redact before sharing.

3. For MiniMax 422 with 1026/1027, compare a short harmless request in a new session and avoid binary/large hex payloads.

   **Check**：Report filtering accurately, retain history and do not bypass provider review.

4. For timeout or HARNESS_JIT_STOP, inspect the last tool, artifacts and receipts and list completed, unknown and unrun work.

   **Check**：Started, exit 0 or an orchestration stop alone does not prove business success; resume only remaining work.

## Troubleshooting and recovery

- **Increasing context arbitrarily**：Use the actual model limit and reserve output capacity; retrieve relevant file sections.
- **The old build still runs after update**：Check launcher path and version in a new terminal; use lesson 16 for multiple entries.

## Assignment and acceptance

Write recovery plans for an uncertain mail send and an empty web search. Start with evidence, not resending or reinstalling.

**Acceptance**：Reconcile mail submission and inbox state; check search URL, status and body rather than treating an empty response as absence of information.

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

## Hands-on steps

1. Run koder model presets and inspect disabled entries.

   **Check**：Use availability in your installed build, not the advertised count.

2. Record whether you purchased a Token Plan, Coding Plan or metered API and its region.

   **Check**：Similar names do not imply interchangeable keys.

3. Inspect the relevant models entry and compare model IDs and base URL with your console.

   **Check**：Discovery supplies candidates, not account entitlement.

4. Test only when the route is available and matches the product; otherwise retain settings and choose an authorized alternative.

   **Check**：No silent billing change or bypass of disabled routes.

## Troubleshooting and recovery

- **Balance remains but 401 occurs**：Balance and authorization differ; check the key’s product and region.
- **The model list is empty**：Distinguish discovery failure, access denial and no available models instead of guessing IDs.

## Assignment and acceptance

Build a key-free product, region, endpoint, model and availability table.

**Acceptance**：Mark uncertain values pending and disabled entries unavailable rather than tested.

## References

- [PROVIDERS.md](../PROVIDERS.md)
- [MODEL-DISCOVERY.zh.md](../MODEL-DISCOVERY.zh.md)
- [MODEL-DISCOVERY.en.md](../MODEL-DISCOVERY.en.md)

---

# 24. MiMo checkup: a reply is only the first step

Allow 25 minutes

**Goal**：Understand a tool round trip: request, execution, result and model continuation.

**Preparation**：When the MiMo Token Plan route is disabled, study it offline; use an available authorized provider for live checks.

## Hands-on steps

1. Inspect koder model show.

   **Check**：Use the same configuration for text and tool checks.

2. Run model test and then explicitly model test --tools on an available route.

   **Check**：Record both results and timing; tool diagnostics avoid business effects.

3. Inspect whether the failure is tool formatting, missing results, empty output or HTTP rejection.

   **Check**：MODEL_PROTOCOL does not automatically mean disconnection.

4. Use a short new-session comparison while retaining the old session; explicitly name remaining work when resuming.

   **Check**：A greeting does not replay old tasks.

## Troubleshooting and recovery

- **Text works but actions fail**：Report tool diagnostics; changing OS grants will not repair a protocol mismatch.
- **Old history is too large**：Isolate with a new session and relevant summaries/artifacts instead of wiping memory.

## Assignment and acceptance

Draw the four stages of a tool round trip and identify evidence for each.

**Acceptance**：A declaration proves visibility; a receipt records execution; continuation must use that result.

## References

- [MIMO.md](../MIMO.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)

---

# 25. Privacy paperwork, even with the Wi-Fi off

Allow 25 minutes

**Goal**：Find bundled privacy documents, understand data destinations and minimize disclosure.

**Preparation**：Use synthetic material rather than passwords, private mail or customer data.

## Hands-on steps

1. Read privacy statement, consumer and sources and note versions/sources.

   **Check**：Local full text is available without a model call.

2. Separate project files, conversation history, credentials and external receipts.

   **Check**：Assess storage and transmission per category rather than claiming nothing leaves the machine.

3. Inspect resources, sync, learning and model mail-access settings.

   **Check**：Remote models receive task context; separate grants control additional sources.

4. Before feedback, copy minimal diagnostics and redact tokens, personal paths, mail and account details.

   **Check**：The report remains useful without unnecessary personal data.

## Troubleshooting and recovery

- **Assuming CLI and desktop store secrets identically**：Read each product’s statement separately.
- **Data remains after uninstall**：Normal uninstall can retain data; identify local, external and server copies before deletion.

## Assignment and acceptance

Draw a synthetic project’s data flow from files to model, tools and receipts, marking external transfers.

**Acceptance**：Keys stay out of model context; selected task content may reach the model, and external writes need separate authorization and receipts.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [PRIVATE-RESOURCES.md](../PRIVATE-RESOURCES.md)

---

# 26. A real feedback address, without the secrets

Allow 25 minutes

**Goal**：Produce reproducible, secret-free feedback and grounded writing deliverables.

**Preparation**：Prepare a minimal reproduction and actual output. For writing, supply verified facts without implying nonexistent release changes.

## Hands-on steps

1. Run koder feedback and inspect the address and template.

   **Check**：It displays contact details without sending chats or attachments.

2. Fill version, OS/shell, steps, expected and actual results and redacted errors.

   **Check**：Another person can reproduce it; “broken” alone is insufficient.

3. Ask for feedback.md with a defined audience, verified facts and length.

   **Check**：A readable file exists and unknown causes remain unknown.

4. If sending, inspect recipient and final content using lesson 21 and approve separately.

   **Check**：Writing and sending are different actions; keeping only a draft is valid.

## Troubleshooting and recovery

- **The draft is vague**：Add audience, facts, risks and next actions, and require a written file with readback.
- **Release mail invents new features**：Read release/change/acceptance material first; disclose when describing existing features rather than release increments.

## Assignment and acceptance

Write but do not send a bug email with version in the subject, minimal steps, actual error and requested help.

**Acceptance**：Facts are traceable, no keys or full private chats are included and unrun tests are not claimed.

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

## Hands-on steps

1. Run koder celebrate and choose an effect such as fireworks.

   **Check**：Selection controls an effect, not project execution.

2. Press a key during playback.

   **Check**：The prompt becomes usable immediately.

3. Use koder celebrate auto notice for greetings only, or auto off.

   **Check**：Notice is different from automatic playback; normal command output stays clean.

4. Check the text fallback in a limited terminal.

   **Check**：No broken cursor state remains and input still works.

## Troubleshooting and recovery

- **Cursor behaves oddly after animation**：Record terminal and dimensions; disable effects instead of resetting all settings.
- **A holiday has no effect**：Check date, mode and supported calendar; not every regional holiday is covered.

## Assignment and acceptance

Play, skip and disable an effect, then verify /help still works.

**Acceptance**：Skipping preserves input and animation is not used as acceptance evidence.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

---

# 28. Remember a birthday, not a dossier

Allow 20 minutes

**Goal**：Store minimal birthday information only by explicit choice, with review and removal.

**Preparation**：Practice with a fictional month/day. No birth year, age or ID is needed; mentioning someone else is not consent to record yours.

## Hands-on steps

1. Read koder help celebrate for birthday commands and date format.

   **Check**：Use current help rather than guessing syntax.

2. Explicitly say “Remember my birthday is March 14” and inspect the response.

   **Check**：Only the allowed month/day is saved, not an inferred age or identity.

3. Inspect status, change the practice date using the lesson commands and inspect again.

   **Check**：Stored value matches the response without enabling learning or sync.

4. Remove the synthetic birthday after practice; choose automatic greetings independently.

   **Check**：Removal and disabling animation differ; no fake profile data remains.

## Troubleshooting and recovery

- **Another person’s birthday was recorded**：Correct it explicitly and verify the stored value.
- **The date remains after disabling effects**：Animation preferences and the stored date are independent.

## Assignment and acceptance

Set, inspect and remove a fictional date and record the final state.

**Acceptance**：The practice date is removed and no year or extra personal data was added.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

---

# 29. A birthday song, and a language you choose

Allow 20 minutes

**Goal**：Choose language and music explicitly without silently sharing location or opening audible pages.

**Preparation**：Check whether sound is appropriate. Prefer explicit language settings over IP-based guesses.

## Hands-on steps

1. Set koder lang zh or en; use --lang for one invocation.

   **Check**：Language settings apply without rewriting code or preserved quotations.

2. Inspect music settings with the existing lesson commands and leave them off initially.

   **Check**：Status inspection opens no browser and plays no audio.

3. Explicitly approve the chosen external music page when desired.

   **Check**：The site may require login or a play gesture; opening it is not proof of playback.

4. Stop playback, close the owned test page and disable unwanted music preferences.

   **Check**：Leave other apps’ playback untouched; music and language remain independent.

## Troubleshooting and recovery

- **A page opens silently**：Check its play control, volume and site rules instead of opening repeated tabs.
- **Language was inferred incorrectly**：Ask for or use an explicit selection, without adding an IP lookup.

## Assignment and acceptance

Record language, external-link consent, page opening and actual playback separately.

**Acceptance**：Opening is not playback, and playback does not grant download rights; unselected external actions do not occur.

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [APP-USE-AND-LEARN.en.md](../APP-USE-AND-LEARN.en.md)

---

# 30. Graduation

Allow 90 minutes

**Goal**：Deliver a runnable, previewable project with verifiable results and a sourced written artifact.

**Preparation**：Choose a small website, app or presentation task in a separate Koder Projects directory. Use synthetic data and authorize deployment or GitHub writes separately.

## Hands-on steps

1. Write a brief with audience, goal, content, exclusions, artifact paths and checks. For a site, request three browsable layouts first.

   **Check**：Requirements map to files and behavior; refine the chosen direction.

2. Implement and test; for a static site use /preview start --directory site in the current chat after verifying the directory.

   **Check**：The local artifact opens. For framework projects, start the documented dev server before connecting its preview URL.

3. Change a heading and inspect preview updates, narrow layout, keyboard access, links and empty data.

   **Check**：Refresh/reload shows actual edits; a screenshot alone is insufficient.

4. Request an H5 project map covering directories, entry points, modules, data flow, checks and unconnected services, grounded in actual files.

   **Check**：The map opens in a browser and its nodes are traceable; demo services are not described as live.

5. Write intro.md for technical decision-makers and a release email without a change list that explicitly avoids increment claims.

   **Check**：Primary files meet length/audience requirements with sources, limits and next steps, not invented pricing or features.

6. Deliver README, test results, preview instructions, map, writing and untested items; close with /preview stop.

   **Check**：Another person can reproduce the result. Upload or deploy only through a separately approved flow.

## Troubleshooting and recovery

- **Preview reports not-running**：Preview belongs to its owning process. Use the same chat; stop a standalone start with Ctrl+C rather than expecting another process to see it.
- **A report exists but project files do not**：Check each artifact against the brief; mark missing files incomplete and finish them.

## Assignment and acceptance

Submit README, runnable files, test logs, project-map.html, intro.md, release-email.md and an untested list. Exclude secrets, account caches and node_modules.

**Acceptance**：Check runnability, explanation, validation, recovery and grounded facts. Report gaps; screenshots do not replace execution and fixtures do not prove live-account success.

## References

- [VISUAL-WORKFLOW-AND-NETLIFY.md](../VISUAL-WORKFLOW-AND-NETLIFY.md)
- [MAIL-AND-LIVE-PREVIEW.md](../MAIL-AND-LIVE-PREVIEW.md)
- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [GITHUB-PROJECTS.zh.md](../GITHUB-PROJECTS.zh.md)
