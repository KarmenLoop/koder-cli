# Markdown project learning

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
