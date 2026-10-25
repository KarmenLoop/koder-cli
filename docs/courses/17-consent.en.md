# 17. License and optional consent

Allow 20 minutes

**Goal**：Distinguish license acceptance, feature settings and action grants, and enable only what you need.

**Preparation**：Read bundled license, privacy and commercial-use information; use the documented contact for organizational licensing questions.

## Hands-on steps

1. Run koder privacy statement and read the full terms and license files.

   **Check**：Local documents remain readable offline.

2. Inspect learning, sync, computer, mail and residency settings separately.

   **Check**：Each has its own purpose, data scope and off switch.

3. Enable only the needed feature and inspect its status.

   **Check**：License acceptance does not enable unrelated capabilities; full approval does not expand grants.

4. Disable the optional feature and check again.

   **Check**：Disabling stops future use; deleting retained data is a separate action.

## Troubleshooting and recovery

- **Assuming accept grants everything**：Inspect feature states; license acceptance has no such meaning.
- **Old memories remain after disabling learning**：Retention is expected; remove specific records if desired instead of erasing everything.

## Assignment and acceptance

List the separate decisions for license acceptance, model access to mail and automatic replies.

**Acceptance**：None substitutes for another; sending must follow final confirmation or an explicitly authorized rule.

## Developer track

1. Model consent separately from availability; test defaults, migration and revocation.

2. Retain prior settings and never enable sensitive sources through an upgrade.

3. Name the missing layer in diagnostics rather than suggesting disabling protection.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [COMMERCIAL-LICENSING.md](../COMMERCIAL-LICENSING.md)
- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 17 of 30 · License and optional consent ━━
Coach › Before acceptance you can read help and this text tutorial. License acceptance enables no learning, synchronization, app connections or computer grants. Each is your choice; the tutorial enables none.
    koder eula
    koder eula accept
    koder help permissions
    koder learn --print
Coach › Permissions and data guide
        
        License: personal, noncommercial local use is free; commercial use and organizational deployment require separate written authorization, and the personal license grants no proprietary development or code-modification rights. New Koder-owned distributions use proprietary Koder-EULA-1.1; third-party and legacy GPL rights remain intact. Acceptance licenses the software and enables none of the optional capabilities below. Read: koder eula. Explicitly accept: koder eula accept.
        
        Model and network: tasks, selected file contents, retrieved memories and tool results may be sent to your configured model/API. Provider charges apply. A local model must actually be installed and running; selecting a preset does not make offline inference available. Use --key-env for a variable reference. A key pasted into provider configuration is stored locally in plaintext even when the display masks it.
        
        Computer scope: file read/write/search, network, browser, desktop, channel attachments and skill updates are checked separately. Full work mode selects visible disk roots, subject to actual operating-system permissions and capabilities. Review the executable, roots and remote actors before typing GRANT. Agreement acceptance or --yes grants no computer authority. koder permissions revoke withdraws future Koder computer-tool grants on this device; revoke OS permissions in system settings separately. Completed writes or sends are not automatically undone.
        
        Cross-device memory service: your configured Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
        
        Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
        
        Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
        
        Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
        
        Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
        
        Daily reflection needs authorized sources, the relevant opt-ins, a valid account and a compatible Core host. The default model-call budget is four per day, using your configured API or local model and potentially incurring charges. A waiting-host or credential state means reflection has not completed. Turning learning off stops the corresponding future use; it does not erase history. Manage records with profile forget or memory forget.
        
        Local storage: new Windows memory prefers a writable D drive, falling back to a writable per-user location on C. Existing and explicitly configured locations are retained. Memory, installation and credential locations differ; inspect memory status / memory personalization status. Manually edit or roll back the assistant style without granting authority. Normal uninstall keeps configuration; --purge separately removes configuration. External memory and server copies need separate handling.
        
        Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
        
        Changing choices: the four optional features do not enable one another. Type ENABLE to turn one on, DISABLE to turn it off, and SAVE for a manual style edit. Read-only help and koder learn --print are available before agreement acceptance. Native Windows, live channels and multiple physical devices remain unverified for this preview; rely on observed connection states and results.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 17 of 30 · License and optional consent ━━
Coach › Before acceptance you can read help and this text tutorial. License acceptance enables no learning, synchronization, app connections or computer grants. Each is your choice; the tutorial enables none.
    koder eula
    koder eula accept
    koder help permissions
    koder learn --print
Coach › Permissions and data guide
        
        License: personal, noncommercial local use is free; commercial use and organizational deployment require separate written authorization, and the personal license grants no proprietary development or code-modification rights. New Koder-owned distributions use proprietary Koder-EULA-1.1; third-party and legacy GPL rights remain intact. Acceptance licenses the software and enables none of the optional capabilities below. Read: koder eula. Explicitly accept: koder eula accept.
        
        Model and network: tasks, selected file contents, retrieved memories and tool results may be sent to your configured model/API. Provider charges apply. A local model must actually be installed and running; selecting a preset does not make offline inference available. Use --key-env for a variable reference. A key pasted into provider configuration is stored locally in plaintext even when the display masks it.
        
        Computer scope: file read/write/search, network, browser, desktop, channel attachments and skill updates are checked separately. Full work mode selects visible disk roots, subject to actual operating-system permissions and capabilities. Review the executable, roots and remote actors before typing GRANT. Agreement acceptance or --yes grants no computer authority. koder permissions revoke withdraws future Koder computer-tool grants on this device; revoke OS permissions in system settings separately. Completed writes or sends are not automatically undone.
        
        Cross-device memory service: your configured Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
        
        Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
        
        Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
        
        Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
        
        Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
        
        Daily reflection needs authorized sources, the relevant opt-ins, a valid account and a compatible Core host. The default model-call budget is four per day, using your configured API or local model and potentially incurring charges. A waiting-host or credential state means reflection has not completed. Turning learning off stops the corresponding future use; it does not erase history. Manage records with profile forget or memory forget.
        
        Local storage: new Windows memory prefers a writable D drive, falling back to a writable per-user location on C. Existing and explicitly configured locations are retained. Memory, installation and credential locations differ; inspect memory status / memory personalization status. Manually edit or roll back the assistant style without granting authority. Normal uninstall keeps configuration; --purge separately removes configuration. External memory and server copies need separate handling.
        
        Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
        
        Changing choices: the four optional features do not enable one another. Type ENABLE to turn one on, DISABLE to turn it off, and SAVE for a manual style edit. Read-only help and koder learn --print are available before agreement acceptance. Native Windows, live channels and multiple physical devices remain unverified for this preview; rely on observed connection states and results.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 17 of 30 · License and optional consent ━━
Coach › Before acceptance you can read help and this text tutorial. License acceptance enables no learning, synchronization, app connections or computer grants. Each is your choice; the tutorial enables none.
    koder eula
    koder eula accept
    koder help permissions
    koder learn --print
Coach › Permissions and data guide
        
        License: personal, noncommercial local use is free; commercial use and organizational deployment require separate written authorization, and the personal license grants no proprietary development or code-modification rights. New Koder-owned distributions use proprietary Koder-EULA-1.1; third-party and legacy GPL rights remain intact. Acceptance licenses the software and enables none of the optional capabilities below. Read: koder eula. Explicitly accept: koder eula accept.
        
        Model and network: tasks, selected file contents, retrieved memories and tool results may be sent to your configured model/API. Provider charges apply. A local model must actually be installed and running; selecting a preset does not make offline inference available. Use --key-env for a variable reference. A key pasted into provider configuration is stored locally in plaintext even when the display masks it.
        
        Computer scope: file read/write/search, network, browser, desktop, channel attachments and skill updates are checked separately. Full work mode selects visible disk roots, subject to actual operating-system permissions and capabilities. Review the executable, roots and remote actors before typing GRANT. Agreement acceptance or --yes grants no computer authority. koder permissions revoke withdraws future Koder computer-tool grants on this device; revoke OS permissions in system settings separately. Completed writes or sends are not automatically undone.
        
        Cross-device memory service: your configured Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
        
        Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
        
        Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
        
        Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
        
        Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
        
        Daily reflection needs authorized sources, the relevant opt-ins, a valid account and a compatible Core host. The default model-call budget is four per day, using your configured API or local model and potentially incurring charges. A waiting-host or credential state means reflection has not completed. Turning learning off stops the corresponding future use; it does not erase history. Manage records with profile forget or memory forget.
        
        Local storage: new Windows memory prefers a writable D drive, falling back to a writable per-user location on C. Existing and explicitly configured locations are retained. Memory, installation and credential locations differ; inspect memory status / memory personalization status. Manually edit or roll back the assistant style without granting authority. Normal uninstall keeps configuration; --purge separately removes configuration. External memory and server copies need separate handling.
        
        Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
        
        Changing choices: the four optional features do not enable one another. Type ENABLE to turn one on, DISABLE to turn it off, and SAVE for a manual style edit. Read-only help and koder learn --print are available before agreement acceptance. Native Windows, live channels and multiple physical devices remain unverified for this preview; rely on observed connection states and results.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 17 of 30 · License and optional consent ━━
Coach › Before acceptance you can read help and this text tutorial. License acceptance enables no learning, synchronization, app connections or computer grants. Each is your choice; the tutorial enables none.
    koder eula
    koder eula accept
    koder help permissions
    koder learn --print
Coach › Permissions and data guide
        
        License: personal, noncommercial local use is free; commercial use and organizational deployment require separate written authorization, and the personal license grants no proprietary development or code-modification rights. New Koder-owned distributions use proprietary Koder-EULA-1.1; third-party and legacy GPL rights remain intact. Acceptance licenses the software and enables none of the optional capabilities below. Read: koder eula. Explicitly accept: koder eula accept.
        
        Model and network: tasks, selected file contents, retrieved memories and tool results may be sent to your configured model/API. Provider charges apply. A local model must actually be installed and running; selecting a preset does not make offline inference available. Use --key-env for a variable reference. A key pasted into provider configuration is stored locally in plaintext even when the display masks it.
        
        Computer scope: file read/write/search, network, browser, desktop, channel attachments and skill updates are checked separately. Full work mode selects visible disk roots, subject to actual operating-system permissions and capabilities. Review the executable, roots and remote actors before typing GRANT. Agreement acceptance or --yes grants no computer authority. koder permissions revoke withdraws future Koder computer-tool grants on this device; revoke OS permissions in system settings separately. Completed writes or sends are not automatically undone.
        
        Cross-device memory service: your configured Core endpoint
        After login, this account’s default shared space can synchronize conversations and memory across linked terminals, channels and devices. All members of a linked group can use linked private-chat memory; replies posted to the group are visible to its members. Link only conversations intended for sharing. Model API keys and computer grants are not memory-sync data. Sign out here: koder account logout. Forget the shared space: koder memory forget. Sign-out does not delete server copies; offline devices apply deletion after reconnecting.
        
        Preference learning
        Off by default. Extract communication preferences, explicit likes and work background from authorized conversations, retain their sources, and use them in later answers. A drink wanted today should not automatically become a permanent preference; inspect, correct or remove records.
        Turn off: koder memory learning off
        
        Daily state
        Off by default. Separately allow summaries of today’s mood, temporary needs and circumstances as short-term context. This is independent of lasting preference learning and does not diagnose a condition.
        Turn off: koder memory daily-state off
        
        Skill evolution
        Off by default. Allow skill-improvement candidates from authorized tasks and feedback, retaining provenance, checks and rollback records. This does not permit self-elevation, arbitrary software installation, changes to system security or bypassing tool approvals.
        Turn off: koder memory evolution off
        
        Proactive service and reminders
        Off by default. Allow greetings, work questions and reminders based on confirmed background, and associate your reply with the original question. Default quiet hours are 22:00–08:00 local time. Current terminal reminders need a running process and a compatible Core service. This does not authorize automatic messages to contacts or groups.
        Turn off: koder memory proactive off
        
        Daily reflection needs authorized sources, the relevant opt-ins, a valid account and a compatible Core host. The default model-call budget is four per day, using your configured API or local model and potentially incurring charges. A waiting-host or credential state means reflection has not completed. Turning learning off stops the corresponding future use; it does not erase history. Manage records with profile forget or memory forget.
        
        Local storage: new Windows memory prefers a writable D drive, falling back to a writable per-user location on C. Existing and explicitly configured locations are retained. Memory, installation and credential locations differ; inspect memory status / memory personalization status. Manually edit or roll back the assistant style without granting authority. Normal uninstall keeps configuration; --purge separately removes configuration. External memory and server copies need separate handling.
        
        Applications and MCP use the selected service’s API key or browser authorization. That service receives data submitted through the connection and sets its own fees and terms. Chats and agents in the same configured profile can reuse a connection; external writes still require tool approval. A stdio MCP server starts a local program. Imports are disabled by default; enable or test starts a connection. Use koder apps disconnect <id> or koder mcp disable <id> to stop use; revoke access with the provider to invalidate its tokens.
        
        Changing choices: the four optional features do not enable one another. Type ENABLE to turn one on, DISABLE to turn it off, and SAVE for a manual style edit. Read-only help and koder learn --print are available before agreement acceptance. Native Windows, live channels and multiple physical devices remain unverified for this preview; rely on observed connection states and results.
```

</details>
