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

## Developer track

1. Canonical workspace identity participates in isolation; handle aliases, symlinks and concurrent sessions consistently.

2. Test two projects, named sessions and recovery without erasing old records.

3. Deliver a file index and entry points for future readback.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 15 of 30 · Scan your projects, decide what's next ━━
Coach › koder scan gathers recent projects and tasks from Koder, Codex, Claude Code and Cursor. It reads only folders, times and titles; this listing step does not request a model. Choosing a subsequent model task includes relevant project and task material in your configured model request.
Coach › Once the list appears, choose like this:
    the number in front of a project
        selects it; Enter skips
    1  review the changes
        same as koder review
    2  run checks and fix
        guesses a check such as npm test; Enter accepts it
    3  ask Koder what's most worth doing now
        your recent tasks from other tools are included
    4  type your own task
  · You can run a scan on the spot; it only lists projects.
  (whispering) Found a dozen projects on the go? Totally normal. We're all like that.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 15 of 30 · Scan your projects, decide what's next ━━
Coach › koder scan gathers recent projects and tasks from Koder, Codex, Claude Code and Cursor. It reads only folders, times and titles; this listing step does not request a model. Choosing a subsequent model task includes relevant project and task material in your configured model request.
Coach › Once the list appears, choose like this:
    the number in front of a project
        selects it; Enter skips
    1  review the changes
        same as koder review
    2  run checks and fix
        guesses a check such as npm test; Enter accepts it
    3  ask Koder what's most worth doing now
        your recent tasks from other tools are included
    4  type your own task
  · You can run a scan on the spot; it only lists projects.
  (whispering) Found a dozen projects on the go? Totally normal. We're all like that.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 15 of 30 · Scan your projects, decide what's next ━━
Coach › koder scan gathers recent projects and tasks from Koder, Codex, Claude Code and Cursor. It reads only folders, times and titles; this listing step does not request a model. Choosing a subsequent model task includes relevant project and task material in your configured model request.
Coach › Once the list appears, choose like this:
    the number in front of a project
        selects it; Enter skips
    1  review the changes
        same as koder review
    2  run checks and fix
        guesses a check such as npm test; Enter accepts it
    3  ask Koder what's most worth doing now
        your recent tasks from other tools are included
    4  type your own task
  · You can run a scan on the spot; it only lists projects.
  (whispering) Found a dozen projects on the go? Totally normal. We're all like that.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 15 of 30 · Scan your projects, decide what's next ━━
Coach › koder scan gathers recent projects and tasks from Koder, Codex, Claude Code and Cursor. It reads only folders, times and titles; this listing step does not request a model. Choosing a subsequent model task includes relevant project and task material in your configured model request.
Coach › Once the list appears, choose like this:
    the number in front of a project
        selects it; Enter skips
    1  review the changes
        same as koder review
    2  run checks and fix
        guesses a check such as npm test; Enter accepts it
    3  ask Koder what's most worth doing now
        your recent tasks from other tools are included
    4  type your own task
  · You can run a scan on the spot; it only lists projects.
  (whispering) Found a dozen projects on the go? Totally normal. We're all like that.
```

</details>
