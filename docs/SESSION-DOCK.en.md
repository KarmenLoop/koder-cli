# Session Todo and compact input dock

Available in Koder CLI 0.4.13 and later. Run `koder update`, then check `koder --version`; changing configuration alone does not upgrade an older installation.

0.4.14-candidate.1 adds model/effort pickers and independent queue controls. [Step-by-step guide](SESSION-CONTROLS.en.md). Candidate features are not a claim about the current public release.

The current source adds dependency-aware Todo plans, paging, unlimited default model rounds, and shared cost accounting. See [task orchestration](TASK-ORCHESTRATION.en.md). The older version notes above identify the interface's origin, not availability of every later change in an older installed package.

The default layout uses one collapsed Todo row above the editable input and one status row below it. An empty checklist uses no space. The interactive dock omits the old heavy conversation separators.

## Using the dock

Start `koder chat`. The footer shows the resolved model or “Not configured · /setup”. During a multi-step task the built-in agent can call `todo_set`; ordinary questions need no checklist.

Ctrl+T expands or collapses Todo without changing the draft. Expansion uses at most six rows; short terminals retain the summary and prioritize input. `/todo`, `/todo 2`, and later pages expose the complete saved list. In the expanded dock, PgUp/PgDn or `/todo next` and `/todo prev` changes pages. `/todo toggle` is the alternative when the terminal reserves Ctrl+T. Active items use the theme accent.

Keep typing while the model or tools work. Enter steers by default, with the original receipt and safe-boundary semantics. Queue mode remains FIFO. A receipt acknowledges intake, not retroactive modification of an in-flight model request. Unknown remote receipts are not retried automatically. Most slash commands remain queued during work; `/help` and `/todo toggle` are immediate interface actions.

`/todo clear` requires a newly typed yes; `/todo clear --yes` confirms only that checklist operation. It grants no execution, desktop or mail permission.

## Keys

| Key | Behavior |
| --- | --- |
| Enter | Send; while working, steer or queue |
| Ctrl+J | Insert a newline if the terminal distinguishes LF from Enter/CR |
| Esc | Close a menu/help panel first; otherwise cancel active work |
| Ctrl+C | Cancel active work; idle clears input, a second press exits |
| Ctrl+D | Exit with empty input |
| Ctrl+T | Toggle Todo |
| Ctrl+P | Choose a configured model; busy changes apply next turn |
| Ctrl+E | Cycle Standard → Deep → Fast → Off; Setup can select picker mode |
| Ctrl+U | Clear input before the cursor |
| Up/Down | Input history, or menu navigation |
| / in empty input | Suggestions, templates and commands |
| Tab | Fill an editable draft, without sending |

Help scrolls with arrows or PgUp/PgDn and closes with Esc, q or Enter. If Enter and Ctrl+J have identical terminal encodings, configure distinct encodings or paste multiline text. Shift+Enter and Ctrl+S are not advertised as implemented shortcuts.

An approval temporarily owns the prompt. Existing queued tasks and drafts cannot approve it. Exact stop words and replacement-after-cancellation retain their existing behavior.

## Configuration

Setup → Session interface controls the footer, default Todo expansion and three status order presets. Setup → Mid-run input still controls steer/queue.

Use the existing `~/.koder-cli/config.json` or `KODER_CLI_HOME`; no parallel TUI store is added:

```json
{
  "sessionInputMode": "steer",
  "tui": {
    "todoExpanded": false,
    "statusLine": {
      "enabled": true,
      "items": ["model", "effort", "mode", "tasks", "tips"]
    }
  }
}
```

Slots are model, effort (added in the 0.4.14 candidate), mode, tasks (queued count), tips, cwd and context. Missing context telemetry is explicitly unknown. This change adds no goal/git slot or executable custom status command. Unknown slot IDs are ignored with one warning per window. An empty items array renders no footer.

`/reload-tui` reloads preferences without resetting the conversation or draft. Tips rotate about every ten seconds only while idle with empty input. Removing tips stops visible rotation. Model resolution stays with the existing session/command, project and user resolver. Successful model changes refresh the footer; failed changes keep the existing model. Busy display uses the current session's provider metadata.

## Persistence and boundaries

Todo has no 64-item total limit. `todo_set` supports replacement, incremental `upsert`, removal, reordering, dependency changes, replanning, and paginated reads. Items retain a stable id, single-line title, status, `dependsOn`, priority, order, assignee, notes, createdAt, and updatedAt. The list records `revision` and revisedAt. Stale revisions, missing dependencies, and dependency cycles are rejected. Symbols are [ ] pending, [>] in_progress, [x] completed, [-] cancelled, [!] blocked, and [x!] failed.

The existing workspace/session/window memory owner persists it. Reopening that same session restores it. Cancellation and interrupted recovery return active items to pending while preserving completed entries. Koder currently has no /undo; this change adds no file rollback.

Checklist status is an agent assertion, not an execution receipt or authorization. Agentd pushes updates and clears metadata through its existing authenticated session IPC. It never clears another window or reports a remote clear after changing only local display state. Old records without Todo load as empty. --no-memory remains nonpersistent.

Non-TTY/--json runs omit the dock; JSON events can include type todo. The existing executor, provider, permissions, mail and update paths remain authoritative.

## Validation

Run the focused contracts from an isolated checkout:

```sh
TERM=xterm-256color node --test --test-concurrency=1 \
  test/session-todo.test.mjs test/session-dock.test.mjs \
  test/session-input-terminal.test.mjs test/slash-menu-terminal.test.mjs \
  test/agentd.test.mjs
```

On macOS/Linux, record the actual CLI with an owned PTY and scripted provider:

```sh
python3 test/fixtures/session-dock-pty.py "$(command -v node)" \
  test/fixtures/session-dock-pty.mjs /absolute/existing/evidence-directory
```

The fixture uses a temporary HOME and no real account, external model or installed service. Its timeout cleans up only its own child.

Manual checks cover Todo updates and restoration, expanded/collapsed/narrow layouts, draft retention, steering/FIFO/cancellation, fresh approval, slash/help overlays, model selection/failure/unconfigured state, configuration round trips and independent windows. Native Windows Console, ConPTY, IME and real-provider behavior require separate evidence. Local PTY and loopback checks do not certify them.
