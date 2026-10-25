# 20. Learning, soul, reflection and proactive service

Allow 45 minutes

**Goal**：Configure learning, task harnesses, residency and mail alerts separately and verify when each actually runs.

**Preparation**：Start with minimal visibility. Residency is explicit; installation does not grant mail, calendar or browser-history access.

## Hands-on steps

1. Run koder growth status and koder harness status and inspect Skill settings in Setup.

   **Check**：An available method Skill does not prove a running daemon; toggles affect applicable future tasks.

2. Review app-use learning in Setup: connected Apps/MCP first, then browser and desktop, with official help for unfamiliar flows.

   **Check**：Missing grants are reported; learned steps cite sources and do not invent actions.

3. If you need alerts after closing the terminal, explicitly run koder activate, then koder status.

   **Check**：Only running establishes a live host; quiet hours, limits and source settings still apply.

4. Bind mail in Setup, separately enable koder mail monitor on and inspect monitor status.

   **Check**：Binding, monitoring, model access and autonomous replies are separate; polling is not instant delivery.

## Troubleshooting and recovery

- **No background alert**：Check host, visibility, quiet hours, budget and network; sleep can delay checks.
- **Stop alerts but retain the mailbox**：Use mail monitor off for mail checks; deactivate stops residency without disconnecting mail.

## Assignment and acceptance

Map binding, monitoring, reading, drafting and sending, including each input and approval; enable only needed stages.

**Acceptance**：Alerts need not expose full mail to a model; drafting is not sending, and SMTP acceptance is not proof the recipient read it.

## Developer track

1. JIT chooses serializable seeds and uses existing provider, budget, permission and cancellation paths.

2. Experiences need cues, lessons, evidence and outcomes; self-evaluation alone proves nothing.

3. Test notify/silence, quiet hours, deduplication, unknown receipts and revocation.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [ALWAYS-ON.zh.md](../ALWAYS-ON.zh.md)
- [ALWAYS-ON.en.md](../ALWAYS-ON.en.md)
- [HARNESS-JIT.md](../HARNESS-JIT.md)
- [APP-USE-AND-LEARN.zh.md](../APP-USE-AND-LEARN.zh.md)
- [MAIL-DELIVERY.zh.md](../MAIL-DELIVERY.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 20 of 30 · Learning, soul, reflection and proactive service ━━
Coach › All four switches default off and remain independent. Open koder setup → Memory and soul and read each description before choosing. Command-line prompts also explain purpose and cost; type ENABLE to turn on or DISABLE to turn off.
Coach › The bundled personal-agent-growth 0.3.2 method helps relevant tasks prepare, investigate failures and review results. Use koder growth status, show, off or on; changes apply to the next session. Think of it as a task notebook: it does not start a background class, enable profile learning or turn on sync.
Coach › Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
Coach › Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
Coach › Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
Coach › Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
    koder memory learning status
    koder memory daily-state status
    koder memory evolution status
    koder memory proactive status
    koder memory profile show
    koder memory soul show
    koder memory reflection run
  Tip · reflection run attempts to use authorized conversations and your configured model and may incur charges. It needs a valid account, compatible Core host and relevant opt-ins. The default is at most four model calls per day. waiting-account-host means a prerequisite is missing, not a completed summary. Proactive service needs a running host and defaults to quiet hours 22:00–08:00; closing the terminal or computer does not keep it running.
Coach › Review, correct and delete learned records. A daily mood or temporary request is not a permanent identity; skill-improvement candidates still need approval. Soul settings control name, tone and style with versioned save and rollback, without adding tool authority. Disabling learning retains prior records; delete with profile forget <recordID> or memory forget.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 20 of 30 · Learning, soul, reflection and proactive service ━━
Coach › All four switches default off and remain independent. Open koder setup → Memory and soul and read each description before choosing. Command-line prompts also explain purpose and cost; type ENABLE to turn on or DISABLE to turn off.
Coach › The bundled personal-agent-growth 0.3.2 method helps relevant tasks prepare, investigate failures and review results. Use koder growth status, show, off or on; changes apply to the next session. Think of it as a task notebook: it does not start a background class, enable profile learning or turn on sync.
Coach › Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
Coach › Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
Coach › Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
Coach › Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
    koder memory learning status
    koder memory daily-state status
    koder memory evolution status
    koder memory proactive status
    koder memory profile show
    koder memory soul show
    koder memory reflection run
  Tip · reflection run attempts to use authorized conversations and your configured model and may incur charges. It needs a valid account, compatible Core host and relevant opt-ins. The default is at most four model calls per day. waiting-account-host means a prerequisite is missing, not a completed summary. Proactive service needs a running host and defaults to quiet hours 22:00–08:00; closing the terminal or computer does not keep it running.
Coach › Review, correct and delete learned records. A daily mood or temporary request is not a permanent identity; skill-improvement candidates still need approval. Soul settings control name, tone and style with versioned save and rollback, without adding tool authority. Disabling learning retains prior records; delete with profile forget <recordID> or memory forget.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 20 of 30 · Learning, soul, reflection and proactive service ━━
Coach › All four switches default off and remain independent. Open koder setup → Memory and soul and read each description before choosing. Command-line prompts also explain purpose and cost; type ENABLE to turn on or DISABLE to turn off.
Coach › The bundled personal-agent-growth 0.3.2 method helps relevant tasks prepare, investigate failures and review results. Use koder growth status, show, off or on; changes apply to the next session. Think of it as a task notebook: it does not start a background class, enable profile learning or turn on sync.
Coach › Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
Coach › Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
Coach › Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
Coach › Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
    koder memory learning status
    koder memory daily-state status
    koder memory evolution status
    koder memory proactive status
    koder memory profile show
    koder memory soul show
    koder memory reflection run
  Tip · reflection run attempts to use authorized conversations and your configured model and may incur charges. It needs a valid account, compatible Core host and relevant opt-ins. The default is at most four model calls per day. waiting-account-host means a prerequisite is missing, not a completed summary. Proactive service needs a running host and defaults to quiet hours 22:00–08:00; closing the terminal or computer does not keep it running.
Coach › Review, correct and delete learned records. A daily mood or temporary request is not a permanent identity; skill-improvement candidates still need approval. Soul settings control name, tone and style with versioned save and rollback, without adding tool authority. Disabling learning retains prior records; delete with profile forget <recordID> or memory forget.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 20 of 30 · Learning, soul, reflection and proactive service ━━
Coach › All four switches default off and remain independent. Open koder setup → Memory and soul and read each description before choosing. Command-line prompts also explain purpose and cost; type ENABLE to turn on or DISABLE to turn off.
Coach › The bundled personal-agent-growth 0.3.2 method helps relevant tasks prepare, investigate failures and review results. Use koder growth status, show, off or on; changes apply to the next session. Think of it as a task notebook: it does not start a background class, enable profile learning or turn on sync.
Coach › Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
Coach › Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
Coach › Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
Coach › Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
    koder memory learning status
    koder memory daily-state status
    koder memory evolution status
    koder memory proactive status
    koder memory profile show
    koder memory soul show
    koder memory reflection run
  Tip · reflection run attempts to use authorized conversations and your configured model and may incur charges. It needs a valid account, compatible Core host and relevant opt-ins. The default is at most four model calls per day. waiting-account-host means a prerequisite is missing, not a completed summary. Proactive service needs a running host and defaults to quiet hours 22:00–08:00; closing the terminal or computer does not keep it running.
Coach › Review, correct and delete learned records. A daily mood or temporary request is not a permanent identity; skill-improvement candidates still need approval. Soul settings control name, tone and style with versioned save and rollback, without adding tool authority. Disabling learning retains prior records; delete with profile forget <recordID> or memory forget.
```

</details>
