# Koder architecture and component provenance

[English](ARCHITECTURE-AND-PROVENANCE.en.md) · [简体中文](ARCHITECTURE-AND-PROVENANCE.zh.md)

Koder owns the task runtime that connects user intent, goals and plans, model requests, permission checks, tools, saved results and delivery verification. It is maintained as one private kernel; this release does not publish the kernel development repository.

| Layer | Koder implementation | External components or references |
| --- | --- | --- |
| Task coordination | Stable child requests, follow-up delivery, result wakeups and parent artifact checks in the existing runtime | Router–Worker research, including DeepSeek's dsh-superagent-prototype, informed the design; no upstream executor was substituted |
| Context management | Budget projection, tool-result codecs, protected receipts and retrieval in the Koder execution path | Headroom is an attributed architecture reference; its upstream service is not a required proxy |
| Web Data | Permission/origin checks, structural anchors, recovery thresholds, saved jobs and evidence | Python, Scrapling and Playwright provide parser and browser capabilities under their licenses |
| Managed runtimes | Pinned assets, installation locations, diagnostics and tool routing | FFmpeg, ffprobe, Playwright, EARSHOT, CodeGraph and platform dependencies retain their own ownership |
| Skills and resources | Catalog, adaptation, configuration and invocation through the same harness | Bundled or user-installed third-party Skills retain their authors and licenses |

The open-source work named here is not represented as wholly Koder-authored. Studying a design, writing native orchestration and distributing an open-source dependency are distinct activities. See [credits](../OPEN_SOURCE_CREDITS.md), [third-party notices](../THIRD_PARTY_NOTICES.md) and [component inventory](../THIRD_PARTY_COMPONENTS.json) for shipped attribution. Specific resources keep their accompanying licenses.

The boundary remains the same: installing a component grants no computer permissions, and reading a Skill does not prove its tools ran. Saved results, file hashes and per-platform acceptance records establish what actually completed.
