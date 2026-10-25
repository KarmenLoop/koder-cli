# Task completion notifications

Koder can notify you when a task finishes while you are working elsewhere. This uses the same native notification adapters as the resident agent. Frontend notifications do not require agentd, a model API call, or new computer permissions.

## Try it

```text
koder notifications status
koder notifications test task-done
koder notifications task-done off
koder notifications task-done on
```

Setup also exposes task notifications, the long-task threshold and a test action. The explicit test diagnoses the native channel even when automatic notices would be quiet or suppressed in CI. It does not spend the automatic task-notice budget. It sends a generic notification. It does not rerun a task or send email. A `submitted` receipt means the notification program accepted the call; it does not prove that a person saw it.

## Defaults

Successful foreground turns with positive focus stay quiet, including long tasks, unless the user explicitly requests a notification. Short successful interactive turns also stay quiet. Long tasks default to two minutes; unknown focus or a minute without input during a long task can make a notification useful. Background completion, failure and waiting for input are notification candidates. Cancellation stays quiet by default. An explicit request to be notified overrides focused or short-task silence, but never overrides the master switch, daily cap or OS refusal.

Focus uses terminal process or console metadata and recent input only. No accessibility or screen recording access is requested. Unavailable observations remain unknown.

Each turn produces one lifecycle outcome after final output. Stream chunks, individual Todo steps and accepted steering do not produce completion notices. A waiting-for-input notice does not approve the pending action.

Task notices have a separate daily budget of 20. Quiet hours inherit the resident agent's setting, normally 23:00–08:00. Eligible success notices are queued, retaining the latest three, and can be collapsed after quiet hours. An existing agentd tick, a later CLI notification operation or an explicit flush can process that queue. Exiting the CLI does not install a scheduler. Needs-input and long failures can break quiet hours but still spend the daily budget.

Receipts are reserved before dispatch under the existing private cross-process lease. Concurrent windows cannot spend the same last slot or send the same task twice. An uncertain result stays `UNKNOWN` and is not automatically resent. Each lifecycle retains its starting account: changing accounts cannot adopt old work or its continuation into the new account. Identity and live task-notice settings are checked immediately before each native or fallback channel attempt. Revoking notifications or removing a channel stops later effects.

## Resume without replay

Notifications hide task text, email bodies, code and diffs. They contain a generic outcome, duration and a continuation hint:

```text
koder status
koder notifications status
koder open <opaque-token>
```

The token resolves the original workspace and persisted session for the current identity. Opening it never submits the original prompt again. Missing records, changed identities and invalid workspaces fail explicitly. A temporary turn or a session with history disabled cannot be reopened as a persisted conversation; Koder reports that limit instead of creating a new conversation and calling it the original.

Windows supports a current-user protocol handler when its registration has been verified. A conflicting registration is not overwritten. Linux and macOS can use the textual continuation command. `clickSupported: false` means the notification cannot be relied on to open the session. Check the acceptance matrix before claiming native click support.

Gateway conversations use a separate channel scope. This increment sends their completion notice after the gateway reply settles, but continuation remains a status hint for returning to the original channel. It does not open an unrelated terminal conversation with the same session name.

## Configuration

```json
{
  "notifications": {
    "taskDone": {
      "enabled": true,
      "longTaskMs": 120000,
      "unfocusedIdleMs": 60000,
      "notifyShortSuccessWhenUnfocused": false,
      "notifyOnCancel": false,
      "notifyOnFail": true,
      "notifyOnNeedsInput": true,
      "maxTaskDonePerDay": 20,
      "channels": ["os-notification"],
      "collapseQueuedAfterQuiet": 3
    }
  }
}
```

Omit `quietHours` to inherit `agentd.proactive.quietHours`. Set it to `[]` to disable quiet hours for task notices, or use a list such as `["22:30-08:30"]` to override the inherited setting.

Task completion and proactive reminders have independent switches and budgets. Disabling either does not stop existing tasks, the gateway or the other notification category.

## Platform behavior

- Windows: PowerShell and WinRT Toast, without an administrator request. Disabled notifications return a refusal, not success. WSL uses the Linux adapter.
- Linux: `notify-send --app-name=Koder`, with a desktop or D-Bus session. SSH without a desktop returns `NO_NOTIFICATION_SESSION`. Missing libnotify tools return `NOTIFICATION_PROGRAM_MISSING`; Koder does not install packages or notify as root.
- macOS: the existing AppleScript notification adapter. Explicit refusal is reported; silent suppression by notification settings cannot be inferred from a successful script invocation.

Native receipts use `submitted`, `unavailable`, `denied` or `UNKNOWN`, with `displayVerified: false`. Only definite unavailability or refusal permits an explicitly configured, paired self-DM fallback. A submitted or uncertain native result never triggers a second channel.

See [the acceptance matrix](TASK-NOTIFICATIONS-ACCEPTANCE.md) for actual platform evidence and remaining native checks. Unit tests and hosted runners do not establish that a user saw or clicked a desktop notification.
