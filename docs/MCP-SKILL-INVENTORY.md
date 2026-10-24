# MCP and Skill inventory — 0.4.6

This audit covers the shipped catalog and protocol adapters. It does not inspect or certify private user-configured accounts or servers. Results are from an isolated macOS environment. A readable instruction is not a successful application operation.

72 catalog entries: 68 readable, 2 intentionally disabled interface notes, and 2 reference-only entries excluded from redistribution. External runtime acceptance remains separate.

| Skill ID | Source | Content check | External prerequisite / limit |
| --- | --- | --- | --- |
| builtin:整理真实材料 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:加页面 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:改错位 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:做表单 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:接口页面 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:先写测试 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:解释代码 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:改名搬文件 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:命令行 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:发布前 | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:guide-website | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:guide-application | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:guide-desktop | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:guide-app | bundled | PASS | Tool, account and GUI execution checked separately |
| builtin:universal-app-use | bundled | PASS | Tool, account and GUI execution checked separately |
| ecosystem:open-code-review:open-code-review | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:continuous-learning-v2 | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:eval-harness | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:security-review | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:strategic-compact | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:tdd-workflow | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ecc:verification-loop | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:i-have-adhd:i-have-adhd | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:humanizer:humanizer | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:brainstorming | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:diagnosing-superpowers | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:dispatching-parallel-agents | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:executing-plans | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:finishing-a-development-branch | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:receiving-code-review | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:requesting-code-review | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:subagent-driven-development | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:systematic-debugging | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:test-driven-development | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:using-git-worktrees | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:using-superpowers | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:verification-before-completion | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:writing-plans | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:superpowers:writing-skills | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:algorithmic-art | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:frontend-design | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:internal-comms | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:mcp-builder | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:skill-creator | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:theme-factory | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:skills:webapp-testing | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:ui-ux-pro-max-skill:ui-ux-pro-max | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:caveman:caveman-compress | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:caveman:caveman | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:caveman:verify-and-stop | ecosystem | PASS | Tool, account and GUI execution checked separately |
| koder-computer:local-files | ecosystem | PASS | Tool, account and GUI execution checked separately |
| koder-computer:browser-work | ecosystem | PASS | Tool, account and GUI execution checked separately |
| koder-computer:channel-file-delivery | ecosystem | PASS | Tool, account and GUI execution checked separately |
| koder-computer:skill-maintenance | ecosystem | PASS | Tool, account and GUI execution checked separately |
| builtin:koder-shared-memory | ecosystem | DISABLED_POLICY | Intentionally unavailable; retained interface note, not an enabled skill. |
| builtin:user-behavior-personalization | ecosystem | DISABLED_POLICY | Intentionally unavailable; retained interface note, not an enabled skill. |
| builtin:development-workflow | ecosystem | PASS | Tool, account and GUI execution checked separately |
| builtin:personal-agent-growth | ecosystem | PASS | Tool, account and GUI execution checked separately |
| ecosystem:agent-browser:core | ecosystem | PASS | Tool, account and GUI execution checked separately |
| builtin:headroom | ecosystem | PASS | Tool, account and GUI execution checked separately |
| bundled:video-shotcraft | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:xilo-opus-video | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:lemo-opuscar | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:mg-styles-15 | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:huashu-art-motion | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:dashi-animationstyle | bundled-source | PASS | Missing on audit host: ffmpeg |
| bundled:playwright-cli | bundled-source | PASS | Missing on audit host: playwright |
| bundled:cli-anything | bundled-source | PASS | Prerequisite discovery passed; target workflow NOT_RUN |
| bundled:jianying-editor | bundled-source | PASS | Missing on audit host: ffprobe |
| bundled:koder-media-workflow | bundled-source | PASS | Prerequisite discovery passed; target workflow NOT_RUN |
| reference:wtt-code-animation-studio | reference-only | EXCLUDED_LICENSE | Reference only; not redistributed or executable. |
| reference:x-article-auto-publisher | reference-only | EXCLUDED_LICENSE | Reference only; not redistributed or executable. |

## MCP adapters and presets

| Component | Included | Verification |
| --- | --- | --- |
| stdio | Pinned SDK | Actual local child initialize/list/call/close; packaged continuation and receipt checks |
| Streamable HTTP | Pinned SDK | Local HTTP server protocol and packaged calls |
| Legacy HTTP+SSE | Explicit `--transport sse` | Actual SDK server initialize/list/call/close; no operation replay fallback |
| Windows-MCP 0.8.8 | Windows x64 private Python 3.14.8 and dependencies | Bundle integrity and integration checks; Windows 10/11 GUI NOT_RUN |
| CodeGraphContext 0.6.13 | Preset; external launcher required | Workspace/8K-context fixture; actual upstream process NOT_RUN |
| npm 10.9.8 | Private pinned installer and 196 components | Registry SRI, packaged version, local package install; lifecycle scripts remain disabled |

External video/rendering prerequisites are not automatically installed. Run `koder skills doctor <name>` on the target machine. Windows-MCP cannot operate a macOS desktop. Account-specific services require their own credentials and approval. See [setup and troubleshooting](MCP-SKILL-COMPATIBILITY.en.md) / [中文](MCP-SKILL-COMPATIBILITY.zh.md).
