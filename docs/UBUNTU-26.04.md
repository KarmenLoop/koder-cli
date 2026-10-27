# Ubuntu 26.04.1 Desktop amd64: installation and first tasks

[Repository home](../README.md) · [中文手把手教程](UBUNTU-26.04.zh.md) · [Download 0.5.14](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.14)

This guide covers **Koder CLI 0.5.14** on **Ubuntu 26.04.1 LTS Desktop amd64**. AMD64 is x86_64, including Intel and AMD 64-bit PCs; it is not ARM64. The same Linux archive retains coding, writing, mail, GitHub, MCP, Skills, learning and the current classroom. Ubuntu uses the existing AT-SPI desktop adapter. Windows-MCP and macOS locked-use remain platform-specific. Keep using the [24.04 guide](UBUNTU.md) on that release.

Ubuntu 26.04 GNOME uses **Wayland**. Do not look for an “Ubuntu on Xorg” session or disable Wayland to follow this guide. The [Ubuntu ISO](https://releases.ubuntu.com/26.04/) installs the operating system; Koder’s shell installer installs the application. An existing Ubuntu installation does not need to be formatted or reinstalled.

## Already installed but unable to open Koder?

If installation finished, do not download it again just to fix PATH. In the Ubuntu shell (`user@computer:~$`), run:

```bash
"$HOME/.local/bin/koder" --version
"$HOME/.local/bin/koder"
```

For first-time model configuration, run `"$HOME/.local/bin/koder" setup`, save, then launch Koder separately. Use the actual path printed by the installer if you chose a custom directory.

| Prompt or output | Meaning | What to do |
| --- | --- | --- |
| `accept / decline:` | License consent | Read the license and enter `accept` only if you agree. |
| Provider/model/key menu | Setup | Configure and save. This is not the task input. |
| `activate` offer | Optional background service | Press Enter to skip, or enter `activate` to enable it. Both choices retain foreground chat. |
| `taskDone` / `service` JSON | Older activation/status output | Check `running`; it is not chat. Start Koder separately. |
| `user@computer:~$` | System shell | Run `koder` or its full path. |
| `koder >` | Koder chat | Enter your task in ordinary language. |

Installation, model setup, background activation and opening chat are separate steps. Background activation does not open a chat window.

## 1. Open a terminal and check the system

On Ubuntu Desktop, press Ctrl+Alt+T. Paste with Ctrl+Shift+V. Copy the command, not a shell prompt or the code-fence markers.

```bash
cat /etc/os-release
uname -m
```

Expect Ubuntu with `VERSION_ID="26.04"`, `26.04.1 LTS` in `PRETTY_NAME`, and `x86_64`. For other systems, use [Installation](INSTALLATION.md). Run Koder as your regular user. Only the distribution dependency commands below use sudo.

## 2. Choose one installation route

Check the available downloader:

```bash
command -v wget
command -v curl
```

**With wget:**

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-ubuntu-install.sh https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/koder-ubuntu-26.04.sh && bash /tmp/koder-ubuntu-install.sh
```

**With curl:**

```bash
curl -fL --retry 3 --connect-timeout 20 https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/koder-ubuntu-26.04.sh -o /tmp/koder-ubuntu-install.sh && bash /tmp/koder-ubuntu-install.sh
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

The 0.5.14 Linux archive is about **about 150 MB**. A first installation may also download Node, and extracted files need additional disk space. This archive size is not a total-download or speed guarantee.

If a transfer is interrupted, rerun the same installation command. Resumable data is kept under `~/.koder-cli/cache/downloads`; SHA-256 verification remains required. Do not combine partial files manually.

You can use the full path above immediately. To use the short command, open a **new terminal**, then run:

```bash
koder --version
koder --help
```

Expect `koder 0.5.14`. If the command is not found, adjust this terminal's PATH:

```bash
export PATH="$HOME/.local/bin:$PATH"
hash -r
koder --version
```

The installer runs as a child process and cannot change the PATH of the already-open parent shell. Version 0.5.14 updates Bash startup files, including fresh profiles, and eligible zsh files while retaining their existing contents. `--no-modify-path` leaves these files unchanged. The installer ends with the exact executable path, the setup command and a current-shell PATH command. If an older copy starts, inspect `type -a koder` before changing anything. Do not delete `~/.koder-cli` to fix PATH.

### Read activation status correctly

`activated` is the saved service preference; `running` reports whether the daemon is reachable now. `service: "systemd-user"` identifies the user service. Missing calendar or browser-history sources do not prevent chat. `notificationClickSupported: false` or `TASK_PROTOCOL_PLATFORM_UNSUPPORTED` means notification click-to-resume is unavailable, not that the CLI is unusable. Start chat from the terminal. `displayVerified: false` does not prove that a notification was seen.

### Apple archive warnings in older packages

Older macOS-built archives included `LIBARCHIVE.xattr.com.apple.provenance` metadata. GNU tar may warn repeatedly while still extracting the program successfully. Check the final installer status and executable version. Version 0.5.14 excludes these Apple attributes at packaging time; it retains program and Skill files. Actual checksum errors, unexpected EOF or disk-space failures must still be fixed.

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

After setup exits, run `koder` (or the full path). Wait for `koder >`, then ask for a short reply before starting a file task. At an idle chat prompt, `/exit` returns to the system shell.

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

On Ubuntu 26.04.1 GNOME, expect a Wayland user session. A DISPLAY value can coexist with WAYLAND_DISPLAY for XWayland clients. It does not mean the session is X11. Run Koder in your logged-in desktop terminal; SSH environment variables alone cannot create desktop access. Keep the system Python and GI packages managed by apt, not pip. The driver uses `/usr/bin/python3`, independently of the installer-managed Node runtime.

Run inside the signed-in user's desktop terminal:

```bash
printf 'session=%s\nDISPLAY=%s\nWAYLAND_DISPLAY=%s\n' "$XDG_SESSION_TYPE" "$DISPLAY" "$WAYLAND_DISPLAY"
test -n "$DBUS_SESSION_BUS_ADDRESS" && echo "Session D-Bus is set"
```

Use the default Wayland session on Ubuntu 26.04.1; both display variables need not be present. Manually inventing a DISPLAY or D-Bus value does not create a session.

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

The adapter can click, type, focus, select and scroll through exposed accessible controls. Its capture is an **accessibility tree, not a pixel screenshot**. Declared password fields and masked editable values are omitted. An application can mislabel sensitive fields; keep login entry under your control. Stale snapshots cannot be replayed; uncertain actions retain `UNKNOWN` and require observation before another attempt.

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
| Task keeps waiting | Verify 0.5.14, watch the ten-second wait feedback, then check the selected provider. |
| `API_HEADERS_TIMEOUT` | The provider may still be generating; avoid submitting duplicate work. |
| Keyring unavailable | Check secret-tool, the session bus and keyring unlock; do not use root. |
| `COMPUTER_NO_DESKTOP_SESSION` | Use the signed-in desktop terminal or continue with CLI file tasks. |
| Missing AT-SPI / desktop | Check dependencies, sign-in session, doctor output and the app's accessibility support. |
| `EACCES` / `EPERM` | Check the actual file owner, path and grant; broad scope does not override OS permissions. |
| Reconciliation required / `UNKNOWN` | Inspect the previous effect and receipt before attempting it again. |
| Mail `STORAGE_BUSY` | Inspect mail and monitor status; do not delete credential stores or locks. |
| Notification submitted but unseen | Check notification center, Do Not Disturb and app settings. |

Task response headers have a default **180-second** deadline in 0.5.14. Response-body idle limits, total request limits, shell deadlines, download limits and quick model diagnostics are separate. For a confirmed slow provider, set this before starting Koder:

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
sha256sum koder-cli-0.5.14-linux.tgz
grep 'koder-cli-0.5.14-linux.tgz' SHA256SUMS
```

The digests must match. The `.tgz` is not a `.deb` or double-click installer. Normal installations use the script above.

## 12. Evidence and further reading

Use the release's [ACCEPTANCE-RESULTS.json](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/ACCEPTANCE-RESULTS.json) for the exact package hash and platform results. Installation, PATH recovery, archive metadata, slow-response PTY, desktop controls and notifications are checked separately.

The [0.5.12 task run](https://github.com/KarmenLoop/koder-cli/actions/runs/40555216774) and [0.5.12 desktop matrix](https://github.com/KarmenLoop/koder-cli/actions/runs/40555225654) are historical baselines. All four desktop jobs passed after retrying an x64 Wayland dependency-download timeout; the initial failure is retained. These results do not certify the 0.5.14 package.

Xvfb/headless Sway do not certify physical GNOME, reboot behavior, every GPU or every app. Earlier 0.5.8 GI text-interface failures remain recorded; the fix uses interface-qualified calls with empty-input, label and password regressions. Compare package hashes when reviewing runs.

Continue with [Start here](START-HERE.en.md), [the English course](courses/README.en.md), [the 1,800-lesson Chinese classroom](courses/README.zh.md), [the user guide](USER-GUIDE.en.md) or [download recovery](DOWNLOADS.md). GitHub does not execute classroom HTML in a file view; use `koder learn` or the classroom's local-opening instructions.

OS references: [Ubuntu Desktop documentation](https://documentation.ubuntu.com/desktop/) and [Ubuntu release cycle](https://ubuntu.com/about/release-cycle).

## First-use checklist

1. Install and either skip or explicitly enable the background service.
2. Start the full executable path and verify the version; fix PATH only if needed.
3. Save model configuration, test it and open chat separately.
4. Create a file in an isolated project, then read it in another terminal.
5. Complete a website, answer the requirements questions and open the actual preview URL.
6. Test steering, queueing and cancellation without repeating completed effects.
7. Enable desktop, mail or GitHub access only for the feature you want to test. Verify each result independently.
8. Exit with `/exit`, reopen the same project and check that files and settings remain.

Release-specific proof is in [ACCEPTANCE-RESULTS.json](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.14/ACCEPTANCE-RESULTS.json), keyed by archive hash. The linked 0.5.12 runs are historical comparisons, not 0.5.14 verification. The initial 0.5.12 x64 Wayland dependency timeout was retained; its rerun passed. Physical desktop sessions, reboots and real accounts need their own evidence.

## Ubuntu 26.04.1 verification and upgrade checklist

The [26.04.1 workflow](https://github.com/KarmenLoop/koder-cli/actions/workflows/ubuntu-26.yml) checks the guest OS and x86_64 architecture, installation, managed Node, PATH, reinstallation, task submission/cancellation, Wayland accessibility and notification dispatch against a checksum-verified release archive. Read the release acceptance attachment for the actual run status. A headless Sway test does not certify physical GNOME 50, graphics hardware, login/reboot persistence or every application.

After an OS upgrade, check the version and launch Koder using its full path first. Update Koder without deleting its profile. Recheck the model connection, desktop driver, keyring and permissions separately. Save and read back a practice file, type into an empty editor, and submit a test notification. Verify mail and GitHub against authorized test targets when needed. Record actual results and remaining checks; a successful binding or tool listing does not certify a complete workflow.

See the [official Ubuntu 26.04 LTS desktop changes](https://documentation.ubuntu.com/release-notes/26.04/summary-for-lts-users/). The [complete Chinese classroom](UBUNTU-26.04.zh.md) includes a detailed beta-test recording template.

## Private credential input

Version 0.5.14 supports hidden credential input, existing account bindings, Ubuntu private login filling and native sudo prompts. See [Credentials and private login input](CREDENTIALS.md) for the workflow and platform limits.
