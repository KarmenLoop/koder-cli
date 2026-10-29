# Koder CLI screenshots

[English](README.md) · [简体中文](README.zh-CN.md)

The current set shows **0.5.21**, captured on October 30, 2026 from the published macOS package. The package checksum matches the official website manifest. [Capture record and image checksums](capture-0.5.21.json).

| Screen | English | 简体中文 |
| --- | --- | --- |
| Startup banner | [English image](cli-start-0.5.21-en-dark.jpg) | [中文图片](cli-start-0.5.21-zh-dark.jpg) |
| Setup menu | [English image](cli-setup-0.5.21-en-dark.jpg) | [中文图片](cli-setup-0.5.21-zh-dark.jpg) |
| First lesson | [English image](cli-learn-0.5.21-en-dark.jpg) | [中文图片](cli-learn-0.5.21-zh-dark.jpg) |

## How these were captured

The CLI ran in an isolated macOS PTY at 100 columns by 32 rows, with separate English and Chinese profiles and no provider keys. Its unchanged ANSI output was parsed by `@xterm/headless` 5.5.0, then rendered at 17 px in Menlo and saved as JPEG. These are terminal-output renders; font metrics and wrapping can differ in your terminal.

The startup image uses `koder banner --no-anim --lang en` (or `zh`) to capture the settled banner. Setup uses `koder setup --lang en`; its menu was captured before choosing a provider, then the capture process was stopped. The classroom uses `koder learn 1 --os mac --lang en` and was cancelled at the operating-system choice. The JSON record preserves each command and process exit status, including the forced stop after Setup was captured.

The pictures show those three screens only. They do not establish a clean installation, completed model setup, model task, approval flow, or animation behavior. No API key, account sign-in, or new license acceptance was used for this capture.

## Earlier images

The seven older image files remain in this folder for historical links. They are not part of the 0.5.21 gallery. Current README pages use only the versioned images above; older installer, diff, review, and TUI illustrations have been removed from the current walkthrough.
