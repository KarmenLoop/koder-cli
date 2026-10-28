# Koder CLI 0.5.16

This release fixes a Windows disk-inspection command that could stop a task with `SHELL_RECONCILIATION_REQUIRED` even after a read-only query completed. It also fixes split-character output, decodes supported Windows console encodings, and adds an official GitHub fallback when the primary update service is unavailable.

## Fixes

- Recognize the restricted `Select-Object` file/directory display expression used in the reported screenshot. Suppressed read errors produce `SHELL_READ_PARTIAL`. Arbitrary script blocks, suppressed writes, timeouts, cancellation and uncertain process cleanup retain their reconciliation rules. Saved unknown receipts are not rewritten.
- Preserve UTF-8 characters across stdout/stderr chunks. On Windows, read the active console code page without changing it; decode supported OEM output and BOM-marked UTF-16. Unknown encodings remain explicitly marked. Missing commands such as `wmic` receive an actionable diagnostic.
- Prefer the existing native computer-care tools for disk and memory inspection. Directory listings are not treated as recursive size measurements.
- Fall back to the official GitHub latest-release manifest and version-pinned installer on network failures. Invalid manifests, checksum failures and explicit custom mirrors do not trigger a different source. Existing consent, hashes, cancellation, version checks and conversation recovery remain effective.
- Report background-update stage, HTTP status or installer exit code. `koder update auto status` shows the last safe error record, without capturing secrets or arbitrary installer output.

## Included work since the public 0.5.14 release

This package includes managed Node/npm website previews, native mail diagnostics, local task telemetry controls and task model selection from the earlier candidate. It also includes computer care and installed-application discovery, task-local authorization prompts and native launch. These use existing tools and Skills; no duplicate framework or automatic permission grant is added.

See [features and tutorials](FEATURES.md), the [complete guide](USER-GUIDE.en.md), [computer care](COMPUTER-CARE.zh.md), and [app use](APP-USE-AND-LEARN.en.md). Windows, macOS and Linux packages include current tutorials and preserve applicable capabilities.

## Upgrade and acceptance

Run `koder update`, then `koder --version`. If an older updater cannot reach its service, use the fixed 0.5.16 GitHub installer in [Installation](INSTALLATION.md). Do not uninstall or delete configuration to upgrade. Review a saved unknown operation before starting a new diagnostic task.

The acceptance attachment records the tests actually run on this version. Windows 10/11 physical disk diagnostics, the dedicated 163 account, Ubuntu desktop behavior and visible notifications still require device/account checks. Previous real-model website exercises are retained as historical evidence, not a new one-shot completion claim. The macOS locked-screen native component remains unsigned and unverified for distribution.

The unpublished 0.5.15 archive remains frozen for audit. This release uses a new tag and new artifacts; it does not overwrite earlier downloads or publish private kernel source to the repository.
