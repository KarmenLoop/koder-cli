# 07. Slash commands: gears, brakes and undo

Allow 30 minutes

**Goal**：Steer, interrupt or queue during work, and insert slash-menu drafts without sending them accidentally.

**Preparation**：Use interactive Koder and a harmless task lasting several seconds. Non-TTY/JSON calls do not provide the same menu interaction.

## Hands-on steps

1. Select steer in /setup. During a task enter “Use English, keeping file paths unchanged.”

   **Check**：Check that steering was accepted; if queued instead, retain the reason code.

2. Try “stop”, then “stop, list the next steps”.

   **Check**：The first cancels; the second cancels and queues the suffix. The CLI remains usable.

3. Switch to queue and submit two distinct requests while busy.

   **Check**：A queue count and preview appear; requests run FIFO. Queued text must not approve a pending action.

4. Press / on an empty line, filter /he, fill /help with Tab, close with Esc and reopen; try /prefill.

   **Check**：Drafts remain editable and require submission. Unsupported rendering has an explicit fallback.

## Troubleshooting and recovery

- **An old build lacks input features**：Check koder version, update using lesson 16 and verify the executable path.
- **An ordinary sentence triggers cancellation**：Keep the exact sentence. “Stop a server” is a task, not an exact interrupt command.

## Assignment and acceptance

Record one steering input, two queued requests, a cancellation and a menu draft without external writes.

**Acceptance**：Steering is accepted or explicitly falls back; FIFO order is preserved, cancel does not replay tools and menus do not auto-send.

## Developer track

1. Cover local sessions and agentd failure paths; local input must work without activation.

2. Verify steering in subsequent requests or the transcript, not just a status message.

3. Test that queued text cannot approve actions and that Esc/Ctrl+C leaves no dangling input listeners.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)
- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 7 of 30 · Slash commands: gears, brakes and undo ━━
Coach › A Skill is a working guide. Koder can read Codex, Cursor and WorkBuddy SKILL.md packages and their resources on demand; scripts keep normal Koder approvals. Find one with /skills list, select it with /skill name and clear it with /skill clear. Host-specific tools still need setup.
Coach › Lines starting with / are slash commands. They control Koder itself and never reach the model.
    /mode plan
        plan mode: read-only, proposes a plan
    /mode code
        code mode: states a plan, then edits
    /yes
        toggles auto-approve; the prompt gains a !
    /new
        starts a fresh session
    /lang zh
        switches to Chinese, /lang en switches back
    /review  /fix  /test  /scan
        run those commands inside the chat
    /help  /learn  /exit
        commands, this tutorial, quit (Ctrl+D works too)
  Try it · Type /mode plan to switch to plan mode  →  /mode plan
  Try it · Now type /yes to turn on auto-approve  →  /yes
  Try it · Good. Type /yes again to turn it off  →  /yes
  Tip · Used to Ctrl+Z on Windows? It does nothing in Koder; use /exit or Ctrl+D.
Coach › Koder is running a command you regret. Fastest fix?
    1. Press Ctrl+C to cancel the turn
    2. Unplug the network cable
    3. Shout 'stop' at the screen
  Answer: 1。Right. Ctrl+C is the emergency brake; Ctrl+D is a polite goodbye.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 7 of 30 · Slash commands: gears, brakes and undo ━━
Coach › A Skill is a working guide. Koder can read Codex, Cursor and WorkBuddy SKILL.md packages and their resources on demand; scripts keep normal Koder approvals. Find one with /skills list, select it with /skill name and clear it with /skill clear. Host-specific tools still need setup.
Coach › Lines starting with / are slash commands. They control Koder itself and never reach the model.
    /mode plan
        plan mode: read-only, proposes a plan
    /mode code
        code mode: states a plan, then edits
    /yes
        toggles auto-approve; the prompt gains a !
    /new
        starts a fresh session
    /lang zh
        switches to Chinese, /lang en switches back
    /review  /fix  /test  /scan
        run those commands inside the chat
    /help  /learn  /exit
        commands, this tutorial, quit (Ctrl+D works too)
  Try it · Type /mode plan to switch to plan mode  →  /mode plan
  Try it · Now type /yes to turn on auto-approve  →  /yes
  Try it · Good. Type /yes again to turn it off  →  /yes
  Tip · Used to Ctrl+Z on Windows? It does nothing in Koder; use /exit or Ctrl+D.
Coach › Koder is running a command you regret. Fastest fix?
    1. Press Ctrl+C to cancel the turn
    2. Unplug the network cable
    3. Shout 'stop' at the screen
  Answer: 1。Right. Ctrl+C is the emergency brake; Ctrl+D is a polite goodbye.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 7 of 30 · Slash commands: gears, brakes and undo ━━
Coach › A Skill is a working guide. Koder can read Codex, Cursor and WorkBuddy SKILL.md packages and their resources on demand; scripts keep normal Koder approvals. Find one with /skills list, select it with /skill name and clear it with /skill clear. Host-specific tools still need setup.
Coach › Lines starting with / are slash commands. They control Koder itself and never reach the model.
    /mode plan
        plan mode: read-only, proposes a plan
    /mode code
        code mode: states a plan, then edits
    /yes
        toggles auto-approve; the prompt gains a !
    /new
        starts a fresh session
    /lang zh
        switches to Chinese, /lang en switches back
    /review  /fix  /test  /scan
        run those commands inside the chat
    /help  /learn  /exit
        commands, this tutorial, quit (Ctrl+D works too)
  Try it · Type /mode plan to switch to plan mode  →  /mode plan
  Try it · Now type /yes to turn on auto-approve  →  /yes
  Try it · Good. Type /yes again to turn it off  →  /yes
Coach › Koder is running a command you regret. Fastest fix?
    1. Press Ctrl+C to cancel the turn
    2. Unplug the network cable
    3. Shout 'stop' at the screen
  Answer: 1。Right. Ctrl+C is the emergency brake; Ctrl+D is a polite goodbye.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 7 of 30 · Slash commands: gears, brakes and undo ━━
Coach › A Skill is a working guide. Koder can read Codex, Cursor and WorkBuddy SKILL.md packages and their resources on demand; scripts keep normal Koder approvals. Find one with /skills list, select it with /skill name and clear it with /skill clear. Host-specific tools still need setup.
Coach › Lines starting with / are slash commands. They control Koder itself and never reach the model.
    /mode plan
        plan mode: read-only, proposes a plan
    /mode code
        code mode: states a plan, then edits
    /yes
        toggles auto-approve; the prompt gains a !
    /new
        starts a fresh session
    /lang zh
        switches to Chinese, /lang en switches back
    /review  /fix  /test  /scan
        run those commands inside the chat
    /help  /learn  /exit
        commands, this tutorial, quit (Ctrl+D works too)
  Try it · Type /mode plan to switch to plan mode  →  /mode plan
  Try it · Now type /yes to turn on auto-approve  →  /yes
  Try it · Good. Type /yes again to turn it off  →  /yes
Coach › Koder is running a command you regret. Fastest fix?
    1. Press Ctrl+C to cancel the turn
    2. Unplug the network cable
    3. Shout 'stop' at the screen
  Answer: 1。Right. Ctrl+C is the emergency brake; Ctrl+D is a polite goodbye.
```

</details>
