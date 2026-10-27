# Ubuntu 24.04 LTS

Koder CLI uses the same complete runtime archive on Linux, macOS and Windows. Ubuntu does not get a reduced edition. Version 0.5.8 adds a native AT-SPI desktop adapter to the existing computer tool and permission path.

## Compatibility targets

| Environment | Target | Evidence boundary |
| --- | --- | --- |
| Ubuntu 24.04 LTS, including its 24.04.x point releases | x86-64 and ARM64; CLI, server and desktop | The point releases share this runtime path. Each kernel, GPU and installed desktop combination is not individually certified. |
| X11 and Wayland | Accessible application controls via AT-SPI | No X11-only keyboard injector is required. Applications must expose accessible controls. |
| SSH, containers and headless servers | Full CLI task engine | Desktop operations report `COMPUTER_NO_DESKTOP_SESSION`; notifications report `NO_NOTIFICATION_SESSION`. No GUI success is invented. |

The current compatibility scope is Ubuntu 24.04 LTS. Ubuntu 24.10 is outside this release scope. See the [Ubuntu release cycle](https://ubuntu.com/about/release-cycle) for OS maintenance information.

## Install the full runtime

Download `koder-cli.sh` from the [0.5.8 release](https://github.com/KarmenLoop/koder-cli/releases/tag/cli-0.5.8), review it, then run:

```bash
bash koder-cli.sh
koder --version
koder setup
```

The installer uses the same version and SHA-256 manifest as Windows and macOS. It can install its own Node runtime in the user's Koder directory; no global npm or root installation is required. Existing users can run `koder update`. Reinstallation preserves configuration and workspaces. An installation without a model key still provides help, setup and local status commands; model tasks use the configured provider and BYOK credentials.

## Enable accessible desktop operations

On a standard Ubuntu desktop, install any missing distribution dependencies yourself after reviewing the command:

```bash
sudo apt-get install python3-gi gir1.2-atspi-2.0 at-spi2-core libsecret-tools gnome-keyring libnotify-bin
koder doctor --computer
koder permissions request --capability desktop
```

The CLI never executes this apt command automatically. `--yes` does not grant desktop access. Run Koder as the signed-in desktop user, inside that user's desktop session, with the session D-Bus address available. A working accessibility bus is an OS prerequisite, separate from the Koder owner grant. Do not run the CLI as root to work around a locked keyring or missing desktop session.

The Agent can then use:

1. `computer_inspect` to check the real adapter and its limitations.
2. `computer_capture` to list application targets, then capture one exact `targetId` or unique application name.
3. `computer_act` to type into an accessible text field, invoke an exposed button action, select an item, focus a control or scroll.
4. A fresh capture to verify the resulting application state.

Koder binds a snapshot to the target process, its start identity and the current accessible tree. Stale snapshots are rejected. Once an action is dispatched, its snapshot cannot be replayed. Cancellation aborts the owned helper request; an action whose result is uncertain remains `UNKNOWN`. Password fields are omitted from readable text and action targets.

AT-SPI returns an accessibility tree, not a screenshot. Canvas-only interfaces, games, remote-desktop images, custom widgets without accessibility support, login screens and lock screens are not covered by this adapter. Use a covering connected App/MCP or the existing authorized browser channel where available. A browser application is not an automatic browser-driver installation. The CLI reports missing capabilities instead of claiming a click occurred.

## Credentials, mail, background tasks and notifications

Protected mailbox, GitHub and MCP credentials continue to use the existing native Secret Service path (`secret-tool`, a session bus and an unlocked keyring). A server without a usable Secret Service cannot silently fall back to storing these credentials in plaintext. Configure an appropriate session/keyring or use an existing supported process-scoped provider configuration. Never put mailbox authorization codes or GitHub tokens in a prompt.

```bash
koder mail status
koder mcp list
koder apps list
koder permissions status
koder notifications status
koder notifications test task-done
koder activate
koder status
koder deactivate
```

`activate` installs a user-level systemd service. It does not create a root service or enable system-wide lingering. Automatic startup is tied to the supported user session. Existing agentd mail visibility, mailbox grants, quiet hours, daily limits and deduplication still apply. Notification `submitted` means the adapter submitted a notification, not that a person saw it. Without a desktop notification session, the result is explicitly unavailable.

## Features retained

| Area | Ubuntu behavior |
| --- | --- |
| Providers, BYOK, model effort, context and compression | Same provider routing and configuration; provider-specific availability still applies. |
| Coding, writing, website design and preview | Same execution and delivery checks; website design Skill remains automatic for applicable tasks. |
| Long tasks, queue/steer, cancellation, explicit cost budgets | Same task engine. No default tool-step cap is introduced. |
| Roles, subagents, memory and project isolation | Same scope, budget, concurrency and ownership rules. |
| Mail send/read/watch, GitHub and MCP | Same native services, permission checks and effect receipts; external credentials/connectivity are still required. |
| Skills, self-fetch, learning, PageIndex, OCR and CLI integrations | Same catalog and entry points. Platform dependencies and external tools remain explicit. |
| Windows-MCP and macOS locked use | Retained on their respective systems. Ubuntu uses the Linux adapter; these platform-specific binaries are not claimed to run on Linux. |

## Reproducible acceptance

The public `Ubuntu full runtime and accessible desktop` GitHub Actions workflow downloads an exact release, verifies its archive and kernel hashes, tests managed-Node installation and configuration-preserving reinstallation, then operates an owned GTK application through the real Python/AT-SPI transport. Its matrix covers x64/ARM64 and X11/Wayland on Ubuntu 24.04 runners. It also checks a notification submission and the explicit headless-unavailable result. It does not use a real mailbox, cloud model account or user application.

Source tests run on macOS with injected Linux backends; those are contract checks, not Ubuntu GUI acceptance. See the exact workflow run and its `runtime.json`/`desktop.json` artifacts for actual results. A cell without a runtime receipt is `NOT_RUN`; a recorded failing run remains `FAIL` even after a later build passes. The first 0.5.8 draft exposed a GI text-interface name collision that hid editable controls. The corrected adapter uses interface-qualified text calls; a regression preserves empty inputs, readable labels and protected-password handling. Check the archive SHA-256 in each later run to identify the tested build. Headless Weston/Xvfb results do not establish a physical GNOME session, screen appearance, reboot/login startup, all Ubuntu flavors or all application controls. Those remain separate device acceptance items. An unavailable cell must not be summarized as a full-platform pass.
