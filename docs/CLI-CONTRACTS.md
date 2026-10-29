# Scriptable CLI contracts

These contracts include retained behavior and the **0.5.1** context controls. Local fixture checks are separate from a native Windows installation, real provider account or whole-product release. Do not infer a live service from a visible preset or method Skill.

## Commands and failure results

| Promise | Observable command or trigger | Success / failure semantics | Regression |
|---|---|---|---|
| A task argument does not wait for an unrelated pipe | `koder ask "task"` with an open, silent stdin | No stdin read unless `--stdin` is given; model/task failures remain nonzero | `reliability-regression.test.mjs` |
| Piped input is complete or visibly rejected | `producer | koder ask "summarize" --stdin --stdin-timeout 5` | Timeout or oversized input exits 2; partial input is not submitted | `reliability-regression.test.mjs` |
| Headless clarification is not user consent | A native Agent calls `ask_user` without an interactive prompter | Tool gets `state=unanswered`, `userConsent=false`, no selected index; work can continue using disclosed reversible assumptions. Three unanswered questions are allowed; a fourth cancels with a nonzero exit | `headless-history-contracts.test.mjs` |
| Secrets and explicit cancellation stay separate | `request_login`, an explicit cancellation, or an unavailable sensitive approval | No fabricated password, grant, purchase or message permission; cancellation is nonzero | Agent, permissions and headless contract tests |
| Task history is workspace scoped | A writes a task marker; B asks about it; A resumes | B cannot recall A's automatic task facts. Explicit `memory add` notes remain shared | Context and shared-memory entrypoint tests |
| Rejected pre-response requests do not inflate history | Repeat a failing 400/401 request three times; inspect `koder memory show --json` | Prior messages and notes stay unchanged; no rejected prompt enters shared recall. A diagnostic explains that the task must be resent after addressing the error | Headless/history contracts |
| Completed effects survive later failure | A verified write succeeds, then the next model request fails | Preserve original messages, receipts and recovery boundary; retry must not overwrite a later user edit or replay a tool | `api-continuation-audit.test.mjs` |
| An unparsed review is not a clean review | `koder review --format json` | At most one structured follow-up after a successful request; unparsed results exit 3 with `REVIEW_UNPARSED`. API failures keep their failure exit | Supplemental/workflow tests |
| Release copy declares its sources | W02's original prompt, with no changelog | Source instructions are in the actual request. Unsupported increment claims or missing disclosure exit 3 with `WRITING_EVIDENCE_UNVERIFIED`; JSON result is `unverified` | Writing contracts and deterministic goldens |
| Changelog evidence is observed, not asserted | Actual successful `read_file` of a matching-version changelog | Record relative path, version match and tool-output snapshot hash. README, failed reads, assistant claims and another version do not establish a changelog | Writing contracts |
| Remote references are opt-in | `koder resources status`; `search "keywords" --remote` | New profile defaults disabled. Only explicit opt-in may send keywords; private misses never fall back to the remote service | Remote/private-resource tests |
| Diagnosis is bounded and useful | `koder model test` | Short combined deadline, no inference retry loop, bounded/redacted provider reason. A text-only pass does not establish tool support | Reliability/model HTTP tests |
| Usage errors are distinguishable | Invalid flag, language, approval value, or missing `fix` task/check | Exit 2 with actionable usage, no model call | Reliability/supplemental tests |

## Approval and exit codes

`--yes` accepts execution prompts for this invocation; it does not save full access, choose an answer, accept a software agreement, supply credentials or grant OS privileges. `--approval full` selects the full execution policy for one invocation. A saved grant is a separate `koder permissions execution full --confirm FULL` action with a defined scope. Explicit deny remains effective. A `YES_SCOPE` notice explains the temporary meaning when `--yes` is used for an execution prompt.

Exit 0 means the turn or command completed under its contract. It does not prove that every requested feature was implemented or that a website, application, provider or operating system passed acceptance. Tests and delivery checks must establish those outcomes. Exit 1 covers refusal/cancellation or a failed check; 2 covers usage/model/request failure; 3 covers a structured review or writing-evidence contract that could not be established. Read the specific code and stderr rather than treating every nonzero exit as a network failure.

## History and writing limits

A failed request is eligible for rollback only before any visible model content, assistant/tool record, pending effect, queue change or effect-ledger change. Failure after a read, write, command or other tool retains its recovery evidence. This is not a cleanup operation over older histories, and it does not remove old records automatically. If a rollback cannot be persisted, it must not claim that history was unchanged.

The writing gate checks disclosure and selected attribution/price patterns. It is intentionally conservative and is not a semantic fact checker, a writing score, or proof that every claim follows from a source. Existing draft text or files still require review; streaming text can be visible before the final nonzero result. Release-task email text is also checked before calling the mailbox send path; a failed check cannot send. Passing these patterns still does not establish every fact or authorize sending or publishing anything. Real W02 grading and competitor comparisons remain separate.

## Platform acceptance

Linux application connections still require `secret-tool`, DBus and an unlocked Secret Service. No plaintext credential-file downgrade is introduced. Native Linux/keyring and Windows checks remain separate platform gates.

## Writing contracts

W01 measures the independently reread primary file delivered in the current turn, falling back to the final reply only when no file is identified. W02 accepts explicit non-increment disclosure in Chinese or English; a later unsupported positive claim still returns 3. Read source snapshots carry hashes and exact line citations; acceptance terms, installed version and release JSON metadata cannot certify new features. W05 records an explicitly named, actually read predecessor file or the preceding answer hash. Unknown pricing can pass; numeric pricing remains conservative until a trusted official-page receipt is integrated. Exit 3 is a writing contract failure, not an API outage. See QUALITY-CHECKS.en.md for bounded source lookup and blind-grading gates.

## Current-turn delivery

See [the delivery guide](TASK-DELIVERY.en.md). The native loop can request at most two bounded repairs of missing current-turn artifacts or explicit format requirements. Exit 3 also covers `TASK_DELIVERY_INCOMPLETE`, with JSON evidence and a persisted local notice. Existing permissions, cancellation, unknown-effect handling and model-only recovery remain in force. This is not a semantic correctness or model-quality guarantee.

## Device migration (source candidate)

`migrate export`, `inspect`, `import`, `send`, `status`, `open`, and `rollback`
share the existing CLI, config and session runtime. Import/send/rollback require
explicit `--yes` or the wizard confirmation. Invalid command syntax exits 2;
authentication, transport and restoration failures exit nonzero. A successful
import returns `MIGRATION_IMPORTED_REAUTHORIZE`, not proof of a working remote
model, mailbox or desktop driver. Lost remote receipts remain UNKNOWN. The
receiver validates content before staging, and imports never resume old effects.
Existing destination configuration is untouched. `open` enters the isolated
profile with a verified destination EULA receipt where one already exists.

See [migration tutorial](DEVICE-MIGRATION.zh.md) for the complete transfer scope
and [English guide](DEVICE-MIGRATION.en.md) for prerequisites and limitations.

## Context controls (0.5.1)

`koder context` and chat `/context` share Setup's settings. Automatic compaction defaults on with an 80% trigger, 60% soft target and preference for four recent turns. Model window and output limits remain in the original model record; changing a project-selected model must not overwrite another profile. Changing limits does not expand the provider's actual supported window.

`context off` disables lossy automatic history projection. If the complete request cannot fit, `CONTEXT_BUDGET_EXCEEDED` stops before contacting the provider; this is a local error, not an API outage. Headroom's reversible tool-result view remains independently configurable, and protocol restoration may still convert older frames lacking required private provider state. Full disk history is retained.

Current root instructions and steering stay together. Pending and unknown tool groups cannot be discarded to meet a target. Signed protocol groups stay intact below the hard window. With compaction enabled, a complete returned signed group may be atomically represented as quoted visible receipts only when the hard window would otherwise overflow: call identities, arguments and results remain, opaque state is omitted together, and no old call is replayed. The target and recent-turn preference may yield to the hard model window; protected content that cannot fit causes an explicit error. Carryover is quoted original text, not newly verified facts or permission. Headroom, receipts, costs, cancellation and provider-reported billing remain separate.

The final JSON result’s `context` field and `/context status` expose request estimates including tool schemas and output reserve. They are not exact tokenizer counts or billed usage. `context status --json` outside a live session reports configuration with `lastRequest:null`. External ACP engines own their own context policy; these controls do not claim to override an external process. [Guide](CONTEXT-CONTROLS.en.md).

## Local code repair

The optional `cli_repair` service uses the current task and cost account. The native tool cannot enable its own grant. Workspace-only contracts and read-only modes reject repair writes. Candidates must reproduce a failure against the current code and pass the candidate cases and retained checks before activation. Activated feature code loads at the next process start; original package bytes and prior task receipts remain. Protected controls are outside the path allowlist. See [scope and recovery](SELF-REPAIR.md).
