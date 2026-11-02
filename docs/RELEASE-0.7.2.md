# Koder CLI 0.7.2

[English](RELEASE-0.7.2.md) · [简体中文](RELEASE-0.7.2.zh.md)

Web Data now extracts XPath values, can recover changed CSS/XPath selectors using saved structural fingerprints, and renders dynamic pages with the managed Playwright runtime. Browser requests retain the crawler's origin, robots, network-permission and byte limits. Extraction saves records, source evidence and hashes; ambiguous or missing matches remain partial rather than fabricated successes.

Use `koder web-data test --json` to check bundled Python/Scrapling. Prepare browser rendering with `koder skills runtime playwright install` and `koder skills runtime playwright browser`, then grant network and browser access through the existing permissions flow. Interactive navigation, snapshots, clicking, filling, keyboard input, frames, tabs, screenshots, PDF, file upload/download and storage remain available through the existing browser-work and Playwright launcher. See [Web Data](WEB-DATA.md) and [managed runtimes](TOOL-RUNTIMES.en.md).

Adaptive recovery uses the original extraction contract and a verified saved job from the same origin. It does not identify arbitrary redesigns with certainty. Dynamic collection uses an isolated browser and imports no personal login profile; interactive browser authorization remains separate. This is a Koder integration, not compatibility with every Scrapling Python API or every browser-specific feature.

The release also includes managed FFmpeg/ffprobe, Playwright, EARSHOT and CodeGraph setup and diagnostics; native Headroom context handling; and task coordination improvements. Stable subtask request IDs avoid duplicate workers, supplementary instructions reach the existing worker, result events wake the parent, and child file receipts reach the parent delivery check. Runtime preparation verifies pinned assets; external audio models and unavailable native components still require their documented setup.

All existing capabilities, unique Skill registrations, platform resources, cancellation, cost budgets, approvals and third-party notices are retained. The private kernel is not published as a source repository. Packages and updates use the [official CLI download site](https://kodermodule.com/en/cli-download.html).

The release acceptance receipt distinguishes actual macOS browser/runtime checks from native Windows/Ubuntu, production human sign-in, live mailbox and notification checks that remain NOT_RUN. Real-model smoke tests are not a benchmark score or a claim that all websites work.

## Release checks and remaining limits

The release records verify all 32 original public files against their published sizes and SHA-256 checksums (1,111,582,280 bytes in total), plus 286 current guides and 10 bilingual site pages. Both an older 0.7.1 updater and the current package checked the default feed successfully without installing an update.

The records list 348 runtime regression checks and a 19-case macOS browser interaction matrix separately. They also include one bounded MiniMax-M3 task with 8 model requests, 9 tool calls and a CSV written and read back. This smoke test does not establish long-task quality or benchmark performance.

Three full-file downloads timed out on the original Mac. Those same files later passed full size and hash verification on an independent H3C machine. The Mac failures remain recorded; recovery of that Mac's network path has not been established. An initial browser-close hang and a build-script check in a package that intentionally excludes build tooling also remain in the release history.

Native Windows and Ubuntu installation/GUI, production human sign-in, real mail and OS notifications, hour-scale autonomy, and the full Firefox/WebKit matrix remain **NOT_RUN**. These records do not certify every Scrapling API or every website. Earlier quality failures in the [verification record](AGENT-VERIFICATION.zh.md) are not converted to passes by this release.

[Worker coordination](SUPER-AGENT-ARCHITECTURE.en.md) · [Current screenshots](screenshots/README.md)
