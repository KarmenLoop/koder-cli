# 05. Command approval: run tests, stop shady ones

Allow 25 minutes

**Goal**：Distinguish ordinary checks, sensitive actions and OS permissions; reject unsafe commands and handle long tasks.

**Preparation**：Use a disposable directory. Read the working path, destination and files, not just the command name.

## Hands-on steps

1. Ask Koder to run tests and read the entire proposed command.

   **Check**：Identify the operation, working directory, writes and network access.

2. Approve the test, but reject an unknown downloaded script executed immediately.

   **Check**：Rejection is a valid outcome; files and permissions remain intact.

3. Inspect approval policy in Setup and run koder permissions status.

   **Check**：Full approval and OS grants are separate; --yes does not grant computer access or approve mail/GitHub writes.

4. For a long task, check its deadline; after timeout inspect process, logs and artifacts before continuing or canceling.

   **Check**：Timeout does not imply rollback, and “started” does not prove installation finished.

## Troubleshooting and recovery

- **EXECUTION_PERMISSIONS_INVALID**：Inspect Koder permissions and workspace state; do not globally relax PowerShell policy.
- **The approval prompt cannot accept input**：Record version and terminal type; cancel and retry interactively rather than bypassing approval.

## Assignment and acceptance

Classify reading README, deleting a directory and sending mail; identify target, grants, confirmation and evidence.

**Acceptance**：Reading grants no deletion authority. Deletion needs a defined target and authorization; mail needs final-content approval and a receipt.

## Developer track

1. Test allow, deny and cancel using synthetic local files; denied or canceled writes must not execute.

2. Separate tool deadlines, task budgets and provider diagnostics rather than extending everything indefinitely.

3. Preserve UNKNOWN results and reconcile before retrying. Shell text alone cannot establish an external receipt.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [COMMAND-DURATION.md](../COMMAND-DURATION.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [AUTO-UPDATE.zh.md](../AUTO-UPDATE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 5 of 30 · Command approval: run tests, stop shady ones ━━
Coach › After editing you'll want to run the tests. Running project code asks by default; low-risk checks such as node --version run automatically.
  Tip · Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. Remove-Item -Recurse -Force, rd /s /q, del /s /q, irm … | iex, git push --force: verify the source and exact effects before allowing them. Reject unknown scripts. Check official installers, licenses and verification information too.
  Tip · On Windows, commands Koder runs for you go through CMD, not PowerShell. For PowerShell syntax, wrap it as powershell -NoProfile -Command "…".
  (whispering) Approve commands with the same care you give a food-delivery bill.
  · Hands-on: the coach asks to run node test.mjs (allow it), then an irm … | iex (reject it; even if you slip, the coach blocks it).
Coach › Command output goes back to the model as is, so it sees the test results and decides what to do next.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 5 of 30 · Command approval: run tests, stop shady ones ━━
Coach › After editing you'll want to run the tests. Running project code asks by default; low-risk checks such as node --version run automatically.
  Tip · Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. Remove-Item -Recurse -Force, rd /s /q, del /s /q, irm … | iex, git push --force: verify the source and exact effects before allowing them. Reject unknown scripts. Check official installers, licenses and verification information too.
  Tip · On Windows, commands Koder runs for you go through CMD, not PowerShell. For PowerShell syntax, wrap it as powershell -NoProfile -Command "…".
  (whispering) Approve commands with the same care you give a food-delivery bill.
  · Hands-on: the coach asks to run node test.mjs (allow it), then an irm … | iex (reject it; even if you slip, the coach blocks it).
Coach › Command output goes back to the model as is, so it sees the test results and decides what to do next.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 5 of 30 · Command approval: run tests, stop shady ones ━━
Coach › After editing you'll want to run the tests. Running project code asks by default; low-risk checks such as node --version run automatically.
  Tip · Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. rm -rf, curl … | sh, git push --force: verify the source and exact effects before allowing them. Reject unknown scripts. Check official installers, licenses and verification information too.
  (whispering) Approve commands with the same care you give a food-delivery bill.
  · Hands-on: the coach asks to run node test.mjs (allow it), then a curl … | sh (reject it; even if you slip, the coach blocks it).
Coach › Command output goes back to the model as is, so it sees the test results and decides what to do next.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 5 of 30 · Command approval: run tests, stop shady ones ━━
Coach › After editing you'll want to run the tests. Running project code asks by default; low-risk checks such as node --version run automatically.
  Tip · Rule of thumb: allow it if you understand it, it stays inside the project and it can be undone. rm -rf, curl … | sh, git push --force: verify the source and exact effects before allowing them. Reject unknown scripts. Check official installers, licenses and verification information too.
  (whispering) Approve commands with the same care you give a food-delivery bill.
  · Hands-on: the coach asks to run node test.mjs (allow it), then a curl … | sh (reject it; even if you slip, the coach blocks it).
Coach › Command output goes back to the model as is, so it sees the test results and decides what to do next.
```

</details>
