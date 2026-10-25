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

## Developer track

1. Record the command, version, working directory, exit code and artifact path.

2. Run node --test in the bundled cart-lab first and observe the planted failure; then ask Koder to fix it and inspect the diff.

3. Require a failing baseline, passing checks and the resulting files. A model completion message is not evidence.

4. Keep teaching examples separate from live-account acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [INSTALLATION.md](../INSTALLATION.md)
- [START-HERE.zh.md](../START-HERE.zh.md)
- [START-HERE.en.md](../START-HERE.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 1 of 30 · Welcome to Koder boot camp ━━
Coach › Hi, I'm the Koder coach. Across 30 lessons we'll take Koder from first launch to graduation, inside a throwaway practice project.
  · The tutorial creates a practice project in your temp folder: a small cart app with a planted bug, deleted when you finish.
  · Lesson 1 detects PowerShell, CMD, macOS or Linux and writes every command for it; you can switch with a number.
Coach › The built-in coach needs no model setup or paid API calls: the one doing the work is me, the 'coach model', with a pre-written script and limited acting talent. The edits and commands are real though, through the same kernel Koder always uses.
  Tip · Controls: Enter = next; b = previous lesson; q = quit any time (progress is saved); a number = jump to that lesson.
  Tip · Copy and paste: in Windows Terminal select text, then Ctrl+C copies and Ctrl+V pastes (with nothing selected, Ctrl+C means cancel); in the classic console a right-click pastes.
  Tip · Commands hard to remember? Run koder setup (or /setup in a chat) any time and set language, model and colours with the arrow keys or the mouse.
  (whispering) Relax. There are no exams here, only Easter eggs.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 1 of 30 · Welcome to Koder boot camp ━━
Coach › Hi, I'm the Koder coach. Across 30 lessons we'll take Koder from first launch to graduation, inside a throwaway practice project.
  · The tutorial creates a practice project in your temp folder: a small cart app with a planted bug, deleted when you finish.
  · Lesson 1 detects PowerShell, CMD, macOS or Linux and writes every command for it; you can switch with a number.
Coach › The built-in coach needs no model setup or paid API calls: the one doing the work is me, the 'coach model', with a pre-written script and limited acting talent. The edits and commands are real though, through the same kernel Koder always uses.
  Tip · Controls: Enter = next; b = previous lesson; q = quit any time (progress is saved); a number = jump to that lesson.
  Tip · Copy and paste: in Windows Terminal select text, then Ctrl+C copies and Ctrl+V pastes (with nothing selected, Ctrl+C means cancel); in the classic console a right-click pastes.
  Tip · Commands hard to remember? Run koder setup (or /setup in a chat) any time and set language, model and colours with the arrow keys or the mouse.
  (whispering) Relax. There are no exams here, only Easter eggs.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 1 of 30 · Welcome to Koder boot camp ━━
Coach › Hi, I'm the Koder coach. Across 30 lessons we'll take Koder from first launch to graduation, inside a throwaway practice project.
  · The tutorial creates a practice project in your temp folder: a small cart app with a planted bug, deleted when you finish.
  · Lesson 1 detects PowerShell, CMD, macOS or Linux and writes every command for it; you can switch with a number.
Coach › The built-in coach needs no model setup or paid API calls: the one doing the work is me, the 'coach model', with a pre-written script and limited acting talent. The edits and commands are real though, through the same kernel Koder always uses.
  Tip · Controls: Enter = next; b = previous lesson; q = quit any time (progress is saved); a number = jump to that lesson.
  Tip · Copy and paste with ⌘C and ⌘V. In a terminal Ctrl+C means cancel, not copy.
  Tip · Commands hard to remember? Run koder setup (or /setup in a chat) any time and set language, model and colours with the arrow keys or the mouse.
  (whispering) Relax. There are no exams here, only Easter eggs.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 1 of 30 · Welcome to Koder boot camp ━━
Coach › Hi, I'm the Koder coach. Across 30 lessons we'll take Koder from first launch to graduation, inside a throwaway practice project.
  · The tutorial creates a practice project in your temp folder: a small cart app with a planted bug, deleted when you finish.
  · Lesson 1 detects PowerShell, CMD, macOS or Linux and writes every command for it; you can switch with a number.
Coach › The built-in coach needs no model setup or paid API calls: the one doing the work is me, the 'coach model', with a pre-written script and limited acting talent. The edits and commands are real though, through the same kernel Koder always uses.
  Tip · Controls: Enter = next; b = previous lesson; q = quit any time (progress is saved); a number = jump to that lesson.
  Tip · Copy and paste: most Linux terminals use Ctrl+Shift+C and Ctrl+Shift+V; select text and press the middle button to paste. Plain Ctrl+C means cancel.
  Tip · Commands hard to remember? Run koder setup (or /setup in a chat) any time and set language, model and colours with the arrow keys or the mouse.
  (whispering) Relax. There are no exams here, only Easter eggs.
```

</details>
