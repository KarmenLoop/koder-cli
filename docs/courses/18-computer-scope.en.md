# 18. Computer and files: inspect, grant, revoke

Allow 45 minutes

**Goal**：Operate the browser or desktop within explicit grants and verify actual state after each step.

**Preparation**：Use owned test windows and public pages, leaving personal windows untouched. GUI work needs a supported driver and interactive desktop.

## Hands-on steps

1. Run koder permissions status and inspect network, browser, desktop and file grants.

   **Check**：Missing grants are visible; --yes does not grant computer access.

2. Request the necessary scope through Setup or koder permissions request.

   **Check**：Grant only the required scope and review OS prompts yourself.

3. On Windows run koder mcp doctor windows-mcp --json, then test/enable the bundled driver in Setup.

   **Check**：Missing dependencies, architecture support or grants are reported; do not create a competing installation.

4. Ask: “Type HELLO-KODER into my new test text window and read it back; do not save into personal directories.”

   **Check**：Identify the target before acting and observe afterward; success needs actual window state.

## Troubleshooting and recovery

- **No driver or display server**：Use available file/API paths and mark GUI untested rather than claiming clicks.
- **GUI operation fails while locked**：Background tasks and locked-screen GUI are separate capabilities; the native companion still needs signing and dedicated acceptance.

## Assignment and acceptance

Type and read back in an owned window, revoke the relevant grant and verify later actions are blocked.

**Acceptance**：Retain target, grant, receipt and observed content. The revocation case must perform no extra clicks.

## Developer track

1. Bind target identity to observed platform handles/PIDs; matching titles alone are insufficient.

2. Clean up only owned resources and never terminate unrelated processes.

3. Separate discovery, calls, visible effects and user-task acceptance.

Deliver evidence for an owned target: prerequisites, commands and exit codes, artifacts, positive/negative cases, untested items and recovery. Use the [acceptance template](../tutorial-labs/acceptance-template.md)。

## References

- [WINDOWS-MCP-BUNDLED.zh.md](../WINDOWS-MCP-BUNDLED.zh.md)
- [WINDOWS-MCP-BUNDLED.en.md](../WINDOWS-MCP-BUNDLED.en.md)
- [MCP-ACTUAL-ACCEPTANCE.zh.md](../MCP-ACTUAL-ACCEPTANCE.zh.md)

<details><summary>powershell · Original coach and commands</summary>

```text
This edition is written for Windows PowerShell; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 18 of 30 · Computer and files: inspect, grant, revoke ━━
Coach › Inspect capabilities, then choose the needed folders and capabilities. Home mode is for personal files; full work mode selects visible disk roots. Review the executable, roots and remote actors before typing GRANT. OS privacy access, administrator permissions and missing drivers still need their system procedures.
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  Tip · Grant commands change local permission records: choose one, do not paste the entire block. Revocation blocks future computer-tool calls; it does not unsend files or restore overwritten contents. Manage OS permissions in system settings separately.
Coach › Use a full path, quoted when it contains spaces. On Windows, D: is drive-relative; use D:\folder\file.txt explicitly. If a path leaves its directory, check the workspace, allowed roots, network drives and link targets, then permissions status. Keep directory checks enabled. Before sending a file, confirm the recipient, group and attachment scope.
```

</details>

<details><summary>cmd · Original coach and commands</summary>

```text
This edition is written for Windows Command Prompt (CMD); for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 18 of 30 · Computer and files: inspect, grant, revoke ━━
Coach › Inspect capabilities, then choose the needed folders and capabilities. Home mode is for personal files; full work mode selects visible disk roots. Review the executable, roots and remote actors before typing GRANT. OS privacy access, administrator permissions and missing drivers still need their system procedures.
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  Tip · Grant commands change local permission records: choose one, do not paste the entire block. Revocation blocks future computer-tool calls; it does not unsend files or restore overwritten contents. Manage OS permissions in system settings separately.
Coach › Use a full path, quoted when it contains spaces. On Windows, D: is drive-relative; use D:\folder\file.txt explicitly. If a path leaves its directory, check the workspace, allowed roots, network drives and link targets, then permissions status. Keep directory checks enabled. Before sending a file, confirm the recipient, group and attachment scope.
```

</details>

<details><summary>mac · Original coach and commands</summary>

```text
This edition is written for macOS Terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 18 of 30 · Computer and files: inspect, grant, revoke ━━
Coach › Inspect capabilities, then choose the needed folders and capabilities. Home mode is for personal files; full work mode selects visible disk roots. Review the executable, roots and remote actors before typing GRANT. OS privacy access, administrator permissions and missing drivers still need their system procedures.
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  Tip · Grant commands change local permission records: choose one, do not paste the entire block. Revocation blocks future computer-tool calls; it does not unsend files or restore overwritten contents. Manage OS permissions in system settings separately.
Coach › Use a full path, quoted when it contains spaces. On Windows, D: is drive-relative; use D:\folder\file.txt explicitly. If a path leaves its directory, check the workspace, allowed roots, network drives and link targets, then permissions status. Keep directory checks enabled. Before sending a file, confirm the recipient, group and attachment scope.
```

</details>

<details><summary>linux · Original coach and commands</summary>

```text
This edition is written for Linux / Ubuntu terminal; for another system: koder learn --print --os powershell|cmd|mac|linux

━━ Lesson 18 of 30 · Computer and files: inspect, grant, revoke ━━
Coach › Inspect capabilities, then choose the needed folders and capabilities. Home mode is for personal files; full work mode selects visible disk roots. Review the executable, roots and remote actors before typing GRANT. OS privacy access, administrator permissions and missing drivers still need their system procedures.
    koder permissions status
    koder permissions request --home
    koder permissions request --mode full
    koder permissions revoke
  Tip · Grant commands change local permission records: choose one, do not paste the entire block. Revocation blocks future computer-tool calls; it does not unsend files or restore overwritten contents. Manage OS permissions in system settings separately.
Coach › Use a full path, quoted when it contains spaces. On Windows, D: is drive-relative; use D:\folder\file.txt explicitly. If a path leaves its directory, check the workspace, allowed roots, network drives and link targets, then permissions status. Keep directory checks enabled. Before sending a file, confirm the recipient, group and attachment scope.
```

</details>
