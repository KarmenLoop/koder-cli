# 10. Fix until green: fix --check

Allow 40 minutes

**Goal**：Drive a fix with a reproducible failing check and preserve evidence instead of weakening tests.

**Preparation**：Copy cart-lab into a separate project. Its examples require Node; use the built-in coach if Node is unavailable.

## Hands-on steps

1. Run node --test and record the failing case and expected/actual values.

   **Check**：Keep the baseline log; the test should demonstrate the total-price bug.

2. Run koder fix "Fix cart totals without removing existing tests" --check "node --test".

   **Check**：The check/fix loop is visible and edits remain reviewable.

3. Check price × quantity behavior and add empty, zero-quantity and multi-item cases.

   **Check**：Tests cover the requirement rather than hard-coding one result of 750.

4. Run the check independently and verify README instructions.

   **Check**：Completion requires a passing check; budget exhaustion reports blockers and existing artifacts.

## Troubleshooting and recovery

- **An unhelpful fix error**：Provide a task and --check command, then run the check alone to confirm it exists.
- **Dependency failure leads to repeated code edits**：Separate setup failures from product failures; do not hide missing dependencies in tests.

## Assignment and acceptance

Keep a failure, a fix and an independent rerun; explain root cause, change and validation in three sentences.

**Acceptance**：The bug omitted quantity. Fix the implementation, not the expectation; original and new edge tests pass.

## Developer track

1. For performance work, fix the input and measurement conditions; for refactors, preserve behavior rather than changing the test data.

2. Save runnable files, tests and next steps during long tasks.

3. Record actual attempts and duration. Targeted checks do not prove a full-suite pass.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [COMMAND-DURATION.md](../COMMAND-DURATION.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 10 of 30 · Fix until green: fix --check ━━
Coach › fix is a loop: run the check, hand failures to Koder, re-run, until it passes or attempts run out (3 by default).
  Tip · This time I'll press y for you; just watch it go round by round.
  · Demo: a check.mjs tests a count function; Koder gets it wrong once and right the second time, showing 'attempt 1/3' and finally 'Check passed'.
  (whispering) It missed the first time. Don't laugh; have you ever got it right first time?
    koder fix --check "npm test"
        fix until the tests pass
    koder fix "the home button does nothing"
        no check command: fix once from the description
    npm test 2>&1 | koder fix
        feed the failure straight in
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 10 of 30 · Fix until green: fix --check ━━
Coach › fix is a loop: run the check, hand failures to Koder, re-run, until it passes or attempts run out (3 by default).
  Tip · This time I'll press y for you; just watch it go round by round.
  · Demo: a check.mjs tests a count function; Koder gets it wrong once and right the second time, showing 'attempt 1/3' and finally 'Check passed'.
  (whispering) It missed the first time. Don't laugh; have you ever got it right first time?
    koder fix --check "npm test"
        fix until the tests pass
    koder fix "the home button does nothing"
        no check command: fix once from the description
    npm test 2>&1 | koder fix
        feed the failure straight in
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 10 of 30 · Fix until green: fix --check ━━
Coach › fix is a loop: run the check, hand failures to Koder, re-run, until it passes or attempts run out (3 by default).
  Tip · This time I'll press y for you; just watch it go round by round.
  · Demo: a check.mjs tests a count function; Koder gets it wrong once and right the second time, showing 'attempt 1/3' and finally 'Check passed'.
  (whispering) It missed the first time. Don't laugh; have you ever got it right first time?
    koder fix --check "npm test"
        fix until the tests pass
    koder fix "the home button does nothing"
        no check command: fix once from the description
    npm test 2>&1 | koder fix
        feed the failure straight in
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 10 of 30 · Fix until green: fix --check ━━
Coach › fix is a loop: run the check, hand failures to Koder, re-run, until it passes or attempts run out (3 by default).
  Tip · This time I'll press y for you; just watch it go round by round.
  · Demo: a check.mjs tests a count function; Koder gets it wrong once and right the second time, showing 'attempt 1/3' and finally 'Check passed'.
  (whispering) It missed the first time. Don't laugh; have you ever got it right first time?
    koder fix --check "npm test"
        fix until the tests pass
    koder fix "the home button does nothing"
        no check command: fix once from the description
    npm test 2>&1 | koder fix
        feed the failure straight in
```

</details>
