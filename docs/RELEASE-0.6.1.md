# Koder CLI 0.6.1

0.6.1 brings the changes since 0.5.21 into one runtime for Windows, macOS and Linux. Packages and managed updates use the [official CLI website](https://kodermodule.com/cli-download.html). Existing configuration, conversations, permissions and learning controls are retained.

## Changes

- **Long tasks:** save goals, acceptance criteria and plans; continue a scoped unfinished plan after a premature summary. Retrieve original session history after compaction. Cancellation, optional cost budgets and unresolved-effect protection remain active.
- **Command waits:** new shell approvals default to 30,000 seconds. Setup controls the value; model-supplied short hints cannot silently shorten it. Existing approvals retain their original values. Persistent website servers use the managed preview service.
- **Interface composition:** describe changes to Koder's own colors, border, density, Todo and status slots. The Agent can propose, preview, apply or roll back supported settings and editable task templates. This API cannot rewrite the kernel or change permissions and budgets.
- **Website delivery:** stronger briefs and layout comparisons, staged tool discovery for small context windows, source audits and artifact evidence. Documentation-only handoffs no longer require unrelated application changes. A design map is not a substitute for a website or a working preview.
- **Tool reliability:** validate tool arguments, preserve error details and recorded file outcomes, and distinguish a failed write from an unconfirmed external effect. Unknown side effects are not automatically replayed.
- **Mail:** retain completed inbox work when logout cleanup times out, retry queued reminders and keep authentication, send configuration and background health separate. This is not a claim that every mail provider has passed end-to-end tests.
- **Devices, audio and security:** permission-scoped USB/serial discovery and driver diagnosis, native WAV measurements, an optional pinned EARSHOT connection and scoped security reviews. An inventory entry does not grant control of every device or install missing drivers.
- **Distribution:** new installers and update checks use the official website. The retained GitHub channel ends at 0.5.21 and is only for legacy compatibility; it cannot prove that an installed version is current.

## Use the new controls

Run `koder --version` after upgrading; it must print `koder 0.6.1`. Then use `koder`, `koder setup`, `koder interface status`, `koder context status`, or `koder mail doctor --json`. Background activation remains optional. Do not delete the data directory to upgrade.

[Goals and plans](GOALS-AND-PLANS.zh.md) · [Command waits](COMMAND-DURATION.md) · [Context controls](CONTEXT-CONTROLS.en.md) · [Interface and design walkthrough](INTERFACE-COMPOSITION.zh.md) · [Devices, audio and security](DEVICES-AUDIO-SECURITY.zh.md) · [Mail recovery](MAIL-RECOVERY.en.md) · [Full user guide](USER-GUIDE.en.md)

## Evidence and limits

The release's `ACCEPTANCE-RESULTS.json` records checks against the exact package bytes. Before packaging, the interface/design integration suite passed 181 checks. A real MiniMax-M3 task applied interface settings successfully. An independently inspected three-page generated website passed 17 local Chromium checks on desktop and mobile viewport sizes.

The same website exercise did **not** pass autonomous closeout: the model compared an HTTP request count with a test-case count, and the artifact verifier rejected that assertion. The original failures remain recorded. These results are not a MiniMax-M3.1-Flash ten-question or SELECTED-50 score. The earlier quality targets remain unmet, and this release does not promise perfect websites or error-free model behavior.

Windows physical tests, Ubuntu native GUI tests, real 163 send/receive/reminder acceptance and visible OS notifications remain separate beta checks. macOS locked-screen operation remains an unsigned candidate. EARSHOT model execution and every third-party device are not covered by the local tests. Source audits, notification submission and local HTTP previews do not establish visual quality, notification visibility or public deployment.

If a task fails, use `/error copy` or `koder logs report --json` and include the version and reproduction steps. Keep passwords, authorization codes and API keys out of reports. Local telemetry can be disabled in Setup; this release does not add cloud log upload.
