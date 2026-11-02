# Koder CLI screenshots

[English](README.md) · [简体中文](README.zh-CN.md)

These **0.7.2** images were captured on November 2, 2026 from the published macOS package. The archive's SHA-256 matches the official website feed, and all 200 package files observed during capture match that archive. [Commands, exit statuses and image checksums](capture-0.7.2.json).

| Screen | English | 简体中文 |
| --- | --- | --- |
| Startup | [English image](cli-start-0.7.2-en-dark.jpg) | [中文图片](cli-start-0.7.2-zh-dark.jpg) |
| Setup | [English image](cli-setup-0.7.2-en-dark.jpg) | [中文图片](cli-setup-0.7.2-zh-dark.jpg) |
| First lesson | [English image](cli-learn-0.7.2-en-dark.jpg) | [中文图片](cli-learn-0.7.2-zh-dark.jpg) |

## Capture method

The unchanged CLI ran in a 100-column, 32-row isolated macOS PTY, with separate English and Chinese profiles and no provider keys or account session. Its ANSI output was parsed by `@xterm/headless` 5.5.0 and rendered in Menlo at 17 px. These are terminal-output renders; fonts, spacing and wrapping can differ in your terminal.

Startup uses `koder banner --no-anim --lang en` (or `zh`) to show the settled banner. Setup uses `koder setup --lang en` and stops at the main menu. Lesson 1 uses `koder learn 1 --os mac --lang en` and stops at the operating-system choice. Setup's capture processes required forced termination after the pictures were taken; the record retains exit `-9`. The lesson processes exited after cancellation. No new license acceptance was performed.

The pictures do not demonstrate completed installation, provider configuration, account sign-in, a model task, approval behavior or animation. Native Windows and Linux are outside this capture.

## Historical images

The [0.5.21 capture record](capture-0.5.21.json) and older assets remain available for historical links. The repository's current README gallery uses the versioned 0.7.2 images above.
