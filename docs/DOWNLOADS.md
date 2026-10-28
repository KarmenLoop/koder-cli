# Smaller downloads, complete runtime

[Ubuntu 26.04.1 Desktop amd64 tutorial and installer](UBUNTU-26.04.md#2-choose-one-installation-route)

Ubuntu 24.04 users: follow the [complete walkthrough](UBUNTU.md) for installation, desktop operations and troubleshooting.

Koder 0.5.10 chooses a platform archive automatically. A macOS download contains the macOS SolidCraft binary and does not contain Windows Python/MCP or Windows SolidCraft executables. A Linux download excludes those foreign binaries. Linux retains its existing external SolidCraft connection path; this release does not invent a Linux SolidCraft binary. Windows keeps the complete archive and its bundled Windows MCP.

All supported runtime code, provider routes, permissions, cancellation, mail, GitHub, browser/desktop adapters, Skills, active learning resources, OCR, PageIndex and the complete current 1,800-lesson Chinese classroom remain included. Platform packages omit duplicate historical `docs/tutorials` exports; those files remain in repository history, the full archive and earlier release attachments. English remains the original 30-lesson course.

The OCR runtime now keeps one pinned English model and one pinned Simplified Chinese model. Unused npm data-package copies and alternate model variants are removed; engine settings, selected model hashes and licenses are unchanged. Personal Agent Growth 0.4.3 and its 61 core resources remain intact.

## Install with one command

macOS, or Linux with curl:

```bash
curl -fL --retry 3 --connect-timeout 20 https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh -o /tmp/koder-install.sh && bash /tmp/koder-install.sh
```

Ubuntu with wget instead of curl:

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-install.sh https://raw.githubusercontent.com/KarmenLoop/koder-cli/main/install/koder-cli.sh && bash /tmp/koder-install.sh
```

The small bootstrap must download successfully before execution. The installer asks for the existing license consent, selects the correct archive, obtains a compatible managed Node runtime when needed, verifies checksums, and activates the finished installation. It does not install components manually one by one or grant computer/mail permissions. If neither downloader is installed on Ubuntu, run `sudo apt update` and `sudo apt install curl ca-certificates`, then use the curl command. Run Koder itself as your ordinary user.

Existing users can run `koder update`. Old updater versions continue to use the same manifest and installer entry points. New updaters also pin the entire manifest before handing off to the installer.

## Interrupted downloads

The installer retries a failed transfer up to five times by default. It resumes saved bytes when the server accepts HTTP Range. When the server refuses Range, it restarts that file and still checks the full SHA-256. A checksum mismatch cannot activate a package.

Press Ctrl+C to cancel. Partial downloads stay under `~/.koder-cli/cache/downloads`; rerun the same install command to resume. The cache is keyed by the expected checksum, so another version cannot accidentally reuse incompatible bytes. Completed cache files are rechecked before reuse. Each concurrent installer downloads to its own temporary file.

Connection attempts default to 20 seconds and stalled transfers to 60 seconds. These are stall limits, not limits on an actively progressing download. The existing overall download deadline still applies. Optional environment controls: `KODER_DOWNLOAD_RETRIES` (0–20), `KODER_DOWNLOAD_CONNECT_TIMEOUT_SECONDS` (1–600), `KODER_DOWNLOAD_STALL_TIMEOUT_SECONDS` (1–3600), and `KODER_DOWNLOAD_TIMEOUT_SECONDS` (1–100000000). No configuration is required for ordinary installation.

## Complete offline archive

GitHub Releases also retains `koder-cli-0.5.18.tgz`, including all platform payloads and historical tutorial exports. The smaller files are `koder-cli-0.5.18-darwin.tgz` and `koder-cli-0.5.18-linux.tgz`. macOS Intel and Apple Silicon use the same archive; Linux x64 and ARM64 use the same JavaScript/Wasm runtime and select their own Node build. SHA-256 and sizes are in `koder-cli-0.5.18.json`. For the full archive through the installer, use `KODER_INSTALL_FULL_PACKAGE=1 bash /tmp/koder-install.sh`. This is optional.

Download resilience tests use interrupted loopback transfers, Range refusal, corruption, cancellation and a later installer invocation. They do not promise a fixed speed on every Internet connection. Native Windows and physical Ubuntu GNOME checks remain separate beta acceptance.

## Dedicated Ubuntu 24.04 entry

[Ubuntu 24.04 installer](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.18/koder-ubuntu-24.04.sh) · [Complete Ubuntu / Linux runtime](https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.18/koder-cli-0.5.18-linux.tgz). Ubuntu 24.04.x on x64 and ARM64 uses the same entry; Node is selected for the processor.

```bash
wget --tries=3 --timeout=30 -O /tmp/koder-ubuntu-install.sh https://github.com/KarmenLoop/koder-cli/releases/download/cli-0.5.18/koder-ubuntu-24.04.sh && bash /tmp/koder-ubuntu-install.sh
```

This entry is generated from the shared installer. Download recovery, checksums, licensing and permissions use the same implementation. It does not install a reduced kernel.

## Skills and memory

A Skill resource does not start its own process. The kernel selects task methods and reads their text on demand. The local Skill index retains metadata and hashes; reading a body verifies its current bytes again. On-demand loading preserves access to every installed method. MCP services, browsers, OCR and model inference have separate memory costs; download size does not measure those costs.

Private kernel development source is not committed to the public GitHub repository. The licensed installer necessarily includes runtime code. Third-party licenses, provenance and applicable obligations remain unchanged.
