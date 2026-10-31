# Koder CLI 0.6.3

Version 0.6.3 fixes a resident-session collision that could reject the first message with `MEMORY_BUSY`, even when the account was authenticated. Default windows now receive separate sessions when an older foreground task owns the default one. Updated clients also handle this rejected session-open request while an older resident host finishes its work. Explicit session ownership, saved history, cancellation and budgets remain unchanged.

Account status is visible in chat and Setup. A valid refresh grant is distinguished from an expired short-lived access token. The browser option opens the official device-authorization page and reuses a web login when the account service permits it; device confirmation remains required. Plain account status is readable, with `--json` available for scripts.

This package also includes command lessons and topic selection, local self-checks and redacted diagnostic queues from the current source. Cloud error and feedback delivery is not activated: the production support service remains unconfigured and reports `DIAGNOSTICS_SERVICE_NOT_READY`. It does not upload raw conversations, credentials or project files.

Update with `koder update`, then open a new Koder window. Installation packages and current guides are on the [official CLI website](https://kodermodule.com/cli-download.html). GitHub carries documentation, not new binary releases. Kernel development source remains private; all third-party notices retain their scope.

Release verification: the release receipts record 131/131 source regressions and 145/145 actual-package regressions, with overlapping coverage kept separate. The isolated installation used exact release bytes on an owned loopback mirror and an existing compatible Node runtime. macOS ARM64 smoke checks record 10/10. This documentation task verified the receipt hashes and the packaged document bytes; it did not rerun those product tests. Official website activation and the live stable feed are verified. Complete public-download verification remains pending the release owner's final receipt. Human browser/QR login, native credential storage on each target platform, Windows/Ubuntu native GUI and terminal checks, real mail, notification visibility and model-quality re-evaluation remain separate acceptance items.

See [account login](ACCOUNT-LOGIN.md), [self-checks and error reports](DIAGNOSTICS.en.md) and [command lessons](COMMAND-LEARNING.en.md).

[English](RELEASE-0.6.3.md) · [简体中文](RELEASE-0.6.3.zh.md)

## Publication and verification

The official website now serves 0.6.3. The stable manifest SHA-256 is `9a685ae2c1a5b3e0845b6d23879ca8e0702f47570bd450f21fb6fb54bee49734`. Server-side verification retained all 32 frozen release files and their hashes. Normal public checks verified the manifest, installer hashes, three archives' HEAD/Range/If-Range behavior and the installation-guide entry points. The first verifier request used an incorrect Ubuntu filename; that 404 is retained as a verifier route error, and only the two remaining guide requests were corrected.

The frozen macOS 0.6.3 check-only updater exited 0 and reported up to date. The previous 0.6.2 package also exited 0 and reported 0.6.2 → 0.6.3 through the default official feed, without source, fixed-IP or fallback overrides. These check-only runs did not install an update.

The full 32-file public-download SHA-256 result and final website-case summary are still awaiting the release owner's receipt. Server-side hashes, partial archive requests and successful update metadata do not establish complete public downloads. The [release acceptance record](https://kodermodule.com/releases/cli-0.6.3/ACCEPTANCE-RESULTS.json) keeps product checks and NOT_RUN boundaries separate. Cloud reporting remains unconfigured (`DIAGNOSTICS_SERVICE_NOT_READY`).
