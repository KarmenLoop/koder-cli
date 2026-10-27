# Ubuntu 24.04: install Koder and complete your first task

[Repository home](../README.md) · [中文手把手教程](UBUNTU.zh.md) · [Download 0.5.12](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.12)

This guide covers **Koder CLI 0.5.12** on **Ubuntu 24.04 LTS and its 24.04.x point releases**, on x64 and ARM64. The Linux package includes the supported runtime features, Skills, learning resources and current classroom. Windows-MCP and the macOS locked-use component remain platform-specific. Ubuntu uses the Linux AT-SPI desktop adapter. Ubuntu 24.10 is outside the current scope.

## 1. Open a terminal and check the system

On Ubuntu Desktop, press Ctrl+Alt+T. Paste with Ctrl+Shift+V. Copy the command, not a shell prompt or the code-fence markers.

```bash
cat /etc/os-release
uname -m
```

Expect Ubuntu with `VERSION_ID="24.04"`, and `x86_64` or `aarch64`. For other systems, use [Installation](INSTALLATION.md). Run Koder as your regular user. Only the distribution dependency commands below use sudo.

## 2. Choose one installation route

Check the available downloader:

```bash
command -v wget
command -v curl
```

**With wget:**

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-ubuntu-install.sh https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh && bash /tmp/koder-ubuntu-install.sh
```

**With curl:**

```bash
curl -fL --retry 3 --connect-timeout 20 https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/koder-ubuntu-24.04.sh -o /tmp/koder-ubuntu-install.sh && bash /tmp/koder-ubuntu-install.sh
```

**If neither is installed:** run these separately, resolve any apt errors, then use the curl command above.

```bash
sudo apt update
sudo apt install curl ca-certificates
```

If apt is busy with an OS update, wait; do not delete its locks. The `&&` in the download commands prevents running an incomplete installer after a failed download.

Read the [EULA](../EULA.md) and [consent guide](../ACCEPTANCE.md), then type `accept` to continue or `decline` to cancel. The installer selects the Linux archive and reuses a compatible Node runtime or downloads a verified one. You do not need global npm or a manually chosen Node architecture. Do not run the installer or Koder with sudo.

Personal noncommercial local use is free; model providers bill API usage separately. Commercial and organizational use requires separate authorization. Accepting the license does not authorize computer access, mail, GitHub or background services.

## 3. Follow progress and verify installation

During downloads, the installer reports MB transferred, a known total and percentage, elapsed seconds, average speed and the attempt number about every five seconds. Unknown totals are labeled. Verification, extraction and activation follow the download.

The 0.5.12 Linux archive is about **150.2 MB**. A first installation may also download Node, and extracted files need additional disk space. This archive size is not a total-download or speed guarantee.

If a transfer is interrupted, rerun the same installation command. Resumable data is kept under `~/.koder-cli/cache/downloads`; SHA-256 verification remains required. Do not combine partial files manually.

Open a **new terminal**, then run:

```bash
koder --version
koder --help
```

Expect `koder 0.5.12`. If the command is not found, adjust this terminal's PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
hash -r
koder --version
```

The installer reports its persistent shell configuration changes or the required PATH entry. If an older copy starts, inspect `type -a koder` before changing anything. Do not delete `~/.koder-cli` to fix PATH.

## 4. Configure a model

```bash
koder setup
```

Choose the provider, region and API product you actually use. Enter the API key in the setup prompt, select an available model and effort level, then save. A web-chat subscription does not automatically include API access. Unavailable entries remain disabled; see [Providers](PROVIDERS.md).

```bash
koder model test
koder model test --tools
```

These checks call the selected provider and may incur usage charges. A working connection does not grant computer permissions. If protected credential storage is unavailable, check the session keyring described below; do not save secrets in a project or run Koder as root.

## 5. Complete a file task and a website

```bash
mkdir -p "$HOME/Koder Projects/ubuntu-first-task"
cd "$HOME/Koder Projects/ubuntu-first-task"
koder
```

At the Koder prompt, enter:

```text
Create HELLO.md in this project with its purpose and three next steps. Save it, read it back, and report the path.
```

Review any approval request. In another terminal, verify the actual file:

```bash
cat "$HOME/Koder Projects/ubuntu-first-task/HELLO.md"
```

A plan or a promise is not a saved file. If the task stops, retain the reason code and workspace path rather than submitting the same command repeatedly.

For a website, ask:

```text
Build a responsive single-page coffee shop website. Ask about missing brand, audience, content and visual requirements first. Save the agreed project direction, implement the site, verify it and start a working preview. Return the preview URL and file paths.
```

Answer the questions before implementation. Applicable website tasks use the built-in design and delivery workflow; existing projects should retain their agreed direction. Open the returned URL and check the content, buttons and narrow-screen layout. A `127.0.0.1` preview belongs to the machine running it, not the public internet. See [Website projects](WEBSITE-PROJECTS.en.md) and [delivery](website-delivery.md).

## 6. Authorize computer scope

```bash
koder permissions status
koder doctor --computer
```

For file access under your home directory and network capabilities:

```bash
koder permissions request --home
```

For broad work scope, use this alternative, review the listed capabilities and type `GRANT`:

```bash
koder permissions request --mode full
```

Full scope requests file, network, browser, desktop, channel-file and Skill-update capabilities. Its file boundary can include `/`, but it does **not** grant root access. Ubuntu still checks the actual target permissions. Missing drivers, connections or the keyring can leave a capability `missing` or `unknown`. `--yes` does not authorize this scope.

Execution approval is separate: commands, software installation or external writes may still ask. Revoke future computer access with `koder permissions revoke`; this does not undo completed changes.

## 7. Set up and test the graphical desktop

Run inside the signed-in user's desktop terminal:

```bash
printf 'session=%s\nDISPLAY=%s\nWAYLAND_DISPLAY=%s\n' "$XDG_SESSION_TYPE" "$DISPLAY" "$WAYLAND_DISPLAY"
test -n "$DBUS_SESSION_BUS_ADDRESS" && echo "Session D-Bus is set"
```

X11 and Wayland are supported paths; both display variables need not be present. Manually inventing a DISPLAY or D-Bus value does not create a session.

Install missing distribution dependencies after reviewing this command:

```bash
sudo apt update
sudo apt install python3-gi gir1.2-atspi-2.0 at-spi2-core libsecret-tools gnome-keyring libnotify-bin
```

The first three packages support accessible controls, the next two protected credentials, and the last notifications. Koder does not automatically execute this command. If newly installed user services remain unavailable, save your work, sign out and sign in again.

```bash
koder doctor --computer
koder permissions request --capability desktop
koder permissions status
```

Type `GRANT` at the authorization prompt. Inspect the `Ubuntu desktop` report for `backend: "at-spi"`, `available: true`, or a specific reason code. Driver availability and your desktop grant are separate checks.

Open the system text editor yourself and create a blank document. Ask Koder to inspect the desktop, find that blank editor, type `Koder Ubuntu desktop test`, then read the controls again to confirm. Tell it to leave other windows and documents alone. Verify the text in the actual editor and the inspect/capture/act/reobserve tool sequence. If the editor exposes no usable text control, report that limitation rather than claiming success.

The adapter can click, type, focus, select and scroll through exposed accessible controls. Its capture is an **accessibility tree, not a pixel screenshot**. Password text is omitted. Stale snapshots cannot be replayed; uncertain actions retain `UNKNOWN` and require observation before another attempt.

Canvas-only apps, games, remote-desktop images, inaccessible custom widgets, login screens and lock screens are outside this adapter. Having Firefox or Chrome installed does not connect a browser automation host. Prefer an already connected App/MCP when it covers the task; see [App use and learning](APP-USE-AND-LEARN.en.md).

## 8. Credentials, mail, notifications and GitHub

`command -v secret-tool` checks that the credential helper exists. Protected storage also needs the user's session bus and unlocked keyring. Automatic desktop login may leave the keyring locked; unlock it through the system password/key interface without placing its password in commands or chat.

For a 163 mailbox:

```bash
koder mail setup 163
koder mail status
koder mail check
```

Use the setup prompt for the mailbox authorization code. After checking succeeds, `koder mail send` collects the recipient, subject and body and requires confirmation. Test only with an address you control or have permission to contact. SMTP acceptance does not prove inbox delivery.

```bash
koder mail monitor on
koder mail monitor status
```

Review the scope and enter `watch-mail`. Check `running` and `lastMailSuccess`. The default polling interval is about 30 seconds; network conditions, sleep, quiet hours and notification limits affect delivery. Stop it with `koder mail monitor off`. Model reading, proactive inquiry and sending have separate permissions; see [Mail recovery](MAIL-RECOVERY.en.md).

```bash
koder notifications status
koder notifications test task-done
```

Check the actual notification center. `submitted` is not a read receipt. A missing desktop session returns `NO_NOTIFICATION_SESSION`.

For other background tasks, explicitly use `koder activate`, inspect `koder status`, and disable with `koder deactivate`. Ubuntu uses user-level systemd, not a root service or automatically enabled lingering. Do not assume services persist after logout. Mail monitoring already managed by agentd does not need duplicate watchers. See [Always on](ALWAYS-ON.en.md).

```bash
koder github connect
koder github status
koder mcp list
koder apps list
```

Enter the GitHub token in the binding prompt with only the required repository scope. Connecting does not automatically upload a project; review the target repository, branch and files before approving a write. See [GitHub projects](GITHUB-PROJECTS.en.md) and [MCP compatibility](MCP-SKILL-COMPATIBILITY.en.md).

## 9. Updates and daily controls

Save your work, then run `koder update` and `koder --version`. Restart old processes. If an old updater rejects the package size or manifest, rerun the current installer in place; retain your configuration and workspaces.

| Need | Control |
| --- | --- |
| Model, effort, context and automatic compaction | `koder setup` |
| Learning status / pause | `koder learning status` / `koder learning off` |
| Portable Skills / on-demand catalog | `koder skills list` / `koder skills catalog` |
| Lessons | `koder learn` |
| Mid-task input | Enter to steer by default; select FIFO queueing in Setup |
| Cancel | Esc or Ctrl+C; inspect any uncertain external effect |
| Templates and commands | Type `/` on an empty line, Tab to fill a draft, edit before sending |
| Independent projects | Separate terminals and project directories |

Tool rounds remain unlimited by default; explicit cost budgets, cancellation, approvals and recovery limits still apply. Skill files do not each start a resident process. [Portable Skills](PORTABLE-SKILLS.en.md), [task orchestration](TASK-ORCHESTRATION.en.md) and [context controls](CONTEXT-CONTROLS.en.md) explain the details.

## 10. Troubleshooting

| Symptom | Next step |
| --- | --- |
| curl not found | Use wget or install curl and ca-certificates; the installer has not started. |
| Installer-script download failed | Rerun the full command with `&&`; do not execute a stale temporary file. |
| Interrupted archive download | Rerun the same installer to resume. Keep TLS and SHA-256 verification enabled. |
| Command missing / old version | Reopen the terminal, inspect PATH and `type -a koder`. |
| Task keeps waiting | Verify 0.5.12, watch the ten-second wait feedback, then check the selected provider. |
| `API_HEADERS_TIMEOUT` | The provider may still be generating; avoid submitting duplicate work. |
| Keyring unavailable | Check secret-tool, the session bus and keyring unlock; do not use root. |
| `COMPUTER_NO_DESKTOP_SESSION` | Use the signed-in desktop terminal or continue with CLI file tasks. |
| Missing AT-SPI / desktop | Check dependencies, sign-in session, doctor output and the app's accessibility support. |
| `EACCES` / `EPERM` | Check the actual file owner, path and grant; broad scope does not override OS permissions. |
| Reconciliation required / `UNKNOWN` | Inspect the previous effect and receipt before attempting it again. |
| Mail `STORAGE_BUSY` | Inspect mail and monitor status; do not delete credential stores or locks. |
| Notification submitted but unseen | Check notification center, Do Not Disturb and app settings. |

Task response headers have a default **180-second** deadline in 0.5.12. Response-body idle limits, total request limits, shell deadlines, download limits and quick model diagnostics are separate. For a confirmed slow provider, set this before starting Koder:

```bash
export KODER_API_HEADERS_TIMEOUT_MS=600000
koder
```

The value is milliseconds, up to 600000. Restore the default with `unset KODER_API_HEADERS_TIMEOUT_MS`. It does not disable every timeout or guarantee success. Header timeouts are not automatically replayed. `koder model test` can use a shorter diagnostic deadline.

For support, include the version, system/architecture, exact step and reason code, and a redacted `koder logs --tail 100` excerpt. Exclude keys, tokens, mailbox codes and private mail.

## 11. Servers, SSH and package verification

Servers retain CLI file/model tasks. GUI operations and notifications require the corresponding user session; protected account bindings require a working keyring. Follow [Headless/CI contracts](HEADLESS-0.5.zh.md) for unattended licensing, credentials and permissions. An interactive approval prompt is not a CI configuration.

To view a remote loopback preview, run an SSH forward on your local computer. Replace the placeholders with your authorized host and actual preview port:

```text
ssh -L 8080:127.0.0.1:PREVIEW_PORT USER@SERVER
```

Keep the connection open and visit `http://127.0.0.1:8080` locally. This does not publish the site.

To inspect a manual download, place `SHA256SUMS` and the Linux archive from the same release in one directory:

```bash
sha256sum koder-cli-0.5.12-linux.tgz
grep 'koder-cli-0.5.12-linux.tgz' SHA256SUMS
```

The digests must match. The `.tgz` is not a `.deb` or double-click installer. Normal installations use the script above.

## 12. Evidence and further reading

The [0.5.12 task workflow](https://github.com/KarmenLoop/koder-cli/actions/runs/40555216774) passed on x64 and ARM64 with the final package in a real PTY: a local API waited 20 seconds, with one request, visible wait feedback and a final reply. This is not a live-provider quality test.

The [desktop and installation matrix](https://github.com/KarmenLoop/koder-cli/actions/runs/40555225654) checks hashes, managed Node, reinstall preservation, real GTK controls, notifications and headless fallback. At this documentation update, ARM64 X11/Wayland and x64 X11 passed; x64 Wayland was still running. Check the run for its final state. The [release acceptance record](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.12/ACCEPTANCE-RESULTS.json) retains the publication-time results.

Xvfb/headless Sway do not certify physical GNOME, reboot behavior, every GPU or every app. Earlier 0.5.8 GI text-interface failures remain recorded; the fix uses interface-qualified calls with empty-input, label and password regressions. Compare package hashes when reviewing runs.

Continue with [Start here](START-HERE.en.md), [the English course](courses/README.en.md), [the 1,800-lesson Chinese classroom](courses/README.zh.md), [the user guide](USER-GUIDE.en.md) or [download recovery](DOWNLOADS.md). GitHub does not execute classroom HTML in a file view; use `koder learn` or the classroom's local-opening instructions.

OS references: [Ubuntu Desktop documentation](https://documentation.ubuntu.com/desktop/) and [Ubuntu release cycle](https://ubuntu.com/about/release-cycle).
