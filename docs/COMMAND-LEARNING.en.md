# Choose what to learn in Koder

This page describes the command-learning update. If your installed build has no learning menu, check `koder version` and its release notes. New documentation does not add features to an older installation.

Run `koder learn` in PowerShell, CMD, macOS Terminal or a Linux terminal. Inside a Koder chat, enter `/learn`, or open `/setup` and choose **Tutorial**.

The learning menu offers:

1. **Slash commands:** purpose, syntax, examples, expected results and cautions for each supported session command.
2. **Course units:** select a unit and then a lesson from the existing 120 units and 1800 lessons.
3. **Title search:** find lessons by keyword.
4. **Resume:** continue the saved lesson, or start foundations on your first visit.
5. **Restart:** begin at lesson 1.

Directories show up to 12 entries per page. Enter the displayed number, `n`/`p` for pages, a keyword to filter, `*` to clear the filter, `b` to go back or `q` to quit. Command directories also accept names such as `/queue` and aliases such as `/input`. No matches produces a visible message and lets you search again.

After choosing a course, select **Hands-on**, **Developer**, **All content** or **Coach overview**. In a lesson, Enter continues, a number jumps, `b` goes back and `q` saves progress and quits. Lesson numbers are unchanged. Browsing command help never marks the course complete or changes its saved lesson.

Lessons 31–1800 are currently taught in Chinese; changing the interface language does not translate them. The original English coach lessons remain available.

## Learn a command before using it

Inside Koder:

```text
/help queue
/learn /queue
/learn commands
```

The first two explain `/queue`; the third opens the command directory. Reading the lesson does not turn queue mode on.

| Command | What running it does | What to check |
| --- | --- | --- |
| `/queue list` | Lists pending messages | Order, previews or an empty-queue message |
| `/queue on` | Queues later input while busy | Confirmation that queue mode is enabled |
| `/queue off` | Restores steering for later busy input | Steering confirmation; the current task continues |
| `/queue remove 1` | Removes the first pending message | Removal confirmation and remaining queue |
| `/queue clear --yes` | Clears pending messages | Confirmation; completed work is not undone |

Examples are displayed, never dispatched. Leave learning mode before entering an action at the `koder ›` prompt.

Useful lessons include `/help model`, `/help effort`, `/help goal`, `/help plan`, `/help todo`, `/help prefill`, `/help skills`, `/help skill`, `/help mail`, `/help notifications`, `/help apps`, `/help mcp`, `/help permissions`, `/help error`, `/help reconcile` and `/help update`.

The slash menu, help and teaching share the session-command inventory. `/input` aliases `/queue`, `/thinking` aliases `/effort`, and the historical `/steup` spelling still aliases `/setup`. `/skill` selects skills for later tasks; `/skills` manages them. `/learn` teaches the user; `/learning` manages the Agent's local task learning.

## Developer and non-interactive use

Enter these in the system shell:

```sh
koder learn commands --print
koder learn /queue --print
koder help /harness
koder learn topics --print
koder learn search model --print
koder learn 76 --track developer --print
koder learn 4 --track hands-on --os powershell
koder learn /effort --lang en --print
```

`--print` and non-TTY paths never open a picker. `koder learn --print` still prints the full course. Specify a command or lesson to limit output. `--os` accepts `powershell`, `cmd`, `mac` or `linux`; by default Koder uses platform detection or the saved edition.

Session syntax can differ from CLI syntax: `/help harness` teaches `/harness deep-research`; `koder help harness` describes the system-shell subcommands. The guide labels the input location explicitly.

## During a task

`/learn` queues until the current task finishes. It is not sent as steering text and does not cancel the task. Read-only help such as `/help queue` remains available while busy. Existing cancellation, queue and approval behavior remains in place.

Tutorial choices, exercises and approvals accept fresh input only. Previously queued tasks stay in the queue and continue after leaving the tutorial; they cannot become menu answers.

Command lessons are local and use no paid model. Original sandbox lessons still ask before edits and commands. Reading grants no computer permissions, connects no account, sends no mail, changes no model and uploads no logs. Live-model or external-service assignments remain optional and retain their authorization and cost limits.

`/reconcile checked <call-id>` records human review; it does not prove automatic verification or replay an action. Check the actual artifact first.

Automated coverage uses isolated directories, a scripted coach and simulated terminal input. Native Windows and Ubuntu terminal appearance still require device validation. A documented command does not mean a service or account has been connected successfully.
