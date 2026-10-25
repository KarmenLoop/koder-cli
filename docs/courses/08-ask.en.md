# 08. Read-only questions, pipes and scripts

Allow 35 minutes

**Goal**：Write scripts with intentional stdin behavior and decide whether to continue from the exit code.

**Preparation**：Prepare a non-sensitive report.txt and configure a model before live ask calls. Use the pipeline syntax for your shell.

## Hands-on steps

1. Run koder ask "Explain this project without changing files".

   **Check**：A read-only answer returns; an explicit prompt does not wait for unrelated stdin by default.

2. Pipe report.txt to koder ask "Summarize the input" --stdin using your shell’s example below.

   **Check**：Submission waits for complete input; --stdin explicitly requests the pipe.

3. To write, use koder run "Save the summary to summary.md and read it back", reviewing the approval scope.

   **Check**：The file exists; ask is not a substitute for execution.

4. Read the exit code using your shell’s syntax; stop downstream work on nonzero and retain stderr.

   **Check**：Text on stdout does not prove success. Parse JSON output separately.

## Troubleshooting and recovery

- **Input never finishes**：Check whether the producer closes its pipe. A stdin timeout must not submit partial input as a complete task.
- **Chinese remains with --lang en**：Separate UI text from model output; state the requested language and retain invocation parameters.

## Assignment and acceptance

Ask directly and via an explicit pipe using the same report.txt; record input usage, exit code and duration.

**Acceptance**：A prompt does not consume an unrelated pipe; --stdin requires complete input and failure prevents downstream publication.

## Developer track

1. Use the bundled stdin-producer.mjs to exercise delayed EOF without paid calls.

2. For Koder acceptance use a local model fixture or an authorized test key; cover prompts, no prompts, --stdin, timeout and oversized input.

3. Check structured output as well as exit status. Preserve the detailed error code alongside usage or quality-gate failures.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [CLI-CONTRACTS.md](../CLI-CONTRACTS.md)
- [CLI-CONTRACTS.zh.md](../CLI-CONTRACTS.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 8 of 30 · Read-only questions, pipes and scripts ━━
Coach › Just want answers without anything being touched? Use ask. It can list, read and search, but cannot edit or run commands.
  · Hands-on: ask anything; the coach reads package.json with read-only tools and answers. No approvals needed, since nothing can change.
Coach › In scripts, Koder behaves like any other command-line tool:
    git diff | koder ask "summarise this change"
        piped input is attached as extra material
    Get-Content error.log | koder ask "what does this error mean"
        feed it a file (PowerShell's cat is this)
    koder run --yes --json "fix the lint errors" | ForEach-Object { ($_ | ConvertFrom-Json).type }
        --json prints one event per line; PowerShell's ConvertFrom-Json parses it
    $LASTEXITCODE
        the exit code of the last command
  Tip · Windows PowerShell 5.1 turns non-ASCII text in pipes into question marks. Run $OutputEncoding = [Text.UTF8Encoding]::new() once; PowerShell 7 doesn't have this problem.
Coach › Exit codes: 0 done; 1 cancelled or a check failed; 2 a usage or model configuration problem.
  (whispering) Exit code 2 means 'check your setup', not 'it didn't try hard enough'.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 8 of 30 · Read-only questions, pipes and scripts ━━
Coach › Just want answers without anything being touched? Use ask. It can list, read and search, but cannot edit or run commands.
  · Hands-on: ask anything; the coach reads package.json with read-only tools and answers. No approvals needed, since nothing can change.
Coach › In scripts, Koder behaves like any other command-line tool:
    git diff | koder ask "summarise this change"
        piped input is attached as extra material
    type error.log | koder ask "what does this error mean"
        feed it a file
    koder run --yes --json "fix the lint errors" > events.jsonl
        --json prints one event per line; CMD has no JSON tool, so save it for another program
    echo %ERRORLEVEL%
        the exit code of the last command
  Tip · CMD only understands double quotes: koder ask "what is this" works; single quotes become part of the question.
Coach › Exit codes: 0 done; 1 cancelled or a check failed; 2 a usage or model configuration problem.
  (whispering) Exit code 2 means 'check your setup', not 'it didn't try hard enough'.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 8 of 30 · Read-only questions, pipes and scripts ━━
Coach › Just want answers without anything being touched? Use ask. It can list, read and search, but cannot edit or run commands.
  · Hands-on: ask anything; the coach reads package.json with read-only tools and answers. No approvals needed, since nothing can change.
Coach › In scripts, Koder behaves like any other command-line tool:
    git diff | koder ask "summarise this change"
        piped input is attached as extra material
    cat error.log | koder ask "what does this error mean"
        feed it a file
    koder run --yes --json "fix the lint errors" | jq -r .type
        --json prints one event per line for jq (brew install jq)
    echo $?
        the exit code of the last command
Coach › Exit codes: 0 done; 1 cancelled or a check failed; 2 a usage or model configuration problem.
  (whispering) Exit code 2 means 'check your setup', not 'it didn't try hard enough'.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 8 of 30 · Read-only questions, pipes and scripts ━━
Coach › Just want answers without anything being touched? Use ask. It can list, read and search, but cannot edit or run commands.
  · Hands-on: ask anything; the coach reads package.json with read-only tools and answers. No approvals needed, since nothing can change.
Coach › In scripts, Koder behaves like any other command-line tool:
    git diff | koder ask "summarise this change"
        piped input is attached as extra material
    cat error.log | koder ask "what does this error mean"
        feed it a file
    koder run --yes --json "fix the lint errors" | jq -r .type
        --json prints one event per line for jq (sudo apt install jq)
    echo $?
        the exit code of the last command
Coach › Exit codes: 0 done; 1 cancelled or a check failed; 2 a usage or model configuration problem.
  (whispering) Exit code 2 means 'check your setup', not 'it didn't try hard enough'.
```

</details>
