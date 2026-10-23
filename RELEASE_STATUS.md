# Koder CLI 0.4.0

Koder CLI 0.4.0 is the formal release based on the published preview.30 runtime. Windows CMD and PowerShell installers and the macOS/Linux shell installer are available alongside the shared CLI archive. This is a release-channel promotion with consistent version, installer, license-record and update metadata. It does not add the separate pricing or inline-reverse candidates.

## Included improvements

The preview.30 multiwindow fixes remain: independent default sessions when an older task owns a turn lock, cleanup after supervisor disconnects, process-instance checks for recycled PIDs, and accurate ownership notices. Existing models and BYOK routing, workspace history, permissions, tools, memory, Skills and all 30 tutorial lessons remain available.

## Install and update

- Windows CMD: download [koder-cli.cmd](https://karmenloop.com/install/koder-cli.cmd), then run it in Command Prompt. The PowerShell installer is [koder-cli.ps1](https://karmenloop.com/install/koder-cli.ps1).
- macOS: download [koder-cli.sh](https://karmenloop.com/install/koder-cli.sh), then run `bash koder-cli.sh` in Terminal. The installer selects the runtime for Apple silicon or Intel when needed.
- Existing users: run `koder update`, then `koder --version`. The expected version is `0.4.0`. Settings and stored history remain in place.
- These are CLI installers, not signed desktop EXE or DMG applications. The separate desktop product keeps its own release channel.

Read the [installation guide](docs/INSTALLATION.md), [English guide](docs/USER-GUIDE.en.md), [Chinese guide](docs/USER-GUIDE.zh.md) and [independent task guide](docs/MULTI-WINDOW.md). All eight printable tutorial editions are linked in the guides.

## Verification boundaries

The preview.30 baseline passed 353 local regressions. Its changed components passed 34 applicable subprocess checks on Windows Server x64 and Windows 11 ARM, plus nine real CLI-entry checks using a local synthetic model on each platform. Those are baseline results, not a claim that every 0.4.0 installer or Windows client path was rerun. The 0.4.0 release-channel, exact package, installation and public readback results are recorded separately in the release acceptance receipt.

PowerShell 5.1-only cold startup, Windows 10/Windows 11 x64 full client GUI/ConPTY/IME/UAC and authenticated external-provider/mailbox accounts remain incomplete. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as documented. Formal distribution does not turn these records into passes. No new writing score, complete REA replacement or optional external-engine concurrency certification is claimed.

Previous preview releases and their checksums remain available for rollback. This release does not remove user data, enable synchronization, grant new execution authority or accept a license on the user's behalf.

## Historical preview.30 and earlier records

# Koder CLI 0.4.0-preview.30 Beta

This is a focused multiwindow hotfix on the complete preview.29 runtime. Existing models, BYOK settings, permissions, Skills, project history, tutorials and recovery remain available. New writing-price and inline-script research remains in a separate unpublished candidate.

## Fixed

- A new default task now checks both lifetime ownership and the older per-turn lock before reading history. If an older Koder process holds only the per-turn lock, the new task receives an independent session immediately. An explicitly named busy session remains protected.
- A CLI worker that loses its supervisor connection cancels its own pending request, closes its input wait and releases its own session. Disconnects during startup and restart acknowledgement no longer leave a 15-second waiter behind. Normal updates retain their existing restart and recovery flow.
- Ownership records include a process-instance identifier. A record from an earlier Koder incarnation with the current recycled PID no longer blocks the current process. Legacy live owners and other unverifiable processes remain protected; records are not deleted merely because they are old.
- A busy notice describes unavailable ownership rather than asserting that another visible window exists. Automatic isolation prints the new session name and its resume command.

## Use two or three independent tasks

Open separate terminal windows. Running `koder` in each window automatically separates occupied default sessions. To choose stable names, use `koder chat --session website`, `koder chat --session slides` and `koder chat --session tests` in separate windows. Resume with the displayed session name. Same-project files remain shared; use separate project directories when outputs must be independent. Do not delete the memory directory or terminate unrelated Node processes to clear a notice.

## Update

Run `koder update --check`, then `koder update`, and verify `koder --version`. Close a finished older window normally. Updates retain settings and stored history. All eight printable tutorials and the complete English and Chinese guides describe preview.30.

## Evidence and limits

The original public preview.29 archive reproduced the legacy-lock and recycled-current-PID defects. The focused candidate passed 35 local regressions. Independent review found no required fixes in the three changed runtime components. Windows subprocess checks use synthetic loopback responses, not paid provider accounts. Exact packaged checks and native results are recorded separately in the publication receipt.

PowerShell 5.1-only cold startup, Windows 10 and Windows 11 x64 client coverage, unobstructed GUI focus/input, ConPTY/IME/UAC and live account acceptance remain incomplete. Windows Server is not a Windows 10/11 client. Earlier failures remain recorded. This Beta does not claim full Windows certification, a new writing score, a full third-party reverse-tool replacement or validation of the optional external engine. MiMo, Kimi, DeepSeek, Alibaba Token Plan and Volcano routes remain unavailable as previously documented.

Read [the multiwindow guide](docs/MULTI-WINDOW.md), [installation](docs/INSTALLATION.md), [complete English guide](docs/USER-GUIDE.en.md) or [Chinese guide](docs/USER-GUIDE.zh.md).

## Historical preview.29 and earlier records

# Koder CLI 0.4.0-preview.29 Beta

This beta combines the retained preview.28 runtime with the two preview.29 candidates. It is an incremental release; existing provider routes, BYOK settings, permissions, Skills, project history, tutorials and recovery remain available. Beta publication does not close the platform and account checks listed below.

## Changes in this beta

- MiniMax content-review replies with recognized code 1026 or 1027 now report `MODEL_FILTERED`, including the HTTP 422 path, instead of an API-unreachable notice. Only bounded, redacted diagnostics leave the provider parser. Credential, quota, parameter and network failures remain distinct; rejected content is not automatically rewritten, resent or sent to another endpoint.
- Native Koder chats can run in two or three terminal windows with separate session ownership. A second default window gets its own session before loading history; an explicitly named busy session is not taken over. Same-project files remain shared. Local subprocess acceptance is not Windows terminal acceptance, and the optional external engine is outside this test scope.
- Typing `/` at an empty interactive prompt opens contextual suggestions, saved templates and commands. Choose with arrows or PageUp/PageDown, fill with Tab, then edit and send. Selection itself never sends. Esc closes the list; direct commands, pasted input and noninteractive usage retain their behavior.
- Long-context carryover reserves its warning and framing before selecting excerpts. Early task markers and constraints survive tight-budget checks without increasing the model window or turning historical text into fresh permission.
- Writing checks measure the verified main deliverable, accept explicit English or Chinese non-increment disclosure and read bounded versioned release/acceptance records plus installed public facts. A named predecessor file is recorded with its path and SHA. Acceptance terms and installed versions cannot prove new features. Unknown pricing may be disclosed; unsupported numeric competitor prices remain conservative.
- Harness²-inspired comparison uses the existing Core and growth method. Baselines remain available, probes compare actual local artifacts and conditional lessons can be rejected as `NO_ENTRY`. Global adoption still requires the existing trusted replay and owner-authorization ports. No fixed model, second scheduler or new permission authority is added.
- Scoped crawling uses a task-specified site and bounded same-origin HTML/external JavaScript reads, then the existing first-party reverse worker. Local static analysis does not execute the inspected target. It is not authenticated browsing, complete decompilation, vulnerability proof or a full REA replacement.
- On Windows, the credential helper prefers a regular installed PowerShell 7 executable at its fixed system path. DPAPI CurrentUser, private input and the existing deadline remain in place. PowerShell 7 is not installed automatically.

## Evidence and open checks

The original C01–C07 and W01–W05 prompts are unchanged. Local deterministic and subprocess regressions, native disposable-runner observations, exact-package checks and authenticated provider tests are separate evidence categories. No new writing score, competitor win or full Windows certification is claimed.

Windows PowerShell 5.1-only cold startup remains unresolved. The available Windows 11 ARM64 image blocked owned-window foreground focus; no click/type proceeded after that failure. Native Windows 10 and Windows 11 x64, this release's full CMD/PowerShell install and update/restart, ConPTY/IME/UAC, unobstructed GUI input, real provider accounts and independent product QA remain open. Earlier failures remain recorded. A successful syntax check or fixture is not a passing client run.

MiMo Token Plan, Kimi API/Code, DeepSeek, Alibaba Token Plan and Volcano Coding Plan/Ark remain gray and unavailable. Optional MCP, mail, browser, graph and deployment services require their documented dependencies and separate authorization. The backup engine stays disabled by default.

## Install, update and learn

Use [installation](docs/INSTALLATION.md), the [complete English guide](docs/USER-GUIDE.en.md) or [Chinese guide](docs/USER-GUIDE.zh.md). Run `koder update --check`, then `koder update`, and verify `koder --version`. Keep your credentials, project folders and memory when updating. `koder update auto status` reports background-update settings.

The release includes eight complete, 30-lesson printable editions for PowerShell, CMD, macOS and Linux in English and Chinese. `koder learn` runs the scripted local tutorial without paid model calls. Read [provider and input changes](docs/PROVIDER-WRITING-INPUT.md), [multiple windows](docs/MULTI-WINDOW.md), [Harness increment](docs/HARNESS-INCREMENTAL.md), [reverse analysis](docs/AUTONOMOUS-REVERSE.md) and [Windows evidence](docs/WINDOWS-COLD-CANDIDATE.md) for limits and examples.

## Historical records retained below

# Local candidate 0.4.0-preview.29-candidate.2

Unpublished incremental candidate. This update addresses MiniMax content-review error reporting, writing source and predecessor evidence, an editable slash-input picker, and concurrent native Koder session ownership. Prior Harness², reverse, Skills, providers, permissions, history isolation, tutorials and platform work are retained. Synthetic regression and package checks are distinct from paid-model writing scores and native Windows acceptance. No writing-score improvement or formal release is claimed.

## Retained candidate record

# Local candidate 0.4.0-preview.29-candidate.1

Unpublished. The complete previous source and release record are retained below. New candidate scope: additive Harness²-style contrast metadata and artifact probing, original-Core-controlled skill adoption, scoped crawler/static reverse Agent tools, and installed-system-PowerShell-7 credential startup. No new fixed provider, background scheduler or permission authority. Paid-model evaluation and complete Windows client acceptance are not claimed. See docs/HARNESS-INCREMENTAL.md, docs/AUTONOMOUS-REVERSE.md and docs/WINDOWS-COLD-CANDIDATE.md.

## Retained published record

# Koder CLI 0.4.0-preview.28 Beta

## Actual-call addendum — October 23, 2026

Windows-MCP calls and public preview.28 Agent continuation passed on an isolated Windows Server 2025 runner. CodeGraphContext with Ladybug and the Koder graph flow passed on an isolated Apple-silicon Mac with its native OpenSSL 3 prerequisite. Read docs/MCP-ACTUAL-ACCEPTANCE.en.md for exact versions, driver limitations and remaining platform gates. The initial publication evidence below remains historical; the installer was not rebuilt.

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

## Historical status

# Koder CLI 0.4.0-preview.26 Beta

This beta is prepared from the frozen preview.26-candidate.8 runtime. It includes explicit-stdin handling, workspace-scoped task recall, Koder Projects folders, bounded provider diagnostics, model-only recovery, refreshed pinned browser/design method resources, opt-in remote references, noninteractive clarification, safe rejected-request history rollback and deterministic writing-disclosure checks. The original 12 benchmark prompts are preserved; no new capability score is assigned.

Local contracts: 63 passed. Windows-related portable logic: 30 passed on macOS. Native Windows and authenticated provider behavior have not been executed in this publication task. The unavailable provider entries remain disabled. A written draft rejected by evidence checks returns 3 without being mislabeled an API fault. Read docs/WINDOWS-INSTALL-CHECKS.md and docs/BLIND-BENCHMARKS.md for precise test limits.

## Historical candidate notes

# 0.4.0-preview.26-candidate.8 - unpublished source candidate

Noninteractive ask_user returns unanswered without user consent. Repeated questions are bounded. Rejected requests before any reply/tool/effect restore prior history; completed-action recovery remains separate. Release and competitor writing gain observed-source guidance and deterministic disclosure/attribution checks. Original benchmark prompts are preserved; real capability grading has not been rerun. Native Windows and provider-account behavior has not been established here. The historical desktop motion/glass Actions job is not a CLI test or a current CLI blocker; see docs/WINDOWS-INSTALL-CHECKS.md. Beta publication is coordinated by the product team. This candidate is not a public installer.

# Koder CLI 0.4.0-preview.26-candidate.7

Source-only reliability and workflow skill candidate. Explicit ask/run prompts no longer wait for unrelated stdin; --stdin enables attachment, and incomplete input has a deadline. Automatic task facts are projected only into their own conversation; explicit shared notes retain their separate semantics. New creation tasks use the users Koder Projects folder while explicit/existing workspaces remain selected. Provider errors include bounded redacted reasons, model diagnostics use a short single-attempt budget, and explicit language reaches the actual request. Skill catalogs load on demand; the browser workflow is pinned with its license. Native Windows, whole-product, account and production release gates remain open. Not packaged or published.

## Retained candidate.6 source

# Koder CLI 0.4.0-preview.26-candidate.6

Source-only visual workflow and Netlify extension. Not packaged, published or accepted for production. Three real HTML directions, visual decisions and H5 project maps use the existing local preview and Agent service ports. Netlify supports protected token entry, configured ticket OAuth, exact-site binding, consented site creation, draft digest uploads, reconciliation and separately approved production publication. Local synthetic acceptance is separate from real OAuth, account, hosting, Windows and release acceptance. Koder-managed membership hosting is not configured.

# Retained candidate.5 mail and preview source

Source-only mail and preview extension. Not packaged for release, accepted for production or published. Preserves candidate.4 API and update-order repairs and integrates the frozen r7 mail/preview delta. Mainstream presets include Spacemail (Spaceship) with IMAP 993, POP3 995 and SMTP 465 over TLS. Custom POP3 TLS/STLS receiving, receive-only login and task-aware companion preview have focused local acceptance. Windows Actions and real mailbox/provider gates remain unverified. Microsoft server presets are present; OAuth login remains unavailable until configured.

## Retained candidate.4 API and update repairs

Internal lifecycle acceptance repair candidate, based on preview.26-candidate.3. Not accepted for production or published. The official preview.22 release and website remain unchanged.

MiniMax Messages responses retain their complete interleaved block sequence. Stream EOF before a completion marker is reported as an interrupted reply; incomplete tool calls remain blocked. A valid omitted-thinking response can resume in the same live chat without inventing a reasoning field. The in-memory absence witness is not reconstructed from disk or another account. HTTP 401 remains a credential rejection; memory isolation warnings still use disclosed RAM fallback. These are synthetic regressions, not acceptance of the reporting user account or Windows machine.

Koder Reverse 0.1.0 adds independently authored PE/ELF/Mach-O/WASM/ASAR metadata analysis, JS lexical project candidates, an ARM64 instruction subset, conservative graphs, evidence, query and extracted-fact comparison. Its analysis core uses only Node.js and first-party modules. It runs without the third-party REA directory. Existing REA remains available: full decompilation, dynamic analysis, complete architecture coverage and replacement acceptance are not finished. See docs/KODER_REVERSE.md.

After each eligible chat reply, up to three optional drafts use the visible conversation: explicit answer options first, then goal and phase-specific follow-ups. /prefill 1–3 fills a draft; the picker also lists current suggestions first. Users can edit, clear, ignore or disable them. Suggestions use local rules, make no additional model request, and do not persist conversation-derived text. Session, account and model changes invalidate stale suggestions.

The CLI and current chat expose editable task templates through /prefill, /prompts and the setup menu. Eight bilingual built-ins and explicitly saved local custom templates are available. Choosing a template does not submit it. Existing drafts, queued messages and approval input are protected; unsupported terminals receive copyable text. Multiline bodies are flattened before entering the single-line editor. See docs/PROMPT_PREFILLS.md.

This candidate retains the earlier API repair and bundled REA. Their previous host/Agent timeout failures, Windows NOT_RUN and provider availability holds remain open. A passing prefill check does not close those release gates. Optional Frida, platform PTY prebuilds and external native engines remain outside the bundle. See docs/REA.md and the prior acceptance record.

The updater recognizes the existing Koder private candidate spelling as part of the numeric preview track. A preview.26 candidate can discover preview.26 and later previews without changing precedence for unrelated prerelease identifiers. Candidate.3 remains preserved as a failed update-discovery baseline. Real Windows and provider-account acceptance remain separate gates.
