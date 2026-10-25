# 27. Six seconds of fun, with an exit right there

Allow 20 minutes

**Goal**：Use skippable animations without disrupting work or polluting script output.

**Preparation**：Use an interactive terminal. Animation needs no model and proves no task outcome; disable automatic effects when inappropriate.

## Hands-on steps

1. Run koder celebrate and choose an effect such as fireworks.

   **Check**：Selection controls an effect, not project execution.

2. Press a key during playback.

   **Check**：The prompt becomes usable immediately.

3. Use koder celebrate auto notice for greetings only, or auto off.

   **Check**：Notice is different from automatic playback; normal command output stays clean.

4. Check the text fallback in a limited terminal.

   **Check**：No broken cursor state remains and input still works.

## Troubleshooting and recovery

- **Cursor behaves oddly after animation**：Record terminal and dimensions; disable effects instead of resetting all settings.
- **A holiday has no effect**：Check date, mode and supported calendar; not every regional holiday is covered.

## Assignment and acceptance

Play, skip and disable an effect, then verify /help still works.

**Acceptance**：Skipping preserves input and animation is not used as acceptance evidence.

## Developer track

1. Restore cursor, raw mode and listeners on completion, error and cancel.

2. Check TTY, dumb, CI and JSON paths without ANSI pollution.

3. Respect date-level deduplication and user settings instead of playing on every command.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [USER-GUIDE.zh.md](../USER-GUIDE.zh.md)
- [USER-GUIDE.en.md](../USER-GUIDE.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 27 of 30 · Six seconds of fun, with an exit right there ━━
Coach › Code rain, confetti, fireworks, a Christmas tree, Halloween pumpkins, National Day lanterns, New Year, and birthdays live in one optional menu. Effects last about six seconds; any key skips. Terminals without animation support get text. Ordinary commands, JSON, and scripts stay clean.
    koder celebrate
    koder celebrate fireworks
    koder celebrate auto notice
    koder celebrate auto off
  Tip · By default, a supported holiday gets one greeting. Choose auto on for automatic effects. Regional and lunar holidays follow the local date; add your own annual occasion when it is not on the calendar.
    koder celebrate custom --date 03-14 --name "Our day"
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 27 of 30 · Six seconds of fun, with an exit right there ━━
Coach › Code rain, confetti, fireworks, a Christmas tree, Halloween pumpkins, National Day lanterns, New Year, and birthdays live in one optional menu. Effects last about six seconds; any key skips. Terminals without animation support get text. Ordinary commands, JSON, and scripts stay clean.
    koder celebrate
    koder celebrate fireworks
    koder celebrate auto notice
    koder celebrate auto off
  Tip · By default, a supported holiday gets one greeting. Choose auto on for automatic effects. Regional and lunar holidays follow the local date; add your own annual occasion when it is not on the calendar.
    koder celebrate custom --date 03-14 --name "Our day"
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 27 of 30 · Six seconds of fun, with an exit right there ━━
Coach › Code rain, confetti, fireworks, a Christmas tree, Halloween pumpkins, National Day lanterns, New Year, and birthdays live in one optional menu. Effects last about six seconds; any key skips. Terminals without animation support get text. Ordinary commands, JSON, and scripts stay clean.
    koder celebrate
    koder celebrate fireworks
    koder celebrate auto notice
    koder celebrate auto off
  Tip · By default, a supported holiday gets one greeting. Choose auto on for automatic effects. Regional and lunar holidays follow the local date; add your own annual occasion when it is not on the calendar.
    koder celebrate custom --date 03-14 --name "Our day"
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 27 of 30 · Six seconds of fun, with an exit right there ━━
Coach › Code rain, confetti, fireworks, a Christmas tree, Halloween pumpkins, National Day lanterns, New Year, and birthdays live in one optional menu. Effects last about six seconds; any key skips. Terminals without animation support get text. Ordinary commands, JSON, and scripts stay clean.
    koder celebrate
    koder celebrate fireworks
    koder celebrate auto notice
    koder celebrate auto off
  Tip · By default, a supported holiday gets one greeting. Choose auto on for automatic effects. Regional and lunar holidays follow the local date; add your own annual occasion when it is not on the calendar.
    koder celebrate custom --date 03-14 --name "Our day"
```

</details>
