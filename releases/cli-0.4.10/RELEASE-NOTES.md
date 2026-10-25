# Koder CLI 0.4.10

Long foreground commands have more time to finish. Ordinary shell commands now
default to five minutes; direct winget, pip, npm/pnpm and yarn installs default
to fifteen minutes. An explicit tool request can allow up to thirty minutes.
The approved duration, cancellation and unknown-effect reconciliation remain
binding. Short explicit deadlines and existing approvals are not widened.

The shell instructions now distinguish curl's internal deadline from Koder's
outer wait. Tool-step exhaustion records TASK_STEP_LIMIT with the consumed
budget and explains that the conversation, prior results and files are retained.
It does not silently clear history or restart completed commands.

## Updating

Use the [official installer](https://karmenloop.com/download.html) or `koder update`.
Confirm `koder --version` reports 0.4.10. Windows CMD/PowerShell and macOS use the
same versioned runtime with their respective installer scripts. Existing
Skills, MCP, provider routes, mail, input controls and permissions are retained.

See [command duration and recovery](COMMAND-DURATION.md) and the
[complete guide](USER-GUIDE.en.md). A mail NETWORK notice is a background inbox
failure; isolated tests confirm it does not cancel an in-flight foreground task.

## Evidence and remaining limits

A real macOS command completed after 45.06 seconds with exit 0. Local tests cover
long commands, explicit short deadlines, cancellation, saved approvals, step
exhaustion, retained history and mailbox failure isolation. The final package is
checked independently from its source snapshot.

Two existing synthetic input-interaction checks also fail on the unchanged
0.4.9 baseline; their failure records remain open. Native Windows 10/11,
PowerShell 5.1 cold startup, ConPTY/IME, Windows-MCP GUI and real provider/mailbox
accounts remain NOT_RUN. Local fixtures are not Windows device acceptance.
This release follows the user's standing publication instruction. The separate
unsigned macOS locked-use prototype is retained outside this release.
