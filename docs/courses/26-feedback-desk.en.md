# 26. A real feedback address, without the secrets

Allow 25 minutes

**Goal**：Produce reproducible, secret-free feedback and grounded writing deliverables.

**Preparation**：Prepare a minimal reproduction and actual output. For writing, supply verified facts without implying nonexistent release changes.

## Hands-on steps

1. Run koder feedback and inspect the address and template.

   **Check**：It displays contact details without sending chats or attachments.

2. Fill version, OS/shell, steps, expected and actual results and redacted errors.

   **Check**：Another person can reproduce it; “broken” alone is insufficient.

3. Ask for feedback.md with a defined audience, verified facts and length.

   **Check**：A readable file exists and unknown causes remain unknown.

4. If sending, inspect recipient and final content using lesson 21 and approve separately.

   **Check**：Writing and sending are different actions; keeping only a draft is valid.

## Troubleshooting and recovery

- **The draft is vague**：Add audience, facts, risks and next actions, and require a written file with readback.
- **Release mail invents new features**：Read release/change/acceptance material first; disclose when describing existing features rather than release increments.

## Assignment and acceptance

Write but do not send a bug email with version in the subject, minimal steps, actual error and requested help.

**Acceptance**：Facts are traceable, no keys or full private chats are included and unrun tests are not claimed.

## Developer track

1. Measure the primary written file rather than the chat sign-off and retain its path/hash.

2. Release writing needs sources or explicit non-increment disclosure; unsupported attribution still fails.

3. Record predecessor evidence for compression and add no new facts. Quality-gate exit 3 is not an API outage.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [CONTENT-QUALITY.zh.md](../CONTENT-QUALITY.zh.md)
- [CONTENT-QUALITY.en.md](../CONTENT-QUALITY.en.md)
- [QUALITY-CHECKS.zh.md](../QUALITY-CHECKS.zh.md)
- [QUALITY-CHECKS.en.md](../QUALITY-CHECKS.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 26 of 30 · A real feedback address, without the secrets ━━
Coach › Say “I want to give feedback” or “How do I contact support?” and Koder provides an email address and blank template. It does not send the email or attach chat history, keys, or private paths.
    koder feedback
  (whispering) Complaints are welcome. Reproduction steps are even better. Please keep the keys.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 26 of 30 · A real feedback address, without the secrets ━━
Coach › Say “I want to give feedback” or “How do I contact support?” and Koder provides an email address and blank template. It does not send the email or attach chat history, keys, or private paths.
    koder feedback
  (whispering) Complaints are welcome. Reproduction steps are even better. Please keep the keys.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 26 of 30 · A real feedback address, without the secrets ━━
Coach › Say “I want to give feedback” or “How do I contact support?” and Koder provides an email address and blank template. It does not send the email or attach chat history, keys, or private paths.
    koder feedback
  (whispering) Complaints are welcome. Reproduction steps are even better. Please keep the keys.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 26 of 30 · A real feedback address, without the secrets ━━
Coach › Say “I want to give feedback” or “How do I contact support?” and Koder provides an email address and blank template. It does not send the email or attach chat history, keys, or private paths.
    koder feedback
  (whispering) Complaints are welcome. Reproduction steps are even better. Please keep the keys.
```

</details>
