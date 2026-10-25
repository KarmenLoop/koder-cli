# 09. Code review with context

Allow 35 minutes

**Goal**：Get actionable review findings and prevent an unparsed JSON review from passing a CI gate.

**Preparation**：Prepare a small, explainable change in a test repository; define the scope when there is no repository or diff.

## Hands-on steps

1. Inspect git diff, then run koder review.

   **Check**：Findings refer to the actual diff and explain location, trigger, impact and a remedy.

2. Reproduce a finding before requesting the smallest fix.

   **Check**：Do not rewrite everything based on a suggestion; mark unconfirmed findings for investigation.

3. For automation run koder review --format json and capture stdout, stderr and exit code.

   **Check**：Check parseability, parsed status and exit code; an empty-repository error must not pass.

4. After the fix, rerun the original tests and review the relevant diff.

   **Check**：Closure has evidence; remaining findings have reasons. Review does not deploy anything.

## Troubleshooting and recovery

- **REVIEW_UNPARSED**：Retain the output and fail the gate; never insert parsed=true manually.
- **Advice refers to different files**：Check branch, workspace and uncommitted changes, then narrow the scope.

## Assignment and acceptance

Review the cart fix and report a substantiated finding or no demonstrated issue, with test evidence.

**Acceptance**：Do not invent a quota of findings. Real issues must be locatable and reproducible; parse or model failures cannot become approvals.

## Developer track

1. Treat review as a data interface: validate JSON shape, status and parsed rather than searching for “pass”.

2. Cover prose, empty output, partial JSON and provider errors; keep unparsed output nonzero.

3. Use constrained workspaces and read-only tokens; commenting and pushing are separately authorized actions.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)
- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 9 of 30 · Code review with context ━━
Coach › review looks beyond the diff: it reads rule files such as AGENTS.md, recent commits and where changed functions are called, then lets the model verify with read-only tools.
  · Demo: the coach adds a discount function that yields fractional cents, then runs the real review pipeline, printing severity, file, line and a suggestion.
Coach › Each finding has a severity (high, medium, low), file, line and suggestion. Common forms:
    koder review
        review uncommitted changes, else the current branch
    koder review --base main
        compare with main
    koder review --format markdown --out review.md
        a comment ready for the PR
    koder review --fail-on high
        exit 1 on high findings, for CI
    koder review --fix --check "npm test"
        review, fix and test in one go
  · You can let Koder apply the fix, again with a diff and a y.
  (whispering) Being caught by Koder is fine. Being caught by your users in production is not.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 9 of 30 · Code review with context ━━
Coach › review looks beyond the diff: it reads rule files such as AGENTS.md, recent commits and where changed functions are called, then lets the model verify with read-only tools.
  · Demo: the coach adds a discount function that yields fractional cents, then runs the real review pipeline, printing severity, file, line and a suggestion.
Coach › Each finding has a severity (high, medium, low), file, line and suggestion. Common forms:
    koder review
        review uncommitted changes, else the current branch
    koder review --base main
        compare with main
    koder review --format markdown --out review.md
        a comment ready for the PR
    koder review --fail-on high
        exit 1 on high findings, for CI
    koder review --fix --check "npm test"
        review, fix and test in one go
  · You can let Koder apply the fix, again with a diff and a y.
  (whispering) Being caught by Koder is fine. Being caught by your users in production is not.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 9 of 30 · Code review with context ━━
Coach › review looks beyond the diff: it reads rule files such as AGENTS.md, recent commits and where changed functions are called, then lets the model verify with read-only tools.
  · Demo: the coach adds a discount function that yields fractional cents, then runs the real review pipeline, printing severity, file, line and a suggestion.
Coach › Each finding has a severity (high, medium, low), file, line and suggestion. Common forms:
    koder review
        review uncommitted changes, else the current branch
    koder review --base main
        compare with main
    koder review --format markdown --out review.md
        a comment ready for the PR
    koder review --fail-on high
        exit 1 on high findings, for CI
    koder review --fix --check "npm test"
        review, fix and test in one go
  · You can let Koder apply the fix, again with a diff and a y.
  (whispering) Being caught by Koder is fine. Being caught by your users in production is not.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 9 of 30 · Code review with context ━━
Coach › review looks beyond the diff: it reads rule files such as AGENTS.md, recent commits and where changed functions are called, then lets the model verify with read-only tools.
  · Demo: the coach adds a discount function that yields fractional cents, then runs the real review pipeline, printing severity, file, line and a suggestion.
Coach › Each finding has a severity (high, medium, low), file, line and suggestion. Common forms:
    koder review
        review uncommitted changes, else the current branch
    koder review --base main
        compare with main
    koder review --format markdown --out review.md
        a comment ready for the PR
    koder review --fail-on high
        exit 1 on high findings, for CI
    koder review --fix --check "npm test"
        review, fix and test in one go
  · You can let Koder apply the fix, again with a diff and a y.
  (whispering) Being caught by Koder is fine. Being caught by your users in production is not.
```

</details>
