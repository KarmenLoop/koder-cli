# Changelog

## 0.5.0 — 2026-10-26

Bundle local Tesseract.js OCR with English and simplified Chinese data; route scan tasks through the existing Core and document permissions. Add 90 professional child-task roles in 25 groups, FIFO child admission and a configurable concurrency limit. Add capability inspection and explicit terminal JSON results for headless preflight failures. Keep small-model context available by loading unrelated method guidance on demand. Preserve the existing executor, BYOK, budgets, cancellation and project isolation. [Release notes](docs/RELEASE-0.5.0.md).

## 0.4.24 — 2026-10-26

Add native PageIndex document navigation, offline PDFium parsing, source-bound readback and exact-quote verification. Route document tasks through the existing Core, with Setup/off controls and read-only subagent support. Preserve model budgets, cancellation, permissions and existing project workflows. [Release notes](docs/RELEASE-0.4.24.md).

## 0.4.23 — 2026-10-26

Use Fullstack Web Delivery for website creation, redesign and repair. Preserve the original 29-file Skill package, add project anchors with reviewable direction changes, reuse established requirements and create separate folders for explicit new projects. Existing approvals, budgets and platform limits remain. [Release notes](docs/RELEASE-0.4.23.md).

## 0.4.22 — 2026-10-26

Integrate 84 pinned DESIGN.md references with website requirements, project design decisions and the existing implementation/preview workflow. Add offline catalog/read/verify commands and a Setup switch. Load design and AI-app schemas only for relevant tasks. Keep Koder-specific landing-page requirements out of unrelated sites. [Release notes](docs/RELEASE-0.4.22.md).

## 0.4.21 — 2026-10-26

Fix repository-qualified Skill search results and prevent unrelated fallback searches for an explicitly selected source. Share the product effort levels between session controls, delegated model selection and tool schemas. Verify 180 tool-enabled child readers, pinned public Skill download/read/write continuation, and distinct child model/effort requests through the existing HTTP provider and shared budget. [Release notes](docs/RELEASE-0.4.21.md).

## 0.4.20 — 2026-10-26

Integrate a pinned Awesome LLM Apps reference library with the existing agent loop. Add 146 offline example/tutorial entries, seven Koder-adapted Skills, task-specific guidance, local lexical retrieval and exact-quote verification. Expose CLI commands, Setup controls and the original profile/approval boundaries. Keep upstream dependencies and service execution explicit. [Release notes](docs/RELEASE-0.4.20.md).

## 0.4.19 — 2026-10-26

Bundle SolidCraft 0.23.0 for Windows x64 and universal macOS. Add a project-scoped CAD connection, Setup controls and a built-in modeling Skill using the existing Core, approvals and model provider. Isolate mutable models per turn and client, preserve cleanup uncertainty, and check saved CAD artifacts and post-edit measurements. Publish installers, documentation and update metadata on GitHub. [Release notes](docs/RELEASE-0.4.19.md).

## 0.4.18 — 2026-10-26

Raise approved MCP operation deadlines while preserving cancellation and uncertain-effect receipts. Replay and acknowledge durable foreground mail alerts, including a full backlog. Connect downloaded GitHub Skills to short-name selection, Setup and CLI enable/disable controls. [Release notes](docs/RELEASE-0.4.18.md).

## 0.4.17 — 2026-10-26

This release repairs execution and delivery paths found by checking the current CLI against its documented contracts. Windows CMD, PowerShell and macOS shell installers select the same versioned runtime archive. Run `koder update`, restart the CLI, and check `koder --version` for `0.4.17`.

## Repairs

- Fix, review-fix and test-generation workflows keep their coding contract even when their internal prompt asks for a short summary or quotes a diagnostic mentioning email. The command owner runs its configured check after edits; uncertain effects and cancellation still stop execution. Owned workflow sessions now close reliably.
- Tool-context accounting uses the schema actually sent to the provider. Host-only policy metadata no longer consumes a small model's reported context budget. Full history, paired calls/results and authorization remain intact.
- Old conversation records without task/subagent IDs no longer crash recovery. Unknown shell receipts remain unknown and still require reconciliation.
- Prefill drafts are inserted before the persistent composer measures and paints them. Choosing a suggestion does not send it. An empty initial Todo list no longer emits a spurious JSON event.
- Completed calls are released from the delivery checker's pending-call bookkeeping. More than 256 completed tools no longer cause an artificial incomplete-delivery result. Explicit monetary budgets, cancellation, finite pending-request/resource bounds and unknown-effect guards remain.
- Competitor prices require a matched successful read from an allowed official pricing/help page, a short exact source quote, and its URL next to the claim. A bare link, failed read, different price or invented plan does not pass. An honest statement that pricing is unknown remains valid. This is a receipt/quotation contract, not a claim of model-quality improvement.
- Successful harness observations persist with the original session history and are inspectable with `koder harness experiences --json`. They are `NO_ENTRY` until a trusted paired comparison exists; an observation never silently changes the selected profile. The old 24-step restriction is removed from the existing experience-owner port.
- `koder model presets --json` returns a structured catalog with selectable/unavailable counts and an explicit account-verification boundary. The offline coach follows the real outer `fix` check instead of consuming later correction steps prematurely.
- Update fallback and all three installer pins now use this release. Current compatibility guides remove the obsolete four-Skill limit and correctly describe the 1,800-lesson Chinese classroom.



## 0.4.16 — 2026-10-26

Check local executables before remote discovery, pass assigned Todo plans to child execution, expose paged child plans and read-only checkpoint status, and refresh fetched Skills in chat. Preserve unlimited task rounds, cancellation and shared optional budgets. [Changes and verification scope](docs/RELEASE-0.4.16.md).

## 0.4.15 — 2026-10-26

Remove the default task-round limit while retaining cancellation, approvals and optional cash budgets. Add tool-enabled subagents, approved Skill retrieval and a 1,800-lesson Chinese classroom. [Changes and verification scope](docs/RELEASE-0.4.15.md).

## 0.4.14 — 2026-10-26

Model and effort shortcuts, independent FIFO task controls, task-completion reminders, approved CLI-Anything calls, and clearer Windows command recovery. Keep read-only preview checks available during reconciliation and retain uncertain-effect receipts. Existing 180 lessons are unchanged. See [release notes](docs/RELEASE-0.4.14.md) for verification and platform limits.

## 0.4.14-candidate.4 — unpublished candidate

- Keep `workspace_preview status/discover` available for readback after an UNKNOWN shell result. The model sees only those actions; the executor still blocks starting, opening or stopping previews. An existing preview URL does not prove that the earlier command succeeded.
- Explain that accepted steering stays in the current turn and cannot clear reconciliation. The same receipt reaches local chat and remote agentd chat through the existing IPC path.
- Reject linked preview directories before reading package metadata. Retain candidate.3 partial-search handling, detailed command reasons and bounded blocked-call recovery.
- Include a package self-check for preview readback and restricted steering. [Recovery guide](docs/SHELL-RECOVERY.zh.md) · [Candidate notes](docs/RELEASE-0.4.14-candidate.4.md).

## 0.4.14-candidate.3 — unpublished candidate

- Recognize a narrow, literal read-only PowerShell pipeline after a clean process exit. Suppressed read errors produce a partial-results warning without blocking later commands. Suppressed writes, timeouts and uncertain cleanup still require reconciliation.
- Show the original command's call ID, uncertainty reasons, exit status and readback steps. Stop repeated blocked effect requests with exit 3, preserving receipts in conversation history and JSON output.
- Continue authorized searches past inaccessible descendants, allow an explicit search directory, and accept in-workspace absolute paths for listing and reading. Root denial, revoked grants and path-identity failures remain errors.
- Show partial-search warnings and an exact-ID discovery route for missing Skills. Normalize background mailbox error codes so a recurring code-less network failure is reported once until recovery.
- Preserve candidate.2 notifications and candidate.1 controls, queue, Todo, model selection and CLI-Anything integration. [Recovery guide](docs/SHELL-RECOVERY.zh.md) and [acceptance notes](docs/RELEASE-0.4.14-candidate.3.md) distinguish local fixtures from native Windows testing.

## 0.4.14-candidate.2 — unpublished candidate

- Add task-completion reminders through the existing Windows Toast, Linux notify-send and macOS notification adapters. Short successful conversations stay quiet by default; longer or background work uses configurable attention and outcome rules.
- Keep task notices separate from proactive reminders, with their own daily budget, quiet backlog and durable cross-process deduplication. Unknown delivery is retained without automatic resend.
- Add private continuation records and notification diagnostics. Native receipts distinguish submission, refusal, unavailability and uncertainty; none promises that a user saw the banner.
- Retain candidate.1 session controls, queue, Todo, model and effort selection, and CLI-Anything integration. Add bilingual notification walkthroughs and an isolated package acceptance script.

See [candidate notes](docs/RELEASE-0.4.14-candidate.2.md) and [platform acceptance](docs/TASK-NOTIFICATIONS-ACCEPTANCE.md). This candidate does not certify native Windows 10/11 display or cross-platform click behavior.

## 0.4.14-candidate.1 — unpublished candidate

- Choose a saved model with Ctrl+P or `/model`, and set thinking effort with Ctrl+E or `/effort`. Busy changes apply next turn; the footer distinguishes current and pending settings. Unsupported effort falls back visibly.
- Manage independent FIFO tasks with `/queue on`, `/queue remove N` and `/queue clear --yes`; inspect up to three previews above the persistent input. Queue deletion waits for earlier input receipts before confirming completion.
- Include pinned CLI-Anything discovery, a bundled adaptation skill and approved workspace CLI execution through the existing executor. Readable argv and bounded deadlines remain attached to approval and recovery records.
- Preserve the compact Todo/input layout, workspace history, mail and computer permission boundaries. Add bilingual session-control and local application CLI guides.

Validation and remaining native-device limits are recorded in [candidate notes](docs/RELEASE-0.4.14-candidate.1.md). This entry does not certify native applications or live provider behavior.

## 0.4.13 — 2026-10-26

- Keep an editable input line visible while replies stream and tools run, with visible steer and queue receipts.
- Track multi-step work in a session Todo list that restores with the conversation and collapses to one row by default.
- Show the current model and task state in a compact, configurable footer; reload preferences without losing the conversation.
- Open a scrollable shortcut guide and fill editable drafts from the slash menu while work continues. [Guide](docs/SESSION-DOCK.en.md).

Built on 0.4.12. See [release notes](docs/RELEASE-0.4.13.md) for validation scope and remaining native-device limits.

## 0.4.5 — 2026-10-25

Support verified bundles up to 512 MiB and document one-time installer migration for older clients.

## 0.4.4 — 2026-10-25

Bundled Windows-MCP, bounded installation recovery, native mailbox sending and persisted inbox monitoring, and reversible Headroom projections. [Changes and limits](docs/RELEASE-0.4.4.md).

## 0.4.3 — 2026-10-24

Opt-in resident agent, scoped reminders, masked mail input and authorized inquiries, shared foreground/background task ownership, preview ownership and idle update continuity. [Release notes](docs/RELEASE-0.4.3.md) retain platform and account limits.

## 0.4.3-candidate.2 — unpublished

Adds opt-in resident-agent hosting through the existing Core, scoped proactive reminders, authenticated local IPC and OS user-service adapters. Retains candidate.1 mailbox input and inquiry fixes. Foreground windows keep separate sessions and approvals. Native login, notification visibility, Windows installation and real-account acceptance remain open. See docs/ALWAYS-ON.zh.md.

# Koder CLI 0.4.0-preview.28 Beta

This beta adds optional Windows-MCP and CodeGraphContext integration presets through the existing MCP host. Upstream Python executables and dependencies are not bundled.

- mcp presets and mcp doctor inspect catalog/platform/launcher data without opening the connection host or running the upstream program. Launcher presence is not native acceptance.
- The Windows-MCP target is 0.8.8, serve entry, native Windows 10/11 and Python 3.14+. Python stdio is UTF-8, upstream anonymized telemetry is off. No elevation, PowerShell-policy change or login task is added.
- CodeGraphContext targets 0.6.13. The preset binds cwd/allowed roots to the workspace and separates runtime HOME and graph paths per project. Agent discovery, calls and protocol reads filter other known preset workspaces.
- Agent guidance discovers actual graph schemas and checks indexed roots/freshness before relationship queries and source reads. Stale or unavailable graphs fall back to source search. Indexing, watching, arbitrary Cypher, deletion and desktop actions retain original approvals; graph results are not test evidence.
- /setup provides current-terminal integration entries. Saving configuration keeps the server disabled. The optional pinned uvx runner can download its target package and Python only when explicitly started.
- Explicit MCP add --enable or enable returns nonzero when connection fails instead of reporting configuration as successful connectivity.

## Verification and limits

The existing 12 benchmark prompts remain unchanged. Real MCP SDK tests use an owned stdio fixture to check discovery, approval, calls, durable results, same-turn continuation, workspace guards and failed-connection semantics. The fixture is not either upstream binary. This development Mac installs no Python dependencies and uses no paid model key. Native Windows UI actions, actual upstream binaries and a real graph database require separate acceptance. Existing unavailable model routes remain disabled. No new model capability score or competitor result is claimed.

Installers and complete bilingual manuals: https://karmenloop.com/cli.html#install

## Earlier release record

# Koder CLI 0.4.0-preview.27 Beta

This beta adds deterministic writing and project delivery checks to preview.26. It does not assign a new capability score or claim competitor performance.

- Technical-decision-maker Koder introductions with an explicit approximate Chinese length receive a 90–110% Han-character check. The original W01 request requires 720–880 Han characters. A short draft returns 3 with measured length.
- Release writing can call writing_sources to read a bounded list of workspace release documents. Matching changelog sections with two facts require two distinct actual line references. Acceptance terms, README text and a version label alone do not establish release increments.
- Compression of an actual preceding competitor comparison records its SHA-256 and flags new numbers and selected named technology claims. Missing predecessors and unknown information are disclosed. These checks do not establish semantic factual equivalence.
- project check inspects README, test/verify entries, Docker files or static HTML basics without running scripts. Recognized service, generator and landing-page creation turns return 3 when required structure is missing. Existing artifacts remain on disk. A file-structure check is not a successful test, security review or design grade.
- Task-specific delivery instructions favor a runnable first slice, tests, a small diff and saving work before a soft time target. No time-based process killer, automatic install or new execution permission is added.
- model presets derives total, selectable and unavailable counts from the current catalog. Selectable does not mean authenticated account acceptance. The seven held integrations stay blocked.

## Verification boundaries

Original C01–C07 and W01–W05 prompts are unchanged. Synthetic protocol tests cover gates, input handling, workspace recall, headless clarification and context compaction. They do not grade real-model output. Native Windows, authenticated providers, original missing fixtures, the 15-test generator target and competitor timing remain separate acceptance items. No paid model benchmark or recurring automation is started.

## Earlier release record

# 0.4.0-preview.26 Beta

Prepared from preview.26-candidate.8. The sections below describe the included repairs; they do not certify every native platform or external account.

- Explicit tasks do not wait on unrelated stdin. --stdin attaches complete pipe input with a finite read deadline.
- Task history and automatic recall stay in their workspace/session. Explicit shared notes keep their separate scope. New creation tasks use Koder Projects.
- Headless ask_user returns unanswered without user consent and stops repeated questions within a small bound. --yes remains temporary execution approval.
- Rejected requests before model content or tool/effect activity restore the previous history. Completed effects and model-only recovery remain intact.
- Provider error details are bounded and redacted; model diagnosis uses a short deadline. Unparsed JSON review and unsupported writing-disclosure results do not return a clean exit.
- Task-specific prompt composition supports the strengthened 13-turn 8k context scenario without raising the window.
- Browser/design method resources and complete bilingual guides are included. Native browser/service availability and authorization remain required.

## Test scope and known limits

The source baseline records 63 final contract passes and 30 Windows-related portable passes on macOS, plus broader scoped regressions. This publication checks the packaged bytes and isolated installation separately. Native Windows, real provider accounts and original capability grading are not established by those fixtures. MiMo Token Plan, Kimi API/Code, DeepSeek, Alibaba Token Plan and Volcano integrations remain unavailable. No automatic provider or billing-route fallback was enabled.
