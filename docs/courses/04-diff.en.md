# 04. First task: read the diff, decide

Allow 30 minutes

**Goal**：Turn a vague request into a verifiable deliverable; inspect the diff and check the disk after rejecting or approving it.

**Preparation**：Use the coach cart or bundled cart-lab, not a critical project. Record existing changes before working in your own repository.

## Hands-on steps

1. Ask: “Fix cart totals so quantity is counted; preserve other behavior, test an empty cart and run node --test.”

   **Check**：The request specifies scope, constraints and a check, rather than only “improve it”.

2. Inspect the proposed files and diff; reject the first edit.

   **Check**：The file remains unchanged. Verify it rather than relying only on the reply.

3. Retry and approve only the target function and relevant tests.

   **Check**：Changes stay in the project and do not add unrelated formatting or dependencies.

4. Open the files, run the check and request a list of changes, validation and remaining work.

   **Check**：Files, test output and the report agree. Preserve output if the check fails.

## Troubleshooting and recovery

- **Only advice, no files**：Use an execution task with file targets and checks; confirm you are not in ask or plan mode.
- **Execution result is unknown**：Inspect files and receipts before asking for a full replay.

## Assignment and acceptance

Add a zero-quantity case to cart-lab, fix the implementation and retain before/after test results and the diff.

**Acceptance**：An empty cart is 0; 200 cents ×3 plus 150 cents ×1 is 750; zero quantity contributes 0. Keep existing tests.

## Developer track

1. Translate the requirement into inputs, outputs, edge cases and invariants. Write tests that catch the actual bug.

2. Use git diff --check and inspect the diff; passing tests do not justify deleted assertions.

3. Record workspace, files, checks and exit codes. A final reply is not a file deliverable.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 4 of 30 · First task: read the diff, decide ━━
Coach › cart.mjs forgets to multiply by quantity, so the test keeps failing. Let's have Koder fix it.
Coach › In the default interactive mode Koder shows the diff before editing: red lines starting with - go away, green lines starting with + come in. In this lesson it writes only after y; other answers cancel. --yes auto-approves ordinary edits.
  (whispering) Reading a diff is like reading a check-up report: green is new muscle, red is trimmed fat. Make sure nothing vital got cut before you sign.
  Tip · When Koder asks 'Accept this edit?', try typing n first to enjoy changing your mind; it will propose again, and then type y.
  · Hands-on: type a task, the coach proposes an edit; reject once with n, accept with y, then see the file change.
Coach › Practice asks at each step so you can see the controls. Normal use defaults to smart approval: low-risk commands and ordinary project edits run automatically. Sensitive prompts offer Always allow. Use /permissions execution status to inspect, ask for ask mode, or reset to revoke all settings.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 4 of 30 · First task: read the diff, decide ━━
Coach › cart.mjs forgets to multiply by quantity, so the test keeps failing. Let's have Koder fix it.
Coach › In the default interactive mode Koder shows the diff before editing: red lines starting with - go away, green lines starting with + come in. In this lesson it writes only after y; other answers cancel. --yes auto-approves ordinary edits.
  (whispering) Reading a diff is like reading a check-up report: green is new muscle, red is trimmed fat. Make sure nothing vital got cut before you sign.
  Tip · When Koder asks 'Accept this edit?', try typing n first to enjoy changing your mind; it will propose again, and then type y.
  · Hands-on: type a task, the coach proposes an edit; reject once with n, accept with y, then see the file change.
Coach › Practice asks at each step so you can see the controls. Normal use defaults to smart approval: low-risk commands and ordinary project edits run automatically. Sensitive prompts offer Always allow. Use /permissions execution status to inspect, ask for ask mode, or reset to revoke all settings.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 4 of 30 · First task: read the diff, decide ━━
Coach › cart.mjs forgets to multiply by quantity, so the test keeps failing. Let's have Koder fix it.
Coach › In the default interactive mode Koder shows the diff before editing: red lines starting with - go away, green lines starting with + come in. In this lesson it writes only after y; other answers cancel. --yes auto-approves ordinary edits.
  (whispering) Reading a diff is like reading a check-up report: green is new muscle, red is trimmed fat. Make sure nothing vital got cut before you sign.
  Tip · When Koder asks 'Accept this edit?', try typing n first to enjoy changing your mind; it will propose again, and then type y.
  · Hands-on: type a task, the coach proposes an edit; reject once with n, accept with y, then see the file change.
Coach › Practice asks at each step so you can see the controls. Normal use defaults to smart approval: low-risk commands and ordinary project edits run automatically. Sensitive prompts offer Always allow. Use /permissions execution status to inspect, ask for ask mode, or reset to revoke all settings.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 4 of 30 · First task: read the diff, decide ━━
Coach › cart.mjs forgets to multiply by quantity, so the test keeps failing. Let's have Koder fix it.
Coach › In the default interactive mode Koder shows the diff before editing: red lines starting with - go away, green lines starting with + come in. In this lesson it writes only after y; other answers cancel. --yes auto-approves ordinary edits.
  (whispering) Reading a diff is like reading a check-up report: green is new muscle, red is trimmed fat. Make sure nothing vital got cut before you sign.
  Tip · When Koder asks 'Accept this edit?', try typing n first to enjoy changing your mind; it will propose again, and then type y.
  · Hands-on: type a task, the coach proposes an edit; reject once with n, accept with y, then see the file change.
Coach › Practice asks at each step so you can see the controls. Normal use defaults to smart approval: low-risk commands and ordinary project edits run automatically. Sensitive prompts offer Always allow. Use /permissions execution status to inspect, ask for ask mode, or reset to revoke all settings.
```

</details>
