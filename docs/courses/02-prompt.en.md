# 02. The banner and the prompt

Allow 20 minutes

**Goal**：Read the active directory, model and mode, and find help without mistaking the prompt for a completed task.

**Preparation**：Complete lesson 1, widen the terminal to at least 80 columns and prepare a harmless task.

## Hands-on steps

1. Run koder and read the version, model and directory before entering a task.

   **Check**：The directory must match your project. A displayed model name is configuration, not a connectivity test.

2. Enter /help, then /setup; exit Setup back to the conversation.

   **Check**：Help and Setup open in the current CLI session.

3. Press / on an empty line, select with arrows and fill with Tab. Edit before submitting.

   **Check**：Selection fills a draft. Esc closes the menu; use /help or completion if the terminal cannot render it.

4. Open Koder in a different project in a second window and inspect both directories.

   **Check**：Each window should work independently. Preserve the full occupancy message if you intentionally share a session.

## Troubleshooting and recovery

- **Broken borders or wrapped menu**：Widen the window or choose a plain banner in Setup; retain model settings.
- **A session appears occupied with one window visible**：Record version and session name; inspect other terminals or residency before deleting anything.

## Assignment and acceptance

Annotate a redacted banner with version, directory, model and mode. Fill a menu draft, then cancel it without sending.

**Acceptance**：Explain the difference between configuration and execution. Canceling the draft must create no model task or file edit.

## Developer track

1. Treat selection, draft insertion, submission and cancellation as separate events.

2. Check the menu at 80×24 and in a narrow terminal; fallback must remain readable.

3. For non-TTY/JSON calls, verify that animation and menus do not pollute output. Check session boundaries with two separate projects.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [PROMPT_PREFILLS.md](../PROMPT_PREFILLS.md)
- [MULTI-WINDOW.md](../MULTI-WINDOW.md)
- [SESSION-INPUT-AND-SKILLS.zh.md](../SESSION-INPUT-AND-SKILLS.zh.md)
- [SESSION-INPUT-AND-SKILLS.en.md](../SESSION-INPUT-AND-SKILLS.en.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 2 of 30 · The banner and the prompt ━━
  · (The banner appears here: the KARMEN refractor on the left, KODER and KARMEN LOOP on the right.)
Coach › On the left is the KARMEN refractor, the mascot from our website, drawn from the very same surface; on the right, KODER and KARMEN LOOP, then the current model, engine, folder and common commands. It isn't decoration. Fine, it's mostly decoration, but it is pretty.
  Tip · Box lines or the refractor scrambled? A CJK font in the classic console draws block characters two columns wide. Koder switches to plain characters by itself, or set Banner style to plain in koder setup. Better still, use Windows Terminal: built into Windows 11, free from the Microsoft Store on Windows 10.
    $env:KODER_ASCII = "1"; koder
        plain-character banner for this window only
Coach › Below the banner is the prompt, which tells you the current state:
    koder ›
        type a task here, e.g. fix the typos in README
    koder[code] ›
        the brackets show the current mode
    koder! ›
        the exclamation mark means auto-approve is on; be careful
Coach › The prompt reads koder[plan]! ›. Which statement is right?
    1. Plan mode, with auto-approve on
    2. Plan mode, and something just failed
    3. Code mode, and it's excited
  Answer: 1。Full marks. Brackets are the mode, the exclamation mark is auto-approve.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 2 of 30 · The banner and the prompt ━━
  · (The banner appears here: the KARMEN refractor on the left, KODER and KARMEN LOOP on the right.)
Coach › On the left is the KARMEN refractor, the mascot from our website, drawn from the very same surface; on the right, KODER and KARMEN LOOP, then the current model, engine, folder and common commands. It isn't decoration. Fine, it's mostly decoration, but it is pretty.
  Tip · Box lines or the refractor scrambled? A CJK font in the classic console draws block characters two columns wide. Koder switches to plain characters by itself, or set Banner style to plain in koder setup. Better still, use Windows Terminal: built into Windows 11, free from the Microsoft Store on Windows 10.
    set "KODER_ASCII=1" && koder
        plain-character banner for this window; quote the whole set, or CMD keeps the space before && in the value
Coach › Below the banner is the prompt, which tells you the current state:
    koder ›
        type a task here, e.g. fix the typos in README
    koder[code] ›
        the brackets show the current mode
    koder! ›
        the exclamation mark means auto-approve is on; be careful
Coach › The prompt reads koder[plan]! ›. Which statement is right?
    1. Plan mode, with auto-approve on
    2. Plan mode, and something just failed
    3. Code mode, and it's excited
  Answer: 1。Full marks. Brackets are the mode, the exclamation mark is auto-approve.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 2 of 30 · The banner and the prompt ━━
  · (The banner appears here: the KARMEN refractor on the left, KODER and KARMEN LOOP on the right.)
Coach › On the left is the KARMEN refractor, the mascot from our website, drawn from the very same surface; on the right, KODER and KARMEN LOOP, then the current model, engine, folder and common commands. It isn't decoration. Fine, it's mostly decoration, but it is pretty.
  Tip · The built-in Terminal app shows the refractor in 256 colours; iTerm2, Ghostty or WezTerm show full true colour. Use a monospaced font such as SF Mono or Menlo.
Coach › Below the banner is the prompt, which tells you the current state:
    koder ›
        type a task here, e.g. fix the typos in README
    koder[code] ›
        the brackets show the current mode
    koder! ›
        the exclamation mark means auto-approve is on; be careful
Coach › The prompt reads koder[plan]! ›. Which statement is right?
    1. Plan mode, with auto-approve on
    2. Plan mode, and something just failed
    3. Code mode, and it's excited
  Answer: 1。Full marks. Brackets are the mode, the exclamation mark is auto-approve.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 2 of 30 · The banner and the prompt ━━
  · (The banner appears here: the KARMEN refractor on the left, KODER and KARMEN LOOP on the right.)
Coach › On the left is the KARMEN refractor, the mascot from our website, drawn from the very same surface; on the right, KODER and KARMEN LOOP, then the current model, engine, folder and common commands. It isn't decoration. Fine, it's mostly decoration, but it is pretty.
  Tip · GNOME Terminal, Konsole and Alacritty show true colour. Grey over SSH or tmux? Prefix COLORTERM=truecolor. Broken box lines? Switch to a monospaced font with block characters (DejaVu Sans Mono, say), or run KODER_ASCII=1 koder for plain characters.
Coach › Below the banner is the prompt, which tells you the current state:
    koder ›
        type a task here, e.g. fix the typos in README
    koder[code] ›
        the brackets show the current mode
    koder! ›
        the exclamation mark means auto-approve is on; be careful
Coach › The prompt reads koder[plan]! ›. Which statement is right?
    1. Plan mode, with auto-approve on
    2. Plan mode, and something just failed
    3. Code mode, and it's excited
  Answer: 1。Full marks. Brackets are the mode, the exclamation mark is auto-approve.
```

</details>
