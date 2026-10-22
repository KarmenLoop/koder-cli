# Scriptable CLI contracts

These contracts describe **0.4.0-preview.26 Beta**. Local fixture checks are separate from a native Windows installation, real provider account or whole-product release. Do not infer a live service from a visible preset or method Skill.

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
