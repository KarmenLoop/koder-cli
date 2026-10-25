# 14. Editors: Zed, Neovim, Emacs

Allow 35 minutes

**Goal**：Use the same Koder installation from an editor and import portable Skills without blindly running scripts.

**Preparation**：Verify the standalone CLI works. Check your installed editor’s ACP support and use a Skill you are authorized to use.

## Hands-on steps

1. Run koder editor zed, nvim or emacs and inspect the generated snippet.

   **Check**：The command points to the real installation and the correct Windows launcher where applicable.

2. Back up editor settings and merge the snippet; open a test project.

   **Check**：Existing plugins remain configured and the workspace is correct.

3. Ask a read-only question, then request a small edit and reject it.

   **Check**：Requests and approval reach the editor; rejection leaves files unchanged.

4. Run koder skills list and koder help skills; import the selected directory and inspect it with show.

   **Check**：Portable SKILL.md content can be discovered within compatibility limits; host-specific APIs do not become available automatically.

## Troubleshooting and recovery

- **The editor cannot find Koder**：Check the absolute executable path, environment and arguments.
- **A Skill references unavailable tools**：Map to existing tools where possible or report the missing dependency; do not claim complete compatibility.

## Assignment and acceptance

Import a read-only instruction Skill into a test project and record discovery, reading, applicable tasks and unsupported tools.

**Acceptance**：Importing neither installs dependencies nor grants permissions or executes scripts. Editor tasks retain existing approvals.

## Developer track

1. Separate protocol output from diagnostics so animations cannot corrupt ACP.

2. Test startup, proposals, denial, cancellation and cleanup.

3. Author Skills with clear triggers, steps, success criteria and recovery. Repository content cannot create system authority.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [PORTABLE-SKILLS.zh.md](../PORTABLE-SKILLS.zh.md)
- [PORTABLE-SKILLS.en.md](../PORTABLE-SKILLS.en.md)
- [MCP-SKILL-COMPATIBILITY.zh.md](../MCP-SKILL-COMPATIBILITY.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 14 of 30 · Editors: Zed, Neovim, Emacs ━━
Coach › Prefer your editor? Zed, Neovim and Emacs launch koder acp over ACP to chat, see diffs and approve edits. Zed needs just this:
  · (The koder editor zed snippet is shown here.)
    koder editor nvim
        Neovim (CodeCompanion), config at %LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua
    koder editor emacs
        Emacs (agent-shell), config at %APPDATA%\.emacs.d\init.el
  Tip · On Windows editors only add .exe when starting programs, so the snippet says koder.cmd; keep it. Zed's settings live in %APPDATA%\Zed\settings.json. Too lazy to copy? The Editors item in koder setup copies it for you.
  (whispering) Vim users, relax: quitting Koder is far easier than quitting Vim. Ctrl+D.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 14 of 30 · Editors: Zed, Neovim, Emacs ━━
Coach › Prefer your editor? Zed, Neovim and Emacs launch koder acp over ACP to chat, see diffs and approve edits. Zed needs just this:
  · (The koder editor zed snippet is shown here.)
    koder editor nvim
        Neovim (CodeCompanion), config at %LOCALAPPDATA%\nvim\lua\plugins\codecompanion.lua
    koder editor emacs
        Emacs (agent-shell), config at %APPDATA%\.emacs.d\init.el
  Tip · On Windows editors only add .exe when starting programs, so the snippet says koder.cmd; keep it. Zed's settings live in %APPDATA%\Zed\settings.json. Too lazy to copy? The Editors item in koder setup copies it for you.
  (whispering) Vim users, relax: quitting Koder is far easier than quitting Vim. Ctrl+D.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 14 of 30 · Editors: Zed, Neovim, Emacs ━━
Coach › Prefer your editor? Zed, Neovim and Emacs launch koder acp over ACP to chat, see diffs and approve edits. Zed needs just this:
  · (The koder editor zed snippet is shown here.)
    koder editor nvim
        Neovim (CodeCompanion), config at ~/.config/nvim/lua/plugins/codecompanion.lua
    koder editor emacs
        Emacs (agent-shell), config at ~/.emacs.d/init.el
  Tip · Zed's settings live in ~/.config/zed/settings.json. Too lazy to copy? The Editors item in koder setup copies it for you.
  (whispering) Vim users, relax: quitting Koder is far easier than quitting Vim. Ctrl+D.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 14 of 30 · Editors: Zed, Neovim, Emacs ━━
Coach › Prefer your editor? Zed, Neovim and Emacs launch koder acp over ACP to chat, see diffs and approve edits. Zed needs just this:
  · (The koder editor zed snippet is shown here.)
    koder editor nvim
        Neovim (CodeCompanion), config at ~/.config/nvim/lua/plugins/codecompanion.lua
    koder editor emacs
        Emacs (agent-shell), config at ~/.emacs.d/init.el
  Tip · Zed's settings live in ~/.config/zed/settings.json. Too lazy to copy? The Editors item in koder setup copies it for you.
  (whispering) Vim users, relax: quitting Koder is far easier than quitting Vim. Ctrl+D.
```

</details>
