# 11. Flows and CI: agents in formation

Allow 45 minutes

**Goal**：Split repeated work into checked steps and prevent publication after a failed prerequisite.

**Preparation**：Complete lessons 8–10. Read the bundled flow-lab.json and use it with cart-lab. This example only runs local checks: no publication or model calls.

## Hands-on steps

1. Read flow-lab.json and identify step IDs, types, commands and dependencies.

   **Check**：Each step has one clear responsibility and uses project checks.

2. Run koder flow run flow-lab.json in the example directory.

   **Check**：The planted cart bug fails a check. Save step states; skipped does not mean passed.

3. Fix the cart with lesson 10 and rerun the same flow.

   **Check**：Checks pass with the same inputs and workflow; the change is explainable.

4. For CI, read koder help ci, generate configuration in a test repository and review it.

   **Check**：Check permissions, branches and secret references. Generated YAML is not a completed CI run.

## Troubleshooting and recovery

- **Parallel steps overwrite files**：Parallelize only independent steps. A shell command is not inherently read-only.
- **A failed workflow says it finished**：Read step states and the final exit code; finished only means execution ended.

## Assignment and acceptance

Draw a check-to-summary dependency graph and inject a failure that prevents the success branch from running.

**Acceptance**：The dependency graph matches logs; failures, skips and passes are distinct, and nothing was published.

## Developer track

1. Define each artifact’s path, format, producer and consumer. Check a step succeeded before using {{step.output}}.

2. Use minimal CI permissions and protected secrets; repository or PR text is not authority.

3. Record cancellation, timeout and failure separately, and avoid replaying external effects on recovery.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [COMMAND-REFERENCE.en.md](../COMMAND-REFERENCE.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 11 of 30 · Flows and CI: agents in formation ━━
Coach › Put review, tests and fixes into one flow file and run the same thing locally and in CI. Here's a small one; let's run it:
  · Demo: a four-step flow: tests, a check, an ask step summarising them with {{step.output}}, and a celebration that runs only when the check passed.
    type
        shell, run, ask, review, fix or test
    when
        unit.failed, count.passed, always, failure
    {{step.output}}
        reuse an earlier step's output
    parallel
        run independent steps side by side (shell, ask, review); shell is not inherently read-only
    approve: auto
        auto-approve, for CI
  Tip · On Windows, shell steps run through CMD (not PowerShell); wrap PowerShell syntax as powershell -NoProfile -Command "…". For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above.
Coach › koder ci init writes a GitHub Actions workflow: every PR gets reviewed and commented on; comment /koder fix and it fixes and pushes back. Only repository members count; strangers can shout all they like.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 11 of 30 · Flows and CI: agents in formation ━━
Coach › Put review, tests and fixes into one flow file and run the same thing locally and in CI. Here's a small one; let's run it:
  · Demo: a four-step flow: tests, a check, an ask step summarising them with {{step.output}}, and a celebration that runs only when the check passed.
    type
        shell, run, ask, review, fix or test
    when
        unit.failed, count.passed, always, failure
    {{step.output}}
        reuse an earlier step's output
    parallel
        run independent steps side by side (shell, ask, review); shell is not inherently read-only
    approve: auto
        auto-approve, for CI
  Tip · On Windows, shell steps run through CMD (not PowerShell); wrap PowerShell syntax as powershell -NoProfile -Command "…". For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above.
Coach › koder ci init writes a GitHub Actions workflow: every PR gets reviewed and commented on; comment /koder fix and it fixes and pushes back. Only repository members count; strangers can shout all they like.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 11 of 30 · Flows and CI: agents in formation ━━
Coach › Put review, tests and fixes into one flow file and run the same thing locally and in CI. Here's a small one; let's run it:
  · Demo: a four-step flow: tests, a check, an ask step summarising them with {{step.output}}, and a celebration that runs only when the check passed.
    type
        shell, run, ask, review, fix or test
    when
        unit.failed, count.passed, always, failure
    {{step.output}}
        reuse an earlier step's output
    parallel
        run independent steps side by side (shell, ask, review); shell is not inherently read-only
    approve: auto
        auto-approve, for CI
  Tip · Shell steps run through sh here; on Windows the same flow goes through CMD. For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above.
Coach › koder ci init writes a GitHub Actions workflow: every PR gets reviewed and commented on; comment /koder fix and it fixes and pushes back. Only repository members count; strangers can shout all they like.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 11 of 30 · Flows and CI: agents in formation ━━
Coach › Put review, tests and fixes into one flow file and run the same thing locally and in CI. Here's a small one; let's run it:
  · Demo: a four-step flow: tests, a check, an ask step summarising them with {{step.output}}, and a celebration that runs only when the check passed.
    type
        shell, run, ask, review, fix or test
    when
        unit.failed, count.passed, always, failure
    {{step.output}}
        reuse an earlier step's output
    parallel
        run independent steps side by side (shell, ask, review); shell is not inherently read-only
    approve: auto
        auto-approve, for CI
  Tip · Shell steps run through sh here; on Windows the same flow goes through CMD. For a flow that runs anywhere, stick to node, npm and git, like the node -e celebration above.
Coach › koder ci init writes a GitHub Actions workflow: every PR gets reviewed and commented on; comment /koder fix and it fixes and pushes back. Only repository members count; strangers can shout all they like.
```

</details>
