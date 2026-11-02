# Markdown project learning

[English](MARKDOWN-LEARNING.en.md) · [简体中文](MARKDOWN-LEARNING.zh.md)

Koder saves task checkpoints, decisions and reusable experience as local Markdown. Learning is enabled by default for the built-in KARMENLOOP engine. It uses the current model, tools and approvals; it does not train model weights or register another agent runtime.

The first eligible task creates its library. `learning status`, help, Setup navigation, and read-only planning do not initialize a library. `--no-learning`, `--no-memory`, the growth master switch, disabled growth skills, and a saved learning opt-out all take precedence. Temporary sessions caused by unavailable memory storage do not create a learning library.


The bundled method is personal-agent-growth 0.4.3. Enabled tasks load short, hash-pinned method excerpts by default; detailed references use `skill_read`. JSON results report the loaded ranges in `growthMethod`, separately from actual tool calls and verification. See [the integration guide](AUTONOMOUS-LEARNING.md).
## Storage and task boundaries

An explicit `--learning-root` or `KODER_LEARNING_ROOT` chooses an exact directory. Management commands also accept `--root`. Otherwise Koder uses `KODER_DATA`, saved `dataHome`, or the CLI data directory, with `learning/accounts/<account-hash>/workspaces/<workspace-hash>` beneath it. An existing `~/.koder/learning` library is reused only for a compatible local workspace. No automatic migration or copying of existing notes occurs.

Libraries record their account and workspace binding. A mismatched binding disables optional learning and preserves the files. Account changes and revocation are checked again before tool writes, final checkpoints and idle reviews, so an old session does not keep writing to its former account library. Each conversation has a stable task project, so two conversations in one workspace do not share live progress. Restarting the same conversation resumes its task. To share a project deliberately, replace the example with your existing workspace path, change into it, then initialize and select an explicit project:

```sh
cd /path/to/repo
koder learning init
koder learning project release-check -w /path/to/repo --goal "Verify the release"
koder chat -w /path/to/repo --learning-project release-check
koder learning resume release-check
```

Moving a bound library or workspace requires reconciling its binding; a new path is not assumed to be the same project. Local file sharing does not provide cross-device synchronization.

## Reading, recording and recovery

`memory.md` holds task facts. `context.md` and the latest committed node hold current progress and next actions. The native `learning_write complete` tool submits a summary as `pending_verification`; it cannot turn its own notes into proof of completion. After checking the actual deliverable and sources, an explicit `learning complete` command can finalize the task. Reopening preserves the old summary. Ordinary checkpoints cannot mark a task complete.

The initial task pack is limited to 4,000 estimated tokens. Required constraints are never silently truncated. Runtime searches and document reads stay within the current task. Existing explicit notes, shared-memory facts and personalization keep their current controls; task learning does not replace or migrate them. Historical material never grants tool permissions or authorizes replay of an unknown effect.

Tool observations contain names, call IDs, result hashes and states, not raw tool bodies. Original receipts stay in the conversation. Known model secrets are redacted before recording task text. Mail and general app tool turns do not copy assistant result bodies into a checkpoint. A model-created experience remains untested until separately validated.

The store uses local process locks, Markdown staging and journals, atomic replacement and expected hashes. Corrupt, unavailable or busy storage suspends optional learning with a bounded diagnostic; the primary task continues. Conflicting files are preserved. Read-only planning reads an existing task pack without initialization, checkpoints, reviews or recovery writes.

## Reviews and controls

Daily and weekly reviews summarize the current account/workspace library. Ordinary notes, answers and native learning reads remain task-scoped. Host-checked procedural experience can cross task sessions within the same account, workspace and task/model binding; see [learning from delivery failures](AUTONOMOUS-LEARNING.md#learning-from-delivery-failures). It adds no separate model requests and does not train model weights. `learning status --json` reports observed, retested, reopened and unavailable entries under `outcomes`; task JSON records the checks actually loaded and retested. Turning learning off stops this path too.

Reviews catch up at task start, task completion and a 60-second idle callback while Koder is open. Default times are 21:30 daily, 22:00 Sunday and 09:00 Monday in the timezone recorded during initialization. No operating-system scheduler is registered. A closed CLI does not wake itself. Unknown coverage and unavailable cost remain unknown. If any model request lacks usage, whole-task token totals stay null; reported subtotals and request coverage are retained separately.

Use `--no-learning` for one invocation. `koder learning off` switches the feature off in CLI configuration and disables the selected existing library. It creates no library; it still stops the feature if that library is corrupt. `learning on` enables the feature and the selected existing library without overriding the growth master switch. A fresh library is created only by an eligible task or explicit `learning init`. The same commands work as `/learning off` and `/learning on` in chat, including with a custom root.

Disabling or uninstalling Koder does not delete private learning files. Keep real task knowledge outside public repositories. Network filesystems, multi-host concurrency, real-model quality improvement and app-closed wakeup require separate acceptance.

## Sourced facts and cross-session recall

Koder CLI 0.8.4 adds native fact recall informed by [DeerFlow](https://github.com/bytedance/deer-flow/tree/12c304f12ce5c0bf66d8927386e5dd18ea84f685). It reuses the existing Markdown evidence log, protected profile and context pipeline. It adds no Python harness, Skill copy, database, cloud memory or background extraction request. Use 0.8.4 for these interfaces; an older installer does not gain this extension merely because this guide is available.

In an eligible writable task, a short, single-line instruction such as `remember: database = PostgreSQL` is captured before the next model request. In Chinese use `记住：数据库 = PostgreSQL`. This explicitly shared fact is available to later conversations in the same account and workspace. Ordinary task facts stay within their task. Documents, websites and tool output do not become user preferences through this capture path.

To inspect and manage facts from a terminal, use one workspace throughout:

```sh
cd /path/to/repo
koder learning init
koder learning remember database "PostgreSQL"
koder learning facts --json
koder learning correct database "SQLite"
koder learning forget database
koder learning status --json
```

`facts` lists workspace facts; add `--learning-project <id>` to include that task's facts. `status` includes `factMemory`. In chat, the corresponding explicit directives are `correct memory: database = SQLite` and `forget memory: database`. Keys identify a fact; use the key shown by `facts`. Forget stops future recall of that key. Original conversations, checkpoints and audit events remain, so it is not a physical data-erasure command.

The Agent uses the existing `learning_read pack|facts` and `learning_write remember|correct|forget` tools. Writes require an exact quotation from current user evidence. Workspace promotion requires a direct request to remember; correction and forgetting require new user intent. Old evidence is fenced out after a correction or forget, including after restart. If `LEARNING_MEMORY_STALE_SOURCE` appears, use a new user turn rather than replaying an earlier tool call. Mid-run steering does not create a new memory evidence receipt.

Exact duplicates retain their sources without increasing confidence. Differing values for the same scoped key remain conflicts and are omitted from automatic recall until resolved. Similar wording, negation, different numbers and case-sensitive paths are not merged by similarity. Recall ranks English terms and Chinese bigrams, then selects whole facts under both byte and estimated-token limits. Up to eight facts use at most 1,200 estimated tokens and 5,000 UTF-8 bytes, including provenance, within the existing 4,000-token task pack. At most 100 active facts are admitted to the current scope view; a full view requires review rather than silent eviction.

The existing Setup learning switch, `learning off`, `--no-learning` and `--no-memory` still control capture and injection. Personalization retains its separate opt-in. Disabling removes the recalled pack at the next runtime boundary. Remembered text cannot grant tool permissions, authorize an unknown side effect or prove a task succeeded. The integration's design and acceptance boundaries are documented in [DeerFlow-inspired memory](DEERFLOW-MEMORY.en.md).
