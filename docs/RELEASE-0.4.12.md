# Koder CLI 0.4.12

## What changed

- Move saved projects and recognizable local conversations with `koder migrate`, also available in Setup and as `/migrate`. Export a passphrase-encrypted archive, import it into a separate destination profile, or send it over an already configured SSH connection. The source stays intact; target credentials and computer permissions require setup on the new device.
- Learn through a 180-lesson Chinese classroom with 12 units, step-by-step and developer tracks, practical examples, assignments, quizzes and local notes. The original 30 English lessons remain available. New lessons 31–180 are in Chinese.
- Fix a fast-paste race in the masked secret prompt: terminal echo is disabled before the authorization-code or passphrase prompt appears.

The release also carries forward the candidate fixes for case-insensitive GitHub owner/repository matching during reconciliation and compact Skill metadata in small context windows. Existing GitHub integration, mail, MCP, Skills, provider routes, independent sessions, interactive input, cancellation and permission checks remain in the package. Migration does not transfer running processes, replay pending operations, or grant destination permissions.

## Install or update

Windows CMD and PowerShell and macOS use the same versioned CLI runtime through their platform installers. Use the [official download page](https://karmenloop.com/download.html#cli), or run `koder update`, then confirm `koder --version` reports **0.4.12**. This release updates the CLI; desktop application versions are separate.

[Migration guide](DEVICE-MIGRATION.en.md) · [Chinese classroom](courses/index.zh.html) · [Complete guide](USER-GUIDE.en.md) · [GitHub setup](GITHUB-PROJECTS.en.md)

## Evidence and remaining limits

The migration candidate passed 56 distinct targeted no-key checks, including a real macOS PTY export and the actual receiver subprocess. The classroom candidate passed 20 curriculum/configuration checks, eight DOM-simulation checks and six teaching-lab checks. Release package and publication checks are recorded separately; these counts are not a full-product certification.

Real Windows 10/11, PowerShell 5.1 cold startup, ConPTY/IME, Windows-MCP GUI, live Windows-to-macOS migration, real SSH transfer and target account reconnection remain NOT_RUN. The SSH test uses a controlled transport adapter. Classroom DOM checks do not establish real-browser visual or accessibility acceptance. Previous workflow failures and platform HOLD records are retained. The unsigned macOS locked-use prototype is not included.

Migration limits include 20,000 files, 64 MiB per file, 128 MiB of content and a 200 MiB encrypted archive. Dependencies, Git history, protected credentials, browser sessions, pending jobs and native-key-encrypted personal stores are excluded. Inspect the migration report and keep the source device until target verification is complete. Imported custom Skills remain disabled for review.
