# Koder CLI screenshots

[English](README.md) · [简体中文](README.zh-CN.md)

These **0.8.4** images were captured on November 3, 2026 from the published macOS package. The archive matches the frozen release record and the producer’s verified public download. All 202 package files observed during capture match that archive. [Commands, exit statuses and image checksums](capture-0.8.4.json).

| Screen | English | 简体中文 |
| --- | --- | --- |
| Startup | [English image](cli-start-0.8.4-en-dark.jpg) | [中文图片](cli-start-0.8.4-zh-dark.jpg) |
| Setup | [English image](cli-setup-0.8.4-en-dark.jpg) | [中文图片](cli-setup-0.8.4-zh-dark.jpg) |
| First lesson | [English image](cli-learn-0.8.4-en-dark.jpg) | [中文图片](cli-learn-0.8.4-zh-dark.jpg) |

## How these were captured

The unchanged CLI ran in a 100-column, 32-row macOS PTY, with separate English and Chinese profiles and no provider keys or account session. Its ANSI output was parsed by `@xterm/headless` 5.5.0 and rendered in Menlo at 17 px. These are terminal-output renders; your terminal may use different fonts, spacing and wrapping.

Startup uses `koder banner --no-anim --lang en` (or `zh`) to show the settled banner. Setup uses `koder setup --lang en` and stops at the main menu. Lesson 1 uses `koder learn 1 --os mac --lang en` and stops at the operating-system choice. After capture, the Setup processes needed forced termination; their exit status remains `-9` in the record. The lesson processes exited after cancellation. An existing acceptance record for the unchanged license was reused; no new agreement was accepted.

These pictures show the three screens above. They do not verify installation, provider configuration, sign-in, a completed model task, approval behavior or animation. Native Windows and Linux were not captured.

## Earlier versions

The [0.7.2 capture record](capture-0.7.2.json), [0.5.21 capture record](capture-0.5.21.json) and their images remain available for historical links. The current README gallery uses 0.8.4.
