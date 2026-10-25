# 24. MiMo checkup: a reply is only the first step

Allow 25 minutes

**Goal**：Understand a tool round trip: request, execution, result and model continuation.

**Preparation**：When the MiMo Token Plan route is disabled, study it offline; use an available authorized provider for live checks.

## Hands-on steps

1. Inspect koder model show.

   **Check**：Use the same configuration for text and tool checks.

2. Run model test and then explicitly model test --tools on an available route.

   **Check**：Record both results and timing; tool diagnostics avoid business effects.

3. Inspect whether the failure is tool formatting, missing results, empty output or HTTP rejection.

   **Check**：MODEL_PROTOCOL does not automatically mean disconnection.

4. Use a short new-session comparison while retaining the old session; explicitly name remaining work when resuming.

   **Check**：A greeting does not replay old tasks.

## Troubleshooting and recovery

- **Text works but actions fail**：Report tool diagnostics; changing OS grants will not repair a protocol mismatch.
- **Old history is too large**：Isolate with a new session and relevant summaries/artifacts instead of wiping memory.

## Assignment and acceptance

Draw the four stages of a tool round trip and identify evidence for each.

**Acceptance**：A declaration proves visibility; a receipt records execution; continuation must use that result.

## Developer track

1. Use scripted models for tool names, arguments, call-ID pairing and redacted HTTP errors.

2. Cover empty content with tool calls, streaming fragments, missing results and duplicate IDs.

3. Without credentials mark live MiMo acceptance NOT_RUN; a compatible fixture is not a live plan test.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [MIMO.md](../MIMO.md)
- [PROVIDER-WRITING-INPUT.md](../PROVIDER-WRITING-INPUT.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 24 of 30 · MiMo checkup: a reply is only the first step ━━
Coach › MiMo Token Plan is temporarily closed for repairs; please do not keep retrying a key. The checks below apply only to available endpoints. Gray entries report that they are temporarily unavailable.
Coach › MiMo metered and Token Plan credentials are separate too. Once configured, check text, then explicitly choose a tool round trip. The commands below make real requests to your API and may cost money. This lesson displays them without running them.
    koder model show
    koder model test
    koder model test --tools
  Tip · A hello in an old session should be a hello, not a restart of a task buried in hundreds of messages. Use /new for a new topic, or name the task you want to resume. A greeting does not erase saved history.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 24 of 30 · MiMo checkup: a reply is only the first step ━━
Coach › MiMo Token Plan is temporarily closed for repairs; please do not keep retrying a key. The checks below apply only to available endpoints. Gray entries report that they are temporarily unavailable.
Coach › MiMo metered and Token Plan credentials are separate too. Once configured, check text, then explicitly choose a tool round trip. The commands below make real requests to your API and may cost money. This lesson displays them without running them.
    koder model show
    koder model test
    koder model test --tools
  Tip · A hello in an old session should be a hello, not a restart of a task buried in hundreds of messages. Use /new for a new topic, or name the task you want to resume. A greeting does not erase saved history.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 24 of 30 · MiMo checkup: a reply is only the first step ━━
Coach › MiMo Token Plan is temporarily closed for repairs; please do not keep retrying a key. The checks below apply only to available endpoints. Gray entries report that they are temporarily unavailable.
Coach › MiMo metered and Token Plan credentials are separate too. Once configured, check text, then explicitly choose a tool round trip. The commands below make real requests to your API and may cost money. This lesson displays them without running them.
    koder model show
    koder model test
    koder model test --tools
  Tip · A hello in an old session should be a hello, not a restart of a task buried in hundreds of messages. Use /new for a new topic, or name the task you want to resume. A greeting does not erase saved history.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 24 of 30 · MiMo checkup: a reply is only the first step ━━
Coach › MiMo Token Plan is temporarily closed for repairs; please do not keep retrying a key. The checks below apply only to available endpoints. Gray entries report that they are temporarily unavailable.
Coach › MiMo metered and Token Plan credentials are separate too. Once configured, check text, then explicitly choose a tool round trip. The commands below make real requests to your API and may cost money. This lesson displays them without running them.
    koder model show
    koder model test
    koder model test --tools
  Tip · A hello in an old session should be a hello, not a restart of a task buried in hundreds of messages. Use /new for a new topic, or name the task you want to resume. A greeting does not erase saved history.
```

</details>
